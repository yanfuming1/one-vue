<template>
    <div class="operationInformation">
        <el-row :gutter="30">
            <!--事项处理-->
            <el-col :span="12">
                <matter-dispose />
            </el-col>
            <el-col :span="1">
                <div class="line"></div>
            </el-col>
            <!--项目列表-->
            <el-col :span="11">
                <project-information />
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import matterDispose from './components/matterDispose'
    import projectInformation from './components/projectInformation'
    export default {

        components: {
            'matter-dispose': matterDispose,
            'project-information': projectInformation
        },

        data () {
            return {
            }
        },

        methods: {}
    }
</script>

<style lang='scss' scoped>
    .operationInformation {
        padding: 15px 30px;
        .line {
            border-left: 1px solid $color-straight-line2;
            height: 290px;
            float: left;
        }
        .el-col-11 {
            width: 49%;
            padding-left: 0px !important
        }
        .el-col-1 {
            width: 1%;
            padding-left: 0px !important;
            padding-right: 0px !important 
        }
    }
</style>
