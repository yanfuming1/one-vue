<template>
    <d2-container type="fulls" class="index">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
            </div>
            <div class="qqt-container-full-center___top">
                <qqt-flow-tabs :procInstId="procInstId">
                    <template slot="content">
                        <fm-generate-form 
                            :data="jsonData"
                            :remote="remote"
                            :remoteOption="remoteOption"
                            :value="values"
                            :transform="transform"
                            ref="generateForm"
                            @on-change="selectGenerateChange"
                        />
                        <div class="files-upload___right">
                            <up-load id="male" @upLoadFileCallBack="upLoadFileCallBack" :isShowUpload="!transform.isShowDetails" :propList="upLoadFileDefaultList" ref="upLoad" />
                        </div>
                        <bottomInformation :fieldTitle="'申请'" :timeTitle="'申请'" :values="values" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
                    </template>
                </qqt-flow-tabs>
            </div>
            <div class="qqt-container-full-content___button" v-if="showDetail">
                <el-button type="primary" @click="editData('1')" v-if="canEdit">编辑</el-button>
                <el-button @click="editData('0')">关闭</el-button>
            </div>
            <div class="qqt-container-full-content___button" v-else>
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitIndexData ()">重新提交</el-button>
                <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveIndex">保存</el-button>
                <el-button type="primary" v-if="!transform.isShowDetails && procInstId === ''" @click="values['flag'] = '1', submitIndexData ()">提交</el-button>
                <el-button type="info" size="mini" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                <el-button @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataIndex"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentIndex" />
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </d2-container>
</template>

