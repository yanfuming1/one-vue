import {get,post,putData,deleteData} from "../../../../plugin/axios";

// 自营项目 - 进度管理 - 临时的A-添加
export const selfSchedulePlanNewAdd = data=> post ('/self/quality/temporarya/add', data)

// 自营项目 - 进度管理 - 临时的A-编辑
export const selfSchedulePlanNewEdit = data=> putData ('/self/quality/temporarya/edit', data)

// 自营项目 - 进度管理 - 临时的A-通过id查询
export const selfSchedulePlanNewQueryById = data=> get ('/self/quality/temporarya/queryById', data)

// 自营项目 - 进度管理 - 临时的A-提交流程接口
export const selfSchedulePlanNewSubmit = data=> post ('/self/quality/temporarya/submit', data)

// 自营项目 - 进度管理 - 临时的A-重新提交
export const selfSchedulePlanNewReSubmit = data=> post ('/self/quality/temporarya/resubmit', data)

// 自营项目 - 进度管理 - 临时的A-分页搜索
export const selfSchedulePlanNewPageList = data=> get ('/self/quality/temporarya/page', data)

// 自营项目 - 进度管理 - 临时的A-批量删除
export const selfSchedulePlanNewDel = data=> deleteData ('/self/quality/temporarya/deleteBatch', data)

// 	自营项目 - 进度管理 - 临时的A-审批 , 驳回 , 作废
export const selfSchedulePlanNewOperation = data=> post ('/self/quality/temporarya/approveOrRejectOrCancelled', data)
