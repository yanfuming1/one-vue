<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header-operation___left">
                    <!-- <el-button type="primary" class="qqt-container-full-header-top___button" @click="addMaterialDepot">添加</el-button> -->
                </span>
                <span class="qqt-container-full-header___search">
                    <el-input
                        placeholder="请输入内容"
                        prefix-icon="el-icon-search"
                        v-model="pageInfo.name" size="mini">
                    </el-input>
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="searchChangeData">搜索</el-button>
                    <el-button type="info" class="qqt-container-full-header-top___button" @click="resetModelSynopsis">重置</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-date-picker
                        size="mini"
                        v-model="selectDate"
                        type="daterange"
                        :picker-options="pickerOptions"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="selectChangeData" 
                        align="right">
                    </el-date-picker>
                </span>
                <span class="qqt-container-full-header-operation___right" v-if="$has('material:rental:order:delete')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deleteBatchMaterialDepotData">批量删除</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                        <el-button size="mini" @click="uploadFun" icon="el-icon-upload2">导出</el-button>
                        <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                    </el-button-group>
                </span> 
            </div>
        </template>
        <qqt-table 
            :data="tableData" 
            ref="table" 
            :exportData="exportData" 
            :rowHeader="rowHeader" 
            :dynamicHeader="dynamicHeader" 
            :option="tableOption" 
            @selectionChange="selectChange" 
            @page="handlePaginationChange"></qqt-table>
    </d2-container>
