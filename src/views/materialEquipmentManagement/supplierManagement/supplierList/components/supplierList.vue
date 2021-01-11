<template>
    <d2-container type="fulls" class="supplier-list">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header-operation___left" v-if="$has ('material:supplier:add')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addSupplier">添加</el-button>
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
                <span class="qqt-container-full-header-operation___right" v-if="$has ('material:supplier:delete')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deleteSupplierList">批量删除</el-button>
                </span>
                <span>
                    <el-form class="supplier-list-header___from" :model="filterList" label-width="95px" size="medium">
                        <el-form-item label="供应商类型:">
                            <qqt-select :value="filterList.status" size="mini" :defaultProp="defaultProp" :filterable="true" :placeholder="'+ 请选择供应商类型'" :options="options" @select="getContactType"></qqt-select>
                        </el-form-item>
                    </el-form>
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
            <qqt-table :data="tableData" ref="table" :exportData="tableData.records" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange"></qqt-table>
        </div>
    </d2-container>
</template>

<script>
import { queryDicById } from '../../../../../api/system/dic/dic'
import { qqtTable, qqtSelect } from '../../../../../components/qqt-subassembly'
import { SUPPLIERMANAGEMENT } from '../../../../../enum/DICTIONARY'
import { deleteBatchSupplier, getSupplierPageList } from '../../../../../api/materialEquipmentManagement/supplierManagement/supplierList'
import { mapState } from 'vuex'

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
                tableId: 'T_1577755370765',
                isSave: false
            },
            defaultProp: {
                value: 'id',
                label: 'name'
            },
            filterList: {
                status: '',
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
                    prop: 'supplierCode',
                    label: '供应商编码',
                    isShow: true,
                    render: (h, parms) => {
                        return h('div', {
                            class: {
                                'typefaceColor': true,
                            },
                            on:{
                                click: () => {
                                    this.transform.isShowDetails = true
                                    this.routerLink ('供应商详情', 'supplierParticulars', parms.row.id)
                                }
                            }
                        }, parms.row.supplierCode)
                    }
                },
                {
                    prop: 'nameSupplier',
                    label: '供应商名称',
                    isShow: true
                },
                {
                    prop: 'supplierCategory',
                    label: '供应类别',
                    isShow: true
                },
                {
                    prop: 'location',
                    label: '所在地',
                    isShow: true
                },
                {
                    prop: 'contacts',
                    label: '联系人',
                    isShow: true
                },
                {
                    prop: 'contactNumber',
                    label: '联系电话',
                    isShow: true
                },
                {
                    prop: 'creditscore',
                    label: '信用状态',
                    isShow: true,
                    render: (h, parms) => {
                        return h('div', {},
                            parms.row.creditscore = this.convertCurrency (parms.row.credibilityStar)
                        )
                    }
                },
                {
                    prop: '',
                    label: '操作',
                    isShow: true,
                    fixed: 'right',
                    width: '150',
                    render: (h, parms) => {
                        return [
                            this.$has ('material:supplier:edit') ? h('el-button', {
                                props:{
                                    type: 'text',
                                },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = false
                                        this.routerLink ('供应商编辑', 'addSupplierInformation', parms.row.id)
                                    }
                                }
                            }, '编辑') : '',
                            this.$has ('material:supplier:delete') ? h ('el-button', {
                                props:{
                                    type: 'text',
                                },
                                on:{
                                    click: () => {
                                        this.deleteSupplierObject (parms.row.id)
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
            this.getSupplierPage ({
                'name': this.filterText ? this.filterText : null,
                'supplierCategoryId': this.filterList.status ? this.filterList.status : null,
                'createTime': this.createDate ? this.createDate[0] : null,
                'updateTime': this.createDate ? this.createDate[1] : null})
        },

        handlePaginationChange (page) {
            this.page = page;
            this.$nextTick(() => {
                this.searchModelSynopsis (false)
            });
        },

        getSupplierPage (text) {
            getSupplierPageList ({
                ...text,
                'pageNo': this.page.current,
                'pageSize': this.page.size
            }).then( res => {
                if (res) this.tableData = res
            })
        },

        deleteSupplierObject (id) {
            this.deleteSupplierById ({'ids': id})
        },

        deleteSupplierList () {
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
            this.deleteSupplierById ({'ids': ids.substring(0, ids.length - 1)})
        },

        deleteSupplierById (id) {
            util.confirm ().then (boolean => {
                if (boolean) {
                    deleteBatchSupplier (id).then(res => {
                        if (res.code === 200) {
                            this.$message.success(res.message)
                            this.getSupplierPage ()
                        }
                    })
                }
            })
        },

        getQueryDicByIdList () {
            queryDicById ({'id': SUPPLIERMANAGEMENT.SUPPLIERCATEGORY}).then (item => {
                if (item == null || item.length == 0) return
                this.options = item
            })
        },

        addSupplier () {
            this.transform.isShowDetails = false
            this.routerLink ('添加供应商', 'addSupplierInformation')
        },

        getContactType (data) {
            this.page.current = 1
            this.page.size = 10,
            this.filterList.status = data
            this.searchModelSynopsis ()
        },

        resetModelSynopsis () {
            this.filterText =  this.filterList.status = ''
            this.createDate = []
            this.resetPage ()
            this.getSupplierPage ()
        },

        exportExcel () { 
            this.$refs.table.getExportExcel ()
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
        },

        routerLink (title, route , id = '') {
            this.$router.push ({
                path: route,
                name: route,
                params: {
                    relevancyId: id,
                    transform: this.transform,
                }
            })
            this.$store.commit ('d2admin/page/titleSet', title)
        },

        convertCurrency (data) {
            let str = ''
            switch (data) {
                case 5:
                    str = '五星'
                    break;
                case 4:
                    str = '四星'
                    break;
                case 3:
                    str = '三星'
                    break;
                case 2:
                    str = '二星'
                    break;
                case 1:
                    str = '一星'
                    break;
                
            }
            return str
        }
    },

    components: {
        'qqt-table': qqtTable,
        'qqt-select': qqtSelect
    },

    created () {
        this.getQueryDicByIdList ()
        this.getSupplierPage ()
    }
}
</script>

<style lang='scss'>
    .supplier-list {
        .supplier-list-header___from {
            display: inline-block;
            width: 20%;
            .el-form-item {
                margin-bottom: 0px !important
            }
        }
        .el-input__prefix, .el-input__suffix {
            top: -1px !important
        }
    }
</style>
