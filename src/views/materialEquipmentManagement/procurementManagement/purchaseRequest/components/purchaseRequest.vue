<template>
    <d2-container type="fulls">
        <template slot="header">
            <div v-if="this.$route.params.identification == '1' ">
                <project-info></project-info>
            </div>
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header-operation___left" v-if="$route.params.identification == '1' ? $has ('self:procurement:request:add') : $has ('material:procurement:request:add')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addPurchaseRequest">添加</el-button>
                </span>
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
                <span class="qqt-container-full-header-operation___right" v-if="$route.params.identification == '1' ? $has ('self:procurement:request:delete') : $has ('material:procurement:request:delete')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deletePurchaseRequestList">批量删除</el-button>
                </span>
                <!-- <span class="qqt-container-full-header-operation___right">
                    <p>审核状态:</p>
                    <div class="qqt-container-full-header-state___select">
                        <qqt-select :value="audit" :options="auditOptions" :size="'mini'" :placeholder="'请选择'" @select="page.current = 1, page.size = 10, audit = $event, searchModelSynopsis ()"></qqt-select>
                    </div>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <p>办理状态:</p>
                    <div class="qqt-container-full-header-state___select">
                        <qqt-select :value="procState" :options="options" :size="'mini'" :placeholder="'请选择'" @select="page.current = 1, page.size = 10, procState = $event, searchModelSynopsis ()"></qqt-select>
                    </div>
                </span> -->
                <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                        <el-button size="mini" @click="exportExcel" icon="el-icon-upload2">导出</el-button>
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
        <div class="qqt-container-full___center">
            <qqt-table :data="tableData" ref="table" :exportData="tableData.records" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange" />
        </div>
    </d2-container>
</template>

