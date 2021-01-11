<template>
    <d2-container class="add-purchase-enquiry">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
            </div>
            <fm-generate-form :data="jsonData" :remote="remote" :transform="transform" :value="values" ref="generateForm" ></fm-generate-form>
            <purchase-enquiry-form
                :enquiry="values"
                ref="enquiry"
                :departmentList="departmentList"
                :invoiceTypeOptions="invoiceTypeList"
                :inquiryCategoryOptions="inquiryCategoryList"
                :taxCategoriesOptions="taxCategoriesList"
                :isShowElement="!transform.isShowDetails"
                :relatedProjectsOptions="relevanceProjectList"/>
            <div class="add-purchase-enquiry-button">
                <el-button size="mini" round @click="getPurchaseEnquirymaterialList" :disabled="transform.isShowDetails">从材料库导入</el-button>
            </div>
            <el-divider content-position="left">
                <div class="generate-from-divider___line"></div>
                询价材料明细
            </el-divider>
            <qqt-relate-table :data="values.materialList" ref="materials" :replaceRules="enquiryRules" :isShowAdd="false" @select="selectChange" :isDefaultShowRow="false" :rowHeader="materialsHeader" :isShowDetails="transform.isShowDetails" />
            <bottomInformation :values="values" fieldTitle="询价" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation"></bottomInformation>
            <div class="drawer-btn">
                <el-button type="primary" size="mini" v-if="!transform.isShowDetails" @click="onSubmit">保存</el-button>
                <el-button size="mini" @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <popout-material-depot v-if="dialogVisible" :dialogVisible="dialogVisible" @close="getMaterialData" />
    </d2-container>
</template>

