import { get, post, putData, deleteData} from "../../../plugin/axios";

// 总结计划-添加 
export const addSummaryPlan = data => post ('/administer/summaryPlan/add', data)

// 总结计划-批量删除
export const deleteBatchSummaryPlan = ids => deleteData ('/administer/summaryPlan/deleteBatch', ids)

// 总结计划-编辑 
export const editSummaryPlan = data => putData ('/administer/summaryPlan/edit', data)

// 行政管理-总结计划-模糊-本月，本季度，本年查询时间区间
export const getSummaryPlan = id => get ('/administer/summaryPlan/selectConclusionTime', id)

// 总结计划-通过id查询
export const getSummaryPlanById = id => get ('/administer/summaryPlan/queryById', id)

// 行政管理-总结计划-模糊-根据创建人ID查询
export const getSummaryPlanSelectListSum = data => get ('/administer/summaryPlan/selectListSum', data)