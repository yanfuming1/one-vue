<template>
    <el-row class="purchaseContract">
        <el-form :model="data" ref="purchaseContract" :rules="rules" label-width="150px" size="medium">
            <el-col :span="8">
                <el-form-item label="合同来源:" prop="sourceContractId">
                    <qqt-select :value="data.sourceContractId" :isShowElement="isShowElement" :defaultProp="defaultProp" :options="sourceContractOptions" @select="getFieldName ($event, 6)" />
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="data.sourceContractId == '1'">
                <el-form-item label="任务单名称:" prop="taskId">
                    <qqt-select :value="data.taskId" v-if="isShowElement" :isShowElement="isShowElement" :defaultProp="taskProp" :options="taskList" @select="getFieldName ($event, 7)" />
                    <qqt-input v-model="data.taskName" v-if="!isShowElement" :isShowElement="false" @input="data.taskNumber = $event" />
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="data.sourceContractId == '1'">
                <el-form-item label="任务单编号:" prop="taskNumber">
                    <qqt-input v-model="data.taskNumber" :isShowElement="false" @input="data.taskNumber = $event"></qqt-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="结算方式:" prop="meansPaymentsId">
                    <qqt-select :value="data.meansPaymentsId" :isShowElement="isShowElement" :defaultProp="defaultProp" :options="meansPaymentsOptions" @select="getFieldName ($event, 1)" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="合同有效期:" prop="contractLife">
                    <el-date-picker 
                        value-format="yyyy-MM-dd"
                        :class="{'isShowDetails': !isShowElement}"
                        :disabled="!isShowElement"
                        v-model="data.contractLife"
                        type="date" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="到货日期:" prop="deliveryDate">
                    <el-date-picker 
                        value-format="yyyy-MM-dd"
                        :class="{'isShowDetails': !isShowElement}"
                        :disabled="!isShowElement"
                        v-model="data.deliveryDate"
                        type="date" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="合同总金额:" prop="contractAmount">
                    <qqt-input v-model="data.contractAmount" :isMoneyType="true" btnTitle="元" :isShowElement="isShowElement" @input="getFieldName ($event, 5)"></qqt-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="大 写:">
                    <qqt-input v-model="data.bigWrite" :isShowElement="false" @input="data.bigWrite = $event"></qqt-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="是否开具发票:" prop="invoice">
                    <qqt-radio v-model="data.invoice" :options="invoiceList" :isShowElement="isShowElement" @radio="data.invoice = $event" />
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="data.invoice == '1'">
                <el-form-item label="发票类型:">
                    <qqt-select :value="data.invoiceTypeId" :isShowElement="isShowElement" :defaultProp="defaultProp" :options="invoiceTypeOptions" @select="getFieldName ($event, 2)" />
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="data.invoice == '1'">
                <el-form-item label="税 种:" prop="taxCategoriesId">
                    <qqt-select :value="data.taxCategoriesId" :isShowElement="isShowElement" :defaultProp="defaultProp" :options="taxCategoriesOptions" @select="getFieldName ($event, 8)" />
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="data.invoice == '1'">
                <el-form-item label="税 率:">
                    <qqt-input v-model="data.taxRate" :isMoneyType="true" btnTitle="%" :isShowElement="isShowElement" @input="data.taxRate = $event, calculateTaxAmount()" />
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="data.invoice == '1'">
                <el-form-item label="税 额:">
                    <qqt-input v-model="data.taxAmount" :isMoneyType="true" btnTitle="元" :isShowElement="false" @input="data.taxAmount = $event" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="关联类型:">
                    <qqt-select :value="data.projectType" :isShowElement=" $route.params.identification == '1' ? false : data.sourceContractId == '0' ? true : false " :options="projectTypeOptions" @select="getFieldName ($event, 4)" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="关联项目:">
                    <qqt-select :value="data.relevanceProjectId" :isShowElement=" $route.params.identification == '1' ? false : data.sourceContractId == '0' ? true : false  " :defaultProp="projectProp" :options="relatedProjectsOptions" @select="getFieldName ($event, 3)" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="标段:">
                    <qqt-input v-model="data.section" :isShowElement="false" />
                </el-form-item>
            </el-col>
            <el-col :span="data.sourceContractId == '1' ? data.invoice == '0' ? 24 : 16 : data.invoice == '1' ? 8 : 16">
                <el-form-item label="付款条件:">
                    <qqt-input v-model="data.paymentClause" :isShowElement="isShowElement" @input="data.paymentClause = $event" />
                </el-form-item>
            </el-col>
        </el-form>
    </el-row>
</template>

