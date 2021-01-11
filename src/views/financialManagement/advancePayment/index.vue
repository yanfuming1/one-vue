<template>
     <d2-container class="advancePayment">
       <!-- <zc-input></zc-input> -->
        <template  slot="header" style="padding-bottom:0">
            <div class="customer-list-header">
              <el-form :inline="true" class="demo-form-inline " :model="form" ref="form" size="mini">
                  <el-form-item label prop="name">
                    <el-input v-model="page.name" prefix-icon="el-icon-search" placeholder="请输入内容" style="width: 200px;" :clearable="true"/>
                  </el-form-item>
                  <el-form-item>项目类型:</el-form-item>
                  <el-form-item label prop="projectType">
                      <el-select v-model="page.projectType" @change="typeChange" placeholder="请选择要搜索的项目类型" style="width: 180px;" clearable >
                          <el-option label="联营项目" value="1" />
                          <el-option label="自营项目" value="0" />
                          <el-option label="其他" value="2" />
                      </el-select>
                  </el-form-item>
                  <el-form-item>是否计息:</el-form-item>
                  <el-form-item label prop="isRate">
                      <el-select v-model="page.isRate" @change="rateChange" placeholder="请选择是否计息" style="width: 140px;" clearable >
                          <el-option label="计息" value="1" />
                          <el-option label="不计息" value="0" />
                      </el-select>
                  </el-form-item>
                  <el-form-item label prop="keywords"> 
                       <el-date-picker
                        v-model="dateTime"
                        style="width:250px"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        value-format="yyyy-MM-dd"
                        @change="dateChange"
                        end-placeholder="结束日期">
                      </el-date-picker>
                  </el-form-item>
                  <el-form-item>最小金额:</el-form-item>
                  <el-form-item label prop="mini">
                    <el-input v-model="page.mini" style="width:140px;" @input="val => moneyChange(val, 'mini')" placeholder="请输入最小金额" clearable/>
                  </el-form-item>
                  <el-form-item>最大金额:</el-form-item>
                  <el-form-item label prop="max">
                    <el-input v-model="page.max" style="width:140px;" @input="val => moneyChange(val, 'max')" placeholder="请输入最大金额" clearable/>
                  </el-form-item>
                  <el-form-item>
                      <el-button type="primary" @click="dataSearch(true)">搜索</el-button>
                  </el-form-item>
                  <el-form-item>
                      <el-button type="info" @click="resetFun">重置</el-button>
                  </el-form-item>
                  <el-button-group  class="advance-payment-button-group">
                    <el-button size="mini" @click="uploadFun" icon="el-icon-upload2">导出</el-button>
                    <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                  </el-button-group>
              </el-form>
              <!-- <el-row class="d2-mt-10">
                <el-col :span="12">
                  <i class="leftLine"></i> 审核状态
                  <el-button size="small" @click="auditClick('全部')" style="margin-left:15px">全部</el-button>
                  <el-button size="small" @click="auditClick('未审核')">未审核</el-button>
                  <el-button size="small" @click="auditClick('已审核')">已审核</el-button>
                </el-col>
              </el-row> -->
            </div>
        </template>
        <template>
          <div class="fina_applica_center">
            <qqt-table  ref="table" :exportData="exportData" :data="tableData" :rowHeader="rowHeader" :option="tableOption" @page="pageChange" @selectionChange="selectChange"></qqt-table>
          </div>
            <!-- @selectionChange="selectChange" -->
        </template>
     </d2-container>
</template>

