import {get,post,putData,deleteData} from "../../../plugin/axios";

//	联营，甲方客户批量删除
export const poolFirstPartyBatchDeletion = data => deleteData ('/customer/customer/cusdeleteBatch', data)

// ------ 我的创建 ------
// 根据创建人id客户信息表-分页列表查询
export const createCustomerList = data => get ('/customer/customer/customerByById', data)

// 客户关注表-添加
export const addConcern = data => post ('/mapper/custome/customeAttention/add', data)

// ------ 我的关注 ------
// 客户关注表-分页列表查询
export const myConcemList = data => get ('/mapper/custome/customeAttention/list', data)

// 客户关注表-通过id删除
export const removeConcerns = data => deleteData ('/mapper/custome/customeAttention/delete', data)

// 客户关注表-批量删除
export const batchRemoveConcerns = data => deleteData ('/mapper/custome/customeAttention/deleteBatch', data)

// ------ 我接管的 ------
// 通过业务员ID查询当前业务员负责的客户-分页列表查询
export const iTookOver = data => get ('/customer/customer/customerByBuId', data)

// ------ 我可看的 ------
// 客户共享表-分页列表查询
export const iCanSeele = data => get ('/customer/customerSharing/page', data)


// 根据父id获取自数据
export const getCustomerList = id => get ('/customer/customer/page', id)

// 根据父id获取自数据
export const getCustomerPageList = id => get ('/customer/customer/pageList', id)

// d批量删除
export const deleteCustomer = ids => deleteData ('/customer/customer/deleteBatch', ids)

// 更新客户管理数据
export const updataCustomer = data => putData ('/customer/customer/edit', data)

// 添加客户管理数据
export const addCustomerData = data => post ('/customer/customer/add', data)
