import { get, post, putData, deleteData } from "../../../../plugin/axios"

// 自营项目 — 我方投标 — 开标登记-通过id查询
export const selfProOpenTenderById = data => get ('/self/bid/open/queryById', data)

// 自营项目 — 我方投标 — 开标登记-编辑
export const selfProOpenTenderEdit = data => putData (`/self/bid/open/edit/${data.projectCode}`, data)

// 自营项目 — 我方投标 — 开标登记-添加
export const selfProOpenTenderAdd = data => post (`/self/bid/open/add/${data.projectCode}`, data)

// 自营项目 — 我方投标 — 开标登记-提交流程接口
export const selfProOpenTenderSub = data => post (`/self/bid/open/submit/${data.projectCode}`, data)

// 自营 - 我方投标 - 重新提交
export const selfProOpenTenderReSub = data => post ('/self/bid/open/resubmit', data)

// 自营项目 — 我方投标 — 开标登记-审批 , 驳回 , 作废
export const selfProOpenTenderOperation = data => post ('/self/bid/open/approveOrRejectOrCancelled', data)

// 自营项目 — 我方投标 — 开标登记-通过项目编码查询
export const selfProOpenTenderByProCode = data => get ('/self/bid/open/queryByProjectCode', data)
