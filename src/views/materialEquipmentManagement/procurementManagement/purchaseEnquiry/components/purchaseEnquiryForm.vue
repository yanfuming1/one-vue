<template>
    <el-row class="purchaseEnquiry">
        <el-form :model="data" ref="purchaseEnquiry" :rules="rules" label-width="130px" size="medium">
            <el-col :span="8">
                <el-form-item label="是否开具发票:" prop="invoice">
                    <qqt-radio v-model="data.invoice" :options="invoiceList" :isShowElement="isShowElement" @radio="data.invoice = $event" />
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="data.invoice == '1'">
                <el-form-item label="发票类型:" prop="invoiceTypeId">
                    <qqt-select :value="data.invoiceTypeId" :isShowElement="isShowElement" :defaultProp="defaultProp" :options="invoiceTypeOptions" @select="getFieldName ($event, 2)" />
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="data.invoice == '1'">
                <el-form-item label="税 种:" prop="taxCategoriesId">
                    <qqt-select :value="data.taxCategoriesId" :isShowElement="isShowElement" :defaultProp="defaultProp" :options="taxCategoriesOptions" @select="getFieldName ($event, 1)" />
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="data.invoice == '1'">
                <el-form-item label="税 率:" prop="taxRate">
                    <qqt-input v-model="data.taxRate" :isMoneyType="true" btnTitle="%" :isShowElement="isShowElement" @input="data.taxRate = $event" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="询价方式:" prop="inquiryCategoryId">
                    <qqt-select :value="data.inquiryCategoryId" :isShowElement="isShowElement" :defaultProp="defaultProp" :options="inquiryCategoryOptions" @select="getFieldName ($event, 3)" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="项目类型:">
                    <qqt-select :value="data.projectType" :isShowElement="$route.params.identification == '1' ? false : isShowElement " :options="projectTypeOptions" @select="getFieldName ($event, 7)" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="关联项目:">
                    <qqt-select :value="data.relatedProjectsId" :isShowElement="$route.params.identification == '1' ? false : isShowElement " :defaultProp="projectProp" :options="relatedProjectsOptions" @select="getFieldName ($event, 5)" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="标段:">
                    <qqt-input v-model="data.section" :isShowElement="false" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="询价时间:" prop="inquiryTime">
                    <el-date-picker 
                        value-format="yyyy-MM-dd"
                        :class="{'isShowDetails': !isShowElement}"
                        v-model="data.inquiryTime"
                        :disabled="!isShowElement"
                        type="date"></el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="摘 要:">
                    <qqt-input v-model="data.digest" :isShowElement="isShowElement" @input="data.digest = $event" />
                </el-form-item>
            </el-col>
        </el-form>
    </el-row>
</template>

