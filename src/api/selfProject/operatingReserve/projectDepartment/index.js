import {get,post,putData,deleteData} from "../../../../plugin/axios";

// 自营项目 — 开工准备 — 项目部组建-添加 
export const addProjectDepartment = data => post (`/self/prepare/departmentCreate/add/${data.projectCode}`, data)

// 自营项目 — 开工准备 — 项目部组建-编辑 
export const editProjectDepartment = data => putData (`/self/prepare/departmentCreate/edit/${data.projectCode}`, data)

// 自营项目 — 开工准备 — 项目部组建-通过id查询
export const getProjectDepartmentById = id => get ('/self/prepare/departmentCreate/queryById', id)

// 自营项目 — 开工准备 — 项目部组建-审批 , 驳回 , 作废
export const completeProjectDepartment = data => post ('/self/prepare/departmentCreate/approveOrRejectOrCancelled', data)

// 自营项目 — 开工准备 — 项目部组建-提交流程接口
export const submitProjectDepartment = data => post (`/self/prepare/departmentCreate/submit/${data.projectCode}`, data)

// 自营项目 — 开工准备 — 项目部组建-重新提交流程接口
export const resetSubmitProjectDepartment = data => post ('/self/prepare/departmentCreate/resubmit', data)

// 自营项目 — 开工准备 — 项目部组建-批量删除
export const deleteBatchProjectDepartment = ids => deleteData ('/self/prepare/departmentCreate/deleteBatch', ids)

// 自营项目 — 开工准备 — 项目部组建-分页搜索
export const getProjectDepartmentPageList = id => get ('/self/prepare/departmentCreate/searchPageList', id)

// 自营项目 — 开工准备 — 项目部组建-审核和反审核
export const checkAgainstProjectDepartment = data => get ('/self/prepare/departmentCreate/checkOrAgainst', data)

// 自营项目 — 开工准备 — 查询项目信息
export const getProjectRoleAll = () => get ('/system/role/queryProjectRole')

// 自营项目 — 开工准备 — 获取项目部门
export const getProjectDepartmentAll = data => get ('/system/department/queryListByCode', data)