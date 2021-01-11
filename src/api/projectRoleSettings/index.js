import {get, post, deleteData, putData} from "../../plugin/axios";

// 系统管理-项目角色-分页搜索
export const projectRolePageSearch = data => get('/system/projectRole/page',data)

// 系统管理-项目角色-添加
export const addProjectRole = data => post('/system/projectRole/add',data)

// 系统管理-项目角色-编辑
export const editProjectRole = data => putData('/system/projectRole/edit',data)

// 系统管理-项目角色-通过id查询
export const projectRoleById = data => get('/system/projectRole/queryById',data)

// 系统管理-项目角色-通过id删除
export const delProjectRole = data => deleteData('/system/projectRole/delete',data)

// 	系统管理-项目角色-列表查询
export const getProjectRoleList = () => get('/system/projectRole/list')