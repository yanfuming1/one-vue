<template>
    <div class="position-management-details">
        <div class="position-management-details-header">
            <p>{{ btnHeader }}</p>
            <!-- <i class="el-icon-edit" @click="isShowElement = true">修改</i> -->
        </div>
        <div class="position-management-details-center">
             <el-row>
                <el-form ref="form" :model="positionManagementDetailsForm" label-width="120px" >
                    <el-col :span="12">
                        <el-form-item label="上级名称:">
                            <qqt-cascader
                                :value="positionManagementDetailsForm.superiorId"
                                :options="options"
                                :defaultParams="defaultParams"
                                :isShowElement="isShowElement"
                                :id="positionManagementDetailsForm.id"
                                :superiorName="positionManagementDetailsForm.superiorName"
                                @cascaded="positionManagementDetailsForm.superiorId = $event"
                            >
                            </qqt-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="本级名称:">
                            <qqt-input :value="positionManagementDetailsForm.name"  :placeholder="'请输入职位（岗位）名称'" :isShowElement="isShowElement" @input="positionManagementDetailsForm.name = $event"></qqt-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="状态:">
                            <qqt-radior :value="positionManagementDetailsForm.isUse" :options="typeList" :isShowElement="isShowElement" @radio="positionManagementDetailsForm.isUse = $event"></qqt-radior>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="职务(岗位)描述:">
                            <qqt-input :type="'textarea'" :value="positionManagementDetailsForm.describes" :placeholder="'可输入职位描述'" :isShowElement="isShowElement" @input="positionManagementDetailsForm.describes = $event"></qqt-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" class="position-management-details___button">
                        <el-form-item v-if="isShowElement">
                            <el-button type="primary" @click="onSubmit">确认</el-button>
                            <el-button @click="isShowElement = false, $emit('refresList')">取消</el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
        </div>
    </div>
</template>

<script>
    import { qqtInput, qqtInputNumber, qqtCascader, qqtRadio } from '../../../../components/qqt-subassembly'
    import { updatePositionManagement, addPositionManagement } from '../../../../api/system/positionManagement'
    export default {
        name: 'positionManagementDetails',
        props: {
            options: Array,
            data: Object,
            btnHeader: String,
            isShowDetails: Boolean
        },
        data () {
            return {
                positionManagementDetailsForm: {
                    id: '',
                    name: '',
                    rank: 1,
                    isUse: '1',
                    describes: '',
                    parentId: '',
                    readonly: false,
                    superiorId: [],
                    superiorName: '',
                },
                isShowElement: false,
                defaultParams: {
                    label: 'name',
                    value: 'id',
                    children: 'children',
                    checkStrictly: true
                },
                typeList: [
                    {
                        value: '1',
                        label: '启用'
                    },
                    {
                        value: '0',
                        label: '禁用'
                    }
                ]
            }
        },
        methods: {

            updateData () {
                this.positionManagementDetailsForm = this.data
                if (this.data && this.data.isEditor === true) {
                    this.isShowElement = true
                }
            },

            onSubmit () {
                this.positionManagementDetailsForm.parentId = this.positionManagementDetailsForm.superiorId[this.positionManagementDetailsForm.superiorId.length - 1]
                if (this.positionManagementDetailsForm && this.positionManagementDetailsForm.isEditor === true) {
                    this.positionManagementDetailsForm.id = ''
                    addPositionManagement (this.positionManagementDetailsForm).then(res => {
                        if (res.code === 200) {
                            this.$message.success('添加成功')
                            this.isShowElement = !this.isShowElement
                            this.$emit('refresList', this.positionManagementDetailsForm)
                        }
                    })
                } else {
                    updatePositionManagement (this.positionManagementDetailsForm).then(res => {
                        if (res.code === 200) {
                            this.$message.success('修改成功')
                            this.isShowElement = !this.isShowElement
                            this.$emit('refresList')
                        }
                    })
                }
            }
        },

        watch: {
            data () {
                this.updateData()
            },

            isShowDetails (val) {
                this.isShowElement = !val
            }
        },

        components: {
            'qqt-input': qqtInput,
            'qqt-input-number': qqtInputNumber,
            'qqt-cascader': qqtCascader,
            'qqt-radior': qqtRadio
        }
    }
</script>

<style lang="scss" scoped>
    .position-management-details {
        padding: 10px 0;
        .position-management-details-header {
            border-bottom: 1px solid $color-straight-line3;
            height: 45px;
            line-height: 45px;
            p {
                display: inline-block;
                padding-left: 15px;
                font-size: 16px;
            }
            i {
                float: right;
                padding-right: 13px;
                padding-top: 15px;
                font-size: 15px;
                color: $color-button-typeface2;
            }
        }
        .position-management-details-center {
            padding: 20px;
            .el-row {
                height: 50px;
                line-height: 50px;
            }
            label {
                font-size: 15px;

                font-weight: 400;
            }
            .position-management-details___button {
                text-align: center;
                button {
                    height: 30px;
                    padding: 6px 10px;
                }
                margin-left: -80px;
            }
        }
    }
</style>
