<template>
  <div>
    <el-dialog
      v-dialogDrag
      title="上传文件"
      v-if="showUpload"
      :visible.sync="showUpload"
      width="60%"
      :before-close="handleClose"
      >
      <el-upload
          class="upload-demo"
          :action="upLoadUrl"
          :on-change="handleChange"
          :on-exceed="handleExceed"
          :on-remove="handleRemove"
          :file-list="fileList"
          :before-upload="handleBeforeUpload"
          :limit="limitUpload"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          :auto-upload="false">
          <el-button size="mini" icon="el-icon-download" style="margin-right:30px">导入</el-button>
          <span slot="tip" class="el-upload__tip">只 能 上 传 xlsx / xls 文 件</span>
          <div style="margin-top:15px" slot="tip">
            <el-row>
              <el-col :span="3" style="text-align:right">
                选择银行模板：
              </el-col>
              <el-col :span="21">
                <el-select size="mini" style="width:100%" v-model="bank" placeholder="请选择银行模板信息">
                  <el-option
                    v-for="item in bankList"
                    :key="item.index"
                    :label="item.bank"
                    :value="item.bank">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <!-- <span style="width:100px;display: inline-block;text-align:right"></span>
            <el-select size="mini"  v-model="bank" placeholder="请选择银行模板信息">
              <el-option
                v-for="item in bankList"
                :key="item.index"
                :label="item.bank"
                :value="item.bank">
              </el-option>
            </el-select>
            <br> -->
          </div>
          <div style="margin-top:15px" slot="tip">
            <el-row>
              <el-col :span="3" style="text-align:right">公司收款账户：</el-col>
              <el-col :span="21">
                  <el-select style="width:100%"  size="mini"  v-model="companyBank" placeholder="请选择公司账户信息">
                    <el-option
                      v-for="item in companyBankList"
                      :key="item.index"
                      :label="item.name"
                      :value="item.id">
                      <span style="float: left">{{ item.name }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{item.openingBank}} {{ item.account }}</span>
                    </el-option>
                  </el-select>
              </el-col>
            </el-row>
            
             <!-- <span style="width:100px;display: inline-block;text-align:right">公司收款账户：</span>
             <el-select  size="mini"  v-model="companyBank" placeholder="请选择公司账户信息">
              <el-option
                v-for="item in companyBankList"
                :key="item.index"
                :label="item.name"
                :value="item.id">
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.account }}</span>
              </el-option>
            </el-select> -->
          </div>
          <div style="margin-top:15px" slot="tip">
            <bottomInformation :fieldTitle="'登记'" :timeTitle="'登记'" :isShowAccessory="false" :transform="{ isShowDetails: false }" ref="bottomInformation"></bottomInformation>
          </div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="okFun">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  
  </div>
</template>

<script>
import {queryBankList} from '../../../../api/financialManagement/upLoad';
import {goAdd} from '../../../../api/financialManagement/nonbusinessIncomeRegister';
import bottomInformation from '../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'

  export default {
    props: {
     showUpload:{
       type:Boolean,
       default:false
     },
    },
    data() {
      return {
        dialogVisible:this.showUpload,
        limitUpload: 1,
        fileList:[],
        bankList:[],
        companyBankList:[],
        bank:'',
        companyBank:'',
        upLoadUrl:'',
        // http://192.168.2.150/qqtoi/file/upload
        file:'',
      }
    },
    methods: {
      //文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
      handleChange(file, fileList) {
          this.file = file;
          this.fileList = fileList;
      },
      //文件超出个数限制时的钩子
      handleExceed() {
        this.$message.error('只支持单个文件上传')
      },
      //文件列表移除文件时的钩子
      handleRemove() {
        this.file = '';
        this.fileList = [];
      },
      //上传文件之前的钩子，参数为上传的文件
      handleBeforeUpload (file) {
        console.log(file)
      },
      handleClose() {
        this.file = '';
        this.fileList = [];
        this.$message.error('取消上传');
        this.$emit('closeDialog');
      },
      okFun() {
        if (!this.file) {
            this.$message.error('未选择文件');
            return;
        }
        if (!this.bank) {
          this.$message.error('未选择银行模板');
          return;
        }
        let form = {}, information = {}
        form = new FormData();
        form.append('file', this.file.raw);
        information = this.$refs.bottomInformation.getData ()
        if (information) {
          this.$emit('uploadFun',form,this.bank,this.companyBank, information);
          this.file = '';
          this.fileList = [];
        }
      },
      getBankList () {
        queryBankList().then(res => {
          this.bankList = res;
        })
      },
      getcompanyBankList() {
        goAdd().then(res=>{
          this.companyBankList = res.recs;
        })
      }
    },
    mounted () {
      this.getBankList();
      this.getcompanyBankList();
    },
    components: { bottomInformation }
  }
</script>

<style lang="scss" scoped>

</style>