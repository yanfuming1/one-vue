<template>
    <d2-container type="fulls" class="addAccidentHandlingRecord">
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
                            :remoteOption="remoteOption"
                            @on-change="selectGenerateChange"
                        />
                        <bottom-information :values="values" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation" />
                    </template>
                </qqt-flow-tabs>
            </div>
            <div class="qqt-container-full-content___button">
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitHandlingRecordData ()">重新提交</el-button>
                <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveAddAccidentHandlingRecord">保存</el-button>
                <el-button type="primary" v-if="!transform.isShowDetails && procInstId === ''" @click="values['flag'] = '1', submitHandlingRecordData ()">提交</el-button>
                <el-button @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataAddAccidentHandlingRecord"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentAddAccidentHandlingRecord" />
    </d2-container>
</template>

<script>
    import { querySafetyIncidentReportById } from '@/api/selfProject/safetyManagement/safetyIncidentReport/index'
    import { addSafeHandle, editSafeHandle, submitSafeHandle, resubmitSafeHandle, queryByIdSafeHandle, safeHandledSafeHandle } from '@/api/selfProject/safetyManagement/accidentHandlingRecord/index'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, upload, qqtRelateTable } from '@/components/qqt-subassembly'
    import projectInformationBasic from '../../../operatingReserve/components/projectInformationBasic'
    import bottomInformation from '../../../businessBidding/components/bottomInformation'
    import { formGetJson } from '@/api/system/fromManagement/index'
    import { getUserDepartById } from '@/api/system/depart/depart'
    import { PROPRIETARYPROJECT } from '@/enum/FORMCODE'
    import { queryDicById } from '@/api/system/dic/dic'
    import { getDetails } from '@/api/approval/common'
    import { mapActions } from 'vuex'

    import util from '@/libs/util.js'
    let than = this
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
                remoteOption: {
                    getIsdead: [
                        {
                            id: '1',
                            name: '是'
                        },
                        {
                            id: '0',
                            name: '无'
                        },
                    ]
                },
                visible: false,
                isReject: false,
                isSendBack: false,
                isTurnManage: false,
                dialogVisible: false,
                processModuleId: PROPRIETARYPROJECT.ADDACCIDENTHANDLINGRECORD,
                upLoadFileDefaultList: [],
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

            getProjectCode (projectCode) {
                this.values['projectCode'] = projectCode
            },

            selectGenerateChange () {

            },

            getAddAccidentHandlingRecord (id) {
                queryByIdSafeHandle ({'id': id}).then (res => {
                    if (res) {
                        this.values = res
                        this.prossValue.title = `流程名称:【 ${this.values.applyName} 】`
                        this.fileDefaultNeaten (res)
                    }
                }).finally (() => {
                    this.getFormByJson ()
                })
            },

            getAccidentReport (id) {
                querySafetyIncidentReportById({'id': id}).then( res => {
                    Object.assign(this.values, res)
                    this.values.handles = res.safeAccs
                    this.values.id = null
                }).finally (() => {
                    this.getFormByJson ()
                })
            },

            saveAddAccidentHandlingRecord () {
                let url = ''
                let info = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && info) {
                        Object.assign (this.values, data, info )
                        this.values.id == null ? url = addSafeHandle : url = editSafeHandle
                        url (this.values).then (res => {
                            if (res.code === 200) {
                                this.$message.success ('保存成功')
                                this.closePageTag ()
                            }
                        })
                    }
                })
            },

            submitHandlingRecordData () {
                let info = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && info) {
                        Object.assign (this.values, data, info)
                        this.dialogVisible = true
                        this.prossValue = {
                            title: this.$route.params.title || `流程名称:【 ${data.accinvestigation} 】`,
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.params.degree || '',
                            msg: '',
                        }
                    }
                })
            },

            updataAddAccidentHandlingRecord (item, boolean) {
                let url = ''
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                boolean ? url = resubmitSafeHandle : url = submitSafeHandle
                url (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closePageTag ()
                    }
                })
            },

            consentAddAccidentHandlingRecord (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closePageTag ()
                    return
                }
                if (item) {
                    this.values['completeTask'] = item
                    safeHandledSafeHandle (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success (res.message)
                            this.closePageTag ()
                        }
                    })
                }
            },

            getQueryDicByIdList () {
                let list = ['字典项1', '字典项2']
                list.forEach (res => {
                    queryDicById ({'id': res}).then (item => {
                        if (item == null || item.length == 0) return
                            switch (res) {
                                case '字典项1':
                                    this.buyTypeList = item
                                    break
                                case '字典项2':
                                    this.sectionList = item
                                    break
                            }
                    })
                })
            },

            getDetailsList (taskId) {
                getDetails (taskId).then (res => { if (res) this.nodeData = res })
            },

            closePageTag () {
                let tagName = this.$route.path
                let path = ``
                this.stutas ? path = `/approval/${this.stutas}` : path = `/projectManagement/selfSupportProjectDetail/safetyManagement/accidentHandlingRecord`
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
                    this.getAddAccidentHandlingRecord (this.$route.params.relevancyId)
                }
                if (this.$route.params && this.$route.params.accidentReportId && this.$route.params.accidentReport) {
                    this.getAccidentReport (this.$route.params.accidentReportId)
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
            'bottomInformation': bottomInformation,
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent,
            'up-load': upload
        }
    }
</script>

<style lang='scss'>
    .addAccidentHandlingRecord {
        .files-upload___right {
            margin-left: 120px
        }
    }
</style>
