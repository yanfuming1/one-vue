<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <project-info></project-info>
            </div>
        </template>
        <el-button style="margin-bottom:5px" size="mini" type="primary" @click="$router.go(-1)">返回</el-button>
        <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
            type="index"
            label="序号"
            align="center"
            width="50">
            </el-table-column>
            <el-table-column
                prop="planName"
                label="计划名称"
                align="center"
                width="280">
            </el-table-column>
            <el-table-column align="center" label="任务没开工，且晚于最迟开始时间开工">
                <el-table-column
                prop="startLagNum"
                label="滞后项"
                align="center"
                >
                </el-table-column>
                <el-table-column
                prop="startLagPercent"
                align="center"
                :formatter="formatter"
                label="所占比例"
                >
                </el-table-column>
            </el-table-column>
            <el-table-column align="center" label="任务没完工，且晚于最迟结束时间完工">
                <el-table-column
                prop="endLagNum"
                align="center"
                label="滞后项"
                >
                </el-table-column>
                <el-table-column
                prop="endLagPercent"
                align="center"
                :formatter="formatter1"
                label="所占比例"
                >
                </el-table-column>
            </el-table-column>
        </el-table>
    </d2-container>
</template>

<script>
    import projectInfo from '../../../components/commenInfo/projectInfo';
    import { selfScheduleOverallAllList } from '@/api/selfProject/scheduleManagement/schedulePlan/index';
    import { mapState } from 'vuex';
    export default {
        components: {
            'project-info': projectInfo,
        },
        data() {
            return {
                tableData:[]
            }
        },
        methods: {
            getData(id) {
                selfScheduleOverallAllList ({projectCode:id}).then((res) => {
                    this.tableData = res;
                }).catch((err) => {
                    
                });
                
            },
            formatter(row, column) {
                return row.startLagPercent ? row.startLagPercent + ' %' : '0 %';
            },
            formatter1(row, column) {
                return row.endLagPercent ? row.endLagPercent + ' %' : '0 %';
            },
        },
        mounted () {
        },
        computed: {
            ...mapState ('d2admin/selfSupportProject', [
                'selfSupportProject'
            ])
        },

        async created () {
            this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad')
        },

        watch: {
            selfSupportProject (value) {
                this.getData (value.projectCode)
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>