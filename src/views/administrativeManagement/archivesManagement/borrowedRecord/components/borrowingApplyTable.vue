<template>
    <div class="borrowingApplyTable">
        <el-table
            :data="tableData"
            :border="option.border"
            :height="option.height"
            :max-height="option.maxHeight"
            :style="{ width: parseInt(option.width)+'px' }">
            <el-table-column
                v-for="(col, index) in rowHeader"
                :key="index"
                :align="col.align"
                :prop="col.prop"
                :label="col.label"
                :width="col.width">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {

        props: {
            tableData: {
                type: Array,
                default: () => []
            },
            option: {
                type: Object,
                default: () => {
                    return {
                        border: true
                    }
                }
            },
            rowHeader: Array
        },

        data () {
            return {
            }
        },

        methods: {}
    }
</script>

<style lang='scss' scoped>

</style>
