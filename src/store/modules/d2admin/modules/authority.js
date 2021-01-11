export default {
    namespaced: true,
    state: {
      // 指定下一节点
      authority: false
    },
    actions: {
      /**
       * @description 记录 权限
       * @param {Object} state vuex state
       */
      get ({ state, dispatch }) {
        return new Promise(async resolve => {
            // store 赋值
            state.authority = await dispatch('d2admin/db/get', {
              dbName: 'database',
              path: '$sys.authority',
              defaultValue: false,
              user: true
            }, { root: true })
            // end
            resolve()
        })
      }
    }
  }