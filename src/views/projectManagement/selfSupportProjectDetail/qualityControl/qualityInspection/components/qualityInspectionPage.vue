<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <el-row> <project-info></project-info></el-row>
                <span class="qqt-container-full-header-operation___left">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addIndex">添加</el-button>
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
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deleteIndexList">批量删除</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                        <el-button size="mini" @click="exportExcel" icon="el-icon-upload2">导出</el-button>
                        <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                    </el-button-group>
                </span>
            </div>
        </template>
        <div class="qqt-container-full___center self-safty">
            <qqt-table :data="tableData" ref="table" :exportData="tableData.records" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange" />
        </div>
    </d2-container>
</template>

<script>
import { selfQualityPageList, selfQualityDel } from '@/api/selfProject/qualityManagement/qualityInspection/index'
import { qqtTable } from '@/components/qqt-subassembly'
import projectInfo from '../../../components/commenInfo/projectInfo'
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
                    prop: 'projectCode',
                    label: '检查编号',
                    isShow: true,
                    render: (h, parms) => {
                        return h('div', {
                            class: {
                                'typefaceColor': true,
                            },
                            on:{
                                click: () => {
                                    this.transform.isShowDetails = true
                                    this.routerLink ('质量检查记录详情', parms.row.id)
                                }
                            }
                        }, parms.row.projectCode)
                    }
                },
                {
                    prop: 'divideName',
                    label: '检查项目名称',
                    isShow: true
                },
                {
                    prop: 'procStateName',
                    label: '办理状态',
                    isShow: true,
                    render: (h, parms) => {
                        return h('span', { }, parms.row.procStateName = util.handleState(parms.row.procState))
                    }
                },{
                    prop: 'agent',
                    label: '待办人',
                    isShow: true,
                    render: (h, parms) => {
                        return h('span', {}, parms.row.agentName = parms.row.agent ? parms.row.agent : '无' )
                    }
                },
                {
                    prop: 'inspectTotal',
                    label: '累计检查次数',
                    isShow: true
                },
                {
                    prop: 'inspectDate',
                    label: '检查时间',
                    isShow: true
                },
                {
                    prop: 'inspectPart',
                    label: '检查部位',
                    isShow: true,
                },
                {
                    prop: 'inspectMethod',
                    label: '检查方法',
                    isShow: true,
                },
                {
                    prop: 'inspectTerms',
                    label: '检查依据',
                    isShow: true,
                },
                {
                    prop: 'constructionTeam',
                    label: '施工班组',
                    isShow: true,
                },
                {
                    prop: 'principal',
                    label: '负责人',
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
                                props:{ type: 'text', },
                                attrs:{ disabled: parms.row.procState ==='1' ? false : true },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = false
                                        this.routerLink ('编辑质量检查记录', parms.row.id)
                                    }
                                }
                            }, '编辑'),
                            h('el-button', {
                                props:{
                                    type: 'text',
                                },
                                attrs:{ disabled: parms.row.procState ==='1' ? false : true },
                                on:{
                                    click: () => {
                                        this.deleteIndexObject (parms.row.id)
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

        searchModelSynopsis () {
            this.getIndexPage ({
                'keywords': this.filterText ? this.filterText : null,
                'afterDate': this.createDate ? this.createDate[0] : null,
                'beforeDate': this.createDate ? this.createDate[1] : null})
        },

        handlePaginationChange (page) {
            this.page = page;
            this.$nextTick(() => {
                this.searchModelSynopsis ()
            });
        },

        getIndexPage (text) {
            selfQualityPageList ({
                ...text,
                'pageNo': this.page.current,
                'pageSize': this.page.size,
                'projectCode': this.selfSupportProject.projectCode
            }).then( res => {
                if (res) this.tableData = res
            })
        },

        deleteIndexObject (id) {
            this.deleteIndexById ({'ids': id})
        },

        deleteIndexList () {
            if (this.tableSelectData.length === 0) {
                this.$message.warning ('请选择一条数据')
                return
            }
            let ids = ''
            if (this.tableSelectData && this.tableSelectData.length > 0) {
                this.tableSelectData.forEach(res => {
                    ids += res.id + ','
                })
            }
            this.deleteIndexById ({'ids': ids.substring(0, ids.length - 1)})
        },

        deleteIndexById (id) {
            util.confirm ().then (boolean => {
                if (boolean) {
                    selfQualityDel (id).then(res => {
                        if (res.code === 200) {
                            this.$message.success(res.message)
                            this.getIndexPage ()
                        }
                    })
                }
            })
        },

        addIndex () {
            this.transform.isShowDetails = false
            this.routerLink ('添加质量检查记录')
        },

        resetModelSynopsis () {
            this.filterText = ''
            this.createDate = []
            this.getIndexPage ()
        },

        exportExcel () {
            this.$refs.table.getExportExcel ()
        },

        printTable () {
            this.$refs.table.printTable (this.tableSelectData)
        },

        routerLink (title, id = '') {
            this.$router.push ({
                path: 'addQualityInspection',
                name: 'addQualityInspection',
                params: {
                    relevancyId: id,
                    transform: this.transform,
                }
            })
            this.$store.commit ('d2admin/page/titleSet', title)
        },
    },

    components: {
        'qqt-table': qqtTable,
        'project-info': projectInfo,
    },

    computed: {
        ...mapState ('d2admin/selfSupportProject', [
            'selfSupportProject'
        ])
    },

    async created () {
        this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad')
    },

    mounted () {
        this.getIndexPage ()
    },
    
    watch: {
        selfSupportProject () {
            this.getIndexPage ()
        }
    },
}
</script>
<style lang="scss">
.self-safty{
    height: 100% !important;
}
</style>
