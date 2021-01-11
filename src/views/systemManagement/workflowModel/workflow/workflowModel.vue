<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header___search">
                    <el-input
                        placeholder="请输入内容"
                        prefix-icon="el-icon-search"
                        @keyup.enter.native="searchModelSynopsis"
                        v-model="filterText" size="mini">
                    </el-input>
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="searchModelSynopsis">搜索</el-button>
                    <el-button type="info" class="qqt-container-full-header-top___button" @click="updateModelSynopsis">重置</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <p>状态</p>
                    <div class="qqt-container-full-header-state___select">
                        <qqt-select :value="status" :options="options" :size="'mini'" :placeholder="'请选择'" @select="selectSearchData"></qqt-select>
                    </div>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button type="primary" class="qqt-container-full-header-top___button" v-if="$has('sys:flowmodel:add')" @click="drawer = !drawer, modelSynopsis = null">添加</el-button>
                    <el-button type="primary" class="qqt-container-full-header-top___button" v-if="$has('sys:flowmodel:del')" @click="removeData">批量删除</el-button>
                </span>
            </div>
        </template>
        <div class="qqt-container-full-center___left">
            <workflow-model-node :options="data" :btnTitle="btnTitle" :title="title" @getNodeData="updateMetaData" @updateMetaData="updataTreeMetaData"></workflow-model-node>
        </div>
        <div class="qqt-container-full-center___right">
            <qqt-table :data="tableData" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange"></qqt-table>
        </div>
        <div>
            <workflow-model-drawer :drawer="drawer" v-if="drawer" :data="historicalData" :isShowElement="isShowElement" :modelSynopsis="modelSynopsis" :options="data"  @drawerClose="drawerClose" @updateModelSynopsis="updateModelSynopsis"></workflow-model-drawer>
        </div>
    </d2-container>
</template>

<script>
import workflowModelNode from './workflowModelNode'
import workflowModelDrawer from './workflowModelDrawer'
import { qqtSelect, qqtTable} from '../../../../components/qqt-subassembly'
import { getWorkflowTree, getModelSynopsisPage, removeModelSynopsis, modelSynopsisIdDeployment, updateModelSynopsisState } from '../../../../api/system/workflow'

