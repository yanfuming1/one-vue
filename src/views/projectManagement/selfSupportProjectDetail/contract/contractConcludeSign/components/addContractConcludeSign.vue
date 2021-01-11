<template>
    <d2-container type="fulls" class="contract_conclude_sign">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
            </div>
            <div class="qqt-container-full-center___top">
                <qqt-flow-tabs :procInstId="procInstId">
                    <template slot="content">
                        <project-information-basic v-if="identification == '1'" :transform="transform" :values="information" @projectCode="getProjectCode" />
                        <joint-project-information-basic v-if="identification == '2'" :values="values" @projectCode="getProjectCode" />
                        <fm-generate-form
                            :class="{'contract_conclude_alteration_background': isAlteration}"
                            :data="jsonData" :remote="remote" :value="values" :transform="transform"
                            ref="generateForm" @on-change="selectGenerateChange" @btn-click="btnClick" @btnTableClick="btnTableClick" @input-table-change="inputTableChange">
                            <template slot="relevance">
                                <associated-documents ref="relevance" :isTypeRequired="identification == '1' ? false : true" :type="identification == '' ? '1' : identification" :transform="relevanceTransform" :relevance="relevance" />
                            </template>
                            <template slot="clause">
                                <div class="contract_conclude_sign_clause_button">
                                    <div :class="{'commerce_clause': true, 'commerce_clause_active': clause == 'busi'}" @click="updataContractTerms ('busi')">商务条款</div>
                                    <div :class="{'breach_clause': true, 'breach_clause_active': clause == 'break'}" @click="updataContractTerms ('break')">违约条款</div>
                                    <div :class="{'exoneration_clause': true, 'exoneration_clause_active': clause == 'disclaimer'}" @click="updataContractTerms ('disclaimer')">免责条款</div>
                                    <div :class="{'settlement_clause': true, 'settlement_clause_active': clause == 'settlement'}" @click="updataContractTerms ('settlement')">结算条款</div>
                                    <div :class="{'payment_clause': true, 'payment_clause_active': clause == 'pay'}" @click="updataContractTerms ('pay')">支付条款</div>
                                    <div :class="{'other_clause': true, 'other_clause_active': clause == 'other'}" @click="updataContractTerms ('other')">其它条款</div>
                                </div>
                            </template>
                            <template slot="inventory">
                                <div class="contract_conclude_sign_inventory_button">
                                    <div :class="{'inventory_category': true, 'inventory_category_active': inventory == 'goods'}" @click="updataContractList ('goods')">货物类</div>
                                    <div :class="{'inventory_category': true, 'inventory_category_active': inventory == 'ser'}" @click="updataContractList ('ser')">服务类</div>
                                    <div :class="{'inventory_category': true, 'inventory_category_active': inventory == 'labour'}" @click="updataContractList ('labour')">劳务类</div>
                                </div>
                            </template>
                        </fm-generate-form>
                        <div class="contract_conclude_sign_inventory_relate_table" :class="{'contract_conclude_alteration_inventory_relate_table': isAlteration}">
                            <qqt-relate-table :data="values.contractList" ref="contractList"
                                :rowHeader="contractListHeader" :transform="transform" :isShowDetails="transform.isShowDetails" @change="updataCurrentAmount" @btnClick="relateTableBtnClick" @delete="updataCurrentAmount">
                                <template slot="content">
                                    <div class="contract_conclude_sign_inventory_total">
                                        <div class="left">合同总金额(元)</div>
                                        <div class="right">{{ amount }}</div>
                                    </div>
                                </template>
                            </qqt-relate-table>
                        </div>
                        <bottom-information :values="bottomInformation" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation" />
                    </template>
                </qqt-flow-tabs>
            </div>
            <div class="qqt-container-full-content___button">
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitContractConcludeSignData ()">重新提交</el-button>
                <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId === '' && !isAlteration" @click="saveContractConcludeSign">保存</el-button>
                <el-button type="primary" v-if="!transform.isShowDetails && procInstId === ''" @click="values['flag'] = '1', submitContractConcludeSignData ()">提交</el-button>
                <el-button type="info" size="mini" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                <el-button @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataContractConcludeSign"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentContractConcludeSign" />
        <contract-alteration-dialog :dialogVisible="alterationVisible" :identification="identification" :contractAlteration="contractAlteration" @close="alterationVisible = false"/>
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </d2-container>
</template>

