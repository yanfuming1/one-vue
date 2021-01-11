<!--

    ** 1.staticTime 是固定的几个时间点
       2.anyTime 是任意时间点(是在一段时间内的任意时间)
       3.anyTimeAll 可选择任意的时间范围
-->

<template>
    <div class="qqt-time-picker">
        <div class="input-group">
            <div v-if="isDetail">
                <p>{{ timeOptions.time }}</p>
            </div>
            <div v-else>
                <el-time-select v-if="timeStyle === 'staticTime'"
                        v-model="value"
                        :picker-options="timeOptions.staticTime"
                        value-format="HH:mm:ss"
                        placeholder="选择时间"
                        @blur="getTime">
                </el-time-select>
                <el-time-picker v-if="timeStyle === 'anyTime'"
                        v-model="value"
                        value-format="HH:mm:ss"
                        :picker-options="timeOptions.selectableRange"
                        placeholder="任意时间点"
                        @blur="getTime">
                </el-time-picker>
                <el-time-picker v-if="timeStyle === 'anyTimeAll'"
                        is-range
                        v-model="value"
                        value-format="HH:mm:ss"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        placeholder="选择时间范围"
                        @blur="getTime">
                </el-time-picker>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "qqt-time-picker",
        props: {
            isDetail: Boolean,
            timeStyle: String,
            timeOptions: {
                time: String,
                staticTime: {
                    start: String,
                    step: String,
                    end: String
                },
                selectableRange: String
            }
        },
        data () {
            return {
                value: ''
            }
        },
        methods: {
            getTime () {
                this.$emit('getTime', this.value)
            }
        },
        beforeUpdate() {

        }
    }
</script>

<style scoped>

</style>
