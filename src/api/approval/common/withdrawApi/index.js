import{get,post,putData,deleteData} from "../../../../plugin/axios";

const withdrawApi = {};
// 财务模块-对外贷款审批撤回
withdrawApi.externalLloan = data=> get ('/finance/externalLloan/withdraw',data);

// 财务模块-营业外收入登记撤回
withdrawApi.takingRegister = data=> get ('/finance/takingRegister/withdraw',data);

// 财务模块撤回-员工借款申请撤回
withdrawApi.employeeBorrow = data=> get ('/finance/employeeBorrow/withdraw',data);

// 财务模块撤回-对外付款申请撤回
withdrawApi.paymentApply = data=> get ('/finance/paymentApply/withdraw',data);

// 财务模块撤回-员工报销申请撤回
withdrawApi.employeeReimburse = data=> get ('/finance/employeeReimburse/withdraw',data);

// 借阅申请-撤回
withdrawApi.withdrawArchiveRegistration = data => get ('/administer/adminFileLoan/chehui', data)

// 刻章申请-撤回
withdrawApi.withdrawPrintsBeforeApply = data => get ('/administer/adminEngapply/chehui', data)

// 用印申请-撤回 
withdrawApi.withdrawUsingApplication = data => get ('/administer/adminUseapply/chehui', data)
 
// 联营项目开标登记-撤回
withdrawApi.jointProjectOpenWithdraw = data => get('/joint/jointProjectOpen/withdraw', data);

// 联营项目标书制作-撤回
withdrawApi.tenderMakeWithdraw = data => get('/joint/tenderMake/withdraw', data);

// 联营项目立项登记-撤回
withdrawApi.jointProjectApprovalWithdraw = data => get('/joint/jointProjectApproval/withdraw', data);

// 联营项目保证金缴纳-撤回 
withdrawApi.jointProjectMarginPaymentWithdraw = data => get('/joint/marginPayment/withdraw', data);

// 联营项目保证金退还-撤回 
withdrawApi.marginReturnWithdraw = data => get('/joint/marginReturn/withdraw', data);

// 联营项目工程支付申请-撤回 
withdrawApi.projectPaymentWithdraw = data => get('/joint/projectPayment/withdraw', data);

// 联营项目代收代付-撤回 
withdrawApi.agentBusinessWithdraw = data => get('/joint/agentBusiness/withdraw', data);

// 发文登记-撤回
withdrawApi.withdrawPostRegistration = data => get ('/administer/adminSendFile/withdraw', data)

// 离职申请-撤回
withdrawApi.withdrawalWithdrawal = data => get ('/personnelmanagement/leaveOffice/withdraw', data)

// 辞退申请-撤回
withdrawApi.dismissalWithdrawal = data => get ('/personnelmanagement/dismiss/withdraw', data)

// 工作调整-撤回
withdrawApi.workAdjustmentWithdrawal = data => get ('/hr/workAccommodation/withdraw', data)

// 车辆使用登记-撤回
withdrawApi.vehicleUseApplicationWithdrawal = data => get ('/administer/vehicleRegistration/withdraw', data)

// 车辆报销申请-撤回
withdrawApi.vehicleReimbursementWithdrawal = data => get ('/administer/vehiclesReimbursement/withdraw', data)

// 挂靠费-撤回
withdrawApi.reliantFeeRegisterWithdraw = data => get ('/administer/reliantFeeRegister/withdraw', data)

// 收文登记-撤回
withdrawApi.withdrawReceiptRegistration = data => get ('/administer/adminReceiveFile/chehui', data)

// 采购申请-撤回
withdrawApi.withdrawPurchaseRequest = data => get ('/material/procurement/purchaseRequest/withdraw', data)

// 采购合同-撤回
withdrawApi.withdrawPurchaseContract = data => get ('/material/procurement/contract/withdraw', data)

//  物资设备 -领用管理 - 领用申请-撤回
withdrawApi.withdrawReceiveApplication = data => get ('/materialcollaruse/materialUseApplication/withdraw', data)

// 	物资设备 - 出租管理 - 出租申请-撤回
withdrawApi.rentalWithdraw = data => get ('/material/rental/rentalApplication/withdraw', data)

//  物资设备 - 出租管理 - 出租合同-撤回
withdrawApi.rentalContractWithdraw = data => get ('/material/rental/rentalContract/withdraw', data)

// 物资设备 - 仓库管理 - 锁定库存-撤回
withdrawApi.lockInventoryContractWithdraw = data => get ('/material/warehouse/lock/withdraw', data)

//  物资设备 - 出售申请-撤回
withdrawApi.sellApplyWithdraw = data => get ('/materialsell/materialSellApply/withdraw', data)

//  物资设备 - 出售合同-撤回
withdrawApi.sellContractWithdraw = data => get ('/materialsell/materialSellContract/withdraw', data)

// 	物资设备 - 仓库管理 - 仓库调拨-撤回
withdrawApi.inventoryAllocationWithdraw = data => get ('/material/warehouse/allot/withdraw', data)

// 	客户管理 - 提现-撤回
withdrawApi.cashWithdrawalWithdraw = data => get ('/customer/withdrawDeposit/withdraw', data)

//  自营项目 — 业主招标 — 招标公告信息-撤回
withdrawApi.announcementChangeWithdraw = data => get ('/self/invitation/register/withdraw', data)

