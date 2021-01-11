<template>
    <d2-container>
        <div slot="header" class="purchase-warehousing-page">
            
            <el-form :inline="true" :model="form" ref="form" size="mini" @submit.native.prevent>
                <el-form-item v-if="$has ('material:scrap:apply:add')">
                    <el-button type="primary" @click="addscrapRecordEven">添加</el-button>
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
                <el-form-item v-if="$has ('material:scrap:apply:delete')">
                    <el-button type="primary" @click="batchDeleteEven">批量删除</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button-group>
                        <el-button size="mini" icon="el-icon-check" @click="isResignationApproval">审核</el-button>
                        <el-button size="mini" icon="el-icon-close" @click="unResignationApproval">反审核</el-button>
                    </el-button-group>
                </el-form-item>
                <el-form-item>
                    <el-button-group>
                        <el-button size="mini" @click="exportExcel" icon="el-icon-upload2">导出</el-button>
                        <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                    </el-button-group>
                </el-form-item>
            </el-form>
        </div>
        
        <div class="purchase-warehousing-conent">
            <qqt-table :data="scrapData" ref="table" :exportData="scrapData.records" :option="tableOption" :dynamicHeader="dynamicHeader" :rowHeader="rowHeader" @selectionChange="selectChange" @page="handlePaginationChange"></qqt-table>
        </div>
        
    </d2-container>
</template>


