<template>
    <el-row class="entrepotSinceBy">
        <el-form :model="data" ref="entrepot" :rules="rules" label-width="120px" size="medium">
            <el-col :span="8">
                <el-form-item label="服务项目类型:">
                    <qqt-select :value="data.projectType" :isShowElement="isShowElement" :options="projectTypeOptions" @select="getFieldName ($event, 11)" />
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="data.projectType != ''">
                <el-form-item label="项目名称:" prop="projectId">
                    <qqt-select :value="data.projectId" :isShowElement="isShowElement" :defaultProp="defaultProjectProp" :options="projectList" @select="getFieldName ($event, 12)" />
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="data.projectType != ''">
                <el-form-item label="标段:">
                     <qqt-input v-model="data.sectionName" :isShowElement="false" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="仓库形式:" prop="categoryId">
                    <qqt-select :value="data.categoryId" :isShowElement="isShowElement" :options="categoryOptions" @select="getFieldName ($event, 1)" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="仓库分类:">
                    <qqt-cascader :value="data.parentList" :options="entrepotOption" :isShowElement="isShowElement" :defaultParams="defaultCandidates" @cascaded="data.parentList = $event" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="存货分类:">
                    <qqt-cascader :value="data.inventoryCategoryIds" :options="inventoryCategoryOption" :isShowElement="isShowElement" :defaultParams="defaultCandidates" @cascaded="data.inventoryCategoryIds = $event, data.inventoryCategoryId = JSON.stringify ($event)" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="仓库地址:" prop="addressIds">
                    <qqt-cascader
                        v-model="data.addressIds"
                        :options="cityJson"
                        :isShowElement="isShowElement"
                        :defaultParams="cityJsonParams"
                        @cascaded="getAddress"
                    >
                    </qqt-cascader>
                </el-form-item>
            </el-col>
            <el-col :span="data.projectType != '' ? 16 : 8">
                <el-form-item label="详细地址:" prop="detailedAddress">
                    <qqt-input v-model="data.detailedAddress" :isShowElement="isShowElement" @input="data.detailedAddress = $event" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="仓库面积:" prop="area">
                    <qqt-input v-model="data.area" :isShowElement="isShowElement" btnTitle="m²" @input="data.area = $event" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="仓库容积:" prop="volume">
                    <qqt-input v-model="data.volume" :isShowElement="isShowElement" btnTitle="m³" @input="data.volume = $event" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="仓库结构:" prop="structureId">
                    <qqt-select :value="data.structureId" :isShowElement="isShowElement" :defaultProp="defaultProp" :options="structureOptions" @select="getFieldName ($event, 2)" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="仓库所属:" prop="affiliation">
                    <qqt-select :value="data.affiliation" :isShowElement="isShowElement" :options="affiliationOptions" @select="getFieldName ($event, 3)" />
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="data.affiliation == '2'">
                <el-form-item label="出 租 方:" prop="rent">
                    <qqt-input v-model="data.rent" :isShowElement="isShowElement" @input="data.rent = $event"></qqt-input>
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="data.affiliation == '2'">
                <el-form-item label="联 系 人:" prop="contacts">
                    <qqt-input v-model="data.contacts" :isShowElement="isShowElement" @input="data.contacts = $event"></qqt-input>
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="data.affiliation == '2'">
                <el-form-item label="联系电话:" prop="phone">
                    <qqt-input v-model="data.phone" :isShowElement="isShowElement" @input="data.phone = $event"></qqt-input>
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="data.affiliation == '2'">
                <el-form-item label="租金标准:" prop="charterMoney">
                    <qqt-input
                        v-model="data.charterMoney"
                        :isShowElement="isShowElement"
                        :select="{ value: data.rentStandardId, defaultProp: defaultProp, options: rentStandardOptions }"
                        @inputSelect="getFieldName ($event, 4)"
                        @input="data.charterMoney = $event, calculationTotal ()"></qqt-input>
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="data.affiliation == '2'">
                <el-form-item label="租赁数量:" prop="leaseNumber">
                    <qqt-input
                        v-model="data.leaseNumber"
                        :isShowElement="isShowElement"
                        :select="{ value: data.unitMeasurement, defaultProp: defaultProp, options: unitMeasurementOptions }"
                        @inputSelect="getFieldName ($event, 5)"
                        @input="data.leaseNumber = $event, calculationTotal ()"></qqt-input>
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="data.affiliation == '2'">
                <el-form-item label="租赁期限:" prop="deadlines">
                    <el-date-picker 
                        value-format="yyyy-MM-dd"
                        :class="{'isShowDetails': !isShowElement}"
                        :disabled="!isShowElement"
                        v-model="data.deadlines"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期" />
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="data.affiliation == '2'">
                <el-form-item label="租金合计:" prop="rentAmount">
                    <qqt-input v-model="data.rentAmount" :isShowElement="false" @input="data.rentAmount = $event"></qqt-input>
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="data.affiliation == '2'">
                <el-form-item label="水电费:" prop="utilityBillsId">
                    <qqt-select :value="data.utilityBillsId" :isShowElement="isShowElement" :options="partyChargesOptions" @select="getFieldName ($event, 6)" />
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="data.affiliation == '2'">
                <el-form-item label="物业费:" prop="propertyFeeId">
                    <qqt-select :value="data.propertyFeeId" :isShowElement="isShowElement" :options="partyChargesOptions" @select="getFieldName ($event, 7)" />
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="data.affiliation == '2'">
                <el-form-item label="第三方费用:" prop="partyChargesId">
                    <qqt-select :value="data.partyChargesId" :isShowElement="isShowElement" :options="partyChargesOptions" @select="getFieldName ($event, 8)" />
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="data.affiliation == '2'">
                <el-form-item label="租金收款人:" prop="rentPayee">
                    <qqt-input v-model="data.rentPayee" :isShowElement="isShowElement" @input="data.rentPayee = $event" />
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="data.affiliation == '2'">
                <el-form-item label="开户行:" prop="proceedsBank">
                    <qqt-input v-model="data.proceedsBank" :isShowElement="isShowElement" @input="data.proceedsBank = $event" />
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="data.affiliation == '2'">
                <el-form-item label="账号:" prop="proceedsNumber">
                    <qqt-input v-model="data.proceedsNumber" :isShowElement="isShowElement" @input="data.proceedsNumber = $event" />
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="data.affiliation == '2'">
                <el-form-item label="租赁经办人:" prop="leasingAgentId">
                    <qqt-select :value="data.leasingAgentId" :isShowElement="isShowElement" :defaultProp="defaultProp" :options="allUser" @select="getFieldName ($event, 9)" />
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="data.affiliation == '2'">
                <el-form-item label="工作部门:" prop="leasingDepartmentId">
                    <qqt-select :value="data.leasingDepartmentId" :isShowElement="isShowElement" :defaultProp="defaultProp" :options="departmentList" @select="getFieldName ($event, 10)" />
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="data.affiliation == '2'">
                <el-form-item label="联系电话:">
                    <qqt-input v-model="data.leasingPhone" :isShowElement="false" />
                </el-form-item>
            </el-col>
            <el-col :span="data.affiliation == '1' ? 16 : 8">
                <el-form-item label="摘 要:">
                    <qqt-input v-model="data.remark" :isShowElement="isShowElement" @input="data.remark = $event" />
                </el-form-item>
            </el-col>
        </el-form>
        
    </el-row>
