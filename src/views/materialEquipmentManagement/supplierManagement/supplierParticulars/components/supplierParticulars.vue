<template>
    <d2-container type="fulls">
        <div class="supplier-particulars">
            <div class="supplier-particulars-header">
                <div class="supplier-particulars___left">
                    <div class="supplier-particulars-left___header">
                        <span class="supplier-particulars-left___title">
                            <i class="iconfont iconwuxing"></i>
                            {{ values.nameSupplier }}
                        </span>
                        <span class="supplier-particulars-left-header___operation">
                            <el-button class="supplier-particulars-button" disabled size="mini">{{ values.credit || '暂无数据' }}</el-button>
                            <el-button class="supplier-particulars_header___replacement" disabled size="mini">供应商</el-button>
                        </span>
                    </div>
                    <div class="supplier-particulars-left___address">
                        所在地址: {{ values.location }}{{ values.detailedAddress }}
                    </div>
                </div>
                <div class="supplier-particulars___right">
                    <div class="supplier-particulars-right___longString">
                        <div class="supplier-particulars-right___particulars">
                            <el-input
                                placeholder="请输入内容"
                                prefix-icon="el-icon-search"
                                v-model="filterText" size="mini" @change="searchModelSynopsis" clearable>
                            </el-input>
                            <el-button type="primary" class="qqt-container-full-header-top___button" @click="searchModelSynopsis">搜索</el-button>
                        </div>
                        <div class="supplier-particulars-right___particulars">
                            <el-button-group>
                                <el-button size="mini" @click="exportExcel" icon="el-icon-upload2" class="supplier-particulars-right-particulars___button">导出</el-button>
                            </el-button-group>
                        </div>
                        <div class="supplier-particulars-right___particulars" v-if="$has ('material:supplier:goods:add')">
                            <el-button size="mini" type="warning" class="supplier-particulars-right-particulars___button" @click="addSupplierParticulars">添加供货物品</el-button>
                        </div>
                    </div>
                    <div class="supplier-particulars-right___longString">
                        <div class="supplier-particulars-right___particulars">
                            <span class="left">物品种类合计:</span>
                            <span class="right">100种</span>
                        </div>
                        <div class="supplier-particulars-right___particulars">
                            <span class="left">创建时间:</span>
                            <span class="right">{{ values.createTime }}</span>
                        </div>
                        <div class="supplier-particulars-right___particulars">
                            <span class="left">所在地:</span>
                            <span class="right">{{ values.location }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="supplier-particulars-details">
                <qqt-table :data="tableData" ref="table" :exportData="tableData.records" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange"></qqt-table>
            </div>
        </div>
    </d2-container>
</template>

<script>
    import { qqtTable } from '../../../../../components/qqt-subassembly'
    import { getSupplierById } from '../../../../../api/materialEquipmentManagement/supplierManagement/supplierList'
    import { getSupplierParticularsPageList, deleteBatchSupplierParticulars } from '../../../../../api/materialEquipmentManagement/supplierManagement/supplierParticulars'
    import util from '@/libs/util.js'
    export default {

        data () {
            return {
                filterText: '',
                values: {},
                tableSelectData: [],
                tableOption: {
                    border: false
                },
                transform: {
                    isShowDetails: false
                },
                dynamicHeader: {
                    tableId: 'T_1577760737208',
                    isSave: false
                },
                page: {
                    current: 1,
                    size: 10,
                    total: 0
                },
                tableData: {},
                rowHeader: [
                    {
                        prop: 'code',
                        label: '物品编号',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {}, parms.row.code)
                        }
                    },
                    {
                        prop: 'name',
                        label: '物品名称',
                        isShow: true
                    },
                    {
                        prop: 'brandName',
                        label: '品牌',
                        isShow: true
                    },
                    {
                        prop: 'specificationName',
                        label: '规格',
                        isShow: true
                    },
                    {
                        prop: 'consumablesName',
                        label: '是否消耗品',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {}, parms.row['consumablesName'] = parms.row.consumables === '1' ? '是' : '否')
                        }
                    },
                    {
                        prop: 'money1',
                        label: '单价(元)',
                        isShow: true
                    },
                    {
                        prop: 'operator',
                        label: '经办人',
                        isShow: true
                    },
                    {
                        prop: 'transactionDepartment',
                        label: '经办部门',
                        isShow: true
                    },
                    {
                        prop: '',
                        label: '操作',
                        isShow: true,
                        fixed: 'right',
                        width: '90',
                        render: (h, parms) => {
                            return [
                                this.$has ('material:supplier:goods:delete') ?  h('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    on:{
                                        click: () => {
                                            this.deleteSupplierParticularsObject (parms.row.id)
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
                this.getSupplierParticularsPage ({
                    'name': this.filterText ? this.filterText : null,
                })
            },

            handlePaginationChange (page) {
                this.page = page;
                this.$nextTick(() => {
                    this.searchModelSynopsis (false)
                });
            },

            getSupplierParticularsPage (text) {
                getSupplierParticularsPageList ({
                    ...text,
                    'supplierId': this.$route.params.relevancyId,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size
                }).then( res => {
                    if (res) this.tableData = res
                })
            },

            deleteSupplierParticularsObject (id) {
                this.deleteSupplierParticularsById ({'ids': id})
            },

            deleteSupplierParticularsById (id) {
                util.confirm ().then (boolean => {
                    if (boolean) {
                        deleteBatchSupplierParticulars (id).then(res => {
                            if (res.code === 200) {
                                this.$message.success(res.message)
                                this.getSupplierParticularsPage ()
                            }
                        })
                    }
                })
            },

            getSupplierInformationData (id) {
                getSupplierById ({id: id}).then (res => {
                    if (res) res['credit'] = this.convertCurrency (res.credibilityStar), this.values = res
                })
            },
            
            addSupplierParticulars () {
                this.transform.isShowDetails = false
                this.routerLink ('添加供应物品')
            },


            resetModelSynopsis () {
                this.filterText =  ''
                this.createDate = []
                this.resetPage ()
                this.getSupplierParticularsPage ()
            },

            exportExcel () { 
                this.$refs.table.getExportExcel ()
            },

            resetPage () {
                this.page = {
                    current: 1,
                    size: 10,
                    total: 0
                }
            },

            routerLink (title, id = '') {
                this.$router.push ({
                    path: `addSupplierParticulars`,
                    name: 'addSupplierParticulars',
                    params: {
                        relevancyId: this.$route.params.relevancyId,
                        data: this.values,
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
            },

            resetSupplierParticulars () {
                this.getSupplierParticularsPage ()
                if (this.$route.params && this.$route.params.relevancyId) this.getSupplierInformationData (this.$route.params.relevancyId)
            }
        },

        components: {
            'qqt-table': qqtTable,
        },

        created () {
            this.resetSupplierParticulars ()
        }
    }
</script>

<style lang='scss'>
    .supplier-particulars {
        padding: 10px;
        .supplier-particulars-header {
            box-shadow: 0 2px 12px 0 $color-border-shadow;
            height: 15%;
            min-height: 117px;
            background: $color-bg3;
            .supplier-particulars___left {
                padding: 20px;
                display: inline-block;
                .supplier-particulars-left___header {
                    .supplier-particulars-left___title {
                        font-size: 14px;
                        padding-left: 10px;
                        color: $color-text-normal;
                    }
                    .el-icon-star-on {
                        font-size: 16px;
                    }
                    .iconfont {
                        position: relative;
                        color: $startusing;
                        margin-right: 5px;
                        top: 1px
                    }
                    .supplier-particulars-left-header___operation {
                        padding-left: 20px;
                        .supplier-particulars_header___replacement {
                            background: $color-button-reset !important;
                        }
                        .supplier-particulars-button {
                            color: #fff !important;
                        }
                    }
                }
                .supplier-particulars-left___address {
                    position: relative;
                    left: 35px;
                    top: 35px;
                }
            }
            .supplier-particulars___right {
                float: right;
                .supplier-particulars-right___longString {
                    border-left: 1px solid $color-straight-line2;
                    padding: 5px 0px;
                    width: 210px;
                    text-align: center;
                    float: right;
                    .supplier-particulars-right___particulars {
                        font-size: 12px;
                        padding: 0 15px;
                        height: 36px;
                        line-height: 36px;
                        .left {
                            float: left;
                        }
                        .right {
                            float: right;
                        }
                        .qqt-container-full-header-top___button {
                            padding: 0 5px !important;
                            height: 26px;
                            border-radius: 3px !important;
                            float: right;
                            position: relative;
                            top: 5px;
                        }
                        .supplier-particulars-right-particulars___button {
                            width: 173px !important;
                            margin-left: 8px
                        }
                        .el-input {
                            width: 70% !important
                        }
                    }
                }
            }
        }
        .supplier-particulars-details {
            margin-top: 24px;
            height: 640px;
            background: $color-bg3;
            box-shadow: 0 2px 12px 0 $color-border-shadow;
        }
        .el-button.is-disabled, .el-button.is-disabled:focus, .el-button.is-disabled:hover {
            color: #5e5e5f !important;
            cursor: auto !important;
            background-color: $color-primary !important
        }
    }
</style>
