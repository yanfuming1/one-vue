<template>
  <div class="BWP-con-div7">
    <h3 style="text-align:center">建筑工程单价费(税)率汇总表</h3>
    <!-- <div class="defaultText">合同编号 {{datasource.data.projectCode}}</div>
    <div class="defaultText">工程名称 {{datasource.data.name}}</div> -->
    <el-table class="table-div"  header-row-class-name="headerClass" header-cell-class-name="headerCellClass" :data="tableData" border="" :header-cell-style="tableHeaderColor">
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
      <el-table-column prop="type" label="工程类别" align="center">
        <template slot-scope="{row,$index}">
        <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
            <el-input v-if="row.status" v-model="row.type" @blur="inputblur($index, row.budgetId, row.bgId, 'type')"></el-input>
            <span v-else>{{row.type}}</span>
        </div>
        <div v-else>
          <span>{{row.type}}</span>
          <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.typeChange" 
                @click="changeClick(row.budgetId, row.bgId, 'type')"></i>
        </div>
        </template>
      </el-table-column>
      <el-table-column label="工程单价费(税)率(%)">
        <el-table-column prop="otherCharges" label="其他直接费" align="center">
            <template slot-scope="{row,$index}">
            <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
                <el-input v-if="row.status" v-model="row.otherCharges" @blur="inputblur($index, row.budgetId, row.bgId, 'otherCharges')"></el-input>
                <span v-else>{{row.otherCharges}}</span>
            </div>
            <div v-else>
              <span>{{row.otherCharges}}</span>
              <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.otherChargesChange" 
                @click="changeClick(row.budgetId, row.bgId, 'otherCharges')"></i>
            </div>
            </template>
        </el-table-column>
        <el-table-column prop="expenditure" label="现场经费" align="center">
            <template slot-scope="{row,$index}">
            <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
                <el-input v-if="row.status" v-model="row.expenditure" @blur="inputblur($index, row.budgetId, row.bgId, 'expenditure')"></el-input>
                <span v-else>{{row.expenditure}}</span>
            </div>
            <div v-else>
              <span>{{row.expenditure}}</span>
              <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.expenditureChange" 
                @click="changeClick(row.budgetId, row.bgId, 'expenditure')"></i>
            </div>
            </template>
        </el-table-column>
        <el-table-column prop="indirectCharges" label="间接费" align="center">
            <template slot-scope="{row,$index}">
            <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
                <el-input v-if="row.status" v-model="row.indirectCharges" @blur="inputblur($index, row.budgetId, row.bgId, 'indirectCharges')"></el-input>
                <span v-else>{{row.indirectCharges}}</span>
            </div>
            <div v-else>
              <span>{{row.indirectCharges}}</span>
              <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.indirectChargesChange" 
                @click="changeClick(row.budgetId, row.bgId, 'indirectCharges')"></i>
            </div>
            </template>
        </el-table-column>
        <el-table-column prop="profit" label="利润" align="center">
            <template slot-scope="{row,$index}">
            <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
                <el-input v-if="row.status" v-model="row.profit" @blur="inputblur($index, row.budgetId, row.bgId, 'profit')"></el-input>
                <span v-else>{{row.profit}}</span>
            </div>
            <div v-else>
              <span>{{row.profit}}</span>
              <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.profitChange" 
                @click="changeClick(row.budgetId, row.bgId, 'profit')"></i>
            </div>
            </template>
        </el-table-column>
        <el-table-column prop="taxes" label="税金" align="center">
            <template slot-scope="{row,$index}">
            <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
                <el-input v-if="row.status" v-model="row.taxes" @blur="inputblur($index, row.budgetId, row.bgId, 'taxes')"></el-input>
                <span v-else>{{row.taxes}}</span>
            </div>
            <div v-else>
              <span>{{row.taxes}}</span>
              <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.taxesChange" 
                @click="changeClick(row.budgetId, row.bgId, 'taxes')"></i>
            </div>
            </template>
        </el-table-column>
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
.BWP-con-div7{
  padding: 15px;
  .el-table__header,.el-table__body{
    colgroup{
      display: none;
    }
  }
  .el-table__header-wrapper{
    width: 100%;
  }
  .headerClass{
    width: 100%!important;
    th:nth-child(1) { width: 10%!important; }
    th:nth-child(2) { width: 20%!important; }
    th:nth-child(3) { width: 60%!important; }
    th:nth-child(4) { width: 10%!important; }
  }
  .el-table__body{
    .el-table__row{
      td:nth-child(1) { width: 10%!important; }
      td:nth-child(2) { width: 20%!important; }
      td:nth-child(3) { width: 12%!important; }
      td:nth-child(4) { width: 12%!important; }
      td:nth-child(5) { width: 12%!important; }
      td:nth-child(6) { width: 12%!important; }
      td:nth-child(7) { width: 12%!important; }
      td:nth-child(8) { width: 10%!important; }
    }
  }
  .table-div{
    table,.el-table__header{
      width: 100% !important ;
    }
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
}
</style>

