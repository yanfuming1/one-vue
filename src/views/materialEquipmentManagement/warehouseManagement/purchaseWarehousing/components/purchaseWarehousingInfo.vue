<template>
    <d2-container class="purchase-warehousing-info">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
            </div>
            <div class="purchase-warehousing-info-tabs" v-if="$route.params.isOrder">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="采购订单" name="first"></el-tab-pane>
                    <el-tab-pane label="采购入库" v-if="!transform.isShowDetails" name="third"></el-tab-pane>
                    <el-tab-pane label="入库记录" name="second">
                        <qqt-table-tree :data="tableData.records" :rowHeader="rowHeader" :isPageShow="true" :page="tableData" sonProp="materialList" :sonRowHeader="sonRowHeader" @page="handlePaginationChange" />
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div class="purchase-warehousing-info-basic" v-show="activeName == 'third' || !$route.params.isOrder">
                <el-divider content-position="left" v-if="!$route.params.isOrder">
                    <div class="generate-from-divider___line"></div>
                    基础信息
                </el-divider>
                <fm-generate-form :data="jsonData" :remote="remote" :remoteOption="remoteOption" :transform="transform" :value="values" ref="generateForm" @on-change="selectGenerateChange" @btn-click="btnClick">
                    <template slot="category">
                        <el-form-item label="入库来源" prop="category" :rules="rules.category" label-width="150px">
                            <qqt-select :value="values.category" :filterable="true" :isShowElement="!transform.isShowDetails && values.category != '1'" :defaultProp="defaultProp" :options="categoryOptions" @select="getFieldName($event, 1)" />
                        </el-form-item>
                    </template>
                    <template slot="returnId">
                        <el-form-item label="采购经办人" v-if="values.category == '1'" label-width="150px">
                            <qqt-input v-model="values.returnName" :isShowElement="false" />
                        </el-form-item>
                        <el-form-item
                            :label="values.category == '2' ? '领用归还经办人' : values.category == '3'
                                ? '出租归还经办人' : values.category == '4' 
                                    ? '换货经办人' : values.category == '5' 
                                        ? '其他经办人' : values.category == '6'
                                            ? '调拨经办人' : ''"
                            :prop="values.category != '5' ? 'returnId' : ''"
                            :rules="isRequired ? rules.returnId : {}"
                            v-if="values.category != '1'"
                            label-width="150px"
                        >
                            <qqt-select v-if="!transform.isShowDetails" :value="values.returnId" :filterable="true" :isShowElement="values.category == '5' ? false : !transform.isShowDetails" :defaultProp="defaultProps" :options="returnOptions" @select="getFieldName($event, 6)" />
                            <qqt-input v-if="transform.isShowDetails" v-model="values.returnName" :isShowElement="false" />
                        </el-form-item>
                    </template>
                    <template slot="sourceId">
                        <el-form-item label="采购订单名称" v-if="$route.params.isOrder" label-width="150px">
                            <qqt-input v-model="values.sourceName" :isShowElement="false" />
                        </el-form-item>
                        <el-form-item label="关联单据名称" prop="sourceId" :rules="isRequired ? rules.sourceId : {}" v-if="!$route.params.isOrder" label-width="150px">
                            <qqt-select v-if="!transform.isShowDetails" :value="values.sourceId" :filterable="true" :isShowElement="values.category == '5' ? false : !transform.isShowDetails" :defaultProp="defaultProp" :options="sourceOptions" @select="getFieldName($event, 2)" />
                            <qqt-input v-if="transform.isShowDetails" v-model="values.sourceName" :isShowElement="false" />
                        </el-form-item>
                    </template>
                    <template slot="sourceCode">
                        <el-form-item :label="$route.params.isOrder ? '采购订单编号' : '关联单据编号'" label-width="150px">
                            <qqt-input v-model="values.sourceCode" :isShowElement="false" />
                        </el-form-item>
                    </template>
                </fm-generate-form>
                <div class="purchase-warehousing-info-button" v-if="!transform.isShowDetails" v-show="(values.category == '2'  || $route.params.isOrder || values.category == '6') && values.sourceId !== '' || values.category == '5' ">
                    <el-button size="mini" round @click="popoutMaterial = true">{{ $route.params.isOrder ? '从采购订单导入' : values.category == '2' ? '从领用归还导入' : values.category == '5' ? '从材料库导入' : values.category == '6' ? '从库存调拨导入' : '' }}</el-button>
                </div>
                <el-divider content-position="left">
                    <div class="generate-from-divider___line"></div>
                    采购入库材料明细
                </el-divider>
                <qqt-relate-table :data="materialList" ref="materials" :replaceRules="relateRules" @select="selectChange" :isShowAdd="false" :isDefaultShowRow="false" :isShowDelete="isShowDelete" :rowHeader="materialsHeader" :isShowDetails="transform.isShowDetails" />
                <bottom-information v-if="activeName == 'third'" :values="values" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation" />
            </div>
            <basis-purchase-order v-if="$route.params.isOrder && activeName == 'first'" :relevancyId="$route.params.relevancyId" :isWarehouseOrder="true" />
            <div class="drawer-btn">
                <el-button type="primary" size="mini" v-if="!transform.isShowDetails && activeName == 'third'" @click="onSave">提交</el-button>
                <el-button size="mini" @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <popout-entreport v-if="dialogVisible" :dialogVisible="dialogVisible" @close="getPopoutEntreport" :isEntrepot="true"/>
        <popout-material-depot v-if="popoutMaterial" :dialogVisible="popoutMaterial" :moduleId="moduleId" :isOrder="$route.params.isOrder" :isRecipientsReturn="isRecipientsReturn" :isOther="isOther" @close="getMaterialData" />
    </d2-container>
