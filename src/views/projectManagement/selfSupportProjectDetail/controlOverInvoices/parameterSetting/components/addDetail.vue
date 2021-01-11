<template>
    <div >
        <div  style="margin:0 auto;width:500px">
            <h1 style="margin-bottom:3 0px;text-align:center"> {{showTitle === '购买方' &&  identification == 1 ? showTitle + '(我方)': (showTitle === '销售方' &&  identification == 2 ? showTitle + '(我方)' : showTitle)}}参数设置添加页面</h1>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
                <el-form-item :label="showTitle+'名称'" prop="name">
                    <el-input :disabled="transform" v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="纳税人识别号" prop="registerNum">
                    <el-input :disabled="transform" v-model="ruleForm.registerNum"></el-input>
                </el-form-item>
                <el-form-item label="地址、电话" prop="address">
                    <el-input :disabled="transform" v-model="ruleForm.address"></el-input>
                </el-form-item>
                <el-form-item label="开户行及账号" prop="bank">
                    <el-input :disabled="transform" v-model="ruleForm.bank"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <bottom-information :values="values"  :edit="!transform" ref="bottomInformation" />
    </div>
</template>

<script>
    import bottomInformation from './bottomInformation'
    import util from '@/libs/util.js'
    export default {
        components:{
            bottomInformation
        },
        props: {
            title: {
                type: String,
                default: ''
            },
            data: {
                type: Object,
                default: () =>{
                    return {}
                }
            },
            isEdit: {
                type: Boolean,
                default: () =>{
                    return false
                }
            },
        },
        data() {
            return {
                identification:'',
                showTitle:'',
                values: {},
                transform: false,
                ruleForm:{
                    name: '',
                    registerNum: '',
                    address: '',
                    bank: '',
                    id:''
                },
                rules:{
                    name: [
                        { required: true, message: `请输入名称`, trigger: 'change' }
                    ],
                    registerNum: [
                        { required: true, message: '请输入纳税人识别号', trigger: 'change' }
                    ],
                    address: [
                        { required: true, message: '请输入地址、电话', trigger: 'change' }
                    ],
                    bank: [
                        { required: true, message: '请输入开户行及账号', trigger: 'change' }
                    ],
                }
            }
        },
        mounted () {
            
        },
        methods: {
            getData () {
                return new Promise((resolve, reject) => {
                    this.$refs['ruleForm'].validate((valid) => {
                        this.$refs.bottomInformation.getData().then((result) => {
                                // delete result.createBy;
                                // delete result.createName;
                            const {companyId,companyName,createBy,createName,createTime,departmentId,departmentName} = result
                            let jsonData = {
                                ...this.ruleForm,
                                companyId,companyName,createBy,createName,createTime,departmentId,departmentName
                            }
                            resolve(jsonData)
                        })
                    })
                })
            },
            resetFields () {
                this.$nextTick(()=> {
                    this.$refs['ruleForm'].resetFields();
                })
            }
        },
        watch: {
            title: {
                deep:true,
                immediate:true,
                handler (value) {
                    this.identification = this.$route.params.identification;
                    this.showTitle = value;
                }
            },
            data: {
                deep:true,
                immediate:true,
                handler(val) {
                    if (!this.isEdit && util.cookies.get ('uuid') != val.createBy) {
                        val.createBy = '';
                        val.createName = '';
                        val.createTime = '';
                        val.departmentId = '';
                        val.departmentName = '';
                        val.companyId = '';
                        val.companyName = '';
                    }
                    this.ruleForm = Object.assign({},val);
                    this.values = {...this.ruleForm};
                }
            },
            isEdit: {
                deep:true,
                immediate:true,
                handler(val) {
                    this.transform = val;
                }
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>