</template>

<script>
    import { CITYJSON } from '../../../../../enum/CTIYS'
    import { qqtCascader, qqtInput, qqtSelect } from '../../../../../components/qqt-subassembly'
    import { getMaterialDepotTree } from '../../../../../api/materialEquipmentManagement/basicInformation/materialDepot'
    import { getAllSelfProject, getAllJointProject } from '../../../../../api/jointProject/index'
    import { staffQueryById,staffStaffDictionary } from '@//api/system/staff/staff'
    import { getUserDepartById } from '@/api/system/depart/depart'
    import { mapState } from 'vuex'
    export default {

        props: {
            entrepotSinceBy: Object,
            projectTypeOptions: {
                type: Array,
                default: () => [
                    {
                        value: '1',
                        label: '自营'
                    },
                    {
                        value: '2',
                        label: '联营'
                    }
                ]
            },
            categoryOptions: {
                type: Array,
                default: () => [
                    {
                        value: '1',
                        label: '封闭式'
                    },
                    {
                        value: '2',
                        label: '开放式'
                    },
                    {
                        value: '3',
                        label: '半封闭式'
                    }
                ]
            },
            affiliationOptions: {
                type: Array,
                default: () => [
                    {
                        value: '1',
                        label: '自建'
                    },
                    {
                        value: '2',
                        label: '租赁'
                    }
                ]
            },
            rentStandardOptions: {
                type: Array,
                default: () => []
            },
            entrepotOption: {
                type: Array,
                default: () => []
            },
            structureOptions: {
                type: Array,
                default: () => []
            },
            partyChargesOptions: {
                type: Array,
                default: () => [
                    {
                        value: '1',
                        label: '无'
                    },
                    {
                        value: '2',
                        label: '包含在租金内'
                    },
                    {
                        value: '3',
                        label: '据实另算'
                    },
                    {
                        value: '4',
                        label: '其它'
                    }
                ]
            },
            unitMeasurementOptions: {
                type: Array,
                default: () => []
            },
            isShowElement: {
                type: Boolean,
                default: true
            }
        },

        components: {
            'qqt-input': qqtInput,
            'qqt-select': qqtSelect,
            'qqt-cascader': qqtCascader
        },

        data () {
            return {
                cityJson: CITYJSON,
                data: {
                    inventoryCategoryIds: [],
                    leasingDepartmentId: '',
                    detailedAddress: '',
                    unitMeasurement: '',
                    rentStandardId: '',
                    utilityBillsId: '',
                    proceedsNumber: '',
                    partyChargesId: '',
                    leasingAgentId: '',
                    propertyFeeId: '',
                    charterMoney: '0',
                    proceedsBank: '',
                    leasingPhone: '',
                    structureId: '',
                    projectName: '',
                    projectType: '2',
                    affiliation: '1',
                    leaseNumber: '0',
                    sectionName: '',
                    rentAmount: '',
                    addressIds: [],
                    parentList: [],
                    categoryId: '',
                    rentPayee: '',
                    projectId: '',
                    deadlines: '',
                    contacts: '',
                    volume: '',
                    area: '',
                    rent: '',
                    phone: '',
                    remark: ''
                },
                rules: {
                    'rent': [
                        { required: true, message: '出租方不能为空', trigger: 'blur' }
                    ],
                    'contacts': [
                        { required: true, message: '联系人不能为空', trigger: 'blur' }
                    ],
                    'phone': [
                        { required: true, pattern: /^1(3|4|5|6|7|8|9)\d{9}$/, message: '请输入正确的联系方式', trigger: 'blur' }
                    ],
                    'rentAmount': [
                        { required: true, message: '租金合计不能为空', trigger: 'blur' }
                    ],
                    'deadline': [
                        { required: true, message: '租赁期限不能为空', trigger: 'change' }
                    ],
                    'adminName': [
                        { required: true, message: '仓库管理员不能为空', trigger: 'change' }
                    ],
                    'addressIds': [
                        { required: true, message: '仓库地址不能为空', trigger: 'change' }
                    ],
                    'categoryId': [
                        { required: true, message: '仓库形式不能为空', trigger: 'change' }
                    ],
                    'detailedAddress': [
                        { required: true, message: '详细地址不能为空', trigger: 'blur' }
                    ],
                    'area': [
                        { required: true, message: '仓库面积不能为空', trigger: 'blur' }
                    ],
                    'volume': [
                        { required: true, message: '仓库容积不能为空', trigger: 'blur' }
                    ],
                    'structureId': [
                        { required: true, message: '仓库机构不能为空', trigger: 'change' }
                    ],
                    'affiliation': [
                        { required: true, message: '仓库所属不能为空', trigger: 'change' }
                    ],
                    'charterMoney': [
                        { required: true, pattern: /^([0-9]*[1-9][0-9]*\.[0-9]*[1-9][0-9]+)|([0-9]*[1-9][0-9]*)$/, message: '租金标准不合法', trigger: 'change' }
                    ],
                    'unitMeasurement': [
                        { required: true, message: '计量单位不能为空', trigger: 'change' }
                    ],
                    'leaseNumber': [
                        { required: true, message: '租赁数量不能为空', trigger: 'blur' }
                    ],
                    'utilityBillsId': [
                        { required: true, message: '水电费不能为空', trigger: 'change' }
                    ],
                    'propertyFeeId': [
                        { required: true, message: '物业费不能为空', trigger: 'change' }
                    ],
                    'partyChargesId': [
                        { required: true, message: '第三方费用不能为空', trigger: 'change' }
                    ],
                    'rentPayee': [
                        { required: true, message: '租金收款人不能为空', trigger: 'change' }
                    ],
                    'proceedsBank': [
                        { required: true, message: '开户行不能为空', trigger: 'blur' }
                    ],
                    'proceedsNumber': [
                        { required: true, pattern: /^[0-9A-Z-]{12,20}$/, message: '账号不能为空', trigger: 'blur' }
                    ],
                    'leasingAgentId': [
                        { required: true, message: '租赁经办人不能为空', trigger: 'change' }
                    ],
                    'leasingDepartmentId': [
                        { required: true, message: '租赁经办人的工作部门不能为空', trigger: 'change' }
                    ],
                    'projectId': [
                        { required: true, message: '关联项目不能为空', trigger: 'change' }
                    ]
                },
                cityJsonParams: {
                    value: 'label',
                    label: 'label'
                },
                defaultProp: {
                    value: 'id',
                    label: 'name'
                },
                defaultCandidates: {
                    value: 'id',
                    label: 'name',
                    children: 'children',
                    checkStrictly: true
                },
                defaultProjectProp: {
                    value: 'id',
                    label: 'projectName'
                },
                inventoryCategoryOption: [],
                departmentList: [],
                projectList: [],
                allUser: []
            }
        },

        methods: {

            verify () {
                let required = false
                this.$refs.entrepot.validate(valid => {
                    if (!valid) {
                        required = false
                    } else {
                        required = true
                    }
                })
                if (required) {
                    this.data.deadline = JSON.stringify (this.data.deadlines)
                    return this.data
                }
            },

            getFieldName (value, state) {
                let item = {}, str = ''
                switch (state) {
                    case 1:
                        this.data.categoryId = value
                        item = this.categoryOptions.find (f => f.id == value)
                        if (item) this.data['categoryName'] = item.name
                        break
                    case 2:
                        this.data.structureId = value
                        item = this.structureOptions.find (f => f.id == value)
                        if (item) this.data['structure'] = item.name
                        break
                    case 3:
                        this.data.affiliation = value
                        break
                    case 4:
                        this.data.rentStandardId = value
                        item = this.rentStandardOptions.find (f => f.id == value)
                        if (item) this.data['rentStandard'] = item.name
                        break
                    case 5:
                        this.data.unitMeasurementId = value
                        item = this.unitMeasurementOptions.find (f => f.id == value)
                        if (item) this.data['unitMeasurement'] = item.name
                        break
                    case 6:
                        this.data.utilityBillsId = value
                        item = this.partyChargesOptions.find (f => f.value == value)
                        if (item) this.data['utilityBills'] = item.label
                        break
                    case 7:
                        this.data.propertyFeeId = value
                        item = this.partyChargesOptions.find (f => f.value == value)
                        if (item) this.data['propertyFee'] = item.label
                        break
                    case 8:
                        this.data.partyChargesId = value
                        item = this.partyChargesOptions.find (f => f.value == value)
                        if (item) this.data['partyCharges'] = item.label
                        break
                    case 9:
                        this.data.leasingAgentId = value
                        item = this.allUser.find (f => f.id == value)
                        if (item) this.data['leasingAgent'] = item.name, this.getDepIdByUserIdList (value), this.getStaffQueryById (value)
                        break
                    case 10:
                        this.data.leasingDepartmentId = value
                        item = this.departmentList.find (f => f.id == value)
                        if (item) this.data['leasingDepartment'] = item.name
                        break
                    case 11:
                        this.data.projectType = value
                        this.projectList = [], this.data.projectId = ''
                        value == '2' ? this.getAllJointProjectList () : this.getAllSelfProjectList ()
                        break;
                    case 12:
                        this.data.projectId = value
                        item = this.projectList.find (f => f.id == value)
                        if (item) this.data.projectName = item.projectName, this.data.sectionName = item.section
                        break
                }
            },

            getAddress (data) {
                this.data.addressIds = data
                this.data.address = ''
                this.data.addressId = JSON.stringify (data)
                data.forEach(element => {
                    this.data.address += element
                });
            },

            getMaterialDepotTreeList () {
                getMaterialDepotTree().then(result => {
                    if (result && result.length > 0) {
                        this.inventoryCategoryOption = result
                    }
                })
            },

            getDepIdByUserIdList (id) {
                getUserDepartById({'userId': id}).then(res => {
                    if (res && res.length > 0) this.departmentList = res
                    if (res.length == 1) this.data['leasingDepartmentId'] = res[0].id
                })
            },

            getStaffQueryById (id) {
                staffQueryById ({'id': id}).then (res => {
                    this.data.leasingPhone = res.phone
                })
            },

            getAllSelfProjectList () {
                getAllSelfProject ().then (res => {
                    if (res instanceof Array) {
                        res.forEach (item => { item['id'] = item.projectCode, item['section'] = item.sectionDic })
                        this.projectList = res
                    }
                })
            },

            getAllJointProjectList () {
                getAllJointProject ().then (res => {
                    if (res instanceof Array) this.projectList = res
                })
            },

            getStaffStaffDictionary () {
                staffStaffDictionary ().then (res => {
                    if (res instanceof Array) this.allUser = res
                })
            },

            calculationTotal () {
                this.data.rentAmount = (Number.parseFloat (this.data.charterMoney) * Number.parseFloat (this.data.leaseNumber)).toFixed (2)
            }
        },

        created () {
            if (!this.entrepotSinceBy.id) this.getAllSelfProjectList ()
            Object.assign (this.data, this.entrepotSinceBy)
            this.getMaterialDepotTreeList ()
            this.getStaffStaffDictionary ()
        },

        watch: {
            entrepotSinceBy: {
                deep: true,
                handler (val) {
                    if (val.id) {
                        val['addressIds'] = JSON.parse (val.addressId)
                        val['inventoryCategoryIds'] = JSON.parse (val.inventoryCategoryId)
                        val['deadlines'] = JSON.parse (val.deadline)
                        val['rentAmount'] = val.rentAmount + ''
                        if (val.affiliation == '2') this.getDepIdByUserIdList (val.leasingAgentId)
                        val.projectType == '2' ? this.getAllJointProjectList () : this.getAllSelfProjectList ()
                        this.data = val
                    }
                }
                
            }
        }
    }
</script>
<style lang="scss">
.entrepotSinceBy {
    .el-input-group__append, .el-input-group__prepend {
        border-radius: 0px !important;
    }
    .qqt-input .el-input-group__append div {
        width: 100px !important;
    }
    .el-col-8 {
        height: 58px !important;
    }
}
</style>