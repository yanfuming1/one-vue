<template>
    <d2-container type="fulls" class="settle_accounts_record">
        <template slot="header">
            <project-info v-if="identification == '1'"></project-info>
            <project-common v-if="identification == '2'"></project-common>
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header-operation___left" v-if="auth.add">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addSettleAccountsRecord">添加</el-button>
                </span>
                <span class="qqt-container-full-header-operation___left" v-if="auth.add">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="duplicateSettleAccountsRecord">复制</el-button>
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
                <span class="qqt-container-full-header-operation___right" v-if="auth.delBat">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deleteSettleAccountsRecordList">批量删除</el-button>
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
            <div class="settle_accounts_record_table_header">
                <div class="settle_accounts_record_table_header_left">
                    <div>合同名称: <span :title="contract.contractname">{{ contract.contractname }}</span></div>
                    <div>合同编号: <span :title="contract.contractcode">{{ contract.contractcode }}</span></div>
                    <div>合同总金额: <span :title="contract.contractprice">{{ contract.contractpriceStr }}</span></div>
                </div>
                <div class="settle_accounts_record_table_header_right">
                    <div class="settle_accounts_record_table_header_right_longString">
                        <div class="settle_accounts_record_table_header_right_particulars"><span class="left">合同类型:</span><span class="right">{{ contract.contracttype }}</span></div>
                        <div class="settle_accounts_record_table_header_right_particulars"><span class="left">业务分类:</span><span class="right">{{ contract.differserv }}</span></div>
                    </div>
                    <div class="settle_accounts_record_table_header_right_longString">
                        <div class="settle_accounts_record_table_header_right_particulars"><span class="left">合同介质:</span><span class="right">{{ contract.contractmedium }}</span></div>
                        <div class="settle_accounts_record_table_header_right_particulars"><span class="left">签订份数:</span><span class="right">{{ contract.signedcopies }}</span></div>
                    </div>
                    <div class="settle_accounts_record_table_header_right_longString">
                        <div class="settle_accounts_record_table_header_right_particulars"><span class="left">签订地点:</span><span class="right" :title="contract.contractspace">{{ contract.contractspace }}</span></div>
                        <div class="settle_accounts_record_table_header_right_particulars"><span class="left">签订时间:</span><span class="right" :title="contract.signedtime">{{ contract.signedtime }}</span></div>
                    </div>
                </div>
            </div>
            <qqt-table :data="tableData" ref="table" :exportData="tableData.records" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange" />
        </div>
    </d2-container>
</template>

