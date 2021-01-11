<template >
  <el-submenu :index="menu.fullPath || uniqueId" :disabled="menu.fullPath === '/meReceive' || menu.fullPath === '/meInitiate'" class="menuSubClass">
    <template slot="title">
      <svg v-if="menu.icon.indexOf('#icon') != -1" class="icon" aria-hidden="true"  style="margin-right:5px;width:16px;height:16px;vertical-align: middle;">
        <use :xlink:href="menu.icon"></use>
      </svg>
      <i v-else :class="'iconfont ' + menu.icon"  style="margin-right:5px"></i>
      <span>{{menu.title}}</span>
    </template>
    <draggable
        :list="menu.children"
        @start="handleStart"
        @end="handleEnd"
        :disabled="true"
        :group='{name: "son", pull:"clone"}'
      >
      <template v-for="(child, childIndex) in menu.children">
        <d2-layout-header-aside-menu-item v-if="child.children === undefined" :menu="child" :key="childIndex"/>
        <d2-layout-header-aside-menu-sub v-else :menu="child" :key="childIndex"/>
      </template>
    </draggable>
  </el-submenu>
</template>

<script>
import { uniqueId } from 'lodash'
import { mapState } from 'vuex'
// 组件
import d2LayoutMainMenuItem from '../menu-item'
import Draggable from 'vuedraggable'
export default {
  name: 'd2-layout-header-aside-menu-sub',
  components: {
    'd2-layout-header-aside-menu-item': d2LayoutMainMenuItem,
    'draggable': Draggable
  },
  props: {
    menu: {
      type: Object,
      required: false,
      default: () => {}
    }
  },
  computed: {
    ...mapState('d2admin/menu', [
      'sourceData',
    ])
  },
  data () {
    return {
      uniqueId: uniqueId('d2-menu-empty-')
    }
  },
  methods: {
    handleStart () {
      this.$emit ('start')
    },

    handleEnd () {
      let item = this.sourceData.find (r => r.id === this.menu.id)
      if (item) {
        this.menu.children.forEach ((f, index) => {
          item['sort'] = f['sort'] = (index + 1).toString ()
        })
        item = this.menu
      }
      this.$emit ('end')
    }
  }
}
</script>
<style lang='scss'>
.menuSubClass{
  div{
    opacity:1!important;
    cursor: pointer !important;
  }
  li {
    opacity:1!important;
    cursor: pointer !important;
  }
}
</style>