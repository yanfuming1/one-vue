<template>
  <d2-container class="staffLoan_Dialog">
    <el-card class="box-card closeHeader">
        <div slot="header">
          <el-button type="text" @click="a"><i class="el-icon-close"></i></el-button>
          <el-button type="text" @click="cancelBtn"><i class="el-icon-close"></i></el-button>
        </div>
        <fm-generate-form
          class="addForm"
          :data="jsonData"
          :value="values"
          :remote="remote"
          @on-change="onChange"
          ref="generateForm">
            <template slot="relevance">
              <associated-documents :isTypeRequired="identification == '1' ? false : true" ref="relevance" size="small"  :relevance="projectData" :transform="relevance"/>
            </template>
          </fm-generate-form>
          <div class="add-customer-content___upload">
              <label for="male">
                  <upload id="male"  ref="upLoad" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList"></upload>
              </label>
              <!-- :transform="transform" -->
              <bottomInformation :fieldTitle="'借款'" :timeTitle="'申请'" :values="values" :isShowAccessory="false"  :transform="transform" ref="bottomInformation"></bottomInformation>
          </div>
        <el-row>
          <el-col :span="24" style="text-align:center">
              <el-button size="small" type="warning" @click="saveBtn">保存</el-button>
              <el-button size="small" type="success" @click="submitBtn">提交</el-button>
              <el-button size="small" type="primary" @click="cancelBtn">取消</el-button>
          </el-col>
        </el-row>
    </el-card>
    <qqt-send-process :prossValue="processValue" :dialogVisible="flowShow" :processModuleId="processModuleId" @close="flowCancel" @selectData="flowOk"></qqt-send-process>
    <verify-code :money="money" @verifySuccess="verifySuccess" :moduleData="moduleData" :compareMoney="compareMoney"  @verifyClose="verifyClose" v-if="codeShow"></verify-code> 
  </d2-container>
</template>

