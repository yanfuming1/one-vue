<template>
    <d2-container class="loanDetail">
        <el-card class="box-card closeHeader">
        <div slot="header"><el-button type="text" @click="cancelBtn"><i class="el-icon-close"></i></el-button></div>
        <qqt-flow-tabs v-if="tabShow" :procInstId="procInstId" :isProcessInstance='isProcessInstance' :pdfId="pdfId">
          <template slot="content">
            <fm-generate-form
                :data="jsonData"
                :transform="transform"
                :value="values"
                :remote="remote"
                ref="generateForm">
                <template slot="bankInfo">
                    <collect-bank :getSize="formSize" ref="collectBank" :selectData="collectUnitAccount" :data="bankData" :isShowDetails="transform.isShowDetails"></collect-bank>
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
            <accountant :isShowDetails="isShowDetails" :dataInfo="accDataInfo" ref="accountant"></accountant>
            <div class="up-load-div">
                <el-divider content-position="left">附件</el-divider>
                <up-load :isShowUpload="!transform.isShowDetails" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList" ref="upload"/>
            </div>
            <bottom-information :values="values" :fieldTitle="'申请'" :timeTitle="'申请'"  :isShowAccessory="false" :transform="transform" ref="bottomInformation" />
            <el-row>
                <el-col :span="24" style="text-align:center" class="d2-mt-20">
                    <qqt-voucher ref="voucher"  :voucherShow="voucherShow" @dialogComfirm="dialogComfirm" @dialogCancel="voucherShow=false" :data="values" ></qqt-voucher>
                    <el-button size="small" type="primary"  @click="consentFun">同意</el-button>
                    <el-button size="small" type="warning" v-if="btnList.indexOf('1') != -1" @click="turnToFun">转办</el-button>
                    <el-button size="small" type="success" v-if="btnList.indexOf('2') != -1" plain @click="returnBtn">驳回</el-button>
                    <el-button size="small" type="info" v-if="btnList.indexOf('3') != -1" @click="invalidBtn">作废</el-button>
                    <el-button size="small" type="primary" plain @click="cancelBtn">取消</el-button>
                </el-col>
            </el-row>
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
      <user-modules :showDialog="isShow" :userIds="user" :department="department" @clearUserPage="clearUserPage" @closeFun="isShow = false"></user-modules>
      <qqt-consent :msg="msg" :dialogVisible="visible" :title="title" :taskId="taskId || ''" :type="consent['flag']" :isTurnManage="isTurnManage" :isReject="isReject" @close="consentBorrowingApply" />
      </el-card>
    </d2-container>
