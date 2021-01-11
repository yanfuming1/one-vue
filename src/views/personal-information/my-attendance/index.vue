<template>
    <d2-container>
        <div class="ms-content">
            <div class="card-left">
                <el-card id="box-card" class="box-card">
                    <div class="head-portrait">
                        <img src="">
                    </div>
                    <p>Admin</p>
                    <div id="login-data"><p>上次登录时间</p>2019年8月1日10点30分</div>
                </el-card>
                <div class="content-mask">
                    <div>
                        <span>256</span>
                        <p>登录</p>
                    </div>
                    <div>
                        <span>256</span>
                        <p>消息</p>
                    </div>
                    <div>
                        <span>256</span>
                        <p>日志</p>
                    </div>
                </div>
            </div>
            <div class="card-right">
                <el-card class="box-card">
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <!--                        <el-button type="primary">主要按钮</el-button>-->
                        <el-tab-pane label="基本信息" name="first">
                            <div class="essential-information">
                                <div>
                                    <p>登录账户：</p><span>545268088</span>
                                </div>
                                <div>
                                    <p>工作单位：</p>
                                    <span>企企通软件股份有限公司</span>
                                </div>
                                <div>
                                    <p>部门：</p>
                                    <span>人事部 技术部 产品部</span>
                                </div>
                                <div>
                                    <p>职务：</p>
                                    <span>总经理 职员</span>
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="账号绑定" name="bindingAccount">
                            <div class="binding-account">
                                <div class="">
                                    <p>个人手机号:</p>
                                    <el-input v-model="input" placeholder="请输入个人手机号"></el-input>
                                </div>
                                <div class="">
                                    <p>公司电话:</p>
                                    <el-input v-model="input" placeholder="请输入公司电话"></el-input>
                                </div>
                                <div class="">
                                    <p>个人邮箱:</p>
                                    <el-input v-model="input" placeholder="请输入个人邮箱"></el-input>
                                </div>
                                <div class="">
                                    <p>公司邮箱:</p>
                                    <el-input v-model="input" placeholder="请输入公司邮箱"></el-input>
                                </div>
                                <div class="">
                                    <p>个人微信:</p>
                                    <el-input v-model="input" placeholder="请输入微信"></el-input>
                                </div>
                                <div class="">
                                    <p>个人QQ:</p>
                                    <el-input v-model="input" placeholder="请输入个人QQ"></el-input>
                                </div>
                                <div class="">
                                    <p>银行卡1用户名:</p>
                                    <el-input v-model="input" placeholder="请输入银行卡用户名"></el-input>
                                </div>
                                <div class="">
                                    <p>开户行:</p>
                                    <el-input v-model="input" placeholder="请输入开户行"></el-input>
                                </div>
                                <div class="">
                                    <p>银行卡号:</p>
                                    <el-input v-model="input" placeholder="请输入银行卡号"></el-input>
                                </div>
                            </div>

                            <div class="update-button">
                                <el-button type="primary">更新基本信息</el-button>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="登录密码修改" name="changePassword">
                            <div class="change-password">
                                <div class="">
                                    <p>原密码:</p>
                                    <el-input v-model="input" placeholder="请输入原密码"></el-input>
                                </div>
                                <div class="">
                                    <p>新密码:</p>
                                    <el-input v-model="input" placeholder="请输入新密码"></el-input>
                                </div>
                                <div class="">
                                    <p>确认新密码:</p>
                                    <el-input v-model="input" placeholder="请确认新密码"></el-input>
                                </div>

                            </div>
                            <div class="change-button">
                                <el-button type="primary">确认修改</el-button>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </el-card>
            </div>
        </div>

    </d2-container>
</template>
<script>
    export default {
        name: 'index',
        data() {
            return {
                activeName: 'first',
                input: ''
            };
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event);
            }
        }
    }
</script>

<style scoped>
    * {
        font-size: 14px;
    }

    * p {
        color: #666666;
    }

    #box-card {
        display: flex;
        justify-content: center;
        text-align: center;
        height: 100%;
    }

    .ms-content {
        display: flex;
    }

    .ms-content > div {
        margin: 0 5px;
    }


    .card-left {
        flex: 3;
        position: relative;
    }

    .head-portrait {
        width: 80px;
        height: 80px;
        border: #999999 2px solid;
        border-radius: 80px;
        margin: 0 auto;
    }

    .content-mask {
        position: absolute;
        left: 0;
        bottom: -1px;
        height: 5rem;
        background: #cfe5f7;
        /*background: #4283fe;*/
        /*opacity: 0.21;*/
        width: 100%;
        display: flex;
        justify-content: space-around;
    }

    .content-mask > div {
        text-align: center;
        margin-top: 10px;
    }

    .card-right {
        flex: 7;
    }

    .essential-information > div {
        display: flex;
        align-items: center;
    }

    .essential-information > div > p {
        text-align: right;
        width: 10%;
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

    /*.binding-account > div div {*/
    /*    display: flex;*/
    /*    margin: 2px 0;*/
    /*}*/

    .binding-account > div > p {
        margin-right: 6px;
        width: 30%;
        text-align: right;
    }

    .update-button {
        text-align: center;
        margin-top: 12px;
    }

    .change-password > div {
        display: flex;
        justify-content: center;
        width: 80%;
        margin: 6px 0;
    }

    .change-password > div > p {
        text-align: right;
        width: 30%;
        margin-right: 6px;
    }

    .change-button {
        text-align: center;
        margin-top: 12px;
    }

    .item {
        padding: 18px 0;
    }
</style>