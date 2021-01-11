<template>
    <el-dialog v-dialogDrag :visible="dialogVisible" title="发起审批" width="45%" :before-close="handleClose">
        <fm-generate-form :data="jsonData" :isCreated="isCreated" :remote="remote" :value="prossValue" ref="generateForm" @on-change="selectGenerateChange" />
        <el-form label-width="100px">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="指定节点:" v-if="authority">
                        <qqt-select :value="activityId" :options="activity" :size="size" :defaultProp="activitiProp" @select="activityId = $event" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="指定审批人:" v-if="authority">
                        <qqt-select :valueArray="candidates" :filterable="true" :size="size" :options="allUser" :defaultProp="defaultProp" :multiple="true" @select="candidates = $event" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="备注:">
                <el-input type="textarea" v-model="msg"></el-input>
            </el-form-item>
        </el-form>
        <div class="qqt-send-process-update-content">
            <el-tabs v-model="activeName">
                <el-tab-pane label="流程节点信息" name="first">
                    <qqt-table 
                        :data="tableData" 
                        :rowHeader="rowHeader" 
                        :isShowSelection="isShowSelection" 
                        :isDrag="isDrag" 
                        :isShowGroup="isShowGroup" 
                        :pageShow="isShowPage" 
                        :option="tableOption"></qqt-table>
                </el-tab-pane>
                <el-tab-pane label="流程图" name="second">
                    <div class="qqt-flow-diagram">
                        <qqt-flow-diagram :flowDiagram="tableData.records"></qqt-flow-diagram>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="emitData">确 定</el-button>
            <el-button @click="$emit('close')">取 消</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { qqtTable, qqtFlowDiagram, qqtSelect } from '../index'
import { formGetJson } from '../../../api/system/fromManagement/index'
import { PROCESSINSTANCE } from '../../../enum/FORMCODE'
import { listyBstaffLoan } from '../../../api/financialManagement/staffLoan'
import { nodeInfoStartCrew, getPdfName, getFindWalkRouteByApply } from "../../../api/officalDocument/index"
import { mapState } from 'vuex'

export default {
    name: 'qqt-send-process',
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        isSendBack: {
            type: Boolean,
            default: false
        },
        processModuleId: {
            type: String,
            default: ''
        },
        prossValue: {
            type: Object,
            default: ()=> {
                return {
                    title: '',
                    pdfId: '',
                    degree: '',
                    msg: '',
                }
            }
        }
    },
    data () {
        return {
            msg: '',
            activityId: '',
            activity: [],
            candidates: [],
            activeName: 'first',
            isDrag: false,
            isCreated: false,
            isShowGroup: false,
            isShowPage: false,
            isShowSelection: false,
            rowHeader: [
                {
                    prop: 'name',
                    label: '节点名称',
                    isShow: true,
                },
                {
                    prop: 'category',
                    label: '类型',
                    isShow: true,
                    render: (h, parms) => {
                        return h('p', {
                            
                        }, parms.row.category === '1' ? '申请' : '审批');
                    }
                },
                {
                    prop: 'candidatesName',
                    label: '审批人',
                    isShow: true,
                },
                {
                    prop: 'copiersName',
                    label: '抄送人',
                    isShow: true,
                },
                {
                    prop: 'outgoingName',
                    label: '下一节点',
                    isShow: true,
                }
            ],
            jsonData: {},
            remote: {},
            tableData: {
                records: []
            },
            tableOption: {
                border: true,
                height: 200
            },
            defaultProp: {
                value: 'id',
                label: 'name'
            },
            activitiProp: {
                value: 'activityId',
                label: 'name'
            },
            size: 'medium'
        }
    },

    methods: {

        handleClose () {
            this.$emit ('close')
        },
        
        getFormGetJson () {
            if (this.isSendBack) {
                formGetJson ({'code': PROCESSINSTANCE.QQTSENDBACKPROCESS}).then (res => {
                    if (res) {
                        this.jsonData = JSON.parse(res)
                    }
                })
            } else {
                formGetJson ({'code': PROCESSINSTANCE.QQTSENDPROCESS}).then (res => {
                    if (res) {
                        this.jsonData = JSON.parse(res)
                    }
                })
            }
        },

        getFindWalkRouterData (data) {
            getFindWalkRouteByApply (data).then (res => {
                if (res) {
                    this.activity = res
                }
            })
        },

        getProcessModuleList () {
            let jsonData = {
                formKey:this.processModuleId
            };
            if (this.isSendBack) {
                jsonData.pdfId = this.prossValue.pdfId;
            }
            listyBstaffLoan (jsonData).then (res => {
                if (res) {
                    this.neateanData (res)
                }
            })
        },

        selectGenerateChange (field, val, models) {
            switch (field) {
                case 'pdfId':
                    this.getNodeInfoStartCrew (val)
                    this.getFindWalkRouterData (val)
                    this.activityId = ''
                    this.candidates = []
                    break
            }
        },

        getNodeInfoStartCrew (id) {
            nodeInfoStartCrew (id).then (res => {
                console.log(res)
                if (res) {
                    this.tableData.records = res
                }
            })
        },

        emitData () {
            this.$refs.generateForm.getData ().then (res => {
                if (res) {
                    res['type'] = '1'
                    res['activityId'] = this.activityId
                    res['candidates'] = this.candidates
                    res['msg'] = this.msg
                    this.$emit ('selectData', res, this.isSendBack)
                }
            })
        },

        neateanData (data = []) {
            this.remote = {
                getProcessInstantiation (resolve) {
                    resolve (data)
                },
                getBusinessType (resolve) {
                    resolve ([
                        {
                            id: '1',
                            name: '一般'
                        },
                        {
                            id: '2',
                            name: '重要'
                        },
                        {
                            id: '3',
                            name: '紧急'
                        }
                    ])
                }
            }
        }
    },

    components: {
        'qqt-table': qqtTable,
        'qqt-select': qqtSelect,
        'qqt-flow-diagram': qqtFlowDiagram
    },

    computed: {
        ...mapState ('d2admin/allUser', [
            'allUser'
        ]),

        ...mapState ('d2admin/authority', [
            'authority'
        ])
    },

    created () {
        this.getFormGetJson ()
        if (this.processModuleId) {
            this.getProcessModuleList ()
        }
        if (this.prossValue.pdfId) {
            this.msg = this.prossValue.msg
            this.getNodeInfoStartCrew (this.prossValue.pdfId)
        }
        this.$store.dispatch ('d2admin/authority/get')
        Object.keys(this.jsonData) == 0 ? this.isCreated = false : this.isCreated = true
    },

    watch: {
        processModuleId: {
            deep: true,
            handler (val) {
                this.getProcessModuleList ()
                if (this.prossValue.pdfId) {
                    this.msg = this.prossValue.msg
                    this.getFindWalkRouterData (this.prossValue.pdfId)
                    this.getNodeInfoStartCrew (this.prossValue.pdfId)
                }
            }
        }
    }
}
</script>

<style lang='scss' scoped>
.qqt-flow-diagram {
    overflow: auto
}
</style>
