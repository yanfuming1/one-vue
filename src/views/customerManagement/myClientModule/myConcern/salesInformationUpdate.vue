<template>
    <div>
        <el-dialog v-dialogDrag :visible="dialogVisible" title="销售信息更新" width="40%" :before-close="handleClose">
            <fm-generate-form :data="jsonData" :remote="remote" :value="values" ref="generateForm" @on-change="selectGenerateChange" @btn-click="btnClick"></fm-generate-form>
            <div class="sales-information-update-title">
                <div class="sales-information-update-title___longString">
                    <p>客户授权</p>
                </div>
                <div class="sales-information-update-title-right___transverseLine"></div>
                <el-button class="sales-information-update-title-right___button">授权</el-button>
            </div>
            <div class="sales-information-update-content">
                <qqt-table :data="tableData" :rowHeader="rowHeader" :isDrag="isDrag" :isShowGroup="isShowGroup" :pageShow="isShowPage" :option="tableOption" @selectionChange="selectChange"></qqt-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveSalesInformation">确 定</el-button>
                <el-button @click="$emit('change')">取 消</el-button>
            </span>
        </el-dialog>
        <div>
            <add-expand-information-dialog :dialogVisible="drawer" :data="informationData" @change="updataExpandInformation"></add-expand-information-dialog>
        </div>
    </div>
</template>

<script>
import { formGetJson } from '../../../../api/system/fromManagement/index'
import { qqtTable } from '../../../../components/qqt-subassembly';
import { getUserDepartment, updataAssociatedCompanyCustomer, updataFirstPartyCustomer } from '../../../../api/customerManagement/customerList'
import { getCustomerAuthorizationByUserId, getFirstPartyCustomerAuthorizationByUserId } from '../../../../api/customerManagement/customerAuthorization'
import { CUSTOMERAUTHORIZATIONFORM } from '../../../../enum/FORMCODE'
import { mapState } from 'vuex'

import addExpandInformationDialog from '../../expandInformation/components/addExpandInformationDialog'
import util from '@/libs/util.js'
let that = this
export default {

    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        data: {
            type: Object,
            default: () => {}
        },
        identification: String,
        tableSelectData:Array   
    },

    data () {
        return {
            jsonData: {},
            values: {},
            fatherData: JSON.parse(JSON.stringify(this.data)),
            saleTableSelectData: [],
            rowHeader: [
                {
                    prop: 'authorizationType',
                    label: '授权类型',
                    isShow: true,
                },
                {
                    prop: 'authorizationType',
                    label: '授权对象',
                    isShow: true,
                },
            ],
            remote: {},
            tableData: {},
            informationData: {},
            salesInformationData:'',
            tableOption: {
                border: true
            },
            isShowPage: false,
            isShowSelection: false,
            isShowGroup: false,
            isDrag: false,
            drawer: false
        }
    },

    methods: {

        initialSalesInformation () {
            // if ( dialogVisible = true ){
                
            // }
        },

        selectChange (item) {
            this.saleTableSelectData = item
        },

        getFormByJson () {
            formGetJson ({'code': CUSTOMERAUTHORIZATIONFORM.SALESINFORMATIONUPDATE}).then(res => {
                if (res) {
                    this.jsonData = JSON.parse(res)
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
                    this.fatherData.department = this.values.department = department.substring(0, department.length - 1)
                    this.fatherData.departmentId = departmentId.substring(0, departmentId.length - 1)
                }
            })
        },

        salesInformationDataEvent (tableSelectData) {
            this.salesInformationData = tableSelectData
        },

        saveSalesInformation (salesInformationData) {
            console.log(this.salesInformationData)
            let url = ''
            switch (this.tableSelectData[0].clientType) {
                case '联营客户':
                    url = updataAssociatedCompanyCustomer
                    break
                case '甲方客户':
                    url = updataFirstPartyCustomer
                    break
            }
            url (this.fatherData).then(res => {
                if (res.code === 200) {
                    this.$message.success ('操作成功')
                    this.$emit ('change')
                }
            })
        },

        handleClose () {
            this.$emit('change')
        },

        selectGenerateChange (field, val, models) {
            let item = ''
            switch (field) {
                case 'buLeId':
                    item = this.remoteFuncs.businessLeaderOptions.find (r => r.id === val)
                    this.values.buLeId = this.fatherData.buLeId = item ? item.id :''
                    this.fatherData.businessLeader = item ? item.name : ''
                    if (item) {
                        this.getPositionDepartment (item.id)
                    }
                    break
                case 'clientGradeId':
                    item = this.remoteFuncs.clientGradeOptions.find (r => r.id === val)
                    this.fatherData.clientGradeId = this.values.clientGradeId = item ? item.id : ''
                    this.fatherData.clientGrade = item ? item.proName : ''
                    break
                case 'customerStatusId':
                    item = this.remoteFuncs.customerOptions.find (r => r.id === val)
                    this.fatherData.customerStatusId = this.values.customerStatusId = item ? item.id : ''
                    this.fatherData.customerStatus = item ? item.proName : ''
                    break
            }
        },

        getCustomerAuthorization () {
            getCustomerAuthorizationByUserId({'buLeId': util.cookies.get ('uuid')}).then(res => {
                if (res && res.length > 0) {
                    this.tableData.records = res
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
        }
    },

    components: {
        'qqt-table': qqtTable,
        'add-expand-information-dialog': addExpandInformationDialog
    },

    mounted () {
        that = this
    },

    computed: {
        ...mapState('d2admin/customer', [
            'remoteFuncs'
        ])
    },

    created () {
        this.$store.dispatch ('d2admin/customer/remoteFuncsLoad')
        this.getFormByJson ()
    },

    watch: {
        data (val) {
            this.fatherData = JSON.parse(JSON.stringify(val))
            this.values = {
                buLeId: this.fatherData.buLeId,
                clientGradeId: this.fatherData.clientGradeId,
                department: this.fatherData.department,
                customerStatusId: this.fatherData.customerStatusId
            }
        },
        remoteFuncs () {
            this.remote = {
                getExpandInformationClientGrade (resolve) {
                    resolve (that.remoteFuncs.clientGradeOptions)
                },

                getStaffStaffDictionary (resolve) {
                    resolve (that.remoteFuncs.businessLeaderOptions)
                },

                getExpandInformationCustomerStatus (resolve) {
                    resolve (that.remoteFuncs.customerOptions)
                }
            }
        },
        identification () {
            this.getCustomerAuthorization ()
        }
    }
}
</script>

<style lang='scss' scoped>
    .sales-information-update-title {
        .sales-information-update-title___longString {
                display: inline-block;
                border-left: 3px solid $color-text-title;
                p {
                    color:  $color-text-title;
                    display: inline-block;
                    margin: 0px;
                    margin-left: 10px;
                }
            }
        .sales-information-update-title-right___transverseLine {
            width: 80%;
            top: -5px;
            border-top: solid $color-straight-line3 1px;
            display: inline-block;
            position: relative;
            right: -20px;
        }
        .sales-information-update-title-right___button {
            float: right;
            position: relative;
            top: -6px;
            border-radius: 11px;
            border: 1px solid $color-vertical-line;
            color: $color-button-typeface1
        }
    }
    .sales-information-update-content {
        padding-top: 20px;
    }
</style>
