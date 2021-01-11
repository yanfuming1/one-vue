import {get, post, deleteData, putData} from "../../plugin/axios";

// 网盘查询
export const personalTable = data => get('/resmanage/resourceManage/searchPageListPer', data)

// 添加文件夹 
export const personalCreateFolder = data => post('/resmanage/resourceManage/addperson', data)

// 获取树结构 
export const personalTree = data => get('/resmanage/resourceManage/queryTreePer', data)