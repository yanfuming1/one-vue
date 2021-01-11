<template>
    <d2-container class="loanDetail">
        <el-card class="box-card closeHeader">
        <div slot="header"><el-button type="text" @click="cancelBtn"><i class="el-icon-close"></i></el-button></div>
        <qqt-flow-tabs v-if="tabShow" :procInstId="procInstId" :isProcessInstance='isProcessInstance' :pdfId="pdfId">
          <template slot="content">
            <fm-generate-form :data="jsonData" :transform="transform" :value="values" :remote="remote" ref="generateForm">
                <template slot="addLine">
                    <div class="loanDetail-tabs">
                        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                            <el-tab-pane :label="label1" name="first">
                                <addline1 :isShowDetails='transform.isShowDetails' :showAddName="true" :costType="costType" :title="addTitle" @change="addLineChange1" :showReject='showReject' :isProcess='isProcess'  :dataInfo='addLineData1' ref="addline1"></addline1>
                            </el-tab-pane>
                            <el-tab-pane :label="label2" name="second">
                                <pay-add-line :isShowDetails="transform.isShowDetails" @change="addLineChange3" ref="payAddLine" :dataInfo='addLineData'></pay-add-line>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                    <!-- <div class="totalAmount-form">
                        <el-form ref="form" class="add-form" :model="form" label-width="100px">
                            <el-row>
                                <el-col :span="8">
                                    <el-form-item label-width="100px" label="合计:">
                                        <qqt-input size="medium" v-model="form.totalAmount" :isShowElement="false" :isMoneyType="true" :btnTitle="'元'"></qqt-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label-width="100px" label="大写:">
                                        <el-input v-model="form.bigWriteCharge" size="medium" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div> -->
                </template>
            </fm-generate-form>
            <accountant :isShowDetails="isShowDetails" :dataInfo="accDataInfo" ref="accountant"></accountant>
            <div class="up-load-div">
                <el-divider content-position="left">附件</el-divider>
                <up-load :isShowUpload="!transform.isShowDetails" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList" ref="upload"/>
            </div>
            <bottomInformation :values="values" :fieldTitle="'申请'" :timeTitle="'申请'" :isGrid="false" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
            <el-row>
            <el-col :span="24" style="text-align:center" class="d2-mt-20">
                <!-- <qqt-voucher ref="voucher" v-if="voucherShow" :voucherShow="voucherShow" @dialogComfirm="dialogComfirm" @dialogCancel="voucherShow=false" :data="cloneData" ></qqt-voucher> -->
                <el-button size="small" type="primary"  @click="flag = '1', consentFun()">同意</el-button>
                <el-button size="small" type="warning" v-if="btnList.indexOf('1') != -1" @click="flag = '0', turnToFun()">转办</el-button>
                <el-button size="small" type="success" v-if="btnList.indexOf('2') != -1" plain @click="flag = '2', returnBtn()">驳回</el-button>
                <el-button size="small" type="info" v-if="btnList.indexOf('3') != -1" @click="flag = '3', invalidBtn()">作废</el-button>
                <el-button size="small" type="primary" plain @click="cancelBtn">取消</el-button>
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
            <el-input type="textarea" :rows="2" placeholder="请输入驳回理由" v-model="form.paymessage"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button type="primary" @click="rejectOk">确 定</el-button>
          <el-button @click="rejectCancel">取 消</el-button>
        </span>
      </el-dialog>
      <user-modules :showDialog="isShow" :userIds="user" :department="department" @clearUserPage="clearUserPage" @closeFun="isShow = false"></user-modules>
      <qqt-consent :dialogVisible="visible" :title="title" :taskId="taskId || ''" :type="consent['flag']" :isTurnManage="isTurnManage" :isReject="isReject" @close="consentBorrowingApply" />
    </el-card>
    </d2-container>
