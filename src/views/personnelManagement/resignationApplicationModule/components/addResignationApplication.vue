<template>
   <d2-container class="add-resignation-application">
       <el-card class="box-card closeHeader">
           <div slot="header">
                <el-button type="text" @click="closeTab"><i class="el-icon-close"></i></el-button>
            </div>
            <div class="qqt-container-full-center___top">
                <qqt-flow-tabs :procInstId="procInstId">
                    <template slot="content"> 
                        <fm-generate-form
                            :data="jsonData"
                            :remote="remoteFuncs"
                            :transform="transform"
                            :value="values"
                            @on-change="formChange"
                            @btnTableClick="btnTableClick"
                            ref="generateForm"/>
                        <bottom-information :values="values" :fieldTitle="fieldTitle" :timeTitle="timeTitle" :isShowAccessory="false" :transform="transform" ref="bottomInformation" /> 
                    </template>
                </qqt-flow-tabs>
            </div>

            <div class="operation-button">
                <el-button size="mini" type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', SubmissionDepartureApproval (true)">重新提交</el-button>
                <el-button size="mini" type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button size="mini" type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button size="mini" type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button size="mini" type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button size="mini" type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="addAndEditSaveBtn">保存</el-button>
                <el-button size="mini" type="primary" v-if="!transform.isShowDetails && procInstId === '' && $has ('LeaveOffice:list:submit')" @click="values['flag'] = '1', SubmissionDepartureApproval (false)">提交</el-button>
                <el-button size="mini" v-if="transform.isShowDetails" type="info" @click="printTemplate">打印</el-button>
                <el-button size="mini" @click="closeTag">关闭</el-button>
            </div>
       </el-card>
    
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="submitResignationApproval"/>

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
import { getDetails,findReverseRoute,careOf} from '../../../../api/approval/common'
import { qqtSendProcess, qqtFlowTabs, qqtConsent } from '@/components/qqt-subassembly'
import userModules from '../../../systemManagement/processDefinition/processModules/userModules'
import { listyBstaffLoan } from '../../../../api/financialManagement/staffLoan';
import { resignationApplicationPageSearch, resignationQueryPersonalDataID, 
    editResignationApplication, addResignationApplication, 
    queryResignationByID, handoverPersonResignation,
    // 流程接口
    submitResignationProcess, resignationApplicationOperation
    } from '../../../../api/personnelManagement/leaveApplication'
