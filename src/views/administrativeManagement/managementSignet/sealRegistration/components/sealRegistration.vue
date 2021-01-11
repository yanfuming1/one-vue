<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header-operation___left" v-if="$has ('administer:adminSealname:add')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addSealRegistration">印章登记</el-button>
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
                <span class="qqt-container-full-header-operation___right" v-if="$has ('administer:adminSealname:delete')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deleteBatchSealRegistrationData">批量删除</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                        <el-button size="mini" @click="exportExcel" icon="el-icon-upload2">导出</el-button>
                        <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                    </el-button-group>
                </span>
            </div>
        </template>
        <div class="qqt-container-full-center___left">
            <qqt-tree
                :data="data"
                ref="table"
                :exportData="tableData.records"
                :btnTitle="btnTitle"
                :isShowHeader="false"
                :isShowUpdate="auth.edit"
                :isShowDel="auth.del"
                :isBtnTitle="auth.add"
                :defaultProps="defaultProps"
                @delete="deleteManagementSignet"
                @append="addManagementSignetTree"
                @edit="editManagementSignetTree"
                @historicalData="historicalDataObject"></qqt-tree>
        </div>
        <div class="qqt-container-full-center___right">
            <qqt-table :data="tableData" ref="table" :exportData="tableData.records" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange"></qqt-table>
        </div>
        <updata-seal-registration v-if="dialogVisible" :dialogVisible="dialogVisible" :archiveId="archiveId" :classify="data" :managementSignetTreeId="historicalData.id" :name="name" :transform="transform" @close="updataSealRegistrationList"/>
        <add-classification v-if="addTreeDialog" :dialogVisible="addTreeDialog" :managementSignetTreeId="historicalData.id" @close="updataClassification" />
    </d2-container>
</template>

