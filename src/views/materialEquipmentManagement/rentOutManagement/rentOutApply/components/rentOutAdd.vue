<template>
    <d2-container class="address-book open-tender">
        <el-card class="box-card closeHeader">
            <div slot="header"><el-button type="text" @click="closeTab"><i class="el-icon-close"></i></el-button></div>
            <div class="qqt-container-full-center___top">
                <qqt-flow-tabs :procInstId="procInstId">
                    <template slot="content">
                        <fm-generate-form
                            :data="jsonData"
                            :remote="remoteFuncs"
                            :remoteOption="remoteFunOption"
                            :value="values"
                            :transform="transform"
                            @on-change="valueChange"
                            @btn-click="choseMaterials"
                            ref="generateForm">
                            <template slot="libraryStorage">
                                <el-form class="libraryStorageForm" ref="libraryStorageForm" :rules="rulesLibrary" :model="libraryData" :size="formSize" label-width="140px">
                                    <el-row>
                                        <el-col :span="8">
                                            <el-form-item label="存放仓库:" prop="libraryStoragePlant">
                                                <qqt-input :value="libraryData.libraryStoragePlant" @btnClick="choseLibrary" v-model="libraryData.libraryStoragePlant" :btnIcon="btnIcon" :isShowElement="canInvoice"></qqt-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="16">
                                            <el-form-item label="仓库地点:">
                                                <qqt-input :value="libraryData.factoryLibraryLocation" v-model="libraryData.factoryLibraryLocation" :isShowElement="noInput"></qqt-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="8" class="second-row">
                                            <el-form-item label="领用登记编号:" prop="applySourceCode">
                                                <qqt-input :value="libraryData.applySourceCode" v-model="libraryData.applySourceCode" :isShowElement="noInput"></qqt-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="16" class="second-row">
                                            <el-form-item label="领用登记单名称:" prop="applySourceId">
                                                <el-select v-model="libraryData.applySourceId" clearable style="width:100%;" @change="applyChange" :disabled="canChoseLibrary">
                                                    <el-option v-for="item in applySourceList" :key="item.id" :label="item.applyname" :value="item.id"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-form>
                            </template>
                            <template slot="invoice">
                                <el-form class="invoiceForm" ref="invoiceForm" :rules="rules" :model="invoiceForm" :size="formSize" label-width="140px">
                                    <el-row>
                                        <el-col :span="8"> 
                                        <el-form-item label="是否开具发票:" required prop="invoice">
                                            <el-radio-group v-model="invoiceForm.invoice" @change='invoiceChange' :disabled="transform.isShowDetails">
                                                <el-radio label="1">是</el-radio>
                                                <el-radio label="0">否</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item label="发票类型:" prop="invoiceTypeId">
                                                <el-select v-model="invoiceForm.invoiceTypeId" :disabled="!canInvoice" placeholder="请选择">
                                                    <el-option v-for="item in invoiceTypeList" :label="item.name" :value="item.id" :key="item.id"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item label="开票金额:">
                                                <qqt-input :value="invoiceForm.invoiceAmount" v-model="invoiceForm.invoiceAmount" :btnTitle="btnTitle" :isShowElement="canInvoice" :isMoneyType="isMoneyType"></qqt-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-form>
                            </template>
                        </fm-generate-form>
                        <div class="up-load-div">
                            <up-load :isShowUpload="!transform.isShowDetails"  @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList" ref="upload"/>
                        </div>
                        <bottomInformation :fieldTitle="'申请'" :timeTitle="'申请'" :values="values" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
                    </template>
                </qqt-flow-tabs>
            </div>

            <div class="drawer-btn">
                <el-button type="warning" size="small" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitPurchaseRequestData ()">重新提交</el-button>
                <el-button type="primary" size="small" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" size="small" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" size="small" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" size="small" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId === ''" size="small" @click="subNewPro">保存</el-button>
                <el-button v-if="!transform.isShowDetails && procInstId === '' && $has ('material:rental:application:submit')" type="primary" size="small" @click="values['flag'] = '1', submitPurchaseRequestData ()">提交</el-button>
                <el-button type="primary" size="small" @click="closeTab">关闭</el-button>
            </div>
        </el-card>
        <popout-material-depot :dialogVisible="popoutVisible" @close="popoutData"></popout-material-depot>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataPurchaseRequest"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentPurchaseRequest" />
        <popout-entreport :dialogVisible="factoryVisible" @close="getPopoutEntreport" />
        <from-warehouse :rentOut="fromRentOut" :canChoseLibrary="canChoseLibrary" :applyId="applySourceIdTem" :dialogVisible="showWarehouse" :depositoryId='depositoryId' @closeDialog='popoutData'></from-warehouse>
    </d2-container>
