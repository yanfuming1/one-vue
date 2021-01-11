<template>
      <d2-container class="refundDeposit" v-if="payModel">
        <template  slot="header" style="padding-bottom:0">
            <div class="customer-list-header">
              <el-form :inline="true" class="demo-form-inline " :model="form" ref="form" size="mini">
                  <el-form-item label prop="name">
                    <el-input v-model="search.name" style="width:150px;" prefix-icon="el-icon-search" placeholder="请输入内容" clearable/>
                  </el-form-item>
                  <el-form-item>
                    <el-date-picker
                      v-model="dateTime"
                      style="width:320px"
                      type="datetimerange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      @change="dateChange"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      :default-time="['08:00:00', '18:00:00']"
                      end-placeholder="结束日期"> 
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item>项目类型:</el-form-item>
                  <el-form-item label prop="type">
                      <el-select v-model="search.type" style="width:120px;" placeholder="请选择要搜索的项目类型"  clearable  @change="searchList">
                          <el-option label="全部项目" value="" />
                          <el-option label="联营项目" value="1" />
                          <el-option label="自营项目" value="0" />
                      </el-select>
                  </el-form-item>
                  <el-form-item>审核状态:</el-form-item>
                  <el-form-item label prop="state">
                      <el-select v-model="search.state" style="width:100px;" placeholder="请选择要搜索的审核状态"  clearable @change="searchList">
                          <el-option label="全部" value="" />
                          <el-option label="未审核" value="0" />
                          <el-option label="已审核" value="1" />
                      </el-select>
                  </el-form-item>
                  <el-form-item>保证金类型:</el-form-item>
                  <el-select v-model="search.marginType" clearable placeholder="请选择" size="mini" @change="searchState">
                    <el-option v-for="item in cashType" :key="item.id " :label="item.name" :value="item.name"></el-option>
                  </el-select>
                  <el-form-item>最小金额:</el-form-item>
                  <el-form-item label prop="mini">
                    <el-input v-model="search.mini" style="width:140px;" @input="val => moneyChange(val, 'mini')" placeholder="请输入最小金额" clearable/>
                  </el-form-item>
                  <el-form-item>最大金额:</el-form-item>
                  <el-form-item label prop="max">
                    <el-input v-model="search.max" style="width:140px;" @input="val => moneyChange(val, 'max')" placeholder="请输入最大金额" clearable/>
                  </el-form-item>
                  <el-form-item>
                      <el-button type="primary" @click="dataSearch()">搜索</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="info" @click="resetFun">重置</el-button>
                  </el-form-item>
                  <el-button-group>
                    <el-button size="mini" @click="uploadFun" icon="el-icon-upload2">导出</el-button>
                    <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                  </el-button-group>
              </el-form>
              <!-- <el-row class="d2-mt-10">
                <el-col :span="12">
                  <i class="leftLine"></i> 审核状态
                  <el-button size="small" style="margin-left:15px" @click="btnclickFun('全部')">全部</el-button>
                  <el-button size="small" @click="btnclickFun('未审核')">未审核</el-button>
                  <el-button size="small" @click="btnclickFun('已审核')">已审核</el-button>
                </el-col>
              </el-row> -->
            </div>
        </template>
        <template>
          <div class="fina_applica_center">
            <qqt-table  ref="table" :exportData="exportData" :data="tableData" :dynamicHeader="dynamicHeader" :rowHeader="rowHeader" :option="tableOption"   @page="pageChange" @selectionChange="selectChange"></qqt-table>
          </div>
            <!-- @selectionChange="selectChange" -->
        </template>
     </d2-container>
     <pay-model v-else @cancelBtn="cancelFun" :modelData="editData"></pay-model>
</template>

