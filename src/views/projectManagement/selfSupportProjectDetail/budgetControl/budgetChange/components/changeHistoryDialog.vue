<template>
    <div>
        <el-dialog title="修改记录" :visible.sync="showHistory" width="50%" :before-close="handleClose">
            <el-table :data="data" border style="width: 100%">
                <el-table-column prop="version" label="修改版本"></el-table-column>
                <el-table-column prop="fieldValue" label="修改内容"></el-table-column>
                <el-table-column prop="updateName" label="修改人"></el-table-column>
                <el-table-column prop="updateTime" label="修改时间"></el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    props: {
        showHistory: {
            type: Boolean,
            default: false
        },
        data: {
            type: Array,
            default () {
                return []
            }
        }
    },
    data() {
      return {

      };
    },
    methods: {
      handleClose(done) {
          this.$emit('closeDialog')
      }
    }
}
</script>