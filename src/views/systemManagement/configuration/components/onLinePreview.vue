<template>
  <div class="otherTabs">
    <el-form :model="form" ref="form" label-width="100px"  style="width:1000px">
        <el-row class="rowClass ">
            <el-col :span="12" :offset="6">
                <el-form-item label="是否开启:" >
                    <el-switch v-model="form.isopen" :disabled="showEdit" @change="changeOpen"></el-switch>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row class="rowClass ">
            <el-col :span="12" :offset="6">
                <el-form-item label="服务器地址:" >
                    <span v-if="showEdit">{{form.onlineaddress}}</span>
                    <el-input v-else v-model="form.onlineaddress" :min="0"> </el-input>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
    <el-row>
        <el-col :span="12" :offset="6" style="margin-top:80px;">
            <el-button size="mini" type="primary" @click="editFun" v-if="showEdit">编辑</el-button>
            <el-button size="mini" type="success" @click="saveFun"  v-else>保存</el-button>
            <el-button size="mini" @click="editFun" v-if="!showEdit">取消</el-button>
        </el-col>
    </el-row>
  </div>
</template>

<script>
import { fileOnlineViewEdit, updateConfiguration } from '@/api/configuration/index'
  export default {
    props: {
      onLinePreviewData: {
        type: Array,
        default: () =>{
          return [];
        }
      },
    },
    components: {},
    data() {
      return {
        form: {
          onlineaddress: ''
        },
        showEdit:true,
        temData: [],
      }
    },
    methods: {
      changeOpen (val) {
        if(!val){ this.form.onlineaddress = null }
      },
      editFun () {
        this.showEdit = !this.showEdit;
      },
      saveFun() {
          this.temData[1].value = this.form.isopen ? '1' : '0'
          this.temData[0].value = this.form.onlineaddress
          updateConfiguration(this.temData).then(res => {
              if (res.success ) {
                  this.$message.success("编辑成功!!!")
                  this.editFun()
              }
          })
      }
    },
    mounted () {},
    watch: {
      onLinePreviewData:{
        immediate: true,
        handler (value) {
          this.temData = []
          value.forEach(item => {
            this.temData.push(item)
          })
          this.form.isopen = value[1].value === '1' ? true : false
          this.form.onlineaddress = value[0].value
        }
      }
    },
  }
</script>

<style lang="scss" >
.otherTabs{
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