import { get, post, putData, deleteData } from "../../../../plugin/axios";

// 采购订单-添加 
export const addPurchaseOrder = data => post ('/material/procurement/indent/add', data)

// 采购订单-批量删除
export const deleteBatchPurchaseOrder = ids => deleteData ('/material/procurement/indent/deleteBatch', ids)

// 采购订单-编辑 
export const editPurchaseOrder = data => putData ('/material/procurement/indent/edit', data)

// 物资设配 - 采购订单 - 材料 - 分页搜索
export const getPurchaseOrderPageList = data => get ('/material/procurement/indent/searchPageList', data)

// 采购订单-通过id查询
export const getPurchaseOrderById = id => get ('/material/procurement/indent/queryById', id)

// 采购订单-提交
export const submitPurchaseOrder = data => post ('/material/procurement/indent/saveSubmit', data)

// 采购订单 - 获取已完结的列表
export const getPurchaseOrderFinishedAllList = () => get ('/material/procurement/indent/inventoryProcState')