import util from '@/libs/util.js'
export default {
    name: 'workflowModel',
    data () {
        return {
            options: [
                {
                    value: '0',
                    label: '禁用'
                },
                {
                    value: '1',
                    label: '启用'
                }
            ],
            btnTitle: {
                name: '新建流程分类',
                icon: 'el-icon-folder-add'
            },
            dynamicHeader: {
                tableId: 'T_1566989710',
                isSave: true
            },
            page: {
                current: 1,
                size: 10,
                total: 0
            },
            rowHeader: [
                // 未做任何格式化处理的数据
                {
                    prop: 'name',
                    label: '流程名称',
                    isShow: true,
                    render: (h, parms) => {
                        return h('span', {
                            on: { 
                                click: () => {
                                    this.modelSynopsis = parms.row
                                    this.isShowElement = false
                                    this.routeWorkflowModelEditForm (parms.row.id, false) 
                                } 
                            }
                        }, [
                           h ('span', {
                                class: {
                                    'forbidden': parms.row.status === '0',
                                    'startusing': parms.row.status === '1'
                                },
                           }),
                           h ('span', {
                               class: {
                                    'typefaceColor': true,
                                },
                           }, parms.row.name)
                        ], )
                    }
                },
                // 格式化为字符串
                {
                    prop: 'fatherName',
                    label: '分类',
                    isShow: true
                },
                {
                    prop: 'createdTime',
                    label: '创建时间',
                    isShow: true
                },
                // 插入组件或标签内容（例：进度条组件）
                {
                    prop: 'status',
                    label: '状态',
                    isShow: true,
                    render: (h, parms) => {
                        return h('div', {}, parms.row.status === '1' ? '启用' : '禁用')
                    }
                },
                {
                    prop: 'createdName',
                    label: '创建人',
                    isShow: true
                },
                // 添加操作按钮
                {
                    prop: '',
                    label: '操作',
                    isShow: true,
                    fixed: 'right',
                    width: '230',
                    render: (h, parms) => {
                        return [
                            this.$has('sys:flowmodel:edit') ? h('el-button', {
                                props:{
                                    type: 'text',
                                },
                                on:{
                                    click: () => {
                                        this.modelSynopsis = parms.row
                                        this.isShowElement = true
                                        this.routeWorkflowModelEditForm (parms.row.id, true)
                                    }
                                }
                            }, '修改') : '',
                            this.$has('sys:flowmodel:status') ? h ('el-button', {
                                props:{
                                    type: 'text',
                                },
                                on:{
                                    click: () => {
                                        this.disableAndStartUsing(parms.row)
                                    }
                                }
                            }, parms.row.status === '0' ? '启用' : '禁用') : '',
                            this.$has('sys:flowmodel:edit') ? h ('el-button', {
                                props:{
                                    type: 'text',
                                },
                                on:{
                                    click: () => {
                                        this.atPresentData = parms.row
                                        this.handleMenuSelect ()
                                    }
                                }
                            }, '设计') : '',
                            this.$has('sys:flowmodel:deployment') ? h('el-button', {
                                props:{
                                    type: 'text',
                                },
                                on:{
                                    click: () => {
                                        this.atPresentData = parms.row
                                        this.processDefinitionDeployment ()
                                    }
                                }
                            }, '部署') : ''
                        ]
                    }
                }
            ],
            tableOption: {
                border: false
            },
            filterText: '',
            drawer: false,
            title: '流程模型管理',
            data: [],
            tableData: {},
            historicalData: null,
            modelSynopsis: null,
            isShowElement: false,
            tableSelectData: '',
            readonly: false,
            atPresentData: null,
            status: ''
        }
    },

    methods: {

        selectChange (item) {
            this.tableSelectData = item
        },

        getModuleMenuTreeList () {
            getWorkflowTree ().then(result => {
                if (result && result.length > 0) {
                    result.forEach(element => {
                        element['isActice'] = false,
                        element['isShow'] = false
                    });
                }
                if (this.historicalData === null) {
                    result[0]['isActice'] = true,
                    result[0]['isShow'] = true,
                    this.historicalData = result[0]
                    this.getModelSynopsisPageList(result[0].id)
                } else {
                    this.historicalData['isActice'] = true,
                    this.historicalData['isShow'] = true,
                    this.getModelSynopsisPageList(this.historicalData.id)
                }
                this.data = result
            })
            .catch(err => {
                console.log(err)
            })
        },

        updateMetaData (item) {
            this.historicalData = item
            this.searchModelSynopsis ()
        },

        getModelSynopsisPageList (id, text, status) {
            getModelSynopsisPage({
                'groupId': id,
                ...text,
                ...status,
                'pageNo': this.page.current,
                'pageSize': this.page.size
                }).then(res => {
                if (res && res.records && res.records.length > 0) {
                    res.records.forEach(element => {
                        element['fatherName'] = this.historicalData.name
                    })
                    this.tableData = res
                } else {
                    this.tableData = {}
                }
            })
        },

        handleMenuSelect () {
            this.$router.push({
                path: 'processDefinition',
                name: 'processDefinition',
                query: {
                    atPresentid: this.atPresentData.id
                }
            })
        },

        removeData () {
            let str = ''
            if (this.tableSelectData.length === 0) {
                this.$message.warning ('至少选择一条数据')
                return
            }

            this.tableSelectData.forEach(element => {
                str += element.id + ','
            })

            util.confirm ().then (boolean => {
                if (boolean) {
                    removeModelSynopsis({'ids': str.substring(0, str.length - 1)}).then(res => {
                        if (res.code === 200) {
                            this.getModelSynopsisPageList (this.historicalData.id)
                            this.$message.success('删除成功')
                        }
                    })
                }
            })
            
        },

        disableAndStartUsing (data) {
            let num = this.tableData['records'].indexOf(data)
            let identification = this.tableData['records'][num].status
            if (identification === '1') {
                this.tableData['records'][num].status = '0'
            } else {
                this.tableData['records'][num].status = '1'
            }
            updateModelSynopsisState (this.tableData['records'][num]).then(res => {
                if (res.code === 200) {
                    this.$message.success('更改成功')
                }
            })
        },

        drawerClose () {
            this.drawer = false
        },

        updataTreeMetaData () {
            this.getModuleMenuTreeList()
        },

        processDefinitionDeployment () {
            modelSynopsisIdDeployment ({'id': this.atPresentData.id}).then(res => {
                this.$message.success('部署成功')
            })
        },

        getAtPresentData (item) {
            this.atPresentData = item
        },

        updateModelSynopsis (item) {
            this.filterText = ''
            this.status = ''
            this.getModelSynopsisPageList(this.historicalData.id)
        },

        // 分页变化改动
        handlePaginationChange(val) {
            this.page = val
            this.$nextTick(() => {
                this.searchModelSynopsis ()
            });
        },

        searchModelSynopsis () {
            this.getModelSynopsisPageList (this.historicalData.id, {'keywords': this.filterText, 'status': this.status})
        },

        routeWorkflowModelEditForm (id, isShowElement) {
            this.$router.push({
                path: 'workflowModelEditForm',
                name: 'workflowModelEditForm',
                query: {
                    id: id,
                    isShowElement: isShowElement
                }
            })
        },

        selectSearchData (status) {
            this.status = status
            this.searchModelSynopsis ()
        }
    },

    components: {
        'workflow-model-node': workflowModelNode,
        'qqt-select': qqtSelect,
        'qqt-table': qqtTable,
        'workflow-model-drawer': workflowModelDrawer
    },

    created () {
        this.getModuleMenuTreeList()
    },

    watch: {
        $route (val) {
            if (val.path.indexOf('workflowModel') !== -1 && val.path.indexOf('workflowModelEditForm') === -1) {
                if (this.historicalData && this.historicalData.id) {
                    this.getModelSynopsisPageList (this.historicalData.id)
                } else {
                    this.getModuleMenuTreeList ()
                }
            }
        }
    }
}
</script>

