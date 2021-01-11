import {get,post,putData,deleteData} from "../../../../plugin/axios";

// 自营项目 — 合同签订 — 添加 
export const addSelfContractConcludeSign = data => post (`/self/managerCreate/add/${data.projectCode}`, data)

// 自营项目 — 合同签订 — 编辑 
export const editSelfContractConcludeSign = data => putData (`/self/managerCreate/edit/${data.projectCode}`, data)

// 自营项目 — 合同签订 — 通过id查询
export const getSelfContractConcludeSignById = id => get ('/self/managerCreate/queryById', id)

// 自营项目 — 合同签订 — 审批 , 驳回 , 作废
export const completeSelfContractConcludeSign = data => post ('/self/managerCreate/approveOrRejectOrCancelled', data)

// 自营项目 — 合同签订 — 提交流程接口
export const submitSelfContractConcludeSign = data => post (`/self/managerCreate/submit/${data.projectCode}`, data)

// 自营项目 — 合同签订 — 重新提交流程接口
export const resetSubmitSelfContractConcludeSign = data => post ('/self/managerCreate/resubmit', data)

// 自营项目 — 合同签订 — 批量删除
export const deleteBatchSelfContractConcludeSign = data => deleteData (`/self/managerCreate/deleteBatch/${data.projectCode}`, data)

// 自营项目 — 合同签订 — 分页搜索
export const getSelfContractConcludeSignPageList = id => get ('/self/managerCreate/list', id)

// 自营项目 — 合同签订 — 审核和反审核
export const checkAgainstSelfContractConcludeSign = data => get ('/self/managerCreate/checkOrAgainst', data)

// 自营项目 — 合同签订 — 列表去重
export const getSelfContractConcludeSignList = id => get ('/self/managerCreate/list', id)

// 自营项目 — 合同变更 — 获取更改历史
export const getSelfContractAlterationVersion = data => get ('/self/managerCreate/queryVersionById', data)

// 自营项目 — 合同管理- 新建合同-查询状态完结数据
export const getSelfContractConcludeSignStateList = data => get (`/self/managerCreate/queryByCode`, data)

// 自营项目 — 合同管理- 新建合同-查询状态完结数据 分页
export const getSelfContractInvoicePageList = id => get ('/self/managerCreate/searchPageList', id)

// 自营项目 — 合同管理- 新建合同-更改合同状态
export const updataSelfContractConcludeSignState = id => putData ('/self/managerCreate/editState', id)



/*--------------------------------------------------------------导航----------------------------------------------------------------------*/


// 合同签订 — 添加 
export const addContractConcludeSign = data => post (`/bargain/managerCreate/add`, data)

// 合同签订 — 编辑 
export const editContractConcludeSign = data => putData (`/bargain/managerCreate/edit`, data)

// 合同签订 — 通过id查询
export const getContractConcludeSignById = id => get ('/bargain/managerCreate/queryById', id)

// 合同签订 — 审批 , 驳回 , 作废
export const completeContractConcludeSign = data => post ('/bargain/managerCreate/approveOrRejectOrCancelled', data)

// 合同签订 — 提交流程接口
export const submitContractConcludeSign = data => post (`/bargain/managerCreate/submit`, data)

// 合同签订 — 重新提交流程接口
export const resetSubmitContractConcludeSign = data => post ('/bargain/managerCreate/resubmit', data)

// 合同签订 — 批量删除
export const deleteBatchContractConcludeSign = ids => deleteData ('/bargain/managerCreate/deleteBatch', ids)

// 合同签订 — 分页搜索
export const getContractConcludeSignPageList = id => get ('/bargain/managerCreate/list', id)

// 合同签订 — 审核和反审核
export const checkAgainstContractConcludeSign = data => get ('/bargain/managerCreate/checkOrAgainst', data)

// 合同签订 — 列表去重
export const getContractConcludeSignList = id => get ('/bargain/managerCreate/list', id)

// 合同变更 — 获取更改历史
export const getContractAlterationVersion = data => get ('/bargain/managerCreate/queryVersionById', data)

// 合同管理- 新建合同-查询状态完结数据
export const getContractConcludeSignStateList = data => get (`/bargain/managerCreate/queryByState`, data)

// 合同管理- 新建合同-查询状态完结数据 分页
export const getContractInvoicePageList = id => get ('/bargain/managerCreate/searchPageList', id)

// 合同管理- 新建合同-更改合同状态
export const updataContractConcludeSignState = id => putData ('/bargain/managerCreate/editState', id)


/**------------------------------------------------------联营合同----------------------------------------------------- */

// 联营项目 — 合同签订 — 添加 
export const addJointContractConcludeSign = data => post (`/joint/managerCreate/add/${data.projectId}`, data)

// 联营项目 — 合同签订 — 编辑 
export const editJointContractConcludeSign = data => putData (`/joint/managerCreate/edit/${data.projectId}`, data)

// 联营项目 — 合同签订 — 通过id查询
export const getJointContractConcludeSignById = id => get ('/joint/managerCreate/queryById', id)

// 联营项目 — 合同签订 — 审批 , 驳回 , 作废
export const completeJointContractConcludeSign = data => post ('/joint/managerCreate/approveOrRejectOrCancelled', data)

// 联营项目 — 合同签订 — 提交流程接口
export const submitJointContractConcludeSign = data => post (`/joint/managerCreate/submit/${data.projectId}`, data)

// 联营项目 — 合同签订 — 重新提交流程接口
export const resetSubmitJointContractConcludeSign = data => post ('/joint/managerCreate/resubmit', data)

// 联营项目 — 合同签订 — 批量删除
export const deleteBatchJointContractConcludeSign = data => deleteData (`/joint/managerCreate/deleteBatch/${data.projectId}`, data)

// 联营项目 — 合同签订 — 分页搜索
export const getJointContractConcludeSignPageList = id => get ('/joint/managerCreate/list', id)

// 联营项目 — 合同签订 — 审核和反审核
export const checkAgainstJointContractConcludeSign = data => get ('/joint/managerCreate/checkOrAgainst', data)

// 联营项目 — 合同签订 — 列表去重
export const getJointContractConcludeSignList = id => get ('/joint/managerCreate/list', id)

// 联营项目 — 合同变更 — 获取更改历史
export const getJointContractAlterationVersion = data => get ('/joint/managerCreate/queryVersionById', data)

// 联营项目 — 合同管理- 新建合同-查询状态完结数据
export const getJointContractConcludeSignStateList = data => get (`/self/managerCreate/queryByCode`, data)

// 联营项目 — 合同管理- 新建合同-查询状态完结数据 分页
export const getJointContractInvoicePageList = id => get ('/self/managerCreate/searchPageList', id)

// 联营项目 — 合同管理- 新建合同-更改合同状态
export const updataJointContractConcludeSignState = id => putData ('/self/managerCreate/editState', id)
