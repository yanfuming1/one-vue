<template>
    <d2-container type="fulls">
        <template slot="header">
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
import { qqtTable, qqtSelect } from '../../../../../components/qqt-subassembly'
import { getSupplierPageList } from '../../../../../api/materialEquipmentManagement/supplierManagement/supplierList'
import { mapState } from 'vuex'

import util from '@/libs/util.js'
export default {

    data () {
        return {
            filterText: '',
            createDate: [],
            tableSelectData: [],
            tableOption: {
                border: false
            },
            transform: {
                isShowDetails: false
            },
            dynamicHeader: {
                tableId: 'T_1577770612209',
                isSave: false
            },
            defaultProp: {
                value: 'id',
                label: 'proName'
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
                    label: '供应商编号',
                    isShow: true,
                    render: (h, parms) => {
                        return h('div', {
                            class: {
                                'typefaceColor': true,
                            },
                            on:{
                                click: () => {
                                    this.transform.isShowDetails = true
                                    this.routerLink (parms.row.id)
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
                    label: '供货类别',
                    isShow: true
                },
                {
                    prop: 'supplierNature',
                    label: '供应商性质',
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
                    label: '综合星级',
                    isShow: true,
                    render: (h, parms) => {
                        return h('div', {},
                            parms.row.creditscore = this.convertCurrency (parms.row.credibilityStar)
                        )
                    }
                },
                {
                    prop: 'quality',
                    label: '产品质量',
                    isShow: true,
                    render: (h, parms) => {
                        return h('div', {},
                            parms.row['quality'] = this.starLevelToChinese (parms.row.qualityProducts)
                        )
                    }
                },
                {
                    prop: 'price',
                    label: '供货价格',
                    isShow: true,
                    render: (h, parms) => {
                        return h('div', {},
                            parms.row['price'] = this.starLevelToChinese (parms.row.goodsPrice)
                        )
                    }
                },
                {
                    prop: 'delivery',
                    label: '供货速度',
                    isShow: true,
                    render: (h, parms) => {
                        return h('div', {},
                            parms.row['delivery'] = this.starLevelToChinese (parms.row.deliverySpeed)
                        )
                    }
                },
                {
                    prop: 'afterSales',
                    label: '售后服务',
                    isShow: true,
                    render: (h, parms) => {
                        return h('div', {},
                            parms.row['afterSales'] = this.starLevelToChinese (parms.row.afterSalesService)
                        )
                    }
                },
                {
                    prop: 'technical',
                    label: '技术支持',
                    isShow: true,
                    render: (h, parms) => {
                        return h('div', {},
                            parms.row['technical'] = this.starLevelToChinese (parms.row.technicalSupport)
                        )
                    }
                },
                {
                    prop: 'integrity',
                    label: '诚信度',
                    isShow: true,
                    render: (h, parms) => {
                        return h('div', {},
                            parms.row['integrity'] = this.starLevelToChinese (parms.row.integrityDegree)
                        )
                    }
                },
                
            ]
        }
    },

    methods: {

        selectChange (item) {
            this.tableSelectData = item
        },

        searchModelSynopsis (boolean = true) {
            if (boolean) this.resetPage ()
            this.getSupplierEvaluatePage ({
                'name': this.filterText ? this.filterText : null,
                'createTime': this.createDate ? this.createDate[0] : null,
                'updateTime': this.createDate ? this.createDate[1] : null})
        },

        handlePaginationChange (page) {
            this.page = page;
            this.$nextTick(() => {
                this.searchModelSynopsis (false)
            });
        },

        getSupplierEvaluatePage (text) {
            getSupplierPageList  ({
                ...text,
                'pageNo': this.page.current,
                'pageSize': this.page.size
            }).then( res => {
                if (res) this.tableData = res
            })
        },

        resetModelSynopsis () {
            this.filterText =  ''
            this.createDate = []
            this.resetPage ()
            this.getSupplierEvaluatePage ()
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

        routerLink (id = '') {
            this.$router.push ({
                path: `supplierCreditRating`,
                name: 'supplierCreditRating',
                params: {
                    relevancyId: id,
                    transform: this.transform,
                }
            })
        },

        starLevelToChinese (data) {
            let str = ''
            switch (data) {
                case '5':
                    str = '优秀'
                    break;
                case '4':
                    str = '良好'
                    break;
                case '3':
                    str = '一般'
                    break;
                case '2':
                    str = '差'
                    break;
                case '1':
                    str = '极差'
                    break;
            }
            return str
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
        'qqt-table': qqtTable
    },

    created () {
        this.getSupplierEvaluatePage ()
    }
}
</script>
