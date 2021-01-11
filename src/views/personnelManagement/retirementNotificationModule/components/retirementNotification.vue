<template>
        <!-- 辞退通知  -->
    <d2-container>
        <div slot="header" class="retirement-notification-header">
            <el-form :inline="true" :model="form" ref="form" size="mini" @submit.native.prevent>
                <el-form-item>
                    <el-button type="primary" v-if="$has ('Dismiss:list:add')" @click="addRetirementNotificationEven">添加</el-button>
                </el-form-item>
                <el-form-item label prop="name">
                    <el-input v-model="form.keywords" prefix-icon="el-icon-search" placeholder="请输入需搜索的内容" style="width: 200px;" @keyup.enter.native="dataSearch"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="dataSearch">搜索</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="info" @click="resetBtn">重置</el-button>
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
                <el-form-item>办理状态</el-form-item>
                <el-form-item>
                    <qqt-select :value="form.procState" :options="procStateOptions" :defaultProp="procStateDefaultProp" :size="'mini'" :placeholder="'请选择'" @select="form.procState = $event, dataSearch()"></qqt-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="batchDeleteEven">批量删除</el-button>
                </el-form-item>
                <el-button-group>
                    <el-button size="mini" icon="el-icon-check" @click="dismissalApprovalOperation">审核</el-button>
                    <el-button size="mini" icon="el-icon-close" @click="unDismissalApprovalOperation">反审核</el-button>
                    <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button> 
                </el-button-group>
            </el-form>
        </div>
    
        <div class="retirement-notification">
            <qqt-table :data="retirementNotificationData" :option="tableOption" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" @selectionChange="selectChange" @page="handlePaginationChange" ref="table"></qqt-table>
        </div>
    </d2-container>
</template>


