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
                            @btn-click="btnClick"
                            ref="generateForm"/>
                            <bottom-information :values="values" :fieldTitle="fieldTitle" :timeTitle="timeTitle" :isShowAccessory="false" :transform="transform" ref="bottomInformation" />
                    </template>
                </qqt-flow-tabs>
                <user-modules :showDialog="isShowAdminDialog" title="选择人员" :isShowInput="false" :isShowRole="false" @clearUserPage="clearUserPage" @closeFun="isShowAdminDialog = false"/>
            </div>

            <div class="operation-button">
                <el-button size="mini" type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submissionWorkAdjustment (true)">重新提交</el-button>
                <el-button size="mini" type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button size="mini" type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button size="mini" type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button size="mini" type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button size="mini" type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveWorkAdjustment">保存</el-button>
                <el-button size="mini" type="primary" v-if="!transform.isShowDetails && procInstId === '' && $has ('workAccommodation:list:submit')" @click="values['flag'] = '1', submissionWorkAdjustment (false)">提交</el-button>
                <el-button size="mini" v-if="transform.isShowDetails" type="info" @click="printTemplate">打印</el-button>
                <el-button size="mini" @click="closeTag">关闭</el-button>
            </div>
        </el-card>

        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="submitAdjustmentApproval"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentUsingApplication" />
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </d2-container>
</template>

