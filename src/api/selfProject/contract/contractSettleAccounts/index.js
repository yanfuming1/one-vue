import {get,post,putData,deleteData} from "../../../../plugin/axios";

// 自营项目 — 合同结算 — 添加 
export const addSelfContractSettleAccounts = data => post (`/self/managerCreate/add/${data.projectCode}`, data)

// 自营项目 — 合同结算 — 编辑 
export const editSelfContractSettleAccounts = data => putData (`/self/managerCreate/edit/${data.projectCode}`, data)

// 自营项目 — 合同结算 — 通过id查询
export const getSelfContractSettleAccountsById = id => get ('/self/managerCreate/queryById', id)

// 自营项目 — 合同结算 — 审批 , 驳回 , 作废
export const completeSelfContractSettleAccounts = data => post ('/self/managerCreate/approveOrRejectOrCancelled', data)

// 自营项目 — 合同结算 — 提交流程接口
export const submitSelfContractSettleAccounts = data => post (`/self/managerCreate/submit/${data.projectCode}`, data)

// 自营项目 — 合同结算 — 重新提交流程接口
export const resetSubmitSelfContractSettleAccounts = data => post ('/self/managerCreate/resubmit', data)

// 自营项目 — 合同结算 — 批量删除
export const deleteBatchSelfContractSettleAccounts = data => deleteData (`/self/managerCreate/deleteBatch/${data.projectCode}`, data)

// 自营项目 — 合同结算 — 分页搜索
export const getSelfContractSettleAccountsPageList = id => get ('/self/managerCreate/list', id)

// 自营项目 — 合同结算 — 审核和反审核
export const checkAgainstSelfContractSettleAccounts = data => get ('/self/managerCreate/checkOrAgainst', data)

// 自营项目 — 合同结算 — 列表去重
export const getSelfContractSettleAccountsList = id => get ('/self/managerCreate/list', id)


/**-------------------------------------------------------导航---------------------------------------------------------------- */


// 合同结算 — 添加 
export const addContractSettleAccounts = data => post (`/bargain/managerCreate/add`, data)

// 合同结算 — 编辑 
export const editContractSettleAccounts = data => putData (`/bargain/managerCreate/edit`, data)

// 合同结算 — 通过id查询
export const getContractSettleAccountsById = id => get ('/bargain/managerCreate/queryById', id)

// 合同结算 — 审批 , 驳回 , 作废
export const completeContractSettleAccounts = data => post ('/bargain/managerCreate/approveOrRejectOrCancelled', data)

// 合同结算 — 提交流程接口
export const submitContractSettleAccounts = data => post (`/bargain/managerCreate/submit`, data)

// 合同结算 — 重新提交流程接口
export const resetSubmitContractSettleAccounts = data => post ('/bargain/managerCreate/resubmit', data)

// 合同结算 — 批量删除
export const deleteBatchContractSettleAccounts = ids => deleteData ('/bargain/managerCreate/deleteBatch', ids)

// 合同结算 — 分页搜索
export const getContractSettleAccountsPageList = id => get ('/bargain/managerCreate/list', id)

// 合同结算 — 审核和反审核
export const checkAgainstContractSettleAccounts = data => get ('/bargain/managerCreate/checkOrAgainst', data)

// 合同结算 — 列表去重
export const getContractSettleAccountsList = id => get ('/bargain/managerCreate/list', id)