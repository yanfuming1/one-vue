<template>
    <el-row>
        <el-form :model="industrialInformation" ref="industrial" :rules="rules" label-width="160px" size="medium">
            <el-col :span="8" v-show="isregist == '0'">
                <el-form-item label="统一社会信用代码:" prop="creditcode">
                    <qqt-input v-model="industrialInformation.creditcode" :isShowElement="isShowElement" @input="industrialInformation.creditcode = $event"></qqt-input>
                </el-form-item>
            </el-col>
            <el-col :span="8" v-show="isregist == '0'">
                <el-form-item label="注册地址:" prop="detailaddress">
                    <qqt-cascader
                        v-model="industrialInformation.detailaddress"
                        :options="cityJson"
                        :isShowElement="isShowElement"
                        :defaultParams="detailaddressParams"
                        @cascaded="industrialInformation.detailaddress = $event"
                    >
                    </qqt-cascader>
                </el-form-item>
            </el-col>
            <el-col :span="8" v-show="isregist == '0'">
                <el-form-item label="注册资金:" prop="registeredCapital">
                    <qqt-input v-model="industrialInformation.registeredCapital" :isMoneyType="true" :isShowElement="isShowElement" btnTitle="万元" @input="emitRegisteredCapital"></qqt-input>
                </el-form-item>
            </el-col>
            <el-col :span="8" v-show="isregist == '0'">
                <el-form-item label="纳税人资格:" prop="taxpayerqualification">
                    <qqt-select v-model="industrialInformation.taxpayerqualification" :isShowElement="isShowElement" :defaultProp="defaultProp" :options="taxpayerqualificationOptions" @select="industrialInformation.taxpayerqualification = $event"></qqt-select>
                </el-form-item>
            </el-col>
            <el-col :span="8" v-show="isregist == '0'">
                <el-form-item label="税务征收方式:" prop="financialAccountingWay">
                    <qqt-select v-model="industrialInformation.financialAccountingWay" :isShowElement="isShowElement" :options="financialAccountingWayOptions" @select="industrialInformation.financialAccountingWay = $event"></qqt-select>
                </el-form-item>
            </el-col>
            <el-col :span="8" v-show="isregist == '0'">
                <el-form-item label="财税记账方式:" prop="financialManagementWay">
                     <qqt-select v-model="industrialInformation.financialManagementWay" :isShowElement="isShowElement" :options="financialManagementWayOptions" @select="industrialInformation.financialManagementWay = $event"></qqt-select>
                </el-form-item>
            </el-col>
            <el-col :span="24" v-show="isregist == '0'">
                <el-divider content-position="left">
                    <div class="generate-from-divider___line"></div>
                    股东构成
                </el-divider>
                <qqt-relate-table :data="industrialInformation.shareholder" ref="shareholder" @change="estimateRegisteredCapital" :rowHeader="shareholderHeader" :isShowDetails="!isShowElement"/>
            </el-col>
        </el-form>
    </el-row>
</template>

