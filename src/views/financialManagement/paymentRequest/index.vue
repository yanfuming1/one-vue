<template>
    <div>
        <d2-container class="fina_applica" v-if="dialogShow">
          <template  slot="header" style="padding-bottom:0">
              <div class="customer-list-header">
                <el-form :inline="true" class="demo-form-inline " :model="search" ref="form" size="mini">
                    <el-form-item v-if="auth.add"  style="margin-top:5px">
                      <el-button type="primary" @click="addAccountBtn">添加</el-button>
                    </el-form-item>
                    <el-form-item v-if="auth.copy" style="margin-top:5px">
                      <el-button type="primary" @click="copyBtn">复制</el-button>
                    </el-form-item>
                    <el-form-item label prop="keywords" style="margin-top:5px">
                      <el-input v-model="search.keywords" prefix-icon="el-icon-search" placeholder="请输入内容" style="width: 200px;" :clearable="true"/>
                    </el-form-item>
                    <el-form-item label prop="keywords" style="margin-top:5px">
                        <el-date-picker
                          v-model="dateTime"
                          style="width:280px"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          value-format="yyyy-MM-dd"
                          @change="dateChange"
                          end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item style="margin-top:5px">
                        <el-button type="primary" @click="dataSearch('')">搜索</el-button>
                    </el-form-item>
                    <el-form-item label style="margin-top:5px">
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
                    <el-form-item label style="margin-top:5px">
                      <el-select v-model="search.audit" placeholder="请选择审核状态" @change="stateChange" style="width: 140px;" clearable >
                        <el-option label="已审核" value="1" />
                        <el-option label="未审核" value="0" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label  style="margin-top:5px">
                        <el-select v-model="search.accountnature" style="width:150px;"  clearable placeholder="请选择账户性质" size="mini"  @change="stateChange($event,'accountnature')">
                          <el-option v-for="item in natureAccount" :key="item.id " :label="item.name" :value="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label  style="margin-top:5px">
                        <el-select v-model="search.recvouchertype" style="width:150px;"   clearable placeholder="请选择凭证类型" size="mini"  @change="stateChange($event,'recvouchertype')">
                          <el-option v-for="item in typeList" :key="item.id " :label="item.name" :value="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="auth.delBat" style="margin-top:5px">
                        <el-button type="primary" @click="deleteAll">批量删除</el-button>
                    </el-form-item>
                    <el-form-item style="margin-top:5px">
                        <el-button type="info" @click="resetFun">重置</el-button>
                    </el-form-item>
                    <el-form-item style="margin-top:5px">
                        <el-button type="success" @click="isChick">审核</el-button>
                    </el-form-item>
                    <el-form-item style="margin-top:5px">
                        <el-button type="success" @click="unIsChick">反审核</el-button>
                    </el-form-item>
                    <el-form-item style="margin-top:5px">
                      <el-button size="mini" @click="uploadFun" icon="el-icon-upload2">导出</el-button>
                      <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                    </el-form-item>
                    <el-button-group>
                      <!-- <el-button size="mini" @click="printFun" icon="el-icon-printer">打印</el-button> -->
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
                  :dynamicHeader="dynamicHeader1"
                  :option="tableOption"   
                  @page="pageChange"
                  @selectionChange="selectChange">
                </qqt-table>
              </div>
              <!-- @selectionChange="selectChange" -->
          </template>
        </d2-container>
        <add-dialog v-else @cancelBtn="cancelFun" :identification="identification" :isEdit="isEdit" :isSendBack="isSendBack" :isJump="isJump" :isCopy="isCopy" :modelData="editData" :isAdd="isAdd"  @successFun="successFun"></add-dialog>
    </div>

</template>

<script>
import { 
         getExternalPaymentApplicationList, getPaymentRequestToSelfList, deleteBatchPaymentRequestToSelf,
         getExternalPaymentApplicationDel, getQueryById, getPaymentRequestToSelfById, getAgainst,
         againstPaymentRequestToSelf, getCheck, checkPaymentRequestToSelf
       } from '../../../api/financialManagement/paymentRequest';
import addDialog from './components/addDialog';
import {qqtTable} from '../../../components/qqt-subassembly';
import { mapState } from 'vuex'
import { queryDicById } from '@/api/system/dic/dic'

