<template>
    <d2-container type="fulls" class="addQABiddingDocuments">
        <el-card class="box-card closeHeader">
            <div slot="header">
               <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
           </div>
           <div class="qqt-container-full-center___top">
               <qqt-flow-tabs :procInstId="procInstId">
                   <template slot="content">
                        <project-info class="project-info-content"></project-info>
                        <el-divider content-position="left">
                        <div class="generate-from-divider___line"></div>
                            招标文件答疑
                        </el-divider>
                        <div class="add-QABidding-documents-button" v-if="!transform.isShowDetails">
                            <!-- <el-button size="mini" round @click="exportBtn">导出</el-button> -->
                            <!-- <el-button size="mini" round @click="printingBtn">打印</el-button> -->
                        </div>
                        <fm-generate-form 
                           :data="jsonData"
                           :remote="remote"
                           :value="values"
                           :transform="transform"
                           ref="generateForm"
                           @on-change="selectGenerateChange"
                           @btnTableClick="btnTableClick"/>
                       <bottom-information :values="values" :isShowAccessory="false" :transform="transform" ref="bottomInformation" />
                   </template>
               </qqt-flow-tabs>
            </div>
            <div class="qqt-container-full-content___button">
               <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitAddQABiddingDocumentsData ()">重新提交</el-button>
               <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
               <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
               <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
               <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
               <el-button type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveAddQABiddingDocuments">保存</el-button>
               <el-button type="primary" v-if="!transform.isShowDetails && procInstId === ''" @click="values['flag'] = '1', submitAddQABiddingDocumentsData ()">提交</el-button>
               <el-button type="info" size="mini" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
               <el-button @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataAddQABiddingDocuments"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentAddQABiddingDocuments" />
        <user-modules ref="userChose" :showDialog="isShowAdminDialog"  :title="'选择人员'" :isShowInput="false" :isShowRole="false" @clearUserPage="clearUserPage" @closeFun="isShowAdminDialog = false"/>
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </d2-container>
</template>

