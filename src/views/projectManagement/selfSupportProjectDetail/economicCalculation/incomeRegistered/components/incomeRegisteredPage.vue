<template>
    <d2-container type="fulls">
        <template slot="header">
            <project-info></project-info>
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header-operation___left">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addIncomeRegisteredPage">添加</el-button>
                </span>
                <span class="qqt-container-full-header___search">
                    <el-input
                        placeholder="请输入内容"
                        prefix-icon="el-icon-search"
                        @keyup.enter.native="searchModelSynopsis"
                        v-model="filterText" size="mini">
                    </el-input>
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="searchModelSynopsis">搜索</el-button>
                    <el-button type="info" class="qqt-container-full-header-top___button" @click="resetModelSynopsis">重置</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-date-picker
                        size="mini"
                        v-model="createDate"
                        type="datetimerange"
                        :picker-options="pickerOptions"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['08:00:00', '18:00:00']"
                        @change="searchModelSynopsis()" 
                        align="right">
                    </el-date-picker>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deleteIncomeRegisteredPageList">批量删除</el-button>
                </span>
                <!-- <span class="qqt-container-full-header-operation___right">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="paymentAccountBtn">到账资金认定</el-button>
                </span> -->
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

        <fund-determination :dialogVisible='dialogVisible' :option="fundTableOption" :incomeTitle="incomeTitle" @closeDialog='closeDialog' @getData='getDialogData'></fund-determination>
    </d2-container>
</template>

