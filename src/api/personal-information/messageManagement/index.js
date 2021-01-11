import {get,post,putData,deleteData} from "../../../plugin/axios";

//                      ------ 我的消息 ------
export const myMessageList = data => get ('/administer/message/queryOwnMessageList', data)

// 通知公告-个人中心,个人消息搜索分页
export const pagedListSearch = data => get ('/administer/message/searchOwnMessageList', data)

// 通知公告-个人中心个人通过id查询
export const newsDetails = data => get ('/administer/message/ownQueryById', data) 

// 通知公告-个人中心个人批量删除
export const myMessageBatchDeletion = data => get ('/administer/message/batchesDel', data)

// 通知公告-个人中心个人全部删除
export const myMessagedelAll = data => get ('/administer/message/delAll', data)

//	通知公告-个人中心个人标记为已读
export const markedRead = data => get ('/administer/message/tabRead', data)

// 通知公告-个人中心个人全部标记为已读
export const allRead = data => get ('/administer/message/allTabRead', data)

// 通知公告-个人中心消息类型的条数
export const messageNumber = data => get ('/administer/message/typeNumber',data)


//                      ------ 发布消息 ------
// 通知公告-分页列表查询
export const publishMessageList = data => get ('/administer/message/list', data)

// 通知公告-分页列表查询
export const publishMessagepersion = data => get ('/administer/message/personList', data)

// 通知公告-通过id查询未浏览人名字
export const browerNumber = data => get ('/administer/message/notBrowseUsername', data)

// 	通知公告-发布消息搜索
export const searchPulishMessageList = data => get ('/administer/message/searchList', data)

// 通知公告-添加
export const publishMessageAdd = data => post ('/administer/message/add',data)

// 通知公告-编辑
export const publishMessageEdit = data => putData ('/administer/message/edit',data)

// 通知公告-通过id删除
export const pluginMessageDelect = data => deleteData ('/administer/message/delete',data)

// 通知公告-批量删除
export const pluginMessageDelectAll = data => deleteData ('/administer/message/deleteBatch',data)

// 通知公告-下线
export const publishMessagesOffline = data => get ('/administer/message/down',data)

// 通知公告-发布消息
export const publishNews = data => get('/administer/message/issueMsg',data)

// 通知公告-发布消息-提交
export const publishNewsSubmit = data => post('/administer/message/submit',data)

//  通知公告 - 发布消息 - 审批 , 驳回 , 作废
export const publishNewsOperation = data => post('/administer/message/approveOrRejectOrCancelled',data)

// 通知公告-通过id查询
export const publishNewsqueryById = data => get('/administer/message/queryById',data)

// 通知公告-审核和反审核
export const toExamineMessage = data => get('/administer/message/checkOrAgainst',data)

// 通知公告-添加文件
export const addPublishNewFile = data => get('/administer/message/addFile', data)