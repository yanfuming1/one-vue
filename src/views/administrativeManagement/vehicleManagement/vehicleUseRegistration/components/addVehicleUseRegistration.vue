<template>
    <d2-container type="fulls">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closeTag"><i class="el-icon-close"></i></el-button>
            </div>
        <div class="qqt-container-full-center___top">
            <qqt-flow-tabs :procInstId="procInstId">
                <template slot="content"> 
                    <fm-generate-form
                        :data="jsonData"
                        :remote="remoteFuncs"
                        :value="values"
                        @on-change="selectGenerateChange"        
                        :transform="transform"
                        ref="generateForm"/>
                    
                    <bottom-information :values="values" fieldTitle="申请" timeTitle="申请" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation" />
                </template>
            </qqt-flow-tabs>
        </div>

            <div class="operation-button">
                <el-button size="mini" type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submissionRegistrationUse (true)">重新提交</el-button>
                <el-button size="mini" type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button size="mini" type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button size="mini" type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button size="mini" type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button size="mini" type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveRegistrationUse">保存</el-button>
                <el-button size="mini" type="primary" v-if="!transform.isShowDetails && procInstId === ''" @click="values['flag'] = '1', submissionRegistrationUse (false)">提交</el-button>
                <el-button type="info" size="mini" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                <el-button size="mini" @click="closeTag">关闭</el-button>
            </div>
        </el-card>
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="submitAdjustmentApproval"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentUsingApplication" />

    </d2-container>
</template>

