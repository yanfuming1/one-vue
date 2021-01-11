<template>
     <d2-container class="fina_applica" v-if="dialogShow === 'mainPage'">
        <template  slot="header" style="padding-bottom:0">
            <div class="customer-list-header">
              <el-form :inline="true" class="demo-form-inline " :model="search" ref="form" size="mini">
                  <el-form-item v-if="$has ('finance:accountFund:add')">
                    <el-button type="primary" @click="addAccountBtn">添加</el-button>
                  </el-form-item>
                  <el-form-item label prop="keywords">
                    <el-input v-model="search.keywords" prefix-icon="el-icon-search" placeholder="请输入内容" style="width: 200px;" :clearable="true"/>
                  </el-form-item>
                  <el-form-item label prop="keywords">
                       <el-date-picker
                        v-model="dateTime"
                        style="width:320px"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        @change="dateChange"
                        :picker-options="pickerOptions"
                        :default-time="['08:00:00', '18:00:00']"
                        end-placeholder="结束日期">
                      </el-date-picker>
                  </el-form-item>
                  <el-form-item>
                      <el-button type="primary" @click="dataSearch()">搜索</el-button>
                  </el-form-item>
                  <el-form-item v-if="$has ('finance:accountFund:deleteBatch')">
                      <el-button type="primary" @click="deleteAll">批量删除</el-button>
                  </el-form-item>
                  <el-form-item>
                      <el-button type="info" @click="resetFun">重置</el-button>
                  </el-form-item>
                  <el-form-item >
                      <el-select v-model="states" @change="searchState" placeholder="请选择认定状态" style="width: 160px;" clearable  >
                          <el-option label="未认定" value="未认定" />
                          <el-option label="已认定" value="已认定" />
                      </el-select>
                  </el-form-item>
                  <el-button-group>
                    <el-button size="mini" v-if="$has ('finance:accountFund:uploadFilesToTemp')" icon="el-icon-download" @click="handleBtn('导入')">导入</el-button>
                    <el-button size="mini" icon="el-icon-upload2" @click="uploadExcelFun">导出</el-button>
                    <el-button size="mini" icon="el-icon-printer" @click="handleBtn('打印')">打印</el-button>
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
        <upload-excel :showUpload="showUpload"  @closeDialog="closeDialog" @uploadFun="uploadFun"></upload-excel>
        <el-dialog
          v-dialogDrag
          title="上传附件"
          :visible.sync="fileShow"
          width="30%"
          @close="fileClose">
              <upload id="male"  ref="upLoad" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList"></upload>
          <span slot="footer">
            <el-button type="primary" @click="fileOk">确 定</el-button>
            <el-button @click="fileClose">取 消</el-button>
          </span>
        </el-dialog>
        
     </d2-container>
     <edit-dialog  v-else-if="dialogShow === 'edit'"  @cancelBtn="cancelFun" :modelData="editData" :isAdd="isAdd" @successFun="successFun"></edit-dialog>
     <add-dialog v-else-if="dialogShow === 'add'" @cancelBtn="cancelFun" :modelData="editData" :isAdd="isAdd" @successFun="successFun"></add-dialog>
</template>

