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
    import { getOtherWarehousesPageList } from '@/api/materialEquipmentManagement/warehouseManagement/otherWarehouses'
    import { qqtTable } from '@/components/qqt-subassembly'
    import { mapState } from 'vuex'

    import util from '@/libs/util.js'
    export default {
        data () {
            return {
                filterText: '',
                options: [],
                createDate: [],
                tableSelectData: [],
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
                        width: '150',
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = true
                                        this.routerLink ('入库详情', parms.row.id, parms.row.category)
                                    }
                                }
                            }, parms.row.code)
                        }
                    },
                    {
                        prop: 'name',
                        label: '入库单名称',
                        isShow: true,
                        width: '120'
                    },
                    {
                        prop: 'sourceCode',
                        label: '关联单据编号',
                        isShow: true,
                        width: '150'
                    },
                    {
                        prop: 'sourceName',
                        label: '关联单据名称',
                        isShow: true,
                        width: '150'
                    },
                    {
                        prop: 'projectName',
                        label: '关联项目',
                        isShow: true,
                        width: '150'
                    },
                    {
                        prop: 'categoryName',
                        label: '入库类型',
                        width: '110',
                        isShow: true,
                        render: (h, parms) => {
                            return [
                                h ('div', {}, parms.row['categoryName'] = this.categoryIdToName (parms.row.category))
                            ]
                        }
                    },
                    {
                        prop: 'batch',
                        label: '批次号',
                        isShow: true,
                        width: '120'
                    },
                    {
                        prop: 'warehouseName',
                        label: '存放仓库',
                        isShow: true,
                        width: '120'
                    },
                    {
                        prop: 'warehouseSite',
                        label: '存放地点',
                        isShow: true,
                        width: '150'
                    },
                    {
                        prop: 'amount',
                        label: '入库物品总价',
                        isShow: true,
                        width: '100',
                        isOpenSummary: true
                    },
                    {
                        prop: 'returnAffirmName',
                        label: '入库状态',
                        isShow: true,
                        width: '80',
                        render: (h, parms) => {
                            return [
                                h ('div', {}, parms.row.returnAffirmName = parms.row.returnAffirm == '0' ? '未确认' : '已确认')
                            ]
                        }
                    },
                    {
                        prop: 'storageTime',
                        label: '入库日期',
                        isShow: true,
                        width: '120'
                    },
                    {
                        prop: 'createName',
                        label: '经办人',
                        isShow: true,
                        width: '100'
                    },
                    {
                        prop: 'departmentName',
                        label: '工作部门',
                        isShow: true,
                        width: '120'
                    },
                    {
                        prop: 'createTime',
                        label: '经办时间',
                        isShow: true,
                        width: '150'
                    }
                ],
                categoryOptions: [
                    {
                        value: '1',
                        label: '采购入库'
                    },
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
            }
        },

        methods: {

            selectChange (item) {
                this.tableSelectData = item
            },

            searchModelSynopsis (boolean = true) {
                if (boolean) this.resetPage ()
                this.getWarehouseWarrantPage ({
                    'name': this.filterText ? this.filterText : null,
                    'createTime': this.createDate ? this.createDate[0] : null,
                    'updateTime': this.createDate ? this.createDate[1] : null})
            },

            handlePaginationChange (page) {
                this.page = page;
                this.$nextTick(() => {
                    this.searchModelSynopsis (false)
                });
            },

            getWarehouseWarrantPage (text) {
                getOtherWarehousesPageList ({
                    ...text,
                    'procState': '10',
                    'pageNo': this.page.current,
                    'pageSize': this.page.size
                }).then( res => {
                    if (res) this.tableData = res
                })
            },

            resetModelSynopsis () {
                this.filterText = ''
                this.createDate = []
                this.resetPage ()
                this.getWarehouseWarrantPage ()
            },

            categoryIdToName (category) {
                let str = '', item = {}
                item = this.categoryOptions.find (f => f.value == category)
                if (item) str = item.label
                return str
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

            routerLink (title, id = '', category) {
                this.$router.push ({
                    path: 'addPurchaseWarehousingPage',
                    name: 'addPurchaseWarehousingPage',
                    params: {
                        relevancyId: id,
                        transform: this.transform,
                        returnRouter: category == '1' ? 'warehouseWarrant' : 'otherWarehouses',
                        isOrder: false
                    }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            },
        },

        components: {
            'qqt-table': qqtTable,
        },

        created () {
            this.getWarehouseWarrantPage ()
        }
    }

</script>
