<template>
  <div class="page-login">
    <div class="page-login--layer">
      <div class="page-login--content" flex="dir:top main:justify cross:center box:justify">
        <div class="page-login--top">
          <p class="page-login--top-logo">
            <span style="color:#4570ff;text-fill-color:#4570ff;">
              <i><img :src="logUrl" /></i>
              <span>{{ companyName }}<span style="font-family:'宋体';font-weight:bold;">OI</span>协同办公平台</span>
            </span>
          </p>
        </div>

        <div class="page-login--content-main" flex="dir:top main:center cross:center">
        <!-- <div class="page-login--content-main" > -->
          <div class="page-login--content-main-div">
          <div class="page-login--left-carousel">
            <el-carousel height="450px" indicator-position="none" :autoplay="true">
              <el-carousel-item class="item1">
                <!-- <h1 class="medium">企企通  让企业管理更轻松</h1> -->
                <el-image :src="textImage.url1"></el-image>
              </el-carousel-item>
              <el-carousel-item class="item1">
                <!-- <h3 class="medium">本地异地协同办公</h3>
                <h3 class="medium">电脑手机并行操作</h3>
                <h3 class="medium">所有工作全部留痕</h3>
                <h3 class="medium">电子签名保障效力</h3> -->
                <el-image :src="textImage.url2"></el-image>
              </el-carousel-item>
              <el-carousel-item class="item1">
                <!-- <h2 class="medium">功能通用强大</h2>
                <h2 class="medium">操作灵活方便</h2>
                <h2 class="medium">流程简洁清晰</h2> -->
                <el-image :src="textImage.url3"></el-image>
              </el-carousel-item>
              <el-carousel-item class="item1">
                <!-- <h2 class="medium">工作制度化  制度流程化</h2>
                <h2 class="medium">流程表单化  表单信息化</h2>
                <h2 class="medium">信息智能化  智能全面化</h2> -->
                <el-image :src="textImage.url4"></el-image>
              </el-carousel-item>
            </el-carousel>
          </div>
          <div class="page-login--div">
            <img :style="{'width': $store.state.d2admin.config.imgPx,'margin-top': $store.state.d2admin.config.imgEm}" src="@/assets/image/login-top1.png">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="账户登录" name="first">
                <div class="page-login--form">
                  <el-form ref="loginForm" label-position="top" :rules="rules" :model="formLogin" size="default">
                    <el-form-item prop="username">
                      <el-input type="text" size="medium" v-model="formLogin.username" placeholder="请输入账号">
                        <template slot="prepend"><img src="@/assets/image/icon3.png" ></template>
                      </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                      <el-input type="password" size="medium" v-model="formLogin.password" placeholder="请输入密码">
                        <template slot="prepend"><img src="@/assets/image/icon1.png" ></template>
                      </el-input>
                    </el-form-item>
                    <el-form-item prop="code">
                      <el-input type="text" size="medium" v-model="formLogin.code" placeholder="请输入验证码">
                        <template slot="prepend"><img src="@/assets/image/icon1.png" ></template>
                        <!-- <template slot="append"><img class="login-code" src="@/assets/image/login-code.png"></template> -->
                        <template slot="append"><span class="login-code" @click="changeYZM">{{ loginCode }}</span></template>
                      </el-input>
                    </el-form-item>
                    <el-form-item prop="saveAccount" class="saveAccount-item">
                      <el-checkbox-group v-model="formLogin.saveAccount" @change="changeSave">
                        <el-checkbox label="保存账号" name="saveAccount" value="1"></el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                    <div>
                    </div>
                    <el-button @click="submit" type="primary" size="medium" :disabled="isDisable" round class="button-login">登录</el-button>
                  </el-form>
                  <p class="page-login--options" flex="main:justify cross:center">
                    <!-- <span>忘记密码></span> -->
                    <!-- <span @click="sign">注册用户</span> -->
                  </p>
                </div>
              </el-tab-pane>
              <el-tab-pane label="手机登录" name="second">
                <div class="page-login--form">
                <el-form ref="phoneForm" label-position="top" :rules="phoneRule" :model="phoneForm" size="default">
                  <el-form-item prop="phone">
                    <el-input type="text" size="medium" v-model="phoneForm.phone" placeholder="请输入手机号">
                      <template slot="prepend"><img src="@/assets/image/icon2.png" ></template>
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="phoneCode">
                    <el-input type="text" size="medium" v-model="phoneForm.phoneCode" placeholder="请输入验证码">
                      <template slot="prepend"><img src="@/assets/image/icon1.png" ></template>
                      <template slot="append">
                        <el-button v-if="showDountDown" type="append" size="medium" @click="getCode">获取验证码</el-button>
                        <span v-if="!showDountDown">{{ dountDown }}</span>
                      </template>
                    </el-input>
                  </el-form-item>
                  <el-button type="primary" @click="phoneSubmit" size="medium" :disabled="isDisable" round class="button-login">登录</el-button>
                </el-form>
                </div>
              </el-tab-pane>
              <el-tab-pane label="指纹登录" name="third">
                <div class="page-login--fingerprint">
                  <p><img src="@/assets/image/fingerprint.png"></p>
                  <el-button @click="" type="primary" size="medium" disabled round class="button-login">该功能暂未开通</el-button>
                </div>
              </el-tab-pane>
              <el-tab-pane label="人脸登录" name="fourth">
                <div class="page-login--fingerprint">
                  <p><img src="@/assets/image/face.png"></p>
                  <el-button @click="" type="primary" size="medium" disabled round class="button-login">该功能暂未开通</el-button>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        </div>

        <div class="page-login--content-footer">
          <p class="page-login--content-footer-options">
            版权所有:企企通软件科技股份有限公司
          </p>
          <p class="page-login--content-footer-copyright">
            为了更好的体验,请使用<span>谷歌</span>或<span>360极速浏览器</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapActions } from 'vuex'