<script>
    import { getSelfContractConcludeSignById, getContractConcludeSignById, getJointContractConcludeSignById,
             editSelfContractConcludeSign, editContractConcludeSign, editJointContractConcludeSign,
             addSelfContractConcludeSign, addContractConcludeSign, addJointContractConcludeSign,
             submitSelfContractConcludeSign, submitContractConcludeSign, submitJointContractConcludeSign,
             completeSelfContractConcludeSign, completeContractConcludeSign, completeJointContractConcludeSign,
             resetSubmitSelfContractConcludeSign, resetSubmitContractConcludeSign, resetSubmitJointContractConcludeSign
            } from '@/api/selfProject/contract/contractConcludeSign'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, qqtRelateTable, associatedDocuments } from '@/components/qqt-subassembly'
    import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
    import { PURCHASEREQUEST, PROPRIETARYPROJECTDICTIONARY } from '@/enum/DICTIONARY'
    import { formGetJson } from '@/api/system/fromManagement/index'
    import { getUserDepartById } from '@/api/system/depart/depart'
    import { PROPRIETARYPROJECT, CONTRACT } from '@/enum/FORMCODE'
    import { queryDicByIds } from '@/api/system/dic/dic'
    import { getDetails } from '@/api/approval/common'
    import { PORJECT_INFO } from '@/enum/PROJECT'
    import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
    import { mapActions } from 'vuex'

    import bottomInformation from '../../../businessBidding/components/bottomInformation'
    import projectInformationBasic from '../../../operatingReserve/components/projectInformationBasic'
    import contractAlterationDialog from '../../contractAlteration/components/contractAlterationDialog'
    import printTemplateByHtml from '../../../../../systemManagement/printTemplate/components/printTemplateByHtml'
    import jointProjectInformationBasic from '../../../../jontProjectDetail/components/jointProjectInformationBasic'
    import util from '@/libs/util.js'
