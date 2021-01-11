<template>
  <d2-container class="addpay_Dialog">
    <el-card class="box-card closeHeader">
      <div slot="header" >
        <el-button type="text" @click="cancelBtn"><i class="el-icon-close"></i></el-button>
      </div>
      <qqt-flow-tabs v-if="modelData.procInstId" :procInstId="modelData.procInstId" :pdfId="modelData.pdfId">
        <template slot="content">
          <fm-generate-form
          :data="jsonData"
          :value="isAdd === true ? values : newData"
          v-if="isLoad"
          :remote="remote"
          :transform="transform"
          @on-change="addChange"
          ref="generateForm">
          <template slot="pays">
            <add-pays-table ref="addPaysTable" :isShowDetails="transform.isShowDetails" :data="isAdd === true ? values.pays : newData.pays"></add-pays-table>
          </template>
          <template slot="recs">
            <add-table ref="addTable" :isShowDetails="transform.isShowDetails" :selectData="selectData" :data="isAdd === true ? values.recs : newData.recs"></add-table>
          </template>
          <template slot="addTable" v-if="isAdd === false && newData.clcu.length > 0">
            <title-line>公司付款账户信息</title-line>
            <add-clcu-table  :isShowDetails="transform.isShowDetails" :data="newData.clcu"></add-clcu-table>
          </template>
          <template slot="relevance">
            <associated-documents ref="relevance" :isTypeRequired="identification == '1' ? false : true" :top="isAdd === false && newData.clcu.length > 0 ? '0px' : '-40px'" size="small" :transform="transform" :relevance="isAdd === true ? values : newData" />
          </template>
          </fm-generate-form>
          <div class="add-customer-content___upload">
              <label for="male" >
                  <upload id="male" :isShowUpload="isShowUpload"  ref="upLoad" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList"></upload>
              </label>
          </div>
          <bottomInformation fieldTitle="申请" timeTitle="申请" :values="modelData" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
          <el-row>
            <el-col :span="24" style="text-align:center" class="d2-mt-15">
              <qqt-look-voucher :data="modelData" ></qqt-look-voucher>
              <!-- 操作按钮 -->
              <el-button size="small" type="primary" v-if="isJump && modelData.pathName === 'backlog'" @click="visible = true, title = '审批意见', consent['flag'] = '1'">同意</el-button>
              <el-button
                size="small"
                type="warning"
                v-if="btnList.indexOf('1') != -1"
                @click="visible = isTurnManage = true,consent['flag'] = '0', title = '转办意见'"
              >转办</el-button>
              <el-button
                size="small"
                type="success"
                v-if="btnList.indexOf('2') != -1"
                plain
                @click="visible = isReject = true, consent['flag'] = '2', title = '驳回意见'"
              >驳回</el-button>
              <el-button
                size="small"
                type="info"
                v-if="btnList.indexOf('3') != -1"
                @click="visible = true, consent['flag'] = '3', title = '作废意见'"
              >作废</el-button>
              <!-- <el-button size="small" type="primary"  @click="consentFun" v-if="isJump && modelData.pathName === 'backlog'">同意</el-button>
              <el-button size="small" type="warning" v-if="btnList.indexOf('1') != -1" @click="turnToFun">转办</el-button>
              <el-button size="small" type="success" v-if="btnList.indexOf('2') != -1" plain @click="returnBtn">驳回</el-button>
              <el-button size="small" type="info" v-if="btnList.indexOf('3') != -1" @click="invalidBtn">作废</el-button> -->
              <!-- 基础按钮 -->
              <el-button size="small" type="warning" @click="saveBtn"  v-if="isAdd && !isSendBack">保存</el-button>
              <el-button size="small" type="primary" v-if="isAdd && isSendBack" @click="anewSubmitBtn">重新提交</el-button>
              <el-button size="small" type="success" @click="submitBtn"   v-else-if="isAdd" >提交</el-button>
              <el-button type="info" size="small" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
              <el-button size="small" type="primary" @click="cancelBtn">{{isAdd?'取消':( isJump ? '取消':'关闭')}}</el-button>
            </el-col>
          </el-row>
        </template>
      </qqt-flow-tabs>
      <template v-else>
        <fm-generate-form
        :data="jsonData"
        :value="isAdd === true ? values : newData"
        v-if="isLoad"
        :remote="remote"
        :transform="transform"
        @on-change="addChange"
        ref="generateForm">
          <template slot="pays">
            <add-pays-table ref="addPaysTable" :isShowDetails="transform.isShowDetails" :data="isAdd === true ? values.pays : newData.pays"></add-pays-table>
          </template>
          <template slot="recs">
            <add-table ref="addTable" :isShowDetails="transform.isShowDetails" :selectData="selectData" :data="isAdd === true ? values.recs : newData.recs"></add-table>
          </template>
          <template slot="relevance">
            <associated-documents ref="relevance" :isTypeRequired="identification == '1' ? false : true" size="small" top="-40px" :transform="relevance" :relevance="isAdd === true ? values : newData" />
          </template>
        </fm-generate-form>
        <!-- <div class="add-customer-content___upload">
            <label for="male">
                <upload id="male" :isShowUpload="isShowUpload"  ref="upLoad" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList"></upload>
            </label>
        </div> -->
         <div class="add-customer-content___upload">
              <label for="male" >
                  <upload id="male" :isShowUpload="isShowUpload"  ref="upLoad" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList"></upload>
              </label>
          </div>
          <bottomInformation :values="modelData" fieldTitle="申请" timeTitle="申请" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
         <el-row>
          <el-col :span="24" style="text-align:center" class="d2-mt-15">
              <!-- 操作按钮 -->
              <el-button size="small" type="primary"  @click="consentFun" v-if="isJump && modelData.pathName === 'backlog'">同意</el-button>
              <el-button size="small" type="warning" v-if="btnList.indexOf('1') != -1" @click="turnToFun">转办</el-button>
              <el-button size="small" type="success" v-if="btnList.indexOf('2') != -1" plain @click="returnBtn">驳回</el-button>
              <el-button size="small" type="info" v-if="btnList.indexOf('3') != -1" @click="invalidBtn">作废</el-button>
              <!-- 基础按钮 -->
              <el-button size="small" type="warning" @click="saveBtn"  v-if="isAdd && !isSendBack">保存</el-button>
              <el-button size="small" type="primary" v-if="isAdd && isSendBack" @click="anewSubmitBtn">重新提交</el-button>
              <el-button size="small" type="success" @click="submitBtn"   v-else-if="isAdd" >提交</el-button>
              <el-button type="info" size="small" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
              <el-button size="small" type="primary" @click="cancelBtn">{{isAdd?'取消': '关闭'}}</el-button>
          </el-col>
        </el-row>
      </template>
       
    </el-card>
    <qqt-send-process :isSendBack="isSendBack" :dialogVisible="dialogVisible" :prossValue="prossValue" :processModuleId="processModuleId" @close="closeFun" @selectData="selectDataFun"></qqt-send-process>
    <el-dialog
        v-dialogDrag
        title="驳回"
        :visible.sync="rejectShow"
        width="30%"
        >
        <el-form :model="returnForm.data" :rules="returnForm.rules" ref="form" label-width="100px">
          <el-form-item label="驳回节点：" prop="rejectVal">
            <el-select v-model="returnForm.data.rejectVal"  >
              <el-option v-for="item in returnList"
                :key="item.activityId"
                :label="item.name"
                :value="item.activityId"
                >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="驳回意见：" prop="msg">
            <el-input
                type="textarea"
                placeholder="请输入驳回意见"
                v-model="returnForm.data.msg" 
              >
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button type="primary" @click="rejectOk">确 定</el-button>
          <el-button @click="rejectCancel">取 消</el-button>
        </span>
      </el-dialog>
      <print-template-by-html v-show="false" :code="code" ref="printTemp" />
      <user-modules :showDialog="isShow" :userIds="user" :department="department" @clearUserPage="clearUserPage" @closeFun="isShow = false"></user-modules>
    <verify-code :money="money" @verifySuccess="verifySuccess" :moduleData="moduleData" :compareMoney="compareMoney"  @verifyClose="verifyClose" v-if="codeShow"></verify-code> 
    <qqt-consent :dialogVisible="visible" :msg="detailMsg" :taskId="$route.params.taskId || ''" :type="consent['flag']" :isTurnManage="isTurnManage" :isReject="isReject" @close="consentBorrowingApply" />
  </d2-container>
