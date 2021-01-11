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
                        <fm-generate-form :data="jsonData" :remote="remote" :value="values" :transform="DrawbackShow" ref="generateForm" >
                             <template slot="financeType">
                                <el-form-item label="财务分类" prop="financeType" label-width="130px">
                                    <el-select v-model="values.financeType" :disabled="DrawbackShow.isShowDetails" style="width:100%" placeholder="请选择财务分类">
                                        <el-option  key="1" label="成本类" value="1"> </el-option>
                                        <el-option  key="2" label="费用类" value="2"> </el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                            <template slot="InvoiceDetails">
                                <invoice-details-form ref="invoiceDetails" :invoiceData="values" :transform='DrawbackShow'></invoice-details-form>
                            </template>
                        </fm-generate-form>
                         <div class="contract_conclude_sign_inventory_relate_table" :class="{'contract_conclude_alteration_inventory_relate_table': isAlteration}">
                            <draw-back-table  ref="DrawbackList" :drawbackLimit="drawbackLimit" :drawbackCumsum="drawbackCumsum" :addinvoiceDrawbackList="addinvoiceDrawbackList" :invoiceDrawbackList ="invoiceDrawbackList" :totalTax ="totalTax" :invoiceId="invoiceId"  :drawbackId="DrawbackId"
                                :isShowDetails="transform.isShowDetails"  @change="updataCurrentAmount" @btnClick="relateTableBtnClick" @delete="updataCurrentAmount">
                            </draw-back-table>
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
    import { addInvoiceDrawback, addSelfInvoiceDrawback, addJointInvoiceDrawback,
             editInvoiceDrawback, editSelfInvoiceDrawback, editJointInvoiceDrawback,
             queryByIdInvoiceDrawback, queryByIdSelfInvoiceDrawback, queryByIdJointInvoiceDrawback,
             queryByIdDrawbackHistory, queryByIdSelfDrawbackHistory, queryByIdJointDrawbackHistory,
             submitAddInvoiceDrawback, submitSelfAddInvoiceDrawback, submitJointAddInvoiceDrawback,
             resetSubmitAddInvoiceDrawback, resetSelfSubmitAddInvoiceDrawback, resetJointSubmitAddInvoiceDrawback, drawbackApproveOrRejectOrCancelled } from '@/api/selfProject/controlOverInvoices/InvoiceDrawBack'
    import { getSelfUnifyProject, getJointUnifyProject,queryByEnd, }  from '@/api/selfProject/controlOverInvoices/ticketReceiptRegistration'
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
    import drawBackTable from "./drawBackTable"
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
                DrawbackId:'',
                totalTax: 0,
                sendProcessId: '',
                identification: '',
                drawbackCumsum: '',
                drawbackLimit: '',
                jionProjectId: '',
                remote: {}, 
                values: {
                    financeType:'',
                },
                invoiceData: {},
                jsonData: {},
                cloneJsonData:{},
                nodeData: {
                    operation: '',
                    msg: ''
                },
                transform: {
                    isShowDetails: false
                },
                DrawbackShow: {
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
                DrawbackValues:{},
                addinvoiceDrawbackList : {},
                invoiceDrawbackList : [],
                getProjectList:[]
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

            getProjectCode (projectCode,id) {
                this.jionProjectId = id;
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
                        url = this.$route.params.startTag ? queryByIdSelfDrawbackHistory : queryByIdSelfInvoiceDrawback
                        break
                    case '2':
                        url = this.$route.params.startTag ? queryByIdJointDrawbackHistory : queryByIdJointInvoiceDrawback
                        break
                    default:
                        url = this.$route.params.startTag ? queryByIdDrawbackHistory : queryByIdInvoiceDrawback
                        break
                }
                url ({'id': id}).then (res => {
                    if (res) {
                        this.cloneJsonData = Object.assign({},res)
                        if ( url == queryByIdDrawbackHistory | url == queryByIdSelfDrawbackHistory | url == queryByIdJointDrawbackHistory) {
                            Object.assign (this.values, res)
                            this.invoiceDrawbackList = []
                            this.totalTax  = res.totalTax
                            this.invoiceId = res.id
                            this.DrawbackId = ''
                            this.drawbackLimit = res.drawbackLimit; 
                            this.drawbackCumsum = res.drawbackCumsum; 
                            this.invoiceDrawbackList = res.invoiceDrawbackList
                            this.fileDefaultNeaten (res)
                        }else {
                            this.invoiceDrawbackList = res.invoiceOrigin.invoiceDrawbackList
                            const {procCode,drawbackThis,drawbackCumsum,payeeName,payeeBank,payeeAccount,createName,createTime,remark,invoiceId,id,projectCode} = res;
                            this.addinvoiceDrawbackList = {procCode,drawbackThis,drawbackCumsum,payeeName,payeeBank,payeeAccount,createName,createTime,remark,invoiceId,id,projectCode}
                            this.drawbackLimit = res.invoiceOrigin.drawbackLimit; 
                            this.drawbackCumsum = res.invoiceOrigin.drawbackCumsum; 
                            this.totalTax  = res.invoiceOrigin.totalTax
                            this.invoiceId = res.invoiceId
                             this.DrawbackId = res.id
                            Object.assign (this.values, res.invoiceOrigin)
                            this.values.id = res.id;
                            this.fileDefaultNeaten (res.invoiceOrigin)
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
                let Drawback = {}, url = '', fileList = {}
                
                Drawback = this.getDrawback ()
                switch (this.identification) {
                    case '1':
                        url = this.$route.params.startTag ? addSelfInvoiceDrawback : editSelfInvoiceDrawback
                        break
                    case '2':
                        Drawback.projectId = this.jionProjectId;
                        url = this.$route.params.startTag ? addJointInvoiceDrawback : editJointInvoiceDrawback
                        break
                    default:
                        url = this.$route.params.startTag ? addInvoiceDrawback : editInvoiceDrawback
                        break
                }
                console.log(Drawback);
                url ( Drawback).then (res => {
                    if (res.code === 200) {
                        this.$message.success ('保存成功')
                        this.closePageTag ()
                    }
                })

            },

            getDrawback () {
                let data = {},fileList = {}
                data = this.$refs.DrawbackList.getData()
                fileList = this.$refs.bottomInformation.getData ()
                Object.assign (data, fileList)
                data.projectCode = this.cloneJsonData.projectCode
                data.projectId = this.cloneJsonData.projectId
                if (this.$route.params.startTag) {
                    data.invoiceCode = this.cloneJsonData.invoiceCode
                    data.invoiceType = this.cloneJsonData.invoiceType
                   
                } else {
                    data.invoiceCode = this.cloneJsonData.invoiceOrigin.invoiceCode
                    data.invoiceType = this.cloneJsonData.invoiceOrigin.invoiceType
                }
                return data
            },

            submitAddTicketReceiptRegistrationData () {
                let Drawback = this.$refs.DrawbackList.getData()
                let item = this.$refs.invoiceDetails.getFormData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && item) {
                        Object.assign (this.values, data)
                        this.dialogVisible = true
                        let title = '退税金额_项目'
                        if( this.identification ) {title = '退税金额'}
                        this.prossValue = {
                            title: this.$route.params.title || `${title}:【 ${Drawback.drawbackThis} 】`,
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.params.degree || '',
                            msg: '',
                        }
                    }
                })
            },

            updataAddTicketReceiptRegistration (item, boolean) {
                let Drawback = {}, url = '', fileList = {}
                Drawback = this.$refs.DrawbackList.getData()
                Drawback.projectCode = this.values.projectCode
                Drawback.projectId = this.values.projectId
                fileList = this.$refs.bottomInformation.getData ()
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                Drawback['completeTask'] = item
                switch (this.identification) {
                    case '1':
                        url = boolean ? resetSelfSubmitAddInvoiceDrawback : submitSelfAddInvoiceDrawback
                        break
                    case '2':
                        Drawback.projectId = this.jionProjectId;
                        url = boolean ? resetJointSubmitAddInvoiceDrawback: submitJointAddInvoiceDrawback
                        break
                    default:
                        url = boolean ? resetSubmitAddInvoiceDrawback : submitAddInvoiceDrawback
                        break
                }
                url (Drawback).then (res => {
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
                    let Drawback = this.$refs.DrawbackList.getData()
                    Drawback['completeTask'] = item
                    drawbackApproveOrRejectOrCancelled (Drawback).then (res => {
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
                        returnPath = 'InvoiceDrawBack/tabTop/1'
                        break
                    case '2':
                        returnPath = 'InvoiceDrawBack/jointProject/2'
                        break
                    default:
                        returnPath = 'InvoiceDrawBack'
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
                        this.sendProcessId = PROPRIETARYPROJECT.ADDINVOICEDRAWBACKPAGE
                        break
                    case '2':
                        this.sendProcessId = PORJECT_INFO.ADDJOINTINVOICEDRAWBACKPAGE
                        break
                    default:
                        this.sendProcessId = INVOICE.ADDINVOICEDRAWBACK
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
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent,
            'up-load': upload,
            'project-information-basic': projectInformationBasic,
            'invoice-details-form': invoiceDetailsForm,
            'bottom-information' :  bottomInformation,
            'qqt-relate-table' :qqtRelateTable,
            'draw-back-table': drawBackTable

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
