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
          <el-table-column prop="line1" label="户名" width="200px">
              <template slot-scope="scope">
                <el-form-item :prop="'tableData.' + scope.$index + '.line1'" :rules='formData.rules.required'>
                  <el-select size="small" allow-create filterable default-first-option v-model="scope.row.line1" @visible-change="selectChange"  :class="{'isShowDetails':isShowDetails}" :disabled="isShowDetails"  style="width:100%" placeholder="请输入" @change="line1Change($event,scope.row,scope.$index)">
                    <el-option
                      v-for="item in getbankAccounts"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
          </el-table-column>
          <el-table-column prop="line2" label="开户行" width="200px">
              <template slot-scope="scope">
                <el-form-item :prop="'tableData.' + scope.$index + '.line2'" :rules='formData.rules.required'>
                    <el-input :disabled="isShowDetails" size="small" :class="{'isShowDetails':isShowDetails}" v-model="scope.row.line2"  placeholder="请输入"></el-input>
                </el-form-item>
              </template>
          </el-table-column>
          <el-table-column prop="line3" label="账号" width="250px">
              <template slot-scope="scope">
                <el-form-item :prop="'tableData.' + scope.$index + '.line3'" :rules='formData.rules.required'>
                    <el-input :disabled="isShowDetails" size="small" :class="{'isShowDetails':isShowDetails}"  v-model="scope.row.line3"  placeholder="请输入">
                        <el-button v-if="!isShowDetails" slot="append" @click="scFun(scope.$index,scope.row)">收藏</el-button>
                    </el-input>
                </el-form-item>
              </template>
          </el-table-column>
          <el-table-column prop="line4" label="金额（元）" width="120px">
              <template slot-scope="scope">
                <el-form-item :prop="'tableData.' + scope.$index + '.line4'" :rules='formData.rules.validatorMoney'>
                    <el-input  size="small" :class="{'isShowDetails':isShowDetails}" :disabled="isShowDetails" v-model="scope.row.line4" :min="0"  label="金额（元）" @input="line4Change($event,scope.row)"  @blur="line4Blur($event,scope.row)" onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''">
                    </el-input>
                </el-form-item>
              </template>
          </el-table-column>
          <el-table-column prop="line5" label="账户性质" width="150px">
              <template slot-scope="scope">
                <el-form-item :prop="'tableData.' + scope.$index + '.line5'" :rules='formData.rules.required'>
                  <el-select size="small" :class="{'isShowDetails':isShowDetails}" :disabled="isShowDetails" v-model="scope.row.line5"  style="width:100%"  filterable placeholder="请选择">
                    <el-option
                      v-for="item in getAccounts"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
          </el-table-column>
          <el-table-column prop="line6" label="收款凭证类型" width="150px">
              <template slot-scope="scope">
                <el-form-item :prop="'tableData.' + scope.$index + '.line6'" :rules='formData.rules.required'>
                  <el-select size="small" :class="{'isShowDetails':isShowDetails}" :disabled="isShowDetails" v-model="scope.row.line6"  style="width:100%"  filterable placeholder="请选择">
                    <el-option
                      v-for="item in getVouchers"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
          </el-table-column>
           <el-table-column prop="line7" label="联系人" width="120px">
              <template slot-scope="scope">
                <el-form-item :prop="'tableData.' + scope.$index + '.line7'" :rules='formData.rules.required'>
                    <el-input  size="small" :class="{'isShowDetails':isShowDetails}" :disabled="isShowDetails" v-model="scope.row.line7"  placeholder="请输入"></el-input>
                </el-form-item>
              </template>
          </el-table-column>
          <el-table-column prop="line8" label="联系方式" width="150px">
              <template slot-scope="scope">
                <el-form-item :prop="'tableData.' + scope.$index + '.line8'" :rules='formData.rules.validator'>
                    <el-input  size="small" :class="{'isShowDetails':isShowDetails}" :disabled="isShowDetails" v-model="scope.row.line8"   label="联系方式" onkeyup="value=value.replace(/[^\d]/g,''">
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
              <el-input :class="{'isShowDetails':isShowDetails}" disabled size="small" v-model="totalLine.recmoney"  placeholder="请输入">
                 <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="大写:" style="width:100%">
              <el-input :class="{'isShowDetails':isShowDetails}" disabled  size="small" v-model="totalLine.recmoneyUpper"  placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <bank-dialog :bankTypeShow="bankTypeShow" @bankDialogClose="bankDialogClose" :parentList="parentList" :formData="bankSelectForm"></bank-dialog>
  </div>
