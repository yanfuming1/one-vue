import util from '@/libs/util'
import layoutHeaderAside from '@/layout/header-aside'
// 菜单和路由设置
import router from '../router'
import { frameInRoutes } from '@/router/routes'
import { MENU } from '../enum/MENU'

const _import = require('@/libs/util.import.' + process.env.NODE_ENV)
const meta = { auth: true, cache: true, }

/**
 * 添加动态路由
 * @param {*} arr
 */
function addRoutersData (arr) {
    let index = -1
    let listData = []
    let arrElem = {}
    let routerList = []
    arr.forEach(value => {
        listData = []
        arrElem = []
        value['component'] = layoutHeaderAside
        index = router.options.routes.findIndex(i => i.path === value.path)
        if (value.children && value.children instanceof Array) {
            const list = removeHierarchy(value.children, listData)
            value.children = list
            
            MENU.forEach(item => {
                if(item.path === value.path){
                    arrElem = item.arrElem
                }
            })
            
            value.children.push.apply(value.children, arrElem)
            if (index === -1 || value.path == '/index') {
                routerList.push (value)
            }
        }
    })
    if (routerList.length !== 0) {
        router.options.routes.push.apply( router.options.routes, routerList)
        router.addRoutes ( routerList )
    }
    return routerList
}

/**
 * 去除层级
 * @param {*} arr
 */
function removeHierarchy (arr, list) {

    arr.forEach(res => {
        if (res.children && res.children.length > 0) {
            removeHierarchy(res.children, list)
        } else {
            res['component'] = () => import('@/views/' + res.href)
            list.push (res)
        }
    })

    return list
}

/**
 * 将数据源处理为菜单树
 * @param arr
 * @returns {{header: Array, aside: Array}}
 */
function getMenuData(arr) {
    let index = {
        fullPath: "/index",
        href: "/index",
        icon: "gears",
        id: "2",
        isShow: false,
        menu_id: "2",
        parent_id: 0,
        path: "/index",
        sort: "31",
        title: "首页",
        children: []
    }
    let tree = { header: [
        index
    ], aside: [ index ], router: [] }
    let num = 0
    arr.forEach(value => {
        let url = ''
        let query = ''
        let str = ''
        let data = ''
        let href = ''
        let temporaryUrl = value.href.split (':')
        if (temporaryUrl.length > 1) {
            url = temporaryUrl[0]
            data = ':identification'
            href = temporaryUrl[0].substring (0, temporaryUrl[0].length - 1)
            query = temporaryUrl[temporaryUrl.length - 1]
            str = url.split('/')[url.split('/').length - 2]
        } else {
            url = value.href
            data = ''
            href = value.href
            str = url.split('/')[url.split('/').length - 1]
        }
        let arrElem = {
            path: url + data,
            fullPath: url + query,
            title: value.name,
            icon: value.css,
            remark: value.remark,
            href: href,
            sort: value.sort,
            id: value.id,
            params: {}
        }
        if (value.parentId === '0' && value.isNavigation === '0') {
            arrElem['isShow'] = false
        } else if (value.isNavigation === '1' && value.parentId !== '0') {
            arrElem['isShow'] = false
        } else if (value.isNavigation === '1' && value.parentId === '0'){
            arrElem['isShow'] = true
        }

        if (value.isNavigation === '1' || value.parentId === '0') {
            value.parentId = 0
            tree.header.push({ ...arrElem })
            tree.header = tree.header.sort((a, b)=>{
                return Number (a.sort) - Number (b.sort)
            })
        } else {
            arrElem['path'] = '/' + url + (value.shortcut ? value.shortcut + '/' : temporaryUrl.length == 3 ? temporaryUrl[1] + '/'  : '') + '' + data 
            arrElem['fullPath'] = '/' + url + (value.shortcut ? value.shortcut  + '/'  : temporaryUrl.length == 3 ? temporaryUrl[1] + '/'  : '') + query
            arrElem['meta'] = {
                ...meta,
                title: value.name
            }
            if (query !== '') {
                arrElem.params['identification'] = query
            }
            if (tree.aside.findIndex (r => r.name === str) !== -1) {
                // 这种情况 暂时不考虑缓存
                arrElem['name'] = str + (value.shortcut ? value.shortcut : temporaryUrl.length == 3 ? temporaryUrl[1] : num++)
            } else {
                arrElem['name'] = str

            }
        }

        // 处理子节点数据
        arrElem['menu_id'] = value.id
        arrElem['parent_id'] = value.parentId,

        tree.aside.push(arrElem)

    })
    tree.aside = util.formatDataToTree(tree.aside)
    tree.router = JSON.parse(JSON.stringify(tree.aside))
    return tree
}

function initPool (routes) {
    const pool = []
    const push = function (routes) {
        routes.forEach(route => {
            if (route.children) {
                push(route.children)
            } else {
                if (!route.hidden) {
                    const { meta, name, path } = route
                    pool.push({ meta, name, path })
                }
            }
        })
    }
    push(routes)
    return pool
}

export default {
    install(vm, source) {
        let menu = {}
        let init = []
        let newRoutes = []
        if (!source) return
        if (vm.state.d2admin.menu.shortcutMenu.length > 0) {
            vm.state.d2admin.menu.shortcutMenu.forEach (res => { 
                res['parentId'] = '2', res['id'] = util.guid (), res['shortcut'] = 'My'
                res['href'] = res['href'].includes (':') ? res['href'] : res['href'] += '/:21'
            })
        }
        source.push ( ...vm.state.d2admin.menu.shortcutMenu )
        menu = getMenuData ( source )
        newRoutes = addRoutersData ( menu.router )

        if (newRoutes.length > 1) {
            init = initPool ([...newRoutes, ...frameInRoutes])
        } else {
            newRoutes = router.options.routes
            if (newRoutes.length > 1) {
                init = initPool ([...newRoutes])
            } else {
                init = initPool ([ ...frameInRoutes])
            }
        }

        vm.commit('d2admin/page/init', init)
        vm.commit('d2admin/menu/headerSet', menu.header)
        vm.commit('d2admin/menu/asideDataSet', menu.aside)
        vm.commit('d2admin/search/init', menu.aside)

        if (vm.state.d2admin.menu.headerPath == '/index') {
            let _side = menu.aside.find (f => f.path == vm.state.d2admin.menu.headerPath)
            vm.commit('d2admin/menu/asideSet', _side.children ? _side.children : [])
        }

        // DB -> store 持久化数据加载上次退出时的多页列表
        vm.dispatch('d2admin/page/openedLoad', null, { root: true })
        // console.log(router.history.pending)


        let m = util.cookies.get ("token") ? router.history.pending && router.history.pending.path ? router.history.pending.path : '/index' : '/login'
        switch (m) {
            case '/index':
            case '/login':
            case '/networkPan':
                break
            default:
                // 获取最后一次有效访问的路由信息
                let route = vm.state.d2admin.page.route

                router.push({
                    path: route.fullPath,
                    query: route.query,
                    params: route.params,
                    name: route.name
                })
                break
        }
    }
}
