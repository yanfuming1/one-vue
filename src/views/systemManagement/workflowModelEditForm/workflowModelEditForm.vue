<template>
    <d2-container type="fulls">
        <div class="qqt-container-full-center___details">
            <el-form ref="form" :model="workflowInfo" label-width="130px" size="medium">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="流程名称:">
                            <qqt-input :value="workflowInfo.data.name" :isShowElement="isShowElement" :placeholder="'请输入流程名称'" @input="workflowInfo.data.name = $event"></qqt-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="流程分类:">
                            <qqt-select :value="workflowInfo.data.groupId" :isShowElement="isShowElement" :placeholder="'请选择流程分类'" :defaultProp="workflowInfo.defaultProp" :options="workflowInfo.options" @select="workflowInfo.data.groupId = $event"></qqt-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="绑定单据:">
                            <qqt-cascader
                                v-model="workflowInfo.data.formId"
                                :value="workflowInfo.data.formId"
                                :options="workflowInfo.formOptions"
                                :isShowElement="isShowElement"
                                :defaultParams="workflowInfo.formKeyParams"
                                :filterable="true"
                                @cascaded="workflowInfo.data.formId = $event, workflowInfo.data.formKey = $event[$event.length - 1]"
                            >
                            </qqt-cascader>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="授权对象:">
                            <qqt-input v-model="workflowInfo.data.startCrewName" :isShowElement="isShowElement" :value="workflowInfo.data.startCrewName" :readonly="workflowInfo.readonly" :placeholder="'请选择授权对象'" @btnClick="showUserDepartModules" @input="workflowInfo.data.startCrewName = $event" :btnTitle="workflowInfo.btnTitle"></qqt-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="状态:">
                            <qqt-radio :value="workflowInfo.data.status" :isShowElement="isShowElement" :options="workflowInfo.statusList" @radio="workflowInfo.data.status = $event"></qqt-radio>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-col :span="24">
                    <el-form-item label="说明:">
                        <qqt-input :value="workflowInfo.data.remark" :isShowElement="isShowElement" :rows="'2'" :type="'textarea'" @input="workflowInfo.data.remark = $event" ></qqt-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="创建人:">
                        <qqt-input :value="workflowInfo.data.createdName" :isShowElement="false" :placeholder="'自动生成'"></qqt-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="工作单位:" prop="companyId">
                        <qqt-select :value="workflowInfo.data.companyId" :isShowElement="isShowElement" :placeholder="'请选择工作单位'" :defaultProp="workflowInfo.defaultProp" :options="companyList" @select="selectGenerateChange ($event, 1)"></qqt-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="工作部门:" prop="departmentId">
                        <qqt-select :value="workflowInfo.data.departmentId" :isShowElement="isShowElement" :placeholder="'请选择工作部门'" :defaultProp="workflowInfo.defaultProp" :options="departmentList" @select="selectGenerateChange ($event, 2)"></qqt-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="创建时间:">
                        <qqt-input :value="workflowInfo.data.createdTime" :isShowElement="false" :placeholder="'自动生成'"></qqt-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <div class="workflow-model">
                        <p> 流程图 </p>
                        <div class="workflow-model-png">
                            <qqt-flow-diagram :flowDiagram="flowDiagram" :isProcessInstance="isProcessInstance"></qqt-flow-diagram>
                        </div>
                    </div> 
                </el-col>
                <el-col :span="24">
                        <div class="workflowModelEditForm___button">
                        <el-button type="primary" v-if="isShowElement" @click="onSubmit">确认</el-button>
                        <el-button @click="closeTag">关闭</el-button>
                    </div>
                </el-col>
            </el-form>
        </div>
        <user-modules :showDialog="isShow" :userIds="user" :department="department" :role="role" :startCrew="workflowInfo.data.startCrew" @clearUserPage="clearUserPage" @closeFun="isShow = false"></user-modules>
    </d2-container>
