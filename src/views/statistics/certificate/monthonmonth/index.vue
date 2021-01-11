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
            v-model="queryData.name"
            size="mini"
          >
          </el-input>
          <el-date-picker
            v-model="queryData.startTime"
            align="right"
            type="year"
            size="mini"
            value-format="yyyy-MM-dd"
            style="width: 150px;padding-right:0px;margin-right:10px"
            placeholder="选择年份"
          >
          </el-date-picker>
          <!-- <el-date-picker
                        v-model="endTime"
                        align="right"
                        type="year"
                        value-format="yyyy"
                        size="mini"
                        style="width: 150px;padding-right:0px;margin-right:10px"
                        placeholder="选择结束年">
                    </el-date-picker> -->
          <el-button
            type="primary"
            class="qqt-container-full-header-top___button"
            @click="getData"
            >搜索</el-button
          >
          <el-button type="info" class="qqt-container-full-header-top___button"
            >重置</el-button
          >
        </span>
      </div>
    </template>
    <div class="qqt-container-full___center">
      <div id="myChartMOM"></div>
    </div>
  </d2-container>
</template>

<script>
import { certificate } from "@/api/statistics/certificate/index";
export default {
  data() {
    return {
      filterText: "",
      queryData: {
        name: "",
        startTime: "",
      },
      timeData: [],
      basisList: [],
    };
  },
  mounted() {},
  methods: {
    getData() {
      if (!this.queryData.name) {
        this.$message.error('请输入查询名字')
        return
      }
      if (!this.queryData.startTime) {
        this.$message.error('请选择查询时间')
        return
      }
      certificate(this.queryData).then((res) => {
        if (res) {
          this.timeData = res.timelist;
        this.basisList = res.basisList;
        this.drawLine();
        } else {
          this.$message.error('暂无数据')
        }
      });
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChartMOM"));
      // 绘制图表
      myChart.setOption({
        title: {
          text: "个人证书挂靠费环比增长",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: [this.queryData.name],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          name: "月",
          data: this.timeData,
        },
        yAxis: [
          {
            type: "value",
            name: "环比比增长率",
            min: 0,
            // max: 100,
            interval: 10,
            axisLabel: {
              formatter: "{value} %",
            },
          },
        ],
        series: [
          {
            name: this.queryData.name,
            type: "line",
            smooth: true,
            data: this.basisList,
          },
        ],
      });
    },
  },
};
</script>

<style scoped>
#myChartMOM {
  padding-top: 20px;
  width: 1200px;
  height: 600px;
}
</style>
