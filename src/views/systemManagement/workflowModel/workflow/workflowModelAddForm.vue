<template>
    <el-row>
        <el-form ref="form" :model="data" :rules="rules" label-width="90px" size="medium">
            <el-col :span="24">
                <el-form-item label="流程名称:" prop="name">
                    <qqt-input :value="data.name" :placeholder="'请输入流程名称'" @input="data.name = $event"></qqt-input>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="流程分类:" prop="groupId">
                    <qqt-select :value="data.groupId" :placeholder="'请选择流程分类'" :defaultProp="defaultProp" :options="options" @select="data.groupId = $event"></qqt-select>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="绑定单据:" prop="formKey">
                    <qqt-cascader
                        :placeholder="'请选择绑定单据'"
                        :value="data.formId"
                        :options="formOptions"
                        :defaultParams="formKeyParams"
                        :filterable="true"
                        @cascaded="data.formId = $event, data.formKey = $event[$event.length - 1]"
                    >
                    </qqt-cascader>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="授权对象:" prop="startCrewName">
                    <qqt-input :value="data.startCrewName" :readonly="readonly" :placeholder="'请选择授权对象'" @btnClick="$emit('showUserDepartModules')" :btnTitle="btnTitle"></qqt-input>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="状态:">
                    <qqt-radio :value="data.status" :options="statusList" @radio="data.status = $event"></qqt-radio>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="创建人:">
                    <qqt-input :value="data.createdName" :isShowElement="false" :placeholder="'自动生成'"></qqt-input>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="工作单位:" prop="companyId">
                    <qqt-select :value="data.companyId" :placeholder="'请选择工作单位'" :defaultProp="defaultProp" :options="companyList" @select="selectGenerateChange ($event, 1)"></qqt-select>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="工作部门:" prop="departmentId">
                    <qqt-select :value="data.departmentId" :placeholder="'请选择工作部门'" :defaultProp="defaultProp" :options="departmentList" @select="selectGenerateChange ($event, 2)"></qqt-select>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="创建时间:">
                    <qqt-input :value="data.createdTime" :isShowElement="false" :placeholder="'自动生成'"></qqt-input>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="说明:">
                    <qqt-input :value="data.remark" :rows="'2'" :type="'textarea'" @input="data.remark = $event" ></qqt-input>
                </el-form-item>
            </el-col>
            <el-col :span="24" class="workflow-model-page-drawer___button">
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">确认</el-button>
                    <el-button @click="close">取消</el-button>
                </el-form-item>
            </el-col>
        </el-form>
    </el-row>
</template>

<script>
import { qqtInput, qqtCascader, qqtRadio, qqtSelect } from '../../../../components/qqt-subassembly'
import { getOrganizationByCompanyId, getCompanyByUserId } from '@/api/system/depart/depart'

import util from '@/libs/util.js'
export default {
    props: {
        statusList: Array,
        formOptions: Array,
        departTreeList: Array,
        options:Array,
        wrokflowFrom: {
            type: Object,
            default: () => {}
        },
        defaultProp: {
            type: Object,
            default: () => {} 
        },
        defaultParams: {
            type: Object,
            default: () => {}
        },
        formProp: {
            type: Object,
            default: () => {}
        },
        readonly: {
            type: Boolean,
            default: () => false
        },
        btnTitle: String
    },

    data () {
        return {
            data: this.wrokflowFrom,
            rules: {
                name: [
                    { required: true, message: '流程名称不能为空', trigger: 'blur' },
                ],
                groupId: [
                    { required: true, message: '流程分类不能为空', trigger: 'change' }
                ],
                formKey: [
                    { required: true, message: '绑定单据不能为空', trigger: 'change' },
                ],
                startCrewName: [
                    { required: true, message: '授权对象不能为空', trigger: 'change' },
                ],
                companyId: [
                    { required: true, message: '工作单位不能为空', trigger: 'change' }
                ],
                departmentId: [
                    { required: true, message: '工作部门不能为空', trigger: 'change' }
                ]
            },
            formKeyParams: {
                label: 'name',
                value: 'code',
                children: 'fromManageList',
            },
            companyList: [],
            departmentList: []
        }
    },

    methods: {
        onSubmit () {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.$emit ('addFromData', JSON.parse (JSON.stringify (this.data)))
                }
            })
        },

        getCompanyByUserIdList (id) {
            getCompanyByUserId ({'userId': id}).then (res => {
                if (res && res.length > 0) this.companyList = res
                if (res.length == 1) this.data['companyId'] = res[0].id, this.data['companyName'] = res[0].name, this.getDepIdByCompanyIdList (res[0].id, id)
            })
        },

        getDepIdByCompanyIdList (id, userId) {
            getOrganizationByCompanyId({'id': id, 'userId': userId}).then(res => {
                if (res && res.length > 0) this.departmentList = res
                if (res.length == 1) this.data['departmentId'] = res[0].id, this.data['departmentName'] = res[0].name
            })
        },

        selectGenerateChange (val, num) {
            let item = '', str = ''
            switch (num) {
                case 2:
                    this.data.departmentId = val
                    item = this.departmentList.find (f => f.id === val)
                    if (item) this.data['departmentName'] = item.name
                    break
                case 1:
                    this.data.companyId = val
                    this.data.departmentId = ''
                    item = this.companyList.find (f => f.id === val)
                    if (item) this.data['companyName'] = item.name
                    this.getDepIdByCompanyIdList (val, util.cookies.get ('uuid'))
                    break
            }
        },

        close () {
            this.$emit ('close')
        }
    },

    created () {
        this.getCompanyByUserIdList (util.cookies.get ('uuid'))
    },

    watch: {
        wrokflowFrom () {
            this.data = this.wrokflowFrom
            this.$set (this.data, 'createdTime', util.cookies.get ('username'))
        },

        departTreeList: {
            deep: true,
            handler (val) {
                this.departTreeList = val
            }
        }
    },

    components: {
        'qqt-input': qqtInput,
        'qqt-cascader': qqtCascader,
        'qqt-radio': qqtRadio,
        'qqt-select': qqtSelect
    }
}
</script>

<style lang='scss' scoped>
    .workflow-model-page-drawer___button {
        text-align: center;
        margin-left: -20px;
        button {
            height: 30px;
            padding: 6px 10px;
            .el-button--primary {
                background-color: $color-button-dialog-affirm
            }
        }
    }
    .el-drawer__body > * {
        padding: 20px
    }
</style>
