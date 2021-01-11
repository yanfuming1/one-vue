import {get} from "../../../plugin/axios";

export const GetDepartTree = data => get('/system/department/queryTree', data)

// 	部门-查询树状结构根据当前登录人
export const GetDepartTreeByLoginer = data => get('/system/department/queryTreeByUserId', data)

//  部门-查询树状结构
export const GetDepartTreeNew = data => get('/system/department/queryTree', data)
export const getDepartTreeByUserId = () => get ('/system/department/queryTreeByUserId')
