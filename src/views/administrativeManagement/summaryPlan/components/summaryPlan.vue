<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header-operation___left" v-if="$route.params.identification == '0' && $has ('summaryPlan:list:add')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addSummaryPlan">添加</el-button>
                </span>
                <span class="qqt-container-full-header___search">
                    <el-input
                        placeholder="请输入内容"
                        prefix-icon="el-icon-search"
                        v-model="filterText" size="mini">
                    </el-input>
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="searchModelSynopsis">搜索</el-button>
                    <el-button type="info" class="qqt-container-full-header-top___button" @click="resetModelSynopsis">重置</el-button>
                </span>
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
                <span class="qqt-container-full-header-operation___right" v-if="$route.params.identification == '0' && $has ('summaryPlan:list:delete')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deleteBatchSummaryPlanData">批量删除</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <p>总结计划类型:</p>
                    <div class="qqt-container-full-header-state___select">
                        <qqt-select :value="state" :options="data" :defaultProp="defaultProps" :size="'mini'" :placeholder="'请选择'" @select="page.current = 1, page.size = 10, selectSearchData ($event)"></qqt-select>
                    </div>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <p>可见范围:</p>
                    <div class="qqt-container-full-header-state___select">
                        <qqt-select :value="visualRange" :options="visualRangeOptions" :size="'mini'" :placeholder="'请选择'" @select="page.current = 1, page.size = 10, visualRange = $event, getEveryOneTimeAuantum ()"></qqt-select>
                    </div>
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
            <qqt-table :data="tableData" ref="table" :exportData="tableData.records" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange"></qqt-table>
        </div>
    </d2-container>
</template>

