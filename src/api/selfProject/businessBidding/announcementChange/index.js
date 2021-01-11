import {get,post,putData,deleteData} from "../../../../plugin/axios";

// 自营-业主招标-添加 
export const addAnnouncementChange = data => post (`/self/invitation/register/add/${data.projectCode}`, data)

// 自营-业主招标-编辑 
export const editAnnouncementChange = data => putData (`/self/invitation/register/edit/${data.projectCode}`, data)

// 	自营项目 — 业主招标 — 招标公告变更-通过projectCode查询
export const getAnnouncementChangeByProjectCode = code => get ('/self/invitation/register/selectByProjectCode', code)

// 自营-业主招标-通过id查询
export const getAnnouncementChangeById = id => get ('/self/invitation/register/queryById', id)

// 自营-业主招标-审批 , 驳回 , 作废
export const completeAnnouncementChange = data => post ('/self/invitation/register/approveOrRejectOrCancelled', data)

// 自营-业主招标-提交流程接口
export const submitAnnouncementChange = data => post (`/self/invitation/register/submit/${data.projectCode}`, data)

// 自营-业主招标-重新提交流程接口
export const resetSubmitAnnouncementChange = data => post ('/self/invitation/register/resubmit', data)