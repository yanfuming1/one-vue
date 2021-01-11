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
                    <el-form :model="payform.data" :rules="payform.rules" ref="payform" label-width="100px">
                     <el-row>
                       <el-col :span="8">
                          <el-form-item label="支付时间" prop="paytime">
                              <el-date-picker
                                v-model="payform.data.paytime"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                              </el-date-picker>
                          </el-form-item>
                       </el-col>
                     </el-row>
                     <!-- <el-row>
                       <el-col >
                          <el-form-item label="出纳意见" prop="paymessage">
                              <el-input
                                type="textarea"
                                placeholder="请输入出纳意见"
                                v-model="payform.data.paymessage"
                              >
                              </el-input>
                          </el-form-item>
                       </el-col>
                     </el-row> -->
                    </el-form>
                    <el-divider class="divider-title" content-position="left">附件</el-divider>
                    <div class="add-customer-content___upload">
                        <label for="male" >
                            <upload id="male" :dataId="values.id" :isShowUpload="!transform.isShowDetails"  ref="upLoad" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList"></upload>
                        </label>
                    </div>
                    <el-row>
                      <bottomInformation :values="values" fieldTitle="申请" timeTitle="申请" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
                    </el-row>
                    <el-row>
                      <el-col :span="24" style="text-align:center" class="d2-mt-20">
                          <!-- <el-button size="small" type="primary"  @click="consentFun">同意</el-button>
                          <el-button size="small" type="warning" v-if="btnList.indexOf('1') != -1" @click="turnToFun">转办</el-button>
                          <el-button size="small" type="success" v-if="btnList.indexOf('2') != -1" plain @click="returnBtn">驳回</el-button>
                          <el-button size="small" type="info" v-if="btnList.indexOf('3') != -1" @click="invalidBtn">作废</el-button>
                           -->
                          <qqt-look-voucher  ref="voucherCn" :data="queryData"></qqt-look-voucher>
                          <el-button size="small" type="primary"  @click="consentFun(), title = '审批意见', consent['flag'] = '1'">同意</el-button>
                          <el-button size="small" type="warning" v-if="btnList.indexOf('1') != -1" @click="visible = isTurnManage = true,consent['flag'] = '0', title = '转办意见'">转办</el-button>
                          <el-button size="small" type="success" v-if="btnList.indexOf('2') != -1" plain @click="visible = isReject = true, consent['flag'] = '2', title = '驳回意见'" >驳回</el-button>
                          <el-button size="small" type="info" v-if="btnList.indexOf('3') != -1" @click="visible = true, consent['flag'] = '3', title = '作废意见'" >作废</el-button>
                          <el-button size="small" type="primary" plain @click="cancelBtn">取消</el-button>
                      </el-col>
                    </el-row>
                </el-card>
              </template>
            </qqt-flow-tabs>
      <qqt-consent :dialogVisible="visible" :msg="detailMsg" :taskId="$route.params.taskId || ''" :type="consent['flag']" :isTurnManage="isTurnManage" :isReject="isReject" @close="consentBorrowingApply" />
    </d2-container>
</template>

