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
                            @on-change="selectGenerateChange"
                            :value="values"
                            :transform="transform"
                            ref="generateForm">
                            <template slot="selectDataSource"> 
                                <el-row class="choose-order" v-if="chooseOrder">
                                    <el-form :model="values" ref="returnedGoodsInfo" :rules="rules" label-width="140px" size="medium">
                                        <el-col :span="8">
                                            <el-form-item label="领用订单名称:" prop="applySourceName">
                                                <qqt-select :value="values.applySourceName" :isShowElement="!transform.isShowDetails"  :defaultProp="sourceProp" :options="applySourceArr" @select="chooseOrderEvent"/>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="16">
                                            <el-form-item label="领用订单编号:">
                                                <qqt-input v-model="values.applySourceCode" placeholder="根据领用订单名称自动获取" :isShowElement="false"></qqt-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-form>
                                </el-row>

                                <el-row class="select-warehouse" v-if="selectWarehouse">
                                    <el-form :model="values" ref="returnedGoodsInfo" :rules="rules" label-width="140px" size="medium">
                                        <el-col :span="8">
                                            <el-form-item label="存放仓库:" prop="depositoryName">
                                                <qqt-input v-model="values.depositoryName" :isShowElement="!transform.isShowDetails" :readonly="true" @focus="dialogVisible = true" placeholder="请选择仓库" ></qqt-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="16">
                                            <el-form-item label="仓库地点:" >
                                                <qqt-input v-model="values.depositoryAddress" placeholder="根据仓库自动获取" :isShowElement="false"></qqt-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-form>
                                </el-row>

                                <el-row class="choice-goods" >
                                    <el-form :model="values" ref="returnedGoodsInfo" :rules="rules" label-width="140px" size="medium">
                                        <el-col :span="8" v-if="nameGoods">
                                            <el-form-item label="物品名称:" prop="alias">
                                                <qqt-input v-model="values.alias" :isShowElement="!transform.isShowDetails" @focus="materialScienceEvent" placeholder="请选择物品" ></qqt-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8" v-else>
                                            <el-form-item label="材料名称:" prop="alias">
                                                <qqt-select v-model="values.alias" :isShowElement="!transform.isShowDetails" :defaultProp="materialScienceProp" placeholder="请选择材料" :options="materialScienceArr" @select="materialScienceEvent"/>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item label="类型:" >
                                                <qqt-input v-model="values.groupName" placeholder="根据物品名称自动获取" :isShowElement="false"></qqt-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item label="品牌:" >
                                                <qqt-input v-model="values.brandName" placeholder="根据物品名称自动获取" :isShowElement="false"></qqt-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-form>
                                </el-row>
                            </template>
                        </fm-generate-form>
                    </template>
                </qqt-flow-tabs>
            </div>
            <bottom-information :values="values" :fieldTitle="fieldTitle" :timeTitle="timeTitle" :isShowAccessory="false" :transform="transform" ref="bottomInformation" />
             <div class="operation-button">
                <el-button size="mini" type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submissionReturnedGoodsInfo (true)">重新提交</el-button>
                <el-button size="mini" type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button size="mini" type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button size="mini" type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button size="mini" type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button size="mini" type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveScrapRecord">保存</el-button>
                <el-button size="mini" type="primary" v-if="!transform.isShowDetails && procInstId === '' && $has ('material:scrap:apply:submit')" @click="values['flag'] = '1', submissionReturnedGoodsInfo (false)">提交</el-button>
                <el-button size="mini" @click="closeTag">关闭</el-button>
            </div>
            <qqt-send-process v-if="flowDialogVisible" :dialogVisible="flowDialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="flowDialogVisible = false" @selectData="updataScrapRecordInfo"/>
            <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentScrapRecordInfo" />

        </el-card>
        <popout-material-depot v-if="popoutMaterial" :warehouseId="values.depositoryId" :dialogVisible="popoutMaterial" @close="getMaterialData" />
        <popout-entreport v-if="dialogVisible" :dialogVisible="dialogVisible" :materialId="materialId" @close="getPopoutEntreport" />
    </d2-container>
</template>

