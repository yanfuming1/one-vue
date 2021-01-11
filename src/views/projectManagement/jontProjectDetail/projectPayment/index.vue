<template>
    <d2-container class="address-book project-common-in">
        <template slot="header">
            <div class="address-book-header">
                <determine-project title='工程款支付申请' :proId="proId"></determine-project>
                <project-common :fromArrive="fromArrive"></project-common>
                <span class="address-book-header___search">
                    <el-button type="primary" size="mini" class="address-book-header-button" v-if="$has('joint:payment:add')" @click="newReserve">添加</el-button>
                    <el-input
                        placeholder="请输入内容"
                        prefix-icon="el-icon-search"
                        v-model="queryInfo.name"
                        size="mini">
                    </el-input>
                    <span class="address-book-header___search">
                        <el-date-picker
                            v-model="selectTime"
                            type="datetimerange"
                            @change="getTime"
                            :unlink-panels="true"
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
                <span class="qqt-container-full-header-operation___right">
                    <p>办理状态:</p>
                    <div class="qqt-container-full-header-state___select">
                        <qqt-select :value="queryInfo.procState" :options="options" :size="'mini'" :placeholder="'请选择'" @select="queryInfo.procState = $event, searchModelSynopsis ()"></qqt-select>
                    </div>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <p>审核状态:</p>
                    <div class="qqt-container-full-header-state___select">
                        <qqt-select :value="queryInfo.state" :options="auditOptions" :size="'mini'" :placeholder="'请选择'" @select="queryInfo.state = $event, searchModelSynopsis ()"></qqt-select>
                    </div>
                </span>
                <!-- <el-button type="danger" size="mini" style="margin-right: 5px;" @click="listDel">批量删除</el-button> -->
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
            <div class="total">
                <p>
                    <span>累计已扣总金额: {{ Number (deducted).toFixed (2) || '0.00' }} 元</span>
                    <span>累计暂押总金额: {{ Number (detain).toFixed (2) || '0.00' }} 元</span>
                    <span>累计已支付金额: {{ Number (paid).toFixed (2) || '0.00' }} 元</span>
                    <span>当前剩余可支付金额: {{ Number (projectBalance).toFixed (2) || '0.00' }} 元</span>
                </p>
            </div>
            <qqt-table
                ref="table" 
                :exportData="exportData"
                :data="tableData"
                :rowHeader="rowHeader"
                :option="tableOption"
                :dynamicHeader="dynamicHeader"
                @selectionChange="selectChange"
                @page="handlePaginationChange"></qqt-table>
            <div class="total">
                <p>
                    <span>系统上线前累计已支付金额: {{ Number (baseMsg.prepaid).toFixed (2) || '0.00' }} 元</span>
                    <span>系统上线前累计已扣金额: {{ Number (baseMsg.deduct).toFixed (2) || '0.00' }} 元</span>
                    <span>系统上线前累计暂押金额: {{ Number (baseMsg.detain).toFixed (2) || '0.00' }} 元</span>
                    <span>系统上线前累计已到账金额: {{ Number (baseMsg.projectTotalMoney).toFixed (2) || '0.00' }} 元</span>
                    <span>系统上线前剩余可支付金额: {{ Number (baseMsg.projectBalance).toFixed (2) || '0.00' }} 元</span>
                </p>
            </div>
        </div>
    </d2-container>
