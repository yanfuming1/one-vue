<template>
    <d2-container type="fulls">
        <template slot="header">
            <project-info v-if="!tabTop"></project-info>
            <div class="qqt-container-full-header___top">
                 <!-- <span class="qqt-container-full-header-operation___left">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addBillingRegistrationList">添加</el-button>
                </span>
                <span class="qqt-container-full-header-operation___left">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="copyBillingRegistrationList">复制</el-button>
                </span> -->
                <span class="qqt-container-full-header-operation___left">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="searchModelSynopsis">搜索</el-button>
                </span> 
                <span class="qqt-container-full-header___search">
                    <el-input
                        placeholder="请输入内容"
                        prefix-icon="el-icon-search"
                        @keyup.enter.native="searchModelSynopsis"
                        v-model="filterText" size="mini">
                    </el-input>
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
                    <!-- <el-button type="primary" class="qqt-container-full-header-top___button" @click="deleteBillingRegistrationListList">批量删除</el-button> -->
                     <el-button  size="mini" icon="el-icon-check" @click="isExamine('0')">审核</el-button>
                     <el-button  size="mini" icon="el-icon-close" @click="isExamine('1')">反审核</el-button>
                </span>
                       
                <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                        <el-button size="mini" @click="exportExcel" icon="el-icon-upload2">导出</el-button>
                    </el-button-group>
                </span>
            </div>
        </template>
        <div class="qqt-container-full-center___left">
            <Invoice-state :options = options  @information="getExpandInformataionSon"></Invoice-state>
        </div>
        <div class="qqt-container-full-center___right">
            <qqt-table :data="tableData" ref="table" :exportData="tableData.records" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange" />
        </div>    
           
    </d2-container>
</template>

