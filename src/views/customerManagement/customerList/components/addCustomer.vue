<template>
    <d2-container class="add-customer">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
            </div>
            <fm-generate-form :data="jsonData" :remote="remote" :remoteOption="remoteOption" :transform="transform" :value="customerData" ref="generateForm" @on-change="selectGenerateChange" @btn-click="btnClick"></fm-generate-form>
            <bottomInformation :values="customerData" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation"></bottomInformation>
            <div class="drawer-btn">
                <el-button type="primary" size="mini" v-if="!transform.isShowDetails" @click="onSubmit">保存</el-button>
                <el-button size="mini" @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <add-expand-information-dialog :dialogVisible="dialogVisible" :data="values" @change="updataExpandInformation"></add-expand-information-dialog>
    </d2-container>
</template>

<script>
import { formGetJson } from '../../../../api/system/fromManagement/index'
import { CUSTOMERAUTHORIZATIONFORM } from '../../../../enum/FORMCODE'
import { CUSTOMERAUTHORIZATION } from '../../../../enum/DICTIONARY'
import { upload } from '../../../../components/qqt-subassembly'
import { addAssociatedCompanyCustomerData, updataAssociatedCompanyCustomer,
         getAssociatedCompanyCustomerManagement, addFirstPartyCustomerData, updataFirstPartyCustomer,
         getFirstPartyCustomerManagement } from '../../../../api/customerManagement/customerList'
import { addAssociatedCompanySalesInformation, addFirstPartySalesInformation } from '../../../../api/customerManagement/salesInformation'
import { getOrganizationByCompanyId, getCompanyByUserId } from '@/api/system/depart/depart'
import { mapActions, mapState } from 'vuex'
import { CITYJSON } from '../../../../enum/CTIYS'

