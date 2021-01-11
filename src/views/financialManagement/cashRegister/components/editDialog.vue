<template>
  <d2-container class="nonbAdd_Dialog">
    <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-button style="float: right; padding: 3px 0" type="text" @click="cancelBtn"><i class="el-icon-close"></i></el-button>
        </div>
        <fm-generate-form
          class="addForm"
          :data="jsonData"
          :value="values"
          :remote="remote"
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
        <bottomInformation :fieldTitle="'登记'" :timeTitle="'登记'" :values="values" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
        <el-row class="d2-mt-10">
          <el-col :span="24" style="text-align:center">
              <el-button size="small" type="warning"  @click="saveBtn">保存</el-button>
              <!-- <el-button size="small" type="primary"  @click="submitBtn">提交</el-button> -->
              <el-button size="small" type="primary" plain @click="cancelBtn">取消</el-button>
          </el-col>
        </el-row>
    </el-card>
  </d2-container>
</template>

<script>
import {upload} from '../../../../components/qqt-subassembly';
  import qqtTable from '../../../../components/qqt-subassembly/qqt-table/qqt-table';
  import { formGetJson } from '../../../../api/system/fromManagement/index'
  import bottomInformation from '../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
  import { getFinanceFundFeterminationEdit,getGoAdd,registerListAll} from '../../../../api/financialManagement/financeFundFetermination';
  import collectModule from '../../../approval/components/pushPage/components/collectModule';
  import util from '@/libs/util.js'
  import titleLine from '../../component/titleLine/titleLine';
  export default {
    name:'addDialog',
    // props: {
    //  modelData
    // },
    components: {
      qqtTable,
      collectModule,
      upload,
      titleLine,
      bottomInformation
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
        upLoadFileDefaultList: [],
        recsSelectData: [],
        upLoadFileDefaultList: [],
        jsonData: {},
        values: {
          id: '',
          gatheringbank: '',
          gatheringaccount: '',
          paybank: '',
          paynum: '',
          companycollection:'',
          payaccount:'',
          gatheringamount:'',
          gatheringtime:'',
          gatheringway:'',
          paymark:'',
        },
        showTable:false,
        tableData: {
          current: 1,
          pages: 1,
          records: [],
          searchCount: true,
          size: 10,
          total: 1
        },
        saveData: this.newValue,
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
        companyData: [],
        paysData: [],
        recwayData: [],
        companyArr: [],
        paysArr: [],
        isShowElement:true,
        transform: {
            isShowDetails: false
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
      upLoadFileCallBack (data) {
        this.upLoadFileDefaultList = data
      },
      // 保存
      saveBtn () {
        // this.isShowElement = !this.isShowElement;
        let item = this.$refs.bottomInformation.getData ()
        this.$refs.generateForm.getData().then(data => {
            this.$refs.recsSelect.getData().then(recData => {
              if (data && recData && item) {
                Object.assign(data, item)
                data.companycollection = this.queryNameByIdCompany(data.companycollection).name; 
                data.payaccount = recData.name;
                data.paybank = recData.openingBank;
                data.paynum = recData.account;
                data.id = this.values.id;
                data.fileList = this.upLoadFileDefaultList
                delete data.collectModule
                getFinanceFundFeterminationEdit (data).then(res => {
                  this.$emit('successFun',res);
                })
              }
            })
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
        this.values[name] = value;
        if (name === 'companycollection') {
          let obj = this.queryNameByIdCompany(value)
          this.values.gatheringaccount = obj.account;
          this.values.gatheringbank = obj.openingBank;
          this.values.companycollection =value;
        }
        if (name === 'payaccount') {
          let selectData = this.queryNameByIdPays(value)
          this.values.paybank = selectData.openingBank;
          this.values.paynum = selectData.account;
          this.values.payaccount = value;
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
          this.companyArr = res.company;
          let recwayData = res.recway;
          // 下拉框赋值
          for (let i = 0; i < this.companyArr.length; i++) {
              let obj = {
                value: this.companyArr[i].id,
                label: this.companyArr[i].name,
              }
              this.companyData.push(obj)
          }
          registerListAll ().then(res => {
            this.recsSelectData = res|| [];
            this.paysArr = res|| [];
            for (let i = 0; i < res.length; i++) {
                let obj = {
                  value: res[i].id,
                  label: res[i].name,
                }
                this.paysData.push(obj)
            }
          }).finally(res=> {
            for (let i = 0; i < recwayData.length; i++) {
                let obj = {
                  value: recwayData[i].name,
                  label: recwayData[i].name,
                }
                this.recwayData.push(obj)
            }
            // form表单赋值
            for (let i = 0; i < this.companyArr.length; i++) {
                if (this.companyArr[i].name === this.modelData.companycollection && this.companyArr[i].openingBank === this.modelData.gatheringbank && this.companyArr[i].account === this.modelData.gatheringaccount) {
                  this.modelData.companycollection = this.companyArr[i].id;
                }
            }
            // for (let i = 0; i < this.paysArr.length; i++) {
            //     if (this.paysArr[i].name === this.modelData.payaccount && this.paysArr[i].openingBank === this.modelData.paybank && this.paysArr[i].account === this.modelData.paynum) {
            //       this.modelData.payaccount = this.paysArr[i].id;
            //     }
            // }
            util.setObjval(this.values,this.modelData);
            let { companyId,companyName,createBy,createName,createTime,departmentId,departmentName } = this.modelData
            Object.assign(this.values, {companyId,companyName,createBy,createName,createTime,departmentId,departmentName})
            this.recsCollectData.name = this.modelData.payaccount;
            this.recsCollectData.openingBank = this.modelData.paybank;
            this.recsCollectData.account = this.modelData.paynum;
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
            formGetJson({code: 'financeFundFetermination'}).then(res => {
                this.jsonData = JSON.parse(res)
            })
          })
      })
    },
    // computed :{
    //   newValue () {
    //     let newValue = {};
    //     for (let i = 0; i < this.companyArr.length; i++) {
    //         if (this.companyArr[i].name === this.modelData.companycollection && this.companyArr[i].openingBank === this.modelData.gatheringbank && this.companyArr[i].account === this.modelData.gatheringaccount) {
    //           this.modelData.companycollection = this.companyArr[i].id;
    //         }
    //     }
    //     for (let i = 0; i < this.paysArr.length; i++) {
    //         if (this.paysArr[i].name === this.modelData.payaccount && this.paysArr[i].openingBank === this.modelData.paybank && this.paysArr[i].account === this.modelData.paynum) {
    //           this.modelData.payaccount = this.paysArr[i].id;
    //         }
    //     }
    //     newValue =  this.modelData;
    //     util.setObjval(this.values,this.modelData);
    //     return newValue;
    //   }
    // }
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
    .el-card__header{
      border-bottom: 0px;
      padding: 0;
      .clearfix{
        button {
          padding: 10px 10px !important;
          font-size: 20px;
          color: #000;
          &:hover{
            color: #409EFF;
          }
        }
      }
    }
  }
</style>