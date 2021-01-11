import {get, post, putData} from "../../../plugin/axios";

export const GetStaffByGroupId = data => get('/system/staff/listByDep', data)

// /system/department/queryStaffTree
export const GetStaffByGroupTree = data => get('/system/department/queryStaffTree', data)

// /system/position/getPositionDic
export const GetPositionDic = data => get('/system/position/getPositionDic', data)

// /system/staff/edit 编辑员工信息 post请求
export const staffEdit = data => post('/system/staff/edit', data)

// /system/staff/add 职员的添加
export const staffAdd = data => post('/system/staff/add', data)

// /system/staff/dimission 职员离职
export const staffDimission = data => get('/system/staff/dimission', data)

// /system/staff/listByDep 根据部门id 查询人员
export const staffListByDep = data => get('/system/staff/listByDep', data)

// /system/staff/queryStaffDictionary 查询职员字典项
export const staffStaffDictionary = data => get('/system/staff/queryStaffDictionary', data)

// /system/staff/list 通过公司查询人员
export const staffList = data => get('/system/staff/list', data)

// /system/staff/generateAccount 生成平台账号
export const staffGenerateAccount = data => get('/system/staff/generateAccount', data)

// /system/department/queryDepartmentByUserId 通过人员id查询所在的所有部门
export const queryDepartmentByUserId = data => get('/system/department/queryDepartmentByUserId', data)

// /system/staff/queryById 通过id获取职员
export const staffQueryById = data => get('/system/staff/queryById', data)

// /system/staff/page 职员模糊分页搜索
export const staffQueryPage = data => get('/system/staff/page', data)

// /system/staff/listAllByDep  职员-根据部门id分页查询查询本部门的所有职员
export const staffListAllByDep = data => get('/system/staff/listAllByDep', data)



// /system/staff/importExcel  职员-导入
export const importExcel = data => post('/system/staff/importExcel', data)

//  部门-根据员工ID 查询该员工所在的所有部门和职位
export const queryDepartmentAndPositionByUserId = data => get('/system/department/queryDepartmentAndPositionByUserId', data)

// 	职员-查询所有
export const getstaffListAll = () => get ('/system/staff/getAllJob')

