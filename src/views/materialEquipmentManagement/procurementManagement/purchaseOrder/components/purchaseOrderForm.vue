<template>
    <el-row class="purchaseOrder">
        <el-form :model="data" ref="purchaseOrder" :rules="rules" label-width="150px" size="medium">
            <el-col :span="8">
                <el-form-item label="结算方式:" prop="meansPaymentsId">
                    <qqt-select :value="data.meansPaymentsId" :isShowElement="isShowElement" :defaultProp="defaultProp" :options="meansPaymentsOptions" @select="getFieldName ($event, 1)" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="退换货期限:" prop="returnPeriodId">
                    <qqt-select :value="data.returnPeriodId" :isShowElement="isShowElement" :defaultProp="defaultProp" :options="returnPeriodList" @select="getFieldName ($event, 5)" />
                </el-form-item>
            </el-col>
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
                <el-form-item label="开票金额:" prop="invoiceAmount">
                    <qqt-input v-model="data.invoiceAmount" :isMoneyType="true" btnTitle="元" :isShowElement="isShowElement" @blur="getFieldName ($event, 6)" />
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="data.invoice == '1'">
                <el-form-item label="税 率:" prop="taxRate">
                    <qqt-input v-model="data.taxRate" :isMoneyType="true" btnTitle="%" :isShowElement="isShowElement" @blur="getFieldName ($event, 7)" />
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="data.invoice == '1'">
                <el-form-item label="税 额:">
                    <qqt-input v-model="data.taxAmount" :isMoneyType="true" btnTitle="元" :isShowElement="false" @input="data.taxAmount = $event" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="项目类型:">
                    <qqt-select :value="data.projectType" :isShowElement=" $route.params.identification == '1' || data ? false : true " :options="projectTypeOptions" @select="getFieldName ($event, 4)" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="关联项目:">
                    <qqt-select :value="data.relevanceProjectId" :isShowElement=" $route.params.identification == '1' || data ? false : true " :defaultProp="projectProp" :options="relatedProjectsOptions" @select="getFieldName ($event, 3)" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="标段:">
                    <qqt-input v-model="data.section" :isShowElement="false" />
                </el-form-item>
            </el-col>
            <el-col :span="data.invoice == '1' ? 16 : 24">
                <el-form-item label="摘 要:">
                    <qqt-input v-model="data.digest" :isShowElement="isShowElement" @input="data.digest = $event" />
                </el-form-item>
            </el-col>
        </el-form>
    </el-row>
</template>

<script>
    import { getUserDepartById } from '../../../../../api/system/depart/depart'
    import { qqtInput, qqtSelect, qqtRadio } from '../../../../../components/qqt-subassembly'
    import { getAllSelfProject, getAllJointProject } from '../../../../../api/jointProject/index'
    import { getMyPurchaseTaskList, getPurchaseTaskById } from '../../../../../api/materialEquipmentManagement/procurementManagement/purchaseTask'
    import util from '@/libs/util.js'
    export default {

        props: {
            contract: {
                type: Object,
                default: () => {}
            },
            isShowElement: {
                type: Boolean,
                default: true
            },
            meansPaymentsOptions: {
                type: Array,
                default: () => []
            },
            invoiceTypeOptions: {
                type: Array,
                default: () => []
            },
            returnPeriodList: {
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
                    relevanceProjectId: '',
                    meansPaymentsId: '',
                    returnPeriodId: '',
                    invoiceTypeId: '',
                    invoiceAmount: '',
                    projectType: '',
                    createName: util.cookies.get ('username'),
                    createTime: '',
                    department: '',
                    taxAmount: '',
                    invoice: '0',
                    taxRate: '',
                    digest: '',
                    section: ''
                },
                rules: {
                    meansPaymentsId: [
                        { required: true, message: '结算方式不能为空', trigger: 'change' }
                    ],
                    returnPeriodId: [
                        { required: true, message: '退换货期限不能为空', trigger: 'change' }
                    ],
                    invoice: [
                        { required: true, message: '是否开具发票不能为空', trigger: 'change' }
                    ],
                    invoiceTypeId: [
                        { required: true, message: '发票类型不能为空', trigger: 'change' }
                    ],
                    invoiceAmount: [
                        { required: true, message: '开票金额不能为空', trigger: 'blur' }
                    ],
                    taxRate: [
                        { required: true, message: '税 率不能为空', trigger: 'blur' }
                    ],
                    department: [
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
                taskList: [],
                departmentList: [],
                relatedProjectsOptions: []
            }
        },

        methods: {

            verify () {
                let required = false
                this.$refs.purchaseOrder.validate(valid => {
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
                        this.data.meansPaymentsId = value
                        item = this.meansPaymentsOptions.find (f => f.id == value)
                        if (item) this.data['meansPayments'] = item.name
                        break
                    case 2:
                        this.data.invoiceTypeId = value
                        item = this.invoiceTypeOptions.find (f => f.id == value)
                        if (item) this.data['invoiceType'] = item.name
                        break
                    case 3:
                        this.data.relevanceProjectId = value
                        item = this.relatedProjectsOptions.find (f => f.id == value)
                        if (item) this.data['relevanceProject'] = item.projectName, this.data['section'] = item.section
                        break
                    case 4:
                        this.data.relevanceProjectId = this.data.relevanceProject = this.data.section = '', this.data.projectType = value
                        this.screenProjectTypeToProjectList (value)
                        break
                    case 5:
                        this.data.returnPeriodId = value
                        item = this.returnPeriodList.find (f => f.id == value)
                        if (item) this.data['returnPeriod'] = item.name
                        break
                    case 6:
                        this.data.invoiceAmount = value
                        this.data.taxAmount = (Number (value) / (1 + Number (this.data.taxRate)) * Number (this.data.taxRate)).toFixed (2)
                        break
                    case 7:
                        this.data.taxRate = value
                        this.data.taxAmount = (Number (this.data.invoiceAmount) / (1 + Number (value)) * Number (value)).toFixed (2)
                        break
                    case 8:
                        this.data.department = value
                        item = this.departmentList.find (f => f.id == value)
                        if (item) this.data['departmentName'] = item.name
                        break
                }
            },

            screenProjectTypeToProjectList (type) {
                switch (type) {
                    case '1':
                        this.getAllSelfProjectList ()
                        break
                    case '2':
                        this.getAllJointProjectList ()
                        break
                    default:
                        this.relatedProjectsOptions = []
                        break
                }
            },

            getAllSelfProjectList () {
                getAllSelfProject ().then (res => {
                    if (res instanceof Array) {
                        res.forEach (item => { item['id'] = item.projectCode, item['section'] = item.sectionDic })
                        this.relatedProjectsOptions = res
                    }
                })
            },

            getAllJointProjectList () {
                getAllJointProject ().then (res => {
                    if (res instanceof Array) this.relatedProjectsOptions = res
                })
            },

            getDepIdByUserIdList (id) {
                getUserDepartById({'userId': id}).then(res => {
                    if (res && res.length > 0) this.departmentList = res
                    if (res.length == 1) this.data.department = res[0].id, this.data['departmentName'] = res[0].name
                })
            }
        },

        created () {
            this.getDepIdByUserIdList (util.cookies.get ('uuid'))
        },

        watch: {
            contract (val) {
                this.screenProjectTypeToProjectList (val.projectType)
                Object.assign (this.data, val)
            }
        }
    }
</script>
<style lang="scss">
    .purchaseOrder {
        .el-col-8 {
            height: 58px !important;
        }
    }
</style>