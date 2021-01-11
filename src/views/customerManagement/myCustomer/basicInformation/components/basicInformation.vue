<template>
    <d2-container class="basic-information">
        <div class="basic-information-center">
            <customer-details-header :customerInfor="customerInfor" :identification="identification" :isShowTime="true" :isShowProject="true" :isShowInvoice="true" />
            <div class="basic-information-center___bottom">
                <!-- <div class="basic-information-center-title">
                    <div class="basic-information-center-title___longString">
                        <p>客户资料</p>
                    </div>
                </div> -->
                <div class="basic-information-center___bottomLine"></div>
                <div class="basic-information-center___details">
                    <div class="basic-information-center___generate">
                        <fm-generate-form :data="jsonData" :remote="remote" :remoteOption="remoteOption" :value="customerInfor" ref="generateForm" :transform="transform" @on-change="selectGenerateChange" @btn-click="btnClick"></fm-generate-form>
                        <div class="basic-information-center-generate___line" v-if="identification === '1'"></div>
                        <fm-generate-form 
                            :data="accountInformation" 
                            v-if="identification === '1'" 
                            :remote="remote" 
                            :value="customerInfor" 
                            :transform="information" 
                            ref="generateForm" 
                            @on-change="selectGenerateChange" 
                            @btn-click="btnClick">
                        </fm-generate-form>
                        <div class="basic-information-center-generate___setting" v-if="identification === '1' && edit && !customerInfor.iCanSeeIt" >
                            <el-button @click="transform.isShowDetails = false" v-if="transform.isShowDetails" type="primary" plain size="mini">编辑</el-button>
                            <el-button @click="onSubmit" v-if="!transform.isShowDetails" type="primary" plain size="mini">保存</el-button>
                        </div>
                        <div class="basic-information-center-generate___edit" v-if="identification === '1' && edit && !customerInfor.iCanSeeIt">
                            <el-button @click="information.isShowDetails = false" v-if="information.isShowDetails" type="primary" plain size="mini">编辑</el-button>
                            <el-button @click="updataAccountModificationRecord" v-if="!information.isShowDetails" type="primary" plain size="mini">保存</el-button>
                        </div>
                        <div class="basic-information-center-generate___updata" v-if="identification === '1' && !customerInfor.iCanSeeIt" >
                            <el-button @click="skipAccountInformationHistory" type="primary" size="mini">修改记录</el-button>
                        </div>
                        <div class="basic-information-center-generate___line"></div>
                        <div class="basic-information-center___upload">
                            <div class="basic-information-center___label">上传附件:</div>
                            <div class="basic-information-center___right">
                                <up-load id="male" @upLoadFileCallBack="upLoadFileCallBack" :isShowUpload="!transform.isShowDetails" :propList="customerInfor.upLoadFileDefaultList" ref="upLoad" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="basic-information-center___button" v-if="edit">
                    <span v-if="identification === '0' && !customerInfor.iCanSeeIt">
                        <el-button type="primary" v-if="transform.isShowDetails" @click="transform.isShowDetails = false">编辑</el-button>
                        <el-button type="primary" v-else @click="onSubmit">确认</el-button>
                    </span>
                    <el-button size="mini" v-if="transform.isShowDetails" type="info" @click="printTemplate">打印</el-button>
                    <el-button v-if="!transform.isShowDetails" @click="transform.isShowDetails = true, information.isShowDetails = true">取消</el-button>
                    <el-button @click="closeTag">返回</el-button>
                </div>
            </div>
        </div>
        <print-template-by-html v-show="false" :code="identification == '1' ? code1 : code0 " ref="printTemp" />
        <add-expand-information-dialog :dialogVisible="drawer" :data="informationData" @change="updataExpandInformation"></add-expand-information-dialog>
    </d2-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { formGetJson } from '../../../../../api/system/fromManagement/index'
import { CUSTOMERAUTHORIZATIONFORM } from '../../../../../enum/FORMCODE'
import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
import printTemplateByHtml from '@/views/systemManagement/printTemplate/components/printTemplateByHtml'
import { addAssociatedCompanySalesInformation, addFirstPartySalesInformation } from '../../../../../api/customerManagement/salesInformation'
import { updataAssociatedCompanyCustomer, updataFirstPartyCustomer } from '../../../../../api/customerManagement/customerList'
import { updataFirstPartyAccountModificationRecord } from '../../../../../api/customerManagement/accountInformationHistory'
import { getOrganizationByCompanyId, getCompanyByUserId } from '@/api/system/depart/depart'
import { CITYJSON } from '../../../../../enum/CTIYS'
import { upload } from '../../../../../components/qqt-subassembly'

