<template>
     <d2-container class="analyzeDetail"  type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <project-info></project-info>
            </div>
        </template>
        <el-card class="box-card closeHeader" style="height:100%">
             <el-button type="text" @click="cancelBtn" class="closeBtn"><i class="el-icon-close"></i></el-button>
            <dv-charts :option="option" />    
        </el-card>
    </d2-container>
</template>

<script>
    import projectInfo from '../../../components/commenInfo/projectInfo';
    import { selfSchedulePlanAllList } from '@/api/selfProject/scheduleManagement/schedulePlan/index';
    import { mapState } from 'vuex';

    export default {
        components: {
            projectInfo,
        },
        data() {
            return {
                tableData:[],
                page: {
                    current: 1,
                    size: 100,
                    total: 0
                },
               option: {
                    title: {
                        text: '进度计划视图',
                        style: {
                            fontSize: 26,
                            fill: '#000'
                        }
                    },
                    xAxis: {
                        name: '名称',
                        data: [],
                        nameTextStyle: {
                            fill: '#000',
                            fontSize: 14
                        },
                        axisLine: {
                            style: {
                                stroke: '#000000',
                                lineWidth: 1
                            }
                        },
                        axisLabel: {
                            style: {
                                fill: '#000000',
                                fontSize: 10,
                                rotate:50,
                                textAlign: 'left',
                                textBaseline: 'top'
                            }
                        },
                        axisTick: {
                            style: {
                                stroke: '#000000',
                                lineWidth: 1
                            }
                        },
                        splitLine: {
                            style: {
                                stroke: '#000000',
                                lineWidth: 100
                            }
                        }
                    },
                    yAxis: {
                        name: '(完成比)',
                        data: 'value',
                        min: 0,
                        max: 100,
                        interval: 20,
                       
                        nameTextStyle: {
                            fill: '#000',
                            fontSize: 14
                        },
                        axisLine: {
                            style: {
                                stroke: '#000000',
                                lineWidth: 1
                            }
                        },
                        axisLabel: {
                            formatter: '{value} %',
                            style: {
                                fill: '#000000',
                                fontSize: 14,
                                rotate: 0
                            }
                        },
                        axisTick: {
                            style: {
                                stroke: '#000000',
                                lineWidth: 1
                            }
                        }
                    },
                    series: [
                        {
                            data: [],
                            type: 'bar',
                            independentColor: {
                                color: ['#3EB7FC']
                            },
                            label: {
                                formatter: '{value} %',
                                show: true,
                                position: 'top',
                                offset: [0, -10],
                                style: {
                                    fill: '#000',
                                }
                            },
                        }
                    ],
                    
                }
            }
        },
        methods: {
            getBudgetInfoPage (id) {
                selfSchedulePlanAllList ({'overallId':id}).then( res => {
                    if (res &&res.length) {
                        this.tableData = res;
                        this.resetData(res)
                    } else {
                        this.$message.error('暂无数据')
                    }
                })
            },
            cancelBtn() {
                this.$router.go(-1)
            },
            resetData (data) {
                let xData = [];
                let yData = [];
                data.forEach(ele => {
                    xData.push(ele.name);
                    yData.push(ele.donePercent);

                });
                this.option.xAxis.data = xData;
                this.$set(this.option,'data',xData)
                this.$forceUpdate();
                this.option.series[0].data = yData;
            }
        },
        computed: {
            ...mapState ('d2admin/selfSupportProject', [
                'selfSupportProject'
            ])
        },
        mounted () {
            this.getBudgetInfoPage(this.$route.params.relevancyId)
        },
    
        watch: {
          
        }
    }
</script>

<style lang="scss" scoped>
.analyzeDetail{
    .card{
        background: #ffffff;
        padding: 10px;
        height: 100%;
        border-radius: 5px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }
}

</style>
<style lang="scss">
.analyzeDetail{
    .el-card__body{
        height:100%;
        padding: 0;
    }
    .qqt-container-full__body{
        padding: 0 20px !important;
    }
    .closeBtn{
        position: absolute;
        right: 20px;
        font-size: 20px;
        padding: 7px 7px 13px 13px !important;
        font-size: 20px;
        color: #505050;
        border-radius: 0;
        background-color: rgba(14,144,254,.17);
        border-bottom-left-radius: 90%;
        z-index: 9999999;
    }
}
</style>