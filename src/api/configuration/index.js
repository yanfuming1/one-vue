import {get,post,putData,deleteData} from "../../plugin/axios";
// 查询
export const searchPageList = data => get ('/system/configuration/confList', data)
// 新增
export const addList = data => post ('/system/configuration/add', data)
// 修改
export const editList = data => putData ('/system/configuration/edit', data)
// 通过id查询数据
export const configQueryById = data => get ('/system/configuration/queryById', data)
// 保存
export const updateConfiguration = data => putData ('/system/configuration/updateConfiguration', data)
// 数据库备份
export const backup = data => get ('/backup', data)
// 数据库恢复
export const recover = data => get ('/recover', data)
// 查询是否开启线上编辑
export const fileOnlineView = data => get ('/system/fileOnline/queryById', data)
// 修改是否开启线上编辑
export const fileOnlineViewEdit = data => putData ('/system/fileOnline/edit', data)