<template>
     <d2-container class="fina_applica" v-if="dialogShow=== '默认'">
        <template  slot="header" style="padding-bottom:0">
            <div class="customer-list-header">
              <el-form :inline="true" class="demo-form-inline " :model="search" ref="form" size="mini">
                  <el-form-item v-if="auth.add">
                    <el-button type="primary" @click="addAccountBtn">添加</el-button>
                  </el-form-item>
                  <el-form-item v-if="auth.copy">
                    <el-button type="primary" @click="copyBtn">复制</el-button>
                  </el-form-item>
                  <el-form-item label prop="keywords">
                    <el-input v-model="search.keywords" prefix-icon="el-icon-search" placeholder="请输入内容" style="width: 200px;" :clearable="true"/>
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
                  <el-form-item>
                      <el-button type="primary" @click="dataSearch('')">搜索</el-button>
                  </el-form-item>
                  <el-form-item label >
                    <el-select v-model="search.state" placeholder="请选择办理状态" @change="stateChange" style="width: 140px;" clearable >
                      <el-option label="初始化" value="1" />
                      <el-option label="待审批" value="2" />
                      <el-option label="审批中" value="3" />
                      <el-option label="已驳回" value="4" />
                      <el-option label="已作废" value="5" />
                      <el-option label="已完结" value="10" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label >
                    <el-select v-model="search.isCheck" placeholder="请选择审核状态" @change="stateChange" style="width: 140px;" clearable >
                      <el-option label="审核" value="1" />
                      <el-option label="未审核" value="0" />
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                      <el-button v-if="auth.delBat" type="primary" @click="deleteAll">批量删除</el-button>
                  </el-form-item>
                  <!-- <el-form-item >
                      <el-button type="primary"  @click="deleteAll">批量删除</el-button>
                  </el-form-item> -->
                  <el-form-item >
                      <el-button type="success" @click="isChick">审核</el-button>
                  </el-form-item>
                  <el-form-item>
                      <el-button type="success" @click="unIsChick">反审核</el-button>
                  </el-form-item>
                  <el-form-item>
                      <el-button type="info" @click="resetFun">重置</el-button>
                  </el-form-item>
                  <el-button-group>
                    <el-button size="mini"  @click="uploadFun" icon="el-icon-upload2">导出</el-button>
                    <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                  </el-button-group>
              </el-form>
            </div>
        </template>
        <template >
          <div class="fina_applica_center">
            <qqt-table :data="tableData" 
              ref="table"
              :exportData="exportData"
              :rowHeader="rowHeader" 
              :option="tableOption"
              :dynamicHeader="dynamicHeader"
              @page="pageChange"
              @selectionChange="selectChange">
            </qqt-table>
          </div>
            <!-- @selectionChange="selectChange" -->
        </template>
        <div>
          <!-- :remoteFuncs="remoteFuncs"-->
            <charge-off :drawer="drawer" v-if="drawer"  :modelData="modelData" @change="drawerClose" @successFun="drawerSuccess"></charge-off>
        </div>
     </d2-container>
     <add-dialog v-else-if="dialogShow === '新增'" @cancelBtn="cancelFun" @successFun="successFun"></add-dialog>
     <details-card v-else-if="dialogShow === '详情'" @cancelBtn="cancelFun" :isJump="isJump" :isCopy="isCopy" :type="saveType" :isSendBack="isSendBack" :editShow="editShow"  :pdfId="pdfId" :procInstId="procInstId" @successFun="successFun" :detailData="detailData"></details-card>
     <details-change  @successFun="successFun" @cancelBtn="cancelFun"  :pushLogData="pushLogData" v-else></details-change>
</template>

<script>
import { getTableList,getSelfTableList,getTableAdd,queryById,getAgainst,getCheck,deleteRow,deleteBatch,queryByState,
deleteSelfBatch,deleteSelfRow,getSelfVerificationAdd,updateSelfAfterSubmit,getSelfTableAdd
} from '../../../api/financialManagement/staffLoan';
import qqtTable from '../../../components/qqt-subassembly/qqt-table/qqt-table';
import chargeOff from './components/chargeOff';
import addDialog from './components/addDialog';
import detailsCard from './components/detailsCard';
import detailsChange from './components/detailsChange';
import util from '@/libs/util.js';
import { mapState } from 'vuex'