<script>
let that = this;
import { getMarginReturnList,getFinanceSearchList} from '../../../api/financialManagement/refundDeposit';
import payModel from './components/payDialog';
import qqtTable from '../../../components/qqt-subassembly/qqt-table/qqt-table';
import {marginReturnQueryById,queryDicById,getByAccountTypeListAll, getRefundById} from '../../../api/jointProject/index'
import { PROJECT_GETINFOID } from '../../../enum/PROJECT'
import util from '@/libs/util';
export default {
  components: {
      qqtTable,
      payModel,
  },
  data() {
    return {
      exportData: [],
      payModel: true,
      dateTime: null,
      form: {
          keywords: '',
          bstatus: '1'
      },
      tableData: {},
      editData:{},
      cashType: [],
      dynamicHeader: {
          tableId: 'T_1572601657333',
          isSave: false
      },
      collectUnitAccount: [],
      rowHeader: [
          {
              prop: 'marginCode',
              label: '退还编号',
              width: 160,
              isShow: true,
              render: (h,params) =>{
                let text = params.row.marginCode;
                return h('div',{
                    class: {
                        'typefaceColor': true, 
                    },
                    on: {
                        click: () => {
                          // marginReturnQueryById({id: params.row.id}).then(res => {
                          getRefundById({id: params.row.id}).then(res => {
                            this.$router.push({
                                path: 'cashReturn',
                                name: 'cashReturn',
                                params: {
                                    collectUnitAccount: this.collectUnitAccount,
                                    isDetail: true,
                                    isAdd : false,
                                    returnInfo : res
                                }
                            })
                          })
                        }
                    }
                },text)
              }
          },
          {
              prop: 'projectTypeName',
              label: '项目类型',
              isShow: true,
              render:(h,params) =>{
                return h('div',{
                }, params.row.projectTypeName = params.row.projectType === '1' ? '联营项目' : (params.row.projectType=== '2' ? '自营项目': '其他'))
              }
          },
          {
              prop: 'projectName',
              label: '项目名称',
              width: 200,
              isShow: true,
          },
          {
              prop: 'marginType',
              label: '保证金类型',
              isShow: true,
              // render:(h,params) =>{
              //   let text = params.row.marginType === '1' ? '投标保证金' : (params.row.marginType=== '2' ? '履约保证金' : (params.row.marginType=== '3' ? '农民工工资' : '其他'));
              //   return h('div',{
              //   },text)
              // }
          },
          {
              prop: 'surrenderValueName',
              label: '退还联营人金额',
              isShow: true,
              render:(h,params) =>{
                return h('div',{ }, params.row.surrenderValueName = util.moneyTransform(params.row.surrenderValue))
              }
          },
          {
              prop: 'accountNumber',
              label: '联营人收款账户',
              width: 150,
              isShow: true,
          },
          {
              prop: 'procState',
              label: '办理状态',
              isShow: true,
              render: (h,params) => {
                return h('div',{
                },params.row.procStateName = util.handleState (params.row.procState))
              }
          },
          {
              prop: 'agent',
              label: '待办人',
              isShow: true,
          },
          {
              prop: 'stateName',
              label: '审核状态',
              isShow: true,
              render: (h,params) =>{
                let text = '';
                if (params.row.state === '0') {
                  params.row.stateName = '未审核';
                } else if (params.row.state === '1') {
                  params.row.stateName = '审核';
                }
                return h('div',{
                   
                },params.row.stateName)
              }
          },
          {
              prop: 'createName',
              label: '申请人',
              isShow: true,
          },
          {
              prop: 'createTime',
              label: '申请时间',
              width: 170,
              isShow: true,
          },
          // {
          //   prop: '',
          //   label: '操作',
          //   isShow: true,
          //   render: (createElement, params) =>{
              
          //       return createElement('div',
          //           [
          //               createElement('el-button', {
          //                   attrs: {
          //                       type: 'text',
          //                       disabled:  true
          //                   },
          //                   style:{
          //                       color: '#999'
          //                   },
          //                   on: {
          //                       click: () => {
          //                           this.payModel = false;
          //                           this.$message.success("你点击了支付")
          //                       }
          //                   }
          //               }, '支付'),
          //           ]
          //       )
          //   }
          // }
      ],
      tableOption: {
          border: false,
      },
      page: {
          pageNo: 1,
          pageSize: 10,
      },
      search: {
          name: '',
          type:'',
          state: '',
          pay: '',
          pageNo: 1,
          pageSize: 10,
          startDate: '',
          endDate: '',
          marginType:'',
          mini: '',
          max: '',
      },
      tableSelectData: []
    }
  },
  methods: {
    searchState (val) {
      this.search.pageNo = '1';
      this.search.pageSize = '10';
      this.searchList();
    },
      // 导出
    getExportData () {
        this.exportData = JSON.parse(JSON.stringify((this.tableData.records))) || [];
        return new Promise((resolve, reject) => {
          this.exportData.forEach((item,index) => {
            item.procState = util.handleState(item.procState);
            item.projectType = item.projectType === '1' ? '联营项目' : (item.projectType=== '0' ? '自营项目' : '其他');
            item.state = item.state === '0' ? '未审核' : '已审核';
            item.marginState = item.marginState === '0' ? '未退回' : '已退回';
          });
          resolve (true)
        });
    },
    uploadFun () { 
      this.getExportData().then(res => {
        this.$refs.table.getExportExcel()
      })
    },
    // 添加
    addAccountBtn () {},
    moneyChange (value, type) {
      let reg = /^[0-9]*[0-9][0-9]*$/
      if(!reg.test(value)) {
        this.search[type] = ''
      }
    },
    resetFun () {
      this.search.marginType = ''
      this.search.name = ''
      this.search.state = '';
      this.search.type = '';
      this.dateTime = null;
      this.search.startDate = '';
      this.search.endDate = '';
      this.search.mini = '';
      this.search.max = '';
      this.search.money = '';
      this.search.pageNo = '1';
      this.search.pageSize = '10';
      this.searchList();
    },
    // 搜索
    dataSearch () {
      this.search.state = '';
      if (this.dateTime) {
         this.search.startDate = this.dateTime[0] 
         this.search.endDate = this.dateTime[1] 
      } else {
        this.search.startDate = '';
        this.search.endDate = '';
      }
      this.search.pageNo = '1';
      this.search.pageSize = '10';
      this.searchList();
    },
    dateChange (time) {
      if (time) {
        this.search.startDate = time[0] 
        this.search.endDate = time[1] 
      } else {
        this.search.startDate = '';
        this.search.endDate = '';
      }
      this.search.pageNo = '1';
      this.search.pageSize = '10';
      this.searchList();
    },
    searchList () {
      if(this.search.mini === '' && this.search.max !== '' || this.search.mini !== '' && this.search.max === '') {
        this.$message.warning('请补全金额范围!!!')
        return
      }
      if(this.search.mini !== '' && this.search.max !== '') {
        if(Number(this.search.mini) > Number(this.search.max)) {
          this.$message.warning('最小金额不能大于最大金额!!!')
          return
        } else {
          this.search['money'] = this.search.mini + ',' + this.search.max
        }
      } else {
        this.search['money'] = ''
      }
      getFinanceSearchList (this.search).then(res => {
          this.tableData = res;
      })
    },
    // 批量删除
    deleteAll () {

    },
    pageChange (data) {
      this.search.pageNo = data.current;
      this.search.pageSize = data.size;
      this.searchList();
    },
    selectChange (val) {
      this.tableSelectData = val
    },
    // 审核状态搜索
    // btnclickFun (data) {
    //   switch(data) {
    //     case '全部':
    //         this.search.state = '';
    //         break;
    //     case '未审核':
    //         this.search.state = '0';
    //         break;
    //     case '已审核':
    //         this.search.state = '1';
    //         break;
    //   }
    //   this.searchList();
    // },
    cancelFun () {
      this.payModel = true;
    },
    getCommonInfo() {
        // 获取保证金类型
        queryDicById({
            id: PROJECT_GETINFOID.CASHSTYLE
        }).then(res => {
            this.cashType = res
        })
        // 收取单位户名
        getByAccountTypeListAll({
            accountType: 3
        }).then(res => {
            this.collectUnitAccount = res
        })
    },

    printTable () {
      this.$refs.table.printTable (this.tableSelectData)
    },

  },
  mounted () {
    this.getCommonInfo();
    getMarginReturnList (this.page).then(res => {
        this.tableData = res;
    })
  },
}
</script>

<style lang='scss' scoped>
  .refundDeposit {
    .leftLine {
      border-left: 3px solid #84b7fa;
      padding-right: 15px;
    }
  }
  .customer-list-header{
    .el-form-item{ margin-bottom: 12px !important; }
  }
 
</style>
<style >
 .refundDeposit .d2-container-full__header{
    padding-bottom: 0px !important;
  }
  .el-range-separator{
    display: contents !important;
  }
</style>