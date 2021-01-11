<template>
    <div>
        <el-dialog v-dialogDrag :visible="dialogVisible" title="已申请材料" width="70%" :before-close="handleClose">
            <qqt-table 
                :data="tableData" 
                ref="table" 
                :rowHeader="rowHeader" 
                :dynamicHeader="dynamicHeader" 
                :option="tableOption" 
                @selectionChange="selectChange"></qqt-table>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onSave">确 定</el-button>
                <el-button @click="$emit('closeDialog')">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { qqtTable } from '../../../../components/qqt-subassembly'
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
        tableInfo: {
            type: Array,
            default: () => {
                return []
            }
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
                    prop: 'number1',
                    label: '总数量',
                    isShow: true,
                },{
                    prop: 'number2',
                    label: '累计登记数量',
                    isShow: true,
                    render: (h, parms) => {
                        return h('p', {}, parms.row.number2 === null ? '0' : parms.row.number2)
                    }
                },{
                    prop: 'number3',
                    label: '累计归还数量',
                    isShow: true,
                    render: (h, parms) => {
                        return h('p', {}, parms.row.number3 === null ? '0' : parms.row.number3)
                    }
                },{
                    prop: 'number2',
                    label: '累计出库数量',
                    isShow: true,
                    render: (h, parms) => {
                        return h('p', {}, parms.row.number4 === null ? '0' : parms.row.number4)
                    }
                },{
                    prop: 'number2',
                    label: '累计入库数量',
                    isShow: true,
                    render: (h, parms) => {
                        return h('p', {}, parms.row.number5 === null ? '0' : parms.row.number5)
                    }
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
        }
    },
    mounted() {
        this.tableData.records = this.tableInfo
    },
    watch: {
        dialogVisible (val) {
            if (!val) {
                this.selectData = []
            }
        },
        tableInfo: {
            deep: true,
            handler (val) {
                this.tableData.records = val
            }
        }
    }
}
</script>