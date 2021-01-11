<template>
    <d2-container type="fulls" class="ticketReceipt_registration_list">
        <template slot="header">
            <determine-project v-if="identification == '2'" title='销项发票' :proId="this.projectData.projectId"></determine-project>
            <project-info v-if="identification == '1'"></project-info>
            <project-common v-if="identification == '2'"></project-common>
            <slot name="header"></slot> 
            <div class="qqt-container-full-header___top">
                <el-form :inline="true">
                    <el-form-item >
                        <el-button type="primary" class="qqt-container-full-header-top___button" @click="addTicketReceiptRegistrationList">复制</el-button>
                        <el-input
                            placeholder="请输入内容"
                            style="width:150px;margin-left:10px"
                            prefix-icon="el-icon-search"
                            @keyup.enter.native="searchModelSynopsis"
                            v-model="filterText" size="mini">
                        </el-input>
                    </el-form-item>
                    <el-form-item label prop="keywords">
                       <el-date-picker
                        v-model="dateTime"
                        style="width:250px"
                        type="daterange"
                        size="mini"
                        range-separator="至"
                        start-placeholder="开始日期"
                        value-format="yyyy-MM-dd"
                        @change="dateChange"
                        end-placeholder="结束日期">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" style="margin-left:10px" class="qqt-container-full-header-top___button" @click="searchModelSynopsis">搜索</el-button>
                        <el-button type="info" class="qqt-container-full-header-top___button" @click="resetModelSynopsis">重置</el-button>
                        <el-button-group style="margin-left:10px">
                            <el-button size="mini" @click="exportExcel" icon="el-icon-upload2">导出</el-button>
                            <el-button size="mini" @click="printTable" icon="el-icon-upload2">打印</el-button>
                        </el-button-group>
                    </el-form-item>
                    <el-form-item label="项目类型:">
                        <div class="qqt-container-full-header-state___select">
                            <qqt-select :value="projectType" :options="projectList" :size="'mini'" :placeholder="'请选择'" @select="page.current = 1, page.size = 10, projectType = $event, searchModelSynopsis()"></qqt-select>
                        </div>
                    </el-form-item>
                    <el-form-item label="发票类型:">
                        <div class="qqt-container-full-header-state___select">
                            <qqt-select :value="invoiceType" :options="invoiceTypeOptions" :defaultProp="defaultProp" :size="'mini'" :placeholder="'请选择'" @select="page.current = 1, page.size = 10, invoiceType = $event, searchModelSynopsis()"></qqt-select>
                        </div>
                    </el-form-item>
                            <el-form-item label="办理状态:">
                        <div class="qqt-container-full-header-state___select">
                            <qqt-select :value="procState" :options="procStateList" :size="'mini'" :placeholder="'请选择'" @select="page.current = 1, page.size = 10, procState = $event,searchModelSynopsis()"></qqt-select>
                        </div>
                    </el-form-item>
                    <el-form-item label="审核状态:">
                        <div class="qqt-container-full-header-state___select">
                            <qqt-select :value="state" :options="stateList" :size="'mini'" :placeholder="'请选择'" @select="page.current = 1, page.size = 10, state = $event,searchModelSynopsis()"></qqt-select>
                        </div>
                    </el-form-item>
                 </el-form>
            </div>
            <div class="qqt-container-full-header___top_btn">
                <el-button type="success" size="mini" v-if="auth.add" class="user_input_button" @click="userInputBtn">用户输入</el-button>
                <el-dropdown  @command="handleCommand"  v-if="auth.orc" style="margin:0 10px;">
                    <el-button type="success" size="mini" >
                        ORC识别
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="本地上传">
                            本地上传
                        </el-dropdown-item>
                        <el-dropdown-item command="截图上传">截图上传</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-button v-if="auth.collect" type="success" size="mini" class="interface_acquisition_button" @click="interfaceAcquisitionBtn">接口采集</el-button>
                <el-button type="success" size="mini" class="ORC_identification_button" @click="isExamine('0')">审核</el-button>
                <el-button type="success" size="mini" class="interface_acquisition_button" @click="isExamine('1')">反审核</el-button>
            </div>
        </template>
        <div class="qqt-container-full___center">
            <qqt-table :data="tableData" ref="table" :exportData="exportData" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange" />
        </div>
        <upload-img :dialogVisible="dialogVisible" @dialogCancel="dialogCancel" @uploadImg="uploadOk">
            <template slot="header">
                <project-message  :disabled="identification != ''" :projectData="projectData" ref="projectData"></project-message>
            </template>
            <template slot="factor">
                <bottom-information  :values="values"   :edit="true" ref="bottomInformation" />
            </template>
        </upload-img>
        <copy-img :copyShow="copyShow" @copyCancel="copyCancel" @copyUploadImg="copyUploadImg" ref="copyImg">
             <template slot="header">
                <project-message  :disabled="identification != ''" :projectData="projectData" ref="projectCopyData"></project-message>
            </template>
            <template slot="factor">
                <bottom-information  :values="values"   :edit="true" ref="bottomInformationCopy" />
            </template>
        </copy-img>
    </d2-container>
