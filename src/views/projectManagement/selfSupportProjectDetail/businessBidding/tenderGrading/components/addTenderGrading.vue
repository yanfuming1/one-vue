<template>
    <d2-container type="fulls" class="add-tender-grading">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
            </div>
            <div class="qqt-container-full-center___top">
                <qqt-flow-tabs :procInstId="procInstId">
                    <template slot="content">
                        <announcement-basic-information :values="values" :transform="detailsfrom" ref="basicInformation" />
                        <fm-generate-form :data="announcement" :remote="remote" :value="values" :transform="detailsfrom" ref="announcementChange"/>
                        <fm-generate-form :data="jsonData" :remote="remote" :value="values" :transform="transform" ref="generateForm" @on-change="selectGenerateChange" @input-table-change="inputTableChange">
                            <template slot="imaginaryLine">
                                <div class="qqt-container-limaginary___Line">
                                    <div class="imaginaryLine"></div>
                                </div>
                            </template>
                        </fm-generate-form>
                        <div class="total_tender_score">
                            <span>合计:</span>
                            <span>满分值：{{ fullScoreTotal }} 分</span>
                            <span>可控得分：{{ controllableScoreTotal }} 分</span>
                            <span>争取得分：{{ tryScoreTotal }} 分</span>
                            <span>可控后失分：{{ controlledLossPointsTotal }} 分</span>
                            <span>争取后失分：{{ losePointsAfterTryingTotal}} 分</span>
                        </div>
                        <bottom-information :values="values" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation" />
                    </template>
                </qqt-flow-tabs>
            </div>
            <div class="qqt-container-full-content___button">
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitTenderGradingData ()">重新提交</el-button>
                <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveTenderGrading">保存</el-button>
                <el-button type="primary" v-if="!transform.isShowDetails && procInstId === ''" @click="values['flag'] = '1', submitTenderGradingData ()">提交</el-button>
                <el-button type="info" size="mini" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                <el-button @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataTenderGrading"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentTenderGrading" />
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </d2-container>
</template>

