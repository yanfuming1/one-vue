<template>
    <div>
        <div class="account-information-tabs-account">
            <div class="account-information-tabs-account-bottom" >
                <div v-if="hasAccount">
                    <div class="account-information-tabs-account-bottom-count" v-for="(item, index) of list" :key="index">
                        <el-row>
                            <el-col :span="20">
                                <el-form>
                                    <el-row>
                                        <el-col :span="8">
                                            <el-form-item label="账号性质:">
                                                <p>{{ item.untitled1 }}</p>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item label="账户名称:">
                                                <p>{{ item.name }}</p>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item label="开户行:">
                                                <p>{{ item.openingBank }}</p>
                                            </el-form-item>
                                        </el-col>
                                    
                                    </el-row>
                                    <el-row>
                                
                                        <el-col :span="8">
                                            <el-form-item label="银行账号:">
                                                <p>{{ item.account }}</p>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item label="联系人:">
                                                <p>{{ item.linkman }}</p>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item label="电话:">
                                                <p>{{ item.phone }}</p>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <!-- <el-row>
                                        <el-col :span="8">
                                            <el-form-item label="职位:">
                                                <p>{{ item.untitled2 }}</p>
                                            </el-form-item>
                                        </el-col>
                                    </el-row> -->
                                </el-form>
                            </el-col>
                            <el-col :span="4">
                                <el-row>
                                    <el-col :span="24" class="d2-mt-5">
                                        <el-button type="primary" size="small" plain class="set-up-btn" v-if=" !customerInfor.iCanSeeIt && item.nature === '1' " @click="setUpAccountEvent(item)">主卡</el-button>
                                    </el-col>
                                    <el-col :span="24" class="d2-mt-5">
                                        <el-button type="primary" size="small" plain class="set-up-btn" v-if=" (!customerInfor.iCanSeeIt  && item.nature === '0') || item.nature == null  " @click="setUpAccountEvent(item)">设为主卡</el-button>
                                    </el-col>
                                    <el-col :span="24" class="d2-mt-5">
                                        <el-button type="primary" size="small" plain class="editbtn" v-if=" !customerInfor.iCanSeeIt " @click="editAccountEvent(item)">编辑</el-button>
                                    </el-col>
                                    <el-col :span="24" class="d2-mt-5">
                                        <el-button type="danger" size="small" plain class="editbtn"  @click="delAccountEvent(item)">删除</el-button>
                                    </el-col>
                                </el-row> 
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </div>
            <div>
                <div class="operationButton">
                    <el-button type="primary" plain class="new-account-infor-btn" @click="addAccountDetailsEvent" v-if=" !customerInfor.iCanSeeIt ">新建账户信息</el-button>
                </div>
            </div>
            <template>
                <new-Account-Information
                    :dialogTitle="dialogTitle"
                    v-if="dialogVisible"
                    :dialogVisible="dialogVisible"
                    :data="values"
                    @change="updataDialogVisible"
                    :isEdit="isEdit"
                    />
            </template>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import { capitalAccountList, setAccountMasterCard , delCapitalAccount} from '../../../../../api/customerManagement/capitalAccount'
    import newAccountInformation from './newAccountInformation'
    export default {
        data () {
            return {
                id:'',
                list: {},
                values: {},
                dialogTitle:'',
                isEdit:false,
                dialogVisible: false,
                hasAccount: true,
                accountData: true
            }
        },
        methods: {

            getCapitalAccountList () {
                capitalAccountList({ id: this.customerInfor.id }).then(res => {
                    if (res && res.length > 0) {
                        this.list = res
                    } else {
                        this.list = []
                    }
                })
            },

            addAccountDetailsEvent () {
                this.isEdit = false
                this.dialogTitle = "新增账户信息"
                this.dialogVisible = true
                this.values = {}
            },

            editAccountEvent (item) {
                this.isEdit = true
                this.dialogVisible = true
                this.dialogTitle = "编辑账户信息"
                this.values = item
            },
            //删除银行账号信息
            delAccountEvent (item) {
                let id = item.id;
                console.log(id);
                delCapitalAccount({id : id}).then(res => {
                    
                    this.getCapitalAccountList();
                    
                })
                
            },


            setUpAccountEvent (item) {
                setAccountMasterCard({
                    associatedId: item.associatedId,
                    id: item.id
                }).then(res => {
                    this.getCapitalAccountList ()
                })
            },

            updataDialogVisible () {
                this.dialogVisible = false
                this.getCapitalAccountList ()
            }
        },

        computed: {
            ...mapState('d2admin/customer', [
                'customerInfor',
            ])
        },

        created () {
            this.$store.dispatch ('d2admin/customer/identificationLoad')
            this.$store.dispatch ('d2admin/customer/customerInformationLoad')
        },

        watch: {
            customerInfor () {
                if (this.customerInfor.id) {
                    this.getCapitalAccountList()
                }
            },

            $route (val) {
                if (val.path.indexOf('capitalAccount') !== -1) {
                    this.$store.dispatch ('d2admin/customer/customerInformationLoad')
                    this.$store.dispatch ('d2admin/customer/identificationSet', val.params.identification)
                }
            }
        },

        components: {
            'new-Account-Information': newAccountInformation,
        }
    }
</script>

<style lang = 'scss' scoped>
    .account-information-tabs-account {
        background: #fafbff;
        .account-information-tabs-account-bottom {
            height: 415px;
            overflow: auto;
            border-bottom: solid 1px #dcdddf;
            .account-information-tabs-account-bottom-count {
                border-bottom: dashed 1px #dcdddf;
                padding: 30px 50px;
                /* .el-form {
                    margin-right: 120px
                } */
                /* .set-up-btn {
                    margin-right: 40px;
                     width: 100px;
                    float: right;
                    margin-top: -150px
                } */
                    /*height: 36px; */
                /* .editbtn {
                    margin-right: 40px;
                    width: 100px;

                    float: right;
                    margin-top: -100px
                } */
            }
        }
        .operationButton {
            margin: 30px 105px 0px 0px;
                .new-account-infor-btn {
                    float: right;
                    width: 125px;
            }
        }
        .operationButtonTwo {
            padding-top:20px;
            height: 96px;
            background: #fafbff;
            border-bottom: solid 1px #dcdddf;
        }
    }
</style>
