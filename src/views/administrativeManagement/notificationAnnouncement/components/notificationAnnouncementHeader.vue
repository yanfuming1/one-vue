<template>
    <div>
        <el-form :inline="true" ref="form" size="mini">
            <el-form-item>
                <el-button type="primary" @click="addPublishEven">新增公告</el-button>
            </el-form-item>
            <el-form-item label prop="name">
                <el-input v-model="keywords" prefix-icon="el-icon-search" placeholder="请输入需搜索的内容" style="width: 200px;" :clearable="true"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="dataSearch">搜索</el-button>
            </el-form-item>
            <el-form-item>状态</el-form-item>
            <el-form-item label prop="status">
                <el-select v-model="status" placeholder="请选择要搜索的状态" style="width: 160px;" clearable @change ="statusData" value="">
                    <el-option label="已下线" value="0" />
                    <el-option label="已发布" value="1" />
                    <el-option label="未发布" value="2" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="deletePubilshNews">批量删除</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="info" @click="clearAll">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    export default {
        name: 'publishNewsHeader',
        data () {
            return {
                radio1: '全部',
                keywords: '',
                status:'',
            };
        },
        methods: {
            dataSearch () {
                this.$emit('dataSearch', this.keywords)
            },
            statusData () {
                this.$emit('statusData', this.status)
            },
            addPublishEven () {
                this.$emit('addPublishEven')
            },
            deletePubilshNews () {
                this.$emit('deletePubilshNews')
            },
            clearAll () { 
                this.keywords= '',
                this.status=''
            }
    }
    }
</script>

<style scoped>
  
</style>