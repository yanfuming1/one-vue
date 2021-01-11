<template>
    <d2-container type="fulls" class="add-purchase-request">
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
                            :remoteOption="remoteOption"
                            ref="generateForm"
                            @on-change="selectGenerateChange"
                        />
                        <el-divider content-position="left">
                            <div class="generate-from-divider___line"></div>
                            采购申请材料明细
                        </el-divider>
                        <div class="add-purchase-request-button">
                            <el-button size="mini" round @click="popoutMaterial = true" :disabled="transform.isShowDetails">从材料库导入</el-button>
                        </div>
                        <el-row>
                            <el-col :span="24">
                                <qqt-relate-table :data="values.materialList" :replaceRules="rules" ref="materials" :isShowAdd="false" :isDefaultShowRow="false" @blur="updataMaterialList" :rowHeader="materialsHeader" :isShowDetails="transform.isShowDetails" />
                            </el-col>
                        </el-row>
                        <bottomInformation :values="values" fieldTitle="申请" timeTitle="申请" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation"></bottomInformation>
                    </template>
                </qqt-flow-tabs>
            </div>
            <div class="qqt-container-full-content___button">
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitPurchaseRequestData ()">重新提交</el-button>
                <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="savePurchaseRequest">保存</el-button>
                <el-button type="primary" v-if="!transform.isShowDetails && procInstId === '' && ($route.params.identification == '1' ? $has ('self:procurement:request:submit') : $has ('material:procurement:request:submit'))" @click="values['flag'] = '1', submitPurchaseRequestData ()">提交</el-button>
                <!-- <el-button type="info" size="mini" @click="printTemplate">打印</el-button> -->
                <el-button @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataPurchaseRequest"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentPurchaseRequest" />
        <popout-material-depot v-if="popoutMaterial" :dialogVisible="popoutMaterial" @close="getMaterialData" />
        <!-- <print-template-by-html v-show="false" :code="code" ref="printTemp" /> -->
    </d2-container>
</template>

