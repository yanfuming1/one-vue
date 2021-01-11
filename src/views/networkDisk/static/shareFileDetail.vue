<template>
    <div class="file-box">
        <el-row class="code-input-box">
            <el-col :span="14" :offset="5">
                <div>
                    <div class="code-input-div" v-if="!showFile">
                        <div class="code-input-title">
                            <el-image :src="logoUrl"></el-image>
                            <span class="com-name">企企通网盘加密文件</span>
                        </div>
                        <div class="code-input-con">
                            <p>请输入提取码：</p>
                            <div class="code-input-btn">
                                <el-input v-model="inputCode" size="mini" placeholder="请输入提取码"></el-input>
                                <el-button type="primary" @click="onSubmit" size="mini">确 定</el-button>
                            </div>
                        </div>
                    </div>
                    <div class="code-input-div file-info-div" v-if="showFile">
                        <div class="code-input-title">
                            <div class="code-input-title-info">
                                <p class="file-name">{{ fileName }}</p>
                                <p><i class="el-icon-time" style="margin-right:5px;"></i>{{ createTime }}</p>
                            </div>
                            <el-button type="primary" @click="downLoad" size="small"><i class="el-icon-download"></i>下 载({{ size }})</el-button>
                        </div>
                        <div class="code-input-con">
                            <div v-if="type !== '7'" class="code-input-con-div">
                                <el-image :src="imgUrl"></el-image>
                                <p>文件大小： {{ size }}</p>
                            </div>
                            <div v-else class="code-input-con-div full-img">
                                <el-image :src="imgUrl"></el-image>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import md5 from 'js-md5';
import { resourQueryByResId } from '../../../api/disk/personalImage'
import util from '../../../libs/util';
export default {
    data () {
        return {
            inputCode: '',
            showFile: false,
            imgUrl: '',
            fileName: '',
            fileInfo: {},
            logoUrl: require('./img/logo-file.png'),
            type: '',
            createTime: '',
            size: ''
        }
    },
    methods: {
        onSubmit () {
            if (md5(this.inputCode) === this.$route.query.code) {
                this.showFile = true
                this.$message.success("验证码输入正确~~~")
                resourQueryByResId({resid:this.$route.query.id}).then(res => {
                    // console.log(res)
                    this.fileInfo = res
                    this.fileName = res.name
                    this.createTime = res.createTime
                    this.type = res.resourcetype
                    this.size = util.nFormatter(res.resourcesize)
                    switch(res.resourcetype){
                        //  1 文件夹 2 word 3 pdf 4 txt 5 excel  6zip 7img 8ppt 9未知
                        case '1':
                            this.imgUrl = require("@/assets/image/filebox.png")
                            break
                        case '2':
                            this.imgUrl = require("@/assets/image/docx.png")
                            break
                        case '3':
                            this.imgUrl = require("@/assets/image/pdf.png")
                            break
                        case "4":
                            this.imgUrl = require("@/assets/image/txt.png")
                            break
                        case "5":
                            this.imgUrl = require("@/assets/image/EXCEL.png")
                            break
                        case "6":
                            this.imgUrl = require("@/assets/image/zip.png")
                            break
                        case "7":
                            this.imgUrl = res.url
                            break
                        case "8":
                            this.imgUrl = require("@/assets/image/ppt.png")
                            break
                        case "9":
                            this.imgUrl = require("@/assets/image/unknow.png")
                            break
                        default:
                            break
                    }

                })
            } else {
                this.showFile = false
                this.$message.warning("验证码输入错误")
            }
        },
        downLoad () {
            const elink = document.createElement('a')
            elink.download = this.fileInfo.name
            elink.style.display = 'none'
            elink.href = process.env.VUE_APP_API+"/file/download?fileOldName="+this.fileInfo.name+"&filePath="+this.fileInfo.url
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
        }
    },
    mounted () {
        // console.log(this.$route.query)
    }
}
</script>
<style lang="scss">
.file-box{
    background: #F5FAFD;
    width: 100%;
    height: 100%;
    .code-input-box{
        display:flex;
        justify-content:center;
        align-items:center;
        height: 100%;
        .code-input-div{
            height: 300px;
            width: 500px;
            border-radius: 5px;
            background: #FFF;
            box-shadow: 8px 8px 8px #eee;
            .code-input-title{
                height: 90px;
                width: 100%;
                background: url("./img/title-back.png") no-repeat center;
                background-size: 100% 100%;
                padding: 25px 40px;
                .el-image{      
                    height: 40px;
                    width: 40px;
                    float: left;
                }
                .com-name{
                    color: #FFF;
                    margin-left: 20px;
                    font-size: 15px;
                    line-height: 40px;
                    display: inline-block;
                }
            }
            .code-input-con{
                padding: 60px 40px 0px 40px;
                p{
                    margin-bottom: 15px;
                }
                .code-input-btn{
                    display: flex;
                    .el-button{
                        margin-left: 15px;
                    }
                }
            }
        }
        .file-info-div{
            height: 420px;
            width: 500px;
            border-radius: 5px;
            background: #FFF;
            box-shadow: 8px 8px 8px #eee;
            .code-input-title{
                background: none;
                border-bottom: 1px solid #ddd;
                height: 70px;
                padding: 10px 20px;
                .code-input-title-info{
                    width: 300px;
                    float: left;
                    p{
                        margin: 0px;
                        font-size: 12px;
                        line-height: 20px;
                        color: #666;
                    }
                    .file-name{
                        font-size: 16px;
                        line-height: 30px;
                    }
                }
                .el-button{
                    float: right;
                    margin-top: 10px;
                }
            }
            .code-input-con{
                padding: 10px;
                height: 350px;
                .code-input-con-div{
                    width: 100%;
                    height: 100%;
                    border: 1px dashed #DDD;
                    text-align: center;
                    background: #F7F8FA;
                    .el-image{
                        width: 120px;
                        height: 120px;
                        margin-top: 90px;
                    }
                }
                .full-img{
                    .el-image {
                        height: 100%;
                        width: auto;
                        margin-top: 0px;
                    }
                }
            }
        }
    }
}


</style>