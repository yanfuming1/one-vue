<template>
    <el-row class="dic-group-info">
        <el-col :span="24" >
            <el-form :model="formData" :rules="rules" ref="formData" :label-position="labelPosition" label-width="80px">
                <el-form-item label="字段代码" prop="dicCode">
                    <p v-if="isDetail">{{ formData.dicCode }}</p>
                    <el-input type="text" v-model="formData.dicCode" v-show="!isDetail" @input="change"></el-input>
                </el-form-item>
                <el-form-item label="字段名称" prop="name">
                    <p v-if="isDetail">{{ formData.name }}</p>
                    <el-input type="text" v-model="formData.name" v-show="!isDetail" @input="change"></el-input>
                </el-form-item>
                <el-form-item :label="labelName" v-show="!isShowParentName"> 
                    <p v-if="isDetail">{{ formData.parentName }}</p>
                    <el-input v-model="formData.parentName" disabled v-show="!isDetail"></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="是否系统字典">
                            <el-radio-group v-model="formData.isSystem" @change="data => radioChange('isSystem', data)" :disabled="isDetail">
                                <el-radio label="1">是</el-radio>
                                <el-radio label="0">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="状态">
                            <el-radio-group v-model="formData.isUse" :disabled="isDetail">
                                <el-radio label="1">启用</el-radio>
                                <el-radio label="0">禁用</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="备注">
                    <p v-if="isDetail">{{ formData.remark }}</p>
                    <el-input type="textarea" v-model="formData.remark" v-if="!isDetail"></el-input>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "dic-group",
        props: {
            labelName: {
                type: String,
                default: () => {
                    return '字典分类'
                }
            },
            dicInfo: {
                type: Object,
                default: () => {
                    return {
                        isSystem: '1',
                        isUse: '1',
                        name: '',
                        dicCode: ''
                    }
                }
            },
            isDetail: {
                type: Boolean,
                default: function () {
                    return false
                }
            },
            isShowParentName: {
                type: Boolean,
                default: () => false
            },
            parentId: String,
            parentName: {
                type: String,
                default: () => ""
            }
        },
        data () {
            return {
                rules: {
                    dicCode: [
                        { required: true, message: '请输入字典项编码', trigger:['blur', 'change']},
                    ],
                    name: [
                        { required: true, message: '请输入字典项名称', trigger:['blur', 'change']}
                    ]
                },
                labelPosition: 'top',
                formData: {
                    name: null,
                    dicCode: null,
                    type: '',
                    isSystem: '',
                    remark: '',
                    isUse: '',
                    parentId: '',
                    parentName: '',
                },
            }
        },
        methods: {
            getData() {
                let info = {
                    canSub: false,
                    info: {}
                }
                this.$refs['formData'].validate((valid) => {
                    if(valid) {
                        info.canSub = true
                        info.info = this.formData
                    } else {
                        info.canSub = false
                    }
                })
                return info
            },
            change(val){
                this.$forceUpdate()
            },
            clearValidate () {
                this.$refs.formData.clearValidate()
            },
            radioChange (type, data) {
                switch(type) {
                    case 'isSystem':
                        this.$set(this.formData, this.formData.isSystem, data)
                        break
                }
            }
        },
        mounted() {
            this.formData = JSON.parse(JSON.stringify(this.dicInfo))
            this.formData.parentName = this.parentName
            this.clearValidate()
        },
        watch: {
            parentId () {
                this.formData.parentId = this.parentId
            },
            parentName (newVal, old) {
                this.formData.parentName = newVal
            },
            dicInfo : {
                deep: true,
                handler (val) {
                    this.formData = JSON.parse(JSON.stringify(val))
                    this.formData.parentName = this.parentName
                    this.clearValidate()
                }
            }
        }
    }
</script>

<style lang="scss">
.dic-group-info{
    .el-form--label-top .el-form-item__label{
        padding-bottom: 0px !important;
    }
}
</style>
