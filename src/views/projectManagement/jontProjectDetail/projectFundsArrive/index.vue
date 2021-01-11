<template>
    <d2-container class="address-book project-common-in">
        <template slot="header">
            <project-common ref="projectCommon" :fromArrive="fromArrive"></project-common>
            <div class="address-book-header">
                <span class="address-book-header___search">
                    <el-button type="primary" size="mini" class="address-book-header-button" v-if="$has('joint:funds:add')" @click="newReserve">添加</el-button>
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
                    <el-button-group>
                        <el-button size="mini" @click="uploadFun" icon="el-icon-upload2">导出</el-button>
                        <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                    </el-button-group>
                    <!-- <el-button type="warning" :disabled="canAddBack" size="mini" class="address-book-header-button" @click="backHander">追加已到账金额及支付金额</el-button> -->
                </span>
                <!-- <el-button type="danger" size="mini" style="margin-right: 5px;" @click="listDel">批量删除</el-button> -->
            </div>
        </template>
        <div class="address-book-center">
            <div class="total">
                <p><span>工程款到账记录</span> <span class="left-money"><span>累计已到账工程款金额: {{ totalMoeny }} 元</span> <span>占合同金额: {{ totalPercent }} </span></span></p>
            </div>
            <qqt-table ref="table" :exportData="exportData" :data="tableData" :rowHeader="rowHeader" :option="tableOption" :dynamicHeader="dynamicHeader" @selectionChange="selectChange" @page="handlePaginationChange"></qqt-table>
        </div>
        <el-dialog v-dialogDrag title="追加已到账金额及已支付金额" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
            <el-form ref="moneyForm" :model="moneyForm" label-width="100px">
                <el-form-item label="已到账金额"><el-input v-model="moneyForm.totalMoney" @change="moneyChange"><template slot="append">元</template></el-input></el-form-item>
                <el-form-item label="已支付金额"><el-input v-model="moneyForm.prepaid" @change="moneyChange"><template slot="append">元</template></el-input></el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="backHanderSub">确 定</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </d2-container>
