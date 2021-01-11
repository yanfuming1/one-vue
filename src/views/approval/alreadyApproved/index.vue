<template>
  <div>
    <common :requestType="requestType"></common>
  </div>
</template>

<script>
  import common from '../components/common/index';
  export default {
    components: {
      common,
    },
    data() {
      return {
        requestType: 'APPLY_FINISHED'
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>