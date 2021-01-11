<template>
    <d2-container class="borrowing-apply" type="fulls">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
            </div>
            <div class="qqt-container-full-center___top">
                <qqt-flow-tabs :procInstId="procInstId">
                    <template slot="content">
                        <fm-generate-form :data="jsonData" :remote="remote" :value="values" :transform="transform" @on-change="selectGenerateChange" ref="generateForm"></fm-generate-form>
                        <div class="borrowing-apply-registration" v-show="values.filetype.indexOf ('0') !== -1">
                            <div class="borrowing-apply-registration-title">
                                <div class="borrowing-apply-registration-title___longString">
                                    <p>原件</p>
                                </div>
                                <div class="borrowing-apply-registration-title-right___transverseLine"></div>
                            </div>
                            <div class="borrowing-apply-registration-content">
                                <el-checkbox v-model="selectOriginal" v-if="!transform.isShowDetails"></el-checkbox>
                                <borrowing-apply-table :tableData="[values]" :rowHeader="originalRowHeader" />
                            </div>
                        </div>
                        <div class="borrowing-apply-registration" v-show="values.filetype.indexOf ('1') !== -1">
                            <div class="borrowing-apply-registration-title">
                                <div class="borrowing-apply-registration-title___longString">
                                    <p>复印件</p>
                                </div>
                                <div class="borrowing-apply-registration-title-right-copies___transverseLine"></div>
                            </div>
                            <div class="borrowing-apply-registration-content">
                                <el-checkbox v-model="selectCopies" v-if="!transform.isShowDetails"></el-checkbox>
                                <borrowing-apply-table :tableData="[values]" :rowHeader="copiesRowHeader" />
                            </div>
                        </div>
                        <div class="borrowing-apply-registration" v-show="values.filetype.indexOf ('2') !== -1">
                            <div class="borrowing-apply-registration-title">
                                <div class="borrowing-apply-registration-title___longString">
                                    <p>电子文档</p>
                                </div>
                                <div class="borrowing-apply-registration-title-right-electronic___transverseLine"></div>
                            </div>
                            <div class="borrowing-apply-registration-content">
                                <el-checkbox v-model="selectElectronicDocument" v-if="!transform.isShowDetails"></el-checkbox>
                                <borrowing-apply-table :tableData="[values]" :rowHeader="electronicDocumentRowHeader" />
                            </div>
                        </div>
                        <bottomInformation :values="values" fieldTitle="申请" timeTitle="申请" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
                    </template>
                </qqt-flow-tabs>
            </div>
            <el-row class="d2-mt-10">
                <div class="qqt-container-full-content___button">
                    <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', onSubmit()">重新提交</el-button>
                    <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, title = '审批意见', values['flag'] = '1'">同意</el-button>
                    <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                    <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                    <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                    <el-button v-if="!transform.isShowDetails && procInstId === ''" type="warning" @click="onSave">保存</el-button>
                    <el-button v-if="!transform.isShowDetails && procInstId === ''" type="primary" @click="onSubmit ()">提交</el-button>
                    <el-button type="info" size="mini" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                    <el-button @click="closePageTag">关闭</el-button>
                </div>
            </el-row>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataBorrowingApply"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isTurnManage="isTurnManage" :isReject="isReject" @close="consentBorrowingApply" />
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </d2-container>
</template>