</template>
<script>
import util from '../../../../libs/util'
import { qqtTable } from '../../../../components/qqt-subassembly'
import { rentalOrderPageList, rentalOrderDel } from '../../../../api/materialEquipmentManagement/rentOutManagement/rentOutOrder/index'
export default {
    components: {
        qqtTable
    },
    data () {
        return {
            tableData: {records:[]},
            rowHeader: [
                {
                    prop: 'rentalOrderNumber',
                    label: '出租单编号',
                    width: '220',
                    isShow: true,
                    render: (h, parms) => {
                        return h('el-button', {
                            props:{
                                type: 'text',
                            },
                            on:{
                                click: () => {
                                    this.transform.isShowDetails = true
                                    this.routerLink('rentOutOrderAdd', { relevancyId: parms.row.id, transform: this.transform}, '出租订单详情')
                                }
                            }
                        }, parms.row.rentalOrderNumber)
                    }
                },{
                    prop: 'rentalOrderName',
                    label: '出租单名称',
                    width: '250',
                    isShow: true,
                },{
                    prop: 'rentalName',
                    label: '物品名称',
                    width: '100',
                    isShow: true,
                },{
                    prop: 'rentalType',
                    label: '类型',
                    width: '100',
                    isShow: true,
                },{
                    prop: 'lessor',
                    label: '出租方',
                    width: '120',
                    isShow: true,
                },{
                    prop: 'tenantry',
                    label: '承租方',
                    width: '120',
                    isShow: true,
                },{
                    prop: 'meansPayments',
                    label: '结算方式',
                    width: '150',
                    isShow: true,
                    render: (h, parms) => {
                        return h('p', {}, parms.row.meansPayments)
                    }
                },{
                    prop: 'invoiceName',
                    label: '是否开票',
                    width: '90',
                    isShow: true,
                    render: (h, parms) => {
                        return h('p', {}, parms.row.invoiceName = parms.row.invoice === '1' ? '开票' : '不开票')
                    }
                },{
                    prop: 'eeturnDate',
                    label: '退还期限',
                    width: '100',
                    isShow: true,
                },{
                    prop: 'deliveryStatusName',
                    label: '订单状态',
                    width: '100',
                    isShow: true,
                    render: (h, parms) => {
                        return h('el-button', {
                            props:{ type: 'text', },
                            style:{ color: parms.row.deliveryStatus === '0' ? '#92E45A' : '#e6a23c' },
                            on:{
                                click: () => {
                                    if(parms.row.deliveryStatus === '2') {
                                        if(parms.row.inventoryStatus === '2') {
                                            this.transform.isShowDetails = false
                                            this.routerLink('rentOutReturnAdd', { isAdd: true, orderId: parms.row.id, transform: this.transform}, '出租归还登记添加')
                                        } else {
                                            this.$message.warning("此订单还未入库，请先入库!!!")
                                        }
                                    }
                                }
                            }
                        }, parms.row.deliveryStatusName = parms.row.deliveryStatus === '0' ? '待出库' : '未归还')
                    }
                },{
                    prop: 'proposer',
                    label: '经办人',
                    width: '100',
                    isShow: true,
                },{
                    prop: 'createTime',
                    label: '创建日期',
                    width: '150',
                    isShow: true,
                },{
                    prop: '',
                    label: '操作',
                    isShow: true,
                    fixed: 'right',
                    width: '200',
                    render: (h, parms) => {
                        return [
                            h('el-button', {
                                props:{ type: 'text', disabled: parms.row.procState === '1' ? false : true },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = false
                                        this.routerLink('rentOutOrderAdd', { relevancyId: parms.row.id, transform: this.transform}, '出租申请编辑')
                                    }
                                }
                            }, this.$has('material:rental:order:edit') ? '编辑' : ''),
                            h('el-button', {
                                props:{ type: 'text', disabled: parms.row.procState === '1' ? false : true },
                                on:{
                                    click: () => {
                                        util.confirm('确定删除此项内容吗？').then(res => {
                                            if(res) {
                                                rentalOrderDel({ ids: parms.row.id }).then(response => {
                                                    this.$message.success("删除成功~~~")
                                                    this.getTableList()
                                                })
                                            }
                                        })
                                    }
                                }
                            }, this.$has('material:rental:order:delete') ? '删除' : ''),
                        ]
                    }
                }
            ],
            dynamicHeader: {
                // tableId: 'T_1577684881365',
                // isSave: false
            },
            tableOption: {},
            pageInfo: {
                name: '',
                pageNo: '1',
                pageSize: '10',
                createTime: '',
                updateTime: '',
            },
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
            selectDate: [],
            selectData: [],
            transform: {
                isShowDetails: false
            },
            exportData: [],
        }
    },
    methods: {
        selectChangeData (date) {
            this.pageInfo.createTime = date && date.length > 0 ? date[0] : ''
            this.pageInfo.updateTime = date && date.length > 0 ? date[1] : ''
            this.getTableList()
        },
        searchChangeData () {
            this.getTableList()
        },
        resetModelSynopsis () {
            this.pageInfo = {
                name: '',
                pageNo: '1',
                pageSize: '10',
                createTime: '',
                updateTime: '',
            }
            this.selectDate = []
            this.getTableList()
        },
        deleteBatchMaterialDepotData () {
            if(this.selectData.length === 0) {
                this.$message.warning("请选择删除的内容!!!")
            } else {
                util.confirm('确定删除此项内容吗？').then(res => {
                    if(res) {
                        let ids = ''
                        this.selectData.forEach(item => {
                            ids += item.id + ','
                        })
                        ids = ids.substring(0, ids.length - 1)
                        rentalOrderDel({ ids: ids }).then(response => {
                            this.$message.success("删除成功~~~")
                            this.getTableList()
                        })
                    }
                })
            }
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
                    item.invoice = item.invoice === '1' ? '开票' : '不开票'
                    item.deliveryStatus = item.deliveryStatus === '0' ? '待出库' : '未归还'
                });
                resolve (true)
            });
        },
        selectChange (data) {
            this.selectData = data
        },
        handlePaginationChange (page) {
            this.pageInfo.pageNo = page.current
            this.pageInfo.pageSize = page.size
            this.getTableList()
        },
        routerLink (url, params, title) {
            this.$router.push({
                path: url,
                name: url,
                params: params
            })
            this.$store.commit ('d2admin/page/titleSet', title)
        },
        getTableList () {
            rentalOrderPageList(this.pageInfo).then(res => {
                this.tableData = res
            })
        },
        printTable () {
            this.$refs.table.printTable (this.selectData)
        }
    },
    mounted () {
        this.getTableList()
    }
}
</script>