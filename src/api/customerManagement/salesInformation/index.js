import {get,post,putData,deleteData} from "../../../plugin/axios";

// 客户管理-联营销售信息更新记录-分页列表查询
export const getAssociatedCompanySalesInformationById = id => get ('/customer/customerUpdateRecord/listById', id)

// 客户管理-联营销售信息更新记录-添加
export const addAssociatedCompanySalesInformation = data => post ('/customer/customerUpdateRecord/add', data)

// 客户信息表 联营客户管理主表-销售信息更新接口
export const updateAssociatedCompanyInformationSalesInformation = data => putData ('/customer/customer/updateInformation', data)

// 	甲方客户-甲方销售信息更新记录表-通过甲方客户ID查询记录
export const getFirstPartySalesInformationById = id => get ('/customers/customersUpdateRecords/listById', id)

// 甲方客户-甲方销售信息更新记录表-添加
export const addFirstPartySalesInformation = data => post ('/customers/customersUpdateRecords/add', data)

// 甲方客户信息表 甲方客户管理主表-销售信息更新
export const updateInformationFirstPartySalesInformation = data =>putData ('/customers/customers/updateInformation', data)