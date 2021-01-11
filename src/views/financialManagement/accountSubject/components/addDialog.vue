<template>
    <d2-container class="accountSubject">
        <el-card class="box-card closeHeader" style="height:100%;">
            <div slot="header">
                <el-button  type="text" @click="dialogCancel"><i class="el-icon-close"></i></el-button>
            </div>
            <div style="padding:20px;margin-top: 50px;">
                <el-form :model="form" ref="form" :rules="rules" label-width="100px">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="科目名称:" prop="subjectname">
                                <el-input :disabled="isAdd === '详情' ? true : false " v-model="form.subjectname"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="科目序号:" prop="subjectserial">
                                <el-input :disabled="isAdd === '详情' ? true : false " v-model="form.subjectserial"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="科目级别:" prop="subjectseq">
                                <el-input :disabled="isAdd === '详情' ? true : false " v-model="form.subjectseq"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="科目编码:" prop="subjectcode">
                                <!-- :disabled="isAdd === '添加' ? false : true "  -->
                                <el-input  :disabled="isAdd === '添加' ? false : true " v-model="form.subjectcode" @blur="blurCode(form.subjectcode)"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="上级名称:" prop="superiorname">
                                <el-input disabled v-model="form.superiorname"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="上级序号:" prop="superiorserial">
                                <el-input disabled v-model="form.superiorserial"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="上级级别:" prop="superiorseq">
                                <el-input disabled v-model="form.superiorseq"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="上级编码:" prop="superiorcode">
                                <el-input disabled v-model="form.superiorcode"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="科目全称:" prop="subfullname">
                                <el-input disabled v-model="form.subfullname"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="科目状态:" prop="substatus">
                                <el-input v-model="form.substatus" disabled v-if="isAdd === '详情'"></el-input>
                                <el-switch
                                    v-else
                                    v-model="form.substatus"
                                    active-value="使用"
                                    inactive-value="未使用"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="备注:" prop="remark">
                                <el-input style="color: #606266" :disabled="isAdd === '详情' ? true : false "  v-model="form.remark" type="textarea"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="设置人:" prop="setperson">
                                <el-input disabled v-model="form.setperson"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="工作单位:" prop="unit">
                                <el-input disabled v-model="form.unit"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="工作部门:" prop="department">
                                <el-input disabled v-model="form.department"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="设置时间:" prop="settime">
                                <el-input disabled v-model="form.settime"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-row>
                    <el-col :span="24" class="d2-text-center d2-mt-20">
                        <el-button size="small" @click="dialogCancel">取 消</el-button>
                        <el-button size="small" type="primary" @click="dialogConfim" v-if="isAdd != '详情'">确 定</el-button>
                    </el-col>
                </el-row>
                
            </div>
    </el-card>
    </d2-container>
</template>

<script>
    import util from '@/libs/util';
    import {preAjax,saveData} from '../../../../api/financialManagement/accountSubject';
    export default {
        props: {
            isAdd: {
                type: String,
                default: ''
            },
            dialogData: {
                type: Object,
                default: ()=>{
                    return {}
                }
            },

        },
        data() {
            return {
                form: {
                    subjectname: '',
                    subjectserial: '',
                    subjectseq: '',
                    subjectcode: '',
                    superiorname: '',
                    superiorserial: '',
                    superiorseq: '',
                    superiorcode: '',
                    subfullname: '',
                    substatus: '',
                    remark: '',
                    setperson: '',
                    unit: '',
                    department: '',
                    settime: '',
                },
                rules: {
                    subjectname: [
                        { required: true, message: '请填写科目名称', trigger: ['blur','change'] }
                    ],
                    subjectserial: [
                        { required: true, message: '请填写科目序号', trigger: ['blur','change'] }
                    ],
                    subjectseq: [
                        { required: true, message: '请填写科目级别', trigger: ['blur','change'] }
                    ],
                    subjectcode: [
                        { required: true, message: '请填写科目编码', trigger: ['blur','change'] }
                    ],
                },
            }
        },
        methods: {
            dialogCancel() {
                this.$emit('dialogCancel')
            },
            dialogConfim() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.form.subfullname =  this.form.subfullname + '/' + this.form.subjectname;
                        saveData(this.form).then(res => {
                            this.$message.success('保存成功')
                            this.dialogCancel();
                        })
                    }
                });
            },
            blurCode (value) {
                preAjax ({'subjectcode': value}).then( res => {
                    console.log(res )
                    if (!res.success) {

                        this.$message.error(res.message);
                    }
                })
                console.log(value)
            }
        },
        watch: {
           
            dialogData: {
                immediate: true,
                deep: true,
                handler(newValue, oldValue) {
                    util.setObjval(this.form,newValue)
                }
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>