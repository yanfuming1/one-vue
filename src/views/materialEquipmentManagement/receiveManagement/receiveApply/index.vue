<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header-operation___left">
                    <el-button type="primary" class="qqt-container-full-header-top___button" v-if="$has('material:use:application:add')" @click="addMaterialDepot">添加</el-button>
                </span>
                <span class="qqt-container-full-header___search">
                    <el-input
                        placeholder="请输入内容"
                        prefix-icon="el-icon-search"
                        v-model="pageInfo.name" size="mini">
                    </el-input>
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="searchModelSynopsis">搜索</el-button>
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
                    <el-button type="primary" class="qqt-container-full-header-top___button" v-if="$has('material:use:application:delete')" @click="deleteBatchMaterialDepotData">批量删除</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                        <el-button size="mini" @click="uploadFun" icon="el-icon-upload2">导出</el-button>
                        <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                    </el-button-group>
                </span>
                <span class="qqt-container-full-header-operation___right">
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
import { receivePageList, receiveDelBatch, receiveQueryById, registerQueryById, registerCheckOrAgainst } from '../../../../api/materialEquipmentManagement/receiveManagement/receiveApply/index'
import { qqtTable } from '../../../../components/qqt-subassembly'
import util from '../../../../libs/util'
export default {
    components: {
        qqtTable
    },
    data () {
        return {
            tableData: {records:[]},
            rowHeader: [
                {
                    prop: 'applycode',
                    label: '领用申请单编号',
                    width: '220',
                    isShow: true,
                    render: (h, parms) => {
                        return h('el-button', {
                            props:{
                                type: 'text',
                            },
                            on:{
                                click: () => {
                                    this.transform.isShowDetails = true
                                    this.routerLink('receiveAdd', { relevancyId: parms.row.id, transform: this.transform}, '领用申请详情')
                                }
                            }
                        }, parms.row.applycode)
                    }
                },{
                    prop: 'applyname',
                    label: '领用申请单名称',
                    width: '250',
                    isShow: true,
                },{
                    prop: 'applytypeName',
                    label: '申请用途',
                    width: '150',
                    isShow: true,
                    render: (h, parms) => {
                        let typeText = ''
                        switch (parms.row.applytype) {
                            case '0':
                                typeText = '项目使用'
                                break
                            case '1':
                                typeText = '工程使用'
                                break
                            case '2':
                                typeText = '其他使用'
                                break
                        }
                        return h('p', {}, parms.row.applytypeName = typeText)
                    }
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
                    prop: 'inventoryStatusName',
                    label: '归还状态',
                    width: '100',
                    isShow: true,
                    render: (h, parms) => {
                        let text = ""
                        switch (parms.row.inventoryStatus) {
                            case '0':
                                text = '待归还'
                                break
                            case '1':
                                text = '部分归还'
                                break
                            case '2':
                                text = '已归还'
                                break
                            case '3':
                                text = '部分归还'
                                break
                            default:
                                break
                        }
                        text = parms.row.procState === '10' ? text : '无'
                        return h('span', {}, parms.row.inventoryStatusName = text )
                    }
                },{
                    prop: 'createName',
                    label: '申请人',
                    width: '100',
                    isShow: true,
                },{
                    prop: 'departmentName',
                    label: '工作部门',
                    width: '150',
                    isShow: true,
                },{
                    prop: 'createTime',
                    label: '申请时间',
                    width: '180',
                    isShow: true,
                },{
                    prop: '',
                    label: '操作',
                    isShow: true,
                    fixed: 'right',
                    width: '110',
                    render: (h, parms) => {
                        return [
                            h('el-button', {
                                props:{ type: 'text', disabled: parms.row.procState === '1' ? false : true },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = false
                                        this.routerLink('receiveAdd', { relevancyId: parms.row.id, transform: this.transform}, '领用申请编辑')
                                    }
                                }
                            }, this.$has('material:use:application:edit') ? '编辑' : ''),
                            h('el-button', {
                                props:{ type: 'text', disabled: parms.row.procState === '1' ? false : true },
                                on:{
                                    click: () => {
                                        util.confirm('确定删除此项内容吗？').then(res => {
                                            if(res) {
                                                receiveDelBatch({ ids: parms.row.id }).then(response => {
                                                    this.$message.success("删除成功~~~")
                                                    this.getList()
                                                })
                                            }
                                        })
                                    }
                                }
                            }, this.$has('material:use:application:delete') ? '删除' : ''),
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
            selectDate: [],
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
            selectData: [],
            exportData: [],
            transform: {
                isShowDetails: false
            },
        }
    },
    methods: {
        addMaterialDepot () {
            this.transform.isShowDetails = false
            this.routerLink('receiveAdd', { transform: this.transform}, '领用申请添加')
        },
        selectChangeData (data) {
            this.pageInfo.createTime = data && data.length > 0 ? data[0] : ''
            this.pageInfo.updateTime = data && data.length > 0 ? data[1] : ''
            this.getList()
        },
        searchModelSynopsis () { 
            this.getList ()
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
            this.getList()
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
                        receiveDelBatch({ ids: selectIds }).then(res => {
                            this.$message.success("删除成功~~~")
                            this.getList()
                        }) 
                    }
                })
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
                    item.procState = util.handleState(item.procState)
                    item.agent = item.agent ? item.agent : '无'
                    switch (item.applytype) {
                        case '0':
                            item.applytype = '项目使用'
                            break
                        case '1':
                            item.applytype = '工程使用'
                            break
                        case '2':
                            item.applytype = '其他使用'
                            break
                    }
                    switch (item.inventoryStatus) {
                        case '0':
                            item.inventoryStatus = '待归还'
                            break
                        case '1':
                            item.inventoryStatus = '部分归还'
                            break
                        case '2':
                            item.inventoryStatus = '已归还'
                            break
                        case '3':
                            item.inventoryStatus = '部分归还'
                            break
                        default:
                            break
                    }
                    item.inventoryStatus = item.procState === '已完结' ? item.inventoryStatus : '无'
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
            this.getList()
        },
        getList () {
            receivePageList(this.pageInfo).then(res => {
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
        checkAgainstPurchaseRequestData (type) {
            if (this.selectData.length === 0) {
                this.$message.warning("未选择内容!!!")
            } else if(this.selectData.length > 1){
                this.$message.warning("只能选择单条内容!!!")
            } else if(this.selectData[0].state === type){
                this.$message.warning(type === '1' ? '选择的内容已审核，请重新选择!!!' : '选择的内容已反审核，请重新选择!!!')
            } else {
                registerCheckOrAgainst({
                    id: this.selectData[0].id,
                    type: type
                }).then(res => {
                    this.$message.success(res.message)
                    this.getList()
                })
            }
        },

        printTable () {
            this.$refs.table.printTable (this.selectData)
        },
    },
    mounted () {
        this.getList()
    }
}
</script>