<template>
    <el-dialog v-dialogDrag :visible="dialogVisible" title="添加拓展字段" width="35%" :before-close="handleClose">
        <fm-generate-form :data="jsonData" :remote="remote" :value="values" ref="generateForm"></fm-generate-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="saveCustomerDictionary">确 定</el-button>
            <el-button @click="$emit('change')">取 消</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { formGetJson } from '../../../../api/system/fromManagement/index'
import { addCustomerDictionary, updataCustomerDictionary, getCustomerDictionaryQueryById } from '../../../../api/customerManagement/expandInformation'
import { CUSTOMERAUTHORIZATIONFORM } from '../../../../enum/FORMCODE'
import { CUSTOMERAUTHORIZATION } from '../../../../enum/DICTIONARY'
import { mapState, mapActions } from 'vuex'

let than = this
export default {
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        isEdit: {
            type: Boolean,
            default: true
        },
        data: {
            type: Object,
            default: () => {
                return {
                    id: ''
                }
            }
        },
        expandInformation: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            jsonData: {},
            fatherData: JSON.parse(JSON.stringify(this.data)),
            values: {},
            remote: {}
        }
    },

    methods: {

        ...mapActions ('d2admin/customer/', [
            'remoteFuncsSet'
        ]),

        handleClose () {
            this.$emit('change')
        },

        getFormByJson () {
            formGetJson ({'code': CUSTOMERAUTHORIZATIONFORM.ADDEXPANDINFORMATION}).then(res => {
                if (res) {
                    this.jsonData = JSON.parse(res)
                }
            })
        },

        saveCustomerDictionary () {
            this.$refs.generateForm.getData ().then(item => {
                if (this.isEdit) {
                    addCustomerDictionary (item).then(res => {
                        if (res.code === 200) {
                            this.$message.success ('操作成功')
                            this.getCustomerDictionary (item.parentId)
                        }
                    })
                } else {
                    this.fatherData.parentId = item.parentId
                    this.fatherData.proName = item.proName
                    updataCustomerDictionary (this.fatherData).then(res => {
                        if (res.code === 200) {
                            this.$message.success ('操作成功')
                            this.getCustomerDictionary (item.parentId)
                            this.$emit('change')
                        }
                    })
                }
            })
        },

        getCustomerDictionary (id) {
            getCustomerDictionaryQueryById ({
                'id': id,
                'pageNo': '1',
                'pageSize': '100'
                }).then (res => {
                if (res && res.records.length > 0) {
                    switch (id) {
                        // 客户状态
                        case CUSTOMERAUTHORIZATION.CUSTOMERSTATUS:
                            this.remoteFuncs.customerOptions = res.records
                            break
                        // 客户等级
                        case CUSTOMERAUTHORIZATION.CLIENTGRADE:
                            this.remoteFuncs.clientGradeOptions = res.records
                            break
                         // 行业类别
                        case CUSTOMERAUTHORIZATION.INDUSTRYCATEGORY:
                            this.remoteFuncs.industryCategory = res.records
                            break
                        // 项目管理水平
                        case CUSTOMERAUTHORIZATION.PROJECTMANAGEMENTLEVEL:
                            this.remoteFuncs.projectManagementLevel = res.records
                            break
                        // 客户资质
                        case CUSTOMERAUTHORIZATION.CUSTOMERQUALIFICATION:
                            this.remoteFuncs.customerQualification = res.records
                            break
                        case CUSTOMERAUTHORIZATION.CUSTOMERTYPE:
                            this.remoteFuncs.customerType = res.records
                            break
                        case CUSTOMERAUTHORIZATION.CHARATERCUSTOMER:
                            this.remoteFuncs.charaterCustomer = res.records
                            break
                        case CUSTOMERAUTHORIZATION.CUSTOMERSOURCE:
                            this.remoteFuncs.customerSource = res.records
                            break
                        case CUSTOMERAUTHORIZATION.CONTACTTYPE:
                            this.remoteFuncs.contactType = res.records
                            break
                    }
                    let item = this.remoteFuncs
                    this.remoteFuncsSet ({ item })
                    this.$emit('change')
                }
            }) 
        },

        selectDefaultData (data) {
            this.remote = {
                getExpandInformationNode (resolve) {
                    resolve (data)
                }
            }
        }
    },

    created () {
        this.$store.dispatch ('d2admin/customer/remoteFuncsLoad')
        this.getFormByJson ()
    },

    mounted () {
        than = this
    },

    computed: {
        ...mapState('d2admin/customer', [
            'remoteFuncs'
        ])
    },

    watch: {
        data (val) {
            this.fatherData = JSON.parse(JSON.stringify(val))
            if (this.isEdit) {
                this.values = {
                    'parentId': this.fatherData.id,
                    'proName': ''
                }
            } else {
                this.values = {
                    'parentId': this.fatherData.parentId,
                    'proName': this.fatherData.proName
                }
            }
            this.$nextTick (()=> {
                this.$refs.generateForm.clearValidate ('proName')
            })
        },

        remoteFuncs () {
            this.selectDefaultData (this.remoteFuncs['expandInformation'])
        },

        expandInformation () {
            this.selectDefaultData (this.expandInformation)
        }
    }
}
</script>

<style lang='scss' scoped>

</style>
