<template>
    <d2-container type="fulls" class="newStage">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
            </div>
            <div class="qqt-container-full-center___top">
                <qqt-flow-tabs :procInstId="procInstId">
                    <template slot="content">
                        <fm-generate-form 
                            :data="proInfoJsonData"
                            :remote="remote"
                            :remoteOption="remoteOption"
                            :value="proInfoValues"
                            :transform="transform"
                            ref="proInfoForm"
                            @on-change="selectGenerateChange">
                        </fm-generate-form>
                        <fm-generate-form 
                            :data="jsonData"
                            :remote="remote"
                            :value="values"
                            :remoteOption="remoteOption"
                            :transform="transform"
                            ref="generateForm"
                            @on-change="selectGenerateChange">
                            <template slot="fileUpLoad">
                                <up-load :isShowUpload="!transform.isShowDetails" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList" ref="upload"/>
                            </template>
                        </fm-generate-form>
                        <!-- <bottom-information ref="bottomInfo" :transform='transform' :upLoadFileDefaultList='upLoadFileDefaultList' :values='values' :left="marginLeft"></bottom-information> -->
                        <el-row>
                            <bottomInformation :values="values" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
                        </el-row>
                    </template>
                </qqt-flow-tabs>
            </div>
            <div class="qqt-container-full-content___button">
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitNewStageData ()">重新提交</el-button>
                <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveNewStage">保存</el-button>
                <el-button type="primary" v-if="!transform.isShowDetails && procInstId === ''" @click="values['flag'] = '1', submitNewStageData ()">提交</el-button>
                <el-button type="info" size="mini" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                <el-button @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataNewStage"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentNewStage" />
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </d2-container>
</template>

<script>
import { getNewStageById, editNewStage,
    addNewStage, submitNewStage, completeNewStage, resetSubmitNewStage } from '@/api/selfProject/earlyStage/index'
