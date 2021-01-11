import { get, post, putData, deleteData } from "../../../../plugin/axios";

// 采购任务-批量删除
export const deleteBatchPurchaseTask = ids => deleteData ('/material/procurement/purchaseTask/deleteBatch', ids)

// 采购任务-编辑 
export const editPurchaseTask = data => putData ('/material/procurement/purchaseTask/edit', data)

// 物资设配 - 采购任务 - 材料 - 分页搜索
export const getAllPurchaseTaskPageList = data => get ('/material/procurement/purchaseTask/searchPageList', data)

// 物资设配 - 采购任务 - 材料 - 分页搜索
export const getMyPurchaseTaskPageList = data => get ('/material/procurement/purchaseTask/mySearch', data)

// 采购任务-通过id查询
export const getPurchaseTaskById = id => get ('/material/procurement/purchaseTask/queryById', id)

// 采购任务-任务分解
export const purchaseTastDecomposition = data => post ('/material/procurement/purchaseTask/disintegrateTask', data)

// 采购任务-任务中止
export const purchaseTastSuspend = id => get ('/material/procurement/purchaseTask/discontinueTask', id)

// 采购任务-任务删除
export const deleteSonPurchaseTask = id => get ('/material/procurement/purchaseTask/delAllSonTask', id)

// 物资设配 - 采购任务 - 无分页
export const getMyPurchaseTaskList = () => get ('/material/procurement/purchaseTask/myTaskList')

// 物资设配 - 采购任务 - 完成任务
export const updataMyPurchaseTaskProceedStatus = id => get ('/material/procurement/purchaseTask/performTask', id)