<script>
    import { projectApplyQueryById, projectApplyEdit, projectApplyAdd, projectApplyReSubmit, projectApplySubmit, projectApplyOperation, projectApplyQueryByCode } 
        from '../../../../../api/selfProject/ourBidding/selfProApplication/index'
    import { getProjectAllOptions } from '../../../../../api/jointProject/index'
    import { selfQueryBaseMsgByCode, getSelfProjectHighestVersion } from '../../../../../api/selfProject/allProject/index'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, upload, qqtRelateTable } from '@/components/qqt-subassembly'
    import printTemplateByHtml from '../../../../systemManagement/printTemplate/components/printTemplateByHtml'
    import bottomInformation from '../../businessBidding/components/bottomInformation'
    import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
    import { formGetJson } from '@/api/system/fromManagement/index'
    import { getUserDepartById } from '@/api/system/depart/depart'
    import { PORJECT_INFO } from '@/enum/SELFPROJECT'
    import { PROJECT_GETINFOID } from '@/enum/PROJECT'
    import { SELFPROHECT } from '@/enum/DICTIONARY'
    import { queryDicByIds } from '@/api/system/dic/dic'
    import { getDetails } from '@/api/approval/common'
    import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
    import { PROPRIETARYPROJECTDICTIONARY } from '@/enum/DICTIONARY'
    import { mapActions } from 'vuex'
    import { CITYJSON } from '../../../../../enum/CTIYS'
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
                    addressOption: eval(CITYJSON),
                },
                values: {
                    projectCode: '',
                    projectName: '',
                    qualificationRequirementDicId: [],
                    sectionDicId: [],
                    projectCategoryDicId: [],
                    projectAddress: [],
                },
                tempValues: {},
                jsonData: {},
                nodeData: {
                    operation: '',
                    msg: ''
                },
                showDetail: false,
                canEdit: true,
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
                code: BASICSCODE.SELF_BID_APPLY,
                processModuleId: PORJECT_INFO.SELFPROJECTAPPLICATION, 
                upLoadFileDefaultList: [],
                departmentList: [],

                projectCategoryList: [],
                qualificationList: [],
                sectionList: [],
                applyWayList: [],
                biddingCompanyList: [],
                projectManagerList: [],
                technicalDirectorList: [],
                aCertificateList: [],
                bCertificateList: [],
                cCertificateList: [],
                fiveBigShotsList: [],
                capitalSourceList: [],
            }
        },

        methods: {

            ...mapActions('d2admin/page', [
                'close',
            ]),

            editData (type) {
                if (type === '1') {
                    this.showDetail = false
                    this.transform = { isShowDetails: false }
                } else {
                    let tagName = this.$route.path;
                    this.close ({ tagName });
                    this.$router.go(-1);
                }
            },

            selectGenerateChange (field, value, model) {
                let temp = ''
                switch(field) {
                    case 'sectionDicId':
                        this.values.sectionDic = util.getResultByArr(value, this.sectionList, 'name')
                        break
                    case 'applyWayDicId':
                        temp = this.applyWayList.find(el => el.id === value)
                        if(temp) { this.values.applyWayDic = temp.name }
                        break
                    case 'projectCategoryDicId':
                        this.values.projectCategoryDic = util.getResultByArr(value, this.projectCategoryList, 'name')
                        break
                    case 'qualificationRequirementDicId':
                        this.values.qualificationRequirementDic = util.getResultByArr(value, this.qualificationList, 'name')
                        break
                    case 'capitalSourceDicId':
                        this.values.capitalSourceDic = util.getResultByArr(value, this.capitalSourceList, 'name')
                        break
                    case 'projectManagerId':
                        temp = this.projectManagerList.find(el => el.id === value)
                        if(temp) { this.values.projectManager = temp.possessor }
                        break
                    case 'technicalDirectorId':
                        temp = this.technicalDirectorList.find(el => el.id === value)
                        if(temp) { this.values.technicalDirector = temp.possessor }
                        break
                    case 'acertificateId':
                        temp = this.aCertificateList.find(el => el.id === value)
                        if(temp) { this.values.acertificate = temp.possessor }
                        break
                    case 'bcertificateId':
                        temp = this.bCertificateList.find(el => el.id === value)
                        if(temp) { this.values.bcertificate = temp.possessor }
                        break
                    case 'ccertificateId':
                        temp = this.cCertificateList.find(el => el.id === value)
                        if(temp) { this.values.ccertificate = temp.possessor }
                        break
                    case 'fiveBigShotsId':
                        this.values.fiveBigShots = util.getResultByArr(value, this.fiveBigShotsList, 'possessor')
                        break
                }
            },

            getFormByJson () {
                formGetJson ({ 'code': this.processModuleId }).then(res => {
                    if (res) this.jsonData = JSON.parse(res)
                })
            },

            echoData (data) {
                if (data.capitalSourceDicId) { data.capitalSourceDicId = util.splitData(data.capitalSourceDicId, ',') }
                if (data.fiveBigShotsId) { data.fiveBigShotsId = util.splitData(data.fiveBigShotsId, ',') }
                if (data.projectAddress) { data.projectAddress = util.splitData(data.projectAddress, ',') }
                if (data.projectCategoryDicId) { data.projectCategoryDicId = util.splitData(data.projectCategoryDicId, ',') }
                if (data.qualificationRequirementDicId) { data.qualificationRequirementDicId = util.splitData(data.qualificationRequirementDicId, ',') }
                if (data.sectionDicId) { data.sectionDicId = util.splitData(data.sectionDicId, ',') }
                return data
            },

            getIndex (id) {
                projectApplyQueryById ({'id': id}).then (res => {
                    if (res) {
                        res.projectRequested = parseInt(res.projectRequested)
                        res = this.echoData(res)
                        Object.assign (this.values, res)
                        this.fileDefaultNeaten (res)
                        this.prossValue.title = `自营项目报名申请:【 ${this.values.projectName} 】`
                        this.procInstId = res.procInstId ? res.procInstId : ''
                        this.canEdit = res.procInstId ? false : true
                    }
                })
            },

            prepareData (data) {
                if (data.capitalSourceDicId) { data.capitalSourceDicId = util.jointData(data.capitalSourceDicId, ',') }
                if (data.fiveBigShotsId) { data.fiveBigShotsId = util.jointData(data.fiveBigShotsId, ',') }
                if (data.projectAddress) { data.projectAddress = util.jointData(data.projectAddress, ',') }
                if (data.projectCategoryDicId) { data.projectCategoryDicId = util.jointData(data.projectCategoryDicId, ',') }
                if (data.qualificationRequirementDicId) { data.qualificationRequirementDicId = util.jointData(data.qualificationRequirementDicId, ',') }
                if (data.sectionDicId) { data.sectionDicId = util.jointData(data.sectionDicId, ',') }
                return data
            },

            saveIndex () {
                let url = '', boolean = {}
                let item = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && boolean && item) {
                        data = this.prepareData(data)
                        this.tempValues = Object.assign ( {}, this.values, data, item)
                        this.values.id == null ? url = projectApplyAdd : url = projectApplyEdit
                        url (this.tempValues).then (res => {
                            if (res) {
                                // this.values.id = res.id;
                                this.$message.success ('保存成功')
                                this.closePageTag ()
                            }
                        })
                    }
                })
            },

            submitIndexData () {
                let item = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && item) {
                        data = this.prepareData(data)
                        this.tempValues = Object.assign ( {}, this.values, data, item)
                        this.dialogVisible = true
                        this.prossValue = {
                            title: this.$route.params.title || `自营项目报名申请:【 ${data.projectName} 】`,
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.params.degree || '',
                            msg: '',
                        }
                    }
                })
            },

            updataIndex (item, boolean) {
                let url = ''
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.tempValues['completeTask'] = item
                boolean ? url = projectApplyReSubmit : url = projectApplySubmit
                url (this.tempValues).then (res => {
                    if (res.code === 200) {
                        this.canEdit = false
                        this.$message.success (res.message)
                        this.closePageTag ()
                    }
                })
            },

            consentIndex (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closePageTag ()
                    return
                }
                this.tempValues = this.prepareData(this.values)
                if (item) {
                    this.tempValues['completeTask'] = item
                    projectApplyOperation (this.tempValues).then (res => {
                        if (res.code === 200) {
                            this.$message.success (res.message)
                            this.tempValues['flag'] == '1' ? this.getSelfProjectHighestVersionData (this.tempValues.projectCode) : this.closePageTag ()
                        }
                    })
                }
            },

            getSelfProjectHighestVersionData (projectCode) {
                getSelfProjectHighestVersion ({'projectCode': projectCode}).then (res => {
                    this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformation', res)
                    this.closePageTag ()
                })
            },

            getQueryDicByIdList () {
                let list = [ PROPRIETARYPROJECTDICTIONARY.REGISTRATIONWAY, SELFPROHECT.CAPITALSOURCEDIC ]
                queryDicByIds (list).then (item => {
                    if (!item) return
                    this.applyWayList = item[PROPRIETARYPROJECTDICTIONARY.REGISTRATIONWAY]
                    this.capitalSourceList = item[SELFPROHECT.CAPITALSOURCEDIC]
                    this.setRemote()
                })
                getProjectAllOptions().then(res => {
                    this.projectCategoryList = res.projectType
                    this.qualificationList = res.aptitude
                    this.sectionList = res.section
                    this.projectManagerList = res.manager
                    this.technicalDirectorList = res.principal
                    this.aCertificateList = res.a
                    this.bCertificateList = res.b
                    this.cCertificateList = res.c
                    this.fiveBigShotsList = res.five
                    this.setRemote()
                })
            },

            setRemote () {
                this.remote = {
                    getProjectCategoryList (resolve) { resolve(than.projectCategoryList) },
                    getQualificationList (resolve) { resolve(than.qualificationList) },
                    getApplyWayList (resolve) { resolve(than.applyWayList) },
                    getBiddingCompanyList (resolve) { resolve(than.biddingCompanyList) },
                    getTechnicalDirectorList (resolve) { resolve(than.technicalDirectorList) },
                    getSectionList (resolve) { resolve(than.sectionList) },
                    getProjectManagerList (resolve) { resolve(than.projectManagerList) },
                    getACertificateList (resolve) { resolve(than.aCertificateList) },
                    getBCertificateList (resolve) { resolve(than.bCertificateList) },
                    getCCertificateList (resolve) { resolve(than.cCertificateList) },
                    getFiveBigShotsList (resolve) { resolve(than.fiveBigShotsList) },
                    getCapitalSourceList (resolve) { resolve(than.capitalSourceList) }
                }
            },

            getDepIdByUserIdList (id) {
                getUserDepartById({'userId': id}).then(res => {
                    if (res && res.length > 0) this.departmentList = res
                })
            },

            getDetailsList (taskId) {
                getDetails (taskId).then (res => { if (res) this.nodeData = res })
            },

            closePageTag () {
                let tagName = this.$route.path
                let path = ``
                if(this.stutas) {
                    path = `/approval/${this.stutas}`
                    this.close ({ tagName, path })
                } else {
                    this.transform.isShowDetails = true
                    this.showDetail = true
                }
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

            printTemplate () {
                getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.values.id}).then(res => {
                    if (res) this.$refs.printTemp.printTemplate (res)
                })
            },

            updataRouter () {
                if (this.$route.params) {
                    this.transform = this.$route.params.transform || { isShowDetails: false }
                    this.stutas = this.$route.params.pathName || ''
                    this.procInstId = this.$route.params.procInstId || ''
                }
                if (this.$route.params && this.$route.params.taskId) {
                    this.getDetailsList (this.$route.params.taskId)
                }
                if (this.$route.params && this.$route.params.relevancyId) {
                    this.getIndex (this.$route.params.relevancyId)
                } else {
                    projectApplyQueryByCode({ projectCode: this.proCode }).then(res => {
                        if (res.projectName) {
                            res.projectRequested = parseInt(res.projectRequested)
                            res = this.echoData(res)
                            Object.assign (this.values, res)
                            this.fileDefaultNeaten (res)
                            this.prossValue.title = `自营项目报名申请:【 ${this.values.projectName} 】`
                            this.procInstId = res.procInstId ? res.procInstId : ''
                            this.canEdit = res.procInstId ? false : true
                            if (!this.stutas) this.transform.isShowDetails = true
                        } else {
                            this.getProInfo()
                        }
                    })
                }
            },

            getProInfo () {
                selfQueryBaseMsgByCode({ code: this.proCode }).then(res => {
                    res = this.echoData(res)
                    this.values =  {
                        projectCode: res.projectCode,
                        projectName: res.projectName,
                        // qualificationRequirementDicId: res.qualificationRequirementDicId ? res.qualificationRequirementDicId : null,
                        // sectionDicId: res.sectionDicId ? res.sectionDicId : null,
                        projectCategoryDicId: res.projectCategoryDicId ? res.projectCategoryDicId : null,
                        projectAddress: res.projectAddress ? res.projectAddress : null,
                    }
                })
            }
        },

        async created () {
            const db = await this.$store.dispatch('d2admin/db/database', {user: true})
            this.proId = db.get('selfProID').value()
            this.proCode = db.get('selfProCode').value()
            than = this
            this.updataRouter ()
            this.getQueryDicByIdList ()
            this.getFormByJson ()
        },

        mounted () {
            
        },

        components: {
            'print-template-by-html': printTemplateByHtml,
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent,
            'up-load': upload,
            'bottomInformation': bottomInformation,
        }
    }
</script>

<style lang='scss'>
    .index {
        .files-upload___right {
            margin-left: 120px
        }
    }
</style>
