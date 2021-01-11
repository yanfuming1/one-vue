import {get,post,putData,deleteData} from "../../../../plugin/axios";

// 自营项目 — 开工准备 —  图纸审核-添加 
export const addBlueprintAudit = data => post (`/self/prepare/drawingAudit/add/${data.projectCode}`, data)

// 自营项目 — 开工准备 —  图纸审核-编辑 
export const editBlueprintAudit = data => putData (`/self/prepare/drawingAudit/edit/${data.projectCode}`, data)

// 自营项目 — 开工准备 —  图纸审核-通过id查询
export const getBlueprintAuditById = id => get ('/self/prepare/drawingAudit/queryById', id)

// 自营项目 — 开工准备 —  图纸审核-审批 , 驳回 , 作废
export const completeBlueprintAudit = data => post ('/self/prepare/drawingAudit/approveOrRejectOrCancelled', data)

// 自营项目 — 开工准备 —  图纸审核-提交流程接口
export const submitBlueprintAudit = data => post (`/self/prepare/drawingAudit/submit/${data.projectCode}`, data)

// 自营项目 — 开工准备 —  图纸审核-重新提交流程接口
export const resetSubmitBlueprintAudit = data => post ('/self/prepare/drawingAudit/resubmit', data)

// 自营项目 — 开工准备 —  图纸审核-批量删除
export const deleteBatchBlueprintAudit = ids => deleteData ('/self/prepare/drawingAudit/deleteBatch', ids)

// 自营项目 — 开工准备 —  图纸审核-分页搜索
export const getBlueprintAuditPageList = id => get ('/self/prepare/drawingAudit/searchPageList', id)

// 自营项目 — 开工准备 —  图纸审核-审核和反审核
export const checkAgainstBlueprintAudit = data => get ('/self/prepare/drawingAudit/checkOrAgainst', data)