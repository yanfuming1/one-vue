<template>
    <d2-container type="fulls">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closeTag"><i class="el-icon-close"></i></el-button>
            </div>

            <div class="qqt-container-full-center___top">
                <qqt-flow-tabs :procInstId="procInstId">
                <template slot="content"> 
                    <fm-generate-form :data="jsonData" :remote="remoteFuncs" :value="values" :transform="transform" ref="generateForm" @btn-click="btnClick" @on-change="changeValue"/>

                    <el-divider content-position="left">
                        <div class="generate-from-divider___line"></div>
                        其它入库材料明细
                    </el-divider>
                    <div class="other-warehouses-button">
                        <el-button size="mini" round @click="popoutMaterial = true">从材料库导入</el-button>
                        <el-button size="mini" round @click="popoutMaterial = true">导出</el-button>
                    </div>
                    <div class="other-warehouses-info">
                        <qqt-relate-table :data="values.materialList" :replaceRules="rules" ref="materials" @blur="updataMaterialList" :isShowAdd="false" :isDefaultShowRow="false" :rowHeader="materialsHeader" :isShowDetails="transform.isShowDetails" />
                    </div>

                    <div class="other-warehouses-info___upload">
                        <div class="other-warehouses-info___label">上传附件:</div>
                        <div class="other-warehouses-info___right">
                            <up-load id="male" @upLoadFileCallBack="upLoadFileCallBack" :isShowUpload="!transform.isShowDetails" :propList="upLoadFileDefaultList" ref="upLoad" />
                        </div>
                    </div>
                </template>
                </qqt-flow-tabs>
            </div>

             <div class="operation-button">
                <el-button size="mini" type="primary" v-if="!transform.isShowDetails && procInstId === ''" @click="submissionotherWarehouses">提交</el-button>
                <el-button size="mini" @click="closeTag">关闭</el-button>
            </div>
        </el-card>
        <popout-material-depot v-if="popoutMaterial" :dialogVisible="popoutMaterial" @close="getMaterialData" />
        <popout-entreport v-if="dialogVisible" :dialogVisible="dialogVisible" @close="getPopoutEntreport" :isEntrepot="true"/>
    </d2-container>
</template>

