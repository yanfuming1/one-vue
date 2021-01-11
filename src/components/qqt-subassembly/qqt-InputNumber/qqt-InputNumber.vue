<template>
    <el-input-number
        v-model="data"
        :controls-position="controlsPosition"
        @change="$emit('inputNumber', data)"
        :min="min"
        :max="max"
        :disabled="!isShowElement"
        :class="{ 'Lenght': isFix, 'isShowDetails': !isShowElement }"
        :precision="precision"
        :placeholder="placeholder"
    >
    </el-input-number>
</template>

<script>
    import QqtP from "../qqt-p/qqt-p";
    export default {
        name: "qqt-InputNumber",
        components: {QqtP},
        props: {
            value: Number,
            controlsPosition: String,
            min: Number,
            max: Number,
            precision: Number,
            placeholder: String,
            isShowElement: {
                type: Boolean,
                default: () => true
            },
            isFix: {
                type: Boolean,
                default: () => false
            },
            disabled: Boolean
        },
        data () {
            return {
                data: Number(this.value)
            }
        },
        methods: {
            defaultData () {
                if (this.value == null || this.value === 0) {
                    this.$emit('inputNumber', 1)
                }
            }
        },
        mounted () {
            this.defaultData()
        },
        watch: {
            value () {
                this.data = Number(this.value)
            }
        }
    }
</script>

<style scoped>
    .Lenght {
        width: 100%;
    }
</style>
