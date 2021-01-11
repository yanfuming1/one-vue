import {get,post,putData,deleteData} from "../../../plugin/axios";

// 客户管理 联系人的信息-添加
export const addContactsData = data => post ('/customer/contactInfo/add', data)

// 客户管理 联系人的信息-通过id 批量删除
export const deleteBatchContactsData = ids => deleteData ('/customer/contactInfo/deleteBatch', ids)

// 客户管理 联系人的信息-编辑
export const editContactsData = data => putData ('/customer/contactInfo/edit', data)

// 客户管理 联系人的信息-分页列表查询
export const getContactsList = id => get ('/customer/contactInfo/queryForList', id)

// 客户管理 联系人的信息-通过id查询
export const getContactsQueryById = id => get ('/customer/contactInfo/queryById', id)

// 客户管理 设置为主要联系人
export const setMainManData = id => get ('/customer/contactInfo/setMainMan', id)



// 甲方客户管理联系人新-添加
export const addFirstPartyContactsData = data => post ('/customers/contactsInfo/add', data)

// 甲方客户管理联系人新-编辑
export const editFirstPartyContactsData = data => putData ('/customers/contactsInfo/edit', data)

// 甲方客户管理联系人新-分页列表查询
export const getFirstPartyContactsList = id => get ('/customers/contactsInfo/queryListById', id)

// 甲方设置为主要联系人
export const setFirstPartyMainManData = id => get ('/customers/contactsInfo/setMainMan', id)