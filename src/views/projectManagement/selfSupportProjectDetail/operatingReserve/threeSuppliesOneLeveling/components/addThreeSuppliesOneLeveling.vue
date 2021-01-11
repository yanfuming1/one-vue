<template>
    <d2-container type="fulls" class="addThreeSuppliesOneLeveling">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
            </div>
            <div class="qqt-container-full-center___top">
                <qqt-flow-tabs :procInstId="procInstId">
                    <template slot="content">
                        <project-information-basic :transform="transform" :values="values" @projectCode="getProjectCode" />
                        <fm-generate-form :data="jsonData" :remote="remote" :value="values" :transform="transform" ref="generateForm" @on-change="selectGenerateChange" @btn-click="btnClick"/>
                        <bottom-information :values="values" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation" />
                    </template>
                </qqt-flow-tabs>
            </div>
            <div class="qqt-container-full-content___button">
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitThreeSuppliesOneLevelingData ()">重新提交</el-button>
                <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveThreeSuppliesOneLeveling">保存</el-button>
                <el-button type="primary" v-if="!transform.isShowDetails && procInstId === '' && $route.params.relevancyId" @click="values['flag'] = '1', submitThreeSuppliesOneLevelingData ()">提交</el-button>
                <el-button type="info" size="mini" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                <el-button @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataThreeSuppliesOneLeveling"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentThreeSuppliesOneLeveling" />
        <user-modules :showDialog="isShowAdminDialog" title="选择部门" :isShowRole="false" @clearUserPage="clearUserPage" @closeFun="isShowAdminDialog = false"/>
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </d2-container>
</template>

