<template>
    <d2-container type="fulls" class="addQualityCheckAccept">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
            </div>
            <div class="qqt-container-full-center___top">
                <qqt-flow-tabs :procInstId="procInstId">
                    <template slot="content">
                        <project-information-basic :transform="transform" :values="projectInformation" @projectCode="getProjectCode" />
                        <fm-generate-form :data="jsonData" :remote="remote" :value="values" :transform="transform" ref="generateForm">
                            <template slot="planList">
                                <qqt-table :data="values" ref="table" :rowHeader="rowHeader" :pageShow="false" :isShowIndex="false" />
                            </template>
                        </fm-generate-form>
                    </template>
                </qqt-flow-tabs>
            </div>
            <div class="qqt-container-full-content___button">
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitQualityCheckAcceptData ()">重新提交</el-button>
                <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="primary" v-if="!transform.isShowDetails && procInstId === ''" @click="values['flag'] = '1', submitQualityCheckAcceptData ()">提交</el-button>
                <el-button @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataQualityCheckAccept"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentQualityCheckAccept" />
        <quality-check-accept-dialog v-if="qualityCheckAccept" :dialogVisible="qualityCheckAccept" :taskData="taskData" @close="resetSubmitUpdataQualityCheckAccept"></quality-check-accept-dialog>
    </d2-container>
</template>

<script>
    import { getQualityCheckAcceptById, submitQualityCheckAccept, completeQualityCheckAccept,
                resetSubmitQualityCheckAccept, getQualityCheckAcceptListByIds, getQualityCheckAcceptList } from '@/api/selfProject/qualityManagement/qualityCheckAccept'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, qqtTable } from '@/components/qqt-subassembly'
    import { formGetJson } from '@/api/system/fromManagement/index'
    import { PROPRIETARYPROJECT } from '@/enum/FORMCODE'
    import { getDetails } from '@/api/approval/common'
    import { mapActions } from 'vuex'

    import qualityCheckAcceptDialog from './qualityCheckAcceptDialog'
    import projectInformationBasic from '../../../operatingReserve/components/projectInformationBasic'
    import util from '@/libs/util.js'
    let than = this
    export default {

        data () {
            return {
                colors: [ '#8d43ad', '#42a1ff', '#2898b0', '#37373D', '#73C991', '#6B96AD' ],
                title: '',
                stutas: '',
                flowId: '',
                procInstId: '',
                remote: {},
                values: {
                    records: [],
                },
                taskData: {},
                jsonData: {},
                nodeData: {
                    operation: '',
                    msg: ''
                },
                transform: {
                    isShowDetails: false
                },
                prossValue: {
                    title: ''
                },
                projectInformation: {
                    projectCode: ''
                },
                visible: false,
                isReject: false,
                isSendBack: false,
                isTurnManage: false,
                dialogVisible: false,
                qualityCheckAccept: false,
                processModuleId: PROPRIETARYPROJECT.ADDQUALITYCHECKACCEPT,
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
                                            !this.transform.isShowDetails && this.procInstId !== '' ? h ('el-button', {
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
                                                        this.editQualityCheckAccept (parms.row)
                                                    }
                                                }
                                            }) : ''
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
                        prop: 'acceptStandardNation',
                        label: '验收标准（国家规范）',
                        isShow: true
                    },
                    {
                        prop: 'acceptStandardQuality',
                        label: '验收标准（优质结构）',
                        isShow: true
                    },
                    {
                        prop: 'acceptMethod',
                        label: '验收方法',
                        isShow: true
                    },
                    {
                        prop: 'acceptResult',
                        label: '验收结果',
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
                ]
            }
        },

        methods: {

            ...mapActions('d2admin/page', [
                'close',
            ]),

            getFormByJson () {
                formGetJson ({ 'code': this.processModuleId }).then(res => {
                    if (res) this.jsonData = JSON.parse(res)
                })
            },

            getQualityCheckAccept (id) {
                getQualityCheckAcceptListByIds ({ 'ids': id }).then (res => {
                    if (res && res.length > 0) {
                        this.values.records = res
                        this.projectInformation.projectCode = res[0]['projectCode']
                        this.prossValue.title = `质量验收审批`
                    }
                })
            },

            getQualityCheckAcceptList (id) {
                getQualityCheckAcceptList ({'flowId': id}).then (res => {
                    if (res) {
                        this.projectInformation.projectCode = res[0]['schedulePlanFlow']['projectCode']
                        this.values.records = res
                    }
                })
            },

            submitQualityCheckAcceptData () {
                this.$refs.generateForm.getData ().then (data => {
                    if (data) {
                        this.values['relevanceIdList'] = []
                        this.values.records.forEach (res => { this.values['relevanceIdList'].push (res.id) })
                        this.dialogVisible = true
                        this.prossValue = {
                            title: this.$route.params.title || `质量验收审批`,
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.params.degree || '',
                            msg: '',
                        }
                    }
                })
            },

            updataQualityCheckAccept (item, boolean) {
                let url = ''
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                if (boolean) this.values['id'] = this.flowId
                boolean ? url = resetSubmitQualityCheckAccept : url = submitQualityCheckAccept
                url (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closePageTag ()
                    }
                })
            },

            consentQualityCheckAccept (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closePageTag ()
                    return
                }
                if (item) {
                    this.values['id'] = this.flowId
                    this.values['completeTask'] = item
                    completeQualityCheckAccept (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success (res.message)
                            this.closePageTag ()
                        }
                    })
                }
            },

            getDetailsList (taskId) {
                getDetails (taskId).then (res => { if (res) this.nodeData = res })
            },

            closePageTag () {
                let tagName = this.$route.path
                let path = ``
                this.stutas ? path = `/approval/${this.stutas}` : path = `/projectManagement/selfSupportProjectDetail/qualityControl/qualityCheckAccept`
                this.close ({ tagName, path })
            },

            editQualityCheckAccept (item) {
                this.taskData = { id: item.id, projectCode: this.projectInformation.projectCode }
                this.qualityCheckAccept = true
            },

            resetSubmitUpdataQualityCheckAccept (boolean = false) {
                this.qualityCheckAccept = false
                if (boolean) this.getQualityCheckAcceptList (this.flowId)
            },

            getProjectCode (projectCode) {
                this.values['projectCode'] = projectCode
            },

            updataRouter () {
                if (this.$route.params) {
                    this.transform = this.$route.params.transform || {}
                    this.stutas = this.$route.params.pathName || ''
                    this.procInstId = this.$route.params.procInstId || ''
                }
                if (this.$route.params && this.$route.params.taskId) {
                    this.getDetailsList (this.$route.params.taskId)
                }
                if (this.$route.params && this.$route.params.relevancyId) {
                    this.procInstId == '' ? this.getQualityCheckAccept (this.$route.params.relevancyId) : (this.flowId = this.$route.params.relevancyId, this.getQualityCheckAcceptList (this.$route.params.relevancyId))
                }
            }
        },

        created () {
            this.getFormByJson ()
            this.updataRouter ()
        },

        mounted () {
            than = this
        },

        components: {
            'project-information-basic': projectInformationBasic,
            'quality-check-accept-dialog': qualityCheckAcceptDialog,
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent,
            'qqt-table': qqtTable
        }
    }
</script>
