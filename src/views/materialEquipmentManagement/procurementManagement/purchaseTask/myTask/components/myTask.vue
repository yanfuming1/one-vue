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
                <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                        <el-button size="mini" v-if=" $route.params.identification == '1' ? $has('self:procurement:contract:add') : $has ('material:procurement:task:contract:add')" @click="generatePurchaseData ('addPurchaseContract')" icon="el-icon-upload2">生成采购合同</el-button>
                        <el-button size="mini" v-if="$route.params.identification == '1' ? $has('self:procurement:indent:add') : $has ('material:procurement:task:indent:add')" @click="generatePurchaseData ('addPurchaseOrder')" icon="el-icon-upload2">生成采购订单</el-button>
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
    import { qqtTable } from '../../../../../../components/qqt-subassembly'
    import { getMyPurchaseTaskPageList, getPurchaseTaskById, updataMyPurchaseTaskProceedStatus } from '../../../../../../api/materialEquipmentManagement/procurementManagement/purchaseTask'
    import { mapState } from 'vuex'
    import projectInfo from '../../../../../projectManagement/selfSupportProjectDetail/components/commenInfo/projectInfo' 
    import { selfPurchasePerform } from '@/api/selfProject/selfProprietaryProcurement/purchaseTask'
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
                        prop: 'taskCode',
                        label: '采购任务单编号',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = true
                                        this.routerLink ('采购任务详情', 'updataAllTask', parms.row.id)
                                    }
                                }
                            }, parms.row.taskCode)
                        }
                    },
                    {
                        prop: 'taskName',
                        label: '采购任务单名称',
                        isShow: true
                    },
                    {
                        prop: 'applyCode',
                        label: '采购申请单编号',
                        isShow: true
                    },
                    {
                        prop: 'relevanceProject',
                        label: '项目名称',
                        isShow: true
                    },
                    {
                        prop: 'section',
                        label: '标段',
                        isShow: true,
                    },
                    {
                        prop: 'isEndName',
                        label: '任务状态',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {},
                                parms.row.isEndName = parms.row.isTermination == '1' 
                                    ? '已撤回' : parms.row.state == '0' 
                                        ? '未使用' : parms.row.state == '1' 
                                            ? '部分使用' : parms.row.state == '2'
                                                ? '全部使用' : ''
                            )
                        }
                    },
                    {
                        prop: 'createName',
                        label: '分解人',
                        isShow: true,
                    },
                    {
                        prop: 'proposerDepartment',
                        label: '工作部门',
                        isShow: true,
                    },
                    {
                        prop: 'createTime',
                        label: '登记时间',
                        isShow: true,
                    },
                    {
                        prop: '',
                        label: '操作',
                        isShow: true,
                        fixed: 'right',
                        width: '100',
                        render: (h, parms) => {
                            return [
                                (this.$route.params.identification == '1' ?  this.$has ('self:procurement:task:performTask') : 
                                    this.$has ('material:procurement:task:performTask') ) ? h('el-button', {
                                    props:{
                                        type: 'danger',
                                        size: 'mini',
                                        round: true
                                    },
                                    style: {
                                        padding: '5px 10px'
                                    },
                                    attrs: {
                                        disabled: parms.row.isTermination == '1' ? true : parms.row.isEnd == '0' ? false : true
                                    },
                                    on:{
                                        click: () => {
                                            util.confirm ('是否要完成任务').then (boolean => {
                                                if (boolean) {
                                                    this.updataMyPurchaseTaskProceed (parms.row.id)
                                                }
                                            })
                                        }
                                    }
                                }, '任务完结') : '',
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
                this.getMyTaskPage ({
                    'name': this.filterText ? this.filterText : null,
                    'createTime': this.createDate ? this.createDate[0] : null,
                    'updateTime': this.createDate ? this.createDate[1] : null})
            },

            handlePaginationChange (page) {
                this.page = page;
                this.$nextTick(() => {
                    this.searchModelSynopsis (false)
                });
            },

            getMyTaskPage (text) {
                getMyPurchaseTaskPageList ({
                    ...text,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size,
                    'relevanceProjectId': this.relevanceProjectId
                }).then( res => {
                    if (res) this.tableData = res
                })
            },

            updataMyPurchaseTaskProceed (id) {
                let url = ''
                this.$route.params.identification == '1' ? url = selfPurchasePerform : url = updataMyPurchaseTaskProceedStatus
                url ({
                    'id': id,
                    'projectCode': this.selfSupportProject.projectCode
                }).then (res => {
                    if (res.code === 200) this.$message.success (res.message), this.getMyTaskPage ()
                })
            },

            resetModelSynopsis () {
                this.filterText = ''
                this.createDate = []
                this.resetPage ()
                this.getMyTaskPage ()
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

            generatePurchaseData (str) {
                let name = str == 'addPurchaseContract' ? '生成采购合同' : '生成采购订单'
                switch (this.tableSelectData.length) {
                    case 1:
                        this.tableSelectData[0].isEnd == '0' && this.tableSelectData[0].isTermination == '0' && this.tableSelectData[0].state != '2' ? this.routerLink (name, str, '', this.tableSelectData[0]) : this.$message.warning ('只能选择任务状态为进行中的')
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
                    this.getMyTaskPage ()
                }
            },

            routerLink (title, router, id = '', data = {}) {
                this.$router.push ({
                    path: router,
                    name: router,
                    params: {
                        relevancyId: id,
                        transform: this.transform,
                        isTaskDecomposition: true,
                        dataSource: data,
                        identification: this.$route.params.identification,
                        path: this.$route.params.identification ? 'purchaseTask/myTask/selfSupportProject/1' : 'purchaseTask/myTask'
                    }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            },
        },

        components: {
            'qqt-table': qqtTable,
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
                this.getMyTaskPage ()
            }
        }
    }

</script>
