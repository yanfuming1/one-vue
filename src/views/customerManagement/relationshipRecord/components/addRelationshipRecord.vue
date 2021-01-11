<template>
    <div class="add-relationship-record">
        <div class="add-relationship-record-add">
            <el-drawer
                title="联系记录"
                :visible="drawer"
                :direction="direction"
                size="50%"
                :before-close="handleClose">
                <div class="add-relationship-record__content">
                    <fm-generate-form :data="jsonData" :remote="remote" :remoteOption="remoteOption" :value="values" :transform="transform" ref="generateForm" @on-change="selectGenerateChange" @btn-click="btnClick"></fm-generate-form>
                    <bottom-information :values="values" :isGrid="true" :isShowAccessory="false" :transform="transform" ref="bottomInformation" />
                    <div class="add-relationship-record__button">
                        <el-button v-if="!state" @click="addRelationshipRecord" type="warning" size="mini">保存</el-button>
                        <el-button size="mini" v-if="transform.isShowDetails" type="info" @click="printTemplate">打印</el-button>
                        <el-button @click="$emit('change')" size="mini">关闭</el-button>
                    </div>
                </div>
                
            </el-drawer>
        </div>
        <print-template-by-html v-show="false" :code="identification == '1' ? code1 : code0 " ref="printTemp" />
        <div>
            <add-expand-information-dialog :dialogVisible="dialogVisible" :data="data" @change="updataExpandInformation"></add-expand-information-dialog>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { formGetJson } from '../../../../api/system/fromManagement/index'
import { CUSTOMERAUTHORIZATIONFORM } from '../../../../enum/FORMCODE'
import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
import printTemplateByHtml from '@/views/systemManagement/printTemplate/components/printTemplateByHtml'
import { addRelationshipRecordData, addFirstPartyRelationshipRecordData, 
         editRelationshipRecordData, editFirstPartyRelationshipRecordData,
         getRelationshipRecordData, getFirstPartyRelationshipRecordData } from '../../../../api/customerManagement/relationshipRecord'
import { associatedProjects } from '../../../../api/customerManagement/capitalAccount'