import { queryDicById } from '../../../../api/jointProject/index'
import bottomInformation from '../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
import util from '@/libs/util.js'
    let that = this
    export default {
        name:'addResignationApplication',
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
                isAdd: false,
                // 交接人下拉框
                isShowAdminDialog: false,
                leavingTypeArr: [],
                values:{
                    phone:'',
                    entryTime:'',
                    leavingTime:'',
                    leavingType:'',
                    addline:[],
                    addlines:[]
                },
                fieldTitle: '申请',
                timeTitle: '申请',
                jsonData: {},
                remark:'',
                upLoadFileDefaultList: [],

                // 物品交接人行index
                addlineIndex:'',
                btnTableClickVal:'',

                // 物品交接人
                goodsHandover:'',
                remoteFuncs: {
                    getleavingType(resolve){
                        resolve(that.leavingTypeArr) 
                    }
                },
                preservationBtn: false,
                submissionBtn: false,
                resignationApplicationInfo: false,

                dialogVisible: false,
                processModuleId: PERDONNELMANAGEMENT.LEAVEAPPLICATION,
                isSendBack: false,
                prossValue: {
                    title: ''
                }, 

                // 流程
                isSendBack: false,
                transform: {
                    isShowDetails: true
                },
                // 流程
                stutas:'',
                procInstId: '',
                nodeData: {
                    operation: '',
                    msg:''
                },
                visible: false,
                isReject: false,
                isTurnManage: false,
                code: BASICSCODE.PERSONNELMANAGEMENT_LEAVEOFFICE
            }
        },

        methods: {

            // 表单设计器
            getFormByJson () {
                formGetJson ({'code': PERDONNELMANAGEMENT.LEAVEAPPLICATION}).then(res => {
                    if (res) {
                        this.jsonData = JSON.parse(res)
                    }
                })
            },
            
            // 通过调用字典项去查询离职类型
            getqueryDicById () {
                queryDicById ({id: '1187257124543401984'}).then(res =>{
                    if (res && res.length > 0) {
                        this.leavingTypeArr = res
                        if(res && res.length){
                            res.forEach (data => {
                                this.values.leavingType = ''
                            })
                        }
                    }
                }).finally(res => {
                    this.getFormByJson()
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
                    this.getQueryResignationByID (this.$route.params.relevancyId)
                }
                if (this.$route.params.relevancyId === undefined) {
                    this.getResignationQueryPersonalDataID ()
                }
            },
            
            getResignationQueryPersonalDataID () {
                resignationQueryPersonalDataID({ 
                    id: util.cookies.get ('uuid')
                }).then( res => {
                    if (res.procState != '1') {
                        this.transform.isShowDetails = true
                    }
                    res.addline == null ? res.addline = [] : res.addline = res.addline
                    res.addlines == null ? res.addlines = [] : res.addlines = res.addlines
                    this.$route.params.relevancyId = res.id
                    Object.assign (this.values, res)
                })
            },
            getQueryResignationByID (id) {
                queryResignationByID ({'id': this.$route.params.relevancyId}).then (res => {
                    if (res) { this.values = JSON.parse (JSON.stringify (res)); this.fileDefaultNeaten (res) }
                })
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

            getDetailsList (taskId) {
                getDetails (taskId).then (res => {
                    if (res) {
                        this.nodeData = res
                    }
                })
            },

            // 保存 && 编辑
            addAndEditSaveBtn () {
                let info =  {}
                info = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData().then(item => {
                    if (item && info) {
                        this.values.id= this.$route.params.relevancyId
                        Object.assign ( this.values, item, info)
                        let url = ''
                        this.$route.params.relevancyId == null ? url = addResignationApplication : url = editResignationApplication
                        url(this.values).then( res => {
                            this.$message.success(res.message)
                            this.closeTag () 
                        })
                    }
                })
            },

            // 提交
            SubmissionDepartureApproval (boolean) {
                let info =  {}
                info = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData().then(item => {
                    if ( item && info ) {
                        Object.assign(this.values, item, info)
                        this.dialogVisible = true
                        this.prossValue.title = `离职审批，人员:【${item.leavingName}】`
                    } else {
                        return
                    }
                    if(boolean) {
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

            submitResignationApproval (item, boolean) {
                this.dialogVisible = this.isSendBack = false
                if (item) {
                    item["taskId"] = this.$route.params.taskId || ''
                    this.values['completeTask'] = item
                    if (boolean) {
                        resignationApplicationOperation(this.values).then( res => {
                            if(res.code === 200) {
                                this.$message.success(res.message)
                                this.closeTag ()
                            }
                        })
                    } else {
                        submitResignationProcess(this.values).then( res => {
                            if(res.code === 200) {
                                this.$message.success(res.message)
                                this.closeTag ()
                            }
                        })
                    }
                }
            },

            closeTab(){
                this.$router.go(-1)
                let tagName = this.$route.path
                this.close ({ tagName })
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
                    resignationApplicationOperation (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success (res.message)
                            this.closeTag ()
                        }
                    })
                }
            },

            closeTag () {
                let tagName = this.$route.path
                let path = '/personnelManagement/resignationApplicationModule'
                this.close ({ tagName, path })
            },

            printTemplate () {
                getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.$route.params.relevancyId}).then(res => {
                    this.$refs.printTemp.printTemplate (res)
                })
            },
            
            ...mapActions('d2admin/page', [
                'close' 
            ]),

            // 表单
            formChange (name,value,data) {
                this.values[name] = value;
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
                if (this.btnTableClickVal === 'addline') {
                    this.values.addline[i].recipient = list[0].name
                } else if (this.btnTableClickVal === 'addlines') {
                    this.values.addlines[i].recipient = list[0].name
                }
                this.isShowAdminDialog = false
                
            }

        },

        created () {
            this.getqueryDicById ()

            this.updataRouter ()
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
