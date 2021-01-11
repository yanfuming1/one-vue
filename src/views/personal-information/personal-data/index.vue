<template>
    <d2-container>
        <div class="ms-content">
            <div class="card-left">
                <div class="header-left">
                    <div class="user-img">
                        <div>
                            <el-upload
                                class="avatar-uploader"
                                action="url"
                                :http-request="uploadImg"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload">
                                <img v-if="urlImg" v-bind:src="urlImg" class="avatar">
                                <div v-else class="head-portrait">
                                </div>
                            </el-upload>
                        </div>
                        
                        <div class="customer-info">
                            <h2> {{ personalDetails.name }} </h2>
                            <p> {{ personalDetails.jobNumber }} </p>
                            <div id="login-data">
                                <span>上次登录时间: {{ lastLoginTime }}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="essential-information">
                        <div>
                            <p>登录账户：</p><span> {{ personalDetails.jobNumber }} </span>
                        </div>
                        <div>
                            <p>工作单位：</p>
                            <span> {{ personalDetails.companyId }} </span>
                        </div>
                        <div>
                            <p>工作部门：</p>
                            <span> {{ personalDetails.untitled }} </span>
                        </div>
                        <div>
                            <p>工作职务：</p>
                            <span> {{ personalDetails.posiId }} </span>
                        </div>
                    </div>
                    
                    <div class="content-mask">
                        <div>
                            <span>{{ loginTotal }}</span>
                            <p>登录</p>
                        </div>
                        <div>
                            <span>{{ messageTotal }}</span>
                            <p>消息</p>
                        </div>
                        <div>
                            <span>{{ logTotal }}</span>
                            <p>日志</p>
                        </div>
                    </div>
                    
                </div>
            </div>

            <div class="card-right">
                <el-card class="box-card">
                    <el-tabs v-model="activeName" @tab-click="handleClick">

                        <el-tab-pane label="账号绑定" name="first">
                            <el-form :model="personalDetails" ref="bindAccount" label-width="100px" :rules="rules" >
                                <el-row>
                                    <el-col :span="11">
                                        <el-form-item label="个人手机号:">
                                            <el-input :value="personalDetails.phone"
                                                v-model="personalDetails.phone" 
                                                :placeholder="'请输入个人手机号'" 
                                                @input="personalDetails.phone = $event" @focus="updataPhone"
                                                >
                                                <i slot="suffix" class="el-icon-edit-outline" @click="updataPhone"></i>
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11" :offset='2'>
                                        <el-form-item label="公司电话:"  prop="companyPhone">
                                            <el-input v-model="personalDetails.companyPhone" :placeholder="'请输入公司电话'"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="11">
                                        <el-form-item label="个人邮箱:" prop="email">
                                            <el-input v-model="personalDetails.email" :placeholder="'请输入个人邮箱'" type="email"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11" :offset='2'>
                                        <el-form-item label="公司邮箱:"  prop="companyEmail">
                                            <el-input v-model="personalDetails.companyEmail" :placeholder="'请输入公司邮箱'"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="11">
                                        <el-form-item label="个人微信:">
                                            <el-input v-model="personalDetails.wechat" :placeholder="'请输入个人微信'"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11" :offset='2'>
                                        <el-form-item label="个人QQ:">
                                            <el-input v-model="personalDetails.qq" :placeholder="'请输入个人QQ'"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>

                            <el-dialog v-dialogDrag title="更新个人手机号" :visible.sync="dialogFormVisible" class="renewalPhone">
                            <el-form :model="renewalPhone"  :rules="rules" ref="form">
                                <el-form-item label="当前手机号" label-width="100px" prop="phone">
                                    <el-input v-model="personalDetails.phone" :disabled="true"> </el-input>
                                </el-form-item>
                                <el-form-item label="新手机号" label-width="100px" prop="phone">
                                    <el-input v-model="renewalPhone.phone" placeholder="请输入新手机号"></el-input>
                                </el-form-item>
                                <el-form-item label="验证码" label-width="100px">
                                    <el-input placeholder="请输入验证码" v-model="renewalPhone.code">
                                        <el-button  slot="append" icon="el-icon-mobile-phone" @click="verificationCodeEven"  type="success" :disabled="disabled=!show">  
                                            <span v-show="show">获取验证码</span>
                                            <span v-show="!show" class="count">{{count}} </span>
                                        </el-button>
                                    </el-input>
                                </el-form-item>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button type="primary" @click="updataPhoneBtn">确 定</el-button>
                                <el-button @click="cancelPhone">取 消</el-button>
                            </div>
                            </el-dialog>

                            <div class="update-button">
                                <el-button type="primary" size="small" @click="updataEssentialInformation">更新基本信息</el-button>
                            </div>

                        </el-tab-pane>

                        <el-tab-pane label="银行卡管理" name="bankManagement">
                            <personal-banking-form :data="personalBankingFormData"></personal-banking-form>
                        </el-tab-pane>
                        
                        <el-tab-pane label="登录密码修改" name="changePassword" class="changePassword">
                            <div class="change-password">
                                <el-form :model="resetForm" status-icon  ref="resetForm" label-width="100px" :rules="resetFormRules">
                                    <el-form-item label="原密码:" prop="oldPassword">
                                        <el-input type="password" v-model="resetForm.oldPassword" auto-complete="off" show-password ></el-input>
                                    </el-form-item>
                                    <el-form-item label="新密码:" prop="newPassword">
                                        <el-input type="password" v-model="resetForm.newPassword" auto-complete="off" show-password></el-input>
                                    </el-form-item>
                                    <el-form-item label="确认密码:" prop="confirmPassword">
                                        <el-input type="password" v-model="resetForm.confirmPassword" auto-complete="off" show-password></el-input>
                                    </el-form-item>
                                </el-form>
                                <div class="change-button">
                                    <el-button type="primary" size="smal" @click="updataToPassword">确认修改</el-button>
                                </div>
                            </div>
                            
                            
                        </el-tab-pane>
                    </el-tabs>
                </el-card>
            </div>
        </div>
    </d2-container>
