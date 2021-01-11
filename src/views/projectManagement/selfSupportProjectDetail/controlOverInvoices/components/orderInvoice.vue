<template>
    <div class="bottomInformation">
        <div v-if="isShowAccessory">
            <el-divider content-position="left">
                <div class="generate-from-divider___line"></div>
                发票抵扣记录
            </el-divider>
             <el-form :rules="formData.rules" :model="formData"  ref="formDom" class="demo-ruleForm d2-mt-20">
                <el-table
                :data="formData.materialAddlines"
                border
                style="width: 100%">
                    <el-table-column align="center"  width="60" label="序号">
                        <template slot-scope="scope" >
                            <div v-if="!isShowDetails">
                            <span class="numClass">{{scope.$index + 1}}</span>
                            <span class="removeClass">
                                <i class="el-icon-remove" @click="handleDelete(scope.$index,scope.row)" ></i>
                            </span>
                            </div>
                            <div v-else>
                            <span >{{scope.$index + 1}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="货物或应税劳务名称" min-width="200px">
                        <template slot-scope="scope">
                            <el-form-item :prop="'materialAddlines.' + scope.$index + '.name'" :rules='formData.rules.required'>
                                <el-input :disabled="isShowDetails" size="small" :class="{'isShowDetails':isShowDetails}" v-model="scope.row.name"  placeholder="请输入"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="specificationName" label="规格型号" min-width="200px">
                        <template slot-scope="scope">
                            <el-form-item :prop="'materialAddlines.' + scope.$index + '.specificationName'" :rules='formData.rules.required'>
                                <el-input :disabled="isShowDetails" size="small" :class="{'isShowDetails':isShowDetails}" v-model="scope.row.specificationName"  placeholder="请输入"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="unit" label="单位"  width="150px">
                        <template slot-scope="scope">
                            <el-form-item :prop="'materialAddlines.' + scope.$index + '.unit'" :rules='formData.rules.required'>
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
                    <el-table-column prop="number1" label="数量" width="150px">
                        <template slot-scope="scope">
                            <el-form-item  :rules='formData.rules.isNumber'>
                                <el-input  size="small" :class="{'isShowDetails':isShowDetails}" :disabled="isShowDetails" v-model="scope.row.number1" @input="number1Change($event,scope.row)" :min="0">
                                </el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="money1" label="单价" width="150px">
                        <template slot-scope="scope">
                            <el-form-item :prop="'materialAddlines.' + scope.$index + '.money1'" :rules='formData.rules.validatorMoney'>
                                <el-input  size="small" :class="{'isShowDetails':isShowDetails}" :disabled="isShowDetails" v-model="scope.row.money1" :min="0" @input="money1Change($event,scope.row)">
                                </el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="money2" label="金额" width="150px">
                        <template slot-scope="scope">
                            <el-form-item :prop="'materialAddlines.' + scope.$index + '.money2'" :rules='formData.rules.required'>
                                <el-input  size="small" :disabled="true" v-model="scope.row.money2" :min="0">
                                </el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="string1" label="税率" width="150px">
                        <template slot-scope="scope">
                            <el-form-item :prop="'materialAddlines.' + scope.$index + '.string1'" :rules='formData.rules.required'>
                                <el-input  size="small" :class="{'isShowDetails':isShowDetails}" :disabled="isShowDetails" v-model="scope.row.string1" :min="0" @input="string1Change($event,scope.row)">
                                    <template slot="append">%</template>
                                </el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="string2" label="税额" width="200px">
                        <template slot-scope="scope">
                            <el-form-item :prop="'materialAddlines.' + scope.$index + '.string2'" :rules='formData.rules.required'>
                                <el-input  size="small" :class="{'isShowDetails':isShowDetails}" :disabled="isShowDetails" v-model="scope.row.string2" :min="0" :max="100">
                                </el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                </el-table>
             </el-form>
             <el-button type="text"  v-if="!isShowDetails" @click="addLine"  icon="el-icon-plus"> 添加</el-button>
        </div>
    </div>
</template>

<script>
    import { PROPRIETARYPROJECTDICTIONARY } from '@/enum/DICTIONARY'
    import { formGetJson } from '@/api/system/fromManagement/index'
    import { PROPRIETARYPROJECT } from '@/enum/FORMCODE'
    import { queryDicById } from '@/api/system/dic/dic'

    import util from '@/libs/util.js'
    let than = this
    export default {

        props: {
            
          
        },

        data () {
            return {
                
            }
        },

        methods: {
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
                        this.formData.materialAddlines.push(newValue);
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
                row.money2 = (e * (Number(row.number1) > 0 ? row.number1 : row.number1 = 1)).toFixed(2)
                let totalAmount = 0
                this.formData.materialAddlines.forEach (item => {
                    totalAmount += Number.parseFloat (item.money2) || 0
                })
                this.formData.totalAmount = totalAmount.toFixed (2)
                this.totalAmount ()
            },
            number1Change (e,row) {
                row.money2 = (e * (Number(row.money1) > 0 ? row.money1 : row.money1 = 1)).toFixed(2)
            },
            string1Change (e,row) {
                row.string2 = (e * 0.01 * (Number(row.money2) > 0 ? row.money2 : row.money2 = 1)).toFixed(2)
                let totalTax = 0
                this.formData.materialAddlines.forEach (item => {
                    totalTax += Number.parseFloat (item.string2) || 0
                })
                this.formData.totalTax = totalTax.toFixed (2)
                this.totalAmount ()
            },

            totalAmount () {
                this.formData.amountInFiguers = Number.parseFloat (this.formData.totalAmount) + Number.parseFloat (this.formData.totalTax)
                this.formData.amountInWords = util.convertCurrency (this.formData.amountInFiguers)
            },

            getData () {  //保存
                let item = {}
                this.$refs.formDom.validate(valid => {
                    if (valid) {
                        item = {
                            paymoney:this.totalLine.paymoney,
                            materialAddlines:JSON.parse(JSON.stringify(this.formData.materialAddlines))
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
            }
        },
        watch:{
            data:{
                immediate:true,
                handler (value) {
                    let data = []
                    if (value.length > 0) {
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
                        this.formData.materialAddlines = data;
                    }
                }
            },
        },
          
        components: {
        },

        mounted () {
        }
    }
</script>
<style lang="scss" >
    .bottomInformation {
        .el-button--text {
            color: $color-danger !important;
        }
    }
</style>