<template>
    <d2-container type="fulls" class="archive-registration">
        <template slot="header">
            <determine-project v-if="identification == '1'" title='档案登记' :proId="proId"></determine-project>
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header-operation___left" v-if="$has ('administer:adminFile:add')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addArchiveRegistration">添加</el-button>
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
                <span class="qqt-container-full-header-operation___right" v-if="$has ('administer:adminFile:delete')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deleteBatchArchiveRegistrationData">批量删除</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <p>借阅状态:</p>
                    <div class="qqt-container-full-header-state___select">
                        <qqt-select :value="borrowStatus" :options="options" :size="'mini'" :placeholder="'请选择'" @select="page.current = 1, page.size = 10, getToBorrow ($event)"></qqt-select>
                    </div>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <p>档案类型:</p>
                    <div class="qqt-container-full-header-state___select">
                        <qqt-select :value="filecategory" :options="fileTypeList" :defaultProp="defaultProp" :size="'mini'" :placeholder="'请选择'" @select="filecategory = $event, selectChangeData ()"></qqt-select>
                    </div>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button type="warning" class="qqt-container-full-header-top___button" v-if="$has ('administer:adminFileLoan:add')" @click="borrowedRecord">借阅申请</el-button>
                    <el-button type="warning" class="qqt-container-full-header-top___button" v-if="$has ('administer:adminFileLoan:giveBack')" @click="borrowedReturn">借阅归还</el-button>
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
        <add-archive-registration v-if="dialogVisible" :dialogVisible="dialogVisible" :identification="identification" :proId="proId" :projectName="projectName" :name="title" :id="archiveId" :transform="transform" @close="closeDialogVisible"></add-archive-registration>
    </d2-container>
</template>

