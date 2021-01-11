<template>
    <d2-container>
        <template slot="header">
            <div class="formtHeader">
                <formManagementHeader
                    @dataSearch = "dataSearch"
                    @publishNewsData = "addForm"
                    @deleteAll = "deleteAll"/>
            </div>
        </template>
        <div class="qqt-middle-con" style="height: 100%;">
            <div class="qqt-middle-con-left" style="">
                <qqt-tree
                    :btnTitle="btnTitle"
                    :title="title"
                    :data="treeData"
                    :isShowAdd="isShowAdd"
                    :isShowDel="isShowAdd"
                    :isShowUpdate="isShowAdd"
                    :defaultProps="defaultProps"
                    :defaultObject="defaultObject"
                    @historicalData="historicalData"/>
            </div>
            <div class="qqt-middle-con-right" style="">
                <div class="qt-middle-con--header">
                    <p>表单详情</p>
                </div>
                <qqt-table
                    :data="tableData"
                    :rowHeader="rowHeader"
                    :option="tableOption"
                    :dynamicHeader="dynamicHeader"
                    @page="pageChange"
                    @selectionChange="selectChange"/>
            </div>
        </div>
        <!-- 新建分组的弹出框 -->
        <from-create
            :createForm="createForm"
            :data="formInfo"
            v-if="createForm"
            :treeData="treeData"
            :formTitle="formTitle"
            :choseId="choseId"
            :isDetail="isDetail"
            ref="formCreate"
            @cancel="updataStart"
            @close="closeDialog"
        ></from-create>
    </d2-container>
</template>

