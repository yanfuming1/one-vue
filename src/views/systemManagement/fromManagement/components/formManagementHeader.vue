<template>
    <div>
        <el-form :inline="true" :model="publishNewsData" ref="form" size="mini">
            <el-form-item>
                <el-button type="primary" @click="addPubilshNews" v-model="publishNewsData">添加</el-button>
            </el-form-item>
            <el-form-item label prop="name">
                <el-input v-model="publishNewsData.keywords" prefix-icon="el-icon-search" placeholder="请输入需搜索的内容" style="width: 200px;" :clearable="true"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="dataSearch">搜索</el-button>
                <el-button type="info" @click="resetSearch">重置</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="deleteAll">批量删除</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    export default {
        name: 'fromManagementHeader',
        data () {
            return {
                radio1: '全部',
                 publishNewsData: {
                    keywords: '',
                    bstatus:'',
                },
            };
        },
        methods: {
            dataSearch () {
                this.$emit('dataSearch', this.publishNewsData)
            },
            addPubilshNews () {
                this.$emit('publishNewsData', this.publishNewsData)
            },
            deleteAll () {
                this.$emit('deleteAll')
            },
            resetSearch() {
                this.publishNewsData.keywords = ''
                this.$emit('dataSearch', this.publishNewsData)
            }
        }
    }
</script>

<style scoped>

</style>