<script>
    import { qqtTable, qqtSelect } from '../../../../../components/qqt-subassembly'
    import { getPurchaseRequestPageList, deleteBatchPurchaseRequest, checkAgainstPurchaseRequest } from '../../../../../api/materialEquipmentManagement/procurementManagement/purchaseRequest'
    import { delbashSelfpurchaseRequest } from '@/api/selfProject/selfProprietaryProcurement/purchaseRequest'
    import { mapState } from 'vuex'
    import projectInfo from '../../../../projectManagement/selfSupportProjectDetail/components/commenInfo/projectInfo' 

    import util from '@/libs/util.js'
    export default {
        data () {
            return {
                filterText: '',
                audit: '',
                procState: '',
                options: [
                    {
                        value: '1',
                        label: '初始化'
                    },
                    {
                        value: '2',
                        label: '待审批'
                    },
                    {
                        value: '3',
                        label: '审批中'
                    },
                    {
                        value: '4',
                        label: '已驳回'
                    },
                    {
                        value: '5',
                        label: '已作废'
                    },
                    {
                        value: '6',
                        label: '待提交'
                    },
                    {
                        value: '10',
                        label: '已完结'
                    }
                ],
                auditOptions: [
                    {
                        value: '0',
                        label: '未审核'
                    },
                    {
                        value: '1',
                        label: '已审核'
                    }
                ],
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
                        prop: 'applyCode',
                        label: '采购申请单编号',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = true
                                        this.routerLink ('采购申请详情', parms.row.procInstId, parms.row.id)
                                    }
                                }
                            }, parms.row.applyCode)
                        }
                    },
                    {
                        prop: 'applyName',
                        label: '采购申请单名称',
                        isShow: true
                    },
                    {
                        prop: 'buyType',
                        label: '采购类型',
                        isShow: true
                    },
                    {
                        prop: 'agent',
                        label: '待办人',
                        isShow: true
                    },
                    {
                        prop: 'createName',
                        label: '申请人',
                        isShow: true
                    },
                    {
                        prop: 'departmentName',
                        label: '工作部门',
                        isShow: true,
                    },
                    {
                        prop: 'auditName',
                        label: '审核状态',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {},
                                parms.row.auditName = parms.row.state == '0' ? '未审核' : '已审核'
                            )
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
                        prop: 'createTime',
                        label: '申请时间',
                        isShow: true,
                        width: '160'
                    },
                    {
                        prop: '',
                        label: '操作',
                        isShow: true,
                        fixed: 'right',
                        width: '150',
                        render: (h, parms) => {
                            return [
                                ( this.$route.params.identification == '1' ? this.$has('self:procurement:request:edit') : 
                                    this.$has ('material:procurement:request:edit') ) ? h ('el-button', {
                                        props:{
                                            type: 'text',
                                        },
                                        attrs: {
                                            disabled: util.isDisabled (parms.row.procState)
                                        },
                                        on:{
                                            click: () => {
                                                this.transform.isShowDetails = false
                                                this.routerLink ('采购申请编辑', parms.row.procInstId, parms.row.id)
                                            }
                                        }
                                    }, '编辑') : '',
                                (this.$route.params.identification == '1' ? this.$has('self:procurement:request:delete') : 
                                    this.$has ('material:procurement:request:delete') ) ? h ('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    attrs: {
                                        disabled: util.isDisabled (parms.row.procState)
                                    },
                                    on:{
                                        click: () => {
                                            this.deletePurchaseRequestObject (parms.row.id)
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
                this.getPurchaseRequestPage ({
                    'name': this.filterText ? this.filterText : null,
                    'state': this.audit ? this.audit : null,
                    'procState': this.procState ? this.procState : null,
                    'createTime': this.createDate ? this.createDate[0] : null,
                    'updateTime': this.createDate ? this.createDate[1] : null})
            },

            handlePaginationChange (page) {
                this.page = page;
                this.$nextTick(() => {
                    this.searchModelSynopsis (false)
                });
            },

            getPurchaseRequestPage (text) {
                getPurchaseRequestPageList ({
                    ...text,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size,
                    'relevanceProjectId': this.relevanceProjectId
                }).then( res => {
                    if (res) this.tableData = res
                })
            },

            deletePurchaseRequestObject (id) {
                this.deletePurchaseRequestById ({'ids': id, 'projectCode': this.relevanceProjectId})
            },

            deletePurchaseRequestList () {
                if (this.tableSelectData.length === 0) {
                    this.$message.warning ('请选择一条数据')
                    return
                }
                let ids = '', procInName = ''
                if (this.tableSelectData && this.tableSelectData.length > 0) {
                    this.tableSelectData.forEach(res => {
                        ids += res.id + ','
                        if (res.procState !== '1') procInName += res.applyName + ',' 
                    })
                }

                if (procInName) {
                    this.$message.warning (`${procInName} 已提交流程无法删除`)
                    return
                }
                let data = {
                    'ids': ids.substring(0, ids.length - 1),
                    'projectCode': this.relevanceProjectId
                }
                this.deletePurchaseRequestById (data)
            },

            deletePurchaseRequestById (data) {
                util.confirm ().then (boolean => {
                    if (boolean) {
                        let url = ''
                        this.$route.params.identification == '1' ? url = delbashSelfpurchaseRequest : deleteBatchPurchaseRequest
                        url (data).then(res => {
                            if (res.code === 200) {
                                this.$message.success(res.message)
                                this.getPurchaseRequestPage ()
                            }
                        })
                    }
                })
            },

            checkAgainstPurchaseRequestData (type) {
                if (this.tableSelectData.length !== 1) {
                    this.$message.warning ('请选择一条数据')
                    return
                }
                switch (type) {
                    case '1':
                        if (this.tableSelectData[0]['state'] === '0') {
                            this.checkPrintsPurchaseRequest (this.tableSelectData[0], type)
                        } else {
                            this.$message.warning ('数据已审核')
                        }
                        break;
                    case '0':
                        if (this.tableSelectData[0]['state'] === '1') {
                            this.checkPrintsPurchaseRequest (this.tableSelectData[0], type)
                        } else {
                            this.$message.warning ('数据未审核')
                        }
                        break;
                }
            },

            checkPrintsPurchaseRequest (data, type) {
                checkAgainstPurchaseRequest ({'id': data.id, 'type': type}).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.getPurchaseRequestPage ()
                    }
                })
            },

            addPurchaseRequest () {
                this.transform.isShowDetails = false
                this.routerLink ('添加采购申请')
            },

            resetModelSynopsis () {
                this.filterText = this.procState = this.state = ''
                this.createDate = []
                this.resetPage ()
                this.getPurchaseRequestPage ()
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
                    this.getPurchaseRequestPage ()
                }
            },

            routerLink (title, procInstId, id = '') {
                this.$router.push ({
                    path: 'addPurchaseRequest',
                    name: 'addPurchaseRequest',
                    params: {
                        relevancyId: id,
                        procInstId: procInstId,
                        transform: this.transform,
                        relevanceProjectId: this.relevanceProjectId,
                        identification: this.$route.params.identification,
                        path: this.$route.params.identification ? 'purchaseRequest/selfSupportProject/1' : 'purchaseRequest'
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
                this.getPurchaseRequestPage ()
            }
        }
    }

</script>
