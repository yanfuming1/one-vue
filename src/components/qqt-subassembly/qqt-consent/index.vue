<template>
    <el-dialog v-dialogDrag :visible="dialogVisible" class="qqt-consent-dialog" :title="title" width="40%" :before-close="handleClose">
        <el-row>
            <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                <el-col :span="24">
                    <el-form-item label="驳回节点" prop="activityId" v-if="isReject">
                        <el-select v-model="form.activityId" clearable style="width: 100%">
                            <el-option v-for="item in returnList"
                                :key="item.activityId"
                                :label="item.name"
                                :value="item.activityId"
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="转办给" prop="turnManage" v-if="isTurnManage">
                        <el-input
                            v-model="form.turnManage"
                            :readonly="true"
                            @focus="getTurnManageData"
                            >
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="指定节点" v-if="type === '1' && authority && activity.length > 0">
                        <qqt-select :value="form.activityId" :options="activity" :defaultProp="activitiProp" @select="form.activityId = $event" />
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="指定审批人员" v-if="type === '1' && authority && activity.length > 0">
                        <qqt-cascader :value="form.candidates" :options="[depart]" :defaultParams="defaultCandidates" @cascaded="form.candidates = $event" />
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item :label="opinion" prop="msg">
                        <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="form.msg">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-row>
        <user-modules :showDialog='isShow' @clearUserPage="getDataModule" @closeFun="isShow=false"></user-modules>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="save">确 定</el-button>
            <el-button @click="$emit('close')">取 消</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import { mapState } from 'vuex'
    import { qqtSelect, qqtCascader } from '../../../components/qqt-subassembly'
    import { findReverseRoute, careOf } from '../../../api/approval/common'
    import { getFindWalkRoute } from '../../../api/officalDocument/index'
    import { staffListByDep } from '../../../api/system/staff/staff'
    import { accountManagementTree } from '../../../api/system/accountManagement/accountManagement'
    import userModules from '../../../views/systemManagement/processDefinition/processModules/userModules'
    let than = this
    export default {

        props: {
            title: {
                type: String,
                default: () => '审批信息'
            },
            
            type: {
                type: String,
                default: () => ''
            },

            taskId: {
                type: String,
                default: () => ''
            },

            dialogVisible: {
                type: Boolean,
                default: () => false
            },

            isReject: {
                type: Boolean,
                default: () => false
            },

            isTurnManage: {
                type: Boolean,
                default: () => false
            },

            isCommissioner: {
                type: Boolean,
                default: () => false
            },

            msg: {
                type: String,
                default: () => ''
            }
        },

        data () {
            return {
                form: {
                    msg: '',
                    activityId: '',
                    taskId: '',
                    turnManage: '',
                    candidates: [],
                },
                rules: {},
                depart: [],
                selectDepart: [],
                returnList: [],
                jsonData: {},
                isShow: false,
                activity: [],
                defaultCandidates: {
                    value: 'id',
                    label: 'name',
                    children: 'child',
                    lazy: true,
                    multiple: true,
                    lazyLoad (node, resolve) {
                        than.getlazyLoad (node, resolve)
                    }
                },
                activitiProp: {
                    value: 'activityId',
                    label: 'name'
                },
                opinion: '审批意见'
            }
        },

        methods: {

            handleClose () {
                this.$emit ('close')
            },
            
            save () {
                this.$refs.form.validate (valid => {
                    if (valid) {
                        let list = []
                        if (this.form.candidates.length > 0) this.form.candidates.forEach (res => {list.push (res[res.length-1])})
                        this.form.candidates = list
                        this.form['type'] = this.type
                        if (this.isTurnManage) {
                            this.jsonData['message'] = this.form.msg
                            this.saveCareOf (this.jsonData)
                        } else {
                            this.$emit ('close', this.form)
                        }
                    }
                })
            },

            getFindReverseRoute (taskId) {
                findReverseRoute (taskId).then (res => {
                    if (res) {
                        this.returnList = res
                    }
                })
            },

            getTurnManageData () {
                this.isShow = true
            },

            getDataModule (item) {
                let str = ''
                let strId = []
                this.isShow = false
                if (item.length > 0) {
                    item.forEach(res => {
                        str += res.name + ','
                        strId.push(res.id)
                    })
                    this.form.turnManage = str.substring(0, str.length - 1)
                    this.jsonData['candidateIds'] = strId
                }
            },

            saveCareOf (data) {
                careOf (this.taskId, data).then (res => {
                    if (res.code === 200) {
                        this.$emit ('close', '', true)
                    }
                })
            },

            getFindWalkRouterData (data) {
                getFindWalkRoute (data).then (res => {
                    if (res) {
                        this.activity = res
                    }
                })
            },

            updataRulesCheckInformation (data) {
                this.rules = {
                    turnManage: [
                        { required: true, message: '请选择转办人员或部门', trigger: 'change' }
                    ],
                    activityId: [
                        { required: true, message: '请选择驳回节点', trigger: 'change' }
                    ],
                    msg: [
                        { required: true, message: `${data}不能为空`, trigger: 'blur' }
                    ]
                }
            },

            getStaffByTree () {
                accountManagementTree ().then (res => {
                    if (res) this.depart = res
                })
            },

            getlazyLoad (node, resolve) {
                if (node && node.children.length > 0 ) {
                    this.getIterationDepart (node, [], [this.depart])
                    node.path.length == 1 ? resolve (this.selectDepart.child) : resolve ([])
                } else {
                    this.getStaffListByDep (node, resolve)
                }
            },

            getStaffListByDep (node, resolve) {
                staffListByDep ({'depId': node.value, 'pageNo': '1', 'pageSize': '1000'}).then (res => {
                    if (res && res.records.length > 0) {
                        this.getIterationDepart (node, res.records, [this.depart])
                        res.records.forEach (item => { 
                            item['leaf'] = item.id.indexOf ('U') != '-1'
                            resolve (res.records)
                        })
                    }
                })
            },

            getIterationDepart (node, list, depart, boolean = false) {
                if (boolean) return
                depart.forEach (res => {
                    let index = node.path.findIndex (f => f == res.id)
                    if (index === node.path.length -1) {
                        list.length > 0 ? res['child'] = list : this.selectDepart = res
                        boolean = true
                    } else {
                        if (res.child && res.child.length > 0) {
                            this.getIterationDepart (node, list, res.child, boolean)
                        }
                    }
                })
            }
        },

        created () {
            than = this
            this.getStaffByTree ()
            if (this.taskId) {
                this.form.taskId = this.taskId
                this.getFindReverseRoute (this.taskId)
                this.getFindWalkRouterData (this.taskId)
            }
            this.$store.dispatch ('d2admin/authority/get')
        },

        watch: {
            taskId (val) {
                if (val) {
                    this.form.taskId = val
                    this.getFindReverseRoute (val)
                    this.getFindWalkRouterData (val)
                }
            },

            type (val) {
                if (val) {
                    val == '1' ? this.form.msg = this.msg : this.form.msg = ''
                    val == '1' ? this.opinion = '审批意见' : val == '2' ? this.opinion = '驳回意见' :  val == '3' ? this.opinion = '作废原因' : this.opinion = '转办意见'
                    this.updataRulesCheckInformation (this.opinion)
                }
            },

            dialogVisible (val) {
                if (val) {
                    this.form.activityId = '';
                }
            }
        },

        components: {
            'user-modules': userModules,
            'qqt-select': qqtSelect,
            'qqt-cascader': qqtCascader
        },

        computed: {   
            ...mapState ('d2admin/authority', [
                'authority'
            ])
        },
    }
</script>

<style lang='scss'>
// .qqt-consent-dialog{ z-index: 2040 !important; }
</style>
