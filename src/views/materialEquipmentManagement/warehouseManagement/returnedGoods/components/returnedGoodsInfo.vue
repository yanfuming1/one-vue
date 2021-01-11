<template>
    <d2-container type="fulls">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closeTag"><i class="el-icon-close"></i></el-button>
            </div>

            <div class="returned-goods-info">
                <qqt-flow-tabs :procInstId="procInstId">
                <template slot="content"> 
                    <fm-generate-form :data="jsonData" :remote="remoteFuncs" :value="values" :transform="transform" ref="generateForm"/>
                    <returned-goods-info-from 
                        ref="entreport"
                        :returnedGoods="values"
                        @moduleId="moduleId = $event"
                        @warehouse="dialogVisibles = true"
                        @warehouseId="getWarehouseId"
                        @category="values.category = $event, isShowMaterialsHeader ()"
                        @storageStatus="values.materialList = [], $event == '1' ? orderLine = true : orderLine = false"
                        :isShowElement="!transform.isShowDetails" />
                    <div v-if="orderLine">
                        <el-divider content-position="left">
                        <div class="generate-from-divider___line"></div>
                            退换货材料明细
                        </el-divider>
                        <div class="returned-goods-info-button" v-if="!transform.isShowDetails">
                            <el-button size="mini" round @click="popoutMaterialBtn">从采购订单导入</el-button>
                        </div>
                        <div class="final-inventory-info">
                            <qqt-relate-table :data="values.materialList" :replaceRules="rules" ref="materials" :isShowAdd="false" :isDefaultShowRow="false" :rowHeader="materialsHeader" :isShowDetails="transform.isShowDetails" />
                        </div>
                    </div>

                    <div v-else>
                        <el-divider content-position="left">
                        <div class="generate-from-divider___line"></div>
                            退换货材料明细
                        </el-divider>
                        <div class="returned-goods-info-button" v-if="!transform.isShowDetails">
                            <el-button size="mini" round @click="warehouseOrderBtn">从入库单导入</el-button>
                        </div>
                        <div class="final-inventory-info">
                            <qqt-relate-table :data="values.materialList" :replaceRules="rules" ref="materials" :isShowAdd="false" :isDefaultShowRow="false" :rowHeader="materialsHeaders" :isShowDetails="transform.isShowDetails" />
                        </div>
                    </div>
                    <bottomInformation :values="values" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation"></bottomInformation>
                </template>
                </qqt-flow-tabs>
            </div>

             <div class="operation-button">
                <el-button size="mini" type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submissionScrapRecord (true)">重新提交</el-button>
                <el-button size="mini" type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button size="mini" type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button size="mini" type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button size="mini" type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button size="mini" type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveReturnedGoods">保存</el-button>
                <el-button size="mini" type="primary" v-if="!transform.isShowDetails && procInstId === '' && $has ('material:warehouse:alteration:submit')" @click="values['flag'] = '1', submissionScrapRecord (false)">提交</el-button>
                <el-button size="mini" @click="closeTag">关闭</el-button>
            </div>
        </el-card>

        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataReturnedGoods"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentReturnedGoods" />
        <popout-material-depot v-if="popoutMaterial" :dialogVisible="popoutMaterial" :moduleId="moduleId" :warehouseId="values.warehouseId" :isOther="isOther" @close="getMaterialData" />
        <popout-entreport v-if="dialogVisibles" :dialogVisible="dialogVisibles" :isEntrepot="true" @close="getPopoutEntreport" />

    </d2-container>
</template>

