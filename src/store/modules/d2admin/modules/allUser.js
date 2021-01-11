export default {
    namespaced: true,
    state: {
        // 用户 allUser
        allUser: [],
        depart: [], // 部门
        positionList: [], // 职位
        jointPerson: [] // 联营人信息
    },
    getters: {
        /**
         * @description 返回现存的所有职员
         * @param {*} state vuex state
         */
        getData(state) {
            return state.allUser
        },
        /**
         * @description 返回现存的所有职员
         * @param {*} state vuex state
         */
        getDepartData(state) {
            return state.depart
        },
        /**
         * @description 返回现存的所有职位
         * @param {*} state vuex state
         */
        getPositionData(state) {
            return state.positionList
        },
        /**
         * @description 返回联营人客户
         * @param {*} state vuex state
         */
        getjointPersonData(state) {
            return state.jointPerson
        },

    },
    mutations: {
        /**
         * @description 设置 allUser
         * @param {Object} state vuex state
         */
        set (state, data) {
            state.allUser = data
        },

        /**
         * @description 保存所有部门
         * @param {Object} state vuex state
         */
        setDepart (state, data) {
            state.depart = data
        },

        /**
         * @description 保存所有职位
         * @param {Object} state vuex state
         */
        setPosition (state, data) {
            state.positionList = data
        },
        /**
         * @description 保存所有联营人客户
         * @param {Object} state vuex state
         */
        setJointPerson (state, data) {
            state.jointPerson = data
        },
    }
}
