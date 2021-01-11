<template>
    <div class="">
        <el-tabs 
            v-model="activeName"
            @tab-click="handleClick" 
            class="account-information-tabs"
            v-loading.fullscreen.lock="fullscreenLoading"
            >
            <el-tab-pane label="客户资金池" name="first">
                <total-assets-content ref="totalAssets"></total-assets-content>
            </el-tab-pane>

            <el-tab-pane label="项目资金池" name="second">
                <capital-content ref="capitalContentRef"></capital-content>
            </el-tab-pane>

            <el-tab-pane label="银行账户设置" name="third">
                <account-content></account-content>
            </el-tab-pane>

            <el-tab-pane label="资金提现记录" name="four">
                <cash-withdrawal-record></cash-withdrawal-record>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import totalAssetsContent from './totalAssetsContent'
import capitalContent from './capitalContent'
import accountContent from './accountContent'
import cashWithdrawalRecord from './cashWithdrawalRecord'
export default {

    name: 'accountDetails',

    data () {
        return {
            fullscreenLoading:false,
            activeName: 'first'
        };
    },

    methods :{
        
        handleClick(tab, event) {
            console.log(this.activeName)
            if (this.activeName === 'first') {
                this.$refs.totalAssets.resetData();
                this.fullscreenLoading = true;
                setTimeout(() => {
                    this.fullscreenLoading = false;
                }, 1000);
            } else if (this.activeName === 'second') {
                this.$refs.capitalContentRef.reastFun();
             
            }
        },
    },

    created () {
        if (this.$route.params && this.$route.params.name) {
            this.activeName = this.$route.params.name
        }
    },

    components: {
        'total-assets-content':totalAssetsContent,
        'capital-content':capitalContent,
        'account-content':accountContent,
        'cash-withdrawal-record': cashWithdrawalRecord
    }
}
</script>
<style lang='scss'>
    .account-information-tabs{
        .el-tabs__header{
            margin: 0px
        }
        .total-assets-header{
            padding: 20px 0 10px 30px;
            .el-button+.el-button{
                margin-left: 15px
            }
        }
        .el-tabs__nav-scroll{
            padding: 20px 0 0 30px;
        }
    }
</style>