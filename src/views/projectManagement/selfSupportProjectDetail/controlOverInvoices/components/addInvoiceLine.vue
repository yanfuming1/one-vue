<template>
    <div class="add_invoice_line">
      <el-form :rules="formData.rules" :model="formData"  ref="formDom" class="demo-ruleForm d2-mt-20">
        <el-table
          :data="formData.materialAddlines"
          border
          :span-method="arraySpanMethod"
          style="width: 100%">
            <el-table-column align="center"  width="60" label="序号">
                <template slot-scope="scope" >
                    <div v-if="!isShowDetails">
                    <span class="numClass">{{scope.$index + 1}}</span>
                    <span class="removeClass">
                        <span v-if="scope.row.totalType == '1' || scope.row.totalType == '2'">{{scope.$index + 1}}</span>
                        <i class="el-icon-remove" v-else @click="handleDelete(scope.$index,scope.row)" ></i>
                    </span>
                    </div>
                    <div v-else>
                    <span >{{scope.$index + 1}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column  align="center" prop="name" label="货物或应税劳务名称" min-width="200px">
                <template slot-scope="scope">
                    <span v-if="scope.row.totalType == '1'">合计</span>
                    <span v-else-if="scope.row.totalType == '2'">价税合计(大写)</span>
                    <el-form-item v-else :prop="'materialAddlines.' + scope.$index + '.name'" :rules='formData.rules.required'>
                        <el-input :disabled="isShowDetails" size="small" :class="{'isShowDetails':isShowDetails}" v-model="scope.row.name"  placeholder="请输入"></el-input>
                    </el-form-item>
                </template>
            </el-table-column>
            <el-table-column  align="center" prop="specificationName" label="规格型号" min-width="200px">
                <template slot-scope="scope">
                    <span v-if="scope.row.totalType == '1' "></span>
                    <div v-else-if="scope.row.totalType == '2'" style="text-align:left;color:#000;;font-size:16px">
                        <i class="el-icon-circle-close" style="font-size:20px;vertical-align: middle;"></i>
                        {{scope.row.amountInWords}}
                    </div>
                    <el-form-item v-else :prop="'materialAddlines.' + scope.$index + '.specificationName'" >
                        <el-input :disabled="isShowDetails" size="small" :class="{'isShowDetails':isShowDetails}" v-model="scope.row.specificationName"  placeholder="请输入"></el-input>
                    </el-form-item>
                </template>
            </el-table-column>
            <el-table-column  align="center" prop="unit" label="单位"  width="150px">
                <template slot-scope="scope">
                    <span v-if="scope.row.totalType  == '1'"></span>
                    <div style="text-align:center;color:#000;font-size:16px" v-else-if="scope.row.totalType == '2'">
                       (小写) ￥ {{scope.row.amountInFiguers}}
                    </div>
                    <el-form-item v-else :prop="'materialAddlines.' + scope.$index + '.unit'" >
                        <el-select size="small" allow-create v-model="scope.row.unit"  :class="{'isShowDetails':isShowDetails}" :disabled="isShowDetails"  style="width:100%"  filterable placeholder="请选择" >
                            <el-option
                                v-for="item in unitArr"
                                :key="item.id"
                                :label="item.name"
                                :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </template>
            </el-table-column>
            <el-table-column  align="center" prop="number1" label="数量" width="150px">
                <template slot-scope="scope">
                    <span v-if="scope.row.totalType  == '1' || scope.row.totalType  == '2'"></span>
                    <el-form-item v-else :rules='formData.rules.isNumber'>
                        <el-input  size="small" type="number" onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''"  :class="{'isShowDetails':isShowDetails}" :disabled="isShowDetails" v-model="scope.row.number1" @input="number1Change($event,scope.row)" :min="0">
                        </el-input>
                    </el-form-item>
                </template>
            </el-table-column>
            <el-table-column  align="center" prop="money1" label="单价" width="150px">
                <template slot-scope="scope">
                    <span v-if="scope.row.totalType  == '1' || scope.row.totalType  == '2'"></span>
                    <el-form-item v-else >
                        <el-input  size="small"  type="number"  onkeyup="this.value= this.value.match(/\d+(\.\d{0,8})?/) ? this.value.match(/\d+(\.\d{0,8})?/)[0] : ''" :class="{'isShowDetails':isShowDetails}" :disabled="isShowDetails" v-model="scope.row.money1" :min="0" @input="money1Change($event,scope.row)">
                        </el-input>
                    </el-form-item>
                </template>
            </el-table-column>
            <el-table-column  align="center" prop="money2" label="金额" width="150px">
                <template slot-scope="scope">
                    <div style="text-align:right;color:#000;font-size:16px" v-if="scope.row.totalType == '1'">￥{{scope.row.totalAmount}}</div>
                    <div style="text-align:center;color:#000" v-else-if="scope.row.totalType == '2'">
                    </div>
                    <el-form-item v-else :prop="'materialAddlines.' + scope.$index + '.money2'" :rules='formData.rules.required'>
                        <el-input  size="small" :disabled="true" v-model="scope.row.money2" :min="0">
                        </el-input>
                    </el-form-item>
                </template>
            </el-table-column>
            <el-table-column  align="center" prop="string1" label="税率" width="150px">
                <template slot-scope="scope">
                    <span v-if="scope.row.totalType  == '1' || scope.row.totalType  == '2'"></span>
                    <el-form-item v-else :prop="'materialAddlines.' + scope.$index + '.string1'" :rules='formData.rules.required'>
                        <el-input  size="small" type="number" onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''" :class="{'isShowDetails':isShowDetails}" :disabled="isShowDetails" v-model="scope.row.string1" :min="0" @input="string1Change($event,scope.row)">
                            <template slot="append">%</template>
                        </el-input>
                    </el-form-item>
                </template>
            </el-table-column>
            <el-table-column  align="center" prop="string2" label="税额" width="200px">
                <template slot-scope="scope">
                    <div style="text-align:right;color:#000;font-size:16px" v-if="scope.row.totalType == '1'">￥{{scope.row.totalTax}}</div>
                    <span v-else-if="scope.row.totalType == '2'"></span>
                    <el-form-item v-else :prop="'materialAddlines.' + scope.$index + '.string2'" :rules='formData.rules.required'>
                        <el-input  size="small" :class="{'isShowDetails':isShowDetails}" readonly v-model="scope.row.string2" :min="0" :max="100">
                        </el-input>
                    </el-form-item>
                </template>
            </el-table-column>
        </el-table>
        <!-- <el-form :model="formData" class="demo-form-inline" :class="{'d2-mt-20':isShowDetails}" label-width="150px">
            <el-row>
                <el-col :span="11">
                    <el-form-item label="金额合计:">
                        <el-input :class="{'isShowDetails':isShowDetails}" disabled size="small" v-model="formData.totalAmount">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="税额合计:">
                        <el-input :class="{'isShowDetails':isShowDetails}" disabled size="small" v-model="formData.totalTax">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="11">
                    <el-form-item label="价税合计（大写）:">
                        <el-input :class="{'isShowDetails':isShowDetails}" disabled size="small" v-model="formData.amountInWords">
                            <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="小写:">
                    <el-input :class="{'isShowDetails':isShowDetails}" disabled  size="small" v-model="formData.amountInFiguers"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form> -->
    </el-form>
        <el-button type="text"  v-if="!isShowDetails" @click="addLine"  icon="el-icon-plus"> 添加</el-button>
        
    </div>
</template>
<script>
import util from '@/libs/util.js';
import {queryDicById} from '@/api/jointProject/index';
export default {
    name:'addTable',
    props: {
        data: {
            type: Array,
            default: ()=>{
                return []
            }
        },
        isShowDetails: {
            type: Boolean,
        },
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
            arraySpanMethod({ row, column, rowIndex, columnIndex }) {
                if (row.totalType  == '2' ) {
                    if (columnIndex == 2) {
                        return  [1,4];
                    } 
                    if (columnIndex == 3) {
                        return  [1,3];
                    }
                }
            },
            totalLineData: [
                {
                    totalAmount: '0',
                    totalTax: '0',
                    totalType: '1'
                },
                {
                    amountInWords: '零元整',
                    amountInFiguers: '0',
                    totalType: '2'
                }
            ],
            formData:{
                rules:{
                    validatorMoney:{
                      validator: validatorMoney, trigger: ["blur","change"]
                    },
                    required:{ 
                        required:true,
                        message:"必填字段",
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
                    name: '',
                    specificationName: '',
                    unit: '',
                    number1: '',
                    money1: '',
                    money2: '',
                    string1: '',
                    string2: ''
                }],
                totalAmount: 0,
                totalTax: 0,
                amountInWords: '',
                amountInFiguers: ''
            },
            totalLine: {
                paymoney: '',
                daxie: '',
            },
            unitArr: [],
            getAccounts: [],
            getbankAccounts: [],
            getVouchers: [],
        }
    },
    methods:{
        addLine(){ //添加行数
            this.$refs.formDom.validate(valid => {
                if (valid) {
                    var newValue = {
                        name: '',
                        specificationName: '',
                        unit: '',
                        number1: '',
                        money1: '',
                        money2: '',
                        string1: '',
                        string2: ''
                    };
                    //添加新的行数
                    this.formData.materialAddlines.splice(this.formData.materialAddlines.length - 2,0 ,newValue);
                }
            })
        },
        getTotal () {
            let total = 0;
            let data = this.formData.materialAddlines;
            for (let i = 0; i < data.length; i++) {
                total += Number(data[i].line5)  
            }
            this.totalLine.paymoney = total.toFixed(2);
            this.totalLine.daxie = util.convertCurrency(this.totalLine.paymoney);
        },
        money1Change (e,row) {
            row.money2 = (e * (Number(row.number1) > 0 ? row.number1 : row.number1 = null)).toFixed(2)
            let totalAmount = 0
            this.formData.materialAddlines.forEach (item => {
                totalAmount += Number.parseFloat (item.money2) || 0
            })
            this.formData.totalAmount = totalAmount.toFixed (2)
            this.formData.materialAddlines[this.formData.materialAddlines.length - 2].totalAmount =  this.formData.totalAmount;
            // this.totalAmount ()
            this.string1Change(row.string1,row)
        },
        number1Change (e,row) {
            row.money2 = (e * (Number(row.money1) > 0 ? row.money1 : row.money1 = null)).toFixed(2)
            let totalAmount = 0
            this.formData.materialAddlines.forEach (item => {
                totalAmount += Number.parseFloat (item.money2) || 0
            })
            this.formData.totalAmount = totalAmount.toFixed (2)
            this.formData.materialAddlines[this.formData.materialAddlines.length - 2].totalAmount =  this.formData.totalAmount;
            // this.totalAmount ()
            this.string1Change(row.string1,row)
        },
        string1Change (e,row) {
            console.log(e);
            row.string2 = (e * 0.01 * (Number(row.money2) > 0 ? row.money2 : row.money2 = null)).toFixed(2)
            let totalTax = 0
            this.formData.materialAddlines.forEach (item => {
                totalTax += Number.parseFloat (item.string2) || 0
            })
            this.formData.totalTax = totalTax.toFixed (2)
            this.formData.materialAddlines[this.formData.materialAddlines.length - 2].totalTax = this.formData.totalTax;
            this.totalAmount ()
        },
        totalAmount () {
            this.formData.amountInFiguers =util.addNum(Number.parseFloat (this.formData.totalAmount),Number.parseFloat (this.formData.totalTax))
            console.log(this.formData.amountInFiguers);
            this.formData.amountInWords = util.convertCurrency (this.formData.amountInFiguers)
            this.formData.materialAddlines[this.formData.materialAddlines.length - 1].amountInWords = this.formData.amountInWords;
            this.formData.materialAddlines[this.formData.materialAddlines.length - 1].amountInFiguers = this.formData.amountInFiguers;
        },

        getData () {  //保存
            let item = {}
            this.$refs.formDom.validate(valid => {
                if (valid) {
                    let newData = JSON.parse(JSON.stringify(this.formData.materialAddlines));
                    newData = newData.splice(0,newData.length - 2)
                    item = {
                        paymoney:this.totalLine.paymoney,
                        invoiceDetailLine:newData,
                        totalAmount: this.formData.totalAmount,
                        totalTax: this.formData.totalTax,
                        amountInWords: this.formData.amountInWords,
                        amountInFiguers: this.formData.amountInFiguers
                    }
                } else {
                    item = false
                }
            })
            return item
        },
        handleDelete(index,row){ //删除行数
            this.formData.materialAddlines.splice(index, 1)
            this.getTotal();
        },
        getUnit () {
            queryDicById ({id: '1188702706350960640'}).then(res =>{
                this.unitArr = res;
            })
        },

        hadData () {
            // console.log(this.data)
        },

        lineAmount () {
            let lineData = this.data
            lineData.forEach(row => {
                this.formData.totalAmount  = util.addNum(this.formData.totalAmount,row.money2) 
                this.formData.totalTax = util.addNum(this.formData.totalTax,row.string2 > 0 ? row.string2 : 0) 
                this.formData.amountInFiguers =(util.addNum (Number.parseFloat (this.formData.totalAmount),Number.parseFloat (this.formData.totalTax))).toFixed(2);
                this.formData.amountInWords = util.convertCurrency (this.formData.amountInFiguers)
                this.formData.materialAddlines[this.formData.materialAddlines.length - 2].totalAmount = this.formData.totalAmount.toFixed(2);
                this.formData.materialAddlines[this.formData.materialAddlines.length - 2].totalTax = this.formData.totalTax.toFixed(2);
                this.formData.materialAddlines[this.formData.materialAddlines.length - 1].amountInFiguers = this.formData.amountInFiguers;
                this.formData.materialAddlines[this.formData.materialAddlines.length - 1].amountInWords = this.formData.amountInWords;
            })
        }
    },
    watch:{
        data:{
            immediate:true,
            handler (value) {
                if (value.length > 0) {
                    value = [...value,...this.totalLineData]
                    this.formData.materialAddlines = JSON.parse(JSON.stringify(value));
                    let total = 0;
                    let data = this.formData.materialAddlines;
                    
                    for (let i = 0; i < data.length; i++) {
                        total += Number(data[i].line5)  
                        data[i].line4 = Number(data[i].line4).toFixed(2);
                    }
                    this.totalLine.paymoney = total.toFixed(2) || '0.00';
                    this.totalLine.daxie = util.convertCurrency(this.totalLine.paymoney);
                } else {
                    let data = [...this.formData.materialAddlines,...this.totalLineData];
                    this.formData.materialAddlines = data;
                }
            }
        },
    },
    mounted () {
        this.getUnit();
        this.lineAmount()
      
    },
}
</script>

<style lang="scss">
    .add_invoice_line {
       .el-form-item__label {
            color: $color-project-select;
        }
        .d2-mt-20 {
            margin-top: 0px !important;
        }
        .el-table td, .el-table th {
            padding: 6px 0;
        }
        .el-table {
            color: $color-project-select;
        }
        .el-table .cell {
            color: $color-project-select;
        }
        .el-table--border {
            border-bottom: 1px solid $color-project-select;
        }
        .el-table td, .el-table th.is-leaf {
            border-right: 1px solid $color-project-select;
            border-bottom: 1px solid $color-project-select;
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