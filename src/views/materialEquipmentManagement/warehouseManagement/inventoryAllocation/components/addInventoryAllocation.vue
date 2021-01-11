<template>
    <d2-container type="fulls" class="addInventoryAllocation">
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
                            @btn-click="btnClick"
                        />
                        <div class="add-inventory-allocation-button">
                            <el-button size="mini" round @click="popoutMaterial = true" :disabled="transform.isShowDetails">从材料库导入</el-button>
                        </div>
                        <el-divider content-position="left">
                            <div class="generate-from-divider___line"></div>
                            库存调拨材料明细
                        </el-divider>
                        <qqt-relate-table :data="values.materialList" ref="materials" :isShowAdd="false" :isDefaultShowRow="false" :rowHeader="materialsHeader" :isShowDetails="transform.isShowDetails" />
                        <bottomInformation :values="values" :fieldTitle="fieldTitle" :timeTitle="timeTitle" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation"></bottomInformation>
                    </template>
                </qqt-flow-tabs>
            </div>
            <div class="qqt-container-full-content___button">
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitInventoryAllocationData ()">重新提交</el-button>
                <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveInventoryAllocation">保存</el-button>
                <el-button type="primary" v-if="!transform.isShowDetails && procInstId === '' && this.$has ('material:warehouse:allot:submit')" @click="values['flag'] = '1', submitInventoryAllocationData ()">提交</el-button>
                <el-button @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataInventoryAllocation"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentInventoryAllocation" />
        <popout-material-depot v-if="popoutMaterial" title="仓库材料" :dialogVisible="popoutMaterial" :warehouseId="values.outWarehouseId" @close="getMaterialData" />
        <popout-entreport v-if="dialogVisibles" treeTitle="仓库分类" :isShowHeader="true" :dialogVisible="dialogVisibles" @close="getPopoutEntreport" :isEntrepot="isEntrepot" />
    </d2-container>
</template>

<script>
    import { getInventoryAllocationById, editInventoryAllocation,
                addInventoryAllocation, submitInventoryAllocation, completeInventoryAllocation, resetSubmitInventoryAllocation } from '@/api/materialEquipmentManagement/warehouseManagement/InventoryAllocation'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, upload, qqtRelateTable } from '@/components/qqt-subassembly'
    import { getAllSelfProject, getAllJointProject } from '../../../../../api/jointProject/index'
    import { formGetJson } from '@/api/system/fromManagement/index'
    import { MATERIALEQUIPMENTMANAGEMENT } from '@/enum/FORMCODE'
    import { getDetails } from '@/api/approval/common'
    import { mapActions } from 'vuex'

    import popoutEntreport from '../../../basicInformation/entrepot/components/popoutEntreport'
    import popoutMaterialDepot from '../../../basicInformation/materialDepot/components/popoutMaterialDepot'
    import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
    import util from '@/libs/util.js'
