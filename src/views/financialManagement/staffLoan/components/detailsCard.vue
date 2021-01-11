<template>
  <d2-container class="staffLoan_Dialog">
    <el-card class="box-card closeHeader">
      <div slot="header" >
        <el-button type="text" @click="cancelBtn"><i class="el-icon-close"></i></el-button>
      </div>
      <qqt-flow-tabs v-if="procInstId" :procInstId="procInstId" :pdfId="pdfId">
          <template slot="content">
            <fm-generate-form
            class="addForm"
            :data="jsonData"
            :value="newValue"
            :transform="transform"
            :remote="remote"
            @on-change="onChange"   
            ref="generateForm">
                 <template slot="relevance">
                      <associated-documents :isTypeRequired="identification == '1' ? false : true" ref="relevance" size="small" :transform ="transform"  :relevance="newValue" />
                  </template> 
            </fm-generate-form>
            <qqt-table v-if="tableData.records.length>0 && editShow === false " :data="tableData" 
              :rowHeader="rowHeader" 
              :option="tableOption"    
              :isShowSelection="false"  
              :pageShow="false" >
            </qqt-table>
            <div class="add-customer-content___upload">
                <label for="male">
                    <upload id="male"  ref="upLoad" :isShowUpload="isShowUpload" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList"></upload>
                </label>
                <!--  -->
            </div>
            <bottomInformation :fieldTitle="'借款'" :timeTitle="'申请'" :values="newValue" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
            <el-row class="d2-mt-15">
              <el-col :span="24" style="text-align:center">
                  <el-button size="small" type="warning" v-if="editShow && !isSendBack" @click="saveBtn">保存</el-button>
                  <el-button size="small" type="primary" v-if="editShow && isSendBack" @click="anewSubmitBtn" >重新提交</el-button>
                  <el-button size="small" type="success" v-else-if="editShow" @click="submitBtn" >提交</el-button>
                  <el-button type="info" size="small" v-if="" @click="printTemplate">打印</el-button>
                  <el-button size="small" type="primary"  @click="cancelBtn">{{editShow?'取消': '关闭'}}</el-button>
              </el-col>
            </el-row>
          </template>
      </qqt-flow-tabs>
      <template v-else>
            <fm-generate-form
            class="addForm"
            :data="jsonData"
            :value="newValue"
            :transform="transform"
            :remote="remote"
            @on-change="onChange"
            ref="generateForm">
                 <template slot="relevance">
                      <associated-documents :isTypeRequired="identification == '1' ? false : true" ref="relevance" size="small" :transform ="transform"  :relevance="newValue" />
                  </template> 
            </fm-generate-form>
            <qqt-table v-if="tableData.records.length>0 && editShow === false " :data="tableData" 
              :rowHeader="rowHeader" 
              :option="tableOption"    
              :isShowSelection="false"  
              :pageShow="false">
            </qqt-table>
            <div class="add-customer-content___upload">
                <label for="male">
                    <upload id="male" ref="upLoad" :isShowUpload="isShowUpload" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList"></upload>
                </label>
            </div>
            <bottomInformation :fieldTitle="'借款'" :timeTitle="'申请'" :values="newValue" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
            <el-row class="d2-mt-15">
              <el-col :span="24" style="text-align:center">
                  <el-button size="small" type="warning" v-if="editShow && !isSendBack" @click="saveBtn">保存</el-button>
                  <el-button size="small" type="primary" v-if="editShow && isSendBack" @click="anewSubmitBtn">重新提交</el-button>
                  <el-button size="small" type="success" v-else-if="editShow" @click="submitBtn">提交</el-button>
                  <el-button type="info" size="small" v-if="!editShow" @click="printTemplate">打印</el-button>
                  <el-button size="small" type="primary" @click="cancelBtn">{{editShow?'取消': '关闭'}}</el-button>
              </el-col>
            </el-row>
          </template>
    </el-card>
    <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    <qqt-send-process :prossValue="processValue" :isSendBack="isSendBack" :dialogVisible="dialogVisible" :processModuleId="processModuleId" @close="closeFun" @selectData="selectDataFun"></qqt-send-process>
    <verify-code v-if="codeShow" :money="money" @verifySuccess="verifySuccess" :moduleData="moduleData" :compareMoney="compareMoney"  @verifyClose="verifyClose" ></verify-code> 
  </d2-container>
