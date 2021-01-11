<template>
    <d2-container type="fulls" class="cashWithdrawal">
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
                        />
                        <accountant :dataInfo="values.companyPayList" ref="accountant" v-if="isShowAccounting" :isShowDetails="$route.name == 'cashWithdrawalAccount' ? false : transform.isShowDetails"/>
                        <bottomInformation :values="values" fieldTitle="申请" timeTitle="申请" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
                    </template>
                </qqt-flow-tabs>
            </div>
            <div class="qqt-container-full-content___button">
                <qqt-voucher :voucherShow="voucherShow" @dialogComfirm="dialogComfirm" @dialogCancel="voucherShow=false" ref="voucher" v-if="$route.name == 'cashWithdrawalAccount'" :data="values" ></qqt-voucher>
                <qqt-look-voucher ref="lookVoucher" v-else-if="stutas == 'backlog'" :data="values"></qqt-look-voucher>
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitCashWithdrawalData ()">重新提交</el-button>
                <el-button type="primary" v-if="stutas == 'backlog'" @click="consentFun(), values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveCashWithdrawal">保存</el-button>
                <el-button type="primary" v-if="!transform.isShowDetails && procInstId === ''" @click="values['flag'] = '1', submitCashWithdrawalData ()">提交</el-button>
                <el-button @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataCashWithdrawal"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentCashWithdrawal" />
    </d2-container>
</template>

