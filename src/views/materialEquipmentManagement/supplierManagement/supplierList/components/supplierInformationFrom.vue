<template>
    <el-row class="supplierInformationFrom">
        <el-form :model="data" ref="supplierInformationFrom" :rules="rules" label-width="120px" size="medium">
            <el-col :span="8">
                <el-form-item label="纳税人资格:" prop="taxpayerNatureId">
                    <qqt-select :value="data.taxpayerNatureId" :isShowElement="isShowElement" :defaultProp="defaultProp" :options="taxpayerNatureOptions" @select="getFieldName ($event, 1)" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="能否开票:" prop="whetherInvoice">
                    <qqt-radio v-model="data.whetherInvoice" :options="invoiceList" :isShowElement="isShowElement" @radio="data.whetherInvoice = $event" />
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="data.whetherInvoice == '1'">
                <el-form-item label="开票类型:" prop="invoiceTypeId">
                    <qqt-select :value="data.invoiceTypeId" :isShowElement="isShowElement" :defaultProp="defaultProp" :options="invoiceTypeOptions" @select="getFieldName ($event, 2)" />
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="data.whetherInvoice == '1'">
                <el-form-item label="税 率:" prop="invoiceTaxRateId">
                    <qqt-select :value="data.invoiceTaxRateId" :isShowElement="isShowElement" :defaultProp="defaultProp" :options="invoiceTaxRateOptions" @select="getFieldName ($event, 3)" />
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item label="注册资金:" prop="registeredCapital" :rules="isRequired ? rules.registeredCapital : {}">
                    <qqt-input v-model="data.registeredCapital" :isMoneyType="true" btnTitle="元" :isShowElement="isShowElement" @input="data.registeredCapital = $event" />
                </el-form-item>
            </el-col>
            <el-col :span="8" >
                <el-form-item label="供货周期:">
                    <qqt-input v-model="data.deliveryCycle" btnTitle="天" :isShowElement="isShowElement" @input="data.deliveryCycle = $event" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="是否送货:" prop="whetherDelivery">
                    <qqt-radio v-model="data.whetherDelivery" :options="invoiceList" :isShowElement="isShowElement" @radio="data.whetherDelivery = $event" />
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="data.whetherDelivery == '1'">
                <el-form-item label="运费承担:" prop="freightForId">
                    <qqt-select :value="data.freightForId" :isShowElement="isShowElement" :defaultProp="defaultProp" :options="freightForOptions" @select="getFieldName ($event, 4)" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="付款方式:" prop="paymentMethodId">
                    <qqt-select :value="data.paymentMethodId" :isShowElement="isShowElement" :defaultProp="defaultProp" :options="paymentMethodOptions" @select="getFieldName ($event, 5)" />
                </el-form-item>
            </el-col>
             <el-col :span="8">
                <el-form-item label="所在地:" prop="locationId">
                    <qqt-cascader
                        v-model="data.locationId"
                        :options="cityJson"
                        :isShowElement="isShowElement"
                        :defaultParams="detailaddressParams"
                        @cascaded="getFieldName ($event, 6)"
                    >
                    </qqt-cascader>
                </el-form-item>
            </el-col>
            <el-col :span="data.whetherInvoice == '1' ? data.whetherDelivery == '0' ? 24 : 16 : data.whetherDelivery == '1' ? 8 : 16">
                <el-form-item label="详细地址:" prop="detailedAddress">
                    <qqt-input v-model="data.detailedAddress" :isShowElement="isShowElement" @input="data.detailedAddress = $event" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="联系人:" prop="contacts">
                    <qqt-input v-model="data.contacts" :isShowElement="isShowElement" @input="data.contacts = $event" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="联系电话:" prop="contactNumber">
                    <qqt-input v-model="data.contactNumber" :isShowElement="isShowElement" @input="data.contactNumber = $event" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="电子邮箱:">
                    <qqt-input v-model="data.email" :isShowElement="isShowElement" @input="data.email = $event" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="收款账户:">
                    <qqt-input v-model="data.proceedsAccount" :isShowElement="isShowElement" @input="data.proceedsAccount = $event" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="开户行:">
                    <qqt-input v-model="data.proceedsBank" :isShowElement="isShowElement" @input="data.proceedsBank = $event" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="账号:">
                    <qqt-input v-model="data.proceedsNumber" :isShowElement="isShowElement" @input="data.proceedsNumber = $event" />
                </el-form-item>
            </el-col>
        </el-form>
    </el-row>
</template>

