import {get,post,putData,deleteData} from "../../../../plugin/axios";

// 自营项目 - 质量管理 - 质量检查-分页搜索
export const selfQualityPageList = data=> get ('/self/quality/inspect/page', data)

// 自营项目 - 质量管理 - 质量检查-批量删除
export const selfQualityDel = data=> deleteData ('/self/quality/inspect/deleteBatch', data)

// 自营项目 - 质量管理 - 质量检查-添加
export const selfQualityAdd = data=> post ('/self/quality/inspect/add', data)

// 自营项目 - 质量管理 - 质量检查-编辑
export const selfQualityEdit = data=> putData ('/self/quality/inspect/edit', data)

// 自营项目 - 质量管理 - 质量检查-通过id查询
export const selfQualityQueryById = data=> get ('/self/quality/inspect/queryById', data)

// 自营项目 - 质量管理 - 质量检查-提交流程接口
export const selfQualitySubmit = data=> post ('/self/quality/inspect/submit', data)

// 自营项目 - 质量管理 - 质量检查--重新提交
export const selfQualityReSubmit = data=> post ('/self/quality/inspect/resubmit', data)

// 自营项目 - 质量管理 - 质量检查-审批 , 驳回 , 作废 
export const selfQualityOperation = data=> post ('/self/quality/inspect/approveOrRejectOrCancelled', data)