<template>
  <d2-container class="loanAdd_Dialog">
    <el-card class="box-card closeHeader">
        <div slot="header">
          <el-button  type="text" @click="cancelBtn"><i class="el-icon-close"></i></el-button>
        </div>
        <qqt-flow-tabs  :procInstId="modelData.procInstId" :pdfId="modelData.pdfId">
          <template slot="content">
              <fm-generate-form
                class="addForm"
                :data="jsonData"
                :value="values"
                :remote="remote"
                :transform="transform"
                @on-change="formChange"
                ref="generateForm">
                <template slot="oguaranteeChange"> 
                  <oguarantee-change></oguarantee-change>
                </template>
                </fm-generate-form>
                <associated-documents :isTypeRequired="identification == '1' ? false : true" ref="relevance" size="small" :transform="transformNew" :relevance="values" />
                <bottomInformation :values="values" fieldTitle="经办" timeTitle="提交" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation"></bottomInformation>
                <qqt-table v-if="tableData.records.length>0 && editType === true" :data="tableData" 
                  :rowHeader="rowHeader" 
                  :option="tableOption"    
                  :isShowSelection="false"  
                  :pageShow="false">
                </qqt-table>
              <el-row class="d2-mt-5">
                <el-col :span="24" style="text-align:center">
                    <el-button size="small" type="warning" @click="saveBtn"  v-if="!editType && !isSendBack">保存</el-button>
                    <el-button size="small" type="primary" v-if="!editType && isSendBack" @click="anewSubmitBtn">重新提交</el-button>
                    <el-button size="small" type="success" @click="submitBtn"   v-else-if="!editType" >提交</el-button>
                    <el-button type="info" size="small" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                    <el-button size="small" type="primary" @click="cancelBtn">{{!editType ? '取消': '关闭'}}</el-button>
                </el-col>
              </el-row>
          </template>
        </qqt-flow-tabs>
      </el-card>
      <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    <qqt-send-process :isSendBack="isSendBack" :dialogVisible="dialogVisible" :prossValue="processValue" :processModuleId="processModuleId" @close="closeFun" @selectData="selectDataFun"></qqt-send-process>
    <verify-code v-if="codeShow" :money="money" @verifySuccess="verifySuccess" :moduleData="moduleData" :compareMoney="compareMoney"  @verifyClose="verifyClose" ></verify-code> 
  </d2-container>
</template>

