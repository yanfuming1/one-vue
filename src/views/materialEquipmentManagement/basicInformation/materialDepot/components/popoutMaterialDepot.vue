<template>
    <div class="popout-material-depot">
        <el-dialog v-dialogDrag :visible="dialogVisible" :title="title" width="70%" :before-close="handleClose">
            <material-depot-table ref="material"
                :moduleId="moduleId"
                :warehouseId="warehouseId"
                :isTask="isTask"
                :isOrder="isOrder"
                :isOther="isOther"
                :treeTitle="treeTitle"
                :isRecipientsReturn="isRecipientsReturn"
                :isConcealAllOperation="true"
                :isShowCheckbox="true"
                :isShowHeader="isShowHeader"
                :isOutboundOrder="isOutboundOrder"
                :isReturnGoods="isReturnGoods"
                :isExchangeGoods="isExchangeGoods"
                @selectTableData="selectTableData"/>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onSave">确 定</el-button>
                <el-button @click="$emit('close')">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import materialDepotTable from './materialDepotTable'
    export default {
        props: {

            dialogVisible: {
                type: Boolean,
                default: false
            },

            moduleId: {
                type: String,
                default: () => ''
            },

            warehouseId: {
                type: String,
                default: () => null
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
            
            isReturnGoods: {
                type: Boolean,
                default: () => false
            },

            isExchangeGoods: {
                type: Boolean,
                default: () => false
            },

            title: {
                type: String,
                default: () => '材料库'
            },

            isTask: {
                type: Boolean,
                default: () => false
            },

            isShowHeader: {
                type: Boolean,
                default: () => false
            },

            treeTitle: {
                type: String,
                default: () => ''
            }
        },
        data () {
            return {
                values: []
            }
        },

        methods: {

            handleClose () {
                this.$emit('close')
            },

            selectTableData (list) {
                this.values = list
            },

            onSave () {
                this.$emit ('close', this.values)
            }
        },

        components: {
            'material-depot-table': materialDepotTable
        }
    }
</script>
<style lang="scss">
    .popout-material-depot {
        .el-dialog {
            margin-top: 3vh !important;
            width: 80% !important;
        }
        .dialog-footer {
            position: relative;
            top: 15px;
        }
        .el-dialog__footer {
            padding-bottom: 35px !important
        }
    }
</style>