<template>
        <d2-container type="fulls" class="addVehicleReimbursement">
            <el-card class="box-card closeHeader">
                <div slot="header">
                <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
            </div>
            <div class="qqt-container-full-center___top">
                <qqt-flow-tabs :procInstId="procInstId">
                        <template slot="content">
                            <fm-generate-form :data="jsonData" :remote="remote" :value="values" :transform="transform" ref="generateForm" @inputBlur="inputBlur" @on-change="selectGenerateChange" />
                            <accountant :dataInfo="dataInfoData" :addAccountingBtn="addAccountingBtn" ref="accountant" v-if="false" :isShowDetails="$route.name == 'vehicleExpenseReimbursementAccounting' ? false : transform.isShowDetails"/>
                            <bottom-information :values="values" fieldTitle="报销" timeTitle="申请" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation" />
                        </template>
                </qqt-flow-tabs>
            </div>
            <div class="qqt-container-full-content___button">
                <qqt-voucher ref="voucher" :voucherShow="voucherShow" @dialogComfirm="dialogComfirm" @dialogCancel="voucherShow=false"  :data="values" v-if="$route.name == 'vehicleExpenseReimbursementAccounting'"></qqt-voucher>
                <qqt-look-voucher ref="lookVoucher" v-else-if="$route.name !='addVehicleReimbursement' && $route.name !='vehicleExpenseReimbursementAccounting'" :data="values"></qqt-look-voucher>
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitVehicleReimbursementData (true)">重新提交</el-button>
                <el-button type="primary" v-if="stutas == 'backlog'" @click="consentFun(), values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveVehicleReimbursement">保存</el-button>
                <el-button type="primary" v-if="!transform.isShowDetails && procInstId === ''" @click="values['flag'] = '1', submitVehicleReimbursementData (false)">提交</el-button>
                <el-button @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataVehicleReimbursement"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentVehicleReimbursement" />
    </d2-container>
</template>

