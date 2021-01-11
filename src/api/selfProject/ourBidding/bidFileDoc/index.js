import { get, post, putData, deleteData } from "../../../../plugin/axios"

// 自营项目 — 我方投标 — 资格预审文件审核-分页搜索
export const bidFileDocPage = data => get ('/self/bid/tender/page', data)

// 自营项目 — 我方投标 — 投标文件编制审核-通过id查询
export const bidFileDocQueryById = data => get ('	/self/bid/tender/queryById', data)

// 自营项目 — 我方投标 — 投标文件编制审核-批量删除
export const bidFileDocDeleteBatch = data => deleteData ('/self/bid/tender/deleteBatch', data)

// 自营项目 — 我方投标 — 投标文件编制审核-审核和反审核
export const bidFileDocCheck = data => get ('	/self/bid/tender/checkOrAgainst', data)

// 自营项目 — 我方投标 — 投标文件编制审核-添加
export const bidFileDocAdd = data => post (`/self/bid/tender/add/${data.projectCode}`, data)

// 自营项目 — 我方投标 — 投标文件编制审核-编辑
export const bidFileDocEdit = data => putData (`/self/bid/tender/edit/${data.projectCode}`, data)

// 自营项目 — 我方投标 — 投标文件编制审核-提交流程接口
export const bidFileDocSubmit = data => post (`/self/bid/tender/submit/${data.projectCode}`, data)

// 物资设备 - 采购申请-重新提交
export const bidFileDocReSubmit = data => post ('/self/bid/tender/resubmit', data)

// 自营项目 — 我方投标 — 投标文件编制审核-审批 , 驳回 , 作废
export const bidFileDocOperation = data => post ('/self/bid/tender/approveOrRejectOrCancelled', data)
