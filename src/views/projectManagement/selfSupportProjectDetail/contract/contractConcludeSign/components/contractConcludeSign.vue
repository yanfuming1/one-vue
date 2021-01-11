<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <determine-project v-if="identification == '2'" title='合同签订' :proId="projectId"></determine-project>
                <project-info v-if="identification == '1'"></project-info>
                <project-common v-if="identification == '2'"></project-common>
                <span class="qqt-container-full-header-operation___left" v-if="auth.add">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addContractConcludeSign">添加</el-button>
                </span>
                <span class="qqt-container-full-header-operation___left" v-if="auth.add">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="duplicateContractConcludeSign">复制</el-button>
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
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deleteContractConcludeSignList">批量删除</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right" v-if="auth.editState">
                    <el-button type="danger" class="qqt-container-full-header-top___button" @click="updataContractConcludeState">合同存档</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <p>办理状态:</p>
                    <div class="qqt-container-full-header-state___select">
                        <qqt-select :value="procState" :options="options" :size="'mini'" :placeholder="'请选择'" @select="procState = $event, searchModelSynopsis ()"></qqt-select>
                    </div>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <p>存档状态:</p>
                    <div class="qqt-container-full-header-state___select">
                        <qqt-select :value="issave" :options="isSaveOptions" :size="'mini'" :placeholder="'请选择'" @select="issave = $event, searchModelSynopsis ()"></qqt-select>
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
    import { getSelfContractConcludeSignPageList, getContractConcludeSignPageList, getJointContractConcludeSignPageList,
             deleteBatchSelfContractConcludeSign, deleteBatchContractConcludeSign, deleteBatchJointContractConcludeSign,
             updataSelfContractConcludeSignState, updataContractConcludeSignState, updataJointContractConcludeSignState } from '@/api/selfProject/contract/contractConcludeSign'
    import { qqtTable, qqtSelect } from '@/components/qqt-subassembly'
    import { mapState } from 'vuex'

    import util from '@/libs/util.js'
    import projectInfo from '../../../components/commenInfo/projectInfo'
    import projectCommon from '../../../../jontProjectDetail/components/projectCommon'
    import determineProject from '../../../../jontProjectDetail/components/determineProject'
    export default {
        data () {
            return {
                issave: '',
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
                    isShowDetails: false,
                    isShowElementIcon: false,
                    prop: {}
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
                    delBat: true,
                    editState: true,
                    alteration: true,
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
                                        this.routerLink ('合同签订详情', parms.row.id, false, false, parms.row.procInstId)
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
                        prop: 'contractpriceStr',
                        label: '合同总金额(元)',
                        isShow: true,
                        render: (h, parms) => {
                            return h('span', {}, parms.row.contractpriceStr = util.moneyTransform (parms.row.contractprice))
                        }
                    },
                    {
                        prop: 'signedtime',
                        label: '签订时间',
                        isShow: true,
                    },
                    {
                        prop: 'save',
                        label: '存档状态',
                        isShow: true,
                        render: (h, parms) => {
                            return h('span', {}, parms.row.save = parms.row.issave == '0' ? '未存档' : '已存档' )
                        }
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
                        width: 200,
                        fixed: 'right',
                        render: (h, parms) => {
                            return [
                                this.auth.alteration ? h ('el-button', {
                                    props:{
                                        type: 'danger',
                                        size: 'mini',
                                        round: true
                                    },
                                    style: {
                                        padding: '5px 10px'
                                    },
                                    attrs: {
                                        disabled: parms.row.procState == '10' ? false : true
                                    },
                                    on:{
                                        click: () => {
                                            this.transform.isShowDetails = false
                                            this.routerLink ('合同签订变更', parms.row.id, true)
                                        }
                                    }
                                }, '变更') : '',
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
                                            this.routerLink ('合同签订编辑', parms.row.id)
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
                                            this.deleteContractConcludeSignObject (parms.row.id)
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
                ],
                isSaveOptions: [
                    {
                        value: '0',
                        label: '未存档'
                    },
                    {
                        value: '1',
                        label: '已存档'
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
                this.getContractConcludeSignPage ({
                    'keywords': this.filterText ? this.filterText : null,
                    'time': this.createDate && this.createDate.length > 0 ? `${this.createDate[0]},${this.createDate[1]}` : null,
                    'procState': this.procState ? this.procState : null,
                    'issave': this.issave ? this.issave : null
                })
            },

            handlePaginationChange (page) {
                this.page = page;
                this.$nextTick(() => {
                    this.searchModelSynopsis (false)
                });
            },

            getContractConcludeSignPage (text) {
                let url = ''
                switch (this.identification) {
                    case '1':
                        url = getSelfContractConcludeSignPageList
                        break
                    case '2':
                        url = getJointContractConcludeSignPageList
                        break
                    default:
                        url = getContractConcludeSignPageList
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

            deleteContractConcludeSignObject (id) {
                this.deleteContractConcludeSignById ({'ids': id})
            },

            deleteContractConcludeSignList () {
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
                this.deleteContractConcludeSignById ({'ids': ids.substring(0, ids.length - 1)})
            },

            deleteContractConcludeSignById (id) {
                util.confirm ().then (boolean => {
                    if (boolean) {
                        let url = ''
                        switch (this.identification) {
                            case '1':
                                url = deleteBatchSelfContractConcludeSign
                                break
                            case '2':
                                url = deleteBatchJointContractConcludeSign
                                break
                            default:
                                url = deleteBatchContractConcludeSign
                                break
                        }
                        url (id).then(res => {
                            if (res.code === 200) {
                                this.$message.success(res.message)
                                this.getContractConcludeSignPage ()
                            }
                        })
                    }
                })
            },

            updataContractConcludeState () {
                if (this.tableSelectData.length != 1) {
                    this.$message.warning ('请选择一条数据')
                    return
                }
                let url = ''
                switch (this.identification) {
                    case '1':
                        url = updataSelfContractConcludeSignState
                        break
                    case '2':
                        url = updataContractConcludeSignState
                        break
                    default:
                        url = updataContractConcludeSignState
                        break
                }
                url ({'id': this.tableSelectData[0].id, 'issave': this.tableSelectData[0].issave}).then (res => {
                    if (res.code == 200) this.$message.success (res.message), this.getContractConcludeSignPage ()
                })
            },

            duplicateContractConcludeSign () {
                if (this.tableSelectData.length != 1) {
                    this.$message.warning ('请选择一条数据')
                    return
                }

                this.routerLink ('添加合同签订', this.tableSelectData[0].id, false, true)
            },

            addContractConcludeSign () {
                this.transform.isShowDetails = false
                this.routerLink ('添加合同签订')
            },

            resetModelSynopsis () {
                this.filterText = this.procState = this.issave = ''
                this.createDate = []
                this.resetPage ()
                this.getContractConcludeSignPage ()
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

            routerLink (title, id = '', isAlteration = false, isDuplicate = false, procInstId) {
                console.log(this.identification);
                let route = '', returnPath = ''
                switch (this.identification) {
                    case '1':
                        route = 'addSelfProjectContractConcludeSign'
                        returnPath = 'contractConcludeSign/selfSupportProject/1'
                        break
                    case '2':
                        route = 'addJointProjectContractConcludeSign'
                        returnPath = 'contractConcludeSign/jointProject/2'
                        break
                    default:
                        route = 'addContractConcludeSign'
                        returnPath = 'contractConcludeSign'
                        break
                }
                this.$router.push ({ path: route, name: route, params: {
                                                                    relevancyId: id,
                                                                    transform: this.transform,
                                                                    path: returnPath,
                                                                    isAlteration: isAlteration,
                                                                    isDuplicate: isDuplicate,
                                                                    procInstId: procInstId,
                                                                    identification: this.identification
                                                                }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            },

            // 验证权限
            _validationAuth () {
                switch (this.identification) {
                    case '1':
                        this.auth.add        =         this.$has ('self:managerCreate:add')
                        this.auth.alteration =         this.$has ('self:managerChange:add')
                        this.auth.edit       =        this.$has ('self:managerCreate:edit')
                        this.auth.delBat     =      this.$has ('self:managerCreate:delete')
                        this.auth.editState  =   this.$has ('self:managerCreate:editState')
                        break
                    case '2':
                        this.auth.add        =         this.$has ('joint:managerCreate:add')
                        this.auth.alteration =         this.$has ('joint:managerChange:add')
                        this.auth.edit       =        this.$has ('joint:managerCreate:edit')
                        this.auth.delBat     =      this.$has ('joint:managerCreate:delete')
                        this.auth.editState  =   this.$has ('joint:managerCreate:editState')
                        break
                    default:
                        this.auth.add        =       this.$has ('bargain:managerCreate:add')
                        this.auth.alteration =       this.$has ('bargain:managerChange:add')
                        this.auth.edit       =      this.$has ('bargain:managerCreate:edit')
                        this.auth.delBat     =    this.$has ('bargain:managerCreate:delete')
                        this.auth.editState  = this.$has ('bargain:managerCreate:editState')
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
                            this.getContractConcludeSignPage ()
                        })
                        break
                    default:
                        this.getContractConcludeSignPage ()
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
                this.getContractConcludeSignPage ()
            },
            $route (val) {
                if (val.path.indexOf('contractConcludeSign') !== -1) {
                    this.decideLoadDataWay ()
                    this._validationAuth ()
                }
            }
        },
    }

</script>
