<template>
    <d2-container>
        <div slot="header" class="work-adjustment-header">
            <el-form :inline="true" :model="form" ref="form" size="mini">
                <el-form-item>
                    <el-button type="primary" v-if="$has ('workAccommodation:list:add')" @click="addWorkAdjustmentEvent">添加</el-button>
                </el-form-item>
                <el-form-item label prop="name">
                    <el-input v-model="form.keywords" prefix-icon="el-icon-search" placeholder="请输入需搜索的内容" style="width: 200px;" :clearable="true"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="dataSearch">搜索</el-button>
                </el-form-item>
                <el-form-item>
                    <el-date-picker
                        size="mini"
                        v-model="createDate"
                        type="datetimerange"
                        :picker-options="pickerOptions"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至" 
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['08:00:00', '18:00:00']"
                        @change="dataSearch()" 
                        align="right">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="info" @click="resetBtn">重置</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button-group>
                        <el-button size="mini" icon="el-icon-check" @click="adjustmentAuditWorkEvent">审核</el-button>
                        <el-button size="mini" icon="el-icon-close" @click="unAdjustmentAuditWorkEvent">反审核</el-button>
                        <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button> 
                    </el-button-group>
                </el-form-item>
            </el-form>
        </div>
    
        <div class="work-adjustment">
            <qqt-table :data="workAdjustmentData" :option="tableOption" :dynamicHeader="dynamicHeader" :rowHeader="rowHeader" @selectionChange="selectChange" @page="handlePaginationChange" ref="table"></qqt-table>
        </div>
    </d2-container>
</template>


