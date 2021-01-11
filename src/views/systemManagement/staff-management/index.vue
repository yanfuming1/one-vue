<template>
    <d2-container >
        <!-- 搜索  -->
        <staff-search @submit="searchUser" @uploadFun="uploadFun" @generate="generateAccount"/>
        <div class="qqt-middle-con" style="">
            <div class="qqt-middle-con-left" style="">
                <qqt-tree
                    :title="title"
                    :isShowAdd="isShowAdd"
                    :isShowDel="isShowDel"
                    :isShowUpdate="isShowUpdate"
                    @addNew="addNew"
                    :newAdd="addUser"
                    :btnTitle="btnTitle"
                    :rolePage="rolePage"
                    :data="treeData"
                    :defaultProps="defaultProps"
                    @historicalData="historicalData" />
            </div>
            <div class="qqt-middle-con-right" style="">
                <p class="qqt-middle-con-right-title">员工列表</p>
                <qqt-table
                    ref="table"
                    :data="tableData"
                    :rowHeader="rowHeader"
                    :option="tableOption"
                    :exportData="exportData" 
                    :dynamicHeader="dynamicHeader"
                    @page="pageChange"
                    @selectionChange="selectChange"/>
            </div>
        </div>
        <staff-option
            ref="staffOption"
            v-if="showInfo"
            :userInfo="userInfo"
            :edit="isEdit"
            :isAdd="isAdd"
            :roleList='roleList'
            :departList='departList'
            :title="dialogTile"
            @close="closeOptions"
            @getTableData="getTableData"/>

    </d2-container>