<script>
    import { getIncomeRegistered, delIncomeRegisteredBach } from '@/api/selfProject/economicCalculation/incomeRegistered'
    import fundDetermination from '../../../../../projectManagement/jontProjectDetail/cashDepositManagement/components/fundDetermination'
    import projectInfo from '../../../components/commenInfo/projectInfo' 
    import { qqtTable } from '@/components/qqt-subassembly'
    import { mapState } from 'vuex'

    import util from '@/libs/util.js'
    export default {
        data () {
            return {
                filterText: '',
                options: [],
                createDate: [],
                tableSelectData: [],
                tableOption: {
                    border: false,
                    isOpenSummary: true 
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
                tableData: {},
                dialogVisible: false,
                fundTableOption: {},
                incomeTitle: true,
                pickerOptions: {
                    shortcuts: [
                        {
                            text: '最近一周',
                            onClick (picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                picker.$emit('pick', [start, end]);
                            }
                        },
                        {
                            text: '最近一个月',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                picker.$emit('pick', [start, end]);
                            }
                        },
                        {
                            text: '最近三个月',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                picker.$emit('pick', [start, end]);
                           }
                        }
                    ]
                },
                rowHeader: [
                    {
                        prop: 'procCode',
                        label: '收入编码',
                        isShow: true,
                        width: '165',
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = true
                                        let addIncome = false
                                        this.routerLink ('收入登记详情', parms.row.id, addIncome ,parms.row.procInstId)
                                    }
                                }
                            }, parms.row.procCode)
                        }
                    },
                    {
                        prop: 'incomeName',
                        label: '收入名称',
                        width: '185',
                        isShow: true
                    },
                    {
                        prop: 'receivableName',
                        label: '应收金额（元）',
                        isShow: true,
                        width: '130',
                        isOpenSummary: true,
                        render: (h, parms) => {
                            return h('span', {
                            }, parms.row.receivableName = Number(parms.row.receivable).toFixed(2))
                        }
                    }, 
                    {
                        prop: 'accountTypeName',
                        width: '130',
                        label: '到账状态',
                        isShow: true,
                        render: (h, parms) => {
                            return h('span', {
                            }, parms.row.accountTypeName = parms.row.accountType == 1 ? '待收' : parms.row.accountType == 2 ? '部分到账' : (parms.row.accountType == 3 ? '已收' : ''))
                        }
                    },
                    {
                        prop: 'moneyAttribute',
                        label: '资金属性',
                        width: '130',
                        isShow: true
                    },
                    {
                        prop: 'belongContractName',
                        label: '合同内/外',
                        isShow: true,
                        render: (h, parms) => {
                            return h('span', {}, parms.row.belongContractName = parms.row.belongContract == "" ?  '无' : parms.row.belongContract == 0 ? '否' : '是' )
                        }
                    },
                    {
                        prop: 'procStateName',
                        label: '办理状态',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {},
                                parms.row.procStateName = util.handleState (parms.row.procState)
                            )
                        }
                    },
                    {
                        prop: 'createName',
                        label: '登记人',
                        isShow: true
                    },
                    {
                        prop: 'createTime',
                        label: '登记时间',
                        isShow: true,
                        width: 160
                    },
                    {
                        prop: '',
                        label: '操作',
                        isShow: true,
                        fixed: 'right',
                        width: '230',
                        render: (h, parms) => {
                            return [
                                h('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    attrs:{ disabled: parms.row.procState == '10' ? false : true },
                                    on:{
                                        click: () => {
                                            this.transform.isShowDetails = false
                                            let addIncome = true
                                            this.routerLink ('到账资金认定', parms.row.id, addIncome, parms.row.procInstId,)
                                        }
                                    }
                                }, parms.row.accountType == 3 ? '查看到账资金' : '到账资金认定' ),
                                h('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    attrs:{ disabled: parms.row.procState ==='1' ? false : true },
                                    on:{
                                        click: () => {
                                            this.transform.isShowDetails = false
                                            this.routerLink ('收入登记编辑', parms.row.id)
                                        }
                                    }
                                }, '编辑'),
                                h('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    attrs:{ disabled: parms.row.procState ==='1' ? false : true },
                                    on:{
                                        click: () => {
                                            this.deleteIncomeRegisteredPageObject (parms.row.id)
                                        }
                                    }
                                }, '删除')
                            ]
                        }
                    }
                ]
            }
        },

        methods: {

            selectChange (item) {
                this.tableSelectData = item
            },

            searchModelSynopsis () {
                this.getIncomeRegisteredPagePage ({
                    'name': this.filterText ? this.filterText : null,
                    'createTime': this.createDate ? this.createDate[0] : null,
                    'updateTime': this.createDate ? this.createDate[1] : null})
            },

            handlePaginationChange (page) {
                this.page = page;
                this.$nextTick(() => {
                    this.searchModelSynopsis ()
                });
            },

            getIncomeRegisteredPagePage (text) {
                getIncomeRegistered ({
                    ...text,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size,
                    'projectCode': this.selfSupportProject.projectCode
                }).then( res => {
                    if (res) this.tableData = res
                })
            },

            deleteIncomeRegisteredPageObject (id) {
                this.deleteIncomeRegisteredPageById ({'ids': id, 'projectCode': this.selfSupportProject.projectCode})
            },

            deleteIncomeRegisteredPageList () {
                if (this.tableSelectData.length === 0) {
                    this.$message.warning ('请选择一条数据')
                    return
                }
                let ids = ''
                if (this.tableSelectData && this.tableSelectData.length > 0) {
                    this.tableSelectData.forEach(res => {
                        ids += res.id + ','
                    })
                }
                this.deleteIncomeRegisteredPageById ({'ids': ids.substring(0, ids.length - 1), 'projectCode': this.selfSupportProject.projectCode})
            },

            deleteIncomeRegisteredPageById (id) {
                util.confirm ().then (boolean => {
                    if (boolean) {
                        delIncomeRegisteredBach (id).then(res => {
                            if (res.code === 200) {
                                this.$message.success(res.message)
                                this.getIncomeRegisteredPagePage ()
                            }
                        })
                    }
                })
            },

            addIncomeRegisteredPage () {
                this.transform.isShowDetails = false
                this.routerLink ('添加收入登记')
            },

            resetModelSynopsis () {
                this.filterText = ''
                this.createDate = []
                this.getIncomeRegisteredPagePage ()
            },
            
            // paymentAccountBtn () {
            //     console.log(this.tableSelectData)
            //     if (this.tableSelectData.length == 0) {
            //         this.$message.warning ('请选择一条数据')
            //         return
            //     }

            //     let boolean = true
            //     this.tableSelectData.forEach( item => {
            //         if (item.procState != '10') this.$message.warning('该数据不支持到账资金登记'), boolean = false
            //     })

            //     if (!boolean) return
            //     this.dialogVisible = true

            // },

            closeDialog () {
                this.dialogVisible = false
            },

            getDialogData (data) {
                this.dialogVisible = false
            },

            exportExcel () {
                this.$refs.table.getExportExcel ()
            },

            printTable () {
                this.$refs.table.printTable (this.tableSelectData)
            },

            routerLink (title, id = '', addIncome, procInstId) {
                this.$router.push ({
                    path: 'addIncomeRegistered',
                    name: 'addIncomeRegistered',
                    params: {
                        relevancyId: id,
                        transform: this.transform,
                        addIncome: addIncome,
                        procInstId: procInstId
                    }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            },
        },

        components: {
            'qqt-table': qqtTable,
            'project-info': projectInfo,
            'fund-determination': fundDetermination
        },

        created () {
            this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad')
        },

        computed: {
            ...mapState ('d2admin/selfSupportProject', [
                'selfSupportProject'
            ])
        },

        watch: {
            selfSupportProject () {
                this.getIncomeRegisteredPagePage ()
            }
        }
    }

</script>
