<template>
    <div class="customer-details-header">
        <div class="customer-details-header___left">
            <el-row>
                <el-col :span="12"><div class="grid-content bg-purple"><b class="b">客户名称:</b>  {{ customerInfor.cusName }}</div></el-col>
                <el-col :span="12"><div class="grid-content bg-purple-light"><b class="b">客户等级:</b>  {{ customerInfor.clientGrade }}</div></el-col>
            </el-row>
            <el-row>
                <el-col :span="12"><div class="grid-content bg-purple"><b class="b">客户状态:</b>  {{ customerInfor.customerStatus }}</div></el-col>
                <el-col :span="12"><div class="grid-content bg-purple-light"><b class="b">联系地址:</b>  {{ customerInfor.address }}</div></el-col>
            </el-row>
        </div>
        <div class="customer-details-header___right">
            <div class="customer-details-header-right___longString" v-show="isShowTime">
                <div class="customer-details-header-right___particulars">联系记录: {{ records[0] || 0 }}条</div>
                <div class="customer-details-header-right___particulars">联系间隔: {{ records[1] || 0}}天</div>
                <div class="customer-details-header-right___particulars">本月记录: {{ records[2] || 0}}条</div>
            </div>
        </div>
    </div>
</template>

<script>
    import { getJointVentureContactRecordNumber, getContactRecordPartyANumber } from '../../../../api/customerManagement/relationshipRecord'
    export default {
        
        props: {
            customerInfor: {
                type: Object,
                default: () => {}
            },

            isShowTime: {
                type: Boolean,
                default: false
            },

            isShowProject: {
                type: Boolean,
                default: false
            },

            isShowInvoice: {
                type: Boolean,
                default: false
            },

            identification: {
                type: String,
                default: ''
            }
        },

        data () {
            return {
                records: ['0', '0', '0']
            }
        },

        methods: {
            getNumberContactRecords (id) {
                let url = ''
                switch (this.identification) {
                    case '0':
                        url = getJointVentureContactRecordNumber
                        break
                    case '1':
                        url = getContactRecordPartyANumber
                        break
                }
                url ({'customerId': id}).then (res => {
                    if (res) {
                        this.records = res
                    }
                })
            },

            initLoadData () {
                if (this.customerInfor.id && this.identification != '') {
                    this.getNumberContactRecords (this.customerInfor.id)
                }
            }
        },

        created () {
            console.log (this.identification)
        },

        watch: {

            customerInfor () {
                this.initLoadData ()
            },

            identification () {
                this.initLoadData ()
            }
        }
    }
</script>

<style lang='scss'>
    .customer-details-header {
        box-shadow: 0 2px 12px 0 $color-border-shadow;
        height: 15%;
        min-height: 117px;
        background: $color-bg3;
        .customer-details-header___left {
            padding: 20px;
            display: inline-block;
            width: 60%;
            .customer-details-header-left___header {
                .customer-details-header-left___title {
                    font-size: 14px;
                    padding-left: 10px;
                    color: $color-text-normal;
                }
                .el-icon-star-on {
                    font-size: 16px;
                }
                .iconfont {
                    position: relative;
                    top: 1px
                }
                .select {
                    color: $startusing
                }
                .customer-details-header-left-header___operation {
                    padding-left: 20px;
                    .customer-details-center_header___replacement {
                        background: $color-button-reset !important;
                    }
                    .customer-details-header-button {
                        color: #fff !important;
                    }
                }
            }
            .customer-details-header-left___address {
                position: relative;
                left: 28px;
                top: 35px;
            }
        }
        .customer-details-header___right {
            float: right;
            .customer-details-header-right___longString {
                display: inline-block;
                border-left: 1px solid $color-straight-line2;
                padding: 10px 30px;
                .customer-details-header-right___particulars {
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
         .el-row {
            margin-bottom: 20px;
            &:last-child {
            margin-bottom: 0;
            }
        }
        .el-col {
            border-radius: 4px;
        }
        .grid-content {
            border-radius: 4px;
            min-height: 36px;
        }
        .row-bg {
            padding: 10px 0;
           
        }
        .b{
            font-size: 16px;
        }
    }
</style>
