export default {
    namespaced: true,
    state: {
        // 用户 allUser
        limits: []
    },
    getters: {
        /**
         * @description 返回现存的所有职员
         * @param {*} state vuex state
         */
        getData(state) {
            return state.limits
        }
    },
    mutations: {
        /**
         * @description 设置 allUser
         * @param {Object} state vuex state
         */
        set (state, data) {
            state.limits = data
        }

    }
}
