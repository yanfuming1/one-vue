<template>
    <d2-container class="updata-all-task">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
            </div>
            <el-divider content-position="left" v-if="!isTaskDecomposition">
                <div class="generate-from-divider___line"></div>
                基本信息
            </el-divider>
            <div class="updata-all-task-tabs">
                <el-tabs v-model="activeBasicName" v-if="isTaskDecomposition">
                    <el-tab-pane label="基本信息" name="first"></el-tab-pane>
                    <el-tab-pane label="任务分解记录" name="second" v-if="isShowTaskDecompositionRecord">
                        <qqt-table :data="tableData" ref="table" :pageShow="false" :exportData="tableData.records" :rowHeader="rowHeader" :option="tableOption" />
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div class="updata-all-task-breakdown-record" v-show="activeBasicName == 'second'">
                <span class="updata-all-task-breakdown-record___right">
                    <el-button-group>
                        <el-button size="mini" @click="exportExcel" icon="el-icon-upload2">导出</el-button>
                    </el-button-group>
                </span>
            </div>
            <div class="updata-all-task-basic" v-show="activeBasicName == 'first'">
                <div class="updata-all-task-basic-generate">
                    <fm-generate-form :data="jsonData" :remote="remote" :remoteOption="remoteOption" :transform="transform" :value="values" ref="generateForm" @on-change="selectGenerateChange" @btn-click="btnClick" />
                </div>
                <el-divider content-position="left">
                    <div class="generate-from-divider___line"></div>
                    采购申请材料明细
                </el-divider>
                <el-row>
                    <el-col :span="24">
                        <qqt-relate-table :data="values.materialList" ref="materials" :isShowSelection="true" :isShowAdd="false" :isDefaultShowRow="false" :isShowDelete="false" @selection="relateTableSelection" :rowHeader="materialsHeader" :isShowDetails="transform.isShowDetails" />
                    </el-col>
                </el-row>
                <div class="updata-all-task-decomposition" v-if=" $route.params.identification == '1' ? $has('self:procurement:task:disintegrateTask') : $has('material:procurement:task:disintegrateTask')">
                    <el-button size="mini" type="primary" round v-if="isTaskDecomposition && !transform.isShowDetails" @click="taskDecomposition">任务分解</el-button>
                </div>
                <div v-if="isTaskDecomposition && tabsList.length > 0" class="updata-all-task-decomposition-table">
                    <el-tabs v-model="activeName" type="card" :closable="!transform.isShowDetails">
                        <el-tab-pane :label="data.combination" :class="{ 'font-color-discontinue': data.isTermination == '1', 'font-color-success': data.isEnd == '1' }" :name="data.id" v-for="(data, index) in tabsList" :key="index">
                            <el-row>
                                <el-col :span="24">
                                    <qqt-relate-table :data="data.materialList" :isShowAdd="false" :isDefaultShowRow="false" :isShowDelete="false" @selection="relateTableSelection" :rowHeader="materialsHeader" :isShowDetails="transform.isShowDetails" />
                                </el-col>
                            </el-row>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <bottomInformation :values="values" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation"></bottomInformation>
            </div>
            
            <div class="updata-all-task-button">
                <el-button size="mini" @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <user-modules :showDialog="isShowAdminDialog" title="选择人员" :isShowInput="true" :isShowRole="false" @clearUserPage="clearUserPage" @closeFun="isShowAdminDialog = false"/>
        <popout-entreport v-if="dialogVisible" :dialogVisible="dialogVisible" @close="getPopoutEntreport" />
    </d2-container>
</template>

<script>
import { formGetJson } from '../../../../../../api/system/fromManagement/index'
import { getUserDepartById } from '../../../../../../api/system/depart/depart'
import { MATERIALEQUIPMENTMANAGEMENT } from '../../../../../../enum/FORMCODE'
import { PURCHASEREQUEST } from '../../../../../../enum/DICTIONARY'
import { editPurchaseTask, getPurchaseTaskById,
         purchaseTastDecomposition, purchaseTastSuspend } from '../../../../../../api/materialEquipmentManagement/procurementManagement/purchaseTask'
import { getAllSelfProject, getAllJointProject } from '../../../../../../api/jointProject/index'
import { selfPurchaseTaskDecomposition, selfPurchaseSuspendTask } from '@/api/selfProject/selfProprietaryProcurement/purchaseTask'

import { upload, qqtRelateTable, qqtTable } from '../../../../../../components/qqt-subassembly'
import { mapActions, mapState } from 'vuex'

