/**
 * 客户管理
 */
export const CUSTOMERAUTHORIZATIONFORM = {

    /**
     * 业务负责人变更
     */
    SALESINFORMATIONUPDATE: 'salesInformationUpdate',

    /**
     * 联系记录添加
     */
    RELATIONSHIPRECORD: '533ca855-3c9c-d025-8d90-3e92abe5fe26',

    /**
     * 拓展字段添加页面
     */
    ADDEXPANDINFORMATION: '32de8e1d-473d-dbae-b489-31851874bd28',

    /**
     * 客户列表添加页面 （联营）
     */
    ADDCUSTOMER: '5f86fda4-cdee-858f-1d03-71aee66e1ff6',

    /**
     * 客户列表添加页面 （甲方）
     */
    FIRSTPARTYADDCUSTOMER: 'addCustomer',

    /**
     * 我的客户-资金账户-账户-新增账户
     */
    NEWACCOUNTINFORMATION: 'newAccountInformation',

    /**
     * 我的客户基础信息
     */
    BASICINFORMATION: 'basicInformation',

    /**
     * 联系人
     */
    CONTACTS: 'contacts',

    /**
     * 联系人详情
     */
    CONTACTSDETAILS: 'contactsDetails',

    /**
     * 销售管理信息 (我的客户)
     */
    SALESMANAGEMENT: 'salesManagement',

    /**
     * 基础信息（甲方）
     */
    FIRSTPARTYBASICINFORMATION: 'firstPartyBasicInformation',

    /**
     * 账号信息（甲方）
     */
    FIRSTPARTYACCOUNTINFORMATION: 'accountInformation',

    /**
     * 联营-资金账户-资金转移情况
     */
    TRANSFEROFFUNDS: 'transferOfFunds',

    /**
     * 联营-资金账户-项目资金池到客户资金池
     */
    PROJECTTOCLIENT: 'projecttoclient',

    /**
     * 联营 - 资金账户 - 提现
     */
    CASHWITHDRAWAL:'cashWithdrawal',

    /**
     * 客户授权添加
     */
    ADDCUSTOMERAUTHORIZATION: 'addCustomerAuthorization'
}


/**
 * 证书管理
 */
export const CERTIFICATE = {

    /**
     * 新建证书
     */
    CREATECERTIFICATE: 'createNewCer',

    /**
     * 没有流程的证书借用
     */
    NOFLOWBORROW: 'noFlowCerBorrow',

    /**
     * 证书归还登记
     */
    CERGIVEBACK : 'cerGiveBack',

    /**
     * 挂靠费用
     */
    GUAKAOPAY : 'cerPayRegister',

    /**
     * 公司证书添加
     */
    COMPANYCERADD: 'companyCerAdd',

    /**
     * 使用流程的证书借用
     */
    USEFLOWBORROW: 'useFlowCerBorrow',

    /**
     * 证书借出登记
     */
    BORROWOUT: 'cerBorrowOut',

    /**
     * 项目登记
     */
    PROJECTRECORDS: 'projectRecords',

    /**
     * 个人证书管理的添加行
     */
    PERSONALCERADDLINE : 'personalCerAddLine',
}

/**
 * 分公司管理
 */
export const COMPANY = {
    
    /**
     * 新建分公司
     */
    NEWCOMPAY: 'newCompany'
}

/**
 * 个人中心
 */
export const PERSONALCENTER = {

    /**
     * 入职登记
     */
    ENTRYREGISTRATION : 'entryRegistration',

    /**
     * 银行卡管理
     */
    PERSONALBANKADD : 'personalBankAdd'
}

/**
 * 财务管理
 */ 
export const FINANCIALMANAGEMENT = {
    PAYMENTREQUEST : 'paymentRequest',
    STAFFLOAN: 'staffloan',

    /**
     * 银行账户
     */
    BANKACCOUNTFORM: 'bankAccountForm',

    ASSOCIATEDDOCUMENTS: 'associatedDocuments'
}

/**
 * 流程实例
 */ 
export const PROCESSINSTANCE = {
    QQTSENDPROCESS: 'qqtSendProcess',
    QQTSENDBACKPROCESS: 'qqtSendBackProcess',
}

/**
 * 行政管理
 */
