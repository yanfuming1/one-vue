import {get, post, putData, deleteData} from "../../../plugin/axios";

// 系统管理 - 打印模板-添加
export const addPrintTemplate = data => post ('/system/print/add', data)

// 系统管理 - 打印模板-通过id删除
export const deletePrintTemplate = id => deleteData ('/system/print/delete', id)

// 系统管理 - 打印模板-编辑
export const editPrintTemplate = data => putData ('/system/print/edit', data)

// 系统管理 - 打印模板-分页搜索
export const getPrintTemplateList = data => get ('/system/print/searchPageList', data)

// 系统管理 - 打印模板-通过id查询
export const getPrintTemplateQueryById = id => get ('/system/print/queryById', id)

// 系统管理 - 打印模板-通过页面编码查询打印模板页面
export const getPrintTemplateQueryByCode = code => get ('/system/print/queryByTableCode', code)

// 系统管理 - 打印模板-通过页面编码查询对应表的字段名和备注
export const getPrintTemplateQueryByTableCode = code => get (`/system/print/getField`, code)

// 系统管理 - 打印模板-通过页面编码和数据id 获取整理好的数据
export const getPrintTemplateInfoByCodeAndBusiness = data => get ('/system/print/printInfo', data)