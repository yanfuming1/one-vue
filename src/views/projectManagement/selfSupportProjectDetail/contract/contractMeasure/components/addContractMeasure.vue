<template>
    <d2-container type="fulls" class="contract-measure">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
            </div>
            <div class="qqt-container-full-center___top">
                <qqt-flow-tabs :procInstId="procInstId">
                    <template slot="content">
                        <project-information-basic v-if="identification == '1'" :transform="transform" :values="values" @projectCode="getProjectCode" />
                        <joint-project-information-basic v-if="identification == '2'" :values="values" @projectCode="getProjectCode" />
                        <basics-contract ref="basicsContract" :projectCode="values.projectCode" :identification="identification" :contract="values" :transform="transform" @contractInformation="getContractInformation" />
                        <associated-documents left="10px" ref="relevance" :transform="relevanceTransform" :type="identification == '' ? '1' : identification" :isInitLoad="identification == '' ? false : true" :relevance="relevance" />
                        <fm-generate-form :data="jsonData" :remote="remote" :value="values" :transform="transform" ref="generateForm" >
                            <template slot="inventory">
                                <div class="contract-measure_inventory_button">
                                    <div class="inventory_category" v-for="item of inventoryList" :key="item.id" v-if="item.isShow" :class="{'inventory_category_active': inventory == item.id}" @click="updataContractList (item.id)">{{ item.name }}</div>
                                </div>
                            </template>
                            <template slot="relateTable">
                                <div class="contract-measure_inventory_relate_table">
                                    <qqt-relate-table :data="values.contractList" ref="contractList" :isShowAdd="false" :rowHeader="contractListHeader" :isShowDetails="transform.isShowDetails" @blur="blurRelateRable"></qqt-relate-table>
                                </div>
                            </template>
                        </fm-generate-form>
                        <bottom-information :values="values" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation" />
                    </template>
                </qqt-flow-tabs>
            </div>
            <div class="qqt-container-full-content___button">
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitContractMeasureData ()">重新提交</el-button>
                <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveContractMeasure">保存</el-button>
                <el-button type="primary" v-if="!transform.isShowDetails && procInstId === ''" @click="values['flag'] = '1', submitContractMeasureData ()">提交</el-button>
                <el-button type="info" size="mini" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                <el-button @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataContractMeasure"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentContractMeasure" />
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </d2-container>
</template>

