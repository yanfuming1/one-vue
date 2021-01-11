<template>
    <d2-container type="fulls" class="other-warehouses">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header-operation___left" v-if="$has ('material:warehouse:warrant:submit')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addOtherWarehouses">添加</el-button>
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
                <span class="qqt-container-full-header-operation___right">
                    <el-date-picker
                        size="mini"
                        v-model="createDate"
                        type="daterange"
                        :picker-options="pickerOptions"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="searchModelSynopsis()" 
                        align="right">
                    </el-date-picker>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <p>入库类型:</p>
                    <div class="qqt-container-full-header-state___select">
                        <qqt-select :value="category" :options="categoryOptions" :size="'mini'" :placeholder="'请选择'" @select="page.current = 1, page.size = 10, category = $event, searchModelSynopsis ()"></qqt-select>
                    </div>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                        <el-button size="mini" @click="exportExcel" icon="el-icon-upload2">导出</el-button>
                        <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button> 
                    </el-button-group>
                </span>
            </div>
        </template>
        <div class="qqt-container-full___center">
            <qqt-table :data="tableData" ref="table" :exportData="tableData.records" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange" />
        </div>
    </d2-container>
</template>

<script>
    import { qqtTable, qqtSelect } from '../../../../../components/qqt-subassembly'
    import { getOtherWarehousesPageList } from '../../../../../api/materialEquipmentManagement/warehouseManagement/otherWarehouses'
    import { mapState } from 'vuex'

    import util from '@/libs/util.js'
    export default {
        data () {
            return {
                category: '',
                filterText: '',
                options: [],
                createDate: [],
                tableSelectData: [],
                categoryOptions: [
                    {
                        value: '2',
                        label: '领用归还'
                    },
                    {
                        value: '3',
                        label: '出租归还'
                    },
                    {
                        value: '4',
                        label: '换货入库'
                    },
                    {
                        value: '5',
                        label: '其它入库'
                    }
                ],
                tableOption: {
                    border: false
                },
                transform: {
                    isShowDetails: false
                },
                dynamicHeader: {
                    tableId: '',
                    isSave: false
                },
                page: {
                    current: 1,
                    size: 10,
                    total: 0
                },
                tableData: {},
                orderId: '',
                dialogVisible: false,
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
                rowHeader: [
                    {
                        prop: 'code',
                        label: '入库单编号',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = true
                                        this.routerLink ('其它入库详情', parms.row.id)
                                    }
                                }
                            }, parms.row.code)
                        }
                    },
                    {
                        prop: 'name',
                        label: '入库单名称',
                        isShow: true
                    },
                    {
                        prop: 'sourceCode',
                        label: '关联单编号',
                        isShow: true
                    },
                    {
                        prop: 'sourceName',
                        label: '关联单名称',
                        isShow: true
                    },
                    {
                        prop: 'categoryName',
                        label: '入库类型',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {
                            }, parms.row['categoryName'] = this.categoryIdToName (parms.row.category))
                        }
                    },
                    {
                        prop: 'createName',
                        label: '入库经办人',
                        isShow: true,
                    },
                    {
                        prop: 'departmentName',
                        label: '工作部门',
                        isShow: true,
                    },
                    {
                        prop: 'storageTime',
                        label: '入库时间',
                        isShow: true,
                    }
                ]
            }
        },

        methods: {

            selectChange (item) {
                this.tableSelectData = item
            },

            searchModelSynopsis (boolean = true) {
                if (boolean) this.resetPage ()
                this.getOtherWarehousesPage ({
                    'category': this.category ? this.category : null,
                    'keywords': this.filterText ? this.filterText : null,
                    'createTime': this.createDate ? this.createDate[0] : null,
                    'updateTime': this.createDate ? this.createDate[1] : null})
            },

            handlePaginationChange (page) {
                this.page = page;
                this.$nextTick(() => {
                    this.searchModelSynopsis (false)
                });
            },

            getOtherWarehousesPage (text) {
                getOtherWarehousesPageList ({
                    ...text,
                    'procurement': false,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size
                }).then( res => {
                    if (res) this.tableData = res
                })
            },

            resetModelSynopsis () {
                this.filterText = this.category = ''
                this.createDate = []
                this.resetPage ()
                this.getOtherWarehousesPage ()
            },

            exportExcel () {
                this.$refs.table.getExportExcel ()
            },

            printTable () {
                this.$refs.table.printTable (this.multipleSelection)
            },


            resetPage () {
                this.page = {
                    current: 1,
                    size: 10,
                    total: 0
                }
            },

            addOtherWarehouses (router) {
                this.transform.isShowDetails = false
                this.routerLink ('添加其它入库')
            },

            categoryIdToName (category) {
                let str = '', item = {}
                item = this.categoryOptions.find (f => f.value == category)
                if (item) str = item.label
                return str
            },

            routerLink (title, id = '') {
                this.$router.push ({
                    path: 'addPurchaseWarehousingPage',
                    name: 'addPurchaseWarehousingPage',
                    params: {
                        relevancyId: id,
                        transform: this.transform,
                        returnRouter: 'otherWarehouses',
                        isOrder: false
                    }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            },
        },

        components: {
            'qqt-table': qqtTable,
            'qqt-select': qqtSelect
        },

        created () {
            this.getOtherWarehousesPage ()
        }
    }

</script>
<style lang="scss">
    .other-warehouses {
        .qqt-container-full-header-state___select {
            width: 8% !important
        }
    }
</style>