import bottomInformation from '../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
import addExpandInformationDialog from '../../expandInformation/components/addExpandInformationDialog'
import util from '@/libs/util.js'
let than = this
export default {
    name: 'addCustomer',
    data () {
        return {
            jsonData: {},
            remote: {},
            upLoadFileDefaultList: [],
            customerData: {
                buLeId: '',
                businessLeader: '',
                clientGrade: '',
                clientGradeId: '',
                cusName: '',
                cusPhone: '',
                customerInitialContact: '',
                customerNumber: '自动生成',
                customerQualification: '',
                customerQualificationId: '',
                customerSize: '',
                customerStatus: '',
                customerStatusId: '',
                businessDepartment: '',
                businessDepartmentName: '',
                businessDepartmentId: '',
                businessCompanyName: '',
                businessCompanyId: '',
                detailedAddress: '',
                position: '',
                positionInIndustry: '',
                positionInIndustryIds: [],
                industryCategory: '',
                industryCategoryIds: [],
                projectManagementLevel: '',
                projectManagementLevelId: '',
                customerSource: '',
                customerSourceId: '',
                charaterCustomer: '',
                charaterCustomerId: '',
                customerCategoryId: '',
                customerCategory: '',
                customerType: '',
                customerTypeId: '',
                remark: '',
                setUpTheYear: '',
                unitAddress: '',
                unitAddressIds: '',
                unitAddresss: '',
                phone: '',
                invoiceTitle: '',
                site: '',
                depositBank: '',
                taxpayerIdentificationNumber: '',
                bankAccount: '',
                fileList: []
            },
            values: {},
            formerHead: {},
            cityName: '',
            dialogVisible: false,
            isAddSalesInformation: false,
            isEdit: false,
            transform: {
                isShowDetails: false
            },
            remoteOption: {
                businessCompanyList: [],
                businessDepartmentList: []
            }
        }
    },

    methods: {

        ...mapActions('d2admin/page', [
            'close',
        ]),

        getFormByJson () {
            let formCode = ''
            switch (this.$route.query.identification) {
                case '0':
                    formCode = CUSTOMERAUTHORIZATIONFORM.ADDCUSTOMER
                    break
                case '1':
                    formCode = CUSTOMERAUTHORIZATIONFORM.FIRSTPARTYADDCUSTOMER
                    break
                case '2':
                    formCode = this.$route.params.boolean ? CUSTOMERAUTHORIZATIONFORM.ADDCUSTOMER : CUSTOMERAUTHORIZATIONFORM.FIRSTPARTYADDCUSTOMER
                    break
            }
            formGetJson ({'code': formCode}).then(res => {
                if (res) {
                    this.jsonData = JSON.parse(res)
                }
            })
        },

        upLoadFileCallBack (item) {
            this.customerData.fileList = item
        },

        onSubmit () {
            let element = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData ().then(res =>{
                if (res && element) {
                    let url = ''
                    switch (this.$route.query.identification) {
                        case '0':
                            if (this.customerData.id == null) {
                                this.isEdit = false
                                url = addAssociatedCompanyCustomerData
                            } else {
                                this.isEdit = true
                                url = updataAssociatedCompanyCustomer
                            }
                            break
                        case '1':
                            if (this.customerData.id == null) {
                                this.isEdit = false
                                url = addFirstPartyCustomerData
                            } else {
                                this.isEdit = true
                                url = updataFirstPartyCustomer
                            }
                            break
                    }
                    if (this.customerData && this.customerData.unitAddressIds) {
                        this.customerData['unitAddressId'] = JSON.stringify (this.customerData.unitAddressIds)
                        this.customerData.unitAddress = this.cityName + this.customerData.unitAddress
                    }
                    if (this.customerData && this.customerData.positionInIndustryIds) {
                        this.customerData['positionInIndustryId'] = JSON.stringify (this.customerData.positionInIndustryIds)
                    }
                    if (this.customerData && this.customerData.industryCategoryIds) {
                        this.customerData['industryCategoryId'] = JSON.stringify (this.customerData.industryCategoryIds)
                    }
                    Object.assign (this.customerData, element)
                    url (this.customerData).then(item => {
                        if (item.code === 200) {
                            if (this.isEdit && this.isAddSalesInformation) {
                                this.addSalesInformationData ()
                            } else {
                                this.$message.success ('操作成功')
                                this.closePageTag ()
                            }
                        }
                    })
                }
            })
        },

        addSalesInformationData () {
            let url = ''
            switch (this.$route.query.identification) {
                case '0':
                    url = addAssociatedCompanySalesInformation
                    break
                case '1':
                    url = addFirstPartySalesInformation
                    break
            }
            const {id: cusId, cusName, businessLeader: nowHeadOf, buLeId: nowHeadOfId} = this.customerData
            let item = { cusId, cusName, nowHeadOf, nowHeadOfId, formerHeadOf: this.formerHead.name, formerHeadOfId: this.formerHead.id}
            url (item).then (res => {
                if (res.code === 200) {
                    this.$message.success ('操作成功')
                    this.closePageTag ()
                }
            })
        },

        getPositionDepartment (id, boolean = false) {
            getCompanyByUserId ({'userId': id}).then(res => {
                if (res && res.length > 0) this.remoteOption.businessCompanyList = res
                if (boolean) {
                    this.getDepIdByCompanyIdList (this.customerData.businessCompanyId, this.customerData.buLeId)
                } else if (res.length == 1) {
                    this.customerData.businessCompanyId = res[0]['id']
                    this.identification == '1' ? this.customerData.businessCompany = res[0]['name'] : this.customerData.businessCompanyName = res[0]['name']
                    this.getDepIdByCompanyIdList (res[0]['id'], id)
                }
            })
        },

        getDepIdByCompanyIdList (id, userId) {
             getOrganizationByCompanyId({'id': id, 'userId': userId}).then(res => {
                
                if (res && res.length > 0) this.remoteOption.businessDepartmentList = res
                if (res && res.length == 1) {
                    this.customerData.businessDepartmentId = res[0]['id']
                    this.customerData.businessDepartmentName = res[0]['name']
                    this.customerData.businessDepartment = res[0]['name']
                }
             })
        },

        selectGenerateChange (field, val) {
            let item = '', str = ''
            switch (field) {
                case 'buLeId':
                    if (this.remoteFuncs.businessLeaderOptions) {
                        item = this.remoteFuncs.businessLeaderOptions.find (r => r.id === val)
                        this.customerData.buLeId = item ? item.id :''
                        this.customerData.businessLeader = item ? item.name : ''
                        this.customerData.position = item ? item.posiId : ''
                        if (item) {
                            this.customerData.businessDepartmentId = this.customerData.businessCompanyId = ''
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
                    this.customerData.clientGradeId = item ? item.id : ''
                    this.customerData.clientGrade = item ? item.proName : ''
                    break
                case 'customerStatusId':
                    item = this.remoteFuncs.customerOptions.find (r => r.id === val)
                    this.customerData.customerStatusId = item ? item.id : ''
                    this.customerData.customerStatus = item ? item.proName : ''
                    break
                case 'customerQualificationId':
                    item = this.remoteFuncs.charaterCustomer.find (r => r.id === val)
                    this.customerData.customerQualificationId = item ? item.id : ''
                    this.customerData.customerQualification = item ? item.proName : ''
                    break
                case 'projectManagementLevelId':
                    item = this.remoteFuncs.projectManagementLevel.find (r => r.id === val)
                    this.customerData.projectManagementLevelId = item ? item.id : ''
                    this.customerData.projectManagementLevel = item ? item.proName : ''
                    break
                case 'positionInIndustryIds':
                case 'industryCategoryIds':
                    this.customerData.positionInIndustryIds = this.customerData.industryCategoryIds = val
                    if (val instanceof Array) { 
                        val.forEach (res => {
                            item = this.remoteFuncs.industryCategory.find (r => r.id === res)
                            str +=  item ? item.proName : ''
                        })
                        this.customerData.positionInIndustry = this.customerData.industryCategory = str
                    }
                    break
                case 'customerSourceId':
                    item = this.remoteFuncs.customerSource.find (r => r.id === val)
                    this.customerData.customerSourceId = item ? item.id : ''
                    this.customerData.customerSource = item ? item.proName : ''
                    break
                case 'charaterCustomerId':
                    item = this.remoteFuncs.charaterCustomer.find (r => r.id === val)
                    this.customerData.charaterCustomerId = item ? item.id : ''
                    this.customerData.charaterCustomer = item ? item.proName : ''
                    break
                case 'customerTypeId':
                    item = this.remoteFuncs.customerType.find (r => r.id === val)
                    this.customerData.customerTypeId = item ? item.id : ''
                    this.customerData.customerType = item ? item.proName : ''
                    break
                case 'customerCategoryId':
                    item = this.remoteFuncs.customerCategory.find (r => r.id === val)
                    this.customerData.customerCategoryId = item ? item.id : ''
                    this.customerData.customerCategory = item ? item.proName : ''
                    break
                case 'businessDepartmentId':
                    item = this.remoteOption.businessDepartmentList.find (r => r.id === val)
                    this.customerData.businessDepartmentId = item ? item.id : ''
                    this.customerData.businessDepartmentName = item ? item.name : ''
                    this.customerData.businessDepartment = item ? item.name : ''
                    break
                case 'businessCompanyId':
                    item = this.remoteOption.businessCompanyList.find (r => r.id === val)
                    if (item) {
                        this.customerData.businessDepartmentId = ''
                        this.customerData.businessCompanyId = item ? item.id : ''
                        this.identification == '1' ? this.customerData.businessCompany = item ? item.name : '' : this.customerData.businessCompanyName = item ? item.name : ''
                        this.getDepIdByCompanyIdList (item.id, this.customerData.buLeId)
                    }
                    break
                case 'customerSize':
                    this.customerData.customerSize = val 
                    break
                case 'setUpTheYear':
                    this.customerData.setUpTheYear = val 
                    break
                case 'cusName':
                    this.customerData.cusName = val 
                    break
                case 'cusPhone':
                    this.customerData.cusPhone = val 
                    break
                case 'detailedAddress':
                    this.customerData.detailedAddress = val 
                    break
                case 'remark':
                    this.customerData.remark = val 
                    break
                case 'phone': 
                    this.customerData.phone = val
                    break
                case 'invoiceTitle': 
                    this.customerData.invoiceTitle = val
                    break
                case 'site': 
                    this.customerData.site = val
                    break
                case 'depositBank': 
                    this.customerData.depositBank = val
                    break
                case 'taxpayerIdentificationNumber': 
                    this.customerData.taxpayerIdentificationNumber = val
                    break
                case 'bankAccount': 
                    this.customerData.bankAccount = val
                    break
                case 'unitAddressIds':
                    this.customerData.unitAddressIds = val
                    if (val instanceof Array) {
                        this.customerData.unitAddress = ''
                        this.neatenCascaderData (CITYJSON, val, 0)
                    }
                    break
            }
        },

        neatenCascaderData (list, value, num) {
            let item = list.find (f => f.value === value[num])
            if (item) {
                this.customerData.unitAddress += item.label
                if (item.children && item.children.length > 0) {
                    this.neatenCascaderData (item.children, value, num + 1)
                }
            }
        },

        closePageTag () {
            let id = this.$route.query.identification ? '?identification=' + this.$route.query.identification : ''
            let tagName = this.$route.path + id
            let path = this.$router.go(-1)
            this.close ({ tagName, path })
        },

        getCustomerManagementData (id) {
            let url = ''
            switch (this.$route.query.identification) {
                case '0':
                    url = getAssociatedCompanyCustomerManagement
                    break
                case '1':
                    url = getFirstPartyCustomerManagement
                    break
                case '2':
                    url = this.$route.params.boolean ? getAssociatedCompanyCustomerManagement : getFirstPartyCustomerManagement
                    break
            }
            url ({'id': id}).then(res => {
                if (res) {
                    this.customerData = res
                    this.formerHead['name'] = res.businessLeader
                    this.formerHead['id'] = res.buLeId
                    if (res.buLeId) this.getPositionDepartment (res.buLeId, true)
                    if (this.customerData && this.customerData.unitAddressId) {
                        this.customerData.unitAddressIds = JSON.parse (this.customerData.unitAddressId)
                    }
                    if (this.customerData && this.customerData.positionInIndustryId) {
                        this.customerData.positionInIndustryIds = JSON.parse (this.customerData.positionInIndustryId)
                    }
                    if (this.customerData && this.customerData.industryCategoryId) {
                        this.customerData.industryCategoryIds = JSON.parse (this.customerData.industryCategoryId)
                    }
                    if (this.customerData.fileList && this.customerData.fileList.length > 0) {
                        this.customerData.fileList.forEach(item => {
                            let m = {
                                status : 'finished',
                                response : {
                                    url : item.url,
                                    size: item.size,
                                    name: item.name
                                }
                            }
                            this.upLoadFileDefaultList.push(m)
                        })
                    }
                }
            }).finally(res => {
                this.getFormByJson ()
            })
        },

        btnClick (val, field) {
            let item = {}
            item['id'] = val
            this.values = item
            this.dialogVisible = true
        },

        updataExpandInformation () {
            this.dialogVisible = false
            this.$store.dispatch ('d2admin/customer/remoteFuncsLoad')
        }
    },

    computed: {
        ...mapState('d2admin/customer', [
            'remoteFuncs'
        ])
    },

    created () {
        this.$store.dispatch ('d2admin/customer/remoteFuncsLoad')
        this.transform = this.$route.params.transform || { isShowDetails: false }
        if (this.$route.params && this.$route.params.id) {
            this.getCustomerManagementData (this.$route.params.id)
        } else {
            this.selectGenerateChange ('buLeId', util.cookies.get ('uuid'))
            this.getFormByJson ()
        }
    },

    mounted () {
        than = this
    },

    components: {
        'bottomInformation': bottomInformation,
        'add-expand-information-dialog': addExpandInformationDialog
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
            if (val.path.indexOf('addCustomer') !== -1) {
                this.getFormByJson ()
            }
        }
    }
}
</script>

<style lang='scss' scoped>
.add-customer {
    .drawer-btn{
        padding-top: 10px;
        text-align: center;
    }
}
</style>
