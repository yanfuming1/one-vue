<template>
  <div ref="excel" style="width:100%;">
    <component :is="component" :datasource="selectedInfo" :fromChange="fromChange" @changeClick="changeClick" :isShowDetails="showDetail" @changeValue="valueChange" :callback="callback"></component>
  </div>
</template>

<script>
import templateName from "./HeaderTemplateNameStore";
import * as templ from "./templConf";
import util from '@/libs/util';
export default {
  name: "ExeclComponent",
  components: { ...templ,  },
  props: [
    "selectedTabsValue",
    "templateInfo",
    "selectedProjectType",
    "selectedInfo",
    "isShowDetails",
    "fromChange", // 是变更页面调用
  ],
  data() {
    return {
      component: "",
      showDetail: false,
    };
  },
  watch: {
    selectedTabsValue(val, oldVal) {
      this.component = templateName[this.selectedProjectType][val];
    },
    selectedProjectType(newVal, oldVal) {
      this.component = templateName[newVal][this.selectedTabsValue];
    },
    isShowDetails (newVal, oldVal) {
      this.showDetail = newVal
    }
  },
  methods: {
    printPage () {
      this.$print (this.$refs.excel)
    },
    // 回调函数
    callback (params) {
      this.$emit("changeData", this.selectedProjectType, this.selectedTabsValue, params)
      // console.log("selectedInfo", this.selectedInfo); // 可以获取 budget_id
    },
    // 输入改变时
    valueChange (budgetId, bgId, fieldValue, fieldName) {
      this.$emit('changeValue', budgetId, bgId, fieldValue, fieldName)
    },
    changeClick (budgetId, bgId, fieldValue, fieldName) {
      this.$emit('changeClick', this.selectedInfo.kind, budgetId, bgId, fieldValue, fieldName)
    },
  },
  created() {
    this.component = templateName[this.selectedProjectType][this.selectedTabsValue];
    this.showDetail = this.isShowDetails
  },
};
</script>
