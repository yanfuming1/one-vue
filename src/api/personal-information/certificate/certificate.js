import {get, post, deleteData, putData} from "../../../plugin/axios";

// /administer/certificate/add  证书管理-添加
export const certificateAdd = data => post('/administer/certificate/add', data)

// /administer/certificate/queryListByUserId 证书管理-当前登录人的所拥有的全部证书
export const cerQueryByUserId = data => get('/administer/certificate/queryListByUserId', data)

// /administer/certificate/edit  证书管理-编辑
export const certificateEdit = data => putData('/administer/certificate/edit', data)

// /administer/certificate/queryById  证书管理-通过id查询
export const cerQueryById = data => get('/administer/certificate/queryById', data)

// /system/DEUCommon/getDRUCommonByUserIds  参数List,String为用户id，返回相对应id的用户信息，数据List, name
export const getCommonInfoByUserIds = data => get('/system/DEUCommon/getDRUCommonByUserIds', data)