<script>
    import { qqtTable, qqtSelect } from '../../../../components/qqt-subassembly'
    import { getSummaryPlan, deleteBatchSummaryPlan, getSummaryPlanSelectListSum } from '../../../../api/administrativeManagement/summaryPlan'
    import util from '@/libs/util.js'
    export default {

        data () {
            return {
                filterText: '',
                state: '',
                visualRange: '',
                archiveId: '',
                isShowElement: true,
                historicalData: {
                    id: ''
                },
                page: {
                    current: 1,
                    size: 10,
                    total: 0
                },
                dynamicHeader: {
                    tableId: 'T_1572430493542',
                    isSave: false
                },
                defaultProps: {
                    children: 'child',
                    label: 'name',
                    value: 'id'
                },
                tableOption: {},
                tableData: {},
                selectTableData: [],
                createDate: [],
                rowHeader: [
                    {
                        prop: 'conclusionTitle',
                        label: '总结标题',
                        width: '180',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on:{
                                    click: () => {
                                        this.archiveId = parms.row.id
                                        this.isShowElement = false,
                                        this.routerLink ('总结详情')
                                    }
                                }
                            }, parms.row.conclusionTitle)
                        }
                    },
                    {
                        prop: 'summarizeTypes',
                        label: '总结类型',
                        isShow: true
                    },
                    {
                        prop: 'zTimeName',
                        label: '总结周期',
                        isShow: true,
                        width: '200',
                        render: (h, parms) => {
                            return h('div', {},
                               parms.row.zTimeName =  parms.row['time'] = new Date (parms.row.conclusionTime).format ('yyyy-MM-dd') + '~' + new Date (parms.row.conclusionTimeFinish).format ('yyyy-MM-dd')
                            )
                        }
                    },
                    {
                        prop: 'projectTitle',
                        label: '计划标题',
                        isShow: true,
                        width: '180',
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on:{
                                    click: () => {
                                        this.archiveId = parms.row.id
                                        this.isShowElement = false,
                                        this.routerLink ('计划详情')
                                    }
                                }
                            }, parms.row.projectTitle)
                        }
                    },
                    {
                        prop: 'projectType',
                        label: '计划类型',
                        isShow: true
                    },
                    {
                        prop: 'jTimeName',
                        label: '计划周期',
                        isShow: true,
                        width: '200',
                        render: (h, parms) => {
                            return h('div', {},
                                parms.row.jTimeName = parms.row['time'] = new Date (parms.row.plannedTime).format ('yyyy-MM-dd') + '~' + new Date (parms.row.plannedTimeFinish).format ('yyyy-MM-dd')
                            )
                        }
                    },
                    {
                        prop: 'createName',
                        label: '上报人',
                        isShow: true
                    },
                    {
                        prop: 'createTime',
                        label: '上报时间',
                        width: '160',
                        isShow: true
                    },
                    {
                        prop: 'carbonCopyRecipients',
                        label: '抄送给',
                        isShow: true
                    },
                    {
                        prop: 'visualRangeName',
                        label: '可见范围',
                        isShow: true,
                        width: '130',
                        render: (h, parms) => {
                            return h('div', {},
                                parms.row['visualRangeName'] = this.neatenVisibleData (parms.row.visualRange)
                            )
                        }
                    },
                    {
                        prop: 'pageView',
                        label: '浏览量',
                        isShow: true
                    },
                    
                    {
                        prop: '',
                        label: '操作',
                        isShow: true,
                        fixed: 'right',
                        width: '150',
                        render: (h, parms) => {
                            return [
                                this.$has ('summaryPlan:list:add') ? h('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    attrs: {
                                        disabled: parms.row.status === '1' || util.cookies.get ('uuid') !== parms.row.createBy ? true : false
                                    },
                                    on:{
                                        click: () => {
                                            this.archiveId = parms.row.id
                                            this.isShowElement = true
                                            this.routerLink ('总结计划编辑')
                                        }
                                    }
                                }, '编辑') : '',
                                this.$has ('summaryPlan:list:delete') ? h('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    attrs: {
                                        disabled: parms.row.status === '1' || util.cookies.get ('uuid') !== parms.row.createBy ? true : false
                                    },
                                    on:{
                                        click: () => {
                                            this.deleteSummaryPlanTable (parms.row.id)
                                        }
                                    }
                                },'删除') : ''
                            ]
                        }
                    }
                ],
                data: [
                    {
                        id: '日计划',
                        name: '日计划'
                    },
                    {
                        id: '周计划',
                        name: '周计划'
                    },
                    {
                        id: '月计划',
                        name: '月计划'
                    },
                    {
                        id: '季计划',
                        name: '季计划'
                    },
                    {
                        id: '年计划',
                        name: '年计划'
                    },
                    {
                        id: '日总结',
                        name: '日总结'
                    },
                    {
                        id: '周总结',
                        name: '周总结'
                    },
                    {
                        id: '月总结',
                        name: '月总结'
                    },
                    {
                        id: '季总结',
                        name: '季总结'
                    },
                    {
                        id: '年总结',
                        name: '年总结'
                    },
                ],
                visualRangeOptions: [
                    {
                        value: '1',
                        label: '全部可见'
                    },
                    {
                        value: '2',
                        label: '上级可见'
                    },
                    {
                        value: '3',
                        label: '下级可见'
                    }
                ],
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
                }
            }
        },

        methods: {

            deleteBatchSummaryPlanData () {
                if (this.selectTableData.length === 0) {
                    this.$message.warning ('至少选择一条数据')
                    return
                }

                let str = ''
                let title = ''
                this.selectTableData.filter ( f => {
                    if (f.status !== '1') {
                        str += f.id + ','
                    } else {
                        title += f.conclusionTitle + ','
                    }
                })
                if (title == '') {
                    this.deleteSummaryPlanTable (str.substring (0, str.length - 1))
                } else {
                     this.$message.warning (`${title} 已经提交不能删除`)
                }
            },

            deleteSummaryPlanTable (id) {
                util.confirm ().then (boolean => {
                    if (boolean) {
                        deleteBatchSummaryPlan ({'ids': id}).then (res => {
                            if (res.code === 200) {
                                this.$message.success ('删除成功')
                                this.resetModelSynopsis ()
                            }
                        })
                    }
                })
            },

            handlePaginationChange (page) {
                this.page = page
                this.$nextTick(() => {
                    this.searchModelSynopsis (false)
                })
            },

            selectChange (item) {
                this.selectTableData = item
            },

            selectSearchData (item) {
                this.state = item
                this.getEveryOneTimeAuantum (item)
            },

            addSummaryPlan () {
                this.isShowElement = true,
                this.archiveId = ''
                this.routerLink ('添加总结计划')
            },

            searchModelSynopsis (boolean = true) {
                if (boolean) this.resetPage ()
                let item = this.neateData ()
                switch (this.$route.params.identification) {
                    case '0':
                        this.getSummaryPlanSelectList (item)
                        break;
                    case '1':
                        this.getSummaryPlanList (item)
                        break
                }
            },

            neateData () {
                let item = {
                    'keywords': this.filterText ? this.filterText : null,
                    'projectType': this.state ? this.state : null,
                    'visualRange': this.visualRange ? this.visualRange : null,
                    'conclusionTime': this.createDate ? this.createDate[0] : this.createTime ? this.createTime : null,
                    'conclusionTimeFinish': this.createDate ? this.createDate[1] : this.updateTime ? this.updateTime : null,
                }
                return item
            },

            resetModelSynopsis () {
                this.filterText = this.state = this.visualRange = ''
                this.createDate = []
                this.resetPage ()
                this.searchModelSynopsis ()
            },

            getSummaryPlanList (text) {
                getSummaryPlan ({
                    ...text,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size
                    }).then (res => {
                    if (res) {
                        this.tableData = res
                    }
                })
            },

            getSummaryPlanSelectList (text) {
                getSummaryPlanSelectListSum ({
                    ...text,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size
                }).then (res => {
                    if (res) {
                        this.tableData = res
                    }
                })
            },

            getEveryOneTimeAuantum (data) {
                let now = new Date()
                let nowDay = now.getDate()
                let nowDayOfWeek = now.getDay()
                let nowMonth = now.getMonth()
                let nowYear = now.getYear()
                nowYear += (nowYear < 2000) ? 1900 : 0

                switch (data) {
                    case 'week':
                        this.createTime = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek).format ('yyyy-MM-dd')
                        this.updateTime = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek)).format ('yyyy-MM-dd')
                        break;
                    case 'month':
                        this.createTime = new Date(nowYear, nowMonth, 1).format ('yyyy-MM-dd')
                        this.updateTime = new Date(nowYear, nowMonth, this.getMonthDays (nowYear, nowMonth)).format ('yyyy-MM-dd')
                        break;
                    case 'season':
                        this.createTime = new Date (nowYear, this.getQuarterStartMonth(nowMonth), 1).format ('yyyy-MM-dd')
                        this.updateTime = new Date (nowYear, this.getQuarterStartMonth(nowMonth) + 2, this.getMonthDays (nowYear, this.getQuarterStartMonth(nowMonth) + 2)).format ('yyyy-MM-dd')
                        break;
                    case 'year':
                        this.createTime = new Date (nowYear, 0, 1).format ('yyyy-MM-dd')
                        this.updateTime = new Date (nowYear, 11, 31).format ('yyyy-MM-dd')
                        break;
                }
                this.searchModelSynopsis ()
            },

            getQuarterStartMonth (nowMonth) {
                let quarterStartMonth = 0
                if (nowMonth < 3) {
                    quarterStartMonth = 0
                }
                if (2 < nowMonth && nowMonth < 6) {
                    quarterStartMonth = 3
                }
                if (5 < nowMonth && nowMonth < 9) {
                    quarterStartMonth = 6
                }
                if (nowMonth > 8) {
                    quarterStartMonth = 9
                }
                return quarterStartMonth;
            },

            getMonthDays (nowYear, myMonth) {
                let monthStartDate = new Date (nowYear, myMonth, 1)
                let monthEndDate = new Date (nowYear, myMonth + 1, 1)
                let days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24)
                return days
            },

            neatenVisibleData (id) {
                let item = this.visualRangeOptions.find (f => f.value === id)
                return item.label
            },

            estimateIdentification (identification) {
                switch (identification) {
                    case '0':
                        this.getSummaryPlanSelectList ()
                        break;
                    case '1':
                        this.getEveryOneTimeAuantum ()
                        break;
                    default:
                        break;
                }
            },

            routerLink (title) {
                this.$router.push ({
                    path: `updataSummaryPlan`,
                    name: 'updataSummaryPlan',
                    params: {
                        archiveId: this.archiveId,
                        isShowElement: this.isShowElement,
                        identification: this.$route.params.identification
                    }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            },

            exportExcel () { 
                this.$refs.table.getExportExcel ()
            },

            printTable () {
                this.$refs.table.printTable (this.selectTableData)
            },

            resetPage () {
                this.page = {
                    current: 1,
                    size: 10,
                    total: 0
                }
            }
        },

        components: {
            'qqt-select': qqtSelect,
            'qqt-table': qqtTable
        },

        created () {
            this.estimateIdentification (this.$route.params.identification)
        },

        watch: {
            $route (val) {
                if (val.path.indexOf('summaryPlan') !== -1) {
                    this.state = ''
                    this.resetModelSynopsis ()
                }
            }
        }
    }
</script>

<style scoped>
    .qqt-container-full-header-state___select {
        width: 7% !important
    }
</style>