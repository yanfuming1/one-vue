import {get, post, deleteData, putData} from "../../../plugin/axios";

// /system/dictionary/queryTree 字典项-获取树状结构
export const GetDictionaryTree = data => get('/system/dictionary/queryTree', data)

// /system/dictionary/add 字典项-添加
export const addDictionary = data => post('/system/dictionary/add', data)

// /system/dictionary/edit  字典项-编辑
export const editDictionary = data => putData('/system/dictionary/edit', data)

// /system/dictionary/deleteBatch  字典项-批量删除
export const delDictionary = data => deleteData('/system/dictionary/deleteBatch', data)

// /system/dictionary/list  字典项-分页列表查询(搜索)
export const queryDicPage = data => get('/system/dictionary/list', data)

// /system/dictionary/pageQuery 根据字典项分类id ,分页获取该分类有的字典项
export const queryDicPageById = data => get('/system/dictionary/pageQuery', data)

// /system/dictionary/findById  字典项-通过id查询 查询此项的所有子项
export const queryDicById = data => get('/system/dictionary/findById', data)

// /system/dictionary/queryChildByIds 根据前端传的id集合进行查询id对应的子类
export const queryDicByIds = ids => post ('/system/dictionary/queryChildByIds', ids)