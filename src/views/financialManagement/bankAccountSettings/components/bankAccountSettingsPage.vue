<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header-operation___left" v-if="this.identification == '1' ? false : true && $has (`sys:bankAccount:add${identification}`)">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addAndEditBtn('')">添加</el-button>
                </span>
                <span class="qqt-container-full-header___search">
                    <el-input
                        placeholder="请输入内容"
                        prefix-icon="el-icon-search"
                        @keyup.enter.native="searchModelSynopsis"
                        v-model="form.filterText" size="mini">
                    </el-input>
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="searchModelSynopsis">搜索</el-button>
                    <el-button type="info" class="qqt-container-full-header-top___button" @click="resetModelSynopsis">重置</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-date-picker
                        size="mini"
                        v-model="dateTime"
                        style="width:350px"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        @change="dateChange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :default-time="['08:00:00', '18:00:00']"
                        end-placeholder="结束日期"> 
                    </el-date-picker>
                </span>
                <span class="qqt-container-full-header-operation___right" v-if="$has (`sys:bankAccount:del${identification}`)">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="delBankAccountBash">批量删除</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                        <el-button size="mini" @click="exportExcel" icon="el-icon-upload2">导出</el-button>
                        <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                    </el-button-group>
                </span>
            </div>
        </template>
        <div class="qqt-container-full___center">
            <qqt-table :data="tableData" ref="table" :exportData="tableData.records" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange" />
        </div>
        <add-bank-account-form 
            :dialogTitle="dialogTitle"
            v-if="dialogVisible"
            :dialogVisible="dialogVisible"
            :data="values"
            :identification="identification"
            @change="updataDialogVisible"
            :transform="transform"
            @saveBankAccountForm="saveBankAccountForm"/>
    </d2-container>
</template>

