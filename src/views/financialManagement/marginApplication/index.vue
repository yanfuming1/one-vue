<template>
    <d2-container class="marginApplication" v-if="changeModel">
      <template  slot="header" style="padding-bottom:0">
          <div class="customer-list-header">
            <el-form :inline="true" class="demo-form-inline " :model="pageInfo" ref="form" size="mini">
                <!-- <el-form-item>
                  <el-button type="primary" @click="addAccountBtn">添加</el-button>
                </el-form-item> -->
                <el-form-item label prop="name">
                  <el-input v-model="pageInfo.name" prefix-icon="el-icon-search" placeholder="请输入内容" style="width: 110px;"/>
                </el-form-item>
                <!-- <el-form-item>
                    <el-button type="primary" @click="deleteAll">批量删除</el-button>
                </el-form-item> -->
                <el-form-item>
                    <el-date-picker
                      style="width:310px"
                      v-model="dateTime"
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
                <el-form-item label prop="projectType">
                    <el-select v-model="pageInfo.projectType" style="width:100px;" placeholder="请选择要搜索的项目类型"  @change="projectChange" clearable >
                      <el-option label="全部项目" value="" />
                      <el-option label="联营项目" value="1" />
                      <el-option label="自营项目" value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item>保证金状态:</el-form-item>
                <el-form-item label >
                    <el-select v-model="pageInfo.marginState" style="width:90px;"  placeholder="请选择" size="mini" @change="searchState">
                        <el-option label="全部" value="" />
                        <el-option label="未退回" value="0" />
                        <el-option label="已退回" value="1" />
                      </el-select>
                      <!-- <el-option v-for="item in options1" :key="item.value" :label="item.value" :value="item.value"></el-option> -->
                    </el-select>
                </el-form-item>
                <el-form-item>保证金类型:</el-form-item>
                <el-form-item label >
                    <el-select v-model="pageInfo.marginType" style="width:150px;"  @clear="clearState" clearable placeholder="请选择" size="mini" @change="projectChange">
                      <el-option v-for="item in options2" :key="item.id " :label="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>最小金额:</el-form-item>
                <el-form-item label prop="mini">
                  <el-input v-model="pageInfo.mini" style="width:120px;" @input="val => moneyChange(val, 'mini')" placeholder="请输入最小金额"/>
                </el-form-item>
                <el-form-item>最大金额:</el-form-item>
                <el-form-item label prop="max">
                  <el-input v-model="pageInfo.max" style="width:120px;" @input="val => moneyChange(val, 'max')" placeholder="请输入最大金额"/>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="dataSearch(true)">搜索</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="info" @click="resetFun">重置</el-button>
                </el-form-item>
                <el-button-group>
                  <el-button size="mini" icon="el-icon-upload2"  @click="uploadFun">导出</el-button>
                  <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                </el-button-group>
            </el-form>
            <!-- <el-row class="d2-mt-10">
              <el-col :span="8">
                <i class="leftLine"></i> 保证金状态
                <el-select v-model="marginState" clearable placeholder="请选择" size="mini" @change="searchState">
                  <el-option v-for="item in options1" :key="item.value" :label="item.value" :value="item.value"></el-option>
                </el-select>
                <el-button size="small"  @click="btnclickFun('全部')" style="margin-left:15px">全部</el-button>
                <el-button size="small"  @click="btnclickFun('未退回')">未退回</el-button>
                <el-button size="small"  @click="btnclickFun('已退回')">已退回</el-button>
              </el-col>
              <el-col :span="16">
                <i class="leftLine"></i> 保证金类型
                <el-select v-model="marginStyle" clearable placeholder="请选择" size="mini" @change="searchState">
                  <el-option v-for="item in options2" :key="item.value " :label="item.value" :value="item.value"></el-option>
                </el-select>
                <el-button size="small" @click="btnclickFun('投标保证金')" style="margin-left:15px">投标保证金</el-button>
                <el-button size="small" @click="btnclickFun('投标资信金')">投标资信金</el-button>
                <el-button size="small" @click="btnclickFun('履约保证金')">履约保证金</el-button>
                <el-button size="small" @click="btnclickFun('农民工工资保证金')">农民工工资保证金</el-button>
                <el-button size="small" @click="btnclickFun('银行履约保证金')">银行履约保证金</el-button>
                <el-button size="small" @click="btnclickFun('其他保证金')">其他保证金</el-button>
              </el-col>
            </el-row> -->
          </div>
      </template>
      <template>
        <div class="fina_applica_center">
          <qqt-table  ref="table" :exportData="exportData" :dynamicHeader="dynamicHeader" :data="tableData" :rowHeader="rowHeader" :option="tableOption" @page="pageChange" @selectionChange="selectChange"></qqt-table>
        </div>
          <!-- @selectionChange="selectChange" -->
      </template>
    </d2-container>
    <pay-model v-else @cancelBtn="cancelFun" :modelData="editData"></pay-model>
