<template>
    <d2-container class="address-book open-tender">
        <el-card class="box-card cash-return closeHeader">
            <div slot="header"><el-button type="text" @click="closeTab"><i class="el-icon-close"></i></el-button></div>
            <div v-if="fromProcess">
                <qqt-flow-tabs v-if="tabShow" :procInstId="procInstId" :isProcessInstance='isProcessInstance' :pdfId="pdfId">
                    <template slot="content">
                        <el-form ref="infoForm" :model="formData" :rules="rules" label-width="150px">
                            <el-divider>项目基本信息</el-divider>
                            <div class="project-base-info">
                                <el-row>
                                    <el-col :span="16"><el-form-item label="项目名称:" required><el-input size="medium" v-model="formData.projectName" disabled /></el-form-item></el-col>
                                    <el-col :span="8"><el-form-item label="标段:" required><el-input size="medium" v-model="formData.section" disabled /></el-form-item></el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="8"><el-form-item label="联营人:" required><el-input size="medium" v-model="formData.associatedPerson" disabled /></el-form-item></el-col>
                                    <el-col :span="8"><el-form-item label="联系电话:" required><el-input size="medium" v-model="formData.phone" disabled /></el-form-item></el-col>
                                    <el-col :span="8" v-if="notshow"><el-form-item label="累计到账总金额:" required><el-input size="medium" v-model="formData.projectTotalMoney" disabled>
                                        <template slot="append">元</template></el-input></el-form-item></el-col>
                                    <el-col :span="8"><el-form-item label="中标时间:"><el-input size="medium" v-model="formData.theWinningTime" disabled /></el-form-item></el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="8"><el-form-item label="中标价:">
                                        <qqt-input v-model="formData.tenderPrice" :value="formData.tenderPrice" :isShowElement="notshow" 
                                                :isMoneyType="isMoneyType" :btnTitle="'元'"></qqt-input>
                                        </el-form-item></el-col>
                                    <el-col :span="8"><el-form-item label="项目所在地:"><el-input size="medium" v-model="formData.projectLocation" disabled /></el-form-item></el-col>
                                    <el-col :span="8"><el-form-item label="施工管理负责人:"><el-input size="medium" v-model="formData.managerPrincipal" disabled /></el-form-item></el-col>
                                    <el-col :span="8" v-if="notshow"><el-form-item label="工程款余额:" required><el-input size="medium" v-model="formData.projectBalance" disabled>
                                        <template slot="append">元</template></el-input></el-form-item></el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="8"><el-form-item label="财务管理负责人:"><el-input size="medium" v-model="formData.financePrincipal" disabled /></el-form-item></el-col>
                                </el-row>
                            </div>
                            <div class="retuern-content">
                                <div class="right-balance">
                                    <p>本次可支付联营人工程款金额: {{ projectBalance }}元</p>
                                    <p>支付后剩余工程款金额: {{ practicalBalance }}元</p>
                                </div>
                                <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                                    <el-tab-pane :label="label1" name="first">
                                        <addline1 :isShowDetails='isShowDetails' :isSendBack="isSendBack" :costType="costType" :showAddName="showAddName" :title="addTitle" @change="addLineChange1" :showReject='showReject' :isProcess='isProcess' :dataInfo='addLineData1' ref="addline1"></addline1>
                                    </el-tab-pane>
                                    <el-tab-pane :label="label2" name="second">
                                        <addline1 :isShowDetails='isShowDetails' :isSendBack="isSendBack" :costType="costType" :showAddName="showAddName" :title="addTitle1" @change="addLineChange2" :showReject='showReject' :isProcess='isProcess' :dataInfo='addLineData2' ref="addline2"></addline1>
                                    </el-tab-pane>
                                    <el-tab-pane :label="label3" name="third">
                                        <pay-add-line :isShowDetails='isShowDetails' @change="addLineChange3" :associatedPersonId='associatedPersonId' :dataInfo='addLineData3' ref="addline3"></pay-add-line>
                                    </el-tab-pane>
                                </el-tabs>
                            </div>
                            <div>
                            <div v-if="showExamineContent">
                                <accountant :isShowDetails="accShowDetail" :dataInfo="accDataInfo" ref="accountant"></accountant>
                                <advisory-list :dataInfo="advisoryList" :isShowDetails="accShowDetail" ref="advisoryList"></advisory-list>
                            </div>
                            </div>
                            <div class="up-load-div">
                                <el-divider content-position="left">附件</el-divider>
                                <up-load :isShowUpload="!isShowDetails" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList" ref="upload"/>
                            </div>
                            <div>
                                <el-divider>备注</el-divider>
                                <el-row class="remark">
                                    <el-col :span="24">
                                        <el-input v-model="formData.remark" v-if="!isShowDetails" placeholder="请输入" type="textarea"></el-input>
                                        <p v-if="isShowDetails">{{ formData.remark }}</p>
                                    </el-col>
                                </el-row>
                            </div>
                            <bottomInformation :values="formData" :isGrid="false" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
                            <el-row>
                                <el-col :span="24" style="text-align:center" class="d2-mt-20">
                                    <qqt-look-voucher :data="cloneData" ref="voucher"></qqt-look-voucher>
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
                        </el-form>
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
                        <el-button @click="rejectCancel">取 消</el-button>
                        <el-button type="primary" @click="rejectOk">确 定</el-button>
                    </span>
                </el-dialog>
            </div>
            <div v-if="!fromProcess">
                <el-form ref="infoForm" :model="formData" :rules="rules" label-width="150px">
                    <el-divider>项目基本信息</el-divider>
                    <div class="project-base-info">
                        <el-row>
                            <el-col :span="16"><el-form-item label="项目名称:" required><el-input size="medium" v-model="formData.projectName" disabled /></el-form-item></el-col>
                            <el-col :span="8"><el-form-item label="标段:" required><el-input size="medium" v-model="formData.section" disabled /></el-form-item></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8"><el-form-item label="联营人:" required><el-input size="medium" v-model="formData.associatedPerson" disabled /></el-form-item></el-col>
                            <el-col :span="8"><el-form-item label="联系电话:" required><el-input size="medium" v-model="formData.phone" disabled /></el-form-item></el-col>
                            <el-col :span="8" v-if="notshow"><el-form-item label="累计到账总金额:" required><el-input size="medium" v-model="formData.projectTotalMoney" disabled>
                                <template slot="append">元</template></el-input></el-form-item></el-col>
                            <el-col :span="8"><el-form-item label="中标时间:"><el-input size="medium" v-model="formData.theWinningTime" disabled /></el-form-item></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8"><el-form-item label="中标价:">
                                <qqt-input v-model="formData.tenderPrice" :value="formData.tenderPrice" :isShowElement="notshow" 
                                        :isMoneyType="isMoneyType" :size="'medium'" :btnTitle="'元'"></qqt-input>
                                </el-form-item></el-col>
                            <el-col :span="8"><el-form-item label="项目所在地:"><el-input size="medium" v-model="formData.projectLocation" disabled /></el-form-item></el-col>
                            <el-col :span="8"><el-form-item label="施工管理负责人:"><el-input size="medium" v-model="formData.managerPrincipal" disabled /></el-form-item></el-col>
                            <el-col :span="8" v-if="notshow"><el-form-item label="工程款余额:" required><el-input size="medium" v-model="formData.projectBalance" disabled>
                                <template slot="append">元</template></el-input></el-form-item></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8"><el-form-item label="财务管理负责人:"><el-input size="medium" v-model="formData.financePrincipal" disabled /></el-form-item></el-col>
                        </el-row>
                    </div>
                    <div class="retuern-content">
                        <div class="right-balance">
                            <p>本次可支付联营人工程款金额: {{ projectBalance }}元</p>
                            <p>支付后剩余工程款金额: {{ practicalBalance }}元</p>
                        </div>
                        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                            <el-tab-pane :label="label1" name="first">
                                <addline1 :isShowDetails='isShowDetails' :isSendBack="isSendBack" :showAddName="showAddName" :costType="costType" :title="addTitle" @change="addLineChange1" :dataInfo='addLineData1' ref="addline1"></addline1>
                            </el-tab-pane>
                            <el-tab-pane :label="label2" name="second">
                                <addline1 :isShowDetails='isShowDetails' :isSendBack="isSendBack" :showAddName="showAddName" :costType="costType" :title="addTitle1" @change="addLineChange2" :dataInfo='addLineData2' ref="addline2"></addline1>
                            </el-tab-pane>
                            <el-tab-pane :label="label3" name="third">
                                <pay-add-line :isShowDetails='isShowDetails' @change="addLineChange3" :associatedPersonId='associatedPersonId' :dataInfo='addLineData3' ref="addline3"></pay-add-line>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                    <div class="up-load-div">
                        <el-divider content-position="left">附件</el-divider>
                        <up-load :isShowUpload="!isShowDetails" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList" ref="upload"/>
                    </div>
                    <div>
                        <el-divider>备注</el-divider>
                        <el-row class="remark">
                            <el-col :span="24">
                                <el-input v-model="formData.remark" v-if="!isShowDetails" placeholder="请输入" type="textarea"></el-input>
                                <p v-if="isShowDetails">{{ formData.remark }}</p>
                            </el-col>
                        </el-row>
                    </div>
                    <bottomInformation :values="formData" :isGrid="false" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
                    <div class="btn-group">
                        <el-button type="warning" v-if="!isShowDetails" @click="saveFun" size="small">保存</el-button>
                        <el-button type="primary" v-if="!isShowDetails && $has('joint:payment:submit')" @click="subFun" size="small">提交</el-button>
                        <el-button type="info" size="small" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                        <el-button size="small" v-if="!isShowDetails" @click="closeTab">取消</el-button>
                        <el-button type="primary" v-if="isShowDetails" @click="closeTab" size="small">关闭</el-button>
                    </div>
                </el-form>
            </div>
        </el-card>
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
        <user-modules :showDialog="isShow" :userIds="user" :department="department" @clearUserPage="clearUserPage" @closeFun="isShow = false"></user-modules>
        <qqt-send-process v-if="dialogVisible" :isSendBack='isSendBack' :dialogVisible="dialogVisible" :prossValue="prossValue" :processModuleId="processModuleId" @close="closeFun" @selectData="selectDataFun"></qqt-send-process>
        <qqt-consent :dialogVisible="visible" :title="title" :msg="msg" :taskId="taskId || ''" :type="consent['flag']" :isTurnManage="isTurnManage" :isReject="isReject" @close="consentBorrowingApply" />
        <el-dialog v-dialogDrag append-to-body title="提示" :visible.sync="hint" top="10vh" width="30%" :close-on-click-modal="false" :before-close="hintEnter">
            <div style="text-align:center;">
                <img src="../../components/img/mark.png">
                <p style="color:red;text-align:center;font-size:18px;">此项目的立项审批没有通过不能进行工程款支付申请！</p>
            </div>
            <span slot="footer" class="dialog-footer" style="text-align:center;padding-left:40px;display:block;">
                <el-button size="mini" type="primary" @click="hintEnter">去立项登记查看</el-button>
            </span>
        </el-dialog>
    </d2-container>
