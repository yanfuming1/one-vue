import {get,post,putData,deleteData} from "../../../../plugin/axios";

// 自营项目 — 开工准备 —  质量目标-添加 
export const addQualityObjectives = data => post (`/self/quality/target/add/${data.projectCode}`, data)

// 自营项目 — 开工准备 —  质量目标-编辑 
export const editQualityObjectives = data => putData (`/self/quality/target/edit/${data.projectCode}`, data)

// 自营项目 — 开工准备 —  质量目标-通过id查询
export const getQualityObjectivesById = id => get ('/self/quality/target/queryById', id)

// 自营项目 — 开工准备 —  质量目标-审批 , 驳回 , 作废
export const completeQualityObjectives = data => post ('/self/quality/target/approveOrRejectOrCancelled', data)

// 自营项目 — 开工准备 —  质量目标-提交流程接口
export const submitQualityObjectives = data => post (`/self/quality/target/submit/${data.projectCode}`, data)

// 自营项目 — 开工准备 —  质量目标-重新提交流程接口
export const resetSubmitQualityObjectives = data => post ('/self/quality/target/resubmit', data)

// 自营项目 — 开工准备 —  质量目标-批量删除
export const deleteBatchQualityObjectives = data => deleteData (`/self/quality/target/delete/${data.projectCode}`, data)

// 自营项目 - 质量管理 - 质量目标-有序的列表
export const getQualityObjectivesPageList = data => get (`/self/quality/target/orderedList`, data)

// 自营项目 - 质量管理 - 质量目标-无序流程列表
export const getQualityObjectivesList = data => get (`/self/quality/target/list`, data)

// 自营项目 - 质量管理 - 质量目标-树
export const getQualityObjectivesTree = data => get ('/self/quality/target/tree', data)

// 自营项目 — 开工准备 —  质量目标-审核和反审核
export const checkAgainstQualityObjectives = data => get ('/self/quality/target/checkOrAgainst', data)

// 自营项目 - 质量管理 - 质量目标-根据id集合查询
export const getQualityObjectivesListByIds = data => get (`/self/quality/target/listByIds`, data)

// 自营项目 - 质量管理 - 质量目标-从项目划分导入
export const fromProjectSegregation = data => get ('/self/quality/target/init', data)