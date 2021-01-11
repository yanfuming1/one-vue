import {get,post,deleteData} from "../../../plugin/axios";

// 操作日志-搜索
export const operationalLog = data => get('/system/log/list', data)

// 操作日志-通过id删除
export const operationalLogDelete = data => deleteData('/system/log/delete',data,)

// 操作日志-批量删除
export const delAll = data => deleteData('/system/log/deleteBatch',data,)

// 操作日志-通过id查询
export const operationalSearch= data => get('/system/log/queryById',data )

// 操作日志-分页列表查询
export const operationalPaging = data => get('/system/log/listAll',data )