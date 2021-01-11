import {get, post, deleteData, putData} from "../../plugin/axios";

// 证书管理
// /administer/certificate/list  证书管理-分页列表查询
export const getDocumentList = data => get('/administer/credential/list',data)

// /administer/credential/add  证书添加
export const credentialAdd = data => post('/administer/credential/add',data)

// /administer/credential/deleteBatch 证书批量删除
export const credentialDel = data => deleteData('/administer/credential/deleteBatch',data)

// /administer/credential/queryById 通过id查询
export const cerQueryById = data => get('/administer/credential/queryById',data)

// /administer/credential/edit 证书编辑
export const cerEdit = data => putData('/administer/credential/edit',data)

// /administer/credentialLoan/notFlowAdd 不走流程的证书借用
export const  borrowRecordNoFlow = data => post('/administer/credentialLoan/notFlowAdd',data)

// /administer/credentialLoan/add 走流程的证书借用
export const  borrowRecordUseFlow = data => post('/administer/credentialLoan/add/' + data.pdfId, data.credentialLoanList)

// /administer/credentialLoan/submit  证书借用申请-提交
export const  borrowRecordSubmit = data => post('/administer/credentialLoan/submit',data)

// /administer/credentialLoan/approveOrRejectOrCancelled  证书借用申请-审批 , 驳回 , 作废
export const  borrowRecordOperation = data => post('/administer/credentialLoan/approveOrRejectOrCancelled',data)

// /administer/credentialLoan/queryDetailsByIds 证书借用记录-通过ids查询该流程的详情
export const credentialLoanQueryDetailsByIds = data => get('/administer/credentialLoan/queryDetailsByIds',data)

// /administer/credential/searchList 关键字搜索
export const  borrowSearch = data => get('/administer/credential/searchList',data)

// /administer/credential/getAllByType	证书管理-根据证书类型获取该证书下的所有证件信息
export const cerGetAllByType = data => get('/administer/credential/getAllByType',data)

// 挂靠费用
// 挂靠费用分页列表
export const payRecordList = data => get('/administer/reliantFeeRegister/list',data)

// 挂靠费用添加
export const payRecordAdd = data => post('/administer/reliantFeeRegister/add',data)

// 批量删除
export const  delPayRecord = data => deleteData('/administer/reliantFeeRegister/deleteBatch',data)

// 挂靠费登记-通过id查询
export const  payRecordQueryById = data => get('/administer/reliantFeeRegister/queryById',data)

// /system/bankAccount/exceptUserAccount 银行账号-获取除员工账号以外的所有账号信息
export const getExceptUserAccount = data => get('/system/bankAccount/exceptUserAccount',data)

// 分页搜索
export const payRecordSearch = data => get('/administer/reliantFeeRegister/search',data)

// 证书借用申请-提交
export const payRecordSubmit = data => post('/administer/reliantFeeRegister/submit',data)

// 证书借用申请-审批 , 驳回 , 作废
export const payRecordOperation = data => post('/administer/reliantFeeRegister/approveOrRejectOrCancelled',data)


// 证书借用记录
// 证书借用分页列表
export const borrowRecordList = data => get('/administer/credentialLoan/list',data)

// 证书归还
export const certificateGiveBack = data => post('/administer/credentialLoan/giveBack',data)

// 搜索
export const borrowRecordSearch = data => get('/administer/credentialLoan/search',data)

// 证书借用登记
export const cerBorrowRegister = data => post('/administer/borrowRegister/add',data)


// 公司证书管理
// 添加
export const companyCerAdd = data => post('/administer/corporationCharter/add',data)

// 获取列表
export const companyCerList = data => get('/administer/corporationCharter/list',data)

// 通过id查证书
export const companyCerQuery = data => get('/administer/corporationCharter/queryById',data)

// 编辑
export const companyCerEdit = data => putData('/administer/corporationCharter/edit',data)

// 批量删除
export const  companyCerDel = data => deleteData('/administer/corporationCharter/deleteBatch',data)

// 搜索
export const companyCerSearch = data => get('/administer/corporationCharter/search',data)

// 公司证书借用记录
// 获取公司证书借用记录
export const companyRecordList = data => get('/administer/charterLoan/list',data)

// 公司证书借用记录分页搜索
export const companyRecordSearch = data => get('/administer/charterLoan/search',data)

// 公司证书借用申请
export const companyBorrowAdd = data => post('/administer/charterLoan/add/' + data.pdfId, data.credentialLoanList)

// 公司证书借用记录-通过id查询
export const companyRecordQueryById = data => get('/administer/charterLoan/queryById',data)

// 证书借用记录-通过ids查询该流程的详情
export const cRecordQueryDetailsByIds = data => get('/administer/charterLoan/queryDetailsByIds',data)

// 公司证书借用记录-提交
export const companyBorrowSubmit = data => post('/administer/charterLoan/submit', data)

// 证书借用申请-审批 , 驳回 , 作废
export const companyBorrowOperation = data => post('/administer/charterLoan/approveOrRejectOrCancelled', data)

// 公司证书借用记录-归还
export const companyBorrowGiveBack = data => post('/administer/charterLoan/giveBack', data)

// 运行中的流程-查询当前用户可启动的流程
export const listByStartCrew = data => get('/flow/modelSynopsis/listByStartCrew', data)

// 流程图-通过流程实例ID查询
export const nodeInfoStartByPiId = data => get('/flow/nodeInfo/listByPiId/' + data)

// 流程图-通过流程定义id查询
export const nodeInfoStartCrew = data => get('/flow/nodeInfo/list/' + data)

// 流程任务-一个流程的流转记录
export const tracePageList = data => get('/activiti/task/tracePage/' + data, data)

// 任务附加信息-列表查询
export const taskSubjoinList = data => get('activiti/taskSubjoin/list', data)

// 驻外机构
// /administer/adminOverseasInstitutions/list 驻外机构-分页列表查询
export const constituentCompanyList = data => get('/administer/adminOverseasInstitutions/searchPageList', data)

// /administer/adminOverseasInstitutions/delete  删除
export const constituentCompanyDel = data => deleteData('/administer/adminOverseasInstitutions/delete', data)

// /administer/adminOverseasInstitutions/goAdd 获取数据
export const constCompanyInfo = data => get('/administer/adminOverseasInstitutions/goAdd', data)

// /administer/adminOverseasInstitutions/deleteBatch 批量删除
export const constCompanyDeleteBatch = ids => deleteData ('/administer/adminOverseasInstitutions/deleteBatch', ids)

// /administer/adminOverseasInstitutions/add 添加
export const constCompanyAdd = data => post ('/administer/adminOverseasInstitutions/add', data)

// /administer/adminOverseasInstitutions/queryById 	驻外机构-通过id查询
export const getConstCompanyQueryById = id => get ('/administer/adminOverseasInstitutions/queryById', id)

// /administer/adminOverseasInstitutions/edit 编辑
export const editConstCompany = data => putData ('/administer/adminOverseasInstitutions/edit', data)

// 根据流程任务id 获取所有节点
export const getFindWalkRoute = id => get ('/flow/nodeInfo/findWalkRoute/' + id)

// 根据流程定义id 获取所有节点
export const getFindWalkRouteByApply = id => get ('/flow/nodeInfo/findWalkRouteByApply/' + id)

// /system/staff/getDepNameAndIdByUserId  查询职员所在的部门id和name
export const getDepNameAndIdByUserId = data => putData ('/system/staff/getDepNameAndIdByUserId', data)

// 作废和转出
export const updataOutOrCancellation = data => get ('administer/credential/outOrCancellation', data)