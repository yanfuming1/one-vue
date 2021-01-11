<template>
    <d2-container type="fulls">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="cancel"><i class="el-icon-close"></i></el-button>
            </div>
            <el-divider content-position="left">
                <div class="generate-from-divider___line" />
                基本信息
            </el-divider>
            <essential-information 
                :companytypeOptions="$route.params.companyType"
                :essentialInformation="values"
                ref="essentialInformation"
                :isShowElement="!transform.isShowDetails"
                @isregist="getIsRegist"
            />
            <industrial-information 
                :isregist="values.isregist"
                :industrialInformation="values"
                ref="industrialInformation"
                :taxpayerqualificationOptions="$route.params.taxPayerQuality"
                :isShowElement="!transform.isShowDetails"
            />
            <el-divider content-position="left">
                <div class="generate-from-divider___line" />
                备注
            </el-divider>
            <el-input type="textarea" v-model="values.remark" :disabled="transform.isShowDetails" :class="{ 'isShowDetails': transform.isShowDetails }"/>
            <bottomInformation :values="values" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
            <el-divider content-position="left">
                <div class="generate-from-divider___line" />
                费用缴纳登记
            </el-divider>
            <qqt-relate-table :data="values.taxregistration" :detailsCompulsoryShow="isPaymentFee" ref="taxregistration" :rowHeader="taxregistrationHeader" :isShowDetails="transform.isShowDetails"/>
            <div class="qqt-container-full-content___button">
                <el-button type="warning" v-if="!transform.isShowDetails" size="mini" @click="saveData ('0')">保存</el-button>
                <el-button type="primary" v-if="!transform.isShowDetails || isPaymentFee" size="mini" @click="saveData ('1')">提交</el-button>
                <el-button type="info" size="mini" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                <el-button size="mini" @click="cancel">关闭</el-button>
            </div>
        </el-card>
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </d2-container>
</template>

