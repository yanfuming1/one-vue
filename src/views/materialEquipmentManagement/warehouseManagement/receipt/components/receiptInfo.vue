<template>
    <d2-container type="fulls">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closeTag"><i class="el-icon-close"></i></el-button>
            </div>

            <div class="qqt-container-full-center___top">
                <qqt-flow-tabs :procInstId="procInstId">
                <template slot="content"> 
                    <fm-generate-form :data="jsonData" :remote="remoteFuncs" :value="values" :transform="transform" ref="generateForm">
                        <template slot="receiptInfoTabs">
                            <div class="receiptInfoTabs">
                                <qqt-relate-table :data="receiptInfoTabsData" :rowHeader="rowereceiptInfo" ref="receiptInfoRef" :defaultProp="defaultrowereceiptInfo" :isShowDetails="isTabsShowDetails" @change="changeDataEvent"/>
                            </div>
                        </template>
                    </fm-generate-form>
                    <div class="lock-inventory-information___upload">
                        <div class="lock-inventory-information___label">上传附件:</div>
                        <div class="lock-inventory-information___right">
                            <up-load id="male" @upLoadFileCallBack="upLoadFileCallBack" :isShowUpload="!transform.isShowDetails" :propList="upLoadFileDefaultList" ref="upLoad" />
                        </div>
                    </div>
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
                <el-button size="mini" type="primary" v-if="!transform.isShowDetails && procInstId === '' && $has ('administer:adminUseapply:submit')" @click="values['flag'] = '1', submissionScrapRecord (false)">提交</el-button>
                <el-button size="mini" @click="closeTag">关闭</el-button>
            </div>
        </el-card>
    </d2-container>
</template>

<script>
    import { formGetJson } from '../../../../../api/system/fromManagement/index'
    import { MATERIALEQUIPMENTMANAGEMENT } from '../../../../../enum/FORMCODE'
    import { mapActions } from 'vuex'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, qqtRelateTable, upload } from '../../../../../components/qqt-subassembly'
    import { getDetails } from '../../../../../api/approval/common'
    export default {
        
        data() {
            return {
                values:{},
                jsonData: {},
                remoteFuncs: {
                    // getNatureVehicle (resolve) {
                    //     resolve ([
                    //         {
                    //             id: '1',
                    //             name: '公司车辆'
                    //         },
                    //         {
                    //             id: '2',
                    //             name: '个人车辆'
                    //         }
                    //     ])
                    // },
                },
                transform: {
                    isShowDetails: false
                },

                // 添加行
                receiptInfoTabsData: [],
                isTabsShowDetails: false,
                rowereceiptInfo: [
                    {
                        prop: '',
                        label: '材料编码',
                        isShow: true,
                        type: 'text',
                        required: true
                    },
                    {
                        prop: '',
                        label: '名称',
                        isShowElement: true,
                        type: 'text',
                        required: true
                    },
                    {
                        prop: '',
                        label: '品牌',
                        isShow: true,
                        type: 'text'
                    },
                    {
                        prop: '',
                        label: '规格型号',
                        isShow: true,
                        type: 'text'
                    },
                    {
                        prop: '',
                        label: '计量单位',
                        isShow: true,
                        type: 'text'
                    },
                    {
                        prop: '',
                        label: '数量',
                        isShow: true,
                        type: 'text'
                    },
                    {
                        prop: '',
                        label: '供应商',
                        isShow: true,
                        type: 'text'
                    },
                    {
                        prop: '',
                        label: '单价（元）',
                        isShow: true,
                        type: 'text'
                    },
                    {
                        prop: '',
                        label: '总价（元）',
                        isShow: true,
                        type: 'text'
                    },
                    {
                        prop: '',
                        label: '是否消耗品',
                        isShow: true,
                        type: 'text',
                        required: true
                    },
                    {
                        prop: '',
                        label: '备注',
                        isShow: true,
                        type: 'text'
                    },

                    
                ],

                defaultrowereceiptInfo: {
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
                formGetJson ({'code': MATERIALEQUIPMENTMANAGEMENT.SITERECEIPT}).then(res => {
                    if (res) {
                        this.jsonData = JSON.parse(res)
                    }
                })
            },

            upLoadFileCallBack (item) {
                this.values.fileList = item
            },

            // 保存
            saveScrapRecord () {

            },

            // 提交
            submissionScrapRecord () {

            },

            closeTag () {
                let tagName = this.$route.path
                let path = '/materialEquipmentManagement/warehouseManagement/receipt'
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

            this.getFormByJson()

        },
        components: {
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent,
            'qqt-relate-table': qqtRelateTable,
            'up-load': upload
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
    .lock-inventory-information___upload {
        padding: 0 30px;
        .lock-inventory-information___label {
            font-size: 14px;
            float: left;
            margin-left: 16px;
            color: $input-disable
        }
        .lock-inventory-information___right {
            margin-left: 90px
        }
    }
</style>