import { get, post, putData, deleteData } from "../../../../plugin/axios"

// 自营项目 — 我方投标 — 资格预审文件审核-分页搜索
export const prequalificationDocumentsPage = data => get ('/self/bid/qualification/page', data)

// 自营项目 — 我方投标 — 资格预审文件审核-批量删除
export const prequalificationDocumentsDelete = data => deleteData ('/self/bid/qualification/deleteBatch', data)

// 自营项目 — 我方投标 — 资格预审文件审核-通过id查询
export const prequalificationDocumentsQueryById = data => get ('/self/bid/qualification/queryById', data)

// 自营项目 — 我方投标 — 资格预审文件审核-添加
export const prequalificationDocumentsAdd = data => post (`/self/bid/qualification/add/${data.projectCode}`, data)

// 自营项目 — 我方投标 — 资格预审文件审核-编辑
export const prequalificationDocumentsEdit = data => putData (`/self/bid/qualification/edit/${data.projectCode}`, data)

// 自营项目 — 我方投标 — 资格预审文件审核-提交流程接口
export const prequalificationDocumentsSubmit = data => post (`/self/bid/qualification/submit/${data.projectCode}`, data)

// 自营项目 — 我方投标 — 资格预审文件审核-重新提交流程接口
export const prequalificationDocumentsReSubmit = data => post ('/self/bid/qualification/submit', data)

// 自营项目 — 我方投标 — 资格预审文件审核-审批 , 驳回 , 作废
export const prequalificationDocumentsOperation = data => post ('/self/bid/qualification/approveOrRejectOrCancelled', data)

// 自营项目 — 我方投标 — 资格预审文件审核-审核和反审核
export const prequalificationDocCheck = data => get ('/self/bid/qualification/checkOrAgainst', data)
