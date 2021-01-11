import {get, post, deleteData, putData} from "../../plugin/axios";

// /joint/jointProjectReserve/list  联营项目-分页列表查询
export const getJointProList = data => get('/joint/jointProjectReserve/list',data)

// /joint/jointProjectReserve/searchPageList 分页搜索
export const getJointProSearch = data => get('/joint/jointProjectReserve/searchPageList',data)

// /joint/jointProjectReserve/add  预定登记添加
export const jointProAdd = data => post('/joint/jointProjectReserve/add', data)

// /customer/customer/selectCustomer 客户信息表 查询所有联营客户
export const allCustomerList = data => get('/customer/customer/selectCustomer', data)

// /joint/jointProjectReserve/queryById  预定登记-通过id查询
export const jointQueryById = data => get('/joint/jointProjectReserve/queryById', data)

// /joint/jointProjectReserve/edit  预定登记-编辑
export const jointProEdit = data => putData('/joint/jointProjectReserve/edit', data)

// /joint/jointProject/searchPageList  联营项目-分页搜索
export const jointSearchList = data => get('/joint/jointProject/searchPageList', data)

// /customer/contactInfo/queryForList 联营人联系人的信息-通过id查询跟联营人相关的联系人
export const jointContactListById = data => get('/customer/contactInfo/queryForList', data)

// /customers/customers/selectCustomer 获取甲方信息
export const getOwnerList = data => get('/customers/customers/selectCustomer', data)

// /joint/jointProject/list 全部项目
export const getAllProList = data => get('/joint/jointProject/list',data)

// /joint/jointJurisdiction/share   权限设置-共享
export const shareProject = data => get('/joint/jointJurisdiction/share',data)

// /joint/jointJurisdiction/lookShare  权限设置-查看共享
export const lookShareProject = data => get('/joint/jointJurisdiction/lookShare',data)

// /joint/jointJurisdiction/cancelShare  权限设置-取消共享
export const cancelShareProject = data => get('/joint/jointJurisdiction/cancelShare',data)

// /joint/jointProject/add  添加
export const jointProectAdd = data => post('/joint/jointProject/add', data)

// /joint/jointProject/deleteBatch 批量删除
export const jointDeleteBatch = data => deleteData('/joint/jointProject/deleteBatch', data)

// /joint/jointProject/queryById 通过id查询
export const getProById = data => get('/joint/jointProject/queryById',data)

// /joint/jointProject/edit/{id}  编辑
export const getProEdit = data => post('/joint/jointProject/edit/' + data.id, data.jointProject)
// /joint/jointProject/submit/{id}  提交

export const getProSubmit = data => post('/joint/jointProject/submit', data)

// /joint/jointProjectApply/queryById 报名登记查询
export const getProApplyById = data => get('/joint/jointProjectApply/queryById',data)

// 	/customer/contactInfo/queryForList  联营人联系人的信息-通过id查询跟联营人相关的联系人
export const contactInfoForList = data => get('/customer/contactInfo/queryForList',data)

// /joint/jointProject/createList  联营项目-分页列表查询我创建的
export const jointCreateList = data => get('/joint/jointProject/createList',data)

//  /joint/jointProject/attentionList  联营项目-分页列表查询我关注的
export const jointAttentionList = data => get('/joint/jointProject/attentionList',data)

//  /joint/jointScope/addOrCancelAttention  添加或取消我的关注
export const jointScopeAddOrCancelAttention = data => get('/joint/jointScope/addOrCancelAttention',data)

//  /joint/jointProject/responsibleList 联营项目-分页列表查询我负责的
export const jointResponsibleList = data => get('/joint/jointProject/responsibleList',data)

// /joint/jointProject/participationList  联营项目-分页列表查询我参与的
export const jointParticipationList = data => get('/joint/jointProject/participationList',data)


// /administer/credential/getAllByType 获取-根据证书类型获取该证书下的所有证件信息:五大员、A证、B证等
export const getCerInfoByType = data => get('/administer/credential/getAllByType',data)

// /administer/adminOverseasInstitutions/getCompany 联营-报名登记获取公司
export const getCerInfoCompany = data => get('/administer/adminOverseasInstitutions/getCompany',data)

