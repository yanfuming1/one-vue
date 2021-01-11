<template>
  <div class="BWP-con-div">
    <h3 style="text-align:center">施工机械台时(班)费汇总表</h3>
    <!-- <div class="defaultText">合同编号 {{datasource.data.projectCode}}</div>
    <div class="defaultText">工程名称 {{datasource.data.name}}</div> -->
    <el-table :data="tableData" border="" :header-cell-style="tableHeaderColor">
      <el-table-column label="序号" align="center">
        <template slot-scope="{row,$index}">
          <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
            <el-input v-if="row.status" v-model="row.numberOrder" @blur="inputblur($index, row.budgetId, row.bgId, 'numberOrder')"></el-input>
            <span v-else>{{row.numberOrder}}</span>
          </div>
          <div v-else>
            <span>{{row.numberOrder}}</span>
            <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.numberOrderChange" 
                @click="changeClick(row.budgetId, row.bgId, 'numberOrder')"></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="机械名称" align="center">
        <template slot-scope="{row,$index}">
        <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
            <el-input v-if="row.status" v-model="row.name" @blur="inputblur($index, row.budgetId, row.bgId, 'name')"></el-input>
            <span v-else>{{row.name}}</span>
        </div>
        <div v-else>
          <span>{{row.name}}</span>
          <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.nameChange" 
                @click="changeClick(row.budgetId, row.bgId, 'name')"></i>
        </div>
        </template>
      </el-table-column>
      <el-table-column prop="model" label="型号规格" align="center">
        <template slot-scope="{row,$index}">
        <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
            <el-input v-if="row.status" v-model="row.model" @blur="inputblur($index, row.budgetId, row.bgId, 'model')"></el-input>
            <span v-else>{{row.model}}</span>
        </div>
        <div v-else>
          <span>{{row.model}}</span>
          <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.modelChange" 
                @click="changeClick(row.budgetId, row.bgId, 'model')"></i>
        </div>
        </template>
      </el-table-column>
      <el-table-column label="第一类费用">
        <el-table-column prop="depreciationCost" label="折旧费" align="center">
            <template slot-scope="{row,$index}">
            <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
                <el-input v-if="row.status" v-model="row.depreciationCost" @blur="inputblur($index, row.budgetId, row.bgId, 'depreciationCost')"></el-input>
                <span v-else>{{row.depreciationCost}}</span>
            </div>
            <div v-else>
              <span>{{row.depreciationCost}}</span>
              <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.depreciationCostChange" 
                @click="changeClick(row.budgetId, row.bgId, 'depreciationCost')"></i>
            </div>
            </template>
        </el-table-column>
        <el-table-column prop="repair" label="修理及替换设备费" align="center">
            <template slot-scope="{row,$index}">
            <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
                <el-input v-if="row.status" v-model="row.repair" @blur="inputblur($index, row.budgetId, row.bgId, 'repair')"></el-input>
                <span v-else>{{row.repair}}</span>
            </div>
            <div v-else>
              <span>{{row.repair}}</span>
              <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.repairChange" 
                @click="changeClick(row.budgetId, row.bgId, 'repair')"></i>
            </div>
            </template>
        </el-table-column>
        <el-table-column prop="install" label="安装拆卸费" align="center">
            <template slot-scope="{row,$index}">
            <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
                <el-input v-if="row.status" v-model="row.install" @blur="inputblur($index, row.budgetId, row.bgId, 'install')"></el-input>
                <span v-else>{{row.install}}</span>
            </div>
            <div v-else>
              <span>{{row.install}}</span>
              <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.installChange" 
                @click="changeClick(row.budgetId, row.bgId, 'install')"></i>
            </div>
            </template>
        </el-table-column>
        <el-table-column prop="firstKind" label="小计" align="center">
            <template slot-scope="{row,$index}">
            <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
                <el-input v-if="row.status" v-model="row.firstKind" @blur="inputblur($index, row.budgetId, row.bgId, 'firstKind')"></el-input>
                <span v-else>{{row.firstKind}}</span>
            </div>
            <div v-else>
              <span>{{row.firstKind}}</span>
              <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.firstKindChange" 
                @click="changeClick(row.budgetId, row.bgId, 'firstKind')"></i>
            </div>
            </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="第二类费用">
        <el-table-column prop="laborCost" label="人工工时(日)" align="center">
            <template slot-scope="{row,$index}">
            <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
                <el-input v-if="row.status" v-model="row.laborCost" @blur="inputblur($index, row.budgetId, row.bgId, 'laborCost')"></el-input>
                <span v-else>{{row.laborCost}}</span>
            </div>
            <div v-else>
              <span>{{row.laborCost}}</span>
              <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.laborCostChange" 
                @click="changeClick(row.budgetId, row.bgId, 'laborCost')"></i>
            </div>
            </template>
        </el-table-column>
        <el-table-column prop="gasoline" label="汽油(kg)" align="center">
            <template slot-scope="{row,$index}">
            <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails" >
                <el-input v-if="row.status" v-model="row.gasoline" @blur="inputblur($index, row.budgetId, row.bgId, 'gasoline')"></el-input>
                <span v-else>{{row.gasoline}}</span>
            </div>
            <div v-else>
              <span>{{row.gasoline}}</span>
              <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.gasolineChange" 
                @click="changeClick(row.budgetId, row.bgId, 'gasoline')"></i>
            </div>
            </template>
        </el-table-column>
        <el-table-column prop="diesel" label="柴油(kg)" align="center">
            <template slot-scope="{row,$index}">
            <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
                <el-input v-if="row.status" v-model="row.diesel" @blur="inputblur($index, row.budgetId, row.bgId, 'diesel')"></el-input>
                <span v-else>{{row.diesel}}</span>
            </div>
            <div v-else>
              <span>{{row.diesel}}</span>
              <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.dieselChange" 
                @click="changeClick(row.budgetId, row.bgId, 'diesel')"></i>
            </div>
            </template>
        </el-table-column>
        <el-table-column prop="electricity" label="电(kwh)" align="center">
            <template slot-scope="{row,$index}">
            <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
                <el-input v-if="row.status" v-model="row.electricity" @blur="inputblur($index, row.budgetId, row.bgId, 'electricity')"></el-input>
                <span v-else>{{row.electricity}}</span>
            </div>
            <div v-else>
              <span>{{row.electricity}}</span>
              <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.electricityChange" 
                @click="changeClick(row.budgetId, row.bgId, 'electricity')"></i>
            </div>
            </template>
        </el-table-column>
        <el-table-column prop="wind" label="风(m3)" align="center">
            <template slot-scope="{row,$index}">
            <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
                <el-input v-if="row.status" v-model="row.wind" @blur="inputblur($index, row.budgetId, row.bgId, 'wind')"></el-input>
                <span v-else>{{row.wind}}</span>
            </div>
            <div v-else>
              <span>{{row.wind}}</span>
              <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.windChange" 
                @click="changeClick(row.budgetId, row.bgId, 'wind')"></i>
            </div>
            </template>
        </el-table-column>
        <el-table-column prop="water" label="水(m3)" align="center">
            <template slot-scope="{row,$index}">
            <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
                <el-input v-if="row.status" v-model="row.water" @blur="inputblur($index, row.budgetId, row.bgId, 'water')"></el-input>
                <span v-else>{{row.water}}</span>
            </div>
            <div v-else>
              <span>{{row.water}}</span>
              <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.waterChange" 
                @click="changeClick(row.budgetId, row.bgId, 'water')"></i>
            </div>
            </template>
        </el-table-column>
        <el-table-column prop="secondKind" label="小计" align="center">
            <template slot-scope="{row,$index}">
            <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
                <el-input v-if="row.status" v-model="row.secondKind" @blur="inputblur($index, row.budgetId, row.bgId, 'secondKind')"></el-input>
                <span v-else>{{row.secondKind}}</span>
            </div>
            <div v-else>
              <span>{{row.secondKind}}</span>
              <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.secondKindChange" 
                @click="changeClick(row.budgetId, row.bgId, 'secondKind')"></i>
            </div>
            </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="thirdKind" label="第三类费用" align="center">
        <template slot-scope="{row,$index}">
          <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
            <el-input v-if="row.status" v-model="row.thirdKind" @blur="inputblur($index, row.budgetId, row.bgId, 'thirdKind')"></el-input>
            <span v-else>{{row.thirdKind}}</span>
          </div>
          <div v-else>
            <span>{{row.thirdKind}}</span>
            <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.thirdKindChange" 
                @click="changeClick(row.budgetId, row.bgId, 'thirdKind')"></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="totalPrice" label="合计" align="center">
        <template slot-scope="{row,$index}">
          <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
            <el-input v-if="row.status" v-model="row.totalPrice" @blur="inputblur($index, row.budgetId, row.bgId, 'totalPrice')"></el-input>
            <span v-else>{{row.totalPrice}}</span>
          </div>
          <div v-else>
            <span>{{row.totalPrice}}</span>
            <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.totalPriceChange" 
                @click="changeClick(row.budgetId, row.bgId, 'totalPrice')"></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 20px 0px;text-align:center;" v-if="!isShowDetails">
      <el-button type="success" size="mini" @click="addRow">添加</el-button>
      <el-button type="primary" size="mini" @click="childrenClick">保存</el-button>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import util from '@/libs/util';
