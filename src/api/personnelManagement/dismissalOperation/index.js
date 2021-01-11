import {get, post, deleteData, putData} from "../../../plugin/axios";

// 入职登记-分页列表查询
export const entryRegistrationList = data => get('/hr/entry/list',data)

//                         ------ 辞退申请 ------
// 辞退申请-分页搜索
export const pageSearchDismissalApplication = data => get ('/personnelmanagement/dismiss/searchPageList', data)

// 辞退申请-查询所有员工账号
export const accountInformationDismissedEmployees = data => get ('/personnelmanagement/dismiss/findAllUser', data)

// Summary	辞退申请-通过id查询
export const queryDismissalApplicationID = data => get ('/personnelmanagement/dismiss/queryById', data)

// 辞退申请-添加
export const addDismissalApplication = data => post ('/personnelmanagement/dismiss/add', data)

// 辞退申请-编辑
export const editDismissalApplication = data => putData ('/personnelmanagement/dismiss/edit', data)

// 辞退申请-通过id删除
export const deleteDismissalApplicationID = data => deleteData ('/personnelmanagement/dismiss/delete', data)

// 辞退申请-批量删除
export const batchDeleteDismissalApplication = data => deleteData ('/personnelmanagement/dismiss/deleteBatch', data)

// 辞退申请-提交流程接口
export const submitDismissalApproval = data => post ('/personnelmanagement/dismiss/submit', data)

// 辞退申请-审批 , 驳回 , 作废
export const dismissalApplicationOperation = data => post ('/personnelmanagement/dismiss/approveOrRejectOrCancelled', data)

// 	辞退申请-审核,反审核
export const dismissalApprovalOperation = data => get ('/personnelmanagement/dismiss/checkOrAgainst', data)



//                         ------ 工作调整 ------

