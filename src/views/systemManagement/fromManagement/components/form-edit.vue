<template>
    <el-dialog
            v-dialogDrag
            :title="userTile"
            :visible.sync="isDetail"
            width="50%"
            :before-close="handleClose">
        <from-info :userInfo="userInfo"></from-info>
        <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="closeDialog">确 定</el-button>
                <el-button size="small" @click="closeDialog">取 消</el-button>
            </span>
    </el-dialog>
</template>

<script>
    import FromInfo from "./form-info";
    export default {
        name: "from-edit",
        components: {FromInfo},
        props: {
            fromEdit: Boolean,
            info: Object,
            userTile: String
        },
        data () {
            return {
                isDetail: true,
                userInfo: {}
            }
        },
        methods: {
            closeDialog () {
                this.$emit('closeEdit')
            },
            // 右侧抽屉关闭时
            handleClose(done) {
                done()
                this.$emit('closeEdit')
            },
        },
        mounted() {
            this.isDetail = this.fromEdit
            this.userInfo = this.info
        },
        watch:{
            fromEdit () {
                this.isDetail = this.fromEdit
            },
            userInfo () {
                this.info = this.userInfo
            },
            info () {
                this.userInfo = this.info
            }
        }
    }
</script>

<style scoped>

</style>
