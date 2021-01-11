<template>
    <el-dialog v-dialogDrag :visible="dialogVisible" title="业务负责人变更" width="45%" :before-close="handleClose">
        <fm-generate-form :data="jsonData" :remote="remote" :remoteOption="remoteOption" :value="values" ref="generateForm" @on-change="selectGenerateChange"></fm-generate-form>
        <div class="sales-information-update-title">
            <div class="sales-information-update-title___longString">
                <p>操作信息</p>
            </div>
            <div class="sales-information-update-title-right___transverseLine"></div>
        </div>
        <div class="sales-information-update-content">
            <qqt-table-tree :data="data" :rowHeader="rowHeader" :sonProp="sonProp" :sonData="sonTableData" :sonRowHeader="sonRowHeader" />
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="saveSalesInformation">确 定</el-button>
            <el-button @click="$emit('change')">取 消</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { formGetJson } from '../../../../api/system/fromManagement/index'
import { qqtTableTree } from '../../../../components/qqt-subassembly';
import { CUSTOMERAUTHORIZATIONFORM } from '../../../../enum/FORMCODE'
import { updateAssociatedCompanyInformationSalesInformation,
         updateInformationFirstPartySalesInformation } from '../../../../api/customerManagement/salesInformation'
import { getOrganizationByCompanyId, getCompanyByUserId } from '@/api/system/depart/depart'
import { mapState } from 'vuex'

import util from '@/libs/util.js'
let that = this
export default {

    props: {
        data: Array,
        sonProp: String,
        sonTableData: Array,
        essentialData: Array,
        dialogVisible: {
            type: Boolean,
            default: false
        },
        values: {
            type: Object,
            default: () => {}
        },
        identification: String
    },

    data () {
        return {
            remote: {},
            jsonData: {},
            fatherData: {},
            sonRowHeader: [
                {
                    prop: 'formerHeadOf',
                    label: '原业务负责人',
                    isShow: true,
                    align: 'center'
                },
                {
                    prop: 'nowHeadOf',
                    label: '现业务负责人',
                    isShow: true,
                    align: 'center'
                },
                {
                    prop: 'createName',
                    label: '操作人',
                    isShow: true,
                    align: 'center'
                },
            ],
            rowHeader: [
                {
                    prop: 'customerNumber',
                    label: '客户编码',
                    isShow: true,
                    width: '150'
                },
                {
                    prop: 'cusName',
                    label: '客户名称',
                    isShow: true
                },
                {
                    prop: 'customerStatus',
                    label: '客户类型',
                    isShow: true
                },
                {
                    prop: 'clientGrade',
                    label: '客户等级',
                    isShow: true
                },
                {
                    prop: 'businessLeader',
                    label: '业务负责人',
                    isShow: true
                }
            ],
            remoteOption: {
                businessCompanyList: [],
                businessDepartmentList: []
            },
            salesInformation: []
        }
    },

    methods: {

        getFormByJson () {
            formGetJson ({'code': CUSTOMERAUTHORIZATIONFORM.SALESINFORMATIONUPDATE}).then(res => {
                if (res) {
                    this.jsonData = JSON.parse(res)
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
                    this.fatherData.buLeId = this.fatherData.buLeId = item ? item.id : ''
                    this.fatherData.businessLeader = item ? item.name : ''
                    this.fatherData.position = models.position = item ? item.posiId : ''
                    this.getPositionDepartment (item.id)
                    break
                case 'businessCompanyId':
                    item = this.remoteOption.businessCompanyList.find (r => r.id === val)
                    this.fatherData.businessDepartmentId = ''
                    this.fatherData.businessCompanyId = item ? item.id : ''
                    this.identification == '1' ? this.fatherData.businessCompany = item ? item.name : '' : this.fatherData.businessCompanyName = item ? item.name : ''
                    this.getDepIdByCompanyIdList (item.id, this.fatherData.buLeId)
                    break
                case 'businessDepartmentId':
                    item = this.remoteOption.businessDepartmentList.find (r => r.id === val)
                    this.fatherData.businessDepartmentId = item ? item.id : ''
                    this.fatherData.businessDepartmentName = item ? item.name : ''
                    break
            }
        },

        saveSalesInformation () {
            this.essentialData.forEach (res => {
                Object.assign (res, this.fatherData)
            })
            this.updataSalesInformation (this.essentialData)
        },

        updataSalesInformation (list) {
            let url = ''
            switch (this.identification) {
                case '0':
                    url = updateAssociatedCompanyInformationSalesInformation
                    break
                case '1':
                    url = updateInformationFirstPartySalesInformation
                    break
            }
            url (list).then (res => {
                if (res.code === 200) {
                    this.$message.success ('更改成功')
                    this.$emit('change')
                }
            })
        },

        getDepIdByCompanyIdList (id, userId) {
             getOrganizationByCompanyId({'id': id, 'userId': userId}).then(res => {
                if (res && res.length > 0) this.remoteOption.businessDepartmentList = res
             })
        },

        getPositionDepartment (id) {
            getCompanyByUserId ({'userId': id}).then(res => {
                if (res && res.length > 0) this.remoteOption.businessCompanyList = res
            })
        },
    },

    components: {
        'qqt-table-tree': qqtTableTree,
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
             
        },
        remoteFuncs () {
            this.remote = {
                getStaffStaffDictionary (resolve) {
                    resolve (that.remoteFuncs.businessLeaderOptions || [])
                },
            }
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
            width: 87.7%;
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
