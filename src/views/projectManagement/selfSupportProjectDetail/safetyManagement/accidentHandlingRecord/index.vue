<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <project-info></project-info>
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
                <span class="qqt-container-full-header-operation___right" v-if="$has('self:safeHandle:delete')">
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
    import { getHandleList, delHandleBatch } from '@/api/selfProject/safetyManagement/accidentHandlingRecord/index'
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
                        label: '事故处理编号',
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
                                        this.routerLink ('事故处理详情', parms.row.id, parms.row.procInstId )
                                    }
                                }
                            }, parms.row.accidentnum)
                        }
                    },
                    {
                        prop: 'accinvestigation',
                        label: '事故调查',
                        width: '150',
                        isShow: true
                    },
                    {
                        prop: 'accconclusion',
                        label: '事故结论',
                        width: '150',
                        isShow: true
                    },
                    {
                        prop: 'handleresult',
                        label: '处理结果',
                        width: '150',
                        isShow: true
                    },
                    {
                        prop: 'procStateName',
                        label: '办理状态',
                        isShow: true,
                        width: '150',
                        render:(h, parms) => {
                            return h('span', { }, parms.row.procStateName = util.handleState(parms.row.procState))
                        }
                    },{
                        prop: 'nomineeName',
                        label: '待办人',
                        isShow: true,
                        width: '100',
                        render: (h, parms) => {
                            return h('span', {}, parms.row.nomineeName =  parms.row.nominee ? parms.row.nominee : '无' )
                        }
                    },{
                        prop: 'handleman',
                        label: '处理人',
                        isShow: true,
                        width: '100',
                    },{
                        prop: 'departtName',
                        label: '工作部门',
                        isShow: true,
                        width: '150'
                    },{
                        prop: 'unitName',
                        label: '工作单位',
                        isShow: true,
                        width: '150',
                    },
                    {
                        prop: 'handletime',
                        label: '处理时间',
                        isShow: true,
                        width: '150'
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
                                this.$has ('self:safeHandle:edit') ? h('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    attrs:{ disabled: parms.row.procState =='1' ? false : true },
                                    on:{
                                        click: () => {
                                            this.transform.isShowDetails = false
                                            this.routerLink ('安全事故处理记录编辑', parms.row.id )
                                        }
                                    }
                                }, '编辑') : '',
                                this.$has ('self:safeHandle:delete') ? h('el-button', {
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
                this.getIndexPage ({
                    'keywords': this.filterText ? this.filterText : null,
                    'time': this.createDate.length > 0 ? this.createDate[0] + ',' + this.createDate[1] : null})
            },

            handlePaginationChange (page) {
                this.page = page;
                this.$nextTick(() => {
                    this.searchModelSynopsis ()
                });
            },

            getIndexPage (text) {
                getHandleList ({
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
                        delHandleBatch (id).then(res => {
                            if (res.code === 200) {
                                this.$message.success(res.message)
                                this.getIndexPage ()
                            }
                        })
                    }
                })
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

            routerLink (title, id = '', procInstId = '') {
                this.$router.push ({
                    path: 'addAccidentHandlingRecord',
                    name: 'addAccidentHandlingRecord',
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
            'project-info': projectInfo,
            'qqt-table': qqtTable,
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
                this.getIndexPage ()
            }
        }
    }

</script>