<script>
    import { getSelfSettleAccountsRecordPageList, getSettleAccountsRecordPageList, getJointSettleAccountsRecordPageList,
             deleteBatchSelfSettleAccountsRecord, deleteBatchSettleAccountsRecord, deleteBatchJointSettleAccountsRecord } from '@/api/selfProject/contract/settleAccountsRecord'
    import { getSelfContractConcludeSignById, getContractConcludeSignById, getJointContractConcludeSignById } from '@/api/selfProject/contract/contractConcludeSign'
    import { getByAccountTypeListAll } from '@/api/financialManagement/staffLoan/index'
    import { qqtTable } from '@/components/qqt-subassembly'
    import { mapState } from 'vuex'

    import util from '@/libs/util.js'
    import projectInfo from '../../../components/commenInfo/projectInfo'
    import projectCommon from '../../../../jontProjectDetail/components/projectCommon'
    export default {
        data () {
            return {
                filterText: '',
                projectCode: null,
                identification: '',
                options: [],
                createDate: [],
                tableSelectData: [],
                tableData: {},
                contract: {},
                page: {
                    current: 1,
                    size: 10,
                    total: 0
                },
                transform: {
                    isShowDetails: false
                },
                tableOption: {
                    border: false
                },
                dynamicHeader: {
                    tableId: '',
                    isSave: false
                },
                auth: {
                    add: true,
                    edit: true,
                    delBat: true
                },
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
                nameOptions: [],
                rowHeader: [],
                isIncome: false
            }
        },

        methods: {

            selectChange (item) {
                this.tableSelectData = item
            },

            searchModelSynopsis (boolean = true) {
                if (boolean) this.resetPage ()
                this.getSettleAccountsRecordPage ({
                    'keywords': this.filterText ? this.filterText : null,
                    'time': this.createDate && this.createDate.length > 0 ? `${this.createDate[0]},${this.createDate[1]}` : null})
            },

            handlePaginationChange (page) {
                this.page = page;
                this.$nextTick(() => {
                    this.searchModelSynopsis (false)
                });
            },

            getSettleAccountsRecordPage (text) {
                let url = ''
                switch (this.identification) {
                    case '1':
                        url = getSelfSettleAccountsRecordPageList
                        break
                    case '2':
                        url = getJointSettleAccountsRecordPageList
                        break
                    default:
                        url = getSettleAccountsRecordPageList
                        break
                }
                url ({
                    ...text,
                    'contractid': this.$route.params.contractId,
                    'projectCode': this.projectCode,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size
                }).then( res => {
                    if (res) this.tableData = res
                })
            },

            deleteSettleAccountsRecordObject (id) {
                this.deleteSettleAccountsRecordById ({'ids': id})
            },

            deleteSettleAccountsRecordList () {
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
                this.deleteSettleAccountsRecordById ({'ids': ids.substring(0, ids.length - 1)})
            },

            deleteSettleAccountsRecordById (id) {
                util.confirm ().then (boolean => {
                    if (boolean) {
                        let url = ''
                        switch (this.identification) {
                            case '1':
                                url = deleteBatchSelfSettleAccountsRecord
                                break
                            case '2':
                                url = deleteBatchJointSettleAccountsRecord
                                break
                            default:
                                url = deleteBatchSettleAccountsRecord
                                break
                        }
                        url (id).then(res => {
                            if (res.code === 200) {
                                this.$message.success(res.message)
                                this.getSettleAccountsRecordPage ()
                            }
                        })
                    }
                })
            },

            getContractConcludeSign (id) {
                let url = ''
                switch (this.identification) {
                    case '1':
                        url = getSelfContractConcludeSignById
                        break
                    case '2':
                        url = getJointContractConcludeSignById
                        break
                    default:
                        url = getContractConcludeSignById
                        break
                }
                url ({'id': id}).then (res => {
                    if (res.managerCreate) {
                        res.managerCreate['contractpriceStr'] = res.managerCreate.contractprice ? util.moneyTransform (res.managerCreate.contractprice) : '0'
                        res.managerCreate['contractid'] = id
                        this.contract = res.managerCreate
                    }
                })
            },

            getNameOptions () {
                getByAccountTypeListAll({accountType: '9'}).then(res => {
                    this.nameOptions = res
                })
            },

            duplicateSettleAccountsRecord () {
                if (this.tableSelectData.length != 1) {
                    this.$message.warning ('请选择一条数据')
                    return
                }

                this.routerLink ('添加合同结算', this.tableSelectData[0].id, true)
            },

            addSettleAccountsRecord () {
                this.transform.isShowDetails = false
                this.routerLink ('添加合同结算')
            },

            resetModelSynopsis () {
                this.filterText = ''
                this.createDate = []
                this.resetPage ()
                this.getSettleAccountsRecordPage ()
            },

            exportExcel () {
                this.$refs.table.getExportExcel ()
            },

            printTable () {
                this.$refs.table.printTable (this.tableSelectData)
            },

            resetPage () {
                this.page = {
                    current: 1,
                    size: 10,
                    total: 0
                }
            },

            updataCompanyAccountName (id) {
                if (id == '') return
                let str = '', item = {}
                item = this.nameOptions.find (res => id == res.id)
                if (item) { str = item.name}
                return str
            },
            // isDuplicate => 是否是复制
            // procInstId => 要编辑的id
            routerLink (title, id = '', isDuplicate = false, procInstId, procState) {
                let route = '', returnPath = ''
                switch (this.identification) {
                    case '1':
                        route = 'addSelfProjectContractSettleAccounts'
                        returnPath = 'selfProjectSettleAccountsRecord'
                        break
                    case '2':
                        route = 'addJointProjectContractSettleAccounts'
                        returnPath = 'jointProjectSettleAccountsRecord'
                        break
                    default:
                        route = 'addContractSettleAccounts'
                        returnPath = 'settleAccountsRecord'
                        break
                }
                this.$router.push ({ path: route, name: route, params: {
                                                                    relevancyId: id,
                                                                    transform: this.transform,
                                                                    isIncome: this.isIncome,
                                                                    contract: this.contract,
                                                                    isDuplicate: isDuplicate,
                                                                    procInstId: procInstId,
                                                                    procState: procState,
                                                                    identification: this.identification,
                                                                    path: returnPath,
                                                                }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            },

            updataRowHeader () {
                this.rowHeader = [
                    {
                        prop: 'thispriceNum',
                        label: '收到金额(元)',
                        isShow: this.isIncome,
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = true
                                        this.routerLink ('收入合同详情', parms.row.id, false, parms.row.procInstId, parms.row.procState)
                                    }
                                }
                            }, parms.row.thispriceNum = Number (parms.row.thisprice).toFixed (2))
                        }
                    },
                    {
                        prop: 'thispaypriceNum',
                        label: '支付金额(元)',
                        isShow: !this.isIncome,
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = true
                                        this.routerLink ('支出合同详情', parms.row.id, false, parms.row.procInstId, parms.row.procState)
                                    }
                                }
                            }, parms.row.thispaypriceNum = Number (parms.row.thispayprice).toFixed (2))
                        }
                    },
                    {
                        prop: 'rectime',
                        label: '收到时间',
                        isShow: this.isIncome
                    },
                    {
                        prop: 'paytime',
                        label: '支付时间',
                        isShow: !this.isIncome
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
                        prop: 'nominee',
                        label: '待办人',
                        isShow: true,
                        render: (h, parms) => {
                            return h('span', {}, parms.row.nominee ? parms.row.nominee : '无' )
                        }
                    },
                    {
                        prop: 'createName',
                        label: this.isIncome ? '登记人' : '申请人',
                        isShow: true
                    },
                    {
                        prop: 'createTime',
                        label: this.isIncome ? '登记时间' : '申请时间',
                        isShow: true
                    },
                    {
                        prop: 'recname',
                        label: '公司收款账户',
                        isShow: this.isIncome,
                        render: (h, parms) => {
                            return h('div', {},
                                parms.row.recnameStr = this.updataCompanyAccountName (parms.row.recname)
                            )
                        }
                    },
                    {
                        prop: 'recname',
                        label: '收款人账户',
                        isShow: !this.isIncome
                    },
                    {
                        prop: 'recbank',
                        label: '开户行',
                        isShow: true,
                    },
                    {
                        prop: 'recnum',
                        label: '账号',
                        isShow: true,
                    },
                    {
                        prop: 'payname',
                        label: '对方付款账户',
                        isShow: this.isIncome,
                    },
                    {
                        prop: 'paynameStr',
                        label: '公司付款账户',
                        isShow: !this.isIncome,
                        render: (h, parms) => {
                            return h('div', {},
                                parms.row.paynameStr = this.updataCompanyAccountName (parms.row.payname)
                            )
                        }
                    },
                    {
                        prop: 'paybank',
                        label: '开户行',
                        isShow: true,
                    },
                    {
                        prop: 'paynum',
                        label: '账号',
                        isShow: true,
                    },
                    {
                        prop: '',
                        label: '操作',
                        isShow: true,
                        fixed: 'right',
                        width: '150',
                        render: (h, parms) => {
                            return [
                                this.auth.edit ? h ('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    attrs: {
                                        disabled: util.isDisabled (parms.row.procState)
                                    },
                                    on:{
                                        click: () => {
                                            this.transform.isShowDetails = false
                                            this.routerLink ('合同结算编辑', parms.row.id, false, parms.row.procInstId)
                                        }
                                    }
                                }, '编辑') : '',
                                this.auth.delBat ? h ('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    attrs: {
                                        disabled: util.isDisabled (parms.row.procState)
                                    },
                                    on:{
                                        click: () => {
                                            this.deleteSettleAccountsRecordObject (parms.row.id)
                                        }
                                    }
                                }, '删除') : ''
                            ]
                        }
                    }
                ]
            },

            updataRouter () {
                if (this.$route.params) {
                    this.isIncome = this.$route.params.isIncome
                }
                if (this.$route.params && this.$route.params.contractId) {
                    this.getContractConcludeSign (this.$route.params.contractId)
                }
            },

            // 验证权限
            _validationAuth () {
                switch (this.identification) {
                    case '1':
                        this.auth.add        =         this.$has ('self:contractSettle:add')
                        this.auth.edit       =        this.$has ('self:contractSettle:edit')
                        this.auth.delBat     =      this.$has ('self:contractSettle:delete')
                        break
                    case '2':
                        this.auth.add        =         this.$has ('joint:contractSettle:add')
                        this.auth.edit       =        this.$has ('joint:contractSettle:edit')
                        this.auth.delBat     =      this.$has ('joint:contractSettle:delete')
                        break
                    default:
                        this.auth.add        =       this.$has ('bargain:contractSettle:add')
                        this.auth.edit       =      this.$has ('bargain:contractSettle:edit')
                        this.auth.delBat     =    this.$has ('bargain:contractSettle:delete')
                        break
                }
            },

            decideLoadDataWay () {
                this.identification = this.$route.params.identification
                switch (this.identification) {
                    case '1':
                        this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad')
                        break
                    case '2':
                        this.$store.dispatch('d2admin/db/database', {user: true}).then (db => {
                            this.projectCode = db.get('proCode').value()
                            this.getSettleAccountsRecordPage ()
                        })
                        break
                    default:
                        this.getSettleAccountsRecordPage ()
                        break
                }
            }
        },

        components: {
            'qqt-table': qqtTable,
            'project-info': projectInfo,
            'project-common': projectCommon
        },

        created () {
            this.updataRouter ()
            this.getNameOptions ()
            this.updataRowHeader ()
            this.decideLoadDataWay ()
            this._validationAuth ()
        },

        computed: {
            ...mapState ('d2admin/selfSupportProject', [
                'selfSupportProject'
            ])
        },

        watch: {
            selfSupportProject () {
                this.projectCode = this.selfSupportProject.projectCode
                this.getSettleAccountsRecordPage ()
            },
            $route (val) {
                if (val.path.indexOf('settleAccountsRecord') !== -1 || val.path.indexOf('projectSettleAccountsRecord') !== -1) {
                    this.decideLoadDataWay ()
                    this._validationAuth ()
                }
            }
        }
    }

</script>
<style lang="scss">
    .settle_accounts_record {
        .settle_accounts_record_table_header {
            height: 65px;
            color: $color-top-text-title;
            border-bottom: 1px solid;
            background: $color-head-bg;
            .settle_accounts_record_table_header_left {
                float: left;
                width: 70%;
                height: 65px;
                div {
                    font-size: 16px;
                    line-height: 65px;
                    padding: 0 25px;
                    font-weight: 600;
                    overflow:hidden;
                    text-overflow:ellipsis;
                    white-space:nowrap;
                    display: inline-block;
                    width: 33%;
                }
            }
            .settle_accounts_record_table_header_right {
                float: right;
                color: $color-primary;
                width: 30%;
                .settle_accounts_record_table_header_right_longString {
                    display: inline-block;
                    border-left: 1px solid $color-straight-line2;
                    padding: 0 15px;
                    width: 33%;
                    .settle_accounts_record_table_header_right_particulars {
                        font-size: 14px;
                        padding: 6px 0;
                        height: 31px;
                        .left {
                            float: left;
                            width: 50%;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        .right {
                            color: $color-text-sub;
                            float: right;
                            width: 50%;
                            text-align: right;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                }
            }
        }
    }
</style>