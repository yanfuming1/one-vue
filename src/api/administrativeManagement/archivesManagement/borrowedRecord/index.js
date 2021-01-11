import { get, post, putData, deleteData} from "../../../../plugin/axios";

// 档案登记-添加 
export const addBorrowedRecord = data => post ('/administer/adminFileLoan/add', data)

// 档案登记-批量删除
export const deleteBatchBorrowedRecord = ids => deleteData ('/administer/adminFileLoan/deleteBatch', ids)

// 档案登记-编辑 
export const editBorrowedRecord = data => putData ('/administer/adminFileLoan/edit', data)

// 档案登记-分页列表查询
export const getBorrowedRecord = data => get ('/administer/adminFileLoan/list', data)

// 档案登记-通过id查询
export const getBorrowedRecordById = id => get ('/administer/adminFileLoan/queryById', id)

// 档案登记-分页搜索
export const getBorrowedRecordPageList = data => get ('/administer/adminFileLoan/searchPageList', data)

// 借阅记录-根据项目id分页搜索
export const getProRecordPageList = data => get ('/administer/adminFileLoan/searchPageListByProjectId', data)

// 借阅记录-档案归还 
export const returnBorrowedRecordPageList = data => post ('/administer/adminFileLoan/giveback', data)

// 借阅申请-反审核 
export const againstBorrowedRecord = data => putData ('/administer/adminFileLoan/against', data)

// 借阅记录-审核
export const checkBorrowedRecord = data => putData ('/administer/adminFileLoan/check', data)