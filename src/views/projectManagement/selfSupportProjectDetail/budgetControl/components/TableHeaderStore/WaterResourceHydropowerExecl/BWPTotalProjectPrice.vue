<template>
  <div class="BWP-con-div1">
    <h3 style="text-align:center">工程项目总价表</h3>
    <!-- <div class="defaultText">合同编号 {{datasource.data.projectCode}}</div>
    <div class="defaultText">工程名称 {{datasource.data.name}}</div> -->  
    <el-table class="table-div"  header-row-class-name="headerClass" header-cell-class-name="headerCellClass" :data="tableData" border="" :header-cell-style="tableHeaderColor">
      <el-table-column label="序号"  align="center" >
        <template slot-scope="{row,$index}">
          <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
            <el-input v-if="row.status" v-model="row.numberOrder" @blur="inputblur($index, row.budgetId, row.bgId, 'numberOrder')"></el-input>
            <span v-else>{{row.numberOrder}}</span>
          </div>
          <div v-else>
            <span>{{row.numberOrder}}</span>
            <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.numberOrderChange" @click="changeClick(row.budgetId, row.bgId, 'numberOrder')"></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="code"   label="分类工程编码" align="center">
        <template slot-scope="{row,$index}">
          <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
            <el-input v-if="row.status" v-model="row.code" @blur="inputblur($index, row.budgetId, row.bgId, 'code')"></el-input>
            <span v-else>{{row.code}}</span>
          </div>
          <div v-else>
            <span>{{row.code}}</span>
            <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.codeChange" @click="changeClick(row.budgetId, row.bgId, 'code')"></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name"   label="工程项目名称" align="center">
        <template slot-scope="{row,$index}">
          <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
            <el-input v-if="row.status" v-model="row.name" @blur="inputblur($index, row.budgetId, row.bgId, 'name')"></el-input>
            <span v-else>{{row.name}}</span>
          </div>
          <div v-else>
            <span>{{row.name}}</span>
            <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.nameChange" @click="changeClick(row.budgetId, row.bgId, 'name')"></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="money"   label="金额(元)" align="center">
        <template slot-scope="{row,$index}">
          <div @dblclick="{{changeNum($index,row)}}" v-if="!isShowDetails">
            <el-input v-if="row.status" v-model="row.money" @blur="inputblur($index, row.budgetId, row.bgId, 'money')"></el-input>
            <span v-else>{{row.money}}</span>
          </div>
          <div v-else>
            <span>{{row.money}}</span>
            <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && row.moneyChange" @click="changeClick(row.budgetId, row.bgId, 'money')"></i>
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
import log from '../../../../../../../libs/util.log';
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
    addRow(){
      let newItem = { status: true, }
      this.tableData.splice(this.tableData.length - 1, 0, newItem)
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
.BWP-con-div1{
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
    th:nth-child(1) {
      width: 10%!important;
    }
    th:nth-child(2) {
      width: 20%!important;
    }
    th:nth-child(3) {
      width: 50%!important;
    }
    th:nth-child(4) {
      width: 20%!important;
    }
  }
  .el-table__body{
    .el-table__row{
      td:nth-child(1) {
        width: 10%!important;
      }
      td:nth-child(2) {
        width: 20%!important;
      }
      td:nth-child(3) {
        width: 50%!important;
      }
      td:nth-child(4) {
        width: 20%!important;
      }
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

