<template>
    <d2-container class="account-information-history">
        <div class="account-information-history-center">
            <customer-details-header :customerInfor="customerInfor" identification="1" :isShowTime="true" :isShowProject="true" :isShowInvoice="true" />
            <div class="account-information-history-center___bottom">
                <div class="account-information-history-center-title">
                    <div class="account-information-history-center___longString">
                        <p>账户修改记录</p>
                    </div>
                </div>
                <div class="account-information-history-center___bottomLine"></div>
                <div class="account-information-history-center___details">
                    <qqt-table 
                        :data="tableData"
                        :rowHeader="rowHeader"
                        :pageShow="pageShow"
                        :isShowIndex="isShowIndex"
                        :isShowSelection="isShowSelection"
                        :isShowGroup="isShowGroup"
                        :isDrag="isDrag"
                        :option="tableOption"
                        ></qqt-table>
                </div>
                <div class="account-information-history___button">
                    <el-button @click="closeTag">返回</el-button>
                </div>
            </div>
        </div>
    </d2-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { qqtTable } from '../../../../../components/qqt-subassembly'
import { getCustomesAccountModificationRecord } from '../../../../../api/customerManagement/accountInformationHistory'
import { getUserDepartment } from '../../../../../api/customerManagement/customerList'
import { getContactRecordPartyANumber } from '../../../../../api/customerManagement/relationshipRecord'

import customerDetailsHeader from '../../components/customerDetailsHeader'
export default {
    name: 'accountInformationHistory',
    data () {
        return {
            pageShow: false,
            isShowIndex: false,
            isShowSelection: false,
            isShowGroup: false,
            isDrag: false,
            drawer: false,
            tableOption: {
                border: false
            },
            tableData: {
                records: []
            },
            rowHeader: [
                {
                    prop: 'createTime',
                    label: '修改日期',
                    isShow: true,
                    align: 'center'
                },
                {
                    prop: 'modifyTypeName',
                    label: '修改类型',
                    isShow: true,
                    align: 'center',
                    render: (h, parms) => {
                            return [
                                h('div', {}, parms.row.modifyTypeName = this.updataModifyType (parms.row.modifyType)),
                            ]
                        }
                },
                {
                    prop: 'beforeModify',
                    label: '修改前',
                    isShow: true,
                    align: 'center'
                },
                {
                    prop: 'afterModify',
                    label: '修改后',
                    isShow: true,
                    align: 'center'
                },
                {
                    prop: 'createName',
                    label: '修改人',
                    isShow: true,
                    align: 'center'
                },
                {
                    prop: 'relatedProjects',
                    label: '所属部门',
                    isShow: true,
                    align: 'center'
                }
            ]
        }
    },

    methods: {

        ...mapActions('d2admin/page', [
            'close',
        ]),

        getCustomerPage () {
            this.tableData.records = []
            getCustomesAccountModificationRecord ({'cusId': this.customerInfor.id}).then(res => {
                if (res) {
                    res.forEach (data => {
                        this.getPositionDepartment (data.createBy).then (async item => {
                            data['relatedProjects'] = item
                            this.tableData.records.push (data)
                        })
                    })
                }
            })
        },

        getPositionDepartment (id) {
            let department = ''
            return getUserDepartment ({'userId': id}).then(async res => {
                if (res && res.length > 0) {
                    res.forEach(item => {
                        department += item.name + ','
                    })
                    return department.substring(0, department.length - 1)
                }
            })
        },

        updataModifyType (data) {
            let str = ''
            switch (data) {
                case '1':
                    str = '发票抬头'
                    break
                case '2':
                    str = '纳税人识别号'
                    break
                case '3':
                    str = '开户银行'
                    break
                case '4':
                    str = '银行账号'
                    break
                case '5':
                    str = '联系电话'
                    break
                case '6':
                    str = '地址'
                    break
            }
            return str
        },

        closeTag () {
            let tagName = this.$route.path
            let path = '/customerManagement/myCustomer/basicInformation/1'
            this.close ({tagName, path})
        }
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

    components: {
        'qqt-table': qqtTable,
        'customer-details-header': customerDetailsHeader
    },

    watch: {
        customerInfor () {
            if (this.customerInfor.id) {
                this.getCustomerPage ()
            }
        },
        $route (val) {
            if (val.path.indexOf('accountInformationHistory') !== -1) {
                this.$store.dispatch ('d2admin/customer/customerInformationLoad')
                this.$store.dispatch ('d2admin/customer/identificationSet', val.params.identification)
            }
        }
    }
}
</script>

<style lang='scss' scoped>
    .account-information-history {
        .account-information-history-center {
            height: 100%;
            padding: 10px;
            .account-information-history-center___bottom {
                height: 83%;
                margin-top: 20px;
                box-shadow: 0 2px 12px 0 $color-border-shadow;
                background: $color-bg3;
                font-size: 14px;
                .account-information-history-center-title {
                    padding: 30px 45px 10px;
                    .account-information-history-center___longString {
                        border-left: 3px solid $color-text-title;
                        p {
                            color:  $color-text-title;
                            display: inline-block;
                            margin: 0px;
                            margin-left: 10px;
                        }
                    }
                }
                .account-information-history-center___bottomLine {
                    top: -5px;
                    border-top: solid $color-straight-line3 1px;
                    right: -20px;
                }
                .account-information-history___button {
                    text-align: center;
                    padding-top: 20px;
                    button {
                        height: 30px;
                        padding: 6px 10px;
                        .el-button--primary {
                            background-color: $color-button-dialog-affirm
                        }
                    }
                }
            }
            .account-information-history-center___details {
                height: 75%;
                padding: 30px 0
            }
        }
        .account-information-history-header-button {
            height: 26px;
            border-radius: 3px;
            color: #ffffff;
            background-color: $color-button-typeface1;
            border: 1px solid $color-button-typeface1
        }
        .el-button--mini, .el-button--mini.is-round {
            padding: 6px 10px !important;
            top: -1px
        }
    }
</style>
