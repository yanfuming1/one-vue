<template>
  <div >
    <el-drawer
      title="审批记录"
      :visible.sync="drawer"
      :before-close="handleClose"
      size="60%">
       <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
              :label="'序号'"
              type="index"
              width="60px"
              :index="indexMethod">
          </el-table-column>
          <el-table-column v-for="(col, index) in rowHeader"
                :show-overflow-tooltip="true"
                :key="index"
                :prop="col.prop"
                :label="col.label"
                :width="col.width"
                :column-key="index.toString()">
              <template slot-scope="scope">
                  <ex-slot v-if="col.render" :render="col.render" :row="scope.row" :index="scope.$index" :column="col"></ex-slot>
                  <span v-else>
                  {{ scope.row[col.prop] }}
          </span>
              </template>
          </el-table-column>
      </el-table>
    </el-drawer>
      <el-dialog
            title="附加信息"
            v-dialogDrag
            :visible.sync="subjoinShow"
            width="60%"
            >
            <el-table
                    :data="subjoinTableData"
                    border
                    style="width: 100%">
                    <el-table-column
                        :label="'序号'"
                        type="index"
                        width="60px"
                        :index="indexMethod2">
                    </el-table-column>
                    <el-table-column v-for="(col, index) in subjoinRowHeader"
                        :show-overflow-tooltip="true"
                        :key="index"
                        :prop="col.prop"
                        :label="col.label"
                        :width="col.width"
                        :minWidth="col.minWidth"
                        :column-key="index.toString()">
                        <template slot-scope="scope">
                            <ex-slot v-if="col.render" :render="col.render" :row="scope.row" :index="scope.$index" :column="col"></ex-slot>
                            <span v-else>
                                {{ scope.row[col.prop] }}
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            <span slot="footer">
                <el-button @click="subjoinCancel">取 消</el-button>
            </span>
        </el-dialog>
  </div>
</template>

<script>
import { tracePageList,taskSubjoinList } from "../../../../api/officalDocument/index"

