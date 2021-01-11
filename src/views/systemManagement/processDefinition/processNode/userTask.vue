<template>
    <div class="user-task">
        <el-form ref="form" :model="form" label-width="110px" size="medium">
            <el-form-item label="名称:">
                <qqt-input 
                    v-model="form.name" 
                    :value="form.name" 
                    @input="updateUserTaskData"
                ></qqt-input>
            </el-form-item>
            <el-form-item label="审批:">
                <qqt-input 
                    v-model="form.candidatesName" 
                    :value="form.candidatesName" 
                    :readonly="readonly"
                    @focus="isAuditman = true, title='选择审批'"
                    @input="form.candidatesName = $evnet"
                ></qqt-input>
            </el-form-item>
            <el-form-item label="抄送:">
                <qqt-input 
                    v-model="form.copiersName" 
                    :value="form.copiersName" 
                    :readonly="readonly" 
                    @focus="isCopire = true, title='选择抄送'"
                    @input="form.copiersName = $event"
                ></qqt-input>
            </el-form-item>
            <el-form-item label="默认审批意见:">
                <qqt-input
                    v-model="form.msg"
                    :value="form.msg"
                    @input="form.msg = $event"
                ></qqt-input>
            </el-form-item>
            <el-form-item label="审批操作:">
                <qqt-checkbox 
                    v-model="form.operation" 
                    :options="examineAndApprove" 
                    :isRow="isRow" 
                    :value="form.operation" 
                    @checkedChange="isShowBackWay"
                ></qqt-checkbox>
                <el-form-item label="驳回节点:" v-show="isShow">
                    <qqt-select 
                        v-model="form.sendBackNode" 
                        :value="form.sendBackNode"
                        :options="fallbackNode"
                        :defaultProp="defaultProp"
                        :placeholder="'请选择退回节点'"
                        @select="form.sendBackNode = $event"
                    ></qqt-select>
                </el-form-item>
            </el-form-item>
            <el-form-item label="节点设置:">
                <qqt-checkbox 
                    v-model="form.setting" 
                    :options="nodeSetting" 
                    :value="form.setting"
                    :isRow="isRow"
                    @checkedChange="showTimeSelection"
                ></qqt-checkbox>
            </el-form-item>
            <div class="toRight">
                <el-form-item label="时长:" :label-position="'right'" v-show="isShowTime">
                    <el-input type="numeber" v-model="form.duration" class="showTime"></el-input>时
                </el-form-item>
                <!-- <el-form-item label="超时:" v-show="isShowTime">
                    <qqt-radio 
                        v-model="form.timingType" 
                        :value="form.timingType"
                        :options="overTimeList" 
                        @radio="form.timingType = $event"
                    ></qqt-radio>
                </el-form-item> -->
                <el-form-item label="内容:" v-show="isShowTime && form.timingType === '1'">
                    <qqt-input 
                        type="textarea" 
                        v-model="form.timingContent" 
                        :value="form.timingContent + ''" 
                        @input="form.timingContent = $event"
                    ></qqt-input>
                </el-form-item>
                <el-form-item label="次数:" v-show="isShowTime && form.timingType === '1'">
                    <qqt-inputNumber 
                        v-model="form.remindCount" 
                        :value="Number(form.remindCount)" 
                        :min="1" :max="10" 
                        :controlsPosition="controlsPosition"
                        @inputNumber="form.remindCount = $event"
                        class="inputNumber"
                    ></qqt-inputNumber>  次
                </el-form-item>
                <el-form-item label="间隔:" v-show="isShowTime && form.timingType === '1'">
                    <el-input type="numeber" v-model="form.numeber" class="interval"></el-input>分
                </el-form-item>
                <el-form-item label="节点:" v-show="isShowTime && form.timingType === '2'">
                    <qqt-select 
                        v-model="form.skipNode" 
                        :value="form.skipNode"
                        :options="skipNodeNode"
                        :defaultProp="defaultProp"
                        :placeholder="'请选择退回节点'"
                        @select="form.skipNode = $event"
                    ></qqt-select>
                </el-form-item>
            </div>
            <el-form-item label="表单:">
                <form-binding 
                    :formKey="form.formKey"
                    :options="options" 
                    @selectFormData="getSelectFormData"
                ></form-binding>
            </el-form-item>
            <!-- <el-form-item label="监听器:">
                <monitor-binding 
                    :listener="listener" 
                    @selectMonitorData="getSelectMonitorData"
                ></monitor-binding>
            </el-form-item> -->
        </el-form>
        <user-modules :showDialog="isAuditman || isCopire" @clearUserPage="clearUserPage" :title="title" :isShowOther="true" @closeFun="closeFun"></user-modules>
    </div>
