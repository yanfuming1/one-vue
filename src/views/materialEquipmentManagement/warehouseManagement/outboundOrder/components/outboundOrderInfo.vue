<template>
    <d2-container type="fulls" class="outboundOrderInfo">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closeTag"><i class="el-icon-close"></i></el-button>
            </div>
            <div class="qqt-container-full-center___top">
                <template>
                    <el-tabs v-model="activeName" v-if="!transform.isShowDetails">
                        <el-tab-pane label="添加出库" name="first"></el-tab-pane>
                        <el-tab-pane label="出库记录" name="record"></el-tab-pane>
                    </el-tabs>
                    <div v-show="transform.isShowDetails ? this.$route.params.isShowOutboundorder == '2' : activeName == 'first'">
                        <fm-generate-form :data="jsonData" :remote="remoteFuncs" :remoteOption="remoteOption" :value="values" :transform="transform" ref="generateForm" @on-change="selectGenerateChange">
                            <template slot="warehouseName">
                                <el-form-item label="存放仓库" label-width="130px" prop="warehouseName" :rules="rules.warehouseName">
                                        <qqt-input v-model="values.warehouseName" :isShowElement="transform.isShowDetails ? false : category !== '4' ? true : false " :readonly="true" @focus="dialogVisible = true, materialId = ''"/>
                                </el-form-item>
                            </template>
                        </fm-generate-form>
                        
                        <el-divider content-position="left">
                            <div class="generate-from-divider___line"></div>
                            出库材料明细
                        </el-divider>
                        <div class="outbound-order-info-button" v-if="transform.isShowDetails ? false : category == '1' || category == '5' || category == '6' || category == '7' ? true : false ">
                            <el-button size="mini" round @click="popoutMaterial = true" >从{{ category == '1' ?  '领用' : category == '5' ? '换货' : category == '6' ? '退货' : '调拨'}}单导入</el-button>
                        </div>
                        <div class="final-inventory-info">
                            <qqt-relate-table
                                :data="values.materialList"
                                :replaceRules="rules"
                                ref="materials"
                                :isShowAdd="false"
                                :isDefaultShowRow="false"
                                :rowHeader="materialsHeader"
                                :isShowDelete="category == '1' || category == '5' || category == '6' || category == '7'"
                                :isShowDetails="transform.isShowDetails"
                                @change="getMaterialListChange"
                                @focus="getBatchNumber" />
                        </div>
                        <bottomInformation :values="values" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation"></bottomInformation>
                    </div>
                    <div v-show="transform.isShowDetails ? this.$route.params.isShowOutboundorder == '1' : activeName == 'record'">
                        <qqt-table-tree :data="tableData.records" :rowHeader="rowHeader" :isPageShow="true" :page="tableData" sonProp="materialList" :sonRowHeader="sonRowHeader" @page="handlePaginationChange" />
                    </div>
                </template>
            </div>
             <div class="operation-button">
                <el-button size="mini" type="primary" v-if="!transform.isShowDetails" @click="submissionScrapRecord">提交</el-button>
                <el-button size="mini" @click="closeTag">关闭</el-button>
            </div>
            <popout-entreport v-if="dialogVisible" :dialogVisible="dialogVisible" :warehouseId="values.warehouseId" :materialId="materialId" @close="getPopoutEntreport" :isEntrepot="true"/>
            <popout-material-depot v-if="popoutMaterial" :dialogVisible="popoutMaterial" :isOutboundOrder="isOutboundOrder" :moduleId="this.$route.params.sourceId" @close="getMaterialData" />
        </el-card>
    </d2-container>
</template>

