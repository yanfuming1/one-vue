<template>
  <d2-container class="fina_applica">
      <el-card class="box-card">
        <title-line >详情信息</title-line>
        <el-form label-width="120px" :model="addModel" :rules="rules">
          <el-row>
            <el-col :span="8">
              <el-form-item label="保证金编号" prop="marginCode">
                <el-input v-model="addModel.marginCode" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="项目名称" prop="projectName">
                <el-input v-model="addModel.projectName" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="招标编号" prop="type">
                <el-input v-model="addModel.type" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="保证金金额" prop="premiumReceived">
                <el-input v-model="addModel.premiumReceived" type="number">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="大写" prop="amountInWords">
                <el-input v-model="addModel.amountInWords"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="保证金类型" prop="marginType">
                <el-select v-model="addModel.marginType" style="width: 100%;" placeholder="请选择保证金类型">
                    <el-option label="投标保证金" value="投标保证金" />
                    <el-option label="履约保证金" value="履约保证金" />
                    <el-option label="政府押金" value="政府押金" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="要求支付时间" prop="premiumReceived">
                <el-date-picker
                  v-model="addModel.premiumReceived"
                  type="datetime"
                  placeholder="选择支付时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="预计退还时间" prop="amountInWords">
                <el-input v-model="addModel.amountInWords"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="经办人" prop="marginType">
                <el-select v-model="addModel.marginType" style="width: 100%;" placeholder="请选择经办人">
                    <el-option label="投标保证金" value="投标保证金" />
                    <el-option label="履约保证金" value="履约保证金" />
                    <el-option label="政府押金" value="政府押金" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="经办部门" prop="marginType">
                <el-select v-model="addModel.marginType" style="width: 100%;" placeholder="请选择经办部门">
                    <el-option label="投标保证金" value="投标保证金" />
                    <el-option label="履约保证金" value="履约保证金" />
                    <el-option label="政府押金" value="政府押金" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="收款单位" prop="collectUnitAccount">
                <el-input v-model="addModel.collectUnitAccount"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="单位开户名称" prop="marginCode">
                <el-input v-model="addModel.marginCode" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="单位开户银行" prop="projectName">
                <el-input v-model="addModel.projectName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="银行账号" prop="projectName">
                <el-input v-model="addModel.projectName" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="单位联系人" prop="marginCode">
                <el-input v-model="addModel.marginCode" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="手机号" prop="projectName">
                <el-input v-model="addModel.projectName" disabled></el-input>
              </el-form-item>
            </el-col>
            
          </el-row>
        </el-form>
        <el-row>
          <el-col :span="24" style="text-align:center">
              <el-button size="small" type="warning" @click="saveBtn">保存</el-button>
              <el-button size="small" type="primary" @click="submitBtn">提交</el-button>
              <el-button size="small" type="primary" plain @click="cancelBtn">取消</el-button>
          </el-col>
        </el-row>
      </el-card>
  </d2-container>
</template>

<script>
  import titleLine from '../../component/titleLine/titleLine';
  import util from '@/libs/util.js'
  export default {
    name:'marginApplicationAdd',
    components: {
      titleLine,
    },
    // props: {
    //  modelData
    // },
    props: {
      modelData: {
        type: Object,
      },
    },
    data() {
      return {
        addModel: {
          marginCode:'',
          projectName:'',
          premiumReceived:'',
          marginType:'',
          collectUnitAccount:'',
        },
        rules: {
          marginCode: [
            { required: true, message: '请输入保证金编号', trigger: ['change','blur'] }
          ], 
          projectName: [
            { required: true, message: '请输入项目名称', trigger: ['change','blur'] }
          ],
          premiumReceived: [
            { required: true, message: '请输入保证金金额', trigger: ['change','blur'] }
          ],
          marginType: [
            { required: true, message: '请输入保证金类型', trigger: ['change','blur'] }
          ],
          collectUnitAccount: [
            { required: true, message: '请输入收款单位', trigger: ['change','blur'] }
          ],
        }
      }
    },
    methods: {
      // 保存
      saveBtn () {

      },
      // 提交
      submitBtn () {

      },
      // 取消
      cancelBtn () {
        this.$emit('cancelBtn');
      },
    },
    mounted () {
      util.setObjval(this.addModel,this.modelData)
    },
  }
</script>

<style >
  .fina_applica input::-webkit-outer-spin-button,
  .fina_applica input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  .fina_applica input[type="number"]{
    -moz-appearance: textfield;
  }
</style>