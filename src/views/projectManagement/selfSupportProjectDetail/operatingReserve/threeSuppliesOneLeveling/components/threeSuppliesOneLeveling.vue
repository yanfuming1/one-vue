<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <project-info></project-info>
                <span class="qqt-container-full-header-operation___left">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addThreeSuppliesOneLeveling">添加</el-button>
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
                <span class="qqt-container-full-header-operation___right">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deleteThreeSuppliesOneLevelingList">批量删除</el-button>
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
    import { getThreeSuppliesOneLevelingPageList, deleteBatchThreeSuppliesOneLeveling } from '@/api/selfProject/operatingReserve/threeSuppliesOneLeveling'
    import { qqtTable } from '@/components/qqt-subassembly'
    import { mapState } from 'vuex'

    import projectInfo from '../../../components/commenInfo/projectInfo'
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
                        prop: 'procStateName',
                        label: '办理状态',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = true
                                        this.routerLink ('三通一平详情', parms.row.id, parms.row.procInstId)
                                    }
                                }
                            },
                                parms.row.procStateName = util.handleState (parms.row.procState)
                            )
                        }
                    },
                    {
                        prop: 'typeName',
                        label: '三通类型',
                        isShow: true
                    },
                    {
                        prop: 'responsibleDepartment',
                        label: '责任部门',
                        isShow: true
                    },
                    {
                        prop: 'principal',
                        label: '责任人',
                        isShow: true
                    },
                    {
                        prop: 'planDeadline',
                        label: '计划工期(天)',
                        isShow: true
                    },
                    {
                        prop: 'realityDeadline',
                        label: '实际工期(天)',
                        isShow: true,
                    },
                    {
                        prop: 'untitled',
                        label: '滞后/提前(天)',
                        isShow: true,
                        // render: (h, parms) => {
                        //     return h('div', {},
                        //         parms.row.layAhead = parms.row.realityDeadline && parms.row.planDeadline 
                        //             ? Number.parseFloat (parms.row.realityDeadline) || 0 - Number.parseFloat (parms.row.planDeadline) || 0 : 0
                        //     )
                        // }
                    },
                    {
                        prop: 'constructionBudget',
                        label: '施工预算(元)',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {}, util.moneyTransform(parms.row.constructionBudget))
                        }
                    },
                    {
                        prop: 'realityBudget',
                        label: '完工预算(元)',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {},  util.moneyTransform(parms.row.realityBudget))
                        }
                    },
                    {
                        prop: 'overspend',
                        label: '超支/结余(元)',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {},  util.moneyTransform(parms.row.overspend))
                        }
                    },
                    {
                        prop: 'createName',
                        label: '登记人',
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
                        width: '150',
                        render: (h, parms) => {
                            return [
                                h('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    attrs: {
                                        disabled: util.isDisabled (parms.row.procState)
                                    },
                                    on:{
                                        click: () => {
                                            this.transform.isShowDetails = false
                                            this.routerLink ('三通一平编辑', parms.row.id, parms.row.procInstId)
                                        }
                                    }
                                }, '编辑'),
                                h('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    attrs: {
                                        disabled: util.isDisabled (parms.row.procState)
                                    },
                                    on:{
                                        click: () => {
                                            this.deleteThreeSuppliesOneLevelingObject (parms.row.id)
                                        }
                                    }
                                }, '删除')
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

            searchModelSynopsis (boolean = true) {
                if (boolean) this.resetPage ()
                this.getThreeSuppliesOneLevelingPage ({
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

            getThreeSuppliesOneLevelingPage (text) {
                getThreeSuppliesOneLevelingPageList ({
                    ...text,
                    'projectCode': this.selfSupportProject.projectCode,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size
                }).then( res => {
                    if (res) this.tableData = res
                })
            },

            deleteThreeSuppliesOneLevelingObject (id) {
                this.deleteThreeSuppliesOneLevelingById ({'ids': id})
            },

            deleteThreeSuppliesOneLevelingList () {
                if (this.tableSelectData.length === 0) {
                    this.$message.warning ('请选择一条数据')
                    return
                }
                let ids = '', procInName = ''
                if (this.tableSelectData && this.tableSelectData.length > 0) {
                    this.tableSelectData.forEach(res => {
                        ids += res.id + ','
                        if (res.procState !== '1') procInName += res.typeName + ',' 
                    })
                }

                if (procInName) {
                    this.$message.warning (`已提交流程无法删除`)
                    return
                }
                this.deleteThreeSuppliesOneLevelingById ({'ids': ids.substring(0, ids.length - 1)})
            },

            deleteThreeSuppliesOneLevelingById (id) {
                util.confirm ().then (boolean => {
                    if (boolean) {
                        deleteBatchThreeSuppliesOneLeveling (id).then(res => {
                            if (res.code === 200) {
                                this.$message.success(res.message)
                                this.getThreeSuppliesOneLevelingPage ()
                            }
                        })
                    }
                })
            },

            addThreeSuppliesOneLeveling () {
                this.transform.isShowDetails = false
                this.routerLink ('添加三通一平')
            },

            resetModelSynopsis () {
                this.filterText = ''
                this.createDate = []
                this.resetPage ()
                this.getThreeSuppliesOneLevelingPage ()
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

            routerLink (title, id = '', procInstId) {
                this.$router.push ({
                    path: 'addThreeSuppliesOneLeveling',
                    name: 'addThreeSuppliesOneLeveling',
                    params: {
                        relevancyId: id,
                        procInstId: procInstId,
                        transform: this.transform,
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
            this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad')
        },

        computed: {
            ...mapState ('d2admin/selfSupportProject', [
                'selfSupportProject'
            ])
        },

        watch: {
            selfSupportProject () {
                this.getThreeSuppliesOneLevelingPage ()
            }
        }
    }

</script>
