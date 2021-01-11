<template>
    <div class="workflow-model-node">
        <!-- <div class="workflow-model-node-title">
            <i class="workflow-model-node-title___line"></i>
            <p>{{ title }}</p>
        </div> -->
        <div class="workflow-model-node-option">
            <div class="workflow-model-node-option-button" v-if="auth.add">
                <el-button type="primary" v-if="btnTitle" :icon="btnTitle.icon" @click="append">{{ btnTitle.name }}</el-button>
            </div>
            <div v-for="(data, index) of options" :key="index" ref="optionStyle" @click="getNodeData(data)">
                <div class="workflow-model-node-option-style" :class="{'backgroundColor-actice': data.isShow, 'backgroundColor-cancel': !data.isShow}">
                    <i class="el-icon-news" @click></i>                
                    <span @click>
                        {{ data.name }}
                    </span>
                </div>
                <div class="workflow-model-node-option-style-button" v-if="data.isActice">
                    <i class="el-icon-edit"  @click.stop = "() => updataData(data)" title="修改" v-if="auth.edit"></i>
                    <i class="el-icon-close" v-if="data.undeletable === '1' && auth.del" @click.stop = "() => remove(data)" title="删除"></i>
                </div>
            </div>
        </div>
        <div class="workflow-model-node-dialog">
            <el-dialog
                v-dialogDrag
                title="新建流程分组"
                :visible.sync="dialogVisible"
                width="30%">
                <div class="workflow-model-node-dialog___layout">
                    <el-form :model="workflow" :rules="rules" ref="workflow">
                        <el-form-item label="流程组名称:" prop="name" >
                            <qqt-input v-model="workflow.name" :value="workflow.name" autocomplete="off" @input="workflow.name = $event"></qqt-input>
                        </el-form-item>
                        <el-form-item label="是否启用:">
                            <qqt-radio v-model="workflow.status" :value="workflow.status" :options="workflowOptions" @radio="workflow.status = $event"></qqt-radio>
                        </el-form-item>
                        <el-form-item label="说明:">
                            <qqt-input v-model="workflow.remark" :value="workflow.remark" :type="'textarea'" @input="workflow.remark = $event"></qqt-input>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submit('workflow')">确 定</el-button>
                    <el-button @click="dialogVisible = false">取 消</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { qqtInput, qqtRadio } from '../../../../components/qqt-subassembly'
import { UpdateWorkflowTreeNode, addWorkflowTreeNode, deleteWorkflowTreeNode } from '../../../../api/system/workflow'

import util from '@/libs/util.js'
export default {
    props: {
        options: Array,
        btnTitle: Object,
        title: String,
    },

    data () {
        return {
            dialogVisible: false,
            workflow: {
                id: '',
                name: '',
                status: '1',
                rank: '1',
                remark: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                ]
            },
            workflowOptions: [
                {
                    value: '1',
                    label: '是'
                },
                {
                    value: '0',
                    label: '否'
                },
            ],
            historicalData: '',
            auth: {
                add: false,
                edit: false,
                del: false
            }
        }
    },

    methods: {
        
        append () {
            this.dialogVisible = true
            this.workflow = {
                id: '',
                name: '',
                status: '1',
                rank: '1',
                remark: ''
            }
        },

        submit (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.workflow && this.workflow.id !== '') {
                        UpdateWorkflowTreeNode(this.workflow).then(result => {
                            if (result.code === 200) {
                                this.dialogVisible = false
                                this.$message.success('操作成功')
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        })
                    } else {
                        addWorkflowTreeNode(this.workflow).then(result => {
                            if (result.code === 200) {
                                this.dialogVisible = false
                                this.$emit('updateMetaData')
                                this.$message.success('操作成功')
                            }
                        })
                    }
                }
            });
        },

        getNodeData (item) {
            this.resetBackgroundColor(item, event)
            this.$emit('getNodeData', item)
        },

        resetBackgroundColor (item) {
            item['isActice'] = true
            item['isShow'] = true
            if (this.historicalData === '') {
                this.options[0]['isActice'] = false
                this.options[0]['isShow'] = false
            } else {
                this.historicalData['isActice'] = false
                this.historicalData['isShow'] = false
            }
            this.historicalData = item
        },
        
        remove (data) {
            util.confirm ().then (boolean => {
                if (boolean) {
                     deleteWorkflowTreeNode({'id': data.id}).then(result => {
                        if (result.code === 200) {
                            this.$emit('updateMetaData')
                            this.$message.success('操作成功')
                        }
                    })
                }
            })
        },

        updataData (data) {
            this.workflow = data,
            this.dialogVisible = true
        },

        // 验证权限
        _validationAuth () {
            this.auth.add = this.$has ('sys:workflow:add')
            this.auth.edit = this.$has('sys:workflow:edit')
            this.auth.del = this.$has('sys:workflow:del')
        },
    },

    created () {
        this._validationAuth ()
    },

    components: {
        'qqt-input': qqtInput,
        'qqt-radio': qqtRadio
    }
}
</script>

<style lang='scss' scoped>
    .workflow-model-node {
        padding: 10px;
        .workflow-model-node-title {
            font-weight: 500;
            border-bottom: 1px dashed transparent;
            height: 50px;
            line-height: 50px;
            padding-left: 5px;
            background: linear-gradient(white, white) padding-box, repeating-linear-gradient(-45deg, #dddddd 0, #dddddd 0.4em, white 0, white 0.7em);
            .workflow-model-node-title___line {
                border-left: 3px solid $color-vertical-line;
            }
            p {
                display: inline-block;
                padding-left: 15px;
                font-size: 16px;
            }
        }
        .workflow-model-node-option {
            padding: 15px 0;
            .workflow-model-node-option-button {
                margin-left: 20px;
                button {
                    padding: 5px 13px;
                    margin-left: -20px;
                    background: $color-button-typeface2;
                    margin-bottom: 10px;
                }
            }
            .workflow-model-node-option-style {
                cursor: pointer;
                height: 38px;
                line-height: 38px;
                width: 100%;
                padding-left: 15px;
                font-size: 14px;
            }
            .workflow-model-node-option-style-button {
                top: -27px;
                position: relative;
                float: right;
                i {
                    padding-right: 15px;
                    color: $color-button-typeface1;
                    cursor: pointer;
                    font-size: 20px
                }
            }
            .workflow-model-node-option-style:hover {
                background: $color-tree-hover
            }
        }
        .workflow-model-node-dialog {
            .workflow-model-node-dialog___layout {
                padding: 0 13px
            }
        }
    }
    .backgroundColor-actice {
        background: #d6e8ff !important
    }
    .backgroundColor-cancel {
        background: #ffffff
    }
</style>
