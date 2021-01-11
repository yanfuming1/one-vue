<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <project-info></project-info>
                <span class="qqt-container-full-header-operation___left">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addQualityObjectives('0')">新建任务</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button type="success" class="qqt-container-full-header-top___button" v-if="showFromSegregationBtn" @click="fromProjectSegregationList">从项目划分导入</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
				    <el-button type="warning" class="qqt-container-full-header-top___button" @click="submitQualityObjectives">打包提交</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
				    <el-button type="primary" class="qqt-container-full-header-top___button" size="mini" @click="upOrDownGrade('showSubInfo')">审批信息</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
				    <el-button type="primary" class="qqt-container-full-header-top___button" size="mini" @click="upOrDownGrade('showSubMap')">流程图</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                        <el-button size="mini" @click="exportExcel" icon="el-icon-upload2">导出</el-button>
                        <el-button size="mini" @click="printTable" icon="el-icon-printer">打印</el-button>
                    </el-button-group>
                </span>
            </div>
        </template>
        <div class="qqt-container-full___center">
            <qqt-table :data="tableData" ref="table" :exportData="tableData.records" :rowHeader="rowHeader" @selectionChange="selectChange" :pageShow="false" :isShowIndex="false"  />
        </div>
        <plan-sub-map :procInstId="procInstId" :dialogVisible="showMap" @cancel="showMap = false"></plan-sub-map>
		<show-sub-info :procInstId="procInstId" :dialogVisible="showInfo" @cancel="showInfo = false"></show-sub-info>
        <quality-objectives-dialog v-if="dialogVisible" :dialogVisible="dialogVisible" :taskData="taskData" @close="updataQualityObjectives"></quality-objectives-dialog>
    </d2-container> 
</template>

