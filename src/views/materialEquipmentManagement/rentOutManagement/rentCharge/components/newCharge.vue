<template>
    <d2-container type="fulls" class="newCharge">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
            </div>
            <div class="qqt-container-full-center___top">
                <qqt-flow-tabs :procInstId="procInstId">
                    <template slot="content">
                        <div v-if="addShow">
                            <fm-generate-form  :data="jsonData" :remote="remote" :value="values" :transform="transform" ref="generateForm" @btn-click="btnClick" @on-change="selectGenerateChange">
                                <template slot="file">
                                    <div class="files-upload___right">
                                        <up-load id="male" @upLoadFileCallBack="upLoadFileCallBack" :isShowUpload="!transform.isShowDetails" :propList="upLoadFileDefaultList" ref="upLoad" />
                                    </div>
                                </template>
                            </fm-generate-form>
                            <bottomInformation :values="values" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
                        </div>
                        <div v-else>
                            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                                <el-tab-pane label="基本信息" name="first">
                                    <fm-generate-form  :data="jsonData" :remote="remote" :value="values" :transform="transform" ref="generateForm" @btn-click="btnClick" @on-change="selectGenerateChange">
                                        <template slot="file">
                                            <div class="files-upload___right">
                                                <up-load id="male" @upLoadFileCallBack="upLoadFileCallBack" :isShowUpload="!transform.isShowDetails" :propList="upLoadFileDefaultList" ref="upLoad" />
                                            </div>
                                        </template>
                                    </fm-generate-form>
                                    <bottomInformation :values="values" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
                                </el-tab-pane>
                                <el-tab-pane label="租金收取记录" name="second">
                                    <qqt-table :pageShow="pageShow" :isShowSelection="isShowSelection" :data="tableData" ref="table" :rowHeader="rowHeader" :option="tableOption"></qqt-table>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                    </template>
                </qqt-flow-tabs>
            </div>
            <div class="qqt-container-full-content___button">
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitNewChargeData ()">重新提交</el-button>
                <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveNewCharge">保存</el-button>
                <el-button type="primary" v-if="!transform.isShowDetails && procInstId === '' && $has('material:rental:collect:submit')" @click="values['flag'] = '1', submitNewChargeData ()">提交</el-button>
                <el-button @click="closePageTag">关闭</el-button>
            </div>
            <fund-determination :dialogVisible='dialogVisible' :option="tableOption" @closeDialog='closeDialog' @getData='getDialogData'></fund-determination>
        </el-card>
    </d2-container>
</template>

