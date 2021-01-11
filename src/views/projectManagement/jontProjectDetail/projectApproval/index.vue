<template>
    <d2-container class="address-book open-tender">
    <el-dialog
        v-dialogDrag
        title="提示"
        :visible.sync="hint"
        width="30%"
        :close-on-click-modal="false"
        :before-close="hintClose">
        <div style="text-align:center;">
            <img src="../components/img/mark.png">
            <p style="color:red;text-align:center;font-size:18px;">此项目尚未进行开标登记！</p>
        </div>
        <span slot="footer" class="dialog-footer" style="text-align:center;padding-left:40px;display:block;">
            <el-button size="mini" style="margin-right:20px;" @click="hintClose">留在此页面</el-button>
            <el-button size="mini" type="primary" @click="hintEnter">去开标登记</el-button>
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
                            :transform="transform"
                            :remoteOption="remoteOptionList"
                            @on-change="valueChange"
                            ref="generateForm">
                            <template slot="biddingPeriod">
                                <calcu-date :day="biddingPeriod" :startTime="theWinningTime" ref="calcuDate" :isWrite='transform.isShowDetails'></calcu-date>
                            </template>
                        </fm-generate-form>
                        <el-divider>项目部组成人员</el-divider>
                        <qqt-project-member
                            ref="memberRef"
                            :isShowDetails="isShowDetails"
                            :dataInfo="memberData"/>
                        <el-divider>备注</el-divider>
                        <el-form ref="form" :model="formRemark" label-width="100px">
                            <p v-if="transform.isShowDetails">{{ formRemark.remark ? formRemark.remark : '无' }}</p>
                            <el-input v-if="!transform.isShowDetails" type="textarea" :rows="3" v-model="formRemark.remark" @change="textChange(event)"></el-input>
                        </el-form>
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
                                <el-button type="info" size="small" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                                <el-button size="small" type="primary" v-if="backlog" plain @click="closeTab">取消</el-button>
                                <el-button size="small" type="primary" v-if="!backlog" @click="closeTab">关闭</el-button>
                            </el-col>
                        </el-row>

                    </el-card>
                </template>
            </qqt-flow-tabs>
            <el-dialog v-dialogDrag title="驳回" :visible.sync="rejectShow" width="30%">
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
            <div v-if="transform.isShowDetails">
                <fm-generate-form
                    :data="jsonData"
                    :remote="remoteFuncs"
                    :value="values"
                    :transform="transform"
                    :remoteOption="remoteOptionList"
                    @on-change="valueChange"
                    ref="generateForm">
                    <template slot="biddingPeriod">
                        <calcu-date :day="biddingPeriod" :startTime="theWinningTime" ref="calcuDate" :isWrite='transform.isShowDetails'></calcu-date>
                    </template>
                </fm-generate-form>
                <el-divider>项目部组成人员</el-divider>
                <qqt-project-member
                    ref="memberRef"
                    :isShowDetails="isShowDetails"
                    :dataInfo="memberData"/>
                <el-divider>备注</el-divider>
                <el-form ref="form" :model="formRemark" label-width="100px">
                    <p v-if="transform.isShowDetails">{{ formRemark.remark ? formRemark.remark : '无' }}</p>
                    <el-input v-if="!transform.isShowDetails" type="textarea" :rows="3" v-model="formRemark.remark" @change="textChange(event)"></el-input>
                </el-form>
                <el-divider>附件</el-divider>
                <up-load :isShowUpload="!transform.isShowDetails" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList" ref="upload"/>
                <bottomInformation :values="values" :isGrid="false" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
            </div>
            <div v-else>
                <fm-generate-form
                    :data="jsonData"
                    :remote="remoteFuncs"
                    :value="values"
                    :transform="transform"
                    :remoteOption="remoteOptionList"
                    @on-change="valueChange"
                    ref="generateForm">
                    <template slot="biddingPeriod">
                        <calcu-date :day="biddingPeriod" :startTime="theWinningTime" ref="calcuDate" :isWrite='transform.isShowDetails'></calcu-date>
                    </template>
                </fm-generate-form>
                <el-divider>项目部组成人员</el-divider>
                <qqt-project-member ref="memberRef" :isShowDetails="isShowDetails" :dataInfo="memberData"/>
                <el-divider>备注</el-divider>
                <el-form ref="form" :model="formRemark" label-width="100px">
                    <p v-if="transform.isShowDetails">{{ formRemark.remark ? formRemark.remark : '无' }}</p>
                    <el-input v-if="!transform.isShowDetails" type="textarea" :rows="3" v-model="formRemark.remark" @change="textChange(event)"></el-input>
                </el-form>
                <el-divider>附件</el-divider>
                <up-load :isShowUpload="!transform.isShowDetails" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList" ref="upload"/>
                <bottomInformation :values="values" :isGrid="false" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
            </div>
            <div class="drawer-btn" v-if="transform.isShowDetails && $has('joint:approval:edit')">
                <el-button type="info" size="small" @click="printTemplate">打印</el-button>
                <el-button type="primary" size="small" @click="editInfo">编辑</el-button>
            </div>
            <div class="drawer-btn" v-if="!transform.isShowDetails">
                <el-button type="primary" size="small" @click="subNewPro">保存</el-button>
                <el-button type="warning" size="small" v-if="$has('joint:approval:submit')" @click="subProcess">提交</el-button>
                <el-button size="small" @click="cancel">取消</el-button>
            </div>
        </div>
    </el-card>
    <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    <user-modules :showDialog="isShow" :userIds="user" :department="department" @clearUserPage="clearUserPage" @closeFun="isShow = false"></user-modules>
    <qqt-send-process v-if="dialogVisible" :isSendBack='isSendBack' :dialogVisible="dialogVisible" :prossValue="prossValue" :processModuleId="processModuleId" @close="closeFun" @selectData="selectDataFun"></qqt-send-process>
    <qqt-consent :dialogVisible="visible" :msg="msg" :title="title" :taskId="taskId || ''" :type="consent['flag']" :isTurnManage="isTurnManage" :isReject="isReject" @close="consentBorrowingApply" />
    </d2-container>
