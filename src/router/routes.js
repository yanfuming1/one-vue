import indexWorkplace from './modules/index'
import systemSet from './modules/system-set'
import personalInformation from './modules/personal-information'

import layoutHeaderAside from '@/layout/header-aside'
// import sys_set from '../views/systemManagement'
// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

/**
 * 在主框架内显示
 */
const frameIn = [
  {
    path: '/',
    redirect: { name: 'index' },
    component: layoutHeaderAside,
    children: [
      // 首页
      {
        path: 'index',
        meta: {
          title: '首页',
          auth: true
        },
        component: _import('system/index'),
      },
      // 系统 前端日志
      {
        path: 'log',
        name: 'log',
        meta: {
          title: '前端日志',
          auth: true
        },
        component: _import('system/log')
      },
      // 刷新页面 必须保留
      {
        path: 'refresh',
        name: 'refresh',
        hidden: true,
        component: _import('system/function/refresh')
      },
      // 页面重定向 必须保留
      {
        path: 'redirect/:route*',
        name: 'redirect',
        hidden: true,
        component: _import('system/function/redirect')
      }
    ]
  },
  indexWorkplace,
  // systemSet,
  // personalInformation
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: _import('system/login')
  },
  //注册
  {
    path: '/sign',
    name: 'sign',
    component: _import('system/sign')
  },
  {
    path: '/phoneRequired',
    name: 'phoneRequired',
    meta: {
      title: '登陆验证'
    },
    component: _import('system/phoneRequired')
  },
  {
    path: '/designForm',
    name: 'designForm',
    component: _import('systemManagement/fromManagement/designForm')
  },
  {
    path: '/helpFeedback',
    name: 'helpFeedback',
    hidden: true,
    component: _import('systemManagement/helpFeedback')
  },
  {
    path: '/printTemplateByHtml',
    name: 'printTemplateByHtml',
    title: "打印模板设计",
    component: _import('systemManagement/printTemplate/components/printTemplateByHtml')
  },
  {
    path: '/networkPan',
    name: 'networkPan',
    title: "网盘分享",
    component: _import('networkDisk/static/shareFileDetail')
  },
  {
    path: '/profitCalculationPage',
    name: 'profitCalculationPage',
    component: _import('projectManagement/selfSupportProjectDetail/economicCalculation/profitCalculation')
  },
]

/**
 * 错误页面
 */
const errorPage = [
  {
    path: '*',
    name: '404',
    component: _import('system/error/404')
  }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
