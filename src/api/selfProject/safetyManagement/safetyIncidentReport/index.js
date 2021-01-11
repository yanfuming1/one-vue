import {get,post,putData,deleteData} from "../../../../plugin/axios";
// 自营项目 — 安全事故报告-分页列表查询
export const getSafetyIncidentReportList = data => get ('/self/safeAccident/list', data)

// 自营项目 — 安全管理 - 安全事故报告-批量删除
export const delSafetyIncidentReport = data => deleteData ('/self/safeAccident/deleteBatch', data)

// 自营项目 — 安全管理 - 安全事故报告-添加
export const addSafetyIncidentReport = data => post ('/self/safeAccident/add', data)

// 自营项目 — 安全管理 - 安全事故报告-通过id查询
export const querySafetyIncidentReportById = data => get ('/self/safeAccident/queryById', data)

// 自营项目 — 安全管理 - 安全事故报告-编辑
export const editSafetyIncidentReport = data => putData ('/self/safeAccident/edit', data)

// 自营项目 — 安全管理 - 安全事故报告-提交流程接口
export const sumbitSafetyIncidentReport = data => post ('/self/safeAccident/submit', data)

// 自营项目 — 安全管理 - 安全事故报告-重新提交
export const repeatSafetyIncidentReportSumbit = data => post ('/self/safeAccident/resubmit', data)

// 自营项目 — 安全管理 - 安全事故报告-审批 , 驳回 , 作废
export const completeSafetyIncidentReport = data => post ('/self/safeAccident/approveOrRejectOrCancelled', data)