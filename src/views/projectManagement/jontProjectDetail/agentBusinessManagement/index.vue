<template>
    <d2-container class="address-book project-common-in">
        <template slot="header">
            <project-common :fromDeduct="fromDeduct"></project-common>
            <div class="address-book-header">
                <span class="address-book-header___search">
                    <el-button type="primary" size="mini" class="address-book-header-button" v-if="$has('joint:agentBusiness:add')" @click="newReserve">添加</el-button>
                    <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="queryInfo.name" size="mini"></el-input>
                    <span class="address-book-header___search">
                        <el-date-picker
                            v-model="selectTime"
                            type="datetimerange"
                            :picker-options="pickerOptions"
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
                <el-button type="danger" size="mini" style="margin-right: 10px;" v-if="$has('joint:agentBusiness:del')" @click="listDel">批量删除</el-button>
                <el-button-group style="margin-right: 10px;"> 
                    <el-button size="mini" @click="uploadFun" icon="el-icon-upload2">导出</el-button>
                    <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                </el-button-group>
                <el-button-group style="margin-right: 10px;">
                    <el-button size="mini" class="address-book-header-button" @click="checkProcess">审核</el-button>
                    <el-button size="mini" class="address-book-header-button" @click="backCheckProcess">反审核</el-button>
                </el-button-group>
            </div>
        </template>
        <div class="total">
            <p>
                <span>累计已扣总金额: {{ Number (deducted).toFixed (2) || '0.00' }} 元</span>
                <!-- <span>累计暂押总金额: {{ Number (detain).toFixed (2) || '0.00' }} 元</span> -->
                <span>累计支付总金额: {{ Number (paid).toFixed (2) || '0.00' }} 元</span>
                <!-- <span>当前剩余可支付金额: {{ Number (projectBalance).toFixed (2) || '0.00' }} 元</span> -->
            </p>
        </div>
        <div class="address-book-center">
            <qqt-table
                ref="table"
                :exportData="exportData"
                :data="tableData"
                :rowHeader="rowHeader"
                :option="tableOption"
                :dynamicHeader="dynamicHeader"
                @selectionChange="selectChange"
                @page="handlePaginationChange"></qqt-table>
        </div>
    </d2-container>
</template>
<script>
// import { getByAccountTypeListAll } from '../../../../api/jointProject/index'
import { agentBusinessList,agentBusinessQueryById,agentBusinessDeleteBatch,
        agentBusinessSearchList,agentBusinessCheckOrAgainst } from '../../../../api/jointProject/agentBusinessManagement/index'