</template>

<script>
  import { formGetJson } from '../../../../api/system/fromManagement/index'
  import { getTableAdd,getSelfTableAdd,goAdd,listyBstaffLoan,updateAfterSubmit,updateSelfAfterSubmit,nodeInfoStartCrew,goDetail,goEdit,completeFun,submitFun,submitSelfFun} from '../../../../api/financialManagement/staffLoan';
  import util from '@/libs/util.js'
  import { FINANCIALMANAGEMENT } from '../../../../enum/FORMCODE'
  import bottomInformation from '../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
  import { qqtFlowDiagram,qqtFlowTabs,upload,qqtTable,qqtSendProcess,associatedDocuments, qqtRelateTable} from '../../../../components/qqt-subassembly'
  import verifyCode from '../../../../components/verifyCode';
  import { configQueryById} from '../../../../api/configuration/index'; // 获取系统配置
  import { mapState } from 'vuex'
  import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
  import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
  import printTemplateByHtml from '@/views/systemManagement/printTemplate/components/printTemplateByHtml'

  export default {
    name:'detailsCard',
    components: {
      qqtFlowDiagram,
      qqtFlowTabs,
      upload,
      qqtTable,
      qqtSendProcess,
      verifyCode,
      bottomInformation,
      associatedDocuments,
      'print-template-by-html': printTemplateByHtml
    },
    props: {
      detailData: {
        type: Object,
      },
      pdfId: {
        type: String,
      },
      procInstId: {
        type: String,
      },
      editShow: {
        type: Boolean,
        default:  false
      },
      isSendBack: {
        type: Boolean,
        default:  false
      },
      isJump: {
        type: Boolean,
        default:  false
      },
      isCopy: {
        type: Boolean,
        default:  false
      },
      type: {
        type: String,
      },
    },
    data() {
      let that = this;
      return {
        upLoadFileDefaultList:[],
        fileList:[],
        tableData: {
          current: 1,
          pages: 1,
          records: [],
          searchCount: true,
          size: 10,
          total: 1
        },
        processValue: {
          title: '',
          pdfId: '',
          degree: '',
        },
        processModuleId: '',
        identification:null,
        dialogVisible:false,
        jsonData: {},
        values: {},
        accountnameArr:[],
        accountnameData:[],
        isShowElement:true,
        remote:{
           getAccountname(resolve) {
                resolve(JSON.parse(JSON.stringify(that.accountnameData)));
            },
        },
        addModel: {},
        transform: {
            isShowDetails: !this.editShow
        },
        rowHeader: [
          {
              prop: 'verificationmoney',
              label: '核销金额',
              isOpenSummary: true,
              isShow: true,
              render: (h,params) =>{
                let text = (params.row.verificationmoney).toFixed(2)
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
              prop: 'verpercentage',
              label: '核销百分比',
              isShow: true,
              render: (h,params) =>{
                let text = params.row.verpercentage + '%'
                return h('div',{
                },text) 
              }
              
          },
          {
              prop: 'createdby',
              label: '核销人',
              isShow: true
          },
          {
              prop: 'createdbytime',
              label: '核销时间',
              isShow: true
          },
          {
              prop: 'verificationremark',
              label: '核销说明',
              isShow: true
          },
        ],
        tableOption: {
            border: false,
            isOpenSummary: true
        },
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
        isShowUpload: this.editShow,
        codeShow:false,
        money: 0,
        moduleData:'',
        compareMoney: 0,
        code: BASICSCODE.FINANCE_EMPLOYEE_BORROW
      }
    },
    methods: {
      // 保存
      saveBtn () {
        let relevance = this.$refs.relevance.getData ()
        let item = this.$refs.bottomInformation.getData ()
        this.$refs.generateForm.getData().then(data => {
          if(item) {
            let jsonData = JSON.parse(JSON.stringify(data));
            Object.assign(jsonData, item, relevance)
            jsonData.accountname = this.queryNameByIdCompany(jsonData.accountname).name; 
            delete jsonData.borrowingBalanceBig;
            jsonData.fileList = this.fileList;
            if (this.type === 'edit') {
              jsonData.id = this.detailData.id;
              goEdit (jsonData).then(res => {
                this.$emit('successFun',res);
              }).catch(err => {
                  console.log(err);
              });
            } else if (this.type === 'copy') {
              let url = ''
              this.identification == '1' ? url = getSelfTableAdd : url = getTableAdd
              if (this.identification == '1') {
                  url (jsonData,this.selfSupportProject.projectCode).then(res=>{
                  this.$emit('cancelBtn');
                  })
              } else {
                  url (jsonData).then(res=>{
                  this.$emit('cancelBtn');
                  })
              }
            }
          }
        })
      },
      // 提交
      submitBtn () {
        let relevance = this.$refs.relevance.getData ()
        let item = this.$refs.bottomInformation.getData ()
        this.$refs.generateForm.getData().then(data => {
          if(item) {
            let jsonData = JSON.parse(JSON.stringify(data));
            Object.assign(jsonData, item, relevance)
            jsonData.accountname = this.queryNameByIdCompany(jsonData.accountname).name; 
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
                    this.processValue.title = `员工借款申请，金额:【${jsonData.borrowmoney}元】`
                    this.processValue.pdfId = this.detailData.pdfId;
                    this.processValue.degree = this.detailData.degree;
                    this.dialogVisible = true; 
                  }
                } else {
                    this.processModuleId = 'staffLoan'; 
                    this.processValue.title = `员工借款申请，金额:【${jsonData.borrowmoney}元】`
                    this.processValue.pdfId = this.detailData.pdfId;
                    this.processValue.degree = this.detailData.degree;
                    this.dialogVisible = true; 
                }
            })
          }
        }).catch(e => {
            console.log(e)
        })
      
      },
      // 重新提交
      anewSubmitBtn (){
        this.$refs.generateForm.getData().then(data => {
          let jsonData = JSON.parse(JSON.stringify(data));
          jsonData.accountname = this.queryNameByIdCompany(jsonData.accountname).name; 
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
                  this.processValue.title = `员工借款申请，金额:【${jsonData.borrowmoney}元】`
                  this.processValue.pdfId = this.detailData.pdfId;
                  this.processValue.degree = this.detailData.degree;
                  this.dialogVisible = true; 
                }
              } else {
                  this.processModuleId = 'staffLoan'; 
                  this.processValue.title = `员工借款申请，金额:【${jsonData.borrowmoney}元】`
                  this.processValue.pdfId = this.detailData.pdfId;
                  this.processValue.degree = this.detailData.degree;
                  this.dialogVisible = true; 
              }
          })
        }).catch(e => {
            console.log(e)
        })
      },
      closeFun () {
        this.dialogVisible = false;
      },
      selectDataFun (data) {
        this.submintData.completeTask = data;
        this.submintData.fileList = this.fileList;
        if (this.isSendBack) {
          let jsonData = this.submintData;
          jsonData.id = this.detailData.id;
          jsonData.flag = '1';
          jsonData.completeTask.taskId = this.detailData.taskId;
          completeFun(jsonData).then((res)=>{
            if (res.success) {
              this.$message.success('重新提交成功');
              this.$emit('successFun',res);
            }
          })
        }else {
            let jsonData = this.submintData;
            if (this.isCopy) {
              let url = ''
              this.identification == '1' ? url = submitSelfFun : url = submitFun
              if (this.identification == '1') {
                  url (jsonData,this.selfSupportProject.projectCode).then(res=>{
                  this.$emit('cancelBtn');
                  })
              } else {
                  url (jsonData).then(res=>{
                  this.$emit('cancelBtn');
                  })
              }
             
            } else {
              jsonData.id = this.detailData.id;
              let url = ''
              this.identification == '1' ? url = updateSelfAfterSubmit : url = updateAfterSubmit
              if (this.identification == '1') {
                  url (jsonData,this.selfSupportProject.projectCode).then(res=>{
                  this.$emit('cancelBtn');
                  })
              } else {
                  url (jsonData).then(res=>{
                  this.$emit('cancelBtn');
                  })
              }
             
            }
        }
       
      },
      // 取消
      cancelBtn () {
        if (this.isJump) {
            this.$router.go(-1);
        }
        this.$emit('cancelBtn');
      },
      onChange (name,val,data) {
        if (name === 'accountname') {
          let obj = this.queryNameByIdCompany(val)
          this.newValue.bank = obj.openingBank;
          this.newValue.accountnumber = obj.account;
          this.newValue.accountname = val;
        }
        if (name === 'borrowmoney') {
          this.newValue.borrowmoney = val;
          this.newValue.borrowingBalanceBig = util.convertCurrency(val);
        }
        if (name === 'borrowreason') {
          this.newValue.borrowreason = val;
        }
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
      upLoadFileCallBack (item) {
          this.fileList = item;
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
        if (this.isSendBack) {
          this.processModuleId = 'staffLoan'; 
          this.processValue.title = `员工借款申请，金额:【${this.detailData.borrowmoney}元】`
          this.processValue.pdfId = this.detailData.pdfId;
          this.processValue.degree = this.detailData.degree;
          this.dialogVisible = true; 
        } else {
          this.processModuleId = 'staffLoan'; 
          this.processValue.title = `员工借款申请，金额:【${this.submintData.borrowmoney}元】`
          this.dialogVisible = true; 
        }
      },

      init () {
        if (this.$route.params) { 
          // console.log(this.$route.params)
          this.identification = this.$route.params.identification || null
        }
      },
      printTemplate () {
          getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.detailData.id}).then(res => {
            res.borrowmoneyUpper = util.convertCurrency(res.borrowmoney)
              if (res) this.$refs.printTemp.printTemplate (res)
          })
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
        formGetJson({code: 'staffLoan'}).then(res => {
            this.jsonData = JSON.parse(res)
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
        this.upLoadFileDefaultList = [];
        this.fileList = this.detailData.fileList;
        for (let i = 0; i < this.detailData.fileList.length; i++) {
            let obj ={
              status : 'finished',
              response : {
                  url : this.detailData.fileList[i].url,
                  name : this.detailData.fileList[i].name,
                  size : this.detailData.fileList[i].size,
              },
            };
          this.upLoadFileDefaultList.push(obj)
        }
        goDetail({id:this.detailData.id}).then(res=>{
          Object.assign(this.values,res)
          this.tableData.records = res.employeeVerifications;
        })
      })
      // nodeInfoStartCrew ('KEY_1159768618149789696:2:502535').then(res=>{
      //   console.log(res)
      // })
    },
    computed :{
        ...mapState ('d2admin/selfSupportProject', [
            'selfSupportProject'
        ]),

        newValue () {
          let newValue = {};
          for (let i = 0; i < this.accountnameArr.length; i++) {
              if (this.accountnameArr[i].name === this.detailData.accountname && this.accountnameArr[i].openingBank === this.detailData.bank && this.accountnameArr[i].account === this.detailData.accountnumber) {
                this.detailData.accountname = this.accountnameArr[i].id;
              }
          }
          newValue = this.detailData;
          newValue.borrowingBalanceBig = util.convertCurrency(newValue.borrowmoney);
          return newValue;
        },
     
    },

    created () {
      this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad')
      this.init()
    }
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