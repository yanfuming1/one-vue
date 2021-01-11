<template>
     <d2-container class="fina_applica" v-if="payModel">
        <template  slot="header" style="padding-bottom:0">
            <div class="customer-list-header">
              <el-form :inline="true" class="demo-form-inline " :model="form" ref="form" size="mini">
                  <el-form-item label prop="name">
                    <el-input v-model="search.name" prefix-icon="el-icon-search" placeholder="请输入内容" clearable/>
                  </el-form-item>
                  <el-form-item>
                      <el-button type="primary" @click="dataSearch()">搜索</el-button>
                  </el-form-item>
                  <el-form-item>项目类型:</el-form-item>
                  <el-form-item label prop="type">
                      <el-select v-model="search.type" placeholder="请选择要搜索的项目类型"  clearable  value="">
                          <el-option label="联营项目" value="1" />
                          <el-option label="自营项目" value="0" />
                      </el-select>
                  </el-form-item>
                  <el-button-group>
                    <el-button size="mini" icon="el-icon-upload2">导出</el-button>
                    <el-button size="mini" icon="el-icon-printer">打印</el-button>
                  </el-button-group>
              </el-form>
              <el-row>
                <el-col :span="12">
                  <i class="leftLine"></i> 审核状态
                  <el-button size="small" style="margin-left:15px" @click="btnclickFun('全部')">全部</el-button>
                  <el-button size="small" @click="btnclickFun('未审核')">未审核</el-button>
                  <el-button size="small" @click="btnclickFun('未退回')">未退回</el-button>
                </el-col>
              </el-row>
            </div>
        </template>
        <template>
            <qqt-table :data="tableData" :rowHeader="rowHeader" :option="tableOption"   @page="pageChange" @selectionChange="selectChange"></qqt-table>
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
export default {
  components: {
      qqtTable,
      payModel,
  },
  data() {
    return {
      payModel: true,
      form: {
          keywords: '',
          bstatus: '1'
      },
      tableData: {},
      editData:{},
      rowHeader: [
          {
              prop: 'companyId',
              label: '退回编号',
              isShow: true
          },
          {
              prop: 'projectName',
              label: '项目名称',
              isShow: true
          },
          {
              prop: 'posiId',
              label: '收取单位名称',
              isShow: true,
          },
          {
              prop: 'projectType',
              label: '项目类型',
              isShow: true
          },
          {
              prop: 'marginType',
              label: '保证金类型',
              isShow: true,
              render:(h,params) =>{
                let text = params.row.marginType === '1' ? '投标保证金' : (params.row.marginType=== '2' ? '履约保证金' : (params.row.marginType=== '3' ? '农民工工资' : '其他'));
                return h('div',{
                },text)
              }
          },
          {
              prop: 'procState',
              label: '流程状态',
              isShow: true,
              // render:(h,params) =>{
              //   let text = params.row.procState === '1' ? '投标保证金' : (params.row.procState=== '2' ? '履约保证金' : (params.row.procState=== '3' ? '农民工工资' : '其他'));
              //   return h('div',{
              //   },text)
              // }
          },
          {
              prop: 'state',
              label: '审核状态',
              isShow: true
          },
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
          type:'1',
          state: '',
          pay: '',
          pageNo: 1,
          pageSize: 10,
      },
    }
  },
  methods: {
    // 添加
    addAccountBtn () {

    },
    // 搜索
    dataSearch () {
      this.search.state = '';
      this.searchList();
    },
    searchList () {
      getFinanceSearchList (this.search).then(res => {
          this.tableData = res;
      }).catch(err => {
          console.log(err);
      })
    },
    // 批量删除
    deleteAll () {

    },
    pageChange (data) {
      this.search.pageNo = data.current;
      this.search.pageSize = data.size;
      this.dataSearch();
    },
    selectChange (val) {
      console.log(val)
    },
    // 审核状态搜索
    btnclickFun (data) {
      switch(data) {
        case '全部':
            this.search.state = '';
            break;
        case '未审核':
            this.search.state = '0';
            break;
        case '未退回':
            this.search.marginType = '1';
            break;
      }
      this.searchList();
    },
    cancelFun () {
      this.payModel = true;
    } 
  },
  mounted () {
    getMarginReturnList (this.page).then(res => {
        this.tableData = res;
    }).catch(err => {
        console.log(err);
    })
  },
}
</script>

<style lang='scss' scoped>
  .fina_applica {
    .leftLine {
      border-left: 3px solid #84b7fa;
      padding-right: 15px;
    }
   
  }
 
</style>
<style >
 .fina_applica .d2-container-full__header{
    padding-bottom: 0px !important;
  }
</style>