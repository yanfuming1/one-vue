import {get,post,putData,deleteData} from "../../../../plugin/axios";

// 自营项目 — 合同结算记录 — 添加 
export const addSelfSettleAccountsRecord = data => post (`/self/contractSettle/add/${data.projectCode}`, data)

// 自营项目 — 合同结算记录 — 编辑 
export const editSelfSettleAccountsRecord = data => putData (`/self/contractSettle/edit/${data.projectCode}`, data)

// 自营项目 — 合同结算记录 — 通过id查询
export const getSelfSettleAccountsRecordById = id => get ('/self/contractSettle/queryById', id)

// 自营项目 — 合同结算记录 — 审批 , 驳回 , 作废
export const completeSelfSettleAccountsRecord = data => post ('/self/contractSettle/approveOrRejectOrCancelled', data)

// 自营项目 — 合同结算记录 — 提交流程接口
export const submitSelfSettleAccountsRecord = data => post (`/self/contractSettle/submit/${data.projectCode}`, data)

// 自营项目 — 合同结算记录 — 重新提交流程接口
export const resetSubmitSelfSettleAccountsRecord = data => post ('/self/contractSettle/resubmit', data)

// 自营项目 — 合同结算记录 — 批量删除
export const deleteBatchSelfSettleAccountsRecord = data => deleteData (`/self/contractSettle/deleteBatch/${data.projectCode}`, data)

// 自营项目 — 合同结算记录 — 分页搜索
export const getSelfSettleAccountsRecordPageList = id => get ('/self/contractSettle/searchPageList', id)

// 自营项目 — 合同结算记录 — 审核和反审核
export const checkAgainstSelfSettleAccountsRecord = data => get ('/self/contractSettle/checkOrAgainst', data)


/**----------------------------------------------------导航------------------------------------------------------- */


// 合同结算记录 — 添加 
export const addSettleAccountsRecord = data => post (`/bargain/contractSettle/add`, data)

// 合同结算记录 — 编辑 
export const editSettleAccountsRecord = data => putData (`/bargain/contractSettle/edit`, data)

// 合同结算记录 — 通过id查询
export const getSettleAccountsRecordById = id => get ('/bargain/contractSettle/queryById', id)

// 合同结算记录 — 审批 , 驳回 , 作废
export const completeSettleAccountsRecord = data => post ('/bargain/contractSettle/approveOrRejectOrCancelled', data)

// 合同结算记录 — 提交流程接口
export const submitSettleAccountsRecord = data => post (`/bargain/contractSettle/submit`, data)

// 合同结算记录 — 重新提交流程接口
export const resetSubmitSettleAccountsRecord = data => post ('/bargain/contractSettle/resubmit', data)

// 合同结算记录 — 批量删除
export const deleteBatchSettleAccountsRecord = ids => deleteData ('/bargain/contractSettle/deleteBatch', ids)

// 合同结算记录 — 分页搜索
export const getSettleAccountsRecordPageList = id => get ('/bargain/contractSettle/searchPageList', id)

// 合同结算记录 — 审核和反审核
export const checkAgainstSettleAccountsRecord = data => get ('/bargain/contractSettle/checkOrAgainst', data)

/**--------------------------------------------------联营项目------------------------------------------------------ */

// 联营项目 — 合同结算记录 — 添加 
export const addJointSettleAccountsRecord = data => post (`/joint/contractSettle/add/${data.projectId}`, data)

// 联营项目 — 合同结算记录 — 编辑 
export const editJointSettleAccountsRecord = data => putData (`/joint/contractSettle/edit/${data.projectId}`, data)

// 联营项目 — 合同结算记录 — 通过id查询
export const getJointSettleAccountsRecordById = id => get ('/joint/contractSettle/queryById', id)

// 联营项目 — 合同结算记录 — 审批 , 驳回 , 作废
export const completeJointSettleAccountsRecord = data => post ('/joint/contractSettle/approveOrRejectOrCancelled', data)

// 联营项目 — 合同结算记录 — 提交流程接口
export const submitJointSettleAccountsRecord = data => post (`/joint/contractSettle/submit/${data.projectId}`, data)

// 联营项目 — 合同结算记录 — 重新提交流程接口
export const resetSubmitJointSettleAccountsRecord = data => post ('/joint/contractSettle/resubmit', data)

// 联营项目 — 合同结算记录 — 批量删除
export const deleteBatchJointSettleAccountsRecord = data => deleteData (`/joint/contractSettle/deleteBatch/${data.projectId}`, data)

// 联营项目 — 合同结算记录 — 分页搜索
export const getJointSettleAccountsRecordPageList = id => get ('/joint/contractSettle/searchPageList', id)

// 联营项目 — 合同结算记录 — 审核和反审核
export const checkAgainstJointSettleAccountsRecord = data => get ('/joint/contractSettle/checkOrAgainst', data)