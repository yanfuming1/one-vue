<template>
  <div class="container">
    <div class="defaultRow">
      <input>
      <span>工程</span>
    </div>
    <div>投标人工程量清单报价表</div>
    <div class="defaultRow">
      <span>合同编号</span>
      <span>{{datasource.data.projectCode}}</span>
    </div>
    <div class="defaultRow">
      <span>投标人</span>
      <input v-model="datasource.data.bidder">
      <span>（单位盖章）</span>
    </div>
    <div class="defaultRow">
      <span>法定代表人</span>
      <input v-model="datasource.data.legalRepresentative">
      <span>（签字并盖章）</span>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {};
  },
  props: ["datasource"],
  created() {
    // console.log("dddd", this.datasource);
  },
};
</script>

<style>
.container {
  display: "flex";
  flex-direction: "colunm";
}
.defaultRow {
  display: "flex";
  flex-direction: "row";
}
</style>
