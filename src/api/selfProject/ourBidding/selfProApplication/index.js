import {get,post,putData,deleteData} from "../../../../plugin/axios";

// 自营-投保报名申请-通过id查询
export const projectApplyQueryById = data=> get ('/self/bid/apply/queryById',data)

// 自营-投保报名申请-添加
export const projectApplyAdd = data=> post ('/self/bid/apply/add/' + data.projectCode ,data)

// 自营-投保报名申请-编辑
export const projectApplyEdit = data=> putData ('/self/bid/apply/edit/' + data.projectCode ,data)

// 自营-投保报名申请-提交流程接口
export const projectApplySubmit = data=> post ('/self/bid/apply/submit/' + data.projectCode ,data)

// 自营-投保报名申请-审批 , 驳回 , 作废
export const projectApplyOperation = data=> post ('/self/bid/apply/approveOrRejectOrCancelled' ,data)

// 自营 - 我方投标 - 项目报名申请-通过项目编码查询
export const projectApplyQueryByCode = data=> get ('/self/bid/apply/getByProjectCode',data)

// 自营 - 我方投标 - 重新提交
export const projectApplyReSubmit = data=> post ('/self/bid/apply/resubmit' ,data)