export default {
  props: ["datasource", "callback", "isShowDetails", "fromChange"],
  data() {
    return {
      tableData: [],
      selectEdKey: "",
      updateValue: "",
    };
  },
  methods: {
    // 子组件回调
    childrenClick() {
      this.updataStatus (true)
      this.callback(this.tableData);
    },

    updataStatus (boolean) {
      let tempList = []
      this.tableData.map((item, indexs) => {
        if (boolean) item.status = false;
        tempList.push(item);
      });
      this.tableData = tempList;
    },

    // 修改表头样式
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "background-color: lightblue;color: #fff;font-weight: 500;";
      }
    },
    inputblur(index, budgetId, bgId, fieldName) {
      this.updataStatus (false)
      let fieldValue = this.tableData[index][fieldName]
      this.$emit('changeValue', budgetId || this.datasource.budgetId, bgId || '', fieldValue, fieldName)
    },
    addRow(){
      let newItem = { status: true, }
      this.tableData.splice(this.tableData.length, 0, newItem)
    },
    changeNum(index, row) {
      this.selectEdKey = index;
      let tempList = [];
      this.tableData.map((item, indexs) => {
        if (indexs == index) {
          item.status = true;
        }
        tempList.push(item);
      });
      this.tableData = tempList;
    },
    setData (arr) {
      if(util.isArray(arr)) {
        arr.forEach(item => {
          this.tableData.forEach(tem => {
            if (item.bgId === tem.bgId) {
              tem[item.fieldName + 'Change'] = true
            }
          })
        })
        this.tableData = [ ...this.tableData ]
      }
    },
    changeClick (budgetId, bgId, fieldName) {
      let tem = this.tableData.find(el => el.bgId === bgId)
      let fieldValue = tem ? tem[fieldName] : ''
      this.$emit('changeClick', budgetId, bgId, fieldValue, fieldName)
    }
  },
  computed: {
    ...mapState ('d2admin/budgetChange', [
      'recordList'
    ])
  },
  async created() {
    this.tableData = JSON.parse(JSON.stringify(this.datasource.data));
    this.$store.dispatch ('d2admin/budgetChange/selfGetRecordListLoad')
  },
  watch: {
    recordList: {
      deep: true,
      immediate: true,
      handler(newVal) {
        if (this.tableData.length == 0) return
        this.setData(newVal)
      }
    }
  }
};
</script>

<style lang='scss'>
/* .defaultLabelClass {
  background: red;
  padding: 0px;
} */
.BWP-con-div{
  padding: 10px;
  .el-table__body-wrapper{
    .el-table__row .cell{
      width: 100%;
      &>div{
        width: 100%;
        span{ display: block; width: 100%; min-height: 25px; }
      }
    }
  }
}
</style>

