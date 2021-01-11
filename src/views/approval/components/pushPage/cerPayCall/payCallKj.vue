<template>
    <d2-container class="address-book">
        <el-card class="box-card closeHeader">
            <div slot="header"><el-button type="text" @click="cancel"><i class="el-icon-close"></i></el-button></div>
            <div v-if="fromProcess">
            <qqt-flow-tabs v-if="tabShow" :procInstId="procInstId" :isProcessInstance='isProcessInstance' :pdfId="pdfId">
                <template slot="content">
                    <el-card :body-style="{ padding: '20px' }">
                    <div class="cer-borrow">
                        <fm-generate-form :data="jsonData" :transform="transform" :remote="remoteFunctions" :value="values" ref="generateForm">
                            <template slot="accountInfo">
                                <div class="account-info">
                                    <collect-module :selectData="recsSelectData" :getSize="size" ref="recsSelect" :isShowDetails="transform.isShowDetails"  :data="recsCollectData"  @selectChange="selectAccount"></collect-module>
                                </div>
                            </template>
                        </fm-generate-form>
                        <bottomInformation :fieldTitle="'申请'" :timeTitle="'申请'" :values="values" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
                        <accountant :isShowDetails="isShowDetails" :dataInfo="accDataInfo" ref="accountant"></accountant>
                        <el-row>
                            <el-col :span="24" style="text-align:center" class="d2-mt-20">
                                <qqt-voucher :voucherShow="voucherShow" @dialogComfirm="dialogComfirm" @dialogCancel="voucherShow=false" ref="voucher"  :data="values" ></qqt-voucher>
                                <el-button size="small" type="primary" v-if="backlog"  @click="consentFun">同意</el-button>
                                <el-button size="small" type="primary" v-if="isSendBack" @click="anewSubmitBtn">重新提交</el-button>
                                <el-button size="small" type="warning" v-if="btnList.indexOf('1') != -1 && backlog" @click="turnToFun">转办</el-button>
                                <el-button size="small" type="success" v-if="btnList.indexOf('2') != -1 && backlog" plain @click="returnBtn">驳回</el-button>
                                <el-button size="small" type="info" v-if="btnList.indexOf('3') != -1 && backlog" @click="invalidBtn">作废</el-button>
                                <el-button size="small" type="primary" v-if="backlog" plain @click="cancel">取消</el-button>
                                <el-button size="small" type="primary" v-if="!backlog" @click="cancel">关闭</el-button>
                            </el-col> 
                        </el-row>
                    </div>
                    </el-card>
                </template>
            </qqt-flow-tabs>
            <el-dialog title="驳回" :visible.sync="rejectShow" width="30%" >
                <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                <el-form-item label="驳回节点：" prop="rejectVal">
                    <el-select v-model="form.rejectVal"  placeholder="" >
                        <el-option v-for="item in returnList" :key="item.activityId" :label="item.name" :value="item.activityId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="驳回理由：" prop="paymessage">
                    <el-input type="textarea" :rows="2" placeholder="请输入驳回理由" v-model="form.paymessage"></el-input>
                </el-form-item>
                </el-form>
                <span slot="footer">
                    <el-button type="primary" @click="rejectOk">确 定</el-button>
                    <el-button @click="rejectCancel">取 消</el-button>
                </span>
            </el-dialog>
            </div>
        </el-card>
        <user-modules :showDialog="isShow" :userIds="user" :department="department" @clearUserPage="clearUserPage" @closeFun="isShow = false"></user-modules>
        <qqt-consent :dialogVisible="visible" :title="title" :taskId="taskId || ''" :type="consent['flag']" :isTurnManage="isTurnManage" :isReject="isReject" @close="consentBorrowingApply" />
    </d2-container>
