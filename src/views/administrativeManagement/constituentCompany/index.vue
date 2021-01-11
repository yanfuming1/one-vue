<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header-operation___left" v-if="$has ('administer:adminOverseasInstitutions:add')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addCompany">添加</el-button>
                </span>
                <span class="qqt-container-full-header___search">
                    <el-input
                        placeholder="请输入内容"
                        prefix-icon="el-icon-search"
                        v-model="searchInfo.name"
                        size="mini">
                    </el-input>
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="searchModelSynopsis">搜索</el-button>
                    <el-button type="info" class="qqt-container-full-header-top___button" @click="resetSearch">重置</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-date-picker
                        style="width:350px;"
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
                <span class="qqt-container-full-header-operation___right" v-if="$has ('administer:adminOverseasInstitutions:delete')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deleteRecord">批量删除</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <p>机构类型</p>
                    <div class="qqt-container-full-header-state___select" style="width:100px;">
                        <qqt-select :value="company" :options="companyType" :defaultProp="defaultProp" :size="'mini'" :placeholder="'请选择'" @select="searchInfo.current = 1, searchInfo.size = 10, company = $event, searchModelSynopsis()"></qqt-select>
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
            <qqt-table
                :data="tableData"
                ref="table"
                :exportData="tableData.records"
                :dynamicHeader="dynamicHeader"
                :rowHeader="rowHeader"
                :option="tableOption"
                @selectionChange="selectChange"
                @page="handlePaginationChange"></qqt-table>
        </div>
    </d2-container>
</template>

