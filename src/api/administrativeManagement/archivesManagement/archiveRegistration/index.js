import { get, post, putData, deleteData} from "../../../../plugin/axios";

// 档案登记-添加 
export const addArchiveRegistration = data => post ('/administer/adminFile/add', data)

// 档案登记-批量删除
export const deleteBatchArchiveRegistration = ids => deleteData ('/administer/adminFile/deleteBatch', ids)

// 档案登记-编辑 
export const editArchiveRegistration = data => putData ('/administer/adminFile/edit', data)

// 档案登记-分页列表查询
export const getArchiveRegistration = data => get ('/administer/adminFile/list', data)

// 档案登记-通过id查询
export const getArchiveRegistrationById = data => get ('/administer/adminFile/queryById', data)

// 档案登记-分页搜索
export const getArchiveRegistrationPageList = id => get ('/administer/adminFile/searchPageList', id)

// 档案管理-分页搜索(项目)
export const getProjectArchivePageList = id => get ('/administer/adminFile/queryPageListByProjectId', id)

// 借阅申请-反审核
export const againstArchiveRegistration = data => putData ('/administer/adminFileLoan/against', data)

// 借阅申请-审核
export const checkArchiveRegistration = data => putData ('/administer/adminFileLoan/check', data)

// 借阅申请-工作流完成
export const completeArchiveRegistration = data => post ('/administer/adminFileLoan/complete', data)

// 用章申请-submit
export const submitArchiveRegistration = data => post ('/administer/adminFileLoan/submit', data)

// 借阅归还
export const borrowedArchiveRegistration = data => post ('/administer/adminFileLoan/giveback', data)