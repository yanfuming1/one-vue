<template>
    <d2-container>
        <div slot="header" class="vehicle-use-registration">
                <el-form :inline="true" :model="form" ref="form" size="mini">
                <el-form-item  v-if="$has ('vehicleRegistration:list:add')">
                    <el-button type="primary" @click="addUseRegistrationEvent">用车申请</el-button>
                </el-form-item>
                <el-form-item label prop="name">
                    <el-input v-model="form.keywords" prefix-icon="el-icon-search" placeholder="请输入需搜索的内容" style="width: 200px;" />
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
                    <el-button-group>
                        <el-button size="mini" icon="el-icon-check" @click="reviewVehicleUseApplication">审核</el-button>
                        <el-button size="mini" icon="el-icon-close" @click="unReviewVehicleUseApplication">反审核</el-button>
                    </el-button-group>
                </el-form-item>
                <el-form-item v-if="$has('vehicleRegistration:list:delete')">
                    <el-button type="primary" @click="delBachVehicleUseRegistration">批量删除</el-button>
                </el-form-item>
                <el-form-item>
                    <span>车辆性质:</span>
                    <qqt-select style="display: inline-block;padding-left: 10px;width:110px" :value="natureVehicle" :options="options" :defaultProp="defaultProp" :size="'mini'" :placeholder="'请选择'" @select="natureVehicle = $event, dataSearch()"></qqt-select>
                </el-form-item>
                <el-form-item>
                    <span>办理状态:</span>
                    <qqt-select style="display: inline-block;padding-left: 10px;width:110px;" :value="procState" :options="procStateOptions" :size="'mini'" :placeholder="'请选择'" @select="procState = $event, dataSearch()"></qqt-select>
                </el-form-item>
                <el-form-item>
                    <span>审核状态:</span>
                    <qqt-select style="display: inline-block;padding-left: 10px;width:110px;" :value="state" :options="auditOptions" :size="'mini'" :placeholder="'请选择'" @select="state = $event, dataSearch()"></qqt-select>
                </el-form-item>
                <el-form-item>
                    <el-button-group>
                        <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                    </el-button-group>
                </el-form-item>
            </el-form>
        </div>
        
        <div class="vehicle-use-registration-tab">
            <qqt-table :data="useRegistrationData" ref="table" :option="tableOption" :dynamicHeader="dynamicHeader" :rowHeader="rowHeader" @selectionChange="selectChange" @page="handlePaginationChange"></qqt-table>
        </div>

    </d2-container>

</template>