import bottomInformation from '../../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
import userModules from '../../../../../systemManagement/processDefinition/processModules/userModules'
import popoutEntreport from '../../../../basicInformation/entrepot/components/popoutEntreport'
import util from '@/libs/util.js'
let than = this
export default {

    components: {
        'qqt-table': qqtTable,
        'user-modules': userModules,
        'qqt-relate-table': qqtRelateTable,
        'popout-entreport': popoutEntreport,
        'bottomInformation': bottomInformation
    },

    data () {
        return {
            remote: {},
            jsonData: {},
            tabsList: [],
            activeName: '',
            filterText: '',
            relateTableList: [],
            activeBasicName: 'first',
            relevanceProject: [],
            selectTableChange: [],
            materialChildernList: [],
            upLoadFileDefaultList: [],
            transform: {
                isShowDetails: false
            },
            values: {
                relevanceProjectId: '',
                warehouseAddress: '',
                warehouseName: '',
                TaskSource: '1',
                projectType: '',
                materialList: [],
                children: [],
                total: '',
            },
            tableOption: {
                border: false
            },
            tableData: {
                records: []
            },
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
                    isShowDetails: true
                },
                {
                    prop: 'money1',
                    label: '单价控制(元)',
                    isShow: true,
                    type: 'money',
                    btnTitle: '元',
                    width: 200,
                    isShowDetails: true
                },
                {
                    prop: 'money2',
                    label: '总价控制(元)',
                    isShow: true,
                    type: 'text',
                    btnTitle: '元',
                    width: 200,
                    isShowDetails: true
                },
                {
                    prop: 'consumablesName',
                    label: '是否消耗品',
                    isShow: true,
                    type: 'text',
                    width: 200,
                    isShowDetails: true,
                },
                {
                    prop: 'datetime1',
                    label: '需求日期',
                    isShow: true,
                    type: 'date',
                    width: 200,
                    isShowDetails: true,
                },
                {
                    prop: 'remark',
                    label: '备注',
                    isShow: true,
                    type: 'text',
                    width: 200,
                    isShowDetails: true
                }
            ],
            isShowTaskDecompositionRecord: false,
            isTaskDecomposition: false,
            isShowAdminDialog: false,
            dialogVisible: false,
            rowHeader: [
                {
                    prop: 'parentCode',
                    label: '采购任务单编号',
                    isShow: true
                },
                {
                    prop: 'parentName',
                    label: '采购任务单名称',
                    isShow: true
                },
                {
                    prop: 'applyCode',
                    label: '采购申请单编号',
                    isShow: true
                },
                {
                    prop: 'taskName',
                    label: '子任务名称',
                    isShow: true
                },
                {
                    prop: 'taskCode',
                    label: '子任务编号',
                    isShow: true,
                },
                {
                    prop: 'isEndName',
                    label: '任务状态',
                    isShow: true,
                    render: (h, parms) => {
                            return h('div', {}, parms.row.isEndName = parms.row.isTermination == '1' 
                                ? '已中止' : parms.row.state == '0' 
                                    ? '未使用' : parms.row.state == '1' 
                                        ? '部分使用' : parms.row.state == '2' 
                                            ? '全部使用' : ''
                        )
                    }
                },
                {
                    prop: 'proposer',
                    label: '分解人',
                    isShow: true,
                },
                {
                    prop: 'nominator',
                    label: '采购人',
                    isShow: true,
                },
                {
                    prop: 'createTime',
                    label: '任务分解时间',
                    isShow: true,
                },
                {
                    prop: '',
                    label: '操作',
                    isShow: true,
                    render: (h, parms) => {
                        return [
                            (this.$route.params.identification == '1' ?  this.$has ('self:procurement:task:discontinueTask') : 
                                this.$has ('material:procurement:task:discontinueTask') )? h('el-button', {
                                props:{
                                    type: 'danger',
                                    size: 'mini',
                                    round: true
                                },
                                style: {
                                    padding: '5px 10px'
                                },
                                attrs: {
                                    disabled: parms.row.isTermination == '1' || this.transform.isShowDetails ? true : false
                                },
                                on:{
                                    click: () => {
                                        util.confirm ('是否要任务撤回').then (boolean => {
                                            if (boolean) {
                                                this.executePurchaseTastSuspend (parms.row.id)
                                            }
                                        })
                                    }
                                }
                            }, '任务撤回') : '',
                        ]
                    }
                }
            ]
        }
    },

    methods: {

        ...mapActions('d2admin/page', [
            'close',
        ]),

        getFormByJson () {
            formGetJson ({'code': MATERIALEQUIPMENTMANAGEMENT.PURCHASETASK}).then(res => {
                if (res) this.jsonData = JSON.parse(res)
                if(this.$route.params.identification == '1') this.proprietaryProjectType ()
                
            })
        },

        proprietaryProjectType () {
            this.jsonData.list[2].columns[1].list[0].options.disabled = true
            this.jsonData.list[2].columns[2].list[0].options.disabled = true
        },

        upLoadFileCallBack (item) {
            this.values['fileList'] = item
        },

        selectGenerateChange (field, val) {
            let item = '', str = ''
            switch (field) {
                case 'relevanceProjectId':
                    this.values.relevanceProjectId = val
                    item = this.relevanceProject.find (f => f.id === val)
                    if (item) this.values['relevanceProject'] = item.projectName, this.values['section'] = item.section
                    break
                case 'projectType':
                    this.values.relevanceProjectId = this.values.relevanceProject = this.values.section = '', this.values.projectType = val
                    this.screenProjectTypeToProjectList (val)
                    break
            }
        },

        onSubmit () {
            this.$refs.generateForm.getData ().then(item => {
                let url = ''
                if (!item) return
                Object.assign (this.values, item)
                editPurchaseTask (this.values).then(res => {
                    if (res.code === 200) {
                        this.$message.success ('操作成功')
                        this.closePageTag ()
                    }
                })
            })
        },

        getAllTaskData (id) {
            getPurchaseTaskById ({id: id}).then (res => {
                if (!res) return
                let item = this.neatenDataSource (res)
                this.isShowTaskDecompositionRecord ? Object.assign (this.values, item) : this.values = item
                this.activeName = item.children && item.children.length > 0 ? item.children[0].id : 0
                this.tabsList = item.children || []
                this.relateTableList = []
            }).finally (() => {
                this.getFormByJson ()
            })
        },

        proceedPurchaseTastDecomposition (data) {
            let element = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData ().then(item => {
                if (item && element) {
                    // data.relevanceProjectId = data.projectCode = this.selfSupportProject.projectCode
                    // data.relevanceProject = this.selfSupportProject.projectName
                    Object.assign (this.values, data, item, element)
                    let url = ''
                    this.$route.params.identification == '1' ? url = selfPurchaseTaskDecomposition : url = purchaseTastDecomposition
                    url (this.values).then (res => {
                        if (res.code == 200) {
                            this.$message.success (res.message)
                            this.getAllTaskData (this.$route.params.relevancyId)
                        }
                    })
                }
            })
        },

        executePurchaseTastSuspend (id) {
            let url = ''
            this.$route.params.identification == '1' ? url = selfPurchaseSuspendTask : url = purchaseTastSuspend
            url ({
                'id': id,
                'projectCode': this.selfSupportProject.projectCode
            }).then (res => {
                if (res.code == 200) {
                    this.$message.success (res.message)
                    this.getAllTaskData (this.$route.params.relevancyId)
                }
            })
        },

        getAllSelfProjectList () {
            getAllSelfProject ().then (res => {
                if (res instanceof Array) {
                    res.forEach (item => { item['id'] = item.projectCode, item['section'] = item.sectionDic })
                    this.relevanceProject = res
                    this.neatenRemoteData ()
                }
            })
        },

        getAllJointProjectList () {
            getAllJointProject ().then (res => {
                if (res instanceof Array) this.relevanceProject = res, this.neatenRemoteData ()
            })
        },

        neatenRemoteData () {
            this.remote = {
                getRelevanceProjectId (resolve) {
                    resolve (than.relevanceProject)
                },

                getSectionId (resolve) {
                    resolve (than.sectionList)
                },

                getTaskSource (resolve) {
                    resolve ([
                        {
                            value: '1',
                            label: '采购申请'
                        },
                        {
                            value: '0',
                            label: '其他'
                        }
                    ])
                }
            }
        },

        relateTableSelection (list) {
            this.relateTableList = list
        },

        exportExcel () {
            this.refs.table.getExportExcel ()
        },

        clearUserPage (list, data) {
            if (list.length == 0 || list.length > 1) {
                this.$message.warning ('选择一条数据')
                return
            }
            if (list[0].id.indexOf ('D') != -1) {
                this.$message.warning ('只能选择人员')
                return
            }
            this.isShowAdminDialog = false
            let item = this.neatenTastDecompositionData (list, data)
            this.proceedPurchaseTastDecomposition (item)
        },

        btnClick (value, field) {
            field == 'warehouseName' ? this.dialogVisible = true : this.dialogVisible = false
        },

        getPopoutEntreport (item) {
            this.dialogVisible = false
            if (item) {
                this.values['warehouseId'] = item.id
                this.values.warehouseName = item.name
                this.values.warehouseAddress = item.address + item.detailedAddress
            }
        },

        taskDecomposition () {
            if (this.relateTableList.length === 0) {
                this.$message.warning ('至少选择一条采购任务')
                return
            }
            this.isShowAdminDialog = true
        },

        neatenTastDecompositionData (list, data) {
            let item = {}, num = 0
            Object.assign (item, this.values)
            this.relateTableList.forEach (res => num += Number (res.money2) )
            item['nominator'] = list[0].name, item['nominatorId'] = list[0].id, item['total'] = num + '', item['taskName'] = data.name, item['materialList'] = this.relateTableList
            return item
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
                    this.neatenRemoteData ()
                    break
            }
        },

        neatenDataSource (res) {
            res.total = res.total + ''
            res.materialList = this.numberToString (res.materialList, true)
            this.screenProjectTypeToProjectList (res.projectType)
            if (res.children && res.children.length > 0) {
                res.children.forEach (item => {
                    item['parentCode'] = res.taskCode, item['parentName'] = res.taskName
                    item['combination'] = `${item.taskName} ( 采购人: ${item.nominator}) ${item.isTermination == '1' ? '( 已撤回 )' : item.state == '0' 
                        ? '( 未使用 )' : item.state == '1' 
                            ? '( 部分使用 )' : item.state == '2' 
                                ? '( 全部使用 )' : ''}`
                    item.materialList = this.numberToString (item.materialList, false)
                })
                this.tableData.records = res.children
            }
            if (!res.warehouseName) delete res.warehouseName
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
            return res
        },

        numberToString (list, boolean) {
            list.forEach ((f, index) => {
                f.number1 = f.number1 + '', f.money1 = f.money1 + '', f.money2 = f.money2 + '', f['consumablesName'] = f.consumables == '1' ? '是' : '否'
            })
            return list
        },

        closePageTag () {
            let tagName = this.$route.path
            let path = `/materialEquipmentManagement/procurementManagement/${this.$route.params.path}`
            this.close ({ tagName, path })
        },
    },

    created () {
        this.transform = this.$route.params.transform || {}
        this.isTaskDecomposition = this.$route.params.isTaskDecomposition || false
        this.isShowTaskDecompositionRecord = this.$route.params.isShowTaskDecompositionRecord || false
        if (this.$route.params && this.$route.params.relevancyId) {
            this.getAllTaskData (this.$route.params.relevancyId)
        } else {
            this.getFormByJson ()
        }
        if(this.$route.params.identification == '1') this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad')
    },

    computed: {
        ...mapState ('d2admin/selfSupportProject', [
            'selfSupportProject'
        ])
    },

    mounted () {
        than = this
    }
}
</script>

