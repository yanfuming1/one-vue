import {get, post, putData, deleteData} from "../../../plugin/axios";

// 获取模块管理的下拉列表
export const getModuleMenuTree = () => get ('/system/permission/getTree')

// 修改模块管理的下拉列表
export const updateModuleMenuTree = data => putData ('/system/permission/edit', data)

// 添加模块管理的下拉列表
export const addModuleMenuTree = data => post ('/system/permission/add', data)

// 删除模块管理的下拉列表
export const deleteModuleMenuTree = id => deleteData ('/system/permission/delete', id)

// 用户登录后获取菜单和路由信息
export const getNavigationList = id => get ('/login/getNavigation', id)

// 用户登陆后获取权限信息
export const getAuthorityList = id => get('/login/getAuthority', id)

// 用户登陆后获取审核反审核 、指定下一节点办理人
export const getAccessToAppoint = () => get('/activiti/task/isAccessToAppoint')