<script>
    import { COMPANY } from '../../../../enum/FORMCODE'
    import { CITYJSON } from '../../../../enum/CTIYS'
    import { constCompanyAdd, getConstCompanyQueryById, editConstCompany } from '../../../../api/officalDocument'
    import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
    import { qqtRelateTable } from '../../../../components/qqt-subassembly'
    import { BASICSCODE } from '../../../../enum/PRINTTEMPLATE'
    import { mapActions } from 'vuex'

    import bottomInformation from '../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
    import printTemplateByHtml from '../../../systemManagement/printTemplate/components/printTemplateByHtml'
    import essentialInformation from './essentialInformation'
    import industrialInformation from './industrialInformation'
    let that = this
    export default {
        name: "newCompany",

        components: {
            'industrial-information': industrialInformation,
            'essential-information': essentialInformation,
            'print-template-by-html': printTemplateByHtml,
            'bottomInformation': bottomInformation,
            'qqt-relate-table': qqtRelateTable
        },

        data () {
            return {
                jsonData: {},
                remoteFuncs: {
                    // 出资方式
                    getCapitalWay (resolve) {
                        resolve (that.$route.params.capitalWay)
                    },
                    // 公司类型
                    getCompayType (resolve) {
                        resolve (that.$route.params.companyType)
                    }
                },
                values: {
                    companytype: '',
                    managementarea: [],
                    stime: [],
                    location: [],
                    personCharge: '',
                    idnumber: '',
                    homeaddress: [],
                    contactnumber: '',
                    isregist: '1',
                    remark: '',
                    companyname: '',
                    creditcode: '',
                    detailaddress: [],
                    registeredCapital: '',
                    taxpayerqualification: '',
                    financialAccountingWay: '',
                    financialManagementWay: '',
                    taxregistration: [],
                    shareholder: [],
                    location: [],
                    homeaddress: []
                },
                transform: {
                    isShowDetails: true
                },
                code: BASICSCODE.ADMIN_OVERSEAS_INSTITUTIONS,
                isPaymentFee: false,
                taxregistrationHeader: [
                    {
                        prop: 'line1',
                        label: '缴纳费用名称',
                        isShow: true,
                        type: 'text',
                        required: true
                    },
                    {
                        prop: 'line2',
                        label: '缴纳费用标准',
                        isShow: true,
                        type: 'text',
                        required: true
                    },
                    {
                        prop: 'line3',
                        label: '缴纳金额',
                        isShow: true,
                        type: 'money',
                        btnTitle: '元',
                        required: true
                    },
                    {
                        prop: 'line4',
                        label: '缴纳时间',
                        isShow: true,
                        type: 'date',
                        required: true
                    },
                    {
                        prop: 'createName',
                        label: '登记人',
                        isShow: true,
                        type: 'text',
                        isShowDetails: true,
                        placeholder: '自动生成'
                    },
                    {
                        prop: 'createTime',
                        label: '登记时间',
                        isShow: true,
                        type: 'text',
                        isShowDetails: true,
                        placeholder: '自动生成'
                    },
                    {
                        prop: 'departmentName',
                        label: '登记部门',
                        isShow: true,
                        type: 'text',
                        isShowDetails: true,
                        placeholder: '自动生成'
                    }
                ]
            }
        },
        methods: {

            ...mapActions('d2admin/page', [
                'close',
            ]),

            cancel(){
                this.closeTag ()
            },

            saveData (num) {
                let element = this.$refs.bottomInformation.getData ()
                this.$refs.essentialInformation.verify ().then (data => {
                    if (data && element) {
                        Object.assign (data, element)
                        data['presestate'] = num
                        let item = this.neatenSaveData (data)
                        if (item) {
                            if (this.values.id == null) {
                                constCompanyAdd (item).then (res => {
                                    if (res.code === 200) {
                                        this.closeTag ()
                                        this.$message.success ('添加数据成功')
                                    } else {
                                        this.neatenData (item)
                                    }
                                })
                            } else {
                                item['id'] = this.values.id
                                editConstCompany (item).then (res => {
                                    if (res.code === 200) {
                                        this.closeTag ()
                                        this.$message.success ('修改成功')
                                    } else {
                                        this.neatenData (item)
                                    }
                                })
                            }
                        }
                    }
                })
            },

            getConstCompanyData (id) {
                getConstCompanyQueryById ({'id': id}).then (res => {
                    if (res) {
                        this.neatenData (res)
                        this.values = res
                    }
                })
            },

            neatenSaveData (data) {
                let industrial = false, taxregistration = []
                data.homeaddress = JSON.stringify (data.homeaddress)
                data.location = JSON.stringify (data.location)
                data.managementarea = JSON.stringify (data.managementarea)
                data.stime = JSON.stringify (data.stime)
                data.detailaddress =  JSON.stringify ([])
                console.log(data)

                taxregistration = this.taxregistrationVerify ()
                if (this.values.isregist != '1') {
                    industrial = this.$refs.industrialInformation.verify ()
                } else {
                    industrial = this.$refs.industrialInformation.resetiIndustrialInformation ()
                }
                
                if (industrial && taxregistration) {
                    delete data.detailaddress
                    delete data.shareholder
                    data.taxregistration = taxregistration
                    industrial.detailaddress = JSON.stringify (industrial.detailaddress)
                    return Object.assign ({}, data, industrial )
                } else {
                    return false
                }
                
            },

            taxregistrationVerify () {
                let tax = null, required = false
                tax = this.$refs.taxregistration.verify ()
                if (tax) {
                    required = JSON.parse (JSON.stringify (tax))
                } else {
                    required = false
                }
                return required
            },

            neatenData (data) {
                if (data.homeaddress && data.homeaddress.length > 0) {
                    data.homeaddress = JSON.parse (data.homeaddress)
                }
                if (data.location && data.location.length > 0) {
                    data.location = JSON.parse (data.location)
                }
                if (data.managementarea && data.managementarea.length > 0) {
                    data.managementarea = JSON.parse (data.managementarea)
                }
                if (data.detailaddress && data.detailaddress.length > 0) {
                    data.detailaddress = JSON.parse (data.detailaddress)
                }
                if (data.stime && data.stime.length > 0) {
                    data.stime = JSON.parse (data.stime)
                }
                data.taxregistration.forEach(element => { element['isShowDetails'] = true })
            },

            closeTag () {
                let tagName = this.$route.path
                let path = 'constituentCompany'
                this.close ({ tagName, path })
            },

            updataRouter () {
                if (this.$route.params) {
                    this.isPaymentFee = this.$route.params.isPaymentFee
                    if (this.$route.params.companyId) {
                        this.getConstCompanyData (this.$route.params.companyId)
                    }
                    this.transform.isShowDetails = this.$route.params.isShowDetails
                }
            },

            getIsRegist (isregist) {
                this.values.isregist = isregist
            },

            printTemplate () {
                getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.$route.params.companyId}).then(res => {
                    if (res) this.$refs.printTemp.printTemplate (res)
                })
            }
        },
        
        mounted() {
            that = this
        },

        created () {
            this.updataRouter ()
        }
    }
</script>
<style lang="scss">
    .box-card{
        .el-range-separator{ display: contents; }
    }
    .closeHeader {
        .el-input__inner {
            border-radius: 0px !important;
        }
        .constituent-company___remark {
            padding: 0 30px;
            .constituent-company___label {
                font-size: 14px;
                float: left;
                margin-left: -10px;
            }
            .constituent-company___right {
                margin-left: 60px
            }
        }
    }
</style>>