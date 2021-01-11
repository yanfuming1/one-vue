<template>
  <d2-container class="nonbAdd_Dialog">
    <el-card class="box-card closeHeader">
      <div slot="header">
        <el-button type="text" @click="cancelBtn"><i class="el-icon-close"></i></el-button>
      </div>
      <qqt-flow-tabs  :procInstId="modelData.procInstId" ref="approvalInformation" :pdfId="modelData.pdfId">
        <template slot="content">
          <fm-generate-form
            class="addForm"
            :data="jsonData"
            :value="isAdd === true ? values : newData"
            :remote="remote"
            :transform="transform"
            @on-change="onChange"
            ref="generateForm">
              <template slot="employReimVices">
                <add-table-row  ref="employReimVices" @dialogUploadBack="dialogUploadBack" :isShowDetails="transform.isShowDetails" :data="newData.employReimVices" :selectData="recsSelectData" >
                </add-table-row>
              </template>
              <template slot="compay" v-if="isAdd=== false && newData.compay.length> 0">
                <add-pays-table ref="addPaysTable" :isShowDetails="transform.isShowDetails"  :data="newData.compay"></add-pays-table>
              </template>
              <template slot="collectModule">
                <collect-module :selectData="recsSelectData" ref="recsSelect" :isShowDetails="transform.isShowDetails"  :data="recsCollectData"  @selectChange="selectChange"></collect-module>
              </template>
              <template slot="relevance">
                <associated-documents :isTypeRequired="identification == '1' ? false : true" ref="relevance" size="small" :transform="transformNew" :relevance=" newData" />
              </template>
          </fm-generate-form>
          <div class="add-customer-content___upload">
              <label for="male">
                <upload id="dialogMale" :isShowUpload="isAdd" :diffrentRef="upLoadMale" @dialogUploadBack="dialogUploadBack" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList"></upload>
              </label>
          </div>
          <bottomInformation :values="isAdd === true ? values : newData" fieldTitle="报销" timeTitle="申请" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
        </template>
      </qqt-flow-tabs>
      <el-row class="d2-mt-10">
        <el-col :span="24" style="text-align:center">
            <el-button size="small" type="warning" @click="saveBtn" v-if="isAdd && !isSendBack">保存</el-button>
            <el-button size="small" type="primary" v-if="isAdd && isSendBack" @click="anewSubmitBtn">重新提交</el-button>
            <el-button size="small" type="success" @click="submitBtn" v-else-if="isAdd" >提交</el-button>
            <el-button type="info" size="small" @click="printTemplate" v-if="transform.isShowDetails">打印</el-button>
            <el-button size="small" type="primary" @click="cancelBtn">{{isAdd?'取消': '关闭'}}</el-button>
        </el-col>
      </el-row>
    </el-card>
    <qqt-send-process :prossValue="processValue" :isSendBack="isSendBack" :dialogVisible="dialogVisible" :processModuleId="processModuleId" @close="closeFun" @selectData="selectDataFun"></qqt-send-process>
    <verify-code :money="money" @verifySuccess="verifySuccess" :moduleData="moduleData" :compareMoney="compareMoney"  @verifyClose="verifyClose" v-if="codeShow"></verify-code> 
    <print-template-by-html v-if="isLoad" v-show="false" :printHeader="employPrintHeader" :code="code" ref="printTemp" />
  </d2-container>
</template>

