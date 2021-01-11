import {get,post,putData,deleteData} from "../../../plugin/axios";

// 自营项目 — 立项登记-添加
export const approvalAdd = data=> post ('/self/approval/approval/add/' + data.projectCode, data)

// 自营项目 — 立项登记-编辑
export const approvalEdit = data=> putData ('/self/approval/approval/edit/' + data.projectCode, data)

// 自营项目 — 立项登记-通过id查询
export const selfApprovalQuery = data=> get ('/self/approval/approval/queryById', data)

// 自营项目 — 立项登记-提交流程接口
export const approvalSubmit = data=> post ('/self/approval/approval/submit/' + data.projectCode, data)

// 自营项目 — 立项登记-重新提交
export const approvalResubmit = data=> post ('/self/approval/approval/resubmit', data)

// 自营项目 — 立项登记-审批 , 驳回 , 作废
export const approvalOperation = data=> post ('/self/approval/approval/approveOrRejectOrCancelled', data)

// 	自营项目 — 立项登记-通过项目编码查询
export const approvalEditQueryByCode = data=> get ('/self/approval/approval/queryByCode', data)


