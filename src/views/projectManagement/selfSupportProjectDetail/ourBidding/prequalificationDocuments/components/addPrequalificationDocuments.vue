<template>
    <d2-container type="fulls" class="addPrequalificationDocuments">
        <el-card class="box-card closeHeader">
            <div slot="header">
               <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
           </div>
           <div class="qqt-container-full-center___top">
               <qqt-flow-tabs :procInstId="procInstId">
                   <template slot="content">
                        <announcement-basic-information :values="values" :transform="transformNotShow" ref="basicInformation" />
                        <bidding-contact-information :values="values" :transform="transformNotShow" ref="biddingInformation" />
                        <fm-generate-form 
                           :data="jsonData"
                           :remote="remote"
                           :value="values"
                           :transform="transform"
                           ref="generateForm"
                           @on-change="selectGenerateChange"/>

                        <div class="review-prequalification-documents">
                            <div class="review-prequalification-documents-top">
                                <p>注：可点击或拖拽上传，可上传图片、文档、压缩包等类型文件，单个文件大小不能超过20M</p>
                            </div>
                            <div class="review-prequalification-documents-conent">
                                <el-tabs v-model="activeName" @tab-click="handleClick">
                                    <el-tab-pane label="商务标审核" name="businessStandard">
                                        <div class="files-upload___right">
                                            <up-load id="male" v-if="showBusiness" @upLoadFileCallBack="upLoadFileCallBack" :isShowUpload="!transform.isShowDetails" :propList="businessStandardList" ref="upLoad1" />
                                        </div>
                                    </el-tab-pane>
                                    <el-tab-pane label="技术标审核" name="technicalStandard">
                                        <div class="files-upload___right">
                                            <up-load id="male" v-if="showTechnical" @upLoadFileCallBack="upLoadFileCallBack" :isShowUpload="!transform.isShowDetails" :propList="technicalStandardList" ref="upLoad2" />
                                        </div>
                                    </el-tab-pane>
                                    <el-tab-pane label="预算审核" name="budgetAudit">
                                        <div class="files-upload___right">
                                            <up-load id="male" v-if="showBudget" @upLoadFileCallBack="upLoadFileCallBack" :isShowUpload="!transform.isShowDetails" :propList="budgetAuditList" ref="upLoad3" />
                                        </div>
                                    </el-tab-pane>
                                    <el-tab-pane label="其他内容审核" name="otherContents">
                                        <div class="files-upload___right">
                                            <up-load id="male" v-if="showOther" @upLoadFileCallBack="upLoadFileCallBack" :isShowUpload="!transform.isShowDetails" :propList="otherContentsList" ref="upLoad4" />
                                        </div>
                                    </el-tab-pane>
                                </el-tabs>
                            </div>
                        </div>
                       <bottom-information :fieldTitle="'申请'" :timeTitle="'申请'" :values="values" :isShowAccessory="false" :transform="transform" ref="bottomInformation" />
                   </template>
               </qqt-flow-tabs>
           </div>
           <div class="qqt-container-full-content___button">
               <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitAddPrequalificationDocumentsData ()">重新提交</el-button>
               <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
               <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
               <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
               <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
               <el-button type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveAddPrequalificationDocuments">保存</el-button>
               <el-button type="primary" v-if="!transform.isShowDetails && procInstId === ''" @click="values['flag'] = '1', submitAddPrequalificationDocumentsData ()">提交</el-button>
               <el-button type="info" size="mini" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
               <el-button @click="closePageTag">关闭</el-button>
           </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataAddPrequalificationDocuments"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentAddPrequalificationDocuments" />
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </d2-container>
</template>

