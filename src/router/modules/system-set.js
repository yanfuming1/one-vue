import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

const meta = {auth: true}

export default {
    path: '/systemManagement',
    name: 'systemManagement',
    component: layoutHeaderAside,
    children: (pre => [
        { path: 'organize', name: `organize`, component: _import('systemManagement/organize'), meta: { ...meta, title: '组织机构管理' } },
        { path: 'role-permission', name: `role-permission`, component:_import('systemManagement/role-permission'),meta: {...meta, title: '角色权限设置'} },
        { path: 'staff-management', name: `staff-management`, component:_import('systemManagement/staff-management'),meta: {...meta, title: '员工管理设置'} },
        { path: 'login-log-management/login-log', name:`login-log-management/login-log`, component:_import('systemManagement/login-log-management/login-log'),meta: {...meta, title: '登录日志'}},
        { path: 'login-log-management/operational-log', name:`login-log-management/operational-log`, component:_import('systemManagement/login-log-management/operational-log'),meta: {...meta, title: '操作日志'}},
        { path: 'bankAccountSettings/CompanyEmployeeAccount', name: `bankAccountSettings/CompanyEmployeeAccount`, component:_import('systemManagement/bankAccountSettings/CompanyEmployeeAccount'),meta: {...meta, title: '员工银行账户'} },
        { path: 'bankAccountSettings/associateAccount', name: `bankAccountSettings/associateAccount`, component:_import('systemManagement/bankAccountSettings/associateAccount'),meta: {...meta, title: '联营人账户'} }, 
        { path: 'bankAccountSettings/resourceTradingAccount', name: `bankAccountSettings/resourceTradingAccount`, component:_import('systemManagement/bankAccountSettings/resourceTradingAccount'),meta: {...meta, title: '资源交易中心账户'} }, 
        { path: 'bankAccountSettings/materialEquipmentAccount', name: `bankAccountSettings/materialEquipmentAccount`, component:_import('systemManagement/bankAccountSettings/materialEquipmentAccount'),meta: {...meta, title: '物质设备供应商账户'} },
        { path: 'bankAccountSettings/ownerPaymentAccount', name: `bankAccountSettings/ownerPaymentAccount`, component:_import('systemManagement/bankAccountSettings/ownerPaymentAccount'),meta: {...meta, title: '业主付款账户'} },
        { path: 'bankAccountSettings/laborSubcontractorAccount', name: `bankAccountSettings/laborSubcontractorAccount`, component:_import('systemManagement/bankAccountSettings/laborSubcontractorAccount'),meta: {...meta, title: '劳务分包商账户'} },
        { path: 'bankAccountSettings/companyAccount', name: `bankAccountSettings/companyAccount`, component:_import('systemManagement/bankAccountSettings/companyAccount'),meta: {...meta, title: '公司银行账户'} },        
        { path: 'bankAccountSettings/otherAccounts', name: `bankAccountSettings/otherAccounts`, component:_import('systemManagement/bankAccountSettings/otherAccounts'),meta: {...meta, title: '其它账户'} },  
        { path: 'positionManagement', name: `positionManagement`, component: _import('systemManagement/positionManagement'), meta: { ...meta, title: '职位管理设置' } },
        { path: 'moduleMenu', name: `moduleMenu`, component: _import('systemManagement/moduleMenu'), meta: { ...meta, title: '模块菜单管理' } },
        { path: 'workflowModel', name: `workflowModel`, component: _import('systemManagement/workflowModel'), meta: { ...meta, title: '流程模型管理' } },
        { path: 'dataDictionaries', name: `dataDictionaries`, component: _import('systemManagement/dataDictionaries'), meta: { ...meta, title: '数据字典设置' } },
        { path: 'workflowModelEditForm', name: `workflowModelEditForm`, component: _import('systemManagement/workflowModelEditForm'), meta: { ...meta, title: '流程模型管理详情' } },
        { path: 'processDefinition', name: `processDefinition`, component: _import('systemManagement/processDefinition'), meta: { ...meta, title: '流程设计' } },
        { path: 'accountManagement', name: `accountManagement`, component: _import('systemManagement/accountManagement'), meta: { ...meta, title: '账号管理设置' } },
        { path: 'fromManagement', name: `fromManagement`, component: _import('systemManagement/fromManagement'), meta: { ...meta, title: '表单管理' } }
    ])('systemManagement-')
}