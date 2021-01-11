<template>
    <div class="qqtaddTable">
      <el-form :rules="formData.rules" :model="formData"  ref="formDom" class="demo-ruleForm d2-mt-20">
        <el-table
          :data="formData.tableData"
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
          <el-table-column prop="line1" label="支付事由" min-width="300px">
              <template slot-scope="scope">
                <el-form-item :prop="'tableData.' + scope.$index + '.line1'" :rules='formData.rules.required'>
                    <el-input :disabled="isShowDetails" size="small" :type="'textarea'" :class="{'isShowDetails':isShowDetails}" v-model="scope.row.line1"  placeholder="请输入"></el-input>
                </el-form-item>
              </template>
          </el-table-column>
          <el-table-column prop="line2" label="单位"  width="150px">
              <template slot-scope="scope">
                <el-form-item :prop="'tableData.' + scope.$index + '.line2'" :rules='formData.rules.required'>
                  <el-select size="small" allow-create v-model="scope.row.line2"  :class="{'isShowDetails':isShowDetails}" :disabled="isShowDetails"  style="width:100%"  filterable placeholder="请选择" >
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
          <el-table-column prop="line3" label="数量" width="150px">
              <template slot-scope="scope">
                <el-form-item :prop="'tableData.' + scope.$index + '.line3'" :rules='formData.rules.required'>
                    <el-input  size="small" :class="{'isShowDetails':isShowDetails}" :disabled="isShowDetails" v-model="scope.row.line3" :min="0"  label="数量" @input="line3Change($event,scope.row)"   onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''">
                    </el-input>
                </el-form-item>
              </template>
          </el-table-column>
          <el-table-column prop="line4" label="单价（元）" width="150px">
              <template slot-scope="scope">
                <el-form-item :prop="'tableData.' + scope.$index + '.line4'" :rules='formData.rules.validatorMoney'>
                    <el-input  size="small" :class="{'isShowDetails':isShowDetails}" :disabled="isShowDetails" v-model="scope.row.line4" :min="0"  label="单价（元）" @input="line4Change($event,scope.row)" @blur="line4Blur($event,scope.row)"  onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''">
                    </el-input>
                </el-form-item>
              </template>
          </el-table-column>
          <el-table-column prop="line5" label="合计（元）" width="200px">
              <template slot-scope="scope">
                <el-form-item :prop="'tableData.' + scope.$index + '.line5'" >
                    <el-input  size="small" :class="{'isShowDetails':isShowDetails}" disabled v-model="scope.row.line5" :min="0"  label="合计（元）" >
                    </el-input>
                </el-form-item>
              </template>
          </el-table-column>
          <el-table-column prop="line6" label="备注说明"  width="250px">
              <template slot-scope="scope">
                <el-form-item :prop="'tableData.' + scope.$index + '.line6'" >
                    <el-input  size="small" :type="'textarea'" :class="{'isShowDetails':isShowDetails}" :disabled="isShowDetails" v-model="scope.row.line6" :min="0"  label="备注说明" >
                    </el-input>
                </el-form-item>
              </template>
          </el-table-column>
        </el-table>
      </el-form>
      <el-button type="text"  v-if="!isShowDetails" @click="addLine"  icon="el-icon-plus"> 添加</el-button>
      <el-form :model="totalLine" class="demo-form-inline" :class="{'d2-mt-20':isShowDetails}" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="合计金额:" style="width:100%">
              <el-input :class="{'isShowDetails':isShowDetails}" disabled size="small" v-model="totalLine.paymoney"  placeholder="请输入">
                 <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="大写:" style="width:100%">
              <el-input :class="{'isShowDetails':isShowDetails}" disabled  size="small" v-model="totalLine.paymoneyUpper"  placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
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
        var validatePhone = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('联系方式不能为空'));
          } else {
            // const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
            const reg = /(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\(\d{3}\))|(\d{3}\-))?(1[3456789]\d{9})$)/;
            if (reg.test(value)) {
              callback();
            } else {
              return callback(new Error('请输入正确的联系方式'));
            }
          }
        };
        var validatorMoney = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('单价不能为空'));
          } else {
            if (Number(value) > 0) {
              callback();
            } else {
              return callback(new Error('金额至少大于0'));
            }
          }
        };
        return {
            formData:{
                rules:{
                    validatorMoney:{
                      validator: validatorMoney, trigger: ["blur","change"]
                    },
                    validator: {
                       validator: validatePhone, trigger: ["blur","change"]
                    },
                    required:{ 
                        required:true,
                        message:"必填字段",
                        trigger: ["blur","change"]
                    },
                    isNumber:{ 
                        type:"number",
                        required:true,
                        message:"册数必须为数字值",
                        trigger:"change"
                    },
                  },
                tableData:[
                  {
                    line1: '',
                    line2: '',
                    line3: '',
                    line4: '',
                    line5: '',
                    line6:'',
                    id: ''
                  }
                ]
            },
            totalLine: {
              paymoney: '',
              paymoneyUpper: '',
            },
            viceId: '',
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
                      line1: '',
                      line2: '',
                      line3: '',
                      line4: '',
                      line5: '',
                      line6:'',
                      id: ''
                  };
                //添加新的行数
                this.formData.tableData.push(newValue);
              }
            })
        },
        line4Blur (e,row) {
          row.line4 = Number(e.target.value).toFixed(2)
          row.line5 = (row.line4 * (Number(row.line3) > 0 ? row.line3 : row.line3 = 1)).toFixed(2)
        },
        getTotal () {
          let total = 0;
          let data = this.formData.tableData;
          for (let i = 0; i < data.length; i++) {
              total += Number(data[i].line5)  

          }
          this.totalLine.paymoney = total.toFixed(2);
          this.totalLine.paymoneyUpper = util.convertCurrency(this.totalLine.paymoney);
        },
        line3Change (e,row) {
          if(row.line4 !== '') {
            row.line5 = (e * (Number(row.line4) > 0 ? row.line4 : row.line4 = '')).toFixed(2)
          }
          if(row.line4 !== '' && row.line3 !== '') {
            this.getTotal();
          }
        },
        line4Change (e,row) {
          if(row.line3 !== '') {
            row.line5 = (e * (Number(row.line3) > 0 ? row.line3 : row.line3 = '')).toFixed(2)
          }
          if(row.line4 !== '' && row.line3 !== '') {
            this.getTotal();
          }
        },
        getData(){  //保存
            return new Promise((resolve, reject) => {
                this.$refs.formDom.validate(valid => {
                    if (valid) {
                      let jsonData = {
                        viceId:this.viceId,
                        paymoney:this.totalLine.paymoney,
                        paymoneyUpper: this.totalLine.paymoneyUpper,
                        pays:JSON.parse(JSON.stringify(this.formData.tableData))
                      }
                        resolve(jsonData)
                    } else {
                        reject(new Error('表单数据校验失败').message)
                    }
                })
            })
        },
        handleDelete(index,row){ //删除行数
          if (row.id) {
            this.viceId += row.id + ','
          }
          this.formData.tableData.splice(index, 1)
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
          let data = [
             {
                line1: '',
                line2: '',
                line3: '',
                line4: '',
                line5: '',
                line6:'',
                id: ''
              }
          ]
          if (value.length > 0) {
            this.formData.tableData = JSON.parse(JSON.stringify(value));
            let total = 0;
            let data = this.formData.tableData;
            for (let i = 0; i < data.length; i++) {
                total += Number(data[i].line5)  
                data[i].line4 = Number(data[i].line4).toFixed(2);
            }
            this.totalLine.paymoney = total.toFixed(2) || '0.00';
            this.totalLine.paymoneyUpper = util.convertCurrency(this.totalLine.paymoney);
          } else {
            this.formData.tableData = data;
          }
        }
      },
    },
    mounted () {
      this.getUnit();
    },
 
}
</script>

<style lang="scss">
.qqtaddTable{
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
  .el-form-item {
    margin-bottom: 22px;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"]{
    -moz-appearance: textfield;
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
      background-color: #F5F7FA !important;
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
}
</style>