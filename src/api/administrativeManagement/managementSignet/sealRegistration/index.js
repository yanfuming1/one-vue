import { get, post, putData, deleteData} from "../../../../plugin/axios";

// 印章登记-添加 
export const addSealRegistration = data => post ('/administer/adminSealreg/add', data)

// 印章登记-批量删除
export const deleteBatchSealRegistration = ids => deleteData ('/administer/adminSealreg/deleteBatch', ids)

// 印章登记-编辑 
export const editSealRegistration = data => putData ('/administer/adminSealreg/edit', data)

// 印章登记-分页列表查询
export const getSealRegistration = data => get ('/administer/adminSealreg/queryByGroupid', data)

// 印章登记-列表查询
export const getAllSealRegistration = data => get ('/administer/adminSealreg/allSealregList', data)

// 印章登记-通过id查询
export const getSealRegistrationById = data => get ('/administer/adminSealreg/queryById', data)

// 印章登记-分页搜索
export const getSealRegistrationPageList = id => get ('/administer/adminSealreg/searchPageList', id)