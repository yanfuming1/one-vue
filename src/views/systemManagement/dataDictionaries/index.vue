<template>
	<d2-container>
		<dic-search ref="searchDic" @delIds="delDic" @search="searchDic" />
		<div class="position-management-center">
			<div class="position-management-center___left">
				<qqt-tree
          :title="title"
          :data="treeData"
          :isShowHeader="isShowHeader"
          :btnTitle="treeTitle"
          :button="btnTitle"
          :defaultProps="defaultProps"
          :dic="dicBtn" 
          @appendDic="addGroup"
          @editDic="editDic"
          @delete="delTreeNode"
          @historicalData="historicalData"></qqt-tree>
			</div>
			<div class="position-management-center___right">
				<div class="position-management-center___right___top" v-if="showTop">
					<div class="top-title">
						<p>
              <span @click="addDic('1')"><i class="el-icon-plus"></i>添加</span>  
              <!-- {{ groupTitle }} -->
            </p>
					</div>
					<div class="top-table"> 
						<qqt-table
              :data="dictionaryName"
              :rowHeader="dictionaryHeader"
              :option="tableOption"
              :orderNumber="orderNumber"
              @page="changePage"
              :dynamicHeader="dynamicHeader"
              @selectionChange="selectChange"
              ></qqt-table>
					</div>
				</div>
				<div class="position-management-center___right___top" v-else>
					<div class="top-title">
						<p>
							<span @click="backTo"><i class="el-icon-d-arrow-left"></i>返回上级</span>
							<span @click="addDic('2')"><i class="el-icon-plus"></i>添加</span>
              {{ bottomTitle }}
						</p>
					</div>
					<div class="top-table">
						<qqt-table
							:data="classificationAttendanceData"
							:rowHeader="classificationAttendanceHeader"
							:option="tableOption"
							:pageShow="pageShow"
							@selectionChange="selectChange"
						></qqt-table>
					</div>
				</div>
			</div>
		</div>
		<el-dialog
      v-dialogDrag
			class="dic-dialog"
			:title="dialogTitle"
			:visible.sync="dialogVisible"
			width="35%"
			:before-close="handleClose">
			<dic-group
				ref="dicInfo"
				:dicInfo = "dicInfo"
        :labelName = 'labelName'
				:isShowParentName="isShowParentName"
				:isDetail= "isDetail"
				:parentId = "addParentId"
				:parentName = "addParentName"/>
			<span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="subDic" v-show="!isDetail">确 定</el-button>
				<el-button @click="handleClose">取 消</el-button>
			</span>
		</el-dialog>
	</d2-container>
</template>

