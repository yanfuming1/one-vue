import {get,post,putData,deleteData} from "../../../../plugin/axios";

// 自营项目 — 开工准备 — 项目分包-添加 
export const addSubcontractManagement = data => post (`/self/prepare/directSubpackage/add/${data.projectCode}`, data)

// 自营项目 — 开工准备 — 项目分包-编辑 
export const editSubcontractManagement = data => putData (`/self/prepare/directSubpackage/edit/${data.projectCode}`, data)

// 自营项目 — 开工准备 — 项目分包-通过id查询
export const getSubcontractManagementById = id => get ('/self/prepare/directSubpackage/queryById', id)

// 自营项目 — 开工准备 — 项目分包-审批 , 驳回 , 作废
export const completeSubcontractManagement = data => post ('/self/prepare/directSubpackage/approveOrRejectOrCancelled', data)

// 自营项目 — 开工准备 — 项目分包-提交流程接口
export const submitSubcontractManagement = data => post (`/self/prepare/directSubpackage/submit/${data.projectCode}`, data)

// 自营项目 — 开工准备 — 项目分包-重新提交流程接口
export const resetSubmitSubcontractManagement = data => post ('/self/prepare/directSubpackage/resubmit', data)

// 自营项目 — 开工准备 — 项目分包-批量删除
export const deleteBatchSubcontractManagement = ids => deleteData ('/self/prepare/directSubpackage/deleteBatch', ids)

// 自营项目 — 开工准备 — 项目分包-分页搜索
export const getSubcontractManagementPageList = id => get ('/self/prepare/directSubpackage/searchPageList', id)

// 自营项目 — 开工准备 — 项目分包-审核和反审核
export const checkAgainstSubcontractManagement = data => get ('/self/prepare/directSubpackage/checkOrAgainst', data)

// 自营项目 — 开工准备 — 分包商
export const getLaborSubcontractor = data => get ('/customers/customers/queryLaborSubcontractor', data)