<script>
    import { getTenderGradingById, editTenderGrading,
                addTenderGrading, submitTenderGrading, completeTenderGrading, resetSubmitTenderGrading } from '@/api/selfProject/businessBidding/tenderGrading'
    import { getAnnouncementChangeByProjectCode } from '@/api/selfProject/businessBidding/announcementChange'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, qqtRelateTable } from '@/components/qqt-subassembly'
    import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
    import { PROPRIETARYPROJECTDICTIONARY } from '@/enum/DICTIONARY'
    import { formGetJson } from '@/api/system/fromManagement/index'
    import { PROPRIETARYPROJECT } from '@/enum/FORMCODE'
    import { queryDicByIds } from '@/api/system/dic/dic'
    import { getDetails } from '@/api/approval/common'
    import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
    import { mapActions, mapState } from 'vuex'

    import printTemplateByHtml from '../../../../../systemManagement/printTemplate/components/printTemplateByHtml'
    import announcementBasicInformation from '../../components/announcementBasicInformation'
    import bottomInformation from '../../components/bottomInformation'
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
                fullScoreTotal: 0,
                controllableScoreTotal: 0,
                tryScoreTotal: 0,
                controlledLossPointsTotal: 0,
                losePointsAfterTryingTotal: 0,
                announcement: {},
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
                detailsfrom: {
                    isShowDetails: true
                },
                visible: false,
                isReject: false,
                isSendBack: false,
                isTurnManage: false,
                dialogVisible: false,
                code: BASICSCODE.SELF_INVITATION_GRADE,
                processModuleId: PROPRIETARYPROJECT.ADDTENDERGRADING,
                upLoadFileDefaultList: [],
                scoringMethodList: []
            }
        },

        methods: {

            ...mapActions('d2admin/page', [
                'close',
            ]),

            getFormByJson () {
                formGetJson ({ 'code': this.processModuleId }).then(data => {
                    if (!data) return
                    this.jsonData = JSON.parse(data)
                })
            },

            getAnnouncementFormByJson () {
                formGetJson ({ 'code': PROPRIETARYPROJECT.ANNOUNCEMENTCHANGE }).then(data => {
                    if (!data) return
                    this.announcement = JSON.parse(data)
                })
            },

            getTenderGrading (id) {
                getTenderGradingById ({'id': id}).then (res => {
                    if (res) {
                        res.detailList.forEach( e => {
                            this.fullScoreTotal += e.fullScore
                            this.controllableScoreTotal += e.controllableScore;
                            this.tryScoreTotal += e.fightScore;
                            this.controlledLossPointsTotal += e.controllableLosing;
                            this.losePointsAfterTryingTotal += e.fightLosing;
                            e.fullScore = e.fullScore + ''
                        })
                        // item.fullScore = item.fullScore + '', item.controllableScore = item.controllableScore + ''
                        // item.fightScore = item.fightScore + '', item.controllableLosing = item.controllableLosing + ''
                        // item.fightLosing = item.fightLosing + ''
                        this.values = Object.assign ({}, this.values, res)
                        this.prossValue.title = `招标评价:【 ${this.values.projectName} 】`
                        this.fileDefaultNeaten (res)
                    }
                }).finally (res => {
                    this.getFormByJson ()
                })
            },

            getAnnouncementChangeInfoByCode (code) {
                getAnnouncementChangeByProjectCode ({'projectCode': code}).then (res => {
                    if (res && res.id) {
                        delete res.id, delete res.createBy, delete res.createTime
                        delete res.departmentId, delete res.departmentName, delete res.companyId, delete res.companyName
                        delete res.companyId, delete res.departmentId, delete res.auditState
                        delete res.procState, delete res.fileList, delete res.procInstId
                        this.values = Object.assign ({}, this.values, res)
                    }
                }).finally (res => {
                    this.getAnnouncementFormByJson ()
                })
            },

            saveTenderGrading () {
                let url = '', item = {}
                item = this.getValidateData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && item.basicInformation && item.bottomInformation && item.announcementChange) {
                        Object.assign (this.values, data, item.basicInformation, item.bottomInformation, item.announcementChange)
                        this.values.id == null ? url = addTenderGrading : url = editTenderGrading
                        url (this.values).then (res => {
                            if (res.code === 200) {
                                this.$message.success ('保存成功')
                                this.closePageTag ()
                            }
                        })
                    }
                })
            },

            submitTenderGradingData () {
                let item = this.getValidateData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && item.basicInformation && item.bottomInformation) {
                        Object.assign (this.values, data, item.basicInformation, item.bottomInformation)
                        this.dialogVisible = true
                        this.prossValue = {
                            title: this.$route.params.title || `招标评价:【 ${this.selfSupportProject.projectName} 】`,
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.params.degree || '',
                            msg: '',
                        }
                    }
                })
            },

            updataTenderGrading (item, boolean) {
                let url = ''
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                boolean ? url = resetSubmitTenderGrading : url = submitTenderGrading
                url (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closePageTag ()
                    }
                })
            },

            consentTenderGrading (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closePageTag ()
                    return
                }
                if (item) {
                    this.values['completeTask'] = item
                    completeTenderGrading (this.values).then (res => {
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

            getQueryDicByIdList () {
                let list = [ PROPRIETARYPROJECTDICTIONARY.SCORINGMETHOD ]
                queryDicByIds (list).then (item => {
                    if (!item) return
                    this.scoringMethodList = item[PROPRIETARYPROJECTDICTIONARY.SCORINGMETHOD]
                    this.neatenData ()
                })
            },

            neatenData () {
                this.remote = {
                    getScoringMethod (resolve) {
                        resolve (than.scoringMethodList)
                    }
                }
            },

            getValidateData () {
                let data = { basicInformation: {}, bottomInformation: {}, announcementChange: {} }
                data.basicInformation = this.$refs.basicInformation.getData ()
                data.bottomInformation = this.$refs.bottomInformation.getData ()
                data.announcementChange = this.$refs.announcementChange.getDataNotPromise ()
                return data
            },

            selectGenerateChange (field, val, models) {
                switch (field) {
                    case 'meansId':
                        let item = this.scoringMethodList.find (f => f.id === val)
                        if (item) this.values['means'] = item.name
                        break
                }
            },

            inputTableChange (field, value, index, parentField) {
                let data = this.$refs.generateForm.getDataNotValidateAndPromise ()
                switch (field) {
                    case 'fullScore':
                        this.fullScoreTotal = 0
                        data.detailList.forEach (res => {
                            this.fullScoreTotal += Number (res.fullScore)
                        })
                        break
                    case 'controllableScore':
                        this.controllableScoreTotal = 0
                        data.detailList.forEach (res => {
                            this.controllableScoreTotal += Number (res.controllableScore)
                        })
                        break
                    case 'fightScore':
                        this.tryScoreTotal = 0
                        data.detailList.forEach (res => {
                            this.tryScoreTotal += Number (res.fightScore)
                        })
                        break
                    case 'controllableLosing':
                        this.controlledLossPointsTotal = 0
                        data.detailList.forEach (res => {
                            this.controlledLossPointsTotal += Number (res.controllableLosing)
                        })
                        break
                    case 'fightLosing':
                        this.losePointsAfterTryingTotal = 0
                        data.detailList.forEach (res => {
                            this.losePointsAfterTryingTotal += Number (res.fightLosing)
                        })
                        break
                        // console.log (data)
                }
            },

            closePageTag () {
                let tagName = this.$route.path
                let path = ``
                this.stutas ? path = `/approval/${this.stutas}` : path = `/projectManagement/selfSupportProjectDetail/businessBidding/tenderGrading`
                this.close ({ tagName, path })
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
                    this.getTenderGrading (this.$route.params.relevancyId)
                } else {
                    this.getFormByJson ()
                }
            }
        },

        created () {
            this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad')
            this.getQueryDicByIdList ()
            this.updataRouter ()
        },

        computed: {
            ...mapState ('d2admin/selfSupportProject', [
                'selfSupportProject'
            ])
        },

        watch: {
            selfSupportProject () {
                this.values['projectCode'] = this.selfSupportProject.projectCode
                this.getAnnouncementChangeInfoByCode (this.selfSupportProject.projectCode)
            }
        },
        mounted () {
            than = this
        },

        components: {
            'announcement-basic-information': announcementBasicInformation,
            'print-template-by-html': printTemplateByHtml,
            'bottom-information': bottomInformation,
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent
        }
    }
</script>

<style lang="scss">
    .add-tender-grading {
        .el-col-24 {
            background: linear-gradient(white,white) padding-box,
            repeating-linear-gradient(-45deg, $color-straight-line3 0, $color-straight-line3 0.4em,white 0,white 0.7em);
            border-bottom: 1px dashed transparent;
            .limaginaryLine {
                border: 1px solid $color-vertical-line;
            }
        }
        .el-tabs--card {
            padding-left: 30px;
        }
        .total_tender_score {
            width: 100%;
            height: 46px;
            margin: 22px;
            background: $color-project-revenue-information-bg;
            span {
                font-size: 14px;
                line-height: 46px;
                margin-left: 32px;
                color: $color-top-text-title;
                font-weight: 600;
            }
        }
    }
</style>>