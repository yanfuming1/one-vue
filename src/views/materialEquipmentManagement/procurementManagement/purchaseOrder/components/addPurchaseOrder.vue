<template>
    <d2-container class="add-purchase-order">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
            </div>
            <basis-purchase-order @close="closePageTag"/>
        </el-card>
    </d2-container>
</template>

<script>
    import { mapActions } from 'vuex'

    import basisPurchaseOrder from './basisPurchaseOrder'
    import util from '@/libs/util.js'
    export default {

        data () {
            return {
            }
        },

        methods: {

            ...mapActions('d2admin/page', [
                'close',
            ]),

            closePageTag () {
                let tagName = this.$route.path
                let path = `/materialEquipmentManagement/procurementManagement/${this.$route.params.path}`
                this.close ({ tagName, path })
            },
        },

        components: {
            'basis-purchase-order': basisPurchaseOrder
        }
    }
</script>