</template>
<script>
import { mapActions } from 'vuex'
import { upload, qqtInput, qqtSendProcess, qqtFlowTabs, qqtConsent, } from '../../../../../components/qqt-subassembly'
import { queryDicById } from '../../../../../api/system/dic/dic'
import { PURCHASEREQUEST } from '../../../../../enum/DICTIONARY'
import { getUserDepartById } from '../../../../../api/system/depart/depart'
import { synopsisList } from '../../../../../api/materialEquipmentManagement/receiveManagement/receiveApply/index'
import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
import { listSupplier, rentalQueryById, rentalAdd, rentalEdit, rentalResubmit, rentalSubmit, rentalProOperation, materialGroupList, useApplicationList } from 
                '../../../../../api/materialEquipmentManagement/rentOutManagement/rentOutApply/index'
import { MATERIALEQUIPMENTMANAGEMENT } from '../../../../../enum/FORMCODE'
import { getDetails } from '../../../../../api/approval/common'
import { formGetJson } from '../../../../../api/system/fromManagement/index'
import popoutEntreport from '../../../basicInformation/entrepot/components/popoutEntreport'
import popoutMaterialDepot from '../../../basicInformation/materialDepot/components/popoutMaterialDepot'
import fromWarehouse from '../../../receiveManagement/components/fromWarehouse'
import util from '../../../../../libs/util'
let that = this
export default {
    name: 'receiveAdd',
    components: {
        qqtInput,
        'up-load' : upload,
        'popout-entreport': popoutEntreport,
        'popout-material-depot' : popoutMaterialDepot,
        'qqt-send-process': qqtSendProcess,
        'qqt-flow-tabs': qqtFlowTabs,
        'qqt-consent': qqtConsent,
        'from-warehouse': fromWarehouse,
        'bottomInformation': bottomInformation
    },
    data () {
        return {
            jsonData: {},
            remoteFuncs: {},
            remoteFunOption: {
                sourceType: [
                    { value: '1', label: '从仓库出租' },
                    { value: '2', label: '就地出租' }
                ],
                commenceOption: [
                    { id: '1', name: '一成新' },{ id: '2', name: '二成新' },
                    { id: '3', name: '三成新' },{ id: '4', name: '四成新' },
                    { id: '5', name: '五成新' },{ id: '6', name: '六成新' },
                    { id: '7', name: '七成新' },{ id: '8', name: '八成新' },
                    { id: '9', name: '九成新' },{ id: '10', name: '十成新' },
                ],
                pricingMannerOption: [
                    { id: '1', name: '日' },{ id: '2', name: '月' },{ id: '3', name: '年' },
                ]
            },
            values: {
                rentalName: '',
                rentalBrand: '',
                specificationsModels: '',
                unitMeasurement: '',
                proposerId: util.cookies.get ('uuid'),
                applicationDate: util.TimestampFormat(new Date(), 'yyyy-MM-dd'),
                libraryStoragePlant: '',
                factoryLibraryLocation: ''
            },
            transform: {
                isShowDetails: false,
            },
            upLoadFileDefaultList: [],
            addDetail: false,
            // 材料库
            popoutVisible: false,
            // 添加行的供应商显示
            showSupplier: true,
            formSize: 'medium',
            remoteOption: {
                departList: [],
                supplier: [],
                pricingManner: [],
                rentalType: []
            },
            btnTitle: '元',
            fileList: [],
            rules: this.rulesNo,
            rulesYes: {
                invoice: [
                    { required: true, message: '请选择是否开票', trigger: 'change' }
                ],
                invoiceTypeId: [
                    { required: true, message: '请选择开票类型', trigger: 'change' }
                ]
            },
            rulesNo: {
                invoice: [
                    { required: true, message: '请选择是否开票', trigger: 'change' }
                ]
            },
            // 发票类型可否选择
            canInvoice: false,
            isMoneyType: true,
            invoiceTypeList: [],
            invoiceForm: {
                invoice: '',
                invoiceTypeId: null,
                invoiceAmount: '',
            },
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
            processModuleId: MATERIALEQUIPMENTMANAGEMENT.RENTOUTAPPLY,
            prossValue: {
                title: ''
            },
            factoryVisible: false,
            factoryItem: {},
            // 选择的材料
            seletItem: {},

            // 存放仓库
            libraryData: {
                libraryStoragePlant: '',
                factoryLibraryLocation: '',
                applySourceCode: '',
                applySourceId: '',
                applySourceName: '',
            },
            rulesLibrary: {
                libraryStoragePlant: [ { required: true, message: '请选择仓库', trigger: 'change' } ],
                applySourceId: [],
            },
            btnIcon: 'el-icon-plus',
            // 申请单
            applySourceList: [],
            noInput: false,
            canChoseLibrary: true,
            showWarehouse: false,
            depositoryId: '',
            fromRentOut: true,
            applySourceIdTem: '', // 保存领用单id
        }
    },
    methods: {
        ...mapActions('d2admin/page', [
            'close'
        ]),
        valueChange (field, value, model) {
            switch (field) {
                case 'rentAmount':
                case 'rentalUnitPrice':
                case 'leaseTime':
                case 'pricingMannerId':
                    this.calculateTotalPrice(model)
                    break
                case 'libraryStoragePlantId':
                    let libraryItem = this.remoteOption.libraryStorage.find(item => item.id === value)
                    if (libraryItem) {
                        model.factoryLibraryLocation = libraryItem.detailedAddress
                    }
                    break 
                case 'supplierId':
                    let supplierItem = this.remoteOption.supplier.find(item => item.id === value)
                    if (supplierItem) {
                        model.supplierPhone = supplierItem.contactsList[0].line3
                        model.supplierContacts = supplierItem.contactsList[0].line1
                    }
                    break
                case 'applySourceType':
                    this.libraryData = {
                        libraryStoragePlant: '',
                        factoryLibraryLocation: '',
                        applySourceCode: '',
                        applySourceId: '',
                        applySourceName: '',
                    }
                    if (value === '1') {
                        this.canChoseLibrary = true
                        this.rulesLibrary = {
                            libraryStoragePlant: [ { required: true, message: '请选择仓库', trigger: 'change' } ],
                            applySourceCode: [],
                            applySourceId: [],
                        }
                    } else {
                        this.canChoseLibrary = false
                        this.rulesLibrary = {
                            libraryStoragePlant: [],
                            applySourceCode: [ { required: true, message: '请输入领用登记单编码', trigger: 'change' } ],
                            applySourceId: [ { required: true, message: '请选择领用登记单', trigger: 'change' } ],
                        }
                    }
                    this.$refs.libraryStorageForm.resetFields()
                    break
                default:
                    break
            }
            this.values = Object.assign({}, this.values, model)
        },
        // 计算总价
        calculateTotalPrice (model) {
            if (!model.rentAmount) { return false }
            if (!model.leaseTime) { return false }
            if (!model.pricingMannerId) { return false }
            if (!model.rentalUnitPrice) { return false }
            let dayMonthYear = util.timeDifc(model.leaseTime[0], model.leaseTime[1])
            let timeLong = 0
            switch (model.pricingMannerId) {
                case '1':
                    timeLong = util.dateDiff(model.leaseTime[0], model.leaseTime[1])
                    break
                case '2':
                    timeLong = dayMonthYear.y * 12 + dayMonthYear.m + dayMonthYear.d / 30
                    break
                case '3':
                    timeLong = dayMonthYear.y + dayMonthYear.m / 12 + dayMonthYear.d / 365
                    break
            }
            model.rentalPrice = parseFloat(model.rentAmount) * parseFloat(model.rentalUnitPrice) * parseFloat(timeLong) + ''
            this.values = Object.assign({}, this.values, model)
        },
        choseLibrary () {
            if (!this.transform.isShowDetails && this.canChoseLibrary) {
                this.factoryVisible = true
            }
        },
        // 选择仓库
        getPopoutEntreport (item) {
            if (item) {
                this.factoryItem = item
                this.depositoryId = item.id
                this.libraryData.libraryStoragePlant = item.name
                this.libraryData.factoryLibraryLocation = item.address + item.detailedAddress
            }
            this.factoryVisible = false
        },
        applyChange (val) {
            let applyTem = this.applySourceList.find(el => el.id === val)
            this.applySourceIdTem = val
            this.libraryData.applySourceCode = applyTem ? applyTem.applycode : ''
            this.libraryData.applySourceName = applyTem ? applyTem.applyname : ''
        },
        // 选择材料
        choseMaterials (modal) {
            switch (modal) {
                case 'rentalName':
                    if (this.canChoseLibrary) {
                        // 从仓库选择
                        if (this.depositoryId === '') {
                            this.$message.warning("请先选择仓库!!!")
                        } else {
                            this.showWarehouse = true
                        }
                    } else {
                        //  从领用登记单选择
                        if (this.libraryData.applySourceId === '') {
                            this.$message.warning("请先选择领用登记单!!!")
                        } else {
                            this.showWarehouse = true
                        }
                    }
                    break
            }
        },
        // 材料库导入
        popoutData (data) {
            if (data) {
                switch (data.length) {
                    case 0:
                        this.$message.warning("需要选择一种材料!!!")
                        break
                    case 1: 
                        this.values.materialNumber = data[0].code
                        this.values.rentalName = data[0].name
                        this.values.rentalBrandId = data[0].brandId
                        this.values.rentalBrand = data[0].brandName
                        this.values.specificationsModelsId = data[0].specificationId
                        this.values.specificationsModels = data[0].specificationName
                        this.values.unitMeasurement = data[0].unit
                        this.values.rentalTypeId = data[0].groupId
                        this.values.technicalParameters = data[0].technicalParameters
                        this.popoutVisible = false
                        this.showWarehouse = false
                        this.seletItem = data[0]
                        this.values.materialId = data[0].materialId
                        break
                    default:
                        this.$message.warning("只能选择一种材料!!!")
                        break
                }
            } else {
                this.popoutVisible = false
                this.showWarehouse = false
            }
        },

        // 选择是否开具发票
        invoiceChange (val) {
            this.canInvoice = val === '1' ? true : false
            this.rules = val === '1' ? this.rulesYes : this.rulesNo
        },

        closeTab () {
            this.$router.go(-1)
            let tagName = this.$route.path
            this.close ({ tagName })
        },
        
        // 文件上传
        upLoadFileCallBack (data) {
            this.fileList = data
        },

        prepareData (data) {
            // 计价方式
            let pricingItem = this.remoteFunOption.pricingMannerOption.find(el => el.id === data.pricingMannerId)
            if(pricingItem) { data.pricingManner = pricingItem.name }
            // 发票类型
            let invoiceType = this.invoiceTypeList.find(el => el.id === data.invoiceTypeId)
            if(invoiceType) { data.invoiceType = invoiceType.name }
            // 供应商
            let supplierItem = this.remoteOption.supplier.find(el => el.id === data.supplierId)
            if(supplierItem) { data.supplier = supplierItem.nameSupplier }
            // 类型
            let rentalTypeItem = this.remoteOption.rentalType.find(el => el.id === data.rentalTypeId)
            if(rentalTypeItem) { data.rentalType = rentalTypeItem.name }
            // 仓库id
            data.libraryStoragePlantId = this.factoryItem.id
            //  租用时间
            data.afterDate = data.leaseTime[0]
            data.beforeDate = data.leaseTime[1]

            data.groupId = this.seletItem.groupId
            data.materialId = this.seletItem.materialId
            data.materialNumber = this.seletItem.code
            data.rentalNameId = this.seletItem.id
            data.alias = this.seletItem.alias
            data.fileList = this.fileList

            return data
        },
        // 保存
        subNewPro () {
            let item = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData().then(res => {
                this.$refs.libraryStorageForm.validate((valForm) => {
                    this.$refs.invoiceForm.validate((valid) => {
                        if(valid && valForm && res) {
                            Object.assign(res, this.invoiceForm, this.libraryData, item)
                            res = this.prepareData(JSON.parse(JSON.stringify(res)))
                            let url = this.values.id === null || this.values.id === undefined ? rentalAdd : rentalEdit
                            if(this.values.id === null || !this.values.id) {} else { res['id'] = this.values.id }
                            url(res).then(res1 => {
                                this.$message.success(res1.message)
                                this.closeTab()
                            })
                        }
                    })
                })
            })
        },
        // 提交
        submitPurchaseRequestData () {
            let item = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData().then(res => {
                this.$refs.libraryStorageForm.validate((valForm) => {
                    this.$refs.invoiceForm.validate((valid) => {
                        if(valid && valForm && res) {
                            Object.assign(res, this.invoiceForm, this.libraryData, item)
                            res = this.prepareData(JSON.parse(JSON.stringify(res)))
                            if(this.values.id === null || !this.values.id) {} else { res['id'] = this.values.id }
                            Object.assign(this.values, res)
                            this.dialogVisible = true
                            this.prossValue = {
                                title: this.$route.params.title || `出租申请:【 ${res.rentalApplicationName} 】`,
                                pdfId: this.$route.params.procDefId || '',
                                degree: this.$route.params.degree || '',
                                msg: '',
                            }
                        }
                    })
                })
            })
        },
        // 提交框返回函数
        updataPurchaseRequest (item, boolean) {
            let url = ''
            this.dialogVisible = this.isSendBack = false
            item['taskId'] = this.$route.params.taskId || ''
            this.values['completeTask'] = item
            // 前面是重新提交，后面是提交
            boolean ? url = rentalResubmit : url = rentalSubmit
            url (this.values).then (res => {
                if (res.code === 200) {
                    this.$message.success (res.message)
                    this.closeTab ()
                }
            })
        },
        // 审批操作
        consentPurchaseRequest (item = '', boolean = false) {
            this.visible = this.isTurnManage = this.isReject = false
            if (boolean) {
                this.closeTab ()
                return
            }
            if (item) {
                this.values['completeTask'] = item
                rentalProOperation (this.values).then (res => {
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
            } else {
                this.setDepartList(util.cookies.get('uuid'))
            }
        },
        getDetailsList (taskId) {
            getDetails (taskId).then (res => {
                if (res) this.nodeData = res
            })
        },
        getPurchaseRequest(id) {
            rentalQueryById({id: id}).then(res => {
                res.rentAmount = res.rentAmount + ''
                res.originalValue = res.originalValue + ''
                res.rentalUnitPrice = res.rentalUnitPrice + ''
                res.cashPledgeTotalAmount = res.cashPledgeTotalAmount + ''
                // 租用时间
                res['leaseTime'] = []
                res.leaseTime[0] = res.afterDate
                res.leaseTime[1] = res.beforeDate
                if(this.transform.isShowDetails) {
                    this.canInvoice = false
                } else {
                    this.canInvoice = true
                    this.invoiceChange(res.invoice)
                }
                this.values = res

                this.invoiceForm = { invoice: res.invoice, invoiceTypeId: res.invoiceTypeId, invoiceAmount: res.invoiceAmount + '' }
                this.libraryData = {
                    libraryStoragePlant: res.libraryStoragePlant, factoryLibraryLocation: res.factoryLibraryLocation,
                    applySourceCode: res.applySourceCode, applySourceId: res.applySourceId,
                    applySourceName: res.applySourceName,
                }
                // 是就地出租还是仓库出租
                this.canChoseLibrary = this.transform.isShowDetails ? true : res.applySourceType === '2' ? false : true
                this.depositoryId = res.libraryStoragePlantId ? res.libraryStoragePlantId : ''
                this.applySourceIdTem = res.applySourceId ? res.applySourceId : ''
                this.setFile(res.fileList)
                this.fileList = res.fileList
                this.procInstId = res.procInstId ? res.procInstId : ''
                this.setDepartList(res.createBy)
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
        getJson () {
            formGetJson({ code: MATERIALEQUIPMENTMANAGEMENT.RENTOUTAPPLY }).then(res => {
                this.jsonData = JSON.parse(res)
            })
        },
        setDepartList (id) {
            getUserDepartById({	userId: id}).then(res => { 
                this.remoteOption.departList = res
                this.setRemote(this.remoteOption)
            })
        },
        getRemoteInfo () {
            queryDicById({id: PURCHASEREQUEST.INVOICETYPE}).then(res => { this.invoiceTypeList = res })
            useApplicationList().then(res => { this.applySourceList = res })
            listSupplier().then(res1 => { this.remoteOption.supplier = res1 }).finally(() => {
                materialGroupList().then(res => {
                    this.remoteOption.rentalType = res
                }).finally(() => {
                    this.setRemote(this.remoteOption)
                })
            })
        },
        setRemote (option) {
            this.remoteFuncs = {
                getSupplierId (resolve) { resolve (option.supplier) }, // 供应商
                getRentalTypeId (resolve) { resolve (option.rentalType)}, // 类型
                getAllUser (resolve) { resolve(that.$store.getters['d2admin/allUser/getData']) },  // 申请人
                getDepartment (resolve) { resolve (option.departList) },  // 工作部门
            }
        },
    },
    mounted () {
        this.getJson()
    },
    created () {
        that = this
        this.getRemoteInfo()
        this.updataRouter ()
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
.invoiceForm{
    .el-select{
        width: 100%;
    }
    .el-input__inner{
        border-radius: 0px;
    }
    .el-form-item{
        margin-bottom: 0px;
    }
}
.libraryStorageForm{
    .second-row{
        .el-form-item{
            margin-bottom: 0px;
        }
    }
}
.up-load-div{
    padding-left: 50px;
}
</style>