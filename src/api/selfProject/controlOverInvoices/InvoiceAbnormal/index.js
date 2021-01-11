import {get,post,putData,deleteData} from "../../../../plugin/axios";


// 发票管理 - 外层导航发票
// 发票管理 - 异常登记-分页搜索
export const getInvoiceAbnormalList = data=> get ('/invoice/abnormal/page', data)

// 发票管理 - 异常登记-通过id查询
export const queryByIdInvoiceAbnormal = data=> get ('/invoice/abnormal/queryById', data)

// 发票管理 - 异常登记-添加
export const addInvoiceAbnormal = data=> post ('/invoice/abnormal/add', data)

// 发票管理 - 异常登记-编辑
export const editInvoiceAbnormal = data=> putData ('/invoice/abnormal/edit', data)

// 发票管理 - 异常登记-通过id删除
export const delByIdInvoiceAbnormal = data=> deleteData ('/invoice/abnormal/delete', data)
// /qqtoi/flow/modelSynopsis/listByStartCrew?formKey=staffLoan

// 发票管理 - 异常登记-通过id批量删除
export const delByIdInvoiceAbnormalBatch = data=> deleteData ('/invoice/abnormal/deleteBatch', data)


// 运行中的流程-查询当前用户可启动的流程
// export const listByStartCrew = data => get('/flow/modelSynopsis/listByStartCrew', data)

// 发票管理 - 异常登记-提交
export const submitAddInvoiceAbnormal = data => post('/invoice/abnormal/submit', data)

// 发票管理 - 异常登记-重新提交
export const resetSubmitAddInvoiceAbnormal = data => post('/invoice/abnormal/resubmit', data)

// 发票管理 - 发票抵扣-审核-同意、驳回、作废
export const completeAddTicketReceiptRegistration = data => post('/invoice/abnormal/approveOrRejectOrCancelled', data)

// 发票管理 - 发票信息-通过id查询
export const queryByIdTicketReceiptRegistration = data=> get ('/invoice/origin/queryById', data)

//发票管理--自营项目

// 发票管理 - 异常登记-分页搜索
export const getSelfInvoiceAbnormalList = data=> get ('/self/invoice/abnormal/page', data)

// 发票管理 - 异常登记-通过id查询
export const queryByIdSelfInvoiceAbnormal = data=> get ('/self/invoice/abnormal/queryById', data)

// 发票管理 - 异常登记-添加
export const addSelfInvoiceAbnormal = data=> post ('/self/invoice/abnormal/add/' + data.projectCode, data)

// 发票管理 - 异常登记-编辑
export const editSelfInvoiceAbnormal = data=> putData ('/self/invoice/abnormal/edit/' + data.projectCode, data)

// 发票管理 - 异常登记-通过id删除
export const delByIdSelfInvoiceAbnormal = data=> deleteData ('/self/invoice/abnormal/delete', data)
// /qqtoi/flow/modelSynopsis/listByStartCrew?formKey=staffLoan

// 发票管理 - 异常登记-通过id批量删除
export const delByIdSelfInvoiceAbnormalBatch = data=> deleteData ('/self/invoice/abnormal/deleteBatch', data)

// 发票管理 - 异常登记-提交
export const submitSelfAddInvoiceAbnormal = data => post('/self/invoice/abnormal/submit/' + data.projectCode, data)

// 发票管理 - 异常登记-重新提交
export const resetSelfSubmitAddInvoiceAbnormal = data => post('/self/invoice/abnormal/resubmit', data)

// 发票管理 - 发票抵扣-审核-同意、驳回、作废
export const completeSelfAddTicketReceiptRegistration = data => post('/self/invoice/deduction/approveOrRejectOrCancelled', data)

// 发票管理 - 发票信息-通过id查询
export const queryByIdSelfTicketReceiptRegistration = data=> get ('/self/invoice/origin/queryById', data)

// 发票管理-反审核
export const checkOrAgains = data => get ('/invoice/abnormal/checkOrAgainst', data)

// 发票管理 - 自营项目 - 反审核
export const selfCheckOrAgains = data => get ('/self/invoice/abnormal/checkOrAgainst', data)


/** -----------------------------------------------自营项目------------------------------------------------ */


// 自营项目 - 异常登记-分页搜索
export const getJointInvoiceAbnormalList = data=> get ('/joint/invoice/abnormal/page', data)

// 自营项目 - 异常登记-通过id查询
export const queryByIdJointInvoiceAbnormal = data=> get ('/joint/invoice/abnormal/queryById', data)

// 自营项目 - 异常登记-添加
export const addJointInvoiceAbnormal = data=> post ('/joint/invoice/abnormal/add/' + data.projectId, data)

// 自营项目 - 异常登记-编辑
export const editJointInvoiceAbnormal = data=> putData ('/joint/invoice/abnormal/edit/' + data.projectId, data)

// 自营项目 - 异常登记-通过id删除
export const delByIdJointInvoiceAbnormal = data=> deleteData ('/joint/invoice/abnormal/delete', data)

// 自营项目 - 异常登记-通过id批量删除
export const delByIdJointInvoiceAbnormalBatch = data=> deleteData ('/joint/invoice/abnormal/deleteBatch', data)

// 自营项目 - 异常登记-提交
export const submitJointAddInvoiceAbnormal = data => post('/joint/invoice/abnormal/submit/' + data.projectId, data)

// 自营项目 - 异常登记-重新提交
export const resetJointSubmitAddInvoiceAbnormal = data => post('/joint/invoice/abnormal/resubmit', data)

// 自营项目 - 发票抵扣-审核-同意、驳回、作废
export const completeJointAddTicketReceiptRegistration = data => post('/joint/invoice/deduction/approveOrRejectOrCancelled', data)

// 自营项目 - 发票信息-通过id查询
export const queryByIdJointTicketReceiptRegistration = data=> get ('/joint/invoice/origin/queryById', data)

// 自营项目 - 自营项目 - 反审核
export const jointCheckOrAgains = data => get ('/joint/invoice/abnormal/checkOrAgainst', data)
