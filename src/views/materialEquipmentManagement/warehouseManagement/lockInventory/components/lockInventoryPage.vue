<template>
<!-- 离职申请  -->
    <d2-container>
        <div slot="header" class="lock-inventory-page">
            <el-form :inline="true" :model="form" ref="form" size="mini" @submit.native.prevent>
                <el-form-item v-if="$has ('material:warehouse:lock:add')">
                    <el-button type="primary" @click="addLockInventoryEven">添加</el-button>
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
                        :default-time="['08:00:00', '18:00:00']"
                        @change="dataSearch()" 
                        align="right">
                    </el-date-picker>
                </el-form-item>
                <el-form-item v-if="$has ('material:warehouse:lock:delete')">
                    <el-button type="primary" @click="batchDeleteEven">批量删除</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button-group>
                        <el-button size="mini" icon="el-icon-check" @click="isResignationApproval">审核</el-button>
                    </el-button-group>
                </el-form-item>
                <el-form-item>
                    <el-button-group>
                        <el-button size="mini" @click="" icon="el-icon-upload2" @click="exportExcel">导出</el-button>
                        <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button> 
                    </el-button-group>
                </el-form-item>
            </el-form>
        </div>
        
        <div class="lock-inventory-page-conent">
            <qqt-table ref="table" :exportData="resignationApplicationData.records" :data="resignationApplicationData" :option="tableOption" :dynamicHeader="dynamicHeader" :rowHeader="rowHeader" @selectionChange="selectChange" @page="handlePaginationChange"></qqt-table>
        </div>
        
    </d2-container>
</template>


