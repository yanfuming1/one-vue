<template>
  <d2-container class="fina_applica" v-if="dialogShow">
    <template slot="header" style="padding-bottom:0">
      <div class="customer-list-header">
        <el-form
          :inline="true"
          class="demo-form-inline "
          :model="search"
          ref="form"
          size="mini"
          label-width="100px"
        >
          <!-- <el-row>
                    <el-col :span="18">
                      <table border="1" cellpadding="0" cellspacing="0" style="width:100%;border-color:#eff6fa;" class="searchTable">
                        <tr style="height:30px">
                          <td style="width:100px">户名</td>
                          <td style="width: 25%">
                            <el-form-item label prop="keywords">
                              <el-input v-model="search.keywords"  placeholder="请输入户名"  :clearable="true"/>
                            </el-form-item>
                          </td>
                          <td style="width:100px">开户行</td>
                          <td style="width: 25%">
                            <el-form-item label prop="gatheringbank">
                              <el-input v-model="search.gatheringbank"  placeholder="请输入开户行"  :clearable="true"/>
                            </el-form-item>
                          </td>
                          <td style="width:100px">账号</td>
                          <td style="width: 25%">
                            <el-form-item label prop="gatheringaccount">
                              <el-input v-model="search.gatheringaccount"  placeholder="请输入账号"  :clearable="true"/>
                            </el-form-item>
                          </td>
                        </tr>
                        <tr style="height:30px">
                          <td>金额</td>
                          <td>
                            <el-form-item label prop="gatheringaccount">
                              <el-input v-model="search.gatheringaccount"  placeholder="请输入金额" onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''"  :clearable="true"/>
                            </el-form-item>
                          </td>
                          <td>到账时间</td>
                          <td>
                            <el-form-item label prop="gatheringtime">
                               <el-date-picker
                                style="width:100%"
                                v-model="dateTime"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                value-format="yyyy-MM-dd"
                                @change="dateChange"
                                end-placeholder="结束日期">
                              </el-date-picker>
                            </el-form-item>
                          </td>
                          <td>附言</td>
                          <td>
                            <el-form-item label prop="paymark">
                              <el-input v-model="search.paymark"  placeholder="请输入附言"  :clearable="true"/>
                            </el-form-item>
                          </td>
                        </tr>
                      </table>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item>
                        <el-button type="primary" @click="dataSearch()">搜索</el-button>
                      </el-form-item>
                      <el-form-item>
                          <el-button type="info" @click="resetFun">重置</el-button>
                      </el-form-item>
                    </el-col>
                  </el-row> -->
          <el-form-item label="付款户名:" prop="keywords">
            <el-input
              v-model="search.keywords"
              placeholder="请输入付款户名"
              :clearable="true"
            />
          </el-form-item>
          <!-- <el-form-item label="开户行:" prop="gatheringbank">
                    <el-input v-model="search.gatheringbank"  placeholder="请输入开户行"  :clearable="true"/>
                  </el-form-item>
                  <el-form-item label="账号:" prop="gatheringaccount">
                    <el-input v-model="search.gatheringaccount"  placeholder="请输入开户行"  :clearable="true"/>
                  </el-form-item>
                  <el-form-item label="金额:" prop="gatheringamount">
                    <money-range ref="moneyRange"></money-range>
                  </el-form-item>
                  <el-form-item label="到账时间:" prop="dateTime">
                    <el-date-picker
                      style="width:250px"
                      v-model="dateTime"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      value-format="yyyy-MM-dd"
                      @change="dateChange"
                      end-placeholder="结束日期">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="附件:" prop="paymark">
                    <el-input v-model="search.paymark"  placeholder="请输入附言"  :clearable="true"/>
                  </el-form-item> -->
          <el-form-item>
            <el-button type="primary" @click="dataSearch()">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="info" @click="resetFun">重置</el-button>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="states"
              @change="searchState"
              placeholder="请选择认定状态"
              style="width: 160px;"
              clearable
            >
              <el-option label="未认定" value="未认定" />
              <el-option label="已认定" value="已认定" />
            </el-select>
          </el-form-item>
          <el-button type="success" size="mini" @click="checkAccountFund"
            >审核</el-button
          >
          <el-button type="success" size="mini" @click="againstAccountFund"
            >反审核</el-button
          >
          <!-- <el-form-item prop="keywords">
                    <el-input v-model="search.keywords" prefix-icon="el-icon-search" placeholder="请输入内容" style="width: 200px;" :clearable="true"/>
                  </el-form-item>
                  <el-form-item label prop="keywords">
                       <el-date-picker
                        style="width:250px"
                        v-model="dateTime"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        value-format="yyyy-MM-dd"
                        @change="dateChange"
                        end-placeholder="结束日期">
                      </el-date-picker>
                  </el-form-item>
                  <el-form-item>
                      <el-button type="primary" @click="dataSearch()">搜索</el-button>
                  </el-form-item>
                  <el-form-item>
                      <el-button type="info" @click="resetFun">重置</el-button>
                  </el-form-item>
                  <el-button-group>
                    <el-button size="mini" icon="el-icon-upload2" @click="handleBtn('导出')">导出</el-button>
                    <el-button size="mini" icon="el-icon-printer" @click="handleBtn('打印')">打印</el-button>
                  </el-button-group> -->
        </el-form>
      </div>
    </template>
    <template>
      <div class="fina_applica_center">
        <qqt-table
          :data="tableData"
          :rowHeader="rowHeader"
          :option="tableOption"
          :dynamicHeader="dynamicHeader"
          @page="pageChange"
          @selectionChange="selectChange"
        >
        </qqt-table>
      </div>
      <!-- @selectionChange="selectChange" -->
    </template>
    <drawer-off
      :showDrawer="showDrawer"
      @change="drawerClose"
      :drawerData="drawerData"
    ></drawer-off>
    <upload-excel
      :showUpload="showUpload"
      @closeDialog="closeDialog"
      @uploadFun="uploadFun"
    ></upload-excel>
  </d2-container>
  <add-dialog
    v-else
    @cancelBtn="cancelFun"
    :modelData="editData"
    :isAdd="isAdd"
    @successFun="successFun"
  ></add-dialog>
