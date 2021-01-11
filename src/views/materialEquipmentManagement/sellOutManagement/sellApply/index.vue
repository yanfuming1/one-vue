<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header-operation___left" v-if="$has('material:sell:apply:add')">
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
                <span class="qqt-container-full-header-operation___right" v-if="$has('material:sell:apply:delete')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deleteBatchMaterialDepotData">批量删除</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right" v-if="$has('material:sell:contract:add')">
                    <el-button-group>
                        <el-button size="mini" icon="el-icon-check" type="success" @click="createSellContract">生成出售合同</el-button>
                    </el-button-group>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                        <el-button size="mini" @click="uploadFun" icon="el-icon-upload2">导出</el-button>
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
import { sellApplyPageList, sellApplyDel, sellApplyCheckOrAgainst } from '../../../../api/materialEquipmentManagement/sellManagement/sellApply/index'
export default {
    components: {
        qqtTable
    },
    data () {
        return {
            tableData: {records:[]},
            rowHeader: [
                {
                    prop: 'applycode',
                    label: '出售申请单号',
                    width: '180',
                    isShow: true,
                    render: (h, parms) => {
                        return h('el-button', {
                            props:{
                                type: 'text',
                            },
                            on:{
                                click: () => {
                                    this.transform.isShowDetails = true
                                    this.routerLink('sellApplyAdd', { relevancyId: parms.row.id, transform: this.transform}, '出售申请详情')
                                }
                            }
                        }, parms.row.applycode)
                    }
                },{
                    prop: 'applyname',
                    label: '出售单名称',
                    width: '150',
                    isShow: true,
                },{
                    prop: 'goodsname',
                    label: '物品名称',
                    width: '150',
                    isShow: true,
                },{
                    prop: 'itemtype',
                    label: '物品类型',
                    width: '120',
                    isShow: true,
                    render: (h, parms) => {
                        return h('span', {}, parms.row.itemtype ? parms.row.itemtype : '无' )
                    }
                },{
                    prop: 'brandName',
                    label: '品牌',
                    width: '100',
                    isShow: true,
                },{
                    prop: 'specificationName',
                    label: '规格型号',
                    width: '120',
                    isShow: true,
                },{
                    prop: 'number',
                    label: '数量',
                    width: '80',
                    isShow: true,
                },{
                    prop: 'totalPrice',
                    label: '出售金额',
                    width: '120',
                    isShow: true,
                    isMoney: true,
                },{
                    prop: 'supplierName',
                    label: '供应商',
                    width: '100',
                    isShow: true,
                    render: (h, parms) => {
                        return h('span', {}, parms.row.supplierName ? parms.row.supplierName : '无' )
                    }
                },{
                    prop: 'procStateName',
                    label: '办理状态',
                    width: '100',
                    isShow: true,
                    render: (h, parms) => {
                        return h('span', {}, parms.row.procStateName = util.handleState(parms.row.procState) )
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
                    prop: 'createName',
                    label: '申请人',
                    width: '100',
                    isShow: true,
                },{
                    prop: 'createTime',
                    label: '申请日期',
                    width: '180',
                    isShow: true,
                },{
                    prop: '',
                    label: '操作',
                    isShow: true,
                    fixed: 'right',
                    width: '140',
                    render: (h, parms) => {
                        return [
                            h('el-button', {
                                props:{ type: 'text', disabled: parms.row.procState === '1' ? false : true },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = false
                                        this.routerLink('sellApplyAdd', { relevancyId: parms.row.id, transform: this.transform}, '出售申请编辑')
                                    }
                                }
                            }, this.$has('material:sell:apply:edit') ? '编辑' : ''),
                            h('el-button', {
                                props:{ type: 'text', disabled: parms.row.procState === '1' ? false : true },
                                on:{
                                    click: () => {
                                        util.confirm('确定删除此项内容吗？').then(res => {
                                            if(res) {
                                                sellApplyDel({ ids: parms.row.id }).then(response => {
                                                    this.$message.success("删除成功~~~")
                                                    this.getTableList()
                                                })
                                            }
                                        })
                                    }
                                }
                            }, this.$has('material:sell:apply:delete') ? '删除' : ''),
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
            this.routerLink('sellApplyAdd', { isAdd: true, transform: this.transform}, '出售申请添加')
        },
        selectChangeData (date) {
            this.pageInfo.createTime = date && date.length > 0 ? date[0] : ''
            this.pageInfo.updateTime = date && date.length > 0 ? date[1] : ''
            this.getTableList()
        },
        searchChangeData () {
            this.getTableList()
        },
        // 生成出库合同
        createSellContract () {
            // 审核反审核
            switch (this.selectData.length) {
                case 1:
                    if(this.selectData[0].procState === '10' && this.selectData[0].isStatus === '0' || this.selectData[0].isStatus === null) {
                        this.transform.isShowDetails = false
                        this.routerLink('sellContractAdd', { isAdd: true, applyId: this.selectData[0].id, transform: this.transform}, '出售合同添加')
                    } else {
                        this.$message.warning(this.selectData[0].procState !== '10' ? "只有完结的出售申请才可以生成合同!!!" : "该出售申请已经生成合同，请重新选择!!!")
                    }
                    break
                case 0:
                    this.$message.warning("请选择生成合同的出售申请!!!")
                    break
                default:
                    this.$message.warning("只能选择一条内容生成合同!!!")
                    break
            }
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
                        sellApplyDel({ ids: ids }).then(response => {
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
                    item.procState = util.handleState(item.procState)
                    item.totalPrice = util.moneyTransform(item.totalPrice)
                    item.agent = item.agent || '无'
                    item.supplierName = item.supplierName || '无'
                    item.itemtype = item.itemtype || '无'
                });
                resolve (true)
            });
        },
        checkAgainstPurchaseRequestData (type) {
            // 审核反审核
            switch (this.selectData.length) {
                case 1:
                    if (this.selectData[0].state === type) {
                        this.$message.warning(type === '1' ? '选择的内容已审核!!!' : '选择的内容已反审核!!!')
                    } else {
                        sellApplyCheckOrAgainst({
                            id: this.selectData[0].id,
                            type: type
                        }).then(res => {
                            this.$message.success(type === '1' ? '审核成功~~~' : '反审核成功~~~')
                            this.getTableList()
                        })
                    }
                    break
                case 0:
                    this.$message.warning("请选择要审核的出售申请!!!")
                    break
                default:
                    this.$message.warning("只能选择一条内容生成合同!!!")
                    break
            }
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
            sellApplyPageList(this.pageInfo).then(res => {
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