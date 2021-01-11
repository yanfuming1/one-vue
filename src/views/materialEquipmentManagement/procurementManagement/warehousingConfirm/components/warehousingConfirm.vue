<template>
    <d2-container type="fulls">
        <template slot="header">
            <div v-if="this.$route.params.identification == '1' ">
                <project-info></project-info>
            </div>
            <div class="qqt-container-full-header___top">
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
                <span class="qqt-container-full-header-operation___right">
                    <p>入库状态:</p>
                    <div class="qqt-container-full-header-state___select">
                        <qqt-select :value="returnAffirm" :options="returnAffirmOptions" :defaultProp="defaultProp" :size="'mini'" :placeholder="'请选择'" @select="returnAffirm = $event, searchModelSynopsis()"></qqt-select>
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
    import { getWarehousingConfirmPageList, executeWarehousingConfirm } from '@/api/materialEquipmentManagement/warehouseManagement/otherWarehouses'
    import { qqtTable, qqtSelect } from '@/components/qqt-subassembly'
    import projectInfo from '../../../../projectManagement/selfSupportProjectDetail/components/commenInfo/projectInfo' 
    import { mapState } from 'vuex'

    import util from '@/libs/util.js'
    export default {
        data () {
            return {
                filterText: '',
                returnAffirm: '',
                returnAffirmOptions:[
                    {
                        id: '0',
                        name: '未确认'
                    },
                    {
                        id: '1',
                        name: '已确认'
                    }
                ],
                defaultProp: {
                    value: 'id',
                    label: 'name'
                },
                options: [],
                createDate: [],
                tableSelectData: [],
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
                        prop: 'code',
                        label: '入库单编号',
                        isShow: true,
                        width: '150px',
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = true
                                        this.routerLink ('采购入库详情', parms.row.id)
                                    }
                                }
                            }, parms.row.code)
                        }
                    },
                    {
                        prop: 'name',
                        label: '入库单名称',
                        width: '150px',
                        isShow: true
                    },
                    {
                        prop: 'sourceCode',
                        label: '关联单据编号',
                        width: '150px',
                        isShow: true
                    },
                    {
                        prop: 'sourceName',
                        label: '关联单据名称',
                        width: '150px',
                        isShow: true
                    },
                    {
                        prop: 'projectName',
                        label: '关联项目',
                        width: '150px',
                        isShow: true,
                    },
                    {
                        prop: 'categoryName',
                        label: '入库类型',
                        isShow: true,
                        render: (h, parms) => {
                            return [
                                h ('div', {}, parms.row.categoryName = '采购入库')
                            ]
                        }
                    },
                    {
                        prop: 'batch',
                        label: '批次号',
                        isShow: true,
                    },
                    {
                        prop: 'warehouseName',
                        label: '存放仓库',
                        width: '150px',
                        isShow: true,
                    },
                    {
                        prop: 'warehouseSite',
                        label: '存放地点',
                        width: '150px',
                        isShow: true,
                    },
                    {
                        prop: 'amount',
                        label: '入库物品总价',
                        isShow: true,
                        isOpenSummary: true
                    },
                    {
                        prop: 'returnAffirmName',
                        label: '入库状态',
                        isShow: true,
                        render: (h, parms) => {
                            return [
                                h ('div', {}, parms.row.returnAffirmName = parms.row.returnAffirm == '0' ? '未确认' : '已确认')
                            ]
                        }
                    },
                    {
                        prop: 'storageTime',
                        label: '入库日期',
                        isShow: true,
                    },
                    {
                        prop: 'createName',
                        label: '经办人',
                        isShow: true,
                    },
                    {
                        prop: 'departmentName',
                        label: '工作部门',
                        isShow: true,
                    },
                    {
                        prop: 'createTime',
                        label: '经办时间',
                        width: '150px',
                        isShow: true,
                    },
                    {
                        prop: '',
                        label: '操作',
                        isShow: true,
                        width: '100px',
                        fixed: 'right',
                        render: (h, parms) => {
                            return [
                                h ('el-button', {
                                    props:{
                                        type: 'danger',
                                        size: 'mini',
                                        round: true
                                    },
                                    style: {
                                        padding: '5px 10px'
                                    },
                                    attrs: {
                                        disabled: parms.row.returnAffirm == '0' ? false : true
                                    },
                                    on:{
                                        click: () => {
                                            util.confirm ('是否要确认入库').then (boolean => {
                                                if (boolean) {
                                                    this.executeWarehousingConfirmById (parms.row.id)
                                                }
                                            })
                                        }
                                    }
                                }, '确认入库')
                            ]
                        }
                    }
                ],
                projectId: null
            }
        },

        methods: {

            selectChange (item) {
                this.tableSelectData = item
            },

            searchModelSynopsis (boolean = true) {
                if (boolean) this.resetPage ()
                this.getWarehousingConfirmPage ({
                    'name': this.filterText ? this.filterText : null,
                    'returnAffirm': this.returnAffirm ? this.returnAffirm : null,
                    'createTime': this.createDate ? this.createDate[0] : null,
                    'updateTime': this.createDate ? this.createDate[1] : null})
            },

            handlePaginationChange (page) {
                this.page = page;
                this.$nextTick(() => {
                    this.searchModelSynopsis (false)
                });
            },

            getWarehousingConfirmPage (text) {
                getWarehousingConfirmPageList ({
                    ...text,
                    'category': '1',
                    'procState': '10',
                    'pageNo': this.page.current,
                    'pageSize': this.page.size,
                    'projectId': this.projectId
                }).then( res => {
                    if (res) this.tableData = res
                })
            },

            executeWarehousingConfirmById (id) {
                executeWarehousingConfirm ({'id': id}).then (res => {
                    if (res.code == 200) this.$message.success (res.message), this.getWarehousingConfirmPage ()
                })
            },

            resetModelSynopsis () {
                this.filterText = this.returnAffirm = ''
                this.createDate = []
                this.resetPage ()
                this.getWarehousingConfirmPage ()
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

            initLoadData () {
                if (this.$route.params && this.$route.params.identification) {
                    this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad')
                } else {
                    this.getWarehousingConfirmPage ()
                }
            },

            routerLink (title, id = '') {
                this.$router.push ({
                    path: 'addPurchaseWarehousingPage',
                    name: 'addPurchaseWarehousingPage',
                    params: {
                        relevancyId: id,
                        transform: this.transform,
                        returnRouter: this.$route.params.identification ? 'procurementManagement/warehousingConfirm/selfSupportProject/1' : 'procurementManagement/warehousingConfirm',
                        isOrder: false,
                        otherModules: true,
                    }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            },
        },

        components: {
            'qqt-table': qqtTable,
            'qqt-select': qqtSelect,
            'project-info': projectInfo
        },

        created () {
            this.initLoadData ()
        },

        computed: {
            ...mapState ('d2admin/selfSupportProject', [
                'selfSupportProject'
            ])
        },

        watch: {
            selfSupportProject (val) {
                this.projectId = val.projectCode
                this.getWarehousingConfirmPage ()
            }
        }
    }

</script>
