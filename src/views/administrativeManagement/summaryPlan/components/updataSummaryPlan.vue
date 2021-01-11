<template>
    <d2-container type="fulls" class="drawer-height">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
            </div>
            <el-form label-position="top" ref="summaryPlan"  label-width="80px" :rules="rules" :model="summaryPlan" size="medium">
                <div class="updata-summary-plan-drawer">
                    <el-divider content-position="left">
                        <div class="generate-from-divider___line"></div>
                        总结
                    </el-divider>
                    <div class="updata-summary-plan-drawer-content">
                        <el-row :gutter="24">
                            <el-col :span="8">
                                <el-form-item label="总结标题" prop="conclusionTitle">
                                    <qqt-input :value="summaryPlan.conclusionTitle" :readonly="!isShowElement" @input="summaryPlan.conclusionTitle = $event" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="总结类型" prop="summarizeTypesId">
                                    <qqt-select :value="summaryPlan.summarizeTypesId" v-if="isShowElement" style="width: 100%" :options="summaryOptions" @select="getSummaryPlanName ('summarizeTypesId', $event)" />
                                    <qqt-input :value="summaryPlan.summarizeTypes" v-else :readonly="true" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="总结周期" prop="conclusionTime">
                                    <el-date-picker type="daterange" :readonly="!isShowElement" style="width: 100%" v-model="summaryPlan.conclusionTime" value-format="yyyy-MM-dd"></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item prop="conclusionContent">
                                    <div></div>
                                    <quill-editor v-model="summaryPlan.conclusionContent" ref="conclusionContent" :options="editorOption" style="height: 150px; margin-bottom: 50px"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                    <el-divider content-position="left">
                        <div class="generate-from-divider___line"></div>
                        计划
                    </el-divider>
                    <div class="updata-summary-plan-drawer-content">
                        <el-row :gutter="24">
                            <el-col :span="8">
                                <el-form-item label="计划标题" prop="projectTitle">
                                    <qqt-input :value="summaryPlan.projectTitle" :readonly="!isShowElement" @input="summaryPlan.projectTitle = $event" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="计划类型" prop="projectTypeId">
                                    <qqt-select :value="summaryPlan.projectTypeId" v-if="isShowElement" style="width: 100%" :options="projectTypeOptions" @select="getSummaryPlanName ('projectTypeId', $event)" />
                                    <qqt-input :value="summaryPlan.projectType" v-else :readonly="true" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="计划周期" prop="plannedTime">
                                    <el-date-picker type="daterange" :readonly="!isShowElement" style="width: 100%" v-model="summaryPlan.plannedTime" value-format="yyyy-MM-dd"></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item prop="planContent">
                                    <quill-editor v-model="summaryPlan.planContent" ref="planContent" :options="editorOption" style="height: 150px; margin-bottom: 50px"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                    <el-divider content-position="left">
                        <div class="generate-from-divider___line"></div>
                        其他
                    </el-divider>
                    <div class="updata-summary-plan-drawer-content">
                        <el-row :gutter="24">
                            <el-col :span="12">
                                <el-form-item label="抄送给" prop="carbonCopyRecipientsId">
                                    <qqt-select :valueArray="summaryPlan.carbonCopyRecipientsId" v-if="isShowElement" :multiple="true" :filterable="true" style="width: 100%" :defaultProp="userOptions" :options="allUser" @select="getSummaryPlanName ('carbonCopyRecipientsId', $event)" />
                                    <qqt-input :value="summaryPlan.carbonCopyRecipients" v-else :readonly="true" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="可见范围" prop="visible">
                                    <qqt-select :value="summaryPlan.visible" style="width: 100%" v-if="isShowElement" :options="visualRangeOptions" @select="summaryPlan.visible = $event" />
                                    <qqt-input :value="summaryPlan.visibleName" v-else :readonly="true" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                    <bottomInformation class="bottomInformation" fieldTitle="上报" timeTitle="上报" :values="summaryPlan" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="{ isShowDetails: !isShowElement }" ref="bottomInformation"></bottomInformation>
                </div>
            </el-form>
            <div class="qqt-container-full-content___button">
                <el-button type="warning" v-if="isShowElement" @click="saveSummaryPlan ('0')">保存</el-button>
                <el-button type="primary" v-if="isShowElement" @click="saveSummaryPlan ('1')">提交</el-button>
                <el-button type="info" size="mini" v-if="!isShowElement" @click="printTemplate">打印</el-button>
                <el-button @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </d2-container>
</template>

