<template>
    <div class="certificate-search">
        <el-form :inline="true" :model="form" ref="form" size="mini">
            <el-form-item>
                <el-button type="primary" @click="addCertificate">添加</el-button>
            </el-form-item>
            <!-- <el-form-item label prop="name">
                <el-input v-model="form.keywords" prefix-icon="el-icon-search" placeholder="请输入需搜索的内容" style="width: 200px;" :clearable="true"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary">搜索</el-button>
            </el-form-item>
            <el-button-group class="m-l-20">
                <el-button size="mini" icon="el-icon-download">导入</el-button>
                <el-button size="mini" icon="el-icon-upload2">导出</el-button>
                <el-button size="mini" icon="el-icon-position">送审</el-button>
            </el-button-group> -->
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "certificate-search",
        data () {
            return {
                form:{
                    keywords:'',
                    status:''
                }
            }
        },
        methods: {
            addCertificate () {
                this.$emit('addCer')
            }
        }
    }
</script>

<style lang="scss">
.certificate-search{
    .el-form-item--mini.el-form-item{
        margin-bottom: 0px;
    }
}
</style>
