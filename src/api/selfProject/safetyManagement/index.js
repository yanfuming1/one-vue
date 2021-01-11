import {get,post,putData,deleteData} from "../../../plugin/axios";
// 安全检查记录
// 自营项目 — 安全管理 -分页搜索
export const selfSafetyPageList = data=> get ('/self/safeRule/queryPageList',data)

//  自营项目 — 安全管理 -安全检查记录 -添加
export const selfSafetyAdd = data=> post ('/self/safeRule/add', data)

//  自营项目 — 安全管理 -安全检查记录 -编辑
export const selfSafetyEdit = data=> putData ('/self/safeRule/edit',data)

//  自营项目 — 安全管理 -安全检查记录 -通过id查询
export const selfSafetyQueryById = data=> get ('/self/safeRule/queryById',data)

//  自营项目 — 安全管理 -安全检查记录 -批量删除
export const selfSafetyDel = data=> deleteData ('/self/safeRule/deleteBatch',data)

//  自营项目 — 安全管理 - 安全检查记录-提交流程接口
export const selfSafetySub = data=> post ('/self/safeRule/submit',data)

//  自营项目 — 安全管理 - 安全检查记录-重新提交
export const selfSafetyReSub = data=> post ('/self/safeRule/resubmit',data)

// 	自营项目 — 安全管理 - 安全检查记录-审批 , 驳回 , 作废
export const selfSafetyOperation = data=> post ('/self/safeRule/approveOrRejectOrCancelled',data)


// 安全整改记录
// 自营项目 — 安全管理 -安全整改记录 -分页搜索
export const selfMeasuresPageList = data=> get ('/self/rectificate/queryPageList',data)

// 自营项目 — 安全管理 -安全整改记录 -批量删除
export const selfMeasuresDel = data=> deleteData ('/self/rectificate/deleteBatch',data)

// 自营项目 — 安全管理 - 新建安全整改-添加
export const selfMeasuresAdd = data=> post ('/self/rectificate/add',data)

// 自营项目 — 安全管理 - 新建安全整改-编辑
export const selfMeasuresEdit = data=> putData ('/self/rectificate/edit',data)

// 自营项目 — 安全管理 - 新建安全整改-通过id查询
export const selfMeasuresQueryById = data=> get ('/self/rectificate/queryById',data)

// 自营项目 — 安全管理 - 新建安全整改-提交流程接口
export const selfMeasuresSubmit = data=> post ('/self/rectificate/submit',data)

// 自营项目 — 安全管理 - 新建安全整改-重新提交
export const selfMeasuresReSubmit = data=> post ('/self/rectificate/resubmit',data)

// 	自营项目 — 安全管理 - 新建安全整改-审批 , 驳回 , 作废
export const selfMeasuresOperation = data=> post ('/self/rectificate/approveOrRejectOrCancelled',data)
