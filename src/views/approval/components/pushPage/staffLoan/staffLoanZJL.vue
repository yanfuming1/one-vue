<template>
  <d2-container class="loanDetail">
    <el-card class="box-card">
      <qqt-flow-tabs style="min-height:100%" v-if="tabShow" :procInstId="procInstId" :pdfId="pdfId">
        <template slot="content">
            <el-form label-width="120px" :model="addModel" ref="formData" :rules="rules">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="借款金额：" prop="borrowmoney">
                    <el-input
                      disabled
                      v-model="addModel.borrowmoney"
                      @input="moneyChange"
                      type="number"
                      placeholder="请输入借款金额"
                    >
                      <template slot="append">元</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="大写：" prop="borrowingBalanceBig">
                    <el-input v-model="addModel.borrowingBalanceBig" placeholder="零元整" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="借款事由：" prop="borrowreason">
                    <el-input
                      disabled
                      type="textarea"
                      :rows="4"
                      placeholder="请输入内容"
                      v-model="addModel.borrowreason"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <title-line>收款人账户信息</title-line>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="户名：" prop="accountname">
                    <el-select
                      disabled
                      v-model="addModel.accountname"
                      placeholder="请选择户名"
                      style="width:100%"
                      @change="selectChange"
                    >
                      <el-option
                        v-for="item in accountnameData"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="开户行：" prop="bank">
                    <el-input v-model="addModel.bank" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="账号：" prop="accountnumber">
                    <el-input v-model="addModel.accountnumber" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" v-if="addModel.gathermoney">
                  <el-form-item label="收款金额：" prop="gathermoney">
                    <el-input v-model="addModel.gathermoney" disabled type="number" placeholder="请输入收款金额">
                      <template slot="append">元</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <associated-documents ref="relevance" size="small" :transform ="transform"  :relevance="addModel" />
              <div class="add-customer-content___upload">
                  <label for="male">
                      <title-line>附件</title-line>
                      <upload id="male" :isShowUpload="false"  ref="upLoad" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList"></upload>
                  </label>
              </div>
              <title-line v-if="addModel.gathermoney">付款信息</title-line>
              <table  v-if="addModel.gathermoney" cellspacing="0" cellpadding="0" border="0" class="payTable">
                <thead>
                  <th style="width:10%">序号</th>
                  <th style="width:22.5%">户名</th>
                  <th style="width:22.5%">开户行</th>
                  <th style="width:22.5%">账号</th>
                  <th style="width:22.5%">付款金额</th>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>
                      <el-input readonly v-model="addModel.payname">
                      </el-input>
                    </td>
                    <td>
                      <el-input readonly v-model="addModel.paybank"></el-input>
                    </td>
                    <td>
                      <el-input readonly v-model="addModel.payaccount">
                        <template slot="append">收藏</template>
                      </el-input>
                    </td>
                    <td>
                      <el-input
                        type="number"
                        readonly
                        @input="payMoneyChange"
                        v-model="addModel.paymoney"
                      >
                        <template slot="append">元</template>
                      </el-input>
                    </td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>
                      <el-input readonly v-model="addModel.payname1">
                      </el-input>
                    </td>
                    <td>
                      <el-input readonly v-model="addModel.paybank1"></el-input>
                    </td>
                    <td>
                      <el-input readonly v-model="addModel.payaccount1">
                        <template slot="append">收藏</template>
                      </el-input>
                    </td>
                    <td>
                      <el-input
                        type="number"
                        readonly
                        @input="payMoneyChange1"
                        v-model="addModel.paymoney1"
                      >
                        <template slot="append">元</template>
                      </el-input>
                    </td>
                  </tr>
                  <tr>
                    <td>合计</td>
                    <td colspan="3">
                      <el-input v-model="addModel.big" readonly placeholder="零元整"></el-input>
                    </td>
                    <td>
                      <el-input v-model="addModel.total" readonly placeholder="0.00"></el-input>
                    </td>
                  </tr>
                </tbody>
              </table>
              <el-row>
                <bottomInformation :values="detailData" :fieldTitle="'借款'" :timeTitle="'申请'" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
              </el-row>
            </el-form>
            <el-row>
              <el-col :span="24" style="text-align:center" class="d2-mt-20">
                <!-- <qqt-look-voucher :data="detailData" ></qqt-look-voucher> -->
                <el-button size="small" type="primary" @click="visible = true, title = '审批意见', values['flag'] = '1'">同意</el-button>
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
                 @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'"
                >驳回</el-button>
                <el-button
                  size="small"
                  type="info"
                  v-if="btnList.indexOf('3') != -1"
                  @click="visible = true, values['flag'] = '3', title = '作废意见'"
                >作废</el-button>
                <el-button size="small" type="primary" plain @click="cancelBtn">取消</el-button>
              </el-col>
            </el-row>
        </template>
      </qqt-flow-tabs>
    </el-card>
    <el-dialog v-dialogDrag title="银行账号信息" :visible.sync="bankShow" width="50%">
      <el-form :inline="true" class="demo-form-inline" ref="form" size="mini">
        <el-form-item label>
          <el-input
            v-model="bankSearch.name"
            prefix-icon="el-icon-search"
            placeholder="请输入户名"
            style="width: 200px;"
            :clearable="true"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dataSearch()">搜索</el-button>
        </el-form-item>
      </el-form>
      <template>
        <qqt-table
          :data="tableData"
          :rowHeader="rowHeader"
          :option="tableOption"
          :pageShow="false"
          :isShowSelection="false"
          @currentChange="currentChange"
          @rowDblclick="rowDblclick"
        ></qqt-table>
        <!-- @selectionChange="selectChange" -->
      </template>
      <span slot="footer">
        <el-button type="primary" @click="bankOk">确 定</el-button>
        <el-button @click="bankCancel">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog v-dialogDrag title="驳回" :visible.sync="rejectShow" width="30%">
      <!-- 驳回节点：
      <el-select v-model="rejectVal" placeholder>
        <el-option
          v-for="item in returnList"
          :key="item.activityId"
          :label="item.name"
          :value="item.activityId"
        ></el-option>
      </el-select> -->
       <el-form :model="returnForm.data" :rules="returnForm.rules" ref="returnForm" label-width="100px">
          <el-form-item label="驳回节点：" prop="rejectVal">
            <el-select v-model="returnForm.data.rejectVal"  placeholder="" >
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
              v-model="returnForm.data.paymessage">
            </el-input>
          </el-form-item>
        </el-form>
      <span slot="footer">
        <el-button type="primary" @click="rejectOk">确 定</el-button>
        <el-button @click="rejectCancel">取 消</el-button>
      </span>
    </el-dialog>
    <user-modules
      :showDialog="isShow"
      :userIds="user"
      :department="department"
      @clearUserPage="clearUserPage"
      @closeFun="isShow = false"
    ></user-modules>
    <qqt-consent :msg="detailMsg" :dialogVisible="visible" :taskId="$route.params.taskId || ''" :type="values['flag']" :isTurnManage="isTurnManage" :isReject="isReject" @close="consentBorrowingApply" />
  </d2-container>
