import {get,post,putData,deleteData} from "@/plugin/axios";

// 自营项目- 采购订单-添加
export const addSelfPurchaseOrder = data=> post ('/self/procurement/indent/add/' + data.projectCode,data)

// 自营项目- 采购订单-批量删除
export const delbashSelfPurchaseOrder = data=> deleteData ('/self/procurement/indent/deleteBatch/' + data.projectCode,data)

// 自营项目- 采购订单-编辑
export const editSelfPurchaseOrder = data=> putData ('/self/procurement/indent/edit/' + data.projectCode,data)

// 自营项目- 采购订单-提交流程接口
export const submitSelfPurchaseOrder = data=> post ('	/self/procurement/indent/submit/' + data.projectCode,data)

