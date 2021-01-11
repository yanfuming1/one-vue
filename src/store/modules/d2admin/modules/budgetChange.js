export default {
    namespaced: true,
    state: {
        // 变更记录
        recordList: []
    },
    
    actions: {

        /**
         * 持久化自营项目数据
         * @param {*} param0 state vuex state
         * @param {*} param1 info
         */
        selfGetRecordList ({state, dispatch}, item) {
            return new Promise(async resolve => {
                // 区分用户
                await dispatch('d2admin/db/set', {
                    dbName: 'database',
                    path: 'selfSupportProject.budgetChange',
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
        selfGetRecordListLoad ({ state, dispatch }) {
            return new Promise(async resolve => {
                // 获取数据
                state.recordList = await dispatch('d2admin/db/get', {
                    dbName: 'database',
                    path: 'selfSupportProject.budgetChange',
                    defaultValue: {},
                    user: true
                }, { root: true })

                // end
                resolve()
            })
        },

    }
}