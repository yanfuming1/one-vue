import {get, post, deleteData, putData} from "../../../plugin/axios";

// 表单管理-查询结构并分页查询子项
export const formManagementTree = data => get('/from/fromManage/queryPageSubitem',data)

// 表单管理-添加
export const formManagementAdd = data => post('/from/fromManage/add',data)

// 编辑
export const formManagementEdit = data => putData('/from/fromManage/edit',data)

// 表单管理-通过id查询
export const formManagementQueryId = data => get('/from/fromManage/queryById',data)

// 表单管理-分页列表查询
export const formManagementList = data => get('/from/fromManage/list',data)

// 表单管理-通过id删除
export const delectFormId = data => deleteData('/from/fromManage/delete',data)

// /from/fromManage/saveFrom  表单管理-保存表单
export const formSaveData = data => post('/from/fromManage/saveFrom',data)

// /from/fromManage/getJsonById  表单管理-根据表单编码 获取该表单的json
export const formGetJson = data => get('/from/fromManage/getJsonById',data)

// 表单管理-获取所有表单的 id, name, code , title
export const formGetAll = () => get ('/from/fromManage/getAllFrom')

// /from/fromManage/deleteBatch  批量删除
export const deleteAll = data => deleteData('/from/fromManage/deleteBatch',data)

//  /from/fromManage/getAllBasis 表单管理-获取所有基础模块表单 id, name
export const getAllBasis = () => get ('/from/fromManage/getAllBasis')

// /from/fromManage/getAllBaseFrom 表单管理-获取流程基础节点表单 id, name, code , title
export const getAllBaseFrom = () => get ('/from/fromManage/getAllBaseFrom')

// /from/fromManage/getAllFromByBase 	表单管理-根据基础节点表单id 获取子节点的 id, name, code , title
export const getAllFromByBase = id => get ('/from/fromManage/getAllFromByBase', id)

// 流程图选择基础表单树状结构
export const getAllFromManageToTree = () => get ('/from/fromManage/queryTree')