import util from '@/libs/util';
  let exSlot = {
      functional: true,
      props: {
          row: Object,
          render: Function,
          index: Number,
          column: {
              type: Object,
              default: null
          }
      },
      render: (h, data) => {
          const params = {
              row: data.props.row,
              index: data.props.index
          };
          if (data.props.column) params.column = data.props.column;
          return data.props.render(h, params)
      }
  };
  export default {
    components: {exSlot},
     props: {
        // 流程实例ID: 查询流程审批信息
        procInstId: {
            type: String,
            default: () => {
                return '510001'
            }
        },
        // 流程定义ID: 查询流程图信息
        pdfId: {
            type: String,
            default: () => {
                return '510001'
            }
        },
        drawerShow: {
          type: Boolean,
          default: false
        }
    },
    data() {
      return {
        drawer: this.drawerShow,
        tableData:[],
        subjoinTableData:[],
        subjoinShow:false,
        rowHeader: [
            {
                prop: 'name',
                label: '节点名称',
                width: '100px',
                isShow: true,
            },
            {
                prop: '',
                label: '审批人',
                width: '100px',
                isShow: true,
                render:(h, params) =>{
                    let text = '';
                    if (params.row.taskLocalVariables.candidateNames) {
                        text = params.row.taskLocalVariables.candidateNames;
                    }
                    return h('div',{

                    },text)
                }
            },
            {
                prop: '',
                label: '办理人',
                width: '100px',
                isShow: true,
                render:(h, params) =>{
                    let text = '';
                    if (params.row.taskLocalVariables.assigneeName) {
                        text = params.row.taskLocalVariables.assigneeName;
                    }
                    return h('div',{

                    },text)
                }
            },
            {
                prop: 'startTime',
                label: '开始时间',
                width: '145px',
                isShow: true,
            },
            {
                prop: 'endTime',
                label: '结束时间',
                width: '145px',
                isShow: true,
            },
            {
                prop: 'durationInMillis',
                label: '持续时间',
                width: '150px',
                isShow: true,
                render: (h, parms) => {
                    let text = '';
                    text = util.formatDuring(parms.row.durationInMillis)
                    return h('p', {
                        on: {

                        }
                    },text);
                }
            },
            // 1申请 2审批
            {
                prop: 'category',
                label: '类型',
                width: '80px',
                isShow: true,
                render: (h, parms) => {
                    return h('p', {
                        on: {

                        }
                    }, parms.row.category === '1' ? '申请' : '审批');
                }
            },
            {
                prop: 'operation',
                label: '办理状态',
                width: '80px',
                isShow: true,
                render: (h,params) =>{
                    let text = '';
                    switch (params.row.taskLocalVariables.operation) {
                        case '1':
                            text = '提交'
                            break;
                        case '2':
                            text = '同意'
                            break;
                        case '3':
                            text = '驳回'
                            break;
                        case '4':
                            text = '作废'
                            break;
                        default:
                            break;
                    }
                    return h('div',{
                    },text)
                }
            },
            {
                prop: 'hastenCount',
                width: '100px',
                label: '催办次数',
                isShow: true,
                render: (h,params) =>{
                    let text = params.row.taskLocalVariables.hastenCount;
                    return h('div',{
                    },text)
                }
            },
            {
                prop: 'deleteReason',
                label: '审批意见',
                width: '200px',
                isShow: true
            },
            {
                prop: '',
                label: '操作',
                isShow: true,
                render: (createElement, params) => {
                    return createElement('div',
                        [
                            createElement('el-button', {
                                attrs: {
                                    type: 'text',
                                },
                                style:{
                                    color: !params.row.subjoin ? '#999' : '#409EFF',
                                },
                                // subjoin
                                on: {
                                    click: () => {
                                        taskSubjoinList({taskId:params.row.id}).then(res=>{
                                            if (res.length > 0) {
                                                this.subjoinShow = true;
                                                this.subjoinTableData = res;    
                                            } else {
                                                this.$message.warning('暂无附加信息')
                                            }
                                        })
                                    }
                                }
                            }, '附加信息')
                        ],
                    )
                }
            }
        ],
        subjoinRowHeader:[
            {
                prop: 'activityName',
                label: '节点名称',
                minWidth: '100px',
                isShow: true,
            },
            {
                prop: 'type',
                label: '类型',
                minWidth: '100px',
                isShow: true,
                render: (h, params)=>{
                    let text = '';
                    if (params.row.type === 1) {
                        text = '转办'
                    } else if (params.row.type === 2) {
                        text = '指定'
                    } else if (params.row.type === 3) {
                        text = '抄送'
                    } 
                    return h('div',{
                    },text)
                }
            },
            {
                prop: 'createName',
                label: '操作人',
                minWidth: '100px',
                isShow: true,
            },
            {
                prop: 'candidateNames',
                label: '接收人',
                minWidth: '100px',
                isShow: true,
            },
            {
                prop: 'message',
                label: '消息',
                minWidth: '100px',
                isShow: true,
            },
            {
                prop: 'createTime',
                label: '操作时间',
                minWidth: '100px',
                isShow: true,
            },
        ],
        tableOption:{
            border: false
        },
      }
    },
    methods: {
        handleClose () {
            this.$emit('drawClose')
        },
        indexMethod (index) {
            return index + 1 ;
        },
        indexMethod2 (index) {
            return index + 1 ;
        },
        // 附加信息取消
        subjoinCancel () {
            this.subjoinShow = false;
        },
    },
    mounted () {
        if (this.procInstId || this.pdfId) {
            tracePageList(
                this.procInstId
            ).then(res => {
                this.tableData = res
            })
        }
    },
    watch: {
      drawerShow(newValue, oldValue) {
        this.drawer = newValue;
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>