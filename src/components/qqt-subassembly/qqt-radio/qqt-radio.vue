<template>
    <div>
        <el-radio
            v-for="(item, index) of options"
            :key="index"
            v-model="data"
            :disabled="!isShowElement"
            :class="{ 'isShowDetails': !isShowElement }"
            :label="item.value"
            @change="updateData(item)">
            {{ item.label }}
        </el-radio>
    </div>
</template>

<script>
    import QqtP from "../qqt-p/qqt-p";
    export default {
        name: "qqt-radio",
        components: {QqtP},
        props: {
            options: Array,
            disabled: Boolean,
            isShowElement: {
                type: Boolean,
                default: () => true
            },
            value: String
        },
        data () {
            return {
                compileText: '',
                data: this.value
            }
        },
        methods: {
            updateData (item) {
                this.compileText = item.label
                this.$emit('radio', this.data)
            },
            defaultData () {
                this.options.forEach(res => {
                    if (res.value === this.value) {
                        this.compileText = res.label
                        this.$emit('radio', this.value)
                    }
                })
            }
        },
        mounted () {
            this.data = this.value
            this.defaultData()
        },
        watch: {
            value () {
                this.data = this.value
                this.defaultData()
            }
        }
    }
</script>

<style scoped>

</style>
