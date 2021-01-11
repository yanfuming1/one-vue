import {get,post,putData,deleteData} from "../../../../plugin/axios";

// 自营项目 — 质量管理 —  质量验收-添加 
export const addQualityCheckAccept = data => post (`/self/quality/accept/add/${data.projectCode}`, data)

// 自营项目 — 质量管理 —  质量验收-编辑 
export const editQualityCheckAccept = data => putData (`/self/quality/accept/edit/${data.projectCode}`, data)

// 自营项目 — 质量管理 —  质量验收-通过id查询
export const getQualityCheckAcceptById = id => get ('/self/quality/accept/queryById', id)

// 自营项目 — 质量管理 —  质量验收-审批 , 驳回 , 作废
export const completeQualityCheckAccept = data => post ('/self/quality/accept/approveOrRejectOrCancelled', data)

// 自营项目 — 质量管理 —  质量验收-提交流程接口
export const submitQualityCheckAccept = data => post (`/self/quality/accept/submit/${data.projectCode}`, data)

// 自营项目 — 质量管理 —  质量验收-重新提交流程接口
export const resetSubmitQualityCheckAccept = data => post ('/self/quality/accept/resubmit', data)

// 自营项目 — 质量管理 —  质量验收-批量删除
export const deleteBatchQualityCheckAccept = data => deleteData (`/self/quality/accept/delete/${data.projectCode}`, data)

// 自营项目 - 质量管理 - 质量验收-有序的列表
export const getQualityCheckAcceptPageList = data => get (`/self/quality/accept/orderedList`, data)

// 自营项目 - 质量管理 - 质量验收-无序流程列表
export const getQualityCheckAcceptList = data => get (`/self/quality/accept/list`, data)

// 自营项目 - 质量管理 - 质量验收-树
export const getQualityCheckAcceptTree = data => get ('/self/quality/accept/tree', data)

// 自营项目 — 质量管理 —  质量验收-审核和反审核
export const checkAgainstQualityCheckAccept = data => get ('/self/quality/accept/checkOrAgainst', data)

// 自营项目 - 质量管理 - 质量验收-根据id集合查询
export const getQualityCheckAcceptListByIds = data => get (`/self/quality/accept/listByIds`, data)

// 自营项目 - 质量管理 - 质量验收-从项目划分导入
export const fromProjectSegregation = data => get ('/self/quality/accept/init', data)