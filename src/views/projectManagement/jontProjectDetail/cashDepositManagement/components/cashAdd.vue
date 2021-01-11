<template>
    <d2-container class="address-book">
        <el-card class="box-card closeHeader">
        <div slot="header"><el-button type="text" @click="closeTab"><i class="el-icon-close"></i></el-button></div>
        <div v-if="fromProcess">
            <qqt-flow-tabs v-if="tabShow" :procInstId="procInstId" :isProcessInstance='isProcessInstance' :pdfId="pdfId">
                <template slot="content">
                    <el-card :body-style="{ padding: '20px' }">
                        <fm-generate-form
                            :data="jsonData"
                            :remote="remoteFuncs"
                            :value="values"
                            :transform="transform"
                            @on-change="valueChange"
                            ref="generateForm">
                            <template slot="bankInfo">
                                <collect-bank :getSize="formSize" ref="collectBank" :selectData="collectUnitAccount" :data="bankData" :isShowDetails="transform.isShowDetails"></collect-bank>
                            </template>
                            <template slot="applicantInfor">
                            </template>
                        </fm-generate-form>
                        <el-form ref="rateInfoForm" v-if="showRate" class="cash-rate-form" :model="rateInfo" label-width="120px" size="medium">
                            <el-row>
                                <el-col :span="8">
                                    <el-form-item label="计息方式:">
                                        <el-select v-if="!transform.isShowDetails" v-model="rateInfo.interestAccrualManner" placeholder="请选择计息方式">
                                            <el-option v-for="item in accrualMannerOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                        </el-select>
                                        <el-input v-if="transform.isShowDetails" v-model="rateInfo.interestAccrualMannerName" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="利率:" prop="name">
                                        <el-input v-if="!transform.isShowDetails" v-model="rateInfo.interestRate"><template slot="append">%</template></el-input>
                                        <el-input v-if="transform.isShowDetails" disabled v-model="rateInfo.interestRate"><template slot="append">%</template></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="起息日期:" prop="name">
                                        <el-date-picker v-if="!transform.isShowDetails" v-model="rateInfo.dateValue" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
                                        <el-date-picker v-if="transform.isShowDetails" disabled v-model="rateInfo.dateValue" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                        <accountant :isShowDetails="isShowDetails" :dataInfo="accDataInfo" ref="accountant" v-if="showAcc"></accountant>
                        <div class="up-load-div">
                            <el-divider content-position="left">附件</el-divider>
                            <up-load :isShowUpload="!transform.isShowDetails" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList" ref="upload"/>
                        </div>
                        <bottom-information :values="values" :fieldTitle="'申请'" :timeTitle="'申请'" :isShowAccessory="false" :transform="transform" ref="bottomInformation" />
                        <el-row>
                            <el-col :span="24" style="text-align:center" class="d2-mt-20">
                                <qqt-look-voucher :data="values" ref="voucher"></qqt-look-voucher>
                                <el-button size="small" type="primary" v-if="backlog"  @click="consentFun">同意</el-button>
                                <el-button size="small" type="primary" v-if="isSendBack" @click="anewSubmitBtn">重新提交</el-button>
                                <el-button size="small" type="warning" v-if="btnList.indexOf('1') != -1 && backlog" @click="turnToFun">转办</el-button>
                                <el-button size="small" type="success" v-if="btnList.indexOf('2') != -1 && backlog" plain @click="returnBtn">驳回</el-button>
                                <el-button size="small" type="info" v-if="btnList.indexOf('3') != -1 && backlog" @click="invalidBtn">作废</el-button>
                                <el-button type="info" size="small" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                                <el-button size="small" type="primary" v-if="backlog" plain @click="closeTab">取消</el-button>
                                <el-button size="small" type="primary" v-if="!backlog" @click="closeTab">关闭</el-button>
                            </el-col>
                        </el-row>
                    </el-card>
                </template>
            </qqt-flow-tabs>
            <el-dialog
                v-dialogDrag
                title="驳回"
                :visible.sync="rejectShow"
                width="30%">
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
            <fm-generate-form
                :data="jsonData"
                :remote="remoteFuncs"
                :value="values"
                :transform="transform"
                @on-change="valueChange"
                ref="generateForm">
                <template slot="bankInfo">
                    <collect-bank :getSize="formSize" ref="collectBank" :selectData="collectUnitAccount" :data="bankData" :isShowDetails="transform.isShowDetails"></collect-bank>
                </template>
                <template slot="applicantInfor">
                </template>
            </fm-generate-form>
                <el-form ref="rateInfoForm" v-if="showRate" class="cash-rate-form" :model="rateInfo" label-width="120px" size="medium">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="计息方式:">
                                <el-select v-if="!transform.isShowDetails" v-model="rateInfo.interestAccrualManner" placeholder="请选择计息方式">
                                    <el-option v-for="item in accrualMannerOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                                <el-input v-if="transform.isShowDetails" v-model="rateInfo.interestAccrualMannerName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="利率:" prop="name">
                                <el-input v-if="!transform.isShowDetails" v-model="rateInfo.interestRate"><template slot="append">%</template></el-input>
                                <el-input v-if="transform.isShowDetails" disabled v-model="rateInfo.interestRate"><template slot="append">%</template></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="起息日期:" prop="name">
                                <el-date-picker v-if="!transform.isShowDetails" v-model="rateInfo.dateValue" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
                                <el-date-picker v-if="transform.isShowDetails" disabled v-model="rateInfo.dateValue" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="up-load-div">
                    <el-divider content-position="left">附件</el-divider>
                    <up-load :isShowUpload="!transform.isShowDetails" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList" ref="upload"/>
                </div>
                <bottom-information :values="values" :fieldTitle="'申请'" :timeTitle="'申请'" :isShowAccessory="false" :transform="transform" ref="bottomInformation" />
                <div class="drawer-btn">
                    <el-button v-if="!transform.isShowDetails" type="warning" size="small" @click="saveNew">保存</el-button>
                    <el-button v-if="!transform.isShowDetails && $has('joint:marginPayment:submit')" type="primary" size="small" @click="subNewPro">提交</el-button>
                    <el-button size="small" v-if="!transform.isShowDetails" @click="cancel">取消</el-button>
                    <el-button type="info" size="small" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                    <el-button v-if="transform.isShowDetails" type="primary" size="small" @click="cancel">关闭</el-button>
                </div>
        </div>
        </el-card>
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
        <user-modules :showDialog="isShow" :userIds="user" :department="department" @clearUserPage="clearUserPage" @closeFun="isShow = false"></user-modules>
        <qqt-send-process v-if="dialogVisible" :isSendBack='isSendBack' :dialogVisible="dialogVisible" :prossValue="prossValue" :processModuleId="processModuleId" @close="closeFun" @selectData="selectDataFun"></qqt-send-process>
        <qqt-consent :msg="msg" :dialogVisible="visible" :title="title" :taskId="taskId || ''" :type="consent['flag']" :isTurnManage="isTurnManage" :isReject="isReject" @close="consentBorrowingApply" />
    </d2-container>
