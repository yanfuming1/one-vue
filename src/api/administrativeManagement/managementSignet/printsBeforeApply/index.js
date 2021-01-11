import { get, post, putData, deleteData} from "../../../../plugin/axios";

// 刻章申请-添加 
export const addPrintsBeforeApply = data => post ('/administer/adminEngapply/add', data)

// 刻章申请-批量删除
export const deleteBatchPrintsBeforeApply = ids => deleteData ('/administer/adminEngapply/deleteBatch', ids)

// 刻章申请-编辑 
export const editPrintsBeforeApply = data => putData ('/administer/adminEngapply/edit', data)

// 刻章申请-分页列表查询
export const getPrintsBeforeApply = data => get ('administer/adminEngapply/list', data)

// 刻章申请-通过id查询
export const getPrintsBeforeApplyById = data => get ('/administer/adminEngapply/queryById', data)

// 刻章申请-分页搜索
export const getPrintsBeforeApplyPageList = id => get ('/administer/adminEngapply/searchPageList', id)

// 刻章申请-提交
export const submitPrintsBeforeApply = data => post ('/administer/adminEngapply/submit', data)

// 刻章申请-工作流完成	
export const accomplishPrintsBeforeApply = data => post ('/administer/adminEngapply/complete', data)

// 刻章申请-审核
export const checkPrintsBeforeApply = data => putData ('/administer/adminEngapply/check', data)

// 刻章申请-反审核
export const againstPrintsBeforeApply = data => putData ('/administer/adminEngapply/against', data)