<template>
    <d2-container>
        <div slot="header" class="vehicle-information-registration">
            <el-form :inline="true" :model="form" ref="form" size="mini">
                <el-form-item v-if="$has ('vehicleInformation:list:add')">
                    <el-button type="primary" @click="addInformationRegistrationEvent">添加</el-button>
                </el-form-item>
                <el-form-item label prop="name">
                    <el-input v-model="form.keywords" prefix-icon="el-icon-search" placeholder="请输入需搜索的内容" style="width: 200px;"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="dataSearch">搜索</el-button>
                </el-form-item>
                <el-form-item>
                    <el-date-picker
                        size="mini"
                        v-model="createDate"
                        type="datetimerange"
                        :picker-options="pickerOptions"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至" 
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['08:00:00', '18:00:00']"
                        @change="dataSearch()" 
                        align="right">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="info" @click="resetBtn">重置</el-button>
                </el-form-item>
                <el-form-item>
                    <span>
                        <span>车辆性质:</span>
                        <qqt-select style="display: inline-block;padding-left: 10px;" :value="natureVehicle" :options="options" :size="'mini'" :placeholder="'请选择'" @select="natureVehicle = $event, dataSearch()"></qqt-select>
                    </span>
                </el-form-item> 
                <el-form-item>
                    <el-button-group>
                        <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                    </el-button-group>
                </el-form-item>
            </el-form>
        </div>
        
        <div class="vehicle-information-registration-tab">
            <qqt-table :data="informationRegistrationData" ref="table" :option="tableOption" :dynamicHeader="dynamicHeader" :rowHeader="rowHeader" @selectionChange="selectChange" @page="handlePaginationChange"></qqt-table>
        </div>

        

    </d2-container>

</template>


<script>
import { qqtTable, qqtSelect } from '@/components/qqt-subassembly'
import { informationRegistrationList, vehicleInformationQueryById, delVehicleInformation } from '../../../../../api/administrativeManagement/vehicleManagement/vehicleInformationRegistration'
import util from '@/libs/util.js'
export default {
    data () {
        return {
            form: {
                keywords:''
            },
            natureVehicle: '',
            options: [
                {
                    value: '1',
                    label: '公司车辆'
                },
                {
                    value: '2',
                    label: '个人车辆'
                }
            ],
            // 时间搜索
            createDate: [],
            pickerOptions: {
                shortcuts: [
                    {
                        text: '最近一周',
                        onClick (picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, 
                    {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, 
                    {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }
                ]
            },

            transform: {
                isShowDetails: false
            },
            informationRegistrationData: { },
            tableOption: {
                border: false
            },
            page: {
                current: 1,
                size: 10,
                total: 0
            },
            dynamicHeader: {
                tableId: 'T_1020820776',
                isSave: false
            },

            // petrolSubsidyTitle: '',
            // addPetrolSubsidyDialog: false,
            // addOilSupplement: false,
            // rowDatas: {},

            rowHeader: [
                {
                    prop: 'vehicles',
                    label: '车主',
                    isShow:true 
                },
                {
                    prop: 'licensePlateNumber',
                    label: '车牌号',
                    isShow:true,
                    render: (h, params) => {
                        return h('el-button', {
                            style: {
                                color: '#3ba5ff'
                            },
                            attrs: {
                                type: 'text'
                            },
                            on: {
                                click: (index, row) => {
                                    this.rowData = params.row
                                    this.transform.isShowDetails = true
                                    this.$router.push({
                                        path: 'addInformationRegistration',
                                        name: 'addInformationRegistration',
                                        params: {
                                            isDetails: true,
                                            transform: this.transform,
                                            id: params.row.id
                                        }
                                    })
                                }
                            }
                        }, params.row.licensePlateNumber)
                    }
                },
                {
                    prop: 'natureVehicleName',
                    label: '车辆性质',
                    isShow:true,
                    render: (h, parms) => {
                        return h('div', {},
                            parms.row.natureVehicleName = parms.row.natureVehicle === '1' ? '公司车辆' : parms.row.natureVehicle === '2' ? '个人车辆' : parms.row.natureVehicle === '3' ? '社会车辆' : '其它'
                        )
                    }
                },
                {
                    prop: 'displacement',
                    label: '排量',
                    isShow:true
                },
                {
                    prop: 'createName',
                    label: '登记人',
                    isShow:true
                },
                {
                    prop: 'createTime',
                    label: '登记时间',
                    isShow:true
                },
                {
                    prop: "",
                    label: "操作",
                    isShow: true,
                    width:'350',
                    render:(h, params) => {
                        return [
                            this.$has ('vehicleInformation:list:edit') ? h("el-button",{
                                props: {
                                    type: "text"
                                },
                                on: {
                                    click: (index, row) => {
                                        this.rowData = params.row
                                        this.transform.isShowDetails = false
                                        this.$router.push({
                                            path: 'addInformationRegistration',
                                            name: 'addInformationRegistration',
                                            params: {
                                                transform: this.transform,
                                                id: params.row.id
                                            }
                                        })
                                    }
                                }
                            },"编辑") : '',

                            this.$has ('vehicleInformation:list:delete') ? h("el-button",{
                                props: {
                                    type: "text"
                                },
                                on: {
                                    click: () => {
                                        util.confirm ().then (res => {
                                            if (res) {
                                                delVehicleInformation({
                                                    id: params.row.id
                                                }).then( res => {
                                                    this.$message.success("删除成功")
                                                    this.getInformationRegistrationList ()
                                                }).catch( err => {
                                                    this.$message.success("删除失败")
                                                })
                                            }
                                        })
                                    }
                                }
                            },"删除") : '',

                        ];
                    },
                },
            ],
            multipleSelection : []
        }
    },
    methods: {
        addInformationRegistrationEvent () {
            this.$router.push({
                path: 'addInformationRegistration',
                name: 'addInformationRegistration',
                params: {
                    isAdd : true
                }
            })
        },

        dataSearch (boolean = true) {
            if (boolean) this.resetPage ()
            this.getInformationRegistrationList ({
                'name': this.form.keywords ? this.form.keywords : null,
                'natureVehicle': this.natureVehicle ? this.natureVehicle : null,
                'createTime': this.createDate ? this.createDate[0] : null,
                'updateTime':this.createDate ? this.createDate[1] : null
            })
        },
        
        resetBtn () {
            this.form.keywords = this.natureVehicle =  '',
            this.createDate = []
            this.resetPage ()
            this.getInformationRegistrationList ()
        },

        getInformationRegistrationList (item) {
            informationRegistrationList({
                ...item,
                pageNo: this.page.current,
                pageSize: this.page.size
            }).then( res => {
                this.informationRegistrationData = res
            })
        },

        // 复选框选中的数据
        selectChange (val) {
            this.multipleSelection = val
        },

        // 分页变化改动
        handlePaginationChange(val) {
            this.page = val;
            this.$nextTick(() => {
                this.dataSearch(false)
            });
        },

        printTable () {
            this.$refs.table.printTable (this.multipleSelection)
        },

        resetPage () {
            this.page = {
                current: 1,
                size: 10,
                total: 0
            }
        }
    },
    mounted() {
        this.getInformationRegistrationList ()
    },
    components: {
        "qqt-table": qqtTable,
        'qqt-select': qqtSelect
    },
}
</script>

<style lang="scss" scoped>

    .vehicle-information-registration{
        margin-bottom: -20px;
    }
    .vehicle-information-registration-tab{
        box-shadow: 0 2px 12px 0 $color-border-shadow;
        background: $color-bg3;
        height: 102%;
        margin-top: -15px
    }
</style>