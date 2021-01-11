<template>
    <d2-container type="fulls" class="addIncomeRegistered">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
            </div>
            <div class="add-income-registered">
                <qqt-flow-tabs :procInstId="procInstId">
                    <template slot="content">
                        <project-information-basic :transform="transform" :values="values" @projectCode="getProjectCode" />
                        <div class="project-revenue-information">
                            <p>该项目当前总收入为 {{ incomeTotalData.receivable }} 元，其中已收 {{ incomeTotalData.moneyReceipt }}元，待收 {{ incomeTotalData.moneyAwait }} 元</p>
                        </div>
                        <div>
                            <fm-generate-form :data="jsonData" :remote="remote" :value="values" :transform="transform" ref="generateForm" @on-change="selectGenerateChange" >
                                <template slot="IsProjectPayment">
                                    <el-form :rules="rules" :model="values" ref="form">
                                        <el-form-item label="资金属性:" label-width="130px" prop="moneyAttribute">
                                            <qqt-select v-model="values.moneyAttributeId" :isShowElement="!transform.isShowDetails" :options="moneyAttributeOptions" @select="getMoneyAttribute"></qqt-select>
                                        </el-form-item>
                                    </el-form>
                                </template>
                                <template slot="IsProjectPayments" v-if="belongContractShow">
                                    <el-form :rules="rules" :model="values" ref="form">
                                        <!-- <el-form-item label="工程款是否属于合同清单范围内:" label-width="252px" prop="isProjectPayments"> -->
                                        <el-form-item label-width="130px" prop="belongContract">
                                            <qqt-radio :value="values.belongContract" :options="isRateList" :isShowElement="!transform.isShowDetails" @radio="values.belongContract = $event"></qqt-radio>
                                        </el-form-item>
                                    </el-form>
                                </template>
                            </fm-generate-form>
                            <bottomInformation v-if="!this.$route.params.addIncome" :values="values" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
                            <div class="qqt-container-full-content___button">
                                <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitIncomeRegisteredData ()">重新提交</el-button>
                                <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                                <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                                <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                                <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                                <el-button type="warning" v-if="!transform.isShowDetails && procInstId === '' && !this.$route.params.addIncome" @click="saveIncomeRegistered">保存</el-button>
                                <el-button type="primary" v-if="!transform.isShowDetails && procInstId === '' && !this.$route.params.addIncome" @click="submitIncomeRegisteredData ()">提交</el-button>
                                <el-button type="info" size="mini" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                                <el-button v-if="!this.$route.params.addIncome" @click="closePageTag">关闭</el-button>
                            </div> 
                        </div>
                        <div v-if="this.$route.params.addIncome">
                            <el-divider content-position="left">
                            <div class="generate-from-divider___line"></div>
                                到账资金登记
                            </el-divider>
                            <div class="add-purchase-request-button" v-if="incomeTotalData.moneyAwait != 0">
                                <el-button size="mini" round type="primary" @click="incomeDataBtn = !incomeDataBtn">{{ incomeDataBtn ? '返回' : '添加收入金额' }}</el-button>
                            </div>
                            <div v-if="incomeDataBtn">
                                <fm-generate-form :data="incomeData" :remote="remote" :value="values" ref="generateForm"  @btn-click="btnClick">
                                </fm-generate-form>
                                <fund-determination :dialogVisible='dialogVisible' :option="tableOption" @closeDialog='closeDialog' @getData='getDialogData'></fund-determination>
                                <bottomInformation :values="values" :isShowAccessory="false" :transform="{ isShowDetails: !transform.isShowDetails }" ref="bottomInformation"></bottomInformation>
                                <div class="qqt-container-full-content___button">
                                    <el-button type="primary" @click="submitAccountRegisteredEvent">提交收入金额</el-button>
                                    <el-button @click="closePageTag">关闭</el-button>
                                </div>
                            </div>
                            <div class="qqt-container-full___center" v-else>
                                <qqt-table :data="tableData" ref="table" :exportData="tableData.records" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" @page="handlePaginationChange" />
                                <div class="qqt-container-full-content___button">
                                    <el-button @click="closePageTag">关闭</el-button>
                                </div>
                            </div>
                        </div>
                    </template>
                </qqt-flow-tabs>
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModule" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataAnnouncementChange"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentIncomeRegistered" />
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </d2-container>
</template>

