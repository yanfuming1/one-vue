<template>
    <d2-container class="commonVal">
        <template  slot="header">
            <div class="customer-list-header" >
              <el-form :inline="true" class="demo-form-inline " :model="searchData" ref="form" size="mini">
                  <el-form-item label="发起时间:" >
                       <el-date-picker
                        style="width:250px"
                        v-model="dateTime"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        @change="dateChange"
                        value-format="yyyy-MM-dd"
                        end-placeholder="结束日期">
                      </el-date-picker>
                  </el-form-item>
                  <el-form-item label="流程状态:" v-if="requestType !== 'SEND_BACK'">
                      <el-select v-model="searchData.processState" placeholder="请选择流程状态" @change="processChange" clearable >
                        <el-option key="待审批" label="待审批" value="2"></el-option>
                        <el-option key="待提交" label="待提交" value="6"></el-option>
                        <el-option key="审批中" label="审批中" value="3"></el-option>
                        <el-option key="已驳回" label="已驳回" value="4"></el-option>
                        <el-option key="已作废" label="已作废" value="5"></el-option>
                        <el-option key="已完结" label="已完结" value="10"></el-option>
                      </el-select>
                  </el-form-item>
                  <slot name="sendBackDel"></slot>
                  <el-form-item>
                      <el-button  type="info" @click="resetFun()">重置</el-button>
                  </el-form-item>
                  <el-form-item label prop="keywords">
                    <el-input v-model="searchData.keywords" prefix-icon="el-icon-search" placeholder="请输入内容" style="width: 200px;" :clearable="true"/>
                  </el-form-item>
                  <el-form-item>
                      <el-button type="primary" @click="dataSearch(true)">搜索</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button size="mini" class="button-group" icon="el-icon-printer" @click="printTable()">打印</el-button>
                  </el-form-item>
              </el-form>
              <el-row>
                <el-col >
                  <i class="leftLine" ></i> 流程分类
                    <el-button  v-for="(item, index) in modelList" :key="index" size="mini" @click="modelClick(item.id)">{{item.name}}</el-button>
                </el-col>
              </el-row>
            </div>
        </template>
         <template>
           <div  class="fina_applica_center">
            <qqt-table :data="tableData" 
              :rowHeader="rowHeader" 
              :option="tableOption"           
              @page="pageChange"
              @selectionChange="selectChange"
              ref="table" >
            </qqt-table>
           </div>
        </template>
        <draw-off :drawerShow="drawerShow" v-if="drawerShow" @drawClose="drawClose" :procInstId="procInstId"></draw-off>
     </d2-container>
</template>

