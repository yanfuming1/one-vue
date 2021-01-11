<template>
        <d2-container>
        <div slot="header" class="project-role-header">
            <el-form :inline="true" :model="form" ref="form" size="mini">
                <el-form-item>
                    <el-button type="primary" @click="addProjectRoleEvent" v-if="$has ('sys:projectRole:add')">添加</el-button>
                </el-form-item>
                <el-form-item label>
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
            </el-form>
        </div>
    
        <div class="project-role-table">
            <qqt-table :data="projectRoleData" :option="tableOption" :dynamicHeader="dynamicHeader" :rowHeader="rowHeader" @selectionChange="selectChange" @page="handlePaginationChange"></qqt-table>
        </div>
        <template>
            <el-dialog :visible="dialogVisible" :title="title" width="35%" :before-close="handleClose">
                <fm-generate-form 
                    v-if="dialogVisible"
                    :data="jsonData"
                    :remote="remote"
                    :value="values"
                    :transform="transform"
                    ref="generateForm"/>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" v-if="!transform.isShowDetails" @click="saveProjectRole">确 定</el-button>
                    <el-button @click="dialogVisible = false">取 消</el-button>
                </span>
            </el-dialog>
        </template>
    </d2-container>
</template>

<script>
import { projectRolePageSearch, addProjectRole, editProjectRole, projectRoleById, delProjectRole } from '../../../../api/projectRoleSettings'
import { formGetJson } from '../../../../api/system/fromManagement/index'
import { SYSTEMMANAGEMENT } from '../../../../enum/FORMCODE'
import util from '@/libs/util.js'
export default {
    data() {
        return {
            form: {
                keywords:''
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

            tableOption: {
                border: false
            },
            page: {
                current: 1,
                size: 10,
                total: 0
            },
            title:'',

            values: {},

            jsonData: {},

            remote: {},

            dialogVisible: false,

            addProjectRole: false,

            editProjectRole: false,

            transform: {
                isShowDetails: false
            },

            dynamicHeader: {
                tableId: 'T_1020820779',
                isSave: false
            },
            projectRoleData: {},
            rowHeader: [
                {
                    prop: 'name',
                    label: '名称',
                    isShow:true,
                    render:(h, params) => {
                        return [
                            h("el-button",{
                                props: {
                                    type: "text"
                                },
                                on: {
                                    click: (index, row) => {
                                        this.getProjectRoleById (params.row.id)
                                        this.transform.isShowDetails = true
                                    }
                                }
                            },params.row.name)
                        ];
                    },
                    
                },
                {
                    prop: 'createName',
                    label: '创建人',
                    isShow:true
                },
                {
                    prop: 'createTime',
                    label: '创建时间',
                    isShow:true
                },
                {
                    prop: 'description',
                    label: '备注',
                    isShow:true
                },
                {
                    prop: "",
                    label: "操作",
                    isShow: true,
                    render:(h, params) => {
                        return [
                            h("el-button",{
                                props: {
                                    type: "text"
                                },
                                on: {
                                    click: (index, row) => {
                                        this.getProjectRoleById (params.row.id)
                                        this.editProjectRole = true
                                        this.title = '编辑项目角色'
                                        this.transform.isShowDetails = false
                                    }
                                }
                            },this.$has ('sys:projectRole:edit') ? '编辑' : ''),
                            h("el-button",{
                                props: {
                                    type: "text"
                                },
                                on: {
                                    click: () => {
                                        util.confirm ().then (res => {
                                            if (res) {
                                                delProjectRole({
                                                    id: params.row.id
                                                }).then( res => {
                                                    this.$message.success("删除成功")
                                                    this.getProjectRolesList ()
                                                }).catch( err => {
                                                    this.$message.err("删除失败")
                                                })
                                            }
                                        })
                                    }
                                }
                            },this.$has ('sys:projectRole:delete') ? '删除' : ''),
                        ];
                    },
                },
            ],
        }
    },
    methods: {
        
        getFormByJson () {
            formGetJson ({'code': SYSTEMMANAGEMENT.PROJECTROLE}).then(res => {
                if (res) {
                    this.jsonData = JSON.parse(res)
                }
            })
        },

        getProjectRolesList (item) {
            projectRolePageSearch({
                ...item,
                pageNo: this.page.current,
                pageSize: this.page.size
            }).then ( res => {
                this.projectRoleData = res
            })
        },

        addProjectRoleEvent () {
            this.values = {}
            this.title = '添加项目角色'
            this.dialogVisible = true
            this.addProjectRole = true
            this.transform.isShowDetails = false
        },

        getProjectRoleById (id) {
            projectRoleById({ 'id': id }).then( res => {
                this.values = res
                this.dialogVisible = true
            })
        },

        dataSearch () {
            this.getProjectRolesList ({
                'keywords': this.form.keywords ? this.form.keywords : null,
                'afterDate': this.createDate ? this.createDate[0] : null,
                'beforeDate':this.createDate ? this.createDate[1] : null
            })
        },
        
        resetBtn () {
            this.form.keywords = '',
            this.createDate = []
            this.getProjectRolesList ()
        },

         // 复选框选中的数据
        selectChange (val) {
            this.multipleSelection = val
        },

        saveProjectRole () {
            this.$refs.generateForm.getData ().then (item => {
                if(this.addProjectRole) {
                    addProjectRole(item).then( res => {
                        this.$message.success('添加成功')
                        this.handleClose ()
                        this.getProjectRolesList () 
                    }).catch( err => {
                        this.$message.err('添加失败')
                    })
                } else if (this.editProjectRole) {
                    console.log(this.values)
                    item.id = this.values.id
                    editProjectRole(item).then( res => {
                        this.$message.success('编辑成功')
                        this.handleClose ()
                        this.getProjectRolesList () 
                    }).catch( err => {
                        this.$message.err('编辑失败')
                    })
                }
            })
        },

        handleClose () {
            this.dialogVisible = false
        },

        // 分页变化改动
        handlePaginationChange(val) {
            this.page = val;
            this.$nextTick(() => {
                this.getProjectRolesList()
            });
        }
    },

    components: {
        qqtTable: () => import('../../../../components/qqt-subassembly/qqt-table/qqt-table')
    },

    created () {
        this.getProjectRolesList () 
        this.getFormByJson ()
    }
}
</script>

<style lang="scss" scoped>
    .project-role-header{
        margin-bottom: -20px;
    }
    .project-role-table{
        box-shadow: 0 2px 12px 0 $color-border-shadow;
        background: $color-bg3;
        height: 102%;
        margin-top: -15px
    }
</style>