<script>
import qqtTree from "../../../components/qqt-subassembly/qqt-tree/qqt-tree";
import qqtTable from "../../../components/qqt-subassembly/qqt-table/qqt-table";
import DicSearch from "./components/dic-search";
import { GetDictionaryTree, addDictionary ,editDictionary, delDictionary, queryDicPage, queryDicPageById, queryDicById} from '../../../api/system/dic/dic'
import DicGroup from "./components/dic-group";
import util from "../../../libs/util";
let that = this
export default {
  name: "positionManagement",
  data() {
    return {
      search: "",
      treeTitle: null,
      dicBtn: true,
      isShowHeader: false,
      btnTitle: "新建字典分类",
      title: "数据字典设置",
      treeData: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      pageShow: false,
      isShowParentName: false,
      showTop: true,
      groupTitle: '',
      bottomTitle: '',
      isDetail: false,
      dictionaryName: {
          records: [],
          current: 1,
          pages: 1,
          size: 0,
          total: 0
      },
      labelName: '字典分类',
      dynamicHeader: {
          // tableId: 'T_1101573663',
          // isSave: true
      },
      dictionaryHeader: [
        {
          prop: "name",
          label: "字段名称",
          isShow: true,
          render: (h, params) => {
                return h('span', {
                    style: {
                        color: "#3ba5ff",
                        cursor: 'pointer'
                    },
                    on: {
                        click: () => {
                          queryDicById({id: params.row.id}).then(res => {
                            that.classificationAttendanceData.records = res
                            that.bottomTitle = params.row.name
                            that.showTop = false
                            that.addParentId = params.row.id
                            that.addParentName = params.row.name
                            that.tableIndex = '2'
                          })
                        }
                    }
                }, params.row.name)
          }
        },
        {
          prop: "parentId",
          label: "字典类别",
          isShow: true
        },{
          prop: "dicCode",
          label: "字段编码",
          isShow: true
        },
        {
          prop: "remark",
          label: "说明",
          isShow: true
        },
        {
          prop: "isSystem",
          label: "系统字典",
          isShow: true,
          render: (h, params) => {
            return h('p', {}, params.row.isSystem === '0' ? '否' : '是')
          }
        },
        {
          prop: "isUse",
          label: "状态",
          isShow: true,
          render: (h, parms) => {
            return h("el-button",{
                props: { type: "text", }
              },parms.row.isUse === '1' ? "启用" : "禁用");
          }
        },
        {
          prop: "",
          label:"操作",
          isShow: true,
            render: function (createElement, params) {
                return createElement('div',
                    [
                      createElement('el-button', {
                        attrs: { type: 'text', },
                        on: {
                            click: () => {
                                that.labelName = '字典分类'
                                that.dicInfo = params.row
                                that.dialogTitle = params.row.name
                                that.dialogVisible = true
                                that.isShowParentName = false
                                that.isDetail = true
                            }
                        }
                    }, '详情'),
                    createElement('el-button', {
                        attrs: { type: 'text', },
                        on: {
                            click: () => {
                                that.labelName = '字典分类'
                                that.dicInfo = params.row
                                that.dialogTitle = params.row.name
                                that.dialogVisible = true
                                that.isShowParentName = false
                                that.isDetail = false
                                that.isAdd = false
                                that.editGroup = true
                                this.addStyle = 'addGroup'
                            }
                        }
                    }, '编辑'),
                    createElement('el-button', {
                        attrs: { type: 'text', },
                        on: {
                            click: () => {
                                that.delData(params.row.id)
                            }
                        }
                    }, '删除')
                    ]
                )
            }
        },
      ],
      orderNumber: false,
      classificationAttendanceData: {
          records: [],
          current: 1,
          pages: 1,
          size: 0,
          total: 0
      },
      classificationAttendanceHeader: [
        {
          prop: "name",
          label: "字典名称",
          isShow: true,
          style: {
            color: "#3ba5ff"
          }
        },
        {
          prop: "dicCode",
          label: "编码",
          isShow: true
        },
        {
          prop: "remark",
          label: "备注",
          isShow: true
        },
        {
          prop: "score",
          label: "系统字典",
          isShow: true,
          render: (h, params) => {
             return h('p', {
                style: {},
              }, params.row.isSystem === '0' ? '否' : '是')
          }
        },
          {
          prop: "isUse",
          label: "状态",
          isShow: true,
          render: (h, parms) => {
            return h("el-button",{
                props: { type: "text",}
              },parms.row.isUse === '1' ? "启用" : "禁用"
            );
          }
        },
        {
          prop: "",
          label:"操作",
          isShow: true,
            render: function (createElement, params) {
                return createElement('div',
                    [
                        createElement('el-button', {
                            attrs: { type: 'text', },
                            on: {
                                click: () => {
                                    that.labelName = '字段名称'
                                    that.dicInfo = params.row
                                    that.dialogTitle = params.row.name
                                    that.dialogVisible = true
                                    that.isDetail = true
                                }
                            }
                        }, '详情'),
                        createElement('el-button', {
                            attrs: { type: 'text', },
                            on: {
                                click: () => {
                                    that.labelName = '字段名称'
                                    that.dicInfo = params.row
                                    that.dialogTitle = params.row.name
                                    that.dialogVisible = true
                                    that.isDetail = false
                                    that.isAdd = false // 这是编辑
                                    that.editGroup = false
                                    that.addStyle = 'addDic'
                                }
                            }
                        }, '编辑'),
                        createElement('el-button', {
                            attrs: { type: 'text', },
                            on: {
                                click: () => {
                                    that.delData(params.row.id)
                                }
                            }
                        }, '删除'),
                    ]
                )
            }
        }
      ],
      tableOption: {
        border: false,
        children: 'child',
      },
      dialogVisible: false,
      dialogTitle: '新建数据字典',
      addStyle: '',
      isAdd: true,
      dicInfo: {},
      addParentId: '',
      addParentName: '',
      delIds: '',
      treeChoseId: '',
      selectData: null,
      isSearch: false,
      searchItem: {
          keywords: '',
          status: '',
          pageNo: '1',
          pageSize: '10'
      },
      tableIndex: '1',
      editGroup: true,
    };
  },
  components: {
    DicGroup,
    DicSearch,
    "qqt-tree": qqtTree,
    "qqt-table": qqtTable
  },
  methods: {
      selectChange(val) {
          this.delIds = ''
          if(val.length > 0){
              val.forEach(item => {
                  this.delIds += item.id + ','
              })
          }
      },
      getDicTree () {
          GetDictionaryTree().then(res => {
              that.treeData = res
              if (this.selectData == null) {
                this.historicalData (res[0])
              } else {
                let item = res.find (f => f.id === this.selectData.id)
                if (item) {
                  this.historicalData (item)
                } else {
                  this.historicalData (res[0])
                }
              }
          })
      },
      historicalData (data) {
          console.log(data.pageList)
          this.selectData = data
          // this.showTop = true
          this.groupTitle = data.name
          this.dictionaryName = data.pageList
          this.addParentId = data.id
          this.treeChoseId = data.id
          this.addParentName = data.name
          this.isSearch = false
          if(!this.showTop) {
            this.backTo()
          }
      },
      editDic (node, data){
          this.dialogTitle = data.name
          this.dialogVisible = true
          this.isShowParentName = true
          this.isAdd = false
          this.dicInfo = data
          this.editGroup = true
          this.addStyle = 'addGroup'
      },
      handleClose (){
        this.$refs.dicInfo.clearValidate();
        this.dialogVisible = false;
      },
      addGroup () {
          this.formatAddData()
          this.addStyle = 'addGroup'
          this.isShowParentName = true
      },
      delTreeNode (data) {
          this.delData(data.id)
      },
      // 批量删除s
      delDic(){
          this.delData(this.delIds)
      },
      // 删除方法
      delData (data) {
        util.confirm("确定删除吗？").then(vaild => {
          if (vaild) {
            delDictionary({ids: data}).then(res => {
                this.getDicTree ()
                this.$message.success("删除成功")
            })
          }
        })
      },
      addDic (tableIndex) {
          this.formatAddData()
          this.addStyle = 'addDic'
          this.tableIndex = tableIndex
          this.labelName = tableIndex === '1' ? '字典分类' : '字段名称'
      },
      formatAddData () {
        this.dialogTitle = '新建数据字典'
        this.dialogVisible = true
        this.isDetail = false
        this.isAdd = true
        this.dicInfo = {
            isSystem: '',
            isUse: '',
            name: null,
            dicCode: null
        }
      },
      subDic () {
          let info = this.$refs.dicInfo.getData()
          if(!info.canSub){
            this.$message.warning("信息填写不正确!!!")
          } else {
            info.info.parentId = this.addStyle === 'addGroup' ? '0' : this.addParentId
            if(this.isAdd){
              addDictionary( info.info ).then(res => {
                  if(this.addStyle === 'addGroup'){  this.getDicTree() }
                  that.dialogVisible = false
                  that.$message.success('添加成功')
              }).finally(() => {
                if (this.tableIndex === '1') { this.changePage(this.searchItem) } 
                    else { this.getTable() }
              })
            }else{
                if(info.info.pageList){ info.pageList = null }
                editDictionary( info.info).then(res => {
                    that.dialogVisible = false
                    that.$message.success("编辑成功")
                }).finally(() => {
                    if(this.editGroup) { this.getDicTree() }
                      else { this.getTable() }
                })
            }
          }
      },
      getTable() {
        queryDicById({id: this.addParentId}).then(res => { 
          switch(this.tableIndex) {
            case '1':
              this.dictionaryName.records = res
              break
            case '2':
              this.classificationAttendanceData.records = res 
              break
          }
        })
      },
      backTo () {
          this.showTop = true
          this.addParentId = this.treeChoseId
          this.tableIndex = '1'
          let treeItem = this.treeData.find(item => item.id === this.treeChoseId)
          if(treeItem) { this.addParentName = treeItem.name }
      },
      changePage (val) {
          if(this.isSearch){
              this.searchItem.pageNo = val.current
              this.searchItem.pageSize = val.size
              this.searchPage()
          }else{
              let tem = {
                  id: this.treeChoseId,
                  pageNo: val.current,
                  pageSize: val.size
              }
              queryDicPageById( tem ).then(res => {
                  that.dictionaryName = res
              })
          }
      },
      searchDic (val) {
          this.isSearch = true
          this.searchItem.keywords = val.keywords
          this.searchItem.status = val.status
          this.searchPage()
      },
      searchPage () {
          this.showTop = true
          queryDicPage( this.searchItem ).then(res => { that.dictionaryName = res })
      }
  },
  mounted() {
      that = this
      this.getDicTree()
      util.setCommonData(this)
  }

};
</script>
<style lang="scss">
.position-management-center {
    display: flex;
    height: calc(100% - 65px);
    margin-top: 10px;
    .position-management-center___left {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        width: 20%;
		    height: 100%;
        display: inline-block;
        background-color: #FFF;
    }
    .position-management-center___right {
        margin-left: 20px;
        width: 78%;
        height: 100%;
        .position-management-center___right___top {
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            height: 100%;
            background-color: #FFF;
            overflow: auto;
            .top-title{
                height: 40px;
                font-size: 14px;
                p{
                    margin: 0px;
                    line-height: 40px;
                    padding-left: 10px;
                    span{
                        margin-right: 30px;
                        color: #409EFF;
                        cursor: pointer;
                    }
                }
            }
            .top-table{
                height: calc(100% - 40px);
                border-top: 1px solid #dddddd;
                box-sizing: border-box;
            }
        }
        .position-management-center___right___bottom {
          height: calc(50% - 20px);
          background-color: #FFF;
          padding: 0px 20px;
          overflow: auto;
        }
    }
}
.dic-dialog {
    .el-dialog__header{
      padding: 10px 0 10px 20px !important
    }
    .el-dialog__body {
        padding: 10px 20px !important;
    }
}
.btn-custom-cancel{
    float: right;
    margin-left: 10px;
}
</style>
