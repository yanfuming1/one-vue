<template>
    <div>
        <template class="item-information-center___bottom-bottom">
            <qqt-table :data="loanInformationData" :rowHeader="rowHeader" :option="tableOption" @selectionChange="selectChange"></qqt-table>
        </template>    
    </div>
</template>
<script>
import { loanInformationList } from '../../../../../../api/customerManagement/capitalAccount'
export default {
    data () {
         return {
            loanInformationData:{},
            rowHeader: [
                {
                    prop: 'createTime',
                    label: '贷款时间',
                    isShow:true,
                },
                {
                    prop: 'matEndowment',
                    label: '贷款总额',
                    isShow:true
                },
                {
                    prop: 'status',
                    label: '已还金额',
                    isShow:true,
                },
                {
                    prop: 'ip',
                    label: '未还金额',
                    isShow:true
                },
                {
                    prop: 'createdTime',
                    label: '最近还款时间',
                    isShow:true
                },
                {
                    prop: 'createdTime',
                    label: '相关项目',
                    isShow:true
                },
                {
                    prop: 'createName',
                    label: '经手人',
                    isShow:true
                },
                {
                    prop: '',
                    label: '所属部门',
                    render: (h, params) => {
                        return h('el-button', {
                            props: {
                                type: 'text'
                            },
                            on: {
                                click: () => {
                                    
                                },
                            }
                        }, '查看')
                    },
                    isShow:true
                }
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
        
        // 复选框选中的数据
        selectChange (val) {
            this.multipleSelection = val
        },
            // 分页变化改动
        handlePaginationChange(val) {
            this.page = val;
            this.$nextTick(() => {
               
            });
        }
    },
    components: {
        qqtTable: () => import('../../../../../../components/qqt-subassembly/qqt-table/qqt-table'),
    }
}
</script>