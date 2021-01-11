<template>
    <d2-container type="fulls">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closeTag"><i class="el-icon-close"></i></el-button>
            </div>

            <div class="qqt-container-full-center___top">
                <qqt-flow-tabs :procInstId="procInstId">
                <template slot="content">
                    <fm-generate-form :data="jsonData" :remote="remoteFuncs" :remoteOption="remoteOption" :value="values" :transform="transform" @on-change="changeValue" @btn-click="btnClick" ref="generateForm" />

                    <el-divider content-position="left">
                        <div class="generate-from-divider___line"></div>
                        期末盘点材料明细
                    </el-divider>
                    <div class="final-inventory-info-button">
                        <el-button size="mini" round @click="getPopoutMaterial">从仓库导入</el-button>
                    </div>
                    <div class="final-inventory-info">
                        <qqt-relate-table :data="values.materialList" :replaceRules="rules" ref="materials" :isShowAdd="false" :isDefaultShowRow="false" :rowHeader="materialsHeader" :isShowDetails="transform.isShowDetails" />
                    </div>
                    <bottomInformation :values="values" :fieldTitle="fieldTitle" :timeTitle="timeTitle" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation"></bottomInformation>
                </template>
                </qqt-flow-tabs>
            </div>

             <div class="operation-button">
                <el-button size="mini" type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveScrapRecord">保存</el-button>
                <el-button size="mini" type="primary" v-if="!transform.isShowDetails && procInstId === '' && $has ('material:warehouse:check:submit')" @click="submissionScrapRecord">提交</el-button>
                <el-button size="mini" @click="closeTag">关闭</el-button>
            </div>
        </el-card>
        <popout-material-depot v-if="popoutMaterial" :dialogVisible="popoutMaterial" :warehouseId="values.warehouseId" @close="getMaterialData" />
        <popout-entreport v-if="dialogVisible" :dialogVisible="dialogVisible" @close="getPopoutEntreport" :isEntrepot="true" />
        <user-modules :showDialog="isShowAdminDialog" ref="userModules" title="选择盘点人员" :isShowRole="false" @clearUserPage="getAdmin" @closeFun="isShowAdminDialog = false"/>
    </d2-container>
</template>

