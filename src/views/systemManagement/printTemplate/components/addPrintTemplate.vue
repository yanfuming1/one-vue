<template>
    <el-dialog
        v-dialogDrag
        :title="transform.isShowDetails ? '模板详情' : '模板编辑'"
        :visible="dialogVisible"
        :before-close="handleClose"
        width="35%">
            <fm-generate-form 
                :data="jsonData"
                :remote="remote"
                :value="values"
                :transform="transform"
                ref="generateForm"
            />
            <span slot="footer" class="dialog-footer">
                <el-button size="small" v-if="!transform.isShowDetails" type="primary" @click="savePrintTemplate">确 定</el-button>
                <el-button size="small" @click="$emit ('close')">取 消</el-button>
            </span>
    </el-dialog>
</template>

<script>
    import { formGetJson } from '../../../../api/system/fromManagement/index'
    import { SYSTEMMANAGEMENT } from '../../../../enum/FORMCODE'
    import { addPrintTemplate, editPrintTemplate, getPrintTemplateQueryById } from '../../../../api/system/printTemplate'
    export default {

        props: {
            printTemplateId: '',
            dialogVisible: {
                type: Boolean,
                default: () => false
            },
            transform: {
                type: Object,
                default: () => {
                    return {
                        isShowDetails: false
                    }
                }
            }
        },

        data () {
            return {
                jsonData: {},
                remote: {
                    getType (resolve) {
                        resolve ([
                            {
                                value: '1',
                                label: '默认'
                            },
                            {
                                value: '2',
                                label: '用户自定义'
                            }
                        ])
                    }
                },
                values: {
                    type: '1'
                }
            }
        },

        methods: {

            handleClose () {
                this.$emit ('close')
            },

            getPrintTemplateFromJson () {
                formGetJson ({'code': SYSTEMMANAGEMENT.ADDPRINTTEMPLATE}).then (res => {
                    if (res) this.jsonData = JSON.parse (res)
                })
            },

            savePrintTemplate () {
                let url = ''
                this.$refs.generateForm.getData ().then (data => {
                    if (data) {
                        this.printTemplateId == '' ? url = addPrintTemplate : ( url = editPrintTemplate, data['id'] = this.printTemplateId )
                        url (data).then (res => {
                            if (res.code == 200) this.$message.success (res.message), this.$emit ('closeAndRefresh')
                        })
                    }
                })
            },

            getPrintTemplateById () {
                getPrintTemplateQueryById ({'id': this.printTemplateId}).then (res => {
                    if (res) this.values = res
                })
            }
        },

        created () {
            this.getPrintTemplateFromJson ()
            if (this.printTemplateId) {
                this.getPrintTemplateById ()
            }
        }
    }
</script>

<style lang='scss' scoped>
    
</style>