<style lang='scss'>
    .updata-all-task {
        .updata-all-task-basic {
            .updata-all-task-basic-generate {
                padding: 0 20px
            }
            .updata-all-task-content___upload {
                padding: 0 30px;
                .updata-all-task-content___label {
                    font-size: 14px;
                    float: left;
                    color: $input-disable;
                    margin-left: 60px
                }
                .updata-all-task-content___right {
                    margin-left: 130px
                }
            }
            .updata-all-task-decomposition {
                padding: 0 0 15px 35px
            }
            .updata-all-task-decomposition-table {
                .el-tabs__header {
                    padding-left: 15px;
                    padding-right: 145px;
                }
                .el-icon-arrow-left:before {
                    font-size: 20px
                }
                .el-icon-arrow-right:before {
                    font-size:  20px;
                }
                .font-color-discontinue {
                    color: $color-danger;
                }
                .font-color-success {
                    color: $color-success;
                }
            }
            .qqt-Relate-table {
                padding: 0px 20px 15px 35px !important
            }
        }
        .updata-all-task-tabs {
            .el-tabs__header {
                margin: 0 0 25px !important;
            }
            .el-tabs__content {
                padding: 0 20px !important
            }
            .el-tabs__nav {
                left: 40px;
            }
        }
        
        .updata-all-task-breakdown-record {
            position: fixed;
            right: 35px;
            top: 160px;
            .updata-all-task-breakdown-record___right {
                padding-right: 40px;
                float: right;
                p {
                    display: inline-block;
                }
            }
            .el-button-group {
                top: -2px;
                position: relative;
            }
        }
        .updata-all-task-button {
            text-align: center;
            margin-top: 5px;
        }
        
        .el-card__body {
            padding: 42px 0px !important
        }
    }
</style>
