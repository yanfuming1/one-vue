<template>
  <div class="systemTabs" :class="{'configurationEdit':showEdit}">
    <el-form :model="form" ref="form" label-width="120px"  style="width:1000px">
        <div v-for="itemData in data" :key="itemData.id">
            <el-row class="rowClass " v-if="itemData.id==='1272446572335345664'">
              <el-col :span="5"> 
                  <el-form-item label="证书到期提醒:" prop="status">
                      <el-switch
                        active-value = '0'
                        inactive-value = '1'
                        :disabled="showEdit"
                        @change="selectChange(itemData)"
                        v-model="itemData.status"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                      </el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="执行时间:" prop="money" v-if="itemData.status === '0'">
                    <el-input-number style="width:80%" :disabled="showEdit" :step="1" :precision="0" :controls="false" :min="0" :max="23" v-model="itemData.value" @blur="projectBlur(itemData)"></el-input-number>
                    时
                  </el-form-item>
                </el-col>
            </el-row>
            <el-row class="rowClass " v-if="itemData.id==='1272446642812235776'">
              <el-col :span="5"> 
                  <el-form-item label="人事离职:" prop="status">
                      <el-switch
                        active-value = '0'
                        inactive-value = '1'
                        :disabled="showEdit"
                        @change="selectChange(itemData)"
                        v-model="itemData.status"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                      </el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="执行时间:" prop="money" v-if="itemData.status === '0'">
                      <el-input-number style="width:80%" :disabled="showEdit" :step="1" :precision="0" :controls="false" :min="0" :max="23" v-model="itemData.value" @blur="projectBlur(itemData)"></el-input-number>
                    时
                  </el-form-item>
                </el-col>
            </el-row>
            <el-row class="rowClass " v-if="itemData.id==='1272446685824823296'">
                <el-col :span="5"> 
                  <el-form-item label="人事辞退:" prop="status">
                      <el-switch
                        active-value = '0'
                        inactive-value = '1'
                        :disabled="showEdit"
                        @change="selectChange(itemData)"
                        v-model="itemData.status"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                      </el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="执行时间:" prop="money" v-if="itemData.status === '0'">
                      <el-input-number style="width:80%" :disabled="showEdit" :step="1" :precision="0" :controls="false" :min="0" :max="23" v-model="itemData.value" @blur="projectBlur(itemData)"></el-input-number>
                    时
                  </el-form-item>
                </el-col>
            </el-row>
            <el-row class="rowClass " v-if="itemData.id==='1272446716120281088'">
              <el-col :span="5"> 
                  <el-form-item label="人事工作调整:" prop="status">
                      <el-switch
                        active-value = '0'
                        inactive-value = '1'
                        :disabled="showEdit"
                        @change="selectChange(itemData)"
                        v-model="itemData.status"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                      </el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="执行时间:" prop="money" v-if="itemData.status === '0'">
                      <el-input-number style="width:80%" :disabled="showEdit" :step="1" :precision="0" :controls="false" :min="0" :max="23" v-model="itemData.value" @blur="projectBlur(itemData)"></el-input-number>
                    时
                  </el-form-item>
                </el-col>
            </el-row>
            <el-row class="rowClass " v-if="itemData.id==='1272446777139015680'">
               <el-col :span="5"> 
                  <el-form-item label="客户联系提醒:" prop="status">
                      <el-switch
                        active-value = '0'
                        inactive-value = '1'
                        :disabled="showEdit"
                        @change="selectChange(itemData)"
                        v-model="itemData.status"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                      </el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="执行时间:" prop="money" v-if="itemData.status === '0'">
                      <el-input-number style="width:80%" :disabled="showEdit" :step="1" :precision="0" :controls="false" :min="0" :max="23" v-model="itemData.value" @blur="projectBlur(itemData)"></el-input-number>
                      时
                  </el-form-item>
                </el-col>
            </el-row>
        </div>
        <btn-list @editFun="editFun"  :saveData="data" ></btn-list>
    </el-form>
    <el-dialog v-dialogDrag title="View Image" :visible.sync="visible" width="600px"  top="6vh" append-to-body>
        <img :src="imgName" v-if="visible" style="width: 100%">
    </el-dialog>
  </div>
</template>

<script>
  import btnList from './btnSave';
  import {addList,editList} from '../../../../api/configuration/index';
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
        data: [],
        visible:false,
        imgName:'',
        showEdit:true,
        form: {},
      }
    },
    methods: {
      projectBlur(row) {
        return
      },
      editFun () {
        this.showEdit = !this.showEdit;
      },
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
.systemTabs{
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
    div {
      height: 50px;
    }
    label{
      cursor: pointer;
    }
  }
  .autoClass{
    height: auto;
  }
  .el-input-number {
    .el-input__inner {
      text-align: left;
    }
  }
  .el-input.is-disabled .el-input__inner{
    background-color: #ffffff;
    cursor: pointer;
  }
}
.activeColor {
  background-color: #eaebff;
}
.configurationEdit {
  .el-input__inner{
    border: 0px;
  }
}
</style>