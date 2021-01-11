<template>
    <el-dialog :title="title" class="plan-form" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="medium" label-width="100px" class="demo-ruleForm">
            <el-form-item label="计划名称：" prop="planName">
                <el-input v-model="ruleForm.planName" :disabled="isShowDetails"></el-input>
            </el-form-item>
            <el-form-item label="版本号：" prop="version">
                <el-input v-model="ruleForm.version" :disabled="isShowDetails"></el-input>
            </el-form-item>
            <el-form-item label="备注：">
                <el-input v-model="ruleForm.remark" type="textarea" :disabled="isShowDetails"></el-input>
            </el-form-item>
            <el-divider content-position="left">附件</el-divider>
            <div class="review-prequalification-documents">
                <div class="review-prequalification-documents-top">
                    <p>注：可上传图片、文档、压缩包等类型文件，单个文件大小不能超过20M</p>
                </div>
                <div class="review-prequalification-documents-conent">
                    <up-load @upLoadFileCallBack="upLoadFileCallBack" :isShowUpload="!isShowDetails" :propList="upLoadFileDefaultList" ref="upLoad" />
                </div>
            </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button v-if="!isShowDetails" type="primary" @click="cancel('add')">确 定</el-button>
            <el-button @click="cancel('cancel')">取 消</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { selfSchedulePlanAdd, selfSchedulePlanEdit } from '@/api/selfProject/scheduleManagement/schedulePlan/index'
import { upload, } from '@/components/qqt-subassembly'
export default {
    props: {
        planInfo: {
            type: Object,
            default: () => { return {} }
        },
        dialogVisible: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: '新增'
        },
        isShowDetails: {
            type: Boolean,
            default: false
        },
        projectCode: {
            type: String,
            default: ''
        },
        editInfo: {
            type: Boolean,
            default: false
        }
    },
    components: {
        'up-load': upload
    },
    data () {
        return {
            ruleForm: {
                planName: '',
                version: '',
                remark: '',
            },
            rules: {
                planName: [ { required: true, message: '请输入计划名称', trigger: ['blur', 'change' ]}, ],
                version: [ { required: true, message: '请输入版本号', trigger: ['blur', 'change' ]}, ],
            },
            upLoadFileDefaultList: [],
        }
    },
    methods: {
        handleClose(done) {
            done()
        },
        cancel (type) {
            if(type === 'add') {
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        let url = this.editInfo ? selfSchedulePlanEdit: selfSchedulePlanAdd
                        url ({
                            ...this.ruleForm,
                            projectCode: this.projectCode
                        }).then(res => {
                            this.$message.success('添加成功!!!')
                            this.$emit('close')
                        })
                    }
                })
            } else {
                this.$emit('close')
            }
        },

        upLoadFileCallBack (item) {
            this.ruleForm.fileList = item
        },

        fileDefaultNeaten (res) {
            this.upLoadFileDefaultList = []
            if (res.fileList && res.fileList.length > 0) {
                res.fileList.forEach(item => {
                    let m = {
                        status : 'finished',
                        response : {
                            url : item.url,
                            size: item.size,
                            name: item.name
                        }
                    }
                    this.upLoadFileDefaultList.push(m)
                })
            }
        },
    },
    watch: {
        planInfo: {
            deep: true,
            immediate: true,
            handler (val) {
                this.ruleForm = val
                this.fileDefaultNeaten(val)
            }
        }
    }
}
</script>
<style lang="scss">
.plan-form {
    .review-prequalification-documents {
        height: 300px;
        border-radius: 2px;
        border: solid 1px $color-straight-line3;
        margin-left: 22px;
        .review-prequalification-documents-top {
            height: 32px;
            background: $color-bg;
            border-bottom: solid 1px $color-straight-line3;
            margin-bottom: 22px;
            p {
                font-size: 12px;
                color: $color-text-sub;
                line-height: 32px;
                margin-left: 22px;
            }
        }
        .review-prequalification-documents-conent {
            margin: 0 22px;
            .el-tabs__content {
                overflow: auto;
                height: 220px;
            }
        }
    }
}
</style>
