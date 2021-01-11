<template>
    <el-row class="collection-payment-personnel">
        <el-form :model="collectionPayment" ref="collectionPaymentInformation" :rules="rules" label-width="130px" size="medium">
            <el-col :span="8" v-if="isIncome">
                <el-form-item label="付款方户名" class="collection-payment-information-line" prop="payname">
                    <qqt-select :value="collectionPayment.payname" :defaultProp="defaultProp" :filterable="true" :allowCreate="true" v-if="!isShowElement" :options="options" @select="updataPaymentInformation"></qqt-select>
                    <qqt-input v-model="collectionPayment.payname" :readonly="true" v-if="isShowElement"/>
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="!isIncome">
                <el-form-item label="收款方户名" class="collection-payment-information-line" prop="recname">
                    <qqt-select :value="collectionPayment.recname" :defaultProp="defaultProp" :filterable="true" :allowCreate="true" v-if="!isShowElement" :options="options" @select="updataPaymentInformation"></qqt-select>
                    <qqt-input v-model="collectionPayment.recname" :readonly="true" v-if="isShowElement"/>
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="isIncome">
                <el-form-item label="开户行" class="collection-payment-information-line" prop="paybank">
                    <qqt-input v-model="collectionPayment.paybank" :readonly="isShowElement" @input="collectionPayment.paybank = $event"/>
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="!isIncome">
                <el-form-item label="开户行" class="collection-payment-information-line" prop="recbank">
                    <qqt-input v-model="collectionPayment.recbank" :readonly="isShowElement" @input="collectionPayment.recbank = $event"/>
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="isIncome">
                <el-form-item label="账号" prop="paynum">
                    <qqt-input v-model="collectionPayment.paynum" :readonly="isShowElement" @input="collectionPayment.paynum = $event" />
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="!isIncome">
                <el-form-item label="账号" prop="recnum">
                    <qqt-input v-model="collectionPayment.recnum" :readonly="isShowElement" @input="collectionPayment.recnum = $event" />
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="isIncome">
                <el-form-item label="行号" class="collection-payment-information-line" prop="payline">
                    <qqt-input v-model="collectionPayment.payline" :readonly="isShowElement" @input="collectionPayment.payline = $event" />
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="!isIncome">
                <el-form-item label="行号" class="collection-payment-information-line" prop="recline">
                    <qqt-input v-model="collectionPayment.recline" :readonly="isShowElement" @input="collectionPayment.recline = $event" />
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="isIncome">
                <el-form-item label="付款方联系人" class="collection-payment-information-line" prop="payman">
                    <qqt-input v-model="collectionPayment.payman" :readonly="isShowElement" @input="collectionPayment.payman = $event" />
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="!isIncome">
                <el-form-item label="收款方联系人" class="collection-payment-information-line" prop="recman">
                    <qqt-input v-model="collectionPayment.recman" :readonly="isShowElement" @input="collectionPayment.recman = $event" />
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="isIncome">
                <el-form-item label="联系电话" prop="payway">
                    <qqt-input v-model="collectionPayment.payway" :readonly="isShowElement" @input="collectionPayment.payway = $event" />
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="!isIncome">
                <el-form-item label="联系电话" prop="recway">
                    <qqt-input v-model="collectionPayment.recway" :readonly="isShowElement" @input="collectionPayment.recway = $event" />
                </el-form-item>
            </el-col>
        </el-form>
    </el-row>
</template>

