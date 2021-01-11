<template>
    <el-dialog
        v-dialogDrag
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="70%"
        :before-close="handleClose">
        <div>
            <fm-generate-form
                :data="jsonData"
                :value="generate"
                :transform="transform"
                ref="generateForm">
                <template slot="contactInformation" v-if="this.identification !== '3' && this.identification !== '1' ? true : false">
                    <el-form :model="values" :rules="rules" ref="form" label-width="120px">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="联系人" prop="linkman">
                                    <el-input v-model="values.linkman" :disabled="transform.isShowDetails" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="联系方式" prop="phone">
                                    <el-input v-model="values.phone" :disabled="transform.isShowDetails"  onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </template>
                <template slot="natureAccount" v-if="this.identification == '4' || this.identification == '7' ? true : false">
                    <el-form :model="values" :rules="rules" ref="form" label-width="120px">
                        <el-row>
                            <el-col>
                                <el-form-item label="账户性质" prop="nature">
                                    <el-select v-model="values.nature" placeholder="请选择" style='width:100%' :disabled="transform.isShowDetails">
                                        <el-option
                                        v-for="item in options"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </template>
                <template slot="taxpayerIdentificationNumber" v-if="this.identification == '4' || this.identification == '7' ? true : false">
                    <el-form :model="values" :rules="rules" ref="form" label-width="120px">
                        <el-row>
                            <el-col>
                                <el-form-item label="纳税人识别号" prop="untitled1">
                                    <el-input v-model="values.untitled1" :disabled="transform.isShowDetails" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </template>
            </fm-generate-form>
            <bottomInformation :values="generate" :fieldTitle="'设置'" :timeTitle="'设置'" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button v-if="!transform.isShowDetails" type="primary" @click="saveBankAccountForm">保 存</el-button>
            <el-button type="info" size="small" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
            <el-button  @click="$emit('change')">取 消</el-button>
        </span>
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </el-dialog>
</template>

<script>
import { formGetJson } from '@/api/system/fromManagement/index'
import { FINANCIALMANAGEMENT } from '@/enum/FORMCODE'
import bottomInformation from '../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
import * as elValudate from "./dataValidation"
import * as elValudateTaxpayerCode from "./taxpayerCode" 
import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
import { queryDicById } from '@/api/system/dic/dic'
import { FINANCE } from '@/enum/DICTIONARY'
import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
import printTemplateByHtml from '@/views/systemManagement/printTemplate/components/printTemplateByHtml'

export default {
    props: {
        identification: String,
        dialogTitle: String,
        dialogVisible: {
            type: Boolean,
            default: false
        },
        data: {
            type: Object,
            default: () => {}
        },
        transform: {
            type: Object,
            default: () => {}
        }
    },
    components: {
        bottomInformation,
        'print-template-by-html': printTemplateByHtml
    },

    data () {
        return {
            title:'',
            values:{
                linkman: '',
                phone: '',
                nature: '',
                untitled1: ''
            },
            fieldTitle: '设置',
            timeTitle: '设置',
            generate: {},
            options: [],
            jsonData: {},
            rules: {
                nature: [{ required: true, message: "请输入账户性质", trigger: ["blur",'change'] }],
                linkman: [{ required: true, message: "请输入联系人", trigger: ["blur",'change'] }],
                phone: [{validator:elValudate.elValidatePhoneAll, required: true, message: "请输入正确的联系方式", trigger:  ["blur",'change'] }],
                untitled1: [{ validator:elValudateTaxpayerCode.taxpayerCode, required: true, message: '请输入正确的纳税号', trigger:  ["blur",'change']}]
            },
            code: BASICSCODE.SYS_BANK_ACCOUNT
        }
    },

    methods: {
        handleClose () {
            this.$emit ('change')
        },
        printTemplate () {
            getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.generate.id }).then(res => {
                if (res) this.$refs.printTemp.printTemplate (res)
            })
        },
        getFormByJson () {
            formGetJson ({'code': FINANCIALMANAGEMENT.BANKACCOUNTFORM}).then(res => {
                if (res) {
                    this.jsonData = JSON.parse(res)
                }
            })
        },

        saveBankAccountForm () {
            let item = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData ().then (data => {
                if(this.$refs.form) {
                    this.$refs.form.validate((valid) => {
                        if (item && data && valid) {
                            this.$emit ('saveBankAccountForm', Object.assign (data, this.values, item))
                        }
                    })
                    return
                }
                if (item && data) {
                    this.$emit ('saveBankAccountForm', Object.assign (data, this.values, item))
                }
            })
        },
        
        getQueryDicByIdList () {
            queryDicById ({id: FINANCE.NATUREACCOUNT}).then (list => {
                if (list && list.length > 0) {
                    this.options = list
                }
            })
        }
    },

    created () {
        this.generate = Object.assign ({}, this.generate, this.data)
        const { linkman, phone, nature, untitled1 } = this.data
        let data = { linkman, phone, nature, untitled1 }
        Object.assign (this.values, data)
        this.getQueryDicByIdList ()
        this.getFormByJson ()
    },
}
</script>