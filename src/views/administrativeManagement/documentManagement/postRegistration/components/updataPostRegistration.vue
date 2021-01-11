<template>
    <d2-container class="updata-post-registration" type="fulls">
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
                            :remoteOption="remoteOption"
                            ref="generateForm"
                            @on-change="selectGenerateChange"
                        />
                        <quill-editor v-if="onlinePreview == '0'" v-model="content" ref="myQuillEditor" :options="editorOption" class="quill-editor-conent"></quill-editor>
                        <bottomInformation
                            :values="values"
                            :upLoadFileDefaultList="upLoadFileDefaultList"
                            :isShowAccessory="onlinePreview == '1'"
                            :isSingleton="true"
                            :isShowCreateFile="true"
                            fieldTitle="拟稿"
                            timeTitle="提交"
                            @createFile="createPostRegistrationFile"
                            :transform="transform"
                            ref="bottomInformation"></bottomInformation>
                    </template>
                </qqt-flow-tabs>
            </div>
            <div class="qqt-container-full-content___button">
                <el-button type="warning" v-show="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', onSubmit()">重新提交</el-button>
                <el-button type="primary" v-show="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" v-show="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" v-show="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" v-show="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="warning" v-show="!transform.isShowDetails && procInstId === ''" @click="savePostRegistration">保存</el-button>
                <el-button type="primary" v-show="!transform.isShowDetails && procInstId === ''" @click="onSubmit()">提交</el-button>
                <el-button type="info" size="mini" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                <el-button @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataPostRegistration"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isTurnManage="isTurnManage" :isReject="isReject" @close="consentPostRegistration" />
        <create-file-dialog v-if="createFile" :dialogVisible="createFile" @close="registrationCreateFile"></create-file-dialog>
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </d2-container>
</template>

