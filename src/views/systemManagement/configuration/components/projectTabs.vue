<template>
  <div class="projectTabs">
    <!-- <el-form :model="form" ref="form" label-width="100px"  style="width:1000px">
        <div v-for="(itemData,idx) in data" :key="itemData.id">
            <el-row class="rowClass " v-if="itemData.id==='1197335230566318080'">
              <el-col :span="10">
                <el-form-item label="日息:" prop="money">
                    <el-input  v-model="itemData.value" @blur="projectBlur(itemData)"  :min="0" onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''">
                      <template slot="append">%</template>
                    </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="14" class="colSpan">
               <span>日息=本金*日利率*天数</span>
              </el-col>
            </el-row>
            <el-row class="rowClass " v-if="itemData.id==='1197334487260151808'">
              <el-col :span="10">
                <el-form-item label="月息:" prop="money">
                    <el-input  v-model="itemData.value" @blur="projectBlur(itemData)"  :min="0" onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''">
                      <template slot="append">%</template>
                    </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="14" class="colSpan">
               <span>月息=本金*月利率*月数+本金*（月利率/当月天数）*天数</span>
              </el-col>
            </el-row>
            <el-row class="rowClass " v-if="itemData.id==='1197317410252005376'">
              <el-col :span="10">
                <el-form-item label="年息:" prop="money">
                    <el-input  v-model="itemData.value" @blur="projectBlur(itemData)"  :min="0" onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''">
                      <template slot="append">%</template>
                    </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="14" class="colSpan">
               <span>年息=本金*年利率*年数+本金*（年利率/12/当月天数）*天数</span>
              </el-col>
            </el-row>
        </div>
    </el-form> -->
  </div>
</template>

<script>
  import {addList,editList} from '../../../../api/configuration/index';
  export default {
    props: {
      childrenData: {
        type: Array,
        default: () =>{
          return [];
        }
      },
    },
    data() {
      return {
        data: [],
        form: {

        },
      }
    },
    methods: {
      projectBlur(row) {
        editList (row).then(res => {
          this.$message.success('修改成功')
        })
      }
    },
    watch: {
      childrenData:{
        immediate: true,
        handler (value) {
          this.data = value;
        }
      }
    },
  }
</script>

<style lang="scss" >
.projectTabs{
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"]{
    -moz-appearance: textfield;
  }
  padding-top: 20px;
  .paddingLeft{
    padding-left: 60px;
  } 
  .el-form-item{
    padding-bottom: 0px;
    margin-bottom: 0px;
  }
  .colSpan{
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    padding-left: 10px;
  }
  .rowClass{
    height: 50px;
    line-height: 50px;
    padding-top: 5px;
    cursor: pointer;
    label{
      cursor: pointer;
    }
  }
  .el-input-number {
    .el-input__inner {
      text-align: left;
    }
  }
}
.activeColor {
  background-color: #eaebff;
}
</style>