</template>

<script>
import titleLine from "../../titleLine/titleLine";
import qqtTable from '../../../../../components/qqt-subassembly/qqt-table/qqt-table';
import {qqtFlowDiagram,qqtFlowTabs,upload,qqtConsent,qqtLookVoucher,associatedDocuments} from "../../../../../components/qqt-subassembly";
import {goAdd,getByAccountTypeListAll,activitiPage,completeFun,queryById} from "../../../../../api/financialManagement/staffLoan";
import {getDetails,findReverseRoute,careOf} from "../../../../../api/approval/common";
import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
import userModules from "../../../../systemManagement/processDefinition/processModules/userModules";
import util from "@/libs/util.js";
import { mapActions } from 'vuex'
export default {
  name: "staffLoanCNPage",
  components: {
    titleLine,
    qqtTable,
    qqtFlowDiagram,
    qqtFlowTabs,
    userModules,
    upload,
    qqtConsent,
    qqtLookVoucher,
    bottomInformation,
    associatedDocuments
  },
  props: {
     pushLogData: {
      type: Object,
      default: () =>{
        return {}
      }
    },
  },
  data() {
    let that = this;
    return {
      detailMsg:'',
      values: {},
      visible: false,
      isReject: false,
      isTurnManage: false,
      procInstId: "",
      pdfId: "",
      tabShow: false,
      detailData:{},
      rejectVal: "",
      rejectShow: false,
      accountnameArr: [],
      upLoadFileDefaultList:[],
      accountnameData: [],
      addModel: {
        borrowmoney: "",
        borrowingBalanceBig: "",
        borrowreason: "",
        accountname: "",
        bank: "",
        accountnumber: "",
        gathermoney: "",
        payname: "",
        big: "",
        projectName: '',
        projectCode: '',
        projectType: '',
        projectId: '',
        total: "",
        id: "",
        paybank: "",
        payaccount: "",
        paymoney: "",
        payname1: "",
        paybank1: "",
        payaccount1: "",
        paymoney1: "",
        msg: ""
      },
      rules: {
        borrowmoney: [
          {
            required: true,
            message: "请输入借款金额",
            trigger: ["change", "blur"]
          }
        ],
        accountname: [
          { required: true, message: "请输入户名", trigger: ["change", "blur"] }
        ],
        msg: [
          {
            required: true,
            message: "审批意见不能为空",
            trigger: ["change", "blur"]
          }
        ]
      },
      form: {
        payname: "",
        big: ""
      },
      returnForm: {
        data:{
          rejectVal: '',
          paymessage: '',
        },
        rules:{
          rejectVal: [
            { required: true, message: '请选择驳回节点', trigger: ['change','blur'] }
          ],
          paymessage: [
            { required: true, message: '请选择驳回理由', trigger:  ['change','blur']  }
          ],
        }
      },
      bankShow: false,
      bankValue: "",
      tableData: {},
      clickRow: {},
      btnList: "",
      rowHeader: [
        {
          prop: "name",
          label: "户名",
          isShow: true
        },
        {
          prop: "openingBank",
          label: "开户行",
          isShow: true
        },
        {
          prop: "account",
          label: "账号",
          isShow: true
        }
      ],
      tableOption: {
        border: false,
        highlight: true
      },
      bankName: "",
      bankSearch: {
        accountType: "9",
        name: ""
      },
      newValue: {},
      returnList: [],
      taskId: "",
      // 穿梭框
      isShow: false,
      user: [],
      department: [],
      pushData: {},
      transform: {
        isShowDetails: true,
      },
    };
  },
  methods: {
    ...mapActions('d2admin/page', [
        'close',
    ]),
    // 转办
    turnToFun() {
        this.isShow = true;
    },
    upLoadFileCallBack () {

    },
    // 作废
    invalidFun() {
      this.$prompt('请输入作废理由', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPattern: /^\S/,
        inputErrorMessage: '请输入作废理由'
      }).then(({ value }) => {
        let jsonData = {};
        jsonData.flag = '3';
        jsonData.id = this.addModel.id;
        jsonData.completeTask = {
          "taskId":this.taskId,
          "msg":value
        };
        completeFun(jsonData).then(res => {
          if (res.success) {
            this.$message.success("作废成功");
            this.$router.go(-1);
          }
        });
      })
    },
    // 同意
    // consentFun() {
    //   this.$prompt('请输入审批理由', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     inputType: 'textarea',
    //     inputPattern: /^\S/,
    //     inputErrorMessage: '请输入审批理由'
    //   }).then(({ value }) => {
    //     let jsonData = {};
    //     jsonData.flag = '1';
    //     jsonData.id = this.addModel.id;
    //     jsonData.completeTask = {
    //       "taskId":this.taskId,
    //       "msg":value
    //     };
    //     completeFun(jsonData).then(res => {
    //       if (res.success) {
    //         this.$message.success("同意成功");
    //         this.$router.go(-1);
    //       }
    //     });
    //   })
    // },
    // 取消
    cancelBtn() {
      // this.$router.go(-1);
      let tagName = this.$route.path;
      this.close ({ tagName })
      this.$router.go(-1);
    },
    // 借款金额改变值
    moneyChange(value) {
      this.addModel.borrowingBalanceBig = util.convertCurrency(value);
    },
    // 收款人账户信息切换
    selectChange(value) {
      let obj = this.queryNameByIdCompany(value);
      this.addModel.bank = obj.openingBank;
      this.addModel.accountnumber = obj.account;
    },
    queryNameByIdCompany(id) {
      let data = {};
      for (let i = 0; i < this.accountnameArr.length; i++) {
        if (id === this.accountnameArr[i].id) {
          data = this.accountnameArr[i];
        }
      }
      return data;
    },
    // 点击查找
    payClickFun(name) {
      this.bankShow = true;
      this.clickRow = {};
      this.bankName = name;
      getByAccountTypeListAll(this.bankSearch).then(res => {
        this.tableData = {
          current: 1,
          pages: 1,
          records: res,
          size: 10,
          total: res.length
        };
      });
    },
    payMoneyChange(value) {
      this.addModel.total = value - 0 + (this.addModel.paymoney1 - 0);
      this.addModel.total = this.addModel.total.toFixed(2);
      this.addModel.big = util.convertCurrency(this.addModel.total);
    },
    payMoneyChange1(value) {
      this.addModel.total = value - 0 + (this.addModel.paymoney - 0);
      this.addModel.total = this.addModel.total.toFixed(2);
      this.addModel.big = util.convertCurrency(this.addModel.total);
    },
    dataSearch() {
      getByAccountTypeListAll(this.bankSearch).then(res => {
        this.tableData = {
          current: 1,
          pages: 1,
          records: res,
          size: 10,
          total: res.length
        };
      });
    },
    currentChange(row) {
      this.clickRow = row;
    },
    rowDblclick(row) {
      if (this.bankName === "payname") {
        this.addModel.payname = row.name;
        this.addModel.paybank = row.openingBank;
        this.addModel.payaccount = row.account;
      } else if (this.bankName === "payname1") {
        this.addModel.payname1 = row.name;
        this.addModel.paybank1 = row.openingBank;
        this.addModel.payaccount1 = row.account;
      }
      this.bankShow = false;
    },
    bankCancel() {
      this.bankShow = false;
    },
    bankOk() {
      if (JSON.stringify(this.clickRow) == "{}") {
        this.$message.error("请选择银行账户信息");
      } else {
        if (this.bankName === "payname") {
          this.addModel.payname = this.clickRow.name;
          this.addModel.paybank = this.clickRow.openingBank;
          this.addModel.payaccount = this.clickRow.account;
        } else if (this.bankName === "payname1") {
          this.addModel.payname1 = this.clickRow.name;
          this.addModel.paybank1 = this.clickRow.openingBank;
          this.addModel.payaccount1 = this.clickRow.account;
        }
        this.bankShow = false;
      }
    },
    // 驳回
    returnBtn() {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          this.rejectShow = true;
        }
      });
    },
    rejectCancel() {
      this.rejectShow = false;
    },
    rejectOk() {
      this.$refs['returnForm'].validate((valid) => {
          if (valid) {
            let jsonData = {};
            jsonData.id = this.addModel.id;
            jsonData.flag = "2";
            jsonData.completeTask = {
              taskId: this.taskId,
              msg: this.returnForm.data.paymessage,
              activityId: this.returnForm.data.rejectVal
            };
            completeFun(jsonData).then(res => {
              if (res.success) {
                this.$message.success("驳回成功");
                this.$router.go(-1);
                this.rejectShow = false;
              }
            });
          }
      })
    },
    indexMethod(index) {
      return index + 1;
    },
    clearUserPage(item) {
      if (item.length > 0) {
        this.isShow = !this.isShow;
        let data = [];
        for (let i = 0; i < item.length; i++) {
          let str = item[i].id;
          data.push(str);
        }
        const h = this.$createElement;
        this.$prompt('请输入转办理由', '提示', {
          confirmButtonText: '确定',
          inputType: 'textarea',
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
                  let tagName = this.$route.path;
                  this.close ({ tagName })
                  this.$router.go(-1);
              }
            })
        })
      } else {
        this.$message.error("请选择要转办的部门或人员");
      }
    },

    // 指定节点
     consentBorrowingApply (item = '', boolean = false) {
        this.visible = this.isTurnManage = this.isReject = false
        if (boolean) {
            this.cancelBtn ()
            return
        }
        if (item) {
            this.values['completeTask'] = item
            this.values.id = this.addModel.id;
            let companyData = this.$refs.bottomInformation.getData ();
            this.values = {
              ...this.values,
              ...companyData
            }
            completeFun (this.values).then (res => {
                if (res.code === 200) {
                    this.$message.success (res.message)
                    this.cancelBtn ()
                }
            })
        }
    },
  },
  mounted() {
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
    if (pushData.activityId) {
      // 按钮
      getDetails(pushData.procDefId + "/" + pushData.activityId).then(res => {
        this.btnList = res.operation;
        this.detailMsg = res.msg;
        this.rejectVal = res.sendBackNode;
      });
      // 驳回节点
      findReverseRoute(pushData.procDefId + "/" + pushData.activityId).then(
        res => {
          this.returnList = res;
        }
      );
    }
    queryById({ id: pushData.processVariables.relevancyId })
      .then(res => {
        this.detailData = res;
        this.upLoadFileDefaultList = [];
          res.fileList = res.fileList || [];
          for (let i = 0; i < res.fileList.length; i++) {
              let obj ={
                status : 'finished',
                response : {
                    url : res.fileList[i].url,
                    name : res.fileList[i].name,
                    size : res.fileList[i].size,
                },
              };
            this.upLoadFileDefaultList.push(obj)
          }
      }).finally(res => {
        goAdd().then(res => {
            this.accountnameArr = res.banks;
            // this.accountnameData = [];
            // for (let i = 0; i < this.accountnameArr.length; i++) {
            //   let obj = {
            //     value: this.accountnameArr[i].id,
            //     label: this.accountnameArr[i].name
            //   };
            //   this.accountnameData.push(obj);
            // }
          }).finally(res => {
            let newValue = {};
            newValue = this.detailData;
            newValue.borrowingBalanceBig = util.convertCurrency(
              newValue.borrowmoney
            );
            this.newValue = newValue;
            util.setObjval(this.addModel, newValue);
            this.addModel.total = (newValue.paymoney - 0) + (newValue.paymoney1 - 0)
            this.addModel.big = util.convertCurrency(
              this.addModel.total
            );
          });
      });
  },
  computed: {}
};
</script>

<style >
.loanDetail input::-webkit-outer-spin-button,
.loanDetail input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.loanDetail input[type="number"] {
  -moz-appearance: textfield;
}
</style>
<style  lang="scss">
.loanDetail .box-card {
  min-height: 100%;
}
.payTable {
  width: 100%;
  thead {
    font-size: 14px;
    th {
      height: 40px;
      border-right: 1px solid #ebeef5;
      border-top: 1px solid #ebeef5;
      border-bottom: 1px solid #ebeef5;
      &:nth-child(1) {
        border-left: 1px solid #ebeef5;
      }
    }
  }
  tbody {
    tr {
      height: 40px;
      td {
        &:nth-child(1) {
          border-left: 1px solid #ebeef5;
          text-align: center;
          font-weight: 700;
        }
        border-right: 1px solid #ebeef5;
        border-bottom: 1px solid #ebeef5;
        .el-input__inner {
          height: 40px;
          line-height: 40px;
          border: 0;
          border-radius: 0px;
        }
        .el-input-group__append {
          border: 0px;
          background-color: #f5f7fa;
          color: inherit;
          cursor: pointer;
        }
      }
    }
    &:last-child {
      .el-input__inner {
        color: #000;
      }
    }
  }
}
</style>