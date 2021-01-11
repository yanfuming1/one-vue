<template>
    <div class="page-login">
        <transition name="el-fade-in-linear">
            <div class="page-login--layer" v-if="isShowPhoneRequired">
                <div
                    class="page-login--content"
                    flex="dir:top main:justify cross:center box:justify">
                    <div
                        class="page-login--content-main"
                        flex="dir:top main:center cross:center" style="height: 450px;">
                        <!-- logo -->
                        <img class="page-login--logo" src="@/assets/image/all.png">
                        <!-- 表单 -->
                        <div class="page-login--form">
                            <el-card shadow="never">
                                <el-form ref="loginForm" label-position="top" :rules="rules" :model="formLogin" size="default">
                                    <el-form-item prop="phone">
                                        <el-input type="text" v-model="formLogin.phone" placeholder="手机号">
                                            <i slot="prepend" class="el-icon-mobile-phone"></i>
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item prop="authCode">
                                        <el-input type="authCode" v-model="formLogin.authCode" placeholder="- - - -">
                                            <template slot="prepend">验证码</template>
                                            <template slot="append">
                                            <img class="login-code" src="@/assets/image/login-code.png">
                                            </template>
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item prop="code">
                                        <el-input type="text" v-model="formLogin.code" placeholder="验证码">
                                            <i slot="prepend" class="el-icon-key"></i>
                                            <el-button slot="append" @click="getAuthCode">
                                                <span v-show="show">获取验证码</span>
                                                <span v-show="!show" class="count">{{count}} </span>
                                            </el-button>
                                        </el-input>
                                    </el-form-item>
                                    <el-button size="default" @click="submit" type="primary" class="button-login">下一步</el-button>
                                </el-form>
                            </el-card>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <entry-registration :identification="true" v-if="!isShowPhoneRequired"></entry-registration>
    </div>
</template>

<script>
import * as elValudate from "../../../systemManagement/bankAccountSettings/components/dataValidation"
import entryRegistration from '../../../personal-information/entryRegistration/component/entryRegistration'
import { getAuthenticationCode, verificationPhone } from '../../../../api/personal-information/personal-data'
import util from '@/libs/util.js'
const TIME_COUNT = 60 // 倒计时的时间
export default {
    data () {
        return {
            formLogin: {
                phone: util.cookies.get ('phone'),
                code: '',
                authCode: 'v9aw',
                id: util.cookies.get ('uuid'),
            },
            // 校验
            rules: {
                phone: [
                    {validator:elValudate.elValidatePhone, message: '请输入手机号', trigger: 'change' }
                ],
                authCode: [
                    { required: true, message: '请输入验证码', trigger: 'blur' }
                ],
                code: [
                    { required: true, message: '请输入验证码', trigger: 'blur' }
                ]
            },
            show: true,
            timer: null,
            count: '',
            codeResult: '',
            isShowPhoneRequired: true
        }
    },

    methods: {

        submit () {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    if (this.timer == null) {
                        this.$message.warning('验证码已失效')
                        return
                    }
                    verificationPhone (this.formLogin).then(res => {
                        if (res.code === 200) {
                            this.isShowPhoneRequired = false
                        } else {
                            this.$message.warning('验证码有误')
                        }
                    })
                }
            })
        },

        getAuthCode () {
            this.$store.commit ('d2admin/loading/noAllowShow')
            if ( this.formLogin.phone === '') {
                this.$message.warning('手机号不能为空')
                return
            }
            if ( this.formLogin.phone.length < 11) {
                this.$message.warning('手机号不合法')
                return
            }
            if (!this.show) {
                return
            }
            if (!this.timer) {
                this.count = TIME_COUNT;
                this.show = false;
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
            // 获取验证码
            getAuthenticationCode(this.formLogin).then( res => {
                this.$message(res);
            }).catch( err => {
                this.show = true;
                clearInterval(this.timer);  // 清除定时器
                this.timer = null;
            })
        }
    },

    created () {
        let boolean = JSON.parse (util.cookies.get('page'))
        if (boolean) {
            this.isShowPhoneRequired = true
        } else {
            this.isShowPhoneRequired = false
        }
    },

    components: {
        'entry-registration': entryRegistration
    }
}
</script>

<style lang='scss' scoped>
.page-login {
    // main
    .page-login--logo {
        width: 160px;
        margin-bottom: 2em;
        margin-top: -2em;
        font-size: 0px;
    }
    // 登录表单
    .page-login--form {
        width: 400px;
        // 卡片
        .el-card {
            margin-bottom: 15px;
        }
        // 登录按钮
        .button-login {
            width: 100%;
            margin-top: 40px;
        }
        // 输入框左边的图表区域缩窄
        .el-input-group__prepend {
            padding: 0px 14px;
        }
        .login-code {
            height: 40px - 2px;
            display: block;
            margin: 0px -20px;
            border-top-right-radius: 2px;
            border-bottom-right-radius: 2px;
        }
        // 登陆选项
        .page-login--options {
            margin: 0px;
            padding: 0px;
            font-size: 14px;
            color: $color-primary;
            margin-bottom: 15px;
            font-weight: bold;
        }
        .page-login--quick {
            width: 100%;
        }
    }
}
</style>
