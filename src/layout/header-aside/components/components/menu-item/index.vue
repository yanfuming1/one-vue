<template>
    <el-menu-item :index="menu.fullPath || uniqueId" class="headerSize" >
        <svg v-if="menu.icon.indexOf('#icon') != -1" class="icon" aria-hidden="true"  style="margin-right:5px;width:16px;height:16px;vertical-align: middle;">
          <use :xlink:href="menu.icon"></use>
        </svg>
        <i v-else :class="'iconfont ' + menu.icon"  style="margin-right:5px"></i>
      <template  slot="title">
        <span>{{menu.title || '未命名菜单'}}</span> <span class="qqt-badge" v-if="(menu.fullPath === '/approval/backlog' || menu.fullPath === '/approval/sendBack') && returnBadge(menu.fullPath) != 0">{{returnBadge(menu.fullPath)}}</span>
      </template>
    </el-menu-item>
</template>

<script>
import { uniqueId } from 'lodash';
import {mapState} from 'vuex';
export default {
  name: 'd2-layout-header-aside-menu-item',
  props: {
    menu: {
      type: Object,
      required: false,
      default: () => {}
    }
  },
  data () {
    return {
      uniqueId: uniqueId('d2-menu-empty-')
    }
  },
  methods: {
    returnBadge(name) {
      let num = name === '/approval/backlog' ? this.backlog : (name === '/approval/sendBack'? this.sendBack : 0);
      return num
    }
  },
  computed: {
    ...mapState ('d2admin/badge', [
        'backlog',
        'sendBack',
    ])
  }
}
</script>
<style lang="scss" scoped>
.qqt-badge{
    background-color: #F56C6C;
    border-radius: 10px;
    color: #FFF;
    display: inline-block;
    font-size: 12px;
    height: 18px;
    line-height: 18px;
    padding: 0 6px;
    text-align: center;
    white-space: nowrap;
    border: 1px solid #FFF;
    margin-left: 10px;
}
</style>