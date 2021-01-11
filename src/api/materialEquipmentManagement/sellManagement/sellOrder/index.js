import { get, post, putData, deleteData} from "../../../../plugin/axios";

//  物资设备 - 出售订单-分页搜索
export const sellOrderPageList = data => get ('/materialsell/materialSellOrder/searchPageList', data)

//  物资设备 - 出售订单-批量删除
export const sellOrderDel = data => deleteData ('/materialsell/materialSellOrder/deleteBatch', data)

//  物资设备 - 出售订单-通过id查询
export const sellOrderQueryById = data => get ('/materialsell/materialSellOrder/queryById', data)

//  物资设备 - 出售订单-添加
export const sellOrderAdd = data => post ('/materialsell/materialSellOrder/add', data)

//  物资设备 - 出售订单-编辑
export const sellOrderEdit = data => putData ('/materialsell/materialSellOrder/edit', data)

//  订单的非工作流提交 
export const sellOrderSaveSubmit = data => post ('/materialsell/materialSellOrder/saveSubmit', data)
