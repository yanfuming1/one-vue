import {get,post,putData,deleteData} from "../../../../plugin/axios";

// 自营项目 — 预算管理 —  预算信息-添加 
export const addBudgetInfo = data => post ('/self/budget/budgetManager/add', data)

// 自营项目 — 预算管理 —  预算信息-编辑 
export const editBudgetInfo = data => putData ('/self/budget/budgetManager/edit', data)

// 自营项目 — 预算管理 —  预算信息-通过id查询
export const getBudgetInfoById = id => get ('/self/budget/budgetManager/queryById', id)

// 自营项目 — 预算管理 —  预算信息-审批 , 驳回 , 作废
export const completeBudgetInfo = data => post ('/self/budget/budgetManager/approveOrRejectOrCancelled', data)

// 自营项目 — 预算管理 —  预算信息-提交流程接口
export const submitBudgetInfo = data => post ('/self/budget/budgetManager/submit', data)

// 自营项目 — 预算管理 —  预算信息-重新提交流程接口
export const resetSubmitBudgetInfo = data => post ('/self/budget/budgetManager/resubmit', data)

// 自营项目 — 预算管理 —  预算信息-批量删除
export const deleteBatchBudgetInfo = ids => deleteData ('/self/budget/budgetManager/deleteBatch', ids)

// 自营项目 — 预算管理 —  预算信息-分页搜索
export const getBudgetInfoPageList = id => get ('/self/budget/budgetManager/searchPageList', id)

// 自营项目 — 预算管理 —  预算信息-审核和反审核
export const checkAgainstBudgetInfo = data => get ('/self/budget/budgetManager/checkOrAgainst', data)

// 模板下载
export const downloadTemplate = data => get ('/self/budget/budgetManager/exportTemplate', data)

// 文件上传
export const excelUpLoad = data => post ('/excel', data)