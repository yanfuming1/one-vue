<template>
    <el-dialog
      v-dialogDrag
      title="请选择银行账户类型"
      :visible.sync="show"
      width="30%"
      @close="show = false">
      <el-form :model="bankSelectForm" ref="bankSelectForm" label-width="130px">
        <el-form-item label="银行账户类型" prop="accountname"  :rules="[
          { required: true, message: '请输入银行账户类型', trigger: ['blur','change'] },
          ]">
          <el-select v-model="bankSelectForm.accountname" placeholder="请选择" filterable>
            <el-option v-for="item in listData"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      
      <span slot="footer">
        <el-button type="primary" @click="bankSelectOK">确 定</el-button>
        <el-button @click="cancelFun">取 消</el-button>
      </span>
    </el-dialog>
</template>

<script>
    import {queryByParentId,queryByAccount,collection} from "../../../../../api/financialManagement/staffLoan";

    export default {
        props: {
            bankTypeShow: {
                type: Boolean,
                default: () => {
                    return false;
                }
            },
            parentList: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            formData: {
                type: Object,
                default: () => {
                    return {};
                }
            },
        
        },
        data() {
            return {
                listData: [],
                bankSelectForm: {
                    accountname:'',
                    name: '',
                    openingBank: '',
                    account: ''
                },
                show: false
            }
        },
        methods: {
            bankSelectOK() {
                this.$refs.bankSelectForm.validate((valid) => {
                    if (valid) {
                        collection(this.bankSelectForm).then(res => {
                            this.$message.success('账户收藏成功');
                            this.show = false;
                            this.$emit('bankDialogClose')
                        })
                    }
                });
            },
            cancelFun () {
                this.show = false;
                this.$emit('bankDialogClose')
            }
        },
        watch: {
            bankTypeShow:{
                immediate: true,
                handler (newValue) {
                    this.show = newValue;
                    this.bankSelectForm = {...this.formData};
                }
            },
            parentList:{
                immediate: true,
                handler (newValue) {
                    this.listData = newValue;
                }
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>