<!--
    ** 日期选择器  使用说明:
    在父组件中添加 <qqt-date-picker :timeStyle="timeStyle" :isDetail="isDetail" :scopeTime="scopeTime" :defaultTime="defaultTime" @getTime="getTime"></qqt-date-picker>

    ** 1. timeStyle表示选择的时间插件,每个值代表的不同时间选择插件:
            // 1:默认的  2: 带有快捷选项的
            // week:代表是周   year:选择年   month:选择月的   more: 多个日期的
            // scope:带有选择范围的   scope-quick:带有快捷操作的日期范围选择
            // scope-month:月范围选择    scope-month-1:带有快捷操作的日期范围选择
    ** 2. isDetail表示是否为详情页面,如果是详情页面则显示的是p标签
    ** 3. scopeTime是表示的是时间段,如果是时间段的时候将defaultTime设置为 '' 即可
    ** 4. defaultTime是显示详情或者编辑时传过来的数据
    ** 5. getTime是在父组件中定义的获取时间的方法
-->
<template>
    <div class="qqt-time-picker">
        <div class="input-group">
            <div v-if="isDetail">
                <p>{{ value }}</p>
            </div>
            <div v-else>
                <el-date-picker v-if="timeStyle === '1'"
                        v-model="value"
                        type="date"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd"
                        @blur="getTime">
                </el-date-picker>
                <el-date-picker v-if="timeStyle === '2'"
                        v-model="value"
                        type="date"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions"
                        @blur="getTime">
                </el-date-picker>
                <el-date-picker v-if="timeStyle === 'week'"
                        v-model="value"
                        type="week"
                        format="yyyy 第 WW 周"
                        value-format="yyyy 第 WW 周"
                        placeholder="选择周"
                        @blur="getTime">
                </el-date-picker>
                <el-date-picker v-if="timeStyle === 'year'"
                        v-model="value"
                        type="year"
                        value-format="yyyy"
                        placeholder="选择年"
                        @blur="getTime">
                </el-date-picker>
                <el-date-picker v-if="timeStyle === 'month'"
                        v-model="value"
                        type="month"
                        value-format="yyyy-MM"
                        placeholder="选择月"
                        @blur="getTime">
                </el-date-picker>
                <el-date-picker v-if="timeStyle === 'more'"
                        v-model="value"
                        type="dates"
                        value-format="yyyy-MM-dd"
                        placeholder="选择一个或多个日期"
                        @blur="getTime">
                </el-date-picker>
                <el-date-picker v-if="timeStyle === 'scope'"
                        v-model="value"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @blur="getTime">
                </el-date-picker>
                <el-date-picker v-if="timeStyle === 'scope-quick'"
                        v-model="value"
                        type="daterange"
                        align="right"
                        value-format="yyyy-MM-dd"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions"
                        @blur="getTime">
                </el-date-picker>
                <el-date-picker v-if="timeStyle === 'scope-month'"
                        v-model="value"
                        type="monthrange"
                        value-format="yyyy-MM"
                        range-separator="至"
                        start-placeholder="开始月份"
                        end-placeholder="结束月份"
                        @blur="getTime">
                </el-date-picker>
                <el-date-picker v-if="timeStyle === 'scope-month-1'"
                        v-model="value"
                        type="monthrange"
                        value-format="yyyy-MM"
                        range-separator="至"
                        start-placeholder="开始月份"
                        end-placeholder="结束月份"
                        :picker-options="pickerOptions"
                        @blur="getTime">
                </el-date-picker>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "qqt-date-picker",
        props: {
            timeStyle: String,
            // 是否显示详情
            isDetail: Boolean,
            defaultTime: String,
            scopeTime: Array
        },
        data () {
            return {
                value: '',
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },
            }
        },
        methods: {
            getTime (data) {
                // 在父级调用时设置一个getTime方法接受时间
                this.$emit('getTime', this.value)
            }
        },
        beforeUpdate () {
            if(!this.isDetail){
                // 不是详情页面说明是新增或者编辑页面
                if(this.defaultTime === ''){
                    //说明是时间段
                    this.value = this.scopeTime
                } else {
                    this.value = this.defaultTime
                }

            }
        }
    }
</script>

<style lang="scss">
.el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 100%;
}
</style>
