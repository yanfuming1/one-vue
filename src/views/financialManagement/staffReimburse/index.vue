<template>
     <d2-container class="fina_applica" v-if="dialogShow">
        <template  slot="header" style="padding-bottom:0">
            <div class="customer-list-header">
              <el-form :inline="true" class="demo-form-inline " :model="search" ref="form" size="mini">
                  <el-form-item v-if="identification === '1' ? $has('self:employeeReimburse:add') : $has ('finance:employeeReimburse:add') ">
                    <el-button type="primary" @click="addAccountBtn">添加</el-button>
                  </el-form-item>
                  <el-form-item v-if="identification === '1' ? $has('self:employeeReimburse:copy') : $has ('finance:employeeReimburse:copy')">
                    <el-button type="primary" @click="copyBtn">复制</el-button>
                  </el-form-item>
                  <el-form-item label prop="keywords">
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
                  <el-form-item label >
                    <el-select v-model="search.state" placeholder="请选择办理状态" @change="stateChange" style="width: 140px;" clearable >
                      <el-option label="初始化" value="1" />
                      <el-option label="待审批" value="2" />
                      <el-option label="审批中" value="3" />
                      <el-option label="已驳回" value="4" />
                      <el-option label="已作废" value="5" />
                      <el-option label="待提交" value="6" />
                      <el-option label="已完结" value="10" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label >
                    <el-select v-model="search.audit" placeholder="请选择审核状态" @change="stateChange" style="width: 140px;" clearable >
                      <el-option label="审核" value="1" />
                      <el-option label="未审核" value="0" />
                    </el-select>
                  </el-form-item>
                  <el-form-item v-if="identification === '1' ? $has('self:employeeReimburse:delete') : $has ('finance:employeeReimburse:deleteBatch')">
                      <el-button type="primary" @click="deleteAll">批量删除</el-button>
                  </el-form-item>
                  <el-form-item>
                      <el-button type="info" @click="resetFun">重置</el-button>
                  </el-form-item>
                  <el-form-item>
                      <el-button type="success" @click="isChick">审核</el-button>
                  </el-form-item>
                  <el-form-item>
                      <el-button type="success" @click="unIsChick">反审核</el-button>
                  </el-form-item>
                  <el-button-group>
                    <el-button size="mini" @click="uploadFun"  icon="el-icon-upload2">导出</el-button>
                    <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
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
              @page="pageChange"
              :dynamicHeader="dynamicHeader"
              @selectionChange="selectChange">
            </qqt-table>
          </div>
            <!-- @selectionChange="selectChange" -->
        </template>
     </d2-container>
     <add-dialog v-else @cancelBtn="cancelFun" :selfSupportProject="selfSupportProject" :identification="identification" :isSendBack="isSendBack" :isJump="isJump" :isEdit="isEdit" :isCopy="isCopy" :modelData="modelData" :isAdd="isAdd" @successFun="successFun"></add-dialog>
</template>

<script>
import { getTableList,queryById,setDelete,deleteBatch,goCopy,getAgainst,getCheck, 
    setDeleteNew, deleteBatchNew, getTableListNew} from '../../../api/financialManagement/staffReimburse';
