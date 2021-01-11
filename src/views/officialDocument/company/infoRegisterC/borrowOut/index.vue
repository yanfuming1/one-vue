<template>
    <d2-container class="address-book">
        <el-card class="box-card closeHeader cerborrow">
            <div slot="header"><el-button type="text" @click="cancel"><i class="el-icon-close"></i></el-button></div>
            <div v-if="fromProcess">
            <qqt-flow-tabs v-if="tabShow" :procInstId="procInstId" :isProcessInstance='isProcessInstance' :pdfId="pdfId">
                <template slot="content">
                    <el-card :body-style="{ padding: '20px' }">
                    <div class="cer-borrow">
                        <fm-generate-form :data="jsonData" :transform="transform" :remote="remoteFunctions" :value="values" ref="generateForm"  @on-change="selectChange"/>
                        <bottomInformation :values="values" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
                        <el-row>
                            <el-col :span="24" style="text-align:center" class="d2-mt-20">
                                <el-button size="small" type="primary" v-if="backlog"  @click="consentFun">同意</el-button>
                                <el-button size="small" type="primary" v-if="isSendBack" @click="anewSubmitBtn">重新提交</el-button>
                                <el-button size="small" type="warning" v-if="btnList.indexOf('1') != -1 && backlog" @click="turnToFun">转办</el-button>
                                <el-button size="small" type="success" v-if="btnList.indexOf('2') != -1 && backlog" plain @click="returnBtn">驳回</el-button>
                                <el-button size="small" type="info" v-if="btnList.indexOf('3') != -1 && backlog" @click="invalidBtn">作废</el-button>
                                <el-button type="info" size="small" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                                <el-button size="small" type="primary" v-if="backlog" plain @click="cancel">取消</el-button>
                                <el-button size="small" type="primary" v-if="!backlog" @click="cancel">关闭</el-button>
                            </el-col> 
                        </el-row>
                    </div>
                    </el-card>
                </template>
            </qqt-flow-tabs>
            <el-dialog
                title="驳回"
                :visible.sync="rejectShow"
                width="30%"
                >
                <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                <el-form-item label="驳回节点：" prop="rejectVal">
                    <el-select v-model="form.rejectVal"  placeholder="" >
                    <el-option v-for="item in returnList"
                        :key="item.activityId"
                        :label="item.name"
                        :value="item.activityId">
                    </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="驳回理由：" prop="paymessage">
                    <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入驳回理由"
                        v-model="form.paymessage">
                    </el-input>
                </el-form-item>
                </el-form>
                <span slot="footer">
                    <el-button type="primary" @click="rejectOk">确 定</el-button>
                    <el-button @click="rejectCancel">取 消</el-button>
                </span>
            </el-dialog>
            </div>
            <div v-if="!fromProcess">
                <div class="cer-borrow">
                    <fm-generate-form :data="jsonData" :transform="transform" :remote="remoteFunctions" :value="values" ref="generateForm"  @on-change="selectChange"/>
                    <bottomInformation :values="values" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
                    <div class="drawer-btn" v-if="!transform.isShowDetails">
                        <el-button type="warning" size="small" @click="subProcess">提交</el-button>
                        <el-button type="info" size="small" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                        <el-button size="small" @click="cancel">取消</el-button>
                    </div>
                </div>
            </div>
        </el-card>
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
        <user-modules :showDialog="isShow" :userIds="user" :department="department" @clearUserPage="clearUserPage" @closeFun="isShow = false"></user-modules>
        <qqt-send-process v-if="dialogVisible" :isSendBack='isSendBack' :dialogVisible="dialogVisible" :prossValue="prossValue" :processModuleId="processModuleId" @close="closeFun" @selectData="selectDataFun"></qqt-send-process>
        <qqt-consent :dialogVisible="visible" :title="title" :taskId="taskId || ''" :type="consent['flag']" :isTurnManage="isTurnManage" :isReject="isReject" @close="consentBorrowingApply" />
    </d2-container>
</template>

