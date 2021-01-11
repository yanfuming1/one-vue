<template>
    <d2-container class="customer-list">
        <template slot="header">
            <div class="customer-list-header">
                <div class="customer-list-header___top">
                    <span class="customer-list-header___search">
                        <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchInfo.name" size="mini"></el-input>
                        <span style="margin-right:10px;">
                            <el-date-picker
                                size="mini"
                                style="width:320px;"
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
                        <el-button type="primary" class="customer-list-header-button" @click="searchModelSynopsis">搜索</el-button>
                        <el-button type="info" class="customer-list-header-button" @click="resetSearch">重置</el-button>
                        <el-button v-if="$has ('administer:charterLoan:giveBack')" type="warning" class="customer-list-header-button" @click="giveBack">归还登记</el-button>
                    </span>
                    <span class="customer-list-header-operation___right">
                        <el-button-group>
                            <!-- <el-button size="mini" icon="el-icon-download" @click="">导入</el-button> -->
                            <el-button size="mini" icon="el-icon-upload2" @click="uploadFun">导出</el-button>
                            <!-- <el-button size="mini" icon="el-icon-position" @click="">送审</el-button> -->
                            <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                        </el-button-group>
                    </span>
                    <span class="customer-list-header___state">
                        <p>是否归还:</p>
                        <div class="customer-list-header-state___select">
                            <qqt-select :value="searchInfo.giveBack" :options="options" :size="'mini'" :placeholder="'请选择'" @select="searchInfo.giveBack = $event, searchModelSynopsis ()"></qqt-select>
                        </div>
                    </span>
                    <!-- <span class="customer-list-header___audit">
                        <el-button-group>
                            <el-button size="mini" icon="el-icon-download">审核</el-button>
                            <el-button size="mini" icon="el-icon-download">反审核</el-button>
                        </el-button-group>
                    </span> -->
                </div>
            </div>
        </template>
        <div class="customer-list-center">
            <qqt-table
                ref="table" 
                :exportData="exportData"
                :data="tableData"
                :rowHeader="rowHeader"
                :option="tableOption"
                @selectionChange="selectChange"
                @page="handlePaginationChange"></qqt-table>
        </div>
        <el-dialog
            v-dialogDrag
            title="提示"
            :visible.sync="dialogVisible"
            width="60%"
            :before-close="handleClose">
            <!-- 归还登记 -->
            <give-back :backInfo="backInfo" ref="giveBack" @backData="backData"/>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="subGiveBack">确 定</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </d2-container>
</template>

