<template>
<div>
    <div class="add-line-div">
        <el-table
                border
                class="member-table"
                :row-class-name="tableRowClassName"
                :data="tableData"
                style="width: 100%">
            <el-table-column label="序号" width="50" align="center">
                <template slot-scope="scope" >
                    <div class="scope-index">
                        <span>{{scope.$index + 1}}</span>
                    </div>
                    <div class="scope-action" v-if="!isShowDetails">
                        <el-button @click="handleDelete(scope.$index, scope.row)" type="danger" icon="el-icon-minus" size="mini" circle></el-button>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="收款方户名" width="200" align="center">
                <template slot-scope="scope">
                    <el-select v-if="!isShowDetails" v-model="scope.row.accountCreditedId" allow-create clearable filterable default-first-option placeholder="请选择" @change="(data) => selectAccount(data,scope.$index)">
                        <el-option v-for="item in accountList" :key="item.id" :label="item.name" :value="item.id">
                            <span style="margin-right: 10px;">{{ item.name }}</span>
                            <span style="float:right; color: #8492a6; font-size: 13px; line-height:35px;">{{ item.account }}</span>
                        </el-option>
                    </el-select>
                    <el-input v-if="isShowDetails" size="medium" v-model="scope.row.accountCredited" disabled ></el-input>
                </template>
            </el-table-column>
            <el-table-column label="开户行" width="200" align="center">
                <template slot-scope="scope">
                    <qqt-input :size="size" v-model="scope.row.openingBank" :isShowElement="!isShowDetails" :value="scope.row.openingBank" ></qqt-input>
                </template>
            </el-table-column>
            <el-table-column label="账号" width="300" align="center">
                <template slot-scope="scope">
                    <qqt-input v-if="!isShowDetails" :size="size" :btnTitle="btnTitle" v-model="scope.row.account" :isShowElement="!isShowDetails" @btnClick="accountFun(scope.$index)" :value="scope.row.openingBank"></qqt-input>
                    <el-input v-if="isShowDetails" disabled v-model="scope.row.account"></el-input>
                </template>
            </el-table-column>
            <el-table-column  label="支付金额" align="center" width="200">
                <template slot-scope="scope">
                    <qqt-input :size="size" v-model="scope.row.paymentAmount" :isShowElement="!isShowDetails" :isMoneyType="isMoney" :value="scope.row.paymentAmount" :btnTitle="'元'" @blur="(data) => getMoney(data, scope.$index)"></qqt-input>
                </template>
            </el-table-column>
            <el-table-column label="纳税人识别号" width="300" align="center">
                <template slot-scope="scope">
                    <qqt-input :size="size" v-model="scope.row.identificationNumber" :isShowElement="!isShowDetails" :value="scope.row.identificationNumber" ></qqt-input>
                </template>
            </el-table-column>
            <el-table-column label="账户类型" width="200" align="center">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.accountType" :disabled="isShowDetails" placeholder="请选择">
                        <el-option v-for="item in accountType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="账户性质" width="200" align="center">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.natureAccount" :disabled="isShowDetails" placeholder="请选择">
                        <el-option v-for="item in natureAccount" :key="item.name" :label="item.name" :value="item.name"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="票据类型" width="200" align="center">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.instrumentType" :disabled="isShowDetails" placeholder="请选择">
                        <el-option v-for="item in instrumentType" :key="item.name" :label="item.name" :value="item.name"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column  label="货物或应税劳务、服务名称" width="300" align="center">
                <template slot-scope="scope">
                    <qqt-input :size="size" v-model="scope.row.commodityBreakdown" :isShowElement="!isShowDetails" :value="scope.row.commodityBreakdown" ></qqt-input>
                </template>
            </el-table-column>
        </el-table>
        <div class="button" v-if="!isShowDetails">
            <p><el-button
                    class="el-icon-plus"
                    type="text"
                    size="medium"
                    @click.prevent="addRow()">
                添加
            </el-button></p>
        </div>
    </div>
