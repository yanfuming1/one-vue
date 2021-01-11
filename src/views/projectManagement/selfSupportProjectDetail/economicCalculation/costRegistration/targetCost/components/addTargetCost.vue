<template>
    <d2-container type="fulls" class="addResponsibilityCost">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
            </div>
            <div class="qqt-container-full-center___top">
                <qqt-flow-tabs :procInstId="procInstId">
                    <template slot="content">
                        <project-information-basic :transform="transform" :values="values" @projectCode="getProjectCode" />
                        <el-divider content-position="left">
                        <div class="generate-from-divider___line"></div>
                            目标成本登记
                        </el-divider>
                        <div class="add-responsibility-cost">
                            <el-button size="mini" type="primary" round  v-if="values.procState != '10' " @click="budgetInformationDialog">从预算模块导入</el-button>
                            <el-button size="mini" type="primary" round  v-if="values.procState != '10' " @click="importExcel">从本地导入</el-button>
                            <el-button type="primary" size="mini" round @click="getExportExcel" icon="el-icon-download">导出</el-button>
                        </div>
                        <el-upload
                            v-show="upLoadShow"
                            class="upload-demo"
                            action="http://192.168.2.180/qqtoi/file/upload"
                            ref="upLoadExcel"
                            :limit="1"
                            accept=".xlsx,.xls"
                            :before-upload="beforeUpload"
                            :file-list="fileList">
                        </el-upload>
                        <responsibility-cost-excel ref="responsibility" :tableExcel="values.costProjectList" @updateTotalPrice="updateTotalPrice"></responsibility-cost-excel>
                        <div class="add-responsibility-cost-price">
                            <!-- <span>投标合计 {{ values.totalPrice }}元，大写 {{ totalPriceDaXie }} 元</span>
                            <span>核算合计 {{ values.targetResponsibilityCost }}元，大写 {{ targetResponsibilityCostCapital }} 元</span> -->
                            <span> 该项目的投标价为 {{ values.totalPrice }}元 </span>
                            <span> 经审定，目标成本为 {{ values.targetResponsibilityCost }}元 </span>
                        </div>
                        <bottom-information :values="values" fieldTitle="核算" timeTitle="核算" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation" />
                        <budget-import-information :dialogVisible="dialogVisible" @close="dialogVisible=false" :projectCode="values.projectCode" @getBudgetInformationData="getBudgetInformationData"></budget-import-information>
                    </template>
                </qqt-flow-tabs>
            </div>
            <div class="qqt-container-full-content___button">
               <el-button type="warning" v-if="stutas == 'sendBack' && !transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', sumbitResponsibilityCost ()">重新提交</el-button>
                <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="warning" v-if="procInstId == '' && procState == '' && values.procState != '10'" @click="saveResponsibilityCost">保存</el-button>
                <el-button type="warning" v-if="procInstId == '' && procState == '1' && values.procState != '10' " @click="updateIsShowElement">编辑</el-button>
                <el-button type="primary" v-if="procInstId == '' && procState == '' && values.procState != '10'" @click="sumbitResponsibilityCost">提交</el-button>
                <el-button type="info" size="mini" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                <el-button @click="closePageTag">关闭</el-button>

                <!-- <el-button type="warning" v-if="procState == '' && values.procState != '10' " @click="saveResponsibilityCost('1', procState)">保存</el-button>
                <el-button type="warning" v-if="procState == '1' && values.procState != '10' " @click="updateIsShowElement">编辑</el-button>
                <el-button type="primary" v-if="procState == '' && values.procState != '10'" @click="saveResponsibilityCost('3')">提交</el-button>
                <el-button @click="closePageTag">{{ values.procState == '10' ? '关闭' : '取消'}}</el-button> -->
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisibleFlow" :dialogVisible="dialogVisibleFlow" :processModuleId="processModule" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisibleFlow = false" @selectData="updataAnnouncementChange"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentResponsibilityCost" />
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </d2-container>
</template>

