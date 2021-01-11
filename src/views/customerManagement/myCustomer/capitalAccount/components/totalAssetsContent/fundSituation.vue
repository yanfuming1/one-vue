<template>
    <div class="total-assets-header-account">
        <!-- <el-form>
            <div class="account-information-tabs-account-bottom-count total-assets-header-bottom">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="总资产:">
                            <p class="total-funds">{{ totalAssets }}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="客户留存资金:">
                            <el-row>
                                <div class="unallocated-balance">{{ canBalance }}</div>
                                <el-button type="primary" plain round size="mini" v-if="isCanBalance && edit && !customerInfor.iCanSeeIt " class="transfer-accounts-btn" @click="fundTransferEven">资金转移</el-button>
                                <el-button type="primary" size="mini" plain round class="cash-withdrawal-btn" v-if="isCanBalance  &&  !customerInfor.iCanSeeIt " @click="cashWithdrawalEvent">提现</el-button>
                                <template>
                                    <fund-situation
                                        v-if="dialogVisible"
                                        :dialogTitle="dialogTitle"
                                        :dialogVisible="dialogVisible"
                                        @change="updataDialogVisible"
                                        />
                                </template>
                            </el-row>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="项目留存资金:">
                            <el-row>
                                <div class="project-revenue">{{ projectFundsData.pool }}</div>
                                <template>
                                    <cash-Withdrawal 
                                        v-if="cashWithdrawalDialogVisible"
                                        :dialogTitle="cashWithdrawalDialogTitle"
                                        :dialogVisible="cashWithdrawalDialogVisible"
                                        @change="updataDialogVisible"
                                    />
                                </template>
                            </el-row>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="暂压:">
                            <p class="amount-detention">{{ projectFundsData.detain }}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="可支付:">
                            <p class="amount-detention">{{ projectFundsData.payMoney }}</p>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="项目资金:">
                            <p class="amount-detention">{{ projectFundsData.projectfund }}</p>
                        </el-form-item>
                    </el-col>
                </el-row>

            </div>
        </el-form> -->
        <div class="content-wrap">
            <div class="wrap-left">
                <div class="content-item">该联营人的总资产 = 联营人资金池中的留存资金（<span style="color:#c23531;font-weight:bold">{{ canBalance }}</span>）+ 联营人所有项目的总资产（<span style="color:#ac00c1;font-weight:bold">{{ projectFundsData.projectfund }}</span>）= <span style="color:#c18f00;font-weight:bold">{{ totalAssets }}</span>元。</div>
                <div class="content-item">联营人总资产中可动用的总金额 = 联营人资金池中的留存资金（<span style="color:#c23531;font-weight:bold">{{ canBalance }}</span>）+ 联营人所有项目资金池中的留存资金（<span style="color:#2f4554;font-weight:bold">{{ projectFundsData.pool }}</span>）= <span style="color:#40a948;font-weight:bold">{{keepAmount}}</span>元。</div>
                <div class="content-item">联营人所有项目的总资产 = 联营人所有项目资金池中的留存资金（<span style="color:#2f4554;font-weight:bold">{{ projectFundsData.pool }}</span>）+ 所有项目暂压的工程款（<span style="color:#61a0a8;font-weight:bold">{{ projectFundsData.detain }}</span>）+所有项目可支付的工程款（<span style="color:#d48265;font-weight:bold">{{ projectFundsData.payMoney }}</span>）= <span style="color:#ac00c1;font-weight:bold">{{ projectFundsData.projectfund }}</span>元。</div>
            </div>
            <div class="wrap-right">
                <div id="myChart"></div>
                <div style="display:flex;justify-content: center;">
                    <el-button type="primary" plain round size="mini" v-if="isCanBalance && edit && !customerInfor.iCanSeeIt " class="transfer-accounts-btn" @click="fundTransferEven">资金转移</el-button>
                    <el-button type="primary" size="mini" plain round class="cash-withdrawal-btn" v-if="isCanBalance  &&  !customerInfor.iCanSeeIt " @click="cashWithdrawalEvent">提现</el-button>
                </div>
                <fund-situation
                    v-if="dialogVisible"
                    :dialogTitle="dialogTitle"
                    :dialogVisible="dialogVisible"
                    @change="updataDialogVisible"
                />
            </div>
        </div>
        <div class="tips">
            注：1、联营人资金池中的留存资金是由业务人员通过到账资金认定后而形成的，可以用来缴纳投标保证金、购买材料等。</br>
            2、可以通过【资金转移】，将联营人资金池中的留存资金转移到某个项目的资金池中。</br>
            3、也可以在项目资金池中，通过【资金转移】，将其留存资金转移到联营人的资金池中。
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import {poolOfJointVentureFunds, associatedProjects, projectFunds , capitalAccountList } from "../../../../../../api/customerManagement/capitalAccount"
import fundTransfer  from '../../capitalNeir/fundTransfer'
import cashWithdrawal  from '../../capitalNeir/cashWithdrawal'
export default {
    data () {
        return {
            cashWithdrawal:true,
            edit:true,
            list: {},
            dialogTitle:'',
            dialogVisible: false,
            cashWithdrawalDialogTitle:'',
            cashWithdrawalDialogVisible:false,
            canBalance:'',

            isCanBalance: false,
            totalAssets: 0,
            theTotalAmountRecorded:'',
            isPool: false,
            projectFundsData:{
                pool:'',
                detain:'',
                payMoney: '',
                projectfund: ''
            },
            temporaryBetAmount:""
        }
    },
    methods: {
        drawLine(){
            // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById('myChart'))
            // 绘制图表
            myChart.setOption({
                title: {
                    text: '该联营人总资产构成',
                    // subtext: '纯属虚构',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                // legend: {
                //     orient: 'vertical',
                //     left: 'left',
                //     data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
                // },
                series: [
                    {
                        name: '总资产构成',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        // color:['#3d3b4f', '#bce672', '#ff461f', '#c0ebd7'],
                        data: [
                            {value: this.canBalance, name: '联营人资金池中的留存资金'},
                            {value: this.projectFundsData.pool.replace(/,/g, ''), name: '联营人所有项目资金池中的留存资金'},
                            {value: this.projectFundsData.detain.replace(/,/g, ''), name: '所有项目暂压的工程款'},
                            {value: this.projectFundsData.payMoney.replace(/,/g, ''), name: '所有项目可支付的工程款'}
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            });
        },
        getpoolOfJointVentureFunds () {
            poolOfJointVentureFunds ({'cusId': this.customerInfor.id}).then (res => {
                let ThousandNum = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                if (res.message) {
                    this.$message.warning(res.message)
                    this.canBalance = 0
                    this.totalAssets = 0
                    this.theTotalAmountRecorded = 0
                    this.projectIncome = 0
                    // this.temporaryBetAmount = 0
                } else {
                    Number (res.canBalance) > 0 ? this.isCanBalance = true : this.isCanBalance = false
                    this.canBalance = res.canBalance ? Number(res.canBalance).toFixed (2) : 0;
                    this.totalAssets = (Number(this.totalAssets) + (res.totalAssets ? Number(res.totalAssets) : 0)).toFixed (2)
                    this.theTotalAmountRecorded = ThousandNum(res.theTotalAmountRecorded) ? ThousandNum(res.theTotalAmountRecorded) : 0
                    this.projectIncome = res.projectIncome ? res.projectIncome : 0
                    // this.temporaryBetAmount = res.temporaryBetAmount ? res.temporaryBetAmount : 0
                }
            })
        },
        // 联营人查看我所有项目的资金总和
        getProjectFunds () {
            projectFunds ({'associatedPersonId': this.customerInfor.id}).then (res => {
                if (res) {
                    Number (res.pool) > 0 ? this.isPool = true : this.isPool = false
                    let ThousandNum = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    this.projectFundsData.pool = ThousandNum(res.pool)
                    this.projectFundsData.detain = ThousandNum(res.detain);
                    this.projectFundsData.payMoney = ThousandNum(res.payMoney)
                    this.projectFundsData.projectfund = ThousandNum(res.projectfund)
                    this.totalAssets = (Number(this.totalAssets) + Number(res.detain) + Number(res.payMoney)).toFixed (2)
                } else {
                    this.projectFundsData.poll = '0'
                    this.projectFundsData.detain = '0'
                     this.projectFundsData.payMoney = '0'
                     this.projectFundsData.projectfund = '0'
                }
                this.drawLine()
            })
        },

        // 转账
        fundTransferEven () {
            this.dialogTitle = "资金转移"
            this.dialogVisible = true
        },

        // 提现
        cashWithdrawalEvent () {
            this.routLink ()
        },

        routLink (id = '') {
            let transform = { isShowDetails: false }
            this.$router.push ({
                path: 'cashWithdrawal',
                name: 'cashWithdrawal',
                params: {
                    relevancyId: id,
                    identification: '0',
                    transform: this.transform,
                    customerInforId: this.customerInfor.id
                }
            })
        },

        updataDialogVisible () {
            this.totalAssets = 0;
            this.dialogVisible = false;
            this.cashWithdrawalDialogVisible = false
            this.getpoolOfJointVentureFunds ()
            this.getProjectFunds ()
        },

        // 验证权限
        _validationAuth () {
            this.cashWithdrawal = this.$has('capitalpool:list:editupdateExtract')
            this.edit = this.$has('capitalpool:list:edit')
        },
        resetData () {
            if (this.customerInfor.id) {
                this.totalAssets = 0;
                this.getpoolOfJointVentureFunds()
                this.getProjectFunds ()
            }
        }

    },
    
    mounted () {
        this._validationAuth ()
    },

    components :{
        'fund-situation':fundTransfer,
        'cash-Withdrawal':cashWithdrawal
    },
  
    computed: {
        ...mapState('d2admin/customer', [
            'customerInfor',
        ]),
        
        keepAmount () {
            let reg = new RegExp(',', 'g')
            let pool = this.projectFundsData.pool.replace(reg, '')
            return (Number(pool) + Number(this.canBalance)).toFixed(2)
        }
    },

    watch: {
        customerInfor () {
           this.resetData();
        },

        $route (val) {
            if (val.path.indexOf('capitalAccount') !== -1) {
                this.$store.dispatch ('d2admin/customer/customerInformationLoad')
                this.$store.dispatch ('d2admin/customer/identificationSet', val.params.identification)
            }
        }
    },

    created () {
        this.$store.dispatch ('d2admin/customer/identificationLoad')
        this.$store.dispatch ('d2admin/customer/customerInformationLoad')
    }
}
</script>
<style lang='scss' scoped>
        .total-assets-header-account{
            padding:30px; 
            background: #fafbff;
            // height: 250px;
            border-top: 1px solid #e8e8e8;
            border-bottom: solid 1px #dcdddf;
        .total-assets-header-bottom{
                padding: 35px 0 20px 0px;
                .transfer-accounts-btn,
                .cash-withdrawal-btn {
                    margin:0 10px;  
                }
                .cash-withdrawal-btn {
                    color:#b37ce7;
                    border-color:#c297ec;
                }
                .unallocated-balance{
                    color: #ffa943;
                    font-size: 18px;
                    // font-weight:bold;
                    padding-left: 15px;
                    display: inline-block;
                    min-width: 80px;
                    .unallocated-balance-btns{
                        margin-left: 10px
                    }
                }
                .total-funds{
                    color: #75c0ff;
                    font-size: 18px;
                    // font-weight:bold;
                    padding-left: 145px
                }
                .total-amount-recorded{
                    color: #9bc9ae ;
                    font-size: 18px;
                    // font-weight:bold;
                    padding-left: 120px
                }
                .project-revenue{
                    color: #ff8f75 ;
                    font-size: 18px;
                    // font-weight:bold;
                    display: inline-block;
                    min-width: 95px;
                    padding-left: 30px
                }
                 .amount-detention{
                    color: #80e1bb;
                    font-size: 18px;
                    // font-weight:bold;
                    padding-left: 120px 
                }

                .el-button--mini, .el-button--mini.is-round {
                    padding: 6px 15px
                }
            }
            .message {
                text-align: center;
                background: $color-bg;
                margin-right: 20px;
                // float: bottom;
                color:#ff435c;
                line-height: 24px;
                height: 24px;
                
            }
        }
.content-wrap {
    display: flex;
    // margin-bottom: 20px;
    .wrap-left {
        margin-right: 20px;
        font-size: 18px;
        width: 70%;
        .content-item {
            margin-bottom: 20px;
        }
    }
    #myChart {
        width: 600px;
        height: 300px;
    }
}
</style>