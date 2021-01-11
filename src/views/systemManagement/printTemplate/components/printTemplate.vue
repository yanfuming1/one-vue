<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header-operation___left" v-if="$has ('administer:adminFile:add')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addArchiveRegistration">添加</el-button>
                </span>
                <span class="qqt-container-full-header___search">
                    <el-input
                        placeholder="请输入内容"
                        prefix-icon="el-icon-search"
                        @keyup.enter.native="selectChangeData"
                        v-model="name" size="mini">
                    </el-input>
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="selectChangeData">搜索</el-button>
                    <el-button type="info" class="qqt-container-full-header-top___button" @click="resetModelSynopsis">重置</el-button>
                </span>
            </div>
        </template>
        <div class="qqt-container-full___center">
            <qqt-table :data="tableData" ref="table" :isPrint="false" :rowHeader="rowHeader" :option="tableOption" @page="handlePaginationChange"></qqt-table>
        </div>
        <add-print-template v-if="dialogVisible" :dialogVisible="dialogVisible" :printTemplateId="printTemplateId" :transform="transform" @close="dialogVisible = false" @closeAndRefresh="dialogVisible = false, getPrintTemplate ()"/>
    </d2-container>
</template>

<script>
    import { qqtTable } from '../../../../components/qqt-subassembly'
    import { getPrintTemplateList } from '../../../../api/system/printTemplate'
    import addPrintTemplate from './addPrintTemplate'
    export default {

        components: {
            'qqt-table': qqtTable,
            'addPrintTemplate': addPrintTemplate
        },

        data () {
            return {
                name: '',
                printTemplateId: '',
                dialogVisible: false,
                transform: {
                    isShowDetails: false
                },
                tableData: {},
                rowHeader: [
                    {
                        prop: 'name',
                        label: '模板名称',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on: {
                                    click : () => {
                                        this.neatenData (parms.row.id, true)
                                    }
                                }
                            }, parms.row.name)
                        }
                    },
                    {
                        prop: 'tableCode',
                        label: '模板编码',
                        isShow: true
                    },
                    {
                        prop: 'typeName',
                        label: '类型',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {},
                                parms.row.typeName = parms.row.type == '1' ? '默认' : '用户自定义'
                            )
                        }
                    },
                    {
                        prop: 'createTime',
                        label: '创建时间',
                        isShow: true
                    },
                    {
                        prop: '',
                        label: '操作',
                        isShow: true,
                        render: (h, parms) => {
                            return [
                                h('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    on:{
                                        click: () => {
                                            this.neatenData (parms.row.id, false)
                                        }
                                    }
                                },  '修改'),
                                h('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    on:{
                                        click: () => {
                                            this.routerLink (parms.row.id)
                                        }
                                    }
                                }, '设计'),
                            ]
                        }
                    }
                ],
                tableOption: {
                    height: 600
                },
                page: {
                    current: 1,
                    size: 10,
                    total: 0
                }
            }
        },

        methods: {

            addArchiveRegistration () {
                this.printTemplateId = ''
                this.dialogVisible = true
                this.transform.isShowDetails = false
            },

            selectChangeData () {
                this.getPrintTemplate ({
                    'name': this.name ? this.name : null
                })
            },

            resetModelSynopsis () {
                this.name = ''
                this.getPrintTemplate ()
            },

            handlePaginationChange (page) {
                this.page = page
                this.$nextTick(() => {
                    this.selectChangeData ()
                })
            },

            getPrintTemplate (item) {
                getPrintTemplateList ({
                    ...item,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size
                }).then (res => {
                    if (res) this.tableData = res
                })
            },

            neatenData (id, boolean) {
                this.printTemplateId = id
                this.transform.isShowDetails = boolean
                this.dialogVisible = true
            },

            routerLink (id) {
                this.$router.push ({
                    path: '/printTemplateByHtml',
                    query: {
                        code: id
                    }
                })
            }
        },

        created () {
            this.getPrintTemplate ()
        }
    }
</script>

<style lang='scss' scoped>

</style>
