<template>
  <div class="montabsBox" :class="{'configurationEdit':showEdit}">
    <!-- <el-button type="primary" @click="addFun">保存</el-button> -->
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" style="width:650px" >
      <!-- <div v-for="item in formData" :key="item.id">
          <el-form-item label="开启短信校验:" prop="name" v-if="item.id==='1194916377357664256'">
            <el-switch
              active-value = '0'
              inactive-value = '1'
              v-model="item.status"
              active-color="#13ce66"
              @change="selectChange(item)"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
      </div> -->
        <div class="collapseBox" >
          <el-collapse v-model="activeName" accordion >
            <el-collapse-item title="财务管理" name="1">
              <div v-for="(itemData,idx) in formData" :key="itemData.id">
                  <el-row class="rowClass " v-if="itemData.id==='1194913947765157888'">
                    <el-col :span="10"> 
                      <el-form-item label="对外付款申请:" prop="status" class="paddingLeft">
                              <el-switch
                                active-value = '0'
                                inactive-value = '1'
                                v-model="itemData.status"
                                @change="selectChange(itemData)"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                              </el-switch>
                      </el-form-item>
                    </el-col>
                    <el-col :span="14">
                      <el-form-item label="金额校验:" prop="money" v-if="itemData.status === '0'">
                          <el-input-number :disabled="showEdit" @blur="moneyBlur(itemData)" v-model="itemData.value" :controls="false"  :min="0" ></el-input-number>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="rowClass activeColor" v-if="itemData.id==='1194913704675880960'" >
                    <el-col :span="10"> 
                      <el-form-item label="员工借款申请:" prop="status" class="paddingLeft">
                              <el-switch
                                active-value = '0'
                                inactive-value = '1'
                                @change="selectChange(itemData)"
                                v-model="itemData.status"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                              </el-switch>
                      </el-form-item>
                    </el-col>
                    <el-col :span="14">
                      <el-form-item label="金额校验:" prop="money" v-if="itemData.status === '0'">
                          <el-input-number class="bgcColor" :disabled="showEdit" @blur="moneyBlur(itemData)" v-model="itemData.value" :controls="false" :min="0" ></el-input-number>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="rowClass activeColor" v-if="itemData.id==='1196666353939939328'" >
                    <el-col :span="10"> 
                      <el-form-item label="员工报销申请:" prop="status" class="paddingLeft">
                              <el-switch
                                active-value = '0'
                                inactive-value = '1'
                                @change="selectChange(itemData)"
                                v-model="itemData.status"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                              </el-switch>
                      </el-form-item>
                    </el-col>
                    <el-col :span="14">
                      <el-form-item label="金额校验:" prop="money" v-if="itemData.status === '0'">
                          <el-input-number  class="bgcColor" :disabled="showEdit" @blur="moneyBlur(itemData)" v-model="itemData.value" :controls="false" :min="0" ></el-input-number>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="rowClass" v-if="itemData.id==='1196667084742885376'" >
                    <el-col :span="10"> 
                      <el-form-item label="对外贷款审批:" prop="status" class="paddingLeft">
                              <el-switch
                                active-value = '0'
                                inactive-value = '1'
                                v-model="itemData.status"
                                @change="selectChange(itemData)"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                              </el-switch>
                      </el-form-item>
                    </el-col>
                    <el-col :span="14">
                      <el-form-item label="金额校验:" prop="money" v-if="itemData.status === '0'">
                          <el-input-number :disabled="showEdit" @blur="moneyBlur(itemData)" v-model="itemData.value" :controls="false" :min="0" ></el-input-number>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="rowClass activeColor" v-if="itemData.id==='1196667467338907648'" >
                    <el-col :span="10"> 
                      <el-form-item label="营业外收入登记:" prop="status" class="paddingLeft">
                              <el-switch
                                active-value = '0'
                                inactive-value = '1'
                                v-model="itemData.status"
                                @change="selectChange(itemData)"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                              </el-switch>
                      </el-form-item>
                    </el-col>
                    <el-col :span="14">
                      <el-form-item label="金额校验:" prop="money" v-if="itemData.status === '0'">
                          <el-input-number  class="bgcColor" :disabled="showEdit" @blur="moneyBlur(itemData)" v-model="itemData.value" :controls="false" :min="0" ></el-input-number>
                      </el-form-item>
                    </el-col>
                  </el-row>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
    </el-form>
    <btn-list @editFun="editFun"  :saveData="formData"></btn-list>
  </div>
</template>

<script>
  import {addList,editList} from '../../../../api/configuration/index';
  import btnList from './btnSave';
  export default {
    components: {
      btnList,
    },
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
        formData: [],
        activeName: '1',
        dialogShow:false,
        ruleForm: {
          name: true,
          isStates: true,
          money: ''
        },
        rules: {

        },
        showEdit: true
      }
    },
    methods: {
      addFun() {
        let jsonData = {
          id:'',
          identification:'6',
          name:'证书到期提醒',
          // createTime: '2019-11-22 03:51:45',
          status: '0',
          value:'8',
        }
        addList (jsonData).then(res => {

        })
        // editList (jsonData).then(res => {

        // })
      },
      selectChange (row) {
        return
        editList (row).then(res => {
          this.$message.success('修改成功')
        })
      },
      moneyBlur (row) {
        return
        editList (row).then(res => {
          this.$message.success('修改成功')
        })
      },
      editFun () {
        this.showEdit = !this.showEdit;
      }
    },
    watch: {
      childrenData:{
        deep: true,
        handler (value) {
          this.formData = value;
        }
        
      }
    },
  }
</script>

<style lang="scss" >
.montabsBox{
  padding-top: 20px;
  .paddingLeft{
    padding-left: 60px;
  } 
  .collapseBox{
    .el-form-item{
      padding-bottom: 0px;
      margin-bottom: 0px;
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
.configurationEdit {
  .el-input__inner{
    border: 0px;
  }
  .bgcColor{
    .el-input.is-disabled .el-input__inner{
      background-color: #eaebff;
    }
  }
}
</style>