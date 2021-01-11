import Vue from 'vue'
import VueRouter from 'vue-router'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import store from '@/store/index'

import util from '@/libs/util'
import { MENU } from '@/enum/MENU'

// 路由数据
import routes from './routes'

if (!window.VueRouter) Vue.use(VueRouter)

// 导出路由 在 main.js 里使用
const router = new VueRouter({
  routes,
  mode:'history',
  // base: '127.0.0.1:8080/dist',
  router:[

  ]
})

/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach(async (to, from, next) => {
  // 确认已经加载多标签页数据 https://github.com/d2-projects/d2-admin/issues/201
  await store.dispatch('d2admin/page/isLoaded')
  // 确认已经加载组件尺寸设置 https://github.com/d2-projects/d2-admin/issues/198
  await store.dispatch('d2admin/size/isLoaded')
  // 进度条
  NProgress.start()
  // 关闭搜索面板
  store.commit('d2admin/search/set', false)
  // 验证当前路由所有的匹配中是否需要有登录验证的
  if (to.matched.some(r => r.meta.auth)) {
    // 这里暂时将cookie里是否存有token作为验证是否登录的条件
    // 请根据自身业务需要修改
    const token = util.cookies.get('token')
    if (token && token !== 'undefined') {
      next()
    } else {
      // 清除登陆数据 跳转到登录界面
      store.dispatch ('d2admin/account/logout')
      // https://github.com/d2-projects/d2-admin/issues/138
      NProgress.done()
    }
  } else {
    let params = getToRouterParams (to.path)
    if (params) Object.assign (to.params, params)
    // 不需要身份校验 直接通过
    next()
  }
})

router.afterEach(to => {
  // 进度条
  NProgress.done()
  // 多页控制 打开新的页面
  store.dispatch('d2admin/page/open', to)
  // 更改标题
  util.title(to.meta.title)
})

function getToRouterParams (key) {
  let params = false, pathList = [], data = [], route = {}
  pathList = key.split ('/'), data = MENU.find (f => f.path == `/${pathList[1]}`)
  if (data && data.arrElem && data.arrElem.length > 0) {
    route = data.arrElem.find (f => pathList.includes (f.path))
    if (route && route.params) {
      params = route.params
    } 
  }
  return params
}

export default router
