<template>
    <d2-container type="fulls" class="ticketReceipt_registration_list">
        <template slot="header">
            <determine-project v-if="identification == '2'" title='申请退税' :proId="projectId"></determine-project>
            <project-info v-if="identification == '1'"></project-info>
            <project-common v-if="identification == '2'"></project-common>
            <div class="qqt-container-full-header___top">
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
                    <el-button  size="mini" icon="el-icon-check" @click="isExamine('0')">审核</el-button>
                     <el-button  size="mini" icon="el-icon-close" @click="isExamine('1')">反审核</el-button>
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deleteBillingRegistrationListList">批量删除</el-button>
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
            <qqt-table :data="tableData" ref="table" :exportData="exportData" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange" />
        </div>
    </d2-container>
</template>

<script>
    import { getInvoiceDrawBackList, getSelfInvoiceDrawBackList, getJointInvoiceDrawBackList,
             delByIdInvoiceDrawback, delByIdSelfInvoiceDrawback, delByIdJointInvoiceDrawback,
             checkOrAgains, selfCheckOrAgains, jointCheckOrAgains,
             delByIdInvoiceDrawbackBatch, delByIdSelfInvoiceDrawbackBatch, delByIdJointInvoiceDrawbackBatch } from '@/api/selfProject/controlOverInvoices/InvoiceDrawBack'
    import { qqtTable, qqtSelect } from '@/components/qqt-subassembly'
    import { PURCHASEREQUEST } from '@/enum/DICTIONARY'
    import { mapState } from 'vuex'
    
    import util from '@/libs/util.js'
    import projectInfo from '../../../components/commenInfo/projectInfo'
    import projectCommon from '../../../../jontProjectDetail/components/projectCommon'
    import determineProject from '../../../../jontProjectDetail/components/determineProject'
    export default {
        data () {
            return {
                identification: '',
                projectId: '',
                proCode: '',
                invoiceType: '',
                filterText: '',
                options: [],
                createDate: [],
                projectCode: null,
                certificationStatus: '',
                deductionStatus: '',
                taxRefundStatus: '',
                invoiceTypeOptions: [],
                auth: {
                    edit: true,
                    delBat: true
                },
                defaultProp: {
                    value: 'id',
                    label: 'name'
                },
                certificationStatusOptions: [
                    {
                        value: '0',
                        label: '未认证'
                    },
                    {
                        value: '1',
                        label: '已认证'
                    }
                ],
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
                deductionStatusOptions: [
                    {
                        value: '0',
                        label: '未抵扣'
                    },
                    {
                        value: '1',
                        label: '已抵扣'
                    }
                ],
                taxRefundStatusOptions: [
                    {
                        value: '0',
                        label: '未退税'
                    },
                    {
                        value: '1',
                        label: '部分退税'
                    },
                    {
                        value: '2',
                        label: '全部退税'
                    }
                ],
                
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
                tableData: {},
                exportData:[],
                rowHeader: [
                    {
                        prop: 'projectType',
                        width: '120px',
                        label: '关联项目类型',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {
                            }, parms.row.projectTypeName = parms.row.projectType == 1 ? '自营' : (parms.row.projectType == 2 ? '联营': '其他'))
                        }
                    },
                    {
                        width: '120px',
                        prop: 'projectName',
                        label: '关联项目名称',
                        isShow: true
                    },
                    {
                        width: '120px',
                        prop: 'contractName',
                        label: '关联合同名称',
                        isShow: true
                    },
                   
                    {
                        prop: 'invoiceCode',
                        width: '130px',
                        label: '发票代码',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = true
                                        this.routerLink ('发票信息详情', parms.row.id,parms.row.procInstId)
                                    }
                                }
                            }, parms.row.invoiceCode)
                        }
                    },
                    {
                        prop: 'invoiceNum',
                        width: '100px',
                        label: '发票号码',
                        isShow: true
                    },
                    {
                        prop: 'invoiceType',
                        label: '发票类型',
                        width: '120px',
                        isShow: true
                    },
                     {
                        prop: 'sellerName',
                        label: '销售方名称',
                        width: '120px',
                        isShow: true,
                    },
                    {
                        prop: 'affiliationProvince',
                        label: '所属省份',
                        isShow: true,
                    },
                    {
                        prop: 'invoiceDate',
                        width: '100px',
                        label: '开票日期',
                        isShow: true,
                    },
                    {
                        prop: 'materialName',
                        width:'150px',
                        label: '货物或应税劳务、服务名称',
                        isShow: true,
                    },
                   
                    {
                        prop: 'totalAmountStr',
                        label: '合计金额（元）',
                        width: '120px',
                        isShow: true,
                        render:(h,params) =>{
                            return h ('div',{

                            }, params.row.totalAmountStr = util.moneySepFormat(params.row.totalAmount)) 
                        }
                    },
                    {
                        prop: 'totalTaxStr',
                        label: '税额合计（元）',
                        width: '120px',
                        isShow: true,
                        render:(h,params) =>{
                            return h ('div',{

                            }, params.row.totalTaxStr = util.moneySepFormat(params.row.totalTax)) 
                        }
                    },
                    {
                        prop: 'amountInFiguersStr',
                        label: '价税合计金额',
                        width: '120px',
                        isShow: true,
                        render:(h,params) =>{
                            return h ('div',{

                            }, params.row.amountInFiguersStr = util.moneySepFormat(params.row.amountInFiguers)) 
                        }
                    },
                    {
                        prop: 'drawbackLimitStr',
                        label: '可退税金额（元）',
                        width: '150px',
                        isShow: true,
                        render:(h,params) =>{
                            return h ('div',{

                            }, params.row.drawbackLimitStr = util.moneySepFormat(params.row.drawbackLimit)) 
                        }
                    },
                    {
                        prop: 'drawbackThis',
                        label: '本次退税金额（元）',
                        width: '150px',
                        isShow: true,
                        render:(h,params) =>{
                            return h ('div',{

                            }, params.row.drawbackThisStr = util.moneySepFormat(params.row.drawbackThis)) 
                        }
                    },
                    {
                        prop: 'drawbackCumsumStr',
                        width: '150px',
                        label: '累计退税金额（元）',
                        isShow: true,
                        render:(h,params) =>{
                            return h ('div',{

                            }, params.row.drawbackCumsumStr = util.moneySepFormat(params.row.drawbackCumsum)) 
                        }
                    },
                    {
                        prop: 'payeeName',
                        label: '收款人户名',
                        width: '120px',
                        isShow: true,
                    },
                    {
                        prop: 'payeeBank',
                        label: '开户行',
                        width: '120px',
                        isShow: true,
                    },
                     {
                        prop: 'payeeAccount',
                        label: '账号',
                        width: '120px',
                        isShow: true,
                    },
                    {
                        width: '120px',
                        prop: 'procState',
                        label: '办理状态',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {

                            }, parms.row.procStateName = util.handleState (parms.row.procState))
                        }
                    },
                    {
                        prop: 'agent',
                        label: '待办人',
                        isShow: true,
                    },
                    {
                        prop: 'stateName',
                        label: '审核状态',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {},
                                parms.row.stateName = parms.row.state == '0' ? '未审核' : '已审核'
                            )
                        }
                    },
                    {
                        prop: 'createName',
                        label: '申请人',
                        isShow: true,
                    },
                    {
                        prop: 'createTime',
                        label: '申请时间',
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
                                            this.routerLink ('编辑退税信息', parms.row.id)
                                        }
                                    }
                                }, '编辑') :'',
                                this.auth.delBat ? h ('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    attrs: {
                                        disabled: util.isDisabled (parms.row.procState)
                                    },
                                   on:{
                                        click: () => {
                                            this.deleteTicketReceiptRegistrationListById (parms.row.id)
                                        }
                                    }
                                }, '删除') :''
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
                this.getTicketReceiptRegistrationPage ({
                    'keywords': this.filterText ? this.filterText : null,
                    'afterDate': this.createDate ? this.createDate[0] : null,
                    'beforeDate': this.createDate ? this.createDate[1] : null,
                })
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
                    switch (this.identification) {
                        case '1':
                            url = selfCheckOrAgains
                            break
                        case '2':
                            url = jointCheckOrAgains
                            break
                        default:
                            url = checkOrAgains
                            break
                    }
                    url({id: this.tableSelectData[0].id,type:'1'}).then(res=> {
                    if (res.success) {
                        this.$message.success(res.message);
                    } else {
                        this.$message.error(res.message);
                    }
                    this.getTicketReceiptRegistrationPage ()
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
                    switch (this.identification) {
                        case '1':
                            url = selfCheckOrAgains
                            break
                        case '2':
                            url = jointCheckOrAgains
                            break
                        default:
                            url = checkOrAgains
                            break
                    }
                    url({id: this.tableSelectData[0].id,type:'0'}).then(res=> {
                    if (res.success) {
                        this.$message.success(res.message);
                    } else {
                        this.$message.error(res.message);
                    }
                    this.getTicketReceiptRegistrationPage ()
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

            handlePaginationChange (page) {
                this.page = page;
                this.$nextTick(() => {
                    this.searchModelSynopsis ()
                });
            },

            getTicketReceiptRegistrationPage (text) {
                let url = ''
                switch (this.identification) {
                    case '1':
                        url = getSelfInvoiceDrawBackList
                        break
                    case '2':
                        url = getJointInvoiceDrawBackList
                        break
                    default:
                        url = getInvoiceDrawBackList
                        break
                }
                url ({
                    ...text,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size,
                    'projectCode': this.projectCode,
                }).then( res => {
                    if (res) this.tableData = res
                })
            },

            deleteTicketReceiptRegistrationListById (id) {
                util.confirm ().then (boolean => {
                    if (boolean) {
                        let url = ''
                        switch (this.identification) {
                            case '1':
                                url = delByIdSelfInvoiceDrawback
                                break
                            case '2':
                                url = delByIdJointInvoiceDrawback
                                break
                            default:
                                url = delByIdInvoiceDrawback
                                break
                        }
                        url ({'id': id}).then(res => {
                            if (res.code === 200) {
                                this.$message.success(res.message)
                                this.getTicketReceiptRegistrationPage ()
                            }
                        })
                    }
                })
            },

            resetModelSynopsis () {
                this.filterText = ''
                this.createDate = []
                this.getTicketReceiptRegistrationPage ({})
            },

            getExportData () {
                this.exportData = JSON.parse(JSON.stringify((this.tableData.records))) || [];
                return new Promise((resolve, reject) => {
                    this.exportData.forEach((item,index) => {
                        console.log(item);
                        item.procState = util.handleState(item.procState);
                        item.state = item.state === '0' ? '未审核' : '已审核';
                        item.projectType = item.projectType === '1' ? '自营项目' : (item.projectType === '2' ? '联营项目' : '其他');

                    });
                    resolve (true)
                });
            },
            // 导出
            exportExcel () { 
                this.getExportData().then(res => {
                    this.$refs.table.getExportExcel()
                })
            },

            printTable () {
                this.$refs.table.printTable (this.tableSelectData)
            },

            // 批量删除
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
                let url = ''
                switch (this.identification) {
                    case '1':
                        url = delByIdSelfInvoiceDrawbackBatch
                        break
                    case '2':
                        url = delByIdJointInvoiceDrawbackBatch
                        break
                    default:
                        url = delByIdInvoiceDrawbackBatch
                        break
                }
                url ({'ids': ids.substring(0, ids.length - 1)}).then(res => {
                    this.getTicketReceiptRegistrationPage ()
                    this.$message.success(res.message)
                })
            },
            
            addBillingRegistrationList () {
                this.transform.isShowDetails = false
                this.routerLink ('添加发票退税')
            },
           
            routerLink (title, id = '',procInstId='') {
                let route = ''
                switch (this.identification) {
                    case '1':
                        route = 'addInvoiceDrawBackPage'
                        break
                    case '2':
                        route = 'addJointInvoiceDrawBackPage'
                        break
                    default:
                        route = 'addInvoiceDrawBack'
                        break
                }
                this.$router.push ({ path: route, name: route, params: {
                                                                    relevancyId: id,
                                                                    transform: this.transform,
                                                                    procInstId:procInstId
                                                                }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            },

            _validationAuth () {
                switch (this.identification) {
                    case '1':
                        this.auth.edit       =     this.$has ('invoice:drawback:edit:s')
                        this.auth.delBat     =   this.$has ('invoice:drawback:delete:s')
                        break
                    case '2':
                        this.auth.edit       =     this.$has ('invoice:drawback:edit:j')
                        this.auth.delBat     =   this.$has ('invoice:drawback:delete:j')
                        break
                    default:
                        this.auth.edit       =       this.$has ('invoice:drawback:edit')
                        this.auth.delBat     =     this.$has ('invoice:drawback:delete')
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
                            this.getTicketReceiptRegistrationPage ()
                        })
                        break
                    default:
                        this.getTicketReceiptRegistrationPage ()
                        break
                }
            }
        },

        components: {
            'qqt-table': qqtTable,
            'qqtSelect': qqtSelect,
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
                this.getTicketReceiptRegistrationPage ()
            },

            $route (val) {
                if (val.path.indexOf('InvoiceDrawBack') !== -1) {
                    this.decideLoadDataWay ()
                    this._validationAuth ()
                }
            }
        }
    }
    

</script>

<style lang="scss">
.ticketReceipt_registration_list {
    .qqt-container-full-header___top {
        .el-form-item__label {
            color: $color-project-select;
        }

    }
    .qqt-container-full-header-state___select {
        .select {
            width: 135px;
        }
        .el-input__inner {
            border: 1px solid $color-project-select;
        }
        input::-webkit-input-placeholder {
            color: $color-project-select !important;
        }
        .el-select .el-input .el-select__caret {
            color: $color-project-select !important;
        }
    }
}
</style>
