<template>
    <d2-container type="fulls">
        <template slot="header">
            <div v-if="this.$route.params.identification == '1' ">
                <project-info></project-info>
            </div>
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header___search">
                    <el-input
                        placeholder="请输入内容"
                        prefix-icon="el-icon-search"
                        @keyup.enter.native="searchModelSynopsis"
                        v-model="filterText" size="mini">
                    </el-input>
                   
                </span>
                <span class="purchase_order">订单金额</span>
                <span  class="qqt-container-full-header___search">
                    <el-input
                        placeholder="请输入金额下限"
                        v-model="scopeFloor" size="mini">
                    </el-input>
                </span>
                ~
                <span class="qqt-container-full-header___search">
                    <el-input
                        placeholder="请输入金额上限"
                        v-model="scopeCeiling" size="mini">
                    </el-input>
                </span>
                <el-button type="primary" class="qqt-container-full-header-top___button" @click="searchModelSynopsis">搜索</el-button>
                <el-button type="info" class="qqt-container-full-header-top___button" @click="resetModelSynopsis">重置</el-button>
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
                    <p>是否开票:</p>
                    <div class="qqt-container-full-header-state___select">
                        <qqt-select :value="invoice" :options="invoiceOptions" :defaultProp="defaultProp" :size="'mini'" :placeholder="'请选择'" @select="invoice = $event, searchModelSynopsis()"></qqt-select>
                    </div>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <p>货物状态:</p>
                    <div class="qqt-container-full-header-state___select">
                        <qqt-select :value="inventoryStatus" :options="inventoryStatusOptions" :defaultProp="defaultProp" :size="'mini'" :placeholder="'请选择'" @select="inventoryStatus = $event, searchModelSynopsis()"></qqt-select>
                    </div>
                </span>
                <span class="qqt-container-full-header-operation___right" v-if="$route.params.identification == '1' ? $has('self:procurement:indent:delete') : $has ('material:procurement:indent:delete')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deletePurchaseOrderList">批量删除</el-button>
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
    import { qqtTable, qqtSelect } from '../../../../../components/qqt-subassembly'
    import { deleteBatchPurchaseOrder, getPurchaseOrderPageList } from '../../../../../api/materialEquipmentManagement/procurementManagement/purchaseOrder'
    import { delbashSelfPurchaseOrder } from '@/api/selfProject/selfProprietaryProcurement/purchaseOrder'
    import projectInfo from '../../../../projectManagement/selfSupportProjectDetail/components/commenInfo/projectInfo' 
    import { mapState } from 'vuex'

    import util from '@/libs/util.js'
    export default {
        data () {
            return {
                filterText: '',
                scopeCeiling: '',
                scopeFloor: '',
                invoice: '',
                invoiceOptions:[
                    {
                        id: '0',
                        name: '否'
                    },
                    {
                        id: '1',
                        name: '是'
                    }
                ],
                inventoryStatus: '',
                inventoryStatusOptions:[
                    {
                        id: '0',
                        name: '待入库'
                    },
                    {
                        id: '1',
                        name: '部分入库'
                    },
                    {
                        id: '2',
                        name: '已入库'
                    },
                    {
                        id: '3',
                        name: '终止入库'
                    }
                ],
                defaultProp: {
                    value: 'id',
                    label: 'name'
                },
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
                        prop: 'indentNumber',
                        label: '采购订单编号',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = true
                                        this.routerLink ('采购订单详情', parms.row.id)
                                    }
                                }
                            }, parms.row.indentNumber)
                        }
                    },
                    {
                        prop: 'indentName',
                        label: '采购订单名称',
                        isShow: true
                    },
                    {
                        prop: 'orderAmount',
                        label: '订单总金额',
                        isShow: true
                    },
                    {
                        prop: 'meansPayments',
                        label: '付款方式',
                        isShow: true
                    },
                    {
                        prop: 'orderType',
                        label: '订单类型',
                        isShow: true
                    },
                    {
                        prop: 'invoiceName',
                        label: '是否开票',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {
                            }, parms.row.invoiceName = parms.row.invoice == '0' ? '否' : '是')
                        }
                    },
                    {
                        prop: 'returnPeriod',
                        label: '退换货期限',
                        isShow: true,
                    },
                    {
                        prop: 'inventoryStatusName',
                        label: '货物状态',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'danger-Color': parms.row.inventoryStatus == '0' || parms.row.inventoryStatus == '3'? true : false,
                                    'warning-Color': parms.row.inventoryStatus == '1' ? true : false,
                                    'success-Color': parms.row.inventoryStatus == '2' ? true : false,
                                },
                            }, parms.row.inventoryStatusName = util.inventoryStatus (parms.row.inventoryStatus))
                        }
                    },
                    {
                        prop: 'createName',
                        label: '申请人',
                        isShow: true,
                    },
                    {
                        prop: 'createTime',
                        label: '申请时间',
                        isShow: true,
                    },
                    {
                        prop: '',
                        label: '操作',
                        isShow: true,
                        fixed: 'right',
                        width: '150',
                        render: (h, parms) => {
                            return [
                                ( this.$route.params.identification == '1' ? this.$has('self:procurement:indent:edit') :
                                    this.$has ('material:procurement:indent:edit') ) ? h ('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    attrs: {
                                        disabled:  parms.row.createBy != util.cookies.get ('uuid') ? true :  parms.row.procState == '1' ? false : true
                                    },
                                    on:{
                                        click: () => {
                                            this.transform.isShowDetails = false
                                            this.routerLink ('采购订单编辑', parms.row.id)
                                        }
                                    }
                                }, '编辑') : '',
                                ( this.$route.params.identification == '1' ? this.$has('self:procurement:indent:delete') :
                                    this.$has ('material:procurement:indent:delete') ) ? h ('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    attrs: {
                                        disabled:  parms.row.createBy != util.cookies.get ('uuid') ? true :  parms.row.procState == '1' ? false : true
                                    },
                                    on:{
                                        click: () => {
                                            this.deletePurchaseOrderObject (parms.row.id)
                                        }
                                    }
                                }, '删除') : ''
                            ]
                        }
                    }
                ],
                relevanceProjectId: null
            }
        },

        methods: {

            selectChange (item) {
                this.tableSelectData = item
            },

            searchModelSynopsis (boolean = true) {
                if (boolean) this.resetPage ()
                this.getPurchaseOrderPage ({
                    'name': this.filterText ? this.filterText : null,
                    'createTime': this.createDate ? this.createDate[0] : null,
                    'updateTime': this.createDate ? this.createDate[1] : null,
                    'scopeCeiling': this.scopeCeiling ? this.scopeCeiling : '',
                    'scopeFloor': this.scopeFloor ? this.scopeFloor : '',
                    'invoice': this.invoice ? this.invoice : null,
                    'inventoryStatus': this.inventoryStatus ? this.inventoryStatus :  ''
                    })
            },

            handlePaginationChange (page) {
                this.page = page;
                this.$nextTick(() => {
                    this.searchModelSynopsis (false)
                });
            },

            getPurchaseOrderPage (text) {
                getPurchaseOrderPageList ({
                    ...text,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size,
                    'relevanceProjectId': this.relevanceProjectId
                }).then( res => {
                    if (res) this.tableData = res
                })
            },

            deletePurchaseOrderObject (id) {
                this.deletePurchaseOrderById ({'ids': id})
            },

            deletePurchaseOrderList () {
                if (this.tableSelectData.length === 0) {
                    this.$message.warning ('请选择一条数据')
                    return
                }
                let ids = '', procInName = ''
                if (this.tableSelectData && this.tableSelectData.length > 0) {
                    this.tableSelectData.forEach(res => {
                        ids += res.id + ','
                        if (res.procState !== '1') procInName += res.indentName + ',' 
                    })
                }

                if (procInName) {
                    this.$message.warning (`${procInName} 已提交流程无法删除`)
                    return
                }
                this.deletePurchaseOrderById ({'ids': ids.substring(0, ids.length - 1)})
            },

            deletePurchaseOrderById (id) {
                util.confirm ().then (boolean => {
                    if (boolean) {
                        let url = ''
                        this.$route.params.identification == '1' ? url = delbashSelfPurchaseOrder : deleteBatchPurchaseOrder
                        url (id).then(res => {
                            if (res.code === 200) {
                                this.$message.success(res.message)
                                this.getPurchaseOrderPage ()
                            }
                        })
                    }
                })
            },

            addPurchaseOrder () {
                this.transform.isShowDetails = false
                this.routerLink ('添加采购订单')
            },

            resetModelSynopsis () {
                this.filterText = this.scopeCeiling = this.scopeFloor = this.invoice = this.inventoryStatus = ''
                this.createDate = []
                this.resetPage ()
                this.getPurchaseOrderPage ()
            },

            exportExcel () {
                this.$refs.table.getExportExcel ()
            },

            printTable () {
                this.$refs.table.printTable (this.tableSelectData)
            },

            resetPage () {
                this.page = {
                    current: 1,
                    size: 10,
                    total: 0
                }
            },

            initLoadData () {
                if (this.$route.params && this.$route.params.identification) {
                    this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad')
                } else {
                    this.getPurchaseOrderPage ()
                }
            },

            routerLink (title, id = '') {
                this.$router.push ({
                    path: 'addPurchaseOrder',
                    name: 'addPurchaseOrder',
                    params: {
                        relevancyId: id,
                        transform: this.transform,
                        identification: this.$route.params.identification,
                        path: this.$route.params.identification ? 'purchaseOrder/selfSupportProject/1' : 'purchaseOrder'
                    }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            },
        },

        components: {
            'qqt-table': qqtTable,
            'qqt-select': qqtSelect,
            'project-info': projectInfo
        },

        created () {
            this.initLoadData ()
        },

        computed: {
            ...mapState ('d2admin/selfSupportProject', [
                'selfSupportProject'
            ])
        },

        watch: {
            selfSupportProject (val) {
                this.relevanceProjectId = val.projectCode
                this.getPurchaseOrderPage ()
            }
        }
    }

</script>

<style scoped>
    .purchase_order {
        font-size: 14px;
        margin: 0 8px;
    }
</style>
