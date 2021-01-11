import {get,post,putData,deleteData} from "../../../plugin/axios";

// 获取数据
export const accountManagementTree = data => get('/system/department/queryTree', data)

// /system/user/listPageByDepId  根据部门id 分页查询该部门的所有账号
export const dataPageByDepId = data => get('/system/user/listPageByDepId', data)

// /system/staff/queryById 通过id获取职员
export const editAccountManagementData = data => get('/system/staff/queryById', data)

// /system/user/resetPassword 重置密码
export const accountResetPassword = data => get('/system/user/resetPassword', data)

// /system/user/changeStatus 账号禁用,启用
export const accountChangeStatus = data => get('/system/user/changeStatus', data)

// /system/user/findPerListById 账号登录信息-通过id查询此用户所有权限
export const accountPerListById = data => get('/system/user/findPerListById', data)

// /system/user/page 账号-搜索-分页查询
export const accountSearchPage = data => get('/system/user/page', data)

// /system/user/findPerTreeById  账号登录信息-通过id查询此用户树状权限
export const accountFindPerTreeById = data => get('/system/user/findPerTreeById', data)

