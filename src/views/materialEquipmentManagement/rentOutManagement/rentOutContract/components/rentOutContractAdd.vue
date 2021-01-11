<template>
    <d2-container class="address-book open-tender">
        <el-card class="box-card closeHeader">
            <div slot="header"><el-button type="text" @click="closeTab"><i class="el-icon-close"></i></el-button></div>
            <div class="qqt-container-full-center___top">
                <qqt-flow-tabs :procInstId="procInstId">
                <template slot="content">
                <div class="rent-out-box">
                    <el-form :model="rentForm" :rules="rules" size="medium" ref="rentForm" class="rentForm" label-width="140px">
                        <el-row><el-divider content-position="left">基础信息</el-divider></el-row>
                        <el-row>
                            <el-col :span="8">
                                 <el-form-item label="出租合同单号:">
                                    <qqt-input v-model="rentForm.rentalContractNumber" :value="rentForm.rentalContractNumber" :placeholder="'自动生成'" :isShowElement="noInput"></qqt-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="出租合同名称:" prop="rentalContractName">
                                    <qqt-input v-model="rentForm.rentalContractName" :value="rentForm.rentalContractName" :isShowElement="!transform.isShowDetails" ></qqt-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="合同来源:" prop="sourceContract">
                                    <el-select v-model="rentForm.sourceContract" clearable style="width:100%;" @change="data => radioChange('sourceContract', data)" :disabled="fromApply">
                                        <el-option v-for="item in sourceList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                 <el-form-item label="仓库名称:" prop="libraryStoragePlant">
                                    <qqt-input v-model="rentForm.libraryStoragePlant" :value="rentForm.libraryStoragePlant" :isShowElement="noInput" 
                                            :btnIcon="'el-icon-plus'" @btnClick="choseFactory"></qqt-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="16">
                                 <el-form-item label="仓库地点:">
                                    <qqt-input v-model="rentForm.factoryLibraryLocation" :value="rentForm.factoryLibraryLocation" :isShowElement="noInput"></qqt-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                 <el-form-item label="出租单申请单号:" prop="rentalApplicationNumber">
                                    <qqt-input v-model="rentForm.rentalApplicationNumber" :value="rentForm.rentalApplicationNumber" :isShowElement="noInput"></qqt-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="16">
                                 <el-form-item label="出租申请单名称:" prop="rentalApplicationId">
                                    <qqt-input v-if="transform.isShowDetails" v-model="rentForm.rentalApplicationName" :value="rentForm.rentalApplicationName" :isShowElement="noInput" ></qqt-input>
                                    <el-select v-else v-model="rentForm.rentalApplicationId" clearable style="width:100%;" @change="data => radioChange('rentalApplicationId', data)" :disabled="canChoseApplication">
                                        <el-option v-for="item in rentalApplicationList" :key="item.id" :label="item.rentalApplicationName" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                 <el-form-item label="领用申请单编码:">
                                    <qqt-input v-model="rentForm.applySourceCode" :value="rentForm.applySourceCode" :isShowElement="noInput" ></qqt-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="16">
                                 <el-form-item label="领用申请单名称:">
                                    <qqt-input v-model="rentForm.applySourceName" :value="rentForm.applySourceName" :isShowElement="noInput" ></qqt-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                 <el-form-item label="合同金额:" prop="contractAmount">
                                    <qqt-input v-model="rentForm.contractAmount" :value="rentForm.contractAmount" :isShowElement="!transform.isShowDetails" 
                                            :isMoneyType="isMoneyType" :btnTitle="'元'" @input="inputChange('contractAmount')"></qqt-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="大写:">
                                    <qqt-input v-model="rentForm.contractAmountMakelower" :value="rentForm.contractAmountMakelower" :isShowElement="noInput" ></qqt-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="材料名称:" prop="rentalName">
                                    <qqt-input v-model="rentForm.rentalName" :value="rentForm.rentalName" :isShowElement="noInput" 
                                        :btnIcon="'el-icon-plus'" @btnClick="leadMaterial"></qqt-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                 <el-form-item label="类型:" prop="rentalTypeId">
                                    <el-select v-model="rentForm.rentalTypeId" clearable style="width:100%;" :disabled="!noInput">
                                        <el-option v-for="item in rentalTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="品牌:" prop="rentalBrand">
                                    <qqt-input v-model="rentForm.rentalBrand" :value="rentForm.rentalBrand" :isShowElement="noInput" ></qqt-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="规格型号:" prop="specificationsModels">
                                    <qqt-input v-model="rentForm.specificationsModels" :value="rentForm.specificationsModels" :isShowElement="noInput" ></qqt-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                 <el-form-item label="计量单位:" prop="unitMeasurement">
                                    <qqt-input v-model="rentForm.unitMeasurement" :value="rentForm.unitMeasurement" :isShowElement="noInput" ></qqt-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="出租方:" prop="lessor">
                                    <qqt-input v-model="rentForm.lessor" :value="rentForm.lessor" :isShowElement="!transform.isShowDetails" ></qqt-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="承租方:" prop="tenantry">
                                    <qqt-input v-model="rentForm.tenantry" :value="rentForm.tenantry" :isShowElement="!showNumber" ></qqt-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                 <el-form-item label="出租数量:" prop="quantity">
                                    <qqt-input v-model="rentForm.quantity" :value="rentForm.quantity" :type="numberType" :isShowElement="!showNumber" ></qqt-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="出租单价:" prop="rentalUnitPrice">
                                    <qqt-input v-model="rentForm.rentalUnitPrice" :value="rentForm.rentalUnitPrice" :isShowElement="!transform.isShowDetails" 
                                            :isMoneyType="isMoneyType" :btnTitle="'元'"></qqt-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="出租天数:" prop="rentNumberDays">
                                    <qqt-input v-model="rentForm.rentNumberDays" :value="rentForm.rentNumberDays" :isShowElement="!transform.isShowDetails" 
                                            :type="numberType" :btnTitle="'天'"></qqt-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="计价方式:" prop="pricingMannerId">
                                    <el-select v-model="rentForm.pricingMannerId" clearable style="width:100%;" :disabled="showNumber">
                                        <el-option v-for="item in pricingMannerList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="滞纳金:">
                                    <qqt-input v-model="rentForm.overdueFine" :value="rentForm.overdueFine" :isShowElement="!transform.isShowDetails" 
                                            :isMoneyType="isMoneyType" :btnTitle="'元'"></qqt-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="是否开具发票:" prop="invoice">
                                    <el-radio-group v-model="rentForm.invoice" @change="data => radioChange('invoice', data)" :disabled="showNumber">
                                        <el-radio label="1">是</el-radio>
                                        <el-radio label="0">否</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="发票类型:">
                                    <el-select v-model="rentForm.invoiceTypeId" clearable style="width:100%;" :disabled="invoiceTypeChose">
                                        <el-option v-for="item in invoiceTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="税额:">
                                    <qqt-input v-model="rentForm.taxForehead" :value="rentForm.taxForehead" :isShowElement="!invoiceTypeChose" 
                                            :isMoneyType="isMoneyType" :btnTitle="'元'"></qqt-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="税率:">
                                     <qqt-input v-model="rentForm.taxRate" :value="rentForm.taxRate" :isShowElement="!invoiceTypeChose" 
                                            :type="numberType" :btnTitle="'%'"></qqt-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                 <el-form-item label="结算方式:" prop="meansPaymentsId">
                                    <el-select v-model="rentForm.meansPaymentsId" @change="$set(rentForm,rentForm.meansPaymentsId,$event)"  clearable style="width:100%;" :disabled="transform.isShowDetails">
                                        <el-option v-for="item in meansPaymentsList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="合同有效期:" prop="validityTime">
                                    <el-date-picker value-format='yyyy-MM-dd' v-model="rentForm.validityTime" type="daterange" range-separator="至"
                                        :unlink-panels="unlinkPanels" :disabled="transform.isShowDetails" @change="data => radioChange('validityTime', data)"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="押金:" prop="cashPledge">
                                    <qqt-input v-model="rentForm.cashPledge" :value="rentForm.cashPledge" :isShowElement="!transform.isShowDetails" 
                                        :isMoneyType="isMoneyType" :btnTitle="'元'"></qqt-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                 <el-form-item label="完好度:" prop="commence">
                                    <el-select v-model="rentForm.commence" clearable style="width:100%;" :disabled="transform.isShowDetails">
                                        <el-option v-for="item in commenceList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="是否配送:" prop="distribution">
                                    <el-radio-group v-model="rentForm.distribution" :disabled="transform.isShowDetails" @change="data => radioChange('distribution', data)">
                                        <el-radio label="1">是</el-radio>
                                        <el-radio label="0">否</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="配送方式:">
                                    <el-select v-model="rentForm.modeDistributionId" clearable style="width:100%;" :disabled="!distributionChose">
                                        <el-option v-for="item in modeDistributionList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="发货日期:">
                                    <el-date-picker value-format='yyyy-MM-dd' v-model="rentForm.deliveryDate" type="date" :disabled="!distributionChose"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="运费:">
                                    <qqt-input v-model="rentForm.carriage" :value="rentForm.carriage" :isShowElement="distributionChose" 
                                        :isMoneyType="isMoneyType" :btnTitle="'元'"></qqt-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                 <el-form-item label="是否包含运费:" prop="freight">
                                    <el-radio-group v-model="rentForm.freight" :disabled="transform.isShowDetails">
                                        <el-radio label="1">是</el-radio>
                                        <el-radio label="0">否</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                 <el-form-item label="签订时间:" prop="dateSigning">
                                    <el-date-picker value-format='yyyy-MM-dd' v-model="rentForm.dateSigning" type="date" :disabled="transform.isShowDetails"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="16">
                                 <el-form-item label="付款条件:">
                                    <qqt-input v-model="rentForm.paymentClause" :value="rentForm.paymentClause" :isShowElement="!transform.isShowDetails" ></qqt-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-divider content-position="left">付款协议</el-divider>
                                <!-- <adddline ref="agreementList" :showDetail="transform.isShowDetails" @changeData="addChangeData" :info="agreementListData"></adddline> -->
                                <qqt-relate-table :data="agreementListData" ref="agreementList" :replaceRules="paymentAgreementRules" :rowHeader="paymentAgreementHeader" @change="paymentAgreement" :isShowDetails="transform.isShowDetails" />
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-divider content-position="left">附件</el-divider>
                            <div class="up-load-div">
                                <up-load :isShowUpload="!transform.isShowDetails" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList" ref="upload"/>
                            </div>
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
                <el-button v-if="!transform.isShowDetails && procInstId === '' && $has ('material:rental:contract:submit')" type="primary" size="small" @click="rentForm['flag'] = '1', submitPurchaseRequestData ()">提交</el-button>
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
import adddline from './addline'
import { queryDicById } from '../../../../../api/system/dic/dic'
import { PURCHASEREQUEST } from '../../../../../enum/DICTIONARY'
import { getDetails } from '../../../../../api/approval/common'
import { upload, qqtInput, qqtSendProcess, qqtFlowTabs, qqtConsent, qqtRelateTable } from '../../../../../components/qqt-subassembly'
import popoutMaterialDepot from '../../../basicInformation/materialDepot/components/popoutMaterialDepot'
import popoutEntreport from '../../../basicInformation/entrepot/components/popoutEntreport'
import fromWarehouse from '../../../receiveManagement/components/fromWarehouse'
import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
import { rentalQueryById, materialGroupList } from '../../../../../api/materialEquipmentManagement/rentOutManagement/rentOutApply/index'
import { rentalContractAdd, rentalContractEdit, rentalContractSubmit, rentalContractResubmit, contractProOperation, rentalContractQueryById, rentalNoContract } 
            from '../../../../../api/materialEquipmentManagement/rentOutManagement/rentOutContract/index'
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
        'popout-entreport': popoutEntreport,
        'popout-material-depot' : popoutMaterialDepot,
        'qqt-send-process': qqtSendProcess,
        'qqt-flow-tabs': qqtFlowTabs,
        'qqt-consent': qqtConsent,
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
            applyInfo: {},
            noInput: false,
            sourceList: [
                { value: '1', label: '申请单' },
                { value: '0', label: '无' }, 
            ],
            commenceList: [
                { id: '1', name: '一成新' },{ id: '2', name: '二成新' },
                { id: '3', name: '三成新' },{ id: '4', name: '四成新' },
                { id: '5', name: '五成新' },{ id: '6', name: '六成新' },
                { id: '7', name: '七成新' },{ id: '8', name: '八成新' },
                { id: '9', name: '九成新' },{ id: '10', name: '十成新' },
            ],
            rentForm: {
                rentalName: '',
                rentalBrand: '',
                applySourceType: '1',
                specificationsModels: '',
                unitMeasurement: '',
                rentalTypeId: '',
                lessor: '',
                tenantry: '',
                dateSigning: '',
                freight: '',
                invoice: '',
                meansPaymentsId: null,
                rentNumberDays: null,
                cashPledge: '',
                distribution: '',
                quantity: '',
                rentalUnitPrice: '',
                pricingMannerId: '',
                libraryStoragePlant: '',
                rentalApplicationId: '',
                commence: '',
            },
            rules: {
                sourceContract: [ { required: true, message: '请输入出租合同来源', trigger: ['change', 'blur'] } ],
                rentalContractName: [ { required: true, message: '请输入出租单名称', trigger: ['change', 'blur'] } ],
                rentalName: [ { required: true, message: '请选择出材料名称', trigger: ['change', 'blur'] } ],
                rentalApplicationId: [ { required: true, message: '请选择出租申请单名称', trigger: ['change', 'blur'] } ],
                rentalBrand: [ { required: true, message: '请输入品牌', trigger: ['change', 'blur'] } ],
                specificationsModels: [ { required: true, message: '请输入规格型号', trigger: ['change', 'blur'] } ],
                unitMeasurement: [ { required: true, message: '请输入计量单位', trigger: ['change', 'blur'] } ],
                rentalTypeId: [ { required: true, message: '请输入选择', trigger: ['change', 'blur'] } ],
                lessor: [ { required: true, message: '请输入出租方', trigger: ['change', 'blur'] } ],
                tenantry: [ { required: true, message: '请输入承租方', trigger: ['change', 'blur'] } ],
                dateSigning: [ { required: true, message: '请选择签订时间', trigger: ['change', 'blur'] } ],
                freight: [ { required: true, message: '请选择是否包含运费', trigger: ['change', 'blur'] } ],
                invoice: [ { required: true, message: '请选择是否开具发票', trigger: ['change', 'blur'] } ],
                meansPaymentsId: [ { required: true, message: '请选择结算方式', trigger: ['change', 'blur'] } ],
                cashPledge: [ { required: true, message: '请输入押金', trigger: ['change', 'blur'] } ],
                distribution: [ { required: true, message: '请选择是否配送', trigger: ['change', 'blur'] } ],
                contractAmount: [ { required: true, message: '请输入合同金额', trigger: ['change', 'blur'] } ],
                quantity: [ { required: true, message: '请输入出租数量', trigger: ['change', 'blur'] } ],
                rentalUnitPrice: [ { required: true, message: '请输入出租单价', trigger: ['change', 'blur'] } ],
                rentNumberDays: [ { required: true, message: '请输入出租天数', trigger: ['change', 'blur'] },
                                  { pattern: /^\d+(\.\d+)?$/, message: '出租天数不能为负数', trigger: ['change', 'blur'] } ],
                pricingMannerId: [ { required: true, message: '请选择计价方式', trigger: ['change', 'blur'] } ],
                validityTime: [ { required: true, message: '请选择合同有效期', trigger: ['change', 'blur'] } ],
                commence: [ { required: true, message: '请选择完好度', trigger: ['change', 'blur'] } ],
                libraryStoragePlant: [ { required: true, message: '请选择仓库', trigger: ['change', 'blur'] } ],
            },
            materialLead: '选择',
            isMoneyType: true,
            numberType: 'number',
            unlinkPanels: true,
            invoiceTypeList: [], // 发票类型
            meansPaymentsList: [], // 结算方式
            modeDistributionList: [], // 配送方式
            rentalTypeList: [], // 类型
            pricingMannerList:  [
                { id: '1', name: '日' },{ id: '2', name: '月' },{ id: '3', name: '年' },
            ],
            popoutVisible: false,
            agreementListData: [{}], // 协议列表
            invoiceTypeChose: true, // 能否选择发票类型
            temValues: {},
            distributionChose: false, // 是否配送
            showNumber: false, // 显示数量

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
            processModuleId: MATERIALEQUIPMENTMANAGEMENT.RENTOUTCONTRACTADD,
            prossValue: {
                title: ''
            },
            rentalApplicationList: [],
            canChoseApplication: true,
            factoryVisible: false,
            paymentAgreementRules: {
                'money1': [{ required: true, pattern: /^\d+(\.\d+)?$/, message: '付款比例不能为空', trigger: 'blur' }], 
                'datetime1': [{ required: true, message: '日期不能为空', trigger: 'change' }]
            },
            paymentAgreementHeader: [], //协议添加行
            fromApply: false,
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
            let path = `materialEquipmentManagement/rentOutManagement/rentOutContract` 
            this.close ({ tagName, path })
        },
        upLoadFileCallBack(file) {
            this.rentForm.fileList = file
        },
        leadMaterial () {
            // 从材料库导入
            if (this.rentForm.sourceContract === '0' && this.transform.isShowDetails === false) {
                if (this.depositoryId === '') {
                    this.$message.warning("请先选择仓库!!")
                } else {
                    this.popoutVisible = true
                }
            } else {
                this.$message.warning(this.transform.isShowDetails ? '详情不可修改!!!' :"从申请单生成的合同不可以重新选择材料!!!")
            }
        },
        popoutData (data) {
            if (data) {
                switch (data.length) {
                    case 0:
                        this.$message.warning("需要选择一种出租的材料!!!")
                        break
                    case 1:
                        this.rentForm.rentalName = data[0].name
                        this.rentForm.rentalBrand = data[0].brandName
                        this.rentForm.specificationsModels = data[0].specificationName
                        this.rentForm.unitMeasurement = data[0].unit
                        this.rentForm.rentalTypeId = data[0].groupId

                        this.rentForm.groupId = data[0].groupId
                        this.rentForm.materialNumber = data[0].code
                        this.rentForm.materialId = data[0].materialId
                        this.rentForm.rentalNameId = data[0].id
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
        // 输入改变时
        inputChange(field){
            switch (field) {
                case 'contractAmount':
                    // 合同总额
                    this.rentForm.contractAmountMakelower = util.convertCurrency(this.rentForm.contractAmount)
                    this.shareholderUpdate(this.rentForm.contractAmount)
                    break
            }
        },
        choseFactory () {
            if (this.transform.isShowDetails === false) {
                if(this.rentForm.sourceContract === '0') {
                    this.factoryVisible = true
                } else {
                    this.$message.warning("合同来源是申请单,不可选择仓库!!!")
                }
            }
        },
        // 添加行内容
        addChangeData (arrData, index) {
            let account = 0
            arrData.forEach(item => {
                account = account + parseFloat(item.money3)
            })
            if(parseFloat(account) > parseFloat(this.rentForm.contractAmount)) {
                this.$message.warning("付款金额不能大于合同金额!!!")
                arrData[index].money3 = ''
            }
            arrData.forEach(it => {
                it.money1 = parseFloat(parseFloat(it.money3) / parseFloat(this.rentForm.contractAmount) * 100).toFixed(2)
            })
            this.agreementListData = JSON.parse(JSON.stringify(arrData))
        },
        // 选择仓库
        getPopoutEntreport (item) {
            if(item) {
                this.rentForm['libraryStoragePlantId'] = item.id
                this.depositoryId = item.id
                this.rentForm.libraryStoragePlant = item.name
                this.rentForm.factoryLibraryLocation = item.address + item.detailedAddress
            }
            this.factoryVisible = false
        },
        // 单选改变时
        radioChange(field, value) {
            switch (field) {
                case 'invoice': 
                    // 是否开具发票
                    this.invoiceTypeChose = value === '1' ? false : true
                    if(value === '0') {
                        this.rentForm.invoiceTypeId = ''
                    }
                    break
                case 'validityTime':
                    // 合同有效期
                    this.rentForm['commencementContractValidity'] = value.length > 1 ? value[0] : ''
                    this.rentForm['terminationContract'] = value.length > 1 ? value[1] : ''
                    if(value.length > 1) { this.rentForm.leasePeriod = util.dateDiff(value[0], value[1]) }
                    break
                case 'distribution':
                    // 是否配送
                    this.distributionChose = value === '1' ? true : false
                    if(value === '0') {
                        this.rentForm.modeDistributionId = ''
                        this.rentForm.carriage = ''
                        this.rentForm.deliveryDate = ''
                    }
                    break
                case 'sourceContract':
                    // 改变合同来源
                    switch (value) {
                        case '0':
                            // 无
                            this.canChoseApplication = true
                            this.showNumber = false // 数量可输入
                            this.depositoryId = ''
                            this.rules.libraryStoragePlant = [ { required: true, message: '请选择仓库', trigger: ['change', 'blur'] } ]
                            this.rules.rentalApplicationId = []
                            break
                        case '1':
                            // 可选择材料
                            this.canChoseApplication = false
                            this.showNumber = true // 数量可输入
                            this.rules.libraryStoragePlant = []
                            this.rules.rentalApplicationId = [ { required: true, message: '请选择出租申请单名称', trigger: ['change', 'blur'] } ]
                            break
                    }
                    this.rentForm = {
                        sourceContract: value === '0' ? '0' : '1',
                        applySourceType: '1', // 出租方式(后台需要)
                    }
                    this.$refs.rentForm.resetFields()
                    break
                case 'rentalApplicationId':
                    // 选择申请单名称
                    let applicationItem = this.rentalApplicationList.find(item => item.id === value)
                    if(applicationItem) {
                        this.complementInfo(applicationItem)
                    }
                    break
            }
        },
        // 根据申请单内容补全信息
        complementInfo (res) {
            this.rentForm.rentalApplicationId = res.id
            delete res.id  // 删除出租申请的id
            Object.assign(this.rentForm, res)

            this.rentForm.rentNumberDays = util.dateDiff(res.afterDate, res.beforeDate) + ''
            this.rentForm.cashPledge = res.cashPledgeTotalAmount + ''
            this.rentForm.cashPledgeTotalAmount = this.rentForm.cashPledgeTotalAmount + ''
            this.rentForm.originalValue = this.rentForm.originalValue + ''
            this.rentForm.rentAmount = this.rentForm.rentAmount + ''
            this.rentForm.rentalPrice = this.rentForm.rentalPrice + ''
            this.rentForm.rentalUnitPrice = this.rentForm.rentalUnitPrice + ''
            this.rentForm.quantity = res.rentAmount + ''
            this.rentForm.procInstId = ''
            this.rentForm.procState = ''
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
        paymentAgreement (data, prop, value) {
            switch (prop) {
                case 'money1':
                    if (!this.rentForm.contractAmount) { 
                        this.$message.warning ('合同金额不能为空') 
                    } else {
                        Number (value) > 100 ? (this.$message.warning ('付款比例不能大于100'), data.money1= 0) : ''
                    }
                    break;
            }
        },
        prepareData (data) {
            // 发票类型
            let invoiceTypeItem = this.invoiceTypeList.find(el => el.id === data.invoiceTypeId)
            if(invoiceTypeItem) { data.invoiceType = invoiceTypeItem.name }
            // 结算方式
            let meansPaymentsItem = this.meansPaymentsList.find(el => el.id === data.meansPaymentsId)
            if(meansPaymentsItem) { data.meansPayments = meansPaymentsItem.name }
            // 配送方式
            let modeDistributionItem = this.modeDistributionList.find(el => el.id === data.modeDistributionId)
            if(modeDistributionItem) { data.modeDistribution = modeDistributionItem.name }
            // 类型
            let rentalTypeItem = this.rentalTypeList.find(el => el.id === data.rentalTypeId)
            if(rentalTypeItem) { data.rentalType = rentalTypeItem.name }
            // 计价方式
            let pricingMannerItem = this.pricingMannerList.find(el => el.id === data.pricingMannerId)
            if(pricingMannerItem) { data.pricingManner = pricingMannerItem.name }

            data.materialList = this.$refs.agreementList.verify()
            return data
        },
        //  判断添加行总计是否大于总额
        calculateAddLine (data) {
            let canSub = true, account = 0
            data.materialList.forEach(item => {
                account = parseFloat(account) + parseFloat(item.money3)
            })
            if(parseFloat(account) != parseFloat(data.contractAmount)) {
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
                        let url = this.$route.params.isAdd ? rentalContractAdd : rentalContractEdit
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
                            title: this.$route.params.title || `出租合同:【 ${this.temValues.rentalContractName} 】`,
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
            boolean ? url = rentalContractResubmit : url = rentalContractSubmit
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
                contractProOperation (this.rentForm).then (res => {
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
                this.fromApply = this.$route.params.transform.isShowDetails
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
        getPurchaseRequest(id) {
            rentalContractQueryById({id: id}).then(res => {
                res.contractAmount = res.contractAmount + ''
                res.carriage = res.carriage + ''
                res.cashPledge = res.cashPledge + ''
                res.taxForehead = res.taxForehead + ''
                res.taxRate = res.taxRate + ''
                res.quantity = res.quantity + ''
                res.rentalUnitPrice = res.rentalUnitPrice + ''
                res.rentNumberDays = res.rentNumberDays + ''
                res.overdueFine = res.overdueFine + ''

                this.invoiceTypeChose = this.transform.isShowDetails ? true : res.invoice === '1' ? false : true
                this.distributionChose = this.transform.isShowDetails ? true : res.distribution === '1' ? false : true
                this.canChoseApplication = this.transform.isShowDetails ? true : res.sourceContract === '1' ? false : true
                this.distributionChose = this.transform.isShowDetails ? false : res.distribution === '1' ? true : false // 是否配送
                this.showNumber = this.transform.isShowDetails ? true :  res.sourceContract === '1' ? false : true // 显示数量
                
                res.materialList.forEach(item => {
                    item.number4 = item.number4 + ''
                    item.money1 = item.money1 + ''
                    item.money3 = item.money3 + ''
                })

                this.rentForm = JSON.parse(JSON.stringify(res))
                this.setFile(res.fileList)
                this.shareholderUpdate(res.contractAmount)
                this.agreementListData = JSON.parse(JSON.stringify( res.materialList))
                this.rentForm.validityTime = res.commencementContractValidity ? [res.commencementContractValidity, res.terminationContract] : []
                this.procInstId = res.procInstId ? res.procInstId : ''
            }).finally(() => {
                rentalNoContract({ id: this.rentForm.rentalApplicationId }).then(res => { this.rentalApplicationList = res })
            })
        },
        getListData () {
            queryDicById({id: PURCHASEREQUEST.INVOICETYPE}).then(res => { this.invoiceTypeList = res })  // 发票类型
            queryDicById({id: PURCHASEREQUEST.MEANSPAYMENTS}).then(res => { this.meansPaymentsList = res })  // 结算方式
            queryDicById({id: PURCHASEREQUEST.MODEDISTRIBUTION}).then(res => { this.modeDistributionList = res }) // 配送方式
            // queryDicById({id: PURCHASEREQUEST.PRICINGMANNER}).then(res => { this.pricingMannerList = res }) // 计价方式
            materialGroupList().then(res => { this.rentalTypeList = res }) // 类型
            rentalNoContract().then(res => { this.rentalApplicationList = res })
            this.shareholderUpdate()
        },
    },
    mounted () {

    },
    created () { 
        if(this.$route.params.applyId) {
            this.rentForm.sourceContract = '1'
            this.showNumber = true
            this.invoiceTypeChose = true
            this.fromApply = true
            rentalQueryById({ id: this.$route.params.applyId}).then(res => {
                this.complementInfo(res)
                this.$refs.rentForm.clearValidate()
            })
        } else {
            this.rentForm.sourceContract = '0'
            this.rules.rentalApplicationId = [ ]
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
    .generate-from-divider___line{
        display: none;
    }
    
}

</style>