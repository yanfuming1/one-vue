import {get,post,putData,deleteData} from "../../../plugin/axios";

// 联营客户—客户授权-通过id查询
export const getCustomerListById = id => get ('/customer/customerAuthorization/queryPageListById', id)

// 客户信息表 通过员工buLeId查询已授权客户信息
export const getCustomerAuthorizationByUserId = id => get ('/customer/customer/customerById', id)

// 联营客户—客户授权-添加
export const addCustomerAuthorization = data => post ('/customer/customerAuthorization/insertForeach', data)

export const deleteBatchCustomerAuthorization = ids => deleteData ('/customer/customerAuthorization/deleteBatch', ids)

// 客户信息表-销售信息更新 (授权信息)
export const getCustomerAuthorizationToSalesInformation = id => get ('/customer/customer/pageB', id)

// 甲方客户信息表 通过员工buLeId查询已授权客户信息
export const getFirstPartyCustomerAuthorizationByUserId = id => get ('/customers/customers/customerById', id)

// 甲方客户—客户授权-添加
export const addFirstPartyCustomerAuthorization = data => post ('/customers/customersAuthorization/insertForeach', data)

// 联营客户—客户授权-通过id查询
export const getFirstPartyCustomersAuthorizationListById = id => get ('/customers/customersAuthorization/queryPageListById', id)

// 甲方客户—客户授权-批量删除
export const deleteBatchFirstPartyCustomerAuthorization = ids => deleteData ('/customers/customersAuthorization/deleteBatch', ids)