import util from '@/libs/util.js';
let that = this;
export default {
  components: {
      addDialog,
      qqtTable,
  },
  data() {
    return {
      formKey:'',
      dateTime: null,
      exportShow: false,
      dialogShow: true,
      isAdd: false,
      isJump: false,
      isSendBack: false,
      codeShow: false,
      isCopy: false,
      isEdit: false,
      selectRow:[],
      dynamicHeader1: {
          tableId: 'T_1572601657345',
          isSave: false
      },
      form: {
          keywords: '',
          bstatus: '1'
      },
      current: 500,
      size: 10,
      tableData: {},
      editData: {},
      exportData:[],
      natureAccount:[],
      typeList:[],
      rowHeader: [
          {
              prop: 'paymoney',
              label: '申请支付金额(元)',
              isShow: true,
              width: 130,
              isOpenSummary: true,
              render: (h,params) =>{
                let text = (params.row.paymoney-0).toFixed(2);
                return h('div',{
                    class: {
                        'typefaceColor': true, 
                    },
                    on: {
                        click: () => {
                          getQueryById({id:params.row.id}).then((res)=>{
                            this.dialogShow = false;
                            this.isEdit = false;
                            this.isCopy = false;
                            this.isSendBack = false;
                            this.isJump = false;
                            this.isAdd = false;
                            this.editData = res;
                          })
                        }
                    }
                },util.moneyTransform(text))
              }
          },
          {
              prop: 'procStateName',
              label: '办理状态',
              isShow: true,
              width: '80px',
              render: (h,params) => {
                let text = '';
                if (params.row.procState === '1') {
                  params.row.procStateName = '初始化';
                } else  if (params.row.procState === '2') {
                  params.row.procStateName = '待审批';
                } else  if (params.row.procState === '3') {
                  params.row.procStateName = '审批中';
                } else  if (params.row.procState === '4') {
                  params.row.procStateName = '已驳回';
                } else  if (params.row.procState === '5') {
                  params.row.procStateName = '已作废';
                } else  if (params.row.procState === '6') {
                  params.row.procStateName = '待提交';
                } else if (params.row.procState === '10') {
                  params.row.procStateName = '已完结';
                }
                return h('div',{
                }, params.row.procStateName)
              }
          },
          {
              prop: 'auditName',
              label: '审核状态',
              width:'80px',
              isShow: true,
              render: (h,params) =>{
                let text = '';
                if (params.row.audit === '0') {
                  params.row.auditName = '未审核';
                } else if (params.row.audit === '1') {
                  params.row.auditName = '已审核';
                }
                return h('div',{
                   
                }, params.row.auditName)
              }
          },
          {
              prop: 'nominee',
              label: '待办人',
              isShow: true,
          },
          {
              prop: 'recman',
              label: '收款人',
              isShow: true
          },
          {
              prop: 'accountnature',
              label: '账户性质',
              isShow: true
          },
          {
              prop: 'recvouchertype',
              label: '收款凭证类型',
              isShow: true
          },
          {
              prop: 'reccontactman',
              label: '收款方联系人',
              isShow: true,
          },
          {
              prop: 'contactcell',
              label: '联系电话',
              width:'130px',
              isShow: true
          },
          {
              prop: 'createName',
              label: '申请人',
              isShow: true
          },
          {
              prop: 'createTime',
              label: '申请时间',
              isShow: true,
              width: 170
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
                                disabled: params.row.procState === '1' ? false : true
                            },
                            style:{
                                color: params.row.procState === '1'? '#409EFF' : '#999',
                            },
                            on: {
                                click: () => {
                                  getQueryById({id:params.row.id}).then((res)=>{
                                    this.dialogShow = false;
                                    this.isCopy = true;
                                    this.isEdit = true;
                                    this.isSendBack = false;
                                    this.isAdd = true;
                                    this.isJump = false;
                                    this.editData = res;
                                  })
                                }
                            }
                        }, '编辑') : '',
                        this.auth.delBat ?  createElement('el-button', {
                            attrs: {
                                type: 'text',
                                disabled: params.row.procState === '1'? false : true
                            },
                            style:{
                                color: params.row.procState === '1' ? '#409EFF' : '#999',
                                // color: params.row.procState === '1' || params.row.procState === '4' ? '#409EFF' : '#999',
                            },
                            on: {
                                click: () => {
                                    this.deleteRow(params.row,params.index);
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
      auth: {
        add: false,
        edit: false,
        delBat: false,
        copy: false
      },
      identification: null
    }
  },
  methods: {
    typeChange () {

    },
    // 添加
    addAccountBtn () {
      this.dialogShow = false;
      this.editData = {};
      this.isCopy = false;
      this.isEdit = false;
      this.isSendBack = false;
      this.isAdd = true;
      this.isJump = false;
    },
    // 复制
    copyBtn () {
      if (this.selectRow.length > 0) {
          getQueryById({id:this.selectRow[0].id}).then((res)=>{
            res.procInstId = '';
            res.pdfId = '';
            let jsonData = JSON.parse(JSON.stringify(res))
            this.dialogShow = false;
            this.isCopy = true;
            this.isAdd = true;
            this.isJump = false;
            this.isSendBack = false;
            this.isEdit = false;
            delete jsonData.id;
            jsonData.clcu = [];
            jsonData.createBy = '';
            jsonData.createName = '';
            this.editData = jsonData;
          })
      } else {
        this.$message.error('请先选择要复制的数据')
      }
    },
    clear (type) {
      if (this.type == 'accountnature') {
          delete this.search.accountnature
      }
    },
    stateChange (value,type) {
      if (this.dateTime) {
         let time = this.dateTime[0] + ' 00:00:00' + ',' + this.dateTime[1] + ' 23:59:59';
         this.search.time = time;
      } else {
         this.search.time = '';
      }
      let url = this.identification == '1' ? getPaymentRequestToSelfList : getExternalPaymentApplicationList
      this.search.accountnature === '' ? delete this.search.accountnature: '' 
      this.search.recvouchertype === '' ? delete this.search.recvouchertype: '' 
      url ({...this.search, 'projectCode': this.identification == '1' ? this.selfSupportProject.projectCode : null}).then(res => {
          this.tableData = res;
      }).catch(err => {
          console.log(err);
      });
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
      let url = this.identification == '1' ? getPaymentRequestToSelfList : getExternalPaymentApplicationList
      url ({...this.search, 'projectCode': this.identification == '1' ? this.selfSupportProject.projectCode : null}).then(res => {
          this.tableData = res;
      }).catch(err => {
      });
      this.selectRow = [];
    },
    dateChange (date) {
      if (date) {
        let time = date[0] + ' 00:00:00' + ',' + date[1] + ' 23:59:59';
        this.search.time = time;
      } else {
        this.search.time = '';
      }
      this.selectRow = [];
      let url = this.identification == '1' ? getPaymentRequestToSelfList : getExternalPaymentApplicationList
      url ({...this.search, 'projectCode': this.identification == '1' ? this.selfSupportProject.projectCode : null}).then(res => {
          this.tableData = res;
      }).catch(err => {
          console.log(err);
      });
    },
    // 重置
    resetFun () {
      this.search.keywords = '';
      this.search.state = '';
      this.search.audit = '';
      this.dateTime = null;
      this.search.accountnature = '';
      this.search.recvouchertype = '';
      this.getTableData();
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
              if (this.selectRow[i].procState != '1' &&  this.selectRow[i].procState != '4') {
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
            let url = this.identification == '1' ? deleteBatchPaymentRequestToSelf : getExternalPaymentApplicationDel
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
     // 行内删除
    deleteRow (row,index) {
      this.$confirm('是否删除该行数据', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          let url = this.identification == '1' ? deleteBatchPaymentRequestToSelf : getExternalPaymentApplicationDel
          url ({ids:row.id}).then(res => {
              this.getTableData();
              this.$message.success('删除成功')
          }).catch(err => {
              console.log(err);
          });
      })
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
      this.dialogShow = true;
    },
    successFun () {
      this.dialogShow = true;
      this.getTableData();
      this.$message.success('保存成功')
    },
    // 获取table数据
    getTableData () {
      let url = this.identification == '1' ? getPaymentRequestToSelfList : getExternalPaymentApplicationList
      url ({...this.page, 'projectCode': this.identification == '1' ? this.selfSupportProject.projectCode : null}).then(res => {
          this.tableData = res;
      }).catch(err => {
          console.log(err);
      });
    },
    // 审核
    isChick () {
      if (this.selectRow.length === 1) {
        if (this.selectRow[0].audit === '0') {
          this.$confirm('您是否要审核该条数据?', '提示', {
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
        if (this.selectRow[0].audit === '1') {
          this.$confirm('您是否要反审核该条数据?', '提示', {
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

    printTable () {
      this.$refs.table.printTable (this.selectRow)
    },

    // 验证权限
    _validationAuth () {
      this.auth.add = this.identification === '1' ? this.$has ('self:paymentApply:add') : this.$has ('finance:paymentApply:add')
      this.auth.edit = this.identification === '1' ? this.$has('self:paymentApply:edit') : this.$has ('finance:paymentApply:edit')
      this.auth.copy = this.identification === '1' ? this.$has('self:paymentApply:copy') : this.$has ('finance:paymentApply:copy')
      this.auth.delBat = this.identification === '1' ? this.$has('self:paymentApply:delete') : this.$has ('finance:paymentApply:delete')
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
        getQueryById({id:this.pushData.processVariables.relevancyId}).then(res=>{
              this.fileList = res.fileList || [];
              this.pdfId = res.procinstid;
              this.procInstId = res.procinstid;
              this.dialogShow = false;
              this.isEdit = false;
              this.isSendBack = false;;
              this.isJump = true;
              this.editData = res;
              this.editData.taskId = this.pushData.taskId;
              this.editData.activityId = this.pushData.activityId;
              this.editData.procDefId = this.pushData.procDefId;
              this.editData.pathName = this.pushData.pathName;
              this.editData.fileList = this.fileList;
          }).catch(()=>{
            this.$message.error('数据查询失败')
          }).finally((data)=>{
        })
      } else if(this.pushData.pathName === 'sendBack') {
        getQueryById({id:this.pushData.processVariables.relevancyId}).then(res=>{
              this.fileList = res.fileList || [];
              this.pdfId = res.procinstid;
              this.procInstId = res.procinstid;
              this.dialogShow = false;
              this.isAdd = true;
              this.isEdit = true;
              this.isSendBack = true;;
              this.isJump = true;
              this.editData = res;
              this.editData.taskId = this.pushData.taskId;
              this.editData.fileList = this.fileList;
              this.editData.degree = this.pushData.processVariables.degree;
              this.editData.pdfId = this.pushData.procDefId;
              this.editData.pathName = this.pushData.pathName;
          }).catch(()=>{
            this.$message.error('数据查询失败')
          }).finally((data)=>{
        })
      } else if(this.pushData.pathName === 'examine' && this.pushData.processVariables.processState === '6') {
         getQueryById({id:this.pushData.processVariables.relevancyId}).then(res=>{
              this.fileList = res.fileList || [];
              this.pdfId = res.procinstid;
              this.procInstId = res.procinstid;
              this.dialogShow = false;
              this.isAdd = true;
              this.isEdit = true;
              this.isSendBack = true;;
              this.isJump = true;
              this.editData = res;
              this.editData.taskId = this.pushData.taskId;
              this.editData.fileList = this.fileList;
              this.editData.degree = this.pushData.processVariables.degree;
              this.editData.pdfId = this.pushData.procDefId;
              this.editData.pathName = this.pushData.pathName;
          }).catch(()=>{
            this.$message.error('数据查询失败')
          }).finally((data)=>{
        })
      } else {
        getQueryById({id:this.pushData.processVariables.relevancyId}).then((res)=>{
          this.dialogShow = false;
          this.isEdit = false;
          this.isCopy = false;
          this.isSendBack = false;
          this.isJump = true;
          this.isAdd = false;
          this.editData = res;
          this.editData.pathName = this.pushData.pathName;
        })
      }
    }
    if (this.$route.params.rowData) {
      this.add = true
      console.log(this.$route.params.rowData)
    }
  },

  created () {
    this.init ()
    this._validationAuth ()
     queryDicById({id: '1176029308984381440'}).then(res => {
          this.natureAccount = res
      })
     queryDicById({id: '1176029677860835328'}).then(res => {
          this.typeList = res
      })
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
      if (val.path.indexOf('paymentRequest') !== -1) {
        this.identification = val.params.identification
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
  .el-date-editor .el-range-input{
    width: 40% !important;
  }
</style>
<style  lang='scss'>
.fina_applica{
  .d2-container-full__header{
    padding-bottom: 0px !important;
    padding-top: 15px !important;
    .el-form-item--mini.el-form-item {
      margin-bottom: 0px
    }
  }
}
.el-range-separator{ display: contents !important; }
</style>