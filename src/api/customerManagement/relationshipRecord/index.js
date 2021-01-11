import {get,post,putData,deleteData} from "../../../plugin/axios";

// 联系记录表-分页列表查询
export const getRelationshipRecordList = id => get ('/customer/customerRelationship/page', id)

// 联系记录表-批量删除
export const deleteRelationshipRecord = ids => deleteData ('/customer/customerRelationship/deleteBatch', ids)

// 联系记录表-添加
export const addRelationshipRecordData = data => post ('/customer/customerRelationship/add', data)

// 联系记录表-编辑
export const editRelationshipRecordData = data => putData ('/customer/customerRelationship/edit', data)

// 联系记录表-通过id查询
export const getRelationshipRecordData = id => get ('/customer/customerRelationship/queryById', id)

// 联系记录表-customerId
export const getRelationshipRecordListById = id => get ('/customer/customerRelationship/listById', id)

//  客户管理 - 联系记录表 - customerId
export const getJointVentureContactRecordNumber = data => get('/customer/customerRelationship/countCusRrl', data)



// 甲方联系记录表-分页列表查询
export const getFirstPartyRelationshipRecordList = id => get ('/customers/customerRelationships/page', id)

// 甲方联系记录表-批量删除
export const deleteFirstPartyRelationshipRecord = ids => deleteData ('/customers/customerRelationships/deleteBatch', ids)

// 甲方联系记录表-添加
export const addFirstPartyRelationshipRecordData = data => post ('/customers/customerRelationships/add', data)

// 甲方联系记录表-编辑
export const editFirstPartyRelationshipRecordData = data => putData ('/customers/customerRelationships/edit', data)

// 甲方联系记录表-通过id查询
export const getFirstPartyRelationshipRecordData = id => get ('/customers/customerRelationships/queryById', id)

// 甲方客户信息表-customerId
export const getFirstPartyRelationshipRecordListById = id => get ('/customers/customerRelationships/listById', id)

// 甲方管理 - 联系记录表 - ustomerId
export const getContactRecordPartyANumber = data => get ('/customers/customerRelationships/countCusRrl', data)