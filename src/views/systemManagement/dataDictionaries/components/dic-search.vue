<template>
    <!-- Header （搜索 + 按钮） -->
    <div slot="header">
        <el-form :inline="true" size="mini" :model="formData">
            <el-form-item label prop="name">
                <el-input prefix-icon="el-icon-search" placeholder="请输入需搜索的内容" style="width: 200px;" v-model="formData.keywords"/>
            </el-form-item>
            <el-form-item>
                <el-select placeholder="请选择要搜索的状态" style="width: 160px;" clearable v-model="formData.status">
                    <el-option label="启用" value="1" />
                    <el-option label="禁用" value="0" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchDic">搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="info" @click="clearAll">重置</el-button>
            </el-form-item>
            <!-- <el-form-item>
                <el-button type="danger" @click="delIds">批量删除</el-button>
            </el-form-item> -->
<!--            <el-button-group class="m-l-20">-->
<!--                <el-button size="mini" icon="el-icon-download">导入</el-button>-->
<!--                <el-button size="mini" icon="el-icon-upload2">导出</el-button>-->
<!--            </el-button-group>-->
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "dic-search",
        data() {
          return {
              formData: {
                  keywords: '',
                  status: ''
              }
          }
        },
        methods: {
            delIds () {
                this.$emit('delIds')
            },
            clearAll () {
                this.formData = {}
                this.$emit('search', this.formData)
            },
            searchDic () {
                this.$emit('search', this.formData)
            }
        }
    }
</script>

<style scoped>

</style>
