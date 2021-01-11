<template>
    <div class="capital-account-center___top">
        <div class="capital-account-center-top___left">
            <div class="capital-account-center-top-left___header">
                <span class="capital-account-center-top-left___title">
                    <i class="iconfont iconwuxing" :class="{ 'select': customerInfor.attention === '1'}"></i>
                    {{ customerInfor.cusName }}
                </span>
                <span class="capital-account-center-top-left-header___operation">
                    <el-button class="capital-account-header-button" disabled size="mini">{{ customerInfor.clientGrade }}</el-button>
                    <el-button class="capital-account-center_header___replacement" disabled size="mini">{{ customerInfor.customerStatus }}</el-button>
                </span>
            </div>
            <div class="capital-account-center-top-left___address">
                联系地址: {{ customerInfor.detailedAddress }}
            </div>
        </div>
        <!-- <div class="capital-account-center-top___right">
            <div class="capital-account-center-top-right___longString">
                <div class="capital-account-center-top-right___particulars">联系记录: 15条</div>
                <div class="capital-account-center-top-right___particulars">联系间隔: 30天</div>
                <div class="capital-account-center-top-right___particulars">本月记录: 0条</div>
            </div>
        </div> -->
    </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
    computed: {
        ...mapState('d2admin/customer', [
            'customerInfor'
        ])
    },

    created () {
        this.$store.dispatch ('d2admin/customer/identificationLoad')
        this.$store.dispatch ('d2admin/customer/customerInformationLoad')
    },

    watch: {
        $route (val) {
            if (val.path.indexOf('capitalAccount') !== -1) {
                this.$store.dispatch ('d2admin/customer/customerInformationLoad')
                this.$store.dispatch ('d2admin/customer/identificationSet', val.params.identification)
            }
        }
    }
}
</script>
<style scoped lang='scss'>
 .capital-account-center___top {
        box-shadow: 0 2px 12px 0 $color-border-shadow;
        height: 15%;
        height: 117px;
        background: $color-bg3;
        .capital-account-center-top___left {
            padding: 20px;
            display: inline-block;
            .capital-account-center-top-left___header {
                .capital-account-center-top-left___title {
                    font-size: 14px;
                    padding-left: 10px;
                    color: $color-text-normal;
                }
                .el-icon-star-on {
                    font-size: 16px;
                    position: relative;
                    top: 1px
                }
                .iconfont {
                    position: relative;
                    top: 1px
                }
                .select {
                    color: $startusing
                }
                .capital-account-center-top-left-header___operation {
                    padding-left: 20px;
                    .capital-account-center_header___replacement {
                        background: $color-button-reset !important;
                    }
                    .capital-account-header-button {
                        color: #fff !important;
                    }
                }
            }
            .capital-account-center-top-left___address {
                position: relative;
                left: 28px;
                top: 35px;
            }
        }
        .capital-account-center-top___right {
            float: right;
            .capital-account-center-top-right___longString {
                display: inline-block;
                border-left: 1px solid $color-straight-line2;
                padding: 10px 30px;
                .capital-account-center-top-right___particulars {
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
</style>