import { getCustomerDictionaryTocustomerAuthorization } from '../../../../../api/customerManagement/expandInformation'
    let than = this
    export default {

        data () {
            return {
                title: '',
                stutas: '',
                procInstId: '',
                warehousefield: '',
                remote: {},
                values: {
                    materialList: [],
                    fileList: [],
                    projectType: '',
                    sectionName: '',
                    departmentId: '',
                    inWarehouseName: '',
                    outWarehouseName: ''
                },
                fieldTitle: '申请',
                timeTitle: '申请',
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
                visible: false,
                isReject: false,
                isEntrepot: false,
                isSendBack: false,
                isTurnManage: false,
                dialogVisible: false,
                dialogVisibles: false,
                popoutMaterial: false,
                processModuleId: MATERIALEQUIPMENTMANAGEMENT.ADDINVENTORYALLOCATION,
                upLoadFileDefaultList: [],
                relevanceProject: [],
                departmentList: [],
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
                        prop: 'money1',
                        label: '单价',
                        isShow: true,
                        type: 'money',
                        btnTitle: '元',
                        width: 200,
                        isShowDetails: true
                    },
                    {
                        prop: 'number3',
                        label: '调拨数量',
                        isShow: true,
                        type: 'text',
                        width: 200,
                        required: true,
                        isNonnegativeNumber: true
                    },
                    {
                        prop: 'money2',
                        label: '总价',
                        isShow: true,
                        type: 'total',
                        btnTitle: '元',
                        controlRow: 'number3 * money1',
                        width: 200,
                        isShowDetails: true
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
            }
        },

        methods: {

            ...mapActions('d2admin/page', [
                'close',
            ]),

            getFormByJson () {
                formGetJson ({ 'code': this.processModuleId }).then(res => {
                    if (res) this.jsonData = JSON.parse(res)
                })
            },

            getInventoryAllocation (id) {
                getInventoryAllocationById ({'id': id}).then (res => {
                    if (res) {
                        res.projectType == '2' ? this.getAllJointProjectList () : this.getAllSelfProjectList ()
                        res.materialList.forEach (item => {
                            item.number3 = item.number3 + '', item.money2 = item.money2 + '',
                            item.money1 = item.money1 + '', item['consumablesName'] = item.consumables == '1' ? '是' : '否'
                        })
                        res.amount = res.amount + ''
                        this.values = res
                        this.prossValue.title = `库存调拨:【 ${this.values.name} 】`
                        this.fileDefaultNeaten (res)
                    }
                })
            },

            saveInventoryAllocation () {
                let url = '', list = [], element = {}, num = 0
                list = this.$refs.materials.verify ()
                element = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && list && element) {
                        Object.assign (this.values, data, element)
                        list.forEach (res => num += Number (res.money2))
                        this.values['amount'] = num
                        this.values['materialList'] = list
                        this.values.id == null ? url = addInventoryAllocation : url = editInventoryAllocation
                        url (this.values).then (res => {
                            if (res.code === 200) {
                                this.$message.success ('保存成功')
                                this.closePageTag ()
                            }
                        })
                    }
                })
            },

            submitInventoryAllocationData () {
                let num = 0, list = {}, element = {}
                list = this.$refs.materials.verify ()
                element = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && list && element) {
                        Object.assign (this.values, data, element)
                        list.forEach (res => num += Number (res.money2))
                        this.values['amount'] = num
                        this.values['materialList'] = list
                        this.dialogVisible = true
                        this.prossValue = {
                            title: this.$route.params.title || `库存调拨:【 ${data.name} 】`,
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.params.degree || '',
                            msg: '',
                        }
                    }
                })
            },

            updataInventoryAllocation (item, boolean) {
                let url = ''
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                boolean ? url = resetSubmitInventoryAllocation : url = submitInventoryAllocation
                url (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closePageTag ()
                    }
                })
            },

            consentInventoryAllocation (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closePageTag ()
                    return
                }
                if (item) {
                    this.values['completeTask'] = item
                    completeInventoryAllocation (this.values).then (res => {
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

            // 自营
            getAllSelfProjectList () {
                getAllSelfProject ().then (res => {
                    if (res instanceof Array) {
                        res.forEach (item => { item['id'] = item.projectCode, item['section'] = item.sectionDic })
                        this.relevanceProject = res
                        this.neatenData ()
                    }
                })
            },

            // 联营
            getAllJointProjectList () {
                getAllJointProject ().then (res => {
                    if (res instanceof Array) this.relevanceProject = res, this.neatenData ()
                })
            },

            closePageTag () {
                let tagName = this.$route.path
                let path = ``
                this.stutas ? path = `/approval/${this.stutas}` : path = `/materialEquipmentManagement/warehouseManagement/inventoryAllocation`
                this.close ({ tagName, path })
            },

            upLoadFileCallBack (item) {
                this.values.fileList = item
            },

            getMaterialData (item) {
                this.popoutMaterial = false
                if (item) this.neatenMaterialList (item) 
            },

            neatenMaterialList (data = []) {
                let item = {}, list = [], num = 0
                data.length > 0 ? this.values.materialList = this.$refs.materials.getNotVerify () : data = this.$refs.materials.getNotVerify ()
                data.forEach (res => {
                    res['number3'] = '0'
                    res.parentId = res.id
                    res.money1 = res.price + ''
                    res['consumablesName'] = res.consumables == '1' ? '是' : '否'
                    num += Number (res.totalPrice)
                    item = this.values.materialList.find (f => f.id == res.id)
                    if (!item) list.push (res)
                })
                this.values.materialList.push (...list)
            },

            selectGenerateChange (field, val, models) {
                let item = '', str = ''
                switch (field) {
                    case 'departmentId':
                        item = this.departmentList.find (f => f.id === val)
                        if (item) this.values['departmentName'] = item.name
                        break
                    case 'projectId':
                        this.values.projectId = val
                        item = this.relevanceProject.find (f => f.id === val)
                        if (item) this.values['projectName'] = item.projectName, this.values['sectionName'] = item.section
                        break
                    case 'projectType':
                        if (this.values.projectId != models.projectId)  this.values.projectId = ''
                        this.values.projectType = val, 
                        val == '2' ? this.getAllJointProjectList () : this.getAllSelfProjectList ()
                        break
                }
            },

            btnClick (value, field) {
                field == 'outWarehouseName' ? this.isEntrepot = true : this.isEntrepot = false
                this.dialogVisibles = true
                this.warehousefield = field
            },

            getPopoutEntreport (item) {
                this.dialogVisibles = false
                if (item) {
                    this.warehousefield == 'inWarehouseName' 
                        ? (this.values['inWarehouseId'] = item.id, this.values.inWarehouseName = item.name, this.values.inWarehouseSite = item.address + item.detailedAddress)
                            : (this.values.materialList = [], this.values['outWarehouseId'] = item.id, this.values.outWarehouseName = item.name, this.values.outWarehouseSite = item.address + item.detailedAddress)
                }
            },

            neatenData () {
                this.remote = {

                    getProjectName (resolve) {
                        resolve (than.relevanceProject)
                    },

                    getDepartmentName (resolve) {
                        resolve (than.departmentList)
                    }
                }
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
                    this.getInventoryAllocation (this.$route.params.relevancyId)
                }
            }
        },

        created () {
            this.getFormByJson ()
            this.updataRouter ()
        },

        mounted () {
            than = this
        },

        components: {
            'popout-material-depot': popoutMaterialDepot,
            'popout-entreport': popoutEntreport,
            'qqt-send-process': qqtSendProcess,
            'qqt-relate-table': qqtRelateTable,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent,
            'bottomInformation': bottomInformation,
        }
    }
</script>

<style lang='scss'>
    .addInventoryAllocation {
        .add-inventory-allocation-button {
            float: right;
            position: relative;
            top: 10px;
            background: #fff;
            width: 120px;
            text-align: right;
            z-index: 1;
        }
        .qqt-Relate-table {
            padding-top: 10px;
            padding-bottom: 15px;
        }
    }
</style>
