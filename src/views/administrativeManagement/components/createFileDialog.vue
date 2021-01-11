<template>
    <el-dialog v-dialogDrag :visible="dialogVisible" title="创建文件" width="40%" :before-close="handleClose">
        <el-row>
            <el-form ref="form" :model="data" :rules="rules" label-width="90px" size="medium">
                <el-col :span="24">
                    <el-form-item label="文件名称:" prop="fileName">
                        <qqt-input :value="data.fileName" :placeholder="'请输入流文件名称'" @input="data.fileName = $event"></qqt-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="文件类型:">
                        <qqt-radio :value="data.fileType" :options="options" @radio="data.fileType = $event"></qqt-radio>
                    </el-form-item>
                </el-col>
                <el-col :span="24" class="dialog-footer">
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">确认</el-button>
                        <el-button @click="handleClose">取消</el-button>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-row>
    </el-dialog>
</template>

<script>
    import { qqtInput, qqtRadio } from '@/components/qqt-subassembly'
    export default {
        props: {
            dialogVisible: {
                type: Boolean,
                default: () => false
            }
        },
        data () {
            return {
                data: {
                    fileName: '',
                    fileType: '1',
                },
                options: [
                    {
                        value: '1',
                        label: 'docx'
                    },
                    {
                        value: '2',
                        label: 'xlsx'
                    }
                ],
                rules: {
                    fileName: [
                        { required: true, message: '文件名称不能为空', trigger: 'blur' },
                    ]
                }
            }
        },

        methods: {

            handleClose () {
                this.$emit ('close')
            },

            onSubmit () {
                this.$refs.form.validate (boolean => {
                    if (boolean) this.$emit ('close', this.data)
                })
            }
        },

        components: {
            'qqt-input': qqtInput,
            'qqt-radio': qqtRadio
        }
    }
</script>