</template>
<script>
import projectCommon from '../components/projectCommon'
import newArrive from './components/newArrive'
import { qqtTable } from '../../../../components/qqt-subassembly'
import { getByAccountTypeListAll } from '../../../../api/jointProject/index'
import { projectFundsSearch, projectFundsQueryById, projectFundsDelete, projectFundsAdditional } from '../../../../api/jointProject/projectFund/index'
import { mapActions } from 'vuex'
import util from '../../../../libs/util'
export default {
    name: "name",
    components: {
        qqtTable,
        projectCommon,
        newArrive
    },
    data() {
        return {
            dialogVisible: false,
            pickerOptions: {},
            moneyForm: {
                prepaid: '',
                totalMoney: ''
            },
            fromArrive: true,
            fundInfo: {},
            isAdd: true,
            queryInfo: {
                name: '',
                pageNo: '1',
                pageSize: '10',
                projectId: '',
                startDate: '',
                endDate: ''
            },
            dynamicHeader: {
                // tableId: 'T_1572501509',
                // isSave: true
            },
            tableData: {},
            rowHeader: [
                {
                    prop: 'payUnit',
                    label: '付款单位名称',
                    width: 200,
                    isShow: true,
                    render: (h, parms) => {
                        return h('el-button', {
                            props:{
                                type: 'text',
                            },
                            on: {
                                click: () => {
                                    projectFundsQueryById({
                                        id: parms.row.id
                                    }).then(res => {
                                        this.$router.push({
                                            path: 'projectArriveAdd',
                                            name: 'projectArriveAdd',
                                            params: {
                                                isShowDetail : true,
                                                payUnit: this.payUnit,
                                                fundInfo: res
                                            }
                                        })
                                    })
                                }
                            }
                        }, parms.row.payUnit)
                    }
                },{
                    prop: 'openingBank',
                    label: '开户行',
                    width: 200,
                    isShow: true,
                },{
                    prop: 'accountNumber',
                    label: '账号',
                    width: 220,
                    isShow: true,
                },{
                    prop: 'arrivalMoney',
                    label: '本次到账金额(元)',
                    width: 180,
                    isShow: true,
                    isMoney: true,
                },{
                    prop: 'percent',
                    label: '占合同百分比',
                    width: 120,
                    isShow: true,
                },{
                    prop: 'arrivalDate',
                    label: '到账时间',
                    width: 160,
                    isShow: true,
                },{
                    prop: 'createName',
                    label: '登记人',
                    width: 120,
                    isShow: true,
                },{
                    prop: 'createTime',
                    width: 160,
                    label: '登记时间',
                    isShow: true,
                },{
                    prop: '',
                    label: '操作',
                    width: 100,
                    fixed: 'right',
                    isShow: true,
                    render: (h, parms) => {
                        return h('el-button', {
                            props:{ type: 'text', },
                            attrs:{ disabled: parms.row.state ==='1' ? true :false, },
                            on: {
                                click: () => {
                                    projectFundsQueryById({ id: parms.row.id }).then(res => {
                                        this.$router.push({
                                            path: 'projectArriveAdd',
                                            name: 'projectArriveAdd',
                                            params: {
                                                isAdd : false,
                                                payUnit: this.payUnit,
                                                fundInfo: res,
                                                isShowDetail: false
                                            }
                                        })
                                    })
                                }
                            }
                        },  this.$has('joint:funds:edit') ? '编辑' : '' )
                    }
                }
            ],
            tableOption: {
                border: false
            },
            arriveTitle: '添加',
            payUnit: [],
            totalMoeny: '',
            totalPercent: '',
            transform: {
                isShowDetails: false
            },
            selectData: [],
            canAddBack: false,
            exportData: [],
            selectTime: []
        }
    },
    methods: {
        ...mapActions('d2admin/db', [
            'database',
        ]),
        newReserve(){
            this.$router.push({
                path: 'projectArriveAdd',
                name: 'projectArriveAdd',
                params: {
                    isAdd : true,
                    payUnit: this.payUnit
                }
            })
        },
        searchModelSynopsis() {
            this.getTableData()
        },
        resetSearch () {
            this.queryInfo.name = ''
            this.queryInfo.pageNo = '1'
            this.queryInfo.pageSize = '10'
            this.queryInfo.startDate = null
            this.queryInfo.endDate = null
            this.selectTime = []
            this.getTableData()
        },
        getTime(data){
            if(data){
                this.queryInfo.startDate = data[0]
                this.queryInfo.endDate = data[1]
                this.getTableData()
            }
        },
        listDel() {
            if(this.selectData.length === 0){
                this.$message.info("未选择删除的内容!!!")
            }else{
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    cancelButtonClass: "btn-custom-cancel",
                    type: 'warning'
                }).then(() => {
                    let ids = ''
                    this.selectData.forEach(item => {
                        ids += item.id + ','
                    })
                    ids = ids.substring(0, ids.length - 1)
                    projectFundsDelete({
                        id: this.queryInfo.projectId,
                        ids: ids
                    }).then(res => {
                        this.$message.success("删除成功~~~")
                        this.getTableData()
                    })
                }).catch(() => {
                    this.$message.info('已取消删除')
                })
            }
        },
        selectChange(data) {
            this.selectData = data
        },
        handlePaginationChange(page) {
            this.queryInfo.pageNo = page.current
            this.queryInfo.pageSize = page.size
            this.getTableData()
        },
        getTableData() {
            projectFundsSearch(
                this.queryInfo
            ).then(res => {
                this.tableData = res.res
                this.totalMoeny = res.totalMoney
                this.totalPercent = res.percent
                this.canAddBack = res.res.records.length > 0 ? true : false
            })
        },
        handleClose (done) {
            done()
        },
        backHander () {
            this.moneyForm = {
                prepaid: '',
                totalMoney: ''
            }
            this.dialogVisible = true
        },
        backHanderSub () {
            this.moneyForm.projectId = this.queryInfo.projectId
            projectFundsAdditional(this.moneyForm).then(res => {
                this.$refs.projectCommon.getInfo()
                this.dialogVisible = false
            })
        },
        moneyChange () {
            if(this.moneyForm.prepaid !== '') {
                this.moneyForm.prepaid = this.moneyForm.prepaid.match(/^[\+\-]?\d*?\.?\d*?$/) ? parseFloat(this.moneyForm.prepaid).toFixed(2) : ''
            }
            if(this.moneyForm.totalMoney !== ''){
                this.moneyForm.totalMoney = this.moneyForm.totalMoney.match(/^[\+\-]?\d*?\.?\d*?$/) ? parseFloat(this.moneyForm.totalMoney).toFixed(2) : ''
            }
        },
        uploadFun () { 
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
                    item.procState = util.handleState(item.procState)
                    item.audit = item.audit === '1' ? '审核' : '未审核'
                });
                resolve (true)
            });
        },
    },
    async mounted() {
        const db = await this.$store.dispatch('d2admin/db/database', {user: true})
        this.queryInfo.projectId = db.get('proID').value()

        this.getTableData()
        // 获取付款单位银行账号信息
        getByAccountTypeListAll({
            accountType: '5'
        }).then(res => {
            this.payUnit = res
        })
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
        .total{
            height: 50px;
            color: #2f74ff;
            line-height: 50px;
            font-size: 16px;
            background-color: #F7F7F7;
            padding-left: 20px;
            p{
                span{
                    margin-right: 40px;
                }
                .left-money{
                    float: right;
                }
            }
        }
    }
}
</style>