// /joint/jointProjectApply/add/{id}  联营项目报名登记-编辑
export const signProEdit = data => post('/joint/jointProjectApply/edit/' + data.id, data.jointProjectApply)
// /joint/jointProjectApply/add/{id}  联营项目报名登记-提交
export const signProSubmit = data => post('/joint/jointProjectApply/submit/' + data.id, data.jointProjectApply)


// /joint/jointProjectOpen/queryById 联营项目开标登记-通过id查询
export const getProOpenById = data => get('/joint/jointProjectOpen/queryById',data)

// /joint/jointProjectOpen/edit/{id} 联营项目开标登记-编辑
export const getProOpenEdit = data => putData('/joint/jointProjectOpen/edit/' + data.id, data.jointProjectOpen)

// /joint/jointProjectOpen/submit/{id}   联营项目开标登记-提交流程接口
export const tenderOpenSubmit = data => post('/joint/jointProjectOpen/submit/' + data.id, data.jpo)

// /joint/jointProjectOpen/approveOrRejectOrCancelled
export const tenderOpenOperation = data => post('/joint/jointProjectOpen/approveOrRejectOrCancelled', data)


// /joint/tenderMake/queryById  标书制作-通过id查询
export const getTenderBookById = data => get('/joint/tenderMake/queryById',data)

// /joint/tenderMake/edit/{id} 标书制作-编辑
export const getTenderMakeEdit = data => putData('/joint/tenderMake/edit/' + data.id, data.tenderMake)

// /joint/tenderMake/approveOrRejectOrCancelled  	标书制作- 审批 , 驳回 , 作废
export const tenderMakeOperation = data => post('/joint/tenderMake/approveOrRejectOrCancelled', data)

// /joint/tenderMake/submit/{id}  标书制作-提交流程接口
export const tenderMakeSubmit = data => post('/joint/tenderMake/submit/' + data.id, data.tm)


// /joint/jointProjectApproval/queryById 联营项目立项登记-通过id查询
export const getProjectApprovalById = data => get('/joint/jointProjectApproval/queryById',data)

// /joint/jointProjectApproval/edit/{id}  联营项目立项登记-编辑
export const getProjectApprovalEdit = data => post('/joint/jointProjectApproval/edit/' + data.id, data)

// /joint/jointProjectApproval/submit/{id}   联营项目立项登记-提交流程接口
export const getProjectApprovalSubmit = data => post('/joint/jointProjectApproval/submit/' + data.id, data.jpj)

// /joint/jointProjectApproval/approveOrRejectOrCancelled  联营项目立项登记-审批 , 驳回 , 作废
export const getProjectApprovalOperation = data => post('/joint/jointProjectApproval/approveOrRejectOrCancelled', data)


// /joint/marginPayment/queryById  保证金缴纳申请-通过id查询
export const getMarginPaymentlById = data => get('/joint/marginPayment/queryById',data)

// /system/bankAccount/getByAccountTypeListAll  银行账号-根据账号类型获取该账号下的所有银行账号信息
export const getByAccountTypeListAll = data => get('/system/bankAccount/getByAccountTypeListAll',data)

// /joint/marginPayment/add/{id}  保证金缴纳申请-添加
export const marginPaymentAdd = data => post('/joint/marginPayment/add/' + data.projectId, data)

// /joint/marginPayment/jointSearch  保证金缴纳申请-分页搜索本项目中的保证金缴纳申请
export const marginPaymentSearch = data => get('/joint/marginPayment/jointSearch', data)

// /joint/marginPayment/edit/{id}  保证金缴纳申请-编辑
export const marginPaymentEdit = data => post('/joint/marginPayment/edit/' + data.projectId, data)

// /system/bankAccount/addPayment 银行账号-保证金缴纳申请收藏银行卡
export const cashAddPayment = data => post('/system/bankAccount/addPayment', data)

// /joint/marginPayment/deleteBatch/{id} 保证金缴纳申请-批量删除
export const marginPaymentDel = data => get('/joint/marginPayment/deleteBatch/' + data.id + '?ids=' + data.ids,)

// /joint/marginReturn/jointSearch  保证金退还-联营模块分页列表查询某一个项目的
export const marginReturntSearch = data => get('/joint/marginReturn/jointSearch', data)

// /finance/accountFund/queryList  到账资金登记-分页列表查询
export const accountFundQueryList = data => get('/finance/accountFund/queryPageList', data)

