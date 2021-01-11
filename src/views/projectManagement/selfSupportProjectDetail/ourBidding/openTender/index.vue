<template>
    <d2-container type="fulls" class="index">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closePageTag('close')"><i class="el-icon-close"></i></el-button>
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
                            @on-change="selectGenerateChange">
                            <template slot="bidInfo">
                                <el-form ref="bidForm" :model="bidForm" class="bidForm" :rules="rulesForm" label-width="120px">
                                    <el-row>
                                        <el-col :span="8">
                                            <el-form-item label="是否中标" prop="isBid">
                                                <el-radio-group v-model="bidForm.isBid" @change="changeBid" :disabled='transform.isShowDetails'>
                                                    <el-radio label="1">是</el-radio>
                                                    <el-radio label="0">否</el-radio>
                                                </el-radio-group>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item label="公示中标时间:" prop="bidTime">
                                                <el-date-picker :disabled="bidSuccess" size="medium" v-model="bidForm.bidTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item label="公示中标价格:" prop="tenderPrice">
                                                <qqt-input v-model="bidForm.tenderPrice" :value="bidForm.tenderPrice" :isShowElement="!bidSuccess" 
                                                       :size='size' :isMoneyType="isMoneyType" :btnTitle="'元'"></qqt-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="8">
                                            <el-form-item label="公示投标工期:">
                                                <calcu-date :day="bidForm.biddingPeriod" :startTime="bidForm.bidTime" ref="calcuDate" :isWrite='bidSuccess'></calcu-date>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item label="商务标编制:" prop="businessAudit">
                                                <qqt-input :size='size' v-model="bidForm.businessAudit" :value="bidForm.businessAudit" :isShowElement="!bidSuccess" ></qqt-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item label="技术标编制" prop="technologyAudit">
                                                <qqt-input :size='size' v-model="bidForm.technologyAudit" :value="bidForm.technologyAudit" :isShowElement="!bidSuccess" ></qqt-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="8">
                                            <el-form-item label="预算编制" prop="budgetAudit">
                                                <qqt-input :size='size' v-model="bidForm.budgetAudit" :value="bidForm.budgetAudit" :isShowElement="!bidSuccess" ></qqt-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item label="开标负责人" prop="bidOpeningPrincipal">
                                                <qqt-input :size='size' v-model="bidForm.bidOpeningPrincipal" :value="bidForm.bidOpeningPrincipal" :isShowElement="!bidSuccess" ></qqt-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-form>
                            </template>
                            <template slot="proMember">
                                <qqt-project-member ref="memberRef" :isShowDetails="isShowDetails" :dataInfo="memberData"/>
                            </template>
                        </fm-generate-form>
                        <div>
                            <up-load id="male" @upLoadFileCallBack="upLoadFileCallBack" :isShowUpload="!transform.isShowDetails" :propList="upLoadFileDefaultList" ref="upLoad" />
                        </div>
                        <div>
                            <bottomInformation :values="values" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
                        </div>
                    </template>
                </qqt-flow-tabs>
            </div>
            <div class="qqt-container-full-content___button" v-if="canEdit">
                <el-button type="primary" @click="showEdit" v-if="showEditBtn">编辑</el-button>
                <el-button @click="closePageTag('close')">关闭</el-button>
            </div>
            <div class="qqt-container-full-content___button" v-else>
                <el-button type="warning" v-if="stutas == 'sendBack'" @click="isSendBack = true, values['flag'] = '1', submitIndexData ()">重新提交</el-button>
                <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <!-- <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button> -->
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveIndex">保存</el-button>
                <el-button type="primary" v-if="!transform.isShowDetails && procInstId === ''" @click="values['flag'] = '1', submitIndexData ()">提交</el-button>
                <el-button type="info" size="mini" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                <el-button @click="closePageTag('close')">关闭</el-button>
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataIndex"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentIndex" />
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </d2-container>
</template>

