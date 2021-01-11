<template>
    <d2-container type="fulls" class="purchase-warehousing">
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
                        type="datetimerange"
                        :picker-options="pickerOptions"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :default-time="['08:00:00', '18:00:00']"
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
    import { qqtTable } from '../../../../../components/qqt-subassembly'
    import { getpurchaseWarehousingPageList, purchaseWarehousingSuspend } from '../../../../../api/materialEquipmentManagement/warehouseManagement/purchaseWarehousing'
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
                        prop: 'indentNumber',
                        label: '采购订单编号',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = true
                                        this.routerLink ('采购入库详情', 'addPurchaseWarehousingPage', parms.row.id)
                                    }
                                }
                            }, parms.row.indentNumber)
                        }
                    },
                    {
                        prop: 'indentName',
                        label: '采购订单名称',
                        isShow: true
                    },
                    {
                        prop: 'orderType',
                        label: '订单类型',
                        isShow: true
                    },
                    {
                        prop: 'returnPeriod',
                        label: '退换货期限',
                        isShow: true,
                    },
                    {
                        prop: 'inventoryStatusName',
                        label: '入库状态',
                        isShow: true,
                        render: (h, parms) => {
                            return h('el-button', {
                                props: {
                                    type: 'text',
                                },
                                style: {
                                    color: parms.row.inventoryStatus == '0' ? '#67C23A' :  parms.row.inventoryStatus == '1' ? '#67C23A' : ''
                                },
                            }, parms.row.inventoryStatusName = util.inventoryStatus (parms.row.inventoryStatus))
                        }
                    },
                    {
                        prop: 'inventoryDiscontinueName',
                        label: '中止状态',
                        isShow: true,
                        render: (h, parms) => {
                            return h('el-button', {
                                props: {
                                    type: 'text',
                                },
                            }, parms.row.inventoryDiscontinueName = parms.row.inventoryDiscontinue == '1' ? '已中止' : '未中止')
                        }
                    },
                    {
                        prop: 'createName',
                        label: '经办人',
                        isShow: true,
                    },
                    {
                        prop: 'createTime',
                        label: '经办时间',
                        isShow: true,
                    },
                    {
                        prop: '',
                        label: '操作',
                        isShow: true,
                        width: 250,
                        fixed: 'right',
                        render: (h, parms) => {
                            return [
                                this.$has ('material:warehouse:warrant:discontinue') ? h('el-button', {
                                    props:{
                                        type: 'danger',
                                        size: 'mini',
                                        round: true
                                    },
                                    style: {
                                        padding: '5px 10px'
                                    },
                                    attrs: {
                                        disabled: parms.row.inventoryStatus == '2' ? true : parms.row.inventoryDiscontinue == '1' ? true : false
                                    },
                                    on:{
                                        click: () => {
                                            util.confirm ('是否要中止任务').then (boolean => {
                                                if (boolean) {
                                                    this.executePurchaseTastSuspend (parms.row.id)
                                                }
                                            })
                                        }
                                    }
                                }, '中止'): '',
                                this.$has ('material:warehouse:warrant:purchase') ? h('el-button', {
                                    props:{
                                        type: 'success',
                                        size: 'mini',
                                        round: true
                                    },
                                    style: {
                                        padding: '5px 10px'
                                    },
                                    attrs: {
                                        disabled: parms.row.inventoryStatus == '2' ? true : parms.row.inventoryDiscontinue == '1' ? true : false
                                    },
                                    on:{
                                        click: () => {
                                            util.confirm ('是否要入库').then (boolean => {
                                                if (boolean) {
                                                    this.executeTreasuryReturns ('添加采购入库', 'addPurchaseWarehousingPage', parms.row.id)
                                                }
                                            })
                                        }
                                    }
                                }, '入库') : '',
                                this.$has ('material:warehouse:purchase:alteration') ? h('el-button', {
                                    props:{
                                        type: 'warning',
                                        size: 'mini',
                                        round: true
                                    },
                                    style: {
                                        padding: '5px 10px'
                                    },
                                    attrs: {
                                        disabled: parms.row.inventoryStatus == '2' ? true : false
                                    },
                                    on:{
                                        click: () => {
                                            util.confirm ('是否要退换货').then (boolean => {
                                                if (boolean) {
                                                    this.executeTreasuryReturns ('添加退换货', 'returnedGoodsInfo', parms.row.id)
                                                }
                                            })
                                        }
                                    }
                                }, '退换货'): ''
                            ]
                        }
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
                this.getPurchaseWarehousingPage ({
                    'keywords': this.filterText ? this.filterText : null,
                    'createTime': this.createDate ? this.createDate[0] : '' ,
                    'updateTime': this.createDate ? this.createDate[1] : '' })
            },

            handlePaginationChange (page) {
                this.page = page;
                this.$nextTick(() => {
                    this.searchModelSynopsis (false)
                });
            },

            getPurchaseWarehousingPage (text) {
                getpurchaseWarehousingPageList ({
                    ...text,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size
                }).then( res => {
                    if (res) this.tableData = res
                })
            },

            executePurchaseTastSuspend (id) {
                purchaseWarehousingSuspend ({'sourceId': id}).then (res => {
                    if (res.code == 200) {
                        this.$message.success (res.message)
                        this.getPurchaseWarehousingPage ()
                    }
                })
            },

            executeTreasuryReturns (name, router, id) {
                this.transform.isShowDetails = false
                if (router) this.routerLink (name, router, id)
            },

            resetModelSynopsis () {
                this.filterText = ''
                this.createDate = []
                this.resetPage ()
                this.getPurchaseWarehousingPage ()
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

            routerLink (title, router, id = '') {
                this.$router.push ({
                    path: router,
                    name: router,
                    params: {
                        relevancyId: id,
                        transform: this.transform,
                        returnRouter: 'purchaseWarehousing',
                        isOrder: true
                    }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            },
        },

        components: {
            'qqt-table': qqtTable,
        },

        created () {
            this.getPurchaseWarehousingPage ()
        }
    }

</script>
<style lang="scss">
    .purchase-warehousing {
        .qqt-container-full-header-state___select {
            width: 8% !important
        }
    }
</style>