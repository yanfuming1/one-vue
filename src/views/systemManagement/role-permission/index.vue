<template>
    <d2-container class="role-permission">
        <div class="qqt-middle-con role-con" style="">
            <div class="qqt-middle-con-left" style="">
                <qqt-tree
                    :title="title"
                    :rolePage="rolePage"
                    :data="treeData"
                    :isShowAdd="isShowAdd"
                    :btnTitle="btnTitle"
                    :isShowHeader="isShowHeader"
                    :defaultProps="defaultProps"
                    @showRolePermission="showRolePermission"
                    @delete='deleteRole'
                    @editRole="editRoleInfo"
                    @historicalData="historicalData"
                    @appendRole="appendRole"
                    @appendGroup="appendGroup"/>
            </div>
            <div class="qqt-middle-con-right" style="">
                <!-- <p class="qqt-middle-con-right-title" v-if=" roleName !== ''" style="margin-top: 10px">
                    <b>角色名称：</b> 
                    <b style="color: #8C40E2">{{roleName}}</b>
                    <el-button type="text" @click="showRolePermission">【查看角色权限】</el-button>
                </p> -->
                <p class="qqt-middle-con-right-title">该角色人员列表</p>
                <qqt-table :data="tableData" :rowHeader="rowHeader" :option="tableOption" :dynamicHeader="dynamicHeader" @page="pageChange" @selectionChange="selectChange"/>
            </div>
        </div>
        <el-drawer
            :title="drawerTitle"
            :visible.sync="drawer"
            direction="rtl"
            size="45%"
            :before-close="handleClose">
            <role-create
                ref="drawer"
                :typeOption="treeData"
                :add="addRole"
                :isDetail="isDetail"
                :data="roleInfo"
                :detailLimits="detailLimits"
                @closeDrawer="closeDrawer"></role-create>
        </el-drawer>
        <el-dialog
                v-dialogDrag
                :title="groupTitle"
                :visible.sync="createGroup"
                width="35%"
                :before-close="handleClose">
            <role-group-create ref="roleGroupCreate" :data="groupInfo"></role-group-create>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="closeDialog">确 定</el-button>
                <el-button size="small" @click="cancelDialog">取 消</el-button>
            </span>
        </el-dialog>
        <role-edit v-if="showEdit" :roleEdit="editUser" :userTile="userTitle" :info="userInfo" @closeEdit="closeEdit"></role-edit>
    </d2-container>
</template>

