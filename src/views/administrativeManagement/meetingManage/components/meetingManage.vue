<template>
  <d2-container type="fulls" v-if="dialogShow==='默认'">
    <template slot="header">
      <div class="qqt-container-full-header___top">

          <span class="qqt-container-full-header-operation___left">
          <el-button type="primary"  @click="addAccountBtn" size="mini">添加</el-button>
          </span>
        <span class="qqt-container-full-header___search">

          <el-input
              placeholder="请输入内容"
              prefix-icon="el-icon-search"
              v-model="search"
              size="mini">
          </el-input>
          <el-button type="primary" size="mini">搜索</el-button>
        </span>

        <span class="qqt-container-full-header-operation___right">
          <el-date-picker
              v-model="datetime_value"
              size="mini"

              type="datetimerange"

              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['08:00:00', '18:00:00']"

              align="right">
          </el-date-picker>
        </span>


        <span class="qqt-container-full-header-operation___right">
            <p>状态</p>
              <div class="qqt-container-full-header-state___select" style="width:160px;">
                <el-select :size="'mini'" :placeholder="'请选择要搜索的状态'" v-model="state_value">
                   <el-option
                       v-for="item in state"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
              </el-option>
                </el-select>
              </div>

           </span>
        <span class="qqt-container-full-header-operation___right">

            <p>办理状态</p>
              <div class="qqt-container-full-header-state___select" style="width:160px;">
                <el-select :size="'mini'" :placeholder="'请选择要搜索的状态'" v-model="manage_state_value">
                   <el-option
                       v-for="item in manage_state"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
    </el-option>
                </el-select>
              </div>

           </span>
        <span class="qqt-container-full-header-operation___right">

            <p>审核状态</p>
              <div class="qqt-container-full-header-state___select" style="width:160px;">
                <el-select :size="'mini'" :placeholder="'请选择要搜索的状态'" v-model="audit_state_value">
                   <el-option
                       v-for="item in audit_state"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
                   </el-option>
                </el-select>
              </div>

           </span>
        <span class="qqt-container-full-header-operation___right">
          <div style="height: 15px;"></div>
          &nbsp;
           <el-button type="primary" @click="reset_button" size="mini" >重置</el-button>
           <el-button type="info" size="mini" @click="delect_move">批量删除</el-button>


        </span>
        <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                      <el-button size="mini" icon="toExamineMessageEvent">审核</el-button>
                        <el-button size="mini" icon="unExamineMessageEvent">反审核</el-button>
                        <el-button size="mini" icon="el-icon-printer" @click="printTable">打印</el-button>
                    </el-button-group>
                </span>
      </div>
    </template>

    <div class="publish-news-table">
      <qqt-table
          ref="table"
          :data="tabledata"
          :rowHeader="rowHeader"
          :option="tableOption"
          @page="pageChange"
          @selectionChange="selectChange"
      ></qqt-table>
    </div>
    <el-dialog title="编辑会议信息" :visible.sync="dialogFormVisible">
      <el-form :model="complie_data">
        <el-form-item label="会议议题" label-width="80px">
          <el-input v-model="complie_data.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="会议时间" label-width="80px">
          <div class="block">

            <el-date-picker
                v-model="complie_data.datetime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="会议地址" label-width="80px">
          <el-input v-model="complie_data.site" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="主持人" label-width="80px">
          <el-input v-model="complie_data.compere" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="记录人" label-width="80px">
          <el-input v-model="complie_data.notekeeper" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </d2-container>
  <add-meeting v-else-if="dialogShow === '添加'" @return_home="dialogShow='默认'"></add-meeting>
  <record-meeting v-else-if="dialogShow === '记录'" :rocorddata="rocorddata" @return_home="dialogShow='默认'"></record-meeting>
</template>

