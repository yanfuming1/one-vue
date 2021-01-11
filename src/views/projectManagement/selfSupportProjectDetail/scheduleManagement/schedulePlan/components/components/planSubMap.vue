<template>
    <el-dialog
        title="流程图"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="cancel">
        <qqt-flow-diagram :flowDiagram="pdfInfo"></qqt-flow-diagram>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="cancel">关 闭</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { qqtFlowDiagram } from '@/components/qqt-subassembly'
import { nodeInfoStartCrew, nodeInfoStartByPiId } from "@/api/officalDocument/index"
export default {
    components: {
        'qqt-flow-diagram': qqtFlowDiagram
    },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        procInstId: {
            type: String,
            default: () => {
                return ''
            }
        }
    },
    data () {
        return {
            pdfInfo: [],
        }
    },
    methods: {
        cancel () {
            this.$emit('cancel')
        },
        getFlowDiagram (id) {
            nodeInfoStartByPiId ( id ).then(res => {
                this.pdfInfo = res
            })
        }
    },
    watch: {
        procInstId (newVal) {
            this.getFlowDiagram(newVal)
        }
    }
}
</script>