import projectCommon from '../components/projectCommon'
import { qqtTable } from '../../../../components/qqt-subassembly'
import { mapActions } from 'vuex'
import util from '../../../../libs/util'
export default {
    name: 'index',
    components: {
        projectCommon,
        qqtTable
    },
    data () {
        return {
            fromDeduct: true,
            queryInfo: {
                name: '',
                pageNo: '1',
                pageSize: '10',
                projectId: '',
                createTime: null,
                updateTime: null
            },
            dynamicHeader: {
                // tableId: 'T_1572504765',
                // isSave: true
            },
            deducted: '',
            paid: '',
            tableData: {},
            rowHeader: [
                {
                    prop: 'totalMoney',
                    label: '名称',
                    isShow: true,
                    render: (h, parms) => {
                        return h('el-button', {
                            props:{
                                type: 'text',
                            },
                            on: {
                                click: () => {
                                    agentBusinessQueryById({
                                        id: parms.row.id
                                    }).then(res => {
                                        this.$router.push({
                                            path: 'newAgent',
                                            name: 'newAgent',
                                            params: {
                                                isAdd: false,
                                                isShowDetail: true,
                                                agentInfo: res
                                            }
                                        })
                                    })
                                }
                            }
                        },  '代收代付金额:[' + parms.row.totalMoney + ']')
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
                        return h('span', {}, parms.row.agent ? parms.row.agent : '无' )
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
                    fixed: 'right',
                    width: '150',
                    render: (h, parms) => {
                        return [
                            this.$has('joint:agentBusiness:edit') ? h ('el-button', {
                            attrs: { type: 'text', disabled: parms.row.procState === '1' ? false : true },
                            style:{ color: parms.row.procState === '1' ? '#409EFF' : '#999', },
                            on: {
                                click: () => {
                                    agentBusinessQueryById({ id: parms.row.id }).then(res => {
                                        this.$router.push({
                                            path: 'newAgent',
                                            name: 'newAgent',
                                            params: {
                                                isAdd: false,
                                                isShowDetail: false,
                                                agentInfo: res
                                            }
                                        })
                                    })
                                }
                            }
                        }, "编辑" ) : '',
                        this.$has ('joint:agentBusiness:del') ? h('el-button', {
                            attrs: { type: 'text', disabled: parms.row.procState === '1' ? false : true },
                            style:{ color: parms.row.procState === '1' ? '#409EFF' : '#999', },
                            props:{ type: 'text', },
                            on:{
                                click: () => {
                                    this.listDel (parms.row.id)
                                }
                            }
                        }, '删除') : ''
                        ]
                    }
                },
            ],
            tableOption: {
                border: false
            },
            accountList: [],
            selectData: [],
            exportData: [],
            selectTime: [],
            pickerOptions: {},
        }
    },
    methods: {
        ...mapActions('d2admin/db', [
            'database',
        ]),
        newReserve() {
            this.$router.push({
                path: 'newAgent',
                name: 'newAgent',
                params: {
                    isAdd: true,
                    isShowDetail: false,
                }
            })
        },
        searchModelSynopsis(){
            this.getTableData()
        },
        resetSearch(){
            this.queryInfo.name = ''
            this.queryInfo.pageNo = '1'
            this.queryInfo.pageSize = '10'
            this.selectTime = []
            this.getTableData()
        },
        listDel(id){
            if(this.selectData.length === 0 && id.length == null){
                this.$message.info("未选择删除的内容!!!")
                return false
            }
            this.$confirm('此操作将永久删除选择的内容, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                cancelButtonClass: "btn-custom-cancel",
                type: 'warning'
            }).then(() => {
                let ids = ''
                if ( id.length != null) {
                    ids = id
                } else {
                    this.selectData.forEach(item => {
                        ids += item.id + ','
                    })
                    ids = ids.substring(0, ids.length - 1)
                }
                let tem = {
                    ids: ids,
                    projectId: this.queryInfo.projectId
                }
                agentBusinessDeleteBatch(tem).then(res => {
                    this.$message.success("删除成功~~~")
                    this.getTableData()
                })
            }).catch(() => {
                this.$message.info("已取消删除");
            })
        },
        selectChange(data) {
            this.selectData = data
        },
        getTime(data){
            if(data){
                this.queryInfo.createTime = data[0]
                this.queryInfo.updateTime = data[1]
                this.getTableData()
            }
        },
        handlePaginationChange(page){
            this.queryInfo.pageNo = page.current
            this.queryInfo.pageSize = page.size
            this.getTableData()
        },
        getTableData(){
            agentBusinessSearchList(
                this.queryInfo
            ).then(res => {
                this.tableData = res.ipa
                this.deducted = res.bigDecimal2
                this.paid = res.bigDecimal
            })
        },
        // 审核
        checkProcess () {
            this.checkOption('1')
        },
        // 反审核
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
                agentBusinessCheckOrAgainst (params).then(res => {
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
                    item.state = item.state === '1' ? '已审核' : '未审核'
                    item.agent = item.agent || '无'
                    item.totalMoney = '代收代付金额:[' + item.totalMoney + ']'
                });
                resolve (true)
            });
        },
    },
    async mounted() {
        const db = await this.$store.dispatch('d2admin/db/database', {user: true})
        this.queryInfo.projectId = db.get('proID').value()

        this.getTableData()
        // 获取账户信息
        // getByAccountTypeListAll({
        //     accountType: '4'
        // }).then(res => {
        //     this.accountList = res
        // })
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