import qqtTable from '../../../components/qqt-subassembly/qqt-table/qqt-table';
import util from '@/libs/util.js'
import { mapState } from 'vuex'
import addDialog from './components/addDialog';
let that = this;
export default {
  components: {
      qqtTable,
      addDialog
  },
  data() {
    return {
      identification: '',
      exportData:[],
      dateTime: null,
      dialogShow: true,
      isEdit: false,
      isCopy: false,
      isSendBack: false,
      isJump: false,
      modelData: {},
      isAdd: false,
      dynamicHeader: {
          tableId: 'T_15726016576551',
          isSave: true
      },
      form: {
          keywords: '',
          bstatus: '1'
      },
      newArr:[
        {id: '1',name: '初始化'},
        {id: '2',name: '待审批'},
        {id: '3',name: '被驳回'},
      ],
      tableData: {},
      rowHeader: [
          {
              prop: 'totalmoney',
              isOpenSummary: true,
              label: '申请报销金额（元）',
              isShow: true,
              render: (h,params) =>{
                let text = (params.row.totalmoney-0).toFixed(2)
                return h('div', {
                    on: { click: () => {
                      queryById({id: params.row.id}).then(res => {
                        // for (let i = 0; i < res.employReimVices.length; i++) {
                        //   res.employReimVices[i].line2 = (res.employReimVices[i].line2).split(',');
                        // }
                        this.modelData = res;
                        this.dialogShow = false;
                        this.isEdit = false;
                        this.isCopy = false;
                        this.isAdd = false;
                        this.isSendBack = false;
                        this.isJump = false;
                      })
                    }}
                }, [
                    h ('div', {
                        class: {
                            'typefaceColor': true, 
                        },
                    }, text)
                ], )
              }
          },
          {
              prop: 'procState',
              label: '办理状态',
              isShow: true,
              render: (h,params) => {
                let text = '';
                if (params.row.procState === '1') {
                  text = '初始化';
                } else  if (params.row.procState === '2') {
                  text = '待审批';
                } else  if (params.row.procState === '3') {
                  text = '审批中';
                } else  if (params.row.procState === '4') {
                  text = '已驳回';
                } else  if (params.row.procState === '5') {
                  text = '已作废';
                } else if (params.row.procState === '6') {
                  text = '待提交';
                } else if (params.row.procState === '10') {
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
          // {
          //    prop: 'nominee',
          //    label: '待办人',
          //    isShow: true,
          //   render: (h, params) => {
          //     return h('el-select', {
          //           props:{
          //               value: params.row.nominee,
          //           },
          //       },
          //       this.newArr.map((item)=>{
          //           return h('el-option', {
          //               props: {
          //                 value:item.value,
          //                 label:item.name
          //               }
          //           }, item.name);
          //       })
          //     );
          // }
          // },
          {
              prop: 'startoend',
              label: '业务发生起止时间',
              isShow: true
          },
          {
              prop: 'cutmoney',
              isOpenSummary: true,
              label: '核减或扣除金额(元)',
              isShow: true,
              render: (h,params) =>{
                let text = params.row.cutmoney ? (params.row.cutmoney-0).toFixed(2) : '0.00';
                return h('div',{
                   
                },text)
              }
          },
          {
              prop: 'realmoney',
              label: '实报金额(元)',
              isOpenSummary: true,
              isShow: true,
              render: (h,params) =>{
                let text = params.row.realmoney ? (params.row.realmoney-0).toFixed(2) : '0.00';
                return h('div',{
                   
                },text)
              }
          },
          {
              prop: 'createName',
              label: '报销人',
              isShow: true
          },
          {
              prop: 'createTime',
              label: '申请时间',
              isShow: true
          },
          {
            prop: '',
            label: '操作',
            isShow: true,
            fixed: 'right',
            width: '150',
            render: (createElement, params) => {
                let canEdit = true
                let canDel = true
                if(that.identification === '1') {
                  canEdit = that.$has('self:employeeReimburse:edit')
                  canDel = that.$has('self:employeeReimburse:delete')
                } else {
                  canEdit = that.$has ('finance:employeeReimburse:edit')
                  canDel = that.$has ('finance:employeeReimburse:deleteBatch')
                }
                return createElement('div',
                    [
                      canEdit ? createElement('el-button', {
                            attrs: {
                                type: 'text',
                                disabled: params.row.procState === '1' ? false : true
                            },
                            style:{
                                color: params.row.procState === '1'? '#409EFF' : '#999',
                            },
                            on: {
                                click: () => {
                                  queryById({id: params.row.id}).then(res => {
                                    // for (let i = 0; i < res.employReimVices.length; i++) {
                                    //   res.employReimVices[i].line2 = (res.employReimVices[i].line2).split(',');
                                    // }
                                    this.modelData = res;
                                    this.dialogShow = false;
                                    this.isCopy = true;
                                    this.isEdit = true;
                                    this.isAdd = true;
                                    this.isSendBack = false;
                                    this.isJump = false;
                                  })
                                }
                            }
                        }, '编辑') : '',
                        canDel ? createElement('el-button', {
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
                                        let url = this.identification === '1' ? setDeleteNew : setDelete
                                        //  setDelete ({id:params.row.id}).then(res=>{
                                        url ({id:params.row.id, projectCode: params.row.projectCode}).then(res=>{
                                           if (res.success){
                                              this.$message.success(res.message);
                                              this.getTableData();
                                           }
                                        })
                                      }
                                    })
                                }
                            }
                        }, '删除') : '',
                    ]
                )
            }
          }
      ],
      tableOption: {
        isOpenSummary: true,
        border: false,
      },
      page: {
        pageNo: 1,
        pageSize: 10,
      },
      search: {
        keywords: '',
        time: '',
        pageNo: 1,
        state: '',
        audit: '',
        pageSize: 10,
      },
      selectData: [],
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
      this.isSendBack = false;
      this.isJump = false;
      this.modelData = {};
    },
    // 复制
    copyBtn () {
        if (this.selectData.length === 1) {
          queryById({id: this.selectData[0].id}).then(res => {
            for (let i = 0; i < res.employReimVices.length; i++) {
              // res.employReimVices[i].line2 = (res.employReimVices[i].line2).split(',');
              res.employReimVices[i].line10 = '';
              res.employReimVices[i].line11 = '';
              res.employReimVices[i].line12 = '';
              delete res.employReimVices[i].id;
              delete res.employReimVices[i].reimid;
            }
            res.procInstId = '';
            res.pdfId = '';
            res.id = '';
            res.createBy = '';
            res.createName = '';
            res.compay = [];
            this.modelData = res;
            this.dialogShow = false;
            this.isCopy = true;
            this.isAdd = true;
            this.isEdit = false;
            this.isSendBack = false;
            this.isJump = false;
          })
        } else if (this.selectData.length === 0) {
          this.$message.error('请选择要复制的数据');
        } else {
          this.$message.error('只支持单条数据操作');
        } 
    },
    stateChange (value) {
      if (this.dateTime) {
         let time = this.dateTime[0] + ' 00:00:00' + ',' + this.dateTime[1] + ' 23:59:59';
         this.search.time = time;
      } else {
         this.search.time = '';
      }
      let url = this.identification === '1' ? getTableListNew : getTableList
      url ({ ...this.search, projectCode: this.identification === '1' ? this.selfSupportProject.projectCode : ''}).then(res => {
          this.tableData = res;
      }).catch(err => {
          console.log(err);
      });
    },
    // 搜索
    dataSearch () {
      if (this.dateTime) {
         let time = this.dateTime[0] + ' 00:00:00' + ',' + this.dateTime[1] + ' 23:59:59';
         this.search.time = time;
      } else {
         this.search.time = '';
      }
      let url = this.identification === '1' ? getTableListNew : getTableList
      url ({...this.search, projectCode: this.identification === '1' ? this.selfSupportProject.projectCode : ''}).then(res => {
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
      this.selectRow =[];
      let url = this.identification === '1' ? getTableListNew : getTableList
      url ({...this.search, projectCode: this.identification === '1' ? this.selfSupportProject.projectCode : ''}).then(res => {
          this.tableData = res;
      })
    },
    resetFun () {
      this.search.state = '';
      this.search.keywords = '';
      this.search.audit = '';
      this.dateTime = null;
      this.getTableData();
    },
    // 批量删除
    deleteAll () {
        if (this.selectData.length > 0) {
          this.$confirm('是否删除选择行数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
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
              let url = this.identification === '1' ? deleteBatchNew : deleteBatch
              url ({ids:ids.substring(0,ids.length-1), projectCode: this.identification === '1' ? this.selfSupportProject.projectCode : ''}).then(res => {
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
    pageChange (data) {
      this.search.pageNo = data.current;
      this.search.pageSize = data.size;
      this.dataSearch();
    },
    selectChange (val) {
      this.selectData = val;
    },
    // 取消
    cancelFun () {
      this.dialogShow = true;
    },
    successFun () {
      this.dialogShow = true;
      this.getTableData();
      this.$message.success('保存成功')
    },

    printTable () {
      let list = this.selectData && this.selectData.length > 0 ? JSON.parse (JSON.stringify (this.selectData)) : JSON.parse (JSON.stringify (this.tableData.records))
      console.log(list);
      list.forEach (res => { res.procState = util.handleState(res.procState), res.audit = res.audit === '0' ? '未审核' : '已审核' })
      this.$refs.table.printTable (list)
    },

    // 获取table数据
    getTableData () {
      let url = this.identification === '1' ? getTableListNew : getTableList
      this.page.projectCode = this.identification === '1' ? this.selfSupportProject.projectCode : ''
      url (this.page ).then(res => { this.tableData = res;})
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
  },
  computed: {
      ...mapState ('d2admin/selfSupportProject', [
          'selfSupportProject'
      ])
  },
  async created () {
    that = this;
    this.identification = this.$route.params.identification
    this.identification === '1' ? this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad') : this.getTableData()
  },
  watch: {
      selfSupportProject () {
        this.getTableData();
      },
      $route (val) {
        if (val.path.indexOf('staffReimburse') !== -1) {
          this.identification = val.params.identification
          this.getTableData ()
        } 
      }
  },
  mounted () {
    let pushObj = this.$route.params.detailData;
    if (pushObj) {
      this.pushData = JSON.parse(this.$route.params.detailData);
      if (this.pushData.pathName === 'backlog') {
        queryById({id:this.pushData.processVariables.relevancyId}).then(res=>{
              // this.fileList = res.fileList || [];
              // this.modelData = res;
              // this.dialogShow = false;
              // this.isEdit = true;
              // this.isSendBack = true;;
              // this.isJump = true;
              // this.pushLogData = this.pushData;
                res.fileList = res.fileList || [];
                this.modelData = res;
                this.modelData.employReimVices = this.modelData.employReimVices ? this.modelData.employReimVices : [];
                for (let i = 0; i <  this.modelData.employReimVices.length; i++) {
                  // if (!Array.isArray(this.modelData.employReimVices[i].line2)) {
                  //   this.modelData.employReimVices[i].line2 = this.modelData.employReimVices[i].line2.split(',');
                  // }
                }
                this.dialogShow = false;
                this.isEdit = false;
                this.isCopy = false;
                this.isAdd = false;               
                this.isSendBack = false;;
                this.isJump = true;
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
              this.isSendBack = true;
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
      }else {
          queryById({id:this.pushData.processVariables.relevancyId}).then(res => {
            res.fileList = res.fileList || [];
            this.modelData = res;
            this.modelData.employReimVices = this.modelData.employReimVices ? this.modelData.employReimVices : [];
            for (let i = 0; i <  this.modelData.employReimVices.length; i++) {
              // if (!Array.isArray(this.modelData.employReimVices[i].line2)) {
              //   this.modelData.employReimVices[i].line2 = this.modelData.employReimVices[i].line2.split(',');
              // }
            }
            this.dialogShow = false;
            this.isEdit = false;
            this.isCopy = false;
            this.isAdd = false;               
            this.isSendBack = false;;
            this.isJump = true;
          })
      }
    }
    if (this.$route.params.rowData) {
      this.isCopy = false;
      this.isEdit = false;
      this.dialogShow = false;
      this.isAdd = true;
      this.isSendBack = false;
      this.isJump = true;
      this.modelData = {};
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
  .customer-list-header .el-form-item{ margin-bottom: 0px !important; }
</style>
<style  lang='scss'>
 .fina_applica{
    .d2-container-full__header{
      padding-bottom: 0px !important;
      .el-form-item--mini.el-form-item {
        margin-bottom: 0px
      }
      .el-range-separator{
        display: contents;
      }
    }
 }
</style>