<script>
import {qqtTable, qqtSelect} from "../../../../components/qqt-subassembly"
import util from '@/libs/util.js'
import {deleteRow, deleteSelfRow, queryById} from "@api/financialManagement/staffLoan";
import addMeeting from "@/views/administrativeManagement/meetingManage/components/addMeeting";
import recordMeeting from "@/views/administrativeManagement/meetingManage/components/recordMeeting";
export default {
  name: "meetingManage",
  components: {qqtTable, qqtSelect,addMeeting,recordMeeting},
  data(){
    return{
      rocorddata:"",
      dialogShow: '默认',
      complie_data:"",
      dialogFormVisible:false,
      table_id:[],
      datetime_value:"",
      search:"",
      state_value:"",
      state: [{
        value: '0',
        label: '未开始'
      }, {
        value: '1',
        label: '已结束'
      },],
      manage_state_value:"",
      manage_state: [{
        value: '0',
        label: '未审批'
      }, {
        value: '1',
        label: '已审批'
      },],
      audit_state_value:"",
      audit_state:[{
        value: '0',
        label: '未审核'
      },
        {
          value: '1',
          label: '已审核'
        },],

      rowHeader:"",
      tabledata: {
        current: 1,
        pages: 6,
        searchCount: true,
        size: 10,
        total: 100,
        records:[]
        },
      tableOption: {
        border: false
      },


    }
  },
  methods :{

    initializedata() {
      this.rowHeader=[{
        prop: "title",
        label: "会议议题",
        isShow: true,
        width:'150',
      },
        {
          prop: "datetime",
          label: "会议时间",
          isShow: true,
          width:'150',
        },
        {
          prop: "site",
          label: "会议地址",
          isShow: true,
          width:'150',
        },
        {
          prop: "compere",
          label: "主持人",
          isShow: true,
          width:'100',
        },
        {
          prop: "notekeeper",
          label: "记录人",
          isShow: true,
          width:'100',
        },
        {
          prop: "state",
          label: "办理状态",
          isShow: true,
          width:'100',
        },
        {
          prop: "number",
          label: "阅读次数",
          isShow: true,
          width:'80',
        },

        {
          prop: "",
          fixed:'right',
          label: "操作",
          isShow: true,
          width:'150',
          render: (createElement, params) => {
            return createElement('div',[
              createElement('el-button', {
                attrs: {
                  type: 'text',
                  disabled: false
                },
                style:{
                  color:'#409EFF'
                },
                on: {
                  click: () => {
                    this.dialogFormVisible=true
                    this.complie_data=params.row
                    console.log(params.row)

                  }}
              },"编辑"),
              createElement('el-button', {
                attrs: {
                  type: 'text',
                  disabled:  false
                },
                style:{
                  color: '#409EFF'
                },
                on: {
                  click: () => {
                      this.rocorddata=params.row
                      this.dialogShow="记录"
                  }},
              },"记录"),
              createElement('el-button', {
                attrs: {
                  type: 'text',
                 // disabled: params.row.procstate === '1'  ? false : true
                  disabled:  false
                },
                style:{
                  //color: params.row.procstate === '1' ? '#409EFF' : '#999',
                  color: '#409EFF'
                },
                on: {
                  click: () => {
                    this.$confirm("确定要删除会议议题为《"+params.row.title+"》的会议么", '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {

                      this.$message({
                        type: 'success',
                        message: '删除成功!'
                      });
                    }).catch(() => {
                      this.$message({
                        type: 'info',
                        message: '已取消删除'
                      });
                    });
                    console.log(params.row)

                  }}
              },"删除"),
            ])
          }
          //////
        },
      ]
    },
    ///修改对话框
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
    //添加
    addAccountBtn(){
      this.dialogShow='添加'
   //   this.$has ('admian:meeting:addmeeting')
    },
  //重置
    reset_button(){
      this.search=""
      this.state_value=""
      this.audit_state_value=""
      this.manage_state_value=""
      this.datetime_value=""
      this.gettabledata()
    },
    ///分页区
    pageChange (data){
      console.log(data)
      this.gettabledata()
    },
    ///选择（批量删除）
    selectChange(data){
      this.table_id=[]
      for (let i=0;i<data.length;i++){
        this.table_id.push(data[i].id)
      }
     // console.log(this.table_id)
    },
    //删除
    delect_move(){
      alert(this.table_id)
      this.gettabledata()
    },
    //打印
    printTable () {
      this.$refs.table.printTable ()
    },
    //刷新，，获取表格数据
    gettabledata(){
      this.tabledata.records=[]
      this.$http.get('/msg1').then(res=> {

        for (let i=0;i<100;i++){
         // console.log(res.data.data[i])
          this.tabledata.records.push(res.data.data[i])
        }

      //  console.log(this.tabledata)
      })

    }
  },
  created() {
    this.initializedata()
    this.gettabledata()
  }
}
</script>

<style scoped>

</style>