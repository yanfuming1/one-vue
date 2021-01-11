import {get,post,putData,deleteData} from "../../../../plugin/axios";

// 自营项目 — 预算变更-分页搜索
export const budgetInfoPage = data => get ('/self/moc/searchPageList', data)

// 自营项目 — 预算变更-批量删除
export const budgetChangeDel = data => deleteData ('/self/moc/deleteBatch', data)

// 自营项目 — 预算变更-查询
export const budgetChangeQueryById = data => get ('/self/budget/budgetManager/bgQueryById', data)

// 自营项目 — 预算变更-保存记录
export const budgetChangeSaveRecord = data => post ('/self/budget/budgetManager/saveYsChangeRecord', data)

// 自营项目 — 预算变更-保存更改
export const budgetChangeBgEdit = data => putData ('/self/budget/budgetManager/bgEdit', data)

// 自营项目 — 预算变更-提交更改
export const budgetChangeBgSubmit = data => post ('/self/budget/budgetManager/bgSubmit', data)

// 自营项目 — 预算变更-查看变更记录
export const budgetChangeGetYsChangeRecord = data => get ('/self/budget/budgetManager/getYsChangeRecord', data)

// 自营项目 — 预算变更-查看变更记录列表
export const budgetChangeSelectYsChangeRecord = data => get ('/self/budget/budgetManager/selectYsChangeRecord', data)

// 自营项目 — 预算变更-变更分页搜索
export const budgetChangeSearchPageList = data => get ('/self/budget/budgetManager/bgSearchPageList', data)

// 自营项目 — 预算变更-导出
export const budgetExportXls = data => get ('/self/budget/budgetManager/exportXls', data)
