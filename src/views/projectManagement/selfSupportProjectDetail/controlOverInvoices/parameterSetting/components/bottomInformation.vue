<template>
    <div class="fourBox">
        <el-divider class="divider-title" content-position="left"><div class="generate-from-divider___line"></div> 登记信息</el-divider>
        <el-form :inline="true" ref="ruleForm"  label-position="right" :rules="rules" label-width="100px" :model="formInline" class="demo-form-inline">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="登记人" class="formItem">
                        <el-input disabled size="medium" v-model="formInline.createName" placeholder="登记人"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="工作单位" class="formItem" prop="companyId">
                        <el-input disabled size="medium" v-model="formInline.companyName" v-if="formInline.companyName && !edit" placeholder="工作单位"></el-input>
                        <el-select :disabled="!edit" v-else v-model="formInline.companyId" @change="selectChange($event,'company')" size="medium" style="width:100%"  placeholder="请选择工作单位">
                            <el-option
                                v-for="item in companyList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="工作部门" class="formItem" prop="departmentId">
                        <el-input disabled size="medium" v-model="formInline.departmentName" v-if="formInline.departmentName && !edit" placeholder="工作部门"></el-input>
                        <el-select v-else :disabled="!edit" v-model="formInline.departmentId" @change="selectChange($event,'department')" size="medium" style="width:100%"  placeholder="请选择工作部门">
                            <el-option
                                v-for="item in departmentList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="登记时间" class="formItem">
                        <el-input disabled size="medium" v-model="formInline.createTime" placeholder="自动生成"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
    import { getOrganizationByCompanyId, getCompanyByUserId } from '@/api/system/depart/depart'
    import util from '@/libs/util.js'
    export default {
        props: {
            values: {
                type: Object,
                default: () => ({})
            },
            edit: {
                type: Boolean,
                default: () => {
                    return false
                }
                
            },
        },
        data() {
            return {
                formInline:{
                    createBy: '',
                    createName: '',
                    createTime: '',
                    departmentId: '',
                    departmentName: '',
                    companyId: '',
                    companyName: '',
                },
                newData:{},
                companyList:[],
                departmentList:[],
                rules:{
                    companyId: [
                        { required: true, message: '请选择工作单位', trigger: ['blur','change'] },
                    ],
                    departmentId: [
                        { required: true, message: '请选择工作部门', trigger: ['blur','change'] },
                    ],
                }
            }
        },
        methods: {
            selectChange (value,type) {
                if (type === 'company') {
                    let findRow = this.companyList.find(res => res.id === value);
                    if (findRow) {
                        this.formInline.companyName = findRow.name
                    }
                    this.formInline.departmentId = '';
                    this.formInline.departmentName = '';
                    this.getDepartment(this.formInline.createBy,value)
                } else {
                    let findRow = this.departmentList.find(res => res.id === value);
                    if (findRow) {
                        this.formInline.departmentName = findRow.name
                    }
                }
            },
            getData () {
                return new Promise((resolve,reject) => {
                    this.$refs['ruleForm'].validate((valid) => {
                        if (valid) {
                            resolve(this.formInline)
                        } else {
                            reject(false)
                        }
                    });
                }) 
            },
            getCompany(id) {
                getCompanyByUserId ({'userId': id}).then((res) => {
                    this.companyList = res;
                    if (this.edit && this.companyList.length === 1) {
                        this.formInline.companyId =  this.companyList[0].id;
                        this.formInline.companyName =  this.companyList[0].name;
                        this.getDepartment(id,this.formInline.companyId)
                    } else {
                        this.getDepartment(id,this.formInline.companyId)
                    }
                   
                })
            },
            getDepartment (id,companyId) {
                getOrganizationByCompanyId ({'id': companyId, 'userId': id}).then(res=>{
                    this.departmentList = res;
                    if (this.edit && this.departmentList.length === 1) {
                        this.formInline.departmentId =  this.departmentList[0].id;
                        this.formInline.departmentName =  this.departmentList[0].name;
                    }
                })
            }
        },
        watch: {
            values:{
                deep:true,
                immediate:true,
                handler(value){
                    this.formInline =  {...value};
                    if (this.edit) {
                        if (value.createBy) {
                            this.getCompany(value.createBy)
                        } else {
                            this.formInline.createTime = new Date().format('yyyy-MM-dd hh:mm:ss')
                            this.formInline.createBy = util.cookies.get ('uuid')
                            this.formInline.createName = util.cookies.get ('username')
                            this.getCompany (util.cookies.get ('uuid'))
                        }
                    } else {
                        if (value.createBy) {
                            this.getCompany(value.createBy)
                        }
                    }
                }
            }
        },
    }
</script>

<style lang="scss" >
.fourBox{
    .formItem{
        width: 100%;
        .el-form-item__content{
            width: calc(100% - 100px);
        }
    }
}
</style>