<template>
  <div>
    <common :requestType="requestType" @selectChange="selectChange" :refresh="refresh">
      <el-form-item slot="sendBackDel">
          <el-button type="danger" @click="repealFun">撤回</el-button>
      </el-form-item>
    </common>
  </div>
</template>

<script>
  import common from '../components/common/index';
  import withdrawApi from '../../../api/approval/common/withdrawApi/index';
  import withdraw from '../../../api/approval/common/withdrawApi/withdraw';
  export default {
    components: {
      common,
    },
    data() {
      return {
        requestType: 'HAVE_FINISHED',
        selectData: [],
        refresh: false
      }
    },
     methods: {
      selectChange (row) {
        this.selectData = row;
      },
       repealFun() {
        if (this.selectData.length === 1) {
          if (this.selectData[0].processVariables.processState === "10") {
            this.$message.error('该流程已完结，不可撤回');
            return
          }
          if (this.selectData[0].processVariables.processState === "5") {
            this.$message.error('该流程已作废，不可撤回');
            return
          }
          let formKey = this.selectData[0].processVariables.formKey;
          let url = withdraw.url(formKey);
          let jsonData = {
            relevancyId: this.selectData[0].processVariables.relevancyId,
            taskId: this.selectData[0].myTaskId,
          }
          withdrawApi[url](jsonData).then(res=>{
            if (res.success) {
              this.refresh = true;
              this.$message.success('撤回成功')
            } else {
              this.$message.error(res.message)
            }
          }) 
        } else if (this.selectData.length === 0) {
          this.$message.error('请选择要撤销的数据');
          this.refresh = false;
        } else {
          this.$message.error('只支持单条数据操作');
          this.refresh = false;
        }
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>