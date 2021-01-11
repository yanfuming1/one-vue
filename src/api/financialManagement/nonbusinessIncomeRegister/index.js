import {get,post,putData,deleteData} from "../../../plugin/axios";

// 营业外收入登记-分页列表查询
export const getQueryPageList = data => get ('/finance/takingRegister/queryPageList', data)

// 营业外收入登记-通过id查询数据
export const queryById = data => get ('/finance/takingRegister/queryById', data)

// 营业外收入登记-新增
export const getNonbusinessIncomeRegisterAdd = data => post ('/finance/takingRegister/add', data)

// 营业外收入登记-下拉框信息
export const goAdd = data => get ('/finance/takingRegister/goAdd', data)

// 营业外收入登记-删除
export const getDelete = data => deleteData ('/finance/takingRegister/delete', data)

// 营业外收入登记-批量删除
export const deleteBatch = data => deleteData ('/finance/takingRegister/deleteBatch', data)

// 营业外收入登记-下拉框信息
export const getEdit = data => putData ('/finance/takingRegister/edit', data)

// 营业外收入登记-提交
export const getSubmit = data => post ('/finance/takingRegister/submit', data)

// 营业外收入登记-重新提交
export const updateAfterSubmit = data => post ('/finance/takingRegister/updateAfterSubmit', data)

// 营业外收入登记-流程 同意
export const complete = data => post ('/finance/takingRegister/complete', data)

// 员工借款申请-反审核
export const getAgainst = data => putData ('/finance/takingRegister/against', data)

// 员工借款申请-z状态
export const queryByState = data => get ('/finance/takingRegister/queryByState', data)

// 员工借款申请-审核
export const getCheck = data => putData ('/finance/takingRegister/check', data)

// d导出
export const exportXls = data => post ('/finance/takingRegister/exportXls', data)

// d导出
export const getByAssociatedList = data => get ('/system/bankAccount/getByAssociatedList', data)

/* --------------------------------------------------------------------------------- */

// 营业外收入登记 - 自营项目 - 分页列表查询
export const getNonbusinessIncomeRegisterPageList = data => get ('/self/finance/takingRegister/queryPageList', data)

// 营业外收入登记 - 自营项目 - 批量删除
export const deleteBatchNonbusinessIncomeRegister = data => deleteData ('/self/finance/takingRegister/deleteBatch', data)

// 营业外收入登记 - 自营项目 - 新增
export const addNonbusinessIncomeRegister = data => post (`/self/finance/takingRegister/add/${data.projectCode}`, data)

// 营业外收入登记 - 自营项目 - 编辑
export const editNonbusinessIncomeRegister = data => putData (`/self/finance/takingRegister/edit/${data.projectCode}`, data)

// 营业外收入登记 - 自营项目 - 提交
export const submitNonbusinessIncomeRegister = data => post (`/self/finance/takingRegister/submit/${data.projectCode}`, data)

// 营业外收入登记 - 自营项目 - 重新提交
export const resetSubmitNonbusinessIncomeRegister = data => post (`/self/finance/takingRegister/updateAfterSubmit/${data.projectCode}`, data)