<template>
    <d2-container class="address-book project-common-in">
        <el-dialog
            v-dialogDrag
            append-to-body
            title="提示"
            :visible.sync="hint"
            top="10vh"
            width="30%"
            :close-on-click-modal="false"
            :before-close="hintEnter">
            <div style="text-align:center;">
                <img src="../../components/img/mark.png">
                <p style="color:red;text-align:center;font-size:18px;">此项目的立项审批没有通过不能进行款项代收代付！</p>
            </div> 
            <span slot="footer" class="dialog-footer" style="text-align:center;padding-left:40px;display:block;">
                <el-button size="mini" type="primary" @click="hintEnter">去立项登记查看</el-button>
            </span>
        </el-dialog>
        <el-card class="box-card closeHeader">
            <div slot="header"><el-button type="text" @click="cancel"><i class="el-icon-close"></i></el-button></div>
            <div v-if="fromProcess">
                <qqt-flow-tabs v-if="tabShow" :procInstId="procInstId" :isProcessInstance='isProcessInstance' :pdfId="pdfId">
                    <template slot="content">
                        <el-card :body-style="{ padding: '20px' }">
                            <fm-generate-form :data="jsonData" :remote="remoteFuncs" :value="values" :transform="transform" @on-change="valueChange" ref="generateForm">
                                <template slot="addLine">
                                    <div class="project-common-in-tabs">
                                        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                                            <el-tab-pane :label="label1" name="first">
                                                <addline1 :isShowDetails='transform.isShowDetails' :isSendBack="isSendBack" :showAddName="true" :costType="costType" :title="addTitle" @change="addLineChange1" :showReject='showReject' :isProcess='isProcess'  :dataInfo='addLineData1' ref="addline1"></addline1>
                                            </el-tab-pane>
                                            <el-tab-pane :label="label2" name="second">
                                                <pay-add-line :isShowDetails="transform.isShowDetails" @change="addLineChange3" ref="payAddLine" :dataInfo='addLineData'></pay-add-line>
                                            </el-tab-pane>
                                        </el-tabs>
                                    </div>
                                    <!-- <div class="totalAmount-form">
                                        <el-form ref="form" class="add-form" :model="form" label-width="100px">
                                            <el-row>
                                                <el-col :span="8">
                                                    <el-form-item label-width="100px" label="合计:">
                                                        <qqt-input size="medium" v-model="form.totalAmount" :isShowElement="false" :isMoneyType="true" :btnTitle="'元'"></qqt-input>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                    <el-form-item label-width="100px" label="大写:">
                                                        <el-input v-model="form.bigWriteCharge" size="medium" disabled></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        </el-form>
                                    </div> -->
                                </template>
                            </fm-generate-form>
                            <accountant v-if="showAccReject" :isShowDetails="isShowDetails" :dataInfo="accDataInfo" ref="accountant"></accountant>
                            <div class="up-load-div">
                                <el-divider content-position="left">附件</el-divider>
                                <up-load :isShowUpload="!transform.isShowDetails" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList" ref="upload"/>
                            </div>
                            <bottomInformation :values="values" :fieldTitle="'申请'" :timeTitle="'申请'" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
                            <el-row>
                                <el-col :span="24" style="text-align:center" class="d2-mt-20">
                                    <!-- <qqt-voucher ref="voucher" :voucherShow="voucherShow" @dialogComfirm="dialogComfirm" @dialogCancel="voucherShow=false" :data="cloneData" ></qqt-voucher> -->
                                    <el-button size="small" type="primary" v-if="backlog"  @click="flag = '1', consentFun()">同意</el-button>
                                    <el-button size="small" type="warning" v-if="btnList.indexOf('1') != -1 && backlog" @click="flag = '0', turnToFun()">转办</el-button>
                                    <el-button size="small" type="success" v-if="btnList.indexOf('2') != -1 && backlog" plain @click="flag = '2', returnBtn()">驳回</el-button>
                                    <el-button size="small" type="info" v-if="btnList.indexOf('3') != -1 && backlog" @click="flag = '3', invalidBtn()">作废</el-button>
                                     <el-button type="info" size="small" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                                    <el-button size="small" type="primary" v-if="backlog" plain @click="cancel">取消</el-button>
                                    <el-button size="small" type="primary" v-if="!backlog" @click="cancel">关闭</el-button>
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
                <fm-generate-form :data="jsonData" :remote="remoteFuncs" :value="values" :transform="transform" @on-change="valueChange" ref="generateForm">
                    <template slot="addLine">
                        <div class="project-common-in-tabs">
                            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                                <el-tab-pane :label="label1" name="first">
                                    <addline1 :isShowDetails='isShowDetails' :isSendBack="isSendBack" :showAddName="true" :costType="costType" :title="addTitle" @change="addLineChange1" :dataInfo='addLineData1' ref="addline1"></addline1>
                                </el-tab-pane>
                                <el-tab-pane :label="label2" name="second">
                                    <pay-add-line :isShowDetails="transform.isShowDetails" ref="payAddLine" @change="addLineChange3" :dataInfo='addLineData'></pay-add-line>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                        <!-- <div class="totalAmount-form">
                            <el-form ref="form" class="add-form" :model="form" label-width="100px">
                                <el-row>
                                    <el-col :span="8">
                                        <el-form-item label-width="100px" label="合计:">
                                            <qqt-input size="medium" v-model="form.totalAmount" :isShowElement="false" :isMoneyType="true" :btnTitle="'元'"></qqt-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label-width="100px" label="大写:">
                                            <el-input v-model="form.bigWriteCharge" size="medium" disabled></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </div> -->
                    </template>
                </fm-generate-form>
                <div class="up-load-div">
                    <el-divider content-position="left">附件</el-divider>
                    <up-load :isShowUpload="!transform.isShowDetails" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList" ref="upload"/>
                </div>
                <bottomInformation :values="values" :fieldTitle="'申请'" :timeTitle="'申请'" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
                <div class="drawer-btn" v-if="!fromProcess">
                    <el-button type="warning" v-if="!transform.isShowDetails && procInstId == ''" size="small" @click="subNewPro">保存</el-button>
                    <el-button size="small" type="primary" v-if="isSendBack" @click="flag = '4', anewSubmitBtn()">重新提交</el-button>
                    <el-button v-if="!transform.isShowDetails && $has('joint:agentBusiness:submit') && procInstId == ''" type="primary" size="small" @click="subProcess">提交</el-button>
                    <el-button type="info" size="small" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                    <el-button size="small" v-if="!transform.isShowDetails" @click="cancel">取消</el-button>
                    <el-button type="primary" v-if="transform.isShowDetails"  size="small" @click="cancel">关闭</el-button>
                </div>
            </div>
         </el-card>
         <print-template-by-html v-show="false" :code="code" ref="printTemp" />
        <qqt-send-process v-if="dialogVisible" :isSendBack='isSendBack' :dialogVisible="dialogVisible" :prossValue="prossValue" :processModuleId="processModuleId" @close="closeFun" @selectData="selectDataFun"></qqt-send-process>
        <user-modules :showDialog="isShow" :userIds="user" :department="department" @clearUserPage="clearUserPage" @closeFun="isShow = false"></user-modules>
        <qqt-consent :dialogVisible="visible" :title="title" :taskId="taskId || ''" :type="consent['flag']" :isTurnManage="isTurnManage" :isReject="isReject" @close="consentBorrowingApply" />
    </d2-container>
