<template>
    <div class="copyImg">
        <el-dialog
            v-dialogDrag
            title="ORC截图识别"
            :visible.sync="show"
            v-if="show"
            top="5vh"
            width="70%"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            @close="$emit('copyCancel')"
        >
            <slot name="header"></slot>
            <el-divider class="divider-title" content-position="left"><div class="generate-from-divider___line"></div> 粘贴发票</el-divider>
            <div class="box">
                <div id="preview" v-on:paste="handlePaste">
                    <span v-if="imgFileList.length == 0">将图片按Ctrl+V 粘贴至此处</span>
                    <div class="previewBox">
                        <div class="forBox" v-for="(item,index) in imgFileList" :key="index">
                            <img :src="item" alt="" >
                            <span class="copyImgBgc">
                                <span
                                    class="itemPreview"
                                    >
                                    <i class="el-icon-zoom-in" style="margin-right: 10px;" @click="handle('preview',item,index)"></i>
                                    <i class="el-icon-delete" @click="handle('delete',item,index)"></i>
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>  
            <slot name="factor"></slot>
            <span slot="footer" class="dialog-footer">
                <el-button @click="$emit('copyCancel')">取 消</el-button>
                <el-button type="primary" @click="comfirm">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog v-dialogDrag :visible.sync="imgShow" class="imgShowBox" v-if="imgShow" title="预览" top="5vh"  width="50%">
            <img width="100%" :src="dialogImageUrl"  alt="">
        </el-dialog>
    </div>
</template>

<script>
    import { fileUpload} from '@/api/system/file/file'
    export default {
        props: {
            copyShow:{
                type:Boolean,
                default: () =>{
                    return false
                }
            }
        },
        data () {
            return {
                show:false,
                imgShow:false,
                dialogImageUrl:'',
                imgFileList:[],
                fileList:[],
                jsonData:[]
            }
        },
        methods: {
            handle (type,item,index) {
                console.log(item,index);
                if (type ==='preview') {
                    this.dialogImageUrl = item;
                    this.imgShow = true;
                } else {
                    this.imgFileList.splice(index,1)
                    this.fileList.splice(index,1)
                }
            },
            comfirm () {
                // if (this.fileList.length === 0) {
                //     this.$message.error('请粘贴你要查询的截图')
                //     return
                // }
                // for (let i = 0; i < this.fileList.length; i++) {
                //     const formData = new FormData()
                //     formData.append('file', this.fileList[i])
                //     fileUpload(formData).then((res) => {
                //         console.log(res);
                //         this.jsonData.push(res);
                //     }).finally(()=>{
                //         if (this.fileList.length-1 == i) {
                this.$emit('copyUploadImg')
                //         }
                //     })
                // }
            },
            getData () {
                this.jsonData = [];
                return new Promise ((resolve,reject) =>{
                    if (this.fileList.length === 0) {
                        this.$message.error('请粘贴你要查询的截图')
                        reject(false)
                        return
                    }
                    for (let i = 0; i < this.fileList.length; i++) {
                        const formData = new FormData()
                        formData.append('file', this.fileList[i])
                        fileUpload(formData).then((res) => {
                            this.jsonData.push(res);
                           
                        }).finally(()=>{
                            if (this.fileList.length-1 == i) {
                                // this.$emit('copyUploadImg',this.jsonData)
                                resolve(this.jsonData)
                            }
                        })
                    }
                })
               
            },
            // 监听粘贴操作
            handlePaste(event) {
                const items = (event.clipboardData || window.clipboardData).items;
                let file = null;

                if (!items || items.length === 0) {
                    this.$message.error("当前浏览器不支持本地");
                    return;
                }
                // 搜索剪切板items
                for (let i = 0; i < items.length; i++) {
                    if (items[i].type.indexOf("image") !== -1) {
                        file = items[i].getAsFile();
                        break;
                    }
                }
                if (!file) {
                    this.$message.error("粘贴内容非图片");
                    return; 
                }
                // 此时file就是我们的剪切板中的图片对象
                // 如果需要预览，可以执行下面代码
                const reader = new FileReader();
                reader.onload = event => {
                    console.log(event);
                    // preview.innerHTML = `<img src="${event.target.result}">`;
                    this.imgFileList.push(event.target.result)
                };
                this.fileList.push(file)
                reader.readAsDataURL(file);
                // this.file = file;
            },
        },
        watch: {
            copyShow:{
                deep:true,
                handler(value) {
                    this.imgFileList = [];
                    this.show = value;
                }
            }
        },
    }
</script>

<style lang="scss" >
.copyImg {
    .el-upload-dragger{
        height:100%;
        width: 100%;
    }
    .box{
        height: 350px;
        border: 1px dotted #333;
        padding: 10px;
        #preview{
            overflow-y:scroll;
            height: 100%;
            img {
                height: 150px;
                width: 150px;
            }
            .previewBox{
                width: 100%;
            }
            .forBox{
                height: 150px;
                width: 150px;
                display: inline-block;
                position: relative;
                cursor: pointer;
            }
            .forBox :hover.copyImgBgc{
                opacity: 1;
            }
        }
        .copyImgBgc {
            cursor: pointer;
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            cursor: default;
            text-align: center;
            color: #fff;
            opacity: 0;
            font-size: 20px;
            background-color: rgba(0,0,0,.5);
            -webkit-transition: opacity .3s;
            transition: opacity .3s;
            .itemPreview {
                height: 100%;
                width: 100%;
                display: inline-block;
                text-align: center;
                line-height: 150px;
            }
        }
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