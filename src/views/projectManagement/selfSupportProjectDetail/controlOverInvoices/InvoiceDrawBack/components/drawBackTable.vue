<template>
    <div class="add_invoice_lines">
        <el-divider content-position="left">
            <div class="generate-from-divider___line"></div>
                发票退税记录
        </el-divider>
            <el-table
                :data="drawbackOrder"
                stripe
                style="width: 100%;"
                >
             <el-table-column align="center"  width="60" label="序号">
                <template slot-scope="scope" >
                    <div >
                    <span >{{scope.$index + 1}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="procCode" label="退税编号" min-width="150px">
                 
            </el-table-column>
            <el-table-column prop="drawbackThis" label="本次退税金额" width="150px">
               
            </el-table-column>
            <el-table-column prop="drawbackCumsum" label="累计退税金额" width="150px">

            </el-table-column>
            <el-table-column prop="payeeName" label="收款人户名" width="150px">

            </el-table-column>
            <el-table-column prop="payeeBank" label="开户行" width="150px">

            </el-table-column>
            <el-table-column prop="payeeAccount" label="账户" width="150px">
                
            </el-table-column>
             <el-table-column prop="createName" label="申请人" min-width="150px">
                
            </el-table-column>
             <el-table-column prop="createTime" label="申请时间" min-width="150px">
               
            </el-table-column>
             <el-table-column prop="remark" label="备注" min-width="200px">
             </el-table-column>
                
        </el-table>
        <!-- v-if="!isShowDetails" -->
        <el-form :rules="formData.rules" :model="formData"  ref="formDom" class="demo-ruleForm d2-mt-20" >
            <el-divider content-position="left">
                <div class="generate-from-divider___line"></div>
                本次退税     <span style="margin-left:200px;font-size:18px;color:#00B050">可退税金额上限 {{drawbackLimitMoney}}（元）</span>
                <span style="margin-left:20px;font-size:18px;color:#00B050">已累计退税金额 {{drawbackCumsumMoney}}（元）</span>
            </el-divider>
            <el-table
                :data="formData.materialAddlines"
                border
                style="width: 100%;">
                <el-table-column align="center"  width="60" label="序号">
                    <template slot-scope="scope" >
                        <div >
                        <span >{{scope.$index + 1}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="退税编号" min-width="150px">
                    <template slot-scope="scope">
                        <el-form-item :prop="'materialAddlines.' + scope.$index + '.procCode'" >
                            <el-input :disabled="true" size="small" :class="{'isShowDetails':isShowDetails}" v-model="scope.row.procCode"  placeholder="自动生成"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column prop="money1" label="本次退税金额" width="150px">
                    <template slot-scope="scope">
                        <el-form-item :prop="'materialAddlines.' + scope.$index + '.drawbackThis'" :rules='formData.rules.required'>
                            <!-- <el-input type="number"  :max="100" size="small" :class="{'isShowDetails':isShowDetails}" :disabled="toggle"  v-model="scope.row.drawbackThis" :min="0" @blur="money1Change($event,scope.row)"  >
                            </el-input> -->
                            <el-input-number size="small" :disabled="isShowDetails"  v-model="scope.row.drawbackThis" :min="0" :max="getMax()"  @blur="money1Change($event,scope.row)"  label="描述文字"></el-input-number>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column prop="money2" label="累计退税金额" width="150px">
                    <template slot-scope="scope">
                        <el-form-item :prop="'materialAddlines.' + scope.$index + '.drawbackCumsum'" >
                            <el-input  size="small" :disabled="true" v-model="scope.row.drawbackCumsum" :min="0" placeholder="自动生成">
                            </el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column prop="money2" label="收款人户名" width="150px">
                    <template slot-scope="scope">
                        <el-form-item :prop="'materialAddlines.' + scope.$index + '.payeeName'"  :rules='formData.rules.required'>
                            <el-input  :disabled="isShowDetails" size="small"  v-model="scope.row.payeeName" :min="0" >
                            </el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column prop="money2" label="开户行" width="150px">
                    <template slot-scope="scope">
                        <el-form-item :prop="'materialAddlines.' + scope.$index + '.payeeBank'"  :rules='formData.rules.required'>
                            <el-input :disabled="isShowDetails"  size="small"  v-model="scope.row.payeeBank" :min="0" >
                            </el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column prop="money2" label="账户" width="150px">
                    <template slot-scope="scope">
                        <el-form-item :prop="'materialAddlines.' + scope.$index + '.payeeAccount'"  :rules='formData.rules.required'>
                            <el-input :disabled="isShowDetails" size="small"  v-model="scope.row.payeeAccount" :min="0" >
                            </el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="申请人" min-width="150px">
                    <template slot-scope="scope">
                        <el-form-item :prop="'materialAddlines.' + scope.$index + '.createName'" >
                            <el-input :disabled="true" size="small" :class="{'isShowDetails':isShowDetails}" v-model="scope.row.createName"  placeholder="自动生成"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="申请时间" min-width="150px">
                    <template slot-scope="scope">
                        <el-form-item :prop="'materialAddlines.' + scope.$index + '.createTime'" >
                            <el-input :disabled="true" size="small" :class="{'isShowDetails':isShowDetails}" v-model="scope.row.createTime"  placeholder="自动生成"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="备注" min-width="200px">
                    <template slot-scope="scope">
                        <el-form-item :prop="'materialAddlines.' + scope.$index + '.remark'" >
                            <el-input :disabled="isShowDetails" size="small" :class="{'isShowDetails':isShowDetails}" v-model="scope.row.remark"  placeholder="请输入"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
            </el-table>
    </el-form>
        
    </div>
</template>
<script>
import util from '@/libs/util.js';
import {queryDicById} from '@/api/jointProject/index';
export default {
    name:'addTable',
    props: {
      
        isShowDetails: {
            type: Boolean,
        },
        invoiceDrawbackList: {
            type:  Array,
            default: ()=>{
                return []
            }
        },
        addinvoiceDrawbackList: {
            type:  Object,
            default: ()=>{
                return {}
            }
        },
        totalTax : {
            type: Number,
        },
        invoiceId: {
            type: String,
        },
        drawbackLimit: {
            type: [String,Number],
        },
        drawbackCumsum: {
            type: [String,Number],
        },
        drawbackId : {
            type: String,
            default: ()=>{
                return ''
            }
        }
    },
    data() {
        var validatorMoney = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('单价不能为空'));
            } else {
                if (Number(value) > 0) {
                callback();
                } else {
                return callback(new Error('单价至少大于0'));
                }
            }
        };
        return {
            formData:{
                rules:{
                    validatorMoney:{
                      validator: validatorMoney, trigger: ["blur","change"]
                    },
                    required:{ 
                        required:true,
                        message:"该字段不能为空",
                        trigger: ["blur","change"]
                    },
                    isNumber:{ 
                        type:"number",
                        required:true,
                        message:"必须为数字值",
                        trigger:"change"
                    },
                },
                 materialAddlines:[{
                    id:'',
                    procCode: '',
                    drawbackThis: '',
                    drawbackCumsum: '',
                    payeeAccount: '',
                    payeeBank: '',
                    payeeName: '',
                    createName: util.cookies.get ('username'),
                    createTime: '',
                    remark: '',
                }],
              
                totalAmount: 0,
                totalTax: 0,
                amountInWords: '',
                amountInFiguers: ''
            },
            toggle:false,
            drawbackData : {},
            tableData: [],
            totalLine: {
                paymoney: '',
                daxie: '',
            },
            drawbackOrder: [],
            drawbackLimitMoney: 0,
            drawbackCumsumMoney: 0,
        }
    },
    methods:{
        money1Change (e,row) {
            row.drawbackThis ? row.drawbackThis =  Number(row.drawbackThis).toFixed(2)  :  row.drawbackThis
            let num  = Number(row.drawbackThis) + Number(row.drawbackCumsum)
            num > this.totalTax ?  row.drawbackThis = (this.totalTax - row.drawbackCumsum).toFixed(2) : row.drawbackThis = row.drawbackThis
           
        },
        getMax () {
            if (!this.isShowDetails) {
                 let total = util.subtraction (this.drawbackLimitMoney, this.drawbackCumsumMoney)
                return total
            }
        },
        getData () {  //保存
            let item = {}
            this.$refs.formDom.validate(valid => {
                if (valid) {
                    item = {
                        procCode: this.formData.materialAddlines[0].procCode,
                        drawbackThis: this.formData.materialAddlines[0].drawbackThis,
                        drawbackCumsum: this.formData.materialAddlines[0].drawbackCumsum || "0.00",
                        payeeAccount: this.formData.materialAddlines[0].payeeAccount,
                        payeeBank: this.formData.materialAddlines[0].payeeBank,
                        payeeName: this.formData.materialAddlines[0].payeeName,
                        createName: util.cookies.get ('username'),
                        createTime: '',
                        remark: this.formData.materialAddlines[0].remark,
                        invoiceId: this.invoiceId, 
                        id: this.drawbackId
                    }
                } else {
                    item = false
                }
            })
            return item
        },
      

    },

    watch:{
        invoiceDrawbackList:{
            immediate:true,
            handler (value) {
                let data = []
                if (value ) {
                    this.drawbackOrder = JSON.parse(JSON.stringify(value));
                    let total = 0;
                    data =  this.drawbackOrder;
                    // for (let i = 0; i < data.length; i++) {
                    //     total += data[i].drawbackThis
                    //     data[i].drawbackThis = data[i].drawbackThis.toFixed(2) || '0.00'
                    //     data[i].drawbackCumsum = data[i].drawbackCumsum.toFixed(2) || '0.00'
                    // }
                    // console.log(total)
                    // this.formData.materialAddlines[0].drawbackCumsum = total || '0.00';
                    // let num =  Number(this.totalTax).toFixed(2) - total.toFixed(2)
                    // if (num < 0) {
                    //     this.toggle = true
                    //     this.$message.warning ('累计退税金额已超过可退税税额！')
                    // } else {
                    //     this.toggle = false

                    // }
                    // this.totalLine.daxie = util.convertCurrency(this.totalLine.paymoney);
                } else {
                    this.drawbackOrder = data;
                }
            },
        },
        addinvoiceDrawbackList:{
            immediate:true,
            deep:true,
            handler (value) {
                this.formData.materialAddlines = [{...value}];
            }
        },
        drawbackLimit:{
            immediate:true,
            deep:true,
            handler (value) {
                this.drawbackLimitMoney = value;
            }
        },
        drawbackCumsum:{
            immediate:true,
            deep:true,
            handler (value) {
                this.drawbackCumsumMoney = value;
            }
        },
    },

    mounted () {
    //   console.log(this.invoiceId)
    //   console.log(this.in)
    },
    
    created () {
    //    console.log(this.invoiceDrawbackList)
       this.drawbackOrder = this.invoiceDrawbackList
    },

    updated () {
       
    }
}
</script>