<script>
  import { formGetJson } from '../../../../api/system/fromManagement/index'
  import { getExternalLloanAdd,getEdit,goAdd,getGoDetail,submitFun,updateAfterSubmit,updateAfterSubmitNew,complete, getExternalLloanAddNew, getEditNew, submitFunNew} from '../../../../api/financialManagement/externalLloan';
  import { qqtInput, qqtInputNumber, qqtCascader, qqtRadio, qqtSelect, qqtSwitch,qqtTable,qqtSendProcess,qqtFlowTabs,
       associatedDocuments } from '../../../../components/qqt-subassembly'
  import util from '@/libs/util.js'
  import {upload} from '../../../../components/qqt-subassembly';
  import { isNumber } from 'util';
  import verifyCode from '../../../../components/verifyCode';
  import { configQueryById} from '../../../../api/configuration/index'; // 获取系统配置
  import oguaranteeChange from './oguaranteeChange';
  import bottomInformation from '../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
  import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
  import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
  import printTemplateByHtml from '@/views/systemManagement/printTemplate/components/printTemplateByHtml'
  export default {
    name:'addDialog',
    components: {
      qqtInput,
      qqtInputNumber,
      qqtCascader,
      qqtRadio,
      qqtSelect,
      qqtSwitch,
      qqtTable,
      upload,
      qqtSendProcess,
      qqtFlowTabs,
      verifyCode,
      oguaranteeChange,
      bottomInformation,
      associatedDocuments,
      'print-template-by-html': printTemplateByHtml
    },
    props: {
      modelData: {
        type: Object,
        default: ()=>{
          return {};
        }
      },
      editType: {
        type: Boolean,
        default: false
      },
      isCopy: {
        type: Boolean,
        default: false
      },
      isSendBack: {
        type: Boolean,
        default: false
      },
      isJump: {
        type: Boolean,
        default: false
      },
      selfSupportProject: {
        type: Object,
        default () {
          return {}
        }
      },
      identification: {
        type: String,
        default: ""
      }
    },
    data() {
      let that = this;
      return {
        jsonData: {},
        processValue: {
          title: '',
          pdfId: '',
          degree: '',
        },
        upLoadFileDefaultList: [],
        fileList: [],
        values: this.modelData,
        transform:{
            isShowDetails: this.editType
        },
        transformNew: {
          isShowDetails: this.identification === '1' ? true : this.editType
        },
        isShowUpload: !this.editType,
        tableData: {
          current: 1,
          pages: 1,
          records: [],
          searchCount: true,
          size: 10,
          total: 1
        },
        remote: {
            getGuaranteedate(resolve) {
                resolve(that.guaranteedateData);
            },
            getGuaranteeways(resolve) {
                resolve(that.guaranteewaysData);
            },
            getLenders(resolve) {
                resolve(that.lendersData);
            },
            getOvertimeway(resolve) {
                resolve(that.overtimewayData);
            },
        },
        isShowElement:true,
        addModel: {
         
        },
        guaranteedateData: [],
        guaranteewaysData: [],
        lendersData: [],
        overtimewayData: [],
        dialogVisible:false,
        processModuleId: '',
        punctualityrate: '',
        code: BASICSCODE.FINANCE_EXTERNAL_LOAN,
        // 核销记录
        rowHeader: [
          {
              prop: 'vermoney',
              label: '核销金额',
              isOpenSummary: true,
              isShow: true,
              render: (h,params) =>{
                let text = (params.row.vermoney - 0).toFixed(2)
                return h('div',{
                },text) 
              }
          },
          {
              prop: 'ownmoney',
              label: '下欠金额',
              isShow: true,
              isOpenSummary: true,
              render: (h,params) =>{
                let text = (params.row.ownmoney - 0).toFixed(2);
                return h('div',{
                },text) 
              }
          },
          {
              prop: 'verstate',
              label: '核销状态',
              isShow: true,
          },
          {
              prop: 'created',
              label: '核销人',
              isShow: true
          },
          {
              prop: 'createdbytime',
              label: '核销时间',
              isShow: true
          },
          {
              prop: 'remark',
              label: '核销说明',
              isShow: true
          },
        ],
        tableOption: {
            border: false,
            isOpenSummary: true
        },
        codeShow:false,
        money: 0,
        moduleData:'',
        compareMoney: 0,
      }
    },
    methods: {
      // 保存
      saveBtn () {
        let relevance = this.$refs.relevance.getData ()
        let element = this.$refs.bottomInformation.getData ()
        if (this.isCopy) {
            this.$refs.generateForm.getData().then(data => {
              if (!element || !relevance) return
              Object.assign (data, element, relevance)
              let jsonData = JSON.parse(JSON.stringify(data));
              delete jsonData.text0;
              delete jsonData.text1;
              delete jsonData.text2;
              delete jsonData.text3;
              let companyData = this.$refs.bottomInformation.getData ();
              jsonData = {
                ...jsonData,
                ...companyData
              }
              let url = this.identification === '1' ? getExternalLloanAddNew : getExternalLloanAdd
              jsonData.projectCode = this.selfSupportProject.projectCode;
              url (jsonData).then(res => {
                this.$emit('successFun',res);
              }).catch(err => {
                  console.log(err);
              });
          }).catch(e => {
              console.log(e)
          })
        } else {
          if (this.modelData.id) {
            this.$refs.generateForm.getData().then(data => {
                if (!element || !relevance) return
                Object.assign (data, element, relevance)
                let jsonData = JSON.parse(JSON.stringify(data));
                delete jsonData.text0;
                delete jsonData.text1;
                delete jsonData.text2;
                delete jsonData.text3;
                jsonData.id = this.modelData.id;
                let companyData = this.$refs.bottomInformation.getData ();
                jsonData = {
                  ...jsonData,
                  ...companyData
                }
                let url = this.identification === '1' ? getEditNew : getEdit
                jsonData.projectCode = this.selfSupportProject.projectCode;
                url (jsonData).then(res => {
                  this.$emit('successFun',res);
                }).catch(err => {
                    console.log(err);
                });
            }).catch(e => {
                console.log(e)
            })
          } else {
            this.$refs.generateForm.getData().then(data => {
                if (!element || !relevance) return
                Object.assign (data, element, relevance)
                let jsonData = JSON.parse(JSON.stringify(data));
                delete jsonData.text0;
                delete jsonData.text1;
                delete jsonData.text2;
                delete jsonData.text3;
                let url = this.identification === '1' ? getExternalLloanAddNew : getExternalLloanAdd
                jsonData.projectCode = this.selfSupportProject.projectCode;
                url (jsonData).then(res => {
                  this.$emit('successFun',res);
                }).catch(err => {
                    console.log(err);
                });
            }).catch(e => {
                console.log(e)
            })
          }
        }
      },
      anewSubmitBtn () {
        let relevance = this.$refs.relevance.getData ()
        let element = this.$refs.bottomInformation.getData ()
        this.$refs.generateForm.getData().then(data => {
            if (!element || !relevance) return
            Object.assign (data, element, relevance)
            let jsonData = JSON.parse(JSON.stringify(data));
            delete jsonData.text0;
            delete jsonData.text1;
            delete jsonData.text2;
            delete jsonData.text3;
            this.submitData = jsonData;
            this.getVerify().then(obj=>{
              if (obj.type) {
                if (Number(this.submitData.lendermoney) > Number(obj.data.value)) {
                  this.money = this.submitData.lendermoney;
                  this.compareMoney = obj.data.value;
                  this.moduleData = obj.data.name;
                  this.codeShow = true;
                } else {
                  this.processModuleId = 'externalLloan'; 
                  this.processValue.title = `对外贷款审批，金额:【${jsonData.lendermoney}元】`;
                  this.processValue.pdfId = this.modelData.pdfId;
                  this.processValue.degree = this.modelData.degree;
                  this.dialogVisible = true;  
                }
              } else {
                this.processModuleId = 'externalLloan'; 
                this.processValue.title = `对外贷款审批，金额:【${jsonData.lendermoney}元】`;
                this.processValue.pdfId = this.modelData.pdfId;
                this.processValue.degree = this.modelData.degree;
                this.dialogVisible = true; 
              }
            })
        })
      },
      // 提交
      submitBtn () {
        let relevance = this.$refs.relevance.getData ()
        let element = this.$refs.bottomInformation.getData ()
        this.$refs.generateForm.getData().then(data => {
            if (!element || !relevance) return
            Object.assign (data, element, relevance)
            let jsonData = JSON.parse(JSON.stringify(data));
            delete jsonData.text0;
            delete jsonData.text1;
            delete jsonData.text2;
            delete jsonData.text3;
            this.submitData = jsonData;
            this.getVerify().then(obj=>{
              if (obj.type) {
                if (Number(this.submitData.lendermoney) > Number(obj.data.value)) {
                  this.money = this.submitData.lendermoney;
                  this.compareMoney = obj.data.value;
                  this.moduleData = obj.data.name;
                  this.codeShow = true;
                } else {
                  this.processValue.title = `对外贷款审批，金额:【${jsonData.lendermoney}元】`
                  this.processModuleId = 'externalLloan'; 
                  this.dialogVisible = true; 
                }
              } else {
                this.processValue.title = `对外贷款审批，金额:【${jsonData.lendermoney}元】`
                this.processModuleId = 'externalLloan'; 
                this.dialogVisible = true; 
              }
            })
         
        })
      },
      closeFun () {
        this.dialogVisible = false; 
      },
      selectDataFun (data) {
        this.submitData.completeTask = data;
        this.submitData.fileList = this.fileList;
        let companyData = this.$refs.bottomInformation.getData ();
        this.submitData = {
          ...this.submitData,
          ...companyData
        }
        if (this.isSendBack) {
            let jsonData = this.submitData;
            jsonData.id = this.modelData.id;
            jsonData.flag = '1';
            jsonData.completeTask.taskId = this.modelData.taskId;
            complete(jsonData).then((res)=>{
              if (res.success) {
                this.$message.success('重新提交成功');
                this.$emit('successFun',res);
              }
            })
        } else {
            if (this.modelData.id) {
              this.submitData.id = this.modelData.id;
              let url = this.identification === '1' ? updateAfterSubmitNew : updateAfterSubmit
              this.submitData.projectCode = this.selfSupportProject.projectCode;
              url (this.submitData).then(res => {
                this.dialogVisible = false;
                this.$emit('successFun',res);
              }).catch(err => {
                  console.log(err);
              });
            } else {
              let url = this.identification === '1' ? submitFunNew : submitFun
              this.submitData.projectCode = this.selfSupportProject.projectCode;
              url (this.submitData).then(res => {
                this.dialogVisible = false;
                this.$emit('successFun',res);
              }).catch(err => {
                  console.log(err);
              });
            }
        }
      },
      formChange (name,value,data) {
        this.values[name] = value;
        if (name === 'lendermoney') {
          this.values.lower = util.convertCurrency(value); 
          this.values.lendermoney = value;
          data.lower =  util.convertCurrency(value);
        }
        if (name === 'punctualityrate') {
          if (value-0 >= 100) {
            this.values[name] = 100 + '';
            data.punctualityrate = 100 + '';
          }
        }
        if (name === 'outrate') {
          if (value-0 >= 100) {
            this.values[name] = 100 + '';
            data.outrate = 100 + '';
          }
        }
      },
      // 取消
      cancelBtn () {
        document.getElementsByClassName('extPunctualityrate')[0].onkeyup = '';
        document.getElementsByClassName('extPunctualityrate2')[0].onkeyup = '';
        if (this.isJump) {
            this.$router.go(-1);
        }
        this.$emit('cancelBtn');
      },
      printTemplate () {
        getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.modelData.id}).then(res => {
            if (res) this.$refs.printTemp.printTemplate (res)
        })
      },
      upLoadFileCallBack (item) {
          this.fileList = item
      },
      // 获取验证码
      verifyClose () {
        this.codeShow = false;
      },
      getVerify() {
        return new Promise((resolve, reject) => {
            configQueryById({id:'1196667084742885376'}).then(res => {
              if (res.status == 0) {
                let type = true;
                let data = res;
                resolve ({type,data})
              } else {
                resolve (false)
              }
            })
        })
      },
       // 短信校验成功
      verifySuccess () {
        this.codeShow = false;
        if (this.isSendBack) {
          this.processModuleId = 'externalLloan'; 
          this.processValue.title = `对外贷款审批，金额:【${this.modelData.lendermoney}元】`;
          this.processValue.pdfId = this.modelData.pdfId;
          this.processValue.degree = this.modelData.degree;
          this.dialogVisible = true; 
        } else {
          this.processValue.title = `对外贷款审批，金额:【${this.modelData.lendermoney}元】`
          this.processModuleId = 'externalLloan'; 
          this.dialogVisible = true; 
        }
      },
    },
    mounted () {
      this.transformNew = this.identification === '1' ? this.transformNew : this.transform
      if (this.identification === '1') {
        if (!this.isSendBack && !this.editType) {
          let tempData = { projectType: '1', projectCode: this.selfSupportProject.projectCode, 
                projectId: this.selfSupportProject.projectCode, projectName: this.selfSupportProject.projectName }
          this.values = Object.assign({}, this.values, tempData)
        }
      }
      goAdd().then(res=>{
        for (let i = 0; i < res.guaranteedate.length; i++) {
          let obj = {
              value: res.guaranteedate[i].name,
              label: res.guaranteedate[i].name,
          }
          this.guaranteedateData.push(obj)
        }
        for (let i = 0; i < res.guaranteeways.length; i++) {
          let obj = {
              value: res.guaranteeways[i].name,
              label: res.guaranteeways[i].name,
          }
          this.guaranteewaysData.push(obj)
        }
        for (let i = 0; i < res.lenders.length; i++) {
          let obj = {
              value: res.lenders[i].name,
              label: res.lenders[i].name,
          }
          this.lendersData.push(obj)
        }
        for (let i = 0; i < res.overtimeway.length; i++) {
          let obj = {
              value: res.overtimeway[i].name,
              label: res.overtimeway[i].name,
          }
          this.overtimewayData.push(obj)
        }
      }).finally(res=>{
          formGetJson({
              code: 'externalLloan'
          }).then(res => {
              this.jsonData = JSON.parse(res)
          }).catch(res => {
          }).finally(() => {
            document.getElementsByClassName('extPunctualityrate')[0].onkeyup = function (value) {
              value.srcElement.value = value.srcElement.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')
            }
            document.getElementsByClassName('extPunctualityrate2')[0].onkeyup = function (value) {
              value.srcElement.value = value.srcElement.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')
            }
          })
          this.upLoadFileDefaultList = [];
          if (this.editType) {
            if (isNumber(this.modelData.outrate-0)) {
              this.modelData.outrate = this.modelData.outrate + '%'
            }
            if (isNumber(this.modelData.punctualityrate-0)) {
              this.modelData.punctualityrate = this.modelData.punctualityrate + '%'
            }
          }
          this.tableData.records = this.modelData.records || [];
          this.fileList = this.modelData.fileList;
          if (this.modelData.fileList) {
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
          }
      })
    },
   
  }