<script>
    import { selfProOpenTenderById, selfProOpenTenderEdit, selfProOpenTenderAdd, selfProOpenTenderSub, selfProOpenTenderReSub, 
        selfProOpenTenderOperation, selfProOpenTenderByProCode } from '@/api/selfProject/ourBidding/openTender/index'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, upload, qqtRelateTable, qqtInput } from '@/components/qqt-subassembly'
    import { selfQueryBaseMsgByCode, getSelfProjectHighestVersion } from '@/api/selfProject/allProject/index'
    import printTemplateByHtml from '../../../../systemManagement/printTemplate/components/printTemplateByHtml'
    import calcuDate from '../../../jontProjectDetail/projectCostCompositionCivision/components/calcuDate'
    import QqtProjectMember from "@/components/qqt-subassembly/qqt-projet-member/qqt-project-member"
    import bottomInformation from '../../businessBidding/components/bottomInformation'
    import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
    import { formGetJson } from '@/api/system/fromManagement/index'
    import { getProjectAllOptions } from '@/api/jointProject/index'
    import { getUserDepartById } from '@/api/system/depart/depart'
    import { PORJECT_INFO } from '@/enum/SELFPROJECT'
    import { CITYJSON } from '@/enum/CTIYS'
    import { SELFPROHECT } from '@/enum/DICTIONARY'
    import { queryDicById } from '@/api/system/dic/dic'
    import { getDetails } from '@/api/approval/common'
    import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
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
                remoteOption: {
                    citys: CITYJSON
                },
                values: {},
                jsonData: {},
                memberData: [],
                nodeData: {
                    operation: '',
                    msg: ''
                },
                transform: {
                    isShowDetails: false
                },
                bidSuccess: true,
                isShowDetails: false,
                size: 'medium',
                prossValue: {
                    title: ''
                },
                canEdit: false,
                showEditBtn: true,
                visible: false,
                isReject: false,
                isSendBack: false,
                isTurnManage: false,
                dialogVisible: false,
                code: BASICSCODE.SELF_BID_OPEN,
                processModuleId: PORJECT_INFO.SELFOPENTENDER,
                upLoadFileDefaultList: [],
                departmentList: [],
                dataOption: {},
                capitalSourceList: [],
                bidForm: {
                    isBid: '0',
                    bidTime: '',
                    tenderPrice: '',
                    biddingPeriod: 0,
                    businessAudit: '',
                    technologyAudit: '',
                    budgetAudit: '',
                    bidOpeningPrincipal: '',
                },
                rulesForm: {
                    isBid: [ { required: true, message: '请选择是否中标', trigger: ['change', 'blur']} ],
                    bidTime: [],
                    tenderPrice: [],
                    businessAudit: [],
                    technologyAudit: [],
                    budgetAudit: [],
                    bidOpeningPrincipal: [],
                },
                isMoneyType: true,
                proCode:  '',
                temValue: {},
            }
        },

        methods: {

            ...mapActions('d2admin/page', [
                'close',
            ]),

            showEdit () {
                this.canEdit = false
                this.transform = {
                    isShowDetails : false
                }
                this.isShowDetails = false
                this.bidSuccess = this.bidForm.isBid === '1' ? false : true
            },

            changeBid (val) {
                if (val === '1') {
                    this.rulesForm = {
                        isBid: [ { required: true, message: '请选择是否中标', trigger: ['change', 'blur']} ],
                        bidTime: [ { required: true, message: '请选择中标时间', trigger: ['change', 'blur']} ],
                        tenderPrice: [ { required: true, message: '请输入中标价格', trigger: ['change', 'blur']} ],
                        businessAudit: [ { required: true, message: '请输入商务标编制', trigger: ['change', 'blur']} ],
                        technologyAudit: [ { required: true, message: '请输入技术标编制', trigger: ['change', 'blur']} ],
                        budgetAudit: [ { required: true, message: '请输入预算编制', trigger: ['change', 'blur']} ],
                        bidOpeningPrincipal: [ { required: true, message: '请输入开标负责人', trigger: ['change', 'blur']} ],
                    }
                    this.bidSuccess = false
                } else {
                    this.rulesForm = {
                        isBid: [ { required: true, message: '请选择是否中标', trigger: ['change', 'blur']} ],
                        bidTime: [ ],
                        tenderPrice: [ ],
                        businessAudit: [ ],
                        technologyAudit: [ ],
                        budgetAudit: [ ],
                        bidOpeningPrincipal: [ ],
                    }
                    this.setBidFormNull()
                    this.bidSuccess = true
                }
            },

            setBidFormNull() {
                this.bidForm = {
                    isBid: '0',
                    bidTime: '',
                    tenderPrice: '',
                    biddingPeriod: 0,
                    businessAudit: '',
                    technologyAudit: '',
                    budgetAudit: '',
                    bidOpeningPrincipal: '',
                }
                if(this.$refs.bidForm){
                    this.$refs.bidForm.clearValidate()
                }
            },

            selectGenerateChange (field, value, model) {
                switch (field) {
                    case 'projectCategoryDicId':
                        model.projectCategoryDic = util.getResultByArr(value, this.dataOption.projectType, 'name')
                        break
                    case 'capitalSourceDicId':
                        model.capitalSourceDic = util.getResultByArr(value, this.capitalSourceList, 'name')
                        break
                    case 'sectionDicId':
                        this.values.sectionDic = util.getResultByArr(value, this.dataOption.section, 'name')
                        break
                    case 'qualificationRequirementDicId':
                        this.values.qualificationRequirementDic = util.getResultByArr(value, this.dataOption.aptitude, 'name')
                        break
                    case 'otherCompanyList':
                        this.values.otherCompanyList = value
                        break
                }
                this.values = Object.assign({} ,this.values, model)
            },

            getFormByJson () {
                formGetJson ({ 'code': this.processModuleId }).then(res => {
                    if (res) this.jsonData = JSON.parse(res)
                })
            },

            echoData (data) {
                data.tenderPrice = data.tenderPrice + ''
                this.memberData = util.isArray(data.memberList) ? data.memberList : []
                data.capitalSourceDicId = util.splitData(data.capitalSourceDicId, ',')
                data.projectAddress = util.splitData(data.projectAddress, ',')
                data.projectCategoryDicId = util.splitData(data.projectCategoryDicId, ',')
                data.qualificationRequirementDicId = util.splitData(data.qualificationRequirementDicId, ',')
                data.sectionDicId = util.splitData(data.sectionDicId, ',')
                data.biddingPeriod = parseInt(data.biddingPeriod)
                const { isBid, bidTime, tenderPrice, biddingPerio, businessAudit, biddingPeriod, technologyAudit, budgetAudit, bidOpeningPrincipal } = data
                this.bidForm = { isBid, bidTime, tenderPrice, biddingPerio, businessAudit, biddingPeriod, technologyAudit, budgetAudit, bidOpeningPrincipal }
                this.changeBid (isBid)
                return data 
            },

            getIndex (id) {
                selfProOpenTenderById ({'id': id}).then (res => {
                    if (res) {
                        res = this.echoData(res)
                        this.values = Object.assign ({}, this.values, res)
                        this.prossValue.title = `自营项目开标登记:【 ${this.values.projectName} 】`
                        this.fileDefaultNeaten (res)
                        this.getFormByJson ()
                        this.canEdit = false
                        if(res.procInstId) {
                            this.procInstId = res.procInstId
                            this.showEditBtn = false
                        }
                        this.bidSuccess = true
                    }
                })
            },

            prepareData(data) {
                data.projectCategoryDicId = util.jointData(data.projectCategoryDicId, ',')
                data.capitalSourceDicId = util.jointData(data.capitalSourceDicId, ',')
                data.sectionDicId = util.jointData(data.sectionDicId, ',')
                data.qualificationRequirementDicId = util.jointData(data.qualificationRequirementDicId, ',')
                data.projectAddress = util.jointData(data.projectAddress, ',')
                data.biddingPeriod = this.$refs.calcuDate.returnData()
                return data
            },

            saveIndex () {
                let url = ''
                let item = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData().then (data => {
                    if(data){
                        this.$refs.bidForm.validate((valid) => {
                            if ( item && valid) {
                                data = this.prepareData(data)
                                data.memberList = this.$refs.memberRef.getData()
                                this.temValue = Object.assign ({}, this.values, this.bidForm, data, item)
                                this.values.id == null ? url = selfProOpenTenderAdd : url = selfProOpenTenderEdit
                                url (this.temValue).then (res => {
                                    this.$message.success ('保存成功')
                                    this.updataRouter ()
                                    this.closePageTag ()
                                })
                            }
                        })
                    }
                })
            },

            submitIndexData () {
                let item = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    this.$refs.bidForm.validate((valid) => {
                        if (data && item && valid) {
                            data = this.prepareData(data)
                            data.memberList = this.$refs.memberRef.getData()
                            this.temValue = Object.assign ({}, this.values, this.bidForm, data, item)
                            this.dialogVisible = true
                            this.prossValue = {
                                title: this.$route.params.title || `自营项目开标登记:【 ${data.projectName} 】`,
                                pdfId: this.$route.params.procDefId || '',
                                degree: this.$route.params.degree || '',
                                msg: '',
                            }
                        }
                    })
                })
            },

            updataIndex (item, boolean) {
                let url = ''
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.temValue['completeTask'] = item
                boolean ? url = selfProOpenTenderReSub : url = selfProOpenTenderSub
                url (this.temValue).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closePageTag ('close')
                    }
                })
            },

            consentIndex (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closePageTag ()
                    return
                }
                if (item) {
                    this.temValue = this.prepareData(this.values)
                    this.temValue['completeTask'] = item
                    selfProOpenTenderOperation (this.temValue).then (res => {
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
                getProjectAllOptions().then(res => {
                    this.dataOption = res
                    this.setRemote()
                }).finally(() => {
                    queryDicById ({'id': SELFPROHECT.CAPITALSOURCEDIC}).then (item => {
                        if (item == null || item.length == 0) return
                        this.capitalSourceList = item
                        this.setRemote()
                    })
                })
            },
            
            setRemote () {
                this.remote = {
                    sectionDicList (resolve) { resolve(than.dataOption.section) },
                    getProjectCategoryList (resolve) { resolve(than.dataOption.projectType) },
                    getQualificationRequireList (resolve) { resolve(than.dataOption.aptitude) },
                    getCapitalSourceList (resolve) { resolve(than.capitalSourceList) },
                }
            },

            getDetailsList (taskId) {
                getDetails (taskId).then (res => { if (res) this.nodeData = res })
            },

            closePageTag (type) {
                let tagName = this.$route.path
                let path = ``
                if (this.stutas) {
                    path = `/approval/${this.stutas}`
                    this.close ({ tagName, path })
                } else if (type === 'close') {
                    this.$router.go(-1)
                    this.close ({ tagName })
                } else {
                    this.transform.isShowDetails = true
                    this.showDetail = true
                    this.canEdit = true
                    this.bidSuccess = true
                    this.isShowDetails = true
                }
            },

            upLoadFileCallBack (item) {
                this.values.fileList = item
            },

            fileDefaultNeaten (res) {
                this.upLoadFileDefaultList = [];
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
                    this.transform = this.$route.params.transform || {}
                    this.stutas = this.$route.params.pathName || ''
                    this.procInstId = this.$route.params.procInstId || ''
                }
                if (this.$route.params && this.$route.params.taskId) {
                    this.getDetailsList (this.$route.params.taskId)
                    this.canEdit = false
                }
                if (this.$route.params && this.$route.params.relevancyId) {
                    this.getIndex (this.$route.params.relevancyId)
                } else {
                    selfProOpenTenderByProCode({ projectCode: this.proCode }).then(res => {
                        if (res.projectName) {
                            res = this.echoData(res)
                            this.values = Object.assign ({}, this.values, res)
                            this.getFormByJson ()
                            if(res.procInstId) {
                                this.procInstId = res.procInstId
                                this.showEditBtn = false
                                this.transform.isShowDetails = this.isShowDetails = true
                            }
                            this.prossValue.title = `自营项目开标登记:【 ${this.values.projectName} 】`
                            this.fileDefaultNeaten (res)
                            this.bidSuccess = true
                        } else {
                            this.getProInfo()
                        }
                    })
                }
            },

            getProInfo () {
                selfQueryBaseMsgByCode({ code: this.proCode }).then(res => {
                    const { projectCode, projectName, capitalSourceDicId, capitalSourceDic, projectAddress, projectCategoryDicId, projectTypeDicId, } = res
                    this.values = Object.assign({} ,this.values, {
                        projectCode: projectCode,
                        projectName: projectName,
                        capitalSourceDic: capitalSourceDic,
                        capitalSourceDicId: util.isArray(capitalSourceDicId) ? capitalSourceDicId : util.splitData(capitalSourceDicId, ','),
                        projectAddress: util.isArray(projectAddress) ? projectAddress : util.splitData(projectAddress, ','),
                        projectCategoryDicId: util.isArray(projectCategoryDicId) ? projectCategoryDicId : util.splitData(projectCategoryDicId, ','),
                        projectTypeDicId: util.isArray(projectTypeDicId) ? projectTypeDicId : util.splitData(projectTypeDicId, ','),
                    })
                    this.getFormByJson ()
                })
            }
        },

        async created () {
            const db = await this.$store.dispatch('d2admin/db/database', {user: true})
            // this.proCode = db.get('selfProCode').value()
            if (this.$route.params.detailData) {
                this.stutas = this.$route.params.pathName || ''
                this.procInstId = this.$route.params.procInstId || ''
                this.transform.isShowDetails = this.$route.params.transform.isShowDetails
                this.isShowDetails =  this.$route.params.transform.isShowDetails
            } else {
                this.proCode = db.get('selfProCode').value()
                this.transform.isShowDetails = false
                this.isShowDetails = false
            }
            this.updataRouter ()
            this.getQueryDicByIdList()

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
            'qqt-input': qqtInput,
            'qqt-project-member': QqtProjectMember,
            'calcu-date': calcuDate,
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
.bidForm{
    .el-form-item{
        margin-bottom: 22px;
    }   
}
</style>
