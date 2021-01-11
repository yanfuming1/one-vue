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
                        >
                        </fm-generate-form>
                        <bottomInformation :values="values" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation"></bottomInformation>
                    </template>
                </qqt-flow-tabs>
            </div>
            <div class="qqt-container-full-content___button">
                <el-button type="warning" v-show="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', onSubmit()">重新提交</el-button>
                <el-button type="primary" v-show="stutas == 'backlog'" @click="values['flag'] = '1', title = '审批意见', onValidation ()">同意</el-button>
                <el-button type="warning" v-show="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" v-show="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" v-show="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="warning" v-show="!transform.isShowDetails && procInstId === ''" @click="saveReceiptRegistration">保存</el-button>
                <el-button type="primary" v-show="!transform.isShowDetails && procInstId === ''" @click="onSubmit()">提交</el-button>
                <el-button type="info" size="mini" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                <el-button @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataReceiptRegistration"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isTurnManage="isTurnManage" :isReject="isReject" @close="consentReceiptRegistration" />
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </d2-container>
</template>

<script>
    import { formGetJson } from '../../../../../api/system/fromManagement/index'
    import { getReceiptRegistrationById, editReceiptRegistration, 
             addReceiptRegistration, submitReceiptRegistration, completeReceiptRegistration } from '../../../../../api/administrativeManagement/documentManagement/receiptRegistration'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, upload } from '../../../../../components/qqt-subassembly'
    import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
    import { ADMINISTRATIVEMANAGEMENT } from '../../../../../enum/FORMCODE'
    import { staffStaffDictionary } from '@//api/system/staff/staff'
    import { getDetails } from '../../../../../api/approval/common'
    import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
    import { mapState, mapActions } from 'vuex'

    import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
    import printTemplateByHtml from '../../../../systemManagement/printTemplate/components/printTemplateByHtml'
    let than = this
    export default {
        
        data () {
            return {
                stutas: '',
                title: '',
                content: '',
                procInstId: '',
                nodeData: {
                    operation: '',
                    msg: ''
                },
                jsonData: {},
                remote: {},
                values: {
                    isreceive: '1'
                },
                prossValue: {
                    title: ''
                },
                dialogVisible: false,
                processModuleId: ADMINISTRATIVEMANAGEMENT.RECEIPTREGISTRATION,
                code: BASICSCODE.ADMIN_RECEIVE_FILE,
                isReject: false,
                visible: false,
                isSendBack: false,
                isTurnManage: false,
                upLoadFileDefaultList: [],
                allUser: []
            }
        },

        methods: {

            ...mapActions ('d2admin/page', [
                'close',
            ]),

            getFormByJson () {
                formGetJson ({'code': ADMINISTRATIVEMANAGEMENT.RECEIPTREGISTRATION}).then(res => {
                    if (!res) return
                    let data = JSON.parse(res)
                    data.list.forEach (res => {
                        if (this.values.isreceive == '1' && this.stutas != '' && res.model == 'replyContent') {
                            res.columns[0].list[0].options['isEnableDisabled'] = true
                            res.columns[0].list[0].options.hidden = false
                        }
                        if (this.values.isreceive == '0' && res.model == 'isreceive') {
                            res.columns[1].list[0].options.required = false
                        }
                    })
                    this.jsonData = data
                })
            },

            getReceiptRegistration (id) {
                getReceiptRegistrationById ({'id': id}).then (res => {
                    if (res) {
                        this.values = res
                        this.updataFileList (res)
                    }
                }).finally (() => {
                    this.getFormByJson ()
                })
            },

            saveReceiptRegistration () {
                let element = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && element) {
                        Object.assign (this.values, data, element)
                        if (this.values.id == null) {
                            addReceiptRegistration (this.values).then (res => {
                                if (res.code === 200) {
                                    this.$message.success ('保存成功')
                                    this.closePageTag ()
                                }
                            })
                        } else {
                            editReceiptRegistration (this.values).then (res => {
                                if (res.code === 200) {
                                    this.$message.success ('修改成功')
                                    this.closePageTag ()
                                }
                            })
                        }
                    }
                })
            },

            onSubmit () {
                let element = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && element) {
                        Object.assign (this.values, data, element)
                        this.values['id'] = this.$route.params.relevancyId || undefined
                        this.dialogVisible = true
                        this.prossValue = {
                            title: `收文登记:【 ${data.title} 】` || '',
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.params.degree || '',
                            msg: '',
                        }
                    }
                })
            },

            getDetailsList (taskId) {
                getDetails (taskId).then (res => {
                    if (res) {
                        this.nodeData = res
                    }
                })
            },

            getStaffStaffDictionary () {
                staffStaffDictionary ().then (res => {
                    if (res instanceof Array) this.allUser = res
                    this.neatenRomote ()
                })
            },

            updataReceiptRegistration (item, boolean) {
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                if (boolean) {
                    this.completeReceiptRegistrationData (this.values)
                } else {
                    submitReceiptRegistration (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success ('提交成功')
                            this.closePageTag ()
                        }
                    })
                }
            },

            consentReceiptRegistration (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closePageTag ()
                    return
                }
                if (item) {
                    this.values['completeTask'] = item
                    this.completeReceiptRegistrationData (this.values)
                }
            },

            completeReceiptRegistrationData (data) {
                 completeReceiptRegistration (data).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closePageTag ()
                    }
                })
            },

            upLoadFileCallBack (item) {
                this.values['fileList'] = item
            },

            selectGenerateChange (field, val, models) {
                switch (field) {
                    case 'isreceive':
                        Object.assign (this.values, this.$refs.generateForm.neatenEnumerableData ())
                        if (!this.isRecord) this.values.recoverytime = ''
                        this.jsonData.list.forEach (res => {
                            if (res.model != 'isreceive') {
                                return
                            }
                            if (val == '0') {
                                res.columns[1].list[0].options.required = false
                                this.$refs.generateForm.clearValidate ('recoverytime')
                            } else {
                                res.columns[1].list[0].options.required = true
                            }
                        })
                        break;
                    case 'recoverytime':
                        this.$refs.generateForm.clearValidate (field)
                        break
                    case 'readpersonId':
                        this.values['readpersonId'] = val
                        let item = than.allUser.find (f => f.id == val)
                        if (item) this.values['readperson'] = item.name

                }
            },

            onValidation () {
                this.$refs.generateForm.getData ().then (data => {
                    if (data) this.values['replyContent'] = data.replyContent, this.visible = true
                })
            },

            updataFileList (res) {
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

            neatenRomote () {
                this.remote = {
                    getSecretClass (resolve) {
                        resolve ([
                            {
                                value: '1',
                                label: '公开'
                            },
                            {
                                value: '2',
                                label: '秘密'
                            },
                            {
                                value: '3',
                                label: '机密'
                            },
                            {
                                value: '4',
                                label: '绝密'
                            },
                        ])
                    },
                    getReceive (resolve) {
                        resolve ([
                            {
                                value: '1',
                                label: '是'
                            },
                            {
                                value: '0',
                                label: '否'
                            }
                        ])
                    },
                    getUserAll (resolve) {
                        resolve (than.allUser || [])
                    }
                }
            },

            closePageTag () {
                let tagName = this.$route.path
                let path
                if (this.stutas) {
                    path = `/approval/${this.stutas}`
                } else {
                    path = `/administrativeManagement/documentManagement/receiptRegistration`
                }
                this.close ({tagName, path})
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
                if  (this.$route.params && this.$route.params.taskId) {
                    this.getDetailsList (this.$route.params.taskId)
                }
                if (this.$route.params && this.$route.params.relevancyId) {
                    this.getReceiptRegistration (this.$route.params.relevancyId)
                } else {
                    this.getFormByJson ()
                }
            }
        },

        created () {
            this.updataRouter ()
            this.getStaffStaffDictionary ()
        },

        components: {
            'print-template-by-html': printTemplateByHtml,
            'bottomInformation': bottomInformation,
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent
        },

        mounted () {
            than = this
        }
    }
</script>