<script>
    import { qqtTable, qqtSelect } from "../../../components/qqt-subassembly"
    import { constituentCompanyList, constituentCompanyDel, constCompanyInfo, constCompanyDeleteBatch } from '../../../api/officalDocument/index'

    import util from '@/libs/util.js'
    let that = this
    export default {
        name: "index",
        components: {qqtTable, qqtSelect},
        data () {
            return {
                searchInfo: {
                    name: '',
                    pageNo: '1',
                    pageSize: '10'
                },
                tableData: {},
                dynamicHeader: {
                    tableId: 'T_1572408258160',
                    isSave: true
                },
                defaultProp: {
                    value: 'name',
                    label: 'name'
                },
                company: '',
                rowHeader: [
                    {
                        prop: 'organiname',
                        label: '机构名称',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {
                                on: { click: () => { 
                                        this.companyId = parms.row.id
                                        this.isShowDetails = true
                                        this.router ('驻外机构详情', false) 
                                    } 
                                }
                            }, [
                            h ('div', {
                                class: {
                                        'typefaceColor': true, 
                                    },
                            }, parms.row.organiname)
                            ], )
                        }
                    },
                    {
                        prop: 'companytype',
                        label: '机构类型',
                        isShow: true
                    },
                    {
                        prop: 'personCharge',
                        label: '经营负责人',
                        isShow: true
                    },
                    {
                        prop: 'locationName',
                        label: '办公地址',
                        isShow: true
                    },
                    {
                        prop: 'createName',
                        label: '登记人',
                        isShow: true
                    },
                    {
                        prop: 'createTime',
                        label: '登记时间',
                        isShow: true
                    },
                    {
                        prop: '',
                        label: '操作',
                        fixed: 'right',
                        width: '230px',
                        isShow: true,
                        render: (createElement, params) => {
                            return createElement('div',
                                [
                                    this.$has ('administer:adminOverseasInstitutions:payment') ? createElement('el-button', {
                                        attrs: {
                                            type: 'text',
                                        },
                                        on: {
                                            click: () => {
                                                this.companyId = params.row.id
                                                this.isShowDetails = true
                                                this.router ('费用缴纳登记', true)
                                            }
                                        }
                                    }, '费用缴纳登记') : '',
                                    this.$has ('administer:adminOverseasInstitutions:edit') ? createElement('el-button', {
                                        attrs: {
                                            type: 'text',
                                            disabled: params.row.presestate != '0' ? true : false
                                        },
                                        on: {
                                            click: () => {
                                                this.companyId = params.row.id
                                                this.isShowDetails = false
                                                this.router ('编辑驻外机构', false)
                                            }
                                        }
                                    }, '编辑') : '',
                                    this.$has ('administer:adminOverseasInstitutions:delete') ? createElement('el-button', {
                                        attrs: {
                                            type: 'text',
                                            disabled: params.row.presestate != '0' ? true : false
                                        },
                                        on: {
                                            click: () => {
                                                util.confirm ().then (res => {
                                                    if (res) {
                                                        constituentCompanyDel({
                                                            id: params.row.id
                                                        }).then(res => {
                                                            this.$message.success("删除成功~~~")
                                                            this.getTableList()
                                                        })
                                                    }
                                                })
                                            }
                                        }
                                    }, '删除') : '',
                                ]
                            )
                        }

                    },
                ],
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
                tableOption: {
                    border: true
                },
                // 出资方式
                capitalWay: [],
                // 公司类型
                companyType: [],
                // 纳税人资格
                taxPayerQuality:[],
                selectData: [],
                createDate: [],
                companyId: '',
                isShowDetails: false,
            }
        },
        methods: {

            addCompany () {
                this.isShowDetails = false
                this.companyId = ''
                this.router ('添加驻外机构', false)
            },

            router (title, boolean) {
                this.$router.push({
                    path: 'newCompany',
                    name: 'newCompany',
                    params: {
                        capitalWay: this.capitalWay,
                        companyType: this.companyType,
                        taxPayerQuality: this.taxPayerQuality,
                        companyId: this.companyId,
                        isShowDetails: this.isShowDetails,
                        isPaymentFee: boolean
                    }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            },

            searchModelSynopsis (boolean = true) {
                if (boolean) this.resetPage ()
                this.getTableList ({
                    'companytype': this.company ? this.company : null,
                    'name': this.searchInfo.name ? this.searchInfo.name : null,
                    'createTime': this.createDate ? this.createDate[0] : null,
                    'updateTime':this.createDate ? this.createDate[1] : null})
            },

            resetSearch () {
                this.searchInfo.name = this.company = ''
                this.createDate = []
                this.resetPage ()
                this.getTableList ()
            },

            deleteRecord () {
                if (this.selectData.length === 0) {
                    this.$message.warning ('至少选择一条数据')
                    return
                }

                let str = ''
                this.selectData.filter (f => {
                    str += f.id + ','
                })
                util.confirm ().then (res => {
                    if (res) {
                        constCompanyDeleteBatch ({'ids': str.substring (0, str.length - 1)}).then (res => {
                            if (res && res.code === 200) {
                                this.$message.success ('删除数据成功')
                                this.getTableList ()
                            }
                        })
                    }
                })
            },

            selectChange (data) {
                this.selectData = data
            },

            handlePaginationChange (page) {
                this.searchInfo.pageNo = page.current
                this.searchInfo.pageSize = page.size
                this.searchModelSynopsis (false)
            },

            getTableList (text) {
                constituentCompanyList({
                    ...text,
                    pageNo: this.searchInfo.pageNo,
                    pageSize: this.searchInfo.pageSize
                }).then(data => {
                    if (data.records && data.records.length > 0) {
                        data.records.forEach(element => {
                            if (element.location.indexOf('[') !== -1) {
                                let str = ''
                                element.location = JSON.parse (element.location)
                                element.location.forEach (res => {
                                    str += res
                                })
                                element['locationName'] = str
                            }
                        });
                    }
                    this.tableData = data
                }) 
                
            },

            loadingBasicData () {
                constCompanyInfo().then(res => {
                    console.log(res);
                    this.capitalWay = res.chuziway
                    this.companyType = res.gongsilx
                    this.taxPayerQuality = res.nashuizige
                })
            },

            exportExcel () { 
                this.$refs.table.getExportExcel ()
            },

            printTable () {
                this.$refs.table.printTable (this.selectData)
            },

            resetPage () {
                this.searchInfo.pageNo = '1',
                this.searchInfo.pageSize = '10'
            }
        },

        mounted() {
            that = this
            this.getTableList ()
            this.loadingBasicData ()
        }
    }
</script>
