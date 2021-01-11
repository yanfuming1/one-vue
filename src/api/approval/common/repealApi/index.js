import{get,post,putData,deleteData} from "../../../../plugin/axios";

const repealApi = {};
// 财务模块-对外贷款审批撤销
repealApi.externalLloan = data=> putData ('/finance/externalLloan/repeal',data);

// 财务模块-营业外收入登记撤销
repealApi.takingRegister = data=> putData ('/finance/takingRegister/repeal',data);

// 财务模块撤销-员工借款申请撤销
repealApi.employeeBorrow = data=> putData ('/finance/employeeBorrow/repeal',data);

// 财务模块撤销-对外付款申请撤销
repealApi.paymentApply = data=> putData ('/finance/paymentApply/repeal',data);

// 财务模块撤销-员工报销申请撤销
repealApi.employeeReimburse = data=> putData ('/finance/employeeReimburse/repeal',data);
 
// 联营项目开标登记-撤销
repealApi.openTenderRepeal = data => get('/joint/jointProjectOpen/revocation', data);

// 联营项目标书制作-撤销
repealApi.tenderMakeRepeal = data => get('/joint/tenderMake/revocation', data);

// 联营项目立项登记-撤销
repealApi.jointProjectApprovalRepeal = data => get('/joint/jointProjectApproval/revocation', data);

// 联营项目保证金缴纳-撤销 
repealApi.jointProjectMarginPaymentRepeal = data => get('/joint/marginPayment/revocation', data); 

// 联营项目保证金退还-撤销
repealApi.jointProjectMarginReturnRepeal = data => get('/joint/marginReturn/revocation', data); 

// 联营项目工程款支付申请-撤销 
repealApi.projectPaymentRepeal = data => get('/joint/projectPayment/revocation', data);

// 联营项目代收代付-撤销  
repealApi.agentBusinessRepeal = data => get('/joint/agentBusiness/revocation', data);

// 借阅申请-撤销
repealApi.repealArchiveRegistration = data => putData ('/administer/adminFileLoan/repeal', data)

// 借阅申请-撤销
repealApi.repealArchiveRegistration = data => putData ('/administer/adminFileLoan/repeal', data)

// 刻章申请-撤销
repealApi.repealPrintsBeforeApply = data => putData ('/administer/adminEngapply/repeal', data)

// 印章申请-撤销 
repealApi.repealUsingApplication = data => putData ('/administer/adminUseapply/repeal', data)

// 挂靠费申请-撤销
repealApi.reliantFeeRegisterRevocation = data => get ('/administer/reliantFeeRegister/revocation', data)

// 发文登记-撤销
repealApi.repealPostRegistration = data => putData ('/administer/adminSendFile/revocation', data)

// 离职申请-撤销
repealApi.withdrawalRevocation = data => get ('/personnelmanagement/leaveOffice/revocation', data)

// 	辞退申请-撤销
repealApi.Dismissal = data => get ('/personnelmanagement/dismiss/revocation', data)

// 工作调整-撤销
repealApi.cancellationWorkAdjustment = data => putData ('/hr/workAccommodation/revocation', data)

// 	车辆使用申请-撤销 
repealApi.vehicleUseApplicationCancellation = data => putData ('/administer/vehicleRegistration/revocation', data)

// 	收文登记-撤销
repealApi.repealReceiptRegistration = data => get ('/administer/adminReceiveFile/repeal', data)

// 	物资设备 - 采购申请-撤销
repealApi.repealPurchaseRequest = data => get ('/material/procurement/purchaseRequest/revocation', data)

// 	物资设备 - 采购合同-撤销
repealApi.repealPurchaseContract = data => get ('/material/procurement/contract/revocation', data)

//  物资设备 - 领用管理 - 领用申请-撤销
repealApi.repealMaterialUseApplication = data => get ('/materialcollaruse/materialUseApplication/revocation', data)

//  物资设备 - 出租管理 - 出租申请-撤销
repealApi.rentalRevocation = data => get ('/material/rental/rentalApplication/revocation', data)

//  物资设备 - 出租管理 - 出租合同-撤销
repealApi.rentalContractRevocation = data => get ('/material/rental/rentalContract/revocation', data)

//  物资设备 - 仓库管理 - 锁定库存-撤销
repealApi.rentalContractRevocation = data => get ('/material/warehouse/lock/revocation', data)

//  物资设备 - 出售申请-撤销
repealApi.sellApplyRevocation = data => get ('/materialsell/materialSellApply/revocation', data)

//  物资设备 - 出售合同-撤销
repealApi.sellContractRevocation = data => get ('/materialsell/materialSellContract/revocation', data)

// 	物资设备 - 仓库管理 - 仓库调拨-撤销
repealApi.inventoryAllocationRevocation = data => get ('/material/warehouse/allot/revocation', data)

// 	客户管理 - 提现-撤销
repealApi.cashWithdrawalRevocation = data => get ('/customer/withdrawDeposit/revocation', data)

