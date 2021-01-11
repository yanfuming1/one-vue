<template>
    <div class="uploadImgFp">
        <el-dialog
            v-dialogDrag
            title="ORC识别"
            :visible.sync="show"
            v-if="show"
            width="70%"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            @close="$emit('dialogCancel')"
        >
            <slot name="header"></slot>
            <el-divider class="divider-title" content-position="left"><div class="generate-from-divider___line"></div> 上传发票</el-divider>
            <el-upload
                action="#"
                drag
                list-type="picture-card"
                :file-list="fileList"
                :multiple="true"
                :http-request="uploadAvatar"
                accept="image/png,image/gif,image/jpg,image/jpeg,application/pdf"
               >
                <i class="el-icon-plus"></i>
                <div slot="file" slot-scope="{file}">
                    <img
                        v-if="isPdf(file)"
                        class="el-upload-list__item-thumbnail"
                        src="@/assets/image/pdf.png" alt=""
                    >
                    <img
                        v-else
                        class="el-upload-list__item-thumbnail"
                        :src="file.url" alt=""
                    >
                    <span class="el-upload-list__item-actions">
                        <span
                            class="el-upload-list__item-preview"
                            @click="handlePictureCardPreview(file)"
                            >
                            <i class="el-icon-zoom-in"></i>
                        </span>
                        <span
                            v-if="!disabled"
                            class="el-upload-list__item-delete"
                            @click="handleRemove(file)"
                            >
                            <i class="el-icon-delete"></i>
                        </span>
                    </span>
                </div>
            </el-upload>
            <slot name="factor"></slot>
            <span slot="footer" class="dialog-footer">
                <el-button @click="$emit('dialogCancel')">取 消</el-button>
                <el-button type="primary" @click="comfirm">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog v-dialogDrag :visible.sync="imgShow" class="imgShowBox" v-if="imgShow" :title="imgShowTitle" top="5vh"  width="50%">
            <iframe v-if="isShowPdf" :src="dialogImageUrl" width="100%" height="100%"></iframe>
            <img v-else width="100%" :src="dialogImageUrl"  alt="">
        </el-dialog>
    </div>
</template>

<script>
    import { fileUpload} from '@/api/system/file/file'
    export default {
        props: {
            dialogVisible:{
                type:Boolean,
                default: () =>{
                    return false
                }
            }
        },
        data () {
            return {
                show:false,
                dialogImageUrl: '',
                imgShow: false,
                disabled: false,
                fileList:[],
                saveFileList:[],
                formDate:'',
                imgShowTitle:'',
                isShowPdf:false
            }
        },
        methods: {
            isPdf (file) {
                let result = false;
                if (file.type) {
                    if (file.type.indexOf('pdf') != -1) {
                        result = true;
                    } 
                }
                return result;
            },
            uploadAvatar (file) {
                const formData = new FormData()
                formData.append('file', file.file)
                const uid = file.file.uid
                fileUpload(formData).then((res) => {
                    this.saveFileList.push({key:uid,url:res})
                    this.fileList.push({
                        name:file.file.name,
                        url:res,
                        uid:file.file.uid,
                        type:file.file.type
                    })
                })
            },
            comfirm() {
                let jsonData = []
                this.saveFileList.forEach(res =>{
                    jsonData.push(res.url)
                })
                this.$emit('uploadImg',jsonData)
            },
            handleRemove(file) {
                let fileIndex = this.fileList.findIndex (res=> res.uid === file.uid);
                this.fileList.splice(index,1)
                let index = this.saveFileList.findIndex (res=> res.uid === file.uid)
                this.saveFileList.splice(index,1)
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.imgShowTitle = file.name;
                this.imgShow = true;
                this.isShowPdf = false
                if (file.type) {
                    if (file.type.indexOf('pdf') != -1) {
                        this.isShowPdf = true;
                    } 
                }
            },
        },
        watch: {
            dialogVisible:{
                deep:true,
                handler(value) {
                    this.show = value;
                    this.fileList = [];
                    this.saveFileList = [];
                }
            }
        },
    }
</script>

<style lang="scss" >
.uploadImgFp {
    .el-upload-dragger{
        height:100%;
        width: 100%;
    }
    .imgShowBox{
        .el-dialog{
            height:80%;
            .el-dialog__body{
                height: calc(100% - 75px);
            }
        }
    }
}
</style>