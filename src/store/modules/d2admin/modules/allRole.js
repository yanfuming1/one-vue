export default {
    namespaced: true,
    state: {
        // 用户 allRole
        data: []
    },
    getters: {
        /**
         * @description 返回现存 log (all) 的条数
         * @param {*} state vuex state
         */
        getData(state) {
            return state.data
        },
    },
    mutations: {
        /**
         * @description 获取 allRole
         * @param {Object} state vuex state
         */
        get (state) {
            // state.data = new UaParser().getResult()
            return state.data
        },

        /**
         * @description 设置 allRole
         * @param {Object} state vuex state
         */
        set (state, data) {
            state.data = data
        }
    }
}