<script>
    import { quillEditor } from 'vue-quill-editor'
    import { qqtSelect, upload, qqtInput } from '../../../../components/qqt-subassembly'
    import { getSummaryPlanById, editSummaryPlan, addSummaryPlan } from '../../../../api/administrativeManagement/summaryPlan'
    import { staffStaffDictionary} from '../../../../api/system/staff/staff'
    import { ROUTER } from '../../../../enum/MENU'
    import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
    import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
    import printTemplateByHtml from '@/views/systemManagement/printTemplate/components/printTemplateByHtml'
    import { mapState, mapActions } from 'vuex'

    import bottomInformation from '../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'
    export default {

        components: {
            'bottomInformation': bottomInformation,
            'quill-editor': quillEditor,
            'qqt-select': qqtSelect,
            'qqt-input': qqtInput,
            'print-template-by-html': printTemplateByHtml
        },

        data () {
            return {
                summaryPlan: {
                    conclusionTitle: '',
                    conclusionTime: '',
                    summarizeTypes: '日总结',
                    summarizeTypesId: 'date',
                    conclusionContent: '',
                    projectType: '日计划',
                    parentId: '',
                    projectTypeId: 'date',
                    projectTitle: '',
                    plannedTime: '',
                    planContent: '',
                    visible: '',
                    carbonCopyRecipientsId: [],
                    carbonCopyRecipients: '',
                    fileList: [],
                },
                summaryOptions: [
                    {
                        value: 'date',
                        label: '日总结'
                    },
                    {
                        value: 'week',
                        label: '周总结'
                    },
                    {
                        value: 'month',
                        label: '月总结'
                    },
                    {
                        value: 'season',
                        label: '季总结'
                    },
                    {
                        value: 'year',
                        label: '年总结'
                    },
                ],
                projectTypeOptions: [
                    {
                        value: 'date',
                        label: '日计划'
                    },
                    {
                        value: 'week',
                        label: '周计划'
                    },
                    {
                        value: 'month',
                        label: '月计划'
                    },
                    {
                        value: 'season',
                        label: '季计划'
                    },
                    {
                        value: 'year',
                        label: '年计划'
                    }
                ],
                rules: {
                    summarizeTypesId:[
                        { required: true, message: '总结类型不能为空', trigger: 'change' }
                    ],
                    conclusionTime:[
                        { required: true, message: '总结时间不能为空', trigger: 'change' }
                    ],
                    projectTypeId:[
                        { required: true, message: '计划类型不能为空', trigger: 'change' }
                    ],
                    plannedTime:[
                        { required: true, message: '计划时间不能为空', trigger: 'change' }
                    ],
                    carbonCopyRecipientsId:[
                        { required: true, message: '抄送人不能为空', trigger: 'change' }
                    ],
                    visible:[
                        { required: true, message: '可见范围不能为空', trigger: 'change' }
                    ],
                    conclusionContent: [
                        { required: true, message: '总结内容不能为空', trigger: 'change' }
                    ],
                    planContent: [
                        { required: true, message: '计划内容不能为空', trigger: 'change' }
                    ],
                    conclusionTitle: [
                        { required: true, message: '总结标题不能为空', trigger: 'blur' }
                    ],
                    projectTitle: [
                        { required: true, message: '计划标题不能为空', trigger: 'blur' }
                    ]
                },
                editorOption: {
                    placeholder: ''
                },
                userOptions: {
                    value: 'id',
                    label: 'name'
                },
                visualRangeOptions: [
                    {
                        value: '1',
                        label: '全部可见'
                    },
                    {
                        value: '2',
                        label: '上级可见'
                    },
                    {
                        value: '3',
                        label: '下级可见'
                    }
                ],
                upLoadFileDefaultList: [],
                isShowElement: false,
                allUser: [],
                code: BASICSCODE.SUMMARY_PLAN
            }
        },

        methods: {

            ...mapActions('d2admin/page', [
                'close',
            ]),

            getSummaryPlan (id) {
                getSummaryPlanById ({'id': id}).then (res => {
                    if (res) {
                        this.neatenData (res)
                    }
                })
            },

            saveSummaryPlan (status) {
                let item = this.$refs.bottomInformation.getData ()
                this.$refs.summaryPlan.validate ((valid) => {
                    if (valid && item) {
                        let data = JSON.parse (JSON.stringify (this.summaryPlan))
                        data['parentId'] = this.parentId
                        data['status'] = status
                        data['path'] = ROUTER.SUMMARYPLAN
                        data['conclusionTimeFinish'] = new Date (data['conclusionTime'][1])
                        data['conclusionTime'] = new Date (data['conclusionTime'][0])
                        data['plannedTimeFinish'] = new Date (data['plannedTime'][1])
                        data['plannedTime'] = new Date (data['plannedTime'][0])
                        data['carbonCopyRecipientsId'] = JSON.stringify (data['carbonCopyRecipientsId'])
                        Object.assign (data, item)
                        if (data.id == null) {
                            addSummaryPlan (data).then (res => {
                                if (res.code === 200) {
                                    this.$message.success ('保存成功')
                                    this.closePageTag ()
                                }
                            })
                        } else {
                            editSummaryPlan (data).then (res => {
                                if (res.code === 200) {
                                    this.$message.success ('修改成功')
                                    this.closePageTag ()
                                }
                            })
                        }
                    }
                })
            },

            upLoadFileCallBack (item) {
                this.summaryPlan.fileList = item
            },

            getPositionDic () {
                staffStaffDictionary ().then(res => {
                    this.allUser = res
                })
            },

            getSummaryPlanName (data, id) {
                let item = ''
                let str = ''
                switch (data) {
                    case 'summarizeTypesId':
                        if (!id) return
                        this.summaryPlan.summarizeTypesId = id
                        item = this.summaryOptions.find (f => f.value === id)
                        this.summaryPlan.summarizeTypes = item.label
                        this.summaryPlan.conclusionTime = []
                        break;
                    case 'projectTypeId':
                        if (!id) return
                        this.summaryPlan.projectTypeId = id
                        item = this.projectTypeOptions.find (f => f.value === id)
                        this.summaryPlan.projectType = item.label
                        this.summaryPlan.plannedTime = []
                        break
                    case 'carbonCopyRecipientsId':
                        this.summaryPlan.carbonCopyRecipientsId = id
                        id.forEach (res => {
                            item = this.allUser.find (f => f.id === res)
                            if (item) {
                                str += item.name + ','
                            }
                            this.summaryPlan.carbonCopyRecipients = str.substring (0, str.length - 1)
                        })
                        break
                }
            },
            
            neatenData (res) {
                let list = []
                let item = ''
                item = this.summaryOptions.find (f => f.label.includes (res.summarizeTypes))
                if (item) {
                    res.summarizeTypesId = item.value
                }
                item = this.projectTypeOptions.find (f => f.label.includes (res.projectType))
                if (item) {
                    res.projectTypeId = item.value
                }
                item = this.visualRangeOptions.find (f => f.value === res.visualRange)
                if (item) {
                    res['visible'] = item.value,
                    res['visibleName'] = item.label
                }
                if (res.carbonCopyRecipientsId.indexOf (',') !== -1) {
                    list = res.carbonCopyRecipientsId.split (',')
                } else {
                    list.push (res.carbonCopyRecipientsId)
                }
                res.carbonCopyRecipientsId = list
                res.conclusionTime = [res.conclusionTime + '', res.conclusionTimeFinish + '']
                res.plannedTime = [res.plannedTime + '', res.plannedTimeFinish + '']
                this.summaryPlan = res
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

                if (!this.isShowElement) {
                    this.$refs.conclusionContent.quill.enable(false)
                    this.$refs.planContent.quill.enable(false)
                }
            },

            closePageTag () {
                let tagName = this.$route.path
                let path = `/administrativeManagement/summaryPlan/${this.$route.params.identification}`
                this.close ({tagName, path})
            },

            printTemplate () {
                getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.$route.params.archiveId}).then(res => {
                    if (res) this.$refs.printTemp.printTemplate (res)
                })
            }
        },

        created () {
            this.getPositionDic ()
            if (this.$route.params.archiveId) {
                this.getSummaryPlan (this.$route.params.archiveId)
            }
            this.isShowElement = this.$route.params.isShowElement || false
        }
    }
</script>

<style lang='scss'>
    .drawer-height {
        .updata-summary-plan-drawer {
            padding: 15px 30px 0 30px;
            .updata-summary-plan-drawer-content {
                padding: 10px 0 0 35px;
            }
            .bottomInformation {
                .el-form-item__label {
                    float: left !important;
                    text-align: right !important;
                    padding: 0 15px 10px 0 !important
                }
            }
        }
        .updata-summary-plan-drawer___button {
            text-align: center;
            margin-left: -20px;
            button {
                height: 30px;
                padding: 6px 10px;
                .el-button--primary {
                    background-color: $color-button-dialog-affirm
                }
            }
        }
        .el-input__inner {
            border-radius: 0px !important
        }
    }
</style>
