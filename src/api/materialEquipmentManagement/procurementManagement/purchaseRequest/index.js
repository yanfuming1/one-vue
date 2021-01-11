import { get, post, putData, deleteData } from "../../../../plugin/axios";

// 采购申请-添加 
export const addPurchaseRequest = data => post ('/material/procurement/purchaseRequest/add', data)

// 采购申请-批量删除
export const deleteBatchPurchaseRequest = ids => deleteData ('/material/procurement/purchaseRequest/deleteBatch', ids)

// 采购申请-编辑 
export const editPurchaseRequest = data => putData ('/material/procurement/purchaseRequest/edit', data)

// 物资设配 - 采购申请 - 材料 - 分页搜索
export const getPurchaseRequestPageList = data => get ('/material/procurement/purchaseRequest/searchPageList', data)

// 采购申请-通过id查询
export const getPurchaseRequestById = id => get ('/material/procurement/purchaseRequest/queryById', id)

// 采购申请-审批 , 驳回 , 作废
export const completePurchaseRequest = data => post ('/material/procurement/purchaseRequest/approveOrRejectOrCancelled', data)

// 采购申请-审核,反审核
export const checkAgainstPurchaseRequest = data => get ('/material/procurement/purchaseRequest/checkOrAgainst', data)

// 采购申请-提交流程接口
export const submitPurchaseRequest = data => post ('/material/procurement/purchaseRequest/submit', data)

// 采购申请-重新提交流程接口
export const resetSubmitPurchaseRequest = data => post ('/material/procurement/purchaseRequest/resubmit', data)