import {get,post,putData,deleteData} from "../../../../plugin/axios";

// 自营项目 — 开工准备 — 三通一平-添加 
export const addThreeSuppliesOneLeveling = data => post (`/self/prepare/electric/add/${data.projectCode}`, data)

// 自营项目 — 开工准备 — 三通一平-编辑 
export const editThreeSuppliesOneLeveling = data => putData (`/self/prepare/electric/edit/${data.projectCode}`, data)

// 自营项目 — 开工准备 — 三通一平-通过id查询
export const getThreeSuppliesOneLevelingById = id => get ('/self/prepare/electric/queryById', id)

// 自营项目 — 开工准备 — 三通一平-审批 , 驳回 , 作废
export const completeThreeSuppliesOneLeveling = data => post ('/self/prepare/electric/approveOrRejectOrCancelled', data)

// 自营项目 — 开工准备 — 三通一平-提交流程接口
export const submitThreeSuppliesOneLeveling = data => post (`/self/prepare/electric/submit/${data.projectCode}`, data)

// 自营项目 — 开工准备 — 三通一平-重新提交流程接口
export const resetSubmitThreeSuppliesOneLeveling = data => post ('/self/prepare/electric/resubmit', data)

// 自营项目 — 开工准备 — 三通一平-批量删除
export const deleteBatchThreeSuppliesOneLeveling = ids => deleteData ('/self/prepare/electric/deleteBatch', ids)

// 自营项目 — 开工准备 — 三通一平-分页搜索
export const getThreeSuppliesOneLevelingPageList = id => get ('/self/prepare/electric/searchPageList', id)

// 自营项目 — 开工准备 — 三通一平-审核和反审核
export const checkAgainstThreeSuppliesOneLeveling = data => get ('/self/prepare/electric/checkOrAgainst', data)