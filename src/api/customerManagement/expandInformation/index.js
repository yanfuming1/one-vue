import {get,post,putData,deleteData} from "../../../plugin/axios";

// 获取扩展信息表，项目字典标表-分页列表查询
export const getCustomerDictionaryList = () => get ('/customer/customerDictionary/queryTree')

// 扩展信息表，项目字典标表-通过id查询
export const getCustomerDictionaryQueryById = id => get ('/customer/customerDictionary/pageQuery', id)

// 扩展信息表，项目字典标表-批量删除
export const deleteCustomerDictionarySon = ids => deleteData ('/customer/customerDictionary/deleteBatch', ids)

// 扩展信息表，项目字典标表-添加
export const addCustomerDictionary = data => post ('/customer/customerDictionary/add', data)

// 扩展信息表，项目字典标表-修改
export const updataCustomerDictionary = data => putData ('/customer/customerDictionary/edit', data)

// 扩展信息表-模糊-分页列表查询
export const getCustomerDictionaryPageList = id => get ('/customer/customerDictionary/pageList', id)

// 查询字典项ID在联营和甲方客户授权表的数据
export const getCustomerDictionaryTocustomerAuthorization = id => get ('/customer/customerDictionary/pageListAll', id)

// 扩展信息表，项目字典标表-通过ids查询
export const getCustomerDictionaryListQueryByIds = ids => get ('/customer/customerDictionary/queryList', ids)