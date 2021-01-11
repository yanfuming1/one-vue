import {get,post,putData,deleteData} from "../../../plugin/axios";

// 添加入职登记
export const addEntryRegistration = data => post ('/hr/entry/add', data)

// 根据userid获取入职登记信息
export const getEntryRegistrationQueryById = id => get ('/hr/entry/queryById', id)

// 入职登记-分页搜索
export const enrollmentListSeach = data => get('/hr/entry/searchPageList', data)

// 	入职登记-编辑
export const editEnrollment = data => putData('/hr/entry/edit', data)

//  入职登记-审核反审核
export const checkOrAgainstPersonnel = data => get ('/hr/entry/checkOrAgainst', data)