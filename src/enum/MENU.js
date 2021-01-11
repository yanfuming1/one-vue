const _import = require('@/libs/util.import.' + process.env.NODE_ENV)
const meta = {}

export const MENU = [
    {
        path: '/systemManagement',
        arrElem: [
            {
                path: '/systemManagement/workflowModelEditForm',
                name: 'workflowModelEditForm',
                title: "流程模型详情",
                icon: 'dot-circle-o',
                meta: {
                    ...meta,
                    title: '流程模型详情'
                },
                component: () => import('@/views/systemManagement/workflowModelEditForm')
            },
            {
                path: '/systemManagement/processDefinition',
                name: 'processDefinition',
                title: "流程设计器",
                icon: 'dot-circle-o',
                meta: {
                    ...meta,
                    title: '流程设计器'
                },
                component: () => import('@/views/systemManagement/processDefinition')
            }
        ]
    },{
        path: '/personal-information',
        arrElem: [
            {
                path: 'newsDetail',
                name: 'newsDetail',
                title: '消息详情',
                icon: 'dot-circle-o',
                component: () => import('@/views/personal-information/message-management/myNews/newsDetail'),
                meta: { ...meta, title: '消息详情' }
            }
        ]
    },{
        path: '/administrativeManagement',
        arrElem: [
            {
                path: 'newCompany',
                name: 'newCompany',
                title: "驻外机构",
                icon: 'dot-circle-o',
                component: () => import('@/views/administrativeManagement/constituentCompany/components/newCompany'),
                meta: { ...meta, title: '驻外机构' }
            },
            {
                path: 'officialDocument',
                name: 'officialDocument',
                title: "证书",
                icon: 'dot-circle-o',
                component: () => import('@/views/officialDocument/personal/infoRegister/components/createNewCer/index'),
                meta: { ...meta, title: '证书' }
            },
            {
                path: 'officialDocumentDetail',
                name: 'officialDocumentDetail',
                title: "证书详情",
                icon: 'dot-circle-o',
                component: () => import('@/views/officialDocument/personal/infoRegister/components/createNewCer/index'),
                meta: { ...meta, title: '证书详情' }
            },
            {
                path: 'cerBorrow',
                name: 'cerBorrow',
                title: '证书借用',
                component: () => import('@/views/officialDocument/personal/infoRegister/components/components/useFlowB'),
                meta: { title: '证书借用' }
            },
            {
                path: 'cerBorrowC',
                name: 'cerBorrowC',
                title: '公司证书借用',
                component: () => import('@/views/officialDocument/company/infoRegisterC/borrowOut/index'),
                meta: { title: '公司证书借用' }
            },
            {
                path: 'payCall',
                name: 'payCall',
                title: '挂靠费用申请',
                component: () => import('@/views/officialDocument/personal/infoRegister/components/components/payCall'),
                meta: { title: '挂靠费用申请' }
            },
            {
                path: 'borrowingApply',
                name: 'borrowingApply',
                title: '借阅申请',
                component: () => import('@/views/administrativeManagement/archivesManagement/borrowedRecord/components/borrowingApply'),
                meta: { ...meta, title: '借阅申请' }
            },
            {
                path: 'updataPrintsBeforeApply',
                name: 'updataPrintsBeforeApply',
                title: '刻章申请',
                component: () => import('@/views/administrativeManagement/managementSignet/printsBeforeApply/components/updataPrintsBeforeApply'),
                meta: { ...meta, title: '刻章申请' }
            },
            {
                path: 'updataUsingApplication',
                name: 'updataUsingApplication',
                title: '印章申请',
                component: () => import('@/views/administrativeManagement/managementSignet/usingApplication/components/updataUsingApplication'),
                meta: { ...meta, title: '印章申请' }
            },
            {
                path: 'addVehicleReimbursement',
                name: 'addVehicleReimbursement',
                title: '车辆费用报销详情',
                icon: 'dot-circle-o',
                component: () => import('@/views/administrativeManagement/vehicleManagement/vehicleExpenseReimbursement/components/addVehicleReimbursement'),
                meta: { ...meta, title: '车辆费用报销详情' }
            },
            {
                path: 'vehicleExpenseReimbursementAccounting',
                name: 'vehicleExpenseReimbursementAccounting',
                title: '车辆费用报销详情-会计',
                icon: 'dot-circle-o',
                component: () => import('@/views/administrativeManagement/vehicleManagement/vehicleExpenseReimbursement/components/addVehicleReimbursement'),
                meta: { ...meta, title: '车辆费用报销详情-会计' }
            },
            {
                path: 'vehicleExpenseReimbursementCashier',
                name: 'vehicleExpenseReimbursementCashier',
                title: '车辆费用报销详情-出纳',
                icon: 'dot-circle-o',
                component: () => import('@/views/administrativeManagement/vehicleManagement/vehicleExpenseReimbursement/components/addVehicleReimbursement'),
                meta: { ...meta, title: '车辆费用报销详情-出纳' }
            },
            {
                path: 'addVehicleUseRegistration',
                name: 'addVehicleUseRegistration',
                title: '车辆使用申请',
                component: () => import('@/views/administrativeManagement/vehicleManagement/vehicleUseRegistration/components/addVehicleUseRegistration'),
                meta: { title: '车辆使用申请' }
            },
            {
                path: 'addInformationRegistration',
                name: 'addInformationRegistration',
                title: '车辆信息登记',
                component: () => import('@/views/administrativeManagement/vehicleManagement/vehicleInformationRegistration/components/addInformationRegistration'),
                meta: { title: '车辆信息登记' }
            },
            {
                path: '车补标准设置',
                name: 'addVehicleRepair',
                title: '车补标准设置',
                component: () => import('@/views/administrativeManagement/vehicleManagement/setUpVehicleRepair/components/addVehicleRepair'),
                meta: { title: '车补标准设置' }
            },
            {
                path: 'addPublishNewsDialog',
                name: 'addPublishNewsDialog',
                title: '通知公告信息', 
                component: () => import('@/views/personal-information/message-management/components/addPublishNewsDialog'),
                meta: { title: '通知公告信息' }
            },
            {
                path: 'updataPostRegistration',
                name: 'updataPostRegistration',
                title: '发文管理',
                component: () => import('@/views/administrativeManagement/documentManagement/postRegistration/components/updataPostRegistration'),
                meta: { ...meta, title: '发文管理' }
            },
            {
                path: 'updataReceiptRegistration',
                name: 'updataReceiptRegistration',
                title: '收文管理',
                component: () => import('@/views/administrativeManagement/documentManagement/receiptRegistration/components/updataReceiptRegistration'),
                meta: { ...meta, title: '收文管理' }
            },
            {
                path: 'updataSummaryPlan',
                name: 'updataSummaryPlan',
                title: '总结计划',
                component: () => import('@/views/administrativeManagement/summaryPlan/components/updataSummaryPlan'),
                meta: { ...meta, title: '总结计划' }
            }
        ]
    },{
        path: '/customerManagement',
        arrElem:  [
            {
                path: '/customerManagement/addCustomer',
                name: 'addCustomer',
                title: '客户',
                icon: 'dot-circle-o',
                component: () => import('@/views/customerManagement/customerList/components/addCustomer'),
                meta: { ...meta, title: '客户' }
            }
        ]
    },{
        path: '/myCustomer',
        arrElem: [
            {
                path: '/customerManagement/myCustomer/accountInformationHistory',
                name: 'accountInformationHistory',
                title: '账户修改记录',
                icon: 'dot-circle-o',
                component: () => import('@/views/customerManagement/myCustomer/accountInformationHistory'),
                meta: { ...meta, title: '账户修改记录' }
            },
            {
                path: 'cashWithdrawal',
                name: 'cashWithdrawal',
                title: '联营资金账户-提现',
                icon: 'dot-circle-o',
                component: () => import('@/views/customerManagement/myCustomer/capitalAccount/capitalNeir/cashWithdrawal'),
                meta: { ...meta, title: '联营资金账户-提现' }
            },
            {
                path: 'cashWithdrawalAccount',
                name: 'cashWithdrawalAccount',
                title: '联营资金账户-提现-会计',
                icon: 'dot-circle-o',
                component: () => import('@/views/customerManagement/myCustomer/capitalAccount/capitalNeir/cashWithdrawal'),
                meta: { ...meta, title: '联营资金账户-提现-会计' }
            },
            {
                path: 'cashWithdrawalCashier',
                name: 'cashWithdrawalCashier',
                title: '联营资金账户-提现-出纳',
                icon: 'dot-circle-o',
                component: () => import('@/views/customerManagement/myCustomer/capitalAccount/capitalNeir/cashWithdrawal'),
                meta: { ...meta, title: '联营资金账户-提现-出纳' }
            }
        ]
    },{
        path: '/approval',
        arrElem: [
            {
                path: '/approval/staffLoanZJL',
                name: 'staffLoanZJL',
                title: '员工借款申请详情',
                component: () => import('@/views/approval/components/pushPage/staffLoan/staffLoanZJL'),
                meta: { title: '员工借款申请详情' }
            },
            {
                path: '/approval/staffLoanCNPage',
                name: 'staffLoanCNPage',
                title: '员工借款申请详情',
                component: () => import('@/views/approval/components/pushPage/staffLoan/staffLoanCNPage'),
                meta: { title: '员工借款申请详情' }
            },
            {
                path: '/approval/staffLoanKJPage',
                name: 'staffLoanKJPage',
                title: '员工借款申请详情',
                component: () => import('@/views/approval/components/pushPage/staffLoan/staffLoanKJPage'),
                meta: { title: '员工借款申请详情' }
            },
            {
                path: '/approval/paymentRequestKjPage',
                name: 'paymentRequestKjPage',
                title: '对外付款申请详情',
                component: () => import('@/views/approval/components/pushPage/paymentRequest/paymentRequestKjPage'),
                meta: { title: '对外付款申请详情' }
            },
            {
                path: '/approval/paymentRequestCNPage',
                name: 'paymentRequestCNPage',
                title: '对外付款申请详情',
                component: () => import('@/views/approval/components/pushPage/paymentRequest/paymentRequestCNPage'),
                meta: { title: '对外付款申请详情' }
            },
            {
                path: '/approval/paymentRequestZJL',
                name: 'paymentRequestZJL',
                title: '对外付款申请详情',
                component: () => import('@/views/approval/components/pushPage/paymentRequest/paymentRequestZJL'),
                meta: { title: '对外付款申请详情' }
            },
            {
                path: '/approval/nonbusinessIncomeRegisterCN',
                name: 'nonbusinessIncomeRegisterCN',
                title: '营业外收入登记详情',
                component: () => import('@/views/approval/components/pushPage/nonbusinessIncomeRegister/nonbusinessIncomeRegisterCN'),
                meta: { title: '营业外收入登记详情' }
            },
            {
                path: '/approval/nonbusinessIncomeRegisterKj',
                name: 'nonbusinessIncomeRegisterKj',
                title: '营业外收入登记详情',
                component: () => import('@/views/approval/components/pushPage/nonbusinessIncomeRegister/nonbusinessIncomeRegisterKj'),
                meta: { title: '营业外收入登记详情' }
            },
            {
                path: '/approval/nonbusinessIncomeRegisterZJL',
                name: 'nonbusinessIncomeRegisterZJL',
                title: '营业外收入登记详情',
                component: () => import('@/views/approval/components/pushPage/nonbusinessIncomeRegister/nonbusinessIncomeRegisterZJL'),
                meta: { title: '营业外收入登记详情' }
            },
            {
                path: '/approval/externalLloanKj',
                name: 'externalLloanKj',
                title: '对外贷款审批详情',
                component: () => import('@/views/approval/components/pushPage/externalLloan/externalLloanKj'),
                meta: { title: '对外贷款审批详情' }
            },
            {
                path: '/approval/externalLloanCN',
                name: 'externalLloanCN',
                title: '对外贷款审批详情',
                component: () => import('@/views/approval/components/pushPage/externalLloan/externalLloanKj'),
                meta: { title: '对外贷款审批详情' }
            },
            {
                path: '/approval/cashPaymentK',
                name: 'cashPaymentK',
                title: '保证金缴纳申请审批详情',
                component: () => import('@/views/approval/components/pushPage/projectCashRequest/cashPaymentK'),
                meta: { title: '保证金缴纳申请审批详情' }
            },
            {
                path: '/approval/cashPayment',
                name: 'cashPayment',
                title: '保证金缴纳详情',
                component: () => import('@/views/projectManagement/jontProjectDetail/cashDepositManagement/components/cashAdd'),
                meta: { title: '保证金缴纳详情' }
            },
            {
                path: '/approval/cashReturn',
                name: 'cashReturn',
                title: '保证金退还审批',
                component: () => import('@/views/projectManagement/jontProjectDetail/cashDepositManagement/components/cashReturn'),
                meta: { title: '保证金退还审批' }
            },
            {
                path: '/approval/cashReturnKJ',
                name: 'cashReturnKJ',
                title: '保证金退还审批',
                component: () => import('@/views/approval/components/pushPage/projectCashRequest/cashReturnKJ'),
                meta: { title: '保证金退还审批' }
            },
            {
                path: '/approval/cashReturnZJL',
                name: 'cashReturnZJL',
                title: '保证金退还审批详情',
                component: () => import('@/views/approval/components/pushPage/projectCashRequest/cashReturnZJL'),
                meta: { title: '保证金退还审批详情' }
            },
            {
                path: '/approval/externalLloanZjl',
                name: 'externalLloanZjl',
                title: '对外贷款审批详情',
                component: () => import('@/views/approval/components/pushPage/externalLloan/externalLloanKj'),
                meta: { title: '对外贷款审批详情' }
            },
            {
                path: '/approval/agentBusinessKJ',
                name: 'agentBusinessKJ',
                title: '代收代付审批详情',
                component: () => import('@/views/approval/components/pushPage/agentBusinessRequest/agentBusinessKJ'),
                meta: { title: '代收代付审批详情' }
            },
            {
                path: '/approval/agentBusinessZJL',
                name: 'agentBusinessZJL',
                title: '代收代付审批详情',
                component: () => import('@/views/projectManagement/jontProjectDetail/agentBusinessManagement/components/newAgent'), 
                meta: { title: '代收代付审批详情' }
            },
            {
                path: '/approval/staffReimburseKj',
                name: 'staffReimburseKj',
                title: '员工报销申请详情',
                component: () => import('@/views/approval/components/pushPage/staffReimburse/staffReimburseKj'),
                meta: { title: '员工报销申请' }
            },
            {
                path: '/approval/staffReimburseCN',
                name: 'staffReimburseCN',
                title: '员工报销申请详情',
                component: () => import('@/views/approval/components/pushPage/staffReimburse/staffReimburseKj'),
                meta: { title: '员工报销申请' }
            },
            {
                path: '/approval/staffReimburseZJL',
                name: 'staffReimburseZJL',
                title: '员工报销申请详情',
                component: () => import('@/views/approval/components/pushPage/staffReimburse/staffReimburseKj'),
                meta: { title: '员工报销申请' }
            },
            {
                path: '/approval/projectPaymentBZ',
                name: 'projectPaymentBZ',
                title: '工程款支付申请审批',
                component: () => import('@/views/approval/components/pushPage/projectPayment/projectPaymentBZ'),
                meta: { title: '工程款支付申请审批' }
            },
            {
                path: '/approval/projectPaymentKJ',
                name: 'projectPaymentKJ',
                title: '工程款支付申请审批',
                component: () => import('@/views/approval/components/pushPage/projectPayment/projectPaymentKJ'),
                meta: { title: '工程款支付申请审批' }
            },
            {
                path: '/approval/leaveApplication',
                name: 'leaveApplication',
                title: '离职审批',
                component: () => import('@/views/personnelManagement/resignationApplicationModule/components/addResignationApplication'),
                meta: { title: '离职审批' }
            },
            {
                path: '/approval/noticeDismissal',
                name: 'noticeDismissal',
                title: '辞退审批',
                component: () => import('@/views/personnelManagement/retirementNotificationModule/components/addRetirementNotification'),
                meta: { title: '辞退审批' }
            },
            {
                path: '/approval/useFlowCerBorrow',
                name: 'useFlowCerBorrow',
                title: '证书借用审批',
                component: () => import('@/views/officialDocument/personal/infoRegister/components/components/useFlowB'),
                meta: { title: '证书借用审批' }
            },
            {
                path: '/approval/cerBorrowOut',
                name: 'cerBorrowOut',
                title: '证书借用审批',
                component: () => import('@/views/officialDocument/personal/infoRegister/components/components/useFlowB'),
                meta: { title: '证书借用审批' }
            },
            {
                path: '/approval/cerPayRegister',
                name: 'cerPayRegister',
                title: '挂靠费用审批',
                component: () => import('@/views/officialDocument/personal/infoRegister/components/components/payCall'),
                meta: { title: '挂靠费用审批' }
            },
            {
                path: '/approval/payCallKj',
                name: 'payCallKj',
                title: '挂靠费用审批',
                component: () => import('@/views/approval/components/pushPage/cerPayCall/payCallKj'),
                meta: { title: '挂靠费用审批' }
            },
            {
                path: '/approval/companyCerBorrow',
                name: 'companyCerBorrow',
                title: '公司证书借用审批',
                component: () => import('@/views/officialDocument/company/infoRegisterC/borrowOut/index'),
                meta: { title: '公司证书借用审批' }
            }, // rentalApplication
            {
                path: '/approval/rentalApplication',
                name: 'rentalApplication',
                title: '出租申请审批',
                component: () => import('@/views/materialEquipmentManagement/rentOutManagement/rentOutApply/components/rentOutAdd'),
                meta: { title: '出租申请审批' }
            },
            {
                path: '/approval/selfProjectRegistration',
                name: 'selfProjectRegistration',
                title: '自营项目立项登记审批',
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/projectRegistration'),
                meta: { title: '自营项目立项登记审批' }
            },
            {
                path: '/approval/selfProjectApplication',
                name: 'selfProjectApplication',
                title: '自营项目报名申请审批',
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/ourBidding/projectApplication'),
                meta: { title: '自营项目报名申请审批' }
            },
            {
                path: '/approval/addBidFileDoc',
                name: 'addBidFileDoc',
                title: '自营项目报名申请审批',
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/ourBidding/prequalificationDocuments/components/addPrequalificationDocuments'),
                meta: { title: '自营项目报名申请审批' }
            },
            {
                path: '/approval/selfOpenTender',
                name: 'selfOpenTender',
                title: '自营项目开标登记审批',
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/ourBidding/openTender'),
                meta: { title: '自营项目开标登记审批' }
            },
            {
                path: '/approval/projectSegregationAdd',
                name: 'projectSegregationAdd',
                title: '自营项目划分审批',
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/projectSegregation/index'),
                meta: { title: '自营项目划分审批' }
            },
            {
                path: '/approval/addSafetyMeasures',
                name: 'addSafetyMeasures',
                title: '安全整改审批',
                meta: { title: '安全整改审批'},
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/safetyManagement/safetyMeasuresRecord/components/safetyMeasures')
            },
            {
                path: '/approval/invoiceRelatedInformation',
                name: 'invoiceRelatedInformation',
                title: '添加开票审批',
                meta: {
                    ...meta,
                    title: '添加开票审批'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/controlOverInvoices/billingRegistration/components/addBillingRegistrationList')
            },
        ]
    },{
        path: '/jontProjectDetail',
        arrElem: [
            {
                path: 'cashAdd',
                name: 'cashAdd',
                title: '保证金缴纳',
                component: () => import('@/views/projectManagement/jontProjectDetail/cashDepositManagement/components/cashAdd'),
                meta: { title: '保证金缴纳' }
            },{
                path: 'cashReturns',
                name: 'cashReturns',
                title: '保证金退还',
                component: () => import('@/views/projectManagement/jontProjectDetail/cashDepositManagement/components/cashReturn'),
                meta: { title: '保证金退还' }
            },{
                path: 'newAgent',
                name: 'newAgent',
                title: '代收代付申请',
                component: () => import('@/views/projectManagement/jontProjectDetail/agentBusinessManagement/components/newAgent'),
                meta: { title: '代收代付申请' }
            },{
                path: 'projectArriveAdd',
                name: 'projectArriveAdd',
                title: '工程款到账登记添加',
                component: () => import('@/views/projectManagement/jontProjectDetail/projectFundsArrive/components/newArrive'),
                meta: { title: '工程款到账登记添加' }
            },{
                path: 'projectPaymentAdd',
                name: 'projectPaymentAdd',
                title: '工程款支付申请添加',
                component: () => import('@/views/projectManagement/jontProjectDetail/projectPayment/components/projectPaymentAdd'),
                meta: { title: '工程款支付申请添加' }
            },{
                path: 'addProjectPatrolRegistration',
                name: 'addProjectPatrolRegistration',
                title: '添加工程巡查记录',
                component: () => import('@/views/projectManagement/jontProjectDetail/projectInspectionRegistration/components/addProjectPatrolRegistration'),
                meta: { title: '添加工程巡查记录' }
            },{
                path: 'borrowingApplyProject',
                name: 'borrowingApplyProject',
                title: '借阅申请',
                component: () => import('@/views/administrativeManagement/archivesManagement/borrowedRecord/components/borrowingApply'),
                meta: { ...meta, title: '借阅申请' }
            },
            {
                path: 'addJointProjectContractConcludeSign',
                name: 'addJointProjectContractConcludeSign',
                title: '合同签订',
                meta: {
                    ...meta,
                    title: '合同签订'
                },
                params: {
                    identification: '2'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/contract/contractConcludeSign/components/addContractConcludeSign')
            },
            {
                path: 'addJointProjectContractMeasure',
                name: 'addJointProjectContractMeasure',
                title: '添加合同计量',
                meta: {
                    ...meta,
                    title: '添加合同计量'
                },
                params: {
                    identification: '2'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/contract/contractMeasure/components/addContractMeasure')
            },
            {
                path: 'jointProjectSettleAccountsRecord',
                name: 'jointProjectSettleAccountsRecord',
                title: '合同记录列表',
                meta: {
                    ...meta,
                    title: '合同记录列表'
                },
                params: {
                    identification: '2'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/contract/contractSettleAccounts/components/settleAccountsRecord')
            },
            {
                path: 'addJointProjectContractSettleAccounts',
                name: 'addJointProjectContractSettleAccounts',
                title: '合同结算',
                meta: {
                    ...meta,
                    title: '合同结算'
                },
                params: {
                    identification: '2'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/contract/contractSettleAccounts/components/addContractSettleAccounts')
            },
            {
                path: 'contractJointProjectSettleAccountsAccount',
                name: 'contractJointProjectSettleAccountsAccount',
                title: '合同结算会计',
                meta: {
                    ...meta,
                    title: '合同结算会计'
                },
                params: {
                    identification: '2'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/contract/contractSettleAccounts/components/addContractSettleAccounts')
            },
            {
                path: 'contractJointProjectSettleAccountsCashier',
                name: 'contractJointProjectSettleAccountsCashier',
                title: '合同结算出纳',
                meta: {
                    ...meta,
                    title: '合同结算出纳'
                },
                params: {
                    identification: '2'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/contract/contractSettleAccounts/components/addContractSettleAccounts')
            },
            {
                path: 'inputJointProjectInvoice',
                name: 'inputJointProjectInvoice',
                title: '进项发票列表',
                meta: {
                    ...meta,
                    title: '进项发票列表'
                },
                params: {
                    identification: '2',
                    identifying: '2'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/contract/contractInvoice/inputInvoice')
            },
            {
                path: 'outputJointProjectInvoice',
                name: 'outputJointProjectInvoice',
                title: '销项发票列表',
                meta: {
                    ...meta,
                    title: '销项发票列表'
                },
                params: {
                    identification: '2',
                    identifying: '1'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/contract/contractInvoice/outputInvoice')
            },
            {
                path: 'addJointControlTicketReceiptRegistration',
                name: 'addJointControlTicketReceiptRegistration',
                title: '添加进项发票',
                meta: {
                    ...meta,
                    title: '添加进项发票'
                },
                params: {
                    identification: '2',
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/controlOverInvoices/ticketReceiptRegistration/components/addTicketReceiptRegistration')
            },
            {
                path: 'addJointInvoicesBillingRegistrationList',
                name: 'addJointInvoicesBillingRegistrationList',
                title: '添加销项发票',
                meta: {
                    ...meta,
                    title: '添加销项发票'
                },
                params: {
                    identification: '2',
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/controlOverInvoices/billingRegistration/components/addBillingRegistrationList')
            },
            {
                path: 'addJointControlInvoiceDeduction',
                name: 'addJointControlInvoiceDeduction',
                title: '添加发票抵扣',
                meta: {
                    ...meta,
                    title: '添加发票抵扣'
                },
                params: {
                    identification: '2',
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/controlOverInvoices/InvoiceDeduction/components/addInvoiceDeduction')
            },
            {
                path: 'addJointInvoiceAbnormalRegistrationPage',
                name: 'addJointInvoiceAbnormalRegistrationPage',
                title: '异常登记',
                meta: {
                    ...meta,
                    title: '异常登记'
                },
                params: {
                    identification: '2',
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/controlOverInvoices/InvoiceAbnormalRegistration/components/addInvoiceAbnormalRegistration')
            },
            {
                path: 'addJointInvoiceDrawBackPage',
                name: 'addJointInvoiceDrawBackPage',
                title: '申请退税',
                meta: {
                    ...meta,
                    title: '申请退税'
                },
                params: {
                    identification: '2',
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/controlOverInvoices/InvoiceDrawBack/components/addInvoiceDrawBack')
            },
        ]
    },{
        path: '/selfSupportProjectDetail',
        arrElem: [
            {
                path: 'earlyStageAdd',
                name: 'earlyStageAdd',
                title: '新建前期跟踪',
                meta: {
                    ...meta,
                    title: '新建前期跟踪'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/earlyStage/newEarlyStage/newStage')
            },
            {
                path: 'addAnnouncementInformation',
                name: 'addAnnouncementInformation',
                title: '招标公告变更',
                meta: {
                    ...meta,
                    title: '招标公告变更'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/businessBidding/announcementInformation/components/addAnnouncementInformation')
            },
            {
                path: 'addSceneInvestigation',
                name: 'addSceneInvestigation',
                title: '新建现场勘察登记',
                meta: {
                    ...meta,
                    title: '新建现场勘察登记'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/ourBidding/siteInvestigationRegistration/components/addSceneInvestigation')
            },
            {
                path: 'addQABiddingDocuments',
                name: 'addQABiddingDocuments',
                title: '新建招标文件答疑',
                meta: {
                    ...meta,
                    title: '新建招标文件答疑'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/ourBidding/QABiddingDocuments/components/addQABiddingDocuments')
            },
            {
                path: 'addPrequalificationDocuments',
                name: 'addPrequalificationDocuments',
                title: '新建资格预审文件审核',
                meta: {
                    ...meta,
                    title: '新建资格预审文件审核'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/ourBidding/prequalificationDocuments/components/addPrequalificationDocuments')
            },
            {
                path: 'addTenderGrading',
                name: 'addTenderGrading',
                title: '招标评分',
                meta: {
                    ...meta,
                    title: '招标评分'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/businessBidding/tenderGrading/components/addTenderGrading')
            },
            {
                path: 'addProjectDepartment',
                name: 'addProjectDepartment',
                title: '项目部组建',
                meta: {
                    ...meta,
                    title: '项目部组建'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/operatingReserve/projectDepartment/components/addProjectDepartment')
            },
            {
                path: 'addSubcontractManagement',
                name: 'addSubcontractManagement',
                title: '分包管理',
                meta: {
                    ...meta,
                    title: '分包管理'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/operatingReserve/subcontractManagement/components/addSubcontractManagement')
            },
            {
                path: 'addBlueprintAudit',
                name: 'addBlueprintAudit',
                title: '图纸会审',
                meta: {
                    ...meta,
                    title: '图纸会审'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/operatingReserve/blueprintAudit/components/addBlueprintAudit')
            },
            {
                path: 'addConstructionScheme',
                name: 'addConstructionScheme',
                title: '施工方案',
                meta: {
                    ...meta,
                    title: '施工方案'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/operatingReserve/constructionScheme/components/addConstructionScheme')
            },
            {
                path: 'addThreeSuppliesOneLeveling',
                name: 'addThreeSuppliesOneLeveling',
                title: '三通一平',
                meta: {
                    ...meta,
                    title: '三通一平'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/operatingReserve/threeSuppliesOneLeveling/components/addThreeSuppliesOneLeveling')
            },
            {
                path: 'addBudgetInfo',
                name: 'addBudgetInfo',
                title: '自营项目预算添加',
                meta: {
                    ...meta,
                    title: '自营项目预算添加'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/budgetControl/budgetInfo/components/addBudgetInfo')
            },
            {
                path: 'addBudgetChangeInfo',
                name: 'addBudgetChangeInfo',
                title: '自营项目预算变更添加',
                meta: {
                    ...meta,
                    title: '自营项目预算变更添加'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/budgetControl/budgetChange/components/addBudgetChangeInfo')
            },
            {
                path: 'addInspection',
                name: 'addInspection',
                title: '安全检查审批',
                meta: {
                    ...meta,
                    title: '安全检查审批'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/safetyManagement/safetyInspectionRecord/components/addInspection')
            },
            {
                path: 'safetyMeasures',
                name: 'safetyMeasures',
                title: '安全整改审批',
                meta: {
                    ...meta,
                    title: '安全整改审批'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/safetyManagement/safetyMeasuresRecord/components/safetyMeasures')
            },
            {
                path: 'addSafetyIncidentReport',
                name: 'addSafetyIncidentReport',
                title: '安全事故报告审批',
                meta: {
                    ...meta,
                    title: '安全事故报告审批'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/safetyManagement/safetyIncidentReport/components/addSafetyIncidentReport')
            },
            {
                path: 'addAccidentHandlingRecord',
                name: 'addAccidentHandlingRecord',
                title: '安全事故处理审批',
                meta: {
                    ...meta,
                    title: '安全事故处理审批'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/safetyManagement/accidentHandlingRecord/components/addAccidentHandlingRecord')
            },
            
            {
                path: 'addQualityInspection',
                name: 'addQualityInspection',
                title: '质量检查添加',
                meta: {
                    ...meta,
                    title: '质量检查添加'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/qualityControl/qualityInspection/components/addQualityInspection')
            },
            {
                path: 'addQualityImprovement',
                name: 'addQualityImprovement',
                title: '质量整改添加',
                meta: {
                    ...meta,
                    title: '质量整改添加'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/qualityControl/qualityImprovement/components/addQualityImprovement')
            },
            {
                path: 'addControlTicketReceiptRegistration',
                name: 'addControlTicketReceiptRegistration',
                title: '添加收票',
                meta: {
                    ...meta,
                    title: '添加收票'
                },
                params: {
                    identification: '1',
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/controlOverInvoices/ticketReceiptRegistration/components/addTicketReceiptRegistration')
            },
            {
                path: 'addInvoicesBillingRegistrationList',
                name: 'addInvoicesBillingRegistrationList',
                title: '添加开票',
                meta: {
                    ...meta,
                    title: '添加开票'
                },
                params: {
                    identification: '1',
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/controlOverInvoices/billingRegistration/components/addBillingRegistrationList')
            },
            {
                path: 'addControlInvoiceDeduction',
                name: 'addControlInvoiceDeduction',
                title: '添加发票抵扣',
                meta: {
                    ...meta,
                    title: '添加发票抵扣'
                },
                params: {
                    identification: '1',
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/controlOverInvoices/InvoiceDeduction/components/addInvoiceDeduction')
            },
            {
                path: 'addControlInvoiceDrawBack',
                name: 'addControlInvoiceDrawBack',
                title: '添加异常登记',
                meta: {
                    ...meta,
                    title: '添加异常登记'
                },
                params: {
                    identification: '1',
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/controlOverInvoices/InvoiceDrawBack/components/addInvoiceDrawBack')
            },
            {
                path: 'addInvoiceAbnormalRegistrationPage',
                name: 'addInvoiceAbnormalRegistrationPage',
                title: '异常登记',
                meta: {
                    ...meta,
                    title: '异常登记'
                },
                params: {
                    identification: '1',
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/controlOverInvoices/InvoiceAbnormalRegistration/components/addInvoiceAbnormalRegistration')
            },
            {
                path: 'addInvoiceDrawBackPage',
                name: 'addInvoiceDrawBackPage',
                title: '申请退税',
                meta: {
                    ...meta,
                    title: '申请退税'
                },
                params: {
                    identification: '1',
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/controlOverInvoices/InvoiceDrawBack/components/addInvoiceDrawBack')
            },
            // {
            //     path: 'addSchedulePlanNew',
            //     name: 'addSchedulePlanNew',
            //     title: '进度追踪审批',
            //     meta: {
            //         ...meta,
            //         title: '进度追踪审批'
            //     },
            //     component: () => import('@/views/projectManagement/selfSupportProjectDetail/scheduleManagement/schedulePlanNew/components/addSchedulePlanNew')
            // },
            {
                path: 'schedulePlanPageAdd',
                name: 'schedulePlanPageAdd',
                title: '进度计划添加',
                meta: {
                    ...meta,
                    title: '进度计划添加'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/scheduleManagement/schedulePlan/components/schedulePlanPageAdd')
            },
            {
                path: 'addProcessRecord',
                name: 'addProcessRecord',
                title: '进度计划记录添加',
                meta: {
                    ...meta,
                    title: '进度计划记录添加'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/scheduleManagement/schedulePlan/components/components/addProcessRecord')
            },
            {
                path: 'processWarningPage',
                name: 'processWarningPage',
                title: '进度预警',
                meta: {
                    ...meta,
                    title: '进度预警'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/scheduleManagement/processWarning/components/processWarningPage')
            },
            {
                path: 'processStalkerPage',
                name: 'processStalkerPage',
                title: '进度跟踪详情',
                meta: {
                    ...meta,
                    title: '进度跟踪详情'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/scheduleManagement/processStalker/components/processStalkerPage')
            },
            {
                path: 'hysteresisPage',
                name: 'hysteresisPage',
                title: '滞后分析',
                meta: {
                    ...meta,
                    title: '滞后分析'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/scheduleManagement/processStalker/components/hysteresisPage')
            },
            {
                path: 'analyzeDetail',
                name: 'analyzeDetail',
                title: '进度分析详情',
                meta: {
                    ...meta,
                    title: '进度分析详情'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/scheduleManagement/analyze/components/analyzeDetail')
            },
            {
                path: 'addDeviceSafety',
                name: 'addDeviceSafety',
                title: '安全设备巡查审批',
                meta: {
                    ...meta,
                    title: '安全设备巡查审批'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/safetyManagement/deviceSafetyRecord/components/addDeviceSafety')
            },
            {
                path: 'addSelfProjectContractConcludeSign',
                name: 'addSelfProjectContractConcludeSign',
                title: '合同签订',
                meta: {
                    ...meta,
                    title: '合同签订'
                },
                params: {
                    identification: '1'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/contract/contractConcludeSign/components/addContractConcludeSign')
            },
            {
                path: 'addSelfProjectContractMeasure',
                name: 'addSelfProjectContractMeasure',
                title: '添加合同计量',
                meta: {
                    ...meta,
                    title: '添加合同计量'
                },
                params: {
                    identification: '1'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/contract/contractMeasure/components/addContractMeasure')
            },
            {
                path: 'selfProjectSettleAccountsRecord',
                name: 'selfProjectSettleAccountsRecord',
                title: '合同记录列表',
                meta: {
                    ...meta,
                    title: '合同记录列表'
                },
                params: {
                    identification: '1'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/contract/contractSettleAccounts/components/settleAccountsRecord')
            },
            {
                path: 'addSelfProjectContractSettleAccounts',
                name: 'addSelfProjectContractSettleAccounts',
                title: '合同结算',
                meta: {
                    ...meta,
                    title: '合同结算'
                },
                params: {
                    identification: '1'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/contract/contractSettleAccounts/components/addContractSettleAccounts')
            },
            {
                path: 'contractSelfProjectSettleAccountsAccount',
                name: 'contractSelfProjectSettleAccountsAccount',
                title: '合同结算会计',
                meta: {
                    ...meta,
                    title: '合同结算会计'
                },
                params: {
                    identification: '1'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/contract/contractSettleAccounts/components/addContractSettleAccounts')
            },
            {
                path: 'contractSelfProjectSettleAccountsCashier',
                name: 'contractSelfProjectSettleAccountsCashier',
                title: '合同结算出纳',
                meta: {
                    ...meta,
                    title: '合同结算出纳'
                },
                params: {
                    identification: '1'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/contract/contractSettleAccounts/components/addContractSettleAccounts')
            },
            {
                path: 'inputSelfProjectInvoice',
                name: 'inputSelfProjectInvoice',
                title: '进项发票列表',
                meta: {
                    ...meta,
                    title: '进项发票列表'
                },
                params: {
                    identification: '1',
                    identifying: '2'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/contract/contractInvoice/inputInvoice')
            },
            {
                path: 'outputSelfProjectInvoice',
                name: 'outputSelfProjectInvoice',
                title: '销项发票列表',
                meta: {
                    ...meta,
                    title: '销项发票列表'
                },
                params: {
                    identification: '1',
                    identifying: '1'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/contract/contractInvoice/outputInvoice')
            },
            {
                path: 'addIncomeRegistered', 
                name: 'addIncomeRegistered',
                title: '添加收入登记',
                meta: {
                    ...meta,
                    title: '添加收入登记',
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/economicCalculation/incomeRegistered/components/addIncomeRegistered')
            },
            {
                path: 'costRegistrationAddition', 
                name: 'costRegistrationAddition',
                title: '添加成本登记',
                meta: {
                    ...meta,
                    title: '添加成本登记',
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/economicCalculation/costRegistration/actualCost/components/costRegistrationAddition')
            },
            {
                path: 'paymentRequest', 
                name: 'paymentRequest',
                title: '添加成本支付',
                meta: {
                    ...meta,
                    title: '添加成本支付',
                },
                component: () => import('@/views/financialManagement/paymentRequest/index.vue')
            },
            {
                path: 'selfStaffReimburse', 
                name: 'selfStaffReimburse',
                title: '添加成本报销',
                meta: {
                    ...meta,
                    title: '添加成本报销',
                },
                component: () => import('@/views/financialManagement/staffReimburse/index.vue')
            },
            {
                path: 'subSchedulePlanList',
                name: 'subSchedulePlanList',
                title: '审批任务计划',
                meta: {
                    ...meta,
                    title: '审批任务计划',
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/scheduleManagement/schedulePlan/components/components/subSchedulePlanList')
            },
            {
                path: 'addQualityObjectives',
                name: 'addQualityObjectives',
                title: '提交质量目标',
                meta: {
                    ...meta,
                    title: '提交质量目标',
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/qualityControl/qualityObjectives/components/addQualityObjectives')
            },
            {
                path: 'addQualityStandard',
                name: 'addQualityStandard',
                title: '提交质量规范',
                meta: {
                    ...meta,
                    title: '提交质量规范',
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/qualityControl/qualityStandard/components/addQualityStandard')
            },
            {
                path: 'addQualityCheckAccept',
                name: 'addQualityCheckAccept',
                title: '提交质量验收',
                meta: {
                    ...meta,
                    title: '提交质量验收',
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/qualityControl/qualityCheckAccept/components/addQualityCheckAccept')
            },
            {
                path: 'addQualityBrightSpot',
                name: 'addQualityBrightSpot',
                title: '质量亮点',
                meta: {
                    ...meta,
                    title: '质量亮点',
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/qualityControl/qualityBrightSpot/components/addQualityBrightSpot')
            },
            {
                path: 'addPaymentDeposit',
                name: 'addPaymentDeposit',
                title: '保证金缴纳',
                meta: {
                    ...meta,
                    title: '保证金退还',
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/payReturnDeposit/components/addPaymentDeposit')
            },
            {
                path: 'addReturnDeposit',
                name: 'addReturnDeposit',
                title: '保证金退还',
                meta: {
                    ...meta,
                    title: '保证金退还',
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/payReturnDeposit/components/addReturnDeposit')
            }
        ]
    },{
        path: '/personnelManagement',
        arrElem: [
            {
                path: 'personnelManagement/entryRegistration',
                name: 'entryRegistrations',
                title: '入职登记表',
                component: () => import('@/views/personal-information/entryRegistration'),
                meta: { title: '入职登记表' }
            },{
                path: '/personnelManagement/addResignationApplication',
                name: 'addResignationApplications',
                title: '离职申请表',
                component: () => import('@/views/personnelManagement/resignationApplicationModule/components/addResignationApplication'),
                meta: { title: '离职申请表' }
            },{
                path: 'addRetirementNotification',
                name: 'addRetirementNotification',
                title: '辞退通知表',
                component: () => import('@/views/personnelManagement/retirementNotificationModule/components/addRetirementNotification'),
                meta: { title: '辞退通知表' }
            },{
                path: 'addWorkAdjustment',
                name: 'addWorkAdjustment',
                title: '工作调整表',
                component: () => import('@/views/personnelManagement/workAdjustmentModule/components/addWorkAdjustment'),
                meta: { title: '工作调整表' }
            }
        ]
    }, {
        path: '/index',
        arrElem: [
            {
                path: '/systemManagement/shortcutMenu',
                name: 'shortcutMenu',
                title: '我的应用',
                icon: 'dot-circle-o',
                meta: {
                    ...meta,
                    title: '我的应用'
                },
                component: () => import('@/views/systemManagement/shortcutMenu')
            },
        ]
    }, {
        path: '/materialEquipmentManagement',
        arrElem: [
            {
                path: '/materialEquipmentManagement/basicInformation/addMaterialDepot',
                name: 'addMaterialDepot',
                title: '材料',
                meta: {
                    ...meta,
                    title: '材料'
                },
                component: () => import('@/views/materialEquipmentManagement/basicInformation/materialDepot/components/addMaterialDepot')
            },
            {
                path: '/materialEquipmentManagement/basicInformation/addEntrepot',
                name: 'addEntrepot',
                title: '仓库设置',
                meta: {
                    ...meta,
                    title: '仓库设置'
                },
                component: () => import('@/views/materialEquipmentManagement/basicInformation/entrepot/components/addEntrepot')
            },
            {
                path: '/materialEquipmentManagement/basicInformation/entrepotParticulars',
                name: 'entrepotParticulars',
                title: '仓库详情',
                meta: {
                    ...meta,
                    title: '仓库详情'
                },
                component: () => import('@/views/materialEquipmentManagement/basicInformation/entrepotParticulars')
            },
            {
                path: '/materialEquipmentManagement/supplierManagement/addSupplierInformation',
                name: 'addSupplierInformation',
                title: '供应商详情',
                meta: {
                    ...meta,
                    title: '供应商详情'
                },
                component: () => import('@/views/materialEquipmentManagement/supplierManagement/supplierList/components/addSupplierInformation')
            },
            {
                path: '/materialEquipmentManagement/supplierManagement/supplierParticulars',
                name: 'supplierParticulars',
                title: '供应商详情',
                meta: {
                    ...meta,
                    title: '供应商详情'
                },
                component: () => import('@/views/materialEquipmentManagement/supplierManagement/supplierParticulars')
            },
            {
                path: '/materialEquipmentManagement/supplierManagement/addSupplierParticulars',
                name: 'addSupplierParticulars',
                title: '供应物品详情',
                meta: {
                    ...meta,
                    title: '供应物品详情'
                },
                component: () => import('@/views/materialEquipmentManagement/supplierManagement/supplierParticulars/components/addSupplierParticulars')
            },
            {
                path: '/materialEquipmentManagement/supplierManagement/supplierCreditRating',
                name: 'supplierCreditRating',
                title: '信用评价',
                meta: {
                    ...meta,
                    title: '信用评价'
                },
                component: () => import('@/views/materialEquipmentManagement/supplierManagement/supplierCreditRating')
            },
            {
                path: 'scrapRecordInfo',
                name: 'scrapRecordInfo',
                title: '报废信息',
                icon: 'dot-circle-o',
                component: () => import('@/views/materialEquipmentManagement/scrapManagement/scrapRecord/components/scrapRecordInfo'),
                meta: { ...meta, title: '报废信息' }
            },
            {
                path: 'otherWarehousesInfo',
                name: 'otherWarehousesInfo',
                title: "其它入库信息",
                icon: 'dot-circle-o',
                component: () => import('@/views/materialEquipmentManagement/warehouseManagement/otherWarehouses/components/otherWarehousesInfo'),
                meta: { ...meta, title: '其它入库信息' }
            },
            {
                path: 'lockInventoryInformation',
                name: 'lockInventoryInformation',
                title: "锁定库存信息",
                icon: 'dot-circle-o',
                component: () => import('@/views/materialEquipmentManagement/warehouseManagement/lockInventory/components/lockInventoryInformation'),
                meta: { ...meta, title: '锁定库存信息' }
            },
            {
                path: 'receiptInfo',
                name: 'receiptInfo',
                title: "现场收货单信息",
                icon: 'dot-circle-o',
                component: () => import('@/views/materialEquipmentManagement/warehouseManagement/receipt/components/receiptInfo'),
                meta: { ...meta, title: '现场收货单信息' }
            },
            {
                path: 'outboundOrderInfo',
                name: 'outboundOrderInfo',
                title: "生成出库单信息",
                icon: 'dot-circle-o',
                component: () => import('@/views/materialEquipmentManagement/warehouseManagement/outboundOrder/components/outboundOrderInfo'),
                meta: { ...meta, title: '生成出库单信息' }
            },
            {
                path: 'outboundOrderInfoDetail',
                name: 'outboundOrderInfoDetail',
                title: "生成出库单信息",
                icon: 'dot-circle-o',
                component: () => import('@/views/materialEquipmentManagement/warehouseManagement/outboundOrder/components/outboundOrderInfo'),
                meta: { ...meta, title: '出库单详情' }
            },
            {
                path: 'finalInventoryInfo',
                name: 'finalInventoryInfo',
                title: "期末盘点信息",
                icon: 'dot-circle-o',
                component: () => import('@/views/materialEquipmentManagement/warehouseManagement/finalInventory/components/finalInventoryInfo'),
                meta: { ...meta, title: '期末盘点信息' }
            },{
                path: 'returnedGoodsInfo',
                name: 'returnedGoodsInfo',
                title: "退换货信息",
                icon: 'dot-circle-o',
                component: () => import('@/views/materialEquipmentManagement/warehouseManagement/returnedGoods/components/returnedGoodsInfo'),
                meta: { ...meta, title: '退换货信息' }
            },{
                path: 'addPurchaseWarehousingPage',
                name: 'addPurchaseWarehousingPage',
                title: "采购入库信息",
                icon: 'dot-circle-o',
                component: () => import('@/views/materialEquipmentManagement/warehouseManagement/purchaseWarehousing/components/purchaseWarehousingInfo'),
                meta: { ...meta, title: '采购入库信息' }
            },
            {
                path: 'warehouseWarrantInfo',
                name: 'warehouseWarrantInfo',
                title: "采购入库信息",
                icon: 'dot-circle-o',
                component: () => import('@/views/materialEquipmentManagement/warehouseManagement/purchaseWarehousing/components/purchaseWarehousingInfo'),
                meta: { ...meta, title: '采购入库信息' }
            },
            {
                path: '/materialEquipmentManagement/receiveManagement/receiveApply/receiveAdd',
                name: 'receiveAdd',
                title: '领用申请审批',
                meta: {
                    ...meta,
                    title: '领用申请审批'
                },
                component: () => import('@/views/materialEquipmentManagement/receiveManagement/receiveApply/components/receiveAdd')
            },
            {
                path: '/materialEquipmentManagement/receiveManagement/receiveRegister/registerAdd',
                name: 'registerAdd',
                title: '新增领用登记',
                meta: {
                    ...meta,
                    title: '新增领用登记'
                },
                component: () => import('@/views/materialEquipmentManagement/receiveManagement/receiveRegister/components/registerAdd')
            },
            {
                path: '/materialEquipmentManagement/receiveManagement/returnRegister/returnAdd',
                name: 'returnAdd',
                title: '新增归还登记',
                meta: {
                    ...meta,
                    title: '新增归还登记'
                },
                component: () => import('@/views/materialEquipmentManagement/receiveManagement/returnRegister/components/returnAdd')
            },{
                path: '/materialEquipmentManagement/rentOutManagement/rentOutApply/rentOutAdd',
                name: 'rentOutAdd',
                title: '新增出租申请',
                meta: {
                    ...meta,
                    title: '新增出租申请'
                },
                component: () => import('@/views/materialEquipmentManagement/rentOutManagement/rentOutApply/components/rentOutAdd')
            },
            {
                path: '/materialEquipmentManagement/rentOutManagement/rentCharge/newCharge',
                name: 'rentalChargeAdd',
                title: '租金收取登记',
                component: () => import('@/views/materialEquipmentManagement/rentOutManagement/rentCharge/components/newCharge'),
                meta: { title: '租金收取登记' }
            },
            {
                path: '/materialEquipmentManagement/rentOutManagement/rentOutContract/rentOutContractAdd',
                name: 'rentOutContractAdd',
                title: '出租合同审批',
                meta: {
                    ...meta,
                    title: '出租合同审批'
                },
                component: () => import('@/views/materialEquipmentManagement/rentOutManagement/rentOutContract/components/rentOutContractAdd')
            },
            {
                path: '/materialEquipmentManagement/rentOutManagement/rentOutContract/rentOutOrderAdd',
                name: 'rentOutOrderAdd',
                title: '新增出租订单',
                meta: {
                    ...meta,
                    title: '新增出租订单'
                },
                component: () => import('@/views/materialEquipmentManagement/rentOutManagement/rentOutOrder/components/rentOutOrderAdd')
            },
            {
                path: '/materialEquipmentManagement/rentOutManagement/rentOutContract/rentOutReturnAdd',
                name: 'rentOutReturnAdd',
                title: '出租归还登记',
                meta: {
                    ...meta,
                    title: '出租归还登记'
                },
                component: () => import('@/views/materialEquipmentManagement/rentOutManagement/rentOutReturn/components/rentOutReturnAdd')
            },{
                path: '/materialEquipmentManagement/rentOutManagement/sellOutManagement/sellApplyAdd',
                name: 'sellApplyAdd',
                title: '出售申请审批',
                meta: {
                    ...meta,
                    title: '出售申请审批'
                },
                component: () => import('@/views/materialEquipmentManagement/sellOutManagement/sellApply/components/sellApplyAdd')
            },
            {
                path: '/materialEquipmentManagement/rentOutManagement/sellOutManagement/sellContractAdd',
                name: 'sellContractAdd',
                title: '出售合同审批',
                meta: {
                    ...meta,
                    title: '出售合同审批'
                },
                component: () => import('@/views/materialEquipmentManagement/sellOutManagement/sellContract/components/sellContractAdd')
            },
            {
                path: '/materialEquipmentManagement/rentOutManagement/sellOutManagement/sellOrderAdd',
                name: 'sellOrderAdd',
                title: '出售订单',
                meta: {
                    ...meta,
                    title: '出售订单'
                },
                component: () => import('@/views/materialEquipmentManagement/sellOutManagement/sellOrder/components/sellOrderAdd')
            },
            {
                path: '/materialEquipmentManagement/procurementManagement/addPurchaseRequest',
                name: 'addPurchaseRequest',
                title: '采购申请',
                meta: {
                    ...meta,
                    title: '采购申请'
                },
                component: () => import('@/views/materialEquipmentManagement/procurementManagement/purchaseRequest/components/addPurchaseRequest')
            },
            {
                path: '/materialEquipmentManagement/procurementManagement/updataAllTask',
                name: 'updataAllTask',
                title: '采购任务',
                meta: {
                    ...meta,
                    title: '采购任务'
                },
                component: () => import('@/views/materialEquipmentManagement/procurementManagement/purchaseTask/allTask/components/updataAllTask')
            },
            {
                path: '/materialEquipmentManagement/procurementManagement/addPurchaseEnquiry',
                name: 'addPurchaseEnquiry',
                title: '采购询价',
                meta: {
                    ...meta,
                    title: '采购询价'
                },
                component: () => import('@/views/materialEquipmentManagement/procurementManagement/purchaseEnquiry/components/addPurchaseEnquiry')
            },
            {
                path: '/materialEquipmentManagement/procurementManagement/addPurchaseOrder',
                name: 'addPurchaseOrder',
                title: '采购订单',
                meta: {
                    ...meta,
                    title: '采购订单'
                },
                component: () => import('@/views/materialEquipmentManagement/procurementManagement/purchaseOrder/components/addPurchaseOrder')
            },
            {
                path: '/materialEquipmentManagement/procurementManagement/addPurchaseContract',
                name: 'addPurchaseContract',
                title: '采购合同',
                meta: {
                    ...meta,
                    title: '采购合同'
                },
                component: () => import('@/views/materialEquipmentManagement/procurementManagement/purchaseContract/components/addPurchaseContract')
            },
            {
                path: 'addInventoryAllocation',
                name: 'addInventoryAllocation',
                title: '库存调拨详情',
                meta: {
                    ...meta,
                    title: '库存调拨详情'
                },
                component: () => import('@/views/materialEquipmentManagement/warehouseManagement/inventoryAllocation/components/addInventoryAllocation')
            }
        ]
    }, 
    {
        path: '/contract',
        arrElem: [
            {
                path: 'addContractConcludeSign',
                name: 'addContractConcludeSign',
                title: '合同签订',
                meta: {
                    ...meta,
                    title: '合同签订'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/contract/contractConcludeSign/components/addContractConcludeSign')
            },
            {
                path: 'addContractMeasure',
                name: 'addContractMeasure',
                title: '添加合同计量',
                meta: {
                    ...meta,
                    title: '添加合同计量'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/contract/contractMeasure/components/addContractMeasure')
            },
            {
                path: 'settleAccountsRecord',
                name: 'settleAccountsRecord',
                title: '合同记录列表',
                meta: {
                    ...meta,
                    title: '合同记录列表'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/contract/contractSettleAccounts/components/settleAccountsRecord')
            },
            {
                path: 'addContractSettleAccounts',
                name: 'addContractSettleAccounts',
                title: '合同结算',
                meta: {
                    ...meta,
                    title: '合同结算'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/contract/contractSettleAccounts/components/addContractSettleAccounts')
            },
            {
                path: 'contractSettleAccountsAccount',
                name: 'contractSettleAccountsAccount',
                title: '合同结算会计',
                meta: {
                    ...meta,
                    title: '合同结算会计'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/contract/contractSettleAccounts/components/addContractSettleAccounts')
            },
            {
                path: 'contractSettleAccountsCashier',
                name: 'contractSettleAccountsCashier',
                title: '合同结算出纳',
                meta: {
                    ...meta,
                    title: '合同结算出纳'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/contract/contractSettleAccounts/components/addContractSettleAccounts')
            },
            {
                path: 'inputInvoice',
                name: 'inputInvoice',
                title: '进项发票列表',
                meta: {
                    ...meta,
                    title: '进项发票列表'
                },
                params: {
                    identifying: '2'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/contract/contractInvoice/inputInvoice')
            },
            {
                path: 'outputInvoice',
                name: 'outputInvoice',
                title: '销项发票列表',
                meta: {
                    ...meta,
                    title: '销项发票列表'
                },
                params: {
                    identifying: '1'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/contract/contractInvoice/outputInvoice')
            }
        ]
    },
    {
        path: '/controlOverInvoices',
        arrElem: [
            {
                path: 'addTicketReceiptRegistration',
                name: 'addTicketReceiptRegistration',
                title: '添加收票',
                meta: {
                    ...meta,
                    title: '添加收票'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/controlOverInvoices/ticketReceiptRegistration/components/addTicketReceiptRegistration')
            },
            {
                path: 'addBillingRegistrationList',
                name: 'addBillingRegistrationList',
                title: '添加开票',
                meta: {
                    ...meta,
                    title: '添加开票'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/controlOverInvoices/billingRegistration/components/addBillingRegistrationList')
            },
            
            {
                path: 'addInvoiceDeduction',
                name: 'addInvoiceDeduction',
                title: '添加发票抵扣',
                meta: {
                    ...meta,
                    title: '添加发票抵扣'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/controlOverInvoices/InvoiceDeduction/components/addInvoiceDeduction')
            },
            {
                path: 'addInvoiceDrawBack',
                name: 'addInvoiceDrawBack',
                title: '申请退税',
                meta: {
                    ...meta,
                    title: '申请退税'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/controlOverInvoices/InvoiceDrawBack/components/addInvoiceDrawBack')
            },
            {
                path: 'addInvoiceAbnormalRegistration',
                name: 'addInvoiceAbnormalRegistration',
                title: '异常登记',
                meta: {
                    ...meta,
                    title: '异常登记'
                },
                component: () => import('@/views/projectManagement/selfSupportProjectDetail/controlOverInvoices/InvoiceAbnormalRegistration/components/addInvoiceAbnormalRegistration')
            },
        ]
    }
]

export const ROUTER = {
    
    // 总结计划
    SUMMARYPLAN: '/administrativeManagement/summaryPlan' 

}