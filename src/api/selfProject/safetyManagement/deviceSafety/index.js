import {get,post,putData,deleteData} from "../../../../plugin/axios";

// 自营项目 - 进度管理 - 临时的D-分页搜索
export const deviceSafetyPageList = data=> get ('/self/quality/temporaryd/page',data)

// 自营项目 - 进度管理 - 临时的D-批量删除
export const deviceSafetyDel = data=> deleteData ('/self/quality/temporaryd/deleteBatch',data)

// 自营项目 - 进度管理 - 临时的D-添加
export const deviceSafetyAdd = data=> post ('/self/quality/temporaryd/add',data)

// 自营项目 - 进度管理 - 临时的D-编辑
export const deviceSafetyEdit = data=> putData ('/self/quality/temporaryd/edit',data)

// 自营项目 - 进度管理 - 临时的D-通过id查询
export const deviceSafetyQueryById = data=> get ('/self/quality/temporaryd/queryById',data)

// 自营项目 - 进度管理 - 临时的D-提交流程接口
export const deviceSafetySubmit = data=> post ('/self/quality/temporaryd/submit',data)

// 自营项目 - 进度管理 - 临时的D-重新提交
export const deviceSafetyReSubmit = data=> post ('/self/quality/temporaryd/resubmit',data)

// 	自营项目 - 进度管理 - 临时的D-审批 , 驳回 , 作废
export const deviceSafetyOperation = data=> post ('/self/quality/temporaryd/approveOrRejectOrCancelled',data)
