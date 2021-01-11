<template>
    <d2-container class="address-book cash-return-kj">
        <qqt-flow-tabs v-if="tabShow" :procInstId="procInstId" :isProcessInstance='isProcessInstance' :pdfId="pdfId">
            <template slot="content">
                <div class="cash-return">
                <el-form ref="formData" :model="formData" :rules="rules" label-width="200px">
                    <el-divider>项目基本信息</el-divider>
                    <div class="project-base-info">
                        <el-row>
                            <el-col :span="16"><el-form-item label="项目名称:" required><p>{{ formData.projectName }}</p></el-form-item></el-col>
                            <el-col :span="8"><el-form-item label="项目编码:" required><p>{{ formData.itemNumber }}</p></el-form-item></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8"><el-form-item label="标段:" required><p>{{ formData.section }}</p></el-form-item></el-col>
                            <el-col :span="8"><el-form-item label="保证金类型:" required><p>{{ formData.marginType }}</p></el-form-item></el-col>
                            <el-col :span="8"><el-form-item label="保证金退还编码:" required><p>{{ formData.marginCode }}</p></el-form-item></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8"><el-form-item label="联营人:"><p>{{ formData.associatedPerson }}</p></el-form-item></el-col>
                            <el-col :span="8"><el-form-item label="联系电话:"><p>{{ formData.phone }}</p></el-form-item></el-col>
                        </el-row>
                    </div>
                    <div class="retuern-content">
                        <el-tabs v-model="activeName" type="card">
                            <el-tab-pane :label="label1" name="first">
                                <div class="label1-content">
                                    <el-row>
                                        <el-col :span="8"><el-form-item label="退还单位户名:"><p>{{ bankData.retreatUnitAccount }}</p></el-form-item></el-col>
                                        <el-col :span="8"><el-form-item label="开户行:"><p>{{ bankData.openingBank }}</p></el-form-item></el-col>
                                        <el-col :span="8"><el-form-item label="账号:"><p>{{ bankData.accountNumber }}</p></el-form-item></el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="8"><el-form-item label="退还金额:"><p>{{ bankData.gatheringamount }}</p></el-form-item></el-col>
                                        <el-col :span="8"><el-form-item label="退还时间:"><p>{{ bankData.createTime }}</p></el-form-item></el-col>
                                    </el-row>
                                    <bottom-information :values="firmlyBelieve" :fieldTitle="fieldTitleF" :timeTitle="timeTitleF" :transform="transform" :isShowAccessory="false"  ref="firmlyBelieve" />
                                </div> 
                            </el-tab-pane>
                            <el-tab-pane :label="label2" name="second">
                                <div class="label2-content">
                                    <el-row>
                                        <el-col :span="8"><el-form-item label="垫付金额:"><p>{{ formData.matEndowment }}</p></el-form-item></el-col>
                                        <el-col :span="8"><el-form-item label="大写:"><p>{{ formData.amountInWords }}</p></el-form-item></el-col>
                                        <el-col :span="8"><el-form-item label="是否计息:">
                                            <el-radio disabled v-model="formData.isRate" label="1">是</el-radio>
                                            <el-radio disabled v-model="formData.isRate" label="0">否</el-radio>
                                        </el-form-item></el-col>
                                    </el-row>
                                    <el-row v-if="showAccrual">
                                        <el-col :span="8"><el-form-item label="计息方式:"><p>{{ formData.interestAccrualMannerName }}</p></el-form-item></el-col>
                                        <el-col :span="8"><el-form-item label="利率:"><p>{{ formData.interestRate }} %</p></el-form-item></el-col>
                                        <el-col :span="8"><el-form-item label="起息日期:"><p>{{ formData.dateValue }}</p></el-form-item></el-col>
                                    </el-row>
                                    <el-row v-if="showAccrual">
                                        <el-col :span="8"><el-form-item label="结息日期:">
                                            <el-date-picker v-model="formData.interestSettlementDate" v-if="!isShowDetails" value-format="yyyy-MM-dd" type="date"></el-date-picker>
                                            <p v-if="isShowDetails">{{ formData.interestSettlementDate }}</p>
                                        </el-form-item></el-col>
                                        <el-col :span="8"><el-form-item label="共计利息:">
                                            <el-input v-model="formData.interest" v-if="!isShowDetails"><template slot="append">元</template></el-input>
                                            <p v-if="isShowDetails">{{ formData.interest }}</p>
                                        </el-form-item></el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="6">
                                            <el-form-item label="经办人:">
                                                <el-input size="medium" disabled v-model="advancePayment.createName"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item label="工作单位:">
                                                <el-input size="medium" disabled v-model="advancePayment.companyName"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item label="工作部门:">
                                                <el-input size="medium" disabled v-model="advancePayment.departmentName"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item label="登记时间:">
                                                <el-input size="medium" disabled v-model="advancePayment.createTime"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane :label="label3" name="third">
                                <should-pay :dataInfo="dataInfo" :isShowDetails="isShowDetails" ref="shouldPay"></should-pay>
                                <!-- <bottom-information :values="deduct" :fieldTitle="deductD" :timeTitle="timeTitleD" :transform="transform" :isShowAccessory="false"  ref="surrender" /> -->
                            </el-tab-pane>
                            <el-tab-pane :label="label4" name="fourth">
                                <el-row>
                                    <el-col :span="8">
                                        <el-form-item label="退还到联营人资金池总金额:" :rules="newRules.surrenderPool" prop="surrenderPool">
                                            <qqt-input :btnTitle="'元'" v-model="formData.surrenderPool" :value='formData.surrenderPool' :isShowElement="!isShowDetails" :isMoneyType="isMoneyType" @blur="changeMoney"></qqt-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8"><el-form-item label="退还联营人账户金额:" :rules="newRules.surrenderValue" prop="surrenderValue">
                                        <qqt-input :btnTitle="'元'" v-model="formData.surrenderValue"  :value='formData.surrenderValue' :isShowElement="surValueShow" :isMoneyType="isMoneyType"></qqt-input>
                                    </el-form-item></el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="8"><el-form-item label="联营人收款户名:" :rules="newRules.retreatUnitAccount" prop="retreatUnitAccount">
                                        <el-select v-model="formData.retreatUnitAccount" v-if="!isShowDetails" @change="selectAccount">
                                            <el-option v-for="(item,index) in collectUnitAccount" :key="index" :label="item.name" :value="item.name"></el-option>
                                        </el-select>
                                        <p v-if="isShowDetails">{{ formData.retreatUnitAccount }}</p>
                                    </el-form-item></el-col>
                                    <el-col :span="8"><el-form-item label="开户行:" :rules="newRules.openingBank" prop="openingBank">
                                        <el-input v-model="formData.openingBank" v-if="!isShowDetails"></el-input>
                                        <p v-if="isShowDetails">{{ formData.openingBank }}</p>
                                    </el-form-item></el-col>
                                    <el-col :span="8"><el-form-item label="账号:" :rules="newRules.accountNumber" prop="accountNumber">
                                        <el-input v-model="formData.accountNumber" v-if="!isShowDetails"></el-input>
                                        <p v-if="isShowDetails">{{ formData.accountNumber }}</p>
                                    </el-form-item></el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="8"><el-form-item label="退还时间:" :rules="newRules.createTime" prop="createTime">
                                        <el-date-picker v-model="formData.createTime" value-format="yyyy-MM-dd" v-if="!isShowDetails" type="date"></el-date-picker>
                                        <p v-if="isShowDetails">{{ formData.createTime }}</p>
                                    </el-form-item></el-col>
                                    <el-col :span="16"><el-form-item label="附言:">
                                        <el-input v-model="formData.postscript" v-if="!isShowDetails" type="textarea"></el-input>
                                        <p v-if="isShowDetails">{{ formData.postscript }}</p>
                                    </el-form-item></el-col>
                                </el-row>
                                <bottom-information :values="surrender" :fieldTitle="surrenderS" :timeTitle="timeTitleS" :transform="transform" :isShowAccessory="false"  ref="surrender" />
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                    <accountant :isShowDetails="accIsShowDetails" :dataInfo="accDataInfo" ref="accountant"></accountant>
                    <div class="up-load-div">
                        <el-divider content-position="left">附件</el-divider>
                        <up-load :isShowUpload="!isShowDetails" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList" ref="upload"/>
                    </div>
                    <div>
                        <el-divider>备注</el-divider>
                        <el-row class="remark">
                            <el-col :span="24"><el-form-item label="备注:">
                                <el-input v-model="formData.remark" v-if="!isShowDetails" type="textarea"></el-input>
                                <p v-if="isShowDetails">{{ formData.remark }}</p>
                            </el-form-item></el-col>
                        </el-row>
                    </div>
                </el-form>
                </div>
                <el-row>
                  <el-col :span="24" style="text-align:center" class="d2-mt-20">
                      <el-button size="small" type="primary"  @click="consentFun">同意</el-button>
                      <el-button size="small" type="warning" v-if="btnList.indexOf('1') != -1" @click="turnToFun">转办</el-button>
                      <el-button size="small" type="success" v-if="btnList.indexOf('2') != -1" plain @click="returnBtn">驳回</el-button>
                      <el-button size="small" type="info" v-if="btnList.indexOf('3') != -1" @click="invalidBtn">作废</el-button>
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
            <el-input type="textarea" :rows="2" placeholder="请输入驳回理由" v-model="form.paymessage"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="rejectCancel">取 消</el-button>
          <el-button type="primary" @click="rejectOk">确 定</el-button>
        </span>
      </el-dialog>
      <user-modules :showDialog="isShow" :userIds="user" :department="department" @clearUserPage="clearUserPage" @closeFun="isShow = false"></user-modules>
    </d2-container>
