<template>
    <d2-container>
        <div slot="header" class="personnel-management-header">
            <el-form :inline="true" :model="form" ref="form" size="mini" @submit.native.prevent>
                <el-form-item label prop="name">
                    <el-input v-model="form.keywords" prefix-icon="el-icon-search" placeholder="请输入需搜索的内容" style="width: 200px;" @keyup.enter.native="dataSearch" />
                </el-form-item>
                <el-form-item label="是否在职" prop="status">
                    <qqt-select :value="form.status" :options="options" :size="'mini'" :placeholder="'请选择要搜索的状态'" @select="form.status = $event, dataSearch ()"></qqt-select>
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
                        @change="getEnrollmentList()" 
                        align="right">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="mini" @click="dataSearch">搜索</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="info" @click="resetBtn">重置</el-button>
                </el-form-item>
                <el-button-group>
                    <el-button size="mini" icon="el-icon-check" @click="entryAudit">审核</el-button>
                    <el-button size="mini" icon="el-icon-close" @click="unEntryAudit">反审核</el-button>
                    <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button> 
                </el-button-group>
            </el-form>
        </div>
    
        <div class="personnel-management-list">
            <qqt-table :data="personnelManagementData" :option="tableOption" :dynamicHeader="dynamicHeader" :rowHeader="rowHeader" @selectionChange="selectChange" @page="handlePaginationChange" ref="table"></qqt-table>
        </div>
    </d2-container>
</template>


<script>
import { qqtSelect } from '@/components/qqt-subassembly'
import { enrollmentListSeach, checkOrAgainstPersonnel } from '../../../../api/personal-information/entryRegistration'
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
            personnelManagementData: { },
            tableOption: {
                border: true
            },
            page: {
                current: 1,
                size: 10,
                total: 0
            },
            options: [
                {
                    value: '0',
                    label: '离职'
                },
                {
                    value: '1',
                    label: '在职'
                }
            ],
            dynamicHeader: {
                tableId: 'T_1034525022',
                isSave: false
            },
            multipleSelection:[],
            rowHeader: [
                {
                    prop: 'name',
                    label: '姓名',
                    isShow:true,
                    width: '120',
                    render: (h, params) => {
                        return h('el-button', {
                            attrs: {
                                type: 'text'
                            },
                            on: {
                                click: (index, row) => {
                                    this.rowData = params.row
                                    this.$router.push({
                                        path: 'entryRegistration',
                                        name: 'entryRegistrations',
                                        params: {
                                            isDetail: true,
                                            rowData: this.rowData
                                        }
                                    })
                                }
                            }
                        }, params.row.name)
                    }
                },
                {
                    prop: 'sexName',
                    label: '性别',
                    isShow:true,
                    width: '80',
                    render: (h, parms) => {
                        return h('div', {},
                            parms.row.sexName = parms.row.sex === '1' ? '男' : '女'
                        )
                    }
                },
                {
                    prop: 'nation',
                    label: '民族',
                    isShow:true,
                    width: '80'
                },
                {
                    prop: 'age',
                    label: '年龄',
                    isShow:true,
                    width: '80'
                },
                {
                    prop: 'maritalStatusName',
                    label: '婚姻状况',
                    isShow:true,
                    width: '100',
                    render: (h, parms) => {
                        return h('div', {},
                            parms.row.maritalStatusName = parms.row.maritalStatus === '1' ? '未婚' : '已婚'
                        )
                    }
                },
                {
                    prop: 'isJobName',
                    label: '是否在职',
                    isShow:true,
                    width: '150',
                    render: (h, parms) => {
                        return h('div', {},
                            parms.row.isJobName = parms.row.isJob === '1' ? '在职' : '离职'
                        )
                    }
                },
                {
                    prop: 'school',
                    label: '毕业学校',
                    isShow:true
                },
                {
                    prop: 'diploma',
                    label: '最高学历',
                    isShow:true
                },
                // {
                //     prop: 'contactNumber',
                //     label: '个人电话',
                //     isShow:true
                // },
                {
                    prop: 'emergencyContact',
                    label: '紧急联系人',
                    isShow:true
                },
                {
                    prop: 'contactNumber',
                    label: '紧急联系人电话',
                    isShow:true
                },
                {
                    prop: 'entryTime',
                    label: '入职时间',
                    isShow:true
                },
                {
                    prop: 'workyear',
                    label: '工龄',
                    isShow:true
                },
                {
                    prop: 'createTime',
                    label: '登记时间',
                    isShow:true
                },
                {
                    prop: 'procStateName',
                    label: '审核状态',
                    isShow:true,
                    render: (h, parms) => {
                        return h('div', {},
                            parms.row.procStateName = parms.row.procState === '1' ? '已审核' : '未审核'
                        )
                    }
                },
            ],
        }
    },
    methods: {
        dataSearch () {
            this.page.current = 1
            this.page.size = 10
            this.getEnrollmentList()
        },

        entryAudit () {
             if ( this.multipleSelection.length === 1) {
                if (this.multipleSelection[0].procState === '0') {
                    this.$confirm('您是否要审核该条数据', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        checkOrAgainstPersonnel({
                            id: this.multipleSelection[0].id,
                            type: '1'
                        }).then(res=> {
                        if (res.success) {
                            this.$message.success(res.message);
                        } else {
                            this.$message.error(res.message);
                        }
                        this.getEnrollmentList ();
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

        unEntryAudit () {
            if (this.multipleSelection.length === 1) {
                if (this.multipleSelection[0].procState === '1') {
                    this.$confirm('您是否要反审核该条数据', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        checkOrAgainstPersonnel({
                            id: this.multipleSelection[0].id,
                            type: '0'
                        }).then(res=> {
                            if (res.success) {
                                this.$message.success(res.message);
                            } else {
                                this.$message.error(res.message);
                            }
                                this.getEnrollmentList();
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

        resetBtn () {
            this.form.keywords = ''
            this.form.status = ''
            this.createDate = []
            this.page.current = 1
            this.page.size = 10
            this.getEnrollmentList ()
        },

        printTable () {
            this.$refs.table.printTable (this.multipleSelection)
        },

        getEnrollmentList () {
            enrollmentListSeach({
                createTime: this.createDate ? this.createDate[0] : null,
                updateTime: this.createDate ? this.createDate[1] : null,
                pageNo: this.page.current,
                pageSize: this.page.size,
                name: this.form.keywords,
                status: this.form.status
            }).then( res => {
                this.personnelManagementData = res
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
                this.getEnrollmentList()
            });
        }
    },
    mounted() {
        this.getEnrollmentList()
    },
    components: {
        qqtTable: () => import('../../../../components/qqt-subassembly/qqt-table/qqt-table'),
        'qqt-select': qqtSelect
    },
}
</script>

<style lang="scss" scoped>
    .personnel-management-header{
        margin-bottom: -20px;
    }
    .personnel-management-list{
        box-shadow: 0 2px 12px 0 $color-border-shadow;
        background: $color-bg3;
        height: 102%;
        margin-top: -15px
    }
</style>