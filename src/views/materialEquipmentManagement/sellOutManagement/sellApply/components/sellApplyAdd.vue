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
                            <template slot="warehouseOrOrder">
                                <el-form class="libraryStorageForm" ref="libraryStorageForm" :rules="rulesLibrary" :model="libraryData" :size="formSize" label-width="140px">
                                    <el-row>
                                        <el-col :span="8">
                                            <el-form-item label="存放仓库:" prop="depositoryName">
                                                <qqt-input :value="libraryData.depositoryName" @btnClick="choseLibrary" v-model="libraryData.depositoryName" :btnIcon="btnIcon" :isShowElement="noInput"></qqt-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="16">
                                            <el-form-item label="仓库地点:">
                                                <qqt-input :value="libraryData.depositoryAddress" v-model="libraryData.depositoryAddress" :isShowElement="noInput"></qqt-input>
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
                                        <el-form-item label="是否有定金:" prop="existEarnest">
                                            <el-radio-group v-model="invoiceForm.existEarnest" @change='changeExistEarnest' :disabled="transform.isShowDetails">
                                                <el-radio label="1">有</el-radio>
                                                <el-radio label="0">无</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item label="定金总额:" prop="earnestMoney">
                                            <qqt-input :value="invoiceForm.earnestMoney" v-model="invoiceForm.earnestMoney" :btnTitle="btnTitle" :isShowElement="earnestInput" :isMoneyType="isMoneyType"></qqt-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row class="second-row">
                                        <el-col :span="8"> 
                                        <el-form-item label="是否开具发票:" required prop="isopen">
                                            <el-radio-group v-model="invoiceForm.isopen" @change='invoiceChange' :disabled="transform.isShowDetails">
                                                <el-radio label="1">是</el-radio>
                                                <el-radio label="0">否</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item label="发票类型:" prop="invoiceType">
                                                <el-select v-model="invoiceForm.invoiceType" :disabled="!canInvoice" placeholder="请选择">
                                                    <el-option v-for="item in invoiceTypeList" :label="item.name" :value="item.name" :key="item.id"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item label="开票金额:">
                                            <qqt-input :value="invoiceForm.invoiceMoney" v-model="invoiceForm.invoiceMoney" :btnTitle="btnTitle" :isShowElement="canInvoice" :isMoneyType="isMoneyType"></qqt-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-form>
                            </template>
                        </fm-generate-form>
                        <div class="up-load-div">
                            <up-load :isShowUpload="!transform.isShowDetails" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList" ref="upload"/>
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
                <el-button v-if="!transform.isShowDetails && procInstId === '' && $has('material:sell:apply:submit')" type="primary" size="small" @click="values['flag'] = '1', submitPurchaseRequestData ()">提交</el-button>
                <el-button size="small" @click="closeTab">关闭</el-button>
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
import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
import { synopsisList } from '../../../../../api/materialEquipmentManagement/receiveManagement/receiveApply/index'
import { listSupplier, } from '../../../../../api/materialEquipmentManagement/rentOutManagement/rentOutApply/index'
import { sellApplyQueryById, sellApplyAdd, sellApplyEdit, sellApplySub, sellApplyOperation, sellApplyReSub, } 
            from '../../../../../api/materialEquipmentManagement/sellManagement/sellApply/index' 
