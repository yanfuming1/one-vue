<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <project-info></project-info>
                <span class="qqt-container-full-header-operation___left">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addSceneInvestigationPage">添加</el-button>
                </span>
                <span class="qqt-container-full-header___search">
                    <el-input
                        placeholder="请输入内容"
                        prefix-icon="el-icon-search"
                        @keyup.enter.native="searchModelSynopsis('1')"
                        v-model="filterText" size="mini">
                    </el-input>
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="searchModelSynopsis('1')">搜索</el-button>
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
                        @change="searchModelSynopsis('1')" 
                        align="right">
                    </el-date-picker>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="delBatchSceneInvestigationEvent">批量删除</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                       <el-button icon="el-icon-check" class="qqt-container-full-header-top___button" @click="checkAgainstSceneInvestigationPage ('1')">审核</el-button>
                       <el-button icon="el-icon-close" class="qqt-container-full-header-top___button" @click="checkAgainstSceneInvestigationPage ('0')">反审核</el-button>
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
            <qqt-table :data="tableData" ref="table" :exportData="tableData.records" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange" />
        </div>
    </d2-container>
</template>

<script>
    import { qqtTable } from '@/components/qqt-subassembly'
    import { mapState } from 'vuex'

    import { getSceneInvestigationPageSearch, delByIDSceneInvestigation, examineSceneInvestigation } from '@/api/selfProject/ourBidding/siteInvestigationRegistration'
    import projectInfo from '../../../components/commenInfo/projectInfo'

    import util from '@/libs/util.js'
    export default {
        data () {
            return {
                proCode: '',
                filterText: '',
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
                        prop: 'explorationSite',
                        label: '勘察地点',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = true
                                        this.routerLink ('现场勘察登记详情', parms.row.parentId)
                                    }
                                }
                            }, parms.row.explorationSite)
                        }
                    },
                    {
                        prop: 'explorationContent',
                        label: '勘察内容',
                        isShow: true
                    },
                    {
                        prop: 'explorationDate',
                        label: '勘察时间',
                        isShow: true
                    },
                    {
                        prop: 'explorationPersonnel',
                        label: '勘察人',
                        isShow: true
                    },
                    {
                        prop: 'explorationDepartment',
                        label: '勘察部门',
                        isShow: true,
                    },
                    {
                        prop: 'explorationDuty',
                        label: '岗位/职务',
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
                                    props:{
                                        type: 'text',
                                    },
                                    attrs: {
                                        disabled: parms.row.procState === '1' ? false : true
                                    },
                                    style:{
                                        color: parms.row.procState === '1'? '#409EFF' : '#999',
                                    },
                                    on:{
                                        click: () => {
                                            this.transform.isShowDetails = false
                                            this.routerLink ('现场勘察信息编辑', parms.row.parentId)
                                        }
                                    }
                                }, '编辑'),
                                h('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    attrs: {
                                        disabled: parms.row.procState === '1' ? false : true
                                    },
                                    style:{
                                        color: parms.row.procState === '1'? '#409EFF' : '#999',
                                    },
                                   on:{
                                        click: () => {
                                            this.deleteSceneInvestigationEvent (parms.row.parentId)
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

            searchModelSynopsis (type) {
                if(type === '1') {
                    this.page.current = '1'
                    this.page.size = '10'
                }
                this.getSceneInvestigationPageList ({
                    'keywords': this.filterText ? this.filterText : null,
                    'afterDate': this.createDate ? this.createDate[0] : null,
                    'beforeDate': this.createDate ? this.createDate[1] : null})
            },

            handlePaginationChange (page) {
                this.page = page;
                this.$nextTick(() => {
                    this.searchModelSynopsis ()
                });
            },
 
            getSceneInvestigationPageList (text) {
                getSceneInvestigationPageSearch ({
                    ...text,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size,
                    'projectCode': this.proCode
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

            deleteSceneInvestigationEvent (id) {
                this.deleteSceneInvestigationById ({'ids': id})
            },

            delBatchSceneInvestigationEvent () {
                if (this.tableSelectData.length === 0) {
                    this.$message.warning ('请选择一条数据')
                    return
                }
                let canDel = true
                this.tableSelectData.forEach(item => {
                    if(item.procState !== '1') {
                        this.$message.warning("选择内容含有已经提交的内容，不可以删除!!!")
                        canDel = false
                    }
                })
                if(!canDel) { return } 
                let ids = ''
                if (this.tableSelectData && this.tableSelectData.length > 0) {
                    this.tableSelectData.forEach(res => {
                        ids += res.parentId + ','
                    })
                }
                this.deleteSceneInvestigationById ({'ids': ids.substring(0, ids.length - 1)})
            }, 

            deleteSceneInvestigationById (id) {
                util.confirm ().then (boolean => {
                    if (boolean) {
                        delByIDSceneInvestigation (id).then(res => {
                            if (res.code === 200) {
                                this.$message.success(res.message)
                                this.getSceneInvestigationPageList ()
                            }
                        })
                    }
                })
            },

            checkAgainstSceneInvestigationPage (type) {
                if (this.tableSelectData.length !== 1) {
                    this.$message.warning ('请选择一条数据')
                    return
                }
                switch (type) {
                    case '1':
                        if (this.tableSelectData[0]['auditState'] === '0') {
                            this.checkAgainstSceneInvestigationEvent (this.tableSelectData[0], type)
                        } else {
                            this.$message.warning ('数据已审核')
                        }
                        break;
                    case '0':
                        if (this.tableSelectData[0]['auditState'] === '1') {
                            this.checkAgainstSceneInvestigationEvent (this.tableSelectData[0], type)
                        } else {
                            this.$message.warning ('数据未审核')
                        }
                        break;
                }
            },
            checkAgainstSceneInvestigationEvent (data, type) {
                examineSceneInvestigation ({'id': data.parentId, 'type': type}).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.getSceneInvestigationPageList ()
                    }
                })
            },

            addSceneInvestigationPage () {
                this.transform.isShowDetails = false
                this.routerLink ('新建勘察登记')
            },

            resetModelSynopsis () {
                this.filterText = ''
                this.createDate = []
                this.getSceneInvestigationPageList ()
            },

            exportExcel () {
                this.$refs.table.getExportExcel ()
            },

            printTable () {
                this.$refs.table.printTable (this.tableSelectData)
            },

            routerLink (title, id = '') {
                this.$router.push ({
                    path: 'addSceneInvestigation',
                    name: 'addSceneInvestigation',
                    params: {
                        relevancyId: id,
                        transform: this.transform,
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
            this.proId = db.get('selfProID').value()
            this.proCode = db.get('selfProCode').value()
            this.getSceneInvestigationPageList ()
        }
    }

</script>
