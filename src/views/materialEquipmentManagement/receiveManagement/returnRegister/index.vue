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
                        v-model="newFilter.keywords" size="mini">
                    </el-input>
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
import { receiveQueryById, returnList, returnQueryById, returnDelBatch } from '../../../../api/materialEquipmentManagement/receiveManagement/receiveApply/index'
import { purchasePageByCategoryList, purchaseReturnAffirm, } from '@api/materialEquipmentManagement/warehouseManagement/purchaseWarehousing/index'
import { qqtTable } from '../../../../components/qqt-subassembly'
import util from '../../../../libs/util'
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
                    label: '领用入库单编号',
                    width: '150',
                    isShow: true,
                    render: (h, parms) => {
                        return h('el-button', { props:{ type: 'text', },
                            on:{
                                click: () => {
                                    this.getDetail(parms.row.id)
                                }
                            }
                        }, parms.row.code)
                    }
                },{
                    prop: 'name',
                    label: '领用入库单名称',
                    width: '150',
                    isShow: true,
                    render: (h, parms) => {
                        return h('el-button', {
                            props:{ type: 'text', },
                            on:{
                                click: () => {
                                    this.getDetail(parms.row.id)
                                }
                            }
                        }, parms.row.name)
                    }
                },{
                    prop: 'sourceCode',
                    label: '领用申请单编号',
                    width: '150',
                    isShow: true,
                },{
                    prop: 'sourceName',
                    label: '领用申请单名称',
                    width: '150',
                    isShow: true,
                },{
                    prop: 'warehouseName',
                    label: '入库仓库',
                    isShow: true,
                },{
                    prop: 'warehouseSite',
                    label: '仓库地点',
                    isShow: true,
                    width: '180',
                },{
                    prop: 'returnAffirmName',
                    label: '确认状态',
                    width: '120',
                    isShow: true,
                    render: (h, parms) => {
                        return h('span', {
                            style: { color: parms.row.returnAffirm === '1' ? '#66b1ff' : '#f56c6c' }
                        }, parms.row.returnAffirmName = parms.row.returnAffirm === '1' ? '已确认' : '未确认')
                    }
                },{
                    prop: 'createName',
                    label: '经办人',
                    width: '120',
                    isShow: true,
                },{
                    prop: 'departmentName',
                    label: '工作部门',
                    isShow: true,
                },{
                    prop: 'createTime',
                    label: '经办时间',
                    width: '160',
                    isShow: true,
                },{
                    prop: '',
                    label: '操作',
                    isShow: true,
                    fixed: 'right',
                    width: '90',
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
                                                    this.getTableData()
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
                category: '2',
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
            selectItem: [],
            exportData: [],
            transform: {
                isShowDetails: true
            },
        }
    },
    methods: {
        getDetail (id) {
            this.$router.push ({
                path: 'addPurchaseWarehousingPage',
                name: 'addPurchaseWarehousingPage',
                params: {
                    relevancyId: id,
                    transform: this.transform,
                    isOrder: false,
                    returnRouter: 'receiveManagement/returnRegister',
                    otherModules: true,
                }
            })
            this.$store.commit ('d2admin/page/titleSet', '领用归还入库详情')
        },
        getTableData () {
            purchasePageByCategoryList(this.newFilter).then(res => {
                this.tableData = res
            })
        },
        selectChangeData (data) {
            this.newFilter.afterDate = data && data.length > 0 ? data[0] : ''
            this.newFilter.beforeDate = data && data.length > 0 ? data[1] : ''
            this.getTableData()
        },
        searchChangeData () {
            this.getTableData()
        },
        resetModelSynopsis () {
            this.newFilter = {
                afterDate: '',  // 开始时间
                beforeDate: '', // 结束时间
                keywords: '',
                category: '2',
                pageNo: '1',
                pageSize: '10',
            }
            this.selectDate = []
            this.getTableData()
        },
        deleteBatchMaterialDepotData () {
            if(this.selectItem.length === 0) {
                this.$message.warning("请选择删除的内容!!!")
            } else {
                util.confirm('确定删除此项内容吗？').then(res => {
                    if(res) {
                        let ids = ''
                        this.selectItem.forEach(item => {
                            ids += item.id + ','
                        })
                        ids = ids.substring(0, ids.length - 1)
                        returnDelBatch({ ids : ids }).then(res => {
                            this.$message.success("删除成功~~~")
                            this.getTableData()
                        })
                    }
                })
            }
        },
        exportExcel () {
            
        },
        selectChange (data) {
            this.selectItem = data
        },
        handlePaginationChange (page) {
            this.newFilter.pageNo = page.current
            this.newFilter.pageSize = page.size
            this.getTableData()
        },
        routerLink (url, params, title) {
            this.$router.push({
                path: url,
                name: url,
                params: params
            })
            this.$store.commit ('d2admin/page/titleSet', title)
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
                    item.returnAffirm = item.returnAffirm === '1' ? '已确认' : '未确认'
                });
                resolve (true)
            });
        },

        printTable () {
            this.$refs.table.printTable (this.selectDate)
        },
    },
    mounted () {
        this.getTableData()
    }
}
</script>