// /finance/accountFund/queryList  到账资金登记-分页列表查询
export const accountQueryList = data => get('/finance/accountFund/queryList', data)

// /joint/marginReturn/jointAdd/{id}  保证金退还-联营项目添加
export const marginReturnAdd = data => post('/joint/marginReturn/jointAdd/' + data.projectId, data)

// /joint/marginReturn/queryById 保证金退还-通过id查询
export const marginReturnQueryById = data => get('/joint/marginReturn/queryById', data)

// /joint/marginReturn/edit/{id}  保证金退还-编辑
export const marginReturnEdit = data => putData('/joint/marginReturn/edit/' + data.projectId, data)

// /joint/marginReturn/deleteBatch  保证金退还-批量删除
export const marginReturnDel = data => deleteData('/joint/marginReturn/deleteBatch/' + data.id + '?ids=' + data.ids,)

// /joint/marginPayment/checkOrAgainst  保证金缴纳申请-审核,反审核
export const marginCheckOrAgainst = data => get('/joint/marginPayment/checkOrAgainst', data)

// /joint/marginReturn/checkOrAgainst   保证金退还申请-审核,反审核
export const marginReturnCheckOrAgainst = data => get('/joint/marginReturn/checkOrAgainst', data)

// 流程
// /joint/marginPayment/submit/{id}   保证金缴纳申请-提交流程接口
export const marginPaymentSubmit = data => post('/joint/marginPayment/submit/' + data.id, data.marginPayment)


// 	/joint/marginPayment/approveOrRejectOrCancelled  保证金缴纳申请-审批 , 驳回 , 作废
export const marginPaymentOperation = data => post('/joint/marginPayment/approveOrRejectOrCancelled', data)

// /joint/marginReturn/submit/{id}  保证金退还申请-提交流程接口
export const marginReturnSubmit = data => post('/joint/marginReturn/submit/' + data.id, data.marginReturn)

// /joint/marginReturn/approveOrRejectOrCancelled 	保证金退还申请-审批 , 驳回 , 作废
export const marginReturnOperation = data => post('/joint/marginReturn/approveOrRejectOrCancelled', data)

// /system/bankAccount/addReturn  银行账号-保证金退还收藏联营人的银行卡
export const cashReturnBankAccount = data => post('/system/bankAccount/addReturn', data)


// /system/dictionary/findById  字典项-通过id查询 查询此项的所有子项
export const queryDicById = data => get('/system/dictionary/findById', data)

// /system/dictionary/findById  字典项-通过id查询 查询此项的所有子项
export const queryCostById = data => get('/joint/costConstitute/queryById', data)

// /system/dictionary/findById  字典项-通过id查询 查询此项的所有子项
export const editFun = data => putData('/joint/costConstitute/edit/' + data.id,data.jsonData)

// 	/joint/jointProject/getAllOptions  联营项目-获取所有联营项目上用到的所有下拉框数据
export const getProjectAllOptions = data => get('/joint/jointProject/getAllOptions', data)


// /joint/baseMsg/queryById  联营项目追加金额信息-通过id查询
export const getBaseMsgById = data => get('/joint/baseMsg/queryById', data)

// /joint/baseMsg/add/{id}  联营项目追加金额信息-添加
export const getBaseMsgAdd = data => post('/joint/baseMsg/add/' + data.id, data)

// 联营项目下拉选
export const getAllJointProject = () => get ('/joint/jointProjectApproval/getAllJointProject')

// 自营项目下拉选
export const getAllSelfProject = () => get ('/self/approval/approval/getAllSelfProject')


// 2020.06.10 新需求，增加保证金缴纳退还组织四要素，更换的接口

// 保证金退还-通过id查询 
export const getRefundById = data => get('/joint/marginReturn/elementQueryById', data)

// 保证金退还-联营项目添加
export const addRefundData = data => post('/joint/marginReturn/elementAdd/' + data.marginReturn.projectId, data)

// 保证金退还-编辑
export const editRefundData = data => putData('/joint/marginReturn/elementEdit/' + data.marginReturn.projectId, data)

// 保证金退还申请-提交流程接口
export const sumbitRefundData = data => post('/joint/marginReturn/elementSubmit/' + data.marginReturn.projectId, data)
// 财务获取联营项目的关联列表
export const getJointProjectTofinancial = () => get ('joint/jointProjectApproval/getUnifyProject')