<script>
import { qqtTable, qqtSelect } from '@/components/qqt-subassembly'
import { vehicleUseRegistrationList, delVehicleUseRegistration, reviewVehicleUse, deleteBatchVehicleUseRegistration } from '../../../../../api/administrativeManagement/vehicleManagement/vehicleUseRegistration'
import util from '@/libs/util.js'
export default {
    data () {
        return {
            form: {
                keywords:''
            },
            natureVehicle: '',
            procState: '',
            state: '',
            options: [
                {
                    id: '1',
                    name: '公司车辆'
                },
                {
                    id: '2',
                    name: '个人车辆'
                }
            ],
            procStateOptions: [
                {
                    value: '1',
                    label: '初始化'
                },
                {
                    value: '2',
                    label: '待审批'
                },
                {
                    value: '3',
                    label: '审批中'
                },
                {
                    value: '4',
                    label: '已驳回'
                },
                {
                    value: '5',
                    label: '已作废'
                },
                {
                    value: '6',
                    label: '待提交'
                },
                {
                    value: '10',
                    label: '已完结'
                }
            ],
            auditOptions: [
                {
                    value: '0',
                    label: '未审核'
                },
                {
                    value: '1',
                    label: '已审核'
                }
            ],
            defaultProp: {
                value: 'name',
                label: 'name'
            },
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
            useRegistrationData: { },
            tableOption: {
                border: false
            },
            page: {
                current: 1,
                size: 10,
                total: 0
            },
            dynamicHeader: {
                tableId: 'T_1020820774',
                isSave: false
            },
            multipleSelection: [],
            rowHeader: [
                {
                    prop: 'driver',
                    label: '驾驶人',
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
                                    this.transform.isShowDetails = true
                                    this.$router.push({
                                        path: 'addVehicleUseRegistration',
                                        name: 'addVehicleUseRegistration',
                                        params: {
                                            procInstId: params.row.procInstId,
                                            transform: this.transform,
                                            relevancyId: params.row.id
                                        }
                                    })
                                }
                            }
                        }, params.row.licensePlateNumber)
                    }
                },
                {
                    prop: 'transportTime',
                    label: '用车时间',
                    isShow:true,
                    width: '160'
                },
                {
                    prop: 'vehicles',
                    label: '车主',
                    isShow:true
                },
                {
                    prop: 'natureVehicle',
                    label: '车辆性质',
                    isShow:true
                },
                {
                    prop: 'carFor',
                    label: '用车事由',
                    isShow:true,
                    width: '160'
                },
                {
                    prop: 'procStateName',
                    label: '办理状态',
                    isShow:true,
                    render: (h,params) =>{
                        let text = '';
                        if (params.row.procState === '1') {
                            text = '初始化';
                        } else if (params.row.procState === '2') {
                            text = '待审批';
                        } else  if (params.row.procState === '3'){
                            text = '审批中';
                        } else  if (params.row.procState === '4'){
                            text = '已驳回';
                        } else  if (params.row.procState === '5'){
                            text = '已作废';
                        } else  if (params.row.procState === '10'){
                            text = '已完结';
                        }  else  if (params.row.procState === '6'){
                            text = '待提交';
                        } 
                            return h('div',{

                            }, params.row.procStateName = text)
                        }
                },
                {
                    prop: 'stateName',
                    label: '审核状态',
                    isShow:true,
                    width:'110',
                    render: (h,params) =>{
                        let text = '';
                        if (params.row.state === '0') {
                            text = '未审核';
                        } else if (params.row.state === '1') {
                            text = '已审核';
                        }
                        return h('div',{
                        
                        }, params.row.stateName = text)
                    }
                },
                {
                    prop: 'agent',
                    label: '待办人',
                    isShow:true
                },
                {
                    prop: 'createName',
                    label: '申请人',
                    isShow:true
                },
                {
                    prop: 'createTime',
                    label: '申请时间',
                    isShow:true,
                    width: '160'
                },
                {
                    prop: "",
                    label: "操作",
                    isShow: true,
                    fixed: 'right',
                    width: '110',
                    render:(h, params) => {
                        return [
                            this.$has ('vehicleRegistration:list:edit') ? h("el-button",{
                                props: {
                                    type: "text"
                                },
                                attrs: {
                                    disabled: params.row.procState === '1' ? false : true
                                },
                                style:{
                                    color: params.row.procState === '1'? '#409EFF' : '#999',
                                },
                                on: {
                                    click: (index, row) => {
                                        this.rowData = params.row
                                        this.transform.isShowDetails = false
                                        this.$router.push({
                                            path: 'addVehicleUseRegistration',
                                            name: 'addVehicleUseRegistration',
                                            params: {
                                                transform: this.transform,
                                                relevancyId: params.row.id
                                            }
                                        })
                                    }
                                }
                            },"编辑") : '',
                            this.$has ('vehicleRegistration:list:delete') ? h("el-button",{
                                props: {
                                    type: "text"
                                },
                                attrs: {
                                    disabled: params.row.procState === '1' ? false : true
                                },
                                style:{
                                    color: params.row.procState === '1'? '#409EFF' : '#999',
                                },
                                on: {
                                    click: () => {
                                        util.confirm ().then (res => {
                                            if (res) {
                                                delVehicleUseRegistration({
                                                    id: params.row.id
                                                }).then( res => {
                                                    this.$message.success("删除成功")
                                                    this.getUseRegistrationList ()
                                                }).catch( err => {
                                                    this.$message.error("删除失败")
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
        }
    },
    methods: {
        addUseRegistrationEvent () {
            this.$router.push({
                path: 'addVehicleUseRegistration',
                name: 'addVehicleUseRegistration',
                params: {
                    isAdd : true
                }
            })
        },
        dataSearch (boolean = true) {
            if (boolean) this.resetPage ()
            this.getUseRegistrationList ({
                'name': this.form.keywords ? this.form.keywords : null,
                'state': this.state ? this.state : null,
                'procState': this.procState ? this.procState : null,
                'natureVehicle': this.natureVehicle ? this.natureVehicle : null,
                'createTime': this.createDate ? this.createDate[0] : null,
                'updateTime':this.createDate ? this.createDate[1] : null
            })
        },

        resetBtn () {
            this.form.keywords = this.natureVehicle = this.procState = this.state = '',
            this.createDate = []
            this.resetPage ()
            this.getUseRegistrationList ()
        },

        getUseRegistrationList (item) {
            vehicleUseRegistrationList({
                ...item,
                pageNo: this.page.current,
                pageSize: this.page.size
            }).then( res => {
                this.useRegistrationData = res
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
                this.dataSearch (false)
            });
        },

        // 审核
        reviewVehicleUseApplication () {
            if ( this.multipleSelection.length === 1) {
                if (this.multipleSelection[0].state === '0') {
                    this.$confirm('您是否要审核该条数据', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        reviewVehicleUse({
                            id: this.multipleSelection[0].id,
                            type: '1'
                        }).then(res=> {
                        if (res.success) {
                            this.$message.success(res.message);
                        } else {
                            this.$message.error(res.message);
                        }
                        this.getUseRegistrationList ();
                        })
                    })
                } else {
                    this.$message.error('该数据已审核不支持继续审核');
                } 
            } else if (this.multipleSelection.length === 0 || this.multipleSelection === undefined) {
                this.$message.error('请选择要审核的数据');
            } else {
                this.$message.error('只支持单条数据操作');
            }
        },

        // 反审核
        unReviewVehicleUseApplication () {
            if (this.multipleSelection.length === 1) {
                if (this.multipleSelection[0].state === '1') {
                    this.$confirm('您是否要反审核该条数据', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        reviewVehicleUse({
                            id: this.multipleSelection[0].id,
                            type: '0'
                        }).then(res=> {
                            if (res.success) {
                                this.$message.success(res.message);
                            } else {
                                this.$message.error(res.message);
                            }
                                this.getUseRegistrationList();
                            })
                    })

                } else {
                this.$message.error('该数据未审核不支持继续反审核');
                }
            } else if (this.multipleSelection.length === 0) {
                this.$message.error('请选择要审核的数据');
            } else {
                this.$message.error('只支持单条数据操作');
            }
        },

        delBachVehicleUseRegistration () {
            if ( this.multipleSelection.length === 0) {
                this.$message.warning('请至少选择一条数据')
                return
            }
            let ids = ''
            if (this.multipleSelection && this.multipleSelection.length > 0 ) {
                this.multipleSelection.forEach( res => {
                    ids += res.id + ','
                })
            }
            this.delBachVehicleUseById ({ 'ids': ids.substring(0, ids.length - 1)})
        },

        delBachVehicleUseById (id) {
            util.confirm ().then (boolean => {
                if (boolean) {
                    deleteBatchVehicleUseRegistration (id).then(res => {
                        if (res.code === 200) {
                            this.$message.success(res.message)
                            this.getUseRegistrationList ()
                        }
                    })
                }
            })
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
        this.getUseRegistrationList ()
    },
    components: {
        "qqt-table": qqtTable,
        'qqt-select': qqtSelect
    },
}
</script>

<style lang="scss" scoped>
    .vehicle-use-registration{
        margin-bottom: -20px;
    }
    .vehicle-use-registration-tab{
        box-shadow: 0 2px 12px 0 $color-border-shadow;
        background: $color-bg3;
        height: 102%;
        margin-top: -15px
    }
</style>