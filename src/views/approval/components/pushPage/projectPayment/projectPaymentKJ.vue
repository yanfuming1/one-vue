<template>
    <d2-container class="address-book open-tender">
        <el-card class="box-card cash-return">
            <qqt-flow-tabs v-if="tabShow" :procInstId="procInstId" :isProcessInstance='isProcessInstance' :pdfId="pdfId">
                <template slot="content">
                    <el-form ref="form" :model="formData" :rules="rules" label-width="150px">
                        <el-divider>项目基本信息</el-divider>
                        <div class="project-base-info">
                            <el-row>
                                <el-col :span="16"><el-form-item label="项目名称:" required><el-input size="medium" v-model="formData.projectName" disabled /></el-form-item></el-col>
                                <el-col :span="8"><el-form-item label="标段:" required><el-input size="medium" v-model="formData.section" disabled /></el-form-item></el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="8"><el-form-item label="联营人:" required><el-input size="medium" v-model="formData.associatedPerson" disabled /></el-form-item></el-col>
                                <el-col :span="8"><el-form-item label="联系电话:" required><el-input size="medium" v-model="formData.phone" disabled /></el-form-item></el-col>
                                <el-col :span="8" v-if="notshow"><el-form-item label="累计到账总金额:" required><el-input size="medium" v-model="formData.projectTotalMoney" disabled>
                                    <template slot="append">元</template></el-input></el-form-item></el-col>
                                <el-col :span="8"><el-form-item label="中标时间:"><el-input size="medium" v-model="formData.theWinningTime" disabled /></el-form-item></el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="8"><el-form-item label="中标价:">
                                    <qqt-input v-model="formData.tenderPrice" :value="formData.tenderPrice" :isShowElement="notshow" 
                                            :isMoneyType="isMoneyType" :size="'medium'" :btnTitle="'元'"></qqt-input>
                                    </el-form-item></el-col>
                                <el-col :span="8"><el-form-item label="项目所在地:"><el-input size="medium" v-model="formData.projectLocation" disabled /></el-form-item></el-col>
                                <el-col :span="8"><el-form-item label="施工管理负责人:"><el-input size="medium" v-model="formData.managerPrincipal" disabled /></el-form-item></el-col>
                                <el-col :span="8" v-if="notshow"><el-form-item label="工程款余额:" required><el-input size="medium" v-model="formData.projectBalance" disabled>
                                    <template slot="append">元</template></el-input></el-form-item></el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="8"><el-form-item label="财务管理负责人:"><el-input size="medium" v-model="formData.financePrincipal" disabled /></el-form-item></el-col>
                            </el-row>
                        </div>
                        <div class="retuern-content">
                            <div class="right-balance">
                                <p>本次可支付联营人工程款金额: {{ projectBalance }}元</p>
                                <p>支付后剩余工程款金额: {{ practicalBalance }}元</p>
                            </div>
                            <el-tabs v-model="activeName" type="card">
                                <el-tab-pane :label="label1" name="first">
                                    <addline1 :isShowDetails='isShowDetails' :showAddName="showAddName" :isSendBack="isSendBack" :title="addTitle" :costType="costType" @change="addLineChange1" :isProcess='isProcess' :dataInfo='addLineData1' :showReject='showReject' ref="addline1"></addline1>
                                </el-tab-pane>
                                <el-tab-pane :label="label2" name="second">
                                    <addline1 :isShowDetails='isShowDetails' :showAddName="showAddName" :isSendBack="isSendBack" :title="addTitle1" :costType="costType" @change="addLineChange2" :isProcess='isProcess' :dataInfo='addLineData2' :showReject='showReject' ref="addline2"></addline1>
                                </el-tab-pane>
                                <el-tab-pane :label="label3" name="third">
                                    <pay-add-line :fromKJ="fromKJ" :isShowDetails='isShowDetails' :associatedPersonId='associatedPersonId' @change="addLineChange3" :dataInfo='addLineData3' ref="addline3"></pay-add-line>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                        <div>
                            <accountant :isShowDetails="accIsShowDetails" :dataInfo="accDataInfo" ref="accountant"></accountant>
                            <advisory-list :dataInfo="advisoryList" :isShowDetails="showAdvisory" ref="advisoryList"></advisory-list>
                        </div>
                        <div class="up-load-div">
                            <el-divider content-position="left">附件</el-divider>
                            <up-load :isShowUpload="!isShowDetails" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList" ref="upload"/>
                        </div>
                        <div>
                            <el-divider>备注</el-divider>
                            <el-row class="remark">
                                <el-col :span="24"><el-form-item label="备注:">
                                    <el-input v-model="formData.remark" v-if="!isShowDetails" placeholder="请输入" type="textarea"></el-input>
                                    <p v-if="isShowDetails">{{ formData.remark }}</p>
                                </el-form-item></el-col>
                            </el-row>
                        </div>
                        <bottomInformation :values="formData" :isGrid="false" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
                    </el-form>
                    <el-row>
                        <el-col :span="24" style="text-align:center" class="d2-mt-20">
                            <qqt-voucher ref="voucher"  :voucherShow="voucherShow" @dialogComfirm="dialogComfirm" @dialogCancel="voucherShow=false" :data="cloneData" ></qqt-voucher>
                            <el-button size="small" type="primary" v-if="backlog"  @click="consentFun">同意</el-button>
                            <el-button size="small" type="warning" v-if="btnList.indexOf('1') != -1 && backlog" @click="turnToFun">转办</el-button>
                            <el-button size="small" type="success" v-if="btnList.indexOf('2') != -1 && backlog" plain @click="returnBtn">驳回</el-button>
                            <el-button size="small" type="info" v-if="btnList.indexOf('3') != -1 && backlog" @click="invalidBtn">作废</el-button>
                            <el-button size="small" type="primary" plain @click="closeTab">取消</el-button>
                        </el-col>
                    </el-row>
                </template>
            </qqt-flow-tabs>
            <el-dialog v-dialogDrag title="驳回" :visible.sync="rejectShow" width="30%">
                <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                <el-form-item label="驳回节点：" prop="rejectVal">
                    <el-select v-model="form.rejectVal"  placeholder="" >
                        <el-option v-for="item in returnList" :key="item.activityId" :label="item.name" :value="item.activityId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="驳回理由：" prop="paymessage">
                    <el-input type="textarea" :rows="2" placeholder="请输入驳回理由" v-model="form.paymessage">
                    </el-input>
                </el-form-item>
                </el-form>
                <span slot="footer">
                    <el-button type="primary" @click="rejectOk">确 定</el-button>
                    <el-button @click="rejectCancel">取 消</el-button>
                </span>
            </el-dialog>
        </el-card>
        <user-modules :showDialog="isShow" :userIds="user" :department="department" @clearUserPage="clearUserPage" @closeFun="isShow = false"></user-modules>
        <qqt-consent :dialogVisible="visible" :title="title" :msg="msg" :taskId="taskId || ''" :type="consent['flag']" :isTurnManage="isTurnManage" :isReject="isReject" @close="consentBorrowingApply" />
    </d2-container>        
