<template>
    <d2-container class="add-customer">
        <div class="add-customer-content">
            <fm-generate-form :data="jsonData" :remote="remote" :value="customerData" ref="generateForm" @on-change="selectGenerateChange" @btn-click="btnClick"></fm-generate-form>
            <div class="add-customer-content___upload">
                <label for="male">上传附件:
                    <up-load id="male" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList" ref="upLoad" />
                </label>
            </div>
            <div class="add-customer-content___button">
                <el-button type="primary" @click="onSubmit">确认</el-button>
                <el-button @click="closePageTag">取消</el-button>
            </div>
        </div>
        <div>
            <add-expand-information-dialog :dialogVisible="dialogVisible" :data="values" @change="updataExpandInformation"></add-expand-information-dialog>
        </div>
    </d2-container>
</template>

<script>
import { formGetJson } from '../../../../api/system/fromManagement/index'
import { CUSTOMERAUTHORIZATIONFORM } from '../../../../enum/FORMCODE'
import { CUSTOMERAUTHORIZATION } from '../../../../enum/DICTIONARY'
import { upload } from '../../../../components/qqt-subassembly'
import { getUserDepartment, addAssociatedCompanyCustomerData, 
         getAssociatedCompanyCustomerManagement, addFirstPartyCustomerData, 
         getFirstPartyCustomerManagement } from '../../../../api/customerManagement/customerList'
import { mapActions, mapState } from 'vuex'

// import addExpandInformationDialog from '../../../expandInformation/components/addExpandInformationDialog'
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
                customerInitialContact: '',
                customerNumber: '自动生成',
                customerQualification: '',
                customerQualificationId: '',
                customerSize: '',
                customerStatus: '',
                customerStatusId: '',
                department: '',
                departmentId: '',
                detailedAddress: '',
                position: '',
                positionInIndustry: '',
                positionInIndustryId: '',
                projectManagementLevel: '',
                projectManagementLevelId: '',
                remark: '',
                setUpTheYear: '',
                unitAddress: '',
                unitAddressId: '',
                fileList: []
            },
            values: {},
            dialogVisible: false
        }
    },

    methods: {

        ...mapActions('d2admin/page', [
            'close',
        ]),

        getFormByJson () {
            let formCode = ''
            switch (this.$route.params.identification) {
                case '0':
                    formCode = CUSTOMERAUTHORIZATIONFORM.ADDCUSTOMER
                    break
                case '1':
                    formCode = CUSTOMERAUTHORIZATIONFORM.ADDCUSTOMER
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

        onSubmit (clientType) {
            this.$refs.generateForm.getData ().then(res =>{
                if (res) {
                    this.customerData.customerNumber = 'C_' + new Date ().getTime ()
                     if (this.customerData.clientType == "联营客户") {
                        console.log("联营客户")
                        console.log("customerData")
                        updataAssociatedCompanyCustomer(this.customerData).then( res => {
                            this.$message.success("编辑成功")
                        }).catch(err => {
                            this.$message.warning("编辑失败")
                        })
                    } else if (this.customerData.clientType == "甲方客户") {
                        console.log("甲方客户")
                        updataFirstPartyCustomer(this.customerData).then( res => {
                            this.$message.success("编辑成功")
                        }).catch(err => {
                            this.$message.warning("编辑失败")
                        })
                    } else {
                        console.log(err)
                    }
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
                    this.customerData.department = department.substring(0, department.length - 1)
                    this.customerData.departmentId = departmentId.substring(0, departmentId.length - 1)
                }
            })
        },

        selectGenerateChange (field, val, models) {
            let item = ''
            switch (field) {
                case 'buLeId':
                    item = this.remoteFuncs.businessLeaderOptions.find (r => r.id === val)
                    this.customerData.buLeId = item ? item.id :''
                    this.customerData.businessLeader = item ? item.name : ''
                    this.customerData.position = item ? item.posiId : ''
                    if (item) {
                        this.getPositionDepartment (item.id)
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
                    item = this.remoteFuncs.customerQualification.find (r => r.id === val)
                    this.customerData.customerQualificationId = item ? item.id : ''
                    this.customerData.customerQualification = item ? item.proName : ''
                    break
                case 'projectManagementLevelId':
                    item = this.remoteFuncs.projectManagementLevel.find (r => r.id === val)
                    this.customerData.projectManagementLevelId = item ? item.id : ''
                    this.customerData.projectManagementLevel = item ? item.proName : ''
                    break
                case 'positionInIndustryId':
                    item = this.remoteFuncs.industryCategory.find (r => r.id === val)
                    this.customerData.positionInIndustryId = item ? item.id : ''
                    this.customerData.positionInIndustry = item ? item.proName : ''
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
                case 'customerInitialContact':
                    this.customerData.customerInitialContact = val 
                    break
                case 'detailedAddress':
                    this.customerData.detailedAddress = val 
                    break
                case 'remark':
                    this.customerData.remark = val 
                    break
            }
        },

        closePageTag () {
            let id = this.$route.query.id ? '?id=' + this.$route.query.id : ''
            let tagName = this.$route.path + id
            let path = 'customerList'
            this.close ({ tagName, path })
        },

        getCustomerManagementData (id) {
            let url = ''
            switch (this.$route.params.identification) {
                case '0':
                    url = getAssociatedCompanyCustomerManagement
                    break
                case '1':
                    url = getFirstPartyCustomerManagement
                    break
            }
            url ({'id': id}).then(res => {
                if (res) {
                    this.customerData = res
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
        this.getFormByJson ()
        if (this.$route.query && this.$route.query.id) {
            this.getCustomerManagementData (this.$route.query.id)
        }
    },

    mounted () {
        than = this
    },

    components: {
        'up-load': upload,
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
                // getUnitAddress (resolve) {
                //     resolve ()
                // },
                getBusinessLeader (resolve) {
                    resolve (than.remoteFuncs.businessLeaderOptions)
                },
                getCustomerStatus (resolve) {
                    resolve (than.remoteFuncs.customerOptions)
                },
                getClientGrade (resolve) {
                    resolve (than.remoteFuncs.clientGradeOptions)
                },
                getCustomerSource () {

                },
                getCustomerType ()  {

                },
                getCharaterCustomer () {

                },
                
            }
        }
    }
}
</script>

<style lang='scss' scoped>
.add-customer {
    .add-customer-content {
        box-shadow: 0 2px 12px 0 $color-border-shadow;
        background: $color-bg3;
        height: 100%;
        width: 100%;
        padding: 30px 20px;
        .add-customer-content___upload {
            padding: 0 20px;
            label {
                font-size: 14px;

            }
        }
        .add-customer-content___button {
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
</style>
