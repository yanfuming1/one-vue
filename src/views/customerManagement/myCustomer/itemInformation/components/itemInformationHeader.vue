<template>
    <div class="item-information-center___top" slot="header">
        <div class="item-information-center-top___left">
            <div class="item-information-center-top-left___header">
                <span class="item-information-center-top-left___title">
                    <i class="iconfont iconwuxing" :class="{ 'select': true}"></i>
                    {{ customerInfor.cusName }}
                </span>
                <span class="item-information-center-top-left-header___operation">
                    <el-button class="item-information-header-button" disabled size="mini">{{ customerInfor.clientGrade }}</el-button>
                    <el-button class="item-information-center_header___replacement" disabled size="mini">{{ customerInfor.customerStatus }}</el-button>
                </span>
            </div>
            <div class="item-information-center-top-left___address">
                联系地址:{{ customerInfor.detailedAddress }}
            </div>
        </div>
        <!-- <div class="item-information-center-top___right">
            <div class="item-information-center-top-right___longString">
                <div class="item-information-center-top-right___particulars">销售项目: 15个</div>
                <div class="item-information-center-top-right___particulars">投标项目: 30个</div>
                <div class="item-information-center-top-right___particulars">施工项目: 0个</div>
            </div>
        </div> -->
    </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
    props: {
        customerInfor: {
            type: Object,
            default: () => {}
        }
    }
}
</script>
<style scoped lang="scss">
    .item-information-center___top {
        box-shadow: 0 2px 12px 0 $color-border-shadow;
        height: 117px;
        background: $color-bg3;
        .item-information-center-top___left {
            padding: 20px;
            display: inline-block;
            .item-information-center-top-left___header {
                .item-information-center-top-left___title {
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
                .item-information-center-top-left-header___operation {
                    padding-left: 20px;
                    .item-information-center_header___replacement {
                        background: $color-button-reset !important;
                    }
                    .item-information-header-button{
                        color: #fff !important;
                    }
                }
            }
            .item-information-center-top-left___address {
                position: relative;
                left: 28px;
                top: 35px;
            }
        }
        .item-information-center-top___right {
            float: right;
            .item-information-center-top-right___longString {
                display: inline-block;
                border-left: 1px solid $color-straight-line2;
                padding: 10px 30px;
                .item-information-center-top-right___particulars {
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
    .el-button--mini, .el-button--mini.is-round {
        padding: 6px 10px !important;
        top: -1px
    }
</style>