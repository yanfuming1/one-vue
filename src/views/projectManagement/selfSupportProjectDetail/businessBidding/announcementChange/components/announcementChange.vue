<template>
    <d2-container type="fulls" class="announcement-change" v-show="lazyLoad">
        <el-card class="box-card closeHeader">
            <div class="qqt-container-full-center___top">
                <qqt-flow-tabs :procInstId="procInstId">
                    <template slot="content">
                        <announcement-basic-information :values="values" :transform="transform" ref="basicInformation" />
                        <bidding-contact-information :values="values" :transform="transform" ref="biddingContactInformation" />
                        <bottom-information :values="values" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation" />
                    </template>
                </qqt-flow-tabs>
            </div>
            <div class="qqt-container-full-content___button">
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitAnnouncementChangeData ()">重新提交</el-button>
                <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveAnnouncementChange">保存</el-button>
                <el-button type="primary" v-if="!transform.isShowDetails && procInstId === ''" @click="values['flag'] = '1', submitAnnouncementChangeData ()">提交</el-button>
                <el-button type="primary" v-if="transform.isShowDetails && procInstId === ''" @click="closePageTag">编辑</el-button>
                <el-button v-if="!transform.isShowDetails || stutas != ''" @click="closePageTag">取消</el-button>
                <el-button type="info" size="mini" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                <el-button v-else-if="transform.isShowDetails" @click="closePageTag1">关闭</el-button>
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataAnnouncementChange"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentAnnouncementChange" />
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </d2-container>
</template>

