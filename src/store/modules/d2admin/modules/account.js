import { Message, MessageBox } from 'element-ui'
import util from '@/libs/util.js'
import router from '@/router'
import webSocket from '@/components/websocket/socket'
import { AccountLogin, Accountlogout, phoneLogin } from '@api/sys.login'
import { getNavigationList, getAuthorityList, getAccessToAppoint } from '@/api/system/moduleMenu'
import { getShortcutMenuByUserId } from '@/api/system/shortcutMenu'

export default {
  namespaced: true,
  actions: {
    /**
     * @description 登录
     * @param {Object} param context
     * @param {Object} param username {String} 用户账号
     * @param {Object} param password {String} 密码
     * @param {Object} param route {Object} 登录成功后定向的路由对象 任何 vue-router 支持的格式
     */
    login ({ dispatch }, {
      accountNumber = '',
      password = ''
    } = {}) {
      return new Promise((resolve, reject) => {
        // 开始请求登录接口
        AccountLogin({
          accountNumber,
          password
        })
          .then(res => {
            // 设置 cookie 一定要存 uuid 和 token 两个 cookie
            // 整个系统依赖这两个数据进行校验和存储
            // uuid 是用户身份唯一标识 用户注册的时候确定 并且不可改变 不可重复
            // token 代表用户当前登录状态 建议在网络请求中携带 token
            // 如有必要 token 需要定时更新，默认保存一天
            console.log(444444);
            console.log(res);
            if (!util.isDef (res)) return
            util.cookies.set('uuid', res.user.id)
            util.cookies.set('username', res.user.username)
            util.cookies.set('token', res.Authorization)
            util.cookies.set('isNew', res.isNew)
            util.cookies.set('isLogined', true)
            util.cookies.set('page', res.page)
            util.cookies.set('phone', res.user.phone != null ? res.user.phone : '')
            util.cookies.set('companyName', '金鹰')
            // 设置 vuex 用户信息
            dispatch('d2admin/user/set', {
              name: res.user.username
            }, { root: true })

            return getNavigationList({'userId': res.user.id})
          })
          .then(menu => {
            dispatch('d2admin/db/set', {
              dbName: 'database',
              path: '$menu.sourceData',
              value: menu,
              user: true
            }, { root: true })

            return getAuthorityList({'userId': util.cookies.get ('uuid')})
          })
          .then(authority => {
            dispatch('d2admin/db/set', {
              dbName: 'database',
              path: '$menu.authorityData',
              value: authority,
              user: true
            }, { root: true })
            return getShortcutMenuByUserId ()
          })
          .then(shortcutMenu => {
            // 连接websocket
            webSocket.init ()

            dispatch('d2admin/menu/shortcutMenuDataSet', { shortcutMenu, boolean: false}, { root: true })
            // 用户登录后从持久化数据加载一系列的设置
            dispatch('load')

            return getAccessToAppoint ()
          })
          .then(item => {
            dispatch('d2admin/db/set', {
              dbName: 'database',
              path: '$sys.authority',
              value: item,
              user: true
            }, { root: true })
            // end
            resolve()
          })
          .catch(err => {
            console.log('err: ', err)
            reject(err)
          })
      })
    },
    /**
     * @description 登录
     * @param {Object} param context
     * @param {Object} param username {String} 用户账号
     * @param {Object} param password {String} 密码
     * @param {Object} param route {Object} 登录成功后定向的路由对象 任何 vue-router 支持的格式
     */
    phoneLogin ({ dispatch }, {
      phone = '',
      code = ''
    } = {}) {
      return new Promise((resolve, reject) => {
        // 开始请求登录接口
        phoneLogin({
          phone,
          code
        })
          .then(async res => {
            // 设置 cookie 一定要存 uuid 和 token 两个 cookie
            // 整个系统依赖这两个数据进行校验和存储
            // uuid 是用户身份唯一标识 用户注册的时候确定 并且不可改变 不可重复
            // token 代表用户当前登录状态 建议在网络请求中携带 token
            // 如有必要 token 需要定时更新，默认保存一天
            if (!util.isDef (res)) return
            util.cookies.set('uuid', res.user.id)
            util.cookies.set('token', res.Authorization)
            util.cookies.set('isNew', res.isNew)
            util.cookies.set('isLogined', true)
            util.cookies.set('page', res.page)
            util.cookies.set('phone', res.user.phone != null ? res.user.phone : '')
            // 设置 vuex 用户信息
            dispatch('d2admin/user/set', {
              name: res.user.username
            }, { root: true })
  
            return getNavigationList({'userId': res.user.id})
          })
          .then(menu => {
            dispatch('d2admin/db/set', {
              dbName: 'database',
              path: '$menu.sourceData',
              value: menu,
              user: true
            }, { root: true })

            return getAuthorityList({'userId': util.cookies.get ('uuid')})
          })
          .then(authority => {
            dispatch('d2admin/db/set', {
              dbName: 'database',
              path: '$menu.authorityData',
              value: authority,
              user: true
            }, { root: true })

            return getShortcutMenuByUserId ()
          })
          .then(shortcutMenu => {
            // 连接websocket
            webSocket.init ()

            dispatch('d2admin/menu/shortcutMenuDataSet', { shortcutMenu, boolean: false}, { root: true })
            // 用户登录后从持久化数据加载一系列的设置
            dispatch('load')

            return getAccessToAppoint()
          })
          .then(item => {
            dispatch('d2admin/db/set', {
              dbName: 'database',
              path: '$sys.authority',
              value: item,
              user: true
            }, { root: true })
            // end
            resolve()
          })
          .catch(err => {
            console.log('err: ', err)
            reject(err)
          })
      })
    },
    /**
     * @description 注销用户并返回登录页面
     * @param {Object} param context
     * @param {Object} param confirm {Boolean} 是否需要确认
     */
    logout ({ commit, dispatch }, { confirm = false } = {}) {
      /**
       * @description 注销
       */
      async function logout () {
        // 删除cookie
        util.cookies.remove('token')
        util.cookies.remove('uuid')
        util.cookies.remove('isLogined')
        // 注销websocket
        webSocket.close ()
        // 清空 vuex 用户信息
        await dispatch('d2admin/user/set', {}, { root: true })
        await dispatch('d2admin/menu/shortcutMenuDataSet', { shortcutMenu: [], boolean: false}, { root: true })
        await dispatch('d2admin/db/set', { dbName: 'database', path: '$menu.sourceData', value: [], user: true }, { root: true })
        await dispatch('d2admin/db/set', { dbName: 'database', path: '$menu.authorityData', value: [], user: true }, { root: true })
        // 跳转路由
        router.push({
          name: 'login'
        })
      }
      // 判断是否需要确认
      if (confirm) {
        commit('d2admin/gray/set', true, { root: true })
        MessageBox.confirm('注销当前账户吗?  打开的标签页和用户设置将会被保存。', '确认操作', {
          confirmButtonText: '确定注销',
          cancelButtonText: '放弃',
          type: 'warning'
        })
          .then(() => {
            Accountlogout ().then (async res => {
              
              await commit('d2admin/gray/set', false, { root: true })
              await logout()
            })
          })
          .catch(() => {
            commit('d2admin/gray/set', false, { root: true })
            Message({
              message: '放弃注销用户'
            })
          })
      } else {
        logout()
      }
    },
    /**
     * @description 用户登录后从持久化数据加载一系列的设置
     * @param {Object} state vuex state
     */
    load ({ dispatch }) {
      return new Promise(async resolve => {
        // DB -> store 持久化数据读取指定节点权限
        await dispatch('d2admin/menu/authorityDataLoad', null, { root: true })
        // DB -> store 持久化数据读取快捷菜单
        await dispatch('d2admin/menu/shortcutMenuDataLoad', null, { root: true })
        // DB -> store 持久化数据读取菜单源数据
        await dispatch('d2admin/menu/sourceDataLoad', null, { root: true })
        // DB -> store 加载用户名
        await dispatch('d2admin/user/load', null, { root: true })
        // DB -> store 加载主题
        await dispatch('d2admin/theme/load', null, { root: true })
        // DB -> store 加载页面过渡效果设置
        await dispatch('d2admin/transition/load', null, { root: true })
        // DB -> store 持久化数据加载侧边栏折叠状态
        await dispatch('d2admin/menu/asideCollapseLoad', null, { root: true })
        // DB -> store 持久化数据加载全局尺寸
        await dispatch('d2admin/size/load', null, { root: true })
        // 保持心跳
        webSocket.keepalive ()
        // end
        resolve()
      })
    }
  }
}
