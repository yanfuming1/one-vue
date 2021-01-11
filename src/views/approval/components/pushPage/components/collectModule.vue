<template>
    <div>
        <el-form :model="formInline" ref="formInline" :rules="rules" :size="getSize" label-width="100px" class="formAddClass">
            <el-row>
                <el-col :span="8">
                    <el-form-item :label="`${name}:`" prop="name">
                        <el-select :size="getSize"  allow-create filterable default-first-option v-model="formInline.name" @visible-change="openSelect"  :class="{'isShowDetails':isShowDetails}" :disabled="isShowDetails"  style="width:100%"  @change="selectChange(formInline.name)">
                            <el-option
                            v-for="item in getbankAccounts"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="开户行:" prop="openingBank">
                        <el-input v-model="formInline.openingBank" :class="{'isShowDetails':isShowDetails}" :disabled="isShowDetails" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="账号:" prop="account">
                        <el-input v-model="formInline.account" :class="{'isShowDetails':isShowDetails}" :disabled="isShowDetails" onkeyup="this.value= this.value.match(/[\d-]*/) ? this.value.match(/[\d-]*/) : ''">
                            <el-button type="primary" slot="append" @click="accountFun" v-if="!isShowDetails">
                                收藏
                            </el-button>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <bank-dialog :bankTypeShow="bankTypeShow" @bankDialogClose="bankDialogClose" :parentList="parentList" :formData="bankSelectForm"></bank-dialog>
    </div>
</template>

<script>
    import bankDialog from './bankDialog';
    import {queryByParentId,queryByAccount} from "../../../../../api/financialManagement/staffLoan";
    export default {
        components: {
            bankDialog,
        },
        props: {
            isShowDetails: {
                default:false,
                type: Boolean,
            },
            name: {
                type: String,
                default: '户名'
            },
            selectData: {
                type: Array,
                default: ()=>{
                    return  []
                }
            },
            data: {
                type: Object,
                default: ()=>{
                    return  {}
                }
            },
            getSize: {
                type: String,
                default: () => {
                    return 'small'
                }
            }
        },
        data() {
            return {
                bankTypeShow:false,
                parentList:[],
                getbankAccounts: [],
                formInline: {
                    name: '',
                    openingBank: '',
                    account: '',
                },
                rules: {
                    name:{ 
                        required:true,
                        message:"请输入户名",
                        trigger: ["blur","change"]
                    },
                    openingBank:{ 
                        required:true,
                        message:"请输入开户行",
                        trigger: ["blur","change"]
                    },
                    account:{ 
                        required:true,
                        message:"请输入账号",
                        trigger: ["blur","change"]
                    },
                },
                bankSelectForm: {
                    name:'',
                    openingBank:'',
                    account:'',
                }
            }
        },
        methods: {
            accountFun() {
                if (this.formInline.name && this.formInline.openingBank && this.formInline.account) {
                    this.gtAccount(this.formInline.account).then(res => {
                        if (res) {
                            queryByParentId().then(data=> {
                                this.parentList = data;
                                if (data.length > 0) {
                                let data = this.selectData.find(element => element.id === this.formInline.name);
                                this.bankSelectForm.name = data ? data.name : this.formInline.name;
                                this.bankSelectForm.openingBank = this.formInline.openingBank;
                                this.bankSelectForm.account = this.formInline.account;
                                this.bankTypeShow = true;
                                } else {
                                this.$message.error('请先维护银行账户类型')
                                }
                            })
                        }
                    })
                } else {
                    this.$message.error('账户信息未补充完整')
                }
            },
            gtAccount (params) {
                return new Promise((resolve, reject) => {
                    queryByAccount ({'account':params}).then(res => {
                        if (res.success) {
                            resolve (true)
                        } else {
                            this.$message.error(res.message)
                            resolve (false)
                        }
                    })
                })
            },
            openSelect (flag) {
                if (flag) {
                    this.$emit('selectChange')
                } 
            },
            selectChange (val) {
                let selectRow = this.getbankAccounts.find(item => item.id === val);
                if (selectRow) {
                    this.formInline.openingBank = selectRow.openingBank;
                    this.formInline.account = selectRow.account;
                } else {
                    this.formInline.openingBank = '';
                    this.formInline.account = '';
                }
            },
            bankDialogClose () {
                this.bankTypeShow = false;
            },
            getData(){  //保存
              return new Promise((resolve, reject) => {
                 this.$refs.formInline.validate(valid => {
                      if (valid) {
                        let jsonData = JSON.parse(JSON.stringify(this.formInline))
                            let data = this.selectData.find(element => element.id === jsonData.name);
                            jsonData.name = data ? data.name : jsonData.name;
                        resolve(jsonData)
                      } else {
                          reject(new Error('表单数据校验失败').message)
                      }
                  })
              })
          },
        },
        watch: {
            selectData:{
                immediate:true,
                handler (value) {
                    this.getbankAccounts = value;
                }
            },
            data: {
                immediate:true,
                deep:true,
                handler (value) {
                    this.formInline.name = value.name;
                    this.formInline.openingBank = value.openingBank;
                    this.formInline.account = value.account;
                }
            }
        },
    }
</script>

<style lang="scss">
.formAddClass{
    .el-form-item--small.el-form-item{
        margin-bottom: 0
    }
}
</style>