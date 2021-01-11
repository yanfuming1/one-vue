export default {
    path: '/systemManagement',
    name: 'systemManagement',
    icon: 'flask',
    children: (pre => [
        //{ path:`organize`, title: '组织机构管理', icon: 'home' },
        { path: `organize`, icon:'', title: '组织机构管理' },
        { path: `role-permission`, icon:'', title: '角色权限设置'},
        { path: `staff-management`, icon:'', title: '员工管理设置'},
        { path: `positionManagement`, icon: '', title: '职位管理设置'},
        { path: `moduleMenu`, icon: '', title: '模块菜单管理'},
        { path: `workflowModel`, icon: '', title: '流程模型管理'},
        {
            title: '登录日志管理', icon: '',
            children:[
                { path: `login-log-management/login-log`, title: '登录日志' },
                { path: `login-log-management/operational-log`, title: '操作日志'},
            ]
        },
        {
            title: '银行账户设置',
            icon: 'calendar',
            children: [
                { path: `bankAccountSettings/CompanyEmployeeAccount`, title: '公司员工账户' },
            ],
        },
        {
            title: '数据字典设置',
            icon: 'calendar',
            path: `dataDictionaries`,
        },
        { path: `fromManagement`, icon: '', title: '表单管理'},
    ])('/systemManagement/')
}
