import { get, post, putData, deleteData} from "../../../../plugin/axios";

// 行政管理-发文登记-添加
export const addPostRegistration = data => post ('/administer/adminSendFile/add', data)

// 行政管理-发文登记-批量删除
export const deleteBatchPostRegistration = ids => deleteData ('/administer/adminSendFile/deleteBatch', ids)

// 行政管理-发文登记-编辑
export const editPostRegistration = data => putData ('/administer/adminSendFile/edit', data)

// 行政管理-发文登记-通过id查询
export const getPostRegistrationById = id => get ('/administer/adminSendFile/queryById', id)

// 行政管理-发文登记-分页搜索
export const getPostRegistrationPageList = data => get ('/administer/adminSendFile/financeSearchList', data)

// 发文登记-审批 , 驳回 , 作废
export const completePostRegistration = data => post ('/administer/adminSendFile/approveOrRejectOrCancelled', data)

// 发文登记-审核,反审核
export const checkAgainstPostRegistration = data => get ('/administer/adminSendFile/checkOrAgainst', data)

// 发文登记-提交流程接口
export const submitPostRegistration = data => post ('/administer/adminSendFile/submit', data)

// 发文登记-创建文件
export const postRegistrationCreateFile = data => get ('/administer/adminSendFile/createFile', data)
