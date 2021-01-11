<template>
    <d2-container class="address-book open-tender">
        <el-card class="box-card closeHeader">
            <div slot="header"><el-button type="text" @click="closeTab"><i class="el-icon-close"></i></el-button></div>
            <div class="qqt-container-full-center___top">
                <qqt-flow-tabs :procInstId="procInstId">
                    <template slot="content">
                        <fm-generate-form
                            :data="jsonData"
                            :remote="remoteFuncs"
                            :remoteOption="remoteOption"
                            :value="values"
                            :transform="transform"
                            @on-change="valueChange"
                            @btn-click="formClick"
                            ref="generateForm">
                            <template slot="addline">
                                <material-list ref="materialList" :receiveApply="receiveApply" :dataInfo='materialListData' :depositoryId="depositoryId" @calculateTotal='calculateTotal' :isShowDetails="transform.isShowDetails"></material-list>
                            </template>
                        </fm-generate-form>
                        <div class="up-load-div">
                            <up-load :isShowUpload="!transform.isShowDetails" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList" ref="upload"/>
                        </div>
                        <bottomInformation :fieldTitle="'申请'" :timeTitle="'申请'" :values="values" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
                    </template>
                </qqt-flow-tabs>
            </div>
            <div class="drawer-btn qqt-container-full-content___button">
                <el-button type="warning" size="small" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitPurchaseRequestData ()">重新提交</el-button>
                <el-button type="primary" size="small" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" size="small" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" size="small" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" size="small" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId === ''" size="small" @click="subNewPro">保存</el-button>
                <el-button v-if="!transform.isShowDetails && procInstId === '' && $has('material:use:application:submit')" type="primary" size="small" @click="values['flag'] = '1', submitPurchaseRequestData ()">提交</el-button>
                <el-button size="small" @click="closeTab">关闭</el-button>
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataPurchaseRequest"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentPurchaseRequest" />
        <popout-entreport :dialogVisible="factoryVisible" @close="getPopoutEntreport" />
    </d2-container>
</template>
<script>
import { mapActions } from 'vuex'
import { qqtSendProcess, qqtFlowTabs, qqtConsent, upload, qqtRelateTable } from '@/components/qqt-subassembly'
import popoutEntreport from '../../../basicInformation/entrepot/components/popoutEntreport'
import materialList from '../../components/materialList'
import { getAllSelfProject, getAllJointProject } from '@/api/jointProject/index'
import { getUserDepartById } from '@/api/system/depart/depart'
import { MATERIALEQUIPMENTMANAGEMENT } from '../../../../../enum/FORMCODE'
import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
import { synopsisList, receiveAdd, receiveEdit, receiveQueryById, submitReceiveAdd, 
        reSubmitReceiveAdd, receiveProOperation } from '@/api/materialEquipmentManagement/receiveManagement/receiveApply/index'
