import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

const meta = {auth: true}

export default {
    path: '/officialDocumentAdd',
    meta,
    redirect: {name: 'official-document-add'},
    component: layoutHeaderAside,
    children: (pre => [
        {
            path: 'officialDocument',
            name: `officialDocument`,
            component: _import('officialDocument/personal/infoRegister/components/createNewCer'),
            meta: { ...meta, title: '新建证书' }
        }
    ])('officialDocument-')
}