</template>

<script>
    import { submitWarehousing, searchPurchaseWarehousingList,
             purchaseStorageTypeOtherWarehouses, getPurchaseWarehousingById } from '../../../../../api/materialEquipmentManagement/warehouseManagement/purchaseWarehousing'
    import { getPurchaseOrderFinishedAllList, getPurchaseOrderById } from '../../../../../api/materialEquipmentManagement/procurementManagement/purchaseOrder'
    import { getMaterialDepotByModuleId } from '../../../../../api/materialEquipmentManagement/basicInformation/materialDepot'
    import { getSupplierPageAllList } from '../../../../../api/materialEquipmentManagement/supplierManagement/supplierList'
    import { upload, qqtRelateTable, qqtSelect, qqtTableTree, qqtInput } from '../../../../../components/qqt-subassembly'
    import { getAllSelfProject, getAllJointProject } from '../../../../../api/jointProject/index'
    import { PURCHASEREQUEST, PURCHASEORDER } from '../../../../../enum/DICTIONARY'
    import { formGetJson } from '../../../../../api/system/fromManagement/index'
    import { MATERIALEQUIPMENTMANAGEMENT } from '../../../../../enum/FORMCODE'
    import { mapActions } from 'vuex'

    import popoutEntreport from '../../../basicInformation/entrepot/components/popoutEntreport'
    import popoutMaterialDepot from '../../../basicInformation/materialDepot/components/popoutMaterialDepot'
    import basisPurchaseOrder from '../../../procurementManagement/purchaseOrder/components/basisPurchaseOrder'
    import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
    import util from '@/libs/util.js'
    let than = this
    export default {

        data () {
            return {
                page: {
                    current: 1,
                    size: 10,
                    total: 0
                },
                remote: {},
                values: {
                    fileList: [],
                    indentName: '',
                    sourceCode: '',
                    sectionName: '',
                    indentNumber: '',
                    warehouseName: '',
                    warehouseSite: '',
                    category: '1',
                    sourceId: '',
                    returnId: '',
                    returnName: '',
                    sourceCode: '',
                    sourceName: '',
                    projectType: ''
                },
                moduleId: '',
                jsonData: {},
                tableData: {
                    records: []
                },
                orderList: [],
                filterText: '',
                isOther: false,
                materialkey: '',
                sectionList: [],
                supplierList: [],
                materialList: [],
                sonTableData: [],
                sourceOptions: [],
                returnOptions: [],
                isRequired: true,
                activeName: 'third',
                isShowDelete: false,
                dialogVisible: false,
                popoutMaterial: false,
                relatedProjectsList: [],
                isRecipientsReturn: false,
                upLoadFileDefaultList: [],
                projectTypeOptions: [],
                remoteOption: {
                    projectTypeOptions: [
                        {
                            value: '1',
                            label: '自营'
                        },
                        {
                            value: '2',
                            label: '联营'
                        }
                    ]
                },
                transform: {
                    isShowDetails: false
                },
                defaultProp: {
                    value: 'sourceId',
                    label: 'sourceName'
                },
                defaultProps: {
                    value: 'returnId',
                    label: 'returnName'
                },
                categoryOptions: [
                    {
                        sourceId: '1',
                        sourceName: '采购入库'
                    },
                    {
                        sourceId: '2',
                        sourceName: '领用归还'
                    },
                    {
                        sourceId: '3',
                        sourceName: '出租归还'
                    },
                    {
                        sourceId: '4',
                        sourceName: '换货入库'
                    },
                    {
                        sourceId: '5',
                        sourceName: '其它入库'
                    },
                    {
                        sourceId: '6',
                        sourceName: '调拨入库'
                    }
                ],

                materialsHeader: [],
                sonRowHeader: [
                    {
                        prop: 'code',
                        label: '材料编码',
                        isShow: true
                    },
                    {
                        prop: 'name',
                        label: '名称',
                        isShow: true
                    },
                    {
                        prop: 'alias',
                        label: '别名',
                        isShow: true
                    },
                    {
                        prop: 'number3',
                        label: '数量',
                        isShow: true
                    },
                    {
                        prop: 'brandName',
                        label: '品牌',
                        isShow: true
                    },
                    {
                        prop: 'specificationName',
                        label: '规格型号',
                        isShow: true
                    },
                    {
                        prop: 'unit',
                        label: '计量单位',
                        isShow: true
                    },
                ],
                rowHeader: [
                    {
                        prop: 'code',
                        label: '入库单编号',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on:{
                                    click: () => {
                                        this.routerLink ('入库单详情', parms.row.id, { isShowDetails: true })
                                    }
                                }
                            }, parms.row.code)
                        }
                    },
                    {
                        prop: 'name',
                        label: '入库单名称',
                        isShow: true,
                    },
                    {
                        prop: 'sourceCode',
                        label: '采购订单编号',
                        isShow: true,
                    },
                    {
                        prop: 'createName',
                        label: '经办人',
                        isShow: true,
                    },
                    {
                        prop: 'departmentName',
                        label: '经办部门',
                        isShow: true,
                    },
                    {
                        prop: 'storageTime',
                        label: '入库日期',
                        isShow: true,
                    }
                ],
                relateRules: {
                    number3: [
                        { required: true, pattern: /^([0-9]*[1-9][0-9]*\.[0-9]*[0-9][0-9]+)|([0-9]*[1-9][0-9]*)$/, message: '数据不合法', trigger: 'blur' }
                    ],
                    supplierId: [
                        { required: true, message: `供应商不能为空`, trigger: 'change' }
                    ]
                },
                rules: {
                    category: [
                        { required: true, message: '入库来源不能为空', trigger: 'change' }
                    ],
                    sourceId: [
                        { required: true, message: `${this.$route.params.isOrder ? '采购订单名称' : '相关名称'}不能为空`, trigger: 'change' }
                    ],
                    returnId: [
                        { required: true, message: `${this.$route.params.isOrder ? '采购经办人' : '必填字段'}不能为空`, trigger: 'change' }
                    ]
                }
            }
        },

        methods: {

            ...mapActions('d2admin/page', [
                'close',
            ]),

            closePageTag () {
                let tagName = this.$route.path
                let path = this.$route.params.otherModules ? `/materialEquipmentManagement/${this.$route.params.returnRouter}` : `/materialEquipmentManagement/warehouseManagement/${this.$route.params.returnRouter}`
                this.close ({ tagName, path })
            },

            getFormByJson () {
                formGetJson ({'code': MATERIALEQUIPMENTMANAGEMENT.PURCHASEWAREHOUSINGINFO}).then(res => {
                    if (res) this.jsonData = JSON.parse(res)
                })
            },

            upLoadFileCallBack (item) {
                this.values.fileList = item
            },

            selectGenerateChange (field, val, model) {
                let item = '', str = ''
                switch (field) {
                    case 'projectId':
                        this.values.projectId = val
                        item = this.relatedProjectsList.find (f => f.id === val)
                        if (item) this.values['projectName'] = item.projectName, this.values['sectionName'] = item.section
                        break
                    case 'projectType':
                        console.log(this.values)
                        // if (!this.transform.isShowDetails) this.values.projectId = this.values.projectName = this.values.sectionName = ''
                        this.values.projectType = val
                        this.screenProjectTypeToProjectList (val)
                        break
                }
            },

            screenProjectTypeToProjectList (type) {
                switch (type) {
                    case '1':
                        this.getAllSelfProjectList ()
                        break
                    case '2':
                        this.getAllJointProjectList ()
                        break
                    default:
                        this.relatedProjectsList = []
                        this.neatenData ()
                        break
                }
            },

            onSave () {
                let data = '', url = '', info =  {}
                info = this.$refs.bottomInformation.getData ()
                data = this.typeConversion ()
                this.$refs.generateForm.getData ().then(item => {
                    if (item && data && info){
                        Object.assign (this.values, item, info)
                        this.values['materialList'] = data
                        submitWarehousing (this.values).then(res => {
                            if (res.code === 200) {
                                this.$message.success ('操作成功')
                                this.closePageTag ()
                            }
                        })
                    }
                })
            },

            //  采购订单 - 获取已完结的列表
            getPurchaseOrderList () {
                getPurchaseOrderFinishedAllList ().then (res => {
                    if (res && res.length > 0) this.orderList = res, this.neatenData ()
                })
            },

            // 采购订单
            getSonPurchaseOrderById (id) {
                getPurchaseOrderById ({'id': id}).then (res => {
                    if (res) {
                        let item = {}, data = {}
                        item = this.typeConversion (res)
                        const { indentName: sourceName , indentNumber: sourceCode, id: sourceId, relevanceProjectId: projectId, relevanceProject: projectName, 
                                section: sectionName, projectType, createName: returnName, createBy: returnId} = item
                        data = { sourceName, sourceCode, sourceId, sectionName, projectType, projectName, projectId, returnName, returnId }
                        this.moduleId = sourceId
                        Object.assign (this.values, data)
                        console.log(this.values, 'this.values', data, 'data')
                        this.getMaterialListById (id)
                    }
                })
            },

            // 入库单详情
            getPurchaseWarehousingDetails (id) {
                let data = {}
                getPurchaseWarehousingById ({'id': id}).then (res => {
                    if (res) {
                        this.values.category = res.category
                        data = this.typeConversion (res)
                        this.materialList = data.materialList
                        data['amountString'] = data.amount + ''
                        this.values = data
                        this.fileDefaultNeaten (data)
                    }
                })
            },

            fileDefaultNeaten (res) {
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
            
            // 获取相关单号和名称信息
            getPurchaseStorageTypeOtherWarehouses (category, state, returnId) {
                let con = {}
                // 1： 根据入库单来源获取经办人； 6： 根据经办人获取关联单据
                switch (state) {
                    case 1:
                        con = { 'category': category, returnUniq:true }
                        break
                    case 6:
                        con = { 'category': category, 'returnId': returnId }
                        break
                }
                purchaseStorageTypeOtherWarehouses (con).then ( res => {
                    if (res) {
                        switch (state) {
                            case 1:
                                this.returnOptions = res
                                break
                            case 6:
                                this.sourceOptions = res
                                break
                        }
                    }
                })
            },

            getSearchPurchaseWarehousingList (id, text) {
                searchPurchaseWarehousingList ({
                    ...text,
                    'sourceId': id,
                    'materials': true,
                    'procurement': true,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size
                }).then (res => {
                    if (res) this.tableData = res
                })
            },

            // 查询供应商
            getSupplierAllList () {
                getSupplierPageAllList ().then (res => {
                    if (res) this.supplierList = res, this.isShowMaterialsHeader ()
                })
            },

            // 项目类型（自营）
            getAllSelfProjectList () {
                getAllSelfProject ().then (res => {
                    if (res instanceof Array) {
                        res.forEach (item => { item['id'] = item.projectCode, item['section'] = item.sectionDic })
                        this.relatedProjectsList = res
                        this.neatenData ()
                    }
                })
            },

            // 项目类型（联营）
            getAllJointProjectList () {
                getAllJointProject ().then (res => {
                    if (res instanceof Array) this.relatedProjectsList = res, this.neatenData ()
                })
            },

            btnClick (value, field) {
                field == 'warehouseName' ? this.dialogVisible = true : this.dialogVisible = false
            },

            typeConversion (res) {
                this.materialkey = '', this.values['amount'] = 0
                let contract = {}, list = [], data = {}
                if (!res) {
                    list = this.$refs.materials.verify ()
                    if (list && list.length > 0) {
                        list.forEach (item => {
                            this.values['amount'] += Number (item.money2), item['number3'] ? item['number3'] = Number (item.number3) : ''
                            item.money2 ? item.money2 = Number (item.money2) : '', item.money1 ? item.money1 = Number (item.money1) : ''
                            item.number1 ? item.number1 = Number (item.number1) : '', item.number2 ? item.number2 = Number (item.number2) : ''
                        })
                    }
                    return list
                } else {
                    if (res.amount) res.amount = res.amount + ''
                    res.materialList = this.updataMaterialList (res.materialList)
                    return res
                }
            },

            getFieldName (value, state, num) {
                let item = {}, data = {}
                switch (state) {
                    case 1:
                        this.values.category = value, this.values.sourceId = this.values.returnId = this.values.sourceCode = this.moduleId = ''
                        this.getPurchaseStorageTypeOtherWarehouses (value, 1)
                        this.isShowMaterialsHeader (), this.materialList = []
                        value == '5' ? (this.isRequired = false, this.sourceOptions = []) : this.isRequired = true
                        value == '2' ? this.isRecipientsReturn = true : this.isRecipientsReturn = false
                        if (value == '6' || value == '5' || value == '2' ) this.isShowDelete = true
                        break
                    case 2:
                        this.values.sourceId = value
                        this.values.category == '2' ? this.moduleId = value : ''
                        item = this.sourceOptions.find (f => f.sourceId === value)
                        if (item) {
                            data = this.typeConversion (item)
                            const { sourceName, sourceCode, sectionName, projectType, projectName, projectId, warehouseId, warehouseName, warehouseSite } = data
                            let element = null
                            if (warehouseId) {
                                element = { sourceName, sourceCode, sectionName, projectType, projectName, projectId, warehouseId, warehouseName, warehouseSite }
                            } else {
                                element = { sourceName, sourceCode, sectionName, projectType, projectName, projectId }
                            }
                                this.values.category == '3' ?  this.materialList = item.materialList : (item.materialList = [], this.getMaterialListById (value))
                            Object.assign (this.values, element)
                        }
                        break
                    case 6:
                        this.values.returnId = value, this.values.sourceId = ''
                        item = this.returnOptions.find (f => f.returnId === value)
                        if (item) this.values.returnName = item.returnName, this.getPurchaseStorageTypeOtherWarehouses (this.values.category, 6, item.returnId)
                        break
                }
            },

            getMaterialListById (id) {
                this.materialList = []
                let text = {}
                switch (this.values.category) {
                    case '1':
                        text = {  amount: 'number1', selected: 'number2' }
                        break
                    default:
                        text = {  amount: 'number4', selected: 'number5' }
                        break
                }
                getMaterialDepotByModuleId ({'mainId': id, ...text}).then (res => {
                    if (res && res.length > 0) {
                        this.materialList = this.updataMaterialList (res, true)
                    }
                })
            },

            // 仓库
            getPopoutEntreport (item) {
                this.dialogVisible = false
                if (item) {
                    this.values['warehouseId'] = item.id
                    this.values.warehouseName = item.name
                    this.values.warehouseSite = item.address + item.detailedAddress
                }
            },

            // 材料库
            getMaterialData (item) {
                this.popoutMaterial = false
                if (item) this.materialList = this.updataMaterialList (item, true)
            },
            
            updataMaterialList (materialList, boolean = false) {
                if (materialList) {
                    materialList.forEach (item => { 
                        item = this.updataMaterialNumber (item)
                        item.money2 ? item.money2 = item.money2 + '' : item.money2 = '0'
                        item.money1 ? item.money1 = item.money1 + '' : item.money1 = '0'
                        item.number1 ? item.number1 = item.number1 + '' : item.number1 = '0'
                        item.number3 ? item.number3 = item.number3 + '' : item.number3 = '0'
                        item.number2 ? item.number2 = item.number2 + '' : item.number2 = '0'
                        item['consumablesName'] = item.consumables == '1' ? '是' : '否'
                        item.supplierId ? '' : item.supplierId = ''
                        item.intact ? '' : item.intact = ''
                        if (this.values.category == '1') item.intact = '10'
                        if (this.values.category == '5') item.materialId = item.id
                        if (boolean) item['parentId'] = item.id
                    })
                    return materialList
                }
                
            },

            updataMaterialNumber (res) {
                switch (this.values.category) {
                    case '1':
                    case '3':
                        res['number3'] = Number (res.number1) - Number (res.number2)
                        break
                    case '2':
                    case '4':
                    case '6':
                        res['number1'] = res.number4 ? res.number4 : 0
                        res['number2'] = res.number5 ? res.number5 : 0
                        res['number3'] = Number (res.number1) - Number (res.number2)
                        break
                }
                return res 
            },

            selectChange (data, prop, value) {
                let item = this.supplierList.find (f => f.id === value)
                if (item) data.string1 = item.contactNumber, data['supplierName'] = item.nameSupplier
            },

            handlePaginationChange (page) {
                this.page = page;
                this.$nextTick(() => {
                    this.searchModelSynopsis ()
                });
            },

            searchModelSynopsis() {
                this.getSearchPurchaseWarehousingList (this.moduleId, {
                    'keywords': this.filterText ? this.filterText : null})
            },

            neatenData () {
                this.remote = {
                    getIndentId (resolve) {
                        resolve (than.orderList)
                    },

                    getRelevanceProjectId (resolve) {
                        resolve (than.relatedProjectsList)
                    }
                }
            },

            routerLink (title, id = '', transform) {
                this.$router.push ({
                    path: 'warehouseWarrantInfo',
                    name: 'warehouseWarrantInfo',
                    params: {
                        relevancyId: id,
                        transform: transform,
                        returnRouter: 'purchaseWarehousing',
                        isOrder: false
                    }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            },

            initLoadData () {
                this.getFormByJson ()
                this.getSupplierAllList ()
                this.transform = this.$route.params.transform
                if (this.transform.isShowDetails) this.activeName = 'second', !this.$route.params.isOrder ? this.getPurchaseWarehousingDetails (this.$route.params.relevancyId) : ''
                !this.$route.params.isOrder ? !this.transform.isShowDetails ? (this.categoryOptions.splice (0, 1), this.getFieldName ('2', 1)) : this.activeName = 'third' : this.getSonPurchaseOrderById (this.$route.params.relevancyId), 
                    this.getPurchaseOrderList (), this.getSearchPurchaseWarehousingList (this.$route.params.relevancyId), this.moduleId = this.$route.params.relevancyId, this.isShowDelete = true
            },

            isShowMaterialsHeader () {
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
                        prop: 'number1',
                        label: '订单数量',
                        isShow: this.values.category != '5' ? true : false,
                        type: 'text',
                        width: 200,
                        isShowDetails: true,
                    },
                    {
                        prop: 'supplierName',
                        label: '供应商',
                        isShow: this.values.category == '5' || this.values.category == '6' ? false : true,
                        type: 'text',
                        width: 200,
                        isShowDetails: true
                    },
                    {
                        prop: 'supplierId',
                        label: '供应商',
                        isShow: this.values.category == '5' || this.values.category == '6' ? true : false,
                        type: 'select',
                        options: this.supplierList,
                        width: 200,
                        defaultProp: {
                            value: 'id',
                            label: 'nameSupplier'
                        },
                        required: this.values.category == '5' ? false : true
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
                        prop: 'number3',
                        label: '本次入库数量',
                        isShow: true,
                        type: 'text',
                        required: true,
                        width: 200,
                        msg: '本次入库数量不能大于订单数量减去累计入库数量',
                        notGreaterThan: this.values.category != '5' ? 'number1 - number2' : false,
                        isNonnegativeNumber: true
                    },
                    {
                        prop: 'number2',
                        label: '累计入库数量',
                        isShow: this.values.category != '5' ? true : false,
                        type: 'text',
                        width: 200,
                        isShowDetails: true,
                    },
                    {
                        prop: 'intact',
                        label: '完好度',
                        isShow: true,
                        type: 'select',
                        width: 200,
                        defaultProp: {
                            value: 'value',
                            label: 'label'
                        },
                        required: true,
                        options: [
                            {
                                value: '1',
                                label: '一成新'
                            },
                            {
                                value: '2',
                                label: '二成新'
                            },
                            {
                                value: '3',
                                label: '三成新'
                            },
                            {
                                value: '4',
                                label: '四成新'
                            },
                            {
                                value: '5',
                                label: '五成新'
                            },
                            {
                                value: '6',
                                label: '六成新'
                            },
                            {
                                value: '7',
                                label: '七成新'
                            },
                            {
                                value: '8',
                                label: '八成新'
                            },
                            {
                                value: '9',
                                label: '九成新'
                            },
                            {
                                value: '10',
                                label: '十成新'
                            }
                        ]
                    },
                    {
                        prop: 'money1',
                        label: '单价',
                        isShow: true,
                        type: 'money',
                        btnTitle: '元',
                        width: 200,
                        isShowDetails: this.values.category == '5' ? false : true,
                        isNonnegativeNumber: this.values.category == '5' ? false : true
                    },
                    {
                        prop: 'money2',
                        label: '总价',
                        isShow: true,
                        type: 'total',
                        btnTitle: '元',
                        controlRow: 'number3 * money1',
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
                        prop: 'remark',
                        label: '备注',
                        isShow: true,
                        type: 'text',
                        width: 200,
                        isShowDetails: true
                    }
                ]
            }
        },

        created () {
            this.initLoadData ()
        },

        mounted () {
            than = this
        },

        components: {
            'up-load': upload,
            'qqt-input': qqtInput,
            'qqt-select': qqtSelect,
            'qqt-table-tree': qqtTableTree,
            'qqt-relate-table': qqtRelateTable,
            'popout-entreport': popoutEntreport,
            'basis-purchase-order': basisPurchaseOrder,
            'popout-material-depot': popoutMaterialDepot,
            'bottom-information': bottomInformation
        },

        watch: {
            $route (val) {
                if (val.path.indexOf('warehouseWarrantInfo') !== -1 || val.path.indexOf ('addPurchaseWarehousingPage') !== -1) {
                    this.initLoadData ()
                }
            }
        }
    }
</script>

<style lang='scss'>
    .purchase-warehousing-info {
        .drawer-btn{
            padding-top: 10px;
            text-align: center;
        }
        .el-input__inner {
            border-radius: 0px !important;
        }
        .purchase-warehousing-info-basic {
            padding: 0 20px;
            .purchase-warehousing-info-button {
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
        }
        .purchase-warehousing-info-tabs {
            .el-tabs__header {
                margin: 0 0 25px !important
            }
            .el-tabs__content {
                padding: 0 20px !important
            }
            .el-tabs__nav {
                left: 40px;
            }
        }
        .el-card__body {
            padding: 42px 0px !important
        }
        
        .el-col-8 {
            height: 58px !important;
        }
    }
</style>
