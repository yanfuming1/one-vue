<template>
    <div >
        <div class="capital-flowInformation-data">
            <qqt-table :data="capitalFlowInformationData" :rowHeader="rowHeader" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange"></qqt-table>
        </div>    
    </div>
</template>
<script>
import { mapState } from 'vuex'
import { capitalFlowInformation } from '../../../../../../api/customerManagement/capitalAccount'
export default {
    props: {
        filterText: String
    },

    data () {
         return {
            capitalFlowInformationData: {},
            rowHeader: [
                {
                    prop: 'createTime',
                    label: '资金流动时间',
                    isShow:true,
                },  
                {
                    prop: 'entryDisbursement',
                    label: '入账/支出',
                    isShow:true
                },
                {
                    prop: 'flowAmount',
                    label: '流动金额',
                    isShow:true,
                },
                {
                    prop: 'relevantProject',
                    label: '关联项目',
                    isShow:true
                },
                {
                    prop: 'mobileUse',
                    label: '备注',
                    isShow:true
                },
                
            ],
            loading: false,
            page: {
                current: 1,
                size: 10,
                total: 0
            },
            tableOption: {}
        }
    },
    methods: {

        getCapitalFlowInformation (text) {
            capitalFlowInformation({
                ...text,
                'cusId': this.customerInfor.id,
                pageNo: this.page.current,
                pageSize: this.page.size
            }).then (res => {
                this.capitalFlowInformationData = res.total > 0 ? res : {}
            })
        },

        // 复选框选中的数据
        selectChange (val) {
            this.multipleSelection = val
        },

        // 分页变化改动
        handlePaginationChange (val) {
            this.page = val;
            this.$nextTick(() => {
                this.getCapitalFlowInformation ()
            })
        }
    },

    computed: {
        ...mapState('d2admin/customer', [
            'customerInfor'
        ])
    },

    watch: {
        customerInfor () {
            if (this.customerInfor.id) {
                this.getCapitalFlowInformation ();
            }
        },

        filterText () {
            this.getCapitalFlowInformation ({'name': this.filterText})
        },

        $route (val) {
            if (val.path.indexOf('capitalAccount') !== -1) {
                this.$store.dispatch ('d2admin/customer/customerInformationLoad')
                this.$store.dispatch ('d2admin/customer/identificationSet', val.params.identification)
            }
        }
    },

    created () {
        this.$store.dispatch ('d2admin/customer/identificationLoad')
        this.$store.dispatch ('d2admin/customer/customerInformationLoad')
    },

    components: {
        qqtTable: () => import('../../../../../../components/qqt-subassembly/qqt-table/qqt-table'),
    }
}
</script>

<style scoped>
    .capital-flowInformation-data{
        height: 415px;
    }
</style>