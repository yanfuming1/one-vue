<template>
     <d2-container class="fina_applica" v-if="dialogShow">
        <template  slot="header" style="padding-bottom:0">
            <div class="customer-list-header">
              <el-form :inline="true" class="demo-form-inline " :model="search" ref="form" size="mini">
                  <el-form-item v-if="identification === '1' ? $has('self:externalLloan:add') : $has ('finance:externalLloan:add')">
                    <el-button type="primary" @click="addAccountBtn">添加</el-button>
                  </el-form-item>
                  <el-form-item v-if="identification === '1' ? $has('self:externalLloan:copy') : $has ('finance:externalLloan:copy')">
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
                      <el-button type="primary" @click="dataSearch('0')">搜索</el-button>
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
                  <el-form-item v-if="identification === '1' ? $has('self:externalLloan:delete') : $has ('finance:externalLloan:delete')">
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
              :dynamicHeader="dynamicHeader"        
              @page="pageChange"
              @selectionChange="selectChange">
            </qqt-table>
          </div>
            <!-- @selectionChange="selectChange" -->
        </template>
        <div>
          <!-- :remoteFuncs="remoteFuncs" @change="updataRelatio  nshipRecordList" -->
            <charge-off :drawer="drawer" v-if="drawer" @successFun="drawerSunccess" :identification="identification" :modelData="drawerData" :value="drawerVal" @change="drawerClose" ></charge-off>
        </div>
        <el-dialog
          v-dialogDrag
          title="借款人类型"
          :visible.sync="borrowShow"
          width="20%"
          @close="borrowCancel">
          <el-select v-model="selectVal" placeholder="请选择借款人类型">
            <el-option label="自然人" value="自然人"></el-option>
            <el-option label="非自然人" value="非自然人"></el-option>
          </el-select>
          <span slot="footer">
            <el-button type="primary" @click="borrowOk">确 定</el-button>
            <el-button @click="borrowCancel">取 消</el-button>
          </span>
        </el-dialog>
     </d2-container>
     <add-dialog v-else @cancelBtn="cancelFun" :selfSupportProject="selfSupportProject" :identification="identification" :isNatural="isNatural" :isCopy="isCopy" :isSendBack="isSendBack" :isJump="isJump" :editType="editType" :modelData="modelData" @successFun="successFun"></add-dialog>
</template>

<script>
import { getExternalLloanList,getGoDetail,deleteRow,getQueryById,deleteBatch,getCheck,getAgainst, 
      deleteBatchNew, deleteRowNew, getExternalLloanListNew} from '../../../api/financialManagement/externalLloan';
