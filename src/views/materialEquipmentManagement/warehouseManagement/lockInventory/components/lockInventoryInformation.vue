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
                            :remoteOption="remoteOption"
                            :value="values"
                            :transform="transform"
                            ref="generateForm"
                            @on-change="selectGenerateChange"
                            @btn-click="btnClick"/>

                        <el-divider content-position="left">
                        <div class="generate-from-divider___line"></div>
                            锁库材料明细
                        </el-divider>
                        <div class="other-warehouses-info-button" v-if="!transform.isShowDetails">
                            <el-button size="mini" round @click="warehouseOrderBtn">从仓库导入</el-button>
                        </div>
                        <div class="other-warehouses-info">
                            <qqt-relate-table :data="values.materialList" :replaceRules="rules" ref="materials" :isShowAdd="false" :isDefaultShowRow="false" :rowHeader="materialsHeader" :isShowDetails="transform.isShowDetails" />
                        </div>
                        <bottomInformation :values="values" :fieldTitle="fieldTitle" :timeTitle="timeTitle" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation"></bottomInformation>
                    </template>
                </qqt-flow-tabs>
            </div>

             <div class="operation-button">
                <el-button size="mini" type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submissionScrapRecord (true)">重新提交</el-button>
                <el-button size="mini" type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button size="mini" type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button size="mini" type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button size="mini" type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button size="mini" type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveScrapRecord">保存</el-button>
                <el-button size="mini" type="primary" v-if="!transform.isShowDetails && procInstId === '' && $has ('material:warehouse:lock:submit')" @click="submissionScrapRecord (false)">提交</el-button>
                <el-button size="mini" @click="closeTag">关闭</el-button>
            </div>
        </el-card>
        
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataReturnedGoods"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentReturnedGoods" />

        <popout-material-depot v-if="popoutMaterial" title="仓库材料" :dialogVisible="popoutMaterial" :warehouseId="values.warehouseId" @close="getMaterialData" />
        <popout-entreport v-if="dialogVisibles" :dialogVisible="dialogVisibles" @close="getPopoutEntreport" :isEntrepot="true" />

    </d2-container>
</template>

