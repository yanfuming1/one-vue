<template>
    <d2-container class="externalLloanKj">
        <qqt-flow-tabs v-if="tabShow" :procInstId="procInstId" :pdfId="pdfId">
          <template slot="content">
            <el-card :body-style="{ padding: '20px' }">
                <fm-generate-form
                class="addForm"
                :data="jsonData"
                :transform="transform"
                :value="values"
                :remote="remote"
                ref="generateForm">
                
                </fm-generate-form>
                <!-- <div class="add-customer-content___upload">
                    <label for="male">
                        <upload id="male"  :isShowUpload="isShowUpload" ref="upLoad" :propList="upLoadFileDefaultList"></upload>
                    </label>
                </div> -->
                <associated-documents ref="relevance" size="small" :transform="transform" :relevance="values" />
                <bottomInformation :values="values" fieldTitle="经办" timeTitle="提交" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation"></bottomInformation>
                <el-row>
                  <el-col :span="24" style="text-align:center" class="d2-mt-20">
                      <qqt-voucher ref="voucher" v-if="pushDataClone.processVariables.formKey === 'externalLloanKj'"  :voucherShow="voucherShow" @dialogComfirm="dialogComfirm" @dialogCancel="voucherShow=false" :data="queryData" ></qqt-voucher>
                      <qqt-look-voucher ref="voucherCn" :data="queryData" v-else></qqt-look-voucher>
                      <!-- <el-button size="small" type="primary"  @click="consentFun">同意</el-button>
                      <el-button size="small" type="warning" v-if="btnList.indexOf('1') != -1" @click="turnToFun">转办</el-button>
                      <el-button size="small" type="success" v-if="btnList.indexOf('2') != -1" plain @click="returnBtn">驳回</el-button>
                      <el-button size="small" type="info" v-if="btnList.indexOf('3') != -1" @click="invalidBtn">作废</el-button> -->
                      <el-button size="small" type="primary"  @click="consentShowPz(), title = '审批意见', consent['flag'] = '1'">同意</el-button>
                      <el-button size="small" type="warning" v-if="btnList.indexOf('1') != -1" @click="visible = isTurnManage = true, consent['flag'] = '0',title = '转办意见'">转办</el-button>
                      <el-button size="small" type="success" v-if="btnList.indexOf('2') != -1" plain @click="visible = isReject = true, consent['flag'] = '2', title = '驳回意见'" >驳回</el-button>
                      <el-button size="small" type="info" v-if="btnList.indexOf('3') != -1" @click="visible = true, consent['flag'] = '3', title = '作废意见'" >作废</el-button>
                          
                      <el-button size="small" type="primary" plain @click="cancelBtn">取消</el-button>
                  </el-col>
                </el-row>
            </el-card>
          </template>
        </qqt-flow-tabs>
        <el-dialog
        v-dialogDrag
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
                :value="item.activityId"
                >
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
      <qqt-consent :msg="detailMsg" :dialogVisible="visible" :taskId="$route.params.taskId || ''" :type="consent['flag']" :isTurnManage="isTurnManage" :isReject="isReject" @close="consentBorrowingApply" />
    </d2-container>
</template>