</div>
</template>
<script>
import { qqtInput } from '@/components/qqt-subassembly'
import util from '../../../../../libs/util'
import { getByAccountTypeListAll, } from '../../../../../api/jointProject/index'
import { agentBusinessBankAccount } from '../../../../../api/jointProject/agentBusinessManagement/index'
import { queryDicById } from '../../../../../api/system/dic/dic'
import { FINANCE } from '@/enum/DICTIONARY'
export default {
    name: 'shouldPay',
    components: {
        qqtInput
    },
    props: {
            dataInfo: {
                type: Object,
                default: () => {
                    return {}
                }
            },
            isShowDetails: {
                type: Boolean,
                default: true
            }
        },
    data() {
        return {
            btnTitle: '收藏',
            tableData: [{
                accountCreditedId: '',
                openingBank: '',
                account: '',
                paymentAmount: '0',
                identificationNumber: '',
                accountType: '',
                natureAccount: '',
                instrumentType: '',
                commodityBreakdown: '',
            }],
            size: 'medium',
            isMoney: true,
            isShowElement: false,
            form: {
                totalAmount: '',
                bigWriteCharge: '',
            },
            accountList: [],
            accountType:  [
                { value: '1', label: '个人账户'},
                { value: '2', label: '公司账户'},
                { value: '3', label: '社会团体'},
                { value: '4', label: '公共事业'},
                { value: '5', label: '其他'}
            ],
            natureAccount: [],
            instrumentType: [],
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
            this.getMoney()
        },
        addRow(){
            var list = {
                accountCreditedId: this.accountCreditedId,
                openingBank: this.openingBank,
                account: this.account,
                paymentAmount: this.paymentAmount,
                identificationNumber: this.identificationNumber,
                accountType: this.accountType,
                natureAccount: this.natureAccount,
                instrumentType: this.instrumentType,
                commodityBreakdown: this.commodityBreakdown,
            }
            this.tableData.push(list)
        },
        selectAccount(data, index){
            let choseItem = this.accountList.find(el => el.id === data)
            if (choseItem) {
                this.tableData[index].accountCredited = choseItem.name
                this.tableData[index].openingBank = choseItem.openingBank
                this.tableData[index].account = choseItem.account
                this.tableData[index].identificationNumber = choseItem.identificationNumber === '' || choseItem.identificationNumber === undefined 
                            ? choseItem.untitled1 : choseItem.identificationNumber
            } else {
                this.tableData[index].accountCredited = data
                this.tableData[index].openingBank = ''
                this.tableData[index].account = ''
                this.tableData[index].identificationNumber = ''
            }
        },
        getData(){
            let dataArr = []
            if(this.tableData[0].accountCreditedId === undefined){
                dataArr = []
            } else {
                dataArr = this.tableData
            }
            dataArr.map(item => {
                item.paymentAmount = Number(item.paymentAmount).toFixed(2)
            })
            // item.money = Number(item.money).toFixed(2)
            return {
                tableData: dataArr
            }
        },
        getMoney(data, index) {
            this.$emit('change', this.tableData, index)
        },
        setData(data){
            if(data.tableData[0].accountCreditedId !== undefined) {
                data.tableData.forEach(item => {
                    item.paymentAmount += ''
                })
                this.tableData = data.tableData
            }
        },
        accountFun (index) {
            let choseItem = {
                name : this.tableData[index].accountCredited,
                openingBank : this.tableData[index].openingBank,
                account : this.tableData[index].account,
            }
            agentBusinessBankAccount(choseItem).then(res => {
                this.$message.success(res.message)
            })
        }
    },
    created(){
        queryDicById({id: '1189496782174818304'}).then(res => {
            this.instrumentType = res
        })
        queryDicById({id: FINANCE.NATUREACCOUNT}).then(res => {
            this.natureAccount = res
        })
        getByAccountTypeListAll({accountType: '4'}).then(res => {
            this.accountList = res
        })
    },
    mounted() {
        this.setData(this.dataInfo)
    },
    watch: {
        dataInfo:{
            deep: true,
            immediate: true,
            handler(newVal, old){
                this.setData(newVal)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.add-line-div{
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
}
.add-form{
    margin-top: 10px;
}
</style>
