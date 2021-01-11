<template>
    <el-dialog
        title="分享"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
        <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="链接地址：">
                <el-input v-model="form.url" disabled size="medium">
                    <template slot="append">
                        <el-button type="primary" @click="copyUrl">复制链接</el-button>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="提取码：">
                <el-input v-model="form.code" size="medium" disabled style="width: 150px;"></el-input>
                <!-- <span style="color:#999;margin-left:20px;">为空则无提取码</span> -->
            </el-form-item>
            <!-- <el-form-item label="有效期：">
                <el-radio-group v-model="form.validitime">
                    <el-radio :label="1">永久有效</el-radio>
                    <el-radio :label="2">7天</el-radio>
                    <el-radio :label="3">1天</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="分享标题：">
                <el-input v-model="form.title" placeholder="请输入分享标题"></el-input>
            </el-form-item> -->
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="shareInfo">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
        </span>
    </el-dialog>
</template>
<script>
export default {
    name: "shareFiles",
    props: {
        shareData: {
            type: Object,
            default: {}
        }
    },
    data () {
        return{
            dialogVisible: false,
            form: {
                url: '',
                code: '',
                // validitime: 1,
                // title: '',
            }
        }
    },
    methods : {
        handleClose (done) {
            done()
        },
        shareInfo () {
            this.dialogVisible = false
        },
        copyUrl () {
            let createInput = document.createElement("input");
            createInput.value = '分享的文件链接地址：' +  this.form.url + '。提取码:' + this.form.code ;
            document.body.appendChild(createInput);
            createInput.select(); // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
            createInput.style.display = "none";
            this.$message.success("复制成功~~~")
        },
        showDialog ()  {
            this.dialogVisible = true
        },
        cancel () {
            this.dialogVisible = false
        }
    },
    mounted () {
        this.form = this.shareData
    },
    watch: {
        shareData (newVal) {
            this.form = newVal
        }
    }
}
</script>