<script>
import { formGetJson } from '../../../../../api/system/fromManagement/index'
import { companyBorrowSubmit, companyRecordQueryById, companyBorrowOperation, cRecordQueryDetailsByIds} from "../../../../../api/officalDocument/index"
import { getProjectAllOptions } from '../../../../../api/jointProject/index'
import { staffListAllByDep } from '../../../../../api/system/staff/staff'
import { CERTIFICATE } from '../../../../../enum/FORMCODE'
import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
import printTemplateByHtml from '@/views/systemManagement/printTemplate/components/printTemplateByHtml'
import { qqtSendProcess, qqtConsent } from '@/components/qqt-subassembly'
import { GetDepartTreeNew } from '../../../../../api/system/depart/depart-tree'
import userModules from '../../../../systemManagement/processDefinition/processModules/userModules'
import QqtFlowTabs from "../../../../../components/qqt-subassembly/qqt-flow-tabs/qqt-flow-tabs"
import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
import { getDetails,findReverseRoute,careOf} from '../../../../../api/approval/common'
import { mapActions } from 'vuex'
import util from '../../../../../libs/util'
let that = this 
export default {
    name: "useFlowB",
    components: {
        QqtFlowTabs,
        qqtSendProcess,
        qqtConsent,
        userModules,
        bottomInformation,
        'print-template-by-html': printTemplateByHtml
    },
    data() {
        return {
            jsonData: {},
            remoteFunctions:{},
            values: {
                charterLoanList: [{}],
                receiver: '',
                affiliatedConpany: '',
                phone: '',
            },
            transform: {
                isShowDetails: false
            },
            subValue: {},
            // 流程
            taskId: '',
            procInstId: '',
            pdfId: '',
            dialogVisible: false,
            isSendBack: false,
            prossValue: {},
            processModuleId: '',
            backlog: false,
            tabShow: false,
            fromProcess: false,
            btnList: '',
            pushData: {},
            isProcessInstance: '',
            visible: false,
            title: '',
            isTurnManage: false,
            isReject: false,
            consent: {},
            isShow: false,
            user: [],
            department: [],
            form: {
                rejectVal: '',
                paymessage: ''
            },
            rules: {
                rejectVal: [ { required: true, message: '请选择驳回节点', trigger: ['change','blur'] } ],
                paymessage: [ { required: true, message: '请选择驳回理由', trigger:  ['change','blur']  } ],
            },
            rejectVal: [ { required: true, message: '请选择驳回节点', trigger: ['change','blur'] }],
            paymessage: [ { required: true, message: '请选择驳回理由', trigger:  ['change','blur'] } ],
            processValue: {
                title: '',
                pdfId: '',
                degree: '',
            },
            allUser: [],
            rejectShow: false,
            returnList: '',
            departList: [],
            code: BASICSCODE.ADMIN_CHARTER_LOAN,
            subCompany: ''
        }
    },
    methods: {
        ...mapActions('d2admin/page', [
            'close',
            'open'
        ]),
        setRemote (allUser) {
            this.remoteFunctions= {
                getBorrower (resolve) {resolve(allUser)},
                getCompanyId (resolve) {resolve(that.departList)},
            }
        },
        selectChange(field, value, model){
            switch(field){
                case 'subConpanyId':
                    let num = 0 
                    this.setUser(value[value.length-1])
                    this.subCompany = '';
                    this.updataSubConpany (this.departList, value, num)
                    break
                case 'borrowerId':
                    this.allUser.forEach(item => {
                        if(item.id === value){
                            model.phone = item.phone
                            this.values = model
                        }
                    })
                    break
            }
        },

        updataSubConpany (departList, value, num) {
            departList.forEach( f => {
                if (f.id == value[num]) {
                    this.subCompany += f.name
                    if (f.child && f.child.length > 0) {
                        this.updataSubConpany (f.child, value, ++num ) 
                    }
                }
            })
        },


        setUser (id) {
            staffListAllByDep({depId: id}).then(res => {
                this.setRemote(res)
                this.allUser = res
            })
        },
        getJson () {
            formGetJson({ 'code': 'companyCerBorrow' }).then(res => {
                this.jsonData = JSON.parse(res)
            })
        },
        setData(res){
            this.allUser.forEach(item => {
                if(item.id === res.borrowerId){
                    res.borrower = item.name
                }
            })
            return res
        },
        // 提交
        subProcess () {
            let item = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData().then(res => {
                this.subValue = this.setData(res)
                this.subValue['registerDate'] = this.subValue.register[0]
                this.subValue['registerEndDate'] = this.subValue.register[1]
                Object.assign(this.subValue, item)
                this.subValue.subCompany = this.subCompany
                this.processModuleId = 'companyCerBorrow'
                this.prossValue.title = '公司证书借用审批'
                this.dialogVisible = true
            }).catch(e => {
                console.log(e)
            })
        },
        // 取消
        cancel () {
            this.$router.go(-1)
            let tagName = this.$route.path
            this.close ({ tagName })
        },
        closeFun () {
            this.dialogVisible = false
        },
        printTemplate () {
            getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.$route.params.businessId}).then(res => {
                if (res) this.$refs.printTemp.printTemplate (res)
            })
        },
        // 提交成功
        selectDataFun (data) {
            this.subValue['completeTask'] = data
            if(this.isSendBack){
                // 重新提交
                this.subValue.completeTask.taskId = this.taskId
                this.subValue.flag = '1'
                this.subValue.procInstId = this.procInstId
                companyBorrowOperation(this.subValue).then(res => {
                    this.$message.success("提交成功")
                    this.cancel()
                })
            }else{
                companyBorrowSubmit(this.subValue).then(res => {
                    this.$message.success("提交成功")
                    this.cancel()
                })
            } 
            
        },
        consentBorrowingApply(item = '', boolean = false){
            this.visible = this.isTurnManage = this.isReject = false
            if (boolean) {
                this.cancel ()
                return
            }
            if (item) {
                this.values = this.setData(this.values)
                this.values['completeTask'] = item
                this.values.flag= '1'
                this.values.procInstId = this.procInstId
                companyBorrowOperation(this.values).then(res => {
                    this.visible = false
                    this.$message.success("同意成功")
                    this.cancel()
                })
            }
        },
        // 同意
        consentFun () {
            this.visible = true
            this.title = '审批'
            this.consent['flag'] = '1'
        },
        // 重新提交
        anewSubmitBtn () {
            let item = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData().then(res => {
                this.subValue = this.setData(res)
                this.subValue['registerDate'] = this.subValue.register[0]
                this.subValue['registerEndDate'] = this.subValue.register[1]
                Object.assign(this.subValue, item)
                this.processModuleId = 'companyCerBorrow'
                this.prossValue.title = '公司证书借用审批'
                this.prossValue.pdfId = this.pushData.procDefId
                this.prossValue.degree = this.pushData.processVariables.degree
                this.dialogVisible = true
            })
        },
        // 转办
        turnToFun () {
            this.isShow = true
        },
        clearUserPage(item){
            if (item.length > 0) {
                this.isShow = !this.isShow
                let data = [];
                for (let i = 0; i < item.length; i++) {
                    let str = item[i].id
                    data.push(str)
                }
                this.$prompt('请输入转办理由', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    cancelButtonClass: "btn-custom-cancel",
                    inputPattern: /^\S/,
                    inputErrorMessage: '请输入转办理由'
                }).then(({ value }) => {
                    let jsonData = {
                        message:value,
                        candidateIds: data
                    }
                    careOf(this.taskId,jsonData).then(res=>{
                        if (res.success) {
                            this.$message.success('转办成功')
                            this.cancel()
                        }
                    })
                }).catch(() => {
                    this.$message.info('取消输入')
                });
            } else {
                this.$message.error('请选择要转办的部门或人员')
            }
        },
        // 驳回
        returnBtn () {
            this.rejectShow = true
        },
        rejectCancel(){
            this.rejectShow = false
        },
        rejectOk(){
            this.values.flag = '2'
            this.values['completeTask'] = {
                "taskId": this.taskId,
                activityId: this.form.rejectVal,
                msg: this.form.paymessage
            }
            this.values.procInstId = this.procInstId
            companyBorrowOperation(this.values).then(res => {
                this.$message.success("驳回成功")
                this.rejectShow = false
                this.cancel()
            })
        },
        // 作废
        invalidBtn () {
            this.$prompt('此操作将作废该条数据，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                cancelButtonClass: "btn-custom-cancel",
                inputPattern: /^\S/,
                inputErrorMessage: '请输入作废理由'
            }).then(({ value }) => {
                this.values.flag = '3'
                this.values['completeTask'] = {
                    "taskId":this.taskId,
                    msg: value
                }
                companyBorrowOperation(this.values).then(res => {
                    this.$message.success("作废成功")
                    this.cancel()
                })
            })
        },
        processGetInfo () {
            this.taskId = this.pushData.taskId
            this.procInstId = this.pushData.procInstId
            this.pdfId = this.pushData.procDefId
            this.tabShow = true
            if (this.pushData.activityId) {
                getDetails(this.pushData.procDefId + '/' +this.pushData.activityId).then(res=>{
                    this.btnList = util.isDef(res.operation) ? res.operation : ''
                    this.form.rejectVal = res.sendBackNode
                })
                if(this.pushData.pathName === 'backlog'){
                    findReverseRoute(this.pushData.procDefId + '/' +this.pushData.activityId).then(res=>{
                        this.returnList = res
                    })
                }
            }
            cRecordQueryDetailsByIds({ids:this.pushData.processVariables.relevancyId}).then(res => {
                res['register'] = [res.registerDate, res.registerEndDate]
                this.values = res
                this.setUser(res.subConpanyId[res.subConpanyId.length-1])
            }).finally(() => {
                this.getJson()
            })
        }
    },
    created () {
        GetDepartTreeNew().then(res => { this.departList.push(res), this.setRemote([]) })
    },
    mounted() {
        that = this
        let pushObj = this.$route.params.detailData
        this.setRemote([])
        if(pushObj){
            this.fromProcess = true
            this.pushData = JSON.parse(this.$route.params.detailData)
            this.processGetInfo()
            switch(this.pushData.pathName){
                case "backlog":
                    this.backlog = true
                    this.isSendBack = false
                    this.transform.isShowDetails = true
                    break
                case "sendBack":
                    this.isSendBack = true
                    this.backlog = false
                    this.transform.isShowDetails = false
                    break
                case "examine":
                    if(this.pushData.processVariables.processState === '6'){
                        this.isSendBack = true
                        this.backlog = false
                        this.transform.isShowDetails = false
                        break
                    }
                default:
                    this.backlog = false
                    this.isSendBack = false
                    this.transform.isShowDetails = true
                    break
            }
        }else{ 
            if(this.$route.params.newSub) {
                this.values.charterLoanList = this.$route.params.cerInfo
            }else{
                this.fromProcess = true
                this.backlog = false
                this.isSendBack = false
                this.procInstId = this.$route.params.procInstId
                this.tabShow = true
                this.transform.isShowDetails = true
                this.setUser(this.$route.params.cerInfo.subConpanyId[this.$route.params.cerInfo.subConpanyId.length-1])
                this.$route.params.cerInfo['register'] = [this.$route.params.cerInfo.registerDate, this.$route.params.cerInfo.registerEndDate]
                this.values = this.$route.params.cerInfo
            }
            this.getJson()
        }
    }
}
</script>
<style lang="scss">
.drawer-btn {
    text-align: center;
    margin-top: 20px;
}
.cerborrow{
    .el-card__body{
        padding-top: 40px;
    }
}
.cer-borrow {
    .fm-form-table-color .form-table {
        .el-table {
            .el-table__fixed-body-wrapper {
                .scope-action{
                    display: none !important;
                }
                .scope-index{
                    display: block;
                }
            }
            .hover-row {
                .scope-action{
                    display: none !important;
                }
            }
        }
        .el-button.el-button--text {
            display: none;
        }
    }
}
</style>