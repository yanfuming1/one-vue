<template>
<!-- 离职申请  -->
    <d2-container>
        <div slot="header" class="search-outbound-order-page">
            <el-form :inline="true" :model="form" ref="form" size="mini" @submit.native.prevent>
                <el-form-item label prop="name">
                    <el-input v-model="form.keywords" prefix-icon="el-icon-search" placeholder="请输入需搜索的内容" style="width: 200px;" @keyup.enter.native="dataSearch"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="dataSearch">搜索</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="info" @click="resetBtn">重置</el-button>
                </el-form-item>
                <el-form-item>
                    <el-date-picker
                        size="mini"
                        v-model="createDate"
                        type="datetimerange"
                        :picker-options="pickerOptions"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至" 
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['08:00:00', '18:00:00']"
                        @change="dataSearch()" 
                        align="right">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button-group>
                        <el-button size="mini" @click="" icon="el-icon-upload2" @click="exportExcel" >导出</el-button>
                        <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button> 
                    </el-button-group>
                </el-form-item>
            </el-form>
        </div>
        
        <div class="purchase-warehousing-conent">
            <qqt-table :data="outboundOrderData" ref="table" :exportData="outboundOrderData.records" :option="tableOption" :dynamicHeader="dynamicHeader" :rowHeader="rowHeader" @selectionChange="selectChange" @page="handlePaginationChange"></qqt-table>
        </div>
        
    </d2-container>
</template>


