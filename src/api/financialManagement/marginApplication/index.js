import {get,post,putData,deleteData} from "../../../plugin/axios";

// 保证金缴纳申请分页查询
export const getMarginPaymentList = data => get ('/joint/marginPayment/financeGetList', data)

// 保证金缴纳申请分页查询
export const getMarginPaymentSearchList = data => get ('/joint/marginPayment/financeSearchList', data)

// 保证金缴纳新增申请
export const getMarginPaymentAdd = data => get ('/joint/marginPayment/add', data)