</template>
<script>
import QqtTree from "../../../components/qqt-subassembly/qqt-tree/qqt-tree";
import QqtTable from "../../../components/qqt-subassembly/qqt-table/qqt-table";
import { staffQueryById,GetStaffByGroupTree,staffGenerateAccount, staffListByDep, staffList, staffQueryPage } from '../../../api/system/staff/staff'
import { GetDepartTreeByLoginer } from '../../../api/system/depart/depart-tree'
import StaffOption from "./components/staff-option";
import StaffSearch from "./components/staff-search";
import { GetAllRoleList, queryTreeRoleNew } from "../../../api/system/role/role"
import { GetDepartTreeNew } from '../../../api/system/depart/depart-tree'
import D2ContainerCard from "../../../components/d2-container/components/d2-container-card";
import util from "../../../libs/util";
let that = this
export default {
    name: "index",
    components: {
        D2ContainerCard,
        StaffSearch,
        StaffOption, QqtTable, QqtTree,
        PageFooter: () => import('@/layout/header-aside/components/footer'),
    },
    data () {
        return {
            showInfo: false,
            isEdit: false,
            isShowAdd: true,
            isShowUpdate: true,
            isShowDel: false,
            isAdd: false,
            addUser: true,
            btnTitle: null,
            parentId: '0',
            depId: '',
            // 判断是否是搜索分页
            searchPage: false,
            // 工作单位
            organization: '',
            // 树的配置
            treeOption: [],
            dialogTile:'',
            title: '组织机构名称及层级',
            rolePage: false,
            treeData: [],
            tableData: {
                records: [],
                current: 1,
                pages: 1,
                size: 10,
                total: 0
            },
            userInfo: {},
            rowHeader: [
                {
                    prop: 'name',
                    label: '员工姓名',
                    isShow: true,
                    render: (h, params) => {
                        return h('span', {
                            props: {},
                            on:{
                                click: () => {
                                    staffQueryById({id: params.row.id}).then(res => {
                                        that.dialogTile = '员工详情'
                                        that.userInfo = res
                                        that.isEdit = false
                                        that.isAdd = false
                                        that.showInfo = true
                                    })
                                }
                            },
                            style: { color: '#3ba5ff', cursor: 'pointer', },
                        }, params.row.name)
                    }
                },{
                    prop: 'jobNumber',
                    label: '员工工号',
                    isShow: true,
                    render: (h, params) => {
                        return h('div', {
                            // 添加参数
                            style: { whitespace: 'nowrap', wordBreak: 'keep-all', textOverflow: 'ellipsis' },
                            props: { },
                        }, params.row.jobNumber)
                    }
                },{
                    prop: 'updatedBy',
                    label: '拥有角色',
                    isShow: true,
                    render: (h, params) => {
                        return h('div', {}, params.row.updatedBy)
                    }
                },{
                    prop: 'companyId',
                    label: '工作单位',
                    isShow: true,
                    render: (h, params) => {
                        return h('div', {}, params.row.companyId)
                    }
                },{
                    prop: 'createdBy',
                    label: '工作部门',
                    isShow: true,
                    render: (h, params) => {
                        return h('div', {}, params.row.createdBy)
                    }
                },{
                    prop: 'posiId',
                    label: '职务/岗位',
                    isShow: true,
                    render: (h, params) => {
                        return h('div', {}, params.row.posiId)
                    }
                },{
                    prop: 'isJob',
                    label: '在职状态',
                    isShow: true,
                    render: (h, params) => {
                        return h('div', {}, params.row.isJob === '0' ? '离职' : '在职')
                    }
                },
                {
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
                                            staffQueryById({ id: params.row.id }).then(res => {
                                                that.dialogTile = '修改员工信息'
                                                that.userInfo = res
                                                that.isEdit = true
                                                that.isAdd = false
                                                that.showInfo = true
                                            })
                                        }
                                    }
                                }, that.$has('sys:staff:edit') ? '编辑' : ''),
                            ]
                        )
                    }
                }
            ],
            tableOption: {
                border: false,
            },
            defaultProps: {
                children: 'child',
                label: 'name'
            },
            dynamicHeader: {
                // tableId: 'T_1088748641',
                // isSave: true
            },
            pageInfo: {
                depId : '',
                pageNo: 1,
                pageSize: 10,
                keywords:'',
                isJob: ''
            },
            generateArr: [],
            roleList:[],
            departList: [],
            exportData: [],
        }
    },
    created(){
        queryTreeRoleNew().then(res => { this.roleList = res })
        GetDepartTreeNew().then(res => { this.departList.push(res) })
    },
    methods: {
        selectChange (val) {
            this.generateArr = val
        },
        historicalData (data) {
            this.parentId = data.parentId
            this.pageInfo.depId = data.id
            this.getTableData()
        },
        closeOptions(){
            this.showInfo = false
        },
        getTree() {
            GetDepartTreeByLoginer().then(res => {
                this.treeData = res
                this.organization = res[0].name
            })
        },
        addNew (data){
            // let arr = []
            // arr.push(data.id)
            this.dialogTile = '新建员工'
            this.userInfo = {}
            this.userInfo = { }
            this.showInfo = true
            this.isEdit = false
            this.isAdd = true
        },
        searchUser (key) {
            this.pageInfo.isJob = key.isJob
            this.pageInfo.keywords = key.keywords
            this.parentId = '0'

            this.searchTableData()
        },
        pageChange (data) {
            this.pageInfo.pageNo = data.current
            this.pageInfo.pageSize = data.size
            this.getTableData()
        },
        generateAccount () {
            if(this.generateArr.length === 0){
                this.$message.warning('请先选择生成账号的人员')
            } else {
                let temp = ''
                this.generateArr.forEach(item => {
                    temp += item.id + ','
                })
                staffGenerateAccount( {id: temp} ).then(res => {
                    this.$message.success(res.message)
                })
                this.searchTableData()
            }
        },
        getTableData () {
            if(this.parentId === '0'){
                // 说明是查询公司的所有职员
                staffList( this.pageInfo ).then(res => {
                    that.tableData = res
                })
            } else {
                // 根据部门查询
                staffListByDep( this.pageInfo ).then(res => {
                    that.tableData = res
                })
            }
        },
        searchTableData () {
            staffQueryPage( this.pageInfo ).then(res => {
                this.tableData = res
            })
        },
        uploadFun(){
            this.getExportData().then(res => {
                this.$refs.table.getExportExcel()
            })
        },
        getExportData () {
            this.exportData = JSON.parse(JSON.stringify((this.tableData.records))) || [];
            return new Promise((resolve, reject) => {
                this.exportData.forEach((item,index) => {
                    item.isJob = item.isJob === '0' ? '离职' : '在职'
                });
                resolve (true)
            });
        },
    },
    mounted() {
        that = this
        this.isShowAdd = this.$has('sys:staff:add')
        this.isShowUpdate = false
        this.getTree()
        // 设置共用的数据
        util.setCommonData()
    }
}
</script>

<style lang="scss">
.el-pagination{
    padding: 15px 20px;
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
        .qqt-tree .el-ic-hover, .qqt-tree .el-ic-focus{
            display: block;
        }
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
    .qqt-middle-con-right-title{
        line-height: 40px;
        font-size: 16px;
        padding-left: 20px;
    }
}
</style>
