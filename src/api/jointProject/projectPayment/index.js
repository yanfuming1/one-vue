import {get, post, deleteData, putData} from "../../../plugin/axios";

// /joint/agentBusiness/list  代收代付申请-(联营项目)分页列表查询
export const agentBusinessList = data => get('/joint/agentBusiness/list',data)

// /joint/projectPayment/searchPageList  工程款支付申请-分页搜索
export const projectPaymenSearchList = data => get('/joint/projectPayment/searchPageList',data)

// /joint/projectPayment/add/{id} 工程款支付申请-添加
export const projectPaymentAdd = data => post('/joint/projectPayment/add/' + data.id ,data.projectPayment)

// /joint/projectPayment/deleteBatch  工程款支付申请-批量删除
export const projectPaymenDeleteBatch = data => deleteData('/joint/projectPayment/deleteBatch',data)

// /joint/projectPayment/queryById  工程款支付申请-通过id查询
export const projectPaymenQueryById = data => get('/joint/projectPayment/queryById',data)

// /joint/projectPayment/edit/{id}  工程款支付申请-编辑
export const projectPaymentEdit = data => putData('/joint/projectPayment/edit/' + data.id ,data.projectPayment)

// /joint/projectPayment/submit/{id}  工程款支付申请-提交工作流
export const projectPaymentSub = data => post('/joint/projectPayment/submit/' + data.id ,data.projectPayment)

// /joint/projectPayment/approveOrRejectOrCancelled  	工程款支付申请-审批 , 驳回 , 作废
export const projectPaymentOperation = data => post('/joint/projectPayment/approveOrRejectOrCancelled', data)

// /joint/projectPayment/checkOrAgainst   工程款支付申请-审核,反审核
export const projectPaymenCheckOrAgainst = data => get('/joint/projectPayment/checkOrAgainst',data)

// /joint/withhold/delete 工程款支付申请删除添加行接口
export const projectPaymenDelete = data => deleteData('/joint/withhold/delete',data)
