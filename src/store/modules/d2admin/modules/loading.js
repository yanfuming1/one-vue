export default {
    namespaced: true,
    state: {
        isShow: false,
        isAllowShow: true
    },
    mutations: {
    
        show (state) {
            if (state.isAllowShow) {
                state.isShow = true
            } 
        },

        close (state) {
            state.isShow = false
        },

        allowShow (state) {
            state.isAllowShow = true
        },

        noAllowShow (state) {
            state.isAllowShow = false
        }
    }
}
  