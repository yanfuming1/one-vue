<template>
    <d2-container type="fulls" class="QualityBrightSpot">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
            </div>
            <div class="qqt-container-full-center___top">
                <qqt-flow-tabs :procInstId="procInstId">
                    <template slot="content">
                        <project-information-basic :transform="transform" :values="values" @projectCode="getProjectCode" />
                        <fm-generate-form 
                            :data="jsonData"
                            :remote="remote"
                            :value="values"
                            :transform="transform"
                            ref="generateForm"
                            @on-change="selectGenerateChange"
                        />
                        <bottom-information :values="values" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation" />
                    </template>
                </qqt-flow-tabs>
            </div>
            <div class="qqt-container-full-content___button">
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitQualityBrightSpotData ()">重新提交</el-button>
                <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveQualityBrightSpot">保存</el-button>
                <el-button type="primary" v-if="!transform.isShowDetails && procInstId === ''" @click="values['flag'] = '1', submitQualityBrightSpotData ()">提交</el-button>
                <el-button @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataQualityBrightSpot"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentQualityBrightSpot" />
    </d2-container>
</template>

<script>
    import { getQualityBrightSpotById, editQualityBrightSpot,
                addQualityBrightSpot, submitQualityBrightSpot, completeQualityBrightSpot, resetSubmitQualityBrightSpot } from '@/api/selfProject/qualityManagement/qualityBrightSpot'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, upload, qqtRelateTable } from '@/components/qqt-subassembly'
    import { getQualityObjectivesPageList } from '@/api/selfProject/qualityManagement/qualityObjectives'
    import { getProjectDepartmentAll } from '@/api/selfProject/operatingReserve/projectDepartment'
    import { staffStaffDictionary } from "@/api/system/staff/staff"
    import { formGetJson } from '@/api/system/fromManagement/index'
    import { getUserDepartById } from '@/api/system/depart/depart'
    import { PROPRIETARYPROJECT } from '@/enum/FORMCODE'
    import { getDetails } from '@/api/approval/common'
    import { mapActions } from 'vuex'

    import bottomInformation from '../../../businessBidding/components/bottomInformation'
    import projectInformationBasic from '../../../operatingReserve/components/projectInformationBasic'
    import util from '@/libs/util.js'
    let than = this
    export default {

        data () {
            return {
                title: '',
                stutas: '',
                procInstId: '',
                remote: {},
                values: {
                    featureNumber: ''
                },
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
                visible: false,
                isReject: false,
                isSendBack: false,
                isTurnManage: false,
                dialogVisible: false,
                processModuleId: PROPRIETARYPROJECT.ADDQUALITYBRIGHTSPOT,
                upLoadFileDefaultList: [],
                taskPrincipalList: [],
                qualityObjectives: [],
                departmentList: []
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

            getQualityBrightSpot (id) {
                getQualityBrightSpotById ({'id': id}).then (res => {
                    if (res) {
                        Object.assign (this.values, res)
                        this.prossValue.title = `质量亮点:【 ${this.values.divideName} 】`
                        this.fileDefaultNeaten (res)
                    }
                })
            },

            saveQualityBrightSpot () {
                let url = '', item = {}
                item = this.$refs.bottomInformation.getData()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && item) {
                        Object.assign (this.values, data, item)
                        this.values.id == null ? url = addQualityBrightSpot : url = editQualityBrightSpot
                        url (this.values).then (res => {
                            if (res.code === 200) {
                                this.$message.success ('保存成功')
                                this.closePageTag ()
                            }
                        })
                    }
                })
            },

            submitQualityBrightSpotData () {
                let item = this.$refs.bottomInformation.getData()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && item) {
                        Object.assign (this.values, data, item)
                        this.dialogVisible = true
                        this.prossValue = {
                            title: this.$route.params.title || `质量亮点:【 ${this.values.divideName} 】`,
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.params.degree || '',
                            msg: '',
                        }
                    }
                })
            },

            updataQualityBrightSpot (item, boolean) {
                let url = ''
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                boolean ? url = resetSubmitQualityBrightSpot : url = submitQualityBrightSpot
                url (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closePageTag ()
                    }
                })
            },

            consentQualityBrightSpot (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closePageTag ()
                    return
                }
                if (item) {
                    this.values['completeTask'] = item
                    completeQualityBrightSpot (this.values).then (res => {
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

            getStaffStaffDictionary () {
                staffStaffDictionary ().then (res => {
                    if (res && res.length > 0) this.taskPrincipalList = res, this.neatenRemote ()
                })
            },

            getProjectDepartmentList (code) {
                getProjectDepartmentAll ({code: code}).then (res => {
                    if (res && res.length > 0) {
                        this.departmentList = res, this.neatenRemote ()
                    }
                })
            },

            getQualityObjectivesList (projectCode) {
                getQualityObjectivesPageList ({'projectCode': projectCode}).then (res => {
                    if (res) this.qualityObjectives = res
                    this.neatenRemote ()
                })
            },

            selectGenerateChange (field, value, model) {
                let item = {}
                switch (field) {
                    case 'principalId':
                        this.values['principalId'] = value
                        item = this.taskPrincipalList.find(el => el.id === value)
                        if (item) this.values['principal'] = item.name
                        break
                    case 'divideId':
                        this.values['divideId'] = value
                        item = this.qualityObjectives.find(el => el.id === value)
                        if (item) this.values['divideName'] = item.name, this.values.featureNumber = item.number
                        break
                    case 'constructionTeamId':
                        this.values['constructionTeamId'] = value
                        item = this.departmentList.find(el => el.id === value)
                        if (item) this.values['constructionTeam'] = item.name
                        break

                }

            },

            neatenRemote () {
                this.remote = {
                    getQualityObjectives (resolve) { resolve(than.qualityObjectives) },
                    getConstructionTeam (resolve) { resolve(than.departmentList) },
                    getPrincipal (resolve) { resolve(than.taskPrincipalList) }
                }
            },

            closePageTag () {
                let tagName = this.$route.path
                let path = ``
                this.stutas ? path = `/approval/${this.stutas}` : path = `/projectManagement/selfSupportProjectDetail/qualityControl/qualityBrightSpot`
                this.close ({ tagName, path })
            },

            upLoadFileCallBack (item) {
                this.values.fileList = item
            },

            getProjectCode (projectCode) {
                this.values['projectCode'] = projectCode
                this.getQualityObjectivesList (projectCode)
                this.getProjectDepartmentList (projectCode)
            },

            fileDefaultNeaten (res) {
                if (res.fileList && res.fileList.length > 0) {
                    res.fileList.forEach(item => {
                        let m = {
                            status : 'finished',
                            response : {
                                url : item.url,
                                size: item.size,
                                name: item.name
                            }
                        }
                        this.upLoadFileDefaultList.push(m)
                    })
                }
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
                    this.getQualityBrightSpot (this.$route.params.relevancyId)
                }
            }
        },

        created () {
            this.getStaffStaffDictionary ()
            this.getFormByJson ()
            this.updataRouter ()
        },

        mounted () {
            than = this
        },

        components: {
            'project-information-basic': projectInformationBasic,
            'bottomInformation': bottomInformation,
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent
        }
    }
</script>
