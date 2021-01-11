import { get, post, putData, deleteData } from "../../../../plugin/axios"

// 自营项目 — 我方投标 — 现场勘察登记-分页搜索
export const getSceneInvestigationPageSearch = data => get ('/self/bid/exploration/page', data)

// 自营项目 — 我方投标 — 现场勘察登记-通过id删除
export const  delByIDSceneInvestigation = data => deleteData ('/self/bid/exploration/deleteBatch', data)

// 自营项目 — 我方投标 — 现场勘察登记-添加
export const addSceneInvestigation = data=> post (`/self/bid/exploration/add/${data.projectCode}`, data)

// 自营项目 — 我方投标 — 现场勘察登记-编辑
export const editSceneInvestigation = data=> putData (`/self/bid/exploration/edit/${data.projectCode}`, data)

// 部门-根据员工ID 查询该员工所在的所有部门
export const  getDepartmentEmployee = data => get ('/system/department/queryDepartmentByUserId', data)

// 获取该员工的职位岗位
export const  getQueryPosition = data => get ('/system/position/queryByUserId', data)

// 自营项目 — 我方投标 — 现场勘察登记-通过id查询
export const  getQueryIdSceneInvestigation = data => get ('/self/bid/exploration/queryById', data)

// 自营项目 — 我方投标 — 现场勘察登记-提交流程接口
export const submitSceneInvestigation = data=> post (`/self/bid/exploration/submit/${data.projectCode}`, data)

// 自营项目 — 我方投标 — 现场勘察登记-审批 , 驳回 , 作废 
export const  completeAddSceneInvestigation = data => post ('/self/bid/exploration/approveOrRejectOrCancelled', data)

// 物资设备 - 采购申请-重新提交
export const reSubmitSceneInvestigation = data=> post ('/self/bid/exploration/resubmit', data)

// 自营项目 — 我方投标 — 现场勘察登记-审核和反审核
export const examineSceneInvestigation = data=> get ('/self/bid/exploration/checkOrAgainst', data)