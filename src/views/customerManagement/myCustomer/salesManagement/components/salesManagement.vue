<template>
    <d2-container class="sales-management">
        <div class="sales-management-center">
            <customer-details-header :customerInfor="customerInfor" :identification="identification" :isShowTime="true" />
            <div class="sales-management-center___bottom">
                <div class="sales-management-center-title">
                    <div class="sales-management-center-title___longString">
                        <p>销售管理信息</p>
                    </div>
                </div>
                <div class="sales-management-center___bottomLine"></div>
                <div class="sales-management-center___details">
                    <div class="sales-management-center___generate">
                        <fm-generate-form :data="jsonData" :remote="remote" :value="customerInfor" :transform="transform" ref="generateForm" @on-change="selectGenerateChange" @btn-click="btnClick"></fm-generate-form>
                    </div>
                </div>
                <div class="sales-management-center___button" v-if="edit">
                    <div v-if="!customerInfor.iCanSeeIt">
                        <el-button type="primary" v-if="transform.isShowDetails" @click="transform.isShowDetails = false">编辑</el-button>
                        <el-button type="primary" v-else @click="onSubmit">确认</el-button>
                        <el-button v-if="!transform.isShowDetails" @click="transform.isShowDetails = true">取消</el-button>
                        <el-button @click="closeTag">返回</el-button>
                    </div>
                </div>
            </div>
        </div>
        <add-expand-information-dialog :dialogVisible="drawer" :data="informationData" @change="updataExpandInformation"></add-expand-information-dialog>
    </d2-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { formGetJson } from '../../../../../api/system/fromManagement/index'
import { CUSTOMERAUTHORIZATIONFORM } from '../../../../../enum/FORMCODE'
import { getUserDepartment, updataAssociatedCompanyCustomer, updataFirstPartyCustomer } from '../../../../../api/customerManagement/customerList'
import { addAssociatedCompanySalesInformation, addFirstPartySalesInformation } from '../../../../../api/customerManagement/salesInformation'

