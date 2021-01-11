<template>
  <div >
    <el-drawer
      title="核销"
      :visible="drawer"
      direction="rtl"
      :before-close="handleClose"
      class="drawerOff"
      >
      <fm-generate-form
        :data="jsonData"
        :value="values"
        @on-change="onChange"
        ref="generateForm">
      </fm-generate-form>
      <el-row>
        <el-col :span="24" style="text-align:center" class="d2-mt-15">
            <el-button size="small" type="warning" @click="saveBtn">保存</el-button>
            <el-button size="small" type="primary" plain @click="cancelBtn">取消</el-button>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
  import { getVerificationAdd, getVerificationAddNew} from '../../../../api/financialManagement/externalLloan';
  import { formGetJson } from '../../../../api/system/fromManagement/index'
  import util from '@/libs/util.js'
  export default {
    name:'chargeOff',
    components: {
    },
    props: {
      modelData: {
        type: Object,
      },
      drawer: {
          type: Boolean,
          default: false
      },
      value:{
        type: Object,
        default: () => {
          return {}
        }
      },
      identification: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        jsonData: {},
        values: {
          verificationmoney:'',
          daxieverification:'',
          owingmoney:'',
          verificationstate:'',
          owinglower:'',
        },
        data:this.modelData,
        addModel: {
         
        },
      }
    },
    methods: {
      // 保存
      saveBtn () {
        this.$refs.generateForm.getData().then(data => {
          data.id = this.modelData.id;
          let jsonData = JSON.parse(JSON.stringify(data))
          if(this.identification === '1') {
            jsonData.projectCode = this.value.projectCode
          }
          let url = this.identification === '1' ? getVerificationAddNew : getVerificationAdd
          url (jsonData).then(res => {
            this.$emit('successFun',res);
          }).catch(err => {
              console.log(err);
          });
        }).catch(e => {
        })
      },
      onChange (name,val,datas) {
        if (name==='verificationmoney') {
          if (val > this.modelData.owingmoney) {
            this.values.verificationmoney = (this.modelData.owingmoney-0).toFixed(0) - 0;
          } else {
            this.values.verificationmoney = val;
          }
          this.values.daxieverification = util.convertCurrency(val);
          this.values.owingmoney = (this.modelData.owingmoney * 10000 - val * 10000) / 10000 ;
          if (this.values.owingmoney === 0) {
             this.values.verificationstate = '已核销'
          } else {
             this.values.verificationstate = '部分核销'
          }
        }
        if (name==='owingmoney') {
          this.values.owinglower  = util.convertCurrency(val);
        }
      },
      // 提交
      submitBtn () {
      },
      // 取消
      cancelBtn () {
        this.$emit('change');
        this.values = {}
      },
      handleClose () {
        this.$emit('change');
      },
    },
    mounted () {
      formGetJson({
          code: 'externalLloanDrawer'
      }).then(res => {
          this.jsonData = JSON.parse(res);
      }).catch(res => {
          console.log(res)
      }).finally(res=> {
       
      })
    },
  }
</script>

<style lang='scss' >
  .drawerOff input::-webkit-outer-spin-button,
  .drawerOff input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  .drawerOff input[type="number"]{
    -moz-appearance: textfield;
  }
  .drawerOff .el-input.is-disabled .el-input__inner{
    color: #000;
  }
</style>