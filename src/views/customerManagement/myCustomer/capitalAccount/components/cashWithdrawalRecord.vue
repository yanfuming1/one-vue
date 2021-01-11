<template>
    <div>
        <qqt-table :data="tableData" ref="table" :rowHeader="rowHeader" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange" />
    </div>
</template>

<script>
    import { getCashWithdrawalPageList, deleteBatchCashWithdrawal } from '@/api/customerManagement/capitalAccount'
    import { qqtTable } from '@/components/qqt-subassembly'
    import { mapState } from 'vuex'

    import util from '@/libs/util.js'
    export default {
        data () {
            return {
                options: [],
                createDate: [],
                tableSelectData: [],
                tableOption: {
                    border: false
                },
                transform: {
                    isShowDetails: false
                },
                page: {
                    current: 1,
                    size: 10,
                    total: 0
                },
                tableData: {},
                rowHeader: [
                    {
                        prop: 'account',
                        label: '账户',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = true
                                        this.routerLink ('联营资金账户-提现详情', parms.row.id)
                                    }
                                }
                            }, parms.row.account)
                        }
                    },
                    {
                        prop: 'accountName',
                        label: '账名',
                        isShow: true
                    },
                    {
                        prop: 'balance',
                        label: '可以提现金额',
                        isShow: true
                    },
                    {
                        prop: 'capitalMoney',
                        label: '提现金额',
                        isShow: true
                    },
                    {
                        prop: 'procStateName',
                        label: '办理状态',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {},
                                parms.row.procStateName = util.handleState (parms.row.procState)
                            )
                        }
                    },
                    {
                        prop: 'createName',
                        label: '创建人',
                        isShow: true,
                    },
                    {
                        prop: 'departmentName',
                        label: '工作部门',
                        isShow: true,
                    },
                    {
                        prop: '',
                        label: '操作',
                        isShow: true,
                        render: (h, parms) => {
                            return [
                                h('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    attrs: {
                                        disabled: util.isDisabled (parms.row.procState)
                                    },
                                    on:{
                                        click: () => {
                                            this.transform.isShowDetails = false
                                            this.routerLink ('联营资金账户-提现编辑', parms.row.id)
                                        }
                                    }
                                }, '编辑'),
                                h('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    attrs: {
                                        disabled: util.isDisabled (parms.row.procState)
                                    },
                                    on:{
                                        click: () => {
                                            this.deleteCashWithdrawalRecordObject (parms.row.id)
                                        }
                                    }
                                }, '删除')
                            ]
                        }
                    }
                ]
            }
        },

        methods: {

            selectChange (item) {
                this.tableSelectData = item
            },

            searchModelSynopsis () {
                this.getCashWithdrawalRecordPage ({
                    'name': this.filterText ? this.filterText : null,
                    'createTime': this.createDate ? this.createDate[0] : null,
                    'updateTime': this.createDate ? this.createDate[1] : null})
            },

            handlePaginationChange (page) {
                this.page = page;
                this.$nextTick(() => {
                    this.searchModelSynopsis ()
                });
            },

            getCashWithdrawalRecordPage (text) {
                getCashWithdrawalPageList ({
                    ...text,
                    'cusId': this.customerInfor.id,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size
                }).then( res => {
                    if (res) this.tableData = res
                })
            },

            deleteCashWithdrawalRecordObject (id) {
                this.deleteCashWithdrawalRecordById ({'ids': id})
            },

            deleteCashWithdrawalRecordList () {
                if (this.tableSelectData.length === 0) {
                    this.$message.warning ('请选择一条数据')
                    return
                }
                let ids = ''
                if (this.tableSelectData && this.tableSelectData.length > 0) {
                    this.tableSelectData.forEach(res => {
                        ids += res.id + ','
                    })
                }
                this.deleteCashWithdrawalRecordById ({'ids': ids.substring(0, ids.length - 1)})
            },

            deleteCashWithdrawalRecordById (id) {
                util.confirm ().then (boolean => {
                    if (boolean) {
                        deleteBatchCashWithdrawal (id).then(res => {
                            if (res.code === 200) {
                                this.$message.success(res.message)
                                this.getCashWithdrawalRecordPage ()
                            }
                        })
                    }
                })
            },

            resetModelSynopsis () {
                this.filterText = ''
                this.createDate = []
                this.getCashWithdrawalRecordPage ()
            },

            routerLink (title, id = '') {
                this.$router.push ({
                    path: 'cashWithdrawal',
                    name: 'cashWithdrawal',
                    params: {
                        relevancyId: id,
                        transform: this.transform,
                    }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            },
        },

        components: {
            'qqt-table': qqtTable,
        },

        created () {
            this.$store.dispatch ('d2admin/customer/identificationLoad')
            this.$store.dispatch ('d2admin/customer/customerInformationLoad')
        },

        computed: {
            ...mapState('d2admin/customer', [
                'customerInfor'
            ])
        },

        watch: {
            customerInfor () {
                if (this.customerInfor.id) {
                    this.getCashWithdrawalRecordPage ()
                }
            },
        }
    }

</script>
