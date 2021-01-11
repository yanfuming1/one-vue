<template>
    <d2-container type="fulls" class="addTicketReceiptRegistration">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
            </div>
            <div class="qqt-container-full-center___top">
                <qqt-flow-tabs :procInstId="procInstId">
                    <template slot="content">
                        <project-information-basic ref="information"  v-if="identification == '1'" :transform="transform" :values="values" @projectCode="getProjectCode"  />
                        <joint-project-information-basic v-if="identification == '2'" :values="values" @projectCode="getProjectCode" />
                        <fm-generate-form :data="jsonData" :remote="remote" :value="values" :transform="transform" ref="generateForm" @on-change="selectGenerateChange">
                            <template slot="financeType">
                                <el-form-item label="财务分类" prop="financeType" label-width="130px">
                                    <el-select v-model="values.financeType" :disabled="transform.isShowDetails" style="width:100%" placeholder="请选择财务分类">
                                        <el-option  key="1" label="成本类" value="1"> </el-option>
                                        <el-option  key="2" label="费用类" value="2"> </el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                            <template slot="InvoiceDetails">
                                <invoice-details-form ref="invoiceDetails" :transform="transform" :selectData="selectData" :invoiceData="values"></invoice-details-form>
                            </template>
                        </fm-generate-form>
                         <div class="files-upload___right">
                             <bottom-information :values="values"  :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation" />
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
                <el-button type="info" size="mini" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                <el-button @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="sendProcessId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataAddTicketReceiptRegistration"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentAddTicketReceiptRegistration" />
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </d2-container>
</template>

