<template>
    <el-row class="returned-goods-info-from">
        <el-form :model="data" ref="returnedGoodsInfo" :rules="rules" label-width="150px" size="medium">
            <el-col :span="8">
                <el-form-item label="退换货类型" prop="category">
                    <qqt-select :value="data.category" :isShowElement="isShowElement" :options="categoryOptions" @select="data.category = $event, updataRules ()" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item :label="data.category == '5' ? '换货单编号' : '退货单编号'">
                    <qqt-input v-model="data.code" :isShowElement="false" placeholder="自动生成" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item :label="data.category == '5' ? '换货单名称' : '退货单名称'" prop="name">
                    <qqt-input v-model="data.name" :isShowElement="isShowElement" @input="data.name = $event"/>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item :label="data.category == '5' ? '换货物品购买总价' : '退货物品购买总价'">
                    <qqt-input v-model="data.amountString" :isShowElement="false" placeholder="自动生成" :isMoneyType="true" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="入库状态" prop="storageStatus">
                    <qqt-select :value="data.storageStatus" :isShowElement="isShowElement && !$route.params.isOrder" :defaultProp="defaultProp" :options="storageStatusOptions" @select="getFieldName ($event, 5)" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="关联单据编号">
                    <qqt-input v-model="data.sourceCode" :isShowElement="false" ></qqt-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="关联单据名称" prop="sourceId">
                    <qqt-select :value="data.sourceId" v-if="isShowElement" :isShowElement="isShowElement && !$route.params.isOrder" :filterable="true" :defaultProp="sourceProp" :options="sourceNameArr" @select="getFieldName ($event, 4)" />
                    <qqt-input v-model="data.sourceName" v-if="!isShowElement" :isShowElement="false" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="存放仓库" :prop="data.storageStatus == '2' ? 'warehouseName' : ''">
                    <qqt-input v-model="data.warehouseName" :readonly="true" :isShowElement="isShowElement" @focus="$emit('warehouse')"></qqt-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="仓库地点" >
                    <qqt-input v-model="data.warehouseSite" :isShowElement="false" ></qqt-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="项目类型">
                    <qqt-select :value="data.projectType" :isShowElement="isShowElement" :options="projectTypeOptions" @select="getFieldName ($event, 2)" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="关联项目">
                    <qqt-select :value="data.projectId" :isShowElement="isShowElement" :defaultProp="projectProp" :options="projectOptions" @select="getFieldName ($event, 1)" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="标 段">
                    <qqt-input v-model="data.sectionName" :isShowElement="false" ></qqt-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item :label="data.category == '5' ? '换货后换货费用' : '退货后退款金额'" prop="money">
                    <qqt-input v-model="data.money" :isShowElement="isShowElement" btnTitle="元" :isMoneyType="true" @input="data.money = $event"></qqt-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item :label="data.category == '5' ? '换货运费' : '退货运费'" prop="freight">
                    <qqt-input v-model="data.freight" :isShowElement="isShowElement" btnTitle="元" :isMoneyType="true" @input="data.freight = $event"></qqt-input>
                </el-form-item>
            </el-col>
            <!-- <el-col :span="8">
                <el-form-item label="登记时间">
                    <el-date-picker 
                        value-format="yyyy-MM-dd"
                        :class="{'isShowDetails': !isShowElement}"
                        :disabled="!isShowElement"
                        v-model="data.registerTime"
                        type="date" />
                </el-form-item>
            </el-col> -->
            <el-col :span="8">
                <el-form-item label="摘 要">
                    <qqt-input v-model="data.remark" :isShowElement="isShowElement" @input="data.remark = $event" />
                </el-form-item>
            </el-col>
        </el-form>
    </el-row>
</template>

