<template>
    <div class="upload">
        <div class="demo-upload-list" :key="index" v-for="(item, index) in uploadList">
            <template v-if="item.status === 'finished'">
                  <!-- <i class="fa fa-file-excel-o" v-if="item.response.url.indexOf('.xlsx') != -1|| item.response.url.indexOf('.xls') != -1" style="font-size:30px" aria-hidden="true"></i> -->
                  <!-- <i class="fa fa-file-word-o" v-else-if="item.response.url.indexOf('.docx') != -1|| item.response.url.indexOf('.doc') != -1" style="font-size:30px" aria-hidden="true"></i> -->
                  <!-- <i class="fa fa-file-text " v-else-if="item.response.url.indexOf('.txt') != -1" style="font-size:30px" aria-hidden="true"></i>
                  <i class="fa fa-file-pdf-o" v-else-if="item.response.url.indexOf('.pdf') != -1" style="font-size:30px" aria-hidden="true"></i> -->
                  <img class="no-border" src="@/assets/image/docx.png" v-if="item.fileType == '2'" >
                  <img class="no-border" src="@/assets/image/pdf.png" v-else-if="item.fileType == '3'" >
                  <img class="no-border" src="@/assets/image/txt.png" v-else-if="item.fileType == '4'" >
                  <img class="no-border" src="@/assets/image/EXCEL.png" v-else-if="item.fileType == '5'" >
                  <img class="no-border" src="@/assets/image/zip.png" v-else-if="item.fileType == '6'" >
                  <img class="no-border" src="@/assets/image/ppt.png" v-else-if="item.fileType == '8'" >
                  <img class="no-border" src="@/assets/image/unknow.png" v-else-if="item.fileType == '9'" >
                  <img v-else :src="item.response.url">
                <p>{{ item.response.name }} </p>
                <div class="demo-upload-list-cover">
                    <!-- <a @click.prevent="downloadItem(item.response.url)" :href="item.response.url" v-if="item.response.url.indexOf('.xlsx') != -1|| item.response.url.indexOf('.xls') != -1"><i class="md-cloud-download"  ></i></a>
                    <a :download="item.response.url.split('/')[item.response.url.split('/').length-1]" :href="item.response.url" v-else-if="item.response.url.indexOf('.docx') != -1|| item.response.url.indexOf('.doc') != -1"><i class="md-cloud-download"  ></i></a>
                    <a @click.prevent="downloadItem(item.response.url)" :href="item.response.url" v-else-if="item.response.url.indexOf('.txt') != -1"><i class="md-cloud-download"  ></i></a>
                    <a :download="item.response.url.split('/')[item.response.url.split('/').length-1]" :href="item.response.url" v-else-if="item.response.url.indexOf('.pdf') != -1"><i class="md-cloud-download"  ></i></a> -->
                      <p>
                        <i class="el-icon-download" @click="downloadItem(item.response.url, item.response.name)" v-if="item.fileType != '7'"></i>
                        <i v-else class="el-icon-view" @click="handleView(item.response.url)"></i>
                        <i v-if="item.fileType != '7' && isShow && onlinePreview" @click="editDoc(item, '1')" class="el-icon-edit"></i>
                      </p>
                      <p>
                        <i v-if="item.fileType != '7' && onlinePreview" @click="editDoc(item, '0')" class="el-icon-view"></i>
                        <i class="el-icon-delete" v-if="isShow" @click="handleRemove(item)"></i>
                      </p>
                    </el-row>
                </div>
            </template>
            <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
        </div>
        <div v-if="showLists" style="width:100px;display:inline-block;">
        <Upload
              v-if="isShow"
              style="width:100px;display:inline-block;"
              :ref="diffrentRef"
              :show-upload-list="false"
              :default-file-list="defaultList"
              :on-success="handleSuccess"
              :headers="headers"
              :max-size="2048"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :before-upload="handleBeforeUpload"
              multiple
              drag
              type="drag"
              :action="upLoadUrl">
            <div style="width: 100px;height:100px;line-height: 100px;">
                <img src="./upload.svg" class="up-load-icon"/>
            </div>
        </Upload>
        </div>
        <div v-if="!showLists">
          <Upload
              v-if="isShow"
              :ref="diffrentRef"
              :show-upload-list="false"
              :default-file-list="defaultList"
              :on-success="handleSuccess"
              :headers="headers"
              :max-size="2048"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :before-upload="handleBeforeUpload"
              drag
              type="drag"
              :action="upLoadUrl">
              <el-button type="text" size="mini"><i class="el-icon-upload el-icon--right"></i>上传附件</el-button>
          </Upload>
        </div>
        <span v-if="uploadList.length === 0 && !isShow">暂无附件</span>
        <div v-if="uploadList.length > 0 && !isShow && showAddToBtn && !isSingleton">
          <el-upload
              class="upload-demo"
              :action="upLoadUrl"
              ref="upLoadExcel"
              :on-change="handleFileUploaderChange"
              :before-upload="beforeUploadAdd">
              <el-button type="warning" size="mini">追加附件</el-button>
          </el-upload>
        </div>
        <el-dialog v-dialogDrag :title="title" :visible.sync="visible" width="700px"  top="4vh" append-to-body>
            <iframe v-if="imgName.indexOf('.pdf') != -1" :src="imgName" width="100%" height="600px" ref="imgContent">
            </iframe>
            <el-image v-else :src="imgName" :preview-src-list="srcList" style="width: 100%" ref="imgContent"></el-image>
        </el-dialog>
    </div>
