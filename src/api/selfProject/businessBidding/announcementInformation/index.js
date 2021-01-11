import {get,post,putData,deleteData} from "../../../../plugin/axios";

// 自营项目 — 业主招标 — 招标公告变更-添加 
export const addAnnouncementInformation = data => post (`/self/invitation/alteration/add/${data.projectCode}`, data)

// 自营项目 — 业主招标 — 招标公告变更-编辑 
export const editAnnouncementInformation = data => putData (`/self/invitation/alteration/edit/${data.projectCode}`, data)

// 自营项目 — 业主招标 — 招标公告变更-通过id查询
export const getAnnouncementInformationById = id => get ('/self/invitation/alteration/queryById', id)

// 自营项目 — 业主招标 — 招标公告变更-审批 , 驳回 , 作废
export const completeAnnouncementInformation = data => post ('/self/invitation/alteration/approveOrRejectOrCancelled', data)

// 自营项目 — 业主招标 — 招标公告变更-提交流程接口
export const submitAnnouncementInformation = data => post (`/self/invitation/alteration/submit/${data.projectCode}`, data)

// 自营项目 — 业主招标 — 招标公告变更-重新提交流程接口
export const resetSubmitAnnouncementInformation = data => post ('/self/invitation/alteration/resubmit', data)

// 自营项目 — 业主招标 — 招标公告变更-批量删除
export const deleteBatchAnnouncementInformation = ids => deleteData ('/self/invitation/alteration/deleteBatch', ids)

// 自营项目 — 业主招标 — 招标公告变更-分页搜索
export const getAnnouncementInformationPageList = id => get ('/self/invitation/alteration/page', id)

// 自营项目 — 业主招标 — 招标公告变更-审核和反审核
export const checkAgainstAnnouncementInformation = data => get ('/self/invitation/alteration/checkOrAgainst', data)