//  自营项目 — 业主招标 — 招标公告变更-撤回
withdrawApi.announcementInformationWithdraw = data => get ('/self/invitation/alteration/withdraw', data)

//  自营项目 — 前期跟踪 — 项目创建-撤回
withdrawApi.selfProjectCreateWithdraw = data => get ('/self/previous/projectCreate/withdraw', data)

//  自营项目 — 前期跟踪 — 跟踪了解-撤回
withdrawApi.selfProEarlyStageWithdraw = data => get ('/self/previous/traceMessage/withdraw', data)

//  自营项目 — 立项登记-撤回
withdrawApi.selfProApprovalWithdraw = data => get ('/self/approval/approval/withdraw', data)

// 自营项目 — 开工准备 — 项目部组建-撤回
withdrawApi.projectDepartmentWithdraw = data => get ('/self/prepare/departmentCreate/withdraw', data)

// 自营项目 — 开工准备 — 项目分包-撤回
withdrawApi.subcontractManagementWithdraw = data => get ('/self/prepare/directSubpackage/withdraw', data)

// 自营项目 — 开工准备 — 图纸审核-撤回
withdrawApi.blueprintAuditWithdraw = data => get ('/self/prepare/drawingAudit/withdraw', data)

// 自营项目 — 开工准备 — 施工方案审核-撤回
withdrawApi.constructionSchemeWithdraw = data => get ('/self/prepare/schemeAudit/withdraw', data)

// 自营项目 — 开工准备 — 三平一通-撤回
withdrawApi.threeSuppliesOneLevelingWithdraw = data => get ('/self/prepare/electric/withdraw', data)

// 自营项目 — 我方投标 — 现场勘察登记-撤回
withdrawApi.siteInvestigationRegistrationWithdrawal = data => get ('/self/bid/exploration/withdraw', data)

// 自营 - 我方投标 - 项目报名申请-撤回
withdrawApi.selfProjectApplyWithdraw = data => get ('/self/bid/apply/withdraw', data)

// 自营项目 — 我方投标 — 资格预审文件审核-撤回
withdrawApi.prequalificationDocWithdraw = data => get ('/self/bid/qualification/withdraw', data)

// 自营项目 — 我方投标 — 开标登记-撤回
withdrawApi.selfOpenTenderWithdraw = data => get ('/self/bid/open/withdraw', data)

// 自营项目 — 合同管理 — 新建合同-撤回
withdrawApi.contractConcludeSignWithdraw = data => get ('/self/managerCreate/withdraw', data)

// 自营项目 — 合同计量 - 主表-撤回
withdrawApi.contractMeterWithdraw = data => get ('/self/contractMeter/withdraw', data)

// 自营项目 — 安全管理 - 安全检查记录-撤回
withdrawApi.selfSafeRuleWithdraw = data => get ('/self/safeRule/withdraw', data)

// 自营项目 — 安全管理 - 新建安全整改-撤回
withdrawApi.selfRectificateWithdraw = data => get ('/self/rectificate/withdraw', data)

// 自营项目 — 安全管理 - 安全事故报告-撤回
withdrawApi.selfSafeAccidentWithdraw = data => get ('/self/safeAccident/withdraw', data)

// 自营项目 — 安全管理 - 安全事故处理-撤回
withdrawApi.selfHandleWithdraw = data => get ('/self/safeHandle/withdraw', data)

// 通知公告-撤回
withdrawApi.notificationAnnouncementWithdraw = data => get ('/administer/message/withdraw', data)

// 	物资设备 - 报废申请-撤回
withdrawApi.materialscrapWithdraw = data => get ('/materialscrap/materialScrapApply/withdraw', data)

// 	自营项目 - 项目划分-撤回
withdrawApi.divideWithdraw = data => get ('/self/divide/module/withdraw', data)

// 	自营项目 - 进度管理 - 进度计划-撤回
withdrawApi.scheduleWithdraw = data => get ('/self/schedule/plan/withdraw', data)
// 	自营项目 - 质量管理 - 质量目标-撤回
withdrawApi.qualityObjectivesWithdraw = data => get ('/self/quality/target/withdraw', data)

// 自营项目 - 质量管理 - 质量亮点-撤回
withdrawApi.qualityBrightSpotWithdraw = data => get ('/self/quality/feature/withdraw', data)

// 自营项目 - 质量管理 - 质量整改-撤回
withdrawApi.qualityImprovementWithdraw = data => get ('/self/quality/rectify/withdraw', data)

// 自营项目 - 质量管理 - 质量检查-撤回
withdrawApi.qualityInspectionWithdraw = data => get ('/self/quality/inspect/withdraw', data)

// 自营项目 - 质量管理 - 质量规范-撤回
withdrawApi.qualityStandardWithdraw = data => get ('/self/quality/standard/withdraw', data)

// 自营项目 - 质量管理 - 质量规范-撤回
withdrawApi.qualityCheckAcceptWithdraw = data => get ('/self/quality/accept/withdraw', data)

// 自营项目 - 发票管理 - 发票信息-撤回
withdrawApi.invoiceOriginWithdraw = data => get ('/self/invoice/origin/withdraw', data)

// 自营项目 - 发票管理 - 异常标记-撤回
withdrawApi.abnormalWithdraw = data => get ('/self/invoice/abnormal/withdraw', data)

export default withdrawApi