import qqtTable from '../../../components/qqt-subassembly/qqt-table/qqt-table';
import addDialog from './components/addDialog';
import chargeOff from './components/chargeOff';
import util from '@/libs/util.js'
import { mapState } from 'vuex'
import { fail } from 'assert';
let that = this;
export default {
  name:'externalLloanss',
  components: {
      qqtTable,
      addDialog,
      chargeOff,
  },
  data() {
    return {
      borrowShow:false,
      isNatural:false,
      drawerData:{},
      modelData:{},
      exportData:[],
      drawerVal:{},
      drawer: false,
      isCopy: false,
      dateTime: null,
      dialogShow: true,
      editType: false,
      isSendBack: false,
      isJump: false,
      dynamicHeader: {
          tableId: 'T_1572601657677',
          isSave: false
      },
      form: {
          keywords: '',
          bstatus: '1'
      },
      selectData: [],
      tableData: {},
      rowHeader: [
          {
              prop: 'lendermoneyName',
              label: '贷款金额（元）',
              isOpenSummary: true,
              width: '150px',
              isShow: true,
              render: (h,params) => {
                return h('div', {
                      attrs: {
                          type: 'text',
                      },
                      class: {
                          'typefaceColor': true, 
                      },
                      on:{
                        click: () =>{
                          getQueryById ({id:params.row.id}).then(res => {
                              this.dialogShow = false;
                              this.editType = true;
                              this.isCopy = false;
                              this.modelData = res.externalLloan;
                              this.modelData.records = res.loanVicels;
                              this.modelData.text0 = '前转入以下借款人指定账号：';
                              this.modelData.text1 = '日前支付，如借贷人不能按期足额支付借款本息，则按照';
                              this.modelData.text2 = '向出借人支付违约金。若双方协商未能解决,出借人提起诉讼, 由出借人所在地人民法院管辖。';
                              this.modelData.text3 = '出借人为实现债权所支付的所有费用,包括但不限于律师费、诉讼费、仲裁费、财产保全费、执行费、差旅费、误工费等由借款人承担。';
                          }).catch(err => {
                              console.log(err);
                          });
                        }
                      }
                  }, params.row.lendermoneyName = (params.row.lendermoney-0).toFixed(2))
              }
          },
          {
              prop: 'procStateName',
              label: '办理状态',
              width: '100px',
              isShow: true,
              render: (h,params) =>{
                return h('div',{
                }, params.row.procStateName = util.handleState (params.row.procState))
              }
          },
          {
              prop: 'auditName',
              label: '审核状态',
              isShow: true,
              render: (h,params) =>{
                let text = '';
                if (params.row.audit === '0') {
                  params.row.auditName = '未审核';
                } else if (params.row.audit === '1') {
                  params.row.auditName = '审核';
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
              prop: 'borrowed',
              label: '贷款人',
              isShow: true
          },
          {
              prop: 'borrowedate',
              label: '贷款时间',
              width: '170px',
              isShow: true
          },
          {
              prop: 'verificationmoneyName',
              label: '核销金额（元）',
              width: '140px',
              isShow: true,
              isOpenSummary: true,
              render: (h,params) => {
                return h('div', {
                      attrs: {
                          type: 'text',
                      },
                  },params.row.verificationmoneyName = (params.row.verificationmoney-0).toFixed(2))
              }
          },
          {
              prop: 'owingmoneyName',
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
              prop: 'verificationman',
              width: '100px',
              label: '核销人',
              isShow: true
          },
          {
              width: '100px',
              prop: 'verificationtime',
              label: '核销时间',
              isShow: true
          },
          {
              width: '100px',
              prop: 'createName',
              label: '经办人',
              isShow: true
          },
          {
              width: '170px',
              prop: 'createTime',
              label: '提交时间',
              isShow: true
          },
          {
            width: '200px',
            prop: '',
            label: '操作',
            isShow: true,
            fixed: 'right',
            render: (createElement, params) => {
                let canVerification = this.identification === '1' ? this.$has ('self:externalLloan:verification') : this.$has ('finance:externalLloan:verification')
                let canEdit = this.identification === '1' ?  this.$has ('self:externalLloan:edit') : this.$has ('finance:externalLloan:edit')
                let canDel = this.identification === '1' ?  this.$has ('self:externalLloan:delete') : this.$has ('finance:externalLloan:delete')
                return createElement('div',
                    [
                        canVerification ? createElement('el-button', {
                            attrs: {
                                type: 'text',
                                disabled: params.row.procState === '10' && params.row.owingmoney-0 != 0 ? false :true
                            },
                            style:{
                                color: params.row.procState === '10' && params.row.owingmoney-0 != 0  ? '#409EFF' : '#999' ,
                            },
                            on: {
                                click: () => {
                                    this.drawer = true;
                                    this.drawerData = params.row;
                                    this.drawerVal = {};
                                }
                            }
                        }, '核销') : '',
                        canEdit ? createElement('el-button', {
                            attrs: {
                                type: 'text',
                                disabled: params.row.procState === '1'  ? false : true
                            },
                            style:{
                                color: params.row.procState === '1' ? '#409EFF' : '#999',
                            },
                            on: {
                                click: () => {
                                  getQueryById ({id:params.row.id}).then(res => {
                                      this.dialogShow = false;
                                      this.isCopy = false;
                                      this.editType = false;
                                      this.modelData = res.externalLloan;
                                      this.modelData.text0 = '前转入以下借款人指定账号：';
                                      this.modelData.text1 = '日前支付，如借贷人不能按期足额支付借款本息，则按照';
                                      this.modelData.text2 = '向出借人支付违约金。若双方协商未能解决,出借人提起诉讼, 由出借人所在地人民法院管辖。';
                                      this.modelData.text3 = '出借人为实现债权所支付的所有费用,包括但不限于律师费、诉讼费、仲裁费、财产保全费、执行费、差旅费、误工费等由借款人承担。';
                                  }).catch(err => {
                                      console.log(err);
                                  });
                                }
                            }
                        }, '编辑') : '',
                        canDel ? createElement('el-button', {
                            attrs: {
                                type: 'text',
                                disabled: params.row.procState === '1'  ? false : true
                            },
                            style:{
                                color: params.row.procState === '1' ? '#409EFF' : '#999',
                            },
                            on: {
                                click: () => {
                                    util.confirm().then(res =>{
                                      if (res) {
                                        let url = this.identification === '1' ? deleteRowNew : deleteRow
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
          border: false,
          isOpenSummary: true
      },
      page: {
        pageNo: 1,
        pageSize: 10,
      },
      search: {
        keywords: '',
        laststart: '',
        state: '',
        audit: '',
        pageNo: 1,
        pageSize: 10,
      },
      selectVal: '',
      identification: '',
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
    borrowCancel () {
      this.borrowShow = false;
    },
    borrowOk () {
      if (this.selectVal === '非自然人') {
        this.isNatural = true;
      } else {
        this.isNatural = false;
      }
      this.modelData = {
        lower: '',
        lendermoney: '',
      };
      this.dialogShow = false;
      this.editType = false;
      this.isCopy = false;
      this.borrowShow = false;
    },
    // 添加
    addAccountBtn () {
        // this.borrowShow = true;
      this.dialogShow = false;
      this.editType = false;
      this.isCopy = false;
      this.borrowShow = false;
    },
    // 复制
    copyBtn () {
        if (this.selectData.length === 1) {
            getQueryById ({id:this.selectData[0].id}).then(res => {
                this.dialogShow = false;
                this.editType = false;
                this.isCopy = true;
                res.externalLloan.createBy = '';
                res.externalLloan.createName = '';
                this.modelData = res.externalLloan;
                this.modelData.id = '';
                this.modelData.text0 = '前转入以下借款人指定账号：';
                this.modelData.text1 = '日前支付，如借贷人不能按期足额支付借款本息，则按照';
                this.modelData.text2 = '向出借人支付违约金。若双方协商未能解决,出借人提起诉讼, 由出借人所在地人民法院管辖。';
                this.modelData.text3 = '出借人为实现债权所支付的所有费用,包括但不限于律师费、诉讼费、仲裁费、财产保全费、执行费、差旅费、误工费等由借款人承担。';
            }).catch(err => {
                console.log(err);
            });
        } else if (this.selectData.length === 0) {
            this.$message.error('请选择要复制的数据');
        } else {
            this.$message.error('只支持单条数据操作');
        }
    },
    stateChange (value) {
      if (this.dateTime) {
         let time = this.dateTime[0] + ' 00:00:00' + ',' + this.dateTime[1] + ' 23:59:59';
         this.search.laststart = time;
      } else {
         this.search.laststart = '';
      }
      this.search.projectCode = this.identification === '1' ? this.selfSupportProject.projectCode : ''
      let url = this.identification === '1' ? getExternalLloanListNew : getExternalLloanList
      url (this.search).then(res => {
          this.tableData = res;
      }).catch(err => {
          console.log(err);
      });
    },
    // 搜索
    dataSearch (type) {
      if (this.dateTime) {
         let laststart = this.dateTime[0] + ' 00:00:00' + ',' + this.dateTime[1] + ' 23:59:59';
         this.search.laststart = laststart;
      } else {
         this.search.laststart = '';
      }
      if(type === '0') {
        this.search.pageNo = '1';
        this.search.pageSize = '10';
      }
      this.search.projectCode = this.identification === '1' ? this.selfSupportProject.projectCode : ''
      let url = this.identification === '1' ? getExternalLloanListNew : getExternalLloanList
      url (this.search).then(res => {
          this.tableData = res;
      }).catch(err => {
          console.log(err);
      });
      this.selectData = [];
    },
    dateChange (date) {
      if (date) {
          let time = date[0] + ' 00:00:00' + ',' + date[1] + ' 23:59:59';
          this.search.laststart = time;
      } else {
         this.search.laststart = '';
      }
      this.selectData =[];
      this.search.projectCode = this.identification === '1' ? this.selfSupportProject.projectCode : ''
      let url = this.identification === '1' ? getExternalLloanListNew : getExternalLloanList
      url (this.search).then(res => {
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
              url ({ids:ids.substring(0,ids.length-1), projectCode: this.selfSupportProject.projectCode || ''}).then(res => {
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
    resetFun () {
      this.search.keywords = '';
      this.search.state = '';
      this.search.audit = '';
      this.dateTime = null;
      this.getTableData();
    },
    pageChange (data) {
      this.search.pageNo = data.current;
      this.search.pageSize = data.size;
      this.dataSearch('1');
    },
    selectChange (val) {
      this.selectData = val;
    },
    successFun (res) {
      this.dialogShow = true;
      this.getTableData();
      this.$message.success('保存成功')
    },
    drawerSunccess () {
      this.drawer = false;
      this.getTableData();
      this.$message.success('核销成功')
    },
    // 取消
    cancelFun () {
      this.dialogShow = true;
    },
    // 获取table数据
    getTableData () {
      this.page.projectCode = this.identification === '1' ? this.selfSupportProject.projectCode : ''
      let url = this.identification === '1' ? getExternalLloanListNew : getExternalLloanList
      url (this.page).then(res => {
          this.tableData = res;
      }).catch(err => {
          console.log(err);
      });
    },
    // 抽屉
    drawerClose () {
      this.drawer = false;
      this.getTableData();
    },
    exportFun () {
      this.$refs.table.getExportExcel();
    },

    printTable () {
      this.$refs.table.printTable (this.selectData)
    }

  },
  computed: {
      ...mapState ('d2admin/selfSupportProject', [
          'selfSupportProject'
      ])
  },
  async created () {
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
      if(this.pushData.pathName === 'sendBack') {
        getQueryById({id:this.pushData.processVariables.relevancyId}).then(res=>{
            this.fileList = res.externalLloan.fileList || [];
            this.dialogShow = false;
            this.editType = false;
            this.isCopy = true;
            this.isSendBack = true;
            this.isJump = true;
            this.modelData = res.externalLloan;
            this.modelData.taskId = this.pushData.taskId;
            this.modelData.pdfId = this.pushData.procDefId;
            this.modelData.degree = this.pushData.processVariables.degree;
            this.modelData.fileList = this.fileList;
          }).catch(()=>{
            this.$message.error('数据查询失败')
          }).finally((data)=>{
        })
      } else if(this.pushData.pathName === 'examine' && this.pushData.processVariables.processState === '6') {
        getQueryById({id:this.pushData.processVariables.relevancyId}).then(res=>{
            this.fileList = res.externalLloan.fileList || [];
            this.dialogShow = false;
            this.editType = false;
            this.isCopy = true;
            this.isSendBack = true;
            this.isJump = true;
            this.modelData = res.externalLloan;
            this.modelData.taskId = this.pushData.taskId;
            this.modelData.pdfId = this.pushData.procDefId;
            this.modelData.degree = this.pushData.processVariables.degree;
            this.modelData.fileList = this.fileList;
          }).catch(()=>{
            this.$message.error('数据查询失败')
          }).finally((data)=>{
        })
      } else {
          getQueryById({id:this.pushData.processVariables.relevancyId}).then(res => {
            this.modelData = res.externalLloan;
            this.dialogShow = false;
            this.editType = true;
            this.isCopy = false;           
            this.isSendBack = false;;
            this.isJump = true;
          })
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
    .el-range-separator{
      display: contents;
    }
 }
</style>