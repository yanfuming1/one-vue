import {get,post,putData,deleteData} from "../../../plugin/axios";


// 到账资金认定-分页列表查询
export const getFinanceFundFeterminationList = data => get ('/finance/accountFund/queryPageList', data)

// 到账资金认定-模糊-分页列表查询
export const getFinanceFundFeterminationPage = data => get ('/finance/accountFund/queryPageList', data)

// 到账资金认定-分页列表查询
export const getFinanceFundList = data => get ('/finance/accountFund/list', data)

// 到账资金认定-新增
export const getFinanceFundFeterminationAdd = data => post ('/finance/accountFund/add', data)

// 到账资金认定-修改
export const getFinanceFundFeterminationEdit = data => putData ('/finance/accountFund/edit', data)

// 到账资金认定-删除
export const getFinanceFundFeterminationDel = data => deleteData ('/finance/accountFund/deleteBatch', data)
// 到账资金认定-获取新增下拉框信息
export const getGoAdd = data => get ('/finance/accountFund/goAdd', data)
// 到账资金认定-获取新增下拉框信息
export const registerListAll = data => get ('/system/bankAccount/registerListAll', data)

// 到账资金认定-通过id查询
export const goDetail = data => get ('/finance/accountFund/goDetail', data)

// 到账资金认定-上传
export const importExcel = data => post ('/finance/accountFund/uploadFilesToTemp?importway='+ data.importway +'&id='+ data.id + '&companyId=' + data.companyId + '&companyName=' + data.companyName + '&departmentId=' + data.departmentId + '&departmentName=' + data.departmentName, data.data)
// export const importExcel = data => post ('/finance/accountFund/importExcel', data)

export const uploadAjx = data => post ('/file/upload', data)

// 到账资金认定-资金类型
export const queryAccount = data => get ('/finance/accountFund/queryAccount', data)

// 到账资金认定-资金类型
export const goAffirm = data => get ('/finance/accountFund/goAffirm', data)

// 到账资金认定-认定
export const affraimFun = data => post ('/finance/accountFund/affraim', data)

// 到账资金认定-上传附件
export const upLoad = data => post ('/finance/accountFund/upLoad', data)

// 联营项目-分页列表查询某个联营人的
export const associatedProjects = data => get ('/joint/jointProject/associatedGetProjectEntry/'+ data)

// 到账资金认定-审核
export const checkAccountFund = data => put('/finance/accountFund/check', data)
// 到账资金认定-反审核
export const againstAccountFund = data => put('/finance/accountFund/against', data)
// 撤销
export const capitalWithdrawAccountFund = data => get('/finance/accountFund/capitalWithdraw', data)