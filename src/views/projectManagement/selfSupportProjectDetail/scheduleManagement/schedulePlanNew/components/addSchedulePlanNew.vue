<template>
    <d2-container type="fulls" class="addInspection">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
            </div>
            <div class="qqt-container-full-center___top">
                <qqt-flow-tabs :procInstId="procInstId">
                    <template slot="content">
                        <!-- <project-information-basic :transform="transform" :values="values" @projectCode="getProjectCode" /> -->
                        <fm-generate-form 
                            :data="jsonData"
                            :remote="remote"
                            :remoteOption="remoteOption"
                            :value="values"
                            :transform="transform"
                            ref="generateForm"
                            @on-change="selectGenerateChange"/>
                            <bottom-information :values="values" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation" />
                    </template>
                </qqt-flow-tabs>
            </div>
            <div class="qqt-container-full-content___button">
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitAddInspectionData ()">重新提交</el-button>
                <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveAddInspection">保存</el-button>
                <el-button type="primary" v-if="!transform.isShowDetails && procInstId === ''" @click="values['flag'] = '1', submitAddInspectionData ()">提交</el-button>
                <el-button @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataAddInspection"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentAddInspection" />
    </d2-container>
</template>

<script>
import { selfSchedulePlanNewAdd, selfSchedulePlanNewEdit, selfSchedulePlanNewQueryById, selfSchedulePlanNewSubmit, 
    selfSchedulePlanNewReSubmit, selfSchedulePlanNewOperation } from '@/api/selfProject/scheduleManagement/schedulePlanNew/index'
import { qqtSendProcess, qqtFlowTabs, qqtConsent, upload, qqtRelateTable } from '@/components/qqt-subassembly'
import bottomInformation from '../../../businessBidding/components/bottomInformation'
import projectInformationBasic from '../../../operatingReserve/components/projectInformationBasic'
// import { SELFPROHECT } from '@/enum/DICTIONARY'
import { staffStaffDictionary } from '@/api/system/staff/staff'
import { getCompanyDepDic } from '@/api/system/depart/depart'
import { formGetJson } from '@/api/system/fromManagement/index'
import { PROPRIETARYPROJECT } from '@/enum/FORMCODE'
import { getDetails } from '@/api/approval/common'
import { mapActions, mapState } from 'vuex'
import util from '@/libs/util.js'
let than = this
export default {

    data () {
        return {
            title: '',
            stutas: '',
            procInstId: '',
            remote: {},
            remoteOption: {
                checkType: [
                    { name: '周检' }, { name: '月检' }, { name: '专项检查' },
                    { name: '联合检查' }, { name: '其他检查' },
                ]
            },
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
            processModuleId: PROPRIETARYPROJECT.ADDSCHEDULEPLANNEW,
            upLoadFileDefaultList: [],
            departmentList: [],
            staffList: [],
            inspectMethodList: [],
            inspectTermsList: [],
            
        }
    },

    methods: {

        ...mapActions('d2admin/page', [
            'close',
        ]),

        selectGenerateChange (field, value, model) {

        },

        getFormByJson () {
            formGetJson ({ 'code': this.processModuleId }).then(res => {
                if (res) this.jsonData = JSON.parse(res)
            })
        },

        getAddInspection (id) {
            selfSchedulePlanNewQueryById ({'id': id}).then (res => {
                if (res) {
                    this.values = Object.assign ({}, res)
                    this.prossValue.title = `自营进度追踪审批:【 ${this.values.untitled1} 】`
                    this.procInstId = res.procInstId || ""
                    this.fileDefaultNeaten (res)
                    this.getFormByJson ()
                }
            })
        },

        saveAddInspection () {
            let url = ''
            let item = this.$refs.bottomInformation.getData()
            this.$refs.generateForm.getData ().then (data => {
                if (data && item) {
                    Object.assign (this.values, data, item)
                    this.values.id == null ? url = selfSchedulePlanNewAdd : url = selfSchedulePlanNewEdit
                    this.values.projectCode = this.selfSupportProject.projectCode
                    url (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success ('保存成功')
                            this.closePageTag ()
                        }
                    })
                }
            })
        },

        submitAddInspectionData () {
            let item = this.$refs.bottomInformation.getData()
            this.$refs.generateForm.getData ().then (data => {
                if (data && item) {
                    Object.assign (this.values, data, item)
                    this.dialogVisible = true
                    this.prossValue = {
                        title: this.$route.params.title || `自营进度追踪审批:【 ${data.untitled1} 】`,
                        pdfId: this.$route.params.procDefId || '',
                        degree: this.$route.params.degree || '',
                        msg: '',
                    }
                }
            })
        },

        updataAddInspection (item, boolean) {
            let url = ''
            this.dialogVisible = this.isSendBack = false
            item['taskId'] = this.$route.params.taskId || ''
            this.values['completeTask'] = item
            this.values.projectCode = this.values.projectCode || this.selfSupportProject.projectCode
            boolean ? url = selfSchedulePlanNewReSubmit : url = selfSchedulePlanNewSubmit
            url (this.values).then (res => {
                if (res.code === 200) {
                    this.$message.success (res.message)
                    this.closePageTag ()
                }
            })
        },

        consentAddInspection (item = '', boolean = false) {
            this.visible = this.isTurnManage = this.isReject = false
            if (boolean) {
                this.closePageTag ()
                return
            }
            if (item) {
                this.values['completeTask'] = item
                selfSchedulePlanNewOperation (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closePageTag ()
                    }
                })
            }
        },

        getQueryDicByIdList () {
           
        },

        setRemote () {
            this.remote = {
            }
        },

        getDetailsList (taskId) {
            getDetails (taskId).then (res => { if (res) this.nodeData = res })
        },

        closePageTag () {
            let tagName = this.$route.path
            let path = ``
            this.stutas ? path = `/approval/${this.stutas}` : path = `/projectManagement/selfSupportProjectDetail/scheduleManagement/schedulePlanNew`
            this.close ({ tagName, path })
        },

        upLoadFileCallBack (item) {
            this.values.fileList = item
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
                this.getAddInspection (this.$route.params.relevancyId)
            } else {
                this.getFormByJson ()
            }
        }
    },

    created () {
        than = this
        this.updataRouter ()
        this.getQueryDicByIdList ()
    },

    mounted () {
        this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad')
    },

    computed: {
        ...mapState ('d2admin/selfSupportProject', [
            'selfSupportProject'
        ])
    },

    components: {
        'project-information-basic': projectInformationBasic,
        'bottomInformation': bottomInformation,
        'qqt-send-process': qqtSendProcess,
        'qqt-flow-tabs': qqtFlowTabs,
        'qqt-consent': qqtConsent,
        'up-load': upload
    }
}
</script>

<style lang='scss'>
    .addInspection {
        .files-upload___right {
            margin-left: 120px
        }
    }
</style>