import { getDetails } from '@/api/approval/common'
import { formGetJson } from '@/api/system/fromManagement/index'
import util from '@/libs/util'
import log from '../../../../../libs/util.log'
let that = this
export default {
    name: 'receiveAdd',
    components: {
        materialList,
        'popout-entreport': popoutEntreport,
        'qqt-send-process': qqtSendProcess,
        'qqt-flow-tabs': qqtFlowTabs,
        'qqt-consent': qqtConsent,
        'up-load': upload,
        'qqt-relate-table': qqtRelateTable,
        'bottomInformation': bottomInformation
    },
    data () {
        return {
            jsonData: {},
            remoteFuncs: {},
            remoteOption: {
                projectTypeList: [
                    { value: '1', label: '自营' },
                    { value: '2', label: '联营' },
                ]
            },
            values: {
                applicant: util.cookies.get ('uuid'),
                depositoryName: '',
                depositoryAddress: '',
                totalprice: '0',
                projectType: '',
                relatedProject: '',
                relatedProjectId: '',
                section: '',
                relatedTemId: '',
            },
            transform: {
                isShowDetails: false,
            },
            upLoadFileDefaultList: [],
            selectOption: {
                projectList: [],
            },
            fileList: [],
            materialListData: [],
            factoryVisible: false,
            factoryItem: {},

            // 流程 
            procInstId: '',
            isSendBack: false,
            stutas: '',
            title: '',
            nodeData: {
                operation: '',
                msg: ''
            },
            dialogVisible: false,
            visible: false,
            isReject: false,
            isTurnManage: false,
            processModuleId: MATERIALEQUIPMENTMANAGEMENT.RECEIVEAPPLY,
            prossValue: {
                title: ''
            },
            depositoryId: '',
            receiveApply: true,
        }
    },
    methods: {
        ...mapActions('d2admin/page', [
            'close'
        ]),
        valueChange (field, value, model) { 
            switch (field) {
                case 'projectType':
                    // 选择项目类型
                    this.values.projectType = value
                    this.values.relatedProjectId = ''
                    value === '1' ? this.getAllSelfProjectList() : this.getAllJointProjectList()
                    break
                case 'relatedTemId':
                    // 选择项目
                    let temPro = this.selectOption.projectList.find(el => el.id === value)
                    if (temPro) {
                        this.values.relatedProjectId = this.values.projectType === '1' ? temPro.projectCode : value
                        this.values.relatedProject = temPro.projectName
                        this.values.section = this.values.projectType === '1' ? temPro.sectionDic : temPro.section
                    }
                    break
            }
        },
        getAllJointProjectList (type) {
            getAllJointProject ().then (res => {
                if (res instanceof Array) this.selectOption.projectList = res, this.setRomte (this.selectOption)
                if (type) {
                    // 联营
                    this.values.relatedTemId = this.values.relatedProjectId
                }
            })
        },
        getAllSelfProjectList (type) {
            getAllSelfProject ().then (res => {
                if (res instanceof Array) this.selectOption.projectList = res, this.setRomte (this.selectOption)
                if (type) {
                    // 自营
                    let temPro = res.find(el => el.projectCode === this.values.relatedTemId)
                    if (temPro) {
                        this.values.relatedTemId = temPro.id
                    }
                }
            })
        },


        getPopoutEntreport (item) {
            if (item) {
                this.factoryItem = item
                this.depositoryId = item.id
                this.values.depositoryName = item.name
                this.values.depositoryAddress = item.address + item.detailedAddress
            }
            this.factoryVisible = false
        },
        // 计算总价
        calculateTotal (total) {
            this.values.totalprice = '0'
        },
        closeTab () {
            this.$router.go(-1)
            let tagName = this.$route.path
            this.close ({ tagName })
        },
        getJson () {
            formGetJson({
                code: MATERIALEQUIPMENTMANAGEMENT.RECEIVEAPPLY
            }).then(res => {
                this.jsonData = JSON.parse(res)
            })
        },
        formClick (field) {
            switch(field) {
                case 'depositoryName':
                    if(!this.transform.isShowDetails) {
                        this.factoryVisible = true
                    }
                    break
            }
        },
        // 文件上传
        upLoadFileCallBack (data) {
            this.fileList = data
        },

        prepareData (res) {
            res.fileList = this.fileList
            if(util.isArray(res.section)) { res.section = util.jointData(res.section) }
            res.depositoryId = this.factoryItem.id
            res.materialList = this.$refs.materialList.getData()
            res.materialList.forEach(item => {
                item.number2 = null
                item.number3 = null
                item.number4 = null
                item.number5 = null
            })
            return res
        },
        validData (temData) {
            let canSave = true
            this.values.materialList.forEach(item => {
                if (item.number1 === "0" || item.number1 === '' || item.number1 === 'undefined') { canSave = false }
            })
            if (!canSave) { this.$message.warning('领用材料的领用数量为0或者未填写!!!')}
            return canSave
        },
        // 保存
        subNewPro () {
            let url = ''
            let item = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData ().then (data => {
                if (data && item) {
                    Object.assign (this.values, data, item)
                    this.values = this.prepareData(this.values)
                    if(!this.validData(this.values)) { return }
                    this.$route.params.relevancyId === null || this.$route.params.relevancyId === undefined ? url = receiveAdd : url = receiveEdit, this.values['id'] = this.$route.params.relevancyId
                    url (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success ('保存成功~~~')
                            this.closeTab ()
                        }
                    })
                }
            })
        },
        // 提交
        submitPurchaseRequestData () {
            let item = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData().then(res => {
                if (res && item) {
                    Object.assign (this.values, res, item)
                    this.values = this.prepareData(this.values)
                    if(!this.validData(this.values)) { return }
                    this.dialogVisible = true
                    this.prossValue = {
                        title: this.$route.params.title || `领用申请:【 ${res.applyname} 】`,
                        pdfId: this.$route.params.procDefId || '',
                        degree: this.$route.params.degree || '',
                        msg: '',
                    }
                }
            })
        },
        // 提交窗口返回函数
        updataPurchaseRequest (item, boolean) {
            let url = ''
            this.dialogVisible = this.isSendBack = false
            item['taskId'] = this.$route.params.taskId || ''
            this.values['completeTask'] = item
            // 前面是重新提交，后面是提交
            boolean ? url = reSubmitReceiveAdd : url = submitReceiveAdd
            url (this.values).then (res => {
                if (res.code === 200) {
                    this.$message.success (res.message)
                    this.closeTab ()
                }
            })
        },
        // 审批
        consentPurchaseRequest (item = '', boolean = false) {
            this.visible = this.isTurnManage = this.isReject = false
            if (boolean) {
                this.closeTab ()
                return
            }
            if (item) {
                this.values['completeTask'] = item
                receiveProOperation (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closeTab ()
                    }
                })
            }
        },

        setRomte (option) {
            this.remoteFuncs = {
                getApplyType (resolve) {
                    let option = [
                        { value: '0', label: '项目使用' },
                        { value: '1', label: '工程使用' },
                        { value: '2', label: '其他使用' },
                    ]
                    resolve(option)
                },
                getRelatedProjectId (resolve) { resolve(option.projectList) },
                getDepartmentId (resolve) { resolve(option.departList) },
                getAllUser (resolve) { resolve(that.$store.getters['d2admin/allUser/getData']) }

            }
        },

        setFile(fileList){
            this.upLoadFileDefaultList = []
            if(fileList && fileList.length > 0){
                fileList.forEach(item => {
                    let tem = {
                        status: "finished",
                        response: {
                            name: item.name,
                            url: item.url,
                            size: item.size
                        }
                    }
                    this.upLoadFileDefaultList.push(tem)
                })
            }
        },

        formateData (data) {
            data.relatedTemId = data.relatedTemId ? data.relatedTemId : data.relatedProjectId;
            this.values = data
            this.materialListData = data.materialList
            this.setFile(data.fileList)
            this.fileList = data.fileList
            this.depositoryId = data.depositoryId
            data.projectType === '1' ? this.getAllSelfProjectList('1') : this.getAllJointProjectList('1')
        },

        getDetailsList (taskId) {
            getDetails (taskId).then (res => {
                if (res) this.nodeData = res
            })
        },
        getPurchaseRequest (id) {
            receiveQueryById({id : id}).then(res => {
                if (res) {
                    this.formateData(res)
                    this.beforSetJson (res.createBy)
                    this.procInstId = res.procInstId ? res.procInstId : ''
                    this.prossValue.title = `领用申请:【 ${res.applyname} 】`
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
                this.getPurchaseRequest (this.$route.params.relevancyId)
            } else {
                this.beforSetJson ()
            }
        },
        beforSetJson (id) {
            getUserDepartById({	userId: id ? id : util.cookies.get('uuid')}).then(res => { 
                this.selectOption['departList'] = res
            }).finally(() => {
                this.setRomte(this.selectOption)
                this.getJson()
            })
        }
    },
    mounted () {
        
    },
    created () {
        that = this
        this.updataRouter ()
    }
}
</script>
<style lang="scss">
.address-book{
    .drawer-btn{
        margin-top: 30px;
        text-align: center;
    }
}
</style>