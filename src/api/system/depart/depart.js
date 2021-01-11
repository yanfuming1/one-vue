import {get} from "../../../plugin/axios";

export const GetDepart = data =>  get('/system/department/queryDerDictionaryByUserId', data)

// 部门-搜索
export const getUserDepartById = data =>  get('/system/department/queryDepartmentByUserId', data)

// 根据员工ID查询员工所在的工作单位和部门
export const getUnitAndDepartmentByUserId = data =>  get('/system/department/getUnitAndDepartment', data)

// 查询组织字典项 返回组织名称和 组织id
export const getCompanyByUserId = data =>  get('/system/department/queryOrganizationDic', data)

// 根据组织 id 查询该组织下的机构
export const getOrganizationByCompanyId = data =>  get('/system/department/queryOrganizationById', data)

// 查询总公司所有机构字典项 返回机构名称和 机构id
export const getCompanyDepDic = data =>  get('/system/department/queryOrgDictionary', data)

// 根据用户id 返回组织名称和组织id 和 职位名称
export const getCompanyAndPosition = data =>  get('/system/department/queryOrganizationAndPosition', data)

// system/department/listAll
export const getCompanyListAll = data =>  get('system/department/listAll', data) 
export const getCompanyQueryTree = data =>  get('system/department/queryTree', data) 