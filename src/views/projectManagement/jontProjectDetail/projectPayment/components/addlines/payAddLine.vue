<template>
    <div>
        <el-table
                border
                class="member-table"
                :row-class-name="tableRowClassName"
                :data="tableData"
                style="width: 100%">
            <el-table-column label="序号" width="50" align="center">
                <template slot-scope="scope">   
                    <div class="scope-index">
                        <span>{{scope.$index + 1}}</span>
                    </div>
                    <div class="scope-action" v-if="!isShowDetails">
                        <el-button @click="handleDelete(scope.$index, scope.row)" type="danger" icon="el-icon-minus" size="mini" circle></el-button>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="支付金额" width="200" align="center">
                <template slot-scope="scope">
                    <div v-if="!isShowDetails || fromKJ">
                        <qqt-input :isMoneyType='isMoneyType' :ref="'input' + scope.$index" :placeholder="placeholder" :size="'medium'" v-model="scope.row.money" :btnTitle="btnTitle" @input="(data) => getMoney(data, scope.$index)"></qqt-input>
                    </div>
                    <div v-if="isShowDetails && !fromKJ">
                        <span>{{ scope.row.money }}</span>
                    </div>
                </template>
            </el-table-column>

            <el-table-column  label="收款方户名" align="center" width="200">
                <template slot-scope="scope">
                    <div v-if="!isShowDetails">
                        <el-select v-model="scope.row.name" allow-create clearable filterable size="medium" @change="nameChange(scope.$index)" placeholder="请选择">
                            <el-option v-for="item in nameOptions" :key="item.id" :label="item.name" :value="item.id">
                                <span style="margin-right: 10px;">{{ item.name }}</span>
                                <span style="float:right; color: #8492a6; font-size: 13px; line-height:35px;">{{ item.account }}</span>
                            </el-option>
                        </el-select>
                    </div>
                    <div v-if="isShowDetails">
                        <span>{{ scope.row.nameText }}</span>
                    </div>
                </template>
            </el-table-column>

            <el-table-column  label="开户行" align="center">
                <template slot-scope="scope">
                    <div v-if="!isShowDetails">
                        <el-input v-model="scope.row.openingBank" size="medium" @input="(data) => valueChange(data, scope.$index)" placeholder="请输入"></el-input>
                    </div>
                    <div v-if="isShowDetails">
                        <span>{{ scope.row.openingBank }}</span>
                    </div>
                </template>
            </el-table-column>

            <el-table-column  label="账号" align="center">
                <template slot-scope="scope">
                    <div v-if="!isShowDetails">
                        <el-input v-model="scope.row.account" size="medium" @input="(data) => valueChange1(data, scope.$index)" placeholder="请输入">
                            <el-button type="primary" slot="append" @click="accountFun(scope.$index)">
                                收藏
                            </el-button>
                        </el-input>
                    </div>
                    <div v-if="isShowDetails">
                        <span>{{ scope.row.account }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column  label="账户类型" align="center" width="250">
                <template slot-scope="scope">
                    <div v-if="!isShowDetails">
                        <el-select v-model="scope.row.untitled" @change="(data) => valueChange(data, scope.$index)" size="medium" placeholder="请选择">
                            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div v-if="isShowDetails">
                        <span>{{ scope.row.accountsTypeName }}</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="button" v-if="!isShowDetails">
            <p><el-button
                    class="el-icon-plus"
                    type="text"
                    @click.prevent="addRow()">
                添加
            </el-button></p>
        </div>
        <bank-dialog :bankTypeShow="bankTypeShow" @bankDialogClose="bankDialogClose" :parentList="parentList" :formData="bankSelectForm"></bank-dialog>
    </div>
</template>
<script>
import bankDialog from '../../../../../approval/components/pushPage/components/bankDialog';
import { getByAccountTypeListAll,getByAccountByAssociatedId, getByAccountExceptUserAccount } from '../../../../../../api/financialManagement/staffLoan/index'
import {queryByParentId,queryByAccount} from "../../../../../../api/financialManagement/staffLoan";
import { qqtInput } from '@/components/qqt-subassembly'
import util from '../../../../../../libs/util';
export default {
    name: 'shouldPay',
    components:{
        qqtInput,
        bankDialog,
    },
    props: {
            dataInfo: {
                type: Array,
                default: [{}]
            },
            isShowDetails: {
                type: Boolean,
                default: true
            },
            associatedPersonId: {
                type: String,
                default: ''
            },
            fromKJ: {
                type: Boolean,
                default: false
            }
        },
        data() { 
            return {
                isMoneyType: true,
                btnTitle: '元',
                placeholder: '请输入',
                nameOptions: [],
                tableData: [{
                    name: '',
                    money: '0',
                    openingBank: '',
                    account: '',
                    untitled: '',
                    nameId: '',
                }],
                typeOptions: [
                    {
                        value:'1',
                        label:'公司员工账户',
                    },{
                        value:'2',
                        label:'联营人账户',
                    },{
                        value:'3',
                        label:'公共资源交易中心账户',
                    },{
                        value:'4',
                        label:'物资设备供应商账户',
                    },{
                        value:'5',
                        label:'业主付款账户',
                    },{
                        value:'7',
                        label:'劳务分包商账户',
                    },{
                        value:'8',
                        label:'其他账户',
                    },{
                        value:'9',
                        label:'公司账户',
                    },
                ],
                bankTypeShow: false,
                parentList:[],
                bankSelectForm: {},
            }
        },
        methods: {
            tableRowClassName({row, rowIndex}) {
                return 'hover-row';
            },
            handleDelete(index, row) {
                this.tableData.splice(index, 1);
            },
            addRow(){
                var list = {
                    name: '',
                    money: '0',
                    openingBank: '',
                    account: '',
                    untitled: '',
                    nameId: ''
                }
                this.tableData.push(list)
            },
            getData(){
                return this.tableData
            },
            getMoney(data, index) {
                this.$emit('change', this.tableData, index)
            },
            nameChange(index){
                let choseItem = this.nameOptions.find(ele => ele.id === this.tableData[index].name)
                if (choseItem) {
                    this.tableData[index].openingBank = choseItem.openingBank
                    this.tableData[index].account = choseItem.account
                    this.tableData[index].untitled = choseItem.accountType
                    this.tableData[index]['nameText'] = choseItem.name
                    if (this.tableData[index]['money'] == 'undefined') this.tableData[index]['money'] = '0'
                } else {
                    this.tableData[index]['nameText'] = ''
                    this.tableData[index].openingBank = ''
                    this.tableData[index].account = ''
                    this.tableData[index].untitled = ''
                    if (this.tableData[index]['money'] == 'undefined') this.tableData[index]['money'] = '0'
                }
            },
            valueChange (val, index) {
                this.$set(this.tableData, index, this.tableData[index])
            },
            valueChange1 (val, index) {
                this.$set(this.tableData, index, this.tableData[index])
            },
            resetData(data){
                data.forEach((item, index) => {
                    this.typeOptions.forEach(it => {
                        if(item.untitled === it.value) {
                            item.accountsTypeName = it.label
                        }
                    })
                    let choseItem = this.nameOptions.find(it => item.name === it.id)
                    if (choseItem) {
                        item.nameText = choseItem.name
                    } else {
                        item.nameText = item.name
                    }
                    item.money += ''
                    if (this.$refs['input' + index] && item.money == '') this.$refs['input' + index].reset ()
                })
                this.tableData = data
            },
            getNameOptions (id) {
                if(util.isDef(id) && id !== ''){
                    getByAccountExceptUserAccount().then(res => {
                        this.nameOptions = res
                        if(this.dataInfo && this.dataInfo.length > 0){
                            this.resetData(this.dataInfo)
                        }
                    })
                }
            },
            // 收藏
            accountFun (index) {
                let choseItem = {
                    name : this.tableData[index].nameText === undefined || this.tableData[index].nameText === "" ? 
                            this.tableData[index].name : this.tableData[index].nameText,
                    openingBank : this.tableData[index].openingBank,
                    account : this.tableData[index].account,
                }

                if (choseItem.name && choseItem.openingBank && choseItem.account) {
                    this.gtAccount(choseItem.account).then(res => {
                        if (res) {
                            queryByParentId().then(data=> {
                                this.parentList = data;
                                if (data.length > 0) {
                                    // let data = this.selectData.find(element => element.id === this.formInline.name);
                                    this.bankSelectForm = choseItem
                                    this.bankTypeShow = true;
                                } else {
                                    this.$message.error('请先维护银行账户类型')
                                }
                            })
                        }
                    })
                } else {
                    this.$message.error('账户信息未补充完整')
                }
            },
            gtAccount (params) {
                return new Promise((resolve, reject) => {
                    queryByAccount ({'account':params}).then(res => {
                        if (res.success) {
                            resolve (true)
                        } else {
                            this.$message.error(res.message)
                            resolve (false)
                        }
                    })
                })
            },
            bankDialogClose () {
                this.bankTypeShow = false;
            },
        },
        mounted() {
            this.getNameOptions(this.associatedPersonId)
        },
        created() {
            // 收款方
        },
        watch: {
            dataInfo: {
                handler:function(val,oldval){
                    if(val && val.length > 0){
                        this.resetData(val)
                    }
                },
                deep:true,
                immediate: true,
            },
            associatedPersonId(newVal, old){
                this.getNameOptions(newVal)
            }
        }
}
</script>
<style lang="scss" scoped>
.member-table{
     .el-table__empty-block{
        display: none;
    }
    .scope-action{
        display: none;
    }
    .scope-index{
        display: block;
    }
    .hover-row:hover{
        .scope-action{
            display: block;
            .el-button{
                padding: 3px;
            }
        }
        .scope-index{
            display: none;
        }
    }
}
</style>