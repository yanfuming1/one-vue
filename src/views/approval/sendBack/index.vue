<template>
  <div>
    <common :requestType="requestType" @selectChange="selectChange" :refresh="refresh">
       <el-form-item slot="sendBackDel">
          <el-button type="danger" @click="sendBackDelFun">撤销</el-button>
      </el-form-item>
    </common>
  </div>
</template>

<script>
  import common from '../components/common/index';
  // import New from '@/components/New.vue';
  import repealApi from '../../../api/approval/common/repealApi/index';
  import repeal from '../../../api/approval/common/repealApi/repeal';
  import {findByTaskId} from '../../../api/approval/common';
  export default { 
    components: {
      common,
    },
    data() {
      return {
        requestType: 'SEND_BACK',
        selectData: [],
        refresh: false
      }
    },
    methods: {
      selectChange (row) {
        this.selectData = row;
      },

      sendBackDelFun() {
        if (this.selectData.length === 1) {
          if (this.selectData[0].processVariables.processState != "4") {
            this.$message.error('只有已驳回的支持撤销');
            return
          }
          let formKey = this.selectData[0].processVariables.formKey;
          console.log(formKey);
          let url = repeal.url(formKey);
          repealApi[url]({id:this.selectData[0].processVariables.relevancyId}).then(res=>{
            if (res.success) {
              this.refresh = true;
              this.$message.success('撤销成功')
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
     mounted () {
        let pushData = this.$route.params.detailData;
        if (pushData) {
          findByTaskId(pushData).then(res =>{
            if (res.taskId) {
              let data = JSON.parse(JSON.stringify(res));
              data.pathName = this.$route.name;
              this.$router.push({
                path: data.processVariables.formKey,
                name: data.processVariables.formKey,
                params: {
                    detailData: JSON.stringify(data)
                }
              })
            }
          })
        }
    },
  }
</script>

<style lang="scss" scoped>

</style>