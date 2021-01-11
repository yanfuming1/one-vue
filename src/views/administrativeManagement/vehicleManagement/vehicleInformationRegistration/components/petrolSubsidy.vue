<template>
    <div>
        <el-drawer  v-if="addOilSupplement"
            :title="title"
            direction="rtl"
            size="30%"
            :visible.sync="visible"
            :before-close="handleClose">
            <div>
                <div class="add-oil-supplement">
                    <el-form :model="addOilSupplementData">
                    <el-row>
                        <el-col>
                            <el-form-item label="车辆性质:" label-width="100px">
                                <el-input :disabled="true" v-model="addOilSupplementData.natureVehicle"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <el-form-item label="车辆归属:" label-width="100px">
                                <el-input :disabled="true" v-model="addOilSupplementData.vehicles"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <el-form-item label="车牌号:" label-width="100px" >
                                <el-input :disabled="true" v-model="addOilSupplementData.licensePlateNumber"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <el-form-item label="排量:" label-width="100px">
                                <el-input :disabled="true" v-model="addOilSupplementData.displacement"></el-input>                          
                            </el-form-item>
                        </el-col>
                    </el-row>
                    </el-form>   
                </div>
                
                <div class="add-oil-supplement-from">
                    <fm-generate-form
                        :data="jsonData"
                        :value="values"    
                        :transform="transform"
                        ref="generateForm"/>
                </div>
                
            </div>

            <div class="demo-drawer__footer">
                <el-button type="primary"  size="small" @click="prePubilshDialog">确定</el-button>
                <el-button  size="small" @click="$emit('change')">取 消</el-button>
            </div>
        </el-drawer>

        <el-drawer v-else
            :title="title"
            direction="rtl"
            size="50%"
            :visible.sync="visible"
            :before-close="handleClose">
            <div>
                <div class="history-fuel-consumption">
                    <el-form :model="addOilSupplementData">
                        <el-row>
                            <el-col :span="10" :offset='1'>
                                <el-form-item label="车辆性质:" label-width="80px">
                                    <el-input :disabled="true" v-model="addOilSupplementData.natureVehicle"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10" :offset='2'>
                                <el-form-item label="车辆归属:" label-width="80px">
                                    <el-input :disabled="true" type="small" v-model="addOilSupplementData.vehicles"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10" :offset='1'>
                                <el-form-item label="车牌号:" label-width="80px" >
                                    <el-input :disabled="true" v-model="addOilSupplementData.licensePlateNumber"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10" :offset='2'>
                                <el-form-item label="排量:" label-width="80px">
                                    <el-input :disabled="true" v-model="addOilSupplementData.displacement"></el-input>                          
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>   
                </div>

                <div class="history-fuel-consumption-tab">
                    <qqt-table :data="historyFuelConsumptionData" :option="tableOption" 
                        :dynamicHeader="dynamicHeader" :rowHeader="rowHeader" :isShowSelection="isShowSelection" 
                        :pageShow="pageShow" :isShowGroup="isShowGroup"></qqt-table>
                </div>
            </div>

        </el-drawer>
    </div>
</template>