<script>
    import { formGetJson } from '../../../../api/system/fromManagement/index'
    import { PERDONNELMANAGEMENT } from '../../../../enum/FORMCODE'
    import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
    import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
    import printTemplateByHtml from '@/views/systemManagement/printTemplate/components/printTemplateByHtml'
    import { mapActions } from 'vuex'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent } from '../../../../components/qqt-subassembly'
    import { workAdjustmentList, workUsreList, workListObjectData, workAdjustmentAdd, workQueryById, workAdjustmentEdit,
        workAdjustmentSubmit, workAdjustmentProcessOperation, queryAllOrganizations, queryAllByOrganizationId } from '../../../../api/personnelManagement/workAdjustment'
    import { getDetails } from '../../../../api/approval/common'
    import { GetPositionDic } from '../../../../api/system/staff/staff'
    import userModules from '../../../systemManagement/processDefinition/processModules/userModules'
    import bottomInformation from '../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
    import util from '@/libs/util.js'
    let that = this
    export default {

        data () {
            return {
                isAdd: false,
                isShowAdminDialog: false,
                values:{
                    name:'',
                    adjustNumber: '',
                    section: '',
                    sex: '',
                    age: '',
                    workingAge: '',
                    originalDepartment: '',
                    originalWorkUnit: '',
                    presentOccupation: ''
                },
                fieldTitle: '提交',
                timeTitle: '提交',
                jsonData: {},
                remark:'',
                remoteFuncs: {},
                // 单位
                workUnitArr: [],

                // 部门
                departmentArr: [],

                // 职务
                designatedPositionArr: [],

                transform: {
                    isShowDetails: false
                },

                // 提交
                dialogVisible: false,
                processModuleId: PERDONNELMANAGEMENT.WORKADJUSTMENT,
                isSendBack: false,
                prossValue: {
                    title: ''
                }, 
                
                submitData:{},
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
                code: BASICSCODE.HR_WORK_ACCOMMODATION
            }
        },

        methods: {

            getFormByJson () {
                formGetJson ({'code': PERDONNELMANAGEMENT.WORKADJUSTMENT}).then(res => {
                    if (res) {
                        this.jsonData = JSON.parse(res)
                    }
                })
            },

            // 初始化加载获取数据
            getWorkAdjustmentList () {
                workAdjustmentList({}).then( res => {
                    this.workAdjustmentData = res
                })
            },
            btnClick (value, field) {
                this.isShowAdminDialog = true
            },
            clearUserPage (list) {
                if (list.length !== 0 && list[0].id.indexOf ('D') != -1) {
                    this.$message.warning('请选择一个需要调整的人员')
                    return
                } else {
                    this.values.name = list[0].name
                    let id = list[0].id
                    this.getWorkUsreList (id)
                    this.isShowAdminDialog = false
                }
            },

            // 通过id获取人员信息
            getWorkUsreList (id) {
                workUsreList({
                    'id': id
                }) .then( res => {
                    this.values.sex = res.sex === '1' ? '男' : '女'
                    this.values.age = res.age ? res.age : " "
                    this.values.workingAge = res.workingAge ? res.workingAge : " "
                    this.values.originalDepartment = res.originalDepartment ? res.originalDepartment : " "
                    this.values.originalWorkUnit = res.originalWorkUnit ? res.originalWorkUnit : " "
                    this.values.presentOccupation = res.presentOccupation ? res.presentOccupation : " "
                })
            },
            
            // 拟任单位
            getQueryAllOrganizations () {
                queryAllOrganizations ().then( res => {
                    if (res) {
                        this.workUnitArr = res
                        this.neatenRemoteFuncs ()
                    }
                })
            },

            // 拟任部门
            getQueryAllByOrganizationId (id) {
                queryAllByOrganizationId ({
                    'id': id
                }).then( res => {
                    this.departmentArr = res
                    this.neatenRemoteFuncs ()
                })
            },

            // 拟任职位
            getGetPositionDic () {
                GetPositionDic().then ( res => {
                    this.designatedPositionArr = res
                    this.neatenRemoteFuncs ()
                })
            },
            
            // 表单下拉数据操作
            selectGenerateChange (id, value, model) {
                switch (id) {
                    
                    case 'workUnitId' :
                        this.workUnitArr.forEach(item => {
                            if(item.id === value){
                                model.workUnit = item.name ? item.name : " "
                                model.workUnitId = item.id ? item.id : " "
                                this.values = model
                                this.getQueryAllByOrganizationId (item.id)
                            }
                        })
                        break

                    case 'departmentIds' :
                        this.departmentArr.forEach(item => {
                            if(item.id === value){
                                model.department = item.name ? item.name : " "
                                model.departmentIds = item.id ? item.id : " "
                                this.values = model
                            }
                        })
                    break

                    case 'designatedPositionId' :
                        this.designatedPositionArr.forEach(item => {
                            if(item.id === value){
                                model.designatedPosition = item.name ? item.name : " "
                                model.designatedPositionId = item.id ? item.id : " "
                                this.values = model
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
                    this.getUsingApplication (this.$route.params.relevancyId)
                }
                this.getGetPositionDic ()
                this.getQueryAllOrganizations ()
            },

            getUsingApplication (id) {
                workQueryById ({'id': id}).then (res => {
                    if (res) {
                        this.values = res
                        this.values.designatedPositionId = res.designatedPosition
                        this.values.departmentIds = res.department
                        this.values.workUnitId = res.workUnit
                        this.values.name = res.name
                        this.prossValue.title = `工作调整:【 ${this.values.name} 】`
                        this.getQueryAllByOrganizationId (res.workUnitId)
                    }
                })
            },

            // 保存 && 编辑
            saveWorkAdjustment () {
                let info = {}
                info = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData().then(item => {
                    if(item && info) {
                        Object.assign ( this.values, item, info )
                        if(this.$route.params.isAdd){
                            // 保存
                            item.name = this.values.name
                            item.userId = item.name
                            workAdjustmentAdd(this.values).then( res => {
                                this.$message.success("保存成功")
                                this.getWorkAdjustmentList ()
                                this.closeTag()
                            }).catch(err => {
                                this.$message.error("保存失败")
                            })

                        } else if (this.$route.params.isEdit) {
                            // 编辑
                            item['id'] = this.values.id
                            workAdjustmentEdit(this.values).then( res => {
                                this.$message.success("编辑成功")
                                this.getWorkAdjustmentList ()
                                this.closeTag()
                            }).catch( err => {
                                this.$message.error("编辑失败")
                            })
                        }
                    }
                })
                
            },

            // 提交
            submissionWorkAdjustment (boolean) {
                this.$refs.generateForm.getData().then(item => {
                    if (item) {
                        this.prossValue.title = `工作调整:【 ${this.values.name} 】`
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
                let data =  {}
                    data = this.$refs.bottomInformation.getData ()
                    Object.assign ( this.values, data )
                if (boolean) {
                    workAdjustmentProcessOperation (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success (res.message)
                            this.closeTag ()
                        }
                    })
                } else {
                    workAdjustmentSubmit (this.values).then( res => {
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
                    workAdjustmentProcessOperation (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success (res.message)
                            this.closeTag ()
                        }
                    })
                }
            },

            neatenRemoteFuncs () {
                this.remoteFuncs = {
                    getDepartment (resolve) {
                        resolve(that.departmentArr) 
                    },
                    getDesignatedPosition (resolve) {
                        resolve(that.designatedPositionArr) 
                    },
                    getWorkUnit (resolve) {
                        resolve(that.workUnitArr) 
                    },
                    getSex (resolve) {
                        resolve ([
                            {
                                id: '1',
                                name: '男'
                            },
                            {
                                id: '2',
                                name: '女'
                            }
                        ])
                    }
                }
            },

            printTemplate () {
                getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.$route.params.relevancyId}).then(res => {
                    this.$refs.printTemp.printTemplate (res)
                })
            },
            closeTag () {
                let tagName = this.$route.path
                let path = '/personnelManagement/workAdjustmentModule'
                this.close ({ tagName, path })
            },
            ...mapActions('d2admin/page', [
                'close' 
            ]),
            
        },

        created () {
            this.updataRouter ()
            
            this.getFormByJson()
        },

        mounted () {
           that = this
        },

        components: {
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent,
            'bottom-information': bottomInformation,
            'user-modules': userModules,
            'print-template-by-html': printTemplateByHtml
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
</style>
