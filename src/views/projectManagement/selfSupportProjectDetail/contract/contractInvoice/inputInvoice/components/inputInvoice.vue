<template>
    <ticket-receipt-registration-list :contractSource="contractSource" :characteristic="characteristic" :invoiceSource="invoiceSource" :contractId="contractId">
        <template slot="header">
            <contract-information :identification="characteristic"></contract-information>
        </template>
    </ticket-receipt-registration-list>
</template>

<script>
    import ticketReceiptRegistrationList from '../../../../controlOverInvoices/ticketReceiptRegistration'
    import contractInformation from '../../components/contractInformation'
    export default {

        data () {
            return {
                contractId: null,
                invoiceSource: null,
                contractSource: '1',
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
            'ticket-receipt-registration-list': ticketReceiptRegistrationList,
            'contract-information': contractInformation
        }

    }
</script>
