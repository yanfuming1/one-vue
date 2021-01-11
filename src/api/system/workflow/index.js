import {get, post, putData, deleteData} from "../../../plugin/axios";

// 获取工作流左侧菜单栏
export const getWorkflowTree = () => get ('/flow/modelGroup/list')

// 修改左侧节点信息
export const UpdateWorkflowTreeNode = data => putData ('/flow/modelGroup/edit', data)

// 添加菜单栏信息
export const addWorkflowTreeNode = data => post ('/flow/modelGroup/add', data)

// 删除菜单栏节点信息
export const deleteWorkflowTreeNode = id => deleteData ('/flow/modelGroup/delete', id)

// 根据节点信息获取节点下的流程信息
export const getModelSynopsisPage = id => get ('/flow/modelSynopsis/page', id)

// 删除流程信息
export const removeModelSynopsis = ids => deleteData ('/flow/modelSynopsis/deleteBatch', ids)

// 更新流程信息
export const updateModelSynopsisSuspend = data => putData ('/flow/modelSynopsis/edit', data)

// 添加流程信息
export const addModelSynopsisSuspend = data => post ('/flow/modelSynopsis/add', data)

// 根据部门id获取该部门下的所有的用户信息
export const getDepIdByUserId = id => get ('/system/DEUCommon/getUserByDepIds', id)

// 根据id获取详情
export const getModelSynopsisIdByDetails = id => get ('/flow/modelSynopsis/queryById', id)

// 部署
export const modelSynopsisIdDeployment = id => get ('/flow/modelSynopsis/deployment', id)

// 修改状态
export const updateModelSynopsisState = data => post ('/flow/modelSynopsis/updateStatus', data) 