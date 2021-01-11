<template>
    <d2-container class="relationship-record">
        <div class="relationship-record-center">
            <customer-details-header :customerInfor="customerInfor" :identification="identification" :isShowTime="true" :isShowProject="true" :isShowInvoice="true" />
            <div class="relationship-record-center___bottom">
               <make-out-an-invoice-history></make-out-an-invoice-history>
               <div class="relationship-record-center___button">
                    <el-button @click="closeTag">返回</el-button>
                </div>
            </div>
        </div>
    </d2-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import customerDetailsHeader from '../../components/customerDetailsHeader'
import makeOutAnInvoiceHistory from './makeOutAnInvoiceHistory'
export default {
    data () {
        return {
            
            values: {}
        }
    },

    methods: {

        ...mapActions('d2admin/page', [
            'close',
        ]),

        closeTag () {
            let tagName = this.$route.path
            let path = `/customerManagement/customerList/${this.identification}`
            this.close ({tagName, path})
        }
    },

    computed: {
        ...mapState('d2admin/customer', [
            'customerInfor',
            'identification'
        ])
    },

    created () {
        this.$store.dispatch ('d2admin/customer/identificationLoad')
        this.$store.dispatch ('d2admin/customer/customerInformationLoad')
    },

    components: {
        'customer-details-header': customerDetailsHeader,
        'make-out-an-invoice-history': makeOutAnInvoiceHistory
    }
}
</script>

<style lang='scss' scoped>
    .relationship-record {
        .relationship-record-center {
            height: 100%;
            padding: 10px;
            .relationship-record-center___top {
                box-shadow: 0 2px 12px 0 $color-border-shadow;
                height: 15%;
                min-height: 117px;
                background: $color-bg3;
                .relationship-record-center-top___left {
                    padding: 20px;
                    display: inline-block;
                    .relationship-record-center-top-left___header {
                        .relationship-record-center-top-left___title {
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
                        .relationship-record-center-top-left-header___operation {
                            padding-left: 20px;
                            .relationship-record-center_header___replacement {
                                background: $color-button-reset !important;
                            }
                        }
                    }
                    .relationship-record-center-top-left___address {
                        position: relative;
                        left: 28px;
                        top: 35px;
                    }
                }
                .relationship-record-center-top___right {
                    float: right;
                    .relationship-record-center-top-right___longString {
                        display: inline-block;
                        border-left: 1px solid $color-straight-line2;
                        padding: 10px 30px;
                        .relationship-record-center-top-right___particulars {
                            font-size: 14px;
                            padding: 6px 0;
                        }
                    }
                }
            }
            .relationship-record-center___bottom {
                height: 83%;
                margin-top: 20px;
                box-shadow: 0 2px 12px 0 $color-border-shadow;
                background: $color-bg3;
                font-size: 14px;
                .relationship-record-center___button {
                    text-align: center;
                    padding-top: 20px;
                    button {
                        height: 30px;
                        padding: 6px 10px;
                        .el-button--primary {
                            background-color: $color-button-dialog-affirm
                        }
                    }
                }
            }
        }
        .relationship-record-header-button {
            height: 26px;
            border-radius: 3px;
            color: #ffffff;
            background-color: $color-button-typeface1;
            border: 1px solid $color-button-typeface1
        }
        .el-button--mini, .el-button--mini.is-round {
            padding: 6px 10px !important;
            top: -1px
        }
    }
</style>
