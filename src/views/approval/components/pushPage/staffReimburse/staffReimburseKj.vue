<template>
    <d2-container class="staffReimburseKj">
      <el-card :body-style="{ padding: '20px' }" style="min-height:100%">
        <qqt-flow-tabs v-if="tabShow" :procInstId="procInstId" :pdfId="pdfId">
          <template slot="content">
                <fm-generate-form
                :data="jsonData"
                :value="values"
                :remote="remote"
                :transform="transform"
                @on-change="onChange"
                ref="generateForm">
                  <template slot="employReimVices">
                    <add-table  ref="employReimVices" :isShowDetails="transform.isShowDetails" :data="values.employReimVices" >
                    </add-table>
                  </template>
                  <template slot="compay">
                    <add-pays-table ref="addPaysTable" :isShowDetails="transform.isShowDetails" @selectChange="selectChange" :selectData="paynameArr" :data="values.compay"></add-pays-table>
                  </template>
                  <template slot="relevance">
                    <associated-documents ref="relevance" size="small" :transform="transformBottom" :relevance="values" />
                  </template>
                </fm-generate-form>
                <div class="add-customer-content___upload">
                    <label for="male">
                        <upload id="male" :dataId="values.id"  :isShowUpload="false" ref="upLoad" :propList="upLoadFileDefaultList"></upload>
                    </label>
                </div>
                <bottomInformation :values="values" fieldTitle="报销" timeTitle="申请" :isShowAccessory="false" :transform="transformBottom" ref="bottomInformation"></bottomInformation>
                <el-row>
                  <el-col :span="24" style="text-align:center" class="d2-mt-20">
                      <qqt-voucher ref="voucher"  :voucherShow="voucherShow" v-if="isKj" @dialogComfirm="dialogComfirm" @dialogCancel="voucherShow=false" :data="queryData" ></qqt-voucher>
                      <qqt-look-voucher v-else ref="voucherCn" :data="queryData" ></qqt-look-voucher>

                      <el-button size="small" type="primary"  @click="consentFun(), title = '审批意见', consent['flag'] = '1'">同意</el-button>
                      <el-button size="small" type="warning" v-if="btnList.indexOf('1') != -1" @click="visible = isTurnManage = true, consent['flag'] = '0',title = '转办意见'">转办</el-button>
                      <el-button size="small" type="success" v-if="btnList.indexOf('2') != -1" plain @click="visible = isReject = true, consent['flag'] = '2', title = '驳回意见'" >驳回</el-button>
                      <el-button size="small" type="info" v-if="btnList.indexOf('3') != -1" @click="visible = true, consent['flag'] = '3', title = '作废意见'" >作废</el-button>

                      <!-- <el-button size="small" type="primary"  @click="consentFun">同意</el-button>
                      <el-button size="small" type="warning" v-if="btnList.indexOf('1') != -1" @click="turnToFun">转办</el-button>
                      <el-button size="small" type="success" v-if="btnList.indexOf('2') != -1" plain @click="returnBtn">驳回</el-button>
                      <el-button size="small" type="info" v-if="btnList.indexOf('3') != -1" @click="invalidBtn">作废</el-button> -->
                      <el-button size="small" type="primary" plain @click="cancelBtn">取消</el-button>
                  </el-col>
                </el-row>
          </template>
        </qqt-flow-tabs>
      </el-card>
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
      <qqt-consent :msg="detailMsg" :dialogVisible="visible" :taskId="$route.params.taskId || ''" :type="consent['flag']" :isTurnManage="isTurnManage" :isReject="isReject" @close="consentBorrowingApply" />
    </d2-container>
</template>

