export default {
    namespaced: true,
    state: {
      // 详情信息
      info: {}
    },
    actions: {
        setInfo ({ state, commit, dispatch }, info) {
            return new Promise(async resolve => {
                // 详情信息
                commit('set', info)
                // 持久化
                await dispatch('d2admin/db/set', {
                    dbName: 'sys',
                    path: 'workflow.info',
                    value: state.info,
                    user: true
                }, { root: true })
                // end
                resolve()
            })
        },
        getInfo ({ state, commit, dispatch }) {
            return new Promise(async resolve => {
                // store 赋值
                let info = await dispatch('d2admin/db/get', {
                  dbName: 'sys',
                  path: 'workflow.info',
                  defaultValue: state.info,
                  user: true
                }, { root: true })
                
                commit('set', info)
                
                // end
                resolve()
            })
        }
    },
    mutations: {
    
        /**
         * @description 详情信息
         * @param {Object} state vuex state
         * @param {Boolean} info info
         */
        set (state, info) {
          state.info = info
        }
    }
  }
  