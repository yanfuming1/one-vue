<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <project-info></project-info>
                <span class="qqt-container-full-header-operation___left">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addBudgetInfo">添加</el-button>
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
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deleteBudgetInfoList">批量删除</el-button>
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
import { getBudgetInfoPageList, deleteBatchBudgetInfo } from '@/api/selfProject/budgetControl/budgetInfo'
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
                    prop: 'budgetCode',
                    label: '预算编码',
                    isShow: true,
                    width: "150",
                    render: (h, parms) => {
                        return h('div', {
                            class: { 'typefaceColor': true, },
                            on:{
                                click: () => {
                                    this.transform.isShowDetails = true
                                    this.routerLink ('预算信息详情', parms.row.id)
                                }
                            }
                        }, parms.row.budgetCode)
                    }
                },
                {
                    prop: 'budgetName',
                    label: '预算名称',
                    width: "200",
                    isShow: true,
                    render: (h, parms) => {
                        return h('div', {
                            class: {
                                'typefaceColor': true,
                            },
                            on:{
                                click: () => {
                                    this.transform.isShowDetails = true
                                    this.routerLink ('预算信息详情', parms.row.id)
                                }
                            }
                        }, parms.row.budgetName)
                    }
                },
                {
                    prop: 'budgetTypeDic',
                    label: '预算类型',
                    width: "140",
                    isShow: true
                },
                {
                    prop: 'procStateName',
                    label: '办理状态',
                    width: "100",
                    isShow: true,
                    render: (h, parms) => {
                        return h('span', {
                        }, parms.row.procStateName = util.handleState(parms.row.procState))
                    }
                },
                {
                    prop: 'agent',
                    label: '办理人',
                    width: "100",
                    isShow: true,
                    render: (h, parms) => {
                        return h('span', {
                        }, parms.row.agent || '无')
                    }
                },
                {
                    prop: 'compile',
                    label: '编制人',
                    width: '100',
                    isShow: true,
                },
                {
                    prop: 'phone',
                    label: '联系电话',
                    width: '120',
                    isShow: true,
                },
                {
                    prop: 'createName',
                    label: '创建人',
                    width: '100',
                    isShow: true,
                },
                {
                    prop: 'createTime',
                    label: '创建时间',
                    isShow: true,
                    width: '180',
                },
                {
                    prop: '',
                    label: '操作',
                    isShow: true,
                    fixed: 'right',
                    width: '180',
                    render: (h, parms) => {
                        return [
                            h('el-button', {
                                props:{ type: 'danger', size: 'mini', round: true },
                                style: { padding: '5px 10px' },
                                attrs:{ disabled: parms.row.procState === '10' && parms.row.bgState === '0' ? false : true },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = false
                                        this.routerLink ('自营项目预算信息变更', parms.row.id, 'change')
                                    }
                                }
                            }, '变更'),
                            h('el-button', {
                                props:{ type: 'text', },
                                attrs:{ disabled: parms.row.procState ==='1' ? false : true },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = false
                                        this.routerLink ('预算信息编辑', parms.row.id)
                                    }
                                }
                            }, '编辑'),
                            h('el-button', {
                                props:{ type: 'text', },
                                attrs:{ disabled: parms.row.procState ==='1' ? false : true },
                                on:{
                                    click: () => {
                                        this.deleteBudgetInfoObject (parms.row.id)
                                    }
                                }
                            }, '删除')
                        ]
                    }
                }
            ],
            proCode: '',
        }
    },

    methods: {

        selectChange (item) {
            this.tableSelectData = item
        },

        searchModelSynopsis (boolean = true) {
            if (boolean) this.resetPage ()
            this.getBudgetInfoPage ({
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

        getBudgetInfoPage (text) {
            getBudgetInfoPageList ({
                ...text,
                'pageNo': this.page.current,
                'pageSize': this.page.size,
                'projectCode': this.selfSupportProject.projectCode,
            }).then( res => {
                if (res) this.tableData = res
            })
        },

        deleteBudgetInfoObject (id) {
            this.deleteBudgetInfoById ({'ids': id})
        },

        deleteBudgetInfoList () {
            if (this.tableSelectData.length === 0) {
                this.$message.warning ('请选择一条数据')
                return
            }
            let ids = ''
            let canDel = true
            if (this.tableSelectData && this.tableSelectData.length > 0) {
                this.tableSelectData.forEach(res => {
                    ids += res.id + ','
                    if(res.procState !== '1') { canDel = false }
                })
            }
            if(canDel) {
                this.deleteBudgetInfoById ({'ids': ids.substring(0, ids.length - 1)})
            } else {
                this.$message.warning("选择内容有正在审批或者已完结的内容，不能删除!!!")
            }
        },

        deleteBudgetInfoById (id) {
            util.confirm ().then (boolean => {
                if (boolean) {
                    deleteBatchBudgetInfo (id).then(res => {
                        if (res.code === 200) {
                            this.$message.success(res.message)
                            this.getBudgetInfoPage ()
                        }
                    })
                }
            })
        },

        addBudgetInfo () {
            this.transform.isShowDetails = false
            this.routerLink ('自营项目预算添加')
        },

        resetModelSynopsis () {
            this.filterText = ''
            this.createDate = []
            this.resetPage ()
            this.getBudgetInfoPage ()
        },

        resetPage () {
            this.page = {
                current: 1,
                size: 10,
                total: 0
            }
        },

        exportExcel () {
            this.$refs.table.getExportExcel ()
        },

        printTable () {
            this.$refs.table.printTable (this.tableSelectData)
        },

        routerLink (title, id = '', type = '') {
            this.$router.push ({
                path: type === 'change' ? 'addBudgetChangeInfo' : 'addBudgetInfo',
                name: type === 'change' ? 'addBudgetChangeInfo' : 'addBudgetInfo',
                params: {
                    relevancyId: id,
                    transform: this.transform,
                    changeAdd: true,
                }
            })
            this.$store.commit ('d2admin/page/titleSet', title)
        },
    },

    components: {
        'qqt-table': qqtTable,
        'project-info': projectInfo
    },

    computed: {
        ...mapState ('d2admin/selfSupportProject', [
            'selfSupportProject'
        ])
    },

    async created () {
        this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad')
    },

    watch: {
        selfSupportProject () {
            this.getBudgetInfoPage ()
        }
    }
}
</script>