<script>
    import { addAnnouncementChange, editAnnouncementChange, getAnnouncementChangeById, getAnnouncementChangeByProjectCode, completeAnnouncementChange,
                submitAnnouncementChange, resetSubmitAnnouncementChange } from '@/api/selfProject/businessBidding/announcementChange'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, qqtRelateTable } from '@/components/qqt-subassembly'
    import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
    import { getSelfProjectHighestVersion } from '@/api/selfProject/allProject'
    import { PROPRIETARYPROJECT } from '@/enum/FORMCODE'
    import { getDetails } from '@/api/approval/common'
    import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
    import { mapActions, mapState } from 'vuex'

    import printTemplateByHtml from '../../../../../systemManagement/printTemplate/components/printTemplateByHtml'
    import announcementBasicInformation from '../../components/announcementBasicInformation'
    import biddingContactInformation from './biddingContactInformation'
    import bottomInformation from '../../components/bottomInformation'
    import util from '@/libs/util.js'
    export default {
        
        data () {
            return {
                title: '',
                stutas: '',
                procInstId: '',
                remote: {},
                jsonData: {},
                values: {},
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
                visible: false,
                lazyLoad: false,
                isReject: false,
                isSendBack: false,
                isTurnManage: false,
                dialogVisible: false,
                code: BASICSCODE.SELF_INVITATION_REGISTER,
                processModuleId: PROPRIETARYPROJECT.ANNOUNCEMENTCHANGE,
                upLoadFileDefaultList: [],
            }
        },

        methods: {

            ...mapActions('d2admin/page', [
                'close',
            ]),

            getAnnouncementChangeInfoByCode (code) {
                getAnnouncementChangeByProjectCode ({'projectCode': code}).then (res => {
                    if (res && res.id) {
                        this.loadInfoData (res)
                    } else {
                        this.lazyLoad = true
                        const { projectCode, projectName } = this.selfSupportProject
                        let data = { projectCode, projectName }
                        this.values = data
                    }
                })
            },

            getAnnouncementChangeInfoById (id) {
                getAnnouncementChangeById ({'id': id}).then (res => {
                    if (res) this.loadInfoData (res)
                })
            },

            saveAnnouncementChange () {
                let url = '', item = {}
                item = this.getValidateData ()
                if (item.biddingContactInformation && item.basicInformation && item.bottomInformation) {
                    Object.assign (this.values, item.biddingContactInformation, item.basicInformation, item.bottomInformation)
                    this.values.id == null ? url = addAnnouncementChange : url = editAnnouncementChange
                    url (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success ('保存成功')
                            this.transform.isShowDetails = true
                            this.getAnnouncementChangeInfoByCode (this.selfSupportProject.projectCode)
                        }
                    })
                }
            },

            submitAnnouncementChangeData () {
                let item = this.getValidateData ()
                if (item.biddingContactInformation && item.basicInformation && item.bottomInformation) {
                    Object.assign (this.values, item.biddingContactInformation, item.basicInformation, item.bottomInformation)
                    this.dialogVisible = true
                    this.prossValue = {
                        title: this.$route.params.title || `招标公告信息:【 ${this.values.projectName} 】`,
                        pdfId: this.$route.params.procDefId || '',
                        degree: this.$route.params.degree || '',
                        msg: '',
                    }
                }
            },

            updataAnnouncementChange (item, boolean) {
                let url = ''
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                boolean ? url = resetSubmitAnnouncementChange : url = submitAnnouncementChange
                url (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        !this.procInstId ? this.getAnnouncementChangeInfoByCode (this.selfSupportProject.projectCode) : this.closePageTag ()
                    }
                })
            },

            consentAnnouncementChange (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closePageTag ()
                    return
                }
                if (item) {
                    this.values['completeTask'] = item
                    this.transform.isShowDetails = true
                    completeAnnouncementChange (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success (res.message)
                            this.values['flag'] == '1' ? this.getSelfProjectHighestVersionData (this.values.projectCode) : this.closePageTag ()
                        }
                    })
                }
            },

            getSelfProjectHighestVersionData (projectCode) {
                getSelfProjectHighestVersion ({'projectCode': projectCode}).then (res => {
                    this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformation', res)
                    this.closePageTag ()
                })
            },

            getDetailsList (taskId) {
                getDetails (taskId).then (res => { if (res) this.nodeData = res })
            },

            getValidateData () {
                let data = { basicInformation: {}, bottomInformation: {}, biddingContactInformation: {} }
                data.basicInformation = this.$refs.basicInformation.getData ()
                data.bottomInformation = this.$refs.bottomInformation.getData ()
                data.biddingContactInformation = this.$refs.biddingContactInformation.getData ()
                return data
            },

            closePageTag () {
                if (this.$route.params.relevancyId) {
                    let tagName = this.$route.path
                    let path = `/approval/${this.stutas}`
                    this.close ({ tagName, path })
                } else {
                    this.transform.isShowDetails = !this.transform.isShowDetails
                }
            },

            closePageTag1 () {
                let tagName = this.$route.path;
                this.close ({ tagName });
                this.$router.go(-1);
            },

            fileDefaultNeaten (res) {
                this.upLoadFileDefaultList = []
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
                getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.values.id}).then(res => {
                    if (res) this.$refs.printTemp.printTemplate (res)
                })
            },

            loadInfoData (res) {
                this.procInstId = res.procInstId || '', this.lazyLoad = true
                this.values.procState == '4' && this.stutas != '' ? this.transform.isShowDetails = false : res.id ? this.transform.isShowDetails = true : this.transform.isShowDetails = false
                this.prossValue.title = `招标公告信息:【 ${this.values.projectName} 】`
                this.values = res
                this.fileDefaultNeaten (res)
            },

            updataRouter (code) {
                if (Object.keys(this.$route.params).length > 0) {
                    this.transform = this.$route.params.transform || { isShowDetails: false }
                    this.stutas = this.$route.params.pathName || ''
                }
                if (this.$route.params && this.$route.params.taskId) {
                    this.getDetailsList (this.$route.params.taskId)
                }
                if (this.$route.params.relevancyId) {
                    this.getAnnouncementChangeInfoById (this.$route.params.relevancyId)
                } else {
                    this.getAnnouncementChangeInfoByCode (this.selfSupportProject.projectCode)
                }
            }
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
                this.updataRouter ()
            }
        },

        components: {
            'announcement-basic-information': announcementBasicInformation,
            'bidding-contact-information': biddingContactInformation,
            'print-template-by-html': printTemplateByHtml,
            'bottom-information': bottomInformation,
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent
        }
    }
</script>
<style lang="scss">
    .announcement-change {
        .el-tabs--card {
            padding-left: 30px;
        }
    }
</style>