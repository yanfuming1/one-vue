// 菜单和路由设置
import route from '@/router'

export default {
  methods: {
    /**
     * 触发选中的菜单
     * @param index     选中菜单项的 index
     * @param indexPath 选中菜单项的 index path
     */
    handleMenuSelect(index, indexPath) {
      if (!index || /^cs-menu-empty-\d+$/.test(index)) {
        this.$message.warning('临时菜单')
      } else if (/^https:\/\/|http:\/\//.test(index)) {
        this.$open(index)
      } else {
        this.getRouterAuthPath(index, indexPath)
      }
    },
    /**
     * 触发菜单点击后进行权限过滤
     * @param index     选中菜单项的 index
     * @param indexPath 选中菜单项的 index path
     */
    getRouterAuthPath(index, indexPath = []) {
      if (index === '/index') {
        route.push({ path: index })
        return
      }
      // 查找顶级路由下是否存在子路由
      let router = null
      if (indexPath) {
        for (const value of route.options.routes) {
          if (value.fullPath === index) {
            router = value.children
            break
          }
        }
      }
      
      // 不存在子路由,则直接进入
      if (!router) {
        route.push(indexPath)
        return
      }
      
      // 存在子路由,则判断子级路由是否有权限
      const newPath = route.currentRoute && route.currentRoute.fullPath ? router[0].fullPath === route.currentRoute.fullPath ? router[1].fullPath : router[0].fullPath : router[0].fullPath
      // if (this.$has(newPath)) {
      route.push(newPath)
        // break
      // }
    }
  }
}