</template>
<script>
import { formGetJson } from '../../../../../api/system/fromManagement/index'
import { CERTIFICATE } from '../../../../../enum/FORMCODE'
import { qqtConsent, qqtVoucher} from '@/components/qqt-subassembly'
import { payRecordSubmit, payRecordQueryById, payRecordOperation, getExceptUserAccount } from '../../../../../api/officalDocument/index'
import { getDetails,findReverseRoute,careOf} from '../../../../../api/approval/common'
import userModules from '../../../../systemManagement/processDefinition/processModules/userModules'
import QqtFlowTabs from "../../../../../components/qqt-subassembly/qqt-flow-tabs/qqt-flow-tabs"
import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
import accountant from '../projectCashRequest/components/accountant'
import collectModule from '../components/collectModule'
import { mapActions } from 'vuex'
import util from '../../../../../libs/util'
export default {
    components:{
        qqtConsent,
        userModules,
        QqtFlowTabs,
        accountant,
        collectModule,
        qqtVoucher,
        bottomInformation
    },
    data() {
        return {
            voucherShow: false,
            recsSelectData: [],
            recsCollectData: {
                name: '',
                openingBank: '',
                account: '',
            },
            size: "medium",
            isShowDetails: false,
            subValue: {},
            remoteFunctions: {},
            jsonData: {},
            transform: {
                isShowDetails: false
            },
            values: {},
            dialogVisible: false,
            isSendBack: false,
            prossValue: {},
            processModuleId: '',
            fromProcess: false,
            isProcessInstance: '',
            backlog: false,
            tabShow: false,
            btnList: '',
            pushData: {},
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
            taskId: '',
            rejectShow: false,
            returnList: [],
            accDataInfo: [],
        }
    },
    methods: {
        ...mapActions('d2admin/page', [
            'close',
            'open'
        ]),
        cancel() {
            this.$router.go(-1)
            let tagName = this.$route.path
            this.close ({ tagName })
        },
        getJson(){
            formGetJson({
                'code': CERTIFICATE.GUAKAOPAY
            }).then(res => {
                this.jsonData = JSON.parse(res)
            })
        },
        selectAccount(){
            getExceptUserAccount().then(res=>{
                // 获取下拉框值
                this.recsSelectData = res || [];
            })
        },
        canSub(){
            this.accDataInfo = this.$refs.accountant.getData()
            let mm = 0
            this.accDataInfo.forEach(item => {
                mm += Number(item.money)
            })
            if(parseFloat(this.values.money).toFixed(2) === parseFloat(mm).toFixed(2)){
                return true
            }else {
                return false
            }
        },
        dialogComfirm () {
            this.$refs.voucher.comfirmData().then(res=> {
                this.voucherShow = false;
                this.visible = true;
                this.title = '审批'
                this.consent['flag'] = '1'
            })
        },
        // 同意
        consentFun(){
            if(this.canSub()){
                // this.voucherShow = true;
                this.visible = true;
                this.title = '审批'
                this.consent['flag'] = '1'
            } else {
                this.$message.warning("公司支付金额与支付金额不相等，不能提交!!!")
            }
        },
        consentBorrowingApply(item = '', boolean = false){
            this.visible = this.isTurnManage = this.isReject = false
            if (boolean) {
                this.cancel ()
                return
            }
            if (item) {
                this.values['completeTask'] = item
                this.values.flag= '1'
                this.values.procInstId = this.procInstId
                this.values.companyPayList = this.accDataInfo
                payRecordOperation(this.values).then(res => {
                    this.visible = false
                    this.$message.success("同意成功")
                    this.cancel()
                })
            }
        },
        // 重新提交
        anewSubmitBtn () {
            let item = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData().then(res => {
                // let resTem = this.setData(res)
                if(this.canSub()){
                    this.values.companyPayList = this.accDataInfo
                    Object.assign(this.values, res, item)

                    this.processModuleId = 'cerPayRegister'
                    this.prossValue.title = '证书挂靠费用申请,证书名称:【 ' + res.name + '】'
                    this.prossValue.pdfId = this.pushData.procDefId
                    this.prossValue.degree = this.pushData.processVariables.degree
                    this.dialogVisible = true
                }
            })
        },
        // 转办
        turnToFun(){
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
            payRecordOperation(this.values).then(res => {
                this.$message.success("驳回成功")
                this.rejectShow = false
                this.cancel()
            })
        },
        // 作废
        invalidBtn(){
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
                payRecordOperation(this.values).then(res => {
                    this.$message.success("作废成功")
                    this.cancel()
                })
            })
        },
        processGetInfo(){
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
            payRecordQueryById({id:this.pushData.processVariables.relevancyId}).then(res => {
                this.recsCollectData.name = res.username
                this.recsCollectData.openingBank = res.openingBank
                this.recsCollectData.account = res.cardNumber
                res.money = res.money + ''
                this.accDataInfo = res.companyPayList
                this.values = res
            }).finally(() => {
                this.getJson()
            })
        }
    },
    mounted() {
        this.selectAccount()
        let pushObj = this.$route.params.detailData
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
        }
        this.getJson()
    }
}
</script>
<style lang="scss">
.account-info{
    .el-form-item{
        margin-bottom: 0px;
    }
}
</style>