import {get,post,putData,deleteData} from "../../../plugin/axios";

// 根据父id获取自数据
export const getAssociatedCompanyCustomerList = id => get ('/customer/customer/pageAll', id)

// 客户信息表-搜索框查询
export const getAssociatedCompanyCustomerPageList = id => get ('/customer/customer/pageListA', id)

// id批量删除
export const deleteAssociatedCompanyCustomer = ids => deleteData ('/customer/customer/deleteBatch', ids)

// 根据id获取客户信息
export const getAssociatedCompanyCustomerManagement = id => get ('/customer/customer/queryById', id)

// 根据用户id获取用户部门
export const getUserDepartment = id => get ('/system/staff/getDepNameAndIdByUserId', id)

// 更新客户管理数据
export const updataAssociatedCompanyCustomer = data => putData ('/customer/customer/edit', data)

// 添加客户管理数据
export const addAssociatedCompanyCustomerData = data => post ('/customer/customer/add', data)

// 关注客户
export const addCustomeAttention = data => post ('/mapper/custome/customeAttention/add', data)

// 共享客户
export const shareCustomeAttention = data => post ('/customer/customerSharing/insertForeach', data)


// 甲方客户信息表-分页列表查询
export const getFirstPartyCustomerList = id => get ('/customers/customers/pageAll', id)

// 甲方客户信息表-通过id查询
export const getFirstPartyCustomerPageList = id => get ('/customers/customers/pageListA', id)

// 甲方客户信息表-批量删除
export const deleteFirstPartyCustomer = ids => deleteData ('/customers/customers/deleteBatch', ids)

// 甲方客户信息表-编辑
export const updataFirstPartyCustomer = data => putData ('/customers/customers/edit', data)

// 甲方客户信息表-添加
export const addFirstPartyCustomerData = data => post ('/customers/customers/add', data)

// 甲方客户信息表-通过id查询
export const getFirstPartyCustomerManagement = id => get ('/customers/customers/queryById', id)



// 全部客户
export const getAllCustomerManagement = (id) => get ('/customer/customer/customerList', id)

// 全部客户
export const getAllCustomerManagementClientTypeById = (id) => get ('/customer/customer/clientTypeById', id)