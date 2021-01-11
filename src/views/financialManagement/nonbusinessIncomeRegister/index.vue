<template>
     <d2-container class="fina_applica" v-if="dialogShow">
        <template  slot="header" style="padding-bottom:0">
            <div class="customer-list-header">
              <el-form :inline="true" class="demo-form-inline " :model="search" ref="form" size="mini">
                  <el-form-item v-if="auth.add">
                    <el-button type="primary" size="mini" @click="addAccountBtn">添加</el-button>
                  </el-form-item>
                  <el-form-item v-if="auth.copy">
                    <el-button type="primary" size="mini" @click="copyBtn">复制</el-button>
                  </el-form-item>
                  <el-form-item label prop="keywords">
                    <el-input v-model="search.keywords" prefix-icon="el-icon-search" placeholder="请输入内容" style="width: 200px;" :clearable="true"/>
                  </el-form-item>
                  <el-form-item label prop="keywords">
                       <el-date-picker
                        v-model="dateTime"
                        style="width:350px"
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
                    <el-select v-model="search.audit" placeholder="请选择审核状态" @change="stateChange" style="width: 140px;" clearable >
                      <el-option label="审核" value="1" />
                      <el-option label="未审核" value="0" />
                    </el-select>
                  </el-form-item>
                  <el-form-item v-if="auth.delBat">
                      <el-button type="primary" @click="deleteAll">批量删除</el-button>
                  </el-form-item>
                   <el-form-item>
                      <el-button type="success" @click="isChick">审核</el-button>
                  </el-form-item>
                  <el-form-item>
                      <el-button type="success" @click="unIsChick">反审核</el-button>
                  </el-form-item>
                  <el-form-item>
                      <el-button type="info" @click="resetFun">重置</el-button>
                  </el-form-item>
                  <el-button-group>
                    <el-button size="mini" @click="uploadFun" icon="el-icon-upload2">导出</el-button>
                    <!-- <el-button size="mini" icon="el-icon-printer">打印</el-button> -->
                  </el-button-group>
              </el-form>
            </div>
        </template>
        <template>
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
        <!-- <iframe src='http://39.100.100.105:9999/group1/M00/00/02/rBr16F2lYdiADu56AAAYAFnz0ao540.xls' width='100%' height='100%' frameborder='1'></iframe> -->
     </d2-container>
     <add-dialog v-else @cancelBtn="cancelFun" :identification="identification" :isEdit="isEdit"  :isSendBack="isSendBack" :isJump="isJump"  :isCopy="isCopy" :modelData="modelData" :isAdd="isAdd" @successFun="successFun"></add-dialog>
</template>

