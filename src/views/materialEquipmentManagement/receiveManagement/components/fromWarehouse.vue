<template>
    <div>
        <el-dialog v-dialogDrag :visible="dialogVisible" title="仓库材料" width="70%" :before-close="handleClose">
            <qqt-table 
                :data="tableData" 
                ref="table" 
                :rowHeader="rowHeader" 
                :dynamicHeader="dynamicHeader" 
                :option="tableOption" 
                @selectionChange="selectChange"
                @page="handlePaginationChange"></qqt-table>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onSave">确 定</el-button>
                <el-button @click="$emit('closeDialog')">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { qqtTable } from '../../../../components/qqt-subassembly'
import { materialWarehousePage, materialAddlinePage } from '@/api/materialEquipmentManagement/receiveManagement/receiveApply/index'
import util from '../../../../libs/util'
export default {
    components: {
        qqtTable
    },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false,
        },
        // 仓库id
        depositoryId: {
            type: String,
            default: ''
        },
        // 出租申请调用
        rentOut: {
            type: Boolean,
            default: false
        },
        // 从仓库检索
        canChoseLibrary: {
            type: Boolean,
            default: true
        },
        // 领用登记的id
        applyId: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            tableData: {records:[]},
            dynamicHeader: {
                // tableId: 'T_1577684881365',
                // isSave: false
            },
            tableOption: {},
            rowHeader: [
                {
                    prop: 'code',
                    label: '材料编码',
                    isShow: true,
                },{
                    prop: 'name',
                    label: '名称',
                    isShow: true,
                },{
                    prop: 'brandName',
                    label: '品牌',
                    isShow: true,
                },{
                    prop: 'specificationName',
                    label: '规格型号',
                    isShow: true,
                },{
                    prop: 'unit',
                    label: '计量单位',
                    isShow: true,
                },{
                    prop: 'remark',
                    label: '备注',
                    isShow: true,
                },
            ],
            selectData: [],
        }
    },
    methods: {
        handleClose(){
            this.$emit('closeDialog')
        },
        onSave () {
            this.selectData.forEach(item => {
                item.parentId = item.id
                item.number2 = item.number2 === null ? '0' : item.number2
                item.number3 = item.number3 === null ? '0' : item.number3
                item.number4 = item.number4 === null ? '0' : item.number4
                item.number5 = item.number5 === null ? '0' : item.number5
                item.money1 = ''
                item.money2 = ''
                item.remark = ''
            })
            this.$emit('closeDialog', this.selectData)
        },
        selectChange (data) {
            this.selectData = data
        },
        handlePaginationChange (page) {
            this.getData(page)
        },
        getData (page) {
            if (this.rentOut) { 
                // 出租调用
                if (this.canChoseLibrary) {
                    // 从仓库引入
                    this.getDataFromLibrary(page)
                } else {
                    // 从申请单导入
                    materialAddlinePage({
                        mainId : this.applyId,
                        amount: 'number4',
                        selected: 'number5',
                        pageNo: page.current ? page.current : '1',
                        pageSize: page.size ? page.size : '10'
                    }).then(res => {
                        this.tableData = res
                    })
                }
            } else {
                if(this.depositoryId !== '') {
                    this.getDataFromLibrary(page)
                }
            }
        },
        getDataFromLibrary (page) {
            materialWarehousePage({
                groupByMaterial: true,
                warehouseId : this.depositoryId,
                pageNo: page.current ? page.current : '1',
                pageSize: page.size ? page.size : '10'
            }).then(res => {
                this.tableData = res
            })
        }
    },
    mounted() {
        this.getData({})
    },
    watch: {
        dialogVisible (val) {
            if (!val) {
                this.selectData = []
            }
        },
        depositoryId: {
            deep: true,
            handler (val) {
                this.getData({})
            }
        },
        applyId: {
            deep: true,
            handler (val) {
                this.getData({})
            }
        },
        canChoseLibrary: {
            deep: true,
            handler (val) {
                this.getData({})
            }
        }
    }
}
</script>