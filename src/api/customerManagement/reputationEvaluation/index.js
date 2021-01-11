import {get,post,putData,deleteData} from "../../../plugin/axios";

// 信用评价功能-分页列表查询
export const getReputationEvaluationList = data => get ('/customer/creditEvaluation/listById', data)

// 信用评价功能-添加
export const reputationEvaluationAdd = data => post ('/customer/creditEvaluation/add',data)

// 	甲方信誉评价功能-分页列表查询
export const firstPartyReputationEvaluationList = data => get ('/customers/creditsEvaluation/listById', data)

// 	甲方信誉评价功能-添加
export const firstPartyReputationEvaluationAdd = data => post ('/customers/creditsEvaluation/add',data)

// 信用评价功能-associateid
export const quantityCreditEvaluation = data => get ('/customer/creditEvaluation/countCusRrl', data)

//  甲方信用评价功能-associateid
export const firstPartyQuantityCreditEvaluation = data => get ('/customers/creditsEvaluation/countCusRrl', data)