<script>
    import { formGetJson } from '../../../../../api/system/fromManagement/index'
    import { getPurchaseRequestById, editPurchaseRequest, 
             addPurchaseRequest, submitPurchaseRequest, completePurchaseRequest, resetSubmitPurchaseRequest } from '../../../../../api/materialEquipmentManagement/procurementManagement/purchaseRequest'
    import { addSelfpurchaseRequest, editSelfpurchaseRequest, submitSelfpurchaseRequest } from '@/api/selfProject/selfProprietaryProcurement/purchaseRequest'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, upload, qqtRelateTable } from '../../../../../components/qqt-subassembly'
    import { getAllSelfProject, getAllJointProject } from '../../../../../api/jointProject/index'
    import { MATERIALEQUIPMENTMANAGEMENT } from '../../../../../enum/FORMCODE'
    import { PURCHASEREQUEST } from '../../../../../enum/DICTIONARY'
    import { queryDicByIds } from '../../../../../api/system/dic/dic'
    import { getDetails } from '../../../../../api/approval/common'
    import { BASICSCODE } from '../../../../../enum/PRINTTEMPLATE'
    import { mapActions, mapState } from 'vuex'

    import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
    import popoutMaterialDepot from '../../../basicInformation/materialDepot/components/popoutMaterialDepot'
    import printTemplateByHtml from '../../../../systemManagement/printTemplate/components/printTemplateByHtml'
    import util from '@/libs/util.js'
    let than = this
    export default {
        
        data () {
            return {
                stutas: '',
                title: '',
                procInstId: '',
                jsonData: {},
                remote: {},
                buyTypeList: [],
                departmentList: [],
                relevanceProject: [],
                nodeData: {
                    operation: '',
                    msg: ''
                },
                upLoadFileDefaultList: [],
                values: {
                    fileList: [],
                    materialList: [],
                    section: '',
                    amount: '',
                    amountCapital: '',
                    departmentId: '',
                    projectType: '',
                    createName: util.cookies.get ('username')
                },
                transform: {
                    isShowDetails: false
                },
                prossValue: {
                    title: ''
                },
                materialsHeader: [
                    {
                        prop: 'code',
                        label: '材料编码',
                        isShow: true,
                        type: 'text',
                        width: 185,
                        isShowDetails: true
                    },
                    {
                        prop: 'name',
                        label: '名称',
                        isShow: true,
                        type: 'text',
                        width: 200,
                        isShowDetails: true
                    },
                    {
                        prop: 'brandName',
                        label: '品牌',
                        isShow: true,
                        type: 'text',
                        width: 200,
                        isShowDetails: true
                    },
                    {
                        prop: 'specificationName',
                        label: '规格型号',
                        isShow: true,
                        type: 'text',
                        width: 200,
                        isShowDetails: true
                    },
                    {
                        prop: 'unit',
                        label: '计量单位',
                        isShow: true,
                        type: 'text',
                        width: 200,
                        isShowDetails: true
                    },
                    {
                        prop: 'number1',
                        label: '采购数量',
                        isShow: true,
                        type: 'text',
                        width: 200,
                        required: true,
                        isNonnegativeNumber: true
                    },
                    {
                        prop: 'money1',
                        label: '单价控制(元)',
                        isShow: true,
                        type: 'money',
                        btnTitle: '元',
                        width: 200,
                        required: true,
                        isNonnegativeNumber: true
                    },
                    {
                        prop: 'money2',
                        label: '总价控制(元)',
                        isShow: true,
                        type: 'total',
                        isMoneyType: true,
                        controlRow: 'number1 * money1',
                        btnTitle: '元',
                        width: 200,
                        required: true
                    },
                    {
                        prop: 'consumablesName',
                        label: '是否消耗品',
                        isShow: true,
                        type: 'text',
                        width: 200,
                        isShowDetails: true
                    },
                    {
                        prop: 'datetime1',
                        label: '需求日期',
                        isShow: true,
                        type: 'date',
                        width: 200,
                        required: true
                    },
                    {
                        prop: 'remark',
                        label: '备注',
                        isShow: true,
                        type: 'text',
                        width: 200,
                    }
                ],
                remoteOption: {
                    projectTypeOptions: [
                        {
                            value: '1',
                            label: '自营'
                        },
                        {
                            value: '2',
                            label: '联营'
                        }
                    ]
                },
                code: BASICSCODE.MATERIAL_PURCHASE_REQUEST,
                processModuleId: MATERIALEQUIPMENTMANAGEMENT.ADDPURCHASEREQUEST,
                dialogVisible: false,
                popoutMaterial: false,
                visible: false,
                isReject: false,
                isSendBack: false,
                isTurnManage: false,
                rules: {
                    'number1': [
                        { required: true, pattern: /^([0-9]*[1-9][0-9]*\.[0-9]*[1-9][0-9]+)|([0-9]*[1-9][0-9]*)$/, message: '采购数量不合法', trigger: 'change' }
                    ],
                    'money1': [
                        { required: true, message: '单价控制不能为空', trigger: 'change' }
                    ],
                    'money2': [
                        { required: true, message: '总价控制不能为空', trigger: 'change' }
                    ],
                    'datetime1': [
                        { required: true, message: '需求日期不能为空', trigger: 'change' }
                    ],
                }
            }
        },

        methods: {

            ...mapActions('d2admin/page', [
                'close',
            ]),

            getFormByJson () {
                formGetJson ({'code': MATERIALEQUIPMENTMANAGEMENT.ADDPURCHASEREQUEST}).then(res => {
                    if (res) this.jsonData = JSON.parse(res)
                    if(this.$route.params.identification == '1') this.proprietaryProjectType ()
                })
            },

            proprietaryProjectType () {
                this.jsonData.list[4].columns[0].list[0].options.disabled = true
                this.jsonData.list[4].columns[1].list[0].options.disabled = true
                this.values.projectType = '1'
                this.values.relevanceProjectId = this.selfSupportProject.projectName
                this.values.relevanceProject = this.selfSupportProject.projectName
                this.values.section = this.selfSupportProject.sectionDic
            },

            getPurchaseRequest (id) {
                getPurchaseRequestById ({'id': id}).then (res => {
                    if (res) {
                        this.screenProjectTypeToProjectList (res.projectType)
                        res.materialList.forEach (f => {
                            f.number1 = f.number1 + '', f.money1 = f.money1 + '', f.money2 = f.money2 + '', f['consumablesName'] = f.consumables == '1' ? '是' : '否'
                        })
                        res.amount = res.amount + ''
                        this.values = res
                        this.prossValue.title = `采购申请:【 ${this.values.applyName} 】`
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
                }).finally (() => {
                    this.getFormByJson ()
                })
            },

            savePurchaseRequest () {
                let url = '', boolean = {}, element = {}
                boolean = this.$refs.materials.verify ()
                element = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && boolean && element) {
                        Object.assign (this.values, data, element)
                        this.values['materialList'] = boolean
                        if(this.$route.params.identification == '1') { this.values.relevanceProjectId = this.values['projectCode'] = this.selfSupportProject.projectCode }
                        // 如果没有 id ，是添加，再判断是否为自营项目
                        this.values.id == null ? (this.$route.params.identification == '1' ? url = addSelfpurchaseRequest : url = addPurchaseRequest) 
                            : (this.$route.params.identification == '1' ? url = editSelfpurchaseRequest : url = editPurchaseRequest)
                        url (this.values).then (res => {
                            if (res.code === 200) {
                                this.$message.success ('保存成功')
                                this.closePageTag ()
                            }
                        })
                    }
                })
            },

            submitPurchaseRequestData () {
                let list = {}, element = {}
                list = this.$refs.materials.verify ()
                element = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && list && element) {
                        Object.assign (this.values, data, element)
                        this.values['materialList'] = list
                        this.dialogVisible = true
                        this.prossValue = {
                            title: this.$route.params.title || `采购申请:【 ${data.applyName} 】`,
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.params.degree || '',
                            msg: '',
                        }
                    }
                })
            },

            selectGenerateChange (field, val, models) {
                let item = '', str = ''
                switch (field) {
                    case 'buyTypeId':
                        item = this.buyTypeList.find (f => f.id === val)
                        if (item) this.values['buyType'] = item.name
                        break
                    case 'departmentId':
                        item = this.departmentList.find (f => f.id === val)
                        if (item) this.values['departmentName'] = item.name
                        break
                    case 'relevanceProjectId':
                        this.values.relevanceProjectId = val
                        item = this.relevanceProject.find (f => f.id === val)
                        if (item) this.values['relevanceProject'] = item.projectName, this.values['section'] = item.section
                        break
                    case 'projectType':
                        this.values.relevanceProjectId = this.values.relevanceProjec = this.values.section = '', this.values.projectType = val
                        this.screenProjectTypeToProjectList (val)
                        break
                }
            },

            updataPurchaseRequest (item, boolean) {
                let url = ''
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                if(this.$route.params.identification == '1') { 
                    this.values.relevanceProjectId = this.values['projectCode'] = this.selfSupportProject.projectCode 
                    this.values.relevanceProject = this.selfSupportProject.projectName
                }
                boolean ? url = resetSubmitPurchaseRequest : this.$route.params.identification == '1' ?  url = submitSelfpurchaseRequest : url = submitPurchaseRequest
                url (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closePageTag ()
                    }
                })
            },

            consentPurchaseRequest (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closePageTag ()
                    return
                }
                if (item) {
                    this.values['completeTask'] = item
                    completePurchaseRequest (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success (res.message)
                            this.closePageTag ()
                        }
                    })
                }
            },

            getDetailsList (taskId) {
                getDetails (taskId).then (res => {
                    if (res) this.nodeData = res
                })
            },

            getMaterialData (item) {
                let data = {}, list = []
                this.popoutMaterial = false
                if (item) {
                    this.values.materialList = this.$refs.materials.getNotVerify ()
                    item.forEach (res => {
                        res['consumablesName'] = res.consumables == '1' ? '是' : '否'
                        res['materialId'] = res['parentId'] = res.id
                        data = this.values.materialList.find (f => f.id == res.id)
                        if (!data) list.push (res)
                    })
                    this.values.materialList.push (...list)
                }
            },

            getQueryDicByIdList () {
                let list = [ PURCHASEREQUEST.PURCHASETYPE ]
                queryDicByIds (list).then (item => {
                    if (!item) return
                    this.buyTypeList = item[PURCHASEREQUEST.PURCHASETYPE]
                    this.neatenData ()
                })
            },

            getAllSelfProjectList () {
                getAllSelfProject ().then (res => {
                    if (res instanceof Array) {
                        res.forEach (item => { item['id'] = item.projectCode, item['section'] = item.sectionDic })
                        this.relevanceProject = res
                        this.neatenData ()
                    }
                })
            },

            getAllJointProjectList () {
                getAllJointProject ().then (res => {
                    if (res instanceof Array) this.relevanceProject = res, this.neatenData ()
                })
            },

            neatenData () {
                this.remote = {
                    getBuyType (resolve) {
                        resolve (than.buyTypeList)
                    },

                    getRelevanceProjectId (resolve) {
                        resolve (than.relevanceProject)
                    },

                    getDepartmentId (resolve) {
                        resolve (than.departmentList)
                    }
                }
            },

            upLoadFileCallBack (item) {
                this.values.fileList = item
            },

            updataMaterialList (data, prop, value) {
                let isTotal = false
                switch (prop) {
                    case 'money2':
                        if (Number (data.number1) > 0 && Number (data.money1) > 0) {
                            data.money1 = (value / data.number1).toFixed (2)
                        }
                        if (Number (data.number1) == 0 && Number (data.money1) > 0) {
                            data.number1 = (value / data.money1).toFixed (2)
                        }
                        if (Number (data.number1) > 0 && Number (data.money1) == 0) {
                            data.money1 = (value / data.number1).toFixed (2)
                        }
                        data.money2 = value + ''
                        isTotal = true
                        break
                }
                this.totalPurchase (isTotal, data, value)
            },

            screenProjectTypeToProjectList (type) {
                switch (type) {
                    case '1':
                        this.getAllSelfProjectList ()
                        break
                    case '2':
                        this.getAllJointProjectList ()
                        break
                    default:
                        this.relevanceProject = []
                        this.neatenData ()
                        break
                }
            },

            totalPurchase (isTotal, data, value) {
                let relateList = [], num = 0
                relateList = this.$refs.materials.getNotVerify ()
                relateList.forEach (res => {
                    isTotal ? res.id == data.id ? num += Number.parseFloat (value) : num += Number.parseFloat (res.money2) : num += Number.parseFloat (res.money2)
                })
                this.values.amount = num + ''
                this.values.amountCapital = util.convertCurrency (num)
            },

            closePageTag () {
                let tagName = this.$route.path
                let path = ``
                this.stutas ? path = `/approval/${this.stutas}` : path = `/materialEquipmentManagement/procurementManagement/${this.$route.params.path}`
                this.close ({ tagName, path })
            },

            printTemplate () {
                this.$refs.printTemp.printTemplate (this.values)
            },

            updataRouter () {
                if (this.$route.params) {
                    this.transform = this.$route.params.transform || {}
                    this.stutas = this.$route.params.pathName || ''
                    this.procInstId = this.$route.params.procInstId || ''
                    this.values['relevanceProjectId'] = this.$route.params.relevanceProjectId || ''
                }
                if (this.$route.params && this.$route.params.taskId) {
                    this.getDetailsList (this.$route.params.taskId)
                }
                if (this.$route.params && this.$route.params.relevancyId) {
                    this.getPurchaseRequest (this.$route.params.relevancyId)
                } else {
                    this.getFormByJson ()
                }
            }
        },

        created () {
            this.updataRouter ()
            this.getQueryDicByIdList ()
            if(this.$route.params.identification == '1') this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad')
        },

        computed: {
            ...mapState ('d2admin/selfSupportProject', [
                'selfSupportProject'
            ])
        },

        mounted () {
            than = this
        },

        components: {
            'bottomInformation': bottomInformation,
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent,
            'qqt-relate-table': qqtRelateTable,
            'popout-material-depot': popoutMaterialDepot,
            'print-template-by-html': printTemplateByHtml,
        }
    }
</script>

<style lang='scss'>
    .add-purchase-request {
        .add-purchase-request-button {
            float: right;
            top: -40px;
            background: #fff;
            width: 120px;
            position: relative;
            text-align: right;
        }
        .qqt-Relate-table {
            margin: -25px 0 25px 35px;
            padding-top: 0px !important
        }
    }
</style>
