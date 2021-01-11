<template>
  <div class="BWP-con-div11">
    <h3 style="text-align:center">建筑工程单价分析表</h3>
    <!-- <div class="defaultText">合同编号 {{datasource.data.projectCode}}</div>
    <div class="defaultText">工程名称 {{datasource.data.name}}</div> -->
    <h4 style="text-align:center">一般土方机械开挖（堤基清表外运）</h4>
    <el-row>
        <el-form ref="form" :model="form" label-width="100px">
            <el-col :span="6">
                <el-form-item label="项目编码：" v-if="!isShowDetails">
                    <el-input :value="form.code"></el-input>
                </el-form-item>
                <el-form-item label="项目编码：" v-else>
                    {{ form.code }}
                </el-form-item>
            </el-col>
            <el-col :span="14">
                <el-form-item label="定额编号：" v-if="!isShowDetails">
                    <el-input :value="form.quota"></el-input>
                </el-form-item>
                <el-form-item label="定额编号：" v-else>
                    {{ form.quota }}
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label="单位：" v-if="!isShowDetails">
                    <el-input :value="form.units"></el-input>
                </el-form-item>
                <el-form-item label="单位：" v-else>
                    {{ form.units }}
                </el-form-item>
            </el-col>
        </el-form>
    </el-row>
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
      <el-table-column prop="name" label="名称" align="center">
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
      <el-table-column prop="unit" label="计量单位" align="center">
        <template slot-scope="{row,$index}">
        <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
            <el-input v-if="row.status" v-model="row.unit" @blur="inputblur($index, row.budgetId, row.bgId, 'unit')"></el-input>
            <span v-else>{{row.unit}}</span>
        </div>
        <div v-else>
          <span>{{row.unit}}</span>
          <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.unitChange" 
                @click="changeClick(row.budgetId, row.bgId, 'unit')"></i>
        </div>
        </template>
      </el-table-column>
      <el-table-column prop="num" label="数量" align="center">
        <template slot-scope="{row,$index}">
        <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
            <el-input v-if="row.status" v-model="row.num" @blur="inputblur($index, row.budgetId, row.bgId, 'num')"></el-input>
            <span v-else>{{row.num}}</span>
        </div>
        <div v-else>
          <span>{{row.num}}</span>
          <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.numChange" 
                @click="changeClick(row.budgetId, row.bgId, 'num')"></i>
        </div>
        </template>
      </el-table-column>
      <el-table-column prop="unitPrice" label="单价（元）" align="center">
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
      <el-table-column prop="totalPrice" label="合价（元）" align="center">
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
  props: ["datasource", "callback", "isShowDetails"],
  data() {
    return {
      tableData: [],
      selectEdKey: "",
      updateValue: "",
      form: {
        code: "",
        quota: "",
        units: "",
      },
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
      this.tableData.splice(this.tableData.length-1, 0, newItem)
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
        this.form = { ...this.tableData[0] }
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
    this.form = JSON.parse(JSON.stringify(this.datasource.data))[0]
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
.BWP-con-div11{
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
    th:nth-child(2) { width: 25%!important; }
    th:nth-child(3) { width: 13%!important; }
    th:nth-child(4) { width: 13%!important; }
    th:nth-child(5) { width: 13%!important; }
    th:nth-child(6) { width: 13%!important; }
    th:nth-child(7) { width: 13%!important; }
  }
  .el-table__body{
    .el-table__row{
      td:nth-child(1) { width: 10%!important; }
      td:nth-child(2) { width: 25%!important; }
      td:nth-child(3) { width: 13%!important; }
      td:nth-child(4) { width: 13%!important; }
      td:nth-child(5) { width: 13%!important; }
      td:nth-child(6) { width: 13%!important; }
      td:nth-child(7) { width: 13%!important; }
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