</template>

<script>
import {
  getFinanceFundList,
  getFinanceFundFeterminationDel,
  goDetail,
  importExcel,
  uploadAjx,
  checkAccountFund,
  againstAccountFund,
  capitalWithdrawAccountFund
} from "../../../api/financialManagement/financeFundFetermination";
import addDialog from "./components/addDialog";
import drawerOff from "./components/drawerOff";
import uploadExcel from "../component/upLoad/index";
import qqtTable from "../../../components/qqt-subassembly/qqt-table/qqt-table";
import { parse } from "path";
import util from "@/libs/util.js";
import moneyRange from "./components/moneyRange";
export default {
  components: {
    addDialog,
    qqtTable,
    uploadExcel,
    drawerOff,
    moneyRange,
  },
  data() {
    let that = this;
    return {
      dateTime: null,
      dialogShow: true,
      isAdd: false,
      showDrawer: false,
      showUpload: false,
      form: {
        keywords: "",
        bstatus: "1",
      },
      dynamicHeader: {
        // tableId: 'T_1572601657640',
        // isSave: true
      },
      editData: {},
      drawerData: {},
      tableData: {},
      selectRow: [],
      rowHeader: [
        {
          prop: "gatheringamount",
          label: "到账金额（元）",
          isOpenSummary: true,
          isShow: true,
          width: 140,
          render: (h, params) => {
            let text = params.row.gatheringamount;
            if (text) {
              text = Number(text).toFixed(2);
            }
            return h("div", {}, text);
          },
        },
        {
          prop: "affirmamount",
          label: "已认定金额（元）",
          isShow: true,
          width: 140,
          isOpenSummary: true,
          render: (h, params) => {
            return h(
              "div",
              {
                on: {
                  click: () => {
                    goDetail({ id: params.row.id }).then((res) => {
                      this.dialogShow = false;
                      this.editData = res;
                      this.selectRow = [];
                      this.isAdd = false;
                    });
                  },
                },
              },
              [
                h(
                  "div",
                  {
                    class: { typefaceColor: true },
                  },
                  (params.row.affirmamount - 0).toFixed(2)
                ),
              ]
            );
          },
        },
        {
          prop: "",
          label: "未认定金额（元）",
          isShow: true,
          width: 140,
          render: (h, params) => {
            let text =
              Number(params.row.gatheringamount) -
              Number(params.row.affirmamount);
            if (text) {
              text = Number(text).toFixed(2);
            }
            return h("div", {}, text);
          },
        },
        {
          prop: "affirmstate",
          label: "认定状态",
          isShow: true,
          width: 90,
        },
        {
          prop: "companycollection",
          label: "公司收款账户",
          isShow: true,
          width: 140,
        },
        {
          prop: "gatheringaccount",
          label: "公司收款账号",
          width: 140,
          isShow: true,
          // render: (h, params) =>{
          //   let text = params.row.gatheringaccount;
          //   let data = util.replaceAccount(text,text.length-9,text.length-5,'****')
          //   return h('div', {
          //   },data)
          // }
        },
        {
          prop: "payaccount",
          label: "对方付款账户",
          isShow: true,
          width: 120,
        },
        {
          prop: "paymark",
          label: "付款留言",
          isShow: true,
          width: 120,
        },
        {
          prop: "gatheringtime",
          label: "收到时间",
          isShow: true,
          width: 170,
        },
        {
          prop: "createName",
          label: "登记人",
          isShow: true,
          width: 100,
        },
        {
          prop: "createTime",
          label: "登记时间",
          isShow: true,
          width: 170,
        },
        {
          prop: "",
          label: "操作",
          isShow: true,
          fixed: "right",
          width: 120,
          render: (createElement, params) => {
            return createElement("div", [
              this.$has("finance:accountFund:affraim")
                ? createElement(
                    "el-button",
                    {
                      attrs: {
                        type: "text",
                        disabled:
                          params.row.affirmstate === "已认定" ? true : false,
                      },
                      style: {
                        color:
                          params.row.affirmstate === "已认定"
                            ? "#999"
                            : "#409EFF",
                      },
                      on: {
                        click: () => {
                          this.showDrawer = true;
                          this.selectRow = [];
                          this.drawerData = params.row;
                        },
                      },
                    },
                    "认定"
                  )
                : "",
              this.$has("finance:accountFund:affraim")
                ? createElement(
                    "el-button",
                    {
                      attrs: {
                        type: "text",
                        disabled: params.row.affirmstate === "已认定" ? false : true,
                      },
                      style: {
                        color:
                          params.row.affirmstate === "已认定" ? "#409EFF" : "#999",
                        // color: params.row.procState === '1' || params.row.procState === '4' ? '#409EFF' : '#999',
                      },
                      on: {
                        click: () => {
                          console.log('hello')
                          this.revoke(params.row, params.index);
                        },
                      },
                    },
                    "撤销"
                  )
                : "",
            ]);
          },
        },
      ],
      tableOption: {
        border: false,
        isOpenSummary: true,
      },
      page: {
        pageNo: 1,
        pageSize: 10,
      },
      states: "",
      search: {
        keywords: "",
        gatheringbank: "",
        gatheringaccount: "",
        time: "",
        paymark: "",
        pageNo: 1,
        pageSize: 10,
      },
      rules: {
        keywords: [
          {
            required: true,
            message: "请输入户名",
            trigger: ["change", "blur"],
          },
        ],
      },
    };
  },
  methods: {
    // 审核
    checkAccountFund() {
      if (this.selectRow.length === 1) {
      } else if (this.selectRow.length === 0) {
        this.$message.error("请选择要审核的数据");
      } else {
        this.$message.error("只支持单条数据操作");
      }
    },
    revoke (row) {
      console.log(row)
      capitalWithdrawAccountFund({id:row.id}).then(res => {
        this.getTableData()
      })
    },
    // 反审核
    againstAccountFund() {
      if (this.selectRow.length === 1) {
      } else if (this.selectRow.length === 0) {
        this.$message.error("请选择要反审核的数据");
      } else {
        this.$message.error("只支持单条数据操作");
      }
    },
    searchState(states) {
      this.search.pageNo = "1";
      if (this.dateTime) {
        let time = this.dateTime[0] + "," + this.dateTime[1];
        this.search.time = time;
      } else {
        this.search.time = "";
      }
      let newData = Object.assign({}, this.search);
      newData.keywords = states;
      getFinanceFundList(newData).then((res) => {
        this.tableData = res;
        this.selectRow = [];
      });
    },
    // 添加
    addAccountBtn() {
      this.dialogShow = false;
      this.isAdd = true;
      this.editData = {};
      this.selectRow = [];
    },
    resetFun() {
      this.tableData = {};
      this.search.keywords = "";
      this.states = "";
      this.$refs.moneyRange.money1 = 0;
      this.$refs.moneyRange.money2 = 0;
      this.search.gatheringbank = "";
      this.search.gatheringaccount = "";
      this.search.paymark = "";
      this.dateTime = null;
    },
    // 搜索
    dataSearch() {
      // let moneyData = this.$refs.moneyRange.getMoney();
      // let moneyObj = {
      //   money1: moneyData.money1,
      //   money2: moneyData.money2,
      // }
      if (!this.search.keywords) {
        this.$message.error("请输入户名");
        return;
      }
      // if (this.dateTime) {
      //    let time = this.dateTime[0] + ' 00:00:00' + ',' + this.dateTime[1] + ' 23:59:59';
      //    this.search.time = time;
      // } else {
      //   this.$message.error('请选择到账时间');
      //   return;
      // }
      // if (moneyObj.money2 > 0) {
      //   this.search.money1 = moneyObj.money1;
      //   this.search.money2 = moneyObj.money2;
      // }
      getFinanceFundList(this.search)
        .then((res) => {
          this.tableData = res;
          this.selectRow = [];
        })
        .catch((err) => {
          console.log(err);
        });
    },
    dateChange(date) {
      return;
      if (!this.search.keywords) {
        this.$message.error("请输入户名");
        return;
      }
      if (date) {
        let time = date[0] + " 00:00:00" + "," + date[1] + " 23:59:59";
        this.search.time = time;
      } else {
        this.search.time = "";
      }
      this.selectData = [];
      getFinanceFundList(this.search)
        .then((res) => {
          this.tableData = res;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 批量删除
    deleteAll() {
      if (this.selectRow.length > 0) {
        this.$confirm("是否删除选择行数据", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          let ids = "";
          for (let i = 0; i < this.selectRow.length; i++) {
            ids += this.selectRow[i].id + ",";
          }
          getFinanceFundFeterminationDel({
            ids: ids.substring(0, ids.length - 1),
          })
            .then((res) => {
              this.getTableData();
              this.$message.success("删除成功");
            })
            .catch((err) => {
              console.log(err);
            });
        });
      } else {
        this.$message.error("请选择要批量删除的数据");
      }
    },
    // 行内删除
    deleteRow(row, index) {
      this.$confirm("是否删除该行数据", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        getFinanceFundFeterminationDel({ ids: row.id })
          .then((res) => {
            this.tableData.records.splice(index, 1);
            this.tableData.total--;
            this.$message.success("删除成功");
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    pageChange(data) {
      this.search.pageNo = data.current;
      this.search.pageSize = data.size;
      this.dataSearch();
    },
    selectChange(val) {
      this.selectRow = val;
    },
    // 取消
    cancelFun() {
      this.dialogShow = true;
    },
    drawerClose() {
      this.showDrawer = false;
      this.getTableData();
      this.search.keywords = "";
    },
    successFun(data) {
      this.$message.success("保存成功");
      this.dialogShow = true;
      this.getTableData();
    },
    // 获取table数据
    getTableData() {
      this.selectRow = [];
      getFinanceFundList(this.page)
        .then((res) => {
          this.tableData = res;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleBtn(val) {
      if (val === "导入") {
        this.showUpload = true;
      } else {
      }
    },
    closeDialog() {
      this.showUpload = false;
    },
    uploadFun(data) {
      this.showUpload = false;
      uploadAjx(data).then((res) => {
        if (res) {
          data.append("path", res);
          importExcel(data).then((result) => {
            console.log(result);
            this.$message.success("导入成功");
          });
        }
      });
    },
  },
  mounted() {
    // this.getTableData();
  },
};
</script>

<style lang="scss" scoped>
.fina_applica {
  .leftLine {
    border-left: 3px solid #84b7fa;
    padding-right: 15px;
  }
}
</style>
<style lang="scss">
.fina_applica {
  .d2-container-full__header {
    padding-bottom: 0px !important;
    .el-form-item--mini.el-form-item {
      margin-bottom: 0px;
    }
    .searchTable {
      td {
        &:nth-child(2n-1) {
          padding-left: 15px;
        }
      }
    }
  }
  .searchTable {
    td {
      .el-form-item {
        width: 100%;
        margin-right: 0px;
        .el-form-item__content {
          width: 100%;
          input,
          .el-date-editor {
            border: 0;
            background-color: #f9f9f9;
          }
        }
      }
    }
  }
  .customer-list-header {
    .el-form-item {
      margin-bottom: 18px !important;
    }
  }
  .demo-form-inline {
    .ivu-input-number-handler-wrap {
      display: none;
    }
  }
}
</style>
