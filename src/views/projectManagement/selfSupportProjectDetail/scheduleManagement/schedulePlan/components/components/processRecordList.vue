<template>
    <div class="record-list-table">
        <qqt-table ref="table" :data="tableData" :rowHeader="rowHeader" :pageShow="pageShow" :option="tableOption" :dynamicHeader="dynamicHeader" 
            @selectionChange="selectChange"></qqt-table>
    </div>
</template>
<script>
import { qqtTable } from '@/components/qqt-subassembly'
import util from '@/libs/util'
export default {
    props: {
        tableData: {
            type: Object,
            default: () => { return {} } 
        }
    },
    components: {
        'qqt-table': qqtTable,
    },
    data () {
        return {
            pageShow: false,
            tableOption: { border: true },
            dynamicHeader: {},
            rowHeader: [
                {
                    prop: 'createTime',
                    label: '上报日期',
                    width: "180",
                    isShow: true,
                },{
                    prop: 'createName',
                    label: '记录人',
                    isShow: true,
                    width: "120",
                },{
                    prop: 'rating',
                    label: '得分',
                    width: "120",
                    isShow: true,
                },{
                    prop: 'duty',
                    label: '流程状态',
                    isShow: true,
                    width: "100",
                    render: (h, parms) => {
                        return h('el-alert', {
                            props: { closable: false, type: "success", },
                            style: { padding: '0px' },
                         }, util.handleState(parms.row.procState))
                    }
                },{
                    prop: 'remark',
                    label: '备注',
                    isShow: true,
                    width: "180",
                },{
                    prop: "",
                    label:"实际完工日期",
                    width: "150",
                    isShow: true,
                    render: (h, parms) => {
                        return parms.row.endDate ? h('span', { }, parms.row.endDate) : h('el-button', {
                            props:{ type: 'text' },
                            style: { color: "#377EE5" },
                            attrs:{ disabled: parms.row.procState ==='1' ? false : true },
                            on:{
                                click: () => { }
                            }
                        }, '上报完工日期')
                    }
                },{
                    prop: "",
                    label:"操作",
                    width: "120",
                    isShow: true,
                    render: (h, parms) => {
                        return [
                            h('el-button', {
                                props:{ type: 'text' },
                                style: { color: "#377EE5" },
                                on:{
                                    click: () => {
                                        this.$emit('showRecord', parms.row.id)
                                    }
                                }
                            }, '详情'),
                            h('el-button', {
                                props:{ type: 'text' },
                                style: { color: parms.row.procState ==='1' ? "#377EE5" : "#C0C4CC" },
                                attrs:{ disabled: parms.row.procState ==='1' ? false : true },
                                on:{
                                    click: () => {
                                        this.$emit('editRecord', parms.row.id)
                                    }
                                }
                            }, '编辑')
                        ]
                    }
                }
            ],
            
        }
    },
    methods: {
        
        selectChange (item) {

        },
    }
}
</script>
<style lang="scss">
.record-list-table{
    .el-alert__content{
        margin: 0px auto;
        .el-alert__description{ margin: 0px; }
    }
}
</style>