<template>
    <div class="certificate-info">
        <el-form :model="cerForm" ref="ruleForm" label-width="100px" size="medium" class="demo-ruleForm" :rules="rules">
            <el-row>
                <el-col :span="10" :offset="1">
                    <el-form-item label="证书类型" prop="certificateType">
                        <qqt-select
                            :value="cerForm.certificateType"
                            :options="certificateType"
                            @select="selectType"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="10" :offset="2">
                    <el-form-item label="证书编码" prop="encoding">
                        <qqt-input :value="cerForm.encoding" @input="cerForm.encoding = $event" :placeholder="'请输入证书编号'"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10" :offset="1">
                    <el-form-item label="证书名称" prop="name">
                        <qqt-input :value="cerForm.name" @input="cerForm.name = $event" :placeholder="'请输入证书名称'"/>
                    </el-form-item>
                </el-col>
                <el-col :span="10" :offset="2">
                    <el-form-item label="身份证号">
                        <qqt-input :value="cerForm.possessorid" :isShowElement="false" @input="cerForm.possessorid = $event" :placeholder="'请输入身份证号'"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10" :offset="1">
                    <el-form-item label="持有人">
                        <qqt-input :value="cerForm.possessor" :isShowElement="false" @input="cerForm.possessor = $event" :placeholder="'请输入持有人'"/>
                    </el-form-item>
                </el-col>
                <el-col :span="10" :offset="2">
                    <el-form-item label="发证单位" prop="issueUnit" v-if="!showAddLine">
                        <qqt-input :value="cerForm.issueUnit" @input="cerForm.issueUnit = $event" :placeholder="'请输入发证单位'"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10" :offset="1">
                    <el-form-item label="专业类别" prop="majorTypeId" v-if="!showAddLine">
                        <qqt-select
                            v-if="cerForm.certificateType != '1'"
                            :value="cerForm.majorTypeId"
                            :defaultProp="speProp"
                            :options="speType"
                            @select="selectSpeciality"
                        />
                        <qqt-input :value="cerForm.majorTypeId" v-if="cerForm.certificateType == '1'" @input="cerForm.majorTypeId = $event"/>
                    </el-form-item>
                </el-col>
                <el-col :span="10" :offset="2">
                    <el-form-item label="级别" prop="levelId" v-if="!showAddLine">
                        <qqt-select
                            :value="cerForm.levelId"
                            :options="level"
                            @select="selectLevel"
                        />
                    </el-form-item>
                </el-col>
            </el-row>
            <!-- 类别一样时出现 -->
            <el-row v-if="showAddLine">
                <el-col :span="10" :offset="1">
                    <el-form-item label="是否在建">
                        <el-radio-group v-model="cerForm.isAbuilding">
                            <el-radio label="1">是</el-radio>
                            <el-radio label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="22" :offset="1">
                    <div class="cut-line"></div>
                </el-col>
            </el-row>
            <!-- 添加行 -->
            <el-row v-if="showAddLine" class="personal-addline">
                <el-col :span="22" :offset="1">
                    <fm-generate-form
                        :data="jsonData"
                        :remote="remoteFunctions"
                        :value="values"
                        ref="generateForm"
                        @on-change="selectChange"/>
                </el-col>
            </el-row>

            <el-row class="certificate-remark">
                <el-col :span="22" :offset="1">
                    <el-form-item label="备注">
                        <el-form-item>
                            <el-input type="textarea" v-model="cerForm.remark" @input="cerForm.remark = $event" :rows="5" placeholder="请输入备注" />
                        </el-form-item>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="22" :offset="1">
                    <el-form-item label="上传附件" >
                        <el-row>
                            <el-col :span="24">
                                <up-load @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefoutList" ref="upLoad"></up-load>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row class="cer-btn">
                <el-button size="small" type="warning" @click="subCer">保存</el-button>
                <!-- <el-button size="small" type="primary" @click="subCer">提交</el-button> -->
                <el-button size="small" @click="cancelCer">取消</el-button>
            </el-row>
        </el-form>
    </div>
