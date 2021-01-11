<template>
    <el-dialog v-dialogDrag :visible="dialogVisible" title="添加供应商评审" width="40%" :before-close="handleClose">
        <fm-generate-form :data="jsonData" :remote="remote" :value="value" ref="generateForm"></fm-generate-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="onSubmit">保 存</el-button>
            <el-button @click="$emit('close')">取 消</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import { formGetJson } from '../../../../../api/system/fromManagement/index'
    import { MATERIALEQUIPMENTMANAGEMENT } from '../../../../../enum/FORMCODE'
    import { addSupplierParticulars } from '../../../../../api/materialEquipmentManagement/supplierManagement/supplierCreditRating'
    export default {
        props: {
            dialogVisible: {
                type: Boolean,
                default: () => false
            },

            data: {
                type: Object,
                default: () => {}
            }
        },
        data () {
            return {
                jsonData: {},
                remote: {
                    getCreditscore (resolve) {
                        resolve ([
                            {
                                value: '5',
                                label: '优秀'
                            },
                            {
                                value: '4',
                                label: '良好'
                            },
                            {
                                value: '3',
                                label: '一般'
                            },
                            {
                                value: '2',
                                label: '差'
                            },
                            {
                                value: '1',
                                label: '极差'
                            },
                        ])
                    }
                },
                value: {}
            }
        },

        methods: {

            handleClose () {
                this.$emit ('close')
            },

            getFormByJson () {
                formGetJson ({'code': MATERIALEQUIPMENTMANAGEMENT.ADDSUPPLIERCREDITRATING}).then(res => {
                    if (res) this.jsonData = JSON.parse(res)
                })
            },

            onSubmit () {
                this.$refs.generateForm.getData ().then(item => {
                    if (item) {
                        item['supplierId'] = this.data.id
                        addSupplierParticulars (item).then(res => {
                            if (res.code === 200) this.$message.success ('保存成功'), this.$emit ('close', true)
                        })
                    }
                })
            }
        },

        created () {
            const { nameSupplier, supplierCategory, supplierCode, supplierNature } = this.data
            this.value = { nameSupplier, supplierCategory, supplierCode, supplierNature }
            this.getFormByJson ()
        }
    }
</script>
