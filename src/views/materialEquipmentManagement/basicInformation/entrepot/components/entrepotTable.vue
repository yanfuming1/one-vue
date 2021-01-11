<template>
    <div class="entrepot-table">
        <div class="qqt-container-full-center___left"  :class="{'concealClass': isDialog}" v-if="!materialId">
            <qqt-tree
                :data="data"
                :title="treeTitle"
                :btnTitle="btnTitle"
                :isShowAdd="isShowAdd"
                :isShowDel="isShowDel"
                :isBtnTitle="isBtnTitle"
                :isShowUpdate="isShowUpdate"
                :isShowHeader="isShowHeader"
                :defaultProps="defaultProps"
                @delete="deleteEntrepot"
                @append="addEntrepotTree"
                @edit="editEntrepotTree"
                @historicalData="historicalDataObject"></qqt-tree>
        </div>
        <div class="qqt-container-full-center___right" :class="{'concealClass': isDialog, 'beFull': materialId}">
            <qqt-table :data="tableData" ref="table" :pageShow="isShowPage" :isShowRadio="isDialog" :isShowSelection="!isDialog" :isShowGroup="false" :exportData="tableData.records" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" :option="tableOption" @radioChange="radioChange" @selectionChange="selectChange" @page="handlePaginationChange"></qqt-table>
        </div>
        <add-classification v-if="addTreeDialog" :dialogVisible="addTreeDialog" :isAdd="isAdd" :treeId="historicalData.id" @close="updataClassification" />
        <user-modules :showDialog="isShowAdminDialog" ref="userModules" title="选择人员" :isShowRole="false" @clearUserPage="getAdmin" @closeFun="isShowAdminDialog = false"/>
    </div>
</template>

