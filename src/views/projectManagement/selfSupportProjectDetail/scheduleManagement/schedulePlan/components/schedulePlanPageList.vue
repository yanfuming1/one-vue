<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <project-info></project-info>
                <span class="qqt-container-full-header-operation___left">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addBudgetInfo">新增</el-button>
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deleteBudgetInfoList">批量删除</el-button>
                    <!-- <el-button type="success" class="qqt-container-full-header-top___button" @click="">查看进度</el-button> -->
                    <!-- <el-button type="warning" class="qqt-container-full-header-top___button" @click="">提交审批</el-button> -->
                </span>
            </div>
        </template>
        <div class="qqt-container-full___center">
            <qqt-table :data="tableData" ref="table" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange" />
        </div>
        <plan-add :dialogVisible='addShow' :title='addTitle' :editInfo='editInfo' :projectCode='projectCode' :planInfo='planInfo' :isShowDetails="isShowDetails" @close="closeAdd"></plan-add>
        <el-drawer class="record-drawer" title="添加进度记录" :visible.sync="showDrawer" direction="rtl" size="50%" :before-close="handleClose">
            <process-record-list :tableData="recordList" @editRecord="editRecord" @showRecord="showRecord"></process-record-list>
        </el-drawer>
    </d2-container>
</template>