</template>
<script>
import { getByAccountTypeListAll, getProjectAllOptions } from '../../../../../api/jointProject/index'
import { qqtFlowDiagram,qqtFlowTabs,qqtConsent,qqtLookVoucher, upload, qqtInput} from '../../../../../components/qqt-subassembly'
import { formGetJson } from '../../../../../api/system/fromManagement/index'
import { agentBusinessAdd,agentBusinessEdit, agentBusinessSubmit } from '../../../../../api/jointProject/agentBusinessManagement/index'
import { agentBusinessQueryById,agentBusinessOperation } from '../../../../../api/jointProject/agentBusinessManagement/index'
import { getDetails,findReverseRoute,careOf} from '../../../../../api/approval/common'
import { PORJECT_INFO } from '../../../../../enum/PROJECT'
import bottomInformation from '../../../selfSupportProjectDetail/businessBidding/components/bottomInformation'
import userModules from '../../../../systemManagement/processDefinition/processModules/userModules'
import accountant from '../../../../approval/components/pushPage/projectCashRequest/components/accountant'
import addline1 from '../../projectPayment/components/addlines/addline1'
import { qqtSendProcess } from '@/components/qqt-subassembly'
import { getProById } from '../../../../../api/jointProject/index'
import { queryDicById } from '../../../../../api/system/dic/dic'
import { mapActions } from 'vuex'
import payAddLine from './payAddLine'
import util from '../../../../../libs/util'
import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
import printTemplateByHtml from '@/views/systemManagement/printTemplate/components/printTemplateByHtml'
let that = this
export default {
    name: "newAgent",
    components:{
        qqtSendProcess,
        qqtFlowDiagram,
        qqtFlowTabs,
        accountant,
        userModules,
        qqtConsent,
        payAddLine,
        qqtLookVoucher,
        bottomInformation,
        'up-load': upload,
        'qqt-input': qqtInput,
        addline1,
        'print-template-by-html': printTemplateByHtml
    },
    data() {
        return {
            cloneData: {},
            hint: false,
            voucherShow: false,
            jsonData: {},
            accountList: [],
            natureAccount: [],
            instrumentType: [],
            fileList: [],
            upLoadFileDefaultList: [],
            remoteFuncs: {
                accountType(resolve){
                    let options = [
                        {
                            value: '1',
                            label: '个人账户',
                        },{
                            value: '2',
                            label: '公司账户',
                        },{
                            value: '3',
                            label: '社会团体',
                        },{
                            value: '4',
                            label: '公共事业',
                        },{
                            value: '5',
                            label: '其他',
                        },
                    ]
                    resolve(options)
                },
                getAccount(resolve){
                    resolve(that.accountList)
                },
                getNatureAccount(resolve) {
                    resolve(that.natureAccount)
                },
                getInstrumentType(resolve) {
                    resolve(that.instrumentType)
                }
            },
            values: {},
            transform: {
                isShowDetails: false
            },
            fromProcess: false,
            proId: '',
            dialogVisible: false,
            prossValue: {},
            processModuleId: '',
            subValue: {},
            pushData: {},
            isShowDetails: false,
            procInstId: '',
            isProcessInstance: '',
            pdfId: '',
            accDataInfo: [],
            rejectShow: false,
            returnList: [],
            rules: {
                rejectVal: [ { required: true, message: '请选择驳回节点', trigger: ['change','blur'] }],
                paymessage: [ { required: true, message: '请选择驳回理由', trigger:  ['change','blur'] }],
            },
            form: {
                rejectVal: '',
                paymessage: ''
            },
            tabShow: false,
            btnList: '',
            isShow: false,
            user: [],
            department: [],
            isSendBack: false,
            backlog: false,
            processValue: {
                title: '',
                pdfId: '',
                degree: '',
            },
            showAccReject: true,
            taskId: '',
            // 新组件
            isTurnManage: false,
            consent: {},
            visible: false,
            isReject: false,
            title: '',
            addLineData: {
                tableData: [{}],
            },
            addLineData1: [{canDel: true, name: "", money: ""}],
            activeName: 'first',
            label1: '本次应扣: 0元',
            label2: '本次支付: 0元',
            addTitle: {
                line1: '应扣费用名称',
                line2: '应扣金额',
                line3: '扣款说明'
            },
            form: {
                totalAmount: '',
                bigWriteCharge: '',
            },
            formData: {
                deductMoney: '',
                payMoney: ''
            },
            costType: [],
            showReject: false,
            isProcess: false,
            flag: '1',
            code: BASICSCODE.JOINT_AGENT_BUSINESS
        }
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
        //跳转到立项
        hintEnter(){
            let tagName = this.$route.path
            let path = '/projectManagement/jontProjectDetail/projectApproval'
            let name = 'projectApproval'
            this.close ({ tagName, path, name })
        },
        upLoadFileCallBack(item) {
            this.fileList = item
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
        getJson() {
            formGetJson({code: PORJECT_INFO.NEWAGENT}).then(res => {
                this.jsonData = JSON.parse(res)
            })
        },
        dialogComfirm () {
            this.$refs.voucher.comfirmData().then(res=> {
                this.voucherShow = false;
                this.visible = true;
                this.title = '审批'
                this.consent['flag'] = '1'
            })
        },
        valueChange(field, value, model){},
        subNewPro() {
            let bottomInformation = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData().then(res => {
                if(res && bottomInformation) {
                    res = Object.assign({}, res, bottomInformation)
                    res.fileList = this.fileList
                    res.associatedPersonId = this.values.associatedPersonId
                    let addLineData = this.$refs.payAddLine.getData()
                    res.deductList = this.$refs.addline1.getData()
                    res.abaAddLine = addLineData.tableData
                    res.totalMoney = this.form.totalAmount;
                    res.bigWriteCharge = this.form.bigWriteCharge
                    res.projectId = this.values.projectId
                    let tem = {
                        id: this.proId,
                        agentBusiness: res
                    }
                    if(Number(res.totalMoney) > Number(res.balance)){
                        this.$message.warning("支付金额不能大于项目可用金额,请重新填写!!!", 2000)
                    }else{
                        // tem.agentBusiness.deductList.map(item => {
                        //     item.money = Number(item.money).toFixed(2)
                        // })
                        // tem.agentBusiness.abaAddLine.map(item => {
                        //     item.paymentAmount = Number(item.paymentAmount).toFixed(2)
                        // })
                        // console.log(tem);
                        // return
                        if(this.$route.params.isAdd){
                            agentBusinessAdd(tem).then(res => {
                                that.$message.success("添加成功~~~")
                                that.cancel()
                            })
                        }else{
                            tem.agentBusiness.id = this.values.id
                            agentBusinessEdit(tem).then(res => {
                                that.$message.success("修改成功~~~")
                                that.cancel()
                            })
                        }
                    }
                }
            })
        },
        subProcess(){
            let bottomInformation = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData().then(res => {
                if (res && bottomInformation) {
                    res = Object.assign({}, res, bottomInformation)
                    res.associatedPersonId = this.values.associatedPersonId
                    let addLineData = this.$refs.payAddLine.getData()
                    res.deductList = this.$refs.addline1.getData()
                    res.abaAddLine = addLineData.tableData
                    res.totalMoney = this.form.totalAmount
                    res.bigWriteCharge = this.form.bigWriteCharge
                    res.projectId = this.values.projectId
                    res.fileList = this.fileList
                    if(res.totalMoney === '0') {
                        this.$message.warning('合计金额为0, 不能提交!!!')
                        return false
                    }
                    if(!this.$route.params.isAdd){
                        res.id = this.$route.params.agentInfo.id
                    }
                    res.deductList.map(item => {
                        item.money = Number(item.money).toFixed(2)
                    })
                    res.abaAddLine.map(item => {
                        item.paymentAmount = Number(item.paymentAmount).toFixed(2)
                    })
                    this.subValue = res
                    if(Number(res.totalMoney) > Number(res.balance)){
                        this.$message.warning("支付金额不能大于项目可用金额,请重新填写!!!", 2000)
                    }else{
                        this.processModuleId = 'newAgent'
                        this.prossValue.title = '材料库代收代付申请, 金额:【' + this.formData.payMoney + '元】'
                        this.dialogVisible = true
                    }
                }
            })
        },
        selectDataFun(data){
            this.subValue.completeTask = data
            if (this.isSendBack) {
                this.subValue.completeTask.taskId = this.taskId
                this.subValue.companyPayList = []
                this.subValue.flag = '4'
                this.subValue.procInstId = this.procInstId
                agentBusinessOperation(this.subValue).then(res => {
                    this.$message.success('重新提交成功~~~')
                    this.cancel()
                })
            } else {
                let tem = {
                    id: this.subValue.projectId,
                    agentBusiness: this.subValue
                }
                agentBusinessSubmit(tem).then(res => {
                    this.dialogVisible = false
                    this.$message.success("提交成功~~~")
                    this.cancel()
                })
            }
        },
        closeFun () {
            this.dialogVisible = false
        },
        cancel(){
            this.$router.go(-1)
            let tagName = this.$route.path
            this.close ({ tagName })
        },
        async printTemplate () {
            getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.$route.params.agentInfo.id}).then(res => {
                if (res) this.$refs.printTemp.printTemplate (res)
            })
        },
        setProjectId(){
            getProById({id: this.proId}).then(res => {
                delete res.companyId
                delete res.companyName
                delete res.createBy
                delete res.createName
                delete res.createTime
                delete res.departmentId
                delete res.departmentName

                this.hint = res.state === '3' ? false :true ;
                this.values = Object.assign({}, this.values, res)
                this.values.projectId = res.id
                this.values.associatedPerson = res.associatedPerson
                this.values.associatedPersonId = res.associatedPersonId
                this.values.section = res.section
                this.values.projectName = res.projectName
                this.values.phone = res.phone
                this.values.balance = res.balance + ''
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
            agentBusinessQueryById({id:this.pushData.processVariables.relevancyId}).then(res => {
                this.tabShow = true
                res.balance += ''
                this.values = res
                this.cloneData = Object.assign({},res)
                this.addLineData['tableData'] = res.abaAddLine
                this.addLineData1 = res.deductList
                this.accDataInfo = res.companyPayList
                this.form.totalAmount = this.values.totalMoney + ''
                this.form.bigWriteCharge = util.convertCurrency (this.form.totalAmount)
                this.addLineChange1(this.addLineData1)
                this.addLineChange3(this.addLineData['tableData'])
                this.isShowDetails = true
                this.fileList = res.fileList
                if (!this.$route.params.transform.isShowDetails) {
                    this.addLineData1.forEach((item, index) => {
                        item.canDel = true
                        this.$set(this.addLineData1, index, item)
                    })
                    this.isProcess = false
                    this.showReject = false
                    this.isShowDetails = false
                    this.fromProcess = false
                }
                this.setFile(res.fileList)
            })
        },
        consentBorrowingApply(item = '', boolean = false){
            this.visible = this.isTurnManage = this.isReject = false
            if (boolean) {
                this.cancel ()
                return
            }
            if (item) {
                let res = this.values
                res.companyPayList = this.$refs.accountant.getData()
                res['completeTask'] = item
                res.flag = this.flag
                res.procInstId = this.procInstId
                res.deductList = this.$refs.addline1.getData()
                res.totalMoney = this.form.totalAmount
                res.bigWriteCharge = this.form.bigWriteCharge
                agentBusinessOperation(res).then(res => {
                    if (res.code === 200) {
                        this.$message.success ("同意成功")
                        this.cancel()
                    }
                })
            }
        },
        consentFun (){
            this.visible = true
            this.title = '审批'
            this.consent['flag'] = '1'
        },
        turnToFun (){
            this.isShow = true
        },
        clearUserPage(item) {
            if (item.length > 0) {
                this.isShow = !this.isShow
                let data = [];
                for (let i = 0; i < item.length; i++) {
                    let str = item[i].id
                    data.push(str)
                }
                const h = this.$createElement;
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
                            this.cancel()
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });
            } else {
                this.$message.error('请选择要转办的部门或人员')
            }
        },
        returnBtn () {
            this.rejectShow = true;
        },
        invalidBtn () {
            this.$prompt('此操作将作废该条数据，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                cancelButtonClass: "btn-custom-cancel",
                inputPattern: /^\S/,
                inputErrorMessage: '请输入作废理由'
            }).then(({ value }) => {
                let tem = this.values
                tem.flag = '3'
                tem.completeTask = {
                    "taskId":this.taskId,
                    "msg":value
                }
                tem.companyPayList = this.$refs.accountant.getData()
                agentBusinessOperation(tem).then(res => {
                    this.$message.success("作废成功")
                    this.cancel()
                })
            })
        },
        rejectCancel () {
            this.rejectShow = false
        },
        rejectOk () {
            this.$refs['form'].validate((valid) => {
                let tem = this.values
                tem.flag = '2'
                tem.completeTask = {
                    "taskId":this.taskId,
                    activityId: this.form.rejectVal,
                    msg: this.form.paymessage
                }
                tem.companyPayList = this.$refs.accountant.getData()
                agentBusinessOperation(tem).then(res => {
                    this.$message.success("驳回成功")
                    this.cancel()
                })
            })
        },
        anewSubmitBtn(){
            let bottomInformation = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData().then(res => {
                if(res && bottomInformation) {
                    res = Object.assign({}, res, bottomInformation)
                    res.fileList = this.fileList
                    res.associatedPersonId = this.values.associatedPersonId
                    let addLineData = this.$refs.payAddLine.getData()
                    res.deductList = this.$refs.addline1.getData()
                    res.abaAddLine = addLineData.tableData
                    res.totalMoney = this.form.totalAmount
                    res.bigWriteCharge = this.form.bigWriteCharge
                    res.projectId = this.values.projectId
                    this.subValue = res
                    this.subValue.id = this.values.id

                    this.processModuleId = 'newAgent'
                    this.prossValue.title = '材料库代收代付申请, 金额:【' + this.formData.payMoney + '元】'

                    this.prossValue.pdfId = this.pushData.procDefId
                    this.prossValue.degree = this.pushData.processVariables.degree
                    this.dialogVisible = true
                }
            })
        },