<script>
    import { qqtTree, qqtTable } from '../../../../../components/qqt-subassembly'
    import { deleteBatchEntrepot, getEntrepotPageList, 
             getEntrepotTree, deleteEntrepotTree, getEntrepotById,
             updateEntrepotAdmin, getOutboundWarehouseData, getEntrepotAdminManageEntrepot, updateEntrepotDepotActivateById } from '../../../../../api/materialEquipmentManagement/basicInformation/entrepot'

    import userModules from '../../../../systemManagement/processDefinition/processModules/userModules'
    import addClassification from './addClassification'
    import util from '@/libs/util.js'
    export default {

        props: {

            filterText: {
                type: String,
                default: () => ''
            },

            isDialog: {
                type: Boolean,
                default: () => false
            },

            materialId: {
                type: String,
                default: () => null
            },

            warehouseId: {
                type: String,
                default: ()=> null
            },

            isEntrepot: {
                type: Boolean,
                default: () => false
            },

            isShowHeader: {
                type: Boolean,
                default: () => false
            },

            treeTitle: {
                type: String,
                default: ''
            }
        },

        data () {
            return {
                data: [],
                values: {},
                isAdd: false,
                isShowPage: true,
                isShowDel: false,
                isShowAdd: false,
                isBtnTitle: false,
                isShowUpdate: false,
                addTreeDialog: false,
                isShowAdminDialog: false,
                tableOption: {},
                historicalData: {
                    id: '',
                    superiorId: []
                },
                dynamicHeader: {
                    tableId: 'T_1577686250365',
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
                rowHeader: []
            }
        },

        methods: {

            historicalDataObject (item) {
                this.historicalData = item
                this.getEntrepotPageLists (item.id)
            },

            getEntrepotTreeList () {
                getEntrepotTree().then(result => {
                    if (result && result.length > 0) {
                        this.data = result
                        if (this.historicalData.id) {
                            this.getEntrepotPageLists (this.historicalData.id)
                        }
                    }
                })
            },

            deleteEntrepot (data) {
                deleteEntrepotTree({'id': data.id}).then(result => {
                    if (result.code === 200) {
                        this.$message.success('删除成功')
                        this.getEntrepotTreeList ()
                    }
                })
            },

            resetModelSynopsis () {
                this.resetPage ()
                this.getEntrepotPageLists (this.historicalData.id)
            },

            deleteBatchEntrepotData () {
                if (this.selectTableData.length === 0) {
                    this.$message.warning ('至少选择一条数据')
                    return
                }

                let str = ''
                this.selectTableData.filter ( f => str += f.id + ',')
                this.deleteEntrepotTable (str.substring (0, str.length - 1))
            },

            deleteEntrepotTable (id) {
                util.confirm ().then (boolean => {
                    if (boolean) {
                        deleteBatchEntrepot ({'ids': id}).then (res => {
                            if (res.code === 200) {
                                this.$message.success ('删除成功')
                                this.selectChangeData ()
                            }
                        })
                    }
                })
            },

            getEntrepotPageLists (id = null, text) {
                let url = '', list = []
                this.materialId ? url = getOutboundWarehouseData : this.isEntrepot ? url = getEntrepotAdminManageEntrepot : url = getEntrepotPageList
                url ({...text, 'groupId': id, 'materialId': this.materialId, 'warehouseId': this.warehouseId, 'pageNo': this.materialId ? null : this.page.current, 
                        'pageSize': this.materialId ? null : this.page.size}).then (res => {
                    if (res && res instanceof Array) {
                        this.isShowPage = false
                        if (this.materialId || this.isEntrepot) {
                            res.forEach (item => { if (item.status == '1') list.push (item) })
                            res = list
                        }
                        this.tableData.records = res
                    } else {
                        this.isShowPage = true
                        if (this.materialId || this.isEntrepot) {
                            res.records.forEach (item => { if (item.status == '1') list.push (item) })
                            res.records = list
                        }
                        this.tableData = res
                    }
                })
            },

            updateEntrepotlDepotActivate (id) {
                updateEntrepotDepotActivateById (id).then (res => {
                    if (res.code == 200) this.$message.success ('更改成功'), this.getEntrepotPageLists (this.historicalData.id)
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
            },

            addEntrepot () {
                this.transform.isShowDetails = false
                this.routerLink ('添加仓库', 'addEntrepot')
            },

            addEntrepotTree (boolean) {
                if (boolean) this.historicalData.id = ''
                this.addTreeDialog = this.isAdd = true
            },

            routerLink (title, route, id = '') {
                if (this.isDialog) return
                this.historicalData.superiorId.push (this.historicalData.id)
                this.$router.push ({
                    path: route,
                    name: route,
                    params: {
                        relevancyId: id,
                        data: this.data,
                        groupId: this.historicalData.id,
                        transform: this.transform,
                        superiorId:  this.historicalData.superiorId
                    }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            },

            updataClassification (boolean) {
                this.addTreeDialog = false
                if (boolean) {
                    this.getEntrepotTreeList ()
                }
            },

            editEntrepotTree (data) {
                this.historicalData = data
                this.isAdd = false
                this.addTreeDialog = true
            },

            selectChangeData (boolean = true) {
                if (boolean) this.resetPage ()
                this.getEntrepotPageLists (this.historicalData.id, {
                    'name': this.filterText ? this.filterText : null
                })
            },

            exportExcel () { 
                this.$refs.table.getExportExcel ()
            },

            printTable () {
                this.$refs.table.printTable (this.selectTableData)
            },

            resetPage () {
                this.page = {
                    current: 1,
                    size: 10,
                    total: 0
                }
            },

            radioChange (item) {
                this.$emit ('radioChange', item)
            },

            getAdmin (list) {
                let id = '',  str = '', userList = []
                if (list.length == 0) {
                    this.$message.warning ('至少选择一条数据')
                    return
                }
                userList = this.$refs.userModules.getSelectUser ()
                this.isShowAdminDialog = false
                userList.forEach (data => {
                    data.item.forEach (res => {
                        if (res.isCheck) id += res.id + ',', str += res.name + ','
                    })
                })
                this.values['adminId'] = id.substring (0, id.length - 1)
                this.values['adminName'] = str.substring (0, str.length - 1)
                this.updateEntrepotAdminData ()
            },

            updateEntrepotAdminData () {
                updateEntrepotAdmin (this.values).then (res => {
                    if (res .code == 200) this.$message.success ('更改成功'), this.getEntrepotPageLists (this.historicalData.id)
                })
            },

            getEntrepotData (id) {
                getEntrepotById ({id: id}).then (res => {
                    if (res) this.values = res, this.isShowAdminDialog = true
                })
            },

            // 验证权限
            _validationAuth () {
                this.isShowDel = this.$has ('material:warehouse:group:delete')
                this.isShowAdd = this.isBtnTitle = this.$has ('material:warehouse:group:add')
                this.isShowUpdate = this.$has ('material:warehouse:group:edit')
            },

            isShwoHeader () {
                this.rowHeader = [
                    {
                        prop: 'code',
                        label: this.materialId ? '材料编码' : '仓库编码',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = true
                                        this.routerLink ('仓库详情', 'entrepotParticulars', parms.row.id)
                                    }
                                }
                            }, parms.row.code)
                        }
                    },
                    {
                        prop: 'name',
                        label: this.materialId ? '材料名称' : '仓库名称',
                        isShow: true
                    },
                    {
                        prop: 'address',
                        label: '仓库地址',
                        isShow: this.materialId ? false : true
                    },
                    {
                        prop: 'adminName',
                        label: '仓库管理员',
                        isShow: this.materialId ? false : true,
                        width: 200,
                        render: (h, parms) => {
                            return h('div', {}, [
                                h('span', {
                                    style: {
                                        'float': 'left',
                                        'width': '100px',
                                        'overflow': 'hidden',
                                        'text-overflow': 'ellipsis',
                                        'white-space': 'nowrap',
                                    }
                                }, parms.row.adminName),
                                this.$has ('material:warehouse:synopsis:admin') ?  h ('el-button', {
                                    props:{
                                        type: 'primary',
                                        size: 'mini',
                                        round: true
                                    },
                                    style: {
                                        float: 'right',
                                        padding: '5px 10px',
                                    },
                                    class: {
                                        'isDisplay': this.isDialog ? true : false
                                    },
                                    on:{
                                        click: () => {
                                            this.getEntrepotData (parms.row.id)
                                        }
                                    }
                                }, '更改') : ''
                            ])
                        }
                    },
                    {
                        prop: 'batch',
                        label: '批次号',
                        isShow: this.materialId ? true : false
                    },
                    {
                        prop: 'quantity',
                        label: '库存数量',
                        isShow: this.materialId ? true : false
                    },
                    {
                        prop: 'price',
                        label: '单价',
                        isShow: this.materialId ? true : false
                    },
                    {
                        prop: 'createName',
                        label: '设置人',
                        isShow: true
                    },
                    {
                        prop: 'createTime',
                        label: '设置日期',
                        isShow: true
                    },
                    {
                        prop: '',
                        label: '操作',
                        isShow: this.isDialog == false ? true : false,
                        fixed: 'right',
                        width: '200',
                        render: (h, parms) => {
                            return [
                                this.$has ('material:warehouse:synopsis:status') ? h ('el-button', {
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
                                            this.updateEntrepotlDepotActivate (parms.row.id)
                                        }
                                    }
                                }, parms.row.status == '0' ? '启用' : '禁用') : '',
                                this.$has ('material:warehouse:synopsis:edit') ? h ('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    on:{
                                        click: () => {
                                            this.transform.isShowDetails = false
                                            this.routerLink ('仓库编辑', 'addEntrepot', parms.row.id)
                                        }
                                    }
                                }, '编辑') : '',
                                this.$has ('material:warehouse:synopsis:delete') ? h ('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    on:{
                                        click: () => {
                                            this.deleteEntrepotTable (parms.row.id)
                                        }
                                    }
                                }, '删除') : '',
                               
                            ]
                        }
                    }
                ]
            }
        },

        components: {
            'qqt-tree': qqtTree,
            'qqt-table': qqtTable,
            'user-modules': userModules,
            'add-classification': addClassification
        },

        created () {
            if (!this.isDialog) this._validationAuth ()
            if (this.$route.params.treeId && this.$route.params.treeId instanceof Array) {
                this.historicalData.id = this.$route.params.treeId[this.$route.params.treeId.length - 1],
                this.defaultExpandedKeys = this.historicalData.superiorId = this.$route.params.treeId
                this.historicalData.superiorId.splice (this.$route.params.treeId.length - 1, 1)
            }
            if (this.materialId) this.getEntrepotPageLists ()
            this.getEntrepotTreeList()
            this.isShwoHeader ()
        }
    }
</script>

<style lang='scss' scoped>
    .entrepot-table {
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