//  业主招标 — 招标公告信息-撤销
repealApi.announcementChangeRevocation = data => get ('/self/invitation/register/revocation', data)

//  自营项目 — 业主招标 — 招标公告变更-撤销
repealApi.announcementInformationRevocation = data => get ('/self/invitation/alteration/revocation', data)

//  自营项目 - 项目创建-撤销
repealApi.selfProjectCreateRevocation = data => get ('/self/previous/projectCreate/revocation', data)

//  自营项目 — 前期跟踪 — 跟踪了解-撤销
repealApi.selfProEarlyStageRevocation = data => get ('/self/previous/traceMessage/revocation', data)

//  自营项目 — 立项登记-撤销
repealApi.selfProApprovalRevocation = data => get ('/self/approval/approval/revocation', data)

// 自营项目 — 开工准备 — 项目部组建-撤销
repealApi.projectDepartmentRevocation = data => get ('/self/prepare/departmentCreate/revocation', data)

// 自营项目 — 开工准备 — 项目分包-撤销
repealApi.subcontractManagementRevocation = data => get ('/self/prepare/directSubpackage/revocation', data)

// 自营项目 — 开工准备 — 图纸审核-撤销
repealApi.blueprintAuditRevocation = data => get ('/self/prepare/drawingAudit/revocation', data)

// 自营项目 — 开工准备 —  三平一通-撤销
repealApi.constructionSchemeRevocation = data => get ('/self/prepare/schemeAudit/revocation', data)

// 自营项目 — 开工准备 —  施工方案审核-撤销
repealApi.threeSuppliesOneLevelingRevocation = data => get ('/self/prepare/electric/revocation', data)

// 自营项目 — 我方投标 — 现场勘察登记-撤销
repealApi.explorationRevocationRevocation = data => get ('/self/bid/exploration/revocation', data)

// 自营 - 我方投标 - 项目报名申请-撤销
repealApi.selfProjectApplyRevocation = data => get ('/self/bid/apply/revocation', data)

// 自营项目 — 我方投标 — 资格预审文件审核-撤销
repealApi.prequalificationDocRevocation = data => get ('/self/bid/qualification/revocation', data)

// 自营项目 — 我方投标 — 开标登记-撤销
repealApi.selfOpenTenderRevocation = data => get ('/self/bid/open/revocation', data)

// 自营项目 — 合同管理- 新建合同-撤销
repealApi.contractConcludeSignRevocation = data => get ('/self/managerCreate/revocation', data)

// 	自营项目 — 合同计量 - 主表-撤销
repealApi.contractMeterRevocation = data => get ('/self/contractMeter/revocation', data)

// 自营项目 — 安全管理 - 安全检查记录-撤销
repealApi.contractSafeRuleRevocation = data => get ('/self/safeRule/revocation', data)

// 自营项目 — 安全管理 - 新建安全整改-撤销
repealApi.contractRectificateRevocation = data => get ('/self/rectificate/revocation', data)

// 自营项目 — 安全管理 - 安全事故报告-撤销
repealApi.contractSafeAccidentRevocation = data => get ('/self/safeAccident/revocation', data)

// 自营项目 — 安全管理 - 安全事故处理-撤销
repealApi.contractHandleRevocation = data => get ('/self/safeHandle/revocation', data)

// 通知公告-撤销
repealApi.notificationAnnounRevocation = data => get ('/administer/message/revocation', data)

// 物资设备 - 报废申请-撤销
repealApi.materialscrapRevocation = data => get ('/materialscrap/materialScrapApply/revocation', data)

// 	自营项目 - 项目划分-撤回
repealApi.divideRevocation = data => get ('/self/divide/module/revocation', data)
// 	自营项目 - 项目划分-撤回
repealApi.scheduleRevocation = data => get ('/self/schedule/plan/revocation', data)
// 自营项目 - 质量管理 - 质量目标-撤销
repealApi.qualityObjectivesRevocation = data => get ('/self/quality/target/revocation', data)

// 自营项目 - 质量管理 - 质量亮点-撤销
repealApi.qualityBrightSpotRevocation = data => get ('/self/quality/feature/revocation', data)

// 自营项目 - 质量管理 - 质量整改-撤销
repealApi.qualityImprovementRevocation = data => get ('/self/quality/rectify/revocation', data)

// 自营项目 - 质量管理 - 质量检查-撤销
repealApi.qualityInspectionRevocation = data => get ('/self/quality/inspect/revocation', data)

// 自营项目 - 质量管理 - 质量规范-撤销
repealApi.qualityStandardRevocation = data => get ('/self/quality/standard/revocation', data)

// 自营项目 - 质量管理 - 质量规范-撤销
repealApi.qualityCheckAcceptRevocation = data => get ('/self/quality/accept/revocation', data)

// 自营项目 - 质量管理 - 质量规范-撤销
repealApi.invoiceOriginRevocation = data => get ('/self/invoice/origin/revocation', data)

// 自营项目 - 发票管理 - 异常标记-撤销
repealApi.abnormalRevocation = data => get ('/self/invoice/abnormal/revocation', data)

export default repealApi