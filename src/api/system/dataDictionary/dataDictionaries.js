import {get,post,deleteData} from "../../../plugin/axios";

// 字典项-分页列表查询(搜索)
export const dataDictionariesList = data => get('/system/dictionary/list', data)

// /system/dictionary/queryTree 字典项-获取树状结构
export const dataDictionariesTree = data => get('/system/dictionary/queryTree', data)

// 根据id获取字典项数据
export const getDictionaryQueryById = id => get ('/system/dictionary/findById', id)