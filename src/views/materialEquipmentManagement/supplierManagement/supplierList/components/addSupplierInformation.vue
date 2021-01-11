<template>
    <d2-container class="add-supplier-information">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
            </div>
            <fm-generate-form :data="jsonData" :remote="remote" :transform="transform" :value="values" ref="generateForm" @on-change="selectGenerateChange" />
            <supplier-information-from
                :supplierInformation="values"
                ref="supplierInformation"
                :isShowElement="!transform.isShowDetails"
                :taxpayerNatureOptions="taxpayerNature"
                :invoiceTaxRateOptions="invoiceTaxRateOptions"
                :paymentMethodOptions="paymentMethodOptions"
                :invoiceTypeOptions="invoiceTypeOptions"
                :freightForOptions="freightForOptions"
                :isRequired="isRequired"
            />
            
            <el-divider content-position="left">
                <div class="generate-from-divider___line"></div>
                其他
            </el-divider>
            <el-form :model="values" label-width="120px" size="medium">
                <el-form-item label="备注:">
                    <el-input v-model="values.remark" @input="values.remark = $event"  />
                </el-form-item>
            </el-form>
            <bottom-information :values="values" left="120px" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation" />
            <div class="drawer-btn">
                <el-button type="primary" size="mini" v-if="!transform.isShowDetails" @click="onSubmit">保存</el-button>
                <el-button size="mini" @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
    </d2-container>
</template>

<script>
import { formGetJson } from '../../../../../api/system/fromManagement/index'
import { MATERIALEQUIPMENTMANAGEMENT } from '../../../../../enum/FORMCODE'
import { SUPPLIERMANAGEMENT, PURCHASEREQUEST } from '../../../../../enum/DICTIONARY'
import { queryDicByIds } from '../../../../../api/system/dic/dic'
import { addSupplier, editSupplier, getSupplierById } from '../../../../../api/materialEquipmentManagement/supplierManagement/supplierList'
import { qqtRelateTable } from '../../../../../components/qqt-subassembly'
import { mapActions } from 'vuex'

import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
import supplierInformationFrom from './supplierInformationFrom'
import util from '@/libs/util.js'
let than = this
export default {

    data () {
        return {
            jsonData: {},
            remote: {},
            taxpayerNature: [],
            supplierCategory: [],
            papersTypeOptions: [],
            freightForOptions: [],
            invoiceTypeOptions: [],
            paymentMethodOptions: [],
            invoiceTaxRateOptions: [],
            upLoadFileDefaultList: [],
            values: {},
            transform: {
                isShowDetails: false
            },
            supplierNatureOptions: [
                {
                    id: '1',
                    name: '国有企业'
                },
                {
                    id: '2',
                    name: '私营企业'
                },
                {
                    id: '3',
                    name: '个体工商户'
                },
                {
                    id: '4',
                    name: '自然人'
                }
            ],
            userIninformation: {},
            isRequired: false
        }
    },

    methods: {

        ...mapActions('d2admin/page', [
            'close',
        ]),

        getFormByJson () {
            formGetJson ({'code': MATERIALEQUIPMENTMANAGEMENT.ADDSUPPLIERINFORMATION}).then(res => {
                if (res) this.jsonData = JSON.parse(res)
            })
        },

        upLoadFileCallBack (item) {
            this.values.fileList = item
        },

        selectGenerateChange (field, val) {
            let item = ''
            switch (field) {
                case 'supplierCategoryId':
                    this.values.supplierCategoryId = val
                    item = this.supplierCategory.find (f => f.id === val)
                    if (item) this.values['supplierCategory'] = item.name
                    break
                case 'supplierNatureId':
                    this.values.supplierNatureId = val
                    this.isRequired = val == '4' ? false : true
                    item = this.supplierNatureOptions.find (f => f.id === val)
                    if (item) this.values['supplierNature'] = item.name
                    break
                case 'papersTypeId':
                    this.values.papersTypeId = val
                    item = this.papersTypeOptions.find (f => f.id === val)
                    if (item) this.values['papersType'] = item.name
                    break
            }
        },

        closePageTag () {
            let tagName = this.$route.path
            let path = `/materialEquipmentManagement/supplierManagement/supplierList`
            this.close ({ tagName, path })
        },

        onSubmit () {
            let url = '', supplierInformation = false, bottomInformation = false
            supplierInformation = this.$refs.supplierInformation.verify ()
            bottomInformation = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData ().then(item => {
                if (item && supplierInformation && bottomInformation){
                    Object.assign (this.values, supplierInformation, item, bottomInformation)
                    this.values.locationId = JSON.stringify (this.values.locationId)
                    this.values.id == null ? url = addSupplier : url = editSupplier
                    url (this.values).then(res => {
                        if (res.code === 200) {
                            this.$message.success ('操作成功')
                            this.closePageTag ()
                        }
                    })
                }
            })
        },

        getSupplierInformationData (id) {
            getSupplierById ({id: id}).then (res => {
                if (res) {
                    res.locationId = JSON.parse (res.locationId)
                    this.values = res
                    if (this.values.fileList && this.values.fileList.length > 0) {
                        this.values.fileList.forEach(item => {
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

        getQueryDicByIdList () {
            let list = [ SUPPLIERMANAGEMENT.SUPPLIERCATEGORY, SUPPLIERMANAGEMENT.PAPERSTYPE, PURCHASEREQUEST.INVOICETYPE,
                SUPPLIERMANAGEMENT.TAXPAYERELIGIBILITY, SUPPLIERMANAGEMENT.FREIGHTFOR, SUPPLIERMANAGEMENT.PAYMENTMETHOD,
                SUPPLIERMANAGEMENT.TAXRATE
            ]
            queryDicByIds (list).then (item => {
                if (!item) return
                this.invoiceTypeOptions = item[PURCHASEREQUEST.INVOICETYPE]
                this.papersTypeOptions = item[SUPPLIERMANAGEMENT.PAPERSTYPE]
                this.freightForOptions = item[SUPPLIERMANAGEMENT.FREIGHTFOR]
                this.invoiceTaxRateOptions = item[SUPPLIERMANAGEMENT.TAXRATE]
                this.supplierCategory = item[SUPPLIERMANAGEMENT.SUPPLIERCATEGORY]
                this.taxpayerNature = item[SUPPLIERMANAGEMENT.TAXPAYERELIGIBILITY]
                this.paymentMethodOptions = item[SUPPLIERMANAGEMENT.PAYMENTMETHOD]
                this.neatenData ()
            })
        },

        neatenData () {
            this.remote = {
                getPapersType (resolve) {
                    resolve (than.papersTypeOptions)
                },

                getSupplierCategoryId (resolve) {
                    resolve (than.supplierCategory)
                },

                getSupplierNature (resolve) {
                    resolve (than.supplierNatureOptions)
                }
            }
        }
    },

    created () {
        this.getFormByJson ()
        this.getQueryDicByIdList ()
        this.transform = this.$route.params.transform
        if (this.$route.params && this.$route.params.relevancyId) {
            this.getSupplierInformationData (this.$route.params.relevancyId)
        }
    },

    mounted () {
        than = this
    },

    components: {
        'qqt-relate-table': qqtRelateTable,
        'bottom-information': bottomInformation,
        'supplier-information-from': supplierInformationFrom
    }
}
</script>

<style lang='scss' scoped>
.add-supplier-information {
    .drawer-btn{
        padding-top: 10px;
        text-align: center;
    }
    .el-input__inner {
        border-radius: 0px !important
    }
    .files-upload___right {
        margin-left: 120px !important;
    }
}
</style>
