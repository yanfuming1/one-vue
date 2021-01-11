<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header-operation___left" v-if="$has ('administer:adminReceiveFile:add')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addReceiptRegistration">添加</el-button>
                </span>
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
                        style="width:320px;"
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
                <span class="qqt-container-full-header-operation___right" v-if="$has ('administer:adminReceiveFile:delete')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deleteBatchReceiptRegistrationData">批量删除</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <p>办理状态</p>
                    <div class="qqt-container-full-header-state___select">
                        <qqt-select :value="procState" :options="options" :size="'mini'" :placeholder="'请选择'" @select="page.current = 1, page.size = 10, procState = $event, selectChangeData ()"></qqt-select>
                    </div>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <p>审核状态:</p>
                    <div class="qqt-container-full-header-state___select">
                        <qqt-select :value="audit" :options="auditOptions" :size="'mini'" :placeholder="'请选择'" @select="page.current = 1, page.size = 10, audit = $event, selectChangeData ()"></qqt-select>
                    </div>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <p>是否需要回复:</p>
                    <div class="qqt-container-full-header-state___select">
                        <qqt-select :value="isreceive" :options="isOptions" :size="'mini'" :placeholder="'请选择'" @select="page.current = 1, page.size = 10, isreceive = $event, selectChangeData ()"></qqt-select>
                    </div>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                        <el-button size="mini" icon="el-icon-check" @click="auditReceiptRegistration">审核</el-button>
                        <el-button size="mini" icon="el-icon-close" @click="againstReceiptRegistrationData">反审核</el-button>
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
            <qqt-table :data="tableData" ref="table" :exportData="tableData.records" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" @selectionChange="selectChange" :option="tableOption" @page="handlePaginationChange"></qqt-table>
        </div>
        <reply-history :dialogVisible="dialogVisible" :relevancyId="relevancyId" @close="dialogVisible = false" />
    </d2-container>
</template>

