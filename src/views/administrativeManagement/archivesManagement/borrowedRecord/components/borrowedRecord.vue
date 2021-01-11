<template>
    <d2-container type="fulls">
        <template slot="header">
            <determine-project v-if="identification == '1'" title='借阅记录' :proId="proId"></determine-project>
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header___search">
                    <el-input
                        placeholder="请输入内容"
                        prefix-icon="el-icon-search"
                        @keyup.enter.native="selectChangeData"
                        v-model="filterText" size="mini">
                    </el-input>
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="selectChangeData">搜索</el-button>
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
                        @change="selectChangeData()" 
                        align="right">
                    </el-date-picker>
                </span>
                <span class="qqt-container-full-header-operation___right" v-if="$has ('administer:adminFileLoan:delete')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deleteBatchBorrowedRecordData">批量删除</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <p>办理状态:</p>
                    <div class="qqt-container-full-header-state___select">
                        <qqt-select :value="prostate" :options="options" :size="'mini'" :placeholder="'请选择'" @select="page.current = 1, page.size = 10, prostate = $event, selectChangeData ()"></qqt-select>
                    </div>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <p>审核状态:</p>
                    <div class="qqt-container-full-header-state___select">
                        <qqt-select :value="audit" :options="auditOptions" :size="'mini'" :placeholder="'请选择'" @select="page.current = 1, page.size = 10, audit = $event, selectChangeData ()"></qqt-select>
                    </div>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                        <el-button size="mini" icon="el-icon-check" @click="auditBorrowedRecord">审核</el-button>
                        <el-button size="mini" icon="el-icon-close" @click="againstBorrowedRecordData">反审核</el-button>
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
            <qqt-table :data="tableData" ref="table" :exportData="tableData.records" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange"></qqt-table>
        </div>
    </d2-container>
</template>

