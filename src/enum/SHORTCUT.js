const SHORTCUT = [
    {
        name: '请假申请',
        icon: '#iconqingjiashenqing',
        path: 'no'
    },
    {
        name: '离职申请',
        icon: '#iconlizhishenqing1',
        path: 'personnelManagement/resignationApplicationModule'
    },
    {
        name: '通讯录',
        icon: '#icontongxunlu2',
        path: 'administrativeManagement/addressBook'
    },
    {
        name: '物资采购申请',
        icon: '#iconwuzicaigoushenqing',
        path: 'no'
    },
    {
        name: '通知公告',
        icon: '#icontongzhigonggao',
        path: 'personal-information/message-management/publishNews'
    },
    {
        name: '物资归还登记',
        icon: '#iconwuziguihuandengji',
        path: 'no'
    },
    {
        name: '收文登记',
        icon: '#iconshouwendengji1',
        path: 'administrativeManagement/documentManagement/receiptRegistration'
    },
    {
        name: '项目报名登记',
        icon: '#iconxiangmubaomingdengji',
        path: 'no'
    },
    {
        name: '入职申请',
        icon: '#iconruzhishenqing',
        path: 'personnelManagement/personnelManagementModule'
    },
    {
        name: '物资出租申请',
        icon: '#iconwuzichuzushenqing',
        path: 'no'
    },
    // {
    //     name: '项目立项登记',
    //     icon: '#iconxiangmulixiangdengji',
    //     path: 'projectManagement/jontProjectDetail/projectApproval'
    // },
    {
        name: '营业外收登记',
        icon: '#iconyingyewaishoudengji',
        path: 'financialManagement/nonbusinessIncomeRegister'
    },
    {
        name: '总结计划',
        icon: '#iconzongjiejihua1',
        path: 'administrativeManagement/summaryPlan/:0',
        fullPath: 'administrativeManagement/summaryPlan/0'
    },
    // {
    //     name: '银行账户设置',
    //     icon: '#iconyinhangzhanghushezhi1',
    //     path: 'systemManagement/bankAccountSettings/CompanyEmployeeAccount'
    // },
    {
        name: '印章登记',
        icon: '#iconyinzhangdengji1',
        path: 'administrativeManagement/managementSignet/sealRegistration'
    },
    ///////////////////////////////////////////////////////////////////////////////////////////////////////我加的
   /* {
        name: '会议管理',
        icon: '#iconkezhangshenqing',
        path: 'administrativeManagement/meetingManage'
    },*/

    ///////////////////////////
    {
        name: '物资领用登记',
        icon: '#iconwuzilingyongdengji',
        path: 'no'
    },
    {
        name: '员工借款申请',
        icon: '#iconyuangongjiekuanshenqing1',
        path: 'financialManagement/staffLoan'
    },
    {
        name: '调休申请',
        icon: '#icontiaoxiushenqing',
        path: 'no'
    },{
        name: '用印申请',
        icon: '#iconyongyinshenqing',
        path: 'administrativeManagement/managementSignet/usingApplication1'
    },
    {
        name: '车辆管理',
        icon: '#iconcheliangguanli',
        path: 'no'
    },
    {
        name: '物资领用申请',
        icon: '#iconwuzilingyongshenqing',
        path: 'no'
    },{
        name: '到账资金认定',
        icon: '#icondaozhangzijinrending',
        path: 'financialManagement/financeFundFetermination'
    },
    {
        name: '工程款到账登记',
        icon: '#icongongchengkuandaozhangdengji1',
        path: 'no'
    },
    {
        name: '发文管理',
        icon: '#iconfawendengji1',
        path: 'administrativeManagement/documentManagement/postRegistration'
    },
    {
        name: '员工报销申请',
        icon: '#iconyuangongbaoxiaoshenqing1',
        path: 'financialManagement/staffReimburse'
    },
    // {
    //     name: '项目开标登记',
    //     icon: '#iconxiangmukaibiaodengji',
    //     path: 'projectManagement/jontProjectDetail/openTender'
    // },
    {
        name: '保证金退还申请',
        icon: '#iconbaozhengjintuihuanshenqing',
        path: 'financialManagement/refundDeposit'
    },
    {
        name: '辞退通知',
        icon: '#iconcituitongzhi1',
        path: 'personnelManagement/retirementNotificationModule'
    },
    {
        name: '加班申请',
        icon: '#iconjiabanshenqing',
        path: 'no'
    },
    {
        name: '对外付款申请',
        icon: '#iconduiwaifukuanshenqing1',
        path: 'financialManagement/paymentRequest'
    },
    {
        name: '会计科目设置',
        icon: '#iconhuijikemushezhi',
        path: 'no'
    },
    {
        name: '记账凭证',
        icon: '#iconjizhangpingzheng',
        path: 'no'
    },
    {
        name: '个人工资核算',
        icon: '#icongerengongzihesuan',
        path: 'no'
    },
    {
        name: '出差申请',
        icon: '#iconchuchashenqing',
        path: 'no'
    },
    {
        name: '计量提成申请',
        icon: '#iconjiliangtichengshenqing',
        path: 'no'
    },
    {
        name: '物资采购登记',
        icon: '#iconwuzicaigoudengji',
        path: 'no'
    },
    {
        name: '计量提成核算',
        icon: '#iconjiliangtichenghesuan',
        path: 'no'
    },
    {
        name: '对外贷款审批',
        icon: '#iconduiwaidaikuanshenpi1',
        path: 'financialManagement/externalLloan'
    },
    {
        name: '保证金缴纳申请',
        icon: '#iconbaozhengjinjiaonashenqing',
        path: 'financialManagement/marginApplication'
    },
    {
        name: '物资验收入库',
        icon: '#iconwuziyanshouruku',
        path: 'no'
    },
    {
        name: '记账',
        icon: '#iconjizhang',
        path: 'no'
    },
    {
        name: '罚款通知',
        icon: '#iconfakuantongzhi',
        path: 'no'
    },
    {
        name: '工程款支付申请',
        icon: '#icongongchengkuanzhifushenqing1',
        path: 'no'
    },
    {
        name: '会议记录',
        icon: '#iconhuiyijilu',
        path: 'no'
    }
]

export default SHORTCUT