export const ADMINISTRATIVEMANAGEMENT = {

    /**
     * 新建档案
     */
    ADDARCHIVEREGISTRATION: 'addArchiveRegistration',

    /**
     * 借阅申请
     */
    BORROWINGAPPLY: 'borrowingApply',

    /**
     * 发文登记
     */
    POSTREGISTRATION: 'updataPostRegistration',

    /**
     * 收文登记
     */
    RECEIPTREGISTRATION: 'updataReceiptRegistration',

    /**
     * 刻章申请
     */
    PRINTSBEFOREAPPLY: 'updataPrintsBeforeApply',

    /**
     * 印章登记
     */
    SEALREGISTRATION: 'sealRegistration',

    /**
     * 用印申请
     */
    USINGAPPLICATION: 'updataUsingApplication',

    /**
     * 添加分类
     */
    SEALCLASSIFICATION: 'sealClassification',

    /**
     * 通讯录详情
     */
    EXHIBITIONADDRESSBOOK: 'exhibitionAddressBook',

    /**
     * 借阅归还
     */
    BORROWINGRETURN: 'borrowingReturn',

    /**
     * 车辆费用报销
     */
    VEHICLEEXPENSEREIMBURSEMENT: 'addVehicleReimbursement',

    /**
     * 添加车辆信息登记
     */
    ADDVEHICLEINFORMATIONREGISTRATION: 'addVehicleInformationRegistration',

    /**
     * 添加车辆使用申请
     */
    ADDVEHICLEUSEREGISTRATION: 'addVehicleUseRegistration',
    
    /**
     * 油补标准设置
     */
    STANDARDSETTINGOFCARREPAIR: 'standardSettingOfCarRepair',
    
    /**
     * 添加油补
     */
    ADDOILSUPPLEMENTFROM: 'addOilSupplementFrom',

    /**
     * 通知公告
     */
    ADDPUBLISHNEWSDIALOG: 'addPublishNewsDialog'
}

/**
 * 人事管理
 */
export const PERDONNELMANAGEMENT = {
    LEAVEAPPLICATION: 'leaveApplication',
    NOTICDISMISSAL:'noticeDismissal',
    WORKADJUSTMENT:'addWorkAdjustment'
}

/**
 * 系统管理
 */
export const SYSTEMMANAGEMENT = {
    STAFFADD: 'staffAdd',

    /**
     * 打印模板
     */
    ADDPRINTTEMPLATE: 'addPrintTemplate',

    /**
     * 项目角色
     */
    PROJECTROLE: 'projectRole'
}

/**
 * 物采
 */
export const MATERIALEQUIPMENTMANAGEMENT = {

    /**
     * 材料分类
     */
    ADDMATERIALDEPOT: 'addMaterialDepot',

    /**
     * 仓库设置
     */
    ADDENTREPOT: 'addEntrepot',

    /**
     * 领用申请
     */
    RECEIVEAPPLY: 'receiveAdd',

    /**
     * 领用登记
     */
    RECEIVEREGISTER : 'receiveRegister',

    /**
     * 归还登记
     */
    RETURNADD : 'returnAdd',

    /**
     * 出租申请
     */
    RENTOUTAPPLY : 'rentalApplication',

    /**
     * 出租合同
     */
    RENTOUTCONTRACTADD : 'rentOutContractAdd',

    /**
     * 租金收取
     */
    NEWCHARGE: 'newCharge',

    /**
     * 出售申请
     */
    SELLAPPLYADD : 'sellApplyAdd',

    /**
     * 出售合同
     */
    SELLCONTRACTADD : 'sellContractAdd',

    /**
     * 供应商列表
     */
    ADDSUPPLIERINFORMATION: 'addSupplierInformation',

    /**
     * 供货物品
     */
    SUPPLIERPARTICULARS: 'supplierParticulars',

    /**
     * 供应商信用评审
     */
    ADDSUPPLIERCREDITRATING: 'addSupplierCreditRating',
    
    /**
     * 报废申请
     */
    SCRAPRECORDINFO: 'scrapRecordInfo',

    /**
     * 锁定库存信息
     */
    LOCKINVENTORYINFORMATION: 'lockInventoryInformation',
    
    /**
     * 现场收货单
     */
    SITERECEIPT:'siteReceipt',

    /**
     * 生成出库单
     */
    OUTBOUNDORDERINFO: 'outboundOrderInfo',

    /**
     * 期末盘点
     */
    FINALINVENTORYINFO: 'finalInventoryInfo',

    // 退货信息
    // RETURNINFORMATION: 'returnInformation',
    
    // 换货信息
    // EXCHANGEINFORMATION: 'exchangeInformation',

    /**
     * 其它仓库信息
     */
    OTHERWAREHOUSESINFO: 'otherWarehousesInfo',

    /**
     * 退换货信息
     */
    RETURNEDGOODSINFO: 'returnedGoodsInfo',

    /**
     * 采购入库
     */
    PURCHASEWAREHOUSINGINFO: 'purchaseWarehousingInfo',

    /**
     * 采购申请
     */
    ADDPURCHASEREQUEST: 'addPurchaseRequest',

    /**
     * 采购任务
     */
    PURCHASETASK: 'purchaseTask',

    /**
     * 采购询价
     */
    ADDPURCHASEENQUIRY: 'addPurchaseEnquiry',

    /**
     * 采购订单
     */
    ADDPURCHASEORDER: 'addPurchaseOrder',

    /**
     * 采购合同
     */
    ADDPURCHASECONTRACT: 'addPurchaseContract',

    /**
     * 库存调拨
     */
    ADDINVENTORYALLOCATION: 'addInventoryAllocation'
}

