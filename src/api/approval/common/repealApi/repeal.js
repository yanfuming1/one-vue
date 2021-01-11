// 流程撤销接口  
const repeal = {};
repeal.url = function(formKey){
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
    case 'openTender':  // 项目管理--开标登记
      url = 'openTenderRepeal';
      break; 
    case 'tenderBookMake':  // 项目管理--标书制作
      url = 'tenderMakeRepeal';
      break
    case 'projectApproval':  // 项目管理--立项登记
      url = 'jointProjectApprovalRepeal';
      break
    case 'cashPayment':  // 项目管理--保证金缴纳
      url = 'jointProjectMarginPaymentRepeal' ;
      break
    case 'cashReturn':  // 项目管理--保证金退还
      url = 'jointProjectMarginReturnRepeal';
      break
    case 'projectPaymentAdd':  // 项目管理--工程款支付申请
      url = 'projectPaymentRepeal'
      break
    case 'newAgent':  // 项目管理--代收代付
      url = 'agentBusinessRepeal'
      break
    case 'borrowingApply':  //借阅申请
      url = 'repealArchiveRegistration';
      break;
    case 'updataPrintsBeforeApply':  //刻章申请
      url = 'repealPrintsBeforeApply';
      break;
    case 'updataUsingApplication':  //印章申请
      url = 'repealUsingApplication';
      break;
    case 'updataPostRegistration':
      url = 'repealPostRegistration'
      break;
    case 'cerPayRegister':  // 行政-- 挂靠费用
      url = 'reliantFeeRegisterRevocation'
      break
    case 'leaveApplication':  // 人事 - 离职申请
      url = 'withdrawalRevocation';
      break;
    case 'noticeDismissal':  // 人事 - 辞退申请
      url = 'Dismissal';
      break;
    case 'addWorkAdjustment':  // 人事 - 工作调整
      url = 'cancellationWorkAdjustment';
      break;
    case 'addVehicleUseRegistration':  // 行政 - 车辆使用申请-撤销 
      url = 'vehicleUseApplicationCancellation';
      break;
    case 'updataReceiptRegistration':
      url = 'repealReceiptRegistration'
      break
    case 'addPurchaseRequest': // 物资设备 - 采购申请-撤回
      url = 'repealPurchaseRequest'
      break
    case 'addPurchaseContract': // 物资设备 - 采购合同-撤回
      url = 'repealPurchaseContract'
      break
    case 'receiveAdd': //  物资设备 - 领用管理 - 领用申请-撤销
      url = 'repealMaterialUseApplication'
      break
    case 'rentalApplication':  //  物资设备 - 出租管理 - 出租申请-撤回
      url = 'rentalRevocation'
      break
    case 'rentOutContractAdd': //  物资设备 - 出租管理 - 出租合同-撤回
      url = 'rentalContractRevocation'
      break
    case 'lockInventoryInformation': //  物资设备 - 出租管理 - 出租合同-撤回
      url = 'rentalContractRevocation'
    case 'sellApplyAdd': 
      url = 'sellApplyRevocation'
      break
    case 'sellContractAdd':
      url = 'sellContractRevocation'
      break
    case 'addInventoryAllocation':  // 	物资设备 - 仓库管理 - 仓库调拨-撤销
      url = 'inventoryAllocationRevocation'
      break
    case 'cashWithdrawal': // 	客户管理 - 提现-撤销
      url = 'cashWithdrawalRevocation'
      break
    case 'announcementChange': //  业主招标 — 招标公告信息-撤销
      url = 'announcementChangeRevocation'
      break
    case 'addAnnouncementInformation': //  自营项目 — 业主招标 — 招标公告变更-撤销
      url = 'announcementInformationRevocation'
      break
    case 'selfProjectAdd':  // 自营项目 - 项目创建-撤销
      url = 'selfProjectCreateRevocation'
      break
    case 'earlyStageAdd':  // 自营项目 — 前期跟踪 — 跟踪了解-撤销
      url = 'selfProEarlyStageRevocation'
      break
    case 'selfProjectRegistration':   // 自营项目 — 立项登记-撤销
      url = 'selfProApprovalRevocation'
      break
    case 'addInventoryAllocation':  // 	物资设备 - 仓库管理 - 仓库调拨-撤销
      url = 'inventoryAllocationRevocation'
      break
    case 'cashWithdrawal': // 	客户管理 - 提现-撤销
      url = 'cashWithdrawalRevocation'
      break
    case 'addProjectDepartment': // 自营项目 — 开工准备 — 项目部组建-撤销
      url = 'projectDepartmentRevocation'
      break
    case 'addSubcontractManagement': // 自营项目 — 开工准备 — 项目分包-撤销
      url = 'subcontractManagementRevocation'
      break
    case 'addBlueprintAudit': // 自营项目 — 开工准备 — 图纸审核-撤销
      url = 'blueprintAuditRevocation'
      break
    case 'addConstructionScheme': // 自营项目 — 开工准备 — 施工方案审核-撤销
      url = 'constructionSchemeRevocation'
      break
    case 'addThreeSuppliesOneLeveling': // 自营项目 — 开工准备 — 三平一通-撤销
      url = 'threeSuppliesOneLevelingRevocation'
      break
    case 'addSceneInvestigation': // 自营项目 — 我方投标 — 现场勘察登记-撤销
      url = 'explorationRevocationRevocation'
      break
    case 'selfProjectApplication': // 自营 - 我方投标 - 项目报名申请-撤销
      url = 'selfProjectApplyRevocation'
      break
    case 'addPrequalificationDocuments':  // 自营项目 — 我方投标 — 资格预审文件审核-撤销
      url = 'prequalificationDocRevocation'
      break
    case 'selfOpenTender':  // 自营项目 — 我方投标 — 开标登记-撤销
      url = 'selfOpenTenderRevocation'
      break
    case 'addContractConcludeSign': // 自营项目 — 合同管理- 新建合同-撤销
      url = 'contractConcludeSignRevocation'
      break
      
    case 'addInspection': // 自营项目 — 安全管理 - 安全检查记录-撤销
      url = 'contractSafeRuleRevocation'
      break

    case 'addSafetyMeasures': // 自营项目 — 安全管理 - 新建安全整改-撤销
      url = 'contractRectificateRevocation'
      break

    case 'addSafetyIncidentReport': // 自营项目 — 安全管理- 安全事故报告-撤销
      url = 'contractSafeAccidentRevocation'
      break
      
    case 'addAccidentHandlingRecord': // 自营项目 — 安全管理- 安全事故处理-撤销
      url = 'contractHandleRevocation'
      break
    case 'addPublishNewsDialog': // 通知公告-撤销
      url = 'notificationAnnounRevocation'
      break
    case 'scrapRecordInfo':  // 	物资设备 - 报废申请-撤回
      url = 'materialscrapRevocation'
      break
    case 'projectSegregationAdd':  // 	物资设备 - 报废申请-撤回
      url = 'divideRevocation'
      break
    case 'subSchedulePlanList':  // 	自营项目 - 	进度计划
      url = 'scheduleRevocation'
      break
    case 'addQualityObjectives':
      url = 'qualityObjectivesRevocation'
      break
    case 'addQualityBrightSpot':
      url = 'qualityBrightSpotRevocation'
      break
    case 'addQualityImprovement':
      url = 'qualityImprovementRevocation'
      break
    case 'addQualityInspection':
      url = 'qualityInspectionRevocation'
      break
    case 'addQualityStandard':
      url = 'qualityStandardRevocation'
      break
    case 'addQualityCheckAccept':
      url = 'qualityCheckAcceptRevocation'
      break
        // 发票撤销
    case 'addBillingRegistrationList':
      url = 'invoiceOriginRevocation'
      break
        // 发票异常登记
    case 'addInvoiceAbnormalRegistration':
      url = 'abnormalRevocation'
      break
    default:
      break;
  }
  return url;
}
export default repeal