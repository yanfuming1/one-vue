<template>
    <div class="popout-entreport">
        <el-dialog v-dialogDrag :visible="dialogVisible" title="存放仓库" width="50%" :before-close="handleClose">
            <entrepot-table ref="material" :isDialog="true" :treeTitle="treeTitle" :isShowHeader="isShowHeader" :warehouseId="warehouseId" :isEntrepot="isEntrepot" :materialId="materialId" @radioChange="radioChange"/>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onSave">确 定</el-button>
                <el-button @click="$emit('close')">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import entrepotTable from './entrepotTable'
    export default {
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            materialId: {
                type: String,
                default: null
            },
            isEntrepot: {
                type: Boolean,
                default: false
            },
            warehouseId: {
                type: String,
                default: null
            },
            isShowHeader: {
                type: Boolean,
                default: false
            },
            treeTitle: {
                type: String,
                default: ''
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

            radioChange (data) {
                this.values = data
            },

            onSave () {
                if (this.values instanceof Array) {
                    this.$message.warning ("请选择一条数据")
                    return
                }
                this.$emit ('close', this.values)
            }
        },

        components: {
            'entrepot-table': entrepotTable
        }
    }
</script>
<style lang="scss">
    .popout-entreport {
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