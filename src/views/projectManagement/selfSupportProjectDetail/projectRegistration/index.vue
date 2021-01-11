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
                            ref="generateForm"
                            :data="jsonData"
                            :remote="remote"
                            :remoteOption="remoteOption"
                            :value="values"
                            :transform="transform"
                            @on-change="selectGenerateChange">
                        </fm-generate-form>
                        <div class="files-upload___right">
                            <up-load id="male" @upLoadFileCallBack="upLoadFileCallBack" :isShowUpload="!transform.isShowDetails" :propList="upLoadFileDefaultList" ref="upLoad" />
                        </div>
                        <bottomInformation :values="values" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
                    </template>
                </qqt-flow-tabs>
            </div>
            <div class="qqt-container-full-content___button" v-if="showDetail &&  (stutas != 'sendBack' && stutas != 'backlog'&& stutas != 'examine') ">
                <el-button type="warning" @click="editInfo('1')" v-if="canEdit && !stutas">编辑</el-button>
                <el-button type="info" size="mini" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                <el-button @click="editInfo('0')">关闭</el-button>
            </div>
            <div class="qqt-container-full-content___button" v-else>
                <el-button type="warning" v-if="(stutas == 'sendBack' || stutas == 'examine') && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitIndexData ()">重新提交</el-button>
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
    import { selfApprovalQuery, approvalEdit, approvalEditQueryByCode,
        approvalAdd, approvalSubmit, approvalOperation, approvalResubmit } from '@/api/selfProject/projectRegistration/index'
    import { selfProjectQueryById, getSelfProjectHighestVersion } from '@/api/selfProject/allProject/index'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, upload, qqtRelateTable } from '@/components/qqt-subassembly'
    import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
    import { formGetJson } from '@/api/system/fromManagement/index'
    import { staffStaffDictionary } from '@/api/system/staff/staff'
    import { getUserDepartById } from '@/api/system/depart/depart'
    import { CITYJSON } from '@/enum/CTIYS'
    import { PROJECT_GETINFOID } from '@/enum/PROJECT'
    import { PORJECT_INFO } from '@/enum/SELFPROJECT'
    import { queryDicByIds } from '@/api/system/dic/dic'
    import { getDetails } from '@/api/approval/common'
    import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
    import { mapActions } from 'vuex'
    import bottomInformation from '../businessBidding/components/bottomInformation'
    import printTemplateByHtml from '../../../systemManagement/printTemplate/components/printTemplateByHtml'
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
                    projectLocationList: CITYJSON,
                    typeList: [
                        { value: '建设单位', name: '建设单位' },
                        { value: '勘察单位', name: '勘察单位' },
                        { value: '设计单位', name: '设计单位' },
                        { value: '监理单位', name: '监理单位' },
                        { value: '施工单位', name: '施工单位' },
                        { value: '其它单位', name: '其它单位' },
                    ],
                    userList: []
                },
                values: {
                    projectName: '',
                    projectCode: '',
                    projectCategoryDicId: [],
                    projectLocation: [],
                    sectionDicId:'',
                    businessAudit:'',
                    technologyAudit:'',
                    budgetAudit:'',
                    financePrincipal:'',
                    managerPrincipal:'',
                },
                jsonData: {},
                nodeData: {
                    operation: '',
                    msg: ''
                },
                transform: {
                    isShowDetails: true
                },
                showDetail: true,
                prossValue: {
                    title: ''
                },
                visible: false,
                isReject: false,
                isSendBack: false,
                isTurnManage: false,
                dialogVisible: false,
                code: BASICSCODE.SELF_APPROVAL,
                processModuleId: PORJECT_INFO.SELFPROJECTREGISTRATION,
                upLoadFileDefaultList: [],
                departmentList: [],
                sectionList: [], // 标段
                projectCategoryList: [], // 工程类别
                proId: '',
                proCode: '',

                temValue: {},
                canEdit: true,
            }
        },

        methods: {

            ...mapActions('d2admin/page', [
                'close',
            ]),

            selectGenerateChange (field, value, model) {
                let item = {}
                switch (field) {
                    case 'managerPrincipalId':
                        this.values['managerPrincipalId'] = value
                        item = this.remoteOption.userList.find (f => f.id == value)
                        if (item) this.values['managerPrincipal'] = item.name
                        break
                    case 'financePrincipalId':
                        this.values['financePrincipalId'] = value
                        item = this.remoteOption.userList.find (f => f.id == value)
                        if (item) this.values['financePrincipal'] = item.name
                        break
                    case 'openTime':
                    case 'bidTime':
                        this.values[field] = value
                        if (this.values.openTime && this.values.bidTime) {
                            let start = new Date (this.values.openTime)
                            let end = new Date (this.values.bidTime)
                            if (start > end) {
                                this.$message.warning ('开标时间不能大于中标时间')
                                if (field == 'bidTime') {
                                    this.values.openTime = ''
                                } else {
                                    this.values.bidTime = ''
                                }
                            }
                        }
                        break
                    default:
                        this.values[field] = value
                        break
                }
                
            },
            
            editInfo (type) {
                if(type === '1' ) {
                    this.transform = {
                        isShowDetails: false
                    } 
                    this.showDetail = false
                } else {
                    let tagName = this.$route.path;
                    this.close ({ tagName });
                    this.$router.go(-1);
                }
            },

            getFormByJson () {
                formGetJson ({ 'code': this.processModuleId }).then(res => {
                    if (res) this.jsonData = JSON.parse(res)
                })
            },

            getIndex (id) {
                selfApprovalQuery ({'id': id}).then (res => {
                    if (res) {
                        this.echoData(res)
                        this.prossValue.title = `自营项目立项登记:【 ${this.values.projectName} 】`
                        this.fileDefaultNeaten (res)
                    }
                })
            },

            setData (data) {
                data['projectCategoryDic'] = []
                data.projectCategoryDicId.forEach(item => {
                    let temp = this.projectCategoryList.find(el => el.id === item)
                    data.projectCategoryDic.push(temp.name)
                })
                data.projectCategoryDic = util.jointData(data.projectCategoryDic, ',')
                data.projectCategoryDicId = util.jointData(data.projectCategoryDicId, ',')
                data['sectionDic'] = []
                data.sectionDicId.forEach(item => {
                    let temp = this.sectionList.find(el => el.id === item)
                    data.sectionDic.push(temp.name)
                })
                data.sectionDic = util.jointData(data.sectionDic, ',')
                data.sectionDicId = util.jointData(data.sectionDicId, ',')
                data.projectLocation = util.jointData(data.projectLocation, ',')
                return data
            },

            saveIndex () {
                let url = ''
                let item = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data.sectionDicId.length !== 0 && data.projectCategoryDicId.length !== 0 && data.openTime !=  null && data.openTime !=  '' && data.bidTime !=  null && data.bidTime !=  '' && data.bidDeadline !=  null && data.bidDeadline !=  '' && data.createContent !=  null && data.createContent !=  '' && data.businessAudit !=  null && data.businessAudit !=  '' && data.technologyAudit !=  null && data.technologyAudit !=  '' && data.budgetAudit !=  null && data.budgetAudit !=  '' && data.financePrincipalId !=  null && data.financePrincipalId !=  '' && data.managerPrincipalId !=  null && data.managerPrincipalId !=  '') {
                        data = this.setData (data)
                        Object.assign (this.values, data, item)
                        this.values.id == null ? url = approvalAdd : url = approvalEdit
                        url (this.values).then (res => {
                            than.$message.success ('保存成功')
                            than.editInfo ('0')
                        })
                    } else {
                        this.$message.error('项目必填项请补充完整')
                    }
                    return
                })
            },

            submitIndexData () {
                let item = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && item) {
                        data = this.setData (data)
                        Object.assign (this.temValue, this.values, data, item)
                        this.dialogVisible = true
                        this.prossValue = {
                            title: this.$route.params.title || `自营项目立项登记:【 ${data.projectName} 】`,
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
                this.temValue['completeTask'] = item
                boolean ? url = approvalResubmit : url = approvalSubmit
                url (this.temValue).then (res => {
                    this.$message.success (res.message)
                    this.editInfo ('0')
                })
            },

            consentIndex (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closePageTag ()
                    return
                }
                this.temValue = this.values
                this.temValue = this.setData(this.temValue)
                if (item) {
                    this.temValue['completeTask'] = item
                    approvalOperation (this.temValue).then (res => {
                        if (res.code === 200) {
                            this.$message.success (res.message)
                            this.temValue['flag'] == '1' ? this.getSelfProjectHighestVersionData (this.temValue.projectCode) : this.closePageTag ()
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
                let list = [PROJECT_GETINFOID.PROTYPE, PROJECT_GETINFOID.SECTION]
                queryDicByIds (list).then (item => {
                    if (!item) return
                    this.projectCategoryList = item[PROJECT_GETINFOID.PROTYPE]
                    this.sectionList = item[PROJECT_GETINFOID.SECTION]
                    this.setRemote()
                })
            },

            getStaffStaffDictionary () {
                staffStaffDictionary ().then(res => {
                    if (res && res.length > 0) {
                        this.remoteOption.userList = res
                    }
                })
            },

            setRemote() {
                this.remote = {
                    getSectionList (resolve) { resolve(than.sectionList) },
                    getProjectCategoryList (resolve) { resolve(than.projectCategoryList) }
                }
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
                console.log(item);
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

            getSelfProjectInfo () {
                selfProjectQueryById({id: this.proId}).then(res => {
                    this.values.projectName = res.projectName
                    this.values.projectCode = res.projectCode
                    if (res.projectCategoryDicId) {
                        this.values.projectCategoryDicId = util.splitData(res.projectCategoryDicId, ',')
                    }
                    if (res.projectAddress) {
                        this.values.projectLocation = util.splitData(res.projectAddress, ',')
                    }
                })
            },

            echoData (data) {
                data.sectionDicId = data.sectionDicId ? util.splitData(data.sectionDicId, ',') : []
                data.projectLocation = data.projectLocation ? util.splitData(data.projectLocation, ',') : []
                data.projectCategoryDicId = data.projectCategoryDicId ? util.splitData(data.projectCategoryDicId, ',') : []
                data.bidDeadline = data.bidDeadline ? parseInt(data.bidDeadline) : null
                data.participationUnitList = data.participationUnitList ? data.participationUnitList : []
                if (data.procInstId != '') this.transform.isShowDetails = this.showDetail = true
                this.values = data
                this.getFormByJson ()
            },

            printTemplate () {
                getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.values.id}).then(res => {
                    if (res) this.$refs.printTemp.printTemplate (res)
                })
            },

            async updatarouter () {
                if (this.$route.params) {
                    this.transform = this.$route.params.transform || { isShowDetails: false }
                    this.stutas = this.$route.params.pathName || ''
                    this.procInstId = this.$route.params.procInstId || ''
                }
                if (this.$route.params && this.$route.params.taskId) {
                    this.getDetailsList (this.$route.params.taskId)
                }
                this.showDetail = false
                if (this.$route.params && this.$route.params.relevancyId) {
                    this.getIndex (this.$route.params.relevancyId)
                } else {
                    const db = await this.$store.dispatch('d2admin/db/database', {user: true})
                    this.proId = db.get('selfProID').value()
                    this.proCode = db.get('selfProCode').value()
                    approvalEditQueryByCode({projectCode: this.proCode}).then(res => {
                        if (res.projectName) {
                            // 已经立项
                            this.echoData(res)
                            this.fileDefaultNeaten (res)
                            this.canEdit = res.procInstId ? false : true
                            this.procInstId = res.procInstId || ''
                        } else {
                            this.getSelfProjectInfo()
                            this.getFormByJson ()
                        }
                    })
                    
                }
            }
        },

        created () {
            this.updatarouter ()
            this.getQueryDicByIdList ()
            this.getStaffStaffDictionary ()
        },

        mounted () {
            than = this
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
