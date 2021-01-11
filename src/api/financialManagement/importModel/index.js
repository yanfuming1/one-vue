import {get,post,putData,deleteData} from "../../../plugin/axios";

// 导入模板-获取银行数据字典信息
export const getBanks = data => get ('/finance/financeBank/getBanks', data)

// 导入模板-获取银行数据字典信息
export const queryList = data => get ('/finance/financeBank/queryList', data)

// 导入模板-
export const queryByName = data => get ('/finance/financeBank/queryByName', data)

// 导入模板-保存
export const setEdit = data => putData ('/finance/financeBank/edit', data)

// 导入模板-保存
export const addAjx = data => post ('/finance/financeBank/add', data)

// 导入模板-删除
export const deleteAjx = data => deleteData ('/finance/financeBank/delete', data)

