// Vue
import mockdata from './mock'
import Vue from 'vue'
import App from './App'
// 核心插件
import d2Admin from '@/plugin/d2admin'
// store
import store from '@/store/index'
// 多国语
import i18n from './i18n'

import util from '@/libs/util.js'
// 菜单和路由设置
import router from './router'
import loading from './components/loading'
// 引入自定义指令
import './directives.js';
// import menuHeader from '@/menu/header'
// import menuAside from '@/menu/aside'
// import { menuHeader, menuAside } from '@/menu'
// import { frameInRoutes } from '@/router/routes'
//表单插件
import FormMaking from './index'
import Print from '@/libs/print' // 引入附件的js文件
import echarts from 'echarts'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.prototype.$echarts = echarts

// 数据可视化看板
import dataV from '@jiaminghi/data-view'
Vue.use(dataV) 
Vue.use(Print) 
Vue.use(FormMaking)
// 核心插件
Vue.use(d2Admin)
Vue.use(VueAxios, axios,mockdata)
Vue.use(loading)

// v-has
Vue.directive('has', {
  bind: function(el, binding) {
    if (!Vue.prototype.$has(binding.value)) {
      el.parentNode ? el.parentNode.removeChild(el) : el.style.display = 'none'
    }
  }
})


//vuex
new Vue({
  router,
  store,
  i18n,
  loading,
  render: h => h(App),
  created () {
    // 处理路由 得到每一级的路由设置
    // this.$store.commit('d2admin/page/init', this.$router.options.routes)
    // 设置顶栏菜单
    // this.$store.commit('d2admin/menu/headerSet', menuHeader)
    // 设置侧边栏菜单
    // this.$store.commit('d2admin/menu/asideSet', menuAside)
    // 初始化菜单搜索功能
    // this.$store.commit('d2admin/search/init', menuHeader)
  },
  //页面渲染后的请求
  mounted () {
    // 展示系统信息
    this.$store.commit('d2admin/releases/versionShow')
    // 用户登录后从数据库加载一系列的设置
    this.$store.dispatch('d2admin/account/load')
    // 获取并记录用户 UA
    this.$store.commit('d2admin/ua/get')
    // 初始化全屏监听
    this.$store.dispatch('d2admin/fullscreen/listen')
    // DB -> store 持久化数据读取最后一次路由信息 (异步加载, 需要在页面初始化的时候加载数据)
    this.$store.dispatch('d2admin/page/routeLoad', null, { root: true })
    // 初始化加载 用户、部门、角色信息 
    util.setCommonData ()
  },
  watch: {
    // 检测路由变化切换侧边栏内容
    '$route.matched': {
      handler (matched) {
        if (matched.length > 0) {
          let path = matched[0].path == '' ? '/index' : matched[0].path
          const _side = this.$store.state.d2admin.menu.asideData.filter(menu => menu.path === path)
          this.$store.commit('d2admin/menu/headerPathSet', path)
          this.$store.commit('d2admin/menu/asideSet', _side.length > 0 ? _side[0].children ? _side[0].children : [] : [])
        }
      },
      immediate: true
    }
  }
}).$mount('#app')
