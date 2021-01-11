import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

const meta = {auth: true}

export default {
    path: '/personal-information',
    name: 'personal-information',
    component: layoutHeaderAside,
    children: (pre => [
        { path: 'personal-data', name: `personal-data`, component: _import('personal-information/personal-data'), meta: { ...meta, title: '个人资料' } },
        { path: 'personal-certificate', name: `personal-certificate`, component:_import('personal-information/personal-certificate'),meta: {...meta, title: '个人证书'} },
        { path: 'my-attendance', name: `my-attendance`, component:_import('personal-information/my-attendance'),meta: {...meta, title: '我的考勤'} },
        { path: 'work-log', name: `work-log`, component:_import('personal-information/work-log'),meta: {...meta, title: '工作日志'}},
        { path: 'message-management/myNews', name: `message-management/myNews`, component:_import('personal-information/message-management/myNews'),meta: {...meta, title: '我的消息'} },
        { path: 'newsDetail', name: `newsDetail`, component:_import('personal-information/message-management/myNews/newsDetail'),meta: {...meta, title: '消息详情'} },
        { path: 'message-management/publishNews', name: `message-management/publishNews`, component:_import('personal-information/message-management/publishNews'),meta: {...meta, title: '发布信息'} }
    ])('personal-information-')
}
