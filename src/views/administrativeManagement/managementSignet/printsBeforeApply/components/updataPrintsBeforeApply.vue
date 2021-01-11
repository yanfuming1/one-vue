<template>
    <d2-container type="fulls">
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
                        <bottomInformation :values="values" fieldTitle="申请" timeTitle="申请" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation"></bottomInformation>
                    </template>
                </qqt-flow-tabs>
            </div>
            <div class="qqt-container-full-content___button">
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', onSubmit(true)">重新提交</el-button>
                <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="savePrintsBeforeApply">保存</el-button>
                <el-button type="primary" v-if="!transform.isShowDetails && procInstId === ''" @click="onSubmit(false)">提交</el-button>
                <el-button type="info" size="mini" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                <el-button @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataPrintsBeforeApply"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isTurnManage="isTurnManage" :isReject="isReject" @close="consentPrintsBeforeApply" />
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </d2-container>
</template>

<script>
    import { formGetJson } from '../../../../../api/system/fromManagement/index'
    import { getPrintsBeforeApplyById, editPrintsBeforeApply, 
             addPrintsBeforeApply, submitPrintsBeforeApply, accomplishPrintsBeforeApply } from '../../../../../api/administrativeManagement/managementSignet/printsBeforeApply'
    import { getManagementSignetTree } from '../../../../../api/administrativeManagement/sealClassification'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent } from '../../../../../components/qqt-subassembly'
    import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
    import { ADMINISTRATIVEMANAGEMENT } from '../../../../../enum/FORMCODE'
    import { getDetails } from '../../../../../api/approval/common'
    import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
    import { mapActions } from 'vuex'

    import printTemplateByHtml from '../../../../systemManagement/printTemplate/components/printTemplateByHtml'
    import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
    export default {
        
        name: 'updataPrintsBeforeApply',

        data () {
            return {
                stutas: '',
                title: '',
                procInstId: '',
                nodeData: {
                    operation: '',
                    msg: ''
                },
                saveData: {},
                jsonData: {},
                remote: {},
                values: {
                    sealtype: ''
                },
                transform: {
                    isShowDetails: false
                },
                prossValue: {
                    title: ''
                },
                dialogVisible: false,
                processModuleId: ADMINISTRATIVEMANAGEMENT.PRINTSBEFOREAPPLY,
                code: BASICSCODE.ADMIN_ENGAPPLY,
                isReject: false,
                visible: false,
                isSendBack: false,
                isTurnManage: false,
                upLoadFileDefaultList: []
            }
        },

        methods: {

            ...mapActions('d2admin/page', [
                'close',
            ]),

            getFormByJson () {
                formGetJson ({'code': ADMINISTRATIVEMANAGEMENT.PRINTSBEFOREAPPLY}).then(res => {
                    if (res) {
                        this.jsonData = JSON.parse(res)
                    }
                })
            },

            getPrintsBeforeApply (id) {
                getPrintsBeforeApplyById ({'id': id}).then (res => {
                    if (res) {
                        this.values = res
                        this.prossValue.title = `刻章申请:【 ${res.name} 】`
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
                    }
                })
            },

            savePrintsBeforeApply () {
                let element = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && element) {
                        this.saveData = data
                        Object.assign (this.values, data, element)
                        if (this.values.id == null) {
                            addPrintsBeforeApply (this.values).then (res => {
                                if (res.code === 200) {
                                    this.$message.success ('保存成功')
                                    this.closePageTag ()
                                }
                            })
                        } else {
                            editPrintsBeforeApply (this.values).then (res => {
                                if (res.code === 200) {
                                    this.$message.success ('修改成功')
                                    this.closePageTag ()
                                }
                            })
                        }
                    }
                })
            },

            onSubmit (boolean) {
                let element = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && element) {
                        Object.assign (this.values, data, element)
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

            selectGenerateChange (field, val, models) {
                switch (field) {
                    case 'name':
                        this.prossValue.title = `刻章申请:【 ${val} 】`
                        this.values.name = val
                        break
                    case 'sealtype':
                        this.values.sealtype = val
                        break
                    case 'applyreason':
                        this.values.applyreason = val
                        break
                    case 'remark':
                        this.values.remark = val
                        break
                    case 'engnumber':
                        this.values.engnumber = val
                        break
                }
            },

            closePageTag () {
                let path = ''
                let params = ''
                let name = ''
                let tagName = this.$route.path
                if (!this.stutas) {
                    name = 'printsBeforeApply'
                    path = '/administrativeManagement/managementSignet/printsBeforeApply'
                    params = {
                        'sealtype': this.saveData.sealtype ? this.saveData.sealtype : this.values.sealtype
                    }
                    this.close ({ tagName, path, name, params })
                } else {
                    path = `/approval/${this.stutas}`
                    this.close ({ tagName, path })
                }
            },

            neataData (data = []) {
                this.remote = {
                    getSealtype (resolve) {
                        resolve (data)
                    }
                }
            },

            getManagementSignetTreeList () {
                getManagementSignetTree().then(result => {
                    if (result.records && result.records.length > 0) {
                        this.neataData (result.records)
                    } else {
                         this.neataData ()
                    }
                })
            },

            updataPrintsBeforeApply (item, boolean) {
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                if (boolean) {
                    accomplishPrintsBeforeApply (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success (res.message)
                            this.closePageTag ()
                        }
                    })
                } else {
                    submitPrintsBeforeApply (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success ('提交成功')
                            this.closePageTag ()
                        }
                    })
                }
            },

            consentPrintsBeforeApply (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closePageTag ()
                    return
                }
                if (item) {
                    this.values['completeTask'] = item
                    accomplishPrintsBeforeApply (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success (res.message)
                            this.closePageTag ()
                        }
                    })
                }
            },

            getDetailsList (taskId) {
                getDetails (taskId).then (res => {
                    if (res) {
                        this.nodeData = res
                    }
                })
            },

            printTemplate () {
                getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.$route.params.relevancyId}).then(res => {
                    if (res) this.$refs.printTemp.printTemplate (res || [])
                })
            },

            updataRouter () {
                if (this.$route.params) {
                    this.transform = this.$route.params.transform || {}
                    this.stutas = this.$route.params.pathName || ''
                    this.procInstId = this.$route.params.procInstId || ''
                }
                if (this.$route.params && this.$route.params.managementSignetTreeId) {
                    this.values.sealtype = this.$route.params.managementSignetTreeId
                }
                if  (this.$route.params && this.$route.params.taskId) {
                    this.getDetailsList (this.$route.params.taskId)
                }
                if (this.$route.params && this.$route.params.relevancyId) {
                    this.getPrintsBeforeApply (this.$route.params.relevancyId)
                }
            }
        },

        created () {
            this.getFormByJson ()
            this.updataRouter ()
            this.getManagementSignetTreeList ()

        },

        components: {
            'print-template-by-html': printTemplateByHtml,
            'bottomInformation': bottomInformation,
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent
        }
    }
</script>