</template>
<script>
    import { mapState } from 'vuex'
    import { fileUpload } from '../../../api/system/file/file'
    import { 
        getPersonalDetailsFindById, 
        updataPersonalCenterEditor,
        updataPassword,
        personalCenterAdd,
        getAuthenticationCode,
        verificationPhone,
        changeUserAvatar
        } from '../../../api/personal-information/personal-data'
    import { qqtInput, upload } from '../../../components/qqt-subassembly'
    import personalBankingForm from './personalBankingForm'
    import util from '../../../libs/util'
    import * as elValudate from "../../systemManagement/bankAccountSettings/components/dataValidation" 
    import * as elValudateBank from "../../systemManagement/bankAccountSettings/components/bankNumber" 
    import * as elValudateCodings from "../../systemManagement/bankAccountSettings/components/onlyCodings" 
    const TIME_COUNT = 60 // 倒计时的时间
    let that = this
    export default {
        name: 'personal-data',
        data () {
            return {
                bankRules: {
                    name: [{ required: true, message: "请输入户名", trigger: ["blur",'change'] }],
                    openingBank:[{ required: true, message: "请输入开户行", trigger: ["blur",'change'] }],
                    account: [
                        { required: true, validator:elValudateBank.bankNumbers, message: '请输入正确的银行账号',  trigger:  ["blur",'change']}
                    ],
                    // onlyCoding: [
                    //     { validator:elValudateCodings.onlyCodings,message: '请输入正确的行号', trigger:  ["blur",'change']}
                    // ],
                    // linkman:[{ message: "请输入联系人", trigger: ["blur",'change'] }],
                    // phone:[{ validator:elValudate.elValidatePhone, message: "请输入正确的手机号", trigger: ["blur",'change'] }]
                },
                rules: {
                    phone: [{validator:elValudate.elValidatePhone, message: "请输入正确的手机号", trigger:  ["blur",'change'] }],
                    email: [{message: '请输入邮箱地址', trigger:  ["blur",'change'] },{ type: 'email', message: '请输入正确的邮箱地址', trigger:  ["blur",'change'] }],
                    companyEmail: [{message: '请输入邮箱地址', trigger:  ["blur",'change']  },{ type: 'email', message: '请输入正确的邮箱地址',trigger:  ["blur",'change']  }]
                },
                resetFormRules: {
                     oldPassword: [
                        { required: true, message: "请输入原密码", trigger: 'blur' }
                    ],
                    newPassword: [
                        { required: true,message: "请输入新密码",  validator: validatePass1, trigger: 'blur' }
                    ],
                    confirmPassword: [
                        { required: true,message: "请再次输入密码", validator: validatePass2, trigger: 'blur' }
                    ]
                },
                tableData: [],
                personalBankingFormData: [],
                input3:'',
                changeAvatarData:[],
                personalDetails: {
                    jobNumber: '',
                    companyId: '',
                    untitled: '',
                    posiId: '',
                    phone:'',
                    companyPhone:'',
                    email:'',
                    companyEmail:'',
                    wechat:'',
                    qq:''
                },

                resetForm: {
                    newPassword: '',
                    confirmPassword: ''
                },

                activeName: 'first',
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
                loginTotal: '',
                logTotal:'',
                messageTotal:'',
                urlImg: '',
                lastLoginTime: '',
                dialogFormVisible: false,
                renewalPhone: {
                    currentPhone:'',
                    phone:'',
                    code:'',
                    id:''
                },
                isShowElement: false,
                // pBtnTitle: '更改绑定'
                rowData:'',
                show: true,  // 初始启用按钮F
                count: '',   // 初始化次数
                timer: null,
                codeResult: '',
                bankTableData: ''
            }
            let validatePass = (rule, value, callback) => {
				if (!value) {
					callback(new Error('请输入原密码'));
				}else {
				}
            }
            var validatePass1 = (rule, value, callback) => {
				if (!value) {
					callback(new Error('请输入新密码'));
				} else if (value.toString().length < 6 || value.toString().length > 18) {
					callback(new Error('密码长度为6 - 18个字符'))
				} else {
					callback();
				}
            }
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.resetForm.newPassword) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            }
        },

        methods: {
            handleAvatarSuccess(res, file) {

            },

            beforeAvatarUpload(file) {
                let isJPG = /^image\/(jpeg|png|jpg)$/.test(file.type);
                let isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片有误 !');
                    return false
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                    return false
                }

                
            },

             uploadImg(file,res) {
                let fd = new FormData()
                fd.append('file',file.file)
                fileUpload(fd).then(res => {
                    this.urlImg = res
                })
                setTimeout( ()=> {
                    if (this.urlImg !== '') {
                        changeUserAvatar({
                            url: this.urlImg
                        }).then(res => {
                            this.$message.success("修改成功")
                        })
                    } else {
                        this.$message.success("修改失败")
                    }
                },1000)
                
            },

            handleClick(tab, event) {
            },

            openDetails (row) {
                this.rowData = row
                
            },
            
            addRow (tableData,event) {
                if (this.tableData.length == 0) {
                    // this.tableData.push({ name: '', openingBank: '', account:'', onlyCoding:'', linkman:'', phone:'', remark:'' })
                    this.tableData.push({ name: '', openingBank: '', account:'',  remark:'' })
                } else {
                    let tab = this.tableData[this.tableData.length-1]
                    // if (tab.name === '' || tab.openingBank === '' || 
                    //     tab.account === '' || tab.linkman === '' || 
                    //     tab.phone === '') {
                    //         this.$message.warning('请填写完上一条数据')
                    if (tab.name === '' || tab.openingBank === '' || 
                        tab.account === '') {
                            this.$message.warning('请填写完上一条数据')
                    } else {
                        // this.tableData.push({ name: '', openingBank: '',account:'', onlyCoding:'', linkman:'', phone:'', remark:'' })
                        this.tableData.push({ name: '', openingBank: '', account:'',  remark:'' })
                    }
                }
            },

            getPersonalDetails () {
                getPersonalDetailsFindById().then(res => {
                    if (res) {
                        if (res.accounts && res.accounts.length > 0) {
                            this.tableData = res.accounts
                        }
                        if (res.staff) {
                            this.personalDetails = res.staff
                        }
                        this.loginTotal = res.loginTotal
                        this.messageTotal = res.messageTotal
                        this.logTotal = res.logTotal
                        this.urlImg = res.url
                        this.lastLoginTime = util.timestampToDateString(new Date(res.lastLoginTime).getTime())
                    }
                })
            },
            
            // 更新手机号弹框
            updataPhone () {
                this.dialogFormVisible = true
            },

             // 更新手机号确认按钮
            updataPhoneBtn ( ) {
                if( this.renewalPhone.phone === '' ){
                    this.$message.warning('请输入手机号')
                    return false
                }
                if( this.renewalPhone.phone === this.personalDetails.phone ){
                    this.$message.warning('新手机号和旧手机号一致，请输入需更换的手机号')
                    return false
                }
                if (this.renewalPhone.code  === "") {
                     this.$message.warning('请输入验证码')
                     return false
                }
                let temp = this.renewalPhone
                temp.id = util.cookies.get('uuid')
                if (temp.code === this.renewalPhone.code){
                    verificationPhone (
                        temp
                    ).then(res => {
                        that.dialogFormVisible = false
                        this.getPersonalDetails()
                        this.$message.success("更换手机号成功")
                    }).catch(err => {
                        this.$message.error("更换手机号失败")   
                    });
                } else {
                     this.$message.warning('验证码不正确')
                }
            },

            // 取消更改手机号
            cancelPhone () {
                this.dialogFormVisible = false
                this.$refs.form.resetFields()
            },

            // 获取验证码按钮 和 接口
            verificationCodeEven (rule, value, callback) {
                if ( this.renewalPhone.phone === '') {
                     this.$message.warning('手机号不能为空')
                    return
                } else {
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
                    getAuthenticationCode({
                        phone: this.renewalPhone.phone
                    }).then( res => {
                        that.codeResult = res + ''
                    }).catch( err => {
                        console.log(err)
                    })
                }
            },
            indexMethod (index) {
                return index + 1 ;
            },

            updataToPassword () {
                if( this.resetForm.oldPassword === '' ){
                        this.$message.warning('请输入原密码')
                        return false
                    }
                    if (this.resetForm.newPassword  === "") {
                        this.$message.warning('请输入新密码')
                        return false
                    }
                    if (this.resetForm.confirmPassword  === "") {
                        this.$message.warning('请再次确认密码')
                        return false
                    }
                    if (this.resetForm.newPassword != this.resetForm.confirmPassword) {
                        this.$message.warning('两次输入密码不一致')
                        return false
                    }
                    updataPassword({'newPassword': this.resetForm.newPassword, 'oldPassword': this.resetForm.oldPassword}).then(res => {
                        if (res) {
                            if (res.code === 200) {
                                this.$message.success(res.message + `, 请重新登陆`)
                                this.$router.push ({
                                    path: '/login'
                                })
                            }
                        }
                    })
            },

            updataEssentialInformation () {
                let upEssentialInformation = {}
                upEssentialInformation.id = this.personalDetails.id
                upEssentialInformation.companyPhone = this.personalDetails.companyPhone
                upEssentialInformation.email = this.personalDetails.email
                upEssentialInformation.companyEmail = this.personalDetails.companyEmail
                upEssentialInformation.wechat = this.personalDetails.wechat
                upEssentialInformation.qq = this.personalDetails.qq
                updataPersonalCenterEditor (upEssentialInformation).then(res => {
                    if (res.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                    }
                }).catch(err => {
                    this.$message({
                        type: 'info',
                        message: '取消修改'
                    });          
                });
            },

            delectAccountRowEven (index) {
                this.tableData.splice(index, 1)
            }
        },
        components: {
            'qqt-input': qqtInput,
            'up-load': upload,
            'personal-banking-form': personalBankingForm

        },
        mounted () {
            that = this
        },
        created () {
            this.$store.dispatch ('d2admin/customer/customerInformationLoad')
            this.getPersonalDetails()
        },
        computed: {
            ...mapState('d2admin/customer', [
                'customerInfor',
            ])
        },
    }
