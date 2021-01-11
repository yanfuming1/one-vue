import {get,post,putData,deleteData} from "../../../../plugin/axios";

// 自营项目 —  质量规范-添加 
export const addQualityStandard = data => post (`/self/quality/standard/add/${data.projectCode}`, data)

// 自营项目 —  质量规范-编辑 
export const editQualityStandard = data => putData (`/self/quality/standard/edit/${data.projectCode}`, data)

// 自营项目 —  质量规范-通过id查询
export const getQualityStandardById = id => get ('/self/quality/standard/queryById', id)

// 自营项目 —  质量规范-审批 , 驳回 , 作废
export const completeQualityStandard = data => post ('/self/quality/standard/approveOrRejectOrCancelled', data)

// 自营项目 —  质量规范-提交流程接口
export const submitQualityStandard = data => post (`/self/quality/standard/submit/${data.projectCode}`, data)

// 自营项目 —  质量规范-重新提交流程接口
export const resetSubmitQualityStandard = data => post ('/self/quality/standard/resubmit', data)

// 自营项目 —  质量规范-批量删除
export const deleteQualityStandard = data => deleteData (`/self/quality/standard/delete/${data.projectCode}`, data)

// 自营项目 - 质量管理 - 质量规范-列表
export const getQualityStandardPageList = data => get (`/self/quality/standard/page`, data)

// 自营项目 - 质量管理 - 质量规范-列表
export const getQualityStandardList = data => get (`/self/quality/standard/list`, data)

// 自营项目 —  质量规范-审核和反审核
export const checkAgainstQualityStandard = data => get ('/self/quality/standard/checkOrAgainst', data)


/*******************************************质量类别***************************************************** */


// 自营项目 —  质量类别-添加 
export const addQualityType = data => post (`/self/quality/category/add/${data.projectCode}`, data)

// 自营项目 —  质量类别-编辑 
export const editQualityType = data => putData (`/self/quality/category/edit/${data.projectCode}`, data)

// 自营项目 —  质量类别-通过id查询
export const getQualityTypeById = id => get ('/self/quality/category/queryById', id)

// 自营项目 —  质量类别-批量删除
export const deleteQualityType = data => deleteData (`/self/quality/category/delete/${data.projectCode}`, data)

// 自营项目 - 质量管理 - 质量类别-列表
export const getQualityTypePageList = data => get (`/self/quality/category/tree`, data)

// 自营项目 - 质量管理 - 质量类别-列表
export const getQualityTypeList = data => get (`/self/quality/category/list`, data)



