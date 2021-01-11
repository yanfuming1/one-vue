<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header___search">
                    <el-input placeholder="请输入内容"  prefix-icon="el-icon-search" v-model="newFilter.keywords" size="mini"></el-input>
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="searchChangeData">搜索</el-button>
                    <el-button type="info" class="qqt-container-full-header-top___button" @click="resetModelSynopsis">重置</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-date-picker
                        size="mini"
                        v-model="selectDate"
                        type="datetimerange"
                        :picker-options="pickerOptions"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['08:00:00', '18:00:00']"
                        @change="selectChangeData" 
                        align="right">
                    </el-date-picker>
                </span>
                <!-- <span class="qqt-container-full-header-operation___right">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deleteBatchMaterialDepotData">批量删除</el-button>
                </span> -->
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
import { purchasePageByCategoryList, purchaseReturnAffirm } from '@api/materialEquipmentManagement/warehouseManagement/purchaseWarehousing/index'
export default {
    components: {
        qqtTable
    },
    data () {
        return {
            tableData: {records:[]},
            rowHeader: [
                {
                    prop: 'code',
                    label: '归还登记单号',
                    width: '180',
                    isShow: true,
                    render: (h, parms) => {
                        return h('el-button', {
                            props:{ type: 'text', },
                            on:{
                                click: () => { this.getDetail(parms.row.id) }
                            }
                        }, parms.row.code)
                    }
                },{
                    prop: 'name',
                    label: '归还单名称',
                    width: '150',
                    isShow: true,
                },{
                    prop: 'batch',
                    label: '批次号',
                    width: '120',
                    isShow: true,
                },{
                    prop: 'sourceCode',
                    label: '出租单号',
                    width: '150',
                    isShow: true,
                },{
                    prop: 'sourceName',
                    label: '出租单名称',
                    width: '150',
                    isShow: true,
                },{
                    prop: 'warehouseName',
                    label: '仓库名称',
                    width: '150',
                    isShow: true,
                },{
                    prop: 'warehouseSite',
                    label: '仓库地点',
                    width: '180',
                    isShow: true,
                },{
                    prop: 'returnName',
                    label: '归还人',
                    width: '100',
                    isShow: true,
                },{
                    prop: 'returnAffirmName',
                    label: '确认状态',
                    width: '100',
                    isShow: true,
                    render: (h, parms) => {
                        return h('span', {
                            style: { color: parms.row.returnAffirm === '1' ? '#66b1ff' : '#f56c6c' }
                        }, parms.row.returnAffirmName = parms.row.returnAffirm === '1' ? '已确认' : '未确认')
                    }
                },{
                    prop: 'createName',
                    label: '登记人',
                    width: '100',
                    isShow: true,
                },{
                    prop: 'createTime',
                    label: '登记时间',
                    width: '180',
                    isShow: true,
                },{
                    prop: '',
                    label: '操作',
                    isShow: true,
                    fixed: 'right',
                    width: '100',
                    render: (h, parms) => {
                        return [
                            h('el-button', {
                                props:{ type: 'text', disabled: parms.row.returnAffirm === '1' ? true : false, },
                                on:{
                                    click: () => {
                                        util.confirm('要确认这条信息吗？').then(res => {
                                            if (res) {
                                                purchaseReturnAffirm({ id: parms.row.id }).then(res => {
                                                    this.$message.success("确认成功")
                                                    this.getTableList()
                                                })
                                            }
                                        })
                                    }
                                }
                            }, '确认'),
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
            newFilter: {
                afterDate: '',  // 开始时间
                beforeDate: '', // 结束时间
                keywords: '',
                category: '3',
                pageNo: '1',
                pageSize: '10',
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
            this.newFilter.afterDate = date ? date[0] : null
            this.newFilter.beforeDate = date ? date[1] : null
            this.getTableList()
        },
        searchChangeData () {
            this.getTableList()
        },
        resetModelSynopsis () {
            this.newFilter = {
                afterDate: '',  // 开始时间
                beforeDate: '', // 结束时间
                keywords: '',
                category: '3',
                pageNo: '1',
                pageSize: '10',
            },
            this.selectDate = []
            this.getTableList()
        },
        deleteBatchMaterialDepotData () {
            if(this.selectData.length === 0) {
                this.$message.warning("请选择删除的内容!!!")
            } else {
                util.confirm('确定删除此项内容吗？').then(res => {
                    let ids = ''
                    this.selectData.forEach(item => {
                        ids += item.id + ','
                    })
                    ids = ids.substring(0, ids.length - 1)
                    rentalReturnDel({ ids: ids }).then(response => {
                        this.$message.success("删除成功~~~")
                        this.getTableList()
                    })
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
                    item.leasePeriod = item.leasePeriod + '天'
                    item.rent = util.convertCurrency(item.rent)
                    item.returnAffirm = item.returnAffirm === '1' ? '已确认' : '未确认'
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
        getDetail (id) {
            this.transform.isShowDetails = true
            this.$router.push ({
                path: 'addPurchaseWarehousingPage',
                name: 'addPurchaseWarehousingPage',
                params: {
                    relevancyId: id,
                    transform: this.transform,
                    isOrder: false,
                    returnRouter: 'rentOutManagement/rentOutReturn',
                    otherModules: true,
                }
            })
            this.$store.commit ('d2admin/page/titleSet', '出租归还入库详情')
        },
        getTableList () {
            purchasePageByCategoryList(this.newFilter).then(res => {
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