<script>
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, qqtRelateTable, upload, qqtTableTree, qqtInput } from '../../../../../components/qqt-subassembly'
    import { outboundOrderListData, submitOutboundOrderData, outgoingRecordList, outgoingRecordQueryById } from '../../../../../api/materialEquipmentManagement/warehouseManagement/outboundOrder'
    import { getMaterialDepotByModuleId } from '../../../../../api/materialEquipmentManagement/basicInformation/materialDepot'
    import { getAllSelfProject, getAllJointProject } from '../../../../../api/jointProject/index'
    import { formGetJson } from '../../../../../api/system/fromManagement/index'
    import { getUserDepartById } from '../../../../../api/system/depart/depart'
    import { MATERIALEQUIPMENTMANAGEMENT } from '../../../../../enum/FORMCODE'
    import { getDetails } from '../../../../../api/approval/common'
    import { mapActions } from 'vuex'

    // 存放仓库
    import popoutEntreport from '../../../basicInformation/entrepot/components/popoutEntreport'
    // 材料库
    import popoutMaterialDepot from '../../../basicInformation/materialDepot/components/popoutMaterialDepot'
    import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
    import util from '@/libs/util.js'
    let than = this
    export default {
        
        data() {
            return {
                activeName: 'first',
                values:{
                    warehouseId: '',
                    warehouseName: '',
                    warehouseSite: '',
                    departmentId: '',
                    departmentName: '',
                    string2: '',
                    projectType: '',
                    sectionName: '',
                    amountString: '',
                    materialList: []
                },
                tableData: {
                    records: []
                },
                category: '',
                rowHeader: [
                    {
                        prop: 'code',
                        label: '出库单编号',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on:{
                                    click: () => {
                                        this.routerLink ('出库单详情', parms.row.id, { isShowDetails: true })
                                    }
                                }
                            }, parms.row.code)
                        }
                    },
                    {
                        prop: 'name',
                        label: '出库单名称',
                        isShow: true
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
                        label: '出库日期',
                        isShow: true,
                    }
                ],
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
                        label: '別名',
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
                page: {
                    current: 1,
                    size: 10,
                    total: 0
                },
                moduleId:'',
                jsonData: {},
                materialId: '',
                remoteFuncs: {},
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
                departmentNameArr: [],
                relevanceProject: [],
                rules: {
                    'number3': [
                        { required: true, message: '出库数量不能为空', trigger: 'change' }
                    ],
                    'string2': [
                        { required: true, message: '请选择批次号', trigger: 'change' }
                    ],
                    'warehouseName': [
                        { required: true, message: '存放仓库不能为空', trigger: 'change' }
                    ]
                },
                materialsHeader: [ ],
                transform: {
                    isShowDetails: false
                },
                dialogVisible: false,
                popoutMaterial: false,
                isOutboundOrder: false,
                isReturnGoods: false,
                isExchangeGoods: false,
                upLoadFileDefaultList: [],
                materialList: [],
                index: 0,
            };
        },
        methods: {
            getFormByJson () {
                formGetJson ({'code': MATERIALEQUIPMENTMANAGEMENT.OUTBOUNDORDERINFO}).then(res => {
                    if (res) {
                        this.jsonData = JSON.parse(res)
                    }
                })
            },

            getPopoutEntreport (item) {
                this.dialogVisible = false
                if (item) {
                    if (!this.materialId) {
                        this.values.materialList.forEach( m => {
                            m.string1 = '', m.string2 = '', m.string3 = ''
                        })
                        console.log(item)
                        console.log(this.values.materialList)
                        this.values['warehouseId'] = item.id
                        this.values.warehouseName = item.name
                        this.values.warehouseSite = item.address + item.detailedAddress
                        this.values = JSON.parse (JSON.stringify (this.values)) 
                    } else {
                        // 因为 出租、出售、 退货、 换货 没有弹框，数量不可选。点击批次号时要回显金额、供应商、和批次号的东西
                        this.values['amount'] = Number(item.price) * Number(this.materialList[this.index]['number3'])
                        this.values.amountString = this.values['amount'] + ''
                        this.materialList[this.index]['money1'] = item.price + ''

                        this.materialList[this.index]['supplierName'] = item.supplierName
                        this.materialList[this.index]['supplierId'] = item.supplierId

                        this.materialList[this.index]['string1'] = item.id
                        this.materialList[this.index]['string2'] = item.batch
                        this.materialList[this.index]['string3'] = item.parentId
                        this.values.materialList = JSON.parse (JSON.stringify (this.materialList))
                    }
                }
            },

            handlePaginationChange (page) {
                this.page = page;
                this.$nextTick(() => {
                    this.searchModelSynopsis ()
                });
            },

            // 经办人
            getresignationQueryPersonalDataID (id) {
                getUserDepartById({ 
                    userId: id
                }).then( res => {
                    if (res && res.length > 0) {
                        this.departmentNameArr = res
                        this.neatenData ()
                    }
                }).finally(res => {
                    this.getFormByJson()
                })
            },

            selectGenerateChange(id, value, model){
                this.values[id] = value;
                switch(id){
                    case 'departmentName': 
                        this.departmentNameArr.forEach(item => {
                            if(item.id === value){
                                model.departmentId = item.id ? item.id : " "
                                model.departmentName = item.name ? item.name : " "
                            }
                            this.values = model
                        })
                        break
                    case 'projectId':
                        this.values.projectId = value
                        let item = this.relevanceProject.find (f => f.id === value)
                        if (item) this.values['projectName'] = item.projectName, this.values['sectionName'] = item.section
                        break
                    case 'projectType':
                        this.values.projectId = this.values['projectName'] = this.values['sectionName'] = '', this.values.projectType = value
                        this.screenProjectTypeToProjectList (value)
                        break
                }
            },

            getOutboundOrderListData () {
                let num = 0
                outboundOrderListData({
                    'category': this.$route.params.category,
                    'sourceId': this.$route.params.sourceId,
                    'materials': true
                }).then( res => {
                    if (res.materialList !== '' && res.materialList !== null) {
                        res.materialList.forEach( m => {
                            num += m.money2, m.number3 = m.number3 ? m.number3 + '' : '0'
                            m.number2 = m.number2 ? m.number2 + '' : '0', m.number1 = m.number1 ? m.number1 + '' : '0'
                            m.money1 = m.money1 ? m.money1 + '' : '0', m.money2 = m.money2 ? m.money2 + '' : '0'
                            m.consumables = m.consumables == '1' ? '是' : '否'
                        })
                    } else {
                       res.materialList = []
                       this.getMaterialListById (res.sourceId)
                    }
                    res.amountString = num + ''
                    this.screenProjectTypeToProjectList (res.projectType)
                    Object.assign (this.values, res)
                })
            },

            getMaterialListById (id) {
                let text = {}
                switch (this.category) {
                    case '1':
                        text = {  amount: 'number1', selected: 'number4' }
                        break
                    case '5':
                    case '6':
                    case '7':
                        text = {  amount: 'number3', selected: 'number4' }
                        break
                }
                getMaterialDepotByModuleId ({'mainId': id, ...text}).then (res => {
                    if (res && res.length > 0) {
                        this.neatenMaterialList (res, true)
                    }
                })
            },

            upLoadFileCallBack (item) {
                this.values.fileList = item
            },

            // 提交
            submissionScrapRecord () { 
                let boolean = {}, element = {}
                boolean = this.$refs.materials.verify ()
                element = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && boolean && element) {
                        Object.assign (this.values, data, element)
                        this.values['materialList'] = boolean
                        submitOutboundOrderData(this.values).then( res => {
                            if (res.code === 200) {
                                this.$message.success ('提交成功')
                                this.closeTag ()
                            }
                        })
                    }
                })
            },

            closeTag () {
                let tagName = this.$route.path
                let path = this.$route.params.otherModules ? `/materialEquipmentManagement/${this.$route.params.returnRouter}` : `/materialEquipmentManagement/warehouseManagement/outboundOrder`
                this.close ({ tagName, path })
            },
            ...mapActions('d2admin/page', [
                'close' 
            ]),

            changeDataEvent (data, prop, value) {
                this.$emit ('changeDataEvent', data, prop, value)
            },

            getMaterialData (item) {
                this.popoutMaterial = false
                if (item) this.neatenMaterialList (item)
            },

            neatenMaterialList (data = [], boolean = false) {
                let item = {}, list = [], isUpdataMaterialNumber = true
                this.values['amount'] = 0,
                data.length > 0 ? this.values.materialList = this.$refs.materials.getNotVerify () : (isUpdataMaterialNumber = false, data = this.$refs.materials.getNotVerify ())
                data.forEach (m => {
                    if (isUpdataMaterialNumber) this.updataMaterialNumber (m)
                    m.money2 = m.money2 + '', m.money1 = m.money1 ? m.money1 + '' : '0'
                    m.number3 = m.number3 + '', m.parentId = m.id, m.number1 = m.number1 + '', m.number2 = m.number2 ? m.number2 + '' : '0'
                    m['consumables'] = m.consumables == '1' ? '是' : '否'
                    this.values['amount'] += Number (m.money2)
                    item = this.values.materialList.find (f => f.id == m.id)
                    if (!item) list.push (m)
                })
                !boolean ? this.values.materialList.push (...list) : (this.values.materialList = JSON.parse (JSON.stringify (data)), this.values.amountString = this.values['amount'] + '')
            },

            updataMaterialNumber (res) {
                switch (this.category) {
                    case '1':
                        res['number1'] = res.number1 ? res.number1 : 0
                        res['number2'] = res.number4 ? res.number4 : 0
                        res['number3'] = Number (res.number1) - Number (res.number2)
                        break
                    case '5':
                    case '6':
                    case '7':
                        res['number1'] = res.number3 ? res.number3 : 0
                        res['number2'] = res.number4 ? res.number4 : 0
                        res['number3'] = Number (res.number1) - Number (res.number2)
                        break
                }
            },

            getBatchNumber (data, prop, value, index, list) {
                switch (prop) {
                    case 'string2':
                        this.materialList = list, this.index = index
                        this.materialId = data.materialId
                        this.dialogVisible = true
                        break
                }
            },
  
            // 初始化数据
            getOutgoingRecordList (id, text) {
                outgoingRecordList ({
                    ...text,
                    'sourceId': this.sourceId,
                    'materials': true,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size
                }).then (res => {
                    if (res) this.tableData = res
                })
            },
            
            getAllSelfProjectList () {
                getAllSelfProject ().then (res => {
                    if (res instanceof Array) {
                        res.forEach (item => { item['id'] = item.projectCode, item['section'] = item.sectionDic })
                        this.relevanceProject = res
                        this.neatenData ()
                    }
                })
            },

            getAllJointProjectList () {
                getAllJointProject ().then (res => {
                    if (res instanceof Array) this.relevanceProject = res, this.neatenData ()
                })
            },

            getDetail (id) {
                let num = 0
                outgoingRecordQueryById({id: id}).then(res => {
                    if (res.materialList !== '' && res.materialList !== null) {
                        res.materialList.forEach( m => {
                            num += m.money2, m.number3 = m.number3 ? m.number3 + '' : '0'
                            m.number2 = m.number2 ? m.number2 + '' : '0', m.number1 = m.number1 ? m.number1 + '' : '0'
                            m.money1 = m.money1 ? m.money1 + '' : '0', m.money2 = m.money2 ? m.money2 + '' : '0'
                            m.consumables = m.consumables == '1' ? '是' : '否'
                        })
                    } else {
                       res.materialList = []
                    }
                    this.screenProjectTypeToProjectList (res.projectType)
                    this.getresignationQueryPersonalDataID (res.createBy)
                    res.amountString = num + ''
                    this.setFile(res.fileList)
                    this.values = res
                })
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
                        this.relevanceProject = []
                        this.neatenData ()
                        break
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

            routerLink (title, id = '', transform) {
                this.$router.push ({
                    path: 'outboundOrderInfoDetail',
                    name: 'outboundOrderInfoDetail',
                    params: {
                        relevancyId: id,
                        transform: transform,
                        category: this.$route.params.category,
                        isShowOutboundorder: '2'
                    }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            },

            neatenData () {
                this.remoteFuncs = {
                    getCategory (resolve) {
                        resolve ([
                            {
                                id: '1',
                                name: '领用'
                            },
                            {
                                id: '2',
                                name: '出租'
                            },
                            {
                                id: '3',
                                name: '出售'
                            },
                            {
                                id: '4',
                                name: '报废'
                            },
                            {
                                id: '5',
                                name: '换货'
                            },
                            {
                                id: '6',
                                name: '退货'
                            },
                            {
                                id: '7',
                                name: '调拨'
                            }
                        ])
                    },
                    getDepartmentName (resolve) {
                        resolve(than.departmentNameArr) 
                    },
                    getProjectName (resolve) {
                        resolve (than.relevanceProject)
                    },
                }
            },

            getMaterialListChange (data, prop, value) {
                switch (prop) {
                    case 'number3':
                        this.neatenMaterialList ([], true)
                        break
                }
            },

            initLoadData () {
                this.category = this.$route.params.category
                this.updataState ()
                this.isShwoHeaderList ()
                this.transform = this.$route.params.transform
                this.sourceId = this.moduleId = this.$route.params.sourceId
                this.getOutgoingRecordList ()
                if (this.$route.params && this.$route.params.relevancyId) {
                    // 查询详情
                    this.getDetail(this.$route.params.relevancyId)
                } else {
                    this.getOutboundOrderListData ()
                    this.getresignationQueryPersonalDataID (util.cookies.get ('uuid'))
                }
            },

            updataState () {
                switch (this.category) {
                    case '5':
                    case '7':
                        this.isReturnGoods = true
                        break
                    case '6':
                        this.isExchangeGoods = true
                        break
                    default:
                        this.isOutboundOrder = true
                        break
                }
            },

            isShwoHeaderList () {
                this.materialsHeader = [
                    {
                        prop: 'code',
                        label: '材料编码',
                        isShow: true,
                        type: 'text',
                        width: 180,
                        isShowDetails: true
                    },
                    {
                        prop: 'name',
                        label: '名称',
                        isShow: true,
                        type: 'text',
                        width: 180,
                        isShowDetails: true
                    },
                    {
                        prop: 'brandName',
                        label: '品牌',
                        isShow: true,
                        type: 'text',
                        width: 180,
                        isShowDetails: true
                    },
                    {
                        prop: 'specificationName',
                        label: '规格型号',
                        isShow: true,
                        type: 'text',
                        width: 180,
                        isShowDetails: true
                    },
                    {
                        prop: 'unit',
                        label: '计量单位',
                        isShow: true,
                        type: 'text',
                        width: 100,
                        isShowDetails: true
                    },
                    {
                        prop: 'string2',
                        label: '批次号',
                        isShow: true,
                        type: 'text',
                        width: 180,
                        readonly: true,
                        required: true,
                        // isShowDetails: this.category == '4' ? true : false
                    },
                    {
                        prop: 'supplierName',
                        label: '供应商',
                        isShow: true,
                        type: 'text',
                        width: 180,
                        isShowDetails: true
                    },
                    {
                        prop: 'number1',
                        label: '订单数量',
                        isShow: true,
                        type: 'text',
                        width: 120,
                        isShowDetails: true,
                        isNonnegativeNumber: true
                    },
                    {
                        prop: 'number3',
                        label: '本次出库数量',
                        isShow: true,
                        type: 'text',
                        width: 120,
                        required: true,
                        msg: '本次入库数量不能大于订单数量减去累计入库数量',
                        notGreaterThan: 'number1 - number2',
                        isNonnegativeNumber: true
                    },
                    {
                        prop: 'number2',
                        label: '累计出库数量',
                        isShow: true,
                        type: 'text',
                        width: 120,
                        isShowDetails: true,
                        isNonnegativeNumber: true
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
                        width: 180,
                        type: 'money',
                        btnTitle: '元',
                        isShowDetails: true
                    },
                    {
                        prop: 'money2',
                        label: '总价',
                        isShow: true,
                        width: 180,
                        type: 'total',
                        controlRow: 'number3 * money1',
                        isMoneyType: true,
                        btnTitle: '元',
                        isShowDetails: true
                    },
                    {
                        prop: 'consumables',
                        label: '是否消耗品',
                        isShow: true,
                        width: 100,
                        type: 'text',
                        isShowDetails: true
                    },
                    {
                        prop: 'remark',
                        label: '备注',
                        isShow: true,
                        width: 180,
                        type: 'text'
                    }
                ]
            }
        },

        created() {
            this.initLoadData ()
        },

        mounted () {
            than = this
        },

        watch: {
            $route (val) {
                if (val.path.indexOf('outboundOrderInfo') !== -1 || val.path.indexOf ('outboundOrderInfoDetail') !== -1) {
                    this.initLoadData ()
                }
            }
        },

        components: {
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent,
            'qqt-relate-table': qqtRelateTable,
            'bottomInformation': bottomInformation,
            'qqt-input': qqtInput,
            'popout-entreport': popoutEntreport,
            'popout-material-depot': popoutMaterialDepot,
            'qqt-table-tree': qqtTableTree
        },
    };
</script>
                                                  
<style lang='scss'>
    .outboundOrderInfo {
        .scrap-record-info{
            background: #ffffff
        }
        .operation-button{
            margin: 0 auto;
            text-align: center;
            margin-top: 12px
        }
        .outbound-order-info-button {
            float: right;
            top: -40px;
            background: #fff;
            width: 125px;
            position: relative;
            text-align: right;
        }
        .el-row--flex {
            height: 58px !important;
        }
    }
</style>