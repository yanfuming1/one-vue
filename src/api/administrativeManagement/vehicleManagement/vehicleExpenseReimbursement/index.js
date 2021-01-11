import { get, post, putData, deleteData } from "../../../../plugin/axios"

// 车辆报销申请-分页列表查询
export const getVehicleReimbursementList = data => get ('/administer/vehiclesReimbursement/list', data)

// 车辆报销申请-分页搜索
export const searchVehicleReimbursementList = data => get ('/administer/vehiclesReimbursement/searchPageList', data)

// 车辆报销申请-通过id查询
export const getVehicleReimbursementById = data => get ('/administer/vehiclesReimbursement/queryById', data)

// 车辆报销申请-添加
export const addVehicleReimbursement = data => post ('/administer/vehiclesReimbursement/add', data)

// 车辆报销申请-编辑
export const editVehicleReimbursement = data => putData ('/administer/vehiclesReimbursement/edit', data)

// 车辆报销申请-提交流程接口
export const submitVehicleReimbursement = data => post ('/administer/vehiclesReimbursement/submit', data)

// 车辆报销申请-审批 , 驳回 , 作废
export const completeVehicleReimbursement = data => post ('/administer/vehiclesReimbursement/approveOrRejectOrCancelled', data)

//  车辆报销申请-审核,反审核
export const reviewVehicleReimbursement = data => get ('/administer/vehiclesReimbursement/checkOrAgainst', data)

// 车辆报销申请-批量删除
export const deleteBatchVehicleReimbursement = data => deleteData ('/administer/vehiclesReimbursement/deleteBatch', data)

// 车辆报销申请-重新提交
export const resetSubmitVehicleReimbursement = data => post ('/administer/vehiclesReimbursement/resubmit', data)