<script>
    import { getSelfContractMeasureById, getContractMeasureById, getJointContractMeasureById,
             editSelfContractMeasure, editContractMeasure, editJointContractMeasure,
             addSelfContractMeasure, addContractMeasure, addJointContractMeasure,
             submitSelfContractMeasure, submitContractMeasure, submitJointContractMeasure,
             completeSelfContractMeasure, completeContractMeasure, completeJointContractMeasure,
             resetSubmitSelfContractMeasure, resetSubmitContractMeasure, resetSubmitJointContractMeasure } from '@/api/selfProject/contract/contractMeasure'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, upload, qqtRelateTable, associatedDocuments } from '@/components/qqt-subassembly'
    import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
    import { formGetJson } from '@/api/system/fromManagement/index'
    import { getUserDepartById } from '@/api/system/depart/depart'
    import { PROPRIETARYPROJECT, CONTRACT } from '@/enum/FORMCODE'
    import { getDetails } from '@/api/approval/common'
    import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
    import { PORJECT_INFO } from '@/enum/PROJECT'
    import { mapActions } from 'vuex'

    import basicsContract from '../../components/basicsContract'
    import bottomInformation from '../../../businessBidding/components/bottomInformation'
    import projectInformationBasic from '../../../operatingReserve/components/projectInformationBasic'
    import printTemplateByHtml from '../../../../../systemManagement/printTemplate/components/printTemplateByHtml'
    import jointProjectInformationBasic from '../../../../jontProjectDetail/components/jointProjectInformationBasic'
    import util from '@/libs/util.js'
    let than = this
    export default {

        data () {
            return {
                title: '',
                stutas: '',
                inventory: 'goods',
                procInstId: '',
                identification: '',
                remote: {},
                values: {
                    contractList: [],
                    projectCode: ''
                },
                relevance: {},
                jsonData: {},
                nodeData: {
                    operation: '',
                    msg: ''
                },
                transform: {
                    isShowDetails: false
                },
                relevanceTransform: {
                    isShowDetails: true
                },
                prossValue: {
                    title: ''
                },
                visible: false,
                isReject: false,
                isSendBack: false,
                isTurnManage: false,
                dialogVisible: false,
                code: BASICSCODE.SELF_CONTRACT_METERING,
                processModuleId: '',
                upLoadFileDefaultList: [],
                contractListHeader: [
                    {
                        prop: 'line1',
                        label: '编码',
                        isShow: true,
                        type: 'text',
                        isShowDetails: true
                    },
                    {
                        prop: 'line2',
                        label: '名称',
                        isShow: true,
                        type: 'text',
                        isShowDetails: true
                    },
                    {
                        prop: 'line3',
                        label: '品牌',
                        isShow: true,
                        type: 'text',
                        isShowDetails: true
                    },
                    {
                        prop: 'line4',
                        label: '规格型号',
                        isShow: true,
                        type: 'text',
                        isShowDetails: true
                    },
                    {
                        prop: 'line5',
                        label: '技术参数',
                        isShow: true,
                        type: 'text',
                        isShowDetails: true
                    },
                    {
                        prop: 'line6',
                        label: '计量单位',
                        isShow: true,
                        type: 'text',
                        isShowDetails: true
                    },
                    {
                        prop: 'line7',
                        label: '合同数量',
                        isShow: true,
                        type: 'text',
                        isShowDetails: true
                    },
                    {
                        prop: 'line8',
                        label: '合同单价(元)',
                        isShow: true,
                        type: 'money',
                        isShowDetails: true
                    },
                    {
                        prop: 'line9',
                        label: '合同金额(元)',
                        isShow: true,
                        type: 'total',
                        isMoneyType: true,
                        controlRow: 'line7 * line8',
                        isShowDetails: true
                    },
                    {
                        prop: 'line11',
                        label: '本次计量',
                        isShow: true,
                        type: 'text',
                        required: true,
                        rule: [
                            { required: true, message: `本次计量不能为空`, trigger: 'change' },
                            { pattern: /^[0-9]*[0-9][0-9]*$/, message: `输入非负整数`, trigger: 'change' }
                        ],
                        fixed: 0
                    },
                    {
                        prop: 'line12',
                        label: '剩余数量',
                        isShow: true,
                        type: 'text',
                        required: true,
                        isShowDetails: true,
                        fixed: 0
                    },
                    {
                        prop: 'line10',
                        label: '备注',
                        isShow: true,
                        type: 'text'
                    },
                ],
                inventoryList: [
                    {
                        id: 'goods',
                        name: '货物类',
                        isShow: false
                    },
                    {
                        id: 'ser',
                        name: '服务类',
                        isShow: false
                    },
                    {
                        id: 'labour',
                        name: '劳务类',
                        isShow: false
                    }
                ],
                serviceType: [],
                goodsType: [],
                laborType: []
            }
        },

        methods: {

            ...mapActions('d2admin/page', [
                'close',
            ]),
            // 根绝表单id获取表单数据
            getFormByJson () {
                formGetJson ({ 'code': this.processModuleId }).then(res => {
                    if (res) this.jsonData = JSON.parse(res)
                })
            },
            // 获取合同计量
            getContractMeasure (id) {
                let url = ''
                switch (this.identification) {
                    case '1':
                        url = getSelfContractMeasureById
                        break
                    case '2':
                        url = getJointContractMeasureById
                        break
                    default:
                        url = getContractMeasureById
                        break
                }
                url ({'id': id}).then (res => {
                    console.log(res);
                    if (res) {
                        this.values = res
                        this.relevance = { ...res }
                        console.log(this.relevance);
                        this.values['contractList'] = []
                        this.prossValue.title = `合同计量:【 ${this.values.contractname} 】`
                        if (this.$route.params.isDuplicate) this.values.id = this.values.procInstId = this.values.procState = null
                        this.getContractInformation (res.meters,res)
                        this.fileDefaultNeaten (res)
                    }
                })
            },

            saveContractMeasure () {
                let url = '', list = [], item = {}, bottomInformation = {}, relevance = {}
                list = this.$refs.contractList.verify ()
                relevance = this.$refs.relevance.getData ()
                item = this.$refs.basicsContract.getData ()
                bottomInformation = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && list && item && bottomInformation && relevance) {
                        this.values.contractList = list
                        this.contractListSonType (list[0].identity, true)
                        Object.assign (this.values, item, bottomInformation, relevance)
                        this.values['meters'] = [ ...this.goodsType, ...this.serviceType, ...this.laborType ]
                        switch (this.identification) {
                            case '1':
                                url = this.values.id == null ? addSelfContractMeasure : editSelfContractMeasure
                                break
                            case '2':
                                url = this.values.id == null ? addJointContractMeasure : editJointContractMeasure
                                break
                            default:
                                url = this.values.id == null ? addContractMeasure : editContractMeasure
                                break
                        }
                        url (this.values).then (res => {
                            if (res.code === 200) {
                                this.$message.success ('保存成功')
                                this.closePageTag ()
                            }
                        })
                    }
                })
            },

            submitContractMeasureData () {
                let list = [], item = {}, bottomInformation = {}, relevance = {}
                list = this.$refs.contractList.verify ()
                relevance = this.$refs.relevance.getData ()
                item = this.$refs.basicsContract.getData ()
                bottomInformation = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && list && item && bottomInformation && relevance) {
                        this.values.contractList = list
                        this.contractListSonType (list[0].identity, true)
                        Object.assign (this.values, item, bottomInformation, relevance)
                        this.values['meters'] = [ ...this.goodsType, ...this.serviceType, ...this.laborType ]
                        this.dialogVisible = true
                        this.prossValue = {
                            title: this.$route.params.title || `合同计量:【 ${this.values.contractname} 】`,
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.params.degree || '',
                            msg: '',
                        }
                    }
                })
            },

            updataContractMeasure (item, boolean) {
                let url = ''
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                url = this.identification == '1'
                    ? boolean ? resetSubmitSelfContractMeasure : submitSelfContractMeasure
                    : boolean ? resetSubmitContractMeasure : submitContractMeasure
                switch (this.identification) {
                    case '1':
                        url = boolean ? resetSubmitSelfContractMeasure : submitSelfContractMeasure
                        break
                    case '2':
                        url = boolean ? resetSubmitJointContractMeasure : submitJointContractMeasure
                        break
                    default:
                        url = boolean ? resetSubmitContractMeasure : submitContractMeasure
                        break
                }
                url (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closePageTag ()
                    }
                })
            },

            consentContractMeasure (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closePageTag ()
                    return
                }
                if (item) {
                    this.values['completeTask'] = item
                    let url = ''
                    switch (this.identification) {
                        case '1':
                            url = completeSelfContractMeasure
                            break
                        case '2':
                            url = completeJointContractMeasure
                            break
                        default:
                            url = completeContractMeasure
                            break
                    }
                    url (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success (res.message)
                            this.closePageTag ()
                        }
                    })
                }
            },

            getDetailsList (taskId) {
                getDetails (taskId).then (res => { if (res) this.nodeData = res })
            },

            updataContractList (type) {
                this.values.contractList = this.$refs.contractList.getNotVerify ()
                this.values.contractList.forEach (res => { res['identity'] = this.inventory })
                this.contractListSonType (this.inventory, true)
                this.contractListSonType (type)
                this.inventory = type
            },

            getContractInformation (createOthers, managerCreate) {
                console.log(createOthers);
                this.neatenCreateOthersData (createOthers)
                if (createOthers && createOthers.length > 0) this.updataCreateOthers (createOthers)
                console.log(managerCreate,managerCreate.projectType);
                if (managerCreate && managerCreate.projectType) {
                    const { projectCode, projectId, projectType, projectName } = managerCreate
                    this.relevance = { projectCode, projectId, projectType, projectName }
                } else {
                    this.relevance = {}
                    this.$refs.relevance.resetForm ()
                }
            },
            // 合同计量计算
            neatenCreateOthersData (createOthers) {
                createOthers.forEach (res => {
                    res.line11 = res.line11 ? res.line11 + '' : '0'
                    res.line12 = res.line12 ? res.line12 + '' : res.meterNum ? (Number.parseFloat (res.line7) - Number.parseFloat (res.meterNum)) + '' : res.line7
                })
            },

            contractListSonType (data, boolean = false) {
                switch (data) {
                    case 'goods':
                        boolean ? this.goodsType = this.values.contractList : this.values.contractList = this.goodsType
                        break
                    case 'ser':
                        boolean ? this.serviceType = this.values.contractList : this.values.contractList = this.serviceType
                        break
                    case 'labour':
                        boolean ? this.laborType = this.values.contractList : this.values.contractList = this.laborType
                        break
                }
            },

            updataCreateOthers (list) {
                let str = '', set = []
                this.resetData ()
                list.forEach (res => {
                    switch (res.identity) {
                        case 'goods':
                            this.goodsType.push (res)
                            this.inventoryList[0].isShow = true
                            str = 'goods', set = this.goodsType
                            break
                        case 'ser':
                            this.serviceType.push (res)
                            this.inventoryList[1].isShow = true
                            if (str == '' || str == 'labour') str = 'ser', set = this.serviceType
                            break
                        case 'labour':
                            this.laborType.push (res)
                            this.inventoryList[2].isShow = true
                            if (str == '') str = 'labour', set = this.laborType
                            break
                    }
                })
                this.inventory = str
                this.values.contractList = set
                this.getFormByJson ()
            },

            blurRelateRable (data, prop, value) {
                switch (prop) {
                    case 'line11':
                        if (Number.parseFloat (data[prop]) > Number.parseFloat (data.line12)) {
                            this.$message.warning ("本次计量不能大于剩余数量")
                            data[prop] = '0'
                        }
                        break
                }
            },

            resetData () {
                this.goodsType = [], this.serviceType = [], this.laborType = []
                this.inventoryList.forEach (res => { res.isShow = false })
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

            closePageTag () {
                let tagName = this.$route.path
                let path = ``
                this.stutas ? path = `/approval/${this.stutas}` : path = `/projectManagement/selfSupportProjectDetail/contract/${this.$route.params.path}`
                this.close ({ tagName, path })
            },

            printTemplate () {
                getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.$route.params.relevancyId}).then(res => {
                    if (res) {
                        this.getContractInformation (res.meters, res)
                        res['goodsType'] = this.goodsType, res['serviceType'] = this.serviceType, res['laborType'] = this.laborType
                        this.$refs.printTemp.printTemplate (res)
                    }
                })
            },

            updataRouter () {
                if (this.$route.params) {
                    this.transform = this.$route.params.transform || {}
                    this.stutas = this.$route.params.pathName || ''
                    this.procInstId = this.$route.params.procInstId || ''
                    this.identification = this.$route.params.identification || ''
                }
                if (this.$route.params && this.$route.params.taskId) {
                    this.getDetailsList (this.$route.params.taskId)
                }
                if (this.$route.params && this.$route.params.relevancyId) {
                    this.getContractMeasure (this.$route.params.relevancyId)
                }
                switch (this.identification) {
                    case '1':
                        this.processModuleId = PROPRIETARYPROJECT.ADDSELFPROJECTCONTRACTMEASURE
                        break
                    case '2':
                        this.processModuleId = PORJECT_INFO.ADDJOINTPROJECTCONTRACTMEASURE
                        break
                    default:
                        this.processModuleId = CONTRACT.ADDCONTRACTMEASURE
                        break
                }
            }
        },

        created () {
            this.updataRouter ()
        },

        mounted () {
            than = this
        },

        components: {
            'joint-project-information-basic': jointProjectInformationBasic,
            'project-information-basic': projectInformationBasic,
            'print-template-by-html': printTemplateByHtml,
            'associated-documents': associatedDocuments,
            'bottom-information': bottomInformation,
            'qqt-send-process': qqtSendProcess,
            'qqt-relate-table': qqtRelateTable,
            'basics-contract': basicsContract,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent
        }
    }
</script>

<style lang='scss'>
    .contract-measure {
        .contract-measure_inventory_button {
            div {
                display: inline-block;
                border: 2px solid;
                padding: 0px 25px;
                cursor: pointer;
                line-height: 24px;
                margin-right: 30px;
                border-radius: 20px;
                font-weight: 900;
                font-size: 14px;
                -webkit-user-select: none;
            }
            .inventory_category {
                border-color: transparent;
                color: $color-primary;
            }
            .inventory_category_active {
                border-color: $color-primary;
                color: $color-primary;
            }
        }
        .contract-measure_inventory_relate_table {
            background: $color-head-bg;
            margin-left: 15px;
            padding: 10px;
            .qqt-Relate-table {
                padding-top: 0px !important;
            }
        }
    }
</style>