<script>
    import { mapState } from 'vuex'
    import util from '@/libs/util.js'
    import { qqtTable } from '@/components/qqt-subassembly'
    import projectInfo from '../../../components/commenInfo/projectInfo'
    import { getInvoiceCertificationList, checkOrAgains,selfCheckOrAgains,  validation, getSelfInvoiceCertificationList, validationSelf } from '@/api/selfProject/controlOverInvoices/InvoiceCertification'
    import InvoiceState from './InvoiceState'

    export default {
        data () {
            return {
                filterText: '',
                options: [],
                createDate: [],
                tabTop: Boolean,
                tableSelectData: [],
                tableOption: {
                    border: false
                },
                options: [
                {
                    id:'1',
                    label:'已认证的发票',
                    isShow:true,
                },
                {
                    id:'0',
                    label:'未认证的发票',
                    isShow:false,
                }
                ],
                transform: {
                    isShowDetails: false
                },
                dynamicHeader: {
                    tableId: '',
                    isSave: false
                },
                validationState:'1',
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
                        prop: 'invoiceCode',
                        label: '发票代码',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on:{
                                    click: () => {
                                    }
                                }
                            }, parms.row.invoiceCode)
                        }
                    },
                    {
                        prop: 'invoiceType',
                        label: '发票类型',
                        isShow: true
                    },
                    {
                        prop: 'invoiceNum',
                        label: '发票号码',
                        isShow: true
                    },
                    {
                        prop: 'validationState',
                        label: '认证状态',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {},
                                parms.row.validationState == '0' ? '未认证' : '已认证'
                            )
                        }
                    },
                    {
                        prop: 'agent',
                        label: '待办人',
                        isShow: true,
                    },
                    {
                        prop: 'affiliationProvince',
                        label: '所属省份',
                        isShow: true,
                    },
                    {
                        prop: 'invoiceDate',
                        label: '开票日期',
                        isShow: true,
                    },
                    {
                        prop: 'totalAmountUpper',
                        label: '合计金额（元）',
                        width: '120px',
                        isShow: true,
                    },
                    {
                        prop: 'amountInFiguers',
                        label: '价税合计金额',
                        width: '120px',
                        isShow: true,
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
                        width: '200',
                        render: (h, parms) => {
                            return [
                                 h ('el-button', {
                                    props:{
                                        type: 'success',
                                        size: 'mini',
                                        round: true
                                    },
                                    style: {
                                        padding: '5px 10px'
                                    },
                                    attrs: {
                                        disabled: parms.row.validationState != '0' ? true : parms.row.validationState == '1' ? true : false
                                    },
                                    on:{
                                        click: () => {
                                            util.confirm ('是否要认证发票').then (boolean => {
                                                if (parms.row.procState !=10 ){
                                                    this.$message.warning("请选择流程完结的数据")
                                                    return
                                                }
                                                if (boolean) {
                                                    this.proveInvoice (parms.row.id)
                                                }
                                            })
                                        }
                                    }
                                }, '认证'),
                                // h('el-button', {
                                //     props:{
                                //         type: 'text',
                                //     },
                                //     on:{
                                //         click: () => {
                                //         }
                                //     }
                                // }, '编辑'),
                                // h('el-button', {
                                //     props:{
                                //         type: 'text',
                                //     },
                                //    on:{
                                //         click: () => {
                                //         }
                                //     }
                                // }, '删除')
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
                getInvoiceCertificationList ({
                    'validationState': this.validationState ? this.validationState : '1',
                    'name': this.filterText ? this.filterText : null,
                    'createTime': this.createDate ? this.createDate[1] : null,
                    'updateTime': this.createDate ? this.createDate[0] :null,
                    'projectCode': this.selfSupportProject.projectCode,
                })
            },

            handlePaginationChange (page) {
                this.page = page;
                this.$nextTick(() => {
                    this.searchModelSynopsis ()
                });
            },

            getBillingRegistrationListPage (text) {
                let url = ''
                this.tabTop == true ? url = getInvoiceCertificationList :url = getSelfInvoiceCertificationList
                url ({
                    ...text,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size,
                    'projectCode': this.tabTop == true ? null : this.selfSupportProject.projectCode,
                }).then( res => {
                    if (res) this.tableData = res
                })
            },

            deleteBillingRegistrationListObject (id) {
                // this.deleteBillingRegistrationListById ({'ids': id})
            },

            deleteBillingRegistrationListList () {
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
                // this.$message.error("")
                // this.deleteBillingRegistrationListById ({'ids': ids.substring(0, ids.length - 1)})
            },

            proveInvoice (id) {
                let url = ''
                this.tabTop == true ? url = validation :url = validationSelf
                url ({'id': id}).then (res => {
                    if ( res.code === 200) {
                        this.$message.success(res.message)
                        this.getBillingRegistrationListPage ({'validationState':this.validationState})
                    }
                }) 
            },
            // deleteBillingRegistrationListById (id) {
            //     util.confirm ().then (boolean => {
            //         if (boolean) {
            //             deleteBatchBillingRegistrationList (id).then(res => {
            //                 if (res.code === 200) {
            //                     this.$message.success(res.message)
            //                     this.getBillingRegistrationListPage ()
            //                 }
            //             })
            //         }
            //     })
            // },
            

            addBillingRegistrationList () {
            },

            copyBillingRegistrationList () {

            },

            resetModelSynopsis () {
                this.filterText = ''
                this.createDate = []
                this.getBillingRegistrationListPage ({'validationState':this.validationState})
            },

            exportExcel () {
                this.$refs.table.getExportExcel ()
            },

            audit () {

            },

            theAudit () {
                
            },

            isExamine (type) {
                type == '0' ? this.isChick() : this.unIsChick()
            },

            // 审核
            isChick () {
            if (this.tableSelectData.length === 1) {
                if (this.tableSelectData[0].state === '0') {
                this.$confirm('您是否要审核该条数据?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let url = ''
                    this.tabTop == true ? url = checkOrAgains  : url = selfCheckOrAgains 
                    url({id: this.tableSelectData[0].id,type:'1'}).then(res=> {
                    if (res.success) {
                        this.$message.success(res.message);
                    } else {
                        this.$message.error(res.message);
                    }
                    this.getBillingRegistrationListPage ({'validationState':this.validationState})
                    })  
                })
                } else {
                this.$message.error('该数据已审核不支持继续审核');
                }
            } else if (this.tableSelectData.length === 0) {
                this.$message.error('请选择要审核的数据');
            } else {
                this.$message.error('只支持单条数据操作');
            }
            },

            unIsChick () {
            if (this.tableSelectData.length === 1) {
                if (this.tableSelectData[0].state === '1') {
                this.$confirm('您是否要反审核该条数据?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let url = ''
                    this.tabTop == true ? url = checkOrAgains  : url = selfCheckOrAgains 
                    url({id: this.tableSelectData[0].id,type:'0'}).then(res=> {
                    if (res.success) {
                        this.$message.success(res.message);
                    } else {
                        this.$message.error(res.message);
                    }
                    this.getBillingRegistrationListPage ({'validationState':this.validationState})
                    })
                })
                } else {
                this.$message.error('该数据未审核不支持继续反审核');
                }
            } else if (this.tableSelectData.length === 0) {
                this.$message.error('请选择要反审核的数据');
            } else {
                this.$message.error('只支持单条数据操作');
            }
            },

            invoiCecertificationBtn () {
                this.$router.push ({
                    path: 'InvoiceCertification',
                    name: 'InvoiceCertification'
                })
            },

            getExpandInformataionSon (item) {
                this.validationState = item.id
                this.getBillingRegistrationListPage ({'validationState':this.validationState})
            },
            
            routerLink (title, id = '') {
                this.$router.push ({
                    path: 'addBillingRegistrationList',
                    name: 'addBillingRegistrationList',
                    params: {
                        relevancyId: id,
                        transform: this.transform,
                    }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            },
            judge () {
                var result =  this.$route.path.endsWith("tabTop/1");
                this.tabTop = result
                return result
            },
        },

        components: {
            'qqt-table': qqtTable,
            'project-info': projectInfo,
            'Invoice-state' : InvoiceState
        },

        created () {
            this.judge()
            this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad')
            this.getBillingRegistrationListPage ({'validationState':this.validationState})
        },

        computed: {
            ...mapState ('d2admin/selfSupportProject', [
                'selfSupportProject'
            ])
        },

        watch: {
            selfSupportProject () {
                // this.getBillingRegistrationListPage ({'validationState':this.validationState})
            }
        }
    }

</script>

<style lang='scss'>
    // .qqt-container-full-center___left {
    //     height:550px!important
    // }
    // .qqt-container-full-center___right {
    //     height:550px!important
    // }
</style>

