<template>
  <div class="bankModelBox">
    <el-form :model="bankForm.data" :rules="bankForm.rules" ref="form" label-width="0px">
      <el-row>
        <el-col :span="6" :offset="2" class="leftBox">
          <h2>系统默认表头名称</h2>
          <div>收款账户</div>
          <div>收款开户行</div>
          <div>收款账号</div>
          <div>收到金额</div>
          <div>收到时间</div>
          <div>收款方式</div>
          <div>付款户名</div>
          <div>付款开户行</div>
          <div>付款账号</div>
          <div>付款留言</div>
        </el-col>
        <el-col :span="2" class="centerBox">
            <div>
              <i class="fa fa-exchange" aria-hidden="true"></i>
            </div>
        </el-col>
        <el-col :span="6" class="rightBox">
          <h2>对应银行表头管理</h2>
          <div class="rightBorder">    
            <el-form-item prop="recaccount">
              <el-input v-model="bankForm.data.recaccount" placeholder="请输入收款账户"></el-input>
            </el-form-item>
          </div>
          <div class="rightBorder">
            <el-form-item prop="recbank">
              <el-input v-model="bankForm.data.recbank" placeholder="请输入收款开户行"></el-input>
            </el-form-item>
          </div>
          <div class="rightBorder">
            <el-form-item prop="recnum">
              <el-input v-model="bankForm.data.recnum" placeholder="请输入收款账号"></el-input>
            </el-form-item>
          </div>
          <div class="rightBorder">
            <el-form-item prop="recamount">
              <el-input v-model="bankForm.data.recamount" placeholder="请输入收到金额"></el-input>
            </el-form-item>
          </div>
          <div class="rightBorder">
            <el-form-item prop="rectime">
              <el-input v-model="bankForm.data.rectime" placeholder="请输入收到时间"></el-input>
            </el-form-item>
          </div>
          <div class="rightBorder">
            <el-form-item prop="recway">
              <el-input v-model="bankForm.data.recway" placeholder="请输入收款方式"></el-input>
            </el-form-item>
          </div>
          <div class="rightBorder">
            <el-form-item prop="payaccount">
              <el-input v-model="bankForm.data.payaccount" placeholder="请输入付款户名"></el-input>
            </el-form-item>
          </div>
          <div class="rightBorder">
            <el-form-item prop="paybank">
              <el-input v-model="bankForm.data.paybank" placeholder="请输入付款开户行"></el-input>
            </el-form-item>
          </div>
          <div class="rightBorder">
            <el-form-item prop="paynum">
              <el-input v-model="bankForm.data.paynum" placeholder="请输入付款账号"></el-input>
            </el-form-item>
          </div>
          <div class="rightBorder">
            <el-form-item prop="paymessage">
              <el-input v-model="bankForm.data.paymessage" placeholder="请输入付款留言"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-top:50px">
        <el-col class="d2-text-center" :span="14" :offset="2">
          <el-button  size="mini" type="primary" @click="saveFun">保存</el-button>
          <el-button  size="mini"  plain @click="cancelFun">取消</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import util from '@/libs/util';
  export default {
    props: {
      bankData: {
        type: Object,
        default: () =>{
          return {};
        }
      },
    },
    data() {
      return {
        bankForm: {
          data: {
              recaccount:'',
              recbank:'',
              recnum:'',
              recamount:'',
              rectime:'',
              recway:'',
              payaccount:'',
              paybank:'',
              paynum:'',
              paymessage:'',
          },
          rules: {
              // recaccount: [
              //    { required: true, message: '请选择收款账户', trigger: ['change','blur'] }
              // ],
              // recbank: [
              //    { required: true, message: '请选择收款开户行', trigger: ['change','blur'] }
              // ],
              // recnum: [
              //    { required: true, message: '请选择收款账号', trigger: ['change','blur'] }
              // ],
              recamount: [
                 { required: true, message: '请选择收到金额', trigger: ['change','blur'] }
              ],
              rectime: [
                 { required: true, message: '请选择收到时间', trigger: ['change','blur'] }
              ],
              // recway: [
              //    { required: true, message: '请选择收款方式', trigger: ['change','blur'] }
              // ],
              // payaccount: [
              //    { required: true, message: '请选择付款户名', trigger: ['change','blur'] }
              // ],
              // paybank: [
              //    { required: true, message: '请选择付款开户行', trigger: ['change','blur'] }
              // ],
              // paynum: [
              //    { required: true, message: '请选择付款账号', trigger: ['change','blur'] }
              // ],
              // paymessage: [
              //    { required: true, message: '请选择付款留言', trigger: ['change','blur'] }
              // ],
          }
        }
      }
    },
    methods: {
      saveFun() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$emit('saveData',this.bankForm.data)
          } else {
            this.$message.error('请把导入文件表头名称填写完整!!');
            return false;
          }
        });
      },
      cancelFun () {
        this.$router.go(-1);
      }
    },
    watch: {
      bankData(newValue, oldValue) {
        this.$refs.form.resetFields();
        util.setObjval(this.bankForm.data,newValue);
      }
    },
  }
</script>

<style lang="scss" scoped>
.bankModelBox{
  h2 {
    text-align:center;
    margin-bottom:20px;
    height: 30px;
  }
  .leftBox{
    div{
      height: 42px;
      line-height: 42px;
      font-size: 16px;
      text-align: center;
      border-left: 1px solid #333;
      border-right: 1px solid #333;
      border-top: 1px solid #333;
      &:last-child {
        border-bottom: 1px solid #333;
      }
    }
  }
  .rightBox{
    .rightBorder{
      height: 42px;
      line-height: 42px;
      font-size: 16px;
      text-align: center;
      border-left: 1px solid #333;
      border-right: 1px solid #333;
      border-top: 1px solid #333;
      &:last-child {
        border-bottom: 1px solid #333;
      }
    }
  }
  .centerBox {
    text-align: center;
    padding-top: 60px;
    height: 410px;
    line-height: 410px;
    font-size: 30px;
  }
}
</style>
<style lang="scss">
.bankModelBox{
  .rightBox {
    .el-form-item{
      margin-bottom: 0px;
    }
    .el-input__inner{
      border:0;
      border-radius: 0;
      color: #000;
    }
    .el-form-item__error {
      z-index: 999;
      top: 25px;
      left: 15px;
    }
  }
}
</style>