<script>
    import { prequalificationDocumentsQueryById, prequalificationDocumentsAdd, prequalificationDocumentsEdit, prequalificationDocumentsSubmit,
        prequalificationDocumentsReSubmit, prequalificationDocumentsOperation } from '@/api/selfProject/ourBidding/prequalificationDocuments/index'
    import { bidFileDocQueryById, bidFileDocAdd, bidFileDocEdit, bidFileDocSubmit, bidFileDocReSubmit, bidFileDocOperation} from '@/api/selfProject/ourBidding/bidFileDoc/index'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, upload, qqtRelateTable } from '@/components/qqt-subassembly'
    import { formGetJson } from '@/api/system/fromManagement/index'
    import { getAnnouncementChangeByProjectCode } from '@/api/selfProject/businessBidding/announcementChange/index'
    import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
    import { getUserDepartById } from '@/api/system/depart/depart'
    import { PROPRIETARYPROJECT } from '@/enum/FORMCODE'
    import { getDetails } from '@/api/approval/common'
    import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
    import { mapActions } from 'vuex'
    import util from '@/libs/util.js'

    import printTemplateByHtml from '../../../../../systemManagement/printTemplate/components/printTemplateByHtml'
    import announcementBasicInformation from '../../../businessBidding/components/announcementBasicInformation'
    import biddingContactInformation from '../../components/biddingContactInformation'
    import bottomInformation from '../../../businessBidding/components/bottomInformation'
    let than = this
    export default {

        data () {
            return {
                code: '',
                title: '',
                stutas: '',
                procInstId: '',
                remote: {},
                values: {},
                activeName: 'businessStandard',
                jsonData: {},
                nodeData: {
                    operation: '',
                    msg: ''
                },
                transform: {
                    isShowDetails: false
                },
                transformNotShow: {
                    isShowDetails: true
                },
                prossValue: {
                    title: ''
                },
                proId: '',
                proCode: '',
                visible: false,
                isReject: false,
                isSendBack: false,
                isTurnManage: false,
                dialogVisible: false,
                processModuleId: PROPRIETARYPROJECT.ADDPREQUALIFICATIONDOCUMENTS,
                businessStandardList: [],
                technicalStandardList: [],
                budgetAuditList: [],
                otherContentsList: [],
                departmentList: [],

                showBusiness: true,
                showTechnical: false,
                showBudget: false,
                showOther: false,
            }
        },

        methods: {

            ...mapActions('d2admin/page', [
                'close',
            ]),

            getFormByJson () {
                formGetJson ({ 'code': this.processModuleId }).then(res => {
                    // if (res) this.jsonData = JSON.parse(res)
                })
            },

            selectGenerateChange () {

            },

            handleClick(tab, event) {
                this.activeName = tab.name
                switch(tab.name) {
                    case 'businessStandard' : 
                        this.showBusiness = true
                        this.showTechnical = false
                        this.showBudget = false
                        this.showOther = false
                        break
                    case 'technicalStandard' :
                        this.showBusiness = false
                        this.showTechnical = true
                        this.showBudget = false
                        this.showOther = false
                        break
                    case 'budgetAudit' :
                        this.showBusiness = false
                        this.showTechnical = false
                        this.showBudget = true
                        this.showOther = false
                        break
                    case 'otherContents' :
                        this.showBusiness = false
                        this.showTechnical = false
                        this.showBudget = false
                        this.showOther = true
                        break
                }
            },

            getAddPrequalificationDocuments (id) {
                let url = ''
                if (this.$route.params.formKey) {
                    url = this.$route.params.formKey === 'addPrequalificationDocuments' ? prequalificationDocumentsQueryById : bidFileDocQueryById
                } else {
                    url = this.$route.params.identification === '1' ? bidFileDocQueryById : prequalificationDocumentsQueryById
                }
                url ({'id': id}).then (res => {
                    if (res) {
                        this.getInfo(res.projectCode)
                        this.values = Object.assign ({}, this.values, res)
                        if (this.$route.params.formKey) {
                            this.prossValue.title = this.$route.params.formKey === 'addPrequalificationDocuments' ? `自营资格预审文件审核审批:【 ${this.values.projectName} 】` : `投标文件编制审核审批:【 ${this.values.projectName} 】`
                        } else {
                            this.prossValue.title = this.$route.params.identification === '1' ? `投标文件编制审核审批:【 ${this.values.projectName} 】` : `自营资格预审文件审核审批:【 ${this.values.projectName} 】`
                        }
                        this.procInstId = res.procInstId ? res.procInstId : ''
                        this.fileDefaultNeaten (res.businessFileList , '1')
                        this.fileDefaultNeaten (res.skillFileList , '2')
                        this.fileDefaultNeaten (res.budgetFileList , '3')
                        this.fileDefaultNeaten (res.otherFileList , '4')
                    }
                })
            },

            saveAddPrequalificationDocuments () {
                let url = ''
                let item = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && item) {
                        this.values = Object.assign ({}, this.values, data, item)
                        if (this.$route.params.identification === '1') {
                            this.values.id == null ? url = bidFileDocAdd : url = bidFileDocEdit
                        } else {
                            this.values.id == null ? url = prequalificationDocumentsAdd : url = prequalificationDocumentsEdit
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

            submitAddPrequalificationDocumentsData () {
                let item = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && item) {
                        this.values = Object.assign ({}, this.values, data, item)
                        this.dialogVisible = true
                        let title = ''
                        if (this.$route.params.formKey) {
                            title = this.$route.params.formKey === 'addPrequalificationDocuments' ? `自营资格预审文件审核审批:【 ${this.values.projectName} 】` : `投标文件编制审核审批:【 ${this.values.projectName} 】`
                        } else {
                            title = this.$route.params.identification === '1' ? `投标文件编制审核审批:【 ${this.values.projectName} 】` : `自营资格预审文件审核审批:【 ${this.values.projectName} 】`
                        }
                        this.prossValue = {
                            title: this.$route.params.title || title,
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.params.degree || '',
                            msg: '',
                        }
                    }
                })
            },

            updataAddPrequalificationDocuments (item, boolean) {
                let url = ''
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                if (this.$route.params.formKey){
                    if(this.$route.params.formKey === 'addPrequalificationDocuments') {
                        boolean ? url = prequalificationDocumentsReSubmit : url = prequalificationDocumentsSubmit
                    } else {
                        boolean ? url = bidFileDocReSubmit : url = bidFileDocSubmit
                    }
                } else {
                    if(this.$route.params.identification === '1') {
                        boolean ? url = bidFileDocReSubmit : url = bidFileDocSubmit
                    } else {
                        boolean ? url = prequalificationDocumentsReSubmit : url = prequalificationDocumentsSubmit
                    }
                }
                url (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closePageTag ()
                    }
                })
            },

            consentAddPrequalificationDocuments (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closePageTag ()
                    return
                }
                if (item) {
                    this.values['completeTask'] = item
                    let url = this.$route.params.formKey === 'addPrequalificationDocuments' ? prequalificationDocumentsOperation : bidFileDocOperation
                    url (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success (res.message)
                            this.closePageTag ()
                        }
                    })
                }
            },

            getDepIdByUserIdList (id) {
                getUserDepartById({'userId': id}).then(res => {
                    if (res && res.length > 0) this.departmentList = res
                })
            },

            getDetailsList (taskId) {
                getDetails (taskId).then (res => { if (res) this.nodeData = res })
            },

            closePageTag () {
                let tagName = this.$route.path
                let path = ``
                this.stutas ? path = `/approval/${this.stutas}` : path = this.$route.params.identification === '1' ? 
                    `/projectManagement/selfSupportProjectDetail/ourBidding/prequalificationDocuments/1` : `/projectManagement/selfSupportProjectDetail/ourBidding/prequalificationDocuments`
                this.close ({ tagName, path })
            },

            upLoadFileCallBack (item) {
                switch (this.activeName) {
                    case 'businessStandard' : 
                        this.values['businessFileList'] = item
                        this.fileDefaultNeaten (item , '1')
                        break
                    case 'technicalStandard' :
                        this.values['skillFileList'] = item
                        this.fileDefaultNeaten (item , '2')
                        break
                    case 'budgetAudit' :
                        this.values['budgetFileList'] = item
                        this.fileDefaultNeaten (item , '3')
                        break
                    case 'otherContents' :
                        this.values['otherFileList'] = item
                        this.fileDefaultNeaten (item , '4')
                        break
                }
            },

            fileDefaultNeaten (fileList, type) {
                this.businessStandardList = type === '1' ? [] : this.businessStandardList
                this.technicalStandardList = type === '2' ? [] : this.technicalStandardList
                this.budgetAuditList = type === '3' ? [] : this.budgetAuditList
                this.otherContentsList = type === '4' ? [] : this.otherContentsList
                if (fileList && fileList.length > 0) {
                    fileList.forEach(item => {
                        let m = {
                            status : 'finished',
                            response : {
                                url : item.url,
                                size: item.size,
                                name: item.name
                            }
                        }
                        switch (type) {
                            case '1':
                                this.businessStandardList.push(m)
                                break
                            case '2':
                                this.technicalStandardList.push(m)
                                break
                            case '3':
                                this.budgetAuditList.push(m)
                                break
                            case '4':
                                this.otherContentsList.push(m)
                                break
                        }
                    })
                }
            },

            printTemplate () {
                getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.values.id}).then(res => {
                    if (res) this.$refs.printTemp.printTemplate (res)
                })
            },

            updataRouter () {
                if (this.$route.params) {
                    this.transform = this.$route.params.transform || {}
                    this.stutas = this.$route.params.pathName || ''
                    this.procInstId = this.$route.params.procInstId || ''
                }
                if (this.$route.params && this.$route.params.taskId) {
                    this.getDetailsList (this.$route.params.taskId)
                }
                if (this.$route.params && this.$route.params.relevancyId) {
                    this.getAddPrequalificationDocuments (this.$route.params.relevancyId)
                } else {
                    this.getInfo(this.proCode)
                }
            },
            getInfo (code) {
                getAnnouncementChangeByProjectCode({ 'projectCode': code }).then(res => {
                    delete res.companyId
                    delete res.companyName
                    delete res.completeTask
                    delete res.createBy
                    delete res.createName
                    delete res.createTime
                    delete res.departmentId
                    delete res.departmentName
                    delete res.procState
                    delete res.procInstId
                    delete res.agent
                    delete res.procCode
                    delete res.auditState
                    delete res.auditName
                    delete res.auditTime
                    delete res.id
                    this.values = Object.assign({}, this.values, res)
                })
            }
        },

        async created () {
            if (this.$route.params.formKey) { 
                this.processModuleId = this.$route.params.formKey
                this.code = this.$route.params.formKey === 'addPrequalificationDocuments' ? BASICSCODE.SELF_BID_FILE : BASICSCODE.SELF_BID_TENDER
            } else {
                this.processModuleId = this.$route.params.identification === '1' ? PROPRIETARYPROJECT.ADDBIDFILEDOC : PROPRIETARYPROJECT.ADDPREQUALIFICATIONDOCUMENTS
                this.code = this.$route.params.identification === '1' ? BASICSCODE.SELF_BID_TENDER : BASICSCODE.SELF_BID_FILE
            }
            const db = await this.$store.dispatch('d2admin/db/database', {user: true})
            this.proId = db.get('selfProID').value()
            this.proCode = db.get('selfProCode').value()
            this.updataRouter ()
        },

        mounted () {
            than = this
        },

        components: {
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent,
            'up-load': upload,
            'announcement-basic-information': announcementBasicInformation,
            'bidding-contact-information': biddingContactInformation,
            'print-template-by-html': printTemplateByHtml,
            'bottom-information': bottomInformation,
        }
    }
</script>

<style lang='scss'>
.review-prequalification-documents {
    height: 300px;
    border-radius: 2px;
    border: solid 1px $color-straight-line3;
    margin-left: 22px;
    .review-prequalification-documents-top {
        height: 32px;
        background: $color-bg;
        border-bottom: solid 1px $color-straight-line3;
        margin-bottom: 10px;
        p {
            font-size: 12px;
            color: $color-text-sub;
            line-height: 32px;
            margin-left: 22px;
        }
    }
    .review-prequalification-documents-conent {
        margin: 0 22px;
        .el-tabs__content {
            overflow: auto;
            max-height: 200px;
        }
    }
}
</style>
