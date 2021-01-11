<template>
    <el-dialog v-dialogDrag :visible="dialogVisible" title="回复历史" width="50%" :before-close="handleClose">
        <qqt-table :data="tableData" ref="table" :rowHeader="rowHeader" :option="tableOption" :pageShow="false" :isShowGroup="false"></qqt-table>
        <span slot="footer" class="dialog-footer">
            <el-button @click="$emit('close')">取 消</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import { getReplyHistoryPageList} from '../../../../../api/administrativeManagement/documentManagement/receiptRegistration'
    import { qqtTable } from '@/components/qqt-subassembly'
    import { mapState } from 'vuex'

    import util from '@/libs/util.js'
    export default {

        props: {
            dialogVisible: {
                type: Boolean,
                default: () => false
            },

            relevancyId: {
                type: String,
                default: () => ''
            }
        },

        data () {
            return {
                tableOption: {
                    border: false
                },
                tableData: {
                    records: []
                },
                rowHeader: [
                    {
                        prop: 'createTime',
                        label: '回复时间',
                        isShow: true
                    },
                    {
                        prop: 'createName',
                        label: '回复人',
                        isShow: true
                    },
                    {
                        prop: 'content',
                        label: '回复内容',
                        isShow: true
                    }
                ]
            }
        },

        methods: {

            getReplyhistoryPage () {
                getReplyHistoryPageList ({"id": this.relevancyId}).then(res => {
                    if (res) this.tableData.records = res
                })
            },

            handleClose () {
                this.$emit ('close')
            }

        },

        components: {
            'qqt-table': qqtTable,
        },

        watch: {
            relevancyId () {
                this.getReplyhistoryPage ()
            }
        }
    }

</script>
