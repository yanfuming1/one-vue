<template>
    <el-dialog v-dialogDrag :visible="dialogVisible" title="多文件预览" width="45%" :before-close="handleClose">
        <up-load id="male" :isShowUpload="false" :propList="upLoadFileList" ref="upLoad" />
        <span slot="footer" class="dialog-footer">
            <el-button @click="$emit('change')">取 消</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { upload } from '@/components/qqt-subassembly'
import util from '@/libs/util.js'
export default {

    props: {

        dialogVisible: {
            type: Boolean,
            default: () => false
        },

        upLoadFileList: {
            type: Array,
            default: () => []
        }
    },

    data () {
        return {
        }
    },

    methods: {
        handleClose () {
            this.$emit ('change')
        }
    },

    components: {
        'up-load': upload,
    },
}
</script>
