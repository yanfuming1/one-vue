<template>
  <div>
    <el-dialog
      v-dialogDrag
      title="上传文件"
      v-if="showUpload"
      :visible.sync="showUpload"
      width="30%"
      :before-close="handleClose"
      >
      <el-upload
          class="upload-demo"
          multiple
          :action="upLoadUrl"
          :on-change="handleChange"
          :on-exceed="handleExceed"
          :on-remove="handleRemove"
          :file-list="fileList"
          :before-upload="handleBeforeUpload"
          :auto-upload="false">
          <el-button size="mini" icon="el-icon-download" style="margin-right:30px">选择上传的文件</el-button>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="okFun">上传</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  
  </div>
</template>

<script>
  export default {
    props: {
     showUpload:{
       type:Boolean,
       default:false
     },
    },
    data() {
      return {
        dialogVisible:this.showUpload,
        // limitUpload: 1,
        fileList:[],
        upLoadUrl:'',
        // http://192.168.2.150/qqtoi/file/upload
        file:'',
      }
    },
    methods: {
      //文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
      handleChange(file, fileList) {
          this.file = file;
          this.fileList = fileList;
      },
      //文件超出个数限制时的钩子
      handleExceed() {
        this.$message.error('只支持单个文件上传')
      },
      //文件列表移除文件时的钩子
      handleRemove() {
        this.file = '';
        this.fileList = [];
      },
      //上传文件之前的钩子，参数为上传的文件
      handleBeforeUpload (file) {

      },
      handleClose() {
        this.file = '';
        this.fileList = [];
        this.$message.warning('取消上传');
        this.$emit('closeDialog');
      },
      okFun() {
        if (this.fileList.length === 0) {
          this.$message.warning('未选择文件!!!')
        } else {
          this.$emit("startUpLoad", this.fileList)
        }
      },
    },
    mounted () {

    },
  }
</script>

<style lang="scss">
.upload-demo{
    .el-upload__input{
        display: none;
    }
}
</style>