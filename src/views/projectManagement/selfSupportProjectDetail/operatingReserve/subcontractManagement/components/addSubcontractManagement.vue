<template>
    <d2-container type="fulls" class="add-subcontract-management">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
            </div>
            <div class="qqt-container-full-center___top">
                <qqt-flow-tabs :procInstId="procInstId">
                    <template slot="content">
                        <project-information-basic :transform="transform" :values="values" @projectCode="getProjectCode" />
                        <fm-generate-form :data="jsonData" :remote="remote" :value="values" :transform="transform" ref="generateForm" @on-change="selectGenerateChange"/>
                        <qqt-relate-table :data="values.subcontractDetailsList" ref="subcontractDetails" :rowHeader="subcontractDetailsHeader" :isShowDetails="transform.isShowDetails" @blur="calculateSubcontractDetailsTotal" />
                        <div class="add-subcontract-management-operation">
                            <p>合计:</p>
                            <div class="add-subcontract-management-operation_state">
                                <qqt-input :value="total" :isShowElement="false"></qqt-input>
                            </div>
                        </div>
                        <bottom-information fieldTitle="经办" :values="values" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation" />
                    </template>
                </qqt-flow-tabs>
            </div>
            <div class="qqt-container-full-content___button">
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitSubcontractManagementData ()">重新提交</el-button>
                <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveSubcontractManagement">保存</el-button>
                <el-button type="primary" v-if="!transform.isShowDetails && procInstId === ''" @click="values['flag'] = '1', submitSubcontractManagementData ()">提交</el-button>
                <el-button type="info" size="mini" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                <el-button @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataSubcontractManagement"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentSubcontractManagement" />
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </d2-container>
</template>

