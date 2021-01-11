<template>
    <el-dialog
        v-dialogDrag
        :visible="dialogVisible"
        :title="dialogTitle"
        width="40%"
        :before-close="handleClose">
        <fm-generate-form
            :data="jsonData"
            :remote="remote"
            :value="values"
            ref="generateForm"
            @on-change="selectGenerateChange"/>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="saveCustomerDictionary">确 定</el-button>
            <el-button  @click="$emit('change')">取 消</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import { mapState } from 'vuex'
    import { formGetJson } from '../../../../../api/system/fromManagement/index'
    import { addCapitalAccount, editCapitalAccount, capitalAccountList, getNotBoundList} from "../../../../../api/customerManagement/capitalAccount"
    import { CUSTOMERAUTHORIZATIONFORM } from '../../../../../enum/FORMCODE'
    let that = this
    export default {

        props: {
            dialogTitle: String,
            dialogVisible: {
                type: Boolean,
                default: false
            },
            isEdit: {
                type: Boolean,
                default: false
            },
            data: {
                type: Object,
                default: () => {}
            }
        },

        data () {
            return {
                title:'',
                values:{
                    accountname:'',
                    bank:'',
                    bankaccount:'',
                    taxregistration:'',
                    cell:'',
                    position:''
                },
                accountVal: '',
                jsonData: {},
                remote: {},
                Fundsaccount:{},
            }
        },

        methods: {

            handleClose () {
                that.$emit ('change')
            },

            getFormByJson () {
                formGetJson ({'code': CUSTOMERAUTHORIZATIONFORM.NEWACCOUNTINFORMATION}).then(res => {
                    if (res) {
                        let element = JSON.parse(res)
                        if (this.isEdit) {
                            element.list.forEach (item => {
                                item.columns[0].list[0].type = 'input'
                            })
                        }
                        this.jsonData = element
                    }
                })
            },

            getCapitalAccountList () {
                capitalAccountList({id: this.customerInfor.id}).then(res => {
                    if (res && res.length > 0) {
                        this.list = res
                    } else {
                        this.list = []
                        this.hasAccount = false
                    }
                })
            },

            getAccountList () {
                let list = []
                getNotBoundList ().then(res =>{
                    if (res && res.length > 0) {
                        res.forEach(element => { if (!element.associatesid) list.push (element) });
                        this.backNameArr = list
                        this.updataRemote ()
                    }
                })
            },

            saveCustomerDictionary () {
                this.$refs.generateForm.getData ().then (item => {
                    if (item) {
                        if (this.isEdit) {
                            item.id = this.values.id
                            editCapitalAccount (item).then (res => {
                                if (res.code === 200) {
                                    that.$message.success ("编辑成功")
                                    that.$emit ('change')
                                    this.getCapitalAccountList ()
                                }
                            })
                        } else {
                            // 添加
                            this.accountVal == this.values.account ? item.id = this.values.id : item.id = ''
                            
                            item['associatedId'] = this.customerInfor.id
                            addCapitalAccount (item).then (res => {
                                if (res.code === 200) {
                                    that.$message.success("添加成功")
                                    that.$emit ('change')
                                    this.getCapitalAccountList ()
                                }
                            })
                        }
                    }
                })
            },

             selectGenerateChange (field, val, models) {
                let item = '', str = ''
                switch (field) {
                    case 'name':
                        item = this.backNameArr.find (f => f.name === val)
                        if (item) {
                            const { id, linkman, name, openingBank, account, accountType, phone } = item
                            let data = { id, linkman, name, openingBank, account, accountType, phone }
                            this.accountVal = data.account
                            this.values = data
                        }
                        break
                    default:
                        this.values[field] = val
                        break
                    
                }
            },

            updataRemote () {
                this.remote = {
                    getName(resolve){
                        resolve(that.backNameArr) 
                    }
                }
            }
        },

        computed: {
            ...mapState('d2admin/customer', [
                'customerInfor',
            ])
        },

        created () {
            this.$store.dispatch ('d2admin/customer/identificationLoad')
            this.$store.dispatch ('d2admin/customer/customerInformationLoad')
            this.getFormByJson ()
            if (!this.isEdit) this.getAccountList ()
        },

        mounted () {
            that = this
            this.values = this.data
        },

        watch: {
            data (newVal, old) {
                this.values = newVal
            },

            $route (val) {
                if (val.path.indexOf('capitalAccount') !== -1) {
                    this.$store.dispatch ('d2admin/customer/customerInformationLoad')
                    this.$store.dispatch ('d2admin/customer/identificationSet', val.params.identification)
                }
            }
        }
    }
</script>


<style lang='scss' scoped>

</style>