<script>
import { searchOutboundOrderList, suspensionOfExport } from '../../../../../api/materialEquipmentManagement/warehouseManagement/outboundOrder'
import util from '@/libs/util.js'
export default {
    comments: {
        
    },
    data () {
        return {
            form: {
                keywords:''
            },
            
            transform: {
                isShowDetails: false
            },

            // 时间搜索
            createDate: [],
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

            outboundOrderData: { },
            multipleSelection: [],
            tableOption: {
                border: true
            }, 
            dynamicHeader: {
                tableId: 'T_1095660192',
                isSave: false
            },
            page: {
                current: 1,
                size: 10,
                total: 0
            },
            rowData:[],
            rowHeader: [
                {
                    prop: 'sourceCode',
                    label: '关联单据编号',
                    isShow:true,
                    render: (h, params) => {
                        return h('el-button', {
                            style: {
                                color: '#3ba5ff'
                            },
                            attrs: {
                                type: 'text'
                            },
                            on: {
                                click: (index, row) => {
                                    this.rowData = params.row
                                    this.transform.isShowDetails = true
                                    this.$router.push({
                                        path: 'outboundOrderInfo',
                                        name: 'outboundOrderInfo',
                                        params: {
                                            transform: this.transform,
                                            sourceId: params.row.sourceId,
                                            category: params.row.category,
                                            isShowOutboundorder: '1'
                                        }
                                    })
                                }
                            }
                        }, params.row.sourceCode)
                    }
                },
                {
                    prop: 'sourceName',
                    label: '关联单据名称',
                    isShow:true,
                    render: (h, params) => {
                        return h('el-button', {
                            style: {
                                color: '#3ba5ff'
                            },
                            attrs: {
                                type: 'text'
                            },
                            on: {
                                click: (index, row) => {
                                    this.rowData = params.row
                                    this.transform.isShowDetails = true
                                    this.$router.push({
                                        path: 'outboundOrderInfo',
                                        name: 'outboundOrderInfo',
                                        params: {
                                            transform: this.transform,
                                            sourceId: params.row.sourceId,
                                            category: params.row.category,
                                            isShowOutboundorder: '1'
                                        }
                                    })
                                }
                            }
                        }, params.row.sourceName)
                    }
                },
                {
                    prop: 'categoryName',
                    label: '出库类型',
                    isShow:true,
                    render: (h,params) =>{
                        return h('div',{

                        }, params.row.categoryName = this.getCategory(params.row.category))
                    }
                },
                {
                    prop: 'deliveryStatusName',
                    label: '出库状态',
                    isShow:true,
                    render: (h,params) =>{
                        return h('el-button', {
                            props: {
                                type: 'text',
                            },
                            attrs: {
                                disabled: params.row.deliveryStatus != '0' && params.row.deliveryStatus != '1' ? true : false
                            },
                            style: {
                                color: params.row.deliveryStatus == '0' ? '#67C23A' :  params.row.deliveryStatus == '1' ? '#67C23A' : ''
                            }
                        }, params.row.deliveryStatusName = params.row.deliveryStatus == '0' ? '待出库' : params.row.deliveryStatus == '1' ? '部分出库' : '全部出库')
                    }
                },
                {
                    prop: 'deliveryDiscontinueName',
                    label: '中止状态',
                    isShow:true,
                    render: (h,params) =>{
                        return h('el-button', {
                            props: {
                                type: 'text',
                            },
                        }, params.row.deliveryDiscontinueName = params.row.deliveryDiscontinue == '0' ? '未中止' : '已中止')
                    }
                },
                {
                    prop: 'createName',
                    label: '经办人',
                    isShow:true,
                },
                {
                    prop: 'departmentName',
                    label: '经办部门',
                    isShow: true,
                },
                {
                    prop: 'createTime',
                    label: '经办时间',
                    isShow: true,
                },
                {
                    prop: "",
                    label: "操作",
                    isShow: true,
                    fixed: 'right',
                    width: '150',
                    render: (h, params) => {
                            return [
                                this.$has ('material:warehouse:delivered:discontinue') ? h('el-button', {
                                    props:{
                                        type: 'danger',
                                        size: 'mini',
                                        round: true
                                    },
                                    style: {
                                        padding: '5px 10px'
                                    },
                                    attrs: {
                                        disabled: params.row.deliveryStatus == '2' ? true : params.row.deliveryDiscontinue != '0' ? true : false
                                    },
                                    on:{
                                        click: () => {
                                            util.confirm ('是否要中止任务').then (boolean => {
                                                if (boolean) {
                                                    this.suspensionOfExportEvent (params.row.sourceId, params.row.category)
                                                }
                                            })
                                        }
                                    }
                                }, '中止') : '',
                                this.$has ('material:warehouse:delivered:submit') ? h('el-button', {
                                    props:{
                                        type: 'success',
                                        size: 'mini',
                                        round: true
                                    },
                                    style: {
                                        padding: '5px 10px'
                                    },
                                    attrs: {
                                        disabled: params.row.deliveryDiscontinue != '0' ? true : params.row.deliveryStatus == '2' ? true : false
                                    },
                                    on:{
                                        click: () => {
                                            util.confirm ('是否要出库').then (boolean => {
                                                if (boolean) {
                                                    this.rowData = params.row
                                                    this.transform.isShowDetails = false
                                                    this.$router.push({
                                                        path: 'outboundOrderInfo',
                                                        name: 'outboundOrderInfo',
                                                        params: {
                                                            transform: this.transform,
                                                            sourceId: params.row.sourceId,
                                                            category: params.row.category,
                                                            isShowOutboundorder: '0'
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    }
                                }, '出库') : ''
                            ]
                        }
                },
            ],
        }
    },
    methods: {
        // 搜索
        dataSearch () {
            this.resetPage ()
            this.getsearchOutboundOrderList ({
                'keywords': this.form.keywords ? this.form.keywords : null,
                'afterDate': this.createDate ? this.createDate[0] : null,
                'beforeDate':this.createDate ? this.createDate[1] : null
            })
        },

        // 重置
        resetBtn () {
            this.form.keywords = ''
            this.createDate = []
            this.resetPage ()
            this.getsearchOutboundOrderList ()
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

        getCategory (category) {
            let name = ''
            switch (category) {
                case '1': 
                    name = '领用'
                break
                case '2': 
                    name = '出租'
                break
                case '3': 
                    name = '出售'
                break
                case '4': 
                    name = '报废'
                break
                case '5': 
                    name = '换货'
                break
                case '6':
                    name = '退货'
                break
            }
            return name
        },

        // 初始化加载数据
        getsearchOutboundOrderList (item) {
            searchOutboundOrderList({
                ...item,
                pageNo: this.page.current,
                pageSize: this.page.size
            }).then( res => {
                this.outboundOrderData = res
            })
        },
        
        // 终止任务
        suspensionOfExportEvent (sourceId, category) {
            suspensionOfExport({
                'sourceId': sourceId,
                'category': category
            }).then (res => {
                if (res.code == 200) {
                    this.$message.success (res.message)
                    this.getsearchOutboundOrderList ()

                }
            })
        },

        updataRouter () {
            if (this.$route.params && this.$route.params.relevancyId) {
                this.getQueryByIdFinalInventory (this.$route.params.relevancyId)
            }
        },

        
        // 复选框选中的数据
        selectChange (val) {
            this.multipleSelection = val
        },

        // 分页变化改动
        handlePaginationChange(val) {
            this.page = val;
            this.$nextTick(() => {
                this.getsearchOutboundOrderList ()
            });
        }

    },
    mounted() {
        this.getsearchOutboundOrderList()
    },
    components: {
        qqtTable: () => import('../../../../../components/qqt-subassembly/qqt-table/qqt-table')
    },
}
</script>

<style lang="scss" scoped>
    .search-outbound-order-page{
        margin-bottom: -20px;
    }
</style>