import customerDetailsHeader from '../../components/customerDetailsHeader'
import addExpandInformationDialog from '../../../expandInformation/components/addExpandInformationDialog'
let than = this
export default {
    data () {
        return {
            edit: true,
            drawer: false,
            remote: {},
            jsonData: {},
            formerHead: {},
            accountInformation: {},
            informationData: {},
            cityJson: CITYJSON,
            transform: {
                isShowDetails: true
            },
            information: {
                isShowDetails: true
            },
            remoteOption: {
                businessCompanyList: [],
                businessDepartmentList: [],
                getUnitAddress: CITYJSON
            },
            isAddSalesInformation: false,
            // 普通客户 code1; 联营客户 code0
            code1: BASICSCODE.CUSTOMERS,
            code0: BASICSCODE.CUSTOMER
        }
    },

    methods: {
        
        ...mapActions('d2admin/page', [
            'close',
        ]),

        selectGenerateChange (field, val, models) {
            let item = '', str = ''
            switch (field) {
                case 'buLeId':
                    if (this.remoteFuncs.businessLeaderOptions) {
                        item = this.remoteFuncs.businessLeaderOptions.find (r => r.id === val)
                        this.customerInfor.buLeId = item ? item.id :''
                        this.customerInfor.businessLeader = item ? item.name : ''
                        this.customerInfor.position = item ? item.posiId : ''
                        if (item) {
                            this.customerInfor.businessDepartmentId = this.customerInfor.businessCompanyId = ''
                            this.getPositionDepartment (item.id)
                        }
                        if (item && item.id === this.formerHead['id']) {
                            this.isAddSalesInformation = false
                        } else {
                            this.isAddSalesInformation = true
                        }
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
                case 'customerQualificationId':
                    item = this.remoteFuncs.charaterCustomer.find (r => r.id === val)
                    this.customerInfor.customerQualificationId = item ? item.id : ''
                    this.customerInfor.customerQualification = item ? item.proName : ''
                    break
                case 'projectManagementLevelId':
                    item = this.remoteFuncs.projectManagementLevel.find (r => r.id === val)
                    this.customerInfor.projectManagementLevelId = item ? item.id : ''
                    this.customerInfor.projectManagementLevel = item ? item.proName : ''
                    break
                case 'positionInIndustryIds':
                case 'industryCategoryIds':
                    this.customerInfor.positionInIndustryIds = this.customerInfor.industryCategoryIds = val
                    if (val instanceof Array) { 
                        val.forEach (res => {
                            item = this.remoteFuncs.industryCategory.find (r => r.id === res)
                            str +=  item ? item.proName : ''
                        })
                        this.customerInfor.positionInIndustry = this.customerInfor.industryCategory = str
                    }
                    break
                case 'customerSourceId':
                    item = this.remoteFuncs.customerSource.find (r => r.id === val)
                    this.customerInfor.customerSourceId = item ? item.id : ''
                    this.customerInfor.customerSource = item ? item.proName : ''
                    break
                case 'charaterCustomerId':
                    item = this.remoteFuncs.charaterCustomer.find (r => r.id === val)
                    this.customerInfor.charaterCustomerId = item ? item.id : ''
                    this.customerInfor.charaterCustomer = item ? item.proName : ''
                    break
                case 'customerTypeId':
                    item = this.remoteFuncs.customerType.find (r => r.id === val)
                    this.customerInfor.customerTypeId = item ? item.id : ''
                    this.customerInfor.customerType = item ? item.proName : ''
                    break
                case 'customerCategoryId':
                    item = this.remoteFuncs.customerCategory.find (r => r.id === val)
                    this.customerInfor.customerCategoryId = item ? item.id : ''
                    this.customerInfor.customerCategory = item ? item.proName : ''
                    break
                case 'businessDepartmentId':
                    item = this.remoteOption.businessDepartmentList.find (r => r.id === val)
                    this.customerInfor.businessDepartmentId = item ? item.id : ''
                    this.customerInfor.businessDepartment = item ? item.name : ''
                    break
                case 'businessCompanyId':
                    item = this.remoteOption.businessCompanyList.find (r => r.id === val)
                    if (item) {
                        this.customerInfor.businessDepartmentId = ''
                        this.customerInfor.businessCompanyId = item ? item.id : ''
                        this.identification == '1' ? this.customerInfor.businessCompany = item ? item.name : '' : this.customerInfor.businessCompanyName = item ? item.name : ''
                        this.getDepIdByCompanyIdList (item.id, this.customerInfor.buLeId)
                    }
                    break
                case 'customerSize':
                    this.customerInfor.customerSize = val 
                    break
                case 'setUpTheYear':
                    this.customerInfor.setUpTheYear = val 
                    break
                case 'cusName':
                    this.customerInfor.cusName = val 
                    break
                case 'cusPhone':
                    this.customerInfor.cusPhone = val 
                    break
                case 'detailedAddress':
                    this.customerInfor.detailedAddress = val 
                    break
                case 'remark':
                    this.customerInfor.remark = val 
                    break
                case 'phone': 
                    this.customerInfor.phone = val
                    break
                case 'invoiceTitle': 
                    this.customerInfor.invoiceTitle = val
                    break
                case 'site': 
                    this.customerInfor.site = val
                    break
                case 'depositBank': 
                    this.customerInfor.depositBank = val
                    break
                case 'taxpayerIdentificationNumber': 
                    this.customerInfor.taxpayerIdentificationNumber = val
                    break
                case 'bankAccount': 
                    this.customerInfor.bankAccount = val
                    break
                case 'unitAddressIds':
                    this.customerInfor.unitAddressIds = val
                    if (val instanceof Array) {
                        this.customerInfor.unitAddress = ''
                        this.neatenCascaderData (CITYJSON, val, 0)
                    }
                    break
            }
        },

        neatenCascaderData (list, value, num) {
            let item = list.find (f => f.value === value[num])
            if (item) {
                this.customerInfor.unitAddress += item.label
                if (item.children && item.children.length > 0) {
                    this.neatenCascaderData (item.children, value, num + 1)
                }
            }
        },

        getFormByJson () {
            let list = []
            let item = null
            switch (this.identification) {
                case '0':
                    list = [CUSTOMERAUTHORIZATIONFORM.BASICINFORMATION]
                    break
                case '1':
                    list = [
                        CUSTOMERAUTHORIZATIONFORM.FIRSTPARTYBASICINFORMATION,
                        CUSTOMERAUTHORIZATIONFORM.FIRSTPARTYACCOUNTINFORMATION
                    ]
                    break
            }
            list.filter (code => {
                formGetJson ({'code': code}).then(res => {
                    if (res) {
                        if (code === CUSTOMERAUTHORIZATIONFORM.FIRSTPARTYACCOUNTINFORMATION) {
                            this.accountInformation = JSON.parse (res)
                        } else {
                            this.jsonData = JSON.parse (res)
                        }
                    }
                })
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
                    if (this.customerInfor.unitAddressIds) {
                        this.customerInfor['unitAddressId'] = JSON.stringify (this.customerInfor.unitAddressIds)
                    }
                    if (this.customerInfor && this.customerInfor.positionInIndustryIds) {
                        this.customerInfor['positionInIndustryId'] = JSON.stringify (this.customerInfor.positionInIndustryIds)
                    }
                    if (this.customerInfor && this.customerInfor.industryCategoryIds) {
                        this.customerInfor['industryCategoryId'] = JSON.stringify (this.customerInfor.industryCategoryIds)
                    }
                    url (this.customerInfor).then (item => {
                        if (item.code === 200) {
                            this.transform.isShowDetails = true
                            this.information.isShowDetails = true
                            if (this.isAddSalesInformation) {
                                this.addSalesInformationData ()
                            } else {
                                this.$message.success ('操作成功')
                            }
                            this.$store.dispatch ('d2admin/customer/customerInformation', { 'item': this.customerInfor })
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

        updataAccountModificationRecord () {
            this.$refs.generateForm.getData ().then (res => {
                if (res) {
                    res['id'] = this.customerInfor.id
                    updataFirstPartyAccountModificationRecord (res).then (item => {
                        if (item.code === 200) {
                            this.$message.success ('操作成功')
                            this.transform.isShowDetails = true
                            this.information.isShowDetails = true
                            this.$store.dispatch ('d2admin/customer/customerInformation', { 'item': this.customerInfor })
                        }
                    })
                }
            })
        },

        getPositionDepartment (id, boolean = false) {
            getCompanyByUserId ({'userId': id}).then(res => {
                if (res && res.length > 0) this.remoteOption.businessCompanyList = res
                if (boolean) this.getDepIdByCompanyIdList (this.customerInfor.businessCompanyId, this.customerInfor.buLeId)
            }).finally(res => {
                this.getFormByJson ()
            })
        },

        getDepIdByCompanyIdList (id, userId) {
             getOrganizationByCompanyId({'id': id, 'userId': userId}).then(res => {
                if (res && res.length > 0) this.remoteOption.businessDepartmentList = res
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

        skipAccountInformationHistory () {
            this.$router.push({
                path: '/customerManagement/myCustomer/accountInformationHistory'
            })
        },

        upLoadFileCallBack (item) {
            this.customerInfor.fileList = item
        },

        // 验证权限
        _validationAuth () {
            this.edit = this.identification === '0' ? this.$has('client:list:edit') : this.$has ('clients:list:edit')
        },

        closeTag () {
            let tagName = this.$route.path
            let path = ''
            
            // 我的客户模块的页面跳转标识在 myClientPath 里，根据 myClientPath 判断返回路由
            if (this.customerInfor.myClientPath) {
                path = `/customerManagement/myClientModule/${this.customerInfor.myClientPath}`
            } else {
                path = `/customerManagement/customerList/${this.identification}`
            }
            this.close ({tagName, path})
        },
        printTemplate () {
            let id = this.identification == '1' ? this.code1 : this.code0  
            getPrintTemplateInfoByCodeAndBusiness ({'id': id, 'businessId': this.customerInfor.id}).then(res => {
                this.$refs.printTemp.printTemplate (res)
            })
        },
    },

    computed: {
        ...mapState('d2admin/customer', [
            'identification',
            'remoteFuncs',
            'customerInfor'
        ])
    },

    mounted () {
        than = this
        this._validationAuth ()
    },

    created () {
        this.$store.dispatch ('d2admin/customer/identificationSet', this.$route.params.identification)
        this.$store.dispatch ('d2admin/customer/identificationLoad')
        this.$store.dispatch ('d2admin/customer/remoteFuncsLoad')
        this.$store.dispatch ('d2admin/customer/customerInformationLoad')
    },

    components: {
        'add-expand-information-dialog': addExpandInformationDialog,
        'customer-details-header': customerDetailsHeader,
        'up-load': upload,
        'print-template-by-html': printTemplateByHtml
    },

    watch: {
        remoteFuncs (val) {
            this.remote = {
                getCustomerQualification (resolve) {
                    resolve (than.remoteFuncs.customerQualification)
                },
                getProjectManagementLevel (resolve) {
                    resolve (than.remoteFuncs.projectManagementLevel)
                },
                getUpTheYear (resolve) {
                    let options = [
                        {id: '1', proName: '少于5年'},
                        {id: '2', proName: '5-10年'},
                        {id: '3', proName: '10-20年'},
                        {id: '4', proName: '20-40年'},
                        {id: '5', proName: '40-80年'},
                        {id: '6', proName: '80-160年'},
                        {id: '7', proName: '160年以上'},
                    ]
                    resolve (options)
                },
                getCustomerSize (resolve) {
                    let options = [
                        {id: '1', proName: '少于50人'},
                        {id: '2', proName: '50-150人'},
                        {id: '3', proName: '150-500人'},
                        {id: '4', proName: '500-1000人'},
                        {id: '5', proName: '1000人以上'},
                    ]
                    resolve (options)
                },
                getPositionInIndustry (resolve) {
                    resolve (than.remoteFuncs.industryCategory)
                },
                getUnitAddress (resolve) {
                    resolve (CITYJSON)
                },
                getBusinessLeader (resolve) {
                    resolve (than.remoteFuncs.businessLeaderOptions)
                },
                getCustomerStatus (resolve) {
                    resolve (than.remoteFuncs.customerOptions)
                },
                getClientGrade (resolve) {
                    resolve (than.remoteFuncs.clientGradeOptions)
                },
                getCustomerSource (resolve) {
                    resolve (than.remoteFuncs.customerSource)
                },
                getCustomerType (resolve)  {
                    resolve (than.remoteFuncs.customerType)
                },
                getCharaterCustomer (resolve) {
                    resolve (than.remoteFuncs.charaterCustomer)
                },
                getCustomerCategory (resolve) {
                    resolve (than.remoteFuncs.customerCategory)
                }
                
            }
        },

        $route (val) {
            if (val.path.indexOf('basicInformation') !== -1) {
                this.$store.dispatch ('d2admin/customer/identificationSet', val.params.identification)
                this.$store.dispatch ('d2admin/customer/customerInformationLoad')
                this.getFormByJson ()
            }
        },

        customerInfor (val) {
            if (!val.id) return
            this.formerHead['name'] = val.businessLeader
            this.formerHead['id'] = val.buLeId
            this.getPositionDepartment (val.buLeId, true)
        }
    }
}
</script>

<style lang='scss' scoped>
    .basic-information {
        .basic-information-center {
            height: 100%;
            padding: 10px;
            .basic-information-center___top {
                box-shadow: 0 2px 12px 0 $color-border-shadow;
                height: 15%;
                min-height: 117px;
                background: $color-bg3;
                .basic-information-center-top___left {
                    padding: 20px;
                    display: inline-block;
                    .basic-information-center-top-left___header {
                        .basic-information-center-top-left___title {
                            font-size: 14px;
                            padding-left: 10px;
                            color: $color-text-normal;
                        }
                        .el-icon-star-on {
                            font-size: 16px;
                            position: relative;
                            top: 1px
                        }
                        .select {
                            color: $startusing
                        }
                        .basic-information-center-top-left-header___operation {
                            padding-left: 20px;
                            .basic-information-center_header___replacement {
                                background: $color-button-reset !important;
                            }
                        }
                    }
                    .basic-information-center-top-left___address {
                        position: relative;
                        left: 28px;
                        top: 35px;
                    }
                }
                .basic-information-center-top___right {
                    float: right;
                    .basic-information-center-top-right___longString {
                        display: inline-block;
                        border-left: 1px solid $color-straight-line2;
                        padding: 10px 30px;
                        .basic-information-center-top-right___particulars {
                            font-size: 14px;
                            padding: 6px 0;
                        }
                    }
                }
            }
            .basic-information-center___bottom {
                height: 83%;
                margin-top: 20px;
                box-shadow: 0 2px 12px 0 $color-border-shadow;
                background: $color-bg3;
                font-size: 14px;
                .basic-information-center-title {
                    padding: 30px 32px 10px;
                    .basic-information-center-title___longString {
                        border-left: 3px solid $color-text-title;
                        p {
                            color:  $color-text-title;
                            display: inline-block;
                            margin: 0px;
                            margin-left: 10px;
                        }
                    }
                }
                .basic-information-center___bottomLine {
                    top: -5px;
                    border-top: solid $color-straight-line3 1px;
                    right: -20px;
                }
                .basic-information-center___details {
                    background: $color-bg4;
                    height: 420px;
                    border-bottom: 1px solid $color-straight-line2;
                    overflow: auto;
                    .basic-information-center___generate {
                        padding: 35px 30px;
                        .basic-information-center-generate___line {
                            border: 1px dashed $color-straight-line3;
                            margin: 20px 50px 35px 30px;
                        }
                        .basic-information-center-generate___edit {
                            position: relative;
                            top: -110px;
                            float: right;
                            margin-right: -110px;
                            button {
                                width: 110px;
                            }
                        }
                        .basic-information-center-generate___setting {
                            position: relative;
                            top: -450px;
                            float: right;
                            button {
                                width: 110px;
                            }
                        }
                        .basic-information-center-generate___updata {
                            position: relative;
                            top: -53px;
                            float: right;
                            margin-right: -110px;
                            button {
                                width: 110px;
                            }
                        }
                        .basic-information-center___upload {
                            padding: 0 30px;
                            .basic-information-center___label {
                                font-size: 14px;
                                float: left;
                                margin-left: 15px
                            }
                            .basic-information-center___right {
                                float: left;
                                margin-left: 12px
                            }
                        }
                    }
                }
                .basic-information-center___button {
                    text-align: center;
                    padding-top: 20px;
                    span {
                        padding-right: 10px;
                    }
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
    .basic-information-header-button {
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
