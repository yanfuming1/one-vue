<template>
  <div id="app">
    <router-view />
    <loading v-show="isShow"></loading>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "app", 
  data() {
    return {};
  },
  computed: {
    ...mapState("d2admin/loading", ["isShow"]),
  },
};
</script>

<style lang="scss">
@import "~@/assets/style/public-class.scss";
</style>
<style>
#app .el-table td {
  padding: 3px 0;
}
#app .el-table .el-form-item {
  margin-bottom: 3px!important;
}

#app .invoice-details-form .invoice-details-conent .invoice-details-form-conent li label {
  padding: 0 4px;
}
#app .invoice-details-form .invoice-details-conent .invoice-details-form-conent li {
  height: 32px;
}
#app .invoice-details-form .invoice-details-conent .invoice-details-form-conent .invoice-details-form-pwdInfo {
  height: 129px;
  padding: 0;
}
#app .invoice-details-form .invoice-details-conent .invoice-details-form-conent, #app .invoice-details-form .invoice-details-conent .invoice-details-form-conent .invoice-details-form-purchaser, #app .invoice-details-form .invoice-details-conent .invoice-details-form-conent .invoice-details-form-password {
  height: 131px;
}
#app .invoice-details-form .el-form-item--medium .el-form-item__content {
  line-height: 32px;
}
#app .invoice-details-form .el-input--medium {
  line-height: 32px   ;
  display: block;
}
#app .invoice-details-form .el-input--medium .el-input__inner {
  height: 30px;
}
#app .add_invoice_line .el-table td,#app .add_invoice_line .el-table th {
  padding: 0!important
}
</style>