<script>
    import util from '@/libs/util.js'
    import { mapActions } from 'vuex'
    import { CITYJSON } from '../../../../../enum/CTIYS'
    import { formGetJson } from '../../../../../api/system/fromManagement/index'
    import { getDetails } from '../../../../../api/approval/common'
    import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
    import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
    import { ADMINISTRATIVEMANAGEMENT } from '../../../../../enum/FORMCODE'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, upload } from '../../../../../components/qqt-subassembly'
    import { vehicleUseRegistrationList, getAllLicensePlateNumber, addVehicleUseRegistration, vehicleUseRegistrationQueryById, editVehicleUseRegistration,
        submitVehicleUseRegistration, vehicleUseRegistrationOperation } from '../../../../../api/administrativeManagement/vehicleManagement/vehicleUseRegistration'
    import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation' 
    import printTemplateByHtml from '@/views/systemManagement/printTemplate/components/printTemplateByHtml'

    let that = this
    export default {

        name: 'addVehicleUseRegistration',
        data () {
            let that = this
            return {
                isAdd: false,
                values:{},
                jsonData: {},
                remark:'',
                remoteFuncs: {
                    getLicensePlateNumber (resolve) {
                        resolve(that.licensePlateNumberArr)
                    },
                    getInitialPosition (resolve) {
                        resolve (CITYJSON)
                    }
                },
                licensePlateNumberArr: [],

                transform: {
                    isShowDetails: false
                },
                
                upLoadFileDefaultList: [],

                // // 保存
                // saveData:{},

                // 提交
                dialogVisible: false,
                processModuleId: ADMINISTRATIVEMANAGEMENT.ADDVEHICLEUSEREGISTRATION,
                isSendBack: false,
                prossValue: {
                    title: ''
                }, 
                
                // 流程
                stutas:'',
                procInstId: '',
                nodeData: {
                    operation: '',
                    msg:''
                },
                visible: false,
                isReject: false,
                isTurnManage: false,
                
                code: BASICSCODE.ADMIN_VEHICLE_REGISTRATION
            }
        },

        methods: {

            getFormByJson () {
                formGetJson ({'code': ADMINISTRATIVEMANAGEMENT.ADDVEHICLEUSEREGISTRATION}).then(res => {
                    if (res) {
                        this.jsonData = JSON.parse(res)
                    }
                })
            },

            // 获取所有车牌号
            getAllLicensePlateNumberEvent () {
                getAllLicensePlateNumber ().then ( res => {
                    if (res && res.length > 0 ) {
                        this.licensePlateNumberArr = res
                    }
                }).finally(res => {
                    this.getFormByJson()
                })
            },

            // 表单下拉数据操作
            selectGenerateChange (id, value, model) {
                switch (id) {
                    case 'licensePlateNumbers' :
                    this.licensePlateNumberArr.forEach(item => {
                        if(item.id === value){
                            model.licensePlateNumber = item.licensePlateNumber
                            model.natureVehicle = item.natureVehicle
                            model.vehicles = item.vehicles
                            model.displacement = item.displacement
                            this.values = model
                            switch (this.values.natureVehicle) {
                                case '1' :
                                    this.values.natureVehicle = '公司车辆'
                                break
                                case '2' :
                                    this.values.natureVehicle = '个人车辆'
                                break
                            }
                            this.prossValue.title = `车辆使用申请:【 ${item.licensePlateNumber} 】`
                        }
                    })
                    break
                } 
            },
     
            getDetailsList (taskId) {
                getDetails (taskId).then (res => {
                    if (res) {
                        this.nodeData = res
                    }
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
                    this.getVehicleUseRegistrationQueryById (this.$route.params.relevancyId)
                }
            },

            getVehicleUseRegistrationQueryById (id) {
                vehicleUseRegistrationQueryById({
                    id: id
                }).then( res => {
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
                    this.values = res
                    this.values.startMileage = Number(this.values.startMileage)
                    this.values.licensePlateNumbers = res.licensePlateNumber
                    this.prossValue.title = `车辆使用申请:【 ${res.licensePlateNumber} 】`
                })
            },
            
            upLoadFileCallBack (item) {
                this.values.fileList = item
            },

            // 保存 && 编辑
            saveRegistrationUse () {
                let info = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData().then(item => {
                    if (!item || !info) return
                    Object.assign(this.values, item, info)
                    if(this.$route.params.isAdd){
                        // 保存
                        item.licensePlateNumber = this.values.licensePlateNumber
                        addVehicleUseRegistration(this.values).then( res => {
                            this.$message.success("保存成功")
                            this.closeTag()
                        }).catch(err => {
                            this.$message.error("保存失败")
                        })

                    } else {
                        // 编辑
                        item.id = this.values.id
                        editVehicleUseRegistration(this.values).then( res => {
                            this.$message.success("编辑成功")
                            this.closeTag()
                        }).catch( err => {
                            this.$message.error("编辑失败")
                        })
                    }
                    
                })
                
            },

            // 提交
            submissionRegistrationUse (boolean) {
                let info = this.$refs.bottomInformation.getData()
                this.$refs.generateForm.getData().then(item => {
                    if (item && info) {
                        Object.assign (this.values, item, info)
                        this.dialogVisible = true
                        if (boolean) {
                            this.prossValue = {
                                title: this.$route.params.title || '',
                                pdfId: this.$route.params.procDefId || '',
                                degree: this.$route.params.degree || '',
                                msg: '',
                            }
                        }
                    }
                })
            },

            // 确认提交
            submitAdjustmentApproval (item, boolean) {
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                this.values.licensePlateNumber = this.values.licensePlateNumber
                if (boolean) {
                    vehicleUseRegistrationOperation (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success (res.message)
                            this.closeTag ()
                        }
                    })
                } else {
                    submitVehicleUseRegistration (this.values).then( res => {
                        if (res.code === 200) {
                            this.$message.success(res.message)
                            this.closeTag ()
                        }
                    })
                }
            },

            // 流程操作
            consentUsingApplication (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closeTag ()
                    return
                }
                if (item) {
                    this.values['completeTask'] = item
                    vehicleUseRegistrationOperation (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success (res.message)
                            this.closeTag ()
                        }
                    })
                }
            },
            
            printTemplate () {
                getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.$route.params.relevancyId}).then(res => {
                    if (res) this.$refs.printTemp.printTemplate (res)
                })
            },

            closeTag () {
                let tagName = this.$route.path
                let path = ''
                this.stutas ? path = `/approval/${this.stutas}` : path = `/administrativeManagement/vehicleManagement/vehicleUseRegistration`
                this.close ({ tagName, path })
            },

            ...mapActions('d2admin/page', [
                'close' 
            ]),
            
        },

        created () {

            this.getAllLicensePlateNumberEvent ()

            this.updataRouter ()
        },

        mounted () {

        },

        components: {
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent,
            'up-load': upload,
            'bottom-information': bottomInformation,
            'print-template-by-html': printTemplateByHtml
        },

        watch: {
        }
    }
</script>


<style lang='scss' scoped>
    .add-resignation-application{
        background: #ffffff
    }
    .operation-button{
        margin: 0 auto;
        text-align: center;
        margin-top: 12px
    }
    .scrap-record-info___upload {
        padding: 20px 30px;
        .scrap-record-info___label {
            font-size: 14px;
            float: left;
            margin: 0 16px;
            color: $input-disable
        }
        .scrap-record-info__right {
            margin-left: 90px
        }
    }
</style>
