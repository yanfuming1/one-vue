<template>
  <div class="systemTabs" :class="{'configurationEdit':showEdit}">
    <el-form :model="form" ref="form" label-width="140px"  style="width:1000px">
        <div v-for="itemData in data" :key="itemData.id">
           <el-row class="rowClass " v-if="itemData.id==='1277536996351672320'">
              <el-col :span="14">
                <el-form-item label="密钥key:" >
                    <el-input :disabled="showEdit"  v-model="itemData.value" @blur="projectBlur(itemData)" >
                    </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="rowClass " v-if="itemData.id==='1273086898922233856'">
              <el-col :span="14">
                <el-form-item label="密钥ID:" >
                    <el-input :disabled="showEdit"  v-model="itemData.value" @blur="projectBlur(itemData)" >
                    </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="rowClass " v-if="itemData.id==='1273086943503491072'">
              <el-col :span="14">
                <el-form-item label="接口名称:" >
                    <el-input :disabled="showEdit"  v-model="itemData.value" @blur="projectBlur(itemData)" >
                    </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="rowClass " v-if="itemData.id==='1273086987044560896'">
              <el-col :span="14">
                <el-form-item label="版本:" >
                    <el-input :disabled="showEdit"  v-model="itemData.value" @blur="projectBlur(itemData)" >
                    </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="rowClass " v-if="itemData.id==='1273087066115579904'">
              <el-col :span="14">
                <el-form-item label="区域:" >
                    <el-input :disabled="showEdit"  v-model="itemData.value" @blur="projectBlur(itemData)" >
                    </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="rowClass " v-if="itemData.id==='1273088973592764416'">
              <el-col :span="14">
                <el-form-item label="公司最高退税比例:" >
                    <el-input-number style="width:100%" :disabled="showEdit" :step="1" :precision="0" :controls="false" :min="0" :max="100" v-model="itemData.value" @blur="projectBlur(itemData)"></el-input-number>
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