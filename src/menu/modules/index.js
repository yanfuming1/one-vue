export default {
    path: '',
    title: '首页',
    icon: 'flask',
    children: (pre => [
        { path:`index`, title: '首页', icon: 'home' },
        { path:`positionManagement`, title: '职位管理', icon: 'el-icon-postcard' },
    ])('/index/')
}
