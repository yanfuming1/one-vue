<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <determine-project v-if="identification == '2'" title='合同结算' :proId="projectId"></determine-project>
                <project-info v-if="identification == '1'"></project-info>
                <project-common v-if="identification == '2'"></project-common>
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
                    <el-button-group>
                        <el-button size="mini" @click="exportExcel" icon="el-icon-upload2">导出</el-button>
                        <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                    </el-button-group>
                </span>
            </div>
        </template>
        <div class="qqt-container-full___center">
            <qqt-table :data="tableData" ref="table" :exportData="tableData.records" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" :option="tableOption"  @selectionChange="selectChange" @page="handlePaginationChange" />
        </div>
    </d2-container>
</template>

<script>
    import { getSelfContractInvoicePageList, getContractInvoicePageList, getJointContractInvoicePageList } from '@/api/selfProject/contract/contractConcludeSign'
    import { qqtTable } from '@/components/qqt-subassembly'
    import { mapState } from 'vuex'

    import util from '@/libs/util.js'
    import projectInfo from '../../../components/commenInfo/projectInfo'
    import projectCommon from '../../../../jontProjectDetail/components/projectCommon'
    import determineProject from '../../../../jontProjectDetail/components/determineProject'
    export default {
        data () {
            return {
                filterText: '',
                projectId: '',
                projectCode: null,
                identification: '',
                options: [],
                createDate: [],
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
                auth: {
                    contractType: true,
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
                rowHeader: [
                    {
                        prop: 'contractcode',
                        label: '合同编号',
                        isShow: true
                    },
                    {
                        prop: 'contractname',
                        label: '合同名称',
                        isShow: true
                    },
                    {
                        prop: 'projectName',
                        label: '关联项目',
                        isShow: true
                    },
                    {
                        prop: 'contracttype',
                        label: '合同类型',
                        isShow: true
                    },
                    {
                        prop: 'differserv',
                        label: '业务分类',
                        isShow: true
                    },
                    {
                        prop: 'contractpriceStr',
                        label: '合同总金额(元)',
                        isShow: true,
                        render: (h, parms) => {
                            return h ('span', {}, parms.row.contractpriceStr = util.moneyTransform (parms.row.contractprice))
                        }
                    },
                    {
                        prop: 'cumulsettleStr',
                        label: '累计结算金额(元)',
                        isShow: true,
                        render: (h, parms) => {
                            return h ('span', {}, parms.row.cumulsettleStr = util.moneyTransform (parms.row.cumulsettle))
                        }
                    },
                    {
                        prop: 'cumulrecStr',
                        label: '累计收到金额(元)',
                        isShow: true,
                        render: (h, parms) => {
                            return h ('span', {}, parms.row.cumulrecStr = util.moneyTransform (parms.row.cumulrec))
                        }
                    },
                    {
                        prop: 'cumulpayStr',
                        label: '累计支付金额(元)',
                        isShow: true,
                        render: (h, parms) => {
                            return h ('span', {}, parms.row.cumulpayStr = util.moneyTransform (parms.row.cumulpay))
                        }
                    },
                    {
                        prop: 'createName',
                        label: '登记人',
                        isShow: true,
                    },
                    {
                        prop: 'createTime',
                        label: '登记时间',
                        isShow: true,
                    },
                    {
                        prop: '',
                        label: '操作',
                        isShow: true,
                        fixed: 'right',
                        width: '100',
                        render: (h, parms) => {
                            return [
                                this.auth.contractType ? h ('el-button', {
                                    props:{
                                        type: 'warning',
                                        size: 'mini',
                                        round: true
                                    },
                                    style: {
                                        padding: '5px 10px'
                                    },
                                    on:{
                                        click: () => {
                                            this.transform.isShowDetails = false
                                            this.routerLink (parms.row.contracttype.includes ('收入合同') ? '合同收款记录列表' : '合同支付记录列表', parms.row.id, parms.row.contracttype.includes ('收入合同'))
                                        }
                                    }
                                }, parms.row.contracttype.includes ('收入合同') ? '收款记录' : '支付记录') : ''
                            ]
                        }
                    }
                ],
                tableSelectData: []
            }
        },

        methods: {

            selectChange (item) {
                this.tableSelectData = item
            },

            searchModelSynopsis (boolean = true) {
                if (boolean) this.resetPage ()
                this.getContractSettleAccountsPage ({
                    'keywords': this.filterText ? this.filterText : null,
                    'time': this.createDate && this.createDate.length > 0 ? `${this.createDate[0]},${this.createDate[1]}` : null})
            },

            handlePaginationChange (page) {
                this.page = page;
                this.$nextTick(() => {
                    this.searchModelSynopsis (false)
                });
            },

            getContractSettleAccountsPage (text) {
                let url = ''
                switch (this.identification) {
                    case '1':
                        url = getSelfContractInvoicePageList
                        break
                    case '2':
                        url = getJointContractInvoicePageList
                        break
                    default:
                        url = getContractInvoicePageList
                        break
                }
                url ({
                    ...text,
                    'projectCode': this.projectCode,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size
                }).then( res => {
                    if (res) this.tableData = res
                })
            },

            resetModelSynopsis () {
                this.filterText = ''
                this.createDate = []
                this.resetPage ()
                this.getContractSettleAccountsPage ()
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

            routerLink (title, id, boolean) {
                let route = '', returnPath = ''
                switch (this.identification) {
                    case '1':
                        route = 'selfProjectSettleAccountsRecord'
                        returnPath = 'projectSettleAccountsRecord/selfSupportProject/1'
                        break
                    case '2':
                        route = 'jointProjectSettleAccountsRecord'
                        returnPath = 'projectSettleAccountsRecord/jointProject/2'
                        break
                    default:
                        route = 'settleAccountsRecord'
                        returnPath = 'projectSettleAccountsRecord'
                        break
                }
                this.$router.push ({ path: route, name: route, params: {
                                                                    contractId: id,
                                                                    isIncome: boolean,
                                                                    identification: this.identification,
                                                                    path: returnPath
                                                                }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            },

            // 验证权限
            _validationAuth () {
                switch (this.identification) {
                    case '1':
                        this.auth.contractType =    this.$has ('self:contractSettle:contractType')
                        break
                    case '2':
                        this.auth.contractType =    this.$has ('joint:contractSettle:contractType')
                        break
                    default:
                        this.auth.contractType = this.$has ('bargain:contractSettle:contractType')
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
                            this.projectId = db.get('proID').value()
                            this.getContractSettleAccountsPage ()
                        })
                        break
                    default:
                        this.getContractSettleAccountsPage ()
                        break
                }
            }
        },

        components: {
            'qqt-table': qqtTable,
            'project-info': projectInfo,
            'project-common': projectCommon,
            'determine-project': determineProject
        },

        created () {
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
                this.getContractSettleAccountsPage ()
            },
            $route (val) {
                if (val.path.indexOf('contractSettleAccounts') !== -1) {
                    this.decideLoadDataWay ()
                    this._validationAuth ()
                }
            }
        }
    }

</script>
