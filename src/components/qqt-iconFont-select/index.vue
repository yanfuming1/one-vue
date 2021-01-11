<template>
  <span class="incoFontClass">
    <el-popover
      popper-class="incoFontClass"
      ref="pop"
      v-model="pop"
      :placement="placement"
      width="320"
      trigger="click">
      <el-row type="flex" justify="end" class="qqt-mb-10" v-if="clearable">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          class="qqt-fr"
          @click="selectIcon()">
          清空
        </el-button>
      </el-row>
      <el-input
        v-model="searchText"
        :clearable="true"
        placeholder="搜索 比如 'plus'"
        prefix-icon="el-icon-search">
      </el-input>
      <el-collapse v-if="!searchMode" class="qqt-iconFont-select--group" v-model="collapseActive">
        <el-collapse-item v-for="(item, index) in icon" :key="index" :title="item.title" :name="index" class="qqt-icon-select--class">
          <el-row class="qqt-icon-select--class-row">
            <el-col class="qqt-icon-select--class-col" v-for="(iconName, iconIndex) in item.icon" :key="iconIndex" :span="4" @click.native="selectIcon(iconName)">
              <svg v-if="iconName.indexOf('#icon') != -1" class="icon" aria-hidden="true">
                <use :xlink:href="iconName"></use>
              </svg>
              <i v-else :class="'iconfont ' + iconName"></i>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
      <div v-if="searchMode" class="qqt-iconFont-select--group">
        <div class="qqt-icon-select--class" v-for="(item, index) in iconFilted" :key="index">
          <div class="qqt-icon-select--class-title">{{item.title}}</div>
          <el-row class="qqt-icon-select--class-row">
            <el-col class="qqt-icon-select--class-col" v-for="(iconName, iconIndex) in item.icon" :key="iconIndex" :span="4" @click.native="selectIcon(iconName)">
              <svg v-if="iconName.indexOf('#icon') != -1" class="icon" aria-hidden="true">
                <use :xlink:href="iconName"></use>
              </svg>
              <i v-else :class="'iconfont ' + iconName"></i>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-popover>
    <!-- 允许用户输入 -->
    <el-input
      v-if="userInput"
      v-model="currentValue"
      :disabled="!isShowElement"
      :class="{ 'isShowDetails': !isShowElement }"
      v-bind="bind">
      <template v-if="value" slot="prepend">
        <svg v-if="value.indexOf('#icon') != -1" class="icon" aria-hidden="true">
          <use :xlink:href="value"></use>
        </svg>
        <i v-else :class="'iconfont ' + value"></i>
      </template>
      <el-button v-popover:pop slot="append" v-if="isShowElement" @click="popoverClick">
        <i class="fa fa-list"></i>
      </el-button>
    </el-input>
    <!-- 不允许用户输入 -->
    <el-button v-popover:pop v-if="!userInput">
      <template v-if="value">
        <svg v-if="value.indexOf('#icon') != -1" class="icon" aria-hidden="true">
          <use :xlink:href="value"></use>
        </svg>
        <i v-else :class="'iconfont ' + value"></i>
      </template>
      {{value ? value : placeholder}}
    </el-button>
  </span>
</template>

<script>
import icon from './data/index'
import QqtP from "../qqt-subassembly/qqt-p/qqt-p";
export default {
  name: 'qqt-icon-select',
  components: {QqtP},
  props: {
    // 值
    value: {
      type: String,
      required: false,
      default: ''
    },
    // 占位符
    placeholder: {
      type: String,
      required: false,
      default: '请选择'
    },
    // 弹出界面的方向
    placement: {
      type: String,
      required: false,
      default: 'right'
    },
    // 是否可清空
    clearable: {
      type: Boolean,
      required: false,
      default: true
    },
    // 是否允许用户输入
    userInput: {
      type: Boolean,
      required: false,
      default: false
    },
    // 是否在选择后自动关闭
    autoClose: {
      type: Boolean,
      required: false,
      default: true
    },
    // 是否显示
    isShowElement: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data () {
    return {
      // 绑定弹出框
      pop: false,
      // 所有图标
      icon,
      // 组件内输入框的值
      currentValue: '',
      // 搜索的文字
      searchText: '',
      // 不是搜索的时候显示的折叠面板绑定的展开数据
      collapseActive: []
      // collapseActive: [...Array(icon.length)].map((e, i) => i)
    }
  },
  computed: {
    // 输入框上绑定的设置
    bind () {
      return {
        placeholder: this.placeholder,
        clearable: this.clearable,
        ...this.$attrs
      }
    },
    // 是否在搜索
    searchMode () {
      return !!this.searchText
    },
    // 过滤后的图标
    iconFilted () {
      return this.icon.map(iconClass => ({
        title: iconClass.title,
        icon: iconClass.icon.filter(icon => icon.indexOf(this.searchText) >= 0)
      })).filter(iconClass => iconClass.icon.length > 0)
    }
  },
  watch: {
    value (value) {
      this.currentValue = value
    }
  },
  created () {
    this.currentValue = this.value
  },
  methods: {
    selectIcon (iconName = '') {
      this.$emit('input', iconName)
      if (iconName && this.autoClose) {
        this.pop = false
      }
    },
    popoverClick () {
        this.pop = true
     }
  }
}
</script>
<style lang="scss">
.incoFontClass{
  .iconfont{
    font-size: 25px
  }
  .icon{
    font-size: 25px;
    width: 25px;
    height: 25px;
  }
}
</style>
<style lang="scss" scoped>

.qqt-iconFont-select--group {
  max-height: 400px;
  overflow-x: hidden;
  overflow-y: scroll;
  border-top: none;
  border-bottom: none;
  .qqt-icon-select--class {
    .qqt-icon-select--class-title {
      line-height: 30px;
      text-align: center;
      background-color: $color-bg;
      border-radius: 4px;
      margin: 10px 0px;
    }
    .qqt-icon-select--class-row {
      .qqt-icon-select--class-col {
        line-height: 40px;
        text-align: center;
        color: $color-text-sub;
        &:hover {
          color: $color-text-main;
          background-color: $color-bg;
          border-radius: 4px;
          // font-size: 26px;
          box-shadow: inset 0px 0px 0px 1px $color-border-1;
        }
      }
    }
  }
}
</style>