// import { delete } from 'vue/types/umd'
    let than = this
    export default {

        data () {
            return {
                title: '',
                stutas: '',
                amount: '0',
                clause: 'busi',
                inventory: 'goods',
                procInstId: '',
                identification: '',
                remote: {},
                values: {
                    updataField: {},
                    signingContract: [],
                    contractTerms: [],
                    contractList: [],
                    createOthers: [],
                    iswarranty: '1',
                    isguarante: '1',
                    isinvoice: '1',
                    iskkwh: '1',  
                    ispay: '1'
                },
                jsonData: {},
                relevance: {},
                information: {},
                bottomInformation: {},
                nodeData: {
                    operation: '',
                    msg: ''
                },
                transform: {
                    isShowDetails: false,
                    isShowElementIcon: false,
                    prop: {}
                },
                relevanceTransform: {
                    isShowDetails: true
                },
                prossValue: {
                    title: ''
                },
                remoteOption: {
                    // 业务分类
                    differservOption: [],
                    // 合同类型
                    contractTypeOption: [
                        {
                            id: '0',
                            name: '收入合同'
                        },
                        {
                            id: '1',
                            name: '支出合同'
                        }
                    ],
                    // 合同介质
                    contractmediumOption: [],
                    // 计价方式
                    pricetypeOption: [],
                    // 结算方式
                    sfdsOption: [],
                    // 结算币种
                    xfoOption: [],
                    // 支付方式
                    paywayOption: [],
                    // 付款周期
                    paycycleOption: [],
                    // 发票类型
                    invoicetypeOption: [],
                    // 涉及税种及税率
                    taxetwosOption: [],
                },
                visible: false,
                isReject: false,
                isSendBack: false,
                isAlteration: false,
                isTurnManage: false,
                dialogVisible: false,
                alterationVisible: false,
                code: BASICSCODE.BARGAIN_MANAGER_CREATE,
                processModuleId: '',
                guaranteList: ['guaranteratio', 'price', 'paycondition', 'paytime'],
                warrantyList: ['warrantytime', 'timecondi', 'starttime'],
                paymentList: ['prepayratio', 'payprice', 'rectime'],
                invoiceList: ['invoicetype', 'taxes'],
                kkwhList: ['tax'],
                departmentList: [],
                contractAlteration: {},
                upLoadFileDefaultList: [],
                // 免费条款
                exonerationClause: [],
                // 结算条款
                settlementClause: [],
                // 商务条款
                commerceClause: [],
                // 支付条款
                paymentClause: [],
                // 违约条款
                breachClause: [],
                // 其他条款
                otherClause: [],
                // 服务类
                serviceType: [],
                // 货物类
                goodsType: [],
                // 劳务类
                laborType: [],
                contractListHeader: [
                    {
                        prop: 'line1',
                        label: '编码',
                        isShow: true,
                        type: 'text',
                    },
                    {
                        prop: 'line2',
                        label: '名称',
                        isShow: true,
                        type: 'text',
                        required: true
                    },
                    {
                        prop: 'line3',
                        label: '品牌',
                        isShow: true,
                        type: 'text'
                    },
                    {
                        prop: 'line4',
                        label: '规格型号',
                        isShow: true,
                        type: 'text'
                    },
                    {
                        prop: 'line5',
                        label: '技术参数',
                        isShow: true,
                        type: 'text'
                    },
                    {
                        prop: 'line6',
                        label: '计量单位',
                        isShow: true,
                        type: 'text',
                        required: true
                    },
                    {
                        prop: 'line7',
                        label: '合同数量',
                        isShow: true,
                        type: 'text',
                        required: true,
                        rule: [
                            { required: true, message: `合同数量不能为空`, trigger: 'change' },
                            { pattern: /^[0-9]*[0-9][0-9]*$/, message: `输入非负整数`, trigger: 'change' }
                        ]
                    },
                    {
                        prop: 'line8',
                        label: '合同单价(元)',
                        isShow: true,
                        type: 'money',
                        required:true
                    },
                    {
                        prop: 'line9',
                        label: '合同金额(元)',
                        isShow: true,
                        type: 'total',
                        isMoneyType: true,
                        controlRow: 'line7 * line8',
                        required: true
                    },
                    {
                        prop: 'line10',
                        label: '备注',
                        isShow: true,
                        type: 'text'
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
                    if (res) this.jsonData = JSON.parse (res)
                })
            },

            getContractConcludeSign (id) {
                let url = ''
                switch (this.identification) {
                    case '1':
                        url = getSelfContractConcludeSignById
                        break
                    case '2':
                        url = getJointContractConcludeSignById
                        break
                    default:
                        url = getContractConcludeSignById
                        break
                }
                url ({'id': id}).then (res => {
                    console.log(res);
                    if (this.$route.params.isDuplicate) {
                        res.managerCreate.cumulsettle = 0
                        res.managerCreate.cumulrec = 0
                        res.managerCreate.cumulpay = 0
                        res.createOthers.map(item => {
                            item.meterNum = 0 // 清空累计计量数量
                            item.remainnum = 0 // 清空剩余结算数量
                            item.cumulnum = 0 // 清空累计结算数量
                        })
                    }
                    
                    // 删除复制合同的计量
                    // delete res.changeOthers
                    // 删除复制合同的计量
                    // delete res.contractList

                    // console.log(res);
                    if (this.isAlteration && res.bargainChanges.length > 0) {
                        this.updataTransformProp (res.bargainChanges, 'bargainid')
                    }
                    if (this.isAlteration && res.changeOthers.length > 0) {
                        this.updataTransformProp (res.changeOthers, 'conid')
                    }
                    if (res.managerCreate) {
                        res.managerCreate.price = res.managerCreate.price + ''
                        res.managerCreate.payratio = res.managerCreate.payratio + ''
                        res.managerCreate.payprice = res.managerCreate.payprice + ''
                        res.managerCreate.signedcopies = res.managerCreate.signedcopies + ''
                        res.managerCreate.guaranteratio ? res.managerCreate.guaranteratio = res.managerCreate.guaranteratio + '' : ''
                        res.managerCreate.prepayratio ? res.managerCreate.prepayratio = res.managerCreate.prepayratio + '' : ''
                        this.procInstId && this.$route.params.relevancyId && res.managerCreate.changestate == '0' ? res.managerCreate.changestate = '1' : ''
                        res.managerCreate['updataField'] = {},  this.values.signingContract = [], this.information = res.managerCreate
                        Object.assign (this.values, res.managerCreate), this.bottomInformation = { ...res.managerCreate }, this.relevance = { ...res.managerCreate }
                        if (this.values.contractprice) this.amount = util.moneyTransform (this.values.contractprice)
                        if (this.$route.params.isDuplicate) this.values.id = this.values.procInstId = this.values.procState = null
                        this.prossValue.title = `合同签订:【 ${this.values.contractname} 】`
                        this.dynamicCheckField (this.jsonData, this.paymentList, this.values.ispay == '0' ? false : true)
                        this.dynamicCheckField (this.jsonData, this.warrantyList, this.values.iswarranty == '0' ? false : true)
                        this.dynamicCheckField (this.jsonData, this.guaranteList, this.values.isguarante == '0' ? false : true)
                        this.dynamicCheckField (this.jsonData, this.invoiceList, this.values.isinvoice == '0' ? false : true)
                        this.dynamicCheckField (this.jsonData, this.kkwhList, this.values.iskkwh == '0' ? false : true)
                        this.updataCreateOthers (res.createOthers)
                        this.fileDefaultNeaten (res)
                    }
                })
            },

            saveContractConcludeSign () {
                let url = '', element = {}, contractList = {}, relevance = {}
                this.values.createOthers = []
                this.updataContractTerms (this.clause), this.updataContractList (this.inventory)
                relevance = this.$refs.relevance.getData ()
                element = this.$refs.bottomInformation.getData ()
                contractList = this.$refs.contractList.verify ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && element && contractList && relevance) {
                        Object.assign (this.values, element, relevance)
                        this.values.contractprice = util.moneyFormat (this.amount)
                        this.values.signingContract.forEach (res => res['identity'] = 'signatory')
                        this.values.createOthers.push (...this.exonerationClause, ...this.settlementClause, ...this.commerceClause,
                            ...this.paymentClause, ...this.breachClause, ...this.otherClause, ...this.serviceType, ...this.goodsType,
                            ...this.laborType, ...this.values.signingContract)
                        switch (this.identification) {
                            case '1':
                                url = this.values.id == null ? addSelfContractConcludeSign : editSelfContractConcludeSign
                                break
                            case '2':
                                url = this.values.id == null ? addJointContractConcludeSign : editJointContractConcludeSign
                                break
                            default:
                                url = this.values.id == null ? addContractConcludeSign : editContractConcludeSign
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

            submitContractConcludeSignData () {
                let element = {}, contractList = {}, relevance = {}
                this.values.createOthers = []
                this.updataContractTerms (this.clause), this.updataContractList (this.inventory)
                relevance = this.$refs.relevance.getData ()
                element = this.$refs.bottomInformation.getData ()
                contractList = this.$refs.contractList.verify ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && element && contractList && relevance) {
                        Object.assign (this.values, element, relevance)
                        this.values.contractprice = util.moneyFormat (this.amount)
                        this.values.signingContract.forEach (res => res['identity'] = 'signatory')
                        this.values.createOthers.push (...this.exonerationClause, ...this.settlementClause, ...this.commerceClause,
                            ...this.paymentClause, ...this.breachClause, ...this.otherClause, ...this.serviceType, ...this.goodsType,
                            ...this.laborType, ...this.values.signingContract)
                        this.dialogVisible = true
                        this.prossValue = {
                            title: this.$route.params.title || `合同签订:【 ${this.values.contractname} 】`,
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.params.degree || '',
                            msg: '',
                        }
                    }
                })
            },

            updataContractConcludeSign (item, boolean) {
                let url = ''
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                switch (this.identification) {
                    case '1':
                        url = boolean ? resetSubmitSelfContractConcludeSign : submitSelfContractConcludeSign
                        break
                    case '2':
                        url = boolean ? resetSubmitJointContractConcludeSign : submitJointContractConcludeSign
                        break
                    default:
                        url = boolean ? resetSubmitContractConcludeSign : submitContractConcludeSign
                        break
                }
                url (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closePageTag ()
                    }
                })
            },

            consentContractConcludeSign (item = '', boolean = false) {
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
                            url = completeSelfContractConcludeSign
                            break
                        case '2':
                            url = completeJointContractConcludeSign
                            break
                        default:
                            url = completeContractConcludeSign
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

            getQueryDicByIdList () {
                let list = [ PURCHASEREQUEST.INVOICETYPE, PURCHASEREQUEST.PRICINGMANNER, 
                    PURCHASEREQUEST.MEANSPAYMENTS, PROPRIETARYPROJECTDICTIONARY.TAXES, PROPRIETARYPROJECTDICTIONARY.PAYMENTPATTERN, PROPRIETARYPROJECTDICTIONARY.PAYMENTCYCLE,
                    PROPRIETARYPROJECTDICTIONARY.SETTLEMENTCURRENCY, PROPRIETARYPROJECTDICTIONARY.CONTRACTMEDIUM,
                    PROPRIETARYPROJECTDICTIONARY.CLASSIFICATION ]
                queryDicByIds (list).then (item => {
                    if (!item) return
                    this.remoteOption.invoicetypeOption = item[PURCHASEREQUEST.INVOICETYPE]
                    this.remoteOption.pricetypeOption = item[PURCHASEREQUEST.PRICINGMANNER]
                    this.remoteOption.sfdsOption = item[PURCHASEREQUEST.MEANSPAYMENTS]
                    this.remoteOption.taxetwosOption = item[PROPRIETARYPROJECTDICTIONARY.TAXES]
                    this.remoteOption.paywayOption = item[PROPRIETARYPROJECTDICTIONARY.PAYMENTPATTERN]
                    this.remoteOption.paycycleOption = item[PROPRIETARYPROJECTDICTIONARY.PAYMENTCYCLE]
                    this.remoteOption.xfoOption = item[PROPRIETARYPROJECTDICTIONARY.SETTLEMENTCURRENCY]
                    this.remoteOption.contractmediumOption = item[PROPRIETARYPROJECTDICTIONARY.CONTRACTMEDIUM]
                    this.remoteOption.differservOption = item[PROPRIETARYPROJECTDICTIONARY.CLASSIFICATION]
                    this.updataRemote ()
                })
            },

            getProjectCode (projectCode) {
                this.values['projectCode'] = projectCode
            },

            getDetailsList (taskId) {
                getDetails (taskId).then (res => { if (res) this.nodeData = res })
            },

            updataContractTerms (terms) {
                this.values.contractTerms.forEach (res => { res['identity'] = this.clause })
                this.contractTermsSonClause (this.clause, true)
                this.contractTermsSonClause (terms)
                this.clause = terms
            },

            updataTransformProp (changeList, prop) {
                let column = [], list = []
                list = changeList.filter (item => { return item.changeColumn })
                list.forEach (item => {
                    column = item.changeColumn.split (',')
                    column.forEach (str => { if (str) this.transform.prop[`${str}${item[prop]}`] = item[prop] })
                })
            },

            updataContractList (type) {
                this.values.contractList = this.$refs.contractList.getNotVerify ()
                this.values.contractList.forEach (res => { res['identity'] = this.inventory })
                this.contractListSonType (this.inventory, true)
                this.contractListSonType (type)
                this.inventory = type
            },

            contractTermsSonClause (data, boolean = false) {
                switch (data) {
                    case 'busi':
                        boolean ? this.commerceClause = this.values.contractTerms : this.values.contractTerms = this.commerceClause.length == 0 ? [{'identity': 'busi'}] : this.commerceClause
                        break
                    case 'break':
                        boolean ? this.breachClause = this.values.contractTerms : this.values.contractTerms = this.breachClause.length == 0 ? [{'identity': 'break'}] : this.breachClause
                        break
                    case 'disclaimer':
                        boolean ? this.exonerationClause = this.values.contractTerms : this.values.contractTerms = this.exonerationClause.length == 0 ? [{'identity': 'disclaimer'}] : this.exonerationClause
                        break
                    case 'settlement':
                        boolean ? this.settlementClause = this.values.contractTerms : this.values.contractTerms = this.settlementClause.length == 0 ? [{'identity': 'settlement'}] : this.settlementClause
                        break
                    case 'pay':
                        boolean ? this.paymentClause = this.values.contractTerms : this.values.contractTerms = this.paymentClause.length == 0 ? [{'identity': 'pay'}] : this.paymentClause
                        break
                    case 'other':
                        boolean ? this.otherClause = this.values.contractTerms : this.values.contractTerms = this.otherClause.length == 0 ? [{'identity': 'other'}] : this.otherClause
                        break
                }
            },

            contractListSonType (data, boolean = false) {
                switch (data) {
                    case 'goods':
                        boolean ? this.goodsType = this.values.contractList : this.values.contractList = this.goodsType.length == 0 ? [{'identity': 'goods'}] : this.goodsType
                        break
                    case 'ser':
                        boolean ? this.serviceType = this.values.contractList : this.values.contractList = this.serviceType.length == 0 ? [{'identity': 'ser'}] : this.serviceType
                        break
                    case 'labour':
                        boolean ? this.laborType = this.values.contractList : this.values.contractList = this.laborType.length == 0 ? [{'identity': 'labour'}] : this.laborType
                        break
                }
            },

            updataCreateOthers (list) {
                list.forEach (res => {
                    if (this.$route.params.isDuplicate) res.id = null
                    switch (res.identity) {
                        case 'busi':
                            this.commerceClause.push (res)
                            break
                        case 'break':
                            this.breachClause.push (res)
                            break
                        case 'disclaimer':
                            this.exonerationClause.push (res)
                            break
                        case 'settlement':
                            this.settlementClause.push (res)
                            break
                        case 'pay':
                            this.paymentClause.push (res)
                            break
                        case 'other':
                            this.otherClause.push (res)
                            break
                        case 'goods':
                            this.goodsType.push (res)
                            break
                        case 'ser':
                            this.serviceType.push (res)
                            break
                        case 'labour':
                            this.laborType.push (res)
                            break
                        case 'signatory':
                            this.values.signingContract.push (res)
                            break
                    }
                })
                this.values.contractTerms = this.commerceClause
                this.values.contractList = this.goodsType
            },
            // 监听表单内容变化
            selectGenerateChange (field, val, models) {
                switch (field) {
                    case 'ispay':
                        this.dynamicCheckField (this.jsonData, this.paymentList, val == '0' ? false : true)
                        break
                    case 'iswarranty':
                        this.dynamicCheckField (this.jsonData, this.warrantyList, val == '0' ? false : true)
                        break
                    case 'isguarante':
                        this.dynamicCheckField (this.jsonData, this.guaranteList, val == '0' ? false : true)
                        break
                    case 'isinvoice':
                        this.dynamicCheckField (this.jsonData, this.invoiceList, val == '0' ? false : true)
                        break
                    case 'iskkwh':
                        this.dynamicCheckField (this.jsonData, this.kkwhList, val == '0' ? false : true)
                        break
                }
                if (this.$route.params.relevancyId && typeof val == 'string' && this.values[field] != val && !this.$route.params.isDuplicate) this.values.updataField[field] = val
                this.values[field] = val
            },

            inputTableChange (field, value, index, parentField) {
                if (this.$route.params.relevancyId) this.values.updataField[`${field},${this.values[parentField][index].id ? this.values[parentField][index].id : ''}`] = value
            },

            dynamicCheckField (dataSourse, fieldList, boolean) {
                dataSourse.list.forEach (res => {
                    if (res.model == 'identity') {
                        console.log(res.columns);
                        res.columns.forEach (item => {
                            if (fieldList.findIndex (f => f == item.list[0].model) != -1) {
                                item.list[0].options.required = boolean
                                if (!boolean) {
                                    this.values[item.list[0].model] = null
                                }
                            }
                        })
                    }
                })
                this.$refs.generateForm.clearValidate (fieldList)
            },

            updataCurrentAmount (data, prop, value) {
                let num = 0, list = []
                list = this.$refs.contractList.getNotVerify ()
                list.forEach (res => { num += Number.parseFloat (res.line9) })
                if (this.$route.params.relevancyId) this.values.updataField[`${prop},${data.id ? data.id : ''}`] = value
                this.updataOtherAmount (num)
            },

            updataOtherAmount (num) {
                if (this.inventory != 'goods') this.goodsType.forEach (res => { num += Number.parseFloat (res.line9) })
                if (this.inventory != 'ser') this.serviceType.forEach (res => { num += Number.parseFloat (res.line9) })
                if (this.inventory != 'labour') this.laborType.forEach (res => { num += Number.parseFloat (res.line9) })
                this.amount = util.moneyTransform (num)
            },

            btnClick (value, field, models, label) {
                let item = { conid: models.id, key: field, label }
                this.contractAlteration = item
                this.alterationVisible = true
            },

            btnTableClick (field, index, list, model, label) {
                let item = { conid: list[index].id, key: model, label }
                this.contractAlteration = item
                this.alterationVisible = true
            },

            relateTableBtnClick (data, prop, index, label) {
                let item = { conid: data.id, key: prop, label }
                this.contractAlteration = item
                this.alterationVisible = true
            },

            updataRemote () {
                this.remote = {
                    getHaveNot (resolve) {
                        resolve (
                            [
                                {
                                    id: '1',
                                    name: '有'
                                },
                                {
                                    id: '0',
                                    name: '无'
                                }
                            ]
                        )
                    },
                    getWhether (resolve) {
                        resolve (
                            [
                                {
                                    id: '1',
                                    name: '是'
                                },
                                {
                                    id: '0',
                                    name: '否'
                                }
                            ]
                        )
                    },
                    getDifferserv (resolve) {
                        resolve (than.remoteOption.differservOption)
                    },
                    getContractType (resolve) {
                        resolve (than.remoteOption.contractTypeOption)
                    },
                    getContractmedium (resolve) {
                        resolve (than.remoteOption.contractmediumOption)
                    },
                    getPricetype (resolve) {
                        resolve (than.remoteOption.pricetypeOption)
                    },
                    getSfds (resolve) {
                        resolve (than.remoteOption.sfdsOption)
                    },
                    getXfo (resolve) {
                        resolve (than.remoteOption.xfoOption)
                    },
                    getPayway (resolve) {
                        resolve (than.remoteOption.paywayOption)
                    },
                    getPaycycle (resolve) {
                        resolve (than.remoteOption.paycycleOption)
                    },
                    getInvoicetype (resolve) {
                        resolve (than.remoteOption.invoicetypeOption)
                    },
                    getTaxetwos (resolve) {
                        resolve (than.remoteOption.taxetwosOption)
                    }
                }
            },

            closePageTag () {
                let tagName = this.$route.path
                let path = ``
                this.stutas ? path = `/approval/${this.stutas}` : path = `/projectManagement/selfSupportProjectDetail/contract/${this.$route.params.path}`
                this.close ({ tagName, path })
            },

            fileDefaultNeaten (res) {
                if (res.files && res.files.length > 0) {
                    res.files.forEach(item => {
                        let m = {
                            status : 'finished',
                            response : {
                                url : item.url,
                                size: item.size,
                                name: item.name
                            }
                        }
                        if (this.$route.params.isDuplicate) item.id = null
                        this.upLoadFileDefaultList.push(m)
                    })
                    this.values['fileList'] = res.files
                }
            },

            printTemplate () {
                getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.$route.params.relevancyId}).then(res => {
                    if (res) {
                        console.log(res);
                        // 下面一行由于点击打印按钮会重复添加内容，所以注释，如果后续出问题可放开注释调试
                        // this.updataCreateOthers (res.createOthers)
                        let data = { commerceClause: this.commerceClause, breachClause: this.breachClause, 
                            exonerationClause: this.exonerationClause, settlementClause: this.settlementClause, 
                            paymentClause: this.paymentClause, otherClause: this.otherClause, goodsType: this.goodsType,
                            serviceType: this.serviceType, laborType: this.laborType, signingContract: this.values.signingContract }
                        Object.assign (res, data)
                        this.$refs.printTemp.printTemplate (res)
                    }
                })
            },

            updataRouter () {
                if (this.$route.params) {
                    this.transform = this.$route.params.transform || {}
                    this.stutas = this.$route.params.pathName || ''
                    this.procInstId = this.$route.params.procInstId || ''
                    this.isAlteration = this.$route.params.isAlteration || false,
                    this.identification = this.$route.params.identification || ''
                }
                switch (this.identification) {
                    case '1':
                        this.processModuleId = PROPRIETARYPROJECT.ADDSELFPROJECTCONTRACTCONCLUDESIGN
                        break
                    case '2':
                        this.processModuleId = PORJECT_INFO.ADDJOINTPROJECTCONTRACTCONCLUDESIGN
                        break
                    default:
                        this.processModuleId = CONTRACT.ADDCONTRACTCONCLUDESIGN
                        break
                }
                this.getFormByJson ()
                if (this.$route.params && this.$route.params.taskId) {
                    this.getDetailsList (this.$route.params.taskId)
                }
                if (this.$route.params && this.$route.params.relevancyId) {
                    this.getContractConcludeSign (this.$route.params.relevancyId)
                }
                if (this.identification == '' && !this.$route.params.transform.isShowDetails) {
                    this.relevanceTransform.isShowDetails = false
                }
            }
        },

        created () {
            this.updataRouter ()
            this.getQueryDicByIdList ()
        },

        mounted () {
            than = this
        },

        components: {
            'joint-project-information-basic': jointProjectInformationBasic,
            'contract-alteration-dialog': contractAlterationDialog,
            'project-information-basic': projectInformationBasic,
            'print-template-by-html': printTemplateByHtml,
            'associated-documents': associatedDocuments,
            'bottomInformation': bottomInformation,
            'qqt-send-process': qqtSendProcess,
            'qqt-relate-table': qqtRelateTable,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent
        }
    }
