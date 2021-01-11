<template>
    <d2-container type="fulls" class="pay-return-deposit">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <project-info></project-info>
                <span class="qqt-container-full-header-operation___left" v-if="activeName == 'first'">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addPayReturnDeposit">添加</el-button>
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
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deletePayReturnDepositList">批量删除</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                        <el-button size="mini" @click="exportExcel" icon="el-icon-upload2">导出</el-button>
                        <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                    </el-button-group>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                        <el-button size="mini" icon="el-icon-check" @click="checkAgainstPaymentDepositData ('1')">审核</el-button>
                        <el-button size="mini" icon="el-icon-close" @click="checkAgainstPaymentDepositData ('0')">反审核</el-button>
                    </el-button-group>
                </span>
            </div>
        </template>
        <div class="qqt-container-full___center">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="保证金缴纳" name="first"></el-tab-pane>
                <el-tab-pane label="保证金退还" name="second"></el-tab-pane>
            </el-tabs>
            <qqt-table :data="tableData" ref="table" :exportData="tableData.records" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange" />
        </div>
    </d2-container>
</template>

<script>
    import { getPaymentDepositPageList, deleteBatchPaymentDeposit,
             getReturnDepositPageList, deleteBatchReturnDeposit,
             checkAgainstPaymentDeposit, checkAgainstReturnDeposit } from '@/api/selfProject/payReturnDeposit'
    import { qqtTable } from '@/components/qqt-subassembly'
    import { mapState } from 'vuex'

    import projectInfo from '../../components/commenInfo/projectInfo'
    import util from '@/libs/util.js'
    export default {
        data () {
            return {
                filterText: '',
                options: [],
                createDate: [],
                activeName: 'first',
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
                rowHeader: []
            }
        },

        methods: {

            handleClick (name) {
                this.isShwoHeader ()
                this.getPayReturnDepositPage ()
            },

            selectChange (item) {
                this.tableSelectData = item
            },

            searchModelSynopsis (boolean = true) {
                if (boolean) this.resetPage ()
                this.getPayReturnDepositPage ({
                    'name': this.filterText ? this.filterText : null,
                    'createTime': this.createDate ? this.createDate[0] : null,
                    'updateTime': this.createDate ? this.createDate[1] : null})
            },

            handlePaginationChange (page) {
                this.page = page;
                this.$nextTick(() => {
                    this.searchModelSynopsis (false)
                });
            },

            getPayReturnDepositPage (text) {
                let url
                    = this.activeName == 'first'
                    ? getPaymentDepositPageList
                    : getReturnDepositPageList
                url ({
                    ...text,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size
                }).then( res => {
                    if (res) this.tableData = res
                })
            },

            deletePayReturnDepositObject (id) {
                this.deletePayReturnDepositById ({'ids': id})
            },

            deletePayReturnDepositList () {
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
                this.deletePayReturnDepositById ({'ids': ids.substring(0, ids.length - 1)})
            },

            deletePayReturnDepositById (id) {
                util.confirm ().then (boolean => {
                    if (boolean) {
                        let url
                            = this.activeName == 'first'
                            ? deleteBatchPaymentDeposit
                            : deleteBatchReturnDeposit
                        url (id).then(res => {
                            if (res.code === 200) {
                                this.$message.success(res.message)
                                this.getPayReturnDepositPage ()
                            }
                        })
                    }
                })
            },

            checkPrintsPaymentDeposit (data, type) {
                let url
                    = this.activeName == 'first'
                    ? checkAgainstPaymentDeposit
                    : checkAgainstReturnDeposit
                url ({'id': data.id, 'type': type}).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.getPaymentDepositPageLists ()
                    }
                })
            },

            checkAgainstPaymentDepositData (type) {
                if (this.selectTableData.length !== 1) {
                    this.$message.warning ('请选择一条数据')
                    return
                }
                switch (type) {
                    case '1':
                        if (this.selectTableData[0]['state'] === '0') {
                            this.checkPrintsPaymentDeposit (this.selectTableData[0], type)
                        } else {
                            this.$message.warning ('数据已审核')
                        }
                        break;
                    case '0':
                        if (this.selectTableData[0]['state'] === '1') {
                            this.checkPrintsPaymentDeposit (this.selectTableData[0], type)
                        } else {
                            this.$message.warning ('数据未审核')
                        }
                        break;
                }
            },

            addPayReturnDeposit () {
                this.transform.isShowDetails = false
                this.routerLink ('添加保证金缴纳')
            },

            resetModelSynopsis () {
                this.filterText = ''
                this.createDate = []
                this.getPayReturnDepositPage ()
            },

            resetPage () {
                this.page = {
                    current: 1,
                    size: 10,
                    total: 0
                }
            },

            exportExcel () {
                this.$refs.table.getExportExcel ()
            },

            printTable () {
                this.refs.table.printTable (this.tableSelectData)
            },

            routerLink (title, id = '') {
                this.$router.push ({
                    path: this.activeName == 'first' ? 'addPaymentDeposit' : 'addReturnDeposit',
                    name: this.activeName == 'first' ? 'addPaymentDeposit' : 'addReturnDeposit',
                    params: {
                        relevancyId: id,
                        transform: this.transform,
                        
                    }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            },

            isShwoHeader () {
                this.rowHeader = [
                    {
                        prop: 'marginCode',
                        label: '保证金编码',
                        isShow: true,
                    },{
                        prop: 'marginType',
                        label: '保证金类型',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on: {
                                    click: () => {
                                        this.transform.isShowDetails = true
                                        this.routerLink (`保证金${this.activeName == 'first' ? '缴纳' : '退还'}详情`, parms.row.id)
                                    }
                                }
                            }, parms.row.marginType)
                        }
                    },{
                        prop: 'premiumReceived',
                        label: '缴纳金额',
                        isShow: this.activeName == 'first',
                        isMoney: true,
                        isOpenSummary: true
                    },{
                        prop: 'surrenderValue',
                        label: '退还金额',
                        isShow: this.activeName != 'first',
                        isMoney: true,
                    },{
                        prop: 'collectUnitAccount',
                        label: '收取单位户名',
                        isShow: this.activeName == 'first',
                    },{
                        prop: 'retreatUnitAccount',
                        label: '退还单位',
                        isShow: this.activeName != 'first',
                    },{
                        prop: 'returnTheTime',
                        label: '退还时间',
                        isShow: this.activeName != 'first',
                    },{
                        prop: 'procStateName',
                        label: '办理状态',
                        isShow: true,
                        render: (h, parms) => {
                            return h('span', {}, parms.row.procStateName = util.handleState(parms.row.procState))
                        }
                    },{
                        prop: 'agent',
                        label: '待办人',
                        isShow: true,
                        render: (h, parms) => {
                            return h('span', {}, parms.row.agent === '' ? '无' : parms.row.agent)
                        }
                    },{
                        prop: 'stateName',
                        label: '审核状态',
                        isShow: true,
                        render: (h, parms) => {
                            return h('span', {}, parms.row.stateName = parms.row.state === '1' ? '已审核' : '未审核')
                        }
                    },{
                        prop: 'marginStateName',
                        label: '保证金状态',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {
                                style: {
                                    color: parms.row.marginState === "0" ? 'red' : '#999'
                                }
                            }, parms.row.marginStateName = parms.row.marginState === "0" ? '未退回' : '已退回')
                        }
                    },{
                        prop: 'createName',
                        label: '申请人',
                        isShow: true,
                    },{
                        prop: 'createTime',
                        label: '申请时间',
                        isShow: true,
                    },{
                        prop: '',
                        label: '操作',
                        isShow: true,
                        fixed: 'right',
                        width: '130',
                        render: (h, parms) => {
                            return [
                                this.activeName == 'first' ? h ('el-button', {
                                    attrs: { type: 'text', disabled: parms.row.procState === '10' && parms.row.marginState === "0" ? false : true },
                                    on: {
                                        click: () => {
                                            this.transform.isShowDetails = false
                                            this.routerLink (`添加保证金退还`, parms.row.id)
                                        }
                                    }
                                }, '退还') : '',
                                h ('el-button', {
                                    attrs: { type: 'text', disabled: parms.row.procState === "1" ? false : true },
                                    on: {
                                        click: () => {
                                            this.transform.isShowDetails = false
                                            this.routerLink (`保证金${this.activeName == 'first' ? '缴纳' : '退还'}编辑`, parms.row.id)
                                        }
                                    }
                                }, '编辑')
                            ]
                        }
                    },
                ]
            }
        },

        components: {
            'project-info': projectInfo,
            'qqt-table': qqtTable,
        },

        created () {
            if (this.$route.params) this.activeName = this.$route.params.identifying || 'first'
            this.isShwoHeader ()
            this.getPayReturnDepositPage ()
        }
    }

</script>
<style lang="scss">
    .pay-return-deposit {
        .el-tabs__header {
            margin: 0 0 0 50px !important;
        }
        .el-tabs__nav {
            height: 50px;
            line-height: 50px;
        }
    }
</style>