</template>

<script>
import {Icon, Modal, Upload} from 'iview'
import { fileUpload,getFileName,fastDFSDelete,docPreview, newFastDFSDownload, fileUploadAdd} from '../../../api/system/file/file'
import { fileOnlineView, searchPageList } from '@/api/configuration/index';
import util from '../../../libs/util'
  let that = this
  export default {
    name: "index",
    props: {
      propList: {
        type: Array,
        default: function () {
          return []
        }
      },
      isShowUpload: {
         type: Boolean,
         default: true
      },
      dataId:{
        type: String,
        default: () => {
          return ''
        }
      },
      isOnlyPictures: {
        type: Boolean,
        default: false
      },
      isSingleton: {
        type: Boolean,
        default: false
      },
      showLists: {
        type: Boolean,
        default: true
      },
      diffrentRef: {
        type: String,
        default: () => {
          return 'upload'
        }
      },
      showAddToBtn: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        title: '',
        innerVisible: false,
        isShow: this.isShowUpload,
        defaultList: [],
        imgName: '',
        visible: false,
        uploadList: [],
        upLoadUrl: '',  //上传地址
        headers: {
            'Access-Control-Allow-Origin' : '*'
        },
        srcList: [],
        onlinePreview: false,
        domId: ''
      }
    },

    components: {
      Icon,
      Modal,
      Upload,
    },
    methods: {
      handleFileUploaderChange (file) {
        
      },
      beforeUploadAdd (data) {
        that.domId = this.$attrs.id
        this.$emit('before')
        let isJPG = /^image\/(jpeg|png|jpg)$/.test(data.type);
        if (!isJPG && this.isOnlyPictures) {
          this.$message.warning ('只能上传图片')
          return false
        }
        let tempArr = []
        let fd = new FormData()
        fd.append('file', data)
        fileUpload(fd).then(res => {
            let item = {
                status: 'finished',
                response: {
                    url: res,
                    size: data.size,
                    name: data.name
                },
                fileType: util.getFileType(data.name)
            }
            tempArr.push(item.response)
            if(that.domId === 'dialogMale') { 
              this.$emit ('dialogUploadBack', item)
            } else {
              that.uploadList.push(item)
              that.callBackData()
            }
        }).finally(() => {
          fileUploadAdd({
            'path': this.uploadList[0].response.url,
            'id':this.dataId,
            'file': tempArr
          }).then(res => {
            this.$message.success('追加成功!!!')
          })
        })
        return false
      },
      handleView(name) {
        let item = this.uploadList.find (f => f.response.url === name)
        this.title = item.response.name
        this.imgName = name;
        this.visible = true;
        this.srcList = []
        this.srcList.push(name)
      },
      handleRemove(file) {
        if(this.uploadList.length > 0){
            for(let i = 0;i < this.uploadList.length; i++){
                if(this.uploadList[i].response.url === file.response.url){
                    // 判断文件名如果相等
                    this.uploadList.splice(i, 1)
                    this.$emit ('remove', i)
                }
            }
        }
        const fileList = this.$refs[this.diffrentRef].fileList;
        this.$refs[this.diffrentRef].fileList.splice(fileList.indexOf(file), 1);
        this.callBackData()
        this.deleteFile(file.response.url)
      },
      deleteFile (file) {
        fastDFSDelete ({'filePath':file}).then(res => {
          if (res.success) {
            this.$message.success(res.message)
          }
        })
      },
      handleSuccess(res, file, fileList) {
        if (res.status === 'finished') {
          file.url = file.response.message;
          file.name = file.name;
        }
        this.callBackData()
      },
      handleFormatError(file) {
        this.$Notice.warning({
          title: 'The file format is incorrect',
          desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
        });
      },
      handleMaxSize(file) {
        this.$Notice.warning({
          title: 'Exceeding file size limit',
          desc: 'File  ' + file.name + ' is too large, no more than 2M.'
        });
      },
      handleBeforeUpload(data) {
        that.domId = this.$attrs.id
        this.$emit('before')
        let isJPG = /^image\/(jpeg|png|jpg)$/.test(data.type);
        if (!isJPG && this.isOnlyPictures) {
          this.$message.warning ('只能上传图片')
          return false
        }
        let fd = new FormData()
        fd.append('file', data)
        fileUpload(fd).then(res => {
            let item = {
                status: 'finished',
                response: {
                    url: res,
                    size: data.size,
                    name: data.name
                },
                fileType: util.getFileType(data.name)
            }
            // item.status = 'finished'
            // item.response.message = res
            if(that.domId === 'dialogMale') { 
              this.$emit ('dialogUploadBack', item)
            } else {
              !this.isSingleton ? that.uploadList.push(item) : this.$emit ('upLoadFileSingleton', item)
              that.callBackData()
            }
        })
        return false
      },
      callBackData() {
        let arr = []
        this.uploadList.forEach( res => {
          arr.push (res.response)
        })
        this.$emit('upLoadFileCallBack', arr)
      },
      downloadItem (url, fileName) {
        newFastDFSDownload({ filePath: url }).then(res => { 
          var elink = document.createElement('a');
            elink.download = fileName;
            elink.style.display = 'none';
            elink.href = window.URL.createObjectURL(res);
            elink.click()
        })
      },
      setType (data) {
        if (data.length > 0) {
          data.forEach(item => {
            item.fileType = util.getFileType(item.response.url)
          })
        }
        return data
      },
      editDoc(fileItem, type) {
        if(fileItem.response.size > (5 * 1024 * 1024)){
          this.$message.warning(type === '1' ? '文件大于5M，不能在线编辑！！！' : '文件大于5M，不能在线查看！！！')
        } else {
          util.confirm( type === '1' ? '确定在线编辑内容吗？' : '确定在线查看内容吗？').then(res => {
            if (res) {
              docPreview({
                path: fileItem.response.url,
                type: type,
              }).then(res => {
                window.open (res)
              })
            }
          })
        }
      }
    },
    mounted() {
      that = this
      this.uploadList = JSON.parse (JSON.stringify (this.setType(this.propList)))
      // this.uploadList = this.$refs.upload.fileList;
      this.upLoadUrl = 'http://192.168.2.180/qqtoi/file/upload';
      // fileOnlineView({id: '1'}).then(res => {
      //   this.onlinePreview = res.isopen === '1' ? true : false
      // })
      searchPageList({'identification' :'9' }).then(res => {
        this.onlinePreview = res[1].value === '1' ? true : false
      })
    },
    watch: {
      isShowUpload(newVal){
        this.isShow = newVal
      },
      propList (newdata) {
        if(newdata && newdata.length > 0){
           this.defaultList = JSON.parse (JSON.stringify (this.propList))
          this.uploadList = JSON.parse (JSON.stringify (this.setType(this.propList)))
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
    .upload {
        @import '~iview/dist/styles/iview.css';

        .demo-upload-list {
            display: inline-block;
            width: 100px;
            height: 140px;
            text-align: center;
            line-height: 100px;
            border: 1px solid transparent;
            border-radius: 4px;
            overflow: hidden;
            background: #fff;
            position: relative;
            box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
            margin-right: 10px;
            img {
                width: 95px;
                height: 100px;
                border: 1px solid #DDD;
                padding: 5px;
                box-sizing: border-box;
            }
            .no-border{
                border: none;
            }
            p{
                line-height: 20px;
                margin-top: -45px;
                font-size: 10px;
                word-break: break-all;
                color: #666;
            }
        }
        .demo-upload-list-cover {
            display: none;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, .6);
            padding-top: 40px;
            p{
              margin-top: 0px;
              line-height: 30px;
              i{
                margin: 0px 5px;
              }
            }
        }

        .demo-upload-list:hover .demo-upload-list-cover {
            display: block;
        }

        .demo-upload-list-cover i {
            color: #fff;
            font-size: 20px;
            cursor: pointer;
            margin: 0 2px;
        }
        .up-load-icon{
            width: 100px;
            height: 100px;
        }
    }
</style>
