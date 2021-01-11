<template>
    <el-row class="collection-payment-information">
        <el-form :model="collectionPayment" ref="collectionPaymentInformation" label-width="130px" size="medium">
            <el-col :span="10">
                <el-form-item label="本次结算金额" class="collection-payment-information-color">
                    <qqt-input v-model="collectionPayment.thissettle" :isMoneyType="true" :readonly="true" @input="updataIncomeExpenditure ($event, 1)"/>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label-width="0px" class="collection-payment-information-line collection-payment-information-color">
                    <qqt-input v-model="collectionPayment.thissettleCapital" :readonly="true" />
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="isIncome">
                <el-form-item label="收到时间">
                    <el-date-picker 
                        value-format="yyyy-MM-dd hh:mm:ss"
                        :readonly="$route.name == 'contractSettleAccountsAccount' ? false : !isShowElement"
                        v-model="collectionPayment.rectime"
                        type="datetime"
                    />
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="!isIncome">
                <el-form-item label="支付时间">
                    <el-date-picker 
                        value-format="yyyy-MM-dd hh:mm:ss"
                        :readonly="$route.name == 'contractSettleAccountsAccount' ? false : !isShowElement"
                        v-model="collectionPayment.paytime"
                        type="datetime"
                    />
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="备注">
                    <qqt-input v-model="collectionPayment.remark" :readonly="!isShowElement" @input="collectionPayment.remark = $event" />
                </el-form-item>
            </el-col>
        </el-form>
    </el-row>
</template>

<script>
    import { qqtInput, qqtSelect, qqtRadio } from '@/components/qqt-subassembly'
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
                default: () => {}
            }
        },

        components: {
            'qqt-input': qqtInput
        },

        data () {
            return {
                collectionPayment: {
                    incomeExpensesCapital: '零',
                    thissettleCapital: '零',
                    thispayprice: '0',
                    thissettle: '0',
                    thisprice: '0',
                    rectime: '',
                    paytime: '',
                    remark: ''
                }
            }
        },

        methods: {

            updataIncomeExpenditure (money, state) {
                switch (state) {
                    case 1:
                        this.collectionPayment.thissettle = money
                        this.collectionPayment.thissettleCapital = util.convertCurrency (money)
                        break
                    case 2:
                        this.collectionPayment.thisprice = money
                        this.collectionPayment.incomeExpensesCapital = util.convertCurrency (money)
                        break
                    case 3:
                        this.collectionPayment.thispayprice = money
                        this.collectionPayment.incomeExpensesCapital = util.convertCurrency (money)
                        break
                }
            },

            updataContractTheMoney (money) {
                this.updataIncomeExpenditure (money + '', 1)
                this.updataIncomeExpenditure (money + '', this.isIncome ? 2 : 3)
            },

            updataCollectionPayment (data) {
                const { thispayprice, thissettle, thisprice, paytime, rectime, remark } = data
                let item = { thispayprice: thispayprice + '', thissettle: thissettle + '', thisprice: thisprice + '', paytime, rectime, remark,
                    incomeExpensesCapital: util.convertCurrency (this.isIncome ? thisprice : thispayprice),
                    thissettleCapital: util.convertCurrency (thissettle) }
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
            }
        },

        created () {
            if (this.data.id) this.updataCollectionPayment (this.data)
        }
    }
</script>
<style lang="scss">
    .collection-payment-information {
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
                border-left-color: transparent;
                border-right-color: transparent;
            }
        }
        .collection-payment-information-color {
            input {
                color: $color-danger;
                text-align: center
            }
        }
        .el-input__inner {
            border-color: $color-border-1;
        }
    }
</style>