</template>
<script>
import accountant from '../projectCashRequest/components/accountant'
import { queryDicById } from '../../../../../api/system/dic/dic'
import { qqtFlowDiagram,qqtFlowTabs,qqtConsent,qqtLookVoucher,qqtVoucher, upload, qqtInput} from '../../../../../components/qqt-subassembly'
import { formGetJson } from '../../../../../api/system/fromManagement/index'
import { getDetails,findReverseRoute,careOf} from '../../../../../api/approval/common'
import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
import userModules from '../../../../systemManagement/processDefinition/processModules/userModules'
import { PORJECT_INFO } from '../../../../../enum/PROJECT'
import { agentBusinessQueryById,agentBusinessOperation } from '../../../../../api/jointProject/agentBusinessManagement/index'
import payAddLine from '../../../../projectManagement/jontProjectDetail/agentBusinessManagement/components/payAddLine'
import addline1 from '../../../../projectManagement/jontProjectDetail/projectPayment/components/addlines/addline1'
import { getByAccountTypeListAll, getProjectAllOptions} from '../../../../../api/jointProject/index'
import { mapActions } from 'vuex'
import util from '../../../../../libs/util'
export default {
    components:{
        accountant,
        qqtFlowDiagram,
        qqtFlowTabs,
        userModules,
        qqtConsent,
        payAddLine,
        qqtLookVoucher,
        qqtVoucher,
        bottomInformation,
        'up-load': upload,
        'qqt-input': qqtInput,
        addline1
    },
    data() {
        let that = this
        return {
            voucherShow:false,
            cloneData: {},
            jsonData: {},
            tabShow: true,
            procInstId: '',
            pdfId: '',
            natureAccount: [],
            instrumentType: [],
            accountList: [],
            transform: {
               isShowDetails:true
            },
            isShowDetails: false,
            values: {},
            remote: {
                accountType(resolve){
                    let options = [
                        {
                            value: '1',
                            label: '个人账户',
                        },{
                            value: '2',
                            label: '公司账户',
                        },{
                            value: '3',
                            label: '社会团体',
                        },{
                            value: '4',
                            label: '公共事业',
                        },{
                            value: '5',
                            label: '其他',
                        },
                    ]
                    resolve(options)
                },
                getAccount(resolve){
                    resolve(that.accountList)
                },
                getNatureAccount(resolve) {
                    resolve(that.natureAccount)
                },
                getInstrumentType(resolve) {
                    resolve(that.instrumentType)
                }
            },
            btnList: '',
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
            returnList: [],
            rejectShow: false,
            isProcessInstance: true,
            isShow: false,
            user: [],
            department: [],
            taskId: '',
            accDataInfo: [],
            // 新组件
            isTurnManage: false,
            consent: {},
            visible: false,
            isReject: false,
            title: '',
            addLineData: {
                tableData: [{}],
            },
            fileList: [],
            upLoadFileDefaultList: [],
            addLineData1: [{canDel: true, name: "", money: ""}],
            activeName: 'first',
            label1: '本次应扣: 0元',
            label2: '本次支付: 0元',
            addTitle: {
                line1: '应扣费用名称',
                line2: '应扣金额',
                line3: '扣款说明'
            },
            form: {
                totalAmount: '',
                bigWriteCharge: '',
            },
            formData: {
                deductMoney: '',
                payMoney: ''
            },
            costType: [],
            showReject: false,
            isProcess: false,
            flag: ''
        }
    },
    methods: {
        ...mapActions('d2admin/page', [
            'close',
        ]),
        getJson () {
            formGetJson({code: PORJECT_INFO.NEWAGENT}).then(res => {
                this.jsonData = JSON.parse(res)
            })
        },
        rejectCancel () {
            this.rejectShow = false
        },
        rejectOk () {
            this.$refs['form'].validate((valid) => {
                let tem = this.values
                tem.flag = '2'
                tem.completeTask = {
                    taskId: this.taskId,
                    activityId: this.form.rejectVal,
                    type: '2',
                    msg: this.form.paymessage
                }
                tem.companyPayList = this.$refs.accountant.getData()
                agentBusinessOperation(tem).then(res => {
                    this.$message.success("驳回成功")
                    this.cancelBtn()
                })
            })
        },
        consentBorrowingApply(item = '', boolean = false){
            this.visible = this.isTurnManage = this.isReject = false
            if (boolean) {
                this.cancelBtn ()
                return
            }
            if (item) {
                let res = this.values
                res.companyPayList = this.$refs.accountant.getData()
                res['completeTask'] = item
                res.flag= this.flag
                res.procInstId = this.procInstId
                res.deductList = this.$refs.addline1.getData()
                res.totalMoney = this.form.totalAmount
                res.bigWriteCharge = this.form.bigWriteCharge
                agentBusinessOperation(res).then(res => {
                    if (res.code === 200) {
                        this.$message.success ("同意成功")
                        this.cancelBtn()
                    }
                })
            }
        },
        consentFun(){
            let accData = this.$refs.accountant.getData()
            let canAgree = true
            if(accData.length > 0){
                accData.forEach(item => {
                    if (item.name === "" || item.openingBank === '' 
                    || item.account === '' || item.money === '') {
                        canAgree = false
                    }
                })
            }
            if (canAgree) {
                let acc = 0
                this.$refs.accountant.getData().forEach(item => {
                    acc += Number(item.money)
                })
                if(Number(this.formData.payMoney) !== acc){
                    this.$message.warning('公司支付金额不等于本次支付金额!!')
                    return false
                }
                // this.voucherShow = true;
                this.visible = true
                this.title = '审批'
                this.consent['flag'] = '1'
            } else {
                this.$message.warning("公司支付信息未填写完整!!!")
            }
        },
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
                const h = this.$createElement;
                this.$prompt('请输入转办理由', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
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
                            this.cancelBtn()
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });       
                });
            } else {
                this.$message.error('请选择要转办的部门或人员')
            }
        },
        returnBtn(){
            this.rejectShow = true;
        },
        invalidBtn(){
            this.$prompt('此操作将作废该条数据，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^\S/,
                inputErrorMessage: '请输入作废理由'
            }).then(({ value }) => {
                let tem = this.values
                tem.flag = '3'
                tem.completeTask = {
                    "taskId": this.taskId,
                    "msg": value,
                    type: '3'
                }
                tem.companyPayList = this.$refs.accountant.getData()
                agentBusinessOperation(tem).then(res => {
                    this.$message.success("作废成功")
                    this.cancelBtn()
                })
            })
        },
        cancelBtn(){
            this.$router.go(-1)
            let tagName = this.$route.path
            this.close ({ tagName })
        },
        upLoadFileCallBack(item) {
            this.fileList = item
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
        getProcInstData () {
            let pushData = JSON.parse(this.$route.params.detailData)
            this.taskId = pushData.taskId
            this.procInstId = pushData.procInstId
            this.pdfId = pushData.procDefId
            this.tabShow = true
            if (pushData.activityId) {
                getDetails(pushData.procDefId + '/' +pushData.activityId).then(res=>{
                    this.btnList = res.operation;
                    this.form.rejectVal = res.sendBackNode;
                })
                findReverseRoute(pushData.procDefId + '/' +pushData.activityId).then(res=>{
                    this.returnList = res;
                })
            }
            agentBusinessQueryById({id:pushData.processVariables.relevancyId}).then(res => {
                this.addLineData['tableData'] = res.abaAddLine
                this.addLineData1 = res.deductList
                res.balance += ''
                this.accDataInfo = util.isArray(res.companyList) ? res.companyList : []
                this.values = res
                this.form.totalAmount = this.values.totalMoney + ''
                this.form.bigWriteCharge = util.convertCurrency (this.form.totalAmount)
                this.addLineChange1(this.addLineData1)
                this.addLineChange3(this.addLineData['tableData'])
                this.cloneData = Object.assign({},res)
                this.fileList = res.fileList
                this.setFile(res.fileList)
            })
        },
        getRemoteData(){
            this.getJson()
        },
/** -----------------------------------------------------------------代收代付添加应扣金额------------------------------------------------------------------- */
        getProjectAllOptionsList () {
            getProjectAllOptions().then(option => {
                this.costType = option.costType
            })
        },

        handleClick(tab) {
            switch(tab.name) {
                case 'first':
                    this.$refs.addline1.doLayout()
                    break
            }
        },

        addLineChange1 (arr, index) {
            this.addAccount(arr, '1', index)
        },

        addLineChange3(arr, index){
            this.addAccount(arr, '3', index)
        },

        addAccount (arr, type, index){
            if(arr && arr.length > 0){
                let account = 0
                arr.forEach(item => {
                    if(!item.isCount || item.isCount === '1' || !this.fromProcess){
                        account += Number(item.money ? item.money : item.paymentAmount ? item.paymentAmount : 0)
                    }
                })
                switch (type){
                    case '1':
                        this.label1 = '本次应扣: ' + util.moneyTransform(account) + '元'
                        this.formData.deductMoney = account
                        break
                    case '3':
                        this.label2 = '本次支付: ' + util.moneyTransform(account) + '元'
                        this.formData.payMoney = account
                        break
                }
                
            } else {
                switch (type){
                    case '1':
                        this.label1 = '本次应扣: ' + 0.00 + '元'
                        this.formData.deductMoney = '0.00'
                        break
                    case '3':
                        this.label2 = '本次支付: ' + 0.00 + '元'
                        this.formData.payMoney = '0.00'
                        break
                }
            }
            this.setBalance(type, index)
        },

        setBalance(type, index){

            let practicalBalanceTem = parseFloat(util.addNum (this.formData.payMoney, this.formData.deductMoney)).toFixed(2)
            if(practicalBalanceTem < 0 && index == undefined){ 
                this.$message.warning("支付后剩余金额不能为负!!!")
                this.resetRelateTable (type, index)
            } else if (Number (practicalBalanceTem) > Number (this.values.balance) && index == undefined) {
                this.$message.warning("支付不能大于项目可用金额!!!")
                this.resetRelateTable (type, index)
            } else {
                this.form.totalAmount = practicalBalanceTem
                this.form.bigWriteCharge = util.convertCurrency(practicalBalanceTem)
            }
        },

        resetRelateTable (type, index) {
            let temData = []
            switch(type){
                case '1':
                    temData = this.$refs.addline1.getData()
                    temData[index].money = '0'
                    this.addLineData1 = temData
                    this.addLineChange1(temData, index)
                    break
                case '3' :
                    temData = this.$refs.payAddLine.getData()
                    temData.tableData[index].paymentAmount = '0'
                    this.addLineData = temData
                    this.addLineChange3(temData.tableData, index)
                    break
                default:
                    break
            }
            this.form.totalAmount = '0',
            this.form.bigWriteCharge = util.convertCurrency('0')
        }

    },
    created () {
        this.getProjectAllOptionsList ()
        this.getProcInstData ()
        this.getRemoteData ()
    },
    mounted () {
        if (!this.$route.params.detailData) {
            let tagName = this.$route.path;
            this.close ({ tagName })
            this.$router.go(-1);
            return
        }
    }
}
</script>
<style lang="scss">
.loanDetail {
    .drawer-btn{
        text-align: center;
    }
    .loanDetail-tabs {
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
    .totalAmount-form {
        padding-top: 20px;
    }
}
</style>