<script>
    import { getBiddingDocumentQAById, editBiddingDocumentQA,
        addBiddingDocumentQA, subBiddingDocumentQA, operationBiddingDocumentQA, reSubBiddingDocumentQA } from '@api/selfProject/ourBidding/QABiddingDocuments'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, qqtRelateTable } from '@/components/qqt-subassembly'
    import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
    import { formGetJson } from '@/api/system/fromManagement/index'
    import { PROPRIETARYPROJECT } from '@/enum/FORMCODE'
    import { getDetails } from '@/api/approval/common'
    import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
    import { mapActions } from 'vuex'
    import projectInfo from '../../../components/commenInfo/projectInfo'
    import bottomInformation from '../../../businessBidding/components/bottomInformation'
    import userModules from '../../../../../systemManagement/processDefinition/processModules/userModules'
    import printTemplateByHtml from '../../../../../systemManagement/printTemplate/components/printTemplateByHtml'
    import util from '@/libs/util.js'
    let than = this
    export default {

        data () {
            return {
                title: '',
                stutas: '',
                procInstId: '',
                remote: {},
                values: {
                    affiliateList: [{}]
                },
                jsonData: {},
                btnTableClickVal: '',
                addlineIndex: '',
                nodeData: {
                    operation: '',
                    msg: ''
                },
                transform: {
                    isShowDetails: false
                },
                isShowAdminDialog: false,
                prossValue: {
                    title: ''
                },
                visible: false,
                isReject: false,
                isSendBack: false,
                isTurnManage: false,
                dialogVisible: false,
                code: BASICSCODE.SELF_BID_QUERY,
                processModuleId: PROPRIETARYPROJECT.ADDQABIDDINGDOCUMENTS,
                upLoadFileDefaultList: [],
                departmentList: [],
                listData: [],

                proId: '',
                proCode: '',
            }
        },

        methods: {

            ...mapActions('d2admin/page', [
                'close',
            ]),

            getFormByJson () {
                formGetJson ({ 'code': this.processModuleId }).then(res => {
                    if (res) this.jsonData = JSON.parse(res)
                })
            },

            selectGenerateChange (field, value, model) {
                Object.assign(this.values, model)
            },

            // exportBtn () {

            // },

            // printingBtn () {
                
            // },
            
            btnTableClick (val, index, tableData, field, model) {
                this.isShowAdminDialog = true
                this.addlineIndex = index
                this.btnTableClickVal = field
                this.listData = tableData
            },
            clearUserPage (list) {
                if (list.length == 0 || list.length > 1) {
                    this.$message.warning ('选择一条数据')
                    return
                }
                if (list[0].id.indexOf ('D') != -1) {
                    this.$message.warning ('只能选择人员')
                    return
                }
                
                let i = this.addlineIndex
                if (this.btnTableClickVal === 'queryPersonnel') {
                    this.$set(this.listData, this.addlineIndex, {
                        queryPersonnel: list[0].name,
                        queryPersonnelId: list[0].id,
                        queryContent: this.listData[i].queryContent,
                        answerPersonnel: this.listData[i].answerPersonnel,
                        answerPersonnelId: this.listData[i].answerPersonnelId,
                        answerContent: this.listData[i].answerContent,
                        remark: this.listData[i].answerContent,
                    })
                } else if (this.btnTableClickVal === 'answerPersonnel') {
                    this.$set(this.listData, this.addlineIndex, {
                        queryPersonnel: this.listData[i].queryPersonnel,
                        queryPersonnelId: this.listData[i].queryPersonnelId,
                        queryContent: this.listData[i].queryContent,
                        answerPersonnel: list[0].name,
                        answerPersonnelId: list[0].id,
                        answerContent: this.listData[i].answerContent,
                        remark: this.listData[i].answerContent,
                    })
                }
                Object.assign(this.values.affiliateList, this.listData)
                this.isShowAdminDialog = false
            },

            getAddQABiddingDocuments (id) {
                getBiddingDocumentQAById ({'id': id}).then (res => {
                    if (res) {
                        Object.assign(this.values, res)
                        this.prossValue.title = `招标文件答疑:【 ${this.values.createName} 】`
                        this.procInstId = res.procInstId || ''
                        this.getFormByJson ()
                    }
                })
            },

            saveAddQABiddingDocuments () {
                let url = '', boolean = {}
                let item = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && boolean && item) {
                        Object.assign (this.values, data, item)
                        this.values.id == null ? url = addBiddingDocumentQA : url = editBiddingDocumentQA
                        this.values.projectId = this.values.projectId ? this.values.projectId : this.proId
                        this.values.projectCode = this.values.projectCode ? this.values.projectCode : this.proCode 
                        url (this.values).then (res => {
                            if (res.code === 200) {
                                this.$message.success ('保存成功')
                                this.closePageTag ()
                            }
                        })
                    }
                })
            },

            submitAddQABiddingDocumentsData () {
                let item = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && item) {
                        Object.assign (this.values, data, item)
                        this.values.projectCode = this.values.projectCode || this.proCode
                        this.dialogVisible = true
                        this.prossValue = {
                            title: this.$route.params.title || `招标文件答疑:【 ${this.values.createName} 】`,
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.params.degree || '',
                            msg: '',
                        }
                    }
                }) 
            },

            updataAddQABiddingDocuments (item, boolean) {
                let url = ''
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                boolean ? url = reSubBiddingDocumentQA : url = subBiddingDocumentQA
                url (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closePageTag ()
                    }
                })
            },

            consentAddQABiddingDocuments (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closePageTag ()
                    return
                }
                if (item) {
                    this.values['completeTask'] = item
                    operationBiddingDocumentQA (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success (res.message)
                            this.closePageTag ()
                        }
                    })
                }
            },

            getDetailsList (taskId) {
                getDetails (taskId).then (res => { if (res) this.nodeData = res })
            },

            closePageTag () {
                let tagName = this.$route.path
                let path = ``
                this.stutas ? path = `/approval/${this.stutas}` : path = `/projectManagement/selfSupportProjectDetail/ourBidding/QABiddingDocuments`
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

            printTemplate () {
                getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.$route.params.relevancyId}).then(res => {
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
                    this.getAddQABiddingDocuments (this.$route.params.relevancyId)
                } else {
                    this.getFormByJson ()
                }
            }
        },

        created () {
            this.updataRouter ()
        },

        async mounted () {
            than = this
            const db = await this.$store.dispatch('d2admin/db/database', {user: true})
            this.proId = db.get('selfProID').value()
            this.proCode = db.get('selfProCode').value()
        },

        components: {
            'print-template-by-html': printTemplateByHtml,
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent,
            'project-info': projectInfo,
            'bottom-information': bottomInformation,
            'user-modules': userModules
        }
    }
</script>

<style lang='scss'>
    .project-info-content {
        margin-bottom: 32px;
    }
    .add-QABidding-documents-button {
        float: right;
        top: -40px;
        background: #fff;
        // width: 150px;
        position: relative;
        text-align: right;
    }
</style>
