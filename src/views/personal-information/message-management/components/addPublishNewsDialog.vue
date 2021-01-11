<template>
    <!-- <div> -->
        <d2-container>
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closeTag"><i class="el-icon-close"></i></el-button>
            </div>

            <div class="addPublishNewsDialog">
                <qqt-flow-tabs :procInstId="procInstId">
                    <template slot="content"> 

                        <fm-generate-form
                            :data="jsonData"
                            :value="values"    
                            :transform="transform"
                            @btn-click="btnClick"
                            ref="generateForm">

                                <template slot="content" v-if="!onlinePreview">
                                    <div class="quill-editor-con">
                                        <div class="message-content-c">
                                            <span class="message-content">*</span> <p class="message-con"> {{ msgTitle }}</p>
                                        </div>
                                        <quill-editor v-model="values.content" ref="myQuillEditor" :options="editorOption" class="quill-editor-conent">
                                        </quill-editor>
                                    </div>
                                </template>
                        </fm-generate-form>
                    </template>
                </qqt-flow-tabs>
            </div>
            <bottom-information :values="values" :isShowAccessory="onlinePreview" fieldTitle="拟稿" timeTitle="提交" :upLoadFileDefaultList="upLoadFileDefaultList" :isShowCreateFile="true" :transform="transform" @removeFile="removeFile" @createFile="createPublishNewsFile" ref="bottomInformation" />
            <user-modules :showDialog="isShow" title="选择人员" :isShowInput="false" :isShowRole="false" @clearUserPage="clearUserPage" @closeFun="closeFun"/>

            <div class="demo-drawer__footer">
                <el-button size="mini" type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submisSionNoticeAnnouncement (true)">重新提交</el-button>
                <el-button size="mini" type="primary" v-if="stutas == 'backlog'" @click="consentVisible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button size="mini" type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="consentVisible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button size="mini" type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="consentVisible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button size="mini" type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="consentVisible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button size="mini" type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="prePubilshDialog">保存</el-button>
                <el-button size="mini" type="primary" v-if="!transform.isShowDetails && procInstId === ''" @click="values['flag'] = '1', submisSionNoticeAnnouncement (false)">提交</el-button>
                <el-button size="mini" @click="closeTag">关闭</el-button>
            </div>

        </el-card>    

        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :isSendBack="isSendBack" :processModuleId="processModuleId" :prossValue="prossValue" @close="dialogVisible = false" @selectData="submitAdjustmentApproval"/>
        <qqt-consent :dialogVisible="consentVisible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentUsingApplication" />
        <create-file-dialog v-if="createFile" :dialogVisible="createFile" @close="registrationCreateFile"></create-file-dialog>
    </d2-container>
</template>

<script>
import { mapActions } from 'vuex'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import { fileOnlineView, searchPageList } from '@/api/configuration/index'
import { getDetails } from '../../../../api/approval/common'
import { ADMINISTRATIVEMANAGEMENT } from '../../../../enum/FORMCODE'
import { formGetJson } from '../../../../api/system/fromManagement/index'
import userModules from '../../../systemManagement/processDefinition/processModules/userModules'
import { qqtInput, qqtSendProcess, qqtFlowTabs, qqtConsent} from '../../../../components/qqt-subassembly'
import { publishMessageAdd, publishMessageEdit, publishNewsqueryById,
    publishNewsSubmit, publishNewsOperation } from "../../../../api/personal-information/messageManagement"
