<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header-operation___left" v-if="$has ('vehicleAmendantRecord:list:add')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addVehicleRepair">车补标准设置</el-button>
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
                <span class="qqt-container-full-header-operation___right" v-if="$has ('vehicleAmendantRecord:list:delete')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deleteVehicleRepairList">批量删除</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <p>车辆性质:</p>
                    <div class="qqt-container-full-header-state___select">
                        <qqt-select :value="natureVehicle" :options="options" :defaultProp="defaultProp" :size="'mini'" :placeholder="'请选择'" @select="natureVehicle = $event, searchModelSynopsis()"></qqt-select>
                    </div>
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
    import { setUpVehicleRepairList, deleteBatchVehicleRepair } from '../../../../../api/administrativeManagement/vehicleManagement/setUpVehicleRepair'
    import { qqtTable, qqtSelect } from '@/components/qqt-subassembly'
    import { mapState } from 'vuex'

    import util from '@/libs/util.js'
    export default {
        data () {
            return {
                filterText: '',
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
                defaultProp: {
                    value: 'name',
                    label: 'name'
                },
                createDate: [],
                tableSelectData: [],
                tableOption: {
                    border: false
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
                        prop: 'natureVehicle',
                        label: '车辆性质',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = true
                                        this.routerLink ('车补标准设置详情', parms.row.id)
                                    }
                                }
                            }, parms.row.natureVehicle)
                        }
                    },
                    {
                        prop: 'licensePlateNumber',
                        label: '车牌号',
                        isShow: true,
                        width:'120',
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = true
                                        this.routerLink ('车补标准设置详情', parms.row.id)
                                    }
                                }
                            }, parms.row.licensePlateNumber)
                        }
                    },
                    {
                        prop: 'vehicles',
                        label: '车主',
                        isShow: true,
                        width:'120'
                    },
                    {
                        prop: 'displacement',
                        label: '排量',
                        isShow: true,
                        width:'120'
                    },
                    {
                        prop: 'allowances',
                        label: '车补标准（元/km）',
                        isShow: true,
                    },
                    {
                        prop: 'effectiveDate',
                        label: '生效时间',
                        isShow: true,
                    },
                    {
                        prop: 'createName',
                        label: '设置人',
                        isShow: true,
                        width:'120'
                    },
                    {
                        prop: 'createTime',
                        label: '设置时间',
                        isShow: true,
                    },
                    {
                        prop: '',
                        label: '操作',
                        isShow: true,
                        fixed: 'right',
                        width: '150',
                        render: (h, parms) => {
                            return [
                                this.$has ('vehicleAmendantRecord:list:edit') ? h ('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    on:{
                                        click: () => {
                                            this.transform.isShowDetails = false
                                            this.routerLink ('车补标准设置编辑', parms.row.id)
                                        }
                                    }
                                }, '编辑') : '',
                                this.$has ('vehicleAmendantRecord:list:delete') ? h('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                   on:{
                                        click: () => {
                                            this.deleteVehicleRepairObject (parms.row.id)
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
                this.getVehicleRepairPage ({
                    'name': this.filterText ? this.filterText : null,
                    'natureVehicle': this.natureVehicle ? this.natureVehicle : null,
                    'createTime': this.createDate ? this.createDate[0] : null,
                    'updateTime': this.createDate ? this.createDate[1] : null})
            },

            handlePaginationChange (page) {
                this.page = page;
                this.$nextTick(() => {
                    this.searchModelSynopsis (false)
                });
            },

            getVehicleRepairPage (name) {
                setUpVehicleRepairList ({
                    ...name,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size
                }).then( res => {
                    if (res) this.tableData = res
                })
            },

            deleteVehicleRepairObject (id) {
                this.deleteVehicleRepairById ({'ids': id})
            },

            deleteVehicleRepairList () {
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
                this.deleteVehicleRepairById ({'ids': ids.substring(0, ids.length - 1)})
            },

            deleteVehicleRepairById (id) {
                util.confirm ().then (boolean => {
                    if (boolean) {
                        deleteBatchVehicleRepair (id).then(res => {
                            if (res.code === 200) {
                                this.$message.success(res.message)
                                this.getVehicleRepairPage ()
                            }
                        })
                    }
                })
            },

            addVehicleRepair () {
                this.transform.isShowDetails = false
                this.routerLink ('车补标准设置添加')
            },

            resetModelSynopsis () {
                this.filterText = this.natureVehicle = ''
                this.createDate = []
                this.resetPage ()
                this.getVehicleRepairPage ()
            },

            examineVehicleRepair () {

            },

            reverseAuditVehicleRepair () {

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

            routerLink (title, id = '') {
                this.$router.push ({
                    path: 'addVehicleRepair',
                    name: 'addVehicleRepair',
                    params: {
                        relevancyId: id,
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
            this.getVehicleRepairPage ()
        }
    }

</script>
