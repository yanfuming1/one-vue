<template>
  <d2-container type="fulls">
      <template slot="header">
            <div class="qqt-container-full-header___top">
                <!-- <span class="qqt-container-full-header-operation___left"> -->
                    <!-- <el-button type="primary" class="qqt-container-full-header-top___button" @click="addIndex">添加</el-button> -->
                <!-- </span> -->
                <span class="qqt-container-full-header___search">
                    <el-input
                        placeholder="请输入内容"
                        prefix-icon="el-icon-search"
                        v-model="queryData.name" size="mini">
                    </el-input>
                    <el-date-picker
                        v-model="queryData.startTime"
                        align="right"
                        type="year"
                        size="mini"
                        value-format="yyyy"
                        style="width: 150px;padding-right:0px;margin-right:10px"
                        placeholder="选择起始年">
                    </el-date-picker>
                    <el-date-picker
                        v-model="queryData.endTime"
                        align="right"
                        type="year"
                        value-format="yyyy"
                        size="mini"
                        style="width: 150px;padding-right:0px;margin-right:10px"
                        placeholder="选择结束年">
                    </el-date-picker>
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="getData">搜索</el-button>
                    <el-button type="info" class="qqt-container-full-header-top___button">重置</el-button>
                </span>
            </div>
        </template>
        <div class="qqt-container-full___center">
            <div id="myChartYOY"></div>
        </div>
  </d2-container>
</template>

<script>
import { queryYearBasis } from "@/api/statistics/certificate/index";
export default {
    data () {
        return {
            filterText: '',
            queryData: {
                name: '',
                startTime: '',
                endTime: ''
            },
            timeData: [],
            priceList: []

        }
    },
    mounted () {
        
    },
    methods: {
        getData () {
            let _queryData = JSON.parse(JSON.stringify(this.queryData))
            _queryData.endTime = _queryData.endTime ? Number(_queryData.endTime) + 1
          : null
            queryYearBasis(_queryData).then(res => {
                this.timeData = res['timeList']
                this.priceList = res['priceList']
                this.basisList = res['basisList']
                this.drawLine()
            })
        },
        drawLine(){
            // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById('myChartYOY'))
            // 绘制图表
            myChart.setOption({
                    title: {
                        text: '个人证书挂靠费同比增长'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['挂靠费','同比增长']
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: this.timeData
                        }
                    ],
                    yAxis: [
                         {
                            type: 'value',
                            name: '挂靠费（元）',
                            show:true,
                            
                        },
                        {
                            type: 'value',
                            name: '同比增长率',
                            min: 0,
                            max: 100,
                            interval: 10,
                            axisLabel: {
                                formatter: '{value} %'
                            }
                        }
                    ],
                    series: [
                         
                        {
                            name:'本年挂靠费',
                            type:'bar',
                            /*设置柱状图颜色*/
                            itemStyle: {
                                normal: {
                                    color: function(params) {
                                        // build a color map as your need.
                                        var colorList = [
                                            '#0099CC','#0099CC','#0099CC','#0099CC','#0099CC','#0099CC','#0099CC','#0099CC'
                                        ];
                                        return colorList[params.dataIndex]
                                    },
                                    /*信息显示方式*/
                                    label: {
                                        show: true,
                                        position: 'top',
                                        formatter: '{c}元'
                                    }
                                }
                            },
                            data: this.priceList
                        },
                        {
                            name:'同比增长',
                            type:'line',
                            yAxisIndex: 1,
                            itemStyle : {  /*设置折线颜色*/
                                normal : {
                                    color:'#c4cddc',
                                    // label: {
                                    //     show: true,
                                    //     position: 'top',
                                    //     formatter: '{c}%'
                                    // }
                                }
                            },
                            data: this.basisList
                        }
                    ]
            });
        },
    }
}
</script>

<style scoped>
#myChartYOY {
    padding-top: 20px;
    width: 1200px;
    height: 600px;
}
</style>