<script>
    import { CITYJSON } from '../../../../enum/CTIYS'
    import { qqtSelect, qqtCascader, qqtInput, qqtRelateTable } from '../../../../components/qqt-subassembly'
    export default {

        props: {
            taxpayerqualificationOptions: Array,
            isShowElement: {
                type: Boolean,
                default: true
            },
            industrialInformation: {
                type: Object,
                default: () => {
                    return {
                        creditcode: '',
                        detailaddress: [],
                        registeredCapital: '',
                        taxpayerqualification: '',
                        financialAccountingWay: '',
                        financialManagementWay: '',
                        shareholder: []
                    }
                }
            },
            isregist: {
                type: String,
                default: () => '1'
            }
        },

        components: {
            'qqt-input': qqtInput,
            'qqt-select': qqtSelect,
            'qqt-cascader': qqtCascader,
            'qqt-relate-table': qqtRelateTable
        },

        data () {
            return {
                cityJson: CITYJSON,
                rules: {
                    
                    'creditcode': [
                        { required: true, pattern: /^\w+$/, message: '统一社会信用代码不能为空', trigger: 'blur' }
                    ],
                    'detailaddress': [
                        { required: true, message: '注册地址不能为空', trigger: 'change' }
                    ],
                    'registeredCapital': [
                        { required: true, message: '注册资金不能为空', trigger: 'blur' }
                    ],
                    'taxpayerqualification': [
                        { required: true, message: '纳税人资格不能为空', trigger: 'change' }
                    ],
                    'financialAccountingWay': [
                        { required: true, message: '税务征收方式不能为空', trigger: 'change' }
                    ],
                    'financialManagementWay': [
                        { required: true, message: '财税记账方式不能为空', trigger: 'change' }
                    ],
                },
                detailaddressParams: {
                    value: 'label',
                    label: 'label'
                },
                defaultProp: {
                    value: 'name',
                    label: 'name'
                },
                financialAccountingWayOptions: [
                    {
                        value: '1',
                        label: '核定征收'
                    },
                    {
                        value: '2',
                        label: '查账征收'
                    }
                ],
                financialManagementWayOptions: [
                    {
                        value: '1',
                        label: '总公司记账'
                    },
                    {
                        value: '2',
                        label: '自行记账'
                    }
                ],
                shareholderHeader: [],
            }
        },

        methods: {

            emitRegisteredCapital (money) {
                this.industrialInformation.registeredCapital = money
                this.shareholderUpdate (money)
            },

            verify () {
                let required = false
                if (this.$refs && this.$refs.industrial) {
                    this.$refs.industrial.validate(valid => {
                        let share = this.$refs.shareholder.verify ()
                        if (!valid) {
                            required = false
                        }
                        if (share) {
                            this.industrialInformation['shareholder'] = share
                            const { creditcode, detailaddress, registeredCapital, taxpayerqualification,
                                financialAccountingWay, financialManagementWay, shareholder } = this.industrialInformation
                            required = { creditcode, detailaddress, registeredCapital, taxpayerqualification, 
                                financialAccountingWay, financialManagementWay, shareholder }
                        } else {
                            required = false
                        }
                    })
                }
                return required
            },

            shareholderUpdate (data) {
                this.shareholderHeader = [
                    {
                        prop: 'line1',
                        label: '股东',
                        isShow: true,
                        type: 'text',
                        required: true
                    },
                    {
                        prop: 'line2',
                        label: '出资额',
                        isShow: true,
                        type: 'money',
                        btnTitle: '万元',
                        required: true
                    },
                    {
                        prop: 'line3',
                        label: '出资比例',
                        isShow: true,
                        type: 'total',
                        controlRow: 'line2 /' + (parseFloat(data) || undefined ) + '* 100',
                        btnTitle: '%',
                        isInverseCalculation: true
                    },
                    {
                        prop: 'line4',
                        label: '出资方式',
                        isShow: true,
                        type: 'select',
                        options: this.$route.params.capitalWay || [],
                        defaultProp: {
                            value: 'name',
                            label: 'name'
                        },
                        required: true
                    }
                ]
            },

            estimateRegisteredCapital (data, prop, value) {
                switch (prop) {
                    case 'line2':
                        if (!this.industrialInformation.registeredCapital) this.$message.warning ('注册资金不能为空')
                        break;
                }
            },

            resetiIndustrialInformation () {
                return this.industrialInformation = {
                    creditcode: '',
                    detailaddress: [],
                    registeredCapital: '',
                    taxpayerqualification: '',
                    financialAccountingWay: '',
                    financialManagementWay: '',
                    shareholder: []
                }
            }
        },

        created () {
            this.shareholderUpdate ()
        },

        watch: {
            industrialInformation (val) {
                if (val.registeredCapital) {
                    this.shareholderUpdate (val.registeredCapital)
                }
            }
        }
    }
</script>

<style lang='scss' scoped>

</style>
