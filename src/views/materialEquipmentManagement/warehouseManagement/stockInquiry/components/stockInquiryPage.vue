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
                <span>
                    <el-form class="stockInquiry-record-header___from" :model="filterList" label-width="95px" size="medium">
                        <el-form-item label="查询仓库:">
                            <qqt-select :value="filterList.warehouseId" size="mini" :defaultProp="defaultProp" :filterable="true" :options="warehouseList" @select="getWarehouseId"></qqt-select>
                        </el-form-item>
                    </el-form>
                </span>
            </div>
        </template>
        <div class="stock-inquiry-content">
            <material-depot-table :isConcealAllOperation="true" :treeTitle="treeTitle" :isShowHeader="true" :isShowCheckbox="false" :filterText="filterText" :warehouseId="filterList.warehouseId" ref="materialDepot" />
        </div>
    </d2-container>
</template>

<script>
    import { qqtSelect } from '../../../../../components/qqt-subassembly'
    import { getEntrepotAdminManageEntrepotNotPage } from '@/api/materialEquipmentManagement/basicInformation/entrepot' 

    import materialDepotTable from '../../../basicInformation/materialDepot/components/materialDepotTable'
    import util from '@/libs/util.js'
    export default {
        data () {
            return {
                filterText: '',
                warehouseList: [],
                defaultParams: {},
                filterList: {
                    warehouseId: ''
                },
                defaultProp: {
                    value: 'id',
                    label: 'name'
                },
                treeTitle: '库存分类',
            }
        },

        methods: {

            searchModelSynopsis () {
                this.$refs.materialDepot.selectChangeData()
            },

            handlePaginationChange (page) {
                this.page = page;
                this.nextTick(() => {
                    this.searchModelSynopsis ()
                });
            },

            getStockInquiryPage (text) {
                getEntrepotAdminManageEntrepotNotPage (text).then( res => {
                    if (res) this.warehouseList = res
                })
            },

            resetModelSynopsis () {
                this.filterText = ''
                this.filterList.warehouseId = ''
                this.getStockInquiryPage ()
                this.$refs.materialDepot.resetModelSynopsis()
            },

            getWarehouseId (value) {
                this.filterList.warehouseId = value
            }
        },

        components: {
            'materialDepotTable': materialDepotTable,
            'qqt-select': qqtSelect,
        },

        created () {
            this.getStockInquiryPage ()
        }
    }

</script>

<style lang="scss" scoped>
    .stockInquiry-record-header___from {
        display: inline-block;
        width: 20%;
        .el-form-item {
            margin-bottom: 0px !important
        }
    }
</style>>