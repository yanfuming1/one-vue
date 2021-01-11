import {get,post,putData,deleteData} from "../../../plugin/axios";


// 导入模板-获取银行数据字典信息
export const queryBankList = data => get ('/finance/financeBank/queryList', data)
