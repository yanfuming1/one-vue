<template>
    <el-dialog
        v-dialogDrag
        :title="formTitle"
        :visible="createForm"
        :before-close="handleClose"
        width="50%">
        <el-form ref="form" :model="addFormData" class="from-create-div" :rules="rules">
            <el-row>
                <el-col :span="20" :offset="2">
                    <el-form-item label="表单名称" label-width="100px" prop="name">
                        <el-input v-model="addFormData.name" v-if="!isDetail" placeholder="请输入表单名称"></el-input>
                        <qqt-p v-if="isDetail" :value="addFormData.name"></qqt-p>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="20" :offset="2">
                    <el-form-item label="表单编码" label-width="100px" prop="code">
                        <el-input v-model="addFormData.code" v-if="!isDetail" placeholder="请输入表单编码"></el-input>
                        <qqt-p v-if="isDetail" :value="addFormData.name"></qqt-p>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="20" :offset="2">
                    <el-form-item label="表单分类" label-width="100px" prop="dicId">
                        <el-select v-model="addFormData.dicId" v-if="!isDetail" placeholder="请选择表单分类" style='width:100%'>
                            <el-option
                                v-for="item in treeData"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                        <qqt-p v-if="isDetail" :value="formType"></qqt-p>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="20" :offset="2">
                    <el-form-item label="表单标题" label-width="100px" prop="title">
                        <el-input v-model="addFormData.title" v-if="!isDetail" placeholder="请输入表单标题"></el-input>
                        <qqt-p v-if="isDetail" :value="addFormData.title"></qqt-p>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="20" :offset="2">
                    <el-form-item label="是否使用流程" label-width="100px">
                        <el-select v-model="addFormData.isFlow" v-if="!isDetail" placeholder="请选择是否使用流程" style='width:100%'>
                            <el-option
                                v-for="item in workflow"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                        <qqt-p v-if="isDetail" :value="addFormData.isFlow === '0' ? '否' : '是'"></qqt-p>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10" :offset="2">
                    <el-form-item label="表单打开方式:">
                        <el-radio-group v-if="!isDetail" v-model="addFormData.openType">
                            <el-radio label="1">页面</el-radio>
                            <el-radio label="2">弹窗</el-radio>
                            <el-radio label="3">抽屉</el-radio>
                        </el-radio-group>
                        <el-radio-group v-if="isDetail"  v-model="addFormData.openType">
                            <el-radio label="1" disabled >页面</el-radio>
                            <el-radio label="2" disabled >弹窗</el-radio>
                            <el-radio label="3" disabled >抽屉</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="10" :offset="2">
                    <el-form-item label="是否为基础表单:" v-if="addFormData.isFlow === '1'">
                        <el-radio-group v-if="!isDetail" v-model="addFormData.isBasics">
                            <el-radio label="1">是</el-radio>
                            <el-radio label="0">否</el-radio>
                        </el-radio-group>
                        <el-radio-group v-if="isDetail"  v-model="addFormData.isBasics">
                            <el-radio label="1" disabled >是</el-radio>
                            <el-radio label="0" disabled >否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="20" :offset="2" v-if="addFormData.isBasics === '0' && addFormData.isFlow === '1'" >
                    <el-form-item label="基础表单" label-width="100px" prop="parentId">
                        <el-select v-model="addFormData.parentId" v-if="!isDetail" placeholder="请选择基础表单" style='width:100%'>
                            <el-option
                                v-for="item in basicsList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                        <qqt-p v-if="isDetail" :value="basicsName"></qqt-p>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" v-if="!isDetail" type="primary" @click="closeDialog">确 定</el-button>
            <el-button size="small" @click="cancelDialog">取 消</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import QqtSelect from "../../../../components/qqt-subassembly/qqt-select/qqt-select";
    import QqtInput from "../../../../components/qqt-subassembly/qqt-input/qqt-input";
    import util from '@/libs/util'
    import QqtP from "../../../../components/qqt-subassembly/qqt-p/qqt-p";

    import { getAllBasis } from '../../../../api/system/fromManagement'
    export default {
        name: "from-create",
        components: {QqtP, QqtSelect, QqtInput},
        props: {
            data: Object,
            formTitle: String,
            isDetail: {
                type: Boolean,
                default: false
            },
            choseId: {
                type: String,
                default: () => {
                    return ''
                }
            },
            createForm: {
                type: Boolean,
                default: false
            },
            treeData: {
                type: Array,
                default: () => []
            }
        },

        data () {
            return {
                addFormData: {
                    name: '',
                    code: '',
                    title: '',
                    openType: '1',
                    dicId: '',
                    isBasics: '0',
                    isFlow: '1',
                    parentId: ''
                },
                options: [
                ],
                workflow: [
                    {
                        id: '1',
                        name: '是'
                    },
                    {
                        id: '0',
                        name: '否'
                    }
                ],
                formType: '',
                basicsName: '',
                basicsList: [],
                rules: {
                    name: [
                        { required: true, message: '请输入表单名称', trigger: 'blur' }
                    ],
                    code: [
                        { required: true, message: '请输入表单编码', trigger: 'blur' }
                    ],
                    dic_id: [
                        { required: true, message: '请选择表单分类', trigger: 'change' }
                    ],
                    parentId: [
                        { required: true, message: '请选择基础表单', trigger: 'change' }
                    ],
                    title: [
                        { required: true, message: '请输入表单标题', trigger: 'blur' }
                    ]
                }
            }
        },

        methods : {
            con () {
                // console.log(this.addFormData.openType)
            },
            getForm () {
                return this.addFormData
            },

            cancelDialog () {
                this.$emit ('cancel')
            },
            handleClose (done) {
                this.$emit ('cancel')
                done()
            },
            closeDialog () {
                this.$refs.form.validate ((valid) => {
                    if (valid) {
                        this.$emit ('close', this.addFormData)
                    }
                })
            },
            getType () {
                if(this.isDetail){
                    this.treeData.forEach(item => {
                        if(this.addFormData.dicId === item.id){
                            this.formType = item.name
                        }
                    })
                    let item = this.basicsList.find (f => f.id === this.addFormData.parentId)
                    if (item) {
                        this.basicsName = item.name
                    }
                }
            },

            basicsForm () {
                getAllBasis ().then (res => {
                    if (res && res.length > 0) {
                        this.basicsList = res
                        this.getType()
                    }
                })
            }
        },
        mounted () {
            if (this.data.id) {
                this.addFormData = this.data
            }
            this.getType()
            this.addFormData.dicId = this.choseId
            this.basicsForm ()
        },
        watch: {
            data (newVal, old) {
                this.addFormData = newVal
                this.getType()
                this.addFormData.dicId = this.choseId
            },
            choseId (newVal, old) {
                this.addFormData.dicId = newVal
            }
        }
    }
</script>

<style lang="scss" scoped>
.el-dialog__footer{
    padding-bottom: 25px;
    padding-right: calc(4.16667% + 40px);
}
</style>
