import {get,post,putData,deleteData} from "../../../../plugin/axios";

// 	自营项目 — 业主招标 — 招标评分-添加 
export const addTenderGrading = data => post (`/self/invitation/grade/add/${data.projectCode}`, data)

// 	自营项目 — 业主招标 — 招标评分-编辑 
export const editTenderGrading = data => putData (`/self/invitation/grade/edit/${data.projectCode}`, data)

// 	自营项目 — 业主招标 — 招标评分-通过id查询
export const getTenderGradingById = id => get ('/self/invitation/grade/queryById', id)

// 	自营项目 — 业主招标 — 招标评分-审批 , 驳回 , 作废
export const completeTenderGrading = data => post ('/self/invitation/grade/approveOrRejectOrCancelled', data)

// 	自营项目 — 业主招标 — 招标评分-提交流程接口
export const submitTenderGrading = data => post (`/self/invitation/grade/submit/${data.projectCode}`, data)

// 	自营项目 — 业主招标 — 招标评分-重新提交流程接口
export const resetSubmitTenderGrading = data => post ('/self/invitation/grade/resubmit', data)

// 	自营项目 — 业主招标 — 招标评分-批量删除
export const deleteBatchTenderGrading = ids => deleteData ('/self/invitation/grade/deleteBatch', ids)

// 	自营项目 — 业主招标 — 招标评分-分页搜索
export const getTenderGradingPageList = id => get ('/self/invitation/grade/page', id)

// 	自营项目 — 业主招标 — 招标评分-审核和反审核
export const checkAgainstTenderGrading = data => get ('/self/invitation/grade/checkOrAgainst', data)