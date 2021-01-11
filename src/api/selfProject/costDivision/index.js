import { get, post, putData } from "../../../plugin/axios";

// 自营项目 — 成本划分 — 招标公告变更-添加 
export const addCostDivision = data => post (`/self/costAccount/add`, data)

// 自营项目 — 成本划分 — 招标公告变更-编辑 
export const editCostDivision = data => putData (`/self/costAccount/edit`, data)

// 自营项目 — 成本划分 — 招标公告变更-通过code查询
export const getCostDivisionById = code => get ('/self/costAccount/queryListByCode', code)

// 自营项目 — 成本划分 — 招标公告变更-审批 , 驳回 , 作废
export const completeCostDivision = data => post ('/self/costAccount/approveOrRejectOrCancelled', data)

// 自营项目 — 成本划分 — 招标公告变更-提交流程接口
export const submitCostDivision = data => post (`/self/costAccount/submit`, data)

// 自营项目 — 成本划分 — 招标公告变更-重新提交流程接口
export const resetSubmitCostDivision = data => post ('/self/costAccount/resubmit', data)