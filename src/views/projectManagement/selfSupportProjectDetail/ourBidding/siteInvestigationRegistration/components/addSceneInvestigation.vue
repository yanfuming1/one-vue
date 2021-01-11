<template>
    <d2-container type="fulls" class="addSceneInvestigation">
        <el-card class="box-card closeHeader">
            <div slot="header">
               <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
           </div>
           <div class="qqt-container-full-center___top">
               <qqt-flow-tabs :procInstId="procInstId">
                   <template slot="content">
                        <announcement-basic-information :values="values.invitationRegister" :transform="detailsfrom" ref="basicInformation" />
                        <bidding-contact-information :values="values.invitationRegister" :transform="detailsfrom" ref="biddingInformation" />
                        <fm-generate-form 
                           :data="jsonData"
                           :remote="remote"
                           :value="values"
                           :transform="transform"
                           ref="generateForm"
                           @input-table-change="selectGenerateChange"
                           @btnTableClick="btnTableClick"
                       />
                       <bottom-information :values="values" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation" />
                       <user-modules :showDialog="isShowAdminDialog" title="选择人员" :isShowInput="false" :isShowRole="false" @clearUserPage="clearUserPage" @closeFun="isShowAdminDialog = false"/>
                   </template>
               </qqt-flow-tabs>
           </div>
           <div class="qqt-container-full-content___button">
               <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitSceneInvestigationData (true)">重新提交</el-button>
               <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
               <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
               <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
               <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
               <el-button type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveSceneInvestigation">保存</el-button>
               <el-button type="primary" v-if="!transform.isShowDetails && procInstId === ''" @click="values['flag'] = '1', submitSceneInvestigationData (false)">提交</el-button>
               <el-button type="info" size="mini" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
               <el-button @click="closePageTag">关闭</el-button>
           </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataSceneInvestigation"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentAddSceneInvestigation" />
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </d2-container>
</template>

