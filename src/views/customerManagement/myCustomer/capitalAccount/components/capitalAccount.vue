<template>
    <d2-container class="capital-account">
        <div class="capital-account-center">
         <capital-account-header :customerInfor="customerInfor" :identification="identification" :isShowTime= "true" slot="header"></capital-account-header>
            <div class="capital-account-center___bottom">
                <div class="capital-account-center___bottom-header">
                    <account-details></account-details>
                </div>
                <div class="capital-account-center___button">
                    <el-button @click="closeTag">返回</el-button>
                </div>
            </div>
        </div>
    </d2-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import accountDetails from './accountDetails' 
// import capitalAccountHeader from './capitalAccountHeader'
import capitalAccountHeader from '../../components/customerDetailsHeader'

export default {

    data () {
        return {
        }
    },

    methods: {
        ...mapActions('d2admin/page', [
            'close',
        ]),

        closeTag () {
            let tagName = this.$route.path
                let path = ''
                
                if (this.customerInfor.myClientPath) {
                    path = `/customerManagement/myClientModule/${this.customerInfor.myClientPath}`
                } else {
                    path = `/customerManagement/customerList/${this.identification}`
                }
                this.close ({tagName, path})
        }
    },

    components :{
        'account-details':accountDetails,
        'capital-account-header':capitalAccountHeader
    },

    computed: {
        ...mapState('d2admin/customer', [
            'identification',
            'customerInfor'
        ])
    },

    created () {
        this.$store.dispatch ('d2admin/customer/identificationLoad')
    }
}
</script>

<style lang='scss' scoped>
    .capital-account {
        .capital-account-center {
            height: 100%;
            padding: 10px;
           
            .capital-account-center___bottom {
                height: 83%;
                margin-top: 20px;
                box-shadow: 0 2px 12px 0 $color-border-shadow;
                background: $color-bg3;
                .capital-account-center___button {
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
    }
</style>
