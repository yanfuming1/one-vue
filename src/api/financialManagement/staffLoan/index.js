import {get,post,putData,deleteData} from "../../../plugin/axios";

// 员工借款申请-分页列表查询
export const getTableList = data => get ('/finance/employeeBorrow/queryPageList', data)
// 项目内部接口-同上
export const getSelfTableList = data => get ('/self/finance/employeeBorrow/queryPageList', data)

// 员工借款申请-新增
export const getTableAdd = data => post ('/finance/employeeBorrow/add', data)
// 项目内部接口-同上
export const getSelfTableAdd = (data,id) => post ('/self/finance/employeeBorrow/add/' + id, data )

// 员工借款申请-户名
export const goAdd = data => get ('/finance/employeeBorrow/goAdd', data)

// 员工借款申请-提交
export const submitFun = data => post ('/finance/employeeBorrow/submit', data)
export const submitSelfFun = (data,id) => post ('/self/finance/employeeBorrow/submit/' + id, data)

// 员工借款申请-修改之后的提交
export const updateAfterSubmit = data => post ('/finance/employeeBorrow/updateAfterSubmit', data)
export const updateSelfAfterSubmit = (data,id) => post ('/self/finance/employeeBorrow/updateAfterSubmit/' + id, data)

// 员工借款申请-同意
export const completeFun = data => post ('/finance/employeeBorrow/complete', data)

// 员工借款申请-核销查询
export const queryById = data => get ('/finance/employeeBorrow/queryById', data)

// 员工借款申请-反审核
export const getAgainst = data => putData ('/finance/employeeBorrow/against', data)

// 员工借款申请-审核
export const getCheck = data => putData ('/finance/employeeBorrow/check', data)

// 员工借款申请-核销
export const getVerificationAdd = data => post ('/finance/employeeBorrow/verification', data)
export const getSelfVerificationAdd = (data,id) => post ('/self/finance/employeeBorrow/verification/' + id, data)

// 员工借款申请-核销记录
export const goDetail = data => get ('/finance/employeeBorrow/goDetail', data)

// 员工借款申请-修改
export const goEdit = data => putData ('/finance/employeeBorrow/edit', data)

// /flow/modelSynopsis/listByStartCrew 运行中的流程-查询当前用户可启动的流程
export const listyBstaffLoan = data => get('/flow/modelSynopsis/listByStartCrew', data)

// /flow/nodeInfo/list/{pdfId} 流程图-通过流程定义id查询

export const nodeInfoStartCrew = data => get('/flow/nodeInfo/list/' + data)

// 银行账号-根据账号类型获取该账号下的所有银行账号信息
export const getByAccountTypeListAll = data => get ('/system/bankAccount/getByAccountTypeListAll', data)

// 银行账号-根据账号类型获取该账号下的所有银行账号信息
export const getByAccountTypeOther = data => get ('/system/bankAccount/getByAccountTypeOther', data)

// 银行账号
export const bankQueryPageList = data => get ('/system/bankAccount/list', data)

// 校验信息
export const queryByAccount = data => get ('/system/bankAccount/queryByAccount', data)

// 校验信息
export const collection = data => post ('/system/bankAccount/collection', data)
// 校验信息
export const queryByParentId = data => get ('/system/permission/queryByParentId', data)

// 银行账号-根据联营人id获取联营所有账号信息
export const getByAccountByAssociatedId = data => get ('/system/bankAccount/getAccountByAssociatedId', data)

// 银行账号-获取除员工账号以外的所有账号信息
export const getByAccountExceptUserAccount = data => get ('/system/bankAccount/exceptUserAccount', data)

// 银行账号-根据账号类型获取该账号下的所有银行账号信息
export const activitiPage = data => get ('/activiti/process/page', data)

// 对外贷款审批-删除
export const deleteRow = data => deleteData ('/finance/employeeBorrow/delete', data)
export const deleteSelfRow = (data, id) => deleteData ('/self/finance/employeeBorrow/delete/' +id , data)

// 对外贷款审批-删除
export const deleteBatch = data => deleteData ('/finance/employeeBorrow/deleteBatch', data)
export const deleteSelfBatch = (data,id) => deleteData ('/self/finance/employeeBorrow/deleteBatch/' + id, data)

// 对外贷款审批-状态
export const queryByState = data => get ('/finance/employeeBorrow/queryByState', data)
