<template>
    <div class="address-book accountant-kj">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane :label="!isOnlyShowAccount ? label1 : !isPay ? '公司付款账户' : '公司收款账户'" name="first">
                <el-table
                        border
                        class="member-table"
                        :row-class-name="tableRowClassName"
                        :data="tableData"
                        style="width: 100%">
                    <el-table-column label="" width="50" align="center">
                        <template slot-scope="scope" >
                            <div class="scope-index">
                                <span>{{scope.$index + 1}}</span>
                            </div>
                            <div class="scope-action" v-if="!isShowDetails">
                                <el-button @click="handleDelete(scope.$index, scope.row)" type="danger" icon="el-icon-minus" size="mini" circle></el-button>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column  :label="!isPay ? '公司付款账户' : '公司收款账户'" align="center" width="200">
                        <template slot-scope="scope">
                            <div v-if="!isShowDetails">
                                <el-select v-model="scope.row.name" @change="nameChange(scope.$index)" placeholder="请选择">
                                    <el-option v-for="item in nameOptions" :key="item.id" :label="item.name" :value="item.id">
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
                                <el-input v-model="scope.row.openingBank" placeholder="请输入"></el-input>
                            </div>
                            <div v-if="isShowDetails">
                                <span>{{ scope.row.openingBank }}</span>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column  label="账号" align="center">
                        <template slot-scope="scope">
                            <div v-if="!isShowDetails">
                                <el-input v-model="scope.row.account" placeholder="请输入"></el-input>
                            </div>
                            <div v-if="isShowDetails">
                                <span>{{ scope.row.account }}</span>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column :label="!isPay ? '付款金额' : '收款金额'" width="300" align="center" v-if="!isOnlyShowAccount">
                        <template slot-scope="scope">
                            <div v-if="!isShowDetails">
                                <qqt-input v-model="scope.row.money" :isShowElement="!isShowDetails" :isMoneyType='isMoneyType' :value="scope.row.money" :btnTitle="btnTitle" @input="(data) => setMoney(data, scope.$index)"></qqt-input>
                            </div>
                            <div v-if="isShowDetails">
                                <span>{{ scope.row.moneyVal }}</span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="button" v-if="!isShowDetails && addAccountingBtn">
                    <p><el-button
                            class="el-icon-plus"
                            type="text"
                            @click.prevent="addRow()">
                        添加
                    </el-button></p>
                </div>
            </el-tab-pane>
        </el-tabs>
        <div class="amount-total" v-if="!isOnlyShowAccount">
            <el-row>
                <el-col :span="4">
                    <p>{{ !isPay ? '合计支付：' : '合计收入：'}}</p>
                </el-col>
                <el-col :span="4" :offset="16">
                    <p>{{ amount }}</p>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import { getByAccountTypeListAll } from '../../../../../../api/financialManagement/staffLoan/index'
import { qqtInput } from '@/components/qqt-subassembly'
import util from '../../../../../../libs/util';
export default {
    name: 'shouldPay',
    components: {
        qqtInput
    },
    props: {
            dataInfo: {
                type: Array,
                default: () => {
                    return [{}]
                }
            },
            isShowDetails: {
                type: Boolean,
                default: true
            },
            addAccountingBtn: {
                type: Boolean,
                default: true
            },
            isPay: {
                type: Boolean,
                default: false
            },
            isOnlyShowAccount: {
                type: Boolean,
                default: false
            }
        },
    data() {
        return {
            tableData: [{
                name: '',
                money: '',
                openingBank: '',
                account: '',
            }],
            nameOptions: [],
            activeName: "first",
            label1: "公司支付账户及金额: 0元",
            isMoneyType: true,
            btnTitle: '元',
            noInput: false,
            amount: '',
        }
    },
    methods: {
        tableRowClassName({row, rowIndex}) {
            if(this.isShowDetails){
                return ''
            }
            return 'hover-row';
        },
        handleDelete(index, row) {
            this.tableData.splice(index, 1);
        },
        addRow(){
            var list = {
                name: this.name,
                money: this.money,
                openingBank: this.openingBank,
                account: this.account,
            }
            this.tableData.push(list)
        },
        getData(){
            return this.tableData
        },
        getMoney() {
            // this.$emit('change', this.tableData)
            if(this.tableData.length > 0){
                let tem = 0
                this.tableData.forEach(item => {
                    tem = Number(item.money ? item.money:'0') + Number(tem)
                })
                this.label1 = "公司支付账户及金额: " + util.moneyTransform(tem) + "元"
                this.amount = util.moneyTransform(tem)
            }
        },
        nameChange(index){
            this.nameOptions.forEach(item => {
                if(this.tableData[index].name === item.id){
                    this.tableData[index].openingBank = item.openingBank
                    this.tableData[index].account = item.account
                }
            })
        },
        getNameOptions () {
            getByAccountTypeListAll({
                accountType: '9'
            }).then(res => {
                this.nameOptions = res
            })
        },
        setData(data){
            let acc = 0
            data.forEach(item => {
                this.nameOptions.forEach(it => {
                    if(item.name === it.id) {
                        item.nameText = it.name
                    }
                })
                item.moneyVal = util.moneyTransform(item.money)
                acc =  Number(acc) + Number(item.money ? item.money:'0')
            })
            this.label1 = "公司支付账户及金额: " + util.moneyTransform(acc) + "元"
            this.amount = util.moneyTransform(acc)
            this.tableData = data
        },
        setMoney(val, index){
            this.getMoney()
        }
    },
    mounted() {
        setTimeout(() => {
            if(this.dataInfo && this.dataInfo.length > 0){
                this.setData(this.dataInfo)
            }
        }, 700)
    },
    created() {
        this.getNameOptions()
    },
    watch: {
        dataInfo(newVal, old){
            setTimeout(() => {
                if(newVal && newVal.length > 0){
                    this.setData(newVal)
                }
            }, 700)
        }
    }
}
</script>
<style lang="scss" scoped>
.accountant-kj{
    padding: 20px;
    background-color: #F4F9FF;
    position: relative;
    border-top: 1px solid #409EFF;
    .el-tabs__item{
        padding: 0px 30px;
        height: 50px;
        line-height: 50px;
        font-weight: bold;
        background-color: #FFF;
    }
    .el-tabs__item.is-active{
        background-color: #409EFF;
        color: #FFF;
    }
}
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
.amount-total{
    text-align: center;
    margin-top: 10px;
    border: 1px solid #EBEEF5;
    background: #FFF;
    .el-col{
        height: 40px;
        p{
            line-height: 40px;
            font-size: 15px;
        }
    }
}
</style>
