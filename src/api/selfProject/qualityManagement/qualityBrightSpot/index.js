import {get,post,putData,deleteData} from "../../../../plugin/axios";

// 自营项目 — 质量管理 —  质量亮点-添加 
export const addQualityBrightSpot = data => post (`/self/quality/feature/add/${data.projectCode}`, data)

// 自营项目 — 质量管理 —  质量亮点-编辑 
export const editQualityBrightSpot = data => putData (`/self/quality/feature/edit/${data.projectCode}`, data)

// 自营项目 — 质量管理 —  质量亮点-通过id查询
export const getQualityBrightSpotById = id => get ('/self/quality/feature/queryById', id)

// 自营项目 — 质量管理 —  质量亮点-审批 , 驳回 , 作废
export const completeQualityBrightSpot = data => post ('/self/quality/feature/approveOrRejectOrCancelled', data)

// 自营项目 — 质量管理 —  质量亮点-提交流程接口
export const submitQualityBrightSpot = data => post (`/self/quality/feature/submit/${data.projectCode}`, data)

// 自营项目 — 质量管理 —  质量亮点-重新提交流程接口
export const resetSubmitQualityBrightSpot = data => post ('/self/quality/feature/resubmit', data)

// 自营项目 — 质量管理 —  质量亮点-批量删除
export const deleteBatchQualityBrightSpot = data => deleteData (`/self/quality/feature/deleteBatch/${data.projectCode}`, data)

// 自营项目 — 质量管理 —  质量亮点-分页搜索
export const getQualityBrightSpotPageList = data => get ('/self/quality/feature/page', data)

// 自营项目 — 质量管理 —  质量亮点-审核和反审核
export const checkAgainstQualityBrightSpot = data => get ('/self/quality/feature/checkOrAgainst', data)