</script>

<style scoped lang="scss">
    * {
        font-size: 14px;
    }

    .ms-content {
        .bank-management-conent {
            .el-form-item {
                margin-bottom:  0px
            }
        }
        .header-left{
            display: flex;
            width: 100%;
            box-shadow: 0 2px 12px 0 $color-border-shadow;
            background: $color-bg3;
            margin-bottom: 22px;
            height: 230px;
            // 头部 - 图标
            .user-img{
                width: 30%;
                margin: 50px 0 ;
                border-right: 1px dashed $color-straight-line3;
                display: flex;
                align-items: center;
                margin-left: 32px;
                .head-portrait {
                    width: 80px;
                    height: 80px;
                    border: $color-straight-line2 2px solid;
                    border-radius: 80px;
                    margin: 0 auto;
                    margin-bottom: 16px
                }
            }
            
            // 头部 - 登录信息
            .customer-info{
                margin-left: 22px;
                line-height: 32px;
                h2 {
                    font-size: 20px;
                    font-weight: bold
                }
                p {
                    font-weight: bold
                }
            }

            // 头部 - 基本信息
            .essential-information {
                width: 40%;
                margin: 50px 22px ;
                border-right: 1px dashed $color-straight-line3;
                div {
                    display: flex;
                    align-items: center;
                    line-height: 40px;
                }

                p {
                    text-align: right;
                    width: 100px;
                }

                span {
                    font-weight: bold;
                    overflow: auto;
                    white-space: nowrap;
                    padding: 0 12px;
                }
            }
            // 头部 - 登录通知信息
            .content-mask {
                width: 20%;
                height: 230px;
                padding-top: 75px;
                position: absolute;
                right: 20px;
                background: $color-opacity-bg;
                display: flex;
                justify-content: space-around;
                div {
                    text-align: center;
                    margin-top: 10px;
                }
                span{
                    font-size: 18px;
                    font-weight: bold
                }
            }
            
        }
    }


    .card-right {
        flex: 7;
        // height: 500px;
        
        .box-card {
            height: 525px;
        }
    }


    .binding-account {
        display: flex;
        flex-wrap: wrap
    }

    .binding-account > div {
        margin: 0 6px;
        display: flex;
        width: 45%;
    }

    .binding-account > div > p {
        margin-right: 6px;
        width: 30%;
        text-align: right;
    }

    .change-password{
        margin-top: 22px;
        text-align: center;
        width: 30%;
        .el-input{
            width: 100%;
        }
    }
    .renewalPhone{
        margin: 0 auto;
        width: 60%;
    }
    .update-button {
        text-align: center;
        margin-top: 12px;
    }
    .el-input__inner{
        border-radius: none,
    }

    .card-right___button{
        position: fixed;
        right: 70px;
        margin-top: 20px;
        z-index: 1
    }

    .el-button--mini, .el-button--mini.is-round {
        padding: 4px 5px !important;
    }

    .el-button+.el-button {
        margin-left: 15px !important
    }

    .avatar {
        width: 96px;
        height: 96px;
        display: block;
        border-radius:300px
    }
</style> 