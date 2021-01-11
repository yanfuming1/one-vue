<template>
    <d2-container type="fulls">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closeTag"><i class="el-icon-close"></i></el-button>
            </div>
            <div class="qqt-container-full-center___top">
                <template>
                    <el-tabs v-model="activeName">
                        <el-tab-pane label="出库详情" name="first">
                            <template> 
                                <fm-generate-form :data="jsonData" :remote="remoteFuncs" :value="values" :transform="transform" ref="generateForm" @on-change="selectGenerateChange">
                                    <template slot="warehouseName">
                                        <div class="warehouse">
                                            <el-form-item label="存放仓库" label-width="130px" prop="warehouseName" :rules="rules.warehouseName">
                                                <qqt-input v-model="values.warehouseName" :isShowElement="!transform.isShowDetails" :readonly="true" @focus="dialogVisible = true, materialId = ''"/>
                                            </el-form-item>
                                        </div>
                                    </template>
                                </fm-generate-form>
                                
                                <el-divider content-position="left">
                                    <div class="generate-from-divider___line"></div>
                                    出库材料明细
                                </el-divider>
                                <!-- <div class="outbound-order-info-button" v-if="category == '1' || category == '5' || category == '6' ? true : false "> -->
                                <div class="outbound-order-info-button" v-if="!transform.isShowDetails">
                                    <el-button size="mini" round @click="popoutMaterial = true" >从出库单导入</el-button>
                                </div>
                                <div class="final-inventory-info">
                                    <qqt-relate-table
                                        :data="values.materialList"
                                        :replaceRules="rules"
                                        ref="materials"
                                        :isShowAdd="false"
                                        :isDefaultShowRow="false"
                                        :rowHeader="materialsHeader"
                                        :isShowDetails="transform.isShowDetails"
                                        @change="getMaterialListChange"
                                        @focus="getBatchNumber" />
                                </div>
                                <div class="lock-inventory-information___upload">
                                    <div class="lock-inventory-information___label">上传附件:</div>
                                    <div class="lock-inventory-information___right">
                                        <up-load id="male" @upLoadFileCallBack="upLoadFileCallBack" :isShowUpload="!transform.isShowDetails" :propList="upLoadFileDefaultList" ref="upLoad" />
                                    </div>
                                </div>
                            </template>
                        </el-tab-pane>
                        <el-tab-pane label="出库记录" name="record"> 
                            <qqt-table-tree :data="tableData.records" :rowHeader="rowHeader" :isPageShow="true" :page="tableData" sonProp="materialList" :sonRowHeader="sonRowHeader" @page="handlePaginationChange" />
                        </el-tab-pane>
                    </el-tabs>
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
    import { formGetJson } from '../../../../../api/system/fromManagement/index'
    import { MATERIALEQUIPMENTMANAGEMENT } from '../../../../../enum/FORMCODE'
    import { mapActions } from 'vuex'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, qqtRelateTable, upload, qqtTableTree, qqtInput } from '../../../../../components/qqt-subassembly'
    import { getDetails } from '../../../../../api/approval/common'
    import { outboundOrderListData, submitOutboundOrderData, outgoingRecordList, outgoingRecordQueryById } from '../../../../../api/materialEquipmentManagement/warehouseManagement/outboundOrder'
    import util from '@/libs/util.js'
    import { getUserDepartById } from '../../../../../api/system/depart/depart'


    import popoutEntreport from '../../../basicInformation/entrepot/components/popoutEntreport'
    import popoutMaterialDepot from '../../../basicInformation/materialDepot/components/popoutMaterialDepot'

    export default {
        
        data() {
            let that = this
            return {
                activeName: 'first',
                values:{
                    warehouseId: '',
                    warehouseName: '',
                    warehouseSite: '',
                    departmentId: '',
                    departmentName: '',
                    string2: '',
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
                                        this.transform.isShowDetails = true
                                        this.routerLink ('采购入库详情', parms.row.id)
                                    }
                                }
                            }, parms.row.supplierCode)
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
                remoteFuncs: {
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
                        ])
                    },
                    getDepartmentName (resolve) {
                        resolve(that.departmentNameArr) 
                    },
                },
                departmentNameArr: [],
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
            getresignationQueryPersonalDataID () {
                getUserDepartById({ 
                    userId: util.cookies.get ('uuid')
                }).then( res => {
                    this.departmentNameArr = res
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
                            num += m.money2, m.number3 = m.number3 ? m.number3 + '' : ''
                            m.money1 = m.money1 ? m.money1 + '' : '', m.money2 = m.money2 ? m.money2 + '' : ''
                            m.consumables = m.consumables == '1' ? '是' : '否'
                        })
                    } else {
                       res.materialList = []
                    }
                    res.amountString = num + ''
                    res.createName = util.cookies.get ('username')
                    res.createBy = util.cookies.get ('id')
                    res.departmentId = ''
                    res.departmentName = ''
                    this.values = res
                })
            },

            upLoadFileCallBack (item) {
                this.values.fileList = item
            },

            // 提交
            submissionScrapRecord () { 
                let boolean = {}
                boolean = this.$refs.materials.verify ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && boolean) {
                        Object.assign (this.values, data)
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
                this.$router.go(-1)
                let tagName = this.$route.path
                this.close ({ tagName })
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
                let item = {}, list = []
                this.values['amount'] = 0
                data.length > 0 ? this.values.materialList = this.$refs.materials.getNotVerify () : data = this.$refs.materials.getNotVerify ()
                data.forEach (m => {
                    m.money2 = m.money2 + '', m.money1 ? m.money1 = m.money1 + '' : ''
                    m.number3 = m.number3 + '', m.parentId = m.id,
                    m['consumables'] = m.consumables == '1' ? '是' : '否'
                    this.values['amount'] += Number (m.money2)
                    item = this.values.materialList.find (f => f.id == m.id)
                    if (!item) list.push (m)
                })
                !boolean ? this.values.materialList.push (...list) : (this.values.materialList = JSON.parse (JSON.stringify (data)), this.values.amountString = this.values['amount'] + '')
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
            
            getMaterialListChange (data, prop, value) {
                switch (prop) {
                    case 'number3':
                        this.neatenMaterialList ([], true)
                        break
                }
            },

            updataState () {
                switch (this.category) {
                    case '5':
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
                        isShowDetails: this.category == '4' ? true : false
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
                        prop: 'number3',
                        label: '数量',
                        isShow: true,
                        type: 'text',
                        width: 120,
                        required: true,
                        isShowDetails: this.category !== '1' && this.category !== '5' && this.category !== '6' ? true : false,
                        isNonnegativeNumber: true
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
            },
            getDetail (id) {
                let num = 0
                outgoingRecordQueryById({id: id}).then(res => {
                    if (res.materialList !== '' && res.materialList !== null) {
                        res.materialList.forEach( m => {
                            num += m.money2, m.number3 = m.number3 ? m.number3 + '' : ''
                            m.money1 = m.money1 ? m.money1 + '' : '', m.money2 = m.money2 ? m.money2 + '' : ''
                            m.consumables = m.consumables == '1' ? '是' : '否'
                        })
                    } else {
                       res.materialList = []
                    }
                    res.amountString = num + ''
                    this.setFile(res.fileList)
                    Object.assign(this.values, res)
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
            }
        },

        created() {
            this.category = this.$route.params.category
            this.updataState ()
            this.getresignationQueryPersonalDataID ()
            this.isShwoHeaderList ()
            this.getOutboundOrderListData ()
            this.transform = this.$route.params.transform
            this.sourceId = this.moduleId = this.$route.params.sourceId
            this.getOutgoingRecordList ()

            // 查询详情
            this.getDetail(this.$route.params.relevancyId)
        },
        components: {
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent,
            'qqt-relate-table': qqtRelateTable,
            'up-load': upload,
            'qqt-input': qqtInput,
            'popout-entreport': popoutEntreport,
            'popout-material-depot': popoutMaterialDepot,
            'qqt-table-tree': qqtTableTree
        },
    };
</script>
                                                  
<style lang='scss' scoped>
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
    .lock-inventory-information___upload {
        padding: 20px 30px;
        .lock-inventory-information___label {
            font-size: 14px;
            float: left;
            margin-left: 16px;
            color: $input-disable
        }
        .lock-inventory-information___right {
            margin-left: 90px
        }
    }
    .warehouse{
        .el-form-item{
            margin-bottom: 0px;
        }
    }
</style>