</template>
<script>
import qqtTable from '../../../../../components/qqt-subassembly/qqt-table/qqt-table'
import { qqtFlowDiagram,qqtFlowTabs,qqtInput,upload} from '../../../../../components/qqt-subassembly'
import userModules from '../../../../systemManagement/processDefinition/processModules/userModules'
import accountant from './components/accountant'
import util from '../../../../../libs/util'
import { getRefundById, marginReturnOperation,} from '../../../../../api/jointProject/index'
import { getDetails,findReverseRoute,careOf} from '../../../../../api/approval/common'
import shouldPay from './components/shouldPay'
import { mapActions } from 'vuex'
import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
export default {
    name: 'cashReturn',
    components: {
        qqtTable,
        userModules,
        qqtFlowDiagram,
        qqtFlowTabs,
        accountant,
        shouldPay,
        qqtInput,
        'up-load': upload,
        'bottom-information': bottomInformation
    },
    data () {
        return {
            formData: {},
            fieldTitleF: '认定',
            timeTitleF: '认定',
            deductD: '登记',
            timeTitleD: "登记",
            surrenderS: '经办',
            timeTitleS: '经办',
            showAccrual: true,
            marginReturn: {},
            firmlyBelieve: {},
            deduct: {},
            surrender: {},
            advancePayment: {
                companyName: '',
                departmentName: '',
                createName: '', 
                createTime: ''
            },
            transform: {
                isShowDetails: false
            },
            bankData: {
                retreatUnitAccount: '',
                openingBank: '',
                accountNumber: '',
                gatheringamount: '',
                createTime: ''
            },
            activeName: 'first',
            label1: '收取单位退还认定',
            label2: '公司垫付资金: 0元',
            label3: '扣除金额: 0元',
            label4: '退还联营人金额: 0元',
            dataInfo: [],
            isShowDetails: true,
            collectUnitAccount: [],
            dialogVisible: false,
            rules: {
                direction: [{ required: true, message: '请选择退还方向', trigger: 'blur' }],
                retreatUnitAccount: [{ required: true, message: '请选择单位户名', trigger: 'blur' }],
                openingBank: [{ required: true, message: '请填写开户行', trigger: 'blur' }],
                accountNumber: [{ required: true, message: '请填写账号', trigger: 'blur' }],
                surrenderValue: [{ required: true, message: '请填写金额', trigger: 'blur' }],
                createTime: [{ required: true, message: '请选择退还时间', trigger: 'blur' }],
            },
            newRules: {
                retreatUnitAccount : [{ required: true, message: '请输入退还单位户名', trigger: ['blur','change'] }],
                openingBank  : [{ required: true, message: '请输入开户行', trigger: ['blur','change'] }],
                accountNumber  : [{ required: true, message: '请输入账号', trigger: ['blur','change'] }],
                surrenderPool : [{ required: true, message: '请输入账号', trigger: ['blur','change'] }],
                surrenderValue : [{ required: true, message: '请输入账号', trigger: ['blur','change'] }],
                createTime  : [{ required: true, message: '请输入退还时间', trigger: ['blur','change'] }],
            },
            label3Money: 0,
            accDataInfo: [],
            form: {
                rejectVal: '',
                paymessage: ''
            },
            procInstId: '',
            isProcessInstance: '',
            pdfId: '',
            returnList: [],
            rejectShow: false,
            isShow: false,
            user: [],
            department: [],
            tabShow: false,
            btnList: '',
            accIsShowDetails: false,
            isMoneyType: true,
            surrenderValueTem: 0,
            surValueShow: false,
            fileList: [],
            upLoadFileDefaultList: [],
        }
    },
    methods: {
        ...mapActions('d2admin/page', [
            'close',
            'open'
        ]),
        changeMoney(value){
            this.formData.surrenderPool = value
        },
        calculateMoney () {
            this.surrenderValueTem = Number(this.bankData.gatheringamount) - Number(this.label3Money) - Number(this.formData.matEndowment)
            this.label4= '退还联营人金额: '+ util.moneyTransform(this.surrenderValueTem) + '元'
        },
        closeTab () {
            this.$router.go(-1)
            let tagName = this.$route.path
            this.close ({ tagName })
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
        consentFun(){
            this.$prompt('请输入审批意见', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^\S/,
                inputType: 'textarea',
                inputErrorMessage: '请输入审批意见'
            }).then(({ value }) => {
                let res = this.formData
                res.completeTask =  {
                    "taskId":this.taskId,
                    msg: value
                }
                res.companyPayList = this.$refs.accountant.getData()
                res.flag = '1'
                res.procInstId = this.procInstId
                marginReturnOperation(res).then(res => {
                    if (res.success) {
                        this.$message.success('同意成功')
                        this.closeTab()
                    }
                })
            }).catch(() => {
                this.$message.info('已取消删除');
            })
        },
        turnToFun(){
            this.isShow = true
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
                let tem = this.formData
                tem.flag = '3'
                tem.completeTask = {
                    "taskId":this.taskId,
                    "msg":value
                }
                tem.companyPayList = this.$refs.accountant.getData()
                marginReturnOperation(tem).then(res => {
                    this.$message.success("作废成功")
                    this.closeTab()
                })
            })
        },
        rejectCancel(){
            this.rejectShow = false;
        },
        rejectOk(){
            this.$refs['form'].validate((valid) => {
                let tem = this.formData
                tem.flag = '2'
                tem.completeTask = {
                    "taskId":this.taskId,
                    activityId: this.form.rejectVal,
                    msg: this.form.paymessage
                }
                tem.companyPayList = this.$refs.accountant.getData()
                marginReturnOperation(tem).then(res => {
                    this.$message.success("驳回成功")
                    this.closeTab()
                })
            })
        },
        //转办穿梭框
        clearUserPage(item){
            if (item.length > 0) {
                this.isShow = !this.isShow
                let data = [];
                for (let i = 0; i < item.length; i++) {
                    let str = item[i].id
                    data.push(str)
                }
                const h = this.$createElement
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
                            this.closeTab()
                        }
                    })
                }).catch(() => {
                    this.$message.info('取消输入');
                });
            } else {
                this.$message.error('请选择要转办的部门或人员')
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
            getRefundById({id:pushData.processVariables.relevancyId}).then(res => {
                this.transform.isShowDetails = true
                let marginReturn = this.formData = res.marginReturn
                switch(this.formData.interestAccrualManner){
                    case '1197335230566318080':
                        this.formData.interestAccrualMannerName = '日息'
                        break
                    case '1197334487260151808':
                        this.formData.interestAccrualMannerName = '月息'
                        break
                    case '1197317410252005376':
                        this.formData.interestAccrualMannerName = '年息'
                        break
                }
                this.showAccrual = res.marginReturn.isRate === '0' ? false : true
                this.advancePayment = res.advancePayment
                this.firmlyBelieve = res.firmlyBelieve
                this.deduct = res.deduct
                this.surrender = res.surrender
                marginReturn.surrenderPool = marginReturn.surrenderPool + '';
                marginReturn.surrenderValue = marginReturn.surrenderValue + '';
                marginReturn.matEndowment = parseFloat(marginReturn.matEndowment).toFixed(2);
                this.dataInfo = marginReturn.withholdList
                this.bankData = res.marginReturn.accountFund
                const { payaccount: retreatUnitAccount ,  gatheringbank: openingBank,  paynum: accountNumber, gatheringamount, createTime } = res.marginReturn.accountFund
                this.bankData = { retreatUnitAccount, openingBank, accountNumber, gatheringamount, createTime }
                this.firmlyBelieve = res.firmlyBelieve, this.deduct = res.deduct, this.surrender = res.surrender
                this.formData.matEndowment = parseFloat(this.formData.matEndowment).toFixed(2)
                this.label3Data(res.marginReturn.withholdList)
                console.log(res)
                this.label2 = '公司垫付资金: ' + util.moneyTransform(res.marginReturn.matEndowment) + '元'
                if(res.marginReturn.companyPayList){
                    this.accDataInfo = res.marginReturn.companyPayList
                }
                this.accIsShowDetails = true
                this.fileList = this.formData.fileList
                this.setFile(this.formData.fileList)
            })
        },
        label3Data(data) {
            this.label3Money = 0
            if(data){
                data.forEach(item => {
                    this.label3Money += Number(item.money)
                })
                this.label3 = '扣除金额: ' + util.moneyTransform(this.label3Money) +'元'
            }
            this.calculateMoney()
        },
    },
    created() {
        this.getProcInstData ()
    },
    async mounted () {
        if (!this.$route.params.detailData) {
            this.closeTab()
            return
        }
    }
}
</script>
<style lang="scss">
.drawer-btn{
    text-align: center;
}
.cash-return-kj{
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
        .retuern-content{
            padding: 20px;
            background-color: #F4F9FF;
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
            .label1-content{
                cursor: pointer;
                padding: 10px;
                border: 1px solid #56A7FE;
                .el-form-item{
                    margin-bottom: 0px;
                }
            }
            .label2-content{
                .el-form-item{
                    margin-bottom: 0px;
                }
            }
        }
    }
    .remark{
        padding: 0px 20px;
    }

}
</style>