<script>
  import qqtTable from '../../../../../components/qqt-subassembly/qqt-table/qqt-table';
  import { qqtFlowDiagram,qqtFlowTabs,upload,qqtConsent,qqtVoucher,qqtLookVoucher,associatedDocuments} from '../../../../../components/qqt-subassembly'
  import { formGetJson } from '../../../../../api/system/fromManagement/index'
  import { goBank,queryById,complete} from '../../../../../api/financialManagement/staffReimburse';
  import util from '@/libs/util.js'
  import { getDetails,findReverseRoute,careOf} from '../../../../../api/approval/common';
  import userModules from '../../../../systemManagement/processDefinition/processModules/userModules';
  import { mapActions } from 'vuex';
  import { CITYJSON } from '@/enum/CTIYS'
  import addPaysTable from '../components/payAddTable';
  import addTable from './addTable';
  import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'

  export default {
    components: {
        qqtTable,
        qqtFlowDiagram,
        qqtFlowTabs,
        userModules,
        upload,
        qqtConsent,
        addPaysTable,
        addTable,
        qqtVoucher,
        qqtLookVoucher,
        bottomInformation,
        associatedDocuments
    },
    data() {
      let that = this;
      return {
        voucherShow: false,
        detailMsg:'',
        paynameArr: [],
        consentData: [],
        consent: {},
        visible: false,
        isReject: false,
        isTurnManage: false,
        tabShow:false,
        upLoadFileDefaultList:[],
        isShow:false,
        procInstId: '',
        isKj: true,
        rejectShow: false,
        pdfId: '',
        btnList: '',
        payValues:{
          clcu: [],
          totalmoney: '',
        },
        returnList: [],
        department: [],
        user: [],
        fileList: [],
        queryData: {},
        paysData: [],
        recsData: [],
        paysArr: [],
        paywaysData: [],
        transform: {
          isShowDetails: false
        },
        transformBottom: {
          isShowDetails: true
        },
        remote: {
          getAdress (resolve) {
            resolve(CITYJSON)
          },
          payName (resolve) {
            resolve(that.paysData)
          },
          payways (resolve) {
            resolve(that.paywaysData)
          },
        },
        values:{
            totalmoney3: 0,
            realmoney: 0
        },
        accountsData: [],
        bankAccountsData: [],
        vouchersData: [],
        jsonData: {},
        pushData: {},
        pushName:'',
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
        msgForm: {
          paymessage: '',
        },
        msgRules: {
          paymessage: [
            { required: true, message: '请选择审批意见', trigger:  ['change','blur']  }
          ],
        }
      }
    },
    methods: {
      ...mapActions('d2admin/page', [
          'close',
      ]),
      getJson(code) {
        formGetJson({
            code: code
        }).then(res => {
            this.jsonData = JSON.parse(res)
        }).catch(res => {
        }).finally (res=>{
          let element = document.getElementsByClassName("form-table")[0];
          let payTable = document.getElementsByClassName("form-table")[1];
          // if (this.isKj) {
          //   element.removeChild(element.children[1])
          // }
        })
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
              if (this.pushName === 'staffReimburseKj') {
                if (this.consent.flag === '1') {
                  jsonData = Object.assign(this.consentData, this.consent);
                } else {
                  jsonData = this.consent;
                }
              } else {
                jsonData = this.consent;
              }
              jsonData.id = this.queryData.id;
              complete (jsonData).then (res => {
                  if (this.pushName === 'staffReimburseCN') {
                      if (item.type == '1') {
                          this.$refs.voucherCn.CNEdit();
                      }
                  }
                  if (res.code === 200) {
                      this.$message.success (res.message);
                      let tagName = this.$route.path;
                      this.close ({ tagName });
                      this.$router.go(-1);
                  }
              })
          }
      },
      // 账户信息
      selectChange () {
        goBank ().then(res =>{
            this.paynameArr = res.bankAccounts;
        })
      },
      dialogComfirm () {
        this.$refs.voucher.comfirmData().then(res=> {
            this.voucherShow = false;
            this.visible = true;
        })
      },
      // 同意
      consentFun () {
        if (this.pushName === 'staffReimburseKj') {
          this.$refs.generateForm.getData().then(data => {
            this.$refs.employReimVices.getData().then(employData => {
              this.$refs.addPaysTable.getData().then(addTableData => {
                data.compay = addTableData.tableData;
                data.employReimVices = employData.employReimVices;
                data.paymoney = addTableData.totalMoney;
                data.realmoney = employData.realmoney;
                for (let i = 0; i < data.compay.length; i++) {
                    data.compay[i].identity = 'pay'
                  }
                if (data.paymoney- 0 !== data.realmoney- 0) {
                  this.$message.error('实报金额与支付总金额不一致，请确认')
                  return
                }
                this.consentData = {
                  id:this.queryData.id,
                  paymoney:data.paymoney,
                  compay: data.compay,
                  employReimVices: data.employReimVices,
                  realmoney: data.realmoney,
                  totalmoney: data.totalmoney
                };
                this.visible = true;
                // this.voucherShow = true;
              })
            })
          })
        } else {
          this.visible = true;
        }

      },
      queryNameByIdCompany (id) {
        let data = {};
        for (let i = 0; i < this.paysArr.length; i++) {
          if (id === this.paysArr[i].id) {
            data = this.paysArr[i];
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
                  msg:this.form.paymessage,
                };
                complete(jsonData).then((res)=>{
                  if (res.success) {
            		    this.rejectShow = false;
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
        this.$prompt('请输入作废意见', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputType: 'textarea',
            inputPattern: /^\S/,
            inputErrorMessage: '请输入作废意见'
          }).then(({ value }) => {
            let jsonData = {
              flag:'3',
              id:this.queryData.id
            };
            jsonData.completeTask = {
              "taskId":this.taskId,
              "msg":this.msgForm.paymessage
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
      upLoadFileCallBack (item) {
          this.fileList = item
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
          let tagName = this.$route.path;
          this.close ({ tagName })
          this.$router.go(-1);
      },
      onChange (name, value, data) {
        if (name === 'employReimVices') {
          let total = 0;
          if (this.pushName === 'staffReimburseKj') {
             for (let i = 0; i < value.length; i++) {
                if (value[i].line10 - 0 > value[i].line8 - 0) {
                  value[i].line10 = value[i].line8
                }
                value[i].line12 = (Number.parseFloat(value[i].line8) - (Number.parseFloat((value[i].line10)) || 0));
                total += value[i].line12
              }
              this.values.totalmoney3  = JSON.parse( JSON.stringify( (this.values.totalmoney - total).toFixed(2) ) )

              this.values.realmoney = JSON.parse( JSON.stringify(total.toFixed(2)) );
              this.values.big = util.convertCurrency( this.values.realmoney);
          } else {
              let totalmoney3 = 0;
              for (let i = 0; i < value.length; i++) {
                  if (value[i].line10 - 0 > 0) {
                    totalmoney3 += Number(value[i].line10);
                  }
                  value[i].line10 = (Number(value[i].line10)).toFixed(2);
                  value[i].line12 = (Number(value[i].line12)).toFixed(2);
              }
              this.values.totalmoney3  = totalmoney3.toString()
          }
        }
        this.values[name] = value;
        if (name === 'compay') {
          let total = 0;
          if (this.isKj) {
            for (let i = 0; i < value.length; i++) {
              if (value[i].line1) {
                let bankNewArr = this.queryNameByIdCompany(value[i].line1);
                this.values.compay[i].line2 = bankNewArr.openingBank;
                this.values.compay[i].line3 = bankNewArr.account;
              }
              total += (this.values.compay[i].line4-0)
              this.values.paymoney = total.toString();
              this.values.payBig = util.convertCurrency(this.values.paymoney);
            }
          } else {
             for (let i = 0; i < value.length; i++) {
                value[i].line4 = (Number(value[i].line4)).toFixed(2);
            }
          }
        }
      }
    },
    created () {
    },
    mounted () {
        goBank ().then(res=>{
          // 获取下拉框值
          this.paysData = [];
          this.paywaysData = [];
          this.paysArr = JSON.parse(JSON.stringify(res.bankAccounts));
          for (let i = 0; i < res.bankAccounts.length; i++) {
            let obj = {
              value: res.bankAccounts[i].id,
              label: res.bankAccounts[i].name,
            }
            this.paysData.push(obj)
          }
          for (let i = 0; i < res.accounts.length; i++) {
            let obj = {
              value: res.accounts[i].name,
              label: res.accounts[i].name,
            }
            this.paywaysData.push(obj)
          }
        }).finally(()=>{
              // 判断是否为跳转页面
              if (!this.$route.params.detailData) {
                this.$router.go(-1);
                return
              }
              // 获取路由传参
              let pushData = JSON.parse(this.$route.params.detailData);
              this.pushData = pushData;
              this.pushName = pushData.processVariables.formKey;
              if (pushData.processVariables.formKey === 'staffReimburseKj') {
                  this.isKj = true;
                  this.transform.isShowDetails = false;
                  this.getJson('staffReimburseKj');
              } else if (pushData.processVariables.formKey === 'staffReimburseZJL') {
                  this.isKj = false;
                  this.transform.isShowDetails = true;
                  this.getJson('staffReimburseZJL');
              } else {
                  this.isKj = false;
                  this.transform.isShowDetails = true;
                  this.getJson('staffReimburseCN');
              }
              this.taskId = pushData.taskId;
              this.procInstId = pushData.procInstId;
              this.pdfId = pushData.procDefId;
              this.tabShow = true;
              // 判断按钮权限
              if (pushData.activityId) {
                getDetails(pushData.procDefId + '/' +pushData.activityId).then(res=>{
                  this.btnList = res.operation;
                  this.form.rejectVal = res.sendBackNode;
                  this.detailMsg = res.msg;
                })
                findReverseRoute(pushData.procDefId + '/' +pushData.activityId).then(res=>{
                  this.returnList = res;
                })
              }
              // 通过路由传参获取数据行所有信息
              queryById({id:pushData.processVariables.relevancyId}).then(res=>{
              console.log(JSON.parse(JSON.stringify(res)))
              let resData = JSON.parse(JSON.stringify(res));
              this.values = resData;
              if (this.pushName === 'staffReimburseZJL') {
                this.values.totalmoney = Number(this.values.totalmoney).toFixed(2);
                this.values.realmoney = Number(this.values.realmoney).toFixed(2)
                this.values.big = util.convertCurrency(this.values.totalmoney);
              } else if (this.pushName === 'staffReimburseCN') {
                this.values.totalmoney = Number(this.values.totalmoney).toFixed(2);
                this.values.realmoney = Number(this.values.realmoney).toFixed(2)
                this.values.big = util.convertCurrency(this.values.realmoney);
              }
              this.queryData = JSON.parse(JSON.stringify(res));
              // 判断下拉框的值 为了避免出现相同名称的户名 下拉框的值存的是id 通过户名、银行信息和账号信息获取账户信息

              this.upLoadFileDefaultList = [];
              // 附件赋值
              this.queryData.fileList =  this.queryData.fileList || [];
              for (let i = 0; i < this.queryData.fileList.length; i++) {
                  let obj ={
                    status : 'finished',
                    response : {
                        url : this.queryData.fileList[i].url,
                        name : this.queryData.fileList[i].name,
                        size : this.queryData.fileList[i].size
                    },
                  };
                this.upLoadFileDefaultList.push(obj)
              }
            })
        })

    },
  }
</script>

<style lang="scss" >
  .staffReimburseKj input::-webkit-outer-spin-button,
  .staffReimburseKj input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  .staffReimburseKj input[type="number"]{
    -moz-appearance: textfield;
  }
</style>
