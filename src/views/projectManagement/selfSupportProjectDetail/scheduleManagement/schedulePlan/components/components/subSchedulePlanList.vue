<template>
    <d2-container type="fulls" class="subSchedulePlanList">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
            </div>
            <div class="qqt-container-full-center___top">
                <qqt-flow-tabs :procInstId="procInstId">
                    <template slot="content">
                        <project-information-basic :transform="transform" :values="projectInfo" @projectCode="getProjectCode"  />
                        <fm-generate-form :data="jsonData" :remote="remote" :value="values" :transform="transform" ref="generateForm" @on-change="selectGenerateChange">
                            <template slot="planList">
                                <gantt-table :taskData="taskData" :isEdit="isEdit" :subPage="true" :gradeColor="colors" @editPlan="handleEdit"></gantt-table>
                            </template>
                        </fm-generate-form>
                        <!-- <bottomInformation :values="values" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation"></bottomInformation> -->
                    </template>
                </qqt-flow-tabs>
            </div>
            <div class="qqt-container-full-content___button">
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitSubSchedulePlanListData ()">重新提交</el-button>
                <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="primary" v-if="!transform.isShowDetails && procInstId === ''" @click="values['flag'] = '1', submitSubSchedulePlanListData ()">提交</el-button>
                <el-button @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <schedule-plan-add ref="form" :isChildren="isChildren" :taskData='taskData' :dialogVisible='planAddShow' :edit="edit" :planDetail='planDetail' :overallId='overallId'
			 :projectCode='projectCode' :title='planTitle' :transform='planTransform' @close="closeAdd"></schedule-plan-add>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataSubSchedulePlanList"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentSubSchedulePlanList" />
    </d2-container>
</template>

<script>
import { schedulePlanSubmit, schedulePlanResubmit, schedulePlanOperation, schedulePlanProcessQueryById,selfSchedulePlanQueryDetail,isChildren } from '@/api/selfProject/scheduleManagement/schedulePlan/index'
import { qqtSendProcess, qqtFlowTabs, qqtConsent, upload, qqtRelateTable } from '@/components/qqt-subassembly'
// import bottomInformation from '@/views/projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
import ganttTable from './ganttTable'
import schedulePlanAdd from "./schedulePlanAdd";
import projectInformationBasic from '../../../../operatingReserve/components/projectInformationBasic'
import { formGetJson } from '@/api/system/fromManagement/index'
import { PROPRIETARYPROJECT } from '@/enum/FORMCODE'
import { getDetails } from '@/api/approval/common'
import { mapActions } from 'vuex'

import util from '@/libs/util.js'
import log from '../../../../../../../libs/util.log'
let than = this
export default {

    data () {
        return {
            colors: [ '#8d43ad', '#42a1ff', '#2898b0', '#37373D', '#73C991', '#6B96AD' ],
            title: '',
            stutas: '',
            procInstId: '',
            remote: {},
            values: {},
            projectInfo:{},
            jsonData: {},
            schedulePlanFlow: {},
            isEdit:false,
            edit:false,
            planDetail:{},
            overallId:'',
            planTitle:'',
            projectCode:'',
            isChildren:false,
            planAddShow:false,
            planTransform: {
				isShowDetails: false
			},
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
            processModuleId: PROPRIETARYPROJECT.SUBSCHEDULEPLANLIST,
            upLoadFileDefaultList: [],
            taskData: [],
        }
    },

    methods: {

        ...mapActions('d2admin/page', [
            'close',
        ]),
        
         getProjectCode (projectCode) {
            this.values['projectCode'] = projectCode
        },
        closeAdd (type) {
            console.log(type);
            this.planDetail = {};
			this.planAddShow = false
        },
        handleEdit (task) {
            selfSchedulePlanQueryDetail({'id': task}).then(res => {
				this.planDetail = res
				this.planTitle = "编辑计划"
                this.edit = true
				this.planTransform.isShowDetails = false
                this.planAddShow = true
                this.overallId = res.overallId;
			})
			isChildren ({'id':task}).then(res=>{
				this.isChildren = res;
			})
        },

        selectGenerateChange (field, val, model) {},

        getFormByJson () {
            formGetJson ({ 'code': this.processModuleId }).then(res => {
                this.jsonData = JSON.parse(res)
            })
        },

        getSubSchedulePlanList (id) {
            schedulePlanProcessQueryById({'flowId': id}).then(res => {
                this.taskData = res.schedulePlans
                this.projectInfo = res.projectInfo
                this.schedulePlanFlow = res.schedulePlanFlow
                this.isEdit = res.schedulePlanFlow.procState == '4' || res.schedulePlanFlow.procState == '6' ? true :false; 
            })
        },

        submitSubSchedulePlanListData () {
            // let item = this.$refs.bottomInformation.getData()
            this.$refs.generateForm.getData ().then (data => {
                if (data) {
                    this.values['relevanceIdList'] = []
                    this.taskData.forEach(temData => {
                        this.values['relevanceIdList'].push(temData.id)
                    })
                    Object.assign (this.values, data)
                    this.dialogVisible = true
                    this.prossValue = {
                        title: this.$route.params.title || `任务计划审批`,
                        pdfId: this.$route.params.procDefId || '',
                        degree: this.$route.params.degree || '',
                        msg: '',
                    }
                }
            })
        },
 
        updataSubSchedulePlanList (item, boolean) {
            let url = ''
            this.isSendBack ? this.values.id = this.schedulePlanFlow.id : '';
            this.dialogVisible = this.isSendBack = false
            item['taskId'] = this.$route.params.taskId || ''
            this.values['completeTask'] = item
            this.values['projectCode'] = this.values.projectCode || this.$route.params.projectCode
            boolean ? url = schedulePlanResubmit : url = schedulePlanSubmit
            url (this.values).then (res => {
                if (res.code === 200) {
                    this.$message.success (res.message)
                    this.closePageTag ()
                }
            })
        },

        consentSubSchedulePlanList (item = '', boolean = false) {
            this.visible = this.isTurnManage = this.isReject = false
            if (boolean) {
                this.closePageTag ()
                return
            }
            if (item) {
                this.values['completeTask'] = item
                this.values.id = this.schedulePlanFlow.id;
                schedulePlanOperation (this.values).then (res => {
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

        closePageTag () {
            let tagName = this.$route.path
            let path = ``
            ? path = `/approval/${this.stutas}` : path = `/projectManagement/selfSupportProjectDetail/scheduleManagement/schedulePlan`
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
                this.getSubSchedulePlanList (this.$route.params.relevancyId)
            } else {
                if (this.$route.params.add) {
                    this.taskData = this.$route.params.planList
                }
            }
        }
    },

    created () {
        this.getFormByJson()
        this.updataRouter ()
    },

    mounted () {
        than = this
    },

    components: {
        'gantt-table': ganttTable,
        // 'bottomInformation': bottomInformation,
        'qqt-send-process': qqtSendProcess,
        'qqt-flow-tabs': qqtFlowTabs,
        'qqt-consent': qqtConsent,
        'up-load': upload,
        projectInformationBasic,
        schedulePlanAdd
    }
}
</script>

<style lang='scss'>
.subSchedulePlanList {
    .files-upload___right {
        margin-left: 120px
    }
}
</style>
