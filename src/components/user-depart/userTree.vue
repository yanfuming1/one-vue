<template>
  <div :class="{'user-tree-father': isfather, 'user-tree-son': !isfather, 'show-input-father': isShowInputFather, 'show-input-son': isShowInputSon}">
    <el-input
      v-if="isShowFilter"
      placeholder="输入关键字进行过滤"
      v-model="filterText">
    </el-input>
    <el-tree
      class="filter-tree"
      show-checkbox
      :data="data"
      node-key="id"
      :props="defaultProps"
      :default-checked-keys="checkChildrenList"
      :filter-node-method="filterNode"
      ref="tree"
      @check="isCheckBox"
      @node-click="getNodeChildrenData">
    </el-tree>
  </div>
</template>

<script>
export default {
  name: 'userTree',
  props: {
    data: Array,
    defaultProps: Object,
    sonCheckBoxDataList: Array,
    childrenCheckList: Array,
    fatherCheckList: Array,
    fatherCheckBoxDataList: Array,
    sign: String,
    fatherData: Array,
    removeSonCheckBoxDataList: Array,
    removeFatherCheckBoxDataList: Array,
    isShowFilter: {
      type: Boolean,
      default: () => true
    },
    isfather: {
      type: Boolean,
      default: () => false
    },
    isShowInputFather: {
      type: Boolean,
      default: () => false
    },
    isShowInputSon: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      filterText: '',
      checkList: [],
      checkChildrenList: []
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data[this.defaultProps.label].indexOf(value) !== -1
    },
    
    // 复选框选中触发
    isCheckBox (event) {
      this.$emit('checkBoxData', event)
    },

    // 获取选中节点的数据
    getNodeChildrenData (data) {
      this.$emit('userClickData', data)
    },

    // 获取选中节点的数据
    updataNodeFatherData (data) {
      this.data = data
    },

    updataCheckboxState (item, isCheck) {
      if (item) {
        this.$refs.tree.setChecked(item, isCheck, true)
      } else {
        this.$refs.tree.setCheckedNodes([])
      }
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    },
    fatherCheckList () {
      this.checkChildrenList = this.fatherCheckList
    },
    childrenCheckList () {
      this.checkChildrenList = this.childrenCheckList
    }
  }
}
</script>

<style lang="scss">
  .user-tree-father {
    .el-input {
      z-index: 99;
      position: absolute !important;
      font-size: 14px;
      display: inline-block;
      width: 37.5%;
      top: 139px;
      left: 30px;
    }
  }
  .show-input-father {
    .el-input {
      width: 37.4% !important;
      top: 227px !important;
    }
  }
  .user-tree-son {
    .el-input {
      z-index: 99;
      position: absolute !important;
      font-size: 14px;
      display: inline-block;
      width: 37.5%;
      top: 387px;
      left: 30px;
    }
  }
  .show-input-son {
    .el-input {
      width: 37.4% !important;
      top: 480px !important;
    }
  }
</style>