</template>
<script>
import { PORJECT_INFO, PROJECT_GETINFOID } from '../../../../../enum/PROJECT'
import { queryDicById } from '../../../../../api/system/dic/dic'
import { qqtSendProcess } from '@/components/qqt-subassembly'
import { formGetJson } from '../../../../../api/system/fromManagement/index'
import { qqtFlowDiagram,qqtFlowTabs, qqtConsent,qqtLookVoucher,upload} from '../../../../../components/qqt-subassembly'
import { getMarginPaymentlById, getProById, marginPaymentAdd, marginPaymentEdit,marginPaymentSubmit,
         marginPaymentOperation, getByAccountTypeListAll,getProjectAllOptions } from '../../../../../api/jointProject/index'
import { getDetails,findReverseRoute,careOf} from '../../../../../api/approval/common'
import { configQueryById} from '../../../../../api/configuration/index'
import { mapActions } from 'vuex'
import collectBank from '../../components/collectBank'
import userModules from '../../../../systemManagement/processDefinition/processModules/userModules'
import accountant from '../../../../approval/components/pushPage/projectCashRequest/components/accountant'
import util from '../../../../../libs/util'
import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
import printTemplateByHtml from '@/views/systemManagement/printTemplate/components/printTemplateByHtml'
let that = this
export default {
    name: "cashAdd",
    components:{
        qqtSendProcess,
        accountant,
        userModules,
        qqtFlowDiagram,
        qqtFlowTabs,
        qqtConsent,
        collectBank,
        qqtLookVoucher,
        'up-load': upload,
        'bottom-information': bottomInformation,
        'print-template-by-html': printTemplateByHtml
    },
    data() {
        return {
            formSize: 'medium',
            showRate: false,
            collectUnitAccount: [],
            jsonData: {},
            resmotOption: {},
            remoteFuncs: {},
            values: {},
            fieldTitle: '申请',
            transform: {
                isShowDetails: false
            },
            proId: '',
            dialogVisible: false,
            processModuleId:'',
            fromProcess: false,
            accDataInfo: [],
            backlog: false,
            isSendBack: false,
            prossValue: {},
            subValue: {},
            taskId: '',
            procInstId: '',
            pdfId: '',
            tabShow: false,
            isShow: false,
            user: [],
            department: [],
            returnList: [],
            btnList: '',
            processValue: {
                title: '',
                pdfId: '',
                degree: '',
            },
            rules: {
                rejectVal: [
                    { required: true, message: '请选择驳回节点', trigger: ['change','blur'] }
                ],
                paymessage: [
                    { required: true, message: '请选择驳回理由', trigger:  ['change','blur']  }
                ],
            },
            form: {
                rejectVal: '',
                paymessage: ''
            },
            rejectShow: false,
            isProcessInstance: '',
            isShowDetails: true,
            showAcc: true,
            rateInfo: {
                interestAccrualManner: '',  // 计息方式
                interestRate: '',  // 利率
                dateValue: '', // 起息日期
            },
            accrualMannerOption: [
                {value: '1197335230566318080',label: '日息'},
                {value: '1197334487260151808',label: '月息'},
                {value: '1197317410252005376',label: '年息'}
            ],
            // 新组件
            isTurnManage: false,
            consent: {},
            visible: false,
            isReject: false,
            title: '',
            bankData: {
                name: '',
                openingBank: '',
                account: '',
            },
            msg: '',
            fileList: [],
            upLoadFileDefaultList: [],
            code: BASICSCODE.JOINT_MARGIN_PAYMENT
        }
    },
    methods: {
        ...mapActions('d2admin/page', [
            'close',
            'open'
        ]),
        valueChange(field, value, model){
            switch(field) {
                case 'collectUnitAccountId':
                    this.collectUnitAccount.forEach(item => {
                        if(value === item.id){
                            model.openingBank = item.openingBank
                            model.accountNumber = item.account
                            model.lineNumber = item.onlyCoding
                            this.values = model
                        }
                    })
                    break
                case 'premiumReceived':
                    if(model.premiumReceived < 0){
                        this.$message.warning("缴纳金额不能为负!!!")
                        model.premiumReceived = ''
                    } else {
                        model.matEndowment = Number(model.balance) < value ? value - Number(model.balance) + '' : '0'
                        model.amountInWords = util.convertCurrency(model.matEndowment)
                        Object.assign(this.values, model)
                    }
                    break
                case 'interestRate':
                    if(Number(value) < 0){
                        this.$message.warning("利率不能为负!!!")
                        model.interestRate = ''
                    }
                    break
                case 'isRate':
                    this.showRate = value === '1' ? true : false
                    break
                default:
                    break
            }
        },
        upLoadFileCallBack (data) {
            this.fileList = data
        },
        setFile(fileList){
            this.upLoadFileDefaultList = []
            if(fileList && fileList.length > 0){
                fileList.forEach(item => {
                    let tem = {
                        status: "finished",
                        response: {
                            name: item.name,
                            url: item.url,
                            size: item.size
                        }
                    }
                    this.upLoadFileDefaultList.push(tem)
                })
            }
        },
        saveNew() {
            this.$refs.generateForm.getData().then(res => {
                let info = this.$refs.bottomInformation.getData ()
                // if(this.ruleRate(res) === '0'){
                //     return false
                // }
                this.$refs.collectBank.getData().then(bankInfo => {
                    if (res && bankInfo && info) {
                        res.collectUnitAccountId = bankInfo.name
                        res.openingBank = bankInfo.openingBank
                        res.accountNumber = bankInfo.account
                        res.collectUnitAccount = bankInfo.nameInfo

                        res = this.prepareData(res)
                        res.projectId = this.proId
                        res.associatedPersonId = this.values.associatedPersonId
                        Object.assign (res, info)
                        if (res.isRate == '0') {
                            res.interestAccrualManner = '';
                            res.interestRate = '';
                            res.dateValue = '';
                        }
                        res.fileList = this.fileList
                        if(this.$route.params.isAdd){
                            marginPaymentAdd(res).then(res => {
                                this.$message.success("添加成功~~~")
                                this.closeTab()
                            })
                        }else{
                            res.id = that.values.id
                            marginPaymentEdit(res).then(res => {
                                this.$message.success("编辑成功~~~")
                                this.closeTab()
                            })
                        }
                    }
                })
            })
        },
        ruleRate (res) {
            if(res.isRate === '1'){
                if(res.interestAccrualManner === ''){
                    this.$message.warning("计息时计息方式不能为空!!!", 2000)
                    return '0'
                }
                if(res.interestRate === ''){
                    this.$message.warning("计息时利率不能为空!!!", 2000)
                    return '0'
                }
                if(res.dateValue === ''){
                    this.$message.warning("计息时起息日期不能为空!!!", 2000)
                    return '0'
                }
            }
            return '1'
        },
        subNewPro(){
            this.$refs.generateForm.getData().then(res => {
                let info = this.$refs.bottomInformation.getData ()
                this.$refs.collectBank.getData().then(bankInfo => {
                    if (res && bankInfo && info) {
                        res.collectUnitAccountId = bankInfo.name
                        res.openingBank = bankInfo.openingBank
                        res.accountNumber = bankInfo.account
                        res.collectUnitAccount = bankInfo.nameInfo

                        if(this.ruleRate(res) === '0'){
                            return false
                        }
                        res.associatedPersonId = this.values.associatedPersonId
                        res.projectId = this.proId
                        res.projectType = '1'
                        res = this.prepareData(res)
                        res.fileList = this.fileList
                        this.subValue = res
                        Object.assign (res, info)
                        if(!this.$route.params.isAdd){
                            this.subValue.id = this.$route.params.cashInfo.id
                        }
                        this.processModuleId = 'cashPayment'
                        this.prossValue.title = '保证金缴纳申请, 金额:【' + res.premiumReceived + '元】'
                        this.dialogVisible = true
                    }
                })
            })

        },
        closeFun(){
            this.prossValue = {}
            this.dialogVisible = false
        },
        selectDataFun(data) {
            this.subValue.completeTask = data
            if (this.isSendBack) {
                this.subValue.completeTask.taskId = this.taskId
                this.subValue.flag = '1'
                this.subValue.procInstId = this.procInstId
                marginPaymentOperation(this.subValue).then(res => {
                    this.$message.success("重新提交成功~~~")
                    this.closeTab()
                })
            } else {
                let tem = {
                    id: this.proId,
                    marginPayment: this.subValue
                }
                marginPaymentSubmit(tem).then(res => {
                    this.dialogVisible = false
                    this.$message.success("提交成功~~~")
                    this.closeTab()
                })
            }
        },
        cancel() {
            this.closeTab()
        },
        consentBorrowingApply(item = '', boolean = false){
            this.visible = this.isTurnManage = this.isReject = false
            if (boolean) {
                this.closeTab ()
                return
            }
            if (item) {
                let tem = this.temData
                if(util.isArray(tem.section)){
                    tem.section = util.jointData(tem.section, ',')
                }
                tem['completeTask'] = item
                tem.flag= '1'
                tem.procInstId = this.procInstId
                marginPaymentOperation(tem).then(res => {
                    if (item.type == '1') {
                        this.$refs.voucher.CNEdit();
                    }
                    if (res.code === 200) {
                        this.$message.success ("同意成功")
                        this.closeTab()
                    }
                })
            }
        },
        consentFun(){
            this.visible = true
            this.title = '审批'
            this.consent['flag'] = '1'
        },
        prepareData(res){
            let choseItem = this.collectUnitAccount.find(el => el.id === res.collectUnitAccountId)
            if(choseItem) {
                res['collectUnitAccount'] = choseItem.name
            } else {
                res['collectUnitAccount'] = res.collectUnitAccountId
            }

            this.resmotOption.cashDeposit.forEach(item => {
                if(item.id === res.marginId){
                    res.marginType = item.name
                }
            })
            if(util.isArray(res.section)){
                res.section = util.jointData(res.section, ',')
            }
            if(res.isRate === '1'){
                res.interestAccrualManner = this.rateInfo.interestAccrualManner
                res.interestRate = this.rateInfo.interestRate
                res.dateValue = this.rateInfo.dateValue
            }
            return res
        },
        anewSubmitBtn() {
            this.$refs.generateForm.getData().then(res => {
                let info = this.$refs.bottomInformation.getData ()
                this.$refs.collectBank.getData().then(bankInfo => {
                    if(res && info && bankInfo) {
                        res.collectUnitAccountId = bankInfo.name
                        res.openingBank = bankInfo.openingBank
                        res.accountNumber = bankInfo.account
                        res.collectUnitAccount = bankInfo.nameInfo

                        if(this.ruleRate(res) === '0'){
                            return false
                        }
                        res.associatedPersonId = this.temData.associatedPersonId
                        res.projectId = this.temData.projectId
                        this.subValue = this.prepareData(res)

                        this.subValue = res
                        this.subValue.id = this.temData.id

                        this.prossValue.pdfId = this.pushData.procDefId
                        this.prossValue.degree = this.pushData.processVariables.degree
                        this.processModuleId = 'cashPayment'
                        this.prossValue.title = '保证金缴纳申请, 金额:【' + res.premiumReceived + '元】'
                        
                        this.dialogVisible = true
                    }
                })
            }).catch(e => {
                console.log(e)
            })
        },
        turnToFun() {
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
                            this.closeTab()
                        }
                    })
                }).catch(() => {
                    this.$message.info('取消输入')
                });
            } else {
                this.$message.error('请选择要转办的部门或人员')
            }
        },
        returnBtn() {
            this.rejectShow = true
        },
        invalidBtn() {
            let tem = this.temData
            if(tem.section instanceof Array){
                tem.section = util.jointData(tem.section, ',')
            }
            this.$prompt('此操作将作废该条数据，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                cancelButtonClass: "btn-custom-cancel",
                inputPattern: /^\S/,
                inputErrorMessage: '请输入作废理由'
            }).then(({ value }) => {
                tem.flag = '3'
                tem.completeTask = {
                    "taskId":this.taskId,
                    "msg":value
                }
                marginPaymentOperation(tem).then(res => {
                    this.$message.success("作废成功")
                    this.closeTab()
                })
            })
        },
        rejectCancel(){
            this.rejectShow = false
        },
        rejectOk(){
            let tem = this.temData
            tem.section = util.jointData(tem.section, ',')
            this.$refs['form'].validate((valid) => {
                tem.flag = '2'
                tem.completeTask = {
                    "taskId":this.taskId,
                    activityId: this.form.rejectVal,
                    msg: this.form.paymessage
                }
                marginPaymentOperation(tem).then(res => {
                    this.$message.success("驳回成功")
                    this.closeTab()
                })
            })
        },
        async getProInfo() {
            const db = await this.$store.dispatch('d2admin/db/database', {user: true})
            this.proId = db.get('proID').value()
            if(this.$route.params.isAdd){
                getProById({id: this.proId}).then(res => {
                    res.isRate = '0'
                    delete res.createBy
                    delete res.createName
                    delete res.createTime
                    res.balance = res.balance.toFixed(2)
                    this.values = this.backData(res)
                })
            }else{
                // 是否计息
                this.showRate = this.$route.params.cashInfo.isRate === '1' ? true : false
                if(this.showRate){
                    this.rateInfo.interestAccrualManner = this.$route.params.cashInfo.interestAccrualManner
                    this.rateInfo.interestRate = this.$route.params.cashInfo.interestRate
                    this.rateInfo.dateValue = this.$route.params.cashInfo.dateValue
                    this.accrualMannerOption.forEach(item => {
                        if(item.value === this.rateInfo.interestAccrualManner) {
                            this.rateInfo.interestAccrualMannerName = item.label
                        }
                    })
                }
                if(util.isString(this.$route.params.cashInfo.procInstId) && this.$route.params.cashInfo.procInstId !== ''){
                    this.fromProcess = this.$route.params.isDetail
                    this.backlog = false
                    this.isSendBack = false
                    this.tabShow = true
                    this.taskId = this.$route.params.cashInfo.taskId
                    this.procInstId = this.$route.params.cashInfo.procInstId
                    this.pdfId = this.$route.params.cashInfo.procDefId
                    this.isShowDetails = true
                    this.accDataInfo = util.isArray(this.$route.params.cashInfo.companyList) ? this.$route.params.cashInfo.companyList : []
                } else if(this.$route.params.cashInfo.procState === '1'){
                    this.fromProcess = false
                    this.subValue = true
                    this.transform.isShowDetails = this.$route.params.isDetail ? true : false
                    this.isShowDetails = true
                }
                this.bankData.name = this.$route.params.cashInfo.collectUnitAccountId
                this.bankData.openingBank = this.$route.params.cashInfo.openingBank
                this.bankData.account = this.$route.params.cashInfo.accountNumber

                this.$route.params.cashInfo.matEndowment = Number(this.$route.params.cashInfo.balance) < Number(this.$route.params.cashInfo.premiumReceived)
                                ? Number(this.$route.params.cashInfo.premiumReceived) - Number(this.$route.params.cashInfo.balance) + '' : '0'
                this.$route.params.cashInfo.amountInWords = util.convertCurrency(this.$route.params.cashInfo.matEndowment)
                this.values = this.backData(this.$route.params.cashInfo)
                this.values.balance = this.values.balance.toFixed(2)
            }
            this.getJson()
        },
        backData (data) {
            if(util.isString(data.section)){
                data.section = util.splitData(data.section, ',')
            }
            data.section = util.isArray(data.section) ? data.section : []
            if(this.$route.params.isAdd){
                data.marginCode = "自动生成";
            }
            this.fileList = data.fileList
            this.setFile(data.fileList)
            return data
        },
        closeTab () {
            this.$router.go(-1)
            let tagName = this.$route.path
            this.close ({ tagName })
        },
        async printTemplate () {
            const db = await this.$store.dispatch('d2admin/db/database', {user: true})
            getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.$route.params.cashInfo.id}).then(res => {
                res.balance = res.balance + ''
                if (res) this.$refs.printTemp.printTemplate (res)
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
                    this.msg = res.msg
                })
                if(this.pushData.pathName === 'backlog'){
                    findReverseRoute(this.pushData.procDefId + '/' +this.pushData.activityId).then(res=>{
                        this.returnList = res
                    })
                }
            }
            getMarginPaymentlById({id:this.pushData.processVariables.relevancyId}).then(res => {
                if(util.isString(res.section)) {
                    res.section = util.splitData(res.section, ',')
                }
                if(this.$route.params.pathName === 'sendBack'){
                    res.matEndowment = Number(res.balance) < Number(res.premiumReceived)
                                    ? Number(res.premiumReceived) - Number(res.balance) + '' : '0'
                    res.amountInWords = util.convertCurrency(res.matEndowment)
                }
                this.bankData.name = res.collectUnitAccountId
                this.bankData.openingBank = res.openingBank
                this.bankData.account = res.accountNumber
                // 是否计息
                this.showRate = res.isRate === '1' ? true : false
                if(this.showRate){
                    this.rateInfo.interestAccrualManner = res.interestAccrualManner
                    this.rateInfo.interestRate = res.interestRate
                    this.rateInfo.dateValue = res.dateValue
                    this.accrualMannerOption.forEach(item => {
                        if(item.value === this.rateInfo.interestAccrualManner) {
                            this.rateInfo.interestAccrualMannerName = item.label
                        }
                    })
                }
                this.proId = res.projectId
                this.values = res
                this.temData = res
                this.accDataInfo = res.companyList
                this.fileList = res.fileList
                this.setFile(res.fileList)
            }).finally(() => {
                this.getJson()
            })
        },
        getCommonInfo(){
            getByAccountTypeListAll({accountType: 3}).then(res => {
                this.collectUnitAccount = res
            })
        },
        setRemote(option){
            this.remoteFuncs = {
                getMarginType(resolve){resolve(option.cashDeposit)},
                getSection(resolve){resolve(option.section)},
                getCollectUnit(resolve){resolve(that.collectUnitAccount)},
                getIsRate(resolve){
                    let options = [
                        {value: '1',label: '是'},
                        {value: '0',label: '否'}
                    ]
                    resolve(options)
                },
            }
        },
        getJson () {
            formGetJson({
                code: PORJECT_INFO.CASHPAYMENT
            }).then(res => {
                this.jsonData = JSON.parse(res)
            })
        }
    },
    created() {
        this.transform.isShowDetails = this.$route.params.isDetail
        this.getCommonInfo()
    },
    async mounted () {
        getProjectAllOptions().then(options => {
            this.resmotOption = options
            this.setRemote(options)
        }).finally(() => {
            that = this
            let pushObj = this.$route.params.detailData
            if(pushObj){
                this.isShowDetails = true
                this.fromProcess = true
                this.pushData = JSON.parse(this.$route.params.detailData)
                this.processGetInfo()
                switch(this.pushData.pathName){
                    case "backlog":
                        this.backlog = true
                        this.isSendBack = false
                        this.transform.isShowDetails = true
                        this.showAcc = true
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
                            this.showAcc = false
                            break
                        }
                    default:
                        this.backlog = false
                        this.isSendBack = false
                        this.transform.isShowDetails = true
                        this.showAcc = true
                        break
                }
            }else{
                this.getProInfo()
                this.fromProcess = false
            }
        })
    }
}
</script>
<style lang='scss'>
.drawer-btn{
    text-align: center;
}
.cash-rate-form{
    .el-select{
        width: 100%;
    }
    .el-input__inner{
        border-radius: 0px;
    }
    .el-input-group__append{
        border-radius: 0px;
    }
    .is-disabled{
        .el-input__inner{
            border: 0px;
        }
        .el-input-group__append{
            border: 0px;
        }
        .el-input__prefix{
            border-left: none;
        }
    }
}
.formAddClass{
    .el-form-item{
        margin-bottom: 0px;
    }
}
.up-load-div .el-divider__text{
    position: relative;
    display: inline-block;
    padding-left: 23px;
    &::before{
        content: '';
        width: 3px;
        height: 15px;
        background: #346fff;
        position: absolute;
        left: 15px;
        top: 4px;
    }
}
</style>