</template>

<script>
    import { getTicketReceiptRegistrationList, getSelfTicketReceiptRegistrationList, getJointTicketReceiptRegistrationList,
             checkOrAgains, selfCheckOrAgains, jointCheckOrAgains,
             multiScan, selfMultiScan, jointMultiScan,
             delByIdSelfTicketReceiptRegistration, delByIdTicketReceiptRegistration, delByIdJointTicketReceiptRegistration,
             queryByIdSelfTicketReceiptRegistration } from '@/api/selfProject/controlOverInvoices/ticketReceiptRegistration'
    import { qqtTable, qqtSelect } from '@/components/qqt-subassembly'
    import { queryDicById } from '@/api/system/dic/dic'
    import { PURCHASEREQUEST } from '@/enum/DICTIONARY'
    import { Loading } from 'element-ui'
    import { mapState } from 'vuex'
    
    import util from '@/libs/util.js'
    import projectInfo from '../../../components/commenInfo/projectInfo'
    import copyImg from '../../ticketReceiptRegistration/components/copyImg'
    import uploadImg from '../../ticketReceiptRegistration/components/uploadImg'
    import projectCommon from '../../../../jontProjectDetail/components/projectCommon'
    import bottomInformation from '../../parameterSetting/components/bottomInformation'
    import projectMessage from '../../ticketReceiptRegistration/components/projectMessage'
    import determineProject from '../../../../jontProjectDetail/components/determineProject'

    export default {

        props: {

            // 发票来源 1-开票（销项），2-收票（进项）
            invoiceSource: {
                type: String,
                default: null
            },

            // 合同id
            contractId: {
                type: String,
                default: null
            },

            characteristic: {
                type: String,
                default: null
            }
        },

        data () {
            return {
                projectData: {
                    invoiceSource: '1',
                    projectType: '3'
                },
                values:{
                    createBy: '',
                    createName: '',
                    createTime: '',
                    departmentName: '',
                    departmentId: '',
                    companyName: '',
                    companyId: ''
                },
                auth: {
                    add: true,
                    orc: true,
                    edit: true,
                    delBat: true,
                    collect: true,
                },
                copyShow:false,
                dialogVisible:false,
                exportData:[],
                identification: '',
                dateTime:null,
                filterText: '',
                projectType:'',
                invoiceType: '',
                certificationStatus: '',
                deductionStatus: '',
                taxRefundStatus: '',
                invoiceTypeOptions: [],
                defaultProp: {
                    value: 'name',
                    label: 'name'
                },
                projectList: [
                    {
                        value: '1',
                        label: '自营项目'
                    },
                    {
                        value: '2',
                        label: '联营项目'
                    },
                    {
                        value: '3',
                        label: '其他'
                    }
                ],
                certificationStatusOptions: [
                    {
                        value: '0',
                        label: '未认证'
                    },
                    {
                        value: '1',
                        label: '已认证'
                    }
                ],
                deductionStatusOptions: [
                    {
                        value: '0',
                        label: '未退税'
                    },
                    {
                        value: '1',
                        label: '已抵扣'
                    }
                ],
                taxRefundStatusOptions: [
                    {
                        value: '0',
                        label: '未退税'
                    },
                    {
                        value: '1',
                        label: '部分退税'
                    },
                    {
                        value: '2',
                        label: '全部退税'
                    }
                ],
  
                state: '',
                procState: '',
                stateList:[
                    {
                        value:'1',
                        label: '审核'
                    },
                    {
                        value:'0',
                        label: '未审核'
                    },
                ],
                procStateList:[
                    {label:"初始化",value:"1"},
                    {label:"待审批",value:"2"},
                    {label:"审批中",value:"3"},
                    {label:"已驳回",value:"4"},
                    {label:"已作废",value:"5"},
                    {label:"已完结",value:"10"},
                ],
                tableSelectData: [],
                tableOption: {
                    border: false
                },
                transform: {
                    isShowDetails: false
                },
                dynamicHeader: {
                    tableId: '',
                    isSave: false
                },
                page: {
                    current: 1,
                    size: 10,
                    total: 0
                },
                tableData: {},
                rowHeader: [
                    {
                        prop: 'projectTypeName',
                        width: '120px',
                        label: '关联项目类型',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {
                            }, parms.row.projectTypeName = parms.row.projectType == 1 ? '自营' : (parms.row.projectType == 2 ? '联营': '其他'))
                        }
                    },
                    {
                        width: '120px',
                        prop: 'projectName',
                        label: '关联项目名称',
                        isShow: true
                    },
                    {
                        width: '120px',
                        prop: 'contractName',
                        label: '关联合同名称',
                        isShow: true
                    },
                    {
                        width: '120px',
                        prop: 'procStateName',
                        label: '办理状态',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {
                            }, parms.row.procStateName = util.handleState (parms.row.procState))
                        }
                    },
                    {
                        prop: 'agent',
                        label: '待办人',
                        isShow: true,
                    },
                    {
                        prop: 'stateName',
                        label: '审核状态',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {},
                                parms.row.stateName = parms.row.state == '0' ? '未审核' : '已审核'
                            )
                        }
                    },
                    {
                        prop: 'invoiceCode',
                        width: '120px',
                        label: '发票代码',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = true
                                        this.routerLink ('发票信息详情', parms.row.id,'',parms.row.procInstId)
                                    }
                                }
                            }, parms.row.invoiceCode)
                        }
                    },
                    {
                        prop: 'invoiceNum',
                        label: '发票号码',
                        width: '120px',
                        isShow: true
                    },
                    {
                        prop: 'invoiceType',
                        width: '120px',
                        label: '发票类型',
                        isShow: true
                    },
                    {
                        prop: 'affiliationProvince',
                        label: '所属省份',
                        width: '120px',
                        isShow: true,
                    },
                    {
                        prop: 'invoiceDate',
                        label: '开票日期',
                        width: '100px',
                        isShow: true,
                    },
                    {
                        prop: 'materialName',
                        width:'150px',
                        label: '货物或应税劳务、服务名称',
                        isShow: true,
                    },
                    {
                        prop: 'purchaserName',
                        label: '购买方名称',
                        width: '120px',
                        isShow: true,
                    },
                     {
                        prop: 'totalAmountStr',
                        label: '合计金额（元）',
                        width: '120px',
                        isShow: true,
                        render:(h,params) =>{
                            return h ('div',{
                            }, params.row.totalAmountStr = util.moneySepFormat(params.row.totalAmount)) 
                        }
                    },
                    {
                        prop: 'totalTax',
                        label: '税额合计（元）',
                        width: '120px',
                        isShow: true,
                        render:(h,params) =>{
                            return h ('div',{
                            }, params.row.totalTaxStr = util.moneySepFormat(params.row.totalTax)) 
                        }
                    },
                    {
                        prop: 'amountInFiguersStr',
                        label: '价税合计金额',
                        width: '120px',
                        isShow: true,
                        render:(h,params) =>{
                            return h ('div',{
                            }, params.row.amountInFiguersStr = util.moneySepFormat(params.row.amountInFiguers)) 
                        }
                    },
                    {
                        prop: 'createName',
                        width: '120px',
                        label: '登记人',
                        isShow: true,
                    },
                    {
                        prop: 'createTime',
                        width: '100px',
                        label: '登记时间',
                        isShow: true,
                    },
                    {
                        prop: '',
                        label: '操作',
                        isShow: true,
                        fixed: 'right',
                        width: '150',
                        render: (h, parms) => {
                            return [
                                this.auth.edit ? h ('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    attrs: {
                                        disabled: util.isDisabled (parms.row.procState)
                                    },
                                    on:{
                                        click: () => {
                                            this.transform.isShowDetails = false
                                            this.routerLink ('编辑开票信息', parms.row.id)
                                        }
                                    }
                                }, '编辑') : '',
                                this.auth.delBat ? h ('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    attrs: {
                                        disabled: util.isDisabled (parms.row.procState)
                                    },
                                   on:{
                                        click: () => {
                                            this.deleteTicketReceiptRegistrationListById (parms.row.id)
                                        }
                                    }
                                }, '删除') : ''
                            ]
                        }
                    }
                ]
            }
        },
        methods: {

            copyCancel () {
                this.copyShow = false
            },

            dialogCancel () {
                this.dialogVisible = false
            },

            handleCommand (type) {
                type == '本地上传' ? this.dialogVisible = true : this.copyShow = true
            },

            // 复制
            queryDataById (id) {
                queryByIdSelfTicketReceiptRegistration ({id: id}).then(res=> {
                    let data = Object.assign({},res)
                    data.id = null;
                    delete data.departmentId;
                    delete data.departmentName;
                    delete data.companyId;
                    delete data.companyName;
                    delete data.createBy;
                    delete data.createName;
                    this.transform.isShowDetails = false
                    this.routerLink ('添加收票信息','',data)
                })
            },

            addTicketReceiptRegistrationList () {
                if (this.tableSelectData.length === 1) {
                    this.queryDataById(this.tableSelectData[0].id)
                } else {
                    this.$message.error('请选择一条数据')
                }
            },

            selectChange (item) {
                this.tableSelectData = item
            },

            // 重置
            resetModelSynopsis () {
                this.projectType = this.dateTime = this.procState = this.state = this.invoiceType = this.certificationStatus = this.deductionStatus = this.taxRefundStatus = this.filterText = null
                this.searchModelSynopsis ()
            },

            getExportData () {
                this.exportData = JSON.parse(JSON.stringify((this.tableData.records))) || [];
                return new Promise((resolve, reject) => {
                    this.exportData.forEach((item,index) => {
                        item.procState = util.handleState(item.procState);
                        item.state = item.state === '0' ? '未审核' : '已审核';
                        item.projectType = item.projectType === '1' ? '自营项目' : (item.projectType === '2' ? '联营项目' : '其他');
                        item.deductionState  = item.deductionState == 1 ? '已抵扣' : '未抵扣';
                        item.drawbackState  = item.drawbackState == 0 ? '未退税' : (item.drawbackState == 1 ? '部分退税': '全部退税');
                        item.financeType  = item.financeType == 1 ? '成本类' :(item.financeType == 2 ? '费用类': '');

                    });
                    resolve (true)
                });
            },

            exportExcel () { 
                this.getExportData().then(res => {
                    this.$refs.table.getExportExcel()
                })
            },

            // 打印
            printPage () {

            },

            dateChange (date) {
                if (date) {
                    this.page.afterDate = date[0] + ' 00:00:00';
                    this.page.beforeDate = date[1]  + ' 23:59:59';
                } else {
                    this.page.afterDate = ''
                    this.page.beforeDate = ''
                }
               this.getTicketReceiptRegistrationPage ({afterDate:this.page.afterDate,beforeDate:this.page.beforeDate})
            },

            searchModelSynopsis () {
                this.getTicketReceiptRegistrationPage ({
                    'keywords': this.filterText ? this.filterText : null,
                    'invoiceTypeId': this.invoiceType ? this.invoiceType : null,
                    'validationState': this.certificationStatus ? this.certificationStatus : null,
                    'deductionState': this.deductionStatus ? this.deductionStatus : null,
                    'projectType': this.projectType ? this.projectType : null,
                    'procState': this.procState ? this.procState : null,
                    'state': this.state ? this.state : null,
                    'drawbackState': this.taxRefundStatus ? this.taxRefundStatus : null,
                    'afterDate': this.dateTime ? this.dateTime[0] + ' 00:00:00' : null,
                    'beforeDate': this.dateTime ? this.dateTime[1] + ' 23:59:59' : null
                })
            },

            handlePaginationChange (page) {
                this.page = page;
                this.$nextTick(() => {
                    this.searchModelSynopsis ()
                });
            },

            getTicketReceiptRegistrationPage (text) {
                let url = ''
                switch (this.identification) {
                    case '1':
                        url =  getSelfTicketReceiptRegistrationList
                        break
                    case '2':
                        url =  getJointTicketReceiptRegistrationList
                        break
                    default:
                        url = getTicketReceiptRegistrationList
                        break
                }
                url ({
                    ...text,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size,
                    'invoiceSource': '1',
                    'projectCode' : this.projectData.projectCode,
                    'contractId': this.contractId
                }).then( res => {
                    if (res) this.tableData = res
                })
            },

            getQueryDicByIdList () {
                queryDicById ({id: PURCHASEREQUEST.INVOICETYPE}).then(res =>{
                    if (res && res.length > 0) this.invoiceTypeOptions = res
                })
            },

            deleteTicketReceiptRegistrationListById (id) {
                util.confirm ().then (boolean => {
                    if (boolean) {
                        let url = ''
                        switch (this.identification) {
                            case '1':
                                url = delByIdSelfTicketReceiptRegistration
                                break
                            case '2':
                                url = delByIdJointTicketReceiptRegistration
                                break
                            default:
                                url = delByIdTicketReceiptRegistration
                                break
                        }
                        url ({'id': id}).then(res => {
                            if (res.code === 200) {
                                this.$message.success(res.message)
                                this.getTicketReceiptRegistrationPage ()
                            }
                        })
                    }
                })
            },

            userInputBtn () {
                this.transform.isShowDetails = false
                this.routerLink ('添加开票信息')
            },

            ORCIdentificationBtn () {},

            interfaceAcquisitionBtn () {},

            isExamine (type) {
                type == '0' ? this.isChick() : this.unIsChick()
            },

            // 审核
            isChick () {
                if (this.tableSelectData.length === 1) {
                    if (this.tableSelectData[0].state === '0') {
                        this.$confirm('您是否要审核该条数据?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            let url = ''
                            switch (this.identification) {
                                case '1':
                                    url = selfCheckOrAgains
                                    break
                                case '2':
                                    url = jointCheckOrAgains
                                    break
                                default:
                                    url = checkOrAgains
                                    break
                            }
                            url({id: this.tableSelectData[0].id, type: '1'}).then(res=> {
                                if (res.success) {
                                    this.$message.success(res.message);
                                } else {
                                    this.$message.error(res.message);
                                }
                                this.getTicketReceiptRegistrationPage ()
                            })  
                        })
                    } else {
                        this.$message.error('该数据已审核不支持继续审核');
                    }
                } else if (this.tableSelectData.length === 0) {
                    this.$message.error('请选择要审核的数据');
                } else {
                    this.$message.error('只支持单条数据操作');
                }
            },

            unIsChick () {
                if (this.tableSelectData.length === 1) {
                    if (this.tableSelectData[0].state === '1') {
                        this.$confirm('您是否要反审核该条数据?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            let url = ''
                            switch (this.identification) {
                                case '1':
                                    url = selfCheckOrAgains
                                    break
                                case '2':
                                    url = jointCheckOrAgains
                                    break
                                default:
                                    url = checkOrAgains
                                    break
                            }
                            url({id: this.tableSelectData[0].id, type: '0'}).then(res=> {
                                if (res.success) {
                                    this.$message.success(res.message);
                                } else {
                                    this.$message.error(res.message);
                                }
                                this.getTicketReceiptRegistrationPage ()
                            })
                        })
                    } else {
                        this.$message.error('该数据未审核不支持继续反审核');
                    }
                } else if (this.tableSelectData.length === 0) {
                    this.$message.error('请选择要反审核的数据');
                } else {
                    this.$message.error('只支持单条数据操作');
                }
            },

            invoiCecertificationBtn () {},

            otherPart (paths) {
                if (this.tableSelectData [0].procState != 10){
                    this.$message.warning ('请选择流程完结的数据')
                    return
                }
                if (this.tableSelectData.length === 1 ) {
                    this.$router.push({
                        path: paths,
                        name: paths,
                        params: {
                            relevancyId: this.tableSelectData [0].id,
                            invoiceSource: this.invoiceSource,
                            contractId: this.contractId,
                            startTag:'add'
                        }
                    })
                } else {
                    this.$message.warning ('请选择一条数据')
                    return
                }
            },

            invoiceDeductionBtn () {
                if (this.tableSelectData [0].deductionState != 0){
                    this.$message.warning ('该数据已经被抵扣')
                    return
                }
                this.otherPart('addInvoiceDeduction')
            },

            applyTaxRefundBtn () {
                if (this.tableSelectData [0].drawbackState == 2){
                    this.$message.warning ('该数据已经被使用')
                    return
                }
                this.otherPart('addInvoiceDrawBack')
            },
            
            exceptionMarkerBtn () {
                this.otherPart('addInvoiceAbnormalRegistration')
            },

            printTable () {
                this.$refs.table.printTable (this.tableSelectData)
            },

            invoiceInspectionBtn () {},
            
            //截图上传
            copyUploadImg () {
                let url = '', projectData = {}
                projectData = this.$refs.projectCopyData.getData();
                this.$refs.bottomInformationCopy.getData().then((result) => {
                    this.$refs.copyImg.getData().then(fileList=>{
                        let jsonData = {
                            ...result,
                            ...projectData,
                            imageUrls:fileList
                        }
                        switch (this.identification) {
                            case '1':
                                url = selfMultiScan
                                break
                            case '2':
                                url = jointMultiScan
                                break
                            default:
                                url = multiScan
                                break
                        }
                        url (jsonData).then(res=>{
                            if (res.result === null) {
                                this.getTicketReceiptRegistrationPage ()
                            } else {
                                this.transform.isShowDetails = false
                                let data = Object.assign(res,projectData,result)
                                this.routerLink ('添加收票信息','',data)
                            }
                        }).finally(res=>{
                            this.copyShow = false;
                        })

                    })
                })
            },

            uploadOk (fileList) {
                if (fileList.length === 0) {
                    this.$message.error('请上传发票')
                    return
                }
                let url, projectData
                projectData = this.$refs.projectData.getData();
                this.$refs.bottomInformation.getData().then((result) => {
                    let jsonData = {
                        ...result,
                        ...projectData,
                        imageUrls:fileList
                    }
                    switch (this.identification) {
                        case '1':
                            url = selfMultiScan
                            break
                        case '2':
                            url = jointMultiScan
                            break
                        default:
                            url = multiScan
                            break
                    }
                    url (jsonData).then(res=>{
                         if (res.result === null) {
                            this.getTicketReceiptRegistrationPage ()
                        } else {
                            this.transform.isShowDetails = false
                            let data = Object.assign(res,projectData,result)
                            this.routerLink ('添加收票信息','',data)
                        }
                    }).finally(res=>{
                        this.dialogVisible = false;
                    })
                })
            },

            routerLink (title, id = '', data='', procInstId='') {
                let route = '', returnPath = '', returnName = ''
                switch (this.identification) {
                    case '1':
                        route = 'addInvoicesBillingRegistrationList'
                        returnPath = this.contractId ? '/selfSupportProjectDetail/outputSelfProjectInvoice' : '/projectManagement/selfSupportProjectDetail/controlOverInvoices/billingRegistration/tabTop/1'
                        returnName = this.contractId ? 'outputSelfProjectInvoice' : 'billingRegistrationtabTop'
                        break
                    case '2':
                        route = 'addJointInvoicesBillingRegistrationList'
                        returnPath = this.contractId ? '/jontProjectDetail/outputJointProjectInvoice' : '/projectManagement/selfSupportProjectDetail/controlOverInvoices/billingRegistration/jointProject/2'
                        returnName = this.contractId ? 'outputJointProjectInvoice' : 'billingRegistrationjointProject'
                        break
                    default:
                        route = 'addBillingRegistrationList'
                        returnPath = this.contractId ? '/contract/inputInvoice' : '/projectManagement/selfSupportProjectDetail/controlOverInvoices/billingRegistration'
                        returnName = this.contractId ? 'outputInvoice' : 'billingRegistration'
                        break
                }
                console.log(id,this.contractId,this.transform,procInstId,data);
                this.$router.push ({ path: route, name: route, params: {
                                                                    relevancyId: id,
                                                                    contractId: this.contractId,
                                                                    transform: this.transform,
                                                                    procInstId: procInstId,
                                                                    invoiceSource: '1',
                                                                    data: data,
                                                                    purchaser: '0',
                                                                    path: returnPath,
                                                                    name: returnName
                                                                }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            },

            _validationAuth () {
                switch (this.identification) {
                    case '1':
                        this.auth.add        =      this.$has ('invoice:origin:add:1s')
                        this.auth.orc        =      this.$has ('invoice:origin:orc:1s')
                        this.auth.edit       =     this.$has ('invoice:origin:edit:1s')
                        this.auth.delBat     =   this.$has ('invoice:origin:delete:1s')
                        this.auth.collect    =  this.$has ('invoice:origin:collect:1s')
                        break
                    case '2':
                        this.auth.add        =      this.$has ('invoice:origin:add:1j')
                        this.auth.orc        =      this.$has ('invoice:origin:orc:1j')
                        this.auth.edit       =     this.$has ('invoice:origin:edit:1j')
                        this.auth.delBat     =   this.$has('invoice:origin:delete:1j')
                        this.auth.collect    =  this.$has ('invoice:origin:collect:1j')
                        break
                    default:
                        this.auth.add        =     this.$has ('invoice:origin:add:1')
                        this.auth.orc        =     this.$has ('invoice:origin:orc:1')
                        this.auth.edit       =    this.$has ('invoice:origin:edit:1')
                        this.auth.delBat     =  this.$has ('invoice:origin:delete:1')
                        this.auth.collect    = this.$has ('invoice:origin:collect:1')
                        break
                }
            },

            decideLoadDataWay () {
                this.identification = this.$route.params.identification || this.characteristic
                switch (this.identification) {
                    case '1':
                        this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad')
                        break
                    case '2':
                        this.$store.dispatch('d2admin/db/database', {user: true}).then (db => {
                            let projectCode, projectId, projectName
                            projectId = db.get('proID').value(), projectCode = db.get('proCode').value(), projectName = db.get('proName').value()
                            Object.assign (this.projectData, { projectCode, projectId, projectName, projectType: '2', contractId: this.contractId })
                            this.getTicketReceiptRegistrationPage ()
                        })
                        break
                    default:
                        this.getTicketReceiptRegistrationPage ()
                        break
                }
            }
        },

        components: {
            copyImg,
            uploadImg,
            projectMessage,
            bottomInformation,
            'qqt-table': qqtTable,
            'qqtSelect': qqtSelect,
            'project-info': projectInfo,
            'project-common': projectCommon,
            'determine-project': determineProject
        },

        created () {
            this.getQueryDicByIdList ()
            this.decideLoadDataWay ()
            this._validationAuth ()
        },

        computed: {
            ...mapState ('d2admin/selfSupportProject', [
                'selfSupportProject'
            ])
        },

        watch: {

            selfSupportProject () {
                const { projectCode, projectCode: projectId, projectName } = this.selfSupportProject
                Object.assign (this.projectData, { projectCode, projectId, projectName, projectType: '1', contractId: this.contractId })
                this.getTicketReceiptRegistrationPage ()
            },

            $route (val) {
                if (val.path.indexOf('billingRegistration') !== -1) {
                    this.decideLoadDataWay ()
                    this._validationAuth ()
                }
            }
        }
    }

</script>


<style lang="scss">
.ticketReceipt_registration_list {
    .qqt-container-full-header___top {
        .el-form-item__label {
            color: $color-project-select;
        }

    }
    .el-date-editor .el-range-separator{
        padding: 0px;
    }
    .qqt-container-full-header-state___select {
        .select {
            width: 135px;
        }
        .el-input__inner {
            border: 1px solid $color-project-select;
        }
        input::-webkit-input-placeholder {
            color: $color-project-select !important;
        }
        .el-select .el-input .el-select__caret {
            color: $color-project-select !important;
        }
    }
}
</style>
