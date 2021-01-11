<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header-operation___left" v-if="$has('material:sell:contract:add')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addMaterialDepot">添加</el-button>
                </span>
                <span class="qqt-container-full-header___search">
                    <el-input placeholder="请输入内容"  prefix-icon="el-icon-search" v-model="pageInfo.name" size="mini"></el-input>
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
                <span class="qqt-container-full-header-operation___right" v-if="$has('material:sell:contract:delete')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deleteBatchMaterialDepotData">批量删除</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right" v-if="$has('material:sell:order:add')">
                    <el-button-group>
                        <el-button size="mini" icon="el-icon-check" type="success" @click="createSellOrder">生成出售单</el-button>
                    </el-button-group>
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
import { rentalReturnDel, rentalReturnPageList, } from '../../../../api/materialEquipmentManagement/rentOutManagement/rentOutReturn/index'
import { sellContractPageList, sellContractDel } from '../../../../api/materialEquipmentManagement/sellManagement/sellContract/index'
export default {
    components: {
        qqtTable
    },
    data () {
        return {
            tableData: {records:[]},
            rowHeader: [
                {
                    prop: 'contractcode',
                    label: '出售合同单号',
                    width: '160',
                    isShow: true,
                    render: (h, parms) => {
                        return h('el-button', {
                            props:{ type: 'text', },
                            on:{
                                click: () => {
                                    this.transform.isShowDetails = true
                                    this.routerLink('sellContractAdd', { relevancyId: parms.row.id, transform: this.transform}, '出售合同详情')
                                }
                            }
                        }, parms.row.contractcode)
                    }
                },{
                    prop: 'contractname',
                    label: '出售单名称',
                    width: '150',
                    isShow: true,
                },
                {
                    prop: 'goodsname',
                    label: '物品名称',
                    width: '120',
                    isShow: true,
                },{
                    prop: 'itemtype',
                    label: '物品类型',
                    width: '150',
                    isShow: true,
                },{
                    prop: 'number',
                    label: '数量',
                    width: '100',
                    isShow: true,
                },{
                    prop: 'buyer',
                    label: '买方',
                    width: '100',
                    isShow: true,
                },{
                    prop: 'seller',
                    label: '卖方',
                    width: '100',
                    isShow: true,
                },{
                    prop: 'contractMoney',
                    label: '合同金额(元)',
                    width: '150',
                    isMoney: true,
                    isShow: true,
                },{
                    prop: 'signtime',
                    label: '签订时间',
                    width: '180',
                    isShow: true,
                },{
                    prop: 'procState',
                    label: '办理状态',
                    width: '100',
                    isShow: true,
                    render: (h, parms) => {
                        return h('span', {}, parms.row.procStateName = util.handleState(parms.row.procState))
                    }
                },{
                    prop: 'agent',
                    label: '待办人',
                    width: '100',
                    isShow: true,
                    render: (h, parms) => {
                        return h('span', {}, parms.row.agent ? parms.row.agent : '无' )
                    }
                },{
                    prop: 'stateName',
                    label: '审核状态',
                    width: '100',
                    isShow: true,
                    render: (h, parms) => {
                        return h('span', {}, parms.row.stateName = parms.row.state === '1' ? '已审核' : '未审核' )
                    }
                },{
                    prop: 'isStatusName',
                    label: '是否已生成出售单',
                    width: '130',
                    isShow: true,
                    render: (h, parms) => {
                        return h('span', {
                            style: { color: parms.row.isStatus === '0' ? '#f56c6c' : '#67c23a' }
                        }, parms.row.isStatusName = parms.row.isStatus === '0' ? '否' : '是')
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
                    width: '120',
                    render: (h, parms) => {
                        return [
                            h('el-button', {
                                props:{ type: 'text', disabled: parms.row.procState === '1' ? false : true },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = false
                                        this.routerLink('sellContractAdd', { relevancyId: parms.row.id, transform: this.transform}, '出售合同编辑')
                                    }
                                }
                            }, this.$has('material:sell:contract:edit') ? '编辑' : ''),
                            h('el-button', {
                                props:{ type: 'text', disabled: parms.row.procState === '1' ? false : true },
                                on:{
                                    click: () => {
                                        util.confirm('确定删除此项内容吗？').then(res => {
                                            if(res) {
                                                sellContractDel({ ids: parms.row.id }).then(response => {
                                                    this.$message.success("删除成功~~~")
                                                    this.getTableList()
                                                })
                                            }
                                        })
                                    }
                                }
                            }, this.$has('material:sell:contract:delete') ? '删除' : ''),
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
            this.routerLink('sellContractAdd', { isAdd: true, transform: this.transform}, '出售合同添加')
        },
        createSellOrder () {
            // 审核反审核
            switch (this.selectData.length) {
                case 1:
                    if(this.selectData[0].procState === '10' && this.selectData[0].isStatus === '0' || this.selectData[0].isStatus === null) {
                        this.transform.isShowDetails = false
                        this.routerLink('sellOrderAdd', { isAdd: true, contractId: this.selectData[0].id, transform: this.transform}, '出售订单添加')
                    } else {
                        this.$message.warning(this.selectData[0].procState !== '10' ? "只有完结的出售申请才可以生成合同!!!" : "该出售申请已经生成合同，请重新选择!!!")
                    }
                    break
                case 0:
                    this.$message.warning("请选择生成合同的出售订单!!!")
                    break
                default:
                    this.$message.warning("只能选择一条内容生成合同!!!")
                    break
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
                    let ids = ''
                    this.selectData.forEach(item => {
                        ids += item.id + ','
                    })
                    ids = ids.substring(0, ids.length - 1)
                    sellContractDel({ ids: ids }).then(response => {
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
            sellContractPageList(this.pageInfo).then(res => {
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