<script>
    import { qqtInput, qqtSelect, qqtRadio } from '../../../../../components/qqt-subassembly'
    import { selectPurchaseOrder } from '../../../../../api/materialEquipmentManagement/warehouseManagement/returnedGoods'
    import { getOtherWareHousesList } from '@/api/materialEquipmentManagement/warehouseManagement/otherWarehouses'
    import { getAllSelfProject, getAllJointProject } from '../../../../../api/jointProject/index'
    import { getUserDepartById } from '../../../../../api/system/depart/depart'

    import util from '@/libs/util.js'
    export default {

        props: {
            returnedGoods: {
                type: Object,
                default: () => {}
            },

            isShowElement: {
                type: Boolean,
                default: true
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
                    storageStatus: '2',
                    warehouseName: '',
                    warehouseSite: '',
                    departmentId: '',
                    registerTime: '',
                    amountString: '',
                    projectType: '',
                    createName: util.cookies.get ('username'),
                    sectionName: '',
                    sourceName: '',
                    sourceCode: '',
                    projectId: '',
                    sourceId: '',
                    category: '5',
                    freight: '',
                    remark: '',
                    bearer: '',
                    money: '',
                    name: ''
                },
                rules: {},
                defaultProp: {
                    value: 'id',
                    label: 'name'
                },
                sourceProp: {
                    value: 'id',
                    label: 'name'
                },
                projectProp: {
                    value: 'id',
                    label: 'projectName'
                },
                storageStatusOptions: [
                    {
                        id: '1',
                        name: '未入库'
                    },
                    {
                        id: '2',
                        name: '已入库'
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
                departmentNameArr: [], // 经办部门
                categoryOptions: [
                    {
                        value: '5',
                        label: '换货'
                    },
                    {
                        value: '6',
                        label: '退货'
                    }
                ],
                projectOptions: [],
                sourceNameArr: [], // 采购订单
                bearerOptions: [
                    {
                        value: '1',
                        label: '我方'
                    },
                    {
                        value: '2',
                        label: '对方'
                    }
                ]
            }
        },

        methods: {

            verify () {
                let required = false
                this.$refs.returnedGoodsInfo.validate(valid => {
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
                        this.data.projectId = value
                        item = this.projectOptions.find (f => f.id == value)
                        if (item) this.data['projectName'] = item.projectName, this.data['sectionName'] = item.section
                        break
                    case 2:
                        this.data.projectId = this.data.projectName = this.data.sectionName = '', this.data.projectType = value
                        this.screenProjectTypeToProjectList (value)
                    case 3:
                        this.data.departmentId = value
                        item = this.departmentNameArr.find (f => f.id == value)
                        if (item) this.data['departmentName'] = item.name
                        break
                    case 4:
                        this.data.sourceId = value
                        item = this.sourceNameArr.find (f => f.id == value)
                        if (item) {
                            // item.projectType == '2' ? this.getAllJointProjectList () : this.getAllSelfProjectList ()
                            const { name: sourceName, code: sourceCode, projectType, sectionName, projectId, projectName, warehouseId, warehouseName, warehouseSite } = item
                            let element = { sourceName, sourceCode, projectType, sectionName, projectId, projectName, warehouseId, warehouseName, warehouseSite }
                            Object.assign (this.data, element)
                        }
                        this.$emit ('moduleId', value)
                        this.$emit ('storageStatus', this.data.storageStatus)
                        this.$emit ('warehouseId', this.data.warehouseId)
                        break
                    case 5:
                        this.data.sourceId = ''
                        this.sourceNameArr = []
                        this.data.storageStatus = value
                        this.$emit('storageStatus', value)
                        this.screenStorageStatusToWareHouses (value)
                        break
                }
            },

            getAllSelfProjectList () {
                getAllSelfProject ().then (res => {
                    if (res instanceof Array) {
                        res.forEach (item => { item['id'] = item.projectCode, item['section'] = item.sectionDic })
                        this.projectOptions = res
                    }
                })
            },

            getAllJointProjectList () {
                getAllJointProject ().then (res => {
                    if (res instanceof Array) this.projectOptions = res
                })
            },

            getOtherWareHouses () {
                getOtherWareHousesList ({procState: 10}).then (res => {
                    if (res && res.length > 0) this.sourceNameArr = res
                })
            },

            // 采购订单
            getSelectPurchaseOrder () {
                selectPurchaseOrder ({procState: 10, inventoryStatus: '0,1'}).then(res =>{
                    if (res && res.length > 0) {
                        this.sourceNameArr = res
                        res.forEach(element => {
                            element['code'] = element.indentNumber
                            element['name'] = element.indentName
                            element['projectId'] = element.relevanceProjectId
                            element['projectName'] = element.relevanceProject
                            element['sectionName'] = element.section
                        });
                    }
                    if (this.$route.params.isOrder && this.$route.params.relevancyId) this.setSourceData (this.$route.params.relevancyId)
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
                        this.projectOptions = []
                        break
                }
            },

            screenStorageStatusToWareHouses (type) {
                switch (type) {
                    case '1':
                        this.getSelectPurchaseOrder ()
                        break
                    case '2':
                        this.getOtherWareHouses ()
                        break
                }
            },

            // 经办人
            getresignationQueryPersonalDataID (id) {
                getUserDepartById({userId: id}).then( res => {
                    if (res && res.length > 0) this.departmentNameArr = res
                    if (res.length == 1) this.data.departmentId = res[0].id, this.data['departmentName'] = res[0].name
                })
            },

            updataRules () {
                this.$emit ('category', this.data.category)
                this.rules =  {
                    storageStatus: [
                        { required: true, message: '入库状态不能为空', trigger: 'change' }
                    ],
                    sourceId: [
                        { required: true, message: '关联单据名称不能为空', trigger: 'change' }
                    ],
                    warehouseName: [
                        { required: true, message: '存放仓库不能为空', trigger: 'change' }
                    ],
                    departmentId: [
                        { required: true, message: '经办部门不能为空', trigger: 'change' }
                    ],
                    registerTime: [
                        { required: true, message: '登记时间不能为空', trigger: 'change' }
                    ],
                    bearer: [
                        { required: true, message: '承担方不能为空', trigger: 'change' }
                    ],
                    category: [
                        { required: true, message: '退换货类型不能为空', trigger: 'change' }
                    ],
                    money: [
                        { required: true, message: `${this.data.category == '5' ? '换货后换货费用不能为空' : '退货后退款金额不能为空' }`, trigger: 'change' }
                    ],
                    freight: [
                        { required: true, message: `${this.data.category == '5' ? '换货运费不能为空' : '退货运费不能为空'}`, trigger: 'change' }
                    ],
                    name: [
                        { required: true, message: `${this.data.category == '5' ? '换货单名称不能为空' : '退货单名称不能为空'}`, trigger: 'blur' }
                    ]
                }
            },

            setWarehouseData (item) {
                this.data.warehouseName = item.name
                this.data.warehouseSite = item.address + item.detailedAddress
            },

            setSourceData (id) {
                this.getFieldName (id, 4)
            },

            getSourceId () {
                return this.data.sourceId
            }
        },

        created () {
            if (this.$route.params && this.$route.params.isOrder) {
                this.data.storageStatus = '1'
                this.getSelectPurchaseOrder ()
            } else {
                this.data.storageStatus = '2'
                this.getOtherWareHouses ()
            }
            this.getresignationQueryPersonalDataID (util.cookies.get ('uuid'))
            this.updataRules ()
        },

        watch: {
            returnedGoods (val) {
                if (val.id) {
                    Object.assign (this.data, val)
                    this.screenStorageStatusToWareHouses (val.storageStatus)
                    this.screenProjectTypeToProjectList (val.projectType)
                    this.getresignationQueryPersonalDataID (val.createBy)
                }
            }
        }
    }
</script>
<style lang="scss">
    .returned-goods-info-from {
        .el-input__inner {
            border-radius: 0px !important
        }
        .el-col-8 {
            height: 58px !important;
        }
    }
</style>