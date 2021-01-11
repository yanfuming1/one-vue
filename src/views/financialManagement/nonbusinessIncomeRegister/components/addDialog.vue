<template>
  <d2-container class="nonbAdd_Dialog">
    <el-card class="box-card closeHeader">
      <div slot="header">
        <el-button  type="text" @click="cancelBtn"><i class="el-icon-close"></i></el-button>
      </div>
      <qqt-flow-tabs :procInstId="modelData.procInstId" :pdfId="modelData.pdfId">
          <template slot="content">
              <fm-generate-form
                class="addForm"
                :data="jsonData"
                :value="isAdd === true ? values : newData"
                :remote="remote"
                :transform="transform"
                @on-change="onChange"
                ref="generateForm">
                <template slot="collectModule">
                  <collect-module :selectData="paySelectData" ref="paySelect" :isShowDetails="transform.isShowDetails"  :data="payCollectData"  @selectChange="selectChange"></collect-module>
                </template>
                <template slot="collectModule1">
                  <collect-module :selectData="recSelectData" ref="recSelect" :isShowDetails="transform.isShowDetails"  :data="recCollectData"  @selectChange="selectChange"></collect-module>
                </template>
                <template slot="relevance">
                  <associated-documents ref="relevance" size="small" :transform="relevance" :relevance="isAdd === true ? values : newData" />
                </template>
                </fm-generate-form>
                <bottomInformation :values="newData" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation"></bottomInformation>
              <el-row class="d2-mt-10">
                <el-col :span="24" style="text-align:center">
                    <el-button size="small" type="warning" @click="saveBtn"  v-if="isAdd && !isSendBack">保存</el-button>
                    <el-button size="small" type="primary" v-if="isAdd && isSendBack" @click="anewSubmitBtn">重新提交</el-button>
                    <el-button size="small" type="primary" @click="submitBtn"   v-else-if="isAdd" >提交</el-button>
                    <el-button size="small" type="primary"  @click="cancelBtn">{{isAdd?'取消': '关闭'}}</el-button>
                </el-col>
              </el-row>
          </template>
      </qqt-flow-tabs>
    </el-card>
    <qqt-send-process :prossValue="processValue" :isSendBack="isSendBack" :dialogVisible="dialogVisible" :processModuleId="processModuleId" @close="closeFun" @selectData="selectDataFun"></qqt-send-process>
    <verify-code v-if="codeShow" :money="money" @verifySuccess="verifySuccess" :moduleData="moduleData" :compareMoney="compareMoney"  @verifyClose="verifyClose" ></verify-code> 
  </d2-container>
</template>