<script>
    import QqtTree from "../../../components/qqt-subassembly/qqt-tree/qqt-tree";
    import QqtTable from "../../../components/qqt-subassembly/qqt-table/qqt-table";
    import RoleCreate from "./components/role-create";
    import RoleGroupCreate from "./components/role-group-create";
    import RoleEdit from "./components/role-edit";
    import {GetRoleTree, RoleGroupAdd, RoleGroupDel, RoleDel, GetRolePromission, queryTreePermission,
            GetLimitsTree, RoleGroupEdit, DelUserInRole, GetUserInRolePage, queryTreeRoleNew} from "../../../api/system/role/role"
    import RoleSearch from "./components/role-search";
    import util from '@/libs/util'
    let that = this
    export default {
        name: "index",
        components: {
            RoleSearch, RoleEdit, RoleGroupCreate, RoleCreate, QqtTable, QqtTree,
            PageFooter: () => import('@/layout/header-aside/components/footer'),
        },
        data: function () {
            return {
                rolePage: true,
                drawerTitle: '新建角色',
                groupTitle: '新建角色分组',
                detailLimits: [],
                drawer: false,
                createGroup: false,
                editGroup: false,
                editUser: false,
                isShowAdd: false,
                showEdit: false,
                roleId: '',
                roleName: '',
                btnTitle: null,
                isDetail: false,
                isShowHeader: false,
                dynamicHeader: {
                    // tableId: 'T_1572576783',
                    // isSave: true
                },
                groupInfo: {},
                value: '',
                title: '角色权限设置',
                rightTitle: '新建组织机构',
                defaultProps: {
                    children: 'roleList',
                    label: 'name'
                },
                userInfo: {},
                roleInfo: {},
                addRole: true,
                treeData: [],
                tableData: {
                    records: [],
                    current: 1,
                    pages: 1,
                    size: 0,
                    total: 0
                },
                rowHeader: [
                    {
                        prop: 'name',
                        label: '姓名',
                        isShow: true,
                    },{
                        prop: 'phone',
                        label: '手机号',
                        isShow: true,
                        render: (h, params) => {
                            return h('div', {
                                style: {
                                    whitespace: 'nowrap',
                                    wordBreak: 'keep-all',
                                    textOverflow: 'ellipsis'
                                },
                            }, params.row.phone)
                        }
                    },{
                        prop: 'companyId',
                        label: '工作单位',
                        isShow: true,
                        render: (h, params) => {
                            return h('div', { }, params.row.companyId)
                        }
                    },
                    {
                        prop: 'createdBy',
                        label: '所在部门',
                        isShow: true,
                        render: (h, params) => {
                            return h('div', { }, params.row.createdBy)
                        }
                    },{
                        prop: 'posiId',
                        label: '职务/岗位',
                        isShow: true,
                    },{
                        prop: 'updatedBy',
                        label: '拥有角色',
                        isShow: true,
                        render: (h, params) => {
                            return h('div', {}, params.row.updatedBy)
                        }
                    },{
                        prop: 'createdTime',
                        label: '创建时间',
                        isShow: true,
                        render: (h, params) => {
                            return h('div', {
                                style: {
                                    whitespace: 'nowrap',
                                    wordBreak: 'keep-all',
                                    textOverflow: 'ellipsis'
                                },
                            }, params.row.createdTime)
                       }
                    },{
                        prop: '',
                        label: '操作',
                        isShow: true,
                        render: function (createElement, params) {
                            return createElement('div',
                                [
                                    createElement('el-button', {
                                        attrs: { type: 'text', },
                                        on: {
                                            click: () => {
                                                util.confirm ().then (boolean => {
                                                    if (boolean) {
                                                        DelUserInRole({ roleId: that.roleId, userId: params.row.id }).then(res => {
                                                            that.$message.success("删除成功")
                                                            that.getTableData( )
                                                        })
                                                    }
                                                })
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
                    height: 580,
                },
                loading: false,
                pageOption: {
                    pageNo: 1,
                    pageSize: 10,
                    roleId: ''
                },
                userTitle: '添加员工信息'
            }
        },
        methods: {
            getTreeData () {
                GetRoleTree().then(res => {
                    that.treeData = res
                })
            },
            historicalData (data) {
                this.roleId = data.id.indexOf("R") === -1 ? this.roleId : data.id;
                this.roleName = data.name;
                this.roleInfo = data
                this.pageOption.pageNo = 1
                this.pageOption.pageSize = 10
                this.getTableData()
                // this.getTreeLimits()
            },
            selectChange (val) {
                // console.log(val)
            },
            handleClose(done) {
                done()
            },
            closeDrawer () {
                this.drawer = false
                this.getTreeData()
            },
            cancelDialog() {
                this.createGroup = false
                this.getTreeData()
            },
            closeDialog () {
                let form = this.$refs.roleGroupCreate.getForm()
                if(this.editGroup){
                    RoleGroupEdit(form).then(res => {
                        this.$message.success("编辑分组成功!")
                        this.getTreeData()
                        this.createGroup = false
                    })
                }else{
                    RoleGroupAdd(form).then(res => {
                        that.$message.success("添加分组成功!")
                        that.createGroup = false
                        this.getTreeData()
                    })
                }
                this.getTreeData()
            },
            appendGroup (val) {
                this.groupInfo = {}
                this.groupTitle = '新建分组'
                this.createGroup = true
                this.editGroup = false
            },
            appendRole (val) {
                this.drawer = true
                this.addRole = true
                this.isDetail = false
                this.roleInfo = {}
                this.drawerTitle = '新增角色'
            },
            getTreeLimits () {
                queryTreePermission({roleId: this.roleId}).then(res => {
                    this.detailLimits = res
                })
            },
            editRoleInfo (node, data) {
                if(data.id.indexOf('R') === -1){
                    this.groupTitle = '编辑分组'
                    this.createGroup = true
                    this.groupInfo = data
                    this.editGroup = true
                    this.isDetail = false
                }else{
                    this.drawer = true
                    this.drawerTitle = '编辑角色'
                    this.addRole = false
                    this.isDetail = false
                    GetRolePromission({roleId : data.id}).then(res => {
                        this.detailLimits = res
                        let limits = ''
                        if(res.length > 0){
                            res.forEach(item => {
                                limits += item.id + ','
                            })
                        }
                        data.updatedBy = limits
                        this.roleInfo = data
                    })
                }
            },
            deleteRole (data) {
                if(data.id.indexOf('R') === -1){
                    RoleGroupDel(
                        {id: data.id}
                    ).then(res => {
                        if(res.code === 205){
                            this.$message.warning('分组已经使用, 不能删除')
                        }else{
                            this.$message.success('删除分组成功')
                            this.getTreeData()
                        }
                    })
                } else {
                    RoleDel({id: data.id}).then(res => {
                        if(res.code === 205){
                            this.$message.warning('角色已经使用, 不能删除')
                        }else{
                            this.$message.success('删除角色成功')
                            this.getTreeData()
                        }
                    })
                }
                this.getTreeData()
            },
            getTableData () {
                this.pageOption.roleId = this.roleId;
                if(this.roleId !== ""){
                    GetUserInRolePage(this.pageOption).then(res => {
                        this.tableData = res
                    })
                }
            },
            handlePaginationChange () {
                // console.log(this.page)
            },
            addUser () {
                this.userTitle = '添加员工信息'
                this.showEdit = true
                this.editUser = true
            },
            closeEdit () {
                this.showEdit = false
            },
            pageChange (data) {
                this.pageOption.pageNo = data.current
                this.pageOption.pageSize = data.size
                this.getTableData()
            },
            showRolePermission(data) {
                // if(this.roleId !== ""){
                    this.isDetail = true
                    this.drawer = true
                    this.addRole = false
                    this.drawerTitle = '角色详情'
                    queryTreePermission({roleId : data.id}).then(res => {
                        this.detailLimits = res
                        let limits = ''
                        if(res.length > 0){
                            res.forEach(item => {
                                limits += item.id + ','
                            })
                        }
                        data.updatedBy = limits
                        this.roleInfo = data
                    })
                // } else {
                //     this.$message.warning("请先选择角色!!!")
                // }
            }
        },
        mounted() {
            that = this
            this.getTreeData()
            util.setCommonData(this)
        },
    }
</script>

<style lang="scss" scoped>
.role-permission {
    .role-con{
        height: 100% !important;
        margin-top: 0px !important;
    }
    .organize-con {
        .qqt-tree .qqt-tree-option[data-v-2776414d]{
            margin-left: 0px;
        }
        .el-card__body {
            padding: 0px;
        }
    }
    .el-dialog__header{
        padding: 20px 10px 10px 20px;
        background-color: #F4F4F4;
        span{
            color: #0e90fe;
        }
    }
    .qqt-middle-con{
        display: flex;
        height: calc(100% - 63px);
        margin-top: 20px;
        .qqt-middle-con-left{
            width: 20%;
            margin-right: 1%;
            height: 100%;
            background: #FFF;
        }
        .qqt-middle-con-right{
            width: 79%;
            height: 100%;
            background: #FFF;
            .qqt-middle-con-right-table{
                height: calc(100% - 45px);
                >div{
                    height: 100%;
                    overflow-y: scroll;
                }
            }
        }
    }
}
</style>
