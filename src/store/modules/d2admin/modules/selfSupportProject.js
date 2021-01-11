export default {
    namespaced: true,
    state: {
        // 项目的基本信息
        selfSupportProject: {}
    },
    
    actions: {

        /**
         * 持久化自营项目数据
         * @param {*} param0 state vuex state
         * @param {*} param1 info
         */
        selfSupportProjectInformation ({state, dispatch}, item) {
            return new Promise(async resolve => {
                // 区分用户
                await dispatch('d2admin/db/set', {
                    dbName: 'database',
                    path: 'selfSupportProject.selfSupportProjectInfor',
                    value: item,
                    user: true
                },{ root: true })
                resolve()
            })
        },

        /**
         * @description 获取自营项目信息
         * @param {*} param0  state vuex state
         */
        selfSupportProjectInformationLoad ({ state, dispatch }) {
            return new Promise(async resolve => {
                // 获取数据
                state.selfSupportProject = await dispatch('d2admin/db/get', {
                    dbName: 'database',
                    path: 'selfSupportProject.selfSupportProjectInfor',
                    defaultValue: {},
                    user: true
                }, { root: true })

                // end
                resolve()
            })
        },

    }
}