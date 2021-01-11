<template>
    <el-dialog
        title="审批信息"
        :visible.sync="dialogVisible"
        width="70%"
        :before-close="cancel">
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column :label="'序号'" type="index" width="60px" :index="indexMethod"></el-table-column>
            <el-table-column v-for="(col, index) in rowHeader"
                :show-overflow-tooltip="true"
                :key="index"
                :prop="col.prop"
                :label="col.label"
                :width="col.width"
                :minWidth="col.minWidth"
                :column-key="index.toString()">
                <template slot-scope="scope">
                    <ex-slot v-if="col.render" :render="col.render" :row="scope.row" :index="scope.$index" :column="col"></ex-slot>
                    <span v-else>{{ scope.row[col.prop] }}</span>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="附加信息" v-dialogDrag :visible.sync="subjoinShow" width="60%" append-to-body>
            <el-table :data="subjoinTableData" border style="width: 100%">
                <el-table-column :label="'序号'" type="index" width="60px" :index="indexMethod2"></el-table-column>
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
                <el-button @click="subjoinCancel">关 闭</el-button>
            </span>
        </el-dialog>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">关 闭</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { tracePageList, taskSubjoinList } from "@/api/officalDocument/index"
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
    props: {
        procInstId: {
            type: String,
            default: () => { return '' }
        },
        dialogVisible: {
            type: Boolean,
            default: false
        }
    },
    components: { exSlot },
    data () {
        return {
            subjoinTableData: [],
            rowHeader: [
                {
                    prop: 'name',
                    label: '节点名称',
                    minWidth: '100px',
                    isShow: true,
                },
                {
                    prop: 'candidateNames',
                    label: '审批人',
                    minWidth: '100px',
                    isShow: true,
                    render:(h, params) =>{
                        return h('div',{}, 
                            params.row.candidateNames = params.row.taskLocalVariables.candidateNames ? params.row.taskLocalVariables.candidateNames : ''
                        )
                    }
                },
                {
                    prop: 'assigneeName',
                    label: '办理人',
                    minWidth: '100px',
                    isShow: true,
                    render:(h, params) =>{
                        return h('div',{},
                            params.row.assigneeName = params.row.taskLocalVariables.assigneeName ? params.row.taskLocalVariables.assigneeName : ''
                        )
                    }
                },
                {
                    prop: 'startTime',
                    label: '开始时间',
                    minWidth: '170px',
                    isShow: true,
                },
                {
                    prop: 'endTime',
                    label: '结束时间',
                    minWidth: '170px',
                    isShow: true,
                },
                {
                    prop: 'durationInMillis',
                    label: '持续时间',
                    minWidth: '120px',
                    isShow: true,
                    render: (h, parms) => {
                        return h('p', {
                            on: {

                            }
                        }, util.formatDuring(parms.row.durationInMillis));
                    }
                },
                {
                    prop: 'category',
                    label: '类型',
                    minWidth: '80px',
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
                    width: '100px',
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
                    minWidth: '200px',
                    isShow: true
                },
                {
                    prop: '',
                    label: '操作',
                    width: 100,
                    isShow: true,
                    render: (createElement, params) => {
                        return createElement('div',
                            [createElement('el-button', {
                                attrs: { type: 'text', },
                                style:{color: !params.row.subjoin ? '#999' : '#409EFF',},
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
                                }}, '附加信息')
                            ],
                        )
                    }
                }
            ],
            tableData: [],
            subjoinShow: false,
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
            ]
        }
    },
    methods: {

        cancel () {
            this.$emit('cancel')
        },

        indexMethod (index) {
            return index + 1 ;
        },

        indexMethod2 (index) {
            return index + 1;
        },

        getTracePageList (id) {
            tracePageList(id).then(res => {
                if (res && res.length > 0) {
                    this.tableData = res
                }
            })
        },

        subjoinCancel () {
            this.subjoinShow = false;
        },
    },

    watch: {
        procInstId (newVal) {
            this.getTracePageList(newVal)
        }
    }
}
</script>