export default {
    namespaced: true,
    state: {
        // 客户信息
        customerInfor: {},

        // 数据原
        dataObject: {
            associated: {},
            autotrophy: {}
        },

        // 客户管理所需的枚举数据
        remoteFuncs: {},

        // 标识
        identification: ''
    },
    
    actions: {

        /**
         * 持久化客户数据
         * @param {*} param0 state vuex state
         * @param {*} param1 info
         */
        customerInformation ({state, commit, dispatch}, { item }) {
            return new Promise(async resolve => {
                
                commit ('setDataObject', item)
                // 区分用户
                await dispatch('d2admin/db/set', {
                    dbName: 'database',
                    path: 'customer.customerInfor',
                    value: state.dataObject,
                    user: true
                },{ root: true })
                resolve()
            })
            // if (监听点击按钮啦) {
            //     就传值
            // }
        },

        /**
         * @description 获取客户信息
         * @param {*} param0  state vuex state
         */
        customerInformationLoad ({ state, dispatch }) {
            return new Promise(async resolve => {
                let item = {}
                // 获取数据
                item = await dispatch('d2admin/db/get', {
                    dbName: 'database',
                    path: 'customer.customerInfor',
                    defaultValue: {},
                    user: true
                }, { root: true })

                switch (state.identification) {
                    case '0':
                        state.customerInfor = item.associated
                        break
                    case '1':
                        state.customerInfor = item.autotrophy
                        break
                }

                // end
                resolve()
            })
        },

        /**
         * 持久化客户管理所需的枚举数据
         * @param {*} param0 state vuex state
         * @param {*} param1 info
         */
        remoteFuncsSet ({state, dispatch}, { item }) {
            return new Promise(async resolve => {
                // 区分用户
                await dispatch('d2admin/db/set', {
                    dbName: 'database',
                    path: 'customer.remoteFuncs',
                    value: item,
                    user: true
                },{ root: true })
                resolve()
            })
        },

        /**
         * 获取户管理所需的枚举数据
         * @param {*} param0 state vuex state
         */
        remoteFuncsLoad ({ state, dispatch }) {
            return new Promise(async resolve => {
                // 获取数据
                state.remoteFuncs = await dispatch('d2admin/db/get', {
                    dbName: 'database',
                    path: 'customer.remoteFuncs',
                    defaultValue: {},
                    user: true
                }, { root: true })
                
                // end
                resolve()
            })
        },

        identificationSet ({state, commit, dispatch}, item) {
            return new Promise(async resolve => {
                commit ('set', item)
                // 区分用户
                await dispatch('d2admin/db/set', {
                    dbName: 'database',
                    path: 'customer.identification',
                    value: item,
                    user: true
                },{ root: true })

                resolve()
            })
        },

         /**
         * 获取户管理所需的枚举数据
         * @param {*} param0 state vuex state
         */
        identificationLoad ({ state, dispatch }) {
            return new Promise(async resolve => {
                // 获取数据
                state.identification = await dispatch('d2admin/db/get', {
                    dbName: 'database',
                    path: 'customer.identification',
                    defaultValue: {},
                    user: true
                }, { root: true })
                
                // end
                resolve()
            })
        }
    },

    mutations: {
        /**
         * @description 标识
         * @param {Object} state vuex state
         * @param {Boolean} info info
         */
        set (state, info) {
            state.identification = info
            switch (info) {
                case '0':
                    state.customerInfor = state.dataObject.associated
                    break
                case '1':
                    state.customerInfor = state.dataObject.autotrophy
                    break
            }
        },

        /**
         * @description 对象
         * @param {Object} state vuex state
         * @param {Boolean} info info
         */
        setCustomerInfor (state, info) {
            state.customerInfor = info
        },

        /**
         * @description 对象
         * @param {Object} state vuex state
         * @param {Boolean} info info
         */
        setDataObject (state, info) {
            switch (state.identification) {
                case '0':
                    state.dataObject.associated = info
                    break
                case '1':
                    state.dataObject.autotrophy = info
                    break
            }
        }
    }
}