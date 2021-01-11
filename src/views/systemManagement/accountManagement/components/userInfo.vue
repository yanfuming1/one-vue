<template>
<div class="account-userInfo">
    <el-form label-width="80px" :model="formData">
        <el-row>
            <el-col :span="10" :offset="1">
                <el-form-item label="员工姓名">
                    <qqt-p :value="formData.username"></qqt-p>
                </el-form-item>
            </el-col>
            <el-col :span="10" :offset="2">
                <el-form-item label="工号">
                    <qqt-p :value="formData.accountNumber"></qqt-p>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10" :offset="1">
                <el-form-item label="登录账号">
                    <qqt-p :value="formData.accountNumber"></qqt-p>
                </el-form-item>
            </el-col>
            <el-col :span="10" :offset="2">
                <el-form-item label="状态">
                    <qqt-p :value="formData.status === '1' ? '启用' : '禁用'"></qqt-p>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="22" :offset="1" style="border-top: 1px dashed #DDD;">
                <p class="role-title">账号权限</p>
                <div class="account-role-tree">
                    <role-style-tree ref="perTree" :styleData="styleData" :styleProps="styleProps"/>
                </div>
            </el-col>
        </el-row>
        <el-row class="account-user">
            <el-form-item>
                <el-button type="primary" size="small" @click="onSubmit">关闭</el-button>
            </el-form-item>
        </el-row>
    </el-form>
</div>
</template>
<script>
    import RoleStyleTree from '../components/role-style-tree'
    import QqtP from "../../../../components/qqt-subassembly/qqt-p/qqt-p";
    import { accountPerListById, accountFindPerTreeById } from '../../../../api/system/accountManagement/accountManagement'
    let that = this
    export default {
        name: "userInfo",
        components: {QqtP, RoleStyleTree},
        props:{
            userInfo: {}
        },
        data () {
            return {
                formData: {},
                styleData: this.$store.getters['d2admin/role/getData'],
                styleProps: {
                    children: 'children',
                    label: 'name'
                },
                limits: []
            }
        },
        methods: {
            onSubmit(){
                this.$emit("closeDrawer")
            },
            getUserPermission(userId){
                // accountPerListById(
                //     {id: userId}
                // ).then(res => {
                //     that.limits = []
                //     res.forEach(item => {
                //         that.limits.push(item.id)
                //     })
                //     // that.$refs.perTree.setCheckedKeys(that.limits)
                //     that.$refs.perTree.setTree(res)
                // })
                accountFindPerTreeById({id: userId}).then(res => {
                    that.$refs.perTree.setTree(res)
                })
            }
        },
        mounted() {
            that = this
            this.formData = this.userInfo
            this.getUserPermission(this.userInfo.id)
        },
        watch : {
            userInfo () {
                this.formData = this.userInfo
                this.getUserPermission(this.userInfo.id)
            }
        }
    }
</script>

<style scoped lang="scss">
.account-userInfo{
    padding-top: 20px;
    .el-form-item{
        margin-bottom: 0px;
    }
    .account-role-tree{
        border: 1px solid #ddd;
    }
    .role-title{
        line-height: 40px;
        font-size: 14px;
    }
    .account-user{
        text-align: center;
        margin-top: 30px;
    }
}
</style>