<script>
    import { qqtInput, qqtSelect, qqtRadio, qqtCascader } from '../../../../../components/qqt-subassembly'
    import { CITYJSON } from '../../../../../enum/CTIYS'
    
    import util from '@/libs/util.js'
    export default {

        props: {
            supplierInformation: {
                type: Object,
                default: () => {}
            },
            isShowElement: {
                type: Boolean,
                default: true
            },
            taxpayerNatureOptions: {
                type: Array,
                default: () => []
            },
            invoiceTypeOptions: {
                type: Array,
                default: () => []
            },
            invoiceTaxRateOptions: {
                type: Array,
                default: () => []
            },
            freightForOptions: {
                type: Array,
                default: () => []
            },
            paymentMethodOptions: {
                type: Array,
                default: () => []
            },
            isRequired: {
                type: Boolean,
                default: () => false
            }
        },

        components: {
            'qqt-radio': qqtRadio,
            'qqt-input': qqtInput,
            'qqt-select': qqtSelect,
            'qqt-cascader': qqtCascader
        },

        data () {
            return {
                data: {
                    registeredCapital: '',
                    taxpayerNatureId: '',
                    invoiceTaxRateId: '',
                    whetherDelivery: '1',
                    paymentMethodId: '',
                    detailedAddress: '',
                    proceedsAccount: '',
                    whetherInvoice: '1',
                    proceedsNumber: '',
                    invoiceTypeId: '',
                    deliveryCycle: '',
                    contactNumber: '',
                    freightForId: '',
                    proceedsBank: '',
                    unitAddresss: '',
                    locationId: [],
                    contacts: ''
                },
                rules: {
                    taxpayerNatureId: [
                        { required: true, message: '纳税人性质不能为空', trigger: 'change' }
                    ],
                    whetherInvoice: [
                        { required: true, message: '退换货期限不能为空', trigger: 'change' }
                    ],
                    invoiceTypeId: [
                        { required: true, message: '开票类型不能为空', trigger: 'change' }
                    ],
                    invoiceTaxRateId: [
                        { required: true, message: '税 率不能为空', trigger: 'change' }
                    ],
                    whetherDelivery: [
                        { required: true, message: '是否送货不能为空', trigger: 'change' }
                    ],
                    freightForId: [
                        { required: true, message: '运费承担不能为空', trigger: 'change' }
                    ],
                    paymentMethodId: [
                        { required: true, message: '付款方式不能为空', trigger: 'change' }
                    ],
                    locationId: [
                        { required: true, message: '所在地不能为空', trigger: 'change' }
                    ],
                    detailedAddress: [
                        { required: true, message: '详细地址不能为空', trigger: 'blur' }
                    ],
                    proceedsAccount: [
                        { required: true, message: '收款账户不能为空', trigger: 'blur' }
                    ],
                    proceedsBank: [
                        { required: true, message: '开户行不能为空', trigger: 'blur' }
                    ],
                    proceedsNumber: [
                        { required: true, pattern: /^[0-9A-Z-]{12,20}$/, message: '账号不能为空', trigger: 'blur' }
                    ],
                    registeredCapital: [
                        { required: true, message: '注册资金不能为空', trigger: 'blur'  }
                    ],
                    contactNumber: [
                        { required: true, pattern: /^1(3|4|5|6|7|8|9)\d{9}$/, message: '联系方式有误', trigger: 'blur' }
                    ],
                    contacts: [
                        { required: true, message: '账号不能为空', trigger: 'blur' }
                    ]
                },
                defaultProp: {
                    value: 'id',
                    label: 'name'
                },
                detailaddressParams: {
                    value: 'label',
                    label: 'label'
                },
                invoiceList: [
                    {
                        value: '1',
                        label: '是'
                    },
                    {
                        value: '0',
                        label: '否'
                    }
                ],
                cityJson: CITYJSON
            }
        },

        methods: {

            verify () {
                let required = false
                this.$refs.supplierInformationFrom.validate(valid => {
                    if (!valid) {
                        required = false
                    } else {
                        required = true
                    }
                })
                if (required) {
                    delete this.data.fileList
                    return JSON.parse (JSON.stringify (this.data))
                }
            },

            getFieldName (value, state) {
                let item = {}, str = ''
                switch (state) {
                    case 1:
                        this.data.taxpayerNatureId = value
                        item = this.taxpayerNatureOptions.find (f => f.id == value)
                        if (item) this.data['taxpayerNature'] = item.name
                        break
                    case 2:
                        this.data.invoiceTypeId = value
                        item = this.invoiceTypeOptions.find (f => f.id == value)
                        if (item) this.data['invoiceType'] = item.name
                        break
                    case 3:
                        this.data.invoiceTaxRateId = value
                        item = this.invoiceTaxRateOptions.find (f => f.id == value)
                        if (item) this.data['invoiceTaxRate'] = item.name
                        break
                    case 4:
                        this.data.freightForId = value
                        item = this.freightForOptions.find (f => f.id == value)
                        if (item) this.data['freightFor'] = item.name
                        break
                    case 5:
                        this.data.paymentMethodId = value
                        item = this.paymentMethodOptions.find (f => f.id == value)
                        if (item) this.data['paymentMethod'] = item.name
                        break
                    case 6:
                        if (typeof val == 'string') return
                        this.data.locationId = value
                        this.data['location']= ''
                        value.forEach (f => this.data['location'] += f)
                        break
                }
            },
        },

        watch: {
            supplierInformation (val) {
                util.setObjval(this.data, val)
            }
        }
    }
</script>
<style lang="scss">
    .supplierInformationFrom {
        .el-col-8 {
            height: 58px !important;
        }
        .el-input__inner {
            border-radius: 0px !important;
        }
        .el-input-group__append, .el-input-group__prepend {
            border-radius: 0px !important;
        }
    }
</style>