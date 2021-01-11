<template>
    <d2-container type="fulls" class="add-payment-deposit">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
            </div>
            <div class="qqt-container-full-center___top">
                <qqt-flow-tabs :procInstId="procInstId">
                    <template slot="content">
                        <fm-generate-form 
                            :data="jsonData"
                            :remote="remote"
                            :value="values"
                            :transform="transform"
                            ref="generateForm"
                            @on-change="selectGenerateChange"
                        >
                            <template slot="bankInfo">
                                <collect-bank :getSize="'medium'" class="collect-bank-height" labelWidth="130px" ref="collectBank" :selectData="collectUnitAccount" :data="bankData" :isShowDetails="transform.isShowDetails"></collect-bank>
                            </template>
                        </fm-generate-form >
                        <accountant :isShowDetails="isShowAccounting ? false : true" :dataInfo="values" ref="accountant" v-if="isShowAccounting"></accountant>
                        <bottom-information :values="values" :fieldTitle="'申请'" :timeTitle="'申请'" :transform="transform" ref="bottomInformation" />
                    </template>
                </qqt-flow-tabs>
            </div>
            <div class="qqt-container-full-content___button">
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitPaymentDepositData ()">重新提交</el-button>
                <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="savePaymentDeposit">保存</el-button>
                <el-button type="primary" v-if="!transform.isShowDetails && procInstId === ''" @click="values['flag'] = '1', submitPaymentDepositData ()">提交</el-button>
                <el-button @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataPaymentDeposit"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentPaymentDeposit" />
    </d2-container>
</template>

<script>
    import { getPaymentDepositById, editPaymentDeposit,
             addPaymentDeposit, submitPaymentDeposit, completePaymentDeposit, resetSubmitPaymentDeposit } from '@/api/selfProject/payReturnDeposit'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, upload, qqtRelateTable } from '@/components/qqt-subassembly'
    import { PURCHASEREQUEST, PROPRIETARYPROJECTDICTIONARY } from '@/enum/DICTIONARY'
    import { getByAccountTypeListAll} from '../../../../../api/jointProject/index'
    import { formGetJson } from '@/api/system/fromManagement/index'
    import { getUserDepartById } from '@/api/system/depart/depart'
    import { queryDicByIds } from '@/api/system/dic/dic'
    import { PROPRIETARYPROJECT } from '@/enum/FORMCODE'
    import { getDetails } from '@/api/approval/common'
    import { mapActions } from 'vuex'

    import collectBank from '../../../jontProjectDetail/components/collectBank'
    import bottomInformation from '../../businessBidding/components/bottomInformation'
    import accountant from '../../../../approval/components/pushPage/projectCashRequest/components/accountant'
    import util from '@/libs/util.js'
    let than = this
    export default {

        data () {
            return {
                title: '',
                stutas: '',
                procInstId: '',
                remote: {},
                values: {},
                jsonData: {},
                nodeData: {
                    operation: '',
                    msg: ''
                },
                bankData: {
                    name: '',
                    openingBank: '',
                    account: '',
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
                isShowAccounting: false,
                processModuleId: PROPRIETARYPROJECT.ADDPAYMENTDEPOSIT,
                upLoadFileDefaultList: [],
                collectUnitAccount: [],
                cashDeposit: [],
                section: []

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

            getPaymentDeposit (id) {
                getPaymentDepositById ({'id': id}).then (res => {
                    if (res) {
                        Object.assign (this.values, res)
                        this.prossValue.title = `保证金缴纳:【 ${this.values.premiumReceived} 元】`
                        this.fileDefaultNeaten (res)
                    }
                })
            },

            savePaymentDeposit () {
                let url = '', boolean = {}
                this.$refs.generateForm.getData ().then (data => {
                    if (data && boolean) {
                        Object.assign (this.values, data)
                        this.values.id == null ? url = addPaymentDeposit : url = editPaymentDeposit
                        url (this.values).then (res => {
                            if (res.code === 200) {
                                this.$message.success ('保存成功')
                                this.closePageTag ()
                            }
                        })
                    }
                })
            },

            submitPaymentDepositData () {
                let list = this.$refs.materials.verify ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && list) {
                        Object.assign (this.values, data)
                        this.dialogVisible = true
                        this.prossValue = {
                            title: this.$route.params.title || `保证金缴纳:【 ${this.values.premiumReceived} 元】`,
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.params.degree || '',
                            msg: '',
                        }
                    }
                })
            },

            updataPaymentDeposit (item, boolean) {
                let url = ''
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                boolean ? url = resetSubmitPaymentDeposit : url = submitPaymentDeposit
                url (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closePageTag ()
                    }
                })
            },

            consentPaymentDeposit (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closePageTag ()
                    return
                }
                if (item) {
                    this.values['completeTask'] = item
                    completePaymentDeposit (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success (res.message)
                            this.closePageTag ()
                        }
                    })
                }
            },

            getQueryDicByIdList () {
                let list = [ PURCHASEREQUEST.SECTION, PROPRIETARYPROJECTDICTIONARY.MARGINTYPE ]
                queryDicByIds (list).then (item => {
                    if (!item) return
                    this.section = item[PURCHASEREQUEST.SECTION]
                    this.cashDeposit = item[PROPRIETARYPROJECTDICTIONARY.MARGINTYPE]
                    this.updataRemote ()
                })
            },

            getCommonInfo(){
                getByAccountTypeListAll ({accountType: 3}).then (res => {
                    this.collectUnitAccount = res
                })
            },

            selectGenerateChange (field, val, models) {

            },

            getDetailsList (taskId) {
                getDetails (taskId).then (res => { if (res) this.nodeData = res })
            },

            closePageTag () {
                let tagName = this.$route.path
                let path = ``, name = 'payReturnDeposit'
                let params = { 'identifying': 'second' }
                this.stutas ? path = `/approval/${this.stutas}` : path = `/projectManagement/selfSupportProjectDetail/payReturnDeposit`
                this.close ({ tagName, path, name, params })
            },

            upLoadFileCallBack (item) {
                this.values.fileList = item
            },

            getProjectCode (projectCode) {
                this.values['projectCode'] = projectCode
            },

            updataRemote(){
                this.remote = {
                    getMarginType (resolve) { resolve(than.cashDeposit) },
                    getSection (resolve) { resolve(than.section) }
                }
                this.getFormByJson ()
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
                    this.getPaymentDeposit (this.$route.params.relevancyId)
                }
                if (this.$route.name == 'addPaymentDepositAccounts') this.isShowAccounting = true
            }
        },

        created () {
            this.getQueryDicByIdList ()
            this.getCommonInfo ()
            this.updataRouter ()
        },

        mounted () {
            than = this
        },

        components: {
            'bottom-information': bottomInformation,
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'collect-bank': collectBank,
            'qqt-consent': qqtConsent,
            'accountant': accountant
        }
    }
</script>

<style lang="scss">
    .add-payment-deposit {
        .el-form-item .el-form-item--medium {
            margin-bottom: 0px !important;
        }
    }
</style>