<script>
  import qqtTable from '../../../../../components/qqt-subassembly/qqt-table/qqt-table';
  import { qqtFlowDiagram,qqtFlowTabs,qqtConsent,qqtLookVoucher, associatedDocuments, upload} from '../../../../../components/qqt-subassembly'
  import { formGetJson } from '../../../../../api/system/fromManagement/index'
  import { getGoadd,getQueryById,goBank,complete,exceptUserAccount} from '../../../../../api/financialManagement/paymentRequest';
  import util from '@/libs/util.js'
  import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
  import { getDetails, findReverseRoute, careOf} from '../../../../../api/approval/common';
  import userModules from '../../../../systemManagement/processDefinition/processModules/userModules'
  import { mapActions } from 'vuex'
  export default {
    components: {
        qqtTable,
        qqtFlowDiagram,
        qqtFlowTabs,
        userModules,
        qqtConsent,
        qqtLookVoucher,
        bottomInformation,
        associatedDocuments,
        upload
    },
    data() {
      let that = this;
      return {
        detailMsg: '',
        consentData: [],
        consent: {},
        visible: false,
        isReject: false,
        isTurnManage: false,
        isShow:false,
        tabShow:false,
        rejectShow:false,
        procInstId: '',
        pdfId: '',
        btnList: '',
        payValues:{},
        rejectVal: '',
        returnList: [],
        paynameData: [],
        paywayData: [],
        user: [],
        department: [],
        paynameArr: [],
        queryData: {},
        payRemote:{
        
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
          getPayname(resolve) {
            resolve(that.paynameData);
          },
          getPayway(resolve) {
              resolve(that.paywayData);
          },
        },
        values:{},
        accountsData: [],
        bankAccountsData: [],
        vouchersData: [],
        jsonData: {},
        transform: {
           isShowDetails:true
        },
        payform: {
          data: {
            paytime: '',
            paymessage: '',
          },
          rules: {
            paytime: [
                { required: true, message: '请选择支付时间', trigger: 'change' }
            ],
            paymessage: [
                { required: true, message: '请填写出纳意见', trigger: ['change','blur'] }
            ],
          }
        },
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
              let companyItem = this.$refs.bottomInformation.getData ()
              this.consent = {
                ...this.consent,
                ...companyItem
              }
              if (this.consent.flag === '1') {
                jsonData = this.consent;
                jsonData.completeTask.paytime = new Date(this.payform.data.paytime).format('yyyy-MM-dd');
              } else {
                jsonData = this.consent;
              }
              jsonData.id = this.queryData.id;
              complete (jsonData).then (res => {
                  if (res.code === 200) {
                      this.$message.success (res.message);
                      let tagName = this.$route.path;
                      this.close ({ tagName });
                      this.$router.go(-1);
                  }
                  if (item.type == '1') {
                      this.$refs.voucherCn.CNEdit();
                  }
              })
          }
      },
      getJson() {
        formGetJson({
            code: 'paymentRequestCNPage'
        }).then(res => {
            this.jsonData = JSON.parse(res)
        }).catch(res => {
        });
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
      // 同意
      consentFun () {
         this.$refs['payform'].validate((valid) => {
          if (valid) {
            // let jsonData = {};
            this.visible = true;
            // jsonData.flag = '1';
            // jsonData.id = this.queryData.id;
            // jsonData.completeTask = {
            //   "taskId":this.taskId,
            //   'msg': this.payform.data.paymessage
            // };
            // jsonData.paytime = new Date(this.payform.data.paytime).format('yyyy-MM-dd');
            // jsonData.paymessage = this.payform.data.paymessage;
            // complete(jsonData).then((res)=>{
            //   if (res.success) {
            //     this.$message.success('同意成功')
            //     let tagName = this.$route.path;
            //     this.close ({ tagName })
            //     this.$router.go(-1);
            //   }
            // })
          } 
        });
      },
       //转办穿梭框
      clearUserPage (item) {
        array.forEach(function() {
          
        });
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
      // 转办
      turnToFun () {
        this.isShow = !this.isShow
      },
       rejectCancel () {
		    this.rejectShow = false;
      },
      rejectOk () {
        if (this.rejectVal) {
            let jsonData = {};
            jsonData.flag = '2';
            jsonData.id = this.queryData.id;
            jsonData.completeTask = {
              "taskId":this.taskId,
              activityId: this.rejectVal,
              msg: this.payform.data.paymessage
            };
            jsonData.paytime = '';
            complete(jsonData).then((res)=>{
              if (res.success) {
                this.$message.success('驳回成功')
                 let tagName = this.$route.path;
                this.close ({ tagName })
                this.$router.go(-1);
              }
            })
        } else {
          this.$message.error('请选择要驳回的节点')
        }
      },
      // 驳回
      returnBtn () {
        if (this.payform.data.paymessage) {
            this.rejectShow = true;
        } else {
            this.$message.error('请输入驳回理由')
        }
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
      },
      cancelBtn () {
        let tagName = this.$route.path;
        this.close ({ tagName })
        this.$router.go(-1);
      },
      upLoadFileCallBack (item) {
        this.fileList = item
      },
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
          for (let i = 0; i < vouchersData.length; i++) {
              let obj = {
                value: vouchersData[i].name,
                label: vouchersData[i].name,
              }
              this.vouchersData.push(obj)
          }
      }).finally (res => {
      
      })
      goBank ().then(res =>{
        let paynameData = res.bankAccounts;
        this.paynameArr = res.bankAccounts;
        for (let i = 0; i < paynameData.length; i++) {
            let obj = {
              value: paynameData[i].id,
              label: paynameData[i].name,
            }
            this.paynameData.push(obj)
        }
        let paywayData = res.accounts;
        for (let i = 0; i < paywayData.length; i++) {
            let obj = {
              value: paywayData[i].name,
              label: paywayData[i].name,
            }
            this.paywayData.push(obj)
        }
      }).finally(res=>{
        this.getJson();
      })
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
          this.rejectVal = res.sendBackNode;
        })
        findReverseRoute(pushData.procDefId + '/' +pushData.activityId).then(res=>{
          this.returnList = res;
        })
      }
      getQueryById({id:pushData.processVariables.relevancyId}).then(res=>{
        this.values = res;
        this.queryData = JSON.parse(JSON.stringify(res));
      
        this.values.recmoney = Number(this.values.recmoney).toFixed(2);
        this.values.receivableAmountBig = util.convertCurrency(this.values.recmoney);
        // this.values.recmoney += ' 元'
        this.values.paymoney = this.values.paymoney.toFixed(2);
        this.values.paymentAmountBig = util.convertCurrency(this.values.paymoney);
        // this.values.paymoney += ' 元'
        this.values.totalmoney = Number(this.values.totalmoney).toFixed(2);
        this.values.big = util.convertCurrency(this.values.totalmoney);
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
      this.payform.data.paytime = new Date().format('yyyy-MM-dd')
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

</style>