<script>
import { selfSchedulePlanPageList, selfSchedulePlanDel, selfSchedulePlanQueryById, schedulePlanActualList } from '@/api/selfProject/scheduleManagement/schedulePlan/index';
import { qqtTable } from '@/components/qqt-subassembly';
import { mapState } from 'vuex';
import planAdd from './components/planAdd';
import processRecordList from './components/processRecordList'
import projectInfo from '../../../components/commenInfo/projectInfo';
import util from '@/libs/util.js';
export default {
    data () {
        return {
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
            editInfo: false,
            page: {
                current: 1,
                size: 10,
                total: 0
            },
            tableData: {},
            recordList: {},
            rowHeader: [
                {
                    prop: 'planName',
                    label: '计划名称',
                    isShow: true,
                    render: (h, parms) => {
                        return h('div', {
                            class: {
                                'typefaceColor': true,
                            },
                            on:{
                                click: () => {
                                    this.transform.isShowDetails = true
                                    this.routerLink ('进度计划详情', parms.row.id)
                                }
                            }
                        }, parms.row.planName)
                    }
                },
                {
                    prop: 'version',
                    label: '版本号',
                    width: "140",
                    isShow: true
                },
                {
                    prop: 'createName',
                    label: '计划编制人',
                    width: '100',
                    isShow: true,
                },
                {
                    prop: 'createTime',
                    label: '计划编制日期',
                    isShow: true,
                    width: '180',
                },
                {
                    prop: '',
                    label: '操作',
                    width: 270,
                    isShow: true,
                    render: (h, parms) => {
                        return [
                            h('el-button', {
                                props:{ type: 'text', },
                                on:{
                                    click: () => {
                                        selfSchedulePlanQueryById({id: parms.row.id}).then(res => {
                                            this.planInfo = res
                                            this.addShow = true
                                            this.editInfo = true
                                            this.isShowDetails = true
                                            this.addTitle = '计划详情'
                                        })
                                    }
                                }
                            }, '查看'),
                            h('el-button', {
                                props:{ type: 'text', },
                                attrs:{ disabled: parms.row.procState === '1' ? false : true },
                                on:{
                                    click: () => {
                                        selfSchedulePlanQueryById({id: parms.row.id}).then(res => {
                                            this.planInfo = res
                                            this.addShow = true
                                            this.editInfo = true
                                            this.isShowDetails = false
                                            this.addTitle = '编辑'
                                        })
                                    }
                                }
                            }, '编辑'),
                            h('el-button', {
                                props:{ type: 'text', },
                                on:{
                                    click: () => {
                                        schedulePlanActualList({'overallId': parms.row.id }).then(res => {
                                            if(res.length === 0) {
                                                this.$message.warning('该进度计划没有记录!!!')
                                                return
                                            }
                                            this.recordList.records = res
                                            this.showDrawer = true
                                        })
                                    }
                                }
                            }, '进度记录'),
                            h('el-button', {
                                props:{ type: 'text', },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = false
                                        this.routerLinkRecord ('添加进度记录', 'add', parms.row.id)
                                    }
                                }
                            }, '新增记录')
                        ]
                    }
                }
            ],
            proCode: '',
            addShow: false,
            addTitle: '新增',
            isShowDetails: false,
            planInfo: {},
            projectCode: '',
            showDrawer: false,
        }
    },

    methods: {
        
        handleClose () {
            this.showDrawer = false
        },

        selectChange (item) {
            this.tableSelectData = item
        },

        searchModelSynopsis () {
            this.getBudgetInfoPage ({
                'name': this.filterText ? this.filterText : null,
                'createTime': this.createDate ? this.createDate[0] : null,
                'updateTime': this.createDate ? this.createDate[1] : null})
        },

        handlePaginationChange (page) {
            this.page = page;
            this.$nextTick(() => {
                this.searchModelSynopsis ()
            });
        },

        getBudgetInfoPage (text) {
            this.projectCode = this.selfSupportProject.projectCode
            selfSchedulePlanPageList ({
                ...text,
                'pageNo': this.page.current,
                'pageSize': this.page.size,
                'projectCode': this.selfSupportProject.projectCode,
            }).then( res => {
                if (res) this.tableData = res
            })
        },

        deleteBudgetInfoList () {
            if (this.tableSelectData.length === 0) {
                this.$message.warning ('请选择一条数据')
                return
            }
            let ids = ''
            let canDel = true
            if (this.tableSelectData && this.tableSelectData.length > 0) {
                this.tableSelectData.forEach(res => {
                    ids += res.id + ','
                    if(res.procState !== '1') { canDel = false }
                })
            }
            if(canDel) {
                this.deleteBudgetInfoById ({'ids': ids.substring(0, ids.length - 1)})
            } else {
                this.$message.warning("选择内容有正在审批或者已完结的内容，不能删除!!!")
            }
        },

        deleteBudgetInfoById (id) {
            util.confirm ().then (boolean => {
                if (boolean) {
                    selfSchedulePlanDel (id).then(res => {
                        if (res.code === 200) {
                            this.$message.success(res.message)
                            this.getBudgetInfoPage ()
                        }
                    })
                }
            })
        },

        addBudgetInfo () {
            this.planInfo = {}
            this.addShow = true
            this.editInfo = false
            this.isShowDetails = false
        },

        closeAdd () {
            this.addShow = false
            this.getBudgetInfoPage ()
        },

        resetModelSynopsis () {
            this.filterText = ''
            this.createDate = []
            this.getBudgetInfoPage ()
        },

        exportExcel () {
            this.$refs.table.getExportExcel ()
        },

        editRecord (id) {
            this.transform.isShowDetails = false
            this.routerLinkRecord('编辑进度记录', 'edit', id )
        },

        showRecord (id) {
            this.transform.isShowDetails = true
            this.routerLinkRecord('编辑进度记录', 'edit', id )
        },

        routerLink (title, id = '') {
            this.$router.push ({
                path: 'schedulePlanPageAdd',
                name: 'schedulePlanPageAdd',
                params: {
                    relevancyId: id,
                    transform: this.transform,
                    changeAdd: true,
                }
            })
            this.$store.commit ('d2admin/page/titleSet', title)
        },

        routerLinkRecord (title, type, id='') {
            this.$router.push ({
                path: 'addProcessRecord',
                name: 'addProcessRecord',
                params: {
                    relevancyId: type === 'add' ? null : id,
                    overallId: type === 'add' ? id : null,
                    transform: this.transform,
                    changeAdd: true,
                    projectCode: this.selfSupportProject.projectCode,
                }
            })
            this.$store.commit ('d2admin/page/titleSet', title)
        }
    },

    components: {
        'qqt-table': qqtTable,
        'project-info': projectInfo,
        'plan-add': planAdd,
        'process-record-list': processRecordList,
    },

    computed: {
        ...mapState ('d2admin/selfSupportProject', [
            'selfSupportProject'
        ])
    },

    async created () {
        this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad')
    },

    watch: {
        selfSupportProject () {
            this.getBudgetInfoPage ()
        }
    }
}
</script>
<style lang="scss">
.record-drawer{
    .el-drawer__body{
        height: 100%;
        overflow-y: scroll;
    }
}
</style>
