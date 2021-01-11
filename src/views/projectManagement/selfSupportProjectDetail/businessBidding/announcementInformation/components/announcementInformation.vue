<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <project-info></project-info>
                <span class="qqt-container-full-header-operation___left">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addAnnouncementInformation">添加</el-button>
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
                        style="width:320px;"
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
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deleteAnnouncementInformationList">批量删除</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                        <el-button size="mini" icon="el-icon-check" @click="checkAgainstAnnouncementInformationData ('1')">审核</el-button>
                        <el-button size="mini" icon="el-icon-close" @click="checkAgainstAnnouncementInformationData ('0')">反审核</el-button>
                    </el-button-group>
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
    import { getAnnouncementInformationPageList, deleteBatchAnnouncementInformation, checkAgainstAnnouncementInformation } from '@/api/selfProject/businessBidding/announcementInformation'
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
                        prop: 'beforeChange',
                        label: '变更前内容',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = true
                                        this.routerLink ('招标公告变更详情', (parms.row.id).split (':')[0], parms.row.procInstId)
                                    }
                                }
                            }, parms.row.beforeChange)
                        }
                    },
                    {
                        prop: 'afterChange',
                        label: '变更后内容',
                        isShow: true
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
                        prop: 'auditStateName',
                        label: '审核状态',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {},
                                parms.row.auditStateName = parms.row.auditState == '0' ? '未审核' : '已审核'
                            )
                        }
                    },
                    {
                        prop: 'changeTime',
                        label: '变更发布时间',
                        isShow: true
                    },
                    {
                        prop: 'reason',
                        label: '变更原因分析',
                        isShow: true
                    },
                    {
                        prop: 'influence',
                        label: '对投标影响程度',
                        isShow: true,
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
                                            this.routerLink ('招标公告变更编辑', (parms.row.id).split (':')[0], parms.row.procInstId)
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
                                            this.deleteAnnouncementInformationObject ((parms.row.id).split (':')[0])
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
                this.getAnnouncementInformationPage ({
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

            getAnnouncementInformationPage (text) {
                let num = 0
                getAnnouncementInformationPageList ({
                    ...text,
                    'projectCode': this.selfSupportProject.projectCode,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size
                }).then( res => {
                    if (res) res.records.forEach (res => { res.id = res.id + ':' + num ++ }), this.tableData = res
                })
            },

            deleteAnnouncementInformationObject (id) {
                this.deleteAnnouncementInformationById ({'ids': id})
            },

            deleteAnnouncementInformationList () {
                if (this.tableSelectData.length === 0) {
                    this.$message.warning ('请选择一条数据')
                    return
                }
                let ids = ''
                if (this.tableSelectData && this.tableSelectData.length > 0) {
                    this.tableSelectData.forEach(res => {
                        ids += res.id.split (':')[0] + ','
                    })
                }
                this.deleteAnnouncementInformationById ({'ids': ids.substring(0, ids.length - 1)})
            },

            deleteAnnouncementInformationById (id) {
                util.confirm ().then (boolean => {
                    if (boolean) {
                        deleteBatchAnnouncementInformation (id).then(res => {
                            if (res.code === 200) {
                                this.$message.success(res.message)
                                this.getAnnouncementInformationPage ()
                            }
                        })
                    }
                })
            },

            checkAgainstAnnouncementInformationData (type) {
                if (this.tableSelectData.length !== 1) {
                    this.$message.warning ('请选择一条数据')
                    return
                }
                switch (type) {
                    case '1':
                        if (this.tableSelectData[0]['auditState'] === '0') {
                            this.checkPrintsAnnouncementInformation (this.tableSelectData[0], type)
                        } else {
                            this.$message.warning ('数据已审核')
                        }
                        break;
                    case '0':
                        if (this.tableSelectData[0]['auditState'] === '1') {
                            this.checkPrintsAnnouncementInformation (this.tableSelectData[0], type)
                        } else {
                            this.$message.warning ('数据未审核')
                        }
                        break;
                }
            },

            checkPrintsAnnouncementInformation (data, type) {
                checkAgainstAnnouncementInformation ({'id': data.id.split (':')[0], 'type': type}).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.getAnnouncementInformationPage ()
                    }
                })
            },

            addAnnouncementInformation () {
                this.transform.isShowDetails = false
                this.routerLink ('新建招标公告变更信息')
            },

            resetModelSynopsis () {
                this.filterText = ''
                this.createDate = []
                this.resetPage ()
                this.getAnnouncementInformationPage ()
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
                    path: 'addAnnouncementInformation',
                    name: 'addAnnouncementInformation',
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
                this.getAnnouncementInformationPage ()
            }
        },
    }

</script>