<script>
    import { addIncomeRegistered, getIncomeRegisteredQueryById, editIncomeRegistered,
        submitIncomeRegistered, submitAccountRegistered, getIncomeAccountd, getIncomeTotal, completeIncomeRegistered } from '@/api/selfProject/economicCalculation/incomeRegistered'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, qqtRelateTable, qqtSelect, qqtRadio } from '@/components/qqt-subassembly'
    import { formGetJson } from '@/api/system/fromManagement/index'
    import fundDetermination from '../../../../../projectManagement/jontProjectDetail/cashDepositManagement/components/fundDetermination'
    import bottomInformation from '../../../businessBidding/components/bottomInformation'
    import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
    import { getUserDepartById } from '@/api/system/depart/depart'
    import { PROPRIETARYPROJECT } from '@/enum/FORMCODE'
    import { ECONMICCALCUTION } from '@/enum/DICTIONARY'
    import { queryDicById } from '@/api/system/dic/dic'
    import { getDetails } from '@/api/approval/common'
    import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
    import { mapActions } from 'vuex'
    import { qqtTable } from '@/components/qqt-subassembly'
    import projectInformationBasic from '../../../operatingReserve/components/projectInformationBasic'
    import printTemplateByHtml from '../../../../../systemManagement/printTemplate/components/printTemplateByHtml'
    import util from '@/libs/util.js'
    let than = this
    export default {

        data () {
            return {
                title: '',
                stutas: '',
                procInstId: '',
                isProjectPayment: true,
                belongContractShow: true,
                remote: {
                    getIsProjectPayment (resolve) {
                        resolve ([
                            {
                                id: '0',
                                value: '否'
                            },
                            {
                                id: '1',
                                value: '是'
                            }
                        ])
                    },
                    getCloseType (resolve) {
                        resolve ([
                            {
                                id: '1',
                                value: '工程实体结算价'
                            },
                            {
                                id: '2',
                                value: '工程变更'
                            },{
                                id: '3',
                                value: '签证索赔'
                            },
                            {
                                id: '4',
                                value: '奖励'
                            }
                        ])
                    }
                },
                values: {
                    moneyAttribute: '',
                    moneyAttributeId: '',
                    belongContract: '0',
                    projectFunds: ''
                },
                incomeTotalData: {
                    receivable: 0.00, 
                    moneyReceipt: 0.00,
                    moneyAwait: 0.00
                },
                rules: {
                    moneyAttributeId: [{ required: true, message: '请选择资金属性', trigger: 'change' }],
                    belongContract: [{ required: true, message: '请选择工程款是否属于合同清单范围内', trigger: 'change' }],
                },
                isRateList: [
                    {
                        value: '0',
                        label: '合同外收入'
                    },
                    {
                        value: '1',
                        label: '合同内收入'
                    }
                    
                ],
                moneyAttributeOptions: [],
                moneyAttributeDic: ECONMICCALCUTION.MONEYATTEIBUTE,
                jsonData: {},
                prossValue: {
                    title: ''
                },
                incomeData: {},
                tableOption: {},
                nodeData: {
                    operation: '',
                    msg: ''
                },
                transform: {
                    isShowDetails: false
                },
                visible: false,
                isSendBack: false,
                isReject: false,
                isTurnManage: false,
                dialogVisible: false,
                code: BASICSCODE.SELF_INCOME_CHECK,
                processModuleId: [PROPRIETARYPROJECT.BASICINFORMATIONINCOMEREGISTRATION, PROPRIETARYPROJECT.ADDINCOME],
                processModule: PROPRIETARYPROJECT.BASICINFORMATIONINCOMEREGISTRATION,
                upLoadFileDefaultList: [],
                departmentList: [],
                incomeDataBtn: false,
                tableData: {},
                dynamicHeader: {
                    tableId: '',
                    isSave: false
                },
                page: {
                    current: 1,
                    size: 10,
                    total: 0
                },
                rowHeader: [
                    {
                        prop: 'proceedsWay',
                        label: '支付方式',
                        width: '165'
                    },
                    {
                        prop: 'paymentAccount',
                        label: '付款账户户名',
                        isShow: true
                    },
                    {
                        prop: 'paymentBank',
                        label: '付款开户行',
                        isShow: true
                    },
                    {
                        prop: 'paymentNumber',
                        label: '付款账号',
                        isShow: true
                    },
                    {
                        prop: 'paymentAmountName',
                        label: '付款金额',
                        isShow: true,
                        render: (h, parms) => {
                            return h('span', {
                            }, parms.row.paymentAmountName = parms.row.paymentAmount = Number(parms.row.paymentAmount).toFixed(2))
                        }
                    },
                    {
                        prop: 'paymentDate',
                        label: '付款时间',
                        isShow: true
                    },
                    {
                        prop: 'paymentMessage',
                        label: '付款留言',
                        isShow: true
                    },
                    {
                        prop: 'proceedsAccount',
                        label: '收款账户户名',
                        isShow: true
                    },
                    {
                        prop: 'proceedsBank',
                        label: '收款开户行',
                        isShow: true
                    },
                    {
                        prop: 'proceedsNumber',
                        label: '收款账号',
                        isShow: true
                    }
                ]
            }
        },

        methods: {

            ...mapActions('d2admin/page', [
                'close',
            ]),
            
            getIncomeAccountdPage () {
                getIncomeAccountd({'checkId': this.$route.params.relevancyId}).then( res => {
                    this.tableData = res
                })
            },

            handlePaginationChange (page) {
                this.page = page;
                this.$nextTick(() => {
                    this.searchModelSynopsis ()
                });
            },

            getFormByJson () {
                this.processModuleId.forEach( processModuleId => {
                    formGetJson ({ 'code': processModuleId }).then(res => {
                        if (res) {
                            switch (processModuleId) {
                                case PROPRIETARYPROJECT.BASICINFORMATIONINCOMEREGISTRATION :
                                    this.jsonData = JSON.parse(res)
                                    break
                                case PROPRIETARYPROJECT.ADDINCOME :
                                    this.incomeData =JSON.parse(res)
                            }
                        }
                    })
                })
            },

            selectGenerateChange (field, val, models) {
                if (field == 'projectFunds') {
                    this.values.projectFunds = val
                    // 是工程款时（1），资金属性值为 1-预付款，2-进度款，3-质保金，4-结算利润；非工程款（1）时来源数据字典
                    val == '1' ? this.getMoneyAttributeOptions () : this.getMoneyAttributeDic ()
                }
            },
            getMoneyAttributeOptions () {
                this.belongContractShow = true
                this.moneyAttributeOptions = [
                    {
                        value: '1',
                        label: '预付款'
                    },{
                        value: '2',
                        label: '进度款'
                    },{
                        value: '3',
                        label: '质保金'
                    },{
                        value: '4',
                        label: '结算利润'
                    },
                ]
            },
            getMoneyAttributeDic () {
                this.belongContractShow = false
                queryDicById ({'id': this.moneyAttributeDic}).then (res => {
                    res.forEach(item => {
                        item.value = item.id
                        item.label = item.name
                    })
                    this.moneyAttributeOptions = res
                })
            },

            btnClick (field, model){
                switch (field) {
                    case 'paymentAccount':
                        // 到账资金登记
                        this.dialogVisible = true
                        break
                }
            },
            closeDialog () {
                    this.dialogVisible = false
            },

            getDialogData (data) {
                data.gatheringamount = Number(data.gatheringamount).toFixed(2)
                        // 付款信息
                const { id: affirmId, payaccount: paymentAccount, paybank: paymentBank, paynum: paymentNumber, gatheringamount: paymentAmount, createTime: paymentDate, paymark: paymentMessage,
                        // 收款信息
                        companycollection: proceedsAccount, gatheringbank: proceedsBank, gatheringaccount: proceedsNumber, gatheringway: proceedsWay } = data
                let item = { affirmId, paymentAccount, paymentBank, paymentNumber, paymentAmount, paymentDate, paymentMessage,
                    proceedsAccount, proceedsBank, proceedsNumber, proceedsWay }

                this.values = Object.assign ({}, this.values, item)
                this.dialogVisible = false
            },

            saveIncomeRegistered () {
                let url = ''
                let info = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if(data && info) {
                        Object.assign (this.values, data, info)
                        this.values.projectFunds == '0' ? this.values.belongContract = '' : this.values.belongContract
                        this.values.id == null ? url = addIncomeRegistered : url = editIncomeRegistered
                        url (this.values).then (res => {
                            if (res.code === 200) {
                                this.$message.success ('保存成功')
                                this.closePageTag ()
                            }
                        })
                    }
                })
            },

            getAddIncomeRegistered (id) {
                getIncomeRegisteredQueryById ({'id': id}).then (res => {
                    if (res) {
                        res.receivable = res.receivable + ''
                        res.projectFunds == '0' ? this.belongContractShow = false : true
                        Object.assign (this.values, res)
                        this.fileDefaultNeaten (res)
                        if (this.$route.params.addIncome) delete this.values.createBy
                    }
                })
            },

            getIncomeTotalData () {
                getIncomeTotal({
                    'projectCode': this.values['projectCode']
                }).then( res => {
                    this.incomeTotalData.receivable = res.receivable.toFixed(2)
                    this.incomeTotalData.moneyReceipt = res.moneyReceipt.toFixed(2)
                    this.incomeTotalData.moneyAwait = res.moneyAwait.toFixed(2)
                })
            },

            addIncomeEvent () {
                this.transform.isShowDetails = true
            },

            submitIncomeRegisteredData () {
                let info = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => { 
                    if (data && info) {
                        Object.assign( this.values, data, info)
                        this.dialogVisible = true
                        this.prossValue = {
                            title: this.$route.params.title || `收入登记:【 ${this.values.incomeName} 】`,
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.params.degree || '',
                            msg: '',
                        }
                    }
                })
            },

            consentIncomeRegistered (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closePageTag ()
                    return
                }
                if (item) {
                    this.values['completeTask'] = item
                    this.transform.isShowDetails = true
                    completeIncomeRegistered (this.values).then (res => {
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

            // submitIncomeRegisteredData () {
            //     this.$refs.generateForm.getData ().then (data => {
            //         if (data) {
            //             Object.assign (this.values, data)
            //             submitIncomeRegistered(this.values).then( res => {
            //                 if (res.code === 200) {
            //                     this.$message.success ('提交成功')
            //                     this.closePageTag ()
            //                 }
            //             })
            //         }
            //     })
            // },

            submitAccountRegisteredEvent () {
                this.$refs.generateForm.getData ().then (data => {
                    if (data) {
                        this.values.checkId = this.values.id
                        Object.assign (this.values, data)
                        delete this.values.id
                        submitAccountRegistered(this.values).then( res => {
                            this.getIncomeAccountdPage ()
                            this.incomeDataBtn = false
                        })
                    }
                })
            },

            updataAnnouncementChange (item, boolean) {
                let url = ''
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                boolean ? url = completeIncomeRegistered : url = submitIncomeRegistered
                // delete this.values.id
                url (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closePageTag ()
                    }
                })
            },

            closePageTag () {
                let tagName = this.$route.path
                let path = ``
                this.stutas ? path = `/approval/${this.stutas}` : path = this.$router.go(-1)
                this.close ({ tagName, path })
            },

            upLoadFileCallBack (item) {
                this.values.fileList = item
            },

            getMoneyAttribute (id) {
                this.values.moneyAttributeId = id
                let item = this.moneyAttributeOptions.find (f => f.value == id)
                if (item) this.values.moneyAttribute = item.label
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

            printTemplate () {
                getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.$route.params.relevancyId}).then(res => {
                    if (res) this.$refs.printTemp.printTemplate (res)
                })
            },

            updataRouter () {
                if (this.$route.params) {
                    this.getIncomeTotalData ()
                    this.transform = this.$route.params.transform || {}
                    this.stutas = this.$route.params.pathName || ''
                    this.procInstId = this.$route.params.procInstId || ''
                }
                if (this.$route.params && this.$route.params.taskId) {
                    this.getDetailsList (this.$route.params.taskId)
                }
                if (this.$route.params && this.$route.params.relevancyId) {
                    this.getAddIncomeRegistered (this.$route.params.relevancyId)
                }
                if (this.$route.params && this.$route.params.addIncome) {
                    this.getIncomeAccountdPage ()
                    this.transform.isShowDetails = true
                }
            },

            getProjectCode (projectCode, projectId, projectName) { 
                this.values['projectCode'] = projectCode
                this.values['projectName'] = projectName
                this.getFormByJson ()
                this.updataRouter ()
            },
        },

        created () {
            
        },

        mounted () {
            than = this
        },

        components: {
            'qqt-table': qqtTable,
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent,
            'qqt-select': qqtSelect,
            'qqt-radio': qqtRadio,
            'print-template-by-html': printTemplateByHtml,
            'project-information-basic': projectInformationBasic,
            'fund-determination': fundDetermination,
            'bottomInformation': bottomInformation
        }
    }
</script>

<style lang='scss'>
.add-income-registered {
        .files-upload___right {
            margin-left: 120px
        }
    .project-revenue-information {
        width: 100%;
        height: 46px;
        margin: 22px;
        background: $color-project-revenue-information-bg;
        p {
            font-size: 14px;
            line-height: 46px;
            margin-left: 32px;
            color: $color-top-text-title;
            font-weight: 600;
        }
    }
    .add-purchase-request-button {
        float: right;
        top: -40px;
        background: #fff;
        width: 125px;
        position: relative;
        text-align: right;
    }
    .qqt-Relate-table {
        margin: -25px 0 25px 35px;
        padding-top: 0px !important
    }
    
    .qqt-container-full-content___button {
        padding: 10px;
    }
}
</style>
