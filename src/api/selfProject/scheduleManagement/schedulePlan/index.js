import {get,post,putData,deleteData} from "../../../../plugin/axios";

// 自营项目 - 质量管理 - 质量整改-分页搜索
export const selfSchedulePlanList = data=> get ('/self/schedule/plan/divideList', data)

// 自营项目 - 进度管理 - 进度计划-列表全部查询
export const selfSchedulePlanAllList = data=> get ('/self/schedule/plan/list', data)

// 自营项目 - 进度管理 - 总进度计划-列表全部查询
export const selfScheduleOverallAllList = data=> get ('/self/schedule/overall/list', data)

// 自营项目 - 进度管理 - 进度计划-列表全部查询--排序
export const selfSchedulePlanOrderedList = data=> get ('/self/schedule/plan/orderedList', data)

// 自营项目 - 进度管理 - 进度计划-列表全部查询
export const selfSchedulePlanPageList = data=> get ('/self/schedule/overall/page', data)

// 自营项目 - 进度管理 - 实际进度-一个总计划的进度记录
export const listByOverallIdList = data=> get ('/self/schedule/actual/listByOverallId', data)

// 自营项目 - 进度管理 - 进度计划-添加
export const selfSchedulePlanAdd = data=> post ('/self/schedule/overall/add/' + data.projectCode, data)

// 自营项目 - 进度管理 - 进度计划-编辑
export const selfSchedulePlanEdit = data=> putData ('/self/schedule/overall/edit/' + data.projectCode, data)

// 自营项目 - 进度管理 - 进度计划-删除
export const selfSchedulePlanDel = data=> deleteData ('/self/schedule/overall/deleteBatch/' + data.projectCode, data)

// 自营项目 - 进度管理 - 进度计划-查询
export const selfSchedulePlanQueryById = data=> get ('/self/schedule/overall/queryById', data)

// 计划详情页面

// 自营项目 - 进度管理 - 进度计划-通过id查询
export const selfSchedulePlanQueryDetail = data => get ('/self/schedule/plan/queryById', data)

// 自营项目 - 进度管理 - 进度计划-添加
export const schedulePlanAdd = data => post ('/self/schedule/plan/add/' + data.projectCode, data)

// 自营项目 - 进度管理 - 进度计划-编辑
export const schedulePlanEdit = data => putData ('/self/schedule/plan/edit/' + data.projectCode, data)

// 自营项目 - 进度管理 - 进度计划-添加部分
export const schedulePlanEditDrag = data => putData ('/self/schedule/plan/drag/' + data.projectCode, data)

// 自营项目 - 进度管理 - 进度计划--查询可作为前置任务的列表
export const prepositionList = data => get ('/self/schedule/plan/prepositionList', data)

// 自营项目 - 进度管理 - 进度计划--查询可作为前置任务的列表
export const isChildren = data => get ('/self/schedule/plan/isChildren', data)

// 自营项目 - 进度管理 - 进度计划-升级
export const schedulePlanUpgrade = data => get ('/self/schedule/plan/upgrade/' + data.projectCode, data)

// 自营项目 - 进度管理 - 进度计划-通过id集合删除
export const schedulePlanDeleteBatch = data => deleteData ('/self/schedule/plan/deleteBatch/' + data.projectCode, data)

// 自营项目 - 进度管理 - 进度计划-选择降级的下拉选
export const schedulePlanListDemotion = data => get ('/self/schedule/plan/listDemotion/', data)

// 自营项目 - 进度管理 - 进度计划-降级
export const schedulePlanDownGrade = data => get ('/self/schedule/plan/demotion/' + data.projectCode, data)

// 自营项目 - 进度管理 - 进度计划-上移
export const schedulePlanShiftUp = data => get ('/self/schedule/plan/shiftUp/' + data.projectCode, data)

// 自营项目 - 进度管理 - 进度计划-下移
export const schedulePlanShiftDown = data => get ('/self/schedule/plan/shiftDown/' + data.projectCode, data)

// 自营项目 - 进度管理 - 进度计划-从项目划分导入
export const schedulePlanInit = data => get ('/self/schedule/plan/init', data)

// 自营项目 - 进度管理 - 进度计划-提交流程接口
export const schedulePlanSubmit = data => post ('/self/schedule/plan/submit/' + data.projectCode, data)

// 自营项目 - 进度管理-重新提交
export const schedulePlanResubmit = data => post ('/self/schedule/plan/resubmit', data)

// 自营项目 - 进度管理 - 进度计划-审批 , 驳回 , 作废
export const schedulePlanOperation = data => post ('/self/schedule/plan/approveOrRejectOrCancelled', data)

// 流程中查询
export const schedulePlanProcessQueryById = data => get ('/self/schedule/plan/queryByFlowId', data)


// 自营项目 - 进度管理 - 进度记录-列表全部查询 
export const schedulePlanActualList = data => get ('/self/schedule/actual/listByOverallId', data)

// 自营项目 - 进度管理 - 实际进度-添加
export const addProcessRecord = data => post ('/self/schedule/actual/add/' + data.projectCode, data)

// 自营项目 - 进度管理 - 实际进度-编辑
export const editProcessRecord = data => putData ('/self/schedule/actual/edit/' + data.projectCode, data)

// 自营项目 - 进度管理 - 实际进度-提交流程接口
export const subProcessRecord = data => post ('/self/schedule/actual/submit/' + data.projectCode, data)

// 自营项目 - 进度管理-重新提交
export const reSubProcessRecord = data => post ('/self/schedule/actual/resubmit', data)

// 自营项目 - 进度管理 - 实际进度-审批 , 驳回 , 作废 
export const processRecordOperation = data => post ('/self/schedule/actual/approveOrRejectOrCancelled', data)

// 自营项目 - 进度管理 - 实际进度-通过id查询
export const processRecordQueryById = data => get ('/self/schedule/actual/queryById', data)
// 自营项目 - 进度管理 - 实际进度-通过id查询
export const processRecordDonePercent = data => get ('/self/schedule/actual/donePercent', data)
