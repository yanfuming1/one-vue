import {get,post,putData,deleteData} from "../../../../../plugin/axios";

// 	自营-成本核算-责任成本与目标成本-本地导入
export const xlsExcelByLocal = data => post ('self/cost/costTargetResponsibility/xlsExcelByLocal', data) 

// 自营-成本核算-责任成本与目标成本-添加
export const addResponsibilityCost = data => post ('/self/cost/costTargetResponsibility/add', data) 

// 自营-成本核算-责任成本与目标成本-保存
export const editResponsibilityCost = data => putData ('/self/cost/costTargetResponsibility/edit', data) 

// 自营-成本核算-责任成本与目标成本-提交
export const submitResponsibilityCost = data => post ('/self/cost/costTargetResponsibility/submit', data) 

// 自营-成本核算-责任成本与目标成本-查询
export const getResponsibilityCost = data => get ('/self/cost/costTargetResponsibility/getByProjectCodeAndCostType', data) 

// 自营项目 — 预算管理-分页搜索
// 自营项目 — 预算管理-查询已完结的最高级预算
export const getBudgetManagerCostSearch = data => get ('/self/budget/budgetManager/costSearch', data) 

// 自营-成本核算-责任成本与目标成本-预算导入
export const xlsExcelByBudget = data => get ('/self/cost/costTargetResponsibility/xlsExcelByBudget', data) 

// 自营-责任成本与目标成本-审批 , 驳回 , 作废
export const approvBudgetManagerCost = data => post ('/self/cost/costTargetResponsibility/approveOrRejectOrCancelled', data) 

// 自营-成本-实际成本-重新提交
export const resubmitBudgetManagerCost = data => post ('/self/cost/costTargetResponsibility/resubmit', data) 