<script>
    import { getNewChargeById, editNewCharge,  addNewCharge, submitNewCharge, getChargeList } from '@/api/materialEquipmentManagement/rentOutManagement/rentCharge/index'
    import { rentalOrderList } from '@/api/materialEquipmentManagement/rentOutManagement/rentOutOrder/index'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, upload, qqtRelateTable, qqtTable } from '@/components/qqt-subassembly'
    import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
    import fundDetermination from '../../../../projectManagement/jontProjectDetail/cashDepositManagement/components/fundDetermination'
    import { formGetJson } from '@/api/system/fromManagement/index'
    import { MATERIALEQUIPMENTMANAGEMENT } from '@/enum/FORMCODE'
    import { getDetails } from '@/api/approval/common'
    import { mapActions } from 'vuex'
    import util from '@/libs/util.js'
    let than = this
    export default {

        data () {
            return {
                title: '',
                stutas: '',
                procInstId: '',
                remote: {},
                values: {
                    orderCode: '',
                    affirmId: '',
                    //  付款信息
                    paymentAccount: '',
                    paymentBank: '',
                    paymentNumber: '',
                    paymentAmount: '',
                    paymentDate: '',
                    paymentMessage: '',
                    //  收款信息
                    proceedsAccount: '',
                    proceedsBank: '',
                    proceedsNumber: '',
                    proceedsWay: '',
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
                processModuleId: MATERIALEQUIPMENTMANAGEMENT.NEWCHARGE,
                upLoadFileDefaultList: [],
                orderList: [],
                addShow: true,
                activeName: 'first',
                tableData: {},
                tableOption: {},
                pageShow: false,
                isShowSelection: false,
                rowHeader: [
                    {
                        prop: 'orderName',
                        label: '出租单名称',
                        width: '200',
                        isShow: true,
                    },{
                        prop: 'paymentAccount',
                        label: '付款账户',
                        width: '120',
                        isShow: true,
                        render: (h, parms) => {
                            return h('p', {}, parms.row.paymentAccount)
                        }
                    },{
                        prop: 'paymentBank',
                        label: '付款账户户行',
                        isShow: true,
                    },{
                        prop: 'proceedsWay',
                        label: '付款方式',
                        width: '100',
                        isShow: true,
                    },{
                        prop: 'paymentAmount',
                        label: '付款金额',
                        width: '100',
                        isMoney: true,
                        isShow: true,
                    },{
                        prop: 'proceedsAccount',
                        label: '收款账户',
                        width: '120',
                        isShow: true,
                    },{
                        prop: 'proceedsBank',
                        label: '收款账户户行',
                        isShow: true
                    },{
                        prop: 'createName',
                        label: '登记人',
                        width: '100',
                        isShow: true,
                    },{
                        prop: 'createTime',
                        label: '登记时间',
                        width: '180',
                        isShow: true,
                    },
                ],
            }
        },

        methods: {

            ...mapActions('d2admin/page', [
                'close',
            ]),

            selectGenerateChange(field, value, model) {
                switch (field) {
                    case 'orderId':
                        let temp = this.orderList.find(el => el.id === value)
                        if(temp) {
                            this.values['orderName'] = temp.rentalOrderName
                            this.values.orderCode = temp.rentalOrderNumber
                        }
                        break
                    default:
                        break
                }
            },
            
            handleClick(tab, event) {
                console.log(tab, event);
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
                if(!this.$route.params.transform.isShowDetails) {
                    this.dialogVisible = false
                }
            },

            getDialogData (data) {
                this.values['affirmId'] = data.id
                //  付款信息
                this.values.paymentAccount = data.payaccount
                this.values.paymentBank = data.paybank
                this.values.paymentNumber = data.paynum
                this.values.paymentAmount = data.gatheringamount
                this.values.paymentDate = data.createdbytime
                this.values.paymentMessage = data.paymark
                //  收款信息
                this.values.proceedsAccount = data.companycollection
                this.values.proceedsBank = data.gatheringbank
                this.values.proceedsNumber = data.gatheringaccount
                this.values.proceedsWay = data.gatheringway

                this.dialogVisible = false
            },

            getFormByJson () {
                formGetJson ({ 'code': this.processModuleId }).then(res => {
                    if (res) this.jsonData = JSON.parse(res)
                })
            },

            getNewCharge (id) {
                getNewChargeById ({'id': id}).then (res => {
                    if (res) {
                        res.paymentAmount = res.paymentAmount + ''
                        this.values = res
                        this.fileDefaultNeaten (res)
                        this.getHistory(res.orderId)
                    } 
                })
            },

            getHistory (id) {
                getChargeList({orderId: id}).then(res => {
                    this.tableData = { records: res }
                })
            },

            saveNewCharge () {
                let url = ''
                let item = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data) {
                        Object.assign (this.values, data, item)
                        this.values.id == null ? url = addNewCharge : url = editNewCharge
                        url (this.values).then (res => {
                            if (res.code === 200) {
                                this.$message.success ('保存成功')
                                this.closePageTag ()
                            }
                        })
                    }
                })
            },

            submitNewChargeData () {
                let item = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data) {
                        Object.assign (this.values, data, item)
                        submitNewCharge(this.values).then (res => {
                            if (res.code === 200) {
                                this.$message.success (res.message)
                                this.closePageTag ()
                            }
                        })
                    }   
                })
            },

            updataNewCharge (item, boolean) {
                let url = ''
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                boolean ? url = resetSubmitNewCharge : url = submitNewCharge
                url (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closePageTag ()
                    }
                })
            },

            consentNewCharge (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closePageTag ()
                    return
                }
                if (item) {
                    this.values['completeTask'] = item
                    completeNewCharge (this.values).then (res => {
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
                this.$router.go(-1)
                let tagName = this.$route.path
                let path = `materialEquipmentManagement/rentOutManagement/rentCharge`
                // this.stutas ? path = `/approval/${this.stutas}` : path = `materialEquipmentManagement/rentOutManagement/rentCharge`
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
                    this.getNewCharge (this.$route.params.relevancyId)
                }
            },

            getList () {
                rentalOrderList({ 'procState' : '10' }).then(res => {
                    this.orderList = res
                    this.setRemote ()
                })
            },

            setRemote () {
                this.remote = {
                    getOrder (resolve) { resolve(than.orderList) }
                }
            }
        },

        created () {
            this.addShow = this.$route.params.isAdd ? true : false
            this.getFormByJson ()
            this.updataRouter ()
            this.getList ()
        },

        mounted () {
            than = this
        },

        components: {
            qqtTable,
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent,
            'up-load': upload,
            'fund-determination': fundDetermination,
            'bottomInformation': bottomInformation
        }
    }
</script>

<style lang='scss'>
    .newCharge {
        .files-upload___right {
            margin-left: 120px
        }
    }
</style>
