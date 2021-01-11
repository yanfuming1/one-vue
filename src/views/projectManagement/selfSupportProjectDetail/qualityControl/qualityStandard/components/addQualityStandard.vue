<template>
    <d2-container type="fulls" class="qualityStandard">
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
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitQualityStandardData ()">重新提交</el-button>
                <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveQualityStandard">保存</el-button>
                <el-button type="primary" v-if="!transform.isShowDetails && procInstId === ''" @click="values['flag'] = '1', submitQualityStandardData ()">提交</el-button>
                <el-button @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataQualityStandard"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentQualityStandard" />
    </d2-container>
</template>

<script>
    import { getQualityStandardById, editQualityStandard, addQualityStandard, 
                submitQualityStandard, completeQualityStandard, resetSubmitQualityStandard, getQualityTypeList } from '@/api/selfProject/qualityManagement/qualityStandard'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, upload, qqtRelateTable } from '@/components/qqt-subassembly'
    import { PROPRIETARYPROJECTDICTIONARY } from '@/enum/DICTIONARY'
    import { formGetJson } from '@/api/system/fromManagement/index'
    import { getUserDepartById } from '@/api/system/depart/depart'
    import { PROPRIETARYPROJECT } from '@/enum/FORMCODE'
    import { queryDicById } from '@/api/system/dic/dic'
    import { getDetails } from '@/api/approval/common'
    import { mapActions } from 'vuex'

    import bottomInformation from '../../../businessBidding/components/bottomInformation'
    import projectInformationBasic from '../../../operatingReserve/components/projectInformationBasic'
    import util from '@/libs/util.js'
    export default {

        data () {
            return {
                title: '',
                stutas: '',
                procInstId: '',
                remote: {},
                values: {},
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
                processModuleId: PROPRIETARYPROJECT.ADDQUALITYSTANDARD,
                upLoadFileDefaultList: [],
                industryTypeList: [],
                parentList: []
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

            getQualityStandard (id) {
                getQualityStandardById ({'id': id}).then (res => {
                    if (res) {
                        this.values = res
                        this.prossValue.title = `质量规范:【 ${this.values.standardName} 】`
                        this.fileDefaultNeaten (res)
                    }
                })
            },

            saveQualityStandard () {
                let url = '', item = {}
                item = this.$refs.bottomInformation.getData()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && item) {
                        Object.assign (this.values, data, item)
                        this.values.id == null ? url = addQualityStandard : url = editQualityStandard
                        url (this.values).then (res => {
                            if (res.code === 200) {
                                this.$message.success ('保存成功')
                                this.closePageTag ()
                            }
                        })
                    }
                })
            },

            submitQualityStandardData () {
                let item = this.$refs.bottomInformation.getData()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && item) {
                        Object.assign (this.values, data, item)
                        this.dialogVisible = true
                        this.prossValue = {
                            title: this.$route.params.title || `质量规范:【 ${this.values.standardName} 】`,
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.params.degree || '',
                            msg: '',
                        }
                    }
                })
            },

            updataQualityStandard (item, boolean) {
                let url = ''
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                boolean ? url = resetSubmitQualityStandard : url = submitQualityStandard
                url (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closePageTag ()
                    }
                })
            },

            consentQualityStandard (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closePageTag ()
                    return
                }
                if (item) {
                    this.values['completeTask'] = item
                    completeQualityStandard (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success (res.message)
                            this.closePageTag ()
                        }
                    })
                }
            },

            getQueryDicByIdList () {
                queryDicById ({'id': PROPRIETARYPROJECTDICTIONARY.BEHAVIORTYPE}).then (item => {
                    if (item == null || item.length == 0) return
                    this.industryTypeList = item
                    this.neateRemote ()
                })
            },

            getQualityTypeList (projectCode) {
                getQualityTypeList ({'projectCode': projectCode}).then (res => {
                    if (res) this.parentList = res, this.neateRemote ()
                })
            },

            getDetailsList (taskId) {
                getDetails (taskId).then (res => { if (res) this.nodeData = res })
            },

            selectGenerateChange (field, value, model) {
                switch (field) {
                    case 'industryTypeId':
                        let item = this.industryTypeList.find (f => f.id == value)
                        if (item) this.values['industryType'] = item.name
                        break
                    default:
                        this.values[field] = value
                        break
                }
            },

            closePageTag () {
                let tagName = this.$route.path
                let path = ``
                this.stutas ? path = `/approval/${this.stutas}` : path = `/projectManagement/selfSupportProjectDetail/qualityControl/qualityStandard`
                this.close ({ tagName, path })
            },

            upLoadFileCallBack (item) {
                this.values.fileList = item
            },

            getProjectCode (projectCode) {
                this.values['projectCode'] = projectCode
                this.getQualityTypeList (projectCode)
            },

            neateRemote () {
                let than = this
                this.remote = {
                    getIndustryType (resolve) { resolve (than.industryTypeList) },
                    getParentId (resolve) { resolve (than.parentList) }
                }
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
                    this.getQualityStandard (this.$route.params.relevancyId)
                } else {
                    this.values.categoryId = this.$route.params.parentId
                } 
            }
        },

        created () {
            this.getQueryDicByIdList ()
            this.getFormByJson ()
            this.updataRouter ()
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
