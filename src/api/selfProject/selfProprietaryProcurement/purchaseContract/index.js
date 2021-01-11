import {get,post,putData,deleteData} from "@/plugin/axios";

// 自营项目 - 采购合同-添加
export const addSelfPurchaseContract = data=> post ('/seif/procurement/contract/add/' + data.projectCode, data)

// 自营项目 - 采购合同-批量删除
export const delbashSelfPurchaseContract = data=> deleteData ('/seif/procurement/contract/deleteBatch/' + data.projectCode, data)

// 自营项目 - 采购合同-编辑
export const editSelfPurchaseContract = data=> putData ('/seif/procurement/contract/edit/' + data.projectCode, data)

// 自营项目 - 采购合同-提交流程接口
export const submitSelfPurchaseContract = data=> post ('/seif/procurement/contract/submit/' + data.projectCode, data)

// 自营项目 - 采购合同-中止合同
export const selfPurchaseTerminateSontract = data=> deleteData ('/seif/procurement/contract/discontinue/' + data.projectCode, data)
