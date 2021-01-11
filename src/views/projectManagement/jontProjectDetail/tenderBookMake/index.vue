<template>
    <d2-container class="address-book open-tender">
     <el-dialog v-dialogDrag title="提示" :visible.sync="hint" width="30%" :close-on-click-modal="false" :before-close="hintClose">
        <div style="text-align:center;">
            <img src="../components/img/mark.png">
            <p style="color:red;text-align:center;font-size:18px;">此项目尚未进行报名登记！</p>
        </div>
        <span slot="footer" class="dialog-footer" style="text-align:center;padding-left:40px;display:block;">
            <el-button size="mini" @click="hintClose" style="margin-right:20px;">留在此页面</el-button>
            <el-button size="mini" type="primary" @click="hintEnter">去报名登记</el-button>
        </span>
    </el-dialog>
    <el-card class="box-card">
        <div v-if="fromProcess">
            <qqt-flow-tabs v-if="tabShow" :procInstId="procInstId" :isProcessInstance='isProcessInstance' :pdfId="pdfId">
                <template slot="content">
                    <el-card :body-style="{ padding: '20px' }">
                    <fm-generate-form
                        :data="jsonData"
                        :remote="remoteFuncs"
                        :value="values"
                        :remoteOption="remoteOption"
                        :transform="transform"
                        @on-change="valueChange"
                        ref="generateForm"/>
                    <el-divider>项目部组成人员</el-divider>
                        <qqt-project-member ref="memberRef" :isShowDetails="isShowDetails" :dataInfo="memberData"/>
                    <el-divider>附件</el-divider>
                    <up-load :isShowUpload="!transform.isShowDetails" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList" ref="upload"/>
                    <bottomInformation :values="values" :isGrid="false" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
                    <el-row>
                        <el-col :span="24" style="text-align:center" class="d2-mt-20">
                            <el-button size="small" type="primary" v-if="backlog"  @click="consentFun">同意</el-button>
                            <el-button size="small" type="primary" v-if="isSendBack" @click="anewSubmitBtn">重新提交</el-button>
                            <el-button size="small" type="warning" v-if="btnList.indexOf('1') != -1 && backlog" @click="turnToFun">转办</el-button>
                            <el-button size="small" type="success" v-if="btnList.indexOf('2') != -1 && backlog" plain @click="returnBtn">驳回</el-button>
                            <el-button size="small" type="info" v-if="btnList.indexOf('3') != -1 && backlog" @click="invalidBtn">作废</el-button>
                            <el-button size="small" type="info" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                            <el-button size="small" type="primary" v-if="backlog" plain @click="closeTab">取消</el-button>
                            <el-button size="small" type="primary" v-if="!backlog" @click="closeTab">关闭</el-button>
                        </el-col>
                    </el-row>
                    </el-card>
                </template>
            </qqt-flow-tabs>
            <el-dialog v-dialogDrag title="驳回" :visible.sync="rejectShow" width="30%" >
                <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                    <el-form-item label="驳回节点：" prop="rejectVal">
                        <el-select v-model="form.rejectVal"  placeholder="" >
                            <el-option v-for="item in returnList" :key="item.activityId" :label="item.name" :value="item.activityId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="驳回理由：" prop="paymessage">
                        <el-input type="textarea" :rows="2" placeholder="请输入驳回理由" v-model="form.paymessage"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer">
                    <el-button type="primary" @click="rejectOk">确 定</el-button>
                    <el-button @click="rejectCancel">取 消</el-button>
                </span>
            </el-dialog>
         </div>
        <div v-if="!fromProcess">
            <fm-generate-form
                :data="jsonData"
                :remote="remoteFuncs"
                :value="values"
                :transform="transform"
                :remoteOption="remoteOption"
                @on-change="valueChange"
                ref="generateForm"/>
            <el-divider>项目部组成人员</el-divider>
                <qqt-project-member ref="memberRef" :isShowDetails="isShowDetails" :dataInfo="memberData"/>
            <el-divider>附件</el-divider>
            <up-load :isShowUpload="!transform.isShowDetails" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList" ref="upload"/>
            <bottomInformation :values="values" :isGrid="false" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
            <div v-if="showSubBtn">
                <div class="drawer-btn" v-if="transform.isShowDetails">
                    <el-button size="small" type="info" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                    <el-button type="primary" size="small" @click="editInfo" v-if="$has('joint:tenderMake:edit')">编辑</el-button>
                </div>
                <div class="drawer-btn" v-if="!transform.isShowDetails">
                    <el-button type="primary" size="small" @click="subNewPro">保存</el-button>
                    <el-button type="warning" size="small" @click="subProcess" v-if="$has('joint:tenderMake:submin')">提交</el-button>
                    <el-button size="small" @click="cancel">取消</el-button>
                </div>
            </div>
        </div>
    </el-card>
    <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    <user-modules :showDialog="isShow" :userIds="user" :department="department" @clearUserPage="clearUserPage" @closeFun="isShow = false"></user-modules>
    <qqt-send-process v-if="dialogVisible" :isSendBack='isSendBack' :dialogVisible="dialogVisible" :prossValue="prossValue" :processModuleId="processModuleId" @close="closeFun" @selectData="selectDataFun"></qqt-send-process>
    <qqt-consent :dialogVisible="visible" :title="title" :taskId="taskId || ''" :type="consent['flag']" :isTurnManage="isTurnManage" :isReject="isReject" @close="consentBorrowingApply" />
    </d2-container>