<script>
    import { qqtTable, qqtSelect } from '../../../../../components/qqt-subassembly'
    import { getArchiveRegistration, 
             deleteBatchArchiveRegistration, getProjectArchivePageList,
             getArchiveRegistrationPageList, borrowedArchiveRegistration } from '../../../../../api/administrativeManagement/archivesManagement/archiveRegistration'
    import { ADMINISTRATIVEMANAGEMENTDICTIONARY } from '../../../../../enum/DICTIONARY'
    import { queryDicById } from '../../../../../api/jointProject/index'

    import determineProject from '../../../../projectManagement/jontProjectDetail/components/determineProject'
    import addArchiveRegistration from './addArchiveRegistration'
    import util from '@/libs/util.js'
    export default {

        name: 'archiveRegistration',

        components: {
            'qqt-table': qqtTable,
            'qqt-select': qqtSelect,
            'determine-project': determineProject,
            'add-archive-registration':addArchiveRegistration
        },

        data () {
            return {
                filterText: '',
                title: '新建档案',
                archiveId: '',
                borrowStatus: '',
                filecategory: '',
                dialogVisible: false,
                tableData: {},
                createDate: [],
                tableOption: {},
                transform: {
                    isShowDetails: false
                },
                dynamicHeader: {
                    tableId: 'T_1572430224542',
                    isSave: true,
                },
                defaultProp: {
                    value: 'name',
                    label: 'name'
                },
                page: {},
                identification: '', // 行政还是项目
                proId: null,
                projectName: null,
                selectTableData: [],
                fileTypeList: [],
                options: [
                    {
                        value: '0',
                        label: '可借阅'
                    },
                    {
                        value: '1',
                        label: '审批中'
                    },
                    {
                        value: '2',
                        label: '已借阅'
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
                                            this.dialogVisible = true
                                            this.title = '档案详情'
                                            this.archiveId = parms.row.id
                                            this.transform.isShowDetails = true
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
                        prop: 'filecategory',
                        label: '档案类型',
                        isShow: true
                    },
                    {
                        prop: 'filetypeName',
                        label: '存储方式',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {},
                                parms.row.filetypeName = this.neatenFileTypeData (parms.row.filetype)
                            )
                        }
                    },
                    {
                        prop: 'isLoanName',
                        label: '借阅状态',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {},
                                parms.row.isLoanName = this.neatenLoanData (parms.row.isLoan)
                            )
                        }
                    },
                    {
                        prop: 'shelfLife',
                        label: '保存期限/年',
                        isShow: true
                    },
                    {
                        prop: 'secretlevel',
                        label: '密级',
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
                                this.$has ('administer:adminFile:add') ? h('el-button', {
                                    props: {
                                        type: 'text',
                                    },
                                    attrs: {
                                        disabled: parms.row.isLoan !== '0' ? true : false
                                    },
                                    on: {
                                        click: () => {
                                            this.dialogVisible = true
                                            this.title = '编辑档案'
                                            this.archiveId = parms.row.id
                                            this.transform.isShowDetails = false
                                        }
                                    }
                                }, '编辑' ) : '',
                                this.$has ('administer:adminFile:delete') ? h('el-button', {
                                    props: {
                                        type: 'text',
                                    },
                                    attrs: {
                                        disabled: parms.row.isLoan !== '0' ? true : false
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteArchiveRegistration (parms.row.id)
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

            addArchiveRegistration () {
                this.dialogVisible = true
                this.title = '新建档案'
                this.archiveId = ''
                this.transform.isShowDetails = false
            },

            resetModelSynopsis () {
                this.filterText = this.filecategory = ''
                this.createDate = []
                this.borrowStatus = ''
                this.getArchiveRegistrationPageLists ()
            },

            deleteBatchArchiveRegistrationData () {
                if (this.selectTableData.length === 0) {
                    this.$message.warning ('至少选择一条数据')
                    return
                }

                let str = ''
                this.selectTableData.filter ( f => str += f.id + ',')
                this.deleteArchiveRegistration (str.substring (0, str.length - 1))
            },

            deleteArchiveRegistration (id) {
                util.confirm ().then (boolean => {
                    if (boolean) {
                        deleteBatchArchiveRegistration ({'ids': id}).then((res) => {
                            if (res.code === 200) {
                                this.$message.success ('删除成功')
                                this.getArchiveRegistrationPageLists ()
                            }
                        })
                    }
                })
            },

            getQueryDicByIdList () {
                queryDicById ({'id': ADMINISTRATIVEMANAGEMENTDICTIONARY.FILETYPE}).then (res => {
                    if (res) this.fileTypeList = res
                })
            },

            borrowedRecord () {
                if (this.selectTableData.length !== 1) {
                    this.$message.warning ('请选择一条数据')
                    return
                }
                if (this.selectTableData[0].isLoan != '0') {
                    this.$message.warning ('当前文件已借阅')
                    return
                }

                this.routerLink (this.selectTableData[0].id, 'archiveRegistration')
            },

            borrowedReturn () {
                if (this.selectTableData.length !== 1) {
                    this.$message.warning ('请选择一条数据')
                    return
                }
                if (this.selectTableData[0].isLoan != '2') {
                    this.$message.warning ('当前文件借阅中')
                    return
                }
                borrowedArchiveRegistration (this.selectTableData[0]).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.getArchiveRegistrationPageLists ()
                    }
                })
            },

            routerLink (id, path) {
                this.$router.push ({
                    path: this.identification === '1' ? 'borrowingApplyProject' : 'borrowingApply',
                    name: this.identification === '1' ? 'borrowingApplyProject' : 'borrowingApply',
                    params: {
                        relevancyId: id,
                        path: path,
                        identification: this.identification
                    }
                })
                this.$store.commit ('d2admin/page/titleSet', '借阅申请')
            },

            getToBorrow (id) {
                this.borrowStatus = id
                this.getArchiveRegistrationPageLists ()
            },

            neatenFileTypeData (str) {
                let filetype = ''
                let list = []
                if (str != null) {
                    list = JSON.parse(str)
                }
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

            neatenSecretLevelData (str) {
                let secretlevel = ''
                switch (str) {
                    case '0':
                        secretlevel = '公开'
                        break;
                    case '1':
                        secretlevel = '机密'
                        break;
                    case '2':
                        secretlevel = '绝密'
                        break;
                }
                return secretlevel
            },

            neatenLoanData (str) {
                let loan = ''
                switch (str) {
                    case '0':
                        loan = '可借阅'
                        break;
                    case '1':
                        loan = '审批中'
                        break;
                    case '2':
                        loan = '已借阅'
                        break;
                }
                return loan
            },

            getArchiveRegistrationPageLists (text) {
                let url = this.identification === '1' ? getProjectArchivePageList : getArchiveRegistrationPageList
                url ({
                    ...text,
                    'isLoan': this.borrowStatus,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size,
                    'projectId': this.identification === '1' ? this.proId : null
                }).then (res => {
                    if (res) {
                        this.tableData = res
                    } 
                })
            },

            closeDialogVisible (boolean) {
                this.dialogVisible = false
                if (boolean) {
                    this.filterText = ''
                    this.filecategory = ''
                    this.createDate = []
                    this.getArchiveRegistrationPageLists ()
                }
            },

            selectChangeData (boolean = true) {
                if (boolean) this.resetPage ()
                this.getArchiveRegistrationPageLists ({
                    'name': this.filterText ? this.filterText : null,
                    'filecategory': this.filecategory ? this.filecategory : null,
                    'createTime': this.createDate ? this.createDate[0] : null,
                    'updateTime':this.createDate ? this.createDate[1] : null
                })
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
            },

            async changeRouter () {
                this.identification = this.$route.params.identification ? this.$route.params.identification : ''
                const db = await this.$store.dispatch('d2admin/db/database', {user: true})
                this.proId = this.identification === '1' ? db.get('proID').value() : null
                this.projectName = this.identification === '1' ? db.get('proName').value() : null
                this.getArchiveRegistrationPageLists ()
            }
        },

        created() {
            this.getQueryDicByIdList ()
            this.resetPage ()
            this.changeRouter()
        },

        watch: {
            $route (val) {
                if (val.path.indexOf('archiveRegistration') !== -1) {
                    this.changeRouter()
                }
            }
        }
    }
</script>