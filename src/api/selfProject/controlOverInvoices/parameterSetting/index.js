import {get,post,putData,deleteData} from "../../../../plugin/axios";

// 发票管理 - 发票参数设置-查询
export const parameterPage = data=> get ('/self/invoice/parameter/page' , data)

// 发票管理 - 发票参数设置-不分页查询
export const parameterList = data=> get ('/self/invoice/parameter/list' , data)

// 发票管理 - 发票参数设置-删除
export const parameterDeleteDataPage = data=> deleteData ('/self/invoice/parameter/delete' , data)

// 发票管理 - 发票参数设置-编辑
export const parameterEdit = data=> putData ('/self/invoice/parameter/edit' , data)

// 发票管理 - 发票参数设置-添加
export const parameterAdd = data=> post ('/self/invoice/parameter/add' , data)

// 发票管理 - 发票参数设置-根据标识查询我方数据
export const onOurPart = data=> get ('/self/invoice/parameter/onOurPart' , data)