import { selfProjectQueryById, getSelfProjectHighestVersion } from '@/api/selfProject/allProject/index'
import { qqtSendProcess, qqtFlowTabs, qqtConsent, upload, qqtRelateTable } from '@/components/qqt-subassembly'
import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
import { formGetJson } from '@/api/system/fromManagement/index'
import { getUserDepartById } from '@/api/system/depart/depart'
import { PROPRIETARYPROJECT } from '@/enum/FORMCODE'
import { queryDicByIds } from '@/api/system/dic/dic'
import { getDetails } from '@/api/approval/common'
import { SELFPROHECT } from '@/enum/DICTIONARY'
import { mapActions } from 'vuex'
import { CITYJSON } from '@/enum/CTIYS'
import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
import { PROJECT_GETINFOID } from '@/enum/PROJECT'
import { PORJECT_INFO } from '../../../../../enum/SELFPROJECT'
import bottomInformation from '../../businessBidding/components/bottomInformation'
import printTemplateByHtml from '../../../../systemManagement/printTemplate/components/printTemplateByHtml'
import util from '@/libs/util.js'
let than = this
export default {

    data () {
        return {
            proCode: '',
            marginLeft: '120px',
            title: '',
            stutas: '',
            procInstId: '',
            remote: {},
            remoteOption: {
                getProjectAddress: CITYJSON,
                wayDicIdOption: [
                    { value: '电话联系' }, { value: '微信联系' },
                    { value: '办公室拜访' }, { value: '家中拜访' },
                    { value: '餐食茶饮' }, { value: '其它方式' },
                ],
                tailResultOption: [
                    { id: '1', value: '优质' }, { id: '2', value: '良好' },
                    { id: '3', value: '一般' }, { id: '4', value: '不好' },
                    { id: '5', value: '较差' },
                ]
            },
            values: {},
            proInfoValues: {},
            jsonData: {},
            proInfoJsonData: {},
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
            code: BASICSCODE.SELF_TRACE_MESSAGE,
            processModuleId: PORJECT_INFO.EARLYSTAGEADD,
            upLoadFileDefaultList: [],
            
            // 下拉数据
            projectStageList: [],
            projectGradingList: [],
            departmentList: [],
            sourceList: [],
            projectTypeList: [],
            areaList: [],
            createPatternList: [],
            capitalSourceList: [],
        }
    },

    methods: {

        ...mapActions('d2admin/page', [
            'close',
        ]),
        selectGenerateChange (field, value, model) {
            switch (field) {
                case 'projectStageDicId':
                    // 项目当前阶段
                    let stageTem = this.projectStageList.find(el => el.id === value)
                    if (stageTem) { this.values.projectStageDic = stageTem.name }
                    break
                case 'projectGradingDicId':
                    // 当前等级划分
                    let gradingTem = this.projectGradingList.find(el => el.id === value)
                    if (gradingTem) { this.values.projectGradingDic = gradingTem.name }
                    break
            }
            this.values[field] = value
        },
        getFormByJson () {
            formGetJson ({ 'code': this.processModuleId }).then(res => {
                if (res) this.jsonData = JSON.parse(res)
            })
            formGetJson ({ code: PORJECT_INFO.SELFPROJECTBASICINFO }).then(res => {
                if (res) this.proInfoJsonData = JSON.parse(res)
            })
        },

        getNewStage (id) {
            getNewStageById ({'id': id}).then (res => {
                
                if (res) {
                    this.values = res
                    this.setProInfo(res.projectCreate)
                    this.prossValue.title = `流程自营项目前期跟踪名称:【 ${this.values.projectCreate.projectName} 】`
                    this.fileDefaultNeaten (res)
                }
            })
        },

        setProInfo (data) {
            data.predictInvestLimit = data.predictInvestLimit + ''
            data.projectCategoryDicId = util.splitData(data.projectCategoryDicId, ',')
            data.projectAddress = util.splitData(data.projectAddress, ',')
            data.capitalSourceDicId = util.splitData(data.capitalSourceDicId, ',')
            this.proInfoValues = data
        },

        prepareData (data) {
            let temp1 = this.sourceList.find(el => el.id === data.sourceDicId)
            data.sourceDicName = temp1 ? temp1.name : ''
            let temp2 = this.projectTypeList.find(el => el.id === data.projectTypeDicId)
            data.projectTypeDic = temp2 ? temp2.name : ''
            let ids = ''
            data.projectCategoryDic = ''
            data.projectCategoryDicId.forEach(item => {
                let temp3 = this.projectTypeList.find(el => el.id === item)
                data.projectCategoryDic += temp3 ? temp3.name + ',' : ''
                ids += item + ','
            })
            data.projectCategoryDic = data.projectCategoryDic.substring(0, data.projectCategoryDic.length - 1)
            data.projectCategoryDicId = ids.substring(0, ids.length - 1)
            let temp4 = this.createPatternList.find(el => el.id === data.createPatternDicId)
            data.createPatternDic = temp4 ? temp4.name : ''
            let ids1 = ''
            data.capitalSourceDic = ''
            data.capitalSourceDicId.forEach(item => {
                let temp5 = this.capitalSourceList.find(el => el.id === item)
                data.capitalSourceDic += temp5 ? temp5.name + ',' : ''
                ids1 += item + ','
            })
            data.capitalSourceDic = data.capitalSourceDic.substring(0, data.capitalSourceDic.length - 1)
            data.capitalSourceDicId = ids1.substring(0, ids1.length - 1)

            data.projectAddress = util.jointData(data.projectAddress, ',')
            return data
        },

        saveNewStage () {
            let url = '', boolean = {}
            let bottomInfo = this.$refs.bottomInformation.getData()
            this.$refs.proInfoForm.getData().then(proInfo => {
                this.$refs.generateForm.getData ().then (data => {
                    if (data && boolean && bottomInfo && proInfo) {
                        Object.assign(this.values, data, bottomInfo)
                        this.values.projectCode = this.proCode
                        proInfo = this.prepareData(proInfo)
                        this.values.projectCreate = Object.assign({}, this.proInfoValues, proInfo ) 
                        this.values.id == null ? url = addNewStage : url = editNewStage
                        url (this.values).then (res => {
                            if (res.code === 200) {
                                this.$message.success ('保存成功')
                                this.closePageTag ()
                            }
                        })
                    }
                })
            })
        },

        submitNewStageData () {
            let bottomInfo = this.$refs.bottomInformation.getData()
            this.$refs.proInfoForm.getData().then(proInfo => {
                this.$refs.generateForm.getData ().then (data => {
                    if (data && bottomInfo && proInfo) {
                        Object.assign(this.values, data, bottomInfo)
                        this.values.projectCode = this.proCode
                        proInfo = this.prepareData(proInfo)
                        this.values.projectCreate = Object.assign({}, this.proInfoValues, proInfo)
                        this.dialogVisible = true
                        this.prossValue = {
                            title: this.$route.params.title || `自营项目前期跟踪:【 ${proInfo.projectName} 】`,
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.params.degree || '',
                            msg: '',
                        }
                    }
                })
            })
        },

        updataNewStage (item, boolean) {
            let url = ''
            this.dialogVisible = this.isSendBack = false
            item['taskId'] = this.$route.params.taskId || ''
            this.values['completeTask'] = item
            boolean ? url = resetSubmitNewStage : url = submitNewStage
            url (this.values).then (res => {
                if (res.code === 200) {
                    this.$message.success (res.message)
                    this.closePageTag ()
                }
            })
        },

        consentNewStage (item = '', boolean = false) {
            this.visible = this.isTurnManage = this.isReject = false
            if (boolean) {
                this.closePageTag ()
                return
            }
            if (item) {
                this.values['completeTask'] = item
                this.values.projectCreate = this.prepareData(this.proInfoValues)
                completeNewStage (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.values['flag'] == '1' ? this.getSelfProjectHighestVersionData (this.values.projectCode) : this.closePageTag ()
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
            let list = [ SELFPROHECT.PROJECTSTAGEDICLIST, SELFPROHECT.PROJECTGRADINGDICLIST,
                SELFPROHECT.SOURCEDICNAME, PROJECT_GETINFOID.PROTYPE, SELFPROHECT.SELFPROJECTAREA,
                SELFPROHECT.CREATEPATTERNDIC, SELFPROHECT.CAPITALSOURCEDIC ]
            queryDicByIds (list).then (item => {
                if (!item) return
                this.projectGradingList = item[SELFPROHECT.PROJECTGRADINGDICLIST]
                this.projectStageList = item[SELFPROHECT.PROJECTSTAGEDICLIST]
                this.projectTypeList = item[PROJECT_GETINFOID.PROTYPE]
                this.sourceList = item[SELFPROHECT.SOURCEDICNAME]
                this.areaList = item[SELFPROHECT.SELFPROJECTAREA]
                this.createPatternList = item[SELFPROHECT.CREATEPATTERNDIC]
                this.capitalSourceList = item[SELFPROHECT.CAPITALSOURCEDIC]
                this.setRomte()
            })
        },

        setRomte () {
            this.remote = {
                getProjectStageDicId (resolve) { resolve(than.projectStageList) },
                getProjectGradingDicId (resvole) { resvole(than.projectGradingList) },
                getSourceList (resolve) { resolve(than.sourceList) },
                getProjectTypeList (resolve) { resolve(than.projectTypeList) },
                getProjectCategoryDic (resolve) { resolve(than.projectTypeList) },
                getAreaList (resolve) { resolve(than.areaList) },
                getCreatePatternList (resolve) { resolve(than.createPatternList) },
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
            this.$router.go(-1)
            let tagName = this.$route.path
            this.close ({ tagName })
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
        
        getSelfProjectInfo () {
            selfProjectQueryById({id: this.proId}).then(res => {
                delete res.fileId
                delete res.fileList
                delete res.id
                delete res.ownerList
                delete res.teamList
                delete res.createBy
                delete res.createName
                delete res.createTime
                delete res.companyId
                delete res.version
                delete res.team
                delete res.procInstId
                delete res.procState
                res.predictInvestLimit = res.predictInvestLimit + ''
                this.proCode = res.projectCode
                this.setProInfo(res)
            })
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
                this.getNewStage (this.$route.params.relevancyId)
            } else {
                this.getSelfProjectInfo()
                this.getDepIdByUserIdList (util.cookies.get ('uuid'))
            }
        }
    },

    async created () {
        const db = await this.$store.dispatch('d2admin/db/database', {user: true})
        this.proId = db.get('selfProID').value()
        this.proCode = db.get('selfProCode').value()
        this.getFormByJson ()
        this.updataRouter ()
        this.getQueryDicByIdList ()
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
    .newStage {
        .files-upload___right {
            margin-left: 120px
        }
    }
</style>
