export default {
    namespaced: true,
    state: {
        // 流程父信息
        info: {},
        // 节点信息
        nodeData: {},
        // bpmn模型
        bpmnModeler: {}
    },
    actions: {

        setInfo ({ state, commit, dispatch }, info) {
            return new Promise(async resolve => {
                // 详情信息
                commit('set', info)
                // 持久化
                await dispatch('d2admin/db/set', {
                    dbName: 'sys',
                    path: 'processDefinition.info',
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
                  path: 'processDefinition.info',
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
        setInfo (state, info) {
          state.info = info
        },

        /**
         * @description 节点信息
         * @param {Object} state vuex state
         * @param {Boolean} nodeData nodeData 
         */
        setNodeData (state, nodeData) {
            state.nodeData = nodeData
        },

        /**
         * @description bpmn模型
         * @param {Object} state vuex state
         * @param {Boolean} nodeData nodeData 
         */
        setBpmnModeler (state, bpmnModeler) {
            state.bpmnModeler = bpmnModeler
        }
    }
  }
  