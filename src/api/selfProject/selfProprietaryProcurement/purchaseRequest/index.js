import {get,post,putData,deleteData} from "@/plugin/axios";

// 自营项目- 采购申请-添加
export const addSelfpurchaseRequest = data=> post ('/self/procurement/purchaseRequest/add/' + data.projectCode,data)

// 自营项目- 采购申请-批量删除
export const delbashSelfpurchaseRequest = data=> deleteData ('/self/procurement/purchaseRequest/deleteBatch/' + data.projectCode, data)

// 自营项目- 采购申请-编辑
export const editSelfpurchaseRequest = data=> putData ('/self/procurement/purchaseRequest/edit/' + data.projectCode, data)

// 自营项目- 采购申请-提交流程接口
export const submitSelfpurchaseRequest = data=> post ('/self/procurement/purchaseRequest/submit/' + data.projectCode, data)

