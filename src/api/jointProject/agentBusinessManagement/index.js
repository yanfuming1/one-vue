import {get, post, deleteData, putData} from "../../../plugin/axios";

// /joint/agentBusiness/list  代收代付申请-(联营项目)分页列表查询
export const agentBusinessList = data => get('/joint/agentBusiness/list',data)

// /joint/agentBusiness/add/{id}  代收代付申请-添加
export const agentBusinessAdd = data => post('/joint/agentBusiness/add/' + data.id, data.agentBusiness)

// /joint/agentBusiness/queryById  代收代付申请-通过id查询
export const agentBusinessQueryById = data => get('/joint/agentBusiness/queryById',data)

// /joint/agentBusiness/edit/{id}  代收代付申请-编辑
export const agentBusinessEdit = data => putData('/joint/agentBusiness/edit/' + data.id, data.agentBusiness)

// /joint/agentBusiness/deleteBatch  代收代付申请-批量删除
export const agentBusinessDeleteBatch = data => deleteData('/joint/agentBusiness/deleteBatch/' + data.projectId, data)

// /joint/agentBusiness/delete  代收代付申请-通过id删除
export const agentBusinessDeleteById = data => deleteData('/joint/agentBusiness/delete',data)

// /joint/agentBusiness/searchPageList 代收代付申请-分页搜索
export const agentBusinessSearchList = data => get('/joint/agentBusiness/searchPageList',data)


// /joint/agentBusiness/submit/{id}  代收代付申请-提交
export const agentBusinessSubmit = data => post('/joint/agentBusiness/submit/' + data.id, data.agentBusiness)

// 	/joint/agentBusiness/approveOrRejectOrCancelled  代收代付申请-审批 , 驳回 , 作废
export const agentBusinessOperation = data => post('/joint/agentBusiness/approveOrRejectOrCancelled', data)

// /joint/agentBusiness/checkOrAgainst   代收代付申请-审核,反审核
export const agentBusinessCheckOrAgainst = data => get('/joint/agentBusiness/checkOrAgainst',data)

// /system/bankAccount/addReplace 	银行账号-代收代付收藏银行卡
export const agentBusinessBankAccount = data => post('/system/bankAccount/addReplace',data)