</template>

<script>
import FormBinding from '../processModules/formBinding'
import MonitorBinding from '../processModules/monitorBinding'
import ElementFactory from '../../../../util/elementFactory'
import UserModules from '../processModules/userModules'

import { mapState } from 'vuex'
import { getAllFromByBase } from '../../../../api/system/fromManagement'
import { qqtInput, qqtCheckbox, qqtSelect, qqtInputNumber, qqtRadio } from '../../../../components/qqt-subassembly'
export default {
    name: 'userTask',
    props: {
        nodeId: String,
        nodeInfo: Array,
        defaultFormKey: String
    },
    data () {
        return {
            form: {
                name: '',
                activityId: '',
                candidates: '',
                msg: '',
                candidatesName: '',
                copier: '',
                copiers: '',
                date2: '',
                operation: [],
                setting: [],
                timingType: '1',
                timingContent: '',
                sendBackNode: '',
                duration: 0,
                remindCount: 1,
                intervalTime: 0,
                skipNode: '',
                formKey: '',
                monitorData: null
            },
            isShow: false,
            isAuditman: false,
            isCopire: false,
            isShowTime: false,
            listener: {
                class: '',
                event: ''
            },
            title: '选择审批人员',
            readonly: true,
            controlsPosition: 'right',
            isRow: true,
            fallbackNode: [],
            skipNodeNode: [],
            examineAndApprove: [
                {
                    value: '1',
                    label: '转办',
                    disable: false
                },
                {
                    value: '3',
                    label: '作废',
                    disable: false
                },
                {
                    value: '2',
                    label: '驳回',
                    disable: false
                }
            ],
            nodeSetting: [
                {
                    value: '1',
                    label: '会签',
                    disable: false
                },
                {
                    value: '2',
                    label: '手写签名',
                    disable: false
                },
                {
                    value: '3',
                    label: '存档签名',
                    disable: false
                },
                {
                    value: '7',
                    label: '是否跳过申请人',
                    disable: false
                },
                {
                    value: '9',
                    label: '节点时效',
                    disable: false
                }
            ],
            overTimeList: [
                {
                    value: '1',
                    label: '提醒'
                },
                {
                    value: '2',
                    label: '跳转到指定节点'
                },
                {
                    value: '3',
                    label: '完成'
                }
            ],
            dataTimeList: [
                {
                    value: '1',
                    label: '天'
                },
                {
                    value: '2',
                    label: '时'
                },
                {
                    value: '3',
                    label: '分'
                }
            ],
            // 监听器
            executionListener: [
                {
                    event: 'start',
                    class: 'com.qqtkj.qqtoi.activiti.listener.StartTaskListener'
                },
                {
                    event: 'end',
                    class: 'com.qqtkj.qqtoi.activiti.listener.EndTaskListener'
                }
            ],
            taskListener: [
                {
                    event: 'create',
                    class: 'com.qqtkj.qqtoi.activiti.listener.CreateTaskListener'
                },
                {
                    event: 'assignment',
                    class: 'com.qqtkj.qqtoi.activiti.listener.AssignmentTaskListener'
                },
                {
                    event: 'complete',
                    class: 'com.qqtkj.qqtoi.activiti.listener.CompleteTaskListener'
                }
            ],
            elementRegistry: [],
            defaultProp: {
                value: 'id',
                label: 'name'
            },
            options: []
        }
    },
    methods: {

        handleClick (tab, event) {
        },

        // 是否显示退回方式
        isShowBackWay (item) {
            this.form.operation = item
            if (item.indexOf('2') !== -1) {
                this.isShow = true
                this.form.sendBackNode = 'usertask1'
            } else {
                this.isShow = false
                this.form.sendBackNode = ''
            }
        },

        // 是否显示节点时效设置
        showTimeSelection (item) {
            
            this.form.setting = item
            if (item.indexOf('9') !== -1) {
                this.isShowTime = true
            } else {
                this.isShowTime = false
            }
            if (item.indexOf('1') !== -1) {
                ElementFactory.UpdateMultiInstanceLoopCharacteristics(true)
                ElementFactory.updateCandidateUsers(true)
            } else {
                ElementFactory.UpdateMultiInstanceLoopCharacteristics(false)
                ElementFactory.updateCandidateUsers(false)
            }
        },

        // 获取绑定的form表单
        getSelectFormData (item) {
            this.form.formKey = item
            ElementFactory.updateFormKey(item)
        },

        getSelectMonitorData (item) {
            this.form.monitorData = item
            // 创建 TaskListener监听器标签
            ElementFactory.createElement('activiti:TaskListener', item)
        },

        // 更新流程实例中的数据
        updateUserTaskData (item) {
            this.form.name = item
            ElementFactory.updateName(this.form.name)
        },

        updateDefaultData () {
            this.reset()
            let index = -1
            let form = {}
            let nodeData = this.$store.state.d2admin.processDefinition.nodeData.businessObject
            if (nodeData == null) {
                return
            }
            if (this.nodeInfo && this.nodeInfo.length > 0) {
                index = this.nodeInfo.findIndex(i => i.activityId === nodeData.id)
            }
            if (index !== -1) {
                form = this.nodeInfo[index]
                if (typeof form.operation === 'string' && form.operation != '') {
                    form.operation = JSON.parse (form.operation)
                    
                }
                if (typeof form.setting === 'string' && form.setting !== '') {
                    form.setting = JSON.parse (form.setting)
                    
                }
                if (typeof form.candidates === 'string' && form.candidates !== '') {
                    form.candidates = JSON.parse (form.candidates)
                }
                if (typeof form.copiers === 'string' && form.copiers !== '') {
                    form.copiers = JSON.parse (form.copiers)
                }


                if (form && form.operation && form.operation.length > 0) {
                    if (form.operation.indexOf('2') !== -1) {
                        this.isShow = true
                    } else {
                        this.isShow = false
                    }
                }
                if (form && form.setting && form.setting.length > 0) {
                    if (form.setting.indexOf('9') !== -1) {
                        this.isShowTime = true
                    } else {
                        this.isShowTime = false
                    }
                }
                this.form = form
            }

            index = this.nodeInfo.findIndex(i => i.activityId === nodeData.id)
            if (index === -1) {
                this.nodeInfo.push(this.form)
                ElementFactory.updateCandidateUsers(false)
                if (this.defaultFormKey != null && this.defaultFormKey !== '') {
                    ElementFactory.updateFormKey(this.defaultFormKey)
                }
                ElementFactory.updateCategory('2')
            }
            this.form.name = nodeData.name || ''
            this.form.activityId = nodeData.id || ''
            this.form.formKey = nodeData.formKey || ''
            if (nodeData.extensionElements && nodeData.extensionElements.values) {
                this.listener = {
                    class: nodeData.extensionElements.values[0].class || '',
                    event: nodeData.extensionElements.values[0].event || ''
                }
            } else {
                this.listener = {
                    class: '',
                    event: 'start'
                }
                ElementFactory.createElement('activiti:ExecutionListener', this.executionListener)
                ElementFactory.createElement('activiti:TaskListener', this.taskListener)
            }
        },

        clearUserPage (item) {
            let id = []
            let strName = ''
            if (item && item.length > 0) {
                item.forEach(res => {
                    id.push(res.id)
                    strName += res.name + ','
                })
            }
            if (this.isAuditman) {
                this.form.candidates = JSON.stringify(id)
                this.form.candidatesName = strName.substring(0, strName.length - 1)
                this.isAuditman = false
            } else if (this.isCopire) {
                this.form.copiers = JSON.stringify(id)
                this.form.copiersName = strName.substring(0,  strName.length - 1)
                this.isCopire = false
            }
        },

        reset () {
            this.form = {
                name: '',
                activityId: '',
                candidates: '',
                candidatesName: '',
                copier: '',
                msg: '',
                copiers: '',
                copiersName: '',
                date2: '',
                operation: [],
                setting: [],
                timingType: '1',
                timingContent: '',
                sendBackNode: '',
                duration: 0,
                remindCount: 1,
                intervalTime: 0,
                skipNode: '',
                formKey: '',
                monitorData: null
            },
            this.isShowTime = false,
            this.isShow = false
        },

        getBpmnModules () {
            let data = {
                id: 'usertask1',
                name: '申请人'
            }
            this.skipNodeNode = []
            this.fallbackNode = []
            this.elementRegistry = ElementFactory.getCurrentNodePrepositionNode ()
            if (this.elementRegistry && this.elementRegistry.dataList && this.elementRegistry.dataList.length > 0) {
                
                this.elementRegistry.dataList.forEach (res => {
                    if (res) {
                        this.skipNodeNode.push (res['businessObject'])
                    }
                })
                
            }
            
            if (this.elementRegistry && this.elementRegistry.prepositionNode && this.elementRegistry.prepositionNode.length > 0) {

                this.elementRegistry.prepositionNode.forEach (res => {
                    if (res) {
                        this.fallbackNode.push (res['businessObject'])
                    }
                })
            }
            this.skipNodeNode.unshift (data)
            this.fallbackNode.unshift (data)
        },

        closeFun () {
            this.isAuditman = false
            this.isCopire = false
        },

        getAllFromByBases () {
            getAllFromByBase ({'code': this.defaultFormKey}).then (res => {
                if (res && res.length > 0) {
                    this.options = res
                }
            })
        }
    },

    components: {
        'form-binding': FormBinding,
        'monitor-binding': MonitorBinding,
        'qqt-input': qqtInput,
        'qqt-checkbox': qqtCheckbox,
        'qqt-select': qqtSelect,
        'qqt-inputNumber': qqtInputNumber,
        'qqt-radio': qqtRadio,
        'user-modules': UserModules
    },

    created () {
        this.updateDefaultData ()
        this.getBpmnModules (),
        this.getAllFromByBases ()
    },

    watch: {
        
        nodeId () {
            this.updateDefaultData()
        },

        nodeData () {
            this.getBpmnModules ()
        }
    },

    computed: {
        ...mapState ('d2admin/processDefinition', [
            'nodeData'
        ])
    }
}
</script>

<style lang="scss">
    .user-task {
        .toRight {
            padding-left: 40px;

                .showTime {
                    width: 88%;
                    margin-right: 10px;
                    display: inline-block;
                }

                .inputNumber {
                    display: inline-block;
                }

                .dataTimeList {
                    display: inline-block;
                    width: 70px;
                    margin-left: 5px;
                }
                
                .interval {
                    display: inline-block;
                    margin-right: 10px;
                    width: 88%;
                }
        }
        .information{
            padding: 15px 0;
        }
        .el-input__inner {
            border-radius: 0px !important
        }
    }
</style>
