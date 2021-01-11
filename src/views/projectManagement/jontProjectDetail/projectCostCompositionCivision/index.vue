<template>
  <d2-container  class="projectCostCompositionCivision">
      <el-dialog
          v-dialogDrag
          append-to-body
          title="提示"
          :visible.sync="hint"
          top="10vh"
          width="30%"
          :close-on-click-modal="false"
          :before-close="hintEnter">
          <div style="text-align:center;">
              <img src="../components/img/mark.png">
              <p style="color:red;text-align:center;font-size:18px;">此项目尚未进行立项登记, 不能进行成本票占比分类！</p>
          </div>
          <span slot="footer" class="dialog-footer" style="text-align:center;padding-left:40px;display:block;">
              <el-button size="mini" type="primary" @click="hintEnter">去立项登记查看</el-button>
          </span>
      </el-dialog>
    <el-card class="cardBox">
      <title-line>基本信息</title-line>
      <el-form :model="basicForm.form" :rules="basicForm.rules" ref="form" label-width="110px">
        <el-row>
          <el-col :span="16">
              <el-form-item label="项目名称:" prop="projectName">
                <el-input readonly v-model="basicForm.form.projectName"></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="8">
             <el-form-item label="项目编码:" prop="itemNumber">
                <el-input readonly v-model="basicForm.form.itemNumber"></el-input>
              </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
              <el-form-item label="标段:" prop="section">
                <el-input readonly v-model="basicForm.form.section"></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="8">
             <el-form-item label="中标价:" prop="tenderPrice">
                <el-input readonly placeholder="请输入内容" v-model="basicForm.form.tenderPrice">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
          </el-col>
          <el-col :span="8">
             <el-form-item label="公示投标工期:" prop="biddingPeriod">
               <calcu-date :day="biddingPeriod" :startTime="bidOpeningTime"></calcu-date>
              </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- <fm-generate-form
      :data="jsonData"
      :value="values"
      :remote="remote"
      :transform="transform"
      @on-change="onChange"
      ref="generateForm"></fm-generate-form> -->
      <title-line>成本构成</title-line>
      <add-table :selectData="selectData" :data="addTableData" ref="formDom" :tenderPrice="basicForm.form.tenderPrice"></add-table>
       <el-row class="d2-mt-10">
        <el-col :span="24" style="text-align:center">
            <el-button size="small" type="warning" v-if="$has('joint:costConstitute:edit')" @click="saveBtn">保存</el-button>
            <el-button type="info" size="small" @click="printTemplate">打印</el-button>
            <el-button size="small" type="primary" plain @click="cancelBtn">取消</el-button>
        </el-col>
      </el-row>
    </el-card>
    <print-template-by-html v-show="false" :code="code" ref="printTemp" />
  </d2-container>
</template>

