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
                <!-- <div class="add-customer-content___upload">
                    <label for="male">
                        <upload id="male" :isShowUpload="false"  ref="upLoad" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList"></upload>
                    </label>
                </div> -->
                <bottomInformation :values="values" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation"></bottomInformation>
                <!-- <el-form :model="msgForm" :rules="msgRules" ref="msgForm" label-width="100px" style="margin-top:10px">
                  <el-form-item label="审批意见" prop="paymessage">
                    <el-input
                      type="textarea"
                      :rows="3"
                      placeholder="请输入审批意见"
                      v-model="msgForm.paymessage">
                    </el-input>
                  </el-form-item>
                </el-form> -->
                <el-row>
                  <el-col :span="24" style="text-align:center" class="d2-mt-20">
                    <qqt-look-voucher :data="queryData" ></qqt-look-voucher>
                      <el-button size="small" type="primary"  @click="visible = true, title = '审批意见', consent['flag'] = '1'">同意</el-button>
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
  import { qqtFlowDiagram,qqtFlowTabs,upload,qqtConsent,qqtLookVoucher,qqtVoucher, associatedDocuments} from '../../../../../components/qqt-subassembly'
  import { formGetJson } from '../../../../../api/system/fromManagement/index'
  import { goAdd,queryById,complete} from '../../../../../api/financialManagement/nonbusinessIncomeRegister';
  import util from '@/libs/util.js'
  import { getDetails,findReverseRoute,careOf} from '../../../../../api/approval/common';
  import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
  import userModules from '../../../../systemManagement/processDefinition/processModules/userModules';
  import { mapActions } from 'vuex'
  export default {
    components: {
        qqtTable,
        qqtFlowDiagram,
        qqtFlowTabs,
        userModules,
        upload,
        qqtConsent,
        qqtLookVoucher,
        qqtVoucher,
        bottomInformation,
        associatedDocuments
    },
    data() {
      let that = this;
      return {
        detailMsg:'',
        consent: {},
        visible: false,
        isReject: false,
        isTurnManage: false,
        tabShow:false,
        upLoadFileDefaultList:[],
        isShow:false,
        procInstId: '',
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
        paywaysData: [],
        remote: {
          getPaysData(resolve) {
                resolve(JSON.parse(JSON.stringify(that.paysData)));
          },
          getRecsData(resolve) {
              resolve(JSON.parse(JSON.stringify(that.recsData)));
          },
          getPaywaysData(resolve) {
              resolve(JSON.parse(JSON.stringify(that.paywaysData)));
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
              jsonData = this.consent;
              jsonData.id = this.queryData.id;
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
        formGetJson({
            code: 'nonbusinessIncomeRegisterZJL'
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
        this.$refs.msgForm.validate((valid) => {
          if (valid) {
            let jsonData = {};
            jsonData.flag = '1';
            jsonData.id = this.queryData.id;
            jsonData.completeTask = {
              "taskId":this.taskId,
              "msg":this.msgForm.paymessage
            };
            complete(jsonData).then((res)=>{
              if (res.success) {
                this.$message.success('同意成功')
                  let tagName = this.$route.path;
                      this.close ({ tagName })
                      this.$router.go(-1);
              }
            })
          }
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
                  msg:this.form.paymessage,
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
        this.$refs.msgForm.validate((valid) => {
          if (valid) {
            util.confirm('此操作将作废该条数据，是否继续?').then(res => {
               if (res) {
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
               }
            })
          }
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
    },
    created () {

    },
    mounted () {
        goAdd ().then(res=>{
          // 获取下拉框值
          this.paysData = [];
          this.recsData = [];
          this.paywaysData = [];
          this.paysArr = res.pays;
          this.recsArr = res.recs;
          for (let i = 0; i < res.pays.length; i++) {
            let obj = {
              value: res.pays[i].id,
              label: res.pays[i].name,
            }   
            this.paysData.push(obj)       
          }
          for (let i = 0; i < res.recs.length; i++) {
            let obj = {
              value: res.recs[i].id,
              label: res.recs[i].name,
            }   
            this.recsData.push(obj)       
          }
          for (let i = 0; i < res.payways.length; i++) {
            let obj = {
              value: res.payways[i].name,
              label: res.payways[i].name,
            }   
            this.paywaysData.push(obj)       
          }
        }).finally(()=>{
              this.getJson();
              // 判断是否为跳转页面
              if (!this.$route.params.detailData) {
                  this.$router.go(-1);
                return
              }
              // 获取路由传参
              let pushData = JSON.parse(this.$route.params.detailData);
              console.log(pushData)
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
              // 通过路由传参获取数据行所有信息
              queryById({id:pushData.processVariables.relevancyId}).then(res=>{
                res.paymoney = res.paymoney.toString();
                this.values = res;
                this.queryData = JSON.parse(JSON.stringify(res));
                // 判断下拉框的值 为了避免出现相同名称的户名 下拉框的值存的是id 通过户名、银行信息和账号信息获取账户信息
                for (let i = 0; i < this.paysArr.length; i++) {
                    if (this.paysArr[i].name === res.payname && this.paysArr[i].openingBank === res.paybank && this.paysArr[i].account === res.payaccount) {
                      res.payname = this.paysArr[i].id;
                    }
                }
                for (let i = 0; i < this.recsArr.length; i++) {
                    if (this.recsArr[i].name === res.recname && this.recsArr[i].openingBank === res.recbank && this.recsArr[i].account === res.recaccount) {
                      res.recname = this.recsArr[i].id;
                    }
                }
                // this.values.paymoney = this.values.paymoney .toFixed(2) + '元';
                this.upLoadFileDefaultList = [];
                // 附件赋值
                this.queryData.fileList =  this.queryData.fileList || [];
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
              })
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

</style>