</script>

<style lang='scss'>
    .contract_conclude_sign {
        .el-tabs__content {
            overflow: unset !important;
        }
        .contract_conclude_sign_clause_button {
            div {
                display: inline-block;
                border: 1px solid;
                padding: 0px 26px;
                border-radius: 20px;
                cursor: pointer;
                line-height: 25px;
                margin-right: 25px;
                -webkit-user-select: none;
            }
            .commerce_clause {
                color: $color-primary;
                background: $color-bg3;
                border-color: $color-primary;
            }
            .commerce_clause:focus, .commerce_clause:hover, .commerce_clause_active {
                background: $color-primary;
                border-color: $color-primary;
                color: $color-text;
            }
            .breach_clause {
                color: $color-warning;
                background: $color-bg3;
                border-color: $color-warning;
            }
            .breach_clause:focus, .breach_clause:hover, .breach_clause_active {
                background: $color-warning;
                border-color: $color-warning;
                color: $color-text;
            }
            .exoneration_clause {
                color: $color-blueness;
                background: $color-bg3;
                border-color: $color-blueness;
            }
            .exoneration_clause:focus, .exoneration_clause:hover, .exoneration_clause_active {
                background: $color-blueness;
                border-color: $color-blueness;
                color: $color-text;
            }
            .settlement_clause {
                color: $color-danger;
                background: $color-bg3;
                border-color: $color-danger;
            }
            .settlement_clause:focus, .settlement_clause:hover, .settlement_clause_active {
                background: $color-danger;
                border-color: $color-danger;
                color: $color-text;
            }
            .payment_clause {
                color: $color-green;
                background: $color-bg3;
                border-color: $color-green;
            }
            .payment_clause:focus, .payment_clause:hover, .payment_clause_active {
                background: $color-green;
                border-color: $color-green;
                color: $color-text;
            }
            .other_clause {
                color: $color-purple;
                background: $color-bg3;
                border-color: $color-purple;
            }
            .other_clause:focus, .other_clause:hover, .other_clause_active {
                background: $color-purple;
                border-color: $color-purple;
                color: $color-text;
            }
        }
        .contract_conclude_sign_inventory_button {
            div {
                display: inline-block;
                border: 1px solid;
                padding: 0px 10px;
                cursor: pointer;
                line-height: 30px;
                margin-right: 5px;
                -webkit-user-select: none;
            }
            .inventory_category {
                background: $color-info;
                border-color: $color-info;
                color: $color-text;
            }
            .inventory_category_active {
                background: $color-primary;
                border-color: $color-primary;
                color: $color-text;
            }
        }
        .contract_conclude_sign_inventory_relate_table {
            background: $color-head-bg;
            padding: 10px 10px 10px 40px;
            .contract_conclude_sign_inventory_total {
                font-size: 16px;
                height: 38px;
                line-height: 38px;
                color: $color-danger;
                padding: 0 10px;
                div {
                    display: inline-block;
                }
                .left {
                    float: left;
                }
                .right {
                    float: right;
                }
            }
        }
        .generate-element-item .fm-form-table-color {
            padding-left: 40px !important;
        }
        .contract_conclude_alteration_background {
            .el-col-8 {
                background: $color-bg;
                padding: 10px 0 0 0;
            }
            .generate-element-item .fm-form-table-color {
                background: $color-bg !important;
            }
        }
        .contract_conclude_alteration_inventory_relate_table {
            background: $color-bg !important;
        }
    }
</style>
