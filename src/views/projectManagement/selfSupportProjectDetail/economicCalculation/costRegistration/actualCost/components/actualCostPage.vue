<template>
    <d2-container type="fulls">
        <template slot="header">
            <project-info></project-info>
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header-operation___left">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addActualCost">添加</el-button>
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
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="">批量支付</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="">批量报销</el-button>
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
    </d2-container>
</template>

<script>
    import { getCostRegistrationPage, deleteBatchCostRegistration } from '@/api/selfProject/economicCalculation/costRegistration/actualCost'
    import { qqtTable } from '@/components/qqt-subassembly'
    import { mapState } from 'vuex'
    import projectInfo from '../../../../components/commenInfo/projectInfo' 

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
                    height: 700
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
                rowHeader: [
                    {
                        prop: 'costnum',
                        label: '成本编号',
                        isShow: true,
                        width: 170,
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = true
                                        this.routerLink ('成本事项详情', parms.row.id, parms.row.procInstId)
                                    }
                                }
                            }, parms.row.costnum)
                        }
                    },
                    {
                        prop: 'costItem',
                        label: '成本事项',
                        isShow: true,
                        width: 130,
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = true
                                        this.routerLink ('成本事项详情', parms.row.id, parms.row.procInstId)
                                    }
                                }
                            }, parms.row.costItem)
                        }
                    },
                    {
                        prop: 'costName',
                        label: '成本名称',
                        isShow: true,
                        width: 130
                    },
                    {
                        prop: 'unit',
                        label: '单位',
                        isShow: true
                    },
                    {
                        prop: 'num',
                        label: '数量',
                        isShow: true
                    },
                    {
                        prop: 'priceName',
                        label: '单价（元）',
                        isShow: true,
                        width: 110,
                        render: (h, parms) => {
                            return h('span', {
                            }, parms.row.priceName = parms.row.price.toFixed(2))
                        }
                    },
                    {
                        prop: 'costPriceNumber',
                        label: '成本金额（元）',
                        isShow: true,
                        width: 125,
                        render: (h, parms) => {
                            return h('span', {
                            }, parms.row.costPriceNumber = Number(parms.row.costPrice).toFixed(2))
                        }
                    },
                    {
                        prop: 'procStateName',
                        label: '办理状态',
                        isShow: true,
                        render: (h, parms) => {
                            return h('span', {
                            }, parms.row.procStateName = util.handleState(parms.row.procState))
                        }
                    },
                    {
                        prop: 'nominee',
                        label: '待办人',
                        isShow: true
                    },
                    {
                        prop: 'auditStateName',
                        label: '审核状态',
                        isShow: true,
                        render: (h,params) =>{
                            return h('div',{
                            
                            }, params.row.auditStateName = params.row.auditState == '0' ? '未审核' : '已审核')
                        }
                    },
                    {
                        prop: 'createName',
                        label: '登记人',
                        isShow: true,
                        width: 80
                    },
                    {
                        prop: 'createTime',
                        label: '登记时间',
                        isShow: true,
                        width: 170
                    },
                    // {
                    //     prop: 'state',
                    //     label: '支付/报销状态',
                    //     isShow: true,
                    //     width: 130
                    // },
                    // {
                    //     prop: 'totalPrice',
                    //     label: '累计支付/报销金额',
                    //     isShow: true,
                    //     width: 145
                    // },
                    {
                        prop: '',
                        label: '操作',
                        isShow: true,
                        fixed: 'right',
                        width: '150',
                        render: (h, parms) => {
                            return [
                                // h('el-button', {
                                //     props:{
                                //         type: 'text',
                                //     },
                                //     attrs:{ disabled: parms.row.procState == '10' ? false : true },
                                //     on:{
                                //         click: () => {
                                //             this.transform.isShowDetails = false
                                //             let addIncome = true
                                //             this.costPaymentRouter ('添加成本支付', parms.row)
                                //         }
                                //     }
                                // }, '支付' ),
                                // h('el-button', {
                                //     props:{
                                //         type: 'text',
                                //     },
                                //     attrs:{ disabled: parms.row.procState == '10' ? false : true },
                                //     on:{
                                //         click: () => {
                                //             this.transform.isShowDetails = false
                                //             this.financeRouter ('添加成本报销', parms.row)
                                //         }
                                //     }
                                // }, '报销' ),
                                h('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    attrs:{ disabled: parms.row.procState ==='1' ? false : true },
                                    on:{
                                        click: () => {
                                            this.transform.isShowDetails = false
                                            this.routerLink ('成本登记编辑', parms.row.id)
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
                                            this.deleteIncomeRegistered (parms.row.id)
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
            
            addActualCost () {
                this.transform.isShowDetails = false
                this.routerLink ('增加成本收入')
            },

            routerLink (title, id = '', procInstId) {
                this.$router.push ({
                    path: 'costRegistrationAddition',
                    name: 'costRegistrationAddition',
                    params: {
                        relevancyId: id,
                        transform: this.transform,
                        procInstId: procInstId
                    }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            },

            financeRouter (title, rowData) {
                this.$router.push ({
                    path: `selfStaffReimburse`,
                    name: 'selfStaffReimburse',
                    params: {
                        rowData: rowData
                    }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            },

            costPaymentRouter (title, rowData) {
                this.$router.push ({
                    path: `paymentRequest`,
                    name: 'paymentRequest',
                    params: {
                        rowData: rowData
                    }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            },

            selectChange (item) {
                this.tableSelectData = item
            },

            searchModelSynopsis () {
                this.getActualCostPage ({
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

            getActualCostPage (text) {
                getCostRegistrationPage ({
                    ...text,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size,
                    'projectCode': this.selfSupportProject.projectCode
                }).then( res => {
                    if (res) this.tableData = res
                    console.log(res)
                })
            },

            resetModelSynopsis () {
                this.filterText = ''
                this.createDate = []
                this.getActualCostPage ()
            },

            deleteIncomeRegistered (id) {
                this.deleteIncomeRegisteredById ({'ids': id, 'projectCode': this.selfSupportProject.projectCode})
            },

            deleteIncomeRegisteredById (id) {
                util.confirm ().then (boolean => {
                    if (boolean) {
                        deleteBatchCostRegistration (id).then(res => {
                            if (res.code === 200) {
                                this.$message.success(res.message)
                                this.getActualCostPage ()
                            }
                        })
                    }
                })
            },

            deleteIncomeRegisteredPageList () {
                if (this.tableSelectData.length === 0) {
                    this.$message.warning ('请选择一条数据')
                    return
                }
                let ids = ''
                if (this.tableSelectData && this.tableSelectData.length > 0) {
                    this.tableSelectData.forEach(data => {
                        if (data.procState != 1 ) {
                            this.$message.warning ('该数据不支持批量删除')
                            return
                        } else {
                            ids += data.id + ','
                            this.deleteIncomeRegisteredById ({'ids': ids.substring(0, ids.length - 1), 'projectCode': this.selfSupportProject.projectCode})
                        }
                    })
                }
            },

            exportExcel () {
                this.$refs.table.getExportExcel ()
            },

            printTable () {
                this.$refs.table.printTable (this.tableSelectData)
            }
        },

        components: {
            'qqt-table': qqtTable,
            'project-info': projectInfo
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
                this.getActualCostPage ()
            }
        }
    }

</script>
