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
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitUsingApplicationData (true)">重新提交</el-button>
                <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveUsingApplication">保存</el-button>
                <el-button type="primary" v-if="!transform.isShowDetails && procInstId === ''" @click="values['flag'] = '1', submitUsingApplicationData (false)">提交</el-button>
                <el-button type="info" size="mini" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                <el-button @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataUsingApplication"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentUsingApplication" />
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </d2-container>
</template>

<script>
    import { formGetJson } from '../../../../../api/system/fromManagement/index'
    import { getManagementSignetTree } from '../../../../../api/administrativeManagement/sealClassification'
    import { getAllSealRegistration } from '../../../../../api/administrativeManagement/managementSignet/sealRegistration'
    import { getUsingApplicationById, editUsingApplication, 
             addUsingApplication, getUsingApplication, 
             submitUsingApplication, accomplishUsingApplication } from '../../../../../api/administrativeManagement/managementSignet/usingApplication'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, upload } from '../../../../../components/qqt-subassembly'
    import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
    import { ADMINISTRATIVEMANAGEMENT } from '../../../../../enum/FORMCODE'
    import { getDetails } from '../../../../../api/approval/common'
    import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
    import { mapActions } from 'vuex'

    import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
    import printTemplateByHtml from '../../../../systemManagement/printTemplate/components/printTemplateByHtml'
    let than = this
    export default {
        
        name: 'updataUsingApplication',

        data () {
            return {
                stutas: '',
                title: '',
                procInstId: '',
                saveData: {},
                subData: {},
                jsonData: {},
                remote: {},
                sealInfo: [],
                treeList: [],
                nodeData: {
                    operation: '',
                    msg: ''
                },
                upLoadFileDefaultList: [],
                values: {
                    sealtype: '',
                    uappid: '',
                    encoding: '',
                    name: '',
                    dotype: '',
                    fenshu: '',
                    cishu: '',
                    reason: '',
                    fileList: []
                },
                transform: {
                    isShowDetails: false
                },
                prossValue: {
                    title: ''
                },
                processModuleId: ADMINISTRATIVEMANAGEMENT.USINGAPPLICATION,
                code: BASICSCODE.ADMIN_USEAPPLY,
                dialogVisible: false,
                visible: false,
                isReject: false,
                isSendBack: false,
                isTurnManage: false
            }
        },

        methods: {

            ...mapActions('d2admin/page', [
                'close',
            ]),

            getFormByJson () {
                formGetJson ({'code': ADMINISTRATIVEMANAGEMENT.USINGAPPLICATION}).then(res => {
                    if (res) {
                        this.jsonData = JSON.parse(res)
                    }
                })
            },

            getUsingApplication (id) {
                getUsingApplicationById ({'id': id}).then (res => {
                    if (res) {
                        this.values = res
                        this.prossValue.title = `用印申请:【 ${res.name} 】`
                        if (!this.$route.params.managementSignetTreeId) {
                            this.getSealRegistrationList (res.sealtype)
                        }
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

            saveUsingApplication () {
                let item = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && item) {
                        this.saveData = data
                        Object.assign (this.values, data, item)
                        if (this.values.fileList.length == 0 ) {
                            this.$message.warning ("附件不能为空")
                            return
                        }
                        if (this.values.id == null) {
                            addUsingApplication (this.values).then (res => {
                                if (res.code === 200) {
                                    this.$message.success ('保存成功')
                                    this.closePageTag ()
                                }
                            })
                        } else {
                            editUsingApplication (this.values).then (res => {
                                if (res.code === 200) {
                                    this.$message.success ('修改成功')
                                    this.closePageTag ()
                                }
                            })
                        }
                    }
                })
            },

            submitUsingApplicationData (boolean) {
                let item = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && item) {
                        this.saveData = data
                        Object.assign (this.values, data, item)
                        if (this.values.fileList.length == 0 ) {
                            this.$message.warning ("附件不能为空")
                            return
                        }
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
                    case 'sealtype':
                        if (!this.$route.params.managementSignetTreeId) { return }
                        this.getSealRegistrationList (val)
                        this.values.uappid = this.values.encoding = ''
                        this.values.sealtype = val
                        break
                    case 'uappid':
                        if (val !== '') {
                            let item = this.sealInfo.find (f => f.id === val)
                            if (item) {
                                this.values.encoding = item.encoding
                                this.values.name = item.name
                                this.prossValue.title = `用印申请:【 ${item.name} 】`
                                this.values.uappid = val
                            }
                        }
                        break
                    case 'dotype':
                        this.values.dotype = val
                        break
                    case 'fenshu':
                        this.values.fenshu = val
                        break
                    case 'cishu':
                        this.values.cishu = val
                        break
                    case 'reason':
                        this.values.reason = val
                        break
                }
            },

            closePageTag () {
                let path = ''
                let params = ''
                let name = ''
                let tagName = this.$route.path
                if (this.stutas == '') {
                    name = 'usingApplication'
                    path = '/administrativeManagement/managementSignet/usingApplication'
                    params = {
                        sealtype: this.saveData.sealtype ? this.saveData.sealtype : this.values.sealtype
                    }
                    this.close ({ tagName, path, name, params })
                } else {
                    path = `/approval/${this.stutas}`
                    this.close ({ tagName, path })
                }
            },

            getSealRegistrationList (id) {
                this.sealInfo = []
                getAllSealRegistration ({
                    'type': id,
                }).then (res => {
                    if (res && res.length > 0) {
                        this.sealInfo = res
                    }
                    this.neatenData ()
                })
            },

            neatenData () {
                this.remote = {
                    getSealtype (resolve) {
                        resolve (than.treeList)
                    },

                    getDotype (resolve) {
                        resolve ([
                            {
                                value: '1',
                                label: '文件'
                            },
                            {
                                value: '2',
                                label: '合同'
                            },
                            {
                                value: '3',
                                label: '证明'
                            },
                            {
                                value: '5',
                                label: '通知'
                            },
                            {
                                value: '4',
                                label: '公告'
                            },
                            {
                                value: '6',
                                label: '委托书'
                            },
                            {
                                value: '7',
                                label: '介绍信'
                            },
                            {
                                value: '8',
                                label: '汇报材料'
                            },
                            {
                                value: '9',
                                label: '其它'
                            },
                        ])
                    },

                    getName (resolve) {
                        resolve (than.sealInfo)
                    }
                }
            },

            updataUsingApplication (item, boolean) {
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                if (boolean) {
                    accomplishUsingApplication (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success (res.message)
                            this.closePageTag ()
                        }
                    })
                } else {
                    submitUsingApplication (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success ('提交成功')
                            this.closePageTag ()
                        }
                    })
                }
            },

            consentUsingApplication (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closePageTag ()
                    return
                }
                if (item) {
                    this.values['completeTask'] = item
                    accomplishUsingApplication (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success (res.message)
                            this.closePageTag ()
                        }
                    })
                }
            },

            getManagementSignetTreeList () {
                this.treeList = []
                getManagementSignetTree ().then(result => {
                    if (result.records && result.records.length > 0) {
                        this.treeList = result.records
                        console.log(this.treeList)
                    }
                    this.neatenData ()
                })
            },

            getDetailsList (taskId) {
                getDetails (taskId).then (res => {
                    if (res) {
                        this.nodeData = res
                    }
                })
            },

            upLoadFileCallBack (item) {
                this.values.fileList = item
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
                if (this.$route.params && this.$route.params.taskId) {
                    this.getDetailsList (this.$route.params.taskId)
                }
                if (this.$route.params && this.$route.params.managementSignetTreeId) {
                    this.values.sealtype = this.$route.params.managementSignetTreeId
                    this.getSealRegistrationList (this.$route.params.managementSignetTreeId)
                }
                if (this.$route.params && this.$route.params.relevancyId) {
                    this.getUsingApplication (this.$route.params.relevancyId)
                }
            }
        },

        created () {
            this.getFormByJson ()
            this.updataRouter ()
            this.getManagementSignetTreeList ()
        },

        mounted () {
            than = this
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