/** -----------------------------------------------------------代收代付添加应扣金额--------------------------------------------------------------- */
        
        getProjectAllOptionsList () {
            getProjectAllOptions().then(option => {
                this.costType = option.costType
            })
        },

        handleClick(tab) {
            switch(tab.name) {
                case 'first':
                    this.$refs.addline1.doLayout()
                    break
            }
        },

        addLineChange1 (arr, index) {
            this.addAccount(arr, '1', index)
        },

        addLineChange3(arr, index){
            this.addAccount(arr, '3', index)
        },

        addAccount (arr, type, index){
            if(arr && arr.length > 0){
                let account = 0
                arr.forEach(item => {
                    if(!item.isCount || item.isCount === '1' || !this.fromProcess){
                        account += Number(item.money ? item.money : item.paymentAmount ? item.paymentAmount : 0)
                    }
                })
                switch (type){
                    case '1':
                        this.label1 = '本次应扣: ' + util.moneyTransform(account) + '元'
                        this.formData.deductMoney = account.toFixed(2)
                        break
                    case '3':
                        this.label2 = '本次支付: ' + util.moneyTransform(account) + '元'
                        this.formData.payMoney = account.toFixed(2)
                        break
                }
                
            } else {
                switch (type){
                    case '1':
                        this.label1 = '本次应扣: ' + 0.00 + '元'
                        this.formData.deductMoney = '0.00'
                        break
                    case '3':
                        this.label2 = '本次支付: ' + 0.00 + '元'
                        this.formData.payMoney = '0.00'
                        break
                }
            }
            this.setBalance(type, index)
        },

        setBalance (type, index) {
            let practicalBalanceTem = parseFloat(util.addNum (this.formData.payMoney, this.formData.deductMoney)).toFixed(2)
            if(practicalBalanceTem < 0  && index == undefined){ 
                this.$message.warning("支付后剩余金额不能为负!!!")
                this.resetRelateTable (type, index)
            } else if (Number (practicalBalanceTem) > Number (this.values.balance)  && index == undefined) {
                this.$message.warning("支付不能大于项目可用金额!!!")
                this.resetRelateTable (type, index)
            } else {
                this.form.totalAmount = practicalBalanceTem
                this.form.bigWriteCharge = util.convertCurrency(practicalBalanceTem)
            }
        },

        resetRelateTable (type, index) {
            let temData = []
            switch(type){
                case '1':
                    temData = this.$refs.addline1.getData()
                    temData[index].money = '0'
                    this.addLineData1 = temData
                    this.addLineChange1(temData, index)
                    break
                case '3' :
                    temData = this.$refs.payAddLine.getData()
                    temData.tableData[index].paymentAmount = '0'
                    this.addLineData = temData
                    this.addLineChange3(temData.tableData, index)
                    break
                default:
                    break
            }
            this.form.totalAmount = '0',
            this.form.bigWriteCharge = util.convertCurrency('0')
        }
    },

    created () {
        this.getJson()
        this.getProjectAllOptionsList ()
    },

    async mounted() {
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
                    this.showReject = true,
                    this.isProcess = false,
                    this.transform.isShowDetails = true
                    break
                case "sendBack":
                    this.isSendBack = true
                    this.backlog = false
                    this.transform.isShowDetails = false
                    break
                case "examine":
                    if(this.pushData.processVariables.processState === '6'){
                        this.isSendBack = true
                        this.backlog = false
                        this.showAccReject = false
                        this.transform.isShowDetails = false
                        break
                    }
                default:
                    this.backlog = false
                    this.isSendBack = false
                    this.transform.isShowDetails = true
                    break
            }
        }else{
            this.fromProcess = false
            const db = await this.$store.dispatch('d2admin/db/database', {user: true})
            this.proId = db.get('proID').value()
            that = this
            this.transform.isShowDetails = this.$route.params.isShowDetail
            if(this.$route.params.isAdd){
                this.isProcess = false
                this.showReject = false
                this.setProjectId()
            }else{
                this.values = this.$route.params.agentInfo
                this.addLineData['tableData'] = this.$route.params.agentInfo.abaAddLine
                this.addLineData1 = this.$route.params.agentInfo.deductList
                this.values.balance = this.values.balance + ''
                this.form.totalAmount = this.values.totalMoney + ''
                this.form.bigWriteCharge = util.convertCurrency (this.form.totalAmount)
                this.addLineChange1(this.addLineData1)
                this.addLineChange3(this.addLineData['tableData'])
                if(util.isString(this.$route.params.agentInfo.procInstId)  && this.$route.params.agentInfo.procInstId !== ''){
                    this.fromProcess = this.$route.params.isShowDetail
                    this.isShowDetails = this.$route.params.isShowDetail1
                    this.backlog = false
                    this.isSendBack = false
                    this.tabShow = true
                    this.taskId = this.$route.params.agentInfo.taskId
                    this.procInstId = this.$route.params.agentInfo.procInstId
                    this.pdfId = this.$route.params.agentInfo.procDefId
                    this.accDataInfo = util.isArray(this.$route.params.agentInfo.companyPayList) ? this.$route.params.agentInfo.companyPayList : []
                } else if (this.$route.params.agentInfo.procState === '1') {
                    this.fromProcess = false
                    this.isProcess = false
                    if(util.isArray(this.addLineData1) && !this.$route.params.isShowDetail) {
                        this.addLineData1.forEach((item, index) => {
                            item.canDel = true
                            this.$set(this.addLineData1, index, item)
                        })
                    }
                    this.isShowDetails = this.$route.params.isShowDetail ? true : false
                }
                this.fileList = this.values.fileList
                this.setFile(this.values.fileList)
            }
        }
    }
}
</script>
<style lang="scss">
.project-common-in {
    .drawer-btn{
        text-align: center;
    }
    .project-common-in-tabs {
        .el-tabs__item{
            padding: 0px 30px;
            height: 50px;
            line-height: 50px;
            font-weight: bold;
            background-color: #FFF;
        }
        .el-tabs__item.is-active{
            background-color: #409EFF;
            color: #FFF;
        }
        .right-balance{
            position: absolute;
            top: 20px;  
            right: 20px;
            p{
                text-align: right;
                line-height: 25px;
                font-size: 14px;
                color: #777;
                font-weight: bold;
            }
        }
    }
    .totalAmount-form {
        padding-top: 20px;
    }
}
</style>