<script>
    import { mapActions } from 'vuex'
    import util from '@/libs/util.js'
    import { getDetails } from '@/api/approval/common'
    import { CITYJSON } from '../../../../../enum/CTIYS'
    import { ADMINISTRATIVEMANAGEMENT } from '@/enum/FORMCODE'
    import { formGetJson } from '@/api/system/fromManagement/index'
    import { getVehicleReimbursementById, editVehicleReimbursement,
        addVehicleReimbursement, submitVehicleReimbursement, completeVehicleReimbursement, resetSubmitVehicleReimbursement } from '../../../../../api/administrativeManagement/vehicleManagement/vehicleExpenseReimbursement'
    import { getVehicleUseRegistration } from '../../../../../api/administrativeManagement/vehicleManagement/vehicleUseRegistration'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, upload, qqtRelateTable, qqtInput,qqtLookVoucher,qqtVoucher } from '@/components/qqt-subassembly'
    import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
    import accountant from '../../../../approval/components/pushPage/projectCashRequest/components/accountant'
    let that = this
    export default {

        data () {
            return {
                voucherShow: false,
                title: '',
                stutas: '',
                procInstId: '',
                values: {
                    roadHaul: '0',
                },
                addAccountingBtn: false,
                dataInfoData: [],
                remote: {},
                departmentNameArr: [],
                licensePlateNumberArr: [],
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
                processModuleId: ADMINISTRATIVEMANAGEMENT.VEHICLEEXPENSEREIMBURSEMENT,
                upLoadFileDefaultList: [],
                departmentList: []
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
            //  同意
            consentFun () {
                // if (this.$route.name == 'vehicleExpenseReimbursementAccounting') {
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

            // 根据车牌号获取车辆所有的信息
            getAllLicensePlateNumberEvent () {
                getVehicleUseRegistration ().then ( res => {
                    if (res && res.length > 0 ) {
                        res.forEach( m => {
                            m.initialPosition = JSON.parse (m.initialPosition)
                        })
                        this.licensePlateNumberArr = res
                        this.neatenRemote ()
                    }
                }).finally(res => {
                    this.getFormByJson()
                })
            },

            selectGenerateChange (id, value, model) {
                switch (id) {
                    case 'licensePlateNumber' :
                    this.licensePlateNumberArr.forEach(item => {
                        if(item.id === value){
                            const { natureVehicle, vehicleUser, vehicles, displacement, transportTime, initialPositionList,
                                   startMileage, driver, withStaff, carFor, fillOilStandard } = item
                            let data = { natureVehicle, vehicleUser, vehicles, displacement, transportTime, initialPositionList, startMileage, driver, withStaff, carFor, fillOilStandard }
                            Object.assign (model, data)
                            model.id = null
                            model.vehicleUser = item.createName
                            model.fillOilStandard = item.allowances
                            model.licensePlateNumber = item.licensePlateNumber
                            model.atMileage = ''
                            this.values = model
                            this.values.roadHaul = '0'
                            this.values.oilFillingCost = '0'
                            switch (this.values.natureVehicle) {
                                case '1' :
                                    this.values.natureVehicle = '公司车辆'
                                    break
                                case '2' :
                                    this.values.natureVehicle = '个人车辆'
                                    break
                                case '3':
                                    this.values.natureVehicle = '社会车辆'
                                    break
                                case '4':
                                    this.values.natureVehicle = '其它'
                                    break
                            }
                            this.prossValue.title = `车辆使用申请:【 ${item.licensePlateNumber} 】`
                        }
                    })
                    break
                    
                    case 'finalPositionList': 
                        let str = ''
                        if (value instanceof Array) {
                            value.forEach (res => {
                                str += res + ','
                            })
                            this.values['finalPositionList'] = value
                        }
                        this.values['position'] = str.substring (0, str.length - 1)
                    break

                    case 'departmentName' :
                        this.departmentNameArr.forEach(item => {
                            if(item.id === value){
                                this.values.departmentId = item.id
                                this.values.departmentName = item.name
                            }
                        })
                    break
                    case 'toll' :
                    case 'parkingFee' :
                    case 'pontage' :
                    case 'otherCharges' :
                        model.toll = Number(model.toll) < 0 ? '0' : model.toll
                        model.parkingFee = Number(model.parkingFee) < 0 ? '0' : model.parkingFee
                        model.pontage = Number(model.pontage) < 0 ? '0' : model.pontage
                        model.otherCharges = Number(model.otherCharges) < 0 ? '0' : model.otherCharges
                        model.summation = Number(model.toll) + Number(model.parkingFee) + Number(model.pontage) + Number(model.otherCharges) + Number(model.oilFillingCost)
                        model.totalCapital = util.convertCurrency(model.summation)
                    break
                } 
            },

            inputBlur (id, value, model) {
                switch (id) { 
                    case 'atMileage' :
                        model.atMileage = Number(model.atMileage).toFixed (2)
                        if (model.atMileage && model.startMileage) {
                            model.roadHaul = (Number(model.atMileage) - Number(model.startMileage)).toFixed (2)
                        }
                        if (Number (model.roadHaul) >= 0) {
                            if (model.roadHaul && model.fillOilStandard) {
                                model.oilFillingCost = ( Number(model.roadHaul) * Number(model.fillOilStandard) ).toFixed (2)
                                model.toll = Number(model.toll) < 0 ? '0' : model.toll
                                model.parkingFee = Number(model.parkingFee) < 0 ? '0' : model.parkingFee
                                model.pontage = Number(model.pontage) < 0 ? '0' : model.pontage
                                model.otherCharges = Number(model.otherCharges) < 0 ? '0' : model.otherCharges
                                model.summation = ( Number(model.toll) + Number(model.parkingFee) + Number(model.pontage) + Number(model.otherCharges) + Number(model.oilFillingCost) ).toFixed (2)
                                model.totalCapital = util.convertCurrency(model.summation)
                            }
                        } else {
                            this.$message.warning ('终点里程不能小于起始里程')
                            model.atMileage = model.roadHaul = model.oilFillingCost = 0
                        }
                        break
                }
            },
            // 获取页面数据
            getVehicleReimbursement (id) {
                getVehicleReimbursementById ({'id': id}).then (res => {
                    if (res) {
                        this.values = JSON.parse(JSON.stringify(res))
                        this.values.initialPosition = JSON.parse(this.values.initialPosition)
                        this.values.roadHaul = Number(this.values.roadHaul)
                        this.values.fillOilStandard = Number(this.values.fillOilStandard)
                        this.values.oilFillingCost = Number(this.values.oilFillingCost)
                        this.values.toll = Number(this.values.toll)
                        this.values.parkingFee = Number(this.values.parkingFee)
                        this.values.pontage = Number(this.values.pontage)
                        this.values.paymentMoney = this.values.paymentMoney + ''
                        const { paymentName: name, bankName: openingBank, paymentAccount: account, paymentMoney: money } = this.values
                        let data = { name, openingBank, account, money }
                        this.dataInfoData.push (data)
                        this.fileDefaultNeaten (res)
                    }
                })
            },

            saveVehicleReimbursement () {
                let url = '', boolean = {}, info = {}
                info = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && boolean && info) {
                        Object.assign (this.values, data, info)
                        this.values.otherCharges = Number(this.values.otherCharges)
                        this.values.parkingFee = Number(this.values.parkingFee)
                        this.values.pontage = Number(this.values.pontage)
                        this.values.toll = Number(this.values.toll)
                        this.values.initialPosition = JSON.stringify (this.values.initialPosition)
                        if(!this.values.fileList) {
                            this.$message.warning ('请上传附件，附件中需要上传车辆初始里程和结束里程')
                            return
                        } 
                        this.values.id == null ? url = addVehicleReimbursement : url = editVehicleReimbursement
                        url (this.values).then (res => {
                            if (res.code === 200) {
                                this.$message.success ('保存成功')
                                this.closePageTag ()
                            }
                        })
                    }
                })
            },

            submitVehicleReimbursementData () {
                let info = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && info) {
                        Object.assign (this.values, data, info )
                        let str = ''
                        if (this.values['finalPositionList'] instanceof Array) {
                            this.values['finalPositionList'].forEach (res => {
                                str += res + ','
                            })
                        }
                        this.values['position'] = str.substring (0, str.length - 1)
                        this.values.otherCharges = Number(this.values.otherCharges)
                        this.values.parkingFee = Number(this.values.parkingFee)
                        this.values.pontage = Number(this.values.pontage)
                        this.values.toll = Number(this.values.toll)
                        this.dialogVisible = true
                        this.prossValue = {
                            title: this.$route.params.title || `车辆费用报销:【 ${this.values.licensePlateNumber} 】`,
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.params.degree || '',
                            msg: '',
                        }
                    }
                })
            },

            updataVehicleReimbursement (item, boolean) {
                let url = ''
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                this.values.initialPosition = JSON.stringify (this.values.initialPosition)
                if(!this.values.fileList) {
                    this.$message.warning ('请上传附件，附件中需要上传车辆初始里程和结束里程')
                    return
                } 
                boolean ? url = resetSubmitVehicleReimbursement : url = submitVehicleReimbursement
                url (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closePageTag ()
                    }
                })
            },

            consentVehicleReimbursement (item = '', boolean = false) {
                let list = []
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closePageTag ()
                    return
                }
                if (this.$route.name == 'vehicleExpenseReimbursementAccounting') {
                    list = this.$refs.accountant.getData()
                    this.values.paymentName = list[0].name
                    this.values.bankName = list[0].openingBank
                    this.values.paymentAccount = list[0].account
                    this.values.paymentMoney = list[0].money
                }
                if (item) {
                    this.values['completeTask'] = item
                    this.values.initialPosition = JSON.stringify (this.values.initialPosition)
                    completeVehicleReimbursement (this.values).then (res => {
                        if (this.$route.name == 'vehicleExpenseReimbursementCashier' && item.type == '1') {
                            this.$refs.lookVoucher.CNEdit();
                        }
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

            closePageTag () {
                let tagName = this.$route.path
                let path = ``
                this.stutas ? path = `/approval/${this.stutas}` : path = `/administrativeManagement/vehicleManagement/vehicleExpenseReimbursement`
                this.close ({ tagName, path })
            },

            upLoadFileCallBack (item) {
                this.values.fileList = item
            },

            neatenRemote () {
                this.remote = {
                    getLicensePlateNumber (resolve) {
                        resolve(that.licensePlateNumberArr)
                    },
                    getInitialPosition (resolve) {
                        resolve (CITYJSON)
                    },
                    getDepartmentName (resolve) {
                        resolve(that.departmentNameArr)
                    }
                }
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
                    this.getAllLicensePlateNumberEvent ()
                    this.transform = this.$route.params.transform || {}
                    this.stutas = this.$route.params.pathName || ''
                    this.procInstId = this.$route.params.procInstId || ''
                }
                if (this.$route.params && this.$route.params.taskId) {
                    this.getDetailsList (this.$route.params.taskId)
                }
                if (this.$route.params && this.$route.params.relevancyId) {
                    this.getVehicleReimbursement (this.$route.params.relevancyId)
                }
                if (this.$route.name != 'addVehicleReimbursement') this.isShowAccounting = true
                
            }
        },

        created () {
            this.updataRouter ()
        },

        mounted () {
            that = this
        },

        components: {
            'qqt-input': qqtInput,
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent,
            'accountant': accountant,
            'up-load': upload,
            qqtLookVoucher,
            qqtVoucher,
            'bottom-information': bottomInformation
        }
    }
</script>

<style lang='scss'>
    .addVehicleReimbursement {
        .files-upload___right {
            margin-left: 120px
        }
    }
</style>