<script>
    import { formGetJson } from '../../../../../api/system/fromManagement/index'
    import { ADMINISTRATIVEMANAGEMENT } from '../../../../../enum/FORMCODE'
    import { getArchiveRegistrationById, completeArchiveRegistration, 
             submitArchiveRegistration } from '../../../../../api/administrativeManagement/archivesManagement/archiveRegistration'
    import { addBorrowedRecord, getBorrowedRecordById, editBorrowedRecord } from '../../../../../api/administrativeManagement/archivesManagement/borrowedRecord'
    import { qqtSendProcess, qqtConsent, qqtFlowTabs } from '../../../../../components/qqt-subassembly'
    import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
    import { getDetails } from '../../../../../api/approval/common'
    import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
    import { mapActions } from "vuex";

    import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
    import printTemplateByHtml from '../../../../systemManagement/printTemplate/components/printTemplateByHtml'
    import borrowingApplyTable from './borrowingApplyTable'
    export default {

        components: {
            'print-template-by-html': printTemplateByHtml,
            'borrowing-apply-table': borrowingApplyTable,
            'bottomInformation': bottomInformation,
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent
        },

        data () {
            return {
                stutas: '',
                procInstId: '',
                nodeData: {
                    operation: '',
                    msg: ''
                },
                selectOriginal: false,
                selectElectronicDocument: false,
                selectCopies: false,
                dialogVisible: false,
                processModuleId: ADMINISTRATIVEMANAGEMENT.BORROWINGAPPLY,
                code: BASICSCODE.ADMIN_FILE_LOAN,
                isReject: false,
                visible: false,
                isSendBack: false,
                isTurnManage: false,
                jsonData: {},
                remote: {},
                values: {
                    filetype: []
                },
                prossValue: {
                    title: ''
                },
                transform: {
                    isShowDetails: false
                },
                originalRowHeader: [
                    {
                        prop: 'oencoding',
                        label: '编码',
                        isShow: true,
                        align: 'center',
                        type: 'text',
                        required: true
                    },
                    {
                        prop: 'oshare',
                        label: '份数',
                        isShow: true,
                        align: 'center',
                        type: 'text',
                        required: true
                    },
                    {
                        prop: 'onumber',
                        label: '每份页数',
                        isShow: true,
                        align: 'center',
                        type: 'text',
                        required: true
                    }
                ],
                copiesRowHeader: [
                    {
                        prop: 'cencoding',
                        label: '编码',
                        isShow: true,
                        align: 'center',
                        type: 'text',
                        required: true
                    },
                    {
                        prop: 'cshare',
                        label: '份数',
                        isShow: true,
                        align: 'center',
                        type: 'text',
                        required: true
                    },
                    {
                        prop: 'cnumber',
                        label: '每份页数',
                        isShow: true,
                        align: 'center',
                        type: 'text',
                        required: true
                    }
                ],
                electronicDocumentRowHeader: [
                    {
                        prop: 'dencoding',
                        label: '编码',
                        isShow: true,
                        align: 'center',
                        type: 'text',
                        required: true
                    },
                    {
                        prop: 'dshare',
                        label: '份数',
                        isShow: true,
                        align: 'center',
                        type: 'text',
                        required: true
                    },
                    {
                        prop: 'documentType',
                        label: '文件类型',
                        isShow: true,
                        align: 'center',
                        type: 'select',
                        required: true,
                        
                    },
                    {
                        prop: 'storagepath',
                        label: '存放位置',
                        align: 'center',
                        type: 'text',
                        required: true
                    },
                ],
                options: [
                    {
                        value: '1',
                        label: '音频'
                    },
                    {
                        value: '0',
                        label: '视频'
                    },
                    {
                        value: '2',
                        label: '图片'
                    },
                    {
                        value: '3',
                        label: '文件'
                    },
                    {
                        value: '4',
                        label: '其它'
                    }
                ],
                filetype: []
            }
        },

        methods: {

            ...mapActions('d2admin/page', [
                'close',
            ]),

            getFormByJson () {
                let code = ADMINISTRATIVEMANAGEMENT.BORROWINGAPPLY
                formGetJson ({'code': code}).then(res => {
                    if (res) {
                        this.jsonData = JSON.parse(res)
                    }
                })
            },

            getArchiveRegistration (id, identifying = 'borrowedRecord') {
                let url = ''
                switch (identifying) {
                    case 'archiveRegistration':
                        url = getArchiveRegistrationById
                        break;
                    case 'borrowedRecord':
                    case 'borrowedRecord/:1':
                        url = getBorrowedRecordById
                        break;
                }
                url ({'id': id}).then (res => {
                    if (res) {
                        if (identifying == 'archiveRegistration') {
                            res.remark = ''
                            delete res.id, delete res.createBy, delete res.createTime
                            delete res.departmentId, delete res.departmentName, delete res.companyId
                            delete res.companyName
                        }
                        if (res.filetype && res.filetype.length !== 0) {
                            res.filetype = JSON.parse (res.filetype)
                            if (identifying === 'borrowedRecord') {
                                this.selectCheck (res.filetype)
                            }
                        }
                        let item = this.options.find ( f => f.value === res.documentType)
                        if (item) {
                            res.documentType = item.label
                        }
                        this.values = res
                    }
                })
            },

            onSubmit () {
                let item = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && item) {
                        let boolean = this.neatenData ()
                        if (boolean) {
                            Object.assign (this.values, item)
                            this.values['purposes'] = data.purposes
                            this.values['borrowDate'] = data.borrowDate
                            this.values['remark'] = data.remark
                            this.values['filetype'] = JSON.stringify (this.filetype)
                            this.dialogVisible = true
                            this.prossValue = {
                                title: `档案申请:【 ${data.name} 】` || '',
                                pdfId: this.$route.params.procDefId || '',
                                degree: this.$route.params.degree || '',
                                msg: '',
                            }
                        }
                    }
                })
            },
            
            onSave () {
                let item = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && item) {
                        let boolean = this.neatenData ()
                        if (boolean) {
                            Object.assign (this.values, item)
                            this.values['purposes'] = data.purposes
                            this.values['borrowDate'] = data.borrowDate
                            this.values['remark'] = data.remark
                            this.values['filetype'] = JSON.stringify (this.filetype)
                            if (this.$route.params && this.$route.params.path === 'archiveRegistration') {
                                addBorrowedRecord (this.values).then (res => {
                                    if (res.code === 200) {
                                        this.$message.success ('保存成功')
                                        this.closePageTag ()
                                    }
                                })
                            } else {
                                editBorrowedRecord (this.values).then (res => {
                                    if (res.code === 200) {
                                        this.$message.success ('修改成功')
                                        this.closePageTag ()
                                    }
                                })
                            }
                        }
                    }
                })
            },

            closePageTag () {
                let tagName = this.$route.path
                let path = null
                if (this.stutas) {
                    path = `/approval/${this.stutas}`
                } else if(this.$route.params.identification === '1') {
                    path = `/administrativeManagement/archivesManagement/${this.$route.params.path}/jontProjectDetail/1`
                } else {
                    path = `/administrativeManagement/archivesManagement/${this.$route.params.path}/admin/0`
                }
                this.close ({tagName, path})
            },

            neatenData () {
                if (!this.selectOriginal && !this.selectElectronicDocument && !this.selectCopies) {
                    this.$message.warning ('至少选择一类档案')
                    return false
                } else {
                    this.filetype = []
                    if (this.selectOriginal) {
                        this.filetype.push ('0')
                    } 
                    if (this.selectElectronicDocument) {
                        this.filetype.push ('2')
                    } 
                    if (this.selectCopies) {
                        this.filetype.push ('1')
                    }
                    return true
                }
            },

            updataBorrowingApply (item, boolean) {
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                this.values['filetype'] = JSON.stringify (this.filetype)
                if (boolean) {
                    completeArchiveRegistration (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success (res.message)
                            this.closePageTag ()
                        }
                    })
                } else {
                    submitArchiveRegistration (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success ('提交成功')
                            this.closePageTag ()
                        }
                    })
                }
            },

            consentBorrowingApply (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closePageTag ()
                    return
                }
                if (item) {
                    if (this.values.filetype && this.values.filetype.length !== 0) {
                        this.values.filetype = JSON.stringify (this.values.filetype)
                    }
                    this.values['completeTask'] = item
                    completeArchiveRegistration (this.values).then (res => {
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

            selectCheck (list) {
                list.forEach (data => {
                    switch (data) {
                        case '0':
                            this.selectOriginal = true
                            break;
                        case '1':
                            this.selectCopies = true
                            break
                        case '2':
                            this.selectElectronicDocument = true
                            break
                    }
                })
            },

            selectGenerateChange (field, val, model) {
                switch (field) {
                    case 'dateReturn':
                        let endDate= Date.parse (val)
                        let startDate = Date.parse (this.values.borrowDate)
                        model.days = (endDate - startDate) / (1*24*60*60*1000)
                        break;
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
                    this.getArchiveRegistration (this.$route.params.relevancyId, this.$route.params.path)
                }
            }
        },

        created () {
            this.getFormByJson ()
            this.updataRouter ()
        }
    }
</script>

<style lang='scss' scoped>
    .borrowing-apply {
        .borrowing-apply-registration {
            padding: 15px 35px 0 30px;
            .borrowing-apply-registration-title {
                .borrowing-apply-registration-title___longString {
                        display: inline-block;
                        border-left: 3px solid $color-text-title;
                        p {
                            color:  $color-text-title;
                            display: inline-block;
                            margin: 0px;
                            margin-left: 10px;
                        }
                    }
                .borrowing-apply-registration-title-right___transverseLine {
                    width: 96.2%;
                    top: -5px;
                    border-top: solid $color-straight-line3 1px;
                    display: inline-block;
                    position: relative;
                    right: -20px;
                }
                .borrowing-apply-registration-title-right-copies___transverseLine {
                    width: 95.5%;
                    top: -5px;
                    border-top: solid $color-straight-line3 1px;
                    display: inline-block;
                    position: relative;
                    right: -20px;
                }
                .borrowing-apply-registration-title-right-electronic___transverseLine {
                    width: 94.66%;
                    top: -5px;
                    border-top: solid $color-straight-line3 1px;
                    display: inline-block;
                    position: relative;
                    right: -20px;
                }
            }
            .borrowing-apply-registration-content {
                padding: 10px 0;
            }
        }
    }
</style>