</template>
<script>
import projectCommon from '../components/projectCommon'
import { mapActions } from 'vuex'
import { qqtTable, qqtSelect } from '../../../../components/qqt-subassembly'
import { projectPaymenSearchList,projectPaymenDeleteBatch,projectPaymenQueryById, projectPaymenCheckOrAgainst } from '../../../../api/jointProject/projectPayment/index'
import util from '../../../../libs/util'
import determineProject from '../components/determineProject'
export default {
    name: 'index',
    components: {
        qqtTable,
        qqtSelect,
        projectCommon,
        determineProject
    },
    data() {
        return {
            fromArrive: true,
            proId:'',
            queryInfo: {
                name: '',
                pageNo: '1',
                pageSize: '10',
                createTime: null,
                updateTime: null,
                projectId:'',
                procState: '',
                state: ''
            },
            tableData: {},
            dynamicHeader: {
                // tableId: 'T_1572505096',
                // isSave: true
            },
            options: [
                {
                    value: '1',
                    label: '初始化'
                },
                {
                    value: '2',
                    label: '待审批'
                },
                {
                    value: '3',
                    label: '审批中'
                },
                {
                    value: '4',
                    label: '已驳回'
                },
                {
                    value: '5',
                    label: '已作废'
                },
                {
                    value: '6',
                    label: '待提交'
                },
                {
                    value: '10',
                    label: '已完结'
                }
            ],
            auditOptions: [
                {
                    value: '0',
                    label: '未审核'
                },
                {
                    value: '1',
                    label: '已审核'
                }
            ],
            selectData: [],
            rowHeader:[
                {
                    prop: 'payMoney',
                    label: '本次支付金额',
                    isShow: true,
                    isMoney: true,
                    render: (h, parms) => {
                        return h('el-button', {
                            props:{
                                type: 'text',
                            },
                            on: {
                                click: () => {
                                    projectPaymenQueryById({ id: parms.row.id }).then(res => {
                                        this.$router.push({
                                            path: 'projectPaymentAdd',
                                            name: 'projectPaymentAdd',
                                            params: {
                                                isAdd: false,
                                                showDetail: true,
                                                paymentInfo: res,
                                            }
                                        })
                                    })
                                    this.$store.commit ('d2admin/page/titleSet', "工程款支付申请详情")
                                }
                            }
                        }, util.moneyTransform(parms.row.payMoney))
                    }
                },{
                    prop: 'deductMoney',
                    label: '本次扣除金额',
                    isShow: true,
                    isMoney: true,
                    render: ( h, parms) => {
                        return h ( 'span', {}, parms.row.deductMoney != 0 ? parms.row.deductMoney : '无')
                    }
                },{
                    prop: 'pledgeMoney',
                    label: '本次暂押金额',
                    isShow: true,
                    isMoney: true,
                    render: ( h, parms) => {
                        return h ( 'span', {}, parms.row.pledgeMoney != 0 ? parms.row.pledgeMoney : '无')
                    }
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
                        return h('span', {}, parms.row.agent ? parms.row.agent : '无')
                    }
                },{
                    prop: 'stateName',
                    label: '审核状态',
                    isShow: true,
                    render: (h, parms) => {
                        return h('span', {}, parms.row.stateName = parms.row.state === '1' ? '已审核' : '未审核')
                    }
                },{
                    prop: 'createName',
                    label: '申请人',
                    isShow: true,
                },{
                    prop: 'createTime',
                    label: '申请时间',
                    isShow: true,
                },{
                    prop: '',
                    label: '操作',
                    isShow: true,
                    render: (h, parms) => {
                        return [
                        h('el-button', {
                            attrs: {
                                type: 'text',
                                disabled: parms.row.procInstId === "" || parms.row.procState === '1' ? false : true
                            },
                            style:{
                                color: parms.row.procInstId === "" || parms.row.procState === '1' ? '#409EFF' : '#999',
                            },
                            on: {
                                click: () => {
                                    projectPaymenQueryById({ id: parms.row.id }).then(res => {
                                        this.$router.push({
                                            path: 'projectPaymentAdd',
                                            name: 'projectPaymentAdd',
                                            params: {
                                                isAdd: false,
                                                showDetail: false,
                                                paymentInfo: res,
                                            }
                                        })
                                        this.$store.commit ('d2admin/page/titleSet', "工程款支付申请编辑")
                                    })
                                }
                            }
                        },  this.$has('joint:payment:edit') ? "编辑" : ''),]
                        // h('el-button', {
                        //     attrs: {
                        //         type: 'text',
                        //         disabled: parms.row.procState === '1' ? false : true
                        //     },
                        //     style:{
                        //         color: parms.row.procState === '1' ? '#409EFF' : '#999',
                        //     },
                        //     on: {
                        //         click: () => {
                        //             this.$confirm('此操作将删除选择的内容, 是否继续?', '提示', {
                        //                 confirmButtonText: '确定',
                        //                 cancelButtonText: '取消',
                        //                 cancelButtonClass: "btn-custom-cancel",
                        //                 type: 'warning'
                        //             }).then(() => {
                        //                 projectPaymenDeleteBatch({
                        //                     ids: parms.row.id
                        //                 }).then(res => {
                        //                     this.$message.success("删除成功~~~")
                        //                     this.getTableData()
                        //                 })
                        //             })
                        //         }
                        //     }
                        // }, "删除")]
                    }
                },
            ],
            tableOption: {
                border: false,
                ignoreHeight: 120
            },
            selectTime: [],
            deducted: '',
            detain: '',
            paid: '',
            projectBalance: '',
            baseMsg: {
                prepaid: '',
                deduct: '',
                detain: '',
                projectTotalMoney: '',
                projectBalance: ''
            },
            exportData: [],
        }
    },
    methods: {
        ...mapActions('d2admin/db', [
            'database',
        ]),
        newReserve(){
            this.$router.push({
                path: 'projectPaymentAdd',
                name: 'projectPaymentAdd',
                params: {
                    isAdd: true,
                }
            })
        },
        searchModelSynopsis(){
            this.getTableData()
        },
        getTime(time){
            if(time){
                this.queryInfo.createTime = time[0]
                this.queryInfo.updateTime = time[1]
                this.getTableData()
            }
        },
        resetSearch(){
            this.queryInfo = {
                name: '',
                pageNo: '1',
                pageSize: '10',
                createTime: null,
                updateTime: null,
                procState: '',
                state: '',
                projectId: this.proId
            },
            this.selectTime = []
            this.getTableData()
        },
        listDel(){
            if(this.selectData.length === 0){
                this.$message.info("未选择删除的内容!!!")
                return false
            }
            this.$confirm('此操作将删除选择的内容, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let ids = ''
                this.selectData.forEach(item => {
                    ids += item.id + ','
                })
                ids = ids.substring(0, ids.length - 1)
                projectPaymenDeleteBatch({
                    ids: ids
                }).then(res => {
                    this.$message.success("删除成功~~~")
                    this.getTableData()
                })
            }).catch(() => {
                this.$message.info('已取消删除')
            });
        },
        selectChange(data){
            this.selectData = data
        },
        handlePaginationChange(page){
            this.queryInfo.pageNo = page.current
            this.queryInfo.pageSize = page.size
            this.getTableData()
        },
        getTableData(){
            projectPaymenSearchList(
                this.queryInfo
            ).then(res => {
                this.deducted = res.deducted
                this.detain = res.detain
                this.paid =  res.paid
                this.projectBalance = res.projectBalance
                this.tableData = res.res
                this.baseMsg = res.baseMsg
            })
        },
        uploadFun(){
            this.getExportData().then(res => {
                this.$refs.table.getExportExcel()
            })
        },
        printTable () {
            this.$refs.table.printTable (this.selectData)
        },
        getExportData () {
            this.exportData = JSON.parse(JSON.stringify((this.tableData.records))) || [];
            return new Promise((resolve, reject) => {
                this.exportData.forEach((item,index) => {
                    item.state = item.state === '1' ? '已审核' : '未审核'
                });
                resolve (true)
            });
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
                projectPaymenCheckOrAgainst (params).then(res => {
                    if(type === '1'){
                        this.$message.success("审核成功~~~")
                    } else {
                        this.$message.success("反审核成功~~~")
                    }
                    this.getTableData()
                })
            }
        }
    },
    async created () {
    },
    async mounted () {
        const db = await this.$store.dispatch('d2admin/db/database', {user: true})
        this.proId = db.get('proID').value()
        this.queryInfo.projectId = db.get('proID').value()
        this.getTableData()
    }
}
</script>
<style lang="scss">
.project-common-in{
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
            line-height: 22px !important;
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
        .qqt-container-full-header-operation___right {
            padding: 0 5px;
            p {
                display: inline-block;
            }
            .qqt-container-full-header-state___select {
                padding-left: 10px;
                width: 7%;
                // height: 30px;
                display:inline-block;
            }
            .el-date-editor.el-input, .el-date-editor.el-input__inner {
                width: 20%;
                height: 29px !important;
                .el-range-separator {
                width: 10% !important;
                }
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
    }
}
</style>
