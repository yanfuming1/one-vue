<template>
    <div class="contract-information_header">
        <div class="contract-information_header_left">
            <div>合同名称: <span :title="contract.contractname">{{ contract.contractname }}</span></div>
            <div>合同编号: <span :title="contract.contractcode">{{ contract.contractcode }}</span></div>
            <div>合同总金额: <span :title="contract.contractprice">{{ contract.contractpriceStr }}</span></div>
        </div>
        <div class="contract-information_header_right">
            <div class="contract-information_header_right_longString">
                <div class="contract-information_header_right_particulars"><span class="left">合同类型:</span><span class="right">{{ contract.contracttype }}</span></div>
                <div class="contract-information_header_right_particulars"><span class="left">业务分类:</span><span class="right">{{ contract.differserv }}</span></div>
            </div>
            <div class="contract-information_header_right_longString">
                <div class="contract-information_header_right_particulars"><span class="left">合同介质:</span><span class="right">{{ contract.contractmedium }}</span></div>
                <div class="contract-information_header_right_particulars"><span class="left">签订份数:</span><span class="right">{{ contract.signedcopies }}</span></div>
            </div>
            <div class="contract-information_header_right_longString">
                <div class="contract-information_header_right_particulars"><span class="left">签订地点:</span><span class="right" :title="contract.contractspace">{{ contract.contractspace }}</span></div>
                <div class="contract-information_header_right_particulars"><span class="left">签订时间:</span><span class="right" :title="contract.signedtime">{{ contract.signedtime }}</span></div>
            </div>
        </div>
    </div>
</template>

<script>
    import { getSelfContractConcludeSignById, getContractConcludeSignById, getJointContractConcludeSignById } from '@/api/selfProject/contract/contractConcludeSign'
    import util from '@/libs/util.js'
    export default {

        props: {
            identification: {
                type: String,
                default: () => ''
            }
        },

        data () {
            return {
                contract: {}
            }
        },

        methods: {

            getContractConcludeSign (id) {
                let url = ''
                switch (this.identification) {
                    case '1':
                        url = getSelfContractConcludeSignById
                        break
                    case '2':
                        url = getJointContractConcludeSignById
                        break
                    default:
                        url = getContractConcludeSignById
                        break
                }
                url ({'id': id}).then (res => {
                    if (res.managerCreate) {
                        res.managerCreate['contractpriceStr'] = res.managerCreate.contractprice ? util.moneyTransform (res.managerCreate.contractprice) : '0'
                        this.contract = res.managerCreate
                    }
                })
            },

            getData () {
                return this.contract;
            },

            updataRouter () {
                if (this.$route.params && this.$route.params.contractId) {
                    this.getContractConcludeSign (this.$route.params.contractId)
                }
            }
        },

        created () {
            this.updataRouter ()
        }
    }
</script>

<style lang='scss'>
    .contract-information_header {
        height: 65px;
        color: $color-top-text-title;
        border: 1px solid;
        background: $color-head-bg;
        .contract-information_header_left {
            float: left;
            width: 70%;
            height: 65px;
            div {
                font-size: 16px;
                line-height: 65px;
                padding: 0 25px;
                font-weight: 600;
                overflow:hidden;
                text-overflow:ellipsis;
                white-space:nowrap;
                display: inline-block;
                width: 33%;
            }
        }
        .contract-information_header_right {
            float: right;
            color: $color-primary;
            width: 30%;
            height: 65px;
            .contract-information_header_right_longString {
                display: inline-block;
                border-left: 1px solid  $color-top-text-title;
                padding: 0 15px;
                width: 33%;
                .contract-information_header_right_particulars {
                    font-size: 14px;
                    padding: 6px 0;
                    height: 31px;
                    .left {
                        float: left;
                        width: 50%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .right {
                        color: $color-text-sub;
                        float: right;
                        width: 50%;
                        text-align: right;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
            }
        }
    }
</style>
