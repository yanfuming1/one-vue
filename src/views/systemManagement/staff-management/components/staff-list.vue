<template>
    <d2-container>
        <template>
            <!-- 表格数据内容 -->
            <div>
                <qqt-table :data="tableData" :rowHeader="rowHeader" :option="tableOption" @selectionChange="selectChange"></qqt-table>
            </div>
            <!-- 底部分页 -->
            <page-footer
                    slot="footer"
                    :current="page.current"
                    :loading="loading"
                    :size="page.size"
                    :total="page.total"
                    @change="handlePaginationChange"/>
        </template>
    </d2-container>
</template>

<script>
    export default {
        name: "staff-list",
        components: {PageFooter: () => import('@/layout/header-aside/components/footer'),},
        props: {
            tableData: Array,
        },
        data () {
            return {
                rowHeader: [
                    // 未做任何格式化处理的数据
                    {
                        prop: 'name',
                        label: '姓名',
                        isShow: true,
                        render: (h, params) => {
                            return h('el-button', {
                                // 添加参数
                                props: {

                                },
                                // 添加事件
                                on:{
                                    click: () => {
                                        that.dialogTile = '员工详情'
                                        that.showInfo = true
                                        that.isEdit = false
                                        that.userInfo = params.row
                                        that.setChild()
                                    }
                                },
                                // 添加样式
                                style: {
                                    color: '#3ba5ff'
                                },
                                // 添加属性
                                attrs: {
                                    title: '姓名',
                                    type: 'text'
                                },
                            }, params.row.name)
                        }
                    },
                    // 格式化为字符串
                    {
                        prop: 'phone',
                        label: '登录账号',
                        isShow: true,
                        render: (h, params) => {
                            return h('div', {
                                // 添加参数
                                style: {
                                    whitespace: 'nowrap',
                                    wordBreak: 'keep-all',
                                    textOverflow: 'ellipsis'
                                },
                                props: {

                                },
                            }, params.row.phone)
                        }
                    },
                    {
                        prop: 'role',
                        label: '工作单位',
                        isShow: true,
                        render: (h, params) => {
                            return h('div', {
                                style: {
                                    whitespace: 'nowrap',
                                    wordBreak: 'keep-all',
                                    textOverflow: 'ellipsis'
                                },
                            }, that.organization)
                        }
                    },
                    {
                        prop: 'createdBy',
                        label: '部门',
                        isShow: true,
                        render: (h, params) => {
                            return h('div', {

                            }, params.row.createdBy)
                        }
                    },
                    // 插入组件或标签内容（例：进度条组件）
                    {
                        prop: 'posiId',
                        label: '职位',
                        isShow: true,
                        render: (h, params) => {
                            return h('div', {

                            }, params.row.posiId)
                        }
                    },
                    // 添加操作按钮
                    {
                        prop: '',
                        label: '操作',
                        isShow: true,
                        render: function (createElement, params) {
                            return createElement('div',
                                [
                                    createElement('el-button', {
                                        attrs: {
                                            type: 'text',
                                        },
                                        on: {
                                            click: () => {
                                                that.dialogTile = '修改员工信息'
                                                that.isEdit = true
                                                that.showInfo = true
                                                that.userInfo = {}
                                                that.userInfo = params.row
                                                that.setChild()
                                            }
                                        }
                                    }, '编辑'),
                                    createElement('el-button', {
                                        attrs: {
                                            type: 'text',
                                        },
                                        on: {
                                            click: () => {
                                                alert("切换在职离职状态")
                                            }
                                        }
                                    }, '在职'),
                                ]
                            )
                        }
                    }
                ],
                tableOption: {
                    border: false
                },
                // 分页
                loading: false,
                page: {
                    current: 1,
                    size: 10,
                    total: 0
                },
            }
        },
        methods : {
            handlePaginationChange (val) {
                console.log(val)
            },
            selectChange (val) {
                console.log(val)
            }
        }
    }
</script>

<style scoped>

</style>
