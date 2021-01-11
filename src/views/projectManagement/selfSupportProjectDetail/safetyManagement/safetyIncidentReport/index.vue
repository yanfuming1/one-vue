<template>
<!-- 安全事故报告 -->
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <project-info></project-info>
                <span class="qqt-container-full-header-operation___left" v-if="$has('self:safeAccident:add')">
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
                <span class="qqt-container-full-header-operation___right" v-if="$has('self:safeAccident:delete')">
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
        <div class="qqt-container-full___center">
            <qqt-table :data="tableData" ref="table" :exportData="tableData.records" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange" />
        </div>
    </d2-container>
</template>

<script>
    import { getSafetyIncidentReportList, delSafetyIncidentReport } from '@/api/selfProject/safetyManagement/safetyIncidentReport/index'
    
    import { qqtTable } from '@/components/qqt-subassembly'
    import { mapState } from 'vuex'
    import util from '@/libs/util.js'
    import projectInfo from '../../components/commenInfo/projectInfo'
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
                        prop: 'accidentnum',
                        label: '事故编号',
                        isShow: true,
                        width: '200',
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = true
                                        this.routerLink ('事故信息详情', parms.row.id, parms.row.procInstId)
                                    }
                                }
                            }, parms.row.accidentnum)
                        }
                    },
                    {
                        prop: 'accidentname',
                        label: '事故名称',
                        width: '200',
                        isShow: true
                    },
                    {
                        prop: 'accidentlevel',
                        label: '事故等级',
                        width: '100',
                        isShow: true
                    },
                    {
                        prop: 'untitled4',
                        label: '事故发生时间',
                        width: '140',
                        isShow: true
                    },
                    {
                        prop: 'isdeadName',
                        label: '有无人员伤亡',
                        width: '130',
                        isShow: true,
                        render:(h, parms) => {
                            return h('div', { }, parms.row.isdeadName = parms.row.isdead == '1' ? '有' : '无')
                        }
                    },
                    {
                        prop: 'procStateName',
                        label: '办理状态',
                        width: '100',
                        isShow: true,
                        render:(h, parms) => {
                            return h('span', { }, parms.row.procStateName = util.handleState(parms.row.procState))
                        }
                    },
                    {
                        prop: 'nomineeName',
                        label: '待办人',
                        width: '100',
                        isShow: true,
                        render: (h, parms) => {
                            return h('span', {}, parms.row.nomineeName =  parms.row.nominee ? parms.row.nominee : '无' )
                        }
                    },
                    {
                        prop: 'reportedunit',
                        label: '报告单位',
                        width: '100',
                        isShow: true,
                    },
                    {
                        prop: 'ishandleName',
                        label: '是否处理',
                        width: '100',
                        isShow: true,
                        render: (h, parms) => {
                            return h('span', {}, parms.row.ishandleName = parms.row.ishandle == '1' ? '已处理' : '未处理')
                        }
                    },
                    {
                        prop: 'reportedby',
                        label: '报告人',
                        width: '100',
                        isShow: true,
                    },
                    {
                        prop: 'reportedtime',
                        label: '报告时间',
                        width: '125',
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
                        width: '175',
                        isShow: true,
                    },
                    {
                        prop: '',
                        label: '操作',
                        isShow: true,
                        width: '200',
                        fixed: 'right',
                        render: (h, parms) => {
                            return [
                                this.$has ('self:safeHandle:add') ? h('el-button', {
                                    props:{
                                        type: parms.row.ishandle == 0 ? 'danger' : 'success',
                                        size: 'mini',
                                        round: true
                                    },
                                    attrs:{ disabled: parms.row.procState == '10' ? false : true },
                                    style: {
                                        padding: '5px 10px'
                                    },
                                    on:{
                                        click: () => {
                                            this.transform.isShowDetails = false
                                            this.addProcessingRecord ('安全事故处理记录', parms.row.id, parms.row.ishandle)
                                        }
                                    }
                                }, parms.row.ishandle == 0 ? '未处理' :  parms.row.ishandle == 1 ? '已处理' : '未处理') : '',
                                this.$has ('self:safeAccident:edit') ? h('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    attrs:{ disabled: parms.row.procState =='1' ? false : true },
                                    on:{
                                        click: () => {
                                            this.transform.isShowDetails = false
                                            this.routerLink ('事故信息编辑', parms.row.id)
                                        }
                                    }
                                }, '编辑') : '',
                                this.$has ('self:safeAccident:delete') ? h('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    attrs:{ disabled: parms.row.procState =='1' ? false : true },
                                    on:{
                                        click: () => {
                                            this.deleteIndexObject (parms.row.id)
                                        }
                                    }
                                }, '删除') : ''
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
                this.getSafetyIncidentReportPage ({
                    'keywords': this.filterText ? this.filterText : null,
                    'time': this.createDate.length > 0 ? this.createDate[0] + ',' + this.createDate[1] : null})
            },

            handlePaginationChange (page) {
                this.page = page;
                this.$nextTick(() => {
                    this.searchModelSynopsis ()
                });
            },

            getSafetyIncidentReportPage (text) {
                getSafetyIncidentReportList ({
                    ...text,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size,
                    'projectCode': this.selfSupportProject.projectCode,
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
                        delSafetyIncidentReport (id).then(res => {
                            if (res.code === 200) {
                                this.$message.success(res.message)
                                this.getSafetyIncidentReportPage ()
                            }
                        })
                    }
                })
            },

            addIndex () {
                this.transform.isShowDetails = false
                this.routerLink ('添加安全事故报告')
            },

            resetModelSynopsis () {
                this.filterText = ''
                this.createDate = []
                this.getSafetyIncidentReportPage ()
            },

            exportExcel () {
                this.$refs.table.getExportExcel ()
            },

            printTable () {
                this.$refs.table.printTable (this.tableSelectData)
            },

            routerLink (title, id = '', procInstId) {
                this.$router.push ({
                    path: 'addSafetyIncidentReport',
                    name: 'addSafetyIncidentReport',
                    params: {
                        relevancyId: id,
                        procInstId: procInstId,
                        transform: this.transform,
                    }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            },

            addProcessingRecord (title, id = '', ishandle) {
                this.$router.push ({
                    path: 'addAccidentHandlingRecord',
                    name: 'addAccidentHandlingRecord',
                    params: {
                        accidentReportId: id,
                        accidentReport: true,
                        transform: this.transform,
                    }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            }
        },

        components: {
            'project-info': projectInfo,
            'qqt-table': qqtTable,
        },

        created () {
            this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad')
            // this.getSafetyIncidentReportPage ()
        },

        computed: {
            ...mapState ('d2admin/selfSupportProject', [
                'selfSupportProject'
            ])
        },

        watch: {
            selfSupportProject () {
                this.getSafetyIncidentReportPage ()
            }
        },
    }

</script>