<script>
    import util from '@/libs/util.js'
    import { mapActions, mapState } from 'vuex'
    import { MATERIALEQUIPMENTMANAGEMENT } from '../../../../../enum/FORMCODE'
    import { formGetJson } from '../../../../../api/system/fromManagement/index'
    import { getDetails } from '../../../../../api/approval/common'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, upload, qqtInput, qqtSelect } from '../../../../../components/qqt-subassembly'
    import { getSupplierPageAllList } from '../../../../../api/materialEquipmentManagement/supplierManagement/supplierList'
    import { addScrapRequest, editScrapRequest, submitScrapRequest, queryByIdScrapRequest, operationScrapRequest, resubmitScrapRequest, serviceLifeArticles,
    applyForOrder } from '../../../../../api/materialEquipmentManagement/scrapManagement/scrapRecord'
    import { canRegisterList } from '../../../../../api/materialEquipmentManagement/receiveManagement/receiveApply'
    import { getUserDepartById } from '../../../../../api/system/depart/depart'
    import popoutMaterialDepot from '../../../basicInformation/materialDepot/components/popoutMaterialDepot'
    import popoutEntreport from '../../../basicInformation/entrepot/components/popoutEntreport'
    import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
    
    export default {
      
        data() {
            let that = this
            return {
                data: {
                    
                },
                // 领用订单默认参数
                sourceProp: {
                    value: 'id',
                    label: 'applyname'
                },
                // 材料名称values
                materialScienceProp: {
                    value: 'id',
                    label: 'alias'
                },
                
                // 物品/材料显示
                nameGoods: false,
                                                                                                          
                // 领用订单显示
                chooseOrder: false,
                // 存放仓库显示
                selectWarehouse: false,
                // 领用订单下拉选
                applySourceArr: [],

                materialScienceArr: [],

                values:{},
                fieldTitle: '申请',
                timeTitle: '申请',
                dataSource: {
                    applySourceId:'',
                    applySourceName:'',
                    applySourceCode:'',
                    depositoryName: '',
                    depositoryId: "",
                    depositoryAddress: '',
                    // 获取领用要传的字段
                    mainId: '',
                    batch: '',
                    createBy:"",
                    createName: "",
                    departmentId: "",
                    departmentName: "",
                    number: "",
                    unitPrice: "",
                    totalPrice: 0,
                    serviceLife: "",
                    processMethod: '',
                    alias: '', // 物品名称
                    groupName: '', //类型
                    brandName: '', // 品牌
                    specificationName: '' ,
                    createTime: new Date().format("yyyy-MM-dd hh:mm:ss"),
                },
                itemData: {},
                jsonData: {},
                upLoadFileDefaultList: [],
                flowDialogVisible: false,
                dialogVisible: false,
                materialId: '',
                // 流程
                stutas:'',
                procInstId: '',
                nodeData: {
                    operation: '',
                    msg:''
                },
                processModuleId: MATERIALEQUIPMENTMANAGEMENT.SCRAPRECORDINFO,
                visible: false,
                isReject: false,
                isSendBack: false,
                isTurnManage: false,

                remoteFuncs: {
                    // 新旧程度
                    getIntact (resolve) {
                        resolve ([
                            {
                                id: '10',
                                name: '全新'
                            },
                            {
                                id: '1',
                                name: '一成新'
                            },
                            {
                                id: '2',
                                name: '二成新'
                            },

                            {
                                id: '3',
                                name: '三成新'
                            },
                            {
                                id: '4',
                                name: '四成新'
                            },
                            {
                                id: '5',
                                name: '五成新'
                            },
                            {
                                id: '6',
                                name: '六成新'
                            },
                            {
                                id: '7',
                                name: '七成新'
                            },
                            {
                                id: '8',
                                name: '八成新'
                            },
                            {
                                id: '9',
                                name: '九成新'
                            },
                        ])
                    },
                    // 处理方式
                    getProcessMethod (resolve) {
                        resolve ([
                            {
                                id: '1',
                                name: '就地销毁'
                            },
                            {
                                id: '2',
                                name: '从仓库报废'
                            }
                        ])
                    },
                    getSupplierName (resolve) {
                        resolve(that.supplierNameArr)
                    },
                    getDepartmentName (resolve) {
                        resolve(that.departmentNameArr) 
                    }
                },

                departmentNameArr: [],
                supplierNameArr:[],
                popoutMaterial: false,

                transform: {
                    isShowDetails: false
                },

                // 流程
                stutas:'',
                procInstId: '',
                nodeData: {
                    operation: '',
                    msg:''
                },
                rules: {
                    depositoryName: [
                        { required: true, message: '存放仓库不能为空', trigger: 'change' }
                    ],
                    alias: [
                        { required: true, message: '请输入物品名称或材料名称', trigger: 'change' }
                    ],
                    applySourceName: [
                        { required: true, message: '领用申请名称不能为空', trigger: 'change' }
                    ]
                },
            };
        },
        methods: {
            getFormByJson () {
                formGetJson ({'code': MATERIALEQUIPMENTMANAGEMENT.SCRAPRECORDINFO}).then(res => {
                    if (res) {
                        this.jsonData = JSON.parse(res)
                    }
                })
            },
            selectGenerateChange (id, value, model) {
                switch (id) {
                    case 'supplierName' :
                        let supplierItem = this.supplierNameArr.find(item => item.id === value)
                        if (supplierItem) {
                            model.supplierContactsName = supplierItem.contactsList[0].line1
                            model.supplierPhone = supplierItem.contactsList[0].line3
                            this.values = model
                        }
                        break
                    case 'departmentName' :
                        this.departmentNameArr.forEach(item => {
                            if(item.id === value){
                                model.departmentId = item.id ? item.id : " "
                                model.departmentName = item.name ? item.name : " "
                            }
                            this.values = model
                        })
                        break
                    case 'processMethod' :
                        this.reset ()
                        if ( value === '1') {
                            this.chooseOrder = true
                            this.selectWarehouse = false
                            this.nameGoods =  false
                            this.getapplyForOrder ()
                        } else if(value === '2') {
                            this.chooseOrder = false
                            this.nameGoods =  true
                            this.selectWarehouse = true
                        }
                        this.values.processMethod = value
                    case 'number' :
                        model.totalPrice = model.number * model.unitPrice

                    case 'unitPrice' :
                        model.totalPrice = model.number * model.unitPrice
                }
            },

            // 领用申请订单所有数据
            getapplyForOrder () {
                applyForOrder().then( res => {
                    this.applySourceArr = res
                })
            },
            // 领用订单下拉选
            chooseOrderEvent (value) {
                let item = this.applySourceArr.find (f => f.id == value)
                if (item) this.values.applySourceName = item.applyname; this.values.applySourceCode = item.applycode; this.values.applySourceId = item.id; this.values.mainId = item.id
                this.getCanRegisterList ()
            },
            // 判断物品还是材料
            materialScienceEvent (value) {
                if (this.values.processMethod == '') {
                    this.$message.warning('请选择报废方式')
                    return
                } else {
                    // 就地报废
                    if ( this.values.processMethod == '1' && this.values.applySourceId !== '' ) {
                        let item = this.materialScienceArr.find (f => f.id == value)
                        const { alias, brandId, brandName, code: materialCode, groupId, groupName, id: applyMaterialld, materialId, name: materialName, specificationId, specificationName, unit, technicalParameters } = item
                        let data = { alias, brandId, brandName, materialCode, groupId, groupName, applyMaterialld, materialId, materialName, specificationId, specificationName, unit, technicalParameters }
                        Object.assign (this.values, data)
                    }else if (this.values.processMethod == '1' && this.values.applySourceId == '' ) {
                        this.$message.warning(('请选择领用订单名称'))

                    } else if (this.values.processMethod == '2' && this.values.depositoryId !== '') {
                        // 仓库报废
                        this.popoutMaterial = true
                    } else if (this.values.processMethod == '2' && this.values.applySourceId == '') {
                        this.$message.warning('请选择存放仓库')
                    } else if (this.values.processMethod == '') {
                        this.$message.warning('请选择报废方式')
                    }
                }
            },

            // 获取可领用单中的材料
            getCanRegisterList () {
                canRegisterList({
                    mainId: this.values.mainId,
                    amount: 'number4',
                    selected: 'number5'
                }).then( res => {
                    this.materialScienceArr = res                
                })
            },

            // 经办人
            // getresignationQueryPersonalDataID () {
            //     getUserDepartById({ 
            //         userId: util.cookies.get ('uuid')
            //     }).then( res => {
            //         this.departmentNameArr = res
            //         this.values.createBy = util.cookies.get ('uuid')
            //         this.values.createName = (util.cookies.get ('username'))
            //     })
            // },

            // 供应商
            getSupplierPageAllListEvent () {
                getSupplierPageAllList().then( res => {
                    this.supplierNameArr = res
                }).finally(res => {
                    this.getFormByJson()
                })
            },

            // 使用年限
            // getServiceLifeArticles (item) {
            //     serviceLifeArticles({
            //         'beginDateStr': item.storageTime
            //     }).then( res => {
            //         this.values.serviceLife = res
            //     })
            // },
            
            // 仓库地址
            getPopoutEntreport (item) {
                this.dialogVisible = false
                if (item) {
                    this.values.depositoryId = item.id
                    this.values.depositoryName = item.name
                    this.values.depositoryAddress = item.address + item.detailedAddress
                }
            },

            // 物品信息
            getMaterialData (item) {
                this.popoutMaterial = false
                if (!item) { return }
                if (item && item.length != 1) {
                    this.$message.warning ('至多选择一条数据')
                    return
                }
                // this.getServiceLifeArticles (item[0])
                const { name: alias, brandId, brandName, code: materialCode, groupId, groupName, id: applyMaterialld, materialId, name: materialName, specificationId, specificationName, unit, technicalParameters } = item[0]
                let data = { alias, brandId, brandName, materialCode, groupId, groupName, applyMaterialld, materialId, materialName, specificationId, specificationName, unit, technicalParameters }
                Object.assign (this.values, data)
            },

            upLoadFileCallBack (item) {
                this.values.fileList = item
            },

            // 保存
            saveScrapRecord () {
                let url = '', info =  {}
                info = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && info) {
                        Object.assign (this.values, data, info)
                        this.values.id == null ? url = addScrapRequest : url = editScrapRequest
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
            submissionReturnedGoodsInfo () {
                let url = '', info =  {}
                info = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && info) {
                        Object.assign (this.values, data, info)
                        this.flowDialogVisible = true
                        this.prossValue = {
                            title: this.$route.params.title || `报废:【 ${this.values.alias} 】`,
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.params.degree || '',
                            msg: '',
                        }
                    }
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
                    operationReturnedGoods (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success (res.message)
                            this.closeTag ()
                        }
                    })
                }
            },

            updataScrapRecordInfo (item, boolean) {
                let url = ''
                this.flowDialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                boolean ? url = resubmitScrapRequest : url = submitScrapRequest
                url (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closeTag ()
                    }
                })
            },

            consentScrapRecordInfo (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closeTag ()
                    return
                }
                if (item) {
                    this.values['completeTask'] = item
                    operationScrapRequest (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success (res.message)
                        }
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
                    this.getQueryByIdScrapRequest (this.$route.params.relevancyId)
                }
            },

            getDetailsList (taskId) {
                getDetails (taskId).then (res => {
                    if (res) this.nodeData = res
                })
            },

            getQueryByIdScrapRequest (id) {
                queryByIdScrapRequest({
                    id: id
                }).then( res => {
                    if(res) {
                        this.values = res
                        if ( this.values.processMethod === '1') {
                            this.chooseOrder = true
                            this.selectWarehouse = false
                            this.nameGoods =  false
                            this.getapplyForOrder ()
                        } else if(this.values.processMethod === '2') {
                            this.chooseOrder = false
                            this.nameGoods =  true
                            this.selectWarehouse = true
                        }
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

            closeTag () {
                let tagName = this.$route.path
                let path = '/materialEquipmentManagement/scrapManagement/scrapRecord'
                this.close ({ tagName, path })
            },
            ...mapActions('d2admin/page', [
                'close' 
            ]),

            reset () {
                this.values = JSON.parse (JSON.stringify (this.dataSource))
            }
        },

        created() {
            
            this.reset ()

            this.getSupplierPageAllListEvent ()

            // this.getresignationQueryPersonalDataID ()

            this.updataRouter ()

            this.values.applytime = (new Date()).toLocaleDateString()
        },

        components: {
            'qqt-send-process': qqtSendProcess,
            'qqt-consent': qqtConsent,
            'qqt-flow-tabs': qqtFlowTabs,
            'up-load': upload,
            'qqt-input': qqtInput,
            'qqt-select': qqtSelect,
            'popout-material-depot': popoutMaterialDepot,
            'popout-entreport': popoutEntreport,
            'bottom-information': bottomInformation
        }
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
    .scrap-record-info___upload {
        padding: 20px 30px;
        .scrap-record-info___label {
            font-size: 14px;
            float: left;
            margin: 0 16px;
            color: $input-disable
        }
        .scrap-record-info__right {
            margin-left: 90px
        }
    }
</style>