<script>
    import { formGetJson } from '../../../../../api/system/fromManagement/index'
    import { getUserDepartById } from '../../../../../api/system/depart/depart'
    import { queryDicById } from '../../../../../api/jointProject/index'
    import { addFinalInventory, submitFinalInventory, editFinalInventory, queryByIdFinalInventory } from '../../../../../api/materialEquipmentManagement/warehouseManagement/finalInventory'
    import { MATERIALEQUIPMENTMANAGEMENT } from '../../../../../enum/FORMCODE'
    import { mapActions } from 'vuex'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, qqtRelateTable, upload } from '../../../../../components/qqt-subassembly'
    import { getDetails } from '../../../../../api/approval/common'
    
    import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
    import popoutMaterialDepot from '../../../basicInformation/materialDepot/components/popoutMaterialDepot'
    import userModules from '../../../../systemManagement/processDefinition/processModules/userModules'
    import popoutEntreport from '../../../basicInformation/entrepot/components/popoutEntreport'
    import util from '@/libs/util.js'
    export default {
        
        data() {
            let that = this
            return {
                values:{
                    category: "",
                    categoryId: "",
                    materialList: [],
                    warehouseName: '',
                    warehouseSite:'' ,
                    checkCrew: ''
                },
                fieldTitle: '盘点',
                timeTitle: '盘点',
                dialogVisible: false,
                rules: {
                    'number1': [
                        { required: true, message: '期末盘点数量不能为空', trigger: 'change' }
                    ]
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
                        prop: 'number1',
                        label: '库存数量',
                        isShow: true,
                        type: 'text',
                        isShowDetails: true
                    },
                    {
                        prop: 'number2',
                        label: '盘点数量',
                        isShow: true,
                        type: 'text',
                        required: true,
                        isNonnegativeNumber: true
                    },
                    {
                        prop: 'string1',
                        label: '差额',
                        isShow: true,
                        type: 'total',
                        isMoneyType: true,
                        controlRow: 'number1 - number2',
                        isShowDetails: true
                    },
                    {
                        prop: 'remark',
                        label: '备注',
                        isShow: true,
                        type: 'text'
                    }
                ],

                page: {
                    current: 1,
                    size: 10,
                    total: 0
                },
                
                popoutMaterial: false,

                transform: {
                    isShowDetails: false
                },
                
                jsonData: {},
                remoteFuncs: {
                    getCategory (resolve) {
                        resolve(that.categoryArr) 
                    },
                    getDepartmentName (resolve) {
                        resolve(that.departmentNameArr) 
                    },
                },
                remoteOption: {
                    checkResultOptions: [
                        {
                            value: '1',
                            label: '库存数量与盘点数量一致'
                        },
                        {
                            value: '2',
                            label: '库存数量与盘点数量不一致'
                        }
                    ],
                },
                categoryArr: [],
                departmentNameArr: [],

                // 添加行
                finalInventoryTabsData: [],
                isTabsShowDetails: false,
                isShowAdminDialog: false,

                defaultFinalInventoryl: {
                    value: 'value',
                    label: 'label'
                },

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
                formGetJson ({'code': MATERIALEQUIPMENTMANAGEMENT.FINALINVENTORYINFO}).then(res => {
                    if (res) {
                        this.jsonData = JSON.parse(res)
                    }
                })
            },

            // 存放仓库
            btnClick (value, field) {
                field == 'warehouseName' ? this.dialogVisible = true : this.dialogVisible = false
                field == 'checkCrew' ? this.isShowAdminDialog = true : this.isShowAdminDialog = false
            },
            getPopoutEntreport (item) {
                this.dialogVisible = false
                if (item) {
                    this.values['warehouseId'] = item.id
                    this.values.warehouseName = item.name
                    this.values.warehouseSite = item.address + item.detailedAddress
                }
            },
            updataRouter () {
                if (this.$route.params && this.$route.params.relevancyId) {
                    this.getQueryByIdFinalInventory (this.$route.params.relevancyId)
                }
            },

            getQueryByIdFinalInventory (id) {
                queryByIdFinalInventory({
                    id: id
                }).then( res => {
                    if(res) {
                        res.materialList.forEach (f => {
                            f.number1 = f.number1 + '', f.number2 = f.number2 + '' 
                        })
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

            // 通过调用字典项去查询盘点类型
            getqueryDicById () {
                queryDicById ({id: '1214005368061132800'}).then(res =>{
                    if (res && res.length > 0) {
                        this.categoryArr = res
                    }
                }).finally(res => {
                    this.getFormByJson()
                })
            },

            // getresignationQueryPersonalDataID () {
            //     getUserDepartById({ 
            //         userId: util.cookies.get ('uuid')
            //     }).then( res => {
            //         this.departmentNameArr = res
            //         this.values.createBy = util.cookies.get ('uuid')
            //         this.values.createName = (util.cookies.get ('username'))
            //     })
            // },


            getMaterialData (item) {
                this.popoutMaterial = false
                if (item) {
                    item.forEach (res => {
                        res.number1 = res.quantity + ''
                    })
                    this.values.materialList = item
                }
            },

            changeValue(id, value, model){
                this.values[id] = value;
                switch(id){
                    case 'departmentName': 
                        this.departmentNameArr.forEach(item => {
                            if(item.id === value){
                                this.values.departmentId = item.id ? item.id : " "
                                this.values.departmentName = item.name ? item.name : " "
                            }
                        })
                        break
                    case 'category': 
                        this.categoryArr.forEach(item => {
                            if(item.id === value){
                                this.values.categoryId = item.id ? item.id : " "
                                this.values.category = item.name ? item.name : " "
                            }
                        })
                        break
                    default:
                        break
                }
            },

            upLoadFileCallBack (item) {
                this.values.fileList = item
            },

            // 保存
            saveScrapRecord () {
                let url = '', boolean = {}, element = {}
                boolean = this.$refs.materials.verify ()
                element = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && boolean && element) {
                        Object.assign (this.values, data, element)
                        this.values['materialList'] = boolean
                        this.values['materialList'].forEach( m => {
                            m.materialId = m.id
                        })
                        this.values.id == null ? url = addFinalInventory : url = editFinalInventory
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
                let boolean = {}, element = {}
                boolean = this.$refs.materials.verify ()
                element = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && boolean && element) {
                        Object.assign (this.values, data, element)
                        this.values['materialList'] = boolean
                        this.values['materialList'].forEach( m => {
                            m.materialId = m.id
                        })
                        submitFinalInventory(this.values).then( res => {
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

            getAdmin (list) {
                let id = '',  str = '', userList = []
                userList = this.$refs.userModules.getSelectUser ()
                if (userList.length == 0) {
                    this.$message.warning ('至少选择一条数据')
                    return
                }
                userList.forEach (data => {
                    data.item.forEach (res => {
                        if (res.isCheck) id += res.id + ',', str += res.name + `( ${data.name} )` + ','
                    })
                })
            
                this.isShowAdminDialog = false
                this.values['checkCrewId'] = id.substring (0, id.length - 1)
                this.values['checkCrew'] = str.substring (0, str.length - 1)
            },

            getPopoutMaterial () {
                this.values.warehouseId ? this.popoutMaterial = true : this.$message.warning ('请选择仓库名称')
            },

            closeTag () {
                let tagName = this.$route.path
                let path = '/materialEquipmentManagement/warehouseManagement/finalInventory'
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
            // this.getresignationQueryPersonalDataID ()
            this.getqueryDicById()
            this.updataRouter ()
            this.transform = this.$route.params.transform
        },

        components: {
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent,
            'qqt-relate-table': qqtRelateTable,
            'user-modules': userModules,
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
    .final-inventory-info-button {
        float: right;
        top: -40px;
        background: #fff;
        width: 100px;
        position: relative;
        text-align: right;
    }
</style>