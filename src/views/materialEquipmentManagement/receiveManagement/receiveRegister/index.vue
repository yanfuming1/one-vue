<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header-operation___left">
                    <!-- <el-button type="primary" class="qqt-container-full-header-top___button" @click="addMaterialDepot">添加</el-button> -->
                </span> 
                <span class="qqt-container-full-header___search">
                    <el-input
                        placeholder="请输入内容"
                        prefix-icon="el-icon-search"
                        v-model="newFilter.keywords" size="mini">
                    </el-input>
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="getList">搜索</el-button>
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
                <span class="qqt-container-full-header-operation___right">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deleteBatchMaterialDepotData">批量删除</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                        <el-button size="mini" @click="uploadFun" icon="el-icon-upload2">导出</el-button>
                        <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
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
import { receiveRegisterList, registerDelBatch, registerQueryById } from '@/api/materialEquipmentManagement/receiveManagement/receiveApply/index'
import { receiveOutList, receiveOutAffirm } from '@/api/materialEquipmentManagement/receiveManagement/index'
import { qqtTable } from '../../../../components/qqt-subassembly'
import util from '../../../../libs/util'
export default {
    components: {
        qqtTable
    },
    data () {
        return {
            transform: {
                isShowDetails: false
            },
            tableData: {records:[]},
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
                    prop: 'receiveAffirmName',
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
                                                    this.getList()
                                                })
                                            }
                                        })
                                    }
                                }
                            }, '确认'),
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
            selectData: [],
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
            exportData: [],
            
            newFilter: {
                category: '1',
                materials: true,
                pageNo: '1',
                pageSize: '10',
                keywords: '',
                afterDate: '', // 开始时间
                beforeDate: '', // 结束时间
            }
        }
    },
    methods: {
        selectChangeData (data) {
            this.newFilter.afterDate = data && data.length > 0 ? data[0] : ''
            this.newFilter.beforeDate = data && data.length > 0 ? data[1] : ''
            this.getList()
        },
        resetModelSynopsis () {
            this.newFilter = {
                category: '1',
                materials: true,
                pageNo: '1',
                pageSize: '10',
                keywords: '',
                afterDate: '', // 开始时间
                beforeDate: '', // 结束时间
            }
            this.selectDate = []
            this.getList()
        },
        showDetail (parms) {
            this.transform.isShowDetails = true
            this.routerLink('outboundOrderInfoDetail', 
                {
                    relevancyId: parms.row.id,
                    transform: this.transform,
                    category: parms.row.category,
                    isShowOutboundorder: '2',
                    returnRouter: 'receiveManagement/receiveRegister',
                    otherModules: true,
                }, '领用确认详情')
        },
        deleteBatchMaterialDepotData () {
            if (this.selectData.length === 0) {
                this.$message.warning("请选择删除的内容!!!")
            } else {
                util.confirm('确定删除选择的内容吗？').then(res => {
                    if(res) {
                        let selectIds = ''
                        this.selectData.forEach(item => {
                            selectIds += item.id + ','
                        })
                        selectIds = selectIds.substring(0, selectIds.length - 1)
                        registerDelBatch({ ids: selectIds }).then(response => {
                            this.$message.success("删除成功~~~")
                            this.getList()
                        })
                    }
                })
            }
            
        },
        exportExcel () {
            
        },

        printTable () {
            this.$refs.table.printTable (this.selectData)
        },

        selectChange (data) {
            this.selectData = data
        },
        handlePaginationChange (page) {
            this.newFilter.pageNo = page.current
            this.newFilter.pageSize = page.size
            this.getList()
        },
        getList () {
            receiveOutList(this.newFilter).then(res => {
                this.tableData = res
            })
        },
        routerLink (url, params, title) {
            this.$router.push({
                path: url,
                name: url,
                params: params
            })
            this.$store.commit ('d2admin/page/titleSet', title)
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
                    item.receiveAffirm = item.receiveAffirm === '1' ? '已确认' : '未确认'
                });
                resolve (true)
            });
        },
    },
    mounted () {
        this.getList()
    }
}
</script>