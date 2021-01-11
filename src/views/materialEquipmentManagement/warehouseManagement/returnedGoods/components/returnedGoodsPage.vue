<template>
    <d2-container>
        <div slot="header" class="returned-goods-page">
            <el-form :inline="true" :model="form" ref="form" size="mini" @submit.native.prevent>
                <el-form-item v-if="$has ('material:warehouse:alteration:add')">
                    <el-button type="primary" @click="addReturnedGoods">添加</el-button>
                </el-form-item>
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
                        @change="dataSearch()"
                        :default-time="['08:00:00', '18:00:00']"
                        align="right">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button-group>
                        <el-button size="mini" @click="" icon="el-icon-upload2" @click="exportExcel">导出</el-button>
                        <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button> 
                    </el-button-group>
                </el-form-item>
            </el-form>
        </div>
        
        <div class="purchase-warehousing-conent">
            <qqt-table ref="table" :exportData="returnedGoodsData.records" :data="returnedGoodsData" :option="tableOption" :dynamicHeader="dynamicHeader" :rowHeader="rowHeader" @selectionChange="selectChange" @page="handlePaginationChange"></qqt-table>
        </div>
        
    </d2-container>
</template>


<script>
import { searchReturnedGoodsList, delReturnedGoods } from '../../../../../api/materialEquipmentManagement/warehouseManagement/returnedGoods'
import util from '@/libs/util.js'
export default {
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

            returnedGoodsData: {
                records: []
            },
            multipleSelection: [],
            tableOption: {
                border: true
            }, 
            dynamicHeader: {
                tableId: 'T_1095440161',
                isSave: false
            },
            page: {
                current: 1,
                size: 10,
                total: 0
            },
            isAdd:false,
            rowData:[],
            rowHeader: [
                {
                    prop: 'code',
                    label: '退换货单编号',
                    isShow:true,
                    width:'120',
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
                                    this.transform.isShowDetails = true
                                    this.$router.push({
                                        path: 'returnedGoodsInfo',
                                        name: 'returnedGoodsInfo',
                                        params: {
                                            procInstId: params.row.procInstId,
                                            transform: this.transform,
                                            relevancyId: params.row.id
                                        }
                                    })
                                }
                            }
                        }, params.row.code)
                    }
                },
                {
                    prop: 'name',
                    label: '退换货名称',
                    isShow:true,
                    width:'160',
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
                                    this.transform.isShowDetails = true
                                    this.$router.push({
                                        path: 'returnedGoodsInfo',
                                        name: 'returnedGoodsInfo',
                                        params: {
                                            procInstId: params.row.procInstId,
                                            transform: this.transform,
                                            relevancyId: params.row.id
                                        }
                                    })
                                }
                            }
                        }, params.row.name)
                    }
                },
                {
                    prop: 'categoryName',
                    label: '退换货类型',
                    isShow:true,
                    width:'100',
                    render: (h, params) => {
                        return h('div', {},
                            params.row.categoryName = params.row.category === '5' ? '换货' : '退货'
                        )
                    }
                },
                {
                    prop: 'storageStatusName',
                    label: '入库状态',
                    isShow:true,
                    width:'100',
                    render: (h, params) => {
                        return h('div', {},
                            params.row.storageStatusName = params.row.storageStatus === '1' ? '未入库' : '已入库'
                        )
                    }
                },
                
                {
                    prop: 'amount',
                    label: '物品总价',
                    isShow:true,
                    width:'100',
                },
                {
                    prop: 'createName',
                    label: '经办人',
                    isShow: true,
                    width:'120'
                },
                {
                    prop: 'departmentName',
                    label: '经办部门',
                    isShow: true,
                    width:'160'
                },
                {
                    prop: 'createTime',
                    label: '登记时间',
                    isShow:true,
                    width:'180',
                    sortable: true
                },
                {
                    prop: 'procStateName',
                    label: '办理状态',
                    isShow:true,
                    render: (h,params) =>{
                        return h('div',{

                        }, params.row.procStateName = util.handleState (params.row.procState))
                    }
                },
                {
                    prop: 'stateName',
                    label: '审核状态',
                    isShow:true,
                    width:'110',
                    render: (h,params) =>{
                        return h('div',{
                        
                        }, params.row.stateName = params.row.state == '0' ? '未审核' : '已审核')
                    }
                },
                {
                    prop: 'agent',
                    label: '待办人',
                    isShow:true,
                    width:'120',
                },
                {
                    prop: "",
                    label: "操作",
                    isShow: true,
                    fixed: 'right',
                    width: '150',
                    render:(h, params) => {
                        return [
                            this.$has ('material:warehouse:alteration:edit') ? h ("el-button",{
                                props: {
                                    type: "text"
                                },
                                attrs: {
                                    disabled: params.row.procState === '1' ? false : true
                                },
                                on: {
                                    click: (index, row) => {
                                        this.rowData = params.row
                                        this.transform.isShowDetails = false
                                        this.$router.push({
                                            path: 'returnedGoodsInfo',
                                            name: 'returnedGoodsInfo',
                                            params: {
                                                transform: this.transform,
                                                relevancyId: params.row.id
                                            }
                                        })
                                    }
                                }
                            },"编辑") : '',
                            this.$has ('material:warehouse:alteration:delete') ? h ("el-button",{
                                props: {
                                    type: "text"
                                },
                                attrs: {
                                    disabled: params.row.procState === '1' ? false : true
                                },
                                style:{
                                    color: params.row.procState === '1'? '#409EFF' : '#999',
                                },
                                on: {
                                    click: () => {
                                        util.confirm('确定删除此条退还记录吗？').then(res => {
                                            if (res) {
                                                delReturnedGoods({ id: params.row.id }).then(response => {
                                                    this.$message.success("删除成功")
                                                    this.getSearchReturnedGoodsList ()
                                                })
                                            } else {
                                                this.$message.info('取消删除');
                                            }
                                        })
                                    }
                                }
                            },"删除") : '',
                        ];
                    },
                },
            ],
        }
    },
    methods: {
        
        addReturnedGoods () {
            this.transform.isShowDetails = false
            this.$router.push({
                path:'returnedGoodsInfo',
                name:'returnedGoodsInfo',
                params: {
                    transform: this.transform
                }
            })
        },

        // 搜索
        dataSearch () {
            this.resetPage ()
            this.getSearchReturnedGoodsList ({
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
            this.getSearchReturnedGoodsList ()
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

        // 初始化加载数据
        getSearchReturnedGoodsList (item) {
            searchReturnedGoodsList({
                ...item,
                pageNo: this.page.current,
                pageSize: this.page.size
            }).then( res => {
                this.returnedGoodsData = res
            })
        },

        // 复选框选中的数据
        selectChange (val) {
            this.multipleSelection = val
        },

        // 分页变化改动
        handlePaginationChange(val) {
            this.page = val;
            this.$nextTick(() => {
                this.getSearchReturnedGoodsList ()
            });
        }

    },
    mounted() {
        this.getSearchReturnedGoodsList()
    },
    components: {
        qqtTable: () => import('../../../../../components/qqt-subassembly/qqt-table/qqt-table')
    },
}
</script>

<style lang="scss" scoped>
    .returned-goods-page{
        margin-bottom: -20px;
    }
    .resignation-application{
        box-shadow: 0 2px 12px 0 $color-border-shadow;
        background: $color-bg3;
        height: 102%;
        margin-top: -15px
    }
</style>