<script>
    import { qqtTable, qqtSelect } from '../../../../../components/qqt-subassembly'
    import { getReceiptRegistration, deleteBatchReceiptRegistration, 
             getReceiptRegistrationPageList, againstReceiptRegistration,
             checkReceiptRegistration } from '../../../../../api/administrativeManagement/documentManagement/receiptRegistration'
    
    import replyHistory from './replyHistory'
    import util from '@/libs/util.js'
    export default {

        components: {
            'qqt-table': qqtTable,
            'qqt-select': qqtSelect,
            'reply-history': replyHistory
        },

        data () {
            return {
                audit: '',
                procState: '',
                filterText: '',
                relevancyId: '',
                isreceive: '',
                dialogVisible: false,
                transform: {
                    isShowDetails: false
                },
                dynamicHeader: {
                    tableId: 'T_1572430350540',
                    isSave: true
                },
                tableOption: {},
                tableData: {},
                page: {
                    current: 1,
                    size: 10,
                    total: 0
                },
                createDate: [],
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
                isOptions: [
                    {
                        value: '0',
                        label: '否'
                    },
                    {
                        value: '1',
                        label: '是'
                    }
                ],
                rowHeader: [
                    {
                        prop: 'title',
                        label: '文件标题',
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
                                            this.routerLink ('收文管理详情', parms.row.procInstId, parms.row.id)
                                        }
                                    }
                                },  parms.row.title
                            )
                        }
                    },
                    {
                        prop: 'encoding',
                        label: '文件编号',
                        isShow: true
                    },
                    {
                        prop: 'fenshu',
                        label: '文件份数',
                        isShow: true,
                    },
                    {
                        prop: 'yeshu',
                        label: '文件页数',
                        isShow: true,
                    },
                    {
                        prop: 'isreceiveName',
                        label: '是否需要回复',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {},
                                parms.row.isreceiveName = parms.row.isreceive == '0' ? '否' : '是'
                            )
                        }
                    },
                    {
                        prop: 'secretclass',
                        label: '密级',
                        isShow: true,
                    },
                    {
                        prop: 'receivecompany',
                        label: '来文单位',
                        isShow: true,
                    },
                    {
                        prop: 'receivedate',
                        label: '来文时间',
                        isShow: true
                    },
                    {
                        prop: 'auditName',
                        label: '审核状态',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {},
                                parms.row.auditName = parms.row.audit == '0' ? '未审核' : '已审核'
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
                        prop: 'createName',
                        label: '登记人',
                        isShow: true
                    },
                    
                    {
                        prop: 'createTime',
                        label: '登记时间',
                        isShow: true,
                        width: 180
                    },
                    {
                        prop: '',
                        label: '操作',
                        isShow: true,
                        width: '200px',
                        fixed: 'right',
                        render: (h, parms) => {
                            return [
                                this.$has ('administer:adminReceiveFile:edit') ? h('el-button', {
                                    props: {
                                        type: 'text',
                                    },
                                    attrs: {
                                        disabled: util.isDisabled (parms.row.procState)
                                    },
                                    on: {
                                        click: () => {
                                            this.transform.isShowDetails = false
                                            this.routerLink ('编辑收文管理', parms.row.procInstId, parms.row.id)
                                        }
                                    }
                                }, '编辑') : '',
                                this.$has ('administer:adminReceiveFile:delete') ? h('el-button', {
                                    props: {
                                        type: 'text',
                                    },
                                    attrs: {
                                        disabled: util.isDisabled (parms.row.procState)
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteReceiptRegistration (parms.row.id)
                                        }
                                    }
                                }, '删除') : '',
                                h('el-button', {
                                    props: {
                                        type: 'text',
                                    },
                                    attrs: {
                                        disabled: parms.row.isreceive == '0' ? true : false
                                    },
                                    on: {
                                        click: () => {
                                            this.relevancyId = parms.row.id
                                            this.dialogVisible = true
                                        }
                                    }
                                },  '回复列表')
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
                this.filterText = this.procState = this.audit = this.isreceive  = '' 
                this.createDate = []
                this.getReceiptRegistrationPageLists ()
            },

            deleteBatchReceiptRegistrationData () {
                if (this.selectTableData.length === 0) {
                    this.$message.warning ('至少选择一条数据')
                    return
                }

                let procInName = ''
                this.selectTableData.forEach (res => {
                    if (res.procState !== '1') {
                        procInName += res.title + ',' 
                    }
                })

                if (procInName) {
                    this.$message.warning (`${procInName} 已提交流程无法删除`)
                    return
                }

                let str = ''
                this.selectTableData.filter ( f => str += f.id + ',')
                this.deleteReceiptRegistration (str.substring (0, str.length - 1))
            },

            deleteReceiptRegistration (id) {
                util.confirm ().then (boolean => {
                    if (boolean) {
                        deleteBatchReceiptRegistration ({'ids': id}).then((res) => {
                            if (res.code === 200) {
                                this.$message.success ('删除成功')
                                this.getReceiptRegistrationPageLists ()
                            }
                        })
                    }
                })
            },

            getReceiptRegistrationPageLists (text) {
                getReceiptRegistrationPageList ({
                    ...text,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size
                }).then (res => {
                    if (res) {
                        this.tableData = res
                    } 
                })
            },

            addReceiptRegistration () {
                this.transform.isShowDetails = false
                this.routerLink ('添加收文管理')
            },

            selectChangeData (boolean = true) {
                if (boolean) this.resetPage ()
                this.getReceiptRegistrationPageLists ({
                    'name': this.filterText ? this.filterText : null,
                    'state': this.audit ? this.audit : null,
                    'isreceive': this.isreceive ? this.isreceive : null,
                    'prostate': this.procState ? this.procState : null,
                    'createTime': this.createDate ? this.createDate[0] : null,
                    'updateTime': this.createDate ? this.createDate[1] : null
                })
            },

            routerLink (title, procInstId, id = '') {
                this.$router.push ({
                    path: `updataReceiptRegistration`,
                    name: 'updataReceiptRegistration',
                    params: {
                        relevancyId: id,
                        procInstId: procInstId,
                        transform: this.transform,

                    }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            },

            checkReceiptRegistrationData (data) {
                checkReceiptRegistration (data).then (res => {
                    if (res.code === 200) {
                        this.$message.success ('审核成功')
                        this.selectChangeData ()
                    }
                })
            },

            againstReceiptRegistrationData () {
                if (this.selectTableData.length !== 1) {
                    this.$message.warning ('请选择一条数据')
                    return
                }
                if (this.selectTableData[0]['audit'] === '0') {
                    this.$message.warning ('数据未审核')
                    return
                }
                againstReceiptRegistration (this.selectTableData[0]).then (res => {
                    if (res.code === 200) {
                        this.$message.success ('反审核成功')
                        this.selectChangeData ()
                    }
                })
            },

            auditReceiptRegistration () {
                if (this.selectTableData.length !== 1) {
                    this.$message.warning ('请选择一条数据')
                    return
                }
                if (this.selectTableData[0]['audit'] === '0') {
                    this.checkReceiptRegistrationData (this.selectTableData[0])
                } else {
                    this.$message.warning ('数据已审核')
                }
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

        created() {
            this.getReceiptRegistrationPageLists ()   
        }
    }
</script>