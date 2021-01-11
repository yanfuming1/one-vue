import {get, post, deleteData, putData} from "../../../plugin/axios";

//                         ------ 工作调整 ------
// 人事管理-工作调整-分页搜索
export const workAdjustmentList = data => get('/hr/workAccommodation/financeSearchList', data)

// 工作调整-查询所有员工账号
export const workFindAllUser = data => get ('/hr/workAccommodation/findAllUser', data)

// 人事管理-工作调整-通过员工id查询回显数据
export const workUsreList = data => get ('/hr/workAccommodation/usreList', data)

// 工作调整-查询职位部门数据
export const workListObjectData = data => get ('/hr/workAccommodation/listObject', data)

// 人事管理-工作调整-通过id查询
export const workQueryById = data => get ('/hr/workAccommodation/queryById', data)

// 人事管理-工作调整-添加
export const workAdjustmentAdd = data => post ('/hr/workAccommodation/add', data)

// 人事管理-工作调整-编辑
export const workAdjustmentEdit = data => putData ('/hr/workAccommodation/edit', data)

// 工作调整-提交流程接口
export const workAdjustmentSubmit = data => post ('/hr/workAccommodation/submit', data)

// 人事管理-工作调整-通过id删除
export const workAdjustmentDeleteId = data => deleteData ('/hr/workAccommodation/delete', data)

// 工作调整-审批 , 驳回 , 作废
export const workAdjustmentProcessOperation = data => post ('/hr/workAccommodation/approveOrRejectOrCancelled', data)

// 工作调整-审核,反审核
export const adjustmentAuditWork = data => get('/hr/workAccommodation/checkOrAgainst', data)

//	查询全部组织 返回组织名称和 组织id
export const queryAllOrganizations = data => get('/system/department/queryAllOrganization', data)

// Summary	根据组织id 组织下的所有结构名称和 机构id
export const queryAllByOrganizationId = data => get('/system/department/queryAllByOrganizationId', data)