<script>
    import { formGetJson } from '../../../../../api/system/fromManagement/index'
    import { MATERIALEQUIPMENTMANAGEMENT } from '../../../../../enum/FORMCODE'
    import { mapActions } from 'vuex'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, qqtRelateTable, upload } from '../../../../../components/qqt-subassembly'
    
    import { selectPurchaseOrder, materialType, addReturnedGoods, editReturnedGoods, submitReturnedGoods, queryByIdReturnedGoods, resubmitReturnedGoods, operationReturnedGoods } from '../../../../../api/materialEquipmentManagement/warehouseManagement/returnedGoods'
    import { getDetails } from '../../../../../api/approval/common'

    import returnedGoodsInfoFrom from './returnedGoodsInfoFrom'
    import popoutMaterialDepot from '../../../basicInformation/materialDepot/components/popoutMaterialDepot'
    import popoutEntreport from '../../../basicInformation/entrepot/components/popoutEntreport'
    import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
    import util from '@/libs/util.js'
    export default {
        
        data() {
            let that = this
            return {
                values:{
                    materialList: [],
                    category: '5'
                },
                isOther: false,
                jsonData: {},
                remoteFuncs: {},
                moduleId: '',
                orderLine: false,
                dialogVisible: false,
                dialogVisibles: false,
                popoutMaterial: false,

                transform: {
                    isShowDetails: false
                },
                
                materialsHeader: [],

                materialsHeaders: [],
                
                rules: {
                    'number3': [
                        { required: true, message: '退换货数量不能为空', trigger: 'change' }
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
                processModuleId: MATERIALEQUIPMENTMANAGEMENT.RETURNEDGOODSINFO,
                dialogVisible: false,
                visible: false,
                isReject: false,
                isSendBack: false,
                isTurnManage: false,
            };
        },
        methods: {
            getFormByJson () {
                formGetJson ({'code': MATERIALEQUIPMENTMANAGEMENT.RETURNEDGOODSINFO}).then(res => {
                    if (res) {
                        this.jsonData = JSON.parse(res)
                    }
                })
            },

            // 类型
            getMaterialType () {
                materialType().then( res => {
                    this.materialsTypeArr = res
                }).finally(res => {
                    this.getFormByJson()
                })
            },

            getPopoutEntreport (item) {
                this.dialogVisibles = false
                if (item) this.values['warehouseId'] = item.id, this.$refs.entreport.setWarehouseData (item)
            },
            
            //  仓库所在地
            warehouseOrderBtn () {
                if (this.values.warehouseId) {
                    this.popoutMaterial = true
                } else {
                    this.$message.warning('请选择仓库所在地')
                }
            },

            popoutMaterialBtn () {
                this.$refs.entreport.getSourceId () ? this.popoutMaterial = true : this.$message.warning ('请选择采购订单')
            },

            getMaterialData (item) {
                this.popoutMaterial = false
                if (item) {
                    this.values.materialList = item
                    this.values.materialList.forEach (m => {
                        m.remark = ''
                        m['consumablesName'] = m.consumables == '1' ? '是' : '否'
                        m.number1 = m.number1 ? m.number1 + '' : '' // 库存数量
                        m.number2 = m.number2 ? m.number2 + '' : '' // 锁定库存
                        m.money1 = m.price ? m.price + '' : ''
                        m.number3 = m.number3 ? m.number3 + '' : ''
                    })
                }
            },

            upLoadFileCallBack (item) {
                this.values.fileList = item
            },

            // 保存
            saveReturnedGoods () {
                let url = '', boolean = [], item = {}, num = 0, element = {}
                item = this.$refs.entreport.verify ()
                boolean = this.$refs.materials.verify ()
                element = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && boolean && item && element) {
                        Object.assign (this.values, item, data, element)
                        boolean.forEach (res => { num += Number.parseFloat (res.money2) })
                        this.values['amount'] = num
                        this.values['materialList'] = boolean
                        this.values['freight'] = Number (item.freight)
                        this.values.id == null ? url = addReturnedGoods : url = editReturnedGoods
                        url (this.values).then (res => {
                            if (res.code === 200) {
                                this.$message.success ('保存成功')
                                this.closeTag ()
                            }
                        })
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
                if (this.$route.params && this.$route.params.relevancyId && !this.$route.params.isOrder) {
                    this.getReturnedGoodsInfoById (this.$route.params.relevancyId)
                }
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
                    operationReturnedGoods (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success (res.message)
                            this.closeTag ()
                        }
                    })
                }
            },
            
            updataReturnedGoods (item, boolean) {
                let url = ''
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                boolean ? url = resubmitReturnedGoods : url = submitReturnedGoods
                url (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closeTag ()
                    }
                })
            },

            getReturnedGoodsInfoById (id) {
                queryByIdReturnedGoods({
                    id: id
                }).then( res => {
                    if(res) {
                        res.materialList.forEach (m => {
                            m.number3 ? m.number3 = m.number3 + '' : '', m.money1 ? m.money1 = m.money1 + '' : '', m.money2 ? m.money2 = m.money2 + '' : '',
                            m['consumablesName'] = m.consumables == '1' ? '是' : '否'
                        })
                        res.freight = res.freight + '', res['amountString'] = res.amount + '', res['money'] = res.money + ''
                        this.values = res, this.values.storageStatus == '1' ? this.orderLine = true : this.orderLine = false
                        this.moduleId = res.sourceId
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
            // 提交
            submissionScrapRecord () {
                let num = 0, list = [], item = {}, element = {}
                item = this.$refs.entreport.verify ()
                list = this.$refs.materials.verify ()
                element = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && list && item && element) {
                        Object.assign (this.values, item, data, element)
                        list.forEach (res => { num += Number.parseFloat (res.money2) })
                        this.values['amount'] = num
                        this.values['materialList'] = list
                        this.values['freight'] = Number (item.freight)
                        this.dialogVisible = true
                        this.prossValue = {
                            title: this.$route.params.title || `退还货单:【 ${this.values.name} 】`,
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.params.degree || '',
                            msg: '',
                        }
                    }
                })
            },

            closeTag () {
                let tagName = this.$route.path
                let path = '/materialEquipmentManagement/warehouseManagement/returnedGoods'
                this.close ({ tagName, path })
            },

            ...mapActions('d2admin/page', [
                'close' 
            ]),

            changeDataEvent (data, prop, value) {
                this.$emit ('changeDataEvent', data, prop, value)
            },

            getWarehouseId (val) {
                this.values['warehouseId'] = val
            },

            isShowMaterialsHeader () {
                this.materialsHeader = [
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
                        isShow: true,
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
                    {
                        prop: 'number3',
                        label: this.values.category == '5' ? '换货数量' : '退货数量',
                        isShow: true,
                        type: 'text',
                        required: true,
                        isNonnegativeNumber: true
                    },
                    {
                        prop: 'supplierName',
                        label: '供应商',
                        isShow: true,
                        type: 'text',
                        isShowDetails: true
                    },
                    {
                        prop: 'money1',
                        label: '单价（元）',
                        isShow: true,
                        type: 'text',
                        isShowDetails: true
                    },
                    {
                        prop: 'money2',
                        label: '总价（元）',
                        isShow: true,
                        type: 'total',
                        isMoneyType: true,
                        controlRow: 'number3 * money1',
                        isShowDetails: true
                    },
                    {
                        prop: 'consumablesName',
                        label: '是否消耗品',
                        isShow: true,
                        type: 'text',
                        isShowDetails: true
                    },
                    {
                        prop: 'remark',
                        label: '备注',
                        isShow: true,
                        type: 'text',
                        isShowDetails: true
                    }
                ],

                this.materialsHeaders = [
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
                    {
                        prop: 'number3',
                        label: this.values.category == '5' ? '换货数量' : '退货数量',
                        isShow: true,
                        type: 'text',
                        required: true,
                        isNonnegativeNumber: true
                    },
                    {
                        prop: 'supplierName',
                        label: '供应商',
                        isShow: true,
                        type: 'text',
                        isShowDetails: true
                    },
                    {
                        prop: 'money1',
                        label: '单价（元）',
                        isShow: true,
                        type: 'text',
                        isShowDetails: true
                    },
                    {
                        prop: 'money2',
                        label: '总价（元）',
                        isShow: true,
                        type: 'total',
                        isMoneyType: true,
                        controlRow: 'number3 * money1',
                        isShowDetails: true
                    },
                    {
                        prop: 'remark',
                        label: '备注',
                        isShow: true,
                        type: 'text'
                    }
                ]
            }
        },

        created() {

            this.updataRouter ()

            this.getMaterialType ()

            this.isShowMaterialsHeader ()

            this.transform = this.$route.params.transform
        },

        components: {
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent,
            'qqt-relate-table': qqtRelateTable,
            'popout-entreport': popoutEntreport,
            'bottomInformation': bottomInformation,
            'popout-material-depot': popoutMaterialDepot,
            'returned-goods-info-from': returnedGoodsInfoFrom,
        },
    };
</script>

<style lang='scss' scoped>
    .operation-button{
        margin: 0 auto;
        text-align: center;
        margin-top: 12px
    }
    .returned-goods-info-button {
        float: right;
        top: -40px;
        background: #fff;
        width: 125px;
        position: relative;
        text-align: right;
    }
</style>