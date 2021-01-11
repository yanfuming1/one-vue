<template>
  <div>
      <el-upload
          class="upload-demo"
          :action="upLoadUrl"
          :on-change="handleChange"
          :on-exceed="handleExceed"
          :on-remove="handleRemove"
          :file-list="fileList"
          :before-upload="handleBeforeUpload"
          :show-file-list="false"
          :limit="limitUpload"
          accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
          :auto-upload="false">
          <el-button icon="el-icon-upload2" style="margin-right:30px">上传图片</el-button>
      </el-upload>
          <!-- accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" -->
  </div>
</template>

<script>

  export default {
    props: {
     showUpload:{
       type:Boolean,
       default:false
     },
     itemData:{
       type:Object,
       default: () =>{
         return {}
       }
     },
    },
    data() {
      return {
        dialogVisible:this.showUpload,
        limitUpload: 1,
        fileList:[],
        bankList:[],
        companyBankList:[],
        upLoadUrl:'',
        file:'',
        data: {}
      }
    },
    methods: {
      //文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
      handleChange(file, fileList) {
        this.file = file;
        this.fileList = fileList;
        if (!this.file) {
            this.$message.error('未选择文件');
            return;
        }
        let form = new FormData();
        form.append('file', this.file.raw);
        this.$emit('uploadFun',form,this.data);
        this.file = '';
        this.fileList = [];
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
        console.log(file)
        
      },
      handleClose() {
        this.file = '';
        this.fileList = [];
        this.$message.error('取消上传');
        this.$emit('closeDialog');
      },
      okFun() {
       
      },
      
    },
    watch: {
      itemData: {
        immediate: true,
        handler (data) {
          this.data = data;
        }
        
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>