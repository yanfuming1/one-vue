<template>
  <div>
    <d2-container class="meetingManage_addmeeting">
      <el-card class="box-card closeHeader">
        <div slot="header">
          <el-button type="text" @click="$emit('return_home','添加')"><i class="el-icon-close"></i></el-button>
        </div>
        <fm-generate-form
            class="addForm"
            :data="jsonData"
            :value="values"
            @on-change="onChange"
            ref="generateForm"
        >

        </fm-generate-form>

        <div class="add-customer-content___upload">
          <label for="male">
            <upload id="male"  ref="upLoad" @upLoadFileCallBack="upLoadFileCallBack" ></upload>
          </label>
          <!-- :transform="transform" -->
          <bottomInformation :fieldTitle="'记录'" :timeTitle="'提交'" :values="values" :isShowAccessory="false"  :transform="transform" ref="bottomInformation"></bottomInformation>
        </div>



        <el-row>
          <el-col :span="24" style="text-align:center">
            <el-button size="small" type="warning" @click="saveBtn">保存</el-button>
            <el-button size="small" type="success" @click="submitBtn">提交</el-button>
            <el-button size="small" type="primary" @click="cancelBtn">取消</el-button>
          </el-col>
        </el-row>
      </el-card>
    </d2-container>
  </div>
</template>

<script>
import {upload} from '../../../../components/qqt-subassembly';
import bottomInformation from '../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
import {formGetJson} from "@api/system/fromManagement";
export default {
  name: "recordMeeting",

  props:['rocorddata'],
  components:{
    upload,
    bottomInformation
  },
  data() {
    return {
      jsonData:{},
      transform: {
        isShowDetails : false
      },
      values: {
        topic: '11',//会议议题
        datatime: '',//
        way: '',//会议方式
        site: '',//会议地址
        inform: '',//通知人员
        attend: '',//到会人员
        password: '',//密级
        scope: '',//范围
        mode: '',//通知方式
        tf:"是"//是否置顶
      },
    }
  },
  methods: {
    onChange(name, val, data) {
    },
    //保存
    saveBtn(){
      console.log(this.rocorddata)
    },
    //提交
    submitBtn(){},
    //取消
    cancelBtn(){
      this.$emit('return_home')
    },
    upLoadFileCallBack(data){
      console.log(data)
    },
    //获取布局
    getdata(){
      formGetJson({
        code: 'jilu'
      }).then(res => {
        this.jsonData = JSON.parse(res)
      }).catch(res => {
      })
    },

  },
  mounted() {
 this.getdata()

  },
  created() {

  }
}
</script>

<style scoped>

</style>