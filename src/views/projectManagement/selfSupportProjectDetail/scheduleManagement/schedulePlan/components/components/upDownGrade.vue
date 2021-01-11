<template>
    <el-dialog title="选择" :visible.sync="upDownShow" width="40%" :before-close="handleClose">
        <div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="降级到" prop="parentId">
                    <el-select v-model="ruleForm.parentId" placeholder="请选择">
                        <el-option v-for="item in parentList" :label="item.name" :value="item.id" :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="cancel('1')">确 定</el-button>
            <el-button @click="cancel('0')">取 消</el-button>
        </span>
    </el-dialog>
</template>
<script>
export default {
    props: {
        upDownShow: {
            type: Boolean,
            default: false
        },
        parentList: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data () {
        return {
            ruleForm: {
                parentId: '',
            },
            rules: {
                parentId: [{ required: true, message: '请选择降级到的任务', trigger: 'change' }]
            }
        }
    },
    methods: {
        handleClose () {
            this.cancel('0')
        },
        cancel (type) {
            if(type === '0') {
                this.$emit('cancelShow')
                return
            }
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.$emit('cancelShow', { ...this.ruleForm})
                }
            })
        }
    }
}
</script>