<template>
    <div class="add_invoice_lines">
        <el-divider content-position="left">
            <div class="generate-from-divider___line"></div>
                发票抵扣记录 {{totalTax}}
        </el-divider>
            <el-table
                :data="deductionOrder"
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
            <el-table-column prop="procCode" label="抵扣编号" min-width="150px">
                 
            </el-table-column>
            <el-table-column prop="deductionThis" label="本次抵扣金额" width="250px">
               
            </el-table-column>
            <el-table-column prop="deductionCumsum" label="累计抵扣金额" width="250px">
                
            </el-table-column>
             <el-table-column prop="createName" label="申请人" min-width="150px">
                
            </el-table-column>
             <el-table-column prop="createTime" label="申请时间" min-width="150px">
               
            </el-table-column>
             <el-table-column prop="remark" label="备注" min-width="200px">
             </el-table-column>
                
        </el-table>
        <el-form :rules="formData.rules" :model="formData"  ref="formDom" class="demo-ruleForm d2-mt-20">
            <el-divider content-position="left">
                <div class="generate-from-divider___line"></div>
                添加抵扣
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
                <el-table-column prop="name" label="抵扣编号" min-width="150px">
                    <template slot-scope="scope">
                        <el-form-item :prop="'materialAddlines.' + scope.$index + '.procCode'" >
                            <el-input :disabled="true" size="small" :class="{'isShowDetails':isShowDetails}" v-model="scope.row.procCode"  placeholder="自动生成"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column prop="money1" label="本次抵扣金额" width="250px">
                    <template slot-scope="scope">
                        <el-form-item :prop="'materialAddlines.' + scope.$index + '.deductionThis'" :rules='formData.rules.required'>
                            <el-input  size="small"  :class="{'isShowDetails':isShowDetails}" :disabled="isShowDetails"  v-model="scope.row.deductionThis" :min="0" @blur="money1Change($event,scope.row)"  >
                            </el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column prop="money2" label="累计抵扣金额" width="250px">
                    <template slot-scope="scope">
                        <el-form-item :prop="'materialAddlines.' + scope.$index + '.deductionCumsum'" >
                            <el-input  size="small" :disabled="true" v-model="scope.row.deductionCumsum" :min="0" placeholder="自动生成">
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
        invoiceDeductionList: {
            type:  Array,
            default: ()=>{
                return []
            }
        },
        addInvoiceDeductionList: {
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
        deductionId : {
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
                  procCode: '',
                  deductionThis: '',
                  deductionCumsum: '',
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
            deductionData : {},
            tableData: [],
            totalLine: {
                paymoney: '',
                daxie: '',
            },
            deductionOrder: []
        }
    },
    methods:{
        money1Change (e,row) {
            row.deductionCumsum =  row.deductionCumsum || 0
            row.deductionThis ? row.deductionThis =  Number(row.deductionThis).toFixed(2)  :  row.deductionThis
            let num  =util.addNum (row.deductionThis, row.deductionCumsum) 
            num > this.totalTax ?  row.deductionThis = (this.totalTax - row.deductionCumsum).toFixed(2) : row.deductionThis = row.deductionThis
           
        },
      
        getData () {  //保存
            let item = {}
            this.$refs.formDom.validate(valid => {
                if (valid) {
                    item = {
                        procCode: this.formData.materialAddlines[0].procCode,
                        deductionThis: this.formData.materialAddlines[0].deductionThis,
                        deductionCumsum: this.formData.materialAddlines[0].deductionCumsum,
                        createName: util.cookies.get ('username'),
                        createTime: '',
                        remark: this.formData.materialAddlines[0].remark,
                        invoiceId: this.invoiceId, 
                        id: this.deductionId
                    }
                } else {
                    item = false
                }
            })
            return item
        },
      

    },

    watch:{
        invoiceDeductionList:{
            immediate:true,
            handler (value) {
                let data = []
                if (value.length > 0) {
                    this.deductionOrder = JSON.parse(JSON.stringify(value));
                    console.log(this.deductionOrder);
                    let total = 0;
                    data =  this.deductionOrder;
                    for (let i = 0; i < data.length; i++) {
                        data[i].deductionThis = data[i].deductionThis ?  data[i].deductionThis.toFixed(2) : '0.00'
                        data[i].deductionCumsum = data[i].deductionCumsum ?  data[i].deductionCumsum.toFixed(2) : '0.00'
                        total += Number(data[i].deductionThis)  
                    }
                    this.formData.materialAddlines[0].deductionCumsum = total.toFixed(2) || '0.00';
                    let num =  Number(this.totalTax).toFixed(2) - total.toFixed(2)
                    if (num < 0) {
                        this.toggle = true
                        this.$message.warning ('累计抵扣金额已超过可抵扣税额！')
                    } else {
                        this.toggle = false

                    }
                    // this.totalLine.daxie = util.convertCurrency(this.totalLine.paymoney);
                } else {
                    this.deductionOrder = data;
                    // console.log(this.deductionData)
                }
            },
        },
        addInvoiceDeductionList:{
            immediate:true,
            deep:true,
            handler (value) {
                this.formData.materialAddlines = [{...value}];
            }
        },
    },

    mounted () {
    },
    
    created () {
       this.deductionOrder = this.invoiceDeductionList
    },

    updated () {
       
    }
}
</script>

<style lang="scss">
    .add_invoice_lines {
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