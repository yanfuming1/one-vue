export default {
    path: '/personal-information',
    name: 'personal-information',
    icon: 'flask',
    children: (pre => [
        {
            title: '个人中心',
            icon: 'calendar',
        }, {
            title: '个人资料',
            icon: 'calendar',
            path: 'personal-data'
        }, {
            title: '个人证书',
            icon: 'calendar',
            path: `personal-certificate`,
            children: []
        }, {
            title: '我的考勤',
            icon: 'calendar',
            path: `my-attendance`,
            children: []
        }, {
            title: '工作日志',
            icon: 'calendar',
            path: `work-log`,
            children: []
        }, {
            title: '消息管理',
            icon: 'calendar',
            path: `message-management`,
            children: [
                { path: `message-management/myNews`, title: '我的消息' },
                { path: `message-management/publishNews`, title: '发布消息'},
            ]
        }
    ])('/personal-information/')
}