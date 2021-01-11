import {get,post,putData,deleteData} from "../../../plugin/axios";

// 保证金退还分页查询
export const getMarginReturnList = data => get ('/joint/marginReturn/financeList', data)

// 保证金退还搜索查询
export const getFinanceSearchList = data => get ('/joint/marginReturn/financeSearch', data)