<script>
  import qqtTable from '../../../../../components/qqt-subassembly/qqt-table/qqt-table';
  import { qqtFlowDiagram,qqtFlowTabs,upload,qqtConsent,qqtVoucher,qqtLookVoucher, associatedDocuments} from '../../../../../components/qqt-subassembly'
  import { formGetJson } from '../../../../../api/system/fromManagement/index'
  import { getQueryById,goBank,complete,goAdd} from '../../../../../api/financialManagement/externalLloan';
  import util from '@/libs/util.js'
  import { getDetails,findReverseRoute,careOf} from '../../../../../api/approval/common';
  import userModules from '../../../../systemManagement/processDefinition/processModules/userModules'
  import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
  import { mapActions } from 'vuex'
  export default {
    components: {
        qqtTable,
        qqtFlowDiagram,
        qqtFlowTabs,
        userModules,
        upload,
        qqtConsent,
        qqtVoucher,
        qqtLookVoucher,
        bottomInformation,
        associatedDocuments,
    },
    data() {
      let that = this;
      return {
        voucherShow: false,
        detailMsg:'',
        consent: {},
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
          pay: [],
          paymoney: '',
        },
        returnList: [],
        paynameData: [],
        paynameArr: [],
        department: [],
        upLoadFileDefaultList: [],
        user: [],
        isShowUpload: false,
        queryData: {},
        pushDataClone: {},
        payRemote:{
          getPayname(resolve) {
              resolve(that.paynameData);
          },
        },
        remote: {
            getGuaranteedate(resolve) {
                resolve(that.guaranteedateData);
            },
            getGuaranteeways(resolve) {
                resolve(that.guaranteewaysData);
            },
            getLenders(resolve) {
                resolve(that.lendersData);
            },
            getOvertimeway(resolve) {
                resolve(that.overtimewayData);
            },
        },
        guaranteedateData: [],
        guaranteewaysData: [],
        lendersData: [],
        overtimewayData: [],
        values:{},
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
        }
      }
    },
    methods: {
      ...mapActions('d2admin/page', [
          'close',
      ]),
      consentShowPz () {
          // if (this.pushDataClone.processVariables.formKey === 'externalLloanKj') {
          //     this.voucherShow = true;
          // } else {
              this.visible = true;
          // }
         
      },
      dialogComfirm() {
          this.$refs.voucher.comfirmData().then(res=> {
              this.voucherShow = false;
              this.visible = true;
          })
      },
       // 统一操作
      consentBorrowingApply (item = '', boolean = false) {
          this.visible = this.isTurnManage = this.isReject = false
          if (boolean) {
              this.cancelBtn ()
              return
          }
          if (item) {
              this.consent['completeTask'] = item;
              this.consent.id = this.queryData.id;
              let companyData = this.$refs.bottomInformation.getData ();
              this.consent = {
                ...this.consent,
                ...companyData
              }
              complete (this.consent).then (res => {
                  if (res.code === 200) {
                      this.$message.success (res.message);
                      let tagName = this.$route.path;
                      this.close ({ tagName });
                      this.$router.go(-1);
                  }
                  if (this.pushDataClone.processVariables.formKey === 'externalLloanCN') {
                      if (item.type == '1') {
                        this.$refs.voucherCn.CNEdit();
                      }
                  }
              })
          }
      },
      getJson() {
        formGetJson({
            code: 'externalLloan'
        }).then(res => {
            this.jsonData = JSON.parse(res)
        }).catch(res => {
        });
        formGetJson({
            code: 'externalLloanMsg'
        }).then(res => {
            this.payData = JSON.parse(res)
        }).catch(res => {
        });
      },
      payChange (name,value,data) {
        this.values[name] = value;
        if (name === 'paymoney') {
          this.payValues.paymoney = value;
        }
        if (name === 'pay') {
          for (let i = 0; i < value.length; i++) {
            let bankNewArr = this.queryNameByIdCompany(value[i].payname);
            value[i].paybank = bankNewArr.openingBank;
            value[i].payaccount = bankNewArr.account;
          }
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
      // 同意
      consentFun () {
         this.$prompt('请输入审批意见', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputType: 'textarea',
            inputPattern: /^\S/,
            inputErrorMessage: '请输入审批意见'
          }).then(({ value }) => {
              let jsonData = {}
              jsonData.flag = '1';
              jsonData.id = this.queryData.id;
              jsonData.completeTask = {
                "taskId":this.taskId,
                 msg:value,
              };
              complete(jsonData).then((res)=>{
                if (res.success) {
                  this.$message.success('同意成功')
                  let tagName = this.$route.path;
                  this.close ({ tagName })
                  this.$router.go(-1);
                }
              })
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
                  msg:  this.form.paymessage
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
            })
        } else {
          this.$message.error('请选择要转办的部门或人员')
        }
      },
      cancelBtn () {
          this.$router.go(-1);
          let tagName = this.$route.path;
          this.close ({ tagName })
      },
    },
    created () {
      goAdd().then(res=>{
        for (let i = 0; i < res.guaranteedate.length; i++) {
          let obj = {
              value: res.guaranteedate[i].name,
              label: res.guaranteedate[i].name,
          }
          this.guaranteedateData.push(obj)
        }
        for (let i = 0; i < res.guaranteeways.length; i++) {
          let obj = {
              value: res.guaranteeways[i].name,
              label: res.guaranteeways[i].name,
          }
          this.guaranteewaysData.push(obj)
        }
        for (let i = 0; i < res.lenders.length; i++) {
          let obj = {
              value: res.lenders[i].name,
              label: res.lenders[i].name,
          }
          this.lendersData.push(obj)
        }
        for (let i = 0; i < res.overtimeway.length; i++) {
          let obj = {
              value: res.overtimeway[i].name,
              label: res.overtimeway[i].name,
          }
          this.overtimewayData.push(obj)
        }
      }).finally(res=>{
         
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
      this.pushDataClone = pushData;
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
        this.values = res.externalLloan;
        this.queryData = JSON.parse(JSON.stringify(res.externalLloan));
        this.queryData.fileList = this.queryData.fileList || [];
        this.fileList = this.queryData.fileList;
        if (this.queryData.fileList) {
          for (let i = 0; i < this.queryData.fileList.length; i++) {
              let obj ={
                status : 'finished',
                response : {
                    url : this.queryData.fileList[i].url,
                    name : this.queryData.fileList[i].name,
                    size : this.queryData.fileList[i].size,
                },
              };
            this.upLoadFileDefaultList.push(obj)
          }
        }
        // res.externalLloan.pay = res.externalLloan.pay || [];
        // for (let i = 0; i < this.paynameArr.length; i++) {
        //   for (let k = 0; k < res.externalLloan.pay.length; k++) {
        //     if (this.paynameArr[i].name === res.externalLloan.pay[k].payname && this.paynameArr[i].openingBank === res.externalLloan.pay[k].paybank && this.paynameArr[i].account === res.externalLloan.pay[k].payaccount ) {
        //       res.externalLloan.pay[k].payname = this.paynameArr[i].id;
        //     }
        //   }
        // }

      //   // this.payValues.pay = res.pay;
      //   // this.payValues.paymoney = res.paymoney;
      //   // this.values.recmoney = this.values.recmoney .toFixed(2);
      //   // this.values.receivableAmountBig = util.convertCurrency(this.values.recmoney);
      //   // this.values.recmoney += ' 元'
      //   // this.values.paymoney = this.values.paymoney .toFixed(2);
      //   // this.values.paymentAmountBig = util.convertCurrency(this.values.paymoney);
      //   // this.values.paymoney += ' 元'
      })
    },
  }
</script>

<style lang="scss" >
  .externalLloanKj input::-webkit-outer-spin-button,
  .externalLloanKj input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  .externalLloanKj input[type="number"]{
    -moz-appearance: textfield;
  }
  .externalLloanKj .addForm{
    .el-form-item__label {
      background-color: rgb(246,247,251)
    }
    .d2-text-center{
      background-color: rgb(246,247,251)
    }
    .el-form-item{
      margin-bottom: 0px;
      border-right: 1px solid rgb(228,228,228);
    }
    .el-form-item__label{
      line-height: 33px;
      padding-right: 11px;
      border-right: 1px solid rgb(228,228,228);
    }
    .el-input__inner{
      border-radius: 0;
      border: 0;
      // border-top-style: none;
      // border-bottom-style: none;
    }
    .el-row{
        border-top: 1px solid rgb(228,228,228);
        border-left: 1px solid rgb(228,228,228);
    }
    .lastRow{
        border-bottom: 1px solid rgb(228,228,228);
    }
    // .generate-element-item {
    //   // padding-left:  5px;
    // }
    .el-form-item__error {
      z-index: 999;
      top: 20px;
      left: 6px;
    }
  }
</style>