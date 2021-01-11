<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header___search">
                    <el-input
                        placeholder="请输入内容"
                        prefix-icon="el-icon-search"
                        v-model="filterText" size="mini">
                    </el-input>
                    <el-button type="primary" class="qqt-container-full-header-top___button">搜索</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button-group >
                        <el-button size="mini" icon="el-icon-plus" @click="expandAll">展开</el-button>
                        <el-button size="mini" icon="el-icon-minus" @click="closeAll">收起</el-button>
                    </el-button-group>
                </span>
            </div>
        </template>
        <div class="qqt-container-full-center___left">
            <qqt-tree
                :title="title"
                :data="data"
                :filterText="filterText"
                :isShowHeader="false"
                :isShowUpdate="auth.edit"
                :isShowAdd="auth.add"
                :isShowDel="auth.del"
                :isBtnTitle="auth.add"
                :btnTitle="btnTitle"
                :defaultObject="defaultObject"
                :defaultExpandAll="defaultExpandAll"
                :defaultCheckedKeys="defaultCheckedKeys"
                :defaultProps="defaultProps"
                @delete="deleteModuleMenu"
                @edit="editModuleMenu"
                @historicalData="historicalDataObject"></qqt-tree>
        </div>
        <div class="qqt-container-full-center___right">
            <module-menu-details :data="historicalData" ref="moduleMenuDetails" :options="data" :defaultParams="defaultParams" @menu="getModuleMenuTreeList" @deletcNewNode="deletcNewNode"></module-menu-details>
        </div>
    </d2-container>
</template>

<script>
    import { qqtTree } from '../../../../components/qqt-subassembly'
    import moduleMenuDetails from './moduleMenuDetails'
    import { getModuleMenuTree, deleteModuleMenuTree } from '../../../../api/system/moduleMenu'
    export default {
        name: 'moduleMenu',
        data () {
            return {
                filterText: '',
                title: '模块菜单管理',
                btnTitle: {
                    name: '新建顶部菜单',
                    icon: 'el-icon-folder-add'
                },
                data: [],
                auth: {
                    add: false,
                    edit: false,
                    del: false
                },
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                defaultParams: {
                    label: 'name',
                    value: 'id',
                    children: 'children',
                    checkStrictly: true
                },
                defaultObject: {
                    connectionType: '1',
                    css: '',
                    href: '',
                    isNavigation: '0',
                    name: '新建节点',
                    alias: '',
                    openMode: '1',
                    parameter: '',
                    isEditor: true,
                    parentId: '',
                    sort: 0,
                    type: '1',
                    webApp: '0',
                    superiorName: '',
                    superiorId: [],
                    children: []
                },
                historicalData: null,
                defaultCheckedKeys: [],
                defaultExpandAll: {
                    isExpandAll: false
                },
                i: 0
            }
        },
        methods: {

            historicalDataObject (item) {
                this.historicalData = item
            },

            getModuleMenuTreeList () {
                getModuleMenuTree().then(result => {
                    if (result && result.length > 0) {
                        this.data = result.sort((a, b)=>{
                            return Number (a.sort) - Number (b.sort)
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            },

            deleteModuleMenu (data) {
                deleteModuleMenuTree({'id': data.id}).then(result => {
                    if (result.code === 200) {
                        this.$message.success('删除成功')
                        this.getModuleMenuTreeList ()
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            },

            deletcNewNode () {
                this.getModuleMenuTreeList ()
            },

            editModuleMenu () {
                this.$refs.moduleMenuDetails.updataElement ()
            },

            expandAll () {
                let item = {
                    isExpandAll: true
                }
                this.defaultExpandAll = JSON.parse (JSON.stringify (item))
            },

            closeAll () {
                let item = {
                    isExpandAll: false
                }
                this.defaultExpandAll = JSON.parse (JSON.stringify (item))
            },

            // 验证权限
            _validationAuth () {
                this.auth.add = this.$has ('sys:permission:add')
                this.auth.edit = this.$has('sys:permission:edit')
                this.auth.del = this.$has('sys:permission:del')
            }
        },
        components: {
            'qqt-tree': qqtTree,
            'module-menu-details': moduleMenuDetails
        },
        created () {
            this.getModuleMenuTreeList()
            this._validationAuth ()
        }
    }
</script>

