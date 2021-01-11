<template>
    <div class="popout-select-stored">
        <el-dialog v-dialogDrag :visible="dialogVisible" title="选择入库、退换货" width="12%" :before-close="handleClose">
            <div class="popout-select-stored-layout">
                <div class="storage">
                    <el-button type="primary" round @click="storage">入&nbsp;&nbsp;&nbsp;库</el-button>
                </div>
            </div>
            <div class="popout-select-stored-layout">
                <div class="returnGoods">
                    <el-button type="warning" round @click="returnGoods">退换货</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                
            }
        },

        methods: {

            handleClose () {
                this.$emit('close')
            },

            storage () {
                this.$emit('close', 'addPurchaseWarehousingPage')
            },

            returnGoods () {
                this.$emit('close', 'returnedGoodsInfo')
            }
        }
    }
</script>
<style lang="scss">
    .popout-select-stored {
        .popout-select-stored-layout {
            width: 100px;
            position: relative;
            left: 45px;
            padding: 5px 0;
            .storage {
                border: 1px solid $color-primary;
                border-radius: 25px;
                padding: 5px 3px;
                text-align: center;
            }
            .returnGoods {
                border: 1px solid $color-warning;
                border-radius: 25px;
                padding: 5px 3px;
                text-align: center;
            }
        }
        .el-button.is-round {
            padding: 10px 23px !important
        }
    }
</style>