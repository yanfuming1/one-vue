import {get,post,putData,deleteData} from "../../../plugin/axios";

// 对外贷款审批-分页列表查询
export const getExternalLloanList = data => get ('/finance/externalLloan/list', data)

// 对外贷款审批-分页列表查询-新
export const getExternalLloanListNew = data => get ('/self/finance/externalLloan/list', data)

// 对外贷款审批-新增
export const getExternalLloanAdd = data => post ('/finance/externalLloan/add', data)

// 对外贷款审批-新增-新
export const getExternalLloanAddNew = data => post ('/self/finance/externalLloan/add/' + data.projectCode, data)

// 对外贷款审批-核审
export const getVerificationAdd = data => post ('/finance/externalLloan/verification', data)

// 对外贷款审批-核审-新
export const getVerificationAddNew = data => post ('/self/finance/externalLloan/verification/' + data.projectCode, data)

// 对外贷款审批-详情
export const getGoDetail = data => get ('/finance/externalLloan/goDetail', data)

// 对外贷款审批-编辑
export const getEdit = data => putData ('/finance/externalLloan/edit', data)

// 对外贷款审批-编辑-新
export const getEditNew = data => putData ('/self/finance/externalLloan/edit/' + data.projectCode, data)

// 对外贷款审批-编辑
export const submitFun = data => post ('/finance/externalLloan/submit', data)

// 对外贷款审批-编辑-新
export const submitFunNew = data => post ('/self/finance/externalLloan/submit/' + data.projectCode, data)

// 对外贷款审批-通过id查数据
export const getQueryById = data => get ('/finance/externalLloan/queryById', data)

// 对外贷款审批-查询下拉框数据
export const goBank = data => get ('/finance/externalLloan/goBank', data)

// 对外贷款审批-删除
export const deleteRow = data => deleteData ('/finance/externalLloan/delete', data)

// 对外贷款审批-删除-新
export const deleteRowNew = data => deleteData ('/self/finance/externalLloan/delete/' + data.projectCode, data)

// 对外贷款审批-删除
export const deleteBatch = data => deleteData ('/finance/externalLloan/deleteBatch', data)

// 对外贷款审批-删除-新
export const deleteBatchNew = data => deleteData ('/self/finance/externalLloan/deleteBatch/' + data.projectCode, data)

// 对外贷款审批-获取下拉框数据
export const goAdd = data => get ('/finance/externalLloan/goAdd', data)


// 对外贷款审批-同意
export const complete = data => post ('/finance/externalLloan/complete', data)

// 对外贷款审批-反审核
export const getAgainst = data => putData ('/finance/externalLloan/against', data)

// 对外贷款审批-审核
export const getCheck = data => putData ('/finance/externalLloan/check', data)

// 对外贷款审批-审核
export const updateAfterSubmit = data => post ('/finance/externalLloan/updateAfterSubmit', data)

// 对外贷款审批-审核-新
export const updateAfterSubmitNew = data => post ('/self/finance/externalLloan/updateAfterSubmit/' + data.projectCode, data)
