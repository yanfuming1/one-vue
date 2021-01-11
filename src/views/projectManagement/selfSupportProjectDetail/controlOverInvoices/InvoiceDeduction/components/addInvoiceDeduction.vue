<template>
    <d2-container type="fulls" class="addTicketReceiptRegistration">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
            </div>
            <div class="qqt-container-full-center___top">
                <qqt-flow-tabs :procInstId="procInstId">
                    <template slot="content">
                        <project-information-basic :transform="transform" v-if="identification == '1'" :values="values" @projectCode="getProjectCode" />
                        <joint-project-information-basic v-if="identification == '2'" :values="values" @projectCode="getProjectCode" />
                        <fm-generate-form :data="jsonData" :remote="remote" :value="values" :transform="deductionShow" ref="generateForm">
                            <template slot="InvoiceDetails">
                                <invoice-details-form ref="invoiceDetails" :invoiceData="values" :transform='deductionShow'></invoice-details-form>
                            </template>
                        </fm-generate-form>
                        <!-- 发票抵扣记录 -->
                         <div class="contract_conclude_sign_inventory_relate_table" :class="{'contract_conclude_alteration_inventory_relate_table': isAlteration}">
                            <deduction-table  ref="deductionList"  :invoiceDeductionList ="invoiceDeductionList" :addInvoiceDeductionList ="addInvoiceDeductionList" :totalTax ="totalTax" :invoiceId="invoiceId"  :deductionId="deductionId"
                                :isShowDetails="transform.isShowDetails"  @change="updataCurrentAmount" @btnClick="relateTableBtnClick" @delete="updataCurrentAmount">
                            </deduction-table>
                        </div> 
                        <div class="files-upload___right">
                             <bottom-information :values="values" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation" />
                        </div>
                    </template>
                </qqt-flow-tabs>
            </div>
            <div class="qqt-container-full-content___button">
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitAddTicketReceiptRegistrationData ()">重新提交</el-button>
                <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveTicketReceiptRegistration">保存</el-button>
                <el-button type="primary" v-if="!transform.isShowDetails && procInstId === ''" @click="values['flag'] = '1', submitAddTicketReceiptRegistrationData ()">提交</el-button>
                <el-button @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="sendProcessId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataAddTicketReceiptRegistration"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentAddTicketReceiptRegistration" />
    </d2-container>
</template>

