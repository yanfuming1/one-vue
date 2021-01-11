import {get, post, putData, deleteData} from "@/plugin/axios";

// 自营项目 — 合同计量 — -添加 
export const addSelfContractMeasure = data => post (`/self/contractMeter/add/${data.projectCode}`, data)

// 自营项目 — 合同计量 — -编辑 
export const editSelfContractMeasure = data => putData (`/self/contractMeter/edit/${data.projectCode}`, data)

// 自营项目 — 合同计量 — -通过id查询
export const getSelfContractMeasureById = id => get ('/self/contractMeter/queryById', id)

// 自营项目 — 合同计量 — -审批 , 驳回 , 作废
export const completeSelfContractMeasure = data => post ('/self/contractMeter/approveOrRejectOrCancelled', data)

// 自营项目 — 合同计量 — -提交流程接口
export const submitSelfContractMeasure = data => post (`/self/contractMeter/submit/${data.projectCode}`, data)

// 自营项目 — 合同计量 — -重新提交流程接口
export const resetSubmitSelfContractMeasure = data => post ('/self/contractMeter/resubmit', data)

// 自营项目 — 合同计量 — -批量删除
export const deleteBatchSelfContractMeasure = data => deleteData (`/self/contractMeter/deleteBatch/${data.projectCode}`, data)

// 自营项目 — 合同计量 — -分页搜索
export const getSelfContractMeasurePageList = id => get ('/self/contractMeter/list', id)

// 自营项目 — 合同计量 — -审核和反审核
export const checkAgainstSelfContractMeasure = data => get ('/self/contractMeter/checkOrAgainst', data)


/**------------------------------------------------导航---------------------------------------------------- */


// 合同计量 — -添加 
export const addContractMeasure = data => post (`/bargain/contractMeter/add`, data)

// 合同计量 — -编辑 
export const editContractMeasure = data => putData (`/bargain/contractMeter/edit`, data)

// 合同计量 — -通过id查询
export const getContractMeasureById = id => get ('/bargain/contractMeter/queryById', id)

// 合同计量 — -审批 , 驳回 , 作废
export const completeContractMeasure = data => post ('/bargain/contractMeter/approveOrRejectOrCancelled', data)

// 合同计量 — -提交流程接口
export const submitContractMeasure = data => post (`/bargain/contractMeter/submit`, data)

// 合同计量 — -重新提交流程接口
export const resetSubmitContractMeasure = data => post ('/bargain/contractMeter/resubmit', data)

// 合同计量 — -批量删除
export const deleteBatchContractMeasure = ids => deleteData ('/bargain/contractMeter/deleteBatch', ids)

// 合同计量 — -分页搜索
export const getContractMeasurePageList = id => get ('/bargain/contractMeter/list', id)

// 合同计量 — -审核和反审核
export const checkAgainstContractMeasure = data => get ('/bargain/contractMeter/checkOrAgainst', data)


/**-------------------------------------------------联营项目------------------------------------------------ */

// 联营项目 — 合同计量 — -添加 
export const addJointContractMeasure = data => post (`/joint/contractMeter/add/${data.projectId}`, data)

// 联营项目 — 合同计量 — -编辑 
export const editJointContractMeasure = data => putData (`/joint/contractMeter/edit/${data.projectId}`, data)

// 联营项目 — 合同计量 — -通过id查询
export const getJointContractMeasureById = id => get ('/joint/contractMeter/queryById', id)

// 联营项目 — 合同计量 — -审批 , 驳回 , 作废
export const completeJointContractMeasure = data => post ('/joint/contractMeter/approveOrRejectOrCancelled', data)

// 联营项目 — 合同计量 — -提交流程接口
export const submitJointContractMeasure = data => post (`/joint/contractMeter/submit/${data.projectId}`, data)

// 联营项目 — 合同计量 — -重新提交流程接口
export const resetSubmitJointContractMeasure = data => post ('/joint/contractMeter/resubmit', data)

// 联营项目 — 合同计量 — -批量删除
export const deleteBatchJointContractMeasure = data => deleteData (`/joint/contractMeter/deleteBatch/${data.projectId}`, data)

// 联营项目 — 合同计量 — -分页搜索
export const getJointContractMeasurePageList = id => get ('/joint/contractMeter/list', id)

// 联营项目 — 合同计量 — -审核和反审核
export const checkAgainstJointContractMeasure = data => get ('/joint/contractMeter/checkOrAgainst', data)