<script>
    import { qqtTree, qqtTable } from '../../../../../components/qqt-subassembly'
    import { deleteBatchSealRegistration, getSealRegistrationPageList, getSealRegistration } from '../../../../../api/administrativeManagement/managementSignet/sealRegistration'
    import { getManagementSignetTree, deleteManagementSignetTree } from '../../../../../api/administrativeManagement/sealClassification'

    import addClassification from '../../printsBeforeApply/components/addClassification'
    import updataSealRegistration from './updataSealRegistration'
    import util from '@/libs/util.js'
    export default {

        data () {
            return {
                data: [],
                filterText: '',
                archiveId: '',
                name: '',
                dialogVisible: false,
                addTreeDialog: false,
                tableOption: {},
                historicalData: {
                    id: ''
                },
                dynamicHeader: {
                    tableId: 'T_1572430422540',
                    isSave: true
                },
                page: {
                    current: 1,
                    size: 10,
                    total: 0
                },
                auth: {
                    add: false,
                    edit: false,
                    del: false
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
                                        this.name = '印章登记详情'
                                        this.dialogVisible = true
                                        this.archiveId = parms.row.id
                                        this.transform.isShowDetails = true
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
                        prop: 'encoding',
                        label: '印章编号',
                        isShow: true
                    },
                    {
                        prop: 'engtime',
                        label: '刻制时间',
                        isShow: true
                    },
                    {
                        prop: 'keepdepartment',
                        label: '保管单位',
                        isShow: true
                    },
                    {
                        prop: 'keepperson',
                        label: '保管人',
                        isShow: true
                    },
                    {
                        prop: 'createName',
                        label: '登记人',
                        isShow: true
                    },
                    {
                        prop: 'createTime',
                        label: '登记时间',
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
                                this.$has ('administer:adminSealname:edit') ? h('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    on:{
                                        click: () => {
                                            this.name = '编辑印章登记'
                                            this.dialogVisible = true
                                            this.archiveId = parms.row.id
                                            this.transform.isShowDetails = false
                                        }
                                    }
                                }, '编辑') : '',
                                this.$has ('administer:adminSealname:deleteBatch') ? h('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    on:{
                                        click: () => {
                                            this.deleteSealRegistrationTable (parms.row.id)
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

            historicalDataObject (item) {
                this.historicalData = item
                this.getSealRegistrationList (item.id)
            },

            getManagementSignetTreeList () {
                getManagementSignetTree().then(result => {
                    if (result.records && result.records.length > 0) {
                        this.data = result.records
                        if (this.historicalData.id === '') {
                            this.historicalData = result.records[0]
                            this.getSealRegistrationList (result.records[0].id)
                        } else {
                            this.getSealRegistrationList (this.historicalData.id)
                        }
                    }
                })
            },

            deleteManagementSignet (data) {
                deleteManagementSignetTree({'id': data.id}).then(result => {
                    if (result.code === 200) {
                        this.$message.success('删除成功')
                        this.getManagementSignetTreeList ()
                    }
                })
            },

            resetModelSynopsis () {
                this.filterText = ''
                this.createDate = []
                this.resetPage ()
                this.getSealRegistrationList (this.historicalData.id)
            },

            deleteBatchSealRegistrationData () {
                if (this.selectTableData.length === 0) {
                    this.$message.warning ('至少选择一条数据')
                    return
                }

                let str = ''
                this.selectTableData.filter ( f => str += f.id + ',')
                this.deleteSealRegistrationTable (str.substring (0, str.length - 1))
            },

            deleteSealRegistrationTable (id) {
                util.confirm ().then (boolean => {
                    if (boolean) {
                        deleteBatchSealRegistration ({'ids': id}).then (res => {
                            if (res.code === 200) {
                                this.$message.success ('删除成功')
                                this.getSealRegistrationList (this.historicalData.id)
                            }
                        })
                    }
                })
            },

            getSealRegistrationList (id) {
                getSealRegistration ({
                    'sealtype': id,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size
                }).then (res => {
                    if (res) {
                        this.tableData = res
                    }
                })
            },

            getSealRegistrationPageLists (id, text) {
                getSealRegistrationPageList ({
                    ...text,
                    'sealtype': id,
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
                    if (this.filterText === '') {
                        this.getSealRegistrationList (this.historicalData.id)
                    } else {
                        this.selectChangeData (false)
                    }
                })
            },

            selectChange (item) {
                this.selectTableData = item
            },

            addSealRegistration () {
                this.name = '印章登记'
                this.dialogVisible = true
                this.archiveId = ''
                this.transform.isShowDetails = false
            },

            updataSealRegistrationList (boolean, id = this.historicalData.id) {
                this.dialogVisible = false
                if (boolean) {
                    this.getSealRegistrationList (id)
                }
            },

            addManagementSignetTree () {
                this.historicalData.id = ''
                this.addTreeDialog = true
            },

            updataClassification (boolean) {
                this.addTreeDialog = false
                if (boolean) {
                    this.getManagementSignetTreeList ()
                }
            },

            neatenSecretLevelData (id) {
                let item = this.data.find (f => f.id === id)
                if (item) {
                    return item.name
                }
            },

            editManagementSignetTree (data) {
                this.historicalData = data
                this.addTreeDialog = true
            },

            selectChangeData (boolean = true) {
                if (boolean) this.resetPage ()
                this.getSealRegistrationPageLists (this.historicalData.id, {
                    'name': this.filterText ? this.filterText : null,
                    'createTime': this.createDate ? this.createDate[0] : null,
                    'updateTime': this.createDate ? this.createDate[1] : null
                })
            },

            exportExcel () { 
                this.$refs.table.getExportExcel ()
            },

            printTable () {
                this.$refs.table.printTable (this.selectTableData)
            },

            // 验证权限
            _validationAuth () {
                this.auth.add = this.$has ('administer:adminSealgroup:add')
                this.auth.edit = this.$has('administer:adminSealgroup:edit')
                this.auth.del = this.$has('administer:adminSealgroup:delete')
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
            'add-classification': addClassification,
            'updata-seal-registration': updataSealRegistration
        },

        created () {
            this.getManagementSignetTreeList()
            this._validationAuth ()
        }
    }
</script>