<script>
  import addTableRow from './addTable';
  import addPaysTable from '../../../approval/components/pushPage/components/payAddTable';
  import { formGetJson } from '../../../../api/system/fromManagement/index'
  import { dataAdd,goAdd,getEdit,complete,updateAfterSubmit,submit, dataAddNew, getEditNew, submitNew, updateAfterSubmitNew} from '../../../../api/financialManagement/staffReimburse';
  import {upload} from '../../../../components/qqt-subassembly';
  import bottomInformation from '../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
  import { qqtInput, qqtInputNumber, qqtCascader, qqtRadio, qqtSelect, qqtSwitch,qqtSendProcess, qqtFlowTabs, associatedDocuments } from '../../../../components/qqt-subassembly'
  import util from '@/libs/util.js'
  import { mapActions } from 'vuex';
  import { CITYJSON } from '@/enum/CTIYS'
  import verifyCode from '../../../../components/verifyCode';
  import { configQueryById} from '../../../../api/configuration/index'; // 获取系统配置
  import { BASICSCODE } from '../../../../enum/PRINTTEMPLATE'
  import collectModule from '../../../approval/components/pushPage/components/collectModule';
  import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
  import printTemplateByHtml from '../../../systemManagement/printTemplate/components/printTemplateByHtml'
  export default {
    name:'addDialog',
    components: {
      qqtInput,
      qqtInputNumber,
      qqtCascader,
      qqtRadio,
      upload,
      qqtSelect,
      qqtSwitch,
      qqtSendProcess,
      qqtFlowTabs,
      verifyCode,
      addPaysTable,
      collectModule,
      addTableRow,
      printTemplateByHtml,
      bottomInformation,
      associatedDocuments,
    },
    props: {
      modelData: {
        type: Object,
      },
      isAdd: {
        type: Boolean,
        default: false
      },
      isCopy: {
        type: Boolean,
        default: false
      },
      isEdit: {
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
      identification: {
        type: String,
        default: ''
      },
      selfSupportProject: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data() {
      let that = this;
      return {
        upLoadMale: 'upLoadMale',
        recsSelectData: [],
        recsCollectData: {
          name: '',
          openingBank: '',
          account: '',
        },
        upLoadFileDefaultList:[],
        jsonData: {},
        fileList:[],
        dictionariesData:[],
        recsData:[],
        dictionariesArr: [],
        recsArr: [],
        feesData:[],
        dialogVisible:false,
        jsonShowCN:false,
        processModuleId: '',
        processValue: {
          title: '',
          pdfId: '',
          degree: '',
        },
        values: {
          payname: '',
          paybank: '',
          payaccount: '',
          employReimVices:[],
          recname: '',
          recbank: '',
          recnum: '',
          totalmoney: '',
          payway: '',
          paymessage: '',
          payman: '',
          paycell: '',
          big: '',
          recmessage: '',
          companyId: '',
          companyName: '',
          createBy: '',
          createName: '',
          createTime: '',
          departmentId: '',
          departmentName: '',
        },
        transform: {
          isShowDetails: !this.isAdd
        },
        transformNew: {
          isShowDetails: true,
        },
        isShowElement:true,
        loadBottomInformation: false,
        addModel: {},
        remote:{
          getDictionariesData(resolve) {
                resolve(JSON.parse(JSON.stringify(that.dictionariesData)));
          },
          getRecs(resolve) {
              resolve(JSON.parse(JSON.stringify(that.recsData)));
          },
          getFeesData(resolve) {
              resolve(JSON.parse(JSON.stringify(that.feesData)));
          },
          getAdress (resolve) {
            resolve(CITYJSON)
          }
        },
        codeShow:false,
        money: 0,
        moduleData:'',
        compareMoney: 0,
        isLoad: false,
        code: BASICSCODE.FINANCE_EMPLOYEE_REIMBURSE,
        employPrintHeader: {
          key: 'defaultModule.employ',
          value: []
        }
      }
    },
    methods: {
      ...mapActions('d2admin/page', [
          'close',
      ]),
        // 收藏选择账户信息
      selectChange () {
        goAdd ().then(res=>{
          // 获取下拉框值
          this.recsSelectData = res.recs || [];
        })
      },
      // 保存
      saveBtn () {
        let relevance = this.$refs.relevance.getData ()
        let item = this.$refs.bottomInformation.getData ()
        this.$refs.generateForm.getData().then(data => {
            this.$refs.recsSelect.getData().then(recData => {
              this.$refs.employReimVices.getData().then(employReimVices => {
                if(data && recData && employReimVices && item) {
                  data.recname = recData.name;
                  data.recbank = recData.openingBank;
                  data.recnum = recData.account;
                  data.viceId = employReimVices.viceId;
                  data.totalmoney = employReimVices.totalmoney;
                  data.employReimVices = employReimVices.employReimVices;
                  Object.assign(data, item, relevance)
                  // if (data.employReimVices.length === 0) {
                  //   this.$message.error('请添加报销详情及费用明细');
                  //   return
                  // }
                  // let indexs = '';
                  // let flag = false;
                  // for (let i = 0; i < data.employReimVices.length; i++) {
                  //   if (!data.employReimVices[i].line1 || data.employReimVices[i].line2.length === 0 || !data.employReimVices[i].line3 || !data.employReimVices[i].line4 || !data.employReimVices[i].line5 || (data.employReimVices[i].line8-0) === 0 || !data.employReimVices[i].line9) {
                  //     indexs += i + 1 + ',';
                  //     flag = true;
                  //   }            
                  // }
                  // if (flag) {
                  //   this.$message.error(`请确认报销详情及费用明细:第${indexs.substring(0,indexs.length -1)}行，信息未补充完整`);
                  //   return
                  // }
                  if (this.isEdit) {
                    data.fileList = this.fileList;
                    data.id = this.modelData.id;
                    let lineData= data.employReimVices;
                    for (let i = 0; i < lineData.length; i++) {
                        lineData[i].line2 = lineData[i].line2.join(',')
                        lineData[i].identity = 'reim'
                    }
                    delete data.big;
                    let url = this.identification === '1' ? getEditNew : getEdit
                    // getEdit (data).then(res => {
                    url (data).then(res => {
                      this.$emit('successFun',res);
                    }).catch(err => {
                        console.log(err);
                    });
                  } else {
                    data.fileList = this.fileList;
                    let lineData= data.employReimVices;
                    for (let i = 0; i < lineData.length; i++) {
                        lineData[i].line2 = lineData[i].line2.join(',')
                        lineData[i].identity = 'reim'
                    }
                    delete data.big;
                    let url = this.identification === '1' ? dataAddNew : dataAdd
                    // dataAdd (data).then(res => {
                    url (data).then(res => {
                      this.$emit('successFun',res);
                    })
                  }
                }
              })
            })
        }).catch(e => {
            console.log(e)
        })
      },
      // 提交
      submitBtn () {
        let relevance = this.$refs.relevance.getData ()
        let item = this.$refs.bottomInformation.getData ()
          this.$refs.generateForm.getData().then(data => {
            this.$refs.recsSelect.getData().then(recData => {
              this.$refs.employReimVices.getData().then(employReimVices => {
                if(data && recData && employReimVices && item) {
                  data.recname = recData.name;
                  data.recbank = recData.openingBank;
                  data.recnum = recData.account;
                  data.employReimVices = employReimVices.employReimVices;
                  data.viceId = employReimVices.viceId;
                  data.totalmoney = employReimVices.totalmoney;
                  Object.assign(data, item, relevance)
                  let jsonData = JSON.parse(JSON.stringify(data));
                  // jsonData.recname = this.queryNameByIdrecs(jsonData.recname).name;;
                  let lineData= jsonData.employReimVices;
                  for (let i = 0; i < lineData.length; i++) {
                      lineData[i].line2 = lineData[i].line2.join(',');
                      lineData[i].identity = 'reim';
                  }
                  this.submitData = jsonData;
                  this.getVerify().then(obj=>{
                    if (obj.type) {
                      if (Number(this.submitData.totalmoney) > Number(obj.data.value)) {
                        this.money = this.submitData.totalmoney;
                        this.compareMoney = obj.data.value;
                        this.moduleData = obj.data.name;
                        this.codeShow = true;
                      } else {
                        this.processModuleId = 'staffReimburse'; 
                        this.processValue.title = `员工报销申请，金额:【${jsonData.totalmoney}元】`;
                        this.dialogVisible = true; 
                      }
                    } else {
                      this.processModuleId = 'staffReimburse'; 
                      this.processValue.title = `员工报销申请，金额:【${jsonData.totalmoney}元】`;
                      this.dialogVisible = true; 
                    }
                  })
                }
              })
            })
          })
      },
      // 重新提交
      anewSubmitBtn (){
        let relevance = this.$refs.relevance.getData ()
        let item = this.$refs.bottomInformation.getData ()
          this.$refs.generateForm.getData().then(data => {
            this.$refs.recsSelect.getData().then(recData => {
              this.$refs.employReimVices.getData().then(employReimVices => {
                if(item && data && recData && employReimVices){
                  data.recname = recData.name;
                  data.recbank = recData.openingBank;
                  data.recnum = recData.account;
                  data.viceId = employReimVices.viceId;
                  data.employReimVices = employReimVices.employReimVices;
                  data.totalmoney = employReimVices.totalmoney;
                  let jsonData = JSON.parse(JSON.stringify(data));
                  // jsonData.recname = this.queryNameByIdrecs(jsonData.recname).name;;
                  Object.assign(jsonData, item, relevance)
                  this.submitData = jsonData;
                  let lineData= jsonData.employReimVices;
                  for (let i = 0; i < lineData.length; i++) {
                      lineData[i].line2 = lineData[i].line2.join(',');
                      lineData[i].identity = 'reim';
                  }
                  this.getVerify().then(obj=>{
                    if (obj.type) {
                      if (Number(this.submitData.totalmoney) > Number(obj.data.value)) {
                        this.money = this.submitData.totalmoney;
                        this.compareMoney = obj.data.value;
                        this.moduleData = obj.data.name;
                        this.codeShow = true;
                      } else {
                        this.processModuleId = 'staffReimburse'; 
                        this.processValue.title = `员工报销申请，金额:【${jsonData.totalmoney}元】`;
                        this.processValue.pdfId = this.modelData.pdfId;
                        this.processValue.degree = this.modelData.degree;
                        this.dialogVisible = true;  
                      }
                    } else {
                      this.processModuleId = 'staffReimburse'; 
                      this.processValue.title = `员工报销申请，金额:【${jsonData.totalmoney}元】`;
                      this.processValue.pdfId = this.modelData.pdfId;
                      this.processValue.degree = this.modelData.degree;
                      this.dialogVisible = true; 
                    }
                  })
                }
              })
            })
           
          }).catch(e => {
              console.log(e)
          })
      },
      closeFun () {
        this.dialogVisible = false; 
      },
      selectDataFun (data) {
        this.submitData.completeTask = data;
        this.submitData.fileList = this.fileList;
        let companyItem = this.$refs.bottomInformation.getData ()
        this.submitData = {
          ...this.submitData,
          ...companyItem
        }
        if (this.isSendBack) {
            this.submitData.id = this.newData.id;
            let jsonData = this.submitData;
            jsonData.flag = '1';
            jsonData.completeTask.taskId = this.modelData.taskId;
        
            complete(jsonData).then((res)=>{
              if (res.success) {
                this.$message.success('重新提交成功');
                this.$emit('successFun',res);
              }
            })
        } else {
          if (this.newData.id) {
            this.submitData.id = this.newData.id;
            let url = this.identification === '1' ? updateAfterSubmitNew : updateAfterSubmit
            url (this.submitData).then(res =>{
              this.dialogVisible = false;
              this.$emit('successFun',res);
            })
          } else {
            let url = this.identification === '1' ? submitNew : submit
            url (this.submitData).then(res => {
              this.dialogVisible = false;
              this.$emit('successFun',res);
            }).catch(err => {
                console.log(err);
            });
          }
        }

       
      },
      // 取消
      cancelBtn () {
        if (this.isJump) {
          let tagName = this.$route.path;
          this.close ({ tagName })
          this.$router.go(-1);
        }
        this.$emit('cancelBtn');
      },
      // 上传附件
      upLoadFileCallBack (item) {
          this.fileList = item
      },
      dialogUploadBack (item) {
        let { url, name, size } = item.response
        this.fileList.push({ url, name, size })

        this.upLoadFileDefaultList = []
        for (let i = 0; i < this.fileList.length; i++) {
            let obj ={
              status : 'finished',
              response : {
                  url : this.fileList[i].url,
                  name : this.fileList[i].name,
                  size : this.fileList[i].size
              },
            };
          this.upLoadFileDefaultList.push(obj)
        }
      },
      onChange (name,value,data) {
        // if (name === 'employReimVices') {
        //   let total = 0;
        //   for (let i = 0; i < value.length; i++) {
        //     value[i].line8 = (value[i].line6 * 1000000 * value[i].line7 / 1000000).toFixed(2)
        //     total += (value[i].line8 * 1000000)-0;
        //     this.values.totalmoney = (total / 1000000).toFixed(2);
        //     this.values.big = util.convertCurrency(this.values.totalmoney);
        //   }
        // }
        if (name === 'recname') {
          let data = this.queryNameByIdrecs(value);
          this.values.recname = value;
          this.values.recbank = data.openingBank;
          this.values.recnum = data.account;
        }
        this.values[name] = value;
      },
      queryNameByIdrecs (id) {
          let data = {};
          for (let i = 0; i < this.recsArr.length; i++) {
            if (id === this.recsArr[i].id) {
              data = this.recsArr[i];
            }
          }
          return data;
      },
      // 获取验证码
      verifyClose () {
        this.codeShow = false;
      },
      getVerify() {
        return new Promise((resolve, reject) => {
            configQueryById({id:'1196666353939939328'}).then(res => {
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
          this.processModuleId = 'staffReimburse'; 
          this.processValue.title = `员工报销申请，金额:【${this.modelData.totalmoney}元】`
          this.processValue.pdfId = this.modelData.pdfId;
          this.processValue.degree = this.modelData.degree;
          this.dialogVisible = true; 
        } else {
          this.processModuleId = 'staffReimburse'; 
          this.processValue.title = `员工报销申请，金额:【${this.submitData.totalmoney}元】`
          this.dialogVisible = true; 
        }
      },

      initUploadData () {
        if(this.isAdd || this.isEdit) {
          this.transformNew = this.identification === '1' ? this.transformNew : this.transform
          if (this.isAdd && this.identification === '1') {
            let tempData = { projectType: '1', projectCode: this.selfSupportProject.projectCode, 
                    projectId: this.selfSupportProject.projectCode, projectName: this.selfSupportProject.projectName }
            this.values = Object.assign({}, this.values, tempData)
          }
        }

        let key = {}, list = [], obj = {}, header = []
        if (this.newData.employReimVices && this.newData.employReimVices.length > 0) {
          this.feesData.forEach ((res, index) => {
            let str = 0
            list = this.newData.employReimVices.filter (f => { return f.line4 == res.value })
            if (list && list.length > 0) list.forEach (e => { str += Number (e.line8) })
            if (str > 0) header.push ({title: list[0].line4, columnId: `line${index + 1}`, fixed: false, align: "center"})
            key[`line${index + 1}`] = str.toFixed (2)
            Object.assign (obj, key)
          })
        }
        this.employPrintHeader.value.push (header)
        this.newData['employ'] = [ obj ]
        this.isLoad = true
      },
      printTemplate () {
          getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.modelData.id }).then(res => {
            res.totalmoneyUpper = util.convertCurrency(res.totalmoney);
            res.paymoneyUpper = util.convertCurrency(res.paymoney);
              if (res) this.$refs.printTemp.printTemplate (res)
          })
      },
    },
    mounted () {
      goAdd ().then(res=>{
        // 获取下拉框值
        this.dictionariesData = [];
        this.recsData = [];
        this.feesData = [];
        this.dictionariesArr = res.dictionaries;
        this.recsArr = res.recs;
        this.recsSelectData = res.recs;
        for (let i = 0; i < res.dictionaries.length; i++) {
          let obj = {
            value: res.dictionaries[i].name,
            label: res.dictionaries[i].name,
          }   
          this.dictionariesData.push(obj)       
        }
        for (let i = 0; i < res.recs.length; i++) {
          let obj = {
            value: res.recs[i].id,
            label: res.recs[i].name,
          }   
          this.recsData.push(obj)       
        }
        for (let i = 0; i < res.fees.length; i++) {
          let obj = {
            value: res.fees[i].name,
            label: res.fees[i].name,
          }   
          this.feesData.push(obj)
        }
        this.initUploadData ()
      }).finally(res=>{
        // 获取表单设计器数据
        formGetJson({
            code: this.jsonShowCN ? 'staffReimburseCN' : 'staffReimburse'
        }).then(res => {
            this.jsonData = JSON.parse(res)
        }).finally(res=>{
            if (this.isCopy=== true || this.isSendBack === true) {
              this.upLoadFileDefaultList = [];
              // for (let i = 0; i < this.recsArr.length; i++) {
              //     if (this.recsArr[i].name === this.modelData.recname && this.recsArr[i].openingBank === this.modelData.recbank && this.recsArr[i].account === this.modelData.recnum) {
              //       this.modelData.recname = this.recsArr[i].id;
              //     }
              // }
              this.recsCollectData.name = this.modelData.recname;
              this.recsCollectData.openingBank = this.modelData.recbank;
              this.recsCollectData.account = this.modelData.recnum;
              
              this.modelData.employReimVices = this.modelData.employReimVices || [];
              for (let i = 0; i <  this.modelData.employReimVices.length; i++) {
                // if (!Array.isArray(this.modelData.employReimVices[i].line2)) {
                //   this.modelData.employReimVices[i].line2 = this.modelData.employReimVices[i].line2.split(',');
                // }
              }
              this.modelData.fileList = this.modelData.fileList ? this.modelData.fileList : [];
              this.fileList = this.modelData.fileList;
              // fileList 赋值
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
              // console.log(this.modelData)
              util.setObjval(this.values,this.modelData)
              this.loadBottomInformation = true
              // console.log(this.values)

            }
        })
      })
    },
    computed: {
      newData () {
        let newData = {};
        newData = this.modelData;
        this.upLoadFileDefaultList = [];
        this.modelData.fileList = this.modelData.fileList ? this.modelData.fileList : [];
        this.fileList = this.modelData.fileList;
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
        newData.compay = newData.compay || [];
        if (newData.compay.length > 0) {
          this.jsonShowCN = true;
          newData.payBig = util.convertCurrency(newData.paymoney);
          for (let i = 0; i <  newData.employReimVices.length; i++) {
            // if (Array.isArray(newData.employReimVices[i].line2)) {
            //   newData.employReimVices[i].line2 = newData.employReimVices[i].line2.join(',');
            // }
          }
        } else {
          this.jsonShowCN = false;
          // for (let i = 0; i < this.recsArr.length; i++) {
          //     if (this.recsArr[i].name === newData.recname && this.recsArr[i].openingBank === newData.recbank && this.recsArr[i].account === newData.recnum) {
          //       newData.recname = this.recsArr[i].id;
          //     }
          // }
          this.recsCollectData.name = this.modelData.recname;
          this.recsCollectData.openingBank = this.modelData.recbank;
          this.recsCollectData.account = this.modelData.recnum;
        }
        if (this.jsonShowCN) {
          newData.totalmoney = (newData.totalmoney - 0 ).toFixed(2);
          newData.paymoney = (newData.paymoney - 0 ).toFixed(2);
          newData.realmoney = (newData.realmoney - 0 ).toFixed(2);
          newData.big = util.convertCurrency(newData.realmoney);
          newData.totalmoney3 = ((newData.totalmoney * 1000000 - newData.realmoney * 1000000) / 1000000).toString()
          // newData.paymoney  = newData.paymoney  + ' 元'
          // newData.realmoney = newData.realmoney + ' 元'
        } else {
          newData.totalmoney = (newData.totalmoney - 0 ).toFixed(2);
          newData.big = util.convertCurrency(newData.totalmoney);
        }
        return newData;
      }
    },
    
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