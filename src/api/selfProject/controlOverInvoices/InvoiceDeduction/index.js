import {get,post,putData,deleteData} from "../../../../plugin/axios";

// 发票管理 - 发票抵扣-分页搜索
export const getInvoiceDeductionList = data=> get ('/invoice/deduction/page', data)

// 发票管理 - 发票抵扣-通过id查询
export const queryByIdInvoiceDeduction = data=> get ('/invoice/deduction/queryById', data)

// 发票管理 - 发票信息-通过id查询
export const queryByIdTicketReceiptRegistration = data=> get ('/invoice/origin/queryById', data)

// 发票管理 - 发票抵扣-添加
export const addInvoiceDeduction = data=> post ('/invoice/deduction/add' , data)

// 发票管理 - 发票抵扣-编辑
export const editInvoiceDeduction = data=> putData ('/invoice/deduction/edit' , data)

// 发票管理 - 发票抵扣-通过id删除
export const delByIdInvoiceDeduction = data=> deleteData ('/invoice/deduction/delete', data)
// /qqtoi/flow/modelSynopsis/listByStartCrew?formKey=staffLoan

// 发票管理 - 发票抵扣-通过id批量删除
export const delByIdInvoiceDeductionBatch = data=> deleteData ('/invoice/deduction/deleteBatch', data)


// 运行中的流程-查询当前用户可启动的流程
export const listByStartCrew = data => get('/flow/modelSynopsis/listByStartCrew', data)

// 发票管理 - 发票抵扣-提交
export const submitAddInvoiceDeduction = data => post('/invoice/deduction/submit' , data)

// 发票管理 - 发票抵扣-重新提交
export const resetSubmitAddInvoiceDeduction = data => post('/invoice/deduction/resubmit' , data)

// 发票管理 - 发票抵扣-审核-同意、驳回、作废
export const completeAddTicketReceiptRegistration = data => post('/invoice/deduction/approveOrRejectOrCancelled', data)

// /invoice/deduction/checkOrAgainst  审核反审核


//自营发票

// 发票管理 - 发票抵扣-分页搜索
export const getSelfInvoiceDeductionList = data=> get ('/self/invoice/deduction/page', data)

// 发票管理 - 发票抵扣-通过id查询
export const queryByIdSelfInvoiceDeduction = data=> get ('/self/invoice/deduction/queryById', data)

// 发票管理 - 发票信息-通过id查询
export const queryByIdSelfTicketReceiptRegistration = data=> get ('/self/invoice/origin/queryById', data)

// 发票管理 - 发票抵扣-添加
export const addSelfInvoiceDeduction = data=> post ('/self/invoice/deduction/add/' + data.projectCode, data)

// 发票管理 - 发票抵扣-编辑
export const editSelfInvoiceDeduction = data=> putData ('/self/invoice/deduction/edit/' + data.projectCode, data)

// 发票管理 - 发票抵扣-通过id删除
export const delByIdSelfInvoiceDeduction = data=> deleteData ('/self/invoice/deduction/delete', data)
// /qqtoi/flow/modelSynopsis/listByStartCrew?formKey=staffLoan

// 发票管理 - 发票抵扣-通过id批量删除
export const delByIdSelfInvoiceDeductionBatch = data=> deleteData ('/self/invoice/deduction/deleteBatch', data)

// 发票管理 - 发票抵扣-提交
export const submitSelfAddInvoiceDeduction = data => post('/self/invoice/deduction/submit/' + data.projectCode, data)

// 发票管理 - 发票抵扣-重新提交
export const resetSelfSubmitAddInvoiceDeduction = data => post('/self/invoice/deduction/resubmit' , data)

// 发票管理 - 发票抵扣-审核-同意、驳回、作废
export const completeSelfAddTicketReceiptRegistration = data => post('/self/invoice/deduction/approveOrRejectOrCancelled', data)

// /self/invoice/deduction/checkOrAgainst  审核反审核

// 发票管理-反审核
export const checkOrAgains = data => get ('/invoice/deduction/checkOrAgainst', data)

// 发票管理 - 自营项目 - 反审核
export const selfCheckOrAgains = data => get ('/self/invoice/deduction/checkOrAgainst', data)


/**---------------------------------------------联营项目------------------------------------------------- */

// 联营项目 - 发票抵扣-分页搜索
export const getJointInvoiceDeductionList = data=> get ('/joint/invoice/deduction/page', data)

// 联营项目 - 发票抵扣-通过id查询
export const queryByIdJointInvoiceDeduction = data=> get ('/joint/invoice/deduction/queryById', data)

// 联营项目 - 发票信息-通过id查询
export const queryByIdJointTicketReceiptRegistration = data=> get ('/joint/invoice/origin/queryById', data)

// 联营项目 - 发票抵扣-添加
export const addJointInvoiceDeduction = data=> post ('/joint/invoice/deduction/add/' + data.projectId, data)

// 联营项目 - 发票抵扣-编辑
export const editJointInvoiceDeduction = data=> putData ('/joint/invoice/deduction/edit/' + data.projectId, data)

// 联营项目 - 发票抵扣-通过id删除
export const delByIdJointInvoiceDeduction = data=> deleteData ('/joint/invoice/deduction/delete', data)

// 联营项目 - 发票抵扣-通过id批量删除
export const delByIdJointInvoiceDeductionBatch = data=> deleteData ('/joint/invoice/deduction/deleteBatch', data)

// 联营项目 - 发票抵扣-提交
export const submitJointAddInvoiceDeduction = data => post('/joint/invoice/deduction/submit/' + data.projectId, data)

// 联营项目 - 发票抵扣-重新提交
export const resetJointSubmitAddInvoiceDeduction = data => post('/joint/invoice/deduction/resubmit' , data)

// 联营项目 - 发票抵扣-审核-同意、驳回、作废
export const completeJointAddTicketReceiptRegistration = data => post('/joint/invoice/deduction/approveOrRejectOrCancelled', data)

// 联营项目 - 自营项目 - 反审核
export const jointCheckOrAgains = data => get ('/joint/invoice/deduction/checkOrAgainst', data)