<script>
  import { formGetJson } from '../../../../api/system/fromManagement/index'
  import { getTableAdd,getSelfTableAdd,TableAdd,goAdd,listyBstaffLoan,submitFun,submitSelfFun,nodeInfoStartCrew} from '../../../../api/financialManagement/staffLoan';
  import util from '@/libs/util.js'
  import { mapState } from 'vuex'
  import {upload,qqtSendProcess,associatedDocuments} from '../../../../components/qqt-subassembly';
  import { FINANCIALMANAGEMENT } from '../../../../enum/FORMCODE'
  import { qqtFlowDiagram } from '../../../../components/qqt-subassembly'
  import verifyCode from '../../../../components/verifyCode';
  import { configQueryById} from '../../../../api/configuration/index'; // 获取系统配置
  import bottomInformation from '../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
  export default {
    name:'addDialog',
    components: {
      qqtFlowDiagram,
      upload,
      qqtSendProcess,
      verifyCode,
      bottomInformation,
      associatedDocuments
    },
    // props: {
    //  modelData
    // },
    props: {
      modelData: {
        type: Object,
      },
    },
    data() {
      let that = this;
      return {
        upLoadFileDefaultList:[],
        jsonData: {},
        fileList:[],
        transform: {
          isShowDetails : false
        },
        relevance: {
          isShowDetails : false
        },
        identification:null,
        values: {
          accountname: '',
          bank: '',
          accountnumber: '',
          borrowingBalanceBig: '',
          borrowmoney: '',
          projectName: '',
          projectCode: '',
          projectType: '',
          projectId: '',
        },
        projectData:{
          projectName: '',
          projectCode: '',
          projectType: '',
          projectId: ''
        },
        processModuleId: '',
        processValue: {
          title: '',
          pdfId: '',
          degree: '',
        },
        accountnameArr:[],
        accountnameData:[],
        isShowElement:true,
        remote:{
           getAccountname(resolve) {
                resolve(JSON.parse(JSON.stringify(that.accountnameData)));
            },
        },
        addModel: {},
        flowShow: false,
        form: {
          pdfId: '',
          title: '',
          degree: '',
        },
        rules: {
          pdfId: [
            { required: true, message: '请选择业务流程', trigger: ['change','blur'] }
          ],
          title: [
            { required: true, message: '请选择标题', trigger: ['change','blur'] }
          ],
          degree: [
            { required: true, message: '请选择业务类型', trigger: ['change','blur'] }
          ],
        },
        flowList: [],
        flowDiagram: [],
        submintData: {},
        codeShow:false,
        money: 0,
        moduleData:'',
        compareMoney: 0,
      }
    },
    methods: {
      a(){
        console.log("=========")
        console.log(this.jsonData)
        console.log(this.values)
        console.log(this.remote)
      },
      // 保存
      saveBtn () {
        let relevance = this.$refs.relevance.getData ()
        let item = this.$refs.bottomInformation.getData ()
        this.$refs.generateForm.getData().then(data => {
          if(item) {
            let jsonData = JSON.parse(JSON.stringify(data));
            jsonData.accountname = this.queryNameByIdCompany(jsonData.accountname).name; 
            delete jsonData.borrowingBalanceBig;
            jsonData.fileList = this.fileList;
            Object.assign(jsonData, item, relevance)
            // let url = ''
            // this.identification == '1' ? url = getSelfTableAdd : url = getTableAdd
            if ( this.identification == '1') {
               getSelfTableAdd (jsonData,jsonData.projectCode).then(res => {
                  this.$emit('successFun',res);
                }).catch(err => {
                    console.log(err);
                })
            }else {
                getTableAdd (jsonData,jsonData.projectCode).then(res => {
                  this.$emit('successFun',res);
                }).catch(err => {
                    console.log(err);
                })
            }
            // url (jsonData,this.selfSupportProject.projectCode).then(res => {
            //   this.$emit('successFun',res);
            // }).catch(err => {
            //     console.log(err);
            // })
          }
        }).catch(e => {
            console.log(e)
        })
      },
      // 提交
      submitBtn () {
        let relevance = this.$refs.relevance.getData ()
        let item = this.$refs.bottomInformation.getData ()
        this.$refs.generateForm.getData().then(data => {
          if(item){
            let jsonData = JSON.parse(JSON.stringify(data));
            jsonData.accountname = this.queryNameByIdCompany(jsonData.accountname).name; 
            Object.assign(jsonData, item, relevance)
            this.submintData = jsonData;
            this.getVerify().then(obj=>{
                if (obj.type) {
                  if (Number(this.submintData.borrowmoney) > Number(obj.data.value)) {
                    this.money = this.submintData.borrowmoney;
                    this.compareMoney = obj.data.value;
                    this.moduleData = obj.data.name;
                    this.codeShow = true;
                  } else {
                    this.processModuleId = 'staffLoan'; 
                    this.submintData = jsonData;
                    this.processValue.title = `员工借款申请，金额:【${jsonData.borrowmoney}元】`
                    this.flowShow = true; 
                  }
                } else {
                    this.processModuleId = 'staffLoan'; 
                    this.submintData = jsonData;
                    this.processValue.title = `员工借款申请，金额:【${jsonData.borrowmoney}元】`
                    this.flowShow = true; 
                }
            })
          }
        }).catch(e => {
        })
      },
      flowCancel () {
        this.flowShow = false;
      },
      flowOk (data) {
        let url = ''
        let relevance = this.$refs.relevance.getData ()
        Object.assign(this.submintData, relevance)
        this.submintData.completeTask = data;
        this.submintData.fileList = this.fileList;
        this.identification == '1' ? url = submitSelfFun : url = submitFun
        url (this.submintData, this.submintData.projectCode).then(res=>{
          this.$emit('cancelBtn');
        })
      },
      // 取消
      cancelBtn () {
        this.$emit('cancelBtn');
      },
      onChange (name,val,data) {
        if (name === 'accountname') {
          let obj = this.queryNameByIdCompany(val)
          if (obj) {
            this.values.bank = obj.openingBank;
            this.values.accountnumber = obj.account;
            this.values.accountname = val;
          }
        }
        if (name === 'borrowmoney') {
          this.values.borrowmoney = val;
          this.values.borrowingBalanceBig = util.convertCurrency(val);
        }
        this.values[name] = val;
      },
      queryNameByIdCompany (id) {
          let data = {};
          for (let i = 0; i < this.accountnameArr.length; i++) {
            if (id === this.accountnameArr[i].id) {
              data = this.accountnameArr[i];
            }
          }
          return data;
      },
      flowChange (val) {
        console.log(val)
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
            configQueryById({id:'1194913704675880960'}).then(res => {
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
        this.processModuleId = 'staffLoan'; 
        this.processValue.title = `员工借款申请，金额:【${this.submintData.borrowmoney}元】`
        this.flowShow = true; 
      },

      init () {
      if (this.$route.params) { 
        // console.log(this.$route.params)
        this.identification = this.$route.params.identification || null
      }
      },

      hadProject () {
        // this.values.projectCode = this.selfSupportProject.projectCode
        // this.values.projectName = this.selfSupportProject.projectName
        // this.values.projectId = this.selfSupportProject.id
        //  this.values.projectType = "1"
      }

    },
    mounted () {
      goAdd().then(res=>{
        this.accountnameArr = res.banks;
        this.accountnameData = [];
         for (let i = 0; i < this.accountnameArr.length; i++) {
              let obj = {
                value: this.accountnameArr[i].id,
                label: this.accountnameArr[i].name,
              }
              this.accountnameData.push(obj)
          }
      }).finally(res=>{
        formGetJson({
            code: 'staffLoan'
        }).then(res => {
            this.jsonData = JSON.parse(res)
        }).catch(res => {
        })
        let jsonData = {
            formKey:FINANCIALMANAGEMENT.STAFFLOAN
        };
        listyBstaffLoan (jsonData).then(res=>{
          this.flowList = [];
          for (let i = 0; i < res.length; i++) {
              this.flowList.push(res[i])
          }
        });
       
      })
      this.identification == '1' ? this.relevance.isShowDetails = true : this.relevance.isShowDetails = false
      if (this.identification == '1') { this.hadProject ()  }
    },

    created () {
      this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad')
      this.init()
    },

    computed: {
      ...mapState ('d2admin/selfSupportProject', [
          'selfSupportProject'
      ])
    },
  }
</script>

<style lang='scss'>
  .staffLoan_Dialog input::-webkit-outer-spin-button,
  .staffLoan_Dialog input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  .staffLoan_Dialog input[type="number"]{
    -moz-appearance: textfield;
  }
  .staffLoan_Dialog{
    .box-card{
      min-height: 100%;
    }
  }
</style>