<script>
import { ADMINISTRATIVEMANAGEMENT } from '../../../../../enum/FORMCODE'
import { formGetJson } from '../../../../../api/system/fromManagement/index'
import util from '@/libs/util.js'
import { getUserDepartById } from '../../../../../api/system/depart/depart'
import { editVehicleInformation, vehicleInformationQueryById, informationRegistrationList, historyFuelConsumption } from '../../../../../api/administrativeManagement/vehicleManagement/vehicleInformationRegistration'
import qqtTable from "../../../../../components/qqt-subassembly/qqt-table/qqt-table"
export default {
    props:{
        title: String,
        addOilSupplement:{
            type: Boolean,
            default: true
        },
        addPetrolSubsidy:{
            type: Boolean,
            default: true
        },
        rowDatas: Object
    },
    data () {
        return {
            visible: false,

            values:{
                department: ''
            },
            jsonData: {},
            transform: {
                isShowDetails: false
            },

            
            // 添加油补
            addOilSupplementData: {
                natureVehicle: '',
                vehicles: '',
                licensePlateNumber: '',
                displacement: '',
            },

            // 油补历史
            historyFuelConsumptionData: {
                records: []
            },
            tableOption: {
                border: false
            },
            isShowSelection: false,
            pageShow: false,
            isShowGroup:false,
            getinformationRegistrationState: true,

            dynamicHeader: {
                tableId: 'T_1020820778',
                isSave: false
            },
            rowHeader: [
                {
                    prop: 'allowances',
                    label: '油价（km/元）',
                    isShow:true,
                },
                {
                    prop: 'effectiveDate',
                    label: '生效时间',
                    isShow:true
                },
                {
                    prop: 'createName',
                    label: '添加人',
                    isShow:true
                },
                {
                    prop: 'department',
                    label: '添加部门',
                    isShow:true
                },
                {
                    prop: 'createTime',
                    label: '添加时间',
                    isShow:true
                },
            ],
        };
    },

    methods: {
        getFormByJson () {
            formGetJson ({'code': ADMINISTRATIVEMANAGEMENT.ADDOILSUPPLEMENTFROM}).then(res => {
                if (res) {
                    this.jsonData = JSON.parse(res)
                }
            })
        },

        getinformationRegistrationList () {
            // 如果不是增加油耗状态
            historyFuelConsumption({
                vehicleInformationId: this.addOilSupplementData.id
            }).then (res => {
                this.historyFuelConsumptionData.records = res
            })
        },

        getresignationQueryPersonalDataID () {
            getUserDepartById({ 
                userId: util.cookies.get ('uuid')
            }).then( res => {
                console.log(res)
                
                res.forEach( m => {
                    console.log(res.length)
                    res.length !== '1' ? this.values.department = m.name : this.values.department = m.name + ','
                })
            })
        },
        
        prePubilshDialog () {
            this.$refs.generateForm.getData().then(item => {
                if (item) { 
                    item['id'] = this.addOilSupplementData.id
                    editVehicleInformation(item).then( res => {
                        this.$message.success("添加成功")
                        this.handleClose()
                    }).catch( err => {
                        this.$message.error("添加失败")
                    })
                }
            })
        },

        handleClose () {
            this.$emit ('change')
        },

        
    },

    mounted () {
        this.visible = this.addPetrolSubsidy
    },
    
    created() {
        this.getFormByJson ()
    },

    components: {
        "qqt-table": qqtTable
    },

    watch : {
        addPetrolSubsidy() {
            this.visible = this.addPetrolSubsidy
            this.addOilSupplementData = this.rowDatas
            this.getinformationRegistrationState = this.addOilSupplement
            switch (this.addOilSupplementData.natureVehicle) {
                case '1' :
                    this.addOilSupplementData.natureVehicle = '公司车辆'
                break
                case '2' :
                    this.addOilSupplementData.natureVehicle = '个人车辆'
                break
            }

            // 如果有 id 时，通过 id 去获取抽屉里的数据
            if(this.addOilSupplementData.id) {
                vehicleInformationQueryById ({
                    id: this.addOilSupplementData.id
                }).then( res => {
                    this.getresignationQueryPersonalDataID ()
                    console.log(res)
                    this.values =  res
                })
            }

            // 油耗历史去查询列表
            if (!this.addOilSupplement) {
                this.getinformationRegistrationList ()
            }
        }
        
    }
}
</script>

<style scoped lang="scss">
    .add-oil-supplement{
        padding: 12px 32px
    }
    .add-oil-supplement-from {
        padding: 0 32px;
        margin-top: 12px
    }
    
    .history-fuel-consumption {
        padding: 12px 32px
    }
    .history-fuel-consumption-tab {
        padding: 10px 32px;
    }
    .demo-drawer__footer {
        text-align: center
    }
</style>