import md5 from 'js-md5';
import util from '@/libs/util.js'
import { getAuthenticationCode, verificationPhone, getCompanyInfo } from '../../../api/personal-information/personal-data'
const TIME_COUNT = 60 // 倒计时的时间
export default {
  data () {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'));
      } else {
        const reg = /^1[3|4|5|7|8|9][0-9]\d{8}$/
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('请输入正确的手机号'));
        }
      }
    }
    return {
      timeInterval: null,
      time: dayjs().format('HH:mm:ss'),
      // 快速选择用户
      dialogVisible: false,
      showDountDown: true,
      dountDown: '',
      isDisable: false,
      users: [
        {
          name: '管理员',
          username: 'admin',
          password: 'admin'
        },
        {
          name: '编辑',
          username: 'editor',
          password: 'editor'
        },
        {
          name: '用户1',
          username: 'user1',
          password: 'user1'
        }
      ],
      activeName: 'first',
      // 表单
      formLogin: {
        username: 'admin',
        password: '123456',
        code: '',
        saveAccount: '',
      },
      // 校验
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      },
      phoneForm: {
        phone: '15903753228',
        phoneCode: ''
      },
      phoneRule: {
        phone: [
          { validator: checkPhone, trigger: 'blur' }
        ],
        phoneCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      timer: null,
      count: '',
      companyName: '',
      logUrl: '',
      loginCode: '',
      textImage: {
        url1: require('@/assets/image/login-text1.png'),
        url2: require('@/assets/image/login-text2.png'),
        url3: require('@/assets/image/login-text3.png'),
        url4: require('@/assets/image/login-text4.png'),
      }
    }
  },
  mounted () {
    this.timeInterval = setInterval(() => {
      this.refreshTime()
    }, 1000)
    this.keyupSubmit()
    getCompanyInfo({ id: '1196963121869107200' }).then(res => {
      this.companyName = res.value
    })
    getCompanyInfo({ id: '1197361620774727680' }).then(res => {
      this.logUrl = res.value
    })
    this.changeYZM()
    // 查看是否保存账号
    let storeUser = window.localStorage.getItem("storeUser")
    if(storeUser !== "" && storeUser !== null) {
      this.formLogin.saveAccount = true
      storeUser = JSON.parse(storeUser)
      this.formLogin.username = storeUser.accountNumber
      // this.formLogin.password = storeUser.password
    }
  },
  beforeDestroy () {
    clearInterval(this.timeInterval)
  },
  methods: {
    ...mapActions('d2admin/account', [
      'login',
      'phoneLogin'
    ]),
    handleClick(tab, event){
      switch(this.activeName){
        case 'first':
          this.$refs.loginForm.clearValidate()
          break
        case 'second':
          this.$refs.phoneForm.clearValidate()
          break
      }
    },
    refreshTime () {
      this.time = dayjs().format('HH:mm:ss')
    },
    changeSave(){
      // console.log(this.formLogin)
    },
    /**
     * @description 接收选择一个用户快速登录的事件
     * @param {Object} user 用户信息
     */
    handleUserBtnClick (user) {
      this.formLogin.username = user.username
      this.formLogin.password = user.password
      this.submit()
    },
    keyupSubmit () {
       document.onkeydown = e => {
        let _key = window.event.keyCode;
        if (_key === 13) {
          switch(this.activeName){
            case 'first':
              this.submit ()
              break
            case 'second':
              this.phoneSubmit ()
              break
          }

        }
      }
    },
    /**
     * @description 提交表单
     */
    // 提交登录信息
    submit () {
      this.$refs.loginForm.validate((valid) => {
        // console.log(this.formLogin)
        if (valid) {
          // 登录
          // 注意 这里的演示没有传验证码
          // 具体需要传递的数据请自行修改代码
          if(this.loginCode.toLowerCase() === this.formLogin.code.toLowerCase()){
            this.isDisable = true
            let name = md5(this.formLogin.password);
            let encryption = md5(name + this.formLogin.username);
            this.login({
              accountNumber: this.formLogin.username,
              password: encryption,
              saveAccount: this.formLogin.saveAccount
            })
              .then((res) => {
                console.log(res);
                if (util.cookies.get('isNew')) {
                  util.cookies.remove('isNew')
                  this.$router.push({
                    path: 'phoneRequired',
                    name: 'phoneRequired',
                  })
                } else {
                  util.cookies.remove('isNew')
                  // 重定向对象不存在则返回顶层路径
                  this.$router.replace(this.$route.query.redirect || '/')
                }
                // 保存账号 
                if(this.formLogin.saveAccount) {
                  let storeUser = {
                    accountNumber: this.formLogin.username,
                    // password: this.formLogin.password
                  }
                  window.localStorage.setItem("storeUser", JSON.stringify(storeUser))
                } else {
                  window.localStorage.setItem("storeUser", "")
                }
                this.isDisable = false

              }).catch(e => {
                this.isDisable = false
              })
          } else {
            this.$message.warning("验证码不一致!!!")
          }
        } else {
          // 登录表单校验失败
          // this.$message.error('表单校验失败')
        }
      })
    },
    // 手机号登录
    phoneSubmit () {
      this.$refs.phoneForm.validate((valid) => {
        if (valid) {
          this.isDisable = true
          this.phoneLogin({
            phone: this.phoneForm.phone,
            code: this.phoneForm.phoneCode
          }).then(() => {
              if (util.cookies.get('isNew')) {
                util.cookies.remove('isNew')
                this.$router.push({
                  path: 'phoneRequired',
                  name: 'phoneRequired',
                })
              } else {
                util.cookies.remove('isNew')
                // 重定向对象不存在则返回顶层路径
                this.$router.replace(this.$route.query.redirect || '/')
              }
              this.isDisable = false
            }).catch(e => {
              this.isDisable = false
            })
        } else {
          // 登录表单校验失败
          // this.$message.error('表单校验失败')
        }
      })
    },
    // 获取手机验证码
    getCode () {
      if ( this.phoneForm.phone === '') {
          this.$message.warning('手机号不能为空')
          return
      }
      if ( this.phoneForm.phone.length < 11) {
          this.$message.warning('手机号不合法')
          return
      }
      if (!this.timer) {
          this.count = TIME_COUNT;
          this.showDountDown = false
          this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                  this.count--;
                  this.dountDown = '倒计时' + this.count + 's'
                  console.log(this.time)
                  console.log(this.dountDown)
              } else {
                  this.showDountDown = true;
                  clearInterval(this.timer);  // 清除定时器
                  this.timer = null;
              }
          }, 1000)
      }
      // 获取手机验证码
      getAuthenticationCode({phone: this.phoneForm.phone}).then( res => {
          this.$message(res);
      }).catch( err => {
          this.showDountDown = true;
          clearInterval(this.timer);  // 清除定时器
          this.timer = null;
      })
    },
    changeYZM:function(){
        let yzm_code = ''//点击更换时-初始验证码
        let codeChars = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
          'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
          'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z')  //候选字符
        //通过循环获取4位codeChars中的字符下标，并通过下标获取指定字符，最后拼接
        for (let i = 0; i < 4; i++ ) {
          let charNum = Math.floor(Math.random() * 62) //获取随机验证码下标
          yzm_code += codeChars[charNum] //根据下标获取指定字符并拼接
        }
        this.loginCode = yzm_code
      }
  }
}
</script>

