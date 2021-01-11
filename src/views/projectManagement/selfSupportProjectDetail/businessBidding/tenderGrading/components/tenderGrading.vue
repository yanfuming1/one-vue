<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <project-info></project-info>
                <span class="qqt-container-full-header-operation___left">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addTenderGrading">添加评分</el-button>
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
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deleteTenderGradingList">批量删除</el-button>
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
    import { getTenderGradingPageList, deleteBatchTenderGrading } from '@/api/selfProject/businessBidding/tenderGrading'
    import { qqtTable } from '@/components/qqt-subassembly'
    import { mapState } from 'vuex'

    import projectInfo from '../../../components/commenInfo/projectInfo'
    import util from '@/libs/util.js'
    export default {
        data () {
            return {
                filterText: '',
                options: [],
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
                rowHeader: [
                    {
                        prop: 'giveCondition',
                        label: '赋分条件',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = true
                                        this.routerLink ('评分规则详情', (parms.row.id).split (':')[0], parms.row.procInstId)
                                    }
                                }
                            }, parms.row.giveCondition)
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
                        prop: 'fullScore',
                        label: '满分值',
                        isShow: true
                    },
                    {
                        prop: 'possessCondition',
                        label: '具备条件',
                        isShow: true
                    },
                    {
                        prop: 'controllableScore',
                        label: '可控得分',
                        isShow: true
                    },
                    {
                        prop: 'fightCondition',
                        label: '争取条件',
                        isShow: true,
                    },
                    {
                        prop: 'fightScore',
                        label: '争取得分',
                        isShow: true,
                    },
                    {
                        prop: 'controllableLosing',
                        label: '可控后失分',
                        isShow: true,
                    },
                    {
                        prop: 'fightLosing',
                        label: '争取后失分',
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
                                            this.routerLink ('评分规则编辑', (parms.row.id).split (':')[0], parms.row.procInstId)
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
                                            this.deleteTenderGradingObject ((parms.row.id).split (':')[0])
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
                if (boolean) { this.resetPage () }
                this.getTenderGradingPage ({
                    'keywords': this.filterText ? this.filterText : null })
            },

            handlePaginationChange (page) {
                this.page = page;
                // this.nextTick(() => {
                    this.searchModelSynopsis (false)
                // });
            },

            getTenderGradingPage (text) {
                let num = 0
                getTenderGradingPageList ({
                    ...text,
                    'projectCode': this.selfSupportProject.projectCode,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size
                }).then( res => {
                    if (res) res.records.forEach (res => { res.id = res.id + ':' + num ++ }), this.tableData = res
                })
            },

            deleteTenderGradingObject (id) {
                this.deleteTenderGradingById ({'ids': id.split(':')[0]})
            },

            deleteTenderGradingList () {
                if (this.tableSelectData.length === 0) {
                    this.$message.warning ('请选择一条数据')
                    return
                }
                let ids = ''
                if (this.tableSelectData && this.tableSelectData.length > 0) {
                    this.tableSelectData.forEach(res => {
                        ids += res.id.split(':')[0] + ','
                    })
                }
                this.deleteTenderGradingById ({'ids': ids.substring(0, ids.length - 1)})
            },

            deleteTenderGradingById (id) {
                util.confirm ().then (boolean => {
                    if (boolean) {
                        deleteBatchTenderGrading (id).then(res => {
                            if (res.code === 200) {
                                this.$message.success(res.message)
                                this.getTenderGradingPage ()
                            }
                        })
                    }
                })
            },

            addTenderGrading () {
                this.transform.isShowDetails = false
                this.routerLink ('新建招标评价')
            },

            resetModelSynopsis () {
                this.filterText = ''
                this.resetPage ()
                this.getTenderGradingPage ()
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
                    path: 'addTenderGrading',
                    name: 'addTenderGrading',
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
                this.getTenderGradingPage ()
            }
        },
    }

</script>
