<template>
    <el-form :model="formInline" class="demo-form-inline">
        <el-row>
            <el-col :span="20">
                <div class="top-option">
                    <el-col :span="21">
                        <el-button size="mini" type="primary">批量删除</el-button>
                    </el-col>
                </div>
            </el-col>
            <el-col :span="4" class="help-icon">
                <i class="el-icon-warning-outline"></i>
            </el-col>
        </el-row>
    </el-form>
</template>

<script>
    export default {
        name: "from-search",
        data () {
            return {
                options: [{
                    value: '选项1',
                    label: '黄金糕'
                }, {
                    value: '选项2',
                    label: '双皮奶'
                }],
                searchAll: '',
                value: '',
                formInline: {
                    keywords: '',
                    isJob: ''
                }
            }
        },
        methods : {
            addUser () {
                this.$emit('addUser')
            }
        }
    }
</script>

<style scoped lang="scss">
.top-option{
    input,.top-option .el-input__inner{
        height: 28px !important;
    }
    .el-input__icon{
        line-height: 28px !important;
    }
    .style{
        font-size: 14px !important;
    }
    .select{
        width: 120px;
    }
}
</style>
