<template>
  <div class="systemTabs" :class="{'configurationEdit':showEdit}">
    <el-form :model="form" ref="form" label-width="120px"  style="width:1000px">
        <div v-for="(itemData,idx) in data" :key="itemData.id">
            <el-row class="rowClass " v-if="itemData.id==='1196963121869107200'">
              <el-col :span="13">
                <el-form-item label="公司全称:" prop="money">
                    <el-input :disabled="showEdit"  v-model="itemData.value" @blur="projectBlur(itemData)" >
                    </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="rowClass " v-if="itemData.id==='1201377201841340416'">
              <el-col :span="13">
                <el-form-item label="公司简称:" prop="money">
                    <el-input :disabled="showEdit"  v-model="itemData.value" @blur="projectBlur(itemData)" >
                    </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="rowClass " v-if="itemData.id==='1197361620774727680'">
              <el-col :span="7" >
                <el-form-item label="公司LOGO:" prop="money">
                    <upload @uploadFun="uploadFun" :itemData="itemData" class="upload" v-if="!showEdit"></upload>
                    <a @click="imgClick(itemData)" v-else> <el-avatar shape="square" :size="40" :fit="contain" :src="itemData.value"></el-avatar></a>

                </el-form-item>
              </el-col>
              <el-col :span="13" v-if="!showEdit">
                  <a @click="imgClick(itemData)"> <el-avatar shape="square" :size="40" :fit="contain" :src="itemData.value"></el-avatar></a>
              </el-col>
            </el-row>
            <el-row class="rowClass " v-if="itemData.id==='1197390334933774336'">
              <el-col :span="13">
                <el-form-item label="公司注册地址:" prop="money">
                    <el-input :disabled="showEdit"  v-model="itemData.value" @blur="projectBlur(itemData)" >
                    </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="rowClass " v-if="itemData.id==='1201378122646257664'">
              <el-col :span="13">
                <el-form-item label="公司办公地址:" prop="money">
                    <el-input :disabled="showEdit"  v-model="itemData.value" @blur="projectBlur(itemData)" >
                    </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="rowClass " v-if="itemData.id==='1202421490272710656'">
              <el-col :span="13">
                <el-form-item label="公司固定电话:" prop="money">
                    <el-input :disabled="showEdit"  v-model="itemData.value" @blur="projectBlur(itemData)" :min="0" onkeyup="value=value.replace(/[^\d]/g,''">
                    </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="rowClass " v-if="itemData.id==='1197392137171677184'">
              <el-col :span="13">
                <el-form-item label="公司移动电话:" prop="money">
                    <el-input :disabled="showEdit"  v-model="itemData.value" @blur="projectBlur(itemData)" :min="0" onkeyup="value=value.replace(/[^\d]/g,''">
                    </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="rowClass " v-if="itemData.id==='1197392830074892288'">
              <el-col :span="13">
                <el-form-item label="公司负责人:" prop="money">
                    <el-input :disabled="showEdit"  v-model="itemData.value" @blur="projectBlur(itemData)" >
                    </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="autoClass " v-if="itemData.id==='1204207552321433600'">
              <el-col :span="13">
                <el-form-item label="入职须知:" prop="money">
                    <el-input :disabled="showEdit" :rows="6"  type="textarea" v-model="itemData.value">
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
  import upload from './upload/upload';
  import btnList from './btnSave';
  import {addList,editList} from '../../../../api/configuration/index';
  import {fileUpload} from '../../../../api/system/file/file';
  export default {
    components: {
      upload,
      btnList
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
        contain:'contain',
        imgName:'',
        showEdit:true,
        form: {

        },
      }
    },
    methods: {
      projectBlur(row) {
        return
        if (row.name === '公司固定电话') {
           var myreg=/(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)/;
            if (!myreg.test(row.value)) {
                this.$message.error('请确认固定电话格式')
            } else  {
                editList (row).then(res => {
                  this.$message.success('修改成功')
                })
            }
        } else if (row.name === '公司移动电话') {
           var myreg=/(^((\(\d{3}\))|(\d{3}\-))?(1[3456789]\d{9})$)/;
            if (!myreg.test(row.value)) {
                this.$message.error('请确认手机号格式')
            } else  {
                editList (row).then(res => {
                  this.$message.success('修改成功')
                })
            }
        } else {
          editList (row).then(res => {
            this.$message.success('修改成功')
          })
        }
      
      },
      uploadFun (form,itemData) {
        fileUpload (form).then(res => {
          itemData.value = res;
          this.projectBlur(itemData);
        })
      },
      imgClick (data) {
        this.visible = true;
        this.imgName = data.value;
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