</template>
<script>
import qqtTable from '../../../../../components/qqt-subassembly/qqt-table/qqt-table'
import { qqtFlowDiagram, qqtFlowTabs, qqtConsent,qqtVoucher,upload} from '../../../../../components/qqt-subassembly'
import { formGetJson } from '../../../../../api/system/fromManagement/index'
import userModules from '../../../../systemManagement/processDefinition/processModules/userModules'
import { getDetails,findReverseRoute,careOf} from '../../../../../api/approval/common'
import { getMarginPaymentlById, marginPaymentOperation, getByAccountTypeListAll, getProjectAllOptions} from '../../../../../api/jointProject/index'
import { PORJECT_INFO, PROJECT_GETINFOID } from '../../../../../enum/PROJECT'
import { queryDicById } from '../../../../../api/system/dic/dic'
import collectBank from '../../../../projectManagement/jontProjectDetail/components/collectBank'
import accountant from './components/accountant'
import util from '@/libs/util.js'
import { mapActions } from 'vuex'
import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
let that = ''
export default {
    components:{
        qqtTable,
        userModules,
        qqtFlowDiagram,
        qqtFlowTabs,
        accountant,
        qqtConsent,
        collectBank,
        qqtVoucher,
        'up-load': upload,
        'bottom-information': bottomInformation
    },
    data() {
        let that = this;
        return {
            voucherShow: false,
            showRate: false,
            jsonData: {},
            fieldTitle: '申请',
            tabShow: true,
            procInstId: '',
            pdfId: '',
            transform: {
               isShowDetails:true
            },
            collectUnitAccount:[],
            isShowDetails: false,
            values: {},
            remoteOption: {},
            remote: {},
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
            taskId: '',
            isShow: false,
            user: [],
            department: [],
            queryData: {},
            accDataInfo: [],
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
            bankData: {},
            formSize: 'medium',
            msg: '',
            fileList: [],
            upLoadFileDefaultList: [],
        }
    },
    methods: {
        ...mapActions('d2admin/page', [
            'close',
        ]),
        dialogComfirm () {
            this.$refs.voucher.comfirmData().then(res=> {
                this.voucherShow = false;
                this.visible = true;
                this.title = '审批'
                this.consent['flag'] = '1'
            })
        },
        getJson(){
            formGetJson({code: PORJECT_INFO.CASHPAYMENT}).then(res => {
                this.jsonData = JSON.parse(res)
            })
        },
        rejectCancel(){
            this.rejectShow = false;
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
        rejectOk(){
            this.$refs['form'].validate((valid) => {
                let tem = this.values
                tem.flag = '2'
                tem.completeTask = {
                    "taskId":this.taskId,
                    activityId: this.form.rejectVal,
                    msg: this.form.paymessage
                }
                tem.companyList = this.$refs.accountant.getData()
                tem.section = util.jointData(tem.section, ',')
                marginPaymentOperation(tem).then(res => {
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
                if(util.isArray(res.section)){
                    res.section = util.jointData(res.section, ',')
                }
                res['completeTask'] = item
                res.companyList = this.$refs.accountant.getData()
                res.flag = '1'
                res.procInstId = this.procInstId
                marginPaymentOperation(res).then(res => {
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
                    "taskId":this.taskId,
                    "msg":value
                }
                tem.companyList = this.$refs.accountant.getData()
                if(util.isArray(tem.section)){
                    tem.section = util.jointData(tem.section, ',')
                }
                marginPaymentOperation(tem).then(res => {
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
                    this.msg = res.msg
                })
                findReverseRoute(pushData.procDefId + '/' +pushData.activityId).then(res=>{
                    this.returnList = res;
                })
            }
            getMarginPaymentlById({id:pushData.processVariables.relevancyId}).then(res => {
                // 是否计息
                this.showRate = res.isRate === '1' ? true : false
                // res.marginReturn.matEndowment = res.marginReturn.matEndowment + ''
                res.matEndowment = res.matEndowment + ''
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
                if(util.isString(res.section)){
                    res.section = util.splitData(res.section, ',')
                }
                this.bankData.name = res.collectUnitAccountId
                this.bankData.openingBank = res.openingBank
                this.bankData.account = res.accountNumber
                this.values = Object.assign({}, this.values, res)
                this.accDataInfo = res.companyList
                this.isShowDetails = false
                this.fileList = res.fileList
                this.setFile(res.fileList)
            }).finally(() => {
                this.getJson()
            })
        },
        getRemoteData(){
            getByAccountTypeListAll({accountType: 3}).then(res => {
                this.collectUnitAccount = res
            })
        },
        setRemote(option){
            this.remote = {
                getSection(resolve) {resolve(option.section)},
                getMarginType(resolve){resolve(option.cashDeposit)},
                getCollectUnit(resolve){resolve(that.collectUnitAccount)},
                getIsRate(resolve){
                    let options = [
                        {value: '1',label: '是'},
                        {value: '0',label: '否'}
                    ]
                    resolve(options)
                }
            }
        }
    },
    created(){
        this.getRemoteData ()
    },
    async mounted() {
        getProjectAllOptions().then(options => {
            this.remoteOption = options
            this.setRemote(options)
        }).finally(() => {
            that = this
            this.getProcInstData ()
            if (!this.$route.params.detailData) {
                let tagName = this.$route.path;
                this.close ({ tagName })
                this.$router.go(-1);
                return
            }
        })
    }
}
</script>
<style lang="scss">
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