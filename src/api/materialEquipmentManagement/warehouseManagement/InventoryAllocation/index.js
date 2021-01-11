import { get, post, putData, deleteData } from "../../../../plugin/axios";

// 库存调拨-添加 
export const addInventoryAllocation = data => post ('/material/warehouse/allot/add', data)

// 库存调拨-批量删除
export const deleteBatchInventoryAllocation = ids => deleteData ('/material/warehouse/allot/deleteBatch', ids)

// 库存调拨-编辑 
export const editInventoryAllocation = data => putData ('/material/warehouse/allot/edit', data)

// 库存调拨 - 材料 - 分页搜索
export const getInventoryAllocationPageList = data => get ('/material/warehouse/allot/page', data)

// 库存调拨-通过id查询
export const getInventoryAllocationById = id => get ('/material/warehouse/allot/queryById', id)

// 库存调拨-审批 , 驳回 , 作废
export const completeInventoryAllocation = data => post ('/material/warehouse/allot/approveOrRejectOrCancelled', data)

// 库存调拨-审核,反审核
export const checkAgainstInventoryAllocation = data => get ('/material/warehouse/allot/checkOrAgainst', data)

// 库存调拨-提交流程接口
export const submitInventoryAllocation = data => post ('/material/warehouse/allot/submit', data)

// 库存调拨-重新提交流程接口
export const resetSubmitInventoryAllocation = data => post ('/material/warehouse/allot/resubmit', data)
