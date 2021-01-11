import {get,post,putData,deleteData} from "../../../plugin/axios";

// 自营项目 — 前期跟踪 — 跟踪了解-分页搜索
export const earlyStagePageList = data=> get ('/self/previous/traceMessage/searchPageList',data)

//  自营项目 — 前期跟踪 — 跟踪了解-添加
export const addNewStage = data=> post ('/self/previous/traceMessage/add/' + data.projectCode,data)

//  自营项目 — 前期跟踪 — 跟踪了解-编辑
export const editNewStage = data=> putData ('/self/previous/traceMessage/edit/' + data.projectCode,data)

//  自营项目 — 前期跟踪 — 跟踪了解-通过id查询
export const getNewStageById = data=> get ('/self/previous/traceMessage/queryById',data)

//  自营项目 — 前期跟踪 — 跟踪了解-提交流程接口
export const submitNewStage = data=> post ('/self/previous/traceMessage/submit/' + data.projectCode,data)

//  物资设备 - 采购申请-重新提交
export const resetSubmitNewStage = data=> post ('/self/previous/traceMessage/resubmit',data)

//  自营项目 — 前期跟踪 — 跟踪了解-审批 , 驳回 , 作废
export const completeNewStage = data=> post ('/self/previous/traceMessage/approveOrRejectOrCancelled',data)

//  自营项目 — 前期跟踪 — 跟踪了解-审核和反审核
export const stageCheckOrAgainst = data=> get ('/self/previous/traceMessage/checkOrAgainst',data)

//  自营项目 — 前期跟踪 — 跟踪了解-批量删除
export const stageDeleteBatch = data=> deleteData ('/self/previous/traceMessage/deleteBatch',data)

