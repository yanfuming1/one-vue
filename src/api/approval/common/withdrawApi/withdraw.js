// 流程撤回
const withdraw = {};
withdraw.url = function(formKey){
  let url = '';
  switch (formKey) {
    case 'staffLoan':   // 员工借款申请
      url = 'employeeBorrow';
      break;
    case 'externalLloan':  //对外贷款审批
      url = 'externalLloan';
      break;
    case 'paymentRequest':  //对外付款申请
      url = 'paymentApply';
      break;
    case 'staffReimburse':  //员工报销申请
      url = 'employeeReimburse';
      break;
    case 'nonbusinessIncomeRegister':  //营业外收入登记
      url = 'takingRegister';
      break;
    case 'borrowingApply':  //营业外收入登记
      url = 'withdrawArchiveRegistration';
      break;
    case 'updataPrintsBeforeApply':  //刻章申请
      url = 'withdrawPrintsBeforeApply';
      break;
    case 'updataUsingApplication':  //印章申请
      url = 'withdrawUsingApplication';
      break;
    case 'leaveApplication':  // 离职申请
      url = 'withdrawalWithdrawal';
      break;
    case 'noticeDismissal':  // 辞退申请
      url = 'dismissalWithdrawal';
      break;
    case 'addWorkAdjustment':  // 人事 - 工作调整
      url = 'workAdjustmentWithdrawal';
      break;
    case 'addVehicleUseRegistration':  // 行政 - 车辆使用申请
      url = 'vehicleUseApplicationWithdrawal';
      break;
    case 'addVehicleReimbursement':  // 行政 - 车辆费用报销
      url = 'vehicleReimbursementWithdrawal';
      break;
    case 'cerPayRegister':  // 行政 - 挂靠费
      url = 'reliantFeeRegisterWithdraw';
      break
    case 'updataPostRegistration':
      url = 'withdrawPostRegistration'
      break
    case 'openTender':  // 联营项目--开标登记
      url = 'jointProjectOpenWithdraw';
      break;
    case 'tenderBookMake':  // 项目管理--标书制作
      url = 'tenderMakeWithdraw';
      break
    case 'projectApproval':  // 项目管理--立项登记
      url = 'jointProjectApprovalWithdraw';
      break;
    case 'cashPayment': // 联营项目--保证金缴纳
      url = 'jointProjectMarginPaymentWithdraw';
      break;
    case 'cashReturn':  // 项目管理--保证金退还
      url = 'marginReturnWithdraw';
      break
    case 'projectPaymentAdd':  // 项目管理--工程款支付申请
      url = 'projectPaymentWithdraw'
      break
    case 'newAgent':  // 项目管理--代收代付
      url = 'agentBusinessWithdraw'
      break
    case 'updataReceiptRegistration':
      url = 'withdrawReceiptRegistration'
      break
    case 'addPurchaseRequest': // 物资设备 - 采购申请-撤回
      url = 'withdrawPurchaseRequest'
      break
    case 'addPurchaseContract': // 物资设备 - 采购合同-撤回
      url = 'withdrawPurchaseContract'
      break
    case 'receiveAdd':  // 领用申请
      url = 'withdrawReceiveApplication'
      break
    case 'rentalApplication':  //  出租申请
      url = 'rentalWithdraw'
      break
    case 'rentOutContractAdd':  // 出租合同
      url = 'rentalContractWithdraw'
      break
    case 'lockInventoryInformation':  // 仓库管理 - 锁定库存-撤回
      url = 'lockInventoryContractWithdraw'
      break
    case 'sellApplyAdd':    // 出售申请
      url = 'sellApplyWithdraw'
      break
    case 'sellContractAdd':
      url = 'sellContractWithdraw'
      break
    case 'addInventoryAllocation':  // 物资设备 - 仓库管理 - 仓库调拨-撤回
      url = 'inventoryAllocationWithdraw'
      break
    case 'cashWithdrawal':  // 客户管理 - 提现-撤回
      url = 'cashWithdrawalWithdraw'
      break
    case 'announcementChange': //  自营项目 — 业主招标 — 招标公告信息-撤回
      url = 'announcementChangeWithdraw'
      break
    case 'addAnnouncementInformation': //  自营项目 — 业主招标 — 招标公告变更-撤回
      url = 'announcementInformationWithdraw'
      break
    case 'selfProjectAdd':  // 自营项目 — 前期跟踪 — 项目创建-撤回
      url = 'selfProjectCreateWithdraw'
      break
    case 'earlyStageAdd':  // 自营项目 — 前期跟踪 — 跟踪了解-撤回
      url = 'selfProEarlyStageWithdraw'
      break
    case 'selfProjectRegistration':  // 自营项目 — 立项登记-撤回
      url = 'selfProApprovalWithdraw'
      break
    case 'addInventoryAllocation':  // 物资设备 - 仓库管理 - 仓库调拨-撤回
      url = 'inventoryAllocationWithdraw'
      break
    case 'cashWithdrawal':  // 客户管理 - 提现-撤回
      url = 'cashWithdrawalWithdraw'
      break
    case 'addProjectDepartment':  // 自营项目 — 开工准备 — 项目部组建-撤回
      url = 'projectDepartmentWithdraw'
      break
    case 'addSubcontractManagement':  // 自营项目 — 开工准备 — 项目分包-撤回
      url = 'subcontractManagementWithdraw'
      break
    case 'addBlueprintAudit':  // 自营项目 — 开工准备 — 项目分包-撤回
      url = 'blueprintAuditWithdraw'
      break
    case 'addConstructionScheme':  // 自营项目 — 开工准备 — 施工方案审核-撤回
      url = 'constructionSchemeWithdraw'
      break
    case 'addThreeSuppliesOneLeveling':  // 自营项目 — 开工准备 —  三平一通-撤回
      url = 'threeSuppliesOneLevelingWithdraw'
      break
    case 'addSceneInvestigation':  // 自营项目 — 我方投标 — 现场勘察登记-撤回
      url = 'siteInvestigationRegistrationWithdrawal'
      break
    case 'selfProjectApplication': // 自营 - 我方投标 - 项目报名申请-撤回
      url = 'selfProjectApplyWithdraw'
      break
    case 'addPrequalificationDocuments': // 自营项目 — 我方投标 — 资格预审文件审核-撤回
      url = 'prequalificationDocWithdraw'
      break
    case 'selfOpenTender':  //  自营项目 — 我方投标 — 开标登记-撤回
      url = 'selfOpenTenderWithdraw'
      break
    case 'addContractConcludeSign':  // 自营项目 — 合同管理- 新建合同-撤回
      url = 'contractConcludeSignWithdraw'
      break
    case 'addContractMeasure':  // 自营项目 — 合同管理- 新建合同-撤回
      url = 'contractMeterWithdraw'
      break

    case 'addInspection': // 自营项目 — 安全管理 - 安全检查记录-撤回
      url = 'selfSafeRuleWithdraw'
      break

    case 'addSafetyMeasures': // 自营项目 — 安全管理 - 新建安全整改-撤回
      url = 'selfRectificateWithdraw'
      break

    case 'addSafetyIncidentReport': // 自营项目 — 安全管理- 安全事故报告-撤回
      url = 'selfSafeAccidentWithdraw'
      break
      
    case 'addAccidentHandlingRecord': // 自营项目 — 安全管理- 安全事故处理-撤回
      url = 'selfHandleWithdraw'
      break
    case 'addPublishNewsDialog':  // 通知公告-撤回
      url = 'notificationAnnouncementWithdraw'
      break
    case 'scrapRecordInfo':  // 	物资设备 - 报废申请-撤回
      url = 'materialscrapWithdraw'
      break
    case 'projectSegregationAdd':  // 	自营项目 - 项目划分-撤回
      url = 'divideWithdraw'
      break
    case 'subSchedulePlanList':  // 	自营项目 - 	进度计划
      url = 'scheduleWithdraw'
      break
    case 'addQualityObjectives':
      url = 'qualityObjectivesWithdraw'
      break
    case 'addQualityBrightSpot':
      url = 'qualityBrightSpotWithdraw'
      break
    case 'addQualityImprovement':
      url = 'qualityImprovementWithdraw'
      break
    case 'addQualityInspection':
      url = 'qualityInspectionWithdraw'
      break
    case 'addQualityStandard':
      url = 'qualityStandardWithdraw'
      break
    case 'addQualityCheckAccept':
      url = 'qualityCheckAcceptWithdraw'
      break
      // 发票撤回
    case 'addBillingRegistrationList':
      url = 'invoiceOriginWithdraw'
      break
      // 发票异常登记
    case 'addInvoiceAbnormalRegistration':
      url = 'abnormalWithdraw'
      break
    default:
      break;
  }
  return url;
}
export default withdraw