</template>
<script>
import { getProById,getProjectAllOptions, getProjectApprovalById } from '../../../../../api/jointProject/index'
import { mapActions } from 'vuex'
import { qqtSendProcess } from '@/components/qqt-subassembly'
import { getDetails,findReverseRoute,careOf} from '../../../../../api/approval/common'
import { qqtFlowDiagram,qqtFlowTabs,qqtConsent, qqtInput,qqtLookVoucher,upload} from '../../../../../components/qqt-subassembly'
import util from '../../../../../libs/util'
import addline1 from './addlines/addline1'
import payAddLine from './addlines/payAddLine'
import { getByAccountTypeListAll, getByAccountByAssociatedId } from '../../../../../api/financialManagement/staffLoan/index'
import advisoryList from '../../../../approval/components/pushPage/projectPayment/components/advisoryList'
import { projectPaymenQueryById, projectPaymentOperation } from '../../../../../api/jointProject/projectPayment/index.js'
import { projectPaymentAdd,projectPaymentEdit,projectPaymentSub,} from '../../../../../api/jointProject/projectPayment/index'
import bottomInformation from '../../../selfSupportProjectDetail/businessBidding/components/bottomInformation'
import userModules from '../../../../systemManagement/processDefinition/processModules/userModules'
import accountant from '../../../../approval/components/pushPage/projectCashRequest/components/accountant'
import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
import printTemplateByHtml from '@/views/systemManagement/printTemplate/components/printTemplateByHtml'
export default {
    name: 'projectPaymentAdd',
    components: {
        addline1,
        payAddLine,
        qqtSendProcess,
        userModules,
        accountant,
        advisoryList,
        qqtFlowDiagram,
        qqtFlowTabs,
        qqtConsent,
        'up-load': upload,
        'qqt-input': qqtInput,
        qqtLookVoucher,
        bottomInformation,
        'print-template-by-html': printTemplateByHtml
    },
    data() {
        return {
            //提示
            cloneData: {},
            hint: false,
            notshow: false,
            costType: [],
            showReject: false,
            isProcess: false,
            formData: {
                projectId: '',
                projectName: '',
                section: '',
                phone: '',
                marginType: '',
                marginCode: '',
                associatedPerson: '',
                balance: '',
            },
            isMoneyType: true,
            rules: {},
            isShowDetails: false,
            transform: {
                isShowDetails: this.isShowDetails
            },
            activeName: 'first',
            label1: '本次应扣: 0元',
            label2: '本次暂押: 0元',
            label3: '本次支付: 0元',
            projectBalance: 0,  // 工程款余额
            practicalBalance: 0,  // 支付后剩余金额
            isSendBack: [],
            addLineData1: [],
            addLineData2: [],
            addLineData3: [],
            accDataInfo: [],
            fromProcess: false,
            advisoryList: [],
            associatedPersonId: '',
            accShowDetail: false,

            backlog: false,
            isSendBack: false,
            dialogVisible: false,
            prossValue: {},
            processModuleId: '',
            subValue: {},
            taskId: '',
            procInstId: '',
            pdfId: '',
            msg: '',
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
            // 是否显示部长和会计审批的内容
            showExamineContent: true,
            temFormData: {},
            pushData: {},

            addTitle: {
                line1: '应扣费用名称',
                line2: '应扣金额',
                line3: '扣款说明'
            },
            addTitle1: {
                line1: '暂押费用名称',
                line2: '暂押金额',
                line3: '暂押说明'
            },
            // 新组件
            isTurnManage: false,
            consent: {},
            visible: false,
            isReject: false,
            title: '',
            showAddName: true,
            fileList: [],
            upLoadFileDefaultList: [],
            code: BASICSCODE.JOINT_PROJECT_PAYMENT,
            typeOptions: [
                {
                    value:'1',
                    label:'公司员工账户',
                },{
                    value:'2',
                    label:'联营人账户',
                },{
                    value:'3',
                    label:'公共资源交易中心账户',
                },{
                    value:'4',
                    label:'物资设备供应商账户',
                },{
                    value:'5',
                    label:'业主付款账户',
                },{
                    value:'7',
                    label:'劳务分包商账户',
                },{
                    value:'8',
                    label:'其他账户',
                },{
                    value:'9',
                    label:'公司账户',
                },
            ],
        }
    },
    methods: {
        ...mapActions('d2admin/page', [
            'close',
            'open'
        ]),
        hintClose(){
            this.hint = false;
        },
        hintEnter(){
            let tagName = this.$route.path
            let path = '/projectManagement/jontProjectDetail/projectApproval'
            let name = 'projectApproval'
            this.close ({ tagName, path, name })
        },
        handleClick(tab) {
            switch(tab.name) {
                case 'first':
                    this.$refs.addline1.doLayout()
                    break
                case 'second':
                    this.$refs.addline2.doLayout()
                    break
            }
        },
        upLoadFileCallBack (data) {
            this.fileList = data
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
        getListData () {
            this.formData.deductList = this.$refs.addline1.getData()
            this.formData.pledgeList = this.$refs.addline2.getData()
            this.formData.payList = this.$refs.addline3.getData()
            this.formData.surplusMoney = this.practicalBalance
            this.formData.fileList = this.fileList
        },
        subFun() {
            let bottomInformation = this.$refs.bottomInformation.getData ()
            this.$refs.infoForm.validate((valid) => {
                if (valid && bottomInformation) {
                    this.formData = Object.assign({}, this.formData, bottomInformation)
                    this.getListData()
                    if(this.practicalBalance < 0){
                        this.$message.warning("支付后的金额不能为负!!!")
                    }else{
                        this.processModuleId = 'projectPaymentAdd'
                        this.prossValue.title = '工程款支付审批, 金额:[' + util.moneyTransform(this.formData.payMoney) + '元]'
                        this.dialogVisible = true
                    }
                }
            })
        },
        closeFun () {
            this.dialogVisible = false
        },
        selectDataFun (data) {
            if(this.isSendBack){
                // 重新提交
                let tem = this.formData
                tem.completeTask = data
                tem.completeTask.taskId = this.pushData.taskId
                tem.flag = '1'
                tem.procInstId = this.procInstId
                projectPaymentOperation(tem).then(res => {
                    this.$message.success("重新提交成功")
                    this.closeTab()
                })
            } else {
                this.formData.completeTask = data
                let tem = {
                    id: this.formData.projectId,
                    projectPayment: this.formData
                }
                projectPaymentSub(tem).then(res => {
                    this.dialogVisible = false
                    this.$message.success("提交成功~~~")
                    this.closeTab()
                })
            }
        },
        saveFun(){
            let bottomInformation = this.$refs.bottomInformation.getData ()
            this.$refs.infoForm.validate((valid) => {
                if (valid && bottomInformation) {
                    this.formData = Object.assign({}, this.formData, bottomInformation)
                    this.getListData()
                    let tem = {
                        id: this.formData.projectId,
                        projectPayment: this.formData
                    }
                    if(this.practicalBalance < 0){
                        this.$message.warning("支付后的金额不能为负!!!")
                    }else{
                        if(this.$route.params.isAdd){
                            projectPaymentAdd(tem).then(res => {
                                this.$message.success("添加成功~~~")
                                this.closeTab()
                            })
                        }else{
                            projectPaymentEdit(tem).then(res => {
                                this.$message.success("编辑成功~~~")
                                this.closeTab()
                            })
                        }
                    }
                }
            })
        },
        addLineChange1(arr, index){
            this.addAccount(arr, '1', index)
        },
        addLineChange2(arr, index){
            this.addAccount(arr, '2', index)
        },
        addLineChange3(arr, index){
            this.addAccount(arr, '3', index)
        },
        addAccount (arr, type, index){
            if(arr && arr.length > 0){
                let account = 0
                arr.forEach(item => {
                    if(!item.isCount || item.isCount === '1' || !this.fromProcess){
                        account += Number(item.money !== '' ? item.money : '0')
                    }
                })
                switch (type){
                    case '1':
                        this.label1 = '本次应扣: ' + util.moneyTransform(account) + '元'
                        this.formData.deductMoney = account
                        break
                    case '2':
                        this.label2 = '本次暂押: ' + util.moneyTransform(account) + '元'
                        this.formData.pledgeMoney = account
                        break
                    case '3':
                        this.label3 = '本次支付: ' + util.moneyTransform(account) + '元'
                        this.formData.payMoney = account
                        break
                    default:
                        break
                }
                this.setBalance(type, index)
            }
        },
        calcutePay (payMoneyList) {
            let moneyTem = 0
            payMoneyList.forEach(item => {
                moneyTem += Number(item.money !== '' ? item.money : '0')
            })
            this.label3 = '本次支付: ' + util.moneyTransform(parseFloat(moneyTem).toFixed(2)) + '元'
            this.formData.payMoney =  parseFloat(moneyTem).toFixed(2)
        },
        setBalance(type, index){
            let balanceTem = parseFloat(util.subtraction(util.subtraction (this.formData.projectBalance, this.formData.deductMoney), this.formData.pledgeMoney)).toFixed(2)
            let practicalBalanceTem = parseFloat(util.subtraction(balanceTem, this.formData.payMoney)).toFixed(2)
            if(practicalBalanceTem < 0){ 
                if(-practicalBalanceTem < Number(this.formData.payMoney && type !== '3')){
                    this.practicalBalance = '0.00'
                    let payMoneyList = this.$refs.addline3.getData()
                    try {
                        payMoneyList.forEach(item => {
                            practicalBalanceTem = Number(practicalBalanceTem) + Number(item.money)
                            if (practicalBalanceTem < 0) {
                                item.money = 0.00
                            } else {
                                item.money = practicalBalanceTem
                                this.calcutePay(payMoneyList)
                                throw new Error("end")
                            }
                        })
                    } catch (e) {
                        if (e.message !== "end") { throw e }
                    }
                } else {
                    this.$message.warning("支付金额不能为负!!!")
                    let temData = []
                    switch(type){
                        case '1':
                            temData = this.$refs.addline1.getData()
                            temData[index].money = ''
                            this.addLineData1 = temData
                            this.addLineChange1(temData, index)
                            this.cloneData.payList.forEach((item, index) => {
                                this.formData['payList'][index] = item
                            })
                            this.calcutePay(this.formData.payList)
                            break
                        case '2':
                            temData = this.$refs.addline2.getData()
                            temData[index].money = ''
                            this.addLineData2 = temData
                            this.addLineChange2(temData, index)
                            this.cloneData.payList.forEach((item, index) => {
                                this.formData['payList'][index] = item
                            })
                            this.calcutePay(this.formData.payList)
                            break
                        case '3' :
                            temData = this.$refs.addline3.getData()
                            temData[index].money = ''
                            this.addLineData3 = temData
                            this.addLineChange3(temData, index)
                            break
                        default:
                            break
                    }
                }
            } else {
                this.projectBalance = balanceTem
                this.practicalBalance = practicalBalanceTem
            }
        },
        closeTab() {
            this.$router.go(-1)
            let tagName = this.$route.path
            this.close ({ tagName })
        },
        printTemplate () {
            getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.$route.params.paymentInfo.id}).then(res => {
                if (res) {
                    res.payList.forEach (item => {
                        if (item.untitled) {
                            let data = this.typeOptions.find (f => f.value == item.untitled)
                            if (data) item.untitled1 = data.label
                        }
                    })
                    this.$refs.printTemp.printTemplate (res)
                }
            })
        },
        getProjectInfo(){
            getProjectApprovalById({ id: this.projectId }).then(res => {
                delete res.procInstId;
                delete res.procState;
                delete res.id;
                delete res.createBy;
                delete res.createName;
                delete res.createTime;
                delete res.remark;
                res.tenderPrice = res.tenderPrice + ''
                res.projectLocation = res.projectLocation ? util.jointData(res.projectLocation, '/') : res.projectLocation
                res.section = res.section ? util.jointData(res.section, ',') : res.section
                this.hint = res.state === '3' ? false :true ;
                this.formData = res
                this.formData.projectId = this.projectId
                this.formData.bigWrite = util.convertCurrency(res.balance)
                this.addLineData1 = [{canDel: true, name: "", money: ""}]
                this.addLineData2 = [{canDel: true, name: "", money: ""}]
                this.addLineData3 = [{}]
                this.associatedPersonId = res.associatedPersonId
                // this.formData.associatedPerson = res.associatedPerson
                this.setBalance('1', 0)
            })
        },
        consentBorrowingApply(item = '', boolean = false){
            this.visible = this.isTurnManage = this.isReject = false
            if (boolean) {
                this.closeTab ()
                return
            }
            if (item) {
                this.getListData()
                let tem = this.formData
                tem['completeTask'] = item
                tem.flag = '1'
                tem.procInstId = this.procInstId
                projectPaymentOperation(tem).then(res => {
                    if (item.type == '1') {
                        this.$refs.voucher.CNEdit();
                    }
                    this.$message.success("同意成功")
                    this.closeTab()
                })
            }
        },
        consentFun() {
            this.visible = true
            this.title = '审批'
            this.consent['flag'] = '1'
        },
        anewSubmitBtn() {
            this.getListData()
            if(this.practicalBalance < 0){
                this.$message.warning("支付后的金额不能为空!!!")
            }else{
                this.processModuleId = 'projectPaymentAdd'
                this.prossValue.title = '工程款支付审批, 金额:[' + util.moneyTransform(this.formData.payMoney) + '元]'
                this.prossValue.pdfId = this.pushData.procDefId
                this.prossValue.degree = this.pushData.processVariables.degree
                this.dialogVisible = true
            }
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
        invalidBtn() {
            let tem = this.formData
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
                projectPaymentOperation(tem).then(res => {
                    this.$message.success("作废成功")
                    this.closeTab()
                })
            })
        },
        rejectCancel(){
            this.rejectShow = false
        },
        rejectOk(){
            let tem = this.formData
            this.$refs['form'].validate((valid) => {
                tem.flag = '2'
                tem.completeTask = {
                    "taskId":this.taskId,
                    activityId: this.form.rejectVal,
                    msg: this.form.paymessage
                }
                projectPaymentOperation(tem).then(res => {
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
                    this.msg = res.msg
                })
                if(this.pushData.pathName === 'backlog'){
                    findReverseRoute(this.pushData.procDefId + '/' +this.pushData.activityId).then(res=>{
                        this.returnList = res
                    })
                }
            }
            projectPaymenQueryById({id:this.pushData.processVariables.relevancyId}).then(res => {
                res.tenderPrice = res.tenderPrice + ''
                res.payMoney = res.payMoney + ''
                res.deductMoney = res.deductMoney + ''
                res.pledgeMoney = res.pledgeMoney + ''
                this.temFormData = JSON.parse(JSON.stringify(res))
                this.formData = JSON.parse(JSON.stringify(res))
                this.cloneData = Object.assign({},res);
                this.fileList = res.fileList
                this.setFile(res.fileList)
                if(util.isArray(this.formData.deductList)){
                    this.formData.deductList.forEach(item => {
                        item.isProcess = false
                        this.isProcess = false
                        item.canDel = this.pushData.pathName === 'sendBack' ? true : false
                    })
                }
                if(util.isArray(this.formData.pledgeList)){
                    this.formData.pledgeList.forEach(item => {
                        item.isProcess = false
                        this.isProcess = false
                        item.canDel = this.pushData.pathName === 'sendBack' ? true : false
                    })
                }
                this.addLineData1 = this.formData.deductList
                this.addLineData2 = this.formData.pledgeList
                this.addLineData3 = this.formData.payList
                this.associatedPersonId = res.associatedPersonId
                this.formData.bigWrite = util.convertCurrency(this.formData.balance)
                this.label1 = '本次应扣: ' + util.moneyTransform(this.formData.deductMoney) + '元'
                this.label2 = '本次暂押: ' + util.moneyTransform(this.formData.pledgeMoney) + '元'
                this.label3 = '本次支付: ' + util.moneyTransform(this.formData.payMoney) + '元'
                this.setBalance()
                if(util.isArray(res.advisoryList)){
                    this.advisoryList = res.advisoryList
                }
                if(util.isArray(res.companyPayList)){
                    this.accDataInfo = res.companyPayList
                }
            })
        }
    },
    created () {
        getProjectAllOptions().then(option => {
            this.costType = option.costType
        })
    },
    async mounted(){
        let pushObj = this.$route.params.detailData
        if(pushObj){
            this.fromProcess = true
            this.pushData = JSON.parse(this.$route.params.detailData)
            this.processGetInfo()
            switch(this.pushData.pathName){
                case "backlog":
                    this.isProcess = true
                    this.showReject = true
                    this.backlog = true
                    this.isSendBack = false
                    this.isShowDetails = true
                    this.transform.isShowDetails = true
                    this.accShowDetail = true
                    break
                case "sendBack":
                    this.isSendBack = true
                    this.backlog = false
                    this.isShowDetails = false
                    this.transform.isShowDetails = false
                    this.accShowDetail = true
                    break
                case "examine":
                    if(this.pushData.processVariables.processState === '6'){
                        this.isSendBack = true
                        this.backlog = false
                        this.isShowDetails = false
                        this.transform.isShowDetails = true
                        this.accShowDetail = true
                        this.showExamineContent = false
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
            const db = await this.$store.dispatch('d2admin/db/database', {user: true})
            this.projectId = db.get('proID').value()
            if(this.$route.params.isAdd){
                this.isProcess = false
                this.showReject = false
                this.isShowDetails = false
                this.getProjectInfo()
            }else{
                this.associatedPersonId = this.$route.params.paymentInfo.associatedPersonId
                this.$route.params.paymentInfo.tenderPrice = this.$route.params.paymentInfo.tenderPrice + ''
                this.formData = this.$route.params.paymentInfo
                this.fileList = this.formData.fileList
                this.setFile(this.formData.fileList)
                if (this.$route.params.showDetail) {
                    this.formData.projectBalance = util.addNum(this.formData.surplusMoney, util.addNum(this.formData.deductMoney, util.addNum(this.formData.pledgeMoney, this.formData.payMoney)))
                }
                if (this.$route.params.paymentInfo.procState === '1') {
                    this.fromProcess = false
                    this.isProcess = false
                    this.isShowDetails = this.$route.params.showDetail
                    this.transform.isShowDetails = this.$route.params.showDetail
                    this.$refs.addline1.doLayout()
                    if(util.isArray(this.formData.deductList)) {
                        this.formData.deductList.forEach((item, index) => {
                            item.canDel = true
                            this.$set(this.formData.deductList, index, item)
                        })
                    }
                    if(util.isArray(this.formData.pledgeList)) {
                        this.formData.pledgeList.forEach((item, index) => {
                            item.canDel = true
                            this.$set(this.formData.pledgeList, index, item)
                        })
                    }
                } else {
                    this.fromProcess = true
                    this.isProcess = false
                    this.isShowDetails = true
                    this.transform.isShowDetails = true
                    this.backlog = false
                    this.isSendBack = false
                    this.tabShow = true
                    this.taskId = this.$route.params.paymentInfo.taskId
                    this.procInstId = this.$route.params.paymentInfo.procInstId
                    this.pdfId = this.$route.params.paymentInfo.procDefId
                    this.accShowDetail = true
                    this.accDataInfo = util.isArray(this.$route.params.paymentInfo.companyPayList) ? this.$route.params.paymentInfo.companyPayList : []
                    this.advisoryList = util.isArray(this.$route.params.paymentInfo.advisoryList) ? this.$route.params.paymentInfo.advisoryList : []
                    this.showReject = true
                    if(util.isArray(this.formData.deductList)){
                        this.formData.deductList.forEach(item => {
                            item.isProcess = false
                        })
                    }
                    if(util.isArray(this.formData.pledgeList)){
                        this.formData.pledgeList.forEach(item => {
                            item.isProcess = false
                        })
                    }
                }
                this.addLineData1 = this.formData.deductList
                this.addLineData2 = this.formData.pledgeList
                this.addLineData3 = this.formData.payList
                this.formData.bigWrite = util.convertCurrency(this.formData.balance)
                this.label1 = '本次应扣: ' + util.moneyTransform(this.formData.deductMoney) + '元'
                this.label2 = '本次暂押: ' + util.moneyTransform(this.formData.pledgeMoney) + '元'
                this.label3 = '本次支付: ' + util.moneyTransform(this.formData.payMoney) + '元'
                this.setBalance()
            }
        }
    }
}
</script>
<style lang="scss">
.drawer-btn{
    text-align: center;
}
.open-tender{
    .el-divider__text.is-center{
        left: 80px;
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
    .cash-return{
        .el-card__body{
            .project-base-info{
                .el-form-item{
                    margin-bottom: 15px;
                }
            }
            .retuern-content{
                padding: 20px;
                background-color: #F4F9FF;
                position: relative;
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
        }
        .remark{
            padding: 0px 20px;
        }
    }
    .btn-group{
        text-align: center;
        margin: 20px 0px;
        display: block;
    }
}
</style>
