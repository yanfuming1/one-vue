<template>
    <d2-container class="address-book project-common-in">
        <template slot="header">
            <project-common :fromDeduct="fromDeduct"></project-common>
            <div class="address-book-header">
                <span class="address-book-header___search">
                    <el-button type="primary" v-if="canAdd && $has('joint:marginPayment:add')" size="mini" class="address-book-header-button" @click="newReserve">添加</el-button>
                    <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="queryInfo.name" size="mini"></el-input>
                    <span class="address-book-header___search">
                        <el-date-picker
                            v-model="selectTime"
                            type="datetimerange"
                            :picker-options="pickerOptions"
                            @change="getTime"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :default-time="['08:00:00', '18:00:00']"
                            align="right">
                        </el-date-picker>
                    </span>
                    <el-button type="primary" size="mini" class="address-book-header-button" @click="searchModelSynopsis">搜索</el-button>
                    <el-button type="info" size="mini" class="address-book-header-button" @click="resetSearch">重置</el-button>
                </span>
                <el-button-group style="margin-left: 10px;">
                    <el-button size="mini" @click="uploadFun" icon="el-icon-upload2">导出</el-button>
                    <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                </el-button-group>
                <el-button-group style="margin-left: 10px;">
                    <el-button size="mini" class="address-book-header-button" @click="checkProcess">审核</el-button>
                    <el-button size="mini" class="address-book-header-button" @click="backCheckProcess">反审核</el-button>
                </el-button-group>
            </div>
        </template>
        <div class="address-book-center">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="保证金缴纳" name="first">
                    <qqt-table
                        ref="table"
                        :exportData="exportData"
                        :data="tableData"
                        :rowHeader="rowHeader"
                        :option="tableOption"
                        :dynamicHeader="dynamicHeader1"
                        @selectionChange="selectChange"
                        @page="handlePaginationChange"></qqt-table>
                </el-tab-pane>
                <el-tab-pane label="保证金退还" name="second">
                    <div class="total">
                        <p>
                            <span>累计已扣总金额: {{ Number (deducted).toFixed (2) || '0.00' }} 元</span>
                            <!-- <span>累计暂押总金额: {{ Number (detain).toFixed (2) || '0.00' }} 元</span> -->
                            <span>累计支付总金额: {{ Number (paid).toFixed (2) || '0.00' }} 元</span>
                            <!-- <span>当前剩余可支付金额: {{ Number (projectBalance).toFixed (2) || '0.00' }} 元</span> -->
                        </p>
                    </div>
                    <qqt-table
                        ref="tableBack"
                        :exportData="exportData"
                        :data="tableData"
                        :rowHeader="rowHeaderBack"
                        :option="tableOption"
                        :dynamicHeader="dynamicHeader2"
                        @selectionChange="selectChange"
                        @page="handlePaginationChange"></qqt-table>
                </el-tab-pane>
            </el-tabs>
        </div>
    </d2-container>
</template>

<script>
import { queryDicById } from '../../../../api/system/dic/dic'
import { qqtTable } from '../../../../components/qqt-subassembly'
import projectCommon from '../components/projectCommon'
import fundDetermination from './components/fundDetermination.vue'
import { PROJECT_GETINFOID } from '../../../../enum/PROJECT'
import { getByAccountTypeListAll, marginPaymentSearch,getMarginPaymentlById,
        marginReturntSearch, getRefundById, marginPaymentDel,
        marginReturnDel, marginCheckOrAgainst, marginReturnCheckOrAgainst} from '../../../../api/jointProject/index'
