<template>
    <d2-container type="fulls" class="announcementInformation">
        <el-card class="box-card closeHeader">
            <div slot="header">
               <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
            </div>
            <div class="qqt-container-full-center___top">
               <qqt-flow-tabs :procInstId="procInstId">
                   <template slot="content">
                        <announcement-basic-information :values="values" :transform="detailsfrom" ref="basicInformation" />
                        <fm-generate-form :data="jsonData" :remote="remote" :value="values" :transform="transform" ref="generateForm" />
                        <bottom-information :values="values" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation" />
                   </template>
               </qqt-flow-tabs>
            </div>
            <div class="qqt-container-full-content___button">
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitAnnouncementInformationData ()">重新提交</el-button>
                <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveAnnouncementInformation">保存</el-button>
                <el-button type="primary" v-if="!transform.isShowDetails && procInstId === ''" @click="values['flag'] = '1', submitAnnouncementInformationData ()">提交</el-button>
                <el-button type="info" size="mini" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                <el-button @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataAnnouncementInformation"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentAnnouncementInformation" />
   </d2-container>
</template>

<script>
    import { getAnnouncementInformationById, editAnnouncementInformation,
                addAnnouncementInformation, submitAnnouncementInformation, completeAnnouncementInformation, resetSubmitAnnouncementInformation } from '@/api/selfProject/businessBidding/announcementInformation'
    import { getAnnouncementChangeByProjectCode } from '@/api/selfProject/businessBidding/announcementChange'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, qqtRelateTable } from '@/components/qqt-subassembly'
    import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
    import { formGetJson } from '@/api/system/fromManagement/index'
    import { PROPRIETARYPROJECT } from '@/enum/FORMCODE'
    import { getDetails } from '@/api/approval/common'
    import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
    import { mapActions, mapState } from 'vuex'

    import printTemplateByHtml from '../../../../../systemManagement/printTemplate/components/printTemplateByHtml'
    import announcementBasicInformation from '../../components/announcementBasicInformation'
    import bottomInformation from '../../components/bottomInformation'
    import util from '@/libs/util.js'
    let than = this
    export default {

        data () {
            return {
                title: '',
                stutas: '',
                procInstId: '',
                remote: {},
                values: {},
                jsonData: {},
                nodeData: {
                    operation: '',
                    msg: ''
                },
                transform: {
                    isShowDetails: false
                },
                prossValue: {
                    title: ''
                },
                detailsfrom: {
                    isShowDetails: true
                },
                visible: false,
                isReject: false,
                isSendBack: false,
                isTurnManage: false,
                dialogVisible: false,
                code: BASICSCODE.SELF_INVITATION_ALTERATION,
                processModuleId: PROPRIETARYPROJECT.ADDANNOUNCEMENTINFORMATION,
                upLoadFileDefaultList: [],
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

            getAnnouncementInformation (id) {
                getAnnouncementInformationById ({'id': id}).then (res => {
                    if (res) {
                        this.values = res
                        this.prossValue.title = `招标公告变更:【 ${this.values.projectName} 】`
                        this.getAnnouncementChangeInfoByCode (this.values.projectCode)
                        this.fileDefaultNeaten (res)
                    }
                })
            },

            getAnnouncementChangeInfoByCode (code) {
                getAnnouncementChangeByProjectCode ({'projectCode': code}).then (res => {
                    if (res && res.id) {
                        delete res.id, delete res.createBy, delete res.createTime
                        delete res.departmentId, delete res.departmentName, delete res.companyId, delete res.companyName
                        delete res.companyId, delete res.departmentId, delete res.auditState
                        delete res.procState, delete res.fileList, delete res.procInstId
                        this.values = Object.assign ({}, this.values, res)
                    }
                }).finally (res => {
                    this.getFormByJson ()
                })
            },

            saveAnnouncementInformation () {
                let url = '', item = {}
                item = this.getValidateData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && item.basicInformation && item.bottomInformation) {
                        Object.assign (this.values, data, item.basicInformation, item.bottomInformation)
                        this.values.id == null ? url = addAnnouncementInformation : url = editAnnouncementInformation
                        url (this.values).then (res => {
                            if (res.code === 200) {
                                this.$message.success ('保存成功')
                                this.closePageTag ()
                            }
                        })
                    }
                })
            },

            submitAnnouncementInformationData () {
                let item = this.getValidateData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && item.basicInformation && item.bottomInformation) {
                        Object.assign (this.values, data, item.basicInformation, item.bottomInformation)
                        this.dialogVisible = true
                        this.prossValue = {
                            title: this.$route.params.title || `招标公告变更:【 ${this.values.projectName} 】`,
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.params.degree || '',
                            msg: '',
                        }
                    }
                })
            },

            updataAnnouncementInformation (item, boolean) {
                let url = ''
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                boolean ? url = resetSubmitAnnouncementInformation : url = submitAnnouncementInformation
                url (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closePageTag ()
                    }
                })
            },

            consentAnnouncementInformation (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closePageTag ()
                    return
                }
                if (item) {
                    this.values['completeTask'] = item
                    completeAnnouncementInformation (this.values).then (res => {
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

            getValidateData () {
                let data = { basicInformation: {}, bottomInformation: {} }
                data.basicInformation = this.$refs.basicInformation.getData ()
                data.bottomInformation = this.$refs.bottomInformation.getData ()
                return data
            },

            closePageTag () {
                let tagName = this.$route.path
                let path = ``
                this.stutas ? path = `/approval/${this.stutas}` : path = `/projectManagement/selfSupportProjectDetail/businessBidding/announcementInformation`
                this.close ({ tagName, path })
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
                    this.getAnnouncementInformation (this.$route.params.relevancyId)
                } else {
                    this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad')
                }
            }
        },

        created () {
            this.updataRouter ()
        },

        computed: {
            ...mapState ('d2admin/selfSupportProject', [
                'selfSupportProject'
            ])
        },

        watch: {
            selfSupportProject () {
                this.values['projectCode'] = this.selfSupportProject.projectCode
                this.getAnnouncementChangeInfoByCode (this.selfSupportProject.projectCode)
            }
        },

        mounted () {
            than = this
        },

        components: {
            'announcement-basic-information': announcementBasicInformation,
            'print-template-by-html': printTemplateByHtml,
            'bottom-information': bottomInformation,
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent
        }
    }
</script>
