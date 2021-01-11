<template>
    <div class="qqtaddTable">
      <el-form :rules="formData.rules" :model="formData"  ref="formDom" class="demo-ruleForm d2-mt-20">
        <el-table
          :data="formData.tableData"
          border
          style="width: 100%">
            <el-table-column align="center"  width="60" label="序号">
              <template slot-scope="scope" >
                <!-- <div v-if="!isShowDetails">
                  <span class="numClass">{{scope.$index + 1}}</span>
                  <span class="removeClass">
                    <i class="el-icon-remove" @click="handleDelete(scope.$index,scope.row)" ></i>
                  </span>
                </div>
                <div v-else> -->
                <div> 
                  <span >{{scope.$index + 1}}</span>
                </div> 
              </template>
          </el-table-column>
          <el-table-column prop="line1" label="费用发生时间" width="150px">
              <template slot-scope="scope">
                <el-form-item :prop="'tableData.' + scope.$index + '.line1'" :rules='formData.rules.required'>
                    <el-date-picker
                        disabled size="small" :class="{'isShowDetails':isShowDetails}" v-model="scope.row.line1"  
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="line2" label="费用发生地点" width="250px">
                <template slot-scope="scope">
                <el-form-item :prop="'tableData.' + scope.$index + '.line2'" :rules='formData.rules.required'>
                  <el-cascader
                        v-model="scope.row.line2"
                        :options="cityJson"
                        disabled
                        :props="cascaderProps"
                    >
                    </el-cascader>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="line3" label="报销事项详情" min-width="250px">
                <template slot-scope="scope">
                    <el-form-item :prop="'tableData.' + scope.$index + '.line3'" :rules='formData.rules.required'>
                        <el-input
                            type="textarea"
                            :rows="1"
                             :class="{'isShowDetails':isShowDetails}" disabled 
                            :autosize="{ minRows: 1, maxRows: 2}"
                            placeholder="请输入报销事项详情"
                            v-model="scope.row.line3">
                        </el-input>
                    </el-form-item>
                 </template>
            </el-table-column>
            <el-table-column prop="line4" label="费用名称" width="150px">
                <template slot-scope="scope">
                    <el-form-item :prop="'tableData.' + scope.$index + '.line4'" :rules='formData.rules.required'>
                        <el-select size="small" v-model="scope.row.line4"  :class="{'isShowDetails':isShowDetails}" disabled  style="width:100%"  filterable placeholder="请选择" >
                            <el-option
                            v-for="item in fees"
                            :key="item.id"
                            :label="item.name"
                            :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </template>
            </el-table-column>
            <el-table-column prop="line5" label="单位"  width="120px">
              <template slot-scope="scope">
                <el-form-item :prop="'tableData.' + scope.$index + '.line5'" :rules='formData.rules.required'>
                  <el-select size="small" allow-create v-model="scope.row.line5"  :class="{'isShowDetails':isShowDetails}" disabled  style="width:100%"  filterable placeholder="请选择" >
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
             <el-table-column prop="line6" label="数量" min-width="100px">
                <template slot-scope="scope">
                    <el-form-item :prop="'tableData.' + scope.$index + '.line6'" :rules='formData.rules.required'>
                        <el-input  size="small" :class="{'isShowDetails':isShowDetails}" disabled v-model="scope.row.line6" :min="0"  label="数量" @input="line6Change($event,scope.row)"   onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''">
                        </el-input>
                    </el-form-item>
                </template>
            </el-table-column>
            <el-table-column prop="line7" label="单价（元）" min-width="100px">
                <template slot-scope="scope">
                    <el-form-item :prop="'tableData.' + scope.$index + '.line7'" :rules='formData.rules.validatorMoney'>
                        <el-input  size="small" :class="{'isShowDetails':isShowDetails}" disabled v-model="scope.row.line7" :min="0"  label="单价（元）" @blur="line7Blur($event,scope.row)" @input="line7Change($event,scope.row)" onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''">
                        </el-input>
                    </el-form-item>
                </template>
            </el-table-column>
            <el-table-column prop="line8" label="合计（元）" width="150px">
                <template slot-scope="scope">
                    <el-form-item :prop="'tableData.' + scope.$index + '.line8'" >
                        <el-input  size="small" :class="{'isShowDetails':isShowDetails}" disabled v-model="scope.row.line8" :min="0"  label="报销金额（元）" >
                        </el-input>
                    </el-form-item>
                </template>
            </el-table-column>
            <el-table-column prop="line9" label="报销凭证"  width="150px">
              <template slot-scope="scope">
                <el-form-item :prop="'tableData.' + scope.$index + '.line9'" :rules='formData.rules.required'>
                  <el-select size="small" v-model="scope.row.line9"  :class="{'isShowDetails':isShowDetails}" disabled  style="width:100%"  filterable placeholder="请选择" >
                    <el-option
                      v-for="item in dictionaries"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="line10" label="核减或扣款金额" min-width="120px">
                <template slot-scope="scope">
                    <el-form-item :prop="'tableData.' + scope.$index + '.line10'" >
                        <el-input  size="small" :max="scope.row.line8" :class="{'isShowDetails':isShowDetails}" :disabled="isShowDetails" v-model="scope.row.line10" :min="0"  label="核减或扣款金额" @input="line10Change($event,scope.row)"   onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''">
                        </el-input>
                    </el-form-item>
                </template>
            </el-table-column>
            <el-table-column prop="line11" label="核减或扣款原因" min-width="150px">
                <template slot-scope="scope">
                    <el-form-item :prop="'tableData.' + scope.$index + '.line11'">
                        <el-input
                            type="textarea"
                            :rows="1"
                             :class="{'isShowDetails':isShowDetails}" :disabled="isShowDetails" 
                            :autosize="{ minRows: 1, maxRows: 2}"
                            placeholder="核减或扣款原因"
                            v-model="scope.row.line11">
                        </el-input>
                    </el-form-item>
                 </template>
            </el-table-column>
            <el-table-column prop="line12" label="实报金额（元）" min-width="100px">
                <template slot-scope="scope">
                    <el-form-item :prop="'tableData.' + scope.$index + '.line12'">
                        <el-input  size="small" :class="{'isShowDetails':isShowDetails}" disabled v-model="scope.row.line12" :min="0"  label="实报金额（元）">
                        </el-input>
                    </el-form-item>
                </template>
            </el-table-column>
            <!-- <el-table-column label="附件" width="150px">
              <template slot-scope="scope">
                <up-load :id="'tableUpload' + scope.$index" :showAddToBtn="showAddToBtn" :showLists='showLists' :isShowUpload="false" @dialogUploadBack="dialogUploadBack" @upLoadFileCallBack="files => upLoadFileCallBack(scope.$index, files)" :propList="scope.row.fileLists" :diffrentRef="'upload' + scope.$index"/>
              </template>
            </el-table-column> -->
        </el-table>
      </el-form>
      <!-- <el-button type="text"  v-if="!isShowDetails" @click="addLine"  icon="el-icon-plus"> 添加</el-button> -->
      <el-form style="margin-top:15px" :model="totalLine" class="demo-form-inline" :class="{'d2-mt-20':isShowDetails}" label-width="140px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="报销金额:" style="width:100%">
              <el-input :class="{'isShowDetails':isShowDetails}" disabled size="small" v-model="totalLine.totalmoney"  placeholder="请输入">
                 <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="核减或扣款金额:" style="width:100%">
              <el-input :class="{'isShowDetails':isShowDetails}" disabled size="small" v-model="totalLine.totalmoney3 "  placeholder="请输入">
                 <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="实报金额:" style="width:100%">
              <el-input :class="{'isShowDetails':isShowDetails}" disabled size="small" v-model="totalLine.realmoney"  placeholder="请输入">
                 <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
  </div>