<style lang="scss">
    .add_invoice_lines {
        .el-input-number--small .el-input__inner{
            padding: 0  15px;
        }
       .el-form-item__label {
            color: $color-border-1;
        }
        .d2-mt-20 {
            margin-top: 0px !important;
        }
        .el-table td, .el-table th {
            padding: 6px 0;
        }
        .el-table {
            color: $color-info;
        }
        .el-table .cell {
            color: $color-info;
        }
        .el-table--border {
            // border-bottom: 1px solid $color-border-1;
        }
        .el-table td, .el-table th.is-leaf {
            // border: 1px solid $color-border-1;
            // border-bottom: 1px solid $color-info;
        }
        .el-form-item {
            margin-bottom: 16px;
        }
        .el-form-item__content{
            .el-input-number{
            span {
                display: none;
            }
            .el-input__inner{
                text-align: left
            }
            }
            .ivu-input-number{
            height: 40px;
            line-height: 40px;
            .ivu-input-number-handler-wrap{
                display: none
            }
            .ivu-input-number-input-wrap{
                height: 40px;
                input{
                height: 40px;
                padding: 0 15px;
                line-height: 40px;
                font-size: 14px;
                }
            }
            .ivu-input-number-disabled .ivu-input-number-input{
                background-color: #F5F7FA;
            }
            }
        }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none;
        }
        input[type="number"]{
            -moz-appearance: textfield;
        }
        .el-table--enable-row-hover .el-table__body tr:hover > td {
            background-color: $color-bg3 !important;
            .numClass{
                display: none;
            }
            .removeClass{
                display: block;
                .el-icon-error{
                cursor: not-allowed;
                }
            }
        }
        .el-table--enable-row-hover .el-table__body{
            .removeClass {
            display: none;
            i{
                font-size: 25px;
                color: #F56C6C;
            }
            }
        }
        .ivu-input-number-disabled .ivu-input-number-input{
            color: #000;
        }
        .el-form .demo-form-inline {
            margin-top: 12px;
        }
        // .el-input.is-disabled .el-input__inner {
        //     opacity: 0;
        // }
        .el-input-group__append, .el-input-group__prepend {
            border: 1px;
        //     opacity: 0;
        }
    }
    
</style>