<script>
    import { formGetJson } from '../../../../../api/system/fromManagement/index'
    import { getPostRegistrationById, editPostRegistration, 
             addPostRegistration, completePostRegistration, 
             submitPostRegistration, postRegistrationCreateFile } from '../../../../../api/administrativeManagement/documentManagement/postRegistration'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent } from '../../../../../components/qqt-subassembly'
    import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
    import { fileOnlineView, searchPageList } from '@/api/configuration/index'
    import { ADMINISTRATIVEMANAGEMENT } from '../../../../../enum/FORMCODE'
    import { getDetails } from '../../../../../api/approval/common'
    import { staffStaffDictionary } from '@/api/system/staff/staff'
    import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
    import { mapState, mapActions } from 'vuex'
    import { quillEditor } from 'vue-quill-editor'
    import 'quill/dist/quill.bubble.css'
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'

    import createFileDialog from '../../../components/createFileDialog'
    import printTemplateByHtml from '../../../../systemManagement/printTemplate/components/printTemplateByHtml'
    import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
    let than = this
    export default {
        
        components: {
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent,
            'quill-editor': quillEditor,
            'bottomInformation': bottomInformation,
            'create-file-dialog': createFileDialog,
            'print-template-by-html': printTemplateByHtml
        },

        data () {
            return {
                stutas: '',
                title: '',
                procInstId: '',
                onlinePreview: '2',
                fileList: [],
                nodeData: {
                    operation: '',
                    msg: ''
                },
                jsonData: {},
                remote: {
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
                },
                remoteOption: {
                    allUser: []
                },
                values: {},
                content: '',
                staffName: '',
                editorOption: {
                    placeholder: ''
                },
                prossValue: {
                    title: ''
                },
                upLoadFileDefaultList: [],
                dialogVisible: false,
                processModuleId: ADMINISTRATIVEMANAGEMENT.POSTREGISTRATION,
                code: BASICSCODE.ADMIN_SEND_FILE,
                isReject: false,
                visible: false,
                isSendBack: false,
                isTurnManage: false,
                createFile: false
            }
        },

        methods: {

            ...mapActions ('d2admin/page', [
                'close',
            ]),

            getFormByJson () {
                formGetJson ({'code': ADMINISTRATIVEMANAGEMENT.POSTREGISTRATION}).then(res => {
                    if (res) {
                        this.jsonData = JSON.parse(res)
                    }
                })
            },

            getPostRegistration (id) {
                getPostRegistrationById ({'id': id}).then (res => {
                    if (res) {
                        this.values = res
                        this.content = res.content
                        this.updataFileList (res.fileList)
                    }
                })
            },

            savePostRegistration () {
                let item = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && item) {
                        data['staffName'] = this.staffName
                        data['content'] = this.content
                        Object.assign (data, item)
                        if (this.values.id == null) {
                            addPostRegistration (data).then (res => {
                                if (res.code === 200) {
                                    this.$message.success ('保存成功')
                                    this.closePageTag ()
                                }
                            })
                        } else {
                            data['id'] = this.values.id
                            editPostRegistration (data).then (res => {
                                if (res.code === 200) {
                                    this.$message.success ('修改成功')
                                    this.closePageTag ()
                                }
                            })
                        }
                    }
                })
            },

            selectGenerateChange (field, val, models) {
                switch (field) {
                    case 'staffId':
                        let item = this.remoteOption.allUser.find (f => f.id === val)
                        if (item) {
                            this.staffName = item.name
                        }
                        break;
                }
            },

            onSubmit () {
                let item = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && item) {
                        if (this.staffName) {
                            data['staffName'] = this.staffName
                        }
                        if (this.content) {
                            data['content'] = this.content
                        }
                        Object.assign (this.values, data, item)
                        if (this.fileList.length !== 0) {
                            this.values['fileList'] = this.fileList
                        }
                        this.values['id'] = this.$route.params.relevancyId || undefined
                        this.dialogVisible = true
                        this.prossValue = {
                            title: `发文登记: 【 ${data.title} 】` || '',
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.params.degree || '',
                            msg: '',
                        }
                    }
                })
            },

            closePageTag () {
                let tagName = this.$route.path
                let path
                if (this.stutas) {
                    path = `/approval/${this.stutas}`
                } else {
                    path = `/administrativeManagement/documentManagement/postRegistration`
                }
                this.close ({tagName, path})
            },

            getDetailsList (taskId) {
                getDetails (taskId).then (res => {
                    if (res) this.nodeData = res
                })
            },

            updataPostRegistration (item, boolean) {
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                if (boolean) {
                    this.completePostRegistrationData (this.values)
                } else {
                    submitPostRegistration (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success ('提交成功')
                            this.closePageTag ()
                        }
                    })
                }
            },

            consentPostRegistration (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closePageTag ()
                    return
                }
                if (item) {
                    this.values['completeTask'] = item
                    this.completePostRegistrationData (this.values)
                }
            },

            completePostRegistrationData (data) {
                 completePostRegistration (data).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closePageTag ()
                    }
                })
            },

            createPostRegistrationFile () {
                this.createFile = true
            },

            registrationCreateFile (data) {
                this.createFile = false
                if (data) {
                    postRegistrationCreateFile ({'name': data.fileName, type: data.fileType}).then (res => {
                        res['name'] = res.fileName, res['size'] = 0
                        this.$refs.bottomInformation.upLoadFileCreate (res)
                        let list = this.$refs.bottomInformation.getAllUpLoadFile ()
                        this.updataFileList (list)
                    })
                }
            },

            getFileOnlineView () {
                searchPageList({'identification' :'9' }).then(res => {
                    this.onlinePreview = res[1].value
                })
            },

            getStaffStaffDictionary () {
                staffStaffDictionary ().then(res => {
                    if (res && res.length > 0) {
                        this.remoteOption.allUser = res
                    }
                })
            },

            updataFileList (list) {
                if (list.length > 0) {
                    this.upLoadFileDefaultList = []
                    list.forEach(item => {
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
                    this.getPostRegistration (this.$route.params.relevancyId)
                }
            }
        },

        created () {
            this.getStaffStaffDictionary ()
            this.getFileOnlineView ()
            this.getFormByJson ()
            this.updataRouter ()
        },

        mounted () {
            than = this
        }
    }
</script>

<style lang='scss' scoped>
    .updata-post-registration {
        .updata-post-registration-text {
            padding: 15px 0 0 20px;
            margin-bottom: 30px;
        }
        .quill-editor-conent {
            height: 280px;
            margin-bottom: 70px;
        }
    }
</style>