<script>
import { getQueryPageList, getNonbusinessIncomeRegisterPageList, deleteBatchNonbusinessIncomeRegister,queryById,getDelete,deleteBatch,getCheck,getAgainst,queryByState,exportXls} from '../../../api/financialManagement/nonbusinessIncomeRegister';
import qqtTable from '../../../components/qqt-subassembly/qqt-table/qqt-table';
import addDialog from './components/addDialog';
import { mapState } from 'vuex'
import util from '@/libs/util.js'
let that = this;
export default {
  name:'nonbusinessIncomeRegister2',
  components: {
      qqtTable,
      addDialog,
  },
  data() {
    return {
      exportData: [],
      dateTime: null,
      dialogShow: true,
      isCopy: false,
      state: '',
      form: {
          keywords: '',
          bstatus: '1'
      },
      tableData: {},
      dynamicHeader: {
          tableId: 'T_1572601657111',
          isSave: true,
      },
      rowHeader: [
          {
            prop: 'payname',
            label: '付款人',
            isShow: true,
          },
          {
              prop: 'paymoney',
              label: '付款金额（元）',
              isOpenSummary: true,
              isShow: true,
              render: (h, params) => {
                return h('div', {
                    on: { click: () => {
                      queryById({id: params.row.id}).then(res => {
                        this.modelData = res;
                        this.dialogShow = false;
                        this.isEdit = false;
                        this.isCopy = true;
                        this.isAdd = false;               
                        this.isSendBack = false;;
                        this.isJump = false;
                      })
                    }}
                }, [
                    h ('div', {
                        class: {
                            'typefaceColor': true, 
                        },
                    },(params.row.paymoney-0).toFixed(2))
                ], )
              }
          },
          {
            prop: 'payway',
            label: '付款方式',
            isShow: true,
          },
          {
              prop: 'procState',
              label: '办理状态',
              isShow: true,
              render: (h,params) =>{
                let text = '';
                if (params.row.procState === '1') {
                  text = '初始化';
                } else if (params.row.procState === '2') {
                  text = '待审批';
                } else  if (params.row.procState === '3'){
                  text = '审批中';
                } else  if (params.row.procState === '4'){
                  text = '已驳回';
                } else  if (params.row.procState === '5'){
                  text = '已作废';
                } else  if (params.row.procState === '10'){
                  text = '已完结';
                } 
                return h('div',{
                },text)
              }
          },
          {
              prop: 'audit',
              label: '审核状态',
              isShow: true,
              render: (h,params) =>{
                let text = '';
                if (params.row.audit === '0') {
                  text = '未审核';
                } else if (params.row.audit === '1') {
                  text = '审核';
                }
                return h('div',{
                   
                },text)
              }
          },
          {
              prop: 'nominee',
              label: '待办人',
              isShow: true,
          },
          {
              prop: 'paytime',
              label: '付款时间',
              isShow: true
          },
          {
              prop: 'recmessage',
              label: '收入摘要',
              isShow: true
          },
          {
              prop: 'recname',
              label: '公司收款账户',
              isShow: true
          },
          {
              prop: 'createName',
              label: '登记人',
              isShow: true
          },
          {
              prop: 'createTime',
              label: '登记时间',
              isShow: true
          },
          {
            prop: '',
            label: '操作',
            isShow: true,
            fixed: 'right',
            width: '150',
            render: (createElement, params) => {
                return createElement('div',
                    [
                        this.auth.edit ? createElement('el-button', {
                            attrs: {
                                type: 'text',
                                disabled: params.row.procState === '1'  ? false : true
                            },
                            style:{
                                color: params.row.procState === '1' ? '#409EFF' : '#999',
                            },
                            on: {
                                click: () => {
                                  queryById({id: params.row.id}).then(res => {
                                    this.modelData = res;
                                    this.dialogShow = false;
                                    this.isCopy = true;
                                    this.isEdit = true;
                                    this.isAdd = true;
                                    this.isSendBack = false;;
                                    this.isJump = false;
                                  })
                                }
                            }
                        }, '编辑') : '',
                        this.auth.delBat ? createElement('el-button', {
                            attrs: {
                                type: 'text',
                                disabled: params.row.procState === '1' ? false : true
                            },
                            style:{
                                color: params.row.procState === '1' ? '#409EFF' : '#999',
                            },
                            on: {
                                click: () => {
                                    util.confirm().then(res =>{
                                      if (res) {
                                        let url = this.identification == '1' ? deleteBatchNonbusinessIncomeRegister : deleteBatch
                                         url ({ids:params.row.id}).then(res=>{
                                           if (res.success){
                                              this.$message.success(res.message);
                                              this.getTableData();
                                           }
                                         })
                                      }
                                    })
                                }
                            }
                        }, '删除') : ''
                    ]
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
        pageNo: 1,
        pageSize: 10,
        state:'',
        audit:'',
      },
      auth: {
        add: false,
        edit: false,
        delBat: false,
        copy: false
      },
      isAdd:false,
      isJump:false,
      isEdit:false,
      isSendBack:false,
      modelData:{},
      selectData: [],
      identification: null
    }
  },
  methods: {
    // 导出
    getExportData () {
        this.exportData = JSON.parse(JSON.stringify((this.tableData.records))) || [];
        return new Promise((resolve, reject) => {
          this.exportData.forEach((item,index) => {
            item.procState = util.handleState(item.procState);
            item.audit = item.audit === '0' ? '未审核' : '已审核';
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
      this.isCopy = false;
      this.isEdit = false;
      this.dialogShow = false;
      this.isAdd = true;                                    
      this.isSendBack = false;;
      this.isJump = false;
      this.modelData = {};
    },
    // resetFun 
    resetFun () {
      this.search.keywords = '';
      this.search.state = '';
      this.search.audit = '';
      this.dateTime = null;
      this.getTableData();
    },
    stateChange (value) {
      let url = this.identification == '1' ? getNonbusinessIncomeRegisterPageList : getQueryPageList
      url ({...this.search, 'projectCode': this.identification == '1' ? this.selfSupportProject.projectCode : null}).then(res => {
          this.tableData = res;
      }).catch(err => {
          console.log(err);
      });
    },
    // 复制
    copyBtn () {
      if (this.selectData.length === 1) {
        queryById({id: this.selectData[0].id}).then(res => {
          res.procInstId = '';
          res.pdfId = '';
          res.id = '';
          res.createBy = '';
          res.createName = '';
          this.modelData = res;
          this.dialogShow = false;
          this.isCopy = true;
          this.isAdd = true;
          this.isSendBack = false;;
          this.isJump = false;
          this.isEdit = false;
        })
      } else if (this.selectData.length === 0) {
        this.$message.error('请选择要复制的数据');
      } else {
        this.$message.error('只支持单条数据操作');
      } 
    },
    // 搜索
    dataSearch (type) {
      if (this.dateTime) {
         let time = this.dateTime[0] + ' 00:00:00' + ',' + this.dateTime[1] + ' 23:59:59';
         this.search.time = time;
      } else {
         this.search.time = '';
      }
      if(type !== 'page') {
        this.search.pageNo = '1';
        this.search.pageSize = '10';
      }
      let url = this.identification == '1' ? getNonbusinessIncomeRegisterPageList : getQueryPageList
      url ({...this.search, 'projectCode': this.identification == '1' ? this.selfSupportProject.projectCode : null}).then(res => {
          this.tableData = res;
      }).catch(err => {
          console.log(err);
      });
      this.selectData = [];
    },
    dateChange (date) {
      if (date) {
          let time = date[0] + ' 00:00:00' + ',' + date[1] + ' 23:59:59';
          this.search.time = time;
      } else {
         this.search.time = '';
      }
      this.search.pageNo = '1';
      this.search.pageSize = '10';
      this.selectData =[];
      let url = this.identification == '1' ? getNonbusinessIncomeRegisterPageList : getQueryPageList
      url ({...this.search, 'projectCode': this.identification == '1' ? this.selfSupportProject.projectCode : null}).then(res => {
          this.tableData = res;
      }).catch(err => {
          console.log(err);
      });
    },
    // 批量删除
    deleteAll () {
        if (this.selectData.length > 0) {
          this.$confirm('是否删除选择行数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
              // let ids = '';
              // for (let i = 0; i < this.selectData.length; i++) {
              //   ids += this.selectData[i].id + ',';
              // }
              let ids = '';
              let indexs = '';
              let flag = false;
              for (let i = 0; i < this.selectData.length; i++) {
                if (this.selectData[i].procState != '1' &&  this.selectData[i].procState != '4') {
                  let idxIndex = this.tableData.records.findIndex(item => item.id === this.selectData[i].id);
                  indexs += idxIndex - 0 + 1 +',';
                  flag = true;
                }
                ids += this.selectData[i].id + ',';
              }
              if (flag) {
                this.$message.error( `请确认第${indexs.substring(0,indexs.length-1)}行的状态，只有初始化和已驳回支持删除`);
                return
              }
              let url = this.identification == '1' ? deleteBatchNonbusinessIncomeRegister : deleteBatch
              url ({ids:ids.substring(0,ids.length-1)}).then(res => {
                  this.getTableData();
                  this.$message.success('删除成功')
              }).catch(err => {
                  console.log(err);
              });
          })
        } else {
            this.$message.error('请选择要批量删除的数据')
        }
    },
    isChick () {
      if (this.selectData.length === 1) {
        if (this.selectData[0].audit === '0') {
          this.$confirm('您是否要审核该条数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            getCheck({id: this.selectData[0].id}).then(res=> {
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
      } else if (this.selectData.length === 0) {
        this.$message.error('请选择要审核的数据');
      } else {
        this.$message.error('只支持单条数据操作');
      }
    },
    unIsChick () {
      if (this.selectData.length === 1) {
        if (this.selectData[0].audit === '1') {
          this.$confirm('您是否要反审核该条数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            getAgainst({id: this.selectData[0].id}).then(res=> {
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
      } else if (this.selectData.length === 0) {
        this.$message.error('请选择要审核的数据');
      } else {
        this.$message.error('只支持单条数据操作');
      }
    },
    pageChange (data) {
      this.search.pageNo = data.current;
      this.search.pageSize = data.size;
      this.dataSearch('page');
    },
    selectChange (val) {
      this.selectData = val;
    },
    // 取消
    cancelFun () {
      this.dialogShow = true;
    },
    successFun (res) {
      this.dialogShow = true;
      this.getTableData();
      this.$message.success('保存成功')
    },
    // 获取table数据
    getTableData () {
      let url = this.identification == '1' ? getNonbusinessIncomeRegisterPageList : getQueryPageList
      url ({...this.page, 'projectCode': this.identification == '1' ? this.selfSupportProject.projectCode : null}).then(res => {
          this.tableData = res;
      }).catch(err => {
          console.log(err);
      });
    },
    exportFun () {
      exportXls().then(res => {

      })
    },
    // 验证权限
    _validationAuth () {
      this.auth.add = this.identification === '1' ? this.$has ('self:takingRegister:add') : this.$has ('finance:takingRegister:add')
      this.auth.edit = this.identification === '1' ? this.$has ('self:takingRegister:edit') : this.$has ('finance:takingRegister:edit')
      this.auth.copy = this.identification === '1' ? this.$has ('self:takingRegister:copy') : this.$has ('finance:takingRegister:copy')
      this.auth.delBat = this.identification === '1' ? this.$has ('self:takingRegister:delete') : this.$has ('finance:takingRegister:delete')
    },
    init () {
      if (this.$route.params) {
        this.identification = this.$route.params.identification || null
        this.identification == '1' ? this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad') : this.getTableData ()
      }
    }
  },
  mounted () {
    let pushObj = this.$route.params.detailData;
    if (pushObj) {
        this.pushData = JSON.parse(this.$route.params.detailData);
        if (this.pushData.pathName === 'backlog') {
          queryById({id:this.pushData.processVariables.relevancyId}).then(res=>{
                this.fileList = res.fileList || [];
                this.dialogShow = false;
                this.isEdit = true;
                this.isSendBack = true;;
                this.isJump = true;
                this.pushLogData = this.pushData;
            }).catch(()=>{
              this.$message.error('数据查询失败')
            }).finally((data)=>{
          })
        } else if(this.pushData.pathName === 'sendBack') {
          queryById({id:this.pushData.processVariables.relevancyId}).then(res=>{
                this.fileList = res.fileList || [];
                this.dialogShow = false;
                this.isAdd = true;
                this.isEdit = true;
                this.isSendBack = true;;
                this.isJump = true;
                this.modelData = res;
                this.modelData.taskId = this.pushData.taskId;
                this.modelData.pdfId = this.pushData.procDefId;
                this.modelData.degree = this.pushData.processVariables.degree;
                this.modelData.fileList = this.fileList;
            }).catch(()=>{
              this.$message.error('数据查询失败')
            }).finally((data)=>{
          })
        } else if(this.pushData.pathName === 'examine' && this.pushData.processVariables.processState === '6') {
            queryById({id:this.pushData.processVariables.relevancyId}).then(res=>{
                  this.fileList = res.fileList || [];
                  this.dialogShow = false;
                  this.isAdd = true;
                  this.isEdit = true;
                  this.isSendBack = true;;
                  this.isJump = true;
                  this.modelData = res;
                  this.modelData.taskId = this.pushData.taskId;
                  this.modelData.pdfId = this.pushData.procDefId;
                  this.modelData.degree = this.pushData.processVariables.degree;
                  this.modelData.fileList = this.fileList;
              }).catch(()=>{
                this.$message.error('数据查询失败')
              }).finally((data)=>{
            })
        } else {
           queryById({id:this.pushData.processVariables.relevancyId}).then(res => {
              this.modelData = res;
              this.dialogShow = false;
              this.isEdit = false;
              this.isCopy = false;
              this.isAdd = false;               
              this.isSendBack = false;;
              this.isJump = true;
            })
          }
       }
  },
  created () {
    this.init ()
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
      if (val.path.indexOf('nonbusinessIncomeRegister') !== -1) {
        this.identification = val.params.identification || null
        this._validationAuth ()
        this.getTableData ()
      } 
    }
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
<style  lang='scss'>
 .fina_applica{
    .d2-container-full__header{
      padding-bottom: 0px !important;
      .el-form-item--mini.el-form-item {
        margin-bottom: 0px
      }
    }
 }
</style>