<script>
    import { addTicketReceiptRegistration, addSelfTicketReceiptRegistration, addJointTicketReceiptRegistration,
             editTicketReceiptRegistration, editSelfTicketReceiptRegistration, editJointTicketReceiptRegistration,
             queryByIdTicketReceiptRegistration, queryByIdSelfTicketReceiptRegistration, queryByIdJointTicketReceiptRegistration,
             submitAddTicketReceiptRegistration, submitSelfAddTicketReceiptRegistration, submitJointAddTicketReceiptRegistration,
             resetSubmitAddTicketReceiptRegistration, resetSelfSubmitAddTicketReceiptRegistration, resetSubmitJointAddTicketReceiptRegistration,
             getSelfUnifyProject, getJointUnifyProject, queryByEnd,
             completeAddTicketReceiptRegistration } from '@/api/selfProject/controlOverInvoices/ticketReceiptRegistration'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, upload, qqtRelateTable } from '@/components/qqt-subassembly'
    import { parameterList, onOurPart} from '@/api/selfProject/controlOverInvoices/parameterSetting'
    import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
    import { formGetJson } from '@/api/system/fromManagement/index'
    import { getUserDepartById } from '@/api/system/depart/depart'
    import { PROPRIETARYPROJECT, INVOICE } from '@/enum/FORMCODE'
    import { PURCHASEREQUEST } from '@/enum/DICTIONARY'
    import { queryDicById } from '@/api/system/dic/dic'
    import { getDetails } from '@/api/approval/common'
    import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
    import { PORJECT_INFO } from '@/enum/PROJECT'
    import { mapActions } from 'vuex'

    import util from '@/libs/util.js'
    import invoiceDetailsForm from './invoiceDetailsForm'
    import bottomInformation from '../../../businessBidding/components/bottomInformation'
    import projectInformationBasic from '../../../operatingReserve/components/projectInformationBasic'
    import printTemplateByHtml from '../../../../../systemManagement/printTemplate/components/printTemplateByHtml'
    import jointProjectInformationBasic from '../../../../jontProjectDetail/components/jointProjectInformationBasic'
    let that = this
    export default {

        data () {
            return {
                title: '',
                stutas: '',
                procInstId: '',
                sendProcessId: '',
                identification: '',
                remote: {},
                values: {
                    financeType:'',
                    contractCode:'',
                    contractId:'',
                    contractName:'',
                    projectCode:'',
                    projectName:'',
                    projectId:'',
                },
                invoiceData: {},
                jsonData: {},
                getProjectList:[],
                nodeData: {
                    operation: '',
                    msg: ''
                },
                selectData: [],
                transform: {
                    isShowDetails: false
                },
                prossValue: {
                    title: ''
                },
                visible: false,
                isReject: false,
                isSendBack: false,
                isTurnManage: false,
                dialogVisible: false,
                code: BASICSCODE.SELF_INVOICE_ORIGIN,
                processModuleId: PROPRIETARYPROJECT.INVOICERLATEDINFORMATION,
                upLoadFileDefaultList: [],
                bindingRequiredList: [],
                projectObj:{},
            }
        },

        methods: {

            ...mapActions('d2admin/page', [
                'close',
            ]),

            getFormByJson () {
                let code = this.identification == '' ? this.processModuleId : this.processModuleId + '2'
                formGetJson ({ 'code': code}).then(res => {
                    if (res) {
                        let element = JSON.parse(res)
                        if (this.$route.params.contractSource) {
                            element.list.forEach (item => {
                                if (item.model == 'contract') {
                                    item.columns[0]['list'][0].options.disabled = true
                                    item.columns[2]['list'][0].options.disabled = true
                                }
                                if (this.$route.params.contractId && this.values.projectId) {
                                    if (item.model == 'identity') {
                                        item.columns[0]['list'][0].options.disabled = true
                                        item.columns[1]['list'][0].options.disabled = true
                                    }
                                }
                            })
                        }
                        this.jsonData = element
                    }
                })
            },

            getProjectCode (projectCode, projectId, projectName, projectType) {
                this.projectObj = { projectCode, projectId, projectName, projectType }
                Object.assign (this.values, this.projectObj)
                if (this.identification) this.getContractList (this.values.projectType, projectCode)
                this.getFormByJson ()
            },

            selectGenerateChange (field, val, models) {
                if (field == 'projectType') {
                    switch (val) {
                        case '1':
                            this.bindingRequiredList = [];
                            this.getAllSelfProjectData();
                            break;
                        case '2':
                            this.bindingRequiredList = [];
                            this.getAllJointProjectData();
                            break;
                        case '3':
                            this.getProjectList = [];
                            this.getContractList ('3','');
                            break;
                        default:
                            break;
                    }
                    this.$set(this.values,'contractCode','')
                    this.$set(this.values,'contractName','')
                    this.$set(this.values,'contractId','')
                    this.$set(this.values,'projectCode','')
                    this.$set(this.values,'projectId','')
                    this.$set(this.values,'projectName','')
                }
                switch (field) {
                    case 'contractId':
                        let contract = this.bindingRequiredList.find (item => item.id == val)
                        if (contract) {
                             this.$set(this.values,'contractCode',contract.contractcode)
                             this.$set(this.values,'contractName',contract.contractname)
                             this.$set(this.values,'contractId',contract.id)
                        } else {
                             this.$set(this.values,'contractCode','')
                             this.$set(this.values,'contractName','')
                             this.$set(this.values,'contractId','')
                        }
                        break
                    case 'projectId':
                        let projectData = this.getProjectList.find (item => item.projectId == val)
                        if (projectData) {
                            this.getContractList(models.projectType, projectData.projectCode)
                            this.$set(this.values, 'projectCode', projectData.projectCode)
                            this.$set(this.values, 'projectId', projectData.projectId)
                            this.$set(this.values, 'projectName', projectData.projectName)
                        }
                        this.$set(this.values, 'contractCode', '')
                        this.$set(this.values, 'contractName', '')
                        this.$set(this.values, 'contractId', '')
                        break
                    default:
                        this.values[field] = val
                        break
                }
            },

            getContractList (projectType, projectCode, invoiceSource = "支出合同") {
                queryByEnd ({projectType, projectCode, invoiceSource}).then(res=> {
                    if (res && res.length > 0) {
                        this.bindingRequiredList = res
                        if (this.identification && this.$route.params.contractId) this.selectGenerateChange ('contractId', this.$route.params.contractId, {})
                    }
                }).finally(res=>{
                    this.neatenData();
                })
            },

            getAllSelfProjectData () {
                getSelfUnifyProject ().then(res=> {
                    this.getProjectList = res
                }).finally(res => {
                    this.neatenData();
                })
            },

            getAllJointProjectData () {
               getJointUnifyProject ().then(res=> {
                    this.getProjectList = res
                }).finally(res => {
                    this.neatenData();
                })
            },

            getAddTicketReceiptRegistration (id) {
                let url = ''
                switch (this.identification) {
                    case '1':
                        url = queryByIdSelfTicketReceiptRegistration
                        break
                    case '2':
                        url = queryByIdJointTicketReceiptRegistration
                        break
                    default:
                        url = queryByIdTicketReceiptRegistration
                        break
                }
                url ({'id': id}).then (res => {
                    if (res) {
                        Object.assign (this.values, res)
                        this.neatenProjectInformation ()
                        this.fileDefaultNeaten (res)
                    }
                })
            },

            saveTicketReceiptRegistration () {
                let url = '', item = {}
                let bomData = this.$refs.bottomInformation.getData ()
                item = this.$refs.invoiceDetails.getFormData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && item && bomData) {
                        let projectData = this.getProjectList.find (ele => ele.projectId == data.projectId) 
                        let contract = this.bindingRequiredList.find (ele => ele.id == data.contractId)
                        if (projectData) {
                            data.projectName = projectData.projectName;
                        } else {
                            data.projectName = '';
                        }
                        if (contract) {
                            data.contractName = contract.contractname;
                        } else {
                            data.contractName  = '';
                        }
                        Object.assign (this.values,  item,bomData,data)
                        if (this.identification) {
                            this.values =  {...this.values, ...this.projectObj}
                        }
                        switch (this.identification) {
                            case '1':
                                url = this.values.id == null ? addSelfTicketReceiptRegistration : editSelfTicketReceiptRegistration
                                break
                            case '2':
                                url = this.values.id == null ? addJointTicketReceiptRegistration : editJointTicketReceiptRegistration
                                break
                            default:
                                url = this.values.id == null ? addTicketReceiptRegistration : editTicketReceiptRegistration
                                break
                        }
                        url (this.values).then (res => {
                            if (res.code === 200) {
                                this.$message.success ('保存成功')
                                this.closePageTag ()
                            }
                        })
                    }
                })
            },

            submitAddTicketReceiptRegistrationData () {
                let item = this.$refs.invoiceDetails.getFormData ()
                let bomData = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && item && bomData) {
                        let projectData = this.getProjectList.find (ele => ele.projectId == data.projectId) 
                        let contract = this.bindingRequiredList.find (ele => ele.id == data.contractId)
                        if (projectData) {
                            data.projectName = projectData.projectName;
                        } else {
                            data.projectName = '';
                        }
                        if (contract) {
                            data.contractName = contract.contractname;
                        } else {
                            data.contractName  = '';
                        }
                        Object.assign (this.values, item,bomData,data)
                        if (this.identification) {
                            this.values =  {...this.values, ...this.projectObj}
                        }
                        this.dialogVisible = true
                         let title = '添加收票_项目'
                        if( this.identification == '' ) {title = '添加收票'}
                        this.prossValue = {
                            title: this.$route.params.title || `${title}:【${this.values.noteDrawer} 】`,
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.params.degree || '',
                            msg: '',
                        }
                    }
                })
            },

            updataAddTicketReceiptRegistration (item, boolean) {
                let url = ''
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                switch (this.identification) {
                    case '1':
                        url = boolean ? resetSelfSubmitAddTicketReceiptRegistration : submitSelfAddTicketReceiptRegistration
                        break
                    case '2':
                        url = boolean ? resetSubmitJointAddTicketReceiptRegistration : submitJointAddTicketReceiptRegistration
                        break
                    default:
                        url = boolean ? resetSubmitAddTicketReceiptRegistration : submitAddTicketReceiptRegistration
                        break
                }
                url (this.values).then (res => {
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
                    if (this.identification == '') this.getFormByJson()
                })
            },

            getDetailsList (taskId) {
                getDetails (taskId).then (res => { if (res) this.nodeData = res })
            },

            closePageTag () {
                let path = ``
                let tagName = this.$route.path
                let name = this.$route.params.name
                let params = { characteristic: this.$route.params.characteristic, contractId: this.$route.params.contractId }
                this.stutas ? path = `/approval/${this.stutas}` : path = `${this.$route.params.path}`
                this.$route.params.contractId ? this.close ({ tagName, path, name, params }) : this.close ({ tagName, path })
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

                    getProjectList (resolve) {
                        resolve (that.getProjectList)
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

            // 获取发票参数配置
            getSelectData (data) {
                onOurPart (data).then(result=> {
                    const {address,bank,name,registerNum} = result
                    let newObj = {
                        purchaserName: name,
                        purchaserRegisterNum: registerNum,
                        purchaserAddress: address,
                        purchaserBank: bank,
                        contractId: this.$route.params.contractId,
                        invoiceSource: this.$route.params.invoiceSource
                    }
                    Object.assign (this.values, newObj)
                }).finally(result=> {
                    data.purchaser = 0;
                    parameterList (data).then(res=> {
                        this.selectData = res
                    })
                })
               
            },

            neatenProjectInformation () {
                if (this.values.projectCode) {
                    switch (this.values.projectType) {
                        case '1':
                            this.getAllSelfProjectData()
                            break
                        case '2':
                            this.getAllJointProjectData()
                            break
                    }
                    this.getContractList (this.values.projectType, this.values.projectCode)
                }
                if (this.identification) {
                    this.values =  {...this.values, ...this.projectObj}
                }
            },

            printTemplate () {
                getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.$route.params.relevancyId}).then(res => {
                    // console.log(res)
                    res.financeType = res.financeType === '1' ? '成本类' : res.financeType === '2' ? '费用类' : ''
                    if (res) this.$refs.printTemp.printTemplate (res)
                })
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
                        this.sendProcessId = PROPRIETARYPROJECT.ADDCONTROLTICKETRECEIPTREGISTRATION
                        break
                    case '2':
                        this.sendProcessId = PORJECT_INFO.ADDJOINTCONTROLTICKETRECEIPTREGISTRATION
                        break
                    default:
                        this.sendProcessId = INVOICE.ADDTICKETRECEIPTREGISTRATION
                        break
                }
                if (this.$route.params && this.$route.params.taskId) {
                    this.getDetailsList (this.$route.params.taskId)
                }
                if (this.$route.params && this.$route.params.relevancyId) {
                    this.getAddTicketReceiptRegistration (this.$route.params.relevancyId)
                } else {
                    if (this.$route.params.data == '') {
                        this.showSelect = true
                        this.getSelectData({invoiceSource: this.$route.params.invoiceSource, purchaser: this.$route.params.purchaser})
                    }
                }
                if (this.$route.params && !this.$route.params.relevancyId && this.$route.params.data) {
                    Object.assign (this.values, this.$route.params.data)
                    this.neatenProjectInformation ()
                    this.fileDefaultNeaten (this.values)
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
            'print-template-by-html': printTemplateByHtml,
            'invoice-details-form': invoiceDetailsForm,
            'bottom-information' :  bottomInformation,
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent,
            'up-load': upload,
        }
    }
</script>

<style lang='scss'>
     .addTicketReceiptRegistration {
        .files-upload___right {
            margin-left: 0px !important 
        }
    }
</style>
