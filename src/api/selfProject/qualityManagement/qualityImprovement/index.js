import {get,post,putData,deleteData} from "../../../../plugin/axios";

// 自营项目 - 质量管理 - 质量整改-分页搜索
export const selfRectifyPageList = data=> get ('/self/quality/rectify/page', data)

// 自营项目 - 质量管理 - 质量整改-批量删除
export const selfRectifyDel = data=> deleteData ('/self/quality/rectify/deleteBatch', data)

// 自营项目 - 质量管理 - 质量整改-添加
export const selfRectifyAdd = data=> post ('/self/quality/rectify/add', data)

// 自营项目 - 质量管理 - 质量整改-编辑
export const selfRectifyEdit = data=> putData ('/self/quality/rectify/edit', data)

// 自营项目 - 质量管理 - 质量整改-通过id查询
export const selfRectifyQueryById = data=> get ('/self/quality/rectify/queryById', data)

// 自营项目 - 质量管理 - 质量整改-提交流程接口
export const selfRectifySub = data=> post ('/self/quality/rectify/submit', data)

// 自营项目 - 质量管理 - 质量整改-重新提交
export const selfRectifyReSub = data=> post ('/self/quality/rectify/resubmit', data)

// 自营项目 - 质量管理 - 质量整改-审批 , 驳回 , 作废 
export const selfRectifyOperation = data=> post ('/self/quality/rectify/approveOrRejectOrCancelled', data)