import customerDetailsHeader from '../../components/customerDetailsHeader'
import addExpandInformationDialog from '../../../expandInformation/components/addExpandInformationDialog'
let than = this
export default {
    data () {
        return {
            jsonData: {},
            remote: {},
            transform: {
                isShowDetails: true
            },
            drawer: false,
            edit: true,
            informationData: {},
            formerHead: {},
            isAddSalesInformation: false
        }
    },

    methods: {

        ...mapActions('d2admin/page', [
            'close',
        ]),

        selectGenerateChange (field, val, models) {
            let item = ''
            switch (field) {
                case 'buLeId':
                    item = this.remoteFuncs.businessLeaderOptions.find (r => r.id === val)
                    this.customerInfor.buLeId = item ? item.id :''
                    this.customerInfor.businessLeader = item ? item.name : ''
                    this.customerInfor.position = item ? item.posiId : ''
                    if (item) {
                        this.getPositionDepartment (item.id)
                    }
                    if (item.id === this.formerHead['id']) {
                        this.isAddSalesInformation = false
                    } else {
                        this.isAddSalesInformation = true
                    }
                    break
                case 'clientGradeId':
                    item = this.remoteFuncs.clientGradeOptions.find (r => r.id === val)
                    this.customerInfor.clientGradeId = item ? item.id : ''
                    this.customerInfor.clientGrade = item ? item.proName : ''
                    break
                case 'customerStatusId':
                    item = this.remoteFuncs.customerOptions.find (r => r.id === val)
                    this.customerInfor.customerStatusId = item ? item.id : ''
                    this.customerInfor.customerStatus = item ? item.proName : ''
                    break
            }
        },

        getFormByJson () {
            formGetJson ({'code': CUSTOMERAUTHORIZATIONFORM.SALESMANAGEMENT}).then(res => {
                if (res) {
                    this.jsonData = JSON.parse(res)
                }
            })
        },

        onSubmit () {
            this.$refs.generateForm.getData ().then(res => {
                if (res) {
                    let url = ''
                    switch (this.identification) {
                        case '0':
                            url = updataAssociatedCompanyCustomer
                            break
                        case '1':
                            url = updataFirstPartyCustomer
                            break
                    }
                    if (this.customerInfor.unitAddressId instanceof Array) {
                        this.customerInfor.unitAddressId = JSON.stringify (this.customerInfor.unitAddressId)
                    }
                    url (this.customerInfor).then (item => {
                        if (item.code === 200) {
                            this.transform.isShowDetails = true
                            this.$store.dispatch ('d2admin/customer/customerInformation', { 'item': this.customerInfor })
                            if (this.isAddSalesInformation) {
                                this.addSalesInformationData ()
                            } else {
                                this.$message.success ('操作成功')
                            }
                        }
                    })
                }
            })
        },

        addSalesInformationData () {
            let url = ''
            switch (this.identification) {
                case '0':
                    url = addAssociatedCompanySalesInformation
                    break
                case '1':
                    url = addFirstPartySalesInformation
                    break
            }
            const {id: cusId, cusName, businessLeader: nowHeadOf, buLeId: nowHeadOfId} = this.customerInfor
            let item = { cusId, cusName, nowHeadOf, nowHeadOfId, formerHeadOf: this.formerHead.name, formerHeadOfId: this.formerHead.id}
            url (item).then (res => {
                if (res.code === 200) {
                    this.$message.success ('操作成功')
                }
            })
        },

        getPositionDepartment (id) {
            let department = ''
            let departmentId = ''
            getUserDepartment ({'userId': id}).then(res => {
                if (res && res.length > 0) {
                    res.forEach(item => {
                        department += item.name + ','
                        departmentId += item.id + ','
                    })
                    this.customerInfor.department = department.substring(0, department.length - 1)
                    this.customerInfor.departmentId = departmentId.substring(0, departmentId.length - 1)
                }
            })
        },

        btnClick (val, field) {
            let item = {}
            item['id'] = val
            this.informationData = item
            this.drawer = true
        },

        updataExpandInformation () {
            this.drawer = false
            this.$store.dispatch ('d2admin/customer/remoteFuncsLoad')
        },

        // 验证权限
        _validationAuth () {
            this.edit = this.identification === '0' ? this.$has('client:list:edit') : this.$has ('clients:list:edit')
        },

        closeTag () {
            let tagName = this.$route.path
            let path = ''
            
            if (this.customerInfor.myClientPath) {
                path = `/customerManagement/myClientModule/${this.customerInfor.myClientPath}`
            } else {
                path = `/customerManagement/customerList/${this.identification}`
            }
            this.close ({tagName, path})
        }
    },

    computed: {
        ...mapState('d2admin/customer', [
            'customerInfor',
            'remoteFuncs',
            'identification'
        ])
    },

    mounted () {
        than = this
        this._validationAuth ()
    },

    created () {
        this.$store.dispatch ('d2admin/customer/identificationSet', this.$route.params.identification)
        this.$store.dispatch ('d2admin/customer/identificationLoad')
        this.$store.dispatch ('d2admin/customer/customerInformationLoad')
        this.$store.dispatch ('d2admin/customer/remoteFuncsLoad')
        this.getFormByJson ()
    },

    watch: {
        remoteFuncs () {
            this.remote = {
                getBusinessLeader (resolve) {
                    resolve (than.remoteFuncs.businessLeaderOptions)
                },
                getCustomerStatus (resolve) {
                    resolve (than.remoteFuncs.customerOptions)
                },
                getClientGrade (resolve) {
                    resolve (than.remoteFuncs.clientGradeOptions)
                }
            }
        },

        $route (val) {
            if (val.path.indexOf('salesManagement') !== -1) {
                this.$store.dispatch ('d2admin/customer/identificationSet', val.params.identification)
                this.$store.dispatch ('d2admin/customer/customerInformationLoad')
                this.getFormByJson ()
            }
        },

        customerInfor (val) {
            this.formerHead['name'] = val.businessLeader
            this.formerHead['id'] = val.buLeId
        }
    },

    components: {
        'customer-details-header': customerDetailsHeader,
        'add-expand-information-dialog': addExpandInformationDialog
    }
}
</script>

<style lang='scss' scoped>
    .sales-management {
        .sales-management-center {
            height: 100%;
            padding: 10px;
            .sales-management-center___bottom {
                height: 83%;
                margin-top: 20px;
                box-shadow: 0 2px 12px 0 $color-border-shadow;
                background: $color-bg3;
                font-size: 14px;
                .sales-management-center-title {
                    padding: 30px 32px 10px;
                    .sales-management-center-title___longString {
                        border-left: 3px solid $color-text-title;
                        p {
                            color:  $color-text-title;
                            display: inline-block;
                            margin: 0px;
                            margin-left: 10px;
                        }
                    }
                }
                .sales-management-center___bottomLine {
                    top: -5px;
                    border-top: solid $color-straight-line3 1px;
                    right: -20px;
                }
                .sales-management-center___details {
                    background: $color-bg4;
                    height: 400px;
                    border-bottom: 1px solid $color-straight-line2;
                    .sales-management-center___generate {
                        padding: 35px 30px
                    }
                }
                .sales-management-center___button {
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
        }
    }
    .sales-management-header-button {
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
</style>