<script>
    import { formGetJson } from '../../../../../api/system/fromManagement/index'
    import { editLockInventoryList, addLockInventoryList, submitLockInventoryList, resubmitLockInventoryList, queryByIdLockInventoryList, operationLockInventoryList } from '../../../../../api/materialEquipmentManagement/warehouseManagement/lockInventory'
    import { MATERIALEQUIPMENTMANAGEMENT } from '../../../../../enum/FORMCODE'
    import { mapActions } from 'vuex'
    import { queryDicById } from '../../../../../api/jointProject/index'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, qqtRelateTable, upload } from '../../../../../components/qqt-subassembly'
    import { getAllSelfProject, getAllJointProject } from '../../../../../api/jointProject/index'
    import { getDetails } from '../../../../../api/approval/common'

    import popoutEntreport from '../../../basicInformation/entrepot/components/popoutEntreport'
    import popoutMaterialDepot from '../../../basicInformation/materialDepot/components/popoutMaterialDepot'
    import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
    import util from '@/libs/util.js'
    let that = this
    export default {
        
        data() {
            return {
                values:{
                    category: '',
                    warehouseName: '',
                    warehouseSite: '',
                    createBy: '',
                    departmentId: '',
                    departmentName: '',
                    projectName: '',
                    warehouseId: '',
                    categoryId: '',
                    projectType: '1',
                    sectionName: '',
                    materialList: [],
                    money1:'',
                    amount: 0,
                    lockTime: ''
                },
                fieldTitle: '锁定',
                timeTitle: '锁定',
                jsonData: {},
                remoteFuncs: {},
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
                categoryArr: [],
                relevanceProject: [],
                departmentNameArr:[],
                transform: {
                    isShowDetails: false
                },
            
                // 添加行
                lockingMaterialTabsData: [],
                isTabsShowDetails: false,

                popoutMaterial: false,
                dialogVisible: false,
                dialogVisibles: false,

                materialsHeader: [
                    {
                        prop: 'code',
                        label: '材料编码',
                        isShow: true,
                        type: 'text',
                        isShowDetails: true
                    },
                    {
                        prop: 'name',
                        label: '名称',
                        isShowElement: true,
                        type: 'text',
                        isShowDetails: true
                    },
                    {
                        prop: 'brandName',
                        label: '品牌',
                        isShow: true,
                        type: 'text',
                        isShowDetails: true
                    },
                    {
                        prop: 'specificationName',
                        label: '规格型号',
                        isShow: true,
                        type: 'text',
                        isShowDetails: true
                    },
                    {
                        prop: 'unit',
                        label: '计量单位',
                        isShow: true,
                        type: 'text',
                        isShowDetails: true
                    },
                    // {
                    //     prop: 'quantity',
                    //     label: '库存数量',
                    //     isShow: true,
                    //     type: 'text',
                    //     isShowDetails: true
                    // },
                    // {
                    //     prop: 'lockNumber',
                    //     label: '已锁库数量',
                    //     isShow: true,
                    //     type: 'text',
                    //     isShowDetails: true
                    // },
                    {
                        prop: 'number3',
                        label: '锁库数量',
                        isShow: true,
                        type: 'text',
                        isNonnegativeNumber: true
                    },
                    {
                        prop: 'money1',
                        label: '单价（元）',
                        isShow: true,
                        type: 'text',
                        isShowDetails: true,
                        isNonnegativeNumber: true
                    },
                    {
                        prop: 'money2',
                        label: '锁库物品总价（元）',
                        isShow: true,
                        type: 'total',
                        isMoneyType: true,
                        controlRow: 'number3 * money1',
                        isShowDetails: true
                    },
                    {
                        prop: 'consumables',
                        label: '是否消耗品',
                        isShow: true,
                        type: 'text',
                        isShowDetails: true
                    },
                    {
                        prop: 'remark',
                        label: '备注',
                        isShow: true,
                        type: 'text'
                    }
                ],

                rules: {
                    'number3': [
                        { required: true, message: '锁定数量不能为空', trigger: 'change' }
                    ]
                    
                },

                upLoadFileDefaultList: [],
                
                 // 流程
                stutas:'',
                procInstId: '',
                nodeData: {
                    operation: '',
                    msg:''
                },
                processModuleId: MATERIALEQUIPMENTMANAGEMENT.LOCKINVENTORYINFORMATION,
                dialogVisible: false,
                visible: false,
                isReject: false,
                isSendBack: false,
                isTurnManage: false,
            };
        },
        methods: {
            getFormByJson () {
                formGetJson ({'code': MATERIALEQUIPMENTMANAGEMENT.LOCKINVENTORYINFORMATION}).then(res => {
                    if (res) {
                        this.jsonData = JSON.parse(res)
                    }
                })
            },

            upLoadFileCallBack (item) {
                this.values.fileList = item
            },

            getMaterialData (item) {
                this.popoutMaterial = false
                if (item) this.neatenMaterialList (item) 
            },

            neatenMaterialList (data = [], boolean = false) {
                let item = {}, list = []
                data.length > 0 ? this.values.materialList = this.$refs.materials.getNotVerify () : data = this.$refs.materials.getNotVerify ()
                data.forEach (res => {
                    res['money1'] = res.price ? res.price + '' : '0'
                    res.lockNumber = res.lockNumber ? res.lockNumber + '' : '0'
                    res.quantity = res.quantity ? res.quantity + '' : '0'
                    res.parentId = res.id
                    res['consumables'] = res.consumables == '1' ? '是' : '否'
                    this.values['amount'] += Number (res.money2)
                    item = this.values.materialList.find (f => f.id == res.id)
                    if (!item) list.push (res)
                })
                !boolean ? this.values.materialList.push (...list) : (this.values.materialList = JSON.parse (JSON.stringify (data)), this.values.amountString = this.values['amount'] + '')
            },

             //  仓库所在地
            warehouseOrderBtn () {
                if (this.values.warehouseName) {
                    this.popoutMaterial = true
                } else {
                    this.$message.warning('请选择仓库名称')
                }
            },

            // 锁库类型
            getqueryDicById () {
                queryDicById ({id: '1216545592054325248'}).then(res =>{
                    if (res && res.length > 0) {
                        this.categoryArr = res
                        // if(res && res.length){
                        //     res.forEach (data => {
                        //         this.values.category = ''
                        //         this.values.categoryId = ''
                        //     })
                        // }
                        this.neatenData ()
                    }
                }).finally(res => {
                    this.getFormByJson()
                })
            },

            // 存放仓库
            btnClick (value, field) {
                field == 'warehouseName' ? this.dialogVisibles = true : this.dialogVisibles = false
            },
            getPopoutEntreport (item) {
                this.dialogVisibles = false
                if (item) {
                    this.values.materialList = []
                    this.values['warehouseId'] = item.id
                    this.values.warehouseName = item.name
                    this.values.warehouseSite = item.address + item.detailedAddress
                }
            },

            selectGenerateChange (id, value, model) {
                switch(id){
                    case 'departmentName': 
                        this.departmentNameArr.forEach(item => {
                            if(item.id === value){
                                model.departmentId = item.id ? item.id : " "
                                model.departmentName = item.name ? item.name : " "
                            }
                            this.values = model
                        })
                        break
                    case 'lockTime':
                        this.values.lockTime = value
                        break
                    case 'categoryId':
                        this.values.categoryId = value
                        let selectRow = this.categoryArr.find(item => item.id === value)
                        this.values.category = selectRow.name;
                        break
                    case 'projectType':
                        this.values.projectId = '', this.values.projectType = value
                        value == '2' ? this.getAllJointProjectList () : this.getAllSelfProjectList ()
                        break
                    case 'projectId':
                        this.values.projectId = value
                        let item = this.relevanceProject.find (f => f.id === value)
                        if (item) this.values['projectName'] = item.projectName, this.values['sectionName'] = item.section
                        break
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
                    this.getQueryByIdLockInventoryList (this.$route.params.relevancyId)
                } else {
                    this.getAllSelfProjectList ()
                }
            },

            getQueryByIdLockInventoryList (id) {
                queryByIdLockInventoryList({
                    id: id
                }).then( res => {
                    if(res) {
                        res.projectType == '2' ? this.getAllJointProjectList () : this.getAllSelfProjectList ()
                        if(res.materialList && res.materialList.length > 0) {
                            res.materialList.forEach( m => {
                                m.money1 = m.money1.toString()
                                m.number3 = m.number3.toString()
                                m.money2 = m.money2.toString ()
                                m.price = m.money1.toString ()
                            })
                        }
                  
                        this.values = res
                        this.values['amountString'] = this.values['amount'] + ''
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
                })
            },

            getDetailsList (taskId) {
                getDetails (taskId).then (res => {
                    if (res) this.nodeData = res
                })
            },

            consentReturnedGoods (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closeTag ()
                    return
                }
                if (item) {
                    this.values['completeTask'] = item
                    operationLockInventoryList (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success (res.message)
                            this.closeTag ()
                        }
                    })
                }
            },

            // 保存
            saveScrapRecord () {
                let url = '', boolean = {}, num = 0, required = false, element = {}
                boolean = this.$refs.materials.verify ()
                element = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && boolean && element) {
                        Object.assign (this.values, data, element)
                        this.values['materialList'] = boolean
                        this.values['materialList'].forEach( m => {
                            m.materialId = m.id
                            num += Number (m.money2)
                            if( m.number3 > m.quantity ) {
                                required = true
                                this.$message.warning('将要锁定库存数量不能大于库存数量')
                            }
                        })
                        if (required) true
                        this.values.id == null ? url = addLockInventoryList : url = editLockInventoryList
                        this.values['amount'] = num
                        
                        url (this.values).then (res => {
                            if (res.code === 200) {
                                this.$message.success ('保存成功')
                                this.closeTag ()
                            }
                        })
                    }
                })
            },

            // 提交
            submissionScrapRecord () {
                let num = 0
                let list = this.$refs.materials.verify ()
                let element = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && list && element) {
                        Object.assign (this.values, data, element)
                        this.values['materialList'] = list
                        this.values['materialList'].forEach( m => {
                            m.materialId = m.id
                            num += Number (m.money2)
                            if( m.number3 > m.quantity ) {
                                this.$message.warning('将要锁定库存数量不能大于库存数量')
                            } else {
                                this.dialogVisible = true
                            }
                        })
                        this.values['amount'] = num
                        this.prossValue = {
                            title: this.$route.params.title || `锁定库存:【 ${data.name} 】`,
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.params.degree || '',
                            msg: '',
                        }
                    }
                })
            },

            updataReturnedGoods (item, boolean) {
                let url = ''
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                boolean ? url = resubmitLockInventoryList : url = submitLockInventoryList
                url (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closeTag ()
                    }
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
                this.remoteFuncs = {
                    getCategory (resolve) {
                        resolve (that.categoryArr)
                    },

                    getProjectName (resolve) {
                        resolve (that.relevanceProject)
                    }
                }
            },

            closeTag () {
                let tagName = this.$route.path
                let path = '/materialEquipmentManagement/warehouseManagement/lockInventory'
                this.close ({ tagName, path })
            },

            ...mapActions('d2admin/page', [
                'close' 
            ]),

            changeDataEvent (data, prop, value) {
                this.$emit ('changeDataEvent', data, prop, value)
            },

            neatenLockInventory () {
                if (this.$route.params && this.$route.params.iseLockingInventory) {
                    this.getPopoutEntreport (this.$route.params.data)
                    this.neatenMaterialList (this.$route.params.data.materialList)
                }
            }
        },

        created() {
            this.updataRouter ()

            this.getqueryDicById()

            this.transform = this.$route.params.transform

        },

        mounted () {
            this.neatenLockInventory ()
            that = this
        },

        components: {
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent,
            'qqt-relate-table': qqtRelateTable,
            'bottomInformation': bottomInformation,
            'popout-material-depot': popoutMaterialDepot,
            'popout-entreport': popoutEntreport
        },
    };
</script>

<style lang='scss' scoped>
    .scrap-record-info{
        background: #ffffff
    }
    .operation-button{
        margin: 0 auto;
        text-align: center;
        margin-top: 12px
    }
    
    .other-warehouses-info-button {
        float: right;
        top: -40px;
        background: #fff;
        width: 100px;
        position: relative;
        text-align: right;
    }
</style>