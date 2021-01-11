<template>
    <div class="workSchedule">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>{{ time }}</span>
                <i class="el-icon-date"/>
                <div class="line"></div>
            </div>
            <date-table :date="defaultTime"/>
        </el-card>
    </div>
</template>

<script>
    import dateTable from 'element-ui/packages/date-picker/src/basic/date-table.vue'
    export default {

        components: {
            'date-table': dateTable
        },

        data () {
            return {
                defaultTime: new Date (),
                time: new Date ().format ('yyyy年MM月')
            }
        },

        methods: {}
    }
</script>

<style lang='scss'>
    .workSchedule {
        .box-card {
            height: 350px;
            .clearfix {
                font-size: 16px;
                .line {
                    border-bottom: 2px solid $startusing;
                    width: 85px;
                    position: relative;
                    top: 8px
                }
                i {
                    float: right;
                    color: $startusing;
                    font-size: 22px
                }
            }
        }
        .el-card__header {
            border-bottom: 1px solid transparent !important
        }
        .el-card__body {
            padding: 0 20px 20px;
        }
        .el-date-table td {
            width: 50px;
        }
    }
</style>
