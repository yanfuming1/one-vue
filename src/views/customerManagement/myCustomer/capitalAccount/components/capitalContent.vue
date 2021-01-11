<template>
    <div>
        <qqt-table :data="tableData" :rowHeader="rowHeader" ref="table" :option="tableOption" @page="handlePaginationChange"></qqt-table>
        <fund-transfer v-if="dialogVisible" :dialogTitle="'资金转移'" :dialogVisible="dialogVisible" :obj = "values" @change="updataDialogVisible"></fund-transfer>
    </div>
</template>

<script>
import { qqtTable } from '../../../../../components/qqt-subassembly'
import { getProjectCapitalAccount } from '../../../../../api/customerManagement/capitalAccount'
import { mapState } from 'vuex'

import fundTransfer  from '../capitalNeir/projectToClient'
export default {
    data() {
        return {
            cashWithdrawal:true,
            tableData: {},
            expandRowKeys: [],
            dialogVisible: false,
            page: {
                current: 1,
                size: 10,
                total: 0
            },
            values: {
                balance: '',
                projectId: '',
                cusId: '',
            },
            tableOption: {},
            rowHeader: [
                {
                    prop: 'projectName',
                    label: '项目名称',
                    isShow: true
                },
                {
                    prop: 'section',
                    label: '项目标段',
                    isShow: true
                },
                {
                    prop: 'projectType',
                    label: '项目类别',
                    isShow: true
                },
                {
                    prop: 'projectManager',
                    label: '项目经理',
                    isShow: true
                },
                {
                    prop: 'registrationDeadline',
                    label: '报名时间',
                    isShow: true
                },
                {
                    prop: 'bidOpeningTime',
                    label: '开标时间',
                    isShow: true
                },
                {
                    prop: 'balanceToFixed',
                    label: '项目可用金额',
                    isShow: true,
                    render: (h, parms) => {
                        return [
                            h('div', {}, parms.row.balanceToFixed = Number(parms.row.balance).toFixed (2))
                        ]
                    }
                },
                {
                    prop: 'untitledToFixed',
                    label: '项目暂押余额',
                    isShow: true,
                    render: (h, parms) => {
                        return [
                            h('div', {}, parms.row.untitledToFixed = Number(parms.row.untitled4).toFixed (2))
                        ]
                    }
                },
                {
                    prop: '',
                    label: '操作',
                    isShow: true,
                    render: (h, parms) => {
                        return [
                            h('el-button', {
                                props:{
                                    type: "text"
                                },
                                on:{
                                    click: () => {
                                        this.fundTransfer(parms.row)
                                    }
                                }
                            }, '资金转移')
                        ]
                    }
                }
            ]
        }
    },

    methods: {

        
        fundTransfer(row){     
           
            this.values.balance= row.balance;
            this.values.projectId=row.id;
            this.values.cusId =row.associatedPersonId;
            this.values.relatedProjects= row.projectName;
            if(this.values.balance === 0 ){
                this.$message.error("余额不足!");
                return
            }
            this.dialogVisible = true 

        },

        getProjectCapitalAccountData (id) {
            getProjectCapitalAccount ({
                'associatedPersonId': id,
                'pageNo': this.page.current,
                'pageSize': this.page.size
            }).then (res => {
                if (res) {
                    this.tableData = res
                    this.toggleRowExpansion ()
                }
            })
        },

        updataDialogVisible () {
            this.getProjectCapitalAccountData (this.customerInfor.id)
            this.dialogVisible = false
        },

        // 分页变化改动
        handlePaginationChange (val) {
            this.page = val;
            this.$nextTick(() => {
                this.getProjectCapitalAccountData (this.customerInfor.id)
            });
        },

        toggleRowExpansion () {
            if (this.$route.params && this.$route.params.capitalContent) {
                this.expandRowKeys.push (this.$route.params.capitalContent.id)
            }
        },

        getRowKeys (row) {
            return row.id
        },

        // 验证权限
        _validationAuth () {
            this.cashWithdrawal = this.$has('capitalpool:list:editupdateExtract')
            this.edit = this.$has('capitalpool:list:edit')
        },
        reastFun () {
            if (this.customerInfor.id) {
                this.getProjectCapitalAccountData (this.customerInfor.id)
            }
        }
    },

     mounted () {
        this._validationAuth ()
    },

    computed: {
        ...mapState('d2admin/customer', [
            'customerInfor',
        ])
    },

    created () {
        this.$store.dispatch ('d2admin/customer/identificationLoad')
        this.$store.dispatch ('d2admin/customer/customerInformationLoad')
    },

    watch: {
        customerInfor () {
            this.reastFun();
        },

        $route (val) {
            if (val.path.indexOf('capitalAccount') !== -1) {
                this.$store.dispatch ('d2admin/customer/customerInformationLoad')
                this.$store.dispatch ('d2admin/customer/identificationSet', val.params.identification)
            }
        }
    },

    components: {
        'qqt-table': qqtTable,
        'fund-transfer': fundTransfer
    }
}
</script>

<style lang='scss' scoped>
    .capital-account-table-drop-down-content {
        .project-balance{
            color: #75bfff;
            font-weight:bold;
            margin-left: 15px;
            font-size: 16px
        }
        .transfer-accounts-btn{
            margin-left: 24px
        }
        .project-withholding-balance{
            color: #9bcbb1;
            font-weight:bold;
            margin-left: 15px;
            font-size: 16px
        }
        .project-revenue{
            color: #fd8f76;
            font-weight:bold;
            margin-left: 15px;
            font-size: 16px
        }
        .project-expenditure{
            color: #bb96dc;
            font-weight:bold;
            margin-left: 15px;
            font-size: 16px
        }
    }
    .capital-account-table-drop-down-content label {
            width: 90px;
            color: #99a9bf;
    }
    .capital-account-table-drop-down-content .el-form-item {
            margin-right: 0;
            margin-bottom: 0;
            width: 50%;
    }
    .page-footer {
        padding: 20px;
    }
</style>