<script>
    import { addInvoiceDeduction, addSelfInvoiceDeduction, addJointInvoiceDeduction,
             editInvoiceDeduction, editSelfInvoiceDeduction, editJointInvoiceDeduction,
             queryByIdInvoiceDeduction, queryByIdSelfInvoiceDeduction, queryByIdJointInvoiceDeduction,
             queryByIdTicketReceiptRegistration, queryByIdSelfTicketReceiptRegistration, queryByIdJointTicketReceiptRegistration,
             submitAddInvoiceDeduction, submitSelfAddInvoiceDeduction, submitJointAddInvoiceDeduction,
             resetSubmitAddInvoiceDeduction, resetSelfSubmitAddInvoiceDeduction, resetJointSubmitAddInvoiceDeduction, completeAddTicketReceiptRegistration } from '@/api/selfProject/controlOverInvoices/InvoiceDeduction'
    import { getSelfUnifyProject, getJointUnifyProject, queryByEnd }  from '@/api/selfProject/controlOverInvoices/ticketReceiptRegistration'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, upload, qqtRelateTable } from '@/components/qqt-subassembly'
    import { formGetJson } from '@/api/system/fromManagement/index'
    import { getUserDepartById } from '@/api/system/depart/depart'
    import { PROPRIETARYPROJECT, INVOICE } from '@/enum/FORMCODE'
    import { PURCHASEREQUEST } from '@/enum/DICTIONARY'
    import { queryDicById } from '@/api/system/dic/dic'
    import { getDetails } from '@/api/approval/common'
    import { PORJECT_INFO } from '@/enum/PROJECT'
    import { mapActions } from 'vuex'

    import util from '@/libs/util.js'
    import deductionTable from './deductionTable'
    import bottomInformation from '../../../businessBidding/components/bottomInformation'
    import invoiceDetailsForm from '../../ticketReceiptRegistration/components/invoiceDetailsForm'
    import projectInformationBasic from '../../../operatingReserve/components/projectInformationBasic'
    import jointProjectInformationBasic from '../../../../jontProjectDetail/components/jointProjectInformationBasic'
    let that = this
    export default {

        data () {
            return {
                title: '',
                stutas: '',
                procInstId: '',
                invoiceId:'',
                deductionId:'',
                sendProcessId: '',
                identification: '',
                totalTax: 0,
                getProjectList:[],
                remote: {}, 
                values: {
                },
                invoiceData: {},
                jsonData: {},
                nodeData: {
                    operation: '',
                    msg: ''
                },
                transform: {
                    isShowDetails: false
                },
                deductionShow: {
                     isShowDetails: true
                },
                prossValue: {
                    title: ''
                },
                visible: false,
                isReject: false,
                isSendBack: false,
                isAlteration: false,
                isTurnManage: false,
                dialogVisible: false,
                processModuleId: PROPRIETARYPROJECT.INVOICERLATEDINFORMATION,
                upLoadFileDefaultList: [],
                bindingRequiredList: [],
                deductionValues:{},
                invoiceDeductionList : [],
                addInvoiceDeductionList:{}
            }
        },

        methods: {

            ...mapActions('d2admin/page', [
                'close',
            ]),

            getFormByJson () {
                let code = this.identification == '' ? this.processModuleId : this.processModuleId + '2'
                formGetJson ({ 'code': code }).then(res => {
                    if (res) {
                        let element = JSON.parse(res)
                        if (this.$route.params.contractSource) {
                            element.list.forEach (item => {
                                if (item.model == 'contract') {
                                    item.columns[0]['list'][0].options.disabled = true
                                    item.columns[2]['list'][0].options.disabled = true
                                }
                            })
                        }
                        this.jsonData = element
                    }
                })
            },

            getProjectCode (projectCode) {
                this.values['projectCode'] = projectCode
            },

            getContractList (projectType,projectCode,invoiceSource="支出合同") {
                queryByEnd ({projectType,projectCode,invoiceSource}).then(res=> {
                    this.bindingRequiredList = res;
                }).finally(res=>{
                    this.neatenData();
                })
            },
            getAllSelfProjectData () {
                getSelfUnifyProject ().then(res=> {
                    this.getProjectList = res;
                }).finally(res => {
                    this.neatenData();
                })
            },
            getAllJointProjectData () {
               getJointUnifyProject ().then(res=> {
                    this.getProjectList = res;
                }).finally(res => {
                    this.neatenData();
                })
            },

            getAddTicketReceiptRegistration (id) {
                let url = ''
                switch (this.identification) {
                    case '1':
                        url = this.$route.params.startTag ? queryByIdSelfTicketReceiptRegistration : queryByIdSelfInvoiceDeduction
                        break
                    case '2':
                        url = this.$route.params.startTag ? queryByIdJointTicketReceiptRegistration : queryByIdJointInvoiceDeduction
                        break
                    default:
                        url = this.$route.params.startTag ? queryByIdTicketReceiptRegistration : queryByIdInvoiceDeduction
                        break
                }
                url ({'id': id}).then (res => {
                    if (res) {
                        if ( url == queryByIdTicketReceiptRegistration | url == queryByIdSelfTicketReceiptRegistration | url == queryByIdJointTicketReceiptRegistration) {
                            this.values = {...this.values,...res}
                            this.invoiceDeductionList = []
                            this.totalTax  = res.totalTax
                            this.invoiceId = res.id
                            this.deductionId = ''
                            this.fileDefaultNeaten (res)
                           
                        }else {
                            const {procCode,deductionThis,deductionCumsum,createName,createTime,remark,id,companyName,companyId,departmentId,departmentName} = res;
                            this.addInvoiceDeductionList = {procCode,deductionThis,deductionCumsum,createName,createTime,remark,id}
                            this.invoiceDeductionList = res.invoiceOrigin.invoiceDeductionList
                            this.totalTax  = res.invoiceOrigin.totalTax
                            this.invoiceId = res.invoiceId
                            this.deductionId = res.id
                            this.values = {...this.values, ...res.invoiceOrigin,companyName,companyId,departmentId,departmentName,createName,createTime,}
                            this.values.id = res.id;
                            this.fileDefaultNeaten (res)
                        }
                        if (this.values.projectType == '1') {
                            this.getAllSelfProjectData();
                        } else if (this.values.projectType == '2'){
                            this.getAllJointProjectData();
                        }
                        this.getContractList(this.values.projectType,this.values.projectCode);
                    }
                })
            },

            relateTableBtnClick (data, prop, index, label) {
                let item = { conid: data.id, key: prop, label }
                this.contractAlteration = item
                this.alterationVisible = true
            },

            updataCurrentAmount (data, prop, value) {
                let num = 0, list = []
            },

            updataOtherAmount (num) {
           
            },

            saveTicketReceiptRegistration () {
                let deduction = {}, url = '', fileList = {}
                deduction = this.$refs.deductionList.getData()
                fileList = this.$refs.bottomInformation.getData ()
                deduction.projectCode = this.values.projectCode
                deduction.projectId = this.values.projectId
                Object.assign (deduction, fileList)
                switch (this.identification) {
                    case '1':
                        url = this.$route.params.startTag ? addSelfInvoiceDeduction : editSelfInvoiceDeduction
                        break
                    case '2':
                        url = this.$route.params.startTag ? addJointInvoiceDeduction : editJointInvoiceDeduction
                        break
                    default:
                        url = this.$route.params.startTag ? addInvoiceDeduction : editInvoiceDeduction
                        break
                }
                url ( deduction).then (res => {
                    if (res.code === 200) {
                        this.$message.success ('保存成功')
                        this.closePageTag ()
                    }
                })
            },

            getDecution () {
                let url = '', item = {}, fileList = {}, invoiceDeductionList = [], deduction = {}
              
            },

            submitAddTicketReceiptRegistrationData () {
                let deduction = this.$refs.deductionList.getData()
                let item = this.$refs.invoiceDetails.getFormData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && item && deduction) {
                        Object.assign (this.values, data)
                        this.dialogVisible = true
                        let title = '抵扣金额_项目'
                        if( this.identification ) {title = '抵扣金额'}
                        this.prossValue = {
                            title: this.$route.params.title || `${title}:【 ${util.moneySepFormat(deduction.deductionThis)} 元】`,
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.params.degree || '',
                            msg: '',
                        }
                    }
                })
            },

            updataAddTicketReceiptRegistration (item, boolean) {
                let deduction = {}, url = '', fileList = {}
                deduction = this.$refs.deductionList.getData()
                fileList = this.$refs.bottomInformation.getData ()
                deduction.projectCode = this.values.projectCode
                deduction.projectId = this.values.projectId
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                deduction['completeTask'] = item
                Object.assign (deduction, fileList)
                switch (this.identification) {
                    case '1':
                        url = boolean ? resetSelfSubmitAddInvoiceDeduction : submitSelfAddInvoiceDeduction
                        break
                    case '2':
                        url = boolean ? resetJointSubmitAddInvoiceDeduction : submitJointAddInvoiceDeduction
                        break
                    default:
                        url = boolean ? resetSubmitAddInvoiceDeduction : submitAddInvoiceDeduction
                        break
                }
                url (deduction).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closePageTag ()
                    }
                })
                
            },

            consentAddTicketReceiptRegistration (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closePageTag ()
                    return
                }
                if (item) {
                    this.values['completeTask'] = item
                    completeAddTicketReceiptRegistration (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success (res.message)
                            this.closePageTag ()
                        }
                    })
                }
            },

            getQueryDicByIdList () {
                queryDicById ({id: PURCHASEREQUEST.INVOICETYPE}).then(res =>{
                    if (res && res.length > 0) { this.invoiceTypeArr = res, this.neatenData () }
                }).finally(res => {
                    this.getFormByJson()
                })
            },

            getDetailsList (taskId) {
                getDetails (taskId).then (res => { if (res) this.nodeData = res })
            },

            closePageTag () {
                let path = ``, returnPath = ''
                let tagName = this.$route.path
                switch (this.identification) {
                    case '1':
                        returnPath = 'InvoiceDeduction/tabTop/1'
                        break
                    case '2':
                        returnPath = 'InvoiceDeduction/jointProject/2'
                        break
                    default:
                        returnPath = 'InvoiceDeduction'
                        break
                }
                this.stutas ? path = `/approval/${this.stutas}` : path = `/projectManagement/selfSupportProjectDetail/controlOverInvoices/${returnPath}`
                this.close ({ tagName, path })
            },

            upLoadFileCallBack (item) {
                this.values.fileList = item
            },

            fileDefaultNeaten (res) {
                if (res.fileList && res.fileList.length > 0) {
                    res.fileList.forEach(item => {
                        let m = {
                            status : 'finished',
                            response : {
                                url : item.url,
                                size: item.size,
                                name: item.name
                            }
                        }
                        this.upLoadFileDefaultList.push(m)
                    })
                }
            },

            neatenData () {
                this.remote = {
                    getInvoiceType(resolve){
                        resolve(that.invoiceTypeArr) 
                    },

                    getbindingRequired (resolve) {
                        resolve (that.bindingRequiredList)
                    },

                    getInvoiceSource (resolve) {
                        resolve (
                            [
                                {
                                    value: '1',
                                    label: '收入合同'
                                },
                                {
                                    value: '2',
                                    label: '支出合同'
                                }
                            ]
                        )
                    },
                    getProjectList (resolve) {
                        resolve (that.getProjectList)
                    },
                    getProjectTypeList (resolve) {
                        resolve (
                            [
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
                                },
                            ]
                        )
                    },
                }
            },

            updataRouter () {
                if (this.$route.params) {
                    this.transform = this.$route.params.transform || {}
                    this.stutas = this.$route.params.pathName || ''
                    this.procInstId = this.$route.params.procInstId || ''
                    this.identification = this.$route.params.identification || ''
                }
                switch (this.identification) {
                    case '1':
                        this.sendProcessId = PROPRIETARYPROJECT.ADDCONTROLINVOICEDEDUCTION
                        break
                    case '2':
                        this.sendProcessId = PORJECT_INFO.ADDJOINTCONTROLINVOICEDEDUCTION
                        break
                    default:
                        this.sendProcessId = INVOICE.ADDINVOICEDEDUCTION
                        break
                }
                if (this.$route.params && this.$route.params.taskId) {
                    this.getDetailsList (this.$route.params.taskId)
                }
                if (this.$route.params && this.$route.params.relevancyId) {
                    this.getAddTicketReceiptRegistration (this.$route.params.relevancyId)
                }
            }
        },

        created () {
            this.updataRouter ()
            this.getQueryDicByIdList ()
        },

        mounted () {
            that = this
        },

        components: {
            'joint-project-information-basic': jointProjectInformationBasic,
            'project-information-basic': projectInformationBasic,
            'invoice-details-form': invoiceDetailsForm,
            'bottom-information' :  bottomInformation,
            'qqt-send-process': qqtSendProcess,
            'qqt-relate-table' :qqtRelateTable,
            'deduction-table' :deductionTable,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent,
            'up-load': upload,
        }
    }
</script>

<style lang='scss'>
    .addTicketReceiptRegistration {
        .files-upload___right {
            margin-left: 0px
        }
    }
</style>
