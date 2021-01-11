<template>
  <div class="bgcBox">
      <div class="verify-box" >
          <div class="head">
              <el-row>
                <el-col :span="12"><h3>{{title}}</h3></el-col>
                <el-col :span="12" style="text-align:right">
                  <i class="el-icon-close" @click="closeFun" style="font-size:18px"></i>
                </el-col>
              </el-row>
          </div>
          <div class="bodyBox">
              <div class="moneyBox">
                  <div class="varifyMoney">【申请金额：{{(Number(varifyMoney)).toFixed(2)}}元】</div>
                  <div class="varifyMoney" style="color:#3E5EEB"> 金额大于{{compareMoneyShow}}元,需校验!</div>
              </div>
              <el-row>
                <el-col :span="16">
                    <el-input class="codeNum" placeholder="短信验证码" v-model="codeNum">
                    </el-input>
                </el-col>
                  <el-col :span="8">
                    <el-button  @click="verificationCodeEven" style="width:100%;height: 40px" plain :disabled="disabled=!show">
                        <span v-show="show"  >获取验证码</span>
                        <span v-show="!show" class="count">{{count}} </span>
                    </el-button>
                  </el-col>
              </el-row>
              <h4 class="d2-text-center h4">验证码发送到 {{phone}}</h4>
              <el-button class="confirm" @click="confirm">确定</el-button>
          </div>
      </div>
  </div>
</template>
<script>
  import {InputNumber} from 'iview'
  import {sendNoteMessage, verification} from '../../api/verifyCode'
  import util from '@/libs/util.js';
  const TIME_COUNT = 60 // 倒计时的时间
  export default {
    components: {
      InputNumber,
    },
    props: {
      money: {
        type: [String, Number],
        default: 0
      },
      compareMoney: {
        type: String,
        default: ''
      },
      moduleData: {
        type: String,
        default: ''
      },
    },
    data() {
      return {
        varifyMoney: 0,
        title: '安全验证',
        compareMoneyShow: 0,
        codeNum: null,
        show: true,  // 初始启用按钮F
        count: '',   // 初始化次数
        timer: null,
        phone: '',
        module: '',
        code: ''
      }
    },
    methods: {
      verificationCodeEven (rule, value, callback) {

          if ( this.phone === '') {
                this.$message.warning('请确认手机号信息')
              return
          } else {
              this.show =false;
              let jsonData = {
                  module: this.module,
                  money: this.varifyMoney
              };
              // 获取验证码
              sendNoteMessage(jsonData).then(res =>{
                  if("验证码推送成功,5分钟内有效!请注意查收" ===res.message ){
                      if (!this.timer) {
                          this.count = TIME_COUNT;
                          this.timer = setInterval(() => {
                              if (this.count > 0 && this.count <= TIME_COUNT) {
                                  this.count--;
                              } else {
                                  this.show = true;
                                  clearInterval(this.timer);  // 清除定时器
                                  this.timer = null;
                              }
                          }, 1000)
                      }
                      this.$message.success(res.message);
                  }else {
                      this.show = true;
                      this.$message.error(res.message);
                  }




              })

          }

      },
      closeFun () {
        this.$emit('verifyClose')
      },
      confirm () {
        if (this.codeNum) {
           let jsonData = {
            code: this.codeNum
          }
          verification(jsonData).then(res =>{
            if (res.success) {
              this.$emit('verifySuccess')
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          this.$message.error('请输入验证码')
        }

      }
    },
    watch: {
      money:{
        immediate: true,
        handler(value) {
          this.varifyMoney = value;
        }
      },
      compareMoney:{
        immediate: true,
        handler(value) {
          this.compareMoneyShow = value;
        }
      },
      moduleData:{
        immediate: true,
        handler(value) {
          this.module = value;
        }
      },
    },
    mounted () {
      let phone = util.cookies.get('phone')
      if (phone) {
        this.phone = util.replaceAccount(phone,phone.length-8,phone.length-4,'****');
      }

    },
  }
</script>
<style lang="scss">
  .verify-box{
    .codeNum{
      input{
        border: 0px;
        border-radius: 0;
        border-bottom: 1px solid #C9C9C9;
      }
    }
  }
</style>
<style lang="scss" scoped>
.bgcBox{
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: rgb(0, 0, 0, 0.3);
  z-index: 999
}
.verify-box {
    position: fixed;
    width: 370px;
    height: 350px;
    left: calc(50% - 185px);
    top: calc(50% - 185px);
    box-shadow: 1px 1px 11px #bfbfbf;
    border-radius:5px;
    background: #ffffff;
    z-index: 9102;
    .head {
        padding: 0 10px;
        // background: #3D5EEB;
        background-image: linear-gradient(to right, #3E5EEB , #13A5E9);
        height: 45px;
        line-height: 45px;
        border-bottom: 1px solid #e4e4e4;
        color: #ffffff;
    }
    .bodyBox{
      padding: 20px;
      .confirm{
        background-image: linear-gradient(to right, #3E5EEB , #13A5E9);
        width: 100%;
        color: #ffffff;
        margin-top: 20px;
      }

    }
    .h4{
      margin-top: 15px;
      color: #999999;
    }
    .moneyBox{
      margin: 15px 0 25px 0;
      text-align: center;
    }
    .varifyMoney {
      font-size: 24px;
      color: #FC6E5F;
    }
}
</style>
