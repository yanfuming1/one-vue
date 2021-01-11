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
import { addQualityType, editQualityType, getQualityTypeById } from '@/api/selfProject/qualityManagement/qualityStandard'
import { formGetJson } from '@/api/system/fromManagement/index'
import { PROPRIETARYPROJECT } from '@/enum/FORMCODE'

export default {

    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },

        treeId: {
            type: String,
            default: () => ''
        },

        isAdd: {
            type: Boolean,
            default: () => true
        },

        projectCode: {
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
            formGetJson ({'code': PROPRIETARYPROJECT.QUALITYTYPE}).then(res => {
                if (res) this.jsonData = JSON.parse(res)
            })
        },

        saveClassification () {
            this.$refs.generateForm.getData ().then(item => {
                let url = ''
                item['projectCode'] = this.projectCode
                this.values.id == null ? (url = addQualityType, item['parentId'] = this.treeId ? this.treeId : '0') : url = editQualityType, item['id'] = this.values.id
                url (item).then(res => {
                    if (res.code === 200) {
                        this.$message.success ('操作成功')
                        this.$emit('close', true)
                    }
                })
            })
        },

        getQualityTypeTreeById (id) {
            getQualityTypeById ({'id': id}).then (res =>{
                if (res) this.values = res
            })
        }
    },

    created () {
        this.getFormByJson ()
        if (this.treeId != '' && !this.isAdd) {
            this.getQualityTypeTreeById (this.treeId)
        }
    },
}
</script>
