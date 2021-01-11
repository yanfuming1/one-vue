<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <determine-project v-if="identification == '2'" title='合同计量' :proId="projectId"></determine-project>
                <project-info v-if="identification == '1'"></project-info>
                <project-common v-if="identification == '2'"></project-common>
                <span class="qqt-container-full-header-operation___left" v-if="auth.add">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addContractMeasure">添加</el-button>
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
                <span class="qqt-container-full-header-operation___right" v-if="auth.delBat">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deleteContractMeasureList">批量删除</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <p>办理状态:</p>
                    <div class="qqt-container-full-header-state___select">
                        <qqt-select :value="procState" :options="options" :size="'mini'" :placeholder="'请选择'" @select="procState = $event, searchModelSynopsis ()"></qqt-select>
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
            <qqt-table :data="tableData" ref="table" :exportData="tableData.records" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange" />
        </div>
    </d2-container>
</template>

<script>
    import { getSelfContractMeasurePageList, getContractMeasurePageList, getJointContractMeasurePageList,
             deleteBatchSelfContractMeasure, deleteBatchContractMeasure, deleteBatchJointContractMeasure } from '@/api/selfProject/contract/contractMeasure'
    import { qqtTable, qqtSelect } from '@/components/qqt-subassembly'
    import { mapState } from 'vuex'

    import util from '@/libs/util.js'
    import projectInfo from '../../../components/commenInfo/projectInfo'
    import projectCommon from '../../../../jontProjectDetail/components/projectCommon'
    import determineProject from '../../../../jontProjectDetail/components/determineProject'
    export default {
        data () {
            return {
                procState: '',
                projectId: '',
                filterText: '',
                projectCode: null,
                identification: '',
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
                auth: {
                    add: true,
                    edit: true,
                    delBat: true
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
                        prop: 'contractcode',
                        label: '合同编号',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = true
                                        this.routerLink ('合同计量详情', parms.row.id, false, parms.row.procInstId)
                                    }
                                }
                            }, parms.row.contractcode)
                        }
                    },
                    {
                        prop: 'contractname',
                        label: '合同名称',
                        isShow: true
                    },
                    {
                        prop: 'projectName',
                        label: '关联项目',
                        isShow: true
                    },
                    {
                        prop: 'meterednum',
                        label: '计量编号',
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
                        prop: 'nominee',
                        label: '待办人',
                        isShow: true,
                        render: (h, parms) => {
                            return h('span', {}, parms.row.nominee ? parms.row.nominee : '无' )
                        }
                    },
                    {
                        prop: 'contracttype',
                        label: '合同类型',
                        isShow: true,
                    },
                    {
                        prop: 'differserv',
                        label: '业务分类',
                        isShow: true,
                    },
                    {
                        prop: 'createName',
                        label: '计量人',
                        isShow: true,
                    },
                    {
                        prop: 'createTime',
                        label: '计量时间',
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
                                this.auth.edit ? h ('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    attrs: {
                                        disabled: util.isDisabled (parms.row.procState)
                                    },
                                    on:{
                                        click: () => {
                                            this.transform.isShowDetails = false
                                            this.routerLink ('合同计量编辑', parms.row.id)
                                        }
                                    }
                                }, '编辑') : '',
                                this.auth.delBat ? h ('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    attrs: {
                                        disabled: util.isDisabled (parms.row.procState)
                                    },
                                    on:{
                                        click: () => {
                                            this.deleteContractMeasureObject (parms.row.id)
                                        }
                                    }
                                }, '删除') : ''
                            ]
                        }
                    }
                ],
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
                ]
            }
        },

        methods: {

            selectChange (item) {
                this.tableSelectData = item
            },

            searchModelSynopsis (boolean = true) {
                if (boolean) this.resetPage ()
                this.getContractMeasurePage ({
                    'keywords': this.filterText ? this.filterText : null,
                    'time': this.createDate && this.createDate.length > 0 ? `${this.createDate[0]},${this.createDate[1]}` : null,
                    'procState': this.procState ? this.procState : null
                })
            },

            handlePaginationChange (page) {
                this.page = page
                this.$nextTick(() => {
                    this.searchModelSynopsis (false)
                });
            },

            getContractMeasurePage (text) {
                let url = ''
                switch (this.identification) {
                    case '1':
                        url = getSelfContractMeasurePageList
                        break
                    case '2':
                        url = getJointContractMeasurePageList
                        break
                    default:
                        url = getContractMeasurePageList
                        break
                }
                url ({
                    ...text,
                    'projectCode': this.projectCode,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size
                }).then( res => {
                    if (res) this.tableData = res
                })
            },

            deleteContractMeasureObject (id) {
                this.deleteContractMeasureById ({'ids': id})
            },

            deleteContractMeasureList () {
                if (this.tableSelectData.length === 0) {
                    this.$message.warning ('请选择一条数据')
                    return
                }
                let ids = '', procInName = ''
                if (this.tableSelectData && this.tableSelectData.length > 0) {
                    this.tableSelectData.forEach(res => {
                        ids += res.id + ','
                        if (res.procState !== '1') procInName += res.contractname + ',' 
                    })
                }

                if (procInName) {
                    this.$message.warning (`${procInName} 已提交流程无法删除`)
                    return
                }
                this.deleteContractMeasureById ({'ids': ids.substring(0, ids.length - 1)})
            },

            deleteContractMeasureById (id) {
                util.confirm ().then (boolean => {
                    if (boolean) {
                        let url = ''
                        switch (this.identification) {
                            case '1':
                                url = deleteBatchSelfContractMeasure
                                break
                            case '2':
                                url = deleteBatchJointContractMeasure
                                break
                            default:
                                url = deleteBatchContractMeasure
                                break
                        }
                        url (id).then(res => {
                            if (res.code === 200) {
                                this.$message.success(res.message)
                                this.getContractMeasurePage ()
                            }
                        })
                    }
                })
            },

            duplicateContractMeasure () {
                if (this.tableSelectData.length != 1) {
                    this.$message.warning ('请选择一条数据')
                    return
                }

                this.routerLink ('添加合同签订', this.tableSelectData[0].id, true)
            },

            addContractMeasure () {
                this.transform.isShowDetails = false
                this.routerLink ('添加合同计量')
            },

            resetModelSynopsis () {
                this.filterText = this.procState = ''
                this.createDate = []
                this.resetPage ()
                this.getContractMeasurePage ()
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

            routerLink (title, id = '', isDuplicate = false, procInstId) {
                let route = '', returnPath = ''
                switch (this.identification) {
                    case '1':
                        route = 'addSelfProjectContractMeasure'
                        returnPath = 'contractMeasure/selfSupportProject/1'
                        break
                    case '2':
                        route = 'addJointProjectContractMeasure'
                        returnPath = 'contractMeasure/jointProject/2'
                        break
                    default:
                        route = 'addContractMeasure'
                        returnPath = 'contractMeasure'
                        break
                }
                this.$router.push ({ path: route, name: route, params: {
                                                                    relevancyId: id,
                                                                    transform: this.transform,
                                                                    isDuplicate: isDuplicate,
                                                                    procInstId: procInstId,
                                                                    identification: this.identification,
                                                                    path: returnPath
                                                                }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            },

            // 验证权限
            _validationAuth () {
                switch (this.identification) {
                    case '1':
                        this.auth.add        =         this.$has ('self:contractMeter:add')
                        this.auth.edit       =        this.$has ('self:contractMeter:edit')
                        this.auth.delBat     =      this.$has ('self:contractMeter:delete')
                        break
                    case '2':
                        this.auth.add        =         this.$has ('joint:contractMeter:add')
                        this.auth.edit       =        this.$has ('joint:contractMeter:edit')
                        this.auth.delBat     =      this.$has ('joint:contractMeter:delete')
                        break
                    default:
                        this.auth.add        =       this.$has ('bargain:contractMeter:add')
                        this.auth.edit       =      this.$has ('bargain:contractMeter:edit')
                        this.auth.delBat     =    this.$has ('bargain:contractMeter:delete')
                        break
                }
            },

            decideLoadDataWay () {
                this.identification = this.$route.params.identification
                switch (this.identification) {
                    case '1':
                        this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad')
                        break
                    case '2':
                        this.$store.dispatch('d2admin/db/database', {user: true}).then (db => {
                            this.projectCode = db.get('proCode').value()
                            this.projectId = db.get('proID').value()
                            this.getContractMeasurePage ()
                        })
                        break
                    default:
                        this.getContractMeasurePage ()
                        break
                }
            }
        },

        components: {
            'qqt-table': qqtTable,
            'qqt-select': qqtSelect,
            'project-info': projectInfo,
            'project-common': projectCommon,
            'determine-project': determineProject
        },

        created () {
            this.decideLoadDataWay ()
            this._validationAuth ()
        },

        computed: {
            ...mapState ('d2admin/selfSupportProject', [
                'selfSupportProject'
            ])
        },

        watch: {
            selfSupportProject () {
                this.projectCode = this.selfSupportProject.projectCode
                this.getContractMeasurePage ()
            },
            $route (val) {
                if (val.path.indexOf('contractMeasure') !== -1) {
                    this.decideLoadDataWay ()
                    this._validationAuth ()
                }
            }
        }
    }

</script>
