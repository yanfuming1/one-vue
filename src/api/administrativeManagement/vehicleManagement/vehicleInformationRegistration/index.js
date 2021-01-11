import { get, post, putData, deleteData} from "../../../../plugin/axios";

// 车辆信息登记-分页搜索
export const informationRegistrationList = data => get ('/administer/vehicleInformation/searchPageList', data)

// 车辆信息登记-添加
export const addVehicleInformation = data => post ('/administer/vehicleInformation/add', data)

// 车辆信息登记-通过id查询
export const vehicleInformationQueryById = data => get ('/administer/vehicleInformation/queryById', data)

// 车辆信息登记-编辑
export const editVehicleInformation = data => putData ('/administer/vehicleInformation/edit', data)

// 	车辆信息登记-通过id删除
export const delVehicleInformation = data => deleteData ('/administer/vehicleInformation/delete', data)

// 车辆信息修改记录-根据当前登录人的ID和车辆信息ID查询数据
export const historyFuelConsumption = data => get ('/administer/vehicleAmendantRecord/list', data)
