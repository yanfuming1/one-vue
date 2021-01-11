import {get, post, deleteData, putData} from "../../../plugin/axios";

// /joint/projectFunds/add  工程款到账登记-添加
export const projectFundsAdd = data => post('/joint/projectFunds/add/' + data.id, data.projectFunds)
//  工程款到账登记-提交
export const projectFundsSubmit = data => post('/joint/projectFunds/submit/' + data.id, data.projectFunds)

// /joint/projectFunds/search  工程款到账登记-分页搜索
export const projectFundsSearch = data => get('/joint/projectFunds/search', data)

// /joint/projectFunds/queryById  工程款到账登记-通过id查询
export const projectFundsQueryById = data => get('/joint/projectFunds/queryById', data)

// /joint/projectFunds/edit/{id}  工程款到账登记-编辑
export const projectFundsEdit = data => putData('/joint/projectFunds/edit/' + data.id, data.projectFunds)

// /joint/projectFunds/deleteBatch/{id}  工程款到账登记-批量删除
export const projectFundsDelete = data => deleteData('/joint/projectFunds/deleteBatch/' + data.id, data)

// /joint/projectFunds/additional  工程款到账登记-追加工程款已到账和已支付金额
export const projectFundsAdditional = data => get('/joint/projectFunds/additional', data)
