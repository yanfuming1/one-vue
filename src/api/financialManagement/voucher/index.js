import {get,post,putData,deleteData} from "../../../plugin/axios";

export const listSubject = data => get ('/finance/accountingSubject/listSubject', data);

export const goAdd = data => post ('/finance/vouchNumber/goAdd', data); // 查询编号

export const add = data => post ('/finance/voucher/add', data); // 新增

export const edit = data => putData ('/finance/voucher/edit', data); // 修改

export const editSomeThing = data => putData ('/finance/voucher/editSomeThing', data); // 修改

export const deleteFun = data => deleteData ('/finance/voucher/delete', data); // 删除

export const queryList = data => get ('/finance/voucher/list', data); // 新增

export const queryByItemId = data => get ('/finance/voucher/queryByItemId', data); // 新增

export const confGetById = data => get ('/system/configuration/confGetById', data); // 查询高级参数配置





