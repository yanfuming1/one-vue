<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header-operation___left" v-if="$has ('administer:adminEngapply:add')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addPrintsBeforeApply">刻章申请</el-button>
                </span>
                <span class="qqt-container-full-header___search">
                    <el-input
                        placeholder="请输入内容"
                        prefix-icon="el-icon-search"
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
                <span class="qqt-container-full-header-operation___right" v-if="$has ('administer:adminEngapply:delete')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deleteBatchPrintsBeforeApplyData">批量删除</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <p>印章类别:</p>
                    <div class="qqt-container-full-header-state___select">
                        <qqt-select :value="sealtype" :options="data" :size="'mini'" :defaultProp="defaultProps" :placeholder="'请选择'" @select="page.current = 1, page.size = 10, sealtype = $event, selectChangeData()"></qqt-select>
                    </div>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <p>办理状态</p>
                    <div class="qqt-container-full-header-state___select">
                        <qqt-select :value="procState" :options="options" :size="'mini'" :placeholder="'请选择'" @select="page.current = 1, page.size = 10, procState = $event, selectChangeData()"></qqt-select>
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
                        <el-button size="mini" icon="el-icon-check" @click="auditPrintsBeforeApply">审核</el-button>
                        <el-button size="mini" icon="el-icon-close" @click="againstPrintsBeforeApplyData">反审核</el-button>
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
    import { qqtTree, qqtTable, qqtSelect } from '../../../../../components/qqt-subassembly'
    import { deleteBatchPrintsBeforeApply, getPrintsBeforeApplyPageList, 
             againstPrintsBeforeApply, checkPrintsBeforeApply } from '../../../../../api/administrativeManagement/managementSignet/printsBeforeApply'
    import { getManagementSignetTree } from '../../../../../api/administrativeManagement/sealClassification'

    import util from '@/libs/util.js'
    export default {
        name: 'printsBeforeApply',
        data () {
            return {
                data: [],
                filterText: '',
                audit: '',
                sealtype: '',
                procState: '',
                title: '印章分类',
                dialogVisible: false,
                tableOption: {},
                historicalData: {
                    id: ''
                },
                dynamicHeader: {
                    tableId: 'T_1572430413542',
                    isSave: true
                },
                page: {
                    current: 1,
                    size: 10,
                    total: 0
                },
                btnTitle: {
                    name: '新建分类',
                    icon: 'el-icon-folder-add'
                },
                defaultProps: {
                    children: 'children',
                    label: 'name',
                    value: 'id'
                },
                transform: {
                    isShowDetails: false
                },
                tableData: {},
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
                rowHeader: [
                    {
                        prop: 'name',
                        label: '印章名称',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = true
                                        this.routerLink ('刻章申请详情', parms.row.id, parms.row.procInstId)
                                    }
                                }
                            }, parms.row.name)
                        }
                    },
                    {
                        prop: 'sealtypeName',
                        label: '印章类别',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {},
                                parms.row.sealtypeName = this.neatenSecretLevelData (parms.row.sealtype)
                            )
                        }
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
                        prop: 'applyreason',
                        label: '申请理由',
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
                                this.$has ('administer:adminEngapply:edit') ? h('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    attrs: {
                                        disabled: util.isDisabled (parms.row.procState)
                                    },
                                    on:{
                                        click: () => {
                                            this.transform.isShowDetails = false
                                            this.routerLink ('编辑刻章申请', parms.row.id, parms.row.procInstId)
                                        }
                                    }
                                },'编辑') : '',
                                this.$has ('administer:adminEngapply:delete') ? h('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    attrs: {
                                        disabled: util.isDisabled (parms.row.procState)
                                    },
                                    on:{
                                        click: () => {
                                            this.deletePrintsBeforeApplyTable (parms.row.id)
                                        }
                                    }
                                }, '删除') : '',
                               
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

            getManagementSignetTreeList () {
                getManagementSignetTree().then(result => {
                    if (result.records && result.records.length > 0) {
                        this.data = result.records
                    }
                })
            },

            resetModelSynopsis () {
                this.filterText  = this.sealtype = this.procState = this.audit = ''
                this.createDate = []
                this.resetPage ()
                this.getPrintsBeforeApplyPageLists ()
            },

            deleteBatchPrintsBeforeApplyData () {
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
                this.deletePrintsBeforeApplyTable (str.substring (0, str.length - 1))
            },

            deletePrintsBeforeApplyTable (id) {
                util.confirm ().then (boolean => {
                    if (boolean) {
                        deleteBatchPrintsBeforeApply ({'ids': id}).then (res => {
                            if (res.code === 200) {
                                this.$message.success ('删除成功')
                                this.selectChangeData ()
                            }
                        })
                    }
                })
            },

            getPrintsBeforeApplyPageLists (text) {
                getPrintsBeforeApplyPageList ({
                    ...text,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size
                }).then (res => {
                    if (res) {
                        this.tableData = res
                    }
                })
            },

            handlePaginationChange (page) {
                this.page = page
                this.$nextTick(() => {
                    this.selectChangeData (false)
                })
            },

            selectChange (item) {
                this.selectTableData = item
            },

            addPrintsBeforeApply () {
                this.transform.isShowDetails = false
                this.routerLink ('添加刻章申请')
            },

            routerLink (title, id, procInstId) {
                this.$router.push ({
                    path: `updataPrintsBeforeApply`,
                    name: 'updataPrintsBeforeApply',
                    params: {
                        relevancyId: id,
                        procInstId: procInstId,
                        transform: this.transform,
                        managementSignetTreeId: this.sealtype || this.data[0]['id']
                    }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            },

            neatenSecretLevelData (id) {
                let item = this.data.find (f => f.id === id)
                if (item) {
                    return item.name
                }
            },

            selectChangeData (boolean = true) {
                if (boolean) this.resetPage ()
                this.getPrintsBeforeApplyPageLists ({
                    'name': this.filterText ? this.filterText : null,
                    'state': this.audit ? this.audit : null,
                    'sealtype': this.sealtype ? this.sealtype : null,
                    'prostate': this.procState ? this.procState : null,
                    'createTime': this.createDate ? this.createDate[0] : null,
                    'updateTime':this.createDate ? this.createDate[1] : null
                })
            },

            checkPrintsBeforeApplyData (data) {
                checkPrintsBeforeApply (data).then (res => {
                    if (res.code === 200) {
                        this.$message.success ('审核成功')
                        this.selectChangeData ()
                    }
                })
            },

            againstPrintsBeforeApplyData () {
                if (this.selectTableData.length !== 1) {
                    this.$message.warning ('请选择一条数据')
                    return
                }
                if (this.selectTableData[0]['audit'] === '0') {
                    this.$message.warning ('数据未审核')
                    return
                }
                againstPrintsBeforeApply (this.selectTableData[0]).then (res => {
                    if (res.code === 200) {
                        this.$message.success ('反审核成功')
                        this.selectChangeData ()
                    }
                })
            },

            auditPrintsBeforeApply () {
                if (this.selectTableData.length !== 1) {
                    this.$message.warning ('请选择一条数据')
                    return
                }
                if (this.selectTableData[0]['audit'] === '0') {
                    this.checkPrintsBeforeApplyData (this.selectTableData[0])
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

        components: {
            'qqt-tree': qqtTree,
            'qqt-table': qqtTable,
            'qqt-select': qqtSelect
        },

        created () {
            this.getManagementSignetTreeList ()
            this.getPrintsBeforeApplyPageLists ()
        },

        watch: {
            $route (val) {
                if (val.path.indexOf('printsBeforeApply') !== -1) {
                    if (val.params && val.params.sealtype) {
                        this.sealtype = val.params.sealtype
                        this.selectChangeData ()
                    } else {
                        this.getManagementSignetTreeList ()
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .qqt-container-full-header-state___select {
        width: 7% !important;
    }
</style>>