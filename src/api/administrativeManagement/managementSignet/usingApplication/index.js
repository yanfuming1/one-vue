import { get, post, putData, deleteData} from "../../../../plugin/axios";

// 用章申请-添加 
export const addUsingApplication = data => post ('/administer/adminUseapply/add', data)

// 用章申请-批量删除
export const deleteBatchUsingApplication = ids => deleteData ('/administer/adminUseapply/deleteBatch', ids)

// 用章申请-编辑 
export const editUsingApplication = data => putData ('/administer/adminUseapply/edit', data)

// 用章申请-分页列表查询
export const getUsingApplication = data => get ('/administer/adminUseapply/list', data)

// 用章申请-通过id查询
export const getUsingApplicationById = data => get ('/administer/adminUseapply/queryById', data)

// 用章申请-分页搜索
export const getUsingApplicationPageList = data => get ('/administer/adminUseapply/searchPageList', data)

// 用用章申请-提交
export const submitUsingApplication = data => post ('/administer/adminUseapply/submit', data)

// 印章申请-工作流完成	
export const accomplishUsingApplication = data => post ('/administer/adminUseapply/complete', data)

// 印章申请-审核
export const checkUsingApplication = data => putData ('/administer/adminUseapply/check', data)

// 印章申请-反审核
export const againstUsingApplication = data => putData ('/administer/adminUseapply/against', data)