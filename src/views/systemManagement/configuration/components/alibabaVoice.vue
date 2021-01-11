<template>
  <div class="systemTabs" :class="{'configurationEdit':showEdit}">
    <el-form :model="form" ref="form" label-width="120px"  style="width:1000px">
        <div v-for="(itemData,index) in data" :key="itemData.id">
            <el-row class="rowClass " v-if="itemData.id==='1272823614327382016'">
              <el-col :span="13">
                <el-form-item label="签名名称:" >
                    <el-input :disabled="showEdit"  v-model="itemData.value" @blur="projectBlur(itemData)" >
                    </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="rowClass " v-if="itemData.id==='1273078220248793088'">
              <el-col :span="13">
                <el-form-item label="凭证ID:" >
                    <el-input :disabled="showEdit"  v-model="itemData.value" @blur="projectBlur(itemData)" >
                    </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="rowClass " v-if="itemData.id==='1272824916050599936'">
              <el-col :span="13">
                <el-form-item label="凭证密钥:" >
                    <el-input :disabled="showEdit"  v-model="itemData.value" @blur="projectBlur(itemData)" >
                    </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="rowClass " v-if="itemData.id==='1272824968953356288'">
              <el-col :span="13">
                <el-form-item label="版本:" >
                    <el-input :disabled="showEdit"  v-model="itemData.value" @blur="projectBlur(itemData)" >
                    </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="rowClass " v-if="itemData.id==='1272825027426148352'">
              <el-col :span="13">
                <el-form-item label="地域ID:" >
                    <el-input :disabled="showEdit"  v-model="itemData.value" @blur="projectBlur(itemData)" >
                    </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="rowClass " v-if="itemData.id==='1272825088193224704'">
              <el-col :span="13">
                <el-form-item label="虚拟号码:" >
                    <el-input :disabled="showEdit"  v-model="itemData.value" @blur="projectBlur(itemData)" >
                    </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <h2 v-if="index == 5" style="text-align:left;margin:20px 0 20px 20px">模板</h2>
            <el-row class="rowClass " v-if="itemData.id==='1272825143159578624'">
              <el-col :span="13">
                <el-form-item label="客户联系提醒:" >
                    <el-input :disabled="showEdit"  v-model="itemData.value" @blur="projectBlur(itemData)" >
                    </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="rowClass " v-if="itemData.id==='1272825205868617728'">
              <el-col :span="13">
                <el-form-item label="证书过期通知:" >
                    <el-input :disabled="showEdit"  v-model="itemData.value" @blur="projectBlur(itemData)" >
                    </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="rowClass " v-if="itemData.id==='1272825262831460352'">
              <el-col :span="13">
                <el-form-item label="操作和金额通知:" >
                    <el-input :disabled="showEdit"  v-model="itemData.value" @blur="projectBlur(itemData)" >
                    </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="rowClass " v-if="itemData.id==='1272825322600292352'">
              <el-col :span="13">
                <el-form-item label="验证手机号:" >
                    <el-input :disabled="showEdit"  v-model="itemData.value" @blur="projectBlur(itemData)" >
                    </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="rowClass " v-if="itemData.id==='1272825369337421824'">
              <el-col :span="13">
                <el-form-item label="语音:" >
                    <el-input :disabled="showEdit"  v-model="itemData.value" @blur="projectBlur(itemData)" >
                    </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="rowClass " v-if="itemData.id==='1273079610073366528'">
              <el-col :span="13">
                <el-form-item label="消息推送:" >
                    <el-input :disabled="showEdit"  v-model="itemData.value" @blur="projectBlur(itemData)" >
                    </el-input>
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