</template>

<script>
import QqtProjectMember from "../../../../components/qqt-subassembly/qqt-projet-member/qqt-project-member";
import { formGetJson } from '../../../../api/system/fromManagement/index'
import { getProjectApprovalById, getProjectApprovalEdit,getProjectApprovalSubmit, getProjectApprovalOperation,getProjectAllOptions} from '../../../../api/jointProject/index'
import { PORJECT_INFO, PROJECT_GETINFOID } from '../../../../enum/PROJECT'
import { queryDicById } from '../../../../api/system/dic/dic'
import { getDetails,findReverseRoute,careOf} from '../../../../api/approval/common'
import { CITYJSON } from '../../../../enum/CTIYS'
import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
import printTemplateByHtml from '@/views/systemManagement/printTemplate/components/printTemplateByHtml'
import { qqtFlowDiagram,qqtFlowTabs, upload, qqtConsent} from '../../../../components/qqt-subassembly'
import calcuDate from '../projectCostCompositionCivision/components/calcuDate'
import { qqtSendProcess } from '@/components/qqt-subassembly'
import bottomInformation from '../../selfSupportProjectDetail/businessBidding/components/bottomInformation'
import userModules from '../../../systemManagement/processDefinition/processModules/userModules'
import { getOrganizationByCompanyId, getCompanyByUserId } from '@/api/system/depart/depart'
import { staffStaffDictionary } from '../../../../api/system/staff/staff'
import { mapActions } from 'vuex'
import util from '../../../../libs/util'
let temDb = ''
let that = this
export default {
    name: "index",
    components: {
        QqtProjectMember,
        'up-load' : upload,
        qqtSendProcess,
        qqtFlowDiagram,
        qqtFlowTabs,
        userModules,
        qqtConsent,
        calcuDate,
        bottomInformation,
        'print-template-by-html': printTemplateByHtml
    },
    data () {
        return {
            //提示
            hint: false,
            fromProcess: false,
            transform: {
                isShowDetails: true
            },
            temData: {},
            formRemark: {
                remark : ''
            },
            isShowDetails: false,
            memberData: [],
            jsonData: {},
            projectComposition:[],
            remoteOption: {},
            remoteFuncs: {},
            values: {
                departmentId: '',
                departmentName: '',
                createBy: '',
                createName: util.cookies.get ('username'),
                createTime: new Date().format("yyyy-MM-dd hh:mm:ss")
            },
            urlData: [],
            upLoadFileDefaultList: [],

            procInstId: '',
            isProcessInstance: '',
            pdfId: '',

            tabShow: false,
            backlog: false,
            isSendBack: false,
            taskId: '',
            procInstId: '',
            returnList: [],
            pdfId: '',
            btnList: '',
            rules: {
                rejectVal: [ { required: true, message: '请选择驳回节点', trigger: ['change','blur'] } ],
                paymessage: [ { required: true, message: '请选择驳回理由', trigger:  ['change','blur']  } ],
            },
            dialogVisible: false,
            prossValue: {},
            processModuleId: '',
            processValue: {
                title: '',
                pdfId: '',
                degree: '',
            },
            subValue: {},
            isShow: false,
            user: [],
            department: [],
            form: {
                rejectVal: '',
                paymessage: ''
            },
            rejectShow: false,
            // 新组件
            isTurnManage: false,
            consent: {},
            visible: false,
            isReject: false,
            title: '',
            biddingPeriod: 0,
            theWinningTime: '',
            msg: '',
            code: BASICSCODE.JOINT_PROJECT_APPROVAL,
            roleOptions: [],
            remoteOptionList: {
                technicalProposalDepartmentList: [],
                commercialDepartmentList: [],
                budgetingDepartmentList: [],
                budgetingCompanyList: [],
                commercialCompanyList: [],
                technicalProposalCompanyList: [],
            }
        }
    },
    created() {
        this.getStaffStaffDictionary ()
    },
    methods: {
        ...mapActions('d2admin/page', [
            'close',
            'open'
        ]),
        //提示信息
        hintClose(){
            this.hint = false;
        },
        //跳转到报名
        hintEnter(){
            this.$router.push({
                path:'/projectManagement/jontProjectDetail/openTender',
                name:'openTender'
            })
        },
        editInfo() {
            this.transform.isShowDetails = false
            this.isShowDetails = false
        },
        // biddingPeriod
        textChange(e){
            this.$forceUpdate()
        },
        formatData(data){
            data.memberLine =  this.$refs.memberRef.getData()
            data.remark = this.formRemark.remark
            data.id = this.temData.id
            data.fileList = this.urlData
            data.projectLocation = util.isArray(data.projectLocation) ? util.jointData(data.projectLocation, '/') : data.projectLocation
            data.section = util.isArray(data.section)? util.jointData(data.section, ',') : data.section
            data.projectType = util.isArray(data.projectType) ? util.jointData(data.projectType, ',') : data.projectType
            data.biddingPeriod = this.$refs.calcuDate.returnData()
            if(this.remoteOption.company.length > 0){
                this.remoteOption.company.forEach(item => {
                    if(item.id === data.biddingCompanyId){
                        data.biddingCompanyName = item.organiname
                    }
                })
            }
            if (this.remoteOption.owner.length > 0) {
                this.remoteOption.owner.forEach(item => {
                    if (data.firstPartyId === item.id) {
                        data.firstParty = item.cusName
                    }
                })
            }
            data.dateClosed = util.getEndTime(data.theWinningTime, data.biddingPeriod)
            data.qualificationRequirement = util.jointData(data.qualificationRequirement, ',')
            return data
        },
        subNewPro(){
            let bottomInformation = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData().then(data => {
                if(data && bottomInformation) { 
                    data = Object.assign({}, this.values, data, bottomInformation)
                    let tem = this.formatData(data)
                    let canSubOperation = true
                    tem.memberLine.forEach((item, index) => {
                        if(index < 5){
                            if(item.line2 === '' || item.line3 === ''){
                                canSubOperation = false
                            }
                        }
                    })
                    if (canSubOperation) {
                        if(tem.firstPartyId == '') tem.firstParty = ''
                        getProjectApprovalEdit(
                            tem
                        ).then(res => {
                            that.$message.success("编辑成功~~~")
                            this.transform.isShowDetails = true
                            this.isShowDetails = true
                        })
                    } else {
                        this.$message.warning("项目组成人员信息未填写完全!!!")
                    }
                }
            })
        },
        cancel () {
            this.transform.isShowDetails = true
            this.isShowDetails = true
        },
        valueChange(field, value, model){
            let item = {}
            switch (field) {
                case 'managementRatio':
                    if(value < 0){
                        this.$message.warning("管理费比例不能为负!!!")
                        model.managementRatio = ''
                        model.administrativeFee = '0'
                    } else {
                        model.administrativeFee = Number(model.tenderPrice) * Number(value) / 100 + ''
                    }
                    model.bigWriteCharge = util.convertCurrency(model.administrativeFee)
                    Object.assign(this.values, model)
                    break
                case 'tenderPrice':
                    model.administrativeFee = Number(model.tenderPrice) * Number(model.managementRatio) / 100 + ''
                    model.bigWriteCharge = util.convertCurrency(model.administrativeFee)
                    Object.assign(this.values, model)
                    break
                case 'bidOpeningTime':
                    model.bidOpeningTime = value
                    if (model.theWinningTime !== '' && util.isString(model.theWinningTime)) {
                        let bidOpeningTime = new Date (value)
                        let theWinningTime = new Date (model.theWinningTime)
                        if (theWinningTime < bidOpeningTime) {
                            this.$message.warning ('中标时间必须大于开标时间')
                            model.bidOpeningTime = ''
                        }
                        Object.assign(this.values, model)
                    }
                    break
                case 'theWinningTime':
                    model.theWinningTime = value
                    this.theWinningTime = value
                    if (model.bidOpeningTime !== '' && util.isString(model.bidOpeningTime)) {
                        let theWinningTime = new Date (value)
                        let bidOpeningTime = new Date (model.bidOpeningTime)
                        if (theWinningTime < bidOpeningTime) {
                            this.$message.warning ('中标时间必须大于开标时间')
                            model.theWinningTime = ''
                        }
                        Object.assign(this.values, model)
                    }
                    break
                case 'builingUnitLine':
                    Object.assign(this.values, model)
                    break
                case 'administrativeFee':
                    model.bigWriteCharge = util.convertCurrency(Number.parseFloat (value).toFixed(2))
                    Object.assign(this.values, model)
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
                    item = this.remoteOptionList.commercialCompanyList.find (f => f.id == value)
                    this.values.commercialDepartmentBid = this.values.commercialDepartmentName = ''
                    if (item) {
                        this.values['commercialUnitName'] = item.name
                        this.getDepIdByCompanyIdList (value, this.values.commercialBid, 1)
                    }
                    break
                case 'commercialDepartmentBid':
                    this.values.commercialDepartmentBid = value
                    item = this.remoteOptionList.commercialDepartmentList.find (f => f.id == value)
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
                    item = this.remoteOptionList.technicalProposalCompanyList.find (f => f.id == value)
                    this.values.technicalProposalDepartmentId = this.values.technicalProposalDepartmentName = ''
                    if (item) 
                        this.values['technicalProposalUnitName'] = item.name,
                        this.getDepIdByCompanyIdList (value, this.values.technicalProposal, 2)
                    break
                case 'technicalProposalDepartmentId':
                    this.values.technicalProposalDepartmentId = value
                    item = this.remoteOptionList.technicalProposalDepartmentList.find (f => f.id == value)
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
                    item = this.remoteOptionList.budgetingCompanyList.find (f => f.id == value)
                    this.values.budgetingDepartmentId = this.values.budgetingDepartmentName = ''
                    if (item)
                        this.values['budgetingUnitName'] = item.name
                        this.getDepIdByCompanyIdList (value, this.values.budgeting, 3)
                    break
                case 'budgetingDepartmentId':
                    this.values.budgetingDepartmentId = value
                    item = this.remoteOptionList.budgetingDepartmentList.find (f => f.id == value)
                    if (item) this.values['budgetingDepartmentName'] = item.name
                    break
                default:
                    this.values[field] = value
                    break
            }
        },
        upLoadFileCallBack(data){
            this.urlData = data
        },
        async getProInfo() {
            const db = await this.$store.dispatch('d2admin/db/database', {user: true})
            this.proId = db.get('proID').value();
            getProjectApprovalById({
                id: this.proId
            }).then(res => {
                this.hint = res.untitled === '10' ? true : false;
                res.managementRatio = parseFloat(res.managementRatio ? res.managementRatio : '0');
                this.temData = res;
                this.urlData = res.fileList;
                this.echoData();
                this.setFile(res.fileList);
                this.memberData = util.isArray(res.memberLine) ? JSON.parse (JSON.stringify (res.memberLine)) : [];
                this.formRemark.remark = res.remark;
                this.isShowDetails = true;
                if(util.isString(res.procInstId) && res.procInstId !== ''){
                    this.fromProcess = true;
                    this.backlog = false;
                    this.isSendBack = false;
                    this.tabShow = true;

                    this.taskId = res.taskId;
                    this.procInstId = res.procInstId;
                    this.pdfId = res.procDefId;
                } else if(res.procState === '1'){
                    this.fromProcess = false;
                    this.subValue = true;
                    this.isShowDetails = false;
                    this.transform.isShowDetails = false;
                }
            }).finally(() => {
                this.setJosn()
            })
        },
        setFile(fileList){
            this.upLoadFileDefaultList = []
            if(fileList && fileList.length > 0){
                fileList.forEach(item => {
                    let tem = {
                        status: "finished",
                        response: {
                            name: item.name,
                            url: item.url,
                            size: item.size
                        }
                    }
                    this.upLoadFileDefaultList.push(tem)
                })
            }
        },
        echoData() {
            this.temData.bigWriteCharge = util.convertCurrency(this.temData.administrativeFee)
            this.temData.administrativeFee = Number(this.temData.administrativeFee)
            if(util.isString(this.temData.qualificationRequirement)) {
                this.temData.qualificationRequirement = util.splitData(this.temData.qualificationRequirement, ',')
            }
            if (this.temData.budgeting) this.getPositionDepartment (this.temData.budgeting, 3)
            if (this.temData.commercialBid) this.getPositionDepartment (this.temData.commercialBid, 1)
            if (this.temData.technicalProposal) this.getPositionDepartment (this.temData.technicalProposal, 2)
            if (this.temData.budgetingUnitId) this.getDepIdByCompanyIdList (this.temData.budgetingUnitId, this.temData.budgeting, 3)
            if (this.temData.commercialUnitBid) this.getDepIdByCompanyIdList (this.temData.commercialUnitBid, this.temData.commercialBid, 1)
            if (this.temData.technicalProposalUnitId) this.getDepIdByCompanyIdList (this.temData.technicalProposalUnitId, this.temData.technicalProposal, 2)
            this.temData.qualificationRequirement = this.temData.qualificationRequirement === null ? [] : this.temData.qualificationRequirement
            this.temData.section = util.isArray(this.temData.section) ? this.temData.section : []
            this.temData.projectType = util.isArray(this.temData.projectType) ? this.temData.projectType : []
            this.temData.builingUnitLine = util.isArray(this.temData.builingUnitLine) ? this.temData.builingUnitLine : [{}]
            // Object.assign(this.values, this.temData)
            this.values = JSON.parse(JSON.stringify(this.temData))
            this.biddingPeriod = new Number(this.temData.biddingPeriod)
            this.theWinningTime = this.temData.theWinningTime
        },
        closeTab(){
            let tagName = this.$route.path;
            this.close ({ tagName });
            this.$router.go(-1);
        },
        subProcess () {
            let bottomInformation = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData().then(data => {
                if(data && bottomInformation) {
                    data = Object.assign({}, this.values, data, bottomInformation)
                    this.subValue = this.formatData(data)
                    let canSubOperation = true
                    this.subValue.memberLine.forEach((item, index) => {
                        if(index < 5){
                            if(item.line2 === '' || item.line3 === ''){
                                canSubOperation = false
                            }
                        }
                    })
                    if (canSubOperation) {
                        this.processModuleId = 'projectApproval'
                        this.prossValue.title = '项目立项登记审批'
                        this.dialogVisible = true
                    } else {
                        this.$message.warning("项目组成人员信息未填写完全!!!")
                    }
                }
            })
        },
        closeFun () {
            this.dialogVisible = false
        },
        async printTemplate () {
            const db = await this.$store.dispatch('d2admin/db/database', {user: true})
            getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': db.get('proID').value()}).then(res => {
                if (res) {
                    if (res.memberLine && res.memberLine.length > 0) {
                        res.memberLine.forEach (item => {
                            if (!isNaN(item.line1)) {
                                let data = this.roleOptions.find (f => f.id == item.line1)
                                if (data) item.line1 = data.name
                            }
                        })
                    }
                    this.$refs.printTemp.printTemplate (res)
                }
            })
        },
        selectDataFun (data) {
            this.subValue.completeTask = data
            if (this.isSendBack) {
                this.subValue.completeTask.taskId = this.taskId
                this.subValue.flag = '1'
                this.subValue.procInstId = this.procInstId
                getProjectApprovalOperation(this.subValue).then(res => {
                    this.$message.success("重新提交成功~~~")
                    this.closeTab()
                })
            } else {
                let tem = {
                    id: this.temData.id,
                    jpj: this.subValue
                }
                getProjectApprovalSubmit(tem).then(res => {
                    this.$message.success("提交成功")
                    this.transform.isShowDetails = true
                    this.isShowDetails = true
                    this.dialogVisible = false
                    this.closeTab()
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
                this.temData = this.formatData(this.temData)
                this.temData['completeTask'] = item
                this.temData.flag= '1'
                this.temData.procInstId = this.procInstId
                getProjectApprovalOperation(this.temData).then(res => {
                    if (res.code === 200) {
                        this.$message.success ("同意成功")
                        this.closeTab()
                    }
                })
            }
        },
        consentFun () {
            this.visible = true
            this.title = '审批'
            this.consent['flag'] = '1'
        },
        anewSubmitBtn () {
            let bottomInformation = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData().then(res => {
                if(res && bottomInformation) {
                    res = Object.assign({}, res, bottomInformation)
                    this.subValue = this.formatData(res)
                    this.processModuleId = 'projectApproval'
                    this.prossValue.title = '项目立项登记审批'
                    this.prossValue.pdfId = this.pushData.procDefId
                    this.prossValue.degree = this.pushData.processVariables.degree
                    this.dialogVisible = true
                }
            })
        },
        turnToFun () {
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
        returnBtn () {
            this.rejectShow = true
        },
        rejectCancel(){
            this.rejectShow = false
        },
        rejectOk(){
            let tem = this.temData
            tem = this.formatData(tem)
            this.$refs['form'].validate((valid) => {
                tem.flag = '2'
                tem.completeTask = {
                    "taskId":this.taskId,
                    activityId: this.form.rejectVal,
                    msg: this.form.paymessage
                }
                getProjectApprovalOperation(tem).then(res => {
                    this.$message.success("驳回成功")
                    this.closeTab()
                })
            })
        },
        invalidBtn () {
            this.$prompt('此操作将作废该条数据，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                cancelButtonClass: "btn-custom-cancel",
                inputPattern: /^\S/,
                inputErrorMessage: '请输入作废理由'
            }).then(({ value }) => {
                let tem = this.temData
                tem = this.formatData(tem)
                tem.flag = '3'
                tem.completeTask = {
                    "taskId":this.taskId,
                    "msg":value
                }
                getProjectApprovalOperation(tem).then(res => {
                    this.$message.success("作废成功")
                    this.closeTab()
                })
            })
        },
        processGetInfo () {
            this.taskId = this.pushData.taskId
            this.procInstId = this.pushData.procInstId
            this.pdfId = this.pushData.procDefId
            this.tabShow = true
            if (this.pushData.activityId) {
                getDetails(this.pushData.procDefId + '/' +this.pushData.activityId).then(res=>{
                    this.msg = res.msg
                    this.btnList = util.isDef(res.operation) ? res.operation : ''
                    this.form.rejectVal = res.sendBackNode
                })
                if(this.pushData.pathName === 'backlog'){
                    findReverseRoute(this.pushData.procDefId + '/' +this.pushData.activityId).then(res=>{
                        this.returnList = res
                    })
                }
            }
            getProjectApprovalById({id:this.pushData.processVariables.relevancyId}).then(res => {
                // res.managementRatio = (res.managementRatio ? res.managementRatio : '0')
                this.temData = res
                this.echoData()
                this.setFile(res.fileList)
                this.memberData = res.memberLine
                this.formRemark.remark = res.remark
            }).finally(() => {
                this.setJosn()
            })
        },
        setRomte (option) {
            this.remoteFuncs = {
                getSection(resolve) {resolve(option.section)},
                getBiddingCompany(resolve){resolve(option.company)},
                getRequirement(resolve) {resolve(option.aptitude)},
                getProjectType(resolve) {resolve(option.projectType)},
                getPlace (resolve) {resolve(CITYJSON)},
                getAssociatedPerson (resolve) {resolve(option.customer)},
                getParty(resolve){resolve(option.owner)},
                getProjectComposition(resolve){resolve(that.projectComposition)},
                buildUnit(resolve){
                    let options = [
                        { value: '建设单位', name: '建设单位' },
                        { value: '勘察单位', name: '勘察单位' },
                        { value: '设计单位', name: '设计单位' },
                        { value: '监理单位', name: '监理单位' },
                        { value: '施工单位', name: '施工单位' },
                        { value: '其它单位', name: '其它单位' },
                    ]
                    resolve(options)
                }
            }
        },
        setJosn () {
            formGetJson({
                code: PORJECT_INFO.PROJECTAPPROVAL
            }).then(res => {
                this.jsonData = JSON.parse(res)
            })
        },

        getQueryDicById () {
            queryDicById({id: '1169493610957533184'}).then(res => {
                this.roleOptions = res
            })
        },

        getStaffStaffDictionary () {
            staffStaffDictionary ().then(res => {
                if (res && res.length > 0) {
                    this.projectComposition = res
                }
            })
        },
        // 根据人员查询工作单位
        getPositionDepartment (id, key) {
            getCompanyByUserId ({'userId': id}).then(res => {
                if (res && res.length > 0) {
                    switch (key) {
                        case 1:
                            this.remoteOptionList.commercialCompanyList = res
                            break
                        case 2:
                            this.remoteOptionList.technicalProposalCompanyList = res
                            break
                        case 3:
                            this.remoteOptionList.budgetingCompanyList = res
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
                            this.remoteOptionList.commercialDepartmentList.splice(0,this.remoteOptionList.commercialDepartmentList.length);
                            break
                        case 2:
                            this.remoteOptionList.technicalProposalDepartmentList.splice(0,this.remoteOptionList.technicalProposalDepartmentList.length);
                            break
                        case 3:
                            this.remoteOptionList.budgetingDepartmentList.splice(0,this.remoteOptionList.budgetingDepartmentList.length);
                            break
                    }
                }
                if (!res || res.length == 0) {
                    switch (key) {
                        case 1:
                            this.remoteOptionList.commercialCompanyList.splice(0,this.remoteOptionList.commercialCompanyList.length);
                            break
                        case 2:
                            this.remoteOptionList.technicalProposalCompanyList.splice(0,this.remoteOptionList.technicalProposalCompanyList.length);
                            break
                        case 3:
                            this.remoteOptionList.budgetingCompanyList.splice(0,this.remoteOptionList.budgetingCompanyList.length);
                            break
                    }
                }
            })
        },

        getDepIdByCompanyIdList (id, userId, key) {
             getOrganizationByCompanyId({'id': id, 'userId': userId}).then(res => {
                if (res && res.length > 0) {
                    switch (key) {
                        case 1:
                            this.remoteOptionList.commercialDepartmentList = res
                            break
                        case 2:
                            this.remoteOptionList.technicalProposalDepartmentList = res
                            break
                        case 3:
                            this.remoteOptionList.budgetingDepartmentList = res
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
                            this.remoteOptionList.commercialDepartmentList.splice(0,this.remoteOptionList.commercialDepartmentList.length);
                            break
                        case 2:
                            this.remoteOptionList.technicalProposalDepartmentList.splice(0,this.remoteOptionList.technicalProposalDepartmentList.length);
                            break
                        case 3:
                            this.remoteOptionList.budgetingDepartmentList.splice(0,this.remoteOptionList.budgetingDepartmentList.length);
                            break
                    }
                }
            })
        }
    },
    mounted() {
        this.getQueryDicById ()
        getProjectAllOptions().then(options => {
            this.remoteOption = options
            this.setRomte(options)
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
                        this.isShowDetails = true
                        this.transform.isShowDetails = true
                        break
                    case "sendBack":
                        this.isSendBack = true
                        this.backlog = false
                        this.isShowDetails = false
                        this.transform.isShowDetails = false
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
