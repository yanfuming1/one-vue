import { get, post, putData, deleteData } from "../../../../plugin/axios"

// 自营 - 我方投标 - 招标文件答疑-分页搜索
export const biddingDocumentQAPageSearch = data => get ('/self/bid/query/page', data)

//	自营 - 我方投标 - 招标文件答疑-通过id查询
export const getBiddingDocumentQAById = data => get ('/self/bid/query/queryById', data)

// 我方投标 - 招标文件答疑-添加
export const addBiddingDocumentQA = data=> post (`/self/bid/query/add/${data.projectCode}`, data)

// 自营 - 我方投标 - 招标文件答疑-编辑
export const editBiddingDocumentQA = data=> putData (`/self/bid/query/edit/${data.projectCode}`, data)

// 我方投标 - 招标文件答疑-通过id删除
export const delBiddingDocumentQAById = data=> deleteData ('/self/bid/query/delete', data)

// 自营 - 我方投标 - 招标文件答疑-批量删除
export const delBatchBiddingDocumentQA = data=> deleteData ('/self/bid/query/deleteBatch', data)

// 自营 - 我方投标 - 招标文件答疑-提交流程接口
export const subBiddingDocumentQA = data=> post (`/self/bid/query/submit/${data.projectCode}`, data)

// 自营 - 我方投标 - 招标文件答疑-重新提交
export const reSubBiddingDocumentQA = data=> post ('/self/bid/query/resubmit', data)

// 自营 - 我方投标 - 招标文件答疑-审批 , 驳回 , 作废
export const operationBiddingDocumentQA = data=> post ('/self/bid/query/approveOrRejectOrCancelled', data)
