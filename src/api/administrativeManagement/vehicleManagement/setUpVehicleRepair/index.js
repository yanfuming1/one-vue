import { get, post, putData, deleteData } from "../../../../plugin/axios"

// 车辆补助标准设置-分页搜索
export const setUpVehicleRepairList = data => get ('/administer/vehicleAmendantRecord/searchPageList', data)

// 车辆补助标准设置-添加
export const addSetUpVehicleRepair = data => post ('/administer/vehicleAmendantRecord/add', data)

// 车辆补助标准设置-编辑
export const editSetUpVehicleRepair = data => putData ('/administer/vehicleAmendantRecord/edit', data)

// 车辆补助标准设置-批量删除
export const deleteBatchVehicleRepair = data => deleteData ('/administer/vehicleAmendantRecord/deleteBatch', data)

// 车辆补助标准设置-通过id查询
export const getSetUpVehicleRepairById = data => get ('/administer/vehicleAmendantRecord/queryById', data)

// 车辆补助标准设置-提交流程接口
export const submitSetUpVehicleRepair = data => post ('/administer/vehicleAmendantRecord/submit', data)



