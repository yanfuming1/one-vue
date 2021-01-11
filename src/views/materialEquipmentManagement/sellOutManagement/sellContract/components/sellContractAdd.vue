<template>
    <d2-container class="address-book open-tender">
        <el-card class="box-card closeHeader">
            <div slot="header"><el-button type="text" @click="closeTab"><i class="el-icon-close"></i></el-button></div>
            <div class="qqt-container-full-center___top">
                <qqt-flow-tabs :procInstId="procInstId">
                <template slot="content">
                <div class="rent-out-box">
                    <el-form :model="rentForm" :rules="rules" size="medium" ref="rentForm" class="rentForm" label-width="120px">
                        <el-row><el-divider content-position="left">基础信息</el-divider></el-row>
                        <el-row>
                            <el-col :span="8">
                                 <el-form-item label="出售合同单号:">
                                    <qqt-input v-model="rentForm.contractcode" :value="rentForm.contractcode" :placeholder="'自动生成'" :isShowElement="noInput"></qqt-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="出售合同名称:" prop="contractname">
                                    <qqt-input v-model="rentForm.contractname" :value="rentForm.contractname" :isShowElement="!transform.isShowDetails" ></qqt-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="合同来源:">
                                    <el-select v-model="rentForm.contractSource" clearable style="width:100%;" @change="data => radioChange('contractSource', data)" :disabled="transform.isShowDetails">
                                        <el-option v-for="item in sourceList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                 <el-form-item label="仓库名称:" prop="depositoryName">
                                    <qqt-input v-model="rentForm.depositoryName" :value="rentForm.depositoryName" :isShowElement="noInput" 
                                            :btnIcon="'el-icon-plus'" @btnClick="choseFactory"></qqt-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="16">
                                 <el-form-item label="仓库地点:">
                                    <qqt-input v-model="rentForm.depositoryAddress" :value="rentForm.depositoryAddress" :isShowElement="noInput"></qqt-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                 <el-form-item label="出售申请单单号:">
                                    <qqt-input v-model="rentForm.applycode" :value="rentForm.applycode" :isShowElement="noInput"></qqt-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="16">
                                 <el-form-item label="申请单名称:" prop="applyId">
                                    <!-- <qqt-input v-model="rentForm.rentalApplicationName" :value="rentForm.rentalApplicationName" :isShowElement="noInput" ></qqt-input> -->
                                    <el-select v-if="!transform.isShowDetails" v-model="rentForm.applyId" clearable style="width:100%;" @change="data => radioChange('applyname', data)" :disabled="canChoseApplication">
                                        <el-option v-for="item in sellApplicationList" :key="item.id" :label="item.applyname" :value="item.id"></el-option>
                                    </el-select>
                                    <qqt-input v-else v-model="rentForm.applyname" :value="rentForm.applyname" :isShowElement="noInput"></qqt-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                 <el-form-item label="领用申请单编码:">
                                    <qqt-input v-model="rentForm.applySourceCode" :value="rentForm.applySourceCode" :isShowElement="noInput"></qqt-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="领用申请单名称:">
                                    <qqt-input v-model="rentForm.applySourceName" :value="rentForm.applySourceName" :isShowElement="noInput"></qqt-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="合同金额:" prop="contractMoney">
                                    <qqt-input v-model="rentForm.contractMoney" :value="rentForm.contractMoney" :isShowElement="!transform.isShowDetails" 
                                            :isMoneyType="isMoneyType" :btnTitle="'元'" @input="inputChange('contractMoney')"></qqt-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                 <el-form-item label="大写:">
                                    <qqt-input v-model="rentForm.capital" :value="rentForm.capital" :isShowElement="noInput" ></qqt-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="材料名称:" prop="goodsname">
                                    <qqt-input v-model="rentForm.goodsname" :value="rentForm.goodsname" :isShowElement="noInput" 
                                        :btnIcon="'el-icon-plus'" @btnClick="leadMaterial"></qqt-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="数量:" prop="number">
                                    <qqt-input v-model="rentForm.number" :isQuantityType="isQuantityType" :value="rentForm.number" @input="numberInput" :isShowElement="!showNumber"></qqt-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                 <el-form-item label="品牌:" prop="brandName">
                                    <qqt-input v-model="rentForm.brandName" :value="rentForm.brandName" :isShowElement="noInput" ></qqt-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="规格型号:" prop="specificationName">
                                    <qqt-input v-model="rentForm.specificationName" :value="rentForm.specificationName" :isShowElement="noInput" ></qqt-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="计量单位:" prop="unit">
                                    <qqt-input v-model="rentForm.unit" :value="rentForm.unit" :isShowElement="noInput" ></qqt-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                 <el-form-item label="类型:" prop="itemtype">
                                    <qqt-input v-model="rentForm.itemtype" :value="rentForm.itemtype" :isShowElement="noInput" ></qqt-input>
                                    <!-- <el-select v-model="rentForm.itemtype" clearable style="width:100%;" :disabled="!noInput">
                                        <el-option v-for="item in itemtype" :key="item.id" :label="item.name" :value="item.itemtype"></el-option>
                                    </el-select> -->
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="买方:" prop="buyer">
                                    <qqt-input v-model="rentForm.buyer" :value="rentForm.buyer" :isShowElement="!transform.isShowDetails" ></qqt-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="卖方:" prop="seller">
                                    <qqt-input v-model="rentForm.seller" :value="rentForm.seller" :isShowElement="!transform.isShowDetails" ></qqt-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                 <el-form-item label="签订时间:" prop="signtime">
                                    <el-date-picker value-format='yyyy-MM-dd HH:mm:ss' v-model="rentForm.signtime" type="datetime" :disabled="transform.isShowDetails"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="合同有效期:" prop="validityTime">
                                    <el-date-picker value-format='yyyy-MM-dd' v-model="rentForm.validityTime" type="daterange" range-separator="至"
                                        :unlink-panels="unlinkPanels" :disabled="transform.isShowDetails" @change="data => radioChange('validityTime', data)"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="结算方式:" prop="settlementMethod">
                                    <el-select v-model="rentForm.settlementMethod" clearable style="width:100%;" :disabled="transform.isShowDetails">
                                        <el-option v-for="item in meansPaymentsList" :key="item.id" :label="item.name" :value="item.name"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                 <el-form-item label="是否开具发票:" prop="isopen">
                                    <el-radio-group v-model="rentForm.isopen" @change="data => radioChange('isopen', data)" :disabled="canChoseOpen">
                                        <el-radio label="1">是</el-radio>
                                        <el-radio label="0">否</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="发票类型:">
                                    <el-select v-model="rentForm.invoiceType" clearable style="width:100%;" :disabled="invoiceTypeChose">
                                        <el-option v-for="item in invoiceTypeList" :key="item.id" :label="item.name" :value="item.name"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="税额:">
                                    <qqt-input v-model="rentForm.taxAmount" :value="rentForm.taxAmount" :isShowElement="!invoiceTypeChose" 
                                            :isMoneyType="isMoneyType" :btnTitle="'元'"></qqt-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                 <el-form-item label="税率:">
                                     <qqt-input v-model="rentForm.taxRate" :value="rentForm.taxRate" :isShowElement="!invoiceTypeChose" 
                                            :type="numberType" :btnTitle="'%'"></qqt-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="是否配送:" prop="isdelivery">
                                    <el-radio-group v-model="rentForm.isdelivery" :disabled="transform.isShowDetails" @change="data => radioChange('isdelivery', data)">
                                        <el-radio label="1">是</el-radio>
                                        <el-radio label="0">否</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="配送方式:">
                                    <el-select v-model="rentForm.deliveryWay" clearable style="width:100%;" :disabled="distributionChose">
                                        <el-option v-for="item in modeDistributionList" :key="item.id" :label="item.name" :value="item.name"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                 <el-form-item label="运费:">
                                    <qqt-input v-model="rentForm.freight" :value="rentForm.freight" :isShowElement="!distributionChose" 
                                        :isMoneyType="isMoneyType" :btnTitle="'元'"></qqt-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="发货日期:">
                                    <el-date-picker value-format='yyyy-MM-dd' v-model="rentForm.sendtime" type="date" :disabled="distributionChose"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="付款条件:">
                                    <qqt-input v-model="rentForm.paymentCondition" :value="rentForm.paymentCondition" :isShowElement="!transform.isShowDetails" ></qqt-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-divider content-position="left">付款协议</el-divider>
                                <!-- <adddline ref="agreementList" @changeData="addChangeData" :showDetail="transform.isShowDetails" :info="agreementListData"></adddline> -->
                                <qqt-relate-table :data="agreementListData" ref="agreementList" :replaceRules="paymentAgreementRules" :rowHeader="paymentAgreementHeader" @change="paymentAgreement" :isShowDetails="transform.isShowDetails" />
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-divider content-position="left">附件</el-divider>
                            <div class="up-load-div">
                                <up-load :isShowUpload="!transform.isShowDetails" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList" ref="upload"/>
                            </div>
                        </el-row>
                        <el-row>
                            <bottomInformation :values="rentForm" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
                        </el-row>
                    </el-form>
                </div>
                </template>
                </qqt-flow-tabs>
            </div>

            <div class="drawer-btn">
                <el-button type="warning" size="small" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, rentForm['flag'] = '1', submitPurchaseRequestData ()">重新提交</el-button>
                <el-button type="primary" size="small" v-if="stutas == 'backlog'" @click="visible = true, rentForm['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" size="small" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, rentForm['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" size="small" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, rentForm['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" size="small" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, rentForm['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId === ''" size="small" @click="save">保存</el-button>
                <el-button v-if="!transform.isShowDetails && procInstId === '' && $has('material:sell:contract:submit')" type="primary" size="small" @click="rentForm['flag'] = '1', submitPurchaseRequestData ()">提交</el-button>
                <el-button type="primary" size="small" @click="closeTab">关闭</el-button>
            </div>
        </el-card>
        <!-- <popout-material-depot :dialogVisible="popoutVisible" @close="popoutData"></popout-material-depot> -->
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataPurchaseRequest"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="rentForm['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentPurchaseRequest" />
        <popout-entreport :dialogVisible="factoryVisible" @close="getPopoutEntreport" />
        <from-warehouse :dialogVisible="popoutVisible" :depositoryId='depositoryId' @closeDialog='popoutData'></from-warehouse>
    </d2-container>
</template>
<script>
import { mapActions } from 'vuex'
import adddline from '../../../rentOutManagement/rentOutContract/components/addline'
import { queryDicById } from '../../../../../api/system/dic/dic'
import { PURCHASEREQUEST } from '../../../../../enum/DICTIONARY'
import { getDetails } from '../../../../../api/approval/common'
import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
import { upload, qqtInput, qqtSendProcess, qqtFlowTabs, qqtConsent, qqtRelateTable } from '../../../../../components/qqt-subassembly'
import popoutMaterialDepot from '../../../basicInformation/materialDepot/components/popoutMaterialDepot'
import popoutEntreport from '../../../basicInformation/entrepot/components/popoutEntreport'
import fromWarehouse from '../../../receiveManagement/components/fromWarehouse'
import { sellApplyQueryById, sellStatusApplyQueryById } from '../../../../../api/materialEquipmentManagement/sellManagement/sellApply/index'
import { sellContractQueryById, sellContractSub, sellContractReSub, sellContractAdd, sellContractEdit, sellApplyQueryIsStatus, sellContractProOperation } 
            from '../../../../../api/materialEquipmentManagement/sellManagement/sellContract/index'
import { MATERIALEQUIPMENTMANAGEMENT } from '../../../../../enum/FORMCODE'
import util from '../../../../../libs/util'
let that = this
export default {
    name: 'receiveAdd',
    components: {
        qqtInput,
        adddline,
        'up-load' : upload,
        'qqt-relate-table': qqtRelateTable,
        'popout-material-depot' : popoutMaterialDepot,
        'qqt-send-process': qqtSendProcess,
        'qqt-flow-tabs': qqtFlowTabs,
        'qqt-consent': qqtConsent,
        'popout-entreport': popoutEntreport,
        'from-warehouse': fromWarehouse,
        'bottomInformation': bottomInformation,
    },
    data () {
        return {
            upLoadFileDefaultList: [],
            fileList: [],
            transform: {
                isShowDetails: false,
            },
            isQuantityType: true,
            applyInfo: {},
            noInput: false,
            sourceList: [
                { value: '1', label: '申请单' },
                { value: '0', label: '无' }, 
            ],
            rentForm: {
                isopen: '',
                buyer: '',
                settlementMethod: '',
                validityTime: [],
                number: ''
            },
            rules: {
                'contractname': [ { required: true, message: '请输入出租单名称', trigger: ['change', 'blur'] } ],
                'buyer' : [ { required: true, message: '请输入买方', trigger: ['change', 'blur'] } ],
                'seller' : [ { required: true, message: '请输入卖方', trigger: ['change', 'blur'] } ],
                'signtime' : [ { required: true, message: '请选择签订时间', trigger: ['change', 'blur'] } ],
                'isdelivery' : [ { required: true, message: '请选择是否配送', trigger: ['change', 'blur'] } ],
                'contractMoney' : [ { required: true, message: '请输入合同金额', trigger: ['change', 'blur'] } ],
                'validityTime': [ { required: true, message: '请选择合同有效期', trigger: ['change', 'blur'] } ],
                'settlementMethod': [ { required: true, message: '请选择结算方式', trigger: ['change', 'blur'] } ],
                'isopen': [ { required: true, message: '请选择结是否开具发票', trigger: ['change', 'blur'] } ],
                'number': [ { required: true, message: '请输入数量', trigger: ['change', 'blur'] } ],
                'depositoryName' : [ ],
                'applyId': [ ]
            },
            materialLead: '选择',
            isMoneyType: true,
            numberType: 'number',
            unlinkPanels: true,
            invoiceTypeList: [], // 发票类型
            meansPaymentsList: [], // 结算方式
            modeDistributionList: [], // 配送方式
            popoutVisible: false,
            agreementListData: [{}], // 协议列表
            invoiceTypeChose: false, // 能否选择发票类型
            temValues: {},
            distributionChose: true, // 是否配送
            showNumber: false, // 显示数量
            canChoseOpen: false, // 是否能选择开具发票

            // 流程数据
            stutas: '',
            procInstId: '',
            isSendBack: false,
            title: '',
            nodeData: {
                operation: '',
                msg: ''
            },
            dialogVisible: false,
            visible: false,
            isReject: false,
            isTurnManage: false,
            processModuleId: MATERIALEQUIPMENTMANAGEMENT.SELLCONTRACTADD,
            prossValue: {
                title: ''
            },
            sellApplicationList: [],
            canChoseApplication: true,

            paymentAgreementRules: {
                'money1': [{ required: true, pattern: /^\d+(\.\d+)?$/, message: '付款比例不能为空', trigger: 'blur' }],
                'datetime1': [{ required: true, message: '日期不能为空', trigger: 'change' }]
            },
            paymentAgreementHeader: [], //协议添加行

            factoryVisible: false,
            depositoryId: '',
        }
    },
    methods: {
        ...mapActions('d2admin/page', [
            'close'
        ]),
        closeTab () {
            this.$router.go(-1)
            let tagName = this.$route.path
            this.close ({ tagName })
        },
        upLoadFileCallBack(file) {
            this.rentForm.fileList = file
        },
        numberInput (val) {
            this.rentForm['number'] = val
        },
        shareholderUpdate (data = 0) {
            this.paymentAgreementHeader = [
                {
                    prop: 'number4',
                    label: '次数',
                    isShow: true,
                    type: 'text',
                },
                {
                    prop: 'money1',
                    label: '付款比例(%)',
                    isShow: true,
                    type: 'text',
                    required: true
                },
                {
                    prop: 'money3',
                    label: '付款金额(元)',
                    isShow: true,
                    type: 'total',
                    controlRow: '1 / 100 *' + (Number.parseFloat (data) || 0 ) + '*' + 'money1',
                    isInverseCalculation: true,
                    isShowDetails: true
                },
                {
                    prop: 'datetime1',
                    label: '日期',
                    isShow: true,
                    type: 'date',
                    required: true
                },
                {
                    prop: 'string1',
                    label: '负责人',
                    isShow: true,
                    type: 'text',
                },
            ]
        },
        // 选择仓库
        choseFactory() {
            if (this.transform.isShowDetails === false) {
                if(this.rentForm.contractSource === '0') {
                    this.factoryVisible = true
                } else {
                    this.$message.warning("合同来源是申请单,不可选择仓库!!!")
                }
            }
        },
        // 仓库回传
        getPopoutEntreport(item) {
            if(item) {
                this.rentForm['depositoryId'] = item.id
                this.depositoryId = item.id
                this.rentForm.depositoryName = item.name
                this.rentForm.depositoryAddress = item.address + item.detailedAddress
            }
            this.factoryVisible = false
        },
        leadMaterial () {
            // 从材料库导入 
            if(!this.transform.isShowDetails) {
                if (this.rentForm.contractSource === '0') {
                    if(this.depositoryId === '') {
                        this.$message.warning("请先选择仓库")
                    } else {
                        this.popoutVisible = true
                    }
                } else {
                    this.$message.warning("从申请单生成的合同不可以重新选择材料!!!")
                }
            }
        },
        popoutData (data) {
            if (data) {
                switch (data.length) {
                    case 0:
                        this.$message.warning("需要选择一种出租的材料!!!")
                        break
                    case 1:
                        this.rentForm.goodsname = data[0].name
                        this.rentForm.brandId = data[0].brandId
                        this.rentForm.brandName = data[0].brandName
                        this.rentForm.specificationName = data[0].specificationName
                        this.rentForm.itemtype = data[0].groupName
                        this.rentForm.unit = data[0].unit
                        this.rentForm.materialId = data[0].materialId
                        this.rentForm.groupId = data[0].groupId
                        this.rentForm.goodscode = data[0].code
                        this.rentForm.goodsid = data[0].id
                        this.rentForm.alias = data[0].alias

                        this.popoutVisible = false
                        break
                    default:
                        this.$message.warning("只能选择一种出租的材料")
                }
            } else {
                this.popoutVisible = false
            }
        },
        paymentAgreement (data, prop, value) {
            switch (prop) {
                case 'money1':
                    if (!this.rentForm.contractMoney) { 
                        this.$message.warning ('合同金额不能为空') 
                    } else {
                        Number (value) > 100 ? (this.$message.warning ('付款比例不能大于100'), data.money1= 0) : ''
                    }
                    break;
            }
        },
        // 输入改变时
        inputChange(field){
            switch (field) {
                case 'contractMoney':
                    // 合同总额
                    this.rentForm.capital = util.convertCurrency(this.rentForm.contractMoney)
                    this.shareholderUpdate(this.rentForm.contractMoney)
                    break
            }
        },
        // 单选改变时
        radioChange(field, value) {
            switch (field) {
                case 'isopen':
                    // 是否开具发票
                    this.invoiceTypeChose = this.rentForm.isopen === '1' ? false : true
                    if(value === '0') {
                        this.rentForm.invoiceType = ''
                        this.rentForm.taxAmount = ''
                        this.rentForm.taxRate = ''
                    }
                    break
                case 'validityTime':
                    // 合同有效期
                    this.rentForm['contractStartime'] = value.length > 1 ? value[0] : ''
                    this.rentForm['contractEndtime'] = value.length > 1 ? value[1] : ''
                    break
                case 'isdelivery':
                    // 是否配送
                    this.distributionChose = value === '1' ? false : true
                    if(value === '0') {
                        this.rentForm.deliveryWay = ''
                        this.rentForm.freight = ''
                        this.rentForm.sendtime = ''
                    }
                    break
                case 'contractSource':
                    // 改变合同来源
                    switch (value) {
                        case '0':
                            // 无
                            this.complementInfo({})
                            this.canChoseApplication = true
                            this.showNumber = false // 数量可输入
                            this.canChoseOpen = false
                            this.rentForm.applyId = ''
                            this.rules.depositoryName = [ { required: true, message: '请选择仓库', trigger: ['change', 'blur'] } ]
                            this.rules.applyId = []
                            break
                        case '1':
                            // 可选择材料
                            this.canChoseApplication = false
                            this.showNumber = true // 数量可输入
                            this.canChoseOpen = true
                            this.rules.depositoryName = []
                            this.rules.applyId = [ { required: true, message: '请选择出售申请单', trigger: ['change', 'blur'] } ]
                            break
                    }
                    break
                case 'applyname':
                    // 选择申请单名称
                    let applicationItem = this.sellApplicationList.find(item => item.id === value)
                    if(applicationItem) {
                        this.complementInfo(applicationItem)
                    }
                    break
            }
        },
        // 添加行内容
        addChangeData (arrData, index) {
            let account = 0
            arrData.forEach(item => {
                account = account + parseFloat(item.money3)
            })
            if(parseFloat(account) > parseFloat(this.rentForm.contractMoney)) {
                this.$message.warning("付款金额不能大于合同金额!!!")
                arrData[index].money3 = ''
            }
            arrData.forEach(it => {
                it.money1 = parseFloat(parseFloat(it.money3) / parseFloat(this.rentForm.contractMoney) * 100).toFixed(2)
            })
            this.agreementListData = JSON.parse(JSON.stringify(arrData))
        },

        prepareData (data) {
            data.materialList = this.$refs.agreementList.verify()
            return data
        },
        //  判断添加行总计是否大于总额
        calculateAddLine (data) {
            let canSub = true, account = 0
            data.materialList.forEach(item => {
                account = parseFloat(account) + parseFloat(item.money3)
            })
            if(parseFloat(account) != parseFloat(data.contractMoney)) {
                this.$message.warning("协议总计不等于合同金额!!!")
                return false
            } else {
                return true
            }
        },
        save() {
            let item = this.$refs.bottomInformation.getData ()
            this.$refs.rentForm.validate((valid) => {
                if (valid) {
                    this.temValues = this.prepareData(JSON.parse(JSON.stringify(this.rentForm)))
                    Object.assign(this.temValues, item)
                    if(this.calculateAddLine(this.temValues)){
                        let url = this.$route.params.isAdd ? sellContractAdd : sellContractEdit
                        url(this.temValues).then(res => {
                            this.$message.success(this.$route.params.isAdd ? '添加成功~~~' : '编辑成功~~~')
                            this.closeTab()
                        })
                    }
                }
            })
        },
        // 提交
        submitPurchaseRequestData () {
            let item = this.$refs.bottomInformation.getData ()
            this.$refs.rentForm.validate((valid) => {
                if (valid) {
                    this.temValues = this.prepareData(JSON.parse(JSON.stringify(this.rentForm)))
                    Object.assign(this.temValues, item)
                    if(this.calculateAddLine(this.temValues)){
                        if(this.rentForm.id === null || !this.rentForm.id) {} else { this.temValues['id'] = this.rentForm.id }
                        this.dialogVisible = true
                        this.prossValue = {
                            title: this.$route.params.title || `出售合同:【 ${this.temValues.contractname} 】`,
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.params.degree || '',
                            msg: '',
                        }
                    }
                }
            })
        },
        // 开始提交流程 
        updataPurchaseRequest (item, boolean) {
            let url = ''
            this.dialogVisible = this.isSendBack = false
            item['taskId'] = this.$route.params.taskId || ''
            this.temValues['completeTask'] = item
            // 前面是重新提交，后面是提交
            boolean ? url = sellContractReSub : url = sellContractSub
            url (this.temValues).then (res => {
                if (res.code === 200) {
                    this.$message.success (res.message)
                    this.closeTab ()
                }
            })
        },
        // 审批方法
        consentPurchaseRequest (item = '', boolean = false) {
            this.visible = this.isTurnManage = this.isReject = false
            if (boolean) {
                this.closeTab ()
                return
            }
            if (item) {
                this.rentForm['completeTask'] = item
                sellContractProOperation (this.rentForm).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closeTab ()
                    }
                })
            }
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
                this.getPurchaseRequest (this.$route.params.relevancyId)
            }
        },
        getDetailsList (taskId) {
            getDetails (taskId).then (res => {
                if (res) this.nodeData = res
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
        getPurchaseRequest(id) {
            sellContractQueryById({id: id}).then(res => {
                res.number = res.number + ''
                res.taxAmount = res.taxAmount + ''
                res.taxRate = res.taxRate + ''
                res.freight = res.freight + ''
                res.contractMoney = res.contractMoney + ''
                
                res.materialList.forEach(item => {
                    item.money1 = item.money1 + ''
                    item.number4 = item.number4 + ''
                })

                this.invoiceTypeChose = this.transform.isShowDetails ? true : res.isopen === '1' ? false : true
                this.canChoseApplication = this.transform.isShowDetails ? true : res.contractSource === '1' ? false : true
                this.distributionChose = this.transform.isShowDetails ? true : res.isdelivery === '1' ? false : true // 是否配送
                this.showNumber = this.transform.isShowDetails ? true :  res.contractSource === '1' ? false : true // 显示数量
                
                this.rules.depositoryName = res.contractSource === '1' ?  [] : [ { required: true, message: '请选择仓库', trigger: ['change', 'blur'] } ]
                this.rules.applyId = res.contractSource === '1' ? [ { required: true, message: '请选择出售申请单', trigger: ['change', 'blur'] } ] : []
                this.canChoseOpen = res.contractSource === '1' ? true : this.transform.isShowDetails ? true : false
                this.invoiceTypeChose = res.contractSource === '1' ? true : this.transform.isShowDetails ? true : res.isopen === '0' ? true : false

                this.rentForm = res
                // 合同期限
                this.rentForm['validityTime'] = []
                this.rentForm.validityTime[0] = res.contractStartime
                this.rentForm.validityTime[1] = res.contractEndtime
                this.setFile(res.fileList)
                this.shareholderUpdate(res.contractMoney)
                this.getApplicationList(res.applyId)
                this.agreementListData = res.materialList
                this.procInstId = res.procInstId ? res.procInstId : ''
            })
        },
        getListData () {
            queryDicById({id: PURCHASEREQUEST.INVOICETYPE}).then(res => { this.invoiceTypeList = res })  // 发票类型
            queryDicById({id: PURCHASEREQUEST.MEANSPAYMENTS}).then(res => { this.meansPaymentsList = res })  // 结算方式
            queryDicById({id: PURCHASEREQUEST.MODEDISTRIBUTION}).then(res => { this.modeDistributionList = res }) // 配送方式
            this.shareholderUpdate()
        },
        getApplicationList (applyId) {
            sellApplyQueryIsStatus({id: applyId}).then(res => { this.sellApplicationList = res }) // 申请单
        },
        // 根据申请单内容补全信息
        complementInfo (res) {
            delete res.createBy
            delete res.createName
            delete res.createTime
            delete res.departmentId
            delete res.departmentName
            delete res.fileList
            delete res.id
            delete res.procInstId
            delete res.procState
            res.taxAmount = res.taxAmount + ''
            res.taxRate = res.taxRate + ''
            res.number = res.number + ''

            Object.assign(this.rentForm, res)
        },
    },
    mounted () {

    },
    created () {
        if(this.$route.params.applyId) {
            this.rentForm.contractSource = '1'
            this.showNumber = true
            this.invoiceTypeChose = true
            this.canChoseOpen = true
            this.rules.depositoryName = []
            this.rentForm.applyId = this.$route.params.applyId
            this.rules.applyId = [ { required: true, message: '请选择出售申请单', trigger: ['change', 'blur'] } ]
            this.getApplicationList(this.$route.params.applyId)
            sellApplyQueryById({ id: this.$route.params.applyId}).then(res => {
                this.complementInfo(res)
            })
        } else {
            this.rentForm.contractSource = '0'
            this.rules.depositoryName = [ { required: true, message: '请选择仓库', trigger: ['change', 'blur'] } ]
            this.rules.applyId = [ ]
        }
        this.getListData()
        this.updataRouter()
    }
}
</script>
<style lang="scss">
.address-book{
    .drawer-btn{
        margin-top: 30px;
        text-align: center;
    }
}
.rentForm{
    .el-select{
        width: 100%;
    }
    .el-input__inner{
        border-radius: 0px;
    }
    .el-divider__text{
        display: inline-block;
        position: relative;
        padding-left: 27px;
        &::before{
            content: "";
            width: 3px;
            height: 15px;
            background-color: #346fff;
            position: absolute;
            top: 3px;
            left: 17px;
        }
    }
}
</style>