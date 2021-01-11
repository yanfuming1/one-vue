<template>
  <div class="cover-container">
    <el-form ref="form" :model="form">
      <div class="defaultRow">
        <el-input v-if="doEdit" size="small" v-model="form.name" @blur="inputblur(form.budgetId, form.bgId, 'name')"/>
        <span v-else class="detail">{{form.name}}</span>
        <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && form.nameChange" @click="changeClick(form.budgetId, form.bgId, 'name')"></i>
        <span class="default-row-right">工程</span>
      </div>
      <h1>投标人工程量清单报价表</h1>
      <div class="defaultRow">
          <span class="default-row-label">合同编号：</span>
          <el-input v-if="doEdit" size="small" v-model="form.code" @blur="inputblur(form.budgetId, form.bgId, 'code')"/>
          <span v-else class="detail">{{form.code}}</span>
          <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && form.codeChange" @click="changeClick(form.budgetId, form.bgId, 'code')"></i>
      </div>
      <div class="defaultRow">
        <span class="default-row-label">投标人：</span>
        <el-input v-if="doEdit" size="small" v-model="form.bidder" @blur="inputblur(form.budgetId, form.bgId, 'bidder')"/>
        <span v-else class="detail">{{form.bidder}}</span>
        <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && form.bidderChange" @click="changeClick(form.budgetId, form.bgId, 'bidder')"></i>
        <span class="default-row-right">（单位盖章）</span>
      </div>
      <div class="defaultRow">
        <span class="default-row-label">法定代表人：</span>
        <el-input v-if="doEdit" size="small" v-model="form.legalRepresentative" @blur="inputblur(form.budgetId, form.bgId, 'legalRepresentative')"/>
        <span v-else class="detail">{{form.legalRepresentative}}</span>
        <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && form.legalRepresentativeChange" @click="changeClick(form.budgetId, form.bgId, 'legalRepresentative')"></i>
        <span class="default-row-right">（签字并盖章）</span>
      </div>
      
      <div class="defaultRow">
        <span class="default-row-label">造价工程师及注册证号：</span>
        <el-input size="small" v-if="doEdit" v-model="form.costEngineer" @blur="inputblur(form.budgetId, form.bgId, 'costEngineer')"/>
        <span v-else class="detail">{{form.costEngineer}}</span>
        <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && form.costEngineerChange" @click="changeClick(form.budgetId, form.bgId, 'costEngineer')"></i>
        <span class="default-row-right">（签字并盖章）</span>
      </div>
      <div class="defaultRow">
        <span class="default-row-label">编制时间：</span>
        <el-input v-if="doEdit" size="small" v-model="form.time" @blur="inputblur(form.budgetId, form.bgId, 'time')"/>
        <span v-else class="detail">{{form.time}}</span>
        <i class='el-icon-paperclip' style="font-size:15px;color:#409eff;" v-if="fromChange && form.timeChange" @click="changeClick(form.budgetId, form.bgId, 'time')"></i>
        <span class="default-row-right"></span>
      </div>
    </el-form>
    <div class="" style="margin-bottom: 20px;">
      <el-button type="primary" size="mini" v-if="!doEdit && !isShowDetails" @click="openEdit('0')">修改</el-button>
      <el-button type="warning" v-if="doEdit" size="mini" @click="openEdit('1')">保存</el-button>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import util from '../../../../../../../libs/util';
export default {
  data() {
    return {
      form: {},
      doEdit: false,
    };
  },
  props: ["datasource", "isShowDetails", "callback", "fromChange"],
  methods:{
    openEdit(type){
      if(type === '1'){
        this.callback(this.form);
      }
      this.doEdit = !this.doEdit
    },
    inputblur(budgetId, bgId, fieldName) {
      let fieldValue = this.form[fieldName]
      this.$emit('changeValue', budgetId, bgId, fieldValue, fieldName)
    },
    setData (arr) {
      if(util.isArray(arr)) {
        arr.forEach(item => {
          if (item.bgId === this.form.bgId) {
            this.form[item.fieldName + 'Change'] = true
          }
        })
      }
      this.form = { ...this.form }
    },
    changeClick (budgetId, bgId, fieldName) {
      let fieldValue = this.form[fieldName]
      this.$emit('changeClick', budgetId, bgId, fieldValue, fieldName)
    }
  },
  computed: {
    ...mapState ('d2admin/budgetChange', [
      'recordList'
    ])
  },
  async created () {
    this.form = Object.assign({}, this.datasource.data)
    this.$store.dispatch ('d2admin/budgetChange/selfGetRecordListLoad')
  },
  watch: {
    recordList: {
      deep: true,
      immediate: true,
      handler(newVal) {
        if (!this.form.id) return
        this.setData(newVal)
      }
    }
  }
};
</script>

<style lang="scss">
.cover-container {
  display: "flex";
  flex-direction: "colunm";
  text-align: center;
  .defaultRow {
    display: "flex";
    flex-direction: "row";
    margin-bottom: 30px;
    .el-input{
      width: 220px;
      font-size: 18px;
    }
    span{
      font-size: 18px;
      display: inline-block;
    }
    .detail{
      width: 220px;
      border-bottom: 1px solid #999;
      text-align: center;
    }
    .default-row-label{
      width: 210px;
      text-align: right;
    }
    .default-row-right{
      width: 150px;
      text-align: left;
    }
  }
}
</style>
