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
          <template slot="collectModule">
            <collect-module :selectData="recsSelectData" name="付款账户" ref="recsSelect" :isShowDetails="transform.isShowDetails"  :data="recsCollectData"  @selectChange="selectChange"></collect-module>
          </template>
        </fm-generate-form>
        <div class="add-customer-content___upload" >
          <title-line>附件</title-line>
            <label for="male" > 
                <upload id="male" :isShowUpload="!transform.isShowDetails"  ref="upLoad" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList"></upload>
            </label>
        </div>
        <bottomInformation :fieldTitle="'登记'" :timeTitle="'登记'" :values="isAdd ? values : newValue" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
        <template v-if="!isAdd && showTable">
          <qqt-table :data="tableData" 
            :rowHeader="rowHeader" 
            :option="tableOption"
            :isShowSelection="false"      
            :pageShow="false">
          </qqt-table>
        </template>
        <el-row class="d2-mt-10">
          <el-col :span="24" style="text-align:center">
              <el-button size="small" type="warning" v-if="isAdd" @click="saveBtn">保存</el-button>
              <!-- <el-button size="small" type="success" v-if="isAdd" @click="submitBtn">提交</el-button> -->
              <el-button type="info" size="small" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
              <el-button size="small" type="primary" @click="cancelBtn">{{isAdd?'取消': '关闭'}}</el-button>
          </el-col>
        </el-row>
    </el-card>
    <print-template-by-html v-show="false" :code="code" ref="printTemp" />
  </d2-container>
</template>

<script>
  import {qqtTable,upload} from '../../../../components/qqt-subassembly';
  import { formGetJson } from '../../../../api/system/fromManagement/index'
  import bottomInformation from '../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
  import { getFinanceFundFeterminationAdd,getGoAdd,registerListAll} from '../../../../api/financialManagement/financeFundFetermination';
  import collectModule from '../../../approval/components/pushPage/components/collectModule';
  import util from '@/libs/util.js'
  import titleLine from '../../component/titleLine/titleLine';
  import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
  import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
  import printTemplateByHtml from '@/views/systemManagement/printTemplate/components/printTemplateByHtml'
  export default {
    name:'addDialog',
    // props: {
    //  modelData
    // },
    components: {
      qqtTable,
      upload,
      titleLine,
      collectModule,
      bottomInformation,
      'print-template-by-html': printTemplateByHtml
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
        recsCollectData: {
          name: '',
          openingBank: '',
          account: '',
        },
        recsSelectData: [],
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
        code: BASICSCODE.FINANCE_ACCOUNT_FUND,
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
            border: false,
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
      selectChange () {
        registerListAll ().then(res => {
             this.recsSelectData = res|| [];
        })
      },
      // 保存
      saveBtn () {
        // this.isShowElement = !this.isShowElement;
        let item = this.$refs.bottomInformation.getData ()
        this.$refs.generateForm.getData().then(data => {
            this.$refs.recsSelect.getData().then(recData => {
                if (data && recData && item) {
                  data.companycollection = this.queryNameByIdCompany(data.companycollection).name; 
                  data.payaccount = recData.name;
                  data.paybank = recData.openingBank;
                  data.paynum = recData.account;
                  Object.assign(data, item)
                  data.fileList = this.upLoadFileDefaultList
                  delete data.collectModule
                  getFinanceFundFeterminationAdd (data).then(res => {
                    this.$emit('successFun',res);
                  })
                }
            })
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
      printTemplate () {
          getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.modelData.id}).then(res => {
              if (res) this.$refs.printTemp.printTemplate (res)
          })
      },
      // 上传
      upLoadFileCallBack (item) {
          this.upLoadFileDefaultList = item
          this.customerData.fileList = item
      },
      onChange (name,value,data) {
        if (name === 'companycollection') {
          let obj = this.queryNameByIdCompany(value)
          this.values.gatheringbank = obj.openingBank;
          this.values.gatheringaccount = obj.account;
        }
        if (name === 'payaccount') {
          let selectData = this.queryNameByIdPays(value)
          this.values.paybank = selectData.openingBank;
          this.values.paynum = selectData.account;
        }
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
      getGoAdd().then(res=>{
          this.companyArr = res.company|| [];
          let recwayData = res.recway|| [];
          for (let i = 0; i < this.companyArr.length; i++) {
              let obj = {
                value: this.companyArr[i].id,
                label: this.companyArr[i].name,
              }
              this.companyData.push(obj)
          }
      
          for (let i = 0; i < recwayData.length; i++) {
              let obj = {
                value: recwayData[i].name,
                label: recwayData[i].name,
              }
              this.recwayData.push(obj)
          }
          registerListAll ().then(res => {
            this.paysArr = res|| [];
            this.recsSelectData = res|| [];
            for (let i = 0; i < res.length; i++) {
                let obj = {
                  value: res[i].id,
                  label: res[i].name,
                }
                this.paysData.push(obj)
            }
          }).finally((res)=>{
              // cashRegister
              formGetJson({
                  code: this.isAdd ? 'financeFundFetermination' : 'cashRegister'
              }).then(res => {
                  this.jsonData = JSON.parse(res)
              })
          })
      })
      this.upLoadFileDefaultList = [];
      this.modelData.fileList = this.modelData.fileList ? this.modelData.fileList : [];
      for (let i = 0; i < this.modelData.fileList.length; i++) {
          let obj ={
            status : 'finished',
            response : {
                url : this.modelData.fileList[i].url,
                name : this.modelData.fileList[i].name,
                size : this.modelData.fileList[i].size
            },
          };
        this.upLoadFileDefaultList.push(obj)
      }
    },
    computed :{
      newValue () {
        let newValue = {};
        // for (let i = 0; i < this.companyArr.length; i++) {
        //     if (this.companyArr[i].name === this.modelData.companycollection && this.companyArr[i].openingBank === this.modelData.gatheringbank && this.companyArr[i].account === this.modelData.gatheringaccount) {
        //       this.modelData.companycollection = this.companyArr[i].id;
        //     }
        // }
        if (this.isAdd) {
          // for (let i = 0; i < this.paysArr.length; i++) {
          //     if (this.paysArr[i].name === this.modelData.payaccount && this.paysArr[i].openingBank === this.modelData.paybank && this.paysArr[i].account === this.modelData.paynum) {
          //       this.modelData.payaccount = this.paysArr[i].id;
          //     }
          // }
        }
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
  .nonbAdd_Dialog{
    .box-card{
      min-height: 100%;
    }
  }
</style>