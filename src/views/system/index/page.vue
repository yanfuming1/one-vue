<template>
    <d2-container type="fulls">
        <div class="index___top">
            <!--通知栏-->
            <el-row :gutter="20">
                <el-col :span="24">
                    <inform-information />
                </el-col>
            </el-row>
             
            <el-row :gutter="20">
                <!--轮播图-->
                <el-col :span="10">
                    <announcement />
                </el-col>
                <!--日期-->
                <el-col :span="6">
                    <workSchedule />
                </el-col>
                <!--常用快捷-->
                <el-col :span="8">
                    <commonlyShortcut />
                </el-col>
            </el-row>
        </div>
        <div class="index___bottom">
            <operation-information />
        </div>
    </d2-container>
</template>

<script>
    import informInformation from './informInformation'
    import operationInformation from './operationInformation'
    import announcement from './components/announcement'
    import workSchedule from './components/workSchedule'
    import commonlyShortcut from './components/commonlyShortcut'
    export default {

        name: 'index',

        components: {
            'inform-information': informInformation,
            'operation-information': operationInformation,
            'announcement': announcement,
            'workSchedule': workSchedule,
            'commonlyShortcut': commonlyShortcut
        }
    }
</script>

<style lang='scss' scoped>
    .index___top {
        box-shadow: 0 2px 12px 0 $color-border-shadow;
        height: 445px;
        min-height: 117px;
        background: $color-bg3;
        padding: 15px 30px;
    }
    .index___bottom {
        height: 330px;
        margin-top: 20px;
        box-shadow: 0 2px 12px 0 $color-border-shadow;
        background: $color-bg3;
        font-size: 14px;
    }
</style>
