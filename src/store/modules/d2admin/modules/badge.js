export default {
  namespaced: true,
  state: {
    backlog: 0,
    sendBack: 0,
  },
  mutations: {
      getBadge(state,info) {
        state.backlog = info.backlog;
        state.sendBack = info.sendBack;
      }
  }
}
