<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header___search">
                    <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchInfo.name" size="mini"></el-input>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-date-picker
                        size="mini"
                        style="width:320px;"
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
                <span class="qqt-container-full-header-operation___right">
                    <el-button type="primary" class="customer-list-header-button" @click="searchModelSynopsis">搜索</el-button>
                    <el-button type="info" class="customer-list-header-button" @click="resetSearch">重置</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <p>办理状态:</p>
                    <div class="qqt-container-full-header-state___select">
                        <qqt-select :value="searchInfo.procState" :options="procStateOptions" :defaultProp="procStateDefaultProp" :size="'mini'" :placeholder="'请选择'" @select="searchInfo.procState = $event, searchModelSynopsis()"></qqt-select>
                    </div>
                </span>
                <!-- <span class="customer-list-header-button">
                    <el-button type="primary" class="customer-list-header-button" @click="deleteRecord">批量删除</el-button>
                </span> -->
                <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                        <el-button size="mini" icon="el-icon-upload2" @click="uploadFun">导出</el-button>
                        <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                    </el-button-group>
                </span>
                <!-- <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                       <el-button size="mini" icon="el-icon-download">审核</el-button>
                            <el-button size="mini" icon="el-icon-download">反审核</el-button>
                    </el-button-group>
                </span> -->
              
                
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
    </d2-container>
</template>
<script>
import { qqtTable, qqtSelect } from '../../../../components/qqt-subassembly'
import { payRecordList, delPayRecord, payRecordSearch, payRecordQueryById} from '../../../../api/officalDocument/index'
import util from '../../../../libs/util';
export default {
    name: "index",
    data () {
        return {
            exportData:[],
            pickerOptions: {},
            selectTime: [],
            filterText: '',
            procStateDefaultProp: {
                value: 'id',
                label: 'name'
            },
            procStateOptions: [
                    {
                        id: '1',
                        name: '初始化'
                    },
                    {
                        id: '2',
                        name: '待审批'
                    },
                    {
                        id: '3',
                        name: '审批中'
                    },
                    {
                        id: '4',
                        name: '已驳回'
                    },
                    {
                        id: '5',
                        name: '已作废'
                    },
                    {
                        id: '10',
                        name: '已完结'
                    },
                    {
                        id: '6',
                        name: '待提交'
                    }
                ],
            tableData: {},
            rowHeader: [
                {
                    prop: 'encoding',
                    label: '证书编号',
                    isShow: true
                },{
                    prop: 'name',
                    label: '证书名称',
                    isShow: true,
                    render: (h, params) => {
                        return h('el-button', {
                            attrs: { type: 'text' },
                            on: {
                                click: () => {
                                    payRecordQueryById({id: params.row.id}).then(res => {
                                        this.$router.push({
                                            path: 'payCall',
                                            name: 'payCall',
                                            params: {
                                                cerInfo: res,
                                                fromRecord: true,
                                            }
                                        })
                                    })
                                }
                            }
                        }, params.row.name)
                    }
                },{
                    prop: 'possessor',
                    label: '持证人',
                    isShow: true,
                },{
                    prop: 'procStateName',
                    label: '办理状态',
                    isShow: true,
                    render: (h, params) => {
                        return h('p', {
                        }, params.row.procStateName = util.handleState(params.row.procState))
                    }
                },{
                    prop: 'startDateName',
                    label: '支付周期',
                    isShow: true,
                    render: (h, params) => {
                        return h('p', { }, params.row.startDateName = params.row.startDate + '至' + params.row.entDate)
                    }
                },{
                    prop: 'money',
                    label: '支付金额',
                    isShow: true,
                    isMoney: true,
                    isOpenSummary: true
                },{
                    prop: 'createName',
                    label: '申请人',
                    isShow: true
                },{
                    prop: 'createTime',
                    label: '申请时间',
                    isShow: true
                }
            ],
            tableOption: {
                border: false,
                isOpenSummary: true
            },
            selectData: [],
            searchInfo: {
                name:'',
                pageNo: '1',
                pageSize: '10',
                createTime: null,
                updateTime: null,
                procState: ''
            }
        }
    },
    methods: {
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
                this.searchInfo.pageSize = '20'
            }
            payRecordSearch(this.searchInfo).then(res => {
                this.tableData = res
            })
        },
        resetSearch () {
            this.searchInfo = {
                name: '',
                pageNo: '1',
                pageSize: '10',
                createTime: null,
                updateTime: null
            }
            this.selectTime = []
            this.searchModelSynopsis()
        },
        getList () {
            payRecordList().then(res => {
                this.tableData = res
            })
        },
        deleteRecord () {
            if(this.selectData.length === 0){
                this.$message.warning("未选择删除的记录")
            }else{
                let tem = ''
                this.selectData.forEach(item => {
                    tem += item.id + ','
                })
                delPayRecord({ids: tem}).then(res => {
                    this.$message.success("删除成功~")
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
                });
                resolve (true)
            });
        },
    },
    created () {
        this.getList()
    },
    components: {
        'qqt-table': qqtTable,
        'qqt-select': qqtSelect
    },
}
</script>

<style lang="scss">
.customer-list {
    .customer-list-header {
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
                .el-range-editor--mini .el-range-separator{
                    display: inline-table;
                }
            }
            .customer-list-header___state{
                padding-left: 10px;
                p {
                    display: inline-block;
                }
                .customer-list-header-state___select {
                    padding-left: 10px;
                    width: 5%;
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
        height: 100%;
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