let that = this;
export default {
  components: {
      qqtTable,
      addDialog,
      detailsCard,
      detailsChange,
      chargeOff
  },
  data() {
    return {
      state:'',
      dateTime: null,
      fileList: [],
      exportData: [],
      dialogShow: '默认',
      saveType: '',
      isSendBack: false,
      isJump:false,
      drawer: false,
      isCopy: false,
      editShow: false,
      dynamicHeader: {
          tableId: 'T_1572601657666',
          isSave: false
      },
      form: {
          keywords: '',
          bstatus: '1'
      },
      tableData: {},
      modelData: {},
      detailData: {},
      pdfId: '',
      procInstId: '',
      rowHeader: [
          {
              prop: 'borrowmoney',
              label: '借款金额（元）',
              isShow: true,
              width:'150px',
              isOpenSummary: true,
              render: (h,params) =>{
                let text = (params.row.borrowmoney-0).toFixed(2)
                return h('div',{
                    class: {
                        'typefaceColor': true, 
                    },
                    on: {
                        click: () => {
                           queryById({id:params.row.id}).then(res=>{
                              this.fileList = res.fileList;
                            }).catch(()=>{
                              this.$message.error('数据查询失败')
                            }).finally((data)=>{
                              this.pdfId = params.row.procinstid;
                              this.procInstId = params.row.procinstid;
                              this.detailData = params.row;
                              this.isCopy = false;
                              this.dialogShow = '详情';
                              this.editShow = false;
                              this.isJump = false;
                              this.isSendBack = false;
                              this.detailData.fileList = this.fileList;
                            })
                        }
                    }
                },text)
              }
          },
          {
              prop: 'procstateName',
              label: '办理状态',
              width:'100px',
              isShow: true,
              render: (h,params) =>{
                let text = '';
                if (params.row.procstate === '1') {
                  params.row.procstateName = '初始化';
                } else if (params.row.procstate === '2') {
                  params.row.procstateName = '待审批';
                } else  if (params.row.procstate === '3'){
                  params.row.procstateName = '审批中';
                } else  if (params.row.procstate === '4'){
                  params.row.procstateName = '已驳回';
                } else  if (params.row.procstate === '5'){
                  params.row.procstateName = '已作废';
                } else  if (params.row.procstate === '10'){
                  params.row.procstateName = '已完结';
                } 
                return h('div',{
                },params.row.procstateName)
              }
          },
          {
              prop: 'isCheckName',
              label: '审核状态',
              width:'100px',
              isShow: true,
              render: (h,params) =>{
                let text = '';
                if (params.row.isCheck === '0') {
                  params.row.isCheckName = '未审核';
                } else if (params.row.isCheck === '1') {
                  params.row.isCheckName = '审核';
                }
                return h('div',{
                   
                },params.row.isCheckName)
              }
          },
          {
              prop: 'nominee',
              label: '待办人',
              isShow: true,
              width:'100px',
          },
          {
              prop: 'borrowreason',
              label: '借款事由',
              isShow: true,
              width:'150px',
          },
          {
              prop: 'borrowman',
              label: '借款人',
              isShow: true,
              width:'100px'
          },
          {
              prop: 'borrowtime',
              label: '借款时间',
              isShow: true,
              width:'170px'
          },
          {
              prop: 'verificationmoneyName',
              label: '核销状态',
              isShow: true,
              width:'100px',
              render: (h, params) =>{
                let text = '';
                if (params.row.verificationmoney - 0 === 0) {
                  params.row.verificationmoneyName = '未核销';
                } else if (params.row.owingmoney-0 === 0) {
                  params.row.verificationmoneyName = '全部核销';
                } else {
                  params.row.verificationmoneyName = '部分核销';
                }
                return h ('div',{
                      attrs: {
                          type: 'text',
                      },
                },params.row.verificationmoneyName)
              }
          },
          {
              prop: 'verificationmoneyName',
              label: '核销金额（元）',
              width: '140px',
              isShow: true,
              isOpenSummary: true,
              render: (h,params) => {
                params.row.verificationmoneyName = (params.row.verificationmoney-0).toFixed(2);
                return h('div', {
                      attrs: {
                          type: 'text',
                      },
                  },params.row.verificationmoneyName)
              }
          },
          {
              prop: 'owingmoney',
              width: '140px',
              label: '下欠金额（元）',
              isOpenSummary: true,
              isShow: true,
              render: (h,params) => {
                return h('div', {
                      attrs: {
                          type: 'text',
                      },
                  }, params.row.owingmoneyName = (params.row.owingmoney-0).toFixed(2))
              }
          },
          {
              prop: 'verificationmanName',
              width: '100px',
              label: '核销人',
              isShow: true,
              render: (h,params) => {
                return h('div', {}, params.row.verificationmanName = params.row.verificationman ? params.row.verificationman : '无')
              }
          },
          {
              width: '170px',
              prop: 'verificationtimeName',
              label: '核销时间',
              isShow: true,
              render: (h,params) => {
                return h('div', {}, params.row.verificationtimeName = params.row.verificationtime ? params.row.verificationtime : '无')
              }
          },
          // {
          //     prop: 'department',
          //     width:'180px',
          //     label: '工作部门',
          //     isShow: true,
          //     render: (h,params) =>{
          //       let text = '';
          //       if (params.row.department) {
          //         let isExist =  params.row.department.indexOf('null');
          //         if (isExist === -1) {
          //           text = params.row.department;
          //         } else {
          //           text = '';
          //         }
          //       }
          //       return h('div',{
          //       },text)
          //     }
          // },
          {
            prop: '',
            fixed:'right',
            width:'180px',
            label: '操作',
            isShow: true,
            render: (createElement, params) => {
                return createElement('div',
                    [
                        this.auth.verification ? createElement('el-button', {
                            attrs: {
                                type: 'text',
                                disabled: params.row.procstate === '10' && params.row.owingmoney - 0 > 0 ? false : true
                            },
                            style:{
                                color: params.row.procstate === '10' && params.row.owingmoney - 0 > 0 ? '#409EFF' : '#999',
                            },
                            on: {
                                click: () => {
                                    queryById({id:params.row.id}).then(res=>{
                                      this.modelData = res;
                                      this.drawer = true;
                                    }).catch(()=>{
                                      this.$message.error('数据查询失败')
                                    })
                                }
                            }
                        }, '核销') : '',
                        this.auth.edit ?  createElement('el-button', {
                            attrs: {
                                type: 'text',
                                disabled: params.row.procstate === '1'  ? false : true
                            },
                            style:{
                                color: params.row.procstate === '1' ? '#409EFF' : '#999',
                            },
                            on: {
                                click: () => {
                                    queryById({id:params.row.id}).then(res=>{
                                        console.log(JSON.parse(JSON.stringify(res)))
                                        this.pdfId = res.procinstid;
                                        this.procInstId = res.procinstid;
                                        this.dialogShow = '详情';
                                        if (res.procinstid) {
                                          this.editShow = false;
                                        } else {
                                          this.editShow = true;
                                        }
                                        this.isCopy = false;
                                        this.isJump = false;
                                        this.isSendBack = false;
                                        this.fileList = res.fileList;
                                        this.saveType = 'edit';
                                        this.detailData = res;
                                        this.detailData.fileList = this.fileList;
                                    }).catch(()=>{
                                      this.$message.error('数据查询失败')
                                    }).finally((data)=>{
                                     
                                    })
                                }
                            }
                        }, '编辑') : '',
                        this.auth.delBat ?  createElement('el-button', {
                            attrs: {
                                type: 'text',
                                disabled: params.row.procstate === '1'  ? false : true
                            },
                            style:{
                                color: params.row.procstate === '1' ? '#409EFF' : '#999',
                            },
                            on: {
                                  click: () => {
                                    util.confirm().then(res =>{
                                      if (res) {
                                        if(this.identification == '1') {
                                          deleteSelfRow ({id:params.row.id},this.selfSupportProject.projectCode).then(res=>{
                                            if (res.success){
                                                this.$message.success(res.message);
                                                this.getTableData();
                                            }
                                          })
                                        } else {
                                          deleteRow ({id:params.row.id,}).then(res=>{
                                            if (res.success){
                                                this.$message.success(res.message);
                                                this.getTableData();
                                            }
                                          })
                                        }
                                          
                                      }
                                    })
                                }
                            }
                        }, '删除') : '',
                        
                    ],
                )
            }
          }
      ],
      tableOption: {
        border: false,
        isOpenSummary: true,
      },
      page: {
        pageNo: 1,
        pageSize: 10,
      },
      search: {
        keywords: '',
        time: '',
        state: '',
        isCheck: '',
        pageNo: 1,
        pageSize: 10,
      },
      auth: {
        add: false,
        edit: false,
        delBat: false,
        copy: false,
        verification: false
      },
      selectRow: [],
      pushData: null,
      pushLogData: {},
      identification: null,
      
    }
  },
  methods: {
      // 导出
    getExportData () {
        this.exportData = JSON.parse(JSON.stringify((this.tableData.records))) || [];
        return new Promise((resolve, reject) => {
          this.exportData.forEach((item,index) => {
            item.procstate = util.handleState(item.procstate);
            item.isCheck = item.isCheck === '0' ? '未审核' : '已审核';
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
      this.dialogShow = '新增';
    },
    // 复制
    copyBtn () {
       if (this.selectRow.length > 0) {
          queryById({id:this.selectRow[0].id}).then((res)=>{
              this.dialogShow = '详情';
              this.saveType = 'copy';
              this.editShow = true;
              this.isSendBack = false;
              this.isJump = false;
              this.isCopy = true;
              res.createBy = '';
              res.createName = '';
              this.detailData = res;
              this.detailData.fileList = res.fileList;
            })
        } else {
          this.$message.error('请先选择要复制的数据')
        }
    },
    stateChange (value) {
      let url = this.identification == '1' ? getSelfTableList : getTableList
      this.identification == '1' ? this.search['projectCode'] = this.selfSupportProject.projectCode : this.search
      if (this.dateTime) {
         let time = this.dateTime[0] + ' 00:00:00' + ',' + this.dateTime[1] + ' 23:59:59';
         this.search.time = time;
      } else {
         this.search.time = '';
      }
      url (this.search).then(res => {
          this.tableData = res;
      }).catch(err => {
          console.log(err);
      });
    },
    // 搜索
    dataSearch (type) {
      let url = this.identification == '1' ? getSelfTableList : getTableList
      this.identification == '1' ? this.search['projectCode'] = this.selfSupportProject.projectCode : this.search
      if (this.dateTime) {
         let time = this.dateTime[0] + ' 00:00:00' + ',' + this.dateTime[1] + ' 23:59:59';
         this.search.time = time;
      } else {
         this.search.time = '';
      }
      if (type !== 'page') {
        this.search.pageNo = '1';
        this.search.pageSize = '10';
      }
      this.selectRow =[];
      url (this.search).then(res => {
          this.tableData = res;
      }).catch(err => {
          console.log(err);
      });
    },
    dateChange (date) {
      if (date) {
          let time = date[0] + ' 00:00:00' + ',' + date[1] + ' 23:59:59';
          this.search.time = time;
      } else {
         this.search.time = '';
      }
      this.selectRow =[];
      let url = this.identification == '1' ? getSelfTableList : getTableList
      this.identification == '1' ? this.search['projectCode'] = this.selfSupportProject.projectCode : this.search
      url (this.search).then(res => {
          this.tableData = res;
      }).catch(err => {
          console.log(err);
      });
    },
    // 批量删除
    deleteAll () {
        if (this.selectRow.length > 0) {
          this.$confirm('是否删除选择行数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
              let ids = '';
              let indexs = '';
              let flag = false;
              for (let i = 0; i < this.selectRow.length; i++) {
                if (this.selectRow[i].procstate != '1' &&  this.selectRow[i].procstate != '4') {
                  let idxIndex = this.tableData.records.findIndex(item => item.id === this.selectRow[i].id);
                  indexs += idxIndex - 0 + 1 +',';
                  flag = true;
                }
                ids += this.selectRow[i].id + ',';
              }
              if (flag) {
                this.$message.error( `请确认第${indexs.substring(0,indexs.length-1)}行的状态，只有初始化和已驳回支持删除`);
                return
              }
              if(this.identification == '1') {
                  deleteSelfBatch ({ids:ids.substring(0,ids.length-1)},this.selfSupportProject.projectCode).then(res => {
                      this.getTableData();
                      this.$message.success('删除成功')
                  }).catch(err => {
                      console.log(err);
                  });
              }else {
                  deleteBatch ({ids:ids.substring(0,ids.length-1)}).then(res => {
                      this.getTableData();
                      this.$message.success('删除成功')
                  }).catch(err => {
                      console.log(err);
                  });
              }
              
          })
        } else {
            this.$message.error('请选择要批量删除的数据')
        }
    },
    isChick () {
      if (this.selectRow.length === 1) {
        if (this.selectRow[0].isCheck === '0') {
          this.$confirm('您是否要审核该条数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            getCheck({id: this.selectRow[0].id}).then(res=> {
              if (res.success) {
                this.$message.success(res.message);
              } else {
                this.$message.error(res.message);
              }
              this.getTableData();
            })
          })
        } else {
          this.$message.error('该数据已审核不支持继续审核');
        }
      } else if (this.selectRow.length === 0) {
        this.$message.error('请选择要审核的数据');
      } else {
        this.$message.error('只支持单条数据操作');
      }
    },
    unIsChick () {
      if (this.selectRow.length === 1) {
        if (this.selectRow[0].isCheck === '1') {
          this.$confirm('您是否要反审核该条数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            getAgainst({id: this.selectRow[0].id}).then(res=> {
              if (res.success) {
                this.$message.success(res.message);
              } else {
                this.$message.error(res.message);
              }
              this.getTableData();
            })
          })
        } else {
          this.$message.error('该数据未审核不支持继续反审核');
        }
      } else if (this.selectRow.length === 0) {
        this.$message.error('请选择要审核的数据');
      } else {
        this.$message.error('只支持单条数据操作');
      }
    },
    // 重置
    resetFun () {
      this.search.keywords = '';
      this.search.state = '';
      this.search.isCheck = '';
      this.dateTime = null;
      this.getTableData();
    },
    drawerSuccess () {
      this.drawer = false;
      this.getTableData();
      this.$message.success('核销成功')
    },
    // 添加成功之后回调
    successFun (ref) {
      this.dialogShow = '默认';
      this.getTableData();
      if (this.saveType=== 'edit') {
        this.$message.success('保存成功')
      } else {
        this.$message.success('添加成功')
      }
    },
    pageChange (data) {
      this.search.pageNo = data.current;
      this.search.pageSize = data.size;
      this.dataSearch('page');
    },
    selectChange (val) {
      this.selectRow = val;
    },
    // 取消
    cancelFun () {
      this.dialogShow = '默认';
      this.getTableData();
    },
    // 获取table数据
    getTableData () {
      let url = this.identification == '1' ? getSelfTableList : getTableList
      this.identification == '1' ? this.page.projectCode = this.selfSupportProject.projectCode : this.page 
      // this.identification == '1' ?  this.page.projectCode = this.selfSupportProject.projectCode
      url (this.page).then(res => {
          this.tableData = res;
      }).catch(err => {
          console.log(err);
      });
    },
    drawerClose () {
      this.drawer = false;
      this.getTableData();
    },
    _validationAuth () {
      this.auth.add = this.identification === '1' ? this.$has ('self:employeeBorrow:add') : this.$has ('finance:employeeBorrow:add')
      this.auth.edit = this.identification === '1' ? this.$has ('self:employeeBorrow:edit') : this.$has ('finance:employeeBorrow:edit')
      this.auth.copy = this.identification === '1' ? this.$has ('self:employeeBorrow:copy') : this.$has ('finance:employeeBorrow:copy')
      this.auth.delBat = this.identification === '1' ? this.$has ('self:employeeBorrow:deleteBatch') : this.$has ('finance:employeeBorrow:delete')
      this.auth.verification = this.identification === '1' ? this.$has ('self:employeeBorrow:verification') : this.$has ('finance:employeeBorrow:verification')
    },
    init () {
      if (this.$route.params) { 
        this.identification = this.$route.params.identification || null
        this.identification == '1' ? this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad') : this.getTableData ()
      }
    },

    printTable () {
      this.$refs.table.printTable (this.selectRow)
    }

  },
  mounted () {
    let pushObj = this.$route.params.detailData;
    // console.log(this.selfSupportProject.projectCode)
    if (pushObj) {
      this.pushData = JSON.parse(this.$route.params.detailData);
      console.log(this.pushData)
      if (this.pushData.pathName === 'backlog') {
        queryById({id:this.pushData.processVariables.relevancyId}).then(res=>{
              this.fileList = res.fileList || [];
              this.pdfId = res.procinstid;
              this.procInstId = res.procinstid;
              this.dialogShow = '跳转';
              this.editShow = true;
              this.saveType = 'edit';
              this.isSendBack = true;;
              this.isJump = true;
              this.pushLogData = this.pushData;
              // this.detailData.taskId = this.pushData.taskId;
              // this.detailData.activityId = this.pushData.activityId;
              // this.detailData.fileList = this.fileList;
          }).catch(()=>{
            this.$message.error('数据查询失败')
          }).finally((data)=>{
        })
      } else if(this.pushData.pathName === 'sendBack') {
        queryById({id:this.pushData.processVariables.relevancyId}).then(res=>{
              this.fileList = res.fileList || [];
              this.pdfId = res.procinstid;
              this.procInstId = res.procinstid;
              this.dialogShow = '详情';
              this.editShow = true;
              this.saveType = 'edit';
              this.isSendBack = true;;
              this.isCopy = false;
              this.isJump = true;
              this.detailData = res;
              this.detailData.pdfId = this.pushData.procDefId;
              this.detailData.degree = this.pushData.processVariables.degree;
              this.detailData.taskId = this.pushData.taskId;
              this.detailData.fileList = this.fileList;
          }).catch(()=>{
            this.$message.error('数据查询失败')
          }).finally((data)=>{
        })
      } else if(this.pushData.pathName === 'examine' && this.pushData.processVariables.processState === '6') {
        queryById({id:this.pushData.processVariables.relevancyId}).then(res=>{
              this.fileList = res.fileList || [];
              this.pdfId = res.procinstid;
              this.procInstId = res.procinstid;
              this.dialogShow = '详情';
              this.editShow = true;
              this.saveType = 'edit';
              this.isSendBack = true;;
              this.isCopy = false;
              this.isJump = true;
              this.detailData = res;
              this.detailData.pdfId = this.pushData.procDefId;
              this.detailData.degree = this.pushData.processVariables.degree;
              this.detailData.taskId = this.pushData.taskId;
              this.detailData.fileList = this.fileList;
          }).catch(()=>{
            this.$message.error('数据查询失败')
          }).finally((data)=>{
        })
      } else {
          queryById({id:this.pushData.processVariables.relevancyId}).then(res=>{
            this.fileList = res.fileList || [];
            this.pdfId = res.procinstid;
            this.procInstId = res.procinstid;
            this.detailData = res;
            this.dialogShow = '详情';
            this.isCopy = false;
            this.editShow = false;
            this.detailData.fileList = this.fileList;
            this.isJump = true;
          }).catch(()=>{
            this.$message.error('数据查询失败')
          })
      }
    }
   
  },
  created () {
    this.init()
    this._validationAuth ()
  },
  computed: {
    ...mapState ('d2admin/selfSupportProject', [
        'selfSupportProject'
    ])
  },
  watch: {
    selfSupportProject () {
      this.getTableData ()
    },
    $route (val) {
      if (val.path.indexOf('staffLoan') !== -1) {
        this.identification = val.params.identification || null
        this._validationAuth ()
        this.getTableData ()
      } 
    }
  }
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
<style  lang='scss'>
 .fina_applica{
    .d2-container-full__header{
      padding-bottom: 0px !important;
      .el-form-item--mini.el-form-item {
        margin-bottom: 0px
      }
    }
    .el-range-separator { display: contents; }
 }
</style>