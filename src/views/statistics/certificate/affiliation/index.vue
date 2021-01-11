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
            @keyup.enter.native="searchModelSynopsis"
            v-model="filterText"
            size="mini"
          >
          </el-input>
          <el-date-picker
            v-model="startTime"
            align="right"
            type="year"
            size="mini"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 150px;padding-right:0px;margin-right:10px"
            placeholder="选择起始年"
          >
          </el-date-picker>
          <el-date-picker
            v-model="endTime"
            align="right"
            type="year"
            value-format="yyyy"
            size="mini"
            style="width: 150px;padding-right:0px;margin-right:10px"
            placeholder="选择结束年"
          >
          </el-date-picker>
          <el-button
            type="primary"
            class="qqt-container-full-header-top___button"
            @click="searchModelSynopsis"
            >搜索</el-button
          >
          <el-button
            type="info"
            class="qqt-container-full-header-top___button"
            @click="resetModelSynopsis"
            >重置</el-button
          >
        </span>
      </div>
    </template>
    <div class="qqt-container-full___center">
      <!-- <qqt-table show-summary :data="tableData" ref="table" :exportData="tableData.records" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange" /> -->

      <el-table :data="tableData" border show-summary>
        <el-table-column
          v-for="(item, index) in rowHeader"
          :key="index"
          :prop="item == '姓名' ? 'name' : item == '合计' ? 'totalMoney' : item"
          :label="item"
        >
        </el-table-column>
      </el-table>
      <div id="myChartAfA"></div>
    </div>
  </d2-container>
</template>

<script>
import { searchQueryList } from "@/api/statistics/certificate/index";
import { qqtTable } from "@/components/qqt-subassembly";
import { mapState } from "vuex";

import util from "@/libs/util.js";
import { log } from "util";
export default {
  data() {
    return {
      filterText: "",
      options: [],
      createDate: [],
      tableSelectData: [],
      tableOption: {
        border: false,
        height: 610,
      },
      startTime: "",
      endTime: "",
      transform: {
        isShowDetails: false,
      },
      dynamicHeader: {
        tableId: "",
        isSave: false,
      },
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
      tableData: [],
      rowHeader: [],
      timeData: [],
      seriesData: [],
      nameData: []
    };
  },

  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChartAfA"));
      // 绘制图表
      myChart.setOption({
        title: {
          text: "证书挂靠费",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: this.nameData,
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
          data: this.timeData,
        },
        yAxis: {
          type: "value",
        },
        series: this.seriesData,
      });
    },
    selectChange(item) {
      this.tableSelectData = item;
    },

    searchModelSynopsis() {
      this.getIndexPage({
        name: this.filterText ? this.filterText : null,
        startTime: this.startTime ? this.startTime : null,
        endTime: this.endTime
          ? Number(this.endTime) + 1 + "-01-01 00:00:00"
          : null,
        pageNo: this.page.current,
        pageSize: this.page.size,
      });
    },

    handlePaginationChange(page) {
      this.page = page;
      this.$nextTick(() => {
        this.searchModelSynopsis();
      });
    },

    getIndexPage(name) {
      searchQueryList({
        ...name,
        pageNo: this.page.current,
        pageSize: this.page.size,
      }).then((res) => {
        // if (res) this.tableData = res
        this.rowHeader.splice(0, this.rowHeader.length, ...res.tableTime);
        this.tableData = res.mapName;
        console.log(res)
        this.timeData = res.tableTime.slice(1,-1)
        let mapName = []
        res.mapName.forEach((element, index) => {
          console.log(element, index)
          mapName[index] = mapName[index] || {}
          mapName[index].name = res.mapName[index].name
          mapName[index].data = []
          this.timeData.forEach(item => {
            mapName[index].data.push(res.mapName[index][item])
          })
          mapName[index].type = 'line'
        });
        this.nameData = res.mapName.map(item => {
          return item.name
        })
        console.log(mapName)
        this.seriesData = mapName
        this.drawLine();
      });
    },

    deleteIndexObject(id) {
      this.deleteIndexById({ ids: id });
    },

    // deleteIndexList () {
    //     if (this.tableSelectData.length === 0) {
    //         this.$message.warning ('请选择一条数据')
    //         return
    //     }
    //     let ids = ''
    //     if (this.tableSelectData && this.tableSelectData.length > 0) {
    //         this.tableSelectData.forEach(res => {
    //             ids += res.id + ','
    //         })
    //     }
    //     this.deleteIndexById ({'ids': ids.substring(0, ids.length - 1)})
    // },

    deleteIndexById(id) {
      util.confirm().then((boolean) => {
        if (boolean) {
          deleteBatchIndex(id).then((res) => {
            if (res.code === 200) {
              this.$message.success(res.message);
              this.getIndexPage();
            }
          });
        }
      });
    },

    // addIndex () {
    //     this.transform.isShowDetails = false
    //     this.routerLink ('添加供应商')
    // },

    resetModelSynopsis() {
      this.filterText = "";
      this.createDate = [];
      this.getIndexPage();
    },

    // exportExcel () {
    //     this.$refs.table.getExportExcel ()
    // },

    // routerLink (title, id = '') {
    //     this.$router.push ({
    //         path: 'addIndex',
    //         name: 'addIndex',
    //         params: {
    //             relevancyId: id,
    //             transform: this.transform,
    //         }
    //     })
    //     this.$store.commit ('d2admin/page/titleSet', title)
    // },
  },

  components: {
    "qqt-table": qqtTable,
  },
  mounted() {
    
  },
  created() {
    this.getIndexPage();
  },
};
</script>
<style scoped>
#myChartAfA {
  margin-top: 20px;
  width: 1200px;
  height: 300px;
}
</style>