import { postRegistrationCreateFile } from '../../../../api/administrativeManagement/documentManagement/postRegistration'
import bottomInformation from '../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
import createFileDialog from '../../../administrativeManagement/components/createFileDialog'
export default {
    name:"addPubilshNewsDialog",
    components: {
        qqtInput,
        quillEditor,
        userModules,
        qqtSendProcess, 
        qqtFlowTabs, 
        qqtConsent,
        createFileDialog,
        'bottom-information': bottomInformation

    },
    data () {
        return {
            values:{
                scope:'',
                scopeName: '',
                content: '',
                fileList: []
            },
            msgTitle: '',
            scope:'',
            jsonData: {},
            visible: false,
            editorOption: {},
            saveData: {},
            // 可见范围弹窗
            isShow:false,
            user: [],
            department: [],
            startCrew: [],
            upLoadFileDefaultList: [],

            // 提交流程数据
            dialogVisible: false,
            isSendBack: false,
            prossValue: {
                title: ''
            }, 
            processModuleId: ADMINISTRATIVEMANAGEMENT.ADDPUBLISHNEWSDIALOG,
            transform: {
                isShowDetails: false
            },
            // 流程
            stutas:'',
            procInstId: '',
            nodeData: {
                operation: '',
                msg:''
            },
            consentVisible: false,
            isReject: false,
            isTurnManage: false,
            onlinePreview: true,
            createFile: false
        };
    },
    methods: {
        getFormByJson () {
            formGetJson ({'code': ADMINISTRATIVEMANAGEMENT.ADDPUBLISHNEWSDIALOG}).then(res => {
                if (res) {
                    this.jsonData = JSON.parse(res)
                }
            })
        },

        btnClick (val, field) {
            this.field = field
            this.btnTableClickVal = val
            this.isShow = true;
        },

        clearUserPage(item) {
            // 选中有数据
            if (this.btnTableClickVal === 'scopeName') {
                let str = ''
                let strId = []
                if (item.length > 0) {
                    item.forEach(res => {
                        str += res.name + ','
                        strId +=res.id + ','
                    })
                    this.values.scopeName = str.substring(0, str.length - 1);
                    this.values.scope =  strId.substring(0, strId.length - 1);
                    this.scope = this.values.scope
                    this.isShow = false
                } else {
                    this.$message.warning('请选择可见范围')
                }
            }
        },
        closeFun () {
            this.isShow = false;
        },

        // 保存
        prePubilshDialog () {
            let info = {}, changed = false
            info = this.$refs.bottomInformation.getData()
            this.$refs.generateForm.getData().then(item => {
                if (!item && !info) return
                Object.assign (this.values, item, info)
                switch (this.values.stickBoolean) {
                    case true:
                        this.values.stick = '1'
                    break
                    case false:
                        this.values.stick = '0'
                    break
                }
                if ((this.values.content == '' || this.values.content === null) && !this.onlinePreview ){
                    this.$message.warning('请输入消息内容')
                    changed = true
                }
                if ((!this.values.fileList || this.values.fileList.length == 0) && this.onlinePreview ){
                    this.$message.warning('附件不能为空')
                    changed = true
                }       
                if (changed) return                                                                                                                                                                                                                                                                                                                                                                                                                 
                let url = ''
                this.values.id == null ? url = publishMessageAdd : url = publishMessageEdit
                url (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success ('保存成功')
                        this.closeTag ()
                    }
                })
            })
        },

        submisSionNoticeAnnouncement (boolean) {
            let info = false, changed = false
            info = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData().then(item => {
                if (item && info) {
                    Object.assign (this.values, item, info )
                    if ((this.values.content == '' || this.values.content === null) && !this.onlinePreview ){
                        this.$message.warning('请输入消息内容')
                        changed = true
                    }
                    if ((!this.values.fileList || this.values.fileList.length == 0) && this.onlinePreview ){
                        this.$message.warning('附件不能为空')
                        changed = true
                    }
                    if (changed) return
                    this.dialogVisible = true
                    if (boolean) {
                        this.prossValue = {
                            title: this.$route.params.title || '',
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.params.degree || '',
                            msg: '',
                        }
                    } else {
                        this.prossValue.title = `通知公告:【 ${item.title} 】`
                    }
                }
            })
        },
        
        submitAdjustmentApproval (item, boolean) {
                let url = ''
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                this.dialogVisible = this.isSendBack = false
                switch (this.values.stickBoolean) {
                    case true:
                        this.values.stick = '1'
                    break
                    case false:
                        this.values.stick = '0'
                    break
                }
                boolean ? url = publishNewsOperation : url = publishNewsSubmit
                url (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closeTag ()
                    }
                })
        },

        // 流程操作
        consentUsingApplication (item = '', boolean = false) {
            this.consentVisible = this.isTurnManage = this.isReject = false
            if (boolean) {
                this.closeTag ()
                return
            }
            if (item) {
                this.values['completeTask'] = item
                publishNewsOperation (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closeTag ()
                    }
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
                this.getpublishNewsqueryById (this.$route.params.relevancyId)
            }
        },

        getpublishNewsqueryById () {
            publishNewsqueryById ({
                id: this.$route.params.relevancyId
            }).then(res => {
                res['stickBoolean'] = res.stick == '1' ? true : false
                this.values = res
                this.updataFileList (res.fileList)
                this.prossValue.title = `通知公告:【 ${res.title} 】`
            })
        },

        updataFileList (list = []) {
            this.upLoadFileDefaultList = []
            if (list.length > 0) {
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

        createPublishNewsFile () {
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

        removeFile (index) {
            let list = this.$refs.bottomInformation.getAllUpLoadFile ()
            this.updataFileList (list)
            this.upLoadFileDefaultList.splice (index, 1)
        },

        getDetailsList (taskId) {
            getDetails (taskId).then (res => {
                if (res) {
                    this.nodeData = res
                }
            })
        },

        getFileOnlineView () {
            searchPageList({'identification' :'9' }).then(res => {
                this.onlinePreview = res[1].value === '1' ? true : false
            })
        },
        
        closeTag () {
            this.$router.go(-1)
            let tagName = this.$route.path
            this.close ({ tagName })
        },
        ...mapActions('d2admin/page', [
            'close' 
        ])
    },

    mounted () {
        
    },
    
    created () {
        switch (this.$route.params.identification) {
            case '0' : 
                this.msgTitle = "通知公告内容"
                break
            case '1' :
                this.msgTitle = '消息内容'
                break
        }
        this.getFormByJson ()
        
        this.updataRouter ()

        this.getFileOnlineView ()

    }
}
</script>
<style lang="scss" scoped>
    .quill-editor-con {
        height: 550px;
        .message-content-c{
            display: flex;
            margin: 0 5px 0 20px;
            .message-con {
                font-weight: 600
            }
            .message-content{
                margin: 6px 2px;
                font-size: 24px;
                color: #f63838
            };
            
        }
        .quill-editor-conent {
            height: 420px;
        }
    }
    .demo-drawer__footer{
        text-align: center;
        margin-top: 20px;
        bottom:20px;
    }
    .addPublishNewsDialog {
        padding-top: 25px;
    }
  
</style>
