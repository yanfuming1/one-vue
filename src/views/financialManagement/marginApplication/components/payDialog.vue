<template>
  <d2-container class="pay_Dialog">
    <el-card class="box-card">
        <fm-generate-form
          class="addForm"
          :data="jsonData"
          :value="values"
          ref="generateForm"></fm-generate-form>
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
  import { formGetJson } from '../../../../api/system/fromManagement/index'
  // import { getExternalLloanAdd} from '../../../../api/financialManagement/externalLloan';
  import util from '@/libs/util.js'
  export default {
    name:'payDialog',
    components: {
     
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
        jsonData: {},
        values: {},
        isShowElement:true,
        addModel: {
         
        },
      }
    },
    methods: {
      // 保存
      saveBtn () {
        // this.isShowElement = !this.isShowElement;
        this.$refs.generateForm.getData().then(data => {
          
        }).catch(e => {
            console.log(e)
        })
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
      formGetJson({
          code: 'marginApplicationPay'
      }).then(res => {
          this.jsonData = JSON.parse(res)
          console.log(this.jsonData)
      }).catch(res => {
          console.log(res)
      })
    },
  }
</script>

<style lang='scss'>
  .pay_Dialog input::-webkit-outer-spin-button,
  .pay_Dialog input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  .pay_Dialog input[type="number"]{
    -moz-appearance: textfield;
  }
  .pay_Dialog{
    .el-divider__text {
      color: rgb(109,146,233);
      font-weight: 700;
    }
  }
</style>