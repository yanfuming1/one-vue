<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header-operation___left" v-if="$has ('material:rental:contract:add')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addMaterialDepot">添加</el-button>
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
                <span class="qqt-container-full-header-operation___right" v-if="$has ('material:rental:contract:delete')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deleteBatchMaterialDepotData">批量删除</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right" v-if="$has ('material:rental:order:add')">
                    <el-button-group>
                        <el-button size="mini" icon="el-icon-check" type="success" @click="createOrder">生成出租单</el-button>
                    </el-button-group>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                        <el-button size="mini" icon="el-icon-upload2" @click="uploadFun">导出</el-button>
                        <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                    </el-button-group>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                        <el-button size="mini" icon="el-icon-check" @click="checkAgainstPurchaseRequestData ('1')">审核</el-button>
                        <el-button size="mini" icon="el-icon-close" @click="checkAgainstPurchaseRequestData ('0')">反审核</el-button>
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
import { rentalContractList, rentalContractDel, rentalContractCheck } from '../../../../api/materialEquipmentManagement/rentOutManagement/rentOutContract/index'
export default {
    components: {
        qqtTable
    },
    data () {
        return {
            tableData: {records:[]},
            rowHeader: [
                {
                    prop: 'rentalContractNumber',
                    label: '出租合同编号',
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
                                    this.routerLink('rentOutContractAdd', { relevancyId: parms.row.id, transform: this.transform}, '出租合同详情')
                                }
                            }
                        }, parms.row.rentalContractNumber)
                    }
                },{
                    prop: 'rentalContractName',
                    label: '出租合同名称',
                    width: '200',
                    isShow: true,
                },{
                    prop: 'rentalName',
                    label: '出租材料名称',
                    width: '150',
                    isShow: true,
                },{
                    prop: 'rentalType',
                    label: '物资类型',
                    width: '150',
                    isShow: true,
                    render: (h, parms) => {
                        return h('p', {}, parms.row.rentalType)
                    }
                },{
                    prop: 'lessor',
                    label: '出租方',
                    width: '150',
                    isShow: true,
                },{
                    prop: 'tenantry',
                    label: '承租方',
                    width: '100',
                    isShow: true,
                },{
                    prop: 'contractAmount',
                    label: '合同金额',
                    width: '150',
                    isMoney: true,
                    isShow: true,
                },{
                    prop: 'procStateName',
                    label: '办理状态',
                    width: '100',
                    isShow: true,
                    render: (h, parms) => {
                        return h('span', {}, parms.row.procStateName = util.handleState(parms.row.procState))
                    }
                },{
                    prop: 'stateName',
                    label: '办理状态',
                    width: '100',
                    isShow: true,
                    render: (h, parms) => {
                        return h('span', {}, parms.row.stateName = parms.row.state === '1' ? '已审核' : '未审核' )
                    }
                },{
                    prop: 'rentalStatusName',
                    label: '是否已生成出租单',
                    width: '130',
                    isShow: true,
                    render: (h, parms) => {
                        return h('span', {
                            style: { color: parms.row.rentalStatus === '0' ? '#f56c6c' : '#67c23a' }
                        }, parms.row.rentalStatusName = parms.row.rentalStatus === '0' ? '否' : '是')
                    }
                },{
                    prop: 'createName',
                    label: '申请人',
                    width: '100',
                    isShow: true,
                },{
                    prop: 'dateSigning',
                    label: '合同签订时间',
                    width: '150',
                    isShow: true,
                },{
                    prop: '',
                    label: '操作',
                    isShow: true,
                    fixed: 'right',
                    width: '150',
                    render: (h, parms) => {
                        return [
                            h('el-button', {
                                props:{ type: 'text', disabled: parms.row.procState === '1' ? false : true },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = false
                                        this.routerLink('rentOutContractAdd', { relevancyId: parms.row.id, isAdd:false, transform: this.transform}, '出租合同编辑')
                                    }
                                }
                            }, this.$has ('material:rental:contract:edit') ? '编辑' : ''),
                            h('el-button', {
                                props:{ type: 'text', disabled: parms.row.procState === '1' ? false : true},
                                on:{
                                    click: () => {
                                        util.confirm('确定删除此项内容吗？').then(res => {
                                            if(res) {
                                                rentalContractDel({ ids: parms.row.id }).then(response => {
                                                    this.$message.success("删除成功~~~")
                                                    this.getTableList()
                                                })
                                            }
                                        })
                                    }
                                }
                            }, this.$has ('material:rental:contract:delete') ? '删除' : ''),
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
        addMaterialDepot () {
            this.transform.isShowDetails = false
            this.routerLink('rentOutContractAdd', { isAdd : true, showDetail: false, transform: this.transform}, '出租合同添加')
        },
        createOrder () {
            switch(this.selectData.length) {
                case 0 :
                    this.$message.warning("请选择生成订单的合同!!!")
                    break
                case 1 :
                    if(this.selectData[0].procState === '10' && this.selectData[0].rentalStatus === '0') {
                        this.transform.isShowDetails = false
                        this.routerLink('rentOutOrderAdd', { contractId: this.selectData[0].id, isAdd : true, transform: this.transform}, '新增出租订单')
                    } else {
                        this.$message.warning(this.selectData[0].rentalStatus === '1' ? "该出租合同已经生成订单，请重新选择!!!" : "只有完结的出租合同才可以生成订单!!!")
                    }
                    break
                default :
                    this.$message.warning('只能选择一个合同生成订单!!!')
            }
        },
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
                        let canDel = true
                        this.selectData.forEach(item => {
                            if(item.procState !== '1') {
                                canDel = false
                            }
                        })
                        if(canDel) {
                            let ids = ''
                            this.selectData.forEach(item => {
                                ids += item.id + ','
                            })
                            ids = ids.substring(0, ids.length - 1)
                            rentalContractDel({ ids: ids }).then(response => {
                                this.$message.success("删除成功~~~")
                                this.getTableList()
                            })
                        } else {
                            this.$message.warning("选择的内容含有在流程中或者已完结的，不可删除!!!")
                        }
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
                    item.state = item.state === '1' ? '已审核' : '未审核'
                    item.procState = util.handleState(item.procState)
                    item.contractAmount = util.moneyTransform(item.contractAmount)
                    item.rentalStatus = item.rentalStatus === '0' ? '否' : '是'
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
        checkAgainstPurchaseRequestData(type) {
            // 审核反审核
            switch(this.selectData.length) {
                case 0:
                    this.$message.warning("请选择内容!!!")
                    break
                case 1:
                    if(this.selectData[0].state === type) {
                        this.$message.warning(type === '1' ? '选择的内容已审核!!!' : '已选择的内已反审核!!!')
                    } else {
                        rentalContractCheck({
                            id: this.selectData[0].id,
                            type: type
                        }).then(res => {
                            this.$message.success(type === '1' ? '审核成功~~~' : '反审核成功~~~')
                            this.getTableList()
                        })
                    }
                    break
                default:
                    this.$message.warning("只能选择一个进行操作!!!")
                    break
            }
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
            rentalContractList(this.pageInfo).then(res => {
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