
import {get,post,deleteData} from "../../../plugin/axios";

// 登录日志-分页列表查询
export const loginLog = data => get('/system/list', data)

// 登录日志-通过id删除
export const loginLogDelete = data => deleteData('/system/delete' ,data,)

// 登录日志-批量删除
export const delAll = data => deleteData('/system/deleteBatch',data,)

// 登录日志-通过id查询
export const search = data => get('/system/log/queryById', data,)

// 登录日志-分页列表查询自己的
export const loginPaging = data => get('/system/listByUserId',data )