<script>
    import { getQualityObjectivesPageList, deleteBatchQualityObjectives, fromProjectSegregation } from '@/api/selfProject/qualityManagement/qualityObjectives'
    import { qqtTable } from '@/components/qqt-subassembly'
    import { mapState } from 'vuex'

    import planSubMap from '../../../scheduleManagement/schedulePlan/components/components/planSubMap';
    import showSubInfo from '../../../scheduleManagement/schedulePlan/components/components/showSubInfo';
    import projectInfo from '../../../components/commenInfo/projectInfo'
    import qualityObjectivesDialog from './qualityObjectivesDialog'
    import util from '@/libs/util.js'
    export default {
        data () {
            return {
                colors: [ '#8d43ad', '#42a1ff', '#2898b0', '#37373D', '#73C991', '#6B96AD' ],
                filterText: '',
                procInstId: '',
                showMap: false,
                showInfo: false,
                taskData: {},
                options: [],
                createDate: [],
                tableSelectData: [],
                transform: {
                    isShowDetails: false
                },
                tableData: {
                    records: []
                },
                parentDetail: {},
                rowHeader: [
                    {
                        prop: 'number',
                        label: '序号',
                        isShow: true,
                        width: 200,
                        render: (h, parms) => {
                            return h ('div', {
                                style: {
                                    'padding-left': `${(parms.row.rankNumber-1) * 15}px`
                                },
                            }, [
                                    h ('span', {
                                        style: {
                                            'color': this.colors[parms.row.rankNumber-1]
                                        }
                                    }, parms.row.number)
                                ]
                            )
                        }
                    },
                    {
                        prop: 'name',
                        label: '任务名称',
                        isShow: true,
                        width: 300,
                        render: (h, parms) => {
                            return h ('div', {
                                style: {
                                    position: 'relative',
                                    display: 'flex',
                                    'padding-left': `${(parms.row.rankNumber-1) * 20}px`
                                }
                            }, [    
                                    h ('span', {
                                        style: {
                                            'color': this.colors[parms.row.rankNumber-1]
                                        }
                                    }, parms.row.name),
                                    h ('span', {
                                        class: {
                                            'operation-btn': true
                                        }
                                    },  
                                        [
                                            h ('el-button', {
                                                attrs: {
                                                    icon: "el-icon-plus",
                                                    type: "primary",
                                                    size: "mini"
                                                },
                                                style: {
                                                    padding: '3px'
                                                },
                                                props: {
                                                    plain: true
                                                },
                                                on:{
                                                    click: () => {
                                                        this.addQualityObjectives (parms.row.id)
                                                    }
                                                }
                                            }),
                                            h ('el-button', {
                                                attrs: {
                                                    icon: "el-icon-edit",
                                                    type: "warning",
                                                    size: "mini"
                                                },
                                                style: {
                                                    padding: '3px'
                                                },
                                                props: {
                                                    plain: true
                                                },
                                                on:{
                                                    click: () => {
                                                        this.editQualityObjectives (parms.row.id)
                                                    }
                                                }
                                            }),
                                            h ('el-button', {
                                                attrs: {
                                                    icon: "el-icon-delete",
                                                    type: "danger",
                                                    size: "mini"
                                                },
                                                style: {
                                                    padding: '3px'
                                                },
                                                props: {
                                                    plain: true
                                                },
                                                on:{
                                                    click: () => {
                                                        this.deleteQualityObjectives (parms.row)
                                                    }
                                                }
                                            })
                                        ]
                                    )
                                ]
                            )
                        }
                    },
                    {
                        prop: 'codeRequirement',
                        label: '规范要求',
                        isShow: true
                    },
                    {
                        prop: 'qualityTarget',
                        label: '质量目标',
                        isShow: true
                    },
                    {
                        prop: 'controlPointName',
                        label: '控制点名称',
                        isShow: true
                    },
                    {
                        prop: 'planLimit',
                        label: '计划工期',
                        isShow: true,
                    },
                    {
                        prop: 'controlMeasures',
                        label: '控制措施',
                        isShow: true,
                    },
                    {
                        prop: 'qualityPrincipal',
                        label: '质量负责人',
                        isShow: true,
                    },
                    {
                        prop: 'procStateName',
                        label: '办理状态',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {},
                                parms.row.procStateName = util.handleState (parms.row.schedulePlanFlow.procState)
                            )
                        }
                    },
                    {
                        prop: 'agent',
                        label: '待办人',
                        isShow: true,
                    },
                    {
                        prop: 'createName',
                        label: '编制人',
                        isShow: true,
                    },
                    {
                        prop: 'createTime',
                        label: '上报时间',
                        isShow: true,
                    },
                    {
                        prop: 'remark',
                        label: '备注',
                        isShow: true,
                    }
                ],
                showFromSegregationBtn: true,
                dialogVisible: false
            }
        },

        methods: {

            selectChange (item) {
                this.tableSelectData = item
            },

            getQualityObjectivesPage () {
                getQualityObjectivesPageList ({'projectCode': this.selfSupportProject.projectCode}).then( res => {
                    if (res) this.tableData.records = res
                })
            },

            deleteQualityObjectives (item) {
                if(item.schedulePlanFlow.procState !== '1') {
                    this.$message.warning('已经提交流程的不可删除!!!')
                    return
                }
                let hasChild = false
                this.tableData.records.forEach(temData => {
                    if(temData.parentId === item.id) { hasChild = true }
                })
                if(hasChild){
                    this.$message.warning('含有子任务的不可删除!!!')
                    return
                }
                this.deleteQualityObjectivesById ({'id': item.id, 'projectCode': this.selfSupportProject.projectCode})
            },

            deleteQualityObjectivesById (data) {
                util.confirm ().then (boolean => {
                    if (boolean) {
                        deleteBatchQualityObjectives (data).then(res => {
                            if (res.code === 200) {
                                this.$message.success(res.message)
                                this.getQualityObjectivesPage ()
                            }
                        })
                    }
                })
            },

            submitQualityObjectives () {
                if(this.tableSelectData.length == 0) {
                    this.$message.warning('至少选择一个任务进行操作!!!')
                    return
                }
                let ids = ''
                this.tableSelectData.forEach (res => {
                    ids += res.id + ','
                })
                this.routerLink (ids.substring (0, ids.length - 1))
            },

            editQualityObjectives (id) {
                this.taskData = { id: id, projectCode: this.selfSupportProject.projectCode }
                this.dialogVisible = true
            },

            fromProjectSegregationList () {
                if(this.tableData.records.length > 0) {
                    this.$message.warning("已经含有其他任务,不能从项目划分导入!!!")
                    return
                }
                fromProjectSegregation ({'projectCode': this.selfSupportProject.projectCode}).then (res => {
                    if (res) this.getQualityObjectivesPage ()
                })
            },

            addQualityObjectives (parentId) {
                this.taskData = { parentId: parentId, projectCode: this.selfSupportProject.projectCode }
                this.dialogVisible = true
            },

            upOrDownGrade(type) {
                if(this.tableSelectData.length !== 1) {
                    this.$message.warning('选择一个任务进行操作!!!')
                    return
                }
                if(this.tableSelectData[0].parentId === '0' && type === 'up') {
                    this.$message.warning('选择的任务已经是顶级任务!!!')
                    return
                }
                switch(type) {
                    case 'showSubInfo':
                        this.showSubInfo ()
                        break
                    case 'showSubMap':
                        this.showSubMap ()
                        break
                }
            },

            showSubInfo () {
                if (this.tableSelectData[0].schedulePlanFlow.procState === '1') {
                    this.$message.warning("该任务未提交，没有审批信息!!!")
                    return 
                }
                this.procInstId = this.tableSelectData[0].schedulePlanFlow.procInstId
                this.showInfo = true
            },

            showSubMap () {
                if (this.tableSelectData[0].schedulePlanFlow.procState === '1') {
                    this.$message.warning("该任务未提交，不能查看流程图!!!")
                    return 
                }
                this.procInstId = this.tableSelectData[0].schedulePlanFlow.procInstId
                this.showMap = true
            },

            exportExcel () {
                this.$refs.table.getExportExcel ()
            },

            printTable () {
                this.$refs.table.printTable (this.tableSelectData)
            },

            updataQualityObjectives (boolean = false) {
                this.dialogVisible = false
                if (boolean) this.getQualityObjectivesPage ()
            },

            routerLink (id = '') {
                this.$router.push ({
                    path: 'addQualityObjectives',
                    name: 'addQualityObjectives',
                    params: {
                        relevancyId: id,
                        transform: this.transform
                    }
                })
            },
        },

        components: {
            'quality-objectives-dialog': qualityObjectivesDialog,
		    'show-sub-info': showSubInfo,
            'project-info': projectInfo,
            'plan-sub-map': planSubMap,
            'qqt-table': qqtTable,
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
                this.getQualityObjectivesPage ()
            }
        },
    }

</script>
