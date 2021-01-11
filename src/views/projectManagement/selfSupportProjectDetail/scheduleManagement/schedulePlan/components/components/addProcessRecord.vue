<template>
    <d2-container type="fulls" class="addProcessRecord">
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
                            @on-change="selectGenerateChange">
                            <template slot="inputNumber">
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item class="inpitRecord" label-width="130px" label="完成百分比" prop="percent">
                                            <el-input :disabled="transform.isShowDetails" v-model="numberObj.percent" type="number" @input="percentChange($event,'percent')"  onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''" >
                                                <template slot="append">%</template>
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item class="inpitRecord" label-width="130px" label="打分" prop="rating">
                                            <el-input :disabled="transform.isShowDetails" v-model="numberObj.rating" type="number" @input="percentChange($event,'rating')"  onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''" >
                                                <template slot="append">%</template>
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </template>
                        </fm-generate-form>
                        <bottom-information :values="values" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation" />
                    </template>
                </qqt-flow-tabs>
            </div>
            <div class="qqt-container-full-content___button">
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitAddProcessRecordData ()">重新提交</el-button>
                <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveAddProcessRecord">保存</el-button>
                <el-button type="primary" v-if="!transform.isShowDetails && procInstId === ''" @click="values['flag'] = '1', submitAddProcessRecordData ()">提交</el-button>
                <el-button @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataAddProcessRecord"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentAddProcessRecord" />
    </d2-container>
</template>

<script>
import { selfSchedulePlanOrderedList, addProcessRecord, editProcessRecord, subProcessRecord, reSubProcessRecord, 
        processRecordOperation, processRecordQueryById,processRecordDonePercent } from '@/api/selfProject/scheduleManagement/schedulePlan/index';