<script>
import { qqtTable, qqtSelect } from '../../../../components/qqt-subassembly'
import { companyRecordList,companyRecordSearch, companyBorrowGiveBack,cRecordQueryDetailsByIds } from '../../../../api/officalDocument/index'
import GiveBack from "../../personal/borrowRecord/components/giveBack";
import util from '../../../../libs/util';
let that = this
export default {
    name: "index",
    components: {
        GiveBack,
        'qqt-table': qqtTable,
        'qqt-select': qqtSelect
    },
    data () {
        return {
            exportData: [],
            selectTime: [],
            tableData: {},
            rowHeader: [
                {
                    prop: 'name',
                    label: '证书名称',
                    isShow: true,
                    width: '180',
                    render: (h, parms) => {
                        return h('el-button', {
                            style: { color: '#3ba5ff' },
                            attrs: { type: 'text' },
                            on: {
                                click: () => {
                                    cRecordQueryDetailsByIds({ids:parms.row.id}).then(res => {
                                        this.$router.push({
                                            path: 'cerBorrowC',
                                            name: 'cerBorrowC',
                                            params: {
                                                cerInfo: res,
                                                procInstId: parms.row.procInstId,
                                                businessId: parms.row.id,
                                                newSub: false
                                            }
                                        })
                                    })
                                }
                            }
                        }, parms.row.name)
                    }
                },{
                    prop: 'encoding',
                    label: '证书编号',
                    isShow: true,
                    width: '150'
                },{
                    prop: 'giveBackName',
                    label: '是否归还',
                    isShow: true,
                    render: (h, parms) => {
                        return h('p', {}, parms.row.giveBackName = parms.row.giveBack === '1' ? '是' : '否');
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
                    width: '150',
                    render: (h, parms) => {
                        return h('span', {}, parms.row.agent === '' ? '无' : parms.row.agent)
                    }
                },{
                    prop: 'borrower',
                    label: '借证人',
                    isShow: true
                },{
                    prop: 'purpose',
                    label: '借证用途',
                    isShow: true,
                    width: '180'
                },{
                    prop: 'borrow',
                    label: '借证时间',
                    isShow: true,
                    width: '180',
                    render: (h, parms) => {
                        return h('p', {}, parms.row.borrow = `${parms.row.borrowDate ? parms.row.borrowDate : '无'} - ${parms.row.borrowEndDate ? parms.row.borrowEndDate : '无'}`);
                    },
                    isShow: true
                },
                {
                    prop: 'rapayDate',
                    label: '归还时间',
                    isShow: true,
                    width: '150'
                },
                {
                    prop: 'createName',
                    label: '登记人',
                    isShow: true
                },{
                    prop: 'createTime',
                    label: '登记时间',
                    isShow: true,
                    width: '160'
                },
            ],
            tableOption: {
                border: false
            },
            selectData: [],
            dialogVisible: false,
            backInfo: {
                credentialLoan: [
                    {
                        name: "",
                        possessor: "",
                        encoding: "",
                        repayPeople: "",
                        rapayDate: ""
                    }
                ]
            },
            temData:{},
            searchInfo: {
                name: '',
                giveBack: '',
                pageNo: '1',
                pageSize: '10',
                createTime: null,
                updateTime: null
            },
            options: [
                {
                    value: '0',
                    label: '否'
                },
                {
                    value: '1',
                    label: '是'
                }
            ],
        }
    },
    methods: {
        addCertificate () {
        },
        selectChange (data) {
            this.selectData = data
        },
        handlePaginationChange (page) {
            this.searchInfo.pageNo = page.current
            this.searchInfo.pageSize = page.size
            this.searchModelSynopsis(false)
        },
        getTime(time){
            this.searchInfo.createTime = time != null ? time[0] : null
            this.searchInfo.updateTime = time != null ? time[1] : null
            this.searchModelSynopsis ()
        },
        searchModelSynopsis (boolean = true) {
            if (boolean) {
                this.searchInfo.pageNo = '1'
                this.searchInfo.pageSize = '10'
            }
            companyRecordSearch(
                this.searchInfo
            ).then(res => {
                this.tableData = res
            })
        },
        resetSearch(){
            this.searchInfo = {
                name: '',
                giveBack: '',
                pageNo: '1',
                pageSize: '10',
                createTime: null,
                updateTime: null
            }
            this.selectTime = []
            this.searchModelSynopsis()
        },
        giveBack () {
            if(this.selectData.length === 0){
                this.$message.warning("未选择证书!!")
            }else{
                let have = false
                let msg = ''
                this.selectData.forEach(item => {
                    if(item.giveBack === '1'){
                        have = true
                        msg = "选择的有已经归还的证书,请重新选择!!!"
                    }
                    if(item.procState !== '10'){
                        have = true
                        msg = "选择的有未借出的证书,请重新选择!!!"
                    }
                })
                if(have){
                    this.$message.warning(msg)
                }else{
                    this.backInfo.credentialLoan = []
                    this.selectData.forEach(item => {
                        let tem = {
                            name: item.name,
                            possessor: item.possessor,
                            encoding: item.encoding,
                            repayPeople: item.borrower,
                            rapayDate: '',
                        }
                        this.backInfo.credentialLoan.push(tem)
                    })
                    this.dialogVisible = true
                }
            }
        },
        handleClose (done) {
            done()
        },
        backData (data) {
            this.temData = data
        },
        subGiveBack () {
            // 提交
            this.$refs.giveBack.getData()
            setTimeout(() => {
                for(let m = 0; m<this.temData.credentialLoan.length; m++){
                    this.temData.credentialLoan[m].id = this.selectData[m].id
                }
                companyBorrowGiveBack(this.temData.credentialLoan).then(res => {
                    this.$message.success("归还成功~~~")
                    this.dialogVisible = false
                    this.searchModelSynopsis()
                })
            }, 1000)
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
                    item.giveBack = item.giveBack === '1' ? '是' : '否'
                });
                resolve (true)
            });
        },

        printTable () {
            this.$refs.table.printTable (this.selectData)
        }

    },
    created () {
        this.searchModelSynopsis()
    },
    mounted () {
        that = this
    },
}
</script>

<style scoped lang="scss">
    .customer-list {
        .customer-list-header {
            padding-top: 10px;
            .customer-list-header___top{
                .customer-list-header___search {
                    .el-input {
                        width: 10%;
                        padding-right: 10px;
                        top: -1px;
                    }
                    .el-date-editor{
                        width: 240px; 
                    }
                }
                .el-range-editor--mini .el-range-separator{
                    display: inline-table;
                }
                .customer-list-header___state{
                    padding-left: 10px;
                    p {
                        display: inline-block;
                    }
                    .customer-list-header-state___select {
                        padding-left: 10px;
                        width: 12%;
                        display:inline-block;
                    }
                }
                .customer-list-header-operation___left {
                    padding-right: 10px;
                }
                .customer-list-header-operation___right {
                    padding-left: 20px;
                }
                .customer-list-header___audit {
                    padding-left: 20px;
                    .el-button {
                        background: $color-button-reset !important;
                    }
                }
            }
        }
        .customer-list-center {
            height: 102%;
            margin-top: -15px;
            background: $color-bg3;
            box-shadow: 0 2px 12px 0 $color-border-shadow;
        }
    }
    .customer-list-header-button {
        padding: 0 5px;
        height: 26px;
        border-radius: 3px;
    }
    .el-button--mini, .el-button--mini.is-round {
        padding: 6px 5px !important;
        top: -1px
    }
</style>