<script>
    import { qqtInput, qqtSelect } from '@/components/qqt-subassembly'
    import { registerListAll } from '@/api/financialManagement/financeFundFetermination'
    import util from '@/libs/util.js'
    export default {

        props: {
            isShowElement: {
                type: Boolean,
                default: () => true
            },
            isIncome: {
                type: Boolean,
                default: () => false
            },
            data: {
                type: Object,
                default: ({})
            }
        },

        components: {
            'qqt-input': qqtInput,
            'qqt-select': qqtSelect
        },

        data () {
            return {
                collectionPayment: {
                    payname: '',
                    recname: '',
                    paybank: '',
                    recbank: '',
                    payline: '',
                    recline: '',
                    paynum: '',
                    recnum: '',
                    payman: '',
                    recman: '',
                    payway: '',
                    recway: ''
                },
                defaultProp: {
                    value: 'id',
                    label: 'name'
                },
                options: [],
                rules: {
                    payname: [
                        { required: true, message: `付款方户名不能为空`, trigger: 'change' }
                    ],
                    recname: [
                        { required: true, message: '收款方户名不能为空', trigger: 'change' }
                    ],
                    paybank: [
                        { required: true, message: '开户行不能为空', trigger: 'change' }
                    ],
                    recbank: [
                        { required: true, message: '开户行不能为空', trigger: 'change' }
                    ],
                    payline: [
                        { required: true, message: '行号不能为空', trigger: 'change' }
                    ],
                    recline: [
                        { required: true, message: '行号不能为空', trigger: 'change' }
                    ],
                    paynum: [
                        { required: true, message: '账号不能为空', trigger: 'change' },
                        { pattern: /^[0-9A-Z-]{12,20}$/, message: '账号不合法', trigger: 'change' }
                    ],
                    recnum: [
                        { required: true, message: '账号不能为空', trigger: 'change' },
                        { pattern: /^[0-9A-Z-]{12,20}$/, message: '账号不合法', trigger: 'change' }
                    ],
                    payman: [
                        { required: true, message: '付款方联系人不能为空', trigger: 'change' }
                    ],
                    recman: [
                        { required: true, message: '收款方联系人不能为空', trigger: 'change' }
                    ],
                    payway: [
                        { required: true, message: '联系电话不能为空', trigger: 'change' },
                        { pattern: /^1(3|4|5|6|7|8|9)\d{9}$/, message: '联系电话不合法', trigger: 'change' }
                    ],
                    recway: [
                        { required: true, message: '联系电话不能为空', trigger: 'change' },
                        { pattern: /^1(3|4|5|6|7|8|9)\d{9}$/, message: '联系电话不合法', trigger: 'change' }
                    ],
                },
            }
        },

        methods: {

            updataCollectionPayment (data) {
                const { payname, recname, paybank, recbank, payline, recline, paynum, recnum, payman, recman, payway, recway } = data
                let item = { payname, recname, paybank, recbank, payline, recline, paynum, recnum, payman, recman, payway, recway }
                this.collectionPayment = item
            },

            getData () {
                let required = false
                this.$refs.collectionPaymentInformation.validate(valid => {
                    if (valid) {
                        required = JSON.parse (JSON.stringify (this.collectionPayment))
                    } else {
                        required = false
                    }
                })
                return required
            },

            updataPaymentInformation (data) {
                let item = this.options.find (f => f.id == data)
                if (item) {
                    if (this.isIncome) {
                        this.collectionPayment.payname = item.name
                        this.collectionPayment.paybank = item.openingBank
                        this.collectionPayment.paynum = item.account
                    } else {
                        this.collectionPayment.recname = item.name
                        this.collectionPayment.recbank = item.openingBank
                        this.collectionPayment.recnum = item.account
                    }
                } else {
                    if (this.isIncome) {
                        this.collectionPayment.payname = data
                    } else {
                        this.collectionPayment.recname = data
                    }
                }
            },

            registerListAllList () {
                registerListAll ().then (res => {
                    if (res) this.options = res
                })
            }
        },

        created () {
            this.registerListAllList ()
            if (this.$route.params && this.$route.params.relevancyId) this.updataCollectionPayment (this.data)
        }
    }
</script>
<style lang="scss">
    .collection-payment-personnel {
        margin-top: 10px;
        .el-form-item__label {
            border: 1px solid $color-border-1;
            border-right-color: transparent;
            line-height: 34px !important;
            text-align: center
        }
        .collection-payment-information-line {
            input {
                border-color: $color-border-1;
                border-right-color: transparent;
            }
        }
    }
</style>