<script>
    import { qqtTable, qqtSelect } from '../../../../../components/qqt-subassembly'
    import { getBorrowedRecord, deleteBatchBorrowedRecord, getProRecordPageList,
             getBorrowedRecordPageList, againstBorrowedRecord, checkBorrowedRecord } from '../../../../../api/administrativeManagement/archivesManagement/borrowedRecord'
    
    import determineProject from '../../../../projectManagement/jontProjectDetail/components/determineProject'
    import borrowingApply from './borrowingApply'
    import util from '@/libs/util.js'
    export default {

        components: {
            'qqt-table': qqtTable,
            'qqt-select': qqtSelect,
            'borrowing-apply': borrowingApply,
            'determine-project': determineProject
        },

        data () {
            return {
                filterText: '',
                audit: '',
                prostate: '',
                archiveId: '',
                borrowStatus: '2',
                createDate: [],
                transform: {
                    isShowDetails: false
                },
                tableOption: {},
                dynamicHeader: {
                    tableId: 'T_15724302245425',
                    isSave: true,
                },
                identification: '', // 行政还是项目
                proId: null,
                projectName: null,
                tableData: {},
                page: {
                    current: 1,
                    size: 10,
                    total: 0
                },
                selectTableData: [],
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
                rowHeader: [
                    {
                        prop: 'name',
                        label: '档案名称',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', 
                                {
                                    class: {
                                        'typefaceColor': true,
                                    },

                                    on: { 
                                        click: () => { 
                                            this.transform.isShowDetails = true
                                            this.routerLink (parms.row.id, parms.row.procInstId, '借阅记录详情')
                                        }
                                    }
                            },  parms.row.name
                            )
                        }
                    },
                    {
                        prop: 'encoding',
                        label: '档案编码',
                        isShow: true
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
                        prop: 'purposes',
                        label: '借阅用途',
                        isShow: true
                    },
                    {
                        prop: 'borrowDate',
                        label: '借阅时间',
                        isShow: true
                    },
                    {
                        prop: 'createName',
                        label: '申请人',
                        isShow: true
                    },
                    {
                        prop: 'createTime',
                        label: '申请时间',
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
                                this.$has ('administer:adminFileLoan:edit') ? h('el-button', {
                                    props: {
                                        type: 'text',
                                    },
                                    attrs: {
                                        disabled: util.isDisabled (parms.row.procState)
                                    },
                                    on: {
                                        click: () => {
                                            this.transform.isShowDetails = false
                                            this.routerLink (parms.row.id, parms.row.procInstId, '借阅记录编辑')
                                        }
                                    }
                                }, '编辑') : '',
                                this.$has ('administer:adminFileLoan:delete') ? h('el-button', {
                                    props: {
                                        type: 'text',
                                    },
                                    attrs: {
                                        disabled: util.isDisabled (parms.row.procState)
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteBorrowedRecord (parms.row.id)
                                        }
                                    }
                                }, '删除') : ''
                            ]
                        }
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

            selectChange (list) {
                this.selectTableData = list
            },

            handlePaginationChange (page) {
                this.page = page
                this.$nextTick(() => {
                    this.selectChangeData (false)
                })
            },

            resetModelSynopsis () {
                this.page.current = '1'
                this.page.pageSize = '10'
                this.filterText = this.prostate = this.audit = ''
                this.createDate = []
                this.selectChangeData ()
            },

            selectSearchData (item) {
                this.prostate = item
                this.selectChangeData ()
            },

            deleteBatchBorrowedRecordData () {
                if (this.selectTableData.length === 0) {
                    this.$message.warning ('至少选择一条数据')
                    return
                }

                let procInName = ''
                this.selectTableData.forEach (res => {
                    if (res.procState !== '1') {
                        procInName += res.name + ',' 
                    }
                })

                if (procInName) {
                    this.$message.warning (`${procInName} 已提交流程无法删除`)
                    return
                }

                let str = ''
                this.selectTableData.filter ( f => str += f.id + ',')
                this.deleteBorrowedRecord (str.substring (0, str.length - 1))
            },

            deleteBorrowedRecord (id) {
                util.confirm ().then (boolean => {
                    if (boolean) {
                        deleteBatchBorrowedRecord ({'ids': id}).then((res) => {
                            if (res.code === 200) {
                                this.$message.success ('删除成功')
                                this.getBorrowedRecordList ()
                            }
                        })
                    }
                })
            },

            neatenFileTypeData (str) {
                let filetype = ''
                let list = []
                // if (str != null) {
                //     list = JSON.parse(str)
                // }
                list.forEach(key => {
                    switch (key) {
                        case '0':
                            filetype += '原件' + ','
                            break;
                        case '1':
                            filetype += '复印件' + ','
                            break;
                        case '2':
                            filetype += '电子原件' + ','
                            break;
                    }
                });
                return filetype.substring (0, filetype.length - 1)
            },

            getBorrowedRecordList () {
                getBorrowedRecord ().then((res) => {
                    if (res) {
                        this.tableData = res
                    }  
                })
            },

            getBorrowedRecordPageLists (text) {
                let url = this.identification === '1' ? getProRecordPageList : getBorrowedRecordPageList
                url ({
                    ...text,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size,
                    'projectId': this.identification === '1' ? this.proId : null
                }).then (res => {
                    if (res) {
                        this.tableData = res
                    } 
                })
            },

            routerLink (id, procInstId, title) {
                this.$router.push ({
                    path: this.identification === '1' ? 'borrowingApplyProject' : 'borrowingApply',
                    name: this.identification === '1' ? 'borrowingApplyProject' : 'borrowingApply',
                    params: {
                        relevancyId: id,
                        transform: this.transform,
                        procInstId: procInstId,
                        identification: this.identification,
                        path: 'borrowedRecord'
                    }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            },

            selectChangeData (boolean = true) {
                if (boolean) this.resetPage ()
                this.getBorrowedRecordPageLists ({
                    'name': this.filterText ? this.filterText : null,
                    'state': this.audit ? this.audit : null,
                    'prostate': this.prostate ? this.prostate : null,
                    'createTime': this.createDate ? this.createDate[0] : null,
                    'updateTime':this.createDate ? this.createDate[1] : null
                })
            },

            checkBorrowedRecordData (data) {
                checkBorrowedRecord (data).then (res => {
                    if (res.code === 200) {
                        this.$message.success ('审核成功')
                        this.selectChangeData ()
                    }
                })
            },

            auditBorrowedRecord () {
                if (this.selectTableData.length !== 1) {
                    this.$message.warning ('请选择一条数据')
                    return
                }
                if (this.selectTableData[0]['state'] === '0') {
                    this.checkBorrowedRecordData (this.selectTableData[0])
                } else {
                    this.$message.warning ('数据已审核')
                }
            },

            againstBorrowedRecordData () {
                if (this.selectTableData.length !== 1) {
                    this.$message.warning ('请选择一条数据')
                    return
                }
                if (this.selectTableData[0]['state'] === '0') {
                    this.$message.warning ('数据未审核')
                    return
                }
                againstBorrowedRecord (this.selectTableData[0]).then (res => {
                    if (res.code === 200) {
                        this.$message.success ('反审核成功')
                        this.selectChangeData ()
                    }
                })
            },

            exportExcel () { 
                this.$refs.table.getExportExcel ()
            },

            printTable () {
                this.$refs.table.printTable (this.selectTableData)
            },

            async changeRouter () {
                this.identification = this.$route.params.identification ? this.$route.params.identification : '' 
                const db = await this.$store.dispatch('d2admin/db/database', {user: true})
                this.proId = this.identification === '1'? db.get('proID').value() : null
                this.projectName = this.identification === '1' ? db.get('proName').value() : null
                if(this.identification === '1') {
                    this.getBorrowedRecordPageLists ()
                } else {
                    this.getBorrowedRecordList ()
                }   
            },

            resetPage () {
                this.page = {
                    current: 1,
                    size: 10,
                    total: 0
                }
            },
        },

        created() {
            this.changeRouter()
        },

        watch: {
            $route (val) {
                this.changeRouter()
            }
        }
    }
</script>