</template>

<script>
import { qqtInput, qqtCascader, qqtRadio, qqtSelect, qqtFlowDiagram } from '../../../components/qqt-subassembly'
import userModules from '../processDefinition/processModules/userModules'
import { updateModelSynopsisSuspend, getModelSynopsisIdByDetails, getWorkflowTree } from '../../../api/system/workflow'
import { getOrganizationByCompanyId, getCompanyByUserId } from '@/api/system/depart/depart'
import { GetDepartTree } from '../../../api/system/depart/depart-tree'
import { getAllFromManageToTree } from '../../../api/system/fromManagement'
import { nodeInfoStartCrew } from '../../../api/officalDocument'
import { mapState, mapActions } from 'vuex'
export default {
    data () {
        return {
            isShow: false,
            isShowElement: false,
            isProcessInstance: false,
            user: [],
            role: [],
            department: [],
            companyList: [],
            flowDiagram: [],
            departmentList: [],
            workflowInfo: {
                options: [],
                readonly: true,
                departTreeList: [],
                btnTitle: '选择',
                data: {
                    name: '',
                    groupId: '',
                    organizationId: [],
                    formId: [],
                    fromKey: '',
                    startCrewName: '',
                    startCrew: [],
                    status: '',
                    remark: '',
                    companyId: '',
                    companyName: '',
                    departmentId: '',
                    departmentName: ''
                },
                defaultProp: {
                    value: 'id',
                    label: 'name'
                },
                defaultParams: {
                    label: 'name',
                    value: 'id',
                    children: 'child',
                    checkStrictly: true
                },
                statusList: [
                    {
                        value: '0',
                        label: '禁用'
                    },
                    {
                        value: '1',
                        label: '启用'
                    }
                ],
                formOptions: [],
                formKeyParams: {
                    label: 'name',
                    value: 'code',
                    children: 'fromManageList',
                },
            }
        }
    },

    methods: {
        ...mapActions('d2admin/page', [
            'close',
        ]),

        onSubmit () {
            let data = JSON.parse(JSON.stringify (this.workflowInfo.data))
            data.organizationId = JSON.stringify (data.organizationId)
            data.startCrew = JSON.stringify (data.startCrew)
            data.formId = JSON.stringify (data.formId)
            updateModelSynopsisSuspend (data).then(res => {
                if (res.code === 200) {
                    this.$message.success('修改成功')
                    this.closeTag ()
                }
            })
        },

        showUserDepartModules () {
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
                this.workflowInfo.data.startCrewName = str.substring(0, str.length - 1)
                this.workflowInfo.data.startCrew = strId
            }
        },

        getWorkflowDbData () {
            let item = ''
            let id = this.$route.query.id
            this.isShowElement = this.$route.query.isShowElement
            getModelSynopsisIdByDetails ({'id': id}).then(res => {
                if (res) {
                    if (res.pdfId) {
                        this.nodeInfoStartCrewData (res.pdfId)
                    }
                    let str = ''
                    if (res.startCrew) {
                        str = JSON.parse(res.startCrew)
                    }
                    if (str && str.length > 0) {
                        res['startCrew'] = str
                        str.forEach(element => {
                            if (element.indexOf ('U_') !== -1) {
                                this.user.push(element)
                            } else if (element.indexOf ('D_') !== -1) {
                                this.department.push(element)
                            } else if (element.indexOf ('R_') !== -1) {
                                this.role.push (element)
                            }
                        })
                        res['startCrewName'] = res['startCrewNames']
                    } else {
                        res.startCrew = []
                    }
                    if (res.organizationId !== '' && res.organizationId != null) {
                        res.organizationId = JSON.parse(res.organizationId)
                    } else {
                        res.organizationId = []
                    }
                    if (res.formId !== '' && res.formId != null) {
                        res.formId = JSON.parse(res.formId)
                    } else {
                        res.formId = []
                    }
                    this.getCompanyByUserIdList (res.createdBy)
                    this.workflowInfo.data = res
                }
            })
        },

        clearUserPage (item) {
            this.isShow = !this.isShow
            this.getDataModule(item)
        },

        getDepartTreeList () {
            let list = []
            GetDepartTree().then(res => {
                if (res) {
                    list.push(res)
                    this.workflowInfo.departTreeList = list
                }
            })
        },

        getWorkflowTreeList () {
            getWorkflowTree ().then(res => {
                if (res) {
                    this.getWorkflowDbData()
                    this.workflowInfo.options = res
                }
            })
        },

        getFormAll () {
            getAllFromManageToTree ().then (res => {
                if (res && res.length > 0) {
                    res.forEach (item => { item.code = item.dicCode })
                    this.workflowInfo.formOptions = res
                }
            })
        },

        selectGenerateChange (val, num) {
            let item = '', str = ''
            switch (num) {
                case 2:
                    this.workflowInfo.data.departmentId = val
                    item = this.departmentList.find (f => f.id === val)
                    if (item) this.workflowInfo.data['departmentName'] = item.name
                    break
                case 1:
                    this.workflowInfo.data.companyId = val
                    this.workflowInfo.data.departmentId = ''
                    item = this.companyList.find (f => f.id === val)
                    if (item) this.workflowInfo.data['companyName'] = item.name
                    this.getDepIdByCompanyIdList (val, this.workflowInfo.data.createdBy)
                    break
            }
        },

        nodeInfoStartCrewData (id) {
            this.flowDiagram = []
            nodeInfoStartCrew (id).then (res => {
                if (res && res.length > 0) {
                    this.flowDiagram = res
                }
            })
        },

        getCompanyByUserIdList (id) {
            getCompanyByUserId ({'userId': id}).then (res => {
                if (res && res.length > 0) this.companyList = res
                if (res.length == 1) this.data['companyId'] = res[0].id, this.data['companyName'] = res[0].name
                this.getDepIdByCompanyIdList (this.workflowInfo.data.companyId ? this.workflowInfo.data.companyId : false, id)
            })
        },

        getDepIdByCompanyIdList (id, userId) {
            if (!id) return
            getOrganizationByCompanyId({'id': id, 'userId': userId}).then(res => {
                if (res && res.length > 0) this.departmentList = res
                if (res.length == 1) this.data['departmentId'] = res[0].id, this.data['departmentName'] = res[0].name
            })
        },
        
        closeTag () {
            let query = `?id=${this.$route.query.id}&isShowElement=${this.$route.query.isShowElement}`
            let tagName = this.$route.path + query
            let path = 'workflowModel'
            this.close ({ tagName, path })
        }
    },

    components: {
        'qqt-input': qqtInput,
        'qqt-cascader': qqtCascader,
        'qqt-radio': qqtRadio,
        'qqt-select': qqtSelect,
        'user-modules': userModules,
        'qqt-flow-diagram': qqtFlowDiagram
    },

    created () {
        this.getDepartTreeList()
        this.getWorkflowTreeList()
        this.getFormAll ()
    },

    computed: {
        ...mapState('d2admin/allUser', [
            'allUser',
            'depart'
        ]),
        ...mapState('d2admin/allRole', [
            'data',
        ])
    }
}
</script>

<style lang='scss' scoped>
    
    .el-drawer__body > * {
        padding: 20px
    }
    .el-input-group__append {
        cursor: pointer;
    }
    .workflow-model {
        padding: 0 5px;
        p {
            font-size: 14px
        }
        .workflow-model-png {
            border: 1px solid $color-straight-line;
            padding: 70px 0;
            overflow: auto;
        }
    }
    .workflowModelEditForm___button {
        text-align: center;
        padding-top: 20px;
        button {
            height: 30px;
            padding: 6px 10px
        }
    }
</style>
