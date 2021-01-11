import { get, post, putData, deleteData } from "../../../../plugin/axios";

// 采购询价-添加 
export const addPurchaseEnquiry = data => post ('/material/procurement/enquiry/add', data)

// 采购询价-批量删除
export const deleteBatchPurchaseEnquiry = ids => deleteData ('/material/procurement/enquiry/deleteBatch', ids)

// 采购询价-编辑 
export const editPurchaseEnquiry = data => putData ('/material/procurement/enquiry/edit', data)

// 物资设配 - 采购询价 - 材料 - 分页搜索
export const getPurchaseEnquiryPageList = data => get ('/material/procurement/enquiry/searchPageList', data)

// 采购询价-通过id查询
export const getPurchaseEnquiryById = id => get ('/material/procurement/enquiry/queryById', id)