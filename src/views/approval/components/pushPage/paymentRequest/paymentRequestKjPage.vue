<template>
    <d2-container class="loanDetail">
        <qqt-flow-tabs v-if="tabShow" :procInstId="procInstId" :pdfId="pdfId">
          <template slot="content">
            <el-card :body-style="{ padding: '20px' }">
                <fm-generate-form
                  :data="jsonData"
                  :transform="transform"
                  :value="values"
                  :remote="remote"
                  ref="generateForm">
                  <template slot="relevance">
                    <associated-documents ref="relevance" size="small" :transform="transform" :relevance="values" />
                  </template>
                </fm-generate-form>
                <fm-generate-form
                  :data="payData"
                  :value="payValues"
                  :remote="payRemote"
                  @on-change="clcuChange"
                  ref="payForm">
                    <template slot="clcu">
                      <add-pays-table ref="addPaysTable" :isShowDetails="payRemote.isShowDetails" @selectChange="selectChange" :selectData="paynameArr" :data="payValues.clcu"></add-pays-table>
                    </template>
                </fm-generate-form>
                <el-divider class="divider-title" content-position="left">附件</el-divider>
                <div class="add-customer-content___upload">
                    <label for="male" >
                        <upload id="male" :dataId="values.id" :isShowUpload="!transform.isShowDetails"  ref="upLoad" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList"></upload>
                    </label>
                </div>
                <bottomInformation :values="values" fieldTitle="申请" timeTitle="申请" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
                <el-row>
                  <el-col :span="24" style="text-align:center" class="d2-mt-20">
                      <qqt-voucher ref="voucher"  :voucherShow="voucherShow" @dialogComfirm="dialogComfirm" @dialogCancel="voucherShow=false" :data="queryData" :showComfirm="true"></qqt-voucher>
                      <el-button size="small" type="primary"  @click="consentFun(), title = '审批意见', consent['flag'] = '1'">同意</el-button>
                      <el-button size="small" type="warning" v-if="btnList.indexOf('1') != -1" @click="visible = isTurnManage = true, consent['flag'] = '0',title = '转办意见'">转办</el-button>
                      <el-button size="small" type="success" v-if="btnList.indexOf('2') != -1" plain @click="visible = isReject = true, consent['flag'] = '2', title = '驳回意见'">驳回</el-button>
                      <el-button size="small" type="info" v-if="btnList.indexOf('3') != -1" @click="visible = true, consent['flag'] = '3', title = '作废意见'">作废</el-button>
                      <!-- <el-button size="small" type="primary"  @click="consentFun">同意</el-button>
                      <el-button size="small" type="warning" v-if="btnList.indexOf('1') != -1" @click="turnToFun">转办</el-button>
                      <el-button size="small" type="success" v-if="btnList.indexOf('2') != -1" plain @click="returnBtn">驳回</el-button>
                      <el-button size="small" type="info" v-if="btnList.indexOf('3') != -1" @click="invalidBtn">作废</el-button> -->
                      <el-button size="small" type="primary" plain @click="cancelBtn">取消</el-button>
                  </el-col>
                </el-row>
            </el-card>
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
      <qqt-consent :msg="detailMsg" :dialogVisible="visible" :taskId="$route.params.taskId || ''" :type="consent['flag']" :isTurnManage="isTurnManage" :isReject="isReject" @close="consentBorrowingApply" />
    </d2-container>
</template>

