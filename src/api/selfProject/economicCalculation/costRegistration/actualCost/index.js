import {get,post,putData,deleteData} from "../../../../../plugin/axios";

// 自营项目 — 成本核算 — 实际成本
// export const searchActualCostPage = data => get ('/self/cost/costActual/search', data) 


// 自营-成本-实际成本-添加
export const  addCostRegistration = data => post ('/self/cost/costActual/add', data) 

// 自营-成本-实际成本-编辑
export const  editCostRegistration = data => putData ('/self/cost/costActual/edit', data) 

// 自营-成本-实际成本-分页搜索
export const  getCostRegistrationPage = data => get ('/self/cost/costActual/searchPageList', data)

// 自营-成本-实际成本-通过id查询
export const queryByIdCostRegistration = data => get ('/self/cost/costActual/queryById', data)

// 自营-成本-实际成本-批量删除
export const deleteBatchCostRegistration = data => deleteData ('/self/cost/costActual/deleteBatch', data)

// 自营-成本-实际成本-提交流程接口
export const submitCostRegistration = data => post ('/self/cost/costActual/submit', data)

// 自营-成本-实际成本-审批 , 驳回 , 作废
export const completeCostRegistration = data => post ('/self/cost/costActual/approveOrRejectOrCancelled', data)

// 自营-成本-实际成本-重新提交
export const resubmitCostRegistration = data => post ('/self/cost/costActual/resubmit', data)

// 自营-成本-实际成本-成本名称
export const getAcquisitionNameData = data => get ('/cost/costFee/queryByParentId', data)


