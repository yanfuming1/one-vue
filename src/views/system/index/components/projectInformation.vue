<template>
    <el-card shadow="never" class="project-information">
        <div slot="header" class="clearfix">
            <span>项目列表</span>
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#iconxiangmu"></use>
            </svg>
            <div class="line"></div>
        </div>
        <div class="matter-dispose-table">
            <qqt-table :data="data" :rowHeader="rowHeader" :option="option" :isShowIndex="false" :pageShow="false" :isShowSelection="false" :isShowGroup="false" :isDrag="false"/>
        </div>
    </el-card>
</template>

<script>
    import { qqtTable } from '../../../../components/qqt-subassembly'
    import { jointSearchList } from '../../../../api/jointProject/index'

    import menu from '../../../../layout/header-aside/components/mixin/menu'
    export default {

        components: {
            'qqt-table': qqtTable
        },

        data () {
            return {
                data: {},
                rowHeader: [
                    {
                        prop: 'projectName',
                        label: '项目名称',
                        isShow: true,
                        width: 500,
                        render: (h, parms) => {
                            return h('span', {}, 
                            [
                                h ('span', {
                                    class: {
                                        'startusing': true
                                    },
                                }),
                                h ('span', {
                                    class: {
                                        'typefaceColor': true,
                                    },
                                    on:{
                                        click: async () => {
                                            menu.methods.handleMenuSelect('/jontProjectDetail')
                                            const db = await this.$store.dispatch('d2admin/db/database', {user: true})
                                            db.set('proID', parms.row.id).write()
                                        }
                                    }
                                }, parms.row.projectName)
                            ], )
                        }
                    },
                    {
                        prop: 'businessPersonnel',
                        label: '业务负责人',
                        isShow: true,
                        width: 120,
                        render: (h, parms) => {
                            return h('div', {}, parms.row.businessPersonnel === null ? '无' : parms.row.businessPersonnel)
                        }
                    },
                    {
                        prop: 'isBid',
                        label: '是否中标',
                        isShow: true,
                        render: (h, parms) => {
                            let text = ''
                            if(parms.row.isBid === null) {
                                text = '未填写'
                            } else {
                                text = parms.row.isBid === '1' ? '中标' : '未中标'
                            }
                            return h('div', {}, text)
                        }
                    }
                ],
                option: {
                    maxHeight: 230
                }
            }
        },

        methods: {

            getJointSearchList () {
                jointSearchList ().then (res => {
                    if (res) {
                        this.data = res
                    }
                })
            }
        },

        created () {
            this.getJointSearchList ()
        }
    }
</script>

<style lang='scss'>
    .project-information {
        border: solid 1px transparent !important;
        .clearfix {
            font-size: 16px;
            .line {
                border-bottom: 2px solid $startusing;
                width: 67px;
                position: relative;
                top: 8px
            }
            svg {
                float: right;
                width: 24px;
                height: 24px;
            }
        }
        .el-card__header {
            border-bottom: 1px solid transparent !important;
            padding: 0 0 10px 0px !important
        }
        .el-card__body {
            padding: 0 !important
        }
        .matter-dispose-table {
            margin-top: 15px;
        }
        
        .el-table th div {
            display: block;
        }
    }
</style>
