<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <project-info></project-info>
                <span class="qqt-container-full-header-operation___left">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addPrequalificationDocumentsPage">添加</el-button>
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
                <span class="qqt-container-full-header-operation___right">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deletePrequalificationDocumentsPageList">批量删除</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                       <el-button icon="el-icon-check" class="qqt-container-full-header-top___button" @click="examinePrequalificationDocuments('1')">审核</el-button>
                       <el-button icon="el-icon-close" class="qqt-container-full-header-top___button" @click="examinePrequalificationDocuments('0')">反审核</el-button>
                    </el-button-group>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                        <el-button size="mini" @click="exportExcel" icon="el-icon-upload2">导出</el-button>
                        <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                    </el-button-group>
                </span>
                <!-- <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                        <el-button size="mini" @click="printing" icon="el-icon-printer">打印</el-button>
                    </el-button-group>
                </span> -->
            </div>
        </template>
        <div class="qqt-container-full___center">
            <qqt-table :data="tableData" ref="table" :exportData="exportData" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange" />
        </div>
    </d2-container>
</template>

<script>
    import { qqtTable } from '@/components/qqt-subassembly'
    import { mapState } from 'vuex'
    import { prequalificationDocumentsPage, prequalificationDocumentsDelete, prequalificationDocCheck } from '@/api/selfProject/ourBidding/prequalificationDocuments/index'
    import { bidFileDocPage, bidFileDocDeleteBatch, bidFileDocCheck} from '@/api/selfProject/ourBidding/bidFileDoc/index'
    import util from '@/libs/util.js'
    import projectInfo from '../../../components/commenInfo/projectInfo'
    export default {
        data () {
            return {
                filterText: '',
                identification: '',
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
                exportData: [],
                proCode: '',
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
                        prop: 'fileType',
                        label: '文件类型',
                        isShow: true,
                        render: (h, parms) => {
                            let text = ''
                            switch(parms.row.fileType) {
                                case '1':
                                    text = '商务标文件'
                                    break
                                case '2':
                                    text = '技术标文件'
                                    break
                                case '3':
                                    text = '预算文件'
                                    break
                                case '4':
                                    text = '其他文件'
                                    break
                            }
                            return h('el-button', { 
                                props:{ type: 'text', },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = true
                                        let title = this.identification === '1' ? '投标文件编制审核详情' : '新建资格预审文件审核详情'
                                        this.routerLink (title, parms.row.parentId)
                                    }
                                }
                            }, text)
                        }
                    },
                    {
                        prop: 'fileNumber',
                        label: '文件数量',
                        isShow: true,
                        // render: (h, parms) => {
                        //     return h('div', {
                        //         class: { 'typefaceColor': true, },
                        //         on:{
                        //             click: () => {
                        //                 this.transform.isShowDetails = true
                        //                 this.routerLink ('资格预审文件审核详情', parms.row.parentId)
                        //             }
                        //         }
                        //     }, parms.row.fileNumber)
                        // }
                    },
                    {
                        prop: 'procState',
                        label: '办理状态',
                        isShow: true,
                        render: (h, parms) => {
                            return h('span', { }, util.handleState(parms.row.procState))
                        }
                    },{
                        prop: 'agent',
                        label: '待办人',
                        isShow: true,
                        render: (h, parms) => {
                            return h('span', {}, parms.row.agent ? parms.row.agent : '无' )
                        }
                    },
                    {
                        prop: 'auditState',
                        label: '审核状态',
                        isShow: true,
                        render: (h, parms) => {
                            return h('span', {
                                style: { color: parms.row.auditState === '1' ? '#67C23A' : '#F56C6C' }
                            }, parms.row.auditState === '1' ? '已审核' : '未审核')
                        }
                    },
                    {
                        prop: 'createName',
                        label: '申请人',
                        isShow: true
                    },
                    {
                        prop: 'departmentName',
                        label: '工作部门',
                        isShow: true,
                    },
                    {
                        prop: 'createTime',
                        label: '申请时间',
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
                                h('el-button', {
                                    props:{ type: 'text', },
                                    attrs:{ disabled: parms.row.procState === '1' ? false : true },
                                    on:{
                                        click: () => {
                                            this.transform.isShowDetails = false
                                            let title = this.identification === '1' ? '投标文件编制审核编辑' : '资格预审文件审核编辑'
                                            this.routerLink (title, parms.row.parentId)
                                        }
                                    }
                                }, '编辑'),
                                h('el-button', {
                                    props:{ type: 'text', },
                                    attrs:{ disabled: parms.row.procState === '1' ? false : true },
                                    on:{
                                        click: () => {
                                            this.deletePrequalificationDocumentsPageObject (parms.row.parentId)
                                        }
                                    }
                                }, '删除')
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
                this.getPrequalificationDocumentsPageList ({
                    'keywords': this.filterText ? this.filterText : null,
                    'afterDate': this.createDate ? this.createDate[0] : null,
                    'beforeDate': this.createDate ? this.createDate[1] : null,})
            },

            handlePaginationChange (page) {
                this.page = page;
                this.$nextTick(() => {
                    this.searchModelSynopsis ()
                });
            },

            getPrequalificationDocumentsPageList (text) {
                let url = this.identification === '1' ? bidFileDocPage : prequalificationDocumentsPage
                url ({
                    ...text,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size,
                    projectCode: this.proCode
                }).then( res => {
                    if (res.records) {
                        res.records.forEach(item => {
                            item.parentId = item.id
                            delete item.id
                        })
                    }
                    if (res) this.tableData = res
                })
            },

            deletePrequalificationDocumentsPageObject (id) {
                this.deletePrequalificationDocumentsPageById ({'ids': id})
            },

            deletePrequalificationDocumentsPageList () {
                if (this.tableSelectData.length === 0) {
                    this.$message.warning ('请选择一条数据')
                    return
                }
                let canDel = true
                let ids = ''
                this.tableSelectData.forEach(res => {
                    ids += res.parentId + ','
                    if (res.procState !== '1') { canDel = false }
                })
                if(canDel) {
                    this.deletePrequalificationDocumentsPageById ({'ids': ids.substring(0, ids.length - 1)})
                } else {
                    this.$message.warning ('选择的内容已经提交或者审批完结的，不可删除!!!')
                    return
                }  
            },

            deletePrequalificationDocumentsPageById (id) {
                util.confirm ().then (boolean => {
                    if (boolean) {
                        let url = this.identification === '1' ? bidFileDocDeleteBatch : prequalificationDocumentsDelete
                        url (id).then(res => {
                            if (res.code === 200) {
                                this.$message.success(res.message)
                                this.getPrequalificationDocumentsPageList ()
                            }
                        })
                    }
                })
            },

            examinePrequalificationDocuments (type) {
                if (this.tableSelectData.length === 0 || this.tableSelectData.length > 1) { 
                    this.$message.warning(this.tableSelectData.length === 0 ? "请选择审核内容" : '只能进行单个内容审核')
                    return false
                }
                let url = this.identification === '1' ? bidFileDocCheck : prequalificationDocCheck
                url({
                    id: this.tableSelectData[0].parentId,
                    type: type
                }).then(res => {
                    this.$message.success(type === '1' ? '审核成功!!' : '反审核成功!!')
                    this.getPrequalificationDocumentsPageList()
                })
            },

            reverseAuditPrequalificationDocuments () {

            },

            addPrequalificationDocumentsPage () {
                this.transform.isShowDetails = false
                let title = this.identification === '1' ? '新建投标文件编制审核' : '新建资格预审文件审核'
                this.routerLink (title, '')
            },

            resetModelSynopsis () {
                this.filterText = ''
                this.createDate = []
                this.getPrequalificationDocumentsPageList ()
            },

            exportExcel () {
                this.getExportData().then(res => {
                    this.$refs.table.getExportExcel ()
                })
            },

            printTable () {
                this.$refs.table.printTable (this.tableSelectData)
            },

            getExportData () {
                this.exportData = JSON.parse(JSON.stringify((this.tableData.records))) || [];
                return new Promise((resolve, reject) => {
                    this.exportData.forEach((item,index) => {
                        item.procState = util.handleState(item.procState)
                        item.auditState = item.auditState === '1' ? '已审核' : '未审核'
                        item.agent = item.agent || '无'
                        switch(item.fileType) {
                            case '1':
                                item.fileType = '商务标文件'
                                break
                            case '2':
                                item.fileType = '技术标文件'
                                break
                            case '3':
                                item.fileType = '预算文件'
                                break
                            case '4':
                                item.fileType = '其他文件'
                                break
                        }
                    });
                    resolve (true)
                });
            },

            routerLink (title, id = '') {
                this.$router.push ({
                    path: 'addPrequalificationDocuments',
                    name: 'addPrequalificationDocuments',
                    params: {
                        relevancyId: id,
                        transform: this.transform,
                        identification: this.identification
                    }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            },
        },

        components: {
            'qqt-table': qqtTable,
            'project-info': projectInfo
        },

        async created () {
            const db = await this.$store.dispatch('d2admin/db/database', {user: true})
            this.proCode = db.get('selfProCode').value()
            this.identification = this.$route.params.identification
            this.getPrequalificationDocumentsPageList ()
        },

        watch : {
            $route (val) {
                if (val.path.indexOf('prequalificationDocuments') !== -1) {
                    this.identification = val.params.identification
                    this.getPrequalificationDocumentsPageList()
                }
            }
        }
    }

</script>
