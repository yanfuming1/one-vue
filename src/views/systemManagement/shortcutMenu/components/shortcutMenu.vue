<template>
    <d2-container type="fulls">
        <div class="shortcut-menu">
             <div class="qqt-container-full-center___left">
                <qqt-tree 
                    title="模块菜单"
                    ref="tree"
                    :data="data"
                    :checkData="tableData.records"
                    :btnTitle="null"
                    :isShowUpdate="false"
                    :isShowAdd="false"
                    :isShowCheckbox="true"
                    :isOnlyShowChildernCheck="true"
                    :isShowDel="false"
                    :defaultProps="defaultProps"
                    @checkChange="getCheckChange"
                />
            </div>
            <div class="qqt-container-full-center___right">
                <qqt-table :data="tableData" :rowHeader="rowHeader" :pageShow="false" :isDrag="false" :isShowGroup="false" :isShowSelection="false"></qqt-table>
            </div>
        </div>
    </d2-container>
</template>

<script>
    import { qqtTable, qqtTree } from '../../../../components/qqt-subassembly'
    import { getShortcutMenuAllPer, getShortcutMenuByUserId, addShortcutMenu } from '../../../../api/system/shortcutMenu'
    export default {
        
        components: {
            'qqt-table': qqtTable,
            'qqt-tree': qqtTree
        },
        
        data () {
            return {
                tableData: {
                    records: []
                },
                data: [],
                rowHeader: [
                    {
                        prop: 'name',
                        label: '菜单名称',
                        isShow: true,
                    },
                    {
                        prop: 'css',
                        label: '图标',
                        isShow: true,
                        render: (h, parms) => {
                            return [
                                h ('div', {
                                    domProps: {
                                        innerHTML: `<i class="iconfont ${parms.row.css}" />`
                                    },
                                })
                            ]
                        }
                    },
                    {
                        prop: '',
                        label: '操作',
                        isShow: true,
                        render: (h, parms) => {
                            return [
                                h('el-button', {
                                    props: { 
                                        type: 'text',
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteShortcutMenuDetailsById (parms.row.id)
                                        }
                                    }
                                }, '删除' )
                            ]
                        }
                    }
                ],
                defaultProps: {
                    value: 'id',
                    label: 'name',
                    children: 'children'
                }
            }
        },

        methods: {

            getCheckChange (item) {
                if (item.length > 10) {
                    this.$message.warning ('至多十条数据')
                } else {
                    this.tableData.records = item
                    this.addShortcutMenuData (this.tableData.records, true)
                }
            },

            getShortcutMenuAllTree () {
                getShortcutMenuAllPer ().then (res => {
                    if (res) this.data = res
                })
            },

            getShortcutMenuDetailsByUserId () {
                getShortcutMenuByUserId ().then (res => {
                    let list = []
                    if (res) {
                        res.forEach (item => list.push (item.id))
                        this.$refs.tree.setCheckedKeyList (list)
                        this.tableData.records = res
                    }
                })
            },

            deleteShortcutMenuDetailsById (id) {
                let index = this.tableData.records.findIndex (f => f.id === id)
                if (index != -1) {
                    this.$refs.tree.setCheckedKey (this.tableData.records[index].id)
                    this.tableData.records.splice (index, 1)
                    this.addShortcutMenuData (this.tableData.records, false)
                }
            },

            addShortcutMenuData (data, boolean) {
                addShortcutMenu (data).then (res => {
                    if (res.code === 200)
                        this.$message.success (boolean ? '操作成功' : '删除成功')
                        this.$store.dispatch ('d2admin/menu/shortcutMenuDataSet', { shortcutMenu:data, boolean: false})
                        this.getShortcutMenuDetailsByUserId ()
                })
            }
        },

        created () {
            this.getShortcutMenuAllTree ()
            this.getShortcutMenuDetailsByUserId ()
        }
    }
</script>

<style lang='scss'>
    .shortcut-menu {
        .qqt-container-full-center___left {
            height: 800px !important;
        }
        .qqt-container-full-center___right {
            height: 800px !important;
        }
    }
</style>
