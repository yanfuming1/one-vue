<template>
    <d2-container>
        <template>
            <div class="other-accounts-header" slot="header">
                <el-form :inline="true" :model="form" ref="form" size="mini">
                    <el-form-item>
                    <el-button type="primary" @click="addAccountBtn">添加</el-button>
                    </el-form-item>
                    <el-form-item label prop="name">
                    <el-input v-model="form.keywords" prefix-icon="el-icon-search" placeholder="请输入需搜索的内容" style="width: 200px;" :clearable="true"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="dataSearch(true)">搜索</el-button>
                    </el-form-item>
                     <el-form-item>
                        <el-button type="info" @click="handleFormReset">    
                            重置
                        </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="deleteAll">批量删除</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <template>
                <qqt-table :data="employeeAccountsData" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange"></qqt-table>
            </template>
        
        </template>
        <el-dialog v-dialogDrag title="新建账户" :visible.sync="dialogFormVisible" :data="newAccountData">
            <el-form :model="newAccountData" :rules="rules" ref="form">
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="户名:" prop="name">
                            <el-input v-model="newAccountData.name" @input="change($event)"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset='2'>
                        <el-form-item label="开户行:" prop="openingBank">
                            <el-input v-model="newAccountData.openingBank" @input="change($event)"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="行号:" prop="onlyCoding">
                            <el-input type="onlyCoding" v-model="newAccountData.onlyCoding" autocomplete="off" @input="change($event)"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset='2'>
                        <el-form-item label="账号:" prop="account">
                            <el-input type="account" v-model="newAccountData.account" autocomplete="off" @input="change($event)"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="联系人:" prop="linkman">
                            <el-input v-model="newAccountData.linkman"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset='2'>
                        <el-form-item label="联系方式:" prop="phone">
                            <el-input v-model="newAccountData.phone"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='11'>
                        <el-form-item label="账户类型:" prop="accountType">
                            <el-input placeholder="其他账户" :disabled="true"></el-input>                          
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>      
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="newAccount('form')">保存</el-button>
                <el-button @click="cancelBuilding">取 消</el-button>
            </div>
        </el-dialog>
           <!--编辑账户弹框 -->
        <el-dialog v-dialogDrag title="编辑账户" :visible.sync="editFormVisible" :data="editAccountData">
            <el-form :model="editAccountData" :rules="rules" ref="editAccountData">
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="户名:" prop="name">
                            <el-input v-model="editAccountData.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset='2'>
                        <el-form-item label="开户行:" prop="openingBank">
                            <el-input v-model="editAccountData.openingBank"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="行号:" prop="onlyCoding">
                            <el-input type="onlyCoding" v-model="editAccountData.onlyCoding" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset='2'>
                        <el-form-item label="账号:" prop="account">
                            <el-input type="account" v-model="editAccountData.account" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="联系人:" prop="linkman">
                            <el-input v-model="editAccountData.linkman"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset='2'>
                        <el-form-item label="联系方式:" prop="phone">
                            <el-input v-model="editAccountData.phone"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='11'>
                        <el-form-item label="账户类型:" prop="accountType">
                            <el-input placeholder="其他账户" :disabled="true"></el-input>                          
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>    
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editAccount">保存</el-button>
                <el-button  @click="editFormVisible = false">取 消</el-button>
            </div>
        </el-dialog>
                        <!-- 详情 -->
        <el-dialog v-dialogDrag title="账户详情" :visible.sync="detailsdialogVisible" width="35%">
            <el-form>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="户名:">
                            {{ bankAccountDetailsData.name }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset='2'>
                        <el-form-item label="开户行:" >
                            {{ bankAccountDetailsData.openingBank }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="行号:" >
                            {{ bankAccountDetailsData.onlyCoding }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset='2'>
                        <el-form-item label="账号:" >
                            {{ bankAccountDetailsData.account }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="联系人:" >
                            {{ bankAccountDetailsData.linkman }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset='2'>
                        <el-form-item label="联系方式:"  >
                            {{ bankAccountDetailsData.phone }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='11'>
                        <el-form-item label="账户类型:" >
                            {{ bankAccountDetailsData.accountType }}
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>  
            <div slot="footer" class="dialog-footer">
                <el-button  @click="detailsdialogVisible = false">取 消</el-button>
            </div>
        </el-dialog>
  </d2-container>
</template>

<script>
import { CompanyEmployeeAccount, CompanyEmployeeAccountDelete, CompanyEmployeeAccountDeleteAll, addCompanyEmployeeAccount, editAccountData, getCompanyEmployeeAccountById} 
from "../../../../api/system/bankAccountSettings/CompanyEmployeeAccount";
import * as elValudate from "../components/dataValidation" 
import * as elValudateBank from "../components/bankNumber" 
import * as elValudateCodings from "../components/onlyCodings" 
let that = this;
export default {
    data() {
        return {
            detailsdialogVisible:false,
            bankAccountPathParameters:'',
            bankAccountDetailsData:[],
            rules: {
                name: [{ required: true, message: "请输入户名", trigger: ["blur",'change'] }],
                openingBank: [{ required: true, message: "请输入开户行", trigger:  ["blur",'change'] }],
                account: [
                    { required: true, validator:elValudateBank.bankNumbers, message: '请输入正确的银行账号',  trigger:  ["blur",'change']}
                ],
                onlyCoding: [
                    { validator:elValudateCodings.onlyCodings,message: '请输入正确的行号', trigger:  ["blur",'change']}
                ],
                linkman: [{ required: true, message: "请输入联系人", trigger: ["blur",'change'] }],
                phone: [{validator:elValudate.contactInformation, required: true, message: "请输入正确的联系方式", trigger:  ["blur",'change'] }],
                accountType: [{required: true, message: "请选择开户行类型",   trigger: 'change'}]
            },
            employeeAccountsData: {},
            form: {
                keywords: '',
                bstatus: '',
            },
            value: "",
            delItem: {
              id: ""
            },
            multipleSelection: [],
            searchData:'',
            dialogFormVisible: false,
            editFormVisible:false,
            formLabelWidth: "120px",
            isDetail: true,
            newAccountData: {
               onlyCoding: '',
               accountType:'8'
            },
            editAccountData: {
                accountType:'8'
            },
            pageNo: 0,
            loading: false,
            page: {
                current: 1,
                size: 10,
                total: 0
            },
            dynamicHeader: {
                tableId: 'T_1095175731',
                isSave: true
            },
            rowHeader: [
                {
                    prop: "name",
                    label: "户名",
                    isShow: true,
                    render: (h, params) => {
                        return h('div',{
                            on: {click: () => {
                                this.employeeAccountStatus = params.row
                                getCompanyEmployeeAccountById ({'id': params.row.id}).then (res => {
                                    if (res) {
                                        this.detailsdialogVisible = true
                                        this.bankAccountDetailsData = res
                                        switch(this.bankAccountDetailsData.onlyCoding) {
                                            case '': this.bankAccountDetailsData.onlyCoding = '无'
                                                break
                                            case null: this.bankAccountDetailsData.onlyCoding = '无'
                                                break
                                        }
                                        this.bankAccountDetailsData.accountType = '其他账户'
                                    }
                                })
                                } 
                            }
                        },[
                            h ('div', {
                                class :{
                                    'typefaceColor' : true,
                                }
                            },params.row.name)
                        ])
                    }
                },
                {
                    prop: "openingBank",
                    label: "开户行",
                    isShow: true
                },
                {
                    prop: "account",
                    label: "账号",
                    isShow: true
                },
                {
                    prop: "onlyCoding",
                    label: "行号",
                    isShow: true
                },
                {
                    prop: "createdBy",
                    label: "设置人",
                    isShow: true
                },
                {
                    prop: "createdTime",
                    label: "设置时间",
                    isShow: true
                },
                {
                    prop: "",
                    label: "操作",
                    isShow: true,
                    render:(h, params) => {
                        return [
                            h("el-button",{
                                props: {
                                    type: "text"
                                },
                                on: {
                                    click: (index, row) => {
                                        this.getCompanyEmployeeAccount (params.row.id)
                                    }
                                }
                            },"编辑"),
                            h("el-button",{
                                props: {
                                    type: "text"
                                },
                                on: {
                                    click: () => {
                                        that.delItem.id = params.row.id;
                                        CompanyEmployeeAccountDelete({ id: params.row.id })
                                        this.$confirm('此操作将永久删除该员工账户, 是否继续?', '提示', {
                                            confirmButtonText: '确定',
                                            cancelButtonText: '取消',
                                            cancelButtonClass: "btn-custom-cancel",
                                            type: 'warning'
                                        }).then(res => {
                                            this.employeeAccounts();
                                            this.$message({
                                                type: 'success',
                                                message: '删除成功!'
                                            });
                                        }).catch(err => {
                                            this.$message({
                                                type: 'info',
                                                message: '已取消删除'
                                            });          
                                        });
                                    }
                                }
                            },"删除"),
                        ];
                    },
                },
              ],
            tableOption: {
                border: false
            }
        };
    },

    methods: {
        // 添加账户清除文本框数据
        addAccountBtn(){
            this.dialogFormVisible = true
        },

        // 取消新建账户
        cancelBuilding() {
            this.dialogFormVisible = false 
            this.$refs.form.resetFields()
        },

        // 初始化加载数据
        employeeAccounts(form, isRestore = false, bstatus) {
            if (isRestore) {
              this.page.current = 1;
            }
            let that = this;
            CompanyEmployeeAccount({
                accountType:8,
                pageNo: this.page.current,
                pageSize: this.page.size,
                name: this.form.keywords
            }).then(res => {
                that.employeeAccountsData = res.total > 0 ? res : {};
                res.records.forEach(item => {
                    switch(item.onlyCoding) {
                    case '': item.onlyCoding = '无'
                        break
                    case null: item.onlyCoding = '无'
                        break
                    }
                })
            })
        },

        getCompanyEmployeeAccount (id) {
            getCompanyEmployeeAccountById ({'id': id}).then (res => {
                if (res) {
                    this.editFormVisible = true
                    this.editAccountData = res
                }
            })
        },

        dataSearch() {
            this.employeeAccounts ( )
        },
        newAccount() {
            let that = this;
            addCompanyEmployeeAccount(
                that.newAccountData
            ).then(res => {
                this.employeeAccounts();
                this.dialogFormVisible = false
                this.$refs.form.resetFields()
            })
        },
        // 编辑银行账户
        editAccount(){
            let temp = this.editAccountData
            if (this.editAccountData.name === '' || this.editAccountData.openingBank === '' || this.editAccountData.account === '' ||
                this.editAccountData.phone === '' || this.editAccountData.accountType === '' ) {
                this.$message.warning("请输入必填内容")
            } else {
                editAccountData(
                    temp
                ).then(res => {
                    that.$message.success("修改成功")
                    this.employeeAccounts();
                    that.editFormVisible = false
                    console.log(temp)
                }).catch(err => {
                    this.$messag.err("修改失败");          
                })
            }
        }, 
        // 复选框选中的数据
        selectChange(val) {
            this.multipleSelection = val;
        },

        // 批量删除复选框中选中的数据
        deleteAll() {
            let str = "";
            if (this.multipleSelection && this.multipleSelection.length > 0) {
                this.multipleSelection.forEach(res => {
                    str += res.id + ",";
                });
                CompanyEmployeeAccountDeleteAll({
                    ids: str.substring(0, str.length - 1)
                })
                this.$confirm('此操作将永久删除选中的员工账户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    cancelButtonClass: "btn-custom-cancel",
                    type: 'warning'
                }).then(res => {
                    this.employeeAccounts();
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(err => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            }
        },

        // 分页变化改动
        handlePaginationChange(val) {
            this.page = val;
            this.$nextTick(() => {
                this.employeeAccounts();
            });
        },

        handleFormReset(isRestore = false) {
            this.form.keywords = ''
            this.form.bstatus = ''
            this.employeeAccounts()
            this.$emit('submit', this.form, isRestore)
        },
        change (e) {
            this.$forceUpdate()
        }
    },
    components: {
        qqtTable: () => import("../../../../components/qqt-subassembly/qqt-table/qqt-table"),
    },
    mounted() {
        this.employeeAccounts();
        this.handleFormReset();
        that = this;
    }
};
</script>

<style lang="scss">
.other-accounts-header{
    margin-bottom: -25px
}
</style>
