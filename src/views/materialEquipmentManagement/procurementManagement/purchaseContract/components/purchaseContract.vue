<template>
    <d2-container type="fulls">
        <template slot="header">
            <div v-if="this.$route.params.identification == '1' ">
                <project-info></project-info>
            </div>
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header-operation___left" v-if="$route.params.identification == '1' ? $has('self:procurement:contract:add') : $has ('material:procurement:contract:add')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addPurchaseContract">添加</el-button>
                </span>
                <span class="qqt-container-full-header___search">
                    <el-input
                        placeholder="请输入内容"
                        prefix-icon="el-icon-search"
                        @keyup.enter.native="searchModelSynopsis"
                        v-model="filterText" size="mini">
                    </el-input>
                </span>
                <span class="contract_amount">合同金额</span>
                <span class="qqt-container-full-header___search">
                    <el-input
                        placeholder="请输入金额下限"
                        v-model="scopeFloor" size="mini">
                    </el-input>
                </span>
                ~
                <span  class="qqt-container-full-header___search">
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
                        type="daterange"
                        :picker-options="pickerOptions"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="searchModelSynopsis()" 
                        align="right">
                    </el-date-picker>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <p>订单状态:</p>
                    <div class="qqt-container-full-header-state___select">
                        <qqt-select :value="contractStatus" :options="contractStatusOptions" :defaultProp="defaultProp" :size="'mini'" :placeholder="'请选择'" @select="contractStatus = $event, searchModelSynopsis()"></qqt-select>
                    </div>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <p>中止状态:</p>
                    <div class="qqt-container-full-header-state___select">
                        <qqt-select :value="discontinue" :options="discontinueOption" :defaultProp="defaultProp" :size="'mini'" :placeholder="'请选择'" @select="discontinue = $event, searchModelSynopsis()"></qqt-select>
                    </div>
                </span>
                <span class="qqt-container-full-header-operation___right" v-if="$route.params.identification == '1' ? $has('self:procurement:contract:delete') : $has ('material:procurement:contract:delete')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deletePurchaseContractList">批量删除</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                        <el-button size="mini" @click="exportExcel" icon="el-icon-upload2">导出</el-button>
                        <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                    </el-button-group>
                </span>
                <span class="qqt-container-full-header-operation___right" v-if="$route.params.identification == '1' ? $has('self:procurement:indent:add') : $has ('material:procurement:contract:indent:add')">
                    <el-button-group>
                        <el-button size="mini" @click="generatePurchaseData ('addPurchaseOrder')" icon="el-icon-upload2">生成采购订单</el-button>
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
    import { getPurchaseContractPageList, deleteBatchPurchaseContract, purchaseContractProceed } from '../../../../../api/materialEquipmentManagement/procurementManagement/purchaseContract'
    import { delbashSelfPurchaseContract, selfPurchaseTerminateSontract } from '@/api/selfProject/selfProprietaryProcurement/purchaseContract'
    import { mapState } from 'vuex'
    import projectInfo from '../../../../projectManagement/selfSupportProjectDetail/components/commenInfo/projectInfo' 

    import util from '@/libs/util.js'
    export default {
        data () {
            return {
                filterText: '',
                contractStatus: '',
                contractStatusOptions:[
                    {
                        id: '0',
                        name: '未使用'
                    },
                    {
                        id: '1',
                        name: '部分使用'
                    },
                    {
                        id: '2',
                        name: '全部使用'
                    }
                ],
                discontinue: '',
                discontinueOption:[
                    {
                        id: '0',
                        name: '未中止'
                    },
                    {
                        id: '1',
                        name: '已中止'
                    }
                ],
                defaultProp: {
                    value: 'id',
                    label: 'name'
                },
                scopeCeiling: '',
                scopeFloor: '',
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
                        prop: 'contractNumber',
                        label: '采购合同单编号',
                        isShow: true,
                        width: '160px',
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = true
                                        this.routerLink ('采购合同详情', 'addPurchaseContract', parms.row.procInstId, parms.row.id)
                                    }
                                }
                            }, parms.row.contractNumber)
                        }
                    },
                    {
                        prop: 'contractName',
                        label: '采购合同单名称',
                        width: '230px',
                        isShow: true
                    },
                    {
                        prop: 'materialType',
                        label: '物资类别',
                        isShow: true
                    },
                    {
                        prop: 'supplySide',
                        label: '供方',
                        isShow: true
                    },
                    {
                        prop: 'needSide',
                        label: '需方',
                        isShow: true,
                    },
                    {
                        prop: 'contractStatusName',
                        label: '生成订单',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {}, parms.row['contractStatusName'] = parms.row.contractStatus == '0' ? '未使用' : parms.row.contractStatus == '1' ? '部分使用': '全部使用' )
                        }
                    },
                    {
                        prop: 'contractAmountToMoney',
                        label: '合同金额',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {}, parms.row['contractAmountToMoney'] = util.moneyTransform (parms.row.contractAmount))
                        }
                    },
                    {
                        prop: 'procStateName',
                        label: '办理状态',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {},
                                parms.row.procStateName = util.handleState (parms.row.procState)
                            )
                        }
                    },
                    {
                        prop: 'discontinueName',
                        label: '中止状态',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {},
                                parms.row.discontinueName = parms.row.discontinue == '1' ? '已终止' : '未中止'
                            )
                        }
                    },
                    {
                        prop: 'dateSigning',
                        label: '签订时间',
                        isShow: true,
                    },
                    {
                        prop: '',
                        label: '操作',
                        isShow: true,
                        width: '230px',
                        fixed: 'right',
                        render: (h, parms) => {
                            return [
                                ( this.$route.params.identification == '1' ? this.$has('self:procurement:contract:discontinue') : 
                                    this.$has ('material:procurement:contract:discontinue') ) ? h ('el-button', {
                                    props:{
                                        type: 'danger',
                                        size: 'mini',
                                        round: true
                                    },
                                    style: {
                                        padding: '5px 10px'
                                    },
                                    attrs: {
                                        disabled: parms.row.procState != '10' ? true : parms.row.discontinue == '1' ? true : false
                                    },
                                    on:{
                                        click: () => {
                                            util.confirm ('是否要中止合同').then (boolean => {
                                                if (boolean) {
                                                    this.updataPurchaseContractProceed (parms.row.id)
                                                }
                                            })
                                        }
                                    }
                                }, '合同中止') : '',
                                ( this.$route.params.identification == '1' ? this.$has('self:procurement:contract:edit') : 
                                    this.$has ('material:procurement:contract:edit') ) ? h ('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    attrs: {
                                        disabled: util.isDisabled (parms.row.procState)
                                    },
                                    on:{
                                        click: () => {
                                            this.transform.isShowDetails = false
                                            this.routerLink ('采购合同编辑', 'addPurchaseContract', parms.row.procInstId, parms.row.id)
                                        }
                                    }
                                }, '编辑') : '',
                                ( this.$route.params.identification == '1' ? this.$has('self:procurement:contract:delete') : 
                                    this.$has ('material:procurement:contract:delete') ) ? h ('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    attrs: {
                                        disabled: util.isDisabled (parms.row.procState)
                                    },
                                    on:{
                                        click: () => {
                                            this.deletePurchaseContractObject (parms.row.id)
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
                this.getPurchaseContractPage ({
                    'name': this.filterText ? this.filterText : null,
                    'createTime': this.createDate ? this.createDate[0] : null,
                    'updateTime': this.createDate ? this.createDate[1] : null,
                    'contractStatus': this.contractStatus ? this.contractStatus : null,
                    'discontinue': this.discontinue ? this.discontinue : null,
                    'scopeCeiling': this.scopeCeiling ? this.scopeCeiling : '',
                    'scopeFloor': this.scopeFloor ? this.scopeFloor : ''
                })
            },

            handlePaginationChange (page) {
                this.page = page;
                this.$nextTick(() => {
                    this.searchModelSynopsis (false)
                });
            },

            getPurchaseContractPage (text) {
                getPurchaseContractPageList ({
                    ...text,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size,
                    'relevanceProjectId': this.relevanceProjectId
                }).then( res => {
                    if (res) this.tableData = res
                })
            },

            deletePurchaseContractObject (id) {
                this.deletePurchaseContractById ({ 'ids': id, 'projectCode': this.relevanceProjectId })
            },

            deletePurchaseContractList () {
                if (this.tableSelectData.length === 0) {
                    this.$message.warning ('请选择一条数据')
                    return
                }

                let ids = '', procInName = ''
                if (this.tableSelectData && this.tableSelectData.length > 0) {
                    this.tableSelectData.forEach(res => {
                        ids += res.id + ','
                        if (res.procState !== '1') procInName += res.contractName + ',' 
                    })
                }

                if (procInName) {
                    this.$message.warning (`${procInName} 已提交流程无法删除`)
                    return
                }

                let str = ''
                this.tableSelectData.filter ( f => str += f.id + ',')
                this.deletePurchaseContractById ({'ids': ids.substring(0, ids.length - 1), 'projectCode': this.relevanceProjectId })
            },

            deletePurchaseContractById (data) {
                util.confirm ().then (boolean => {
                    if (boolean) {
                        let url = ''
                        this.$route.params.identification == '1' ? url = delbashSelfPurchaseContract : url = deleteBatchPurchaseContract
                        url (data).then(res => {
                            if (res.code === 200) {
                                this.$message.success(res.message)
                                this.getPurchaseContractPage ()
                            }
                        })
                    }
                })
            },

            updataPurchaseContractProceed (id) {
                let url = ''
                this.$route.params.identification == '1' ? url = selfPurchaseTerminateSontract : url = purchaseContractProceed
                url ({'id': id}).then (res => {
                    if (res.code == 200) this.$message.success (res.message), this.getPurchaseContractPage ()
                })
            },

            addPurchaseContract () {
                this.transform.isShowDetails = false
                this.routerLink ('添加采购合同', 'addPurchaseContract')
            },

            resetModelSynopsis () {
                this.filterText = this.discontinue = this.discontinue = this.scopeCeiling = this.scopeFloor = this.contractStatus = ''
                this.createDate = []
                this.resetPage ()
                this.getPurchaseContractPage ()
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

            generatePurchaseData (name) {
                let str = '生成采购订单'
                this.transform.isShowDetails = false
                switch (this.tableSelectData.length) {
                    case 1:
                        this.tableSelectData[0].procState == '10' ? this.tableSelectData[0].contractStatus != '2' && this.tableSelectData[0].discontinue == '0' ?  this.routerLink (str, name, '', '', this.tableSelectData[0]) : this.$message.warning ('当前数据已使用') : this.$message.warning ('选择流程完结的数据')
                        break
                    default:
                        this.$message.warning ('至多选择一条数据')
                        break
                }
            },

            initLoadData () {
                if (this.$route.params && this.$route.params.identification) {
                    this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad')
                } else {
                    this.getPurchaseContractPage ()
                }
            },

            routerLink (title, router, procInstId, id = '', data = {}) {
                this.$router.push ({
                    path: router,
                    name: router,
                    params: {
                        relevancyId: id,
                        isContract: true,
                        dataSource: data,
                        procInstId: procInstId,
                        transform: this.transform,
                        relevanceProjectId: this.relevanceProjectId,
                        identification: this.$route.params.identification,
                        path: this.$route.params.identification ? 'purchaseContract/selfSupportProject/1' : 'purchaseContract'
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
                this.getPurchaseContractPage ()
            }
        }
    }

</script>

<style scoped>
    .contract_amount {
        font-size: 14px;
        margin: 0 8px;
    }
</style>
