<template>
    <d2-container type="fulls" class="addBlueprintAudit">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
            </div>
            <div class="qqt-container-full-center___top">
                <qqt-flow-tabs :procInstId="procInstId">
                    <template slot="content">
                        <project-information-basic :transform="transform" :values="values" @projectCode="getProjectCode" />
                        <fm-generate-form :data="jsonData" :remote="remote" :value="values" :transform="transform" ref="generateForm">
                            <template slot="owners">
                                <qqt-relate-table :data="values.ownersList" ref="owners" :rowHeader="rowHeader" :isShowDetails="transform.isShowDetails" />
                            </template>
                            <template slot="survey">
                                <qqt-relate-table :data="values.surveyList" ref="survey" :rowHeader="rowHeader" :isShowDetails="transform.isShowDetails" />
                            </template>
                            <template slot="design">
                                <qqt-relate-table :data="values.designList" ref="design" :rowHeader="rowHeader" :isShowDetails="transform.isShowDetails" />
                            </template>
                            <template slot="supervisor">
                                <qqt-relate-table :data="values.supervisorList" ref="supervisor" :rowHeader="rowHeader" :isShowDetails="transform.isShowDetails" />
                            </template>
                            <template slot="construction">
                                <qqt-relate-table :data="values.constructionList" ref="construction" :rowHeader="rowHeader" :isShowDetails="transform.isShowDetails" />
                            </template>
                            <template slot="elses">
                                <qqt-relate-table :data="values.elsesList" ref="elses" :rowHeader="elsesHeader" :isShowDetails="transform.isShowDetails" />
                            </template>
                        </fm-generate-form>
                        <bottom-information :values="values" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation" />
                    </template>
                </qqt-flow-tabs>
            </div>
            <div class="qqt-container-full-content___button">
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitBlueprintAuditData ()">重新提交</el-button>
                <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveBlueprintAudit">保存</el-button>
                <el-button type="primary" v-if="!transform.isShowDetails && procInstId === ''" @click="values['flag'] = '1', submitBlueprintAuditData ()">提交</el-button>
                <el-button type="info" size="mini" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                <el-button @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataBlueprintAudit"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentBlueprintAudit" />
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </d2-container>
</template>

