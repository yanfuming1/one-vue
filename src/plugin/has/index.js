import store from '@/store'

export default {
  install(Vue, options) {
    Vue.prototype.$has = function(path) {
      const auth = store.state.d2admin.menu.authorityData
      if (!path || !Array.isArray(auth)) {
        return false
      }
      const index = auth.findIndex(item => item.parameter === path)

      return index !== -1
    }
  }
}