export const PROPRIETARYPROJECT = {

    /**
     * 自营项目的基础信息
     */
    ANNOUNCEMENTBASICINFORMATION: 'announcementBasicInformation',

    /**
     * 招标公告信息
     */
    ANNOUNCEMENTCHANGE: 'announcementChange',

    /**
     * 招标公告变更
     */
    ADDANNOUNCEMENTINFORMATION: 'addAnnouncementInformation',

    /**
     * 招标评价
     */
    ADDTENDERGRADING: 'addTenderGrading',
    
    /**
     * 现场勘察登记
     */
    ADDSCENINVESTIGATION: 'addSceneInvestigation',

    /**
     * 我方招标 - 招标联系信息
     */
    BIDDINGCONTACTINFORMATION: 'biddingContactInformation',

    /**
     * 招标文件答疑
     */
    ADDQABIDDINGDOCUMENTS: 'addQABiddingDocuments',

    /**
     * 新建资格预审文件审核
     */
    ADDPREQUALIFICATIONDOCUMENTS: 'addPrequalificationDocuments',

    /**
     * 新建招标文件编制审核
     */
    ADDBIDFILEDOC : 'addBidFileDoc',

    /**
     * 底部信息
     */
    BOTTOMINFORMATION: 'bottomInformation',

    /**
     * 底部信息 非栅格布局
     */
    BOTTOMINFORMATIONNOTGRID: 'bottomInformationNotGrid',

    /**
     * 项目基本信息 （非前期跟踪）
     */
    PROJECTINFORMATIONBASIC: 'projectinformationBasic',

    /**
     * 项目部组建
     */
    ADDPROJECTDEPARTMENT: 'addProjectDepartment',

    /**
     * 分包管理
     */
    ADDSUBCONTRACTMANAGEMENT: 'addSubcontractManagement',

    /**
     * 图纸会审
     */
    ADDBLUEPRINTAUDIT: 'addBlueprintAudit',

    /**
     * 施工方案
     */
    ADDCONSTRUCTIONSCHEME: 'addConstructionScheme',

    /**
     * 三通一平
     */
    ADDTHREESUPPLIESONELEVELING: 'addThreeSuppliesOneLeveling',

    /**
     * 安全管理- 安全检查记录
     */
    ADDINSPECTION : 'addInspection',

    /**
     * 安全管理- 安全整改信息
     */
    ADDSAFETYMEASURES : 'addSafetyMeasures',

    /**
     * 安全管理- 安全事故报告
     */
    ADDSAFETYINCIDENTREPORT: 'addSafetyIncidentReport',

    /**
     * 安全管理- 安全事故处理
     */
    ADDACCIDENTHANDLINGRECORD: 'addAccidentHandlingRecord',

    /**
     * 质量管理- 质量检查
     */
    ADDQUALITYINSPECTION :'addQualityInspection',

    /**
     * 质量管理- 质量整改
     */
    ADDQUALITYIMPROVEMENT : 'addQualityImprovement',

    /**
     * 进度追踪
     */
    ADDSCHEDULEPLANNEW : 'addSchedulePlanNew',

    /**
     * 安全设备巡查
     */
    ADDDEVICESAFETY : 'addDeviceSafety',

    // 成本核销
    /**
     * 成本核销
     */
    COSTDIVISION: 'costDivision',

    /**
     * 合同基本信息
     */
    BASICSCONTRACT: 'basicsContract',

    /**
     * 合同签订（项目）
     */
    ADDSELFPROJECTCONTRACTCONCLUDESIGN: 'addSelfProjectContractConcludeSign',

    /**
     * 合同计量（项目）
     */
    ADDSELFPROJECTCONTRACTMEASURE: 'addSelfProjectContractMeasure',

    /**
     * 合同结算（项目）
     */
    ADDSELFPROJECTCONTRACTSETTLEACCOUNTS: 'addSelfProjectContractSettleAccounts',
    
    //           - 进度管理 -
    /**
     * 进度计划添加
     */ 
    SCHEDULEPLANADD : 'schedulePlanAdd',
    SCHEDULEPLANADD2 : 'schedulePlanAdd2',

    // 进度计划提交
    SUBSCHEDULEPLANLIST : 'subSchedulePlanList',

    // 进度记录添加
    ADDPROCESSRECORD : 'addProcessRecord',

    //      - 经济核算 -
    // 
    /**
     *  收入登记基本信息 
    */
    BASICINFORMATIONINCOMEREGISTRATION:'addIncomeRegistered',

    /**
     *  收入登记基本信息 
    */
   ADDINCOME:'addIncome',

   /**
     *  责任成本
    */
   ADDRESPONSIBILITYCOST:'responsibilityCost',

   /**
     *  目标成本
    */
   ADDTARGETCOST: 'targetCost',
    /**
     *  成本登记添加
    */
   COSTREGISTRATIONADDITION: 'costRegistrationAddition',

   /**
    *  质量目标添加
    */
   QUALITYOBJECTIVES: 'qualityObjectives',

   /**
    *  质量目标提交
    */
   ADDQQUALITYOBJECTIVES: 'addQualityObjectives',

   /**
    *  质量规范添加
    */
   ADDQUALITYSTANDARD: 'addQualityStandard',

   /**
    *  质量类型
    */
   QUALITYTYPE: 'qualityType',

   /**
    *  质量验收添加
    */
   QUALITYCHECKACCEPT: 'qualityCheckAccept',

   /**
    *  质量验收提交
    */
   ADDQUALITYCHECKACCEPT: 'addQualityCheckAccept',

   /**
    *  质量亮点
    */
   ADDQUALITYBRIGHTSPOT: 'addQualityBrightSpot',

   /**
    *  保证金缴纳
    */
   ADDPAYMENTDEPOSIT: 'addPaymentDeposit',

   /**
    *  保证金退还
    */
   ADDRETURNDEPOSIT: 'addReturnDeposit',

   /**
     * 发票关联信息
     */
    INVOICERLATEDINFORMATION: 'invoiceRelatedInformation',

    /**
     * 添加开票管理
     */
    ADDINVOICESBILLINGREGISTRATIONLIST: 'addInvoicesBillingRegistrationList',

    /**
     * 添加收票管理
     */
    ADDCONTROLTICKETRECEIPTREGISTRATION: 'addControlTicketReceiptRegistration',

    /**
     * 发票抵扣
     */
    ADDCONTROLINVOICEDEDUCTION: 'addControlInvoiceDeduction',
    
     /**
     * 发票管理-发票退税
     */
    ADDINVOICEDRAWBACKPAGE: 'addInvoiceDrawBackPage',

    /**
     * 发票管理-异常标记
     */
    ADDINVOICEABNORMALREGISTRATIONPAGE: 'addInvoiceAbnormalRegistrationPage',
}

/**
 * 合同
 */
export const CONTRACT = {

    /**
     * 合同签订（合同）
     */
    ADDCONTRACTCONCLUDESIGN: 'addContractConcludeSign',

    /**
     * 合同计量（合同）
     */
    ADDCONTRACTMEASURE: 'addContractMeasure',

    /**
     * 合同结算（合同）
     */
    ADDCONTRACTSETTLEACCOUNTS: 'addContractSettleAccounts',

}

/**
 *  发票管理
 */
export const INVOICE = {
    
    /**
     * 添加开票管理
     */
    ADDBILLINGREGISTRATIONLIST: 'addBillingRegistrationList',

    /**
     * 添加收票管理
     */
    ADDTICKETRECEIPTREGISTRATION: 'addTicketReceiptRegistration',

    /**
     * 发票抵扣
     */
    ADDINVOICEDEDUCTION:'addInvoiceDeduction',
    
     /**
     * 发票管理-发票退税
     */
    ADDINVOICEDRAWBACK:'addInvoiceDrawBack',

    /**
     * 发票管理-异常标记
     */
    ADDINVOICEABNORMALREGISTRATION:'addInvoiceAbnormalRegistration',
}