import { qqtSendProcess, qqtFlowTabs, qqtConsent, qqtRelateTable } from '@/components/qqt-subassembly';
import bottomInformation from '@/views/projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation';
import { formGetJson } from '@/api/system/fromManagement/index';
import { getUserDepartById } from '@/api/system/depart/depart';
import { PROPRIETARYPROJECT } from '@/enum/FORMCODE';
import { queryDicById } from '@/api/system/dic/dic';
import { getDetails } from '@/api/approval/common';
import { mapActions } from 'vuex';
import util from '@/libs/util.js';
let than = this
export default {
    data () {
        return {
            title: '',
            stutas: '',
            procInstId: '',
            remote: {},
            values: {
                planStartDate: '', 
                planEndDate: '', 
                planLimit: '', 
                taskPrincipal: '',
            },
            jsonData: {},
            nodeData: {
                operation: '',
                msg: ''
            },
            numberObj:{
                percent:'',
                rating:'',
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
            processModuleId: PROPRIETARYPROJECT.ADDPROCESSRECORD,
            upLoadFileDefaultList: [],
            departmentList: [],
            planList: [],
            projectCode: '',
            maxNum:0
        }
    },

    methods: {

        ...mapActions('d2admin/page', [
            'close',
        ]),
        percentChange (value,type) {
            if (type === 'percent') {
                return value > this.maxNum ? value = this.maxNum : value,this.numberObj.percent = value;
            } else {
                return value > 100 ? value = 100 : value,this.numberObj.rating = value;
            }
        },
        selectGenerateChange (field, value, model) {
            switch (field) {
                case 'divideId':
                    let planTem = this.planList.find(el => el.id === value)
                    if (planTem) {
                        model.divideName = planTem.name
                        model.doneContent = planTem.sort
                        let {planStartDate, planEndDate, planLimit, taskPrincipal} = planTem
                        Object.assign(model, {planStartDate, planEndDate, planLimit, taskPrincipal})
                        this.getMax(value)
                    }
                    break
            }
            Object.assign(this.values, model)
        },
        getMax(id,dataId) {
            processRecordDonePercent({'overallId':id,id:dataId}).then(res=> {
                this.maxNum = res;
            })
        },
        getFormByJson () {
            formGetJson ({ 'code': this.processModuleId }).then(res => {
                let data = JSON.parse(res)
                if (this.values.id) {
                    data.list[1].columns[0].list[0].options.disabled =  true;
                }
                this.jsonData = data;
            })
        },

        getAddProcessRecord (id) {
            processRecordQueryById ({'id': id}).then (res => {
                if (res) {
                    this.numberObj = {...res} 
                    Object.assign (this.values, res)
                    // 
                    this.getMax(res.divideId,res.id)
                    this.prossValue.title = `进度记录审批:【 ${this.values.divideName} 】`
                    this.procInstId = res.procInstId || ''
                    this.fileDefaultNeaten (res)
                    this.getPlanList (this.values.overallId)
                }
            })
        },

        saveAddProcessRecord () {
            if (!this.numberObj.percent) {
                this.$message.error('请输入完成百分比');
                return
            }
            if (!this.numberObj.rating) {
                this.$message.error('请输入打分');
                return
            }
            let url = '', boolean = {}
            let item = this.$refs.bottomInformation.getData()
            this.$refs.generateForm.getData ().then (data => {
                if (data && boolean && item) {
                    this.values.projectCode = this.values.projectCode || this.projectCode
                    this.values.overallId = this.values.overallId || this.$route.params.overallId
                    Object.assign (this.values, data, item)
                    this.values.id == null ? url = addProcessRecord : url = editProcessRecord
                    let newData =  Object.assign (this.values, this.numberObj)
                    url (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success ('保存成功')
                            this.closePageTag ()
                        }
                    })
                }
            })
        },

        submitAddProcessRecordData () {
            if (!this.numberObj.percent) {
                this.$message.error('请输入完成百分比');
                return
            }
            if (!this.numberObj.rating) {
                this.$message.error('请输入打分');
                return
            }
            let item = this.$refs.bottomInformation.getData()
            this.$refs.generateForm.getData ().then (data => {
                if (data && item) {
                    this.values.projectCode = this.values.projectCode || this.projectCode
                    this.values.overallId = this.values.overallId || this.$route.params.overallId
                    Object.assign (this.values, data, item)
                    this.dialogVisible = true
                    this.prossValue = {
                        title: this.$route.params.title || `进度记录审批:【 ${this.values.divideName} 】`,
                        pdfId: this.$route.params.procDefId || '',
                        degree: this.$route.params.degree || '',
                        msg: '',
                    }
                }
            })
        },

        updataAddProcessRecord (item, boolean) {
            let url = ''
            this.dialogVisible = this.isSendBack = false
            item['taskId'] = this.$route.params.taskId || ''
            Object.assign(this.values,this.numberObj)
            this.values['completeTask'] = item
            boolean ? url = reSubProcessRecord : url = subProcessRecord
            url (this.values).then (res => {
                if (res.code === 200) {
                    this.$message.success (res.message)
                    this.closePageTag ()
                }
            })
        },

        consentAddProcessRecord (item = '', boolean = false) {
            this.visible = this.isTurnManage = this.isReject = false
            if (boolean) {
                this.closePageTag ()
                return
            }
            if (item) {
                this.values['completeTask'] = item
                processRecordOperation (this.values).then (res => {
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
            this.stutas ? path = `/approval/${this.stutas}` : path = `/projectManagement/selfSupportProjectDetail/scheduleManagement/schedulePlan`
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
                this.getAddProcessRecord (this.$route.params.relevancyId)
            } else {
                this.getPlanList(this.$route.params.overallId)
                this.projectCode = this.$route.params.projectCode
            }
        },

        getPlanList (id) {
            selfSchedulePlanOrderedList({'overallId': id}).then(res => {
                let arr = []
                res.forEach(item => {
                    let hasNoChild = true
                    res.forEach(temData => {
                        if (item.id === temData.parentId) {
                            hasNoChild = false
                        }
                    })
                    if (hasNoChild) { arr.push(item) }
                })
                this.setRemote(arr)
                this.planList = arr
            })
        },

        setRemote (list) {
            this.remote = {
                divideIdList (resolve) { resolve (list) }
            }
            this.getFormByJson ()
        }

    },

    created () {
        this.updataRouter ()
    },

    mounted () {
        than = this
    },

    components: {
        'bottomInformation': bottomInformation,
        'qqt-send-process': qqtSendProcess,
        'qqt-flow-tabs': qqtFlowTabs,
        'qqt-consent': qqtConsent,
    }
}
</script>

<style lang='scss'>
.addProcessRecord {
    .files-upload___right {
        margin-left: 120px
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    }
    input[type="number"]{
    -moz-appearance: textfield;
    }
    .inpitRecord {
        .el-form-item__label:before {
            content: '*';
            color: #F56C6C;
            margin-right: 4px;
            width: 10px;
            height: 20px;
            display: inline-block;
            vertical-align: middle;
            text-align: center;
            line-height: 26px;
            font-size: 25px;
        }
    }
}
</style>
