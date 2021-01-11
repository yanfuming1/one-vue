<template>
    <d2-container type="fulls" class="ticketReceipt_registration_list">
        <template slot="header">
            <determine-project v-if="identification == '2'" title='进项发票' :proId="this.projectData.projectId"></determine-project>
            <project-info v-if="identification == '1'"></project-info>
            <project-common v-if="identification == '2'"></project-common>
            <slot name="header"></slot> 
            <div class="qqt-container-full-header___top">
                <el-form :inline="true">
                    <el-form-item >
                        <el-button type="primary" class="qqt-container-full-header-top___button" @click="addTicketReceiptRegistrationList">复制</el-button>
                        <el-input
                            placeholder="请输入内容"
                            style="width:150px;margin-left:10px"
                            prefix-icon="el-icon-search"
                            @keyup.enter.native="searchModelSynopsis"
                            v-model="filterText" size="mini">
                        </el-input>
                    </el-form-item>
                    <el-form-item label prop="keywords"> 
                       <el-date-picker
                        v-model="dateTime"
                        style="width:250px"
                        type="daterange"
                        size="mini"
                        range-separator="至"
                        start-placeholder="开始日期"
                        value-format="yyyy-MM-dd"
                        @change="dateChange"
                        end-placeholder="结束日期">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" style="margin-left:10px" class="qqt-container-full-header-top___button" @click="searchModelSynopsis">搜索</el-button>
                        <el-button type="info" class="qqt-container-full-header-top___button" @click="resetModelSynopsis">重置</el-button>
                        <el-button-group style="margin-left:10px">
                            <el-button size="mini" @click="exportExcel" icon="el-icon-upload2">导出</el-button>
                            <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                        </el-button-group>
                    </el-form-item>
                    <el-form-item label="项目类型:">
                        <div class="qqt-container-full-header-state___select">
                            <qqt-select :value="projectType" :options="projectList" :size="'mini'" :placeholder="'请选择'" @select="page.current = 1, page.size = 10, projectType = $event, searchModelSynopsis()"></qqt-select>
                        </div>
                    </el-form-item>
                    <el-form-item label="发票类型:">
                        <div class="qqt-container-full-header-state___select">
                            <qqt-select :value="invoiceType" :options="invoiceTypeOptions" :defaultProp="defaultProp" :size="'mini'" :placeholder="'请选择'" @select="page.current = 1, page.size = 10, invoiceType = $event, searchModelSynopsis()"></qqt-select>
                        </div>
                    </el-form-item>
                    <el-form-item label="财务分类:">
                        <div class="qqt-container-full-header-state___select">
                            <qqt-select :value="financeType" :options="financeList" :size="'mini'" :placeholder="'请选择'" @select="page.current = 1, page.size = 10, financeType = $event,searchModelSynopsis()"></qqt-select>
                        </div>
                    </el-form-item>
                    <el-form-item label="办理状态:">
                        <div class="qqt-container-full-header-state___select">
                            <qqt-select :value="procState" :options="procStateList" :size="'mini'" :placeholder="'请选择'" @select="page.current = 1, page.size = 10, procState = $event,searchModelSynopsis()"></qqt-select>
                        </div>
                    </el-form-item>
                    <el-form-item label="审核状态:">
                        <div class="qqt-container-full-header-state___select">
                            <qqt-select :value="state" :options="stateList" :size="'mini'" :placeholder="'请选择'" @select="page.current = 1, page.size = 10, state = $event,searchModelSynopsis()"></qqt-select>
                        </div>
                    </el-form-item>
                    <el-form-item label="抵扣状态:">
                        <div class="qqt-container-full-header-state___select">
                            <qqt-select :value="deductionStatus" :options="deductionStatusOptions" :size="'mini'" :placeholder="'请选择'" @select="page.current = 1, page.size = 10, deductionStatus = $event, searchModelSynopsis()"></qqt-select>
                        </div>
                    </el-form-item>
                    <el-form-item label="退税状态:">
                        <div class="qqt-container-full-header-state___select">
                            <qqt-select :value="taxRefundStatus" :options="taxRefundStatusOptions" :size="'mini'" :placeholder="'请选择'" @select="page.current = 1, page.size = 10, taxRefundStatus = $event, searchModelSynopsis()"></qqt-select>
                        </div>
                    </el-form-item>
                   
                 </el-form>
            </div>
            <div class="qqt-container-full-header___top_btn">
                <el-button type="success" size="mini" class="user_input_button" v-if="auth.add" @click="userInputBtn">用户输入</el-button>
                <el-dropdown  @command="handleCommand"  v-if="auth.orc" style="margin:0 10px;">
                    <el-button type="success" size="mini" >
                        ORC识别
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="本地上传">
                            本地上传
                        </el-dropdown-item>
                        <el-dropdown-item command="截图上传">截图上传</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-button type="success" size="mini" v-if="auth.collect" class="interface_acquisition_button" @click="interfaceAcquisitionBtn">接口采集</el-button>
                <el-button type="success" size="mini" class="ORC_identification_button" @click="isExamine('0')">审核</el-button>
                <el-button type="success" size="mini" class="interface_acquisition_button" @click="isExamine('1')">反审核</el-button>
                <el-button type="danger" size="mini" v-if="auth.deduction" class="invoice_deduction_button" @click="invoiceDeductionBtn">发票抵扣</el-button>
                <el-button type="danger" size="mini" v-if="auth.drawback" class="apply_tax_refund_button" @click="applyTaxRefundBtn">申请退税</el-button>
                <el-button type="danger" size="mini" v-if="auth.abnormal" class="exception_marker_button" @click="exceptionMarkerBtn">异常标记</el-button>
            </div>
        </template>
        <div class="qqt-container-full___center">
            <qqt-table :data="tableData" ref="table" :exportData="exportData" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange" />
        </div>
        <upload-img :dialogVisible="dialogVisible" @dialogCancel="dialogCancel" @uploadImg="uploadOk">
            <template slot="header">
                <project-message :disabled="identification != ''" :projectData="projectData" ref="projectData"></project-message>
            </template>
            <template slot="factor">
                <bottom-information :values="values" :edit="true" ref="bottomInformation" />
            </template>
        </upload-img>
        <copy-img :copyShow="copyShow" @copyCancel="copyCancel" @copyUploadImg="copyUploadImg" ref="copyImg">
             <template slot="header">
                <project-message :disabled="identification != ''" :projectData="projectData" ref="projectCopyData"></project-message>
            </template>
            <template slot="factor">
                <bottom-information :values="values" :edit="true" ref="bottomInformationCopy" />
            </template>
        </copy-img>
    </d2-container>
