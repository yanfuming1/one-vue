import {get,post,putData,deleteData} from "../../../../plugin/axios";

// 自营项目 — 开工准备 — 施工方案审核-添加 
export const addConstructionScheme = data => post (`/self/prepare/schemeAudit/addBatch/${data.projectCode}`, data)

// 自营项目 — 开工准备 — 施工方案审核-编辑 
export const editConstructionScheme = data => putData (`/self/prepare/schemeAudit/editBatch/${data.projectCode}`, data)

// 自营项目 — 开工准备 — 施工方案审核-通过id查询
export const getConstructionSchemeById = id => get ('/self/prepare/schemeAudit/querySecondId', id)

// 自营项目 — 开工准备 — 施工方案审核-审批 , 驳回 , 作废
export const completeConstructionScheme = data => post ('/self/prepare/schemeAudit/approveOrRejectOrCancelled', data)

// 自营项目 — 开工准备 — 施工方案审核-提交流程接口
export const submitConstructionScheme = data => post (`/self/prepare/schemeAudit/submit/${data.projectCode}`, data)

// 自营项目 — 开工准备 — 施工方案审核-重新提交流程接口
export const resetSubmitConstructionScheme = data => post ('/self/prepare/schemeAudit/resubmit', data)

// 自营项目 — 开工准备 — 施工方案审核-批量删除
export const deleteBatchConstructionScheme = ids => deleteData ('/self/prepare/schemeAudit/deleteBatch', ids)

// 自营项目 — 开工准备 — 施工方案审核-分页搜索
export const getConstructionSchemePageList = id => get ('/self/prepare/schemeAudit/searchPageList', id)

// 自营项目 — 开工准备 — 施工方案审核-审核和反审核
export const checkAgainstConstructionScheme = data => get ('/self/prepare/schemeAudit/checkOrAgainst', data)