<script>
    import { addPurchaseEnquiry, editPurchaseEnquiry, getPurchaseEnquiryById } from '../../../../../api/materialEquipmentManagement/procurementManagement/purchaseEnquiry'
    import { getSupplierPageAllList } from '../../../../../api/materialEquipmentManagement/supplierManagement/supplierList'
    import { addSelfPurchaseEnquiry, editSelfPurchaseEnquiry, submitSelfPurchaseEnquiry  } from '@/api/selfProject/selfProprietaryProcurement/purchaseEnquiry'
    import { upload, qqtRelateTable } from '../../../../../components/qqt-subassembly'
    import { formGetJson } from '../../../../../api/system/fromManagement/index'
    import { MATERIALEQUIPMENTMANAGEMENT } from '../../../../../enum/FORMCODE'
    import { PURCHASEREQUEST, PURCHASEENQUIRY } from '../../../../../enum/DICTIONARY'
    import { getAllProList } from '../../../../../api/jointProject/index'
    import { queryDicByIds } from '../../../../../api/system/dic/dic'
    import { mapActions, mapState } from 'vuex'

    import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
    import purchaseEnquiryForm from './purchaseEnquiryForm'
    import popoutMaterialDepot from '../../../basicInformation/materialDepot/components/popoutMaterialDepot'
    import util from '@/libs/util.js'
    let than = this
    export default {

        data () {
            return {
                num: 0,
                jsonData: {},
                remote: {},
                values: {
                    materialList: [],
                    fileList: [],
                    departmentId: ''
                },
                supplierList: [],
                departmentList: [],
                invoiceTypeList: [],
                dialogVisible: false,
                taxCategoriesList: [],
                inquiryCategoryList: [],
                relevanceProjectList: [],
                upLoadFileDefaultList: [],
                transform: {
                    isShowDetails: false
                },
                materialsHeader: [],
                enquiryRules: {
                    'supplierId': [
                        { required: true, message: '供应商不能为空', trigger: 'change' }
                    ],
                    'string1': [
                        { required: true, pattern: /^1(3|4|5|6|7|8|9)\d{9}$/, message: '联系方式有误', trigger: 'change' }
                    ]
                },
            }
        },

        methods: {

            ...mapActions('d2admin/page', [
                'close',
            ]),

            getFormByJson () {
                formGetJson ({'code': MATERIALEQUIPMENTMANAGEMENT.ADDPURCHASEENQUIRY}).then(res => {
                    if (res) this.jsonData = JSON.parse(res)
                })
            },

            upLoadFileCallBack (item) {
                this.values.fileList = item
            },

            getSupplierAllList () {
                getSupplierPageAllList ().then (res => {
                    if (res) this.supplierList = res, this.isShowMaterialsHeader (res)
                })
            },

            onSubmit () {
                let boolean = '', enquiry = {}, element = {}
                enquiry = this.$refs.enquiry.verify ()
                boolean = this.$refs.materials.verify ()
                element = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then(item => {
                    if (item && boolean && enquiry && element){
                        Object.assign (this.values, enquiry, item, element)
                        this.values['materialList'] = boolean
                        this.values.relatedProjects = this.selfSupportProject.projectName
                        this.values.projectCode = this.selfSupportProject.projectCode
                        let url = ''
                        this.values.id == null ? (this.$route.params.identification == '1' ? url = addSelfPurchaseEnquiry : url = addPurchaseEnquiry) : 
                            this.$route.params.identification == '1' ? url = editSelfPurchaseEnquiry : url = editPurchaseEnquiry
                        url (this.values).then(res => {
                            if (res.code === 200) {
                                this.$message.success ('操作成功')
                                this.closePageTag ()
                            }
                        })
                    }
                })
            },

            getQueryDicByIdList () {
                let list = [ PURCHASEENQUIRY.INQUIRYCATEGORY, PURCHASEREQUEST.TAXCATEGORIES, PURCHASEREQUEST.INVOICETYPE ]
                queryDicByIds (list).then (item => {
                    if (!item) return
                    this.inquiryCategoryList = item[PURCHASEENQUIRY.INQUIRYCATEGORY]
                    this.taxCategoriesList = item[PURCHASEREQUEST.TAXCATEGORIES]
                    this.invoiceTypeList = item[PURCHASEREQUEST.INVOICETYPE]
                })
            },

            getPurchaseEnquiry (id) {
                getPurchaseEnquiryById ({'id': id}).then (res => {
                    if (res) {
                        res.materialList.forEach (f => { f.money1 = f.money1 + '', f['consumablesName'] = f.consumables == '1' ? '是' : '否' })
                        res.taxRate = res.taxRate + '', this.values = res
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

            getRelevanceProject () {
                getAllProList ().then (res => {
                    if (res && res.records) this.relevanceProjectList = res.records
                })
            },

            getMaterialData (item) {
                let str = ''
                this.dialogVisible = false
                if (item) {
                    item.forEach (res => {
                        res['consumablesName'] = res.consumables == '1' ? '是' : '否'
                        res['materialId'] = res.id, res['supplierId'] = '', res['string1'] + ''
                        res.id = new Date ().getTime () + (Math.random()*10)
                    })
                    this.values['materialList'].push (...item)
                }
            },

            selectChange (data, prop, value, index) {
                let item = this.supplierList.find (f => f.id === value)
                if (item) {
                    this.$set (this.values['materialList'], index, {
                        ...this.values['materialList'][index],
                        string1: item.contactNumber,
                        supplierId: item.id,
                        supplierName: item.nameSupplier,
                        remark: data.remark,
                        string2: data.string2,
                        money1: data.money1
                    })
                }
            },

            getPurchaseEnquirymaterialList () {
                this.values.materialList = this.$refs.materials.getNotVerify ()
                this.dialogVisible = true
            },

            closePageTag () {
                let tagName = this.$route.path
                let path = `/materialEquipmentManagement/procurementManagement/${this.$route.params.path}`
                this.close ({ tagName, path })
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
                        prop: 'string2',
                        label: '数量',
                        isShow: true,
                        type: 'text',
                        width: 200,
                        isNonnegativeNumber: true
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
                        filterable: true,
                        allowCreate: true,
                        required: true
                    },
                    {
                        prop: 'string1',
                        label: '联系方式',
                        isShow: true,
                        type: 'text',
                        width: 200,
                        required: true
                    },
                    {
                        prop: 'money1',
                        label: '单价',
                        isShow: true,
                        width: 200,
                        type: 'money',
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
            this.getFormByJson ()
            this.getSupplierAllList ()
            this.getQueryDicByIdList ()
            this.getRelevanceProject ()
            this.transform = this.$route.params.transform
            if (this.$route.params && this.$route.params.relevancyId) { 
                this.getPurchaseEnquiry (this.$route.params.relevancyId)
            }
            if(this.$route.params.identification == '1') this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad')
        },

        mounted () {
            than = this
        },

        components: {
            'qqt-relate-table': qqtRelateTable,
            'bottomInformation': bottomInformation,
            'popout-material-depot': popoutMaterialDepot,
            'purchase-enquiry-form': purchaseEnquiryForm,
        },

        computed: {
            ...mapState('d2admin/allUser', [
                'depart'
            ]),
            ...mapState ('d2admin/selfSupportProject', [
                'selfSupportProject'
            ])
        }
    }
</script>

<style lang='scss' scoped>
    .add-purchase-enquiry {
        .drawer-btn{
            padding-top: 10px;
            text-align: center;
        }
        .add-purchase-enquiry-button {
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
    }
</style>