<script>
import { searchlockInventoryList, delLockInventory, auditLockLibrary, deleteBatchLockInventory, releaseInventory } from '../../../../../api/materialEquipmentManagement/warehouseManagement/lockInventory'
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

            resignationApplicationData: {},
            multipleSelection: [],
            tableOption: {
                border: true
            }, 
            dynamicHeader: {
                tableId: 'T_1195440192',
                isSave: true
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
                    label: '锁库单编号',
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
                                    this.transform.isShowDetails = true
                                    this.$router.push({
                                        path: 'lockInventoryInformation',
                                        name: 'lockInventoryInformation',
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
                    label: '锁库单名称',
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
                                    this.transform.isShowDetails = true
                                    this.$router.push({
                                        path: 'lockInventoryInformation',
                                        name: 'lockInventoryInformation',
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
                    prop: 'warehouseName',
                    label: '仓库名称',
                    isShow:true,
                },
                {
                    prop: 'warehouseSite',
                    label: '仓库地点',
                    isShow:true,
                },
                {
                    prop: 'amount',
                    label: '锁定物品总价',
                    isShow:true,
                },
                // {
                //     prop: 'state',
                //     label: '相关项目',
                //     isShow:true,
                //     width:'120'
                // },
                // {
                //     prop: 'agent',
                //     label: '标段',
                //     isShow:true,
                //     width:'100',
                // },
                {
                    prop: 'stateName',
                    label: '审核状态',
                    isShow:true,
                    render: (h,params) =>{
                        return h('div',{
                        
                        }, params.row.stateName = params.row.state == '0' ? '未审核' : '已审核')
                    }
                },
                {
                        prop: 'procStateName',
                        label: '办理状态',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {},
                                parms.row.procStateName = util.handleState (parms.row.procState)
                            )
                        }
                    },
                {
                    prop: 'agent',
                    label: '待办人',
                    isShow: true,
                },
                {
                    prop: 'createName',
                    label: '经办人',
                    isShow: true,
                },
                {
                    prop: 'lockTime',
                    label: '锁库日期',
                    isShow:true
                },
                {
                    prop: "",
                    label: "操作",
                    isShow: true,
                    width: '200px',
                    fixed: 'right',
                    render:(h, params) => {
                        return [
                            this.$has ('material:warehouse:lock:edit') ? h ("el-button",{
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
                                            path: 'lockInventoryInformation',
                                            name: 'lockInventoryInformation',
                                            params: {
                                                transform: this.transform,
                                                relevancyId: params.row.id
                                            }
                                        })
                                    }
                                }
                            },"编辑") : '',
                            this.$has ('material:warehouse:lock:delete') ? h ("el-button",{
                                props: {
                                    type: "text"
                                },
                                attrs: {
                                    disabled: params.row.procState === '1' ? false : true
                                },
                                on: {
                                    click: () => {
                                         util.confirm('确定删除此条锁库记录吗？').then(res => {
                                            if (res) {
                                                delLockInventory({ id: params.row.id }).then(response => {
                                                    this.$message.success("删除成功")
                                                    this.getsearchlockInventoryList()
                                                })
                                            } else {
                                                this.$message.info('取消删除');
                                            }
                                        })
                                    }
                                }
                            },"删除") : '',
                            this.$has ('material:warehouse:lock:release') ? h ("el-button",{
                                props: {
                                    type: "text"
                                },
                                attrs: {
                                    disabled: params.row.procState === '10' && params.row.lockState == '1' ? false : true
                                },
                                on: {
                                    click: () => {
                                        this.updataReleaseInventory (params.row.id)
                                    }
                                }
                            },"释放库存") : '',
                        ];
                    },
                },
            ],
        }
    },
    methods: {
        
        addLockInventoryEven () {
            this.$router.push({
                path: 'lockInventoryInformation',
                name: 'lockInventoryInformation',
                params: {
                    transform: this.transform
                }
            })
        },

        // 搜索
        dataSearch () {
            this.resetPage ()
            this.getsearchlockInventoryList ({
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
            this.getsearchlockInventoryList ()
        },

        // 初始化加载数据
        getsearchlockInventoryList (item) {
            searchlockInventoryList({
                ...item,
                pageNo: this.page.current,
                pageSize: this.page.size
            }).then( res => {
                this.resignationApplicationData = res
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
                this.getsearchlockInventoryList ()
            });
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
                    util.confirm('确定删除被选中的锁库记录吗？').then(res => {
                        if (res) {
                            deleteBatchLockInventory({ ids: ids }).then(response => {
                                this.$message.success("删除成功")
                                this.getsearchlockInventoryList()
                            })
                        } else {
                            this.$message.info('取消删除');
                        }
                    })
                }
            }
        },

        isResignationApproval () {
            if ( this.multipleSelection.length === 1) {
                if (this.multipleSelection[0].state === '0') {
                    this.$confirm('您是否要审核该条数据', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        auditLockLibrary({
                            id: this.multipleSelection[0].id,
                            type: '1'
                        }).then(res=> {
                        if (res.success) {
                            this.$message.success(res.message);
                        } else {
                            this.$message.error(res.message);
                        }
                        this.getsearchlockInventoryList ();
                        })
                    })
                } else {
                    this.$message.error('该数据已审核不支持继续审核');
                } 
            } else if (this.multipleSelection.length === 0) {
                this.$message.error('请选择要审核的数据');
            } else {
                this.$message.error('只支持单条数据操作');
            }
        },

        updataReleaseInventory (id) {
            releaseInventory ({'id': id}).then (() => {
                this.$message.success ('释放成功')
                this.getsearchlockInventoryList ()
            })
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

    },
    mounted() {
        this.getsearchlockInventoryList()
    },
    components: {
        qqtTable: () => import('../../../../../components/qqt-subassembly/qqt-table/qqt-table')
    },
}
</script>

<style lang="scss" scoped>
    .lock-inventory-page{
        margin-bottom: -20px;
    }
    // .lock-inventory-page-conent{
    //     box-shadow: 0 2px 12px 0 $color-border-shadow;
    //     background: $color-bg3;
    //     height: 100%;
    //     margin-top: -15px
    // }
</style>