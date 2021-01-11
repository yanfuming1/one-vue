import {get,post,putData,deleteData} from "../../../../plugin/axios";

// 自营项目 - 经济核算 - 收入登记-添加
export const addIncomeRegistered = data => post ('/self/income/check/add/' + data.projectCode, data) 

// 自营项目 - 经济核算 - 收入登记-分页搜索
export const getIncomeRegistered = data => get ('/self/income/check/page', data) 

// 自营项目 - 经济核算 - 收入登记-通过id查询
export const getIncomeRegisteredQueryById = data => get ('/self/income/check/queryById', data) 

// 自营项目 - 经济核算 - 收入登记-编辑
export const editIncomeRegistered = data => putData ('/self/income/check/edit/' + data.projectCode, data) 

//  自营项目 - 经济核算 - 收入登记-批量删除
export const delIncomeRegisteredBach = data => deleteData ('/self/income/check/deleteBatch/' + data.projectCode, data) 

// 	自营项目 - 经济核算 - 收入登记-提交流程接口
export const submitIncomeRegistered = data => post ('/self/income/check/submit/' + data.projectCode, data) 

//	自营项目 - 经济核算 - 收入登记 - 到账记录-提交流程接口
export const submitAccountRegistered = data => post ('/self/income/account/submit/' + data.projectCode, data) 

// 自营项目 - 经济核算 - 收入登记 - 到账记录-分页搜索
export const getIncomeAccountd = data => get ('/self/income/account/page', data) 

// 自营项目 - 经济核算 - 收入登记-收入金额合计
export const getIncomeTotal = data => get ('/self/income/check/incomeTotal', data) 

//  自营项目 — 经济核算 - 收入登记 , 驳回 , 作废
export const completeIncomeRegistered = data => post ('/self/income/check/approveOrRejectOrCancelled', data) 