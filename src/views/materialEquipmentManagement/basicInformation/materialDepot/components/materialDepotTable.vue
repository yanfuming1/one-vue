<template>
    <div class="material-depot-table">
        <div class="qqt-container-full-center___left" :class="{'concealClass': isShowCheckbox}" v-if="!moduleId">
            <qqt-tree
                ref="tree"
                :data="data"
                :title="treeTitle"
                :btnTitle="btnTitle"
                :isBtnTitle="isBtnTitle"
                :isShowAdd="isShowAdd"
                :isShowDel="isShowDel"
                :isShowHeader="isShowHeader"
                :isCheckSingleton="true"
                :isShowUpdate="isShowUpdate"
                :isShowCheckbox="isShowCheckbox"
                :defaultExpandedKeys="defaultExpandedKeys"
                :defaultProps="defaultProps"
                @delete="deleteMaterialDepot"
                @append="addMaterialDepotTree"
                @edit="editMaterialDepotTree"
                @checkChange="checkChangeTree"
                @historicalData="historicalDataObject"></qqt-tree>
        </div>
        <div class="qqt-container-full-center___right" :class="{'concealClass': isShowCheckbox, 'beFull': moduleId != ''}">
            <qqt-table :data="tableData" ref="table" :isReserveSelection="isReserveSelection" :exportData="tableData.records" :isShowGroup="false" :rowHeader="rowHeader" :pageShow="isShowPage" :dynamicHeader="dynamicHeader" :option="tableOption" @selection="selectChange" @selectionAll="selectionAll" @page="handlePaginationChange"></qqt-table>
        </div>
        <add-classification v-if="addTreeDialog" :dialogVisible="addTreeDialog" :isAdd="isAdd" :treeId="historicalData.id" @close="updataClassification" />
    </div>
</template>

