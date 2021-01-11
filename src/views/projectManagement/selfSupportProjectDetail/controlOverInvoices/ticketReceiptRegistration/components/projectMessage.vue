<template>
    <div>
        <el-divider class="divider-title" content-position="left"><div class="generate-from-divider___line"></div> 关联信息</el-divider>
        <el-form ref="form" :model="form" label-width="100px">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="项目类型">
                        <el-select style="width:100%"  size="medium" v-model="form.projectType" @change="selectChange($event,'项目类型')"  placeholder="请选择项目类型">
                            <el-option label="自营项目" value="1"></el-option>
                            <el-option label="联营项目" value="2"></el-option>
                            <el-option label="其他" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="项目名称">
                        <el-select style="width:100%"  filterable size="medium" clearable @clear="clearable('项目名称')" v-model="form.projectId"  @change="selectChange($event,'项目名称')"   placeholder="请选择项目名称">
                            <el-option
                                v-for="item in getProjectList"
                                :key="item.projectCode"
                                :label="item.projectName"
                                :value="item.projectId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="项目编码">
                        <el-input size="medium" placeholder="自动生成" v-model="form.projectCode" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="关联合同">
                        <el-select style="width:100%" size="medium" v-model="form.invoiceSource" disabled placeholder="请选择关联合同">
                            <el-option label="收入合同" value="1"></el-option>
                            <el-option label="支出合同" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="合同名称">
                         <el-select style="width:100%" size="medium" clearable @clear="clearable('合同名称')" v-model="form.contractId"  @change="selectChange($event,'合同名称')"   placeholder="请选择合同名称">
                            <el-option
                                v-for="item in bindingRequiredList"
                                :key="item.id"
                                :label="item.contractname"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="合同编码">
                        <el-input size="medium" placeholder="自动生成" v-model="form.contractCode" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
       
    </div>
</template>

<script>
    import {getSelfUnifyProjectAll, getJoinUnifyProjectAll,queryByEnd} from '@/api/selfProject/controlOverInvoices/ticketReceiptRegistration'
    export default {
        props: {
            projectData: {
                type: Object,
                default: ()=>{
                    return {}
                }
            },
            disabled: {
                type: Boolean,
                default: ()=>{
                    return false
                }
            },
        },
        data () {
            return {
                form: {
                    projectType: '1',
                    projectId: '',
                    projectCode: '',
                    projectName: '',
                    invoiceSource: '1',
                    contractId:'',
                    contractCode:'',
                    contractName:'',
                },
                getProjectList:[],
                bindingRequiredList:[],
            }
        },
        methods:{
            getData () {
                return this.form;
            },
            clearable  (type) {
                if (type === '项目名称') {
                    this.form.projectId = '';
                    this.form.projectCode = '';
                    this.form.projectName = '';
                } else {
                    this.form.contractId ='';
                    this.form.contractCode ='';
                    this.form.contractName ='';
                }
            },
            selectChange (value, type) {
                switch (type) {
                    case '项目名称':
                        let selectRow = this.getProjectList.find(res=> res.projectId === value)
                        if (selectRow) {
                            this.form.projectId = selectRow.projectId;
                            this.form.projectCode = selectRow.projectCode;
                            this.form.projectName = selectRow.projectName;
                            this.form.contractId ='';
                            this.form.contractCode ='';
                            this.form.contractName ='';
                        }
                        this.getContractList(this.form.projectType, this.form.projectCode, this.form.invoiceSource)
                        break;
                    case '合同名称':
                        let contractData = this.bindingRequiredList.find(res=> res.id === value)
                        if (contractData) {
                            this.form.contractId =contractData.id;
                            this.form.contractCode = contractData.contractcode;
                            this.form.contractName = contractData.contractname;
                        }
                        this.getContractList(this.form.projectType, this.form.projectCode, this.form.invoiceSource)
                        break;
                    case '项目类型':
                        this.getProjectList = [];
                        if (value == '1') {
                            this.getAllSelfProjectData();
                        } else if (value == '2') {
                            this.getAllJointProjectData();
                        } else {
                            this.getProjectList = [];
                        }
                        this.clearForm();
                        break;
                    default:
                        break;
                }
            },
            getAllSelfProjectData () {
                getSelfUnifyProjectAll ().then(res=> {
                    this.getProjectList = res;
                }).finally(res => {
                })
            },
            getAllJointProjectData () {
               getJoinUnifyProjectAll ().then(res=> {
                    this.getProjectList = res;
                }).finally(res => {
                })
            },
            getContractList (projectType, projectCode, invoiceSource, boolean = false) {
                let text = invoiceSource == 1 ? '收入合同' :'支出合同'
                queryByEnd ({projectType, projectCode, invoiceSource: text}).then(res=> {
                    this.bindingRequiredList = res
                    if (boolean && this.form.contractId) this.selectChange (this.form.contractId, '合同名称')
                }).finally(res=>{
                })
            },
            clearForm() {
                this.form.projectId = '';
                this.form.projectCode = '';
                this.form.projectName = '';
                this.form.contractId ='';
                this.form.contractCode ='';
                this.form.contractName ='';
            },
        },
        watch: {
            projectData: {
                deep:true,
                immediate:true,
                handler (value) {
                    this.form = {...this.form, ...value}
                    if (value.projectType && value.projectCode && value.invoiceSource) {
                        this.getContractList (value.projectType, value.projectCode, value.invoiceSource, true)
                    }
                    if (value.projectType == '1') {
                        this.getAllSelfProjectData();
                    } else if (value.projectType == '2') {
                        this.getAllJointProjectData();
                    } else {
                        this.getProjectList = [];
                    }
                }
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>