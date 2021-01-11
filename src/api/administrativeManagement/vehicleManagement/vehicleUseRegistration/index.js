import { get, post, putData, deleteData} from "../../../../plugin/axios";

// 车辆使用登记-分页搜索
export const vehicleUseRegistrationList = data => get ('/administer/vehicleRegistration/searchPageList', data)

// 获取所有车牌号
export const getAllLicensePlateNumber = data => get ('/administer/vehicleInformation/list', data)

// 车辆使用登记-添加
export const addVehicleUseRegistration = data => post ('/administer/vehicleRegistration/add', data)

// 	车辆使用登记-编辑
export const editVehicleUseRegistration = data => putData ('/administer/vehicleRegistration/edit', data)

// 车辆使用登记-通过id查询
export const vehicleUseRegistrationQueryById = data => get ('/administer/vehicleRegistration/queryById', data)

// 工作调整-提交流程接口
export const submitVehicleUseRegistration = data => post ('/administer/vehicleRegistration/submit', data)

// 工作调整-审批 , 驳回 , 作废
export const vehicleUseRegistrationOperation = data => post ('/administer/vehicleRegistration/approveOrRejectOrCancelled', data)

// 车辆使用登记-通过id删除
export const delVehicleUseRegistration = data => deleteData ('/administer/vehicleRegistration/delete', data)

// 车辆使用登记-批量删除
export const deleteBatchVehicleUseRegistration = data => deleteData ('/administer/vehicleRegistration/deleteBatch', data)

// 车辆使用登记-审核,反审核
export const reviewVehicleUse = data => get ('/administer/vehicleRegistration/checkOrAgainst', data)

// 车辆使用登记-查询所有数据
export const getVehicleUseRegistration = data => get ('/administer/vehicleRegistration/listAll', data)