</template>

<script>
    import { getTicketReceiptRegistrationList, getSelfTicketReceiptRegistrationList, getJointTicketReceiptRegistrationList, 
             checkOrAgains, selfCheckOrAgains, jointCheckOrAgains, multiScan,
             delByIdTicketReceiptRegistration, delByIdSelfTicketReceiptRegistration, delByIdJointTicketReceiptRegistration,
             queryByIdSelfTicketReceiptRegistration } from '@/api/selfProject/controlOverInvoices/ticketReceiptRegistration'
    import { qqtTable, qqtSelect } from '@/components/qqt-subassembly'
    import { queryDicById } from '@/api/system/dic/dic'
    import { PURCHASEREQUEST } from '@/enum/DICTIONARY'
    import { Loading } from 'element-ui'
    import { mapState } from 'vuex'
    
    import copyImg from './copyImg'
    import util from '@/libs/util.js'
    import uploadImg from './uploadImg'
    import projectMessage from './projectMessage'
    import projectInfo from '../../../components/commenInfo/projectInfo'
    import projectCommon from '../../../../jontProjectDetail/components/projectCommon'
    import bottomInformation from '../../parameterSetting/components/bottomInformation'
    import determineProject from '../../../../jontProjectDetail/components/determineProject'
    export default {

        props: {

            // 发票来源 1-开票（销项），2-收票（进项）
            invoiceSource: {
                type: String,
                default: null
            },

            // 合同id
            contractId: {
                type: String,
                default: null
            },

            characteristic: {
                type: String,
                default: null
            }
        },

        data () {
            return {
                copyShow:false,
                projectData: {
                    invoiceSource: '2',
                    projectType: '3'
                },
                values:{
                    createBy: '',
                    createName: '',
                    createTime: '',
                    departmentName: '',
                    departmentId: '',
                    companyName: '',
                    companyId: ''
                },
                auth: {
                    add: true,
                    orc: true,
                    edit: true,
                    delBat: true,
                    collect: true,
                    drawback: true,
                    abnormal: true,
                    deduction: true,
                    
                },
                dialogVisible:false,
                exportData:[],
                dateTime:null,
                identification: '',
                financeType:'',
                filterText: '',
                invoiceType: '',
                certificationStatus: '',
                deductionStatus: '',
                taxRefundStatus: '',
                projectType:'',
                invoiceTypeOptions: [],
                defaultProp: {
                    value: 'name',
                    label: 'name'
                },
                financeList:[
                    {
                        value:'1',
                        label: '成本类'
                    },
                    {
                        value:'2',
                        label: '费用类'
                    },
                ],
                state: '',
                procState: '',
                stateList:[
                    {
                        value:'1',
                        label: '已审核'
                    },
                    {
                        value:'0',
                        label: '未审核'
                    },
                ],
                procStateList:[
                    {label:"初始化",value:"1"},
                    {label:"待审批",value:"2"},
                    {label:"审批中",value:"3"},
                    {label:"已驳回",value:"4"},
                    {label:"已作废",value:"5"},
                    {label:"已完结",value:"10"},
                ],
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
                projectList: [
                    {
                        value: '1',
                        label: '自营项目'
                    },
                    {
                        value: '2',
                        label: '联营项目'
                    },
                    {
                        value: '3',
                        label: '其他'
                    }
                ],
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
                rowHeader: [
                    {
                        prop: 'projectTypeName',
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
                    // {
                    //     prop: 'contractType',
                    //     width: '120px',
                    //     label: '关联合同类型',
                    //     isShow: true
                    // },
                    {
                        width: '120px',
                        prop: 'contractName',
                        label: '关联合同名称',
                        isShow: true
                    },
                    {
                        width: '120px',
                        prop: 'procStateName',
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
                                        this.routerLink ('发票信息详情', parms.row.id,'',parms.row.procInstId)
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
                        prop: 'sellerName',
                        label: '销售方名称',
                        width: '120px',
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
                        prop: 'deductionStateStr',
                        width: '120px',
                        label: '抵扣状态',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {
                            }, parms.row.deductionStateStr = parms.row.deductionState == 1 ? '已抵扣' : '未抵扣')
                        }
                    },
                    {
                        prop: 'drawbackStateName',
                        width: '120px',
                        label: '退税状态',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {
                            }, parms.row.drawbackStateName = parms.row.drawbackState == 0 ? '未退税' : (parms.row.drawbackState == 1 ? '部分退税': '全部退税'))
                        }
                    },
                    {
                        prop: 'financeTypeName',
                        width: '100px',
                        label: '财务分类',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {
                            }, parms.row.financeTypeName = parms.row.financeType == 1 ? '成本类' :(parms.row.financeType == 2 ? '费用类': ''))
                        }
                    },
                    {
                        prop: 'createName',
                        width: '100px',
                        label: '登记人',
                        isShow: true,
                    },
                    {
                        prop: 'createTime',
                        width: '120px',
                        label: '登记时间',
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
                                            this.routerLink ('编辑收票信息', parms.row.id)
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
                                            this.deleteTicketReceiptRegistrationListById (parms.row.id)
                                        }
                                    }
                                }, '删除') : ''
                            ]
                        }
                    }
                ]
            }
        },

        methods: {

            copyCancel () {
                this.copyShow = false
            },

            dialogCancel () {
                this.dialogVisible = false
            },

            handleCommand (type) {
                type == '本地上传' ? this.dialogVisible = true : this.copyShow = true
            },

            dateChange (date) {
                if (date) {
                    this.page.afterDate = date[0] + ' 00:00:00';
                    this.page.beforeDate = date[1] + ' 23:59:59';
                } else {
                    this.page.afterDate = ''
                    this.page.beforeDate = ''
                }
               this.getTicketReceiptRegistrationPage ({afterDate: this.page.afterDate, beforeDate: this.page.beforeDate})
            },

            selectChange (item) {
                this.tableSelectData = item
            },

            searchModelSynopsis () {
                this.getTicketReceiptRegistrationPage ({
                    'keywords': this.filterText ? this.filterText : null,
                    'invoiceTypeId': this.invoiceType ? this.invoiceType : null,
                    'projectType': this.projectType ? this.projectType : null,
                    'validationState': this.certificationStatus ? this.certificationStatus : null,
                    'deductionState': this.deductionStatus ? this.deductionStatus : null,
                    'financeType': this.financeType ? this.financeType : null,
                    'procState': this.procState ? this.procState : null,
                    'state': this.state ? this.state : null,
                    'drawbackState': this.taxRefundStatus ? this.taxRefundStatus : null,
                    'afterDate': this.dateTime ? this.dateTime[0] + ' 00:00:00' : null,
                    'beforeDate': this.dateTime ? this.dateTime[1] + ' 23:59:59' : null
                })
            },

            resetModelSynopsis () {
                this.invoiceType = this.dateTime =  this.state =  this.certificationStatus = this.deductionStatus = this.taxRefundStatus = this.filterText = this.projectType = this.financeType = this.procState = null
                this.searchModelSynopsis ()
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
                        url = getSelfTicketReceiptRegistrationList
                        break
                    case '2':
                        url = getJointTicketReceiptRegistrationList
                        break
                    default:
                        url = getTicketReceiptRegistrationList
                        break
                }
                url ({
                    ...text,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size,
                    'projectCode': this.projectData.projectCode,
                    'invoiceSource': '2',
                    'contractId': this.contractId,
                }).then( res => {
                    if (res) this.tableData = res
                })
            },

            getQueryDicByIdList () {
                queryDicById ({id: PURCHASEREQUEST.INVOICETYPE}).then(res =>{
                    if (res && res.length > 0) {
                        this.invoiceTypeOptions = res
                    }
                })
            },

            deleteTicketReceiptRegistrationListById (id) {
                util.confirm ().then (boolean => {
                    if (boolean) {
                        let url = ''
                        switch (this.identification) {
                            case '1':
                                url = delByIdSelfTicketReceiptRegistration
                                break;
                            case '2':
                                url = delByIdJointTicketReceiptRegistration
                                break
                            default:
                                url = delByIdTicketReceiptRegistration
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

            queryDataById (id) {
                queryByIdSelfTicketReceiptRegistration ({id:id}).then(res=> {
                    let data = Object.assign ({}, res)
                    data.id = null;
                    delete data.departmentId;
                    delete data.departmentName;
                    delete data.companyId;
                    delete data.companyName;
                    delete data.createBy;
                    delete data.createName;
                    this.transform.isShowDetails = false
                    this.routerLink ('添加收票信息','',data)
                })
            },

            addTicketReceiptRegistrationList () {
                if (this.tableSelectData.length === 1) {
                    this.queryDataById(this.tableSelectData[0].id)
                } else {
                    this.$message.error('请选择一条数据')
                }
            },

            userInputBtn () {
                this.transform.isShowDetails = false
                this.routerLink ('添加收票信息')
            },

            getExportData () {
                this.exportData = JSON.parse(JSON.stringify((this.tableData.records))) || [];
                return new Promise((resolve, reject) => {
                    this.exportData.forEach((item,index) => {
                        item.procState = util.handleState(item.procState);
                        item.state = item.state === '0' ? '未审核' : '已审核';
                        item.projectType = item.projectType === '1' ? '自营项目' : (item.projectType === '2' ? '联营项目' : '其他');
                        item.deductionState  = item.deductionState == 1 ? '已抵扣' : '未抵扣';
                        item.drawbackState  = item.drawbackState == 0 ? '未退税' : (item.drawbackState == 1 ? '部分退税': '全部退税');
                        item.financeType  = item.financeType == 1 ? '成本类' :(item.financeType == 2 ? '费用类': '');

                    });
                    resolve (true)
                });
            },

            exportExcel () { 
                this.getExportData().then(res => {
                    this.$refs.table.getExportExcel()
                })
            },

            printTable () {
                this.$refs.table.printTable (this.tableSelectData)
            },

            //截图上传
            copyUploadImg () {
                let projectData = this.$refs.projectCopyData.getData();
                this.$refs.bottomInformationCopy.getData().then((result) => {
                    this.$refs.copyImg.getData().then(fileList=>{
                        let jsonData = {
                            ...result,
                            ...projectData,
                            imageUrls:fileList
                        }
                        multiScan(jsonData).then(res=>{
                            if (res.result === null) {
                                this.getTicketReceiptRegistrationPage ()
                            } else {
                                this.transform.isShowDetails = false
                                let data = Object.assign(res,projectData,result)
                                this.routerLink ('添加收票信息','',data)
                            }
                        }).finally(res=>{
                            this.copyShow = false;
                        })
                    })
                })
            },

            // 上传发票
            uploadOk (fileList) {
                if (fileList.length === 0) {
                    this.$message.error('请上传发票')
                    return
                }
                let projectData = this.$refs.projectData.getData();
                this.$refs.bottomInformation.getData().then((result) => {
                    let jsonData = {
                        ...result,
                        ...projectData,
                        imageUrls:fileList
                    }
                    multiScan (jsonData).then(res=>{
                        let newRes = JSON.parse(JSON.stringify(res))
                        if (newRes.result === null) {
                            this.getTicketReceiptRegistrationPage ()
                        } else {
                            this.transform.isShowDetails = false
                            let data = Object.assign(res,projectData,result)
                            this.routerLink ('添加收票信息','',data)
                        }
                    }).finally(()=>{
                        this.dialogVisible = false;
                    })
                })
            },

            // ORC识别
            ORCIdentificationBtn () {

            },

            interfaceAcquisitionBtn () {},

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
                        url ({id: this.tableSelectData[0].id, type: '1'}).then(res=> {
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
                            url ({id: this.tableSelectData[0].id, type: '0'}).then(res=> {
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

            otherPart (paths, title) {
                 if (this.tableSelectData [0].procState != 10){
                    this.$message.warning ('请选择流程完结的数据')
                    return
                }
                if (this.tableSelectData.length === 1 ) {
                    this.$router.push({
                        path: paths,
                        name: paths,
                        params: {
                            relevancyId: this.tableSelectData [0].id,
                            invoiceSource: this.invoiceSource,
                            contractId: this.contractId,
                            startTag:'add'
                        }
                    })
                    this.$store.commit ('d2admin/page/titleSet', title)
                } else {
                    this.$message.warning ('请选择一条数据')
                    return
                }
            },

            invoiceDeductionBtn () {
                 if (this.tableSelectData.length != 1){
                     this.$message.warning ('请选择一条数据')
                     return 
                 }  
                if (this.tableSelectData [0].deductionState != 0){
                    this.$message.warning ('该数据已经被抵扣')
                    return
                }
                let paths = ''
                switch (this.identification) {
                    case '1':
                        paths = 'addControlInvoiceDeduction'
                        break
                    case '2':
                        paths = 'addJointControlInvoiceDeduction'
                        break
                    default:
                        paths = 'addInvoiceDeduction'
                        break
                }
                this.otherPart (paths, '添加发票抵扣')
            },

            applyTaxRefundBtn () {
                if (this.tableSelectData.length == 1){
                    if (this.tableSelectData [0].drawbackState == 2){
                        this.$message.warning ('该数据已经被使用')
                        return
                    }
                    let paths = ''
                    switch (this.identification) {
                        case '1':
                            paths = 'addControlInvoiceDrawBack'
                            break
                        case '2':
                            paths = 'addJointInvoiceDrawBackPage'
                            break
                        default:
                            paths = 'addInvoiceDrawBack'
                            break
                    }
                    this.otherPart (paths, '添加申请退税')
                } else {
                    this.$message.warning ('请选择一条数据')
                }
            },

            exceptionMarkerBtn () {
                if (this.tableSelectData.length == 1){
                    let paths = ''
                    switch (this.identification) {
                        case '1':
                            paths = 'addInvoiceAbnormalRegistrationPage'
                            break
                        case '2':
                            paths = 'addJointInvoiceAbnormalRegistrationPage'
                            break
                        default:
                            paths = 'addInvoiceAbnormalRegistration'
                            break
                    }
                    this.otherPart (paths, '异常登记')
                } else {
                    this.$message.warning ('请选择一条数据')
                }
            },

            invoiceInspectionBtn () {},

            routerLink (title, id = '',data = '',procInstId='') {
                let route = '', returnPath = '', returnName = ''
                switch (this.identification) {
                    case '1':
                        route = 'addControlTicketReceiptRegistration'
                        returnPath = this.contractId ? '/selfSupportProjectDetail/inputSelfProjectInvoice' : '/projectManagement/selfSupportProjectDetail/controlOverInvoices/ticketReceiptRegistration/tabTop/1'
                        returnName = this.contractId ? 'inputSelfProjectInvoice' : 'ticketReceiptRegistrationtabTop'
                        break
                    case '2':
                        route = 'addJointControlTicketReceiptRegistration'
                        returnPath = this.contractId ? '/jontProjectDetail/inputJointProjectInvoice' : '/projectManagement/selfSupportProjectDetail/controlOverInvoices/ticketReceiptRegistration/jointProject/2'
                        returnName = this.contractId ? 'inputJointProjectInvoice' : 'ticketReceiptRegistrationjointProject'
                        break
                    default:
                        route = 'addTicketReceiptRegistration'
                        returnPath = this.contractId ? '/contract/inputInvoice' : '/projectManagement/selfSupportProjectDetail/controlOverInvoices/ticketReceiptRegistration'
                        returnName = this.contractId ? 'inputInvoice' : 'ticketReceiptRegistration'
                        break
                }
                this.$router.push ({ path: route, name: route, params: {
                                                                    procInstId:procInstId,
                                                                    transform: this.transform,
                                                                    contractId: this.contractId,
                                                                    invoiceSource: '2',
                                                                    relevancyId: id,
                                                                    path: returnPath,
                                                                    name: returnName,
                                                                    data: data,
                                                                    purchaser: '1',
                                                                }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            },

            _validationAuth () {
                switch (this.identification) {
                    case '1':
                        this.auth.add        =       this.$has ('invoice:origin:add:2s')
                        this.auth.orc        =       this.$has ('invoice:origin:orc:2s')
                        this.auth.edit       =      this.$has ('invoice:origin:edit:2s')
                        this.auth.delBat     =    this.$has ('invoice:origin:delete:2s')
                        this.auth.collect    =   this.$has ('invoice:origin:collect:2s')
                        this.auth.drawback   =      this.$has ('invoice:drawback:add:s')
                        this.auth.abnormal   =      this.$has ('invoice:abnormal:add:s')
                        this.auth.deduction  =     this.$has ('invoice:deduction:add:s')
                        break
                    case '2':
                        this.auth.add        =       this.$has ('invoice:origin:add:2j')
                        this.auth.orc        =       this.$has ('invoice:origin:orc:2j')
                        this.auth.edit       =      this.$has ('invoice:origin:edit:2j')
                        this.auth.delBat     =    this.$has ('invoice:origin:delete:2j')
                        this.auth.collect    =   this.$has ('invoice:origin:collect:2j')
                        this.auth.drawback   =      this.$has ('invoice:drawback:add:j')
                        this.auth.abnormal   =      this.$has ('invoice:abnormal:add:j')
                        this.auth.deduction  =     this.$has ('invoice:deduction:add:j')
                        break
                    default:
                        this.auth.add        =        this.$has ('invoice:origin:add:2')
                        this.auth.orc        =        this.$has ('invoice:origin:orc:2')
                        this.auth.edit       =       this.$has ('invoice:origin:edit:2')
                        this.auth.delBat     =     this.$has ('invoice:origin:delete:2')
                        this.auth.collect    =    this.$has ('invoice:origin:collect:2')
                        this.auth.drawback   =        this.$has ('invoice:drawback:add')
                        this.auth.abnormal   =        this.$has ('invoice:abnormal:add')
                        this.auth.deduction  =       this.$has ('invoice:deduction:add')
                        break
                }
            },

            decideLoadDataWay () {
                this.identification = this.$route.params.identification || this.characteristic
                switch (this.identification) {
                    case '1':
                        this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad')
                        break
                    case '2':
                        this.$store.dispatch('d2admin/db/database', {user: true}).then (db => {
                            let projectCode, projectId, projectName
                            projectId = db.get('proID').value(), projectCode = db.get('proCode').value(), projectName = db.get('proName').value()
                            Object.assign (this.projectData, { projectCode, projectId, projectName, projectType: '2', contractId: this.contractId })
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
            copyImg,
            uploadImg,
            projectMessage,
            bottomInformation,
            'qqt-table': qqtTable,
            'qqtSelect': qqtSelect,
            'project-info': projectInfo,
            'project-common': projectCommon,
            'determine-project': determineProject
        },

        created () {
            this._validationAuth ()
            this.decideLoadDataWay ()
            this.getQueryDicByIdList ()
        },

        computed: {
            ...mapState ('d2admin/selfSupportProject', [
                'selfSupportProject'
            ])
        },

        watch: {

            selfSupportProject () {
                const { projectCode, projectCode: projectId, projectName } = this.selfSupportProject
                Object.assign (this.projectData, { projectCode, projectId, projectName, projectType: '1', contractId: this.contractId })
                this.getTicketReceiptRegistrationPage ()
            },

            $route (val) {
                if (val.path.indexOf('ticketReceiptRegistration') !== -1) {
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
    .el-date-editor .el-range-separator{
       padding: 0px;
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
    .ticketReceipt_registration_list_header_right {
        float: right;
        width: 45%;
        margin-top: 6px;
        text-align: right;
        .qqt-container-full-header___search .el-input {
            width: 20% !important;
        }
    }
}
</style>