import { useApplicationList } from '@/api/materialEquipmentManagement/rentOutManagement/rentOutApply/index'
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
        'bottomInformation': bottomInformation,
    },
    data () {
        return {
            jsonData: {},
            remoteFuncs: {},
            remoteFunOption: {
                sourceType: [
                    { value: '1', label: '从仓库出售' },
                    { value: '2', label: '就地出售' }
                ],
                commenceOption: [
                    { id: '1', name: '一成新' },{ id: '2', name: '二成新' },
                    { id: '3', name: '三成新' },{ id: '4', name: '四成新' },
                    { id: '5', name: '五成新' },{ id: '6', name: '六成新' },
                    { id: '7', name: '七成新' },{ id: '8', name: '八成新' },
                    { id: '9', name: '九成新' },{ id: '10', name: '十成新' },
                ]
            },
            values: {
                goodsname: '',
                brandName: '',
                specificationName: '',
                itemtype: '',
                unit: '',
                applySourceType: '1',
                depositoryAddress: '',
                depositoryName: '',
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
                meanspayments: [],
            },
            btnTitle: '元',
            fileList: [],
            rules:  {
                isopen: [ { required: true, message: '请选择是否开票', trigger: 'change' } ],
                invoiceType: [ ],
                existEarnest: [ { required: true, message: '请选择是否有定金', trigger: 'change' } ],
                earnestMoney: [ ]
            },
            // 发票类型可否选择
            canInvoice: false,
            earnestInput: false,
            isMoneyType: true,
            invoiceTypeList: [],
            invoiceForm: {
                isopen: '',
                invoiceType: null,
                invoiceMoney: '',
                earnestMoney: '',
                existEarnest: ''
            },
            // 存放仓库
            libraryData: {
                depositoryName: '',
                depositoryAddress: '',
                applySourceCode: '',
                applySourceId: '',
                applySourceName: '',
            },
            factoryVisible: false,
            factoryItem: {},
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
            processModuleId: MATERIALEQUIPMENTMANAGEMENT.SELLAPPLYADD,
            prossValue: {
                title: ''
            },
            rulesLibrary: {
                depositoryName: [ { required: true, message: '请选择仓库', trigger: 'change' } ],
                applySourceId: [],
            },
            btnIcon: 'el-icon-plus',
            applySourceList: [],
            noInput: false,
            canChoseLibrary: true,
            showWarehouse: false,
            depositoryId: '',
            fromRentOut: true,
            applySourceIdTem: '', // 保存领用单id

            // 选择的材料
            seletItem: {}
        }
    },
    methods: {
        ...mapActions('d2admin/page', [
            'close'
        ]),
        valueChange (field, value, model) {
            switch (field) {
                case 'number':
                    if(parseFloat(value) < 0) {
                        this.$message.warning('出售数量不能小于0')
                        model.number = ''
                    } else {
                        model.totalPrice = parseFloat(value === '' ? '0' : value) 
                            * parseFloat(model.uinitPrice === '' ? '0' : model.uinitPrice) + ''
                    }
                    break
                case 'uinitPrice':
                    if(parseFloat(value) < 0) {
                        this.$message.warning('出售单价不能小于0')
                        model.uinitPrice = '0'
                    } else {
                        model.totalPrice = parseFloat(value === '' ? '0' : value) 
                                * parseFloat(model.number === '' ? '0' : model.number) + ''
                    }
                    break
                case 'supplierId':
                    let supplierItem = this.remoteOption.supplier.find(item => item.id === value)
                    if (supplierItem) {
                        model.supPhone = supplierItem.contactsList[0].line3 ? supplierItem.contactsList[0].line3 : []
                        model.supContactsName = supplierItem.contactsList[0].line1 ? supplierItem.contactsList[0].line1 : []
                    }
                    break
                case 'applySourceType':
                    this.libraryData = {
                        depositoryName: '',
                        depositoryAddress: '',
                        applySourceCode: '',
                        applySourceId: '',
                        applySourceName: '',
                    }
                    if (value === '1') {
                        this.canChoseLibrary = true
                        this.rulesLibrary = {
                            depositoryName: [ { required: true, message: '请选择仓库', trigger: 'change' } ],
                            applySourceCode: [],
                            applySourceId: [],
                        }
                    } else {
                        this.canChoseLibrary = false
                        this.rulesLibrary = {
                            depositoryName: [],
                            applySourceCode: [ { required: true, message: '请输入领用登记单编码', trigger: 'change' } ],
                            applySourceId: [ { required: true, message: '请选择领用登记单', trigger: 'change' } ],
                        }
                    }
                    this.$refs.libraryStorageForm.resetFields()
                    break
            }
            this.values = Object.assign( {}, this.values, model)
        },
        // 选择材料
        choseMaterials (field, model) {
            switch (field) {
                case 'goodsname':
                    if (!this.transform.isShowDetails) {
                        // this.popoutVisible = true
                        this.showWarehouse = true
                    }
                    break
            }
        },
        getPopoutEntreport (item) {
            if(item) {
                this.depositoryId = item.id
                this.libraryData.depositoryId = item.id
                this.libraryData.depositoryName = item.name
                this.libraryData.depositoryAddress = item.address + item.detailedAddress
            }
            this.factoryVisible = false
        },
        // 材料库导入
        popoutData (data) {
            if (data) {
                switch (data.length) {
                    case 0:
                        this.$message.warning("需要选择一种材料!!!")
                        break
                    case 1: 
                        this.values.goodscode = data[0].code
                        this.values.goodsname = data[0].name
                        this.values.itemtype = data[0].groupName
                        this.seletItem = data[0]
                        const { alias, brandId, brandName, consumables, groupId, groupName, materialId, 
                            parentId, price, specificationId, specificationName, unit, warehouseId } = data[0]
                        Object.assign(this.values, { alias, brandId, brandName, consumables, groupId, groupName, materialId, 
                            parentId, price, specificationId, specificationName, unit, warehouseId })
                        
                        console.log (JSON.parse(JSON.stringify(this.values)))
                        this.showWarehouse = false
                        break
                    default:
                        this.$message.warning("只能选择一种材料!!!")
                        break
                }
            } else {
                this.showWarehouse = false
            }
        },
        // 选择仓库
        choseLibrary () {
            if (!this.transform.isShowDetails && this.canChoseLibrary) {
                this.factoryVisible = true
            }
        },
        // 选择领用单
        applyChange (val) {
            let applyTem = this.applySourceList.find(el => el.id === val)
            this.applySourceIdTem = val
            this.libraryData.applySourceCode = applyTem ? applyTem.applycode : ''
            this.libraryData.applySourceName = applyTem ? applyTem.applyname : ''
        },

        // 选择是否开具发票
        invoiceChange (val) {
            this.canInvoice = val === '1' ? true : false
            if(val === '1') {
                this.rules.invoiceType = [{ required: true, message: '请选择发票类型', trigger: 'change' }]
                this.rules.invoiceMoney = [{ required: true, message: '请填写发票金额', trigger: 'change' }]
            } else {
                this.rules.invoiceType = [ ]
                this.rules.invoiceMoney = [ ]
            }
            this.invoiceForm.invoiceType = val === '1' ? this.invoiceForm.invoiceType : ''
            this.invoiceForm.invoiceMoney = val === '1' ? this.invoiceForm.invoiceMoney : ''
        },

        //  选择是否有定金
        changeExistEarnest (val) {
            this.earnestInput = val === '1' ? true : false
            if (val === '1') {
                this.rules.earnestMoney = [{ required: true, message: '请选择发票类型', trigger: 'change' }]
            } else {
                this.rules.earnestMoney = [ ]
            }
            this.invoiceForm.earnestMoney = val === '1' ? this.invoiceForm.earnestMoney : ''
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
            // // 供应商
            let supplierItem = this.remoteOption.supplier.find(el => el.id === data.supplierId)
            if(supplierItem) { data.supplierName = supplierItem.nameSupplier }
            
            // data.goodsid = this.seletItem.id
            data.materialId = this.seletItem.materialId ? this.seletItem.materialId : data.materialId
            data.groupId = this.seletItem.groupId ? this.seletItem.groupId : data.groupId
            data.fileList = this.fileList
            return data
        },
        // 保存
        subNewPro () {
            let item = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData().then(res => {
                this.$refs.invoiceForm.validate((valid) => {
                    this.$refs.libraryStorageForm.validate((valid1) => {
                        if(valid && valid1 && res) {
                            Object.assign(res, this.invoiceForm, this.libraryData, item)
                            res = this.prepareData(JSON.parse(JSON.stringify(res)))
                            res.id = this.$route.params.isAdd ? null : this.values.id
                            let url = this.$route.params.isAdd ? sellApplyAdd : sellApplyEdit
                            // if(this.values.id === null || !this.values.id) {} else { res['id'] = this.values.id }
                            console.log(res)
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
                this.$refs.invoiceForm.validate((valid) => {
                    this.$refs.libraryStorageForm.validate((valid1) => {
                        if(valid && valid1 && res) {
                            Object.assign(res, this.invoiceForm, this.libraryData, item)
                            res = this.prepareData(JSON.parse(JSON.stringify(res)))
                            // if(this.values.id === null || !this.values.id) {} else { res['id'] = this.values.id }
                            res.id = this.$route.params.isAdd ? null : this.values.id
                            Object.assign(this.values, res)
                            this.dialogVisible = true
                            this.prossValue = {
                                title: this.$route.params.title || `出售申请:【 ${res.applyname} 】`,
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
            boolean ? url = sellApplyReSub : url = sellApplySub
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
                sellApplyOperation (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closeTab ()
                    }
                })
            }
        },
        setDepart (id) {
            getUserDepartById({	'userId': id}).then(res => {
                this.remoteOption.departList = res
                this.setRemote(this.remoteOption)
            })
        },
        getDetailsList (taskId) {
            getDetails (taskId).then (res => {
                if (res) this.nodeData = res
            })
        },
        getPurchaseRequest(id) {
            sellApplyQueryById({id: id}).then(res => {
                if(this.transform.isShowDetails) {
                    this.canInvoice = false
                } else {
                    this.invoiceChange(res.invoice)
                }
                res.number = res.number + ''
                res.uinitPrice = res.uinitPrice + ''
                this.values = res
                this.echoData (res)
                this.setFile(res.fileList)
                this.fileList = res.fileList
                this.depositoryId = res.depositoryId ? res.depositoryId : ''
                this.procInstId = res.procInstId ? res.procInstId : ''
            })
        },
        echoData (data) {
            this.invoiceForm = {
                isopen: data.isopen,
                invoiceType: data.invoiceType,
                invoiceMoney: data.invoiceMoney,
                earnestMoney: data.earnestMoney,
                existEarnest: data.existEarnest
            },
            // 存放仓库
            this.libraryData = {
                depositoryName: data.depositoryName,
                depositoryAddress: data.depositoryAddress,
                applySourceCode: data.applySourceCode,
                applySourceId: data.applySourceId,
                applySourceName: data.applySourceName
            }
            this.seletItem.materialId = data.materialId  ? data.materialId : ''
            this.seletItem.groupId = data.groupId ? data.groupId : ''
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
                this.setDepart(util.cookies.get('uuid'))
            }
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
            formGetJson({
                code: MATERIALEQUIPMENTMANAGEMENT.SELLAPPLYADD
            }).then(res => {
                this.jsonData = JSON.parse(res)
            })
        },
        getRemoteInfo () {
            queryDicById({id: PURCHASEREQUEST.INVOICETYPE}).then(res => { this.invoiceTypeList = res })
            useApplicationList().then(res => { this.applySourceList = res })
            listSupplier().then(res1 => {
                this.remoteOption['supplier'] = res1
            }).finally(() => {
                queryDicById({id : PURCHASEREQUEST.MEANSPAYMENTS}).then(res2 => {
                    this.remoteOption['meanspayments'] = res2
                    this.setRemote(this.remoteOption)
                })
            })
        },
        setRemote (option) {
            this.remoteFuncs = {
                getSupplierId (resolve) { resolve (option.supplier) },    // 供应商
                getSettlementMethod (resolve) { resolve(option.meanspayments) },    // 结算方式
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
    .second-row{
        .el-form-item{
            margin-bottom: 0px;
        }
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