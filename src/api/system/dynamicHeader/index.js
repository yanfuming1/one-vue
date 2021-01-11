import {get, post, putData, deleteData} from "../../../plugin/axios";

// 添加动态表头
export const addDynamicHeader = data => post ('/system/dynamicHeader/add', data)

// 获取动态表头
export const getDynamicHeader = id => get ('/system/dynamicHeader/queryById', id)

// 删除动态表头
export const deleteDynamicHeader = id => deleteData ('/system/dynamicHeader/delete', id)