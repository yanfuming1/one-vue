<template>
    <d2-container type="fulls" class="add-purchase-contract">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
            </div>
            <div class="qqt-container-full-center___top">
                <qqt-flow-tabs :procInstId="procInstId">
                    <template slot="content">
                        <fm-generate-form 
                            :data="jsonData"
                            :remote="remote"
                            :value="values"
                            :transform="transform"
                            ref="generateForm"
                            @on-change="selectGenerateChange"
                        />
                        <purchase-contract-form 
                            :contract="contract"
                            ref="contract"
                            :invoiceTypeOptions="invoiceTypeList"
                            :meansPaymentsOptions="meansPaymentsList"
                            :taxCategoriesOptions="taxCategoriesList"
                            :isShowElement="!transform.isShowDetails"
                            @moduleId="moduleId = $event, isShowMaterialsHeader (), updataAmount ()"
                            @isResetMaterialList="$event ? materialList = [] : ''"
                            @contractAmount="getContractAmount" />
                        <div class="add-purchase-contract-button">
                            <el-button size="mini" round @click="popoutMaterial = true" :disabled="transform.isShowDetails">{{ moduleId == '' ? '从材料库导入' : '从任务清单导入' }}</el-button>
                        </div>
                        <el-divider content-position="left">
                            <div class="generate-from-divider___line"></div>
                            采购合同材料明细&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;合计金额:&nbsp;&nbsp;<span class="color">{{this.values.amount}}元</span>
                        </el-divider>
                        <el-row>
                            <el-col :span="24">
                                <qqt-relate-table
                                    :data="materialList"
                                    ref="materials"
                                    :isShowAdd="false"
                                    :isDefaultShowRow="false"
                                    :rowHeader="materialsHeader"
                                    :replaceRules="contractRules"
                                    :isShowDetails="transform.isShowDetails"
                                    @change="calculateTotal"
                                    @delete="updataAmount"
                                />
                            </el-col>
                        </el-row>
                        <bottomInformation :values="values" fieldTitle="经办" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation"></bottomInformation>
                    </template>
                </qqt-flow-tabs>
            </div>
            <div class="qqt-container-full-content___button">
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitPurchaseContractData ()">重新提交</el-button>
                <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="savePurchaseContract">保存</el-button>
                <el-button type="primary" v-if="!transform.isShowDetails && procInstId === '' &&  ( $route.params.identification == '1' ? $has('self:procurement:contract:submit') : $has ('material:procurement:contract:submit') )" @click="values['flag'] = '1', submitPurchaseContractData ()">提交</el-button>
                <el-button @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataPurchaseContract"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentPurchaseContract" />
        <popout-material-depot v-if="popoutMaterial" :title="moduleId == '' ? '材料库': '任务清单'" :dialogVisible="popoutMaterial" :isTask="true" :moduleId="moduleId" @close="getMaterialData" />
    </d2-container>
</template>

<script>
    import { formGetJson } from '../../../../../api/system/fromManagement/index'
    import { getPurchaseContractById, editPurchaseContract, 
             addPurchaseContract, submitPurchaseContract, completePurchaseContract, resetSubmitPurchaseContract } from '../../../../../api/materialEquipmentManagement/procurementManagement/purchaseContract'
    import { addSelfPurchaseContract, editSelfPurchaseContract, submitSelfPurchaseContract } from '@/api/selfProject/selfProprietaryProcurement/purchaseContract'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, upload, qqtRelateTable } from '../../../../../components/qqt-subassembly'
    import { getMaterialDepotByModuleId } from '../../../../../api/materialEquipmentManagement/basicInformation/materialDepot'
    import { getSupplierPageAllList } from '../../../../../api/materialEquipmentManagement/supplierManagement/supplierList'
    import { materialType } from '../../../../../api/materialEquipmentManagement/warehouseManagement/returnedGoods'
    import { MATERIALEQUIPMENTMANAGEMENT } from '../../../../../enum/FORMCODE'
    import { PURCHASEREQUEST, PURCHASECONTRACT, PURCHASEORDER } from '../../../../../enum/DICTIONARY'
    import { queryDicByIds } from '../../../../../api/system/dic/dic'
    import { getDetails } from '../../../../../api/approval/common'
    import { mapActions, mapState } from 'vuex'

    import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
    import popoutMaterialDepot from '../../../basicInformation/materialDepot/components/popoutMaterialDepot'
    import purchaseContractForm from './purchaseContractForm'
    import util from '@/libs/util.js'