<script>
    import { formGetJson } from '../../../../../api/system/fromManagement/index'
    import { MATERIALEQUIPMENTMANAGEMENT } from '../../../../../enum/FORMCODE'
    import { mapActions } from 'vuex'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, qqtRelateTable, upload } from '../../../../../components/qqt-subassembly'
    import { getDetails } from '../../../../../api/approval/common'
    import { storageTypeOtherWarehouses, sumbitOtherWarehouses, queryByIdOtherWarehouses } from '../../../../../api/materialEquipmentManagement/warehouseManagement/otherWarehouses'
    import { getUserDepartById } from '../../../../../api/system/depart/depart'
    import util from '@/libs/util.js'

    import popoutEntreport from '../../../basicInformation/entrepot/components/popoutEntreport'
    import popoutMaterialDepot from '../../../basicInformation/materialDepot/components/popoutMaterialDepot'
    export default {
        
        data() {
            let that = this
            return {
                 options: [{
                    id: '1',
                    name: '领用-归还'
                    }, {
                    id: '2',
                    name: '出租-归还'
                    }, {
                    id: '3',
                    name: '其他'
                }],
                sourceWarehousingData: {
                    sourceWarehousing:'',
                    oddNumbers:'',
                    name:''

                },
                values:{
                    createName: "",
                    departmentId: "",
                    departmentName:"",
                    materialList: [],
                    category: "",
                    categoryId: "",
                    warehouseId: '',
                    warehouseName: '',
                    warehouseSite: ''
                },
                jsonData: {},
                remoteFuncs: {
                    getCategory (resolve) {
                        resolve ([
                            {
                                id: '1',
                                name: '采购入库'
                            },
                            {
                                id: '2',
                                name: '领用归还'
                            },
                            {
                                id: '3',
                                name: '出租归还'
                            },
                            {
                                id: '4',
                                name: '换货入库'
                            },
                            {
                                id: '5',
                                name: '其它'
                            }
                        ])
                    },
                    getDepartmentName (resolve) {
                        resolve(that.departmentNameArr) 
                    },
                },

                departmentNameArr: [],

                transform: {
                    isShowDetails: false
                },

                popoutMaterial: false,
                dialogVisible: false,

                rules: {
                    'number3': [
                        { required: true, message: '入库数量不能为空', trigger: 'change' }
                    ],
                    'money1': [
                        { required: true, message: '入库单价不能为空', trigger: 'change' }
                    ],
                    
                },
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
                    {
                        prop: 'number3',
                        label: '数量',
                        isShow: true,
                        type: 'text',
                        required: true,
                        isNonnegativeNumber: true
                    },
                    {
                        prop: 'money1',
                        label: '单价（元）',
                        isShow: true,
                        type: 'text',
                        required: true,
                    },
                    {
                        prop: 'money2',
                        label: '总价（元）',
                        isShow: true,
                        type: 'text',
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

                upLoadFileDefaultList: [],
                
                // 流程
                stutas:'',
                procInstId: '',
                nodeData: {
                    operation: '',
                    msg:''
                },
            };
        },
        methods: {
            getFormByJson () {
                formGetJson ({'code': MATERIALEQUIPMENTMANAGEMENT.OTHERWAREHOUSESINFO}).then(res => {
                    if (res) {
                        this.jsonData = JSON.parse(res)
                    }
                })
            },

            upLoadFileCallBack (item) {
                this.values.fileList = item
            },

            // 经办人
            getresignationQueryPersonalDataID () {
                getUserDepartById({ 
                    userId: util.cookies.get ('uuid')
                }).then( res => {
                    this.departmentNameArr = res
                    this.values.createBy = util.cookies.get ('uuid')
                    this.values.createName = (util.cookies.get ('username'))
                })
            },

            changeValue (id, value, model) {
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
                        case 'category': 
                            let category = value
                            storageTypeOtherWarehouses({
                                category: category
                            }).then( res => {
                            })
                        break
                }
            },

            updataMaterialList (data, prop, value) {
                switch (prop) {
                    case 'money2':
                }
            },

            // 存放仓库
            btnClick (value, field) {
                field == 'warehouseName' ? this.dialogVisible = true : this.dialogVisible = false
            },
            getPopoutEntreport (item) {
                this.dialogVisible = false
                if (item) {
                    this.values['warehouseId'] = item.id
                    this.values.warehouseName = item.name
                    this.values.warehouseSite = item.address + item.detailedAddress
                }
            },
            
            getMaterialData (item) {
                this.popoutMaterial = false
                if (item) {
                     item.forEach (res => {
                        res['consumables'] = res.consumables == '1' ? '是' : '否'
                    })
                    this.values.materialList = item
                }
            },

            updataRouter () {
                if (this.$route.params && this.$route.params.relevancyId) {
                    this.getQueryByIdOtherWarehouses (this.$route.params.relevancyId)
                }
            },

            getQueryByIdOtherWarehouses (id) {
                queryByIdOtherWarehouses({
                    id: id
                }).then( res => {
                    if(res) {
                        res.materialList.forEach (f => { f.number3 = f.number3.toString () })
                        res.materialList.forEach (f => { f.money1 = f.money1.toString () })
                        res.materialList.forEach (f => { f.money2 = f.money2.toString () })


                        this.values = res
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
            submissionotherWarehouses () {
                let boolean = {}
                boolean = this.$refs.materials.verify ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && boolean) {
                        Object.assign (this.values, data)
                        this.values['materialList'] = boolean
                        this.values['materialList'].forEach( m => {
                            let zj = Number(m.money1) * Number(m.number3)
                            this.values.amount = m.money2 = zj.toString()
                            m.materialId = m.brandId = m.id
                            m.consumables === '否' ? '0' : '1'
                        })
                        
                        sumbitOtherWarehouses(this.values).then( res => {
                            if (res.code === 200) {
                                this.$message.success ('提交成功')
                                this.closeTag ()
                            }
                        }).catch( err => {
                            console.log(err)
                        })
                    }
                })
            },

            closeTag () {
                let tagName = this.$route.path
                let path = '/materialEquipmentManagement/warehouseManagement/outboundOrder'
                this.close ({ tagName, path })
            },
            ...mapActions('d2admin/page', [
                'close' 
            ]),

            changeDataEvent (data, prop, value) {
                this.$emit ('changeDataEvent', data, prop, value)
            },
        },

        created() {
            this.getresignationQueryPersonalDataID ()

            this.getFormByJson()

            this.updataRouter ()

        },
        components: {
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent,
            'qqt-relate-table': qqtRelateTable,
            'up-load': upload,
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
    .other-warehouses-button {
        float: right;
        top: -40px;
        background: #fff;
        width: 188px;
        position: relative;
        text-align: right;
    }
    .other-warehouses-info___upload {
        padding: 0 30px;
        .other-warehouses-info___label {
            font-size: 14px;
            float: left;
            margin-left: 16px;
            color: $input-disable
        }
        .other-warehouses-info___right {
            margin-left: 90px
        }
    }
</style>