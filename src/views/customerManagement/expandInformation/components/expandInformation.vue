<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header-operation___left" v-if="$has ('dictionary:list:add')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addExpandInformation()">添加</el-button>
                </span>
                <span class="qqt-container-full-header___search">
                    <el-input
                            placeholder="请输入内容"
                            prefix-icon="el-icon-search"
                            @keyup.enter.native="searchModelSynopsis"
                            v-model="filterText" size="mini">
                    </el-input>
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="searchModelSynopsis">搜索</el-button>
                    <el-button type="info" class="qqt-container-full-header-top___button" @click="resetModelSynopsis">重置</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right" v-if="$has ('dictionary:list:deleteBatch')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deleteCustomerDictionaryList">批量删除</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                        <el-button size="mini" @click="exportExcel" icon="el-icon-upload2">导出</el-button>
                    </el-button-group>
                </span>
            </div>
        </template>
        <div class="qqt-container-full-center___left">
            <expand-information-node :options="data" @information="getExpandInformataionSon"></expand-information-node>
        </div>
        <div class="qqt-container-full-center___right">
            <qqt-table :data="tableData" ref="table" :exportData="tableData.records" :rowHeader="rowHeader" :isShowIndex="isShowIndex" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange"></qqt-table>
        </div>
        <add-expand-information-dialog :dialogVisible="dialogVisible" :expandInformation="data" :data="values" :isEdit="isEdit" :remoteFunction="remoteFuncs" @change="updataExpandInformation"></add-expand-information-dialog>
    </d2-container>
</template>

<script>
    import { qqtTable } from '../../../../components/qqt-subassembly'
    import { getCustomerDictionaryList, 
             getCustomerDictionaryQueryById, 
             deleteCustomerDictionarySon, 
             getCustomerDictionaryPageList,
             getCustomerDictionaryTocustomerAuthorization} from '../../../../api/customerManagement/expandInformation'
    import { mapState, mapActions } from 'vuex'

    import expandInformationNode from './expandInformationNode'
    import addExpandInformationDialog from './addExpandInformationDialog'
    import util from '@/libs/util.js'
    export default {
        name: "expandInformation",
        data () {
            return {
                filterText: '',
                historicalData: '',
                isShowSelection: false,
                isShowIndex: false,
                dialogVisible: false,
                isEdit: true,
                data: [],
                tableSelectData: [],
                remoteFuncs: {},
                rowHeader: [
                    {
                        prop: 'proName',
                        label: '拓展字段名称',
                        isShow: true,
                    },
                    {
                        prop: '',
                        label: '操作',
                        isShow: true,
                        width: 240,
                        render: (h, parms) => {
                            return [
                                h('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    on:{
                                        click: () => {
                                            this.addExpandInformation (parms.row)
                                        }
                                    }
                                }, '编辑'),
                                h('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    on:{
                                        click: () => {
                                            this.deleteCustomerDictionary ([parms.row])
                                        }
                                    }
                                }, '删除')
                            ]
                        }
                    }
                ],
                values: {},
                tableData: {},
                page: {
                    current: 1,
                    size: 10,
                    total: 0
                },
                tableOption: {
                    border: false
                }
            }
        },

        methods: {

            ...mapActions ('d2admin/customer/', [
                'remoteFuncsSet'
            ]),

            selectChange (item) {
                this.tableSelectData = item
            },

            searchModelSynopsis () {
                this.resetPage ()
                this.getCustomerDictionaryPageListSonById (this.historicalData.id, {'keywords': this.filterText})
            },

            handlePaginationChange (page) {
                this.page = page;
                this.$nextTick(() => {
                    this.getCustomerDictionaryPageListSonById (this.historicalData.id)
                });
            },

            getCustomerDictionaryPage () {
                getCustomerDictionaryList().then(res => {
                    if (res && res.length > 0) {
                        res.forEach(element => {
                            element['isShow'] = false
                        });
                    }
                    if (this.historicalData === '') {
                        res[0]['isShow'] = true
                        this.historicalData = res[0]
                        this.getCustomerDictionaryQuerySonById(res[0].id)
                    } else {
                        this.historicalData['isShow'] = true
                        this.getCustomerDictionaryQuerySonById(this.historicalData.id)
                    }
                    this.data = res
                })
            },

            getCustomerDictionaryQuerySonById (id, text) {
                getCustomerDictionaryQueryById ({
                    'id': id,
                    ...text,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size
                }).then(res => {
                    if (res) {
                        this.tableData = res
                    }
                })
            },

            getExpandInformataionSon (item) {
                this.historicalData = item
                this.$store.commit ('d2admin/loading/noAllowShow')
                this.getCustomerDictionaryQuerySonById (item.id)
            },

            deleteCustomerDictionary (item) {
                let str = ''
                let isDelet = true
                util.confirm ().then (boolean => {
                    if (boolean) {
                        item.forEach ((data, index) => {
                            this.getCustomerListToObject (data.id).then ((ele)  => {
                                if (!ele) {
                                    isDelet = false
                                    this.$message.warning (` { ${data.proName} } 节点存在授权用户, 无法删除 `)
                                } else {
                                    str += data.id + ','
                                }
                                if (isDelet && item.length - 1 === index) {
                                    deleteCustomerDictionarySon ({'ids': str.substring (0, str.length - 1)}).then(res => {
                                        if (res.code === 200) {
                                            this.$message.success(res.message)
                                            this.getCustomerDictionaryQuerySonById (this.historicalData.id)
                                        }
                                    })
                                }
                            })
                        })
                    }
                })
            },

            deleteCustomerDictionaryList () {
                if (this.tableSelectData && this.tableSelectData.length > 0) {
                    this.deleteCustomerDictionary (this.tableSelectData)
                } else {
                    this.$message.warning ('请选择要删除的数据')
                }
            },

            addExpandInformation (item) {
                this.remoteFuncs['expandOptions'] = this.data
                this.dialogVisible = true
                if (item) {
                    this.values = JSON.parse (JSON.stringify (item))
                    this.isEdit = false
                } else {
                    this.values = JSON.parse (JSON.stringify (this.historicalData))
                    this.isEdit = true
                }
            },

            updataExpandInformation () {
                this.getCustomerDictionaryPage ()
                this.dialogVisible = false
            },

            resetModelSynopsis () {
                this.filterText = ''
                this.getCustomerDictionaryQuerySonById (this.historicalData.id)
            },

            getCustomerDictionaryPageListSonById (id, text) {
                getCustomerDictionaryPageList ({
                    ...text,
                    'parentId': id,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size
                }).then (res => {
                    this.tableData = res
                })
            },

            async getCustomerListToObject (id) {
                this.$store.commit ('d2admin/loading/noAllowShow')
                return await getCustomerDictionaryTocustomerAuthorization ({
                    'authorizationTypeId': id,
                }).then(res => {
                    if (res && res.length > 0) {
                        return false
                    } else {
                        return true
                    }
                })
            },

            exportExcel () { 
                this.$refs.table.getExportExcel ()
            },

            resetPage () {
                this.page = {
                    current: 1,
                    size: 10,
                    total: 0
                }
            }
        },

        computed: {
            ...mapState('d2admin/customer', [
                'identification'
            ])
        },

        components: {
            'qqt-table': qqtTable,
            'expand-information-node': expandInformationNode,
            'add-expand-information-dialog': addExpandInformationDialog
        },

        created () {
            this.$store.dispatch ('d2admin/customer/identificationLoad')
            this.getCustomerDictionaryPage ()
        }
    }
</script>