<script>
import { getFinanceFundFeterminationList,getFinanceFundFeterminationPage,getFinanceFundFeterminationDel,goDetail,importExcel,uploadAjx,upLoad} from '../../../api/financialManagement/financeFundFetermination';
import addDialog from './components/addDialog';
import editDialog from './components/editDialog';
import uploadExcel from '../component/upLoad/index';
import {qqtTable,upload} from '../../../components/qqt-subassembly';
import util from '@/libs/util.js'
import { fail } from 'assert';
import log from '../../../libs/util.log';
let that = this;
export default {
  components: {
      addDialog,
      editDialog,
      uploadExcel,
      qqtTable,
      upload
  },
  data() {
    return {
      pickerOptions: {
          disabledDate: (time) => {
            return this.dealDisabledDate(time);
          }
      },
      states:'',
      fileRow: {},
      fileList: [],
      exportData: [],
      upLoadFileDefaultList: [],
      fileShow: false,
      dateTime: null,
      showUpload:false,
      dialogShow: 'mainPage',
      isAdd:false,
      form: {
          keywords: '',
          bstatus: '1'
      },
      dynamicHeader: {
          tableId: 'T_1572601657555',
          isSave: false
      },
      editData: {},
      tableData: {},
      selectRow: [],
      rowHeader: [
          {
              prop: 'gatheringamount',
              label: '到账金额（元）',
              isOpenSummary: true,
              isShow: true,
              width: '140px',
              render: (h, params) =>{
                let text = params.row.gatheringamount;
                if (text) {
                  text = Number(text).toFixed(2)
                }
                return h('div', {
                },text)
              }
          },
          {
              prop: 'affirmamount',
              label: '已认定金额（元）',
              isShow: true,
              width: '140px',
              isOpenSummary: true,
              render: (h, params) => {
                return h('div', {
                    on: { click: () => { 
                        goDetail({id:params.row.id}).then((res)=>{
                          this.dialogShow = 'add';
                          this.editData = res;
                          this.selectRow = [];
                          this.isAdd = false;
                        })
                     }}
                }, [
                    h ('div', {
                        class: { 'typefaceColor': true, },
                    }, util.moneyTransform(params.row.affirmamount))
                ], )
              }
          },
          {
              prop: '',
              label: '未认定金额（元）',
              isShow: true,
              width: '140px',
              render: (h, params) =>{
                let text = Number(params.row.gatheringamount) - Number(params.row.affirmamount);
                if (text) {
                  text = Number(text).toFixed(2)
                }
                return h('div', {},text)
              }
          },
          {
              prop: 'affirmstate',
              label: '认定状态',
              width: '90px',
              isShow: true
          },
          {
              prop: 'companycollection',
              label: '公司收款账户',
              width: '120px',
              isShow: true,
              // render: (h, params) =>{
              //   let text = params.row.gatheringaccount;
              //   let data = util.replaceAccount(text,text.length-9,text.length-5,'****')
              //   return h('div', {
              //   },data)
              // }
          },
          {
              prop: 'gatheringaccount',
              label: '公司收款账号',
              width: '150px',
              isShow: true
          },
          {
              prop: 'payaccount',
              label: '对方付款账户',
              width: '120px',
              isShow: true
          },
          {
              prop: 'paymark',
              label: '付款留言',
              width: '120px',
              isShow: true
          },
          {
              prop: 'gatheringtime',
              label: '收到时间',
              width: '170px',
              isShow: true,
              // render: (h,params) => {
              //   let text = '';
              //   text = params.row.gatheringtime ? new Date(params.row.gatheringtime).format('yyyy-MM-dd hh:mm:ss') : '';
              //   return h('div',{
              //   },text) 
              // }
          },
          {
              prop: 'createName',
              label: '登记人',
              width: '100px',
              isShow: true,
          },
          {
              prop: 'createTime',
              label: '登记时间',
              width: '170px',
              isShow: true
          },
          {
            prop: '',
            label: '操作',
            width: '200px',
            isShow: true,
            fixed: 'right',
            render: (createElement, params) => {
                return createElement('div',
                    [
                        this.$has ('finance:accountFund:accessory') ? createElement('el-button', {
                           attrs: {
                                type: 'text',
                            },
                            on: {
                                click: () => {
                                    this.fileRow = params.row;
                                    this.fileList = [];
                                    this.upLoadFileDefaultList = [];
                                    this.fileShow = true;
                                }
                            }
                        }, '附件') : '',
                        this.$has ('finance:accountFund:edit') ? createElement('el-button', {
                            attrs: {
                                type: 'text',
                                disabled: params.row.affirmstate === '已认定' ? true :false
                            },
                            style:{
                                color: params.row.affirmstate === '已认定' ? '#999' : '#409EFF',
                            },
                            on: {
                                click: () => {
                                    // this.selectRow = [];
                                    // this.drawerData = params.row;
                                    goDetail({id:params.row.id}).then((res)=>{
                                      this.dialogShow = 'edit';
                                      this.editData = res;
                                      this.selectRow = [];
                                      this.isAdd = false;
                                    })
                                }
                            }
                        }, '编辑') : '' ,
                        this.$has ('finance:accountFund:delete') ? createElement('el-button', {
                             attrs: {
                                type: 'text',
                                disabled: params.row.affirmstate === '已认定' ? true :false
                            },
                            style:{
                                color: params.row.affirmstate === '已认定' ? '#999' : '#409EFF',
                            },
                            on: {
                                click: () => {
                                    util.confirm().then(res =>{
                                      if (res) {
                                         getFinanceFundFeterminationDel ({ids:params.row.id}).then(res=>{
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
        time: '',
        pageNo: 1,
        pageSize: 10,
      }
    }
  },
  methods: {
    searchState (states) {
      this.search.pageNo = '1'
      if (this.dateTime) {
         let time = this.dateTime[0] + ',' + this.dateTime[1];
         this.search.time = time;
      } else {
         this.search.time = '';
      }
      let newData = Object.assign({},this.search)
      newData.keywords = states;
      getFinanceFundFeterminationPage (newData).then(res => {
          this.tableData = res;
          this.selectRow = [];
      })
    },
    dealDisabledDate(time) {
        var times = Date.now()
        return time.getTime() > times;
    },
    // 导出
    getExportData () {
        this.exportData = JSON.parse(JSON.stringify((this.tableData.records))) || [];
        return new Promise((resolve, reject) => {
          // this.exportData.forEach((item,index) => {
          //   item.procState = util.handleState(item.procState);
          //   item.audit = item.audit === '0' ? '未审核' : '已审核';
          // });
          resolve (true)
        });
    },
    uploadExcelFun () { 
      this.getExportData().then(res => {
        this.$refs.table.getExportExcel()
      })
    },
    upLoadFileCallBack (item) {
        this.fileList = item
    },
    // 附件上传
    fileClose () {
      this.fileShow = false;
    },
    fileOk () {
      let jsonData = {
        fileList: this.fileList,
        id: this.fileRow.id
      }
      upLoad (jsonData).then(res => {
        this.$message.success(res.message)
        this.fileShow = false;
      })
    },
    // 添加
    addAccountBtn () {
      this.dialogShow = 'add';
      this.isAdd = true;
      this.editData = {};
      this.selectRow = [];
    },
    // 搜索
    dataSearch () {
      // if (!this.search.keywords) {
      //   this.$message.error('请输入想要查询的关键字');
      //   return;
      // }
      this.search.pageNo = '1'
      if (this.dateTime) {
         let time = this.dateTime[0] + ',' + this.dateTime[1];
         this.search.time = time;
      } else {
         this.search.time = '';
      }
      getFinanceFundFeterminationPage (this.search).then(res => {
          this.tableData = res;
          this.selectRow = [];
      })
    },
    dateChange (date) {
      if (date) {
        let time = date[0] + ' 00:00:00' + ',' + date[1] + ' 23:59:59';
        this.search.time = time;
      } else {
         this.search.time = '';
      }
      this.selectData =[];
      getFinanceFundFeterminationPage (this.search).then(res => {
          this.tableData = res;
      }).catch(err => {
          console.log(err);
      });
    },
    resetFun () {
      this.search.keywords = '';
      this.states='';
      this.dateTime = null;
      this.dataSearch();
    },
    // 批量删除
    deleteAll () {
      if (this.selectRow.length > 0) {
   
        this.$confirm('是否删除选择行数据', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            // let ids = '';
            // for (let i = 0; i < this.selectRow.length; i++) {
            //   ids += this.selectRow[i].id + ',';
            // }
            let ids = '';
            let indexs = '';
            let flag = false;
            for (let i = 0; i < this.selectRow.length; i++) {
              if (this.selectRow[i].affirmstate != '未认定') {
                let idxIndex = this.tableData.records.findIndex(item => item.id === this.selectRow[i].id);
                indexs += idxIndex - 0 + 1 +',';
                flag = true;
              }
              ids += this.selectRow[i].id + ',';
            }
            if (flag) {
              this.$message.error( `请确认第${indexs.substring(0,indexs.length-1)}行的状态，只有未认定支持删除`);
              return
            }
            getFinanceFundFeterminationDel ({ids:ids.substring(0,ids.length-1)}).then(res => {
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
          getFinanceFundFeterminationDel ({ids:row.id}).then(res => {
              this.tableData.records.splice(index,1);
              this.tableData.total --;
              this.$message.success('删除成功')
          }).catch(err => {
              console.log(err);
          });
      })
    },
    pageChange (data) {
      this.search.pageNo = data.current;
      this.search.pageSize = data.size;
      this.dateChange(this.dateTime);
    },
    selectChange (val) {
      this.selectRow = val;
    },
    // 取消
    cancelFun () {
      this.dialogShow = 'mainPage';
    },
    successFun (data) {
      this.$message.success('保存成功')
      this.dialogShow = 'mainPage';
      this.getTableData();
    },
    // 获取table数据
    getTableData () {
      this.selectRow = [];
      getFinanceFundFeterminationList (this.page).then(res => {
          this.tableData = res;
      }).catch(err => {
          console.log(err);
      });
    },
    //导入
    handleBtn (val) {
      if (val ==='导入') {
        this.showUpload = true;
      } else {
        this.$refs.table.printTable (this.selectRow)
      }
    },
    closeDialog () {
        this.showUpload = false;
    },
    uploadFun (data,bank,companyBank, information) {
      this.showUpload = false;
      let jsonData = {
        data:data,
        importway: bank,
        id: companyBank,
        ...information
      }
      importExcel(jsonData).then(result=>{
          this.getTableData();
          this.$message.success('导入成功')
      })
    },
  },
  mounted () {
    this.getTableData();
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
<style lang='scss'>
.el-date-editor .el-range-input{ width: 42%; }
.fina_applica{
  .d2-container-full__header{
    padding-bottom: 0px !important;
    .el-form-item--mini.el-form-item {
      margin-bottom: 0px
    }
    .el-range-separator{
      display: contents !important;
    }
  }
}
</style>