<template>
    <el-dialog v-dialogDrag :visible="dialog" :rules="rules" title="客户共享" width="30%" :before-close="handleClose">
        <el-form label-width="70px">
            <el-form-item label="用户:" prop="salesmanId">
                <qqt-select :value="salesmanId" :filterable="true" :options="allUser" :defaultProp="defaultProp" @select="getSalesmanId" />
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addCustomerShare">确 定</el-button>
            <el-button @click="$emit('close')">取 消</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import { mapState } from 'vuex'
    import { qqtSelect } from '../../../../components/qqt-subassembly'
    import { shareCustomeAttention } from '../../../../api/customerManagement/customerList'
    export default {

        props: {
            
            dialog: {
                type: Boolean,
                default: false
            },

            identification: {
                type: String,
                default: ''
            },

            essentialData: {
                type: Array,
                default: []
            }
        },

        data () {
            return {
                salesmanId: '',
                defaultProp: {
                    value: 'id',
                    label: 'name'
                },
                value: [],
                rules: {
                    salesmanId: [
                        { required: true, message: '请选择要共享的用户', trigger: 'change' }
                    ],
                }
            }
        },

        methods: {

            handleClose () {
                this.$emit ('close')
            },

            getSalesmanId (id) {
                this.value = []
                this.essentialData.forEach (res => {
                    let item = {cusId: res.id, salesmanId: id}
                    this.value.push (item)
                })
            },

            addCustomerShare () {
                shareCustomeAttention (this.value).then (res => {
                    if (res.code === 200) {
                        this.$message.success ('共享成功')
                        this.$emit ('close')
                    }
                }) 
            }
        },

        computed: {
            ...mapState ('d2admin/allUser', [
                'allUser'
            ])
        },

        components: {
            'qqt-select': qqtSelect
        }
    }
</script>

<style lang='scss' scoped>

</style>