<script>
    import { xlsExcelByLocal, addResponsibilityCost, editResponsibilityCost, submitResponsibilityCost, getResponsibilityCost, xlsExcelByBudget,
        approvBudgetManagerCost, resubmitBudgetManagerCost } from '@/api/selfProject/economicCalculation/costRegistration/responsibilityCost'
    import { getDetails } from '@/api/approval/common'
    import printTemplateByHtml from '../../../../../../systemManagement/printTemplate/components/printTemplateByHtml'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, upload } from '@/components/qqt-subassembly'
    import projectInformationBasic from '../../../../operatingReserve/components/projectInformationBasic'
    import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
    import budgetImportInformation from '../../components/budgetImportInformation'
    import responsibilityCostExcel from '../../components/responsibilityCostExcel'
    import bottomInformation from '../../../../businessBidding/components/bottomInformation'
    import { PROPRIETARYPROJECT } from '@/enum/FORMCODE'
    import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
    import { mapActions, mapState } from 'vuex'
    import ExportJsonExcel from 'js-export-excel';
    import { excelUpLoad } from '@/api/selfProject/budgetControl/budgetInfo/index'
    import util from '@/libs/util.js'
    let than = this
    export default {

        data () {
            return {
                procState: '',
                upLoadShow: false,
                saveBtn: true,
                stutas: '',
                remote: {},
                values: {
                    targetResponsibilityCost: 0,
                    totalPrice: 0,
                    costProjectList: [],
                    costType: '2'
                },
                fileList: [],
                jsonData: {},
                transform: {
                    isShowDetails: true
                },
                reloadInformation: false,
                upLoadFileDefaultList: [],
                targetResponsibilityCostCapital: '零',
                totalPriceDaXie:  '零',
                procInstId: '',
                visible: false,
                isSendBack: false,
                isReject: false,
                isTurnManage: false,
                dialogVisibleFlow: false,
                nodeData: {
                    operation: '',
                    msg: ''
                },
                code: BASICSCODE.COST_TARGET_RESPONSIBILITY2,
                processModule: PROPRIETARYPROJECT.ADDTARGETCOST,
                dialogVisible: false,
                // identification: ''
            }
        },

        methods: {

            ...mapActions('d2admin/page', [
                'close',
            ]),

            // 从本地导入
            importExcel () {
                this.$refs['upLoadExcel'].$refs['upload-inner'].handleClick()
            },
            beforeUpload (file) {
                let MultipartFile = new FormData()
                MultipartFile.append('file', file)
                xlsExcelByLocal(MultipartFile).then(res => {
                    res.forEach( data => {
                        data.totalPrice = data.totalPrice + ''
                        data.unitPrice = data.unitPrice + ''
                    })
                    res.forEach( data => {
                        data['isShowElement'] = true
                    })
                    this.values.costProjectList = res
                    console.log(this.values.costProjectList, '从本地导入')
                })
                return false            
            },
            
            // 从预算模块中导入
            budgetInformationDialog () {
                this.dialogVisible = true
            },
            
            // 导出
            getExportExcel () {
                let exportData = this.$refs.responsibility.getResponsibilityCostExcel ()
                let title = this.$route.meta.title;
                let option = {};
                option.fileName = title + new Date().getTime();
                let sheetFilterData = ['code', 'name', 'feature', 'unit', 'num',
                    'adjustNumber', 'unitPrice', 'adjustUnitPrice', 'totalPrice', 'adjustTotalPrice', 'remark'];
                let sheetHeaderData = ['项目编码', '项目名称', '项目特征', '计量单位', '投标数量',
                    '核算数量', '投标单价（元）', '核算单价（元）', '投标合价（元）', '核算合价（元）', '备注'];
                option.datas = [{
                    sheetData: exportData,
                    sheetName: 'sheet',
                    sheetFilter: sheetFilterData,
                    sheetHeader: sheetHeaderData //中文
                }
                ];
                let toExcel = new ExportJsonExcel(option);
                toExcel.saveExcel();
                this.$message.success('导出成功');
            },

            // submitIncomeRegisteredData () {
            //     let info = this.$refs.bottomInformation.getData ()
            //     this.$refs.generateForm.getData ().then (data => { 
            //         if (data && info) {
            //             Object.assign( this.values, data, info)
            //             console.log(this.selfSupportProject)
            //             this.dialogVisibleFlow = true
            //             this.prossValue = {
            //                 title: this.$route.params.title || `责任成本:【 ${this.selfSupportProject.projectName} 】`,
            //                 pdfId: this.$route.params.procDefId || '',
            //                 degree: this.$route.params.degree || '',
            //                 msg: '',
            //             }
            //         }
            //     })
            // },

            // 保存和提交
            // saveResponsibilityCost (index, procState) {
            //     let data = this.$refs.responsibility.getResponsibilityCostExcel ()
            //     let info = this.$refs.bottomInformation.getData ()
            //     if (data && info) {
            //         data.forEach( pri => {
            //             this.values.targetResponsibilityCost += Number (pri.totalPrice) // targetResponsibilityCost = targetResponsibilityCost +  pri.totalPrice
            //         })
            //         this.values.costProjectList = data
            //         Object.assign(this.values, info)
            //         // console.log(this.values)

            //         let url = ''
            //         // index => 1 保存； index => 3 提交  （判断是否有id； 是否为提交操作）
            //         url = this.values.id ? index == '3' ? submitResponsibilityCost : editResponsibilityCost : addResponsibilityCost
                    
            //         url (this.values).then (res => {
            //             if (res.code === 200) {
            //                 this.$message.success (res.message)
            //                 this.getResponsibilityCostData ()
            //                 this.closePageTag ()
            //             }
            //         })
            //     }
            // },

            saveResponsibilityCost () {
                let data = this.$refs.responsibility.getResponsibilityCostExcel ()
                let info = this.$refs.bottomInformation.getData ()
                if (data && info) {
                    data.forEach( pri => {
                        this.values.targetResponsibilityCost += Number (pri.totalPrice) // targetResponsibilityCost = targetResponsibilityCost +  pri.totalPrice
                    })
                    this.values.costProjectList = data
                    Object.assign(this.values, info)
                    let url = ''
                    url = this.values.id == null ? addResponsibilityCost : editResponsibilityCost
                    
                    url (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success (res.message)
                            this.getResponsibilityCostData ()
                            this.closePageTag ()
                        }
                    })
                }
            },

            sumbitResponsibilityCost () {
                let data = this.$refs.responsibility.getResponsibilityCostExcel ()
                let info = this.$refs.bottomInformation.getData ()
                if (data && info) {
                    if (data && info) {
                        data.forEach( pri => {
                            this.values.targetResponsibilityCost += Number (pri.totalPrice) // targetResponsibilityCost = targetResponsibilityCost +  pri.totalPrice
                        })
                        this.values.costProjectList = data
                        Object.assign( this.values, data, info)
                        this.dialogVisibleFlow = true
                        this.prossValue = {
                            title: this.$route.params.title || `目标成本:【 ${this.selfSupportProject.projectName} 】`,
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.params.degree || '',
                            msg: '',
                        }
                    }
                }
            },

            updataAnnouncementChange (item, boolean) {
                let url = ''
                this.dialogVisibleFlow = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                boolean ? url = resubmitBudgetManagerCost : url = submitResponsibilityCost
                url (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        boolean ? this.closePageTag () : this.getResponsibilityCostData ()
                    }
                })
            },

            consentResponsibilityCost (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closePageTag ()
                    return
                }
                if (item) {
                    this.values['completeTask'] = item
                    this.transform.isShowDetails = true
                    approvBudgetManagerCost (this.values).then (res => {
                        if (res.code === 200) {
                            this.closePageTag ()
                            this.getResponsibilityCostData ()
                        }
                    })
                }
            },

            // 返回操作
            closePageTag () {
                this.$router.go(-1)
            },

            // 附件
            fileDefaultNeaten (res) {
                this.upLoadFileDefaultList = []
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

            // 初始化时获取详情，判断是责任成本还是目标成本（1责任成本，2目标成本）
            getResponsibilityCostData () {
                getResponsibilityCost({
                    'projectCode': this.values['projectCode'],
                    'costType': this.values.costType

                }).then( res => {
                    if( res.id ) {
                        this.fileDefaultNeaten (res)
                        res.costProjectList.forEach( data => {
                            data.unitPrice = data.unitPrice + ''
                            data.totalPrice = data.totalPrice + ''
                            data.adjustUnitPrice = data.adjustUnitPrice + ''
                            data.adjustTotalPrice = data.adjustTotalPrice + ''
                            data['isShowElement'] = false
                        })
                        this.procInstId = res.procInstId || ''
                        this.values = Object.assign(this.values, res)
                        this.procState = this.values.procState
                        this.targetResponsibilityCostCapital = util.convertCurrency (this.values.targetResponsibilityCost)
                        if (res.procState == '4') {
                            this.updateIsShowElement () 
                        } else {
                            this.transform = { isShowDetails: true }
                        }
                    } else {
                        this.values.procState = ''
                        this.procState = ''
                    }
                    // this.reloadInformation = true
                })
            },

            getProjectCode (projectCode, projectId,projectName) {
                this.values['projectCode'] = projectCode
                this.values['projectName'] = projectName
                this.getResponsibilityCostData ()
            },

            // 编辑
            updateIsShowElement () {
                this.transform.isShowDetails = false
                this.$nextTick (() => {
                    this.$refs.responsibility.updateIsShowElement (true)
                })
                this.procState = ''
            },

            // 实时计算的核算总价
            updateTotalPrice (val1, val2) {
                // console.log(val1, '实时计算的核算总价', val2, '实时计算的投标总价')
                this.values.totalPrice = val1
                this.totalPriceDaXie = util.convertCurrency (val1)
                
                this.values.targetResponsibilityCost = val2
                this.targetResponsibilityCostCapital = util.convertCurrency (val2)
            },

            // 从预算中导入
            getBudgetInformationData (item) {
                if (item.length != 1) {
                    this.$message.warning('请选择一条数据') 
                    return
                } 
                xlsExcelByBudget({
                    'budgetId': item[0].id
                }).then( res => {
                    res.forEach( data => {
                        data.totalPrice = data.totalPrice + ''
                        data.unitPrice = data.unitPrice + ''
                    })
                    this.values.costProjectList = res
                    // console.log(res, '从预算导入中的res')
                    if(res.slice(-1)[0].code == null) {
                        this.values.targetResponsibilityCost = res.slice(-1)[0].totalPrice
                        this.targetResponsibilityCostCapital = util.convertCurrency (this.values.targetResponsibilityCost) 
                        delete this.values.costProjectList.pop()
                    }
                    this.dialogVisible = false
                })
            },

            printTemplate () {
                getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.values.id}).then(res => {
                    if (res) this.$refs.printTemp.printTemplate (res)
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
            },

            getDetailsList (taskId) {
                getDetails (taskId).then (res => { if (res) this.nodeData = res })
            }

        },

        created () {
            this.updataRouter ()
            //  this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad')
            // this.values.costType = this.identification = this.$route.params.identification
        },

        mounted () {
            than = this
        },

        components: {
            'project-information-basic': projectInformationBasic,
            'print-template-by-html': printTemplateByHtml,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-send-process': qqtSendProcess,
            'qqt-consent': qqtConsent,
            'up-load': upload,
            'responsibility-cost-excel': responsibilityCostExcel,
            'bottom-information': bottomInformation,
            'budget-import-information': budgetImportInformation
        },
        
        computed: {
            ...mapState ('d2admin/selfSupportProject', [
                'selfSupportProject'
            ])
        },
        
        // 在路由里面监听到才会去执行的，需求在页面加载的时候需要 “页面标识” 和 “项目code”
        watch: {
            // selfSupportProject () {
            //     this.getResponsibilityCostData ()
            // }
            // $route (val) {
            //     if(val.path.indexOf('responsibilityCost') != -1){
            //         this.reloadInformation = false
            //         const { projectCode } = this.values
            //         Object.assign (this.values, {})
            //         this.values = {
            //             targetResponsibilityCost: 0,
            //             totalPrice: 0,
            //             costProjectList: [],
            //             costType: '',
            //             projectCode
            //         },
            //         this.identification = val.params.identification
            //         this.values.costProjectList = [
            //             {
            //                 numberOrder: '',
            //                 code: '',
            //                 name: '',
            //                 feature: '',
            //                 unit: '',
            //                 num: '',
            //                 adjustNumber: '',
            //                 unitPrice: '',
            //                 adjustUnitPrice: '',
            //                 totalPrice: '',
            //                 adjustTotalPrice: '',
            //                 remark: '',
            //                 isShowElement: true
            //             }
            //         ]
            //         this.getResponsibilityCostData ()
            //     }
            // }
        }
    }
</script>

<style lang='scss'>
    .addResponsibilityCost {
        .files-upload___right {
            margin-left: 120px
        }
        .add-responsibility-cost {
            float: right;
            top: -40px;
            background: #fff;
            width: 320px;
            position: relative;
            text-align: right;
        }
        .add-responsibility-cost-price {
            width: 100%;
            height: 46px;
            margin: 22px;
            background: $color-project-revenue-information-bg;
            span {
                font-size: 14px;
                line-height: 46px;
                margin-left: 32px;
                color: $color-top-text-title;
                font-weight: 600;
            }
        }
        
    }
</style>