</template>
<script>
import {qqtSelect, qqtInput, upload, qqtRelateTable} from "../../../../components/qqt-subassembly";
import { queryDicById } from '../../../../api/system/dic/dic'
import { certificateAdd, certificateEdit } from '../../../../api/personal-information/certificate/certificate'
import { getEntryRegistrationQueryById } from '../../../../api/personal-information/entryRegistration'
import { formGetJson } from '../../../../api/system/fromManagement/index'
import { CERTIFICATE } from '../../../../enum/FORMCODE'
import util from '@/libs/util'
let that = this
export default {
    name: "certificate-info",
    components: {
        "qqt-input":qqtInput,
        "qqt-select": qqtSelect,
        "up-load": upload,
        "qqt-relate-table": qqtRelateTable
    },
    props: {
        cerType: String,
        isAdd: {
            type: Boolean,
            default: true
        },
        cerInfoEdit: Object,
        optionMajor: {
            type: Array,
            default: () => {
                return []
            }
        },
        optionLevel: {
            type: Array,
            default: () => {
                return []
            }
        },
        unitList: {
            type: Array,
            default: () => {
                return []
            }
        },
    },
    data () {
        return {
            type: '',
            ruleForm: {},
            certificateType: [
                {
                    value: '1',
                    label: '学历证书'
                },{
                    value: '2',
                    label: '技能证书'
                },{
                    value: '3',
                    label: '专业证书'
                }
            ],
            level:[
                {
                    value: '1',
                    label: '一级'
                },{
                    value: '2',
                    label: '二级'
                },{
                    value: '3',
                    label: '三级'
                }
            ],
            speType: [],
            speProp: {
                value: 'id',
                label: 'name'
            },
            cerForm: {
                fileList: [],
                affiliatedUnitId: "",
                certificateType: "",
                createdBy: "",
                departmentId: "",
                encoding: "",
                id: "",
                informationId: "",
                isAbuilding: "",
                issueDate: "",
                issueUnit: "",
                issueUnitId: "",
                keeper: "",
                level: "",
                levelId: "",
                majorType: "",
                majorTypeId: "",
                name: "",
                posiId: "",
                possessor: "",
                possessorid: "",
                procInstId: "",
                procState: "",
                remark: "",
                updateBy: "",
                updateTime: "",
                userId: "",
            },
            showAddLine: false,
            // 文件上传
            doUpload:'http://192.168.2.180/qqtoi/file/upload',
            files: Object,
            fileName: '',
            defaultList: [],
            upLoadFileDefoutList: [],   //上传附件回显时临时存储
            // 添加行的信息
            data: {
                careerCertificateList: [],
            },
            isShowElement: false,
            option: {
                border: true,
            },
            jsonData: {},
            remoteFunctions: {
                getCerType(resolve){ resolve(that.optionMajor) },
                getLevel(resolve){ resolve(that.optionLevel) },
                getUnit(resolve){ resolve(that.unitList) }
            },
            values: {},
            rules: {
                certificateType: [
                    { required: true, message: '请选择证书类型', trigger: 'change'  }
                ],
                name: [
                    { required: true, message: '请输入证书名称', trigger: 'blur'  }
                ],
                issueUnit: [
                    { required: true, message: '请输入发证单位', trigger: 'blur' }
                ],
                majorTypeId: [
                    { required: true, message: '请选择专业类别', trigger: 'change' }
                ],
                levelId: [
                    { required: true, message: '请选择级别', trigger: 'change' }
                ]
            }
        }
    },
    methods: {
        selectType (data) {
            if(data === '3'){
                this.cerForm.isAbuilding = '0'
                this.showAddLine = true
            } else {
                this.showAddLine = false
            }
            this.cerForm.certificateType = data
        },
        selectSpeciality (data) {
            this.cerForm.majorTypeId = data
            this.speType.forEach(item => {
                if(item.id === data){
                    that.cerForm.majorType = item.name
                }
            })
        },
        selectLevel (data) {
            this.cerForm.levelId = data
            this.level.forEach(item => {
                if(item.value === data){
                    that.cerForm.level = item.label
                }
            })
        },
        selectChange(){},
        handleSuccess(res, file, fileList) {
            if (res.status === 'finished') {
                file.url = file.response.message;
                file.name = file.name;
            }
            this.callBackData()

        },
        upLoadFileCallBack(data) {
            this.cerForm.fileList = data
        },
        subCer () {
            this.$refs.ruleForm.validate (valid => {
                if (valid) {
                    if(this.showAddLine) {
                        this.$refs.generateForm.getData().then(data => {
                            that.cerForm.certiLineList = data.certiLineList
                            that.cerForm.certiLineList.forEach(item => {
                                that.optionMajor.forEach(it => {
                                    if(it.id == item.specialtyTypeId){
                                        item.specialtyType = it.name
                                    }
                                })
                                that.optionLevel.forEach(it => {
                                    if(it.id == item.levelId){
                                        item.level = it.name
                                    }
                                })
                                that.unitList.forEach(it => {
                                    if(it.id == item.unitId){
                                        item.issueUnit = it.name
                                    }
                                })
                            })
                            that.subInfo()
                        })
                    }else{
                        this.subInfo()
                    }
                }
            })
            
        },
        subInfo () {
            if(this.isAdd){
                this.cerForm.userId = util.cookies.get('uuid')
                certificateAdd(
                    this.cerForm
                ).then(res => {
                    this.$message.success('添加成功')
                    this.$emit('closeDrawer')
                })
            }else{
                certificateEdit(
                    this.cerForm
                ).then(res => {
                    that.$message.success('编辑成功')
                    that.$emit('closeDrawer')
                })
            }
        },
        cancelCer () {
            this.$emit('closeDrawer')
        },
        fileReturn () {
            this.upLoadFileDefoutList = []
            if(!this.isAdd){
                if(this.cerForm.fileList && this.cerForm.fileList.length > 0) {
                    this.cerForm.fileList.forEach(item => {
                        let m = {
                            status : 'finished',
                            response : {
                                url : item.url,
                                size: item.size,
                                name: item.name
                            }
                        }
                        this.upLoadFileDefoutList.push(m)
                    })
                }
            }
        },
        setdata (data) {
            this.cerForm = JSON.parse (JSON.stringify ( data ))
            if(data.certificateType === '3'){
                this.values = this.cerInfoEdit
                this.showAddLine = true
            } else {
                this.showAddLine = false
            }
            this.fileReturn()
        }
    },
    mounted () {
        that = this
        this.setdata(this.cerInfoEdit)
        getEntryRegistrationQueryById( { id : util.cookies.get ('uuid')} ).then(res => {
            this.cerForm.possessor = res.name
            this.cerForm.possessorid = res.idNumber
        })
    },
    created(){
        queryDicById(
            {id: '1168431017937518592'}
        ).then(res => {
            that.speType = res
        })
        formGetJson({
            code: CERTIFICATE.PERSONALCERADDLINE
        }).then(res => {
            this.jsonData = JSON.parse(res)
        })
    },
    watch: {
        cerInfoEdit (newVal) {
            this.setdata(newVal)
        }
    }
}
</script>
<style lang="scss">
.cut-line{
    border-top: 2px dashed #eee;
}
.certificate-info{
    padding-top: 20px;
    .upload-file{
        text-align: center;
    }
    .el-upload-dragger{
        width: 100%;
        height: auto;
        .el-icon-upload{
            margin-top: 20px;
            margin-bottom: 0px;
        }
        .el-upload__text{
            font-size: 12px;
        }
    }
    .cer-btn{
        text-align: center;
        margin: 30px 0px;
    }
    .certificate-remark{
        margin-top: 20px;
    }
    .personal-addline{
        margin-top: 20px;
    }
    .el-input--medium{
        .el-input__inner{
            border-radius: 0px;
        }
    }
}
</style>
