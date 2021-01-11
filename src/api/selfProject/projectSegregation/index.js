import {get,post,putData,deleteData} from "../../../plugin/axios";

// 自营项目 — 项目划分 — 模块划分-树状查询
export const projectSegregationGetTree = data=> get ('/self/divide/module/tree', data)

// 自营项目 — 项目划分 — 级别设置-列表查询
export const projectLevelSettingList = data=> get ('/self/divide/rank/list', data)

// 自营项目 — 项目划分 — 级别设置-添加
export const projectLevelSettingAdd = data=> post (`/self/divide/rank/addList/${data.projectCode}`, data.list)

// 自营项目 — 项目划分 — 模块划分-添加
export const projectModelAdd = data=> post (`/self/divide/module/add/${data.projectCode}`, data)

// 自营项目 — 项目划分 — 模块划分-添加
export const projectModelEdit = data=> putData (`/self/divide/module/edit/${data.projectCode}`, data)

// 自营项目 — 项目划分 — 模块划分-通过id删除
export const projectModelDel = data=> deleteData ('/self/divide/module/delete', data)

// 自营项目 — 项目划分 — 模块划分-提交流程接口
export const projectSegregationSub = data=> post (`/self/divide/module/submit/${data.projectCode}`, data)

// 自营项目 — 项目划分 — 模块划分-重新提交
export const projectModelResub = data=> post ('/self/divide/module/resubmit', data)

// 自营项目 — 项目划分 — 模块划分-通过projectCode查询审批信息
export const projectModelApproval = data=> get (`/self/divide/module/getApproval`, data)

// 自营项目 — 项目划分 — 模块划分-审批 , 驳回 , 作废
export const projectModelOperation = data=> post ('/self/divide/module/approveOrRejectOrCancelled', data)

// 自营项目 — 项目划分 — 模块划分-列表查询
export const projectModelList = data=> get ('/self/divide/module/list', data)

