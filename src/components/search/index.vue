<template>
    <div class="customer-list-header">
        <div class="customer-list-header___top">
                <span class="customer-list-header-operation___left">
                    <el-button type="primary" class="customer-list-header-button" @click="addCertificate">添加</el-button>
                </span>
            <span class="customer-list-header___search">
                    <el-input
                            placeholder="请输入内容"
                            prefix-icon="el-icon-search"
                            v-model="filterText"
                            size="mini">
                    </el-input>
                    <el-button type="primary" class="customer-list-header-button" @click="searchModelSynopsis">搜索</el-button>
                </span>
            <span class="customer-list-header-operation___right">
                    <el-button type="primary" class="customer-list-header-button" @click="deleteBatch">批量删除</el-button>
                    <el-button type="primary" class="customer-list-header-button" @click="cerBorrow">证书借用</el-button>
                </span>
            <span class="customer-list-header-operation___right">
                    <el-button-group>
                        <el-button size="mini" icon="el-icon-download" @click="">导入</el-button>
                        <el-button size="mini" icon="el-icon-upload2" @click="">导出</el-button>
                        <el-button size="mini" icon="el-icon-position" @click="">送审</el-button>
                        <el-button size="mini" icon="el-icon-share" @click="">共享</el-button>
                    </el-button-group>
                </span>
            <span class="customer-list-header___audit">
                    <el-button-group>
                        <el-button size="mini" icon="el-icon-download">审核</el-button>
                        <el-button size="mini" icon="el-icon-download">反审核</el-button>
                    </el-button-group>
                </span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "index"
    }
</script>

<style scoped lang="scss">
    .customer-list {
        .customer-list-header {
            padding-top: 10px;
            .customer-list-header___top{
                .customer-list-header___search {
                    .el-input {
                        width: 10%;
                        padding-right: 10px;
                        top: -1px;
                    }
                }
                .customer-list-header___state{
                    padding-left: 10px;
                    p {
                        display: inline-block;
                    }
                    .customer-list-header-state___select {
                        padding-left: 10px;
                        width: 5%;
                        display:inline-block;
                    }
                }
                .customer-list-header-operation___left {
                    padding-right: 10px;
                }
                .customer-list-header-operation___right {
                    padding-left: 20px;
                }
                .customer-list-header___audit {
                    padding-left: 20px;
                    .el-button {
                        background: $color-button-reset !important;
                    }
                }
            }
        }
    }
    .customer-list-header-button {
        padding: 0 5px;
        height: 26px;
        border-radius: 3px;
    }
    .el-button--mini, .el-button--mini.is-round {
        padding: 6px 5px !important;
        top: -1px
    }
</style>