<script>
    import { mapActions, mapState } from 'vuex'
    import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
    import { getDetails } from '@/api/approval/common'
    import util from '@/libs/util.js'
    import { PROPRIETARYPROJECT } from '@/enum/FORMCODE'
    import { formGetJson } from '@/api/system/fromManagement/index'
    import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
    import { getAnnouncementChangeByProjectCode } from '@/api/selfProject/businessBidding/announcementChange'
    import { getDepartmentEmployee, getQueryPosition, addSceneInvestigation, editSceneInvestigation, getQueryIdSceneInvestigation, 
        submitSceneInvestigation, reSubmitSceneInvestigation, completeAddSceneInvestigation } from '@/api/selfProject/ourBidding/siteInvestigationRegistration'
    import { getOrganizationByCompanyId } from '@/api/system/depart/depart'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, qqtRelateTable } from '@/components/qqt-subassembly'
    import printTemplateByHtml from '../../../../../systemManagement/printTemplate/components/printTemplateByHtml'
    import announcementBasicInformation from '../../../businessBidding/components/announcementBasicInformation'
    import biddingContactInformation from '../../components/biddingContactInformation'
    import bottomInformation from '../../../businessBidding/components/bottomInformation'
    import userModules from '../../../../../systemManagement/processDefinition/processModules/userModules'
    let than = this
    export default {

        data () {
            let than = this
            return {
                title: '',
                stutas: '',
                procInstId: '',
                remote: {},
                values: {
                    affiliateList: [],
                    invitationRegister: {},
                    explorationDuty: ''
                },
                userIdPodition: '',
                isShowAdminDialog: false,
                btnTableClickVal: '',
                addlineIndex: '',
                jsonData: {},
                nodeData: {
                    operation: '',
                    msg: ''
                },
                transform: {
                    isShowDetails: false
                },
                detailsfrom: {
                    isShowDetails: true
                },
                prossValue: {
                    title: ''
                },
                visible: false,
                isReject: false,
                isSendBack: false,
                isTurnManage: false,
                dialogVisible: false,
                code: BASICSCODE.SELF_BID_EXPLORATION,
                processModuleId: PROPRIETARYPROJECT.ADDSCENINVESTIGATION,
                explorationDepartmentArr: [],
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

            selectGenerateChange (id, value, index) {
                switch (id) {
                    case 'explorationDepartment' :
                        this.explorationDepartmentArr.forEach(item => {
                            this.values.affiliateList[index].explorationDepartment = item.name ? item.name : " "
                            this.values.affiliateList[index].explorationDepartmentId = item.id ? item.id : " "
                        })
                        this.getQueryPositionEvent (index)
                        break
                } 
            },

            getQueryPositionEvent (index) {
               getQueryPosition({'userId': this.userIdPodition}).then( res => {
                    this.values.affiliateList[index].explorationDuty = res
               }) 
            },

            btnTableClick (val, index) {
                this.isShowAdminDialog = true
                this.addlineIndex = index
                this.btnTableClickVal = val
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
                if (this.btnTableClickVal === 'affiliateList') {
                    this.values['affiliateList'][i]['explorationPersonnel'] = list[0].name
                    this.values['affiliateList'][i]['explorationPersonnelId'] = list[0].id
                }
                this.isShowAdminDialog = false
                this.getDepartmentEmployeeeEvent (list[0].id)
            },

            getAnnouncementChangeInfoByCode (code) {
                getAnnouncementChangeByProjectCode ({'projectCode': code}).then (res => {
                    if (res && res.id) {    
                        delete res.id, delete res.createBy
                        delete res.companyId, delete res.departmentId
                        this.values.invitationRegister = res
                    }
                }).finally (res => {
                    this.getFormByJson ()
                })
            },

            getDepartmentEmployeeeEvent (id) {
                getDepartmentEmployee ({'userId': id}).then ( res => {
                    if (res.length == 1) {
                        let i = this.values.affiliateList.length-1
                        this.values.affiliateList[i].explorationDepartment = res[0].name
                    }
                    this.explorationDepartmentArr = res
                    this.userIdPodition = id
                    this.neatenRemote ()
                })
            },

            getQueryIdSceneInvestigationEvent (id) {
                getQueryIdSceneInvestigation ({'id': id}).then (res => {
                    if (res) {
                        Object.assign (this.values, res)
                        this.getAnnouncementChangeInfoByCode (res.projectCode)
                        this.procInstId = res.procInstId || ''
                        this.prossValue.title = `我方投标，项目:【 ${this.values.invitationRegister.projectName} 】流程审批`
                        this.fileDefaultNeaten (res)
                    }
                })
            },

            saveSceneInvestigation () {
                let url = ''
                this.$refs.generateForm.getData ().then (data => {
                    let info = this.$refs.bottomInformation.getData()
                    if (data && info) {
                        this.values.invitationRegister = {}
                        Object.assign (this.values, data, info)
                        this.values.id == null ? url = addSceneInvestigation : url = editSceneInvestigation
                        url (this.values).then (res => {
                            if (res.code === 200) {
                                this.$message.success ('保存成功')
                                this.closePageTag ()
                            }
                        })
                    }
                })
            },

            submitSceneInvestigationData () {
                this.$refs.generateForm.getData ().then (data => {
                    let info = this.$refs.bottomInformation.getData ()
                    if (data && info) {
                        Object.assign (this.values, data, info)
                        this.values.projectName = this.values.invitationRegister.projectName
                        this.values.invitationRegister = {}
                        this.dialogVisible = true
                        this.prossValue = {
                            title: this.$route.params.title || `我方投标，项目:【 ${this.values.projectName} 】流程审批`,
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.params.degree || '',
                            msg: '',
                        }
                    }
                })
            },

            updataSceneInvestigation (item, boolean) {
                let url = ''
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                boolean ? url = reSubmitSceneInvestigation : url = submitSceneInvestigation
                url (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closePageTag ()
                    }
                })
            },

            consentAddSceneInvestigation (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closePageTag ()
                    return
                }
                if (item) {
                    this.values['completeTask'] = item
                    completeAddSceneInvestigation (this.values).then (res => {
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
                this.stutas ? path = `/approval/${this.stutas}` : path = `/projectManagement/selfSupportProjectDetail/ourBidding/siteInvestigationRegistration`
                this.close ({ tagName, path })
            },

            neatenRemote () {
                this.remote = {
                    getExplorationDepartment(resolve){
                        resolve(than.explorationDepartmentArr) 
                    }
                }
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
                    this.getQueryIdSceneInvestigationEvent (this.$route.params.relevancyId)
                } else {
                    this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad')
                }
            }
        },

        components: {
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent,
            'announcement-basic-information': announcementBasicInformation,
            'bidding-contact-information': biddingContactInformation,
            'print-template-by-html': printTemplateByHtml,
            'bottom-information': bottomInformation,
            'user-modules': userModules
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
                this.values['projectName'] = this.selfSupportProject.projectName
                this.getAnnouncementChangeInfoByCode (this.selfSupportProject.projectCode)
            }
        },

        mounted () {
            than = this
        }
    }
</script>

<style lang='scss'>
    .addSceneInvestigation {
        .files-upload___right {
            margin-left: 120px
        }
    }
</style>
