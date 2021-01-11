import {get,post,putData,deleteData} from "../../../../plugin/axios";

//  — 合同变更 — -添加 
export const addContractAlteration = data => post (`/self/bargainChange/add/${data.projectCode}`, data)

//  — 合同变更 — -编辑 
export const editSelfContractAlteration = data => putData (`/self/bargainChange/edit/${data.projectCode}`, data)

//  — 合同变更 — -通过id查询
export const getSelfContractAlterationById = id => get ('/self/bargainChange/queryById', id)

//  — 合同变更 — -审批 , 驳回 , 作废
export const completeSelfContractAlteration = data => post ('/self/bargainChange/approveOrRejectOrCancelled', data)

//  — 合同变更 — -提交流程接口
export const submitSelfContractAlteration = data => post (`/self/bargainChange/submit/${data.projectCode}`, data)

//  — 合同变更 — -重新提交流程接口
export const resetSubmitSelfContractAlteration = data => post ('/self/bargainChange/resubmit', data)

//  — 合同变更 — -批量删除
export const deleteBatchSelfContractAlteration = data => deleteData (`/self/bargainChange/deleteBatch/${data.projectCode}`, data)

//  — 合同变更 — -分页搜索
export const getSelfContractAlterationPageList = id => get ('/self/bargainChange/list', id)

//  — 合同变更 — -审核和反审核
export const checkAgainstSelfContractAlteration = data => get ('/self/bargainChange/checkOrAgainst', data)


/***********************************************************************导航******************************************************* */

// 合同变更 — -添加 
export const addContractAlteration = data => post (`/bargain/bargainChange/add`, data)

// 合同变更 — -编辑 
export const editContractAlteration = data => putData (`/bargain/bargainChange/edit`, data)

// 合同变更 — -通过id查询
export const getContractAlterationById = id => get ('/bargain/bargainChange/queryById', id)

// 合同变更 — -审批 , 驳回 , 作废
export const completeContractAlteration = data => post ('/bargain/bargainChange/approveOrRejectOrCancelled', data)

// 合同变更 — -提交流程接口
export const submitContractAlteration = data => post (`/bargain/bargainChange/submit`, data)

// 合同变更 — -重新提交流程接口
export const resetSubmitContractAlteration = data => post ('/bargain/bargainChange/resubmit', data)

// 合同变更 — -批量删除
export const deleteBatchContractAlteration = data => deleteData (`/bargain/bargainChange/deleteBatch`, data)

// 合同变更 — -分页搜索
export const getContractAlterationPageList = id => get ('/bargain/bargainChange/searchPageList', id)

// 合同变更 — -审核和反审核
export const checkAgainstContractAlteration = data => get ('/bargain/bargainChange/checkOrAgainst', data)