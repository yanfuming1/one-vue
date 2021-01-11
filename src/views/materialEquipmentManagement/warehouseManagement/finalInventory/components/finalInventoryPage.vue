<template>
    <d2-container>
        <div slot="header" class="final-inventory-page">
            <el-form :inline="true" :model="form" ref="form" size="mini" @submit.native.prevent>
                <el-form-item v-if="$has ('material:warehouse:check:add')">
                    <el-button type="primary" @click="addFinalInventoryEven">添加</el-button>
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
                        align="right">
                    </el-date-picker>
                </el-form-item>
                <el-form-item v-if="$has ('material:warehouse:check:delete')">
                    <el-button type="primary" @click="batchDeleteEven">批量删除</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button-group>
                        <el-button size="mini" icon="el-icon-check" @click="toExamine(1)">审核</el-button>
                        <el-button size="mini" icon="el-icon-close" @click="toExamine(0)">反审核</el-button>
                        <el-button size="mini" @click="" icon="el-icon-upload2" @click="exportExcel" >导出</el-button>
                        <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button> 
                    </el-button-group>
                </el-form-item>
            </el-form>
        </div>
        
        <div class="purchase-warehousing-conent">
            <qqt-table ref="table" :exportData="finalInventoryData.records" :data="finalInventoryData" :option="tableOption" :dynamicHeader="dynamicHeader" :rowHeader="rowHeader" @selectionChange="selectChange" @page="handlePaginationChange"></qqt-table>
        </div>
        
    </d2-container>
</template>


<script>
    import { searchFinalInventoryList, deleteFinalInventory, deleteBatchFinalInventory, toExamineOperation } from '../../../../../api/materialEquipmentManagement/warehouseManagement/finalInventory'
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

            finalInventoryData: {
                records: []
            },
            multipleSelection: [],
            tableOption: {
                border: true
            }, 
            dynamicHeader: {
                tableId: 'T_1095440193',
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
                    label: '盘点编号',
                    isShow:true,
                    width:'150',
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
                                        path: 'finalInventoryInfo',
                                        name: 'finalInventoryInfo',
                                        params: {
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
                    label: '盘点名称',
                    isShow:true,
                    width:'150',
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
                                        path: 'finalInventoryInfo',
                                        name: 'finalInventoryInfo',
                                        params: {
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
                    prop: 'category',
                    label: '盘点类型',
                    isShow:true,
                    width:'120'
                },
                {
                    prop: 'startTime',
                    label: '开始日期',
                    isShow:true,
                    width:'120',
                },
                {
                    prop: 'endTime',
                    label: '结束日期',
                    isShow: true,
                    width:'180'
                },
                {
                    prop: 'createName',
                    label: '经办人',
                    isShow: true,
                    type: 'text'
                },
                {
                    prop: 'stateName',
                    label: '审核状态',
                    isShow: true,
                    type: 'text',
                    render: (h, params) => {
                        return h('div', {

                        }, params.row.stateName = params.row.state == '0' ? '未审核' : '已审核' )
                    }
                },
                {
                    prop: 'createTime',
                    label: '创建时间',
                    isShow: true,
                    type: 'text'
                },
                {
                    prop: "",
                    label: "操作",
                    isShow: true,
                    fixed: 'right',
                    width: '150',
                    render:(h, params) => {
                        return [
                            this.$has ('material:warehouse:check:edit') ? h ("el-button",{
                                props: {
                                    type: "text"
                                },
                                attrs: {
                                    disabled: params.row.procState === '10' ? true : false
                                },
                                on: {
                                    click: (index, row) => {
                                        this.rowData = params.row
                                        this.transform.isShowDetails = false
                                        this.$router.push({
                                            path: 'finalInventoryInfo',
                                            name: 'finalInventoryInfo',
                                            params: {
                                                transform: this.transform,
                                                relevancyId: params.row.id
                                            }
                                        })
                                    }
                                }
                            },"编辑") : '',
                            this.$has ('material:warehouse:check:delete') ? h ("el-button",{
                                props: {
                                    type: "text"
                                },
                                attrs: {
                                    disabled: params.row.procState === '10' ? true : false
                                },
                                on: {
                                    click: () => {
                                        util.confirm('确定删除此条盘点记录吗？').then(res => {
                                            if (res) {
                                                deleteFinalInventory({ id: params.row.id }).then(response => {
                                                    this.$message.success("删除成功")
                                                    this.getsearchFinalInventoryList()
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
        
        addFinalInventoryEven () {
            this.transform.isShowDetails = false
            this.$router.push({
                path: 'finalInventoryInfo',
                name: 'finalInventoryInfo',
                params: {
                    transform: this.transform
                }
            })
        },
        
        // 搜索
        dataSearch (boolean = true) {
            if (boolean) this.resetPage ()
            this.getsearchFinalInventoryList ({
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
            this.getsearchFinalInventoryList ()
        },

        // 批量删除
        batchDeleteEven () {
            let ids = ''
            if (this.multipleSelection.length == 0 ) {
               this.$message.warning("请选择至少一条数据")
            } else {
                if (this.multipleSelection.procState == '10'){
                    this.$message.warning('被选中的数据中有已提交，禁止删除')
                } else {
                    this.multipleSelection.forEach(item => {
                        ids += item.id + ','
                    })
                    ids = ids.substring(0, ids.length - 1)
                    util.confirm('确定删除被选中的盘点记录吗？').then(res => {
                        if (res) {
                            deleteBatchFinalInventory({ ids: ids }).then(response => {
                                this.$message.success("删除成功")
                                this.getsearchFinalInventoryList()
                            })
                        } else {
                            this.$message.info('取消删除');
                        }
                    })
                }
                
            }
        },

        // 初始化加载数据
        getsearchFinalInventoryList (item) {
            searchFinalInventoryList({
                ...item,
                'pageNo': this.page.current,
                'pageSize': this.page.size
            }).then( res => {
                this.finalInventoryData = res
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
                this.dataSearch (false)
            });
        },

        toExamine (sta) {
            if (this.multipleSelection.length != 1) {
                this.$message.warning("只支持单条数据操作")
                return
            }
            if (sta == this.multipleSelection[0].state && sta == '0') {
                this.$message.warning('该数据不支持反审核')
                return
            } else if (sta == this.multipleSelection[0].state && sta == '1') {
                this.$message.warning('该数据不支持审核')
                return
            }
            this.$confirm('您是否要审核该条数据', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                toExamineOperation({
                    id: this.multipleSelection[0].id,
                    type: sta
                }).then( res => {
                    this.$message.success(res.message)
                    this.getsearchFinalInventoryList ();
                })
            })
        },

        printTable () {
            this.$refs.table.printTable (this.multipleSelection)
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
    mounted() {
        this.getsearchFinalInventoryList()
    },
    components: {
        qqtTable: () => import('../../../../../components/qqt-subassembly/qqt-table/qqt-table')
    },
}
</script>

<style lang="scss" scoped>
    .final-inventory-page{
        margin-bottom: -20px;
    }
    .resignation-application{
        box-shadow: 0 2px 12px 0 $color-border-shadow;
        background: $color-bg3;
        height: 102%;
        margin-top: -15px
    }
</style>