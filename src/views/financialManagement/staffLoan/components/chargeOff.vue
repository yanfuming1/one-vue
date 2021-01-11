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
        class="d2-mt-20"
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
  import { queryById,getVerificationAdd,getSelfVerificationAdd} from '../../../../api/financialManagement/staffLoan';
  import { formGetJson } from '../../../../api/system/fromManagement/index'
  import util from '@/libs/util.js'
  import { mapState } from 'vuex'
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
    },
    data() {
      return {
        jsonData: {},
        values: {
          verificationmoney:'',
          daxieverification:'',
          ownmoney:'',
          verificationstate:'',
          owinglower:'',
          verpercentage:'',
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
          // data.id = this.modelData.id;
          let jsonData = JSON.parse(JSON.stringify(this.modelData));
          jsonData.employeeVerification = data;
            if ( this.identification === '1' ) {
                getSelfVerificationAdd (jsonData,this.selfSupportProject.projectCode).then(res => {
                this.$emit('successFun',res);
                }).catch(err => {
                console.log(err);
                });
            }  else {
                getVerificationAdd (jsonData).then(res => {
                this.$emit('successFun',res);
                }).catch(err => {
                console.log(err);
                });
            }
        })  
      },
   
      onChange (name,val,datas) {
        if (name==='verificationmoney') {
          // 判断核销金额最大值
          if (val > this.modelData.borrowmon) {
            this.values.verificationmoney = (this.modelData.borrowmon-0).toFixed(0) - 0;
          } else {
            this.values.verificationmoney = val;
          }
          this.values.verpercentage = ((val * 10000 / this.modelData.borrowmoney * 10000) / 1000000).toFixed(2) ;
          this.values.daxieverification = util.convertCurrency(val);
          this.values.ownmoney = (this.modelData.borrowmon * 10000 - val * 10000) / 10000 ;
          if (this.values.borrowmon === 0) {
             this.values.verificationstate = '已核销'
          } else {
             this.values.verificationstate = '部分核销'
          }
        }
        if (name==='ownmoney') {
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
          code: 'staffLoanDraw'
      }).then(res => {
          this.jsonData = JSON.parse(res);
        
      }).catch(res => {
          console.log(res)
      }).finally(res=> {
       
      })
    },
    created () {
        this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad')
        this.init()

    },

    computed: {
        ...mapState ('d2admin/selfSupportProject', [
            'selfSupportProject'
        ])
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