<script>
let that = this;
import qqtTable from '../../../components/qqt-subassembly/qqt-table/qqt-table';
import zcInput from './components/qqt-numberInput/input-number';
import {financeMatEndowment} from '../../../api/financialManagement/advancePayment/index';
import util from '../../../libs/util';
export default {
  components: {
      qqtTable,
      zcInput
  },
  data() {
    return {
      form: {
          keywords: '',
          bstatus: '1'
      },
      tableData: {},
      dateTime: null,
      exportData: [],
      rowHeader: [
          {
              prop: 'projectType',
              label: '项目类型',
              isShow: true,
              render: (h,params) =>{
                return h('div',{}, params.row.projectType = params.row.projectType === '1' ? '联营' : '自营')
              }
          },
          {
              prop: 'projectName',
              label: '项目名称',
              isShow: true
          },
          {
              prop: 'associatedPerson',
              label: '联营人',
              isShow: true
          },
          {
              prop: 'matEndowmentStr',
              label: '垫付金额（元）',
              isShow: true,
              render: (h,params) =>{
                return h('span',{}, params.row.matEndowmentStr = util.moneyTransform(params.row.matEndowment))
              }
          },
          // {
          //     prop: 'isPay',
          //     label: '是否支付',
          //     isShow: true,
          //     render: (h,params) =>{
          //       let text = params.row.isPay === '1' ? '支付' : '未支付'
          //       return h('div',{

          //       },text)
          //     }
          // },
          {
              prop: 'isRateName',
              label: '是否计息',
              isShow: true,
              render: (h,params) =>{
                return h('div',{

                },params.row.isRateName = params.row.isRate === '1' ? '计息' : '不计息')
              }
          },
          {
              prop: 'interestAccrualMannerName',
              label: '计息方式',
              isShow: true,
              render: (h,params) =>{
                let text = '';
                switch (params.row.interestAccrualManner) {
                  case '1197335230566318080':
                    params.row.interestAccrualMannerName = '日息'
                    break;
                  case '1197334487260151808':
                    params.row.interestAccrualMannerName = '月息'
                    break;
                  case '1197317410252005376':
                    params.row.interestAccrualMannerName = '年息'
                    break;
                  default:
                    params.row.interestAccrualMannerName = ''
                    break;
                }
                return h('div',{

                },params.row.interestAccrualMannerName)
              }
          },
          {
              prop: 'interestRateStr',
              label: '利率',
              isShow: true,
              render: (h,params) =>{
                return h('div',{  }, params.row.interestRateStr = params.row.interestRate ?  params.row.interestRate + ' %' : 0)
              }
          },
          {
              prop: 'dateValue',
              label: '起息日期',
              width: 160,
              isShow: true
          },
          {
              prop: 'updateTime', //后台约定
              label: '结息日期',
              width: 160,
              isShow: true
          },
          {
              prop: 'balance', //前后台约定
              label: '利息',
              isShow: true
          },
          
          {
              prop: 'stateName',
              label: '审核状态',
              isShow: true,
              render: (h,params) =>{
                return h('div',{

                },params.row.stateName = params.row.state === '1' ? '审核' : '未审核')
              }
          },
          // {
          //   prop: '',
          //   label: '操作',
          //   isShow: true,
          //   render: function (createElement, params) {
          //       return createElement('div',
          //           [
          //               createElement('el-button', {
          //                   attrs: {
          //                       type: 'text',
          //                   },
          //                   on: {
          //                       click: () => {
          //                           that.$message.success("你点击了审核状态")
          //                       }
          //                   }
          //               }, '审核状态'),
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
          name: '',
          marginState: '',
          marginType: '',
          pay: '',
          projectType: '',
          isRate: '',
          mini: '',
          max: '',
      },
      tableSelectData: []
    }
  },
  methods: {
    resetFun() {
      this.dateTime = null;
      this.page = {
        pageNo: 1,
        pageSize: 10,
        name: '',
        marginState: '',
        marginType: '',
        pay: '',
        projectType: '',
        isRate: '',
        mini: '',
        max: '',
      }
      this.getTableData()
    },
    moneyChange (value, type) {
      let reg = /^[0-9]*[0-9][0-9]*$/
      if(!reg.test(value)) {
        this.page[type] = ''
      }
    },
    getExportData () {
        this.exportData = JSON.parse(JSON.stringify((this.tableData.records))) || [];
        return new Promise((resolve, reject) => {
          this.exportData.forEach((item,index) => {
            item.state = item.state === '0' ? '未审核' : '已审核';
            item.isRate = item.isRate === '1' ? '计息' : '不计息';
            item.isPay = item.isPay === '1' ? '支付' : '未支付';
            item.interestRate = item.interestRate ?  item.interestRate + ' %' : 0
            switch (item.interestAccrualManner) {
              case '1197335230566318080':
                item.interestAccrualManner = '日息'
                break;
              case '1197334487260151808':
                item.interestAccrualManner = '月息'
                break;
              case '1197317410252005376':
                item.interestAccrualManner = '年息'
                break;
              default:
                item.interestAccrualManner = ''
                break;
            }
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

    },
    dateChange (date) {
        if(this.page.mini === '' && this.page.max !== '' || this.page.mini !== '' && this.page.max === '') {
          this.$message.warning('请补全金额范围!!!')
          return
        }
        if(this.page.mini !== '' && this.page.max !== '') {
          if(Number(this.page.mini) > Number(this.page.max)) {
            this.$message.warning('最小金额不能大于最大金额!!!')
            return
          } else {
            this.page['money'] = this.page.mini + ',' + this.page.max
          }
        } else {
          this.page['money'] = ''
        }
        if (date) {
          this.page.createTime = date[0] + ' 00:00:00';
          this.page.updateTime = date[1] + ' 23:59:59';
        } else {
          this.page.createTime = ''
          this.page.updateTime = ''
        }
        financeMatEndowment (this.page).then(res => {
            this.tableData = res;
        })
    },
    // 搜索
    dataSearch () {
      this.page.pageNo = '1';
      this.page.pageSize = '10';
      this.getTableData()
    },
    // 获取table数据
    getTableData () {
      if(this.page.mini === '' && this.page.max !== '' || this.page.mini !== '' && this.page.max === '') {
        this.$message.warning('请补全金额范围!!!')
        return
      }
      if(this.page.mini !== '' && this.page.max !== '') {
        if(Number(this.page.mini) > Number(this.page.max)) {
          this.$message.warning('最小金额不能大于最大金额!!!')
          return
        } else {
          this.page['money'] = this.page.mini + ',' + this.page.max
        }
      } else {
        this.page['money'] = ''
      }
      if (this.dateTime) {
          this.page.createTime = this.dateTime[0] + ' 00:00:00';
          this.page.updateTime = this.dateTime[1] + ' 23:59:59';
      } else {
          this.page.createTime = ''
          this.page.updateTime = ''
      }
      financeMatEndowment (this.page).then(res => {
          this.tableData = res;
      })
    },
    pageChange (data) {
      this.page.pageNo = data.current;
      this.page.pageSize = data.size;
      this.getTableData();
    },
    selectChange (val) {
      this.tableSelectData = val
    },
    auditClick (type) {
      console.log(type)
    },
    //
    typeChange (val) {
      this.page.projectType = val;
      this.getTableData()
    },
    rateChange (val) {
      this.page.isRate = val;
      this.getTableData()
    },
    printTable () {
      this.$refs.table.printTable (this.tableSelectData)
    },
  },
  mounted () {
   this.getTableData()
  },
}
</script>

<style lang='scss' scoped>
  .advancePayment {
    .leftLine {
      border-left: 3px solid #84b7fa;
      padding-right: 15px;
    }
    .advance-payment-button-group {
      margin-top: 10px;
    }
  }
  .customer-list-header .el-form-item{ margin-bottom: 0px !important; }
</style>
<style >
 .advancePayment .d2-container-full__header{
    padding-bottom: 0px !important;
  }
</style>