import util from '@/libs/util.js'
import addExpandInformationDialog from '../../expandInformation/components/addExpandInformationDialog'
import bottomInformation from '../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation' 
let that = this
export default {
    
    props: {
        drawer: {
            type: Boolean,
            default: false
        },
        remoteFunc: {
            type: Object,
            default: () => {
                return {
                    customerList: [],
                }
            }
        },
        addcustomer: String,
        customer: String,
        identification: String,
        state: {
            type: Boolean,
            default: false
        }
    },

    data () {
        return {
            direction: 'rtl',
            jsonData: {},
            remote: {},
            data: {},
            remindTypeList: [],
            relatedProjects: [],
            upLoadFileDefaultList: [],
            dialogVisible: false,
            isEdit: false,
            values: {
                remark: '',
                remind: '0',
                contactDate: '',
                projectId: '',
                customerId: '',
                advanceDay: '0',
                remindType: '',
                remindUserId: '',
                remindUserName: '',
                nextContactDate: '',
                customerId: this.addcustomer
            },
            transform: {
                isShowDetails: false
            },
            remoteOption: {
                relatedProjects: [],
                remindOption: [
                    {
                        id: '0',
                        name: '不提醒'
                    },
                    {
                        id: '1',
                        name: '提醒'
                    }
                ],
            },
            // 普通客户 code1; 联营客户 code0
            code1: BASICSCODE.CUSTOMER_RELATIONSHIPS,
            code0: BASICSCODE.CUSTOMER_RELATIONSHIP
        }
    },

    methods: {

        getFormByJson () {
            formGetJson ({'code': CUSTOMERAUTHORIZATIONFORM.RELATIONSHIPRECORD}).then(res => {
                if (res) {
                    let element = JSON.parse(res)
                    element.list.forEach (item => {
                        if (this.identification == '1' && item.model == 'customerId') item.name = '客户名称'
                    })
                    this.jsonData = element
                }
            })
        },

        addRelationshipRecord () {
            let bottomInformation = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData ().then(data => {
                if (!data || !bottomInformation) { return }
                let item = this.neateData (data)
                let url = ''
                switch (this.identification) {
                    case '0':
                        if (this.values.id == null) {
                            url = addRelationshipRecordData
                        } else {
                            item['id'] = this.values.id
                            url = editRelationshipRecordData
                        }
                        break
                    case '1':
                        if (this.values.id == null) {
                            url = addFirstPartyRelationshipRecordData
                        } else {
                            item['id'] = this.values.id
                            url = editFirstPartyRelationshipRecordData
                        }
                        break
                }
                Object.assign (this.values, item, bottomInformation)
                url (this.values).then(res => {
                    if (res.code === 200) {
                        this.$message.success ('保存成功')
                        this.$emit ('change')
                    }
                })
            })
        },

        printTemplate () {
            let id = this.identification == '1' ? this.code1 : this.code0  
            getPrintTemplateInfoByCodeAndBusiness ({'id': id, 'businessId': this.customer}).then(res => {
                this.$refs.printTemp.printTemplate (res)
            })
        },

        handleClose () {
            this.$emit ('change')
        },

        btnClick (val, field) {
            let item = {}
            item['id'] = val
            this.data = item
            this.dialogVisible = true
        },

        updataExpandInformation () {
            this.dialogVisible = false
            this.$store.dispatch ('d2admin/customer/remoteFuncsLoad')
        },

        selectGenerateChange (field, val, models) {
            let item = null
            if (val == null) { return }
            this.values[field] = val
            switch (field) {
                case 'contactDate':
                    if (this.values.nextContactDate !== '') {
                        let contactDate = new Date (val)
                        let nextContactDate = new Date (this.values.nextContactDate)
                        if (nextContactDate < contactDate) {
                            this.$message.warning ('下次联系时间必须大于联系时间')
                            this.values.contactDate = ''
                        }
                    }
                    break
                case 'nextContactDate':
                    if (this.values.contactDate !== '') {
                        let contactDate = new Date (this.values.contactDate)
                        let nextContactDate = new Date (val)
                        if (nextContactDate < contactDate) {
                            this.$message.warning ('下次联系时间必须大于联系时间')
                            this.values.nextContactDate = ''
                        }
                    }
                    break
                case 'customerId':
                    if (!this.isEdit) {
                        this.values.projectId = ''
                    } else {
                        this.isEdit = false
                    }
                    this.getCustomerRelatedProjects (val)
                    break
                case 'remind':
                    this.updataFormShowContent (val)
                    break
                case 'remindUserId':
                    item = this.remoteFuncs.businessLeaderOptions.find (r => r.id === val)
                    this.values.remindUserName = item ? item.name : ''
                    break
            }
        },

        getCustomerDataById (id) {
            let url = ''
            switch (this.identification) {
                case '0':
                    url = getRelationshipRecordData
                    break
                case '1':
                    url = getFirstPartyRelationshipRecordData
                    break
            }
            url ({'id': id}).then (res => {
                if (res) {
                    res.advanceDay = res.advanceDay ? res.advanceDay + '' : '0'
                    this.values = res
                    this.drawer = true
                    if (res.customerId) {
                        this.getCustomerRelatedProjects (res.customerId)
                    }
                    this.updataFileDefaultList (res)
                }
            })
        },

        getCustomerRelatedProjects (id) {
            associatedProjects (id).then (res => {
                if (res) this.remoteOption.relatedProjects = res
            })
        },

        updataFormShowContent (val) {
            this.jsonData.list.forEach (res => {
                switch (res.model) {
                    case 'advanceDay':
                    case 'remindUserId':
                    case 'remindType':
                        res.options.hidden = val == '1' ? false : true
                        break
                }
            })
        },

        selectDefaultData (data) {
            this.remote = {
                getCustomerList (resolve) {
                    resolve (that.remoteFunc.customerList)
                },

                getContactType (resolve) {
                    resolve (that.remoteFuncs.contactType)
                },

                getRemindUser (resolve) {
                    resolve (that.remoteFuncs.businessLeaderOptions)
                },

                getRemindType (resolve) {
                    resolve ([
                        {
                            id: '1',
                            name: '短信'
                        },
                        // {
                        //     id: '2',
                        //     name: '钉钉'
                        // },
                        // {
                        //     id: '4',
                        //     name: '微信'
                        // },
                        {
                            id: '3',
                            name: '系统消息'
                        },
                    ])
                }
            }
        },

        updataFileDefaultList (res) {
            if (res.fileList && res.fileList.length > 0) {
                res.fileList.forEach(item => {
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
        },

        neateData (data) {
            let element = this.remoteFunc.customerList.find (item => item.id === data.customerId)
            if (element) {
                data['customerName'] = element.cusName
            }
            let item = this.remoteOption.relatedProjects.find (r => r.id === data['projectId'])
            if (item) {
                data['relatedProjects'] = item['projectName']
            } else {
                    data['relatedProjects'] = ''
            }
            data['contactType'] = this.remoteFuncs.contactType.find (r => r.id === data['contactTypeId'])['proName']
            data['contactsId'] = util.cookies.get ('uuid')
            return data
        }
    },

    mounted () {
        that = this
    },

    computed: {
        ...mapState('d2admin/customer', [
            'remoteFuncs',
        ])
    },

    created () {
        this.state == true ? this.transform.isShowDetails = true : this.transform.isShowDetails = false
        this.$store.dispatch ('d2admin/customer/remoteFuncsLoad')
        this.getFormByJson ()
        if (this.customer) {
            this.isEdit = true
            this.getCustomerDataById (this.customer)
        }
        if (this.addcustomer) {
            this.getCustomerRelatedProjects (this.addcustomer)
        }
    },

    watch: {
        remoteFuncs () {
            this.selectDefaultData ([])
        }
    },

    components: {
        'add-expand-information-dialog': addExpandInformationDialog,
        'bottom-information': bottomInformation,
        'print-template-by-html': printTemplateByHtml
    }
}
</script>

<style lang='scss'>
    .add-relationship-record {
        .add-relationship-record__content {
            padding: 20px;
            max-height: 800px;
            overflow: auto;
            .add-relationship-record__button {
                text-align: center;
                margin-left: -20px;
                button {
                    height: 30px;
                    padding: 6px 10px;
                    .el-button--primary {
                        background-color: $color-button-dialog-affirm
                    }
                }
            }
        }
        
        .generate-element-item .select-prefix .el-button--medium {
            margin-top: 1px;
        }
    }
</style>
