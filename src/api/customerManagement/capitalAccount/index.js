import {get,post,putData,deleteData} from "../../../plugin/axios";

//           ------ 资金账户 - 总资金 ------

// 资金账户的总资产的贷款信息-分页列表查询
export const loanInformationList = data => get ('/joint/marginPayment/loans',data)

//           ------ 资金账户 - 账户 ------

// 联营人资金池-通过联营人cusId查询
export const poolOfJointVentureFunds = data => get ('/customer/customerCapitalPool/getCusById',data)

// /customer/customerCapitalPool/edit
// 联营人资金池-添加
export const editItionOfFundPool = data => putData ('/customer/customerCapitalPool/edit',data)

//  联营人资金池-从项目上提现到资金池
export const cashWithdrawalApi = data => putData ('customer/customerCapitalPool/editupdateExtract',data)

// 联营项目-分页列表查询某个联营人的
export const associatedProjects = data => get ('/joint/jointProject/associatedGetProjectEntry/'+ data)

// 	联营项目-联营人查看我所有项目的资金总和
export const projectFunds = data => get ('/joint/jointProject/associatedMoneyTotal', data)

// 银行账号-联营人获取我的账号列表信息
export const capitalAccountList = data => get ('/system/bankAccount/JointList',data)

// Summary	银行账号-设置联营人的银行账号为主卡
export const setAccountMasterCard = data => get('/system/bankAccount/jointSetCard', data)

//	银行账号-添加联营人账号
export const addCapitalAccount = data => post ('/system/bankAccount/addJoint', data)

// 资金账户中的账户信息-编辑
export const editCapitalAccount = data => post('/system/bankAccount/edit',data)

// 资金账户中的账户信息-删除
export const delCapitalAccount = data => get('/system/bankAccount/del',data)


// 联营人转账记录-根据cusId查询转账记录
export const capitalFlowInformation = data => get('/customer/customerTransferRecord/selectByCusId',data)

// 联营人转账记录-分页搜索
export const capitalFlowInformationSearchPageList = id => get ('/customer/customerTransferRecord/searchPageList', id)

// 联营项目-客户管理里获取项目资金
export const getProjectCapitalAccount = data => get ('/joint/jointProject/projectCapital/' + data.associatedPersonId, data)

// 客户管理 - 提现-添加 
export const addCashWithdrawal = data => post ('/customer/withdrawDeposit/add', data)

// 客户管理 - 提现-批量删除
export const deleteBatchCashWithdrawal = ids => deleteData ('/customer/withdrawDeposit/deleteBatch', ids)

// 客户管理 - 提现-编辑 
export const editCashWithdrawal = data => putData ('/customer/withdrawDeposit/edit', data)

//  客户管理 - 提现 - 分页搜索
export const getCashWithdrawalPageList = data => get ('/customer/withdrawDeposit/searchPageList', data)

// 客户管理 - 提现-通过id查询
export const getCashWithdrawalById = id => get ('/customer/withdrawDeposit/queryById', id)

// 客户管理 - 提现-审批 , 驳回 , 作废
export const completeCashWithdrawal = data => post ('/customer/withdrawDeposit/approveOrRejectOrCancelled', data)

// 客户管理 - 提现-审核,反审核
export const checkAgainstCashWithdrawal = data => get ('/customer/withdrawDeposit/checkOrAgainst', data)

// 客户管理 - 提现-提交流程接口
export const submitCashWithdrawal = data => post ('/customer/withdrawDeposit/submit', data)

// 客户管理 - 提现-重新提交流程接口
export const resetSubmitCashWithdrawal = data => post ('/customer/withdrawDeposit/resubmit', data)
// 贷款信息
// export const loanInformationList = data => get ('/joint/marginPayment/loans', data)

// 查询未绑定联营人的银行账户
export const getNotBoundList = data => get ('/system/bankAccount/notBoundList', data)
