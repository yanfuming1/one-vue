import {get,post,putData,deleteData} from "../../../plugin/axios";

//  — 保证金缴纳 — -添加 
export const addPaymentDeposit = data => post (`/self/bargainChange/add/${data.projectCode}`, data)

//  — 保证金缴纳 — -编辑 
export const editPaymentDeposit = data => putData (`/self/bargainChange/edit/${data.projectCode}`, data)

//  — 保证金缴纳 — -通过id查询
export const getPaymentDepositById = id => get ('/self/bargainChange/queryById', id)

//  — 保证金缴纳 — -审批 , 驳回 , 作废
export const completePaymentDeposit = data => post ('/self/bargainChange/approveOrRejectOrCancelled', data)

//  — 保证金缴纳 — -提交流程接口
export const submitPaymentDeposit = data => post (`/self/bargainChange/submit/${data.projectCode}`, data)

//  — 保证金缴纳 — -重新提交流程接口
export const resetSubmitPaymentDeposit = data => post ('/self/bargainChange/resubmit', data)

//  — 保证金缴纳 — -批量删除
export const deleteBatchPaymentDeposit = data => deleteData (`/self/bargainChange/deleteBatch/${data.projectCode}`, data)

//  — 保证金缴纳 — -分页搜索
export const getPaymentDepositPageList = id => get ('/self/bargainChange/list', id)

//  — 保证金缴纳 — -审核和反审核
export const checkAgainstPaymentDeposit = data => get ('/self/bargainChange/checkOrAgainst', data)


/** --------------------------------------------------------------------------------------------------------- */

//  — 保证金退还 — -添加 
export const addReturnDeposit = data => post (`/self/bargainChange/add/${data.projectCode}`, data)

//  — 保证金退还 — -编辑 
export const editReturnDeposit = data => putData (`/self/bargainChange/edit/${data.projectCode}`, data)

//  — 保证金退还 — -通过id查询
export const getReturnDepositById = id => get ('/self/bargainChange/queryById', id)

//  — 保证金退还 — -审批 , 驳回 , 作废
export const completeReturnDeposit = data => post ('/self/bargainChange/approveOrRejectOrCancelled', data)

//  — 保证金退还 — -提交流程接口
export const submitReturnDeposit = data => post (`/self/bargainChange/submit/${data.projectCode}`, data)

//  — 保证金退还 — -重新提交流程接口
export const resetSubmitReturnDeposit = data => post ('/self/bargainChange/resubmit', data)

//  — 保证金退还 — -批量删除
export const deleteBatchReturnDeposit = data => deleteData (`/self/bargainChange/deleteBatch/${data.projectCode}`, data)

//  — 保证金退还 — -分页搜索
export const getReturnDepositPageList = id => get ('/self/bargainChange/list', id)

//  — 保证金退还 — -审核和反审核
export const checkAgainstReturnDeposit = data => get ('/self/bargainChange/checkOrAgainst', data)