<script>
    import { getThreeSuppliesOneLevelingById, editThreeSuppliesOneLeveling,
                addThreeSuppliesOneLeveling, submitThreeSuppliesOneLeveling, completeThreeSuppliesOneLeveling, resetSubmitThreeSuppliesOneLeveling } from '@/api/selfProject/operatingReserve/threeSuppliesOneLeveling'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent } from '@/components/qqt-subassembly'
    import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
    import { PROPRIETARYPROJECTDICTIONARY } from '@/enum/DICTIONARY'
    import { formGetJson } from '@/api/system/fromManagement/index'
    import { getDepIdByUserId } from '@/api/system/workflow'
    import { PROPRIETARYPROJECT } from '@/enum/FORMCODE'
    import { queryDicById } from '@/api/system/dic/dic'
    import { getDetails } from '@/api/approval/common'
    import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
    import { mapActions } from 'vuex'

    import printTemplateByHtml from '../../../../../systemManagement/printTemplate/components/printTemplateByHtml'
    import userModules from '../../../../../systemManagement/processDefinition/processModules/userModules'
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
                    responsibleDepartment: ''
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
                isShowAdminDialog: false,
                code: BASICSCODE.SELF_ELECTRIC,
                processModuleId: PROPRIETARYPROJECT.ADDTHREESUPPLIESONELEVELING,
                upLoadFileDefaultList: [],
                principalList: [],
                typeList: []
            }
        },

        methods: {

            ...mapActions('d2admin/page', [
                'close',
            ]),

            getFormByJson () {
                formGetJson ({ 'code': this.processModuleId }).then(res => {
                    if (res) {
                        res = JSON.parse(res)
                        res.list.forEach (item => {
                            if (this.$route.params && this.$route.params.relevancyId) {
                                if (item.model == 'isUpdata') item.options.hidden = false
                                if (item.model == 'isAdd') item.options.hidden = true
                            } else {
                                if (item.model == 'isAdd') item.options.hidden = false
                                if (item.model == 'isUpdata') item.options.hidden = true
                            }
                        })
                        this.jsonData = res
                    }
                })
            },

            getThreeSuppliesOneLeveling (id) {
                getThreeSuppliesOneLevelingById ({'id': id}).then (res => {
                    if (res) {
                        res.constructionBudget = res.constructionBudget + '',
                        res.realityBudget = res.realityBudget + '', res.overspend = res.overspend + ''
                        this.values = res
                        this.prossValue.title = `三通一平:【 ${this.values.typeName} 】`
                        this.getDepIdByUserIdList (res.responsibleDepartmentId)
                        this.fileDefaultNeaten (res)
                    }
                }).finally (res => {
                    this.getFormByJson ()
                })
            },

            saveThreeSuppliesOneLeveling () {
                let url = '', element = {}
                element = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && element) {
                        Object.assign (this.values, data, element)
                        this.values.id == null ? url = addThreeSuppliesOneLeveling : url = editThreeSuppliesOneLeveling
                        url (this.values).then (res => {
                            if (res.code === 200) {
                                this.$message.success ('保存成功')
                                this.closePageTag ()
                            }
                        })
                    }
                })
            },

            submitThreeSuppliesOneLevelingData () {
                let element = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && element) {
                        Object.assign (this.values, data, element)
                        this.dialogVisible = true
                        this.prossValue = {
                            title: this.$route.params.title || `三通一平:【 ${this.values.typeName} 】`,
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.params.degree || '',
                            msg: '',
                        }
                    }
                })
            },

            updataThreeSuppliesOneLeveling (item, boolean) {
                let url = ''
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                boolean ? url = resetSubmitThreeSuppliesOneLeveling : url = submitThreeSuppliesOneLeveling
                url (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closePageTag ()
                    }
                })
            },

            consentThreeSuppliesOneLeveling (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closePageTag ()
                    return
                }
                if (item) {
                    this.values['completeTask'] = item
                    completeThreeSuppliesOneLeveling (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success (res.message)
                            this.closePageTag ()
                        }
                    })
                }
            },

            getQueryDicByIdList () {
                queryDicById ({'id': PROPRIETARYPROJECTDICTIONARY.THREETYPES}).then (item => {
                    if (item == null || item.length == 0) return
                    this.typeList = item, this.neatenRemote ()
                })
            },

            getDetailsList (taskId) {
                getDetails (taskId).then (res => { if (res) this.nodeData = res })
            },

            getDepIdByUserIdList (id) {
                getDepIdByUserId ({'depIds': id}).then (res => {
                    if (res && res.length > 0) this.principalList = res, this.neatenRemote ()
                })
            },

            closePageTag () {
                let tagName = this.$route.path
                let path = ``
                this.stutas ? path = `/approval/${this.stutas}` : path = `/projectManagement/selfSupportProjectDetail/operatingReserve/threeSuppliesOneLeveling`
                this.close ({ tagName, path })
            },

            selectGenerateChange (field, val, models) {
                let item = '', start = '', end = '', boolean = false
                switch (field) {
                    case 'types':
                        item = this.typeList.find (f => f.id === val)
                        if (item) this.values['typeName'] = item.name
                        break
                    case 'principalId':
                        item = this.principalList.find (f => f.id === val)
                        if (item) this.values['principal'] = item.name
                        break
                    case 'planEndTime':
                    case 'planStartTime':
                        if (models.planStartTime && models.planEndTime) {
                            start = new Date (models.planStartTime)
                            end = new Date (models.planEndTime)
                            if (start > end) {
                                boolean = true
                                this.$message.warning ('计划开工时间不能大于计划完工时间')
                                if (field == 'planEndTime') {
                                    models.planStartTime = ''
                                } else {
                                    models.planEndTime = ''
                                }
                            }
                            if (boolean) return
                            models.planDeadline = (((new Date (models.planEndTime).getTime ()) - (new Date (models.planStartTime).getTime ()))  / (24 * 3600 * 1000)).toFixed (1)
                        }
                        break
                    case 'realityStartTime':
                    case 'realityEndTime':
                        if (models.realityStartTime && models.realityEndTime) {
                            start = new Date (models.realityStartTime)
                            end = new Date (models.realityEndTime)
                            if (start > end) {
                                boolean = true
                                this.$message.warning ('实际开工时间不能大于实际完工时间')
                                if (field == 'realityEndTime') {
                                    models.realityStartTime = ''
                                } else {
                                    models.realityEndTime = ''
                                }
                            }
                            if (boolean) return
                            models.realityDeadline = (((new Date (models.realityEndTime).getTime ()) - (new Date (models.realityStartTime).getTime ()))  / (24 * 3600 * 1000)).toFixed (1)
                        }
                        break
                    case 'constructionBudget':
                    case 'realityBudget':
                        if (models.constructionBudget && models.realityBudget) {
                            let num = (Number (models.constructionBudget) - Number (models.realityBudget))
                            models.overspend = Math.abs(num).toFixed (2)
                        }
                        break
                }
            },

            btnClick (value, field) {
                field == 'responsibleDepartment' ? this.isShowAdminDialog = true : this.isShowAdminDialog = false
            },

            getProjectCode (projectCode) {
                this.values['projectCode'] = projectCode
            },

            clearUserPage (list, data) {
                if (list.length == 0 || list.length > 1) {
                    this.$message.warning ('选择一条数据')
                    return
                }
                if (list[0].id.indexOf ('U') != -1) {
                    this.$message.warning ('只能选择部门')
                    return
                }
                this.getDepIdByUserIdList (list[0].id)
                this.values['responsibleDepartmentId'] = list[0].id
                this.values['responsibleDepartment'] = list[0].name
                this.isShowAdminDialog = false
            },

            neatenRemote () {
                this.remote = {
                    getTypes (resolve) {
                        resolve (than.typeList)
                    },

                    getPrincipal (resolve) {
                        resolve (than.principalList)
                    }
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
                    this.getThreeSuppliesOneLeveling (this.$route.params.relevancyId)
                } else {
                    this.getFormByJson ()
                }
            }
        },

        created () {
            this.getQueryDicByIdList ()
            this.updataRouter ()
        },

        mounted () {
            than = this
        },

        components: {
            'project-information-basic': projectInformationBasic,
            'print-template-by-html': printTemplateByHtml,
            'bottomInformation': bottomInformation,
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'user-modules': userModules,
            'qqt-consent': qqtConsent,
        }
    }
</script>