<script>
  import qqtTable from '../../../../../components/qqt-subassembly/qqt-table/qqt-table';
  import { qqtFlowDiagram,qqtFlowTabs,qqtConsent,qqtVoucher, associatedDocuments, upload} from '../../../../../components/qqt-subassembly'
  import { formGetJson } from '../../../../../api/system/fromManagement/index'
  import { getGoadd,getQueryById,goBank,complete,exceptUserAccount} from '../../../../../api/financialManagement/paymentRequest';
  import util from '@/libs/util.js'
  import { getDetails,findReverseRoute,careOf} from '../../../../../api/approval/common';
  import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
  import userModules from '../../../../systemManagement/processDefinition/processModules/userModules'
  import { mapActions } from 'vuex'
  import addPaysTable from '../components/payAddTable';
  export default {
    components: {
        qqtTable,
        qqtFlowDiagram,
        qqtFlowTabs,
        userModules,
        qqtConsent,
        addPaysTable,
        qqtVoucher,
        bottomInformation,
        associatedDocuments,
        upload
    },
    data() {
      let that = this;
      return {
        voucherShow: false,
        consent: {},
        detailMsg:'',
        visible: false,
        isReject: false,
        isTurnManage: false,
        tabShow:false,
        isShow:false,
        procInstId: '',
        rejectShow: false,
        pdfId: '',
        btnList: '',
        payData:{},
        payValues:{
          clcu: [],
        },
        returnList: [],
        paynameData: [],
        paywayData: [],
        paynameArr: [],
        department: [],
        user: [],
        queryData: {},
        payRemote:{
          getPayname(resolve) {
              resolve(that.paynameData);
          },
          getPayway(resolve) {
              resolve(that.paywayData);
          },
        },
        remote: {
            getAccounts(resolve) {
                resolve(that.accountsData);
            },
            getbankAccounts(resolve) {
                resolve(that.bankAccountsData);
            },
            getVouchers(resolve) {
                resolve(that.vouchersData);
            },
        },
        values:{},
        recmoney: 0,
        accountsData: [],
        bankAccountsData: [],
        vouchersData: [],
        jsonData: {},
        transform: {
           isShowDetails:true
        },
        form: {
          rejectVal: '',
          paymessage: ''
        },
        rules: {
          rejectVal: [
            { required: true, message: '请选择驳回节点', trigger: ['change','blur'] }
          ],
          paymessage: [
            { required: true, message: '请选择驳回理由', trigger:  ['change','blur']  }
          ],
        },
        consentData: {},
        upLoadFileDefaultList: [],
        fileList: [],
      }
    },
    methods: {
      ...mapActions('d2admin/page', [
          'close',
      ]),
       // 统一操作
      consentBorrowingApply (item = '', boolean = false) {
          this.visible = this.isTurnManage = this.isReject = false
          if (boolean) {
              this.cancelBtn ()
              return
          }
          if (item) {
              let jsonData = {};
              this.consent['completeTask'] = item;
              let data = JSON.parse(JSON.stringify(this.consentData));
              let companyItem = this.$refs.bottomInformation.getData ()
              this.consent = {
                ...this.consent,
                ...companyItem
              }
              if (this.consent.flag === '1') {
                jsonData = Object.assign(data, this.consent);
              } else {
                jsonData = this.consent;
                jsonData.id = data.id;
              }
              complete (jsonData).then (res => {
                  if (res.code === 200) {
                      this.$message.success (res.message);
                      let tagName = this.$route.path;
                      this.close ({ tagName });
                      this.$router.go(-1);
                  }
              })
          }
      },
      getJson() {
        formGetJson({ code: 'paymentRequestKjPage' }).then(res => {
          this.jsonData = JSON.parse(res)
        })
        formGetJson({ code: 'paymentPayMsg'}).then(res => {
          this.payData = JSON.parse(res)
        })
      },
      upLoadFileCallBack (item) {
          this.fileList = item
      },

      clcuChange (name,value,data) {
        // if (name === 'totalmoney') {
        //   this.payValues.totalmoney = value;
        // }
        if (name === 'clcu') {
          let  total = 0;
          let lastVal = 0;
          for (let i = 0; i < value.length; i++) {
            let bankNewArr = this.queryNameByIdCompany(value[i].line1);
            value[i].line2 = bankNewArr.openingBank;
            value[i].line3 = bankNewArr.account;
            total += Number(value[i].line4);
          }
          this.payValues.totalmoney = total.toString();
          this.payValues.big = util.convertCurrency(this.payValues.totalmoney);
        }
      },
      number(value){
        if (typeof (value) == 'number') {
          return value
        } else {
          if (value.indexOf(',') != -1) {
            return Number(value.replace(/[^0-9._-]/g, ''))
          } else {
            return Number(value)
          }
        }
      },
      dialogComfirm () {
        this.$refs.voucher.comfirmData().then(res=> {
            this.voucherShow = false;
            this.visible = true;
        })
      },
      // 同意
      consentFun () {
          // let item = this.$refs.bottomInformation.getData ()
          this.$refs.addPaysTable.getData().then(addData => {
            if (this.queryData.paymoney -0 !== Number(addData.totalMoney)) {
              this.$message.error('收款人合计金额和公司支付金额不一致，请确认');
              return;
            }
            // this.voucherShow = true;
            for (let i = 0; i < addData.tableData.length; i++) {
              addData.tableData[i].identifier = 'clcu'
            }
            this.consentData = {
              clcu:addData.tableData,
              totalmoney: addData.totalMoney,
              id:this.queryData.id
            };
            // Object.assign(this.consentData, item)
            this.visible = true;
         })
      },
      queryNameByIdCompany (id) {
        let data = {};
        for (let i = 0; i < this.paynameArr.length; i++) {
          if (id === this.paynameArr[i].id) {
            data = this.paynameArr[i];
          }
        }
        return data;
      },
      // 转办
      turnToFun () {
          this.isShow = !this.isShow

      },
      // 取消驳回
      rejectCancel () {
		    this.rejectShow = false;
      },
      // 驳回
      rejectOk () {
         this.$refs['form'].validate((valid) => {
            if (valid) {
                let jsonData = {};
                jsonData.flag = '2';
                jsonData.id = this.queryData.id;
                jsonData.completeTask = {
                  "taskId":this.taskId,
                  activityId: this.form.rejectVal,
                  msg: this.form.paymessage
                };
                complete(jsonData).then((res)=>{
                  if (res.success) {
                    this.$message.success('驳回成功')
                    let tagName = this.$route.path;
                    this.close ({ tagName })
                    this.$router.go(-1);
                  }
                })
            }
        });
      },
      // 驳回
      returnBtn () {
        this.rejectShow = true;

      },
      // 作废
      invalidBtn () {
         this.$prompt('此操作将作废该条数据，是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputType: 'textarea',
            inputPattern: /^\S/,
            inputErrorMessage: '请输入作废理由'
          }).then(({ value }) => {
             let jsonData = {
                flag:'3',
                id:this.queryData.id
              };
              jsonData.completeTask = {
                "taskId":this.taskId,
                "msg":value
              };
              complete(jsonData).then((res)=>{
                if (res.success) {
                  this.$message.success('作废成功')
                  let tagName = this.$route.path;
                  this.close ({ tagName })
                  this.$router.go(-1);
                }
              })
          })
        //   util.confirm('此操作将作废该条数据，是否继续?').then(res => {
        //      if (res) {
        //
        //      }
        //   })
      },
      //转办穿梭框
      clearUserPage (item) {
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
              inputType: 'textarea',
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
                    let tagName = this.$route.path;
                    this.close ({ tagName })
                    this.$router.go(-1);
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
      cancelBtn () {
          this.$router.go(-1);
          let tagName = this.$route.path;
          this.close ({ tagName })
      },
      // change
      selectChange () {
        goBank ().then(res =>{
            this.paynameArr = res.bankAccounts;
        })
      }
    },
    created () {
       getGoadd().then(res=>{
          let accountsData = res.accounts;
          let vouchersData = res.vouchers;
          for (let i = 0; i < accountsData.length; i++) {
              let obj = {
                value: accountsData[i].name,
                label: accountsData[i].name,
              }
              this.accountsData.push(obj)
          }
          exceptUserAccount ().then(res =>{
              this.bankAccountsArr = res;
              for (let i = 0; i < this.bankAccountsArr.length; i++) {
                  let obj = {
                    value: this.bankAccountsArr[i].id,
                    label: this.bankAccountsArr[i].name,
                  }
                  this.bankAccountsData.push(obj)
              }
          })
          // for (let i = 0; i < this.bankAccountsArr.length; i++) {
          //     let obj = {
          //       value: this.bankAccountsArr[i].id,
          //       label: this.bankAccountsArr[i].name,
          //     }
          //     this.bankAccountsData.push(obj)
          // }
          for (let i = 0; i < vouchersData.length; i++) {
              let obj = {
                value: vouchersData[i].name,
                label: vouchersData[i].name,
              }
              this.vouchersData.push(obj)
          }
      }).finally (res => {
        this.getJson();
      })
      // goBank ().then(res =>{
      //   let paynameData = res.bankAccounts;
      //   this.paynameArr = res.bankAccounts;
      //   for (let i = 0; i < paynameData.length; i++) {
      //       let obj = {
      //         value: paynameData[i].id,
      //         label: paynameData[i].name,
      //       }
      //       this.paynameData.push(obj)
      //   }
      //   let paywayData = res.accounts;
      //   for (let i = 0; i < paywayData.length; i++) {
      //       let obj = {
      //         value: paywayData[i].name,
      //         label: paywayData[i].name,
      //       }
      //       this.paywayData.push(obj)
      //   }
      // }).finally(res=>{
      //     this.getJson();
      // })
    },
    mounted () {
      if (!this.$route.params.detailData) {
          let tagName = this.$route.path;
          this.close ({ tagName })
          this.$router.go(-1);
         return
      }
      let pushData = JSON.parse(this.$route.params.detailData);
      this.taskId = pushData.taskId;
      this.procInstId = pushData.procInstId;
      this.pdfId = pushData.procDefId;
      this.tabShow = true;
      // 判断按钮权限
      if (pushData.activityId) {
        getDetails(pushData.procDefId + '/' +pushData.activityId).then(res=>{
          this.btnList = res.operation;
          this.detailMsg = res.msg;
          this.form.rejectVal = res.sendBackNode;
        })
        findReverseRoute(pushData.procDefId + '/' +pushData.activityId).then(res=>{
          this.returnList = res;
        })
      }
      getQueryById({id:pushData.processVariables.relevancyId}).then(res=>{
        this.values = res;
        this.queryData = JSON.parse(JSON.stringify(res));
        for (let i = 0; i < this.paynameArr.length; i++) {
          for (let k = 0; k < res.clcu.length; k++) {
            if (this.paynameArr[i].name === res.clcu[k].line1 && this.paynameArr[i].openingBank === res.clcu[k].line2 && this.paynameArr[i].account === res.clcu[k].line3 ) {
              res.clcu[k].line1 = this.paynameArr[i].id;
            }
          }
        }

        this.payValues.clcu = res.clcu;
        this.payValues.totalmoney = res.totalmoney;
        this.recmoney = this.values.recmoney;
        this.values.recmoney = this.values.recmoney .toFixed(2);
        this.values.receivableAmountBig = util.convertCurrency(this.values.recmoney);
        // this.values.recmoney += ' 元'
        this.values.paymoney = this.values.paymoney .toFixed(2);
        this.values.paymentAmountBig = util.convertCurrency(this.values.paymoney);
        // this.values.paymoney += ' 元'
        this.upLoadFileDefaultList = [];
        for (let i = 0; i < res.fileList.length; i++) {
            let obj ={
              status : 'finished',
              response : {
                  url : res.fileList[i].url,
                  name : res.fileList[i].name,
                  size : res.fileList[i].size
              },
            };
          this.upLoadFileDefaultList.push(obj)
        }
      })
    },
  }
</script>

<style lang="scss" >
  .loanDetail input::-webkit-outer-spin-button,
  .loanDetail input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  .loanDetail input[type="number"]{
    -moz-appearance: textfield;
  }
  .divider-title .el-divider__text{
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
