<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header___search">
                    <el-input
                        placeholder="请输入内容"
                        prefix-icon="el-icon-search"
                        @keyup.enter.native="searchModelSynopsis"
                        v-model="filterText" size="mini">
                    </el-input>
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="searchModelSynopsis">搜索</el-button>
                    <el-button type="info" class="qqt-container-full-header-top___button" @click="resetModelSynopsis">重置</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-date-picker
                        size="mini"
                        v-model="createDate"
                        type="datetimerange"
                        :picker-options="pickerOptions"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['08:00:00', '18:00:00']"
                        @change="searchModelSynopsis()" 
                        align="right">
                    </el-date-picker>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                        <el-button size="mini" @click="exportExcel" icon="el-icon-upload2">导出</el-button>
                        <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                    </el-button-group>
                </span>
            </div>
        </template>
        <div class="qqt-container-full___center">
            <qqt-table :data="tableData" ref="table" :exportData="exportData" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange" />
        </div>
    </d2-container>
</template>

<script>
import { receiveOutList, receiveOutAffirm } from '@/api/materialEquipmentManagement/receiveManagement/index'
import { qqtTable } from '@/components/qqt-subassembly'
import { mapState } from 'vuex'

import util from '@/libs/util.js'
export default {
    data () {
        return {
            filterText: '',
            options: [],
            createDate: [],
            exportData: [],
            tableSelectData: [],
            tableOption: {
                border: false
            },
            transform: {
                isShowDetails: false
            },
            dynamicHeader: {
                tableId: '',
                isSave: false
            },
            page: {
                current: 1,
                size: 10,
                total: 0
            },
            tableData: {},
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
            rowHeader: [
                {
                    prop: 'code',
                    label: '领用出库单单号',
                    isShow: true,
                    render: (h, parms) => {
                        return h('el-button', {
                            props:{
                                type: 'text',
                            },
                            on:{
                                click: () => {
                                    this.showDetail(parms)
                                }
                            }
                        }, parms.row.code)
                    }
                },{
                    prop: 'name',
                    label: '领用出库单名称',
                    width: '180',
                    isShow: true,
                    render: (h, parms) => {
                        return h('el-button', {
                            props:{
                                type: 'text',
                            },
                            on:{
                                click: () => {
                                    this.showDetail(parms)
                                }
                            }
                        }, parms.row.name)
                    }
                },{
                    prop: 'sourceCode',
                    label: '领用申请单单号',
                    width: '150',
                    isShow: true,
                },{
                    prop: 'sourceName',
                    label: '领用申请单名称',
                    isShow: true,
                },{
                    prop: 'warehouseName',
                    label: '存放仓库',
                    isShow: true,
                },{
                    prop: 'warehouseSite',
                    label: '仓库地点',
                    width: '180',
                    isShow: true,
                },{
                    prop: 'receiveAffirmNames',
                    label: '确认状态',
                    width: '100',
                    isShow: true,
                    render: (h, parms) => {
                        return h('span', {
                            style: { color: parms.row.receiveAffirm === '1' ? '#66b1ff' : '#f56c6c' }
                        }, parms.row.receiveAffirmName = parms.row.receiveAffirm === '1' ? '已确认' : '未确认')
                    }
                },{
                    prop: 'createName',
                    label: '经办人',
                    isShow: true,
                },{
                    prop: 'departmentName',
                    label: '工作部门',
                    isShow: true,
                },{
                    prop: 'createTime',
                    label: '经办时间',
                    width: '160',
                    isShow: true,
                },{
                    prop: '',
                    label: '操作',  
                    isShow: true,
                    fixed: 'right',
                    width: '90',
                    render: (h, parms) => {
                        return [
                            h('el-button', {
                                props:{ type: 'text', disabled: parms.row.receiveAffirm === '1' ? true : false,},
                                on:{
                                    click: () => {
                                        util.confirm('要确认这条信息吗？').then(val => {
                                            if (val) {
                                                receiveOutAffirm({id: parms.row.id}).then(res => {
                                                    this.$message.success("确认成功!!!")
                                                    this.getIndexPage()
                                                })
                                            }
                                        })
                                    }
                                }
                            }, '确认'),
                        ]
                    }
                }
            ]
        }
    },

    methods: {

        selectChange (item) {
            this.tableSelectData = item
        },

        showDetail (parms) {
            this.transform.isShowDetails = true
            this.routerLink('outboundOrderInfoDetail', 
            {
                relevancyId: parms.row.id,
                transform: this.transform,
                category: parms.row.category,
                isShowOutboundorder: '2',
                returnRouter: 'rentOutManagement/rentConfirmation',
                otherModules: true,
            }, '出租出库详情')
        },

        searchModelSynopsis () {
            this.getIndexPage ({
                'keywords': this.filterText ? this.filterText : null,
                'afterDate': this.createDate ? this.createDate[0] : null,
                'beforeDate': this.createDate ? this.createDate[1] : null})
        },

        handlePaginationChange (page) {
            this.page = page;
            this.$nextTick(() => {
                this.searchModelSynopsis ()
            });
        },

        getIndexPage (text) {
            receiveOutList ({
                ...text,
                'pageNo': this.page.current,
                'pageSize': this.page.size,
                'category': '2',
                'materials': true
            }).then( res => {
                if (res) this.tableData = res
            })
        },

        resetModelSynopsis () {
            this.filterText = ''
            this.createDate = []
            this.getIndexPage ()
        },
 
        exportExcel () {
            this.getExportData().then(res => {
                this.$refs.table.getExportExcel ()
            })
        },

        printTable () {
            this.$refs.table.printTable (this.tableSelectData)
        },

        getExportData () {
            this.exportData = JSON.parse(JSON.stringify((this.tableData.records))) || [];
            return new Promise((resolve, reject) => {
                this.exportData.forEach((item,index) => {
                    item.receiveAffirm = item.receiveAffirm === '1' ? '已确认' : '未确认'
                });
                resolve (true)
            });
        },

        routerLink (url, params, title) {
            this.$router.push({
                path: url,
                name: url,
                params: params
            })
            this.$store.commit ('d2admin/page/titleSet', title)
        },
    },

    components: {
        'qqt-table': qqtTable,
    },

    created () {
        this.getIndexPage ()
    }
}
</script>