<script>
import { workAdjustmentList, workAdjustmentDeleteId, adjustmentAuditWork } from '../../../../api/personnelManagement/workAdjustment'
import util from '@/libs/util.js'
export default {
    data () {
        return {
            form: {
                keywords:'',
                status:''
            },

            // 时间搜索
            createDate: [],
            pickerOptions: {
                shortcuts: [
                    {
                        text: '最近一周',
                        onClick (picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, 
                    {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, 
                    {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }
                ]
            },

            multipleSelection: [],

            transform: {
                isShowDetails: false
            },
            workAdjustmentData: { },
            tableOption: {
                border: false
            },
            page: {
                current: 1,
                size: 10,
                total: 0
            },
            dynamicHeader: {
                tableId: 'T_1020820773',
                isSave: false
            },
            rowHeader: [
                {
                    prop: 'name',
                    label: '被调整人',
                    isShow:true,
                    render: (h, params) => {
                        return h('el-button', {
                            style: {
                                color: '#3ba5ff'
                            },
                            attrs: {
                                type: 'text'
                            },
                            on: {
                                click: (index, row) => {
                                    this.transform.isShowDetails = true
                                    this.$router.push({
                                        path: 'addWorkAdjustment',
                                        name: 'addWorkAdjustment',
                                        params: {
                                            procInstId: params.row.procInstId,
                                            transform: this.transform,
                                            relevancyId: params.row.id
                                        }
                                    })
                                }
                            }
                        }, params.row.name)
                    }
                },
                {
                    prop: 'originalWorkUnit',
                    label: '原工作单位',
                    isShow:true
                },
                {
                    prop: 'originalDepartment',
                    label: '原工作部门',
                    isShow:true
                },
                {
                    prop: 'presentOccupation',
                    label: '原职务/岗位',
                    isShow:true
                },
                {
                    prop: 'originalWorkUnit',
                    label: '现工作单位',
                    isShow:true
                },
                {
                    prop: 'department',
                    label: '现工作部门',
                    isShow:true
                },
                {
                    prop: 'designatedPosition',
                    label: '现职务/岗位',
                    isShow:true
                },
                {
                    prop: 'procStateName',
                    label: '办理状态',
                    isShow: true,
                    render: (h, parms) => {
                        return h('div', {},
                            parms.row.procStateName = util.handleState (parms.row.procState)
                        )
                    }
                },
                {
                    prop: 'stateName',
                    label: '审核状态',
                    isShow:true,
                    width:'110',
                    render: (h, parms) => {
                        return h('div', {},
                            parms.row.stateName = parms.row.state === '1' ? '已审核' : '未审核'
                        )
                    }
                },
                {
                    prop: 'agent',
                    label: '待办人',
                    isShow:true
                },
                {
                    prop: 'createName',
                    label: '提交人',
                    isShow:true
                },
                {
                    prop: 'createTime',
                    label: '提交时间',
                    isShow:true
                },
                {
                    prop: "",
                    label: "操作",
                    isShow: true,
                    fixed: 'right',
                    width:110,
                    render:(h, params) => {
                        return [
                            this.$has ('workAccommodation:list:edit') ? h("el-button",{
                                props: {
                                    type: "text"
                                },
                                attrs: {
                                    disabled: params.row.procState === '1' ? false : true
                                },
                                style:{
                                    color: params.row.procState === '1'? '#409EFF' : '#999',
                                },
                                on: {
                                    click: (index, row) => {
                                        this.rowData = params.row
                                        this.transform.isShowDetails = false
                                        this.$router.push({
                                            path: 'addWorkAdjustment',
                                            name: 'addWorkAdjustment',
                                            params: {
                                                transform: this.transform,
                                                relevancyId: params.row.id,
                                                isEdit : true
                                            }
                                        })
                                    }
                                }
                            },"编辑") : '',
                            this.$has ('workAccommodation:list:delete') ? h("el-button",{
                                props: {
                                    type: "text"
                                },
                                attrs: {
                                    disabled: params.row.procState === '1' ? false : true
                                },
                                style:{
                                    color: params.row.procState === '1'? '#409EFF' : '#999',
                                },
                                on: {
                                    click: () => {
                                        util.confirm ().then (res => {
                                            if (res) {
                                                workAdjustmentDeleteId({
                                                    id: params.row.id
                                                }).then( res => {
                                                    this.$message.success("删除成功")
                                                    this.getWorkAdjustmentList ()
                                                }).catch( err => {
                                                    this.$message.success("删除失败")
                                                })
                                            }
                                        })
                                    }
                                }
                            },"删除") : '',
                        ];
                    },
                },
            ],
        }
    },
    methods: {
        addWorkAdjustmentEvent () {
            this.$router.push({
                path: 'addWorkAdjustment',
                name: 'addWorkAdjustment',
                params: {
                    isAdd : true
                }
            })
        },
        dataSearch () {
            this.resetPage ()
            this.getWorkAdjustmentList ({
                'name': this.form.keywords ? this.form.keywords : null,
                'createTime': this.createDate ? this.createDate[0] : null,
                'updateTime':this.createDate ? this.createDate[1] : null
            })
        },

        resetBtn () {
            this.form.keywords = ''
            this.createDate = []
            this.getWorkAdjustmentList ()
        },

        getWorkAdjustmentList (item) {
            workAdjustmentList({
                ...item,
                pageNo: this.page.current,
                pageSize: this.page.size
            }).then( res => {
                this.workAdjustmentData = res
            })
        },

        // 复选框选中的数据
        selectChange (val) {
            this.multipleSelection = val
        },

        // 分页变化改动
        handlePaginationChange(val) {
            this.page = val;
            this.$nextTick(() => {
                this.getWorkAdjustmentList()
            });
        },

        resetPage () {
            this.page = {
                current: 1,
                size: 10,
                total: 0
            }
        },

        // 审核
        adjustmentAuditWorkEvent () {
            if ( this.multipleSelection.length === 1) {
                if (this.multipleSelection[0].state === '0') {
                    this.$confirm('您是否要审核该条数据', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        adjustmentAuditWork({
                            id: this.multipleSelection[0].id,
                            type: '1'
                        }).then(res=> {
                        if (res.success) {
                            this.$message.success(res.message);
                        } else {
                            this.$message.error(res.message);
                        }
                        this.getWorkAdjustmentList ();
                        })
                    })
                } else {
                    this.$message.error('该数据已审核不支持继续审核');
                } 
            } else if (this.multipleSelection.length === 0 || this.multipleSelection === undefined) {
                this.$message.error('请选择要审核的数据');
            } else {
                this.$message.error('只支持单条数据操作');
            }
        },

        // 反审核
        unAdjustmentAuditWorkEvent () {
            if (this.multipleSelection.length === 1) {
                if (this.multipleSelection[0].state === '1') {
                    this.$confirm('您是否要反审核该条数据', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        adjustmentAuditWork({
                            id: this.multipleSelection[0].id,
                            type: '0'
                        }).then(res=> {
                            if (res.success) {
                                this.$message.success(res.message);
                            } else {
                                this.$message.error(res.message);
                            }
                                this.getWorkAdjustmentList();
                            })
                    })

                } else {
                this.$message.error('该数据未审核不支持继续反审核');
                }
            } else if (this.multipleSelection.length === 0) {
                this.$message.error('请选择要审核的数据');
            } else {
                this.$message.error('只支持单条数据操作');
            }
        },

        printTable () {
            this.$refs.table.printTable (this.multipleSelection)
        }
    },
    mounted() {
        this.getWorkAdjustmentList()
    },
    components: {
        qqtTable: () => import('../../../../components/qqt-subassembly/qqt-table/qqt-table')
    },
}
</script>

<style lang="scss" scoped>
    .work-adjustment-header{
        margin-bottom: -20px;
    }
    .work-adjustment{
        box-shadow: 0 2px 12px 0 $color-border-shadow;
        background: $color-bg3;
        height: 102%;
        margin-top: -15px
    }
</style>