<script>
    import { qqtInput, qqtSelect, qqtRadio } from '../../../../../components/qqt-subassembly'
    import { getAllSelfProject, getAllJointProject } from '../../../../../api/jointProject/index'
    import util from '@/libs/util.js'
    export default {

        props: {
            enquiry: {
                type: Object,
                default: () => {}
            },
            isShowElement: {
                type: Boolean,
                default: true
            },
            invoiceTypeOptions: {
                type: Array,
                default: () => []
            },
            departmentList: {
                type: Array,
                default: () => []
            },
            taxCategoriesOptions: {
                type: Array,
                default: () => []
            },
            inquiryCategoryOptions: {
                type: Array,
                default: () => []
            }
        },

        components: {
            'qqt-radio': qqtRadio,
            'qqt-input': qqtInput,
            'qqt-select': qqtSelect
        },

        data () {
            return {
                data: {
                    relatedProjectsId: '',
                    inquiryCategoryId: '',
                    taxCategoriesId: '',
                    invoiceTypeId: '',
                    departmentId: '',
                    projectType: '1',
                    inquiryTime: '',
                    createTime: '',
                    taxAmount: '',
                    inquirer: util.cookies.get ('username'),
                    invoice: '0',
                    taxRate: '',
                    digest: '',
                    section: '',
                },
                rules: {
                    invoice: [
                        { required: true, message: '是否开具发票不能为空', trigger: 'change' }
                    ],
                    inquiryCategoryId: [
                        { required: true, message: '询价方式不能为空', trigger: 'change' }
                    ],
                    invoiceTypeId: [
                        { required: true, message: '发票类型不能为空', trigger: 'change' }
                    ],
                    taxCategoriesId: [
                        { required: true, message: '税 种不能为空', trigger: 'change' }
                    ],
                    taxRate: [
                        { required: true, message: '税 率不能为空', trigger: 'blur' }
                    ],
                    inquiryTime: [
                        { required: true, message: '询价时间不能为空', trigger: 'change' }
                    ],
                    departmentId: [
                        { required: true, message: '工作部门不能为空', trigger: 'change' }
                    ]
                },
                defaultProp: {
                    value: 'id',
                    label: 'name'
                },
                projectProp: {
                    value: 'id',
                    label: 'projectName'
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
                projectTypeOptions: [
                    {
                        value: '1',
                        label: '自营'
                    },
                    {
                        value: '2',
                        label: '联营'
                    }
                ],
                relatedProjectsOptions: []
            }
        },

        methods: {

            verify () {
                let required = false
                this.$refs.purchaseEnquiry.validate(valid => {
                    if (!valid) {
                        required = false
                    } else {
                        required = true
                    }
                })
                if (required) {
                    delete this.data.fileList, this.data.inquirySheetNumber, this.data.inquirySheetName
                    return JSON.parse (JSON.stringify (this.data))
                }
            },

            getFieldName (value, state) {
                let item = {}, str = ''
                switch (state) {
                    case 1:
                        this.data.taxCategoriesId = value
                        item = this.taxCategoriesOptions.find (f => f.id == value)
                        if (item) this.data['taxCategories'] = item.name
                        break
                    case 2:
                        this.data.invoiceTypeId = value
                        item = this.invoiceTypeOptions.find (f => f.id == value)
                        if (item) this.data['invoiceType'] = item.name
                        break
                    case 3:
                        this.data.inquiryCategoryId = value
                        item = this.inquiryCategoryOptions.find (f => f.id == value)
                        if (item) this.data['inquiryCategory'] = item.name
                        break
                    case 5:
                        this.data.relatedProjectsId = value
                        item = this.relatedProjectsOptions.find (f => f.id == value)
                        if (item) this.data['relatedProjects'] = item.projectName, this.data['section'] = item.section
                        break
                    case 6:
                        this.data.departmentId = value
                        item = this.departmentList.find (f => f.id == value)
                        if (item) this.data['departmentName'] = item.name
                        break
                    case 7:
                        this.data.relatedProjectsId = '', this.data.projectType = value
                        value == '2' ? this.getAllJointProjectList () : this.getAllSelfProjectList ()
                        break
                }
            },

            getAllSelfProjectList () {
                getAllSelfProject ().then (res => {
                    if (res instanceof Array) {
                        res.forEach (item => { 
                            item['id'] = item.projectCode, item['section'] = item.sectionDic 
                            if (this.$route.params.identification == '1') {this.data.section = item.sectionDic}
                        })
                        this.relatedProjectsOptions = res
                    }
                })
            },

            getAllJointProjectList () {
                getAllJointProject ().then (res => {
                    if (res instanceof Array) this.relatedProjectsOptions = res
                })
            }
        },

        created() {
            this.data['relatedProjectsId'] = this.$route.params.relatedProjectsId || ''
            this.getAllSelfProjectList ()
        },

        watch: {
            enquiry: {
                deep: true,
                handler (val) {
                    val.projectType == '2' ? this.getAllJointProjectList () : this.getAllSelfProjectList ()
                    Object.assign (this.data, val)
                }
            }
        }
    }
</script>
<style lang="scss">
    .purchaseEnquiry {
        .el-col-8 {
            height: 58px !important;
        }
        .el-input__inner,
        .el-input-group__append, .el-input-group__prepend{
            border-radius: 0px !important
        }
    }
</style>