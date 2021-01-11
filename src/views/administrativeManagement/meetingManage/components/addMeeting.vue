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
          <bottomInformation :fieldTitle="'拟稿'" :timeTitle="'提交'"  :isShowAccessory="false"  :transform="transform" ref="bottomInformation"></bottomInformation>
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
import goAdd from '../../../../api/administrativeManagement/meetingManage'

import {FINANCIALMANAGEMENT} from "@/enum/FORMCODE";
import {listyBstaffLoan} from "@api/financialManagement/staffLoan";
import { formGetJson } from '../../../../api/system/fromManagement/index'
import {upload} from '../../../../components/qqt-subassembly';
import bottomInformation from '../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
export default {
  name: "addMeeting",
  components:{
    upload,
    bottomInformation
  },
  data() {
    return {
      transform: {
        isShowDetails : false
      },
      jsonData: {},
      values: {
        topic: "",//会议议题
        datetime: "",//会议时间
        way: "",//会议方式
        site: "",//会议地址
        people: "",//通知人员
        means_ation: "",//通知方式
        top: "",//是否顶置
      }

    }
  },
  methods: {
    onChange(name, val, data) {
    },
    //保存
    saveBtn(){},
    //提交
    submitBtn(){},
    //取消
    cancelBtn(){
      this.$emit('return_home')
    },
    //附件上传
    upLoadFileCallBack(data){},
    //获取布局
    getdata(){
      formGetJson({
        code: 'addmeeting'
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