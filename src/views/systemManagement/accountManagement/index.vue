<template>
    <d2-container>
        <!-- Header （搜索 + 按钮） -->
        <div slot="header" class="accountManagementHeader">
            <el-form :inline="true" size="mini" :model="searchModel">
                <el-form-item label prop="name">
                    <el-input prefix-icon="el-icon-search" v-model="searchModel.name" placeholder="请输入需搜索的内容" style="width: 200px;" :clearable="true"/>
                </el-form-item>
                <el-form-item>
                    <el-select placeholder="请选择要搜索的状态" style="width: 160px;" v-model="searchModel.status" clearable value="">
                        <el-option label="启用" value="1"/>
                        <el-option label="禁用" value="0"/>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchInfo">搜索</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="info" @click="restSearch">重置</el-button>
                </el-form-item>
                <el-form-item class="m-l-20">
                    <el-button icon="el-icon-refresh-left" @click="resetPassword">重置密码</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="data-dictionariest-center">
            <div class="data-dictionariest-center___left">
                <qqt-tree
                    :title="title"
                    :data="treeData"
                    :defaultProps="defaultProps"
                    :isShowUpdate='isShowUpdate'
                    :isShowDel='isShowDel'
                    :btnTitle="btnTitle"
                    :isShowAdd="isShowAdd"
                    :newAdd="newAdd"
                    @addNew="treeAdd"
                    @historicalData='historicalData'
                ></qqt-tree>
            </div>
            <div class="data-dictionariest-center___right">
                <div class="data-dictionariest-center___right___top">
                    <qqt-table
                        :data="dataDictionaries"
                        :rowHeader="accountManagementHeader"
                        :option="tableOption"
                        @page="changePage"
                        :dynamicHeader="dynamicHeader"
                        @selectionChange="selectChange"
                    ></qqt-table>
                </div>
            </div>
        </div>

        <el-drawer
            :title="drawerTitle"
            :visible.sync="drawer"
            direction="rtl"
            size="30%"
            :before-close="handleClose">
            <user-info
                :userInfo="userInfo"
                @closeDrawer="closeDrawer"
            />
        </el-drawer>
    </d2-container>
</template>