<script>
import { pageSearchDismissalApplication, deleteDismissalApplicationID, batchDeleteDismissalApplication, dismissalApprovalOperation } from '../../../../api/personnelManagement/dismissalOperation'
import util from '@/libs/util.js'
import { qqtTable, qqtSelect } from '../../../../components/qqt-subassembly'
export default {
    data () {
        return {
            form: {
                keywords:'',
                status:'',
                procState: ''
            },
            procStateOptions: [
                {
                    id: '1',
                    name: '初始化'
                },
                {
                    id: '2',
                    name: '待审批'
                },
                {
                    id: '3',
                    name: '审批中'
                },
                {
                    id: '4',
                    name: '已驳回'
                },
                {
                    id: '5',
                    name: '已作废'
                },
                {
                    id: '10',
                    name: '已完结'
                },
                {
                    id: '6',
                    name: '待提交'
                }
            ],
            procStateDefaultProp: {
                value: 'id',
                label: 'name'
            },
            transform: {
                isShowDetails: false
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
            retirementNotificationData: { },
            isAdd:false,
            tableOption: {
                border: true
            },
            dynamicHeader: {
                tableId: 'T_1017224042',
                isSave: false
            },
            page: {
                current: 1,
                size: 10,
                total: 0
            },
            rowHeader: [
                {
                    prop: 'dismissCode',
                    label: '辞退编号',
                    isShow:true,
                    width:'180',
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
                                        path: 'addRetirementNotification',
                                        name: 'addRetirementNotification',
                                        params: {
                                            procInstId: params.row.procInstId,
                                            transform: this.transform,
                                            relevancyId: params.row.id
                                        }
                                    })
                                }
                            }
                        }, params.row.dismissCode)
                    }
                },
                {
                    prop: 'dismissName',
                    label: '员工姓名',
                    isShow: true,
                    width:'110',
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
                                        path: 'addRetirementNotification',
                                        name: 'addRetirementNotification',
                                        params: {
                                            procInstId: params.row.procInstId,
                                            transform: this.transform,
                                            relevancyId: params.row.id
                                        }
                                    })
                                }
                            }
                        }, params.row.dismissName)
                    }
                     
                },
                {
                    prop: 'companyName',
                    label: '工作单位',
                    isShow:true,
                    width:'200',
                },
                {
                    prop: 'department',
                    label: '工作部门',
                    isShow:true,
                    width:'200',
                },
                {
                    prop: 'dismissTime',
                    label: '辞退时间',
                    isShow:true,
                    width:'180',
                    sortable: true
                },
                {
                    prop: 'dismissReason',
                    label: '辞退原因',
                    isShow:true,
                    width:'200',
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
                    isShow:true,
                    width:'110',
                },
                {
                    prop: "",
                    label: "操作",
                    isShow: true,
                    fixed: 'right',
                    width:110,
                    render:(h, params) => {
                        return [
                             this.$has ('Dismiss:list:edit') ? h("el-button",{
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
                                        this.transform.isShowDetails = false
                                        this.$router.push({
                                            path: 'addRetirementNotification',
                                            name: 'addRetirementNotification',
                                            params: {
                                                transform: this.transform,
                                                relevancyId: params.row.id
                                            }
                                        })
                                    }
                                }
                            },"编辑") : '',
                            this.$has ('Dismiss:list:delete') ? h("el-button",{
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
                                     this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                                            confirmButtonText: '确定',
                                            cancelButtonText: '取消',
                                            type: 'warning'
                                        }).then(() => {
                                            deleteDismissalApplicationID({
                                                id: params.row.id
                                            }).then( res => {
                                                this.$message.success('删除成功')
                                                this.getEntryRegistrationList ()
                                            }).catch( err => {
                                                this.$message.error("删除失败")
                                            })
                                        }).catch(() => {
                                            this.$message({
                                                type: 'info',
                                                message: '已取消删除'
                                            });          
                                        });
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
        addRetirementNotificationEven () {
            this.transform.isShowDetails = false
            this.$router.push({
                path: 'addRetirementNotification',
                name: 'addRetirementNotification',
                params: {
                    transform: this.transform
                }
            })
        },
        dataSearch () {
            this.resetPage ()
            this.getEntryRegistrationList ({
                'name': this.form.keywords ? this.form.keywords : null,
                'procState': this.form.procState ? this.form.procState : null,
                'createTime': this.createDate ? this.createDate[0] : null,
                'updateTime':this.createDate ? this.createDate[1] : null
            })
        },

        resetBtn () {
            this.form.keywords = this.form.procState = ''
            this.createDate = []
            this.resetPage ()
            this.getEntryRegistrationList ()
        },

        batchDeleteEven () {
            let ids = ''
            if (this.multipleSelection.length == 0 ) {
               this.$message.warning("请选择至少一条数据")
               return
            }
            this.multipleSelection.forEach ( delData => {
                if (delData.procState != 1) {
                    this.$message.warning('被选中的数据中有已进入流程，禁止删除')
                } else {
                    ids += delData.id + ','
                    util.confirm ().then (boolean => {
                        if (boolean) {
                            batchDeleteDismissalApplication ({ids: ids}).then(res => {
                                if (res.code === 200) {
                                    this.$message.success(res.message)
                                    this.getEntryRegistrationList ()
                                }
                            })
                        }
                    })
                }
            })
        },

        getEntryRegistrationList (item) {
            pageSearchDismissalApplication({
                ...item,
                pageNo: this.page.current,
                pageSize: this.page.size
            }).then( res => {
                this.retirementNotificationData = res
            })
        },

        // 审核
        dismissalApprovalOperation () {
            if ( this.multipleSelection.length === 1) {
                if (this.multipleSelection[0].state === '0') {
                    this.$confirm('您是否要审核该条数据', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        dismissalApprovalOperation({
                            id: this.multipleSelection[0].id,
                            type: '1'
                        }).then(res=> {
                        if (res.success) {
                            this.$message.success(res.message);
                        } else {
                            this.$message.error(res.message);
                        }
                        this.getEntryRegistrationList ();
                        })
                    })
                } else {
                    this.$message.error('该数据已审核不支持继续审核');
                } 
            } else if (this.multipleSelection.length === 0) {
                this.$message.error('请选择要审核的数据');
            } else {
                this.$message.error('只支持单条数据操作');
            }
        },

        // 反审核
        unDismissalApprovalOperation () {
            if (this.multipleSelection.length === 1) {
                if (this.multipleSelection[0].state === '1') {
                    this.$confirm('您是否要反审核该条数据', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        dismissalApprovalOperation({
                            id: this.multipleSelection[0].id,
                            type: '0'
                        }).then(res=> {
                            if (res.success) {
                                this.$message.success(res.message);
                            } else {
                                this.$message.error(res.message);
                            }
                                this.getEntryRegistrationList();
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
        },

        // 复选框选中的数据
        selectChange (val) {
            this.multipleSelection = val 
        },

        // 分页变化改动
        handlePaginationChange(val) {
            this.page = val;
            this.$nextTick(() => {
                this.getEntryRegistrationList()
            });
        },

        resetPage () {
            this.page = {
                current: 1,
                size: 10,
                total: 0
            }
        }
    },
    mounted() {
        this.getEntryRegistrationList()
    },
    components: {
        'qqt-table': qqtTable,
        'qqtSelect': qqtSelect
    },
}
</script>

<style lang="scss" scoped>
    .retirement-notification-header{
        margin-bottom: -20px;
    }
    .retirement-notification{
        box-shadow: 0 2px 12px 0 $color-border-shadow;
        background: $color-bg3;
        height: 102%;
        margin-top: -15px
    }
</style>