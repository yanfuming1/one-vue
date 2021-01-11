<template>
  <div class="BWP-con-div">
    <h3 style="text-align:center">投标人生产混凝土(砂浆)配合比材料费表</h3>
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
      <el-table-column prop="part" label="工程部位" align="center">
        <template slot-scope="{row,$index}">
        <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
            <el-input v-if="row.status" v-model="row.part" @blur="inputblur($index, row.budgetId, row.bgId, 'part')"></el-input>
            <span v-else>{{row.part}}</span>
        </div>
        <div v-else>
          <span>{{row.part}}</span>
          <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.partChange" 
                @click="changeClick(row.budgetId, row.bgId, 'part')"></i>
        </div>
        </template>
      </el-table-column>
      <el-table-column prop="grade" label="强度等级" align="center">
        <template slot-scope="{row,$index}">
        <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
            <el-input v-if="row.status" v-model="row.grade" @blur="inputblur($index, row.budgetId, row.bgId, 'grade')"></el-input>
            <span v-else>{{row.grade}}</span>
        </div>
        <div v-else>
          <span>{{row.grade}}</span>
          <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.gradeChange" 
                @click="changeClick(row.budgetId, row.bgId, 'grade')"></i>
        </div>
        </template>
      </el-table-column>
      <el-table-column prop="cementGrade" label="水泥强度等级" align="center">
        <template slot-scope="{row,$index}">
        <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
            <el-input v-if="row.status" v-model="row.cementGrade" @blur="inputblur($index, row.budgetId, row.bgId, 'cementGrade')"></el-input>
            <span v-else>{{row.cementGrade}}</span>
        </div>
        <div v-else>
          <span>{{row.cementGrade}}</span>
          <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.cementGradeChange" 
                @click="changeClick(row.budgetId, row.bgId, 'cementGrade')"></i>
        </div>
        </template>
      </el-table-column>
      <el-table-column prop="grading" label="级配" align="center">
        <template slot-scope="{row,$index}">
        <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
            <el-input v-if="row.status" v-model="row.grading" @blur="inputblur($index, row.budgetId, row.bgId, 'grading')"></el-input>
            <span v-else>{{row.grading}}</span>
        </div>
        <div v-else>
          <span>{{row.grading}}</span>
          <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.gradingChange" 
                @click="changeClick(row.budgetId, row.bgId, 'grading')"></i>
        </div>
        </template>
      </el-table-column>
      <el-table-column prop="grain" label="碎石最大粒径(mm)" width="100" align="center">
        <template slot-scope="{row,$index}">
        <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
            <el-input v-if="row.status" v-model="row.grain" @blur="inputblur($index, row.budgetId, row.bgId, 'grain')"></el-input>
            <span v-else>{{row.grain}}</span>
        </div>
        <div v-else>
          <span>{{row.grain}}</span>
          <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.grainChange" 
                @click="changeClick(row.budgetId, row.bgId, 'grain')"></i>
        </div>
        </template>
      </el-table-column>
      <el-table-column label="预算材料量(kg/m3)">
        <el-table-column prop="cement" label="水泥" align="center">
            <template slot-scope="{row,$index}">
            <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
                <el-input v-if="row.status" v-model="row.cement" @blur="inputblur($index, row.budgetId, row.bgId, 'cement')"></el-input>
                <span v-else>{{row.cement}}</span>
            </div>
            <div v-else>
              <span>{{row.cement}}</span>
              <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.cementChange" 
                @click="changeClick(row.budgetId, row.bgId, 'cement')"></i>
            </div>
            </template>
        </el-table-column>
        <el-table-column prop="sand" label="黄沙" align="center">
            <template slot-scope="{row,$index}">
            <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
                <el-input v-if="row.status" v-model="row.sand" @blur="inputblur($index, row.budgetId, row.bgId, 'sand')"></el-input>
                <span v-else>{{row.sand}}</span>
            </div>
            <div v-else>
              <span>{{row.sand}}</span>
              <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.sandChange" 
                @click="changeClick(row.budgetId, row.bgId, 'sand')"></i>
            </div>
            </template>
        </el-table-column>
        <el-table-column prop="gravel" label="碎石" align="center">
            <template slot-scope="{row,$index}">
            <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
                <el-input v-if="row.status" v-model="row.gravel" @blur="inputblur($index, row.budgetId, row.bgId, 'gravel')"></el-input>
                <span v-else>{{row.gravel}}</span>
            </div>
            <div v-else>
              <span>{{row.gravel}}</span>
              <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.gravelChange" 
                @click="changeClick(row.budgetId, row.bgId, 'gravel')"></i>
            </div>
            </template>
        </el-table-column>
        <el-table-column prop="additive" label="外加剂" align="center">
            <template slot-scope="{row,$index}">
            <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
                <el-input v-if="row.status" v-model="row.additive" @blur="inputblur($index, row.budgetId, row.bgId, 'additive')"></el-input>
                <span v-else>{{row.additive}}</span>
            </div>
            <div v-else>
              <span>{{row.additive}}</span>
              <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.additiveChange" 
                @click="changeClick(row.budgetId, row.bgId, 'additive')"></i>
            </div>
            </template>
        </el-table-column>
        <el-table-column prop="water" label="水" align="center">
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
        <el-table-column prop="untitled" label="其他" align="center">
            <template slot-scope="{row,$index}">
            <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
                <el-input v-if="row.status" v-model="row.untitled" @blur="inputblur($index, row.budgetId, row.bgId, 'untitled')"></el-input>
                <span v-else>{{row.untitled}}</span>
            </div>
            <div v-else>
              <span>{{row.untitled}}</span>
              <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.untitledChange" 
                @click="changeClick(row.budgetId, row.bgId, 'untitled')"></i>
            </div>
            </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="unitPrice" label="单价(元/m3)" align="center">
        <template slot-scope="{row,$index}">
          <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
            <el-input v-if="row.status" v-model="row.unitPrice" @blur="inputblur($index, row.budgetId, row.bgId, 'unitPrice')"></el-input>
            <span v-else>{{row.unitPrice}}</span>
          </div>
          <div v-else>
            <span>{{row.unitPrice}}</span>
            <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.unitPriceChange" 
                @click="changeClick(row.budgetId, row.bgId, 'unitPrice')"></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" align="center">
        <template slot-scope="{row,$index}">
          <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
            <el-input v-if="row.status" v-model="row.remark" @blur="inputblur($index, row.budgetId, row.bgId, 'remark')"></el-input>
            <span v-else>{{row.remark}}</span>
          </div>
          <div v-else>
            <span>{{row.remark}}</span>
            <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.remarkChange" 
                @click="changeClick(row.budgetId, row.bgId, 'remark')"></i>
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

