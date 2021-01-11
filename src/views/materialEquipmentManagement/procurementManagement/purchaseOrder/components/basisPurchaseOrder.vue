<template>
    <div :class="{'add-purchase-order-layout': isWarehouseOrder}" class="basis-purchase-order">
        <fm-generate-form :data="jsonData" :remote="remote" :transform="transform" :value="values" ref="generateForm" @on-change="selectGenerateChange">
            <template slot="dataSource">
                <el-form :model="dataSource" ref="dataSource" label-width="150px">
                    <el-form-item label="采购任务" v-if="!isShowContract">
                        <qqt-select :value="dataSource.taskId" v-if="!transform.isShowDetails" :filterable="true" :isShowElement="false" :defaultProp="taskProp" :options="taskOptions" @select="getFieldName($event, 1)" />
                        <qqt-input v-model="values.taskName" v-if="transform.isShowDetails" :isShowElement="false" />
                    </el-form-item>
                    <el-form-item label="采购合同" v-if="isShowContract">
                        <qqt-select :value="dataSource.taskId" v-if="!transform.isShowDetails" :filterable="true" :isShowElement="false" :defaultProp="contractProp" :options="contractOptions" @select="getFieldName($event, 2)" />
                        <qqt-input v-model="values.taskName" v-if="transform.isShowDetails" :isShowElement="false" />
                    </el-form-item>
                </el-form>
            </template>
        </fm-generate-form>
        <purchase-order-form :contract="contract" ref="contract" :returnPeriodList="returnPeriodList" :invoiceTypeOptions="invoiceTypeList" :meansPaymentsOptions="meansPaymentsList" :isShowElement="!transform.isShowDetails" />
        <div class="add-purchase-order-button">
            <el-button size="mini" round @click="dialogVisible = true" :disabled="transform.isShowDetails">{{ !isShowContract ? '从任务清单导入' : '从合同清单导入' }}</el-button>
        </div>
        <el-divider content-position="left">
            <div class="generate-from-divider___line"></div>
            供货物品
        </el-divider>
        <qqt-relate-table :data="materialList" ref="materials" :isShowAdd="false" :isDefaultShowRow="false" :isShowDelete="true" :replaceRules="contractRules" @select="selectChange" :rowHeader="materialsHeader" :isShowDetails="transform.isShowDetails" />
        <bottomInformation :values="values" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation"></bottomInformation>
        <div class="drawer-btn">
            <el-button type="warning" size="mini" v-if="!transform.isShowDetails" @click="onSave">保存</el-button>
            <el-button type="primary" size="mini" v-if="!transform.isShowDetails && ($route.params.identification == '1' ? $has('self:procurement:indent:submit') : $has('material:procurement:indent:submit') )" @click="onSubmit">提交</el-button>
            <el-button size="mini" @click="$emit('close')" v-if="!this.isWarehouseOrder">关闭</el-button>
        </div>
        <popout-material-depot v-if="dialogVisible" :title="!isShowContract ? '任务清单' : '合同清单'" :dialogVisible="dialogVisible" :isTask="true" :moduleId="moduleId" @close="getMaterialData" />
    </div>
</template>

