<template>
   <d2-container class="add-resignation-application">
       <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closeTab"><i class="el-icon-close"></i></el-button>
            </div>
           <div class="qqt-container-full-center___top">
               <qqt-flow-tabs :procInstId="procInstId" >
                   <template slot="content"> 
                        <fm-generate-form
                            :data="jsonData"
                            :remote="remoteFuncs"
                            :transform="transform"
                            :value="values"
                            @btn-click="btnClick"
                            @btnTableClick="btnTableClick"
                            ref="generateForm"/>
                        <bottom-information :values="values" :fieldTitle="fieldTitle" :timeTitle="timeTitle" :isShowAccessory="false" :transform="transform" ref="bottomInformation" />
                    </template>
               </qqt-flow-tabs>
           </div>
           
           <div class="operation-button">
                <el-button size="mini" type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitDismissalApprovalEvent (true)">重新提交</el-button>
                <el-button size="mini" type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button size="mini" type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button size="mini" type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button size="mini" type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button size="mini" type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveInformationBtn">保存</el-button>
                <el-button size="mini" type="primary" v-if="!transform.isShowDetails && procInstId === '' && $has ('Dismiss:list:submit')" @click="values['flag'] = '1', submitDismissalApprovalEvent (false)">提交</el-button>
                <el-button size="mini" v-if="transform.isShowDetails" type="info" @click="printTemplate">打印</el-button>
                <el-button size="mini" @click="closeTag">关闭</el-button>
            </div>

       </el-card>
        
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="isSubmitDismissalApprovalEvent"/>

        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentUsingApplication" />

        <user-modules :showDialog="isShowAdminDialog" title="选择人员" :isShowInput="false" :isShowRole="false" @clearUserPage="clearUserPage" @closeFun="isShowAdminDialog = false"/>

        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </d2-container>
</template>

<script>
import { formGetJson } from '../../../../api/system/fromManagement/index'
import { PERDONNELMANAGEMENT } from '../../../../enum/FORMCODE'
import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
import printTemplateByHtml from '@/views/systemManagement/printTemplate/components/printTemplateByHtml'
import { mapActions } from 'vuex'
import util from '../../../../libs/util'
import { listyBstaffLoan } from '../../../../api/financialManagement/staffLoan';
import { getDetails, findReverseRoute, careOf} from '../../../../api/approval/common'
import { qqtSendProcess, qqtFlowTabs, qqtConsent } from '@/components/qqt-subassembly'
import userModules from '../../../systemManagement/processDefinition/processModules/userModules'
import bottomInformation from '../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
import { accountInformationDismissedEmployees, addDismissalApplication, 
    editDismissalApplication, queryDismissalApplicationID, 
    // 流程
    submitDismissalApproval, dismissalApplicationOperation
     } from '../../../../api/personnelManagement/dismissalOperation'
