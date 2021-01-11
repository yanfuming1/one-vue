<template>
    <d2-container type="fulls" class="addVehicleRepair">
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
                       <div class="files-upload___right">
                           <up-load id="male" @upLoadFileCallBack="upLoadFileCallBack" :isShowUpload="!transform.isShowDetails" :propList="upLoadFileDefaultList" ref="upLoad" />
                       </div>
                       <bottom-information :values="values" fieldTitle="设置" timeTitle="设置" :isShowAccessory="false" :transform="transform" ref="bottomInformation" />
                   </template>
               </qqt-flow-tabs>
           </div>
           <div class="qqt-container-full-content___button">
               <!-- <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitAddVehicleRepairData ()">重新提交</el-button> -->
               <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
               <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
               <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
               <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
               <el-button type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveAddVehicleRepair">保存</el-button>
               <el-button type="info" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
               <!-- <el-button type="primary" v-if="!transform.isShowDetails && procInstId === ''" @click="values['flag'] = '1', submitAddVehicleRepairData ()">提交</el-button> -->
               <el-button @click="closePageTag">关闭</el-button>
           </div>
       </el-card>
       <print-template-by-html v-show="false" :code="code" ref="printTemp" />
       <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataAddVehicleRepair"/>
       <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentAddVehicleRepair" />
   </d2-container>
</template>

<script>
    import { mapActions } from 'vuex'
    import { getDetails } from '@/api/approval/common'
    import { ADMINISTRATIVEMANAGEMENT } from '@/enum/FORMCODE'
    import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
    import { formGetJson } from '@/api/system/fromManagement/index'
    import { getUserDepartById } from '@/api/system/depart/depart'
    import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
    import { getSetUpVehicleRepairById, editSetUpVehicleRepair, addSetUpVehicleRepair } from '@/api/administrativeManagement/vehicleManagement/setUpVehicleRepair'
    import { getVehicleUseRegistration, getAllLicensePlateNumber } from '../../../../../api/administrativeManagement/vehicleManagement/vehicleUseRegistration'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, upload, qqtRelateTable } from '@/components/qqt-subassembly'
    import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
    import printTemplateByHtml from '@/views/systemManagement/printTemplate/components/printTemplateByHtml'

    import util from '@/libs/util.js'
    let that = this
    export default {

        data () {
            return {
                title: '',
                stutas: '',
                procInstId: '',
                remote: {
                    getDepartmentName (resolve) {
                        resolve(that.departmentNameArr)
                    },
                    getLicensePlateNumber (resolve) {
                        resolve(that.licensePlateNumberArr)
                    },
                },
                departmentNameArr: [],
                licensePlateNumberArr: [],

                values: {
                    departmentId: '',
                    departmentName: '',
                    createBy: '',
                    createName: util.cookies.get ('username'),
                    createTime: new Date().format("yyyy-MM-dd hh:mm:ss")
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
                processModuleId: ADMINISTRATIVEMANAGEMENT.STANDARDSETTINGOFCARREPAIR,
                upLoadFileDefaultList: [],
                departmentList: [],
                code: BASICSCODE.ADMIN_VEHICLE_AMENDANT_RECORD,
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

            selectGenerateChange (id, value, model) {
                switch (id) {
                    case 'licensePlateNumber' :
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
                            }
                        })
                    break
                    
                    case 'departmentName' :
                        this.departmentNameArr.forEach(item => {
                            if(item.id === value){
                                this.values.departmentId = item.id
                                this.values.departmentName = item.name
                            }
                        })
                    break
                } 
            },

            // 获取所有车牌号
            getAllLicensePlateNumberEvent () {
                getAllLicensePlateNumber ().then ( res => {
                    if (res && res.length > 0 ) {
                        this.licensePlateNumberArr = res
                    }
                })
            },

            getDepIdByUserIdList () {
                getUserDepartById({'userId': util.cookies.get ('uuid')}).then(res => {
                    if (res && res.length > 0) {
                        this.departmentNameArr = res
                    }
                }).finally(res => {
                    this.getFormByJson()
                })
            },

            getVehicleRepair (id) {
                getSetUpVehicleRepairById ({'id': id}).then (res => {
                    if (res) {
                        this.values = res
                        this.prossValue.title = `流程名称:【 ${this.values.applyName} 】`
                        this.fileDefaultNeaten (res)
                    }
                })
            },

            saveAddVehicleRepair () {
                let url = '', boolean = {}, info = {}
                info = info = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && boolean && info) {
                        Object.assign (this.values, data, info)
                        this.values.id == null ? url = addSetUpVehicleRepair : url = editSetUpVehicleRepair
                        url (this.values).then (res => {
                            if (res.code === 200) {
                                this.$message.success ('保存成功')
                                this.closePageTag ()
                            }
                        })
                    }
                })
            },

            submitAddVehicleRepairData () {
                let list = this.$refs.materials.verify ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && list) {
                        Object.assign (this.values, data)
                        this.dialogVisible = true
                        this.prossValue = {
                            title: this.$route.params.title || `流程名称:【 ${data.applyName} 】`,
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.params.degree || '',
                            msg: '',
                        }
                    }
                })
            },

            updataAddVehicleRepair (item, boolean) {
                let url = ''
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                boolean ? url = resetSubmitAddVehicleRepair : url = submitAddVehicleRepair
                url (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closePageTag ()
                    }
                })
            },

            consentAddVehicleRepair (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closePageTag ()
                    return
                }
                if (item) {
                    this.values['completeTask'] = item
                    completeAddVehicleRepair (this.values).then (res => {
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

            printTemplate () {
                getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.$route.params.relevancyId}).then(res => {
                    if (res) this.$refs.printTemp.printTemplate (res)
                })
            },

            closePageTag () {
                let tagName = this.$route.path
                let path = ``
                this.stutas ? path = `/approval/${this.stutas}` : path = `/administrativeManagement/vehicleManagement/setUpVehicleRepair`
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
                    this.getVehicleRepair (this.$route.params.relevancyId)
                }
            }
        },

        created () {
            this.getAllLicensePlateNumberEvent ()

            this.getDepIdByUserIdList ()

            this.updataRouter ()
        },

        mounted () {
            that = this
        },

        components: {
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent,
            'up-load': upload,
            'bottom-information': bottomInformation,
            'print-template-by-html': printTemplateByHtml
        }
    }
</script>

<style lang='scss'>
    .addVehicleRepair {
        .files-upload___right {
            margin-left: 120px
        }
    }
</style>