import rules from '../../../../../bpmn-js/lib/features/rules'
    let than = this
    export default {
        
        data () {
            return {
                title: '',
                stutas: '',
                remote: {},
                jsonData: {},
                contract: {},
                moduleId: '',
                procInstId: '',
                materialkey: '',
                needSideList: [],
                materialList: [],
                listMaterial: [],
                contractAmount: '',
                departmentList: [],
                supplySideList: [],
                invoiceTypeList: [],
                materialTypeList: [],
                meansPaymentsList: [],
                taxCategoriesList: [],
                nodeData: {
                    operation: '',
                    msg: ''
                },
                upLoadFileDefaultList: [],
                values: {
                    fileList: [],
                    section: '',
                    amount: 0,
                    createName: util.cookies.get ('username')
                },
                transform: {
                    isShowDetails: false
                },
                prossValue: {
                    title: ''
                },
                supplySide: {
                    id: '',
                    name: '',
                    phone: ''
                },
                materialsHeader: [],
                processModuleId: MATERIALEQUIPMENTMANAGEMENT.ADDPURCHASECONTRACT,
                dialogVisible: false,
                popoutMaterial: false,
                visible: false,
                isReject: false,
                isSendBack: false,
                isTurnManage: false,
                contractRules: {
                    'number1': [
                        { required: true, pattern: /^([0-9]*[1-9][0-9]*\.[0-9]*[1-9][0-9]+)|([0-9]*[1-9][0-9]*)$/, message: '采购数量不合法', trigger: 'blur' }
                    ],
                    'money1': [
                        { required: true, message: '合同单价不能为空', trigger: 'blur' }
                    ]
                },
            }
        },

        methods: {

            ...mapActions('d2admin/page', [
                'close',
            ]),

            getFormByJson () {
                formGetJson ({'code': MATERIALEQUIPMENTMANAGEMENT.ADDPURCHASECONTRACT}).then(res => {
                    if (res) this.jsonData = JSON.parse(res)
                })
            },

            getPurchaseContract (id) {
                getPurchaseContractById ({'id': id}).then (res => {
                    if (res) this.getDifferentStagesData (res)
                })
            },

            savePurchaseContract () {
                let url = '', item = {}, element = {}
                item = this.typeConversion ()
                element = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && item && item.list && item.contract && element) {
                        Object.assign (this.values, item.contract, data, element)
                        this.values['materialList'] = item.list
                        if (this.values.sourceContractId == '1') this.values['ids'] = this.materialkey.substring (0, this.materialkey.length - 1)
                        if(this.$route.params.identification == '1') { 
                            this.values.relevanceProjectId = this.values.projectCode = this.selfSupportProject.projectCode
                            this.values.relevanceProject = this.selfSupportProject.projectName
                            this.values.projectType = '1'
                        }
                        this.values.id == null ? (this.$route.params.identification == '1' ? url = addSelfPurchaseContract : url = addPurchaseContract) : 
                            this.$route.params.identification == '1' ? url = editSelfPurchaseContract : url = editPurchaseContract
                        url (this.values).then (res => {
                            if (res.code === 200) {
                                this.$message.success ('保存成功')
                                this.closePageTag ()
                            }
                        })
                    }
                })
            },

            submitPurchaseContractData () {
                let url = '', item = {}, element = {}
                item = this.typeConversion ()
                element = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && item && item.list && item.contract && element) {
                        Object.assign (this.values, item.contract, data, element)
                        this.values['materialList'] = item.list
                        if (this.values.sourceContractId == '1') this.values['ids'] = this.materialkey.substring (0, this.materialkey.length - 1)
                        this.dialogVisible = true
                        this.prossValue = {
                            title: this.$route.params.title || `采购合同:【 ${data.contractName} 】`,
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.params.degree || '',
                            msg: '',
                        }
                    }
                })
            },

            updataPurchaseContract (item, boolean) {
                let url = ''
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                this.values.relevanceProjectId = this.values.projectCode = this.selfSupportProject.projectCode
                this.values.relevanceProject = this.selfSupportProject.projectName
                this.values.projectType = '1'
                boolean ? url = resetSubmitPurchaseContract : (this.$route.params.identification == '1' ? url = submitSelfPurchaseContract : url = submitPurchaseContract)
                url (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closePageTag ()
                    }
                })
            },

            consentPurchaseContract (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closePageTag ()
                    return
                }
                if (item) {
                    this.values['completeTask'] = item
                    completePurchaseContract (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success (res.message)
                            this.closePageTag ()
                        }
                    })
                }
            },

            getDetailsList (taskId) {
                getDetails (taskId).then (res => {
                    if (res) this.nodeData = res
                })
            },

            getMaterialData (item) {
                let data = {}, list = [], num = 0
                this.popoutMaterial = false
                if (item) {
                    this.materialList = this.$refs.materials.getNotVerify ()
                    item.forEach (res => {
                        res = this.updataMaterialData (res)
                        data = this.materialList.find (f => f.id == res.id)
                        if (!data) list.push (res), num += Number.parseFloat (res.money2)
                    })
                    this.materialList.push (...list)
                    this.values.amount = (Number.parseFloat (this.values.amount) + num).toFixed (2)
                }
            },

            updataAmount () {
                let num = 0, list = []
                list = this.$refs.materials.getNotVerify ()
                list.forEach (res => { num += Number.parseFloat (res.money2) })
                this.values.amount = num.toFixed (2)
            },

            getSonPurchaseTaskgetMaterialListById (id) {
                this.materialList = []
                let text = { amount: 'number1', selected: 'number2' }, num = 0
                getMaterialDepotByModuleId ({'mainId': id, ...text}).then (list => {
                    if (list && list.length > 0) {
                        list.forEach (res => {
                            res = this.updataMaterialData (res)
                            num += Number.parseFloat (res.money2)
                        })
                        this.materialList = list
                        this.values.amount = num.toFixed (2)
                    }
                })
            },

            updataMaterialData (res) {
                res['consumablesName'] = res.consumables == '1' ? '是' : '否', res['parentId'] = res.id, res['supplierId'] = ''
                res.number1 = res.number1 ? res.number1 + '' : '0', res.money1 = res.money1 + '', res.money2 = res.money2 + ''
                if (this.moduleId == '') res['materialId'] = res.id
                return res
            },

            getQueryDicByIdList () {
                let list = [ PURCHASECONTRACT.NEEDSIDE, PURCHASEORDER.UINVOICETYPE,
                    PURCHASEREQUEST.MEANSPAYMENTS, PURCHASEREQUEST.TAXCATEGORIES
                ]
                queryDicByIds (list).then (item => {
                    if (!item) return
                    this.needSideList = item[PURCHASECONTRACT.NEEDSIDE]
                    this.invoiceTypeList = item[PURCHASEORDER.UINVOICETYPE]
                    this.meansPaymentsList = item[PURCHASEREQUEST.MEANSPAYMENTS]
                    this.taxCategoriesList = item[PURCHASEREQUEST.TAXCATEGORIES]
                    this.neatenData ()
                })
            },

            getSupplierAllList () {
                getSupplierPageAllList ().then (res => {
                    if (res) this.supplySideList = res, this.neatenData ()
                })
            },

            getMaterialType () {
                materialType ().then (res => {
                    if (res) this.materialTypeList = res, this.neatenData ()
                })
            },

            selectGenerateChange (field, val, models) {
                let item = '', str = ''
                switch (field) {
                    case 'materialTypeId':
                        item = this.materialTypeList.find (f => f.id === val)
                        if (item) this.values['materialType'] = item.name
                        break
                    case 'needSideId':
                        item = this.needSideList.find (f => f.id === val)
                        if (item) this.values['needSide'] = item.name
                        break
                    case 'supplySideId':
                        this.supplySide['id'] = val
                        item = this.supplySideList.find (f => f.id === val)
                        if (item) this.values['supplySide'] = this.supplySide['name'] = item.nameSupplier, this.supplySide['phone'] = item.contactNumber
                        break
                }
            },

            getDifferentStagesData (res) {
                this.moduleId = res.taskId
                this.isShowMaterialsHeader ()
                let data = this.typeConversion (res)
                this.values = data.res
                this.materialList = JSON.parse (JSON.stringify (this.values.materialList))
                this.contract = JSON.parse (JSON.stringify (this.values))
                this.prossValue.title = `采购合同:【 ${this.values.contractName} 】`
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

            typeConversion (res) {
                this.materialkey = ''
                let contract = {}, list = [], data = {}, total = 0
                if (!res) {
                    list = this.$refs.materials.verify (), contract = this.$refs.contract.verify ()
                    if (list && contract) {
                        contract.contractAmount = Number (contract.contractAmount), contract.taxAmount = Number (contract.taxAmount), contract.taxRate = Number (contract.taxRate),
                        list.forEach (res => {
                            res.number1 = Number (res.number1), res.money1 = Number (res.money1), res.money2 = Number (res.money2)
                            this.materialkey += res.id + ','
                            res['supplierId'] = this.supplySide.id, res['supplierName'] = this.supplySide.name, res['string1'] = this.supplySide.phone
                        })
                    }
                    return data = { list, contract, total }
                } else {
                    res.contractAmount = res.contractAmount ? res.contractAmount + '' : ''
                    res.taxAmount = res.taxAmount ? res.taxAmount + '' : ''
                    res.taxRate = res.taxRate ? res.taxRate + '' : ''
                    res.materialList.forEach (f => {
                        f.number1 = f.number1 ? f.number1 + '' : '0', f.money1 = f.money1 + '', f.money2 = f.money2 + ''
                        f['consumablesName'] = f.consumables == '1' ? '是' : '否'

                    })
                    return data = { res }
                }
            },

            neatenData () {
                this.remote = {
                    getMaterialTypeId (resolve) {
                        resolve (than.materialTypeList)
                    },

                    getNeedSideId (resolve) {
                        resolve (than.needSideList)
                    },

                    getSupplySideId (resolve) {
                        resolve (than.supplySideList)
                    }
                }
            },

            upLoadFileCallBack (item) {
                this.values.fileList = item
            },

            calculateTotal (data, prop, value) {
                let list = [], num = 0
                list = this.$refs.materials.getNotVerify ()
                list.forEach (res => {
                    num += Number.parseFloat (res.money2)
                })
                this.values.amount = num.toFixed (2)
            },

            getContractAmount (money) {
                this.contractAmount = money
            },

            closePageTag () {
                let tagName = this.$route.path
                let path = ``
                this.stutas ? path = `/approval/${this.stutas}` : path = `/materialEquipmentManagement/procurementManagement/${this.$route.params.path}`
                this.close ({ tagName, path })
            },

            isShowMaterialsHeader () {
                this.materialsHeader = [
                    {
                        prop: 'code',
                        label: '材料编码',
                        isShow: true,
                        type: 'text',
                        width: 185,
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
                        prop: 'consumablesName',
                        label: '是否消耗品',
                        isShow: true,
                        type: 'text',
                        width: 200,
                        isShowDetails: true
                    },
                    {
                        prop: 'number1',
                        label: '采购数量',
                        isShow: true,
                        type: 'text',
                        required: this.moduleId != '' ? false : true,
                        width: 200,
                        isShowDetails: this.moduleId != '' ? true : false,
                        isNonnegativeNumber: true
                    },
                    {
                        prop: 'money1',
                        label: '合同单价(元)',
                        isShow: true,
                        type: 'money',
                        required: true,
                        width: 200,
                        isNonnegativeNumber: true
                    },
                    {
                        prop: 'money2',
                        label: '金额(元)',
                        isShow: true,
                        type: 'total',
                        isMoneyType: true,
                        controlRow: 'number1 * money1',
                        width: 200,
                        isShowDetails: true
                    }
                ]
            },

            updataRouter () {
                if (this.$route.params) {
                    this.transform = this.$route.params.transform || {}
                    this.stutas = this.$route.params.pathName || ''
                    this.procInstId = this.$route.params.procInstId || ''
                    this.values['relevanceProjectId'] = this.$route.params.relevanceProjectId || ''
                }
                if (this.$route.params && this.$route.params.taskId) {
                    this.getDetailsList (this.$route.params.taskId)
                }
                if (this.$route.params && this.$route.params.relevancyId) {
                    this.getPurchaseContract (this.$route.params.relevancyId)
                }
                if (this.$route.params && this.$route.params.isTaskDecomposition) {
                    this.getSonPurchaseTaskgetMaterialListById (this.$route.params.dataSource.id)
                } else {
                    this.isShowMaterialsHeader ()
                }
            }
        },

        created () {
            this.updataRouter ()
            this.getFormByJson ()
            this.getMaterialType ()
            this.getSupplierAllList ()
            this.getQueryDicByIdList ()
            if(this.$route.params.identification == '1') this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad')
        },

        computed: {
            ...mapState ('d2admin/selfSupportProject', [
                'selfSupportProject'
            ])
        },

        mounted () {
            than = this
        },

        components: {
            'bottomInformation': bottomInformation,
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent,
            'qqt-relate-table': qqtRelateTable,
            'popout-material-depot': popoutMaterialDepot,
            'purchase-contract-form': purchaseContractForm
        }
    }
</script>

<style lang='scss'>
    .add-purchase-contract {
        .el-input__inner {
            border-radius: 0px !important;
        }
        .add-purchase-contract-button {
            float: right;
            position: relative;
            top: 10px;
            background: #fff;
            width: 120px;
            text-align: right;
            z-index: 1;
        }
        .qqt-Relate-table {
            padding: 10px 0 !important
        }
        .el-input-group__append {
            border-radius: 0px !important
        }
        .color {
            color: $color-text-normal;
        }
    }
</style>