<script>
    import { getSubcontractManagementById, editSubcontractManagement,
                addSubcontractManagement, submitSubcontractManagement, completeSubcontractManagement, resetSubmitSubcontractManagement, getLaborSubcontractor } from '@/api/selfProject/operatingReserve/subcontractManagement'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, qqtRelateTable, qqtInput } from '@/components/qqt-subassembly'
    import { getCustomerDictionaryQueryById } from '@/api/customerManagement/expandInformation'
    import { PROPRIETARYPROJECTDICTIONARY, CUSTOMERAUTHORIZATION } from '@/enum/DICTIONARY'
    import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
    import { formGetJson } from '@/api/system/fromManagement/index'
    import { PROPRIETARYPROJECT } from '@/enum/FORMCODE'
    import { queryDicByIds } from '@/api/system/dic/dic'
    import { getDetails } from '@/api/approval/common'
    import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
    import { mapActions } from 'vuex'

    import printTemplateByHtml from '../../../../../systemManagement/printTemplate/components/printTemplateByHtml'
    import bottomInformation from '../../../businessBidding/components/bottomInformation'
    import projectInformationBasic from '../../components/projectInformationBasic'
    import util from '@/libs/util.js'
    let than = this
    export default {

        data () {
            return {
                total: '',
                title: '',
                stutas: '',
                procInstId: '',
                remote: {},
                values: {
                    subcontractDetailsList: [],
                    subContractorName: '',
                    sourceId:''
                },
                jsonData: {},
                nodeData: {
                    operation: '',
                    msg: ''
                },
                transform: {
                    isShowDetails: false
                },
                prossValue: {
                    title: ''
                },
                visible: false,
                isReject: false,
                isSendBack: false,
                isTurnManage: false,
                dialogVisible: false,
                code: BASICSCODE.SELF_DIRECT_SUBPACKAGE,
                processModuleId: PROPRIETARYPROJECT.ADDSUBCONTRACTMANAGEMENT,
                subContractorNatureList: [],
                upLoadFileDefaultList: [],
                subContractorList: [],
                shapeDicList: [],
                sourceList: [],
                subcontractDetailsHeader: [
                    {
                        prop: 'content',
                        label: '具体分包内容',
                        isShow: true,
                        type: 'text',
                        required: true
                    },
                    {
                        prop: 'unit',
                        label: '单位',
                        isShow: true,
                        type: 'text',
                        required: true
                    },
                    {
                        prop: 'num',
                        label: '数量',
                        isShow: true,
                        type: 'money',
                        required: true
                    },
                    {
                        prop: 'price',
                        label: '单价(元)',
                        isShow: true,
                        type: 'money',
                        required: true
                    },
                    {
                        prop: 'combinePrice',
                        label: '合价(元)',
                        isShow: true,
                        type: 'total',
                        isMoneyType: true,
                        controlRow: 'num * price',
                        isShowDetails: true
                    },
                    {
                        prop: 'criterion',
                        label: '约定质量标准',
                        isShow: true,
                        type: 'text',
                        required: true
                    },
                    {
                        prop: 'time',
                        label: '约定完成时间',
                        isShow: true,
                        width: 210,
                        type: 'datetime',
                        required: true
                    },
                    {
                        prop: 'period',
                        label: '约定付款周期',
                        isShow: true,
                        type: 'text',
                        required: true
                    },
                    {
                        prop: 'conditions',
                        label: '约定付款条件',
                        isShow: true,
                        type: 'text',
                        required: true
                    },
                ]
            }
        },

        methods: {

            ...mapActions('d2admin/page', [
                'close',
            ]),

            getFormByJson () {
                formGetJson ({ 'code': this.processModuleId }).then(res => {
                    if (res) this.jsonData = JSON.parse(res)
                })
            },

            getSubcontractManagement (id) {
                getSubcontractManagementById ({'id': id}).then (res => {
                    if (res) {
                        let num = 0
                        if (this.$route.params && this.$route.params.relevancyId) {
                            let data = this.sourceList.find(list=> list.proName === res.source)
                            if (data) {
                               res['sourceId'] = data.id;
                            }
                        }
                        this.values = res
                        this.values.subcontractDetailsList.forEach (item => { num += Number (item.combinePrice) })
                        this.total = num.toFixed (2)
                        this.prossValue.title = `项目分包管理:【 ${this.values.subContractorName} 】`
                        this.fileDefaultNeaten (res)
                    }
                })
            },

            saveSubcontractManagement () {
                let url = '', element = {}, subcontractDetailsList = []
                element = this.$refs.bottomInformation.getData ()
                subcontractDetailsList = this.$refs.subcontractDetails.verify ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && subcontractDetailsList && element) {
                        Object.assign (this.values, data, element)
                        this.values.subcontractDetailsList = subcontractDetailsList
                        this.values.id == null ? url = addSubcontractManagement : url = editSubcontractManagement
                        url (this.values).then (res => {
                            if (res.code === 200) {
                                this.$message.success ('保存成功')
                                this.closePageTag ()
                            }
                        })
                    }
                })
            },

            submitSubcontractManagementData () {
                let subcontractDetailsList = [], element = {}
                element = this.$refs.bottomInformation.getData ()
                subcontractDetailsList = this.$refs.subcontractDetails.verify ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && element && subcontractDetailsList) {
                        Object.assign (this.values, data, element)
                        this.values.subcontractDetailsList = subcontractDetailsList
                        this.dialogVisible = true
                        this.prossValue = {
                            title: this.$route.params.title || `项目分包管理:【 ${data.subContractorName} 】`,
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.params.degree || '',
                            msg: '',
                        }
                    }
                })
            },

            updataSubcontractManagement (item, boolean) {
                let url = ''
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                boolean ? url = resetSubmitSubcontractManagement : url = submitSubcontractManagement
                url (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closePageTag ()
                    }
                })
            },

            consentSubcontractManagement (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closePageTag ()
                    return
                }
                if (item) {
                    this.values['completeTask'] = item
                    completeSubcontractManagement (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success (res.message)
                            this.closePageTag ()
                        }
                    })
                }
            },

            getQueryDicByIdList () {
                let list = []
                list = [ PROPRIETARYPROJECTDICTIONARY.SUBCONTRACTORNATUREDIC, PROPRIETARYPROJECTDICTIONARY.SHAPEDIC ]
                queryDicByIds (list).then (item => {
                    if (!item) return
                    this.subContractorNatureList = item[PROPRIETARYPROJECTDICTIONARY.SUBCONTRACTORNATUREDIC]
                    this.shapeDicList = item[PROPRIETARYPROJECTDICTIONARY.SHAPEDIC]
                    this.neatenRemote ()
                })
            },

            getExpandInformationData () {
                getCustomerDictionaryQueryById ({ 'id': CUSTOMERAUTHORIZATION.CUSTOMERSOURCE }).then(list => {
                    if (list.records && list.records.length > 0) {
                        this.sourceList = list.records
                    }
                    this.getQueryDicByIdList ()
                }).finally(()=>{
                    this.updataRouter ()
                })
            },

            getDetailsList (taskId) {
                getDetails (taskId).then (res => { if (res) this.nodeData = res })
            },

            getLaborSubcontractor () {
                getLaborSubcontractor ().then (res => { if (res) this.subContractorList = res, this.neatenRemote () })
            },

            selectGenerateChange (field, val, models) {
                let item = ''
                switch (field) {
                    case 'subContractorNatureDicId':
                        item = this.subContractorNatureList.find (f => f.id === val)
                        if (item) this.values['subContractorNatureDic'] = item.name
                        break
                    case 'shapeDicId':
                        item = this.shapeDicList.find (f => f.id === val)
                        if (item) this.values['shapeDic'] = item.name
                        break
                    case 'subContractorName':
                        this.values.subContractorId = val
                        item = this.subContractorList.find (f => f.id == val)
                        if (item) this.values.subContractorName = item.cusName
                        break
                    case 'sourceId':
                        this.values.sourceId = val
                        item = this.sourceList.find (f => f.id == val)
                        if (item) this.values.source = item.proName
                        break
                }
                this.values[field] = val
            },

            calculateSubcontractDetailsTotal (data, prop, value) {
                if (prop == 'num' || prop == 'price') {
                    let num = 0, list = []
                    list = this.$refs.subcontractDetails.getNotVerify ()
                    list.forEach (res => {
                        num += Number (res.combinePrice) || 0
                    })
                    this.total = num.toFixed (2) || '0.00'
                }
            },

            closePageTag () {
                let tagName = this.$route.path
                let path = ``
                this.stutas ? path = `/approval/${this.stutas}` : path = `/projectManagement/selfSupportProjectDetail/operatingReserve/subcontractManagement`
                this.close ({ tagName, path })
            },

            getProjectCode (projectCode) {
                this.values['projectCode'] = projectCode
            },

            fileDefaultNeaten (res) {
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

            neatenRemote () {
                this.remote = {
                    
                    getSubContractorName (resolve) {
                        resolve (than.subContractorList)
                    },
                    
                    getSubContractorNatureDic (resolve) {
                        resolve (than.subContractorNatureList)
                    },
                    
                    getShapeDic (resolve) {
                        resolve (than.shapeDicList)
                    },

                    getSourceList (resolve) {
                        resolve (than.sourceList)
                    }
                }
            },

            printTemplate () {
                getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.$route.params.relevancyId}).then(res => {
                    if (res) this.$refs.printTemp.printTemplate (res)
                })
            },

            updataRouter () {
                if (this.$route.params) {
                    this.transform = this.$route.params.transform || {}
                    this.stutas = this.$route.params.pathName || ''
                    this.procInstId = this.$route.params.procInstId || ''
                }
                if (this.$route.params && this.$route.params.taskId) {
                    this.getDetailsList (this.$route.params.taskId)
                }
                if (this.$route.params && this.$route.params.relevancyId) {
                    this.getSubcontractManagement (this.$route.params.relevancyId)
                }
            }
        },

        created () {
            this.getFormByJson ()
            this.getLaborSubcontractor ()
            
            this.getExpandInformationData()
        },

        mounted () {
            than = this
        },

        components: {
            'project-information-basic': projectInformationBasic,
            'print-template-by-html': printTemplateByHtml,
            'bottomInformation': bottomInformation,
            'qqt-relate-table': qqtRelateTable,
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent,
            'qqt-input': qqtInput
        }
    }
</script>

<style lang='scss'>
    .add-subcontract-management {
        .add-subcontract-management-operation {
            padding: 10px 0px 5px 23px;
            p {
                display: inline-block;
                font-size: 14px;
                color: $color-text-normal;
            }
            .add-subcontract-management-operation_state {
                padding-left: 10px;
                width: 35%;
                display:inline-block;
            }
        }
    }
</style>
