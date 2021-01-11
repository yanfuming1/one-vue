<template>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="审批信息" name="first">
            这是审批信息
        </el-tab-pane>
        <el-tab-pane label="流程图" name="second">
            这是流程图
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    export default {
        name: "flowTab",
        props: {
            flowInfo: {
                type: Array,
                default: () => {
                    return []
                }
            }
        },
        data () {
            return {
                activeName: 'first',
                flowTable: []
            }
        },
        methods: {
            handleClick (tab, event) {

            },
        },
        mounted() {
            this.flowTable = this.flowInfo
        },
        watch: {
            flowInfo(newVal, old){
                this.flowTable = newVal
            }
        }
    }
</script>

<style scoped>

</style>
