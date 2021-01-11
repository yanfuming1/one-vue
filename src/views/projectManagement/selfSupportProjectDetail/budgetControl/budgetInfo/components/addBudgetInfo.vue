<template>
    <d2-container type="fulls" class="addBudgetInfo">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
            </div>
            <div class="qqt-container-full-center___top">
                <qqt-flow-tabs :procInstId="procInstId">
                    <template slot="content">
                        <project-information-basic :transform="transform" :values="values" @projectCode="getProjectCode" />
                        <fm-generate-form 
                            :data="jsonData"
                            :remote="remote"
                            :value="values"
                            :transform="transform"
                            ref="generateForm"
                            @on-change="selectGenerateChange">
                            <template slot="excelTable">
                                <pro-category-excel ref="proCategoryExcel" @exportExcel="exportExcel" :fromChange="fromChange" :values="values" :isShowDetails="transform.isShowDetails"></pro-category-excel>
                            </template>
                        </fm-generate-form>
                        <bottom-information :fieldTitle="'录入'" :timeTitle="'录入'" :values="values" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation" />
                    </template>
                </qqt-flow-tabs>
            </div>
            <div class="qqt-container-full-content___button">
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitAddBudgetInfoData ()">重新提交</el-button>
                <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveAddBudgetInfo">保存</el-button>
                <el-button type="primary" v-if="!transform.isShowDetails && procInstId === ''" @click="values['flag'] = '1', submitAddBudgetInfoData ()">提交</el-button>
                <el-button @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataAddBudgetInfo"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentAddBudgetInfo" />
    </d2-container>
</template>

<script>
import { getBudgetInfoById, editBudgetInfo, addBudgetInfo, submitBudgetInfo, 
         completeBudgetInfo, resetSubmitBudgetInfo } from '@/api/selfProject/budgetControl/budgetInfo'
