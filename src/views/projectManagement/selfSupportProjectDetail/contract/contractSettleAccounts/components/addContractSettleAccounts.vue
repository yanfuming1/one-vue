<template>
    <d2-container type="fulls" class="contract-settle-accounts">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
            </div>
            <div class="qqt-container-full-center___top">
                <qqt-flow-tabs :procInstId="procInstId">
                    <template slot="content">
                        <project-information-basic v-if="identification == '1'" :transform="transform" :values="values" @projectCode="getProjectCode" />
                        <joint-project-information-basic v-if="identification == '2'" :values="values" @projectCode="getProjectCode" />
                        <basics-contract ref="basicsContract" :identification="identification" :isContractEdit="false" :contract="contract" @contractInformation="getContractInformation"/>
                        <associated-documents left="10px" ref="relevance" :transform="relevanceTransform" :isInitLoad="identification == '1' ? true : false" :relevance="relevance" />
                        <fm-generate-form :data="jsonData" :remote="remote" :value="values" :transform="transform" ref="generateForm">
                            <template slot="inventory">
                                <div class="contract-settle-accounts_inventory_button">
                                    <div class="inventory_category" v-for="item of inventoryList" :key="item.id" v-if="item.isShow" :class="{'inventory_category_active': inventory == item.id}" @click="updataContractList (item.id)">{{ item.name }}</div>
                                </div>
                            </template>
                            <template slot="relateTable">
                                <div class="contract-settle-accounts_inventory_relate_table">
                                    <qqt-relate-table :data="values.contractList" :isShowAdd="false" :isShowDelete="false" ref="contractList" :rowHeader="contractListHeader" :isShowDetails="transform.isShowDetails" @blur="updataContractTheMoney" >
                                        <template slot="content">
                                            <div class="contract-settle-accounts_inventory_total">
                                                <div>合同总金额(元): <span :title="this.managerCreate.contractprice">{{ this.managerCreate.contractpriceStr }}</span></div>
                                                <div>累计结算金额(元): <span :title="this.managerCreate.cumulsettle">{{ this.managerCreate.cumulsettleStr }}</span></div>
                                            </div>
                                        </template>
                                    </qqt-relate-table>
                                </div>
                            </template>
                            <template slot="collectionPayment">
                                <collection-payment-information :data="values" :isShowElement="!transform.isShowDetails" :isIncome="isIncome" ref="collectionPayment"/>
                            </template>
                            <template slot="collectionPaymentPersonnel">
                                <collection-payment-personnel :data="values" :isShowElement="transform.isShowDetails" :isIncome="isIncome" ref="collectionPaymentPersonnel"/>
                            </template>
                        </fm-generate-form>
                        <el-divider content-position="left" v-if="isShowAccounting">
                            <div class="generate-from-divider___line"></div>
                            {{ !isIncome ? '公司付款账户信息' : '公司收款账户信息'}}
                        </el-divider>
                        <div class="contract-settle-accounts_accountant">
                            <accountant :dataInfo="dataInfo" :addAccountingBtn="false" ref="accountant" v-if="isShowAccounting" :isPay="isIncome" :isShowDetails="$route.name == 'contractSettleAccountsAccount' 
                                || $route.name == 'contractSelfProjectSettleAccountsAccount'
                                || $route.name == 'contractJointProjectSettleAccountsAccount' ? false : transform.isShowDetails"/>
                        </div>
                        <bottom-information :values="values" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation" />
                    </template>
                </qqt-flow-tabs>
            </div>
            <div class="qqt-container-full-content___button">
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitSettleAccountsRecordData ()">重新提交</el-button>
                <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveContractSettleAccounts">保存</el-button>
                <el-button type="primary" v-if="!transform.isShowDetails && procInstId === ''" @click="values['flag'] = '1', submitSettleAccountsRecordData ()">提交</el-button>
                <el-button type="info" size="mini" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                <el-button @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataContractSettleAccounts"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentContractSettleAccounts" />
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </d2-container>
</template>

