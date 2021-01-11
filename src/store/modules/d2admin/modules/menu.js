// 设置文件
import setting from '@/setting.js'
import menu from '@/menu'

export default {
  namespaced: true,
  state: {
    // 顶栏菜单
    header: [],
    // 当前选中的顶级菜单path
    headerPath: '',
    // 侧栏菜单
    aside: [],
    // 侧边栏元数据
    asideData: [],
    // 侧边栏收缩
    asideCollapse: setting.menu.asideCollapse,
    // 菜单源数据
    sourceData: [],
    // 权限信息
    authorityData: [],
    // 快捷菜单
    shortcutMenu: []
  },
  actions: {
    /**
     * 设置侧边栏展开或者收缩
     * @param {Object} state vuex state
     * @param {Boolean} collapse is collapse
     */
    asideCollapseSet ({ state, dispatch }, collapse) {
      return new Promise(async resolve => {
        // store 赋值
        state.asideCollapse = collapse
        // 持久化
        await dispatch('d2admin/db/set', {
          dbName: 'sys',
          path: 'menu.asideCollapse',
          value: state.asideCollapse,
          user: true
        }, { root: true })
        // end
        resolve()
      })
    },
    /**
     * 切换侧边栏展开和收缩
     * @param {Object} state vuex state
     */
    asideCollapseToggle ({ state, dispatch }) {
      return new Promise(async resolve => {
        // store 赋值
        state.asideCollapse = !state.asideCollapse
        // 持久化
        await dispatch('d2admin/db/set', {
          dbName: 'sys',
          path: 'menu.asideCollapse',
          value: state.asideCollapse,
          user: true
        }, { root: true })
        // end
        resolve()
      })
    },
    /**
     * 从持久化数据读取侧边栏展开或者收缩
     * @param {Object} state vuex state
     */
    asideCollapseLoad ({ state, dispatch }) {
      return new Promise(async resolve => {
        // store 赋值
        state.asideCollapse = await dispatch('d2admin/db/get', {
          dbName: 'sys',
          path: 'menu.asideCollapse',
          defaultValue: setting.menu.asideCollapse,
          user: true
        }, { root: true })
        // end
        resolve()
      })
    },
    /**
     * @description 从持久化数据读取菜单源数据
     * @param state vuex state
     * @param dispatch
     * @returns {Promise<*>}
     */
    sourceDataLoad({ state, dispatch }) {
      return new Promise(async resolve => {
        // 菜单数据源持久化
        state.sourceData = await dispatch('d2admin/db/get', {
          dbName: 'database',
          path: '$menu.sourceData',
          defaultValue: [],
          user: true
        }, { root: true })

        // 处理顶栏菜单、侧边菜单、功能搜索
        menu.install(this, state.sourceData)
        // end
        resolve()
      })
    },
    /**
     * @description 从持久化数据读取权限源数据
     * @param state vuex state
     * @param dispatch
     * @returns {Promise<*>}
     */
    authorityDataLoad({ state, dispatch }) {
      return new Promise(async resolve => {
        // 读取权限源数据
        state.authorityData = await dispatch('d2admin/db/get', {
          dbName: 'database',
          path: '$menu.authorityData',
          defaultValue: [],
          user: true
        }, { root: true })
        
        // end
        resolve()
      })
    },

    /**
     * @description 持久化快捷菜单
     * @param state vuex state
     * @param dispatch
     * @returns {Promise<*>}
     */
    shortcutMenuDataSet({ state, dispatch }, data) {

      return new Promise(async resolve => {

        state.shortcutMenu = data.list
        // 菜单数据源持久化
        await dispatch('d2admin/db/set', {
          dbName: 'database',
          path: '$menu.shortcutMenu',
          value: data.shortcutMenu,
          user: true
        }, { root: true })
        
        if (data.boolean) await dispatch('d2admin/account/load', {}, { root: true })
        // end
        resolve()
      })
    },

    /**
     * @description 从持久化数据读取快捷菜单
     * @param state vuex state
     * @param dispatch
     * @returns {Promise<*>}
     */
    shortcutMenuDataLoad({ state, dispatch }) {
      return new Promise(async resolve => {
        // 菜单数据源持久化
        state.shortcutMenu = await dispatch('d2admin/db/get', {
          dbName: 'database',
          path: '$menu.shortcutMenu',
          defaultValue: [],
          user: true
        }, { root: true })
        // end
        resolve()
      })
    }
  },
  mutations: {
    /**
     * @description 设置顶栏菜单
     * @param {Object} state vuex state
     * @param {Array} menu menu setting
     */
    headerSet (state, menu) {
      // store 赋值
      state.header = menu
    },
    /**
     * @description 设置侧边栏菜单
     * @param {Object} state vuex state
     * @param {Array} menu menu setting
     */
    asideSet (state, menu) {
      // store 赋值
      state.aside = menu
    },

    /**
     * 设置侧边栏元数据
     * @param {*} state 
     * @param {*} asideData 
     */
    asideDataSet (state, asideData) {
      state.asideData = asideData
    },

    /**
     * 当前选中的父路由path
     * @param {*} state 
     * @param {*} asideData 
     */
    headerPathSet (state, path) {
      state.headerPath = path
    }
  }
}
