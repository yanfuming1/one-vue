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
            @on-change="onChange"/>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="confirmTransferEven">确 定</el-button>
            <el-button  @click="$emit('change')">取 消</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import { mapState } from 'vuex'
    import { formGetJson } from '../../../../../api/system/fromManagement/index'
    import { editItionOfFundPool, associatedProjects, poolOfJointVentureFunds } from "../../../../../api/customerManagement/capitalAccount"    
    import { CUSTOMERAUTHORIZATIONFORM } from '../../../../../enum/FORMCODE'
    
    import util from '@/libs/util.js'
    let that = this
    export default {

        props: {
            dialogTitle: String,
            dialogVisible: {
                type: Boolean,
                default: false
            },
        },

        data () {
            let that = this;
            return {
                relatedItemsDataArr: [],
                title:'',
                values:{
                    transferAmount:'',
                    capitalMoneyUpper:'',
                    canBalance:'',
                    daxieverification: ''
                },
                jsonData: {},
                poolfundsData:{
                    id:''
                },
                remote: {},
            }
        },

        methods: {

            handleClose (change) {
                this.$emit('change')
            },

            getPoolOfJointVentureFunds () {
                poolOfJointVentureFunds({'cusId': this.customerInfor.id}).then( res => {
                    if (res.canBalance == undefined) {
                        this.values.canBalance = 0.00
                        this.$message.warning("当前可用余额为0 ，无法转账")
                    } else {
                        this.values.canBalance = res.canBalance
                        this.poolfundsData.id = res.id
                    }
                })  
                
            },

            getFormByJson () {
                formGetJson ({'code': CUSTOMERAUTHORIZATIONFORM.TRANSFEROFFUNDS}).then(res => {
                    if (res) {
                        this.jsonData = JSON.parse(res)
                    }
                })
            },
            
            relatedItemsDataEven () {
                let list = []
                associatedProjects(this.customerInfor.id).then( res => {
                    if (res && res.length > 0) {
                        this.relatedItemsDataArr = res;
                        res.forEach (data => {
                            let {id, projectName: name} = data
                            let item = {id, name}
                            list.push (item)
                        })
                        this.remote = {
                            relatedItems(resolve) {
                                resolve(JSON.parse(JSON.stringify(list)));
                            }
                        }
                    }
                })
            },
            
            onChange (name,val,datas) {
                let item = {}
                switch (name) {
                    case 'transferAmount' :
                        this.values.transferAmount = val
                        this.values.daxieverification = util.convertCurrency(Number (val).toFixed (2))
                        break
                }
            },

            confirmTransferEven () {
                this.$refs.generateForm.getData().then(item => {
                    if (item) {
                        item['relatedProjects'] = this.relatedItemsDataArr.find (f => f.id === item.relatedProjectsId).projectName
                        item['cusId'] = this.customerInfor.id
                        item['id'] = this.poolfundsData.id
                        editItionOfFundPool(item).then(res => {
                            if (res.code === 200) {
                                this.$message.success("转账成功")
                                this.$emit ('change')
                                this.getPoolOfJointVentureFunds()
                            }
                        })
                    }
                })
            }
        },

        computed: {
            ...mapState('d2admin/customer', [
                'customerInfor',
                'remoteFuncs'
            ])
        },
        
        watch: {
            customerInfor () {
                this.relatedItemsDataEven()
                this.getPoolOfJointVentureFunds()
            }
        },

        created () {
            this.getFormByJson ()
            this.$store.dispatch ('d2admin/customer/customerInformationLoad')
            this.$store.dispatch ('d2admin/customer/remoteFuncsLoad')
        }
    }
</script>

<style lang='scss' scoped>

</style>
