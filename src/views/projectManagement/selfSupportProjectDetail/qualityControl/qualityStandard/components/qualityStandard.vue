<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <project-info></project-info>
                <span class="qqt-container-full-header-operation___left">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addQualityStandard">添加规范</el-button>
                </span>
                <span class="qqt-container-full-header-operation___left">
                    <el-button type="warning" class="qqt-container-full-header-top___button" @click="addQualityTypeTree (true)">添加类别</el-button>
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
                    <el-button-group>
                        <el-button size="mini" @click="exportExcel" icon="el-icon-upload2">导出</el-button>
                        <el-button size="mini" @click="printTable" icon="el-icon-printer">打印</el-button>
                    </el-button-group>
                </span>
            </div>
        </template>
        <div class="qqt-container-full-center___left">
            <qqt-tree
                ref="tree"
                :data="qualityType"
                :title="title"
                :isShowAdd="true"
                :isBtnTitle="false"
                :defaultProps="defaultProps"
                @delete="deleteQualityTypeTree"
                @append="addQualityTypeTree"
                @edit="editQualityTypeTree"
                @historicalData="historicalDataObject"></qqt-tree>
        </div>
        <div class="qqt-container-full-center___right">
            <qqt-table :data="tableData" ref="table" :exportData="tableData.records" :rowHeader="rowHeader" @selectionChange="selectChange" @page="handlePaginationChange" />
        </div>
        <quality-type-dialog v-if="dialogVisible" :dialogVisible="dialogVisible" :projectCode="selfSupportProject.projectCode" :treeId="historicalData.id" :isAdd="isAdd" @close="updataQualityType"></quality-type-dialog>
    </d2-container>
</template>

<script>
    import { getQualityStandardPageList, deleteQualityStandard, deleteQualityType, getQualityTypePageList} from '@/api/selfProject/qualityManagement/qualityStandard'
    import { qqtTable, qqtTree } from '@/components/qqt-subassembly'
    import { mapState } from 'vuex'

    import qualityTypeDialog from './qualityTypeDialog'
    import projectInfo from '../../../components/commenInfo/projectInfo'
    import util from '@/libs/util.js'
    export default {
        data () {
            return {
                filterText: '',
                title: '质量类型',
                options: [],
                qualityType: [],
                tableSelectData: [],
                defaultProps: {
                    children: 'children',
                    label: 'categoryName',
                    value: 'id'
                },
                transform: {
                    isShowDetails: false
                },
                page: {
                    current: 1,
                    size: 10,
                    total: 0
                },
                tableData: {},
                historicalData: {
                    id: ''
                },
                rowHeader: [
                    {
                        prop: 'standardName',
                        label: '质量规范名称',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = true
                                        this.routerLink ('质量规范详情', parms.row.id, parms.row.procInstId)
                                    }
                                }
                            }, parms.row.standardName)
                        }
                    },
                    {
                        prop: 'releaseDate',
                        label: '发布时间',
                        isShow: true
                    },
                    {
                        prop: 'releaseCompany',
                        label: '发布单位',
                        isShow: true
                    },
                    {
                        prop: 'remark',
                        label: '备注',
                        isShow: true
                    },
                    {
                        prop: '',
                        label: '操作',
                        isShow: true,
                        render: (h, parms) => {
                            return [
                                h('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    attrs: {
                                        disabled: util.isDisabled (parms.row.procState)
                                    },
                                    on:{
                                        click: () => {
                                            this.transform.isShowDetails = false
                                            this.routerLink ('质量规范编辑', parms.row.id)
                                        }
                                    }
                                }, '编辑'),
                                h('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    attrs: {
                                        disabled: util.isDisabled (parms.row.procState)
                                    },
                                    on:{
                                        click: () => {
                                            this.deleteQualityStandardObject (parms.row.id)
                                        }
                                    }
                                }, '删除')
                            ]
                        }
                    }
                ],
                dialogVisible: false,
                isAdd: true
            }
        },

        methods: {

            selectChange (item) {
                this.tableSelectData = item
            },

            searchModelSynopsis (boolean = true) {
                if (boolean) this.resetPage ()
                this.getQualityStandardPage (this.historicalData.id, {
                    'keywords': this.filterText ? this.filterText : null,
                    'afterDate': this.createDate ? this.createDate[0] : null,
                    'beforeDate': this.createDate ? this.createDate[1] : null})
            },

            handlePaginationChange (page) {
                this.page = page;
                this.$nextTick(() => {
                    this.searchModelSynopsis (false)
                });
            },

            getQualityTypePageListTree () {
                getQualityTypePageList ({'projectCode': this.selfSupportProject.projectCode}).then (res => {
                    if (res) {
                        this.qualityType = res
                        this.getQualityStandardPage (res[0].id)
                    }
                })
            },

            getQualityStandardPage (id, text) {
                getQualityStandardPageList ({
                    ...text,
                    'categoryId': id,
                    'projectCode': this.selfSupportProject.projectCode,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size
                }).then( res => {
                    if (res) this.tableData = res
                })
            },

            deleteQualityStandardObject (id) {
                this.deleteQualityStandardById ({'id': id, 'projectCode': this.selfSupportProject.projectCode})
            },

            deleteQualityStandardById (id) {
                util.confirm ().then (boolean => {
                    if (boolean) {
                        deleteQualityStandard (id).then(res => {
                            if (res.code === 200) {
                                this.$message.success(res.message)
                                this.getQualityStandardPage (this.historicalData.id)
                            }
                        })
                    }
                })
            },

            editQualityTypeTree (data) {
                this.historicalData = data
                this.isAdd = false
                this.dialogVisible = true
            },

            historicalDataObject (data) {
                this.historicalData = data
                this.getQualityStandardPage (data.id)
            },

            addQualityTypeTree (boolean = false) {
                if (boolean) this.historicalData.id = ''
                this.dialogVisible = this.isAdd = true
            },

            deleteQualityTypeTree (data) {
                deleteQualityType({'id': data.id}).then(result => {
                    if (result.code === 200) {
                        this.$message.success('删除成功')
                        this.getQualityTypePageListTree ()
                    }
                })
            },

            addQualityStandard () {
                if (this.historicalData.id == '') {
                    this.$message.warning ('请选择规范类别')
                    return
                }
                this.transform.isShowDetails = false
                this.routerLink ('添加质量规范')
            },

            resetModelSynopsis () {
                this.filterText = ''
                this.createDate = []
                this.getQualityStandardPage ()
            },

            resetPage () {
                this.page = {
                    current: 1,
                    size: 10,
                    total: 0
                }
            },

            updataQualityType (boolean = false) {
                this.dialogVisible = false
                if (boolean) this.getQualityTypePageListTree ()
            },

            exportExcel () {
                this.$refs.table.getExportExcel ()
            },

            printTable () {
                this.$refs.table.printTable (this.tableSelectData)
            },

            routerLink (title, id = '', procInstId = '') {
                this.$router.push ({
                    path: 'addQualityStandard',
                    name: 'addQualityStandard',
                    params: {
                        relevancyId: id,
                        procInstId: procInstId,
                        transform: this.transform,
                        parentId: this.historicalData.id
                    }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            },
        },

        components: {
            'quality-type-dialog': qualityTypeDialog,
            'project-info': projectInfo,
            'qqt-table': qqtTable,
            'qqt-tree': qqtTree
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
                this.getQualityTypePageListTree ()
            }
        },
    }

</script>