<script>
    import qqtTree from "../../../components/qqt-subassembly/qqt-tree/qqt-tree";
    import qqtTable from "../../../components/qqt-subassembly/qqt-table/qqt-table";
    import qqtRadio from "../../../components/qqt-subassembly/qqt-radio/qqt-radio";
    import { GetDepartTreeByLoginer } from '../../../api/system/depart/depart-tree';
    import { accountManagementTree, dataPageByDepId, accountResetPassword, accountChangeStatus, accountSearchPage, 
        editAccountManagementData, accountFindPerTreeById } from "../../../api/system/accountManagement/accountManagement";
    import UserInfo from "./components/userInfo";
    import util from "../../../libs/util"; 

    let that = this
    export default {
        data() {
            return {
                editFormVisible: false,
                accountManagementRadio: {},
                accountManagementOptions: [
                    { value: '1', label: '是' },
                    { value: '0', label: '否' },
                ],
                editAccountData: {
                    id: '',
                    name: '',
                    status: '1',
                    rank: '1',
                    remark: ''
                },
                btnTitle: null,
                search: "",
                title: "组织机构名称",
                // 左边树叶
                treeData: [],
                defaultProps: {
                    children: 'child',
                    label: 'name',
                },
                newAdd: true,
                isShowAdd: false,
                editAccountManagementData: {},
                isShowUpdate: false,
                isShowDel: false,
                pageNo: 0,
                loading: false,
                page: {
                    current: 1,
                    size: 10,
                    total: 0
                },
                dynamicHeader: {
                    tableId: 'T_1096291357',
                    isSave: true
                },
                getUserByDep: {
                    departmentId: '',
                    pageNo: '1',
                    pageSize: '10'
                },
                drawerTitle: '账号详情',
                drawer: false,
                accountManagementHeader: [
                    {
                        prop: "username",
                        label: "姓名",
                        isShow: true,
                        render: (h, params) => {
                            return h('p', {
                                style: { color: "#3ba5ff", cursor: 'pointer' },
                                on: {
                                    click: () => {
                                        that.drawer = true
                                        that.userInfo = params.row
                                    }
                                }
                            }, params.row.username);
                        }
                    },
                    {
                        prop: "accountNumber",
                        label: "登录账号",
                        isShow: true
                    },
                    {
                        prop: "untitled",
                        label: "所有角色",
                        isShow: true
                    },
                    {
                        prop: "status",
                        label: "账号状态",
                        isShow: true,
                        render: (h, params) => {
                            return that.$has('sys:user:en_disable') ? h('p', {
                                style: { color: params.row.status === '0' ? "red" : 'blue' , cursor: 'pointer' },
                                on: {
                                    click: () => {
                                        accountChangeStatus({ id: params.row.id, status: params.row.status === '1' ? '0' : '1' }).then(res => {
                                            that.$message.success('设置成功')
                                            that.getTableData(this.getUserByDep)
                                        })
                                    }
                                }
                            }, params.row.status === '0' ? "禁用" : "启用") : '';
                        }
                    },
                ],
                dataDictionaries: {
                    records: [],
                    current: 1,
                    pages: 1,
                    size: 0,
                    total: 0,
                },
                tableOption: {
                    border: false
                },
                resetIds: '',
                userInfo: {},
                searchModel: {
                    name: '',
                    status: '',
                    pageNo: '1',
                    pageSize: '10'
                },
                isSearch: false,
                depId: ''
            };
        },
        components: {
            UserInfo,
            "qqt-tree": qqtTree,
            "qqt-table": qqtTable,
            'qqt-radio': qqtRadio,
            PageFooter: () => import("@/layout/header-aside/components/footer"),
        },
        methods: {
            getTreeData() {
                GetDepartTreeByLoginer().then(res => {
                    that.treeData = res
                })
            },
            historicalData(data) {
                this.getUserByDep.departmentId = data.id
                this.depId = data.id
                this.isSearch = false
                this.getTableData(this.getUserByDep)
            },
            treeAdd(data) {
                this.editFormVisible = true
            },
            handleClose (done) {
                done()
            },
            searchInfo () {
                this.isSearch = true
                this.searchResult(this.searchModel)
            },
            selectChange(val) {
                this.resetIds = ''
                if(val.length > 0){
                    val.forEach(item => {
                        this.resetIds += item.id + ','
                    })
                }
            },
            restSearch() {
                this.searchModel = {
                    name: '',
                    status: '',
                    pageNo: '1',
                    pageSize: '10'
                }
                this.isSearch = false
                this.searchResult(this.searchModel)
            },
            resetPassword () {
                if(this.resetIds === ''){
                    this.$message.warning('请先选择重置密码的人员')
                }else{
                    accountResetPassword( {ids: this.resetIds} ).then(res => {
                        that.$message.success("重置成功,重置密码为123456")
                    })
                }
            },
            changePage (data) {
                if(this.isSearch){
                    this.searchModel.pageNo = data.current
                    this.searchModel.pageSize = data.size
                    this.searchResult(this.searchModel)
                } else {
                    let tem = {
                        departmentId: this.depId,
                        pageNo: data.current,
                        pageSize: data.size
                    }
                    this.getTableData(tem)
                }
            },
            getTableData (tem) {
                dataPageByDepId(tem).then(res => { that.dataDictionaries = res })
            },
            closeDrawer () {
                this.drawer = false
            },
            searchResult (data) {
                accountSearchPage( data ).then(res => { that.dataDictionaries = res })
            }
        },
        mounted() {
            that = this
            this.getTreeData()
            util.setCommonData(this)
        }
    };
</script>
<style scoped lang="scss">
.data-dictionariest-center {
    height: 100%;
    margin-top: -15px;
    .data-dictionariest-center___left {
        background: #ffffff;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        width: 20%;
        height: 95%;
        position: absolute;
        display: inline-block;
    }
    .data-dictionariest-center___right {
        margin-left: 20px;
        width: 78%;
        display: inline-block;
        position: relative;
        float: right;
        height: 100%;
        .data-dictionariest-center___right___top {
            background: #ffffff;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
            height: 100%;
            padding: 20px 0 20px 20px;
        }
    }
}
.accountManagementHeader {
    background: none;
    margin-bottom: -20px;
}
</style>