</script>

<style lang='scss'>
  .loanAdd_Dialog input::-webkit-outer-spin-button,
  .loanAdd_Dialog input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  .loanAdd_Dialog input[type="number"]{
    -moz-appearance: textfield;
  }
  .loanAdd_Dialog{
    .box-card{
      min-height: 100%;
    }
  }
  .loanAdd_Dialog .addForm{

    .el-form-item__label {
      background-color: rgb(246,247,251)
    }
    .d2-text-center{
      background-color: rgb(246,247,251)
    }
    .el-form-item{
      height: 33px;
      line-height: 33px;
      margin-bottom: 0px;
      border-right: 1px solid rgb(228,228,228);
    }
    .el-form-item__label{
      line-height: 33px;
      padding-right: 11px;
      border-right: 1px solid rgb(228,228,228);
    }
    .el-input__inner{
      border-radius: 0;
      border: 0;
      height: 33px;
      line-height: 33px;
    }
    .el-row{
        border-top: 1px solid rgb(228,228,228);
        border-left: 1px solid rgb(228,228,228);
    }
    .lastRow{
        border-bottom: 1px solid rgb(228,228,228);
    }
    .generate-element-item {
      padding-left:  5px;
    }
    .el-form-item__content{
      line-height: 33px;
      height: 33px;
    }
    .el-input-group__append{
      border: 0;
      line-height: 33px;
      height: 33px;
    }
    .el-form-item__error {
      z-index: 999;
      top: 20px;
      left: 6px;
    }
    .el-input.is-disabled .el-input__inner{
      background-color: #ffffff;
    }
    .textInput{
      background-color: #f6f7fb;
    }
  }

</style>