<script>
import QqtTree from "../../../components/qqt-subassembly/qqt-tree/qqt-tree";
import QqtTable from "../../../components/qqt-subassembly/qqt-table/qqt-table";
import fromCreate from "./components/form-create";
import formManagementHeader from './components/formManagementHeader'
import RoleEdit from "./components/form-edit";
import { formManagementTree, formManagementAdd, formManagementEdit, deleteAll, formManagementList, delectFormId,} from "../../../api/system/fromManagement"
import util from '../../../libs/util';
let that = this
export default {
    name: "fromManagement",
    components: {
        RoleEdit, fromCreate, QqtTable, QqtTree,
        PageFooter: () => import('@/layout/header-aside/components/footer'),
        'formManagementHeader' : formManagementHeader},
    data: function () {
        return {
            formTitle: '新建表单',
            createForm: false,
            btnTitle: null,
            isShowAdd: false,
            // 分组信息
            formInfo: {},
            value: '',
            title: '表单分类',
            rightTitle: '新建组织机构',
            defaultProps: {
                children: 'formList',
                label: 'name'
            },
            dynamicHeader: {
                tableId: 'T_1572506306',
                isSave: true
            },
            treeData: [],
            tableData: {},
            rowHeader: [
                // 未做任何格式化处理的数据
                {
                    prop: 'name',
                    label: '表单名称',
                    isShow: true,
                    render: (h, params) => {
                        return h('el-button', {
                            attrs: {
                                type: 'text',
                            },
                            on: {
                                click : () => {
                                    that.formTitle = '表单详情'
                                    that.createForm = true
                                    that.formInfo = params.row
                                    that.isDetail = true
                                }
                            }
                        }, params.row.name)
                    }
                },
                // 格式化为字符串
                {
                    prop: 'code',
                    label: '表单编号',
                    isShow: true,
                    render: (h, params) => {
                        return h('div', {

                        }, params.row.code)
                    }
                },
                {
                    prop: 'title',
                    label: '表单标题',
                    isShow: true,
                },
                // 插入组件或标签内容（例：进度条组件）
                {
                    prop: 'openType',
                    label: '表单打开方式',
                    isShow: true,
                    render: (h, params) => {
                        if(params.row.openType === '1'){
                            return h('div', '页面')
                        } else if(params.row.openType === '2'){
                            return h('div', '弹窗')
                        } else {
                            return h('div', '抽屉')
                        }
                    }
                },
                {
                    prop: 'createdTime',
                    label: '设计表单',
                    isShow: true,
                    render: (h, params) => {
                        return h('el-button', {
                            on :{
                                click: () =>  {
                                    this.$router.push({
                                        path: 'designForm',
                                        name: 'designForm',
                                        params: {
                                            formRowId: params.row.id, // 行id
                                            formJson: params.row.json  // 表单json
                                        }
                                    })
                                }

                            },
                            attrs:{
                                type:'primary',
                                size: 'mini',
                            }
                        }, '设计表单')
                    }
                },
                // 添加操作按钮
                {
                    prop: '',
                    label: '操作',
                    isShow: true,
                    render: function (createElement, params) {
                        return createElement('div',
                            [
                                createElement('el-button', {
                                    attrs: {
                                        type: 'text',
                                    },
                                    style:{
                                        size:"mini"
                                    },
                                    on: {
                                        click: () => {
                                            that.formTitle = '编辑表单'
                                            that.createForm = true
                                            that.formInfo = params.row
                                            that.isDetail = false
                                        }
                                    }
                                }, '编辑'),
                                createElement('el-button', {
                                    attrs: {
                                        type: 'text',
                                    },
                                    on: {
                                        click: () => {
                                            that.$confirm('此操作将永久删除该员工账户, 是否继续?', '提示', {
                                                confirmButtonText: '确定',
                                                cancelButtonText: '取消',
                                                cancelButtonClass: "btn-custom-cancel",
                                                type: 'warning'
                                            }).then(res => {
                                                delectFormId({
                                                    id : params.row.id
                                                }).then(res => {
                                                    that.getTreeData()
                                                    that.$message.success('删除成功!')
                                                })
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
                height: 600
            },
            // 分页
            loading: false,
            pageOption: {
                pageNo: 1,
                pageSize: 10,
                name: ''
            },
            defaultObject: {},
            choseId: '',
            isDetail: false,
            selectForm:[]
        }
    },
    methods: {
        updataStart () {
            this.createForm = false
        },
        // 点击数据
        historicalData (data) {
            this.getTableData (data)
            this.choseId = data.id
        },
        getTableData (data, text) {
            this.pageOption.id = data.id;
            formManagementList ({
                id: data.id,
                ...text,
                'pageNo': this.pageOption.pageNo,
                'pageSize': this.pageOption.pageSize
            }).then(res => {
                that.tableData = res
            })
        },
        getTreeData () {
            formManagementTree().then(res => {
                this.treeData = res
                this.choseId = res[0].id
                this.getTableData (res[0])
            })
        },
        closeDialog (data) {
            this.createForm = false
            if ( this.formTitle === "新建表单") {
                // 添加
                formManagementAdd(
                    data
                ).then(res => {
                    let item = {
                        id: this.choseId
                    }
                    that.$message.success("添加表单成功!")
                    that.createForm = false
                    this.getTableData(item)
                })
            } else {
                // 编辑
                formManagementEdit(
                    data
                ).then( res => {
                    let item = {
                        id: this.choseId
                    }
                    that.$message.success("编辑表单成功!")
                    that.createForm = false
                    this.getTableData(item)
                })
            }
        },
        dataSearch (data) {
            this.pageOption.name = data.keywords
            this.searchInfo()
        },
        addForm () {
            this.formTitle = '新建表单'
            this.createForm = true
            this.isDetail = false
            this.formInfo = {}
        },
        deleteAll () {
            // deleteAll
            if(this.selectForm.length === 0){
                this.$message.warning("未选择要删除的表单!!!")
            }else{
                let ids = ''
                this.selectForm.forEach(item => {
                    ids += item.id + ','
                })
                util.confirm().then(res => {
                        deleteAll({
                        ids : ids
                    }).then(res => {
                        this.$message.success("删除成功~~~")
                        let item = {
                            id: this.choseId
                        }
                        this.getTableData(item)
                    })
                })
            }
        },
        // 复选框选中的数据
        selectChange (val) {
            this.selectForm = val
        },
        // 分页
        pageChange (data) {
            this.pageOption.pageNo = data.current;
            this.pageOption.pageSize = data.size;
            let item = {
                id: this.choseId
            }
            this.getTableData(item)
        },
        searchInfo () {
            formManagementList (this.pageOption).then(res => {
                this.tableData = res
            })
        }
    },
    mounted() {
        that = this
        this.getTreeData()
    },
}
</script>

<style lang="scss" scoped> 
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
.formtHeader{
    margin-bottom: -15px;
}
.qqt-middle-con{
    display: flex;
    height: calc(100% - 63px);
    margin-top: -15px;
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
        .qt-middle-con--header {
            height: 45px;
            line-height: 45px;
            p {
                display: inline-block;
                padding-left: 15px;
                font-size: 16px;
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
