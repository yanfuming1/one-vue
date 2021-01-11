<template>
    <el-checkbox-group v-model="checkList" @change="handleCheckedChange">
        <el-checkbox 
            v-for="(data, index) of options" 
            :key="index" 
            :label="data.value" 
            :disabled="data.disable"
            :class="{checkWidth: isRow}"
        > {{ data.label }} </el-checkbox>
    </el-checkbox-group>
</template>

<script>
export default {
    name: 'qqt-checkbox',
    props: {
        options: Array,
        value: {
            type: Array,
            default: () => []
        },
        isRow: {
            type: Boolean,
            default: () => false
        }
    },
    data () {
        return {
            checkList: this.value
        }
    },

    methods: {

        handleCheckedChange (item) {
            this.$emit('checkedChange', item)
        }
    },

    watch: {
        value () {
            this.checkList = this.value
        }
    },

    mounted () {
        this.checkList = this.value
    }
}
</script>

<style lang='scss' scoped>
    .checkWidth{
        width: 100%;
    }
</style>