<script>
    import { addCashWithdrawal, poolOfJointVentureFunds, capitalAccountList, getCashWithdrawalById, 
                editCashWithdrawal, completeCashWithdrawal, submitCashWithdrawal, resetSubmitCashWithdrawal } from "@/api/customerManagement/capitalAccount"
    import { qqtSendProcess, qqtFlowTabs, qqtConsent,qqtLookVoucher,qqtVoucher } from '@/components/qqt-subassembly'
    import { formGetJson } from '@/api/system/fromManagement/index'
    import { getUserDepartById } from '@/api/system/depart/depart'
    import { CUSTOMERAUTHORIZATIONFORM } from '@/enum/FORMCODE'
    import { getDetails } from '@/api/approval/common'
    import { mapActions, mapState } from 'vuex'

    import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
    import accountant from '../../../../approval/components/pushPage/projectCashRequest/components/accountant'
    import util from '@/libs/util.js'
    let than = this
    export default {

        data () {
            return {
                voucherShow: false,
                title: '',
                stutas: '',
                procInstId: '',
                remote: {},
                values: {
                    transferAmount:'',
                    capitalMoneyUpper:'',
                    account: '',
                    openingBank: '',
                    balance: '',
                    money: '',
                    accountId: '',
                    capitalMoney: '',
                    departmentId: '',
                    companyPayList: [],
                    createName: util.cookies.get ('username')
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
                isShowAccounting: false,
                processModuleId: CUSTOMERAUTHORIZATIONFORM.CASHWITHDRAWAL,
                withdrawalsAccountList: [],
                departmentList: [],
                customerInforId: ''
            }
        },

        methods: {

            ...mapActions('d2admin/page', [
                'close',
            ]),
            dialogComfirm () {
                this.$refs.voucher.comfirmData().then(res=> {
                    this.voucherShow = false;
                    this.visible = true;
                })
            },
            consentFun () {
                // if (this.$route.name == 'cashWithdrawalAccount') {
                //     this.voucherShow = true;
                // } else {
                    this.visible = true;
                // }
            },
            getFormByJson () {
                formGetJson ({ 'code': this.processModuleId }).then(res => {
                    if (res) this.jsonData = JSON.parse(res)
                })
            },

            getCashWithdrawal (id) {
                getCashWithdrawalById ({'id': id}).then (res => {
                    if (res) {
                        this.getSelectData(res.cusId)
                        this.getDepIdByUserIdList (res.createBy)
                        this.customerInforId = res.cusId
                        res['money'] = res['capitalMoney'] + ''
                        this.values = res
                        this.prossValue.title = `联营账户提现, 金额:【 ${Number (this.values.capitalMoney).toFixed (2) || 0.00}元 】`
                        this.fileDefaultNeaten (res)
                    }
                })
            },

            // 初始化获取联营人资金池数据
            getPoolOfJointVentureFunds () {
                poolOfJointVentureFunds({'cusId': this.customerInforId}).then( res => {
                    if (res) this.values.balance = res.canBalance
                })
            },

            saveCashWithdrawal () {
                let url = '', element = {}
                element = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && element) {
                        data['cusId'] = this.customerInforId
                        data['capitalMoney'] = Number.parseFloat (data['money'])
                        Object.assign (this.values, data, element)
                        this.values.id == null ? url = addCashWithdrawal : url = editCashWithdrawal
                        url (this.values).then (res => {
                            if (res.code === 200) {
                                this.$message.success ('保存成功')
                                this.closePageTag ()
                            }
                        })
                    }
                })
            },

            submitCashWithdrawalData () {
                let element = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && element) {
                        data['cusId'] = this.customerInforId
                        data['capitalMoney'] = Number.parseFloat (data['money'])
                        Object.assign (this.values, data, element)
                        this.dialogVisible = true
                        this.prossValue = {
                            title: this.$route.params.title || `联营账户提现, 金额:【 ${Number (this.values.capitalMoney).toFixed (2) || 0.00}元 】`,
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.params.degree || '',
                            msg: '',
                        }
                    }
                })
            },

            updataCashWithdrawal (item, boolean) {this.values
                let url = ''
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                boolean ? url = resetSubmitCashWithdrawal : url = submitCashWithdrawal
                url (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closePageTag ()
                    }
                })
            },

            consentCashWithdrawal (item = '', boolean = false) {
                let list = []
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closePageTag ()
                    return
                }
                if (this.$route.name == 'cashWithdrawalAccount') {
                    list = this.$refs.accountant.getData()
                }
                if (item) {
                    this.values['completeTask'] = item
                    list.length > 0 ? this.values['companyPayList'] = list : 0
                    completeCashWithdrawal (this.values).then (res => {
                        if (this.$route.name == 'cashWithdrawalCashier' && item.type =="1") {
                            this.$refs.lookVoucher.CNEdit();
    
                        }
                        if (res.code === 200) {
                            this.$message.success (res.message)
                            this.closePageTag ()
                        }
                    })
                }
            },

            getDepIdByUserIdList (id) {
                getUserDepartById({'userId': id}).then(res => {
                    if (res && res.length > 0) this.departmentList = res, this.neatanRemote ()
                    if (res.length == 1) this.values.departmentId = res[0].id, this.values['departmentName'] = res[0].name
                })
            },

            getSelectData (id) {
                capitalAccountList({id: id}).then (res => {
                    if (res && res.length > 0) this.withdrawalsAccountList = res, this.neatanRemote ()
                })
            },

            getDetailsList (taskId) {
                getDetails (taskId).then (res => { if (res) this.nodeData = res })
            },

            closePageTag () {
                let tagName = this.$route.path
                let path = ``
                this.stutas ? path = `/approval/${this.stutas}` : path = `/customerManagement/myCustomer/capitalAccount/0`
                this.close ({ tagName, path })
            },

            upLoadFileCallBack (item) {
                this.values.fileList = item
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

            neatanRemote () {
                this.remote = {
                    getdepartmentList (resolve) {
                        resolve (than.departmentList)
                    },
                    getWithdrawalsAccount (resolve) {
                        resolve (than.withdrawalsAccountList)
                    }
                }
            },

            selectGenerateChange (field, val, model) {
                let item = '', str = ''
                switch (field) {
                    case 'accountId':
                        this.values['accountId'] = val
                        item = this.withdrawalsAccountList.find (f => f.id === val)
                        if (item) this.values['accountName'] = item.name, this.values.openingBank = item.openingBank, this.values.account = item.account
                        break
                    case 'departmentId':
                        this.values.departmentId = val
                        item = this.departmentList.find (f => f.id === val)
                        if (item) this.values['departmentName'] = item.name
                        break
                    case 'money':
                        this.values.money = val
                        if (Number.parseFloat (val) > Number.parseFloat (this.values.balance)) {
                            this.$message.warning ('提现金额不能大于可提现金额')
                            this.values.money = '0'
                        } else {
                            this.values.capitalMoneyUpper = util.convertCurrency (Number (val).toFixed (2))
                        }
                        break
                }
            },

            updataRouter () {
                if (this.$route.params) {
                    this.transform = this.$route.params.transform || {}
                    this.stutas = this.$route.params.pathName || ''
                    this.procInstId = this.$route.params.procInstId || ''
                    this.customerInforId = this.$route.params.customerInforId || ''
                }
                if (this.$route.params && this.$route.params.taskId) {
                    this.getDetailsList (this.$route.params.taskId)
                }
                if (this.$route.params && this.$route.params.relevancyId) {
                    this.getCashWithdrawal (this.$route.params.relevancyId)
                } else {
                    this.getDepIdByUserIdList (util.cookies.get ('uuid'))
                    this.getSelectData(this.customerInforId)
                    this.getPoolOfJointVentureFunds()
                }
                if (this.$route.name != 'cashWithdrawal') this.isShowAccounting = true
            }
        },

        created () {
            this.updataRouter ()
            this.getFormByJson ()
        },

        mounted () {
            than = this
        },

        components: {
            'bottomInformation': bottomInformation,
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent,
            'accountant': accountant,
            qqtLookVoucher,
            qqtVoucher
        }
    }
</script>

<style lang='scss'>
    .cashWithdrawal {
        .files-upload___right {
            margin-left: 120px
        }
    }
</style>