<script>
  import { formGetJson } from '../../../../api/system/fromManagement/index'
  import { getNonbusinessIncomeRegisterAdd,addNonbusinessIncomeRegister,goAdd,getEdit,editNonbusinessIncomeRegister,
           getSubmit,submitNonbusinessIncomeRegister,updateAfterSubmit,resetSubmitNonbusinessIncomeRegister,complete,getByAssociatedList} from '../../../../api/financialManagement/nonbusinessIncomeRegister';
  import { qqtInput, qqtInputNumber, qqtCascader, qqtRadio, qqtSelect, qqtSwitch,qqtFlowTabs, associatedDocuments, upload, qqtSendProcess } from '../../../../components/qqt-subassembly'
  import util from '@/libs/util.js'
  import { mapActions } from 'vuex';
  import verifyCode from '../../../../components/verifyCode';
  import { configQueryById} from '../../../../api/configuration/index'; // 获取系统配置
  import collectModule from '../../../approval/components/pushPage/components/collectModule';
  import bottomInformation from '../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
  export default {
    name:'addDialog',
    components: {
      qqtInput,
      qqtInputNumber,
      qqtCascader,
      qqtRadio,
      upload,
      qqtSendProcess,
      qqtSelect,
      qqtSwitch,
      qqtFlowTabs,
      verifyCode,
      collectModule,
      bottomInformation,
      associatedDocuments
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
      isJump: {
        type: Boolean,
        default: false
      },
      isSendBack: {
        type: Boolean,
        default: false
      },
      identification: {
        type: String,
        default: null
      }
    },
    data() {
      let that = this;
      return {
        payCollectData: {
          name: '',
          openingBank: '',
          account: '',
        },
        recCollectData: {
          name: '',
          openingBank: '',
          account: '',
        },
        paySelectData: [],
        recSelectData: [],
        upLoadFileDefaultList:[],
        jsonData: {},
        fileList:[],
        paysData:[],
        recsData:[],
        paysArr: [],
        recsArr: [],
        paywaysData:[],
        processValue: {
          title: '',
          pdfId: '',
          degree: '',
        },
        values: {
          payname: '',
          paybank: '',
          payaccount: '',
          recname: '',
          recbank: '',
          recaccount: '',
          paymoney: '',
          payway: '',
          paymessage: '',
          payman: '',
          paycell: '',
          recmessage: '',
          projectName: '',
          projectCode: '',
          projectType: '',
          projectId: '',
        },
        transform: {
          isShowDetails: !this.isAdd
        },
        relevance: {
          isShowDetails: !this.isAdd
        },
        isShowElement:true,
        addModel: {},
        remote:{
          getPaysData(resolve) {
                resolve(JSON.parse(JSON.stringify(that.paysData)));
          },
          getRecsData(resolve) {
              resolve(JSON.parse(JSON.stringify(that.recsData)));
          },
          getPaywaysData(resolve) {
              resolve(JSON.parse(JSON.stringify(that.paywaysData)));
          },
        },
        dialogVisible:false,
        processModuleId: '',
        submitData:{},
        codeShow:false,
        money: 0,
        moduleData:'',
        compareMoney: 0,
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
          this.paySelectData = res.pays || [];
          this.recSelectData = res.recs || [];
        })
      },
      // 保存
      saveBtn () {
        // this.isShowElement = !this.isShowElement;
        let url = '', relevance = '', element = ''
        relevance = this.$refs.relevance.getData ()
        element = this.$refs.bottomInformation.getData ()
        this.$refs.generateForm.getData().then(data => {
          this.$refs.paySelect.getData().then(payData => {
            this.$refs.recSelect.getData().then(recData => {
              if (!element) return
              Object.assign (data, element, relevance)
              data.payname = payData.name;
              data.paybank = payData.openingBank;
              data.payaccount = payData.account;
              data.recname = recData.name;
              data.recbank = recData.openingBank;
              data.recaccount = recData.account;
              if (this.isEdit) {
                // data.fileList = this.fileList;
                data.id = this.modelData.id;
                url = this.identification == '1' ? editNonbusinessIncomeRegister : getEdit
                url (data).then(res => {
                  this.$emit('successFun',res);
                })
              } else {
                // data.fileList = this.fileList;
                url = this.identification == '1' ? addNonbusinessIncomeRegister : getNonbusinessIncomeRegisterAdd
                url (data).then(res => {
                  this.$emit('successFun',res);
                })
              }
            })
          })
        })
      },
      // 提交
      submitBtn () {
          let relevance = this.$refs.relevance.getData ()
          let element = this.$refs.bottomInformation.getData ()
          this.$refs.generateForm.getData().then(data => {
            this.$refs.paySelect.getData().then(payData => {
              this.$refs.recSelect.getData().then(recData => {
                if (!element) return
                Object.assign (data, element, relevance)
                data.payname = payData.name;
                data.paybank = payData.openingBank;
                data.payaccount = payData.account;
                data.recname = recData.name;
                data.recbank = recData.openingBank;
                data.recaccount = recData.account;
                let jsonData = JSON.parse(JSON.stringify(data));
                this.submitData = jsonData;
                this.getVerify().then(obj=>{
                    if (obj.type) {
                      if (Number(this.submitData.paymoney) > Number(obj.data.value)) {
                        this.money = this.submitData.paymoney;
                        this.compareMoney = obj.data.value;
                        this.moduleData = obj.data.name;
                        this.codeShow = true;
                      } else {
                        this.processModuleId = 'nonbusinessIncomeRegister'; 
                        this.processValue.title = `营业外收入登记，金额:【${jsonData.paymoney}元】`
                        this.dialogVisible = true;  
                      }
                    } else {
                        this.processModuleId = 'nonbusinessIncomeRegister'; 
                        this.processValue.title = `营业外收入登记，金额:【${jsonData.paymoney}元】`
                        this.dialogVisible = true; 
                    }
                })
              })
            })
          })
      },
      // 重新提交
      anewSubmitBtn (){
          let relevance = this.$refs.relevance.getData ()
          let element = this.$refs.bottomInformation.getData ()
          this.$refs.generateForm.getData().then(data => {
            this.$refs.paySelect.getData().then(payData => {
              this.$refs.recSelect.getData().then(recData => {
                if (!element) return
                Object.assign (data, element, relevance)
                data.payname = payData.name;
                data.paybank = payData.openingBank;
                data.payaccount = payData.account;
                data.recname = recData.name;
                data.recbank = recData.openingBank;
                data.recaccount = recData.account;
                let jsonData = JSON.parse(JSON.stringify(data));
                this.submitData = jsonData;
                this.getVerify().then(obj=>{
                  if (obj.type) {
                    if (Number(this.submitData.paymoney) > Number(obj.data.value)) {
                      this.money = this.submitData.paymoney;
                      this.compareMoney = obj.data.value;
                      this.moduleData = obj.data.name;
                      this.codeShow = true;
                    } else {
                      this.processModuleId = 'nonbusinessIncomeRegister'; 
                      this.processValue.title = `营业外收入登记，金额:【${jsonData.paymoney}元】`;
                      this.processValue.pdfId = this.modelData.pdfId;
                      this.processValue.degree = this.modelData.degree;
                      this.dialogVisible = true; 
                    }
                  } else {
                      this.processModuleId = 'nonbusinessIncomeRegister'; 
                      this.processValue.title = `营业外收入登记，金额:【${jsonData.paymoney}元】`;
                      this.processValue.pdfId = this.modelData.pdfId;
                      this.processValue.degree = this.modelData.degree;
                      this.dialogVisible = true; 
                  }
                })
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
        let url = ''
        this.submitData.completeTask = data;
        // this.submitData.fileList = this.fileList;
        this.submitData.paymoney = util.moneyFormat(this.submitData.paymoney);
        let companyData = this.$refs.bottomInformation.getData ();
        this.submitData = {
          ...this.submitData,
          ...companyData
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
            url = this.identification == '1' ? resetSubmitNonbusinessIncomeRegister : updateAfterSubmit
            updateAfterSubmit (this.submitData).then(res =>{
              this.dialogVisible = false;
              this.$emit('successFun',res);
            })
          } else {
            url = this.identification == '1' ? submitNonbusinessIncomeRegister : getSubmit
            getSubmit (this.submitData).then(res => {
              this.dialogVisible = false;
              this.$emit('successFun',res);
            })
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
      // 上传附件
      upLoadFileCallBack (item) {
          this.fileList = item
      },
      onChange (name,value,data) {
        this.values[name] = value;
        if (name === 'payname') {
        let data = this.queryNameByIdpays(value);
        this.values.payname = value;
          this.values.paybank = data.openingBank;
          this.values.payaccount = data.account;
        }
        if (name === 'recname') {
          let data = this.queryNameByIdrecs(value);
          this.values.recname = value;
          this.values.recbank = data.openingBank;
          this.values.recaccount = data.account;
        }

      },
      queryNameByIdpays (id) {
          let data = {};
          for (let i = 0; i < this.paysArr.length; i++) {
            if (id === this.paysArr[i].id) {
              data = this.paysArr[i];
            }
          }
          return data;
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
            configQueryById({id:'1196667467338907648'}).then(res => {
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
          this.processModuleId = 'nonbusinessIncomeRegister'; 
          this.processValue.title = `营业外收入登记，金额:【${this.modelData.paymoney}元】`;
          this.processValue.pdfId = this.modelData.pdfId;
          this.processValue.degree = this.modelData.degree;
          this.dialogVisible = true; 
        } else {
          this.processModuleId = 'nonbusinessIncomeRegister'; 
          this.processValue.title = `营业外收入登记，金额:【${this.submitData.paymoney}元】`
          this.dialogVisible = true; 
        }
      },
    },
    created () {
      if (this.identification == '1') this.relevance.isShowDetails = true
    },
    mounted () {
      goAdd ().then(res=>{
        // 获取下拉框值
        this.paySelectData = res.pays;
        this.recSelectData = res.recs;
        this.paysData = [];
        this.recsData = [];
        this.paywaysData = [];
        this.paysArr = res.pays;
        this.recsArr = res.recs;
        for (let i = 0; i < res.pays.length; i++) {
          let obj = {
            value: res.pays[i].id,
            label: res.pays[i].name,
          }   
          this.paysData.push(obj)       
        }
        for (let i = 0; i < res.recs.length; i++) {
          let obj = {
            value: res.recs[i].id,
            label: res.recs[i].name,
          }   
          this.recsData.push(obj)       
        }
        for (let i = 0; i < res.payways.length; i++) {
          let obj = {
            value: res.payways[i].name,
            label: res.payways[i].name,
          }   
          this.paywaysData.push(obj)       
        }
      }).finally(res=>{
        // 获取表单设计器数据
        formGetJson({code: 'nonbusinessIncomeRegister'}).then(res => {
            this.jsonData = JSON.parse(res)
        }).catch(res => {
        }).finally(res=>{
            if (this.isCopy=== true || this.isSendBack === true ) {
              this.upLoadFileDefaultList = [];
              // for (let i = 0; i < this.paysArr.length; i++) {
              //     if (this.paysArr[i].name === this.modelData.payname && this.paysArr[i].openingBank === this.modelData.paybank && this.paysArr[i].account === this.modelData.payaccount) {
              //       this.modelData.payname = this.paysArr[i].id;
              //     }
              // }
              // for (let i = 0; i < this.recsArr.length; i++) {
              //     if (this.recsArr[i].name === this.modelData.recname && this.recsArr[i].openingBank === this.modelData.recbank && this.recsArr[i].account === this.modelData.recaccount) {
              //       this.modelData.recname = this.recsArr[i].id;
              //     }
              // }
              this.payCollectData.name = this.modelData.payname;
              this.payCollectData.openingBank = this.modelData.paybank;
              this.payCollectData.account = this.modelData.payaccount;

              this.recCollectData.name = this.modelData.recname;
              this.recCollectData.openingBank = this.modelData.recbank;
              this.recCollectData.account = this.modelData.recaccount;
              // fileList 赋值
              this.modelData.fileList = this.modelData.fileList || [];
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
              this.modelData.paymoney = this.modelData.paymoney + '';
              util.setObjval(this.values,this.modelData)
            }
        })
      })
    },
    computed: {
      newData () {
        let newData = {};
        // for (let i = 0; i < this.paysArr.length; i++) {
        //     if (this.paysArr[i].name === this.modelData.payname && this.paysArr[i].openingBank === this.modelData.paybank && this.paysArr[i].account === this.modelData.payaccount) {
        //       this.modelData.payname = this.paysArr[i].id;
        //     }
        // }
        // for (let i = 0; i < this.recsArr.length; i++) {
        //     if (this.recsArr[i].name === this.modelData.recname && this.recsArr[i].openingBank === this.modelData.recbank && this.recsArr[i].account === this.modelData.recaccount) {
        //       this.modelData.recname = this.recsArr[i].id;
        //     }
        // }
        this.payCollectData.name = this.modelData.payname;
        this.payCollectData.openingBank = this.modelData.paybank;
        this.payCollectData.account = this.modelData.payaccount;

        this.recCollectData.name = this.modelData.recname;
        this.recCollectData.openingBank = this.modelData.recbank;
        this.recCollectData.account = this.modelData.recaccount;
        newData = this.modelData;
        this.upLoadFileDefaultList = [];
        this.modelData.fileList = this.modelData.fileList || [];
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
        newData.paymoney = (newData.paymoney - 0 ).toFixed(2);
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