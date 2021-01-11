<template>
    <d2-container type="fulls">
        <template slot="header">
            <div v-if="this.$route.params.identification == '1' ">
                <project-info></project-info>
            </div>
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header-operation___left" v-if="$route.params.identification == '1' ? $has('self:procurement:enquiry:add') : $has ('material:procurement:enquiry:add')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addPurchaseEnquiry">添加</el-button>
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
                        type="daterange"
                        :picker-options="pickerOptions"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="searchModelSynopsis()" 
                        align="right">
                    </el-date-picker>
                </span>
                <span class="qqt-container-full-header-operation___right" v-if="$route.params.identification == '1' ? $has('self:procurement:enquiry:delete') : $has ('material:procurement:enquiry:delete')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deletePurchaseEnquiryList">批量删除</el-button>
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
    import { qqtTable } from '../../../../../components/qqt-subassembly'
    import { getPurchaseEnquiryPageList, deleteBatchPurchaseEnquiry } from '../../../../../api/materialEquipmentManagement/procurementManagement/purchaseEnquiry' 
    import { delbashSelfPurchaseEnquiry } from '@/api/selfProject/selfProprietaryProcurement/purchaseEnquiry'
    import { mapState } from 'vuex'
    import projectInfo from '../../../../projectManagement/selfSupportProjectDetail/components/commenInfo/projectInfo' 

    import util from '@/libs/util.js'
    export default {
        data () {
            return {
                filterText: '',
                options: [],
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
                        prop: 'inquirySheetNumber',
                        label: '询价单编号',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = true
                                        this.routerLink ('采购询价详情', parms.row.id)
                                    }
                                }
                            }, parms.row.inquirySheetNumber)
                        }
                    },
                    {
                        prop: 'inquirySheetName',
                        label: '询价单名称',
                        isShow: true
                    },
                    {
                        prop: 'inquiryCategory',
                        label: '询价类别',
                        isShow: true
                    },
                    {
                        prop: 'relatedProjects',
                        label: '关联项目',
                        isShow: true
                    },
                    {
                        prop: 'inquirer',
                        label: '询价人',
                        isShow: true,
                    },
                    {
                        prop: 'departmentName',
                        label: '工作部门',
                        isShow: true,
                    },
                    {
                        prop: 'inquiryTime',
                        label: '询价时间',
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
                                (this.$route.params.identification == '1' ? this.$has('self:procurement:enquiry:edit') :
                                    this.$has ('material:procurement:enquiry:edit') ) ? h ('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    on:{
                                        click: () => {
                                            this.transform.isShowDetails = false
                                            this.routerLink ('采购询价编辑', parms.row.id)
                                        }
                                    }
                                }, '编辑') : '',
                                (this.$route.params.identification == '1' ? this.$has('self:procurement:enquiry:delete') :
                                    this.$has ('material:procurement:enquiry:delete') ) ? h ('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                   on:{
                                        click: () => {
                                            this.deletePurchaseEnquiryObject (parms.row.id)
                                        }
                                    }
                                }, '删除') : ''
                            ]
                        }
                    }
                ],
                relevanceProjectId: null
            }
        },

        methods: {

            selectChange (item) {
                this.tableSelectData = item
            },

            searchModelSynopsis (boolean = true) {
                if (boolean) this.resetPage ()
                this.getPurchaseEnquiryPage ({
                    'name': this.filterText ? this.filterText : null,
                    'createTime': this.createDate ? this.createDate[0] : null,
                    'updateTime': this.createDate ? this.createDate[1] : null,
                    // 'projectCode': this.relevanceProjectId ? this.relevanceProjectId : null
                    })
            },

            handlePaginationChange (page) {
                this.page = page;
                this.$nextTick(() => {
                    this.searchModelSynopsis (false)
                });
            },

            getPurchaseEnquiryPage (text) {
                getPurchaseEnquiryPageList ({
                    ...text,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size,
                    'relatedProjectsId': this.relevanceProjectId
                }).then( res => {
                    if (res) this.tableData = res
                })
            },

            deletePurchaseEnquiryObject (id) {
                this.deletePurchaseEnquiryById ({'ids': id, 'projectCode': this.relevanceProjectId})
            },

            deletePurchaseEnquiryList () {
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
                let data = {
                    'ids': ids.substring(0, ids.length - 1),
                    'projectCode': this.relevanceProjectId
                }
                this.deletePurchaseEnquiryById (data)
            },

            deletePurchaseEnquiryById (data) {
                util.confirm ().then (boolean => {
                    if (boolean) {
                        let url = ''
                        this.$route.params.identification == '1' ? url = delbashSelfPurchaseEnquiry : deleteBatchPurchaseEnquiry
                        url (data).then(res => {
                            if (res.code === 200) {
                                this.$message.success(res.message)
                                this.getPurchaseEnquiryPage ()
                            }
                        })
                    }
                })
            },

            addPurchaseEnquiry () {
                this.transform.isShowDetails = false
                this.routerLink ('添加采购询价')
            },

            resetModelSynopsis () {
                this.filterText = ''
                this.createDate = []
                this.resetPage ()
                this.getPurchaseEnquiryPage ()
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
                    this.getPurchaseEnquiryPage ()
                }
            },

            routerLink (title, id = '') {
                this.$router.push ({
                    path: 'addPurchaseEnquiry',
                    name: 'addPurchaseEnquiry',
                    params: {
                        relevancyId: id,
                        transform: this.transform,
                        relatedProjectsId: this.relevanceProjectId,
                        identification: this.$route.params.identification,
                        path: this.$route.params.identification ? 'purchaseEnquiry/selfSupportProject/1' : 'purchaseEnquiry'
                    }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            }
        },

        components: {
            'qqt-table': qqtTable,
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
                this.relevanceProjectId = val.projectCode
                this.getPurchaseEnquiryPage ()
            }
        }
    }

</script>
