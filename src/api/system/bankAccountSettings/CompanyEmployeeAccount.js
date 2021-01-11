import {get,post,putData,deleteData} from "../../../plugin/axios";

// 获取数据
export const CompanyEmployeeAccount = data => get('/system/bankAccount/list', data)
// export const CompanyEmployeeAccount = data => get('/system/bankAccount/list?accountType=2', data)

// /system/bankAccount/lookPersonageAccount
export const getBackAccountList = data => get ('/system/bankAccount/lookPersonageAccount', data)

// 删除
export const CompanyEmployeeAccountDelete = data => deleteData('/system/bankAccount/delete', data)

// 批量删除
export const CompanyEmployeeAccountDeleteAll = data => deleteData('/system/bankAccount/deleteBatch' , data)

// 添加
export const addCompanyEmployeeAccount = data => post('/system/bankAccount/add', data)

// 编辑
export const editAccountData = data => post('/system/bankAccount/edit', data)

export const getCompanyEmployeeAccountById = id => get ('/system/bankAccount/queryById', id)