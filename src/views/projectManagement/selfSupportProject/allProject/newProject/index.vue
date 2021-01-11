<template>
    <d2-container class="newProject">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="cancel"><i class="el-icon-close"></i></el-button>
            </div>
            <div class="qqt-container-full-center___top">
                <qqt-flow-tabs :procInstId="procInstId">
                    <template slot="content">
                        <fm-generate-form
                            :data="jsonData"
                            :remote="remoteFunctions"
                            :value="values"
                            :transform="transform"
                            @on-change="change"
                            ref="generateForm">
                            <template slot="leadingPersonList">
                                <!-- 业主负责人 -->
                                <qqt-relate-table 
                                    :data="leadingPersonData" 
                                    :rowHeader="rowleadingPerson" 
                                    ref="leadingPerson" 
                                    :defaultProp="defaultLeadingPerson" 
                                    :isShowDetails="transform.isShowDetails" 
                                    @change="(data, prop, value, index) => changeDataEvent('1', data, prop, value, index)"/> 
                            </template>
                            <template slot="teamList">
                                <!-- 团队组建 -->
                                <qqt-relate-table 
                                    :data="teamListData" 
                                    :rowHeader="rowteamList" 
                                    :isDefaultShowRow="isDefaultShowRow"
                                    ref="teamList" 
                                    :isShowDetails="transform.isShowDetails"
                                    @select="teamSelectChange"
                                    @relateTable="addRow"
                                    @change="(data, prop, value, index) => changeDataEvent('2', data, prop, value, index)"/> 
                            </template>
                            <template slot="fileList" class="files-upload___right">
                                <!-- 附件 -->
                                <up-load
                                    :isShowUpload="!transform.isShowDetails"
                                    @upLoadFileCallBack="upLoadFileCallBack"
                                    :propList="upLoadFileDefaultList"
                                    ref="upload"/>
                            </template>
                        </fm-generate-form>
                        <el-row>
                            <bottomInformation :values="values" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
                        </el-row>
                    </template>
                </qqt-flow-tabs>
            </div>
            <div class="qqt-container-full-content___button" style="text-align:center;">
                <el-button size="small" type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitNewPro ()">重新提交</el-button>
                <el-button size="small" type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button size="small" type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button size="small" type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button size="small" type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button size="small" type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveNewPro">保存</el-button>
                <el-button size="small" type="primary" v-if="!transform.isShowDetails && procInstId === ''" @click="values['flag'] = '1', submitNewPro ()">提交</el-button>
                <el-button type="info" size="mini" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                <el-button size="small" @click="cancel">关闭</el-button>
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataNewStage"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentNewStage" />
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </d2-container>
</template>
<script>
import { mapActions } from 'vuex'
import util from '@/libs/util'
import { selfProjectAdd, getAllProjectDic, selfProjectQueryById, selfProjectSub, selfProjectReSub, selfProjectOperation, selfProjectEdit, } from '@/api/selfProject/allProject/index'
import { qqtSendProcess, qqtFlowTabs, qqtConsent, upload, qqtRelateTable } from '@/components/qqt-subassembly'
import { queryDicById } from '@/api/system/dic/dic'
import { getUnitAndDepartmentByUserId } from '@/api/system/depart/depart'
import { staffStaffDictionary, queryDepartmentByUserId, queryDepartmentAndPositionByUserId } from '@/api/system/staff/staff'
import bottomInformation from '../../../selfSupportProjectDetail/businessBidding/components/bottomInformation'
import printTemplateByHtml from '../../../../systemManagement/printTemplate/components/printTemplateByHtml'
import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
import { formGetJson } from '@/api/system/fromManagement/index'
import { getDetails } from '@/api/approval/common'
import { SELFPROHECT } from '@/enum/DICTIONARY'
import { AREAJSON } from '@/enum/AREASPREAD'
import { CITYJSON } from '@/enum/CTIYS'
import { PORJECT_INFO } from '@/enum/SELFPROJECT'
import { PROJECT_GETINFOID } from '@/enum/PROJECT'
import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
let that = this
export default {
    name: "index",
    components: {
        'print-template-by-html': printTemplateByHtml,
        'qqt-send-process': qqtSendProcess,
        'qqt-flow-tabs': qqtFlowTabs,
        'qqt-consent': qqtConsent,
        'qqt-relate-table': qqtRelateTable,
        'up-load': upload,
        'bottomInformation': bottomInformation,
    },
    data () {
        that = this
        return {
            jsonData: {},
            remoteFunctions: {},
            remoteOptions: {
                departmentList: [],
            },
            values: {
                createName: util.cookies.get ('username'),
                createTime: new Date().format('yyyy-MM-dd hh:mm:ss'),
                preductCompletedTime: '',
                predictOpenTime: ''

            },
            transform: {
                isShowDetails: false
            },
            // 业主负责人
            leadingPersonData: [],
            rowleadingPerson:  [
                {
                    prop: 'name',
                    label: '姓名',
                    isShow: true,
                    type: 'text',
                    required: true,
                    message: '姓名不能为空', 
                },{
                    prop: 'department',
                    label: '部门',
                    isShow: true,
                    type: 'text',
                    required: true,
                    message: '部门不能为空', 
                },{
                    prop: 'duty',
                    label: '职务/岗位',
                    isShow: true,
                    type: 'text',
                    required: true,
                    message: '职务/岗位不能为空', 
                },{
                    prop: 'responsibility',
                    label: '分管工作',
                    isShow: true,
                    type: 'text',
                    required: true,
                    message: '分管工作不能为空', 
                },{
                    prop: 'officePhone',
                    label: '办公电话',
                    isShow: true,
                    type: 'text',
                },{
                    prop: 'phone',
                    label: '个人电话',
                    isShow: true,
                    type: 'text',
                    required: true,
                    message: '个人电话不能为空',
                    rule: [
                        { required: true, message: `个人电话不能为空`, trigger: 'change' },
                        { pattern: /^(0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57][0-9]{8})|([0-9]{4}|[0-9]{3})(-| ))?([0-9]{7,8})?$/, message: `个人电话不正确`, trigger: 'change' }
                    ]
                },{
                    prop: 'remark',
                    label: '备注',
                    isShow: true,
                    type: 'text',
                },
            ],
            isDefaultShowRow: false,
            defaultLeadingPerson: {
                value: 'value',
                label: 'label'
            },
            // 跟踪团队组建
            teamListData: [ { userId: null, options: [] } ],
            departmentArrList: [],
            allUser: [],
            rowteamList: [],
            cityData: [],
            urlData: [],

            // 流程信息
            stutas: '',
            procInstId: '',
            nodeData: {
                operation: '',
                msg: ''
            },
            prossValue: {
                title: ''
            },
            visible: false,
            isReject: false,
            isSendBack: false,
            isTurnManage: false,
            dialogVisible: false,
            code: BASICSCODE.SELF_PROJECT_CREATE,
            processModuleId: PORJECT_INFO.SELFPROJECTADD,
            upLoadFileDefaultList: [],
            departmentList: [],
            tempData: {},
        }   
    },
    methods: {
        ...mapActions('d2admin/page', [
            'close'
        ]),
        change (field, value, model) {
            switch (field) {
                case 'projectAddress':
                    if (value.length === 0) {
                        model.area = ''
                    } else {
                        AREAJSON.forEach(item => {
                            if (item.provinces.indexOf(value[0]) !== -1) {
                                model.area = item.area
                            }
                        })
                    }
                    break
                case 'predictOpenTime':
                    if (model.preductCompletedTime) {
                        this.verdictPredictTime (model, 'predictOpenTime')
                    }
                    break
                case 'preductCompletedTime':
                    if (model.predictOpenTime) {
                        this.verdictPredictTime (model, 'preductCompletedTime')
                    }
                    break
                default:
                    break
            }
            this.values = Object.assign( {}, this.values, model)
        },

        verdictPredictTime (model, preduct) {
            let befor = new Date (model.predictOpenTime)
            let after = new Date (model.preductCompletedTime)
            if (after < befor) {
                this.$message.warning ("预计竣工时间必须大于预计开工时间")
                if (preduct == 'predictOpenTime') {
                    model.preductCompletedTime = ''
                } else {
                    model.predictOpenTime = ''
                }
            }
        },

        upLoadFileCallBack(data){
            this.urlData = data
        },
        changeDataEvent (type, data, prop, value, index) {
            if(type === '2') {
                this.$set(this.teamListData, index, data)
            }
        },

        addRow () {
            this.teamListData.push({ userId: null, options: [] })
        },

        // 跟踪团队下拉监听
        teamSelectChange (row, prop, value, index, dataList) {
            switch(prop) {
                case 'userId':
                    if (value !== '') {
                        let userTem = this.allUser.find(el => el.id === row.userId)
                        if (userTem) { row.name = userTem.name }
                        row.departmentId = ''
                        row.department = ''
                        queryDepartmentAndPositionByUserId({ userId: value }).then(res => {
                            row.options = res
                            this.$set(this.teamListData, index, row)
                            this.neatenRowHeader()
                        })
                    }
                    break
                case 'departmentId':
                    let departTem = row.options.find(el => el.id === value)
                    if (departTem) { row.department = departTem.name, row.duty = departTem.address ? departTem.address : '' }
                    this.$set(this.teamListData, index, row)
                    break
                default:
                    break
            }
        },
        getProjectDetail (id) {
            selfProjectQueryById({id: id}).then(res => {
                Object.assign(this.tempData, res)
                res = this.echoData(res)
                Object.assign (this.values, res)
                this.prossValue.title = `自营项目新建:【 ${this.values.projectName} 】`
                this.procInstId = res.procInstId ? res.procInstId : ''
                this.getDepByUserId(res.createBy)
            })
        },
        echoData (data) {
            if (data.teamList.length > 0) {
                data.teamList.forEach(res => {
                    delete res.id
                })
            }
            this.teamListData = data.teamList
            this.teamListData.forEach(item => {
                queryDepartmentAndPositionByUserId({ userId: item.userId }).then(res => {
                    item.options = res
                    this.neatenRowHeader()
                })
            })
            if(data.capitalSourceDicId) { data.capitalSourceDicId = util.splitData(data.capitalSourceDicId, ',') }
            if(data.projectCategoryDicId) { data.projectCategoryDicId = util.splitData(data.projectCategoryDicId, ',') }
            if(data.ownerUnitAddress) { data.ownerUnitAddress = util.splitData(data.ownerUnitAddress, ',') }
            if(data.projectAddress) { data.projectAddress = util.splitData(data.projectAddress, ',') }
            this.leadingPersonData = data.ownerList
            this.setFileList(data)
            
            return data
        },

        setFileList (res) {
            this.urlData = res.fileList
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
        prepareData (data, teamListTem, leadingPersonTem) {
            data.id = this.values.id ? this.values.id : null
            data.projectCode = this.values.projectCode ? this.values.projectCode : null
            let temp1 = this.remoteOptions.sourceDic.find(el => el.id === data.sourceDicId)
            data.sourceDicName = temp1 ? temp1.name : ''
            let temp2 = this.remoteOptions.projectCategoryDic.find(el => el.id === data.projectTypeDicId)
            data.projectTypeDic = temp2 ? temp2.name : ''
            let ids = ''
            data.projectCategoryDic = ''
            data.projectCategoryDicId.forEach(item => {
                let temp3 = this.remoteOptions.projectCategoryDic.find(el => el.id === item)
                data.projectCategoryDic += temp3 ? temp3.name + ',' : ''
                ids += item + ','
            })
            data.projectCategoryDic = data.projectCategoryDic.substring(0, data.projectCategoryDic.length - 1)
            data.projectCategoryDicId = ids.substring(0, ids.length - 1)
            let temp4 = this.remoteOptions.createPatternDic.find(el => el.id === data.createPatternDicId)
            data.createPatternDic = temp4 ? temp4.name : ''
            let ids1 = ''
            data.capitalSourceDic = ''
            data.capitalSourceDicId.forEach(item => {
                let temp5 = this.remoteOptions.capitalSourceDic.find(el => el.id === item)
                data.capitalSourceDic += temp5 ? temp5.name + ',' : ''
                ids1 += item + ','
            })
            data.capitalSourceDic = data.capitalSourceDic.substring(0, data.capitalSourceDic.length - 1)
            data.capitalSourceDicId = ids1.substring(0, ids1.length - 1)
            let temp6 = this.remoteOptions.ownerUnitNatureDic.find(el => el.id === data.ownerUnitNatureDicId)
            data.ownerUnitNatureDic = temp6 ? temp6.name : ''
            let address = ''
            data.ownerUnitAddress.forEach(item => {
                address += item + ','
            })
            data.ownerUnitAddress = address.substring(0, address.length - 1)
            data.projectAddress = util.jointData(data.projectAddress, ',')
            
            if (this.values.team) { teamListTem.forEach(item => { item.id = this.values.team }) }
            data.teamList = teamListTem 
            data.team = this.values.team ? this.values.team : ''
            if (this.values.ownerPrincipals) { leadingPersonTem.forEach(item => { item.id = this.values.ownerPrincipals }) }
            data.ownerList = leadingPersonTem
            data.ownerPrincipals = this.values.ownerPrincipals ? this.values.ownerPrincipals : ''
            return data
        },
        // 保存
        saveNewPro () {
            let teamListTem = this.$refs.teamList.verify()
            let item = this.$refs.bottomInformation.getData ()
            let leadingPersonTem = this.$refs.leadingPerson.verify()
            this.$refs.generateForm.getData().then(res => {
                if(res && item && teamListTem && leadingPersonTem){
                    res = this.prepareData(res, teamListTem, leadingPersonTem)
                    res.fileList = this.urlData
                    let url = ''
                    this.$route.params.relevancyId ? url = selfProjectEdit : url = selfProjectAdd
                    Object.assign(res, item)
                    url(res).then(res => {
                        this.$message.success(this.$route.params.relevancyId ? "编辑成功" : "添加成功" )
                        this.cancel()
                    })
                }
            })
        },
        // 提交
        submitNewPro () {
            let teamListTem = this.$refs.teamList.verify()
            let leadingPersonTem = this.$refs.leadingPerson.verify()
            let item = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData().then(res => {
                if(res && item && teamListTem && leadingPersonTem){
                    res = this.prepareData(res, teamListTem, leadingPersonTem)
                    res.fileList = this.urlData
                    Object.assign(this.tempData, res, item)
                    console.log(JSON.parse(JSON.stringify(this.tempData)))
                    this.dialogVisible = true
                    this.prossValue = {
                        title: this.$route.params.title || `自营项目新建:【 ${res.projectName} 】`,
                        pdfId: this.$route.params.procDefId || '',
                        degree: this.$route.params.degree || '',
                        msg: '',
                    }
                }
            })
        },
        updataNewStage (item, boolean) {
            let url = ''
            this.dialogVisible = this.isSendBack = false
            item['taskId'] = this.$route.params.taskId || ''
            this.tempData['completeTask'] = item
            boolean ? url = selfProjectReSub : url = selfProjectSub
            url (this.tempData).then (res => {
                if (res.code === 200) {
                    this.$message.success (res.message)
                    this.cancel ()
                }
            })
        },
        consentNewStage (item = '', boolean = false) {
            this.visible = this.isTurnManage = this.isReject = false
            if (boolean) {
                this.cancel ()
                return
            }
            if (item) {
                this.tempData['completeTask'] = item
                selfProjectOperation (this.tempData).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.cancel ()
                    }
                })
            }
        },
        cancel () {
            this.$router.go(-1)
            let tagName = this.$route.path
            this.close ({ tagName })
        },
        getJson () {
            formGetJson({
                code: PORJECT_INFO.SELFPROJECTADD
            }).then(res => {
                this.jsonData = JSON.parse(res)
            })
        },
        setRemote (options) {
            this.remoteFunctions = {
                getSourceDicId (resolve) { resolve(options.sourceDic) }, // 来源
                getProjectTypeDic (resolve) { resolve(options.projectCategoryDic) }, // 项目类型
                getProjectCategoryDic (resolve) { resolve(options.projectCategoryDic) }, // 工程类别
                getProjectAddress (resolve) { resolve(eval(CITYJSON)) }, // 项目所在地
                getArea (resolve) { resolve(options.area) }, // 项目所属区域
                getCreatePatternDic (resolve) { resolve(options.createPatternDic) }, // 项目建设模式
                getCapitalSourceDicId (resolve) { resolve(options.capitalSourceDic) }, // 项目资金来源
                getOwnerUnitNatureDicId (resolve) { resolve(options.ownerUnitNatureDic) },  // 业主单位性质
                // getUnit (resolve) { resolve(options.unitList ? options.unitList : []) }, // 工作单位
                getDepartmentId (resolve) { resolve(options.departmentList ? options.departmentList : []) }, // 工作单位
            }
        },
        getOptions () {
            queryDicById({id: SELFPROHECT.SOURCEDICNAME}).then(res => { this.remoteOptions['sourceDic'] = res }).finally(() => {
                queryDicById({id: SELFPROHECT.CREATEPATTERNDIC}).then(res => { this.remoteOptions['createPatternDic'] = res }).finally(() => {
                    queryDicById({id: PROJECT_GETINFOID.PROTYPE}).then(res => { this.remoteOptions['projectCategoryDic'] = res }).finally(() => {
                        queryDicById({id: SELFPROHECT.UNITPROPERTY}).then(res => { this.remoteOptions['ownerUnitNatureDic'] = res }).finally(() => {
                            queryDicById({id: SELFPROHECT.CAPITALSOURCEDIC}).then(res => { this.remoteOptions['capitalSourceDic'] = res }).finally(() => {
                                queryDicById({id: SELFPROHECT.SELFPROJECTAREA}).then(res => { this.remoteOptions['area'] = res }).finally(() => {
                                    this.setRemote(this.remoteOptions)
                                    this.getJson()
                                })
                            })
                        })
                    })
                })
            })
        },
        getDepByUserId (id) {
            getUnitAndDepartmentByUserId({'userId': id}).then(res => {
                this.remoteOptions.departmentList = res.department
                this.setRemote (this.remoteOptions)
            })
        },
        getDetailsList (taskId) {
            getDetails (taskId).then (res => { if (res) this.nodeData = res })
        },

        printTemplate () {
            getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.$route.params.relevancyId}).then(res => {
                if (res) this.$refs.printTemp.printTemplate (res)
            })
        },

        getPositionDic () {
            staffStaffDictionary ().then(res => {
                this.allUser = res, this.neatenRowHeader ()
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
                this.getProjectDetail (this.$route.params.relevancyId)
            } else {
                this.getDepByUserId (util.cookies.get ('uuid'))
            }
        },

        neatenRowHeader () {
            this.rowteamList = [ 
                {
                    prop: 'userId',
                    label: '姓名',
                    isShow: true,
                    type: 'select',
                    required: true,
                    filterable: true,
                    message: '姓名不能为空',
                    options: that.allUser,
                    defaultProp: {
                        value: 'id',
                        label: 'name' 
                    }
                },{
                    prop: 'departmentId',
                    label: '部门',
                    isShow: true,
                    type: 'selectNew',
                    options: that.departmentArrList,
                    defaultProp: {
                        value: 'id',
                        label: 'name' 
                    }
                },{
                    prop: 'duty',
                    label: '职务/岗位',
                    isShow: true,
                    type: 'text',
                    required: true,
                    message: '职务/岗位不能为空', 
                },{
                    prop: 'responsibility',
                    label: '主要职责和任务',
                    isShow: true,
                    type: 'text',
                    required: true,
                    message: '主要职责和任务不能为空', 
                },{
                    prop: 'officePhone',
                    label: '办公电话',
                    isShow: true,
                    type: 'text',
                    rule: [
                        { pattern: /^(0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57][0-9]{8})|([0-9]{4}|[0-9]{3})(-| ))?([0-9]{7,8})?$/, message: `办公电话不正确`, trigger: 'change' }
                    ]
                },{
                    prop: 'phone',
                    label: '个人电话',
                    isShow: true,
                    type: 'text',
                    rule: [
                        { pattern: /^(0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57][0-9]{8})|([0-9]{4}|[0-9]{3})(-| ))?([0-9]{7,8})?$/, message: `个人电话不正确`, trigger: 'change' }
                    ]
                },{
                    prop: 'remark',
                    label: '备注',
                    isShow: true,
                    type: 'text',
                },
            ]
        }
    },
    mounted () {
        
    },
    created () {
        this.getOptions()
        this.getPositionDic ()
        this.updataRouter()
    }
}
</script>
<style lang="scss">
.drawer-btn{
    text-align: center;
}
.newProject {
    .files-upload___right {
        margin-left: 120px
    }
}
</style>