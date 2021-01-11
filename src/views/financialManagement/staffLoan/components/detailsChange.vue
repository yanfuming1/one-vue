<template>
  <d2-container class="loanDetail">
    <qqt-flow-tabs v-if="tabShow" :procInstId="procInstId" :pdfId="pdfId">
      <template slot="content">
        <el-card class="box-card">
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
              <el-col :span="6">
                <el-form-item label="收款金额：" prop="gathermoney">
                  <el-input v-model="addModel.gathermoney" disabled type="number" placeholder="请输入收款金额">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <associated-documents ref="relevance" size="small"  :relevance="values" />
            <title-line>付款信息</title-line>
            <table cellspacing="0" cellpadding="0" border="0" class="payTable">
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
                      <el-button
                        slot="append"
                        disabled
                        @click="payClickFun('payname')"
                        icon="el-icon-search"
                      ></el-button>
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
                      disabled
                      :readonly="addModel.payname =='' || addModel.payname == null "
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
                      <el-button
                        slot="append"
                        disabled
                        @click="payClickFun('payname1')"
                        icon="el-icon-search"
                      ></el-button>
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
                      disabled
                      :readonly="addModel.payname1 =='' || addModel.payname1 == null "
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
            <title-line>审批意见</title-line>
            <el-row>
              <el-col :span="24">
                <el-form-item label label-width="0" prop="msg">
                  <el-input type="textarea" :rows="4" v-model="addModel.msg"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <bottomInformation :fieldTitle="'借款'" :timeTitle="'申请'" :values="pushData" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
            </el-row>
          </el-form>
          <el-row>
            <el-col :span="24" style="text-align:center" class="d2-mt-20">
              <el-button size="small" type="primary" @click="consentFun">同意</el-button>
              <el-button
                size="small"
                type="warning"
                v-if="btnList.indexOf('1') != -1"
                @click="turnToFun"
              >转办</el-button>
              <el-button
                size="small"
                type="success"
                v-if="btnList.indexOf('2') != -1"
                plain
                @click="returnBtn"
              >驳回</el-button>
              <el-button
                size="small"
                type="info"
                v-if="btnList.indexOf('3') != -1"
                @click="submitBtn"
              >作废</el-button>
              <el-button size="small" type="primary"  @click="cancelBtn">关闭</el-button>
            </el-col>
          </el-row>
        </el-card>
      </template>
    </qqt-flow-tabs>
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
      驳回节点：
      <el-select v-model="rejectVal" placeholder>
        <el-option
          v-for="item in returnList"
          :key="item.activityId"
          :label="item.name"
          :value="item.activityId"
        ></el-option>
      </el-select>
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
  </d2-container>
</template>