<style lang="scss">
.page-login {
  height: 100%;
  position: relative;
  // 层
  .page-login--layer {
    @extend %full;
    overflow: auto;
    background: url("../../../assets/image/back1.png") no-repeat center;
    background-size: 100%;
  }
  .page-login--layer-area {
    overflow: hidden;
  }
  // 时间
  .page-login--layer-time {
    font-size: 24em;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.03);
    overflow: hidden;
  }
  // 登陆页面控件的容器
  .page-login--content {
    height: 100%;
    min-height: 500px;
    .page-login--top{
      background-color: #FFF;
      height: 80px;
      width: 100%;
      .page-login--top-logo{
        padding-left: 100px;
        line-height: 80px;
        font-size: 25px;
        letter-spacing: 4px;
        margin: 0px;
        span{
          display: inline-flex;
          color: #4570ff;
          font-weight: 550;
          background-image: -webkit-linear-gradient(60deg, #4570ff, #25caff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          img{
            height: 50px;
            margin-top: 15px;
            margin-right: 20px;
          }
        }
      }
    }
  }
  // header
  .page-login--content-header {
    padding: 1em 0;
    .page-login--content-header-motto {
      margin: 0px;
      padding: 0px;
      color: $color-text-normal;
      text-align: center;
      font-size: 12px;
      span {
        color: $color-text-sub;
      }
    }
  }
  .page-login--content-main-div{
    width: 1160px;
    .page-login--left-carousel{
      width: 660px;
      float: left;
      color: #FFF;
      .el-image{
        margin-top: 50px;
      }
      .medium{
        text-align: center;
        font-family: MicrosoftYaHei-Bold;
        letter-spacing: 3px;
      }
      h1{
        font-size: 45px;
        line-height: 350px;
      }
      h2{
        font-size: 38px;
      }
      h3{
        font-size: 32px;
      }
      .item1{
        padding: 0px 40px;
      }
      .item2{
        padding-top: 100px;
      }
      .item3{
        padding-top: 110px;
      }
    }
  }
  .page-login--div{
    background-color: #FFF;
    border-radius: 50%;
    border: 20px solid #c2efff;
    height: 460px;
    width: 460px;
    text-align: center;
    float: right;
    .el-tabs{
      padding: 0px 55px;
      .el-tabs__nav-wrap.is-scrollable{
        padding: 0px;
      }
      .el-tabs__item{
        padding: 0px 10px;
      }
    }
  }
  @media (max-width: 1000px) {
    .page-login--content-main-div{
      width: 800px;
    }
    .page-login--left-carousel{
      width: 300px !important;
      h1{
        font-size: 30px !important;
        line-height: 50px !important;
        padding-top: 140px;
      }
      h2{
        font-size: 25px !important;
      }
      h3{
        font-size: 20px !important;
      }
      .item2{
        padding-top: 140px !important;
      }
      .item3{
        padding-top: 140px !important;
      }
    }
    // .page-login--div{
    //   width: 380px;
    //   height: 380px;
    // }
  }
  // 登录表单
  .page-login--form {
    width: 280px;
    margin: 0 auto;
    .el-form{
      .el-form-item{
        margin-bottom: 12px;
        .el-form-item__error{
          padding-left: 42px;
          padding-top: 0px;
        }
      }
      .saveAccount-item{
        margin-bottom: 0px;
        .el-form-item__content{
          line-height: 30px;
          .el-checkbox-group{
            text-align: left;
            .el-checkbox{
              margin-bottom: 0px;
            }
          }
        }
      }
    }
    .button-login {
      width: 150px;
    }
    .el-input-group__prepend {
      padding: 0px 14px;
      img{
        width: 14px;
        margin-top: 5px;
      }
    }
    .el-input-group__append{
      border: none;
      border-radius: 0px;
      background: none;
      border-bottom: 1px solid #DCDFE6;
      .el-button{
        padding: 10px;
        color: #4375ff;
        span{
          position: relative;
        }
        span::before{
          content: "";
          width: 1px;
          background: #cccccc;
          height: 100%;
          position: absolute;
          left: -10px;
        }
      }
    }
    .login-code {
      display: block;
      margin: 0px -20px;
      margin-top: 4px;
      border: 1px solid #DCDFE6;
      border-radius: 2px;
      padding: 2px 5px;
      letter-spacing: 3px;
      font-weight: bold;
      cursor: pointer;
      background-image: -webkit-linear-gradient(60deg, #4570ff, #25caff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .page-login--options {
      margin: 0px;
      padding: 0px;
      font-size: 14px;
      color: $color-primary;
      margin-bottom: 15px;
      font-weight: bold;
      span{
        color: #f88512;
        margin: 0 auto;
      }
    }
    .page-login--quick {
      width: 100%;
    }
    .el-input{
      .el-input__inner{
        border-top: none;
        border-left: none;
        border-right: none;
        border-radius: 0px;
      }
      .el-input-group__prepend{
        background: none;
        border-top: none;
        border-left: none;
        border-radius: 0px;
      }
    }
  }
  .page-login--fingerprint{
    .el-button{
      width: 150px;
    }
    img{
      width: 150px;
      margin: 20px 0px;
    }
  }
  .page-login--content-footer {
    padding: 1em 0;
    letter-spacing: 2px;
    .page-login--content-footer-options {
      padding: 0px;
      margin: 0px;
      margin-bottom: 10px;
      font-size: 14px;
      text-align: center;
    }
    .page-login--content-footer-copyright {
      padding: 0px;
      margin: 0px;
      font-size: 14px;
      color: $color-text-normal;
      span{
        color: #f88512;
      }
    }
  }
}
</style>