import { workUsreList } from '../../../../api/personnelManagement/workAdjustment'
import { handoverPersonResignation } from '../../../../api/personnelManagement/leaveApplication'
    let that = this
    export default {
        name:'addRetirementNotification',
        components: {
            qqtSendProcess,
            qqtFlowTabs,
            userModules,
            qqtConsent,
            'bottom-information': bottomInformation,
            'print-template-by-html': printTemplateByHtml
        },
        data () {
            let that = this
            return {
                // 交接人下拉框
                isShowAdminDialog: false,

                dismissalInformationArr: [],
                values: {
                    dismissName:'',
                    addline:[],
                    addlines:[]
                },

                fieldTitle: '提交',
                timeTitle: '提交',

                dismissId: '',

                // 物品交接人行index
                addlineIndex:'',
                btnTableClickVal:'',

                dismissHandoverPersonArr: [],
                flowList: [],
                jsonData: {},
                remoteFuncs:{
                    getDismissedPersonName(resolve){
                        resolve(that.dismissalInformationArr) 
                    },
                    getRecipient(resolve){
                        resolve(that.dismissHandoverPersonArr) 
                    },
                },
                remark:'',

                dialogVisible: false,
                processModuleId: PERDONNELMANAGEMENT.NOTICDISMISSAL,
                isSendBack: false,
                prossValue: {
                    title: ''
                }, 

                // 流程
                isSendBack: false,
                transform: {
                    isShowDetails: true
                },
                stutas:'',
                procInstId: '',
                nodeData: {
                    operation: '',
                    msg:''
                },
                visible: false,
                isReject: false,
                isTurnManage: false,
                code: BASICSCODE.PERSONNELMANAGEMENT_DISMISS
            }
        },

        methods: {
            
            getFormByJson () {
                formGetJson ({'code': PERDONNELMANAGEMENT.NOTICDISMISSAL}).then(res => {
                    if (res) {
                        this.jsonData = JSON.parse(res)
                    }
                })
            },

            btnClick (value, field) {
                this.dismissId = value
                this.isShowAdminDialog = true
            },

            btnTableClick (val, index) {
                this.isShowAdminDialog = true
                this.addlineIndex = index
                this.btnTableClickVal = val
            },

            clearUserPage (list) {
                if (list.length !== 1 && list[0].id.indexOf ('D') != -1) {
                    this.$message.warning ('选择一条数据')
                    return
                }
                if(this.dismissId) {
                    let id = list[0].id
                    this.queryEmployeeInformationByID (id)
                } else {
                    let i = this.addlineIndex
                    if (this.btnTableClickVal === 'addline') {
                        this.values.addline[i].recipient = list[0].name
                    } else if (this.btnTableClickVal === 'addlines') {
                        this.values.addlines[i].recipient = list[0].name
                    }
                }
                this.isShowAdminDialog = false
                this.dismissId = ''
            },

             // 通过id获取人员信息
            queryEmployeeInformationByID (id) {
                accountInformationDismissedEmployees({
                    'userId': id
                }) .then( res => {
                    this.values.dismissName = res.dismissName
                    this.values.dismissId = id
                    this.values.phone = res.phone
                    this.values.position = res.position
                    this.values.department = res.department
                })
            },

            getQueryDismissalApplicationID () {
                queryDismissalApplicationID({
                    id: this.$route.params.relevancyId
                }).then(res=> {
                    this.values = res
                }).finally (res => {
                    this.getFormByJson ()
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
                    this.getQueryDismissalApplicationID (this.$route.params.relevancyId)
                } else {
                    this.getFormByJson ()
                }
            },
            
            getDetailsList (taskId) {
                getDetails (taskId).then (res => {
                    if (res) {
                        this.nodeData = res
                    }
                })
            },

            // 保存
            saveInformationBtn () {
                let info =  {}
                info = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData().then(item => {
                    if (item && info) {
                        Object.assign ( item, info )
                        if(this.$route.params.relevancyId){
                            item['id'] = this.$route.params.relevancyId
                            editDismissalApplication(item).then( res => {
                                this.$message.success("编辑成功")
                                this.closeTag ()
                            }).catch( err => {
                                this.$message.error("编辑失败")
                            })
                        }else{
                            item.dismissName = this.values.dismissName
                            addDismissalApplication(item).then( res=> {
                                this.$message.success("添加成功")
                                this.closeTag ()
                            }).catch( err => {
                                this.$message.error("添加失败")
                            })
                        }
                    }
                })
            },

            // 提交
            submitDismissalApprovalEvent (boolean) {
                let info =  {}
                info = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData().then(item => {
                    if (item && info) {
                        Object.assign (this.values, item, info )
                        this.dialogVisible = true
                        this.prossValue.title = `辞退审批:人员【${this.values.dismissName}】`
                    } else return
                    if (boolean) {
                        this.prossValue = {
                            title: this.$route.params.title || '',
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.degree || '',
                            msg: ''
                        }
                    }
                    this.dialogVisible = true
                })
            },

            // 提交审批
            isSubmitDismissalApprovalEvent (item, boolean) {
                this.dialogVisible = this.isSendBack = false
                item["taskId"] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                if (boolean) {
                    dismissalApplicationOperation(this.values).then( res => {
                        if(res.code === 200) {
                            this.$message.success(res.message)
                            this.closeTag ()
                        }
                    })
                } else {
                    submitDismissalApproval(this.values).then( res => {
                        if(res.code === 200) {
                            this.$message.success(res.message)
                            this.closeTag ()
                        }
                    })
                }
            }, 

            // 流程操作
            consentUsingApplication (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closeTag ()
                    return
                }
                if (item) {
                    this.values['completeTask'] = item
                    dismissalApplicationOperation (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success (res.message)
                            this.closeTag ()
                        }
                    })
                }
            },

            closeTag () {
                let tagName = this.$route.path
                let path = '/personnelManagement/retirementNotificationModule'
                this.close ({ tagName, path })
            },

            closeTab(){
                this.$router.go(-1)
                let tagName = this.$route.path
                this.close ({ tagName })
            },

            printTemplate () {
                getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.$route.params.relevancyId}).then(res => {
                    this.$refs.printTemp.printTemplate (res)
                })
            },

            ...mapActions('d2admin/page', [
                'close' 
            ]),
            
        },

        created () {
            this.updataRouter ()
        },

        mounted () {
            
        },

    }
</script>


<style lang='scss' scoped>
    .add-resignation-application{
        background: #ffffff
    }
    .operation-button{
        margin: 0 auto;
        text-align: center;
    }
</style>
