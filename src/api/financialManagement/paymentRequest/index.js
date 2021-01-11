import {get,post,putData,deleteData} from "../../../plugin/axios";

// 对外付款申请-分页列表查询
export const getExternalPaymentApplicationList = data => get ('/finance/paymentApply/queryPageList', data)
// 对外付款申请-分页列表查询
export const getExternalPaymentApplicationPage = data => get ('/finance/paymentApply/page', data)
// 对外付款申请-新增
export const getExternalPaymentApplicationAdd = data => post ('/finance/paymentApply/add', data)
// 对外付款申请-删除
export const getExternalPaymentApplicationDel = data => deleteData ('/finance/paymentApply/deleteBatch', data)
// 对外付款申请-查询下拉框数据
export const getGoadd = data => get ('/finance/paymentApply/goAdd', data)
// 对外付款申请-查询下拉框银行数据
 // export const exceptUserAccount = data => get ('/system/bankAccount/exceptUserAccount', data)
export const exceptUserAccount = data => get ('/system/bankAccount/registerListAll', data)
// 对外付款申请-通过id查数据
export const getQueryById = data => get ('/finance/paymentApply/queryById', data)
// 对外付款申请-编辑
export const getEdit = data => putData ('/finance/paymentApply/edit', data)
// 对外付款申请-提交
export const getSubmit = data => post ('/finance/paymentApply/submit', data)

// 对外付款申请-获取下拉框
export const goBank = data => get ('/finance/paymentApply/goBank', data)

// 对外付款申请-流程 同意
export const complete = data => post ('/finance/paymentApply/complete', data)

// 对外付款申请-流程 同意
export const editAfterSubmit = data => putData ('/finance/paymentApply/editAfterSubmit', data)

// 对外付款申请-反审核
export const getAgainst = data => putData ('/finance/paymentApply/against', data)

// 对外付款申请-审核
export const getCheck = data => putData ('/finance/paymentApply/check', data)

/* --------------------------------------------------------------------------------- */

// 对外付款申请 - 自营项目 - 新增
export const addPaymentRequestToSelf = data => post ('/self/finance/paymentApply/add/' + data.projectCode, data)

// 对外付款申请 - 自营项目 - 反审核
export const againstPaymentRequestToSelf = data => putData ('/self/finance/paymentApply/against', data)

// 对外付款申请 - 自营项目 - 审核
export const checkPaymentRequestToSelf = data => putData ('/self/finance/paymentApply/check', data)

// 对外付款申请 - 自营项目 - 审批 , 驳回 , 作废
export const completePaymentRequestToSelf = data => post ('/self/finance/paymentApply/complete', data)

// 对外付款申请 - 自营项目 - 批量删除
export const deleteBatchPaymentRequestToSelf = data => deleteData ('/self/finance/paymentApply/deleteBatch/' + data.projectCode, data)

// 对外付款申请 - 自营项目 - 编辑
export const editPaymentRequestToSelf = data => putData ('/self/finance/paymentApply/edit/' + data.projectCode, data)

// 对外付款申请 - 自营项目 - 重新提交
export const resetSubmitPaymentRequestToSelf = data => post ('/self/finance/paymentApply/editAfterSubmit/' + data.projectCode, data)

// 对外付款申请 - 自营项目 - 通过id查数据
export const getPaymentRequestToSelfById = data => get ('/self/finance/paymentApply/queryById', data)

// 对外付款申请 - 自营项目 - 分页列表查询
export const getPaymentRequestToSelfList = data => get ('/self/finance/paymentApply/queryPageList', data)

// 对外付款申请 - 自营项目 - 提交
export const submitPaymentRequestToSelf = data => post ('/self/finance/paymentApply/submit/' + data.projectCode, data)