<script>
    import { addPurchaseOrder, editPurchaseOrder, getPurchaseOrderById, submitPurchaseOrder } from '../../../../../api/materialEquipmentManagement/procurementManagement/purchaseOrder'
    import { getPurchaseContractAllList, getPurchaseContractById } from '../../../../../api/materialEquipmentManagement/procurementManagement/purchaseContract'
    import { getMyPurchaseTaskList, getPurchaseTaskById } from '../../../../../api/materialEquipmentManagement/procurementManagement/purchaseTask'
    import { getMaterialDepotByModuleId } from '../../../../../api/materialEquipmentManagement/basicInformation/materialDepot'
    import { getSupplierPageAllList } from '../../../../../api/materialEquipmentManagement/supplierManagement/supplierList'
    import { addSelfPurchaseOrder, editSelfPurchaseOrder, submitSelfPurchaseOrder } from '@/api/selfProject/selfProprietaryProcurement/purchaseOrder'

    import { upload, qqtRelateTable, qqtSelect, qqtInput } from '../../../../../components/qqt-subassembly'
    import { PURCHASEREQUEST, PURCHASEORDER } from '../../../../../enum/DICTIONARY'
    import { formGetJson } from '../../../../../api/system/fromManagement/index'
    import { MATERIALEQUIPMENTMANAGEMENT } from '../../../../../enum/FORMCODE'
    import { queryDicByIds } from '../../../../../api/system/dic/dic'
    import { mapState } from 'vuex'
    import purchaseOrderForm from './purchaseOrderForm'
    import popoutMaterialDepot from '../../../basicInformation/materialDepot/components/popoutMaterialDepot'
    import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
    import util from '@/libs/util.js'
    let than = this
    export default {

        props: {
            relevancyId: {
                type: String,
                default: () => ''
            },

            isWarehouseOrder: {
                type: Boolean,
                default: () => false
            }
        },

        data () {
            return {
                remote: {},
                values: {
                    materialList: [],
                    orderAmount: '',
                    fileList: [],
                    invoice: '0',
                    ordersource: '2'
                },
                moduleId: '',
                contract: {},
                jsonData: {},
                dataSource: {
                    taskId: '',
                    contractId: ''
                },
                materialList: [],
                supplierList: [],
                orderTypeList: [],
                invoiceTypeList: [],
                returnPeriodList: [],
                dialogVisible: false,
                meansPaymentsList: [],
                upLoadFileDefaultList: [],
                transform: {
                    isShowDetails: false
                },
                isShowContract: true,
                materialsHeader: [],
                contractOptions: [],
                contractProp: {
                    value: 'id',
                    label: 'contractName'
                },
                taskOptions: [],
                taskProp: {
                    value: 'id',
                    label: 'taskName'
                },
                contractRules: {
                    'supplierId': [
                        { required: true, message: '供应商不能为空', trigger: 'change' }
                    ]
                },
            }
        },

        methods: {

            getFormByJson () {
                formGetJson ({'code': MATERIALEQUIPMENTMANAGEMENT.ADDPURCHASEORDER}).then(res => {
                    if (res) this.jsonData = JSON.parse(res)
                })
            },

            upLoadFileCallBack (item) {
                this.values.fileList = item
            },

            selectGenerateChange (field, val, model) {
                let item = ''
                switch (field) {
                    case 'orderTypeId':
                        item = this.orderTypeList.find (f => f.id === val)
                        if (item) this.values['orderType'] = item.name
                        break
                    case 'ordersource':
                        this.values.ordersource = val
                        val == '2' ? this.isShowContract = true : this.isShowContract = false
                        break
                    case 'orderAmount':
                        this.values.orderAmount = val
                        break
                }
            },

            onSave () {
                let data = '', url = '', element = {}
                data = this.typeConversion ()
                element = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then(item => {
                    if (item && data.list && data.contract && data.dataSource && element){
                        Object.assign (this.values, data.contract, item, data.dataSource, element)
                        this.values['materialList'] = data.list
                        if(this.$route.params.identification == '1') { 
                            this.values.relevanceProjectId = this.values['projectCode'] = this.selfSupportProject.projectCode 
                            this.values.relevanceProject = this.selfSupportProject.projectName
                        }
                        this.values.id == null ? ( this.$route.params.identification == '1' ? url = addSelfPurchaseOrder : url = addPurchaseOrder) :
                            this.$route.params.identification == '1' ? url = editSelfPurchaseOrder : url = editPurchaseOrder
                        url (this.values).then(res => {
                            if (res.code === 200) {
                                this.$message.success ('操作成功')
                                this.$emit('close')
                            }
                        })
                    }
                })
            },

            onSubmit () {
                let data = this.typeConversion ()
                let element = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then(item => {
                    if (item && data.list && data.contract && data.dataSource && element){
                        Object.assign (this.values, data.contract, item, data.dataSource, element)
                        this.values['materialList'] = data.list
                        if(this.$route.params.identification == '1') { 
                            this.values.relevanceProjectId = this.values['projectCode'] = this.selfSupportProject.projectCode
                            this.values.relevanceProject = this.selfSupportProject.projectName
                        }
                        let url = ''
                        this.$route.params.identification == '1' ? url = submitSelfPurchaseOrder : url = submitPurchaseOrder
                        url (this.values).then(res => {
                            if (res.code === 200) {
                                this.$message.success ('操作成功')
                                this.$emit('close')
                            }
                        })
                    }
                })
            },

            getQueryDicByIdList () {
                let list = [ PURCHASEORDER.ORDERTYPE, PURCHASEORDER.RETURNPERIOD, PURCHASEORDER.UINVOICETYPE, PURCHASEORDER.MEANSPAYMENTS ]
                queryDicByIds (list).then (item => {
                    if (!item) return
                    this.orderTypeList = item[PURCHASEORDER.ORDERTYPE]
                    this.invoiceTypeList = item[PURCHASEORDER.UINVOICETYPE]
                    this.returnPeriodList = item[PURCHASEORDER.RETURNPERIOD]
                    this.meansPaymentsList = item[PURCHASEORDER.MEANSPAYMENTS]
                    this.neatenData ()
                })
            },

            getPurchaseOrder (id) {
                getPurchaseOrderById ({'id': id}).then (res => {
                    if (res) {
                        let data = this.typeConversion (res)
                        this.values = data
                        this.contract = JSON.parse (JSON.stringify (this.values))
                        this.materialList = JSON.parse (JSON.stringify (this.values.materialList))
                        this.dataSource.taskId = this.values.taskId
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
                    }
                })
            },

            getSupplierAllList () {
                getSupplierPageAllList ().then (res => {
                    if (res) this.supplierList = res, this.isShowMaterialsHeader (res)
                })
            },

            getMyAllTask () {
                getMyPurchaseTaskList ().then (res => {
                    if (res) {
                        this.taskOptions = res
                        if (this.$route.params && this.$route.params.isTaskDecomposition) this.isShowContract = false, this.getFieldName (this.$route.params.dataSource.id, 1)
                    }
                })
            },

            getPurchaseContractList () {
                getPurchaseContractAllList ().then (res => {
                    if (res) {
                        this.contractOptions = res
                        if (this.$route.params && this.$route.params.isContract) this.isShowContract = true, this.getFieldName (this.$route.params.dataSource.id, 2)
                    }
                })
            },

            getSonPurchaseTaskById (id) {
                getPurchaseTaskById ({'id': id}).then (res => {
                    if (res) this.getMaterialListById (res, true)
                })
            },

            getSonPurchaseContractById (id) {
                getPurchaseContractById ({'id': id}).then (res => {
                    if (res) this.getMaterialListById (res, false)
                })
            },

            getMaterialListById (res, boolean) {
                this.materialList = []
                let text = { amount: 'number1', selected: 'number2' }
                getMaterialDepotByModuleId ({'mainId': res.id, ...text}).then (list => {
                    if (list && list.length > 0) {
                        res.materialList = list
                        this.updataMaterialList (res, boolean)
                    }
                })
            },

            updataMaterialList (res, boolean) {
                let item = {}, data = {}
                item = this.typeConversion (res)
                const { relevanceProjectId, relevanceProject, section, projectType } = item
                switch (boolean) {
                    case true:
                        data = { relevanceProjectId, relevanceProject, section, projectType }
                        break
                    case false:
                        const { invoiceTypeId, invoiceType, meansPaymentsId, meansPayments, taxRate, invoice, contractAmount: orderAmount, supplySideId } = item
                        data = { relevanceProjectId, relevanceProject, section, projectType, invoiceTypeId, invoiceType, meansPaymentsId, meansPayments, taxRate, invoice, supplySideId }
                        this.values.orderAmount = orderAmount + ''
                        break
                }
                this.contract = data
                this.materialList = res.materialList
            },

            getFieldName (value, state) {
                if (!value) {
                    let item = {sectionIds: [], section: '', relevanceProjectId: '', relevanceProject: '', invoice: '0', invoiceTypeId: '', invoiceType: '', taxRate: ''}
                    this.contract = JSON.parse ( JSON.stringify (item) )
                    this.dataSource = { taskId: '', contractId: '' }
                    this.materialList = []
                    this.values.orderAmount = '', this.isShowContract ? this.values.ordersource = '2' : this.values.ordersource = '1'
                    return
                }
                let data = {}
                this.dataSource.taskId = this.moduleId = value
                switch (state) {
                    case 1:
                        data = this.taskOptions.find (f => f.id == value)
                        if (data) this.values['taskName'] = data.taskName
                        this.values.ordersource = '1'
                        this.getSonPurchaseTaskById (value)
                        break
                    case 2:
                        data = this.contractOptions.find (f => f.id == value)
                        if (data) this.values['taskName'] = data.contractName
                        this.values.ordersource = '2'
                        this.getSonPurchaseContractById (value)
                        break
                }
            },

            typeConversion (res) {
                this.materialkey = ''
                let contract = {}, list = [], data = {}
                if (!res) {
                    list = this.$refs.materials.verify (), contract = this.$refs.contract.verify ()
                    this.$refs.dataSource.validate (valid => {
                        if (valid) {
                            contract.invoiceAmount ? contract.invoiceAmount = Number (contract.invoiceAmount) : '', contract.taxAmount ? contract.taxAmount = Number (contract.taxAmount) : ''
                            contract.taxRate ? contract.taxRate = Number (contract.taxRate) : '',  contract.orderAmount ? contract.orderAmount = Number (contract.orderAmount) : ''
                            list.forEach (res => { res.number1 = Number (res.number1) })
                        }
                    })
                    return data = { list, contract, dataSource: this.dataSource }
                } else {
                    res.invoiceAmount = res.invoiceAmount ? res.invoiceAmount + '' : ''
                    res.orderAmount = res.orderAmount ? res.orderAmount + '' : ''
                    res.taxAmount = res.taxAmount ? res.taxAmount + '' : ''
                    res.taxRate = res.taxRate ? res.taxRate + '' : ''
                    res.materialList.forEach (f => { f.number1 = f.number1 + '', f ['consumablesName'] = f.consumables == '1' ? '是' : '否' })
                    return res
                }
            },

            neatenData () {
                this.remote = {

                    getOrderTypeId (resolve) {
                        resolve (than.orderTypeList)
                    },

                    getOrdersource (resolve) {
                        resolve ([
                            {
                                value: '1',
                                label: '采购任务'
                            },
                            {
                                value: '2',
                                label: '采购合同'
                            }
                        ])
                    }
                }
            },

            getMaterialData (item) {
                let str = '', data = {}, list = []
                this.dialogVisible = false
                if (item) {
                    this.materialList = this.$refs.materials.getNotVerify ()
                    item.forEach (res => {
                        res['consumablesName'] = res.consumables == '1' ? '是' : '否'
                        res['parentId'] = res['string4'] = res.id, res['string1'] = ''
                        data = this.materialList.find (f => f.id == res.id)
                        if (this.contract.supplySideId) res.supplierId = this.contract.supplySideId, this.selectChange (res, '', this.contract.supplySideId)
                        if (!data) list.push (res)
                    })
                    this.materialList.push (...list)
                }
            },

            selectChange (data, prop, value) {
                let item = this.supplierList.find (f => f.id === value)
                if (item) data.string1 = item.contactNumber, data['supplierName'] = item.nameSupplier
            },

            isShowMaterialsHeader (data = []) {
                this. materialsHeader = [
                    {
                        prop: 'code',
                        label: '材料编码',
                        isShow: true,
                        type: 'text',
                        width: 200,
                        isShowDetails: true
                    },
                    {
                        prop: 'name',
                        label: '名称',
                        isShow: true,
                        type: 'text',
                        width: 200,
                        isShowDetails: true
                    },
                    {
                        prop: 'brandName',
                        label: '品牌',
                        isShow: true,
                        type: 'text',
                        width: 200,
                        isShowDetails: true
                    },
                    {
                        prop: 'specificationName',
                        label: '规格型号',
                        isShow: true,
                        type: 'text',
                        width: 200,
                        isShowDetails: true
                    },
                    {
                        prop: 'unit',
                        label: '计量单位',
                        isShow: true,
                        type: 'text',
                        width: 200,
                        isShowDetails: true
                    },
                    {
                        prop: 'supplierId',
                        label: '供应商',
                        isShow: true,
                        type: 'select',
                        options: data,
                        width: 200,
                        defaultProp: {
                            value: 'id',
                            label: 'nameSupplier'
                        },
                        required: true
                    },
                    {
                        prop: 'string1',
                        label: '联系方式',
                        isShow: true,
                        type: 'text',
                        width: 200,
                        isShowDetails: true
                    },
                    {
                        prop: 'number1',
                        label: '采购数量',
                        isShow: true,
                        width: 200,
                        type: 'money',
                        isShowDetails: true,
                        isNonnegativeNumber: true
                    },
                    {
                        prop: 'consumablesName',
                        label: '是否消耗品',
                        isShow: true,
                        type: 'text',
                        width: 200,
                        isShowDetails: true
                    },
                    {
                        prop: 'remark',
                        label: '备注',
                        isShow: true,
                        type: 'text',
                        width: 200
                    }
                ]
            }
        },

        created () {
            this.getMyAllTask ()
            this.getFormByJson ()
            this.getSupplierAllList ()
            this.getQueryDicByIdList ()
            this.getPurchaseContractList ()
            this.isWarehouseOrder ? this.transform.isShowDetails = this.isWarehouseOrder : this.transform = this.$route.params.transform
            if (this.$route.params.relevancyId) this.getPurchaseOrder (this.$route.params.relevancyId)
            if (this.relevancyId) this.getPurchaseOrder (this.relevancyId)
            if(this.$route.params.identification == '1') this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad')
        },

        mounted () {
            than = this
        },

        computed: {
            ...mapState ('d2admin/selfSupportProject', [
                'selfSupportProject'
            ])
        },

        components: {
            'qqt-input': qqtInput,
            'qqt-select': qqtSelect,
            'qqt-relate-table': qqtRelateTable,
            'bottomInformation': bottomInformation,
            'purchase-order-form': purchaseOrderForm,
            'popout-material-depot': popoutMaterialDepot
        }
    }
</script>

<style lang='scss'>
    .basis-purchase-order {
        .drawer-btn{
            padding-top: 10px;
            text-align: center;
        }
        .el-input__inner {
            border-radius: 0px !important;
        }
        .add-purchase-order-button {
            float: right;
            position: relative;
            top: 10px;
            background: #fff;
            width: 120px;
            text-align: right;
            z-index: 1;
        }
        .qqt-Relate-table {
            padding-top: 10px;
            padding-bottom: 15px;
        }
        .el-input-group__append {
            border-radius: 0px !important
        }
        .el-col-16 {
            height: 58px !important;
        }
    }
    .add-purchase-order-layout {
        margin: -15px 20px 20px
    }
</style>