</template>

<script>
  import { 
           getExternalPaymentApplicationAdd, addPaymentRequestToSelf, getGoadd,
           getEdit, editPaymentRequestToSelf, getSubmit, submitPaymentRequestToSelf, editAfterSubmit,
           resetSubmitPaymentRequestToSelf, complete, completePaymentRequestToSelf, exceptUserAccount
         } from '../../../../api/financialManagement/paymentRequest';
  import addClcuTable from '../../../approval/components/pushPage/components/payAddTable';
  import titleLine from '../../component/titleLine/titleLine';
  import {qqtSendProcess,qqtLookVoucher, associatedDocuments} from '@/components/qqt-subassembly';
  import { formGetJson } from '../../../../api/system/fromManagement/index'
  import { upload,qqtTable,qqtFlowTabs,qqtConsent} from '../../../../components/qqt-subassembly'
  import util from '@/libs/util.js'
  import { isNumber } from 'util';
  import { FINANCIALMANAGEMENT } from '../../../../enum/FORMCODE';
  import { getDetails,findReverseRoute,careOf} from '../../../../api/approval/common';
  import { configQueryById} from '../../../../api/configuration/index';
  import { mapActions } from 'vuex'
  import userModules from '../../../systemManagement/processDefinition/processModules/userModules';
  import verifyCode from '../../../../components/verifyCode';
  import bottomInformation from '../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
  import addTable from './addTable/addRecsTable';
  import addPaysTable from './addTable/addPaysTable';
  import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
  import { queryDicById } from '@/api/system/dic/dic'
  import { FINANCE } from '@/enum/DICTIONARY'
  import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
  import printTemplateByHtml from '@/views/systemManagement/printTemplate/components/printTemplateByHtml'
  export default {
    name:'marginApplicationPay',
    components: {
      upload,
      qqtSendProcess,
      qqtLookVoucher,
      qqtTable,
      qqtFlowTabs,
      userModules,
      verifyCode,
      addTable,
      addPaysTable,
      qqtConsent,
      titleLine,
      addClcuTable,
      bottomInformation,
      associatedDocuments,
      'print-template-by-html': printTemplateByHtml
    },
    // props: {
    //  modelData
    // },
    props: {
      modelData: {
        type: Object,
        default: {}
      },
      isAdd: {
        type: Boolean,
        default: false
      },
      isCopy: {
        type: Boolean,
        default: false
      },
      isEdit: {
        type: Boolean,
        default: false
      },
      isJump: {
        type: Boolean,
        default: false
      },
      isSendBack: {
        type: Boolean,
        default: false
      },
      identification: {
        type: String,
        default: null
      }
    },
    data() {
      let that = this;
      return {
        detailMsg: '',
        consent: {},
        visible: false,
        isReject: false,
        isTurnManage: false,
        codeShow:false,
        btnList: '',
        upLoadFileDefaultList: [],
        fileList: [],
        accountsData: [],
        bankAccountsData: [],
        vouchersData: [],
        bankAccountsArr: [],
        user: [],
        department: [],
        isShow:false,
        jsonData: {},
        prossValue:{
          title: '',
          pdfId: '',
          degree: '',
        },
        submitData: {},
        isLoad: false, 
        rejectShow: false, 
        returnList: [],
        values: {
          paymoney:'',
          paymentAmountBig:'',
          receivableAmountBig:'',
          projectName: '',
          projectCode: '',
          projectType: '',
          projectId: '',
          recmoney:'',
          pays:[],
          recs:[],
        },
        // this.modelData
        selectData: {
          getAccounts: [],
          getbankAccounts: [],
          getVouchers: []
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
        transform: {
          isShowDetails: !this.isAdd
        },
        relevance: {
          isShowDetails: !this.isAdd
        },
        isShowUpload: this.isAdd,
        isShowElement:true,
        addModel: {},
        flowShow: false,
        form: {
          pdfId: '',
        },
        rules: {
          pdfId: [
            { required: true, message: '请选择业务流程', trigger: ['change','blur'] }
          ],
        },
        dialogVisible:false,
        processModuleId: '',
        returnForm: {
          data: {
            rejectVal: '',
            msg: '',
          },
          rules: {
            rejectVal: [
              { required: true, message: '请输入驳回节点', trigger: ['change','blur'] }
            ],
            msg: [
              { required: true, message: '请输入驳回意见', trigger: ['change','blur'] }
            ]
          }
        },
        money: 0,
        moduleData:'',
        compareMoney: 0,
        code: BASICSCODE.EXTERNAL_PAYMENT_APPLICATION
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
              this.consent['completeTask'] = item
              this.consent.id = this.modelData.id;
              let companyItem = this.$refs.bottomInformation.getData ()
              this.consent = {
                ...this.consent,
                ...companyItem
              }
              let url = this.identification == '1' ? completePaymentRequestToSelf : complete
              url (this.consent).then (res => {
                  if (res.code === 200) {
                      this.$message.success (res.message);
                      let tagName = this.$route.path;
                      this.close ({ tagName });
                      this.$router.go(-1);
                  }
              })
          }
      },
      verifyClose () {
        this.codeShow = false;
      },
      getVerify() {
        return new Promise((resolve, reject) => {
            configQueryById({id:'1194913947765157888'}).then(res => {
              if (res.status == 0) {
                let type = true;
                let data = res;
                resolve ({type,data})
              } else {
                resolve (false)
              }
            })
        })
      },
      // 保存
      saveBtn () {
        // this.isShowElement = !this.isShowElement;
        let url = '', relevance = {}, item = {}
        relevance = this.$refs.relevance.getData ()
        item = this.$refs.bottomInformation.getData ()
        this.$refs.generateForm.getData().then(data => {
          this.$refs.addPaysTable.getData().then(addPayData =>{
            this.$refs.addTable.getData().then(addData =>{
              if(item) {
                let jsonData = JSON.parse(JSON.stringify(data));
                jsonData.recs = [];
                jsonData.pays = [];
                let jsonAddData = JSON.parse(JSON.stringify(addData));
                jsonData.recmoney = jsonAddData.recmoney;
                jsonData.recmoneyUpper = jsonAddData.recmoneyUpper;
                jsonData.viceId = addPayData.viceId + jsonAddData.viceId;
                jsonData.paymoney = addPayData.paymoney;
                jsonData.paymoneyUpper = addPayData.paymoneyUpper;
                jsonData.pays = addPayData.pays;
                jsonData.recs = jsonAddData.recs;
                Object.assign(jsonData, item, relevance)
          
                if (jsonData.paymoney-0 === 0 || jsonData.recmoney-0 === 0) {
                  this.$message.error('合计金额不能为0');
                  return
                }
                if (jsonData.paymoney-0 !== jsonData.recmoney-0) {
                  this.$message.error('支付的合计金额和收款的合计金额不一致，请确认');
                  return
                }
                for (let i = 0; i < jsonData.pays.length; i++) {
                  jsonData.pays[i]['identifier'] = 'pay';
                }

                for (let k = 0; k < jsonData.recs.length; k++) {
                  jsonData.recs[k]['identifier'] = 'rec';
                }
                delete jsonData.paymentAmountBig;
                delete jsonData.receivableAmountBig;
                if (this.isEdit) {
                  jsonData.id = this.modelData.id;
                  jsonData.fileList = this.fileList;
                  url = this.identification == '1' ? editPaymentRequestToSelf : getEdit
                  url (jsonData).then(res => {
                    this.$emit('successFun',res);
                  }).catch(err => {
                      console.log(err);
                  });
                } else {
                  jsonData.fileList = this.fileList;
                  url = this.identification == '1' ? addPaymentRequestToSelf : getExternalPaymentApplicationAdd
                  url (jsonData).then(res => {
                    this.$emit('successFun',res);
                  }).catch(err => {
                      console.log(err);
                  });
                }
              }
            })
          })
        }).catch(e => {
            console.log(e)
        })
      },
      // 短信校验成功
      verifySuccess () {
        this.codeShow = false;
        if (this.isSendBack) {
          this.prossValue.title = `对外付款申请:金额【${this.submitData.paymoney}元】`;
          this.prossValue.degree = this.modelData.degree;
          this.processModuleId = 'paymentRequest'; 
          this.prossValue.pdfId = this.modelData.pdfId;
          this.dialogVisible = true; 
        } else {
          this.prossValue.title = `对外付款申请:金额【${this.submitData.paymoney}元】`
          this.processModuleId = 'paymentRequest'; 
          this.dialogVisible = true; 
        }
      },
      submitBtn () {
        let relevance = this.$refs.relevance.getData ()
        let item = this.$refs.bottomInformation.getData ()
        this.$refs.generateForm.getData().then(data => {
          this.$refs.addPaysTable.getData().then(addPayData =>{
            this.$refs.addTable.getData().then(addData =>{
              if(item) {
                let jsonData = JSON.parse(JSON.stringify(data));
                jsonData.recs = [];
                jsonData.pays = [];
                let jsonAddData = JSON.parse(JSON.stringify(addData));
                jsonData.recmoney = jsonAddData.recmoney;
                jsonData.recmoneyUpper = jsonAddData.recmoneyUpper;
                jsonData.recs = jsonAddData.recs;
                jsonData.paymoney = addPayData.paymoney;
                jsonData.paymoneyUpper = addPayData.paymoneyUpper;
                jsonData.viceId = addPayData.viceId + jsonAddData.viceId;
                jsonData.pays = addPayData.pays;
                Object.assign(jsonData, item, relevance)
                if (jsonData.paymoney-0 === 0 || jsonData.recmoney-0 === 0) {
                  this.$message.error('合计金额不能为0');
                  return
                }
                if (jsonData.paymoney-0 !== jsonData.recmoney-0) {
                  this.$message.error('支付的合计金额和收款的合计金额不一致，请确认');
                  return
                }
                for (let i = 0; i < jsonData.pays.length; i++) {
                  jsonData.pays[i]['identifier'] = 'pay';
                }
                for (let k = 0; k < jsonData.recs.length; k++) {
                  jsonData.recs[k]['identifier'] = 'rec';
                  // jsonData.recs[k].line1 = this.queryNameByIdRces(jsonData.recs[k].line1).name;
                }
                this.submitData = jsonData;
                this.getVerify().then(obj=>{
                  if (obj.type) {
                      if (Number(this.submitData.paymoney) > Number(obj.data.value)) {
                        this.money = this.submitData.paymoney;
                        this.compareMoney = obj.data.value;
                        this.moduleData = obj.data.name;
                        this.codeShow = true;
                      } else {
                        this.prossValue.title = `对外付款申请:金额【${jsonData.paymoney}元】`
                        this.processModuleId = 'paymentRequest'; 
                        this.dialogVisible = true; 
                      }
                  }else {
                      this.prossValue.title = `对外付款申请:金额【${jsonData.paymoney}元】`
                      this.processModuleId = 'paymentRequest'; 
                      this.dialogVisible = true; 
                  }
                })
              }
            })
          })
        }).catch(res =>{
        })
      },
      // 重新提交
      anewSubmitBtn (){
          let relevance = this.$refs.relevance.getData ()
          let item = this.$refs.bottomInformation.getData ()
          this.$refs.generateForm.getData().then(data => {
            this.$refs.addPaysTable.getData().then(addPayData =>{
              this.$refs.addTable.getData().then(addData =>{
                  // let jsonData = JSON.parse(JSON.stringify(data));
                  // jsonData.recs = [];
                  // let jsonAddData = JSON.parse(JSON.stringify(addData));
                  // jsonData.recmoney = jsonAddData.recmoney;
                  // jsonData.recs = jsonAddData.recs;
                  let jsonData = JSON.parse(JSON.stringify(data));
                  jsonData.recs = [];
                  jsonData.pays = [];
                  let jsonAddData = JSON.parse(JSON.stringify(addData));
                  jsonData.recmoney = jsonAddData.recmoney;
                  jsonData.recmoneyUpper = jsonAddData.recmoneyUpper;
                  jsonData.recs = jsonAddData.recs;
                  jsonData.paymoney = addPayData.paymoney;
                  jsonData.paymoneyUpper = addPayData.paymoneyUpper;
                  jsonData.viceId = addPayData.viceId + jsonAddData.viceId;
                  jsonData.pays = addPayData.pays;
                  Object.assign(jsonData, item, relevance)
                  if (jsonData.paymoney-0 === 0 || jsonData.recmoney-0 === 0) {
                    this.$message.error('合计金额不能为0');
                    return
                  }
                  if (jsonData.paymoney-0 !== jsonData.recmoney-0) {
                    this.$message.error('支付的合计金额和收款的合计金额不一致，请确认');
                    return
                  }
                  let indexs = '';
                  let flag = false;
                  let totalIndex = '';
                  let totalType = false;
                  let phoneIndex = '';
                  let phoneFlag = false;
                  for (let i = 0; i < jsonData.pays.length; i++) {
                      if (!jsonData.pays[i].line1 || !jsonData.pays[i].line2 || (jsonData.pays[i].line5-0) === 0 ) {
                        indexs += i + 1 + ',';
                        flag = true;
                      }        
                  }
                  for (let k = 0; k < jsonData.recs.length; k++) {
                      if (!jsonData.recs[k].line1 || !jsonData.recs[k].line7 || !jsonData.recs[k].line8 ) {
                        totalIndex += k + 1 + ',';
                        totalType = true;
                      }
                     const reg = /(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\(\d{3}\))|(\d{3}\-))?(1[3456789]\d{9})$)/;
                      if(!reg.test(jsonData.recs[k].line8 )){ 
                        phoneIndex += k + 1 + ',';
                        phoneFlag = true;
                      } 
                  }
                  if (flag) {
                    this.$message.error(`请确认支付事由及费用明细:第${indexs.substring(0,indexs.length -1)}行，支付事项、单位或合计为空，请确认`)
                    return
                  } else if (totalType) {
                    this.$message.error(`请确认收款人账户信息:第${totalIndex.substring(0,totalIndex.length -1)}行，银行账户信息、收款人信息未补充完整，请确认`)
                    return
                  } else if (phoneFlag) {
                    this.$message.error(`请确认第${phoneIndex.substring(0,phoneIndex.length -1)}行，联系方式格式不正确，请确认联系方式`)
                    return
                  }
                  for (let i = 0; i < jsonData.pays.length; i++) {
                    jsonData.pays[i]['identifier'] = 'pay';
                  }
                  for (let k = 0; k < jsonData.recs.length; k++) {
                    jsonData.recs[k]['identifier'] = 'rec';
                  }
                  this.submitData = jsonData;
                  this.getVerify().then(obj=>{
                      if (obj.type) {
                        if (Number(this.submitData.paymoney) > Number(obj.data.value)) {
                          this.money = this.submitData.paymoney;
                          this.compareMoney = obj.data.value;
                          this.moduleData = obj.data.name;
                          this.codeShow = true;
                        } else {
                          this.prossValue.title = `对外付款申请:金额【${jsonData.paymoney}元】`;
                          this.prossValue.degree = this.modelData.degree;
                          this.processModuleId = 'paymentRequest'; 
                          this.prossValue.pdfId = this.modelData.pdfId;
                          this.dialogVisible = true; 
                        }
                      } else {
                          this.prossValue.title = `对外付款申请:金额【${jsonData.paymoney}元】`;
                          this.prossValue.degree = this.modelData.degree;
                          this.processModuleId = 'paymentRequest'; 
                          this.prossValue.pdfId = this.modelData.pdfId;
                          this.dialogVisible = true; 
                      }
                  })
              })
            })
          }).catch(e => {
          })
      },
      closeFun () {
        this.dialogVisible = false; 
      },
      selectDataFun (data) {
        let url = ''
        delete this.submitData.paymentAmountBig;
        delete this.submitData.receivableAmountBig;
        this.submitData.completeTask = data;
        this.submitData.fileList = this.fileList;
        if (this.isSendBack) {
            let jsonData = this.submitData;
            jsonData.id = this.modelData.id;
            jsonData.flag = '1';
            jsonData.completeTask.taskId = this.modelData.taskId;
            url = this.identification == '1' ? completePaymentRequestToSelf : complete
            url (jsonData).then((res)=>{
              if (res.success) {
                this.$message.success('重新提交成功');
                this.$emit('successFun',res);
              }
            })
        } else {
            if (this.newData.id) {
              this.submitData.id = this.newData.id;
              url = this.identification == '1' ? resetSubmitPaymentRequestToSelf : editAfterSubmit
              url (this.submitData).then(res => {
                this.dialogVisible = false;
                this.$emit('successFun',res);
              }).catch(err => {
                  console.log(err);
              });
            } else {
              url = this.identification == '1' ? submitPaymentRequestToSelf : getSubmit
              url (this.submitData).then(res => {
                this.dialogVisible = false;
                this.$emit('successFun',res);
              }).catch(err => {
                  console.log(err);
              });
            }
        }
      },
      consentFun () {
          this.$prompt('请输入审批意见', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputType: 'textarea',
            inputPattern: /^\S/,
            inputErrorMessage: '请输入审批意见'
          }).then(({ value }) => {
            let jsonData = {};
            jsonData.flag = '1';
            jsonData.id = this.modelData.id;
            jsonData.completeTask = {
              "taskId":this.modelData.taskId,
              'msg': value
            };
            let url = this.identification == '1' ? completePaymentRequestToSelf : complete
            url (jsonData).then((res)=>{
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
                jsonData.id = this.modelData.id;
                jsonData.completeTask = {
                  "taskId":this.modelData.taskId,
                  activityId: this.returnForm.data.rejectVal,
                  msg: this.returnForm.data.msg
                };
                let url = this.identification == '1' ? completePaymentRequestToSelf : complete
                url (jsonData).then((res)=>{
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
                id:this.modelData.id
              };
              jsonData.completeTask = {
                "taskId":this.modelData.taskId,
                "msg":value
              };
              let url = this.identification == '1' ? completePaymentRequestToSelf : complete
              url (jsonData).then((res)=>{
                if (res.success) {
                  this.$message.success('作废成功')
                  let tagName = this.$route.path;
                  this.close ({ tagName })
                  this.$router.go(-1);
                }
              })
          })
      
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
                careOf(this.modelData.taskId,jsonData).then(res=>{
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
        if (this.isJump) {
            this.$router.go(-1);
        }
        this.$emit('cancelBtn');
      },
      printTemplate () {
          getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.modelData.id}).then(res => {
              res.totalmoneyUpper = util.convertCurrency(res.totalmoney);
              if (res) this.$refs.printTemp.printTemplate (res)
          })
      },
      // 上传
      upLoadFileCallBack (item) {
          this.fileList = item
      },
      addChange (name,value,data) {
        if (name === "pays") {
          let total = 0;
          for (let i = 0; i < value.length; i++) {
            value[i].line5 = (value[i].line3 * 1000000 * value[i].line4 / 1000000).toFixed(2)
            total += (value[i].line5 * 1000000)-0;
          }
          this.values.paymoney = (total / 1000000).toFixed(2);
          this.values.paymentAmountBig = util.convertCurrency(this.values.paymoney);
          if (!this.isAdd) {
            this.newData.paymoney = (total / 1000000).toFixed(2);
            this.newData.paymentAmountBig = util.convertCurrency(this.newData.paymoney);
          }
        }
        // if (name === "recs") {
        //   let total = 0;
        //   for (let i = 0; i < value.length; i++) {
        //     let bankNewArr = this.queryNameByIdRces(value[i].line1);
        //     value[i].line2 = bankNewArr.openingBank;
        //     value[i].line3 = bankNewArr.account;
        //     total += (value[i].line4 * 1000000)-0;
        //   }
        //   this.values.recmoney = (total / 1000000).toFixed(2);
        //   this.values.receivableAmountBig = util.convertCurrency(this.values.recmoney);
        //   if (!this.isAdd) {
        //     this.newData.recmoney = (total / 1000000).toFixed(2);
        //     this.newData.receivableAmountBig = util.convertCurrency(this.newData.recmoney);
        //   }
        // }
        this.values[name] = value;
      },
      queryNameByIdRces (id) {
          let data = {};
          for (let i = 0; i < this.bankAccountsArr.length; i++) {
            if (id === this.bankAccountsArr[i].id) {
              data = this.bankAccountsArr[i];
            }
          }
          return data;
      },
      getJsonData () {
         this.isLoad = true;
        formGetJson({
            code: 'paymentRequest'
        }).then(res => {
            this.jsonData = JSON.parse(res)
        }).catch(res => {
        }).finally(res=>{
          if (this.isCopy=== true || this.isSendBack === true ) {
              this.upLoadFileDefaultList = [];
              for (let i = 0; i < this.bankAccountsArr.length; i++) {
                for (let k = 0; k < this.modelData.recs.length; k++) {
                  if (this.bankAccountsArr[i].name === this.modelData.recs[k].line1 && this.bankAccountsArr[i].openingBank === this.modelData.recs[k].line2 && this.bankAccountsArr[i].account === this.modelData.recs[k].line3 ) {
                    this.modelData.recs[k].line1 = this.bankAccountsArr[i].id;
                  }
                }
              }  
              this.modelData.fileList = this.modelData.fileList ? this.modelData.fileList : [];
              this.fileList = this.modelData.fileList;
                // fileList 赋值
                for (let i = 0; i < this.modelData.fileList.length; i++) {
                    let obj ={
                      status : 'finished',
                      response : {
                          url : this.modelData.fileList[i].url,
                          name : this.modelData.fileList[i].name,
                          size : this.modelData.fileList[i].size
                      },
                    };
                  this.upLoadFileDefaultList.push(obj)
                }
                this.modelData.paymoney = (this.modelData.paymoney - 0).toFixed(2);
                this.modelData.recmoney = (this.modelData.recmoney - 0).toFixed(2);
                this.modelData.receivableAmountBig = util.convertCurrency(this.modelData.recmoney);
                this.modelData.paymentAmountBig = util.convertCurrency(this.modelData.paymoney);
                util.setObjval(this.values,this.modelData)
          }
          if (this.modelData.activityId) {
            getDetails(this.modelData.procDefId + '/' +this.modelData.activityId).then(res=>{
              this.btnList = res.operation;
              this.detailMsg = res.msg;
              this.returnForm.data.rejectVal = res.sendBackNode;
            })
            findReverseRoute(this.modelData.procDefId + '/' +this.modelData.activityId).then(res=>{
              this.returnList = res;
            })
          }
        })
      },

      getQueryDicByIdList () {
        queryDicById ({id: FINANCE.NATUREACCOUNT}).then (list => {
          if (list && list.length > 0) {
            this.selectData['getAccounts'] = list
          }
        })
      }
    },
    created () {
      this.getQueryDicByIdList ()
      if (this.identification == '1') this.relevance.isShowDetails = true
    },
    mounted () {
       getGoadd().then(res=>{
          exceptUserAccount ().then(res =>{
            this.bankAccountsArr = res;
            for (let i = 0; i < this.bankAccountsArr.length; i++) {
                let obj = {
                  value: this.bankAccountsArr[i].id,
                  label: this.bankAccountsArr[i].name,
                }
                // this.bankAccountsData.push(obj)
              // this.selectData['getbankAccounts'].push(obj)
              this.selectData['getbankAccounts'] = res;
            }
          }).finally(res=> {
            this.getJsonData();
          })
          let accountsData = res.accounts;
          let vouchersData = res.vouchers;
          for (let i = 0; i < vouchersData.length; i++) {
              let obj = {
                value: vouchersData[i].name,
                label: vouchersData[i].name,
              }
              // this.vouchersData.push(obj)
            // this.selectData['getVouchers'].push(obj)
            this.selectData['getVouchers'] = res.vouchers;
          }
      })
    },
    computed: {
      newData() {
        let newData = {};
        this.modelData.recs = this.modelData.recs ? this.modelData.recs : [];
        for (let i = 0; i < this.bankAccountsArr.length; i++) {
          for (let k = 0; k < this.modelData.recs.length; k++) {
            if (this.bankAccountsArr[i].name === this.modelData.recs[k].line1 && this.bankAccountsArr[i].openingBank === this.modelData.recs[k].line2 && this.bankAccountsArr[i].account === this.modelData.recs[k].line3 ) {
              this.modelData.recs[k].line1 = this.bankAccountsArr[i].id;
            }
          }
        }
        newData = this.modelData;
        this.upLoadFileDefaultList = [];
        this.modelData.fileList = this.modelData.fileList ? this.modelData.fileList : [];
        for (let i = 0; i < this.modelData.fileList.length; i++) {
            let obj ={
              status : 'finished',
              response : {
                  url : this.modelData.fileList[i].url,
                  name : this.modelData.fileList[i].name,
                  size : this.modelData.fileList[i].size
              },
            };
          this.upLoadFileDefaultList.push(obj)
        }
        newData.receivableAmountBig = util.convertCurrency(newData.recmoney);
        newData.paymentAmountBig = util.convertCurrency(newData.paymoney);
        newData.paymoney = (newData.paymoney - 0).toFixed(2);
        newData.recmoney = (newData.recmoney - 0).toFixed(2);
        return newData;
      }
    },
  }
</script>

<style lang='scss'>
  .addpay_Dialog input::-webkit-outer-spin-button,
  .addpay_Dialog input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  .addpay_Dialog input[type="number"]{
    -moz-appearance: textfield;
  }
  .addpay_Dialog {
    .el-card{
      min-height: 100%;
    }
    // .el-card__header{
    //     border-bottom: 0px;
    //     padding: 0;
    //     .clearfix{
    //       button {
    //         padding: 10px 10px !important;
    //         font-size: 20px;
    //         color: #000;
    //         &:hover{
    //           color: #409EFF;
    //         }
    //       }
    //     }
    // }
  }
  .add-customer-content___upload {
    padding: 0 20px;
    label {
      font-size: 14px;

    }
  }
</style>