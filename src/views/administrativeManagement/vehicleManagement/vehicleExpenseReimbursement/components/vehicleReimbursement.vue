<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header-operation___left" v-if="$has ('vehiclesReimbursement:list:add')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addVehicleReimbursement">车辆费用报销</el-button>
                </span>
                <span class="qqt-container-full-header___search">
                    <el-input
                        placeholder="请输入内容"
                        prefix-icon="el-icon-search"
                        @keyup.enter.native="searchModelSynopsis"
                        v-model="filterText" size="mini">
                    </el-input>
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="searchModelSynopsis">搜索</el-button>
                    <el-button type="info" class="qqt-container-full-header-top___button" @click="resetModelSynopsis">重置</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
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
                        @change="searchModelSynopsis()" 
                        align="right">
                    </el-date-picker>
                </span>
                <span class="qqt-container-full-header-operation___right" v-if="$has ('vehiclesReimbursement:list:delete')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deleteVehicleReimbursementList">批量删除</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <p>车辆性质:</p>
                    <div class="qqt-container-full-header-state___select">
                        <qqt-select :value="natureVehicle" :options="options" :defaultProp="defaultProp" :size="'mini'" :placeholder="'请选择'" @select="natureVehicle = $event, searchModelSynopsis()"></qqt-select>
                    </div>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <p>办理状态:</p>
                    <div class="qqt-container-full-header-state___select">
                        <qqt-select :value="procState" :options="procStateOptions" :defaultProp="procStateDefaultProp" :size="'mini'" :placeholder="'请选择'" @select="procState = $event, searchModelSynopsis()"></qqt-select>
                    </div>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <p>审核状态:</p>
                    <div class="qqt-container-full-header-state___select">
                        <qqt-select :value="state" :options="stateOptions" :defaultProp="procStateDefaultProp" :size="'mini'" :placeholder="'请选择'" @select="state = $event, searchModelSynopsis()"></qqt-select>
                    </div>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                       <el-button icon="el-icon-check" class="qqt-container-full-header-top___button" @click="examineVehicleReimbursement">审核</el-button>
                       <el-button icon="el-icon-close" class="qqt-container-full-header-top___button" @click="reverseAuditVehicleReimbursement">反审核</el-button>
                    </el-button-group>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                        <el-button size="mini" @click="exportExcel" icon="el-icon-upload2">导出</el-button>
                        <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                    </el-button-group>
                </span>
                
            </div>
        </template>
        <div class="qqt-container-full___center">
            <qqt-table :data="tableData" ref="table" :exportData="tableData.records" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange" />
        </div>
    </d2-container>
</template>

