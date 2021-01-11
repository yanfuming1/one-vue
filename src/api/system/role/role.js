import {get, post, deleteData, putData} from "../../../plugin/axios";

export const GetRoleTree = data => get('/system/roleGroup/queryTree', data)

export const GetRoleGroupList = data => get('/system/roleGroup/queryList', data)

// /system/permission/getTree
// 获取权限树
export const GetLimitsTree = data => get('/system/permission/getTree', data)

// /system/permission/queryById
// 通过id查找用户的权限
export const GetLimitsById = data => get('/system/permission/queryById', data)

// /system/role/queryById
// 通过id查询角色信息
export const GetRoleById = data => get('/system/role/queryById', data)

// /system/roleGroup/queryTree 查询所有角色分组
export const GetRoleQueryTree = data => get('/system/roleGroup/queryTree', data)

// /system/roleGroup/add 角色分组添加
export const RoleGroupAdd = data => post('/system/roleGroup/add', data)

// /system/roleGroup/edit 角色分组编辑
export const RoleGroupEdit = data => putData('/system/roleGroup/edit', data)

// /system/roleGroup/delete 角色分组的删除
export const RoleGroupDel = data => deleteData('/system/roleGroup/delete', data)

// /system/role/delete 角色信息删除
export const RoleDel = data => deleteData('/system/role/delete', data)

// /system/role/add 角色添加
export const RoleAdd = data => post('/system/role/add', data)

// /system/role/edit 角色编辑
export const RoleEdit = data => post('/system/role/edit', data)

// /system/role/deleteUser 通过角色id和用户id删除
export const DelUserInRole = data => get('/system/role/deleteUser', data)

// /system/role/findByRoleId  通过角色id查询下面的人员
export const GetUserInRole = data => get('/system/role/findByRoleId', data)

// /system/staff/listByRole 通过角色id查询下面的人员(含有分页)
export const GetUserInRolePage = data => get('/system/staff/listByRole', data)

// /system/role/queryPermission
// 根据角色id查询该角色拥有的权限列表
export const GetRolePromission = data => get('/system/role/queryPermission', data)

// /system/role/getAllRole  角色信息-获取所有角色名称 和 id
export const GetAllRoleList = data => get('/system/role/getAllRole', data)

// /system/role/queryTreePermission  根据角色id查询该角色拥有权限的树状结构
export const queryTreePermission = data => get('/system/role/queryTreePermission', data)

// 查询所有角色字典项树状结构
export const queryTreeRoleNew = data => get('/system/roleGroup/queryTreeRole', data)

