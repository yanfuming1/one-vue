import {get,post,putData,deleteData} from "../../../../plugin/axios";

// 自营项目 — 安全管理 - 安全事故处理-分页列表查询
export const getHandleList = data => get ('/self/safeHandle/list', data)

// 自营项目 — 安全管理 - 安全事故处理-批量删除
export const delHandleBatch = data => deleteData ('/self/safeHandle/deleteBatch', data)

// 自营项目 — 安全管理 - 安全事故处理-添加
export const addSafeHandle = data => post ('/self/safeHandle/add', data)

// 自营项目 — 安全管理 - 安全事故处理-编辑
export const editSafeHandle = data => putData ('/self/safeHandle/edit', data)

// 自营项目 — 安全管理 - 安全事故处理-提交流程接口
export const submitSafeHandle = data => post ('/self/safeHandle/submit', data)

// 自营项目 — 安全管理 - 安全事故处理-重新提交
export const resubmitSafeHandle = data => post ('/self/safeHandle/resubmit', data)

// 自营项目 — 安全管理 - 安全事故处理-通过id查询
export const queryByIdSafeHandle = data => get ('/self/safeHandle/queryById', data)

// 自营项目 — 安全管理 - 安全事故处理-审批 , 驳回 , 作废
export const safeHandledSafeHandle = data => post ('/self/safeHandle/approveOrRejectOrCancelled', data)