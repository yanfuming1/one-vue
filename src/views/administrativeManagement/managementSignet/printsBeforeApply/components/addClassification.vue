<template>
    <el-dialog v-dialogDrag :visible="dialogVisible" title="拓展字段" width="35%" :before-close="handleClose">
        <fm-generate-form :data="jsonData" :remote="remote" :value="values" ref="generateForm"></fm-generate-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="saveClassification">保 存</el-button>
            <el-button @click="$emit('close')">取 消</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { formGetJson } from '../../../../../api/system/fromManagement/index'
import { addManagementSignetTree, editManagementSignetTree, getManagementSignetTreeById } from '../../../../../api/administrativeManagement/sealClassification'
import { ADMINISTRATIVEMANAGEMENT } from '../../../../../enum/FORMCODE'

let than = this
export default {
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        managementSignetTreeId: {
            type: String,
            default: () => ''
        }
    },
    data () {
        return {
            jsonData: {},
            values: {},
            remote: {}
        }
    },

    methods: {

        handleClose () {
            this.$emit('close')
        },

        getFormByJson () {
            formGetJson ({'code': ADMINISTRATIVEMANAGEMENT.SEALCLASSIFICATION}).then(res => {
                if (res) {
                    this.jsonData = JSON.parse(res)
                }
            })
        },

        saveClassification () {
            this.$refs.generateForm.getData ().then(item => {
                if (this.values.id == null) {
                    addManagementSignetTree (item).then(res => {
                        if (res.code === 200) {
                            this.$message.success ('操作成功')
                            this.$emit('close', true)
                        }
                    })
                } else {
                    item['id'] = this.values.id
                    editManagementSignetTree (item).then(res => {
                        if (res.code === 200) {
                            this.$message.success ('操作成功')
                            this.$emit('close', true)
                        }
                    })
                }
            })
        },

        getManagementSignetTreeByIdData (id) {
            getManagementSignetTreeById ({'id': id}).then (res =>{
                if (res) {
                    this.values = res
                }
            })
        }
    },

    created () {
        this.getFormByJson ()
        if (this.managementSignetTreeId != '') {
            this.getManagementSignetTreeByIdData (this.managementSignetTreeId)
        }
    },
}
</script>

<style lang='scss' scoped>

</style>
