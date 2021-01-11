import {get,post,putData,deleteData} from "../../../../plugin/axios";

// 发票管理 - 申请退税-分页搜索
export const getInvoiceDrawBackList = data=> get ('/invoice/drawback/page', data)

// 发票管理 - 申请退税-通过id查询
export const queryByIdInvoiceDrawback = data=> get ('/invoice/drawback/queryById', data)

// 发票管理 - 申请退税-添加
export const addInvoiceDrawback = data=> post ('/invoice/drawback/add', data)

// 发票管理 - 申请退税-编辑
export const editInvoiceDrawback = data=> putData ('/invoice/drawback/edit', data)

// 发票管理 - 申请退税-通过id删除
export const delByIdInvoiceDrawback = data=> deleteData ('/invoice/drawback/delete', data)
// /qqtoi/flow/modelSynopsis/listByStartCrew?formKey=staffLoan

// 发票管理 - 申请退税-通过id批量删除
export const delByIdInvoiceDrawbackBatch = data=> deleteData ('/invoice/drawback/deleteBatch', data)

// 发票管理 - 申请退税-提交
export const submitAddInvoiceDrawback = data => post('/invoice/drawback/submit', data)

// 发票管理 - 申请退税-重新提交
export const resetSubmitAddInvoiceDrawback = data => post('/invoice/drawback/resubmit', data)

// 发票管理 - 申请退税-审核-同意、驳回、作废
export const drawbackApproveOrRejectOrCancelled = data => post('/invoice/drawback/approveOrRejectOrCancelled', data)

// 发票管理 - 发票抵扣-审核-同意、驳回、作废
export const completeAddTicketReceiptRegistration = data => post('/invoice/deduction/approveOrRejectOrCancelled', data)

// 发票管理 - 发票信息-通过id查询
export const queryByIdTicketReceiptRegistration = data=> get ('/invoice/origin/queryById', data)

// 发票管理 - 发票信息-通过id查询
export const queryByIdSelfDrawbackHistory = data=> get ('/self/invoice/drawback/history', data)

// 发票管理 - 发票信息-通过id查询
export const queryByIdDrawbackHistory = data=> get ('/invoice/drawback/history', data)


// 发票管理 - 申请退税-分页搜索
export const getSelfInvoiceDrawBackList = data=> get ('/self/invoice/drawback/page', data)

// 发票管理 - 申请退税-通过id查询
export const queryByIdSelfInvoiceDrawback = data=> get ('/self/invoice/drawback/queryById', data)

// 发票管理 - 申请退税-添加
export const addSelfInvoiceDrawback = data=> post ('/self/invoice/drawback/add/' + data.projectCode, data)

// 发票管理 - 申请退税-编辑
export const editSelfInvoiceDrawback = data=> putData ('/self/invoice/drawback/edit/' + data.projectCode, data)

// 发票管理 - 申请退税-通过id删除
export const delByIdSelfInvoiceDrawback = data=> deleteData ('/self/invoice/drawback/delete', data)
// /qqtoi/flow/modelSynopsis/listByStartCrew?formKey=staffLoan

// 发票管理 - 申请退税-通过id批量删除
export const delByIdSelfInvoiceDrawbackBatch = data=> deleteData ('/self/invoice/drawback/deleteBatch', data)

// 发票管理 - 申请退税-提交
export const submitSelfAddInvoiceDrawback = data => post('/self/invoice/drawback/submit/' + data.projectCode, data)

// 发票管理 - 申请退税-重新提交
export const resetSelfSubmitAddInvoiceDrawback = data => post('/self/invoice/drawback/resubmit', data)

// 发票管理 - 发票抵扣-审核-同意、驳回、作废
export const completeSelfAddTicketReceiptRegistration = data => post('/self/invoice/deduction/approveOrRejectOrCancelled', data)

// 发票管理 - 发票信息-通过id查询
export const queryByIdSelfTicketReceiptRegistration = data=> get ('/self/invoice/origin/queryById', data)

// 发票管理-反审核
export const checkOrAgains = data => get ('/invoice/drawback/checkOrAgainst', data)

// 发票管理 - 自营项目 - 反审核
export const selfCheckOrAgains = data => get ('/self/invoice/drawback/checkOrAgainst', data)


/**---------------------------------------------------------------联营项目----------------------------------------------------------- */

// 联营项目 - 发票信息-通过id查询
export const queryByIdJointDrawbackHistory = data=> get ('/joint/invoice/drawback/history', data)

// 联营项目 - 申请退税-分页搜索
export const getJointInvoiceDrawBackList = data=> get ('/joint/invoice/drawback/page', data)

// 联营项目 - 申请退税-通过id查询
export const queryByIdJointInvoiceDrawback = data=> get ('/joint/invoice/drawback/queryById', data)

// 联营项目 - 申请退税-添加
export const addJointInvoiceDrawback = data=> post ('/joint/invoice/drawback/add/' + data.projectId, data)

// 联营项目 - 申请退税-编辑
export const editJointInvoiceDrawback = data=> putData ('/joint/invoice/drawback/edit/' + data.projectId, data)

// 联营项目 - 申请退税-通过id删除
export const delByIdJointInvoiceDrawback = data=> deleteData ('/joint/invoice/drawback/delete', data)

// 联营项目 - 申请退税-通过id批量删除
export const delByIdJointInvoiceDrawbackBatch = data=> deleteData ('/joint/invoice/drawback/deleteBatch', data)

// 联营项目 - 申请退税-提交
export const submitJointAddInvoiceDrawback = data => post('/joint/invoice/drawback/submit/' + data.projectId, data)

// 联营项目 - 申请退税-重新提交
export const resetJointSubmitAddInvoiceDrawback = data => post('/joint/invoice/drawback/resubmit', data)

// 联营项目 - 发票抵扣-审核-同意、驳回、作废
export const completeJointAddTicketReceiptRegistration = data => post('/joint/invoice/deduction/approveOrRejectOrCancelled', data)

// 联营项目 - 发票信息-通过id查询
export const queryByIdJointTicketReceiptRegistration = data=> get ('/joint/invoice/origin/queryById', data)

// 联营项目 - 自营项目 - 反审核
export const jointCheckOrAgains = data => get ('/joint/invoice/drawback/checkOrAgainst', data)