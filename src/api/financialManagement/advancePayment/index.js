import {get,post,putData,deleteData} from "../../../plugin/axios";

// 保证金缴纳申请-财务管理垫付资金搜索分页获取
export const financeMatEndowment = data => get ('/joint/marginPayment/financeMatEndowment', data)