<script>
  import { mapActions } from 'vuex'
  import titleLine from './components/titleLine/titleLine.vue';
  import calcuDate from './components/calcuDate';
  import { formGetJson } from '@/api/system/fromManagement/index'
  import { getProjectApprovalById,queryDicById,editFun,queryCostById} from '@/api/jointProject/index'
  import util from '@/libs/util.js';
  import addTable from './components/addTable/index';
  import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
  import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
  import printTemplateByHtml from '@/views/systemManagement/printTemplate/components/printTemplateByHtml'
  export default {
    components: {
      titleLine,
      calcuDate,
      addTable,
      'print-template-by-html': printTemplateByHtml
    },
    data() {
      let that = this;
      return {
          hint: false,
        basicForm: {
          form: {
            projectName: '',
            itemNumber: '',
            section: '',
            tenderPrice: 0,
          },
          rules: {
            projectName: [
              { required: true, message: '项目名称为必填', trigger: ['change','blur'] }
            ],
          },
        },
        jsonData: {},
        values: {
          total: '',
          table:[]
        },
        selectData: {
          getName: [],
          getType: [],
          unitArr: []
        },
        addTableData: [],
        remote: {
          getName (resolve) {
            resolve(that.getName)
          },
          getType (resolve) {
            resolve(that.getType)
          },
          getUnit (resolve) {
            resolve(that.unitArr)
          },
        },
        transform:{
        
        },
        biddingPeriod:0,
        bidOpeningTime:'',
        getName: [],
        getType: [],
        unitArr: [],
        selectName: '',
        code: BASICSCODE.JOINT_COST_CONSTITUTE
      }
    },
    methods: {
        ...mapActions('d2admin/page', [
            'close',
            'open'
        ]),
        //提示信息
        hintClose(){
            this.hint = false;
        },
        //跳转到立项
        hintEnter(){

            // this.$router.push({
            //     path:'',
            // });
            let tagName = this.$route.path
            let path = '/projectManagement/jontProjectDetail/projectApproval'
            let name = 'projectApproval'
            this.close ({ tagName, path, name })

        },
      onChange(name,value,data) {
        let total = 0;
        // 数量
        if (name === 'table') {
          for (let i = 0; i < value.length; i++) {
            total += Number(value[i].combinedPrice);
            if (this.selectName === 'unitPrice' && this.basicForm.form.tenderPrice > 0) {
              value[i].num = ((value[i].combinedPrice * 100000 / (value[i].unitPrice == 0 ? 1 : value[i].unitPrice) ) / 100000).toFixed(2);
              if (this.basicForm.form.tenderPrice - total < 0) {
                total = total -  value[i].combinedPrice;
                value[i].combinedPrice = this.basicForm.form.tenderPrice - total;
                value[i].combinedPrice = value[i].combinedPrice == 0 ? value[i].num = 0 : value[i].combinedPrice
                value[i].percent = ((value[i].combinedPrice * 100000 / this.basicForm.form.tenderPrice) / 1000).toFixed(2);
              }
            }
            if (this.selectName === 'combinedPrice') {
              if (this.basicForm.form.tenderPrice != 0 && value[i].combinedPrice!=0) {
                  value[i].num = ((value[i].combinedPrice * 100000 / (value[i].unitPrice == 0 ? 1 : value[i].unitPrice) ) / 100000).toFixed(2);
                  if (this.basicForm.form.tenderPrice - total < 0) {
                    total = total -  value[i].combinedPrice;
                    value[i].combinedPrice = this.basicForm.form.tenderPrice - total;
                    value[i].combinedPrice = value[i].combinedPrice == 0 ? value[i].num = 0 : value[i].combinedPrice
                    value[i].percent = ((value[i].combinedPrice * 100000 / this.basicForm.form.tenderPrice) / 1000).toFixed(2);
                  } else {
                    value[i].percent = ((value[i].combinedPrice * 100000 / this.basicForm.form.tenderPrice) / 1000).toFixed(2);
				          }
              }
			      }
			      value[i].combinedPrice === '' ? value[i].percent = '0.00' : value[i].combinedPrice;
          }
          data.total = total.toString();
        }
      },
      saveBtn () {
        this.$refs.formDom.getData().then(data => {
          // console.log(data)
            if (data.length > 0) {
              let indexs = '';
              let totalIndex = '';
              let totalType = false;
              let typeName = false;
              let regFlag = false;
              for (let i = 0; i < data.length; i++) {
                  if (!data[i].categoryId || !data[i].nameId) {
                    indexs += i + 1 + ',';
                    typeName = true;
                  }  if ((!data[i].num && data[i].num-0 == 0) || (!data[i].unitPrice &&  data[i].unitPrice-0 == 0)|| (!data[i].combinedPrice &&  data[i].combinedPrice-0 == 0)) {
                    totalIndex += i + 1 + ',';
                    totalType = true;
                  } else {
                    let reg  = /^\d+\.?\d{0,2}$/;
                    if (!reg.test(data[i].num) || !reg.test(data[i].unitPrice) || !reg.test(data[i].combinedPrice)) {
                      regFlag = true;
                      totalIndex += i + 1 + ',';
                      totalType = true;
                    }
                  }
              }
              if (typeName) {
                this.$message.error(`请确认第${indexs.substring(0,indexs.length -1)}行，成本类别或成本名称为空，请确认`)
              } else if (totalType) {
                if (regFlag) {
                  this.$message.error(`请确认第${totalIndex.substring(0,totalIndex.length -1)}行，数量、单价、合价格式错误，应为数字类型整数或保留两位小数，请确认`)
                } else {
                  this.$message.error(`请确认第${totalIndex.substring(0,totalIndex.length -1)}行，数量、单价、合价不能为0或为空，请确认`)
                }
              } else {
                let tableData  = JSON.parse(JSON.stringify(data));
                // let tableData = newData.table;
                for (let i = 0; i < tableData.length; i++) {
                    tableData[i].category = this.getTypeById (tableData[i].categoryId).name
                    tableData[i].name = this.getNameById(tableData[i].nameId).name
                }
                let jsonData = {
                  id: this.proId,
                  jsonData: tableData
                }
                jsonData.jsonData[0].name = '农民工工资'
                jsonData.jsonData[1].name = '管理人员工资'
                editFun (jsonData).then(res => {
                  if (res) {
                    this.$message.success('保存成功')
                  }
                })
              }
            } else {
              this.$message.error('请添加成本构成项')
            }
        })
        return
          this.$refs.generateForm.getData().then(data => {
            if (data.table.length > 0) {
              let indexs = '';
              let totalIndex = '';
              let totalType = false;
              let typeName = false;
              let regFlag = false;
              for (let i = 0; i < data.table.length; i++) {
                  if (!data.table[i].categoryId || !data.table[i].nameId) {
                    indexs += i + 1 + ',';
                    typeName = true;
                  }  if ((!data.table[i].num && data.table[i].num-0 == 0) || (!data.table[i].unitPrice &&  data.table[i].unitPrice-0 == 0)|| (!data.table[i].combinedPrice &&  data.table[i].combinedPrice-0 == 0)) {
                    totalIndex += i + 1 + ',';
                    totalType = true;
                  } else {
                    let reg  = /^\d+\.?\d{0,2}$/;
                    if (!reg.test(data.table[i].num) || !reg.test(data.table[i].unitPrice) || !reg.test(data.table[i].combinedPrice)) {
                      regFlag = true;
                      totalIndex += i + 1 + ',';
                      totalType = true;
                    }
                  }
              }
              if (typeName) {
                this.$message.error(`请确认第${indexs.substring(0,indexs.length -1)}行，成本类别或成本名称为空，请确认`)
              } else if (totalType) {
                if (regFlag) {
                  this.$message.error(`请确认第${totalIndex.substring(0,totalIndex.length -1)}行，数量、单价、合价格式错误，应为数字类型整数或保留两位小数，请确认`)
                } else {
                  this.$message.error(`请确认第${totalIndex.substring(0,totalIndex.length -1)}行，数量、单价、合价不能为0或为空，请确认`)
                }
              } else {
                let newData  = JSON.parse(JSON.stringify(data));
                let tableData = newData.table;
                for (let i = 0; i < tableData.length; i++) {
                    tableData[i].category = this.getTypeById (tableData[i].categoryId).name
                    tableData[i].name = this.getNameById(tableData[i].nameId).name
                }
                let jsonData = {
                  id: this.proId,
                  jsonData: tableData
                }
                jsonData.jsonData[0].name = '农民工工资'
                jsonData.jsonData[1].name = '管理人员工资'
                editFun (jsonData).then(res => {
                  if (res) {
                    this.$message.success('保存成功')
                  }
                })
              }
            } else {
              this.$message.error('请添加成本构成项')
            }
          })
      },
      cancelBtn () {
          this.$router.go(-1);
      },
      async printTemplate () {
          const db = await this.$store.dispatch('d2admin/db/database', {user: true})
          getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': db.get('proID').value()}).then(res => {
              if (res) this.$refs.printTemp.printTemplate (res)
          })
      },
       async getProInfo() {
          const db = await this.$store.dispatch('d2admin/db/database', {user: true})
          this.proId = db.get('proID').value();
          getProjectApprovalById({
              id: this.proId
          }).then(res => {
              this.hint = res.procState === '10' ? false :true ;
            res.managementRatio = Number(res.managementRatio)
            if(util.isArray(res.section)){
              res.section = res.section.join(',');
            }
            this.biddingPeriod = Number(res.biddingPeriod);
            this.bidOpeningTime = res.bidOpeningTime;
            util.setObjval(this.basicForm.form,res)
          })
          this.queryById(this.proId);
      },
      formJson () {
        formGetJson({
            code: 'projectCostCompositionCivision'
        }).then(res => {
            this.jsonData = JSON.parse(res)
        })
      },
      getNameById(id) {
        let data = {}
        for(let i = 0;i< this.getName.length; i++){
          if (id === this.getName[i].id) {
            data = this.getName[i];
          }
        }
        return data;
      },
      getTypeById(id) {
        let data = {}
        for(let i = 0;i< this.getType.length; i++){
          if (id === this.getType[i].id) {
            data = this.getType[i];
          }
        }
        return data;
      },
      getSelect (id) {
        // 成本名称
        queryDicById ({id: '1187990620010328064'}).then(res =>{
          this.getName = res;
          this.selectData['getName'] = res;
        })
        // 成本类别
        queryDicById ({id: '1187989758953271296'}).then(res =>{
          this.getType = res;
          this.selectData['getType'] = res;
        })
        queryDicById ({id: '1188702706350960640'}).then(res =>{
          this.unitArr = res;
          this.selectData['unitArr'] = res;
        }).finally(() =>{
      		this.formJson();
		})
      },
      queryById (id) {
        queryCostById ({id:id}).then(res => {
          if (res.length > 0) {
              this.values.table = res;
              this.addTableData = JSON.parse(JSON.stringify(res));
              let total = 0;
              for (let i = 0; i < res.length; i++) {
                total += (res[i].combinedPrice - 0)
              }
              this.values.total = total.toString();
          }
        })
      }
    },
    async mounted () {
      this.getProInfo();
      this.getSelect();
    },
  }
</script>

<style lang="scss" >
.projectCostCompositionCivision{
  .cardBox {
    min-height: 100%;
  }
}
</style>