<script>
    import { mapState } from 'vuex'
    import util from '@/libs/util.js'
    import { qqtTable, qqtSelect } from '@/components/qqt-subassembly'
    import { getVehicleReimbursementList, searchVehicleReimbursementList, deleteBatchVehicleReimbursement, reviewVehicleReimbursement } from '../../../../../api/administrativeManagement/vehicleManagement/vehicleExpenseReimbursement'
    
    export default {
        data () {
            return {
                filterText: '',
                procState: '',
                state: '',
                natureVehicle: '',
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
                        id: '1',
                        name: '初始化'
                    },
                    {
                        id: '2',
                        name: '待审批'
                    },
                    {
                        id: '3',
                        name: '审批中'
                    },
                    {
                        id: '4',
                        name: '已驳回'
                    },
                    {
                        id: '5',
                        name: '已作废'
                    },
                    {
                        id: '10',
                        name: '已完结'
                    },
                    {
                        id: '6',
                        name: '待提交'
                    }
                ],
                stateOptions: [
                    {
                        id: '0',
                        name: '未审核'
                    },
                    {
                        id: '1',
                        name: '已审核'
                    }
                ],
                createDate: [],
                tableSelectData: [],
                defaultProp: {
                    value: 'name',
                    label: 'name'
                },
                procStateDefaultProp: {
                    value: 'id',
                    label: 'name'
                },
                tableOption: {
                    border: false,
                    isOpenSummary: true
                },
                transform: {
                    isShowDetails: false
                },
                dynamicHeader: {
                    tableId: '',
                    isSave: false
                },
                page: {
                    current: 1,
                    size: 10,
                    total: 0
                },
                tableData: {},
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
                rowHeader: [
                    {
                        prop: 'vehicleUser',
                        label: '驾驶人',
                        isShow: true,
                        width:'100',
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = true
                                        this.routerLink ('车辆费用报销详情', parms.row.procInstId, parms.row.id)
                                    }
                                }
                            }, parms.row.vehicleUser)
                        }
                    },
                    {
                        prop: 'natureVehicle',
                        label: '车辆性质',
                        isShow: true,
                        width:'120'
                    },
                    {
                        prop: 'licensePlateNumber',
                        label: '车牌号',
                        isShow: true,
                        width:'120'
                    },
                    {
                        prop: 'vehicles',
                        label: '车主',
                        isShow: true,
                        width:'100'
                    },
                    {
                        prop: 'roadHaul',
                        label: '行驶里程',
                        isShow: true,
                    },
                    {
                        prop: 'oilFillingCost',
                        label: '车补费',
                        isOpenSummary: true,
                        isShow: true,
                        width:'100'
                    },
                    {
                        prop: 'toll',
                        label: '过路费',
                        isOpenSummary: true,
                        isShow: true,
                        width:'100'
                    },
                    {
                        prop: 'parkingFee',
                        label: '停车费',
                        isOpenSummary: true,
                        isShow: true,
                        width:'100'
                    },
                    {
                        prop: 'pontage',
                        label: '过桥费',
                        isOpenSummary: true,
                        isShow: true,
                        width:'100'
                    },
                    {
                        prop: 'otherCharges',
                        label: '其他费用',
                        isOpenSummary: true,
                        isShow: true,
                        width:'100'
                    },
                    {
                        prop: 'summation',
                        label: '合计（元）',
                        isOpenSummary: true,
                        isShow: true,
                        width:'110'
                    },
                    {
                        prop: 'createName',
                        label: '报销人',
                        isShow: true,
                        width:'120'
                    },
                    {
                        prop: 'createTime',
                        label: '申请时间',
                        isShow: true,
                        width:'160'
                    },
                    {
                        prop: 'procStateName',
                        label: '办理状态',
                        isShow: true,
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
                        isShow: true,
                        render: (h,params) =>{
                            let text = '';
                            if (params.row.state === '0') {
                                text = '未审核';
                            } else if (params.row.state === '1') {
                                text = '审核';
                            }
                            return h('div',{
                            
                            }, params.row.stateName = text)
                        }
                    },
                    {
                        prop: 'agent',
                        label: '待办人',
                        isShow: true,
                        width:'100'
                    },
                    {
                        prop: '',
                        label: '操作',
                        isShow: true,
                        width: '200',
                        fixed: 'right',
                        render: (h, parms) => {
                            return [
                                this.$has ('vehiclesReimbursement:list:edit') ? h('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    attrs: {
                                        disabled: parms.row.procState === '1' ? false : true
                                    },
                                    style:{
                                        color: parms.row.procState === '1'? '#409EFF' : '#999',
                                    },
                                    on:{
                                        click: () => {
                                            this.transform.isShowDetails = false
                                            this.routerLink ('车辆报销编辑', parms.row.procInstId, parms.row.id)
                                        }
                                    }
                                }, '编辑') : '',
                                this.$has ('vehiclesReimbursement:list:delete') ? h('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    attrs: {
                                        disabled: parms.row.procState === '1' ? false : true
                                    },
                                    style:{
                                        color: parms.row.procState === '1'? '#409EFF' : '#999',
                                    },
                                   on:{
                                        click: () => {
                                            this.deleteVehicleReimbursementObject (parms.row.id)
                                        }
                                    }
                                }, '删除') : ''
                            ]
                        }
                    }
                ]
            }
        },

        methods: {

            selectChange (item) {
                this.tableSelectData = item
            },

            searchModelSynopsis (boolean = true) {
                if (boolean) this.resetPage ()
                this.getVehicleReimbursementPage ({
                    'name': this.filterText ? this.filterText : null,
                    'natureVehicle': this.natureVehicle ? this.natureVehicle : null,
                    'procState': this.procState ? this.procState : null,
                    'state': this.state ? this.state : null,
                    'createTime': this.createDate ? this.createDate[0] : null,
                    'updateTime': this.createDate ? this.createDate[1] : null})
            },

            handlePaginationChange (page) {
                this.page = page;
                this.$nextTick(() => {
                    this.searchModelSynopsis (false)
                });
            },

            getVehicleReimbursementPage (text) {
                searchVehicleReimbursementList ({
                    ...text,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size
                }).then( res => {
                    if (res) this.tableData = res
                })
            },

            deleteVehicleReimbursementObject (id) {
                this.deleteVehicleReimbursementById ({'ids': id})
            },

            deleteVehicleReimbursementList () {
                if (this.tableSelectData.length === 0) {
                    this.$message.warning ('请选择一条数据')
                    return
                }
                let ids = ''
                if (this.tableSelectData && this.tableSelectData.length > 0) {
                    this.tableSelectData.forEach(res => {
                        ids += res.id + ','
                    })
                }
                this.deleteVehicleReimbursementById ({'ids': ids.substring(0, ids.length - 1)})
            },

            deleteVehicleReimbursementById (id) {
                util.confirm ().then (boolean => {
                    if (boolean) {
                        deleteBatchVehicleReimbursement (id).then(res => {
                            if (res.code === 200) {
                                this.$message.success(res.message)
                                this.getVehicleReimbursementPage ()
                            }
                        })
                    }
                })
            },

            addVehicleReimbursement () {
                this.transform.isShowDetails = false
                this.routerLink ('车辆费用报销')
            },

            resetModelSynopsis () {
                this.filterText = this.natureVehicle = this.procState = this.state =  ''
                this.createDate = []
                this.resetPage ()
                this.getVehicleReimbursementPage ()
            },

            examineVehicleReimbursement () {
                if ( this.tableSelectData.length === 1) {
                    if (this.tableSelectData[0].state === '0') {
                        this.$confirm('您是否要审核该条数据', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            reviewVehicleReimbursement({
                                id: this.tableSelectData[0].id,
                                type: '1'
                            }).then(res=> {
                            if (res.success) {
                                this.$message.success(res.message);
                            } else {
                                this.$message.error(res.message);
                            }
                            this.getVehicleReimbursementPage ();
                            })
                        })
                    } else {
                        this.$message.error('该数据已审核不支持继续审核');
                    } 
                } else if (this.tableSelectData.length === 0) {
                    this.$message.error('请选择要审核的数据');
                } else {
                    this.$message.error('只支持单条数据操作');
                }
            },
            
            reverseAuditVehicleReimbursement () {
                if (this.tableSelectData.length === 1) {
                    if (this.tableSelectData[0].state === '1') {
                        this.$confirm('您是否要反审核该条数据', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            reviewVehicleReimbursement({
                                id: this.tableSelectData[0].id,
                                type: '0'
                            }).then(res=> {
                                if (res.success) {
                                    this.$message.success(res.message);
                                } else {
                                    this.$message.error(res.message);
                                }
                                    this.getVehicleReimbursementPage();
                                })
                        })

                    } else {
                    this.$message.error('该数据未审核不支持继续反审核');
                    }
                } else if (this.tableSelectData.length === 0) {
                    this.$message.error('请选择要审核的数据');
                } else {
                    this.$message.error('只支持单条数据操作');
                }
            },

            exportExcel () {
                this.$refs.table.getExportExcel ()
            },

            printTable () {
                this.$refs.table.printTable (this.tableSelectData)
            },

            resetPage () {
                this.page = {
                    current: 1,
                    size: 10,
                    total: 0
                }
            },

            printing () {

            },

            routerLink (title, procInstId, id = '') {
                this.$router.push ({
                    path: 'addVehicleReimbursement',
                    name: 'addVehicleReimbursement',
                    params: {
                        relevancyId: id,
                        procInstId: procInstId,
                        transform: this.transform,
                    }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            },
        },

        components: {
            'qqt-table': qqtTable,
            'qqt-select': qqtSelect
        },

        created () {
            this.getVehicleReimbursementPage ()
        }
    }

</script>