<script>
    import { getSelfSettleAccountsRecordById, getSettleAccountsRecordById, getJointSettleAccountsRecordById,
             editSelfSettleAccountsRecord, editSettleAccountsRecord, editJointSettleAccountsRecord,
             addSelfSettleAccountsRecord, addSettleAccountsRecord, addJointSettleAccountsRecord,
             submitSelfSettleAccountsRecord, submitSettleAccountsRecord, submitJointSettleAccountsRecord,
             completeSelfSettleAccountsRecord, completeSettleAccountsRecord, completeJointSettleAccountsRecord,
             resetSubmitSelfSettleAccountsRecord, resetSubmitSettleAccountsRecord, resetSubmitJointSettleAccountsRecord } from '@/api/selfProject/contract/settleAccountsRecord'
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
    import collectionPaymentInformation from './collectionPaymentInformation'
    import collectionPaymentPersonnel from './collectionPaymentPersonnel'
    import bottomInformation from '../../../businessBidding/components/bottomInformation'
    import projectInformationBasic from '../../../operatingReserve/components/projectInformationBasic'
    import accountant from '../../../../../approval/components/pushPage/projectCashRequest/components/accountant'
    import printTemplateByHtml from '../../../../../systemManagement/printTemplate/components/printTemplateByHtml'
    import jointProjectInformationBasic from '../../../../jontProjectDetail/components/jointProjectInformationBasic'
    import util from '@/libs/util.js'
    let than = this
    export default {

        data () {
            return {
                title: '',
                stutas: '',
                amount: '',
                inventory: 'goods',
                identification: '',
                procInstId: '',
                remote: {},
                values: {
                    contractList: []
                },
                relevance: {},
                jsonData: {},
                contract: {
                    contractid: ''
                },
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
                managerCreate: {},
                visible: false,
                isReject: false,
                isIncome: false,
                isSendBack: false,
                isTurnManage: false,
                dialogVisible: false,
                isShowAccounting: false,
                code: BASICSCODE.SELF_CONTRACT_SETTLE,
                processModuleId: '',
                upLoadFileDefaultList: [],
                contractListHeader: [
                    {
                        prop: 'line1',
                        label: '编码',
                        isShow: true,
                        type: 'text',
                        isShowDetails: true,
                        width: 150
                    },
                    {
                        prop: 'line2',
                        label: '名称',
                        isShow: true,
                        type: 'text',
                        isShowDetails: true,
                        width: 150
                    },
                    {
                        prop: 'line3',
                        label: '品牌',
                        isShow: true,
                        type: 'text',
                        isShowDetails: true,
                        width: 150
                    },
                    {
                        prop: 'line4',
                        label: '规格型号',
                        isShow: true,
                        type: 'text',
                        isShowDetails: true,
                        width: 150
                    },
                    {
                        prop: 'line5',
                        label: '技术参数',
                        isShow: true,
                        type: 'text',
                        isShowDetails: true,
                        width: 150
                    },
                    {
                        prop: 'line6',
                        label: '计量单位',
                        isShow: true,
                        type: 'text',
                        isShowDetails: true,
                        width: 150
                    },
                    {
                        prop: 'line7',
                        label: '合同数量',
                        isShow: true,
                        type: 'text',
                        isShowDetails: true,
                        width: 150
                    },
                    {
                        prop: 'line8',
                        label: '合同单价(元)',
                        isShow: true,
                        type: 'money',
                        isShowDetails: true,
                        width: 150
                    },
                    {
                        prop: 'line9',
                        label: '合同金额(元)',
                        isShow: true,
                        type: 'money',
                        isShowDetails: true,
                        width: 150
                    },
                    {
                        prop: 'line11',
                        label: '累计结算数量',
                        isShow: true,
                        type: 'text',
                        isShowDetails: true,
                        width: 150
                    },
                    {
                        prop: 'line12',
                        label: '本次结算数量',
                        isShow: true,
                        type: 'text',
                        required: true,
                        width: 150,
                        rule: [
                            { required: true, message: `本次结算数量不能为空`, trigger: 'change' },
                            { pattern: /^[0-9]*[0-9][0-9]*$/, message: `输入数据不正确`, trigger: 'change' }
                        ],
                        msg: '本本次结算数量不能大于剩余结算数量',
                        notGreaterThan: 'line13 - line10',
                        fixed: 0
                    },
                    {
                        prop: 'line13',
                        label: '剩余结算数量',
                        isShow: true,
                        type: 'text',
                        isShowDetails: true,
                        width: 150
                    },
                    {
                        prop: 'line14',
                        label: '结算金额(元)',
                        isShow: true,
                        type: 'total',
                        controlRow: 'line8 * line12',
                        isShowDetails: true,
                        isMoneyType: true,
                        required: true,
                        width: 150
                    },
                    {
                        prop: 'line10',
                        label: '备注',
                        isShow: true,
                        type: 'text',
                        width: 150
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
                laborType: [],
                dataInfo: []
            }
        },

        methods: {

            ...mapActions('d2admin/page', [
                'close',
            ]),

            getFormByJson () {
                formGetJson ({ 'code': this.processModuleId }).then(res => {
                    if (res) this.updataFormJson (JSON.parse(res))
                })
            },

            getContractSettleAccounts (id) {
                let url = ''
                switch (this.identification) {
                    case '1':
                        url = getSelfSettleAccountsRecordById
                        break
                    case '2':
                        url = getJointSettleAccountsRecordById
                        break
                    default:
                        url = getSettleAccountsRecordById
                        break
                }
                url ({'id': id}).then (res => {
                    if (res) {
                        this.values = res
                        this.relevance = { ...res }
                        this.$set (this.values, 'contractList', [])
                        this.prossValue.title = `合同结算:【 ${this.values.contractname} 】`
                        this.isIncome = res.contracttype.includes ('收入合同')
                        if (this.$route.params.isDuplicate) {
                            this.contract = this.$route.params.contract || {}
                            this.values.id = this.values.procInstId = this.values.procState = null
                            delete this.values.companyId, delete this.values.companyName, delete this.values.createBy 
                            delete this.values.createName, delete this.values.createTime, delete this.values.departmentId,
                            delete this.values.departmentName
                            if (this.isIncome) {
                                delete this.values.recname, delete this.values.recbank, delete this.values.recnum
                            } else {
                                delete this.values.payname, delete this.values.paybank, delete this.values.paynum
                            }
                        } else {
                            this.contract = res
                            if (this.values.recname && this.values.payname) this.isShowAccounting = true
                        }
                        this.neatenSaveAndQueryData (res)
                        this.getContractInformation (res.settles, res)
                        this.fileDefaultNeaten (res)
                    }
                }).finally (() => {
                    this.getFormByJson ()
                })
            },

            saveContractSettleAccounts () {
                let url = '', item = {}
                item = this.neatenSaveAndQueryData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (item.basicsContract && item.collectionPayment && item.collectionPaymentPersonnel
                        && item.contractList && item.bottomInformation && item.relevance) {
                        Object.assign (this.values, item.basicsContract, 
                            item.collectionPayment, item.collectionPaymentPersonnel, 
                            item.bottomInformation, item.manager, item.relevance)
                        this.values['settles'] = item.contractList
                        switch (this.identification) {
                            case '1':
                                url = this.values.id == null ? addSelfSettleAccountsRecord : editSelfSettleAccountsRecord
                                break
                            case '2':
                                url = this.values.id == null ? addJointSettleAccountsRecord : editJointSettleAccountsRecord
                                break
                            default:
                                url = this.values.id == null ? addSettleAccountsRecord : editSettleAccountsRecord
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

            submitSettleAccountsRecordData () {
                let item = this.neatenSaveAndQueryData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (item.collectionPayment && item.basicsContract && item.collectionPaymentPersonnel
                        && item.contractList && item.bottomInformation && item.relevance) {
                        Object.assign (this.values, item.basicsContract,
                            item.collectionPayment, item.collectionPaymentPersonnel,
                            item.bottomInformation, item.manager, item.relevance)
                        this.values['settles'] = item.contractList
                        this.dialogVisible = true
                        this.prossValue = {
                            title: this.$route.params.title || `合同结算:【 ${this.values.contractname} 】`,
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.params.degree || '',
                            msg: '',
                        }
                    }
                })
            },

            updataContractSettleAccounts (item, boolean) {
                let url = ''
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                switch (this.identification) {
                    case '1':
                        url = boolean ? resetSubmitSelfSettleAccountsRecord : submitSelfSettleAccountsRecord
                        break
                    case '2':
                        url = boolean ? resetSubmitJointSettleAccountsRecord : submitJointSettleAccountsRecord
                        break
                    default:
                        url = boolean ? resetSubmitSettleAccountsRecord : submitSettleAccountsRecord
                        break
                }
                url (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closePageTag ()
                    }
                })
            },

            consentContractSettleAccounts (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closePageTag ()
                    return
                }
                if (item) {
                    this.values['completeTask'] = item
                    let data = {}, url = ''
                    data = this.neatenSaveAndQueryData ()
                    if (data.collectionPayment && data.basicsContract && data.collectionPaymentPersonnel && data.contractList && data.bottomInformation) {
                        if (data.element) Object.assign (this.values, data.element, data.collectionPayment)
                        switch (this.identification) {
                            case '1':
                                url = completeSelfSettleAccountsRecord
                                break
                            case '2':
                                url = completeJointSettleAccountsRecord
                                break
                            default:
                                url = completeSettleAccountsRecord
                                break
                        }
                        url (this.values).then (res => {
                            if (res.code === 200) {
                                this.$message.success (res.message)
                                this.closePageTag ()
                            }
                        })
                    }
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
                if (this.values.contractList.length > 0) {
                    return
                }
                this.neatenManagerCreate (managerCreate)
                this.neatenCreateOthersData (createOthers)
                if (createOthers && createOthers.length > 0) this.updataCreateOthers (createOthers)
            },

            neatenCreateOthersData (createOthers) {
                createOthers.forEach (res => {
                    res.line11 = res.line11 ? res.line11 + '' : res.cumulnum ? res.cumulnum + '' : '0'
                    res.line12 = res.line12 ? res.line12 + '' : '0', res.cumulnum = res.cumulnum ? res.cumulnum + '' : '0'
                    res.line10 = '0'
                     this.$route.params.relevancyId && !this.$route.params.isDuplicate ? res.line13 = res.line13 ? res.line13 + '' : '0' :  res['line13'] = typeof res.remainnum == 'number' && res.remainnum >= 0 ? res.remainnum + '' : res.line7
                })
            },

            neatenManagerCreate (managerCreate) {
                managerCreate['contractpriceStr'] = managerCreate.contractprice ? util.moneyTransform (managerCreate.contractprice) : '0'
                managerCreate['cumulsettleStr'] = managerCreate.cumulsettle ? util.moneyTransform (managerCreate.cumulsettle) : '0'
                managerCreate['cumulrecStr'] = managerCreate.cumulrec ? util.moneyTransform (managerCreate.cumulrec) : '0'
                managerCreate['cumulpayStr'] = managerCreate.cumulpay ? util.moneyTransform (managerCreate.cumulpay) : '0'
                // if (managerCreate && managerCreate.projectId) {
                    const { projectCode, projectId, projectType, projectName } = managerCreate
                    this.relevance = { projectCode, projectId, projectType, projectName }
                // }
                this.managerCreate = managerCreate
            },

            updataContractTheMoney () {
                let contractList = [], num = 0
                contractList = this.$refs.contractList.getNotVerify ()
                contractList = this.mergeContractListSonToType (contractList)
                contractList.forEach (item => { num += Number.parseFloat (item.line14) || 0 })
                this.$refs.collectionPayment.updataContractTheMoney (num)
            },

            mergeContractListSonToType (data) {
                let list = []
                switch (data[0]['identity']) {
                    case 'goods':
                        list = [ ...data, ...this.serviceType, ...this.laborType ]
                        break
                    case 'ser':
                        list = [ ...this.goodsType, ...data, ...this.laborType ]
                        break
                    case 'labour':
                        list = [ ...this.goodsType, ...this.serviceType, ...data ]
                        break
                }
                return list
            },

            neatenSaveAndQueryData (data) {
                let basicsContract = {}, collectionPayment = {}, collectionPaymentPersonnel = {}, element = {}
                let contractList = {}, bottomInformation = {}, manager = {}, item = {}, list = [], relevance = {}
                if (data) {
                    if (this.isIncome) {
                        const { recname: name, recbank: openingBank, recnum: account, recmoney: money } = data
                        this.dataInfo = [{ name, openingBank, account, money }]
                    } else {
                        const { payname: name, paybank: openingBank, paynum: account, recmoney: money } = data
                        this.dataInfo = [{ name, openingBank, account, money }]
                    }
                } else {
                    relevance = this.$refs.relevance.getData ()
                    contractList = this.$refs.contractList.verify ()
                    basicsContract = this.$refs.basicsContract.getData ()
                    collectionPayment = this.$refs.collectionPayment.getData ()
                    bottomInformation = this.$refs.bottomInformation.getData ()
                    collectionPaymentPersonnel = this.$refs.collectionPaymentPersonnel.getData ()
                    contractList = this.mergeContractListSonToType (contractList)
                    if ((this.$route.name == 'contractSettleAccountsAccount' || this.$route.name == 'contractSelfProjectSettleAccountsAccount' || this.$route.name == 'contractJointProjectSettleAccountsAccount') && this.values['flag'] == '1') {
                        list = this.$refs.accountant.getData()
                        if (this.isIncome) {
                            const { name: recname, openingBank: recbank, account: recnum, money: recmoney } = list[0]
                            element = { recname, recbank, recnum, recmoney }
                            if (this.stutas != '' && element.recmoney != collectionPayment.thisprice) this.$message.warning ('收款金额必须等于本次收到金额'), collectionPayment = false
                        } else {
                            const { name: payname, openingBank: paybank, account: paynum, money: recmoney } = list[0]
                            element = { payname, paybank, paynum, recmoney }
                            if (this.stutas != '' && element.recmoney != collectionPayment.thispayprice) this.$message.warning ('支付金额必须等于本次支付金额'), collectionPayment = false
                        }
                    }
                    manager = { cumulsettle: this.managerCreate.cumulsettle, recprice: this.managerCreate.cumulrec, payprice: this.managerCreate.cumulpay }
                    
                    item = { contractList, basicsContract, collectionPayment, bottomInformation, collectionPaymentPersonnel, manager, element, relevance }
                }
                return item
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
            },

            resetData () {
                this.goodsType = [], this.serviceType = [], this.laborType = []
                this.inventoryList.forEach (res => { res.isShow = false })
            },

            getProjectCode (projectCode) {
                this.values['projectCode'] = projectCode
            },

            closePageTag () {
                let path = ``
                let tagName = this.$route.path
                let name = this.$route.params.path
                let params = { isIncome: this.isIncome, contractId: this.contract.contractid || '', identification: this.identification || '' }
                this.stutas ? (path = `/approval/${this.stutas}`, this.close ({ tagName, path })) : (path = `/projectManagement/selfSupportProjectDetail/${this.$route.params.path}`, this.close ({ tagName, path, name, params }))
                
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

            updataFormJson (data) {
                data.list.forEach (res => {
                    if (this.isIncome) {
                        if (res.model == 'income' || res.model == 'payer') res.options.hidden = false
                    } else {
                        if (res.model == 'payment' || res.model == 'payee') res.options.hidden = false
                    }
                })
                this.jsonData = data
            },

            printTemplate () {
                getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.$route.params.relevancyId}).then(res => {
                    if (res) {
                        this.getContractInformation (res.settles, res)
                        res['goodsType'] = this.goodsType, res['serviceType'] = this.serviceType, res['laborType'] = this.laborType
                        res.cumulsettle = res.cumulsettle + ''
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
                switch (this.identification) {
                    case '1':
                        this.processModuleId = PROPRIETARYPROJECT.ADDSELFPROJECTCONTRACTSETTLEACCOUNTS
                        break
                    case '2':
                        this.processModuleId = PORJECT_INFO.ADDJOINTPROJECTCONTRACTSETTLEACCOUNTS
                        break
                    default:
                        this.processModuleId = CONTRACT.ADDCONTRACTSETTLEACCOUNTS
                        break
                }
                if (this.$route.params && this.$route.params.taskId) {
                    this.getDetailsList (this.$route.params.taskId)
                }
                if (this.$route.params && this.$route.params.relevancyId) {

                    this.getContractSettleAccounts (this.$route.params.relevancyId)
                } else {
                    this.contract = this.$route.params.contract || {}
                    this.isIncome = this.$route.params.isIncome || false
                    this.getFormByJson ()
                }
                if (this.$route.name != 'addContractSettleAccounts'
                        && this.$route.name != 'addSelfProjectContractSettleAccounts'
                        && this.$route.name != 'addJointProjectContractSettleAccounts') this.isShowAccounting = true
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
            'collection-payment-information': collectionPaymentInformation,
            'collection-payment-personnel': collectionPaymentPersonnel,
            'project-information-basic': projectInformationBasic,
            'print-template-by-html': printTemplateByHtml,
            'associated-documents': associatedDocuments,
            'bottom-information': bottomInformation,
            'qqt-send-process': qqtSendProcess,
            'qqt-relate-table': qqtRelateTable,
            'basics-contract': basicsContract,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent,
            'accountant': accountant
        }
    }
</script>

<style lang='scss'>
    .contract-settle-accounts {
        .contract-settle-accounts_inventory_button {
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
        .contract-settle-accounts_inventory_relate_table {
            .qqt-Relate-table {
                padding-top: 0px !important;
            }
        }
        .contract-settle-accounts_inventory_total {
            float: left;
            width: 100%;
            height: 55px;
            margin-top: 5px;
            background: $color-head-bg;
            div {
                font-size: 15px;
                line-height: 55px;
                padding: 0 25px;
                overflow:hidden;
                text-overflow:ellipsis;
                white-space:nowrap;
                display: inline-block;
                width: 33%;
                color: $color-danger;
            }
        }
        .contract-settle-accounts_accountant {
            margin-left: 30px;
        }
    }
</style>
