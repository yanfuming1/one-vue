import { get, post, putData, deleteData } from "../../../../plugin/axios";

// 采购合同-添加 
export const addPurchaseContract = data => post ('/material/procurement/contract/add', data)

// 采购合同-批量删除
export const deleteBatchPurchaseContract = ids => deleteData ('/material/procurement/contract/deleteBatch', ids)

// 采购合同-编辑 
export const editPurchaseContract = data => putData ('/material/procurement/contract/edit', data)

// 物资设配 - 采购合同 - 材料 - 分页搜索
export const getPurchaseContractPageList = data => get ('/material/procurement/contract/searchPageList', data)

// 采购合同-通过id查询
export const getPurchaseContractById = id => get ('/material/procurement/contract/queryById', id)

// 采购合同-审批 , 驳回 , 作废
export const completePurchaseContract = data => post ('/material/procurement/contract/approveOrRejectOrCancelled', data)

// 采购合同-审核,反审核
export const checkAgainstPurchaseContract = data => get ('/material/procurement/contract/checkOrAgainst', data)

// 采购合同-提交流程接口
export const submitPurchaseContract = data => post ('/material/procurement/contract/submit', data)

// 采购合同-重新提交流程接口
export const resetSubmitPurchaseContract = data => post ('/material/procurement/contract/resubmit', data)

// 采购合同-查询流程完结并且订单未使用的合同信息
export const getPurchaseContractAllList = () => get ('/material/procurement/contract/contractList')

// 采购合同 合同中止
export const purchaseContractProceed = id => deleteData ('/material/procurement/contract/discontinue', id)