import { mapActions } from 'vuex'
import util from '../../../../libs/util'
export default {
    name: "index",
    components: {
        qqtTable,
        projectCommon,
        fundDetermination
    },
    data () {
        return {
            fromDeduct: true,
            pickerOptions: {},
            canAdd: true,
            activeName: 'first',
            datetimerange: '',
            selectTime: [],
            tableData: {},
            dynamicHeader1: {
                // tableId: 'T_1572489938',
                // isSave: true
            },
            dynamicHeader2: {
                // tableId: 'T_1572489963',
                // isSave: true
            },
            rowHeader: [
                {
                    prop: 'marginCode',
                    label: '保证金编码',
                    isShow: true,
                },{
                    prop: 'marginType',
                    label: '保证金类型',
                    isShow: true,
                    render: (h, parms) => {
                        return h('el-button', {
                            props:{ type: 'text', },
                            on: {
                                click: () => {
                                    getMarginPaymentlById({ id: parms.row.id }).then(res => {
                                        this.$router.push({
                                            path: 'cashAdd',
                                            name: 'cashAdd',
                                            params: {
                                                isDetail: true,
                                                isAdd : false,
                                                cashType: this.cashType,
                                                cashInfo: res
                                            }
                                        })
                                        this.$store.commit ('d2admin/page/titleSet', '保证金缴纳详情')
                                    })
                                }
                            }
                        }, parms.row.marginType)
                    }
                },{
                    prop: 'premiumReceived',
                    label: '缴纳金额',
                    isShow: true,
                    isMoney: true,
                    isOpenSummary: true
                },{
                    prop: 'collectUnitAccount',
                    label: '收取单位户名',
                    isShow: true,
                },{
                    prop: 'matEndowment',
                    label: '公司垫付资金',
                    isShow: true,
                    isMoney: true,
                    render: (h, parms) => {
                        return h('span', {}, parms.row.matEndowment ? util.convertCurrency(parms.row.matEndowment) : '无')
                    }
                },{
                    prop: 'isRateName',
                    label: '是否计息',
                    isShow: true,
                    render: (h, parms) => {
                        return h('div', {
                        }, parms.row.isRateName = parms.row.isRate === "1" ? '是' : '否')
                    }
                },{
                    prop: 'dateValue',
                    label: '起息日期',
                    isShow: true,
                    // render: (h, parms) => {
                    //     return h('div', {
                    //     }, parms.row.isRate === "1" ? '是' : '否')
                    // }
                },{
                    prop: 'procStateName',
                    label: '办理状态',
                    isShow: true,
                    render: (h, parms) => {
                        return h('span', {}, parms.row.procStateName = util.handleState(parms.row.procState))
                    }
                },{
                    prop: 'agent',
                    label: '待办人',
                    isShow: true,
                    render: (h, parms) => {
                        return h('span', {}, parms.row.agent === '' ? '无' : parms.row.agent)
                    }
                },{
                    prop: 'stateName',
                    label: '审核状态',
                    isShow: true,
                    render: (h, parms) => {
                        return h('span', {}, parms.row.stateName = parms.row.state === '1' ? '已审核' : '未审核')
                    }
                },{
                    prop: 'marginStateName',
                    label: '保证金状态',
                    isShow: true,
                    render: (h, parms) => {
                        return h('div', {
                            style: {
                                color: parms.row.marginState === "0" ? 'red' : '#999'
                            }
                        }, parms.row.marginStateName = parms.row.marginState === "0" ? '未退回' : '已退回')
                    }
                },{
                    prop: 'createName',
                    label: '申请人',
                    isShow: true,
                    // render: (h, parms) => {
                    //     return h('span', {}, parms.row.state === '1' ? '已审核' : '未审核')
                    // }
                },{
                    prop: 'createTime',
                    label: '申请时间',
                    isShow: true,
                    // render: (h, parms) => {
                    //     return h('span', {}, parms.row.state === '1' ? '已审核' : '未审核')
                    // }
                },{
                    prop: '',
                    label: '操作',
                    isShow: true,
                    fixed: 'right',
                    width: '130',
                    render: (h, parms) => {
                        return [h('el-button', {
                                attrs: { type: 'text', disabled: parms.row.procState === '10' && parms.row.marginState === "0" ? false : true },
                                on: {
                                    click: () => {
                                        getMarginPaymentlById({ id: parms.row.id }).then(res => {
                                            res.marginCode= '自动生成'
                                            this.cashInfo = res;
                                            this.$router.push({
                                                path: 'cashReturns',
                                                name: 'cashReturns',
                                                params: {
                                                    cashInfo: res,
                                                    isAdd: true,
                                                    isDetail: false,
                                                }
                                            })
                                            this.$store.commit ('d2admin/page/titleSet', '保证金退还添加')
                                        })
                                    }
                                }
                            }, this.$has('joint:marginReturn:jointAdd') ? '退还' : '' ),
                            h('el-button', {
                                attrs: { type: 'text', disabled: parms.row.procState === "1" ? false : true },
                                on: {
                                    click: () => {
                                        getMarginPaymentlById({ id: parms.row.id }).then(res => {
                                            this.$router.push({
                                                path: 'cashAdd',
                                                name: 'cashAdd',
                                                params: {
                                                    isAdd : false,
                                                    cashInfo: res,
                                                    isDetail: false
                                                }
                                            })
                                            this.$store.commit ('d2admin/page/titleSet', '保证金缴纳编辑')
                                        })
                                    }
                                }
                            }, this.$has('joint:marginPayment:edit') ? '编辑' : '')
                        ]
                    }
                },
            ],
            rowHeaderBack: [
                {
                    prop: 'marginCode',
                    label: '保证金编码',
                    isShow: true,
                },
                {
                    prop: 'marginType',
                    label: '保证金类型',
                    isShow: true,
                    render: (h, parms) => {
                        return h('el-button', {
                            props:{ type: 'text', },
                            on: {
                                click: () => {
                                    getRefundById({ id: parms.row.id }).then(res => {
                                        this.$router.push({
                                            path: 'cashReturns',
                                            name: 'cashReturns',
                                            params: {
                                                collectUnitAccount: this.collectUnitAccount,
                                                isDetail: true,
                                                isAdd : false,
                                                returnInfo : res
                                            }
                                        })
                                        this.$store.commit ('d2admin/page/titleSet', '保证金退还详情')
                                    })
                                }
                            }
                        }, parms.row.marginType)
                    }
                },{
                    prop: 'surrenderValue',
                    label: '退还金额',
                    isShow: true,
                    isMoney: true,
                },{
                    prop: 'retreatUnitAccount',
                    label: '退还单位',
                    isShow: true,
                },{
                    prop: 'returnTheTime',
                    label: '退还时间',
                    isShow: true,
                },{
                    prop: 'procStateName',
                    label: '办理状态',
                    isShow: true,
                    render: (h, parms) => {
                        return h('span', {}, parms.row.procStateName = util.handleState(parms.row.procState))
                    }
                },{
                    prop: 'agent',
                    label: '待办人',
                    isShow: true,
                    render: (h, parms) => {
                        return h('span', {}, parms.row.agent === '' ? '无' : parms.row.agent)
                    }
                },{
                    prop: 'stateName',
                    label: '审核状态',
                    isShow: true,
                    render: (h, parms) => {
                        return h('span', {}, parms.row.stateName = parms.row.state === '1' ? '已审核' : '未审核')
                    }
                },
                {
                    prop: 'createName',
                    label: '申请人',
                    isShow: true
                },{
                    prop: 'createTime',
                    label: '申请时间',
                    isShow: true
                },{
                    prop: '',
                    label: '操作',
                    isShow: true,
                    fixed: 'right',
                    width: '100',
                    render: (h, parms) => {
                        return [h('el-button', {
                            attrs: { type: 'text', disabled: parms.row.procState === '1' ? false : true },
                            style:{ color: parms.row.procState === '1' ? '#409EFF' : '#999', },
                            on: {
                                click: () => {
                                    getRefundById({ id: parms.row.id }).then(res => {
                                        this.$router.push({
                                            path: 'cashReturns',
                                            name: 'cashReturns',
                                            params: {
                                                collectUnitAccount: this.collectUnitAccount,
                                                isDetail: false,
                                                isAdd : false,
                                                returnInfo : res
                                            }
                                        })
                                        this.$store.commit ('d2admin/page/titleSet', '保证金退还编辑')
                                    })
                                }
                            }
                        }, this.$has('joint:marginReturn:jointEdit') ? '编辑' : '')]
                    },
                }
            ],
            tableOption: {
                border: false,
                isOpenSummary: true
            },
            queryInfo: {
                endDate: null,
                id: '',
                name: '',
                pageNo: '1',
                pageSize: '10',
                startDate: null
            },
            proId: '',
            selectData: [],
            exportData:[],
            deducted: '',
            paid: '',
        }
    },
    methods: {
        ...mapActions('d2admin/db', [
            'database',
        ]),
        newReserve(){
            this.$router.push({
                path: 'cashAdd',
                name: 'cashAdd',
                params: {
                    isAdd : true,
                }
            })
            this.$store.commit ('d2admin/page/titleSet', '保证金缴纳添加')
        },
        searchModelSynopsis() {
            this.getTableData()
        },
        resetSearch () {
            this.selectTime = []
            this.queryInfo = {
                endDate: null,
                id: '',
                name: '',
                pageNo: '1',
                pageSize: '10',
                startDate: null
            }
            this.getTableData()
        },
        listDel() {
            let ids = ''
            this.selectData.forEach(item => {
                ids += item.id + ','
            })
            ids = ids.substring(0, ids.length - 1)
            this.$confirm('确认删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                cancelButtonClass: "btn-custom-cancel",
                type: 'warning'
            }).then(() => {
                if(this.activeName === 'first'){
                    marginPaymentDel({
                        id: this.proId,
                        ids: ids
                    }).then(res => {
                        this.$message.success("删除成功~~~")
                        this.getTableData()
                    })
                }else{
                    marginReturnDel({
                        id: this.proId,
                        ids: ids
                    }).then(res => {
                        this.$message.success("删除成功~~~")
                        this.getTableData()
                    })
                }
            })
        },
        getTime(data) {
            if(data){
                this.queryInfo.startDate = data[0]
                this.queryInfo.endDate = data[1]
                this.getTableData()
            }
        },
        selectChange(data) {
            this.selectData = data
        },
        handlePaginationChange(page){
            this.queryInfo.pageNo = page.current
            this.queryInfo.pageSize = page.size
            this.getTableData()
        },
        handleClick (data) {
            this.canAdd = this.activeName === 'first' ? true : false
            this.resetSearch()
        },
        getTableData(){
            this.queryInfo.id = this.proId
            if(this.activeName === 'first'){
                marginPaymentSearch(
                    this.queryInfo
                ).then(res => {
                    this.tableData = res
                })
            } else {
                marginReturntSearch(
                    this.queryInfo
                ).then(res => {
                    this.tableData = res.mrp
                    this.deducted = res.bigDecimal2
                    this.paid = res.bigDecimal
                })
            }
        },
        checkProcess () {
            this.checkOption('1')
        },
        backCheckProcess () {
            this.checkOption('0')
        },
        checkOption (type) {
            if(this.selectData.length === 0){
                if(type === '0'){
                    this.$message.warning("请选择反审核的内容!!!")
                }else {
                    this.$message.warning("请选择审核的内容!!!")
                }
            } else if(this.selectData.length > 1){
                this.$message.warning("只能选择一条内容进行审核!!!")
            } else {
                switch(type){
                    case '1':
                        if(this.selectData[0].state === '1'){
                            this.$message.warning("选择的内容已经审核,请重新选择!!!")
                            return false
                        }
                        break
                    case '0':
                        if(this.selectData[0].state === '0'){
                            this.$message.warning("选择的内容已反审核,请重新选择!!!")
                            return false
                        }
                        break
                }
                let params = {
                    id: this.selectData[0].id,
                    type: type
                }
                let action = this.activeName === 'first' ? marginCheckOrAgainst : marginReturnCheckOrAgainst
                action (params).then(res => {
                    if(type === '1'){
                        this.$message.success("审核成功~~~")
                    } else {
                        this.$message.success("反审核成功~~~")
                    }
                    this.getTableData()
                })
            }
        },
        uploadFun(){
            this.getExportData().then(res => {
                if(this.activeName === 'first'){
                    this.$refs.table.getExportExcel()
                }else {
                    this.$refs.tableBack.getExportExcel()
                }
            })
        },
        printTable () {
            let table = this.activeName == 'first' ? 'table' : 'tableBack'
            this.$refs[table].printTable (this.selectData)
        },
        getExportData () {
            this.exportData = JSON.parse(JSON.stringify((this.tableData.records))) || [];
            return new Promise((resolve, reject) => {
                this.exportData.forEach((item,index) => {
                    item.procState = util.handleState(item.procState)
                    item.state = item.state === '1' ? '已审核' : '未审核'
                    item.isRate = item.isRate === "1" ? '是' : '否'
                    item.marginState = item.marginState === "0" ? '未退回' : '已退回'
                });
                resolve (true)
            });
        },
    },
    async mounted () {
        const db = await this.$store.dispatch('d2admin/db/database', {user: true})
        this.proId = db.get('proID').value()
        this.getTableData()
    }
}
</script>

