import {get,post,putData,deleteData} from "@/plugin/axios";

// 自营项目 - 采购询价-添加
export const addSelfPurchaseEnquiry = data=> post ('/self/procurement/enquiry/add/' + data.projectCode, data)

// 自营项目 - 采购询价-批量删除
export const delbashSelfPurchaseEnquiry = data=> deleteData ('/self/procurement/enquiry/deleteBatch/' + data.projectCode, data)

// 自营项目 - 采购询价-编辑
export const editSelfPurchaseEnquiry = data=> putData ('/self/procurement/enquiry/edit/' + data.projectCode, data)

// 自营项目 - 采购询价-提交流程接口
export const submitSelfPurchaseEnquiry = data=> post ('/self/procurement/enquiry/submit/' + data.projectCode, data)
