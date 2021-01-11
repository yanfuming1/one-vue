import { get, post, putData, deleteData} from "../../../../plugin/axios";

// 收文登记-添加
export const addReceiptRegistration = data => post ('/administer/adminReceiveFile/add', data)

// 收文登记-批量删除
export const deleteBatchReceiptRegistration = ids => deleteData ('/administer/adminReceiveFile/deleteBatch', ids)

// 收文登记-编辑
export const editReceiptRegistration = data => putData ('/administer/adminReceiveFile/edit', data)

// 收文登记-分页列表查询
export const getReceiptRegistration = data => get ('/administer/adminReceiveFile/list', data)

// 收文登记-通过id查询
export const getReceiptRegistrationById = data => get ('/administer/adminReceiveFile/queryById', data)

// 收文登记-分页搜索
export const getReceiptRegistrationPageList = id => get ('/administer/adminReceiveFile/searchPageList', id)

// 收文登记-审批 , 驳回 , 作废
export const completeReceiptRegistration = data => post ('/administer/adminReceiveFile/complete', data)

// 收文登记-反审核
export const againstReceiptRegistration = data => putData ('/administer/adminReceiveFile/against', data)

// 收文登记-审核
export const checkReceiptRegistration = data => putData ('/administer/adminReceiveFile/check', data)

// 收文登记-提交流程接口
export const submitReceiptRegistration = data => post ('/administer/adminReceiveFile/submit', data)

// 收文登记-回复历史
export const getReplyHistoryPageList = id => get ('/administer/adminReceiveFile/replyList', id)