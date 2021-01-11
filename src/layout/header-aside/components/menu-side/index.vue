<template>
  <div class="d2-layout-header-aside-menu-side">
    <div v-show="headerPath == '/index'" class="menu-side-index">
      <span v-show="!asideCollapse">我的应用</span>
      <i class="el-icon-s-tools" :class="{'aside-Collapse-layout': asideCollapse}" @click="settingShortcutMenu" />
    </div>
    <el-menu
      :collapse="asideCollapse"
      :unique-opened="true"
      :default-active="active"
      :default-openeds="openArr"
      @select="getRouterMenu"
      ref="menu"
    >
      <draggable
        :list="aside"
        :disabled="true"
        @start="handleStart"
        @end="handleEnd"
        :group='{name: "menu", pull:"clone"}'
      >
        <template v-for="(menu, menuIndex) in aside">
          <d2-layout-header-aside-menu-item v-if="menu.children === undefined" :menu="menu" :key="menuIndex"/>
          <d2-layout-header-aside-menu-sub v-else :menu="menu" :class="{ hidden: asideCollapse}" :key="menuIndex" @start="handleStart" @end="handleEnd"/>
        </template>
         
      </draggable>
    </el-menu>
    <div v-if="aside.length === 0 && !asideCollapse" class="d2-layout-header-aside-menu-empty" flex="dir:top main:center cross:center">
      <d2-icon name="inbox"/>
      <span>没有侧栏菜单</span>
    </div>
    <!-- <menu-shortcut v-show="isShow" :data="shortcutMenu"/> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Draggable from 'vuedraggable'
import menuMixin from '../mixin/menu'
import d2LayoutMainMenuItem from '../components/menu-item/index.vue'
import d2LayoutMainMenuSub from '../components/menu-sub/index.vue'
import menuShortcut from '../components/menu-shortcut'
import BScroll from 'better-scroll'
export default {
  name: 'd2-layout-header-aside-menu-side',
  mixins: [
    menuMixin
  ],
  components: {
    'd2-layout-header-aside-menu-item': d2LayoutMainMenuItem,
    'd2-layout-header-aside-menu-sub': d2LayoutMainMenuSub,
    'draggable': Draggable,
    'menu-shortcut': menuShortcut
  },
  data () {
    return {
      active: '',
      asideHeight: 300,
      shortcutMenu: {},
      BS: null,
      menuAside: [],
      openeds: [],
      matched: null,
      data: null,
      openArr: [],
      isPush: true,
      isShow: false,
      
     
    }
  },
  computed: {
    ...mapState('d2admin/menu', [
      'aside',
      'headerPath',
      'sourceData',
      'asideCollapse'
    ])
  },
  watch: {
    // 折叠和展开菜单的时候销毁 better scroll
    asideCollapse (val) {
      if (!val) {
        this.watchRouter()
      }
      // this.scrollDestroy()
      // setTimeout(() => {
      //   this.isShow = true
      // }, 350)
    },
    // 监听路由 控制侧边栏激活状态
    '$route': {
      handler({ matched, fullPath }) {
        this.watchRouter(fullPath);
      },
      immediate: true
    }
  },

  methods: {
    
    watchRouter (fullPath = this.$route.fullPath) {
      
      console.log(this.aside)
      this.active = fullPath
      if (this.aside[0]) {
        if (this.aside[0].fullPath === '/meReceive') {
          this.openArr = ['/meReceive', '/meInitiate']
        } else {
          this.openArr = []
          this.isPush = true
          this.getUnfoldData (this.aside, fullPath)
          if (this.isPush && this.openArr.length > 0) this.openArr = []
        }
      }
      this.$nextTick(() => {
        if (this.aside && this.aside.length > 0 && this.$refs.menu) {
          this.$refs.menu.activeIndex = fullPath
        }
      })
    },
    getRouterMenu (index, indexPath) {
      this.data = ''
      if (this.aside && this.aside.length === 0) {
        return
      }
      let item = this.aside.find (i => i.fullPath === indexPath[0])
      if (item && item.children && item.children.length > 0) {
        this.iterationGetRouterData (item.children, index)
      } else {
        this.data = item
      }
      this.handleMenuSelect (this.data.path, this.data)
    },

    // 迭代获取路由对象
    iterationGetRouterData (item, index) {
      item.forEach(element => {
        if (element.children && element.children.length > 0) {
          this.iterationGetRouterData (element.children, index)
        } else {
          if (element.fullPath === index) {
            this.data = element
          }
        }
      });
    },

    scrollInit () {
      this.BS = new BScroll(this.$el, {
        mouseWheel: true,
        click: true
        // 如果你愿意可以打开显示滚动条
        // scrollbar: {
        //   fade: true,
        //   interactive: false
        // }
      })
    },
    scrollDestroy () {
      // https://github.com/d2-projects/d2-admin/issues/75
      try {
        this.BS.destroy()
      } catch (e) {
        delete this.BS
        this.BS = null
      }
    },

    getUnfoldData (list, indexPath, parentPath = '') {
      let index = ''
      let item = ''
      list.forEach (res => {
        if (!this.isPush) return
        index = this.openArr.findIndex(i => i === parentPath)
        item = this.aside.find (f => f.parent_id === res.parent_id)
        if (item && this.isPush) {
          this.openArr = []
        }
        if (index !== -1 && this.isPush) {
          this.openArr.splice (index)
        }
        if (indexPath != null && this.isPush && parentPath !== '') {
          this.openArr.push (parentPath)
        }
        if (res.fullPath === indexPath) {
          this.isPush = false
        }
        if (res.children && res.children.length > 0) {
          this.getUnfoldData (res.children, indexPath, res.fullPath)
        }
      })
    },

    handleEnd () {
      this.isShow = false
      this.aside.forEach ((f, index) => {
        let item = this.sourceData.find (r => f.id === r.id)
        if (item) {
          item['sort'] = f['sort'] = (index + 1).toString ()
        }
      })
    },

    handleStart (evt) {
      this.isShow = true
    },

    settingShortcutMenu () {
      this.$router.push ({
        path: '/systemManagement/shortcutMenu',
        name: 'shortcutMenu'
      })
    }
  }
}
</script>
<style lang="scss">
  .el-submenu__icon-arrow{
    display: none !important;
  }
  .hidden {
    .el-submenu__title {
      span {
        display: none;
      }
    }
  }
  .menu-side-index {
    height: 35px;
    line-height: 30px;
    padding: 0 15px;
    font-size: 16px;
    .el-icon-s-tools {
      float: right;
      position: relative;
      top: 7px;
    }
    .el-icon-s-tools:hover {
      color: $color-primary;
    }
    .aside-Collapse-layout {
      left: -11px;
    }
  }
</style>
