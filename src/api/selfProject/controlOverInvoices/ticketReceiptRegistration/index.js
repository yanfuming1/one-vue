import {get,post,putData,deleteData} from "../../../../plugin/axios";

// 发票管理 - 发票信息-添加
export const addTicketReceiptRegistration = data=> post ('/invoice/origin/add' , data)

// 发票管理 - 发票信息-分页搜索
export const getTicketReceiptRegistrationList = data=> get ('/invoice/origin/page', data)

// 发票管理 - 发票信息-ORC多张
export const multiScan = data=> post ('/invoice/origin/multiScan', data)

// 发票管理 - 发票信息-编辑
export const editTicketReceiptRegistration = data=> putData ('/invoice/origin/edit' , data)


// 发票管理-反审核
export const checkOrAgains = data => get ('/invoice/origin/checkOrAgainst', data)

// 发票管理 - 自营项目 - 反审核
export const selfCheckOrAgains = data => get ('/self/invoice/origin/checkOrAgainst', data)

// 发票管理 - 发票信息-通过id查询
export const queryByIdTicketReceiptRegistration = data=> get ('/invoice/origin/queryById', data)

// 发票管理 - 发票信息-通过id删除
export const delByIdTicketReceiptRegistration = data=> deleteData ('/invoice/origin/delete', data)
// /qqtoi/flow/modelSynopsis/listByStartCrew?formKey=staffLoan

// 运行中的流程-查询当前用户可启动的流程
export const listByStartCrew = data => get('/flow/modelSynopsis/listByStartCrew', data)

// 发票管理 - 发票信息-提交
export const submitAddTicketReceiptRegistration = data => post('/invoice/origin/submit' , data)

// 发票管理 - 发票信息-重新提交
export const resetSubmitAddTicketReceiptRegistration = data => post('/invoice/origin/resubmit' , data)

// 发票管理 - 发票信息-审核-同意、驳回、作废
export const completeAddTicketReceiptRegistration = data => post('/invoice/origin/approveOrRejectOrCancelled ', data)

// 自营发票

// 发票管理 - 发票信息-添加
export const addSelfTicketReceiptRegistration = data=> post ('/self/invoice/origin/add/' + data.projectCode, data)

// 发票管理 - 发票信息-分页搜索
export const getSelfTicketReceiptRegistrationList = data=> get ('/self/invoice/origin/page', data)

// 发票管理 - 发票信息-ORC
export const uploadImgForOrc = data=> get ('/self/invoice/origin/invoiceScan', data)

// 发票管理 - 发票信息-ORC多张
export const selfMultiScan = data=> post ('/self/invoice/origin/multiScan', data)

// 发票管理 - 发票信息-编辑
export const editSelfTicketReceiptRegistration = data=> putData ('/self/invoice/origin/edit/' + data.projectCode, data)

// 发票管理 - 发票信息-通过id查询
export const queryByIdSelfTicketReceiptRegistration = data=> get ('/self/invoice/origin/queryById', data)

// 发票管理 - 发票信息-通过id删除
export const delByIdSelfTicketReceiptRegistration = data=> deleteData ('/self/invoice/origin/delete', data)
// /qqtoi/flow/modelSynopsis/listByStartCrew?formKey=staffLoan


// 发票管理 - 发票信息-提交
export const submitSelfAddTicketReceiptRegistration = data => post('/self/invoice/origin/submit/' + data.projectCode, data)

// 发票管理 - 发票信息-重新提交
export const resetSelfSubmitAddTicketReceiptRegistration = data => post('/self/invoice/origin/resubmit', data)

// 发票管理 - 发票信息-审核-同意、驳回、作废
export const completeSelfAddTicketReceiptRegistration = data => post('/self/invoice/origin/approveOrRejectOrCancelled ', data)

// 发票管理 查询自营
export const getSelfUnifyProject = data=> get ('/self/approval/approval/getUnifyProject', data)

// 发票管理 查询自营  

export const getSelfUnifyProjectAll = data=> get ('/self/previous/projectCreate/getUnifyProject', data)

// 发票管理 查询联营
export const getJointUnifyProject = data=> get ('/joint/jointProjectApproval/getUnifyProject', data)
// 发票管理 查询联营
export const getJoinUnifyProjectAll = data=> get ('/joint/jointProject/getUnifyProject', data)

export const queryByEnd = data=> get ('/bargain/managerCreate/queryByEnd', data)


/**----------------------------------------------------------------联营项目---------------------------------------------------------- */

// 联营项目 发票管理 - 发票信息-添加
export const addJointTicketReceiptRegistration = data=> post ('/joint/invoice/origin/add/' + data.projectId, data)

// 联营项目 发票管理 - 发票信息-分页搜索
export const getJointTicketReceiptRegistrationList = data=> get ('/joint/invoice/origin/page', data)

// 联营项目 发票管理 - 发票信息-ORC多张
export const jointMultiScan = data=> post ('/joint/invoice/origin/multiScan', data)

// 联营项目 发票管理 - 发票信息-编辑
export const editJointTicketReceiptRegistration = data=> putData ('/joint/invoice/origin/edit/' + data.projectId, data)

// 联营项目 发票管理 - 发票信息-通过id查询
export const queryByIdJointTicketReceiptRegistration = data=> get ('/joint/invoice/origin/queryById', data)

// 联营项目 发票管理 - 发票信息-通过id删除
export const delByIdJointTicketReceiptRegistration = data=> deleteData ('/joint/invoice/origin/delete', data)

// 联营项目 发票管理 - 发票信息-提交
export const submitJointAddTicketReceiptRegistration = data => post('/joint/invoice/origin/submit/' + data.projectId, data)

// 联营项目 发票管理 - 发票信息-重新提交
export const resetSubmitJointAddTicketReceiptRegistration = data => post('/joint/invoice/origin/resubmit', data)

// 联营项目 发票管理 - 发票信息-审核-同意、驳回、作废
export const completeJointAddTicketReceiptRegistration = data => post('/joint/invoice/origin/approveOrRejectOrCancelled ', data)

// 发票管理 - 自营项目 - 反审核
export const jointCheckOrAgains = data => get ('/joint/invoice/origin/checkOrAgainst', data)



