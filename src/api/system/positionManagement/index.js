import {get, post, putData, deleteData} from "../../../plugin/axios";

// 获取职位管理左侧下拉树
export const getPositionManagementTree = () => get ('/system/position/queryTree')

// 更新职位管理左侧下拉树
export const updatePositionManagement = data => putData ('/system/position/edit', data)

// 添加职位管理左侧下拉树
export const addPositionManagement = data => post ('/system/position/add', data)

// 删除职位管理左侧下拉树
export const deletePositionManagementTree = id => deleteData ('/system/position/delete', id)

// 获取项目职位
export const getProjectPositionAll = () => get ('/system/position/queryProjectPosition')