<style lang="scss">
.address-book.project-common-in{
    .d2-container-full__header{
        padding-bottom: 0px !important;
    }
    .address-book-header {
        .el-date-editor{
            width: 360px;
            height: 30px;
            margin-right: 10px;
            padding-right: 0px;
            .el-range-input{
                width: 38%;
            }
            .el-range-separator{
                width: 7%;
                line-height: 23px;
            }
            .el-range__icon{
                line-height: 20px;
            }
        }
        .el-date-editor .el-range__icon{
            line-height: 21px;
        }
        .el-input__icon.el-range__close-icon{
            line-height: 21px;
        }
        .address-book-header___search {
            .el-input {
                width: 10%;
                padding-right: 10px;
            }
            .el-date-editor--datetimerange{
                top: 0px;
            }
            .address-book-header-button{
                margin-right: 10px;
            }
        }
        .header-form{
            margin-top: 20px;
            .el-form-item{
                margin-bottom: 12px;
            }
            .bottom .el-form-item{
                margin-bottom: 0px;
            }
            .el-form-item__label{
                line-height: 35px;
            }
            .el-form-item__content{
                line-height: 35px;
                .el-input__inner{
                    height: 35px;
                }
            }
        }
    }
    .address-book-center {
        height: 100%;
        background: rgba($color: #FFF, $alpha: 0.5);
        .el-tabs{
            height: calc(100% - 50px);
            .el-tabs__header{
                margin-bottom: 0px;
                padding-top: 15px;
            }
            .el-tabs__nav{
                margin-left: 40px;
            }
            .el-tabs__content{
                height: 100%;
            }
        }
    }
}
.total{
    height: 40px;
    color: #2f74ff;
    line-height: 40px;
    font-size: 16px;
    background-color: #F7F7F7;
    padding-left: 20px;
    p{
        span{
            margin-right: 40px;
        }
    }
}
</style>