</template>
<script>
  import util from '@/libs/util.js';
  import bankDialog from '../../../component/bankDialog';
  import {exceptUserAccount} from '../../../../../api/financialManagement/paymentRequest';
  import {queryByParentId,queryByAccount} from "../../../../../api/financialManagement/staffLoan";
  export default {
      components: {
        bankDialog,
      },
      name:'addTable',
      props: {
        selectData: {
          type: Object,
          default: ()=>{
            return  {}
          }
        },
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
              return callback(new Error('金额不能为空'));
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
                      line7:'',
                      line8: '',
                      id: ''
                    }
                  ]
              },
              totalLine: {
                recmoney: '0.00',
                recmoneyUpper: '零元整',
              },
              getAccounts: [],
              getbankAccounts: [],
              getVouchers: [],
              parentList: [],
              bankTypeShow:false,
              viceId:'',
              bankSelectForm: {
                name: '',
                openingBank: '',
                account: '',
                accountname: ''
              }
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
                        line7:'',
                        line8: '',
                        id: ''
                    };
                  //添加新的行数
                  this.formData.tableData.push(newValue);
                }
              })
          },
          line1Change (value,row,index) {
            let selectData = this.getbankAccounts.find(item => item.id == value)
            if (selectData) {
              row.line2 = selectData.openingBank;
              row.line3 = selectData.account;
            } else {
              row.line2 = '';
              row.line3 = '';
            }
          },
          selectChange (flag) {
            if (flag) {
              this.getBankData();
            } 
          },
          getBankData () {
              exceptUserAccount ().then(res =>{
                this.getbankAccounts = res;
              })
          },
          line4Blur (e,row) {
            row.line4 = Number(e.target.value).toFixed(2)
          },
          getTotal () {
            let total = 0;
            let data = this.formData.tableData;
            for (let i = 0; i < data.length; i++) {
                total += Number(data[i].line4)  

            }
            this.totalLine.recmoney = total.toFixed(2);
            this.totalLine.recmoneyUpper = util.convertCurrency(this.totalLine.recmoney);
          },
          line4Change (e,row) {
            this.getTotal();
          },
          getData(){  //保存
              return new Promise((resolve, reject) => {
                  this.$refs.formDom.validate(valid => {
                      if (valid) {
                        let jsonData = {
                          recmoney:this.totalLine.recmoney,
                          recmoneyUpper: this.totalLine.recmoneyUpper,
                          viceId: this.viceId,
                          recs:JSON.parse(JSON.stringify(this.formData.tableData))
                        }
                        jsonData.recs.forEach(item => {
                            let data = this.getbankAccounts.find(element => element.id === item.line1);
                            item.line1 = data ? data.name : item.line1;
                        });
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
          // 查找
          czFun (index, row) {
            console.log(index, row)
          },
          bankDialogClose () {
            this.bankTypeShow = false;
          },
          // 收藏
          scFun (index, row) {
            if (row.line1 && row.line2 && row.line3) {
              this.gtAccount(row.line3).then(res => {
                 if (res) {
                   queryByParentId().then(data=> {
                     this.parentList = data;
                     if (data.length > 0) {
                       this.bankSelectForm.name = row.line1;
                       this.bankSelectForm.openingBank = row.line2;
                       this.bankSelectForm.account = row.line3;
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
      },
      watch:{
        selectData:{
          immediate:true,
          handler (value) {
            this.getAccounts = this.selectData['getAccounts']
            this.getVouchers = this.selectData['getVouchers']
          }
        },
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
                  line7:'',
                  line8: '',
                  id: ''
                }
            ]
            if (value.length > 0) {
              this.formData.tableData = JSON.parse(JSON.stringify(value));
              let total = 0;
              let data = this.formData.tableData;
              for (let i = 0; i < data.length; i++) {
                  total += Number(data[i].line4)  
                  data[i].line4 = Number(data[i].line4).toFixed(2);
              }
              this.totalLine.recmoney = total.toFixed(2) || '0.00';
              this.totalLine.recmoneyUpper = util.convertCurrency(this.totalLine.recmoney);
            } else {
              this.formData.tableData = data;
            }
          }
        },
      },
      mounted () {
        this.getBankData();
      },
  
  }
</script>

<style lang="scss">
.qqtaddTable{
  .el-input-group__append{
    padding: 0 10px
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