import {get,post,putData,deleteData} from "../../../plugin/axios";

// 员工报销申请-分页列表查询
export const getTableList = data => get ('/finance/employeeReimburse/queryPageList', data)

// 员工报销申请-分页列表查询-新
export const getTableListNew = data => get ('/self/finance/employeeReimburse/queryPageList', data)

// 员工报销申请-通过id查询数据
export const queryById = data => get ('/finance/employeeReimburse/queryById', data)

// 员工报销申请-通过id查询数据复制
export const goCopy = data => get ('/finance/employeeReimburse/goCopy', data)

// 员工报销申请-通过id查询数据
export const dataAdd = data => post ('/finance/employeeReimburse/add', data)

// 新-员工报销申请-添加
export const dataAddNew = data => post ('/self/finance/employeeReimburse/add/' + data.projectCode, data)

// 员工报销申请 修改
export const getEdit = data => putData ('/finance/employeeReimburse/edit', data)

// 新-员工报销申请 修改
export const getEditNew = data => putData ('/self/finance/employeeReimburse/edit/' + data.projectCode, data)

// 员工报销申请-下拉框信息
export const goAdd = data => get ('/finance/employeeReimburse/goAdd', data)

// 员工报销申请-删除
export const setDelete = data => deleteData ('/finance/employeeReimburse/delete', data)

// 员工报销申请-删除-新
export const setDeleteNew = data => deleteData ('/self/finance/employeeReimburse/delete/' + data.projectCode, data)

// 员工报销申请-批量删除
export const deleteBatch = data => deleteData ('/finance/employeeReimburse/deleteBatch', data)

// 员工报销申请-批量删除-新
export const deleteBatchNew = data => deleteData ('/self/finance/employeeReimburse/deleteBatch/' + data.projectCode, data)

// 员工报销申请-提交
export const submit = data => post ('/finance/employeeReimburse/submit', data)

// 员工报销申请-提交
export const submitNew = data => post ('/self/finance/employeeReimburse/submit/' + data.projectCode, data)

// 员工报销申请-重新提交
export const updateAfterSubmit = data => putData ('/finance/employeeReimburse/editAfterSubmit', data)

// 员工报销申请-重新提交-新
export const updateAfterSubmitNew = data => putData ('/self/finance/employeeReimburse/editAfterSubmit/' + data.projectCode, data)

// 员工报销申请-流程 同意
export const complete = data => post ('/finance/employeeReimburse/complete', data)

// 对外付款申请-获取下拉框
export const goBank = data => get ('/finance/paymentApply/goBank', data)

// 员工报销申请-反审核
export const getAgainst = data => putData ('/finance/employeeReimburse/against', data)

// 员工报销申请-审核
export const getCheck = data => putData ('/finance/employeeReimburse/check', data)
// 员工报销申请-审核
export const rowDelete = data => deleteData ('/finance/employReimVice/delete', data)
