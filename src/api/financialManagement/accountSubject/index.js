import {get,post,putData,deleteData} from "../../../plugin/axios";

// 会计科目设置
export const listAllSubject = data => get ('/finance/accountingSubject/listAllSubject', data)

// 会计科目设置
export const tableList = data => get ('/finance/accountingSubject/list', data)

// 会计科目设置 - 获取添加数据
export const goAdd = data => get ('/finance/accountingSubject/goAdd', data)

// 会计科目设置 - 校验科目编码是否存在
export const preAjax = data => get ('/finance/accountingSubject/preAjax', data)

// 会计科目设置 -保存
export const saveData = data => post ('/finance/accountingSubject/add', data)