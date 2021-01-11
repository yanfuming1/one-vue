<template>
    <d2-container type="fulls" class="costRegistrationAddition">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
            </div>
            <div class="qqt-container-full-center___top">
                <qqt-flow-tabs :procInstId="procInstId">
                    <template slot="content">
                        <project-information-basic :transform="transform" :values="values" @projectCode="getProjectCode" />
                        <fm-generate-form :data="jsonData" :remote="remoteFuncs" :value="values" :transform="transform" ref="generateForm" @on-change="selectGenerateChange">
                            <template slot="costNameForm">
                            <el-form :model="values" :rules="rules" ref="form">
                                <el-form-item label="成本名称" label-width="100px"> 
                                <el-select v-model="values.costName" placeholder="请选择成本名称" ref="costNameSelect" :disabled="transform.isShowDetails" style="width: 100%">
                                    <el-option :value="values.costNameId" :label="values.costNameData" style="width:  100%;height:200px;overflow: auto;background-color:#fff">
                                        <el-tree
                                            :data="acquisitionNameArr"
                                            :props="defaultProps"
                                            @node-click="handleNodeClick"
                                        ></el-tree>
                                    </el-option>
                                </el-select>
                                </el-form-item>
                            </el-form>
                            </template>
                        </fm-generate-form> 
                        <bottom-information :values="values" fieldTitle="登记" timeTitle="登记" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation" />
                    </template>
                </qqt-flow-tabs>
            </div>
            <div class="qqt-container-full-content___button">
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitCostRegistrationAdditionData ()">重新提交</el-button>
                <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveCostRegistrationAddition">保存</el-button>
                <el-button type="primary" v-if="!transform.isShowDetails && procInstId === ''" @click="values['flag'] = '1', submitCostRegistrationAdditionData ()">提交</el-button>
                <el-button @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataCostRegistrationAddition"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentCostRegistrationAddition" />
    </d2-container>
</template>

<script>
    import { addCostRegistration, editCostRegistration, queryByIdCostRegistration, submitCostRegistration, completeCostRegistration, resubmitCostRegistration, getAcquisitionNameData } from '@/api/selfProject/economicCalculation/costRegistration/actualCost'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, upload, qqtRelateTable } from '@/components/qqt-subassembly'
    import projectInformationBasic from '../../../../operatingReserve/components/projectInformationBasic'
    import bottomInformation from '../../../../businessBidding/components/bottomInformation'
    import { formGetJson } from '@/api/system/fromManagement/index'
    import { PROPRIETARYPROJECT } from '@/enum/FORMCODE'
    import { queryDicById } from '@/api/system/dic/dic'
    import { getDetails } from '@/api/approval/common'
    import { mapActions } from 'vuex'

    import util from '@/libs/util.js'
    let than = this
    export default {

        data () {
            return {
                title: '',
                stutas: '',
                procInstId: '',
                remoteFuncs: {
                    getAcquisitionName (resolve) {
                        resolve(than.acquisitionNameArr)
                    },
                },
                acquisitionNameArr: [],
                values: {
                    costName: '',
                    costNameId: '',
                    costNameData: ''
                },
                defaultProps: {
                    children: 'costFeeList',
                    label: 'feename',
                    value: 'id'
                },
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
                visible: false,
                isReject: false,
                isSendBack: false,
                isTurnManage: false,
                dialogVisible: false,
                processModuleId: PROPRIETARYPROJECT.COSTREGISTRATIONADDITION,
                upLoadFileDefaultList: [],
                departmentList: [],
                rules: {
                    costName: [{ required: true, message: "请选择成本名称", trigger: ["blur",'change'] }],
                }
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

            selectGenerateChange (field, val, models) {
                switch (field) {
                    case 'costPrice' :
                        models.lower = util.convertCurrency(val)
                }
            },
            
            handleNodeClick (node){
                if(node.costFeeList){
                    this.values.costNameId = node.id
                    this.values.costName = node.feename
                    this.$refs.costNameSelect.blur()
                } else {
                    
                }
            },

            getCostRegistrationAddition (id) {
                queryByIdCostRegistration ({'id': id}).then (res => {
                    if (res) {
                        res.price = res.price + ''
                        this.values = res
                        this.fileDefaultNeaten (res)
                    }
                })
            },

            saveCostRegistrationAddition () {
                let url = ''
                let info = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && info) {
                        Object.assign (this.values, data, info)
                        this.values.costPrice = Number(this.values.costPrice).toFixed(2)
                        this.values.price = Number(this.values.price).toFixed(2)
                        this.values.id == null ? url = addCostRegistration : url = editCostRegistration
                        url (this.values).then (res => {
                            if (res.code === 200) {
                                this.$message.success ('保存成功')
                                this.closePageTag ()
                            }
                        })
                    }
                })
            },

            submitCostRegistrationAdditionData () {
                let info = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && info) {
                        Object.assign (this.values, data, info)
                        this.dialogVisible = true
                        this.prossValue = {
                            title: this.$route.params.title || `实际成本:【 ${this.values.costItem} 】`,
                            pdfId: this.$route.params.procDefId || '',
                            degree: this.$route.params.degree || '',
                            msg: '',
                        }
                    }
                })
            },

            updataCostRegistrationAddition (item, boolean) {
                let url = ''
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                boolean ? url = resubmitCostRegistration : url = submitCostRegistration
                url (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closePageTag ()
                    }
                })
            },

            consentCostRegistrationAddition (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closePageTag ()
                    return
                }
                if (item) {
                    this.values['completeTask'] = item
                    completeCostRegistration (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success (res.message)
                            this.closePageTag ()
                        }
                    })
                }
            },

            getQueryDicByIdList () {
                let list = ['字典项1', '字典项2']
                list.forEach (res => {
                    queryDicById ({'id': res}).then (item => {
                        if (item == null || item.length == 0) return
                            switch (res) {
                                case '字典项1':
                                    this.buyTypeList = item
                                    break
                                case '字典项2':
                                    this.sectionList = item
                                    break
                            }
                    })
                })
            },

            getDetailsList (taskId) {
                getDetails (taskId).then (res => { if (res) this.nodeData = res })
            },

            closePageTag () {
                let tagName = this.$route.path
                let path = ``
                this.stutas ? path = `/approval/${this.stutas}` : path = `/projectManagement/selfSupportProjectDetail/economicCalculation/costRegistration/actualCost`
                this.close ({ tagName, path })
            },

            upLoadFileCallBack (item) {
                this.values.fileList = item
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
                    this.getCostRegistrationAddition (this.$route.params.relevancyId)
                }
            },

            getProjectCode (projectCode) {
                this.values['projectCode'] = projectCode
                this.getFormByJson ()
            },

            getAcquisitionNameEvent () {
                getAcquisitionNameData().then( res => {
                    this.acquisitionNameArr = res[0].costFeeList
                })
            }
        },

        created () {
            this.getFormByJson ()
            this.updataRouter ()
            this.getAcquisitionNameEvent ()
        },

        mounted () {
            than = this
        },

        components: {
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent,
            'up-load': upload,
            'project-information-basic': projectInformationBasic,
            'bottom-information': bottomInformation
        }
    }
</script>

<style lang='scss'>
    .costRegistrationAddition {
        .files-upload___right {
            margin-left: 120px
        }
    }
</style>