</template>

<script>
let that = this;
import qqtTable from '../../../components/qqt-subassembly/qqt-table/qqt-table';
import addModel from './components/marginApplicationAdd';
import payModel from './components/payDialog';
import { getMarginPaymentList,getMarginPaymentAdd,getMarginPaymentSearchList} from '../../../api/financialManagement/marginApplication'
import {getMarginPaymentlById,queryDicById,getByAccountTypeListAll} from '../../../api/jointProject/index'
import { PROJECT_GETINFOID } from '../../../enum/PROJECT'
import util  from '@/libs/util';
export default {
  components: {
      qqtTable,
      payModel,
      addModel
  },
  data() {
    return {
      changeModel: true,
      tableData: {},
      editData:{},
      cashType: [],
      marginState: '',
      // options1: [
      //   { value: '全部', },
      //   { value: '未退回', },
      //   { value: '已退回', }, 
      // ],
      marginStyle: '',
      options2: [
        { value: '投标保证金', },
        { value: '投标资信金', },
        { value: '履约保证金', },
        { value: '农民工工资保证金', },
        { value: '银行履约保证金', },
        { value: '其他保证金', },
      ],
      dynamicHeader: {
          tableId: 'T_1572601657222',
          isSave: false
      },
      exportData: [],
      collectUnitAccount: [],
      dateTime: null,
      rowHeader: [
          {
              prop: 'marginCode',
              label: '缴纳编号',
              width: 150,
              isShow: true,
              render: (h,params) =>{
                let text = params.row.marginCode;
                return h('div',{
                    class: {
                        'typefaceColor': true, 
                    },
                    on: {
                        click: () => {
                          getMarginPaymentlById({
                              id: params.row.id
                          }).then(res => {
                              this.$router.push({
                                  path: 'cashAdd',
                                  name: 'cashAdd',
                                  params: {
                                      isDetail: true,
                                      isAdd : false,
                                      cashType: this.cashType,
                                      collectUnitAccount: this.collectUnitAccount,
                                      cashInfo: res
                                  }
                              })
                          })
                        }
                    }
                },text)
              }
          },
          {
              prop: 'premiumReceived',
              label: '缴纳金额',
              isShow: true,
              render:(h,params) =>{
                return h('div',{ }, util.moneyTransform(params.row.premiumReceived))
              }
          },
          {
              prop: 'projectTypeName',
              label: '项目类型',
              width: '100px',
              isShow: true,
              render:(h,params) =>{
                return h('div',{
                }, params.row.projectTypeName = params.row.projectType === '1' ? '联营项目' : (params.row.projectType=== '0' ? '自营项目' : '其他'))
              }
          },
          {
              prop: 'projectName',
              label: '项目名称',
              width: 150,
              isShow: true
          },
          {
              prop: 'marginType',
              width: '120px',
              label: '保证金类型',
              isShow: true
          },
          {
              prop: 'collectUnitAccount',
              label: '收取单位名称',
              width: 250,
              isShow: true,
          },
          {
              prop: 'procStateName',
              label: '办理状态',
              width: '100px',
              isShow: true,
              render: (h,params) => {
                return h('div',{
                }, params.row.procStateName = util.handleState (params.row.procState))
              }
          },
          {
              prop: 'agent',
              label: '待办人',
              width: '90px',
              isShow: true
          },
          {
              prop: 'stateName',
              label: '审核状态',
              width: '100px',
              isShow: true,
              render: (h,params) =>{
                let text = '';
                if (params.row.state === '0') {
                  params.row.stateName = '未审核';
                } else if (params.row.state === '1') {
                  params.row.stateName = '审核';
                }
                return h('div',{
                   
                }, params.row.stateName)
              }
          },
          {
              prop: 'marginStateName',
              label: '保证金状态',
              width: '100px',
              isShow: true,
              render: (h,params) =>{
                let text = '';
                if (params.row.marginState === '0') {
                  params.row.marginStateName = '未退回';
                } else if (params.row.marginState === '1') {
                  params.row.marginStateName = '已退回';
                }
                return h('div',{
                   
                },params.row.marginStateName)
              }
          },
          {
              prop: 'createName',
              label: '申请人',
              isShow: true
          },
          {
              prop: 'createTime',
              label: '申请时间',
              width: 170,
              isShow: true
          },
          // {
          //   prop: '',
          //   label: '操作',
          //   isShow: true,
          //   render: (createElement, params) => {
          //       return createElement('div',
          //           [
          //               // createElement('el-button', {
          //               //     attrs: {
          //               //         type: 'text',
          //               //     },
          //               //     on: {
          //               //         click: () => {
          //               //           this.changeModel = false;
          //               //           this.editData = params.row;
          //               //         }
          //               //     }
          //               // }, '编辑'),
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
          //                         this.changeModel = false;
          //                         this.editData = params.row;
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
      pageInfo: {
          name: '',
          projectType: '',
          marginType:'',
          marginState: '',
          pageNo: 1,
          pageSize: 10,
          startDate: '',
          endDate: '',
          mini: '',
          max: '',
      },
      dataInfo: {
        pageNo: 1,
        pageSize: 10,
      },
      tableSelectData: []
    }
  },
  methods: {
    projectChange () {
        this.pageInfo.pageNo = '1';
        this.pageInfo.pageSize = '10';
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
    addAccountBtn () {
      this.$message.warning('暂未开发')
    },
    resetFun () {
      this.pageInfo.name = ''
      this.pageInfo.projectType = '';
      this.pageInfo.marginState = '';
      this.pageInfo.marginType = '';
      this.dateTime = null;
      this.pageInfo.startDate = '';
      this.pageInfo.endDate = '';
      this.marginStyle = '';
      this.pageInfo.mini = '';
      this.pageInfo.max = '';
      this.pageInfo.money = '';
      this.searchList();
    },
    moneyChange (value, type) {
      let reg = /^[0-9]*[0-9][0-9]*$/
      if(!reg.test(value)) {
        this.pageInfo[type] = ''
      }
    },
    // 搜索
    dataSearch () {
      this.pageInfo.marginState = '';
      this.pageInfo.marginType = '';
      if (this.dateTime) {
         this.pageInfo.startDate = this.dateTime[0] 
         this.pageInfo.endDate = this.dateTime[1] 
      } else {
        this.pageInfo.startDate = '';
        this.pageInfo.endDate = '';
      }
      this.searchList();
    },
    dateChange (time) {
      if (time) {
        this.pageInfo.startDate = time[0] 
        this.pageInfo.endDate = time[1] 
      } else {
        this.pageInfo.startDate = '';
        this.pageInfo.endDate = '';
      }
      this.searchList();
    },
    searchList () {
      if(this.pageInfo.mini === '' && this.pageInfo.max !== '' || this.pageInfo.mini !== '' && this.pageInfo.max === '') {
        this.$message.warning('请补全金额范围!!!')
        return
      }
      if(this.pageInfo.mini !== '' && this.pageInfo.max !== '') {
        if(Number(this.pageInfo.mini) > Number(this.pageInfo.max)) {
          this.$message.warning('最小金额不能大于最大金额!!!')
          return
        } else {
          this.pageInfo['money'] = this.pageInfo.mini + ',' + this.pageInfo.max
        }
      }
      getMarginPaymentSearchList (this.pageInfo).then(res => {
          this.tableData = res;
      }).catch(err => {
          console.log(err);
      })
    },
    // 批量删除
    deleteAll () {

    },
    pageChange (data) {
      this.pageInfo.pageNo = data.current;
      this.pageInfo.pageSize = data.size;
      this.dataSearch();
    },
    selectChange (val) {
      this.tableSelectData = val
    },
    clearState (value) {
      this.marginStyle = '';
    },
    searchState (val) {
      if(val !== '') {
        console.log(val);
        this.btnclickFun(val)
      } else {
        this.getTabelData()
      }
    },
    btnclickFun (data) {
      switch(data) {
        case '已退回':
            this.pageInfo.marginState = '1';
            break;
        case '未退回':
            this.pageInfo.marginState = '0';
            break;
        case '投标保证金':
            this.pageInfo.marginType = '投标保证金';
            break;
        case '投标资信金':
            this.pageInfo.marginType = '投标资信金';
            break;
        case '履约保证金':
            this.pageInfo.marginType = '履约保证金';
            break;
        case '农民工工资保证金':
            this.pageInfo.marginType = '农民工工资保证金';
            break;
        case '银行履约保证金':
            this.pageInfo.marginType = '银行履约保证金';
            break;
        case '其他保证金':
            this.pageInfo.marginType = '其他保证金';
            break;
      } 
      this.searchList();
    },
    getTabelData (data) {
        getMarginPaymentSearchList (this.dataInfo).then(res => {
            this.tableData = res;
        }).catch(err => {
            console.log(err);
        })
    },
    cancelFun () {
      this.changeModel = true;
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
    }
  },
  mounted () {
      this.getTabelData();
      this.getCommonInfo()
  },
}
</script>

<style lang='scss' scoped>
  // .marginApplication {
  //   .leftLine {
  //     border-left: 3px solid #84b7fa;
  //     padding-right: 15px;
  //   }
   
  // }
  .customer-list-header{
    .el-form-item{ margin-bottom: 12px !important; }
  }
</style>
<style lang='scss'>
  .marginApplication .d2-container-full__header{
    padding-bottom: 0px !important;
  }
  .el-range-separator{
    display: contents !important;
  }
  .customer-list-header{
    .el-date-editor .el-range-input { width: 43% !important; }
  }
</style>