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
    import { editItionOfFundPool, associatedProjects, poolOfJointVentureFunds, cashWithdrawalApi } from "../../../../../api/customerManagement/capitalAccount"    
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
            obj: {
               type: Object
            }

        },

        data () {
            let that = this;
            return {
                relatedItemsDataArr: [],
                title:'',
                values:{
                    transferAmount:'',
                    daxieverification:'',
                    balance:''
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
                this.values.balance = this.obj.balance
                console.log( this.customerInfor.id , "id");
                poolOfJointVentureFunds({'cusId': this.customerInfor.id}).then( res => {
                    console.log(res)
                    if (res.canBalance == undefined) {
                        this.values.canBalance = 0.00
                        this.$message.warning("当前可用余额为0 ，无法转账")
                    } else {
                        this.poolfundsData.id = res.id
                    }
                })  
                
            },

            confirmTransferEven () {
                this.$refs.generateForm.getData().then(item => {
                    if (item) {
                        item['cusId'] = this.obj.cusId
                        item['id'] = this.poolfundsData.id
                        item['relatedProjectsId'] = this.obj.projectId;
                        item['relatedProjects'] = this.obj.relatedProjects;
                        if(item.transferAmount > this.obj.balance){
                            this.$message.error("余额不足!") ; 
                            return ;
                        } 
                        cashWithdrawalApi(item).then(res => {
                            if (res.code === 200) {
                                this.$message.success("提现成功")
                                this.$emit ('change')
                                this.getPoolOfJointVentureFunds()
                            }
                        })
                    }
                })
            },
            //从后端获取表单数据
            getFormByJson () {
                formGetJson ({'code': CUSTOMERAUTHORIZATIONFORM.PROJECTTOCLIENT}).then(res => {
                    if (res) {
                        this.jsonData = JSON.parse(res)
                    }
                })
            },
        
            onChange (name,val,datas) {
                let item = {}
                switch (name) {
                    case 'transferAmount' :
                        this.values.transferAmount = val
                        this.values.daxieverification = util.convertCurrency(val)
                        break
                }
            },
        },

        computed: {
            ...mapState('d2admin/customer', [
                'customerInfor',
                'remoteFuncs'
            ])
        },
        
        // watch: {
        //     customerInfor () {
        //         // this.relatedItemsDataEven()
        //         this.getPoolOfJointVentureFunds()
        //     }
        // },

        created () {
            this.getPoolOfJointVentureFunds();
            this.getFormByJson ()
            this.$store.dispatch ('d2admin/customer/customerInformationLoad')
            this.$store.dispatch ('d2admin/customer/remoteFuncsLoad')
        }
    }
</script>

<style lang='scss' scoped>
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