<script>
    import { getBlueprintAuditById, editBlueprintAudit,
                addBlueprintAudit, submitBlueprintAudit, completeBlueprintAudit, resetSubmitBlueprintAudit } from '@/api/selfProject/operatingReserve/blueprintAudit'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, qqtRelateTable } from '@/components/qqt-subassembly'
    import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
    import { formGetJson } from '@/api/system/fromManagement/index'
    import { PROPRIETARYPROJECT } from '@/enum/FORMCODE'
    import { getDetails } from '@/api/approval/common'
    import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
    import { mapActions } from 'vuex'

    import printTemplateByHtml from '../../../../../systemManagement/printTemplate/components/printTemplateByHtml'
    import bottomInformation from '../../../businessBidding/components/bottomInformation'
    import projectInformationBasic from '../../components/projectInformationBasic'
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
                    elsesList: [],
                    ownersList: [],
                    surveyList: [],
                    designList: [],
                    supervisorList: [],
                    constructionList: [],
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
                code: BASICSCODE.SELF_DRAWING_AUDIT,
                processModuleId: PROPRIETARYPROJECT.ADDBLUEPRINTAUDIT,
                upLoadFileDefaultList: [],
                elsesHeader: [
                    {
                        prop: 'unitName',
                        label: '单位名称',
                        isShow: true,
                        type: 'text'
                    },
                    {
                        prop: '',
                        label: '参加人员',
                        isShow: true,
                        children: [
                            {
                                prop: 'name',
                                label: '姓名',
                                isShow: true,
                                type: 'text'
                            },
                            {
                                prop: 'duty',
                                label: '职务/岗位',
                                isShow: true,
                                type: 'text'
                            },
                            {
                                prop: 'phone',
                                label: '联系电话',
                                isShow: true,
                                type: 'text'
                            },
                            {
                                prop: 'email',
                                label: '电子邮箱',
                                isShow: true,
                                type: 'text'
                            },
                        ]
                    },
                    {
                        prop: 'remark',
                        label: '备注',
                        isShow: true,
                        type: 'text',
                    }
                ],
                rowHeader: [
                    {
                        prop: 'unitName',
                        label: '单位名称',
                        isShow: true,
                        type: 'text',
                        required: true
                    },
                    {
                        prop: '',
                        label: '参加人员',
                        isShow: true,
                        children: [
                            {
                                prop: 'name',
                                label: '姓名',
                                isShow: true,
                                type: 'text',
                                required: true
                            },
                            {
                                prop: 'duty',
                                label: '职务/岗位',
                                isShow: true,
                                type: 'text',
                                required: true
                            },
                            {
                                prop: 'phone',
                                label: '联系电话',
                                isShow: true,
                                type: 'text',
                                required: true,
                                rule: [
                                    { required: true, message: `联系电话不能为空`, trigger: 'change' },
                                    { pattern: /^(0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57][0-9]{8})|([0-9]{4}|[0-9]{3})(-| ))?([0-9]{7,8})?$/, message: `联系电话不正确`, trigger: 'change' }
                                ]
                            },
                            {
                                prop: 'email',
                                label: '电子邮箱',
                                isShow: true,
                                type: 'text'
                            },
                        ]
                    },
                    {
                        prop: 'remark',
                        label: '备注',
                        isShow: true,
                        type: 'text',
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

            getBlueprintAudit (id) {
                getBlueprintAuditById ({'id': id}).then (res => {
                    if (res) {
                        this.values = res
                        this.prossValue.title = `图纸会审:【 ${this.values.projectName} 】`
                        this.fileDefaultNeaten (res)
                    }
                }).finally (res => {
                    this.getFormByJson ()
                })
            },

            saveBlueprintAudit () {
                let url = '', item = {}
                item = this.getValidateData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && item.relateTable.ownersList && item.relateTable.surveyList
                            && item.relateTable.designList && item.relateTable.supervisorList
                            && item.relateTable.constructionList && item.bottomInformation) {
                        Object.assign (this.values, data, item.relateTable, item.bottomInformation)
                        this.values.id == null ? url = addBlueprintAudit : url = editBlueprintAudit
                        url (this.values).then (res => {
                            if (res.code === 200) {
                                this.$message.success ('保存成功')
                                this.closePageTag ()
                            }
                        })
                    }
                })
            },

            submitBlueprintAuditData () {
               let item = this.getValidateData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && item.relateTable.ownersList && item.relateTable.surveyList
                            && item.relateTable.designList && item.relateTable.supervisorList
                            && item.relateTable.constructionList && item.bottomInformation) {
                        Object.assign (this.values, data, item.relateTable, item.bottomInformation)
                        this.dialogVisible = true
                        this.prossValue = {
                            title: this.$route.params.title || `图纸会审:【 ${this.values.createName} 】`,
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.params.degree || '',
                            msg: '',
                        }
                    }
                })
            },

            updataBlueprintAudit (item, boolean) {
                let url = ''
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                boolean ? url = resetSubmitBlueprintAudit : url = submitBlueprintAudit
                url (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closePageTag ()
                    }
                })
            },

            consentBlueprintAudit (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closePageTag ()
                    return
                }
                if (item) {
                    this.values['completeTask'] = item
                    completeBlueprintAudit (this.values).then (res => {
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
                this.stutas ? path = `/approval/${this.stutas}` : path = `/projectManagement/selfSupportProjectDetail/operatingReserve/blueprintAudit`
                this.close ({ tagName, path })
            },

            getValidateData () {
                let data = { bottomInformation: {}, relateTable: { ownersList: [], surveyList: [], designList: [], supervisorList: [], constructionList: [], elsesList: [] } }
                data.bottomInformation = this.$refs.bottomInformation.getData ()
                data.relateTable.ownersList = this.$refs.owners.verify (), data.relateTable.surveyList = this.$refs.survey.verify ()
                data.relateTable.designList = this.$refs.design.verify (), data.relateTable.supervisorList = this.$refs.supervisor.verify ()
                data.relateTable.constructionList = this.$refs.construction.verify (), data.relateTable.elsesList = this.$refs.elses.verify ()
                return data
            },

            getProjectCode (projectCode) {
                this.values['projectCode'] = projectCode
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

            printTemplate () {
                getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.$route.params.relevancyId}).then(res => {
                    if (res) this.$refs.printTemp.printTemplate (res)
                })
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
                    this.getBlueprintAudit (this.$route.params.relevancyId)
                } else {
                    this.getFormByJson ()
                }
                
            }
        },

        created () {
            this.updataRouter ()
        },

        mounted () {
            than = this
        },

        components: {
            'project-information-basic': projectInformationBasic,
            'print-template-by-html': printTemplateByHtml,
            'bottomInformation': bottomInformation,
            'qqt-relate-table': qqtRelateTable,
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent
        }
    }
</script>

<style lang="scss">
    .addBlueprintAudit {
        .el-tabs__nav {
            left: 40px;
        }
        .el-tabs .el-tabs--top {
            margin-bottom: 0px !important;
        }
    }
</style>