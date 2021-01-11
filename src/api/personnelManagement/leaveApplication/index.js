import {get, post, deleteData, putData} from "../../../plugin/axios";
//                         ------ 离职申请 ------
// 离职申请-分页搜索
export const resignationApplicationPageSearch = data => get('/personnelmanagement/leaveOffice/searchPageList', data)

// 离职申请-通过id查询个人资料
export const resignationQueryPersonalDataID = data => get ('/personnelmanagement/leaveOffice/queryUserById', data)

//  离职申请-添加
export const addResignationApplication = data => post ('/personnelmanagement/leaveOffice/add', data)

// 离职申请-编辑
export const editResignationApplication = data => putData ('/personnelmanagement/leaveOffice/edit', data)

// 离职申请-通过id删除
export const deleteResignationApplicationID = data => deleteData ('/personnelmanagement/leaveOffice/delete', data)

// 离职申请-批量删除
export const batchDeleteResignationApplication = data => deleteData ('/personnelmanagement/leaveOffice/deleteBatch', data)

// 离职申请-通过id查询
export const queryResignationByID = data => get ('/personnelmanagement/leaveOffice/queryById', data)

// 	离职申请-查询交接人
export const handoverPersonResignation = data => get('/system/department/queryStaffTree', data)

// 	离职申请-提交流程接口
export const submitResignationProcess = data => post('/personnelmanagement/leaveOffice/submit',  data)

// 离职申请-审批 , 驳回 , 作废
export const resignationApplicationOperation = data => post ('/personnelmanagement/leaveOffice/approveOrRejectOrCancelled', data) 

// 离职申请-审核,反审核
export const resignationApproval = data => get ('/personnelmanagement/leaveOffice/checkOrAgainst', data)