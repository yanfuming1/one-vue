<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header-operation___left" v-if="$has ('material:rental:application:add')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addMaterialDepot">添加</el-button>
                </span>
                <span class="qqt-container-full-header___search">
                    <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="pageInfo.name" size="mini"></el-input>
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
                <span class="qqt-container-full-header-operation___right" v-if="$has ('material:rental:application:delete')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deleteBatchMaterialDepotData">批量删除</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right" v-if="$has ('material:rental:contract:add')">
                    <el-button-group>
                        <el-button size="mini" icon="el-icon-check" type="success" @click="createContract">生成出租合同</el-button>
                    </el-button-group>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                        <el-button size="mini" icon="el-icon-upload2" @click="uploadFun">导出</el-button>
                        <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                    </el-button-group>
                </span>
                <span class="qqt-container-full-header-operation___right" v-if="$has ('material:rental:application:submit')">
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
import { rentalSearchPageList, rentalDeleteBatch, rentalCheckOrAgainst } from '../../../../api/materialEquipmentManagement/rentOutManagement/rentOutApply/index'
export default {
    components: {
        qqtTable
    },
    data () {
        return {
            exportData: [],
            tableData: {records:[]},
            rowHeader: [
                {
                    prop: 'rentalApplicationNumber',
                    label: '出租申请单编号',
                    width: '150',
                    isShow: true,
                    render: (h, parms) => {
                        return h('el-button', {
                            props:{
                                type: 'text',
                            },
                            on:{
                                click: () => {
                                    this.transform.isShowDetails = true
                                    this.routerLink('rentOutAdd', { relevancyId: parms.row.id, transform: this.transform}, '出租申请详情')
                                }
                            }
                        }, parms.row.rentalApplicationNumber)
                    }
                },{
                    prop: 'rentalApplicationName',
                    label: '出租申请单名称',
                    width: '200',
                    isShow: true,
                },{
                    prop: 'rentalName',
                    label: '出租材料名称',
                    width: '150',
                    isShow: true,
                },{
                    prop: 'pricingManner',
                    label: '出租方式',
                    width: '120',
                    isShow: true,
                    render: (h, parms) => {
                        return h('p', {}, parms.row.pricingManner)
                    }
                },{
                    prop: 'rentalBrand',
                    label: '品牌',
                    width: '100',
                    isShow: true,
                },{
                    prop: 'unitMeasurement',
                    label: '计量单位',
                    width: '90',
                    isShow: true,
                },{
                    prop: 'rentAmount',
                    label: '数量',
                    width: '100',
                    isShow: true,
                    render: (h, parms) => {
                        return h('p', {}, parms.row.rentAmount + parms.row.unitMeasurement)
                    }
                },{
                    prop: 'rentalUnitPrice',
                    label: '出租单价(元)',
                    width: '150',
                    isMoney: true,
                    isShow: true,
                },{
                    prop: 'rentalPrice',
                    label: '出租总价(元)',
                    width: '150',
                    isMoney: true,
                    isShow: true,
                },{
                    prop: 'tenantry',
                    label: '承租方',
                    width: '150',
                    isShow: true,
                },{
                    prop: 'tenantryContacts',
                    label: '联系人',
                    width: '150',
                    isShow: true,
                },{
                    prop: 'tenantryPhone',
                    label: '联系电话',
                    width: '150',
                    isShow: true,
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
                    prop: 'stateName',
                    label: '审核状态',
                    width: '100',
                    isShow: true,
                    render: (h, parms) => {
                        return h('span', {}, parms.row.stateName = parms.row.state === '0' ? '未审核' : '已审核' )
                    }
                },{
                    prop: 'rentalStatusName',
                    label: '是否已生成合同',
                    width: '100',
                    isShow: true,
                    render: (h, parms) => {
                        return h('span', {
                            style: { color: parms.row.rentalStatus === '1' ? '#409EFF' : 'red'}
                        }, parms.row.rentalStatusName = parms.row.rentalStatus === '1' ? '是' : '否' )
                    }
                },{
                    prop: 'createName',
                    label: '申请人',
                    width: '100',
                    isShow: true,
                },{
                    prop: 'createTime',
                    label: '申请日期',
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
                                        this.routerLink('rentOutAdd', { relevancyId: parms.row.id, transform: this.transform}, '出租申请编辑')
                                    }
                                }
                            }, this.$has ('material:rental:application:edit') ? '编辑' : ''),
                            h('el-button', {
                                props:{ type: 'text', disabled: parms.row.procState === '1' ? false : true},
                                on:{
                                    click: () => {
                                        util.confirm('确定删除此项内容吗？').then(res => {
                                            if(res){
                                                rentalDeleteBatch({ ids: parms.row.id }).then(response => {
                                                    this.$message.success("删除成功~~~")
                                                    this.getTableList()
                                                })
                                            }
                                        })
                                    }
                                }
                            }, this.$has ('material:rental:application:delete') ? '删除' : ''),
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
        }
    },
    methods: {
        addMaterialDepot () {
            this.transform.isShowDetails = false
            this.routerLink('rentOutAdd', { isAdd : true, showDetail: false, transform: this.transform}, '出租申请添加')
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
                let canDel = true
                this.selectData.forEach(item => {
                    if(item.procState !== '1') {
                        canDel = false
                    }
                })
                if(canDel) {
                    util.confirm('确定删除此项内容吗？').then(res => {
                        if(res) {
                            let ids = ''
                            this.selectData.forEach(item => {
                                ids += item.id + ','
                            })
                            ids = ids.substring(0, ids.length - 1)
                            rentalDeleteBatch({ ids: ids }).then(response => {
                                this.$message.success("删除成功~~~")
                                this.getTableList()
                            })
                        }
                    })
                } else {
                    this.$message.warning("选择的内容含有流程中的或者流程已经结束的内容，请重新选择!!!")
                }
            }
        },
        // 生成合同
        createContract () {
            switch (this.selectData.length) {
                case 1:
                    if(this.selectData[0].procState === '10' && this.selectData[0].rentalStatus === '0') {
                        this.transform.isShowDetails = false
                        this.routerLink('rentOutContractAdd', { applyId: this.selectData[0].id, isAdd : true, transform: this.transform }, '出租合同添加')
                    } else {
                        this.$message.warning(this.selectData[0].rentalStatus === '1' ? "该出租申请已经生成合同，请重新选择!!!" : "只有完结的出租申请才可以生成合同!!!")
                    }
                    break
                case 0:
                    this.$message.warning("请选择要生成合同的出租申请!!!")
                    break
                default:
                    this.$message.warning("只能选择一条生成合同!!!")
                    break
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
                    item.rentAmount += item.unitMeasurement
                    item.rentalStatus = item.rentalStatus === '1' ? '是' : '否'
                    item.procState = util.handleState(item.procState)
                    item.agent = item.agent || '无'
                    item.rentalUnitPrice = util.moneyTransform(item.rentalUnitPrice)
                    item.rentalPrice = util.moneyTransform(item.rentalPrice)
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
            switch (this.selectData.length) {
                case 1:
                    if (this.selectData[0].state === type) {
                        this.$message.warning(type === '1' ? '选择的内容已审核!!!' : '选择的内容已反审核!!!')
                    } else {
                        rentalCheckOrAgainst({
                            id: this.selectData[0].id,
                            type: type
                        }).then(res => {
                            this.$message.success(type === '1' ? '审核成功~~~' : '反审核成功~~~')
                            this.getTableList()
                        })
                    }
                    break
                case 0:
                    this.$message.warning("请选择要审核的出租申请!!!")
                    break
                default:
                    this.$message.warning("只能选择一条生成合同!!!")
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
            rentalSearchPageList(this.pageInfo).then(res => {
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