</template>
<script>
import { qqtFlowDiagram,qqtFlowTabs,qqtConsent,qqtInput,qqtVoucher,upload} from '../../../../../components/qqt-subassembly'
import { getDetails,findReverseRoute,careOf} from '../../../../../api/approval/common'
import { projectPaymenQueryById, projectPaymentOperation } from '../../../../../api/jointProject/projectPayment/index.js'
import { mapActions } from 'vuex'
import { getProjectAllOptions } from '../../../../../api/jointProject/index'
import advisoryList from './components/advisoryList'
import accountant from '../projectCashRequest/components/accountant'
import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
import userModules from '../../../../systemManagement/processDefinition/processModules/userModules'
import addline1 from '../../../../projectManagement/jontProjectDetail/projectPayment/components/addlines/addline1'
import payAddLine from '../../../../projectManagement/jontProjectDetail/projectPayment/components/addlines/payAddLine'
import util from '../../../../../libs/util'
export default { 
    name: 'projectPaymentBZ',
    components: {
        qqtFlowTabs,
        qqtFlowDiagram,
        addline1,
        payAddLine,
        userModules,
        accountant,
        advisoryList,
        qqtConsent,
        'up-load': upload,
        'qqt-input': qqtInput,
        qqtVoucher,
        bottomInformation
    },
    data () {
        return {
            voucherShow: false,
            cloneData: {},
            fromKJ: true,
            isProcess: true,
            notshow: false,
            isMoneyType: true,
            formData: {
                projectId: '',
                projectName: '',
                section: '',
                phone: '',
                marginType: '',
                marginCode: '',
                associatedPerson: '',
                balance: '',
            },
            associatedPersonId: '',
            rules: {},
            isShowDetails: false,
            transform: {
                isShowDetails: true
            },
            showAdvisory: true,
            activeName: 'first',
            label1: '本次应扣: 0元',
            label2: '本次暂押: 0元',
            label3: '本次支付: 0元',
            projectBalance: 0, 
            projectBalanceTem: '0.00',
            practicalBalance: 0, 
            practicalBalanceTem: '0.00',
            addLineData1: [],
            addLineData2: [],
            addLineData3: [],
            advisoryList: [],
            accIsShowDetails: false,
            dialogVisible: false,
            prossValue: {},
            processModuleId:'',
            subValue: {},
            accDataInfo: [],
            taskId: '',
            procInstId: '',
            pdfId: '',
            msg: '',
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
            showReject: true,
            addTitle: {
                line1: '应扣费用名称',
                line2: '应扣金额',
                line3: '扣款说明'
            },
            addTitle1: {
                line1: '暂押费用名称',
                line2: '暂押金额',
                line3: '暂押说明'
            },
            // 新组件
            isTurnManage: false,
            consent: {},
            visible: false,
            isReject: false,
            title: '',
            costType: [],
            backlog: false,
            isSendBack: false,
            showAddName: true,
            fileList: [],
            upLoadFileDefaultList: [],
        }
    },
    methods: {
        ...mapActions('d2admin/page', [
            'close',
            'open' 
        ]),
        closeTab () {
            this.$router.go(-1)
            let tagName = this.$route.path
            this.close ({ tagName })
        },
        addLineChange1(arr, index){
            this.addAccount(arr, '1', index)
        },
        addLineChange2(arr, index){
            this.addAccount(arr, '2', index)
        },
        addLineChange3(arr, index){
            this.addAccount(arr, '3', index)
        },
        addAccount(arr, type, index){
            if(arr && arr.length > 0){
                let account = 0
                arr.forEach(item => {
                    if(!item.isCount || item.isCount === '1' || !this.fromProcess){
                        account += Number(item.money !== '' ? item.money : '0')
                    }
                })
                switch (type){
                    case '1':
                        this.label1 = '本次应扣: ' + util.moneyTransform(account) + '元'
                        this.formData.deductMoney = account
                        break
                    case '2':
                        this.label2 = '本次暂押: ' + util.moneyTransform(account) + '元'
                        this.formData.pledgeMoney = account
                        break
                    case '3':
                        this.label3 = '本次支付: ' + util.moneyTransform(account) + '元'
                        this.formData.payMoney = account
                        break
                    default:
                        break
                }
                this.setBalance(type, index)
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
        calcutePay (payMoneyList) {
            let moneyTem = 0
            payMoneyList.forEach(item => {
                moneyTem += Number(item.money !== '' ? item.money : '0')
            })
            this.label3 = '本次支付: ' + util.moneyTransform(parseFloat(moneyTem).toFixed(2)) + '元'
            this.formData.payMoney =  parseFloat(moneyTem).toFixed(2)
        },
        setBalance (type, index) {
            let balanceTem = parseFloat(util.subtraction(util.subtraction (this.formData.projectBalance, this.formData.deductMoney), this.formData.pledgeMoney)).toFixed(2)
            let practicalBalanceTem = parseFloat(util.subtraction(balanceTem, this.formData.payMoney)).toFixed(2)
            if(practicalBalanceTem < 0){
                if(-practicalBalanceTem < Number(this.formData.payMoney && type !== '3')){
                    this.practicalBalance = '0.00'
                    this.projectBalance = balanceTem
                    let payMoneyList = this.$refs.addline3.getData()
                    try {
                        payMoneyList.forEach(item => {
                            practicalBalanceTem = Number(practicalBalanceTem) + Number(item.money)
                            if (practicalBalanceTem < 0) {
                                item.money = 0.00
                            } else {
                                item.money = practicalBalanceTem
                                this.calcutePay(payMoneyList)
                                throw new Error("end")
                            }
                        })
                    } catch (e) {
                        if (e.message !== "end") { throw e }
                    }
                } else {
                    this.$message.warning("支付金额不能为负!!!")
                    let temData = []
                    switch(type){
                        case '1':
                            temData = this.$refs.addline1.getData()
                            temData[index].money = ''
                            this.addLineData1 = temData
                            this.addLineChange1(temData, index)
                            this.cloneData.payList.forEach((item, index) => {
                                this.formData['payList'][index] = item
                            })
                            this.calcutePay(this.formData.payList)
                            break
                        case '2':
                            temData = this.$refs.addline2.getData()
                            temData[index].money = ''
                            this.addLineData2 = temData
                            this.addLineChange2(temData, index)
                            this.cloneData.payList.forEach((item, index) => {
                                this.formData['payList'][index] = item
                            })
                            this.calcutePay(this.formData.payList)
                            break
                        case '3' :
                            temData = this.$refs.addline3.getData()
                            temData[index].money = ''
                            this.addLineData3 = temData
                            this.addLineChange3(temData, index)
                            break
                        default:
                            break
                    }
                }
            } else {
                this.projectBalance = balanceTem
                this.practicalBalance = practicalBalanceTem
            }
        },
        getListData () {
            this.formData.deductList = this.$refs.addline1.getData()
            this.formData.pledgeList = this.$refs.addline2.getData()
            this.formData.payList = this.$refs.addline3.getData()
            this.formData.surplusMoney = this.practicalBalance
        },
        processGetInfo () {
            this.taskId = this.pushData.taskId
            this.procInstId = this.pushData.procInstId
            this.pdfId = this.pushData.procDefId
            this.tabShow = true
            if (this.pushData.activityId) {
                getDetails(this.pushData.procDefId + '/' +this.pushData.activityId).then(res=>{
                    this.btnList = res.operation
                    this.form.rejectVal = res.sendBackNode
                    this.msg = res.msg
                })
                findReverseRoute(this.pushData.procDefId + '/' +this.pushData.activityId).then(res=>{
                    this.returnList = res
                })
            }   
            projectPaymenQueryById({id:this.pushData.processVariables.relevancyId}).then(res => {
                res.tenderPrice = res.tenderPrice + ''
                this.formData = JSON.parse(JSON.stringify(res))
                this.cloneData = Object.assign({},res)
                if(util.isArray(res.section)){
                    this.formData.section = util.jointData(this.formData.section, ',')
                }
                this.formData.deductList.forEach(item => {
                    item.isProcess = true
                })
                this.formData.pledgeList.forEach(item => {
                    item.isProcess = true
                })
                this.setFile(res.fileList)
                this.addLineData1 = this.formData.deductList
                this.addLineData2 = this.formData.pledgeList
                this.addLineData3 = this.formData.payList
                this.associatedPersonId = res.associatedPersonId
                this.formData.bigWrite = util.convertCurrency(this.formData.balance)
                this.label1 = '本次应扣: ' + util.moneyTransform(this.formData.deductMoney) + '元'
                this.label2 = '本次暂押: ' + util.moneyTransform(this.formData.pledgeMoney) + '元'
                this.label3 = '本次支付: ' + util.moneyTransform(this.formData.payMoney) + '元'
                this.setBalance()
                if(res.advisoryList instanceof Array){
                    this.advisoryList = res.advisoryList
                }
                if(res.companyPayList instanceof Array){
                    this.accDataInfo = res.companyPayList
                }
            })
        },
        consentBorrowingApply(item = '', boolean = false){
            this.visible = this.isTurnManage = this.isReject = false
            if (boolean) {
                this.closeTab ()
                return
            }
            if (item) {
                this.getListData()
                let tem = this.formData
                tem.companyPayList = this.$refs.accountant.getData()
                tem['completeTask'] = item
                tem.flag = '1'
                tem.procInstId = this.procInstId
                projectPaymentOperation(tem).then(res => {
                    this.$message.success("同意成功")
                    this.closeTab()
                })
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
        consentFun () {
            let tem = this.formData
            tem.companyPayList = this.$refs.accountant.getData()
            if(tem.companyPayList.length > 0){
                let temD = 0
                tem.companyPayList.forEach(item => {
                    temD = Number(item.money ? item.money:'0') + Number(temD)
                })
                tem.companyPayMoney = temD
            }
            tem.companyPayMoney = tem.companyPayMoney+''
            console.log(tem , "11111")
            console.log(tem.companyPayMoney , "11111")
            console.log( tem.payMoney , "11111")
            if (tem.companyPayMoney == tem.payMoney) {
                // this.voucherShow = true
                this.visible = true
                this.title = '审批'
                this.consent['flag'] = '1'
            } else {
                this.$message.warning("支付金额与公司支付金额不相等,请重新填写!!!")
            }
        },
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
                    inputPattern: /^\S/,
                    cancelButtonClass: "btn-custom-cancel",
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
        returnBtn () {
            this.rejectShow = true
        },
        rejectCancel(){
            this.rejectShow = false
        },
        rejectOk () {
            let tem = this.formData
            tem.companyPayList = this.$refs.accountant.getData()
            if(tem.companyPayList.length > 0){
                let temD = 0
                tem.companyPayList.forEach(item => {
                    temD = Number(item.money ? item.money:'0') + Number(temD)
                })
                tem.companyPayMoney = temD
            }
            this.$refs['form'].validate((valid) => {
                tem.flag = '2'
                tem.completeTask = {
                    "taskId":this.taskId,
                    activityId: this.form.rejectVal,
                    msg: this.form.paymessage
                }
                projectPaymentOperation(tem).then(res => {
                    this.$message.success("驳回成功")
                    this.closeTab()
                })
            })
        },
        invalidBtn () {
            let tem = this.formData
            tem.companyPayList = this.$refs.accountant.getData()
            this.$prompt('此操作将作废该条数据，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^\S/,
                inputErrorMessage: '请输入作废理由'
            }).then(({ value }) => {
                tem.flag = '3'
                tem.completeTask = {
                    "taskId":this.taskId,
                    "msg":value
                }
                projectPaymentOperation(tem).then(res => {
                    this.$message.success("作废成功")
                    this.closeTab()
                })
            })
        }
    },
    created () {
        getProjectAllOptions().then(option => {
            this.costType = option.costType
        })
    },
    mounted() {
        this.isShowDetails = true
        this.fromProcess = true
        this.pushData = JSON.parse(this.$route.params.detailData)
        this.processGetInfo()
        switch(this.pushData.pathName){
            case "backlog":
                this.backlog = true
                this.isSendBack = false
                break
            case "sendBack":
                this.isSendBack = true
                this.backlog = false
                break
            default: 
                this.backlog = false
                this.isSendBack = false
                break
        }
    }
}
</script>
<style lang="scss">
.drawer-btn{
    text-align: center;
}
.open-tender{
    .el-divider__text.is-center{
        left: 80px;
        padding-left: 25px;
    }
    .el-divider__text.is-center:before{
        content: '';
        width: 3px;
        height: 17px;
        background: #346fff;
        position: absolute;
        left: 13px;
        top: 2px;
    }
    .cash-return{
        .el-card__body{
            .project-base-info{
                .el-form-item{
                    margin-bottom: 15px;
                }
            }
            .retuern-content{
                padding: 20px;
                background-color: #F4F9FF;
                position: relative;
                .el-tabs__item{
                    padding: 0px 30px;
                    height: 50px;
                    line-height: 50px;
                    font-weight: bold;
                    background-color: #FFF;
                }
                .el-tabs__item.is-active{
                    background-color: #409EFF;
                    color: #FFF;
                }
                .right-balance{
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    p{
                        text-align: right;
                        line-height: 25px;
                        font-size: 14px;
                        color: #777;
                        font-weight: bold;
                    }
                }
            }
        }
        .remark{
            padding: 0px 20px;
        }
    }
}
</style>