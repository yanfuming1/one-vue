<template>
    <d2-container class="credit-evaluate">
        <div class="credit-evaluate-center">
            <customer-details-header :customerInfor="customerInfor" :identification="identification" :isShowTime="true" :isShowProject="true" :isShowInvoice="true" />
            <div class="credit-evaluate-center___bottom">
                <div class="credit-evaluation-content-header">
                    <el-row>
                        <div class="credit-evaluation-content-header-line">
                            <span class="bottom-header-left-line"></span>
                            <p>信誉评价</p>
                        </div>
                    </el-row>
                </div>
                <div class="adding-credit-rating-btn" >
                    <el-button type="primary" size="medium" plain @click="addingCreditRatingEven" v-if="add && !customerInfor.iCanSeeIt ">添加信誉评价</el-button>
                </div>
                <div class="content-bottom-con">
                    <div class="credit-evaluation-content-bottom" v-for="(item, index) of listData" :key="index">
                        <div class="credit-evaluation-content-bottom-header">
                            <div class="credit-evaluation-content-bottom-header-left">
                                <div class="credit-evaluation-content-bottom-header-left-head-portrait">
                                    <img v-if="item.str" v-bind:src="item.str" class="avatar">
                                    <div v-else class="head-portrait">
                                    </div>
                                </div>
                                <p>{{ item.createBy }}</p>
                            </div>
                            <div  class="credit-evaluation-content-bottom-header-center">
                                <el-rate
                                    v-model="item.creditscore"
                                    disabled
                                    show-score
                                    :colors="colors"
                                    :text-color="textColor"
                                    :max="max"
                                    >
                                </el-rate>
                                <p>{{ item.creditsay }}</p>
                            </div>
                            <div class="credit-evaluation-content-bottom-header-right">
                                <p :evaluationText="creditlevel">信誉评价：{{ item.creditlevel }}</p>
                            </div>
                        </div>
                        <div class="credit-evaluation-content-bottom-bottom">
                            <div class="credit-evaluation-content-bottom-bottom-let">
                                浏览 {{ item.seetime }} 次 
                            </div>
                            <div class="credit-evaluation-content-bottom-bottom-right">
                                {{ item.createTime }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bottom-btn">
                    <el-button size="small" @click="closeTag">返回</el-button>
                </div>
                <new-credit-evaluation
                        :dialogTitle="dialogTitle"
                        :dialogVisible="dialogVisible"
                        :max="max"
                        :colors="colors"
                        :text-color="textColor"
                        :data="values"
                        @change="creditRatingDialogVisible"
                        @saveCustomerDictionary="saveCustomerDictionary" />
            </div>
        </div>
    </d2-container>
</template>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    

<script>
    import { mapState, mapActions } from 'vuex'
    import newCreditEvaluation from "./newCreditEvaluation"
    import customerDetailsHeader from '../../components/customerDetailsHeader'
    import util from '@/libs/util'
    import { getReputationEvaluationList, reputationEvaluationAdd, 
             firstPartyReputationEvaluationList, firstPartyReputationEvaluationAdd, quantityCreditEvaluation, firstPartyQuantityCreditEvaluation } from "../../../../../api/customerManagement/reputationEvaluation"
    export default {
        data () {
            return {
                add: true,
                str:'',
                evaluationNumber:'',
                listData: [],
                values: {},
                value: 2,
                max:5,
                creditlevel:'',
                textColor:'#3ba5ff',
                colors:['#d1d1d1', '#3ba5ff', '#3ba5ff'],
                dialogTitle:"添加信誉评价",
                dialogVisible:false,
                creditEvaluationData: {}
            }
        },
        methods: {
            // 头部累积评价
            getquantityCreditEvaluation () {
                let url = ''
                switch (this.identification) {
                    case '0':
                        url = quantityCreditEvaluation
                        break
                    case '1':
                        url = firstPartyQuantityCreditEvaluation
                        break
                }
                url ({
                    associateid: this.customerInfor.id
                }).then(res => {
                    this.evaluationNumber = res.join('')
                })
            },

            // 初始化获取列表
            getreputationEvaluationEven () {
                let url = ''
                this.listData = []
                switch (this.identification) {
                    case '0':
                        url = getReputationEvaluationList
                        break
                    case '1':
                        url = firstPartyReputationEvaluationList
                        break
                }
                url({
                    associateid:this.customerInfor.id,
                    employeeid: util.cookies.get ('uuid')}).then(res => {
                    if (res && res && res.length > 0) {
                        res.filter (item => {
                            item['creditscore'] = parseInt(item['creditscore'])
                        })
                        this.listData = res
                    }
                    
                })
            },

            // 添加保存事件
            saveCustomerDictionary (creditEvaluationData){
                let url = ''
                switch (this.identification) {
                    case '0':
                        url = reputationEvaluationAdd
                        break
                    case '1':
                        url = firstPartyReputationEvaluationAdd
                        break
                }
                if (creditEvaluationData.creditscore == 0) {
                    this.$message.warning("请选择评价分数")
                } else if (creditEvaluationData.creditsay == "") {
                    this.$message.warning("请输入评价内容")
                } else {
                    creditEvaluationData.associateid = this.customerInfor.id
                    url (creditEvaluationData).then(res => {
                        if (res.code === 200) {
                            this.$message.success("添加成功~~~")
                            this.dialogVisible = false
                            this.getreputationEvaluationEven()
                            this.getquantityCreditEvaluation ()
                        }
                    })
                }
                
            },

            // 添加打开弹框操作
            addingCreditRatingEven () {
                this.dialogVisible = true
            },

            // 取消关闭弹窗操作
            creditRatingDialogVisible () {
                this.dialogVisible = false
            },

            // 验证权限
            _validationAuth () {
                this.add = this.identification === '0' ? this.$has('creditevaluation:list:add') : this.$has ('creditevaluations:list:add')
            },

            ...mapActions('d2admin/page', [
                'close',
                'open' // 打开一个新页面
            ]),

            // 底部关闭当前页操作
            closeTag () {
                let tagName = this.$route.path
                let path = ''
                
                if (this.customerInfor.myClientPath) {
                    path = `/customerManagement/myClientModule/${this.customerInfor.myClientPath}`
                } else {
                    path = `/customerManagement/customerList/${this.identification}`
                }
                this.close ({tagName, path})
            },
        },
        components: {
            "new-credit-evaluation":newCreditEvaluation,
            'customer-details-header': customerDetailsHeader
        },
        computed: {
            ...mapState('d2admin/customer', [
                'customerInfor',
                'identification'
            ])
        },

        mounted () {
            this._validationAuth ()
        },

        created () {
            this.$store.dispatch ('d2admin/customer/identificationLoad')
            this.$store.dispatch ('d2admin/customer/customerInformationLoad')
            
        },
        watch: {
            customerInfor () {
                if (this.customerInfor.id) {
                    this.getquantityCreditEvaluation (this.customerInfor.id)
                    this.getreputationEvaluationEven ()
                }
            },

            $route (val) {
                if (val.path.indexOf('creditEvaluate') !== -1) {
                    this.$store.dispatch ('d2admin/customer/customerInformationLoad')
                    this.$store.dispatch ('d2admin/customer/identificationSet', val.params.identification)
                }
            }
        }
    }
</script>

<style lang='scss' scoped>
    .credit-evaluate {
        .credit-evaluate-center {
            height: 100%;
            padding: 10px;
            .credit-evaluate-center___top {
                box-shadow: 0 2px 12px 0 $color-border-shadow;
                height: 15%;
                height: 117px;
                background: $color-bg3;
                .credit-evaluate-center-top___left {
                    padding: 20px;
                    display: inline-block;
                    .credit-evaluate-center-top-left___header {
                        .credit-evaluate-center-top-left___title {
                            font-size: 14px;
                            padding-left: 10px;
                            color: $color-text-normal;
                        }
                        .el-icon-star-on {
                            font-size: 16px;
                            position: relative;
                            top: 1px
                        }
                        .select {
                            color: $startusing
                        }
                        .credit-evaluate-center-top-left-header___operation {
                            padding-left: 20px;
                            .credit-evaluate-center_header___replacement {
                                background: $color-button-reset !important;
                            }
                            .credit-evaluate-header-button {
                                color: #fff !important;
                            }
                        }
                    }
                    .credit-evaluate-center-top-left___address {
                        position: relative;
                        left: 28px;
                        top: 35px;
                    }
                }
                .credit-evaluate-center-top___right {
                    float: right;
                    .credit-evaluate-center-top-right___longString {
                        display: inline-block;
                        border-left: 1px solid $color-straight-line2;
                        height: 117px;
                        padding: 10px 30px;
                        .credit-evaluate-center-top-right___particulars {
                            font-size: 14px;
                            padding: 6px 0;
                        }
                    }
                }
                .el-button.is-disabled, .el-button.is-disabled:focus, .el-button.is-disabled:hover {
                    color: #5e5e5f !important;
                    cursor: auto !important;
                    background-color: $color-primary !important
                }
            }
            .credit-evaluate-center___bottom {
                height: 83%;
                margin-top: 20px;
                box-shadow: 0 2px 12px 0 $color-border-shadow;
                background: $color-bg3;
                    .credit-evaluation-content-header{
                        padding: 20px 0 20px 32px;
                    .credit-evaluation-content-header-line{
                        display: flex;
                    }
                    .credit-evaluation-content-header-line > p{
                        color:  $color-text-title;
                        font-size: 14px;
                    }
                    .bottom-header-left-line{
                        border-left: 3px solid $color-text-title;
                        margin-right: 6px;
                    }
                    
                }
            }
        }
    }
    .content-bottom-con{
        height: 450px;
        overflow-x: hidden;
        .credit-evaluation-content-bottom{
        background: #fafbff;
        border-top: 1px solid $color-straight-line3;
        border-bottom: solid 1px #dcdddf;
        margin-bottom: -1px
    }
    .credit-evaluation-content-bottom-header{
        border-bottom: 1px dashed transparent;
            background: linear-gradient(#fafbff,#fafbff) padding-box,
            repeating-linear-gradient(-45deg, $color-straight-line3 0, $color-straight-line3 0.4em,white 0,white 0.7em);
        margin: 0 30px;
        display: flex;
        justify-content: space-around;
        padding: 30px 0;
        .credit-evaluation-content-bottom-header-left{
            .credit-evaluation-content-bottom-header-left-head-portrait{
                width: 80px;
                height: 80px;
                border: $color-straight-line3 2px solid;
                border-radius: 80px;
            }
            p{
                text-align: center;
                margin-top: 12px
            }

        }
        .credit-evaluation-content-bottom-header-center{
            line-height: 60px;
            font-size: 14px;
            .el-rate__text{
                font-size: 16px;
                font-weight: bold;
            }
        }
        .credit-evaluation-content-bottom-header-right{
            p{
                color: #3ba5ff;
                font-size: 14px
            }
        }
    }
    .credit-evaluation-content-bottom-bottom {
        justify-content: space-between;
        display: flex;
        .credit-evaluation-content-bottom-bottom-let{
            font-size: 14px;
            padding: 20px;
            text-align: left;
            height: 50px;
        }
        .credit-evaluation-content-bottom-bottom-right{
            font-size: 14px;
            padding: 20px;
            text-align: right;
            height: 50px;
        }
    }
    
    }

    .adding-credit-rating-btn{
        z-index: 999;
        position: absolute;
        float: right;
        margin-top: -40px;
        right: 50px;
        button {
            height: 30px;
            padding: 6px 10px;
            .el-button--primary {
                background-color: $color-button-dialog-affirm
            }
        }
    }
    .bottom-btn{
        text-align: center;
        margin-top: 60px
    }
    .el-button--mini, .el-button--mini.is-round {
        padding: 6px 10px !important;
        top: -1px
    }
    .avatar {
        width: 82px;
        height: 82px;
        display: block;
        margin: -3px;
        border-radius:300px
    }
    .head-portrait {
        width: 80px;
        height: 80px;
        border: $color-straight-line3 2px solid;
        border-radius: 80px;
        margin: 2 auto;
        margin-bottom: 16px
    }
</style>