<script>
import titleLine from "../../component/titleLine/titleLine";
import qqtTable from "../../../../components/qqt-subassembly/qqt-table/qqt-table";
import {
  qqtFlowDiagram,
  qqtFlowTabs,
  associatedDocuments
} from "../../../../components/qqt-subassembly";
import {
  goAdd,
  getByAccountTypeListAll,
  activitiPage,
  completeFun,
  queryById
} from "../../../../api/financialManagement/staffLoan";
import {
  getDetails,
  findReverseRoute,
  careOf
} from "../../../../api/approval/common";
import bottomInformation from '../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
import userModules from "../../../systemManagement/processDefinition/processModules/userModules";
import util from "@/libs/util.js";
export default {
  name: "staffLoanCNPage",
  components: {
    titleLine,
    qqtTable,
    qqtFlowDiagram,
    qqtFlowTabs,
    userModules,
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
      procInstId: "",
      pdfId: "",
      tabShow: false,
      detailData:{},
      rejectVal: "",
      rejectShow: false,
      accountnameArr: [],
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
      transform: {
        isShowDetails: true
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
      pushData: {}
    };
  },
  methods: {
    // 转办
    turnToFun() {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          this.isShow = true;
        } else {
          this.$message.error("请输入要转办的审批意见");
        }
      });
    },
    // 作废
    submitBtn() {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          let jsonData = JSON.parse(JSON.stringify(this.addModel));
          jsonData.accountname = this.queryNameByIdCompany(
            jsonData.accountname
          ).name;
          delete jsonData.big;
          delete jsonData.total;
          jsonData.flag = "3";
          jsonData.completeTask = {
            taskId: this.taskId,
            msg: jsonData.msg
          };
          delete jsonData.msg;
          completeFun(jsonData).then(res => {
            if (res.success) {
              this.$message.success("作废成功");
              this.$router.go(-1);
            }
          });
        }
      });
    },
    // 同意
    consentFun() {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          let jsonData = JSON.parse(JSON.stringify(this.addModel));
          if (
            jsonData.borrowmoney - 0 === jsonData.gathermoney - 0 &&
            jsonData.borrowmoney - 0 === jsonData.total - 0
          ) {
            jsonData.accountname = this.queryNameByIdCompany(
              jsonData.accountname
            ).name;
            delete jsonData.big;
            delete jsonData.total;
            jsonData.flag = "1";
            jsonData.completeTask = {
              taskId: this.taskId,
              msg: jsonData.msg
            };
            delete jsonData.msg;
            console.log(jsonData)
            return
            completeFun(jsonData).then(res => {
              if (res.success) {
                this.$message.success("同意成功");
                this.$router.go(-1);
              }
            });
          } else {
            this.$message.error("借款金额收款金额和付款金额总和不一致，请确认");
          }
        }
      });
    },
    // 取消
    cancelBtn() {
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
      if (this.rejectVal) {
        let jsonData = JSON.parse(JSON.stringify(this.addModel));
        this.rejectShow = true;
        jsonData.accountname = this.queryNameByIdCompany(
          jsonData.accountname
        ).name;
        delete jsonData.big;
        delete jsonData.total;
        jsonData.flag = "2";
        jsonData.completeTask = {
          taskId: this.taskId,
          msg: jsonData.msg,
          activityId: this.rejectVal
        };
        delete jsonData.msg;
        completeFun(jsonData).then(res => {
          if (res.success) {
            this.$message.success("驳回成功");
            this.$router.go(-1);
          }
        });
      } else {
        this.$message.error("请选择要驳回的节点");
      }
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
        let jsonData = {
          message: this.addModel.msg,
          candidateIds: data
        };
        careOf(this.taskId, jsonData).then(res => {
          if (res.success) {
            this.$message.success("转办成功");
            this.$router.go(-1);
          }
        });
      } else {
        this.$message.error("请选择要转办的部门或人员");
      }
    }
  },
  mounted() {
    let pushData = this.pushLogData;
    this.taskId = pushData.taskId;
    this.procInstId = pushData.procInstId;
    this.pdfId = pushData.procDefId;
    this.tabShow = true;
    if (pushData.activityId) {
      getDetails(pushData.procDefId + "/" + pushData.activityId).then(res => {
        this.btnList = res.operation;
        this.rejectVal = res.sendBackNode;
      });
      findReverseRoute(pushData.procDefId + "/" + pushData.activityId).then(
        res => {
          console.log(res)
          this.returnList = res;
        }
      );
    }
    queryById({ id: pushData.processVariables.relevancyId })
      .then(res => {
        this.detailData = res;
      })
      .finally(res => {
        goAdd()
          .then(res => {
            this.accountnameArr = res.banks;
            this.accountnameData = [];
            for (let i = 0; i < this.accountnameArr.length; i++) {
              let obj = {
                value: this.accountnameArr[i].id,
                label: this.accountnameArr[i].name
              };
              this.accountnameData.push(obj);
            }
          })
          .finally(res => {
            let newValue = {};
            for (let i = 0; i < this.accountnameArr.length; i++) {
              if (
                this.accountnameArr[i].name === this.detailData.accountname &&
                this.accountnameArr[i].openingBank === this.detailData.bank &&
                this.accountnameArr[i].account === this.detailData.accountnumber
              ) {
                this.detailData.accountname = this.accountnameArr[i].id;
              }
            }
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