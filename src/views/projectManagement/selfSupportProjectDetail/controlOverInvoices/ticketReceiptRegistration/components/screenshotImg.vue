<template>
   <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    width="30%"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    >
    <span>这是一段信息</span>
    <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
    </el-dialog>
</template>

<script>
    export default {
        props: {
            dialogVisible: {
                type: Boolean,
                default: ()=>{
                    return false;
                }
            },
        },
        data() {
            return {
            }
        },
        methods: {
            handleClose () {

            }
        }
    }
</script>

<style lang="scss" scoped>

</style>