</template>
<script>
import util from '@/libs/util.js';
import {queryDicById} from '@/api/jointProject/index';
import { qqtCascader, upload} from '../../../../../components/qqt-subassembly'
import { CITYJSON } from '../../../../../enum/CTIYS'
import { goAdd,rowDelete} from '../../../../../api/financialManagement/staffReimburse';

export default {
    components: {
        qqtCascader,
        'up-load': upload
    },
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
            showAddToBtn: false,
            showLists: false,
            detailaddressParams: {
                value: 'label',
                label: 'label'
            },
            fees: [],
            dictionaries: [],
            cascaderProps: {
                value: 'label'
            },
            cityJson: CITYJSON,
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
                    line8:'',
                    line9:'',
                    id: ''
                  }
                ]
            },
            totalLine: {
              totalmoney: '',
              // daxie: '',
              realmoney:'',
              totalmoney3:''
            },
            unitArr: [],
            getAccounts: [],
            getbankAccounts: [],
            getVouchers: [],
            viceId: ''
        }
    },
    methods:{
        dialogUploadBack (item) {
          this.$emit('dialogUploadBack', item)
        },
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
                      line8:'',
                      line9:'',
                      id: ''
                  };
                //添加新的行数
                this.formData.tableData.push(newValue);
              }
            })
        },
        setFile () {
          this.formData.tableData.forEach(item => {
            item.fileLists = []
            item.fileList.forEach(tem => {
                let json = {
                    status: 'finished',
                    response: {
                        url: tem.url,
                        name: tem.name,
                        size: tem.size
                    }
                }
                item.fileLists.push(json)
            })
          })
        },
        line7Blur (e,row) {
          row.line7 = Number(e.target.value).toFixed(2)
        //   row.line8 = (row.line7 * (Number(row.line6) > 0 ? row.line6 : row.line6 = 1)).toFixed(2)
        },
        getTotal () {
          let total = 0;
          let total2 = 0;
          let total3 = 0;
          let data = this.formData.tableData;
          for (let i = 0; i < data.length; i++) {
              total += Number(data[i].line8)  
              total2 += Number(data[i].line10)  
              total3 += Number(data[i].line12)  

          }
          this.totalLine.totalmoney = total.toFixed(2);
          this.totalLine.realmoney = total3.toFixed(2);
          this.totalLine.totalmoney3 = total2.toFixed(2);
          this.totalLine.daxie = util.convertCurrency(this.totalLine.totalmoney);
        },
        line6Change (e,row) {
          row.line8 = (e * (Number(row.line7) > 0 ? row.line7 : row.line7 = 1)).toFixed(2)
          this.getTotal();
        },
        line7Change (e,row) {
          row.line8 = (e * (Number(row.line6) > 0 ? row.line6 : row.line6 = 1)).toFixed(2)
          this.getTotal();
        },
        line10Change (e,row) {
          if (Number(e) > Number(row.line8)) {
            row.line10 = Number(row.line8);
            row.line12 = 0;
          } else {
            row.line12 = Number(row.line8) - Number(e);
          }
           this.getTotal();
        },
        getData(){  //保存
            return new Promise((resolve, reject) => {
                this.$refs.formDom.validate(valid => {
                    if (valid) {
                      let formData = JSON.parse(JSON.stringify(this.formData.tableData));
                      for (let i = 0; i < formData.length; i++) {
                        formData[i].line2 = formData[i].line2.join();
                      }
                      let jsonData = {
                        totalmoney:this.totalLine.totalmoney,
                        realmoney:this.totalLine.realmoney,
                        totalmoney3:this.totalLine.totalmoney3,
                        viceId:this.viceId.substring(0,this.viceId.length - 1),
                        employReimVices:formData
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
          this.formData.tableData.splice(index, 1);

          this.getTotal();
        },
        getUnit () {
           queryDicById ({id: '1188702706350960640'}).then(res =>{
            this.unitArr = res;
          })
          goAdd ().then(res => {
              this.fees = res.fees;
              this.dictionaries = res.dictionaries;
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
                line7:'',
                line8:'',
                line9:'',
                id: ''
              }
          ]
          if (value.length > 0) {
            this.formData.tableData = JSON.parse(JSON.stringify(value));
            this.setFile()
            let total = 0;
            let total2 = 0;
            let total3 = 0;
            let data = this.formData.tableData;
            data.forEach(item => {
                total += (Number(item.line8)-0)
                item.line7 = Number(item.line7).toFixed(2);
                item.line12 = (item.line8 - 0) - (item.line10 - 0) || 0
                total3 += (Number(item.line10)-0)
                total2 += (Number(item.line12)-0)
                if (!Array.isArray(item.line2)) {
                  item.line2 = item.line2.split(',')
                }
            });
            this.totalLine.totalmoney = total.toFixed(2) || '0.00';
            this.totalLine.realmoney = total2.toFixed(2) || '0.00';
            this.totalLine.totalmoney3 = total3.toFixed(2) || '0.00';
            this.totalLine.daxie = util.convertCurrency(this.totalLine.totalmoney);
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
  .el-table td{
    padding-bottom: 0px !important;
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