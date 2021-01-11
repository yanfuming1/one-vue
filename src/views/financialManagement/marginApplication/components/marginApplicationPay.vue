<template>
  <d2-container class="fina_applica">
      <el-card class="box-card">
        <title-line >详情信息</title-line>
        <el-form label-width="120px" :model="addModel" :rules="rules">
          <el-row>
            <el-col :span="16">
              <el-form-item label="项目名称:" prop="projectName">
                <qqt-input v-model="addModel.projectName" :isShowElement="isShowElement"></qqt-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目编码:" prop="itemNumber">
                <qqt-input v-model="addModel.itemNumber" :isShowElement="isShowElement"></qqt-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="标段:" prop="section">
                <qqt-input v-model="addModel.section" :isShowElement="isShowElement"></qqt-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="保证金类型:" prop="marginType">
                  <qqt-select :value="addModel.marginType" :placeholder="'请选择保证金类型'" :isShowElement="isShowElement" :options="typeList"></qqt-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="保证金编码:" prop="marginCode">
                <qqt-input v-model="addModel.marginCode" :isShowElement="isShowElement"></qqt-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="项目可用资金:" prop="section">
                <qqt-input-number v-model="addModel.section" :isShowElement="isShowElement"></qqt-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="资金来源:" prop="capitalSource">
                <qqt-input v-model="addModel.capitalSource" :isShowElement="isShowElement"></qqt-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="联营人:" prop="associatedPerson">
                <qqt-input v-model="addModel.associatedPerson" :isShowElement="isShowElement"></qqt-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系电话:" prop="phone">
                <qqt-input v-model="addModel.phone" :isShowElement="isShowElement"></qqt-input>
              </el-form-item>
            </el-col>
          </el-row>
          <title-line >保证金收取单位及缴纳信息</title-line>
          <el-row>
            <el-col :span="8">
              <el-form-item label="收取单位户名:" prop="collectUnitAccount">
                <qqt-input v-model="addModel.collectUnitAccount" :isShowElement="isShowElement"></qqt-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="开户行:" prop="openingBank">
                <qqt-input v-model="addModel.openingBank" :isShowElement="isShowElement"></qqt-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="账号:" prop="accountNumber">
                <qqt-input v-model="addModel.accountNumber" :isShowElement="isShowElement"></qqt-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="行号:" prop="lineNumber">
                <qqt-input v-model="addModel.lineNumber" :isShowElement="isShowElement"></qqt-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="缴纳金额:" prop="premiumReceived">
                <qqt-input v-model="addModel.premiumReceived" :isShowElement="isShowElement"></qqt-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="截止时间:" prop="deadline">
                <qqt-input v-model="addModel.deadline" :isShowElement="isShowElement"></qqt-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="附言:" prop="postscript">
                <qqt-input v-model="addModel.postscript" :isShowElement="isShowElement"></qqt-input>
              </el-form-item>
            </el-col>
          </el-row>
          <title-line >公司垫付资金及利息</title-line>
          <el-row>
            <el-col :span="8">
              <el-form-item label="垫付资金:" prop="matEndowment">
                <qqt-input v-model="addModel.matEndowment" :isShowElement="isShowElement"></qqt-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="大写:" prop="amountInWords">
                <qqt-input v-model="addModel.amountInWords" :isShowElement="isShowElement"></qqt-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否计息:" prop="isRate">
                <qqt-radio :value="addModel.isRate" :options="isRateList" :isShowElement="isShowElement" @radio="addModel.isRate = $event"></qqt-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="计息方式:" prop="interestAccrualManner">
                <qqt-input v-model="addModel.interestAccrualManner" :isShowElement="isShowElement"></qqt-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="利率:" prop="interestRate">
                <qqt-input v-model="addModel.interestRate" :isShowElement="isShowElement"></qqt-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="起息日期:" prop="dateValue">
                <qqt-input v-model="addModel.dateValue" :isShowElement="isShowElement"></qqt-input>
              </el-form-item>
            </el-col>
          </el-row>
          <title-line >公司支付账户及信息</title-line>
            <el-row>
              <el-col :span="8">
                <el-form-item label="支付金额:" prop="interestAccrualManner">
                  <el-input type="number" min="0" v-model="addModel.interestAccrualManner" >
                     <template slot="append">元</template>
                  </el-input>
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
  import { qqtInput, qqtInputNumber, qqtCascader, qqtRadio, qqtSelect, qqtSwitch } from '../../../../components/qqt-subassembly'
  import util from '@/libs/util.js'
  export default {
    name:'marginApplicationPay',
    components: {
      titleLine,
      qqtInput,
      qqtInputNumber,
      qqtCascader,
      qqtRadio,
      qqtSelect,
      qqtSwitch,
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
        isShowElement:false,
        addModel: {
          id:'',
          itemNumber:'',
          projectName:'',
          premiumReceived:'',
          marginType:'',
          marginCode:'',
          capitalSource:'',
          associatedPerson:'',
          phone:'',
          collectUnitAccount: '',
          openingBank: '',
          accountNumber: '',
          lineNumber: '',
          deadline: '',
          postscript: '',
          premiumReceived: '',
          matEndowment:'',
          amountInWords:'',
          isRate:'1',
        },
        rules: {
          isRate: [
            { required: true, message: '请输入垫付资金', trigger: ['change','blur'] }
          ], 
          matEndowment: [
            { required: true, message: '请输入垫付资金', trigger: ['change','blur'] }
          ], 
          amountInWords: [
            { required: true, message: '请输入大写垫付资金', trigger: ['change','blur'] }
          ], 
          postscript: [
            { required: true, message: '请输入附言', trigger: ['change','blur'] }
          ], 
          deadline: [
            { required: true, message: '请输入截止时间', trigger: ['change','blur'] }
          ], 
          premiumReceived: [
            { required: true, message: '请输入缴纳金额', trigger: ['change','blur'] }
          ], 
          openingBank: [
            { required: true, message: '请输入开户行', trigger: ['change','blur'] }
          ], 
          accountNumber: [
            { required: true, message: '请输入账号', trigger: ['change','blur'] }
          ], 
          collectUnitAccount: [
            { required: true, message: '请输入收取单位户名', trigger: ['change','blur'] }
          ], 
          itemNumber: [
            { required: true, message: '请输入项目编码', trigger: ['change','blur'] }
          ], 
          marginCode: [
            { required: true, message: '请输入保证金编码', trigger: ['change','blur'] }
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
        },
        typeList: [
            {
                value: '1',
                label: '投标保证金'
            },
            {
                value: '2',
                label: '履约保证金'
            },
            {
                value: '3',
                label: '农民工工资'
            },
            {
                value: '4',
                label: '其他'
            },
        ],
        isRateList: [
          {
              value: '1',
              label: '是'
          },
          {
              value: '0',
              label: '否'
          },
        ]
      }
    },
    methods: {
      // 保存
      saveBtn () {
        this.isShowElement = !this.isShowElement;
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