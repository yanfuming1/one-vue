<template>
    <el-dialog
            v-dialogDrag
            :title="userTile"
            :visible.sync="isDetail"
            width="50%"
            :before-close="handleClose">
        <role-info :userInfo="userInfo"></role-info>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" type="primary" @click="closeDialog">确 定</el-button>
            <el-button size="small" @click="closeDialog">取 消</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import RoleInfo from "./role-info";
    export default {
        name: "role-edit",
        components: {RoleInfo},
        props: {
            roleEdit: Boolean,
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
            this.isDetail = this.roleEdit
            this.userInfo = this.info
        },
        watch:{
            roleEdit () {
                this.isDetail = this.roleEdit
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
