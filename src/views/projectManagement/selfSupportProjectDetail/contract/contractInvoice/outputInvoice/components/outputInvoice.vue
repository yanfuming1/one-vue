<template>
    <billing-registration-list :characteristic="characteristic" :invoiceSource="invoiceSource" :contractId="contractId">
        <template slot="header">
            <contract-information :identification="characteristic"></contract-information>
        </template>
    </billing-registration-list>
</template>

<script>
    import billingRegistrationList from '../../../../controlOverInvoices/billingRegistration'
    import contractInformation from '../../components/contractInformation'
    export default {

        data () {
            return {
                contractId: null,
                invoiceSource: null,
                characteristic: ''
            }
        },

        methods: {

            updataRouter () {
                if (this.$route.params) {
                    this.contractId = this.$route.params.contractId || null
                    this.invoiceSource = this.$route.params.identifying || null
                    this.characteristic = this.$route.params.characteristic || ''
                }
            }
        },

        created () {
            this.updataRouter ()
        },

        components: {
            'billing-registration-list': billingRegistrationList,
            'contract-information': contractInformation
        }

    }
</script>
