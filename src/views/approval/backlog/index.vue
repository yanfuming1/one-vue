<template>
  <div>
    <common :requestType="requestType"></common>
  </div>
</template>

<script>
  import common from '../components/common/index';
  import {findByTaskId,pendingCount} from '../../../api/approval/common';
  export default {
    components: {
      common,
    },
    data() {
      return {
        requestType: 'BACKLOG'
      }
    },
    mounted () {
      let pushData = this.$route.params.detailData;
      // pushData = '1147683';
      if (pushData) {
        findByTaskId(pushData).then(res =>{
          if (res.taskId) {
            let data = JSON.parse(JSON.stringify(res));
            data.pathName = this.$route.name;
            let transform = this.pageShow (res)
            const { pathName, procInstId, taskId, procDefId } = data
            const { relevancyId, degree, formKey, title } = data.processVariables
            this.$router.push({
              path: data.processVariables.formKey,
              name: data.processVariables.formKey,
              params: {
                  detailData: JSON.stringify(data),
                  relevancyId,
                  procInstId,
                  transform,
                  procDefId,
                  pathName,
                  formKey,
                  degree,
                  taskId,
                  title,
              }
            })
          }
        })
      };
    },

    methods: {
      pageShow (data) {
        let item = {
          isShowDetails: true
        }
        switch (data.pathName) {
          case 'sendBack':
            item.isShowDetails = false
            break;
          case 'examine':
            if (data && data.processVariables && data.processVariables.processState === '6') {
              item.isShowDetails = false
            }
            break
        }
        return item
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>