<script>
    import { qqtInput, qqtSelect, qqtRadio } from '../../../../../components/qqt-subassembly'
    import { getAllSelfProject, getAllJointProject } from '../../../../../api/jointProject/index'
    import { getMyPurchaseTaskList, getPurchaseTaskById } from '../../../../../api/materialEquipmentManagement/procurementManagement/purchaseTask'
    import util from '@/libs/util.js'
    import { mapState } from 'vuex'
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
            taxCategoriesOptions: {
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
                    sourceContractId: '0',
                    relevanceProjectId: '',
                    taxCategoriesId: '',
                    meansPaymentsId: '',
                    contractAmount: '',
                    invoiceTypeId: '',
                    contractLife: '',
                    deliveryDate: '',
                    projectType: '',
                    taskNumber: '',
                    taxAmount: '',
                    taskName: '',
                    bigWrite: '',
                    invoice: '0',
                    taxRate: '',
                    remark: '',
                    taskId: '',
                    section: ''
                },
                rules: {
                    sourceContractId: [
                        { required: true, message: '合同来源不能为空', trigger: 'blur' }
                    ],
                    taskNumber: [
                        { required: true, message: '任务单编号不能为空', trigger: 'blur' }
                    ],
                    taskName: [
                        { required: true, message: '任务单名称不能为空', trigger: 'blur' }
                    ],
                    meansPaymentsId: [
                        { required: true, message: '结算方式不能为空', trigger: 'change' }
                    ],
                    invoice: [
                        { required: true, message: '是否开具发票不能为空', trigger: 'change' }
                    ],
                    taskId: [
                        { required: true, message: '采购合同不能为空', trigger: 'change' }
                    ],
                    contractAmount: [
                        { required: true, message: '合同金额不能为空', trigger: 'blur' }
                    ],
                    contractLife: [
                        { required: true, message: '合同有效期不能为空', trigger: 'change' }
                    ],
                    deliveryDate: [
                        { required: true, message: '到货日期不能为空', trigger: 'change' }
                    ],
                    taxCategoriesId: [
                        { required: true, message: '税 种不能为空', trigger: 'change' }
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
                taskProp: {
                    value: 'id',
                    label: 'taskName'
                },
                sourceContractOptions: [
                    {
                        id: '1',
                        name: '采购任务'
                    },
                    {
                        id: '0',
                        name: '无'
                    }
                ],
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
                relatedProjectsOptions: []
            }
        },

        methods: {

            verify () {
                let required = false
                this.$refs.purchaseContract.validate(valid => {
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
                        this.data.contractAmount = value
                        this.data.bigWrite = util.convertCurrency (value)
                        this.calculateTaxAmount ()
                        this.$emit ('contractAmount', value)
                        break
                    case 6:
                        this.data.sourceContractId = value
                        this.data.sourceContractId == '1' ? this.getMyAllTask () : this.$route.params.identification != '1' ? this.updataData () : this.proprietaryProjectType ()
                        break
                    case 7:
                        this.data.taskId = value
                        this.getSonPurchaseTaskById (this.data.taskId, true)
                        break
                    case 8:
                        this.data.taxCategoriesId = value
                        item = this.taxCategoriesOptions.find (f => f.id == value)
                        if (item) this.data['taxCategories'] = item.name
                        break
                }
            },

            getMyAllTask () {
                getMyPurchaseTaskList ().then (res => {
                    if (this.data.id) {
                        let item = res.find (f => f.id == this.data.taskId)
                        if (!item) res.push ({ id: this.data.taskId, taskName: this.data.taskName })
                    }
                    this.taskList = res
                    if(this.$route.params.identification == '1' || (this.$route.params.identification == '1' && this.data.sourceContractId == '0')) this.proprietaryProjectType ()
                })
            },

            proprietaryProjectType () {
                this.data.projectType = '自营'
                this.data.relevanceProjectId = this.selfSupportProject.projectName
                this.data['projectName'] = this.selfSupportProject.projectName
                this.data.section = this.selfSupportProject.sectionDic
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

            getSonPurchaseTaskById (id, boolean) {
                getPurchaseTaskById ({'id': id}).then (res => {
                    if (res) {
                        const { relevanceProjectId, relevanceProject, projectType, section, taskName, taskCode: taskNumber, id: taskId } = res
                        let item = { relevanceProjectId, relevanceProject, projectType, section, taskNumber, taskName, taskId }
                        // item.projectType == '2' ? this.getAllJointProjectList () : this.getAllSelfProjectList ()
                        this.screenProjectTypeToProjectList (item.projectType)
                        Object.assign (this.data, item)
                        this.data.sourceContractId = '1'
                        this.$emit ('moduleId', id)
                        this.$emit ('isResetMaterialList', boolean)
                    }
                })
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

            calculateTaxAmount () {
                if (this.data.invoice == '0') return
                this.data.taxAmount = (Number.parseFloat (this.data.contractAmount) / (1 + (Number.parseFloat (this.data.taxRate) * 0.01)) * (Number.parseFloat (this.data.taxRate) * 0.01)).toFixed (2)
            },

            updataData () {
                this.data.taskId = this.data.relevanceProjectId = this.data.section = this.data.taskNumber = ''
                this.$emit ('moduleId', '')
            }
        },

        created () {
            if (this.$route.params && this.$route.params.isTaskDecomposition) {
                this.getSonPurchaseTaskById (this.$route.params.dataSource.id, false)
            }
            this.getMyAllTask ()
            if(this.$route.params.identification == '1') this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad')
        },
        
        computed: {
            ...mapState ('d2admin/selfSupportProject', [
                'selfSupportProject'
            ])
        },

        watch: {
            contract (val) {
                this.screenProjectTypeToProjectList (val.projectType)
                if (val.id) util.setObjval (this.data, val)
            }
        }
    }
</script>
<style lang="scss">
    .purchaseContract {
        .el-col-8 {
            height: 58px !important;
        }
    }
</style>