<script>
    import { mapState } from 'vuex'
    import util from '@/libs/util.js'
    import { CompanyEmployeeAccount, getCompanyEmployeeAccountById, CompanyEmployeeAccountDeleteAll, addCompanyEmployeeAccount, editAccountData } 
        from "../../../../api/system/bankAccountSettings/CompanyEmployeeAccount";
    import bottomInformation from '../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
    import { qqtTable } from '@/components/qqt-subassembly'
    import addBankAccountForm from './addBankAccountForm'
    export default {
        data () {
            return {
                identification: '',
                options: [],
                tableSelectData: [],
                tableOption: {
                    border: false
                },
                transform: {
                    isShowDetails: false
                },
                dynamicHeader: {
                    tableId: '',
                    isSave: false
                },
                page: {
                    current: 1,
                    size: 10,
                    total: 0
                },
                form: {
                    filterText: '',
                    bstatus: '',
                },
                dialogTitle: '',
                dialogVisible: false,
                values: {
                    accountType: ''
                },
                dateTime: [],
                tableData: {},
                rowHeader: [
                    {
                        prop: "name",
                        label: "户名",
                        isShow: true,
                        render: (h, params) => {
                            return h('div',{
                                on: {
                                    click: () => {
                                        this.transform.isShowDetails = true
                                        this.getCompanyEmployeeAccountByIdEvent (params.row.id)
                                    } 
                                }
                            }, [
                            h ('div', {
                                class :{
                                    'typefaceColor' : true,
                                    }
                                },params.row.name)
                            ])
                        }
                    },
                    {
                        prop: "openingBank",
                        label: "开户行",
                        isShow: true
                    },
                    {
                        prop: "account",
                        label: "账号",
                        isShow: true
                    },
                    {
                        prop: "onlyCoding",
                        label: "行号",
                        isShow: true
                    },
                    {
                        prop: "createBy",
                        label: "设置人",
                        isShow: true
                    },
                    {
                        prop: "createTime",
                        label: "设置时间",
                        isShow: true
                    },
                    {
                        prop: "",
                        label: "操作",
                        isShow: true,
                        fixed: 'right',
                        width: '150',
                        render:(h, params) => {
                            return [
                                this.$has (`sys:bankAccount:edit${this.identification}`) ? h("el-button",{
                                    props: {
                                        type: "text"
                                    },
                                    on: {
                                        click: () => {
                                            this.addAndEditBtn (params.row.id)
                                        }
                                    }
                                },"编辑") : '',
                                this.$has (`sys:bankAccount:del${this.identification}`) ? h("el-button",{
                                    props: {
                                        type: "text"
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteBankAccountById ({'ids': params.row.id})
                                        }
                                    }
                                },"删除") : '',
                            ];
                        },
                    },
                ],
            }
        },

        methods: {

            selectChange (item) {
                this.tableSelectData = item
            },

            searchModelSynopsis () {
                this.page.current = '1'
                this.page.size = '10'
                this.getAccessBankAccountData ({
                    'name': this.form.filterText ? this.form.filterText : null
                })
            },

            dateChange (time) {
                this.getAccessBankAccountData()
            },

            handlePaginationChange (page) {
                this.page = page;
                // this.$nextTick(() => {
                    this.getAccessBankAccountData ('')
                // });
            },

            getAccessBankAccountData (text) {
                CompanyEmployeeAccount ({
                    name: this.form.filterText,
                    accountType: this.identification,
                    pageNo: this.page.current,
                    pageSize: this.page.size,
                    time: this.dateTime.length>0 ? this.dateTime[0] + ',' + this.dateTime[1] : ''
                }).then( res => {
                    if (res) this.tableData = res
                    res.records.forEach(item => {
                        switch(item.onlyCoding) {
                        case '': item.onlyCoding = '无'
                            break
                        case null: item.onlyCoding = '无'
                            break
                        }
                    })
                })
            },

            delBankAccountBash () {
                if ( this.tableSelectData.length === 0) {
                this.$message.warning('请至少选择一条数据')
                    return
                }
                let ids = ''
                if (this.tableSelectData && this.tableSelectData.length > 0 ) {
                    this.tableSelectData.forEach( res => {
                        ids += res.id + ','
                    })
                }
                this.deleteBankAccountById ({ 'ids': ids.substring(0, ids.length - 1)})
            },

            deleteBankAccountById (id) {
                util.confirm ().then (boolean => {
                    if (boolean) {
                        CompanyEmployeeAccountDeleteAll (id).then(res => {
                            if (res.code === 200) {
                                this.$message.success(res.message)
                                this.getAccessBankAccountData ()
                            }
                        })
                    }
                })
            },

            addAndEditBtn (id) {
                this.showName ()
                this.transform.isShowDetails = false
                id == '' ? this.dialogTitle = '添加' + this.titleName : this.dialogTitle = '编辑' + this.titleName
                if (id !== '') {
                    this.getCompanyEmployeeAccountByIdEvent (id)
                } else {
                    this.values = {}
                    this.values.accountType = this.titleName
                    this.dialogVisible = true
                }
            },

            showName () {
                let titleName = ''
                switch (this.identification) {
                    case '1':
                        this.titleName = '公司员工账户'
                    break
                    case '2':
                        this.titleName = '联营人账户'
                    break
                    case '3':
                        this.titleName = '公共资源交易中心账户'
                    break
                    case '4':
                        this.titleName = '物资设备供应商账户'
                    break
                    case '5':
                        this.titleName = '业主付款账户'
                    break
                    case '7':
                        this.titleName = '劳务分包商账户'
                    break
                    case '8':
                        this.dialogTitle = '其他账户'
                    break
                    case '9':
                        this.titleName = '公司账户'
                    break
                }
            },

            getCompanyEmployeeAccountByIdEvent (id) {
                getCompanyEmployeeAccountById ({
                    'id': id
                }).then( res => {
                    this.values = res
                    if (this.identification == res.accountType) {
                        this.values.accountType = this.titleName
                    }
                    this.dialogVisible = true
                })
            },

            saveBankAccountForm (data) {
                let url = ''
                if (data) {
                    Object.assign (this.values, data)
                    this.values.id == null ? url = addCompanyEmployeeAccount : url = editAccountData
                    this.values.accountType = this.identification
                    url (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success ('保存成功')
                            this.getAccessBankAccountData ()
                            this.dialogVisible = false
                        }
                    })
                }
            },

            updataDialogVisible () {
                this.dialogVisible = false
                this.getAccessBankAccountData ()
            },

            resetModelSynopsis () {
                this.form.filterText = ''
                this.page.current = '1'
                this.page.size = '10'
                this.dateTime = []
                this.getAccessBankAccountData ()
            },

            exportExcel () {
                this.$refs.table.getExportExcel ()
            },

            printTable () {
                this.$refs.table.printTable (this.tableSelectData)
            },
        },

        components: {
            'qqt-table': qqtTable,
            'add-bank-account-form': addBankAccountForm,
            'bottom-information': bottomInformation,
        },

        created () {
            this.identification = this.$route.params.identification
            this.showName ()
            this.getAccessBankAccountData ()
        },
        
        watch: {
            $route (val) {
                this.identification = this.$route.params.identification
                this.getAccessBankAccountData ()
                this.showName ()
            }
        }
    }

</script>