<script>
import { searchScrapRequestList, auditScrapRequest, delScrapRequest, deleteBatchScrapRequest } from '../../../../../api/materialEquipmentManagement/scrapManagement/scrapRecord'
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

            dialogVisible:false,

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

            scrapData: {
                records:[]
            },
            multipleSelection: [],
            tableOption: {
                border: true
            }, 
            dynamicHeader: {
                tableId: 'T_1095440192',
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
                    label: '报废申请单编号',
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
                                        path: 'scrapRecordInfo',
                                        name: 'scrapRecordInfo',
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
                    label: '报废申请单名称',
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
                                        path: 'scrapRecordInfo',
                                        name: 'scrapRecordInfo',
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
                    prop: 'alias',
                    label: '报废物品名称',
                    isShow:true,
                    width:'110'
                },
                {
                    prop: 'groupName',
                    label: '类型',
                    isShow:true,
                    width:'100'
                },
                {
                    prop: 'brandName',
                    label: '品牌',
                    isShow:true,
                    width:'100'
                },
                {
                    prop: 'specificationName',
                    label: '规格型号',
                    isShow:true,
                    width:'80',
                },
                {
                    prop: 'number',
                    label: '报废数量',
                    isShow:true,
                    width:'80',
                },
                {
                    prop: 'unitPrice',
                    label: '购买单价',
                    isShow:true,
                    width:'80',
                },
                {
                    prop: 'totalPrice',
                    label: '购买总价',
                    isShow:true,
                    width:'80',
                },
                {
                    prop: 'reason',
                    label: '报废原因',
                    isShow:true,
                    width:'120',
                },
                {
                    prop: 'process',
                    label: '处理结果',
                    isShow: true,
                    width:'100',
                    render: (h,params) =>{
                        return h('div',{
                            
                        }, params.row.process = params.row.processMethod == '1' ? '就地销毁' : '从仓库报废')
                    }
                },
                {
                    prop: 'procStateName',
                    label: '办理状态',
                    isShow:true,
                    render: (h,params) =>{
                        return h('div',{

                        }, params.row.procStateName = util.handleState(params.row.procState))
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
                    isShow: true,
                    width:'100'
                },
                {
                    prop: 'createName',
                    label: '申请人',
                    isShow: true,
                    width:'100'
                },
                {
                    prop: 'applytime',
                    label: '申请时间',
                    isShow: true,
                    width:'100'
                },
                {
                    prop: "",
                    label: "操作",
                    isShow: true,
                    width: '110',
                    fixed: 'right',
                    render:(h, params) => {
                        return [
                            this.$has ('material:scrap:apply:edit') ? h ("el-button",{
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
                                    click: (index, row) => {
                                        this.rowData = params.row
                                        this.transform.isShowDetails = false
                                        this.$router.push({
                                            path: 'scrapRecordInfo',
                                            name: 'scrapRecordInfo',
                                            params: {
                                                transform: this.transform,
                                                relevancyId: params.row.id
                                            }
                                        })
                                    }
                                }
                            },"编辑") : '',
                            this.$has ('material:scrap:apply:delete') ? h ("el-button",{
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
                                        util.confirm('确定删除此条报废记录吗？').then(res => {
                                            if (res) {
                                                delScrapRequest({ id: params.row.id }).then(response => {
                                                    this.$message.success("删除成功")
                                                    this.getSearchScrapRequestList()
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

        addscrapRecordEven () {
            this.$router.push({
                path: 'scrapRecordInfo',
                name: 'scrapRecordInfo'
            })
        },

        // 搜索
        dataSearch () {
            this.dialogVisible = true
            this.getSearchScrapRequestList ({
                'name': this.form.keywords ? this.form.keywords : null,
                'createTime': this.createDate ? this.createDate[0] : null,
                'updateTime':this.createDate ? this.createDate[1] : null
            })
        },

        // 重置
        resetBtn () {
            this.form.keywords = ''
            this.createDate = []
            this.getSearchScrapRequestList ()
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
                    util.confirm('确定删除被选中的报废记录吗？').then(res => {
                        if (res) {
                            deleteBatchScrapRequest({ ids: ids }).then(response => {
                                this.$message.success("删除成功")
                                this.getSearchScrapRequestList()
                            })
                        } else {
                            this.$message.info('取消删除');
                        }
                    })
                }
            }
        },

        exportExcel () { 
            this.$refs.table.getExportExcel ()
        },

        // 初始化加载数据
        getSearchScrapRequestList (item) {
            searchScrapRequestList({
                ...item,
                pageNo: this.page.current,
                pageSize: this.page.size
            }).then( res => {
                this.scrapData = res
            })
        },

        // 复选框选中的数据
        selectChange (val) {
            this.multipleSelection = val
        },

        printTable () {
            this.$refs.table.printTable (this.multipleSelection)
        },

        // 分页变化改动
        handlePaginationChange(val) {
            this.page = val;
            this.$nextTick(() => {
                this.getSearchScrapRequestList ()
            });
        },

        isResignationApproval () {
            if ( this.multipleSelection.length === 1) {
                if (this.multipleSelection[0].state === '0') {
                    this.$confirm('您是否要审核该条数据', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        auditScrapRequest({
                            id: this.multipleSelection[0].id,
                            type: '1'
                        }).then(res=> {
                        if (res.success) {
                            this.$message.success('审核成功');
                        } else {
                            this.$message.error(res.message);
                        }
                        this.getSearchScrapRequestList ();
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

        unResignationApproval () {
            if (this.multipleSelection.length === 1) {
                if (this.multipleSelection[0].state === '1') {
                    this.$confirm('您是否要反审核该条数据', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        auditScrapRequest({
                            id: this.multipleSelection[0].id,
                            type: '0'
                        }).then(res=> {
                            if (res.success) {
                                this.$message.success('反审核成功');
                            } else {
                                this.$message.error(res.message);
                            }
                                this.getSearchScrapRequestList();
                            })
                    })

                } else {
                this.$message.error('该数据未审核不支持继续反审核');
                }
            } else if (this.multipleSelection.length === 0) {
                this.$message.error('请选择要审核的数据');
            } else {
                this.$message.error('只支持单条数据操作');
            }
        },

    },
    mounted() {
        this.getSearchScrapRequestList()
    },
    components: {
        qqtTable: () => import('../../../../../components/qqt-subassembly/qqt-table/qqt-table')
    },
}
</script>

<style lang="scss" scoped>
    .purchase-warehousing-page{
        margin-bottom: -20px;
    }
    .resignation-application{
        box-shadow: 0 2px 12px 0 $color-border-shadow;
        background: $color-bg3;
        height: 102%;
        margin-top: -15px
    }
</style>