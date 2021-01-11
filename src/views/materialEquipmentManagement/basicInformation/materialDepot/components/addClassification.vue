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
import { addMaterialDepotTree, editMaterialDepotTree, getMaterialDepotTreeById } from '../../../../../api/materialEquipmentManagement/basicInformation/materialDepot'
import { ADMINISTRATIVEMANAGEMENT } from '../../../../../enum/FORMCODE'

let than = this
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
            default: () => false
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
                if (res) this.jsonData = JSON.parse(res)
            })
        },

        saveClassification () {
            this.$refs.generateForm.getData ().then(item => {
                let url = ''
                this.values.id == null ? ( url = addMaterialDepotTree, item['parentId'] = this.treeId ? this.treeId : '0') : url = editMaterialDepotTree, item['id'] = this.values.id
                url (item).then(res => {
                    if (res.code === 200) {
                        this.$message.success ('操作成功')
                        this.$emit('close', true)
                    }
                })
            })
        },

        getMaterialDepotTreeByIdData (id) {
            getMaterialDepotTreeById ({'id': id}).then (res =>{
                if (res) this.values = res
            })
        }
    },

    created () {
        this.getFormByJson ()
        if (this.treeId != '' && !this.isAdd) {
            this.getMaterialDepotTreeByIdData (this.treeId)
        }
    },
}
</script>

<style lang='scss' scoped>

</style>
