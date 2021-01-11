import {get,post,putData,deleteData} from "../../../../plugin/axios";

// 发票管理 - 发票认证-分页搜索
export const getInvoiceCertificationList = data=> get ('/invoice/origin/page', data)

export const validation = data=> get ('/invoice/origin/validation', data)

// 发票管理 - 发票认证-分页搜索
export const getSelfInvoiceCertificationList = data=> get ('/self/invoice/origin/page', data)

export const validationSelf = data=> get ('/self/invoice/origin/validation', data)

// 发票管理-反审核
export const checkOrAgains = data => get ('/invoice/origin/checkOrAgainst', data)

// 发票管理 - 自营项目 - 反审核
export const selfCheckOrAgains = data => get ('/self/invoice/origin/checkOrAgainst', data)
