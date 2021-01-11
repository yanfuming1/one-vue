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
            <qqt-table :data="tableData" ref="table" :exportData="tableData.records" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange" />
        </div>
    </d2-container>
</template>

<script>
    import { deliveryOrderConfirmation, confirmOutStock } from '../../../../../api/materialEquipmentManagement/warehouseManagement/outboundOrder'
    import { qqtTable } from '@/components/qqt-subassembly'
    import { mapState } from 'vuex'

    import util from '@/libs/util.js'
    export default {
        data () {
            return {
                filterText: '',
                options: [],
                createDate: [],
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
                        label: '出库单编号',
                        isShow: true,
                        width: '130',
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = true
                                        this.routerLink ('出库确认', parms.row.sourceId, parms.row.category)
                                    }
                                }
                            }, parms.row.code)
                        }
                    },
                    {
                        prop: 'name',
                        label: '出库单名称',
                        isShow: true,
                        width: '130'
                    },
                    {
                        prop: 'sourceCode',
                        label: '关联单据编号',
                        isShow: true,
                        width: '130'
                    },
                    {
                        prop: 'sourceName',
                        label: '关联单据名称',
                        isShow: true,
                        width: '130'
                    },
                    {
                        prop: 'projectName',
                        label: '关联项目',
                        isShow: true,
                        width: '120'
                    },
                    {
                        prop: 'categoryName',
                        label: '出库类型',
                        isShow: true,
                        width: '100',
                        render: (h,params) =>{
                            return h('div',{
                                
                            }, params.row.categoryName = this.getCategory(params.row.category))
                        }
                    },
                    {
                        prop: 'warehouseName',
                        label: '存放仓库',
                        isShow: true,
                        width: '130'
                    },
                    {
                        prop: 'warehouseSite',
                        label: '仓库地点',
                        isShow: true,
                        width: '140'
                    },
                    {
                        prop: 'amount',
                        label: '出库物品总价',
                        isShow: true,
                        width: '120'
                    },
                    {
                        prop: 'deliveredTime',
                        label: '出库日期',
                        isShow: true,
                        width: '130'
                    },
                    {
                        prop: 'createName',
                        label: '经办人',
                        isShow: true,
                        width: '110'
                    },
                    {
                        prop: 'departmentName',
                        label: '工作部门',
                        isShow: true,
                        width: '110'
                    },
                    {
                        prop: 'createTime',
                        label: '经办时间',
                        isShow: true,
                        width: '130'
                    },
                    {
                        prop: '',
                        label: '操作',
                        isShow: true,
                        width: '110',
                        fixed: 'right',
                        render: (h, parms) => {
                            return [
                                h ('el-button', {
                                    props:{
                                        type: 'danger',
                                        size: 'mini',
                                        round: true
                                    },
                                    style: {
                                        padding: '5px 10px'
                                    },
                                    attrs: {
                                        disabled: parms.row.receiveAffirm == '0' ? false : true
                                    },
                                    on:{
                                        click: () => {
                                            util.confirm ('是否要确认出库').then (boolean => {
                                                if (boolean) {
                                                    this.clickConfirmOutStock (parms.row.id)
                                                }
                                            })
                                        }
                                    }
                                }, '确认出库')
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
            searchModelSynopsis () {
                this.getScrapIssueConfirmationPage ({
                    'keywords': this.filterText ? this.filterText : null,
                    'afterDate': this.createDate ? this.createDate[1] : null,
                    'beforeDate': this.createDate ? this.createDate[0] : null})
            },

            getCategory (category) {
                let name = ''
                switch (category) {
                    case '1': 
                        name = '领用'
                    break
                    case '2': 
                        name = '出租'
                    break
                    case '3': 
                        name = '出售'
                    break
                    case '4': 
                        name = '报废'
                    break
                    case '5': 
                        name = '换货'
                    break
                    case '6':
                        name = '退货'
                    break
                }
                return name
            },

            handlePaginationChange (page) {
                this.page = page;
                this.$nextTick(() => {
                    this.searchModelSynopsis ()
                });
            },
            

            getScrapIssueConfirmationPage (text) {
                deliveryOrderConfirmation ({
                    ...text,
                    'category': 4,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size
                }).then( res => {
                    console.log(res)
                    if (res) this.tableData = res
                })
            },

            resetModelSynopsis () {
                this.filterText = ''
                this.createDate = []
                this.getScrapIssueConfirmationPage ()
            },
            
            exportExcel () {
                this.$refs.table.getExportExcel ()
            },

            printTable () {
                this.$refs.table.printTable (this.tableSelectData)
            },

            routerLink (title, sourceId, category) {
                this.$router.push({
                    path: 'outboundOrderInfo',
                    name: 'outboundOrderInfo',
                    params: {
                        transform: this.transform,
                        sourceId: sourceId,
                        category: category
                    }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            },

            clickConfirmOutStock (id) {
                confirmOutStock ({'id': id}).then (res => {
                    if (res.code == 200) this.$message.success (res.message), this.getScrapIssueConfirmationPage ()
                })
            }

        },

        components: {
            'qqt-table': qqtTable,
        },

        created () {
            this.getScrapIssueConfirmationPage ()
        }
    }

</script>