import { budgetExportXls } from '@/api/selfProject/budgetControl/budgetChange'
import { newFastDFSDel, newFastDFSDownload, fastDFSDownload } from '@/api/system/file/file'
import { qqtSendProcess, qqtFlowTabs, qqtConsent, upload, qqtRelateTable } from '@/components/qqt-subassembly'
import bottomInformation from '../../../businessBidding/components/bottomInformation'
import projectInformationBasic from '../../../operatingReserve/components/projectInformationBasic'
import proCategoryExcel from '../../components/proCategoryExcel'
import { selfQueryBaseMsgByCode } from '@/api/selfProject/allProject'
import { formGetJson } from '@/api/system/fromManagement/index'
import { getUserDepartById } from '@/api/system/depart/depart'
import { PROPRIETARYPROJECTDICTIONARY } from '@/enum/DICTIONARY'
import { queryDicByIds } from '@/api/system/dic/dic'
import { PORJECT_INFO } from '@/enum/SELFPROJECT'
import { getDetails } from '@/api/approval/common'
import { mapActions, mapState } from 'vuex'
import util from '@/libs/util.js'
let than = this
export default {

    data () {
        return {
            title: '',
            stutas: '',
            procInstId: '',
            remote: {},
            values: {},
            jsonData: {},
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
            processModuleId: PORJECT_INFO.ADDBUDGETINFO,
            upLoadFileDefaultList: [],
            departmentList: [],
            proCode: '',
            budgetTypeList: [],
            fromChange: false,
            urlList: [],
        }
    },
    beforeDestroy () {
        if (this.urlList.length > 0) {
            console.log(this.urlList)
            newFastDFSDel({'filePath': util.jointData(this.urlList, ',')}).then(res => {})
        }
    },
    methods: {

        ...mapActions('d2admin/page', [
            'close',
        ]),

        getProjectCode (projectCode) {
            this.values['projectCode'] = projectCode
        },

        exportExcel () {
            if (this.values.id) {
                budgetExportXls({"id": than.values.id}).then(res => {
                    this.urlList.push(res)
                    let fileName = than.values.excelModelType.execlTypeName + ".xls"
                    const elink = document.createElement('a')
                    elink.download = fileName
                    elink.style.display = 'none'
                    elink.href = process.env.VUE_APP_API+"/file/download?fileOldName="+fileName+"&filePath="+res
                    document.body.appendChild(elink)
                    elink.click()
                    URL.revokeObjectURL(elink.href) // 释放URL 对象
                    document.body.removeChild(elink)
                })
            }
        },

        selectGenerateChange (field, value, model) {
            switch (field) {
                case 'budgetTypeId':
                    this.values.budgetTypeId = value
                    let tem = this.budgetTypeList.find(el => el.id === value)
                    if(tem) this.values.budgetTypeDic = tem.name
                    break
                default:
                    this.values[field] = value
                    break
            }
        },

        getFormByJson () {
            formGetJson ({ 'code': this.processModuleId }).then(res => {
                if (res) this.jsonData = JSON.parse(res)
            })
        },

        getAddBudgetInfo (id) {
            getBudgetInfoById ({'id': id}).then (res => {
                if (res) {
                    this.values = Object.assign ({}, this.values, res)
                    if (this.$route.params.type === 'change') {
                        // 从变更进来
                        delete res.procInstId
                        delete res.procState
                    } else {
                        this.procInstId = res.procInstId || ""
                        this.prossValue.title = `自营预算审批:【 ${this.values.budgetName} 】`
                    }
                    this.fileDefaultNeaten (res)
                    this.getFormByJson ()
                }
            })
        },

        saveAddBudgetInfo () {
            let url = ''
            let item = this.$refs.bottomInformation.getData()
            let excelData = this.$refs.proCategoryExcel.getData()
            this.$refs.generateForm.getData().then (data => {
                if (data && item && excelData) {
                    Object.assign (this.values, data, item, excelData)
                    if(this.values.excelModelType === ''){
                        this.$message.warning("请导入预算表格!!!")
                        return false
                    }
                    this.values.id == null ? url = addBudgetInfo : url = editBudgetInfo
                    url (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success ('保存成功')
                            this.closePageTag ()
                        }
                    })
                }
            })
        },

        submitAddBudgetInfoData () {
            let item = this.$refs.bottomInformation.getData()
            let excelData = this.$refs.proCategoryExcel.getData()
            this.$refs.generateForm.getData ().then (data => {
                if (data && item && excelData) {
                    Object.assign (this.values, data, excelData, item)
                    if(this.values.excelModelType === ''){
                        this.$message.warning("请导入预算表格!!!")
                        return false
                    }
                    this.dialogVisible = true
                    this.prossValue = {
                        title: this.$route.params.title || `自营预算审批:【 ${data.budgetName} 】`,
                        pdfId: this.$route.params.procDefId || '',
                        degree: this.$route.params.degree || '',
                        msg: '',
                    }
                }
            })
        },

        updataAddBudgetInfo (item, boolean) {
            let url = ''
            this.dialogVisible = this.isSendBack = false
            item['taskId'] = this.$route.params.taskId || ''
            this.values['completeTask'] = item
            boolean ? url = resetSubmitBudgetInfo : url = submitBudgetInfo
            url (this.values).then (res => {
                if (res.code === 200) {
                    this.$message.success (res.message)
                    this.closePageTag ()
                }
            })
        },

        consentAddBudgetInfo (item = '', boolean = false) {
            this.visible = this.isTurnManage = this.isReject = false
            if (boolean) {
                this.closePageTag ()
                return
            }
            if (item) {
                this.values['completeTask'] = item
                completeBudgetInfo (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closePageTag ()
                    }
                })
            }
        },

        getQueryDicByIdList () {
            let list = [ PROPRIETARYPROJECTDICTIONARY.BUDGETSTYLE ]
            queryDicByIds (list).then (item => {
                if (!item) return
                this.budgetTypeList = item[PROPRIETARYPROJECTDICTIONARY.BUDGETSTYLE]
                this.setRemote()
            })
        },

        setRemote () {
            this.remote = {
                getBudgetTypeList (resolve) { resolve(than.budgetTypeList) }
            }
        },

        getDetailsList (taskId) {
            getDetails (taskId).then (res => { if (res) this.nodeData = res })
        },

        closePageTag () {
            let tagName = this.$route.path
            let path = ``
            this.stutas ? path = `/approval/${this.stutas}` : path = `/projectManagement/selfSupportProjectDetail/budgetControl/budgetInfo`
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
                this.getAddBudgetInfo (this.$route.params.relevancyId)
            } else {
                this.getFormByJson ()
            }
        }
    },

    created () {
        this.getQueryDicByIdList ()
        this.updataRouter ()
    },

    mounted () {
        than = this
        console.log (this.$route.params.type)
    },

    components: {
        'project-information-basic': projectInformationBasic,
        'bottomInformation': bottomInformation,
        'pro-category-excel': proCategoryExcel,
        'qqt-send-process': qqtSendProcess,
        'qqt-flow-tabs': qqtFlowTabs,
        'qqt-consent': qqtConsent,
        'up-load': upload
    }
}
</script>

<style lang='scss'>
    .addBudgetInfo {
        .files-upload___right {
            margin-left: 120px
        }
    }
</style>