<script>
  import qqtTable from '../../../../components/qqt-subassembly/qqt-table/qqt-table';
  import { getProcessPage, getModelList, hasten,pendingCount} from '../../../../api/approval/common';
  import drawOff from './drawOff';
  import { mapActions } from 'vuex';
  import util from '@/libs/util.js';
  export default {
    name:'common',
    components: {
      qqtTable,
      drawOff
    },
    props: {
      requestType: {
        type: String,
        default: '',
      },
      refresh: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      let that = this;
      return {
        procInstId:'',
        tableData: {},
        modelList: [],
        selectData: [],
        dateTime:null,
        drawerShow:false,
        searchData:{
          afterDate: '',
          beforeDate: '',
          keywords: '',
          pageNo: '',
          pageSize: '',
          processState: '',
          procDefKey: '',
          requestType: this.requestType,
        },
        rowHeader: [
          {
              prop: 'uniqueName',
              label: '流程编码',
              isShow: true,
              minWidth: '170px',
              render: (h,params) =>{
                params.row.uniqueName = params.row.processVariables ? params.row.processVariables.unique : '';
                return h('div',{
                  style:{
                   
                  },
                },params.row.uniqueName)
              }
          },
          {
              prop: 'titleName',
              label: '标题',
              isShow: true,
              minWidth: '250px',
              render: (h,params) =>{
                params.row.titleName = params.row.processVariables ? params.row.processVariables.title : '';
                return h('div',{
                  class: {
                        'typefaceColor': true, 
                  },
                  on:{
                    click (){
                      that.updataApprovalRouter (params.row)
                    }
                  }
                },params.row.titleName)
              }
          },
          {
              prop: 'procDefName',
              label: '流程名称',
              width: '150px',
              isShow: true,
          },
          {
              prop: 'initiatorUserName',
              label: '申请人',
              width: '100px',
              isShow: true,
              render: (h,params) =>{
                params.row.initiatorUserName = params.row.processVariables ? params.row.processVariables.initiatorUserName : '';
                return h('div',{
                },params.row.initiatorUserName)
              }
          },
          {
              prop: 'procDefKeyName',
              label: '流程分类',
              width: '100px',
              isShow: true,
              render: (h, params) => {
                let text = params.row.procDefKey;
                let name ='';
                for (let i = 0; i < this.modelList.length; i++) {
                  if (text === this.modelList[i].id) {
                    name = this.modelList[i].name
                  }
                }
                params.row.procDefKeyName = name ? name : '';
                return h('div',{

                },name)
              }
          },
          {
              prop: 'projectName',
              width: '120px',
              label: '关联项目',
              isShow: true,
              render: (h,params) =>{
                params.row.projectName = params.row.processVariables ? params.row.processVariables.projectName : '';
                return h('div',{
                },params.row.projectName)
              }
          },
          {
              prop: 'procStateName',
              label: '流程状态',
              width: '100px',
              isShow: true,
              render: (h, parms) => {
                  return h('div', {},
                      parms.row.procStateName = util.handleState (parms.row.processVariables.processState)
                  )
              }
          },
          {
              prop: 'taskName',
              width: '100px',
              label: '流程节点',
          },
          {
              prop: 'startTime',
              width: '160px',
              label: '审批开始时间',
              isShow: true
          },
          {
              prop: 'endTime',
              width: '160px',
              label: '审批结束时间',
              isShow: true
          },
          {
              prop: 'durationName',
              width: '100px',
              label: '审批用时',
              isShow: true,
              render: (h,params) =>{
                let text = '';
                if (params.row.endTime) {
                  // text = parseFloat(params.row.duration/(3600 * 1000)).toFixed(2) + '时';
                    params.row.durationName = util.formatDuring(params.row.duration)
                }
                return h ('div',{

                },params.row.durationName)
              }
          },
          {
              prop: 'hastenCountName',
              width: '100px',
              label: '催办次数',
              isShow: true,
              render: (h,params) =>{
                params.row.hastenCountName = params.row.taskLocalVariables ? params.row.taskLocalVariables.hastenCount : 0;
                return h('div',{
                }, params.row.hastenCountName)
              }
          },
          {
            prop: '',
            width: this.requestType === 'APPLYING' ? '170px' : '116px',
            label: '审批记录',
            isShow: true,
            fixed:'right',
            render: (h, params) => {
                let children = [];
                children.push(h('el-button',{
                    attrs: {
                        type: 'text',
                    },
                    on: {
                        click: () => {
                            this.drawerShow = true;
                            this.procInstId = params.row.procInstId;
                        }
                    }
                }, '查看'));
                if (this.requestType === 'APPLYING') {
                  children.push(h('el-button',{
                      attrs: {
                          type: 'text',
                      },
                      on: {
                          click: () => {
                            util.confirm('是否催办该流程？').then(res=>{
                              if (res) {
                                hasten (params.row.id).then(res => {
                                  if (res) {
                                    this.$message.success('催办成功')
                                    this.getTableData();
                                  }
                                })
                              }
                            })
                          }
                      }
                  }, '催办'));
                }
                return h('div',{
                  style: {
                    textAlign : 'center'
                  },
                },children)
            }
          }
      ],
      tableOption: {
        border: false,
        // isOpenSummary: true
      },
      }
    },
    methods: {
      dataSearch() {
        this.searchData.procDefKey = '';
        if (this.dateTime) {
          this.searchData.afterDate = this.dateTime[0] + ' 00:00:00';
          this.searchData.beforeDate = this.dateTime[1] + ' 23:59:59';;
          this.getTableData();
          this.selectData = [];

        } else {
          this.searchData.afterDate = '';
          this.searchData.beforeDate = '';
          this.getTableData();
        }
      },
      printTable () {
          this.$refs.table.printTable (this.selectTableData, 'startTime')
      },
      getTableData () {
        getProcessPage(this.searchData).then(res =>{
            this.tableData = res;
        })
        pendingCount().then(res=> {
          this.$store.commit('d2admin/badge/getBadge', res)
        })
      },
      pageChange (data) {
        this.searchData.pageNo = data.current;
        this.searchData.pageSize = data.size;
        this.dataSearch();
      },
      // 重置
      resetFun () {
        this.searchData.keywords = '';
        this.searchData.procDefKey = '';
        this.searchData.processState = '';
        this.searchData.pageNo = '1';
        this.searchData.pageSize = '10';
        this.dateTime = null;
        this.dataSearch();
      },
      // 日期事件
      dateChange (date) {
        if (date) {
          this.selectData.afterDate = date[0] + ' 00:00:00';
          this.selectData.beforeDate = date[1] + ' 23:59:59';
        } else {
          this.selectData.afterDate = '';
          this.selectData.beforeDate = '';
        }
        this.selectData = [];
        this.dataSearch(); 
      },
      selectChange (row) {
          this.selectData = row;
          this.$emit('selectChange',JSON.parse(JSON.stringify(row)))
      },
      modelClick (value) {
        this.searchData.procDefKey = value;
        this.getTableData();
      },
      drawClose () {
        this.drawerShow = false;
      },
      processChange (name) {
        this.searchData.processState = name;
        this.getTableData();
      },
      updataApprovalRouter (item) {
        let data = JSON.parse(JSON.stringify(item));
        data.pathName = this.$route.name;
        data['transform'] = this.pageShow (data)
        this.routerLink (data)
      },
      routerLink (data) {
        const { pathName, procInstId, taskId, transform, procDefId } = data
        const { relevancyId, degree, formKey, title } = data.processVariables
        this.$router.push({
          path: data.processVariables.formKey,
          name: data.processVariables.formKey,
          params: {
              detailData: JSON.stringify(data),
              title,
              taskId,
              degree,
              formKey,
              pathName,
              procDefId,
              transform,
              procInstId,
              relevancyId
          }
        })
      },
      pageShow (data) {
        let item = {
          isShowDetails: true
        }
        switch (data.pathName) {
          case 'sendBack':
            item.isShowDetails = false
            break;
          case 'examine':
            if (data && data.processVariables && data.processVariables.processState === '6') {
              item.isShowDetails = false
            }
            break
        }
        return item
      },
      ...mapActions('d2admin/page', [
          'close',
          'open' // 打开一个新页面
      ]),
    },
    mounted () {
      this.getTableData();
      getModelList().then(res =>{
        this.modelList = res;
      })
    
    },
    watch: {
      refresh(newValue, oldValue) {
        if (newValue) {
          console.log('refresh')
          this.getTableData();
        }
      }
    },
  }
</script>

<style lang='scss' scoped>
  .commonVal {
    .leftLine {
      border-left: 3px solid #84b7fa;
      padding-right: 15px;
    }
  }
</style>
<style lang='scss' >
  .commonVal {
    .d2-container-full__header{
      padding-bottom: 0px!important;
    }
  }
  .demo-form-inline {
    .el-range-editor--mini .el-range-separator{
      display: inline-table;
    }
  }
 
</style>