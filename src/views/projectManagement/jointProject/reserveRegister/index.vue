<template>
    <d2-container class="address-book">
        <template slot="header">
            <div class="address-book-header">
                <span class="address-book-header___search">
                    <el-button type="primary" size="mini" class="address-book-header-button" v-if="$has('joint:reserve:add')" @click="newReserve">添加</el-button>
                    <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="pageInfo.name" size="mini"></el-input>
                    <el-date-picker v-model="timeData" size="mini" type="datetimerange" range-separator="至" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['08:00:00', '18:00:00']" start-placeholder="开始日期" end-placeholder="结束日期" @change="getTime"></el-date-picker>
                    <el-button type="primary" size="mini" class="address-book-header-button" @click="searchModelSynopsis">搜索</el-button>
                    <el-button type="info" size="mini" class="address-book-header-button" @click="resetSearch">重置</el-button>
                    <el-button-group>
                        <el-button size="mini" @click="uploadFun" icon="el-icon-upload2">导出</el-button>
                    </el-button-group>
                </span>
            </div>
        </template>
        <div class="address-book-center">
            <qqt-table ref="table" :data="tableData" :exportData="exportData" :rowHeader="rowHeader" :option="tableOption" :dynamicHeader="dynamicHeader" @selectionChange="selectChange" @page="handlePaginationChange"></qqt-table>
        </div>
        <el-drawer :title="drawerTitle" :visible.sync="drawer" :direction="'rtl'" :before-close="handleClose">
            <div style="padding: 20px">
                <right-drawer :jointInfo="jointInfo" :jointPerson="jointPerson" :isAdd="isAdd" :drawer="drawer" :proType="proType" :showDetail="showDetail" ref="rightDrawer" @closeDrawer="closeDrawer"/>
            </div>
        </el-drawer>
    </d2-container>
</template>

<script>
import { qqtTable } from '../../../../components/qqt-subassembly'
import { getJointProList, getJointProSearch, jointQueryById,getProjectAllOptions } from '../../../../api/jointProject/index'
import { queryDicById } from '../../../../api/system/dic/dic'
import util from '../../../../libs/util'
import RightDrawer from "./components/rightDrawer"
import { PROJECT_GETINFOID } from '../../../../enum/PROJECT'
export default {
    name: "index",
    components: {
        RightDrawer,
        'qqt-table': qqtTable
    },
    data () {
        return {
            tableData: {},
            dynamicHeader: {
                // tableId: 'T_1572590405',
                // isSave: true
            },
            rowHeader: [
                {
                    prop: 'projectName',
                    label: '项目名称',
                    isShow: true,
                    render: (h, parms) => {
                        return [
                            h('div', {
                                style:{color: '#409EFF', cursor: 'pointer' },
                                on:{
                                    click: () => {
                                        jointQueryById({
                                            id: parms.row.id
                                        }).then(res => {
                                            this.drawerTitle = '详情'
                                            this.jointInfo = res
                                            this.drawer = true
                                            this.isAdd = false
                                            this.showDetail = true
                                        })
                                    }
                                }
                            }, parms.row.projectName),
                        ]
                    }
                },{
                    prop: 'projectType',
                    label: '项目类别',
                    isShow: true
                },{
                    prop: 'biddAssess',
                    label: '招标价估算',
                    isShow: true,
                    isMoney: true,
                },{
                    prop: 'jointPerson',
                    label: '联营人',
                    isShow: true
                },{
                    prop: 'phone',
                    label: '联系方式',
                    isShow: true
                },{
                    prop: 'biddFee',
                    label: '预定费用',
                    isShow: true,
                    isMoney: true,
                },{
                    prop: 'createName',
                    label: '登记人',
                    isShow: true
                },{
                    prop: 'createTime',
                    label: '登记时间',
                    isShow: true
                },{
                    prop: "",
                    label:"操作",
                    isShow: true,
                    render: (h, parms) => {
                        return [
                            h('el-button', {
                                props:{
                                    type: 'text',
                                },
                                on:{
                                    click: () => {
                                        jointQueryById({
                                            id: parms.row.id
                                        }).then(res => {
                                            this.drawerTitle = '编辑'
                                            this.jointInfo = res
                                            this.drawer = true
                                            this.isAdd = false
                                            this.showDetail = false
                                        })
                                    }
                                }
                            }, this.$has('joint:reserve:edit') ? '编辑' : ''),
                        ]
                    }
                },
            ],
            tableOption: {
                border: false,
                height: 555,
            },
            drawer: false,
            pageInfo: {
                name: '',
                pageNo: '1',
                pageSize: '10',
                createTime: '',
                updateTime: '',
            },
            drawerTitle: '添加',
            proType: [],
            jointPerson: [],  
            jointInfo: {},
            isAdd: false,
            showDetail: false,
            timeData: [],
            exportData: [],
        }
    },
    methods: {
        handleChange (done) {
            done()
        },
        handlePaginationChange (data) {
            this.pageInfo.pageNo = data.current
            this.pageInfo.pageSize = data.size
            this.searchData()
        },
        selectChange (data) {
            // console.log(data)
        },
        getTime(data){
            this.pageInfo.createTime = data ? data[0] : ''
            this.pageInfo.updateTime = data ? data[1] : ''
            this.searchData()
        },
        searchModelSynopsis () {
            this.pageInfo.pageNo = '1'
            this.searchData()
        },
        resetSearch() {
            this.timeData = []
            this.pageInfo = {
                name: '',
                pageNo: '1',
                pageSize: '10',
                createTime: '',
                updateTime: '',
            }
            this.searchData()
        },
        newReserve () {
            this.drawerTitle = '添加'
            this.jointInfo = {}
            this.drawer = true
            this.isAdd = true
            this.showDetail = false
        },
        handleClose (done) {
            done()
        },
        getTableData () {
            getJointProList().then(res => {
                this.tableData = res
            })
        },
        searchData () {
            getJointProSearch(this.pageInfo).then(res => {
                this.tableData = res
            })
        },
        closeDrawer(){
            this.drawer = false
            this.getTableData()
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
                    
                });
                resolve (true)
            });
        },
    },
    mounted() {
        this.getTableData()
        getProjectAllOptions().then(res => {
            this.proType = res.projectType
            this.jointPerson = res.customer
        })
    }
}
</script>

<style lang="scss">
.address-book {
    .d2-container-full .d2-container-full__header{
        padding-bottom: 0px !important;
    }
    .address-book-header-button{
        margin-right: 10px;
    }
    .address-book-header {
        .el-range-separator{
            display: contents;
        }
        .address-book-header___search {
            .el-input {
                width: 10%;
                padding-right: 10px;
            }
        }
        .el-date-editor{
            width: 320px;
            margin-right: 10px;
            .el-range-input{
                width: 42%;
            }
        }
    }
    .address-book-center {
        box-shadow: 0 2px 12px 0 $color-border-shadow;
        background: $color-bg3;
        height: 100%;
    }
}
</style>