</template>
<script>
import { formGetJson } from '../../../../api/system/fromManagement/index'
import { qqtFlowDiagram,qqtFlowTabs, upload, qqtConsent} from '../../../../components/qqt-subassembly'
import { getTenderBookById, getTenderMakeEdit,tenderMakeSubmit,tenderMakeOperation,getProjectAllOptions} from '../../../../api/jointProject/index'
import { postRegistrationCreateFile } from '../../../../api/administrativeManagement/documentManagement/postRegistration'
import { queryDicById } from '../../../../api/system/dic/dic'
import { qqtSendProcess } from '@/components/qqt-subassembly'
import userModules from '../../../systemManagement/processDefinition/processModules/userModules'
import { PORJECT_INFO, PROJECT_GETINFOID } from '../../../../enum/PROJECT'
import { CITYJSON } from '../../../../enum/CTIYS'
import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
import printTemplateByHtml from '@/views/systemManagement/printTemplate/components/printTemplateByHtml'
import util from '../../../../libs/util'
import bottomInformation from '../../selfSupportProjectDetail/businessBidding/components/bottomInformation'
import QqtProjectMember from "../../../../components/qqt-subassembly/qqt-projet-member/qqt-project-member"
import { getOrganizationByCompanyId, getCompanyByUserId } from '@/api/system/depart/depart'
import { getDetails,findReverseRoute,careOf} from '../../../../api/approval/common'
import { staffStaffDictionary } from '../../../../api/system/staff/staff'
import { mapActions } from 'vuex'
let that = this
export default {
    name: "index",
    components: {
        QqtProjectMember,
        'up-load': upload,
        qqtFlowTabs,
        qqtFlowDiagram,
        userModules,
        qqtSendProcess,
        qqtConsent,
        bottomInformation,
        'print-template-by-html': printTemplateByHtml
    },
    data(){
        return {
            //提示信息
            hint: false,
            fromProcess: false,
            transform: {
                isShowDetails: false
            },
            isShowDetails: true,
            proId: '',
            jsonData: {},
            memberData: [],
            remoteOptions: {},
            showSubBtn: true,
            remoteFuncs: {},
            values: {
                tenderReference: null,
                biddingType: null,
                evaluationMethod: null,
                principalConstructionContent: null,
            },
            temData: {},
            urlData: [],
            upLoadFileDefaultList: [],
            // 流程
            backlog: false,
            isSendBack: false,
            // 提交
            dialogVisible: false,
            prossValue: {},
            processModuleId: '',
            subValue: {},
            taskId: '',
            procInstId: '',
            pdfId: '',
            tabShow: false,
            isShow: false,
            user: [],
            department: [],
            returnList: [],
            btnList: '',
            processValue: {
                title: '',
                pdfId: '',
                degree: '',
            },
            rules: {
            rejectVal: [
                    { required: true, message: '请选择驳回节点', trigger: ['change','blur'] }
                ],
                paymessage: [
                    { required: true, message: '请选择驳回理由', trigger:  ['change','blur']  }
                ],
            },
            form: {
                rejectVal: '',
                paymessage: ''
            },
            rejectShow: false,
            isProcessInstance: '',
            // 新组件
            isTurnManage: false,
            consent: {},
            visible: false,
            isReject: false,
            title: '',
            code: BASICSCODE.JOINT_TENDER_MAKE,
            projectComposition: [],
            remoteOption: {
                technicalProposalDepartmentList: [],
                commercialDepartmentList: [],
                budgetingDepartmentList: [],
                budgetingCompanyList: [],
                commercialCompanyList: [],
                technicalProposalCompanyList: [],
            }
        }
    },
    created () {
        this.getStaffStaffDictionary ()
    },
    methods: {
        ...mapActions('d2admin/page', [
            'close',
            'open'
        ]),
        ...mapActions('d2admin/db', [
            'database',
        ]),

        //提示信息
        hintClose(){
            this.hint = false;
        },
        //跳转到报名
        hintEnter(){
            this.$router.push({
                path:'/projectManagement/jontProjectDetail/signRegistration',
                name:'signRegistration'
            })
        },
        // 获取表单数据
        getJsonInfo () {
            formGetJson({
                code: PORJECT_INFO.TEBDERBOOKMAKE
            }).then(res => {
                this.jsonData = JSON.parse(res)
            })
        },
        // 编辑
        editInfo (){
            this.transform.isShowDetails = false
            this.isShowDetails = false
        },
        // 创建文件
        createPostRegistrationFile () {
            this.$prompt('文件名称', '', {confirmButtonText: '确定', cancelButtonText: '取消', inputPattern: /\S/, inputErrorMessage: '文件名称不能为空'}).then(({ value }) => {
                postRegistrationCreateFile ({'name': value}).then (res => {
                    res['name'] = res.fileName, res['size'] = 0
                    this.urlData.push(res)
                    this.setFile(this.urlData)
                })
            })
        },
        // ---
        formatData(res){
            res.fileList = this.urlData
            this.remoteOptions.company.forEach(item => {
                if(res.biddingCompanyId === item.id){
                    res.biddingCompanyName = item.organiname
                }
            })
            res.memberLine = that.$refs.memberRef.getData()
            this.remoteOptions.customer.forEach(item => {
                if(res.associatedPersonId === item.id){
                    res.associatedPerson = item.cusName
                }
            })
            res.projectLocation = util.isArray(res.projectLocation) ? util.jointData(res.projectLocation, '/') : res.projectLocation
            res.section = util.isArray(res.section) ? util.jointData(res.section, ',') : res.section
            res.projectType = util.isArray(res.projectType) ? util.jointData(res.projectType, ',') : res.projectType
            res.qualificationRequirement = util.isArray(res.qualificationRequirement) ? util.jointData(res.qualificationRequirement, ',') : res.qualificationRequirement
            res.id = this.proId
            return res
        },
        // 保存
        subNewPro () {
            let item = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData().then(res => {
                if (res && item) {
                    res = Object.assign({}, this.values, res, item)
                    res = this.formatData(res)
                    let canSubOperation = true
                    res.memberLine.forEach((item, index) => {
                        if(index < 5){
                            if(item.line2 === '' || item.line3 === ''){
                                canSubOperation = false
                            }
                        }
                    })
                    if (canSubOperation) {
                        let tem = { id: that.proId, tenderMake: res }
                        let arr = tem.tenderMake.memberLine 
                        arr.forEach( l => {
                            l.line5 = l.line2Name
                        })
                        getTenderMakeEdit(tem).then(res => {
                            that.$message.success("编辑成功~~~")
                            that.transform.isShowDetails = true
                            that.isShowDetails = true
                        })
                    } else {
                        this.$message.warning("项目组成人员信息未填写完全!!!")
                    }
                }
            })
        },
        // 提交
        subProcess() {
            let item = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData().then(res => {
                if (res && item) {
                    res = Object.assign({}, this.values, res, item)
                    this.subValue = this.formatData(res)
                    let canSubOperation = true
                    this.subValue.memberLine.forEach((item, index) => {
                        if(index < 5){
                            if(item.line2 === '' || item.line3 === ''){
                                canSubOperation = false
                            }
                        }
                    })
                    if (canSubOperation) {
                        this.processModuleId = 'tenderBookMake'
                        this.prossValue.title = '项目标书制作审批'
                        this.dialogVisible = true
                    } else {
                        this.$message.warning("项目组成人员信息未填写完全!!!")
                    }
                }
            })
        },
        closeFun(){
            this.dialogVisible = false
        },
        // 提交
        selectDataFun (data) {
            if (this.isSendBack) {
                let tem = this.subValue
                tem.completeTask = data
                tem.completeTask.taskId = this.taskId
                tem.flag = '4'
                tem.procInstId = this.procInstId
                tenderMakeOperation(tem).then(res => {
                    this.$message.success("重新提交成功~~~")
                    this.closeTab()
                })
            } else {
                this.subValue.completeTask = data
                let tem = {
                    id: this.subValue.id,
                    tm: this.subValue
                }
                console.log(tem);
                // return
                // console.log(tem);
                // return
                tenderMakeSubmit(tem).then(res => {
                    this.$message.success("提交成功")
                    this.transform.isShowDetails = true
                    this.isShowDetails = true
                    this.dialogVisible = false
                    this.closeTab()
                })
            }
        },
        cancel () {
            this.transform.isShowDetails = true
            this.isShowDetails = true
        },
        async printTemplate () {
            const db = await this.$store.dispatch('d2admin/db/database', {user: true})
            getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': db.get('proID').value()}).then(res => {
                if (res) this.$refs.printTemp.printTemplate (res)
            })
        },

        valueChange(field, value, model){
            let item = {}
            switch(field){
                case "registrationDeadline":
                    this.values.registrationDeadline = value
                    if (model.bidOpeningTime !== '' && model.bidOpeningTime !== null) {
                        let registrationDeadline = new Date (value)
                        let bidOpeningTime = new Date (this.values.bidOpeningTime)
                        if (bidOpeningTime < registrationDeadline) {
                            this.$message.warning ('开标时间必须大于报名时间')
                            model.registrationDeadline = ''
                        }
                    }
                    this.values = model
                    break
                case "bidOpeningTime":
                    model.bidOpeningTime = value
                    if (model.registrationDeadline !== '') {
                        let bidOpeningTime = new Date (value)
                        let registrationDeadline = new Date (model.registrationDeadline)
                        if (bidOpeningTime < registrationDeadline) {
                            this.$message.warning ('开标时间必须大于报名时间')
                            model.bidOpeningTime = ''
                        }
                    }
                    this.values = model
                    break
                case 'commercialBid':
                    this.values.commercialBid = value
                    item = this.projectComposition.find (f => f.id == value)
                    this.values.commercialUnitBid = this.values.commercialDepartmentBid = ''
                    this.values.commercialUnitName = this.values.commercialDepartmentName = ''
                    if (item) {
                        this.values['commercialName'] = item.name
                        this.getPositionDepartment (value, 1)
                    }
                    break
                case 'commercialUnitBid':
                    this.values.commercialUnitBid = value
                    item = this.remoteOption.commercialCompanyList.find (f => f.id == value)
                    this.values.commercialDepartmentBid = this.values.commercialDepartmentName = ''
                    if (item) {
                        this.values['commercialUnitName'] = item.name
                        this.getDepIdByCompanyIdList (value, this.values.commercialBid, 1)
                    }
                    break
                case 'commercialDepartmentBid':
                    this.values.commercialDepartmentBid = value
                    item = this.remoteOption.commercialDepartmentList.find (f => f.id == value)
                    if (item) this.values['commercialDepartmentName'] = item.name
                    break
                case 'technicalProposal':
                    this.values.technicalProposal = value
                    item = this.projectComposition.find (f => f.id == value)
                    this.values.technicalProposalUnitId = this.values.technicalProposalDepartmentId = ''
                    this.values.technicalProposalUnitName = this.values.technicalProposalDepartmentName = ''
                    if (item) {
                        this.values['technicalProposalName'] = item.name
                        this.getPositionDepartment (value, 2)
                    }
                    break
                case 'technicalProposalUnitId':
                    this.values.technicalProposalUnitId = value
                    item = this.remoteOption.technicalProposalCompanyList.find (f => f.id == value)
                    this.values.technicalProposalDepartmentId = this.values.technicalProposalDepartmentName = ''
                    if (item) 
                        this.values['technicalProposalUnitName'] = item.name,
                        this.getDepIdByCompanyIdList (value, this.values.technicalProposal, 2)
                    break
                case 'technicalProposalDepartmentId':
                    this.values.technicalProposalDepartmentId = value
                    item = this.remoteOption.technicalProposalDepartmentList.find (f => f.id == value)
                    if (item) this.values['technicalProposalDepartmentName'] = item.name
                    break
                case 'budgeting':
                    this.values.budgeting = value
                    item = this.projectComposition.find (f => f.id == value)
                    this.values.budgetingUnitId = this.values.budgetingDepartmentId = ''
                    this.values.budgetingUnitName = this.values.budgetingDepartmentName = ''
                    if (item)
                        this.values['budgetingName'] = item.name
                        this.getPositionDepartment (value, 3)
                    break
                case 'budgetingUnitId':
                    this.values.budgetingUnitId = value
                    item = this.remoteOption.budgetingCompanyList.find (f => f.id == value)
                    this.values.budgetingDepartmentId = this.values.budgetingDepartmentName = ''
                    if (item)
                        this.values['budgetingUnitName'] = item.name
                        this.getDepIdByCompanyIdList (value, this.values.budgeting, 3)
                    break
                case 'budgetingDepartmentId':
                    this.values.budgetingDepartmentId = value
                    item = this.remoteOption.budgetingDepartmentList.find (f => f.id == value)
                    if (item) this.values['budgetingDepartmentName'] = item.name
                    break
                default:
                    this.values[field] = value
                    break
                // this.values[field] = value
            }
        },
        upLoadFileCallBack(data){
            this.urlData = data
        },
        async getProInfo() {
            const db = await this.$store.dispatch('d2admin/db/database', {user: true})
            this.proId = db.get('proID').value()
            getTenderBookById({ id: this.proId }).then(res => {
                res.untitled = res.makeName
                // res.createName = res.createName ? res.createName : util.cookies.get ('username')
                this.showSubBtn = res.procState === '1' ? true : false
                this.proId = res.id;
                this.hint = res.untitled === '10' ? true : false;
                this.urlData = res.fileList;
                this.temData = res
                this.echoData()
                this.memberData = util.isArray(res.memberLine) ? res.memberLine : []
                if(util.isString(res.procInstId) && res.procInstId !== ''){
                    this.fromProcess = true
                    this.backlog = false
                    this.isSendBack = false
                    this.tabShow = true
                    this.transform.isShowDetails = true
                    this.isShowDetails = true
                    this.taskId = res.taskId
                    this.procInstId = res.procInstId
                    this.pdfId = res.procDefId
                } else if(res.procState === '1'){
                    this.fromProcess = false
                    this.subValue = true
                    this.transform.isShowDetails = false
                    this.isShowDetails = false
                }
            }).finally(() => {
                this.getJsonInfo()
            })
        },
        closeTab(){
            this.$router.go(-1)
            let tagName = this.$route.path
            this.close ({ tagName })
        },
        echoData(){
            if(util.isString(this.temData.section)) {
                this.temData.section = util.splitData(this.temData.section, ',')
            }
            if(util.isString(this.temData.projectType)) {
                this.temData.projectType = util.splitData(this.temData.projectType, ',')
            }
            if(util.isString(this.temData.projectLocation)){
                this.temData.projectLocation = util.splitData(this.temData.projectLocation, '/')
            }
            if(util.isString(this.temData.qualificationRequirement)){
                this.temData.qualificationRequirement = util.splitData(this.temData.qualificationRequirement, ',')
            }
            this.setFile(this.temData.fileList)
            if (this.temData.budgeting) this.getPositionDepartment (this.temData.budgeting, 3)
            if (this.temData.commercialBid) this.getPositionDepartment (this.temData.commercialBid, 1)
            if (this.temData.technicalProposal) this.getPositionDepartment (this.temData.technicalProposal, 2)
            if (this.temData.budgetingUnitId) this.getDepIdByCompanyIdList (this.temData.budgetingUnitId, this.temData.budgeting, 3)
            if (this.temData.commercialUnitBid) this.getDepIdByCompanyIdList (this.temData.commercialUnitBid, this.temData.commercialBid, 1)
            if (this.temData.technicalProposalUnitId) this.getDepIdByCompanyIdList (this.temData.technicalProposalUnitId, this.temData.technicalProposal, 2)
            this.temData.section = util.isArray(this.temData.section) ? this.temData.section : []
            this.temData.qualificationRequirement = util.isArray(this.temData.qualificationRequirement) ? this.temData.qualificationRequirement : []
            this.temData.projectType = util.isArray(this.temData.projectType) ? this.temData.projectType : []
            this.values = this.temData
        },
        setFile (files) {
            if(files && files.length > 0){
                this.upLoadFileDefaultList = []
                files.forEach(item => {
                    let json = {
                        status: 'finished',
                        response: {
                            url: item.url,
                            name: item.name,
                            size: item.size
                        }
                    }
                    this.upLoadFileDefaultList.push(json)
                })
            }
        },
        consentBorrowingApply(item = '', boolean = false){
            this.visible = this.isTurnManage = this.isReject = false
            if (boolean) {
                this.closeTab ()
                return
            }
            if (item) {
                let tem = this.temData
                tem['completeTask'] = item
                tem.flag= '1'
                tem.procInstId = this.procInstId
                tem.section = util.jointData(tem.section, ',')
                tem.projectType = util.jointData(tem.projectType, ',')
                tem.projectLocation = util.jointData(tem.projectLocation, '/')
                tem.qualificationRequirement = util.jointData(tem.qualificationRequirement, ',')
                tenderMakeOperation (tem).then (res => {
                    if (res.code === 200) {
                        this.$message.success ("同意成功");
                        this.closeTab ()
                    }
                })
            }
        },
        consentFun() {
            this.visible = true
            this.title = '审批'
            this.consent['flag'] = '1'
        },
        anewSubmitBtn() {
            let item = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData().then(res => {
                if (res && item) {
                    res = Object.assign({}, res, item)
                    res.id = this.temData.id
                    this.subValue = this.formatData(res)
                    this.subValue.projectId = this.temData.id
                    this.subValue.id = this.temData.id
                    this.subValue.memberId = this.temData.memberId
                    this.processModuleId = 'tenderBookMake'
                    this.prossValue.title = '项目标书制作审批'
                    this.prossValue.pdfId = this.pushData.procDefId
                    this.prossValue.degree = this.pushData.processVariables.degree
                    this.dialogVisible = true
                }
            })
        },
        turnToFun() {
            this.isShow = true
        },
        clearUserPage(item){
            if (item.length > 0) {
                this.isShow = !this.isShow
                let data = [];
                for (let i = 0; i < item.length; i++) {
                    let str = item[i].id
                    data.push(str)
                }
                this.$prompt('请输入转办理由', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    cancelButtonClass: "btn-custom-cancel",
                    inputPattern: /^\S/,
                    inputErrorMessage: '请输入转办理由'
                }).then(({ value }) => {
                    let jsonData = {
                        message:value,
                        candidateIds: data
                    }
                    careOf(this.taskId,jsonData).then(res=>{
                        if (res.success) {
                            this.$message.success('转办成功')
                            this.closeTab()
                        }
                    })
                }).catch(() => {
                    this.$message.info('取消输入')
                });
            } else {
                this.$message.error('请选择要转办的部门或人员')
            }
        },
        returnBtn() {
            this.rejectShow = true
        },
        // 作废
        invalidBtn() {
            let tem = this.temData
            tem.section = util.jointData(tem.section, ',')
            tem.projectType = util.jointData(tem.projectType, ',')
            tem.projectLocation = util.jointData(tem.projectLocation, '/')
            this.$prompt('此操作将作废该条数据，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                cancelButtonClass: "btn-custom-cancel",
                inputPattern: /^\S/,
                inputErrorMessage: '请输入作废理由'
            }).then(({ value }) => {
                tem.flag = '3'
                tem.completeTask = {
                    "taskId":this.taskId,
                    "msg":value
                }
                tenderMakeOperation(tem).then(res => {
                    this.$message.success("作废成功")
                    this.closeTab()
                })
            })
        },
        rejectCancel(){
            this.rejectShow = false
        },
        // 驳回
        rejectOk(){
            let tem = this.temData
            tem.section = util.jointData(tem.section, ',')
            tem.projectType = util.jointData(tem.projectType, ',')
            tem.projectLocation = util.jointData(tem.projectLocation, '/')
            tem.qualificationRequirement = util.jointData(tem.qualificationRequirement, ',')
            this.$refs['form'].validate((valid) => {
                tem.flag = '2'
                tem.completeTask = {
                    "taskId":this.taskId,
                    activityId: this.form.rejectVal,
                    msg: this.form.paymessage
                }
                tenderMakeOperation(tem).then(res => {
                    this.$message.success("驳回成功")
                    this.closeTab()
                })
            })
        },
        processGetInfo(){
            this.taskId = this.pushData.taskId
            this.procInstId = this.pushData.procInstId
            this.pdfId = this.pushData.procDefId
            this.tabShow = true
            if (this.pushData.activityId) {
                getDetails(this.pushData.procDefId + '/' +this.pushData.activityId).then(res=>{
                    this.btnList = util.isDef(res.operation) ? res.operation : ''
                    this.form.rejectVal = res.sendBackNode
                })
                if(this.pushData.pathName === 'backlog'){
                    findReverseRoute(this.pushData.procDefId + '/' +this.pushData.activityId).then(res=>{
                        this.returnList = res
                    })
                }
            }
            getTenderBookById({id:this.pushData.processVariables.relevancyId}).then(res => {
                this.temData = res
                this.echoData()
                this.memberData = util.isArray(res.memberLine) ? res.memberLine : []
            }).finally(() => {
                this.getJsonInfo()
            })
        },
        // 根据人员查询工作单位
        getPositionDepartment (id, key) {
            getCompanyByUserId ({'userId': id}).then(res => {
                if (res && res.length > 0) {
                    switch (key) {
                        case 1:
                            this.remoteOption.commercialCompanyList = res
                            break
                        case 2:
                            this.remoteOption.technicalProposalCompanyList = res
                            break
                        case 3:
                            this.remoteOption.budgetingCompanyList = res
                            break
                    }
                }
                if (res.length == 1) {
                    switch (key) {
                        case 1:
                            this.values.commercialUnitBid = res[0]['id']
                            this.values['commercialUnitName'] = res[0]['name']
                            break
                        case 2:
                            this.values.technicalProposalUnitId = res[0]['id']
                            this.values['technicalProposalUnitName'] = res[0]['name']
                            break
                        case 3:
                            this.values.budgetingUnitId = res[0]['id']
                            this.values['budgetingUnitName'] = res[0]['name']
                            break
                    }
                    this.getDepIdByCompanyIdList (res[0]['id'], id, key)
                } else {
                    switch (key) {
                        case 1:
                            this.remoteOption.commercialDepartmentList.splice(0,this.remoteOption.commercialDepartmentList.length);
                            break
                        case 2:
                            this.remoteOption.technicalProposalDepartmentList.splice(0,this.remoteOption.technicalProposalDepartmentList.length);
                            break
                        case 3:
                            this.remoteOption.budgetingDepartmentList.splice(0,this.remoteOption.budgetingDepartmentList.length);
                            break
                    }
                }
                if (!res || res.length == 0) {
                    switch (key) {
                        case 1:
                            this.remoteOption.commercialCompanyList.splice(0,this.remoteOption.commercialCompanyList.length);
                            break
                        case 2:
                            this.remoteOption.technicalProposalCompanyList.splice(0,this.remoteOption.technicalProposalCompanyList.length);
                            break
                        case 3:
                            this.remoteOption.budgetingCompanyList.splice(0,this.remoteOption.budgetingCompanyList.length);
                            break
                    }
                }
                this.$forceUpdate()
            })
        },

        getDepIdByCompanyIdList (id, userId, key) {
             getOrganizationByCompanyId({'id': id, 'userId': userId}).then(res => {
                if (res && res.length > 0) {
                    switch (key) {
                        case 1:
                            this.remoteOption.commercialDepartmentList = res
                            break
                        case 2:
                            this.remoteOption.technicalProposalDepartmentList = res
                            break
                        case 3:
                            this.remoteOption.budgetingDepartmentList = res
                            break
                    }
                }
                if (res && res.length == 1) {
                    switch (key) {
                        case 1:
                            this.values.commercialDepartmentBid = res[0]['id']
                            this.values['commercialDepartmentName'] = res[0]['name']
                            break
                        case 2:
                            this.values.technicalProposalDepartmentId = res[0]['id']
                            this.values['technicalProposalDepartmentName'] = res[0]['name']
                            break
                        case 3:
                            this.values.budgetingDepartmentId = res[0]['id']
                            this.values['budgetingDepartmentName'] = res[0]['name']
                            break
                    }
                }
                if (!res || res.length == 0) {
                    switch (key) {
                        case 1:
                            this.remoteOption.commercialDepartmentList.splice(0,this.remoteOption.commercialDepartmentList.length);
                            break
                        case 2:
                            this.remoteOption.technicalProposalDepartmentList.splice(0,this.remoteOption.technicalProposalDepartmentList.length);
                            break
                        case 3:
                            this.remoteOption.budgetingDepartmentList.splice(0,this.remoteOption.budgetingDepartmentList.length);
                            break
                    }
                }
                this.$forceUpdate()
            })
        },

        getStaffStaffDictionary () {
            staffStaffDictionary ().then(res => {
                if (res && res.length > 0) {
                    this.projectComposition = res
                }
            })
        },

        setOption (option) {
            this.remoteFuncs = {
                getAssociatedPerson (resolve) {resolve(option.customer)},
                getSection(resolve) {resolve(option.section)},
                getBiddingCompany(resolve) {resolve(option.company)},
                getRequirement(resolve) {resolve(option.aptitude)},
                getProjectType(resolve) {resolve(option.projectType)},
                getProjectComposition(resolve) {resolve(that.projectComposition)},
                getPlace (resolve) {resolve(CITYJSON)},
                getBiddingType(resolve){
                    const options = [
                        {
                            value: '公开招标',
                            label: '公开招标'
                        },{
                            value: '邀请招标',
                            label: '邀请招标'
                        },{
                            value: '单一来源采购',
                            label: '单一来源采购'
                        },{
                            value: '议标',
                            label: '议标'
                        },{
                            value: '询价',
                            label: '询价'
                        },{
                            value: '合同直签',
                            label: '合同直签'
                        },{
                            value: '其它方式',
                            label: '其它方式'
                        }
                    ]
                    resolve(options)
                },
                getEvaluationMethod(resolve){
                    const options = [
                        {
                            value: '综合评估法',
                            label: '综合评估法'
                        },{
                            value: '最低评标价法',
                            label: '最低评标价法'
                        },{
                            value: '其它方式',
                            label: '其它方式'
                        },
                    ]
                    resolve(options)
                }
            }
        }
    },
    mounted() {
        getProjectAllOptions().then(option => {
            this.remoteOptions = option
            this.setOption(option)
        }).finally(() => {
            that = this
            let pushObj = this.$route.params.detailData
            if(pushObj){
                this.fromProcess = true
                this.pushData = JSON.parse(this.$route.params.detailData)
                this.processGetInfo()
                switch(this.pushData.pathName){
                    case "backlog":
                        this.backlog = true
                        this.isSendBack = false
                        this.transform.isShowDetails = true
                        this.isShowDetails = true
                        break
                    case "sendBack":
                        this.isSendBack = true
                        this.backlog = false
                        this.transform.isShowDetails = false
                        this.isShowDetails = false
                        break
                    case "examine":
                        if(this.pushData.processVariables.processState === '6'){
                            this.isSendBack = true
                            this.backlog = false
                            this.transform.isShowDetails = false
                            this.isShowDetails = false
                            break
                        }
                    default:
                        this.backlog = false
                        this.isSendBack = false
                        this.isShowDetails = true
                        this.transform.isShowDetails = true
                        break
                }
            }else{
                this.getProInfo()
            }
        })
    }
}
</script>

<style scoped lang="scss">
.drawer-btn{
    text-align: center;
    margin-top: 20px;
}
.open-tender{
    .el-divider__text.is-center{
        left: 60px;
        padding-left: 25px;
    }
    .el-divider__text.is-center:before{
        content: '';
        width: 3px;
        height: 17px;
        background: #346fff;
        position: absolute;
        left: 13px;
        top: 2px;
    }
}
</style>
