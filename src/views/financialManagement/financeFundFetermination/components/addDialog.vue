<template>
  <d2-container class="nonbAdd_Dialog">
    <el-card class="box-card closeHeader">
        <div slot="header">
          <el-button  type="text" @click="cancelBtn"><i class="el-icon-close"></i></el-button>
        </div>
        <fm-generate-form
          class="addForm"
          :data="jsonData"
          :value="isAdd ? values : newValue"
          :remote="remote"
          :transform="transform"
          @on-change="onChange"
          ref="generateForm">
        </fm-generate-form>
        <template v-if="!isAdd && showTable">
          <qqt-table :data="tableData" 
            :rowHeader="rowHeader" 
            :option="tableOption"    
            :isShowSelection="false"  
            :pageShow="false"      
          >
          </qqt-table>
        </template>
        <el-row class="d2-mt-10">
          <el-col :span="24" style="text-align:center">
              <el-button size="small" type="warning" v-if="isAdd" @click="saveBtn">保存</el-button>
              <el-button size="small" type="primary" v-if="isAdd" @click="submitBtn">提交</el-button>
              <el-button size="small" type="primary" plain @click="cancelBtn">取消</el-button>
          </el-col>
        </el-row>
    </el-card>
    
  </d2-container>
</template>

<script>
  import qqtTable from '../../../../components/qqt-subassembly/qqt-table/qqt-table';
  import { formGetJson } from '../../../../api/system/fromManagement/index'
  import { getFinanceFundFeterminationAdd,getGoAdd,registerListAll} from '../../../../api/financialManagement/financeFundFetermination';
  import util from '@/libs/util.js'
  export default {
    name:'addDialog',
    // props: {
    //  modelData
    // },
    components: {
      qqtTable,
    },
    props: {
      modelData: {
        type: Object,
      },
      isAdd: {
        type: Boolean,
        default: false
      },
    },
    data() {
      let that = this;
      return {
        upLoadFileDefaultList: [],
        jsonData: {},
        showTable:false,
        tableData: {
          current: 1,
          pages: 1,
          records: [],
          searchCount: true,
          size: 10,
          total: 1
        },
        rowHeader: [
          {
              prop: 'affirmmoney',
              label: '认定金额',
              isShow: true
          },
          {
              prop: 'affirmman',
              label: '认定人',
              isShow: true
          },
          {
              prop: 'affirmmode',
              label: '资金类型',
              isShow: true
          },
          {
              prop: 'associated',
              label: '认定联营人',
              isShow: true
          },
          {
              prop: 'affirmtime',
              label: '认定时间',
              isShow: true
          },
          {
              prop: 'itemname',
              label: '关联项目',
              isShow: true
          },
        ],
        tableOption: {
            border: false
        },
        values: {
          gatheringbank: '',
          gatheringaccount: '',
          paybank: '',
          paynum: ''
        },
        companyData: [],
        paysData: [],
        recwayData: [],
        companyArr: [],
        paysArr: [],
        isShowElement:true,
        transform: {
            isShowDetails: !that.isAdd
        },
        addModel: {},
        remote: {
            getCompany(resolve) {
                resolve(JSON.parse(JSON.stringify(that.companyData)));
            },
            getPays(resolve) {
                resolve(JSON.parse(JSON.stringify(that.paysData)));
            },
            getRecway(resolve) {
                resolve(JSON.parse(JSON.stringify(that.recwayData)));
            },
        },
      }
    },
    methods: {
      // 保存
      saveBtn () {
        // this.isShowElement = !this.isShowElement;
        this.$refs.generateForm.getData().then(data => {
          data.companycollection = this.queryNameByIdCompany(data.companycollection).name; 
          data.payaccount = this.queryNameByIdPays(data.payaccount).name;
          getFinanceFundFeterminationAdd (data).then(res => {
            this.$emit('successFun',res);
          }).catch(err => {
              console.log(err);
          });
        }).catch(e => {
            console.log(e)
        })
      },
      // 提交
      submitBtn () {

      },
      // 取消
      cancelBtn () {
        this.$emit('cancelBtn');
      },
      // 上传
      upLoadFileCallBack (item) {
          this.customerData.fileList = item
      },
      onChange (name,value,data) {
        // if (name === 'companycollection') {
        //   let obj = this.queryNameByIdCompany(value)
        //   this.values.gatheringbank = obj.openingBank;
        //   this.values.gatheringaccount = obj.account;
        // }
        // if (name === 'payaccount') {
        //   let selectData = this.queryNameByIdPays(value)
        //   this.values.paybank = selectData.openingBank;
        //   this.values.paynum = selectData.account;
        // }
      },
      // 通过ID查name
      queryNameByIdCompany (id) {
          let data = {};
          for (let i = 0; i < this.companyArr.length; i++) {
            if (id === this.companyArr[i].id) {
              data = this.companyArr[i];
            }
          }
          return data;
      },
      queryNameByIdPays (id) {
          let data = {};
          for (let i = 0; i < this.paysArr.length; i++) {
            if (id === this.paysArr[i].id) {
              data = this.paysArr[i];
            }
          }
          return data;
      },
    },
    mounted () {
      getGoAdd,registerListAll().then(res=>{
          this.companyArr = res.company || [];
          let recwayData = res.recway || [];
          for (let i = 0; i < this.companyArr.length; i++) {
              let obj = {
                value: this.companyArr[i].id,
                label: this.companyArr[i].name,
              }
              this.companyData.push(obj)
          }
          registerListAll ().then(res => {
            this.paysArr = res|| [];
            for (let i = 0; i < res.length; i++) {
                let obj = {
                  value: res[i].id,
                  label: res[i].name,
                }
                this.paysData.push(obj)
            }
          })
          // for (let i = 0; i < this.paysArr.length; i++) {
          //     let obj = {
          //       value: this.paysArr[i].id,
          //       label: this.paysArr[i].name,
          //     }
          //     this.paysData.push(obj)
          // }
          for (let i = 0; i < recwayData.length; i++) {
              let obj = {
                value: recwayData[i].name,
                label: recwayData[i].name,
              }
              this.recwayData.push(obj)
          }
      }).finally((res)=>{
          formGetJson({
              code: 'cashRegister'
          }).then(res => {
              this.jsonData = JSON.parse(res)
          }).catch(res => {
          })
      })
    },
    computed :{
      newValue () {
        let newValue = {};
        // for (let i = 0; i < this.companyArr.length; i++) {
        //     if (this.companyArr[i].name === this.modelData.companycollection && this.companyArr[i].openingBank === this.modelData.gatheringbank && this.companyArr[i].account === this.modelData.gatheringaccount) {
        //       this.modelData.companycollection = this.companyArr[i].id;
        //     }
        // }
        // for (let i = 0; i < this.paysArr.length; i++) {
        //     if (this.paysArr[i].name === this.modelData.payaccount && this.paysArr[i].openingBank === this.modelData.paybank && this.paysArr[i].account === this.modelData.paynum) {
        //       this.modelData.payaccount = this.paysArr[i].id;
        //     }
        // }
        newValue = this.modelData;
        this.tableData.records = [];
        if (newValue.accounts) {
          this.tableData.records.push(newValue.accounts[0]);
          this.showTable = true;
        } else {
          this.showTable = false;
        }
        return newValue;
      }
    }
  }
</script>

<style lang='scss'>
  .nonbAdd_Dialog input::-webkit-outer-spin-button,
  .nonbAdd_Dialog input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  .nonbAdd_Dialog input[type="number"]{
    -moz-appearance: textfield;
  }
</style>