<script>
    import { qqtTree, qqtTable } from '../../../../../components/qqt-subassembly'
    import { deleteBatchMaterialDepot, getMaterialDepotPageList,
             getMaterialDepotTree, deleteMaterialDepotTree, getMaterialDepotAllList, updateMaterialDepotActivateById, getMaterialDepotByModuleId } from '../../../../../api/materialEquipmentManagement/basicInformation/materialDepot'
    import { getWarehouseInventoryPageList } from '../../../../../api/materialEquipmentManagement/basicInformation/entrepot'
    import addClassification from './addClassification'
    
    import util from '@/libs/util.js'
    export default {

        props: {

            filterText: {
                type: String,
                default: ''
            },

            isShowCheckbox: {
                type: Boolean,
                default: () => false
            },

            isConcealAllOperation: {
                type: Boolean,
                default: () => false
            },

            warehouseId: {
                type: String,
                default: () => null
            },

            moduleId: {
                type: String,
                default: () => ''
            },

            isOrder: {
                type: Boolean,
                default: () => false
            },
            
            isOther: {
                type: Boolean,
                default: () => false
            },

            isRecipientsReturn: {
                type: Boolean,
                default: () => false
            },

            isOutboundOrder: {
                type: Boolean,
                default: () => false
            },

            isTask: {
                type: Boolean,
                default: () => false
            },

            isReturnGoods: {
                type: Boolean,
                default: () => false
            },

            isExchangeGoods: {
                type: Boolean,
                default: () => false
            },

            isShowHeader: {
                type: Boolean,
                default: () => false
            },

            treeTitle: {
                type: String,
                default: () => {
                    return ''
                }
            }
        },

        components: {
            'qqt-tree': qqtTree,
            'qqt-table': qqtTable,
            'add-classification': addClassification
        },

        data () {
            return {
                data: [],
                statusId: '',
                isAdd: false,
                isShowDel: false,
                isShowAdd: false,
                isShowPage: false,
                isBtnTitle: false,
                isAllCheck: false,
                isShowUpdate: false,
                addTreeDialog: false,
                isReserveSelection: true,
                tableOption: {},
                historicalData: {
                    id: '',
                    superiorId: []
                },
                dynamicHeader: {
                    tableId: 'T_1577684881365',
                    isSave: false
                },
                page: {
                    current: 1,
                    size: 10,
                    total: 0
                },
                btnTitle: {
                    name: '新建分类',
                    icon: 'el-icon-folder-add'
                },
                defaultProps: {
                    children: 'children',
                    label: 'name',
                    value: 'id'
                },
                transform: {
                    isShowDetails: false
                },
                tableData: {
                    records: []
                },
                selectTableData: [],
                selectTreeData: [],
                selectTableAllData: [],
                defaultExpandedKeys: [],
                rowHeader: []
            }
        },

        methods: {

            historicalDataObject (item) {
                let data = this.selectTreeData.find (f => f.id === item.id)
                data ? this.isAllCheck = true : this.isAllCheck = false
                this.historicalData = item
                this.getMaterialDepotPageLists (item.id)
            },

            getMaterialDepotTreeList () {
                getMaterialDepotTree({'warehouseId': this.warehouseId}).then(result => {
                    if (result && result.length > 0) {
                        this.data = result
                        if (this.historicalData.id) {
                            this.getMaterialDepotPageLists (this.historicalData.id)
                        }
                    }
                })
            },

            deleteMaterialDepot (data) {
                deleteMaterialDepotTree({'id': data.id}).then(result => {
                    if (result.code === 200) {
                        this.$message.success('删除成功')
                        this.getMaterialDepotTreeList ()
                    }
                })
            },

            deleteBatchMaterialDepotData () {
                if (this.selectTableData.length === 0) {
                    this.$message.warning ('至少选择一条数据')
                    return
                }

                let str = ''
                this.selectTableData.filter ( f => str += f.id + ',')
                this.deleteMaterialDepotTable (str.substring (0, str.length - 1))
            },

            deleteMaterialDepotTable (id) {
                util.confirm ().then (boolean => {
                    if (boolean) {
                        deleteBatchMaterialDepot ({'ids': id}).then (res => {
                            if (res.code === 200) {
                                this.$message.success ('删除成功')
                                this.selectChangeData ()
                            }
                        })
                    }
                })
            },

            getMaterialDepotPageLists (id, text, status = this.statusId || null) {
                let url = '', item = {}
                !this.isShowCheckbox ? this.warehouseId ? url = getWarehouseInventoryPageList : url = getMaterialDepotPageList : this.warehouseId ? url = getWarehouseInventoryPageList : url = getMaterialDepotAllList
                url ({ ...text, 'groupId': id, 'status': status, 'pageNo': this.page.current, 'pageSize': this.page.size, 'warehouseId': this.warehouseId, 'groupByMaterial': true }).then (res => {
                    if (res && res instanceof Array) {
                        this.tableData.records = res
                    } else {
                        this.tableData = res
                    }
                    if (this.isShowCheckbox && this.isAllCheck && !this.warehouseId) this.$refs.table.toggleSelection (true)
                })
            },

            getMaterialDepotByModuleIdToList () {
                let text = {}
                 this.isOrder ? text = { amount: 'number1', selected: 'number2' } : this.isOther 
                    ? text = {  amount: 'number1', selected: 'number4' } : this.isRecipientsReturn 
                        ? text = {  amount: 'number4', selected: 'number5' } : this.isOutboundOrder 
                            ? text = { amount: 'number1', selected: 'number4' } : this.isTask 
                                ? text = { 'use': true } : this.isReturnGoods 
                                    ? text = { amount: 'number3', selected: 'number4' } : this.isExchangeGoods
                                        ? text = { amount: 'number4', selected: 'number5' } : ''
                getMaterialDepotByModuleId ({'mainId': this.moduleId, ...text}).then (res => {
                    if (res && res.length > 0) {
                        console.log(res)
                        res.forEach (item => {
                            item.number1 = item.number1 + '', item.money1 = item.money1 + '', item.money2 = item.money2 + ''
                        })
                        this.tableData.records = res, this.isShowPage = false
                    }
                })
            },

            updateMaterialDepotActivate (id) {
                updateMaterialDepotActivateById (id).then (res => {
                    if (res.code == 200) this.$message.success ('更改成功'), this.getMaterialDepotPageLists (this.historicalData.id)
                })
            },

            handlePaginationChange (page) {
                this.page = page
                this.$nextTick(() => {
                    this.selectChangeData (false)
                })
            },

            selectChange (item) {
                this.selectTableData = item
                if (this.isShowCheckbox) this.selectCorrespondingTree ([item[item.length - 1]])
            },

            selectionAll (item) {
                this.selectTableData = item
                if (this.isShowCheckbox) this.selectCorrespondingTree (item)
            },

            addMaterialDepotTree (boolean) {
                if (boolean) this.historicalData.id = ''
                this.addTreeDialog = this.isAdd = true
            },

            editMaterialDepotTree (data) {
                this.historicalData = data
                this.isAdd = false
                this.addTreeDialog = true
            },

            selectChangeData (boolean = true) {
                if (boolean) this.resetPage ()
                this.getMaterialDepotPageLists (this.historicalData.id, {
                    'keywords': this.filterText ? this.filterText : null
                })
            },

            routerLink (title, id = '') {
                if (this.isConcealAllOperation) return
                this.historicalData.superiorId.push (this.historicalData.id)
                this.$router.push ({
                    path: `addMaterialDepot`,
                    name: 'addMaterialDepot',
                    params: {
                        data: this.data,
                        relevancyId: id,
                        transform: this.transform,
                        groupId: this.historicalData.id,
                        superiorId:  this.historicalData.superiorId
                    }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            },

            updataClassification (boolean) {
                this.addTreeDialog = false
                if (boolean) {
                    this.getMaterialDepotTreeList ()
                }
            },

            setShowCondition (boolean) {
                this.transform.isShowDetails = boolean
            },

            checkChangeTree (data, check) {
                let item = {}
                this.isAllCheck = true
                item = this.selectTreeData.find (f => f.id == data.id)
                if (!item) {
                    this.historicalData = data
                    this.getMaterialDepotPageLists (this.historicalData.id)
                } else {
                    if (this.historicalData.id == data.id) {
                        this.$refs.table.toggleSelection (false)
                    }
                }
            },

            selectCorrespondingTree (list) {
                let index = -1, data = []
                if (!this.moduleId) {
                    index = this.selectTreeData.findIndex (f => f.id === this.historicalData.id)
                    if (list.length === this.tableData.records.length) {
                        if (index == -1) {
                            this.selectTreeData.push (this.historicalData)
                            this.selectTreeData.forEach (res => { data.push (res.id)})
                            this.$refs.tree.setCheckedKey (this.historicalData.id, true)
                        }
                    } else {
                        if (index != -1) this.selectTreeData.splice (index, 1), this.$refs.tree.setCheckedKey (this.historicalData.id)
                    }
                }
                if (list.length == 0) this.selectTableAllData = []
                list.forEach (element => {
                    index = this.selectTableAllData.findIndex (f => f.id === element.id)
                    if (index == -1) this.selectTableAllData.push (element)
                    if (this.moduleId && index != -1) this.selectTableAllData.splice (index, 1)
                    if (element.groupId === this.historicalData.id && index != -1) this.selectTableAllData.splice (index, 1)
                })
                this.$emit ('selectTableData', this.selectTableAllData)
            },

            getSelectData () {
                return this.selectTableData
            },

            printTable () {
                this.$refs.table.printTable (this.selectTableData)
            },

            getExportExcel () {
                this.$refs.table.getExportExcel ()
            },

            resetModelSynopsis () {
                this.resetPage ()
                this.getMaterialDepotPageLists (this.historicalData.id)
            },

            resetPage () {
                this.page = {
                    current: 1,
                    size: 10,
                    total: 0
                }
            },

            // 验证权限
            _validationAuth () {
                this.isShowDel = this.$has ('material:material:group:delete')
                this.isShowAdd = this.isBtnTitle = this.$has ('material:material:group:add')
                this.isShowUpdate = this.$has ('material:material:group:edit')
            },

            initLoadData () {
                if (this.isShowCheckbox) this.statusId = '1'
                if (!this.isConcealAllOperation) this._validationAuth (), this.isShowPage = true, this.isReserveSelection = false
                if (this.$route.params.treeId && this.$route.params.treeId instanceof Array) {
                    this.historicalData.id = this.$route.params.treeId[this.$route.params.treeId.length - 1],
                    this.defaultExpandedKeys = this.historicalData.superiorId = this.$route.params.treeId
                    this.historicalData.superiorId.splice (this.$route.params.treeId.length - 1, 1)
                }
                this.isShwoHeader ()
                
                this.moduleId ? this.getMaterialDepotByModuleIdToList () : this.getMaterialDepotTreeList()
            },

            isShwoHeader () {
                this.rowHeader = [
                    {
                        prop: 'code',
                        label: '材料信息编号',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': this.isConcealAllOperation ? false : true,
                                },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = true
                                        this.routerLink ('材料信息详情', parms.row.id)
                                    }
                                }
                            }, parms.row.code)
                        }
                    },
                    {
                        prop: 'name',
                        label: '名称',
                        isShow: true
                    },
                    {
                        prop: 'alias',
                        label: '别名',
                        isShow: true
                    },
                    {
                        prop: 'brandName',
                        label: '品牌',
                        isShow: true
                    },
                    {
                        prop: 'specificationName',
                        label: '规格型号',
                        isShow: true
                    },
                    {
                        prop: 'unit',
                        label: '计量单位',
                        isShow: true
                    },
                    {
                        prop: 'technicalParameters',
                        label: '技术参数',
                        isShow: true
                    },
                    {
                        prop: 'price',
                        label: '单价',
                        isShow: true,
                        width: 100,
                        isMoney: true,
                    },
                    {
                        prop: 'totalPrice',
                        label: '物品总价',
                        width: 150,
                        isShow: true,
                        isMoney: true,
                    },
                    {
                        prop: 'lockNumber',
                        label: '锁库数量',
                        isShow: this.warehouseId ? true : false
                    },
                    {
                        prop: 'quantity',
                        label: '剩余库存',
                        isShow: this.warehouseId ? true : false
                    },
                    {
                        prop: 'storageUserName',
                        label: '入库人',
                        isShow: this.warehouseId ? true : false
                    },
                    {
                        prop: 'storageTime',
                        label: '入库时间',
                        width: 100,
                        isShow: this.warehouseId ? true : false
                    },
                    {
                        prop: 'number1',
                        label: '总数量',
                        isShow: this.isOrder ? true : false
                    },
                    {
                        prop: 'batch',
                        label: '批次号',
                        isShow: this.warehouseId ? true : false
                    },
                    {
                        prop: 'number2',
                        label: '已入库数量',
                        isShow: this.isOrder ? true : false
                    },
                    {
                        prop: 'number1',
                        label: '总数量',
                        isShow: this.isOutboundOrder ? true : false
                    },
                    {
                        prop: 'number4',
                        label: '已出库数量',
                        isShow: this.isOutboundOrder ? true : false
                    },
                    {
                        prop: 'createName',
                        label: '录入人',
                        isShow: true
                    },
                    {
                        prop: 'createTime',
                        label: '录入时间',
                        isShow: true
                    },
                    {
                        prop: '',
                        label: '操作',
                        width: 200,
                        isShow: this.isConcealAllOperation == false ? true : false,
                        fixed: 'right',
                        width: '200',
                        render: (h, parms) => {
                            return [
                                this.$has ('material:material:model:activate') ? h ('el-button', {
                                    props:{
                                        type: parms.row.status == '0' ? 'warning' : 'primary',
                                        size: 'mini',
                                        round: true
                                    },
                                    style: {
                                        padding: '5px 10px'
                                    },
                                    on:{
                                        click: () => {
                                            this.updateMaterialDepotActivate (parms.row.id)
                                        }
                                    }
                                }, parms.row.status == '0' ? '启用' : '禁用') : '',
                                this.$has ('material:material:model:edit') ? h ('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    on:{
                                        click: () => {
                                            this.transform.isShowDetails = false
                                            this.routerLink ('材料编辑', parms.row.id)
                                        }
                                    }
                                }, '编辑') : '',
                                this.$has ('material:material:model:delete') ? h ('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    on:{
                                        click: () => {
                                            this.deleteMaterialDepotTable (parms.row.id)
                                        }
                                    }
                                }, '删除') : '',
                                
                            ]
                        }
                    }
                ]
            }
        },

        created () {
            this.initLoadData ()
        },

        watch: {
            warehouseId (val) {
                if (val) this.initLoadData ()
            }
        }
    }
</script>
<style lang="scss" scoped>
.material-depot-table {
    .qqt-container-full-center___left {
        width: 20%;
        height: 735px;
        float: left;
    }
    .qqt-container-full-center___right {
        width: 78.55%;
        height: 735px;
        float: right;
    }
    .concealClass {
        box-shadow: 0 2px 12px 0 transparent !important
    }
    .beFull {
        width: 100% !important;
    }
}
</style>